# Architecture

## Purpose
Shared architecture and operating map for this portfolio repo.

## System Overview

- `src/` is the main React/Vite application and the UI source of truth.
- `api/` contains Vercel serverless functions used in production and preview deployments.
- `server/` contains the local Express server used for local persistence and dev-only API parity.
- `public/` holds static assets and demo data.
- `dist/` and `dist*` folders are generated output and must not be treated as editable source.

## Continuity Layers

- `/.memory/*` stores durable repo-operating context inside the repo:
  - `architecture.md`
  - `decisions.md`
  - `glossary.md`
  - `todo.md`
- `PROJECT_STATE.md` stores recent project status snapshots.
- `memory-bank/` stores broader durable context across sessions.

Operational rule:
- trust current code first
- then use `/.memory/*` for startup context
- then use `PROJECT_STATE.md` and relevant `memory-bank/*`

## Marketing System

- `.agents/product-marketing-context.md` is the source of truth for positioning, ICP, messaging, proof points, and copy constraints.
- `docs/ai-skills/marketing-ops.md` defines the repo-local workflow for copy, CRO, SEO, launch, pricing, emails, and growth tasks.
- `ai/tools/install-recommended.sh` clones curated external marketing/SEO skill repos into `ai/tools/vendor/` for local reference.

Primary external stack:

1. `coreyhaines31/marketingskills`
   Primary base for copy, CRO, Meta Ads, ASO, emails, pricing, and launch.
2. `ericosiu/ai-marketing-skills`
   Complement for experimentation, content ops, SEO ops, and distribution.
3. `kostja94/marketing-skills`
   Complement for SEO structure, page planning, and discoverability.

## Local Runbook

Frontend:

```bash
npm run dev
```

Local API:

```bash
cd server
npm install
npm run dev
```

Production-style build:

```bash
npm run build
```

AI instruction sync/check:

```bash
./scripts/sync-ai-instructions.sh
./scripts/check-ai-instructions.sh
```
