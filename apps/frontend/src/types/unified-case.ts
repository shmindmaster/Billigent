export interface UnifiedCase {
  id: string;
  patientId: string;
  encounterId: string;
  status: 'open' | 'closed' | 'pending' | 'review';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  updatedAt: string;
  title: string;
  description?: string;
  assignedTo?: string;
  
  // Patient information
  patient: {
    id: string;
    name: string;
    dateOfBirth: string;
    gender: string;
    phone?: string;
    email?: string;
    address?: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
    };
  };
  
  // Encounter information
  encounter: {
    id: string;
    date: string;
    type: string;
    provider: string;
    facility: string;
    diagnoses: Array<{
      code: string;
      description: string;
      isPrimary: boolean;
    }>;
    procedures: Array<{
      code: string;
      description: string;
      date: string;
    }>;
  };
  
  // Financial information
  financial: {
    totalCharges: number;
    expectedReimbursement: number;
    actualReimbursement?: number;
    outstandingBalance: number;
  };
  
  // Metadata
  metadata?: {
    tags: string[];
    notes: string[];
    attachments: Array<{
      id: string;
      name: string;
      type: string;
      url: string;
    }>;
  };
}