import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { evidenceService, type EvidenceBundle, type AppealResponse, type KPIRuleEvaluation } from '@/services/evidenceService';

// Hook for fetching evidence bundle
export const useEvidenceBundle = (
  patternId: string, 
  encounterId: string, 
  options?: { includeKpi?: boolean; maxRegulations?: number }
) => {
  return useQuery({
    queryKey: ['evidence-bundle', patternId, encounterId, options],
    queryFn: () => evidenceService.buildEvidenceBundle(patternId, encounterId, options),
    enabled: !!patternId && !!encounterId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook for fetching case evidence bundle
export const useCaseEvidenceBundle = (
  caseId: string, 
  denialPatternId?: string
) => {
  return useQuery({
    queryKey: ['case-evidence-bundle', caseId, denialPatternId],
    queryFn: () => evidenceService.buildCaseEvidenceBundle(caseId, denialPatternId),
    enabled: !!caseId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook for case evidence summary
export const useCaseEvidenceSummary = (caseId: string) => {
  return useQuery({
    queryKey: ['case-evidence-summary', caseId],
    queryFn: () => evidenceService.getCaseEvidenceSummary(caseId),
    enabled: !!caseId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook for generating appeal draft
export const useAppealDraft = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ patternId, encounterId }: { patternId: string; encounterId: string }) =>
      evidenceService.generateAppealDraft(patternId, encounterId),
    onSuccess: (data, variables) => {
      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: ['evidence-bundle', variables.patternId, variables.encounterId]
      });
      queryClient.invalidateQueries({
        queryKey: ['case-evidence-bundle', variables.encounterId]
      });
    },
  });
};

// Hook for KPI rule evaluation
export const useKPIRuleEvaluation = () => {
  return useMutation({
    mutationFn: ({ rule, metrics }: { rule: string; metrics: Record<string, number> }) =>
      evidenceService.evaluateKPIRule(rule, metrics),
  });
};

// Hook for strategy events
export const useStrategyEvents = () => {
  return useQuery({
    queryKey: ['strategy-events'],
    queryFn: () => evidenceService.getStrategyEvents(),
    refetchInterval: 30 * 1000, // Refresh every 30 seconds
    staleTime: 10 * 1000, // 10 seconds
  });
};

// Hook for real-time KPI monitoring
export const useKPIMonitoring = (metrics: Record<string, number>) => {
  const { data: events } = useStrategyEvents();
  
  // Filter events that are rule_fired type
  const ruleEvents = events?.filter(event => event.type === 'rule_fired') || [];
  
  // Group by metric for easy access
  const metricAlerts = ruleEvents.reduce((acc, event) => {
    const metric = event.payload?.metric;
    if (metric) {
      if (!acc[metric]) acc[metric] = [];
      acc[metric].push(event);
    }
    return acc;
  }, {} as Record<string, typeof ruleEvents>);

  return {
    events: ruleEvents,
    metricAlerts,
    hasAlerts: ruleEvents.length > 0,
    getMetricAlerts: (metric: string) => metricAlerts[metric] || [],
  };
};

// Hook for evidence graph visualization data
export const useEvidenceGraphData = (bundle: EvidenceBundle | undefined) => {
  if (!bundle) return null;

  // Transform evidence bundle into graph visualization format
  const nodes = [
    // Fact nodes
    ...bundle.facts.map(fact => ({
      id: fact.id,
      label: fact.text,
      type: 'fact',
      group: 'facts',
      size: 20,
    })),
    // Code nodes
    ...bundle.codes.map(code => ({
      id: code.id,
      label: `${code.system}: ${code.description}`,
      type: 'code',
      group: 'codes',
      size: 15,
    })),
    // Regulation nodes
    ...bundle.regulations.map(reg => ({
      id: reg.id,
      label: reg.citation,
      type: 'regulation',
      group: 'regulations',
      size: 18,
    })),
    // Source nodes
    ...bundle.sources.map(source => ({
      id: source.id,
      label: source.citation,
      type: 'source',
      group: 'sources',
      size: 12,
    })),
  ];

  const edges = [
    // Fact to Code connections
    ...bundle.facts.flatMap(fact =>
      fact.codeIds.map(codeId => ({
        from: fact.id,
        to: codeId,
        type: 'references',
        weight: 1,
      }))
    ),
    // Fact to Source connections
    ...bundle.facts.flatMap(fact =>
      fact.sourceIds.map(sourceId => ({
        from: fact.id,
        to: sourceId,
        type: 'sourced_from',
        weight: 0.5,
      }))
    ),
    // Code to Regulation connections (simplified)
    ...bundle.codes.flatMap(code => {
      const matchingRegs = bundle.regulations.filter(reg =>
        reg.citation.includes(code.id.split(':').pop() || '')
      );
      return matchingRegs.map(reg => ({
        from: code.id,
        to: reg.id,
        type: 'governed_by',
        weight: 0.8,
      }));
    }),
  ];

  return {
    nodes,
    edges,
    metadata: {
      bundleHash: bundle.bundleHash,
      generatedAt: bundle.generatedAt,
      factCount: bundle.facts.length,
      codeCount: bundle.codes.length,
      regulationCount: bundle.regulations.length,
      sourceCount: bundle.sources.length,
    },
  };
};
