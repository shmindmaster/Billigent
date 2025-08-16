import azureCosmosService from "../services/azureCosmos.service";
import { v4 as uuid } from "uuid";
import { Container, Database } from "@azure/cosmos";

export interface CaseRecord {
  id: string;
  title?: string | null;
  description?: string | null;
  patientFhirId: string;
  encounterFhirId: string;
  status: string;
  priority: string;
  assignedUserId?: string | null;
  facilityId?: string | null;
  medicalRecordNumber?: string | null;
  patientName?: string | null;
  age?: number | null;
  gender?: string | null;
  admissionDate?: string | null;
  dischargeDate?: string | null;
  primaryDiagnosis?: string | null;
  currentDRG?: string | null;
  openDate?: string | null;
  closeDate?: string | null;
  createdAt: string;
  updatedAt: string;
  type: "case";
}

const CONTAINER_ID = "cases";

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
      partitionKey: { paths: ["/id"] },
    });
    (svc as CosmosService).containers[CONTAINER_ID] = container;
  }
  return (svc as CosmosService).containers[CONTAINER_ID];
}

export class CaseRepository {
  static async list(params: {
    page: number;
    limit: number;
    search?: string;
    status?: string;
    priority?: string;
    assignedUserId?: string;
  }) {
    const container = await ensureContainer();
    const { page, limit, search, status, priority, assignedUserId } = params;
    const offset = (page - 1) * limit;

    // Build dynamic SQL query with proper filtering
    let query = 'SELECT * FROM c WHERE c.type = "case"';
    const parameters: Array<{ name: string; value: string | number }> = [];
    let parameterIndex = 1;

    // Add search filter using CONTAINS for indexed search
    if (search) {
      query += ` AND (CONTAINS(c.patientFhirId, @search${parameterIndex}) OR CONTAINS(c.encounterFhirId, @search${parameterIndex}) OR CONTAINS(c.medicalRecordNumber, @search${parameterIndex}) OR CONTAINS(c.patientName, @search${parameterIndex}) OR CONTAINS(c.primaryDiagnosis, @search${parameterIndex}) OR CONTAINS(c.title, @search${parameterIndex}) OR CONTAINS(c.description, @search${parameterIndex}))`;
      parameters.push({ name: `@search${parameterIndex}`, value: search });
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
    let totalQuery = 'SELECT VALUE COUNT(1) FROM c WHERE c.type = "case"';
    const countParameters: Array<{ name: string; value: string | number }> = [];
    let countParamIndex = 1;

    // Add the same filters to count query (excluding pagination)
    if (search) {
      totalQuery += ` AND (CONTAINS(c.patientFhirId, @search${countParamIndex}) OR CONTAINS(c.encounterFhirId, @search${countParamIndex}) OR CONTAINS(c.medicalRecordNumber, @search${countParamIndex}) OR CONTAINS(c.patientName, @search${countParamIndex}) OR CONTAINS(c.primaryDiagnosis, @search${countParamIndex}) OR CONTAINS(c.title, @search${countParamIndex}) OR CONTAINS(c.description, @search${countParamIndex}))`;
      countParameters.push({ name: `@search${countParamIndex}`, value: search });
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

    const { resources: countResources } = await container.items.query({ 
      query: totalQuery, 
      parameters: countParameters 
    }).fetchAll();
    
    const total = countResources[0] || 0;
    const records: CaseRecord[] = resources as CaseRecord[];

    return { cases: records, total };
  }

  static async get(id: string): Promise<CaseRecord | null> {
    const container = await ensureContainer();
    try {
      const { resource } = await container.item(id, id).read();
      return resource as CaseRecord;
    } catch (e: unknown) {
      if (e instanceof Error && 'code' in e && e.code === 404) return null;
      throw e;
    }
  }

  static async create(data: Partial<CaseRecord>): Promise<CaseRecord> {
    const container = await ensureContainer();
    const now = new Date().toISOString();
    const record: CaseRecord = {
      id: uuid(),
      patientFhirId: data.patientFhirId!,
      encounterFhirId: data.encounterFhirId!,
      title: data.title || null,
      description: data.description || null,
      status: data.status || "open",
      priority: data.priority || "medium",
      assignedUserId: data.assignedUserId || null,
      facilityId: data.facilityId || null,
      medicalRecordNumber: data.medicalRecordNumber || null,
      patientName: data.patientName || null,
      age: data.age ?? null,
      gender: data.gender || null,
      admissionDate: data.admissionDate || null,
      dischargeDate: data.dischargeDate || null,
      primaryDiagnosis: data.primaryDiagnosis || null,
      currentDRG: data.currentDRG || null,
      openDate: data.openDate || null,
      closeDate: data.closeDate || null,
      createdAt: now,
      updatedAt: now,
      type: "case",
    };
    await container.items.create({ ...record, _partitionKey: record.id });
    return record;
  }

  static async update(
    id: string,
    updates: Partial<CaseRecord>
  ): Promise<CaseRecord | null> {
    const existing = await this.get(id);
    if (!existing) return null;
    const container = await ensureContainer();
    const updated: CaseRecord = {
      ...existing,
      ...updates,
      id,
      updatedAt: new Date().toISOString(),
    };
    await container.item(id, id).replace(updated);
    return updated;
  }

  static async delete(id: string): Promise<boolean> {
    const container = await ensureContainer();
    try {
      await container.item(id, id).delete();
      return true;
    } catch (e: unknown) {
      if (e instanceof Error && 'code' in e && e.code === 404) return false;
      throw e;
    }
  }
}

export default CaseRepository;
