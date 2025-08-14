// @ts-nocheck

/**
 * Billigent AI Search Index Population Script
 *
 * This script populates the Azure AI Search index with clinical knowledge
 * from the organized Data Lake for RAG (Retrieval-Augmented Generation).
 *
 * Data Sources:
 * - Silver Layer FHIR data (Conditions, Observations)
 * - Bronze Layer terminologies (ICD-10, HCPCS, MS-DRG)
 * - Gold Layer analytics patterns
 */

import {
  AzureKeyCredential,
  SearchClient,
  SearchFieldDataType,
  SearchIndex,
  SearchIndexClient,
} from "@azure/search-documents";
import {
  BlobServiceClient,
  StorageSharedKeyCredential,
} from "@azure/storage-blob";
import { config } from "dotenv";
import OpenAI from "openai";
import * as winston from "winston";

config();

// Configure logging
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "ai-search-population.log" }),
  ],
});

interface ClinicalDocument {
  id: string;
  content: string;
  title: string;
  category: string;
  subcategory?: string;
  metadata: {
    source: string;
    lastModified: string;
    contentType: string;
    patientId?: string;
    encounterId?: string;
    [key: string]: any;
  };
  contentVector?: number[];
}

class AISearchPopulator {
  private searchIndexClient: SearchIndexClient;
  private searchClient: SearchClient<ClinicalDocument>;
  private openaiClient: OpenAI;
  private blobServiceClient: BlobServiceClient;
  private indexName: string;

  constructor() {
    // Validate environment variables
    const requiredEnvVars = [
      "AZURE_SEARCH_ENDPOINT",
      "AZURE_SEARCH_API_KEY",
      "AZURE_OPENAI_ENDPOINT",
      "AZURE_OPENAI_API_KEY",
      "AZURE_STORAGE_ACCOUNT",
      "AZURE_STORAGE_KEY",
    ];

    for (const envVar of requiredEnvVars) {
      if (!process.env[envVar]) {
        throw new Error(`Missing required environment variable: ${envVar}`);
      }
    }

    this.indexName = process.env.RAG_INDEX_NAME || "clinical-docs-index";

    // Initialize Azure AI Search clients
    const searchCredential = new AzureKeyCredential(
      process.env.AZURE_SEARCH_API_KEY!
    );
    this.searchIndexClient = new SearchIndexClient(
      process.env.AZURE_SEARCH_ENDPOINT!,
      searchCredential
    );
    this.searchClient = new SearchClient<ClinicalDocument>(
      process.env.AZURE_SEARCH_ENDPOINT!,
      this.indexName,
      searchCredential
    );

    // Initialize OpenAI client for embeddings
    // Initialize OpenAI client
    this.openaiClient = new OpenAI({
      apiKey: process.env.AZURE_OPENAI_API_KEY!,
      baseURL: `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${
        process.env.AZURE_OPENAI_EMBEDDING_MODEL || "text-embedding-3-large"
      }`,
      defaultQuery: { "api-version": "2024-08-01-preview" },
    });

    // Initialize Azure Storage client
    const storageCredential = new StorageSharedKeyCredential(
      process.env.AZURE_STORAGE_ACCOUNT!,
      process.env.AZURE_STORAGE_KEY!
    );
    this.blobServiceClient = new BlobServiceClient(
      `https://${process.env.AZURE_STORAGE_ACCOUNT}.blob.core.windows.net`,
      storageCredential
    );
  }

  /**
   * Main execution method
   */
  async run(): Promise<void> {
    try {
      logger.info("Starting AI Search index population process");

      // Step 1: Create or update search index
      await this.createSearchIndex();

      // Step 2: Extract and process documents from Data Lake
      const documents = await this.extractDocumentsFromDataLake();
      logger.info(`Extracted ${documents.length} documents from Data Lake`);

      // Step 3: Generate embeddings for documents
      await this.generateEmbeddings(documents);

      // Step 4: Upload documents to search index
      await this.uploadToSearchIndex(documents);

      logger.info("AI Search index population completed successfully");
    } catch (error) {
      logger.error("Error during AI Search population:", error);
      throw error;
    }
  }

  /**
   * Create or update the Azure AI Search index with proper schema
   */
  private async createSearchIndex(): Promise<void> {
    logger.info("Creating/updating search index schema");

    const indexDefinition: SearchIndex = {
      name: this.indexName,
      fields: [
        {
          name: "id",
          type: "Edm.String" as SearchFieldDataType,
          key: true,
          searchable: false,
        },
        {
          name: "content",
          type: "Edm.String" as SearchFieldDataType,
          searchable: true,
          filterable: false,
        },
        {
          name: "title",
          type: "Edm.String" as SearchFieldDataType,
          searchable: true,
          filterable: true,
        },
        {
          name: "category",
          type: "Edm.String" as SearchFieldDataType,
          searchable: true,
          filterable: true,
          facetable: true,
        },
        {
          name: "subcategory",
          type: "Edm.String" as SearchFieldDataType,
          searchable: true,
          filterable: true,
          facetable: true,
        },
        {
          name: "source",
          type: "Edm.String" as SearchFieldDataType,
          filterable: true,
          facetable: true,
        },
        {
          name: "lastModified",
          type: "Edm.DateTimeOffset" as SearchFieldDataType,
          filterable: true,
          sortable: true,
        },
        {
          name: "contentType",
          type: "Edm.String" as SearchFieldDataType,
          filterable: true,
          facetable: true,
        },
        {
          name: "patientId",
          type: "Edm.String" as SearchFieldDataType,
          filterable: true,
        },
        {
          name: "encounterId",
          type: "Edm.String" as SearchFieldDataType,
          filterable: true,
        },
        {
          name: "contentVector",
          type: "Collection(Edm.Single)" as SearchFieldDataType,
          searchable: true,
          vectorSearchDimensions: 1536,
          vectorSearchProfileName: "my-vector-profile",
        },
      ],
    };

    try {
      await this.searchIndexClient.createOrUpdateIndex(indexDefinition);
      logger.info("Search index created/updated successfully");
    } catch (error) {
      logger.error("Error creating search index:", error);
      throw error;
    }
  }

  /**
   * Extract documents from various Data Lake sources
   */
  private async extractDocumentsFromDataLake(): Promise<ClinicalDocument[]> {
    const documents: ClinicalDocument[] = [];
    const containerClient = this.blobServiceClient.getContainerClient("data");

    // Extract FHIR documents from Silver layer
    await this.extractFHIRDocuments(containerClient, documents);

    // Extract terminology documents from Bronze layer
    await this.extractTerminologyDocuments(containerClient, documents);

    // Extract clinical guidelines from Gold layer
    await this.extractClinicalGuidelines(containerClient, documents);

    return documents;
  }

  /**
   * Extract FHIR resources from Silver layer
   */
  private async extractFHIRDocuments(
    containerClient: any,
    documents: ClinicalDocument[]
  ): Promise<void> {
    logger.info("Extracting FHIR documents from Silver layer");

    const prefixes = ["silver/fhir/Condition/", "silver/fhir/Observation/"];

    for (const prefix of prefixes) {
      const iter = containerClient.listBlobsFlat({ prefix });

      for await (const blob of iter) {
        if (blob.name.endsWith(".json")) {
          try {
            const blobClient = containerClient.getBlobClient(blob.name);
            const downloadResponse = await blobClient.download();
            const content = await this.streamToString(
              downloadResponse.readableStreamBody!
            );
            const fhirResource = JSON.parse(content);

            const document: ClinicalDocument = {
              id: `fhir-${blob.name.replace(/[^a-zA-Z0-9]/g, "-")}`,
              content: this.fhirToText(fhirResource),
              title: `${fhirResource.resourceType}: ${fhirResource.id}`,
              category: "clinical",
              subcategory: fhirResource.resourceType.toLowerCase(),
              metadata: {
                source: blob.name,
                lastModified:
                  blob.properties.lastModified?.toISOString() ||
                  new Date().toISOString(),
                contentType: "application/fhir+json",
                patientId: fhirResource.subject?.reference?.split("/")[1],
                encounterId: fhirResource.encounter?.reference?.split("/")[1],
              },
            };

            documents.push(document);
          } catch (error) {
            logger.warn(`Error processing FHIR document ${blob.name}:`, error);
          }
        }
      }
    }

    logger.info(`Extracted ${documents.length} FHIR documents`);
  }

  /**
   * Extract terminology documents from Bronze layer
   */
  private async extractTerminologyDocuments(
    containerClient: any,
    documents: ClinicalDocument[]
  ): Promise<void> {
    logger.info("Extracting terminology documents from Bronze layer");

    // Extract ICD-10 codes for clinical context
    const terminologyMappings = [
      {
        prefix: "bronze/terminologies/icd10/",
        category: "terminology",
        subcategory: "icd10",
      },
      {
        prefix: "bronze/terminologies/hcpcs/",
        category: "terminology",
        subcategory: "hcpcs",
      },
      {
        prefix: "bronze/terminologies/ms-drg/",
        category: "terminology",
        subcategory: "ms-drg",
      },
    ];

    for (const mapping of terminologyMappings) {
      const iter = containerClient.listBlobsFlat({ prefix: mapping.prefix });

      for await (const blob of iter) {
        if (
          blob.name.endsWith(".txt") ||
          blob.name.endsWith(".csv") ||
          blob.name.endsWith(".json")
        ) {
          try {
            const blobClient = containerClient.getBlobClient(blob.name);
            const downloadResponse = await blobClient.download();
            const content = await this.streamToString(
              downloadResponse.readableStreamBody!
            );

            // Process terminology content based on type
            const processedContent = await this.processTerminologyContent(
              content,
              mapping.subcategory
            );

            if (processedContent.length > 0) {
              const document: ClinicalDocument = {
                id: `term-${blob.name.replace(/[^a-zA-Z0-9]/g, "-")}`,
                content: processedContent,
                title: `${mapping.subcategory.toUpperCase()} Terminology`,
                category: mapping.category,
                subcategory: mapping.subcategory,
                metadata: {
                  source: blob.name,
                  lastModified:
                    blob.properties.lastModified?.toISOString() ||
                    new Date().toISOString(),
                  contentType: this.getContentType(blob.name),
                },
              };

              documents.push(document);
            }
          } catch (error) {
            logger.warn(
              `Error processing terminology document ${blob.name}:`,
              error
            );
          }
        }
      }
    }

    logger.info(`Added terminology documents, total now: ${documents.length}`);
  }

  /**
   * Extract clinical guidelines from Gold layer
   */
  private async extractClinicalGuidelines(
    containerClient: any,
    documents: ClinicalDocument[]
  ): Promise<void> {
    logger.info("Extracting clinical guidelines from Gold layer");

    const goldPrefixes = [
      "gold/analytics/",
      "gold/cdi-models/",
      "gold/denial-patterns/",
    ];

    for (const prefix of goldPrefixes) {
      const iter = containerClient.listBlobsFlat({ prefix });

      for await (const blob of iter) {
        if (blob.name.endsWith(".json") || blob.name.endsWith(".txt")) {
          try {
            const blobClient = containerClient.getBlobClient(blob.name);
            const downloadResponse = await blobClient.download();
            const content = await this.streamToString(
              downloadResponse.readableStreamBody!
            );

            const document: ClinicalDocument = {
              id: `gold-${blob.name.replace(/[^a-zA-Z0-9]/g, "-")}`,
              content: content,
              title: `Clinical Guideline: ${blob.name.split("/").pop()}`,
              category: "guideline",
              subcategory: prefix.split("/")[1],
              metadata: {
                source: blob.name,
                lastModified:
                  blob.properties.lastModified?.toISOString() ||
                  new Date().toISOString(),
                contentType: this.getContentType(blob.name),
              },
            };

            documents.push(document);
          } catch (error) {
            logger.warn(`Error processing gold document ${blob.name}:`, error);
          }
        }
      }
    }

    logger.info(`Added gold layer documents, total now: ${documents.length}`);
  }

  /**
   * Generate embeddings for all documents using Azure OpenAI
   */
  private async generateEmbeddings(
    documents: ClinicalDocument[]
  ): Promise<void> {
    logger.info(`Generating embeddings for ${documents.length} documents`);

    const batchSize = 10; // Process in smaller batches to avoid rate limits

    for (let i = 0; i < documents.length; i += batchSize) {
      const batch = documents.slice(i, i + batchSize);
      const promises = batch.map(async (doc) => {
        try {
          const embeddingResponse = await this.openaiClient.embeddings.create({
            model:
              process.env.AZURE_OPENAI_EMBED_MODEL || "text-embedding-3-small",
            input: doc.content,
          });

          doc.contentVector = embeddingResponse.data[0].embedding;
          logger.debug(`Generated embedding for document: ${doc.id}`);
        } catch (error) {
          logger.warn(
            `Failed to generate embedding for document ${doc.id}:`,
            error
          );
          // Continue without embedding for this document
        }
      });

      await Promise.all(promises);
      logger.info(
        `Processed embeddings for batch ${
          Math.floor(i / batchSize) + 1
        }/${Math.ceil(documents.length / batchSize)}`
      );

      // Rate limiting delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  /**
   * Upload processed documents to Azure AI Search index
   */
  private async uploadToSearchIndex(
    documents: ClinicalDocument[]
  ): Promise<void> {
    logger.info(`Uploading ${documents.length} documents to search index`);

    const batchSize = 100; // Azure Search batch limit

    for (let i = 0; i < documents.length; i += batchSize) {
      const batch = documents.slice(i, i + batchSize);

      try {
        const uploadResult = await this.searchClient.uploadDocuments(batch);
        logger.info(
          `Uploaded batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(
            documents.length / batchSize
          )}: ${uploadResult.results.length} documents`
        );
      } catch (error) {
        logger.error(`Error uploading batch starting at index ${i}:`, error);
        // Continue with next batch
      }
    }

    logger.info("Document upload to search index completed");
  }

  // Helper methods

  private async streamToString(
    readableStream: NodeJS.ReadableStream
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      readableStream.on("data", (data) => {
        chunks.push(data instanceof Buffer ? data : Buffer.from(data));
      });
      readableStream.on("end", () => {
        resolve(Buffer.concat(chunks).toString());
      });
      readableStream.on("error", reject);
    });
  }

  private fhirToText(fhirResource: any): string {
    // Convert FHIR resource to searchable text
    const parts: string[] = [];

    parts.push(`Resource Type: ${fhirResource.resourceType}`);

    if (fhirResource.code?.coding) {
      const codings = fhirResource.code.coding
        .map((c: any) => `${c.code}: ${c.display || c.code}`)
        .join(", ");
      parts.push(`Codes: ${codings}`);
    }

    if (fhirResource.text?.div) {
      // Extract text from HTML
      const textContent = fhirResource.text.div
        .replace(/<[^>]*>/g, " ")
        .replace(/\s+/g, " ")
        .trim();
      parts.push(`Description: ${textContent}`);
    }

    if (fhirResource.category) {
      parts.push(`Category: ${JSON.stringify(fhirResource.category)}`);
    }

    if (fhirResource.status) {
      parts.push(`Status: ${fhirResource.status}`);
    }

    return parts.join("\n");
  }

  private async processTerminologyContent(
    content: string,
    type: string
  ): Promise<string> {
    // Process different terminology types
    if (type === "icd10") {
      // Process ICD-10 codes
      const lines = content.split("\n");
      return lines
        .filter((line) => line.trim() && line.includes("\t"))
        .slice(0, 1000) // Limit to prevent huge documents
        .map((line) => {
          const [code, description] = line.split("\t");
          return `ICD-10 ${code}: ${description}`;
        })
        .join("\n");
    }

    if (type === "hcpcs") {
      // Process HCPCS codes
      try {
        const data = JSON.parse(content);
        if (Array.isArray(data)) {
          return data
            .slice(0, 1000)
            .map((item) => `HCPCS ${item.code}: ${item.description}`)
            .join("\n");
        }
      } catch (e) {
        // Fallback to text processing
      }
    }

    // Default: return first 10000 characters
    return content.substring(0, 10000);
  }

  private getContentType(filename: string): string {
    if (filename.endsWith(".json")) return "application/json";
    if (filename.endsWith(".csv")) return "text/csv";
    if (filename.endsWith(".txt")) return "text/plain";
    return "application/octet-stream";
  }
}

// Main execution
async function main() {
  try {
    const populator = new AISearchPopulator();
    await populator.run();
    process.exit(0);
  } catch (error) {
    logger.error("Script execution failed:", error);
    process.exit(1);
  }
}

// Execute if run directly
if (require.main === module) {
  main();
}

export { AISearchPopulator };
