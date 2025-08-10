import { PrismaClient } from '@billigent/database';
import { Request, Response, Router } from 'express';
import multer from 'multer';
import { startPdfAnalysis, getResponse } from '../services/responses-api.service';

const router: Router = Router();
const prisma = new PrismaClient();
const upload = multer({ storage: multer.memoryStorage() });
// Fallback in-memory map when DB column `responseId` is not yet migrated
const pendingTaskByDenialId = new Map<number, string>();

// GET /api/denials - List denials with filtering
router.get('/', async (req: Request, res: Response) => {
  try {
    const { 
      page = '1', 
      limit = '10', 
      status,
      caseId
    } = req.query;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    // Build where clause
    const where: any = {};
    
    if (status) where.status = status;
    if (caseId) where.caseId = parseInt(caseId as string, 10);

    const [denials, total] = await Promise.all([
      prisma.denial.findMany({
        where,
        skip,
        take: limitNum,
        select: {
          denialId: true,
          claimFhirId: true,
          eobFhirId: true,
          denialReasonCode: true,
          deniedAmount: true,
          status: true,
          appealLetterDraft: true,
          denialDate: true,
          appealDeadline: true,
          appealSubmittedDate: true,
          appealStatus: true,
          finalOutcome: true,
          recoveredAmount: true,
          caseId: true,
          case: {
            select: {
              caseId: true,
              patientFhirId: true,
              encounterFhirId: true,
              status: true,
              assignedUser: { select: { userId: true, fullName: true, email: true } },
            },
          },
        },
        orderBy: { denialId: 'desc' },
      }),
      prisma.denial.count({ where }),
    ]);

    res.json({
      denials,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Error fetching denials:', error);
    res.status(500).json({ error: 'Failed to fetch denials' });
  }
});

// GET /api/denials/:id - Get denial by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const denialId = parseInt(id, 10);

    if (isNaN(denialId)) {
      return res.status(400).json({ error: 'Invalid denial ID' });
    }

    const denial = await prisma.denial.findUnique({
      where: { denialId },
      select: {
        denialId: true,
        claimFhirId: true,
        eobFhirId: true,
        denialReasonCode: true,
        deniedAmount: true,
        status: true,
        appealLetterDraft: true,
        denialDate: true,
        appealDeadline: true,
        appealSubmittedDate: true,
        appealStatus: true,
        finalOutcome: true,
        recoveredAmount: true,
        caseId: true,
        case: {
          select: {
            caseId: true,
            patientFhirId: true,
            encounterFhirId: true,
            assignedUser: { select: { userId: true, fullName: true, email: true, userRole: true } },
            activityLogs: {
              where: {
                activityType: { in: ['denial_created', 'denial_updated', 'appeal_drafted', 'appeal_submitted'] },
              },
              include: { user: { select: { userId: true, fullName: true, email: true } } },
              orderBy: { timestamp: 'desc' },
            },
          },
        },
      },
    });

    if (!denial) {
      return res.status(404).json({ error: 'Denial not found' });
    }

    res.json(denial);
  } catch (error) {
    console.error('Error fetching denial:', error);
    res.status(500).json({ error: 'Failed to fetch denial' });
  }
});

// POST /api/denials - Create new denial
// POST /api/denials - Create case & denial and start async PDF analysis (multipart)
router.post('/', upload.single('file'), async (req: Request, res: Response) => {
  try {
    // If no file is provided, fall back to legacy JSON creation flow
    if (!req.file) {
      const {
        caseId,
        claimFhirId,
        eobFhirId,
        denialReasonCode,
        deniedAmount,
        status,
        denialDate,
        appealDeadline,
        appealSubmittedDate,
        appealStatus,
        finalOutcome,
        recoveredAmount
      } = req.body;

      if (!caseId || !claimFhirId) {
        return res.status(400).json({ error: 'Missing required fields: caseId, claimFhirId' });
      }

      const existingCase = await prisma.case.findUnique({ where: { caseId: parseInt(caseId, 10) } });
      if (!existingCase) return res.status(404).json({ error: 'Case not found' });

      const newDenial = await prisma.denial.create({
        data: {
          caseId: parseInt(caseId, 10),
          claimFhirId,
          eobFhirId,
          denialReasonCode,
          deniedAmount: deniedAmount ? parseFloat(deniedAmount) : null,
          status: status || 'New',
          denialDate: denialDate ? new Date(denialDate) : null,
          appealDeadline: appealDeadline ? new Date(appealDeadline) : null,
          appealSubmittedDate: appealSubmittedDate ? new Date(appealSubmittedDate) : null,
          appealStatus,
          finalOutcome,
          recoveredAmount: recoveredAmount ? parseFloat(recoveredAmount) : null
        },
      });

      await prisma.analytics.create({
        data: {
          caseId: parseInt(caseId, 10),
          userId: existingCase.assignedUserId || 1,
          activityType: 'denial_created',
          description: `Denial created for claim ${claimFhirId} - Reason: ${denialReasonCode || 'Not specified'}`
        }
      });
      return res.status(201).json(newDenial);
    }

    // New async PDF analysis flow
    const file = req.file;
    const {
      patientFhirId,
      encounterFhirId,
      claimFhirId,
      eobFhirId,
    } = req.body as any;

    if (!patientFhirId || !encounterFhirId || !claimFhirId) {
      return res.status(400).json({ error: 'Missing required fields: patientFhirId, encounterFhirId, claimFhirId' });
    }

    // Upsert case using unique encounterFhirId
    const newCase = await prisma.case.upsert({
      where: { encounterFhirId },
      update: { status: 'Open' },
      create: {
        patientFhirId,
        encounterFhirId,
        status: 'Open',
      },
    });

    // Compose the instructional prompt
    const prompt = `You are a denials management expert. Analyze the attached denial PDF. Identify the denial reason code, a summary of the denial, the payer name, and the denied amount. Then, using the provided clinical history for encounter ID ${encounterFhirId}, generate a complete, evidence-based appeal letter.`;

    // Start background analysis
    const taskId = await startPdfAnalysis(file.buffer, prompt);

    // Create denial with status Analyzing and store responseId
    const createdDenial = await prisma.denial.create({
      data: {
        caseId: newCase.caseId,
        claimFhirId,
        eobFhirId,
        status: 'Analyzing',
        // responseId may not exist in DB if migration not applied (handled by catch below)
        responseId: taskId as any,
      },
      select: {
        denialId: true,
        claimFhirId: true,
        eobFhirId: true,
        denialReasonCode: true,
        deniedAmount: true,
        status: true,
        appealLetterDraft: true,
        denialDate: true,
        appealDeadline: true,
        appealSubmittedDate: true,
        appealStatus: true,
        finalOutcome: true,
        recoveredAmount: true,
        caseId: true,
        case: {
          select: {
            caseId: true,
            patientFhirId: true,
            encounterFhirId: true,
            status: true,
            assignedUser: { select: { userId: true, fullName: true, email: true } },
          },
        },
      },
    }).catch(async (err: any) => {
      console.warn('responseId column may be missing, creating without it:', err?.message);
      const denial = await prisma.denial.create({
        data: {
          caseId: newCase.caseId,
          claimFhirId,
          eobFhirId,
          status: 'Analyzing',
        },
        select: {
          denialId: true,
          claimFhirId: true,
          eobFhirId: true,
          denialReasonCode: true,
          deniedAmount: true,
          status: true,
          appealLetterDraft: true,
          denialDate: true,
          appealDeadline: true,
          appealSubmittedDate: true,
          appealStatus: true,
          finalOutcome: true,
          recoveredAmount: true,
          caseId: true,
        },
      });
      pendingTaskByDenialId.set(denial.denialId, taskId);
      return denial;
    });

    // Log activity
    await prisma.analytics.create({
      data: {
        caseId: newCase.caseId,
        userId: newCase.assignedUserId || 1,
        activityType: 'denial_created',
        description: `Denial created and analysis started for claim ${claimFhirId}`,
      },
    });

    return res.status(201).json(createdDenial);
  } catch (error: any) {
    console.error('Error creating denial:', error);
    return res.status(500).json({ error: error?.message || 'Failed to create denial' });
  }
});

// PUT /api/denials/:id - Update denial
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const denialId = parseInt(id, 10);
    const updateData = req.body;

    if (isNaN(denialId)) {
      return res.status(400).json({ error: 'Invalid denial ID' });
    }

    // Remove denialId from update data if present
    delete updateData.denialId;

    // Convert numeric fields if provided
    if (updateData.deniedAmount) {
      updateData.deniedAmount = parseFloat(updateData.deniedAmount);
    }
    if (updateData.recoveredAmount) {
      updateData.recoveredAmount = parseFloat(updateData.recoveredAmount);
    }

    // Convert date fields if provided
    if (updateData.denialDate) {
      updateData.denialDate = new Date(updateData.denialDate);
    }
    if (updateData.appealDeadline) {
      updateData.appealDeadline = new Date(updateData.appealDeadline);
    }
    if (updateData.appealSubmittedDate) {
      updateData.appealSubmittedDate = new Date(updateData.appealSubmittedDate);
    }

    const updatedDenial = await prisma.denial.update({
      where: { denialId },
      data: updateData,
      select: {
        denialId: true,
        claimFhirId: true,
        eobFhirId: true,
        denialReasonCode: true,
        deniedAmount: true,
        status: true,
        appealLetterDraft: true,
        denialDate: true,
        appealDeadline: true,
        appealSubmittedDate: true,
        appealStatus: true,
        finalOutcome: true,
        recoveredAmount: true,
        caseId: true,
        case: {
          select: {
            caseId: true,
            patientFhirId: true,
            encounterFhirId: true,
            assignedUser: { select: { userId: true, fullName: true, email: true } },
          },
        },
      },
    });

    // Log activity based on status changes
    let activityType = 'denial_updated';
    let description = 'Denial details updated';

    if (updateData.status === 'DraftingAppeal') {
      activityType = 'appeal_drafted';
      description = 'Appeal letter being drafted';
    } else if (updateData.status === 'AppealSubmitted') {
      activityType = 'appeal_submitted';
      description = 'Appeal submitted for review';
    } else if (updateData.appealStatus) {
      activityType = 'appeal_status_updated';
      description = `Appeal status changed to: ${updateData.appealStatus}`;
    } else if (updateData.finalOutcome) {
      activityType = 'appeal_outcome_recorded';
      description = `Final outcome recorded: ${updateData.finalOutcome}`;
    }

    await prisma.analytics.create({
      data: {
        caseId: updatedDenial.caseId,
        userId: updatedDenial.case.assignedUser?.userId || 1,
        activityType,
        description
      }
    });

    res.json(updatedDenial);
  } catch (error) {
    console.error('Error updating denial:', error);
    res.status(500).json({ error: 'Failed to update denial' });
  }
});

// DELETE /api/denials/:id - Delete denial
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const denialId = parseInt(id, 10);

    if (isNaN(denialId)) {
      return res.status(400).json({ error: 'Invalid denial ID' });
    }

    // Get denial info for logging before deletion
    const denial = await prisma.denial.findUnique({
      where: { denialId },
      include: { case: true }
    });

    if (!denial) {
      return res.status(404).json({ error: 'Denial not found' });
    }

    // Delete the denial
    await prisma.denial.delete({ where: { denialId } });

    // Log activity
    await prisma.analytics.create({
      data: {
        caseId: denial.caseId,
        userId: denial.case.assignedUserId || 1,
        activityType: 'denial_deleted',
        description: `Denial deleted for claim ${denial.claimFhirId}`
      }
    });

    res.json({ message: 'Denial deleted successfully' });
  } catch (error) {
    console.error('Error deleting denial:', error);
    res.status(500).json({ error: 'Failed to delete denial' });
  }
});

// GET /api/denials/:denialId/status - Poll status of async analysis
router.get('/:denialId/status', async (req: Request, res: Response) => {
  try {
    const denialId = parseInt(req.params.denialId, 10);
    if (isNaN(denialId)) return res.status(400).json({ error: 'Invalid denial ID' });

    const denial = await prisma.denial.findUnique({ where: { denialId }, select: { status: true } });
    if (!denial) return res.status(404).json({ error: 'Denial not found' });

    const responseId = pendingTaskByDenialId.get(denialId);
    if (!responseId) {
      return res.json({ status: denial.status || 'Unknown' });
    }

    const resp = await getResponse(responseId);
    const status = String((resp as any)?.status || '').toLowerCase();

    if (status === 'queued' || status === 'in_progress') {
      return res.json({ status: 'Analyzing' });
    }

    if (status === 'completed' || status === 'succeeded' || status === 'processed') {
      // Extract appeal letter text from response
      const text = (resp as any)?.output_text
        ?? (Array.isArray((resp as any)?.output)
          ? (resp as any).output
              .flatMap((o: any) => o?.content || [])
              .filter((c: any) => c?.type === 'output_text' || c?.type === 'text')
              .map((c: any) => c.text)
              .join('\n')
          : undefined)
        ?? '';

      await prisma.denial.update({
        where: { denialId },
        data: { status: 'ReadyForReview', appealLetterDraft: text },
      });
      pendingTaskByDenialId.delete(denialId);

      return res.json({ status: 'ReadyForReview', appealLetterDraft: text });
    }

    if (status === 'failed' || status === 'error') {
      await prisma.denial.update({ where: { denialId }, data: { status: 'AnalysisFailed' } });
      pendingTaskByDenialId.delete(denialId);
      return res.status(500).json({ status: 'AnalysisFailed', error: 'Analysis failed' });
    }

    // Fallback: return raw status
    return res.json({ status: (resp as any)?.status || 'Unknown' });
  } catch (error: any) {
    console.error('Error polling denial status:', error);
    return res.status(500).json({ error: error?.message || 'Failed to poll denial status' });
  }
});

export default router;

