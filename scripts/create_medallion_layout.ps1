param([string]$Account = 'billigentdevdlseus2')

$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'

function Make-Dir($path) {
  az storage fs directory create --account-name $Account --file-system data --name $path --auth-mode login --output none
}

$dirs = @(
  'bronze',
  'bronze/terminologies',
  'bronze/terminologies/icd-10-cm',
  'bronze/terminologies/icd-10-pcs',
  'bronze/terminologies/hcpcs',
  'bronze/terminologies/ms-drg',
  'bronze/terminologies/phase2',
  'bronze/claims',
  'bronze/claims/cms',
  'bronze/clinical',
  'bronze/clinical/synthea',
  'bronze/clinical/smart',
  'bronze/clinical/mimic',
  'bronze/clinical/eicu_demo',
  'bronze/ml-datasets',
  'bronze/ml-datasets/huggingface',
  'silver',
  'silver/fhir',
  'silver/terminologies',
  'silver/claims',
  'silver/catalog',
  'gold',
  'gold/analytics',
  'gold/cdi-models',
  'gold/denial-patterns'
)

foreach ($d in $dirs) { Make-Dir $d }


