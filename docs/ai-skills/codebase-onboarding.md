# Codebase Onboarding

Last updated: 2026-09-30

Use `.agents/skills/my-page-agent/SKILL.md`, `npm run ai:brief` and `npm run ai:context -- --query "objective"` for bounded orientation. The status/authority registry is `.agents/memory/map.json`; only current sources are retrieved automatically. Open primary files for consequential claims. Full operation: `docs/ai/operating-system.md`.

Repo-specific onboarding workflow shared across Codex, Claude, Gemini, Cursor, and similar agents.

## When to Use

- First session in this repository
- Broad questions like "explain this codebase"
- Before changing architecture or AI instructions
- When handing off context to another agent or future session

## Fast Recon Workflow

Read in this order:

1. `README.md`
2. `AI_SHARED_INSTRUCTIONS.md`
3. `PROJECT_STATE.md`
4. relevant files in `/.memory/`
5. relevant files in `memory-bank/`
6. `package.json`
7. affected source files only

Then gather a shallow structure snapshot:

- top-level directories
- route entry points
- API entry points
- scripts and verification commands

Do not read the whole repo file-by-file.

## Repository Map

- `src/` → main React/Vite application
- `src/pages/` → route-level UI pages
- `src/components/` → reusable UI and AI game components
- `src/data/` → profile, project, translation, and gallery content
- `api/` → Vercel serverless endpoints for production behavior
- `server/` → local Express API and local persistence flows
- `public/` → static public assets and demo data
- `docs/` → project docs and integration notes
- `/.memory/` → durable repo operating memory and startup handoff
- `memory-bank/` → durable repo context for future AI sessions
- `.agents/` → repo-local marketing/product context for external skill stacks
- `ai/tools/` → optional vendor/bootstrap tooling for repo-specific AI workflows
- `scripts/` → repo utilities such as AI-file sync/check scripts

## Critical Truths

- `src/` is the UI source of truth
- `api/` is production/serverless behavior
- `server/` is local development and local persistence behavior
- `/.memory/*`, `memory-bank/`, and `PROJECT_STATE.md` are the continuity layer between sessions
- `dist/` and `dist*` copy folders are build artifacts, not primary source
- `*.Zone.Identifier` files are noise, not meaningful source files
- `.agents/product-marketing-context.md` is the local marketing context source of truth for copy/SEO/growth tasks

## Key User-Facing Routes

- `/`
- `/about`
- `/projects`
- `/contact`
- `/resume`
- `/ai`
- `/demos`

Key demo and game routes:

- `/demos/presupuesto-orientativo`
- `/demos/render-presupuesto`
- `/demos/lead-qualifier`
- `/ai/tictactoe`
- `/ai/minesweeper`
- `/ai/sixdegrees`
- `/ai/nim`
- `/ai/tetris`

## Important Integration Notes

- `Lead Qualifier` selects the BuildApp `/api/v1/demo/chat` route in development and production; `/api/chat` remains a distinct compatibility function
- `Presupuestos Reformas` uses `/api/generate-quote`
- local lead persistence lives in `server/data/leads.json`
- production/serverless persistence is not equivalent to the local Express server unless explicitly implemented
- `/demos` has middleware rewrite behavior in `middleware.js`

## Working Rules for New Sessions

1. Confirm which area is being changed: `src/`, `api/`, `server/`, docs, or AI instructions
2. Ignore generated artifacts unless the user explicitly asks for them
3. Use `bd` when work is issue-driven, with sandbox fallback if needed
4. Update `PROJECT_STATE.md` and `memory-bank/` for architecture or workflow changes
5. Update `/.memory/*` when the change should persist as startup context
6. If instructions change, update `AI_SHARED_INSTRUCTIONS.md` and run sync/check scripts

## Good Output for Onboarding

A good onboarding summary for this repo should explain:

- what the app is
- where UI lives
- where production API lives
- where local API lives
- what not to edit
- how to verify changes
- which routes and demos are most important

## Anti-Patterns

- Reading `dist/` before `src/`
- Treating local `server/` behavior as guaranteed production behavior
- Ignoring `memory-bank/` and `PROJECT_STATE.md` on architecture-sensitive tasks
- Expanding scope into unrelated demos or games without need
