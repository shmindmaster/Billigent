# Synthea FHIR Dataset Ingestion Guide

## Overview

This guide walks through ingesting the Synthea 1000-patient FHIR dataset into Azure Data Lake Storage to provide foundational clinical data for the Billigent platform.

## Prerequisites

1. **Azure CLI** installed and authenticated (`az login`)
2. **Access to Azure Storage Account**: `billigentdevdlseus2`
3. **Permissions**: Storage Blob Data Contributor role on the storage account
4. **Dependencies installed**: Run `pnpm install` to install Azure SDK packages

## Part 1: Data Acquisition

### Step 1.1: Download Synthea Dataset

1. **Visit the Synthea Download Page**:

   - Navigate to: https://synthetichealth.github.io/synthea/getting-started#download-a-sample-dataset
   - Or use direct search: [Synthea 1000 Patient Dataset](https://www.google.com/search?q=synthea+1000+patient+bulk+fhir+download)

2. **Download the ZIP file**:

   - Look for "1,000 patient bulk FHIR (R4)" dataset
   - Download size is typically ~200MB compressed
   - Save to a local directory (e.g., `C:\temp\synthea\` or `~/Downloads/synthea/`)

3. **Extract the dataset**:

   ```bash
   # Windows
   Expand-Archive -Path "synthea-sample-data-fhir-r4-1000-patients.zip" -DestinationPath "C:\temp\synthea"

   # macOS/Linux
   unzip synthea-sample-data-fhir-r4-1000-patients.zip -d ~/temp/synthea
   ```

4. **Verify extraction**:
   You should see files like:
   - `patient.ndjson` (~10MB)
   - `encounter.ndjson` (~8MB)
   - `condition.ndjson` (~5MB)
   - `observation.ndjson` (~50MB)
   - `medication.ndjson` (~2MB)
   - `medicationrequest.ndjson` (~15MB)
   - `procedure.ndjson` (~20MB)
   - And other FHIR resource files

## Part 2: Azure Data Lake Upload

### Step 2.1: Authenticate with Azure

```bash
# Login to Azure (opens browser)
az login

# Verify access to storage account
az storage account show --name billigentdevdlseus2 --resource-group <your-resource-group>
```

### Step 2.2: Upload Using Azure CLI

```bash
# Set variables
$STORAGE_ACCOUNT = "billigentdevdlseus2"
$CONTAINER = "bronze"
$LOCAL_PATH = "C:\temp\synthea"  # Adjust to your extraction path

# Create the synthea directory in bronze container
az storage fs directory create --name "synthea" --file-system $CONTAINER --account-name $STORAGE_ACCOUNT --auth-mode login

# Upload all .ndjson files
az storage fs file upload-batch --destination "synthea" --source $LOCAL_PATH --file-system $CONTAINER --account-name $STORAGE_ACCOUNT --auth-mode login --pattern "*.ndjson"
```

### Step 2.3: Alternative Upload Using AzCopy

If you prefer AzCopy for better performance:

```bash
# Get storage account URL
$STORAGE_URL = "https://$STORAGE_ACCOUNT.dfs.core.windows.net"

# Upload with AzCopy (requires AzCopy to be installed)
azcopy copy "$LOCAL_PATH/*.ndjson" "$STORAGE_URL/bronze/synthea/" --recursive
```

## Part 3: Validation

### Step 3.1: Install Dependencies

```bash
# From the backend directory
cd apps/backend
pnpm install
```

### Step 3.2: Run Validation Script

```bash
# Execute the validation script
pnpm run validate-ingestion
```

### Step 3.3: Expected Validation Output

A successful run should show:

```
🚀 Starting validation of Synthea FHIR dataset in Azure Data Lake
📍 Storage Account: billigentdevdlseus2
📁 File System: bronze
📂 Directory: synthea

🔍 Validating synthea/patient.ndjson...
  ✅ File exists
  ✅ Valid JSON structure
  ✅ Correct FHIR resource type: Patient

🔍 Validating synthea/encounter.ndjson...
  ✅ File exists
  ✅ Valid JSON structure
  ✅ Correct FHIR resource type: Encounter

... (continues for all files)

📊 VALIDATION SUMMARY
═══════════════════════════════════════════════════
Total files checked: 8
Files found: 8/8
Valid JSON files: 8/8
Correct resource types: 8/8
Fully valid files: 8/8

🎉 ALL VALIDATIONS PASSED! Synthea dataset is ready for processing.
```

## Part 4: Data Structure Overview

After successful ingestion, your Azure Data Lake will contain:

```
bronze/
└── synthea/
    ├── patient.ndjson              # ~1,000 patient records
    ├── encounter.ndjson            # ~10,000+ encounter records
    ├── condition.ndjson            # ~15,000+ condition records
    ├── observation.ndjson          # ~200,000+ observation records
    ├── medication.ndjson           # ~2,000+ medication records
    ├── medicationrequest.ndjson    # ~25,000+ medication request records
    ├── procedure.ndjson            # ~30,000+ procedure records
    └── diagnosticreport.ndjson     # ~50,000+ diagnostic report records
```

## Next Steps

Once validation passes, you're ready for:

1. **Data Processing**: Transform FHIR data into structured formats
2. **CDI Evidence Generation**: Extract clinically relevant evidence
3. **Vector Embedding Creation**: Generate embeddings for RAG functionality
4. **Application Integration**: Connect processed data to Billigent workflows

## Troubleshooting

### Common Issues

1. **Authentication Errors**:

   - Ensure `az login` was successful
   - Verify Storage Blob Data Contributor role
   - Try `az account show` to confirm active subscription

2. **File Not Found During Validation**:

   - Verify upload completed successfully
   - Check container and directory names match exactly
   - Use Azure Storage Explorer to browse and confirm files

3. **JSON Parsing Errors**:

   - Download may have been corrupted
   - Re-extract the ZIP file
   - Verify file integrity with file size comparisons

4. **Permission Denied**:
   - Contact Azure administrator for proper RBAC assignments
   - Ensure firewall rules allow access to storage account

## Resource Links

- [Synthea Documentation](https://synthetichealth.github.io/synthea/)
- [Azure Data Lake Storage Gen2 Documentation](https://docs.microsoft.com/en-us/azure/storage/blobs/data-lake-storage-introduction)
- [FHIR R4 Specification](https://hl7.org/fhir/R4/)
- [Azure Storage CLI Reference](https://docs.microsoft.com/en-us/cli/azure/storage/)
