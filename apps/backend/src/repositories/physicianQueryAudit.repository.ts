import { v4 as uuid } from "uuid";
import crypto from "crypto";
import { azureCosmosService } from "../services/azureCosmos.service";
import { PhysicianQueryEventType } from "./physicianQuery.repository";

export interface PhysicianQueryAuditEventRecord {
  id: string; // uuid of audit event
  physicianQueryId: string;
  eventType: PhysicianQueryEventType;
  actorUserId: string;
  previousStatus?: string | null;
  newStatus?: string | null;
  sequence: number;
  hash: string;
  prevHash?: string | null;
  metadata?: Record<string, any> | null;
  createdAt: string;
  type: "physicianQueryAuditEvent";
}

interface AppendInput {
  physicianQueryId: string;
  eventType: PhysicianQueryEventType;
  actorUserId: string;
  previousStatus?: string | null;
  newStatus?: string | null;
  metadata?: Record<string, any>;
}

class PhysicianQueryAuditRepository {
  private static instance: PhysicianQueryAuditRepository;
  private container: any; // partitionKey on physicianQueryId for grouping
  private initialized = false;

  static getInstance(): PhysicianQueryAuditRepository {
    if (!PhysicianQueryAuditRepository.instance)
      PhysicianQueryAuditRepository.instance =
        new PhysicianQueryAuditRepository();
    return PhysicianQueryAuditRepository.instance;
  }

  private async ensureInit(): Promise<void> {
    if (this.initialized) return;
    const cosmos = azureCosmosService;
    await cosmos.initialize();
    // Partition by physicianQueryId so sequence queries are efficient
    this.container = await cosmos.getOrCreateContainer(
      "physician-query-audit",
      "/physicianQueryId"
    );
    this.initialized = true;
  }

  async list(
    physicianQueryId: string
  ): Promise<PhysicianQueryAuditEventRecord[]> {
    await this.ensureInit();
    const querySpec = {
      query:
        'SELECT * FROM c WHERE c.physicianQueryId = @id AND c.type = "physicianQueryAuditEvent" ORDER BY c.sequence ASC',
      parameters: [{ name: "@id", value: physicianQueryId }],
    };
    const { resources } = await this.container.items
      .query(querySpec, { partitionKey: physicianQueryId })
      .fetchAll();
    return resources as PhysicianQueryAuditEventRecord[];
  }

  async append(input: AppendInput): Promise<PhysicianQueryAuditEventRecord> {
    await this.ensureInit();
    const {
      physicianQueryId,
      eventType,
      actorUserId,
      previousStatus,
      newStatus,
      metadata,
    } = input;

    // Fetch last event to build chain
    const querySpec = {
      query:
        'SELECT TOP 1 * FROM c WHERE c.physicianQueryId = @id AND c.type = "physicianQueryAuditEvent" ORDER BY c.sequence DESC',
      parameters: [{ name: "@id", value: physicianQueryId }],
    };
    const { resources } = await this.container.items
      .query(querySpec, { partitionKey: physicianQueryId })
      .fetchAll();
    const last = resources[0] as PhysicianQueryAuditEventRecord | undefined;
    const sequence = (last?.sequence || 0) + 1;
    const prevHash = last?.hash || null;

    const hashMaterial = JSON.stringify({
      physicianQueryId,
      sequence,
      prevHash,
      eventType,
      actorUserId,
      previousStatus,
      newStatus,
      metadata,
    });
    const hash = crypto.createHash("sha256").update(hashMaterial).digest("hex");

    const record: PhysicianQueryAuditEventRecord = {
      id: uuid(),
      physicianQueryId,
      eventType,
      actorUserId,
      previousStatus: previousStatus ?? null,
      newStatus: newStatus ?? null,
      sequence,
      hash,
      prevHash,
      metadata: metadata || null,
      createdAt: new Date().toISOString(),
      type: "physicianQueryAuditEvent",
    };

    await this.container.items.create({
      ...record,
      _partitionKey: physicianQueryId,
    });
    return record;
  }
}

export default PhysicianQueryAuditRepository.getInstance();
