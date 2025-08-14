# Instrumentation & Logging Specification (Draft v0.1)
**Date:** 2025-08-14  
**Scope:** Telemetry required to enable Learning Loop (Prevention → Documentation → Appeal) & model performance governance.

## 1. Objectives
- Support measurement of strategic pillar KPIs & hypothesis validation.
- Enable traceability from production AI output back to evidence graph & model version.
- Provide data foundation for rules tuning & model retraining.

## 2. Event Taxonomy
| Event Type | Purpose | Key Fields |
|------------|---------|-----------|
| query_generated | Track auto-generated physician query | queryId, encounterId, templateId, modelVersion, attributionHash |
| query_accepted | Physician accepted query | queryId, acceptedAt, turnaroundMinutes, modificationsHash |
| query_rejected | Physician rejected query | queryId, reasonCategory |
| appeal_draft_generated | Appeal draft created | packetId, denialPatternId, modelVersion, citationDensity, bundleHash |
| appeal_packet_submitted | Packet submitted externally | packetId, submittedAt, editDistance, overturnOutcome? |
| rule_fired | KPI/denial rule emitted actions | ruleId, actions[], evaluationLatencyMs |
| kpi_observation_ingested | New KPI observation | kpiId, value, periodStart, sourceSystem |
| denial_pattern_detected | Pattern detection event | patternId, encounterId, detectionConfidence |
| retrieval_latency | RAG performance metrics | requestId, phase, ms |
| explainability_gap | Gap flag raised | artifactType, artifactId, flagType |

## 3. Common Envelope
```json
{
  "eventId": "uuid",
  "eventType": "query_generated",
  "occurredAt": "ISO8601",
  "ingestedAt": "ISO8601",
  "actor": {"type": "system|user", "id": "svc-retrieval"},
  "env": {"deployment": "prod", "region": "us-east"},
  "payload": {"...": "..."}
}
```

## 4. Privacy & Compliance
| Concern | Control |
|---------|---------|
| PHI exposure in logs | Strict field allowlist; hashed encounter IDs |
| Regulation update drift | Regulation hash mismatch alert |
| Model lineage gaps | Required modelVersion + artifact hash fields |

## 5. Storage & Retention
| Layer | Technology (Candidate) | Retention | Use |
|-------|------------------------|-----------|-----|
| Hot streaming | Kafka / EventHub | 7–14d | Real-time rules & dashboards |
| Warm analytics | Columnar warehouse (Snowflake/Delta) | 12–18 mo | KPI trends, ML training |
| Cold archive | Object storage (Parquet) | 7 yrs (compliance) | Audit & reconstruction |

## 6. Derived Metrics
| Metric | Computation | Source Events |
|--------|-------------|---------------|
| query_acceptance_rate | accepted / generated | query_generated, query_accepted |
| appeal_cycle_time | submittedAt - draftGeneratedAt | appeal_draft_generated, appeal_packet_submitted |
| citation_density | citations / tokens | appeal_draft_generated (payload) |
| rule_precision_proxy | actions leading to accepted query or overturned appeal / total rule-fired actions | rule_fired + downstream events |
| model_drift_indicator | abs(predicted - actual KPI delta) rolling window | kpi_observation_ingested + model predictions |

## 7. Data Quality Checks
| Check | Method |
|-------|--------|
| Orphan query events | Left join query_generated to terminal states | Daily job |
| Missing attribution | NULL attributionHash in query_generated | Streaming validation |
| Latency SLO breach | retrieval_latency.phase > threshold | Alert rule |

## 8. Governance Dashboard (Initial Panels)
- Query Funnel: generated → accepted/rejected (by specialty, templateId).
- Appeals Throughput: drafts vs submissions vs overturn outcomes.
- Rule Fire Heatmap: volume by ruleId & success proxies.
- Explainability Gap Rate Trend.
- KPI Trend vs Model Prediction Overlay.

## 9. Open Questions
- Do we persist full model input feature vector snapshots for appeals (storage cost)?
- Granularity of denial pattern detection (per encounter vs aggregated batch)?
- Need per-specialty segmentation for appeals success modeling?

## 10. Next Steps
1. Finalize event field dictionary (data types, constraints).  
2. Define Kafka topic naming conventions.  
3. Implement validation middleware (schema registry).  
4. Draft Looker/Grafana dashboard wireframes.  
