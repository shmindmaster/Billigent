/**
 * Event schema interfaces & in-memory publisher stub per instrumentation-spec.
 */

export type StrategyEventType = 'query_generated' | 'appeal_draft_generated' | 'rule_fired' | 'http_request' | 'op_timing';

export interface BaseEvent<T extends StrategyEventType, P> {
  type: T;
  occurredAt: string;
  payload: P;
  version: string;
}

export type QueryGeneratedEvent = BaseEvent<'query_generated', { queryId: string; denialPatternId: string }>; 
export type AppealDraftGeneratedEvent = BaseEvent<'appeal_draft_generated', { draftId: string; encounterId: string; denialPatternId: string }>; 
export type RuleFiredEvent = BaseEvent<'rule_fired', { ruleName: string; metric: string; value: number; threshold: number }>; 

export type HttpRequestEvent = BaseEvent<'http_request', { method: string; path: string; status: number; duration_ms: number; perfBucket: string; correlationId: string; }>;
export type OpTimingEvent = BaseEvent<'op_timing', { label: string; status: string; duration_ms: number; correlationId: string; }>;

export type StrategyEvent = QueryGeneratedEvent | AppealDraftGeneratedEvent | RuleFiredEvent | HttpRequestEvent | OpTimingEvent;

export interface EventPublisher {
  publish: (event: StrategyEvent) => void;
  getBuffer: () => StrategyEvent[];
  clear: () => void;
}

const MAX_BUFFER = 5000; // simple cap to prevent unbounded growth
class InMemoryPublisher implements EventPublisher {
  private buffer: StrategyEvent[] = [];
  publish(event: StrategyEvent) {
    this.buffer.push(event);
    if (this.buffer.length > MAX_BUFFER) {
      // drop oldest 10% to amortize pruning cost
      this.buffer.splice(0, Math.ceil(MAX_BUFFER * 0.1));
    }
  }
  getBuffer() { return [...this.buffer]; }
  clear() { this.buffer = []; }
}

export const eventPublisher: EventPublisher = new InMemoryPublisher();

export function makeEvent<T extends StrategyEventType, P>(type: T, payload: P): BaseEvent<T, P> {
  return { type, occurredAt: new Date().toISOString(), payload, version: '0.0.1' };
}
