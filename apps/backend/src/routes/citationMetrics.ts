import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { loadNormalizedCitations } from '../strategy/citations';
import { evidenceGraph } from '../strategy/evidenceGraph';

const router = Router();

router.get('/metrics/citation', (req, res) => {
  const normalized = loadNormalizedCitations();
  const byTier: Record<string, number> = {};
  let withIssues = 0;
  for (const c of normalized) {
    byTier[c.authorityTier] = (byTier[c.authorityTier] || 0) + 1;
    if (c.issues && c.issues.length) withIssues++;
  }

  // Build a sample evidence bundle (first seeded) for quick coverage illustration
  let sampleCoverage; let patternId: string | undefined; let encounterId: string | undefined;
  try {
    patternId = 'DEN:PAYERA:CO45';
    encounterId = 'ENC:demo1';
    const bundle = evidenceGraph.buildEvidenceBundle(patternId, encounterId, { includeKpi: false });
    sampleCoverage = bundle?.citationCoverage;
  } catch { /* ignore */ }

  const corpusPath = path.resolve(process.cwd(), 'docs', 'research', 'corpus.jsonl');
  const corpusExists = fs.existsSync(corpusPath);

  return res.json({
    timestamp: new Date().toISOString(),
    corpusExists,
    normalizedSourceCounts: {
      totalRaw: (() => { if (!corpusExists) return 0; return fs.readFileSync(corpusPath, 'utf-8').split(/\r?\n/).filter(Boolean).length; })(),
      normalized: normalized.length,
      withIssues,
      byTier
    },
    evidenceSample: sampleCoverage ? { patternId, encounterId, ...sampleCoverage } : null
  });
});

export default router;
