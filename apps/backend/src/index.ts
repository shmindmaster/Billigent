import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { logger } from './utils/logger';
import { metricsMiddleware } from './middleware/metrics';

// Import routes
import strategyRoutes from './routes/strategy';
import fhirRoutes from './routes/fhir';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(metricsMiddleware);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    method: req.method,
    path: req.path,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  });
  next();
});

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'billigent-backend',
    version: '1.0.0'
  });
});

// API routes
app.use('/api/strategy', strategyRoutes);
app.use('/api/fhir', fhirRoutes);

// Root endpoint
app.get('/', (_req, res) => {
  res.json({
    message: 'Billigent Backend API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      strategy: '/api/strategy',
      fhir: '/api/fhir'
    },
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled error:', err);
  
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (_req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    message: 'The requested endpoint does not exist',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  logger.info(`🚀 Billigent Backend server running on port ${PORT}`);
  logger.info(`📊 Health check: http://localhost:${PORT}/health`);
  logger.info(`🔍 Strategy API: http://localhost:${PORT}/api/strategy`);
  logger.info(`🏥 FHIR API: http://localhost:${PORT}/api/fhir`);
});

export default app;

