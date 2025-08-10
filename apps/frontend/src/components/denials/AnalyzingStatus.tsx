import StatusBadge from '@/components/ui/StatusBadge';
import { usePollDenialStatus } from '@/hooks/usePollDenialStatus';
import { useQueryClient } from '@tanstack/react-query';

interface Props {
  denialId: number;
  status: string;
}

export function AnalyzingStatus({ denialId, status }: Props) {
  const queryClient = useQueryClient();
  const isAnalyzing = String(status).toLowerCase().includes('analyz');
  usePollDenialStatus(denialId, isAnalyzing, () => {
    queryClient.invalidateQueries({ queryKey: ['denials'] });
  });

  if (isAnalyzing) {
    return (
      <span className="inline-flex items-center space-x-2">
        <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></span>
        <span>Analyzing...</span>
      </span>
    );
  }
  return <StatusBadge status={status} />;
}


