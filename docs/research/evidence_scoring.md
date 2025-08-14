# Evidence Severity & Confidence Rubric

This rubric standardizes how we score market needs, regulatory obligations, and KPI pains in the PRD and downstream strategy docs.

## Severity (Impact) Scale (1–5)
| Score | Label | Definition | Financial / Operational Signal Examples | Compliance / Risk Signal Examples |
|-------|-------|------------|------------------------------------------|-----------------------------------|
| 1 | Trivial | Minimal localized annoyance; no measurable KPI movement | Minor UI friction; <0.1% workflow delay | None / informational guidance only |
| 2 | Low | Limited scope impact; small, recoverable leakage | Denial sub-cause with <1% of total volume | Advisory best practice (non-mandatory) |
| 3 | Moderate | Noticeable KPI drag; cumulative loss material over quarter | Denial driver 1–3% of volume; growing trend | Implicit policy expectations (payer audits) |
| 4 | High | Direct margin or throughput erosion if unaddressed | Root cause cluster 3–7% of volume OR slows cash by >5 days | Explicit standard / guideline; audit findings risk |
| 5 | Critical | Sustained impact threatens strategic targets or compliance posture | Aggregate drivers ≥10% volume or ≥$MM annual leakage | Regulatory safeguard / core control (HIPAA §164.312) |

## Confidence Levels
| Level | Criteria | Evidence Pattern |
|-------|---------|------------------|
| Low | Single secondary / tertiary source; recent primary pending | 1 non‑primary citation, no triangulation |
| Medium | At least one primary or authoritative standard plus secondary corroboration | 1 primary + 1 secondary OR 2 secondary independent |
| Medium‑High | Multiple independent primaries OR primary + formal industry KPI/standard | ≥2 distinct primary / standards bodies |
| High | Convergent multi‑source (≥2 primary + ≥1 standard) with recency ≤3 yrs | Primary dataset + standard + corroborative commentary |
| Very High | Longitudinal primary trend + current standard + governance mandate | Multi‑year dataset + formal rule (HIPAA/CMS) + KPI spec |

## Source Classification
| Class | Definition | Examples |
|-------|------------|----------|
| Primary | Direct dataset / official rule text / formal KPI definition | Change Healthcare Denials Index, HIPAA §164.312, HFMA KPI spec |
| Standard | Formal industry implementation guide / operating rule | CAQH CORE Issue Brief, AHIMA/ACDIS query practice |
| Secondary | Reputable synthesis citing primaries | OS Healthcare cost per denial article |
| Tertiary | Aggregated summaries, blogs, derivative explainers | KPI overview site |

## Scoring Procedure
1. Enumerate claim or documentation problem statement.
2. Extract quantitative & qualitative signals from primary / standard sources first.
3. Assign Severity: choose highest validated dimension (financial leakage %, compliance mandate criticality, cycle time impact) justified in annotation.
4. Assign Confidence: map to lowest-common denominator of the included sources set (cannot exceed evidence pattern present).
5. Record citation footnotes referencing `corpus.jsonl` entries.
6. Revisit quarterly or when new primary datasets (e.g., 2024 Denials Index full text) are ingested.

## Change Control
Any rubric adjustment requires: (a) update to this file, (b) CHANGELOG entry, (c) retroactive reassessment note if scale meaning altered.
