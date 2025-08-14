# **Billigent Product Requirements Document (PRD)**

**Version:** 1.2  
**Date:** August 10, 2025  
**Product:** Billigent Clinical Intelligence Platform  
**Status:** Active Development  
**Owner:** Product Management

---

## **1. Executive Summary**

Billigent is an enterprise-ready, Azure-native clinical intelligence cockpit designed to revolutionize healthcare revenue cycle management through AI-powered insights and automation. The platform addresses three critical challenges: **preventing claim denials** before they happen, **perfecting clinical documentation (CDI)** in real-time, and **accelerating the appeals process** from days to minutes. This document serves as the single source of truth for the product's vision, features, and requirements.

---

## **2. Product Vision & Business Objectives**

### **2.1 Vision Statement**

> **"Transform healthcare revenue cycle management through intelligent automation, ensuring optimal patient care documentation while maximizing financial outcomes."**

### **2.2 Mission Statement**

To empower healthcare organizations to achieve clinical documentation excellence and financial optimization through AI-driven insights, reducing administrative burden while improving patient care quality.

### **2.3 Business Objectives**

| Primary Goal                      | Key Result (Year 1 Target)                                         |
| :-------------------------------- | :----------------------------------------------------------------- |
| **Reduce Claim Denial Rates**     | ↓ 50% through proactive pre-bill analysis                          |
| **Improve CDI Quality Scores**    | ↑ 40% via intelligent documentation recommendations                |
| **Accelerate Appeals Processing** | ↓ 75% in time-to-appeal through automated evidence generation      |
| **Enhance Revenue Capture**       | Identify and capture previously missed documentation opportunities |

### **2.4 Engineering Success Metrics (DORA)**

- **Deployment Frequency**: Daily feature releases to production.
- **Lead Time for Changes**: < 2 hours from code commit to production deployment.
- **Change Failure Rate**: < 5% of deployments requiring a hotfix.
- **Mean Time to Recovery (MTTR)**: < 30 minutes for critical service restoration.

---

## **3. Target Users & Personas**

### **3.1 Primary Users**

#### **1. Chris, the CDI Specialist**

- **Role**: Clinical Documentation Improvement specialist responsible for reviewing patient charts for accuracy and completeness.
- **Pain Points**: Time-consuming manual review processes, difficulty spotting subtle documentation gaps, pressure to improve coding accuracy.
- **Goals**: Quickly identify high-impact improvement opportunities, ensure coding is defensible and accurate, and optimize the hospital's Case Mix Index (CMI).
- **Billigent's Goal for Chris**: **Focus his expertise.** Billigent surfaces the highest-impact opportunities so he can apply his clinical judgment where it matters most.

#### **2. Mark, the Revenue Cycle Manager**

- **Role**: Leader of the revenue cycle operations team.
- **Pain Points**: High claim denial rates, slow appeals management, lack of real-time visibility into the financial impact of CDI.
- **Goals**: Minimize denial rates, optimize revenue capture, and improve overall cycle efficiency.
- **Billigent's Goal for Mark**: **Turn data into strategy.** Billigent's dashboard provides the actionable insights needed to identify root causes and optimize team performance.

#### **3. Dana, the Denials & Coding Specialist**

- **Role**: Medical coding professional who also manages the denials and appeals process.
- **Pain Points**: Complex coding decisions, staying current with regulations, the slow and manual process of gathering evidence and writing appeal letters.
- **Goals**: Ensure accurate coding, maintain compliance, and increase the success rate of appeals.
- **Billigent's Goal for Dana**: **Automate the paperwork.** Billigent drafts evidence-based appeals in seconds, freeing her up to manage more cases and win more appeals.

### **3.2 Secondary Users**

- **Healthcare Administrators**: Hospital/health system executives focused on financial performance, operational efficiency, and compliance risk. They will use executive dashboards for strategic oversight.
- **IT/Security Teams**: Healthcare IT and information security professionals focused on system integration, data security, and compliance. They will use system monitoring and security management tools.

---

## **4. Core Features & Capabilities**

### **4.1 Analytics & Reporting Dashboard**

#### **1.1 Real-Time KPI Monitoring**

- **Description**: A live dashboard displaying key performance indicators for revenue cycle health.
- **Features**: Claim denial rates and root cause trends; CDI quality score improvements over time; Appeals success rates by payer; Real-time revenue impact of CDI queries; Case volume and team processing statistics.

#### **1.2 Interactive Data Visualization**

- **Description**: Dynamic charts and graphs for deep data exploration.
- **Features**: Drill-down capabilities from summary to individual case-level detail; Time-series analysis with customizable date ranges; Comparative analysis across service lines, departments, and individual providers; One-click export to PDF and CSV for reporting.

#### **1.3 Natural Language Query Interface**

- **Description**: An AI-powered query system allowing users to ask questions of their data in plain English.
- **Features**: Powered by the Azure OpenAI Responses API's **Code Interpreter**, this allows users to ask questions like, "What's our denial rate for cardiology this month?" and receive back contextual AI responses with supporting charts and data.

### **4.2 Pre-Bill CDI Review**

#### **2.1 FHIR Data Ingestion**

- **Description**: Automated, near real-time ingestion of clinical data from EHR systems via a secure FHIR R4 API connection.
- **Technical Requirements**: Support for FHIR `Bundle` resources; Secure connectivity to HL7 FHIR servers; Storage of raw data in Azure Data Lake; Secure data transmission (TLS 1.3).

#### **2.2 AI-Powered Documentation Analysis**

- **Description**: The core intelligence engine that analyzes clinical documentation for gaps and opportunities.
- **AI Capabilities**: Utilizes Azure OpenAI `gpt-5-mini` to perform documentation gap identification, coding accuracy validation, severity and specificity recommendations, and checks against a knowledge base of ICD-10, CPT, and HCPCS codes.

#### **2.3 Prioritized Work Queue**

- **Description**: An intelligent worklist that prioritizes cases based on a calculated financial impact and clinical risk.
- **Features**: Real-time financial impact calculation for each finding; Risk stratification to highlight quality-of-care issues; Deadline tracking for timely review.

#### **2.4 Conversational AI Assistant**

- **Description**: An interactive AI copilot for detailed case discussions.
- **Features**: Stateful, case-specific conversation threads using the Responses API's `previous_response_id`; Handles follow-up questions about AI findings; Provides evidence-based recommendations and documentation templates.

### **4.3 Denials Management**

#### **3.1 Automated Denial Letter Processing**

- **Description**: Automated ingestion and analysis of denial letters and Explanation of Benefits (EOBs).
- **Technical Requirements**: Utilizes Azure AI Document Intelligence (formerly Form Recognizer) for PDF upload with OCR processing; Extracts and categorizes denial reasons and CARC/RARC codes with >95% accuracy.

#### **3.2 Asynchronous AI Analysis**

- **Description**: A non-blocking, background processing workflow for denial analysis.
- **Features**: A queue-based architecture allows users to upload multiple denials and receive notifications when the AI analysis is complete, with full visibility into the processing status.

#### **3.3 Automated Appeal Generation**

- **Description**: AI-powered generation of complete, evidence-based appeal letters.
- **AI Capabilities**: Synthesizes clinical documentation from the Data Lake, integrates regulatory citations, and generates a persuasive appeal letter with an assessment of evidence strength.

#### **3.4 Appeal Tracking & Management**

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
