# Project State — 2026-09-30

Last updated: 2026-10-03

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

## Neural simplification and derivative audit — 2026-10-01

The sole0–9 picker also sets the supervised digit; Clear retains it for manual drawing. Número correcto/select and the training CTA/block/after-update view are removed. Output geometry/markers/labels are25% smaller. Forward/backward input defaults to original pixels; true raw-pixel sensitivity is an explicit inspector option with clear metric labels. Backward inspection retains actual loss and hidden/output gradients; base model/math/weights and approved camera remain unchanged.62 independent finite-difference comparisons on actual pretrained tensors, two labels and40 nonzero derivatives pass with maximum error4.123795749322312e-11. Latest behavior, numerical proof, checks/images/publication: docs/ai/neural-refinement-20261001.md/json. Existing IONOS authority and pending GitHub public-export gate remain separate.

Published/verified in IONOS: two direct neural viewport checks pass with matching HTML/model hashes.54 code tests,24 visual comparisons and18 unique affected UI journeys are verified; the manual drawing test is fixed to avoid clicking under the sticky header. Inspected ES/EN/CA and1440/390/768px; only two neural references change. Real math, weights, games, BuildApp PNGs and74 protected originals remain unchanged. No public GitHub push occurs.

## Input-gradient arrival and documented payouts — 2026-10-01

Backpropagation defaults to real signed input-gradient cells; forward retains original pixels.784 grouped bundles carry the complete128-source derivative through an explicitly labelled sum operator, with synchronized travel/arrival highlights and independent pause/on/off. Numerical math/model/camera/output geometry remain unchanged. Proof: docs/ai/neural-arrival-20261001.md/json.

Home now describes MTM Python automation and its Windows desktop dashboard from read-only primary-source inspection. Only two owner-authorized Lucid payout certificates are included:1,617 USD on2026-08-14 and2,100 USD on2026-09-15, total3,717 USD in those two payments. Exact local masks redact identifiers; all exterior decoded pixels are preserved, original metadata removed and evaluation passes excluded. ES/EN/CA modal loads full PNGs on demand. Proof: docs/ai/lucid-payouts-20261001.md/json. Payouts and neural arrivals are published and verified on IONOS: matching model/certificate hashes, live controls/animations, both viewports and all payout languages.79 affected UI tests and24 visual comparisons pass, with54 node/tooling tests. Public-source GitHub gate remains separate.

After this publication, Tony requests an optional credited Sprite Fusion destroy-page easter egg on AI Lab routes. Tracked as My Page-yf1; official implementation/license and restoration behavior must be verified before integration.

## Official Sprite Fusion easter egg — 2026-10-01

The seven AI pages now have the optional «No pulses aquí» footer reveal, with ES/EN/CA instructions and clear Hugo Duprez / Sprite Fusion credit. It launches the official hosted game in a separate protected tab using only a canonical public lab route. No engine/scripts/assets are copied, and no visitor query, drawing, state or local/preview URL is sent. The official viewer needs its exact `/p/https/tony-r.com` base to render React routes; local tests cover full hub/model rendering and normal-origin rejection. A missing optional chunk cannot blank the site.58 calculations/tooling tests,68 UI checks and24 visual comparisons pass. Published and verified on IONOS and the hosted game: hub1,021/neural2,017 letters versus baseline101, with actual public content/model and no load errors. The service omits some SVG graphics. Evidence: docs/ai/lab-easter-egg-20261001.md/json.

Tony then requests stronger verified tres en raya copy (My Page-85w) and recovery of the original large artist catalogue plus fuzzy-name search in Seis grados (My Page-mhu), after the easter egg. Keep this order. No changes to MTM/BuildApp accounts or runtime are authorized by those portfolio tasks.

## Verified tres en raya explanation — 2026-10-01

Published on IONOS:255,168 legal complete game sequences, with an explicit current-mode label and the hard-mode draw challenge. Actual production Minimax remains unchanged; an independent enumeration verifies the total, and exhaustive human continuations against its O policy yield498 AI wins,183 draws,0 human wins over936 decisions. The copy describes search from the current board rather than training or scanning all root games on every turn. ES/EN/CA and three viewports/mode context verified live;58 tooling/calculation tests,2 turn/reset cases and6 unchanged AI references pass. Proof: docs/ai/tictactoe-copy-20261001.md/json.

Seis grados source recovery finds the historical10,000-person cache plus full original public Parquet files (1,044,499 people,344,276 movies,1,189,594 credits). Some credit IDs lack person metadata; validate/filter them rather than inventing names or links. Work continues in My Page-mhu with compressed static data, worker search/BFS and typo/ambiguity handling. PyArrow available in an existing environment was used strictly as a local public-file reader; no MTM modules/runtime/data were used.

## Complete Seis grados catalogue — 2026-10-01

Published and verified on IONOS: all1,044,499 names/344,276 films from original public Parquet sources, including all10,000 historical names;1,188,614 valid unique credits.899 unknown-person rows,70 duplicates and11 future credits excluded. Typed arrays/UTF-8/Gzip keep data out of the initial home bundle; worker handles exact/partial/diacritic/typo search, explicit identity ambiguity and shortest real-credit BFS. Year/IMDb links accompany each shared film. Corrupt/unavailable data has visible retry with no silent small fallback.63 node/tooling,10 scoped UI and26 visual comparisons pass; three preview viewports/languages and six final live cases pass. Local synthetic typo UI latency improves~880ms to~375ms; first network load remains sizeable. Original Parquet/model/payout assets are unchanged. Proof: docs/ai/sixdegrees-20261001.md/json.

The first remote full QA had a later loading failure after two successful cases; asset hash/permissions and three isolated loads were verified, then all six complete final live cases passed. Cause not reproduced; keep the explicit retry. Source publication to GitHub remains independently gated; website publication is complete. My Page-mhu closes on observed live proof.

## Distributed neural returns restored — 2026-10-02

Published and verified on IONOS: Tony requests the original connections from the first hidden layer to input, replacing the central sum operator.256 strongest-weight links originate at all128 actual hidden nodes; individual chain-rule contributions animate only when nonzero.784 cells retain complete derivatives over all128 nodes. Camera, output75%, independent controls, original drawing, equations and pretrained weights remain. Only the neural Code and references link is removed; other source links and model provenance/licenses remain.63 tooling/calculation tests,24 scoped UI checks,four inspected visual comparisons,six preview and six final live cases pass.74 protected original files remain intact. Proof: docs/ai/neural-returns-20261002.md/json.

The first live run timed out waiting for the English model after Spanish passed. Public model HTTP/hash and two isolated English viewport cases were verified, then all six final cases passed. Cause not reproduced; no loader/math change is claimed. Private rollback is verified; website publication is complete and the separate public GitHub export gate remains.

## Formulas and actual code in all five games — 2026-10-02

Published on IONOS: shared ES/EN/CA lessons with formulas/glossaries, visible implementation excerpts and native expandable code. T-Tris explains its actual current proposal/last decision using the original search;48 frozen-baseline comparisons preserve its destinations. Minesweeper records zero-mine constraints from revealed clues, while Seis grados shows current minimum path/discovered artists. Code keys do not trigger T-Tris actions; reset/edit clears obsolete explanations. Other game algorithms and neural code/math/model stay intact.67 tooling tests,37 UI checks (one desktop-only case intentionally skipped on mobile),14 inspected visual comparisons and30 final live navigation cases pass. Live Minesweeper and Catalan Nim also pass isolated checks on both sizes.74 protected originals remain. Proof: docs/ai/game-learning-20261002.md/json.

An initial full-reload live run timed out on Catalan Nim after13 cases; isolated Nim and final navigation pass, with the initial cause not reproduced. A later artificial RNG seed hang in navigation was diagnosed and fixed in QA, without changing production randomness. Snapshot updates cover only the five games; lab/neural references remain. Private backup is verified; no public GitHub export occurs.

## GitHub source publication — 2026-10-02

Tony explicitly requests uploading all current work to GitHub. Verified existing repository: public TonyRod116/tony-r.com, default branch main, authenticated account TonyRod116. Remote5763112 is an ancestor of current codeac316d1;12 pending code commits are pushed successfully without force.172 new historical text blobs are checked for obvious credential/private-recovery patterns, with no findings; no new blob exceeds100MB. Private artifacts, raw payouts, credentials, generated dist changes and preexisting personal settings changes are excluded from the new history. SSH authentication is unavailable in this session; command-scoped HTTPS uses the existing GitHub credential helper without changing stored credentials or remote configuration. IONOS publication remains separate and unchanged.

The prior public-source export gate is resolved by this explicit GitHub request. This record reflects the observed code push; publication metadata follows in its own commit. Historical no-push entries above describe the earlier state.

## GitHub CI route-smoke correction — 2026-10-02

The initial GitHub run passes197 browser cases and fails only the two generic Seis grados route checks (one desktop-only case is intentionally skipped on mobile). The generic test incorrectly requires every role=status node to disappear, while the catalogue deliberately retains an empty accessible live region after loading. Both failures reproduce locally. The smoke test now requires the actual catalogue state to be ready and distinguishes its persistent live region from route loading; no application code, accessibility behavior, assertions of readiness or baselines are removed. Both focused cases and67 tooling checks pass.

The local full run passes195 cases with4 timeouts unrelated to the catalogue correction; one is traced to ERR_NETWORK_CHANGED during the Tetris chunk request. The six relevant isolated Tetris/neural cases subsequently pass. GitHub run37019315174 at0407c14 then succeeds:199 browser cases plus one intentional mobile keyboard skip,32 visual captures,67 tooling checks and the isolated build. IONOS and preexisting local work remain unchanged by that test correction.

## Cristal and Taladro with exact forecasts — 2026-10-02

Published and verified on IONOS: Crystal's four temporary cells survive two subsequent placements, including the second placement's line scoring before expiry; Drill's three cells pierce at most two occupied cells in total. Distinct cracks/perforation, visible lifetime, weighted spawn and explicit new-game starters explain their tradeoffs. The shared pure lock transaction calculates ghost contacts, final-board miniatures, manual/AI animations and Crystal-to-fluid-T cascades. The queue exposes two actual upcoming pieces; the existing six-candidate AI extends its forecast through both when a special/expiry matters, without inventing later random pieces. Its preview, code and conditional explanation use those actual results. Phase tokens, pause/reset and deferred score/turn/queue confirmation remain protected.

Observed local proof:78 tooling tests,24 routing cases,31 scoped UI passes plus one intentional keyboard skip,10 inspected visual comparisons,48 ordinary-policy parity cases and six preview cases at desktop/mobile/tablet. All12 live piece/language/viewport cases pass with matching HTML/model hashes, real effects, exact forecasts, pause protection and no overflow/page errors. Original algorithms in neighboring games and neural math/weights remain unchanged;74 protected originals match. No dependencies, API/server or hosting configuration changes. Public evidence: docs/ai/tetris-specials-20261002.md/json; private operation and screenshots in .artifacts/tetris-specials-20261002/. GitHub publication uses the existing owner authorization and retains private/personal/generated exclusions.

GitHub code publication is observed:main at9bb839f, with no source commits pending against the fetched remote. Run37045685232 succeeds with78 tooling tests,215 browser passes plus one intentional skip,36 visual captures, build and performance report. The artifact-upload step reports no files; log evidence and local inspected screenshots are retained. This closure records observed results without changing production source or CI.

T-Tris control polish later on2026-10-02 is published and verified: ghost cells retain the solid outer border and omit their inner dashed outline. The toolbar label is Piezas especiales / Special pieces / Peces especials; its native title accurately describes the original T-dissolution toggle. Crystal/Drill rules, AI and the engine remain unchanged.78 tooling checks,10 focused interactions,8 unchanged-reference visual comparisons and six preview/six live language-and-viewport checks pass.74 protected originals remain unchanged. Small-adjustment evidence/recovery stays in .artifacts/tetris-controls-20261002/; the preceding full-specials report remains the historical9bb839f snapshot.

## T-Tris timing, preview visibility and game-over layering — 2026-10-03

Published and verified: Crystal lasts three subsequent placements, including the third placement's lines before expiry. AI off hides all miniatures; AI on shows drop and suggestion together. The drop retains its final transaction result through reactions; proposal/continuation retains the pre-move board/piece/clock/known queue rather than an intermediate animation board. Reset discards that snapshot. A reserved status line prevents mobile reflow; continuation retains its actual one/two-piece result and the game-over overlay outranks all voxels.

Observed final proof:79 tooling checks,37 scoped browser passes plus one intentional mobile keyboard skip,10 inspected visual comparisons,20 preview and20 live cases. Twelve line-clear cases measure0 px queue movement; Crystal reaction tests enforce less than0.1 px. Game-over restart passes15 hit points on each viewport and actually restarts.74 protected originals match. Four T-Tris references are inspected/accepted; lab/neural and desktop specials stay unchanged. Final preference supersedes the earlier AI-off miniature behavior within this task. Proof: docs/ai/tetris-stability-20261003.md/json; private recovery/screenshots: .artifacts/tetris-stability-final-20261003/. GitHub publication retains the existing owner authority and private/personal/generated exclusions.
