import { createHash } from "crypto";
import * as fs from "fs/promises";
import path from "node:path";
import { pipeline } from "stream/promises";
import { createWriteStream } from "fs";
// unzipper lacks bundled types; declare minimal shape
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as unzipper from "unzipper";

export async function sha256File(filePath: string): Promise<string> {
  const hash = createHash("sha256");
  const data = await fs.readFile(filePath);
  hash.update(data);
  return hash.digest("hex");
}

export async function ensureDir(dir: string) {
  await fs.mkdir(dir, { recursive: true });
}

export async function downloadFile(url: string, destPath: string) {
  const res = await fetch(url);
  if (!res.ok || !res.body)
    throw new Error(`Failed download ${url}: ${res.status} ${res.statusText}`);
  await ensureDir(path.dirname(destPath));
  const file = createWriteStream(destPath);
  await pipeline(res.body as any, file);
}

export async function unzipAll(
  zipPath: string,
  outDir: string
): Promise<string[]> {
  await ensureDir(outDir);
  const entries: string[] = [];
  // unzipper handles streams; ensure file exists
  const directory = await unzipper.Open.file(zipPath);
  await Promise.all(
    directory.files.map(async (file: any) => {
      if (file.type !== "File") return;
      const dest = path.join(outDir, file.path.replace(/\\/g, "/"));
      await ensureDir(path.dirname(dest));
      const content = await file.buffer();
      await fs.writeFile(dest, content);
      entries.push(dest);
    })
  );
  return entries;
}

export async function readTextFileIfExists(p: string): Promise<string | null> {
  try {
    const data = await fs.readFile(p, "utf8");
    return normalizeLineEndings(data);
  } catch {
    return null;
  }
}

export function csvEscape(v: string): string {
  if (v.includes(",") || v.includes("\n") || v.includes('"')) {
    return '"' + v.replace(/"/g, '""') + '"';
  }
  return v;
}

export function toCsv(header: string[], rows: string[][]): string {
  return [
    header.join(","),
    ...rows.map((r) => r.map(csvEscape).join(",")),
  ].join("\n");
}

export function nowIso(): string {
  return new Date().toISOString();
}

export function normalizeLineEndings(text: string): string {
  return text.replace(/\r\n/g, "\n");
}

export interface NormalizedCodeRow {
  code: string;
  short_title: string;
  long_title: string;
  chapter: string;
  chapter_name: string;
  block: string;
  block_range: string;
  effective_start: string;
  effective_end: string | "";
  addendum_status: string;
  description_changed: "Y" | "N";
  source_version: string;
  source_url: string;
  hash: string;
  /** Aggregated diagnostic context (includes/excludes/notes etc.) captured during XML parse */
  context_notes: string;
  /** Hash of context_notes alone for differential diagnostics */
  context_hash: string;
  is_cc: "";
  is_mcc: "";
  hcc_list: "";
  ingested_at: string;
}
