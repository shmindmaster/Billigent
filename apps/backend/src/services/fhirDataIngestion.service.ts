import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';
import { DataLakeServiceClient, FileSystemClient } from '@azure/storage-file-datalake';
import { DefaultAzureCredential } from '@azure/identity';
import { azureOpenAIService } from './azureOpenAI.service';
import { azureSearchService } from './azureSearch.service';

export interface FHIRResource {
  resourceType: string;
  id: string;
  meta?: {
    versionId?: string;
    lastUpdated?: string;
    profile?: string[];
  };
  [key: string]: any;
}

export interface FHIRBundle {
  resourceType: 'Bundle';
  type: 'transaction' | 'batch' | 'searchset' | 'collection' | 'history' | 'document' | 'message';
  total?: number;
  entry: FHIRBundleEntry[];
}

export interface FHIRBundleEntry {
  fullUrl?: string;
  resource: FHIRResource;
  request?: {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    url: string;
  };
  response?: {
    status: string;
    location?: string;
    etag?: string;
    lastModified?: string;
  };
}

export interface ClinicalDocument {
  id: string;
  resourceType: string;
  patientId: string;
  encounterId?: string;
  content: string;
  timestamp: string;
  source: string;
  metadata: {
    documentType: string;
    specialty?: string;
    provider?: string;
    location?: string;
    [key: string]: any;
  };
}

export interface FHIRIngestionResult {
  processedResources: number;
  clinicalDocuments: ClinicalDocument[];
  evidenceBundles: number;
  errors: string[];
  processingTime: number;
  metadata: {
    dataLakeAccount: string;
    container: string;
    timestamp: string;
  };
}

export class FHIRDataIngestionService {
  private dataLakeServiceClient: DataLakeServiceClient;
  private blobServiceClient: BlobServiceClient;
  private accountName: string;
  private containerName: string;

  constructor() {
    this.accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME || 'billigentdevdlseus2';
    const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;
    const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
    this.containerName = process.env.AZURE_STORAGE_CONTAINER_NAME || 'data';

    if (connectionString) {
      this.dataLakeServiceClient = new DataLakeServiceClient(connectionString);
      this.blobServiceClient = new BlobServiceClient(connectionString);
    } else if (accountKey) {
      const url = `https://${this.accountName}.blob.core.windows.net`;
      this.dataLakeServiceClient = new DataLakeServiceClient(
        `https://${this.accountName}.dfs.core.windows.net`,
        new DefaultAzureCredential()
      );
      this.blobServiceClient = new BlobServiceClient(
        url,
        new DefaultAzureCredential()
      );
    } else {
      // Use Managed Identity
      this.dataLakeServiceClient = new DataLakeServiceClient(
        `https://${this.accountName}.dfs.core.windows.net`,
        new DefaultAzureCredential()
      );
      this.blobServiceClient = new BlobServiceClient(
        `https://${this.accountName}.blob.core.windows.net`,
        new DefaultAzureCredential()
      );
    }
  }

  /**
   * Ingest FHIR data from Azure Data Lake
   */
  async ingestFHIRData(
    fileSystemName: string = 'data',
    path: string = 'fhir'
  ): Promise<FHIRIngestionResult> {
    const startTime = Date.now();
    const result: FHIRIngestionResult = {
      processedResources: 0,
      clinicalDocuments: [],
      evidenceBundles: 0,
      errors: [],
      processingTime: 0,
      metadata: {
        dataLakeAccount: this.accountName,
        container: fileSystemName,
        timestamp: new Date().toISOString()
      }
    };

    try {
      // Get file system client
      const fileSystemClient = this.dataLakeServiceClient.getFileSystemClient(fileSystemName);
      
      // List files in the FHIR path
      const files = await this.listFHIRFiles(fileSystemClient, path);
      
      for (const file of files) {
        try {
          // Process each FHIR file
          const fileContent = await this.readFHIRFile(fileSystemClient, file);
          const fhirData = this.parseFHIRContent(fileContent);
          
          if (fhirData) {
            const documents = await this.extractClinicalDocuments(fhirData);
            result.clinicalDocuments.push(...documents);
            result.processedResources += fhirData.entry?.length || 1;
          }
        } catch (error) {
          const errorMessage = `Error processing file ${file}: ${error instanceof Error ? error.message : 'Unknown error'}`;
          result.errors.push(errorMessage);
          console.error(errorMessage);
        }
      }

      // Generate embeddings and index documents
      if (result.clinicalDocuments.length > 0) {
        await this.processClinicalDocuments(result.clinicalDocuments);
        result.evidenceBundles = result.clinicalDocuments.length;
      }

      result.processingTime = Date.now() - startTime;
      return result;

    } catch (error) {
      const errorMessage = `FHIR ingestion failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
      result.errors.push(errorMessage);
      console.error(errorMessage);
      result.processingTime = Date.now() - startTime;
      return result;
    }
  }

  /**
   * List FHIR files in the specified path
   */
  private async listFHIRFiles(
    fileSystemClient: FileSystemClient,
    path: string
  ): Promise<string[]> {
    const files: string[] = [];
    
    try {
      const paths = fileSystemClient.listPaths({ path });
      
      for await (const pathItem of paths) {
        if (pathItem.isFile && pathItem.name) {
          // Filter for FHIR-related files
          if (this.isFHIRFile(pathItem.name)) {
            files.push(pathItem.name);
          }
        }
      }
    } catch (error) {
      console.warn('Could not list Data Lake paths, falling back to blob storage');
      // Fallback to blob storage
      const containerClient = this.blobServiceClient.getContainerClient(this.containerName);
      const blobs = containerClient.listBlobsFlat({ prefix: path });
      
      for await (const blob of blobs) {
        if (this.isFHIRFile(blob.name)) {
          files.push(blob.name);
        }
      }
    }

    return files;
  }

  /**
   * Check if a file is a FHIR-related file
   */
  private isFHIRFile(fileName: string): boolean {
    const fhirExtensions = ['.json', '.ndjson', '.xml'];
    const fhirPatterns = ['fhir', 'patient', 'encounter', 'observation', 'condition', 'procedure'];
    
    const lowerFileName = fileName.toLowerCase();
    
    // Check file extension
    const hasFHIRExtension = fhirExtensions.some(ext => lowerFileName.endsWith(ext));
    
    // Check file name patterns
    const hasFHIRPattern = fhirPatterns.some(pattern => lowerFileName.includes(pattern));
    
    return hasFHIRExtension && hasFHIRPattern;
  }

  /**
   * Read FHIR file content
   */
  private async readFHIRFile(
    fileSystemClient: FileSystemClient,
    filePath: string
  ): Promise<string> {
    try {
      const fileClient = fileSystemClient.getFileClient(filePath);
      const downloadResponse = await fileClient.read();
      
      if (downloadResponse.readableStreamBody) {
        const chunks: Uint8Array[] = [];
        for await (const chunk of downloadResponse.readableStreamBody) {
          chunks.push(chunk);
        }
        
        const content = Buffer.concat(chunks).toString('utf-8');
        return content;
      }
      
      throw new Error('No readable stream body');
    } catch (error) {
      console.warn(`Could not read from Data Lake, falling back to blob storage: ${error}`);
      
      // Fallback to blob storage
      const containerClient = this.blobServiceClient.getContainerClient(this.containerName);
      const blobClient = containerClient.getBlobClient(filePath);
      const downloadResponse = await blobClient.download();
      
      if (downloadResponse.readableStreamBody) {
        const chunks: Uint8Array[] = [];
        for await (const chunk of downloadResponse.readableStreamBody) {
          chunks.push(chunk);
        }
        
        const content = Buffer.concat(chunks).toString('utf-8');
        return content;
      }
      
      throw new Error('No readable stream body from blob storage');
    }
  }

  /**
   * Parse FHIR content
   */
  private parseFHIRContent(content: string): FHIRBundle | FHIRResource | null {
    try {
      // Try to parse as JSON
      const parsed = JSON.parse(content);
      
      if (parsed.resourceType === 'Bundle') {
        return parsed as FHIRBundle;
      } else if (parsed.resourceType) {
        // Single resource
        return parsed as FHIRResource;
      }
      
      return null;
    } catch (error) {
      // Try to parse as NDJSON (newline-delimited JSON)
      try {
        const lines = content.trim().split('\n');
        const resources: FHIRResource[] = [];
        
        for (const line of lines) {
          if (line.trim()) {
            const resource = JSON.parse(line);
            if (resource.resourceType) {
              resources.push(resource);
            }
          }
        }
        
        if (resources.length === 1) {
          return resources[0];
        } else if (resources.length > 1) {
          return {
            resourceType: 'Bundle',
            type: 'collection',
            entry: resources.map(resource => ({ resource }))
          } as FHIRBundle;
        }
        
        return null;
      } catch (ndjsonError) {
        console.error('Failed to parse FHIR content:', error);
        return null;
      }
    }
  }

  /**
   * Extract clinical documents from FHIR data
   */
  private async extractClinicalDocuments(
    fhirData: FHIRBundle | FHIRResource
  ): Promise<ClinicalDocument[]> {
    const documents: ClinicalDocument[] = [];
    
    if (fhirData.resourceType === 'Bundle') {
      const bundle = fhirData as FHIRBundle;
      
      for (const entry of bundle.entry || []) {
        const resource = entry.resource;
        if (resource && this.isClinicalResource(resource)) {
          const document = await this.convertToClinicalDocument(resource);
          if (document) {
            documents.push(document);
          }
        }
      }
    } else if (this.isClinicalResource(fhirData)) {
      const document = await this.convertToClinicalDocument(fhirData);
      if (document) {
        documents.push(document);
      }
    }
    
    return documents;
  }

  /**
   * Check if a FHIR resource is clinical in nature
   */
  private isClinicalResource(resource: FHIRResource): boolean {
    const clinicalResourceTypes = [
      'Patient', 'Encounter', 'Observation', 'Condition', 'Procedure',
      'MedicationRequest', 'MedicationAdministration', 'DiagnosticReport',
      'ImagingStudy', 'DocumentReference', 'Composition'
    ];
    
    return clinicalResourceTypes.includes(resource.resourceType);
  }

  /**
   * Convert FHIR resource to clinical document
   */
  private async convertToClinicalDocument(
    resource: FHIRResource
  ): Promise<ClinicalDocument | null> {
    try {
      let content = '';
      let documentType = resource.resourceType;
      let patientId = '';
      let encounterId = '';
      let timestamp = new Date().toISOString();
      
      // Extract patient ID
      if (resource.resourceType === 'Patient') {
        patientId = resource.id;
      } else if (resource.subject?.reference) {
        patientId = resource.subject.reference.replace('Patient/', '');
      }
      
      // Extract encounter ID
      if (resource.context?.reference) {
        encounterId = resource.context.reference.replace('Encounter/', '');
      } else if (resource.encounter?.reference) {
        encounterId = resource.encounter.reference.replace('Encounter/', '');
      }
      
      // Extract timestamp
      if (resource.effectiveDateTime) {
        timestamp = resource.effectiveDateTime;
      } else if (resource.issued) {
        timestamp = resource.issued;
      } else if (resource.meta?.lastUpdated) {
        timestamp = resource.meta.lastUpdated;
      }
      
      // Generate content based on resource type
      content = this.generateResourceContent(resource);
      
      if (!content || !patientId) {
        return null;
      }
      
      // Generate embeddings for search
      let vector: number[] = [];
      try {
        vector = await azureOpenAIService.generateEmbeddings(content);
      } catch (error) {
        console.warn('Failed to generate embeddings:', error);
      }
      
      return {
        id: `${resource.resourceType}/${resource.id}`,
        resourceType: resource.resourceType,
        patientId,
        encounterId,
        content,
        timestamp,
        source: 'fhir-ingestion',
        metadata: {
          documentType: documentType,
          specialty: this.extractSpecialty(resource),
          provider: this.extractProvider(resource),
          location: this.extractLocation(resource),
          vector: vector.length > 0 ? vector : undefined
        }
      };
    } catch (error) {
      console.error('Error converting FHIR resource to clinical document:', error);
      return null;
    }
  }

  /**
   * Generate human-readable content from FHIR resource
   */
  private generateResourceContent(resource: FHIRResource): string {
    switch (resource.resourceType) {
      case 'Patient':
        return this.generatePatientContent(resource);
      case 'Encounter':
        return this.generateEncounterContent(resource);
      case 'Observation':
        return this.generateObservationContent(resource);
      case 'Condition':
        return this.generateConditionContent(resource);
      case 'Procedure':
        return this.generateProcedureContent(resource);
      case 'MedicationRequest':
        return this.generateMedicationRequestContent(resource);
      case 'DiagnosticReport':
        return this.generateDiagnosticReportContent(resource);
      default:
        return JSON.stringify(resource, null, 2);
    }
  }

  /**
   * Generate patient content
   */
  private generatePatientContent(patient: any): string {
    const name = patient.name?.[0];
    const birthDate = patient.birthDate;
    const gender = patient.gender;
    
    return `Patient: ${name?.given?.join(' ') || ''} ${name?.family || ''}
Birth Date: ${birthDate || 'Unknown'}
Gender: ${gender || 'Unknown'}
ID: ${patient.id}`;
  }

  /**
   * Generate encounter content
   */
  private generateEncounterContent(encounter: any): string {
    const status = encounter.status;
    const classCode = encounter.class?.code;
    const period = encounter.period;
    
    return `Encounter: ${encounter.id}
Status: ${status || 'Unknown'}
Class: ${classCode || 'Unknown'}
Period: ${period?.start || 'Unknown'} to ${period?.end || 'Ongoing'}`;
  }

  /**
   * Generate observation content
   */
  private generateObservationContent(observation: any): string {
    const code = observation.code?.text || observation.code?.coding?.[0]?.display;
    const value = observation.valueQuantity?.value || observation.valueString || observation.valueCodeableConcept?.text;
    const unit = observation.valueQuantity?.unit;
    
    return `Observation: ${code || 'Unknown'}
Value: ${value || 'Unknown'} ${unit || ''}
Status: ${observation.status || 'Unknown'}`;
  }

  /**
   * Generate condition content
   */
  private generateConditionContent(condition: any): string {
    const code = condition.code?.text || condition.code?.coding?.[0]?.display;
    const severity = condition.severity?.text || condition.severity?.coding?.[0]?.display;
    
    return `Condition: ${code || 'Unknown'}
Severity: ${severity || 'Unknown'}
Status: ${condition.clinicalStatus?.coding?.[0]?.code || 'Unknown'}`;
  }

  /**
   * Generate procedure content
   */
  private generateProcedureContent(procedure: any): string {
    const code = procedure.code?.text || procedure.code?.coding?.[0]?.display;
    const status = procedure.status;
    
    return `Procedure: ${code || 'Unknown'}
Status: ${status || 'Unknown'}
Performed: ${procedure.performedDateTime || procedure.performedPeriod?.start || 'Unknown'}`;
  }

  /**
   * Generate medication request content
   */
  private generateMedicationRequestContent(medication: any): string {
    const medicationCode = medication.medicationCodeableConcept?.text || medication.medicationCodeableConcept?.coding?.[0]?.display;
    const status = medication.status;
    const intent = medication.intent;
    
    return `Medication Request: ${medicationCode || 'Unknown'}
Status: ${status || 'Unknown'}
Intent: ${intent || 'Unknown'}`;
  }

  /**
   * Generate diagnostic report content
   */
  private generateDiagnosticReportContent(report: any): string {
    const code = report.code?.text || report.code?.coding?.[0]?.display;
    const status = report.status;
    const issued = report.issued;
    
    return `Diagnostic Report: ${code || 'Unknown'}
Status: ${status || 'Unknown'}
Issued: ${issued || 'Unknown'}`;
  }

  /**
   * Extract specialty from resource
   */
  private extractSpecialty(resource: FHIRResource): string | undefined {
    if (resource.resourceType === 'Encounter') {
      return resource.serviceType?.coding?.[0]?.display;
    }
    return undefined;
  }

  /**
   * Extract provider from resource
   */
  private extractProvider(resource: FHIRResource): string | undefined {
    if (resource.resourceType === 'Encounter') {
      return resource.participant?.[0]?.individual?.reference;
    }
    return undefined;
  }

  /**
   * Extract location from resource
   */
  private extractLocation(resource: FHIRResource): string | undefined {
    if (resource.resourceType === 'Encounter') {
      return resource.location?.[0]?.location?.reference;
    }
    return undefined;
  }

  /**
   * Process clinical documents for search indexing
   */
  private async processClinicalDocuments(documents: ClinicalDocument[]): Promise<void> {
    for (const document of documents) {
      try {
        // Index in Azure Search
        await azureSearchService.indexDocument({
          id: document.id,
          content: document.content,
          metadata: {
            source: document.source,
            type: document.resourceType.toLowerCase(),
            encounterId: document.encounterId,
            patientId: document.patientId,
            timestamp: document.timestamp,
            documentType: document.metadata.documentType,
            specialty: document.metadata.specialty,
            provider: document.metadata.provider,
            location: document.metadata.location
          },
          vector: document.metadata.vector
        });
      } catch (error) {
        console.error(`Failed to index document ${document.id}:`, error);
      }
    }
  }

  /**
   * Get ingestion statistics
   */
  async getIngestionStats(): Promise<{
    totalDocuments: number;
    lastIngestion: string;
    dataLakeAccount: string;
    container: string;
  }> {
    try {
      const containerClient = this.blobServiceClient.getContainerClient(this.containerName);
      const blobs = containerClient.listBlobsFlat();
      
      let totalDocuments = 0;
      let lastIngestion = '';
      
      for await (const blob of blobs) {
        if (this.isFHIRFile(blob.name)) {
          totalDocuments++;
          if (blob.properties?.lastModified) {
            const lastModified = blob.properties.lastModified.toISOString();
            if (!lastIngestion || lastModified > lastIngestion) {
              lastIngestion = lastModified;
            }
          }
        }
      }
      
      return {
        totalDocuments,
        lastIngestion,
        dataLakeAccount: this.accountName,
        container: this.containerName
      };
    } catch (error) {
      console.error('Failed to get ingestion stats:', error);
      return {
        totalDocuments: 0,
        lastIngestion: '',
        dataLakeAccount: this.accountName,
        container: this.containerName
      };
    }
  }
}

// Export singleton instance
export const fhirDataIngestionService = new FHIRDataIngestionService();
export default fhirDataIngestionService;
