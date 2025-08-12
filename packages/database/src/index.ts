// Database package entry point
export { PrismaClient } from './generated/prisma';
export type { Prisma } from './generated/prisma';

// Default export for the database client
import { PrismaClient } from './generated/prisma';

export const db = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
});

export default db;
