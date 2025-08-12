param(
  [string]$Account = 'billigentdevdlseus2',
  [string]$PlanPath = 'silver/catalog/move_plan.csv',
  [int]$CopyTimeoutSec = 600
)

$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'

function Write-Log { param([string]$Message) Write-Host ("[{0}] {1}" -f (Get-Date -Format 'yyyy-MM-dd HH:mm:ss'), $Message) }

$tmp = Join-Path $env:TEMP ("blobcopy_verify_" + (Get-Date -Format yyyyMMddHHmmss))
New-Item -ItemType Directory -Path $tmp -Force | Out-Null
$planLocal = Join-Path $tmp 'move_plan.csv'
Write-Log "Downloading move plan: $PlanPath"
az storage fs file download --account-name $Account --file-system data --path $PlanPath --destination $planLocal --auth-mode login --output none

$plan = Import-Csv -Path $planLocal
$results = New-Object System.Collections.Generic.List[object]

$destDirs = New-Object System.Collections.Generic.HashSet[string]

foreach ($row in $plan) {
  $src = [string]$row.src_path
  $dst = [string]$row.target_path
  if (-not ($src -like 'bronze/*')) { continue }

  $srcRel = $src.Substring(7)
  if ($dst -like 'data/*') { $dstRel = $dst.Substring(5) } else { $dstRel = $dst }

  # Ensure destination directory exists in data
  $dstDir = ([System.IO.Path]::GetDirectoryName($dstRel)).Replace('\\','/')
  if ([string]::IsNullOrWhiteSpace($dstDir) -eq $false -and -not $destDirs.Contains($dstDir)) {
    az storage fs directory create --account-name $Account --file-system data --name $dstDir --auth-mode login --output none
    $null = $destDirs.Add($dstDir)
  }

  $srcBlobUrl = "https://$Account.blob.core.windows.net/bronze/$srcRel"
  Write-Log "Copy start: $srcBlobUrl -> data/$dstRel"
  az storage blob copy start --account-name $Account --destination-container data --destination-blob $dstRel --source-uri $srcBlobUrl --auth-mode login --output none

  # Poll for completion
  $sw = [System.Diagnostics.Stopwatch]::StartNew()
  do {
    Start-Sleep -Seconds 2
    $status = az storage blob show --account-name $Account --container-name data --name $dstRel --query properties.copy.status -o tsv
    if ($status -eq 'success') { break }
    if ($status -eq 'failed') { break }
  } while ($sw.Elapsed.TotalSeconds -lt $CopyTimeoutSec)

  if ($status -ne 'success') {
    Write-Log "Copy did not complete successfully for $dstRel (status=$status)"
    $results.Add([PSCustomObject]@{
      src_path = $src
      target_path = $dst
      expected_size = $row.expected_size
      src_sha256 = $row.src_sha256
      dest_sha256 = ''
      match = $false
    })
    continue
  }

  # Verify hash
  $tmpFile = Join-Path $tmp ([IO.Path]::GetRandomFileName())
  az storage fs file download --account-name $Account --file-system data --path $dstRel --destination $tmpFile --auth-mode login --output none
  $sha = (Get-FileHash -Path $tmpFile -Algorithm SHA256).Hash.ToLower()
  Remove-Item $tmpFile -Force
  $match = ($sha -eq [string]$row.src_sha256)
  $results.Add([PSCustomObject]@{
    src_path = $src
    target_path = $dst
    expected_size = $row.expected_size
    src_sha256 = $row.src_sha256
    dest_sha256 = $sha
    match = $match
  })
}

$outLocal = Join-Path $tmp 'copy_verify.csv'
$results | Export-Csv -NoTypeInformation -Encoding UTF8 -Path $outLocal
Write-Log "Uploading verification report to data/silver/catalog/copy_verify.csv"
az storage fs file upload --account-name $Account --file-system data --source $outLocal --path 'silver/catalog/copy_verify.csv' --overwrite true --auth-mode login --content-type 'text/csv' --output none

# Aggressive prune: delete sources where match=true (soft-delete enabled on account)
foreach ($r in $results) {
  if ($r.match -eq $true) {
    $src = [string]$r.src_path
    if ($src -like 'bronze/*') {
      $srcRel = $src.Substring(7)
      Write-Log "Deleting source (soft-delete): bronze/$srcRel"
      az storage fs file delete --account-name $Account --file-system bronze --path $srcRel --auth-mode login --output none
    }
  }
}

Write-Log 'Done.'



