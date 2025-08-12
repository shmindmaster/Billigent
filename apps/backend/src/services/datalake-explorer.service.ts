import { BlobServiceClient, StorageSharedKeyCredential, generateBlobSASQueryParameters, BlobSASPermissions } from "@azure/storage-blob";

function getStorage() {
  const accountName = process.env.AZURE_STORAGE_ACCOUNT!;
  const accountKey = process.env.AZURE_STORAGE_KEY!;
  const container = process.env.AZURE_STORAGE_FILESYSTEM || "data";
  const blobBaseUrl = `https://${accountName}.blob.core.windows.net`;
  const credential = new StorageSharedKeyCredential(accountName, accountKey);
  const blobs = new BlobServiceClient(`${blobBaseUrl}`, credential);
  return { accountName, accountKey, container, blobBaseUrl, credential, blobs };
}

let manifestCache: { data: any[]; expires: number } | null = null;

export async function listSilverGold(): Promise<any[]> {
  const now = Date.now();
  if (manifestCache && manifestCache.expires > now) return manifestCache.data;

  const out: any[] = [];
  const { blobs, container } = getStorage();
  const cc = blobs.getContainerClient(container);

  for await (const item of cc.listBlobsFlat({ includeMetadata: true })) {
    const p = item.name;
    // Only expose /data/silver/** and /data/gold/**
    if (!p.startsWith("silver/") && !p.startsWith("gold/")) continue;
    out.push({
      path: p,
      size: item.properties.contentLength || 0,
      lastModified: item.properties.lastModified?.toISOString() || null,
      contentType: item.properties.contentType || null,
    });
  }

  manifestCache = { data: out, expires: now + 60 * 60 * 1000 }; // 1h TTL
  return out;
}

export function sasForPath(path: string, minutes = 5): string {
  const { container, blobBaseUrl, credential } = getStorage();
  const expiresOn = new Date(Date.now() + minutes * 60 * 1000);
  const sas = generateBlobSASQueryParameters({
    containerName: container,
    blobName: path,
    permissions: BlobSASPermissions.parse("r"),
    expiresOn
  }, credential).toString();

  return `${blobBaseUrl}/${container}/${encodeURI(path)}?${sas}`;
}


