import path from "node:path";
import fs from "fs/promises";
import { createHash } from "crypto";
import {
  nowIso,
  ensureDir,
  NormalizedCodeRow,
  unzipAll,
  readTextFileIfExists,
} from "./icd10cm-util";
import * as fsSync from "fs";

function sha256(text: string) {
  const h = createHash("sha256");
  h.update(text);
  return h.digest("hex");
}
function escapeCsv(v: string) {
  if (v.includes(",") || v.includes('"') || v.includes("\n"))
    return '"' + v.replace(/"/g, '""') + '"';
  return v;
}
function serializeRow(r: NormalizedCodeRow) {
  return Object.values(r)
    .map((v) => escapeCsv(String(v)))
    .join(",");
}

function placeholderRow(reason: string): NormalizedCodeRow {
  const longTitle = `Placeholder – real parse pending (${reason})`;
  return {
    code: "Z00.00",
    short_title: "Placeholder",
    long_title: longTitle,
    chapter: "00",
    chapter_name: "Placeholder Chapter",
    block: "Z00",
    block_range: "Z00-Z01",
    effective_start: "2024-10-01",
    effective_end: "",
    addendum_status: "base",
    description_changed: "N",
    source_version: "FY2025",
    source_url: "https://www.cms.gov/",
    hash: sha256("Z00.00|" + longTitle),
    context_notes: "",
    context_hash: sha256(""),
    is_cc: "",
    is_mcc: "",
    hcc_list: "",
    ingested_at: nowIso(),
  };
}

interface ParsedContext {
  currentChapter: string;
  currentChapterName: string;
  currentBlock: string;
  currentBlockRange: string;
}

// Heuristic regexes for optional TXT fallback
const chapterHeaderRe = /^Chapter\s+([0-9A-Z]+)\s+[—-]\s+(.*)$/i;
const blockHeaderRe = /^([A-Z0-9]{3,4})[-–]([A-Z0-9]{3,4})\s+(.*)$/;
const codeLineRe = /^([A-Z][0-9][0-9A-Z](?:\.[0-9A-Z]{1,4})?)\s+(.*)$/;
const continuationRe = /^(?:\s{2,}|\t)(.+)$/;

function parseTabularLines(
  lines: string[],
  sourceVersion: string
): NormalizedCodeRow[] {
  const rows: NormalizedCodeRow[] = [];
  const ctx: ParsedContext = {
    currentChapter: "",
    currentChapterName: "",
    currentBlock: "",
    currentBlockRange: "",
  };
  let pending: NormalizedCodeRow | null = null;
  const flushPending = () => {
    if (pending) {
      pending.hash = sha256(pending.code + "|" + pending.long_title);
      rows.push(pending);
      pending = null;
    }
  };
  for (const raw of lines) {
    const line = raw.replace(/\r?\n?$/, "");
    const trimmed = line.trim();
    if (!trimmed) continue;
    const chap = trimmed.match(chapterHeaderRe);
    if (chap) {
      flushPending();
      ctx.currentChapter = chap[1];
      ctx.currentChapterName = chap[2];
      continue;
    }
    const block = trimmed.match(blockHeaderRe);
    if (block) {
      flushPending();
      ctx.currentBlock = block[1];
      ctx.currentBlockRange = `${block[1]}-${block[2]}`;
      continue;
    }
    const codeM = trimmed.match(codeLineRe);
    if (codeM) {
      flushPending();
      const code = codeM[1];
      const longTitle = codeM[2].trim();
      pending = {
        code,
        short_title: longTitle.slice(0, 60),
        long_title: longTitle,
        chapter: ctx.currentChapter,
        chapter_name: ctx.currentChapterName,
        block: ctx.currentBlock,
        block_range: ctx.currentBlockRange,
        effective_start: "2024-10-01",
        effective_end: "",
        addendum_status: sourceVersion.includes("April") ? "april" : "base",
        description_changed: "N",
        source_version: sourceVersion,
        source_url: "https://www.cms.gov/",
        hash: sha256(code + "|" + longTitle),
        context_notes: "",
        context_hash: sha256(""),
        is_cc: "",
        is_mcc: "",
        hcc_list: "",
        ingested_at: nowIso(),
      };
      continue;
    }
    if (pending) {
      const cont = line.match(continuationRe);
      if (cont) {
        const frag = cont[1].trim();
        if (frag) {
          pending.long_title += " " + frag.replace(/\s+/g, " ");
          pending.short_title = pending.long_title.slice(0, 60);
        }
        continue;
      }
    }
  }
  flushPending();
  return rows;
}

async function extractIfNeeded(
  rawDir: string,
  workDir: string
): Promise<string[]> {
  const extractedMarker = path.join(workDir, ".extracted.v1");
  const outputs: string[] = [];
  try {
    await fs.access(extractedMarker);
    return outputs;
  } catch {}
  const entries = await fs.readdir(rawDir);
  for (const f of entries) {
    if (f.endsWith(".zip")) {
      const full = path.join(rawDir, f);
      const outSub = path.join(workDir, f.replace(/\.zip$/i, ""));
      console.log(`[icd10cm-parse] extracting ${f}`);
      const files = await unzipAll(full, outSub);
      outputs.push(...files);
    }
  }
  await fs.writeFile(extractedMarker, nowIso(), "utf8");
  return outputs;
}

interface ChangeLogEntry {
  code: string;
  change_type: "added" | "deleted" | "modified";
  old_long_title: string;
  new_long_title: string;
  old_context_notes: string;
  new_context_notes: string;
  change_reason: "title" | "context" | "title+context";
  effective_start: string;
  effective_end: string | "";
}

function buildChangeLog(
  base: Map<string, NormalizedCodeRow>,
  april: Map<string, NormalizedCodeRow>
): ChangeLogEntry[] {
  const changes: ChangeLogEntry[] = [];
  for (const [code, row] of april.entries()) {
    if (!base.has(code)) {
      changes.push({
        code,
        change_type: "added",
        old_long_title: "",
        new_long_title: row.long_title,
        old_context_notes: "",
        new_context_notes: row.context_notes || "",
        change_reason: row.context_notes ? "title+context" : "title",
        effective_start: "2025-04-01",
        effective_end: "",
      });
    } else {
      const prior = base.get(code)!;
      const titleChanged = prior.long_title !== row.long_title;
      const contextChanged = prior.context_notes !== row.context_notes;
      if (titleChanged || contextChanged) {
        changes.push({
          code,
          change_type: "modified",
          old_long_title: prior.long_title,
          new_long_title: row.long_title,
          old_context_notes: prior.context_notes || "",
          new_context_notes: row.context_notes || "",
          change_reason:
            titleChanged && contextChanged
              ? "title+context"
              : titleChanged
              ? "title"
              : "context",
          effective_start: "2025-04-01",
          effective_end: "",
        });
      }
    }
  }
  for (const [code, row] of base.entries()) {
    if (!april.has(code)) {
      changes.push({
        code,
        change_type: "deleted",
        old_long_title: row.long_title,
        new_long_title: "",
        old_context_notes: row.context_notes || "",
        new_context_notes: "",
        change_reason: row.context_notes ? "title+context" : "title",
        effective_start: row.effective_start,
        effective_end: "2025-03-31",
      });
    }
  }
  changes.sort((a, b) => a.code.localeCompare(b.code));
  return changes;
}

function applyAprilOverlay(
  baseRows: NormalizedCodeRow[],
  aprilRows: NormalizedCodeRow[],
  changeLog: ChangeLogEntry[]
): NormalizedCodeRow[] {
  const byCode = new Map<string, NormalizedCodeRow>();
  for (const r of baseRows) byCode.set(r.code, { ...r });
  const modifiedSet = new Set(
    changeLog.filter((c) => c.change_type === "modified").map((c) => c.code)
  );
  const addedSet = new Set(
    changeLog.filter((c) => c.change_type === "added").map((c) => c.code)
  );
  const deletedSet = new Set(
    changeLog.filter((c) => c.change_type === "deleted").map((c) => c.code)
  );
  for (const code of deletedSet) {
    const r = byCode.get(code);
    if (r) r.effective_end = "2025-03-31";
  }
  for (const april of aprilRows) {
    if (addedSet.has(april.code)) {
      const clone = { ...april };
      clone.effective_start = "2025-04-01";
      clone.addendum_status = "april";
      byCode.set(april.code, clone);
    } else if (modifiedSet.has(april.code)) {
      const existing = byCode.get(april.code);
      if (existing) {
        existing.long_title = april.long_title;
        existing.short_title = april.long_title.slice(0, 60);
        existing.description_changed = "Y";
        existing.addendum_status = "april";
        existing.context_notes = april.context_notes;
        existing.context_hash = april.context_hash;
        existing.hash = sha256(
          existing.code +
            "|" +
            existing.long_title +
            "|" +
            existing.context_notes
        );
      }
    }
  }
  return Array.from(byCode.values());
}

function validateDataset(rows: NormalizedCodeRow[]): { issues: string[] } {
  const issues: string[] = [];
  const seen = new Set<string>();
  for (const r of rows) {
    if (seen.has(r.code)) issues.push(`duplicate code ${r.code}`);
    else seen.add(r.code);
    if (!r.chapter) issues.push(`missing chapter for ${r.code}`);
    if (!r.long_title) issues.push(`empty title for ${r.code}`);
  }
  return { issues };
}

async function main() {
  const rawDir = path.resolve(process.cwd(), "data-sources/icd10cm/2025/raw");
  const workDir = path.resolve(process.cwd(), "data-sources/icd10cm/2025/work");
  const normDir = path.resolve(
    process.cwd(),
    "data-sources/icd10cm/2025/normalized"
  );
  await ensureDir(workDir);
  await ensureDir(normDir);
  const haveRaw = fsSync.existsSync(rawDir);
  let rows: NormalizedCodeRow[] = [];
  let changeLog: ChangeLogEntry[] = [];
  if (!haveRaw) {
    console.warn(
      "[icd10cm-parse] raw directory missing – generating placeholder"
    );
    rows = [placeholderRow("raw-missing")];
  } else {
    await extractIfNeeded(rawDir, workDir);
    // Discover potential TXT tabular files (fallback) and XML files (preferred)
    const candidateTxt: string[] = [];
    const recurseTxt = async (dir: string) => {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      for (const e of entries) {
        const full = path.join(dir, e.name);
        if (e.isDirectory()) await recurseTxt(full);
        else if (/tabular/i.test(e.name) && e.name.endsWith(".txt"))
          candidateTxt.push(full);
      }
    };
    await recurseTxt(workDir);
    if (!candidateTxt.length) {
      // XML branch
      const candidateXml: string[] = [];
      const findXml = async (dir: string) => {
        const entries = await fs.readdir(dir, { withFileTypes: true });
        for (const e of entries) {
          const full = path.join(dir, e.name);
          if (e.isDirectory()) await findXml(full);
          else if (/icd10cm_tabular_2025\.xml$/i.test(e.name))
            candidateXml.push(full);
        }
      };
      await findXml(workDir);
      if (!candidateXml.length) {
        console.warn(
          "[icd10cm-parse] no XML tabular file found – placeholder row only"
        );
        rows = [placeholderRow("no-xml-tabular")];
      } else {
        const baseXmlPath =
          candidateXml.find((p) => !/april/i.test(p)) || candidateXml[0];
        const aprilXmlPath = candidateXml.find((p) => /april/i.test(p));
        function decodeEntities(s: string) {
          return s
            .replace(/&amp;/g, "&")
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">")
            .replace(/&apos;/g, "'")
            .replace(/&quot;/g, '"');
        }
        interface SectionCtx {
          range: string;
          desc: string;
        }
        interface ChapterCtx {
          num: string;
          name: string;
        }
        const diagCodePattern = /^[A-Z][0-9][0-9A-Z](?:\.[0-9A-Z]{1,4})?$/;
        const tagRe =
          /<(chapter|section|diag)\b[^>]*>|<\/(chapter|section|diag)>|<name>([^<]+)<\/name>|<desc>([^<]+)<\/desc>|<(includes|excludes1|excludes2|note|sevenChrNote)[^>]*>([\s\S]*?)<\/(includes|excludes1|excludes2|note|sevenChrNote)>/g;
        function parseXml(
          xml: string,
          versionLabel: string
        ): NormalizedCodeRow[] {
          xml = xml.replace(/\r\n?/g, "\n");
          const stack: string[] = [];
          let currentChapter: ChapterCtx | undefined;
          let currentSection: SectionCtx | undefined;
          let pendingDiag: {
            code?: string;
            title?: string;
            notes: string[];
          } | null = null;
          const out: NormalizedCodeRow[] = [];
          let m: RegExpExecArray | null;
          while ((m = tagRe.exec(xml))) {
            if (m[1]) {
              const tag = m[1];
              stack.push(tag);
              if (tag === "diag") pendingDiag = { notes: [] };
              continue;
            }
            if (m[2]) {
              const tag = m[2];
              while (stack.length && stack[stack.length - 1] !== tag)
                stack.pop();
              stack.pop();
              if (
                tag === "diag" &&
                pendingDiag &&
                pendingDiag.code &&
                pendingDiag.title
              ) {
                const code = pendingDiag.code.trim();
                const title = pendingDiag.title.trim();
                if (diagCodePattern.test(code)) {
                  const block = code.slice(0, 3);
                  const blockRange = currentSection?.range || block;
                  const contextNotes = pendingDiag.notes
                    .map((n) => n.trim())
                    .filter(Boolean)
                    .join(" | ");
                  const contextHash = sha256(contextNotes);
                  const hashBasis = code + "|" + title + "|" + contextNotes;
                  out.push({
                    code,
                    short_title: title.slice(0, 60),
                    long_title: title,
                    chapter: currentChapter?.num || "",
                    chapter_name: currentChapter?.name || "",
                    block,
                    block_range: blockRange,
                    effective_start: versionLabel.includes("April")
                      ? "2025-04-01"
                      : "2024-10-01",
                    effective_end: "",
                    addendum_status: versionLabel.includes("April")
                      ? "april"
                      : "base",
                    description_changed: "N",
                    source_version: versionLabel,
                    source_url: "https://www.cms.gov/",
                    hash: sha256(hashBasis),
                    context_notes: contextNotes,
                    context_hash: contextHash,
                    is_cc: "",
                    is_mcc: "",
                    hcc_list: "",
                    ingested_at: nowIso(),
                  });
                }
              }
              if (tag === "diag") pendingDiag = null;
              continue;
            }
            // Name / desc capture
            if (m[3]) {
              const text = decodeEntities(m[3].trim());
              const ctxTop = stack[stack.length - 1];
              if (ctxTop === "chapter") {
                const numMatch = text.match(/Chapter\s+([0-9A-Z]+)/i);
                currentChapter = {
                  num: numMatch ? numMatch[1] : text,
                  name: currentChapter?.name || text,
                };
              } else if (ctxTop === "section") {
                const rng = text.match(/([A-Z0-9]{3,4}\s?-\s?[A-Z0-9]{3,4})/);
                currentSection = {
                  range: rng ? rng[1].replace(/\s*/g, "") : text,
                  desc: currentSection?.desc || text,
                };
              } else if (ctxTop === "diag" && pendingDiag) {
                pendingDiag.code = text;
              }
              continue;
            }
            if (m[4]) {
              const text = decodeEntities(m[4].trim());
              const ctxTop = stack[stack.length - 1];
              if (ctxTop === "chapter") {
                if (currentChapter) currentChapter.name = text;
                else currentChapter = { num: "", name: text };
              } else if (ctxTop === "section") {
                if (currentSection) currentSection.desc = text;
                else currentSection = { range: "", desc: text };
              } else if (ctxTop === "diag" && pendingDiag) {
                pendingDiag.title = text;
              }
              continue;
            }
            // Notes / includes / excludes groups
            if (m[5] && m[7]) {
              // m[5] = opening type, m[6] (unused), m[7] = closing type, group 6 due to regex grouping shift
              const rawNote = decodeEntities(m[6] || "");
              if (pendingDiag)
                pendingDiag.notes.push(rawNote.replace(/\s+/g, " ").trim());
              continue;
            }
          }
          return out;
        }
        async function loadXml(p?: string) {
          if (!p) return null;
          return (await readTextFileIfExists(p)) || null;
        }
        const baseXml = await loadXml(baseXmlPath);
        const aprilXml = await loadXml(aprilXmlPath);
        if (!baseXml) {
          rows = [placeholderRow("base-xml-missing")];
        } else {
          const baseRows = parseXml(baseXml, "FY2025");
          if (aprilXml) {
            const aprilRows = parseXml(aprilXml, "FY2025-April");
            const baseMap = new Map(baseRows.map((r) => [r.code, r]));
            const aprilMap = new Map(aprilRows.map((r) => [r.code, r]));
            changeLog = buildChangeLog(baseMap, aprilMap);
            rows = applyAprilOverlay(baseRows, aprilRows, changeLog);
            // --- Diagnostics to understand April overlay effectiveness ---
            try {
              const baseOnly: string[] = [];
              const aprilOnly: string[] = [];
              const modified: string[] = [];
              for (const [code, bRow] of baseMap.entries()) {
                if (!aprilMap.has(code)) baseOnly.push(code);
                else {
                  const aRow = aprilMap.get(code)!;
                  if (aRow.long_title !== bRow.long_title) modified.push(code);
                }
              }
              for (const code of aprilMap.keys()) {
                if (!baseMap.has(code)) aprilOnly.push(code);
              }
              const diagPath = path.join(
                normDir,
                "april_overlay_diagnostics.json"
              );
              await fs.writeFile(
                diagPath,
                JSON.stringify(
                  {
                    base_xml_path: baseXmlPath,
                    april_xml_path: aprilXmlPath,
                    base_row_count: baseRows.length,
                    april_row_count: aprilRows.length,
                    change_log_entries: changeLog.length,
                    base_only_count: baseOnly.length,
                    april_only_count: aprilOnly.length,
                    modified_count: modified.length,
                    sample_base_only: baseOnly.slice(0, 25),
                    sample_april_only: aprilOnly.slice(0, 25),
                    sample_modified: modified.slice(0, 25),
                    generated_at: nowIso(),
                  },
                  null,
                  2
                ),
                "utf8"
              );
              console.log(
                `[icd10cm-parse] diagnostics base=${baseRows.length} april=${aprilRows.length} added=${aprilOnly.length} removed=${baseOnly.length} modified=${modified.length}`
              );
              if (aprilXmlPath && changeLog.length === 0) {
                console.warn(
                  "[icd10cm-parse] WARNING: April XML detected but no change log entries produced – see april_overlay_diagnostics.json for investigation"
                );
              }
            } catch (diagErr) {
              console.warn(
                "[icd10cm-parse] failed writing diagnostics",
                diagErr
              );
            }
          } else rows = baseRows;
          if (!rows.length) rows = [placeholderRow("xml-parse-empty")];
        }
      }
    } else {
      // TXT fallback parsing
      const basePath =
        candidateTxt.find((p) => !/april/i.test(p)) || candidateTxt[0];
      const aprilPath = candidateTxt.find((p) => /april/i.test(p));
      const baseText = await readTextFileIfExists(basePath || "");
      if (!baseText) {
        rows = [placeholderRow("empty-tabular")];
      } else {
        const baseRows = parseTabularLines(baseText.split("\n"), "FY2025");
        if (aprilPath) {
          const aprilText = await readTextFileIfExists(aprilPath);
          if (aprilText) {
            const aprilRows = parseTabularLines(
              aprilText.split("\n"),
              "FY2025-April"
            );
            const baseMap = new Map(baseRows.map((r) => [r.code, r]));
            const aprilMap = new Map(aprilRows.map((r) => [r.code, r]));
            changeLog = buildChangeLog(baseMap, aprilMap);
            rows = applyAprilOverlay(baseRows, aprilRows, changeLog);
          } else {
            rows = baseRows;
          }
        } else {
          rows = baseRows;
        }
        if (!rows.length) rows = [placeholderRow("parse-empty")];
      }
    }
  }
  rows.sort((a, b) => a.code.localeCompare(b.code));
  const datasetHash = sha256(rows.map((r) => r.hash).join("|"));
  const header = Object.keys(rows[0] || {}).join(",");
  const csv = [header, ...rows.map((r) => serializeRow(r))].join("\n");
  await fs.writeFile(path.join(normDir, "icd10cm_2025.csv"), csv, "utf8");
  if (changeLog.length) {
    const chHeader = [
      "code",
      "change_type",
      "old_long_title",
      "new_long_title",
      "old_context_notes",
      "new_context_notes",
      "change_reason",
      "effective_start",
      "effective_end",
    ].join(",");
    const chCsv = [
      chHeader,
      ...changeLog.map((c) =>
        [
          c.code,
          c.change_type,
          c.old_long_title.replace(/"/g, '""'),
          c.new_long_title.replace(/"/g, '""'),
          (c.old_context_notes || "").replace(/"/g, '""'),
          (c.new_context_notes || "").replace(/"/g, '""'),
          c.change_reason,
          c.effective_start,
          c.effective_end,
        ]
          .map((v) => escapeCsv(String(v)))
          .join(",")
      ),
    ].join("\n");
    await fs.writeFile(path.join(normDir, "change_log.csv"), chCsv, "utf8");
    await fs.writeFile(
      path.join(normDir, "change_log.json"),
      JSON.stringify(changeLog, null, 2),
      "utf8"
    );
  }
  const validation = validateDataset(rows);
  await fs.writeFile(
    path.join(normDir, "validation_report.json"),
    JSON.stringify(
      {
        issues: validation.issues,
        issue_count: validation.issues.length,
        generated_at: nowIso(),
      },
      null,
      2
    ),
    "utf8"
  );
  await fs.writeFile(
    path.join(normDir, "parsing_version.json"),
    JSON.stringify(
      {
        parser: "icd10cm-parse.ts",
        version: 1,
        features: [
          "multi-line",
          "april-overlay",
          "change-log",
          "basic-validation",
          "xml-tabular",
        ],
        generated_at: nowIso(),
      },
      null,
      2
    ),
    "utf8"
  );
  await fs.writeFile(
    path.join(normDir, "icd10cm_2025.summary.json"),
    JSON.stringify(
      {
        total: rows.length,
        dataset_hash: datasetHash,
        change_log_entries: changeLog.length,
        generated_at: nowIso(),
        notes:
          rows[0] && rows[0].short_title === "Placeholder"
            ? "Placeholder output – refine parsing and integrate addendum/April update."
            : "Parsed output with April overlay – heuristic XML extraction; needs deeper validation.",
      },
      null,
      2
    ),
    "utf8"
  );
  console.log(`[icd10cm-parse] Wrote normalized dataset rows=${rows.length}`);
  if (changeLog.length)
    console.log(`[icd10cm-parse] change log entries=${changeLog.length}`);
  if (validation.issues.length)
    console.warn(
      `[icd10cm-parse] validation issues=${validation.issues.length}`
    );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
