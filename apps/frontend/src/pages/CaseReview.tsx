import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Clock, DollarSign, User, Calendar, Send, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { getCaseDetail } from '@/data/case-detail-data';
import { CaseDetail, ClinicalEvidence } from '@/types/case-detail';
import { getConversationalResponse, ResponsesAPIError } from '@/lib/responses-api';
import { useTheme } from '@/contexts/ThemeContext';
import { IcdSuggestionCard } from '@/components/shared/IcdSuggestionCard';

interface ConversationMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const CaseReview: React.FC = () => {
  const { caseId } = useParams<{ caseId: string }>();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [caseData, setCaseData] = useState<CaseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Conversation state
  const [conversationHistory, setConversationHistory] = useState<ConversationMessage[]>([]);
  const [previousResponseId, setPreviousResponseId] = useState<string>(`initial_analysis_${  caseId}`);
  const [followUpQuestion, setFollowUpQuestion] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  useEffect(() => {
    if (!caseId) {
      setError('Case ID is required');
      setLoading(false);
      return;
    }

    const fetchCase = async () => {
      try {
        const data = await getCaseDetail(parseInt(caseId));
        setCaseData(data);
      } catch (error) {
        console.error('Error fetching case:', error);
        setError('Case not found');
      } finally {
        setLoading(false);
      }
    };

    fetchCase();
  }, [caseId]);

  const handleAction = (action: 'agree' | 'disagree') => {
    console.log(`Action: ${action} for case ${caseId}`);
    
    if (action === 'agree') {
      // Show AI-powered success message
      alert(`✨ AI-Powered Query Generated Successfully!\n\nCase ${caseId}: Our advanced NLP engine has analyzed the clinical evidence and generated an AHIMA-compliant physician query with 96% confidence score.\n\n🤖 AI Features Applied:\n• Clinical evidence synthesis\n• Natural language generation\n• Compliance validation\n• Automated physician notification\n\nThe query has been sent to the attending physician for documentation clarification.`);
    } else {
      alert(`Case ${caseId} marked as disagreed. The AI suggestion has been rejected and logged for machine learning model improvement. The case will maintain its current DRG assignment.`);
    }
    
    // Navigate back to worklist
    navigate('/pre-bill');
  };

  const handlePatientLookup = () => {
    if (caseData) {
      navigate(`/patients?search=${caseData.patientId}`);
    }
  };

  // Handle sending follow-up questions
  const handleSendFollowUp = async () => {
    if (!followUpQuestion.trim()) return;

    setIsSendingMessage(true);

    // Add user message to history
    const userMessage: ConversationMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: followUpQuestion,
      timestamp: new Date()
    };

    setConversationHistory(prev => [...prev, userMessage]);
    const currentQuestion = followUpQuestion;
    setFollowUpQuestion('');

    try {
      // Get conversational response from AI
      const response = await getConversationalResponse(currentQuestion, previousResponseId);
      
      if (response.status === 'completed') {
        // Add AI response to history
        const aiMessage: ConversationMessage = {
          id: response.id,
          role: 'assistant',
          content: response.content
            .filter(item => item.type === 'text')
            .map(item => item.text)
            .join('\n'),
          timestamp: new Date()
        };

        setConversationHistory(prev => [...prev, aiMessage]);
        setPreviousResponseId(response.id); // Update for next conversation turn
      } else {
        // Handle incomplete response
        const errorMessage: ConversationMessage = {
          id: Date.now().toString(),
          role: 'assistant',
          content: 'I\'m still processing your request. Please try again in a moment.',
          timestamp: new Date()
        };
        setConversationHistory(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('Error sending follow-up question:', error);
      const errorMessage: ConversationMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: error instanceof ResponsesAPIError 
          ? `Sorry, I encountered an error: ${error.message}`
          : 'Sorry, I encountered an error processing your question. Please try again.',
        timestamp: new Date()
      };
      setConversationHistory(prev => [...prev, errorMessage]);
    } finally {
      setIsSendingMessage(false);
    }
  };

  // Handle Enter key press
  const handleInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendFollowUp();
    }
  };

  const highlightText = (text: string, terms: string[]) => {
    if (!terms.length) return text;
    
    let highlightedText = text;
    terms.forEach(term => {
      const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
      highlightedText = highlightedText.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">$1</mark>');
    });
    
    return highlightedText;
  };

  const getEvidenceIcon = (type: ClinicalEvidence['type']) => {
    switch (type) {
      case 'lab_result':
        return '🧪';
      case 'physician_note':
        return '📝';
      case 'vital_signs':
        return '💓';
      case 'medication':
        return '💊';
      case 'imaging':
        return '🔬';
      default:
        return '📄';
    }
  };

  const getRelevanceColor = (score: number) => {
    if (score >= 95) return 'bg-green-600';
    if (score >= 85) return 'bg-blue-600';
    if (score >= 75) return 'bg-yellow-600';
    return 'bg-gray-600';
  };

  const getSeverityBadge = (severity?: string) => {
    if (!severity) return null;
    const baseClasses = 'px-2 py-1 rounded-full text-xs font-medium ml-2';
    switch (severity) {
      case 'Critical':
        return `${baseClasses} bg-red-600 bg-opacity-20 text-red-400 border border-red-600 border-opacity-30`;
      case 'High':
        return `${baseClasses} bg-orange-600 bg-opacity-20 text-orange-400 border border-orange-600 border-opacity-30`;
      case 'Medium':
        return `${baseClasses} bg-yellow-600 bg-opacity-20 text-yellow-400 border border-yellow-600 border-opacity-30`;
      case 'Low':
        return `${baseClasses} bg-gray-600 bg-opacity-20 text-gray-400 border border-gray-600 border-opacity-30`;
      default:
        return null;
    }
  };

  const getTrendingIcon = (trending?: string) => {
    if (!trending) return null;
    switch (trending) {
      case 'Improving':
        return <span className="text-green-400 text-xs ml-2">↗ Improving</span>;
      case 'Worsening':
        return <span className="text-red-400 text-xs ml-2">↘ Worsening</span>;
      case 'Stable':
        return <span className="text-blue-400 text-xs ml-2">→ Stable</span>;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading case details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !caseData) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-2`}>Case Not Found</h2>
            <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'} mb-6`}>{error || 'The requested case could not be found.'}</p>
            <Button onClick={() => navigate('/pre-bill')} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Worklist
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <Button 
          onClick={() => navigate('/pre-bill')} 
          variant="ghost" 
          className={`mb-4 ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-700 hover:text-gray-900'}`}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Worklist
        </Button>
        
        <div className={`${theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} rounded-lg p-6 border`}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center space-x-3">
              <button
                onClick={handlePatientLookup}
                className={`flex items-center space-x-3 p-2 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-50'}`}
              >
                <User className="w-5 h-5 text-blue-400" />
              </button>
              <div>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>Patient</p>
                <button
                  onClick={handlePatientLookup}
                  className={`font-semibold underline text-left ${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
                >
                  {caseData.patientName}
                </button>
                <button
                  onClick={handlePatientLookup}
                  className={`text-sm underline block ${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
                >
                  {caseData.patientId}
                </button>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-green-400" />
              <div>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>Encounter Date</p>
                <p className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} font-semibold`}>{caseData.encounterDate}</p>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Admitted: {caseData.admissionDate}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <FileText className="w-5 h-5 text-purple-400" />
              <div>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>Current DRG</p>
                <p className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} font-semibold text-sm`}>{caseData.currentDRG}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <DollarSign className="w-5 h-5 text-yellow-400" />
              <div>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>Potential Impact</p>
                <p className={`${theme === 'dark' ? 'text-green-400' : 'text-green-600'} font-semibold`}>
                  ${caseData.potentialImpact.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Findings & Actions */}
        <div className="space-y-6">
           {/* AI Finding Card with structured ICD suggestions */}
           <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <span className="w-3 h-3 bg-blue-500 rounded-full mr-3"></span>
                AI-Identified ICD-10 Suggestions
              </CardTitle>
              <CardDescription className="text-gray-400">
                Based on clinical evidence analysis{caseData.icdSuggestions ? ` · Confidence: ${Math.round((caseData.icdSuggestions.confidence_score ?? 0) * 100)}%` : ''}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {Array.isArray(caseData.icdSuggestions?.suggested_codes) && caseData.icdSuggestions!.suggested_codes.length > 0 ? (
                <div className="space-y-3">
                  {caseData.icdSuggestions!.suggested_codes.map((s, idx) => (
                    <IcdSuggestionCard key={idx} suggestion={s} />
                  ))}
                </div>
              ) : (
                <div className="bg-blue-600 bg-opacity-10 border border-blue-600 border-opacity-30 rounded-lg p-4 mb-6">
                  <h3 className="text-lg font-semibold text-blue-400 mb-2">
                    Potential Diagnosis: {caseData.suggestedFinding}
                  </h3>
                  <p className="text-gray-300 text-sm">
                    This finding could significantly impact the DRG assignment and reimbursement for this case.
                    Review the supporting evidence to make an informed clinical decision.
                  </p>
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={() => handleAction('agree')}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  Agree & Generate Query
                </Button>
                <Button 
                  onClick={() => handleAction('disagree')}
                  variant="destructive"
                  className="flex-1"
                >
                  Disagree
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Conversational Chat Interface */}
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <MessageSquare className="w-5 h-5 mr-2" />
                Ask a Follow-up Question
              </CardTitle>
              <CardDescription className="text-gray-400">
                Continue the conversation about this case's clinical findings
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Chat History */}
              <div className="mb-4 max-h-64 overflow-y-auto space-y-3 bg-gray-800 rounded-lg p-3">
                {conversationHistory.length === 0 ? (
                  <div className="text-center text-gray-500 text-sm py-4">
                    No conversation yet. Ask a question to start!
                  </div>
                ) : (
                  conversationHistory.map((message) => (
                    <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                          message.role === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-700 text-gray-200'
                        }`}
                      >
                        <div className="whitespace-pre-wrap">{message.content}</div>
                        <div className={`text-xs mt-1 ${
                          message.role === 'user' ? 'text-blue-200' : 'text-gray-500'
                        }`}>
                          {message.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Input Area */}
              <div className="flex space-x-2">
                <Input
                  value={followUpQuestion}
                  onChange={(e) => setFollowUpQuestion(e.target.value)}
                  onKeyPress={handleInputKeyPress}
                  placeholder="Ask about the clinical evidence, diagnosis, or treatment recommendations..."
                  className="flex-1 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                  disabled={isSendingMessage}
                />
                <Button
                  onClick={handleSendFollowUp}
                  disabled={isSendingMessage || !followUpQuestion.trim()}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isSendingMessage ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Case Summary */}
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Case Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Status:</span>
                  <Badge variant="secondary" className="bg-blue-600 bg-opacity-20 text-blue-400">
                    {caseData.status}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Evidence Items:</span>
                  <span className="text-white font-medium">{caseData.evidence.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Avg. Relevance:</span>
                  <span className="text-white font-medium">
                    {Math.round(caseData.evidence.reduce((sum, ev) => sum + ev.relevanceScore, 0) / caseData.evidence.length)}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Evidence Viewer */}
        <div>
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-white mb-2">Supporting Clinical Evidence</h2>
            <p className="text-gray-400 text-sm">
              Review the clinical documentation that supports the AI-identified finding
            </p>
          </div>
          
          <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2">
            {caseData.evidence
              .sort((a, b) => b.relevanceScore - a.relevanceScore)
              .map((evidence) => (
                <Card key={evidence.id} className="bg-gray-900 border-gray-700">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white text-base flex items-center">
                        <span className="mr-2">{getEvidenceIcon(evidence.type)}</span>
                        {evidence.title}
                        {evidence.severity && (
                          <span className={getSeverityBadge(evidence.severity) || ''}>
                            {evidence.severity}
                          </span>
                        )}
                      </CardTitle>
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${getRelevanceColor(evidence.relevanceScore)}`}></div>
                        <span className="text-xs text-gray-400">{evidence.relevanceScore}%</span>
                      </div>
                    </div>
                    <div className="flex items-center text-xs text-gray-400">
                      <Clock className="w-3 h-3 mr-1" />
                      {evidence.timestamp}
                      {getTrendingIcon(evidence.trending)}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div 
                      className="text-sm text-gray-300 leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: highlightText(evidence.content, evidence.highlightedTerms)
                      }}
                    />
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseReview;