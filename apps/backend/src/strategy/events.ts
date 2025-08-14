/**
 * Event schema interfaces & in-memory publisher stub per instrumentation-spec.
 */

export type StrategyEventType = 'query_generated' | 'appeal_draft_generated' | 'rule_fired';

export interface BaseEvent<T extends StrategyEventType, P> {
  type: T;
  occurredAt: string;
  payload: P;
  version: string;
}

export type QueryGeneratedEvent = BaseEvent<'query_generated', { queryId: string; denialPatternId: string }>; 
export type AppealDraftGeneratedEvent = BaseEvent<'appeal_draft_generated', { draftId: string; encounterId: string; denialPatternId: string }>; 
export type RuleFiredEvent = BaseEvent<'rule_fired', { ruleName: string; metric: string; value: number; threshold: number }>; 

export type StrategyEvent = QueryGeneratedEvent | AppealDraftGeneratedEvent | RuleFiredEvent;

export interface EventPublisher {
  publish: (event: StrategyEvent) => void;
  getBuffer: () => StrategyEvent[];
  clear: () => void;
}

class InMemoryPublisher implements EventPublisher {
  private buffer: StrategyEvent[] = [];
  publish(event: StrategyEvent) {
    this.buffer.push(event);
  }
  getBuffer() { return [...this.buffer]; }
  clear() { this.buffer = []; }
}

export const eventPublisher: EventPublisher = new InMemoryPublisher();

export function makeEvent<T extends StrategyEventType, P>(type: T, payload: P): BaseEvent<T, P> {
  return { type, occurredAt: new Date().toISOString(), payload, version: '0.0.1' };
}
