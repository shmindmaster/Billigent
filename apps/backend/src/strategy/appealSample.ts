/**
 * Legacy sample appeal draft generator (retained for potential testing).
 * NOTE: Real appeal drafting now required; remove references in runtime routes.
 */
import { EvidenceBundle } from './evidenceGraph';

export interface AppealDraftPacket {
  draftId: string;
  encounterId: string;
  denialPatternId: string;
  narrative: string;
  factCitations: { factId: string; sourceIds: string[] }[];
  codingJustification: string[];
  riskFlags: { type: string; message: string }[];
  confidence: number; // 0..1
  version: string;
}

export function buildAppealDraft(bundle: EvidenceBundle): AppealDraftPacket {
  const narrative = `Encounter ${bundle.encounterId} appeal for pattern ${bundle.denialPatternId}.` +
    ` Key facts: ${bundle.facts.map(f => f.text).join(' | ')}`;
  const factCitations = bundle.facts.map(f => ({ factId: f.id, sourceIds: f.sourceIds }));
  const codingJustification = bundle.codes.map(c => `${c.system}:${c.id.split(':').pop()} - ${c.description}`);
  const riskFlags: { type: string; message: string }[] = [];
  if (bundle.regulations.length === 0) riskFlags.push({ type: 'missing_reg', message: 'No supporting regulation linked' });
  const confidence = Math.min(1, 0.5 + bundle.facts.length * 0.1);
  return {
    draftId: 'APPEAL:' + bundle.bundleHash.slice(7, 19),
    encounterId: bundle.encounterId,
    denialPatternId: bundle.denialPatternId,
    narrative,
    factCitations,
    codingJustification,
    riskFlags,
    confidence,
    version: '0.0.1'
  };
}
