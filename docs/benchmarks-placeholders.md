# Billigent Quantitative Benchmarks & Placeholder Metrics (v0.1)

**Date:** 2025-08-14  
**Status:** Draft (Evidence Collection Pending)  
**Purpose:** Establish target metric ranges & data gaps powering RICE scoring, KPI tree calibration, and Quality Gates. Each placeholder is tagged with a collection status and mapping to backlog item IDs (R#) plus planned corpus enrichment actions.

---
## 1. Metric Inventory Overview
| Code | Metric | Definition | Target (Provisional) | Source Status | Backlog Link | Collection Action | Notes |
|------|--------|------------|----------------------|---------------|--------------|-------------------|-------|
| M1 | Initial Denial Rate (IDR) | (# initial denied claims / total submitted) | 12% baseline national; Goal: 6% (50% reduction) | Primary (Change HC 2022) ✔ | R1 | Add 2024 update (Optum gated) | Need primary 2024 dataset |
| M2 | Avoidable Denial % | % of denials deemed unequivocally avoidable | 31% baseline → Target 20% | Primary (Change HC 2022) ✔ | R1,R3 | Validate with recent index | Reduction ties to R3 prioritization model |
| M3 | Non-Recoverable Avoidable % | % avoidable denials not recovered | 43% → Target 25% | Primary (Change HC 2022) ✔ | R1,R3,R4 | Cross-check later study | Drives appeal ROI narrative |
| M4 | Denial Write-Off % | Write-off $ / Net patient service revenue | TBD (Need baseline) | Gap | R8 | Acquire HFMA benchmark range | Needed for KPI baseline chart |
| M5 | Cost per Denied Claim | Internal process + lost revenue cost | $117 (secondary) placeholder | Secondary (needs primary) | R8 | Seek primary cost study | Confidence low (0.5) |
| M6 | % Denied Claims Resubmitted | (# denied claims resubmitted / # denied) | 35% (implied: 65% not) | Secondary | R8,R4 | Corroborate with payer stats | Affects appeal opportunity sizing |
| M7 | Appeal Overturn Rate | % initial denials overturned after appeal | Placeholder 60% target | Gap | R4 | Gather payer/industry benchmarks | Directly influences impact factor |
| M8 | Time to Appeal (Days) | Denial to appeal submission | Placeholder median 7d → target 2d | Gap | R4 | Collect internal pilot + benchmark | Impact tied to automation speed |
| M9 | Time to Resolution (Days) | Denial to final adjudication | Placeholder median 30d → target 20d | Gap | R4 | Need payer-specific ranges | Longer tail distribution modeling |
| M10 | CMI Lift (%) | % increase in average DRG weight post CDI | Placeholder 1–2% | Gap | R9 | Find published CMI improvement studies | Direct revenue scaling |
| M11 | Query Response Rate | % physician queries answered | Placeholder 85% → target 92% | Gap | R2,R7 | Obtain AHIMA/ACDIS response norms | Influences Reach/Impact for R2 |
| M12 | Query Median Response Time (hrs) | Query sent → physician response | Placeholder 48h → target 24h | Gap | R2,R7 | Collect pilot + industry survey | Affects queue ROI calc |
| M13 | Automated Appeal Draft Time (mins) | System generation time | Prototype <2 min | Internal (prototype) | R4 | Instrument P95 in prod | Perf gate candidate |
| M14 | Manual Appeal Draft Time (hours) | Human creation baseline | 1.5h avg (placeholder) | Gap | R4 | Time-and-motion study | For ROI delta calc |
| M15 | Evidence Bundle Build P95 (ms) | Time to produce bundle | Target <1500ms | Internal objective | R4,R3 | Measure strategy route perf | Perf Gate PERF-Q1 |
| M16 | NLQ Response P95 (s) | Time for natural language analytics answer | Target <2s | Objective | R6 | Add observability hook | Web vitals tie-in |
| M17 | Recommendation Precision | True positive suggestions / all suggestions | Target ≥0.85 | Planned eval | R3,R4 | Build labeled set (MODEL-A1) | Quality Gate MODEL-Q1 |
| M18 | Citation Coverage % | Recommendations with >=1 authoritative cite | Target ≥98% | Planned metric | R4,R6 | Attribution audit pipeline | Quality Gate XAI-Q2 |

---
## 2. Evidence Confidence Rubric (Applied to RICE Confidence)
| Confidence Tier | Numeric | Criteria | Adjustment Triggers |
|-----------------|---------|---------|--------------------|
| High | 0.9 | ≥3 independent primary sources or 2 primary + internal analytics aligned | Contradictory new primary (-0.1 to -0.2) |
| Medium | 0.7 | 2 sources (one may be secondary) | Add third corroborating (+0.2) |
| Low | 0.5 | Single secondary / tertiary | Primary replacement (+0.2) |
| Placeholder | 0.3 | Hypothesis only | First credible source (+0.2) |

---
## 3. Backlog Mapping Summary
| RICE ID | Metrics Impacted | Commentary |
|---------|------------------|------------|
| R1 | M1,M2,M3 | Establish baseline + early win; high confidence metrics accelerate adoption messaging. |
| R2 | M11,M12 | Query governance & UX improvements shift response efficiency. |
| R3 | M2,M3,M17 | Prioritization model reduces avoidable & non-recoverable share via earlier intervention. |
| R4 | M3,M5,M6,M7,M8,M9,M13,M14,M18 | Appeal automation ROI hinges on overturn + cycle compression + cost baseline. |
| R5 | M1,M15 | Drilldowns rely on performant bundle generation for case-level exploration. |
| R6 | M16,M18 | NLQ adds analytic surface; must not regress latency / citation coverage. |
| R7 | M11,M12 | Analytics instrumentation for query throughput & bottlenecks. |
| R8 | M4,M5,M6 | Denial cost benchmarking analytics; currently highest data gap cluster. |
| R9 | M10 | CMI modeling unlocks additional revenue capture projections. |
| R10 | (indirect) | Security & audit metrics feed governance dashboards (not RICE-scored). |

---
## 4. Collection Plan (Corpus Enrichment Tasks)
| Task ID | Metric | Action | Data Source Target | Storage Plan | Dependency |
| CE1 | M4 | Acquire HFMA denial write-off % benchmark PDF / dataset | HFMA / public summary | Add corpus entry + normalize | None |
| CE2 | M5,M6 | Locate primary cost per denial + resubmission study | Peer-reviewed / industry research | Corpus + benchmark table | CE1 optional |
| CE3 | M7,M8,M9 | Aggregate payer / clearinghouse appeal cycle stats | Payer bulletins / clearinghouse reports | Corpus entries + raw extraction | None |
| CE4 | M10 | Search published clinical CDI intervention studies | PubMed / industry whitepapers | Corpus + CMI lift assimilation | None |
| CE5 | M11,M12 | Pull AHIMA/ACDIS response benchmarks | AHIMA/ACDIS publications | Corpus + UX metrics sheet | None |
| CE6 | M14 | Conduct internal time-and-motion sampling | Pilot site logs | Internal analytics dataset | Pilot go-live |
| CE7 | M17 | Build labeled validation subset for CDI suggestions | Internal annotation sprint | QA dataset in silver | Annotation tooling |
| CE8 | M18 | Implement citation coverage analyzer | Parser + attribution packets | Observability metric | Explainability module |

---
## 5. Risk & Mitigation (Data Gaps)
| Gap | Risk | Mitigation |
|-----|------|-----------|
| Over-reliance on 2022 denial index (recency) | Targets miscalibrated for 2025 trend | Prioritize gated 2024 ingestion (CE2) |
| Secondary-only cost metric | ROI claims challenged | Seek primary study; flag confidence 0.5 until replaced |
| Unknown overturn baseline | Appeal impact RICE undervalued or inflated | Collect clearinghouse & payer benchmark set (CE3) |
| Placeholder CMI lift | Misestimates extended revenue upside | Acquire peer-reviewed CDI lift studies (CE4) |

---
## 6. Next Iteration Exit Criteria
- ≥4 gap metrics (M4,M5,M7,M10) replaced with at least Medium confidence sources.
- Corpus updated with >=8 new entries (CE1–CE5).
- RICE Confidence recalculated for affected backlog items with change log note.
- Quality Gate MODEL-Q1 unblocked by completion of CE7.

---
*Generated with accessibility in mind (structured tables, headers). Manual validation for WCAG and source linkage still required.*
