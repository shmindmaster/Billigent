import { PrismaClient } from '@billigent/database';
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
const prisma = new PrismaClient();

// GET /api/analytics/dashboard - Get dashboard statistics
router.get('/dashboard', async (req: Request, res: Response) => {
  try {
    const [
      totalCases,
      activeCases,
      completedCases,
      totalDenials,
      activeDenials,
      totalQueries,
      pendingQueries,
      totalFinancialImpact,
      deniedAmount
    ] = await Promise.all([
      // Total cases
      prisma.case.count(),
      
      // Active cases (not closed)
      prisma.case.count({
        where: { status: { not: 'Closed' } }
      }),
      
      // Completed cases
      prisma.case.count({
        where: { status: 'Completed' }
      }),
      
      // Total denials
      prisma.denial.count(),
      
      // Active denials (not overturned or upheld)
      prisma.denial.count({
        where: { status: { notIn: ['Overturned', 'Upheld'] } }
      }),
      
      // Total queries
      prisma.query.count(),
      
      // Pending queries
      prisma.query.count({
        where: { status: 'PendingResponse' }
      }),
      
      // Total potential financial impact from PreBill analyses
      prisma.preBillAnalysis.aggregate({
        _sum: { confidence: true } // Using confidence as proxy for impact
      }),
      
      // Total denied amount
      prisma.denial.aggregate({
        _sum: { amount: true }
      })
    ]);

    res.json({
      cases: {
        total: totalCases,
        active: activeCases,
        completed: completedCases,
        completionRate: totalCases > 0 ? Math.round((completedCases / totalCases) * 100) : 0
      },
      denials: {
        total: totalDenials,
        active: activeDenials,
        totalDeniedAmount: deniedAmount._sum.amount || 0
      },
      queries: {
        total: totalQueries,
        pending: pendingQueries,
        responseRate: totalQueries > 0 ? Math.round(((totalQueries - pendingQueries) / totalQueries) * 100) : 0
      },
      financialImpact: {
        totalPotential: totalFinancialImpact._sum.confidence || 0,
        totalDenied: deniedAmount._sum.amount || 0
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard analytics:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard analytics' });
  }
});

// GET /api/analytics/cases-by-status - Get case distribution by status
router.get('/cases-by-status', async (req: Request, res: Response) => {
  try {
    const casesByStatus = await prisma.case.groupBy({
      by: ['status'],
      _count: { status: true }
    });

    const result = casesByStatus.map((item: any) => ({
      status: item.status,
      count: item._count.status
    }));

    res.json(result);
  } catch (error) {
    console.error('Error fetching cases by status:', error);
    res.status(500).json({ error: 'Failed to fetch cases by status' });
  }
});

// GET /api/analytics/cases-by-priority - Get case distribution by priority
router.get('/cases-by-priority', async (req: Request, res: Response) => {
  try {
    const casesByPriority = await prisma.case.groupBy({
      by: ['priority'],
      _count: { priority: true }
    });

    const result = casesByPriority.map((item: any) => ({
      priority: item.priority || 'Unassigned',
      count: item._count.priority
    }));

    res.json(result);
  } catch (error) {
    console.error('Error fetching cases by priority:', error);
    res.status(500).json({ error: 'Failed to fetch cases by priority' });
  }
});

// GET /api/analytics/user-workload - Get workload distribution by user
router.get('/user-workload', async (req: Request, res: Response) => {
  try {
    const userWorkload = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        role: true,
        assignedCases: {
          select: {
            id: true,
            status: true
          }
        }
      }
    });

    const result = userWorkload.map((user: any) => ({
      userId: user.id,
      fullName: user.name,
      userRole: user.role,
      totalCases: user.assignedCases.length,
      activeCases: user.assignedCases.filter((c: any) => c.status !== 'Closed' && c.status !== 'Completed').length,
      completedCases: user.assignedCases.filter((c: any) => c.status === 'Completed').length
    }));

    res.json(result);
  } catch (error) {
    console.error('Error fetching user workload:', error);
    res.status(500).json({ error: 'Failed to fetch user workload' });
  }
});

// GET /api/analytics/financial-impact - Get financial impact metrics
router.get('/financial-impact', async (req: Request, res: Response) => {
  try {
    const [cdiImpact, denialImpact] = await Promise.all([
      // PreBill Analysis metrics by status
      prisma.preBillAnalysis.groupBy({
        by: ['status'],
        _avg: { confidence: true },
        _count: { id: true }
      }),
      
      // Denials financial impact by status
      prisma.denial.groupBy({
        by: ['status'],
        _sum: { amount: true },
        _count: { id: true }
      })
    ]);

    const cdiResults = cdiImpact.map((item: any) => ({
      status: item.status,
      count: item._count.id,
      avgConfidence: item._avg.confidence || 0
    }));

    const denialResults = denialImpact.map((item: any) => ({
      status: item.status,
      count: item._count.id,
      totalAmount: item._sum.amount || 0
    }));

    res.json({
      cdiReviews: cdiResults,
      denials: denialResults
    });
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
    const [denialsByReason, reviewsWithUsers] = await Promise.all([
      prisma.denial.groupBy({
        by: ['denialReason'],
        _count: { id: true },
        _sum: { amount: true },
      }),
      prisma.preBillAnalysis.findMany({
        select: {
          potentialFinancialImpact: true,
          encounter: {
            select: {
              case: {
                select: {
                  assignedUser: {
                    select: { userRole: true },
                  },
                },
              },
            },
          },
        },
      }),
    ]);

    // Map denials by reason
    const dataset = {
      denialsByReason: denialsByReason.map(d => ({
        reason: d.denialReason || 'Unknown',
        count: d._count.id,
        deniedAmount: d._sum.amount ?? 0,
      })),
      // Aggregate potential financial impact by the assigned user's role (proxy for department)
      revenueByDepartment: (() => {
        const acc = new Map<string, number>();
        for (const r of reviewsWithUsers) {
          const role = r.encounter?.case?.assignedUser?.userRole || 'Unassigned';
          const valueRaw: any = (r as any).potentialFinancialImpact ?? 0;
          const value = typeof valueRaw === 'object' && valueRaw !== null && 'toNumber' in valueRaw
            ? (valueRaw as any).toNumber()
            : Number(valueRaw) || 0;
          acc.set(role, (acc.get(role) || 0) + value);
        }
        return Array.from(acc.entries()).map(([department, revenue]) => ({ department, revenue }));
      })(),
    };

    // Engineer context for the code interpreter
    const engineered = `You are a healthcare data analyst for the Billigent platform. You have access to a secure Python environment with a read-only connection to a database containing the following Prisma models: Cases, Denials, Queries, Users, and CDI_Reviews. The user will ask a question. Your task is to write and execute Python code using pandas and plotly to answer the question. If the question requires a chart, generate a chart and output it as a file. If it requires a text answer, provide a concise summary. Respond with only the final output.\n\nQUESTION:\n${userQuestion}`;

    const resp = await getAnalyticsWithCodeInterpreter(engineered, dataset);

    // If called with 'question', return standardized object per spec; if 'prompt' was used, return raw
    if (typeof question === 'string') {
      // Check if the response contains data with chart or image content
      if (resp.data?.chart || resp.data?.image) {
        return res.json({ 
          type: 'image', 
          content: resp.data.chart || resp.data.image 
        });
      }
      
      // Fallback to text response
      const text = resp.data?.answer || resp.data?.content || 'No output produced.';
      return res.json({ type: 'text', content: text });
    }

    // Backward compatible return for legacy callers
    return res.json(resp);
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

    const activities = await prisma.analytics.findMany({
      where: {
        timestamp: { gte: startDate }
      },
      select: {
        timestamp: true,
        activityType: true
      },
      orderBy: { timestamp: 'asc' }
    });

    // Group activities by date and type
    const activityMap = new Map<string, Record<string, number>>();
    
    activities.forEach(activity => {
      const date = activity.timestamp.toISOString().split('T')[0]; // YYYY-MM-DD
      
      if (!activityMap.has(date)) {
        activityMap.set(date, {});
      }
      
      const dayActivities = activityMap.get(date)!;
      const activityType = activity.activityType || 'unknown';
      dayActivities[activityType] = (dayActivities[activityType] || 0) + 1;
    });

    const result = Array.from(activityMap.entries()).map(([date, activities]) => ({
      date,
      activities
    }));

    res.json(result);
  } catch (error) {
    console.error('Error fetching activity trends:', error);
    res.status(500).json({ error: 'Failed to fetch activity trends' });
  }
});

export default router;

