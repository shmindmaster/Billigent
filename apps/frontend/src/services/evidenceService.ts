import axios from 'axios';

// Types for evidence graph integration
export interface ClinicalFact {
  id: string;
  encounterId: string;
  text: string;
  codeIds: string[];
  sourceIds: string[];
}

export interface CodeNode {
  id: string;
  system: string;
  description: string;
}

export interface RegulationNode {
  id: string;
  citation: string;
  title: string;
  bodyHash: string;
}

export interface EvidenceSource {
  id: string;
  citation: string;
  url?: string;
}

export interface KPIObservation {
  id: string;
  kpiId: string;
  value: number;
  periodStart: string;
  periodEnd: string;
}

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
}

export interface AppealDraftPacket {
  draftId: string;
  encounterId: string;
  denialPatternId: string;
  narrative: string;
  factCitations: { factId: string; sourceIds: string[] }[];
  codingJustification: string[];
  riskFlags: { type: string; message: string }[];
  confidence: number;
  version: string;
}

export interface AttributionSpan {
  spanId: string;
  factId?: string;
  codeId?: string;
  weight: number;
}

export interface AttributionPacket {
  packetId: string;
  draftId: string;
  spans: AttributionSpan[];
  normalization: 'l1';
  checksum: string;
  confidence: number;
  version: string;
}

export interface AttributionValidation {
  valid: boolean;
  issues: string[];
}

export interface AppealResponse {
  draft: AppealDraftPacket;
  attribution: AttributionPacket;
  validation: AttributionValidation;
}

export interface KPIRule {
  name: string;
  left: string;
  op: '>' | '<' | '>=' | '<=' | '==' | '!=';
  right: number;
  action: { type: 'emit_event'; eventType: string };
}

export interface KPIRuleEvaluation {
  parsed: KPIRule;
  fired: any[];
}

export interface StrategyEvent {
  type: string;
  occurredAt: string;
  payload: any;
  version: string;
}

// Evidence Graph Service
class EvidenceService {
  private baseURL: string;

  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
  }

  /**
   * Build evidence bundle for a specific denial pattern and encounter
   */
  async buildEvidenceBundle(
    patternId: string, 
    encounterId: string, 
    options?: { includeKpi?: boolean; maxRegulations?: number }
  ): Promise<EvidenceBundle> {
    const params = new URLSearchParams();
    if (options?.includeKpi) params.append('includeKpi', 'true');
    if (options?.maxRegulations) params.append('maxRegulations', options.maxRegulations.toString());

    const response = await axios.get(
      `${this.baseURL}/api/strategy/evidence/${patternId}/${encounterId}?${params}`
    );
    return response.data;
  }

  /**
   * Generate appeal draft with attribution and validation
   */
  async generateAppealDraft(
    patternId: string, 
    encounterId: string
  ): Promise<AppealResponse> {
    const response = await axios.get(
      `${this.baseURL}/api/strategy/appeal/${patternId}/${encounterId}`
    );
    return response.data;
  }

  /**
   * Evaluate KPI rule against current metrics
   */
  async evaluateKPIRule(rule: string, metrics: Record<string, number>): Promise<KPIRuleEvaluation> {
    const response = await axios.post(`${this.baseURL}/api/strategy/rule/eval`, {
      rule,
      metrics
    });
    return response.data;
  }

  /**
   * Get recent strategy events
   */
  async getStrategyEvents(): Promise<StrategyEvent[]> {
    const response = await axios.get(`${this.baseURL}/api/strategy/events`);
    return response.data;
  }

  /**
   * Generate conversational AI response for CDI queries
   */
  async generateConversationalResponse(
    query: string,
    context: {
      caseId: string;
      patientInfo?: string;
      clinicalSummary?: string;
      currentDRG?: string;
      patientId?: string;
      diagnosisCodes?: string[];
    }
  ): Promise<{
    response: {
      responseId: string;
      content: string;
      confidence: number;
      sources: string[];
      suggestedActions: string[];
      metadata: {
        modelUsed: string;
        tokensUsed: number;
        processingTime: number;
      };
    };
    relevantDocuments: any[];
    searchMetadata: {
      documentsFound: number;
      searchTime: number;
    };
  }> {
    const response = await axios.post(`${this.baseURL}/api/strategy/conversational`, {
      query,
      context
    });
    return response.data;
  }

  /**
   * Search for clinical evidence
   */
  async searchClinicalEvidence(
    query: string,
    context?: {
      encounterId?: string;
      patientId?: string;
      diagnosisCodes?: string[];
      clinicalNotes?: string;
      dateRange?: {
        start: string;
        end: string;
      };
    }
  ): Promise<{
    results: any[];
    totalCount: number;
    searchTime: number;
    queryType: 'keyword' | 'vector' | 'hybrid';
    metadata: {
      modelUsed: string;
      tokensProcessed: number;
    };
  }> {
    const response = await axios.post(`${this.baseURL}/api/strategy/search/clinical`, {
      query,
      context
    });
    return response.data;
  }

  /**
   * Search for denial patterns
   */
  async searchDenialPatterns(
    denialReason: string,
    diagnosisCodes: string[],
    context?: {
      encounterId?: string;
      patientId?: string;
      dateRange?: {
        start: string;
        end: string;
      };
    }
  ): Promise<{
    results: any[];
    totalCount: number;
    searchTime: number;
    queryType: 'keyword' | 'vector' | 'hybrid';
    metadata: {
      modelUsed: string;
      tokensProcessed: number;
    };
  }> {
    const response = await axios.post(`${this.baseURL}/api/strategy/search/denial-patterns`, {
      denialReason,
      diagnosisCodes,
      context
    });
    return response.data;
  }

  /**
   * Check Azure services health
   */
  async checkAzureHealth(): Promise<{
    timestamp: string;
    services: {
      openai: string;
      search: string;
    };
  }> {
    const response = await axios.get(`${this.baseURL}/api/strategy/health/azure`);
    return response.data;
  }

  /**
   * Build evidence bundle for a case (helper method)
   */
  async buildCaseEvidenceBundle(
    caseId: string, 
    denialPatternId?: string
  ): Promise<EvidenceBundle | null> {
    try {
      // If no specific denial pattern, use a default one for the case
      const patternId = denialPatternId || `DEN:CASE:${caseId}`;
      return await this.buildEvidenceBundle(patternId, caseId, { 
        includeKpi: true, 
        maxRegulations: 5 
      });
    } catch (error) {
      console.error('Failed to build evidence bundle:', error);
      return null;
    }
  }

  /**
   * Get evidence summary for a case
   */
  async getCaseEvidenceSummary(caseId: string): Promise<{
    factCount: number;
    codeCount: number;
    regulationCount: number;
    sourceCount: number;
    hasAttribution: boolean;
  } | null> {
    try {
      const bundle = await this.buildCaseEvidenceBundle(caseId);
      if (!bundle) return null;

      return {
        factCount: bundle.facts.length,
        codeCount: bundle.codes.length,
        regulationCount: bundle.regulations.length,
        sourceCount: bundle.sources.length,
        hasAttribution: bundle.bundleHash.length > 0,
      };
    } catch (error) {
      console.error('Failed to get evidence summary:', error);
      return null;
    }
  }
}

export const evidenceService = new EvidenceService();
export default evidenceService;
