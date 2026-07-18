# FINAL REPORT, Saffron and Rice website

Persian and Middle Eastern kitchen, 3801 Pacific Coast Hwy, Torrance, CA 90505, (310) 504-0310.
Autonomous award-grade build. This report is written as the council closes; the live URL and the
final round-4 lens scores are filled in at the deploy step below.

## Live URL

**https://luxologygg.github.io/Saffron/** (note the capital S)

The site is LIVE and publicly serving. The owner enabled GitHub Pages (Settings, Pages, Source:
"GitHub Actions"), the committed workflow `.github/workflows/deploy-pages.yml` ran to `success`, and
the published URL returns HTTP 200 with the correct document title. Live verification (below)
confirms all six pages render clean at desktop and mobile with zero console errors.

The build is authored for a domain-root deploy, so the workflow adapts the 404 page for the
`/Saffron/` project subpath; every other page uses relative URLs and resolves unchanged. A future
domain-root host (e.g. a Vercel Git import of `LuxologyGG/Saffron`, Framework Preset "Other", empty
build command, output `.`) would serve the identical build with no adaptation needed.

## Final per-lens scores (round 4, the gate: PASS)

| Lens | R1 | R2 | R3 | R4 (gate) |
|---|---|---|---|---|
| Motion | 7.3 | 8.5 | 9.6 | 9.6 |
| Code / Perf | 6.5 | 8.3 | 9.5 | 9.6 |
| Brand | 7.2 | 8.3 | 8.9 | 9.6 |
| Accessibility | 6.8 | 7.5 | 7.7 | 9.5 |
| Visual | 7.2 | 7.9 | 8.8 | 9.5 |
| Benchmark | 6.2 | 7.6 | 8.8 | 9.6 |
| **Overall** | **6.87** | **8.02** | **8.88** | **9.57 PASS** |

## Deploy status (honest)

**LIVE via GitHub Pages.** The site publishes automatically from `.github/workflows/deploy-pages.yml`
on every push to the branch. The one step this autonomous session could not perform was the initial
Pages enablement toggle (the Actions token returns `Create Pages site failed: Resource not accessible
by integration`, the documented GitHub gotcha); the owner flipped Settings, Pages, Source: "GitHub
Actions", after which the workflow ran to `success` and the URL went live. Everything else in the
publish path is automated: no further owner action is needed for future pushes.

Deploy paths that were evaluated before Pages went live:

- **Vercel MCP (`deploy_to_vercel`):** authenticated and a correct target, but it takes the file tree
  inline and the site is about 5 MB (mostly self-hosted fonts and photography); that payload cannot be
  emitted in a single tool call. Still available as a domain-root alternative via one-click Git import.
- **Vercel / Netlify / Surge / Cloudflare CLIs:** present or installable, but no deploy token is
  available in this environment and their auth is interactive.
- **Google Cloud Storage:** gcloud is not installed and the injected Cloud token is a proxy
  placeholder (rejected as invalid), so this path was unavailable.

GitHub Pages became the live host once the owner supplied the one-time Settings toggle.

Gate rule: PASS requires every lens at 9.5 or higher, zero CRITICAL and zero MAJOR open, every
fix reviewer-verified by an agent other than the one that wrote it, and a minimum of three rounds.

## Round history

- **Round 1, baseline (6.87).** Honest starting grade: 0 critical, 15 major, 17 minor. Themes:
  the on-teal color scope held both AA contrast failures, the long scroll was under-photographed
  (two lenses converged on this independently), a registered-but-never-shipped pattern across
  easing/CSS/ornaments, and a half-built menu transliteration system.
- **Round 2 (8.02, +1.15).** The under-photographed scroll was resolved (environmental home hero,
  kabab-chapter grill photography, about day-to-night photo, catering imagery), the transliteration
  system completed across all six menu chapters, the loader reworked from 4s to about 2s with a
  family mission line and a skip control, and a peopled sofreh photograph added a human heartbeat.
  The independent verifier caught two regressions (empty JS-off footer, nav divergence) which were
  fixed before the round closed.
- **Round 3 (8.88, +0.86).** Motion (9.6) and Code/Perf (9.5) cleared the 9.5 bar. Four lenses
  independently located one defect from four angles: the about day-to-night hero clipped its story
  steps and double-printed the scroll cue at laptop viewport heights. Root cause: a head-column
  width cap wrapping the title tall enough to overflow the fixed-height stage.
- **Round 4, the gate (9.57, PASS).** All six lenses cleared 9.5, zero critical and zero major
  open. The one defect that four lenses had independently located in round 3 (the about day-to-night
  hero clipping its story steps) was structurally recomposed and re-verified. Round-4 surfaced and
  closed a handful of genuine finds: the flagship dusk title collapsing into a four-line tower at
  wide desktops (the width cap resolved against the wrong font box), a dimmed accent word dropping
  below AA at the day-to-night crossover, a factual HUD value that could scramble mid-reveal, the
  overlay focus trap wrapping through the body, plus image-budget and orphan-file cleanup. Each fix
  was measured locally, then independently re-verified by the owning lens against live behavior. Two
  MINOR polish items were deferred with written reason (a non-interactive body focus stop at the Tab
  wrap, and the crossover contrast floor sitting 0.008 above the AA line). Every lens ran as an
  isolated remote agent, blind to the others.

## Decisions made under the autonomy contract

1. **Egress proxy vs Chromium.** The environment proxy reset Chromium's native TLS on every host.
   Built `tools/capture.py` to route all browser requests through Playwright's request API over the
   proxy, TLS verification intact. Every screenshot in the build depended on this.
2. **Dizzy price ASSUMED at 25.99.** Illegible on the printed menu, absent from the live Grubhub
   menu, DoorDash and Uber Eats bot-walled. Set to the lamb shank tier and flagged in
   DELIVERY-NOTES.md item 1. data.js marks it priceAssumed.
3. **Hours: Daily 11 AM to 8 PM.** Four concurring sources (Grubhub live schedule, Instagram bio,
   Restaurant Guru mirror of Google), none a first-party Google Business Profile. Shown with a
   call-to-confirm softener. DELIVERY-NOTES.md item 2.
4. **Venue naming.** Public listings split between "Saffron Food Mart" and "South Bay Food Hall";
   no listing yet uses "Saffron and Rice". The site uses the ground-truth brand only.
   DELIVERY-NOTES.md item 3.
5. **Order links.** Only the verified live Grubhub store is linked; unverifiable bot-walled
   platform listings were not shown as potentially dead links.
6. **Brand finding BR-2 overruled.** The council's brand lens flagged the lamb shank description
   "New Zealand, grass-fed, halal." as an invented sourcing claim. Overruled: it is verbatim from
   the authoritative printed menu, so it is a sourced claim. A provenance comment was added to
   data.js and the independent verifier confirmed the text stayed intact.
7. **Higgsfield hero video declined on cost.** The skill mandates a Higgsfield cinemagraph hero but
   requires a balance check first. The account held 2 free-plan credits; a clip runs about 6. No
   generation was attempted, no credits spent; the heroes use cinematic motion on real stills
   (canvas saffron-thread drift, slow zooms). Top-up path in DELIVERY-NOTES.md item 8.
8. **404.html root-relative URLs.** The one sanctioned exception to the relative-URL rule: a
   nested-path 404 cannot resolve path-relative assets, so 404.html deploys root-relative and
   app.js honors an html[data-root] hook so its runtime-built links match.
9. **Remote review fleet.** After the local box (4 cores, 2-agent concurrency) and repeated
   session-limit stalls slowed the council, rounds 3 and 4 ran their six lenses as isolated remote
   cloud agents in parallel, each blind to the others.

## Owner confirmation flags (from DELIVERY-NOTES.md)

- Dizzy price assumed at 25.99 (one-line swap in data.js if the owner confirms otherwise).
- Hours well-supported but not first-party GBP confirmed.
- Venue naming across delivery listings does not yet match the brand.
- Second phone number (310) 504-0102 circulates on directory listings; not shown.
- Dishes shown with representative licensed photography; every slot swaps in one line in data.js.

## Photography one-line swap table (from research/photos/PHOTO-MAP.md)

Every image is self-hosted and referenced by a stable slug in `assets/js/data.js` under
`window.SITE.images`. To replace any stand-in with a real photo of the business, drop the file in
`assets/img/` and change the one filename on that slug. Real business photos in
`research/business/assets/` take precedence at integration.

| Slug | Current file | Swap by |
|---|---|---|
| home-hero | home-hero.jpg | replace file, keep slug |
| home-story | home-story.jpg | replace file, keep slug |
| home-menu-teaser | home-menu-teaser.jpg | replace file, keep slug |
| menu-hero | menu-hero.jpg | replace file, keep slug |
| menu-appetizers / menu-kabab / menu-stew / menu-rice | matching files | replace file, keep slug |
| catering-hero / catering-platters | matching files | replace file, keep slug |
| about-hero / about-kitchen | matching files | replace file, keep slug |
| contact-hero | contact-hero.jpg | replace with a real storefront shot |
| kitchen-people | kitchen-people.jpg | replace with a real staff/service photo |
| texture-1 / texture-2 | matching files | replace file, keep slug |

## Live verification

The **live public URL** `https://luxologygg.github.io/Saffron/` was verified with a proxy-routed
Playwright harness (`tools/verify_live_routed.py`, which routes browser requests through the egress
proxy the same way `tools/capture.py` does, since Chromium's native TLS is reset by the proxy).
Result: **all six pages, at desktop 1440 and mobile 390, load from the live host with zero console
errors, zero page errors, and zero external runtime requests.** Full-page screenshots captured from
the live URL at both widths are in `verification/`. The 404 page was confirmed to render correctly at
the `/Saffron/` subpath, proving the workflow's path adaptation. The live index was visually confirmed
(environmental hero, chapter scroll, pull-quote, footer). Re-run any time with
`python3 tools/verify_live_routed.py https://luxologygg.github.io/Saffron`.

## What ships

Six pages (index, menu, catering, about, contact, 404), zero build step, every vendor script and
font self-hosted under `assets/`, relative URLs throughout, `.nojekyll`, `sitemap.xml`,
`robots.txt`, LocalBusiness (Restaurant) JSON-LD with the exact verified NAP on all five indexable
pages. The full menu renders from `data.js` with exact prices, vegetarian second prices on stews,
the verbatim halal claims, and the required disclaimer. No em dashes anywhere. AA contrast, a
working skip link, focus-trapped mobile menu, 44px tap targets, and reduced-motion fallbacks on
every effect.
