#!/usr/bin/env node

/**
 * Index FHIR Data to Azure AI Search
 * 
 * This script reads FHIR data from Azure Data Lake, generates embeddings,
 * and indexes everything into Azure AI Search for RAG functionality.
 */

import dotenv from 'dotenv';
dotenv.config();

import { DefaultAzureCredential } from '@azure/identity';
import { SearchClient, SearchIndexClient } from '@azure/search-documents';
import { DataLakeServiceClient } from '@azure/storage-file-datalake';
import OpenAI from 'openai';

interface FHIRResource {
  id: string;
  resourceType: string;
  [key: string]: any;
}

interface SearchDocument {
  id: string;
  resourceType: string;
  patientId?: string;
  content: string;
  contentVector: number[];
  clinicalNotes?: string;
  diagnosis?: string[];
  encounterDate?: Date;
}

class FHIRIndexer {
  private dataLakeClient: DataLakeServiceClient;
  private searchIndexClient: SearchIndexClient;
  private searchClient: SearchClient<SearchDocument>;
  private openaiClient: OpenAI;

  constructor() {
    const credential = new DefaultAzureCredential();
    
    this.dataLakeClient = new DataLakeServiceClient(
      `https://billigentdevdlseus2.dfs.core.windows.net`,
      credential
    );

    this.searchIndexClient = new SearchIndexClient(
      process.env.AZURE_SEARCH_ENDPOINT!,
      credential
    );

    this.searchClient = new SearchClient(
      process.env.AZURE_SEARCH_ENDPOINT!,
      'billigent-fhir-index',
      credential
    );

    this.openaiClient = new OpenAI({
      apiKey: process.env.AZURE_OPENAI_API_KEY,
      baseURL: `https://billigent-dev-openai-eus2.openai.azure.com/openai/deployments/text-embedding-ada-002`,
      defaultQuery: { 'api-version': '2024-06-01' }
    });
  }

  async indexFHIRData(): Promise<void> {
    console.log('🔍 Starting FHIR data indexing...');
    
    const fileSystemClient = this.dataLakeClient.getFileSystemClient('bronze');
    const directoryClient = fileSystemClient.getDirectoryClient('synthea');

    // Process each FHIR resource type
    const resourceTypes = [
      'Patient', 'Encounter', 'Condition', 'Observation', 
      'Procedure', 'Medication', 'DiagnosticReport', 'Immunization'
    ];

    let totalIndexed = 0;

    for (const resourceType of resourceTypes) {
      console.log(`📋 Processing ${resourceType} resources...`);
      
      const fileName = `${resourceType}.ndjson`;
      const fileClient = directoryClient.getFileClient(fileName);
      
      try {
        // Download NDJSON file
        const downloadResponse = await fileClient.read();
        const content = await this.streamToString(downloadResponse.readableStreamBody!);
        
        // Parse NDJSON and create search documents
        const documents: SearchDocument[] = [];
        const lines = content.split('\n').filter(line => line.trim());
        
        console.log(`  📄 Found ${lines.length} ${resourceType} records`);
        
        for (let i = 0; i < lines.length; i++) {
          try {
            const resource: FHIRResource = JSON.parse(lines[i]);
            const searchDoc = await this.createSearchDocument(resource);
            documents.push(searchDoc);
            
            // Batch index every 100 documents
            if (documents.length === 100 || i === lines.length - 1) {
              await this.indexBatch(documents);
              totalIndexed += documents.length;
              console.log(`    ✅ Indexed ${totalIndexed} total documents`);
              documents.length = 0; // Clear array
            }
          } catch (error) {
            console.warn(`    ⚠️  Skipping malformed record in ${resourceType}: ${error}`);
          }
        }
        
      } catch (error) {
        console.error(`❌ Error processing ${resourceType}: ${error}`);
      }
    }

    console.log(`🎉 Indexing complete! Total documents indexed: ${totalIndexed}`);
  }

  private async createSearchDocument(resource: FHIRResource): Promise<SearchDocument> {
    // Extract meaningful text content for embedding
    const textContent = this.extractTextContent(resource);
    
    // Generate embedding vector
    const embedding = await this.generateEmbedding(textContent);
    
    // Create search document
    const document: SearchDocument = {
      id: `${resource.resourceType}_${resource.id}`,
      resourceType: resource.resourceType,
      content: textContent,
      contentVector: embedding,
      patientId: this.extractPatientId(resource),
      clinicalNotes: this.extractClinicalNotes(resource),
      diagnosis: this.extractDiagnosis(resource),
      encounterDate: this.extractEncounterDate(resource)
    };

    return document;
  }

  private extractTextContent(resource: FHIRResource): string {
    const textParts: string[] = [];
    
    // Add resource type
    textParts.push(`Resource: ${resource.resourceType}`);
    
    // Extract content based on resource type
    switch (resource.resourceType) {
      case 'Patient':
        if (resource.name?.[0]) {
          textParts.push(`Patient: ${resource.name[0].given?.join(' ')} ${resource.name[0].family}`);
        }
        if (resource.gender) textParts.push(`Gender: ${resource.gender}`);
        if (resource.birthDate) textParts.push(`Birth Date: ${resource.birthDate}`);
        break;
        
      case 'Condition':
        if (resource.code?.text) textParts.push(`Condition: ${resource.code.text}`);
        if (resource.code?.coding?.[0]?.display) textParts.push(`Diagnosis: ${resource.code.coding[0].display}`);
        if (resource.clinicalStatus?.text) textParts.push(`Status: ${resource.clinicalStatus.text}`);
        break;
        
      case 'Observation':
        if (resource.code?.text) textParts.push(`Observation: ${resource.code.text}`);
        if (resource.valueQuantity?.value) {
          textParts.push(`Value: ${resource.valueQuantity.value} ${resource.valueQuantity.unit || ''}`);
        }
        if (resource.valueString) textParts.push(`Value: ${resource.valueString}`);
        break;
        
      case 'Procedure':
        if (resource.code?.text) textParts.push(`Procedure: ${resource.code.text}`);
        if (resource.performedDateTime) textParts.push(`Performed: ${resource.performedDateTime}`);
        break;
        
      case 'Encounter':
        if (resource.type?.[0]?.text) textParts.push(`Encounter: ${resource.type[0].text}`);
        if (resource.class?.display) textParts.push(`Class: ${resource.class.display}`);
        if (resource.period?.start) textParts.push(`Date: ${resource.period.start}`);
        break;
    }
    
    return textParts.join('. ');
  }

  private async generateEmbedding(text: string): Promise<number[]> {
    try {
      const response = await this.openaiClient.embeddings.create({
        model: 'text-embedding-ada-002',
        input: text.slice(0, 8000) // Limit text length
      });
      
      return response.data[0].embedding;
    } catch (error) {
      console.warn(`⚠️  Failed to generate embedding: ${error}`);
      // Return zero vector as fallback
      return new Array(1536).fill(0);
    }
  }

  private extractPatientId(resource: FHIRResource): string | undefined {
    if (resource.resourceType === 'Patient') return resource.id;
    if (resource.subject?.reference) {
      return resource.subject.reference.replace('Patient/', '');
    }
    if (resource.patient?.reference) {
      return resource.patient.reference.replace('Patient/', '');
    }
    return undefined;
  }

  private extractClinicalNotes(resource: FHIRResource): string | undefined {
    if (resource.note?.[0]?.text) return resource.note[0].text;
    if (resource.text?.div) return resource.text.div.replace(/<[^>]*>/g, ''); // Strip HTML
    return undefined;
  }

  private extractDiagnosis(resource: FHIRResource): string[] | undefined {
    const diagnoses: string[] = [];
    
    if (resource.resourceType === 'Condition' && resource.code?.coding) {
      resource.code.coding.forEach((coding: any) => {
        if (coding.display) diagnoses.push(coding.display);
      });
    }
    
    if (resource.diagnosis) {
      resource.diagnosis.forEach((diag: any) => {
        if (diag.condition?.display) diagnoses.push(diag.condition.display);
      });
    }
    
    return diagnoses.length > 0 ? diagnoses : undefined;
  }

  private extractEncounterDate(resource: FHIRResource): Date | undefined {
    if (resource.resourceType === 'Encounter' && resource.period?.start) {
      return new Date(resource.period.start);
    }
    if (resource.effectiveDateTime) {
      return new Date(resource.effectiveDateTime);
    }
    if (resource.performedDateTime) {
      return new Date(resource.performedDateTime);
    }
    return undefined;
  }

  private async indexBatch(documents: SearchDocument[]): Promise<void> {
    try {
      await this.searchClient.uploadDocuments(documents);
    } catch (error) {
      console.error(`❌ Error indexing batch: ${error}`);
      throw error;
    }
  }

  private async streamToString(readableStream: NodeJS.ReadableStream): Promise<string> {
    return new Promise((resolve, reject) => {
      const chunks: any[] = [];
      readableStream.on('data', (data) => {
        chunks.push(data instanceof Buffer ? data : Buffer.from(data));
      });
      readableStream.on('end', () => {
        resolve(Buffer.concat(chunks).toString('utf8'));
      });
      readableStream.on('error', reject);
    });
  }
}

// Execute if run directly
if (require.main === module) {
  const indexer = new FHIRIndexer();
  indexer.indexFHIRData().catch(console.error);
}

export { FHIRIndexer };

