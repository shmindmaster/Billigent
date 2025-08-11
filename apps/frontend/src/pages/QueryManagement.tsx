import { useEffect, useState } from 'react';
import { Heading } from '../components/shared/Heading';
import { Spinner } from '../components/shared/Spinner';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import StatusBadge from '../components/ui/StatusBadge';

interface Query {
  id: string;
  question: string;
  answer: string | null;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  confidence: number | null;
  sources: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface NewQuery {
  question: string;
  context?: string;
}

export default function QueryManagement() {
  const [queries, setQueries] = useState<Query[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedQuery, setSelectedQuery] = useState<Query | null>(null);
  const [newQuery, setNewQuery] = useState<NewQuery>({ question: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchQueries();
  }, []);

  const fetchQueries = async () => {
    try {
      setLoading(true);
      // Mock data - in real app, would fetch from API
      const mockQueries: Query[] = [
        {
          id: '1',
          question: 'What are the ICD-10 codes for acute myocardial infarction?',
          answer: 'The primary ICD-10 codes for acute myocardial infarction include:\n\n• I21.9 - Acute myocardial infarction, unspecified\n• I21.0 - ST elevation (STEMI) myocardial infarction of anterior wall\n• I21.1 - ST elevation (STEMI) myocardial infarction of inferior wall\n• I21.2 - ST elevation (STEMI) myocardial infarction of other sites\n• I21.3 - ST elevation (STEMI) myocardial infarction of unspecified site\n• I21.4 - Non-ST elevation (NSTEMI) myocardial infarction',
          status: 'completed',
          confidence: 0.95,
          sources: JSON.stringify(['ICD-10-CM Official Guidelines', 'Medicare Coding Guidelines']),
          userId: 'user1',
          createdAt: '2025-01-15T10:30:00Z',
          updatedAt: '2025-01-15T10:32:00Z'
        },
        {
          id: '2',
          question: 'How should I code a patient with diabetes and hypertension?',
          answer: 'For a patient with diabetes and hypertension, you should:\n\n1. Code the diabetes first using appropriate E08-E13 codes\n2. Add hypertension codes from I10-I16 range\n3. Consider if there is a causal relationship\n4. Use combination codes when available\n\nExample codes:\n• E11.9 - Type 2 diabetes mellitus without complications\n• I10 - Essential (primary) hypertension\n• E11.65 - Type 2 diabetes mellitus with hyperglycemia',
          status: 'completed',
          confidence: 0.88,
          sources: JSON.stringify(['ICD-10-CM Coding Guidelines', 'AHA Coding Clinic']),
          userId: 'user2',
          createdAt: '2025-01-14T15:45:00Z',
          updatedAt: '2025-01-14T15:47:00Z'
        },
        {
          id: '3',
          question: 'What documentation is required for a pneumonia diagnosis?',
          answer: null,
          status: 'processing',
          confidence: null,
          sources: null,
          userId: 'user1',
          createdAt: '2025-01-15T14:20:00Z',
          updatedAt: '2025-01-15T14:20:00Z'
        }
      ];
      setQueries(mockQueries);
    } catch (error) {
      console.error('Error fetching queries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitQuery = async () => {
    if (!newQuery.question.trim()) return;

    try {
      setSubmitting(true);
      
      // Mock API call
      const queryData = {
        id: Date.now().toString(),
        question: newQuery.question,
        answer: null,
        status: 'processing' as const,
        confidence: null,
        sources: null,
        userId: 'current-user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setQueries(prev => [queryData, ...prev]);
      setNewQuery({ question: '' });
      
      // Simulate processing delay
      setTimeout(() => {
        setQueries(prev => prev.map(q => 
          q.id === queryData.id 
            ? { 
                ...q, 
                status: 'completed' as const, 
                answer: 'This is a simulated answer to your query. In a real implementation, this would be processed by the AI system.',
                confidence: 0.85
              }
            : q
        ));
      }, 3000);
    } catch (error) {
      console.error('Error submitting query:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredQueries = queries.filter(q => 
    q.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'processing': return 'warning';
      case 'failed': return 'error';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="mb-6">
        <Heading level={1} className="mb-2">Query Management</Heading>
        <p className="text-gray-600">
          Ask natural language questions about medical coding, documentation, and clinical guidelines.
        </p>
      </div>

      {/* New Query Form */}
      <Card>
        <CardHeader>
          <CardTitle>Ask a Question</CardTitle>
          <CardDescription>
            Get AI-powered answers to your medical coding and documentation questions.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Question</label>
            <textarea
              value={newQuery.question}
              onChange={(e) => setNewQuery(prev => ({ ...prev, question: e.target.value }))}
              placeholder="e.g., What are the ICD-10 codes for acute appendicitis?"
              className="w-full p-3 border border-gray-300 rounded-md resize-none"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Additional Context (Optional)</label>
            <Input
              value={newQuery.context || ''}
              onChange={(e) => setNewQuery(prev => ({ ...prev, context: e.target.value }))}
              placeholder="e.g., Patient age, specific conditions, etc."
            />
          </div>
          <Button 
            onClick={handleSubmitQuery}
            disabled={!newQuery.question.trim() || submitting}
            className="w-full"
          >
            {submitting ? (
              <><Spinner className="w-4 h-4 mr-2" /> Submitting...</>
            ) : (
              'Submit Question'
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Search Queries</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Search your questions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </CardContent>
      </Card>

      {/* Queries List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Recent Queries ({filteredQueries.length})</h2>
          {filteredQueries.map((query) => (
            <Card 
              key={query.id} 
              className={`cursor-pointer transition-colors ${
                selectedQuery?.id === query.id ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => setSelectedQuery(query)}
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start gap-4">
                  <CardTitle className="text-lg line-clamp-2">{query.question}</CardTitle>
                  <StatusBadge 
                    status={query.status} 
                    variant={getStatusVariant(query.status)}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Created:</span>
                    <span>{new Date(query.createdAt).toLocaleDateString()}</span>
                  </div>
                  {query.confidence && (
                    <div className="flex justify-between">
                      <span>Confidence:</span>
                      <span>{(query.confidence * 100).toFixed(1)}%</span>
                    </div>
                  )}
                  {query.answer && (
                    <p className="text-xs text-gray-500 line-clamp-2 mt-2">
                      {query.answer.substring(0, 100)}...
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Query Details */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Query Details</h2>
          {selectedQuery ? (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{selectedQuery.question}</CardTitle>
                  <StatusBadge 
                    status={selectedQuery.status} 
                    variant={getStatusVariant(selectedQuery.status)}
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedQuery.answer ? (
                  <>
                    <div>
                      <h4 className="font-medium mb-2">Answer</h4>
                      <div className="bg-gray-50 p-4 rounded-md">
                        <pre className="whitespace-pre-wrap text-sm">{selectedQuery.answer}</pre>
                      </div>
                    </div>
                    {selectedQuery.confidence && (
                      <div>
                        <h4 className="font-medium mb-2">Confidence Score</h4>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${selectedQuery.confidence * 100}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">
                            {(selectedQuery.confidence * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    )}
                    {selectedQuery.sources && (
                      <div>
                        <h4 className="font-medium mb-2">Sources</h4>
                        <div className="space-y-1">
                          {JSON.parse(selectedQuery.sources).map((source: string, index: number) => (
                            <Badge key={index} variant="outline" className="mr-2">
                              {source}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : selectedQuery.status === 'processing' ? (
                  <div className="text-center py-8">
                    <Spinner className="mx-auto mb-4" />
                    <p className="text-gray-500">Processing your question...</p>
                  </div>
                ) : selectedQuery.status === 'failed' ? (
                  <div className="text-center py-8 text-red-500">
                    <p>Failed to process this query. Please try again.</p>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>Query is pending processing.</p>
                  </div>
                )}
                
                <div className="pt-4 border-t text-xs text-gray-500">
                  <div className="flex justify-between">
                    <span>Created: {new Date(selectedQuery.createdAt).toLocaleString()}</span>
                    <span>Updated: {new Date(selectedQuery.updatedAt).toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-8 text-gray-500">
                <p>Select a query to view details</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}