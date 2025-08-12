param(
  [string]$Account = 'billigentdevdlseus2',
  [string]$InventoryPath = 'silver/catalog/inventory_pre_migration.csv'
)

$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'

function Write-Log { param([string]$Message) Write-Host ("[{0}] {1}" -f (Get-Date -Format 'yyyy-MM-dd HH:mm:ss'), $Message) }

function Map-TargetPath {
  param([string]$src)
  # src like 'bronze/terminologies/icd-10-cm/file.zip' or 'data/silver/fhir/...' etc.
  if ($src -like 'data/silver/fhir/*') { return $src }
  if ($src -like 'data/bronze/synthea/*') { return $src -replace '^data/bronze/synthea/', 'data/bronze/clinical/synthea/' }
  if ($src -like 'data/bronze/mimic/*')   { return $src -replace '^data/bronze/mimic/',   'data/bronze/clinical/mimic/' }
  if ($src -like 'data/bronze/huggingface/*') { return $src -replace '^data/bronze/huggingface/', 'data/bronze/ml-datasets/huggingface/' }

  if ($src -like 'bronze/terminologies/*') { return 'data/' + $src }
  if ($src -like 'bronze/cms/*') { return $src -replace '^bronze/cms/', 'data/bronze/claims/cms/' }
  if ($src -like 'bronze/huggingface/*') { return $src -replace '^bronze/huggingface/', 'data/bronze/ml-datasets/huggingface/' }

  if ($src -like 'bronze/*') { return 'data/' + $src }
  if ($src -like 'data/*') { return $src }
  # Fallback: assume bronze root
  return 'data/bronze/' + $src
}

$tmp = Join-Path $env:TEMP ("move_plan_" + (Get-Date -Format yyyyMMddHHmmss))
New-Item -ItemType Directory -Path $tmp -Force | Out-Null
$invLocal = Join-Path $tmp 'inventory.csv'
Write-Log "Downloading inventory: $InventoryPath"
az storage fs file download --account-name $Account --file-system data --path $InventoryPath --destination $invLocal --auth-mode login --output none

$inv = Import-Csv -Path $invLocal
$plan = foreach ($row in $inv) {
  $srcPath = [string]$row.path
  # Skip zero-length directories mistakenly inventoried (should be none)
  $target = Map-TargetPath -src $srcPath
  [PSCustomObject]@{
    src_path     = $srcPath
    target_path  = $target
    expected_size= $row.size
    src_sha256   = $row.sha256
  }
}

$planLocal = Join-Path $tmp 'move_plan.csv'
$plan | Export-Csv -NoTypeInformation -Encoding UTF8 -Path $planLocal
Write-Log "Uploading move plan to data/silver/catalog/move_plan.csv"
az storage fs file upload --account-name $Account --file-system data --source $planLocal --path 'silver/catalog/move_plan.csv' --overwrite true --auth-mode login --content-type 'text/csv' --output none
Write-Log 'Done.'


