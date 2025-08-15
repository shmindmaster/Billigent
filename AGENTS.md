---
name: "Billigent Platform"
description: "An AI-assisted clinical coding and revenue integrity platform with a TypeScript monorepo: Express API, Vite frontend, Azure integrations, and ICD‑10‑CM ingestion (staging→Bronze→Silver) with automated E2E tests."
category: "Healthcare AI / Full-Stack Monorepo"
author: "shmindmaster"
authorUrl: "https://github.com/shmindmaster"
tags:
  [
    "typescript",
    "nodejs",
    "express",
    "vite",
    "react",
    "pnpm",
    "azure",
    "cosmos-db",
    "cognitive-search",
    "playwright",
    "icd10cm",
  ]
lastUpdated: "2025-08-15"
---

# Billigent Platform Development Guide

## Project Overview

Billigent is a full‑stack TypeScript monorepo focused on clinical coding assistance and revenue integrity workflows. It combines:

- An Express API with Azure integrations (Cosmos DB, Cognitive Search, optional OpenAI) and domain services (FHIR mock, CDI workflow stubs).
- A Vite + TypeScript SPA frontend (apps/frontend).
- A repeatable ICD‑10‑CM ingestion pipeline (download → parse/normalize + diff → optional upload to data lake) using a layered data model (staging → Bronze → Silver; future Gold).
- Automated tests with Playwright and repository hygiene (pnpm workspaces, strict TypeScript, Conventional Commits).

Applicable scenarios: coding research, terminology ingestion, prototype RAG/strategy endpoints, and operational dashboards.

## Tech Stack

- **Frontend**: Vite + TypeScript SPA (React 18 assumed; adjust if using another framework)
- **Backend**: Node.js (>=18/20) + Express + TypeScript (moduleResolution: NodeNext)
- **Database**: Azure Cosmos DB (in‑memory fallback for local dev); Azure Data Lake Storage for artifacts (optional)
- **Search/AI**: Azure Cognitive Search (stats/health), optional Azure OpenAI (guarded by env)
- **Testing**: Playwright (E2E, accessibility, visual), Vitest/Jest optional for units
- **Build/Tooling**: pnpm workspaces, tsx, ESLint/Prettier, Sentry (optional)
- **Deploy**: Azure (App Service/Container), GitHub Actions (recommended), ADLS for Bronze/Silver paths

## Project Structure

```
Billigent/
├── apps/
│   ├── backend/                 # Express API + scripts + services
│   └── frontend/                # Vite + TS SPA
├── deploy/                      # Deployment scaffolding / infra helpers
├── docs/                        # Architecture, product strategy, research
├── packages/                    # Shared libs (if/when added)
├── scripts/                     # Cross-repo utilities (PowerShell/TS)
├── tests/                       # E2E/fixtures/integration/visual
├── testsprite_tests/            # AI test generation artifacts
├── types/                       # Global type declarations
├── AGENTS.md                    # This guide
├── README.md                    # Project readme
├── pnpm-workspace.yaml          # Workspace config
└── package.json                 # Root package
```

Backend ingestion working paths (generated, now git‑ignored):

- `apps/backend/data-sources/icd10cm/<year>/{raw,work,normalized}`

## Development Guidelines

### Code Style

- TypeScript strict mode; moduleResolution NodeNext (ensure import paths include `.js` in emitted ESM where required).
- ESLint + Prettier for consistent formatting; avoid unused exports/vars.
- Favor small, pure functions; document “why” when logic isn’t obvious.

### Naming Conventions

- Files/dirs: kebab-case (`case.repository.ts`, `physician-queries.ts`).
- Variables/functions: camelCase (`getIndexStats`, `ensureDir`).
- Classes/Types/Interfaces: PascalCase (`AzureCosmosService`, `NormalizedCodeRow`).
- Constants/env vars: UPPER_SNAKE_CASE (`INGEST_PREFIX`, `COSMOS_ENDPOINT`).

### Git Workflow

- Branches: `feat/<scope>`, `fix/<scope>`, `chore/<scope>`, `docs/<scope>`, `test/<scope>`.
- Commits: Conventional Commits (`feat(ingest): add april overlay diagnostics`).
- PRs: small and focused; include “what/why”, testing notes, and screenshots/logs when relevant.

## Environment Setup

### Development Requirements

- Node.js: 20.x (or >=18 with ESM support)
- Package manager: pnpm (workspace‑aware)
- Optional: Azure CLI / Storage Explorer for cloud workflows

### Installation Steps

```bash
# 1. Clone
git clone https://github.com/shmindmaster/Billigent.git
cd Billigent

# 2. Install (workspace)
pnpm install

# 3. Backend: dev or build
dir apps/backend
pnpm -F @billigent/backend build    # compile
pnpm -F @billigent/backend dev      # if a dev script is defined

# 4. Frontend: dev
pnpm -F @billigent/frontend dev

# 5. Tests (Playwright)
pnpm dlx playwright install
pnpm -w test:e2e    # if scripted; otherwise use project tests folder
```

## Core Feature Implementation

### Feature Module 1 — ICD‑10‑CM Ingestion (FY2025)

Key scripts in `apps/backend/scripts`:

- `icd10cm-download.ts` — downloads official sources into `data-sources/icd10cm/<year>/raw` and writes a manifest.
- `icd10cm-parse.ts` — extracts XML/tabular text, normalizes to CSV/JSON, computes diffs (base vs April addendum), and emits diagnostics.
- `icd10cm-upload.ts` — optionally uploads `raw` (Bronze) and `normalized` (Silver) to cloud storage; can clean local `raw/work` on success.

Highlights:

- Layered model: staging → Bronze (raw) → Silver (normalized). Gold deferred.
- Diffing detects title/context changes; diagnostics written to `normalized`.
- NodeNext imports: ensure `.js` extensions on compiled ESM imports.

Example workflow (conceptual):

```ts
// Pseudocode outline (execution handled by pnpm scripts)
await downloadIcd10Sources(2025);
const { rows, changeLog } = await parseAndNormalize({
  baseYear: 2025,
  includeApril: true,
});
await maybeUploadToDataLake({ bronze: true, silver: true });
```

### Feature Module 2 — API Services (Express)

- Health/Ready routes wire to Azure Cognitive Search stats (fallback safe).
- FHIR resource service runs in‑memory for local dev (`listByType`, `listByPatient`, `upsert`).
- CDI workflow endpoints currently stubbed but typed; return structured mock data for UI integration.

## Testing Strategy

### Unit Testing

- Framework: Vitest or Jest (project tolerant). Keep fast, pure unit tests near code.
- Coverage goal (suggested): ≥ 80% on core modules (ingestion utils, service adapters).

### Integration Testing

- API route tests for health/ready, strategy endpoints, and workflow stubs.
- Validate ingestion outputs (shape/row counts/hashes) in a lightweight check.

### End-to-End Testing (Playwright)

- Locations: `tests/e2e`, `tests/accessibility`, `tests/visual`.
- Use role‑based locators and web‑first assertions; avoid arbitrary waits.
- Generate HTML reports into `test-results/` (already git‑ignored by default patterns).

## Deployment Guide

### Build Process

```bash
# Root build (if configured)
pnpm -w build
# Backend build
pnpm -F @billigent/backend build
# Frontend build
pnpm -F @billigent/frontend build
```

### Deployment Steps (typical)

1. Prepare Azure resources (App Service/Container, Cosmos DB, Cognitive Search, Storage).
2. Configure environment variables/secrets (see below).
3. Build and publish artifacts (CI/CD recommended via GitHub Actions).
4. Smoke test health/ready endpoints and basic UI flows.

### Environment Variables (examples)

```env
# Backend
PORT=3001
SENTRY_DSN=
COSMOS_ENDPOINT=
COSMOS_KEY=
SEARCH_ENDPOINT=
SEARCH_API_KEY=
OPENAI_ENDPOINT=
OPENAI_API_KEY=

# Ingestion
INGEST_PREFIX=bronze/terminologies/icd10cm
INGEST_PREFIX_CURATED=silver/terminologies/icd10cm
INGEST_UPLOAD=false
```

## Performance Optimization

### Frontend

- Code‑split route‑level chunks; lazy load non‑critical UI.
- Cache API responses; prefer pagination/infinite scroll for large sets.

### Backend

- Avoid blocking the Node event loop; stream large file IO.
- Use batch operations for cloud calls; apply simple in‑memory caching for hot metadata.
- Keep diagnostics behind flags to minimize hot‑path overhead.

## Security Considerations

### Data Security

- Validate and sanitize all inputs (avoid `innerHTML`; use context‑aware encoding on the client).
- Parameterize any future SQL/NoSQL queries; never construct queries from raw input.
- Keep secrets in env/secret stores; never commit credentials.

### Authentication & Authorization

- Add RBAC for sensitive routes when promoting beyond local dev.
- Set secure cookie flags and CORS rules as needed in production.

## Monitoring and Logging

### Application Monitoring

- Integrate Sentry for error tracking (backend/frontend); set `environment`.
- Track API latency and ingestion throughput in logs or Metrics (App Insights/Datadog optional).

### Log Management

- Use structured logs (`level`, `msg`, `context`). Avoid noisy logs in hot paths.
- Redact PII/PHI per HIPAA guidelines before emission.

## Common Issues

### NodeNext import errors (TS/ESM)

**Solution**: Ensure emitted ESM imports include `.js` extension; align tsconfig `module`/`moduleResolution` with runtime.

### Cosmos/Search Unavailable in local dev

**Solution**: The services provide safe fallbacks (in‑memory/no‑op). Guard production paths with env checks.

### Large dataset artifacts accidentally staged

**Solution**: `.gitignore` includes `data-sources/**/{raw,work,normalized}` exclusions; commit only code. Use `.gitkeep` if you need empty dirs.

### Playwright browsers missing

**Solution**: Run `pnpm dlx playwright install` and re‑run tests. Check `tests/playwright.config.ts` if customized.

## Reference Resources

- Azure Cosmos DB: https://learn.microsoft.com/azure/cosmos-db/
- Azure Cognitive Search: https://learn.microsoft.com/azure/search/
- Playwright: https://playwright.dev/
- pnpm Workspaces: https://pnpm.io/workspaces
- Express.js: https://expressjs.com/
- ICD‑10‑CM (NCHS): https://icd10cmtool.cdc.gov/

## Changelog

### v0.1.0 (2025-08-15)

- Initial AGENTS.md for Billigent monorepo
- Documented ingestion pipeline, backend services, testing and deployment
- Added common pitfalls and environment guidance
