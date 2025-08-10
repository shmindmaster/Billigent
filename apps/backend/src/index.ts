import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@billigent/database';

// Import routes
import caseRoutes from './routes/cases';
import queryRoutes from './routes/queries';
import userRoutes from './routes/users';
import denialRoutes from './routes/denials';
import analyticsRoutes from './routes/analytics';
// Eager import services to validate env at startup when present
import './services/datalake.service';
import './services/responses-api.service';
import './services/rag.service';

// Import middleware
import { errorHandler } from './middleware/errorHandler';
// requestLogger file may be absent; keep optional
let requestLogger: any;
try { requestLogger = require('./middleware/requestLogger').requestLogger; } catch {}

// Load environment variables
dotenv.config();

const app: express.Application = express();
const port = process.env.PORT || 3001;

// Initialize Prisma Client
export const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
if (requestLogger) app.use(requestLogger);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes
app.use('/api/cases', caseRoutes);
app.use('/api/queries', queryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/denials', denialRoutes);
app.use('/api/analytics', analyticsRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing HTTP server');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT signal received: closing HTTP server');
  await prisma.$disconnect();
  process.exit(0);
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Billigent API Server running on http://localhost:${port}`);
  console.log(`📊 Health check available at http://localhost:${port}/health`);
  console.log(`🔗 API endpoints available at http://localhost:${port}/api/*`);
});

export default app;

