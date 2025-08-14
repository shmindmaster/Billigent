import { Router, type Request, type Response, type NextFunction } from "express";
import { listSilverGold, sasForPath } from "../services/datalake-explorer.service";
import { BlobServiceClient, StorageSharedKeyCredential } from "@azure/storage-blob";
import { DefaultAzureCredential } from "@azure/identity";

const router: ReturnType<typeof Router> = Router();

// GET /api/explorer/manifest
router.get("/manifest", async (_req: Request, res: Response, next: NextFunction) => {
  try { res.json(await listSilverGold()); } catch (e) { next(e as any); }
});

// GET /api/explorer/file?path=<blob-path-relative-to-container>
router.get("/file", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const path = String(req.query.path || "");
    if (!path || (!path.startsWith("silver/") && !path.startsWith("gold/")))
      return res.status(400).json({ error: "path must be under silver/ or gold/" });
    const url = await sasForPath(path);
    return res.json({ url, ttlSeconds: 300 });
  } catch (e) { next(e as any); }
});

// (Optional) GET /api/explorer/preview?path=... → small sample for CSV/JSON/NDJSON
router.get("/preview", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const path = String(req.query.path || "");
    if (!path) return res.status(400).json({ error: "path required" });
    if (!path.startsWith("silver/") && !path.startsWith("gold/")) {
      return res.status(400).json({ error: "path must be under silver/ or gold/" });
    }

    const accountName = process.env.AZURE_STORAGE_ACCOUNT!;
    const accountKey  = process.env.AZURE_STORAGE_KEY || "";
    const container   = process.env.AZURE_STORAGE_FILESYSTEM || "data";

    const blobBaseUrl = `https://${accountName}.blob.core.windows.net`;
    const bsc = accountKey
      ? new BlobServiceClient(`${blobBaseUrl}`, new StorageSharedKeyCredential(accountName, accountKey))
      : new BlobServiceClient(`${blobBaseUrl}`, new DefaultAzureCredential());
    const bc = bsc.getContainerClient(container).getBlobClient(path);

    // HEAD first; if this fails (e.g., directory/user has no access), return not previewable
    let head; 
    try {
      head = await bc.getProperties();
    } catch {
      return res.json({ contentType: "application/octet-stream", sample: null });
    }

    const ct = (head.contentType || "").toLowerCase();
    const looksJson = ct.includes("json") || path.endsWith(".json") || path.endsWith(".ndjson");
    const looksCsv = ct.includes("csv") || path.endsWith(".csv");
    const length = Number(head.contentLength || 0);

    if (!(looksJson || looksCsv) || length === 0) {
      return res.json({ contentType: ct || "application/octet-stream", sample: null });
    }

    try {
  const stream = await bc.download(0, 256 * 1024); // first 256KB
  const buf = await streamToBuffer(stream.readableStreamBody || null);
      const text = buf.toString("utf8").split("\n").slice(0, 200).join("\n");
      return res.json({ contentType: looksCsv ? "csv" : "json", sample: text });
    } catch {
      return res.json({ contentType: ct || "application/octet-stream", sample: null });
    }
  } catch (e) { next(e as any); }
});

function streamToBuffer(s: NodeJS.ReadableStream | null): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    if (!s) return resolve(Buffer.alloc(0));
    const c: Uint8Array[] = [];
    s.on("data", (d) => c.push(d));
    s.on("end", () => resolve(Buffer.concat(c)));
    s.on("error", reject);
  });
}

export default router;


