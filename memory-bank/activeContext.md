# Reference continuity summary

Last updated: 2026-09-30

Current operating truth is in .memory/, PROJECT_STATE.md, docs/ai/ and source code. Use ai:context to retrieve task-specific current sources. The paragraphs below are historical context; they do not certify present deployment/API availability.

# Active Context

## Current Status
- The project is fully functional and deployed to Vercel/Hostinger.
- AI games (Tic-Tac-Toe, Minesweeper, Six Degrees) are integrated into the React frontend.
- Backend demos (Lead Qualifier, Presupuestos Reformas) are set up with OpenAI integration.

## Recent Changes
- Updated Vercel configuration for API routes (`api/`).
- Middleware added for routing `/demos` to `index.html`.
- Implemented `memory-bank` for persistent session context.
- Configured MCPs (Playwright, Context7, Memory Bank).

## Next Steps
- Verify the newly installed Playwright MCP for screenshot capabilities.
- Test the Context7 MCP for documentation retrieval.
- Ensure the local Memory Bank is updated after each session.
- Consider adding more AI games or refining the renovation demo.
