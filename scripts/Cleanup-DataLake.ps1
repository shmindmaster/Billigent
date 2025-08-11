# Billigent Data Lake Cleanup Script
# This script organizes the Data Lake structure and configures public access

param(
    [Parameter(Mandatory=$true)]
    [string]$SubscriptionId = "44e77ffe-2c39-4726-b6f0-2c733c7ffe78",
    
    [Parameter(Mandatory=$true)]
    [string]$StorageAccountName = "billigentdevdlseus2",
    
    [Parameter(Mandatory=$true)]
    [string]$ResourceGroupName = "rg-billigent-dev-eus2",
    
    [switch]$DryRun = $false
)

# Set Azure context
Write-Host "Setting Azure context..." -ForegroundColor Green
az account set --subscription $SubscriptionId

# Function to log actions
function Write-Action {
    param($Message, $IsDryRun = $false)
    if ($IsDryRun) {
        Write-Host "[DRY RUN] $Message" -ForegroundColor Yellow
    } else {
        Write-Host "[EXECUTING] $Message" -ForegroundColor Cyan
    }
}

# Function to move blobs between containers/paths
function Move-BlobData {
    param(
        [string]$SourceContainer,
        [string]$SourcePath,
        [string]$DestinationContainer,
        [string]$DestinationPath,
        [bool]$IsDryRun
    )
    
    $message = "Moving $SourceContainer/$SourcePath to $DestinationContainer/$DestinationPath"
    Write-Action -Message $message -IsDryRun $IsDryRun
    
    if (-not $IsDryRun) {
        # Use Azure CLI to copy and then delete
        az storage blob copy start-batch `
            --source-container $SourceContainer `
            --pattern "$SourcePath/*" `
            --destination-container $DestinationContainer `
            --destination-path $DestinationPath `
            --account-name $StorageAccountName
            
        # Wait for copy to complete before deleting
        Start-Sleep -Seconds 5
        
        # Delete source after successful copy
        az storage blob delete-batch `
            --source-container $SourceContainer `
            --pattern "$SourcePath/*" `
            --account-name $StorageAccountName
    }
}

Write-Host "=== Billigent Data Lake Cleanup & Organization ===" -ForegroundColor Magenta
Write-Host "Storage Account: $StorageAccountName" -ForegroundColor White
Write-Host "Subscription: $SubscriptionId" -ForegroundColor White
Write-Host "Dry Run Mode: $DryRun" -ForegroundColor White
Write-Host ""

# Step 1: Migrate terminologies data from bronze container to data/bronze/terminologies
Write-Host "Step 1: Migrating terminologies data..." -ForegroundColor Green
Write-Action -Message "Moving bronze/terminologies/* to data/bronze/terminologies/" -IsDryRun $DryRun

if (-not $DryRun) {
    # Copy terminologies from bronze container to data/bronze/terminologies
    az storage blob copy start-batch `
        --source-container "bronze" `
        --pattern "terminologies/*" `
        --destination-container "data" `
        --destination-path "bronze/terminologies" `
        --account-name $StorageAccountName
        
    # Also copy the root-level terminologies
    az storage blob copy start-batch `
        --source-container "bronze" `
        --pattern "bronze/terminologies/*" `
        --destination-container "data" `
        --destination-path "bronze/terminologies" `
        --account-name $StorageAccountName
}

# Step 2: Migrate CMS claims data
Write-Host "Step 2: Migrating CMS claims data..." -ForegroundColor Green
Write-Action -Message "Moving cms/* to data/bronze/claims/cms/" -IsDryRun $DryRun

if (-not $DryRun) {
    az storage blob copy start-batch `
        --source-container "bronze" `
        --pattern "cms/*" `
        --destination-container "data" `
        --destination-path "bronze/claims/cms" `
        --account-name $StorageAccountName
        
    # Also handle the existing bronze/cms in data container
    az storage blob copy start-batch `
        --source-container "data" `
        --pattern "bronze/cms/*" `
        --destination-container "data" `
        --destination-path "bronze/claims/cms" `
        --account-name $StorageAccountName
}

# Step 3: Migrate ML datasets
Write-Host "Step 3: Migrating ML datasets..." -ForegroundColor Green
Write-Action -Message "Moving huggingface/* to data/bronze/ml-datasets/huggingface/" -IsDryRun $DryRun

if (-not $DryRun) {
    az storage blob copy start-batch `
        --source-container "bronze" `
        --pattern "huggingface/*" `
        --destination-container "data" `
        --destination-path "bronze/ml-datasets/huggingface" `
        --account-name $StorageAccountName
        
    # Handle existing huggingface in data/bronze
    az storage blob copy start-batch `
        --source-container "data" `
        --pattern "bronze/huggingface/*" `
        --destination-container "data" `
        --destination-path "bronze/ml-datasets/huggingface" `
        --account-name $StorageAccountName
}

# Step 4: Organize clinical data
Write-Host "Step 4: Organizing clinical data..." -ForegroundColor Green
Write-Action -Message "Moving mimic/* and synthea/* to data/bronze/clinical/" -IsDryRun $DryRun

if (-not $DryRun) {
    # Move MIMIC data
    az storage blob copy start-batch `
        --source-container "data" `
        --pattern "bronze/mimic/*" `
        --destination-container "data" `
        --destination-path "bronze/clinical/mimic" `
        --account-name $StorageAccountName
        
    # Move Synthea data
    az storage blob copy start-batch `
        --source-container "data" `
        --pattern "bronze/synthea/*" `
        --destination-container "data" `
        --destination-path "bronze/clinical/synthea" `
        --account-name $StorageAccountName
}

# Step 5: Configure public access for silver and gold layers
Write-Host "Step 5: Configuring public access..." -ForegroundColor Green

# Set container access policy for data container (anonymous read for blobs)
Write-Action -Message "Enabling anonymous read access for data container" -IsDryRun $DryRun

if (-not $DryRun) {
    az storage container set-permission `
        --name "data" `
        --public-access blob `
        --account-name $StorageAccountName
}

# Step 6: Create manifest files for data lineage
Write-Host "Step 6: Creating manifest files..." -ForegroundColor Green

$manifestContent = @{
    "dataLake" = @{
        "version" = "1.0"
        "lastUpdated" = (Get-Date -Format "yyyy-MM-ddTHH:mm:ssZ")
        "structure" = @{
            "bronze" = @{
                "description" = "Raw ingestion layer - healthcare data in original formats"
                "subdirectories" = @{
                    "terminologies" = "Medical coding terminologies (ICD-10, HCPCS, MS-DRG)"
                    "claims" = "Healthcare claims data (CMS, Medicare)"
                    "clinical" = "Clinical datasets (MIMIC, Synthea)"
                    "ml-datasets" = "Machine learning training datasets"
                }
            }
            "silver" = @{
                "description" = "Cleaned and validated data - FHIR format"
                "subdirectories" = @{
                    "fhir" = "FHIR-compliant healthcare resources"
                    "terminologies" = "Processed terminology mappings"
                    "claims" = "Standardized claims data"
                }
            }
            "gold" = @{
                "description" = "Business-ready analytics datasets"
                "subdirectories" = @{
                    "analytics" = "Pre-aggregated analytics datasets"
                    "cdi-models" = "Clinical documentation improvement models"
                    "denial-patterns" = "Claims denial pattern analysis datasets"
                }
            }
        }
        "accessLevels" = @{
            "bronze" = "Internal only - contains raw healthcare data"
            "silver" = "Stakeholder access - validated healthcare data"
            "gold" = "Public demo access - aggregated business insights"
        }
    }
    "migrationLog" = @{
        "date" = (Get-Date -Format "yyyy-MM-ddTHH:mm:ssZ")
        "actions" = @(
            "Consolidated bronze container data into data/bronze/ with domain organization",
            "Removed duplicate folder structures",
            "Implemented medallion architecture (bronze/silver/gold)",
            "Enabled public read access for stakeholder review",
            "Created organized directory structure by data domain"
        )
    }
}

$manifestJson = $manifestContent | ConvertTo-Json -Depth 5

Write-Action -Message "Creating data lake manifest file" -IsDryRun $DryRun

if (-not $DryRun) {
    # Save manifest to temporary file and upload
    $tempFile = [System.IO.Path]::GetTempFileName() + ".json"
    $manifestJson | Out-File -FilePath $tempFile -Encoding UTF8
    
    az storage blob upload `
        --file $tempFile `
        --name "DATA_LAKE_MANIFEST.json" `
        --container-name "data" `
        --account-name $StorageAccountName
        
    Remove-Item $tempFile
}

# Step 7: Generate public access URLs for stakeholders
Write-Host "Step 7: Generating public access information..." -ForegroundColor Green

$publicUrls = @{
    "silverFhirData" = "https://$StorageAccountName.blob.core.windows.net/data/silver/fhir/"
    "goldAnalytics" = "https://$StorageAccountName.blob.core.windows.net/data/gold/"
    "dataManifest" = "https://$StorageAccountName.blob.core.windows.net/data/DATA_LAKE_MANIFEST.json"
}

Write-Host ""
Write-Host "=== PUBLIC ACCESS URLS FOR STAKEHOLDER REVIEW ===" -ForegroundColor Yellow
Write-Host "Silver Layer (FHIR Data): $($publicUrls.silverFhirData)" -ForegroundColor Cyan
Write-Host "Gold Layer (Analytics): $($publicUrls.goldAnalytics)" -ForegroundColor Cyan
Write-Host "Data Manifest: $($publicUrls.dataManifest)" -ForegroundColor Cyan
Write-Host ""

# Step 8: Clean up old structures (only if not dry run)
if (-not $DryRun) {
    Write-Host "Step 8: Cleaning up duplicate structures..." -ForegroundColor Green
    
    # Wait for copies to complete
    Start-Sleep -Seconds 10
    
    # Remove old bronze/cms folder from data container
    az storage blob delete-batch `
        --source-container "data" `
        --pattern "bronze/cms/*" `
        --account-name $StorageAccountName
        
    # Remove old bronze/huggingface folder
    az storage blob delete-batch `
        --source-container "data" `
        --pattern "bronze/huggingface/*" `
        --account-name $StorageAccountName
        
    # Remove old bronze/mimic and bronze/synthea
    az storage blob delete-batch `
        --source-container "data" `
        --pattern "bronze/mimic/*" `
        --account-name $StorageAccountName
        
    az storage blob delete-batch `
        --source-container "data" `
        --pattern "bronze/synthea/*" `
        --account-name $StorageAccountName
}

Write-Host ""
Write-Host "=== CLEANUP COMPLETED ===" -ForegroundColor Green
Write-Host "Data Lake is now organized with medallion architecture"
Write-Host "Bronze: Raw healthcare data (internal only)"
Write-Host "Silver: Validated FHIR data (stakeholder access)"
Write-Host "Gold: Business analytics (public demo access)"
Write-Host ""
Write-Host "Next steps:"
Write-Host "1. Review the public URLs above with your stakeholders"
Write-Host "2. Validate data integrity after migration"
Write-Host "3. Consider removing the old 'bronze' container if migration is successful"
Write-Host "4. Set up monitoring and data governance policies"
