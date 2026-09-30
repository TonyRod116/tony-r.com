# Project State — 2026-09-30

Last updated: 2026-09-30

## Current state

Portfolio and AI demos in src/, Vercel functions in api/, local Express/persistence in server/. Lead Qualifier currently selects the BuildApp demo endpoint, including development. Availability of external services has not been tested by this tooling installation.

## Agent and quality foundation

- Repo-native skills in .agents/skills, including engineering, marketing, memory/evaluation/audit, observability and bounded autonomy; .claude/skills mirrors canonical source.
- Selective local memory with current/historical status, authority/freshness and explicit sources; health and observed-outcome ledger with evidence hashes.
- Global model policy reused through ai:route; no copied classifier, universal model switching or automatic provider disclosure.
- Session brief and bounded Claude SessionStart hook; other clients use the explicit command.
- Design context and regression gates for documented preexisting design/lint debt.
- Local browser interactions/visual baselines, CI without deployment, telemetry with allowed fields and route loading on demand.
- Complete adoption inventory: docs/ai/adoption.md. Final checks and limits: docs/ai/verification.md.
- Verified closure: 23 tooling tests, 24 routing cases, 52 browser journeys and six screenshot comparisons pass. Main entry JS reduces 37%; total emitted JS grows slightly. User changes preserved. Follow-up redesign/debt is tracked in My Page-87.

## Preserved work and limits

Preexisting changes in Tetris, translations, Resume, Claude local settings and generated dist output are preserved. Build verification uses .artifacts/build. No production deploy, paid AI test, external review, real contact message, Sentry account or schedule was activated.

## Current home and next product step

Home showroom is implemented after Tony's approval and Sonnet 5.5 High design consultation. Scoped warm-paper layout and direct copy replace the old presentation; BuildApp is first, trading is a sober confirmed statement, and the lab is compact. Portrait scroll bug is removed, normal-size links meet the tested contrast threshold, and language selection works by keyboard and updates document lang. Header/footer variants are homepage-only.

Tony's navigation follow-up keeps AI Lab prominent in the homepage header alongside Projects, About and Contact. Solutions is a translated secondary footer link. The homepage AI link retains the plain typography of the showroom.

Build, 23 tooling tests, 24 routing cases, 68 browser journeys and six visual comparisons pass. Only the two home snapshots were updated after inspecting the new design; the four neighboring route references stayed unchanged. Verified local evidence: docs/ai/home-showroom-20260930.json. Preview captures: .artifacts/home-redesign-preview. The trading statement is user-confirmed, not independently audited performance. No deployment or publication occurred.

Next: review the remaining site pages against the showroom direction. Existing unrelated work in Tetris, Resume, local settings and dist remains preserved. Frontend local proof does not establish external service availability or business impact.

## AI laboratory — implemented locally 2026-09-30

The /ai hub and all six experiments now share one layout, visual tokens, navigation and three-language catalog. Neural visualization is integrated into React with real local MNIST inference, pointer drawing, a rotatable vector view and explicit retry; the old HTML link redirects. T-Tris preserves its special T, music, ghost and records while using shared tested rules for rendering/manual/AI. Neighboring games get responsive controls, accessible labels, delay cancellation and clearer copy. Six Degrees uses a smaller curated, source-backed film graph instead of incorrect sample credits.

Full browser suite passes 106 journeys; final AI/copy-specific recheck and visual results are recorded in docs/ai/lab-redesign-20260930.json. Build and 34 model/game/tooling tests pass; captured desktop/mobile/tablet routes show no overflow or runtime errors. Local UI proof does not establish model accuracy or production deployment. Remaining showroom work concerns other site pages; AI is completed within that larger follow-up.

## Remaining showroom pages — implemented locally 2026-09-30

About, Projects, Resume, Contact, Solutions and all three active solution demos now share a warm-paper system in src/components/site/. Header is consistent, with AI primary and Solutions/CV secondary. Copy is ES/EN/CA; project ownership is explicit and recruitment/investment framing does not lead. Original PDFs and24 gallery images are retained, captions corrected and gallery served locally. Dialogs, comparison controls, selected locale and asynchronous cancel/reset paths are verified. API/server/settings/dist and approved home/AI source remain preserved.

Observed: isolated build, quality checks (38 tests,24 routing cases) and full140 browser journeys pass. The last budget CTA text adjustment is rechecked in10 specific journeys. Final images/comparisons and limitations: docs/ai/site-showroom-20260930.md and JSON; captures in .artifacts/site-rest-preview/. All remote demo/contact responses used for QA are fixtures; no production availability or generated-image accuracy is certified. Sonnet consultation fails without advice. Publishing remains outside this task.

## Publication — 2026-09-30

Tony authorizes publishing the completed showroom, AI lab, demos and repository tools. Current hosting confirmed: IONOS serves tony-r.com from its tony-r directory. Private backup precedes activation; public HTML SHA-256 matches the isolated production build. The historical GitHub → Vercel integration remains active separately. Online verification and recovery are recorded in docs/ai/publication-20260930.md/json; deployment verification blocks contact submissions and paid AI calls. Personal Claude settings and preexisting dist modifications are excluded from commits. Existing dependency audit debt is tracked in My Page-5lo, without automatic upgrades during publication.
