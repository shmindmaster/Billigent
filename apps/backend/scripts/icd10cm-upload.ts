/**
 * ICD-10-CM Upload Script
 *
 * Moves locally staged raw + normalized artifacts into Azure Data Lake (bronze/raw & curated) when enabled.
 *
 * Env Vars:
 *  STORAGE_ACCOUNT              (required) storage account name
 *  AZURE_STORAGE_KEY / or DefaultAzureCredential / or AZURE_STORAGE_CONNECTION_STRING (auth chain)
 *  ICD10_RAW_FS=bronze          (filesystem for raw artifacts)
 *  ICD10_CURATED_FS=data        (filesystem for curated artifacts)
 *  ICD10_YEAR=2025
 *  INGEST_UPLOAD=1              (must be set to perform upload)
 *  INGEST_KEEP_LOCAL=0|1        (default 1; if 0 cleans raw/work after success)
 *  INGEST_PREFIX=bronze/terminologies/icd10cm (logical root path prefix inside raw fs)
 *  INGEST_PREFIX_CURATED=silver/terminologies/icd10cm (logical path inside curated fs)
 */

import path from "node:path";
import fs from "fs/promises";
import * as fsSync from "fs";
import {
  DataLakeServiceClient,
  StorageSharedKeyCredential,
} from "@azure/storage-file-datalake";
import { DefaultAzureCredential } from "@azure/identity";
import { createHash } from "crypto";

function env(name: string, fallback?: string): string {
  const v = process.env[name] ?? fallback;
  if (v === undefined || v === null || v === "")
    throw new Error(`Missing env ${name}`);
  return v;
}

async function getService(): Promise<DataLakeServiceClient> {
  const account = env("STORAGE_ACCOUNT");
  const dfsEndpoint = `https://${account}.dfs.core.windows.net`;
  const key = process.env.AZURE_STORAGE_KEY;
  if (key) {
    return new DataLakeServiceClient(
      dfsEndpoint,
      new StorageSharedKeyCredential(account, key)
    );
  }
  try {
    const cred = new DefaultAzureCredential();
    const client = new DataLakeServiceClient(dfsEndpoint, cred);
    await client.getProperties();
    return client;
  } catch (e) {
    const cs = process.env.AZURE_STORAGE_CONNECTION_STRING;
    if (!cs) throw e;
    return DataLakeServiceClient.fromConnectionString(cs);
  }
}

async function ensureDir(
  fsClient: ReturnType<DataLakeServiceClient["getFileSystemClient"]>,
  dir: string
) {
  if (!dir) return;
  const parts = dir.split("/");
  for (let i = 1; i <= parts.length; i++) {
    const sub = parts.slice(0, i).join("/");
    try {
      await fsClient.getDirectoryClient(sub).createIfNotExists();
    } catch {}
  }
}

async function uploadFile(
  fsClient: ReturnType<DataLakeServiceClient["getFileSystemClient"]>,
  localPath: string,
  destPath: string
) {
  const stat = await fs.stat(localPath);
  if (!stat.isFile()) return;
  const fileClient = fsClient.getFileClient(destPath);
  // quick skip if remote size matches
  try {
    const props = await fileClient.getProperties();
    if (props.contentLength === stat.size) {
      return; // assume match (hash later if needed)
    }
  } catch {}
  await ensureDir(fsClient, destPath.split("/").slice(0, -1).join("/"));
  await fileClient.create();
  const data = await fs.readFile(localPath);
  await fileClient.append(data, 0, data.length);
  await fileClient.flush(data.length);
}

async function sha256Local(p: string): Promise<string> {
  const h = createHash("sha256");
  h.update(await fs.readFile(p));
  return h.digest("hex");
}

async function collectLocalFiles(dir: string): Promise<string[]> {
  const out: string[] = [];
  async function walk(d: string) {
    let ents: any[] = [];
    try {
      ents = await fs.readdir(d, { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of ents) {
      const full = path.join(d, e.name);
      if (e.isDirectory()) await walk(full);
      else out.push(full);
    }
  }
  await walk(dir);
  return out;
}

function relUnix(base: string, full: string): string {
  return full.substring(base.length).replace(/\\/g, "/").replace(/^\//, "");
}

async function main() {
  if (!process.env.INGEST_UPLOAD) {
    console.log("[icd10cm-upload] INGEST_UPLOAD not set; skipping.");
    return;
  }
  const year = env("ICD10_YEAR", "2025");
  const rawFs = env("ICD10_RAW_FS", "bronze");
  const curatedFs = env("ICD10_CURATED_FS", "data");
  const prefix = env("INGEST_PREFIX", "bronze/terminologies/icd10cm");
  const curatedPrefix = env(
    "INGEST_PREFIX_CURATED",
    "silver/terminologies/icd10cm"
  );
  const svc = await getService();
  const rawFSClient = svc.getFileSystemClient(rawFs);
  const curatedFSClient = svc.getFileSystemClient(curatedFs);

  const localRoot = path.resolve(process.cwd(), "data-sources/icd10cm", year);
  const rawLocal = path.join(localRoot, "raw");
  const normLocal = path.join(localRoot, "normalized");

  if (!fsSync.existsSync(localRoot)) {
    throw new Error(`Local ICD10 path missing: ${localRoot}`);
  }

  // Upload raw ZIPs & PDFs only
  if (fsSync.existsSync(rawLocal)) {
    const rawFiles = (await fs.readdir(rawLocal)).filter((f) =>
      /\.(zip|pdf)$/i.test(f)
    );
    for (const f of rawFiles) {
      const lp = path.join(rawLocal, f);
      const dest = `${prefix}/${year}/source/${f}`;
      console.log(`[icd10cm-upload] raw -> ${rawFs}:${dest}`);
      await uploadFile(rawFSClient, lp, dest);
    }
  } else {
    console.warn("[icd10cm-upload] no raw directory present");
  }

  // Upload manifest if present
  for (const mf of ["manifest.csv", "manifest.json"]) {
    const lp = path.join(localRoot, mf);
    if (fsSync.existsSync(lp)) {
      const dest = `${prefix}/${year}/${mf}`;
      console.log(`[icd10cm-upload] manifest -> ${rawFs}:${dest}`);
      await uploadFile(rawFSClient, lp, dest);
    }
  }

  // Upload normalized artifacts
  if (fsSync.existsSync(normLocal)) {
    const normFiles = await collectLocalFiles(normLocal);
    for (const f of normFiles) {
      const rel = relUnix(normLocal, f);
      const dest = `${curatedPrefix}/${year}/${rel}`;
      console.log(`[icd10cm-upload] normalized -> ${curatedFs}:${dest}`);
      await uploadFile(curatedFSClient, f, dest);
    }
  } else {
    console.warn("[icd10cm-upload] no normalized directory present");
  }

  // Optional cleanup
  if (process.env.INGEST_KEEP_LOCAL === "0") {
    try {
      await fs.rm(rawLocal, { recursive: true, force: true });
    } catch {}
    try {
      await fs.rm(path.join(localRoot, "work"), {
        recursive: true,
        force: true,
      });
    } catch {}
    console.log("[icd10cm-upload] cleaned local raw/work");
  }

  // Optional integrity manifest combining dataset hash + file hashes
  const normCsv = path.join(normLocal, `icd10cm_${year}.csv`);
  if (fsSync.existsSync(normCsv)) {
    const datasetHash = await sha256Local(normCsv);
    const meta = {
      dataset_hash: datasetHash,
      generated_at: new Date().toISOString(),
    };
    const metaPath = path.join(normLocal, "dataset_hash.json");
    await fs.writeFile(metaPath, JSON.stringify(meta, null, 2), "utf8");
    const dest = `${curatedPrefix}/${year}/dataset_hash.json`;
    console.log(`[icd10cm-upload] dataset_hash.json -> ${curatedFs}:${dest}`);
    await uploadFile(curatedFSClient, metaPath, dest);
  }

  console.log("[icd10cm-upload] complete");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
