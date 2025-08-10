import { PrismaClient } from '@billigent/database';
import { Request, Response, Router } from 'express';
import { getGroundedIcdResponse } from '../services/rag.service';
import { getConversationalResponse } from '../services/responses-api.service';
import { persistPreBillResults, runPreBillAnalysisForEncounter } from '../workflows/pre-bill.workflow';

const router: Router = Router();
const prisma = new PrismaClient();

// GET /api/cases - List cases with filtering and pagination
router.get('/', async (req: Request, res: Response) => {
  try {
    const { 
      page = '1', 
      limit = '10', 
      status, 
      priority,
      assignedUserId,
      search 
    } = req.query;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    // Build where clause
    const where: any = {};
    
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (assignedUserId) where.assignedUserId = parseInt(assignedUserId as string, 10);
    
      if (search) {
        where.OR = [
          { patientFhirId: { contains: search as string } },
          { encounterFhirId: { contains: search as string } },
          { medicalRecordNumber: { contains: search as string } },
          { patientName: { contains: search as string } },
          { primaryDiagnosis: { contains: search as string } }
        ];
      }

    const [cases, total] = await Promise.all([
      prisma.case.findMany({
        where,
        skip,
        take: limitNum,
        select: {
          id: true,
          patientFhirId: true,
          encounterFhirId: true,
          status: true,
          priority: true,
          createdAt: true,
          updatedAt: true,
          assignedUserId: true,
          facilityId: true,
          medicalRecordNumber: true,
          patientName: true,
          age: true,
          gender: true,
          admissionDate: true,
          dischargeDate: true,
          primaryDiagnosis: true,
          currentDRG: true,
          openDate: true,
          closeDate: true,
          assignedUser: { select: { id: true, name: true, email: true, role: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.case.count({ where }),
    ]);

    res.json({
      cases,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error: any) {
    console.error('Error fetching cases:', error);
    res.status(500).json({ error: 'Failed to fetch cases', message: error?.message, ...(process.env.NODE_ENV !== 'production' && { stack: error?.stack }) });
  }
});

// POST /api/cases/:caseId/conversation - Conversational Case Review
// Behavior:
// - First user message (no previousResponseId): run application-layer RAG once using encounterFhirId, return structured ICD response and responseId.
// - Subsequent messages: do NOT re-run RAG. Rely on previous_response_id to continue the conversation with maintained context.
router.post('/:caseId/conversation', async (req: Request, res: Response) => {
  try {
    const { caseId } = req.params;
    const { prompt, previousResponseId } = req.body || {};
    const parsedCaseId = parseInt(caseId, 10);
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Missing prompt' });
    }
    if (isNaN(parsedCaseId)) {
      return res.status(400).json({ error: 'Invalid case ID' });
    }

    const theCase = await prisma.case.findUnique({ where: { id: parsedCaseId.toString() } });
    if (!theCase) return res.status(404).json({ error: 'Case not found' });

    // First message: perform RAG grounding scoped to encounter
    if (!previousResponseId) {
      const grounded = await getGroundedIcdResponse(prompt, theCase.encounterFhirId);
      return res.json({
        responseId: grounded.responseId,
        structured: grounded.data,
      });
    }

    // Subsequent turns: continue conversation using the prior response id only
    const cont = await getConversationalResponse(prompt, previousResponseId);
    return res.json(cont);
  } catch (error: any) {
    console.error('Case conversation error:', error);
    res.status(500).json({ error: error?.message || 'Case conversation failed' });
  }
});

// GET /api/cases/:id - Get case by ID with full details
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const caseId = parseInt(id, 10);

    if (isNaN(caseId)) {
      return res.status(400).json({ error: 'Invalid case ID' });
    }

    const caseRecord = await prisma.case.findUnique({
      where: { caseId },
      include: {
        assignedUser: {
          select: { userId: true, fullName: true, email: true, userRole: true }
        },
        cdiReview: {
          include: {
            evidence: true,
            queries: {
              include: {
                createdByUser: {
                  select: { userId: true, fullName: true, email: true }
                }
              }
            }
          }
        },
        denial: true,
        activityLogs: {
          include: {
            user: {
              select: { userId: true, fullName: true, email: true }
            }
          },
          orderBy: { timestamp: 'desc' },
          take: 20
        }
      }
    });

    if (!caseRecord) {
      return res.status(404).json({ error: 'Case not found' });
    }

    res.json(caseRecord);
  } catch (error) {
    console.error('Error fetching case:', error);
    res.status(500).json({ error: 'Failed to fetch case' });
  }
});

// POST /api/cases - Create new case
router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      patientFhirId,
      encounterFhirId,
      status,
      priority,
      assignedUserId,
      // Enhanced healthcare fields
      facilityId,
      medicalRecordNumber,
      patientName,
      age,
      gender,
      admissionDate,
      dischargeDate,
      primaryDiagnosis,
      currentDRG,
      openDate,
      closeDate
    } = req.body;

    // Validate required fields
    if (!patientFhirId || !encounterFhirId) {
      return res.status(400).json({ 
        error: 'Missing required fields: patientFhirId, encounterFhirId' 
      });
    }

    const newCase = await prisma.case.create({
      data: {
        patientFhirId,
        encounterFhirId,
        status: status || 'New',
        priority: priority || 'Medium',
        assignedUserId: assignedUserId ? parseInt(assignedUserId, 10) : null,
        // Enhanced healthcare fields
        facilityId,
        medicalRecordNumber,
        patientName,
        age: age ? parseInt(age, 10) : null,
        gender,
        admissionDate: admissionDate ? new Date(admissionDate) : null,
        dischargeDate: dischargeDate ? new Date(dischargeDate) : null,
        primaryDiagnosis,
        currentDRG,
        openDate: openDate ? new Date(openDate) : null,
        closeDate: closeDate ? new Date(closeDate) : null
      },
      include: {
        assignedUser: {
          select: { userId: true, fullName: true, email: true, userRole: true }
        }
      }
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        caseId: newCase.caseId,
        userId: assignedUserId ? parseInt(assignedUserId, 10) : 1, // Default to first user
        activityType: 'case_created',
        description: `Case created for patient ${patientName || patientFhirId}`
      }
    });

    res.status(201).json(newCase);
  } catch (error) {
    console.error('Error creating case:', error);
    res.status(500).json({ error: 'Failed to create case' });
  }
});

// PUT /api/cases/:id - Update case
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const caseId = parseInt(id, 10);
    const updateData = req.body;

    if (isNaN(caseId)) {
      return res.status(400).json({ error: 'Invalid case ID' });
    }

    // Remove id from update data if present
    delete updateData.caseId;

    // Convert assignedUserId to number if provided
    if (updateData.assignedUserId) {
      updateData.assignedUserId = parseInt(updateData.assignedUserId, 10);
    }

    const updatedCase = await prisma.case.update({
      where: { caseId },
      data: updateData,
      include: {
        assignedUser: {
          select: { userId: true, fullName: true, email: true, userRole: true }
        }
      }
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        caseId,
        userId: updateData.assignedUserId || 1,
        activityType: 'case_updated',
        description: 'Case details updated'
      }
    });

    res.json(updatedCase);
  } catch (error) {
    console.error('Error updating case:', error);
    res.status(500).json({ error: 'Failed to update case' });
  }
});

// DELETE /api/cases/:id - Delete case
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const caseId = parseInt(id, 10);

    if (isNaN(caseId)) {
      return res.status(400).json({ error: 'Invalid case ID' });
    }

    // Delete related records first (due to foreign key constraints)
    await prisma.activityLog.deleteMany({ where: { caseId } });
    
    // Delete CDI evidence first, then CDI reviews
    const cdiReview = await prisma.cDI_Reviews.findUnique({ where: { caseId } });
    if (cdiReview) {
      await prisma.cDI_Evidence.deleteMany({ 
        where: { cdiReviewId: cdiReview.cdiReviewId } 
      });
      await prisma.query.deleteMany({ 
        where: { cdiReviewId: cdiReview.cdiReviewId } 
      });
      await prisma.cDI_Reviews.delete({ 
        where: { caseId } 
      });
    }
    
    // Delete denials
    await prisma.denial.deleteMany({ where: { caseId } });

    // Delete the case
    await prisma.case.delete({ where: { caseId } });

    res.json({ message: 'Case deleted successfully' });
  } catch (error) {
    console.error('Error deleting case:', error);
    res.status(500).json({ error: 'Failed to delete case' });
  }
});

export default router;

// --- AI/Workflow routes ---

// POST /api/cases/:id/enrich/prebill - Trigger pre-bill enrichment for a single case
router.post('/:id/enrich/prebill', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const caseId = parseInt(id, 10);
    if (isNaN(caseId)) return res.status(400).json({ error: 'Invalid case ID' });

    const theCase = await prisma.case.findUnique({ where: { caseId } });
    if (!theCase) return res.status(404).json({ error: 'Case not found' });

    const analysis = await runPreBillAnalysisForEncounter(theCase.encounterFhirId);
    const review = await persistPreBillResults(caseId, analysis);

    return res.json({ caseId, cdiReviewId: review.cdiReviewId, status: review.status });
  } catch (error: any) {
    console.error('Error running pre-bill enrichment:', error);
    return res.status(500).json({ error: error?.message || 'Failed to run pre-bill enrichment' });
  }
});

// POST /api/cases/enrich/prebill/bulk - Trigger pre-bill enrichment for many cases
router.post('/enrich/prebill/bulk', async (req: Request, res: Response) => {
  try {
    const limit = Math.max(1, Math.min(100, parseInt((req.query.limit as string) || (req.body?.limit as string) || '25', 10)));
    const onlyMissing = ((req.query.onlyMissing as string) || (req.body?.onlyMissing as string) || 'true').toLowerCase() !== 'false';

    const where: any = {};
    if (onlyMissing) where.cdiReview = { is: null };

    const candidates = await prisma.case.findMany({
      where,
      select: { caseId: true, encounterFhirId: true },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    const results: Array<{ caseId: number; ok: boolean; error?: string }> = [];
    for (const c of candidates) {
      try {
        const analysis = await runPreBillAnalysisForEncounter(c.encounterFhirId);
        await persistPreBillResults(c.caseId, analysis);
        results.push({ caseId: c.caseId, ok: true });
      } catch (e: any) {
        results.push({ caseId: c.caseId, ok: false, error: e?.message || String(e) });
      }
    }

    const succeeded = results.filter(r => r.ok).length;
    const failed = results.length - succeeded;
    return res.json({ total: results.length, succeeded, failed, results });
  } catch (error: any) {
    console.error('Error running bulk pre-bill enrichment:', error);
    return res.status(500).json({ error: error?.message || 'Failed to run bulk pre-bill enrichment' });
  }
});
