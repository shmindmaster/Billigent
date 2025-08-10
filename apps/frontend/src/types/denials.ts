export type DenialRecord = {
  id: string | number;
  patientId: string;
  patientName?: string;
  claimId: string;
  payerName?: string;
  dateOfBirth?: string;
  memberId?: string;
  dateOfService?: string;
  dateProcessed?: string;
  denialCategory?: string;
  denialReason: string;
  appealDeadline?: string;
  potentialRecovery?: number;
  status: 'Drafting Appeal' | 'Ready for Review' | 'Submitted' | 'Approved' | 'Denied' | string;
};

export type FileUploadState = {
  isDragOver: boolean;
  isUploading: boolean;
  uploadedFiles: File[];
};


