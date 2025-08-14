import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { databaseService, type DenialPattern, type AppealCase, type KPIMetric, type EvidenceBundle, type AttributionTracking, type DocumentVersion, type CollaborationSession } from '@/services/database.service';

// ============================================================================
// AZURE SQL DATABASE HOOKS
// ============================================================================

/**
 * Hook for initializing Azure SQL Database schema
 */
export const useInitializeSQLSchema = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => databaseService.initializeSQLSchema(),
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['sql-health'] });
      queryClient.invalidateQueries({ queryKey: ['database-health'] });
    },
  });
};

/**
 * Hook for storing denial patterns
 */
export const useStoreDenialPattern = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (pattern: DenialPattern) => databaseService.storeDenialPattern(pattern),
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['denial-patterns'] });
    },
  });
};

/**
 * Hook for getting denial patterns by diagnosis codes
 */
export const useDenialPatternsByCodes = (codes: string[]) => {
  return useQuery({
    queryKey: ['denial-patterns', codes],
    queryFn: () => databaseService.getDenialPatternsByCodes(codes),
    enabled: codes.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook for storing appeal cases
 */
export const useStoreAppealCase = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (appealCase: AppealCase) => databaseService.storeAppealCase(appealCase),
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['appeal-cases'] });
      queryClient.invalidateQueries({ queryKey: ['real-time-kpis'] });
    },
  });
};

/**
 * Hook for updating appeal case status
 */
export const useUpdateAppealCaseStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status, outcome, recoveryAmount }: {
      id: string;
      status: AppealCase['appealStatus'];
      outcome?: AppealCase['outcome'];
      recoveryAmount?: number;
    }) => databaseService.updateAppealCaseStatus(id, status, outcome, recoveryAmount),
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['appeal-cases'] });
      queryClient.invalidateQueries({ queryKey: ['real-time-kpis'] });
    },
  });
};

/**
 * Hook for getting appeal cases by patient
 */
export const useAppealCasesByPatient = (patientId: string) => {
  return useQuery({
    queryKey: ['appeal-cases', 'patient', patientId],
    queryFn: () => databaseService.getAppealCasesByPatient(patientId),
    enabled: !!patientId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook for real-time KPI calculations
 */
export const useRealTimeKPIs = () => {
  return useQuery({
    queryKey: ['real-time-kpis'],
    queryFn: () => databaseService.getRealTimeKPIs(),
    refetchInterval: 30 * 1000, // Refresh every 30 seconds
    staleTime: 10 * 1000, // 10 seconds
  });
};

/**
 * Hook for storing KPI metrics
 */
export const useStoreKPIMetric = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (metric: KPIMetric) => databaseService.storeKPIMetric(metric),
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['kpi-metrics'] });
    },
  });
};

/**
 * Hook for getting KPI metrics by category and time period
 */
export const useKPIMetrics = (category: string, timePeriod: string, limit: number = 100) => {
  return useQuery({
    queryKey: ['kpi-metrics', category, timePeriod, limit],
    queryFn: () => databaseService.getKPIMetrics(category, timePeriod, limit),
    enabled: !!category && !!timePeriod,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// ============================================================================
// AZURE COSMOS DB HOOKS
// ============================================================================

/**
 * Hook for initializing Cosmos DB containers
 */
export const useInitializeCosmosContainers = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => databaseService.initializeCosmosContainers(),
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['cosmos-health'] });
      queryClient.invalidateQueries({ queryKey: ['database-health'] });
    },
  });
};

/**
 * Hook for storing evidence bundles
 */
export const useStoreEvidenceBundle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bundle: EvidenceBundle) => databaseService.storeEvidenceBundle(bundle),
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['evidence-bundles'] });
    },
  });
};

/**
 * Hook for getting evidence bundle by ID
 */
export const useEvidenceBundle = (id: string, patientId: string) => {
  return useQuery({
    queryKey: ['evidence-bundle', id, patientId],
    queryFn: () => databaseService.getEvidenceBundle(id, patientId),
    enabled: !!id && !!patientId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook for getting evidence bundles by patient
 */
export const useEvidenceBundlesByPatient = (patientId: string) => {
  return useQuery({
    queryKey: ['evidence-bundles', 'patient', patientId],
    queryFn: () => databaseService.getEvidenceBundlesByPatient(patientId),
    enabled: !!patientId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook for storing attribution tracking
 */
export const useStoreAttributionTracking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (attribution: AttributionTracking) => databaseService.storeAttributionTracking(attribution),
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['attribution-tracking'] });
    },
  });
};

/**
 * Hook for updating attribution verification status
 */
export const useUpdateAttributionVerification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ bundleId, status, checksum }: {
      bundleId: string;
      status: AttributionTracking['verificationStatus'];
      checksum?: string;
    }) => databaseService.updateAttributionVerification(bundleId, status, checksum),
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['attribution-tracking'] });
    },
  });
};

/**
 * Hook for storing document versions
 */
export const useStoreDocumentVersion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (version: DocumentVersion) => databaseService.storeDocumentVersion(version),
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['document-versions'] });
    },
  });
};

/**
 * Hook for getting document versions by document ID
 */
export const useDocumentVersions = (documentId: string) => {
  return useQuery({
    queryKey: ['document-versions', documentId],
    queryFn: () => databaseService.getDocumentVersions(documentId),
    enabled: !!documentId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook for storing collaboration sessions
 */
export const useStoreCollaborationSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (session: CollaborationSession) => databaseService.storeCollaborationSession(session),
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['collaboration-sessions'] });
    },
  });
};

/**
 * Hook for updating collaboration sessions
 */
export const useUpdateCollaborationSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ sessionId, updates }: {
      sessionId: string;
      updates: Partial<CollaborationSession>;
    }) => databaseService.updateCollaborationSession(sessionId, updates),
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['collaboration-sessions'] });
    },
  });
};

/**
 * Hook for adding collaboration activities
 */
export const useAddCollaborationActivity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ sessionId, activity }: {
      sessionId: string;
      activity: CollaborationSession['activities'][0];
    }) => databaseService.addCollaborationActivity(sessionId, activity),
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['collaboration-sessions'] });
    },
  });
};

/**
 * Hook for getting collaboration session by ID
 */
export const useCollaborationSession = (sessionId: string) => {
  return useQuery({
    queryKey: ['collaboration-session', sessionId],
    queryFn: () => databaseService.getCollaborationSession(sessionId),
    enabled: !!sessionId,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Hook for getting active collaboration sessions by case ID
 */
export const useActiveCollaborationSessions = (caseId: string) => {
  return useQuery({
    queryKey: ['collaboration-sessions', 'active', caseId],
    queryFn: () => databaseService.getActiveCollaborationSessions(caseId),
    enabled: !!caseId,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 2 * 60 * 1000, // 2 minutes
  });
};

// ============================================================================
// HEALTH CHECK HOOKS
// ============================================================================

/**
 * Hook for checking SQL Database health
 */
export const useSQLHealth = () => {
  return useQuery({
    queryKey: ['sql-health'],
    queryFn: () => databaseService.checkSQLHealth(),
    refetchInterval: 60 * 1000, // Refresh every minute
    staleTime: 30 * 1000, // 30 seconds
  });
};

/**
 * Hook for checking Cosmos DB health
 */
export const useCosmosHealth = () => {
  return useQuery({
    queryKey: ['cosmos-health'],
    queryFn: () => databaseService.checkCosmosHealth(),
    refetchInterval: 60 * 1000, // Refresh every minute
    staleTime: 30 * 1000, // 30 seconds
  });
};

/**
 * Hook for checking overall database health
 */
export const useDatabaseHealth = () => {
  return useQuery({
    queryKey: ['database-health'],
    queryFn: () => databaseService.checkOverallHealth(),
    refetchInterval: 60 * 1000, // Refresh every minute
    staleTime: 30 * 1000, // 30 seconds
  });
};

// ============================================================================
// UTILITY HOOKS
// ============================================================================

/**
 * Hook for initializing all database services
 */
export const useInitializeAllDatabases = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => databaseService.initializeAll(),
    onSuccess: () => {
      // Invalidate all database-related queries
      queryClient.invalidateQueries({ queryKey: ['sql-health'] });
      queryClient.invalidateQueries({ queryKey: ['cosmos-health'] });
      queryClient.invalidateQueries({ queryKey: ['database-health'] });
    },
  });
};

/**
 * Hook for getting database connection status
 */
export const useDatabaseConnectionStatus = () => {
  return useQuery({
    queryKey: ['database-connection-status'],
    queryFn: () => databaseService.getConnectionStatus(),
    refetchInterval: 30 * 1000, // Refresh every 30 seconds
    staleTime: 15 * 1000, // 15 seconds
  });
};

/**
 * Hook for real-time database monitoring
 */
export const useDatabaseMonitoring = () => {
  const { data: health } = useDatabaseHealth();
  const { data: connectionStatus } = useDatabaseConnectionStatus();

  return {
    health,
    connectionStatus,
    isHealthy: health?.status === 'healthy',
    isDegraded: health?.status === 'degraded',
    isUnhealthy: health?.status === 'unhealthy',
    hasSQL: connectionStatus?.sql === 'healthy',
    hasCosmos: connectionStatus?.cosmos === 'healthy',
    overallStatus: connectionStatus?.overall || 'unknown'
  };
};
