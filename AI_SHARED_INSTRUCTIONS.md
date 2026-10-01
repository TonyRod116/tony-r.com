# Shared AI Agent Instructions (Tony's Personal Site)

> Source of truth: `AI_SHARED_INSTRUCTIONS.md`
> Root AI files must stay identical: `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, `CODEX.md`, `CURSOR.md`
> Legacy compatibility file: `cursor.md` must mirror the same instructions while it still exists
> Sync command: `./scripts/sync-ai-instructions.sh`
> Validation command: `./scripts/check-ai-instructions.sh`

This file defines how AI agents should operate in this repository.

## Repo-Native Agent System (2026-09-30)

- Start non-trivial work with `.agents/skills/my-page-agent/SKILL.md`; select only the relevant local skills from `.agents/skills/catalog.json`.
- Recover selective current context with `npm run ai:context -- --query "actual objective and constraints"`; open primary sources for material claims. `npm run ai:brief` supports startup/resume; Claude SessionStart invokes a bounded local brief.
- The document registry is `.agents/memory/map.json`: current/historical/snapshot, authority and freshness. `npm run ai:health` reports missing/invalid/stale memory and changed outcome evidence. Context and heuristics never grant permission.
- Model routing delegates to the single global `~/litellm/ai_route.py` through `npm run ai:route -- --query "objective"`. It plans only; no new classifier, automatic external call, universal client dispatcher or model switch inside an open chat. If absent, state the limitation and continue locally when appropriate.
- Source skills live only in `.agents/skills`; `.claude/skills` mirrors them. After skill edits use `npm run ai:sync` and `npm run check:skills`; do not edit mirrors or import installers/hooks/credentials from other repos. Provenance/license: `.agents/adoption-manifest.json`.
- Use `my-page-plan`, `my-page-implement`, `my-page-frontend`, `my-page-api`, `my-page-marketing`, `my-page-review`, `my-page-release` and `my-page-explain` for their actual scopes; memory/evaluation/audit/loop/observability/engineering overlays apply only when useful. Tactical marketing skills are discoverable locally.
- Design work starts from `.agents/design-context.md`. Quality checks tolerate documented preexisting lint/design debt and reject increases; never renew baselines to hide failures. `npm run check`, `npm run build -- --outDir .artifacts/build`, `npm run test:e2e`, `npm run test:visual` and `npm run perf:report` are the local proof path.
- Browser QA mocks AI/BuildApp/Formspree and blocks external traffic. Mock PASS proves UI behavior only. Production availability, persisted data, remote telemetry and business impact require their own evidence.
- External review uses the currently authorized global provider skill/runner only when requested. Autonomy preserves the session scope; `npm run ai:loop -- state.json` advises stopping on completion/budget/no-progress/owner gate, but schedules or executes nothing itself.
- Record outcomes only after observed local evidence: `ai:outcome` previews; `--record` explicitly appends hashes to `.agents/memory/outcomes.jsonl` as `proposal_only`. It never rewrites canonical memory or creates publication authority.
- Preserve existing user changes. CI in `.github/workflows/quality.yml` validates; it does not deploy. No push/PR/publication, live trading, payment, messaging or external account setup follows from skill installation alone.
- Detailed operation, contracts, adoption and limits: `docs/ai/operating-system.md`, `docs/ai/api-contracts.md`, `docs/ai/adoption.md`.

## Terminology

- **AI files / archivos de IA**: `AI_SHARED_INSTRUCTIONS.md`, `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, `CODEX.md`, `CURSOR.md`, `cursor.md`

## Shared Repo Skills (Cross-IA)

This repository keeps cross-IA skill workflows in:

- `docs/ai-skills/browser-qa.md`
- `docs/ai-skills/codebase-onboarding.md`
- `docs/ai-skills/marketing-ops.md`

Rules:

- These skill docs are shared operating instructions for Codex, Claude, Gemini, Cursor, and compatible agents working in this repo.
- If Codex also has a globally installed skill with the same name, prefer the repo-local document when project-specific rules differ.
- Keep these skill docs concise and repo-specific. Do not duplicate generic upstream content unless it is adapted to this project.

Trigger rules:

- Use `codebase-onboarding` when entering the repo for the first time, when a task is broad/architectural, or when the user asks for a codebase walkthrough, onboarding, or updated AI instructions.
- Use `browser-qa` after UI, layout, navigation, route, translation, or demo-flow changes, and before closing visual tasks when practical.
- Use `marketing-ops` when the task touches homepage/landing copy, portfolio positioning, SEO/discoverability, Meta Ads, ASO, emails, pricing, launch planning, or marketing experimentation.

## Marketing Skill Stack (Mandatory)

This repo adopts a reusable marketing/copy system inspired by the more mature BuildApp workflow, but adapted to this portfolio's simpler architecture.

Primary external bases:

1. `coreyhaines31/marketingskills`
   Primary base for copywriting, landing pages, CRO, Meta Ads, ASO, email sequences, pricing, and launch work.
2. `ericosiu/ai-marketing-skills`
   Complement for growth experimentation, content ops, SEO iteration, distribution, and measurement-oriented workflows.
3. `kostja94/marketing-skills`
   Complement for SEO/discoverability, page structure, metadata, organic visibility, and route/page planning.

Local operating rules:

- Start marketing work from `.agents/product-marketing-context.md` so external skills do not operate on vague assumptions.
- Prefer the minimum relevant subset of upstream skills instead of importing whole frameworks into every task.
- For real site changes, edit the actual source in `src/`, `public/`, `docs/`, or repo config files, not generated `dist*` output.
- Do not run upstream automation scripts that require third-party API keys or external accounts unless the task explicitly needs that execution path.
- When several upstream skill libraries overlap, default to:
  - Corey for copy/CRO/pricing/launch
  - Eric for experiments/content ops/iteration
  - Kostja for SEO structure/discoverability/templates

## Repository Scope Model (Mandatory)

This repository is not split into `frontend/` and `backend/` apps. The operational areas are:

1. `src/`
   Main React/Vite application and UI source of truth.
2. `api/`
   Vercel serverless endpoints used in production and preview deployments.
3. `server/`
   Local Express server used for development flows and local persistence.
4. `/.memory/`, `memory-bank/`, and `PROJECT_STATE.md`
   Persistent project memory and handoff context.
5. `.agents/` and `ai/tools/`
   Local marketing context and reusable AI tooling/bootstrap helpers.
6. `public/`
   Static assets and public demo data.

Rules:

- Keep changes scoped to the area required by the task.
- Do not move logic between `api/` and `server/` unless the task explicitly requires it.
- If a frontend change depends on an API contract, verify whether the source of truth is `api/`, `server/`, or both.

## Current Architecture Truths (Mandatory)

- Non-AI pages share the warm-paper layouts/tokens in `src/components/site/` and ES/EN/CA copy in `src/data/siteContent.js`. `DemoPage` owns the shared shell of the three active `/demos/*` flows; keep their BuildApp transports and ownership distinct from layout.
- Header uses Projects, AI Lab, About and Contact on every route; Solutions and CV remain secondary footer links. Preserve the approved home and AI visual identities when changing shared surfaces.
- CV PDFs/certificates remain source assets in `src/assets/`; `src/data/documents.js` owns their references. `public/gallery/` caches all 24 existing Total Homes images without pixel changes, records source URLs/hashes in its manifest and uses inspected descriptive captions. Do not infer locations, dates or real construction from a visualization.
- AI routes share `src/components/ai/AiExperimentLayout.jsx` and scoped `AiLab.css`; experiment metadata/copy is in `src/data/aiExperiments.js` (ES/EN/CA).
- `/ai/neural-network` is an integrated React demo using validated local MNIST weights in `public/models/mnist/`; `/neural-network.html` preserves old links by redirecting to it. The base model performs local inference. The backward view computes real loss gradients using the selected digit and an isolated calculation copy; it never mutates the published artifact or silently trains the base predictor. No training-step CTA or random-weight prediction fallback.
- Neural output nodes 0–9 form one vertical column in the fourth 3D layer, at 75% of the earlier size and moving with the same camera as the other layers. The ten buttons beside the drawing are the sole example/label selector; clearing the drawing retains that selected label. Layer/all-stage and forward/backward selection are controlled independently of animation on/off and pause. Forward input shows original pixels; backward input defaults to true gradient cells and grouped return bundles representing all first-hidden-layer contributions per pixel. Colour/value of each bundle must equal its cell’s full gradient. Arrival highlights replay already computed values, without changing the drawing. The inspector can explicitly show the original input as a reference. Changing stages preserves settings; camera reset only resets the camera. Preserve the approved input orientation.
- T-Tris uses the shared pure rules in `src/components/games/tetrisEngine.js` for manual play, Magic T, previews and reachable AI placements; keyboard shortcuts work in the active game context while leaving links and editable controls alone. Magic T settlement and completed-line flashes are explicit reducer phases; scoring and the next piece wait for completion, including pause/reset guards.
- The main app lives in `src/` and is built with Vite.
- The main domain `tony-r.com` is served as static Vite output by IONOS (confirmed 2026-09-30). The historical GitHub/Vercel deployment remains separate; do not infer domain hosting from `vercel.json`.
- Production API behavior on Vercel is defined by `api/` serverless functions; IONOS static hosting does not execute them.
- Local persistence and local development API behavior live in `server/`.
- `Lead Qualifier` currently calls `{VITE_BUILDAPP_DEMO_API_URL or BuildApp base}/api/v1/demo/chat`, including development; `/api/chat` exists as a separate compatibility endpoint, not its selected route.
- `Presupuestos Reformas` depends on `/api/generate-quote`.
- Local lead persistence exists in `server/data/leads.json`.
- Vercel production/serverless flows do not provide durable persistence equivalent to the local Express server unless explicitly implemented.
- `/.memory/*`, `memory-bank/`, and `PROJECT_STATE.md` are the repo memory sources for future AI sessions.
- `.agents/product-marketing-context.md` is the local source of truth for positioning, audiences, proof points, and marketing constraints.

## Memory Hierarchy (Mandatory)

Use repo memory in this order:

1. Current code and repo state
2. `/.memory/*` for durable operating context, glossary, and startup handoff
3. `PROJECT_STATE.md` for recent project-level status changes
4. Relevant `memory-bank/*` entries for broader continuity
5. `bd` only when the task is explicitly issue-driven

Rules:

- If memory conflicts with the current code, trust the code and update the durable memory layer.
- Keep `/.memory/todo.md` short; long backlogs belong in `bd` or task-specific docs, not startup handoff.
- Marketing context belongs in `.agents/product-marketing-context.md`, not scattered across random notes.

## Asset Location Conventions

- When the user refers to "capturas" or screenshots for BuildApp-related visual updates, first check `C:\Users\toni_\OneDrive\Imágenes\Capturas de pantalla` (WSL path: `/mnt/c/Users/toni_/OneDrive/Imágenes/Capturas de pantalla`).
- If a requested screenshot asset is not yet inside this repo, agents may copy it from that location into the appropriate source folder before wiring it into the UI.

## Core Working Rules

1. Before implementing non-trivial changes, describe the approach. Ask clarifying questions only if the requirement is materially ambiguous.
2. If a task needs changes across more than 3 manually edited files, split the work into smaller reviewable steps when practical.
3. For bug fixes, reproduce with a test or a concrete failing scenario when practical, then implement the fix.
4. After code changes, report regression risks and the checks performed.
5. Never add `Co-authored-by:` trailers in commits.

## Cross-Area Coordination (Mandatory)

- `src/` changes must not silently break `api/` or `server/` consumers.
- `api/` changes must mention frontend impact when request/response shape, validation, auth, or persistence behavior changes.
- `server/` changes must mention whether they affect only local development or also require matching `api/` changes.
- If a task changes an important repo workflow, architecture rule, or integration contract, update `AI_SHARED_INSTRUCTIONS.md` and synchronize the AI files in the same change set.

## Generated Artifacts and No-Touch Areas

Treat these as generated, copied, or non-source artifacts unless the user explicitly asks otherwise:

- `dist/`
- `dist - copia/`
- `dist - copia ene 26/`
- other `dist*` backup/copy folders
- `node_modules/`
- `server/node_modules/`
- `*.Zone.Identifier`

Rules:

- Do not edit generated build output instead of source files.
- Prefer fixing the source in `src/`, `api/`, `server/`, `public/`, or scripts.
- If generated artifacts are stale, regenerate them instead of hand-editing them.

## Issue Workflow (Beads)

Use `bd` for issue tracking when the task is issue-driven.

- Start: `bd ready`
- Claim: `bd update <id> --status in_progress`
- Inspect: `bd show <id>`
- Create follow-up: `bd create --title="..." --type=task|bug|feature --priority=2`
- Close: `bd close <id>`
- Sync: `bd sync`

Operational fallback:

- If `bd ready` reports the database is out of sync, run `bd sync --import-only`.
- If sandbox/daemon mode is unreliable, use `bd --sandbox ready`.
- Do not use markdown TODO lists as the source of truth for tracked work.

## Branch and Commit Hygiene

- Prefer one branch or worktree per issue when the task is substantial.
- Keep commits small and atomic.
- Use conventional commit format.
- Do not amend existing commits unless the user explicitly asks for it.

## Cross-Agent Continuity (Handoff / Memory)

At session start:

- Read `README.md`.
- Read `AI_SHARED_INSTRUCTIONS.md`.
- Read `PROJECT_STATE.md` if present.
- Read relevant files in `/.memory/` when the task touches architecture, workflow, copy strategy, or repo operating context.
- Read relevant files in `memory-bank/` when the task touches architecture, product behavior, or repo workflow.
- Read `.agents/product-marketing-context.md` when the task touches copy, SEO, landing pages, positioning, emails, launch, or growth.
- Check `bd ready` when working from tracked issues.

At session end:

- Update `PROJECT_STATE.md` when the task changes architecture, workflow, important integrations, or project status.
- Update `/.memory/` entries when the change should persist as startup context for future sessions.
- Update `memory-bank/` entries when the change should persist as future operating context.
- Track meaningful follow-up work in `bd`.

## Mandatory Cross-CLI Sync Rule

Any change to project instructions must keep all AI files aligned.

Process:

1. Edit `AI_SHARED_INSTRUCTIONS.md`.
2. Run `./scripts/sync-ai-instructions.sh`.
3. Run `./scripts/check-ai-instructions.sh`.
4. Commit `AI_SHARED_INSTRUCTIONS.md` and all synchronized AI files together.

## Verification

Use the checks that actually exist in this repository.

Frontend and shared UI changes:

1. Run `npm run build`.
2. Follow `docs/ai-skills/browser-qa.md` for route and viewport verification when the task changes UI or navigation.
3. For an existing modified `dist/`, use `npm run build -- --outDir .artifacts/build` to verify without overwriting that output. The build wrapper preserves the `/demos/index.html` compatibility artifact in either destination.
4. Run `npm run check`; browser interactions and visual baselines have separate commands. `test:visual -- --update-snapshots` needs inspection of the resulting images, not blind acceptance.

`api/` changes:

1. Validate the affected endpoint contract and expected environment assumptions.
2. Confirm whether the change applies only to Vercel/serverless behavior or also requires local `server/` parity.

`server/` changes:

1. Run or smoke-test the local Express server path affected by the change.
2. Confirm whether local persistence behavior changed.

Docs and AI-instruction changes:

1. Run `./scripts/check-ai-instructions.sh`.
2. Confirm the synchronized AI files match the source of truth.

## Prohibited Changes Without Explicit Request

- Do not modify secrets, credentials, deployment settings, or unrelated environment files.
- Do not refactor unrelated app sections while touching instructions or tooling.
- Do not rewrite production behavior in `api/` when the task is only about local `server/`, or vice versa.
- Do not delete backup or copied folders unless the user explicitly asks for cleanup.

## Recent Important Changes

- 2026-03-27: AI instruction policy tightened around the real repo structure: `src/`, `api/`, `server/`, `memory-bank/`, and generated `dist*` artifacts.
- 2026-03-27: Cross-CLI sync now explicitly includes legacy `cursor.md` while that file still exists, to avoid Cursor drift from the root source of truth.

- 2026-09-30 publication: IONOS hosting is verified and backup/live evidence is in `docs/ai/publication-20260930.md`. The legacy BuildApp host returns503; current budget/render endpoints require authentication and their portfolio generations remain unavailable. A frontend publication does not authorize changing BuildApp auth, quotas or credentials.
