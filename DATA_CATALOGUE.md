# Billigent Data Catalogue

**Generated:** August 9, 2025  
**Total Datasets:** 31 files across 4 directories  
**Total Size:** 114.12 MB  
**Status:** Requires migration to Azure Data Lake Storage

## Executive Summary

This catalogue documents all dataset artifacts currently stored locally in the Billigent repository. These datasets span medical coding standards, synthetic healthcare data, AI model artifacts, and automation test data. All datasets require migration to Azure Data Lake Storage under the established bronze/silver/gold structure.

## Dataset Categories

### 1. Medical Coding Standards (tmp/)

**Location:** `tmp/`  
**Files:** 9 files  
**Size:** 5.05 MB  
**Purpose:** Authoritative medical coding datasets for AI training and clinical intelligence  
**Status:** Ready for Azure migration to bronze/terminologies/

#### 1.1 HCPCS Codes (CMS 2025)

- **File:** `hcpcs-codes-cms-2025.json`
- **Size:** 5.24 MB
- **Source:** CMS (Centers for Medicare & Medicaid Services)
- **Acquisition Method:** Automated download and processing via TypeScript scripts
- **Format:** Structured JSON with standardized fields
- **Schema:**
  ```json
  {
    "code": "string",
    "description": "string",
    "category": "string",
    "subcategory": "string",
    "status": "string"
  }
  ```
- **Update Frequency:** Quarterly (CMS releases)
- **Retention:** Permanent (regulatory compliance)
- **Azure Target Path:** `billigentdevdlseus2/bronze/terminologies/hcpcs/`

#### 1.2 RARC Codes (X12 2025)

- **File:** `rarc-codes-x12-2025.json`
- **Size:** 48.87 KB
- **Source:** X12.org External Code Lists
- **Acquisition Method:** Automated extraction via Playwright browser automation
- **Format:** Structured JSON with code-description mapping
- **Schema:**
  ```json
  {
    "code": "string",
    "description": "string",
    "category": "remittance_advice"
  }
  ```
- **Update Frequency:** As needed (X12 standards updates)
- **Retention:** Permanent (claims processing compliance)
- **Azure Target Path:** `billigentdevdlseus2/bronze/terminologies/x12-codes/rarc/`

#### 1.3 ICD-10 Sample Data

- **Files:**
  - `icd10cm_codes.txt` (73 bytes)
  - `icd10pcs_codes.txt` (108 bytes)
- **Source:** Test/sample data
- **Purpose:** Development and testing
- **Status:** Can be archived/deleted (real ICD-10 data already in Azure)

#### 1.4 MS-DRG Weights

- **File:** `ms_drg_relative_weights.csv`
- **Size:** 106 bytes
- **Source:** CMS sample data
- **Purpose:** Testing MS-DRG weight calculations
- **Status:** Sample data, can be archived

#### 1.5 Support Files

- **Files:**
  - `azure-upload-manifest-phase2.json` (2.51 KB) - Upload tracking
  - `comprehensive-medical-coding-datasets-2025.md` (6.88 KB) - Documentation
  - `search-index-schema.json` (1.82 KB) - AI Search schema
  - `test-denial.pdf` (651 bytes) - Test document

### 2. Synthetic Healthcare Data (synthea_output/)

**Location:** `synthea_output/`  
**Files:** 4 files  
**Size:** 8.75 MB  
**Purpose:** Synthetic patient data for development, testing, and AI training  
**Status:** Requires review and migration

#### 2.1 Synthetic Patient Records

- **Source:** Synthea (Open-source patient generator)
- **Format:** FHIR-compliant JSON and CSV
- **Purpose:** Development environment patient data
- **Privacy Status:** Synthetic (no real PHI)
- **Retention:** Long-term (valuable for testing)
- **Azure Target Path:** `billigentdevdlseus2/bronze/synthetic-data/synthea/`
- **Compliance:** HIPAA-safe (synthetic data)

### 3. AI/ML Model Data (huggingface_data/)

**Location:** `huggingface_data/`  
**Files:** 2 files  
**Size:** 61.49 MB  
**Purpose:** Cached HuggingFace model data and embeddings  
**Status:** Can be regenerated, consider cleanup

#### 3.1 HuggingFace Cache

- **Source:** HuggingFace model downloads
- **Purpose:** Cached transformer models and tokenizers
- **Regenerable:** Yes (can be re-downloaded)
- **Retention:** Short-term (cache data)
- **Recommendation:** Clean up and exclude from version control
- **Azure Strategy:** Do not migrate (regenerable cache)

### 4. Automation Test Data (.playwright-mcp/)

**Location:** `.playwright-mcp/`  
**Files:** 16 files  
**Size:** 38.83 MB  
**Purpose:** Playwright browser automation artifacts and test data  
**Status:** Tool-generated artifacts

#### 4.1 Browser Automation Cache

- **Source:** Playwright MCP server operations
- **Content:** Screenshots, page captures, automation artifacts
- **Purpose:** Web scraping and browser automation support
- **Regenerable:** Yes (test artifacts)
- **Retention:** Short-term (development artifacts)
- **Recommendation:** Clean up regularly
- **Azure Strategy:** Do not migrate (temporary artifacts)

## Migration Plan

### Immediate Actions (Azure Migration)

1. **Medical Coding Standards** → Migrate to `bronze/terminologies/`
2. **Synthetic Data** → Migrate to `bronze/synthetic-data/`
3. **AI Cache & Automation** → Clean up locally (do not migrate)

### Azure Data Lake Structure

```
billigentdevdlseus2/
├── bronze/
│   ├── terminologies/
│   │   ├── hcpcs/
│   │   │   └── hcpcs-codes-cms-2025.json
│   │   └── x12-codes/
│   │       └── rarc/
│   │           └── rarc-codes-x12-2025.json
│   └── synthetic-data/
│       └── synthea/
│           └── [synthetic patient files]
├── silver/
│   └── [processed/cleaned datasets]
└── gold/
    └── [analytics-ready datasets]
```

### Data Governance

- **Retention Policies:** Defined per dataset category
- **Access Controls:** Azure RBAC with healthcare compliance
- **Audit Trails:** Azure Monitor logging for all data access
- **Backup Strategy:** Azure geo-redundant storage
- **Compliance:** HIPAA, SOX, and healthcare regulatory requirements

## Security Considerations

### Data Classification

- **Medical Coding Standards:** Public but business-critical
- **Synthetic Data:** Safe for development (no real PHI)
- **Cache/Test Data:** Low sensitivity, temporary

### Access Controls

- **Production Data:** Restricted to authorized personnel only
- **Development Data:** Team access with audit logging
- **Synthetic Data:** Broader development team access

### Encryption

- **At Rest:** AES-256 encryption in Azure Data Lake
- **In Transit:** TLS 1.3 for all data transfers
- **Key Management:** Azure Key Vault integration

## Monitoring and Alerting

### Data Quality Monitoring

- **Schema validation:** Automated checks on upload
- **Data freshness:** Alerts for stale datasets
- **Access monitoring:** Unusual access pattern detection

### Cost Management

- **Storage optimization:** Lifecycle policies for old data
- **Access tier management:** Hot/cool/archive tier automation
- **Usage tracking:** Monthly cost and usage reports

## Next Steps

1. **Execute Azure Migration** (Phase 3)
2. **Create Ingestion Logs** (Phase 4)
3. **Clean Local Repository** (Phase 5)
4. **Validate Migration** (Phase 6)
5. **Implement Monitoring**
6. **Set Up Automated Backups**

---

**Document Version:** 1.0  
**Last Updated:** August 9, 2025  
**Maintained By:** Billigent Platform Team  
**Review Schedule:** Monthly
