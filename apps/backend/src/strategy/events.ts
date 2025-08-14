/**
 * Event schema interfaces & in-memory publisher stub per instrumentation-spec.
 */

// Expanded event taxonomy to cover persistence, ingestion and infrastructure lifecycle events used by routes.
export type StrategyEventType =
  | "query_generated"
  | "appeal_draft_generated"
  | "rule_fired"
  | "http_request"
  | "op_timing"
  | "sql_schema_initialized"
  | "sql_schema_initialization_failed"
  | "denial_pattern_stored"
  | "appeal_case_stored"
  | "appeal_case_status_updated"
  | "kpi_metric_stored"
  | "cosmos_containers_initialized"
  | "cosmos_initialization_failed"
  | "evidence_bundle_stored"
  | "attribution_tracking_stored"
  | "attribution_verification_updated"
  | "document_version_stored"
  | "collaboration_session_created"
  | "collaboration_session_updated"
  | "collaboration_activity_added"
  | "fhir_ingestion_completed"
  | "fhir_ingestion_failed"
  | "fhir_ingestion_scheduled"
  | "fhir_validation_completed"
  | "conversational_query";

export interface BaseEvent<T extends StrategyEventType, P> {
  type: T;
  occurredAt: string;
  payload: P;
  version: string;
}

export type QueryGeneratedEvent = BaseEvent<
  "query_generated",
  { queryId: string; denialPatternId: string }
>;
export type AppealDraftGeneratedEvent = BaseEvent<
  "appeal_draft_generated",
  { draftId: string; encounterId: string; denialPatternId: string }
>;
export type RuleFiredEvent = BaseEvent<
  "rule_fired",
  { ruleName: string; metric: string; value: number; threshold: number }
>;

export type HttpRequestEvent = BaseEvent<
  "http_request",
  {
    method: string;
    path: string;
    status: number;
    duration_ms: number;
    perfBucket: string;
    correlationId: string;
  }
>;
export type OpTimingEvent = BaseEvent<
  "op_timing",
  { label: string; status: string; duration_ms: number; correlationId: string }
>;

// Generic catch‑all event for newly added types where we have not yet defined a rich interface.
export type GenericStrategyEvent = BaseEvent<
  StrategyEventType,
  Record<string, any>
>;

export type StrategyEvent =
  | QueryGeneratedEvent
  | AppealDraftGeneratedEvent
  | RuleFiredEvent
  | HttpRequestEvent
  | OpTimingEvent
  | GenericStrategyEvent; // fallback union member

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
  getBuffer() {
    return [...this.buffer];
  }
  clear() {
    this.buffer = [];
  }
}

export const eventPublisher: EventPublisher = new InMemoryPublisher();

export function makeEvent<T extends StrategyEventType, P>(
  type: T,
  payload: P
): BaseEvent<T, P> {
  return {
    type,
    occurredAt: new Date().toISOString(),
    payload,
    version: "0.0.1",
  };
}
