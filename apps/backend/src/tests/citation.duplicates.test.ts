import assert from "assert";
import fs from "fs";
import os from "os";
import path from "path";
import { normalizeCorpusFile } from "../strategy/citations";

// Test duplicate detection by feeding a tiny corpus containing
// two identical source+url pairs. Expect the second instance to
// be marked with duplicate_source_url in issues list.
(async () => {
  const corpusEntries = [
    {
      source: "Test Regulatory Doc",
      url: "https://example.com/a",
      category: "CMS",
    },
    {
      source: "Test Regulatory Doc",
      url: "https://example.com/a",
      category: "CMS",
    }, // duplicate
    {
      source: "Unique Standards Doc",
      url: "https://example.com/b",
      category: "FHIR",
    },
  ];
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "cit-dup-"));
  const corpusPath = path.join(tmpDir, "corpus.jsonl");
  const outPath = path.join(tmpDir, "normalized.jsonl");
  fs.writeFileSync(
    corpusPath,
    corpusEntries.map((e) => JSON.stringify(e)).join("\n") + "\n"
  );

  const stats = await normalizeCorpusFile(corpusPath, outPath);
  assert.equal(stats.total, 3, "Should process all three lines");
  assert.equal(stats.normalized, 3, "All three should be normalized");
  // Read normalized lines
  const lines = fs
    .readFileSync(outPath, "utf-8")
    .trim()
    .split(/\n/)
    .map((l) => JSON.parse(l));
  const dupIssueCount = lines.filter(
    (l) => Array.isArray(l.issues) && l.issues.includes("duplicate_source_url")
  ).length;
  assert.equal(
    dupIssueCount,
    1,
    "Exactly one entry should be flagged duplicate"
  );
  console.log("Citation duplicate detection test passed");
})();
