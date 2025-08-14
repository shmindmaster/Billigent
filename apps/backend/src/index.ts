import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { logger } from "./utils/logger";
import { metricsMiddleware } from "./middleware/metrics";

// Routes
import strategyRoutes from "./routes/strategy";
import citationMetricsRoutes from "./routes/citationMetrics";
import citationCoverageRoutes from "./routes/citationCoverage";
import fhirRoutes from "./routes/fhir";
import databaseRoutes from "./routes/database";

dotenv.config();

const app: express.Express = express();
const PORT = process.env.PORT || 3001;

// Core middleware
app.use(cors());
app.use(metricsMiddleware);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Lightweight request log (avoid heavy sync ops)
app.use((req, _res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    m: req.method,
    p: req.path,
    ua: req.get("User-Agent"),
  });
  next();
});

app.get("/health", (_req, res) => {
  res.json({ status: "healthy", ts: new Date().toISOString() });
});

app.use("/api/strategy", strategyRoutes);
app.use("/api/strategy", citationCoverageRoutes); // legacy lightweight metrics endpoint
app.use("/api/strategy", citationMetricsRoutes); // extended analytics endpoints
app.use("/api/fhir", fhirRoutes);
app.use("/api/database", databaseRoutes);

app.get("/", (_req, res) => {
  res.json({
    message: "Billigent Backend API",
    version: "1.0.0",
    endpoints: {
      health: "/health",
      strategy: "/api/strategy",
      fhir: "/api/fhir",
      database: "/api/database",
    },
  });
});

// Error handler
app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    logger.error("Unhandled error", err);
    res.status(500).json({
      error: "Internal server error",
      msg:
        process.env.NODE_ENV === "development"
          ? err.message
          : "Something went wrong",
    });
  }
);

// 404
app.use("*", (_req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// Only listen when invoked directly
if (require.main === module) {
  app.listen(PORT, () => {
    logger.info(`🚀 Server on ${PORT}`);
  });
}

export default app;
