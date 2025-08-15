// Analytics route currently returns placeholder data; real metrics pending Cosmos implementation
import { Request, Response, Router } from 'express';
import {
    createTextResponse,
    getAnalyticsWithCodeInterpreter,
    getConversationalResponse,
    retrieveResponse,
    startBackgroundAnalysisFromBase64,
    startPdfAnalysisWithFileId,
    uploadPdfForAnalysis,
} from '../services/responses-api.service';

const router: Router = Router();
// All former Prisma analytics queries removed. Placeholder responses below.
// prisma reference removed

// GET /api/analytics/dashboard - Get dashboard statistics
router.get('/dashboard', async (req: Request, res: Response) => {
  try {
    if (process.env.SAFE_MODE === 'true') {
      return res.json({
        cases: { total: 0, active: 0, completed: 0, completionRate: 0 },
        denials: { total: 0, active: 0, totalDeniedAmount: 0 },
        queries: { total: 0, pending: 0, responseRate: 0 },
        financialImpact: { totalPotential: 0, totalDenied: 0 }
      });
    }
    return res.status(501).json({
      error: 'analytics dashboard disabled during purge',
      cases: { total: 0, active: 0, completed: 0, completionRate: 0 },
      denials: { total: 0, active: 0, totalDeniedAmount: 0 },
      queries: { total: 0, pending: 0, responseRate: 0 },
      financialImpact: { totalPotential: 0, totalDenied: 0 }
    });
  } catch (error) {
    console.error('Error fetching dashboard analytics:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard analytics' });
  }
});

// GET /api/analytics/cases-by-status - Get case distribution by status
router.get('/cases-by-status', async (req: Request, res: Response) => {
  try {
    return res.status(501).json({ error: 'cases-by-status disabled during purge', data: [] });
  } catch (error) {
    console.error('Error fetching cases by status:', error);
    res.status(500).json({ error: 'Failed to fetch cases by status' });
  }
});

// GET /api/analytics/cases-by-priority - Get case distribution by priority
router.get('/cases-by-priority', async (req: Request, res: Response) => {
  try {
    return res.status(501).json({ error: 'cases-by-priority disabled during purge', data: [] });
  } catch (error) {
    console.error('Error fetching cases by priority:', error);
    res.status(500).json({ error: 'Failed to fetch cases by priority' });
  }
});

// GET /api/analytics/user-workload - Get workload distribution by user
router.get('/user-workload', async (req: Request, res: Response) => {
  try {
    return res.status(501).json({ error: 'user-workload disabled during purge', data: [] });
  } catch (error) {
    console.error('Error fetching user workload:', error);
    res.status(500).json({ error: 'Failed to fetch user workload' });
  }
});

// GET /api/analytics/financial-impact - Get financial impact metrics
router.get('/financial-impact', async (req: Request, res: Response) => {
  try {
    return res.status(501).json({ error: 'financial-impact disabled during purge', cdiReviews: [], denials: [] });
  } catch (error) {
    console.error('Error fetching financial impact:', error);
    res.status(500).json({ error: 'Failed to fetch financial impact' });
  }
});

// ===== AI endpoints leveraging Azure OpenAI Responses API =====

// POST /api/analytics/ai/text - simple text response
router.post('/ai/text', async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body || {};
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Missing prompt' });
    }
    const result = await createTextResponse(prompt);
    res.json(result);
  } catch (error: any) {
    console.error('AI text error:', error);
    res.status(500).json({ error: error?.message || 'AI text failed' });
  }
});

// POST /api/analytics/ai/conversation - stateful conversation
router.post('/ai/conversation', async (req: Request, res: Response) => {
  try {
    const { prompt, previousResponseId } = req.body || {};
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Missing prompt' });
    }
    const result = await getConversationalResponse(prompt, previousResponseId);
    res.json(result);
  } catch (error: any) {
    console.error('AI conversation error:', error);
    res.status(500).json({ error: error?.message || 'AI conversation failed' });
  }
});

// POST /api/analytics/ai/background/start - start background task from base64 file
router.post('/ai/background/start', async (req: Request, res: Response) => {
  try {
    const { filename, mimeType, base64Data, prompt } = req.body || {};
    if (!filename || !mimeType || !base64Data || !prompt) {
      return res.status(400).json({ error: 'filename, mimeType, base64Data, prompt are required' });
    }

    // Prefer uploading via Files API and referencing file_id for higher reliability
    try {
      const fileBuffer = Buffer.from(String(base64Data), 'base64');
      const fileId = await uploadPdfForAnalysis(fileBuffer, filename);
      const result = await startPdfAnalysisWithFileId(fileId, prompt);
      return res.json(result);
    } catch (fileErr) {
      console.warn('Files API path failed, falling back to inline base64:', fileErr);
      const fallback = await startBackgroundAnalysisFromBase64(base64Data, `analysis-${Date.now()}`);
      return res.json(fallback);
    }
  } catch (error: any) {
    console.error('AI background start error:', error);
    res.status(500).json({ error: error?.message || 'AI background start failed' });
  }
});

// GET /api/analytics/ai/background/:id - retrieve background response
router.get('/ai/background/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await retrieveResponse(id);
    res.json(result);
  } catch (error: any) {
    console.error('AI background get error:', error);
    res.status(500).json({ error: error?.message || 'AI background get failed' });
  }
});

// POST /api/analytics/query - analytics via code interpreter
router.post('/query', async (req: Request, res: Response) => {
  try {
    const { prompt, question } = req.body || {};
    const userQuestion: string | undefined = typeof question === 'string' ? question : (typeof prompt === 'string' ? prompt : undefined);
    if (!userQuestion) return res.status(400).json({ error: 'Missing question' });
    // Pull live data from Azure SQL via Prisma to feed into the model
    // Example datasets commonly used for analytics
    // Dataset construction disabled; return placeholder dataset with no real analytics during purge
    const placeholder = { denialsByReason: [], revenueByDepartment: [] };
    const engineered = `Analytics disabled during purge. QUESTION:\n${userQuestion}`;
    const resp = await getAnalyticsWithCodeInterpreter(engineered, placeholder);
    const text = resp.data?.answer || resp.data?.content || 'Analytics disabled.';
    return res.json({ type: 'text', content: text });
  } catch (error: any) {
    console.error('AI analytics error:', error);
    res.status(500).json({ error: error?.message || 'AI analytics failed' });
  }
});

// GET /api/analytics/activity-trends - Get activity trends over time
router.get('/activity-trends', async (req: Request, res: Response) => {
  try {
    const { days = '30' } = req.query;
    const daysBack = parseInt(days as string, 10);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);

    return res.status(501).json({ error: 'activity-trends disabled during purge', data: [] });
  } catch (error) {
    console.error('Error fetching activity trends:', error);
    res.status(500).json({ error: 'Failed to fetch activity trends' });
  }
});

export default router;

