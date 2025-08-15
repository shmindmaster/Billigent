import { v4 as uuid } from 'uuid';
import AzureCosmosService from '../services/azureCosmos.service';

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

interface ListOptions {
  limit?: number;
  page?: number;
  search?: string;
}

class UserRepository {
  private static instance: UserRepository;
  private container: any;
  private initialized = false;

  static getInstance(): UserRepository {
    if (!UserRepository.instance) {
      UserRepository.instance = new UserRepository();
    }
    return UserRepository.instance;
  }

  private async ensureInit(): Promise<void> {
    if (this.initialized) return;
    const cosmos = AzureCosmosService.getInstance();
    await cosmos.initialize();
    this.container = await cosmos.getOrCreateContainer('users', '/id');
    this.initialized = true;
  }

  async list(options: ListOptions = {}): Promise<{ users: UserRecord[]; total: number }> {
    await this.ensureInit();
    const { limit = 50, page = 1, search } = options;

    // Simple query: fetch page worth; for now we pull all then filter (optimize later)
    const querySpec = { query: 'SELECT * FROM c ORDER BY c.createdAt DESC' };
    const { resources } = await this.container.items.query(querySpec).fetchAll();
    let users = resources as UserRecord[];

    if (search) {
      const s = search.toLowerCase();
      users = users.filter(u => u.name?.toLowerCase().includes(s) || u.email?.toLowerCase().includes(s));
    }

    const total = users.length;
    const start = (page - 1) * limit;
    const paged = users.slice(start, start + limit);
    return { users: paged, total };
  }

  async get(id: string): Promise<UserRecord | null> {
    await this.ensureInit();
    try {
      const { resource } = await this.container.item(id, id).read();
      return (resource as UserRecord) || null;
    } catch {
      return null;
    }
  }

  async create(data: { name: string; email: string; role?: string }): Promise<UserRecord> {
    await this.ensureInit();
    const now = new Date().toISOString();
    const user: UserRecord = {
      id: uuid(),
      name: data.name,
      email: data.email,
      role: data.role || 'user',
      createdAt: now,
      updatedAt: now
    };
    await this.container.items.create({ ...user, _partitionKey: user.id });
    return user;
  }

  async update(id: string, updates: Partial<Pick<UserRecord, 'name' | 'email' | 'role'>>): Promise<UserRecord | null> {
    await this.ensureInit();
    const existing = await this.get(id);
    if (!existing) return null;
    const updated: UserRecord = { ...existing, ...updates, updatedAt: new Date().toISOString() };
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

export default UserRepository.getInstance();
