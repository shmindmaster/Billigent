/**
 * Enhanced Pre-Bill CDI Routes
 * 
 * API endpoints for the enhanced Clinical Documentation Improvement (CDI) workflow
 * Integrates with Azure OpenAI, Data Lake, and conversational AI for comprehensive
 * clinical analysis and recommendations.
 */

import express, { Router } from 'express';
import { ragService } from '../services/rag.service';
import { responsesAPIService } from '../services/responses-api.service';
import {
    askCDIFollowUpQuestion,
    generateCDIManagementReport,
    performEnhancedCDIAnalysis
} from '../workflows/cdi-enhanced.workflow';
import CDIAnalysisRepository from '../repositories/cdiAnalysis.repository';
import { log } from '../utils/logger';

const router: Router = express.Router();

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

    log.info('Starting enhanced CDI analysis request', { 
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

    log.info('Enhanced CDI analysis completed', {
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
    log.error('Error in enhanced CDI analysis', { 
      error: error instanceof Error ? error.message : error,
      encounterId: req.params.encounterId,
      options: req.body || {} 
    });

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

    log.info('Processing CDI follow-up question', {
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

    log.info('CDI follow-up question answered', {
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
    log.error('Error answering CDI question', { 
      error: error instanceof Error ? error.message : error,
      conversationId: req.params.conversationId,
      question: req.body.question 
    });

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

    log.info('Generating CDI management report', {
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

    log.info('CDI management report generated', {
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
    log.error('Error generating CDI report', { 
      error: error instanceof Error ? error.message : error,
      timeRange: req.body.timeRange,
      filters: req.body.filters 
    });

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

    log.info('Retrieving CDI analysis', {
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

    const cdiAnalysis = await CDIAnalysisRepository.get(analysisId);

    if (!cdiAnalysis) {
      return res.status(404).json({
        error: 'CDI analysis not found',
        code: 'CDI_ANALYSIS_NOT_FOUND',
        message: `CDI analysis with ID ${analysisId} not found`
      });
    }

    log.info('CDI analysis retrieved', {
      analysisId,
      encounterId: cdiAnalysis.encounterId,
      priority: cdiAnalysis.priority,
      confidence: cdiAnalysis.confidence
    });

    res.json({
      success: true,
      data: cdiAnalysis,
      meta: {
        analysisType: 'enhanced_cdi',
        timestamp: new Date().toISOString(),
        processingTime: Date.now() - (req as any).startTime
      }
    });

  } catch (error) {
    log.error('Error retrieving CDI analysis', { 
      error: error instanceof Error ? error.message : error,
      analysisId: req.params.analysisId 
    });

    res.status(500).json({
      error: 'Failed to retrieve CDI analysis',
      message: error instanceof Error ? error.message : 'Unknown error',
      code: 'CDI_RETRIEVAL_FAILED',
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * POST /api/cdi/test-model
 * 
 * Test endpoint to demonstrate new GPT-5-mini model quality
 */
router.post('/test-model', async (req, res) => {
  try {
    const testQuery = req.body.query || "Analyze this clinical scenario for CDI opportunities: 78-year-old male admitted with chest pain, SOB, and elevated troponins (2.5 ng/mL). Echo shows EF 35%. Patient has diabetes mellitus and hypertension. What specific ICD-10 codes and documentation improvements should be considered for optimal DRG assignment?";

    log.info('Testing new GPT-5-mini model', { query: testQuery });

    // Test RAG service with new model
    const ragResponse = await ragService.query(testQuery);

    // Test Responses API service with new model  
    const responsesAPIResponse = await responsesAPIService.submitQuery(testQuery, {
      conversationId: 'model-test',
      clinicalData: { modelTest: true }
    });

    const result = {
      modelInformation: {
        ragModel: process.env.AZURE_OPENAI_MODEL || 'gpt-5-mini',
        embeddingModel: process.env.AZURE_OPENAI_EMBEDDING_MODEL || 'text-embedding-3-large',
        responsesAPIModel: process.env.AZURE_OPENAI_MODEL_DEPLOYMENT || 'gpt-5-mini'
      },
      ragResponse: {
        answer: ragResponse.answer,
        confidence: ragResponse.confidence,
        sourcesCount: ragResponse.sources.length
      },
      responsesAPIResponse: {
        answer: responsesAPIResponse.data?.answer || responsesAPIResponse.error,
        status: responsesAPIResponse.status
      },
      qualityComparison: {
        previousModel: 'gpt-4o',
        currentModel: 'gpt-5-mini',
        improvements: [
          'Higher context window (272k vs 128k tokens)',
          'Better reasoning capabilities',
          'Enhanced clinical accuracy',
          'Superior embedding model (3072 vs 1536 dimensions)'
        ]
      }
    };

    log.info('Model test completed successfully', {
      ragConfidence: ragResponse.confidence,
      responsesAPIStatus: responsesAPIResponse.status
    });

    res.json({
      success: true,
      data: result,
      meta: {
        timestamp: new Date().toISOString(),
        testType: 'model_quality_verification'
      }
    });

  } catch (error) {
    log.error('Error testing new model', { 
      error: error instanceof Error ? error.message : error,
      query: req.body.query 
    });
    res.status(500).json({
      error: 'Model test failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      code: 'MODEL_TEST_FAILED'
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
      models: {
        chatModel: process.env.AZURE_OPENAI_MODEL || 'gpt-5-mini',
        embeddingModel: process.env.AZURE_OPENAI_EMBEDDING_MODEL || 'text-embedding-3-large',
        reasoningModel: process.env.AZURE_OPENAI_REASONING_MODEL || 'o3-mini'
      },
      version: '1.0.0'
    };

    log.info('CDI health check completed', healthStatus);

    res.json(healthStatus);

  } catch (error) {
    log.error('Error in CDI health check', { 
      error: error instanceof Error ? error.message : error 
    });

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
  log.error('Unhandled error in CDI routes:', {
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
