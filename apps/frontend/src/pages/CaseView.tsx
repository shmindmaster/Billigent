import { Breadcrumbs } from '@/components/shared/Breadcrumbs';
import { Heading } from '@/components/shared/Heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// Removed tabs; simplifying view to align with current UnifiedCase type
import { useTheme } from '@/contexts/ThemeContext';
import { useUnifiedCase } from '@/hooks/useData';
import { formatCurrency, formatDate, formatDateTime } from '@/lib/utils';
import { UnifiedCase } from '@/types/unified-case';
import { ArrowLeft, Calendar, DollarSign, FileText, User } from 'lucide-react';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const UnifiedCaseView: React.FC = () => {
  const { caseId } = useParams<{ caseId: string }>();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const cid = caseId ?? '';
  const { data, isLoading, error } = useUnifiedCase(cid);
  const caseData = data as UnifiedCase | undefined;

  const cardClass = theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200';
  const titleClass = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const subtleClass = theme === 'dark' ? 'text-gray-400' : 'text-gray-700';
  const bodyClass = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const secondaryTextClass = theme === 'dark' ? 'text-gray-300' : 'text-gray-700';

  const handlePatientLookup = () => {
    if (caseData) {
      navigate(`/cases?search=${caseData.patientId}`);
    }
  };

  // Removed unused handleClaimLookup function

  // Removed CDI and Denials review handlers; not present on UnifiedCase type

  // use shared utils for currency and dates

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
            <p className="text-gray-400 mb-6">{String(error || 'The requested case could not be found.')}</p>
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
                  {caseData.patient?.name}
                </button>
                <p className={`text-sm ${subtleClass}`}>{caseData.patientId}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-green-400" />
              <div>
                <p className={`text-sm ${subtleClass}`}>Encounter</p>
                <p className={`font-semibold ${bodyClass}`}>{caseData.encounter?.id}</p>
                <p className={`text-sm ${secondaryTextClass}`}>{caseData.encounter?.date ? formatDate(caseData.encounter.date) : 'N/A'}</p>
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
                <p className={`text-sm ${subtleClass}`}>Outstanding Balance</p>
                <p className={`font-semibold text-green-600 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
                  {formatCurrency(caseData.financial?.outstandingBalance || 0)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content simplified: show Financial Summary and Assignment */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Financial Summary */}
          <Card className={`${cardClass}`}>
            <CardHeader>
              <CardTitle className={`${titleClass}`}>Financial Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className={`text-sm ${subtleClass}`}>Total Charges:</span>
                <span className={`${bodyClass} font-medium`}>{formatCurrency(caseData.financial?.totalCharges || 0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className={`text-sm ${subtleClass}`}>Expected Reimbursement:</span>
                <span className={`${bodyClass} font-medium`}>{formatCurrency(caseData.financial?.expectedReimbursement || 0)}</span>
              </div>
              {typeof caseData.financial?.actualReimbursement === 'number' && (
                <div className="flex justify-between items-center">
                  <span className={`text-sm ${subtleClass}`}>Actual Reimbursement:</span>
                  <span className={`${theme === 'dark' ? 'text-green-400' : 'text-green-600'} font-medium`}>{formatCurrency(caseData.financial?.actualReimbursement || 0)}</span>
                </div>
              )}
              <div className="flex justify-between items-center pt-2 border-t border-gray-700">
                <span className={`text-sm ${subtleClass}`}>Outstanding Balance:</span>
                <span className={`${theme === 'dark' ? 'text-green-400' : 'text-green-600'} font-bold text-lg`}>{formatCurrency(caseData.financial?.outstandingBalance || 0)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Assignment */}
          <Card className={`${cardClass}`}>
            <CardHeader>
              <CardTitle className={`${titleClass}`}>Assignment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className={`text-sm ${subtleClass}`}>Assigned To</p>
                  <p className={`${bodyClass} font-medium`}>{caseData.assignedTo || 'Unassigned'}</p>
                </div>
                <div>
                  <p className={`text-sm ${subtleClass}`}>Last Updated</p>
                  <p className={`${bodyClass} font-medium`}>{caseData.updatedAt ? formatDateTime(caseData.updatedAt) : 'N/A'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Activity Log removed for now; not part of current UnifiedCase shape */}
    </div>
  );
};

export default UnifiedCaseView;