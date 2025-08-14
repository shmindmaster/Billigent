import { Router } from 'express';
import { PrismaClient, PhysicianQueryStatus, PhysicianQueryEventType } from '@billigent/database';
import { appendAuditEvent } from '../services/physicianQueryAudit';
// TODO: import { requireRoles } from '../middleware/rbac';

/**
 * Physician Query Governance Routes (Initial Scaffold)
 * Feature flagged via ENABLE_PHYSICIAN_QUERIES env var.
 * Provides minimal draft -> send -> respond lifecycle with audit events.
 * NOTE: This scaffold is intentionally conservative; expand with RBAC + validation.
 */
const router = Router();
const prisma = new PrismaClient();

// Feature flag removed (forcing always-on per dev directive)
function enabled(): boolean {
  return true; // always enabled now
}

// Middleware no longer blocks access; retained for potential future reinstatement
router.use((req, _res, next) => {
  next();
});

// Create draft physician query from template
router.post('/', async (req, res) => {
  try {
    const { templateCode, createdById, assignedPhysicianId, caseId, encounterId, freeTextSupplement } = req.body || {};
    if (!templateCode || !createdById || !assignedPhysicianId) {
      return res.status(400).json({ error: 'templateCode, createdById, assignedPhysicianId required' });
    }
    const template = await prisma.queryTemplate.findUnique({ where: { code: templateCode } });
    if (!template || !template.active) {
      return res.status(404).json({ error: 'Template not found or inactive' });
    }
    const pq = await prisma.physicianQuery.create({
      data: {
        templateId: template.id,
        templateVersion: template.version,
        templateSnapshot: {
          code: template.code,
            title: template.title,
            bodyMarkup: template.bodyMarkup,
            version: template.version,
            guidance: template.guidance,
            clinicalIndicators: template.clinicalIndicators
        },
        createdById,
        assignedPhysicianId,
        caseId,
        encounterId,
        freeTextSupplement,
        status: PhysicianQueryStatus.DRAFT
      }
    });
    await appendAuditEvent(prisma, { physicianQueryId: pq.id, eventType: PhysicianQueryEventType.CREATED, actorUserId: createdById, metadata: { templateCode } });
    res.status(201).json(pq);
  } catch (e) {
    console.error('Create physician query failed', e);
    res.status(500).json({ error: 'Failed to create physician query' });
  }
});

// Send a draft query
router.post('/:id/send', async (req, res) => {
  try {
    const { id } = req.params;
    const { actorUserId } = req.body || {};
    const pq = await prisma.physicianQuery.findUnique({ where: { id } });
    if (!pq) return res.status(404).json({ error: 'Not found' });
    if (pq.status !== PhysicianQueryStatus.DRAFT) return res.status(409).json({ error: 'Only draft can be sent' });
    const updated = await prisma.physicianQuery.update({
      where: { id },
      data: { status: PhysicianQueryStatus.SENT, draft: false, sentAt: new Date(), statusUpdatedAt: new Date() }
    });
    await appendAuditEvent(prisma, { physicianQueryId: id, eventType: PhysicianQueryEventType.SENT, actorUserId: actorUserId || updated.createdById, previousStatus: PhysicianQueryStatus.DRAFT, newStatus: PhysicianQueryStatus.SENT });
    res.json(updated);
  } catch (e) {
    console.error('Send physician query failed', e);
    res.status(500).json({ error: 'Failed to send physician query' });
  }
});

// Respond to a sent query
router.post('/:id/respond', async (req, res) => {
  try {
    const { id } = req.params;
    const { responderId, responseType, responseText } = req.body || {};
    if (!responderId || !responseType) return res.status(400).json({ error: 'responderId & responseType required' });
    const pq = await prisma.physicianQuery.findUnique({ where: { id } });
    if (!pq) return res.status(404).json({ error: 'Not found' });
    if (pq.status !== PhysicianQueryStatus.SENT) return res.status(409).json({ error: 'Only sent queries can be responded' });

    const response = await prisma.physicianQueryResponse.create({
      data: { physicianQueryId: id, responderId, responseType, responseText }
    });
    const updated = await prisma.physicianQuery.update({
      where: { id },
      data: { status: PhysicianQueryStatus.RESPONDED, respondedAt: new Date(), statusUpdatedAt: new Date() }
    });
    await appendAuditEvent(prisma, { physicianQueryId: id, eventType: PhysicianQueryEventType.RESPONDED, actorUserId: responderId, previousStatus: PhysicianQueryStatus.SENT, newStatus: PhysicianQueryStatus.RESPONDED, metadata: { responseType } });
    res.json({ query: updated, response });
  } catch (e) {
    console.error('Respond physician query failed', e);
    res.status(500).json({ error: 'Failed to respond to physician query' });
  }
});

// Basic list
router.get('/', async (_req, res) => {
  const list = await prisma.physicianQuery.findMany({ orderBy: { createdAt: 'desc' }, take: 50 });
  res.json(list);
});

// Quick dev-only audit chain view (no RBAC enforced intentionally per dev preference)
router.get('/:id/audit', async (req, res) => {
  try {
    const { id } = req.params;
    const events = await prisma.physicianQueryAuditEvent.findMany({
      where: { physicianQueryId: id },
      orderBy: { sequence: 'asc' }
    });
    if (events.length === 0) return res.status(404).json({ error: 'No audit events or query not found' });
    // Basic integrity verification: check chain linkage
    const brokenLinks: number[] = [];
    for (let i = 1; i < events.length; i++) {
      if (events[i].prevHash !== events[i - 1].hash) brokenLinks.push(events[i].sequence);
    }
    res.json({ events, integrity: brokenLinks.length === 0 ? 'OK' : 'BROKEN', brokenLinks });
  } catch (e) {
    console.error('Fetch audit chain failed', e);
    res.status(500).json({ error: 'Failed to fetch audit chain' });
  }
});

export default router;