import express from "express";
import dotenv from "dotenv";
import { initSentry, Sentry } from "./sentry";
import PrismaService from "./services/prisma.service";

dotenv.config();
initSentry();

const app: express.Express = express();

// Performance optimizations
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Enable CORS for local dev with proper timeout handling
import cors from 'cors';
app.use(cors({ 
  origin: 'http://localhost:5173', 
  credentials: false,
  optionsSuccessStatus: 200
}));

// Request timeout middleware (15 seconds max)
app.use((req, res, next) => {
  const timeout = setTimeout(() => {
    res.status(408).json({ 
      error: 'Request timeout', 
      message: 'Request took too long to process' 
    });
  }, 15000);

  res.on('finish', () => clearTimeout(timeout));
  res.on('close', () => clearTimeout(timeout));
  next();
});

// Attach Sentry handlers if client present (single module instance via ./sentry export)
if (Sentry.getCurrentHub().getClient()) {
  // Express request/tracing handlers updated for Sentry 8.x (Handlers namespace removed from types)
  // Use the middleware functions exported directly from @sentry/node when available.
  // Fallback to no-op if middleware signatures change.
  try {
    // @ts-ignore - runtime feature detection
    const { requestHandler, tracingHandler } = (Sentry as any);
    if (typeof requestHandler === 'function') {
      app.use(requestHandler());
    }
    if (typeof tracingHandler === 'function') {
      app.use(tracingHandler());
    }
  } catch {
    console.warn('Sentry middleware not applied');
  }
}

const PORT = process.env.PORT || 3001;

// Import citation routes
import citationMetricsRoutes from "./routes/citationMetrics";
import denialsRoutes from "./routes/denials";

// Health check with timeout
app.get("/health", async (_req, res) => {
  try {
    const healthCheck = await Promise.race([
      Promise.resolve({ status: "healthy", ts: new Date().toISOString() }),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Health check timeout')), 5000)
      )
    ]);
    res.json(healthCheck);
  } catch (error) {
    res.status(503).json({ 
      status: "unhealthy", 
      error: error instanceof Error ? error.message : 'Unknown error',
      ts: new Date().toISOString() 
    });
  }
});

// Ready check with comprehensive health monitoring
app.get("/ready", async (_req, res) => {
  try {
    const healthCheck = await Promise.race([
      Promise.all([
        PrismaService.healthCheck(),
        (async () => {
          try {
            // Use require to avoid TS module resolution complaints in NodeNext mode for optional dependency
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const svc = require('./services/azureCosmos.service');
            return svc.azureCosmosService.healthCheck();
          } catch (e) {
            return {
              status: "unavailable",
              database: "billigent",
              containers: [],
              connectionTime: 0,
            };
          }
        })(),
      ]),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Ready check timeout')), 10000)
      )
    ]);

    const [db, cosmos] = healthCheck;
    const allHealthy = db.connected && cosmos.status === "healthy";
    
    res.status(allHealthy ? 200 : 503).json({
      status: allHealthy ? "ready" : "degraded",
      db,
      cosmos,
      release: process.env.APP_RELEASE || "local",
      commit: process.env.GIT_COMMIT || null,
      ts: new Date().toISOString(),
    });
  } catch (error) {
    res.status(503).json({
      status: "error",
      error: error instanceof Error ? error.message : 'Ready check failed',
      ts: new Date().toISOString(),
    });
  }
});

app.get("/", (_req, res) => {
  res.json({
    message: "Billigent Backend API",
    version: "1.0.0",
    endpoints: {
      health: "/health",
      ready: "/ready",
      citationMetrics: "/api/citation-metrics",
      denials: "/api/denials",
      fhir: "/api/fhir",
      debugSentry: "/debug-sentry",
    },
  });
});

// Intentionally throw an error to generate a Sentry issue (remove or guard in production)
app.get("/debug-sentry", (_req, _res, next) => {
  try {
    throw new Error("Manual test error for Sentry verification");
  } catch (e) {
    next(e);
  }
});

// Register routes with error handling
app.use("/api/citation-metrics", citationMetricsRoutes);
app.use("/api/denials", denialsRoutes);
// Dev RAG (speed over security) - DO NOT ENABLE IN PROD
import devRagRoutes from './routes/devRag';
app.use('/api/dev-rag', devRagRoutes);
// Physician Queries
import physicianQueriesRoutes from './routes/physicianQueries';
app.use('/api/physician-queries', physicianQueriesRoutes);
// FHIR routes
import fhirRoutes from './routes/fhir';
app.use('/api/fhir', fhirRoutes);

// Sentry error handler must come after routes if initialized
if (Sentry.getCurrentHub().getClient()) {
  try {
    // @ts-ignore
    const { errorHandler } = (Sentry as any);
    if (typeof errorHandler === 'function') {
      app.use(errorHandler());
    }
  } catch {
    console.warn('Sentry error handler not applied');
  }
}

// Enhanced error handler with timeout detection
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("Unhandled error", err);
    
    // Check if it's a timeout error
    if (err.code === 'ETIMEDOUT' || err.message?.includes('timeout')) {
      return res.status(408).json({ 
        error: "Request timeout", 
        message: "The operation took too long to complete",
        timestamp: new Date().toISOString()
      });
    }
    
    // Check if it's a connection error
    if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND') {
      return res.status(503).json({ 
        error: "Service unavailable", 
        message: "Backend service is not available",
        timestamp: new Date().toISOString()
      });
    }
    
    res.status(500).json({ 
      error: "Internal Server Error",
      message: process.env.NODE_ENV === 'development' ? err.message : 'An unexpected error occurred',
      timestamp: new Date().toISOString()
    });
  }
);

// 404 handler for unmatched routes
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`,
    timestamp: new Date().toISOString()
  });
});

// Only listen when invoked directly
if (require.main === module) {
  (async () => {
    // Attempt baseline seeding check (non-blocking for failures)
    try {
      const { ensureSeeded } = await import('./startup/ensureSeeded');
      await ensureSeeded();
    } catch (e) {
      console.warn('[startup] ensureSeeded not executed:', e instanceof Error ? e.message : e);
    }
    
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`✅ Ready check: http://localhost:${PORT}/ready`);
    });
    
    // Graceful shutdown handling
    process.on('SIGTERM', () => {
      console.log('SIGTERM received, shutting down gracefully');
      server.close(() => {
        console.log('Process terminated');
        process.exit(0);
      });
    });
    
    process.on('SIGINT', () => {
      console.log('SIGINT received, shutting down gracefully');
      server.close(() => {
        console.log('Process terminated');
        process.exit(0);
      });
    });
  })();
}

export default app;
