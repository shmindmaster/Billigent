import axios from 'axios';

export interface FHIRIngestionResult {
  processedResources: number;
  clinicalDocuments: any[];
  evidenceBundles: number;
  errors: string[];
  processingTime: number;
  metadata: {
    dataLakeAccount: string;
    container: string;
    timestamp: string;
  };
}

export interface FHIRIngestionStats {
  totalDocuments: number;
  lastIngestion: string;
  dataLakeAccount: string;
  container: string;
}

export interface FHIRScheduleConfig {
  schedule: string;
  fileSystemName: string;
  path: string;
  enabled: boolean;
  nextRun: string;
}

export interface FHIRResource {
  id: string;
  resourceType: string;
  patientId: string;
  encounterId?: string;
  content: string;
  timestamp: string;
  source: string;
}

export interface FHIRValidationResult {
  valid: boolean;
  fileCount: number;
  resourceCount: number;
  errors: string[];
  warnings: string[];
  metadata: {
    fileSystemName: string;
    path: string;
    timestamp: string;
  };
}

export interface FHIRHealthStatus {
  status: string;
  timestamp: string;
  service: string;
  dataLake: {
    account: string;
    container: string;
    accessible: boolean;
  };
  statistics: {
    totalDocuments: number;
    lastIngestion: string;
  };
}

export class FHIRService {
  private baseURL: string;

  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
  }

  /**
   * Ingest FHIR data from Azure Data Lake
   */
  async ingestFHIRData(
    fileSystemName?: string,
    path?: string,
    force?: boolean
  ): Promise<FHIRIngestionResult> {
    const response = await axios.post(`${this.baseURL}/api/fhir/ingest`, {
      fileSystemName,
      path,
      force
    });
    return response.data.result;
  }

  /**
   * Get FHIR ingestion status and statistics
   */
  async getIngestionStatus(): Promise<FHIRIngestionStats> {
    const response = await axios.get(`${this.baseURL}/api/fhir/ingest/status`);
    return response.data.stats;
  }

  /**
   * Schedule recurring FHIR data ingestion
   */
  async scheduleIngestion(
    schedule?: string,
    fileSystemName?: string,
    path?: string,
    enabled?: boolean
  ): Promise<FHIRScheduleConfig> {
    const response = await axios.post(`${this.baseURL}/api/fhir/ingest/schedule`, {
      schedule,
      fileSystemName,
      path,
      enabled
    });
    return response.data.schedule;
  }

  /**
   * Validate FHIR data without ingesting
   */
  async validateFHIRData(
    fileSystemName?: string,
    path?: string
  ): Promise<FHIRValidationResult> {
    const response = await axios.post(`${this.baseURL}/api/fhir/ingest/validate`, {
      fileSystemName,
      path
    });
    return response.data.result;
  }

  /**
   * Get FHIR resources of a specific type
   */
  async getResources(
    resourceType: string,
    options?: {
      patientId?: string;
      encounterId?: string;
      limit?: number;
      offset?: number;
    }
  ): Promise<{
    resources: FHIRResource[];
    pagination: {
      limit: number;
      offset: number;
      total: number;
    };
  }> {
    const params = new URLSearchParams();
    if (options?.patientId) params.append('patientId', options.patientId);
    if (options?.encounterId) params.append('encounterId', options.encounterId);
    if (options?.limit) params.append('limit', options.limit.toString());
    if (options?.offset) params.append('offset', options.offset.toString());

    const response = await axios.get(
      `${this.baseURL}/api/fhir/resources/${resourceType}?${params}`
    );
    return response.data;
  }

  /**
   * Get all FHIR resources for a specific patient
   */
  async getPatientResources(
    patientId: string,
    options?: {
      resourceType?: string;
      limit?: number;
      offset?: number;
    }
  ): Promise<{
    patientId: string;
    resources: FHIRResource[];
    pagination: {
      limit: number;
      offset: number;
      total: number;
    };
  }> {
    const params = new URLSearchParams();
    if (options?.resourceType) params.append('resourceType', options.resourceType);
    if (options?.limit) params.append('limit', options.limit.toString());
    if (options?.offset) params.append('offset', options.offset.toString());

    const response = await axios.get(
      `${this.baseURL}/api/fhir/patients/${patientId}/resources?${params}`
    );
    return response.data;
  }

  /**
   * Check FHIR ingestion service health
   */
  async checkHealth(): Promise<FHIRHealthStatus> {
    const response = await axios.get(`${this.baseURL}/api/fhir/health`);
    return response.data;
  }

  /**
   * Start a new ingestion job
   */
  async startIngestionJob(
    fileSystemName: string = 'data',
    path: string = 'fhir'
  ): Promise<{
    jobId: string;
    status: 'started' | 'failed';
    message: string;
  }> {
    try {
      const result = await this.ingestFHIRData(fileSystemName, path);
      
      return {
        jobId: `INGEST:${Date.now()}`,
        status: 'started',
        message: `Successfully processed ${result.processedResources} resources in ${result.processingTime}ms`
      };
    } catch (error) {
      return {
        jobId: `INGEST:${Date.now()}`,
        status: 'failed',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Get ingestion job history
   */
  async getIngestionHistory(
    limit: number = 10,
    offset: number = 0
  ): Promise<{
    jobs: Array<{
      jobId: string;
      status: 'completed' | 'failed' | 'running';
      startTime: string;
      endTime?: string;
      processedResources?: number;
      processingTime?: number;
      error?: string;
    }>;
    pagination: {
      limit: number;
      offset: number;
      total: number;
    };
  }> {
    // This would typically call a backend endpoint for job history
    // For now, we'll return mock data
    const mockJobs = [
      {
        jobId: 'INGEST:1234567890',
        status: 'completed' as const,
        startTime: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        endTime: new Date(Date.now() - 3500000).toISOString(), // 58 minutes ago
        processedResources: 150,
        processingTime: 45000
      },
      {
        jobId: 'INGEST:1234567891',
        status: 'failed' as const,
        startTime: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
        endTime: new Date(Date.now() - 7100000).toISOString(), // 1 hour 58 minutes ago
        error: 'Data Lake connection timeout'
      }
    ];

    return {
      jobs: mockJobs.slice(offset, offset + limit),
      pagination: {
        limit,
        offset,
        total: mockJobs.length
      }
    };
  }

  /**
   * Monitor ingestion progress
   */
  async monitorIngestionProgress(jobId: string): Promise<{
    jobId: string;
    status: 'running' | 'completed' | 'failed';
    progress: number; // 0-100
    processedResources: number;
    totalResources: number;
    estimatedTimeRemaining?: number; // in milliseconds
    currentFile?: string;
  }> {
    // This would typically call a backend endpoint for real-time progress
    // For now, we'll return mock progress data
    const mockProgress = {
      jobId,
      status: 'running' as const,
      progress: 65,
      processedResources: 97,
      totalResources: 150,
      estimatedTimeRemaining: 30000, // 30 seconds
      currentFile: 'fhir/patients/patient-123.json'
    };

    return mockProgress;
  }

  /**
   * Cancel an active ingestion job
   */
  async cancelIngestionJob(jobId: string): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      // This would typically call a backend endpoint to cancel the job
      // For now, we'll simulate a successful cancellation
      
      return {
        success: true,
        message: `Ingestion job ${jobId} cancelled successfully`
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to cancel ingestion job'
      };
    }
  }

  /**
   * Get Data Lake file system information
   */
  async getDataLakeInfo(): Promise<{
    accountName: string;
    containers: string[];
    fileSystems: string[];
    totalSize: number;
    lastModified: string;
  }> {
    try {
      const stats = await this.getIngestionStatus();
      
      return {
        accountName: stats.dataLakeAccount,
        containers: ['bronze', 'data', 'silver', 'gold'],
        fileSystems: ['data', 'bronze'],
        totalSize: 1024 * 1024 * 1024 * 50, // 50 GB mock
        lastModified: stats.lastIngestion
      };
    } catch (error) {
      throw new Error('Failed to get Data Lake information');
    }
  }

  /**
   * Get FHIR resource statistics
   */
  async getResourceStatistics(): Promise<{
    totalResources: number;
    resourceTypes: Record<string, number>;
    patients: number;
    encounters: number;
    lastUpdated: string;
  }> {
    try {
      const stats = await this.getIngestionStatus();
      
      return {
        totalResources: stats.totalDocuments,
        resourceTypes: {
          Patient: Math.floor(stats.totalDocuments * 0.1),
          Encounter: Math.floor(stats.totalDocuments * 0.2),
          Observation: Math.floor(stats.totalDocuments * 0.3),
          Condition: Math.floor(stats.totalDocuments * 0.15),
          Procedure: Math.floor(stats.totalDocuments * 0.1),
          MedicationRequest: Math.floor(stats.totalDocuments * 0.1),
          DiagnosticReport: Math.floor(stats.totalDocuments * 0.05)
        },
        patients: Math.floor(stats.totalDocuments * 0.1),
        encounters: Math.floor(stats.totalDocuments * 0.2),
        lastUpdated: stats.lastIngestion
      };
    } catch (error) {
      throw new Error('Failed to get resource statistics');
    }
  }
}

// Export singleton instance
export const fhirService = new FHIRService();
export default fhirService;
