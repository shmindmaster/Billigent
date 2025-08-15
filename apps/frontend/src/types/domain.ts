// Local domain model interfaces replacing former external Prisma-generated types
// Minimal shapes preserved; extend as Cosmos models evolve.

export interface Case {
  id: string;
  status?: string;
  priority?: string;
  assignedUserId?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any; // allow forward-compatible fields
}

export interface Denial {
  id: string;
  caseId?: string;
  denialReason?: string;
  status?: string;
  amount?: number;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

export interface Query {
  id: string;
  caseId?: string;
  status?: string;
  queryText?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

export interface PhysicianQuery {
  id: string;
  caseId: string;
  queryText: string;
  sentDate: string;
  dueDate?: string;
  status: string;
  physicianResponse?: string;
  responseDate?: string;
  impact?: string;
}
