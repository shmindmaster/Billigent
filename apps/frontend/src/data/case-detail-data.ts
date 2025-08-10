import { CaseDetail, ClinicalEvidence } from '@/types/case-detail';

const API_BASE = (import.meta as any)?.env?.VITE_API_BASE || 'http://localhost:3001';

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const resp = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });
  const data = await resp.json().catch(() => ({}));
  if (!resp.ok) throw new Error((data as any)?.error || `Request failed (${resp.status})`);
  return data as T;
}

export async function getCaseDetail(caseId: number): Promise<CaseDetail> {
  const full = await http<any>(`/api/cases/${caseId}`);

  const evidenceList: ClinicalEvidence[] = Array.isArray(full?.cdiReview?.evidence)
    ? full.cdiReview.evidence.map((e: any, idx: number) => ({
        id: String(e?.evidenceId ?? idx),
        type: (e?.type as ClinicalEvidence['type']) || 'physician_note',
        title: e?.title || 'Evidence',
        timestamp: (e?.timestamp ? new Date(e.timestamp) : new Date()).toISOString(),
        content: e?.content || e?.text || '',
        highlightedTerms: Array.isArray(e?.highlightedTerms) ? e.highlightedTerms : [],
        relevanceScore: Number(e?.relevanceScore ?? 80),
        severity: e?.severity,
        trending: e?.trending,
      }))
    : [];

  const impactRaw: any = full?.cdiReview?.potentialFinancialImpact ?? 0;
  const potentialImpact = typeof impactRaw === 'object' && impactRaw !== null && 'toNumber' in impactRaw
    ? (impactRaw as any).toNumber()
    : Number(impactRaw) || 0;

  let icdSuggestions: CaseDetail['icdSuggestions'] | undefined = undefined;
  try {
    if (typeof full?.cdiReview?.clinicalEvidence === 'string') {
      const parsed = JSON.parse(full.cdiReview.clinicalEvidence);
      if (parsed && parsed.icd_suggestions && Array.isArray(parsed.icd_suggestions.suggested_codes)) {
        icdSuggestions = parsed.icd_suggestions as CaseDetail['icdSuggestions'];
      }
    }
  } catch {
    // Ignore parsing errors
  }

  const detail: CaseDetail = {
    id: String(full?.caseId ?? caseId),
    patientId: String(full?.patientFhirId ?? 'Unknown'),
    patientName: full?.assignedUser?.fullName ? `Patient of ${full.assignedUser.fullName}` : `Patient ${full?.patientFhirId ?? ''}`,
    encounterDate: (full?.createdAt ? new Date(full.createdAt) : new Date()).toISOString().split('T')[0],
    admissionDate: (full?.createdAt ? new Date(full.createdAt) : new Date()).toISOString().split('T')[0],
    currentDRG: full?.cdiReview?.currentDRG || 'Unknown',
    suggestedFinding: full?.cdiReview?.suggestedFinding || '—',
    potentialImpact,
    status: (full?.cdiReview?.status as CaseDetail['status']) || 'New',
    evidence: evidenceList,
    icdSuggestions,
  };

  return detail;
}


