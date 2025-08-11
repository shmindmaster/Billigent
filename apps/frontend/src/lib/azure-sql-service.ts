/* eslint-disable require-await */
// Frontend API client that calls the backend (Express + Prisma) endpoints

// === TYPE DEFINITIONS ===
export type User = {
  userId: number;
  fullName: string;
  email: string;
  userRole: string;
  createdAt: string;
};

export type Case = {
  caseId: number;
  patientFhirId: string;
  encounterFhirId: string;
  status: string;
  priority?: string | null;
  createdAt: string;
  lastUpdatedAt: string;
  assignedUserId?: number | null;
  // Enhanced healthcare fields
  facilityId?: string | null;
  medicalRecordNumber?: string | null;
  patientName?: string | null;
  age?: number | null;
  gender?: string | null;
  admissionDate?: string | null;
  dischargeDate?: string | null;
  primaryDiagnosis?: string | null;
  currentDRG?: string | null;
  openDate?: string | null;
  closeDate?: string | null;
  // Relations
  assignedUser?: User;
  cdiReview?: CDIReview;
  denial?: Denial[];
  queries?: Query[];
  activityLogs?: ActivityLog[];
};

export type CDIReview = {
  cdiReviewId: number;
  caseId: number;
  currentDRG?: string | null;
  suggestedDRG?: string | null;
  suggestedFinding?: string | null;
  clinicalEvidence?: string | null;
  aiConfidenceScore?: number | null;
  potentialFinancialImpact?: number | null;
  status: string;
  reviewedAt?: string | null;
  approvedBy?: number | null;
  evidence?: CDIEvidence[];
  queries?: Query[];
};

export type CDIEvidence = {
  evidenceId: number;
  cdiReviewId: number;
  evidenceFhirId: string;
  evidenceType: string;
  description: string;
  relevanceScore?: number;
};

export type Query = {
  queryId: number;
  cdiReviewId: number;
  createdByUserId: number;
  queryText: string;
  status: string;
  sentDate?: string;
  responseDate?: string;
  createdByUser?: User;
  cdiReview?: CDIReview;
};

export type Denial = {
  denialId: number;
  caseId: number;
  claimFhirId: string;
  eobFhirId?: string;
  denialReasonCode?: string;
  deniedAmount?: number;
  status: string;
  // Enhanced denial fields
  denialDate?: string | null;
  appealDeadline?: string | null;
  appealSubmittedDate?: string | null;
  appealStatus?: string | null;
  finalOutcome?: string | null;
  recoveredAmount?: number | null;
  case?: Case;
};

export type ActivityLog = {
  activityLogId: number;
  caseId: number;
  userId: number;
  activityType: string;
  description: string;
  timestamp: string;
  user?: User;
};

export type DashboardStats = {
  cases: { total: number; active: number; completed: number };
  denials: { total: number; active: number; totalDeniedAmount: number };
  queries: { total: number; pending: number; responseRate: number };
  financialImpact: { totalPotential: number; totalDenied: number };
  // Extended analytics fields
  totalRevenue?: string;
  cdiRevenue?: string;
  appealRecovery?: string;
  avgCaseValue?: string;
  queryResponseRate?: string;
  avgResponseTime?: string;
  casesProcessed?: string;
  productivityScore?: string;
  overallSuccessRate?: string;
  totalDenials?: string;
  appealsWon?: string;
  avgAppealTime?: string;
};

export type AnalyticsResponse = {
  casesByStatus: Array<{ status: string; count: number }>;
  casesByPriority: Array<{ priority: string; count: number }>;
  userWorkload: Array<{ userId: number; fullName: string; userRole: string; totalCases: number; activeCases: number; completedCases: number }>;
  financialImpact: { cdiResults: any[]; denialResults: any[] };
};

// === API CLIENT ===
const API_BASE = (import.meta as any)?.env?.VITE_API_BASE || 'http://localhost:3001';

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const resp = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });
  const data = await resp.json().catch(() => ({}));
  if (!resp.ok) throw new Error(data?.error || `Request failed (${resp.status})`);
  return data as T;
}

// === MAIN SERVICE ===
export const azureSQLService = {
  // ===== USERS =====
  async getUsers(role?: string): Promise<User[]> {
    const searchParams = new URLSearchParams();
    if (role) searchParams.set('role', role);
    return http<User[]>(`/api/users?${searchParams.toString()}`);
  },

  async getUserById(id: number): Promise<User | null> {
    return http<User>(`/api/users/${id}`).catch(() => null);
  },

  async createUser(userData: { fullName: string; email: string; userRole: string }): Promise<User> {
    return http<User>('/api/users', { method: 'POST', body: JSON.stringify(userData) });
  },

  async updateUser(id: number, updates: Partial<User>): Promise<User> {
    return http<User>(`/api/users/${id}`, { method: 'PUT', body: JSON.stringify(updates) });
  },

  async deleteUser(id: number): Promise<{ message: string }> {
    return http<{ message: string }>(`/api/users/${id}`, { method: 'DELETE' });
  },

  // ===== CASES =====
  async getCases(params?: {
    page?: number;
    limit?: number;
    status?: string;
    priority?: string;
    assignedUserId?: number;
    search?: string;
  }): Promise<{ cases: Case[]; pagination: any }> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', String(params.page));
    if (params?.limit) searchParams.set('limit', String(params.limit));
    if (params?.status) searchParams.set('status', params.status);
    if (params?.priority) searchParams.set('priority', params.priority);
    if (params?.assignedUserId) searchParams.set('assignedUserId', String(params.assignedUserId));
    if (params?.search) searchParams.set('search', params.search);
    return http<{ cases: Case[]; pagination: any }>(`/api/cases?${searchParams.toString()}`);
  },

  async getCaseById(id: number): Promise<Case | null> {
    return http<Case>(`/api/cases/${id}`).catch(() => null);
  },

  async createCase(caseData: {
    patientFhirId: string;
    encounterFhirId: string;
    status?: string;
    priority?: string;
    assignedUserId?: number;
  }): Promise<Case> {
    return http<Case>('/api/cases', { method: 'POST', body: JSON.stringify(caseData) });
  },

  async updateCase(id: number, updates: Partial<Case>): Promise<Case> {
    return http<Case>(`/api/cases/${id}`, { method: 'PUT', body: JSON.stringify(updates) });
  },

  async deleteCase(id: number): Promise<{ message: string }> {
    return http<{ message: string }>(`/api/cases/${id}`, { method: 'DELETE' });
  },

  // Case AI/Workflow methods
  async enrichCasePreBill(caseId: number): Promise<{ caseId: number; cdiReviewId: number; status: string }> {
    return http<{ caseId: number; cdiReviewId: number; status: string }>(`/api/cases/${caseId}/enrich/prebill`, { method: 'POST' });
  },

  async bulkEnrichPreBill(params?: { limit?: number; onlyMissing?: boolean }): Promise<Array<{ caseId: number; ok: boolean; error?: string }>> {
    return http<Array<{ caseId: number; ok: boolean; error?: string }>>('/api/cases/enrich/prebill/bulk', {
      method: 'POST',
      body: JSON.stringify(params || {})
    });
  },

  // ===== QUERIES =====
  async getQueries(params?: {
    page?: number;
    limit?: number;
    status?: string;
    cdiReviewId?: number;
    createdByUserId?: number;
  }): Promise<{ queries: Query[]; pagination: any }> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', String(params.page));
    if (params?.limit) searchParams.set('limit', String(params.limit));
    if (params?.status) searchParams.set('status', params.status);
    if (params?.cdiReviewId) searchParams.set('cdiReviewId', String(params.cdiReviewId));
    if (params?.createdByUserId) searchParams.set('createdByUserId', String(params.createdByUserId));
    return http<{ queries: Query[]; pagination: any }>(`/api/queries?${searchParams.toString()}`);
  },

  async getQueryById(id: number): Promise<Query | null> {
    return http<Query>(`/api/queries/${id}`).catch(() => null);
  },

  async createQuery(queryData: {
    cdiReviewId: number;
    createdByUserId: number;
    queryText: string;
    status?: string;
  }): Promise<Query> {
    return http<Query>('/api/queries', { method: 'POST', body: JSON.stringify(queryData) });
  },

  async updateQuery(id: number, updates: Partial<Query>): Promise<Query> {
    return http<Query>(`/api/queries/${id}`, { method: 'PUT', body: JSON.stringify(updates) });
  },

  async deleteQuery(id: number): Promise<{ message: string }> {
    return http<{ message: string }>(`/api/queries/${id}`, { method: 'DELETE' });
  },

  // ===== DENIALS =====
  async getDenials(params?: {
    page?: number;
    limit?: number;
    status?: string;
    caseId?: number;
  }): Promise<{ denials: Denial[]; pagination: any }> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', String(params.page));
    if (params?.limit) searchParams.set('limit', String(params.limit));
    if (params?.status) searchParams.set('status', params.status);
    if (params?.caseId) searchParams.set('caseId', String(params.caseId));
    return http<{ denials: Denial[]; pagination: any }>(`/api/denials?${searchParams.toString()}`);
  },

  async getDenialById(id: number): Promise<Denial | null> {
    return http<Denial>(`/api/denials/${id}`).catch(() => null);
  },

  async createDenial(denialData: {
    caseId: number;
    claimFhirId: string;
    eobFhirId?: string;
    denialReasonCode?: string;
    deniedAmount?: number;
    status?: string;
  }): Promise<Denial> {
    return http<Denial>('/api/denials', { method: 'POST', body: JSON.stringify(denialData) });
  },

  async updateDenial(id: number, updates: Partial<Denial>): Promise<Denial> {
    return http<Denial>(`/api/denials/${id}`, { method: 'PUT', body: JSON.stringify(updates) });
  },

  async deleteDenial(id: number): Promise<{ message: string }> {
    return http<{ message: string }>(`/api/denials/${id}`, { method: 'DELETE' });
  },

  // ===== ANALYTICS & DASHBOARD =====
  async getDashboardStats(): Promise<DashboardStats> {
    return http<DashboardStats>('/api/analytics/dashboard');
  },

  async getCasesByStatus(): Promise<Array<{ status: string; count: number }>> {
    return http<Array<{ status: string; count: number }>>('/api/analytics/cases-by-status');
  },

  async getCasesByPriority(): Promise<Array<{ priority: string; count: number }>> {
    return http<Array<{ priority: string; count: number }>>('/api/analytics/cases-by-priority');
  },

  async getUserWorkload(): Promise<Array<{ userId: number; fullName: string; userRole: string; totalCases: number; activeCases: number; completedCases: number }>> {
    return http<Array<{ userId: number; fullName: string; userRole: string; totalCases: number; activeCases: number; completedCases: number }>>('/api/analytics/user-workload');
  },

  async getFinancialImpact(): Promise<{ cdiResults: any[]; denialResults: any[] }> {
    return http<{ cdiResults: any[]; denialResults: any[] }>('/api/analytics/financial-impact');
  },

  // ===== AI & ANALYTICS QUERIES =====
  async createAITextResponse(prompt: string): Promise<any> {
    return http<any>('/api/analytics/ai/text', { method: 'POST', body: JSON.stringify({ prompt }) });
  },

  async createAIConversation(prompt: string, previousResponseId?: string): Promise<any> {
    return http<any>('/api/analytics/ai/conversation', { method: 'POST', body: JSON.stringify({ prompt, previousResponseId }) });
  },

  async startBackgroundAnalysis(params: {
    filename: string;
    mimeType: string;
    base64Data: string;
    prompt?: string;
  }): Promise<{ id: string }> {
    return http<{ id: string }>('/api/analytics/ai/background/start', { method: 'POST', body: JSON.stringify(params) });
  },

  async getBackgroundAnalysis(id: string): Promise<any> {
    return http<any>(`/api/analytics/ai/background/${id}`);
  },

  async queryAnalytics(prompt: string): Promise<any> {
    return http<any>('/api/analytics/query', { method: 'POST', body: JSON.stringify({ prompt }) });
  },

  // ===== CONVENIENCE METHODS =====
  async searchCases(searchTerm: string): Promise<Case[]> {
    const res = await this.getCases({ search: searchTerm, limit: 50 });
    return res.cases || [];
  },

  async getUsersByRole(role: string): Promise<User[]> {
    return this.getUsers(role);
  },

  async getActiveCases(): Promise<Case[]> {
    const res = await this.getCases({ status: 'Active', limit: 100 });
    return res.cases || [];
  },

  async getPendingQueries(): Promise<Query[]> {
    const res = await this.getQueries({ status: 'Pending', limit: 100 });
    return res.queries || [];
  },

  async getActiveDenials(): Promise<Denial[]> {
    const res = await this.getDenials({ status: 'Active', limit: 100 });
    return res.denials || [];
  },
};




