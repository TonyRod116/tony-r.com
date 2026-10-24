# BuildApp Cliente + Pro — 2026-10-24

Home and Projects now present one BuildApp mobile app with Client and Professional experiences. Each account chooses one role at registration; Pro also remains available in the browser. Initially verified locally, this portfolio update was published on IONOS after Tony’s follow-up on2026-10-24. GitHub publication was initially paused; Tony subsequently explicitly requested pushing all completed changes on2026-10-24. The BuildApp repository was inspected read-only.

## Presentation and evidence

- Home introduces the two audiences in ES/EN/CA and pairs the Client simulation/cost screenshot with a Pro quote.
- Projects retains the original photograph/AI slider and adds four current official store images: Client simulation, Pro quote, visual proposal and line items. Five responsive thumbnails preserve the lightbox, keyboard controls and focus restoration.
- The primary product link opens the public BuildApp website. App Store, Google Play and Pro browser access remain distinct links. The company-site case uses a new anonymous screenshot of the current public website.
- Indicative costs are distinguished from professional quotes, and AI visualizations from completed renovation work. One download does not imply an in-account role switch or automatic customer/professional matching.

Current product claims were checked against the [public BuildApp website](https://buildapp.es/), the [App Store listing and release notes](https://apps.apple.com/es/app/buildapp/id6761193227), the [Google Play listing](https://play.google.com/store/apps/details?id=es.buildapp.app&hl=es) and the mobile router/Client sources in BuildApp. The older client-waitlist landing source is superseded by the current public site and app routes.

The four selected App Store WebPs are unchanged CDN bytes: 598×1300 pixels, 157,884 bytes combined. They contain official illustrative product content and are shown complete, without the header crop used for the previous mobile PNGs. The website screenshot is an unedited 1440×900 PNG from an anonymous session with analytics declined. Source URLs, dimensions and SHA-256 hashes are recorded in [the asset manifest](buildapp-unified-20261024.json). Prior images and their provenance remain available.

## Observed verification

| Check | Result |
| --- | --- |
| Isolated Vite build | PASS, output in `.artifacts/build`; tracked `dist/` untouched |
| `npm run check` | PASS, 103 tooling tests, 24 routing cases, 27 skill mirrors; no new lint/design debt |
| Home, remaining pages and metadata E2E | 72 passed across desktop/mobile |
| Focused browser matrix | 12 passed: ES/EN/CA × 1440, 768, 390 and 320px widths |
| Final visual comparisons | 6 passed: Home, Projects and unchanged Contact, desktop/mobile |
| Initial-state preservation | 990 protected tracked paths unchanged; all five new asset hashes match |
| Whitespace check | `git diff --check` passed |

The focused matrix exercised all four store images, thumbnail selection, minimum 44px controls, lightbox navigation, comparison keyboard input, Escape and restored focus. It observed no page errors or horizontal overflow. New screenshots were opened and inspected on desktop, tablet and mobile, including English/Catalan and the narrow layout. Four Home/Projects reference images were inspected and regenerated for the intentional copy changes; Contact references were preserved. Tall element-only QA captures temporarily omit the fixed global header to avoid capture overlap; normal viewport comparisons retain it.

Preexisting home/style changes and payout removals were preserved. Existing before/after sources, PDFs, games, neural model/math, API/server code, dependencies and deployment settings remain unchanged by this task. Operational logs, initial-state recovery, screenshots and the detailed browser matrix stay in the ignored task artifact directory.

These checks establish portfolio presentation and local browser behavior. They do not certify an authenticated BuildApp generation, a native device build, production service availability or a real customer transaction.

## IONOS publication — 2026-10-24

The public site now serves this version. Its HTML hash is `f88b3ed698a4ef486b7cc6f05292280669bdd4c1803664eabb578638054f778d`. All134 build files match the remote site;26 paced HTTPS checks pass for route HTML, the four store captures, the new website image, primary JS/CSS and the neural model/legacy redirect.

Six live browser cases pass: Home and Projects on desktop/mobile in ES/EN/CA. They verify the Client/Professional copy, the main public BuildApp link, separate Pro browser link, five-item gallery, all four new images and the Client lightbox with focus restored on Escape. Screenshots from the actual public site were opened and inspected. Only same-origin GET requests were allowed, with paced real responses and reuse of immutable public resources; no backend fixtures, messages, generation requests or authenticated accounts were used.

The existing IONOS destination was confirmed against the public HTML before changes. A private archive was created and verified before activation; all134 staged files were checked. Activation adds assets first and replaces the root and route HTML by rename. Existing hashed assets remain for open tabs. Activation and rollback were exercised locally; rollback remains available from the verified private archive. Routing configuration, the separate hosted project and the neural model retain their original hashes. No DNS, hosting configuration, GitHub or BuildApp changes were made. Operational access and backup locations remain private.

## GitHub publication request — 2026-10-24

Tony explicitly requests pushing all completed portfolio changes to the existing `TonyRod116/tony-r.com` repository. This batch records the unified BuildApp showcase and official images, the earlier published home/style polish and payout removal, tests, visual references and durable context. It excludes credentials, personal settings, generated builds, private release evidence and the temporary Beads writer lock. Remote publication and CI are verified against the resulting commit; the earlier no-push statements describe the IONOS publication phase before this request.
