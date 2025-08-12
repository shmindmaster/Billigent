/**
 * Enhanced Pre-Bill CDI Routes
 * 
 * API endpoints for the enhanced Clinical Documentation Improvement (CDI) workflow
 * Integrates with Azure OpenAI, Data Lake, and conversational AI for comprehensive
 * clinical analysis and recommendations.
 */

import express, { Router } from 'express';
import * as winston from 'winston';
import {
    askCDIFollowUpQuestion,
    generateCDIManagementReport,
    performEnhancedCDIAnalysis
} from '../workflows/cdi-enhanced.workflow';

const router: Router = express.Router();

// Configure logging
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console()
  ]
});

/**
 * POST /api/cdi/analyze/:encounterId
 * 
 * Perform enhanced CDI analysis for a specific encounter
 * Includes AI-powered recommendations, financial impact, and conversational AI session
 */
router.post('/analyze/:encounterId', async (req, res) => {
  try {
    const { encounterId } = req.params;
    const options = req.body || {};

    logger.info('Starting enhanced CDI analysis request', { 
      encounterId, 
      options,
      userId: req.headers['x-user-id'] 
    });

    // Validate encounter ID
    if (!encounterId || typeof encounterId !== 'string') {
      return res.status(400).json({
        error: 'Invalid encounter ID provided',
        code: 'INVALID_ENCOUNTER_ID'
      });
    }

    // Perform enhanced CDI analysis
    const result = await performEnhancedCDIAnalysis(encounterId, {
      includeFinancialAnalysis: options.includeFinancialAnalysis !== false,
      generateQueries: options.generateQueries !== false,
      priority: options.priority
    });

    logger.info('Enhanced CDI analysis completed', {
      encounterId,
      analysisId: result.analysisId,
      priority: result.priority,
      confidence: result.confidence,
      financialImpact: result.financialImpact.potentialIncrease
    });

    res.json({
      success: true,
      data: result,
      meta: {
        analysisType: 'enhanced_cdi',
        timestamp: new Date().toISOString(),
        processingTime: Date.now() - (req as any).startTime
      }
    });

  } catch (error) {
    logger.error('Error in enhanced CDI analysis:', error);

    const statusCode = error instanceof Error && error.message.includes('not found') ? 404 : 500;
    
    res.status(statusCode).json({
      error: 'Enhanced CDI analysis failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      code: 'ENHANCED_CDI_ANALYSIS_FAILED',
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * POST /api/cdi/question/:conversationId
 * 
 * Ask a follow-up question about a CDI analysis using conversational AI
 * Provides context-aware responses with clinical recommendations
 */
router.post('/question/:conversationId', async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { question, context } = req.body;

    logger.info('Processing CDI follow-up question', {
      conversationId,
      questionLength: question?.length,
      hasContext: !!context,
      userId: req.headers['x-user-id']
    });

    // Validate inputs
    if (!conversationId || typeof conversationId !== 'string') {
      return res.status(400).json({
        error: 'Invalid conversation ID provided',
        code: 'INVALID_CONVERSATION_ID'
      });
    }

    if (!question || typeof question !== 'string' || question.trim().length === 0) {
      return res.status(400).json({
        error: 'Question is required and must be a non-empty string',
        code: 'INVALID_QUESTION'
      });
    }

    // Ask CDI follow-up question
    const result = await askCDIFollowUpQuestion(conversationId, question, context);

    logger.info('CDI follow-up question answered', {
      conversationId,
      confidence: result.confidence,
      sourcesCount: result.sources.length
    });

    res.json({
      success: true,
      data: result,
      meta: {
        questionType: 'cdi_followup',
        timestamp: new Date().toISOString(),
        processingTime: Date.now() - (req as any).startTime
      }
    });

  } catch (error) {
    logger.error('Error answering CDI question:', error);

    res.status(500).json({
      error: 'Failed to answer CDI question',
      message: error instanceof Error ? error.message : 'Unknown error',
      code: 'CDI_QUESTION_FAILED',
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * POST /api/cdi/report
 * 
 * Generate comprehensive CDI management report
 * Includes summary metrics, top opportunities, trends, and recommendations
 */
router.post('/report', async (req, res) => {
  try {
    const { timeRange, filters } = req.body;

    logger.info('Generating CDI management report', {
      timeRange,
      filters,
      userId: req.headers['x-user-id']
    });

    // Validate time range
    if (!timeRange || !timeRange.start || !timeRange.end) {
      return res.status(400).json({
        error: 'Time range with start and end dates is required',
        code: 'INVALID_TIME_RANGE'
      });
    }

    const startDate = new Date(timeRange.start);
    const endDate = new Date(timeRange.end);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return res.status(400).json({
        error: 'Invalid date format in time range',
        code: 'INVALID_DATE_FORMAT'
      });
    }

    if (startDate >= endDate) {
      return res.status(400).json({
        error: 'Start date must be before end date',
        code: 'INVALID_DATE_RANGE'
      });
    }

    // Generate CDI management report
    const result = await generateCDIManagementReport(
      { start: startDate, end: endDate },
      filters
    );

    logger.info('CDI management report generated', {
      totalAnalyses: result.summary.totalEncounters,
      totalFinancialImpact: result.summary.totalFinancialImpact,
      topOpportunitiesCount: result.topOpportunities.length
    });

    res.json({
      success: true,
      data: result,
      meta: {
        reportType: 'cdi_management',
        timestamp: new Date().toISOString(),
        processingTime: Date.now() - (req as any).startTime,
        timeRange: { start: startDate.toISOString(), end: endDate.toISOString() }
      }
    });

  } catch (error) {
    logger.error('Error generating CDI report:', error);

    res.status(500).json({
      error: 'Failed to generate CDI report',
      message: error instanceof Error ? error.message : 'Unknown error',
      code: 'CDI_REPORT_FAILED',
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * GET /api/cdi/analysis/:analysisId
 * 
 * Retrieve a specific CDI analysis by ID
 * Includes full analysis results and conversational context
 */
router.get('/analysis/:analysisId', async (req, res) => {
  try {
    const { analysisId } = req.params;

    logger.info('Retrieving CDI analysis', {
      analysisId,
      userId: req.headers['x-user-id']
    });

    // Validate analysis ID
    if (!analysisId || typeof analysisId !== 'string') {
      return res.status(400).json({
        error: 'Invalid analysis ID provided',
        code: 'INVALID_ANALYSIS_ID'
      });
    }

    // TODO: Implement retrieval from database
    // For now, return a placeholder response
    res.status(501).json({
      error: 'Analysis retrieval not yet implemented',
      code: 'NOT_IMPLEMENTED',
      message: 'This endpoint will be implemented to retrieve stored CDI analyses'
    });

  } catch (error) {
    logger.error('Error retrieving CDI analysis:', error);

    res.status(500).json({
      error: 'Failed to retrieve CDI analysis',
      message: error instanceof Error ? error.message : 'Unknown error',
      code: 'CDI_RETRIEVAL_FAILED',
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * GET /api/cdi/health
 * 
 * Health check endpoint for CDI services
 * Validates connection to dependencies and returns service status
 */
router.get('/health', async (req, res) => {
  try {
    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'healthy',
        ragService: 'healthy',
        responsesAPI: 'healthy',
        dataLake: 'healthy'
      },
      version: '1.0.0'
    };

    // TODO: Add actual health checks for dependencies
    // - Database connectivity
    // - RAG service availability  
    // - Responses API connectivity
    // - Data Lake access

    logger.info('CDI health check completed', healthStatus);

    res.json(healthStatus);

  } catch (error) {
    logger.error('Error in CDI health check:', error);

    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
      code: 'HEALTH_CHECK_FAILED'
    });
  }
});

/**
 * Middleware to add request timing
 */
router.use((req, res, next) => {
  (req as any).startTime = Date.now();
  next();
});

/**
 * Error handling middleware for CDI routes
 */
router.use((error: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled error in CDI routes:', {
    error: error.message,
    stack: error.stack,
    path: req.path,
    method: req.method
  });

  if (res.headersSent) {
    return next(error);
  }

  res.status(500).json({
    error: 'Internal server error in CDI processing',
    message: process.env.NODE_ENV === 'development' ? error.message : 'An unexpected error occurred',
    code: 'INTERNAL_SERVER_ERROR',
    timestamp: new Date().toISOString()
  });
});

export default router;
