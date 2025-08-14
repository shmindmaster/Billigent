import fs from "fs";
import readline from "readline";
import path from "path";
import crypto from "crypto";

/** Raw line from corpus.jsonl */
export interface RawCorpusEntry {
  source: string;
  url?: string;
  category?: string;
  notes?: string;
  id?: string;
  [k: string]: any; // allow future fields
}

export type AuthorityTier =
  | "primary"
  | "secondary"
  | "tertiary"
  | "competitive"
  | "regulatory"
  | "standards";

export interface NormalizedCitation {
  id: string; // canon_<sha8>
  originalSource: string;
  canonicalTitle: string;
  url: string;
  category: string;
  authorityTier: AuthorityTier;
  hash: string; // full sha256
  added: string;
  retrievalDate: string;
  notes?: string;
  issues?: string[];
}

/** In‑memory singleton cache */
const citationCache: {
  loaded: boolean;
  byCanonical: Map<string, NormalizedCitation>;
  all: NormalizedCitation[];
} = {
  loaded: false,
  byCanonical: new Map(),
  all: [],
};

/** Invalidate in-memory cache (used by tests after regenerating normalized file) */
export function invalidateCitationCache() {
  citationCache.loaded = false;
  citationCache.all = [];
  citationCache.byCanonical = new Map();
}

// Support monorepo layout: prefer root-level docs dataset if present
const LOCAL_CANON_FILE = path.resolve(
  process.cwd(),
  "docs",
  "research",
  "normalized_citations.jsonl"
);
const ROOT_CANON_FILE = path.resolve(
  process.cwd(),
  "..",
  "..",
  "docs",
  "research",
  "normalized_citations.jsonl"
);
function resolveCanonFile(): string {
  if (fs.existsSync(ROOT_CANON_FILE)) return ROOT_CANON_FILE;
  return LOCAL_CANON_FILE;
}

const CATEGORY_TIER_MAP: Array<{ test: RegExp; tier: AuthorityTier }> = [
  { test: /(ICD|DRG|NCCI|HIPAA|HL7|CMS|MS-DRG|IPPS)/i, tier: "regulatory" },
  {
    test: /(FHIR|HFMA|MAP Key|MAP Keys|AHIMA|ACDIS|CARIN|Guideline)/i,
    tier: "standards",
  },
  { test: /Denials? \(Primary\)/i, tier: "primary" },
  { test: /Denials? .*Secondary|Secondary Commentary/i, tier: "secondary" },
  { test: /Tertiary|Summary/i, tier: "tertiary" },
  { test: /Competitive Intelligence/i, tier: "competitive" },
  { test: /(Azure AI Search|Azure OpenAI)/i, tier: "standards" },
];

export function canonicalizeTitle(raw: string): string {
  const trimmed = raw.trim().replace(/\s+/g, " ");
  // Remove trailing trivial parentheticals like (how-to) or (Index)
  return trimmed.replace(/\s*\((how-to|index)\)$/i, "");
}

export function classifyAuthorityTier(entry: RawCorpusEntry): {
  tier: AuthorityTier;
  issue?: string;
} {
  const cat = entry.category || "";
  for (const rule of CATEGORY_TIER_MAP) {
    if (rule.test.test(cat) || rule.test.test(entry.source)) {
      return { tier: rule.tier };
    }
  }
  return { tier: "secondary", issue: "unclassified_fallback" };
}

export function normalizeCategory(cat?: string): string {
  if (!cat) return "uncategorized";
  return cat
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}

export function buildNormalized(
  entry: RawCorpusEntry,
  timestamp: string
): NormalizedCitation {
  const issues: string[] = [];
  if (!entry.url) issues.push("missing_url");
  const { tier, issue } = classifyAuthorityTier(entry);
  if (issue) issues.push(issue);
  const canonicalTitle = canonicalizeTitle(entry.source);
  const hashInput = `${entry.source}|${entry.url || ""}`;
  const fullHash = crypto.createHash("sha256").update(hashInput).digest("hex");
  const id = "canon_" + fullHash.substring(0, 8);
  return {
    id,
    originalSource: entry.source,
    canonicalTitle,
    url: entry.url || "",
    category: normalizeCategory(entry.category),
    authorityTier: tier,
    hash: fullHash,
    added: timestamp,
    retrievalDate: timestamp,
    notes: entry.notes,
    issues: issues.length ? issues : undefined,
  };
}

export function loadNormalizedCitations(): NormalizedCitation[] {
  if (citationCache.loaded) return citationCache.all;
  const canonPath = resolveCanonFile();
  if (!fs.existsSync(canonPath)) return [];
  const lines = fs
    .readFileSync(canonPath, "utf-8")
    .split(/\r?\n/)
    .filter(Boolean);
  for (const line of lines) {
    try {
      const obj = JSON.parse(line) as NormalizedCitation;
      citationCache.all.push(obj);
      citationCache.byCanonical.set(obj.canonicalTitle.toLowerCase(), obj);
    } catch {
      /* ignore malformed */
    }
  }
  citationCache.loaded = true;
  return citationCache.all;
}

export function findCitationByTitle(
  title: string
): NormalizedCitation | undefined {
  loadNormalizedCitations();
  return citationCache.byCanonical.get(canonicalizeTitle(title).toLowerCase());
}

/** Compute coverage over a set of fact source citation strings */
export function computeCitationCoverage(sourceCitations: string[]): {
  authoritativeFactCount: number;
  totalFactCount: number;
  authoritativePct: number;
} {
  loadNormalizedCitations();
  const authoritative = new Set<AuthorityTier>([
    "primary",
    "regulatory",
    "standards",
  ]);
  let authoritativeCount = 0;
  for (const cit of sourceCitations) {
    const norm = findCitationByTitle(cit);
    if (norm && authoritative.has(norm.authorityTier)) authoritativeCount += 1;
  }
  const total = sourceCitations.length || 1; // avoid divide by zero
  return {
    authoritativeFactCount: authoritativeCount,
    totalFactCount: sourceCitations.length,
    authoritativePct: authoritativeCount / total,
  };
}

/** Streaming normalization from corpus.jsonl (used by script & tests) */
export async function normalizeCorpusFile(
  corpusPath: string,
  outPath: string
): Promise<{
  total: number;
  normalized: number;
  withIssues: number;
  byTier: Record<string, number>;
}> {
  const rl = readline.createInterface({
    input: fs.createReadStream(corpusPath, "utf-8"),
    crlfDelay: Infinity,
  });
  const out = fs.createWriteStream(outPath, { flags: "w" });
  const seen = new Set<string>();
  let total = 0;
  let normalized = 0;
  let withIssues = 0;
  const byTier: Record<string, number> = {};
  const timestamp = new Date().toISOString();
  for await (const line of rl) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    let parsed: RawCorpusEntry;
    try {
      parsed = JSON.parse(trimmed);
    } catch {
      continue;
    }
    if (!parsed.source) continue;
    total++;
    const norm = buildNormalized(parsed, timestamp);
    const dupKey = norm.hash;
    if (seen.has(dupKey)) {
      norm.issues = [...(norm.issues || []), "duplicate_source_url"];
    }
    seen.add(dupKey);
    if (norm.issues && norm.issues.length) withIssues++;
    byTier[norm.authorityTier] = (byTier[norm.authorityTier] || 0) + 1;
    out.write(JSON.stringify(norm) + "\n");
    normalized++;
  }
  out.end();
  return { total, normalized, withIssues, byTier };
}
