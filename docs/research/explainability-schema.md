# Explainability & Attribution Schema (Draft v0.1)
**Date:** 2025-08-14  
**Scope:** Standard for representing traceable AI outputs across queries, specificity recommendations, and appeals drafting.

## 1. Objectives
- Provide deterministic, machine-readable mapping from output text spans to graph evidence items.
- Support auditor & clinician review with minimal cognitive overhead.
- Enable confidence scoring & risk gating (e.g., suppress low-confidence suggestions).

## 2. Conceptual Model
| Concept | Definition |
|---------|------------|
| OutputSpan | A contiguous range of characters (UTF-16 indices) within a generated section. |
| EvidenceRef | Reference to a graph node (ClinicalFact, Code, Regulation, KPIObservation) or composite derivation. |
| AttributionSet | Minimal set of EvidenceRefs required to justify an OutputSpan. |
| ConfidenceScore | Scalar in [0,1] derived from retrieval quality + consensus signals. |
| GapFlag | Marker indicating missing corroboration or partial coverage. |

## 3. JSON Schema (Abbreviated)
```json
{
  "sectionId": "summary",
  "text": "The patient's acute systolic heart failure supported by clinical findings ...",
  "spans": [
    {
      "spanId": "sp1",
      "start": 13,
      "end": 39,
      "evidence": [
        {"refType": "ClinicalFact", "id": "CF:123", "confidence": 0.92},
        {"refType": "Code", "id": "CODE:ICD10:I50.21", "confidence": 0.88}
      ],
      "completeness": 1.0,
      "gapFlags": []
    },
    {
      "spanId": "sp2",
      "start": 70,
      "end": 102,
      "evidence": [
        {"refType": "Regulation", "id": "REG:HIPAA:164.312", "confidence": 0.81}
      ],
      "completeness": 0.5,
      "gapFlags": ["missing_clinical_fact"]
    }
  ],
  "sectionConfidence": 0.86,
  "hash": "sha256:..."
}
```

## 4. Confidence Algorithm (v0.1)
```
sectionConfidence = weighted_mean(span.confidence, weight = span.length) * coverageBoost
where:
  span.confidence = mean(evidence.confidence) * completeness
  coverageBoost = min(1.1, 0.9 + (coveredFactCount / totalRetrievedFacts) * 0.2)
```

## 5. Gap Flags (Initial Set)
| Flag | Meaning | Impact |
|------|---------|--------|
| missing_clinical_fact | Regulation cited without supporting fact | Reduce confidence, reviewer attention |
| low_confidence_evidence | All evidence < threshold (e.g., 0.6) | Candidate for suppression |
| stale_regulation | supersededBy present | Force refresh before distribution |
| orphan_code | Code lacks linked fact in context | Suggest additional fact retrieval |

## 6. Validation Rules
| Rule | Condition | Action |
|------|----------|--------|
| Overlapping spans disallowed | span ranges intersect | Reject payload |
| EvidenceRefs must exist | Unknown graph id | Reject or soft-fail quarantine |
| Completeness bounds | not in [0,1] | Reject |
| Hash integrity | recompute != stored | Reject / recompute |

## 7. Storage & Retrieval
- Stored alongside packet / query artifact as `sectionId.attribution.json`.
- Query API: `GET /explainability/{artifactId}/{sectionId}` returns merged view.
- Hash chaining across sections to detect tampering.

## 8. Rendering Guidelines (UI)
| Element | Approach |
|---------|----------|
| Highlight | Color intensity scaled by confidence |
| Tooltip | Evidence list (type, id, short label, confidence) |
| Gap Badge | Icon with flag code & remediation hint |
| Filter | Toggle spans below confidence threshold |

## 9. Telemetry
| Metric | Purpose |
|--------|---------|
| avg_span_confidence | Quality trend |
| gap_flag_rate | Reliability monitoring |
| evidence_per_span | Retrieval richness |
| spans_per_1000_chars | Density heuristic |

## 10. Open Questions
- Do we collapse adjacent spans with identical evidence sets?
- Need hierarchical spans (phrase vs sentence) or flat sufficient?
- Should we persist derivation logic for composite evidence (multi-fact inference)?

## 11. Next Steps
1. Formal JSON Schema (AJV) generation.  
2. Implement confidence algorithm function + tests.  
3. Build validator & hash integrator.  
4. Prototype renderer spec (storybook).  
