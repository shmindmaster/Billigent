// Database package entry point
export { PrismaClient } from '@prisma/client';
export type { Prisma } from '@prisma/client';

// Default export for the database client
import { PrismaClient } from '@prisma/client';

export const db = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
});

export default db;
