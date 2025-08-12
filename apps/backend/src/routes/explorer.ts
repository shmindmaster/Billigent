import { Router } from "express";
import { listSilverGold, sasForPath } from "../services/datalake-explorer.service";
import { BlobServiceClient } from "@azure/storage-blob";

const router = Router();

// GET /api/explorer/manifest
router.get("/manifest", async (_req, res, next) => {
  try { res.json(await listSilverGold()); } catch (e) { next(e); }
});

// GET /api/explorer/file?path=<blob-path-relative-to-container>
router.get("/file", (req, res) => {
  const path = String(req.query.path || "");
  if (!path || (!path.startsWith("silver/") && !path.startsWith("gold/")))
    return res.status(400).json({ error: "path must be under silver/ or gold/" });
  return res.json({ url: sasForPath(path), ttlSeconds: 300 });
});

// (Optional) GET /api/explorer/preview?path=... → small sample for CSV/JSON/NDJSON
router.get("/preview", async (req, res, next) => {
  try {
    const path = String(req.query.path || "");
    if (!path) return res.status(400).json({ error: "path required" });

    const accountName = process.env.AZURE_STORAGE_ACCOUNT!;
    const accountKey  = process.env.AZURE_STORAGE_KEY!;
    const container   = process.env.AZURE_STORAGE_FILESYSTEM || "data";

    const bsc = BlobServiceClient.fromConnectionString(
      `DefaultEndpointsProtocol=https;AccountName=${accountName};AccountKey=${accountKey};EndpointSuffix=core.windows.net`
    );
    const bc = bsc.getContainerClient(container).getBlobClient(path);

    const head = await bc.getProperties();
    const ct = (head.contentType || "").toLowerCase();
    const stream = await bc.download(0, 256 * 1024); // first 256KB
    const buf = await streamToBuffer(stream.readableStreamBody);

    // naive sniffer
    if (ct.includes("json") || path.endsWith(".json") || path.endsWith(".ndjson")) {
      const text = buf.toString("utf8").split("\n").slice(0, 200).join("\n");
      return res.json({ contentType: "json", sample: text });
    }
    if (ct.includes("csv") || path.endsWith(".csv")) {
      const text = buf.toString("utf8").split("\n").slice(0, 200).join("\n");
      return res.json({ contentType: "csv", sample: text });
    }
    return res.json({ contentType: ct || "application/octet-stream", sample: null });
  } catch (e) { next(e); }
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


