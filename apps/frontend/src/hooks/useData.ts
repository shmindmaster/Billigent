import api from '@/services/api.service';
import type { CaseDetail } from '@/types/case-detail';
import type { Case as DbCase, Denial as DbDenial, Query as DbQuery } from '@/types/domain';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Dashboard aggregate placeholder types
type DashboardStats = {
  financialImpact?: { totalPotential?: number };
  // Financial Metrics
  totalRevenue?: string;
  cdiRevenue?: string;
  appealRecovery?: string;
  avgCaseValue?: string;
  // CDI Performance Metrics
  queryResponseRate?: string;
  avgResponseTime?: string;
  casesProcessed?: string;
  productivityScore?: string;
  // Denials & Appeals Metrics
  overallSuccessRate?: string;
  totalDenials?: string;
  appealsWon?: string;
  avgAppealTime?: string;
  // Base dashboard metrics
  activeCases?: number;
  pendingQueries?: number;
  overdueDenials?: number;
  successRate?: number;
};

// Read operations
export function useCases(params?: { page?: number; limit?: number; status?: string; priority?: string; assignedUserId?: string; }) {
  return useQuery<{ cases: DbCase[]; pagination: { page: number; limit: number; total: number; pages: number } }>({
    queryKey: ['cases', params || {}],
    queryFn: async () => {
      try {
        const res = await api.get('/api/cases', { params });
        return res.data;
      } catch {
        return { cases: [], pagination: { page: 1, limit: Number(params?.limit || 10), total: 0, pages: 0 } };
      }
    },
    retry: 0,
  });
}

export function useUnifiedCase(id: string) {
  return useQuery<CaseDetail>({
    queryKey: ['cases', id],
    queryFn: async () => {
      const res = await api.get(`/api/cases/${id}`);
      // Transform basic case data into extended CaseDetail with mock AI data
      const caseData: DbCase = res.data;
      
      // Add mock AI-generated properties for demonstration
      const extendedCase: CaseDetail = {
        ...caseData,
        suggestedFinding: 'Acute respiratory failure with hypoxia',
        evidence: [
          {
            id: '1',
            type: 'physician_note',
            title: 'Admission Note - Dr. Johnson',
            timestamp: '2024-01-15 09:30:00',
            content: 'Patient presented with acute onset dyspnea and hypoxemia. Oxygen saturation 87% on room air. Patient required immediate supplemental oxygen therapy. Clinical examination reveals bilateral crackles and use of accessory muscles.',
            highlightedTerms: ['dyspnea', 'hypoxemia', 'oxygen saturation 87%', 'supplemental oxygen'],
            relevanceScore: 95,
            severity: 'Critical',
            trending: 'Worsening'
          },
          {
            id: '2',
            type: 'lab_result',
            title: 'Arterial Blood Gas',
            timestamp: '2024-01-15 10:15:00',
            content: 'ABG Results: pH 7.35, PaCO2 45 mmHg, PaO2 65 mmHg, HCO3 22 mEq/L, O2 Sat 87%. Results consistent with acute hypoxemic respiratory failure.',
            highlightedTerms: ['PaO2 65 mmHg', 'O2 Sat 87%', 'hypoxemic respiratory failure'],
            relevanceScore: 92,
            severity: 'High',
            trending: 'Stable'
          },
          {
            id: '3',
            type: 'imaging',
            title: 'Chest X-Ray',
            timestamp: '2024-01-15 11:00:00',
            content: 'Bilateral patchy infiltrates noted in both lung fields. Findings consistent with acute lung injury pattern. No signs of pneumothorax or pleural effusion.',
            highlightedTerms: ['bilateral patchy infiltrates', 'acute lung injury'],
            relevanceScore: 88,
            severity: 'High',
            trending: 'Stable'
          }
        ],
        icdSuggestions: {
          suggested_codes: [
            {
              code: 'J96.00',
              description: 'Acute respiratory failure, unspecified whether with hypoxia or hypercapnia',
              rationale: 'Patient presents with acute onset respiratory symptoms requiring oxygen therapy with documented hypoxemia'
            },
            {
              code: 'J96.01',
              description: 'Acute respiratory failure with hypoxia',
              rationale: 'Specifically documented hypoxemia with PaO2 65 mmHg and O2 saturation 87% on room air'
            }
          ],
          confidence_score: 0.94
        }
      };
      
      return extendedCase;
    },
    enabled: Boolean(id),
  });
}

export function useDenials(params?: { page?: number; limit?: number; status?: string; caseId?: string; }) {
  return useQuery<{ denials: DbDenial[]; pagination: { page: number; limit: number; total: number; pages: number } }>({
    queryKey: ['denials', params || {}],
    queryFn: async () => {
      const res = await api.get('/api/denials', { params });
      return res.data;
    },
  });
}

export function useAnalyticsData() {
  // Use backend analytics dashboard endpoint; degrade gracefully on failure
  return useQuery<DashboardStats>({
    queryKey: ['analytics'],
    queryFn: async () => {
      try {
        const res = await api.get('/api/analytics/dashboard');
        return res.data as DashboardStats;
      } catch {
        return {} as DashboardStats; // safe fallback for UI
      }
    },
    retry: 0,
  });
}

export function useDashboardStats() {
  return useAnalyticsData();
}

export function useSearchCases(query?: string) {
  return useQuery<DbCase[]>({
    queryKey: ['cases', 'search', query || ''],
    queryFn: async () => {
      const res = await api.get('/api/cases', { params: { q: query } });
      // Flatten to just cases for search consumer
      return res.data?.cases || [];
    },
    enabled: Boolean(query && query.length > 1),
  });
}

// Mutations
export function useCreateQuery() {
  const queryClient = useQueryClient();
  return useMutation<DbQuery, unknown, { question: string; userId: string; context?: any }>({
    mutationFn: async (payload) => {
      const res = await api.post('/api/queries', payload);
      return res.data;
    },
    onSuccess: (_data, _vars, _ctx) => {
      queryClient.invalidateQueries({ queryKey: ['queries'] });
      queryClient.invalidateQueries({ queryKey: ['cases'] });
    },
  });
}

export function useAssignCase() {
  const queryClient = useQueryClient();
  return useMutation<DbCase, unknown, { caseId: string; assignedUserId: string }>({
    mutationFn: async ({ caseId, assignedUserId }) => {
      const res = await api.put(`/api/cases/${caseId}`, { assignedUserId });
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['cases', data.id] });
      queryClient.invalidateQueries({ queryKey: ['cases'] });
    },
  });
}

// Legacy aggregate
export function useData() {
  // Retained to avoid breaking imports; proxy to basic cases list
  const { data, isLoading, error, refetch } = useCases();
  return {
    isLoading,
    error: error as any,
    refetch,
    cases: data?.cases ?? [],
    denials: [],
    queries: [],
    analytics: {},
  };
}