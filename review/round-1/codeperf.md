# Round 1 — Code & Perf Lens (CP)

**Score: 7.0 / 10**

The engineering hygiene is genuinely strong: zero external runtime requests, a completely
silent console (not even `log` noise) across 24 page/viewport/motion combos, zero 4xx on any
load, every referenced asset present on disk, all-relative URLs, flawless data.js -> DOM
integrity, valid JSON-LD with exact NAP on all five indexable pages, and a flat 60fps scroll
on the two heaviest pages. What keeps the score at 7: menu.html breaches the ~3.5MB first-load
budget, and there is ~2.2MB of orphaned brand assets tracked at the repo root, an unsubset
208KB Arabic font on every page, two half-megabyte PNG maps, and a 166KB traced SVG wordmark —
real, cheap perf headroom left on the table, plus a small block of dead CSS utilities.

## Findings

| ID | Severity | Location | Finding | Fix |
|----|----------|----------|---------|-----|
| CP-1 | MAJOR | menu.html (full-page load; images referenced from assets/js/page-menu.js BANDS + menu.html strip/CTA) | First-load transfer is **3.58MB**, over the ~3.5MB budget. Offenders measured: catering-platters.jpg 700,849B; home-hero.jpg 496,255B (CTA band, menu.html:177); menu-hero.jpg 431,877B; menu-stew.jpg 340,417B; menu-kabab.jpg 320,093B; menu-appetizers.jpg 273,788B; menu-rice.jpg 220,391B; gulzar font 208,800B. | Re-encode the seven food JPEGs with mozjpeg q70–75 at max 1600px long edge (current files are 1800px, 220–700KB; target 130–250KB each, ~1.2–1.4MB saved -> menu.html lands ~2.3MB). Optionally `<picture>` + WebP for another ~30%. |
| CP-2 | MINOR | assets/fonts/gulzar-arabic-400-normal.woff2 (208,800B), loaded by assets/css/fonts.css on all 6 pages | The full Gulzar Arabic face ships to render ~17 short decorative Persian strings (`.script-fa` spans, all `aria-hidden`). Largest single font, ~23% of 404.html's total payload. | Subset with `pyftsubset --flavor=woff2 --text-file=<all fa strings from data.js/html>`; expected 10–20KB, saves ~190KB on every page's first load. |
| CP-3 | MINOR | assets/img/brand/logo-text.svg (166,725B); fetched in assets/js/app.js:437 (loader wordmark) and used via app.css:611 | Traced wordmark SVG carries absolute-coordinate path data at 2-decimal precision (166KB raw). Loaded on every first-visit page load. Brotli on Vercel softens the wire cost, but local/raw serving pays full price and the DOM still parses ~166KB of path data. | Run SVGO (`--precision=1`, collapse to relative commands); expect 50–70% reduction with no visual change at rendered sizes. |
| CP-4 | MINOR | Repo root: Saffronlogobg.png (1,289,092B), saffronlogonobg.png (789,103B), saffron_rice_text_only_high_quality.svg (166,725B) — all `git ls-files` tracked | ~2.2MB of orphaned brand source files at the deploy root, referenced by nothing (grep across all html/css/js: zero hits). The SVG is byte-identical (`cmp`) to assets/img/brand/logo-text.svg. They will be uploaded and publicly fetchable on deploy. | Delete from the deploy tree (or move under research/business/assets/ which already holds provenance files). Removes duplicate + dead weight from the artifact. |
| CP-5 | MINOR | assets/img/map-area.png (583,964B), assets/img/map-local.png (460,901B); contact.html | Two photographic-style 768×768 map images stored as PNG cost 1.03MB of contact.html's 2.27MB. PNG is the wrong codec for this content. | Re-encode as JPEG q80 or WebP (~80–120KB each at 768px); saves ~0.85MB on contact.html. |
| CP-6 | MINOR | assets/css/tokens.css:212 (`.display`), :239 (`.h3`), :249–258 (`.grid`, `.flex`, `.between`, `.items-end`, `.cols-2/3/4`, `.keep-2`); assets/css/app.css:671 (`.split-mask`), :281 (`.button-070.is-ink`) | Dead CSS: utility classes defined but used by no shipped markup or JS-generated markup (verified by extracting every `class="…"`/`classList` token from all html+js). `.is-ink` is documented as a future variant; the rest look like scaffold leftovers. | Delete the unused utilities, or add a one-line comment marking the block as an intentional reserved utility API so future reviewers don't re-flag it. |

No CRITICAL findings. No MAJOR beyond CP-1.

## Checks run (with evidence)

1. **External-request audit** — Playwright `request` event instrumentation on all 6 pages ×
   {1440×900, 390×844} × {no-preference, reduce} = 24 fresh-context loads, each with a 3.5s
   settle, keyboard `End`/`Home`, and 12 `PageDown` steps (lenis-safe, per the known-artifact
   note). Result: **0 requests to any non-localhost origin** in ~700 captured requests.
   Outbound link hrefs (Grubhub, Instagram, Google Maps) and canonical/OG absolute URLs exist
   but are never fetched.
2. **Console / pageerror audit** — same 24 runs collected `console` and `pageerror` events.
   Result: **zero messages of any type** (not even `log`) and zero page errors, normal and
   reduced-motion, during full scrolls at both widths.
3. **HTTP status audit** — every response status recorded across all 24 loads: **zero >= 400**.
4. **Asset-existence audit (offline-equivalent)** — regex-extracted 246 `src`/`href`/`url()`/JS
   string asset refs across all html+css+js, resolved per-file base, `stat`ed each. All real
   references exist on disk; apparent misses were data-bind placeholders, JS concatenation
   fragments, and one `url()`-shaped string inside an app.css documentation comment (verified
   comment context at app.css:8–14). Combined with check 3: **no 404-able asset**.
5. **Relative-URL audit** — same extraction: **zero leading-slash URLs** in html, css, or
   JS-injected markup (app.js templates use `assets/…`, verified app.js:169, :437). Subpath
   deploy safe.
6. **Payload measurement** — fresh-context first load + scroll-to-bottom per page, summing
   response body bytes: index 2.02MB, **menu 3.58MB**, catering 2.93MB, contact 2.27MB,
   about 1.68MB, 404 0.90MB. Top offenders logged per page (see CP-1/CP-5).
7. **Frame-rate sampling** — 300-frame rAF sampler during a 5s scripted full-page scroll:
   index avg 59.6fps (p95 frame 16.8ms, 1/299 frames >20ms, final scrollY 7195); menu avg
   59.4fps (p95 16.8ms, 3/299 frames >20ms, final scrollY 14966). **No sustained sub-50fps.**
8. **data.js integrity** — rendered `.mrow` counts per section vs `window.SITE`:
   appetizers 14/14, kababs 12/12, stews 8/8, rice 3/3, sandwiches 7/7, platters 6/6.
   Every item name, price, and veg price string present in DOM text (0 misses). Dual-price
   stews render both ("meat $18.99 / vegetarian $15.99" pattern, 6 dual rows); whole-dollar
   platters render "$199/$319/$449" without .00; priceLabel rows render verbatim dollarized
   ("Large $13.99 / Small $7.99", "$2.99 each").
9. **JSON-LD validation** — parsed every `application/ld+json` block via JSON.parse on all 6
   pages: 5/5 indexable pages have one valid `Restaurant` block with exact NAP —
   name "Saffron & Rice", streetAddress "3801 Pacific Coast Hwy", Torrance CA 90505,
   telephone "+13105040310" — plus servesCuisine, priceRange, openingHoursSpecification
   (11:00–20:00 all seven days, matching data.js hours). 404.html has none and is
   `noindex, nofollow` (correct).
10. **Lean-source scan** — grep for `console.*` calls in page JS (0), TODO/FIXME/XXX/HACK (0),
    commented-out markup/JS/CSS rules (0); vendor usage check: all 7 vendor files
    (gsap, ScrollTrigger, SplitText, ScrambleText, DrawSVG, CustomEase, lenis) are referenced
    by every page and used in page JS — no unused vendor. Dead-class extraction (all class
    tokens from html + JS-built markup vs all CSS class selectors) produced CP-6. Orphan-file
    scan produced CP-4 (git-tracked, zero references, one byte-identical duplicate).
11. **Visual sanity from captures** — read review/round-1/capture/index and /menu desktop
    viewport + scroll screenshots; loader, menu hero film strip, sticky carta index, and
    section bands all render finished.

## Notes

- The clean console includes the reduced-motion runs, and reduced-motion loads skip Lenis and
  the loader cleanly (loader removal path at app.js runLoader; verified silent + finished).
- Payload numbers are raw bytes from a local server (no compression). Vercel's brotli will
  shrink JS/CSS/SVG on the wire but not the JPEG/PNG/woff2 findings above, which are ~90% of
  the weight.
- FPS was sampled with the site's own scroll path (lenis fallback to smooth scrollTo);
  scrollY telemetry confirms the page actually traversed full height during sampling.
