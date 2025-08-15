// Legacy relational ORM removed; now using Cosmos-backed CaseRepository
import CaseRepository from '../repositories/case.repository';
import { Request, Response, Router } from 'express';
import { getGroundedIcdResponse } from '../services/rag.service';
import { getConversationalResponse } from '../services/responses-api.service';
import { runPreBillAnalysisForEncounter } from '../workflows/pre-bill.workflow';

const router: Router = Router();


// GET /api/cases - List cases with filtering and pagination
router.get('/', async (req: Request, res: Response) => {
  try {
    if (process.env.SAFE_MODE === 'true') {
      const limitNum = parseInt(String((req.query?.limit as string) || '10'), 10);
      return res.json({ cases: [], pagination: { page: 1, limit: limitNum, total: 0, pages: 0 } });
    }
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
    // Filtering handled client-side in repository (future: move to server-side queries)
    if (status || priority || assignedUserId || search) {
      // Placeholder: raw filtering handled within CaseRepository.list() call parameters
    }

    if (search) {
      // Legacy relational search patterns; repository will perform simple substring checks
      // TODO: implement proper indexed search in Cosmos
    }

    const { cases, total } = await CaseRepository.list({
      page: pageNum,
      limit: limitNum,
      status: status as string | undefined,
      priority: priority as string | undefined,
      assignedUserId: assignedUserId as string | undefined,
      search: search as string | undefined
    });

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

    const theCase = await CaseRepository.get(caseId);
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

    const caseRecord = await CaseRepository.get(id);

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

    const newCase = await CaseRepository.create({
      title,
      description,
      patientFhirId,
      encounterFhirId,
      status: status as string | undefined,
      priority: priority as string | undefined,
      assignedUserId: assignedUserId as string | undefined,
      facilityId: facilityId as string | undefined,
      medicalRecordNumber: medicalRecordNumber as string | undefined,
      patientName: patientName as string | undefined,
      age: age ? parseInt(age, 10) : undefined,
      gender: gender as string | undefined,
      admissionDate: admissionDate as string | undefined,
      dischargeDate: dischargeDate as string | undefined,
      primaryDiagnosis: primaryDiagnosis as string | undefined,
      currentDRG: currentDRG as string | undefined,
      openDate: openDate as string | undefined,
      closeDate: closeDate as string | undefined
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

    const updatedCase = await CaseRepository.update(id, updateData);
    if (!updatedCase) return res.status(404).json({ error: 'Case not found' });
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

    const deleted = await CaseRepository.delete(id);
    if (!deleted) return res.status(404).json({ error: 'Case not found' });
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

    const theCase = await CaseRepository.get(id);
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

    const { cases: allCases } = await CaseRepository.list({ page: 1, limit: 1000 });
    let candidates = allCases;
    if (onlyMissing) {
      // Placeholder: original logic depended on relational joins; skipping filter for now
      candidates = allCases;
    }
    const candidatesLimited = candidates.slice(0, limit);

    const results: Array<{ caseId: string; ok: boolean; error?: string }> = [];
    for (const c of candidatesLimited) {
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
