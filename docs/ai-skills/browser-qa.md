# Browser QA

Last updated: 2026-09-30

## Executable local checks

- `npm run build -- --outDir .artifacts/build` preserves existing generated output.
- `npm run test:e2e` checks built routes, languages, links, contact, chat success/error and telemetry on desktop/mobile. BuildApp/AI/Formspree are mocked; external network is blocked.
- `npm run test:visual` compares home/projects/contact viewport screenshots, full AI lab/neural/T-Tris pages and the remaining portfolio/solution pages. CV coverage includes lazy-loaded local thumbnails. Chat visual timestamps use a fixed date/time zone; interaction tests use real timers. Updates require inspecting images; same OS and Chromium build are necessary. CI records screenshots as artifacts without silently accepting new references.
- `npm run check:design` prevents new arbitrary token debt; it does not replace visual/keyboard/accessibility judgment.
- `npm run perf:report` measures build artifacts, not runtime Core Web Vitals.

Fixtures and routes live in `tests/e2e/`; reports in ignored `.artifacts/`. The QA path starts only a local Vite preview, never Express, production services or paid AI. Deep-link smoke of local preview does not certify Vercel middleware or external redirects.

Configuration follows the official [local web server](https://playwright.dev/docs/test-webserver), [network mocking](https://playwright.dev/docs/network) and [visual comparison](https://playwright.dev/docs/test-snapshots) guidance, checked against installed Playwright 1.59.1. This machine's verified temporary browser path is `/tmp/my-page-playwright-browsers`; set `PLAYWRIGHT_BROWSERS_PATH` to that location while using it, or install the matching browser in your normal cache. The temporary cache is not committed.

Repo-specific visual QA workflow shared across Codex, Claude, Gemini, Cursor, and similar agents.

## When to Use

- After UI, layout, styling, animation, navigation, or responsive changes
- After route changes
- After changes to demo landing pages or AI demo flows
- Before closing a frontend task when practical

## Primary Goal

Catch regressions that code review misses:

- broken layouts
- missing navigation
- clipped content
- mobile overflow
- route errors
- untranslated or inconsistent copy

## Baseline Routes

Check the routes affected by the change, plus nearby navigation paths when relevant.

Core pages:

- `/`
- `/about`
- `/projects`
- `/contact`
- `/resume`
- `/ai`
- `/demos`

Demo pages:

- `/demos/presupuesto-orientativo`
- `/demos/render-presupuesto`
- `/demos/lead-qualifier`
- `/ai/tictactoe`
- `/ai/minesweeper`
- `/ai/sixdegrees`
- `/ai/nim`
- `/ai/tetris`

## Route-Specific Notes

- `/demos` has custom middleware rewrite behavior in `middleware.js`; if it fails in production/previews, inspect that first.
- Demo/API pages may depend on local or deployed API availability. Distinguish UI regressions from backend/network failures.
- Header, footer, route transitions, and language switching are shared surfaces. Re-check them after any global UI change.

## Minimum Viewports

Desktop:

- `1440x900`

Mobile:

- `390x844`

Optional tablet when the layout is complex:

- `768x1024`

## What to Check

1. Page renders without crashes or blank states
2. No obvious horizontal overflow
3. Header and footer remain usable
4. Main CTA and important links are visible without awkward clipping
5. Text remains readable and spacing is consistent
6. Route navigation works as expected
7. Affected pages behave correctly in desktop and mobile layouts
8. If translations were touched, verify at least the impacted language switch paths

## Preferred Workflow

1. Run the local app
2. Open only the affected routes plus one adjacent shared route
3. Check desktop first, then mobile
4. If the task touched shared layout/navigation, also verify `/`, `/projects`, and `/contact`
5. If the task touched demos, also verify `/demos`
6. Capture screenshots when browser tooling is available
7. Report concrete findings, not just "looks good"

## Anti-Patterns

- Do not inspect only one viewport for responsive changes
- Do not mark UI work complete after build-only verification
- Do not blame the frontend immediately when a demo fails if the route depends on API availability
- Do not review generated `dist*` output instead of the live source behavior
