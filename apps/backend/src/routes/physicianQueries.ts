import { Router } from 'express';
// Migrated from ORM to Cosmos repositories
import PhysicianQueryRepository, { PhysicianQueryStatus, PhysicianQueryEventType } from '../repositories/physicianQuery.repository';
import PhysicianQueryAuditRepository from '../repositories/physicianQueryAudit.repository';
// Replaced appendAuditEvent with audit repository append
// TODO: import { requireRoles } from '../middleware/rbac';

/**
 * Physician Query Governance Routes (Initial Scaffold)
 * Feature flagged via ENABLE_PHYSICIAN_QUERIES env var.
 * Provides minimal draft -> send -> respond lifecycle with audit events.
 * NOTE: This scaffold is intentionally conservative; expand with RBAC + validation.
 */
const router = Router();
// Repositories encapsulate data access; no direct ORM client here

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
    // Template storage not yet migrated; fabricate minimal snapshot (future: fetch from dedicated container)
    const templateSnapshot = {
      code: templateCode,
      title: templateCode,
      bodyMarkup: freeTextSupplement || '',
      version: 1,
      guidance: null,
      clinicalIndicators: null
    };
    const pq = await PhysicianQueryRepository.create({
      templateSnapshot,
      createdById,
      assignedPhysicianId,
      caseId,
      encounterId,
      freeTextSupplement
    });
    await PhysicianQueryAuditRepository.append({ physicianQueryId: pq.id, eventType: PhysicianQueryEventType.CREATED, actorUserId: createdById, metadata: { templateCode } });
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
    const pq = await PhysicianQueryRepository.get(id);
    if (!pq) return res.status(404).json({ error: 'Not found' });
    if (pq.status !== PhysicianQueryStatus.DRAFT) return res.status(409).json({ error: 'Only draft can be sent' });
    const updated = await PhysicianQueryRepository.update(id, { status: PhysicianQueryStatus.SENT, draft: false, sentAt: new Date().toISOString(), statusUpdatedAt: new Date().toISOString() });
    if (!updated) return res.status(500).json({ error: 'Failed to update status' });
    await PhysicianQueryAuditRepository.append({ physicianQueryId: id, eventType: PhysicianQueryEventType.SENT, actorUserId: actorUserId || updated.createdById, previousStatus: PhysicianQueryStatus.DRAFT, newStatus: PhysicianQueryStatus.SENT });
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
    const pq = await PhysicianQueryRepository.get(id);
    if (!pq) return res.status(404).json({ error: 'Not found' });
    if (pq.status !== PhysicianQueryStatus.SENT) return res.status(409).json({ error: 'Only sent queries can be responded' });

    // Store response inline for now (future: separate container if needed)
    const updated = await PhysicianQueryRepository.update(id, { status: PhysicianQueryStatus.RESPONDED, respondedAt: new Date().toISOString(), statusUpdatedAt: new Date().toISOString(), draft: false, freeTextSupplement: responseText || pq.freeTextSupplement });
    if (!updated) return res.status(500).json({ error: 'Failed to update' });
    await PhysicianQueryAuditRepository.append({ physicianQueryId: id, eventType: PhysicianQueryEventType.RESPONDED, actorUserId: responderId, previousStatus: PhysicianQueryStatus.SENT, newStatus: PhysicianQueryStatus.RESPONDED, metadata: { responseType } });
    res.json({ query: updated, response: { responderId, responseType, responseText } });
  } catch (e) {
    console.error('Respond physician query failed', e);
    res.status(500).json({ error: 'Failed to respond to physician query' });
  }
});

// Basic list
router.get('/', async (_req, res) => {
  const { queries } = await PhysicianQueryRepository.list({ limit: 50, page: 1 });
  res.json(queries);
});

// Quick dev-only audit chain view (no RBAC enforced intentionally per dev preference)
router.get('/:id/audit', async (req, res) => {
  try {
    const { id } = req.params;
    const events = await PhysicianQueryAuditRepository.list(id);
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