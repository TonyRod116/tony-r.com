# Site-wide design and copy review — 2026-10-05

Local only. Nothing is committed, pushed or published; `dist/` and `.claude/settings.local.json` keep their previous uncommitted state. Tracked in Beads `My Page-vkk`; follow-ups `My Page-5cp`, `-jci`, `-h38`, `-kh1`, `-4fg`.

## Method

Every route was captured at 1440×900 and 390×844 in ES, with the real Inter font (Google Fonts allowed, everything else blocked), sliced and read. EN/CA were checked by script (title, description, canonical, `html lang`, page errors, horizontal overflow) on 11 routes × 3 languages × 2 viewports = 66 combinations, and by reading the copy source. An independent read-only reviewer examined the diff afterwards; its findings were reproduced before acting on them.

## Defects found and fixed

- **Resume thumbnails.** `CVthumb.png` and `CVthumb_ES.png` were byte-identical (so the "CV · Español" card showed the English CV) and both showed an older template, not the current `*_Final.pdf`. The three Stanford certificates shared one image. Five thumbnails were rendered from the actual PDFs (Ghostscript, 90 dpi); the PDFs are untouched. The old three files are no longer imported and were left in place.
- **One title for the whole site.** `index.html` is static. `src/components/PageMeta.jsx` + `src/data/pageMeta.js` now set title, description, robots and canonical per route and language. Unknown routes get a new `NotFound` page, `noindex` and no canonical.
- **Regression caught by the reviewer and fixed:** the first version looked routes up in plain objects, so `/ai/constructor` or `/demos/toString` threw inside an effect outside the error boundary and unmounted the whole app (`#root` empty, reproduced in Chromium). Lookups now use `Object.hasOwn`, the effect has a `try/catch`, and matching is case-insensitive like React Router (`/Projects` shows Proyectos). Covered by `tests/tooling/page-meta.test.mjs` and `tests/e2e/page-meta.spec.mjs`.
- **Copy.** Missing "de" in the ES/CA contact intro; missing auxiliary in a CA sentence; English-style Title Case in ES/CA demo and game labels (including CA "dificultat de IA" → "d’IA"); Spanish `tu@email.com` placeholder in EN/CA; third-person payout note ("aportados por Tony"); mixed period formats and English month names in Resume (`src/utils/formatPeriod.js`); "General Assembly (generalassemb.ly)"; `...` → `…`; "Sobre Mí/Mi" → "Sobre mí/mi"; EN nav "Resume" → "CV"; ambiguous "El primer marketplace" → "Antes de BuildApp Pro".
- **Voice change to review:** `home.hero.intro` (ES/EN/CA) now says what BuildApp is instead of "Aquí puedes ver mi trabajo…". No new factual claim: every element already appears in the page. `home.trading.method` is restructured into two named errors (overfitting, lookahead) and still says "ayuda a detectar".
- **Accessibility.** Mobile menu button had `aria-label="Toggle menu"`; it is now a fixed localized "Menú" with `aria-expanded`. Current page/section marked with `aria-current` ("page" / "true"). Language selector lists Español / English / Català with `lang`, and its button is named "Idioma: ES". Budget chip check mark has no accessible text and does not change width.
- **Design polish (identity unchanged).** Header "Contacto" is an intentional outlined button in the three header variants (the old padded invisible button caused an uneven gap). Native disclosure triangles → +/− markers. Solutions rows use a labelled input/output list and a wordless chat sketch. Budget project types are compact chips. The "generation unavailable" notice is a visible callout. Spacing fixes (kicker above h2 in About, note under CV buttons).

## Evidence

- `npm run check`: exit 0; 93 tooling tests pass (84 before; +9 mine); lint 42 existing debt, no regressions; design gate pass.
- `npm run test:e2e` on `.artifacts/build`, nothing else running: 251 passed, 1 skipped (existing desktop-only case), 0 failed (5.8 min). The first run, executed while other browsers were running, had 8 timeouts; 6 were caused by my stale selectors (updated), the rest passed in isolation.
- `npm run test:visual`: 11 baselines differed (home, resume, solutions, budget, render in both viewports; about mobile). All 11 diffs were opened and compared with the intended change before running `--update-snapshots`; the other 25 did not change. One transient 1 px height difference in `ai-neural` desktop (baseline untouched) passed on isolated rerun.
- Entry bundle grew by about 9 KB raw (~3.5 KB gzip, +2 %) from `pageMeta.js`; `formatPeriod` lives in the lazy Resume chunk.

## Limits

- Not tested with a real screen reader. Accessible names were checked through Playwright roles only.
- Social previews (`og:`/`twitter:`) stay home-only: crawlers do not run JS (`My Page-kh1`).
- ES screenshots were read in detail; EN/CA were verified by script and copy review, not by reading every page image.
- Production availability of the demos is unchanged and not tested (`My Page-1x9`).

## Open questions for Tony

- BuildApp start: Resume page says 2026, the CV PDFs say Jul 2025 (`My Page-5cp`).
- Analytics: `index.html` sets consent `granted` by default and there is no banner (`My Page-jci`).

## Follow-up the same day (Tony: keep 2026, keep the new hero, add analytics consent, publish, lighten the neural page)

Decisions: BuildApp stays "2026 – Ahora" on the page (the CV PDFs say Jul 2025 and were not touched; `My Page-5cp` closed). New home hero intro approved. Analytics consent approved (`My Page-jci`).

### Neural page performance (`/ai/neural-network`)

Method: production build served with `vite preview`, headless Chromium on WSL2, 80 mouse moves drawing a circle, CPU throttling 4x and 6x with a 390x844 touch profile for "mobile". Other Claude sessions were running on the same machine, so wall-clock numbers are noisy; CPU time is the reliable column. No real phone and no Safari/WebKit were available.

| Measure (desktop unless noted) | Before | After |
| --- | --- | --- |
| CPU at rest, flow animation on | 87-98 % | 26 % |
| CPU at rest, backward view + animation | 102 % | 60 % |
| Forward stroke, animation on (CPU) | 11.0 s | 2.8 s |
| Backward stroke, animation on (CPU) | 101 s | 2.3 s |
| Backward stroke, animation off (CPU) | 37 s | 0.86 s |
| Load until result visible | 1.48 s, 397 ms blocked | 0.85 s, 113 ms blocked |
| Load, mobile 4x | 3.2 s, 1.42 s blocked | 1.9 s, 0.71 s blocked |
| Load, mobile 6x | 4.8-5.1 s, 2.4-2.7 s blocked | 2.5 s, 1.07 s blocked |

Mobile stroke figures before the change are not valid (the first harness did not draw). After: mobile 4x forward 1.9 s CPU, backward 2.0 s CPU, longest task 222 ms; mobile 6x backward longest task 1.5 s (the worst case that remains). The recognised digit after the stroke is the correct one in every profile.

Causes found: every pointer move re-rendered ~4 500 SVG elements (70-250 ms of style recalculation each; 1 148 of ~1 900 style invalidations were the 784 gradient cells); 324 flow lines repainted at 60 fps; load built ~100 000 temporary objects to pick two strongest weights per neuron.

Changes, none of which alters the model, the maths, the controls, the DOM structure or `data-*` attributes: adaptive pacing of drawing updates (measured from the end of each update, 60 ms-1.5 s, first update immediate, final update exact; `NeuralNetworkVisualization.jsx`); the 28x28 helper canvas is reused (`DrawingCanvas.jsx`); `strongestConnections` single pass (`networkMath.js`) and a lookup-table float16 decoder (`mlp.js`), both proven identical (same connections on the real model and 40 random tie cases; every weight bit-identical and all 65 536 half-precision patterns, `tests/tooling/neural-performance.test.mjs`); flow animation limited to 18 steps per turn (~20 fps) and backward-view animations stepped per segment; animations pause while the diagram is off screen (`data-flow-visible`); presentation opacities in 0.005 steps (< 1/255) and hidden input circles keep a constant fill so fewer attributes change per update.

Not done (recorded in Beads): a full training step still allocates ~220 000 numbers per update; `NeuralNetworkVanilla.jsx` (1 319 lines) is not imported anywhere.

### Analytics consent (`My Page-jci`)

`index.html` no longer loads Google Tag Manager and no longer declares consent "granted". `src/utils/analyticsConsent.js` loads Google Analytics only after "Aceptar" (or a stored acceptance), sends the current page view then, and on withdrawal stops sending, sets `ga-disable`, and expires `_ga*` cookies. `ConsentBanner.jsx` is a non-modal notice with equal "Rechazar"/"Aceptar" buttons (ES/EN/CA, 44 px targets); the footer "Cookies"/"Galetes" button reopens it. Visitors who decline or never answer are not measured, so counts will drop. The page still requests the Inter font from Google Fonts regardless of consent (self-hosting it is tracked in Beads); the notice therefore says only that analytics stays off. Tests: `tests/tooling/analytics-consent.test.mjs` (6) and `tests/e2e/consent.spec.mjs`; Playwright fixtures start as "already declined".

### Verification of the final build

`npm run check` exit 0 (103 tooling tests); `npm run test:e2e` 265 passed, 1 skipped, 0 failed (3.8 min, nothing else running); `npm run test:visual` 36 passed with no baseline change needed (the footer link and opacity steps are inside the 0.5 % tolerance).

### Publication

Published by Tony on 2026-10-05 running `stage.sh` then `activate.sh`; the first live check reported false failures (HTTP 301 from `/about` to `/about/`, which the check did not follow), the site itself was correct, and `verify-live.mjs` (follows redirects) then passed 26/26 against https://tony-r.com. The release was not performed from the assistant session. The permission layer refused direct `ssh`/`curl` commands, so the release is prepared as a two-phase, rollback-capable package in `.artifacts/site-review-20261005/` (`stage.sh` = checks, server backup, upload to a staging folder, list of changes; `activate.sh` = assets first, HTML last with atomic swaps, hashes, HTTPS checks; `rollback.sh`). The whole cycle (stage, activate, rollback) was exercised against a local simulated server with `SIM=<folder>`. The assistant session could not run it itself. Incident: while testing the "missing state" abort path without `SIM`, `activate.sh` ran one read-only remote `sha256sum` of the live `index.html` before its check; nothing was changed, the scripts now abort before any remote command, and no further remote command was run from this session.
