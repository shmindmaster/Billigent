import { Request, Response, NextFunction } from 'express';
import { eventPublisher, makeEvent } from '../strategy/events';
import { randomUUID } from 'crypto';

/**
 * Correlation + latency metrics middleware.
 * Adds a correlationId (traceparent fallback) and measures request duration.
 * Emits structured log line via console (future: route to event publisher / metrics sink).
 */
export function metricsMiddleware(req: Request, res: Response, next: NextFunction) {
  // Expose timing helper factory for route-level granular timings (non-async convenience)
  (req as any).timeOp = (label: string) => {
    const opStart = process.hrtime.bigint();
    return (status: string = 'ok') => {
      const opEnd = process.hrtime.bigint();
      const ms = Number(opEnd - opStart) / 1_000_000;
      const evt = makeEvent('op_timing', { label, status, duration_ms: ms, correlationId: (req as any).correlationId });
      eventPublisher.publish(evt);
      console.log(JSON.stringify({ ts: new Date().toISOString(), level: 'info', type: 'op_timing', label, status, duration_ms: ms, correlationId: (req as any).correlationId }));
    };
  };

  const start = process.hrtime.bigint();
  // Re-use inbound traceparent if present
  const existing = req.header('traceparent');
  const correlationId = existing || randomUUID();
  (req as any).correlationId = correlationId;
  res.setHeader('x-correlation-id', correlationId);
  const path = req.path;
  res.on('finish', () => {
    const end = process.hrtime.bigint();
    const ms = Number(end - start) / 1_000_000; // convert ns -> ms
    const payload = {
      ts: new Date().toISOString(),
      level: 'info',
      type: 'http_request',
      method: req.method,
      path,
      status: res.statusCode,
      duration_ms: ms,
      correlationId,
      perfBucket: perfBucket(ms)
    };
    // For now console.log; future: push to event publisher or external telemetry
    // Publish as event for in-memory retrieval alongside logs
    eventPublisher.publish(makeEvent('http_request', { method: req.method, path, status: res.statusCode, duration_ms: ms, perfBucket: perfBucket(ms), correlationId }));
    console.log(JSON.stringify(payload));
  });
  next();
}

function perfBucket(ms: number): string {
  if (ms < 250) return 'fast';
  if (ms < 1000) return 'ok';
  if (ms < 2000) return 'slow';
  return 'critical';
}

/** Utility to time an async operation inside handlers (e.g., evidence bundle build). */
export async function timeOp<T>(label: string, correlationId: string, fn: () => Promise<T> | T): Promise<T> {
  const start = process.hrtime.bigint();
  try {
    const result = await fn();
    const end = process.hrtime.bigint();
    const ms = Number(end - start) / 1_000_000;
    eventPublisher.publish(makeEvent('op_timing', { label, status: 'ok', duration_ms: ms, correlationId }));
    console.log(JSON.stringify({ ts: new Date().toISOString(), level: 'info', type: 'op_timing', label, duration_ms: ms, correlationId }));
    return result;
  } catch (err) {
    const end = process.hrtime.bigint();
    const ms = Number(end - start) / 1_000_000;
    eventPublisher.publish(makeEvent('op_timing', { label, status: 'error', duration_ms: ms, correlationId }));
    console.log(JSON.stringify({ ts: new Date().toISOString(), level: 'error', type: 'op_timing', label, duration_ms: ms, correlationId, error: (err as any)?.message }));
    throw err;
  }
}
