import React, { createContext, useContext } from 'react';

interface QueryData {
  id: string;
  question: string;
  answer?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: Date;
}

interface QueryContextType {
  queries: QueryData[];
  submitQuery: (question: string) => Promise<void>;
  getQueryById: (id: string) => QueryData | undefined;
  refreshQueries: () => Promise<void>;
}

const QueryContext = createContext<QueryContextType | undefined>(undefined);

export function QueryProvider({ children }: { children: React.ReactNode }) {
  // Temporary implementation - will be expanded
  const mockContextValue: QueryContextType = {
    queries: [],
    submitQuery: async () => { /* TODO: Implement */ },
    getQueryById: () => undefined,
    refreshQueries: async () => { /* TODO: Implement */ }
  };
  
  return (
    <QueryContext.Provider value={mockContextValue}>
      {children}
    </QueryContext.Provider>
  );
}

export const useQuery = () => {
  const context = useContext(QueryContext);
  if (context === undefined) {
    throw new Error('useQuery must be used within a QueryProvider');
  }
  return context;
};