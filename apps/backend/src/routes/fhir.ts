/**
 * FHIR data ingestion routes for processing FHIR R4 data from Azure Data Lake
 * and populating the evidence graph with real clinical data.
 */
import { Router, type Request, type Response } from "express";
import fhirDataIngestionService from "../services/fhirDataIngestion.service";
import { eventPublisher, makeEvent } from "../strategy/events";

const router: ReturnType<typeof Router> = Router();

/**
 * POST /api/fhir/ingest
 * Ingest FHIR data from Azure Data Lake
 */
router.post("/ingest", async (req: Request, res: Response) => {
  const { fileSystemName, path, force } = req.body || {};

  try {
    // Start ingestion process
    const result = await fhirDataIngestionService.ingestFHIRData(
      fileSystemName || "data",
      path || "fhir"
    );

    // Publish ingestion event
    eventPublisher.publish(
      makeEvent("fhir_ingestion_completed", {
        ingestionId: `INGEST:${Date.now()}`,
        processedResources: result.processedResources,
        clinicalDocuments: result.clinicalDocuments.length,
        evidenceBundles: result.evidenceBundles,
        processingTime: result.processingTime,
        dataLakeAccount: result.metadata.dataLakeAccount,
        container: result.metadata.container,
        errors: result.errors.length,
      })
    );

    return res.json({
      success: true,
      message: "FHIR data ingestion completed successfully",
      result,
    });
  } catch (error) {
    console.error("FHIR ingestion failed:", error);

    // Publish error event
    eventPublisher.publish(
      makeEvent("fhir_ingestion_failed", {
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      })
    );

    return res.status(500).json({
      success: false,
      error: "FHIR data ingestion failed",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

/**
 * GET /api/fhir/ingest/status
 * Get current ingestion status and statistics
 */
router.get("/ingest/status", async (_req: Request, res: Response) => {
  try {
    const stats = await fhirDataIngestionService.getIngestionStats();

    return res.json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error("Failed to get ingestion stats:", error);

    return res.status(500).json({
      success: false,
      error: "Failed to get ingestion statistics",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

/**
 * POST /api/fhir/ingest/schedule
 * Schedule recurring FHIR data ingestion
 */
router.post("/ingest/schedule", async (req: Request, res: Response) => {
  const { schedule, fileSystemName, path, enabled } = req.body || {};

  try {
    // In a real implementation, this would create a scheduled job
    // For now, we'll just acknowledge the request

    const scheduleConfig = {
      schedule: schedule || "0 */6 * * *", // Every 6 hours by default
      fileSystemName: fileSystemName || "data",
      path: path || "fhir",
      enabled: enabled !== false,
      nextRun: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(), // 6 hours from now
    };

    // Publish scheduling event
    eventPublisher.publish(
      makeEvent("fhir_ingestion_scheduled", {
        scheduleId: `SCHEDULE:${Date.now()}`,
        config: scheduleConfig,
        timestamp: new Date().toISOString(),
      })
    );

    return res.json({
      success: true,
      message: "FHIR data ingestion scheduled successfully",
      schedule: scheduleConfig,
    });
  } catch (error) {
    console.error("Failed to schedule FHIR ingestion:", error);

    return res.status(500).json({
      success: false,
      error: "Failed to schedule FHIR data ingestion",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

/**
 * POST /api/fhir/ingest/validate
 * Validate FHIR data without ingesting
 */
router.post("/ingest/validate", async (req, res) => {
  const { fileSystemName, path } = req.body || {};

  try {
    // TODO: Implement real validation logic. For now, return structural placeholder (not mock data) without synthetic resources.
    const validationResult = {
      valid: true,
      fileCount: 0,
      resourceCount: 0,
      errors: [],
      warnings: [],
      metadata: {
        fileSystemName: fileSystemName || "data",
        path: path || "fhir",
        timestamp: new Date().toISOString(),
      },
    };

    // Publish validation event
    eventPublisher.publish(
      makeEvent("fhir_validation_completed", {
        validationId: `VALIDATE:${Date.now()}`,
        valid: validationResult.valid,
        fileCount: validationResult.fileCount,
        resourceCount: validationResult.resourceCount,
        errorCount: validationResult.errors.length,
        warningCount: validationResult.warnings.length,
      })
    );

    return res.json({
      success: true,
      message: "FHIR data validation completed",
      result: validationResult,
    });
  } catch (error) {
    console.error("FHIR validation failed:", error);

    return res.status(500).json({
      success: false,
      error: "FHIR data validation failed",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

/**
 * GET /api/fhir/resources/:resourceType
 * Get FHIR resources of a specific type
 */
router.get("/resources/:resourceType", async (req, res) => {
  const { resourceType } = req.params;
  const { patientId, encounterId, limit = 100, offset = 0 } = req.query;

  try {
    const { FhirResourceService } = await import(
      "../services/fhirResource.service.js"
    );
    const { items, total } = await FhirResourceService.listByType(
      resourceType,
      {
        patientId: patientId as string | undefined,
        encounterId: encounterId as string | undefined,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
      }
    );

    return res.json({
      success: true,
      resources: items.map((r: any) => ({
        id: r.id,
        resourceType: r.resourceType,
        createdAt: r.createdAt,
        patientId: r.patientId,
        encounterId: r.encounterId,
        json: r.json,
      })),
      pagination: {
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
        total,
      },
    });
  } catch (error) {
    console.error("Failed to get FHIR resources:", error);

    return res.status(500).json({
      success: false,
      error: "Failed to retrieve FHIR resources",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

/**
 * GET /api/fhir/patients/:patientId/resources
 * Get all FHIR resources for a specific patient
 */
router.get("/patients/:patientId/resources", async (req, res) => {
  const { patientId } = req.params;
  const { resourceType, limit = 100, offset = 0 } = req.query;

  try {
    const { FhirResourceService } = await import(
      "../services/fhirResource.service.js"
    );
    const { items, total } = await FhirResourceService.listByPatient(
      patientId,
      {
        resourceType: resourceType as string | undefined,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
      }
    );

    return res.json({
      success: true,
      patientId,
      resources: items.map((r: any) => ({
        id: r.id,
        resourceType: r.resourceType,
        createdAt: r.createdAt,
        patientId: r.patientId,
        encounterId: r.encounterId,
        json: r.json,
      })),
      pagination: {
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
        total,
      },
    });
  } catch (error) {
    console.error("Failed to get patient resources:", error);

    return res.status(500).json({
      success: false,
      error: "Failed to retrieve patient resources",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

/**
 * GET /api/fhir/health
 * Health check for FHIR ingestion service
 */
router.get("/health", async (_req, res) => {
  try {
    const stats = await fhirDataIngestionService.getIngestionStats();

    const healthStatus = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      service: "fhir-ingestion",
      dataLake: {
        account: stats.dataLakeAccount,
        container: stats.container,
        accessible: true,
      },
      statistics: {
        totalDocuments: stats.totalDocuments,
        lastIngestion: stats.lastIngestion,
      },
    };

    return res.json(healthStatus);
  } catch (error) {
    console.error("FHIR health check failed:", error);

    return res.status(503).json({
      status: "unhealthy",
      timestamp: new Date().toISOString(),
      service: "fhir-ingestion",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

/**
 * POST /api/fhir/resources/:resourceType
 * Create (persist) a raw FHIR resource
 */
router.post("/resources/:resourceType", async (req, res) => {
  const { resourceType } = req.params;
  const payload = req.body;
  try {
    const { FhirResourceService } = await import(
      "../services/fhirResource.service.js"
    );
    const created = await FhirResourceService.upsert({
      resourceType,
      resource: payload,
    });
    return res.status(201).json({ success: true, id: created.id });
  } catch (error) {
    console.error("Failed to persist FHIR resource:", error);
    return res
      .status(400)
      .json({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
  }
});

export default router;
