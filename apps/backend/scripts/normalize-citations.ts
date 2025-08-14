#!/usr/bin/env tsx
/**
 * Citation normalization script.
 * Reads docs/research/corpus.jsonl, produces docs/research/normalized_citations.jsonl
 * Emits a JSON summary to stdout to integrate with future CI gates.
 */
import path from 'path';
import fs from 'fs';
import { normalizeCorpusFile } from '../src/strategy/citations';

async function run() {
  // Support running from monorepo backend dir; if not found locally, look two levels up
  let corpusPath = path.resolve(process.cwd(), 'docs', 'research', 'corpus.jsonl');
  if (!fs.existsSync(corpusPath)) {
    corpusPath = path.resolve(process.cwd(), '..', '..', 'docs', 'research', 'corpus.jsonl');
  }
  let outPath = path.resolve(process.cwd(), 'docs', 'research', 'normalized_citations.jsonl');
  if (!fs.existsSync(path.dirname(outPath))) {
    outPath = path.resolve(process.cwd(), '..', '..', 'docs', 'research', 'normalized_citations.jsonl');
  }
  if (!fs.existsSync(corpusPath)) {
    console.error(`Corpus file missing at ${corpusPath}`);
    process.exit(1);
  }
  const stats = await normalizeCorpusFile(corpusPath, outPath);
  const summary = {
    action: 'normalize_citations',
    corpusPath,
    outPath,
    ...stats,
    generatedAt: new Date().toISOString()
  };
  console.log(JSON.stringify(summary, null, 2));
}

run().catch(err => {
  console.error('Normalization failed', err);
  process.exit(1);
});
