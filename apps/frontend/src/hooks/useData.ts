import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api.service';
import type { Case as DbCase, Query as DbQuery, Denial as DbDenial } from '@billigent/database';

// Dashboard aggregate placeholder types
type DashboardStats = {
  financialImpact?: { totalPotential?: number };
};

// Read operations
export function useCases(params?: { page?: number; limit?: number; status?: string; priority?: string; assignedUserId?: string; }) {
  return useQuery<{ cases: DbCase[]; pagination: { page: number; limit: number; total: number; pages: number } }>({
    queryKey: ['cases', params || {}],
    queryFn: async () => {
      const res = await api.get('/api/cases', { params });
      return res.data;
    },
  });
}

export function useUnifiedCase(id: string) {
  return useQuery<DbCase>({
    queryKey: ['cases', id],
    queryFn: async () => {
      const res = await api.get(`/api/cases/${id}`);
      return res.data;
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
  // Placeholder endpoint if/when analytics API exists
  return useQuery<DashboardStats>({
    queryKey: ['analytics'],
    queryFn: async () => {
      const res = await api.get('/api/analytics');
      return res.data;
    },
    // Allow page to render even if not implemented yet
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