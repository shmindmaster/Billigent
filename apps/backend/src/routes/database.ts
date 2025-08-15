/**
 * Database routes for Azure SQL Database and Cosmos DB operations
 * Handles operational working sets, evidence bundles, attribution tracking, and collaboration
 */
import express from "express";
import { CosmosClient } from "@azure/cosmos";

const router = express.Router();

// Initialize Cosmos DB client
const cosmosClient = new CosmosClient({
  endpoint: process.env.AZURE_COSMOS_ENDPOINT || "",
  key: process.env.AZURE_COSMOS_KEY || "",
});

const database = cosmosClient.database(process.env.AZURE_COSMOS_DATABASE || "billigent");

// Initialize database schema
async function initializeSchema() {
  try {
    // Create containers if they don't exist
    const containers = [
      { id: "denial_patterns", partitionKey: "/id" },
      { id: "appeal_cases", partitionKey: "/id" },
      { id: "kpi_metrics", partitionKey: "/category" },
      { id: "evidence_bundles", partitionKey: "/id" },
      { id: "attribution_tracking", partitionKey: "/bundleId" },
      { id: "document_versions", partitionKey: "/documentId" },
      { id: "collaboration_sessions", partitionKey: "/caseId" }
    ];

    for (const container of containers) {
      try {
        await database.containers.createIfNotExists(container);
        console.log(`Container ${container.id} ready`);
      } catch (error) {
        console.error(`Failed to create container ${container.id}:`, error);
      }
    }
  } catch (error) {
    console.error("Failed to initialize Cosmos DB schema:", error);
    throw error;
  }
}

// Store denial pattern
async function storeDenialPattern(pattern: any) {
  try {
    const container = database.container("denial_patterns");
    const result = await container.items.upsert(pattern);
    return result.resource;
  } catch (error) {
    console.error("Failed to store denial pattern:", error);
    throw error;
  }
}

// Get denial patterns by diagnosis codes
async function getDenialPatternsByCodes(codes: string[]) {
  try {
    const container = database.container("denial_patterns");
    const query = {
      query: "SELECT * FROM c WHERE ARRAY_CONTAINS(@codes, c.diagnosis_codes)",
      parameters: [{ name: "@codes", value: codes }]
    };
    
    const { resources } = await container.items.query(query).fetchAll();
    return resources;
  } catch (error) {
    console.error("Failed to get denial patterns:", error);
    throw error;
  }
}

// Store appeal case
async function storeAppealCase(appealCase: any) {
  try {
    const container = database.container("appeal_cases");
    const result = await container.items.upsert(appealCase);
    return result.resource;
  } catch (error) {
    console.error("Failed to store appeal case:", error);
    throw error;
  }
}

// Update appeal case status
async function updateAppealCaseStatus(
  id: string,
  status: string,
  outcome?: string,
  recoveryAmount?: number
) {
  try {
    const container = database.container("appeal_cases");
    const item = container.item(id, id);
    
    const { resource } = await item.read();
    if (resource) {
      resource.appeal_status = status;
      if (outcome) resource.outcome = outcome;
      if (recoveryAmount) resource.recovery_amount = recoveryAmount;
      resource.updated_at = new Date().toISOString();
      
      const result = await item.replace(resource);
      return result.resource;
    }
    throw new Error("Appeal case not found");
  } catch (error) {
    console.error("Failed to update appeal case status:", error);
    throw error;
  }
}

// Get appeal cases by patient
async function getAppealCasesByPatient(patientId: string) {
  try {
    const container = database.container("appeal_cases");
    const query = {
      query: "SELECT * FROM c WHERE c.patient_id = @patientId",
      parameters: [{ name: "@patientId", value: patientId }]
    };
    
    const { resources } = await container.items.query(query).fetchAll();
    return resources;
  } catch (error) {
    console.error("Failed to get appeal cases by patient:", error);
    throw error;
  }
}

// Calculate real-time KPIs
async function calculateRealTimeKPIs() {
  try {
    const appealContainer = database.container("appeal_cases");
    const patternContainer = database.container("denial_patterns");
    
    // Get appeal statistics
    const appealQuery = "SELECT VALUE COUNT(1) FROM c WHERE c.appeal_status = 'decided'";
    const { resources: appealCount } = await appealContainer.items.query(appealQuery).fetchAll();
    
    // Get denial pattern statistics
    const patternQuery = "SELECT VALUE COUNT(1) FROM c";
    const { resources: patternCount } = await patternContainer.items.query(patternQuery).fetchAll();
    
    return {
      totalAppeals: appealCount[0] || 0,
      totalDenialPatterns: patternCount[0] || 0,
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error("Failed to calculate real-time KPIs:", error);
    throw error;
  }
}

// Store KPI metric
async function storeKPIMetric(metric: any) {
  try {
    const container = database.container("kpi_metrics");
    const result = await container.items.upsert(metric);
    return result.resource;
  } catch (error) {
    console.error("Failed to store KPI metric:", error);
    throw error;
  }
}

// Get KPI metrics by category and time period
async function getKPIMetrics(category: string, timePeriod: string, limit: number = 100) {
  try {
    const container = database.container("kpi_metrics");
    const query = {
      query: "SELECT * FROM c WHERE c.category = @category AND c.time_period = @timePeriod ORDER BY c.timestamp DESC OFFSET 0 LIMIT @limit",
      parameters: [
        { name: "@category", value: category },
        { name: "@timePeriod", value: timePeriod },
        { name: "@limit", value: limit }
      ]
    };
    
    const { resources } = await container.items.query(query).fetchAll();
    return resources;
  } catch (error) {
    console.error("Failed to get KPI metrics:", error);
    throw error;
  }
}

// Store evidence bundle
async function storeEvidenceBundle(bundle: any) {
  try {
    const container = database.container("evidence_bundles");
    const result = await container.items.upsert(bundle);
    return result.resource;
  } catch (error) {
    console.error("Failed to store evidence bundle:", error);
    throw error;
  }
}

// Get evidence bundle by ID
async function getEvidenceBundle(id: string, patientId: string) {
  try {
    const container = database.container("evidence_bundles");
    const item = container.item(id, id);
    const { resource } = await item.read();
    return resource;
  } catch (error) {
    console.error("Failed to get evidence bundle:", error);
    throw error;
  }
}

// Get evidence bundles by patient
async function getEvidenceBundlesByPatient(patientId: string) {
  try {
    const container = database.container("evidence_bundles");
    const query = {
      query: "SELECT * FROM c WHERE c.patient_id = @patientId ORDER BY c.created_at DESC",
      parameters: [{ name: "@patientId", value: patientId }]
    };
    
    const { resources } = await container.items.query(query).fetchAll();
    return resources;
  } catch (error) {
    console.error("Failed to get evidence bundles by patient:", error);
    throw error;
  }
}

// Store attribution tracking
async function storeAttributionTracking(attribution: any) {
  try {
    const container = database.container("attribution_tracking");
    const result = await container.items.upsert(attribution);
    return result.resource;
  } catch (error) {
    console.error("Failed to store attribution tracking:", error);
    throw error;
  }
}

// Update attribution verification status
async function updateAttributionVerification(bundleId: string, status: string, checksum?: string) {
  try {
    const container = database.container("attribution_tracking");
    const item = container.item(bundleId, bundleId);
    
    const { resource } = await item.read();
    if (resource) {
      resource.verification_status = status;
      if (checksum) resource.checksum = checksum;
      resource.updated_at = new Date().toISOString();
      
      const result = await item.replace(resource);
      return result.resource;
    }
    throw new Error("Attribution tracking not found");
  } catch (error) {
    console.error("Failed to update attribution verification:", error);
    throw error;
  }
}

// Store document version
async function storeDocumentVersion(version: any) {
  try {
    const container = database.container("document_versions");
    const result = await container.items.upsert(version);
    return result.resource;
  } catch (error) {
    console.error("Failed to store document version:", error);
    throw error;
  }
}

// Get document versions by document ID
async function getDocumentVersions(documentId: string) {
  try {
    const container = database.container("document_versions");
    const query = {
      query: "SELECT * FROM c WHERE c.document_id = @documentId ORDER BY c.version_number DESC",
      parameters: [{ name: "@documentId", value: documentId }]
    };
    
    const { resources } = await container.items.query(query).fetchAll();
    return resources;
  } catch (error) {
    console.error("Failed to get document versions:", error);
    throw error;
  }
}

// Store collaboration session
async function storeCollaborationSession(session: any) {
  try {
    const container = database.container("collaboration_sessions");
    const result = await container.items.upsert(session);
    return result.resource;
  } catch (error) {
    console.error("Failed to store collaboration session:", error);
    throw error;
  }
}

// Update collaboration session
async function updateCollaborationSession(sessionId: string, updates: any) {
  try {
    const container = database.container("collaboration_sessions");
    const item = container.item(sessionId, sessionId);
    
    const { resource } = await item.read();
    if (resource) {
      Object.assign(resource, updates);
      resource.updated_at = new Date().toISOString();
      
      const result = await item.replace(resource);
      return result.resource;
    }
    throw new Error("Collaboration session not found");
  } catch (error) {
    console.error("Failed to update collaboration session:", error);
    throw error;
  }
}

// Add collaboration activity
async function addCollaborationActivity(sessionId: string, activity: any) {
  try {
    const container = database.container("collaboration_sessions");
    const item = container.item(sessionId, sessionId);
    
    const { resource } = await item.read();
    if (resource) {
      if (!resource.activities) resource.activities = [];
      resource.activities.push({
        ...activity,
        timestamp: new Date().toISOString()
      });
      resource.updated_at = new Date().toISOString();
      
      const result = await item.replace(resource);
      return result.resource;
    }
    throw new Error("Collaboration session not found");
  } catch (error) {
    console.error("Failed to add collaboration activity:", error);
    throw error;
  }
}

// Get collaboration session by ID
async function getCollaborationSession(sessionId: string) {
  try {
    const container = database.container("collaboration_sessions");
    const item = container.item(sessionId, sessionId);
    const { resource } = await item.read();
    return resource;
  } catch (error) {
    console.error("Failed to get collaboration session:", error);
    throw error;
  }
}

// Get active collaboration sessions by case ID
async function getActiveCollaborationSessions(caseId: string) {
  try {
    const container = database.container("collaboration_sessions");
    const query = {
      query: "SELECT * FROM c WHERE c.case_id = @caseId AND c.status = 'active' ORDER BY c.created_at DESC",
      parameters: [{ name: "@caseId", value: caseId }]
    };
    
    const { resources } = await container.items.query(query).fetchAll();
    return resources;
  } catch (error) {
    console.error("Failed to get active collaboration sessions:", error);
    throw error;
  }
}

// Check Cosmos DB health
async function checkCosmosHealth() {
  try {
    const { resource: db } = await database.read();
    return {
      status: "healthy",
      database: db?.id || "unknown",
      lastCheck: new Date().toISOString()
    };
  } catch (error) {
    console.error("Cosmos DB health check failed:", error);
    return {
      status: "unhealthy",
      error: error instanceof Error ? error.message : "Unknown error",
      lastCheck: new Date().toISOString()
    };
  }
}

// Check overall database health
async function checkOverallHealth() {
  try {
    const cosmosHealth = await checkCosmosHealth();
    
    return {
      overall: cosmosHealth.status === "healthy" ? "healthy" : "degraded",
      cosmos: cosmosHealth,
      lastCheck: new Date().toISOString()
    };
  } catch (error) {
    console.error("Overall health check failed:", error);
    return {
      overall: "unhealthy",
      error: error instanceof Error ? error.message : "Unknown error",
      lastCheck: new Date().toISOString()
    };
  }
}

// Get connection status
async function getConnectionStatus() {
  try {
    const cosmosHealth = await checkCosmosHealth();
    
    return {
      cosmos: cosmosHealth.status,
      overall: cosmosHealth.status === "healthy" ? "healthy" : "unhealthy",
      lastCheck: new Date().toISOString()
    };
  } catch (error) {
    console.error("Connection status check failed:", error);
    return {
      cosmos: "unhealthy",
      overall: "unhealthy",
      error: error instanceof Error ? error.message : "Unknown error",
      lastCheck: new Date().toISOString()
    };
  }
}

// Initialize all databases
async function initializeAll() {
  try {
    await initializeSchema();
    return { success: true, message: "All databases initialized successfully" };
  } catch (error) {
    console.error("Failed to initialize all databases:", error);
    throw error;
  }
}

// Health check endpoint
router.get("/health", async (req, res) => {
  try {
    const health = await checkOverallHealth();
    res.json(health);
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

// Initialize schema endpoint
router.post("/init", async (req, res) => {
  try {
    await initializeSchema();
    res.json({ success: true, message: "Database schema initialized successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

// Store denial pattern endpoint
router.post("/denial-patterns", async (req, res) => {
  try {
    const pattern = req.body;
    const result = await storeDenialPattern(pattern);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

// Get denial patterns by codes endpoint
router.get("/denial-patterns/by-codes", async (req, res) => {
  try {
    const { codes } = req.query;
    if (!codes || !Array.isArray(codes)) {
      return res.status(400).json({ success: false, message: "Codes parameter is required and must be an array" });
    }
    
    const patterns = await getDenialPatternsByCodes(codes as string[]);
    res.json({ success: true, data: patterns });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

// Store appeal case endpoint
router.post("/appeal-cases", async (req, res) => {
  try {
    const appealCase = req.body;
    const result = await storeAppealCase(appealCase);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

// Update appeal case status endpoint
router.patch("/appeal-cases/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status, outcome, recoveryAmount } = req.body;
    
    const result = await updateAppealCaseStatus(id, status, outcome, recoveryAmount);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

// Get appeal cases by patient endpoint
router.get("/appeal-cases/patient/:patientId", async (req, res) => {
  try {
    const { patientId } = req.params;
    const cases = await getAppealCasesByPatient(patientId);
    res.json({ success: true, data: cases });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

// Get real-time KPIs endpoint
router.get("/kpis/real-time", async (req, res) => {
  try {
    const kpis = await calculateRealTimeKPIs();
    res.json({ success: true, data: kpis });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

// Store KPI metric endpoint
router.post("/kpis/metrics", async (req, res) => {
  try {
    const metric = req.body;
    const result = await storeKPIMetric(metric);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

// Get KPI metrics endpoint
router.get("/kpis/metrics", async (req, res) => {
  try {
    const { category, timePeriod, limit } = req.query;
    if (!category || !timePeriod) {
      return res.status(400).json({ success: false, message: "Category and timePeriod parameters are required" });
    }
    
    const metrics = await getKPIMetrics(
      category as string,
      timePeriod as string,
      limit ? parseInt(limit as string) : 100
    );
    res.json({ success: true, data: metrics });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

// Health check endpoint for compatibility
router.get("/health-check", async (req, res) => {
  try {
    const health = await checkOverallHealth();
    res.json(health);
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

export default router;
