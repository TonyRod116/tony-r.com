# Glossary

- Term: `/.memory/*`
  - Definition: Repo-local durable operating memory for architecture, decisions, glossary, and short startup handoff.
  - Notes: Use before broader `memory-bank/` context when bootstrapping a session.

- Term: product marketing context
  - Definition: The repo-local source of truth for positioning, audiences, proof points, messaging, and copy constraints.
  - Notes: Lives in `.agents/product-marketing-context.md`.

- Term: marketing ops stack
  - Definition: The combined repo workflow built from Corey Haines, Eric Siu, and Kostja marketing skill libraries.
  - Notes: Corey is the primary base; Eric and Kostja are complements for experiments and SEO structure.

- Term: AI Lab
  - Definition: The interactive section of the portfolio focused on AI games, algorithms, and demos.
  - Notes: Includes routes under `/ai` and related public demo assets.

- Term: Lead Qualifier
  - Definition: The AI demo that proxies chat behavior through `/api/chat`.
  - Notes: Production behavior is in `api/`; local behavior can be tested via `server/`.

- Term: Presupuestos Reformas
  - Definition: The renovation quote demo that depends on `/api/generate-quote`.
  - Notes: Local lead history is stored in `server/data/leads.json`.
