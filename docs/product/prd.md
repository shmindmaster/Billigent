# **Product Requirements Document: Billigent**

**Version:** 1.1  
**Date:** August 10, 2025  
**Product:** Billigent Clinical Intelligence Platform  
**Status:** Active Development

## **1. Introduction**

### **1.1 Vision**

To be the indispensable, AI-powered copilot for healthcare revenue integrity, transforming the revenue cycle into a source of strength for healthcare providers.

### **1.2 Mission**

Our mission is to empower healthcare organizations to achieve clinical documentation excellence and financial optimization. We do this by delivering an intelligent, automated platform that reduces administrative burden, allowing providers to focus on what matters most: patient care.

### **1.3 Business Objectives & Success**

Billigent is designed to deliver a transformative impact on the healthcare revenue cycle. Our success is measured by our ability to:

- **Prevent Revenue Leakage:** Proactively identify and resolve documentation gaps to reduce claim denial rates by **at least 40%**.
- **Enhance Clinical Accuracy:** Improve Case Mix Index (CMI) and other quality scores by ensuring the clinical narrative is complete and accurate.
- **Boost Operational Efficiency:** Reduce the average CDI review time from **20 minutes to under 30 seconds** and accelerate the appeals process by **over 75%**.

---

## **2. Target Users & Personas**

Billigent is designed for the clinical and financial professionals on the front lines of the revenue cycle.

| Persona   | Role               | Core Problem                                                                                        | Billigent's Goal for Them                                                                                                                           |
| :-------- | :----------------- | :-------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Chris** | CDI Specialist     | Overwhelmed by manual chart reviews and the pressure to find documentation gaps quickly.            | **"Focus my expertise.** Billigent surfaces the highest-impact opportunities so I can apply my clinical judgment where it matters most."            |
| **Dana**  | Denials Specialist | Spends hours manually writing appeals for claims that were denied due to missing evidence.          | **"Automate the paperwork.** Billigent drafts evidence-based appeals in seconds, freeing me up to manage more cases and win more appeals."          |
| **Mark**  | Rev Cycle Manager  | Lacks real-time visibility into denial trends and team performance, making it hard to be proactive. | **"Turn data into strategy.** Billigent's dashboard gives me the actionable insights I need to identify root causes and optimize team performance." |

---

## **3. Core Features & Capabilities**

### **3.1 Pre-Bill CDI Review: The Automated Safety-Net**

- **Goal:** To review 100% of inpatient charts post-coding but pre-billing to catch and correct documentation and coding errors before they lead to denials.

| Capability                      | Description                                                                                                                                                                              | User Story                                                                                                                                     |
| :------------------------------ | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------- |
| **AI-Powered Analysis**         | The engine ingests FHIR data and uses the `gpt-5-mini` model to analyze the complete patient record (notes, labs, meds) for documentation gaps, coding inaccuracies, and missed CC/MCCs. | As Chris, I want the AI to automatically flag charts with potential documentation gaps so I can avoid manually searching through every record. |
| **Prioritized Work Queue**      | The UI presents all findings in a worklist, automatically prioritized by a calculated financial impact. This ensures users focus on the highest-value opportunities first.               | As Chris, I want my worklist to be sorted by financial impact so I can maximize my team's revenue capture efficiency.                          |
| **Conversational AI Assistant** | A stateful, interactive chat where a user can ask follow-up questions about an AI finding (e.g., "Is there enough evidence to support malnutrition?").                                   | As Chris, I want to ask the AI to explain its reasoning for a finding so I can build confidence and generate a more effective physician query. |

### **3.2 Denials Management: The Appeals Accelerator**

- **Goal:** To transform the slow, manual appeals process into a fast, automated, and highly effective workflow.

| Capability                       | Description                                                                                                                                                                          | User Story                                                                                                                                     |
| :------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------- |
| **Asynchronous PDF Analysis**    | Users upload denial letters (PDFs), and a background AI process analyzes them to extract the denial reason, CARC/RARC codes, and other key details without blocking the UI.          | As Dana, I want to upload a batch of denial letters and be notified when the AI analysis is complete so I can continue working on other tasks. |
| **Automated Appeal Generation**  | The `gpt-5-mini` model synthesizes the denial reason with the patient's full clinical history from the Data Lake to automatically generate a complete, evidence-based appeal letter. | As Dana, I want the AI to draft a persuasive appeal letter for me so I only need to review, edit, and submit it, saving me hours of work.      |
| **Appeal Tracking & Management** | A comprehensive dashboard for tracking the status of all appeals, managing deadlines, and analyzing success rates to identify trends with specific payers.                           | As Mark, I want to see our appeal success rate by payer so I can identify problematic contracts and trends.                                    |

### **3.3 Analytics & Reporting: The Intelligence Cockpit**

- **Goal:** To provide real-time, actionable insights into the entire revenue cycle process.

| Capability                  | Description                                                                                                                                                                                                                                 | User Story                                                                                                                           |
| :-------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :----------------------------------------------------------------------------------------------------------------------------------- |
| **Real-Time KPI Dashboard** | A live dashboard displaying key metrics like denial rates, CMI uplift, appeal success rates, and total revenue impact.                                                                                                                      | As a hospital executive, I want to see the overall financial ROI of the Billigent platform at a glance.                              |
| **Natural Language Query**  | An AI-powered interface allowing users to ask questions in plain English (e.g., "What were our top denial reasons last quarter?") and receive answers with supporting charts and data, powered by the Responses API's **Code Interpreter**. | As Mark, I want to ask "Show me the query agreement rate for Dr. Smith" so I can get instant answers without needing a data analyst. |

---

## **4. Technical & Non-Functional Requirements**

### **4.1 System Architecture**

- **Frontend**: React 19, Vite, ShadCN UI, Tailwind CSS 4.1
- **Backend**: Node.js 22, Express, Prisma ORM
- **AI/ML**: Azure OpenAI (**`gpt-5-mini`** via Responses API), Azure AI Search for RAG
- **Infrastructure**: Azure Kubernetes Service (AKS), Azure SQL, Azure Data Lake

### **4.2 Performance & Reliability**

- **Availability**: **99.9% uptime** SLA.
- **UI Response Time**: **< 2 seconds** (P95) for all interactive queries.
- **AI Processing Time**: Asynchronous processing for long-running tasks; sub-60-second response for real-time queries.
- **Scalability**: Cloud-native architecture designed to auto-scale based on demand.

### **4.3 Security & Compliance**

- **HIPAA Compliance**: The platform will be designed and operated in full compliance with HIPAA and HITECH regulations, governed by an executed Azure BAA.
- **Data Encryption**: **AES-256 at rest** and **TLS 1.3 in transit**.
- **Authentication**: Secure authentication via **Microsoft Entra ID (OAuth 2.0)** with mandatory MFA.

### **4.4 Data & AI Strategy**

- **Data Governance**: A comprehensive data catalog will track the source, lineage, and quality of all ingested data.
- **RAG for Accuracy**: AI reasoning will be grounded in official terminologies (ICD-10, MS-DRG) and high-quality clinical datasets using an Azure AI Search-powered RAG architecture.
- **Human-in-the-Loop**: All critical AI-generated outputs (e.g., physician queries, appeal letters) are presented as drafts for mandatory review by a human expert.

---

## **5. Implementation & Roadmap**

### **5.1 10-Week Implementation Plan**

| Phase                             | Duration | Key Deliverables                                                                               |
| :-------------------------------- | :------- | :--------------------------------------------------------------------------------------------- |
| **Foundation (Weeks 1-2)**        | 2 Weeks  | Azure infrastructure provisioned; Database schema deployed; UI framework and navigation built. |
| **Core Features (Weeks 3-6)**     | 4 Weeks  | Pre-Bill analysis engine (v1); Live KPI dashboard; User management.                            |
| **Advanced Features (Weeks 7-8)** | 2 Weeks  | Denials management module; Natural language query interface.                                   |
| **Production Ready (Weeks 9-10)** | 2 Weeks  | Comprehensive testing; Security validation; Go-live preparation and documentation.             |

### **5.2 Future Roadmap**

- **Short-term (6 months):** Predictive denial avoidance analytics; Mobile application.
- **Medium-term (12 months):** Population health analytics; API marketplace for third-party integrations.
- **Long-term (24 months):** Advanced workflow automation and international standards support.
