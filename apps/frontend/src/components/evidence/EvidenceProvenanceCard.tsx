import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { useCaseEvidenceSummary } from '@/hooks/useEvidence';
import { 
  FileText, 
  Code, 
  Shield, 
  BookOpen, 
  Hash, 
  CheckCircle, 
  AlertTriangle,
  Eye,
  Download
} from 'lucide-react';

interface EvidenceProvenanceCardProps {
  caseId: string;
  onViewEvidence?: () => void;
  onGenerateAppeal?: () => void;
}

export const EvidenceProvenanceCard: React.FC<EvidenceProvenanceCardProps> = ({
  caseId,
  onViewEvidence,
  onGenerateAppeal,
}) => {
  const { theme } = useTheme();
  const { data: evidenceSummary, isLoading, error } = useCaseEvidenceSummary(caseId);

  if (isLoading) {
    return (
      <Card className={`${theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-sm text-gray-500">Loading evidence...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !evidenceSummary) {
    return (
      <Card className={`${theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
        <CardContent className="p-6">
          <div className="text-center">
            <AlertTriangle className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <p className="text-sm text-gray-500">Unable to load evidence provenance</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { factCount, codeCount, regulationCount, sourceCount, hasAttribution } = evidenceSummary;

  return (
    <Card className={`${theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className={`text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Evidence Provenance
            </CardTitle>
            <CardDescription className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
              Clinical evidence bundle with attribution tracking
            </CardDescription>
          </div>
          <Badge 
            variant={hasAttribution ? "default" : "secondary"}
            className={hasAttribution ? "bg-green-100 text-green-800" : ""}
          >
            {hasAttribution ? (
              <>
                <CheckCircle className="w-3 h-3 mr-1" />
                Verified
              </>
            ) : (
              <>
                <AlertTriangle className="w-3 h-3 mr-1" />
                Pending
              </>
            )}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Evidence Summary Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className={`flex items-center space-x-3 p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
            <FileText className="w-5 h-5 text-blue-500" />
            <div>
              <p className="text-sm text-gray-500">Clinical Facts</p>
              <p className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {factCount}
              </p>
            </div>
          </div>
          
          <div className={`flex items-center space-x-3 p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
            <Code className="w-5 h-5 text-green-500" />
            <div>
              <p className="text-sm text-gray-500">Diagnosis Codes</p>
              <p className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {codeCount}
              </p>
            </div>
          </div>
          
          <div className={`flex items-center space-x-3 p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
            <Shield className="w-5 h-5 text-purple-500" />
            <div>
              <p className="text-sm text-gray-500">Regulations</p>
              <p className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {regulationCount}
              </p>
            </div>
          </div>
          
          <div className={`flex items-center space-x-3 p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
            <BookOpen className="w-5 h-5 text-orange-500" />
            <div>
              <p className="text-sm text-gray-500">Sources</p>
              <p className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {sourceCount}
              </p>
            </div>
          </div>
        </div>

        {/* Bundle Hash Display */}
        {hasAttribution && (
          <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
            <div className="flex items-center space-x-2 mb-2">
              <Hash className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Bundle Hash</span>
            </div>
            <div className="flex items-center space-x-2">
              <code className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded font-mono">
                {evidenceSummary.bundleHash?.slice(0, 16)}...
              </code>
              <Button variant="ghost" size="sm" className="h-6 px-2">
                <Eye className="w-3 h-3" />
              </Button>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onViewEvidence}
            className="flex-1"
          >
            <Eye className="w-4 h-4 mr-2" />
            View Evidence
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onGenerateAppeal}
            className="flex-1"
            disabled={!hasAttribution}
          >
            <Download className="w-4 h-4 mr-2" />
            Generate Appeal
          </Button>
        </div>

        {/* Attribution Status */}
        <div className={`text-xs p-2 rounded ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
            {hasAttribution 
              ? "Evidence bundle verified with L1-normalized attribution checksums for audit compliance."
              : "Evidence bundle generation in progress. Attribution will be available shortly."
            }
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
