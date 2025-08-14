# Copilot Processing

## User Request Details (Continuation Context)
- Date: 2025-08-14
- Latest explicit user command: "continue"
- Interpreted meaning: Proceed with previously enumerated pending tasks in strategic documentation & prototype build workflow (extend PRD with RICE/backlog/roadmap, introduce Quality Gates, create structured competitive feature extraction JSON, citation density normalization, quantitative benchmarks, RICE scoring & backlog population, corpus enrichment, optional DSL evolution spec).

## Pending Objectives Snapshot
1. PRD augmentation: RICE prioritization, backlog (Epics -> Stories with IDs), roadmap alignment wave mapping.
2. Quality Gates definition (release readiness: data, model, explainability, security, a11y, performance) – decide doc placement (extend `data-ai-plan.md` or new `quality-gates.md`).
3. Structured extraction artifact: `competitive_features.json` capturing competitor -> feature -> status (enum), evidence source citation references.
4. Citation density normalization: ensure every material claim/table row across docs has footnote or source tag.
5. Quantitative benchmarks research placeholders: pricing tiers ranges, adoption metrics, appeal overturn baseline, time-to-draft benchmarks.
6. RICE scoring execution for backlog items with Confidence referencing evidence corpus density and source diversity.
7. Corpus enrichment pass: add newly required quantitative sources into `corpus.jsonl` with metadata (source_type, reliability_score).
8. Optional: DSL evolution specification for KPI rules (future grammar: boolean combinations, temporal qualifiers, aggregation windows).

## Assumptions Captured
- No conflicting user directives supersede continuation.
- Strategy prototype code stable; focus shifts to documentation & structured data artifacts.
- Tooling available: file write operations only (no execution needed for docs).

## Constraints
- Maintain evidence-first methodology: every new claim linked to a source stub (even if TBD placeholder until enrichment).
- Maintain CHANGELOG entry per discrete artifact addition or major update.
- Follow accessibility guidance and secure coding (where code-like examples appear) minimally.

## Success Criteria (Initial)
- PRD updated with RICE & backlog sections referencing evidence IDs.
- Quality Gates documented with measurable thresholds.
- `competitive_features.json` created with schema + at least initial feature mapping for existing competitors from `competitive-analysis.md`.
- CHANGELOG updated for each artifact.
- No orphan claims (temporary TBD placeholders clearly marked and tagged for follow-up).

## Action Plan Phases

### Phase A: PRD Augmentation
Tasks:
- Insert RICE methodology overview section.
- Build Backlog table: ID, Epic, User Story (EARS), RICE inputs (Reach, Impact, Confidence, Effort), preliminary scores placeholders.
- Draft initial RICE values (or placeholders) referencing evidence citation IDs.
- Add Roadmap alignment tying top RICE items to Waves (Q1/Q2 etc.).

### Phase B: Quality Gates
Tasks:
- Decide placement (append to `data-ai-plan.md`).
- Define gate categories: Data, Model, Explainability, Security/Privacy, Accessibility, Performance, Observability.
- For each: measurable criteria, metric, threshold, evidence link.

### Phase C: Structured Competitive Features Extraction
Tasks:
- Define JSON schema (competitors[], features[], matrix entries with status enum: {native, partial, roadmap, absent, ambiguous}).
- Populate with current qualitative assessment from `competitive-analysis.md`.
- Add citation references (source_ids array) per competitor-feature tuple.

### Phase D: Citation Density Normalization
Tasks:
- Scan new/backlog sections; ensure each claim references an existing or placeholder source ID.
- Mark TBD sources for later enrichment.

### Phase E: Quantitative Benchmarks Placeholders
Tasks:
- Add sections listing required metrics & placeholder ranges (pricing, adoption, appeal overturn rate, drafting time) with TODO citations.

### Phase F: RICE Scoring Finalization
Tasks:
- Compute RICE Score = (Reach * Impact * Confidence) / Effort for backlog entries once placeholders replaced.
- Add rationale notes column referencing evidence density (count of sources backing each factor).

### Phase G: Corpus Enrichment Stubs
Tasks:
- For each placeholder metric, append stub entries to `corpus.jsonl` with status:"pending_collection".

### Phase H: Optional DSL Evolution Spec
Tasks:
- Sketch future grammar features & migration implications (deferred unless time remains).

## Tracking Table
| Phase | Status | Notes |
|-------|--------|-------|
| A | Complete | PRD RICE + backlog + roadmap added |
| B | Complete | Quality Gates appended to data-ai-plan.md |
| C | Complete | competitive_features.json created |
| D | In Progress | Citation review upcoming; new sections footnoted |
| E | In Progress | benchmarks-placeholders.md created (v0.1) |
| F | Pending | Await quantitative placeholders |
| G | In Progress | Added benchmark placeholder stubs to corpus.jsonl (13 entries) |
| H | Pending | Deferred |

### Execution Update (Auto Seeding Integration)
- Added exported `runFullSeed` function to `packages/database/prisma/seed.ts` for programmatic invocation.
- Wrapped original CLI execution logic with conditional `require.main === module`.
- Modified `ensureSeeded.ts` to dynamically import and run full seed when baseline tables are empty.
- Rationale: Eliminates manual step, guarantees real data presence replacing former mock dependency without adding startup overhead when data already exists.
- Next: Create initial Prisma migration (`pnpm -F @billigent/database run db:migrate --name init`) and add startup check for pending migrations (deferred to next action set).



### Execution Update (Prisma Schema Normalization & Migration Attempt)
- Added local `.env` with placeholder SQL Server `DATABASE_URL`.
- Replaced unsupported `Json` fields (SQL Server connector) with `String @db.NVarChar(Max)` storing serialized JSON.
- Removed Prisma enums (SQL Server connector lacks enum support) and converted to `String` columns with documented allowed values (application-level constraint pending).
- Added reverse relations: `Patient.fhirResources`, `Encounter.fhirResources`.
- Broke cyclic cascade path by setting `onDelete`/`onUpdate: NoAction` on `FhirResource.patient` & `FhirResource.encounter` relations.
- Re-ran validation: prior JSON/enum errors resolved; now blocked by connectivity (P1001 cannot reach `localhost:1433`).
- No migration generated yet (empty `prisma/migrations`). Prisma requires live connection even with `--create-only` for SQL Server to introspect / confirm shadow DB.

Blocking Issue:
- SQL Server instance not running or not reachable at `localhost:1433`.

Proposed Unblock Options:
1. Start local SQL Server container:
   `docker run -e ACCEPT_EULA=Y -e MSSQL_SA_PASSWORD=YourStrong!Passw0rd -p 1433:1433 mcr.microsoft.com/mssql/server:2022-latest`
2. Or provision Azure SQL and update `DATABASE_URL` (ensure firewall rules allow local dev IP).
3. After DB reachable: rerun `pnpm -F @billigent/database prisma migrate dev --name init --create-only` then plain `pnpm -F @billigent/database prisma migrate deploy` (for ci) or `dev` (local) and start backend to trigger seeding.

Next Planned Steps:
- Bring up database & generate migration
- Implement migration drift readiness check
- Proceed to search index provisioning and readiness integration
