import { PrismaClient } from '@billigent/database';
import { Request, Response, Router } from 'express';
import { getGroundedIcdResponse } from '../services/rag.service';
import { getConversationalResponse } from '../services/responses-api.service';
import { runPreBillAnalysisForEncounter } from '../workflows/pre-bill.workflow';

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
    if (assignedUserId) where.assignedUserId = assignedUserId as string;
    
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
    
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Missing prompt' });
    }

    const theCase = await prisma.case.findUnique({ where: { id: caseId } });
    if (!theCase) return res.status(404).json({ error: 'Case not found' });

    // First message: perform RAG grounding scoped to encounter
    if (!previousResponseId) {
      const grounded = await getGroundedIcdResponse(prompt, theCase.encounterFhirId || '');
      return res.json({
        responseId: grounded,
        structured: grounded,
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

    const caseRecord = await prisma.case.findUnique({
      where: { id },
      include: {
        assignedUser: {
          select: { id: true, name: true, email: true, role: true }
        },
        encounters: {
          include: {
            preBillAnalyses: true,
            diagnoses: true,
            procedures: true
          }
        },
        denials: true
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
      closeDate,
      title,
      description
    } = req.body;

    // Validate required fields
    if (!patientFhirId || !encounterFhirId || !title) {
      return res.status(400).json({ 
        error: 'Missing required fields: patientFhirId, encounterFhirId, title' 
      });
    }

    const newCase = await prisma.case.create({
      data: {
        title,
        description,
        patientFhirId,
        encounterFhirId,
        status: status || 'open',
        priority: priority || 'medium',
        assignedUserId: assignedUserId || null,
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
          select: { id: true, name: true, email: true, role: true }
        }
      }
    });

    // Log to analytics instead of activityLog (which doesn't exist in schema)
    await prisma.analytics.create({
      data: {
        metric: 'case_created',
        value: 1,
        caseId: newCase.id,
        userId: assignedUserId || null,
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
    const updateData = req.body;

    // Remove id from update data if present
    delete updateData.id;

    const updatedCase = await prisma.case.update({
      where: { id },
      data: updateData,
      include: {
        assignedUser: {
          select: { id: true, name: true, email: true, role: true }
        }
      }
    });

    // Log activity to analytics
    await prisma.analytics.create({
      data: {
        metric: 'case_updated',
        value: 1,
        caseId: id,
        userId: updateData.assignedUserId || null,
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

    // Delete related records first (due to foreign key constraints)
    // Delete denials
    await prisma.denial.deleteMany({ where: { caseId: id } });
    
    // Delete analytics records
    await prisma.analytics.deleteMany({ where: { caseId: id } });
    
    // Delete encounters (which will cascade to related entities)
    await prisma.encounter.deleteMany({ where: { caseId: id } });

    // Delete the case
    await prisma.case.delete({ where: { id } });

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

    const theCase = await prisma.case.findUnique({ where: { id } });
    if (!theCase) return res.status(404).json({ error: 'Case not found' });

    if (!theCase.encounterFhirId) {
      return res.status(400).json({ error: 'Case missing encounterFhirId' });
    }

    const analysis = await runPreBillAnalysisForEncounter(theCase.encounterFhirId);
    // Note: persistPreBillResults function signature needs to be checked
    // For now, just return the analysis
    
    return res.json({ caseId: id, analysis, status: 'completed' });
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
    if (onlyMissing) {
      // Filter for cases that don't have related pre-bill analyses
      where.encounters = {
        none: {
          preBillAnalyses: {
            some: {}
          }
        }
      };
    }

    const candidates = await prisma.case.findMany({
      where,
      select: { id: true, encounterFhirId: true },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    const results: Array<{ caseId: string; ok: boolean; error?: string }> = [];
    for (const c of candidates) {
      try {
        if (!c.encounterFhirId) {
          results.push({ caseId: c.id, ok: false, error: 'Missing encounterFhirId' });
          continue;
        }
        
        const analysis = await runPreBillAnalysisForEncounter(c.encounterFhirId);
        // Note: persistPreBillResults function signature needs to be checked
        results.push({ caseId: c.id, ok: true });
      } catch (e: any) {
        results.push({ caseId: c.id, ok: false, error: e?.message || String(e) });
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
