/**
 * Evidence Graph lightweight in-memory representation (POC)
 * NOTE: Built with accessibility and clarity in mind; future iterations should back with a real graph DB.
 */
import crypto from 'crypto';

export type ClinicalFact = { id: string; encounterId: string; text: string; codeIds: string[]; sourceIds: string[] };
export type CodeNode = { id: string; system: string; description: string };
export type RegulationNode = { id: string; citation: string; title: string; bodyHash: string };
export type DenialPattern = { id: string; payer: string; reasonCode: string; description: string; codeIds: string[] };
export type EvidenceSource = { id: string; citation: string; url?: string };
export type KPIObservation = { id: string; kpiId: string; value: number; periodStart: string; periodEnd: string };

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
  citationCoverage?: { authoritativeFactCount: number; totalFactCount: number; authoritativePct: number };
}

class EvidenceGraphStore {
  private facts: ClinicalFact[] = [];
  private codes: CodeNode[] = [];
  private regulations: RegulationNode[] = [];
  private denialPatterns: DenialPattern[] = [];
  private sources: EvidenceSource[] = [];
  private kpis: KPIObservation[] = [];

  seed(data: Partial<{ facts: ClinicalFact[]; codes: CodeNode[]; regulations: RegulationNode[]; denialPatterns: DenialPattern[]; sources: EvidenceSource[]; kpis: KPIObservation[] }>) {
    if (data.facts) this.facts.push(...data.facts);
    if (data.codes) this.codes.push(...data.codes);
    if (data.regulations) this.regulations.push(...data.regulations);
    if (data.denialPatterns) this.denialPatterns.push(...data.denialPatterns);
    if (data.sources) this.sources.push(...data.sources);
    if (data.kpis) this.kpis.push(...data.kpis);
  }

  buildEvidenceBundle(denialPatternId: string, encounterId: string, options?: { includeKpi?: boolean; maxRegulations?: number }): EvidenceBundle | null {
    const pattern = this.denialPatterns.find(p => p.id === denialPatternId);
    if (!pattern) return null;

    // For POC: include all facts referencing at least one code in pattern
    const facts = this.facts.filter(f => f.encounterId === encounterId && f.codeIds.some(c => pattern.codeIds.includes(c)));
    const codeSet = new Set(facts.flatMap(f => f.codeIds));
    const codes = this.codes.filter(c => codeSet.has(c.id));

    // naive regulation association: codes prefix match
    let regs = this.regulations.filter(r => codes.some(c => r.citation.includes(c.id.split(':').pop() || '')));
    if (options?.maxRegulations) regs = regs.slice(0, options.maxRegulations);

    const sourceSet = new Set<string>();
    facts.forEach(f => f.sourceIds.forEach(s => sourceSet.add(s)));
    const sources = this.sources.filter(s => sourceSet.has(s.id));
    const kpis = options?.includeKpi ? this.kpis.filter(k => k.periodEnd >= new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString()) : [];

    const raw = JSON.stringify({ facts, codes, regs, sources, kpis });
    const bundleHash = 'sha256:' + crypto.createHash('sha256').update(raw).digest('hex');

    // Attempt citation coverage (lazy load; optional)
    let citationCoverage: { authoritativeFactCount: number; totalFactCount: number; authoritativePct: number } | undefined;
    try {
      // Dynamically require to avoid circular/early load issues
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { computeCitationCoverage } = require('./citations');
      const sourceCitations = facts.flatMap(f => f.sourceIds.map(sid => {
        const src = sources.find(s => s.id === sid);
        return src?.citation || '';
      })).filter(Boolean);
      citationCoverage = computeCitationCoverage(sourceCitations);
    } catch {
      // silently ignore if citations module or file absent
    }

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
      citationCoverage
    };
  }
}

export const evidenceGraph = new EvidenceGraphStore();

// Seed with tiny mock data
if (!process.env.SKIP_EVIDENCE_GRAPH_SEED) {
  evidenceGraph.seed({
    codes: [
      { id: 'CODE:ICD10:I50.21', system: 'ICD10', description: 'Acute systolic (congestive) heart failure' },
      { id: 'CODE:ICD10:E11.9', system: 'ICD10', description: 'Type 2 diabetes mellitus without complications' }
    ],
    facts: [
      { id: 'CF:1', encounterId: 'ENC:demo1', text: 'Acute systolic heart failure documented.', codeIds: ['CODE:ICD10:I50.21'], sourceIds: ['EVID:chf_guideline'] },
      { id: 'CF:2', encounterId: 'ENC:demo1', text: 'Patient with history of Type 2 DM.', codeIds: ['CODE:ICD10:E11.9'], sourceIds: ['EVID:dm_guideline'] }
    ],
    regulations: [
      { id: 'REG:HIPAA:164.312', citation: 'HIPAA 164.312', title: 'Technical Safeguards', bodyHash: 'hash1' }
    ],
    denialPatterns: [
      { id: 'DEN:PAYERA:CO45', payer: 'PayerA', reasonCode: 'CO45', description: 'Charge exceeds fee schedule', codeIds: ['CODE:ICD10:I50.21'] }
    ],
    sources: [
      { id: 'EVID:chf_guideline', citation: 'CHF Clinical Guideline 2025' },
      { id: 'EVID:dm_guideline', citation: 'Diabetes Guideline 2025' }
    ],
    kpis: [
      { id: 'KPIOBS:1', kpiId: 'initial_denial_rate', value: 0.085, periodStart: '2025-07-01', periodEnd: '2025-07-31' }
    ]
  });
}
