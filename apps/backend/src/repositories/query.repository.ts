import { v4 as uuid } from "uuid";
import { azureCosmosService } from "../services/azureCosmos.service";

export interface QueryRecord {
  id: string;
  question: string;
  answer?: string | null;
  confidence?: number | null;
  sources?: any[] | null;
  status: string;
  userId: string;
  context: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  type: "query";
}

interface ListOptions {
  limit?: number;
  page?: number;
}

class QueryRepository {
  private static instance: QueryRepository;
  private container: any; // partition by id for now
  private initialized = false;

  static getInstance(): QueryRepository {
    if (!QueryRepository.instance)
      QueryRepository.instance = new QueryRepository();
    return QueryRepository.instance;
  }

  private async ensureInit() {
    if (this.initialized) return;
    const cosmos = azureCosmosService;
    await cosmos.initialize();
    this.container = await cosmos.getOrCreateContainer("queries", "/id");
    this.initialized = true;
  }

  async list(options: ListOptions = {}) {
    await this.ensureInit();
    const { limit = 50, page = 1 } = options;
    const querySpec = {
      query: 'SELECT * FROM c WHERE c.type = "query" ORDER BY c.createdAt DESC',
    };
    const { resources } = await this.container.items
      .query(querySpec)
      .fetchAll();
    const all = resources as QueryRecord[];
    const total = all.length;
    const start = (page - 1) * limit;
    return { queries: all.slice(start, start + limit), total };
  }

  async get(id: string): Promise<QueryRecord | null> {
    await this.ensureInit();
    try {
      const { resource } = await this.container.item(id, id).read();
      return (resource as QueryRecord) || null;
    } catch {
      return null;
    }
  }

  async create(data: {
    question: string;
    userId: string;
    context?: Record<string, any>;
  }): Promise<QueryRecord> {
    await this.ensureInit();
    const now = new Date().toISOString();
    const record: QueryRecord = {
      id: uuid(),
      question: data.question,
      status: "processing",
      answer: null,
      confidence: null,
      sources: null,
      userId: data.userId,
      context: data.context || {},
      createdAt: now,
      updatedAt: now,
      type: "query",
    };
    await this.container.items.create({ ...record, _partitionKey: record.id });
    return record;
  }

  async update(
    id: string,
    updates: Partial<QueryRecord>
  ): Promise<QueryRecord | null> {
    await this.ensureInit();
    const existing = await this.get(id);
    if (!existing) return null;
    const updated: QueryRecord = {
      ...existing,
      ...updates,
      id,
      updatedAt: new Date().toISOString(),
    };
    await this.container.item(id, id).replace(updated);
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    await this.ensureInit();
    try {
      await this.container.item(id, id).delete();
      return true;
    } catch {
      return false;
    }
  }
}

export default QueryRepository.getInstance();
