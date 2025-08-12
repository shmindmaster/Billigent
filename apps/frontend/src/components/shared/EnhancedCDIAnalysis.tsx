/**
 * Enhanced CDI Analysis Component
 * 
 * React component for performing and displaying enhanced Clinical Documentation
 * Improvement (CDI) analysis with AI-powered recommendations, financial impact,
 * and conversational follow-up capabilities.
 */

import {
    AlertTriangle,
    CheckCircle,
    Clock,
    DollarSign,
    FileText,
    MessageSquare,
    Target,
    TrendingUp,
    Users
} from 'lucide-react';
import { useCallback, useState } from 'react';
import { Alert, AlertDescription } from '../ui/alert';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Spinner } from './Spinner';

// Types for enhanced CDI analysis
interface CDIAnalysisResult {
  encounterId: string;
  patientId: string;
  analysisId: string;
  priority: 'high' | 'medium' | 'low';
  confidence: number;
  financialImpact: {
    currentDrg: string;
    recommendedDrg: string;
    potentialIncrease: number;
    riskOfDenial: number;
  };
  recommendations: {
    documentation: DocumentationGap[];
    coding: CodingRecommendation[];
    queries: PhysicianQuery[];
  };
  clinicalEvidence: {
    supporting: string[];
    missing: string[];
    conflicting: string[];
  };
  timeline: {
    analysisDate: string;
    dischargeDate?: string;
    billingDeadline?: string;
    queryDeadline?: string;
  };
  conversationId: string;
}

interface DocumentationGap {
  category: 'diagnosis' | 'procedure' | 'severity' | 'complication' | 'comorbidity';
  description: string;
  clinicalIndicators: string[];
  suggestedDocumentation: string;
  impact: 'major' | 'moderate' | 'minor';
  codes: {
    current?: string;
    recommended: string;
    description: string;
  };
}

interface CodingRecommendation {
  type: 'icd10' | 'cpt' | 'hcpcs';
  action: 'add' | 'modify' | 'remove' | 'query';
  current?: {
    code: string;
    description: string;
  };
  recommended: {
    code: string;
    description: string;
    rationale: string;
  };
  confidence: number;
  financialImpact: number;
}

interface PhysicianQuery {
  queryId: string;
  category: 'clarification' | 'addition' | 'specificity' | 'validation';
  question: string;
  clinicalContext: string;
  urgency: 'immediate' | 'standard' | 'routine';
  expectedResponse: string;
  followUpRequired: boolean;
}

interface EnhancedCDIAnalysisProps {
  encounterId?: string;
  onAnalysisComplete?: (result: CDIAnalysisResult) => void;
}

export function EnhancedCDIAnalysis({ encounterId, onAnalysisComplete }: EnhancedCDIAnalysisProps) {
  const [analysis, setAnalysis] = useState<CDIAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'recommendations' | 'evidence' | 'conversation'>('overview');
  const [question, setQuestion] = useState('');
  const [conversationHistory, setConversationHistory] = useState<Array<{ question: string; answer: string; timestamp: string }>>([]);
  const [isAskingQuestion, setIsAskingQuestion] = useState(false);

  // Perform enhanced CDI analysis
  const performAnalysis = useCallback(async (targetEncounterId: string) => {
    if (!targetEncounterId) {
      setError('Encounter ID is required');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await fetch(`/api/cdi/analyze/${targetEncounterId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': 'demo-user' // In production, this would come from auth context
        },
        body: JSON.stringify({
          includeFinancialAnalysis: true,
          generateQueries: true
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Analysis failed: ${response.status}`);
      }

      const result = await response.json();
      setAnalysis(result.data);
      onAnalysisComplete?.(result.data);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setIsAnalyzing(false);
    }
  }, [onAnalysisComplete]);

  // Ask a follow-up question
  const askQuestion = useCallback(async () => {
    if (!analysis?.conversationId || !question.trim()) return;

    setIsAskingQuestion(true);

    try {
      const response = await fetch(`/api/cdi/question/${analysis.conversationId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': 'demo-user'
        },
        body: JSON.stringify({
          question: question.trim(),
          context: {
            analysisId: analysis.analysisId,
            clinicalContext: {
              priority: analysis.priority,
              financialImpact: analysis.financialImpact.potentialIncrease
            }
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Question failed');
      }

      const result = await response.json();
      
      setConversationHistory(prev => [...prev, {
        question: question.trim(),
        answer: result.data.answer,
        timestamp: new Date().toISOString()
      }]);
      
      setQuestion('');

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Question failed');
    } finally {
      setIsAskingQuestion(false);
    }
  }, [analysis, question]);

  // Priority badge styling
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Impact badge styling
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'major': return 'bg-red-100 text-red-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'minor': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Analysis Trigger */}
      {!analysis && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Enhanced CDI Analysis
            </CardTitle>
            <CardDescription>
              Perform AI-powered Clinical Documentation Improvement analysis with financial impact assessment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <Button 
                onClick={() => performAnalysis(encounterId || 'demo-encounter-001')}
                disabled={isAnalyzing}
                className="flex items-center gap-2"
              >
                {isAnalyzing ? <Spinner className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                {isAnalyzing ? 'Analyzing...' : 'Start CDI Analysis'}
              </Button>
              {encounterId && (
                <span className="text-sm text-gray-600">
                  Encounter: {encounterId}
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Display */}
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Analysis Results */}
      {analysis && (
        <div className="space-y-6">
          {/* Analysis Overview */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  CDI Analysis Complete
                </CardTitle>
                <Badge className={getPriorityColor(analysis.priority)}>
                  {analysis.priority.toUpperCase()} PRIORITY
                </Badge>
              </div>
              <CardDescription>
                Analysis ID: {analysis.analysisId} • Confidence: {Math.round(analysis.confidence * 100)}%
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Financial Impact */}
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-green-800">Financial Impact</span>
                  </div>
                  <div className="text-2xl font-bold text-green-900">
                    ${analysis.financialImpact.potentialIncrease.toLocaleString()}
                  </div>
                  <div className="text-sm text-green-700">
                    Current DRG: {analysis.financialImpact.currentDrg}
                  </div>
                </div>

                {/* Recommendations Count */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-blue-800">Recommendations</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-900">
                    {analysis.recommendations.coding.length + analysis.recommendations.documentation.length}
                  </div>
                  <div className="text-sm text-blue-700">
                    Coding & Documentation
                  </div>
                </div>

                {/* Timeline */}
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-5 w-5 text-purple-600" />
                    <span className="font-medium text-purple-800">Timeline</span>
                  </div>
                  <div className="text-sm text-purple-700">
                    Query Deadline: {analysis.timeline.queryDeadline ? 
                      new Date(analysis.timeline.queryDeadline).toLocaleDateString() : 'N/A'
                    }
                  </div>
                  <div className="text-sm text-purple-700">
                    Billing Deadline: {analysis.timeline.billingDeadline ?
                      new Date(analysis.timeline.billingDeadline).toLocaleDateString() : 'N/A'
                    }
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', label: 'Overview', icon: TrendingUp },
                { id: 'recommendations', label: 'Recommendations', icon: FileText },
                { id: 'evidence', label: 'Clinical Evidence', icon: Users },
                { id: 'conversation', label: 'Ask Questions', icon: MessageSquare }
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id as any)}
                  className={`
                    flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm
                    ${activeTab === id 
                      ? 'border-blue-500 text-blue-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="mt-6">
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Documentation Gaps */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Documentation Gaps</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {analysis.recommendations.documentation.length > 0 ? (
                      <div className="space-y-4">
                        {analysis.recommendations.documentation.map((gap, index) => (
                          <div key={index} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium capitalize">{gap.category}</span>
                              <Badge className={getImpactColor(gap.impact)}>
                                {gap.impact}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{gap.description}</p>
                            <p className="text-sm font-medium">Suggested: {gap.suggestedDocumentation}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No documentation gaps identified</p>
                    )}
                  </CardContent>
                </Card>

                {/* Physician Queries */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Physician Queries</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {analysis.recommendations.queries.length > 0 ? (
                      <div className="space-y-4">
                        {analysis.recommendations.queries.map((query, index) => (
                          <div key={index} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium capitalize">{query.category}</span>
                              <Badge variant={query.urgency === 'immediate' ? 'destructive' : 'secondary'}>
                                {query.urgency}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">{query.question}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No physician queries generated</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'recommendations' && (
              <Card>
                <CardHeader>
                  <CardTitle>Coding Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  {analysis.recommendations.coding.length > 0 ? (
                    <div className="space-y-4">
                      {analysis.recommendations.coding.map((rec, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">{rec.type.toUpperCase()}</Badge>
                              <Badge variant={rec.action === 'add' ? 'default' : 'secondary'}>
                                {rec.action}
                              </Badge>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">${rec.financialImpact.toLocaleString()}</div>
                              <div className="text-sm text-gray-600">{Math.round(rec.confidence * 100)}% confidence</div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div>
                              <span className="font-medium">Code:</span> {rec.recommended.code} - {rec.recommended.description}
                            </div>
                            <div>
                              <span className="font-medium">Rationale:</span> {rec.recommended.rationale}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No coding recommendations available</p>
                  )}
                </CardContent>
              </Card>
            )}

            {activeTab === 'evidence' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg text-green-800">Supporting Evidence</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {analysis.clinicalEvidence.supporting.length > 0 ? (
                      <ul className="space-y-2">
                        {analysis.clinicalEvidence.supporting.map((evidence, index) => (
                          <li key={index} className="text-sm text-gray-600 p-2 bg-green-50 rounded">
                            {evidence}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500">No supporting evidence identified</p>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg text-orange-800">Missing Evidence</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {analysis.clinicalEvidence.missing.length > 0 ? (
                      <ul className="space-y-2">
                        {analysis.clinicalEvidence.missing.map((evidence, index) => (
                          <li key={index} className="text-sm text-gray-600 p-2 bg-orange-50 rounded">
                            {evidence}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500">No missing evidence identified</p>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg text-red-800">Conflicting Evidence</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {analysis.clinicalEvidence.conflicting.length > 0 ? (
                      <ul className="space-y-2">
                        {analysis.clinicalEvidence.conflicting.map((evidence, index) => (
                          <li key={index} className="text-sm text-gray-600 p-2 bg-red-50 rounded">
                            {evidence}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500">No conflicting evidence identified</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'conversation' && (
              <Card>
                <CardHeader>
                  <CardTitle>Ask CDI Questions</CardTitle>
                  <CardDescription>
                    Ask follow-up questions about this analysis using conversational AI
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Question Input */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="Ask a question about this CDI analysis..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            askQuestion();
                          }
                        }}
                        disabled={isAskingQuestion}
                      />
                      <Button 
                        onClick={askQuestion}
                        disabled={isAskingQuestion || !question.trim()}
                        className="flex items-center gap-2"
                      >
                        {isAskingQuestion ? <Spinner className="h-4 w-4" /> : <MessageSquare className="h-4 w-4" />}
                        Ask
                      </Button>
                    </div>

                    {/* Conversation History */}
                    {conversationHistory.length > 0 && (
                      <div className="space-y-4 max-h-96 overflow-y-auto">
                        {conversationHistory.map((entry, index) => (
                          <div key={index} className="space-y-2">
                            <div className="bg-blue-50 p-3 rounded-lg">
                              <div className="font-medium text-blue-800 mb-1">Question:</div>
                              <div className="text-blue-700">{entry.question}</div>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <div className="font-medium text-gray-800 mb-1">Answer:</div>
                              <div className="text-gray-700 whitespace-pre-wrap">{entry.answer}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {conversationHistory.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <MessageSquare className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                        <p>No questions asked yet. Start a conversation about this CDI analysis!</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Analysis Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <Button 
                  onClick={() => performAnalysis(encounterId || 'demo-encounter-001')}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  Re-run Analysis
                </Button>
                <Button 
                  onClick={() => setAnalysis(null)}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Target className="h-4 w-4" />
                  New Analysis
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

export default EnhancedCDIAnalysis;
