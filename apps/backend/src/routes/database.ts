/**
 * Database routes for Azure SQL Database and Cosmos DB operations
 * Handles operational working sets, evidence bundles, attribution tracking, and collaboration
 */
import { Router, type Request, type Response } from 'express';
import azureSqlService from '../services/azureSql.service';
import azureCosmosService from '../services/azureCosmos.service';
import { eventPublisher, makeEvent } from '../strategy/events';

const router: ReturnType<typeof Router> = Router();

// ============================================================================
// AZURE SQL DATABASE ROUTES (Operational Working Sets)
// ============================================================================

/**
 * POST /api/database/sql/init
 * Initialize Azure SQL Database schema
 */
router.post('/sql/init', async (_req: Request, res: Response) => {
  try {
    await azureSqlService.initializeSchema();
    
    // Publish initialization event
    eventPublisher.publish(makeEvent('sql_schema_initialized', {
      timestamp: new Date().toISOString(),
      service: 'azure-sql'
    }));

    return res.json({
      success: true,
      message: 'Azure SQL Database schema initialized successfully'
    });
  } catch (error) {
    console.error('SQL schema initialization failed:', error);
    
    eventPublisher.publish(makeEvent('sql_schema_initialization_failed', {
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }));

    return res.status(500).json({
      success: false,
      error: 'Failed to initialize SQL schema',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/database/sql/denial-patterns
 * Store denial pattern in SQL Database
 */
router.post('/sql/denial-patterns', async (req: Request, res: Response) => {
  try {
    const pattern = req.body;
    await azureSqlService.storeDenialPattern(pattern);
    
    eventPublisher.publish(makeEvent('denial_pattern_stored', {
      patternId: pattern.id,
      timestamp: new Date().toISOString()
    }));

    return res.json({
      success: true,
      message: 'Denial pattern stored successfully'
    });
  } catch (error) {
    console.error('Failed to store denial pattern:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to store denial pattern',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/database/sql/denial-patterns/:codes
 * Get denial patterns by diagnosis codes
 */
router.get('/sql/denial-patterns/:codes', async (req: Request, res: Response) => {
  try {
    const codes = req.params.codes.split(',');
    const patterns = await azureSqlService.getDenialPatternsByCodes(codes);
    
    return res.json({
      success: true,
      patterns
    });
  } catch (error) {
    console.error('Failed to get denial patterns:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve denial patterns',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/database/sql/appeal-cases
 * Store appeal case in SQL Database
 */
router.post('/sql/appeal-cases', async (req: Request, res: Response) => {
  try {
    const appealCase = req.body;
    await azureSqlService.storeAppealCase(appealCase);
    
    eventPublisher.publish(makeEvent('appeal_case_stored', {
      caseId: appealCase.id,
      patientId: appealCase.patientId,
      timestamp: new Date().toISOString()
    }));

    return res.json({
      success: true,
      message: 'Appeal case stored successfully'
    });
  } catch (error) {
    console.error('Failed to store appeal case:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to store appeal case',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * PUT /api/database/sql/appeal-cases/:id/status
 * Update appeal case status
 */
router.put('/sql/appeal-cases/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, outcome, recoveryAmount } = req.body;
    
    await azureSqlService.updateAppealCaseStatus(id, status, outcome, recoveryAmount);
    
    eventPublisher.publish(makeEvent('appeal_case_status_updated', {
      caseId: id,
      status,
      outcome,
      timestamp: new Date().toISOString()
    }));

    return res.json({
      success: true,
      message: 'Appeal case status updated successfully'
    });
  } catch (error) {
    console.error('Failed to update appeal case status:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to update appeal case status',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/database/sql/appeal-cases/patient/:patientId
 * Get appeal cases by patient
 */
router.get('/sql/appeal-cases/patient/:patientId', async (req, res) => {
  try {
    const { patientId } = req.params;
    const cases = await azureSqlService.getAppealCasesByPatient(patientId);
    
    return res.json({
      success: true,
      cases
    });
  } catch (error) {
    console.error('Failed to get appeal cases:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve appeal cases',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/database/sql/kpis/real-time
 * Get real-time KPI calculations
 */
router.get('/sql/kpis/real-time', async (_req, res) => {
  try {
    const kpis = await azureSqlService.calculateRealTimeKPIs();
    
    return res.json({
      success: true,
      kpis,
      calculatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Failed to calculate real-time KPIs:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to calculate KPIs',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/database/sql/kpis
 * Store KPI metric
 */
router.post('/sql/kpis', async (req, res) => {
  try {
    const metric = req.body;
    await azureSqlService.storeKPIMetric(metric);
    
    eventPublisher.publish(makeEvent('kpi_metric_stored', {
      metricId: metric.id,
      metricName: metric.metricName,
      timestamp: new Date().toISOString()
    }));

    return res.json({
      success: true,
      message: 'KPI metric stored successfully'
    });
  } catch (error) {
    console.error('Failed to store KPI metric:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to store KPI metric',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/database/sql/kpis/:category/:timePeriod
 * Get KPI metrics by category and time period
 */
router.get('/sql/kpis/:category/:timePeriod', async (req, res) => {
  try {
    const { category, timePeriod } = req.params;
    const { limit = 100 } = req.query;
    
    const metrics = await azureSqlService.getKPIMetrics(category, timePeriod, parseInt(limit as string));
    
    return res.json({
      success: true,
      metrics
    });
  } catch (error) {
    console.error('Failed to get KPI metrics:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve KPI metrics',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// ============================================================================
// AZURE COSMOS DB ROUTES (Evidence Bundles & Collaboration)
// ============================================================================

/**
 * POST /api/database/cosmos/init
 * Initialize Cosmos DB containers
 */
router.post('/cosmos/init', async (_req, res) => {
  try {
    await azureCosmosService.initialize();
    
    eventPublisher.publish(makeEvent('cosmos_containers_initialized', {
      timestamp: new Date().toISOString(),
      service: 'azure-cosmos'
    }));

    return res.json({
      success: true,
      message: 'Cosmos DB containers initialized successfully'
    });
  } catch (error) {
    console.error('Cosmos DB initialization failed:', error);
    
    eventPublisher.publish(makeEvent('cosmos_initialization_failed', {
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }));

    return res.status(500).json({
      success: false,
      error: 'Failed to initialize Cosmos DB',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/database/cosmos/evidence-bundles
 * Store evidence bundle in Cosmos DB
 */
router.post('/cosmos/evidence-bundles', async (req, res) => {
  try {
    const bundle = req.body;
    await azureCosmosService.storeEvidenceBundle(bundle);
    
    eventPublisher.publish(makeEvent('evidence_bundle_stored', {
      bundleId: bundle.id,
      patientId: bundle.patientId,
      timestamp: new Date().toISOString()
    }));

    return res.json({
      success: true,
      message: 'Evidence bundle stored successfully'
    });
  } catch (error) {
    console.error('Failed to store evidence bundle:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to store evidence bundle',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/database/cosmos/evidence-bundles/:id
 * Get evidence bundle by ID
 */
router.get('/cosmos/evidence-bundles/:id/:patientId', async (req, res) => {
  try {
    const { id, patientId } = req.params;
    const bundle = await azureCosmosService.getEvidenceBundle(id, patientId);
    
    if (!bundle) {
      return res.status(404).json({
        success: false,
        error: 'Evidence bundle not found'
      });
    }
    
    return res.json({
      success: true,
      bundle
    });
  } catch (error) {
    console.error('Failed to get evidence bundle:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve evidence bundle',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/database/cosmos/evidence-bundles/patient/:patientId
 * Get evidence bundles by patient
 */
router.get('/cosmos/evidence-bundles/patient/:patientId', async (req, res) => {
  try {
    const { patientId } = req.params;
    const bundles = await azureCosmosService.getEvidenceBundlesByPatient(patientId);
    
    return res.json({
      success: true,
      bundles
    });
  } catch (error) {
    console.error('Failed to get evidence bundles:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve evidence bundles',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/database/cosmos/attribution-tracking
 * Store attribution tracking in Cosmos DB
 */
router.post('/cosmos/attribution-tracking', async (req, res) => {
  try {
    const attribution = req.body;
    await azureCosmosService.storeAttributionTracking(attribution);
    
    eventPublisher.publish(makeEvent('attribution_tracking_stored', {
      attributionId: attribution.id,
      bundleId: attribution.bundleId,
      timestamp: new Date().toISOString()
    }));

    return res.json({
      success: true,
      message: 'Attribution tracking stored successfully'
    });
  } catch (error) {
    console.error('Failed to store attribution tracking:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to store attribution tracking',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * PUT /api/database/cosmos/attribution-tracking/:bundleId/verification
 * Update attribution verification status
 */
router.put('/cosmos/attribution-tracking/:bundleId/verification', async (req, res) => {
  try {
    const { bundleId } = req.params;
    const { status, checksum } = req.body;
    
    await azureCosmosService.updateAttributionVerification(bundleId, status, checksum);
    
    eventPublisher.publish(makeEvent('attribution_verification_updated', {
      bundleId,
      status,
      timestamp: new Date().toISOString()
    }));

    return res.json({
      success: true,
      message: 'Attribution verification updated successfully'
    });
  } catch (error) {
    console.error('Failed to update attribution verification:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to update attribution verification',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/database/cosmos/document-versions
 * Store document version in Cosmos DB
 */
router.post('/cosmos/document-versions', async (req, res) => {
  try {
    const version = req.body;
    await azureCosmosService.storeDocumentVersion(version);
    
    eventPublisher.publish(makeEvent('document_version_stored', {
      documentId: version.documentId,
      version: version.version,
      timestamp: new Date().toISOString()
    }));

    return res.json({
      success: true,
      message: 'Document version stored successfully'
    });
  } catch (error) {
    console.error('Failed to store document version:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to store document version',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/database/cosmos/document-versions/:documentId
 * Get document versions by document ID
 */
router.get('/cosmos/document-versions/:documentId', async (req, res) => {
  try {
    const { documentId } = req.params;
    const versions = await azureCosmosService.getDocumentVersions(documentId);
    
    return res.json({
      success: true,
      versions
    });
  } catch (error) {
    console.error('Failed to get document versions:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve document versions',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/database/cosmos/collaboration-sessions
 * Store collaboration session in Cosmos DB
 */
router.post('/cosmos/collaboration-sessions', async (req, res) => {
  try {
    const session = req.body;
    await azureCosmosService.storeCollaborationSession(session);
    
    eventPublisher.publish(makeEvent('collaboration_session_created', {
      sessionId: session.sessionId,
      caseId: session.caseId,
      timestamp: new Date().toISOString()
    }));

    return res.json({
      success: true,
      message: 'Collaboration session created successfully'
    });
  } catch (error) {
    console.error('Failed to create collaboration session:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to create collaboration session',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * PUT /api/database/cosmos/collaboration-sessions/:sessionId
 * Update collaboration session
 */
router.put('/cosmos/collaboration-sessions/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const updates = req.body;
    
    await azureCosmosService.updateCollaborationSession(sessionId, updates);
    
    eventPublisher.publish(makeEvent('collaboration_session_updated', {
      sessionId,
      timestamp: new Date().toISOString()
    }));

    return res.json({
      success: true,
      message: 'Collaboration session updated successfully'
    });
  } catch (error) {
    console.error('Failed to update collaboration session:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to update collaboration session',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/database/cosmos/collaboration-sessions/:sessionId/activities
 * Add activity to collaboration session
 */
router.post('/cosmos/collaboration-sessions/:sessionId/activities', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const activity = req.body;
    
    await azureCosmosService.addCollaborationActivity(sessionId, activity);
    
    eventPublisher.publish(makeEvent('collaboration_activity_added', {
      sessionId,
      activityType: activity.type,
      userId: activity.userId,
      timestamp: new Date().toISOString()
    }));

    return res.json({
      success: true,
      message: 'Activity added to collaboration session successfully'
    });
  } catch (error) {
    console.error('Failed to add collaboration activity:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to add collaboration activity',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/database/cosmos/collaboration-sessions/:sessionId
 * Get collaboration session by ID
 */
router.get('/cosmos/collaboration-sessions/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await azureCosmosService.getCollaborationSession(sessionId);
    
    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Collaboration session not found'
      });
    }
    
    return res.json({
      success: true,
      session
    });
  } catch (error) {
    console.error('Failed to get collaboration session:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve collaboration session',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/database/cosmos/collaboration-sessions/case/:caseId/active
 * Get active collaboration sessions by case ID
 */
router.get('/cosmos/collaboration-sessions/case/:caseId/active', async (req, res) => {
  try {
    const { caseId } = req.params;
    const sessions = await azureCosmosService.getActiveCollaborationSessions(caseId);
    
    return res.json({
      success: true,
      sessions
    });
  } catch (error) {
    console.error('Failed to get active collaboration sessions:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve active collaboration sessions',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// ============================================================================
// HEALTH CHECK ROUTES
// ============================================================================

/**
 * GET /api/database/health/sql
 * Health check for Azure SQL Database
 */
router.get('/health/sql', async (_req, res) => {
  try {
    const health = await azureSqlService.healthCheck();
    return res.json(health);
  } catch (error) {
    return res.status(503).json({
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * GET /api/database/health/cosmos
 * Health check for Azure Cosmos DB
 */
router.get('/health/cosmos', async (_req, res) => {
  try {
    const health = await azureCosmosService.healthCheck();
    return res.json(health);
  } catch (error) {
    return res.status(503).json({
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * GET /api/database/health
 * Overall database health check
 */
router.get('/health', async (_req, res) => {
  try {
    const [sqlHealth, cosmosHealth] = await Promise.all([
      azureSqlService.healthCheck(),
      azureCosmosService.healthCheck()
    ]);

    const overallStatus = sqlHealth.status === 'healthy' && cosmosHealth.status === 'healthy' 
      ? 'healthy' 
      : 'degraded';

    return res.json({
      status: overallStatus,
      timestamp: new Date().toISOString(),
      services: {
        sql: sqlHealth,
        cosmos: cosmosHealth
      }
    });
  } catch (error) {
    return res.status(503).json({
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

export default router;
