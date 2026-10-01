# Architecture

Last updated: 2026-10-01

## Purpose
Shared architecture and operating map for this portfolio repo.

## System Overview

- `src/` is the main React/Vite application and the UI source of truth.
- `api/` contains Vercel serverless functions used in production and preview deployments.
- `server/` contains the local Express server used for local persistence and dev-only API parity.
- `public/` holds static assets and demo data.
- `dist/` and `dist*` folders are generated output and must not be treated as editable source.

## Continuity Layers

- `/.memory/*` stores durable repo-operating context inside the repo:
  - `architecture.md`
  - `decisions.md`
  - `glossary.md`
  - `todo.md`
- `PROJECT_STATE.md` stores recent project status snapshots.
- `memory-bank/` stores broader durable context across sessions.

Operational rule:
- trust current code first
- then use `/.memory/*` for startup context
- then use `PROJECT_STATE.md` and relevant `memory-bank/*`

## Marketing System

- `.agents/product-marketing-context.md` is the source of truth for positioning, ICP, messaging, proof points, and copy constraints.
- `docs/ai-skills/marketing-ops.md` defines the repo-local workflow for copy, CRO, SEO, launch, pricing, emails, and growth tasks.
- `ai/tools/install-recommended.sh` clones curated external marketing/SEO skill repos into `ai/tools/vendor/` for local reference.

Primary external stack:

1. `coreyhaines31/marketingskills`
   Primary base for copy, CRO, Meta Ads, ASO, emails, pricing, and launch.
2. `ericosiu/ai-marketing-skills`
   Complement for experimentation, content ops, SEO ops, and distribution.
3. `kostja94/marketing-skills`
   Complement for SEO structure, page planning, and discoverability.

## Local Runbook

Frontend:

```bash
npm run dev
```

Local API:

```bash
cd server
npm install
npm run dev
```

Production-style build:

```bash
npm run build
```

AI instruction sync/check:

```bash
./scripts/sync-ai-instructions.sh
./scripts/check-ai-instructions.sh
```

## Current agent/quality system

Canonical local skills: .agents/skills; Claude mirrors: .claude/skills. Memory registry: .agents/memory/map.json; read-only context and health: scripts/ai-memory.mjs. Outcomes are append-only proposal_only with backing hashes. Model selection delegates to ~/litellm via scripts/ai-route.mjs; no local model classifier.

Design: .agents/design-context.md and legacy-aware token gate. Lint gate preserves preexisting debt but rejects increases. Browser QA uses built .artifacts/build, mocks and external-network denial. CI validates without deploy. Routes load on demand; telemetry filters allowed fields and stores a bounded local diagnostic buffer. Remote error monitoring requires separate configuration.

Lead Qualifier currently uses BuildApp /api/v1/demo/chat, also in development. The repo-owned /api/chat is a separate compatibility function. See docs/ai/api-contracts.md for actual consumers and production/local ownership.

## Home showroom

Home source is src/pages/Home.jsx with scoped styles/tokens in src/pages/Home.css. Its content lives only in the home branches of src/data/translations.js (ES/EN/CA). It has a warm paper/charcoal design, real portrait/product imagery and no decorative scroll behavior. Header/Footer have homepage-only compact variants; other route layouts remain unchanged. LanguageSelector uses a native disclosure, and LanguageProvider keeps the document lang aligned with the selected locale.

## AI laboratory — 2026-09-30

The /ai hub and six experiment routes use scoped tokens in src/components/ai/AiLab.css and the shared AiExperimentLayout. ES/EN/CA catalog/copy lives in src/data/aiExperiments.js. Neural inference is integrated React, backed by validated local Apache-2.0 MNIST weights in public/models/mnist; the old HTML route redirects. Vector projection is local and hardware-independent. Pure T-Tris rules/search are in tetrisEngine.js; UI keeps Magic T, ghost, music and local records. Six Degrees uses a small source-linked curated graph in src/data/actorGraph.js; larger old assets are not active. No API/server contract changes.

## Portfolio showroom completion — 2026-09-30

All eight remaining routes use SitePage/DemoPage and Site.css; UI copy and descriptive gallery captions are in siteContent.js. Global header keeps four primary links; footer carries Solutions/CV/AI. Native Modal owns PDF/photo/config dialogs. documents.js references the original CV/certificates; public/gallery stores original image copies and a source/hash manifest. Unknown old gallery locations are not rendered. ScrollToTop supports asynchronous project anchors. Three solution transports remain BuildApp-owned, with UI normalization in demoResponse.js; no api/server changes. Verification: docs/ai/site-showroom-20260930.md and JSON.

## Confirmed hosting — 2026-09-30

tony-r.com currently serves static Vite output on IONOS. Apache rewrite sends non-file paths to index.html; api/ serverless functions are available through the separate Vercel hosting, not executable on IONOS. The three redesigned demos currently call the documented BuildApp host directly; contact uses Formspree. GitHub main remains connected to the historical Vercel project. Publication evidence/recovery: docs/ai/publication-20260930.md. Never infer domain hosting from vercel.json alone.

## T-Tris transition and neural instrument — 2026-10-01

Magic T contact enters a settling phase: each visible frame moves blocks one row down in their column; manual/AI actions are blocked until the precomputed common final board is committed. Gravity and sand timers are mutually exclusive and pause/reset-safe. Rotations use central pivots and rendering/search retain coordinate pairs. Neural instrument keeps the actual pretrained MLP and the approved camera; examples are hand-drawn inputs, never substituted labels. Current capture/model/game proof: docs/ai/polish-20261001.md/json.

## Recorded neural calculations and line-clear phase — 2026-10-01

networkMath.js powers the same dense equations for inference and a transient teaching copy. Its tape includes normalized layer inputs, pre-ReLU sums and output logits/probabilities. Gradients use softmax-cross-entropy/ReLU/normalization exactly; the viewer animates selected real quantities from that tape. The base model/artifact never learns silently.

NeuralNetworkVisualization owns independent stage, direction, animation-enabled and paused state. Default is the joint forward view; layer0–3 or all can be inspected in either direction. Direct selection cancels the optional1400ms sequential teaching trace without restarting motion. Drawing/target changes refresh actual values while retaining view/motion settings. Output nodes0–9 now form one vertical column in the fourth 3D layer; camera projection and edge endpoints are shared with every layer. The single examples selector remains beside the drawing in two rows. Camera reset preserves selection and motion; node inspection pauses motion. Joint visualization does not claim parallel layer execution. Controls: docs/ai/neural-controls-20261001.md/json; latest geometry: docs/ai/column-captures-20261001.md/json.

BuildAppScreenshot frames the original780×1688 mobile captures by omitting their top52 physical pixels (26 CSS pixels). It is shared by Home, the selected Projects image, thumbnails and its dialog. It does not edit asset pixels; the original capture manifest stays authoritative. Visible captions identify BuildApp Pro and sample data instead of presenting the whole product as a demo. Geometry/framing proof: docs/ai/column-captures-20261001.md/json.

Neural follow-up: target is the sole selected-digit state for all ten buttons. The separate target dropdown and training CTA/after-update view are removed; Clear retains the label to permit custom drawing. Sequential playback only traces inference; backward inspection still uses the unchanged real derivative calculation copy. The output column’s spacing, plane, radii and labels are scaled0.75. Input displays original pixels in forward/backward; the inspector can explicitly show true raw-pixel gradients. Node metrics/types reflect the displayed quantity and the input inspector also exposes the underlying derivative.62 central finite-difference comparisons on the actual model (two labels, weights/biases/raw pixels) pass with maximum absolute error4.123795749322312e-11; this is local derivative evidence, not a recognition-accuracy benchmark. Latest proof: docs/ai/neural-refinement-20261001.md/json.

Backward return follow-up: InputGradientFlow.jsx represents one explicit collapsed weighted-sum operator for the first hidden layer, not an extra neuron.784 bundles each carry the complete raw-pixel derivative from all128 contributors (including zero ReLU-gated deltas and normalization), rather than pretending the sampled single-edge subset covers every cell. The default backward input is a projected gradient heatmap; its bundle/cell/node values and signed colours agree. Normalized SVG paths transport a pulse toward each cell, followed by a shared arrival highlight. Pausing/off/reduced-motion retain actual values; original-pixel reference is still available in the inspector. Model/mathematics are unchanged and the image is never altered by backpropagation. Latest source/runtime proof: docs/ai/neural-arrival-20261001.md/json.

T-Tris completed rows enter a320ms highlight phase before score/board/next spawn commit. Completion binds the exact result object, so stale callbacks cannot finish another clear. Magic T enters this phase only after its sand settlement. Evidence: docs/ai/neural-dynamics-20261001.md/json.


AI footer: LabEasterEgg is an opt-in reveal/official new-tab launcher, credited to Hugo Duprez / Sprite Fusion. It only sends canonical public AI route URLs, with no referrer/opener or visitor state, and never loads the game into My Page. A failed optional chunk is contained. siteRouting recognizes the exact official origin/prefix `/p/https/tony-r.com` so the hosted game can render the actual React deep route; all other origins keep normal routing. Proof: docs/ai/lab-easter-egg-20261001.md/json.
