# Decision Log

## 2026-03-02: Installed MCP Servers
- **Decision**: Install Playwright, Context7, and Memory Bank MCPs.
- **Rationale**: To enhance agent capabilities (screenshots, docs, context) and provide a persistent memory bank for session continuity.
- **Impact**: Improved efficiency in development and documentation tasks.

## 2026-04-22: Adopted Repo-Local `.memory` Layer and Marketing Ops Stack
- **Decision**: Add a repo-local `/.memory/*` layer plus a repo-specific marketing workflow built around `coreyhaines31/marketingskills`, `ericosiu/ai-marketing-skills`, and `kostja94/marketing-skills`.
- **Rationale**: The BuildApp repo has a more mature operating system for cross-agent continuity and marketing work. Porting the reusable parts here reduces context loss and gives future copy/SEO/growth tasks a concrete baseline.
- **Impact**: New sessions can bootstrap faster, marketing work has a local context source of truth, and external skill libraries can be pulled into the repo in a controlled way.

## 2026-03-02: Created Local Memory Bank
- **Decision**: Create a `memory-bank/` directory with structured Markdown files.
- **Rationale**: To maintain project context across different AI sessions (Roo Code/Cline pattern).
- **Impact**: Better knowledge management and faster onboarding for AI agents.

## 2024 (Initial Design): React + Vite
- **Decision**: Use React 18 with Vite as the build tool.
- **Rationale**: Fast development cycle, excellent ecosystem, and easy integration with Tailwind CSS.
- **Impact**: Smooth developer experience and performant production builds.

## 2024: Vercel for Deployment
- **Decision**: Deploy frontend and API to Vercel.
- **Rationale**: Serverless functions, zero-config deployment, and seamless Git integration.
- **Impact**: Reduced infrastructure overhead and reliable hosting.
