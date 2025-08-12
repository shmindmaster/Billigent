/*
 * ADLS Ops CLI: inventory, move-plan, copy-verify
 *
 * Auth: DefaultAzureCredential (az login / Managed Identity),
 *        or AZURE_STORAGE_CONNECTION_STRING fallback.
 *
 * Env:
 *  - STORAGE_ACCOUNT=billigentdevdlseus2
 *  - SOURCE_FILE_SYSTEM_BRONZE=bronze
 *  - TARGET_FILE_SYSTEM_DATA=data
 *  - RUN_ID=ops-YYYYMMDD-HHMMZ (optional; auto-generated if missing)
 */

import path from 'node:path';
import dotenv from 'dotenv';
// Load .env then .env.local (override)
dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), '.env.local'), override: true });

import { DataLakeServiceClient, StorageSharedKeyCredential } from "@azure/storage-file-datalake";
import { DefaultAzureCredential } from "@azure/identity";
import { createHash } from "crypto";
import { pipeline } from "stream";
import { promisify } from "util";
import { stringify } from "csv-stringify/sync";
import { promises as fsp } from "fs";

const streamPipeline = promisify(pipeline as any);

type PathRow = {
  source_fs: string;
  path: string;
  type: "file" | "directory";
  size?: number;
  lastModified?: string;
  etag?: string;
};

type MovePlanRow = {
  plan_id: string;
  source_fs: string;
  source_path: string;
  dest_fs: string;
  dest_path: string;
  action: "copy" | "noop";
  note?: string;
};

function env(name: string, fallback?: string): string {
  const v = process.env[name] ?? fallback;
  if (!v) throw new Error(`Missing env ${name}`);
  return v;
}

function nowRunId(): string {
  const d = new Date();
  const y = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  const hh = String(d.getUTCHours()).padStart(2, "0");
  const mi = String(d.getUTCMinutes()).padStart(2, "0");
  return `ops-${y}${mm}${dd}-${hh}${mi}Z`;
}

async function getService(): Promise<DataLakeServiceClient> {
  const account = env("STORAGE_ACCOUNT");
  const dfsEndpoint = `https://${account}.dfs.core.windows.net`;

  // Prefer Shared Key if provided (works well locally)
  const key = process.env["AZURE_STORAGE_KEY"];
  if (key) {
    console.log(`[adls-ops] Auth: SharedKey for account ${account}`);
    const cred = new StorageSharedKeyCredential(account, key);
    return new DataLakeServiceClient(dfsEndpoint, cred);
  }

  // Try DefaultAzureCredential next
  try {
    console.log(`[adls-ops] Auth: DefaultAzureCredential for ${dfsEndpoint}`);
    const cred = new DefaultAzureCredential();
    const client = new DataLakeServiceClient(dfsEndpoint, cred);
    await client.getProperties();
    return client;
  } catch (e) {
    const conn = process.env["AZURE_STORAGE_CONNECTION_STRING"];
    if (!conn) throw e;
    console.log(`[adls-ops] Auth: ConnectionString`);
    return DataLakeServiceClient.fromConnectionString(conn);
  }
}

async function listPaths(fsName: string): Promise<PathRow[]> {
  const svc = await getService();
  const fs = svc.getFileSystemClient(fsName);
  const out: PathRow[] = [];
  for await (const p of fs.listPaths({ recursive: true })) {
    out.push({
      source_fs: fsName,
      path: p.name ?? "",
      type: p.isDirectory ? "directory" : "file",
      size: (p.contentLength as number | undefined) ?? undefined,
      lastModified: p.lastModified?.toISOString(),
      etag: p.etag,
    });
  }
  return out;
}

function toCsv(rows: any[]): string {
  return stringify(rows, { header: true });
}

function norm(...parts: string[]): string {
  // join with single slashes and remove accidental double segments like 'cms/cms'
  const s = parts.join('/').replace(/\\+/g, '/').replace(/\/+/, '/');
  return s.replace(/\b(cms|huggingface|terminologies)\/\1\b/g, '$1');
}

function mapBronzeToData(p: string): string {
  let out: string;
  if (p.startsWith('bronze/')) {
    out = p;
  } else if (p.startsWith('cms/')) {
    out = `bronze/claims/cms/${p.substring(4)}`;
  } else if (p.startsWith('huggingface/')) {
    out = `bronze/ml-datasets/huggingface/${p.substring(11)}`;
  } else if (p.startsWith('terminologies/')) {
    out = `bronze/terminologies/${p.substring(13)}`;
  } else {
    out = `bronze/${p}`;
  }
  // collapse any accidental double slashes and duplicated terminal segment like '.../cms/cms/*'
  out = out.replace(/\/+/, '/');
  out = out.replace(/\b(cms|huggingface|terminologies)\/\1\//g, '$1/');
  return out;
}

async function uploadText(
  fsName: string,
  destPath: string,
  text: string
) {
  const svc = await getService();
  const fs = svc.getFileSystemClient(fsName);
  // Ensure parent directories exist (best-effort)
  const parts = destPath.split("/");
  for (let i = 0; i < parts.length - 1; i++) {
    const dir = parts.slice(0, i + 1).join("/");
    if (!dir) continue;
    try { await fs.getDirectoryClient(dir).createIfNotExists(); } catch {}
  }
  const file = fs.getFileClient(destPath);
  await file.create();
  const data = Buffer.from(text, "utf-8");
  await file.append(data, 0, data.length);
  await file.flush(data.length);
}

async function sha256OfFile(fsName: string, path: string): Promise<string> {
  const svc = await getService();
  const fs = svc.getFileSystemClient(fsName);
  const file = fs.getFileClient(path);
  const props = await file.getProperties();
  const len = props.contentLength ?? 0;
  const hash = createHash("sha256");

  let offset = 0;
  const chunk = 8 * 1024 * 1024; // 8MB chunks
  while (offset < len) {
    const count = Math.min(chunk, len - offset);
    const resp = await file.read(offset, count);
    const body = resp.readableStreamBody;
    if (body) {
      await streamPipeline(body, hash as any);
    }
    offset += count;
  }
  return hash.digest("hex");
}

async function cmdInventory() {
  const bronzeFS = env("SOURCE_FILE_SYSTEM_BRONZE", "bronze");
  const dataFS = env("TARGET_FILE_SYSTEM_DATA", "data");
  const runId = process.env["RUN_ID"] ?? nowRunId();
  const opsDir = `silver/catalog/_ops/${runId}`;

  const [bronze, data] = await Promise.all([
    listPaths(bronzeFS),
    listPaths(dataFS),
  ]);

  const rows = [...bronze, ...data];
  const csv = toCsv(rows);

  // write local artifact as well
  const localDir = path.resolve(process.cwd(), `.adls-ops/${runId}`);
  await fsp.mkdir(localDir, { recursive: true });
  await fsp.writeFile(path.join(localDir, `inventory_pre.csv`), csv, "utf8");

  // Upload inventory_pre.csv to data fs ops dir
  await uploadText(dataFS, `${opsDir}/inventory_pre.csv`, csv);
  console.log(`Wrote inventory_pre.csv to ${dataFS}/${opsDir}`);
  console.log(`[adls-ops] Local artifact: ${localDir}\\inventory_pre.csv`);
}

async function cmdMovePlan() {
  const bronzeFS = env("SOURCE_FILE_SYSTEM_BRONZE", "bronze");
  const dataFS = env("TARGET_FILE_SYSTEM_DATA", "data");
  const runId = process.env["RUN_ID"] ?? nowRunId();
  const opsDir = `silver/catalog/_ops/${runId}`;

  const bronze = await listPaths(bronzeFS);

  const plan: MovePlanRow[] = bronze
    .filter((r) => r.path && r.path.length > 0)
    .map((r) => {
      const isDir = r.type === "directory";
      if (isDir) {
        return {
          plan_id: runId,
          source_fs: bronzeFS,
          source_path: r.path,
          dest_fs: dataFS,
          dest_path: mapBronzeToData(r.path),
          action: "copy",
          note: "dir_placeholder",
        } as MovePlanRow;
      }
      return {
        plan_id: runId,
        source_fs: bronzeFS,
        source_path: r.path,
        dest_fs: dataFS,
        dest_path: mapBronzeToData(r.path),
        action: "copy",
      };
    });

  const csv = toCsv(plan);

  const localDir = path.resolve(process.cwd(), `.adls-ops/${runId}`);
  await fsp.mkdir(localDir, { recursive: true });
  await fsp.writeFile(path.join(localDir, `move_plan.csv`), csv, "utf8");

  await uploadText(dataFS, `${opsDir}/move_plan.csv`, csv);
  console.log(`Wrote move_plan.csv to ${dataFS}/${opsDir}`);
  console.log(`[adls-ops] Local artifact: ${localDir}\\move_plan.csv`);
}

async function ensureDir(fsName: string, dirPath: string) {
  const svc = await getService();
  const fs = svc.getFileSystemClient(fsName);
  await fs.getDirectoryClient(dirPath).createIfNotExists();
}

async function streamCopy(
  sourceFS: string,
  sourcePath: string,
  destFS: string,
  destPath: string
) {
  const svc = await getService();
  const sfs = svc.getFileSystemClient(sourceFS);
  const dfs = svc.getFileSystemClient(destFS);
  const src = sfs.getFileClient(sourcePath);
  const dst = dfs.getFileClient(destPath);

  // ensure parent directories
  const parent = destPath.split("/").slice(0, -1).join("/");
  if (parent) await ensureDir(destFS, parent);

  // If destination file already exists, skip writing; we'll still verify hashes later.
  let exists = false;
  try {
    await dst.getProperties();
    exists = true;
  } catch {
    exists = false;
  }

  if (!exists) {
    await dst.create();

    const props = await src.getProperties();
    const len = props.contentLength ?? 0;
    let offset = 0;
    const chunk = 8 * 1024 * 1024;
    while (offset < len) {
      const count = Math.min(chunk, len - offset);
      const resp = await src.read(offset, count);
      const body = resp.readableStreamBody;
      if (!body) break;

      // Buffer the chunk
      const buffers: Buffer[] = [];
      await new Promise<void>((resolve, reject) => {
        body.on("data", (d: Buffer) => buffers.push(d));
        body.on("error", reject);
        body.on("end", () => resolve());
      });
      const buf = Buffer.concat(buffers);

      await dst.append(buf, offset, buf.length);
      offset += buf.length;
    }
    await dst.flush(offset);
  }
}

async function cmdCopyVerify() {
  const bronzeFS = env("SOURCE_FILE_SYSTEM_BRONZE", "bronze");
  const dataFS = env("TARGET_FILE_SYSTEM_DATA", "data");
  const runId = process.env["RUN_ID"] ?? nowRunId();
  const opsDir = `silver/catalog/_ops/${runId}`;

  // Read plan we wrote earlier
  const planPath = `${opsDir}/move_plan.csv`;
  // For simplicity, fetch from ADLS as text
  const svc = await getService();
  const fs = svc.getFileSystemClient(dataFS);
  const planFile = fs.getFileClient(planPath);
  const dl = await planFile.read();
  const planCsv = await streamToString(dl.readableStreamBody);
  const rows = parseCsv(planCsv);

  const verRows: any[] = [];

  for (const row of rows) {
    if ((row.action ?? "") !== "copy") continue;
    const src = String(row.source_path);
    const dst = String(row.dest_path);

    // Determine if source is a file by probing props
    try {
      const svc2 = await getService();
      const sfs = svc2.getFileSystemClient(bronzeFS);
      const sfile = sfs.getFileClient(src);
      const props = await sfile.getProperties();
      if ((props.contentLength ?? 0) > 0 || props.contentType) {
        await streamCopy(bronzeFS, src, dataFS, dst);
        const srcHash = await sha256OfFile(bronzeFS, src).catch(() => "");
        const dstHash = await sha256OfFile(dataFS, dst).catch(() => "");
        const match = srcHash && dstHash && srcHash === dstHash;
        verRows.push({
          plan_id: runId,
          source_path: src,
          dest_path: dst,
          src_sha256: srcHash,
          dst_sha256: dstHash,
          match,
        });
      }
    } catch (e: any) {
      verRows.push({
        plan_id: runId,
        source_path: src,
        dest_path: dst,
        error: e?.message ?? String(e),
      });
    }
  }

  const csv = toCsv(verRows);

  const localDir = path.resolve(process.cwd(), `.adls-ops/${runId}`);
  await fsp.mkdir(localDir, { recursive: true });
  await fsp.writeFile(path.join(localDir, `copy_verify.csv`), csv, "utf8");

  await uploadText(dataFS, `${opsDir}/copy_verify.csv`, csv);
  console.log(`Wrote copy_verify.csv to ${dataFS}/${opsDir}`);
  console.log(`[adls-ops] Local artifact: ${localDir}\\copy_verify.csv`);
}

async function streamToString(body?: NodeJS.ReadableStream | null): Promise<string> {
  if (!body) return "";
  const chunks: Buffer[] = [];
  await new Promise<void>((resolve, reject) => {
    body.on("data", (d: Buffer) => chunks.push(d));
    body.on("error", reject);
    body.on("end", () => resolve());
  });
  return Buffer.concat(chunks).toString("utf-8");
}

function parseCsv(text: string): any[] {
  const lines = text.split(/\r?\n/).filter(Boolean);
  if (lines.length === 0) return [];
  const headers = splitCsvLine(lines[0]);
  const rows: any[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = splitCsvLine(lines[i]);
    const obj: any = {};
    headers.forEach((h, idx) => (obj[h] = cols[idx] ?? ""));
    rows.push(obj);
  }
  return rows;
}

function splitCsvLine(line: string): string[] {
  // Minimal CSV splitter (handles commas and quotes)
  const res: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (line[i + 1] === '"') { cur += '"'; i++; }
        else { inQuotes = false; }
      } else { cur += ch; }
    } else {
      if (ch === ',') { res.push(cur); cur = ""; }
      else if (ch === '"') { inQuotes = true; }
      else { cur += ch; }
    }
  }
  res.push(cur);
  return res;
}

async function main() {
  const cmd = process.argv[2];
  if (!cmd || ["inventory","move-plan","copy-verify"].indexOf(cmd) === -1) {
    console.log("Usage: tsx adls-ops.ts <inventory|move-plan|copy-verify>");
    process.exit(1);
  }
  if (cmd === "inventory") await cmdInventory();
  else if (cmd === "move-plan") await cmdMovePlan();
  else if (cmd === "copy-verify") await cmdCopyVerify();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
