/**
 * Database Connection Service
 * Manages pooled connections to Azure SQL Database
 */

import { ConnectionPool, Request, config as MSSQLConfig } from 'mssql';
import { azureConfig } from '../lib/azure-config';

interface DatabaseConfig {
  server: string;
  database: string;
  authentication?: {
    type: 'default' | 'azure-active-directory-msi-app-service' | 'azure-active-directory-access-token';
    options?: {
      userName?: string;
      password?: string;
      token?: string;
    };
  };
  options?: {
    encrypt?: boolean;
    trustServerCertificate?: boolean;
    connectTimeout?: number;
    requestTimeout?: number;
  };
  pool?: {
    max?: number;
    min?: number;
    idleTimeoutMillis?: number;
    acquireTimeoutMillis?: number;
  };
}

class DatabaseService {
  private pool: ConnectionPool | null = null;
  private config: MSSQLConfig;
  private isConnecting = false;

  constructor() {
    const azureConf = azureConfig.getConfig();
    
    this.config = {
      server: azureConf.sqlServer,
      database: azureConf.sqlDatabase,
      authentication: {
        type: 'default',
        options: {
          userName: azureConf.sqlUsername,
          password: azureConf.sqlPassword,
        }
      },
      options: {
        encrypt: true,
        trustServerCertificate: false,
        connectTimeout: 30000,
        requestTimeout: 30000,
      },
      pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000,
        acquireTimeoutMillis: 60000,
      }
    };
  }

  /**
   * Initialize connection pool
   */
  private async initializePool(): Promise<ConnectionPool> {
    if (this.pool && this.pool.connected) {
      return this.pool;
    }

    if (this.isConnecting) {
      // Wait for existing connection attempt
      while (this.isConnecting) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      if (this.pool && this.pool.connected) {
        return this.pool;
      }
    }

    this.isConnecting = true;

    try {
      console.log('Initializing database connection pool...');
      
      this.pool = new ConnectionPool(this.config);
      
      // Handle pool events
      this.pool.on('connect', () => {
        console.log('Database pool connected');
      });

      this.pool.on('error', (err) => {
        console.error('Database pool error:', err);
      });

      await this.pool.connect();
      console.log('Database connection pool initialized successfully');
      
      return this.pool;
    } catch (error) {
      console.error('Failed to initialize database pool:', error);
      throw error;
    } finally {
      this.isConnecting = false;
    }
  }

  /**
   * Get a database request instance
   */
  async getRequest(): Promise<Request> {
    const pool = await this.initializePool();
    return pool.request();
  }

  /**
   * Execute a query with parameters
   */
  async query<T = any>(sql: string, params?: Record<string, any>): Promise<T[]> {
    try {
      const request = await this.getRequest();
      
      // Add parameters if provided
      if (params) {
        for (const [key, value] of Object.entries(params)) {
          request.input(key, value);
        }
      }

      const result = await request.query(sql);
      return result.recordset as T[];
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  }

  /**
   * Execute a single row query
   */
  async queryOne<T = any>(sql: string, params?: Record<string, any>): Promise<T | null> {
    const results = await this.query<T>(sql, params);
    return results.length > 0 ? results[0] : null;
  }

  /**
   * Execute a parameterized query (stored procedure)
   */
  async execute<T = any>(procedure: string, params?: Record<string, any>): Promise<T[]> {
    try {
      const request = await this.getRequest();
      
      // Add parameters if provided
      if (params) {
        for (const [key, value] of Object.entries(params)) {
          request.input(key, value);
        }
      }

      const result = await request.execute(procedure);
      return result.recordset as T[];
    } catch (error) {
      console.error('Database procedure execution error:', error);
      throw error;
    }
  }

  /**
   * Begin a transaction
   */
  async beginTransaction(): Promise<Transaction> {
    const pool = await this.initializePool();
    const transaction = pool.transaction();
    await transaction.begin();
    return new Transaction(transaction);
  }

  /**
   * Test database connectivity
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.query('SELECT 1 as test');
      return true;
    } catch (error) {
      console.error('Database connection test failed:', error);
      return false;
    }
  }

  /**
   * Get connection pool statistics
   */
  getPoolStats() {
    if (!this.pool) {
      return null;
    }

    return {
      connected: this.pool.connected,
      connecting: this.pool.connecting,
    };
  }

  /**
   * Close the connection pool
   */
  async close(): Promise<void> {
    if (this.pool) {
      await this.pool.close();
      this.pool = null;
      console.log('Database connection pool closed');
    }
  }
}

/**
 * Transaction wrapper class
 */
class Transaction {
  constructor(private transaction: any) {}

  /**
   * Get a request instance for this transaction
   */
  request(): Request {
    return this.transaction.request();
  }

  /**
   * Execute query within transaction
   */
  async query<T = any>(sql: string, params?: Record<string, any>): Promise<T[]> {
    try {
      const request = this.request();
      
      if (params) {
        for (const [key, value] of Object.entries(params)) {
          request.input(key, value);
        }
      }

      const result = await request.query(sql);
      return result.recordset as T[];
    } catch (error) {
      console.error('Transaction query error:', error);
      throw error;
    }
  }

  /**
   * Commit the transaction
   */
  async commit(): Promise<void> {
    await this.transaction.commit();
  }

  /**
   * Rollback the transaction
   */
  async rollback(): Promise<void> {
    await this.transaction.rollback();
  }
}

// Create singleton instance
export const databaseService = new DatabaseService();

// Export types
export type { DatabaseConfig, Transaction };
export { DatabaseService };

// Graceful shutdown handling
process.on('SIGINT', async () => {
  console.log('Received SIGINT, closing database connections...');
  await databaseService.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Received SIGTERM, closing database connections...');
  await databaseService.close();
  process.exit(0);
});
