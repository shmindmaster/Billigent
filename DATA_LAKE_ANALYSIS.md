# Billigent Data Lake Structure Analysis & Cleanup Plan

## Current Structure Analysis

### Container Overview

The Data Lake has two containers:

1. **`bronze`** - Raw data ingestion layer
2. **`data`** - Contains medallion architecture with bronze/silver/gold layers

### Identified Issues

#### 1. **Duplicate "bronze" Structure**

- `bronze` container has terminologies data at root level
- `data` container also has a `bronze/` folder with some data
- This creates confusion about which is the authoritative bronze layer

#### 2. **Inconsistent Data Organization**

- Some data exists in both containers
- No clear separation between raw ingestion and processed data
- Missing clear medallion architecture implementation

#### 3. **Mixed Data Types in Bronze Container**

- Medical terminologies (ICD-10, HCPCS, MS-DRG)
- CMS claims data
- HuggingFace medical reasoning datasets
- Both organized and unorganized structures exist

### Current Data Inventory

#### Bronze Container Contents:

```
bronze/
├── terminologies/
│   ├── adjustments/
│   ├── hcpcs/ (HCPCS codes)
│   ├── icd-10-cm/ (ICD-10-CM 2026 files)
│   ├── icd-10-pcs/ (ICD-10-PCS 2026 files)
│   ├── ms-drg/ (MS-DRG weights and tables)
│   └── phase2/ (Additional terminology updates)
├── cms/
│   ├── medicare_claims.csv
│   ├── patients.csv
│   └── payers.csv
└── huggingface/
    ├── medical-reasoning-manifest.json
    └── medical-reasoning-train.json

# Also at root level:
terminologies/ (duplicate structure)
cms/ (duplicate)
huggingface/ (duplicate)
```

#### Data Container Contents:

```
data/
├── bronze/
│   ├── cms/medicare_claims.csv
│   ├── huggingface/
│   ├── mimic/
│   └── synthea/
├── silver/
│   └── fhir/
│       ├── Condition/ (10 condition files)
│       └── Observation/ (10 observation files)
└── gold/ (empty)
```

## Recommended Cleanup & Organization Plan

### Phase 1: Implement Pure Medallion Architecture

#### New Structure Design:

```
billigentdevdlseus2/
└── data/ (single container)
    ├── bronze/ (raw ingestion)
    │   ├── terminologies/
    │   │   ├── icd-10-cm/
    │   │   ├── icd-10-pcs/
    │   │   ├── hcpcs/
    │   │   └── ms-drg/
    │   ├── claims/
    │   │   └── cms/
    │   ├── clinical/
    │   │   ├── mimic/
    │   │   └── synthea/
    │   └── ml-datasets/
    │       └── huggingface/
    ├── silver/ (cleaned & validated)
    │   ├── fhir/
    │   ├── terminologies/
    │   └── claims/
    └── gold/ (business-ready)
        ├── analytics/
        ├── cdi-models/
        └── denial-patterns/
```

### Phase 2: Data Migration Plan

#### Step 1: Consolidate to Single Container

1. Migrate all bronze container data to `data/bronze/`
2. Organize by data domain (terminologies, claims, clinical, ml-datasets)
3. Remove duplicate bronze container

#### Step 2: Clean & Deduplicate

1. Remove duplicate folder structures
2. Standardize naming conventions
3. Add manifest files for data lineage tracking

#### Step 3: Enhance Silver Layer

1. Process terminologies into standardized formats
2. Convert CMS claims to FHIR format
3. Validate all FHIR resources

#### Step 4: Build Gold Layer

1. Create analytics-ready datasets
2. Build CDI reference datasets
3. Create denial pattern datasets

### Phase 3: Public Access Configuration

#### Access Levels:

1. **Bronze Layer**: Internal only (raw data)
2. **Silver Layer**: Stakeholder read access
3. **Gold Layer**: Public read access for demos

#### Security Configuration:

1. Enable Azure AD authentication
2. Configure SAS tokens for stakeholder access
3. Set up read-only access policies
4. Enable audit logging

## Implementation Steps

### Immediate Actions Needed:

1. ✅ Create backup of current structure
2. 🔄 Migrate bronze container data to data/bronze/
3. 🔄 Remove duplicate structures
4. 🔄 Organize by data domains
5. 🔄 Configure public access
6. 🔄 Remove empty bronze container

### Tools Required:

- Azure Storage Explorer
- Azure CLI
- PowerShell scripts for bulk operations
- Data validation scripts

## Benefits of Cleanup:

1. **Clear Data Lineage**: Bronze → Silver → Gold progression
2. **Reduced Confusion**: Single source of truth
3. **Better Organization**: Domain-based structure
4. **Stakeholder Access**: Controlled public access to appropriate layers
5. **Compliance**: Proper data governance and audit trails
