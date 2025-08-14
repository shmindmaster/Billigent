import { Router } from "express";
import {
  loadNormalizedCitations,
  computeCitationCoverage,
} from "../strategy/citations";
import { evidenceGraph } from "../strategy/evidenceGraph";

const router: ReturnType<typeof Router> = Router();

// Lightweight legacy endpoint expected by tests: /api/strategy/metrics/citation
router.get("/metrics/citation", (_req, res) => {
  const normalized = loadNormalizedCitations();
  const normalizedSourceCounts: Record<string, number> = {};
  for (const c of normalized) {
    normalizedSourceCounts[c.authorityTier] =
      (normalizedSourceCounts[c.authorityTier] || 0) + 1;
  }
  // Sample evidence coverage if graph has sources
  let evidenceSample: any = null;
  try {
    const sources: string[] = [];
    if (evidenceGraph && Array.isArray((evidenceGraph as any).nodes)) {
      for (const n of (evidenceGraph as any).nodes) {
        if (n && (n as any).citation) sources.push((n as any).citation);
      }
    }
    if (sources.length) {
      evidenceSample = computeCitationCoverage(sources);
    }
  } catch {
    /* ignore graph issues */
  }
  res.json({ normalizedSourceCounts, evidenceSample });
});

export default router;
