/**
 * CDI Analysis Types
 * 
 * Comprehensive type definitions for Clinical Documentation Improvement (CDI) analysis
 * Following Azure Cosmos DB best practices for data modeling and indexing
 */

export interface CDIAnalysisRecord {
  id: string;
  analysisId: string;
  encounterId: string;
  patientFhirId: string;
  facilityId?: string;
  assignedUserId?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  confidence: number;
  financialImpact: {
    potentialIncrease: number;
    currentDRG?: string;
    suggestedDRG?: string;
    documentationGaps: string[];
  };
  recommendations: Array<{
    id: string;
    category: 'documentation' | 'coding' | 'clinical' | 'compliance';
    description: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    implementationEffort: 'low' | 'medium' | 'high';
    potentialImpact: number;
    status: 'open' | 'in_progress' | 'implemented' | 'closed';
  }>;
  clinicalContext: {
    primaryDiagnosis?: string;
    secondaryDiagnoses?: string[];
    procedures?: string[];
    medications?: string[];
    labResults?: Array<{
      test: string;
      value: string;
      unit: string;
      referenceRange?: string;
      isAbnormal: boolean;
    }>;
    vitalSigns?: Array<{
      type: string;
      value: string;
      unit: string;
      timestamp: string;
    }>;
  };
  conversationHistory: Array<{
    id: string;
    timestamp: string;
    userId: string;
    question: string;
    answer: string;
    confidence: number;
    sources: Array<{
      id: string;
      type: 'clinical_note' | 'lab_result' | 'imaging' | 'medication' | 'procedure';
      snippet: string;
      relevance: number;
    }>;
  }>;
  metadata: {
    analysisType: 'enhanced_cdi' | 'standard_cdi' | 'targeted_review';
    modelVersion: string;
    processingTime: number;
    dataSources: string[];
    lastUpdated: string;
  };
  createdAt: string;
  updatedAt: string;
  type: 'cdi_analysis';
}

export interface CDIAnalysisCreateInput {
  encounterId: string;
  patientFhirId: string;
  facilityId?: string;
  assignedUserId?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  includeFinancialAnalysis?: boolean;
  generateQueries?: boolean;
}

export interface CDIAnalysisUpdateInput {
  status?: CDIAnalysisRecord['status'];
  priority?: CDIAnalysisRecord['priority'];
  confidence?: number;
  financialImpact?: Partial<CDIAnalysisRecord['financialImpact']>;
  recommendations?: CDIAnalysisRecord['recommendations'];
  conversationHistory?: CDIAnalysisRecord['conversationHistory'];
  metadata?: Partial<CDIAnalysisRecord['metadata']>;
}

export interface CDIAnalysisListOptions {
  page: number;
  limit: number;
  search?: string;
  status?: CDIAnalysisRecord['status'];
  priority?: CDIAnalysisRecord['priority'];
  assignedUserId?: string;
  facilityId?: string;
  encounterId?: string;
  patientFhirId?: string;
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface CDIAnalysisListResult {
  analyses: CDIAnalysisRecord[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CDIAnalysisStats {
  totalAnalyses: number;
  completedAnalyses: number;
  pendingAnalyses: number;
  failedAnalyses: number;
  totalFinancialImpact: number;
  averageConfidence: number;
  topRecommendations: Array<{
    description: string;
    count: number;
    averageImpact: number;
  }>;
  priorityDistribution: Record<string, number>;
  statusDistribution: Record<string, number>;
}
