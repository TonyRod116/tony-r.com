# Decisions

- Date: 2026-04-22
- Context: This portfolio repo already had `memory-bank/` and `PROJECT_STATE.md`, but it lacked a short, repo-local operating memory layer like the one used in BuildApp.
- Decision: Add `/.memory/*` for architecture notes, durable decisions, glossary, and short startup handoff.
- Impact: Future AI sessions can bootstrap faster without depending only on broad memory-bank notes or scattered chat context.
- Owner: repo-ops

- Date: 2026-04-22
- Context: Marketing and copy work in this repo was too ad-hoc compared with the more mature BuildApp workflow and the available open-source skill ecosystems.
- Decision: Standardize a repo-local marketing stack:
  - Corey Haines `marketingskills` as the primary base for copy/CRO/pricing/launch
  - Eric Siu `ai-marketing-skills` as the experimentation and iteration complement
  - Kostja `marketing-skills` as the SEO/discoverability complement
- Impact: Future homepage, projects, SEO, ads, email, and launch tasks can start from a shared process and project context instead of generic prompting.
- Owner: marketing-ops
