/**
 * Strategy prototype routes exposing evidence bundle, appeal draft, attribution, and rule evaluation.
 */
import { Router } from 'express';
import { evidenceGraph } from '../strategy/evidenceGraph';
import { buildAppealDraft } from '../strategy/appealSample';
import { buildAttribution, validateAttribution } from '../strategy/explainability';
import { parseRule, evaluate } from '../strategy/kpiRulesDsl';
import { eventPublisher, makeEvent } from '../strategy/events';

const router = Router();

router.get('/evidence/:patternId/:encounterId', (req, res) => {
  const { patternId, encounterId } = req.params;
  const bundle = evidenceGraph.buildEvidenceBundle(patternId, encounterId, { includeKpi: true, maxRegulations: 5 });
  if (!bundle) return res.status(404).json({ error: 'Pattern not found' });
  eventPublisher.publish(makeEvent('query_generated', { queryId: bundle.bundleHash, denialPatternId: patternId }));
  return res.json(bundle);
});

router.get('/appeal/:patternId/:encounterId', (req, res) => {
  const { patternId, encounterId } = req.params;
  const bundle = evidenceGraph.buildEvidenceBundle(patternId, encounterId, { includeKpi: true });
  if (!bundle) return res.status(404).json({ error: 'Pattern not found' });
  const draft = buildAppealDraft(bundle);
  const attribution = buildAttribution(draft.draftId, bundle.facts.map(f => f.id), bundle.codes.map(c => c.id));
  const validation = validateAttribution(attribution);
  eventPublisher.publish(makeEvent('appeal_draft_generated', { draftId: draft.draftId, encounterId, denialPatternId: patternId }));
  return res.json({ draft, attribution, validation });
});

router.post('/rule/eval', (req, res) => {
  const { rule, metrics } = req.body || {};
  if (typeof rule !== 'string' || !metrics || typeof metrics !== 'object') {
    return res.status(400).json({ error: 'Provide rule (string) and metrics (object)' });
  }
  try {
    const parsed = parseRule(rule);
    const fired: any[] = [];
    evaluate(parsed, metrics, (eventType, payload) => {
      eventPublisher.publish({ type: 'rule_fired', occurredAt: new Date().toISOString(), payload: { ruleName: parsed.name, ...payload }, version: '0.0.1' });
      fired.push(payload);
    });
    return res.json({ parsed, fired });
  } catch (e: any) {
    return res.status(400).json({ error: e.message });
  }
});

router.get('/events', (_req, res) => {
  return res.json(eventPublisher.getBuffer());
});

export default router;
