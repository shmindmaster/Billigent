import { Breadcrumbs } from '@/components/shared/Breadcrumbs';
import { Heading } from '@/components/shared/Heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTheme } from '@/contexts/ThemeContext';
import { useUnifiedCase } from '@/hooks/useData';
import { formatCurrency, formatDate, formatDateTime } from '@/lib/utils';
import { UnifiedCase } from '@/types/unified-case';
import { Activity, AlertTriangle, ArrowLeft, Calendar, Clock, DollarSign, FileText, User } from 'lucide-react';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const UnifiedCaseView: React.FC = () => {
  const { caseId } = useParams<{ caseId: string }>();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const cid = Number(caseId);
  const { data, isLoading, error } = useUnifiedCase(cid);
  const caseData = data as UnifiedCase | undefined;

  const cardClass = theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200';
  const titleClass = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const subtleClass = theme === 'dark' ? 'text-gray-400' : 'text-gray-700';
  const bodyClass = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const secondaryTextClass = theme === 'dark' ? 'text-gray-300' : 'text-gray-700';
  const listItemBg = theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50';

  const handlePatientLookup = () => {
    if (caseData) {
      navigate(`/cases?search=${caseData.patientId}`);
    }
  };

  const handleClaimLookup = (claimId: string) => {
    navigate(`/cases?search=${claimId}`);
  };

  const handleCDIReview = () => {
    if (caseData?.cdiCase) {
      navigate(`/pre-bill/${caseData.cdiCase.id}`);
    }
  };

  const handleDenialReview = (denialId: string) => {
    navigate(`/denials?focus=${denialId}`);
  };

  // use shared utils for currency and dates

  const _getStatusBadge = (status: string) => {
    const baseClasses = 'px-3 py-1 rounded-full text-xs font-medium';
    switch (status) {
      case 'Active':
        return `${baseClasses} bg-blue-600 bg-opacity-20 text-blue-400 border border-blue-600 border-opacity-30`;
      case 'Under Review':
        return `${baseClasses} bg-yellow-600 bg-opacity-20 text-yellow-400 border border-yellow-600 border-opacity-30`;
      case 'Completed':
        return `${baseClasses} bg-green-600 bg-opacity-20 text-green-400 border border-green-600 border-opacity-30`;
      case 'New':
        return `${baseClasses} bg-blue-600 bg-opacity-20 text-blue-400 border border-blue-600 border-opacity-30`;
      case 'Queried':
        return `${baseClasses} bg-yellow-600 bg-opacity-20 text-yellow-400 border border-yellow-600 border-opacity-30`;
      case 'Appeal Submitted':
        return `${baseClasses} bg-purple-600 bg-opacity-20 text-purple-400 border border-purple-600 border-opacity-30`;
      default:
        return `${baseClasses} bg-gray-600 bg-opacity-20 text-gray-400 border border-gray-600 border-opacity-30`;
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'CDI_REVIEW':
        return <FileText className="w-4 h-4 text-blue-400" />;
      case 'QUERY_SENT':
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'DENIAL_RECEIVED':
        return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case 'APPEAL_DRAFTED':
        return <FileText className="w-4 h-4 text-purple-400" />;
      case 'APPEAL_SUBMITTED':
        return <Activity className="w-4 h-4 text-green-400" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  if (isLoading) {
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
            <h2 className="text-xl font-semibold text-white mb-2">Case Not Found</h2>
            <p className="text-gray-400 mb-6">{typeof error === 'string' ? error : (error as Error)?.message || 'The requested case could not be found.'}</p>
            <Button onClick={() => navigate('/cases')} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Cases
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
        <Breadcrumbs items={[{ label: 'Home', to: '/dashboard' }, { label: 'Cases', to: '/cases' }, { label: `Case #${cid}` }]} />
        <div className="flex items-center justify-between mb-4">
          <Heading level={1} className={titleClass}>Case #{cid}</Heading>
          <Button 
            onClick={() => navigate('/cases')} 
            variant="ghost" 
            className={`mb-0 ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-700 hover:text-gray-900'}`}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Cases
          </Button>
        </div>
        
        <div className={`${cardClass} rounded-lg p-6 border`}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center space-x-3">
              <User className="w-5 h-5 text-blue-400" />
              <div>
                <p className={`text-sm ${subtleClass}`}>Patient</p>
                <button
                  onClick={handlePatientLookup}
                  className={`font-semibold underline text-left ${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
                >
                  {caseData.patientName}
                </button>
                <p className={`text-sm ${subtleClass}`}>{caseData.patientId}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-green-400" />
              <div>
                <p className={`text-sm ${subtleClass}`}>Encounter</p>
                <p className={`font-semibold ${bodyClass}`}>{caseData.encounterId}</p>
                <p className={`text-sm ${secondaryTextClass}`}>{formatDate(caseData.encounterDate)}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <FileText className="w-5 h-5 text-purple-400" />
              <div>
                <p className={`text-sm ${subtleClass}`}>Status</p>
                 <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-600 bg-opacity-20 text-blue-400 border border-blue-600 border-opacity-30">{caseData.status}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <DollarSign className="w-5 h-5 text-yellow-400" />
              <div>
                <p className={`text-sm ${subtleClass}`}>Potential Recovery</p>
                <p className={`font-semibold text-green-600 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
                  {formatCurrency(caseData.financialSummary.potentialRecovery || 0)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabbed Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className={`${cardClass} border`}>
          <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600">Overview</TabsTrigger>
          <TabsTrigger value="cdi" className="data-[state=active]:bg-blue-600">Pre-Bill Review</TabsTrigger>
          <TabsTrigger value="denials" className="data-[state=active]:bg-blue-600">Denials</TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-blue-600">Activity Log</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Clinical Summary */}
            <Card className={`${cardClass}`}>
              <CardHeader>
                <CardTitle className={`${titleClass}`}>Clinical Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className={`text-sm ${subtleClass}`}>Primary Diagnosis</p>
                  <p className={`${bodyClass} font-medium`}>{caseData.clinicalSummary.primaryDiagnosis}</p>
                </div>
                <div>
                  <p className={`text-sm ${subtleClass}`}>Secondary Diagnoses</p>
                  <ul className={`${bodyClass} text-sm space-y-1`}>
                    {caseData.clinicalSummary.secondaryDiagnoses.map((diagnosis, index) => (
                      <li key={index}>• {diagnosis}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className={`text-sm ${subtleClass}`}>Procedures</p>
                  <ul className={`${bodyClass} text-sm space-y-1`}>
                    {caseData.clinicalSummary.procedures.map((procedure, index) => (
                      <li key={index}>• {procedure}</li>
                    ))}
                  </ul>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`text-sm ${subtleClass}`}>Length of Stay:</span>
                  <span className={`${bodyClass} font-medium`}>{caseData.clinicalSummary.lengthOfStay} days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`text-sm ${subtleClass}`}>Severity:</span>
                  <Badge variant={caseData.clinicalSummary.severity === 'High' ? 'destructive' : 'secondary'}>
                    {caseData.clinicalSummary.severity}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Financial Summary */}
            <Card className={`${cardClass}`}>
              <CardHeader>
                <CardTitle className={`${titleClass}`}>Financial Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className={`text-sm ${subtleClass}`}>Total Charges:</span>
                  <span className={`${bodyClass} font-medium`}>{formatCurrency(caseData.financialSummary.totalCharges)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`text-sm ${subtleClass}`}>Expected Reimbursement:</span>
                  <span className={`${bodyClass} font-medium`}>{formatCurrency(caseData.financialSummary.expectedReimbursement)}</span>
                </div>
                {caseData.financialSummary.actualReimbursement && (
                  <div className="flex justify-between items-center">
                    <span className={`text-sm ${subtleClass}`}>Actual Reimbursement:</span>
                    <span className={`${theme === 'dark' ? 'text-green-400' : 'text-green-600'} font-medium`}>{formatCurrency(caseData.financialSummary.actualReimbursement)}</span>
                  </div>
                )}
                {caseData.financialSummary.deniedAmount && (
                  <div className="flex justify-between items-center">
                    <span className={`text-sm ${subtleClass}`}>Denied Amount:</span>
                    <span className={`${theme === 'dark' ? 'text-red-400' : 'text-red-600'} font-medium`}>{formatCurrency(caseData.financialSummary.deniedAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-2 border-t border-gray-700">
                  <span className={`text-sm ${subtleClass}`}>Potential Recovery:</span>
                  <span className={`${theme === 'dark' ? 'text-green-400' : 'text-green-600'} font-bold text-lg`}>{formatCurrency(caseData.financialSummary.potentialRecovery || 0)}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Assignment Information */}
          <Card className={`${cardClass}`}>
            <CardHeader>
              <CardTitle className={`${titleClass}`}>Case Assignment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className={`text-sm ${subtleClass}`}>CDI Specialist</p>
                  <p className={`${bodyClass} font-medium`}>
                    {caseData.assignedTo?.cdiSpecialist || 'Unassigned'}
                  </p>
                </div>
                <div>
                  <p className={`text-sm ${subtleClass}`}>Denials Specialist</p>
                  <p className={`${bodyClass} font-medium`}>
                    {caseData.assignedTo?.denialsSpecialist || 'Unassigned'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* CDI Tab */}
        <TabsContent value="cdi" className="space-y-6">
          {caseData.cdiCase ? (
            <Card className={`${cardClass}`}>
              <CardHeader>
                <CardTitle className={`${titleClass}`}>CDI Review Details</CardTitle>
                <CardDescription className={`${subtleClass}`}>
                  Clinical Documentation Improvement opportunity identified by AI
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className={`text-sm ${subtleClass}`}>Current DRG</p>
                    <p className={`${bodyClass} font-medium`}>{caseData.cdiCase.currentDRG}</p>
                  </div>
                  <div>
                    <p className={`text-sm ${subtleClass}`}>Status</p>
                     <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-600 bg-opacity-20 text-blue-400 border border-blue-600 border-opacity-30">{caseData.cdiCase.status}</span>
                  </div>
                  <div>
                    <p className={`text-sm ${subtleClass}`}>Suggested Finding</p>
                    <p className={`${bodyClass} font-medium`}>{caseData.cdiCase.suggestedFinding}</p>
                  </div>
                  <div>
                    <p className={`text-sm ${subtleClass}`}>Potential Impact</p>
                    <p className={`${theme === 'dark' ? 'text-green-400' : 'text-green-600'} font-bold`}>{formatCurrency(caseData.cdiCase.potentialImpact || 0)}</p>
                  </div>
                  <div>
                    <p className={`text-sm ${subtleClass}`}>Queries Sent</p>
                    <p className={`${bodyClass} font-medium`}>{caseData.cdiCase.queryCount}</p>
                  </div>
                  <div>
                    <p className={`text-sm ${subtleClass}`}>Last Review</p>
                    <p className={`${bodyClass} font-medium`}>
                      {caseData.cdiCase.lastReviewDate ? formatDate(caseData.cdiCase.lastReviewDate) : 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="pt-4">
                  <Button onClick={handleCDIReview} className="bg-blue-600 hover:bg-blue-700">
                    Review CDI Case Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className={`${cardClass}`}>
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className={`text-xl font-semibold ${titleClass} mb-2`}>No CDI Case</h3>
                  <p className={`${subtleClass}`}>No Clinical Documentation Improvement opportunities identified for this encounter.</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Denials Tab */}
        <TabsContent value="denials" className="space-y-6">
          {caseData.denials && caseData.denials.length > 0 ? (
            <div className="space-y-4">
              {caseData.denials.map((denial) => (
                <Card key={denial.id} className={`${cardClass}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className={`${titleClass}`}>Denial Case</CardTitle>
                       <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-600 bg-opacity-20 text-blue-400 border border-blue-600 border-opacity-30">{denial.status}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className={`text-sm ${subtleClass}`}>Claim ID</p>
                        <button
                          onClick={() => handleClaimLookup(denial.claimId)}
                          className={`underline font-medium ${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
                        >
                          {denial.claimId}
                        </button>
                      </div>
                      <div>
                        <p className={`text-sm ${subtleClass}`}>Payer</p>
                        <p className={`${bodyClass} font-medium`}>{denial.payerName}</p>
                      </div>
                      <div>
                        <p className={`text-sm ${subtleClass}`}>Denial Reason</p>
                        <p className={`${bodyClass} font-medium`}>{denial.denialReason}</p>
                      </div>
                      <div>
                        <p className={`text-sm ${subtleClass}`}>Category</p>
                        <Badge variant="outline">{denial.denialCategory}</Badge>
                      </div>
                      <div>
                        <p className={`text-sm ${subtleClass}`}>Denied Amount</p>
                        <p className={`${theme === 'dark' ? 'text-red-400' : 'text-red-600'} font-bold`}>{formatCurrency(denial.deniedAmount)}</p>
                      </div>
                      <div>
                        <p className={`text-sm ${subtleClass}`}>Appeal Deadline</p>
                        <p className={`${bodyClass} font-medium`}>
                          {denial.appealDeadline ? formatDate(denial.appealDeadline) : 'N/A'}
                        </p>
                      </div>
                    </div>
                    <div className="pt-4">
                      <Button 
                        onClick={() => handleDenialReview(denial.id)} 
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        Review Denial Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className={`${cardClass}`}>
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className={`text-xl font-semibold ${titleClass} mb-2`}>No Denials</h3>
                  <p className={`${subtleClass}`}>No denied claims associated with this encounter.</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Activity Log Tab */}
        <TabsContent value="history" className="space-y-6">
          <Card className={`${cardClass}`}>
            <CardHeader>
              <CardTitle className={`${titleClass}`}>Activity Log</CardTitle>
              <CardDescription className={`${subtleClass}`}>
                Complete audit trail of all actions taken on this case
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {caseData.activityLog.map((activity) => (
                  <div key={activity.id} className={`flex items-start space-x-4 p-4 rounded-lg ${listItemBg}`}>
                    <div className="flex-shrink-0 mt-1">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <p className={`${bodyClass} font-medium`}>{activity.description}</p>
                        <Badge variant="outline" className="text-xs">
                          {activity.module}
                        </Badge>
                      </div>
                      <div className={`flex items-center justify-between text-sm ${subtleClass}`}>
                        <span>Performed by: {activity.performedBy}</span>
                        <span>{formatDateTime(activity.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UnifiedCaseView;