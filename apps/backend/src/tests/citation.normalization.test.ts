import { strict as assert } from 'assert';
import path from 'path';
import fs from 'fs';
import { normalizeCorpusFile, loadNormalizedCitations } from '../strategy/citations';

/**
 * Minimal test ensuring normalization runs and produces expected tier distribution invariants.
 */

const corpusPath = path.resolve(process.cwd(), 'docs', 'research', 'corpus.jsonl');
const outPath = path.resolve(process.cwd(), 'docs', 'research', 'normalized_citations.jsonl');

(async () => {
  if (!fs.existsSync(corpusPath)) {
    console.warn('Corpus file missing; skipping citation normalization test');
    return;
  }
  const stats = await normalizeCorpusFile(corpusPath, outPath);
  assert(stats.normalized > 0, 'Should normalize at least one entry');
  const normalized = loadNormalizedCitations();
  const ids = new Set<string>();
  for (const c of normalized) {
    assert(!ids.has(c.id), 'Duplicate normalized citation id');
    ids.add(c.id);
  }
  // Ensure at least one regulatory or standards tier
  const tierSet = new Set(normalized.map(c => c.authorityTier));
  assert(tierSet.has('regulatory') || tierSet.has('standards'), 'Expected at least one authoritative tier (regulatory/standards)');
  console.log('Citation normalization test passed', { count: normalized.length, tiers: [...tierSet] });
})();
