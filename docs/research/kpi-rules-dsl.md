# KPI-to-Action Rules DSL (Draft v0.1)
**Date:** 2025-08-14  
**Scope:** Domain-specific language to convert KPI anomalies & denial patterns into orchestrated remediation actions (queries, tasks, appeal generation) within the unified loop.

## 1. Objectives
- Declaratively define conditions on KPI trends, denial pattern emergence, and evidence graph signals.
- Output standardized actions (TASK, QUERY_GENERATE, APPEAL_DRAFT, RULE_ADJUST) with prioritization.
- Support simulation & dry-run for safety.

## 2. Core Concepts
| Concept | Definition |
|---------|------------|
| Trigger | Evaluated condition producing boolean activation. |
| Guard | Additional predicate gating execution. |
| Action | Structured payload executed when rule fires. |
| Priority | Integer or enum weighting work queue ranking. |
| Cooldown | Time window suppressing duplicate firings. |
| Aggregation | Temporal function (rolling_avg, pct_change). |

## 3. Rule Definition (YAML Form)
```yaml
id: RULE-DEN-REG-001
version: 1
meta:
  category: prevention
  description: Escalate when initial denial rate spike persists
  owner: ops-analytics
trigger:
  any:
    - kpi:
        id: need.initial_denial_pressure
        expr: pct_change(28d) > 0.10 AND current > 0.08
    - denial_pattern:
        id: DEN:PAYERA:CO45
        expr: rolling_avg(14d) > threshold("payerA_co45_baseline") * 1.15
guard:
  all:
    - kpi:
        id: need.kpi_visibility
        expr: data_completeness() = 1
cooldown: 7d
priority: HIGH
actions:
  - type: TASK
    payload:
      title: Investigate sustained spike in initial denials
      templateId: TASK-TPL-DEN-SPIKE-01
  - type: QUERY_GENERATE
    payload:
      targetEncounterSelector: last_30d_top10_risk_encounters()
      queryTemplateFilter: specificity_gap AND compliant
  - type: RULE_ADJUST
    payload:
      ruleId: RULE-DEN-REG-LOWSEVERITY
      adjustment: increase_sensitivity(0.05)
```

## 4. Expression Grammar (EBNF Sketch)
```
EXPR := OR_EXPR
OR_EXPR := AND_EXPR { 'OR' AND_EXPR }
AND_EXPR := NOT_EXPR { 'AND' NOT_EXPR }
NOT_EXPR := ['NOT'] PRIMARY
PRIMARY := COMPARISON | '(' EXPR ')'
COMPARISON := METRIC FUNC_OP VALUE
FUNC_OP := '>' | '<' | '>=' | '<=' | '=' | '!='
METRIC := IDENT '(' [ARGS] ')'
VALUE := NUMBER | IDENT | STRING
```

Supported metric functions: `pct_change(window)`, `rolling_avg(window)`, `current`, `data_completeness()`, `threshold(id)`.

## 5. Action Types
| Type | Fields | Semantics |
|------|--------|-----------|
| TASK | title, templateId, context | Creates remediation task ticket |
| QUERY_GENERATE | targetEncounterSelector, queryTemplateFilter | Generates physician queries |
| APPEAL_DRAFT | denialPatternId, encounterSelector | Produces draft appeal packets |
| RULE_ADJUST | ruleId, adjustment | Programmatically tunes other rules |

## 6. Runtime Evaluation Flow
1. Load rule set & active KPI / Denial metrics snapshot.
2. Evaluate triggers (short-circuit OR/AND).
3. Evaluate guards if trigger true.
4. Enforce cooldown (lastFiredAt + cooldown > now → skip).
5. Emit actions (batched) with metadata.
6. Persist evaluation log (ruleId, decision path, metrics snapshot hash).

## 7. Safety & Audit
| Concern | Control |
|---------|---------|
| Runaway action churn | Cooldown + idempotency keys |
| Silent failure | Evaluation log + alert on empty run delta |
| Rule drift | Versioned rules + checksum enforcement |
| Expression injection | Strict parsing + whitelist tokens |

## 8. Telemetry
| Metric | Use |
|--------|-----|
| rules_evaluated_count | Scale tracking |
| actions_emitted_count | Workload planning |
| avg_evaluation_latency_ms | Performance monitoring |
| rule_fire_rate | Noise vs signal ratio |

## 9. Open Questions
- Should priority be numeric (0–100) for finer scheduling?
- Need per-action success feedback loop for rule self-tuning?
- How to sandbox RULE_ADJUST to avoid recursive feedback loops?

## 10. Next Steps
1. Finalize grammar & implement parser (PEG or nearley).  
2. Draft selector helper function catalog.  
3. Build evaluator POC with in-memory metrics snapshot.  
4. Define action dispatcher interfaces.  
