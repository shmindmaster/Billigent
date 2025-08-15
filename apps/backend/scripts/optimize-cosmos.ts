#!/usr/bin/env tsx

/**
 * Cosmos DB Optimization Script
 * 
 * This script helps optimize Azure Cosmos DB performance by:
 * 1. Creating proper indexes for common query patterns
 * 2. Analyzing query performance
 * 3. Suggesting partition key optimizations
 * 4. Setting up monitoring and alerts
 */

import { DefaultAzureCredential } from "@azure/identity";
import { CosmosClient, Database, Container } from "@azure/cosmos";
import { log } from "../src/utils/logger.js";

interface OptimizationResult {
  container: string;
  currentIndexes: string[];
  suggestedIndexes: string[];
  partitionKeyAnalysis: {
    current: string;
    suggested: string;
    reasoning: string;
  };
  queryOptimizations: string[];
}

class CosmosOptimizer {
  private client: CosmosClient;
  private database: Database | null = null;

  constructor() {
    const endpoint = process.env.AZURE_COSMOS_ENDPOINT;
    const key = process.env.AZURE_COSMOS_KEY;

    if (!endpoint) {
      throw new Error("AZURE_COSMOS_ENDPOINT environment variable is required");
    }

    if (key) {
      this.client = new CosmosClient({ endpoint, key });
    } else {
      this.client = new CosmosClient({
        endpoint,
        aadCredentials: new DefaultAzureCredential(),
      });
    }
  }

  async initialize(): Promise<void> {
    try {
      const { database } = await this.client.databases.createIfNotExists({
        id: process.env.AZURE_COSMOS_DATABASE || "billigent",
      });
      this.database = database;
      log.info("Connected to Cosmos DB database", { databaseId: database.id });
    } catch (error) {
      log.error("Failed to connect to Cosmos DB", { error: error instanceof Error ? error.message : error });
      throw error;
    }
  }

  async analyzeContainer(containerId: string): Promise<OptimizationResult> {
    if (!this.database) {
      throw new Error("Database not initialized");
    }

    try {
      const { container } = await this.database.containers.read(containerId);
      const { resource: containerDef } = await container.read();

      const result: OptimizationResult = {
        container: containerId,
        currentIndexes: containerDef?.indexingPolicy?.includedPaths?.map(p => p.path) || [],
        suggestedIndexes: this.getSuggestedIndexes(containerId),
        partitionKeyAnalysis: this.analyzePartitionKey(containerId, containerDef?.partitionKey),
        queryOptimizations: this.getQueryOptimizations(containerId),
      };

      return result;
    } catch (error) {
      log.error("Failed to analyze container", { containerId, error: error instanceof Error ? error.message : error });
      throw error;
    }
  }

  private getSuggestedIndexes(containerId: string): string[] {
    const suggestions: Record<string, string[]> = {
      "evidence-bundles": [
        "/patientId/?" as string,
        "/encounterId/?" as string,
        "/createdAt/?" as string,
        "/status/?" as string,
        "/bundleHash/?" as string,
      ],
      "attribution-tracking": [
        "/bundleId/?" as string,
        "/patientId/?" as string,
        "/verificationStatus/?" as string,
        "/createdAt/?" as string,
      ],
      "document-versions": [
        "/documentId/?" as string,
        "/version/?" as string,
        "/createdAt/?" as string,
        "/createdBy/?" as string,
      ],
      "collaboration-sessions": [
        "/sessionId/?" as string,
        "/caseId/?" as string,
        "/status/?" as string,
        "/updatedAt/?" as string,
      ],
      "cases": [
        "/patientFhirId/?" as string,
        "/encounterFhirId/?" as string,
        "/status/?" as string,
        "/priority/?" as string,
        "/assignedUserId/?" as string,
        "/createdAt/?" as string,
      ],
    };

    return suggestions[containerId] || [];
  }

  private analyzePartitionKey(containerId: string, currentPartitionKey: any): {
    current: string;
    suggested: string;
    reasoning: string;
  } {
    const suggestions: Record<string, { suggested: string; reasoning: string }> = {
      "evidence-bundles": {
        suggested: "/patientId",
        reasoning: "Patient-centric queries are most common, good distribution",
      },
      "attribution-tracking": {
        suggested: "/bundleId",
        reasoning: "Bundle-centric lookups, good for attribution queries",
      },
      "document-versions": {
        suggested: "/documentId",
        reasoning: "Document-centric versioning, good for history queries",
      },
      "collaboration-sessions": {
        suggested: "/sessionId",
        reasoning: "Session-centric operations, good for real-time updates",
      },
      "cases": {
        suggested: "/id",
        reasoning: "Case-centric operations, good for individual case management",
      },
    };

    const suggestion = suggestions[containerId] || { suggested: "unknown", reasoning: "No specific recommendation" };
    
    return {
      current: currentPartitionKey?.paths?.join(", ") || "unknown",
      suggested: suggestion.suggested,
      reasoning: suggestion.reasoning,
    };
  }

  private getQueryOptimizations(containerId: string): string[] {
    const optimizations: Record<string, string[]> = {
      "evidence-bundles": [
        "Use patientId in WHERE clause for efficient partitioning",
        "Add composite index on (patientId, createdAt) for time-based queries",
        "Consider using continuation tokens for large result sets",
      ],
      "attribution-tracking": [
        "Use bundleId in WHERE clause for efficient partitioning",
        "Add index on verificationStatus for filtering",
        "Use ORDER BY with indexed fields only",
      ],
      "document-versions": [
        "Use documentId in WHERE clause for efficient partitioning",
        "Add index on version for sorting",
        "Consider using point reads for single version lookups",
      ],
      "collaboration-sessions": [
        "Use sessionId in WHERE clause for efficient partitioning",
        "Add index on caseId for case-based queries",
        "Use status filtering with indexed fields",
      ],
      "cases": [
        "Use id in WHERE clause for efficient partitioning",
        "Add composite indexes for common filter combinations",
        "Consider using cross-partition queries sparingly",
      ],
    };

    return optimizations[containerId] || [];
  }

  async createOptimizedIndexes(containerId: string): Promise<void> {
    if (!this.database) {
      throw new Error("Database not initialized");
    }

    try {
      const { container } = await this.database.containers.read(containerId);
      const { resource: containerDef } = await container.read();

      const suggestedIndexes = this.getSuggestedIndexes(containerId);
      const currentIndexes = containerDef?.indexingPolicy?.includedPaths?.map(p => p.path) || [];

      const newIndexes = suggestedIndexes.filter(index => !currentIndexes.includes(index));

      if (newIndexes.length === 0) {
        log.info("No new indexes needed", { containerId });
        return;
      }

      const updatedPolicy = {
        ...containerDef.indexingPolicy,
        includedPaths: [
          ...(containerDef.indexingPolicy?.includedPaths || []),
          ...newIndexes.map(path => ({ path, indexes: [] })),
        ],
      };

      await container.replace({
        ...containerDef,
        indexingPolicy: updatedPolicy,
      });

      log.info("Indexes updated successfully", { containerId, newIndexes });
    } catch (error) {
      log.error("Failed to update indexes", { containerId, error: error instanceof Error ? error.message : error });
      throw error;
    }
  }

  async generateOptimizationReport(): Promise<void> {
    const containers = [
      "evidence-bundles",
      "attribution-tracking", 
      "document-versions",
      "collaboration-sessions",
      "cases",
    ];

    log.info("Starting Cosmos DB optimization analysis");

    for (const containerId of containers) {
      try {
        const analysis = await this.analyzeContainer(containerId);
        
        log.info("Container analysis complete", {
          container: analysis.container,
          currentIndexes: analysis.currentIndexes.length,
          suggestedIndexes: analysis.suggestedIndexes.length,
          partitionKey: analysis.partitionKeyAnalysis.current,
          suggestedPartitionKey: analysis.partitionKeyAnalysis.suggested,
        });

        // Log detailed recommendations
        if (analysis.suggestedIndexes.length > analysis.currentIndexes.length) {
          log.warn("Index optimization needed", {
            container: analysis.container,
            missingIndexes: analysis.suggestedIndexes.filter(i => !analysis.currentIndexes.includes(i)),
          });
        }

        if (analysis.partitionKeyAnalysis.current !== analysis.partitionKeyAnalysis.suggested) {
          log.warn("Partition key optimization suggested", {
            container: analysis.container,
            current: analysis.partitionKeyAnalysis.current,
            suggested: analysis.partitionKeyAnalysis.suggested,
            reasoning: analysis.partitionKeyAnalysis.reasoning,
          });
        }

        analysis.queryOptimizations.forEach(optimization => {
          log.info("Query optimization suggestion", { container: analysis.container, suggestion: optimization });
        });

      } catch (error) {
        log.error("Failed to analyze container", { containerId, error: error instanceof Error ? error.message : error });
      }
    }

    log.info("Cosmos DB optimization analysis complete");
  }

  async close(): Promise<void> {
    await this.client.dispose();
  }
}

async function main() {
  const optimizer = new CosmosOptimizer();
  
  try {
    await optimizer.initialize();
    await optimizer.generateOptimizationReport();
    
    // Optionally apply optimizations
    if (process.argv.includes("--apply")) {
      log.info("Applying index optimizations...");
      const containers = ["evidence-bundles", "attribution-tracking", "document-versions", "collaboration-sessions", "cases"];
      
      for (const containerId of containers) {
        try {
          await optimizer.createOptimizedIndexes(containerId);
        } catch (error) {
          log.error("Failed to optimize container", { containerId, error: error instanceof Error ? error.message : error });
        }
      }
    }
    
  } catch (error) {
    log.error("Optimization failed", { error: error instanceof Error ? error.message : error });
    process.exit(1);
  } finally {
    await optimizer.close();
  }
}

if (require.main === module) {
  main().catch(console.error);
}

export default CosmosOptimizer;
