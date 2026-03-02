# Project State - March 2, 2026

## Current Status
- **Fix**: Resolved syntax error in `Tetris.jsx` (missing closing brace in AI logic) that was breaking the production build.
- **MCP Servers**: Playwright, Context7, and Memory Bank (MCP) are installed and connected.
- **Memory Bank**: A local `memory-bank/` directory has been created and populated with structured project documentation.
- **AI Consistency**: All "archivos de IA" (`GEMINI.md`, `CLAUDE.md`, etc.) are synchronized with `AI_SHARED_INSTRUCTIONS.md` via a mandatory sync rule.
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

## Next Actions
1. Monitor AI performance in Tetris to see if further heuristic tuning is needed.
2. Explore adding more AI-powered games to the portfolio.
