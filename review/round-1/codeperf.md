# Round 1 — Code & Perf Lens (CP)

**Score: 6.5 / 10**

The runtime engineering is genuinely strong: zero external requests, a completely
silent console across 24 page/viewport/motion combos, locked 60fps scroll on the two
heaviest pages, perfect data.js-to-DOM integrity (all 50 dishes, exact prices, dual
stew prices), and valid, NAP-exact JSON-LD on all five content pages. What holds the
score down: the no-JS render is structurally incomplete (the menu page loses its
entire dish list, NAP binds render empty), and 404.html's relative asset URLs break
for any nested missing path on the declared deploy target. Plus a handful of lean-source
and payload polish items.

## Findings

| ID | Severity | Location | Finding | Fix |
|----|----------|----------|---------|-----|
| CP-1 | MAJOR | `menu.html` `[data-menu-root]`; `index.html` `[data-bind]`/`[data-bind-href]`; `assets/js/app.js` `renderFooter()`; `assets/js/page-menu.js` `renderMenu()` | No-JS render is structurally incomplete. With JS disabled, menu.html renders ZERO of the 50 dishes (whole carta is injected by `page-menu.js`), the footer is an empty black band on every page (`renderFooter` builds it at runtime), the disclaimer section shows a bare "PLEASE NOTE" label, index's Visit section shows an address of just "," and empty hours, and every `data-bind-href` anchor (nav "Call us", hero call CTA, "Order online", "Directions") has NO href so it is not a link at all. This contradicts app.css's own claim (line 42: "a no-JS visit sees the whole page") — the reveal system does rest final, but the data layer does not. Verified with `java_script_enabled=False` screenshots (menu body text 507 chars vs thousands with JS). | Prerender the factual strings into the static HTML (address, hours, phone, tagline, disclaimer, real `href` values on the currently bind-only anchors) and let `bindData()` overwrite them; that also fixes non-Google crawlers. For menu.html add at minimum a `<noscript>` block with the phone number, Grubhub link, and a one-line "call for the full menu" note — or prerender the `.mlist` markup statically since data.js is the build's single source of truth anyway. |
| CP-2 | MAJOR | `404.html` lines 11–22, 102–110 (all `link`/`script`/`img` relative URLs) | 404.html references every asset relatively (`assets/css/...`). GitHub Pages and Vercel serve 404.html for nested missing URLs while preserving the path, so `/old/menu/` resolves stylesheets to `/old/assets/css/...` → all 404. The error page renders completely unstyled with no JS exactly when a lost visitor hits it. Top-level misses (`/menu`) happen to work, which hides the bug in casual testing. | In 404.html only, switch asset URLs and internal links to root-relative (`/assets/...`, `/index.html`) — the canonical/sitemap already commit to a domain-root deploy (`saffron-and-rice.vercel.app`), so the subpath-deploy argument doesn't apply to this page; alternatively inline the critical CSS and a tiny script into 404.html so it is self-contained at any depth. |
| CP-3 | MINOR | `assets/img/` (catering-platters.jpg 684KB, catering-hero.jpg 551KB, home-hero.jpg 485KB, home-menu-teaser.jpg 468KB, map-area.png 570KB, map-local.png 450KB) | Full-scroll transfer: menu.html 3.75MB, catering.html 3.07MB, contact.html 2.38MB. First paint is fine (menu first-load without scroll is 0.55MB — lazy loading works), so the ~3.5MB first-load threshold is not breached, but the photography is 1.5–2x its needed weight for its rendered sizes. | Re-encode the six offenders with mozjpeg q72–78 (or add WebP via `<picture>`): target ≤280KB for the 1800px heroes, ≤200KB for the maps (PNG→JPEG/WebP; they are photos, not line art). Saves ~1.5MB on menu.html's total. |
| CP-4 | MINOR | `assets/img/brand/logo-text.svg` (163KB), fetched in `assets/js/app.js` `buildLoader()` line 437 | The loader wordmark SVG is 163KB — traced letterform outlines at excessive path precision — fetched on every first visit for ~1s of on-screen time. Brand PNGs are also heavier than needed (logo-lockup.png 102KB for a 692×484 footer seal, emblem.png 78KB). | Run logo-text.svg through svgo with 1-decimal precision (expect <40KB); re-export the lockup/emblem PNGs at display size or as WebP (~30–40KB each). |
| CP-5 | MINOR | `assets/css/tokens.css` lines 212, 239, 249–258 (`.display`, `.h3`, `.grid`, `.cols-2/3/4`, `.flex`, `.between`, `.items-end`, `.keep-2`); `assets/css/app.css` line 671 (`.split-mask`), line 281 (`.button-070.is-ink`) | Dead CSS: 11 utility classes defined and never used in any HTML or JS (verified by cross-referencing all class attributes and JS-generated markup). `.split-mask` is a leftover from a pre-SplitText-mask approach (the runtime uses `.sl` line masks). `.is-ink` is documented as a future variant. | Delete the unused utilities and `.split-mask`; keep `.is-ink` only if the existing comment stands as an intentional reserved variant — the rest should go. |
| CP-6 | MINOR | `assets/js/app.js` `runLoader()` lines 466–477 + `buildLoader()` fetch `.then` lines 437–451 | Race: `setTimeout(go, 180)` starts the loader timeline if the wordmark fetch hasn't landed in 180ms, but the fetch's `.then` still injects the SVG and adds `loader--marked` whenever it resolves — mid-timeline on a slow host. CSS (`.loader--marked .loader__word`, app.css line 618) then sr-only's the word while it is animating, and the fully-inked SVG pops in with no draw-on: a visible mid-loader swap. | In the fetch `.then`, bail out if the timeline already started (expose the `started` flag on the loader element and check it) so a late SVG never swaps in mid-animation. |
| CP-7 | MINOR | Repo/deploy root: `Saffronlogobg.png` (1.26MB), `saffronlogonobg.png` (771KB), `saffron_rice_text_only_high_quality.svg` (163KB); `research/` (92MB, partially git-tracked) | 2.2MB of unreferenced logo source files sit at the site root (zero references from any html/css/js) and will be deployed and publicly fetchable; `research/` (menu scans, reference-site dumps) is partially tracked and would ship on a naive root deploy. | Delete or move the three root files into `research/`; add `research/` to the deploy ignore (`.vercelignore`) or exclude it from the published branch. |

## Checks run (with evidence)

1. **Zero external runtime requests** — Playwright `request` events instrumented on all
   6 pages × {1440×900, 390×844} × {no-preference, reduce} = 24 fresh contexts, each
   including a full keyboard-End + `lenis.scrollTo` scroll. Non-localhost requests
   captured: **0** in all 24 runs (`cp_main_results.json` in the CP scratchpad).
   External `href`s in markup (Grubhub, Instagram, Google Maps, schema.org context)
   are link-outs only, never loaded.
2. **Silent console** — `console` + `pageerror` + `requestfailed` collected in the same
   24 runs. Warnings: 0. Errors: 0. Page errors: 0. Failed requests: 0.
3. **Asset existence / offline-equivalence** — parsed 238 `src`/`href`/`url()`/JS-string
   asset references across all html+css+js; every non-bind reference stats on disk
   (the only non-resolving matches are `data-bind-href` dot-paths, confirmed to be
   binding attributes, e.g. 404.html:60). No 404s observed in any network capture.
4. **Relative URLs** — grep for `src="/`, `href="/`, `url(/` and JS leading-slash paths:
   zero hits. (The flip side became CP-2: 404.html is the one page that *needs*
   root-relative.) Canonical/og/sitemap absolutes are correct usage.
5. **Payload** — response-body byte totals per page: index 2.12MB, menu 3.75MB,
   catering 3.07MB, about 1.76MB, contact 2.38MB, 404 0.95MB (full scroll, all lazy
   images fetched); no-scroll first load: menu 0.55MB, catering 0.86MB, index 0.70MB.
   Biggest offenders listed in CP-3/CP-4.
6. **Frame rate** — rAF frame-time sampling during a 6s Lenis-driven full-page scroll
   at 1440×900: index avg 59.8fps (per-second buckets 60/61/60/60/59/61, max frame
   33.3ms, 1 frame >20ms of 388); menu avg 59.4fps (buckets 60/61/61/60/60/57, max
   frame 33.4ms, 4 frames >20ms of 385). No sustained sub-50fps anywhere.
7. **data.js integrity** — DOM counts on menu.html: appetizers 14, kababs 12, stews 8,
   rice 3, sandwiches 7, platters 6 (all match spec); all 50 `.mrow` items visible at
   rest (0 hidden at opacity<0.5). Name, price, and description compared
   programmatically against an evaluated copy of data.js: exact match for all 50
   (the only diffs were textContent whitespace collapse in the dual-price spans).
   All 6 veg-priced stews show both prices; `priceLabel` items dollarize correctly
   (Olovieh "Large $13.99 / Small $7.99", Kotlet "$2.99 each"); wholePrice platters
   render $199/$319/$449; home.js teaser cards/stats use the same records.
8. **JSON-LD** — parsed `application/ld+json` on all 6 pages: 5 valid Restaurant
   blocks; name "Saffron & Rice", streetAddress "3801 Pacific Coast Hwy", Torrance /
   CA / 90505, telephone "+13105040310" exact on all five; hours 11:00–20:00 all
   seven days matches data.js; menu.html adds a hasMenu with all 6 sections;
   contact.html adds geo + hasMap. 404.html has none — acceptable, it is
   `noindex, nofollow`.
9. **Lean source** — grep for `console.log/debug/info`, TODO/FIXME/XXX/HACK: zero in
   page JS/CSS/HTML. Comment-scan for commented-out code blocks (declarations inside
   comments): zero. All 7 vendor files verified used (gsap core; ScrollTrigger,
   CustomEase, SplitText, ScrambleText, DrawSVG registered and invoked in app.js;
   Lenis in initLenis). Dead CSS findings in CP-5.
10. **Reduced-motion rest state** — with `reduced_motion=reduce`, after a full scroll
    on index: zero `[data-reveal]`/`[data-scramble]`/`[data-draw]` elements resting
    at opacity<0.5 or hidden. Full read of app.js confirms every effect system gates
    on `reduce` and rests final (counters pre-set final value; canvas draws one
    static frame).
11. **No-JS render** — `java_script_enabled=False` loads of index and menu with
    screenshots (`cp_nojs_index_bottom.png`, `cp_nojs_menu_bottom.png`): produced CP-1.
12. **Source audit** — full read of app.js (865 lines), page-menu.js, home.js, data.js,
    index.html; head watchdog, bfcache `pageshow` handling, sessionStorage try/catch,
    inert management, and fail-soft boot are all correctly implemented.

## Notes

- The known Lenis snap-back testing artifact was avoided: scrolls were driven via
  keyboard End/Home and `lenis.scrollTo`; `window.scrollY` confirmed real travel
  (7195px index, 14966px menu). No scroll bugs filed.
- First-visit loader ran in every fresh context (sessionStorage-gated) and completed
  without console noise in all 24 runs.
- Score rationale: engine and data layers are already at award grade (checks 1–2, 6–8
  are clean sweeps); the two MAJORs are structural completeness gaps, not runtime
  defects, and both have cheap fixes.
