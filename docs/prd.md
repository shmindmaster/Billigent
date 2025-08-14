# **Billigent Product Requirements Document (PRD)**

**Version:** 1.3  
**Date:** August 14, 2025  
**Product:** Billigent Clinical Intelligence Platform  
**Status:** Active Development  
**Owner:** Product Management

---

## **1. Executive Summary**

Billigent is an enterprise-ready, Azure-native clinical intelligence cockpit designed to revolutionize healthcare revenue cycle management through AI-powered insights and automation.[^12][^11] The platform addresses three critical challenges: **preventing claim denials** before they happen,[^1][^3] **perfecting clinical documentation (CDI)** in real-time,[^15][^6] and **accelerating the appeals process** from days to minutes.[^3][^7] This document serves as the single source of truth for the product's vision, features, and requirements.

**Strategic Positioning:** Billigent unifies evidence graph provenance, LLM‑assisted drafting, explainable attribution, and KPI→action rules into a single closed feedback loop, providing traceable evidence bundle hashing and attribution checksums out of the box.

---

## **2. Product Vision & Business Objectives**

### **2.1 Vision Statement**

> **"Transform healthcare revenue cycle management through intelligent automation, ensuring optimal patient care documentation while maximizing financial outcomes."**

### **2.2 Mission Statement**

To empower healthcare organizations to achieve clinical documentation excellence and financial optimization through AI-driven insights, reducing administrative burden while improving patient care quality.

### **2.3 Business Objectives**

| Primary Goal                      | Key Result (Year 1 Target)                                         | Strategic Alignment |
| :-------------------------------- | :----------------------------------------------------------------- | :------------------ |
| **Reduce Claim Denial Rates**     | ↓ 20-30% through proactive pre-bill analysis                       | NPDA North Star     |
| **Improve CDI Quality Scores**    | ↑ 40% via intelligent documentation recommendations                  | CMI Optimization    |
| **Accelerate Appeals Processing** | ↓ 50-75% in time-to-appeal through automated evidence generation    | Cash Flow Acceleration |
| **Enhance Revenue Capture**       | Identify and capture previously missed documentation opportunities   | CC/MCC Uplift       |

### **2.4 Engineering Success Metrics (DORA)**

- **Deployment Frequency**: Daily feature releases to production.
- **Lead Time for Changes**: < 2 hours from code commit to production deployment.
- **Change Failure Rate**: < 5% of deployments requiring a hotfix.
- **Mean Time to Recovery (MTTR)**: < 30 minutes for critical service restoration.

---

## **3. Target Users & Personas**

### **3.1 Primary Users (ICPs)**

#### **1. Chris, the CDI Specialist (Academic Medical Centers)**
- **Role**: Clinical Documentation Improvement specialist responsible for reviewing patient charts for accuracy and completeness.
- **Pain Points**: Time-consuming manual review processes, difficulty spotting subtle documentation gaps, pressure to improve coding accuracy and CMI optimization.
- **Goals**: Quickly identify high-impact improvement opportunities, ensure coding is defensible and accurate, and optimize the hospital's Case Mix Index (CMI).
- **Billigent's Goal for Chris**: **Focus his expertise.** Billigent surfaces the highest-impact opportunities so he can apply his clinical judgment where it matters most, with evidence graph provenance and attribution checksums.

#### **2. Mark, the Revenue Cycle Manager (Mid/Large IDN Hospitals)**
- **Role**: Leader of the revenue cycle operations team, VP Revenue Cycle / CFO delegate.
- **Pain Points**: High claim denial rates (~12% baseline), slow appeals management, lack of real-time visibility into the financial impact of CDI.
- **Goals**: Minimize denial rates, optimize revenue capture, and improve overall cycle efficiency.
- **Billigent's Goal for Mark**: **Turn data into strategy.** Billigent's dashboard provides the actionable insights needed to identify root causes and optimize team performance with real-time risk scoring tied to KPI triggers.

#### **3. Dana, the Denials & Coding Specialist (Regional Health Systems)**
- **Role**: Medical coding professional who also manages the denials and appeals process.
- **Pain Points**: Complex coding decisions, staying current with regulations, the slow and manual process of gathering evidence and writing appeal letters.
- **Goals**: Ensure accurate coding, maintain compliance, and increase the success rate of appeals.
- **Billigent's Goal for Dana**: **Automate the paperwork.** Billigent drafts evidence-based appeals in seconds with deterministic bundle hashing, freeing her up to manage more cases and win more appeals.

#### **4. Alex, the Coding Lead (Specialty Networks - Cardio/Ortho)**
- **Role**: Lead coder for high-DRG specificity impact specialties.
- **Pain Points**: Missed specificity & sepsis / HF capture gaps, payer downgrades due to incomplete documentation.
- **Goals**: Increase severity capture, reduce payer downgrades, maintain high coding accuracy.
- **Billigent's Goal for Alex**: **Maximize specificity capture.** Billigent identifies CC/MCC opportunities with transparent attribution and evidence graphs.

### **3.2 Secondary Users**

- **Healthcare Administrators**: Hospital/health system executives focused on financial performance, operational efficiency, and compliance risk. They will use executive dashboards for strategic oversight.
- **IT/Security Teams**: Healthcare IT and information security professionals focused on system integration, data security, and compliance. They will use system monitoring and security management tools.

---

## **4. Core Features & Capabilities**

### **4.1 Analytics & Reporting Dashboard**

#### **4.1.1 Real-Time KPI Monitoring**

- **Description**: A live dashboard displaying key performance indicators for revenue cycle health.
- **Features**: 
  - Claim denial rates and root cause trends (baseline ~12% target reduction to 20-30%)
  - CDI quality score improvements over time with CMI optimization tracking
  - Appeals success rates by payer with overturn percentage tracking
  - Real-time revenue impact of CDI queries with attribution integrity scoring
  - Case volume and team processing statistics with rule-to-action latency monitoring

#### **4.1.2 Interactive Data Visualization**

- **Description**: Dynamic charts and graphs for deep data exploration.
- **Features**: 
  - Drill-down capabilities from summary to individual case-level detail
  - Time-series analysis with customizable date ranges
  - Comparative analysis across service lines, departments, and individual providers
  - One-click export to PDF and CSV for reporting
  - Evidence graph visualization with provenance tracking

#### **4.1.3 Natural Language Query Interface**

- **Description**: An AI-powered query system allowing users to ask questions of their data in plain English.
- **Features**: Powered by the Azure OpenAI Responses API's **Code Interpreter**, this allows users to ask questions like, "What's our denial rate for cardiology this month?" and receive back contextual AI responses with supporting charts and data.

### **4.2 Pre-Bill CDI Review**

#### **4.2.1 FHIR Data Ingestion**

- **Description**: Automated, near real-time ingestion of clinical data from EHR systems via a secure FHIR R4 API connection.
- **Technical Requirements**: Support for FHIR `Bundle` resources; Secure connectivity to HL7 FHIR servers; Storage of raw data in Azure Data Lake; Secure data transmission (TLS 1.3).

#### **4.2.2 AI-Powered Documentation Analysis**

- **Description**: The core intelligence engine that analyzes clinical documentation for gaps and opportunities.
- **AI Capabilities**: Utilizes Azure OpenAI `gpt-5-mini` to perform documentation gap identification, coding accuracy validation, severity and specificity recommendations, and checks against a knowledge base of ICD-10, CPT, and HCPCS codes.

#### **4.2.3 Prioritized Work Queue**

- **Description**: An intelligent worklist that prioritizes cases based on a calculated financial impact and clinical risk.
- **Features**: Real-time financial impact calculation for each finding; Risk stratification to highlight quality-of-care issues; Deadline tracking for timely review.

#### **4.2.4 Conversational AI Assistant**

- **Description**: An interactive AI copilot for detailed case discussions.
- **Features**: Stateful, case-specific conversation threads using the Responses API's `previous_response_id`; Handles follow-up questions about AI findings; Provides evidence-based recommendations and documentation templates.

### **4.3 Denials Management**

#### **4.3.1 Automated Denial Letter Processing**

- **Description**: Automated ingestion and analysis of denial letters and Explanation of Benefits (EOBs).
- **Technical Requirements**: Utilizes Azure AI Document Intelligence (formerly Form Recognizer) for PDF upload with OCR processing; Extracts and categorizes denial reasons and CARC/RARC codes with >95% accuracy.

#### **4.3.2 Asynchronous AI Analysis**

- **Description**: A non-blocking, background processing workflow for denial analysis.
- **Features**: A queue-based architecture allows users to upload multiple denials and receive notifications when the AI analysis is complete, with full visibility into the processing status.

#### **4.3.3 Automated Appeal Generation**

- **Description**: AI-powered generation of complete, evidence-based appeal letters.
- **AI Capabilities**: Synthesizes clinical documentation from the Data Lake, integrates regulatory citations, and generates a persuasive appeal letter with an assessment of evidence strength.

#### **4.3.4 Appeal Tracking & Management**

- **Description**: A comprehensive dashboard for the entire appeal lifecycle.
- **Features**: End-to-end appeal status tracking (Drafting, Submitted, Pending, Overturned); Automated deadline management and follow-up reminders; Success rate analytics by payer and denial reason.

---

## **5. Technical Architecture & Requirements**

### **5.1 System Architecture**

- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS 4.1
- **Backend**: Node.js 22 + Express + TypeScript
- **Database**: Azure SQL Database with Prisma ORM
- **AI/ML**: Azure OpenAI (**`gpt-5-mini`** via Responses API) + Azure AI Search (for RAG)
- **Infrastructure**: Azure Kubernetes Service (AKS) for microservices
- **Storage**: Azure Data Lake Storage for clinical data repository

### **5.2 Integration Requirements**

- **EHR Systems**: Must be compatible with FHIR R4 APIs for data ingestion.
- **Authentication**: Must integrate with Microsoft Entra ID using OAuth 2.0.
- **Monitoring**: Must integrate with Application Insights and Azure Monitor.

### **5.3 Performance Requirements**

- **UI Response Time**: < 2 seconds for all dashboard and case queries (P95).
- **Concurrent Users**: Must support 1,000+ concurrent users without degradation.
- **Availability**: **99.9% uptime** SLA.

---

## **6. Security, Compliance & UX**

### **6.1 HIPAA Compliance & Security**

- **Data Encryption**: AES-256 at rest, TLS 1.3 in transit.
- **Access Controls**: Strict Role-Based Access Controls (RBAC) enforced at the API layer.
- **Authentication**: Multi-factor authentication (MFA) is required for all users.
- **Audit Logging**: Comprehensive, immutable logging of all data access and actions.
- **Vulnerability Management**: Regular, automated security scans and annual penetration testing.

### **6.2 User Experience & Design**

- **Design Principles**: Simplicity, Efficiency, and Accessibility (WCAG 2.1 AA).
- **Usability Standards**: Target a task completion rate of >95% for primary workflows with an error rate of <2%. The goal is a Net Promoter Score (NPS) of >70.

---

## **7. Data & AI Strategy**

### **7.1 Data Management**

- **Data Governance**: A comprehensive data catalog in Purview will track data lineage.
- **Quality Assurance**: Automated data validation pipelines will monitor incoming data quality.
- **Backup & Recovery**: Geo-redundant storage with point-in-time recovery for the application database.

### **7.2 AI/ML Capabilities**

- **RAG for Accuracy**: AI model accuracy is enhanced by grounding responses in official terminologies and clinical datasets via a Retrieval-Augmented Generation (RAG) architecture.
- **Model Training**: The system is designed for continuous learning from user feedback and new data.
- **Explainability (XAI)**: The AI will provide clear reasoning and cite its sources for all recommendations.
- **Human-in-the-Loop**: All critical AI-generated outputs (queries, appeals) require validation by a human expert before being actioned.

---

## **8. Implementation Timeline (10 Weeks)**

| Phase                             | Duration | Key Deliverables                                                                                                        |
| :-------------------------------- | :------- | :---------------------------------------------------------------------------------------------------------------------- |
| **Foundation (Weeks 1-2)**        | 2 Weeks  | Azure infrastructure provisioned; Database schema deployed; UI framework and navigation built.                          |
| **Core Features (Weeks 3-6)**     | 4 Weeks  | Pre-Bill analysis engine (v1); Live KPI dashboard; User management and RBAC.                                            |
| **Advanced Features (Weeks 7-8)** | 2 Weeks  | Denials management module (PDF upload, analysis, appeal generation); Analytics with natural language queries.           |
| **Production Ready (Weeks 9-10)** | 2 Weeks  | Comprehensive E2E testing; Security validation & penetration testing; Go-live preparation, training, and documentation. |

---

## **9. Success Criteria & KPIs**

### **9.1 Product Success Metrics**

- **User Adoption**: 80% of target users actively using the platform within 3 months of launch.
- **Clinical Impact**: A measurable 50% reduction in documentation gaps identified in post-bill audits.
- **Financial Impact**: A 30% improvement in revenue capture for targeted DRGs.
- **User Satisfaction**: A 4.5/5 average user rating in post-onboarding surveys.

---

## **10. Risk Assessment & Mitigation**

| Risk Category  | Risk                        | Mitigation Strategy                                                                                                               |
| :------------- | :-------------------------- | :-------------------------------------------------------------------------------------------------------------------------------- |
| **Technical**  | AI Accuracy & Hallucination | Mitigation through our RAG architecture and a mandatory human-in-the-loop validation workflow for all critical AI outputs.        |
| **Business**   | Low User Adoption           | Mitigation through an intuitive UX, comprehensive training during onboarding, and a phased rollout to internal champions.         |
| **Compliance** | Regulatory Changes          | Mitigation through a flexible rules engine and a dedicated quarterly compliance review process to update the AI's knowledge base. |

---

## Feature Roadmap



---

## References

Authoritative standards and platform documentation that ground this PRD. See also docs/research/corpus.jsonl for the complete, versioned corpus.

- CDC/NCHS — ICD-10-CM Files: https://www.cdc.gov/nchs/icd/icd-10-cm/files.html
- CDC/NCHS — ICD-10-CM Index/Browser: https://www.cdc.gov/nchs/icd/icd-10-cm/index.html
- NCHS — ICD-10-CM Browser (multi-year): https://icd10cmtool.cdc.gov/
- CMS — ICD-10 Landing (CM/PCS current-year files): https://www.cms.gov/medicare/coding-billing/icd-10-codes
- CMS — 2025 Official ICD-10-PCS Coding Guidelines (PDF): https://www.cms.gov/files/document/2025-official-icd-10-pcs-coding-guidelines.pdf
- CMS — FY2025 ICD-10-CM Coding Guidelines (PDF): https://www.cms.gov/files/document/fy-2025-icd-10-cm-coding-guidelines.pdf
- CMS — MS‑DRG Classifications & Software (manuals, version tables): https://www.cms.gov/medicare/payment/prospective-payment-systems/acute-inpatient-pps/ms-drg-classifications-and-software
- CMS — NCCI PTP Edits (quarterly): https://www.cms.gov/medicare/coding-billing/national-correct-coding-initiative-ncci-edits/medicare-ncci-procedure-procedure-ptp-edits
- CMS — NCCI MUEs (policy, downloads): https://www.cms.gov/medicare/coding-billing/national-correct-coding-initiative-ncci-edits/medicare-ncci-medically-unlikely-edits
- X12 — Claim Adjustment Reason Codes (CARC): https://x12.org/codes/claim-adjustment-reason-codes
- X12 — Remittance Advice Remark Codes (RARC): https://x12.org/codes/remittance-advice-remark-codes
- HL7 — FHIR Bulk Data Access IG: https://hl7.org/fhir/uv/bulkdata/
- CARIN — C4BB IG (Index): https://build.fhir.org/ig/HL7/carin-bb/index.html
- CARIN — C4BB EOB Profiles (examples include Inpatient, Pharmacy, Professional/NonClinician): https://build.fhir.org/ig/HL7/carin-bb/StructureDefinition-C4BB-ExplanationOfBenefit.html
- Azure AI Search — Hybrid Search Overview: https://learn.microsoft.com/en-us/azure/search/hybrid-search-overview
- Azure AI Search — Hybrid Query How‑To: https://learn.microsoft.com/en-us/azure/search/hybrid-search-how-to-query
- Azure AI Search — Vector Search Overview: https://learn.microsoft.com/en-us/azure/search/vector-search-overview
- Azure AI Search — Hybrid Ranking (RRF): https://learn.microsoft.com/en-us/azure/search/hybrid-search-ranking
- Azure OpenAI — Responses API (how‑to): https://learn.microsoft.com/en-us/azure/ai-foundry/openai/how-to/responses
- Azure OpenAI — Embeddings (how‑to): https://learn.microsoft.com/en-us/azure/ai-foundry/openai/how-to/embeddings

## Problem Statement (CDI)
Clinical documentation gaps, non-standard physician query practices, and fragmented denial prevention tooling drive elevated initial denial rates (~12% nationally with regional peaks 17%) and avoidable financial leakage (31% unequivocally avoidable denials; 43% of those non‑recoverable) while incomplete CC/MCC capture suppresses Case Mix Index and reimbursement sustainability.[^1][^2][^6]

## Users & Roles (CDI Lead, HIM, Coders, Physicians)
| Role | Core CDI / Denial Pain | Operational Impact | Compliance / Policy Driver | Sources |
| ---- | ---------------------- | ------------------ | --------------------------- | -------- |
| CDI Lead | Limited visibility into preventable front‑end & registration/eligibility root causes | High avoidable denial rework; delayed appeals | CAQH CORE standardization opportunities; HFMA denial KPIs | [^2][^3][^4] |
| HIM Director | Inconsistent query quality & audit trail gaps | Risk of non‑defensible DRG / HCC assignments | AHIMA/ACDIS compliant query governance; HIPAA audit controls | [^5][^7] |
| Coder / Denials Specialist | Time-intensive manual root cause classification & appeal packet assembly | Slower Time to Appeal / Resolution; higher write‑offs | HFMA Time to Appeal / Resolution KPIs; Change Healthcare root cause taxonomy | [^1][^3] |
| Physician | Alert & query fatigue; ambiguous, leading or low-signal queries | Low / delayed query response rates; lost CC/MCC specificity | AHIMA/ACDIS non‑leading query standards | [^7] |

## Market Needs — Evidence-Led
| Need / Theme | Setting | Regulatory / Policy Driver | Evidence & Signals | Severity (1–5) | Confidence | Sources |
| ------------- | ------- | ------------------------- | ------------------ | ------------- | ---------- | ------- |
| Rising initial denial rates creating margin pressure | Inpatient / Outpatient | Denial KPI standardization (HFMA); X12 / CAQH CORE claims data uniformity | Initial denial rate ~12% (H1 2022) up from 10% (2020), regional peak 17% (Pacific) | 5 | High | [^1][^2][^3] |
| High share of denials front‑end & registration/eligibility | All | CAQH CORE operating rule opportunities (837 / 277CA) | Front‑end share 41% (down from 46%); Registration/Eligibility top cause 22% | 5 | High | [^1][^2] |
| Large pool of avoidable & non‑recoverable denials | Inpatient / Outpatient | Standardized root cause capture & preventive controls | 31% unequivocally avoidable; 43% of avoidable non‑recoverable | 5 | High | [^1] |
| Non‑standard physician query practice & audit risk | All | AHIMA/ACDIS compliant query guidelines; HIPAA §164.312 (audit controls, access) | Need for non‑leading, traceable queries; mandates for audit controls & unique user IDs | 4 | Medium‑High | [^5][^7] |
| Incomplete CC/MCC & specificity depressing CMI | Inpatient | CMS IPPS DRG & CMI calculation definitions | CMI driven by summed DRG weights / discharges; reliant on CC/MCC capture | 4 | High | [^6] |
| Denial write‑offs & long resolution cycles | All | HFMA claim integrity KPI framework | KPIs include Denial Write‑Off %, Time to Appeal, Time to Resolution | 4 | Medium | [^3][^4] |
| Under-leveraged KPI visibility for prevention | All | HFMA MAP Keys (broader RCM governance) | MAP Keys contextualize denial KPIs alongside Clean Claim Rate, DNFB | 3 | Medium | [^4] |
| Cost & rework burden from unreworked denials | All | Financial stewardship (HFMA benchmarking) | ~65% denied claims never resubmitted; cost per denial ~$117 (secondary) | 4 | Medium | [^8] |

## MVP Features & Acceptance Criteria (Initial Slice)
| Feature | Acceptance Criteria (Evidence-Aligned) | Sources |
| ------- | ------------------------------------- | -------- |
| Denial Analytics Baseline | System ingests denial events and reports Initial Denial Rate (% volume & $) plus top 5 root causes aligned to Change Healthcare taxonomy (Registration/Eligibility, Missing/Invalid Data, Auth/Pre‑Cert, Medical Documentation Requested, Service Not Covered). | [^1] |
| Claim Integrity KPI Tracker | Dashboard displays six HFMA claim integrity KPIs with definitional tooltips & data freshness <24h; Denial Write‑Off % computed over NPSR consistent with HFMA formula. | [^3] |
| Compliant Query Workflow | Query UI enforces non‑leading pattern library; every query has unique ID, physician response status, and immutable audit log entry per HIPAA §164.312(b). | [^5][^7] |

## Assumptions & Open Questions
1. Need publicly accessible 2024+ full Denials Index dataset (current Optum 2024 landing is gated – quantitative updates deferred). [^1]
2. Additional primary source for cost per denial (currently secondary). [^8]
3. HCC / Risk Adjustment specific documentation benchmarks not yet ingested (RADV audit references pending corpus entry).
4. CMI improvement benchmark ranges (post‑CDI intervention) require authoritative published study (to be sourced).
5. Full retrofit of legacy PRD sections with footnote markers pending (existing pre‑A1 content predates footnote standard).

## Sources
[^1]: Change Healthcare 2022 Revenue Cycle Denials Index. (Initial denial rate, regional variance, avoidable/non‑recoverable proportions, root cause taxonomy).
[^2]: CAQH CORE Health Care Claims Issue Brief 2023. (Claims data standardization opportunities; denial rate trend context).
[^3]: HFMA Claim Integrity KPI Standardization (Six Denial Metrics). (Definitions for Initial Denial Rate, Primary Denial Rate, Denial Write‑Off %, Time to Appeal, Time to Resolution, % Overturned).
[^4]: HFMA MAP Keys – Revenue Cycle KPIs Portal. (Broader KPI context: Clean Claim Rate, DNFB, A/R metrics).
[^5]: HIPAA Security Rule Technical Safeguards §164.312. (Audit controls, access control, authentication, transmission security requirements).
[^6]: CMS Case Mix Index Definition Page. (CMI formula; dependence on accurate DRG/CC/MCC capture).
[^7]: AHIMA/ACDIS Compliant Query Practice Landing. (Non‑leading, standardized physician query governance expectations).
[^8]: OS Healthcare Measuring the Cost of Denials (Secondary). (Cost per denial ~$117; ~65% never resubmitted; prevention emphasis – secondary corroboration).
[^11]: Azure AI Search Hybrid & Vector Documentation. (Hybrid RRF ranking, vector + keyword fusion powering RAG relevance). Sources: Azure AI Search Hybrid Search Overview; Hybrid Ranking; Vector Search.
[^12]: Azure OpenAI Responses & Embeddings How‑To. (Stateful responses API enabling conversational chains & embeddings for retrieval).
[^15]: CMS ICD-10-CM / ICD-10-PCS Guidelines 2025 and CDC NCHS Governance. (Documentation specificity drives DRG assignment & CC/MCC capture; official quarterly/annual update process).

---

## 11. RICE Prioritization Framework (NEW)

### 11.1 Method Overview
RICE = (Reach × Impact × Confidence) / Effort. We use it to rank backlog items evidence-first. Confidence is decomposed into: Source Count Weight, Source Diversity (regulatory vs. secondary vs. internal analytics), and Consistency (variance across sources). Confidence tiers: **High (0.9)** — >=3 independent authoritative sources + low variance; **Medium (0.7)** — 2 sources or minor variance; **Low (0.5)** — single or secondary only; **Placeholder (0.3)** — hypothesis awaiting data collection.

### 11.2 Input Definitions
| Dimension | Definition | Measurement Window | Notes |
|----------|------------|--------------------|-------|
| Reach | Distinct primary users impacted per month | Month 3 post-launch projected | Derived from target logo pilot sizing (TBD source) |
| Impact | Relative movement toward North Star metrics (1=Minimal, 5=Massive) mapped to % contribution bands | Modeled | Qualitative→quantified translation rubric maintained in data-ai-plan |
| Confidence | Weighted evidence score (see 11.1) | Current | Calculated; drops if conflicting data introduced |
| Effort | Estimated engineer-weeks (½ increments) including QA & a11y | Single release | Includes data ingestion + infra + doc time |

### 11.3 Backlog (Initial Scoring Pass v0.1)
| ID | Epic | User Story (EARS) | Reach (R) | Impact (I 1–5) | Confidence (C) | Effort (E wks) | RICE Score | Evidence Refs | Notes |
|----|------|------------------|-----------|-----------------|----------------|----------------|------------|---------------|-------|
| R1 | Denials Analytics | WHEN denial events are ingested THE SYSTEM SHALL compute Initial Denial Rate and top 5 root causes | 45 | 5 | 0.9 | 3 | (45*5*0.9)/3=67.5 | [^1][^3] | Effort includes taxonomy mapping |
| R2 | Compliant Query Workflow | WHEN a CDI specialist drafts a physician query THE SYSTEM SHALL enforce non-leading templates & immutable audit log | 30 | 4 | 0.8 | 4 | 24.0 | [^5][^7] | Requires auth + audit infra |
| R3 | Work Queue Prioritization | WHEN cases enter review queue THE SYSTEM SHALL rank by predicted financial & clinical impact | 40 | 5 | 0.6 | 5 | 24.0 | [^1][^2][^3] | Predictive model placeholder; confidence medium due variance |
| R4 | Automated Appeal Draft | WHEN a denial is classified THE SYSTEM SHALL generate an appeal draft citing regulations & documentation | 25 | 5 | 0.7 | 6 | 14.6 | [^1][^3][^5] | LLM + evidence bundling complexity |
| R5 | Real-Time KPI Drilldowns | WHEN a manager selects a KPI THE SYSTEM SHALL drill to case-level drivers within 2s P95 | 35 | 4 | 0.7 | 5 | 19.6 | [^3][^4] | Requires optimized OLAP slices |
| R6 | Natural Language Query | WHEN a user asks a supported question THE SYSTEM SHALL return grounded answer with citations | 20 | 4 | 0.6 | 6 | 8.0 | [^11][^12] | RAG infra + guardrails |
| R7 | Physician Query Response Analytics | WHEN queries are answered THE SYSTEM SHALL surface response latency & closure KPIs | 28 | 3 | 0.6 | 3 | 16.8 | [^5][^7] | Depends on R2 event model |
| R8 | Denial Cost Benchmarking | WHEN denial metrics render THE SYSTEM SHALL display cost per denial & unreworked rate | 45 | 3 | 0.5 | 2 | 33.8 | [^1][^8] | Confidence low (secondary cost source) |
| R9 | CMI Lift Estimator | WHEN CDI opportunities identified THE SYSTEM SHALL estimate CMI delta potential | 18 | 4 | 0.5 | 4 | 9.0 | [^6] | Pending additional CMI studies |
| R10 | Security & Audit Dashboard | WHEN admin views security console THE SYSTEM SHALL show access & PHI audit events | 10 | 3 | 0.7 | 3 | 7.0 | [^5] | Compliance prerequisite |

### 11.4 Observations
- Highest current RICE: Denials Analytics baseline (R1) — aligns with wedge & fastest proof of value.
- Appeal Draft (R4) raw Impact high but Effort + moderate confidence lowers rank; revisit post evidence expansion.
- Denial Cost Benchmark (R8) elevated due high Reach despite lower Impact; confidence improvement could shift sequencing.
- Natural Language Query (R6) intentionally sequenced after foundational analytics due infrastructure dependency.

### 11.5 Roadmap Alignment (Wave Mapping)
| Wave | Quarter | Thematic Goal | Included IDs | Rationale |
|------|---------|---------------|-------------|-----------|
| Wave 1 | Q1 | Establish Denial & CDI Visibility | R1, R2, R8 | Fast KPI wins + compliance-critical query governance |
| Wave 2 | Q2 | Automate High-Value Actions | R3, R4, R5 | Introduce prioritization & appeal acceleration post data maturity |
| Wave 3 | Q3 | Intelligence & Exploration | R6, R7, R9 | Adds NLQ, deeper operational analytics, predictive estimation |
| Wave 4 | Q4 | Harden & Scale | R10 + hardening of earlier features | Security posture & scaling refinements |

### 11.6 Future Backlog Candidates (Placeholders)
| Candidate | Description | Evidence Gap | Next Step |
|-----------|-------------|--------------|-----------|
| Dynamic Payer Policy Monitor | Auto-ingest payer bulletins to adjust rules | Needs corpus of payer bulletins | Add ingestion prototype |
| Physician Query Suggestion Ranking | ML model ranks draft templates | Requires labeled historical query outcomes | Collect feedback loop events |
| Denial Win Probability Scoring | Predict overturn likelihood per draft | Needs appeal outcome dataset | Secure de-identified outcome feed |

### 11.7 Open Data Gaps Impacting Confidence
- Cost per denial primary source missing (affects R8 Confidence 0.5 → cap 0.7 if obtained).
- CMI improvement studies absent (affects R9 Confidence). 
- Appeal success benchmarks needed for R4 post-MVP uplift modeling.

---
