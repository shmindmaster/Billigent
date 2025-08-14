/**
 * Database Connection Service
 * Manages pooled connections to Azure SQL Database
 */

import axios from 'axios';

// ============================================================================
// AZURE SQL DATABASE INTERFACES
// ============================================================================

export interface DenialPattern {
  id: string;
  patternName: string;
  denialReason: string;
  diagnosisCodes: string[];
  clinicalIndicators: string[];
  riskScore: number;
  successRate: number;
  averageAppealTime: number;
  createdAt: string;
  updatedAt: string;
}

export interface AppealCase {
  id: string;
  patientId: string;
  encounterId: string;
  denialPatternId: string;
  denialReason: string;
  denialAmount: number;
  appealStatus: 'pending' | 'submitted' | 'under_review' | 'approved' | 'denied';
  submissionDate?: string;
  decisionDate?: string;
  outcome: 'pending' | 'overturned' | 'upheld' | 'partial';
  recoveryAmount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface KPIMetric {
  id: string;
  metricName: string;
  metricValue: number;
  targetValue: number;
  unit: string;
  category: string;
  timePeriod: string;
  calculatedAt: string;
}

export interface ClinicalDocument {
  id: string;
  patientId: string;
  encounterId: string;
  documentType: string;
  content: string;
  metadata: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// AZURE COSMOS DB INTERFACES
// ============================================================================

export interface EvidenceBundle {
  id: string;
  patientId: string;
  encounterId: string;
  bundleHash: string;
  facts: Array<{
    id: string;
    text: string;
    codeIds: string[];
    sourceIds: string[];
    confidence: number;
    timestamp: string;
  }>;
  codes: Array<{
    id: string;
    system: string;
    code: string;
    description: string;
    version: string;
  }>;
  regulations: Array<{
    id: string;
    citation: string;
    title: string;
    effectiveDate: string;
    authority: string;
  }>;
  sources: Array<{
    id: string;
    citation: string;
    type: string;
    url?: string;
    lastAccessed: string;
  }>;
  metadata: {
    generatedAt: string;
    version: string;
    checksum: string;
    attributionScore: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface AttributionTracking {
  id: string;
  bundleId: string;
  patientId: string;
  attributionType: 'l1_normalized' | 'weighted_span' | 'checksum_verified';
  spans: Array<{
    factId: string;
    weight: number;
    source: string;
    confidence: number;
    timestamp: string;
  }>;
  checksum: string;
  verificationStatus: 'pending' | 'verified' | 'failed';
  verificationTimestamp?: string;
  auditTrail: Array<{
    action: string;
    timestamp: string;
    userId: string;
    details: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentVersion {
  id: string;
  documentId: string;
  version: number;
  content: string;
  metadata: Record<string, any>;
  changes: Array<{
    type: 'insert' | 'update' | 'delete';
    field: string;
    oldValue?: any;
    newValue?: any;
    timestamp: string;
    userId: string;
  }>;
  checksum: string;
  createdAt: string;
  createdBy: string;
}

export interface CollaborationSession {
  id: string;
  sessionId: string;
  caseId: string;
  participants: Array<{
    userId: string;
    role: string;
    joinedAt: string;
    lastActivity: string;
  }>;
  activities: Array<{
    type: 'comment' | 'edit' | 'review' | 'approval';
    userId: string;
    content: string;
    timestamp: string;
    metadata?: Record<string, any>;
  }>;
  status: 'active' | 'paused' | 'completed';
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// DATABASE SERVICE CLASS
// ============================================================================

export class DatabaseService {
  private baseURL: string;

  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
  }

  // ============================================================================
  // AZURE SQL DATABASE OPERATIONS
  // ============================================================================

  /**
   * Initialize Azure SQL Database schema
   */
  async initializeSQLSchema(): Promise<{ success: boolean; message: string }> {
    const response = await axios.post(`${this.baseURL}/api/database/sql/init`);
    return response.data;
  }

  /**
   * Store denial pattern
   */
  async storeDenialPattern(pattern: DenialPattern): Promise<{ success: boolean; message: string }> {
    const response = await axios.post(`${this.baseURL}/api/database/sql/denial-patterns`, pattern);
    return response.data;
  }

  /**
   * Get denial patterns by diagnosis codes
   */
  async getDenialPatternsByCodes(codes: string[]): Promise<{ success: boolean; patterns: DenialPattern[] }> {
    const codesParam = codes.join(',');
    const response = await axios.get(`${this.baseURL}/api/database/sql/denial-patterns/${codesParam}`);
    return response.data;
  }

  /**
   * Store appeal case
   */
  async storeAppealCase(appealCase: AppealCase): Promise<{ success: boolean; message: string }> {
    const response = await axios.post(`${this.baseURL}/api/database/sql/appeal-cases`, appealCase);
    return response.data;
  }

  /**
   * Update appeal case status
   */
  async updateAppealCaseStatus(
    id: string,
    status: AppealCase['appealStatus'],
    outcome?: AppealCase['outcome'],
    recoveryAmount?: number
  ): Promise<{ success: boolean; message: string }> {
    const response = await axios.put(`${this.baseURL}/api/database/sql/appeal-cases/${id}/status`, {
      status,
      outcome,
      recoveryAmount
    });
    return response.data;
  }

  /**
   * Get appeal cases by patient
   */
  async getAppealCasesByPatient(patientId: string): Promise<{ success: boolean; cases: AppealCase[] }> {
    const response = await axios.get(`${this.baseURL}/api/database/sql/appeal-cases/patient/${patientId}`);
    return response.data;
  }

  /**
   * Get real-time KPI calculations
   */
  async getRealTimeKPIs(): Promise<{
    success: boolean;
    kpis: Record<string, number>;
    calculatedAt: string;
  }> {
    const response = await axios.get(`${this.baseURL}/api/database/sql/kpis/real-time`);
    return response.data;
  }

  /**
   * Store KPI metric
   */
  async storeKPIMetric(metric: KPIMetric): Promise<{ success: boolean; message: string }> {
    const response = await axios.post(`${this.baseURL}/api/database/sql/kpis`, metric);
    return response.data;
  }

  /**
   * Get KPI metrics by category and time period
   */
  async getKPIMetrics(
    category: string,
    timePeriod: string,
    limit: number = 100
  ): Promise<{ success: boolean; metrics: KPIMetric[] }> {
    const response = await axios.get(
      `${this.baseURL}/api/database/sql/kpis/${category}/${timePeriod}?limit=${limit}`
    );
    return response.data;
  }

  // ============================================================================
  // AZURE COSMOS DB OPERATIONS
  // ============================================================================

  /**
   * Initialize Cosmos DB containers
   */
  async initializeCosmosContainers(): Promise<{ success: boolean; message: string }> {
    const response = await axios.post(`${this.baseURL}/api/database/cosmos/init`);
    return response.data;
  }

  /**
   * Store evidence bundle
   */
  async storeEvidenceBundle(bundle: EvidenceBundle): Promise<{ success: boolean; message: string }> {
    const response = await axios.post(`${this.baseURL}/api/database/cosmos/evidence-bundles`, bundle);
    return response.data;
  }

  /**
   * Get evidence bundle by ID
   */
  async getEvidenceBundle(id: string, patientId: string): Promise<{ success: boolean; bundle: EvidenceBundle }> {
    const response = await axios.get(`${this.baseURL}/api/database/cosmos/evidence-bundles/${id}/${patientId}`);
    return response.data;
  }

  /**
   * Get evidence bundles by patient
   */
  async getEvidenceBundlesByPatient(patientId: string): Promise<{ success: boolean; bundles: EvidenceBundle[] }> {
    const response = await axios.get(`${this.baseURL}/api/database/cosmos/evidence-bundles/patient/${patientId}`);
    return response.data;
  }

  /**
   * Store attribution tracking
   */
  async storeAttributionTracking(attribution: AttributionTracking): Promise<{ success: boolean; message: string }> {
    const response = await axios.post(`${this.baseURL}/api/database/cosmos/attribution-tracking`, attribution);
    return response.data;
  }

  /**
   * Update attribution verification status
   */
  async updateAttributionVerification(
    bundleId: string,
    status: AttributionTracking['verificationStatus'],
    checksum?: string
  ): Promise<{ success: boolean; message: string }> {
    const response = await axios.put(`${this.baseURL}/api/database/cosmos/attribution-tracking/${bundleId}/verification`, {
      status,
      checksum
    });
    return response.data;
  }

  /**
   * Store document version
   */
  async storeDocumentVersion(version: DocumentVersion): Promise<{ success: boolean; message: string }> {
    const response = await axios.post(`${this.baseURL}/api/database/cosmos/document-versions`, version);
    return response.data;
  }

  /**
   * Get document versions by document ID
   */
  async getDocumentVersions(documentId: string): Promise<{ success: boolean; versions: DocumentVersion[] }> {
    const response = await axios.get(`${this.baseURL}/api/database/cosmos/document-versions/${documentId}`);
    return response.data;
  }

  /**
   * Store collaboration session
   */
  async storeCollaborationSession(session: CollaborationSession): Promise<{ success: boolean; message: string }> {
    const response = await axios.post(`${this.baseURL}/api/database/cosmos/collaboration-sessions`, session);
    return response.data;
  }

  /**
   * Update collaboration session
   */
  async updateCollaborationSession(
    sessionId: string,
    updates: Partial<CollaborationSession>
  ): Promise<{ success: boolean; message: string }> {
    const response = await axios.put(`${this.baseURL}/api/database/cosmos/collaboration-sessions/${sessionId}`, updates);
    return response.data;
  }

  /**
   * Add activity to collaboration session
   */
  async addCollaborationActivity(
    sessionId: string,
    activity: CollaborationSession['activities'][0]
  ): Promise<{ success: boolean; message: string }> {
    const response = await axios.post(
      `${this.baseURL}/api/database/cosmos/collaboration-sessions/${sessionId}/activities`,
      activity
    );
    return response.data;
  }

  /**
   * Get collaboration session by ID
   */
  async getCollaborationSession(sessionId: string): Promise<{ success: boolean; session: CollaborationSession }> {
    const response = await axios.get(`${this.baseURL}/api/database/cosmos/collaboration-sessions/${sessionId}`);
    return response.data;
  }

  /**
   * Get active collaboration sessions by case ID
   */
  async getActiveCollaborationSessions(caseId: string): Promise<{ success: boolean; sessions: CollaborationSession[] }> {
    const response = await axios.get(`${this.baseURL}/api/database/cosmos/collaboration-sessions/case/${caseId}/active`);
    return response.data;
  }

  // ============================================================================
  // HEALTH CHECK OPERATIONS
  // ============================================================================

  /**
   * Check SQL Database health
   */
  async checkSQLHealth(): Promise<{
    status: string;
    database: string;
    server: string;
    connectionTime: number;
  }> {
    const response = await axios.get(`${this.baseURL}/api/database/health/sql`);
    return response.data;
  }

  /**
   * Check Cosmos DB health
   */
  async checkCosmosHealth(): Promise<{
    status: string;
    database: string;
    containers: string[];
    connectionTime: number;
  }> {
    const response = await axios.get(`${this.baseURL}/api/database/health/cosmos`);
    return response.data;
  }

  /**
   * Check overall database health
   */
  async checkOverallHealth(): Promise<{
    status: string;
    timestamp: string;
    services: {
      sql: any;
      cosmos: any;
    };
  }> {
    const response = await axios.get(`${this.baseURL}/api/database/health`);
    return response.data;
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  /**
   * Initialize all database services
   */
  async initializeAll(): Promise<{
    sql: { success: boolean; message: string };
    cosmos: { success: boolean; message: string };
  }> {
    try {
      const [sqlResult, cosmosResult] = await Promise.all([
        this.initializeSQLSchema(),
        this.initializeCosmosContainers()
      ]);

      return {
        sql: sqlResult,
        cosmos: cosmosResult
      };
    } catch (error) {
      console.error('Failed to initialize database services:', error);
      throw error;
    }
  }

  /**
   * Get database connection status
   */
  async getConnectionStatus(): Promise<{
    sql: string;
    cosmos: string;
    overall: string;
  }> {
    try {
      const overallHealth = await this.checkOverallHealth();
      
      return {
        sql: overallHealth.services.sql.status,
        cosmos: overallHealth.services.cosmos.status,
        overall: overallHealth.status
      };
    } catch (error) {
      return {
        sql: 'unknown',
        cosmos: 'unknown',
        overall: 'unknown'
      };
    }
  }
}

// Export singleton instance
export const databaseService = new DatabaseService();
export default databaseService;
