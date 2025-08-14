# Strategy Prototype Modules (A3 POC)

Implements minimal prototypes for A3 strategy pillars:

## Modules
- `evidenceGraph.ts` – In-memory evidence graph slice & bundle builder.
- `appealSample.ts` – Deterministic appeal draft packet generator.
- `explainability.ts` – Attribution packet builder + validator (L1 normalized).
- `kpiRulesDsl.ts` – Tiny tokenizer/parser/evaluator for KPI Rules DSL subset.
- `events.ts` – Event interfaces + in-memory publisher.
- `routes/strategy.ts` – Express routes exposing prototype behaviors.

## Endpoints
- `GET /api/strategy/evidence/:patternId/:encounterId` – Build evidence bundle.
- `GET /api/strategy/appeal/:patternId/:encounterId` – Appeal draft + attribution + validation.
- `POST /api/strategy/rule/eval` – Body: `{ "rule": "rule high_denial when initial_denial_rate > 0.08 then emit_event alert_high", "metrics": { "initial_denial_rate": 0.085 } }`.
- `GET /api/strategy/events` – Retrieve published prototype events.

## Notes
- All data is mock / in-memory; NOT for production.
- Seeding can be skipped via `SKIP_EVIDENCE_GRAPH_SEED=1`.
- Extend by swapping in real persistence & retrieval services.

## Accessibility
Generated with accessibility and clarity in mind. Review and test with assistive tooling before production use.
