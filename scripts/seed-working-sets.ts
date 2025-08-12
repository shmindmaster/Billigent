/*
 Seed/refresh job for working sets and denial-ready facts
 - Reads only _current Parquet/CSV snapshots from ADLS silver layer
 - Idempotent upserts, per-table transaction with logging into OpsRunHistory
 - Delta detection via DatasetVersion using schema/content hash
*/

import { BlobServiceClient } from "@azure/storage-blob";
import { DefaultAzureCredential, ManagedIdentityCredential } from "@azure/identity";
import { SecretClient } from "@azure/keyvault-secrets";
import crypto from "node:crypto";
import os from "node:os";
import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import pLimit from "p-limit";
import { v4 as uuidv4 } from "uuid";

// Import PrismaClient directly from generated output in the monorepo
// This avoids needing to publish/install the @billigent/database package to root
import { PrismaClient, Prisma } from "../packages/database/src/generated/prisma";

// DuckDB (node) for fast Parquet reads
// eslint-disable-next-line @typescript-eslint/no-var-requires
const duckdb = require("duckdb");

const RUN_ID = process.env.RUN_ID || uuidv4();
const ADLS_ACCOUNT = process.env.ADLS_ACCOUNT || "billigentdevdlseus2";
const ADLS_CONTAINER = process.env.ADLS_CONTAINER || "data";
const SILVER_PREFIX = process.env.ADLS_PREFIX_SILVER || "silver";
const KEYVAULT_URL = process.env.KEYVAULT_URL; // e.g., https://<vault-name>.vault.azure.net/
const SQL_SECRET_NAME = process.env.SQL_SECRET_NAME; // e.g., "DATABASE_URL"

let db: PrismaClient;

function getCredential() {
  // Prefer DefaultAzureCredential (works for local dev + MSI in cloud)
  return new DefaultAzureCredential();
}

async function hydrateDatabaseUrlFromKeyVault() {
  if (!KEYVAULT_URL || !SQL_SECRET_NAME) return;
  const credential = getCredential();
  const client = new SecretClient(KEYVAULT_URL, credential);
  const secret = await client.getSecret(SQL_SECRET_NAME);
  if (secret.value) {
    process.env.DATABASE_URL = secret.value;
  }
}

async function ensureOpsTables() {
  // OpsRunHistory
  await db.$executeRawUnsafe(`
IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name='OpsRunHistory')
CREATE TABLE dbo.OpsRunHistory(
  run_id UNIQUEIDENTIFIER NOT NULL,
  step NVARCHAR(128) NOT NULL,
  started_at DATETIMEOFFSET NOT NULL DEFAULT SYSUTCDATETIME(),
  ended_at   DATETIMEOFFSET NULL,
  status NVARCHAR(32) NOT NULL,
  rows_affected BIGINT NULL,
  notes NVARCHAR(MAX) NULL
);
`);
  // DatasetVersion
  await db.$executeRawUnsafe(`
IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name='DatasetVersion')
CREATE TABLE dbo.DatasetVersion(
  name NVARCHAR(128) PRIMARY KEY,
  schema_hash NVARCHAR(128) NOT NULL,
  last_loaded DATETIMEOFFSET NOT NULL DEFAULT SYSUTCDATETIME()
);
`);
}

async function logRunStart(step: string) {
  await db.$executeRawUnsafe(
    `INSERT INTO dbo.OpsRunHistory(run_id, step, status, started_at) VALUES (@p1, @p2, 'STARTED', SYSUTCDATETIME())`,
    RUN_ID,
    step
  );
}

async function logRunEnd(step: string, status: "OK" | "FAILED" | "SKIPPED", rows: number | null, notes?: string) {
  await db.$executeRawUnsafe(
    `UPDATE dbo.OpsRunHistory SET status=@p1, ended_at=SYSUTCDATETIME(), rows_affected=@p2, notes=@p3 WHERE run_id=@p4 AND step=@p5 AND ended_at IS NULL`,
    status,
    rows,
    notes || null,
    RUN_ID,
    step
  );
}

async function withRunLogging<T>(step: string, f: () => Promise<T>): Promise<T | undefined> {
  await logRunStart(step);
  try {
    const result = await f();
    const rows = typeof result === "number" ? result : null;
    await logRunEnd(step, "OK", rows);
    return result;
  } catch (err: any) {
    await logRunEnd(step, "FAILED", null, err?.message || String(err));
    console.error(`Step ${step} FAILED`, err);
    return undefined;
  }
}

function tmpDir() {
  const p = path.join(process.cwd(), "tmp", "seed-working", RUN_ID);
  fs.mkdirSync(p, { recursive: true });
  return p;
}

function blobServiceClient() {
  const credential = getCredential();
  const url = `https://${ADLS_ACCOUNT}.blob.core.windows.net`;
  return new BlobServiceClient(url, credential);
}

async function listCurrentSnapshots(prefix: string) {
  const service = blobServiceClient();
  const container = service.getContainerClient(ADLS_CONTAINER);
  const iter = container.listBlobsFlat({ prefix });
  const out: { name: string; size?: number; etag?: string; lastModified?: Date }[] = [];
  for await (const item of iter) {
    const name = item.name;
    if (!name.endsWith("_current.parquet") && !name.endsWith("_current.csv")) continue;
    out.push({ name, size: item.properties.contentLength, etag: item.properties.etag, lastModified: item.properties.lastModified });
  }
  return out;
}

async function downloadBlobToTmp(blobPath: string) {
  const service = blobServiceClient();
  const container = service.getContainerClient(ADLS_CONTAINER);
  const blob = container.getBlobClient(blobPath);
  const filePath = path.join(tmpDir(), blobPath.replace(/[/\\]/g, "__"));
  await fsp.mkdir(path.dirname(filePath), { recursive: true }).catch(() => {});
  const resp = await blob.download();
  const writable = fs.createWriteStream(filePath);
  await new Promise<void>((resolve, reject) => {
    resp.readableStreamBody?.pipe(writable).on("finish", () => resolve()).on("error", reject);
  });
  return { filePath, etag: resp.etag, lastModified: resp.lastModified };
}

function computeFileHashSync(filePath: string, extra?: string) {
  const h = crypto.createHash("sha256");
  const fd = fs.openSync(filePath, "r");
  try {
    const stat = fs.fstatSync(fd);
    const buf = Buffer.alloc(Math.min(1024 * 1024, stat.size)); // up to 1MB sample
    fs.readSync(fd, buf, 0, buf.length, 0);
    h.update(buf);
    h.update(String(stat.size));
    if (extra) h.update(extra);
    return h.digest("hex");
  } finally {
    fs.closeSync(fd);
  }
}

async function getDatasetVersion(name: string): Promise<string | null> {
  const rows = await db.$queryRawUnsafe<{ schema_hash: string }[]>(
    `SELECT schema_hash FROM dbo.DatasetVersion WHERE name=@p1`,
    name
  );
  if (rows && rows.length > 0) return rows[0].schema_hash;
  return null;
}

async function upsertDatasetVersion(name: string, schemaHash: string) {
  await db.$executeRawUnsafe(
    `MERGE dbo.DatasetVersion AS target USING (SELECT @p1 AS name, @p2 AS schema_hash) AS src ON target.name = src.name
WHEN MATCHED AND target.schema_hash <> src.schema_hash THEN UPDATE SET schema_hash = src.schema_hash, last_loaded = SYSUTCDATETIME()
WHEN NOT MATCHED THEN INSERT (name, schema_hash) VALUES (src.name, src.schema_hash);`,
    name,
    schemaHash
  );
}

async function parquetToRows(filePath: string, selectSql?: string): Promise<any[]> {
  const connection = new duckdb.Database(path.join(tmpDir(), "duckdb.db")).connect();
  try {
    const escaped = filePath.replace(/'/g, "''");
    const reader = filePath.toLowerCase().endsWith(".csv")
      ? `read_csv_auto('${escaped}', HEADER=TRUE)`
      : `read_parquet('${escaped}')`;
    const tableSql = `CREATE OR REPLACE TABLE t AS SELECT * FROM ${reader}`;
    await new Promise<void>((resolve, reject) => connection.run(tableSql, (err: any) => (err ? reject(err) : resolve())));
    const sql = selectSql || `SELECT * FROM t`;
    return await new Promise<any[]>((resolve, reject) => connection.all(sql, (err: any, rows: any[]) => (err ? reject(err) : resolve(rows))));
  } finally {
    try {
      connection.close();
    } catch {}
  }
}

function chunk<T>(arr: T[], size: number) {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

// Upsert helpers per model (batching 100-500)
async function upsertIcd10Cm(rows: any[]) {
  let count = 0;
  for (const batch of chunk(rows, 300)) {
    await db.$transaction(
      batch.map((r) =>
        db.icd10Cm.upsert({
          where: { code: String(r.code) },
          create: {
            code: String(r.code),
            title: r.title ?? null,
            longDesc: r.longDesc ?? r.long_description ?? null,
            effFrom: new Date(r.effFrom ?? r.eff_from),
            effTo: r.effTo ? new Date(r.effTo) : r.eff_to ? new Date(r.eff_to) : null,
          },
          update: {
            title: r.title ?? r.longDesc ?? null,
            longDesc: r.longDesc ?? r.long_description ?? null,
            effFrom: new Date(r.effFrom ?? r.eff_from),
            effTo: r.effTo ? new Date(r.effTo) : r.eff_to ? new Date(r.eff_to) : null,
          },
        })
      )
    );
    count += batch.length;
  }
  return count;
}

async function upsertIcd10Pcs(rows: any[]) {
  let count = 0;
  for (const batch of chunk(rows, 300)) {
    await db.$transaction(
      batch.map((r) =>
        db.icd10Pcs.upsert({
          where: { code: String(r.code) },
          create: {
            code: String(r.code),
            title: r.title ?? null,
            effFrom: new Date(r.effFrom ?? r.eff_from),
            effTo: r.effTo ? new Date(r.effTo) : r.eff_to ? new Date(r.eff_to) : null,
          },
          update: {
            title: r.title ?? null,
            effFrom: new Date(r.effFrom ?? r.eff_from),
            effTo: r.effTo ? new Date(r.effTo) : r.eff_to ? new Date(r.eff_to) : null,
          },
        })
      )
    );
    count += batch.length;
  }
  return count;
}

async function upsertMsDrg(rows: any[]) {
  let count = 0;
  for (const batch of chunk(rows, 300)) {
    await db.$transaction(
      batch.map((r) =>
        db.msDrg.upsert({
          where: { drg: String(r.drg) },
          create: {
            drg: String(r.drg),
            desc: r.desc ?? r.description ?? null,
            rw: r.rw != null ? new Prisma.Decimal(String(r.rw)) : null,
            gmlos: r.gmlos != null ? new Prisma.Decimal(String(r.gmlos)) : null,
            amlos: r.amlos != null ? new Prisma.Decimal(String(r.amlos)) : null,
            transfer: r.transfer != null ? Boolean(r.transfer) : null,
            effFrom: new Date(r.effFrom ?? r.eff_from),
            effTo: r.effTo ? new Date(r.effTo) : r.eff_to ? new Date(r.eff_to) : null,
          },
          update: {
            desc: r.desc ?? r.description ?? null,
            rw: r.rw != null ? new Prisma.Decimal(String(r.rw)) : null,
            gmlos: r.gmlos != null ? new Prisma.Decimal(String(r.gmlos)) : null,
            amlos: r.amlos != null ? new Prisma.Decimal(String(r.amlos)) : null,
            transfer: r.transfer != null ? Boolean(r.transfer) : null,
            effFrom: new Date(r.effFrom ?? r.eff_from),
            effTo: r.effTo ? new Date(r.effTo) : r.eff_to ? new Date(r.eff_to) : null,
          },
        })
      )
    );
    count += batch.length;
  }
  return count;
}

async function upsertHcpcs(rows: any[]) {
  let count = 0;
  for (const batch of chunk(rows, 300)) {
    await db.$transaction(
      batch.map((r) =>
        db.hcpcs.upsert({
          where: { code: String(r.code) },
          create: {
            code: String(r.code),
            short: r.short ?? r.short_desc ?? null,
            long: r.long ?? r.long_desc ?? null,
            status: r.status ?? null,
            effFrom: new Date(r.effFrom ?? r.eff_from),
            effTo: r.effTo ? new Date(r.effTo) : r.eff_to ? new Date(r.eff_to) : null,
          },
          update: {
            short: r.short ?? r.short_desc ?? null,
            long: r.long ?? r.long_desc ?? null,
            status: r.status ?? null,
            effFrom: new Date(r.effFrom ?? r.eff_from),
            effTo: r.effTo ? new Date(r.effTo) : r.eff_to ? new Date(r.eff_to) : null,
          },
        })
      )
    );
    count += batch.length;
  }
  return count;
}

async function upsertNcciPtp(rows: any[]) {
  let count = 0;
  for (const batch of chunk(rows, 300)) {
    await db.$transaction(
      batch.map((r) =>
        db.ncciPtp.upsert({
          where: {
            codeA_codeB_effFrom: {
              codeA: String(r.codeA ?? r.code_a ?? r.cpta ?? r.hcpcs_a),
              codeB: String(r.codeB ?? r.code_b ?? r.cptb ?? r.hcpcs_b),
              effFrom: new Date(r.effFrom ?? r.eff_from),
            },
          },
          create: {
            id: r.id ?? uuidv4(),
            codeA: String(r.codeA ?? r.code_a ?? r.cpta ?? r.hcpcs_a),
            codeB: String(r.codeB ?? r.code_b ?? r.cptb ?? r.hcpcs_b),
            modInd: String(r.modInd ?? r.mod_ind ?? r.modifier_ind ?? "9"),
            effFrom: new Date(r.effFrom ?? r.eff_from),
            effTo: r.effTo ? new Date(r.effTo) : r.eff_to ? new Date(r.eff_to) : null,
          },
          update: {
            modInd: String(r.modInd ?? r.mod_ind ?? r.modifier_ind ?? "9"),
            effTo: r.effTo ? new Date(r.effTo) : r.eff_to ? new Date(r.eff_to) : null,
          },
        })
      )
    );
    count += batch.length;
  }
  return count;
}

async function upsertNcciMue(rows: any[]) {
  let count = 0;
  for (const batch of chunk(rows, 300)) {
    await db.$transaction(
      batch.map((r) =>
        db.ncciMue.upsert({
          where: { code_effFrom: { code: String(r.code), effFrom: new Date(r.effFrom ?? r.eff_from) } },
          create: {
            code: String(r.code),
            effFrom: new Date(r.effFrom ?? r.eff_from),
            mue: Number(r.mue ?? r.max_units ?? r.units ?? 0),
            effTo: r.effTo ? new Date(r.effTo) : r.eff_to ? new Date(r.eff_to) : null,
          },
          update: {
            mue: Number(r.mue ?? r.max_units ?? r.units ?? 0),
            effTo: r.effTo ? new Date(r.effTo) : r.eff_to ? new Date(r.eff_to) : null,
          },
        })
      )
    );
    count += batch.length;
  }
  return count;
}

async function upsertCarc(rows: any[]) {
  let count = 0;
  for (const batch of chunk(rows, 300)) {
    await db.$transaction(
      batch.map((r) =>
        db.carc.upsert({
          where: { code: String(r.code) },
          create: {
            code: String(r.code),
            grp: r.grp ?? r.group ?? null,
            desc: r.desc ?? r.description ?? null,
            effFrom: r.effFrom ? new Date(r.effFrom) : r.eff_from ? new Date(r.eff_from) : null,
            effTo: r.effTo ? new Date(r.effTo) : r.eff_to ? new Date(r.eff_to) : null,
          },
          update: {
            grp: r.grp ?? r.group ?? null,
            desc: r.desc ?? r.description ?? null,
            effFrom: r.effFrom ? new Date(r.effFrom) : r.eff_from ? new Date(r.eff_from) : null,
            effTo: r.effTo ? new Date(r.effTo) : r.eff_to ? new Date(r.eff_to) : null,
          },
        })
      )
    );
    count += batch.length;
  }
  return count;
}

async function upsertRarc(rows: any[]) {
  let count = 0;
  for (const batch of chunk(rows, 300)) {
    await db.$transaction(
      batch.map((r) =>
        db.rarc.upsert({
          where: { code: String(r.code) },
          create: {
            code: String(r.code),
            desc: r.desc ?? r.description ?? null,
            effFrom: r.effFrom ? new Date(r.effFrom) : r.eff_from ? new Date(r.eff_from) : null,
            effTo: r.effTo ? new Date(r.effTo) : r.eff_to ? new Date(r.eff_to) : null,
          },
          update: {
            desc: r.desc ?? r.description ?? null,
            effFrom: r.effFrom ? new Date(r.effFrom) : r.eff_from ? new Date(r.eff_from) : null,
            effTo: r.effTo ? new Date(r.effTo) : r.eff_to ? new Date(r.eff_to) : null,
          },
        })
      )
    );
    count += batch.length;
  }
  return count;
}

async function upsertNuccTaxonomy(rows: any[]) {
  let count = 0;
  for (const batch of chunk(rows, 300)) {
    await db.$transaction(
      batch.map((r) =>
        db.nuccTaxonomy.upsert({
          where: { code: String(r.code) },
          create: {
            code: String(r.code),
            grouping: r.grouping ?? null,
            classification: r.classification ?? null,
            specialization: r.specialization ?? null,
            display: r.display ?? r.title ?? null,
          },
          update: {
            grouping: r.grouping ?? null,
            classification: r.classification ?? null,
            specialization: r.specialization ?? null,
            display: r.display ?? r.title ?? null,
          },
        })
      )
    );
    count += batch.length;
  }
  return count;
}

async function upsertNpiProvider(rows: any[]) {
  // Guardrail: at most 50k per run
  const limited = rows.slice(0, 50000);
  let count = 0;
  for (const batch of chunk(limited, 300)) {
    await db.$transaction(
      batch.map((r) =>
        db.npiProvider.upsert({
          where: { npi: String(r.npi) },
          create: {
            npi: String(r.npi),
            entityType: r.entityType ?? r.entity_type ?? null,
            name: r.name ?? r.provider_name ?? null,
            orgName: r.orgName ?? r.org_name ?? null,
            taxonomy: r.taxonomy ?? r.primary_taxonomy ?? null,
            state: r.state ?? null,
            postalCode: r.postalCode ?? r.postal_code ?? r.zip ?? null,
          },
          update: {
            entityType: r.entityType ?? r.entity_type ?? null,
            name: r.name ?? r.provider_name ?? null,
            orgName: r.orgName ?? r.org_name ?? null,
            taxonomy: r.taxonomy ?? r.primary_taxonomy ?? null,
            state: r.state ?? null,
            postalCode: r.postalCode ?? r.postal_code ?? r.zip ?? null,
          },
        })
      )
    );
    count += batch.length;
  }
  return count;
}

async function upsertEob(rowsLine: any[], rowsAdj: any[]) {
  // Upsert EOB lines first, then adjudications
  let count = 0;
  for (const batch of chunk(rowsLine, 300)) {
    await db.$transaction(
      batch.map((r) =>
        db.eobLine.upsert({
          where: { claimId_lineNum: { claimId: String(r.claimId ?? r.claim_id), lineNum: Number(r.lineNum ?? r.line_num) } },
          create: {
            claimId: String(r.claimId ?? r.claim_id),
            lineNum: Number(r.lineNum ?? r.line_num),
            hcpcs: r.hcpcs ?? r.cpt ?? r.hcpcs_code ?? null,
            units: r.units != null ? Number(r.units) : null,
            chargeAmt: r.chargeAmt != null ? new Prisma.Decimal(String(r.chargeAmt)) : r.charge_amt != null ? new Prisma.Decimal(String(r.charge_amt)) : null,
            paidAmt: r.paidAmt != null ? new Prisma.Decimal(String(r.paidAmt)) : r.paid_amt != null ? new Prisma.Decimal(String(r.paid_amt)) : null,
            drg: r.drg ?? null,
            serviceFrom: r.serviceFrom ? new Date(r.serviceFrom) : r.service_from ? new Date(r.service_from) : null,
            serviceTo: r.serviceTo ? new Date(r.serviceTo) : r.service_to ? new Date(r.service_to) : null,
          },
          update: {
            hcpcs: r.hcpcs ?? r.cpt ?? r.hcpcs_code ?? null,
            units: r.units != null ? Number(r.units) : null,
            chargeAmt: r.chargeAmt != null ? new Prisma.Decimal(String(r.chargeAmt)) : r.charge_amt != null ? new Prisma.Decimal(String(r.charge_amt)) : null,
            paidAmt: r.paidAmt != null ? new Prisma.Decimal(String(r.paidAmt)) : r.paid_amt != null ? new Prisma.Decimal(String(r.paid_amt)) : null,
            drg: r.drg ?? null,
            serviceFrom: r.serviceFrom ? new Date(r.serviceFrom) : r.service_from ? new Date(r.service_from) : null,
            serviceTo: r.serviceTo ? new Date(r.serviceTo) : r.service_to ? new Date(r.service_to) : null,
          },
        })
      )
    );
    count += batch.length;
  }

  // Build a quick index of line id by composite key for adjudications
  const lines = await db.eobLine.findMany({ select: { id: true, claimId: true, lineNum: true } });
  const keyToId = new Map<string, string>();
  for (const l of lines) keyToId.set(`${l.claimId}|${l.lineNum}`, l.id);

  for (const batch of chunk(rowsAdj, 300)) {
    await db.$transaction(
      batch.map((r) => {
        const claimId = String(r.claimId ?? r.claim_id);
        const lineNum = Number(r.lineNum ?? r.line_num);
        const eobLineId = keyToId.get(`${claimId}|${lineNum}`);
        if (!eobLineId) {
          // skip if line missing
          return db.$executeRawUnsafe("SELECT 1");
        }
        const id = r.id ?? uuidv4();
        return db.eobAdjudication.upsert({
          where: { id },
          create: {
            id,
            eobLineId,
            category: r.category ?? r.type ?? null,
            amount: r.amount != null ? new Prisma.Decimal(String(r.amount)) : null,
            carc: r.carc ?? r.reason_code ?? null,
            rarc: r.rarc ?? r.remark_code ?? null,
            reasonTxt: r.reasonTxt ?? r.reason ?? null,
          },
          update: {
            category: r.category ?? r.type ?? null,
            amount: r.amount != null ? new Prisma.Decimal(String(r.amount)) : null,
            carc: r.carc ?? r.reason_code ?? null,
            rarc: r.rarc ?? r.remark_code ?? null,
            reasonTxt: r.reasonTxt ?? r.reason ?? null,
          },
        });
      })
    );
    count += batch.length;
  }
  return count;
}

async function loadDataset({ name, blobPath, selectSql, upsert }: { name: string; blobPath: string; selectSql?: string; upsert: (rows: any[]) => Promise<number> }) {
  return withRunLogging(name, async () => {
    const { filePath, etag, lastModified } = await downloadBlobToTmp(blobPath);
    const hash = computeFileHashSync(filePath, `${etag ?? ""}|${lastModified?.toISOString() ?? ""}`);
    const prev = await getDatasetVersion(name);
    if (prev && prev === hash) {
      await logRunEnd(name, "SKIPPED", 0, "schema_hash unchanged");
      return 0;
    }

    const rows = await parquetToRows(filePath, selectSql);
    const affected = await upsert(rows);
    await upsertDatasetVersion(name, hash);
    return affected;
  });
}

async function main() {
  console.log(`RUN_ID=${RUN_ID}`);
  await hydrateDatabaseUrlFromKeyVault();
  // Now that DATABASE_URL is hydrated, create Prisma client
  db = new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "info", "warn", "error"] : ["error"],
  });
  await ensureOpsTables();

  // Discover datasets to load
  const terminologiesPrefix = `${SILVER_PREFIX}/terminologies/_snapshots/`;
  const eobPrefix = `${SILVER_PREFIX}/claims/eob/`;
  const snaps = await listCurrentSnapshots(terminologiesPrefix);
  const eobSnaps = await listCurrentSnapshots(eobPrefix);

  // Helper to resolve a file by suffix
  const findBy = (arr: { name: string }[], suffix: string) => arr.find((b) => b.name.endsWith(suffix))?.name;

  // Loaders (if present)
  const tasks: Array<() => Promise<any>> = [];

  const icd10cm = findBy(snaps, "codes_icd10cm_current.parquet") || findBy(snaps, "codes_icd10cm_current.csv");
  if (icd10cm) tasks.push(() => loadDataset({ name: "lkp_icd10cm", blobPath: icd10cm, upsert: upsertIcd10Cm }));

  const icd10pcs = findBy(snaps, "codes_icd10pcs_current.parquet") || findBy(snaps, "codes_icd10pcs_current.csv");
  if (icd10pcs) tasks.push(() => loadDataset({ name: "lkp_icd10pcs", blobPath: icd10pcs, upsert: upsertIcd10Pcs }));

  const msdrg = findBy(snaps, "msdrg_current.parquet") || findBy(snaps, "msdrg_current.csv");
  if (msdrg) tasks.push(() => loadDataset({ name: "lkp_msdrg", blobPath: msdrg, upsert: upsertMsDrg }));

  const hcpcs = findBy(snaps, "hcpcs_current.parquet") || findBy(snaps, "hcpcs_current.csv");
  if (hcpcs) tasks.push(() => loadDataset({ name: "lkp_hcpcs", blobPath: hcpcs, upsert: upsertHcpcs }));

  const ncciPtp = findBy(snaps, "ncci_ptp_current.parquet") || findBy(snaps, "ncci_ptp_current.csv");
  if (ncciPtp) tasks.push(() => loadDataset({ name: "lkp_ncci_ptp", blobPath: ncciPtp, upsert: upsertNcciPtp }));

  const ncciMue = findBy(snaps, "ncci_mue_current.parquet") || findBy(snaps, "ncci_mue_current.csv");
  if (ncciMue) tasks.push(() => loadDataset({ name: "lkp_ncci_mue", blobPath: ncciMue, upsert: upsertNcciMue }));

  const carc = findBy(snaps, "carc_current.parquet") || findBy(snaps, "carc_current.csv");
  if (carc) tasks.push(() => loadDataset({ name: "lkp_carc", blobPath: carc, upsert: upsertCarc }));

  const rarc = findBy(snaps, "rarc_current.parquet") || findBy(snaps, "rarc_current.csv");
  if (rarc) tasks.push(() => loadDataset({ name: "lkp_rarc", blobPath: rarc, upsert: upsertRarc }));

  const nucc = findBy(snaps, "nucc_taxonomy_current.parquet") || findBy(snaps, "nucc_taxonomy_current.csv");
  if (nucc) tasks.push(() => loadDataset({ name: "lkp_nucc_taxonomy", blobPath: nucc, upsert: upsertNuccTaxonomy }));

  const npi = findBy(snaps, "npi_provider_current.parquet") || findBy(snaps, "npi_provider_current.csv");
  if (npi) tasks.push(() => loadDataset({ name: "lkp_npi_provider", blobPath: npi, upsert: upsertNpiProvider }));

  const eobLine = findBy(eobSnaps, "eob_line_current.parquet") || findBy(eobSnaps, "eob_line_current.csv");
  const eobAdj = findBy(eobSnaps, "eob_adj_current.parquet") || findBy(eobSnaps, "eob_adj_current.csv");
  if (eobLine && eobAdj) {
    tasks.push(() =>
      withRunLogging("fact_eob", async () => {
        const dlLine = await downloadBlobToTmp(eobLine);
        const dlAdj = await downloadBlobToTmp(eobAdj);
        const hash = computeFileHashSync(dlLine.filePath, `${dlLine.etag ?? ""}|${dlLine.lastModified?.toISOString() ?? ""}`) +
          ":" + computeFileHashSync(dlAdj.filePath, `${dlAdj.etag ?? ""}|${dlAdj.lastModified?.toISOString() ?? ""}`);
        const prev = await getDatasetVersion("fact_eob");
        if (prev && prev === hash) {
          await logRunEnd("fact_eob", "SKIPPED", 0, "schema_hash unchanged");
          return 0;
        }
        const rowsL = await parquetToRows(dlLine.filePath);
        const rowsA = await parquetToRows(dlAdj.filePath);
        const affected = await upsertEob(rowsL, rowsA);
        await upsertDatasetVersion("fact_eob", hash);
        return affected;
      })
    );
  }

  // Execute with mild parallelism to stay under DB/IO throttles
  const limiter = pLimit(3);
  await Promise.all(tasks.map((fn) => limiter(() => fn())));
}

main()
  .then(() => {
    console.log("Seed working sets completed.");
  })
  .catch((err) => {
    console.error("Seed working sets FAILED", err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.$disconnect();
  });
