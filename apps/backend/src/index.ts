import express from "express";
import dotenv from "dotenv";
import { initSentry, Sentry } from "./sentry";
import PrismaService from "./services/prisma.service";

dotenv.config();
initSentry();

const app: express.Express = express();
// Enable CORS for local dev
import cors from 'cors';
app.use(cors({ origin: 'http://localhost:5173', credentials: false }));
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
app.use(express.json());
const PORT = process.env.PORT || 3001;

// Import citation routes
import citationMetricsRoutes from "./routes/citationMetrics";
import denialsRoutes from "./routes/denials";

app.get("/health", (_req, res) => {
  res.json({ status: "healthy", ts: new Date().toISOString() });
});

app.get("/ready", async (_req, res) => {
  const [db, cosmos] = await Promise.all([
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
  ]);

  const allHealthy = db.connected && cosmos.status === "healthy";
  res.status(allHealthy ? 200 : 503).json({
    status: allHealthy ? "ready" : "degraded",
    db,
    cosmos,
    release: process.env.APP_RELEASE || "local",
    commit: process.env.GIT_COMMIT || null,
    ts: new Date().toISOString(),
  });
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

// Register routes
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

// Basic fallback error handler
app.use(
  (
    err: any,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error("Unhandled error", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
);

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
    app.listen(PORT, () => {
      console.log(`🚀 Server on ${PORT}`);
    });
  })();
}

export default app;
