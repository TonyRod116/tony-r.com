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

## 2026-09-30 — Portfolio-native tooling adaptation

Tony authorizes incorporating all recommended BuildApp/MTM improvements. Adapt static workflows and practical quality/continuity tools to the real src/api/server structure; retain one global model policy and one local memory registry. Native release, trading/live, credentials and automatic provider dispatch remain excluded.

Evidence that changed the decision: local skills were not discoverable, memory described a different chat route, and the baseline build loaded all routes in one JavaScript chunk. Preserve preexisting source/output and gate increases in documented quality debt. Sources, adoption matrix and final verification live in docs/ai/ and .agents/adoption-manifest.json. Bead: My Page-86.

Observed closure: 23 tooling tests, 24 routing cases, 52 browser journeys and six inspected/rechecked screenshots pass. The entry JS shrinks by 37%; emitted total JS grows slightly, so no overall transfer/latency or economic saving is claimed. Original user-source/output hashes match. The build-overlap run is excluded from evidence. Next product work is My Page-87.

## 2026-09-30 — Home as a showroom

Tony clarifies that My Page should show work, capability and product judgment. Work exploration should lead; recruiting/service copy is secondary. Strategic reasons for that direction are not public messaging. Marketing context is updated accordingly.

Explicitly authorized public addition: Tony's own Python trading bots are already generating income, as confirmed by him. Added only to the home biography in ES/EN/CA and checked in the local built UI. This is not independently audited performance; no returns, account details or promises were added.

Home audit evidence is in .artifacts/home-review/: desktop/mobile section captures, scroll-return and reduced-motion observations, and computed link colors. Findings: work appears late, the flagship uses a login screenshot, technology badges dominate, footer demo wording points to contact, parallax does not restore the photo on return, and some normal-size project links have insufficient contrast. Design changes remain proposals under My Page-87; the review did not redesign the site or publish it.

## 2026-09-30 — Home showroom implemented

Tony authorizes implementation and explicitly requests Sonnet 5.5 High design advice. First helper attempt fails without usable response; Tony explicitly authorizes a second, shorter attempt. The second attests exact claude-sonnet-5-5 through first-party Claude Max, requested high effort, read-only/no-tools and no fallback. Advice is based on supplied descriptions, not direct PNG inspection.

Accepted direction: warm paper/charcoal, Inter without serif, hairlines, one dominant real BuildApp case, smaller project rows and compact experiments. Rejected unconfirmed own-capital claims and unnecessary financial disclaimer copy. Principal darkens the proposed accent for contrast, writes the three-language copy and checks actual captures.

Implemented source/UX: compact static portrait from the existing unmarked photo, work-first actions, explicit attribution with CTO, confirmed Python-bot income statement without invented figures, no counters/pill wall/glow cards/fake charts, compact homepage header/footer, keyboard-operable language disclosure and document lang. Other routes retain their existing layout. Verification and preserved-work evidence: docs/ai/home-showroom-20260930.json; screenshots: .artifacts/home-redesign-preview.

Home navigation follow-up: Tony explicitly prioritizes AI as a core capability. Keep Projects, AI Lab, About and Contact in the homepage header, including the mobile menu; render AI as a plain link without decorative particles. Solutions remains a translated secondary link in the homepage footer. This supersedes the initial three-link header simplification.

Follow-up proof: isolated build and quality checks pass; all 18 home browser scenarios pass, including both navigation destinations and mobile menu closure. Inspected desktop/mobile/tablet captures show no horizontal overflow. Six route visual comparisons pass; only the desktop home reference changes when explicitly refreshed. Captures: .artifacts/home-navigation-preview.

## 2026-09-30 — AI lab and six experiments

Tony authorizes redesigning /ai and every AI subpage, with functional fixes to the neural visualization and T-Tris. Adopt a shared laboratory layout and code-native vector graphics, with scoped charcoal/paper/lime tokens, plain navigation and ES/EN/CA copy. Neural stays on the site; trained weights are local, attributed and validated. No untrained fallback or simulated performance sliders. Preserve Magic T, ghost, music and records while sharing T-Tris rules between human play and reachable AI search.

Evidence changing the implementation: the five-block T preview lost all cells; offset conversions disagreed between play/search. The prior neural React implementation could infer with random weights after a failed download, and drawing coordinates/touch state were inconsistent. Delay cancellation, touch flags, the true Nim last-piece-loses rule and a source-backed actor sample complete the neighboring demos. Final proof: docs/ai/lab-redesign-20260930.md and JSON; captures: .artifacts/ai-lab-preview. User source outside the requested AI scope is preserved; no deployment, remote AI execution or independent model review occurs in this task.

## 2026-09-30 — Remaining showroom pages

Tony approves the implemented AI lab and explicitly authorizes completing the remaining site pages. Apply the approved home palette and typography to About/Projects/CV/Contact/Solutions and three demos, with a shared shell and distinct compositions. Keep AI's lab identity and make AI visible in the primary header everywhere.

Preserve all project cases, original PDFs/certificates and 24 gallery images; serving the images locally removes a runtime external dependency. Inspection falsifies old gallery captions, so descriptions follow visible scenes without inferred locations. Native dialogs, pointer/keyboard comparison, selected locale, cancellation/reset guards and private-data log removal support real use. No fictitious metrics/progress or timing promises. Backend ownership remains unchanged.

Full browser proof passes 140 journeys; code/tooling proof passes38 tests plus24 routing cases. Final visual/capture results are in site-showroom-20260930.json. Sonnet5.5High design attempt is authenticated first-party Max but fails without usable output/attestation; no retry/fallback or independent approval is claimed. Bead My Page-88 is closed after all24 visual comparisons pass. No deployment or messaging authority is inferred.
