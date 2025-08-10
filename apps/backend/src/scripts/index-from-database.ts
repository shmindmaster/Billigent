#!/usr/bin/env node

/**
 * Index Database Data to Azure AI Search
 * 
 * This script reads data from the database (instead of Data Lake),
 * uses existing embeddings, and indexes everything into Azure AI Search for RAG functionality.
 */

import dotenv from 'dotenv';
dotenv.config();

import { AzureKeyCredential, SearchClient, SearchField, SearchFieldDataType, SearchIndexClient } from '@azure/search-documents';
import { PrismaClient } from '@billigent/database';

interface SearchDocument {
  id: string;
  resourceType: string;
  patientId?: string;
  content: string;
  clinicalNotes?: string;
  diagnosis?: string[];
  encounterDate?: Date;
}

class DatabaseIndexer {
  private searchIndexClient: SearchIndexClient;
  private searchClient: SearchClient<SearchDocument>;
  private prisma: PrismaClient;

  constructor() {
    const credential = new AzureKeyCredential(process.env.AZURE_SEARCH_API_KEY!);
    
    this.prisma = new PrismaClient();

    this.searchIndexClient = new SearchIndexClient(
      process.env.AZURE_SEARCH_ENDPOINT!,
      credential
    );

    this.searchClient = new SearchClient(
      process.env.AZURE_SEARCH_ENDPOINT!,
      'billigent-fhir-index',
      credential
    );
  }

  async createSearchIndex(): Promise<void> {
    console.log('🔍 Creating Azure AI Search index...');

    const indexDefinition = {
      name: 'billigent-fhir-index',
      fields: [
        { name: 'id', type: 'Edm.String' as SearchFieldDataType, key: true, searchable: false },
        { name: 'resourceType', type: 'Edm.String' as SearchFieldDataType, filterable: true, facetable: true },
        { name: 'patientId', type: 'Edm.String' as SearchFieldDataType, filterable: true },
        { name: 'content', type: 'Edm.String' as SearchFieldDataType, searchable: true, analyzer: 'en.microsoft' },
        { name: 'clinicalNotes', type: 'Edm.String' as SearchFieldDataType, searchable: true },
        { name: 'diagnosis', type: 'Collection(Edm.String)' as SearchFieldDataType, searchable: true, filterable: true },
        { name: 'encounterDate', type: 'Edm.DateTimeOffset' as SearchFieldDataType, filterable: true, sortable: true }
      ] as SearchField[]
    };

    try {
      // Check if index exists
      try {
        await this.searchIndexClient.getIndex('billigent-fhir-index');
        console.log('  ✅ Index already exists');
      } catch (error) {
        // Index doesn't exist, create it
        await this.searchIndexClient.createIndex(indexDefinition);
        console.log('  ✅ Index created successfully');
      }
    } catch (error) {
      console.error('❌ Error creating index:', error);
      throw error;
    }
  }

  private bufferToFloat32Array(buf: Buffer): number[] {
    const f32 = new Float32Array(buf.buffer, buf.byteOffset, buf.byteLength / 4);
    return Array.from(f32);
  }

  async indexDatabaseData(): Promise<void> {
    console.log('🔍 Starting database data indexing...');
    
    // Get CDI evidence records with embeddings
    const records = await this.prisma.preBillAnalysis.findMany({
      where: { 
        embedding: { not: null },
        description: { not: "" }
      },
      select: {
        evidenceId: true,
        description: true,
        embedding: true
      }
    });

    console.log(`📄 Found ${records.length} records with embeddings`);
    
    const documents: SearchDocument[] = [];
    
    for (const record of records) {
      try {
        const searchDoc: SearchDocument = {
          id: `evidence-${record.evidenceId}`,
          resourceType: 'CDI_Evidence',
          content: record.description || '',
          clinicalNotes: record.description || '',
          encounterDate: new Date()
        };
        
        documents.push(searchDoc);
        
        // Batch index every 100 documents
        if (documents.length === 100) {
          await this.indexBatch(documents);
          console.log(`    ✅ Indexed ${documents.length} documents`);
          documents.length = 0; // Clear array
        }
      } catch (error) {
        console.warn(`    ⚠️  Skipping record ${record.evidenceId}: ${error}`);
      }
    }
    
    // Index remaining documents
    if (documents.length > 0) {
      await this.indexBatch(documents);
      console.log(`    ✅ Indexed final ${documents.length} documents`);
    }
    
    console.log(`🎉 Indexing complete! Total documents indexed: ${records.length}`);
  }

  private async indexBatch(documents: SearchDocument[]): Promise<void> {
    try {
      await this.searchClient.uploadDocuments(documents);
    } catch (error) {
      console.error('❌ Error indexing batch:', error);
      throw error;
    }
  }

  async run(): Promise<void> {
    try {
      await this.createSearchIndex();
      await this.indexDatabaseData();
    } catch (error) {
      console.error('❌ Indexing failed:', error);
      process.exit(1);
    } finally {
      await this.prisma.$disconnect();
    }
  }
}

// Run if called directly
if (require.main === module) {
  const indexer = new DatabaseIndexer();
  indexer.run().catch(console.error);
}

export { DatabaseIndexer };


