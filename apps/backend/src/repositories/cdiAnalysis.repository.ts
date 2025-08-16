/**
 * CDI Analysis Repository
 * 
 * Implements data access layer for CDI analysis records using Azure Cosmos DB
 * Following best practices for performance, security, and maintainability
 */

import { Container, Database } from "@azure/cosmos";
import { v4 as uuid } from "uuid";
import azureCosmosService from "../services/azureCosmos.service";
import { log } from "../utils/logger";
import {
  CDIAnalysisRecord,
  CDIAnalysisCreateInput,
  CDIAnalysisUpdateInput,
  CDIAnalysisListOptions,
  CDIAnalysisListResult,
  CDIAnalysisStats,
} from "../types/cdi.types";

const CONTAINER_ID = "cdi_analyses";

interface CosmosService {
  database: Database;
  containers: Record<string, Container>;
}

async function ensureContainer(): Promise<Container> {
  await azureCosmosService.initialize();
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const {
    azureCosmosService: svc,
  } = require("../services/azureCosmos.service");
  const db = (svc as CosmosService).database;
  if (db && !(svc as CosmosService).containers[CONTAINER_ID]) {
    const { container } = await db.containers.createIfNotExists({
      id: CONTAINER_ID,
      partitionKey: { paths: ["/encounterId"] }, // Partition by encounter for efficient queries
    });
    (svc as CosmosService).containers[CONTAINER_ID] = container;
  }
  return (svc as CosmosService).containers[CONTAINER_ID];
}

export class CDIAnalysisRepository {
  /**
   * List CDI analyses with advanced filtering and search
   * Uses server-side queries for optimal performance
   */
  static async list(options: CDIAnalysisListOptions): Promise<CDIAnalysisListResult> {
    const container = await ensureContainer();
    const { page, limit, search, status, priority, assignedUserId, facilityId, encounterId, patientFhirId, dateRange } = options;
    const offset = (page - 1) * limit;

    // Build dynamic SQL query with proper filtering
    let query = 'SELECT * FROM c WHERE c.type = "cdi_analysis"';
    const parameters: Array<{ name: string; value: string | number | boolean }> = [];
    let parameterIndex = 1;

    // Add encounter ID filter (partition key - most efficient)
    if (encounterId) {
      query += ` AND c.encounterId = @encounterId${parameterIndex}`;
      parameters.push({ name: `@encounterId${parameterIndex}`, value: encounterId });
      parameterIndex++;
    }

    // Add patient FHIR ID filter
    if (patientFhirId) {
      query += ` AND c.patientFhirId = @patientFhirId${parameterIndex}`;
      parameters.push({ name: `@patientFhirId${parameterIndex}`, value: patientFhirId });
      parameterIndex++;
    }

    // Add status filter
    if (status) {
      query += ` AND c.status = @status${parameterIndex}`;
      parameters.push({ name: `@status${parameterIndex}`, value: status });
      parameterIndex++;
    }

    // Add priority filter
    if (priority) {
      query += ` AND c.priority = @priority${parameterIndex}`;
      parameters.push({ name: `@priority${parameterIndex}`, value: priority });
      parameterIndex++;
    }

    // Add assigned user filter
    if (assignedUserId) {
      query += ` AND c.assignedUserId = @assignedUserId${parameterIndex}`;
      parameters.push({ name: `@assignedUserId${parameterIndex}`, value: assignedUserId });
      parameterIndex++;
    }

    // Add facility filter
    if (facilityId) {
      query += ` AND c.facilityId = @facilityId${parameterIndex}`;
      parameters.push({ name: `@facilityId${parameterIndex}`, value: facilityId });
      parameterIndex++;
    }

    // Add date range filter
    if (dateRange) {
      query += ` AND c.createdAt >= @startDate${parameterIndex} AND c.createdAt <= @endDate${parameterIndex}`;
      parameters.push(
        { name: `@startDate${parameterIndex}`, value: dateRange.start },
        { name: `@endDate${parameterIndex}`, value: dateRange.end }
      );
      parameterIndex += 2;
    }

    // Add search filter using CONTAINS for indexed search across multiple fields
    if (search) {
      query += ` AND (CONTAINS(c.analysisId, @search${parameterIndex}) OR CONTAINS(c.patientFhirId, @search${parameterIndex}) OR CONTAINS(c.encounterId, @search${parameterIndex}) OR CONTAINS(c.clinicalContext.primaryDiagnosis, @search${parameterIndex}) OR CONTAINS(c.recommendations[0].description, @search${parameterIndex}))`;
      parameters.push({ name: `@search${parameterIndex}`, value: search });
      parameterIndex++;
    }

    // Add ordering and pagination
    query += ' ORDER BY c.createdAt DESC OFFSET @offset LIMIT @limit';
    parameters.push(
      { name: '@offset', value: offset },
      { name: '@limit', value: limit }
    );

    // Execute the optimized query
    const { resources } = await container.items.query({ 
      query, 
      parameters 
    }).fetchAll();

    // Get total count for pagination (separate count query for efficiency)
    let totalQuery = 'SELECT VALUE COUNT(1) FROM c WHERE c.type = "cdi_analysis"';
    const countParameters: Array<{ name: string; value: string | number | boolean }> = [];
    let countParamIndex = 1;

    // Add the same filters to count query (excluding pagination)
    if (encounterId) {
      totalQuery += ` AND c.encounterId = @encounterId${countParamIndex}`;
      countParameters.push({ name: `@encounterId${countParamIndex}`, value: encounterId });
      countParamIndex++;
    }

    if (patientFhirId) {
      totalQuery += ` AND c.patientFhirId = @patientFhirId${countParamIndex}`;
      countParameters.push({ name: `@patientFhirId${countParamIndex}`, value: patientFhirId });
      countParamIndex++;
    }

    if (status) {
      totalQuery += ` AND c.status = @status${countParamIndex}`;
      countParameters.push({ name: `@status${countParamIndex}`, value: status });
      countParamIndex++;
    }

    if (priority) {
      totalQuery += ` AND c.priority = @priority${countParamIndex}`;
      countParameters.push({ name: `@priority${countParamIndex}`, value: priority });
      countParamIndex++;
    }

    if (assignedUserId) {
      totalQuery += ` AND c.assignedUserId = @assignedUserId${countParamIndex}`;
      countParameters.push({ name: `@assignedUserId${countParamIndex}`, value: assignedUserId });
      countParamIndex++;
    }

    if (facilityId) {
      totalQuery += ` AND c.facilityId = @facilityId${countParamIndex}`;
      countParameters.push({ name: `@facilityId${countParamIndex}`, value: facilityId });
      countParamIndex++;
    }

    if (dateRange) {
      totalQuery += ` AND c.createdAt >= @startDate${countParamIndex} AND c.createdAt <= @endDate${countParamIndex}`;
      countParameters.push(
        { name: `@startDate${countParamIndex}`, value: dateRange.start },
        { name: `@endDate${countParamIndex}`, value: dateRange.end }
      );
      countParamIndex += 2;
    }

    if (search) {
      totalQuery += ` AND (CONTAINS(c.analysisId, @search${countParamIndex}) OR CONTAINS(c.patientFhirId, @search${countParamIndex}) OR CONTAINS(c.encounterId, @search${countParamIndex}) OR CONTAINS(c.clinicalContext.primaryDiagnosis, @search${countParamIndex}) OR CONTAINS(c.recommendations[0].description, @search${countParamIndex}))`;
      countParameters.push({ name: `@search${countParamIndex}`, value: search });
      countParamIndex++;
    }

    const { resources: countResources } = await container.items.query({ 
      query: totalQuery, 
      parameters: countParameters 
    }).fetchAll();
    
    const total = countResources[0] || 0;
    const analyses: CDIAnalysisRecord[] = resources as CDIAnalysisRecord[];
    const totalPages = Math.ceil(total / limit);

    return { 
      analyses, 
      total, 
      page, 
      limit, 
      totalPages 
    };
  }

  /**
   * Get a specific CDI analysis by ID
   * Uses point read for optimal performance
   */
  static async get(analysisId: string): Promise<CDIAnalysisRecord | null> {
    const container = await ensureContainer();
    
    try {
      // First, find the encounter ID for this analysis to get the partition key
      const findQuery = 'SELECT c.encounterId FROM c WHERE c.type = "cdi_analysis" AND c.analysisId = @analysisId';
      const { resources } = await container.items.query({
        query: findQuery,
        parameters: [{ name: '@analysisId', value: analysisId }]
      }).fetchAll();

      if (resources.length === 0) {
        return null;
      }

      const encounterId = resources[0].encounterId;
      
      // Now read the full record using the partition key
      const { resource } = await container.item(analysisId, encounterId).read();
      return resource as CDIAnalysisRecord;
    } catch (e: unknown) {
      if (e instanceof Error && 'code' in e && e.code === 404) return null;
      log.error('Error retrieving CDI analysis', { analysisId, error: e instanceof Error ? e.message : e });
      throw e;
    }
  }

  /**
   * Create a new CDI analysis record
   * Generates unique IDs and timestamps
   */
  static async create(input: CDIAnalysisCreateInput): Promise<CDIAnalysisRecord> {
    const container = await ensureContainer();
    const now = new Date().toISOString();
    
    const record: CDIAnalysisRecord = {
      id: uuid(),
      analysisId: `CDI:${input.encounterId}:${Date.now()}`,
      encounterId: input.encounterId,
      patientFhirId: input.patientFhirId,
      facilityId: input.facilityId,
      assignedUserId: input.assignedUserId,
      status: 'pending',
      priority: input.priority || 'medium',
      confidence: 0,
      financialImpact: {
        potentialIncrease: 0,
        documentationGaps: [],
      },
      recommendations: [],
      clinicalContext: {},
      conversationHistory: [],
      metadata: {
        analysisType: 'enhanced_cdi',
        modelVersion: process.env.AZURE_OPENAI_MODEL || 'gpt-5-mini',
        processingTime: 0,
        dataSources: [],
        lastUpdated: now,
      },
      createdAt: now,
      updatedAt: now,
      type: 'cdi_analysis',
    };

    await container.items.create({ ...record, _partitionKey: record.encounterId });
    log.info('CDI analysis created', { analysisId: record.analysisId, encounterId: record.encounterId });
    
    return record;
  }

  /**
   * Update an existing CDI analysis record
   * Maintains audit trail with updatedAt timestamp
   */
  static async update(analysisId: string, updates: CDIAnalysisUpdateInput): Promise<CDIAnalysisRecord | null> {
    const existing = await this.get(analysisId);
    if (!existing) return null;
    
    const container = await ensureContainer();
    
    // Create updated record with proper type handling
    const updated: CDIAnalysisRecord = {
      ...existing,
      updatedAt: new Date().toISOString(),
    };

    // Handle status update
    if (updates.status !== undefined) {
      updated.status = updates.status;
    }

    // Handle priority update
    if (updates.priority !== undefined) {
      updated.priority = updates.priority;
    }

    // Handle confidence update
    if (updates.confidence !== undefined) {
      updated.confidence = updates.confidence;
    }

    // Handle financialImpact updates properly
    if (updates.financialImpact) {
      updated.financialImpact = {
        ...existing.financialImpact,
        ...updates.financialImpact,
        // Ensure potentialIncrease is always a number
        potentialIncrease: updates.financialImpact.potentialIncrease ?? existing.financialImpact.potentialIncrease,
      };
    }

    // Handle recommendations update
    if (updates.recommendations !== undefined) {
      updated.recommendations = updates.recommendations;
    }

    // Handle conversationHistory update
    if (updates.conversationHistory !== undefined) {
      updated.conversationHistory = updates.conversationHistory;
    }

    // Update metadata.lastUpdated if other fields changed
    if (updates.metadata) {
      updated.metadata = {
        ...existing.metadata,
        ...updates.metadata,
        lastUpdated: updated.updatedAt,
      };
    }

    await container.item(analysisId, existing.encounterId).replace(updated);
    log.info('CDI analysis updated', { analysisId, encounterId: existing.encounterId });
    
    return updated;
  }

  /**
   * Delete a CDI analysis record
   * Returns true if deleted, false if not found
   */
  static async delete(analysisId: string): Promise<boolean> {
    const existing = await this.get(analysisId);
    if (!existing) return false;
    
    const container = await ensureContainer();
    
    try {
      await container.item(analysisId, existing.encounterId).delete();
      log.info('CDI analysis deleted', { analysisId, encounterId: existing.encounterId });
      return true;
    } catch (e: unknown) {
      if (e instanceof Error && 'code' in e && e.code === 404) return false;
      log.error('Error deleting CDI analysis', { analysisId, error: e instanceof Error ? e.message : e });
      throw e;
    }
  }

  /**
   * Get CDI analysis statistics for reporting
   * Uses aggregation queries for performance
   */
  static async getStats(): Promise<CDIAnalysisStats> {
    const container = await ensureContainer();
    
    try {
      // Get basic counts by status
      const statusQuery = 'SELECT c.status, COUNT(1) as count FROM c WHERE c.type = "cdi_analysis" GROUP BY c.status';
      const { resources: statusResults } = await container.items.query({ query: statusQuery }).fetchAll();
      
      // Get priority distribution
      const priorityQuery = 'SELECT c.priority, COUNT(1) as count FROM c WHERE c.type = "cdi_analysis" GROUP BY c.priority';
      const { resources: priorityResults } = await container.items.query({ query: priorityQuery }).fetchAll();
      
      // Get total financial impact
      const financialQuery = 'SELECT VALUE SUM(c.financialImpact.potentialIncrease) FROM c WHERE c.type = "cdi_analysis"';
      const { resources: financialResults } = await container.items.query({ query: financialQuery }).fetchAll();
      
      // Get average confidence
      const confidenceQuery = 'SELECT VALUE AVG(c.confidence) FROM c WHERE c.type = "cdi_analysis"';
      const { resources: confidenceResults } = await container.items.query({ query: confidenceQuery }).fetchAll();
      
      // Get top recommendations
      const recommendationsQuery = 'SELECT c.recommendations[0].description as description, COUNT(1) as count, AVG(c.recommendations[0].potentialImpact) as avgImpact FROM c WHERE c.type = "cdi_analysis" AND ARRAY_LENGTH(c.recommendations) > 0 GROUP BY c.recommendations[0].description ORDER BY count DESC OFFSET 0 LIMIT 10';
      const { resources: recommendationResults } = await container.items.query({ query: recommendationsQuery }).fetchAll();
      
      const statusDistribution: Record<string, number> = {};
      statusResults.forEach((result: any) => {
        statusDistribution[result.status] = result.count;
      });
      
      const priorityDistribution: Record<string, number> = {};
      priorityResults.forEach((result: any) => {
        priorityDistribution[result.priority] = result.count;
      });
      
      const totalFinancialImpact = financialResults[0] || 0;
      const averageConfidence = confidenceResults[0] || 0;
      
      const topRecommendations = recommendationResults.map((result: any) => ({
        description: result.description,
        count: result.count,
        averageImpact: result.avgImpact || 0,
      }));
      
      return {
        totalAnalyses: Object.values(statusDistribution).reduce((sum, count) => sum + count, 0),
        completedAnalyses: statusDistribution.completed || 0,
        pendingAnalyses: statusDistribution.pending || 0,
        failedAnalyses: statusDistribution.failed || 0,
        totalFinancialImpact,
        averageConfidence,
        topRecommendations,
        priorityDistribution,
        statusDistribution,
      };
    } catch (e: unknown) {
      log.error('Error getting CDI analysis stats', { error: e instanceof Error ? e.message : e });
      throw e;
    }
  }

  /**
   * Get analyses by encounter ID (most efficient query due to partition key)
   */
  static async getByEncounter(encounterId: string): Promise<CDIAnalysisRecord[]> {
    const container = await ensureContainer();
    
    try {
      const query = 'SELECT * FROM c WHERE c.type = "cdi_analysis" AND c.encounterId = @encounterId ORDER BY c.createdAt DESC';
      const { resources } = await container.items.query({
        query,
        parameters: [{ name: '@encounterId', value: encounterId }]
      }).fetchAll();
      
      return resources as CDIAnalysisRecord[];
    } catch (e: unknown) {
      log.error('Error getting CDI analyses by encounter', { encounterId, error: e instanceof Error ? e.message : e });
      throw e;
    }
  }

  /**
   * Get analyses by patient FHIR ID
   */
  static async getByPatient(patientFhirId: string): Promise<CDIAnalysisRecord[]> {
    const container = await ensureContainer();
    
    try {
      const query = 'SELECT * FROM c WHERE c.type = "cdi_analysis" AND c.patientFhirId = @patientFhirId ORDER BY c.createdAt DESC';
      const { resources } = await container.items.query({
        query,
        parameters: [{ name: '@patientFhirId', value: patientFhirId }]
      }).fetchAll();
      
      return resources as CDIAnalysisRecord[];
    } catch (e: unknown) {
      log.error('Error getting CDI analyses by patient', { patientFhirId, error: e instanceof Error ? e.message : e });
      throw e;
    }
  }
}

export default CDIAnalysisRepository;
