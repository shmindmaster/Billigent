import { BlobServiceClient, StorageSharedKeyCredential, generateBlobSASQueryParameters, BlobSASPermissions, UserDelegationKey } from "@azure/storage-blob";
import { DefaultAzureCredential } from "@azure/identity";

function getStorage() {
  const accountName = process.env.AZURE_STORAGE_ACCOUNT!;
  const accountKey = process.env.AZURE_STORAGE_KEY || "";
  const container = process.env.AZURE_STORAGE_FILESYSTEM || "data";
  const blobBaseUrl = `https://${accountName}.blob.core.windows.net`;

  // Prefer Shared Key if provided; else fall back to AAD (RBAC) via DefaultAzureCredential
  const useSharedKey = !!accountKey;
  const blobs = useSharedKey
    ? new BlobServiceClient(`${blobBaseUrl}`, new StorageSharedKeyCredential(accountName, accountKey))
    : new BlobServiceClient(`${blobBaseUrl}`, new DefaultAzureCredential());

  return { accountName, accountKey, container, blobBaseUrl, blobs, useSharedKey };
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
    // Only expose silver/** and gold/** within the container
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

export async function sasForPath(path: string, minutes = 5): Promise<string> {
  const { accountName, container, blobBaseUrl, blobs, useSharedKey, accountKey } = getStorage();
  const expiresOn = new Date(Date.now() + minutes * 60 * 1000);

  if (useSharedKey) {
    // Shared key SAS
    const sas = generateBlobSASQueryParameters({
      containerName: container,
      blobName: path,
      permissions: BlobSASPermissions.parse("r"),
      expiresOn
    }, new StorageSharedKeyCredential(accountName, accountKey!)).toString();
    return `${blobBaseUrl}/${container}/${encodeURI(path)}?${sas}`;
  }

  // AAD: user delegation SAS (requires RBAC permissions)
  const cc = blobs.getContainerClient(container);
  const service = cc.getBlobClient(path);
  const { version } = await blobs.getAccountInfo();
  // getUserDelegationKey needs start/end
  const now = new Date();
  const key = await blobs.getUserDelegationKey(now, expiresOn);
  const sas = generateBlobSASQueryParameters({
    containerName: container,
    blobName: path,
    permissions: BlobSASPermissions.parse('r'),
    expiresOn
  }, key as unknown as UserDelegationKey, accountName).toString();
  return `${blobBaseUrl}/${container}/${encodeURI(path)}?${sas}`;
}


