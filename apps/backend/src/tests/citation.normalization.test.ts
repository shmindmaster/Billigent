import { strict as assert } from "assert";
import path from "path";
import fs from "fs";
import {
  normalizeCorpusFile,
  loadNormalizedCitations,
  invalidateCitationCache,
} from "../strategy/citations";

// Prefer root repository corpus if present (richer dataset), else fallback to app-local docs
const rootCorpusPath = path.resolve(
  process.cwd(),
  "..",
  "..",
  "docs",
  "research",
  "corpus.jsonl"
);
const localCorpusPath = path.resolve(
  process.cwd(),
  "docs",
  "research",
  "corpus.jsonl"
);
const corpusPath = fs.existsSync(rootCorpusPath)
  ? rootCorpusPath
  : localCorpusPath;
const outPath = fs.existsSync(rootCorpusPath)
  ? path.resolve(
      process.cwd(),
      "..",
      "..",
      "docs",
      "research",
      "normalized_citations.jsonl"
    )
  : path.resolve(
      process.cwd(),
      "docs",
      "research",
      "normalized_citations.jsonl"
    );

(async () => {
  if (!fs.existsSync(corpusPath)) {
    console.warn("Corpus file missing; skipping citation normalization test");
    return;
  }
  const stats = await normalizeCorpusFile(corpusPath, outPath);
  assert(stats.normalized > 0, "Should normalize at least one entry");
  invalidateCitationCache();
  const normalized = loadNormalizedCitations();
  const ids = new Set<string>();
  for (const c of normalized) {
    assert(!ids.has(c.id), "Duplicate normalized citation id");
    ids.add(c.id);
  }
  // Ensure at least one regulatory or standards tier
  const tierSet = new Set(normalized.map((c) => c.authorityTier));
  assert(
    tierSet.has("regulatory") || tierSet.has("standards"),
    "Expected at least one authoritative tier (regulatory/standards)"
  );
  // If using the rich root corpus expect a substantial count; otherwise ensure local baseline (>=5)
  const expectedMin = fs.existsSync(rootCorpusPath) ? 40 : 5;
  assert(
    normalized.length >= expectedMin,
    `Expected at least ${expectedMin} normalized citations (got ${normalized.length})`
  );
  console.log("Citation normalization test passed", {
    count: normalized.length,
    tiers: [...tierSet],
  });
})();
