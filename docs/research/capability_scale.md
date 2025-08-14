# Capability Scale Legend

Defines normalized enumerations used in `competitors.json` and forthcoming competitive matrices.

## Enumerated Dimensions

### Core Binary-Evolved Capabilities
| Field | Enum Values | Semantics |
|-------|-------------|-----------|
| `denial_prevention` | none \| partial \| full | Preventive analytics & controls depth (root cause capture, predictive risk scoring, workflow interception). |
| `cdi_query` | none \| partial \| full | Native compliant CDI query workflow depth ( authoring, governance, audit, physician response loop). |
| `appeal_automation` | none \| partial \| full | Degree of automated evidence synthesis & drafting ( none = manual only; partial = template assist; full = context-aware draft with cited evidence & regulatory mapping ). |

### Qualitative Depth Modifiers
| Field | Values | Guidance |
|-------|--------|----------|
| `analytics_depth` | moderate \| high | Breadth + drill-down sophistication (taxonomy coverage, payer segmentation, temporal & cohort analysis). |
| `ai_explainability` | low \| moderate \| high (future) | Transparency of AI outputs (reason codes, sourced evidence spans, uncertainty scoring). Currently all competitors = low; used to highlight whitespace opportunity. |

## Scoring Notes
- Enumerations are intentionally coarse to enable fast whitespace scanning.
- Future expansion may introduce: `emerging` (experimental feature) or `deprecating` (legacy capability being sunset) — keep out of JSON until at least two vendors qualify.
- Maintain consistency: never mix booleans with enumerated strings.

## Mapping to Market Needs
Forthcoming `competitive-analysis.md` will add `mappedNeeds[]` per competitor referencing PRD Market Needs table rows by a stable identifier (e.g., `need.initial_denial_rate_pressure`).

## Change Control
Revision 2025-08-14 (initial). All modifications must be logged in CHANGELOG with rationale.
