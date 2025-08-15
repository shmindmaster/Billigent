import { v4 as uuid } from "uuid";
import { azureCosmosService } from "../services/azureCosmos.service";
import { Container } from "@azure/cosmos";

export enum PhysicianQueryStatus {
  DRAFT = "DRAFT",
  SENT = "SENT",
  RESPONDED = "RESPONDED",
}

export enum PhysicianQueryEventType {
  CREATED = "CREATED",
  SENT = "SENT",
  RESPONDED = "RESPONDED",
}

export interface PhysicianQueryTemplateSnapshot {
  code: string;
  title: string;
  bodyMarkup: string;
  version: number;
  guidance?: string | null;
  clinicalIndicators?: string[] | null;
}

export interface PhysicianQueryRecord {
  id: string;
  templateSnapshot: PhysicianQueryTemplateSnapshot;
  templateCode: string; // duplicated for query convenience
  createdById: string;
  assignedPhysicianId: string;
  caseId?: string | null;
  encounterId?: string | null;
  freeTextSupplement?: string | null;
  status: PhysicianQueryStatus;
  draft: boolean;
  sentAt?: string | null;
  respondedAt?: string | null;
  statusUpdatedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  type: "physicianQuery";
}

interface CreateInput {
  templateSnapshot: PhysicianQueryTemplateSnapshot;
  createdById: string;
  assignedPhysicianId: string;
  caseId?: string | null;
  encounterId?: string | null;
  freeTextSupplement?: string | null;
}

interface ListOptions {
  limit?: number;
  page?: number;
}

class PhysicianQueryRepository {
  private static instance: PhysicianQueryRepository;
  private container!: Container;
  private initialized = false;

  static getInstance(): PhysicianQueryRepository {
    if (!PhysicianQueryRepository.instance)
      PhysicianQueryRepository.instance = new PhysicianQueryRepository();
    return PhysicianQueryRepository.instance;
  }

  private async ensureInit(): Promise<void> {
    if (this.initialized) return;
    const cosmos = azureCosmosService;
    await cosmos.initialize();
    this.container = await cosmos.getOrCreateContainer(
      "physician-queries",
      "/id"
    );
    this.initialized = true;
  }

  async create(input: CreateInput): Promise<PhysicianQueryRecord> {
    await this.ensureInit();
    const now = new Date().toISOString();
    const record: PhysicianQueryRecord = {
      id: uuid(),
      templateSnapshot: input.templateSnapshot,
      templateCode: input.templateSnapshot.code,
      createdById: input.createdById,
      assignedPhysicianId: input.assignedPhysicianId,
      caseId: input.caseId || null,
      encounterId: input.encounterId || null,
      freeTextSupplement: input.freeTextSupplement || null,
      status: PhysicianQueryStatus.DRAFT,
      draft: true,
      createdAt: now,
      updatedAt: now,
      type: "physicianQuery",
    };
    await this.container.items.create({ ...record, _partitionKey: record.id });
    return record;
  }

  async get(id: string): Promise<PhysicianQueryRecord | null> {
    await this.ensureInit();
    try {
      const { resource } = await this.container.item(id, id).read();
      return (resource as PhysicianQueryRecord) || null;
    } catch {
      return null;
    }
  }

  async update(
    id: string,
    updates: Partial<PhysicianQueryRecord>
  ): Promise<PhysicianQueryRecord | null> {
    await this.ensureInit();
    const existing = await this.get(id);
    if (!existing) return null;
    const updated: PhysicianQueryRecord = {
      ...existing,
      ...updates,
      id,
      updatedAt: new Date().toISOString(),
    };
    await this.container.item(id, id).replace(updated);
    return updated;
  }

  async list(
    options: ListOptions = {}
  ): Promise<{ queries: PhysicianQueryRecord[]; total: number }> {
    await this.ensureInit();
    const { limit = 50, page = 1 } = options;
    const querySpec = {
      query:
        'SELECT * FROM c WHERE c.type = "physicianQuery" ORDER BY c.createdAt DESC',
    };
    const { resources } = await this.container.items
      .query(querySpec)
      .fetchAll();
    const records = resources as PhysicianQueryRecord[];
    const total = records.length;
    const start = (page - 1) * limit;
    return { queries: records.slice(start, start + limit), total };
  }
}

export default PhysicianQueryRepository.getInstance();
