import { AnalyzingStatus } from '@/components/denials/AnalyzingStatus';
import { DataTableLoading, ErrorState } from '@/components/LoadingStates';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { useTheme } from '@/contexts/ThemeContext';
import { useCases, useDenials } from '@/hooks/useData';
import { getAnalysisResult, ResponsesAPIError, startBackgroundAnalysis } from '@/lib/responses-api';
import { formatCurrency, formatDate } from '@/lib/utils';
import { DenialRecord, FileUploadState } from '@/types/denials';
import type { Denial } from '@billigent/database';
import { useQueryClient } from '@tanstack/react-query';
import { AlertCircle, Download, FileText, Upload, X } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Reusable components
import PageHeader from '@/components/shared/PageHeader';

const DenialsManagement: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [denials, setDenials] = useState<DenialRecord[]>([]);
  const [_loading, setLoading] = useState(true);
  const [selectedDenial, setSelectedDenial] = useState<DenialRecord | null>(null);
  const [appealLetter, setAppealLetter] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fileUploadState, setFileUploadState] = useState<FileUploadState>({
    isDragOver: false,
    isUploading: false,
    uploadedFiles: []
  });

  // New state variables for async API workflow
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysisTaskId, setAnalysisTaskId] = useState<number | null>(null);
  const [currentError, setCurrentError] = useState<string>('');
  const [_aiGeneratedAppealLetters, _setAiGeneratedAppealLetters] = useState<Record<string, string>>({});

  // Load denials data from Azure SQL
  const { data: liveDenials, isLoading, error, refetch } = useDenials();
  const queryClient = useQueryClient();
  const { data: _cases } = useCases();

  useEffect(() => {
    setLoading(isLoading);
    if (liveDenials) {
            setDenials(liveDenials.map((d: Denial) => ({
        id: d.id,
        patientId: d.caseId || 'N/A',
        claimId: d.caseId || 'N/A', // Using caseId as claimId fallback
        denialReason: d.denialReason || 'N/A',
        status: d.status || 'Pending',
        amount: d.amount || 0,
        potentialRecovery: d.amount || 0,
        dateReceived: d.createdAt
      })));
    }
  }, [liveDenials, isLoading]);

  // Polling effect for background analysis results
  useEffect(() => {
    if (!analysisTaskId || !isProcessing) return;

    const pollForResults = async () => {
      try {
        setCurrentError('');
        const result = await getAnalysisResult(analysisTaskId);
        
        // Treat multiple success statuses as completion for Azure Responses API
        if (String(result.status).toLowerCase() === 'readyforreview') {
          // Invalidate to reload denials list
          queryClient.invalidateQueries({ queryKey: ['denials'] });
          setIsProcessing(false);
          setAnalysisTaskId(null);
        }
        // If still processing, the polling will continue
      } catch (error) {
        console.error('Error polling for analysis results:', error);
        if (error instanceof ResponsesAPIError) {
          setCurrentError(`Analysis failed: ${error.message}`);
        } else {
          setCurrentError('Failed to retrieve analysis results. Please try again.');
        }
        setIsProcessing(false);
        setAnalysisTaskId(null);
        
        // Update status to indicate failure
        setDenials(prevDenials => 
          prevDenials.map(denial => {
            if (denial.id === analysisTaskId) {
              return { ...denial, status: 'Denied' as const };
            }
            return denial;
          })
        );
      }
    };

    const interval = setInterval(pollForResults, 5000); // Poll every 5 seconds per spec
    return () => clearInterval(interval);
  }, [analysisTaskId, isProcessing]);

  // use shared formatCurrency

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setFileUploadState(prev => ({ ...prev, isDragOver: true }));
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setFileUploadState(prev => ({ ...prev, isDragOver: false }));
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setFileUploadState(prev => ({ ...prev, isDragOver: false }));
    
    const files = Array.from(e.dataTransfer.files);
    const pdfFiles = files.filter(file => file.type === 'application/pdf');

    if (pdfFiles.length > 0) {
      setFileUploadState(prev => ({ 
        ...prev, 
        uploadedFiles: [...prev.uploadedFiles, ...pdfFiles],
        isUploading: false 
      }));

      // Process the first PDF file with the Responses API
      const pdfFile = pdfFiles[0];
      await processFileWithAPI(pdfFile);
    }
  }, []);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const pdfFiles = files.filter(file => file.type === 'application/pdf');

    if (pdfFiles.length > 0) {
      setFileUploadState(prev => ({ 
        ...prev, 
        uploadedFiles: [...prev.uploadedFiles, ...pdfFiles],
        isUploading: false 
      }));

      // Process the first PDF file with the Responses API
      const pdfFile = pdfFiles[0];
      await processFileWithAPI(pdfFile);
    }
  }, []);

  const processFileWithAPI = async (file: File) => {
    try {
      setCurrentError('');
      setIsProcessing(true);
      
      const prompt = 'Analyze this denial letter, identify the reason code and summary, and then generate a complete, evidence-based appeal letter by analyzing the associated patient chart data.';
      
      // Start background analysis
      const denialId = await startBackgroundAnalysis(file, prompt, {
        // Minimal stub metadata; in a real flow, collect from form/selection
        patientFhirId: 'Patient/123',
        encounterFhirId: 'Encounter/123',
        claimFhirId: `Claim/${Date.now()}`,
      });
      setAnalysisTaskId(denialId);
      // Refresh list so new denial appears as Analyzing
      queryClient.invalidateQueries({ queryKey: ['denials'] });
      
    } catch (error) {
      console.error('Error starting file analysis:', error);
      if (error instanceof ResponsesAPIError) {
        setCurrentError(`Failed to analyze file: ${error.message}`);
      } else {
        setCurrentError('Failed to start file analysis. Please try again.');
      }
      setIsProcessing(false);
    }
  };

  const removeFile = useCallback((index: number) => {
    setFileUploadState(prev => ({
      ...prev,
      uploadedFiles: prev.uploadedFiles.filter((_, i) => i !== index)
    }));
  }, []);

  const handleReviewAppeal = (denial: DenialRecord) => {
    setSelectedDenial(denial);
    // Use AI-generated appeal letter if available
    const aiAppealLetter = _aiGeneratedAppealLetters[denial.id];
    if (aiAppealLetter) {
      setAppealLetter(aiAppealLetter);
    } else {
      setAppealLetter('');
    }
    
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDenial(null);
    setAppealLetter('');
  };

  const handleFinalizeAppeal = () => {
    if (selectedDenial) {
      console.log('Finalizing appeal for:', selectedDenial.claimId);
      console.log('Appeal letter:', appealLetter);
      
      // Simulate PDF generation and download
      const blob = new Blob([appealLetter], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Appeal_Letter_${selectedDenial.claimId}.txt`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      alert(`Appeal letter for claim ${selectedDenial.claimId} has been downloaded successfully.`);
      handleCloseModal();
    }
  };

  const handlePatientLookup = (patientId: string) => {
    navigate(`/patients?search=${patientId}`);
  };

  const handleClaimLookup = (claimId: string) => {
    navigate(`/claims?search=${claimId}`);
  };

  const _getStatusBadge = (status: DenialRecord['status']) => {
    const baseClasses = 'px-3 py-1 rounded-full text-xs font-medium';
    switch (status) {
      case 'Drafting Appeal':
        return `${baseClasses} bg-yellow-600 bg-opacity-20 text-yellow-400 border border-yellow-600 border-opacity-30`;
      case 'Ready for Review':
        return `${baseClasses} bg-blue-600 bg-opacity-20 text-blue-400 border border-blue-600 border-opacity-30`;
      case 'Submitted':
        return `${baseClasses} bg-purple-600 bg-opacity-20 text-purple-400 border border-purple-600 border-opacity-30`;
      case 'Approved':
        return `${baseClasses} bg-green-600 bg-opacity-20 text-green-400 border border-green-600 border-opacity-30`;
      case 'Denied':
        return `${baseClasses} bg-red-600 bg-opacity-20 text-red-400 border border-red-600 border-opacity-30`;
      default:
        return `${baseClasses} bg-gray-600 bg-opacity-20 text-gray-400 border border-gray-600 border-opacity-30`;
    }
  };

  // use shared formatDate from utils

  const truncateText = (text: string, maxLength: number = 50) => {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <DataTableLoading rows={8} columns={8} />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState title="Failed to load denials" message={(error as Error)?.message || 'Unknown error'} onRetry={() => refetch()} />
    );
  }

  const cardClass = theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200';
  const titleClass = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const subtleClass = theme === 'dark' ? 'text-gray-400' : 'text-gray-700';
  const bodyClass = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const listRowHover = theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-50';

  return (
    <div className="p-8">
      {/* Page Header */}
      <PageHeader
        title="AI-Powered Denials Management"
        description="Generative AI automatically drafts evidence-based appeal letters by synthesizing clinical data into persuasive arguments with payer-specific formatting."
      />

      {/* File Upload Section */}
      <Card className={`mb-8 ${cardClass}`}>
        <CardHeader>
          <CardTitle className={`${titleClass} flex items-center`}>
            <Upload className="w-5 h-5 mr-2" />
            Upload Denial Files
          </CardTitle>
          <CardDescription className={`${subtleClass}`}>
            Upload .835, .eob, .pdf, or .txt files containing denial information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors min-h-[240px] flex items-center justify-center ${
              fileUploadState.isDragOver
                ? 'border-blue-500 bg-blue-500 bg-opacity-10'
                : theme === 'dark' ? 'border-gray-600 hover:border-gray-500' : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center justify-center space-y-4 w-full">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <Upload className={`w-8 h-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
              </div>
              <div className="text-center">
                <p className={`text-lg font-medium ${titleClass} mb-2`}>
                  Drag & Drop PDF Denial File or Click to Upload
                </p>
                <p className={`text-sm ${subtleClass} mb-4`}>
                  Supports PDF files for AI-powered analysis
                </p>
                <Input
                  type="file"
                  multiple
                  accept=".pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                />
                <Button asChild variant="outline" className={`${theme === 'dark' ? 'border-gray-600 text-gray-300 hover:bg-gray-800' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`} disabled={isProcessing}>
                  <label htmlFor="file-upload" className="cursor-pointer">
                    {isProcessing ? 'Processing...' : 'Choose PDF Files'}
                  </label>
                </Button>
              </div>
            </div>
          </div>

          {/* Uploaded Files Display */}
          {fileUploadState.uploadedFiles.length > 0 && (
            <div className="mt-6">
              <h4 className={`text-sm font-medium ${titleClass} mb-3`}>Uploaded Files:</h4>
              <div className="space-y-2">
                {fileUploadState.uploadedFiles.map((file, index) => (
                  <div key={index} className={`flex items-center justify-between p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                    <div className="flex items-center space-x-3">
                      <FileText className={`w-4 h-4 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
                      <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}`}>{file.name}</span>
                      <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>
                        ({(file.size / 1024).toFixed(1)} KB)
                      </span>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeFile(index)}
                      className={`${theme === 'dark' ? 'text-gray-400 hover:text-red-400' : 'text-gray-700 hover:text-red-600'}`}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {fileUploadState.isUploading && (
            <div className="mt-4 text-center">
              <div className="inline-flex items-center space-x-2 text-blue-400">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
                <span className="text-sm">Processing files...</span>
              </div>
            </div>
          )}

          {/* Processing Status */}
          {isProcessing && (
            <div className="mt-4 p-4 bg-blue-600 bg-opacity-10 border border-blue-600 border-opacity-30 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-400"></div>
                <div>
                  <p className={`${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'} font-medium`}>AI Analysis in Progress</p>
                  <p className={`text-sm ${subtleClass}`}>Analyzing denial letter and generating appeal...</p>
                </div>
              </div>
            </div>
          )}

          {/* Error Display */}
          {currentError && (
            <div className="mt-4 p-4 bg-red-600 bg-opacity-10 border border-red-600 border-opacity-30 rounded-lg">
              <div className="flex items-center space-x-3">
                <AlertCircle className={`${theme === 'dark' ? 'text-red-400' : 'text-red-600'} w-5 h-5`} />
                <div>
                  <p className={`${theme === 'dark' ? 'text-red-400' : 'text-red-600'} font-medium`}>Analysis Error</p>
                  <p className={`text-sm ${subtleClass}`}>{currentError}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Denials Table */}
      <Card className={`${cardClass}`}>
        <CardHeader>
          <CardTitle className={`${titleClass}`}>Denial Cases</CardTitle>
          <CardDescription className={`${subtleClass}`}>
            Review and manage denied claims requiring appeals
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <div className="overflow-x-auto w-full max-w-full">
            <Table className="w-full">
              <TableHeader>
                <TableRow className={`${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} ${listRowHover}`}>
                  <TableHead className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} font-semibold text-center`}>Patient ID</TableHead>
                  <TableHead className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} font-semibold text-center`}>Claim ID</TableHead>
                  <TableHead className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} font-semibold text-center`}>Denial Reason</TableHead>
                  <TableHead className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} font-semibold text-center`}>Date Processed</TableHead>
                  <TableHead className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} font-semibold text-center`}>Status</TableHead>
                  <TableHead className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} font-semibold text-center`}>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {denials.map((denial) => (
                  <TableRow key={denial.id} className={`${theme === 'dark' ? 'border-gray-700 hover:bg-gray-800' : 'border-gray-200 hover:bg-gray-50'}`}>
                    <TableCell className={`font-medium ${bodyClass} text-center`}>
                      <button
                        onClick={() => handlePatientLookup(denial.patientId)}
                        className={`underline ${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
                      >
                        {denial.patientId}
                      </button>
                    </TableCell>
                    <TableCell className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'} text-center`}>
                      <button
                        onClick={() => handleClaimLookup(denial.claimId)}
                        className={`underline ${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
                      >
                        {denial.claimId}
                      </button>
                    </TableCell>
                    <TableCell className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'} text-center`}>
                      {denial.payerName}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className="text-xs">
                        {denial.denialCategory}
                      </Badge>
                    </TableCell>
                    <TableCell className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'} max-w-xs text-center`}>
                      <div className="truncate" title={denial.denialReason}>
                        {truncateText(denial.denialReason)}
                      </div>
                    </TableCell>
                    <TableCell className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'} text-center`}>
                      <span className={`${theme === 'dark' ? 'text-red-400' : 'text-red-600'} font-medium`}>
                        {denial.appealDeadline ? formatDate(denial.appealDeadline) : 'N/A'}
                      </span>
                    </TableCell>
                    <TableCell className={`${theme === 'dark' ? 'text-green-400' : 'text-green-600'} font-medium text-center`}>
                      {denial.potentialRecovery ? formatCurrency(denial.potentialRecovery) : 'N/A'}
                    </TableCell>
                    <TableCell className="text-center">
                      <AnalyzingStatus denialId={Number(denial.id)} status={denial.status} />
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        size="sm"
                        onClick={() => handleReviewAppeal(denial)}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Review Appeal
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Appeal Letter Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className={`max-w-4xl max-h-[90vh] ${cardClass}`}>
          <DialogHeader>
            <DialogTitle className={`${titleClass}`}>
              Appeal Letter - {selectedDenial?.claimId}
            </DialogTitle>
            <DialogDescription className={`${subtleClass}`}>
              Review and edit the appeal letter for {selectedDenial?.patientName} 
              ({selectedDenial?.patientId})
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 overflow-hidden">
            <div className={`mb-4 p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className={`${subtleClass}`}>Patient:</span>
                  <span className={`${bodyClass} ml-2`}>{selectedDenial?.patientName}</span>
                </div>
                <div>
                  <span className={`${subtleClass}`}>DOB:</span>
                  <span className={`${bodyClass} ml-2`}>{selectedDenial?.dateOfBirth}</span>
                </div>
                <div>
                  <span className={`${subtleClass}`}>Member ID:</span>
                  <span className={`${bodyClass} ml-2`}>{selectedDenial?.memberId}</span>
                </div>
                <div>
                  <span className={`${subtleClass}`}>Date of Service:</span>
                  <span className={`${bodyClass} ml-2`}>{selectedDenial?.dateOfService}</span>
                </div>
              </div>
            </div>

            <Textarea
              value={appealLetter}
              onChange={(e) => setAppealLetter(e.target.value)}
              className={`min-h-[400px] font-mono text-sm leading-relaxed resize-none ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
              placeholder="Appeal letter content will appear here..."
            />
          </div>

          <DialogFooter className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={handleCloseModal}
              className={`${theme === 'dark' ? 'border-gray-600 text-gray-300 hover:bg-gray-800' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}
            >
              Close
            </Button>
            <Button
              onClick={handleFinalizeAppeal}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Finalize & Download PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DenialsManagement;