# Appeals Drafting Engine Specification (Draft v0.1)
**Date:** 2025-08-14  
**Scope:** Automated generation of evidence-grounded appeal packets leveraging Evidence Graph.

## 1. Objectives
- Reduce denial resolution cycle time by automating initial appeal draft assembly.
- Ensure every assertion in draft cites authoritative nodes (Regulation, ClinicalFact, Code, KPIObservation).
- Provide explainable structure enabling reviewer trust & rapid edit approval.

## 2. Draft Packet Structure
| Section | Description | Source Composition |
|---------|-------------|--------------------|
| Header | Metadata (denial pattern id, payer, encounter, draft version) | DenialPattern + Encounter |
| Summary | One-paragraph overturn rationale | Generated (templated + retrieval facts) |
| Clinical Evidence | Structured fact list with code linkage | ClinicalFact + Code edges |
| Regulatory / Policy Citations | Relevant regulation excerpts & payer policies | Regulation nodes + EvidenceSource |
| Medical Necessity Argument | Synthesized narrative citing spans | RAG over facts + regulations |
| KPI Impact (Optional) | Quantitative framing (e.g., denial category trend) | KPIObservation + KPI edges |
| Requested Action | Explicit overturn request referencing codes | Template + Code |
| Appendix | Full provenance table (fact→source hashes) | EvidenceSource lineage |

## 3. Retrieval Input Contract
```json
{
  "denialPatternId": "DEN:PAYERA:CO45",
  "encounterId": "ENC-abc123",
  "options": {"includeKpi": true, "maxRegulations": 5}
}
```

## 4. Retrieval Pipeline
1. Load DenialPattern & linked Encounter context.
2. Resolve ClinicalFacts impacting pattern (edge filters FACT_CODE + DENIAL_PATTERN_FACT).
3. Expand Codes and Regulations (CODE_REG edges) with version validation.
4. Pull KPIObservations if option enabled and KPI links exist.
5. Assemble Evidence Bundle JSON (canonical ordering, deterministic hashes).

## 5. Draft Generation Flow
| Step | Component | Output |
|------|-----------|--------|
| A | Evidence Bundle Builder | bundle.json (facts, codes, regs, kpis) |
| B | Narrative Planner | outline (sections with intent tags) |
| C | Section Generator | raw section texts + token-level span maps |
| D | Citation Weaving | Insert citation markers referencing bundle ids |
| E | Compliance Guard | Validate required sections & prohibited PHI leakage |
| F | Confidence Annotator | Per-section confidence + missing evidence flags |

## 6. Explainability & Citation Model
- Each generated token span maps to one or more Evidence Bundle item IDs.
- Citation marker format: `[CIT:TYPE:ID]` replaced by formatted footnotes in final packet.
- Confidence scoring heuristic: coverage ratio (facts referenced / total retrieved) * regulation corroboration weight.

## 7. JSON Output Format (Abbreviated)
```json
{
  "packetId": "APPEAL-xyz-v1",
  "denialPatternId": "DEN:...",
  "sections": [
    {"id": "summary", "text": "...", "citations": ["CF:123","REG:HIPAA:164.312"], "confidence": 0.82},
    {"id": "clinical_evidence", "items": [{"factId": "CF:123", "codeIds": ["CODE:ICD10:I50.21"], "sources": ["EVID:aaa"]}]}
  ],
  "bundleHash": "sha256:...",
  "provenance": {"generatedAt": "ISO8601", "engineVersion": "0.1.0"}
}
```

## 8. Guardrails & Validation
| Check | Failure Condition | Mitigation |
|-------|-------------------|------------|
| Missing mandatory section | Section absent | Regenerate targeted section only |
| Uncited claim tokens | Span lacks evidence ID | Force retrieval expansion or drop sentence |
| Stale regulation version | supersededBy present | Replace with updated node; flag diff |
| PHI leakage risk | Non-whitelisted field patterns | De-identification filter pass |

## 9. Metrics & Telemetry
| Metric | Purpose |
|--------|---------|
| generation_latency_ms | Performance SLA |
| citation_density | Evidence richness tracking |
| coverage_ratio | Evidence completeness quality |
| reviewer_edit_distance | Post-edit effort benchmark |
| overturn_prediction_gap | Calibration for ML uplift |

## 10. Open Questions
- Do we score per-evidence item confidence vs aggregate section only?
- Should KPI impact always be included for payer persuasion or optional?
- Appeal packet diff storage granularity (section vs sentence)?

## 11. Next Steps
1. Finalize JSON schema & validation code.  
2. Prototype Evidence Bundle Builder function.  
3. Implement narrative planner heuristics (rule + small LLM prompt).  
4. Build citation weaving component & tests.  
5. Define PHI leakage regex whitelist/blacklist set.  
