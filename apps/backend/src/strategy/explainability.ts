/**
 * Explainability attribution validator (simplified) based on explainability-schema.
 */
import crypto from 'crypto';

export interface AttributionSpan {
  spanId: string;
  factId?: string;
  codeId?: string;
  weight: number; // raw weight
}

export interface AttributionPacket {
  packetId: string;
  draftId: string;
  spans: AttributionSpan[];
  normalization: 'l1';
  checksum: string;
  confidence: number; // heuristic
  version: string;
}

export function buildAttribution(draftId: string, factIds: string[], codeIds: string[]): AttributionPacket {
  const spans: AttributionSpan[] = [];
  factIds.forEach((f, i) => spans.push({ spanId: 'SPAN:F:' + i, factId: f, weight: 1 }));
  codeIds.forEach((c, i) => spans.push({ spanId: 'SPAN:C:' + i, codeId: c, weight: 0.5 }));
  // Normalize L1
  const total = spans.reduce((s, x) => s + x.weight, 0) || 1;
  spans.forEach(s => s.weight = s.weight / total);
  const raw = JSON.stringify(spans.map(s => ({ spanId: s.spanId, w: s.weight.toFixed(6) })));
  const checksum = 'sha1:' + crypto.createHash('sha1').update(raw).digest('hex');
  const confidence = spans.length > 0 ? 0.6 + Math.min(0.3, spans.length * 0.02) : 0.0;
  return { packetId: 'ATTR:' + draftId.split(':').pop(), draftId, spans, normalization: 'l1', checksum, confidence, version: '0.0.1' };
}

export function validateAttribution(packet: AttributionPacket): { valid: boolean; issues: string[] } {
  const issues: string[] = [];
  if (packet.spans.length === 0) issues.push('No spans present');
  const sum = packet.spans.reduce((s, x) => s + x.weight, 0);
  if (Math.abs(sum - 1) > 1e-6) issues.push('Weights not normalized');
  if (packet.spans.some(s => s.weight < 0)) issues.push('Negative weight detected');
  // recompute checksum
  const raw = JSON.stringify(packet.spans.map(s => ({ spanId: s.spanId, w: s.weight.toFixed(6) })));
  const expected = 'sha1:' + crypto.createHash('sha1').update(raw).digest('hex');
  if (expected !== packet.checksum) issues.push('Checksum mismatch');
  return { valid: issues.length === 0, issues };
}
