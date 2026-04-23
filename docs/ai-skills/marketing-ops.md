# Marketing Ops

Repo-specific marketing and copy workflow shared across Codex, Claude, Gemini, Cursor, and similar agents.

## When to Use

- Homepage or landing-page copy changes
- Portfolio positioning or messaging work
- Project page copy refreshes
- SEO/discoverability improvements
- Meta Ads or ASO planning
- Email sequence ideas
- Pricing or launch planning
- Growth experimentation and message iteration

## Source Stack

Use the external skill libraries in this order:

1. `coreyhaines31/marketingskills`
   Primary base for copy, CRO, landing pages, pricing, launch, Meta Ads, ASO, and emails.
2. `ericosiu/ai-marketing-skills`
   Complement for experimentation, content ops, distribution, message iteration, and growth loops.
3. `kostja94/marketing-skills`
   Complement for SEO structure, discoverability, metadata, and page planning.

## Required Context

Before doing marketing work, read:

1. `.agents/product-marketing-context.md`
2. `AI_SHARED_INSTRUCTIONS.md`
3. the relevant `src/` page/component/data files
4. relevant `/.memory/*` files when the task touches workflow, architecture, or long-term positioning

Do not start from generic assumptions if the repo already has product and portfolio context.

## Recommended Skill Mapping

- Homepage or landing copy:
  - Corey `copywriting`
  - Corey `page-cro`
  - Kostja `pages/brand/home` or `pages/marketing/landing-page`
- SEO/discoverability:
  - Corey `seo-audit`
  - Kostja `strategies/structure/seo`
  - Kostja technical/on-page skills for title, metadata, schema, robots, and sitemap
  - Eric `seo-ops` when iteration or operational SEO loops are needed
- Meta Ads:
  - Corey `paid-ads`
  - Corey `ad-creative`
  - Kostja `paid-ads/platforms/meta-ads`
- Emails:
  - Corey `email-sequence`
  - Corey `cold-email` when outreach is involved
- Pricing:
  - Corey `pricing-strategy`
  - Eric `sales-playbook` when the task needs packaging or value-pricing structure
- Launch and growth:
  - Corey `launch-strategy`
  - Eric `growth-engine`
  - Eric `conversion-ops`
- Content structure:
  - Corey `content-strategy`
  - Kostja content/SEO/page-generator skills

## Workflow

1. Identify the real objective: copy refresh, CRO, SEO structure, ad strategy, lifecycle email, launch, or experiment design.
2. Pull the minimum relevant skill set from the source stack.
3. Ground recommendations in `.agents/product-marketing-context.md` and current repo copy.
4. Make changes in real source files, not generated artifacts.
5. If the task changes routes, navigation, or visible UI, run build and browser QA when practical.
6. Report any assumptions that materially affect positioning, proof, or SEO claims.

## Rules for This Repo

- Preserve the portfolio identity. This site can sell services and attract recruiters, but it should not read like a generic agency template.
- Prefer concrete proof and shipped examples over abstract claims.
- Keep BuildApp references accurate and proportional to the role described in the repo.
- When proposing SEO pages, map them to real search intent and existing routes before adding new pages.
- If a marketing task changes architecture or repo workflow, update `/.memory/*`, `PROJECT_STATE.md`, and relevant memory docs.

## Anti-Patterns

- Writing generic AI-sounding copy disconnected from Tony's real background
- Inventing metrics, case studies, or proof that the repo does not support
- Editing `dist*` output instead of source files
- Adding SEO pages with no clear query, route strategy, or internal-link role
- Running upstream automation scripts that need third-party credentials without a task-specific reason
