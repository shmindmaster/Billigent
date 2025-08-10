import { useState, useEffect } from 'react';

interface DenialStatus {
  id: string;
  status: 'pending' | 'analyzing' | 'completed' | 'error';
  progress?: number;
  message?: string;
}

export function usePollDenialStatus(denialId: string | null) {
  const [status, setStatus] = useState<DenialStatus | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!denialId) {
      setStatus(null);
      return;
    }

    setLoading(true);
    
    // Mock polling - replace with real API
    const interval = setInterval(() => {
      // Simulate status updates
      setStatus({
        id: denialId,
        status: 'analyzing',
        progress: Math.random() * 100,
        message: 'Analyzing denial...',
      });
    }, 2000);

    return () => {
      clearInterval(interval);
      setLoading(false);
    };
  }, [denialId]);

  return { status, loading };
}