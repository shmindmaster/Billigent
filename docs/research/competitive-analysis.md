# Competitive Analysis (Stream A2)
**Date:** 2025-08-14  
**Owner:** Product Management / Competitive Intelligence  
**Scope:** CDI, Denials Prevention, Appeals Automation adjacency landscape

---
## 1. Purpose & Methodology
Structured, source-grounded comparison of incumbent and adjacent solutions to identify whitespace for Billigent differentiation. Every claim ties to `corpus.jsonl` entries; capability flags normalized per `capability_scale.md`.

### Method
1. Source ingestion to corpus (primary > secondary > tertiary).  
2. Structured extraction → `competitors.json`.  
3. Normalization of capability enums.  
4. Mapping of capabilities to evidence-led Market Needs (PRD § Market Needs).  
5. Identification of whitespace & moat strategy inputs for Streams A3/D1.

---
## 2. Segmentation Taxonomy
| Segment | Description | Representative Vendors |
|---------|-------------|------------------------|
| CDI Platform | End-to-end CDI workflow + CAC integration | 3M, Dolbey |
| Predictive CDI | AI-driven prioritization of undocumented conditions | Iodine |
| Ambient Documentation | Real-time physician note generation (CDI-adjacent) | Nuance |
| Denials Analytics / Prevention | Root cause analytics, preventive controls | FinThrive, Optum, Cloudmed |
| Appeals / Complex Claims Services | Service-heavy appeals & complex claim recovery | CorroHealth, Revecore |
| Revenue Intelligence / Underpayment | Data mining & contract underpayment recovery | Cloudmed |

---
## 3. Capability Matrix (Snapshot)
(Will be programmatically generated later; initial manual table below.)

| Vendor | Denial Prevention | CDI Query | Appeal Automation | Analytics Depth | AI Explainability | Notable Differentiators | Notable Gaps | Sources |
|--------|-------------------|-----------|-------------------|-----------------|-------------------|-------------------------|-------------|---------|
| Nuance | none | partial | none | moderate | low | Ambient capture | Denial analytics, appeals drafting | Nuance DAX / Dragon Medical One Product Page |
| 3M | none | full | none | high | low | Unified CDI+CAC | Proactive appeals automation | 3M 360 Encompass Suite Overview |
| Iodine | none | full | none | moderate | low | Predictive prioritization | Appeals automation, deep prevention | Iodine Software CDI Suite |
| FinThrive | full | none | none | high | low | Prevention focus | CDI query governance | FinThrive (formerly nThrive) Denials Management |
| Optum | full | none | none | high | low | Scale & payer analytics | Automated drafting, CDI specificity uplift | Optum Denial Management Solutions |
| Cloudmed | full | none | none | high | low | Underpayment/contract depth | Physician-facing CDI workflow, appeals drafting | Cloudmed (R1) Revenue Intelligence |
| CorroHealth | none | partial | none | moderate | low | Service scale | Productized AI appeals | CorroHealth Appeal & Clinical Review Services |
| Revecore | partial | none | none | moderate | low | Complex claims niche | AI CDI specificity, drafting | Revecore Complex Claims & Appeals |
| Dolbey | none | full | none | moderate | low | Combined CAC+CDI | Predictive specificity uplift, appeals | Dolbey Fusion CDI / CAC |

---
## 4. Mapping to Market Needs
(Planned) Each vendor will receive `mappedNeeds[]` referencing stable need IDs, e.g., `need.initial_denial_pressure`, `need.cdi_query_standardization`, `need.appeal_cycle_time`.

Proposed Need IDs (derive from PRD Market Needs table):
- `need.initial_denial_pressure`
- `need.front_end_root_causes`
- `need.avoidable_nonrecoverable_denials`
- `need.query_standardization_audit`
- `need.cmi_specificity`
- `need.denial_writeoff_cycle_time`
- `need.kpi_visibility`
- `need.denial_rework_cost`

---
## 5. Whitespace & Differentiation (Initial Hypotheses)
| Theme | Observation | Source Linkage | Opportunity |
|-------|-------------|----------------|------------|
| Appeals Automation | No evaluated vendor offers partial/full automation beyond services | All capability flags = none for appeal_automation | Build full evidence-grounded drafting engine (RAG + regulatory citation) |
| AI Explainability | All vendors = low transparency | capabilityFlags.ai_explainability uniformly low | Offer high-explainability layer (traceable evidence spans, confidence scores) |
| Cross-Domain Fusion | Capabilities siloed (CDI vs Denials vs Appeals) | Segmentation matrix | Unified cockpit tying prevention + documentation + appeal loop |
| Regulatory Traceability | Limited explicit citation mapping in competitors | Corpus competitor entries marketing-focused | Embed regulatory & KPI citation in every AI output |
| KPI → Action Loop | Prevention platforms stop at analytics | FinThrive/Optum positioning | Real-time prescriptive interventions & workflow scoring |

---
## 6. Risk & Moat Considerations (Preview)
To be deepened in Strategy stream:
- Data Network Effects: Aggregated denial pattern learning (payer-specific) builds moat.
- Evidence Graph: Normalized linkage across clinical facts ↔ codes ↔ regulations ↔ KPI impact unifies silos.
- Explainability Trust Layer: Differentiator vs opaque predictive scoring.

---
## 7. Next Actions
1. Add `mappedNeeds` arrays into each competitor entry.  
2. Introduce stable `needId` column source of truth file (`market_needs.json`).  
3. Automate matrix generation via script reading `competitors.json`.  
4. Quantify whitespace scoring (market coverage %) per capability dimension.  
5. Feed validated differentiation themes into Stream A3 Strategy.

---
## 8. Source Footnotes
All vendor claims trace to corpus lines whose `source` values are listed in the matrix. For quantitative or regulatory assertions see primary sources in corpus (Change Healthcare, HFMA, HIPAA, CMS, AHIMA/ACDIS).
