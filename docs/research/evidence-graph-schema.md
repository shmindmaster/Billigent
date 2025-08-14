# Evidence Graph Schema (Draft v0.1)
**Date:** 2025-08-14  
**Scope:** Core knowledge representation underpinning Prevention → Documentation → Appeal Loop, Explainability Layer, and KPI-to-Action Orchestration.

## 1. Objectives
- Unify heterogeneous artifacts (clinical facts, documentation, codes, denials, regulations, KPIs, queries, appeals) under a provenance-preserving, extensible graph.
- Enable deterministic retrieval slices for appeals drafting & query generation (RAG grounding).
- Power span-level explainability with reversible trace paths from any AI output back to authoritative sources.

## 2. Graph Concepts
| Node Type | Key Fields | Example | Source Provenance Strategy |
|-----------|-----------|---------|----------------------------|
| ClinicalFact | id, encounterId, text, extractedCodes[], confidence, sourceIds[] | "Acute systolic CHF" | NLP extraction referencing corpus + encounter doc meta |
| Code | id (codeSystem:code), system (ICD-10-CM, CPT), description, version | "ICD10:I50.21" | Authoritative code set import (version locked) |
| Regulation | id (reg:section), citation, title, bodyHash, effectiveDate, supersededBy? | "HIPAA:164.312" | Parsed + hashed regulation corpus lines |
| DenialPattern | id, payer, reasonCode, patternHash, priorRate, avoidable?, features[] | PayerA CO-45 auth mismatch | Aggregated denial feed normalization |
| KPI | id, name, definition, calcFormula, unit, dataDomain | initial_denial_rate | Standardized KPI registry (HFMA, internal) |
| QueryTemplate | id, intent (specificity|compliance), placeholders[], evidenceBindings[] | MCC specificity query skeleton | Authored + versioned templates |
| AppealPacket | id, denialId, draftVersion, sections[], outcome?, submittedAt | Packet #A1234-v1 | Generated + reviewed artifacts |
| EvidenceSource | id (hash), type (primary|secondary), citation, url?, ingestionTs | HFMA MAP Keys doc hash | corpus.jsonl line hashed |
| Encounter | id, mrnHash, admissionDate, dischargeDate, serviceLine | ENC-abc123 | De-identified hashed patient link |
| KPIObservation | id, kpiId, periodStart, periodEnd, value, sourceSystem | KPIObs-... | ETL instrumentation |
| Rule | id, category (prevention|routing|appeal), expressionAST, version, active | RULE-DEN-REG-001 | DSL compiled form |

## 3. Relationships
| Edge | From → To | Cardinality | Semantics |
|------|-----------|-------------|-----------|
| FACT_CODE | ClinicalFact → Code | many:many | Clinical text supports coded concept |
| FACT_SOURCE | ClinicalFact → EvidenceSource | many:many | Provenance of fact extraction |
| CODE_REG | Code → Regulation | many:many | Regulation constrains/defines use or compliance context |
| DENIAL_PATTERN_FACT | DenialPattern → ClinicalFact | many:many | Fact absence/presence correlated with denial pattern |
| DENIAL_PATTERN_CODE | DenialPattern → Code | many:many | Specific codes driving pattern risk |
| KPI_OBSERVED_FOR | KPIObservation → KPI | many:1 | Observation instance for KPI definition |
| KPI_INFLUENCES_DENIAL | KPI → DenialPattern | many:many | KPI movement linked to pattern prevalence |
| QUERY_TEMPLATE_CODE | QueryTemplate → Code | many:many | Target codes specificity uplift |
| QUERY_TEMPLATE_FACT | QueryTemplate → ClinicalFact | many:many | Fact evidence placeholders |
| APPEAL_PACKET_DENIAL | AppealPacket → DenialPattern | many:1 | Packet addresses specific denial pattern instance |
| APPEAL_PACKET_SOURCE | AppealPacket → EvidenceSource | many:many | Citations embedded in draft |
| RULE_TARGET_KPI | Rule → KPI | many:many | Rule triggers on KPI thresholds |
| RULE_TARGET_DENIAL | Rule → DenialPattern | many:many | Rule acts on pattern detection |
| RULE_GENERATES_QUERY | Rule → QueryTemplate | many:many | Remediation action includes generating query |
| ENCOUNTER_FACT | Encounter → ClinicalFact | 1:many | Facts belong to encounter timeline |
| ENCOUNTER_DENIAL_PATTERN | Encounter → DenialPattern | 1:many | Encounter experienced denial pattern |

## 4. Identity & Versioning
- Deterministic IDs: Use prefixed semantic keys (e.g., `CODE:ICD10:I50.21`, `REG:HIPAA:164.312`).
- Content Addressable Hash: `bodyHash = sha256(normalizedText)` for Regulation, EvidenceSource, QueryTemplate.
- Version Bump Policy: Increment `version` if semantic meaning or compliance requirement changes (not cosmetic formatting).

## 5. Provenance & Audit Fields
Common fields across nodes:
```json
{
  "createdAt": "ISO8601",
  "updatedAt": "ISO8601",
  "sourceIds": ["EVID:..."],
  "lineage": [{"op": "extraction|ingest|merge|transform", "ts": "ISO8601", "agent": "system|human", "details": {}}]
}
```

## 6. Retrieval Slices (Illustrative)
| Use Case | Graph Query Pattern | Output Shape |
|----------|---------------------|--------------|
| Appeal Drafting | DenialPattern + (FACT_CODE + CODE_REG + EvidenceSource) | Structured packet JSON |
| Query Recommendation | Encounter → missing specificity codes → related QueryTemplate + supporting Facts | Ranked template candidates |
| KPI Spike Diagnosis | KPIObservation delta → linked DenialPatterns → associated Rules + Facts | Root cause panel |

## 7. Storage & Implementation Notes
- Prototype Layer: Use Neo4j or TypeScript in-memory adjacency store for early iteration.
- Access API: GraphQL /gql endpoint or domain service exposing retrieval functions (`getAppealEvidenceBundle(denialPatternId)`).
- Consistency: Nightly integrity job validating referential edges & orphan detection.

## 8. Performance & Scaling Considerations
| Concern | Risk | Mitigation |
|---------|------|-----------|
| High fan-out pattern queries | Latency | Pre-compute pattern evidence bundles & cache |
| Rapid regulation updates | Stale citations | Hash diff monitor + invalidation queue |
| Large lineage chains | Payload bloat | Truncate lineage or paginate past N entries |

## 9. Open Questions
- Granularity of ClinicalFact (span-level vs sentence-level) for optimal explainability?
- Inclusion of payer policy documents as first-class Regulation nodes vs EvidenceSource only?
- Rule evaluation runtime (event-driven vs scheduled scans)?

## 10. Next Steps
1. Finalize ClinicalFact granularity decision.  
2. Draft JSON schema definitions for key node types.  
3. Prototype retrieval for appeal drafting scenario.  
4. Implement nightly integrity validator POC.  
