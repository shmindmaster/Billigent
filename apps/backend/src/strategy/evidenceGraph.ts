/**
 * Evidence Graph lightweight in-memory representation (POC)
 * NOTE: Built with accessibility and clarity in mind; future iterations should back with a real graph DB.
 */
import crypto from 'crypto';
import { 
  findCitationByTitle, 
  loadNormalizedCitations, 
  computeCitationCoverage,
  type AuthorityTier,
  type NormalizedCitation 
} from './citations';

export type ClinicalFact = { 
  id: string; 
  encounterId: string; 
  text: string; 
  codeIds: string[]; 
  sourceIds: string[];
  authorityScore?: number;
  citationIds?: string[];
};

export type CodeNode = { 
  id: string; 
  system: string; 
  description: string;
  regulatoryCompliance?: boolean;
  lastUpdated?: string;
};

export type RegulationNode = { 
  id: string; 
  citation: string; 
  title: string; 
  bodyHash: string;
  authorityTier?: AuthorityTier;
  effectiveDate?: string;
  citationId?: string;
};

export type DenialPattern = { 
  id: string; 
  payer: string; 
  reasonCode: string; 
  description: string; 
  codeIds: string[];
  evidenceStrength?: number;
  regulatoryBasis?: string[];
};

export type EvidenceSource = { 
  id: string; 
  citation: string; 
  url?: string;
  authorityTier?: AuthorityTier;
  citationId?: string;
  lastVerified?: string;
};

export type KPIObservation = { 
  id: string; 
  kpiId: string; 
  value: number; 
  periodStart: string; 
  periodEnd: string;
  confidence?: number;
  dataSource?: string;
};

export interface EvidenceBundle {
  denialPatternId: string;
  encounterId: string;
  facts: ClinicalFact[];
  codes: CodeNode[];
  regulations: RegulationNode[];
  sources: EvidenceSource[];
  kpis: KPIObservation[];
  bundleHash: string;
  generatedAt: string;
  citationCoverage?: { 
    authoritativeFactCount: number; 
    totalFactCount: number; 
    authoritativePct: number;
    authorityBreakdown: Record<AuthorityTier, number>;
    categoryCoverage: Record<string, number>;
  };
  qualityMetrics?: {
    overallAuthorityScore: number;
    regulatoryComplianceScore: number;
    evidenceDiversityScore: number;
    sourceRecencyScore: number;
    confidenceLevel: 'high' | 'medium' | 'low';
  };
}

class EvidenceGraphStore {
  private facts: ClinicalFact[] = [];
  private codes: CodeNode[] = [];
  private regulations: RegulationNode[] = [];
  private denialPatterns: DenialPattern[] = [];
  private sources: EvidenceSource[] = [];
  private kpis: KPIObservation[] = [];
  private citations: NormalizedCitation[] = [];

  constructor() {
    // Initialize citations on construction
    try {
      this.citations = loadNormalizedCitations();
    } catch (error) {
      console.warn('Failed to load citations:', error);
      this.citations = [];
    }
  }

  seed(data: Partial<{ facts: ClinicalFact[]; codes: CodeNode[]; regulations: RegulationNode[]; denialPatterns: DenialPattern[]; sources: EvidenceSource[]; kpis: KPIObservation[] }>) {
    if (data.facts) this.facts.push(...data.facts);
    if (data.codes) this.codes.push(...data.codes);
    if (data.regulations) this.regulations.push(...data.regulations);
    if (data.denialPatterns) this.denialPatterns.push(...data.denialPatterns);
    if (data.sources) this.sources.push(...data.sources);
    if (data.kpis) this.kpis.push(...data.kpis);
    
    // Process seeded data to add citation information
    this.enrichDataWithCitations();
  }

  private enrichDataWithCitations() {
    // Enrich sources with citation metadata
    this.sources.forEach(source => {
      const citation = findCitationByTitle(source.citation);
      if (citation) {
        source.authorityTier = citation.authorityTier;
        source.citationId = citation.id;
        source.lastVerified = citation.retrievalDate;
      }
    });

    // Enrich regulations with citation metadata
    this.regulations.forEach(regulation => {
      const citation = findCitationByTitle(regulation.citation);
      if (citation) {
        regulation.authorityTier = citation.authorityTier;
        regulation.citationId = citation.id;
      }
    });

    // Enrich facts with authority scores
    this.facts.forEach(fact => {
      fact.authorityScore = this.calculateFactAuthorityScore(fact);
      fact.citationIds = this.extractCitationIdsFromFact(fact);
    });
  }

  private calculateFactAuthorityScore(fact: ClinicalFact): number {
    const sourceCitations = fact.sourceIds
      .map(sourceId => this.sources.find(s => s.id === sourceId))
      .filter(Boolean)
      .map(source => source!.citation);

    if (sourceCitations.length === 0) return 0;

    const tierScores: Record<AuthorityTier, number> = {
      regulatory: 1.0,
      standards: 0.9,
      primary: 0.8,
      secondary: 0.6,
      tertiary: 0.4,
      competitive: 0.3
    };

    let totalScore = 0;
    let validSources = 0;

    sourceCitations.forEach(citation => {
      const normalizedCitation = findCitationByTitle(citation);
      if (normalizedCitation) {
        totalScore += tierScores[normalizedCitation.authorityTier] || 0;
        validSources++;
      }
    });

    return validSources > 0 ? totalScore / validSources : 0;
  }

  private extractCitationIdsFromFact(fact: ClinicalFact): string[] {
    return fact.sourceIds
      .map(sourceId => this.sources.find(s => s.id === sourceId))
      .filter(Boolean)
      .map(source => source!.citationId)
      .filter(Boolean) as string[];
  }

  buildEvidenceBundle(denialPatternId: string, encounterId: string, options?: { 
    includeKpi?: boolean; 
    maxRegulations?: number;
    minAuthorityScore?: number;
    requireRegulatoryCompliance?: boolean;
  }): EvidenceBundle | null {
    const pattern = this.denialPatterns.find(p => p.id === denialPatternId);
    if (!pattern) return null;

    // For POC: include all facts referencing at least one code in pattern
    let facts = this.facts.filter(f => 
      f.encounterId === encounterId && 
      f.codeIds.some(c => pattern.codeIds.includes(c))
    );

    // Filter by authority score if specified
    if (options?.minAuthorityScore !== undefined) {
      facts = facts.filter(f => (f.authorityScore || 0) >= options.minAuthorityScore!);
    }

    const codeSet = new Set(facts.flatMap(f => f.codeIds));
    const codes = this.codes.filter(c => codeSet.has(c.id));

    // Enhanced regulation association with authority scoring
    let regs = this.regulations.filter(r => 
      codes.some(c => r.citation.includes(c.id.split(':').pop() || ''))
    );
    
    if (options?.requireRegulatoryCompliance) {
      regs = regs.filter(r => r.authorityTier === 'regulatory');
    }
    
    if (options?.maxRegulations) {
      regs = regs.slice(0, options.maxRegulations);
    }

    const sourceSet = new Set<string>();
    facts.forEach(f => f.sourceIds.forEach(s => sourceSet.add(s)));
    const sources = this.sources.filter(s => sourceSet.has(s.id));
    
    const kpis = options?.includeKpi ? 
      this.kpis.filter(k => k.periodEnd >= new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString()) : 
      [];

    const raw = JSON.stringify({ facts, codes, regs, sources, kpis });
    const bundleHash = 'sha256:' + crypto.createHash('sha256').update(raw).digest('hex');

    // Enhanced citation coverage analysis
    const citationCoverage = this.computeEnhancedCitationCoverage(facts, sources);
    
    // Calculate quality metrics
    const qualityMetrics = this.calculateBundleQualityMetrics(facts, codes, regs, sources);

    return {
      denialPatternId,
      encounterId,
      facts,
      codes,
      regulations: regs,
      sources,
      kpis,
      bundleHash,
      generatedAt: new Date().toISOString(),
      citationCoverage,
      qualityMetrics
    };
  }

  private computeEnhancedCitationCoverage(facts: ClinicalFact[], sources: EvidenceSource[]) {
    const sourceCitations = facts.flatMap(f => f.sourceIds.map(sid => {
      const src = sources.find(s => s.id === sid);
      return src?.citation || '';
    })).filter(Boolean);

    const basicCoverage = computeCitationCoverage(sourceCitations);
    
    // Enhanced breakdown by authority tier
    const authorityBreakdown: Record<AuthorityTier, number> = {
      regulatory: 0,
      standards: 0,
      primary: 0,
      secondary: 0,
      tertiary: 0,
      competitive: 0
    };

    const categoryCoverage: Record<string, number> = {};

    sourceCitations.forEach(citation => {
      const normalizedCitation = findCitationByTitle(citation);
      if (normalizedCitation) {
        authorityBreakdown[normalizedCitation.authorityTier]++;
        categoryCoverage[normalizedCitation.category] = 
          (categoryCoverage[normalizedCitation.category] || 0) + 1;
      }
    });

    return {
      ...basicCoverage,
      authorityBreakdown,
      categoryCoverage
    };
  }

  private calculateBundleQualityMetrics(
    facts: ClinicalFact[], 
    codes: CodeNode[], 
    regulations: RegulationNode[], 
    sources: EvidenceSource[]
  ) {
    // Overall authority score
    const factScores = facts.map(f => f.authorityScore || 0);
    const overallAuthorityScore = factScores.length > 0 ? 
      factScores.reduce((sum, score) => sum + score, 0) / factScores.length : 0;

    // Regulatory compliance score
    const regulatorySources = sources.filter(s => s.authorityTier === 'regulatory');
    const regulatoryComplianceScore = sources.length > 0 ? 
      regulatorySources.length / sources.length : 0;

    // Evidence diversity score (based on unique source categories)
    const uniqueCategories = new Set(sources.map(s => s.authorityTier));
    const evidenceDiversityScore = uniqueCategories.size / 6; // 6 possible authority tiers

    // Source recency score
    const now = new Date();
    const recencyScores = sources.map(s => {
      if (!s.lastVerified) return 0.5; // Default score for unknown dates
      const daysSince = (now.getTime() - new Date(s.lastVerified).getTime()) / (1000 * 60 * 60 * 24);
      if (daysSince < 30) return 1.0; // Very recent
      if (daysSince < 90) return 0.8; // Recent
      if (daysSince < 365) return 0.6; // Within year
      return 0.4; // Older
    });
    const sourceRecencyScore = recencyScores.length > 0 ? 
      recencyScores.reduce((sum, score) => sum + score, 0) / recencyScores.length : 0;

    // Overall confidence level
    const avgScore = (overallAuthorityScore + regulatoryComplianceScore + evidenceDiversityScore + sourceRecencyScore) / 4;
    let confidenceLevel: 'high' | 'medium' | 'low' = 'low';
    if (avgScore >= 0.7) confidenceLevel = 'high';
    else if (avgScore >= 0.4) confidenceLevel = 'medium';

    return {
      overallAuthorityScore,
      regulatoryComplianceScore,
      evidenceDiversityScore,
      sourceRecencyScore,
      confidenceLevel
    };
  }

  // New methods for citation-based analysis
  getCitationsByAuthorityTier(tier: AuthorityTier): NormalizedCitation[] {
    return this.citations.filter(c => c.authorityTier === tier);
  }

  getCitationsByCategory(category: string): NormalizedCitation[] {
    return this.citations.filter(c => c.category === category);
  }

  findRelatedCitations(citationId: string): NormalizedCitation[] {
    const citation = this.citations.find(c => c.id === citationId);
    if (!citation) return [];

    // Find citations in the same category or with similar authority tier
    return this.citations.filter(c => 
      c.id !== citationId && 
      (c.category === citation.category || c.authorityTier === citation.authorityTier)
    );
  }

  getCitationStatistics(): {
    total: number;
    byAuthorityTier: Record<AuthorityTier, number>;
    byCategory: Record<string, number>;
    withIssues: number;
  } {
    const byAuthorityTier: Record<AuthorityTier, number> = {
      regulatory: 0,
      standards: 0,
      primary: 0,
      secondary: 0,
      tertiary: 0,
      competitive: 0
    };

    const byCategory: Record<string, number> = {};
    let withIssues = 0;

    this.citations.forEach(citation => {
      byAuthorityTier[citation.authorityTier]++;
      byCategory[citation.category] = (byCategory[citation.category] || 0) + 1;
      if (citation.issues && citation.issues.length > 0) withIssues++;
    });

    return {
      total: this.citations.length,
      byAuthorityTier,
      byCategory,
      withIssues
    };
  }
}

export const evidenceGraph = new EvidenceGraphStore();

// Seed with enhanced mock data
if (!process.env.SKIP_EVIDENCE_GRAPH_SEED) {
  evidenceGraph.seed({
    codes: [
      { 
        id: 'CODE:ICD10:I50.21', 
        system: 'ICD10', 
        description: 'Acute systolic (congestive) heart failure',
        regulatoryCompliance: true,
        lastUpdated: '2025-01-15'
      },
      { 
        id: 'CODE:ICD10:E11.9', 
        system: 'ICD10', 
        description: 'Type 2 diabetes mellitus without complications',
        regulatoryCompliance: true,
        lastUpdated: '2025-01-15'
      }
    ],
    facts: [
      { 
        id: 'CF:1', 
        encounterId: 'ENC:demo1', 
        text: 'Acute systolic heart failure documented.', 
        codeIds: ['CODE:ICD10:I50.21'], 
        sourceIds: ['EVID:chf_guideline'] 
      },
      { 
        id: 'CF:2', 
        encounterId: 'ENC:demo1', 
        text: 'Patient with history of Type 2 DM.', 
        codeIds: ['CODE:ICD10:E11.9'], 
        sourceIds: ['EVID:dm_guideline'] 
      }
    ],
    regulations: [
      { 
        id: 'REG:HIPAA:164.312', 
        citation: 'HIPAA Security Rule Technical Safeguards §164.312', 
        title: 'Technical Safeguards', 
        bodyHash: 'hash1',
        authorityTier: 'regulatory',
        effectiveDate: '2023-01-01'
      }
    ],
    denialPatterns: [
      { 
        id: 'DEN:PAYERA:CO45', 
        payer: 'PayerA', 
        reasonCode: 'CO45', 
        description: 'Charge exceeds fee schedule', 
        codeIds: ['CODE:ICD10:I50.21'],
        evidenceStrength: 0.8,
        regulatoryBasis: ['CMS Fee Schedule', 'ICD-10 Guidelines']
      }
    ],
    sources: [
      { 
        id: 'EVID:chf_guideline', 
        citation: 'CDC NCHS ICD-10-CM Files',
        url: 'https://www.cdc.gov/nchs/icd/icd-10-cm/files.html',
        authorityTier: 'regulatory',
        lastVerified: '2025-01-15'
      },
      { 
        id: 'EVID:dm_guideline', 
        citation: 'CMS ICD-10-CM Guidelines FY2025',
        url: 'https://www.cms.gov/files/document/fy-2025-icd-10-cm-coding-guidelines.pdf',
        authorityTier: 'regulatory',
        lastVerified: '2025-01-15'
      }
    ],
    kpis: [
      { 
        id: 'KPIOBS:1', 
        kpiId: 'initial_denial_rate', 
        value: 0.085, 
        periodStart: '2025-07-01', 
        periodEnd: '2025-07-31',
        confidence: 0.9,
        dataSource: 'Claims Processing System'
      }
    ]
  });
}
