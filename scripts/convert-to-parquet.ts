/*
  Convert a CSV (in Azure Blob/ADLS) to Parquet and upload to the same container.

  Usage:
    pnpm convert:parquet --src "silver/terminologies/icd-10-cm/snapshot.csv" [--dst "silver/terminologies/icd-10-cm/snapshot.parquet"]

  Auth:
    - Uses Shared Key if AZURE_STORAGE_KEY is set
    - Otherwise uses DefaultAzureCredential (RBAC) to request a user delegation SAS for reading the source
*/

import { BlobServiceClient, StorageSharedKeyCredential, BlobSASPermissions, generateBlobSASQueryParameters, UserDelegationKey } from '@azure/storage-blob';
import { DefaultAzureCredential } from '@azure/identity';
import os from 'os';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import * as duckdb from 'duckdb';

function getArg(name: string, def?: string) {
  const i = process.argv.findIndex((a) => a === `--${name}`);
  if (i >= 0 && process.argv[i + 1]) return process.argv[i + 1];
  return def;
}

async function getStorage() {
  const accountName = process.env.AZURE_STORAGE_ACCOUNT!;
  const container = process.env.AZURE_STORAGE_FILESYSTEM || 'data';
  const accountKey = process.env.AZURE_STORAGE_KEY || '';
  const baseUrl = `https://${accountName}.blob.core.windows.net`;
  const useSharedKey = !!accountKey;
  const blobs = useSharedKey
    ? new BlobServiceClient(`${baseUrl}`, new StorageSharedKeyCredential(accountName, accountKey))
    : new BlobServiceClient(`${baseUrl}`, new DefaultAzureCredential());
  return { accountName, container, accountKey, baseUrl, blobs, useSharedKey };
}

async function sasForPath(path: string, minutes = 15): Promise<string> {
  const { accountName, container, baseUrl, blobs, useSharedKey, accountKey } = await getStorage();
  const expiresOn = new Date(Date.now() + minutes * 60 * 1000);
  if (useSharedKey) {
    const sas = generateBlobSASQueryParameters({
      containerName: container,
      blobName: path,
      permissions: BlobSASPermissions.parse('r'),
      expiresOn,
    }, new StorageSharedKeyCredential(accountName, accountKey!)).toString();
    return `${baseUrl}/${container}/${encodeURI(path)}?${sas}`;
  }
  const now = new Date();
  const key = await blobs.getUserDelegationKey(now, expiresOn);
  const sas = generateBlobSASQueryParameters({
    containerName: container,
    blobName: path,
    permissions: BlobSASPermissions.parse('r'),
    expiresOn,
  }, key as unknown as UserDelegationKey, accountName).toString();
  return `${baseUrl}/${container}/${encodeURI(path)}?${sas}`;
}

async function main() {
  const src = getArg('src');
  if (!src) throw new Error('--src is required (path within container)');
  const dst = getArg('dst') || src.replace(/\.csv(\?.*)?$/i, '.parquet');

  const { baseUrl, container, blobs } = await getStorage();
  const cc = blobs.getContainerClient(container);

  // Prepare temp paths
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'billig-parquet-'));
  const parquetPath = path.join(tmpDir, 'out.parquet');

  // Build HTTP URL (with SAS) for DuckDB to read
  const srcUrl = await sasForPath(src);

  // Convert via DuckDB
  const db = new duckdb.Database(':memory:');
  const con = db.connect();
  // Increase sample size a bit for types
  const sql = `COPY (SELECT * FROM read_csv_auto('${srcUrl}', SAMPLE_SIZE=20000)) TO '${parquetPath}' (FORMAT PARQUET)`;
  await new Promise<void>((resolve, reject) => {
    con.run(sql, (err: any) => (err ? reject(err) : resolve()));
  });
  con.close();

  // Upload parquet
  const dest = cc.getBlockBlobClient(dst);
  const buf = await fs.readFile(parquetPath);
  await dest.uploadData(buf, { blobHTTPHeaders: { blobContentType: 'application/octet-stream' } });

  // Cleanup
  await fs.rm(tmpDir, { recursive: true, force: true });

  console.log(JSON.stringify({ status: 'ok', src, dst, url: `${baseUrl}/${container}/${encodeURI(dst)}` }));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
