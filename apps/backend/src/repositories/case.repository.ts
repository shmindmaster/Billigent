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

    const query =
      'SELECT * FROM c WHERE c.type = "case" ORDER BY c.createdAt DESC';
    const { resources } = await container.items.query({ query }).fetchAll();
    let records: CaseRecord[] = resources as CaseRecord[];
    if (status) records = records.filter((r) => r.status === status);
    if (priority) records = records.filter((r) => r.priority === priority);
    if (assignedUserId)
      records = records.filter((r) => r.assignedUserId === assignedUserId);
    if (search) {
      const s = search.toLowerCase();
      records = records.filter((r) =>
        [
          r.patientFhirId,
          r.encounterFhirId,
          r.medicalRecordNumber,
          r.patientName,
          r.primaryDiagnosis,
        ].some((v) => v && v.toLowerCase().includes(s))
      );
    }
    const total = records.length;
    const paged = records.slice(offset, offset + limit);
    return { cases: paged, total };
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
