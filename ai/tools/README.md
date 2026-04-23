# AI Tooling Bootstrap (Portfolio Marketing Stack)

This folder defines the reusable AI tooling layer for copy, marketing, SEO, and growth work in this repo.

## Goal

Bring the useful operating parts of the more mature BuildApp system into this portfolio repo without copying its extra multi-scope complexity.

## Recommended Repositories

1. `coreyhaines31/marketingskills`
   Primary base for copywriting, landing pages, CRO, Meta Ads, ASO, email sequences, pricing, and launch work.
2. `ericosiu/ai-marketing-skills`
   Complement for growth experimentation, content ops, SEO ops, message iteration, distribution, and measurement loops.
3. `kostja94/marketing-skills`
   Complement for SEO/discoverability, page structure, title/meta/schema work, organic visibility, and page planning.
4. `upstash/context7`
   Optional documentation/context baseline.

## Install

Run from repository root:

```bash
./ai/tools/install-recommended.sh
```

The script clones or updates the repositories into `ai/tools/vendor/`.

## Operating Rules

- This bootstrap layer is for local reference and selective reuse, not blind framework import.
- Start marketing tasks from `.agents/product-marketing-context.md`.
- Edit the real portfolio source in `src/`, `public/`, `docs/`, or repo config files, not `dist*`.
- Many upstream repos include scripts that require their own API keys or external accounts. Do not run them unless the task explicitly needs that path.
- Keep this folder lightweight. Add tools only when they materially improve work in this repo.
