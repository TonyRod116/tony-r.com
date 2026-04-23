# System Patterns

## Architecture
- **Frontend**: Single-Page Application (SPA) using React 18, Vite, and Tailwind CSS.
- **Backend (Production)**: Vercel Serverless Functions (`api/*.js`) for OpenAI proxying and data retrieval.
- **Backend (Local)**: Express.js server (`server/index.js`) for persistent data storage (`leads.json`).
- **Middleware**: Custom logic for routing demo URLs to `index.html`.

## Key Patterns
- **AI Algorithm Extraction**: Core AI logic (Minimax, BFS, Deduction) is isolated for reuse.
- **Service Proxying**: Backend acts as a secure proxy for the OpenAI API.
- **Component-Driven UI**: Modular React components for games and demo interfaces.
- **Multi-language Implementation**: Data-driven translation system in `src/data/`.
- **AI Instruction Sync**: `AI_SHARED_INSTRUCTIONS.md` is the root source of truth; `scripts/sync-ai-instructions.sh` mirrors it to the other AI files and `scripts/check-ai-instructions.sh` validates alignment, including legacy `cursor.md`.
- **Cross-IA Skill Docs**: Repo-local workflows in `docs/ai-skills/` define shared onboarding and browser QA behavior for Codex, Claude, Gemini, and similar agents.
- **Repo Memory Layer**: `/.memory/*` complements `PROJECT_STATE.md` and `memory-bank/` with short startup handoff, glossary, architecture notes, and durable decisions stored inside the repo.
- **Marketing Context Layer**: `.agents/product-marketing-context.md` centralizes positioning, ICP, messaging, and proof constraints so copy/SEO tasks can reuse shared context.
- **Marketing Tool Bootstrap**: `ai/tools/install-recommended.sh` provides a repeatable way to pull the curated external marketing skill repositories into `ai/tools/vendor/` for local reference.

## Design Decisions
- **Vite for Fast Builds**: Efficient development and production builds.
- **Tailwind for Styling**: Utility-first CSS for responsive design.
- **Framer Motion for Interactivity**: Enhancing UX with animations.
- **Vercel Deployment**: Easy scaling and serverless functionality.
