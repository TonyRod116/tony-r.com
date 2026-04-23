# Project State - April 23, 2026

## Current Status
- **Homepage Positioning**: Reworked the core site copy to position Tony as **CEO & Founder of BuildApp**, not just a generic solutions engineer, with stronger emphasis on founder-led execution, AI product delivery, and hands-on ownership of AWS S3-backed storage/media workflows.
- **Fix**: Resolved syntax error in `Tetris.jsx` (missing closing brace in AI logic) that was breaking the production build.
- **MCP Servers**: Playwright, Context7, and Memory Bank (MCP) are installed and connected.
- **Memory Bank**: A local `memory-bank/` directory has been created and populated with structured project documentation.
- **Repo Memory Layer**: Added repo-local `/.memory/` files for architecture, decisions, glossary, and short startup handoff, adapting the more mature BuildApp system to this portfolio repo.
- **Screenshot Convention**: BuildApp-related "capturas" requested by the user should be looked up first in `C:\Users\toni_\OneDrive\Imágenes\Capturas de pantalla` (WSL: `/mnt/c/Users/toni_/OneDrive/Imágenes/Capturas de pantalla`) before assuming they exist in-repo.
- **AI Consistency**: Root AI files now use a repo-specific source of truth aligned with the real structure: `src/`, `api/`, `server/`, `memory-bank/`, and generated `dist*` artifacts.
- **AI Validation**: Added `scripts/check-ai-instructions.sh` to verify `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, `CODEX.md`, `CURSOR.md`, and legacy `cursor.md` remain synchronized with `AI_SHARED_INSTRUCTIONS.md`.
- **Cursor Compatibility**: `.cursor/rules/project-instructions.mdc` now points back to `AI_SHARED_INSTRUCTIONS.md` instead of treating `cursor.md` as an independent rule set.
- **Cross-IA Skills**: Added repo-local shared skill docs at `docs/ai-skills/browser-qa.md` and `docs/ai-skills/codebase-onboarding.md` so Codex, Claude, Gemini, and compatible agents can follow the same onboarding and visual QA workflow.
- **Marketing Ops Stack**: Added repo-local marketing workflow support based on `coreyhaines31/marketingskills` (primary), `ericosiu/ai-marketing-skills` (growth/experimentation), and `kostja94/marketing-skills` (SEO/discoverability), plus local bootstrap files in `ai/tools/` and a tailored `.agents/product-marketing-context.md`.
- **Repomix**: Installed and configured for clean repository bundling.
- **Lead Qualifier**: Fixed bug where the welcome message was always in Spanish.
- **Tetris AI**:
  - Fixed piece wrap-around bug during movement/rotation and AI simulation.
  - Improved AI heuristics (better weights for holes, bumpiness, and line clearing).
  - Implemented an **animated dissolution ("sand") effect** for the Magic T piece.
  - **AI Enabled for Special T**: The AI button now works with the special "T" piece, including the dissolution animation.

## Pending Work
- [ ] Verify Playwright screenshot capabilities in a real scenario.
- [ ] Test the Tetris AI at very high levels to ensure stability.
- [ ] Consider migrating Vercel leads to a persistent database (KV or Postgres).
- [ ] Decide whether to keep or delete legacy `cursor.md` once all tooling reads from the shared root instructions.

## Next Actions
1. Monitor AI performance in Tetris to see if further heuristic tuning is needed.
2. Explore adding more AI-powered games to the portfolio.
3. Use the new marketing stack to tighten homepage/project copy, SEO structure, and portfolio discoverability in source files rather than ad-hoc prompts.
4. If AI tooling changes again, update `AI_SHARED_INSTRUCTIONS.md`, re-run sync/check scripts, and keep `cursor.md` in lockstep until it is retired.
