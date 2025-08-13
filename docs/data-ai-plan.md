# Billigent Data & AI Strategy Plan — v2.2 (Execution-Grade)

**Date:** 12-Aug-2025
**Owner:** Data & AI Team
**Status:** Active Implementation

---

## 1) Purpose & Outcomes

**Purpose:** Stand up a defensible, high-accuracy CDI platform on Azure with a lean but authoritative lakehouse, small SQL “working sets,” and RAG/LLM services that deliver:

- **Pre-bill**: <2s rule checks (ICD-10, MS-DRG, NCCI, MPFS/OPPS sanity).
- **Physician queries**: targeted, evidence-grounded prompts against structured FHIR + notes.
- **Denial analytics**: EOB semantics mapped to CARC/RARC; payer-style simulation until real claims arrive.

**North-star outcomes (12 months):** 40% CDI score lift, 50% reduction in preventable denials, 95%+ data quality, 85%+ recommendation accuracy.

---

## 2) Environment (authoritative)

- **Storage (ADLS Gen2):** `billigentdevdlseus2` → **container: `data`** (single source of truth).
- **Azure SQL:** `billigent-dev-sql-eus2` / DB `BilligentAppDev` (operational “working sets”).
- **Azure OpenAI:** `billigent-dev-openai-eus2` (LLM: **gpt-5-mini**, Embedding: **text-embedding-small**).
- **Azure AI Search:** `billigent-dev-search-basic-eus2` (vector + keyword).
- **Key Vault:** `billigent-dev-kv-eus2` (all secrets; MI everywhere).
- **Auth:** Entra ID + RBAC; no shared keys in app services.

---

## 3) Lakehouse Topology (canonical)

**Single container:** `data`

```
/data/
  bronze/
    terminologies/  icd-10-cm/ icd-10-pcs/ hcpcs/ ms-drg/ ncci/ carc/ rarc/ loinc/ mpfs/ opps/
    providers/      nucc/ nppes/
    sdoh/           svi/
    clinical/       synthea/ smart/ c4bb/ mimic/ eicu_demo/
    claims/         cms/ bb2_sandbox/
    ml-datasets/    huggingface/
  silver/
    fhir/           (normalized slices when needed)
    terminologies/  (+ _snapshots/)
    claims/         eob/
    providers/      nucc/
    sdoh/           svi/
    catalog/        (manifests, QA, data dictionary)
  gold/
    analytics/
    cdi-models/
    denial-patterns/
```

**Guardrails:** freeze legacy `bronze` container (read-only), soft-delete + versioning on account, SHA-256 verification on moves.

---

## 4) Dataset Portfolio (lean core now; paid/DUA later)

### 4.1 Core free datasets to **ingest now** (accurate + small)

| Category         | Dataset                                            | Format            | Refresh          | ADLS Path (bronze)                         | Primary Use                                                |
| ---------------- | -------------------------------------------------- | ----------------- | ---------------- | ------------------------------------------ | ---------------------------------------------------------- |
| Clinical (FHIR)  | **Synthea FHIR R4 (≈1K pts)**                      | ZIP → NDJSON      | Ad-hoc           | `clinical/synthea/1000/`                   | Full clinical graph for pre-bill, evidence joins, UI flows |
| Payer semantics  | **Blue Button 2.0 Sandbox** (EOB/Coverage/Patient) | FHIR JSON via API | Continuous       | `claims/cms/bb2_sandbox/`                  | EOB parsing, CARC/RARC mapping, denial loop prototype      |
| IG examples      | **CARIN C4BB EOB examples**                        | FHIR JSON         | Spec updates     | `clinical/c4bb/examples/`                  | Conformance tests, unit vectors                            |
| Rulebooks        | **ICD-10-CM/PCS**                                  | TXT/CSV/XML       | Annual + addenda | `terminologies/icd-10-cm/`, `icd-10-pcs/`  | Dx/PCS validation, MEAT, grouping inputs                   |
| Rulebooks        | **MS-DRG tables/weights**                          | CSV/XLSX          | Annual           | `terminologies/ms-drg/<FY>/`               | DRG financials (RW, G/AMLOS, transfer)                     |
| Edits            | **NCCI PTP & MUE**                                 | CSV/XLSX          | Quarterly        | `terminologies/ncci/<YYYYQ#>/`             | Code-pair & unit edits, pre-bill suppression               |
| Denial codes     | **CARC/RARC**                                      | CSV/HTML          | Periodic         | `terminologies/carc/`, `rarc/`             | Denial semantics, appeal text hints                        |
| Providers        | **NUCC Taxonomy**                                  | CSV               | Semiannual       | `providers/nucc/`                          | Specialty normalization, routing                           |
| Providers (lite) | **NPPES weekly**                                   | CSV ZIP           | Weekly           | `providers/nppes/weekly/`                  | NPI validation (tiny subset)                               |
| SDOH             | **SVI 2022 (county)**                              | CSV               | Biennial         | `sdoh/svi/2022/`                           | Denial-risk features                                       |
| Labs             | **LOINC top subset**                               | CSV/XLSX          | Periodic         | `terminologies/loinc/top20k/`              | Obs normalization (80/20)                                  |
| Notes (optional) | **eICU demo**                                      | CSV               | Static           | `clinical/eicu_demo/`                      | ICU signals, prompt prototypes                             |
| Notes (DUA)      | **MIMIC-IV-Note**                                  | CSV               | Static           | `clinical/mimic/`                          | Real note style for queries (credentialed)                 |
| Augment          | **HF synthetic ICD-10 sets**                       | JSONL             | Ad-hoc           | `ml-datasets/huggingface/synth-ehr-icd10/` | Prompt-/tool-eval only                                     |

### 4.2 Paid/DUA pipeline **to queue**

- **CCW VRDC LDS/RIF (Medicare claims/EOB)** → real denial patterns.
- **HCUP NIS** → DRG/LOS/charges benchmarking.
- **APR-DRG (3M)**, **CPT (AMA)** → outpatient/commercial parity.
- **Commercial RWD** (Premier/Vizient/MarketScan/TriNetX/Cerner RWD) → scale realism.

---

## 5) Normalization Targets (silver) — **canonical Parquet** + QA

**Terminologies (all append-only, current snapshot mirrored):**

- `codes_icd10cm.parquet(code, title, long_desc, eff_start, eff_end, status)`
- `codes_icd10pcs.parquet(code, title, axis1..axis7, eff_start, eff_end)`
- `msdrg.parquet(drg, desc, rw, amlos, gmlos, transfer_flag, fy)`
- `hcpcs.parquet(code, short_desc, long_desc, status, eff_start, eff_end)`
- `ncci_ptp.parquet(code_a, code_b, modifier_indicator, eff_start, eff_end)`
- `ncci_mue.parquet(code, mue_value, eff_start, eff_end)`
- `carc.parquet(code, group, desc, eff_start, eff_end)`
- `rarc.parquet(code, desc, eff_start, eff_end)`
- `loinc_top.parquet(code, component, property, time, system, scale, method, ucum_hint)`

**Claims/EOB (prototype):**

- `eob_line.parquet(claim_id, line_num, hcpcs, units, charge_amt, paid_amt, drg, service_from, service_to)`
- `eob_adj.parquet(claim_id, line_num, category, amount, carc, rarc, reason_text)`

**FHIR slices (as needed):**

- `fhir/Condition.parquet(...)`, `Observation.parquet(...)`, etc., with stable keys and encounter linkage.

**Snapshots & QA:**

- `_snapshots/*_current.parquet` (latest validity window).
- `/data/silver/catalog/terminologies_normalization/{qa_report.csv,data_dictionary.json,run_manifest.json}`

  - QA includes code counts, date-window overlap checks, null density, referential joins (e.g., DRG↔ICD).

---

## 6) SQL “Working Sets” (fast, tiny, indexed)

**Why:** serve hot UI/LLM lookups without scanning the lake.

**Tables (current only):** `lkp_icd10cm`, `lkp_icd10pcs`, `lkp_msdrg`, `lkp_hcpcs`, `lkp_ncci_ptp`, `lkp_ncci_mue`, `lkp_carc`, `lkp_rarc`, `lkp_nucc_taxonomy`, optional `lkp_npi_provider` (≤50k weekly).

**Facts:** `fact_eob_line`, `fact_eob_adj` (if EOB parquet exists).

**Indexes:**

- Lookups: PK on `code` (or composite), text idx on titles.
- EOB: unique `(claim_id,line_num)`, idx `(hcpcs, drg)`.
- NCCI: idx `(code_a, code_b)` and `(code, eff_from)`.

**Refresh:** overwrite-by-upsert from silver `_current` snapshots on schedule (daily/weekly).

---

## 7) RAG & LLM Orchestration (grounded, deterministic)

**Indices (AI Search):**

- `clinical-docs-index`: fields `{id, name, url, intro, content, contentVector, tags[], license, formats, update_cadence, sample_size, data_size, intended_use, fhir_mapping_hints, stats_json, adls_url, last_updated}`; embeddings with **text-embedding-small**.
- Separate index for **rulebooks excerpts** (ICD titles/guidelines, MS-DRG notes, NCCI policy snippets).
- Optional index for **de-ID notes** (eICU/MIMIC subsets) gated by terms of use.

**Chunking:**

- Rulebooks: \~800–1200 tokens, overlap 120, per-code or per-section.
- Notes: per section note or 1–2k token windows.

**Tooling flow (Responses API):**

1. Retrieve top-k (vector + BM25 hybrid).
2. Deduplicate by code/section id; enforce **cite-or-fail** guard.
3. Structured tool calls: DRG explain, NCCI check, CARC/RARC map.
4. Confidence thresholding → human review if <0.9.

**Primary prompts (system-level intents):**

- **Pre-bill check** (inputs: Dx, Proc, Obs, EOB?) → outputs: flags with rule IDs, evidence spans, fix suggestions with code refs.
- **Physician query draft** (inputs: case summary + ambiguities) → outputs: compliant query, rationale, evidence URIs.
- **Denial mapping** (inputs: EOB lines) → outputs: normalized CARC/RARC, appeal template, missing documentation list.

---

## 8) Real-Time & Batch

**Batch:** scripts/Functions for all free sources; schedule nightly/weekly; provenance JSON per folder.

**Event-driven (future):** Event Hubs → small Functions for change-feeds, if live EHR feeds arrive. Latency target <5s; otherwise batch suffices.

---

## 9) Governance, Security, Compliance

- **Lineage:** Catalog all ingestions; store `run_manifest.json` with source URL, hash, retrieval method, and timestamps.
- **Data quality gates:** schema, code-set validity, date-window checks; reject on critical violations.
- **Access:**

  - Bronze: engineering only.
  - Silver: stakeholder read.
  - Gold: demo-safe read.
  - App: MI with **Storage Blob Data Reader**, **SQL db_datareader/db_datawriter** to working sets.

- **PHI:** keep synthetic/non-PHI until DUA. De-identify notes rigorously when real data arrives.
- **Audit:** App Insights for `/api/explorer/*` access, SQL changes, index writes.

---

## 10) Operations Runbook (MCP-first, reproducible)

**Consolidation (one-time):**

- \#azure-mcp — inventory `bronze/**` & `data/**`, compute SHA-256, write `/data/silver/catalog/_ops/<run>/inventory_pre.csv`.
- Plan mapping → copy → verify → tag → soft-delete matched → freeze legacy `bronze`.
- Emit `/data/silver/catalog/_ops/<run>/{copy_verify.csv, deletes.csv, conflicts.csv, manifest.json}`.

**Acquisition (free core):**

- \#exa / #websearch to resolve authoritative URLs.
- \#playwright to click EULA pages and capture final download URLs when needed.
- \#huggingface to pull synthetic sets.
- Land to `bronze/**`; record `provenance.json` with `final_url`, `retrieved_at`, `sha256`.

**Normalization:**

- Build silver Parquet per §5; store `_snapshots/*_current.parquet`; write QA + dictionary.

**Catalog & Index:**

- Write `/data/silver/catalog/billigent_catalog.csv` (+ parquet).
- Upsert SQL working sets.
- Populate AI Search indices with embeddings.

---

## 11) Product Features Mapping → Data

| Feature                  | Data (silver/SQL)                                                                | Logic                                                                                  |
| ------------------------ | -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| Pre-bill rule checks     | SQL `lkp_*` + silver FHIR slices                                                 | ICD/PCS validity; MS-DRG sanity (RW/LOS); NCCI PTP/MUE; MPFS/OPPS price reasonableness |
| Physician queries        | FHIR (Conditions/Procedures/Observations), notes (eICU/MIMIC), rulebook excerpts | RAG retrieves evidence; LLM drafts compliant query; confidence gates                   |
| Denial analytics (proto) | `eob_line/eob_adj` from BB2.0 + CARC/RARC                                        | Normalize reasons; classify preventable vs documentation; simulate payer edits         |
| Executive metrics        | gold marts                                                                       | Denials by CARC, DRG mix changes, edit-hit rates, query turnaround                     |

---

## 12) SLAs, KPIs, and Quality Gates

- **P95 pre-bill response:** <2s
- **RAG end-to-end:** <10s
- **DQ pass rate:** ≥95% on each nightly run
- **Model accuracy:** ≥85% on validation sets (coding & denial mapping)
- **Uptime:** 99.9% app/API; 99% search index

**Quality gates (block deploy if fail):** schema drift; code-set validity drop >1%; search index doc count delta >10% without manifest.

---

## 13) Risks & Mitigations (targeted)

- **No real denials early:** simulate via NCCI+CARC patterns; queue CCW LDS/RIF; flip once approved.
- **Outpatient parity gaps (CPT/APR-DRG):** scope initial MVP to inpatient DRG; plan paid licenses for parity.
- **Notes realism:** start eICU/MIMIC; layer commercial RWD as contracts close.
- **Search Basic tier limits:** shard docs, compress chunks, throttle batch writes; upgrade to S1+ when index > few million vectors.

---

## 14) Deliverables & Acceptance (phase-by-phase)

**Phase A — Lake correctness (2 weeks):**

- Single `data` container with canonical tree; SHA-verified moves; legacy `bronze` frozen.
- Silver rulebooks Parquet + `_current` snapshots + QA/dictionary.
- Catalog CSV+Parquet in `silver/catalog/`; provenance attached.

**Phase B — App readiness (2–3 weeks):**

- SQL working sets populated; hot indexes present.
- AI Search indices live with embeddings; RAG retrieves rule excerpts with citations.
- Data Explorer page live (read-only) against **silver/gold**.

**Phase C — CDI features (2–4 weeks):**

- Pre-bill service hits SQL lookups + rule excerpts; P95<2s.
- Physician query drafts grounded with evidence URIs; confidence gating.
- Denial prototype from BB2.0 EOB; CARC/RARC normalization; basic trends.

---

## 15) Execution Checklists (succinct)

**Ingestion (each dataset):**

1. Resolve authoritative URL → hash.
2. Land to `bronze/<domain>/<dataset>/<version>/`.
3. Write `provenance.json`.
4. Normalize to `silver` Parquet + snapshot.
5. QA + dictionary + catalog row.

**Search:**

- Chunk, embed (text-embedding-small), upsert; verify doc count & recall on smoke queries.

**SQL:**

- Upsert only `_current` snapshots; cap NPI ≤50k; no notes in SQL.

**Security:**

- MI only; KV secrets; RBAC roles; audit logs for `/api/explorer/*` and index writes.

---

## 16) Appendices

**A) Minimal catalog fields (for each dataset):**
`name, source_url, license, file_formats, update_cadence, fhir_mapping_hints, sample_size, data_size, key_attributes, intended_use, expected_benefits, adls_bronze_path, silver_artifacts, provenance(run_id, retrieved_at, sha256)`.

**B) Validations (per dataset):**

- **ICD/PCS/HCPCS:** duplicate codes, date windows, deprecations.
- **MS-DRG:** FY completeness, RW ranges, LOS bounds.
- **NCCI:** PTP symmetry, MUE numeric validity.
- **CARC/RARC:** code presence, description non-empty.
- **FHIR NDJSON:** JSON validity, resource type, required fields.
- **EOB:** adjudication arrays, amount totals, reason codes cross-walked.

**C) LLM safety rails:**

- Cite or fail; never invent codes; never override rulebooks; redact PHI even in synthetic contexts; log prompts & tool calls.
