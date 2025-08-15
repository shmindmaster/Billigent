import { useState, useEffect } from 'react';

// Mock database health data
const mockDatabaseHealth = {
  status: 'healthy',
  lastCheck: new Date().toISOString(),
  responseTime: 45,
  connections: 12,
  uptime: '99.9%'
};

export const useDatabase = () => {
  const [health, setHealth] = useState(mockDatabaseHealth);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkHealth = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setHealth(mockDatabaseHealth);
    } catch (err) {
      setError('Failed to check database health');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  return {
    health,
    isLoading,
    error,
    refetch: checkHealth
  };
};
