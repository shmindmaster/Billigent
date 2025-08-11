import { Spinner } from '@/components/shared/Spinner';
import { useEffect, useState } from 'react';
import { Heading } from '../components/shared/Heading';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import StatusBadge from '../components/ui/StatusBadge';

interface PreBillCase {
  id: string;
  patientName: string;
  encounterFhirId: string;
  admissionDate: string;
  dischargeDate: string | null;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  priority: 'high' | 'medium' | 'low';
  confidence?: number;
  estimatedValue?: number;
  recommendations?: {
    icdCodes: Array<{ code: string; description: string; confidence: number }>;
    cptCodes: Array<{ code: string; description: string; confidence: number }>;
  };
}

export default function PreBillReview() {
  const [cases, setCases] = useState<PreBillCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCase, setSelectedCase] = useState<PreBillCase | null>(null);
  const [analyzing, setAnalyzing] = useState<string | null>(null);

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      setLoading(true);
      // Mock data - in real app, would fetch from API
      const mockCases: PreBillCase[] = [
        {
          id: '1',
          patientName: 'John Doe',
          encounterFhirId: 'enc-12345',
          admissionDate: '2025-01-15',
          dischargeDate: '2025-01-18',
          status: 'pending',
          priority: 'high',
          estimatedValue: 15000
        },
        {
          id: '2',
          patientName: 'Jane Smith',
          encounterFhirId: 'enc-67890',
          admissionDate: '2025-01-14',
          dischargeDate: null,
          status: 'completed',
          priority: 'medium',
          confidence: 0.92,
          estimatedValue: 8500,
          recommendations: {
            icdCodes: [
              { code: 'I21.9', description: 'Acute myocardial infarction, unspecified', confidence: 0.95 },
              { code: 'Z51.11', description: 'Encounter for antineoplastic chemotherapy', confidence: 0.88 }
            ],
            cptCodes: [
              { code: '99223', description: 'Initial hospital care, per day', confidence: 0.92 },
              { code: '93010', description: 'Electrocardiogram', confidence: 0.89 }
            ]
          }
        }
      ];
      setCases(mockCases);
    } catch (error) {
      console.error('Error fetching cases:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeCase = async (caseId: string) => {
    try {
      setAnalyzing(caseId);
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update case status
      setCases(prev => prev.map(c => 
        c.id === caseId 
          ? { ...c, status: 'completed' as const, confidence: 0.89 }
          : c
      ));
    } catch (error) {
      console.error('Error analyzing case:', error);
    } finally {
      setAnalyzing(null);
    }
  };

  const filteredCases = cases.filter(c => 
    c.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.encounterFhirId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
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
        <Heading level={1} className="mb-2">Pre-Bill Review</Heading>
        <p className="text-gray-600">
          Review and analyze cases before billing to ensure optimal revenue capture and compliance.
        </p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              placeholder="Search by patient name or encounter ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Button variant="outline">Filter</Button>
            <Button onClick={fetchCases}>Refresh</Button>
          </div>
        </CardContent>
      </Card>

      {/* Cases List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Cases ({filteredCases.length})</h2>
          {filteredCases.map((case_) => (
            <Card 
              key={case_.id} 
              className={`cursor-pointer transition-colors ${
                selectedCase?.id === case_.id ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => setSelectedCase(case_)}
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{case_.patientName}</CardTitle>
                    <CardDescription>{case_.encounterFhirId}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={getPriorityColor(case_.priority)}>
                      {case_.priority}
                    </Badge>
                    <StatusBadge status={case_.status} />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Admission:</span>
                    <span>{new Date(case_.admissionDate).toLocaleDateString()}</span>
                  </div>
                  {case_.dischargeDate && (
                    <div className="flex justify-between">
                      <span>Discharge:</span>
                      <span>{new Date(case_.dischargeDate).toLocaleDateString()}</span>
                    </div>
                  )}
                  {case_.estimatedValue && (
                    <div className="flex justify-between font-medium">
                      <span>Estimated Value:</span>
                      <span>${case_.estimatedValue.toLocaleString()}</span>
                    </div>
                  )}
                  {case_.confidence && (
                    <div className="flex justify-between">
                      <span>Confidence:</span>
                      <span>{(case_.confidence * 100).toFixed(1)}%</span>
                    </div>
                  )}
                </div>
                {case_.status === 'pending' && (
                  <Button
                    className="w-full mt-4"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAnalyzeCase(case_.id);
                    }}
                    disabled={analyzing === case_.id}
                  >
                    {analyzing === case_.id ? (
                      <><Spinner className="w-4 h-4 mr-2" /> Analyzing...</>
                    ) : (
                      'Start Analysis'
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Case Details */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Case Details</h2>
          {selectedCase ? (
            <Card>
              <CardHeader>
                <CardTitle>{selectedCase.patientName}</CardTitle>
                <CardDescription>Encounter: {selectedCase.encounterFhirId}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedCase.recommendations ? (
                  <>
                    <div>
                      <h4 className="font-medium mb-2">ICD-10 Recommendations</h4>
                      <div className="space-y-2">
                        {selectedCase.recommendations.icdCodes.map((code, index) => (
                          <div key={index} className="border rounded p-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <span className="font-mono font-medium">{code.code}</span>
                                <p className="text-sm text-gray-600 mt-1">{code.description}</p>
                              </div>
                              <Badge variant="outline">
                                {(code.confidence * 100).toFixed(0)}%
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">CPT Code Recommendations</h4>
                      <div className="space-y-2">
                        {selectedCase.recommendations.cptCodes.map((code, index) => (
                          <div key={index} className="border rounded p-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <span className="font-mono font-medium">{code.code}</span>
                                <p className="text-sm text-gray-600 mt-1">{code.description}</p>
                              </div>
                              <Badge variant="outline">
                                {(code.confidence * 100).toFixed(0)}%
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    {selectedCase.status === 'pending' ? (
                      <p>Start analysis to see recommendations</p>
                    ) : selectedCase.status === 'in_progress' ? (
                      <div className="flex items-center justify-center">
                        <Spinner className="mr-2" />
                        <p>Analysis in progress...</p>
                      </div>
                    ) : (
                      <p>No recommendations available</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-8 text-gray-500">
                <p>Select a case to view details</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}