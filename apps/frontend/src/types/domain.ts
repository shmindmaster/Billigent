// Local domain model interfaces for the Billigent application

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Case {
  id: string;
  patientId: string;
  encounterId: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD';
  priority: number;
  estimatedValue: number;
  assignedTo: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Denial {
  id: string;
  caseId: string;
  denialReason: string;
  denialAmount: number;
  appealStatus: 'PENDING' | 'IN_PROGRESS' | 'SUBMITTED' | 'DECIDED';
  submissionDate?: Date;
  decisionDate?: Date;
  outcome?: 'APPROVED' | 'DENIED' | 'PARTIAL';
  recoveryAmount?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Appeal {
  id: string;
  denialId: string;
  status: 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'DECIDED';
  content: string;
  supportingEvidence: string[];
  submittedAt?: Date;
  decisionDate?: Date;
  outcome?: 'APPROVED' | 'DENIED' | 'PARTIAL';
  createdAt: Date;
  updatedAt: Date;
}

export interface Diagnosis {
  id: string;
  caseId: string;
  icd10Code: string;
  description: string;
  isPresent: boolean;
  specificity: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Procedure {
  id: string;
  caseId: string;
  cptCode: string;
  description: string;
  date: Date;
  provider: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Query {
  id: string;
  caseId: string;
  type: 'CDI' | 'CODING' | 'CLINICAL';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  question: string;
  answer?: string;
  assignedTo: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Analytics {
  totalCases: number;
  activeCases: number;
  completedCases: number;
  totalDenials: number;
  resolvedDenials: number;
  totalRevenue: number;
  collectedRevenue: number;
  denialRate: number;
  appealSuccessRate: number;
  averageProcessingTime: number;
}

export interface PerformanceMetrics {
  responseTime: number;
  throughput: number;
  errorRate: number;
  availability: number;
  userSatisfaction: number;
}
