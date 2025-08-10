export interface CaseDetail {
  id: string;
  patientId: string;
  patientName: string;
  encounterDate: string;
  admissionDate: string;
  currentDRG: string;
  suggestedFinding: string;
  potentialImpact: number;
  status: 'New' | 'Queried' | 'In Progress' | 'Completed';
  evidence: ClinicalEvidence[];
  // Optional structured ICD suggestion payload
  icdSuggestions?: {
    suggested_codes: Array<{ code: string; description: string; rationale: string }>;
    confidence_score: number;
  };
}

export interface ClinicalEvidence {
  id: string;
  type: 'lab_result' | 'physician_note' | 'vital_signs' | 'medication' | 'imaging';
  title: string;
  timestamp: string;
  content: string;
  highlightedTerms: string[];
  relevanceScore: number;
  severity?: 'Low' | 'Medium' | 'High' | 'Critical';
  trending?: 'Improving' | 'Stable' | 'Worsening';
}

export interface QueryAction {
  caseId: string;
  action: 'agree' | 'disagree';
  notes?: string;
}

export interface PhysicianQuery {
  id: string;
  caseId: string;
  queryText: string;
  sentDate: string;
  dueDate: string;
  status: 'Sent' | 'Responded' | 'Overdue' | 'Cancelled';
  physicianResponse?: string;
  responseDate?: string;
  impact: 'DRG Change' | 'CC/MCC Addition' | 'Documentation Clarification';
}