param(
  [string]$Account = 'billigentdevdlseus2',
  [string]$PlanPath = 'silver/catalog/move_plan.csv'
)

$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'

function Write-Log { param([string]$Message) Write-Host ("[{0}] {1}" -f (Get-Date -Format 'yyyy-MM-dd HH:mm:ss'), $Message) }

$tmp = Join-Path $env:TEMP ("copy_verify_" + (Get-Date -Format yyyyMMddHHmmss))
New-Item -ItemType Directory -Path $tmp -Force | Out-Null
$planLocal = Join-Path $tmp 'move_plan.csv'
Write-Log "Downloading move plan: $PlanPath"
az storage fs file download --account-name $Account --file-system data --path $PlanPath --destination $planLocal --auth-mode login --output none

$plan = Import-Csv -Path $planLocal
$results = New-Object System.Collections.Generic.List[object]

foreach ($row in $plan) {
  $src = [string]$row.src_path
  $dst = [string]$row.target_path
  if ([string]::IsNullOrWhiteSpace($src) -or [string]::IsNullOrWhiteSpace($dst)) { continue }

  # Parse filesystems and rel paths
  if ($src -like 'data/*') { $srcFs = 'data'; $srcRel = $src.Substring(5) }
  elseif ($src -like 'bronze/*') { $srcFs = 'bronze'; $srcRel = $src.Substring(7) }
  else { $srcFs = 'bronze'; $srcRel = $src }

  if ($dst -like 'data/*') { $dstFs = 'data'; $dstRel = $dst.Substring(5) } else { $dstFs = 'data'; $dstRel = $dst }

  if ($src -eq $dst) {
    Write-Log "Skip copy (src == dst): $src"
    continue
  }
  $srcUrl = "https://$Account.blob.core.windows.net/$srcFs/$srcRel"
  $dstUrl = "https://$Account.blob.core.windows.net/$dstFs/$dstRel"
  Write-Log "Copy: $srcUrl -> $dstUrl"
  az storage copy --source $srcUrl --destination $dstUrl --auth-mode login --recursive false --output none
}

Write-Log "Verifying destination hashes"
foreach ($row in $plan) {
  $dst = [string]$row.target_path
  if ($dst -like 'data/*') { $dstFs = 'data'; $dstRel = $dst.Substring(5) } else { $dstFs = 'data'; $dstRel = $dst }
  $tmpFile = Join-Path $tmp ([IO.Path]::GetRandomFileName())
  az storage fs file download --account-name $Account --file-system $dstFs --path $dstRel --destination $tmpFile --auth-mode login --output none
  $sha = (Get-FileHash -Path $tmpFile -Algorithm SHA256).Hash.ToLower()
  Remove-Item $tmpFile -Force
  $results.Add([PSCustomObject]@{
    src_path    = $row.src_path
    target_path = $dst
    expected_size = $row.expected_size
    src_sha256  = $row.src_sha256
    dest_sha256 = $sha
    match       = ($sha -eq [string]$row.src_sha256)
  })
}

$outLocal = Join-Path $tmp 'copy_verify.csv'
$results | Export-Csv -NoTypeInformation -Encoding UTF8 -Path $outLocal
Write-Log "Uploading verification report to data/silver/catalog/copy_verify.csv"
az storage fs file upload --account-name $Account --file-system data --source $outLocal --path 'silver/catalog/copy_verify.csv' --overwrite true --auth-mode login --content-type 'text/csv' --output none
Write-Log 'Done.'


