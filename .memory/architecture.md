# Architecture

Last updated: 2026-10-01

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

## Current agent/quality system

Canonical local skills: .agents/skills; Claude mirrors: .claude/skills. Memory registry: .agents/memory/map.json; read-only context and health: scripts/ai-memory.mjs. Outcomes are append-only proposal_only with backing hashes. Model selection delegates to ~/litellm via scripts/ai-route.mjs; no local model classifier.

Design: .agents/design-context.md and legacy-aware token gate. Lint gate preserves preexisting debt but rejects increases. Browser QA uses built .artifacts/build, mocks and external-network denial. CI validates without deploy. Routes load on demand; telemetry filters allowed fields and stores a bounded local diagnostic buffer. Remote error monitoring requires separate configuration.

Lead Qualifier currently uses BuildApp /api/v1/demo/chat, also in development. The repo-owned /api/chat is a separate compatibility function. See docs/ai/api-contracts.md for actual consumers and production/local ownership.

## Home showroom

Home source is src/pages/Home.jsx with scoped styles/tokens in src/pages/Home.css. Its content lives only in the home branches of src/data/translations.js (ES/EN/CA). It has a warm paper/charcoal design, real portrait/product imagery and no decorative scroll behavior. Header/Footer have homepage-only compact variants; other route layouts remain unchanged. LanguageSelector uses a native disclosure, and LanguageProvider keeps the document lang aligned with the selected locale.

## AI laboratory — 2026-09-30

The /ai hub and six experiment routes use scoped tokens in src/components/ai/AiLab.css and the shared AiExperimentLayout. ES/EN/CA catalog/copy lives in src/data/aiExperiments.js. Neural inference is integrated React, backed by validated local Apache-2.0 MNIST weights in public/models/mnist; the old HTML route redirects. Vector projection is local and hardware-independent. Pure T-Tris rules/search are in tetrisEngine.js; UI keeps Magic T, ghost, music and local records. Six Degrees uses a small source-linked curated graph in src/data/actorGraph.js; larger old assets are not active. No API/server contract changes.

## Portfolio showroom completion — 2026-09-30

All eight remaining routes use SitePage/DemoPage and Site.css; UI copy and descriptive gallery captions are in siteContent.js. Global header keeps four primary links; footer carries Solutions/CV/AI. Native Modal owns PDF/photo/config dialogs. documents.js references the original CV/certificates; public/gallery stores original image copies and a source/hash manifest. Unknown old gallery locations are not rendered. ScrollToTop supports asynchronous project anchors. Three solution transports remain BuildApp-owned, with UI normalization in demoResponse.js; no api/server changes. Verification: docs/ai/site-showroom-20260930.md and JSON.

## Confirmed hosting — 2026-09-30

tony-r.com currently serves static Vite output on IONOS. Apache rewrite sends non-file paths to index.html; api/ serverless functions are available through the separate Vercel hosting, not executable on IONOS. The three redesigned demos currently call the documented BuildApp host directly; contact uses Formspree. GitHub main remains connected to the historical Vercel project. Publication evidence/recovery: docs/ai/publication-20260930.md. Never infer domain hosting from vercel.json alone.

## T-Tris transition and neural instrument — 2026-10-01

Magic T contact enters a settling phase: each visible frame moves blocks one row down in their column; manual/AI actions are blocked until the precomputed common final board is committed. Gravity and sand timers are mutually exclusive and pause/reset-safe. Rotations use central pivots and rendering/search retain coordinate pairs. Neural instrument keeps the actual pretrained MLP and the approved camera; examples are hand-drawn inputs, never substituted labels. Current capture/model/game proof: docs/ai/polish-20261001.md/json.
