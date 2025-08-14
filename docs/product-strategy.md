# Billigent Product Strategy

**Version:** 1.0  
**Date:** 2025-08-14  
**Owner:** Product Strategy  
**Status:** Active (Comprehensive)  

> This document defines market positioning, ICPs, differentiation, pricing hypotheses, GTM motions, KPIs, and strategic risk posture. All claims footnoted to sources in `docs/research/corpus.jsonl` where available. Quantitative pricing and adoption benchmarks will be added after next structured extraction pass.

## 1. Positioning Statement
**For** healthcare provider revenue cycle & CDI teams **who need** to lower denial rates, accelerate appeals, and improve documentation specificity, **Billigent** is a real‑time clinical & financial intelligence platform **that** unifies evidence graph provenance, LLM‑assisted drafting, explainable attribution, and KPI→action rules into a single closed feedback loop. **Unlike** incumbent CDI, denial, or appeals service silos, Billigent provides traceable evidence bundle hashing and attribution checksums out of the box.[^iodine][^3m][^optum][^nuance]

## 2. Target Segments & ICP Profiles
| ICP | Org Archetype | Primary Buyer Persona | Pain Signals | Success Definition | Source Anchors |
|-----|---------------|-----------------------|--------------|-------------------|----------------|
| Mid/Large IDN Hospitals | Multi‑facility (>300 beds) | VP Revenue Cycle / CFO delegate | Rising initial denial rate (~12% baseline)[^change] | 20–30% reduction in preventable denials year 1 | [^change] |
| Academic Medical Centers | Complex case mix | CDI Director | High documentation variance, CMI optimization pressure[^cmi] | Sustained CMI uplift (case-weight) & audit defensibility | [^cmi] |
| Regional Health Systems | 5–15 hospitals | Denials Manager | Slow appeals turnaround; manual evidence gathering[^corro] | 50–75% faster appeal prep cycle | [^corro] |
| Specialty Networks (Cardio / Ortho) | High DRG specificity impact | Coding Lead | Missed specificity & sepsis / HF capture gaps[^iodine] | Increase in severity capture & fewer payer downgrades | [^iodine] |

## 3. Problems & Needs Mapping
| Need (PRD Ref) | Strategic Problem | Why Existing Solutions Fall Short | Billigent Response | Sources |
|----------------|------------------|----------------------------------|-------------------|---------|
| Denial Prevention (PRD 4.*) | High initial denial rate ~12% & stagnant improvement[^change] | Fragmented analytics + lagging batch reporting | Real‑time risk scoring tied to KPI triggers | [^change][^optum] |
| CDI Specificity & CMI (PRD 4.*) | Missed CC/MCC capture reduces CMI & revenue[^cmi] | Predictive CDI engines lack transparent attribution | Evidence graph + attribution checksum | [^cmi][^iodine] |
| Appeals Latency (PRD 4.*) | Manual evidence collation delays cash[^corro] | Service-heavy vendors lack automated provenance hashing | Deterministic bundle + LLM draft in seconds | [^corro] |
| Compliance & Auditability | Need defensible trail for coding & appeal narrative[^hipaa] | Black-box ML; limited chain-of-custody | Bundle hash + normalized attribution spans | [^hipaa] |

## 4. Differentiators
1. **Evidence Graph Provenance** – hash-based bundle for each draft ensuring immutable audit trace.  
2. **Explainability Attribution** – L1-normalized weighted spans with checksum for trust & governance.  
3. **Closed-Loop KPI→Action DSL** – event-driven operational triggers (e.g., spike in CO45 denial risk).  
4. **Appeal Draft Generation** – seconds vs hours manual prep (time-to-value ROI wedge).  
5. **Modular Partner Strategy** – ambient capture via partner API rather than capital-intensive speech build.[^nuance]  
6. **Azure-Native Security & Hybrid Search** – leverages vector + keyword (RRF) hybrid for precision & recall.[^azureHybrid]  

## 5. Pricing & Packaging Hypotheses (Draft)
| Package | Target Segment | Value Metric (Primary) | Secondary Metric | Pricing Guardrails (Hypothesis) | Rationale | Research Gaps |
|---------|---------------|------------------------|------------------|-------------------------------|-----------|---------------|
| Core | Mid/Large IDN | Monthly encounters analyzed | Initial denial rate baseline | Floor tied to platform cost recovery + 60% gross margin target | Align to encounter volume scaling | Need payer-mix elasticity data |
| CDI+ | AMC / High Complexity | Cases with potential CC/MCC uplift flagged | # of accepted recommendations | Premium vs Core (x1.6–1.9) | Higher measurable financial delta | Need verified uplift ranges |
| Appeals Automation | Denials-heavy systems | Appeals drafted (billable events) | Appeal overturn % | Event-based with tiered minimum | Direct value to recovered revenue | Benchmark overturn % variance |
| Enterprise Suite | Large networks | Blended: encounters + appeals | Seats (read-only) | Bundled discount 15–25% | Land-and-expand retention | Need multi-year TCO comps |

## 6. Go-To-Market Motions
| Motion | Entry Point | Tactic | Enablement Artifact | Success KPI |
|--------|------------|--------|---------------------|-------------|
| Land (Core) | Denial pain | ROI model using baseline denial cost & preventable % | Denial prevention ROI calculator | SQL conversion rate |
| Expand (Appeals) | Existing Core accounts | Showcase cycle time reduction via pilot cohort | Time-to-appeal benchmark report | % accounts adding Appeals within 2 quarters |
| Expand (CDI+) | Documentation uplift need | CC/MCC gap analysis sample | Specificity uplift simulation deck | Incremental ARR per uplift opportunity |
| Ecosystem Partner | Ambient capture vendor | Co-marketing + API integration brief | Joint webinar & case study | Partner-sourced pipeline % |
| Analyst / Influencer | Revenue cycle media | Publish benchmark insights & denial trends | Annual Denial & CDI Trends Report | Share of voice (earned mentions) |

## 7. North Star & KPI Tree
**North Star:** Net Preventable Denial Dollars Avoided (NPDA).  
**Supporting KPI Layers:**  
- L2: Initial Denial Rate (volume & $)[^hfma]  
- L2: Appeal Cycle Time (submission latency)  
- L2: % Appeals Overturned (volume & $) (benchmark pending)  
- L3: CC/MCC Uplift Accepted (count & $ impact)  
- L3: Documentation Query Turnaround Time  
- L3: Attribution Integrity Score (span checksum pass %)  
- L4: Rule-to-Action Latency (KPI threshold -> event -> remediation)  

## 8. Risks & Mitigations
| Risk | Category | Impact | Likelihood | Mitigation | Residual Gap |
|------|----------|--------|-----------|-----------|--------------|
| Appeal overturn benchmarks unavailable publicly | Data | Slows KPI target setting | Medium | Structured extraction + customer beta baselines | Need early design partners |
| Incumbent bundling response | Competitive | Erodes wedge narrative | Medium | Emphasize checksum + DSL + real-time integration speed | Monitor roadmap leaks |
| Overbuild ML before validated | Execution | Wasted R&D burn | High | Stage-gate with uplift experiments | Cultural guardrail enforcement |
| Pricing misaligned to value metric | Commercial | Churn risk | Medium | Pilot-based price discovery + cohort retention tracking | Need multi-cohort data |
| Attribution misunderstood by users | Adoption | Trust erosion | Low-Med | UI education layer + hover explanations | Usability testing |
| Partner dependency (ambient) | Ecosystem | Latency / Reliability | Low-Med | Multi-partner fallback, degrade gracefully | Ongoing vendor scorecard |

## 9. Roadmap (High-Level Waves)
| Wave (Quarter) | Theme | Key Outcomes | Feature Anchors | Exit Criteria |
|----------------|-------|--------------|-----------------|---------------|
| Wave 1 (Q3 2025) | Prototype Integration | Live evidence bundle + appeal draft API | Evidence graph, Appeal draft, Attribution checksum | 5 internal demo scenarios pass |
| Wave 2 (Q4 2025) | Closed Loop Foundations | KPI rules firing & event analytics | Rules DSL v1, Event store, Dashboard spikes | >90% rule latency <5s |
| Wave 3 (Q1 2026) | Denial Prevention Intelligence | Real-time risk scoring & worklist | Risk model v1, Pre-bill queue, Hybrid search retrieval | Pilot: 10% observed denial reduction |
| Wave 4 (Q2 2026) | Appeals Optimization | Outcome feedback loop + model refinement | Outcome ingestion, Overturn model, Draft personalization | 25% faster vs baseline appeals cycle |
| Wave 5 (H2 2026) | Scale & Extend | Multi-facility benchmarking + partner ecosystem | Multi-tenant benchmarking, Partner APIs | 3 paying lighthouse customers |

## 10. Open Questions
1. What encounter volume threshold best predicts upsell potential for Appeals package?  
2. Minimum viable overturn benchmark dataset size for statistically stable KPI target?  
3. Ideal value metric blend for Enterprise Suite (encounter + appeal weighting)?  
4. Required granularity of attribution spans for auditor acceptance (need user testing).  

## 11. Sources
- [^iodine]: Iodine Software CDI Suite.
- [^3m]: 3M 360 Encompass Suite Overview.
- [^optum]: Optum Denial Management Solutions.
- [^nuance]: Nuance Ambient Clinical Intelligence (DAX) Product Page.
- [^change]: Change Healthcare 2022 Revenue Cycle Denials Index.
- [^cmi]: CMS Case Mix Index Definition Page.
- [^corro]: CorroHealth Appeals & Clinical Review Services.
- [^hipaa]: HIPAA Security Rule Technical Safeguards §164.312.
- [^hfma]: HFMA Claim Integrity KPI Standardization.
- [^azureHybrid]: Azure AI Search Hybrid Search Overview.

---
*Generated with accessibility in mind. Further citation density & quantitative benchmarks to be appended after structured extraction phase.*
