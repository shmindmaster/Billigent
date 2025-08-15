import path from "node:path";
import fs from "fs/promises";
import { ALL_2025_SOURCES, Icd10SourceFile } from "./icd10cm-sources";
import { downloadFile, sha256File, nowIso, ensureDir } from "./icd10cm-util";

interface ManifestRow {
  id: string;
  original_filename: string;
  version_label: string;
  effective_range_start: string;
  effective_range_end: string | "";
  source_url: string;
  sha256: string;
  size_bytes: number;
  downloaded_at: string;
  content_type: string;
}

function toCsv(rows: ManifestRow[]): string {
  if (!rows.length) return "";
  const header = Object.keys(rows[0]).join(",");
  return [
    header,
    ...rows.map((r) =>
      Object.values(r)
        .map((v) => String(v).replace(/"/g, '""'))
        .join(",")
    ),
  ].join("\n");
}

function rowFrom(
  src: Icd10SourceFile,
  sha256: string,
  size: number
): ManifestRow {
  return {
    id: src.id,
    original_filename: src.filename,
    version_label: src.versionLabel,
    effective_range_start: src.effectiveStart,
    effective_range_end: src.effectiveEnd || "",
    source_url: src.url,
    sha256,
    size_bytes: size,
    downloaded_at: nowIso(),
    content_type: src.contentType || inferContentType(src.filename),
  };
}

function inferContentType(name: string): string {
  if (name.endsWith(".zip")) return "application/zip";
  if (name.endsWith(".pdf")) return "application/pdf";
  return "application/octet-stream";
}

async function main() {
  const baseDir = path.resolve(process.cwd(), "data-sources/icd10cm/2025/raw");
  await ensureDir(baseDir);
  const manifest: ManifestRow[] = [];
  for (const src of ALL_2025_SOURCES) {
    const dest = path.join(baseDir, src.filename);
    let exists = false;
    try {
      await fs.access(dest);
      exists = true;
    } catch {}
    if (exists) {
      const hash = await sha256File(dest);
      const stat = await fs.stat(dest);
      manifest.push(rowFrom(src, hash, stat.size));
      console.log(`[icd10cm-download] skip existing ${src.filename}`);
      continue;
    }
    console.log(`[icd10cm-download] downloading ${src.url}`);
    await downloadFile(src.url, dest);
    const hash = await sha256File(dest);
    const stat = await fs.stat(dest);
    manifest.push(rowFrom(src, hash, stat.size));
  }
  if (!manifest.length) {
    console.log("No files processed.");
    return;
  }
  const manifestDir = path.resolve(process.cwd(), "data-sources/icd10cm/2025");
  await ensureDir(manifestDir);
  await fs.writeFile(
    path.join(manifestDir, "manifest.csv"),
    toCsv(manifest),
    "utf8"
  );
  await fs.writeFile(
    path.join(manifestDir, "manifest.json"),
    JSON.stringify(manifest, null, 2),
    "utf8"
  );
  console.log(`[icd10cm-download] Wrote manifest entries=${manifest.length}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
