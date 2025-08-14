# Citation Usage Guide

This guide explains how to use Billigent's citation system for evidence validation, authority tracking, and compliance verification.

## 🏗️ **System Architecture**

### Citation Data Flow
```
Raw Sources → Corpus Processing → Normalized Citations → Citation Cache → Application Services
     ↓              ↓                    ↓                ↓              ↓
  External      Normalization      Canonical IDs    In-Memory      Evidence Graph
  Sources       & Validation       & Metadata       Storage       & Strategy
```

### Core Components
- **`corpus.jsonl`**: Raw source data from external sources
- **`normalized_citations.jsonl`**: Processed, canonical citations with metadata
- **`citations.ts`**: Core citation processing and validation service
- **Citation Cache**: In-memory singleton for fast lookups

## 📚 **Citation Categories & Authority Tiers**

### Authority Hierarchy (Most to Least Authoritative)
1. **`regulatory`** - Government regulations (CMS, HIPAA, ICD-10)
2. **`standards`** - Industry standards (HL7 FHIR, HFMA, ACDIS)
3. **`primary`** - Original research and primary data sources
4. **`secondary`** - Analysis and commentary on primary sources
5. **`tertiary`** - Summaries and overviews
6. **`competitive`** - Competitive intelligence and market analysis

### Category Examples
- **`icd_10_cm`**: ICD-10-CM coding standards
- **`icd_10_pcs`**: ICD-10-PCS procedure coding
- **`ms_drg`**: MS-DRG classification systems
- **`hl7_fhir`**: FHIR data exchange standards
- **`denials_primary`**: Primary denial rate research
- **`azure_ai_search`**: Azure AI Search documentation

## 🔧 **Using the Citation System**

### Basic Citation Lookup

```typescript
import { findCitationByTitle, loadNormalizedCitations } from '../strategy/citations';

// Load all citations
const allCitations = loadNormalizedCitations();

// Find specific citation by title
const citation = findCitationByTitle('CDC NCHS ICD-10-CM Files');
if (citation) {
  console.log(`Authority: ${citation.authorityTier}`);
  console.log(`Category: ${citation.category}`);
  console.log(`URL: ${citation.url}`);
}
```

### Citation Coverage Analysis

```typescript
import { computeCitationCoverage } from '../strategy/citations';

// Analyze fact source citations
const factSources = [
  'CDC NCHS ICD-10-CM Files',
  'CMS ICD-10 Guidelines',
  'Unknown Source'
];

const coverage = computeCitationCoverage(factSources);
console.log(`Authoritative coverage: ${coverage.authoritativePct * 100}%`);
// Output: Authoritative coverage: 66.67%
```

### Citation Validation

```typescript
import { buildNormalized, RawCorpusEntry } from '../strategy/citations';

// Validate and normalize a new citation
const newCitation: RawCorpusEntry = {
  source: 'New Clinical Guideline 2025',
  url: 'https://example.com/guideline',
  category: 'clinical_guidelines',
  notes: 'Updated clinical practice guidelines'
};

const normalized = buildNormalized(newCitation, new Date().toISOString());
console.log(`Citation ID: ${normalized.id}`);
console.log(`Authority Tier: ${normalized.authorityTier}`);
console.log(`Issues: ${normalized.issues?.join(', ') || 'None'}`);
```

## 🔗 **Integration with Evidence Graph**

### Evidence-Citation Linking

```typescript
// Example: Linking evidence to citations
interface EvidenceWithCitations {
  id: string;
  content: string;
  citations: string[]; // Citation IDs
  authorityScore: number;
}

function calculateEvidenceAuthority(evidence: EvidenceWithCitations): number {
  const citations = evidence.citations.map(id => 
    findCitationByTitle(id)
  ).filter(Boolean);
  
  const tierScores = {
    regulatory: 1.0,
    standards: 0.9,
    primary: 0.8,
    secondary: 0.6,
    tertiary: 0.4,
    competitive: 0.3
  };
  
  return citations.reduce((score, citation) => 
    score + (tierScores[citation.authorityTier] || 0), 0
  ) / citations.length;
}
```

### Citation-Based Evidence Filtering

```typescript
// Filter evidence by authority requirements
function filterEvidenceByAuthority(
  evidence: EvidenceWithCitations[], 
  minAuthorityTier: AuthorityTier
): EvidenceWithCitations[] {
  const tierOrder = ['regulatory', 'standards', 'primary', 'secondary', 'tertiary', 'competitive'];
  const minIndex = tierOrder.indexOf(minAuthorityTier);
  
  return evidence.filter(e => {
    const authority = calculateEvidenceAuthority(e);
    const tierIndex = tierOrder.findIndex(tier => 
      tier === e.citations.find(c => c.authorityTier === tier)?.authorityTier
    );
    return tierIndex <= minIndex;
  });
}
```

## 📊 **Citation Analytics & Reporting**

### Authority Distribution Analysis

```typescript
function analyzeCitationAuthority(): Record<AuthorityTier, number> {
  const citations = loadNormalizedCitations();
  const distribution: Record<AuthorityTier, number> = {};
  
  citations.forEach(citation => {
    distribution[citation.authorityTier] = 
      (distribution[citation.authorityTier] || 0) + 1;
  });
  
  return distribution;
}

// Usage
const authorityDist = analyzeCitationAuthority();
console.log('Citation Authority Distribution:', authorityDist);
```

### Category Coverage Analysis

```typescript
function analyzeCategoryCoverage(): Record<string, { count: number; authorityTiers: AuthorityTier[] }> {
  const citations = loadNormalizedCitations();
  const coverage: Record<string, { count: number; authorityTiers: AuthorityTier[] }> = {};
  
  citations.forEach(citation => {
    if (!coverage[citation.category]) {
      coverage[citation.category] = { count: 0, authorityTiers: [] };
    }
    coverage[citation.category].count++;
    if (!coverage[citation.category].authorityTiers.includes(citation.authorityTier)) {
      coverage[citation.category].authorityTiers.push(citation.authorityTier);
    }
  });
  
  return coverage;
}
```

## 🚨 **Quality Control & Issues**

### Common Citation Issues

1. **`missing_url`**: Citation lacks a URL reference
2. **`unclassified_fallback`**: Could not determine authority tier automatically
3. **`duplicate_source_url`**: Duplicate citation detected

### Issue Resolution

```typescript
// Check for citations with issues
function findCitationsWithIssues(): NormalizedCitation[] {
  const citations = loadNormalizedCitations();
  return citations.filter(c => c.issues && c.issues.length > 0);
}

// Resolve unclassified citations
function suggestAuthorityTier(citation: NormalizedCitation): AuthorityTier {
  // Add custom classification logic here
  if (citation.category.includes('denial')) return 'primary';
  if (citation.category.includes('competitive')) return 'competitive';
  return 'secondary';
}
```

## 🔄 **Citation Maintenance**

### Adding New Citations

1. **Update `corpus.jsonl`** with new sources
2. **Run normalization script** to process new entries
3. **Validate results** using test suite
4. **Deploy updated citations** to production

### Citation Update Workflow

```bash
# Process new citations
cd apps/backend
npm run test:citation:normalization

# Verify results
npm run test:citation:coverage
```

### Automated Citation Validation

```typescript
// Health check for citation system
export function citationSystemHealth(): {
  status: 'healthy' | 'degraded' | 'unhealthy';
  issues: string[];
  metrics: {
    totalCitations: number;
    citationsWithIssues: number;
    authorityCoverage: Record<AuthorityTier, number>;
  };
} {
  const citations = loadNormalizedCitations();
  const issues = findCitationsWithIssues();
  
  const authorityCoverage = analyzeCitationAuthority();
  const totalCitations = citations.length;
  const citationsWithIssues = issues.length;
  
  let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
  if (citationsWithIssues > totalCitations * 0.1) status = 'degraded';
  if (citationsWithIssues > totalCitations * 0.3) status = 'unhealthy';
  
  return {
    status,
    issues: issues.map(c => `${c.id}: ${c.issues?.join(', ')}`),
    metrics: {
      totalCitations,
      citationsWithIssues,
      authorityCoverage
    }
  };
}
```

## 📈 **Performance Considerations**

### Caching Strategy
- Citations are loaded once and cached in memory
- Cache is thread-safe and shared across requests
- Consider cache invalidation for citation updates

### Memory Usage
- Each citation uses approximately 200-300 bytes
- 48 citations ≈ 12-14 KB memory usage
- Scale to thousands of citations without significant memory impact

### Lookup Performance
- Title-based lookups: O(1) with Map structure
- Full-text search: Consider Azure AI Search integration
- Bulk operations: Process citations in batches

## 🔮 **Future Enhancements**

### Planned Features
1. **Citation Versioning**: Track changes to citations over time
2. **Automated Updates**: Periodic refresh from source systems
3. **Citation Relationships**: Link related citations and sources
4. **Advanced Analytics**: Citation impact and usage metrics
5. **Integration APIs**: REST endpoints for external citation access

### Integration Opportunities
- **Azure AI Search**: Full-text search across citations
- **Azure Cognitive Services**: Automated content analysis
- **Power BI**: Citation analytics and reporting
- **Azure DevOps**: Citation quality gates in CI/CD

## 📚 **Examples & Use Cases**

### Use Case 1: Compliance Validation
```typescript
// Validate that evidence meets regulatory requirements
function validateRegulatoryCompliance(evidence: EvidenceWithCitations): boolean {
  const citations = evidence.citations.map(id => findCitationByTitle(id));
  return citations.some(c => c?.authorityTier === 'regulatory');
}
```

### Use Case 2: Evidence Scoring
```typescript
// Score evidence based on citation authority
function scoreEvidence(evidence: EvidenceWithCitations): number {
  const authorityScore = calculateEvidenceAuthority(evidence);
  const citationCount = evidence.citations.length;
  const coverageBonus = Math.min(citationCount * 0.1, 0.5);
  
  return Math.min(authorityScore + coverageBonus, 1.0);
}
```

### Use Case 3: Source Diversity Analysis
```typescript
// Analyze source diversity for evidence
function analyzeSourceDiversity(evidence: EvidenceWithCitations): {
  uniqueSources: number;
  authoritySpread: AuthorityTier[];
  categoryCoverage: string[];
} {
  const citations = evidence.citations.map(id => findCitationByTitle(id));
  const uniqueSources = new Set(citations.map(c => c?.url)).size;
  const authoritySpread = [...new Set(citations.map(c => c?.authorityTier))];
  const categoryCoverage = [...new Set(citations.map(c => c?.category))];
  
  return { uniqueSources, authoritySpread, categoryCoverage };
}
```

## 🆘 **Troubleshooting**

### Common Problems

**Problem**: Citations not loading
**Solution**: Check file paths and permissions for `normalized_citations.jsonl`

**Problem**: Authority tier classification incorrect
**Solution**: Review `CATEGORY_TIER_MAP` rules in `citations.ts`

**Problem**: Performance issues with large citation sets
**Solution**: Implement pagination and lazy loading for citation operations

### Debug Mode

```typescript
// Enable debug logging
process.env.DEBUG_CITATIONS = 'true';

// Citation system will log detailed information about:
// - File loading operations
// - Cache hits/misses
// - Classification decisions
// - Performance metrics
```

## 📞 **Support & Resources**

- **Documentation**: This guide and related technical docs
- **Code Examples**: See `apps/backend/src/strategy/citations.ts`
- **Tests**: Run `npm run test:citation:*` for validation
- **Issues**: Report problems via GitHub issues

---

*Last updated: January 2025*
*Version: 1.0*
