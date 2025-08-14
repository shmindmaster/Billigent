import { PrismaClient, PhysicianQueryEventType, PhysicianQueryAuditEvent } from '@billigent/database';
import crypto from 'crypto';

/**
 * Minimal hash-chain audit event appender for physician queries.
 * Fast-path implementation (dev focus): sequence = max(sequence)+1, prevHash from last event.
 * Hash = SHA256 of JSON payload containing identifiers + sequence + prevHash + eventType + actor + metadata.
 */
export interface AppendAuditEventInput {
  physicianQueryId: string;
  eventType: PhysicianQueryEventType;
  actorUserId: string;
  previousStatus?: string | null;
  newStatus?: string | null;
  metadata?: Record<string, any>;
}

export async function appendAuditEvent(
  prisma: PrismaClient,
  input: AppendAuditEventInput
): Promise<PhysicianQueryAuditEvent> {
  const { physicianQueryId, eventType, actorUserId, previousStatus, newStatus, metadata } = input;

  const last = await prisma.physicianQueryAuditEvent.findFirst({
    where: { physicianQueryId },
    orderBy: { sequence: 'desc' }
  });
  const sequence = (last?.sequence || 0) + 1;
  const prevHash = last?.hash || null;

  const hashMaterial = JSON.stringify({ physicianQueryId, sequence, prevHash, eventType, actorUserId, previousStatus, newStatus, metadata });
  const hash = crypto.createHash('sha256').update(hashMaterial).digest('hex');

  return prisma.physicianQueryAuditEvent.create({
    data: {
      physicianQueryId,
      eventType,
      actorUserId,
      previousStatus: previousStatus ?? undefined,
      newStatus: newStatus ?? undefined,
      sequence,
      hash,
      prevHash,
      metadata: metadata || {}
    }
  });
}
