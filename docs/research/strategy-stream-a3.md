# Strategy (Stream A3)
**Date:** 2025-08-14  
**Owner:** Product Strategy  
**Sources:** Derived from `competitive-analysis.md`, `competitors.json`, `market_needs.json`, `prd.md`, and underlying `corpus.jsonl`.

---
## 1. Strategic Context
Billigent now holds structured, evidence-linked competitive and market needs data (Streams A1–A2). Coverage analysis shows fragmented vendor responses across high-severity needs with zero automation in appeals and uniformly low AI explainability. KPI visibility to closed-loop action is minimally addressed.

---
## 2. Pillars (Whitespace Anchored)
| Pillar | Problem (Need IDs) | Current Market Gap | Billigent Intent | Moat Mechanisms |
|--------|--------------------|--------------------|------------------|-----------------|
| Appeals Automation Engine | need.denial_writeoff_cycle_time, need.denial_rework_cost | All vendors = none (services only) | Full lifecycle drafting & evidence packaging | Evidence graph linking codes ↔ regs ↔ denials; iterative learning corpus |
| Explainability & Trust Layer | Cross: all AI outputs, need.query_standardization_audit, need.cmi_specificity | All vendors low transparency | Span-level traceability + confidence & KPI impact deltas | Proprietary attribution & citation schema; audit log immutability |
| Unified Prevention→Documentation→Appeal Loop | need.initial_denial_pressure, need.front_end_root_causes, need.cmi_specificity | Capabilities siloed (denial vs CDI vs appeals) | Closed feedback loop orchestrating query design & prevention rules | Cross-domain data normalization & feedback scoring model |
| KPI-to-Action Orchestration | need.kpi_visibility, high severity denial metrics | KPI surfacing stops at dashboards | Real-time rule engine generating tasks & queries | Dynamic rules DSL + reinforcement learning prioritization |
| Predictive Specificity Uplift | need.cmi_specificity, need.query_standardization_audit | Predictive modeling shallow; uplift modeling absent | Explainable uplift recommendations & query templates | Longitudinal documentation + claim outcome dataset |

---
## 3. Weighted Whitespace Scoring (Initial Framework)
Formula: `score = severity * (1 - coverage_ratio)` where `coverage_ratio = competitors_addressing / total_competitors (9)`.

| Need ID | Severity | Coverage | Score | Strategic Use |
|---------|----------|----------|-------|---------------|
| need.initial_denial_pressure | 5 | 3/9 (33%) | 5 * (1-0.33)=3.35 | Loop integration & prevention rules |
| need.front_end_root_causes | 5 | 2/9 (22%) | 3.90 | Intake quality automation |
| need.avoidable_nonrecoverable_denials | 5 | 2/9 (22%) | 3.90 | Appeal triage + prevention insights |
| need.query_standardization_audit | 4 | 4/9 (44%) | 2.24 | Trust layer & compliant templating |
| need.cmi_specificity | 4 | 4/9 (44%) | 2.24 | Predictive uplift modeling |
| need.denial_writeoff_cycle_time | 4 | 4/9 (44%) | 2.24 | Appeals automation ROI framing |
| need.kpi_visibility | 3 | 1/9 (11%) | 2.67 | KPI-to-action orchestration priority |
| need.denial_rework_cost | 4 | 2/9 (22%) | 3.12 | Appeals drafting + cost avoidance metrics |

Top leverage (descending score): front_end_root_causes ≈ avoidable_nonrecoverable_denials > initial_denial_pressure > denial_rework_cost > kpi_visibility.

---
## 4. Differentiation Thesis
Billigent differentiates by operationalizing an evidence graph that unifies upstream prevention signals, CDI specificity interventions, and automated appeal generation—each AI artifact transparently citing clinical, coding, and regulatory sources with confidence scoring. Competitors either (a) specialize narrowly (FinThrive, Iodine) or (b) aggregate broad workflows without deep prevention→appeal continuity (3M, Optum). No vendor closes the loop with explainable automation.

---
## 5. Core System Architecture (High-Level)
Components (to be elaborated in technical design):
1. Evidence Graph Layer: Nodes (Clinical Fact, Code, Regulation, Denial Pattern, KPI, Query Template) with provenance edges.
2. Prevention Engine: Rules + ML scoring (registrations, auth, coding specificity) feeding risk queues.
3. Query & Uplift Module: Generates compliant, auditable physician queries with explainability spans.
4. Appeals Automation Engine: Retrieval-Augmented Drafting (RAG) assembling denial-specific packets (facts, cited regs, prior outcomes) → structured template.
5. Explainability & Audit Service: Stores span-level source mapping, hash-chained audit records.
6. KPI-to-Action Orchestrator: Translates KPI deltas into prioritized tasks & rules refinement.
7. Feedback Loop: Outcome ingestion (appeal overturn %, query response quality) updating models & rules.

---
## 6. MVP Alignment
| MVP Feature (from PRD) | Pillar Alignment | Added Strategic Layer |
|------------------------|------------------|-----------------------|
| Denial pattern ingestion | Unified Loop | Feeds prevention & appeal packet enrichment |
| Query governance & templates | Explainability / Predictive Specificity | Compliant contextual recommendations |
| KPI dashboard (initial) | KPI-to-Action | Foundation for orchestration engine |
| Appeals builder (scaffold) | Appeals Automation | Evolves into full drafting & evidence packaging |

---
## 7. Key Metrics & Impact Hypotheses
| Pillar | Primary KPI Impact | Secondary KPI | Hypothesis (Illustrative) |
|--------|--------------------|---------------|--------------------------|
| Appeals Automation | Appeal cycle time reduction | Overturn rate uplift | 25–35% cycle time reduction via structured evidence packets |
| Explainability Layer | Query acceptance rate | Compliance audit variance | +10–15% acceptance through clarity & cited sources |
| Unified Loop | Initial denial rate | Avoidable denial write-offs | 5–8% reduction via earlier intervention feedback |
| KPI-to-Action | KPI remediation latency | Staff rework hours | 40% faster mitigation of emerging denial spikes |
| Predictive Specificity | CMI uplift | CC/MCC capture rate | 1–2% CMI lift with targeted, explainable suggestions |

(All hypotheses to be validated with pilot instrumentation; not commitments.)

---
## 8. Risks & Mitigations
| Risk | Category | Potential Impact | Mitigation |
|------|----------|------------------|------------|
| Data access fragmentation | Data | Slower graph assembly | Phased ingestion + partner connectors |
| Regulatory change cadence | Compliance | Drift in citation accuracy | Scheduled source refresh & diff monitor |
| Model hallucination in drafting | AI Quality | Compliance risk | Strict retrieval grounding + confidence gating |
| Vendor response (fast follower) | Market | Differentiation erosion | Rapid iteration + moat via longitudinal outcomes |
| Integration complexity | Delivery | Extended sales cycles | Modular API-first layering |

---
## 9. Immediate Next Steps
1. Formalize evidence graph schema draft (nodes/edges + provenance fields).  
2. Define appeals drafting prompt + retrieval context contract.  
3. Specify explainability attribution format (JSON schema).  
4. Draft KPI-to-action rules DSL outline.  
5. Start pilot data instrumentation requirements (what to log for loop learning).  
6. Prepare stakeholder review pack (slides derived from sections 2–7).  

---
## 10. Appendices (Planned)
- A. Evidence Graph Schema (detailed)
- B. Appeals Packet Template Structure
- C. Explainability JSON Examples
- D. KPI Orchestration Rule Examples

