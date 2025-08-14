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
  app.use(Sentry.Handlers.requestHandler());
  app.use(Sentry.Handlers.tracingHandler());
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
        const svc = await import("./services/azureCosmos.service");
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

// Sentry error handler must come after routes if initialized
if (Sentry.getCurrentHub().getClient()) {
  app.use(Sentry.Handlers.errorHandler());
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
  app.listen(PORT, () => {
    console.log(`🚀 Server on ${PORT}`);
  });
}

export default app;
