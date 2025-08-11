/**
 * Centralized Prisma Client Service
 * 
 * Provides a singleton instance of PrismaClient for the entire application.
 * Includes proper error handling, logging configuration, and graceful shutdown.
 */

import { PrismaClient } from '@billigent/database';

class PrismaService {
  private static instance: PrismaClient;

  /**
   * Gets the singleton PrismaClient instance
   */
  public static getInstance(): PrismaClient {
    if (!PrismaService.instance) {
      PrismaService.instance = new PrismaClient({
        log: process.env.NODE_ENV === 'development' 
          ? ['query', 'info', 'warn', 'error'] 
          : ['error'],
        errorFormat: 'pretty',
      });
    }

    return PrismaService.instance;
  }

  /**
   * Gracefully disconnects the Prisma client
   */
  public static async disconnect(): Promise<void> {
    if (PrismaService.instance) {
      await PrismaService.instance.$disconnect();
    }
  }

  /**
   * Tests the database connection
   */
  public static async testConnection(): Promise<boolean> {
    try {
      const client = PrismaService.getInstance();
      await client.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      console.error('Database connection test failed:', error);
      return false;
    }
  }

  /**
   * Health check for the database
   */
  public static async healthCheck(): Promise<{ status: string; timestamp: string; connected: boolean }> {
    const connected = await PrismaService.testConnection();
    return {
      status: connected ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      connected
    };
  }
}

// Export the singleton instance for direct use
export const prisma = PrismaService.getInstance();

// Export the service class for advanced usage
export default PrismaService;

// Export types for convenience
export type { PrismaClient } from '@billigent/database';
