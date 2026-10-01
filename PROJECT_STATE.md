# Project State — 2026-09-30

Last updated: 2026-10-01

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

Live read-only checks find the legacy BuildApp host returns503. Lead Qualifier's public-compatible default is corrected to the current monorepo backend (health/preflight200, no actual AI request). Budget/render generations remain unavailable: current routes require BuildApp authentication/quota; the portfolio displays a clear localized notice and links to the product. No backend/auth/quota changes are made.

## T-Tris and neural showroom polish — 2026-10-01

T-Tris has centered rotation frames, physical-keyboard control without an initial click, a one-off AI decision independent of preview mode, and a separate suggestion board. Magic T has real progressive sand frames and a distinct luminous appearance; score/line clearing/next spawn wait for the same final result used by the AI. Pause and reset protect the phase. Neural keeps the approved28-degree orientation and local pretrained model, with a scientific instrument layout, examples0–9, actual layer/neurone inspection and optional traversal of computed activations.

Current public BuildApp web/mobile screenshots replace the old product captures; provenance is docs/ai/buildapp-captures-20260930.json and sample data are labelled as public demo content. Casex title/link are cleaned while original PDFs remain unchanged. Local proof, visual acceptance and publication status: docs/ai/polish-20261001.md/json. Full browser pass:149 plus one desktop-only test skipped on mobile; final affected neural/T-Tris check17 passes plus that same skip. Tooling44 tests and routing24 cases pass. Sonnet5.5High produces no usable output; no independent approval is claimed. Existing API/server, personal settings and generated user changes are preserved.

Publication verified: the five updated routes pass10 online desktop/mobile checks on tony-r.com/IONOS, including actual local model examples, keyboard/AI and Magic T phase/pause. Prior version is privately backed up; latest proof is docs/ai/polish-20261001.json. Baselines for the five affected pages are visually accepted, and all24 comparisons pass. Git source publication follows the same verified build.

## Faithful neural dynamics and completed-line flash — 2026-10-01

The neural demo now records the actual normalized forward trace and supports real backpropagation/cross-entropy/one SGD step in an isolated local copy. Visible edge values are real contributions, reverse gradient contributions or parameter updates; inference is separate from the optional teaching step. The original pretrained artifact and last inference remain unchanged. Auto playback, pause/step/stop and input/target cancellation are scoped to each trace; examples0–9 occupy one row.

T-Tris retains completed rows for320ms before removing them and committing score/next piece once; pause/reset guards protect the phase, including after Magic T settlement and AI moves. Independent numerical derivative checks and model/edge isolation tests pass; full browser suite passes155 journeys plus one inapplicable mobile skip. Source/check proof53 tests, routing24 cases; final visual/online evidence is recorded in docs/ai/neural-dynamics-20261001.md/json. No API/server, original weights or remote AI generation changes.

Published/verified: both experiments pass4 online route/viewport checks in IONOS, with actual local tensors, isolated training and row flash/pause/scoring. All24 visual comparisons pass. Private backup retained; proof: docs/ai/neural-dynamics-20261001.json.

## Neural stage controls and corrected output row — 2026-10-01

Tony clarifies that the single row belongs to the ten output neurons, not the examples selector. The output now has a horizontal0–9 rail, including at maximum zoom; one examples block remains beside the canvas. Stage boxes select input, hidden1, hidden2, output or all, independently of forward/backward direction and animation on/off/pause. Selection, input and target changes preserve motion settings. Camera reset only resets the camera; node inspection pauses for detail. The optional full training walkthrough retains manual stepping and the isolated SGD copy. All quantities still come from the unchanged real model/math; the joint view explicitly describes sequential computation.

Current checks, reviewed images and publication evidence are recorded in docs/ai/neural-controls-20261001.md/json. IONOS publication is authorized within the ongoing website task. Public GitHub source export remains awaiting specific confirmation after automatic approval review rejected the prior push; no alternate export or push is attempted. API/server, model/PDF/image originals, preexisting personal settings and dist changes remain preserved.

Published/verified on IONOS: four direct live route/viewport checks pass, including unique examples selector, horizontal output row, independent stage/direction/motion controls, actual label gradients and isolated copy; T-Tris flash/pause/scoring also pass. Public HTML/model hashes match the verified build/original.53 code tests,22 affected browser journeys and24 visual comparisons pass;74 protected originals match. No public GitHub push occurs.

## Output back in 3D and product screen framing — 2026-10-01

Tony prefers the ten output nodes as one vertical column within the fourth 3D layer, replacing the horizontal rail below the scene. All four layers now share the existing camera projection; output connections follow the actual projected nodes. Input orientation, neural values, independent stage/motion controls and original math/weights are preserved. BuildApp mobile screenshots are visually framed to omit their26-CSS-pixel top Demo/blank strip in Home, Projects, thumbnails and dialog, without editing the original PNGs. ES/EN/CA captions identify BuildApp Pro with sample data. Current checks/images/publication proof: docs/ai/column-captures-20261001.md/json. IONOS remains the authorized publication target; public GitHub export stays pending, with no push attempt.

Published/verified on IONOS: six direct checks of neural/Home/Projects desktop/mobile pass; HTML/model hashes match the verified build/original.53 code tests,26 affected browser journeys and24 visual comparisons pass. Five references are visually accepted; all four capture PNGs and74 protected originals match prior hashes. Geometry/framing are also inspected on tablet; the live dialog waits for image decode before measuring its crop. No public GitHub push occurs.
