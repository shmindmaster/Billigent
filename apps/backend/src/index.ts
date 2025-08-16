import express from "express";
import dotenv from "dotenv";
import { log } from "./utils/logger.js";
// Prisma removed

dotenv.config();

const app: express.Express = express();

// Performance optimizations
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Enable CORS for local dev with proper timeout handling
import cors from "cors";
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: false,
    optionsSuccessStatus: 200,
  })
);

// Request timeout middleware (15 seconds max)
app.use((req, res, next) => {
  const timeout = setTimeout(() => {
    res.status(408).json({
      error: "Request timeout",
      message: "Request took too long to process",
    });
  }, 15000);

  res.on("finish", () => clearTimeout(timeout));
  res.on("close", () => clearTimeout(timeout));
  next();
});

const PORT = process.env.PORT || 3001;

// Import citation routes
import citationMetricsRoutes from "./routes/citationMetrics.js";
import denialsRoutes from "./routes/denials.js";
// CDI routes
import cdiRoutes from "./routes/cdi.js";
// Dev RAG (speed over security) - DO NOT ENABLE IN PROD
import devRagRoutes from "./routes/devRag.js";
// Physician Queries
import physicianQueriesRoutes from "./routes/physicianQueries.js";
// FHIR routes
import fhirRoutes from "./routes/fhir.js";

// Health check with timeout
app.get("/health", async (_req, res) => {
  try {
    const healthCheck = await Promise.race([
      Promise.resolve({ status: "healthy", ts: new Date().toISOString() }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Health check timeout")), 5000)
      ),
    ]);
    res.json(healthCheck);
  } catch (error) {
    res.status(503).json({
      status: "unhealthy",
      error: error instanceof Error ? error.message : "Unknown error",
      ts: new Date().toISOString(),
    });
  }
});

// Ready check with comprehensive health monitoring
app.get("/ready", async (_req, res) => {
  try {
    const healthCheck = await Promise.race([
      Promise.all([
        // Prisma removed: placeholder health result
        Promise.resolve({
          status: "removed",
          timestamp: new Date().toISOString(),
          connected: false,
        }),
        (async () => {
          try {
            // Use require to avoid TS module resolution complaints in NodeNext mode for optional dependency
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const svc = require("./services/azureCosmos.service");
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
        setTimeout(() => reject(new Error("Ready check timeout")), 10000)
      ),
    ]);

    const arr = healthCheck as Array<{
      status: string;
      timestamp?: string;
      connected?: boolean;
      database?: string;
      containers?: string[];
      connectionTime?: number;
    }>;
    const db = arr[0];
    const cosmos = arr[1];
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
      error: error instanceof Error ? error.message : "Ready check failed",
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
    },
  });
});

// Register routes with error handling
app.use("/api/citation-metrics", citationMetricsRoutes);
app.use("/api/denials", denialsRoutes);
app.use("/api/cdi", cdiRoutes);
// Dev RAG (speed over security) - DO NOT ENABLE IN PROD
app.use("/api/dev-rag", devRagRoutes);
// Physician Queries
app.use("/api/physician-queries", physicianQueriesRoutes);
// FHIR routes
app.use("/api/fhir", fhirRoutes);

// Simple error handler for rapid prototyping
app.use(
  (
    err: Error & { code?: string },
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    log.error("Unhandled error", { error: err.message, stack: err.stack, url: req.url });

    // Check if it's a timeout error
    if (err.code === "ETIMEDOUT" || err.message?.includes("timeout")) {
      return res.status(408).json({
        error: "Request timeout",
        message: "The operation took too long to complete",
        timestamp: new Date().toISOString(),
      });
    }

    // Check if it's a connection error
    if (err.code === "ECONNREFUSED" || err.code === "ENOTFOUND") {
      return res.status(503).json({
        error: "Service unavailable",
        message: "Backend service is not available",
        timestamp: new Date().toISOString(),
      });
    }

    res.status(500).json({
      error: "Internal Server Error",
      message: err.message || "An unexpected error occurred",
      timestamp: new Date().toISOString(),
    });
  }
);

// 404 handler for unmatched routes
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: `Route ${req.originalUrl} not found`,
    timestamp: new Date().toISOString(),
  });
});

// Only listen when invoked directly
if (require.main === module) {
  (async () => {
    // Attempt baseline seeding check (non-blocking for failures)
    try {
      const { ensureSeeded } = await import("./startup/ensureSeeded.js");
      await ensureSeeded();
    } catch (e) {
      log.warn("ensureSeeded not executed", { error: e instanceof Error ? e.message : e });
    }

    const server = app.listen(PORT, () => {
      log.info("Server started successfully", { port: PORT });
      log.info("Health check available", { url: `http://localhost:${PORT}/health` });
      log.info("Ready check available", { url: `http://localhost:${PORT}/ready` });
    });

    // Graceful shutdown handling
    process.on("SIGTERM", () => {
      log.info("SIGTERM received, shutting down gracefully");
      server.close(() => {
        log.info("Process terminated");
        process.exit(0);
      });
    });

    process.on("SIGINT", () => {
      log.info("SIGINT received, shutting down gracefully");
      server.close(() => {
        log.info("Process terminated");
        process.exit(0);
      });
    });
  })();
}

export default app;
