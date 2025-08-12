param(
  [Parameter(Mandatory = $false)]
  [string]$Account = 'billigentdevdlseus2',

  [Parameter(Mandatory = $false)]
  [string[]]$FileSystems = @('bronze', 'data')
)

$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'

function Write-Log {
  param([string]$Message)
  $ts = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
  Write-Host "[$ts] $Message"
}

$timestamp = Get-Date -Format yyyyMMddHHmmss
$tempRoot = Join-Path $env:TEMP ("adls_inventory_$timestamp")
New-Item -ItemType Directory -Path $tempRoot -Force | Out-Null

$rows = New-Object System.Collections.Generic.List[object]

foreach ($fs in $FileSystems) {
  Write-Log "Listing file system '$fs'..."
  $itemsJson = az storage fs file list --account-name $Account --file-system $fs --recursive --auth-mode login --output json
  if ([string]::IsNullOrWhiteSpace($itemsJson)) { continue }
  $items = $itemsJson | ConvertFrom-Json
  foreach ($it in $items) {
    if ($it.isDirectory -eq $true) { continue }
    $name = [string]$it.name
    $size = [int64]$it.contentLength
    $last = [datetime]$it.lastModified
    $tmp = Join-Path $tempRoot ([IO.Path]::GetRandomFileName())
    Write-Log "Hashing '$fs/$name' ($size bytes)"
    az storage fs file download --account-name $Account --file-system $fs --path $name --destination $tmp --auth-mode login --output none
    $hash = (Get-FileHash -Path $tmp -Algorithm SHA256).Hash.ToLower()
    Remove-Item $tmp -Force
    $rows.Add([PSCustomObject]@{
      path         = "$fs/$name"
      size         = $size
      lastModified = $last.ToString('o')
      sha256       = $hash
    })
  }
}

$csvLocal = Join-Path $tempRoot 'inventory_pre_migration.csv'
$rows | Sort-Object path | Export-Csv -NoTypeInformation -Encoding UTF8 -Path $csvLocal

Write-Log "Ensuring target directory 'data/silver/catalog' exists"
az storage fs directory create --account-name $Account --file-system data --name 'silver/catalog' --auth-mode login --output none

Write-Log "Uploading inventory to 'data/silver/catalog/inventory_pre_migration.csv'"
az storage fs file upload --account-name $Account --file-system data --source $csvLocal --path 'silver/catalog/inventory_pre_migration.csv' --overwrite true --auth-mode login --content-type 'text/csv' --output none

Write-Log "Done: data/silver/catalog/inventory_pre_migration.csv"
