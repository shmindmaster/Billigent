import assert from "assert";
import { classifyAuthorityTier, RawCorpusEntry } from "../strategy/citations";

// Self-executing test validating tier classification heuristics.
(async () => {
  const cases: Array<{ entry: RawCorpusEntry; expect: string }> = [
    {
      entry: {
        source: "CMS ICD-10-CM Guidelines FY2025",
        category: "ICD-10-CM",
      },
      expect: "regulatory",
    },
    {
      entry: { source: "CARIN C4BB EOB Pharmacy", category: "CARIN" },
      expect: "standards",
    },
    {
      entry: {
        source: "Change Healthcare 2022 Revenue Cycle Denials Index",
        category: "Denials (Primary)",
      },
      expect: "primary",
    },
    {
      entry: {
        source: "CAQH CORE Health Care Claims Issue Brief 2023",
        category: "Denials Secondary Commentary",
      },
      expect: "secondary",
    },
    {
      entry: {
        source: "MeasureYourMission Claim Integrity KPIs Summary (Tertiary)",
        category: "Tertiary Summary",
      },
      expect: "tertiary",
    },
    {
      entry: {
        source: "FinThrive Denials Management",
        category: "Competitive Intelligence",
      },
      expect: "competitive",
    },
  ];

  for (const c of cases) {
    const { tier } = classifyAuthorityTier(c.entry);
    assert.equal(
      tier,
      c.expect,
      `Expected tier ${c.expect} for source '${c.entry.source}' but got ${tier}`
    );
  }
  console.log("Citation classification test passed");
})();
