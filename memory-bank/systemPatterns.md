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

## Design Decisions
- **Vite for Fast Builds**: Efficient development and production builds.
- **Tailwind for Styling**: Utility-first CSS for responsive design.
- **Framer Motion for Interactivity**: Enhancing UX with animations.
- **Vercel Deployment**: Easy scaling and serverless functionality.
