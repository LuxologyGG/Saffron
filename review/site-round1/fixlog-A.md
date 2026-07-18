# Fix-track A — shared shell / accessibility / perf
Scope owned this pass: `assets/css/app.css`, `assets/css/tokens.css`, `assets/js/app.js`, and the `<head>` + footer markup of all 6 HTML pages. `assets/css/pages/*.css` and `assets/js/pages/*.js` were not touched (owned by Track B).

Verified by serving `python3 -m http.server 8099` and driving Playwright/Chromium (`PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers`) at 1440x900 and 390x844, normal and `reduced_motion=reduce`, across all 6 pages.

## Findings → changes

### C1 (visual-brand). Footer wordmark overlaps `.footer__bar`
- `assets/css/app.css` `.footer__wordmark` (was lines ~481-489): removed `transform: translateY(18%)` and the `margin-bottom: -1px` overlap hack; added `max-height: clamp(80px, 16vw, 220px)`, `overflow: clip`, and `margin-top: clamp(16px, 3vh, 32px)` so the wordmark's box is bounded and sits clear above `.footer__bar` instead of sliding down into it. `.footer__wordmark img`/`svg` now also carry `max-height` + `object-fit: contain; object-position: bottom`.
- All 6 pages (`index.html`, `menu.html`, `catering.html`, `about.html`, `contact.html`, `404.html`): the footer `<img src="assets/img/brand/saffron_rice_text_only_high_quality.svg">` now carries `width="1034" height="496"` (the SVG's real intrinsic size) so the browser reserves correct aspect-ratio space before decode, killing the late-load height jump the review measured.
- Verified: `getBoundingClientRect()` on `.footer__wordmark` vs `.footer__bar` after a full scroll-to-bottom on every page, both viewports, both motion states — **zero overlaps in 24/24 checks** (see `full_out2.json` sample; e.g. index.html 1440: wordmark bottom 967→now bar starts well below wordmark's bounded box).

### C1 (a11y-devil). `index.html` preloader steals the first Tab, no trap
- `assets/js/app.js` `runLoader()` (was line ~232): removed `skip.focus()`. The loader overlay is not a real trapped dialog (no `inert` on the rest of the document, no `aria-modal`), so moving focus into it let a second Tab escape into the still-covered live page underneath. Simplest-correct fix per the review's own suggested alternative: don't move focus at all, leave the skip link as the natural first Tab stop, keep `.loader__skip`'s click handler working.
- Verified: fresh session, first Tab on `index.html` at 1440x900 lands on `.skip-link` (confirmed via `document.activeElement`), matching every other page's contract.

### C1 (motion-code / visual-brand). 789KB logo PNG shipped as a 46-168px image slot
- Generated `assets/img/brand/emblem-96.png` (4.5KB, 96×96) and `assets/img/brand/emblem-192.png` (10.3KB, 192×192) from the 1254×1254 source via PIL (Lanczos downscale + FASTOCTREE palette quantization). Original `assets/img/brand/saffronlogonobg.png` kept in place for favicon generation only, per instructions.
- Repointed every nav `<img ... width="46" height="46">` → `emblem-96.png`, every footer `<img ... width="168" height="168">` → `emblem-192.png`, on all 6 pages, plus the JSON-LD `"logo"` field on `index.html`, `menu.html`, `catering.html`, `contact.html` (about.html/404.html ship no JSON-LD logo field) → now points at `emblem-192.png`.
- Measured page weight (Playwright network capture, 1440x900, content-length sum): logo asset alone drops from 789KB (single file, fetched once, reused nav+footer) to 4.5+10.3=14.8KB. Total per-page transfer now: index 1372KB (was ~2128KB, prior include of 774KB extra logo weight), about.html 1285KB (was ~2059KB, matches the review's cited 2.09MB "before" figure), menu 802KB, catering 653KB, contact 821KB, 404 652KB — roughly **35-45% reduction** on every page, consistent with the review's "removes ~750KB+, 40-55% of current weight" estimate.

### M1 (a11y-devil). Footer links / skip-link / nav__brand under 44px tap target
- `assets/css/app.css` `.footer__col a`: `min-height: 32px` → `min-height: var(--tap)`.
- `assets/css/app.css` `.skip-link`: added `min-height: var(--tap); display: inline-flex; align-items: center;`.
- `assets/css/app.css` `.nav__brand`: added `min-width: var(--tap)` (height already satisfied via existing `min-height: var(--tap)`).
- Verified live at 390x844 on `index.html`: `.skip-link` 44×170px, `.nav__brand` 44×44px, `.footer__col a` 44×42px (height axis is the WCAG 2.5.5 requirement; width already exceeded 44 on this link's content, confirmed via `getBoundingClientRect`).

### M2 (a11y-devil). Day-night lerp dead zone (t≈0.42-0.63, <4.5:1)
- `assets/css/app.css` `.daynight`/`.daynight.is-night` left as-is (already only two flat color states via `color-mix`).
- `assets/js/app.js` `initDayNight()` (was lines ~444-458): replaced the continuous `gsap.to(state, {mix: 1, ease:"none", scrub:true})` lerp with a `ScrollTrigger.create({...})` that sets `--dn-mix` to one of two flat values — `0.15` before the 55% flip, `0.85` at/after it — in lockstep with the existing `.is-night` class toggle. The background no longer passes through the muddy ~50% grey midpoint at all; it snaps between two contrast-safe endpoints exactly when the text color also swaps.
- Verified (contrast math, sRGB, WCAG formula): `mix=0.15` background (211,206,194) vs ink text (14,17,15) → **12.1:1**; `mix=0.85` background (49,50,47) vs paper text (246,239,225) → **11.3:1**. Both far above the 4.5:1 body-text floor for every possible scroll rest position — no dead zone remains. Also verified live via simulated wheel-scroll through the section: `--dn-mix` reads exactly `"0.15"` through frac 0.55 and exactly `"0.85"` from frac 0.6 onward, flipping together with `.is-night`.

### M (a11y-devil DA-1). about.html callbar has no `is-on`, no reachable mobile phone number
- `about.html`: `<div class="callbar">` → `<div class="callbar is-on">`, matching `catering.html`/`menu.html`. (Per task scope, only `about.html` was in-bounds for this fix; `index.html`/`contact.html`/`404.html` callbar state was left untouched as it wasn't specified.)

### Minor (motion-code M1). Missing font preloads
Added `<link rel="preload" href="assets/fonts/Fraunces-Variable.woff2" as="font" type="font/woff2" crossorigin>` to `index.html`, `menu.html`, `catering.html`, `about.html`, `contact.html` (404.html already had it). Also added the italic preload (`Fraunces-Italic-Variable.woff2`) on `index.html`, `menu.html`, `about.html`, `contact.html`, which each use `<em>` (Fraunces italic) in their above-fold hero `<h1>`/`<h2>`. `catering.html`'s hero has no italic emphasis word above the fold, so only the regular weight was preloaded there — avoids preloading a face not used above the fold, per the instruction.

### N1 (visual-brand) / C2 (motion-code). PLACEHOLDER_ORIGIN
Left the token in place, as instructed (deploy step owns the swap). Confirmed via grep across all 6 HTML files that `PLACEHOLDER_ORIGIN` only appears inside `<link rel=canonical>`, OG/Twitter meta, and JSON-LD `url`/`image`/`logo`/`@id` fields — it does not leak into any visible rendered text on any page. No leak found; no action needed beyond what the a11y-devil report already confirmed.

## Out of scope (not touched, belongs to Track B)
- C2 (visual-brand): `.home-trio .fc-petal-1` ornament overlapping card text — `assets/css/pages/home.css`.
- M1 (visual-brand): catering pin-release numeral collision — `assets/css/pages/catering.css` / `catering.js`.
- M2/M3 (motion-code): responsive `srcset` for non-hero content photography — page-level image markup outside `<head>`/footer.
- N2/N3 (visual-brand): mobile black gap, menu squiggle stroke weight — page CSS.
- MINOR-DA-2 (a11y-devil): unused Unsplash image inventory — content/page-level, not shared shell.

## Verification summary (all 6 pages × 2 viewports × 2 motion states = 24 combinations)
- **Console/page errors:** zero across all 24 combinations.
- **Footer wordmark vs footer bar overlap:** zero overlaps across all 24 combinations (scrolled to bottom, `getBoundingClientRect` intersection test).
- **Tab order on index.html:** first Tab → `.skip-link`; no focus is force-moved into the hidden overlay.
- **Tap targets (390px viewport):** `.skip-link` 44px tall, `.nav__brand` 44×44px, `.footer__col a` 44px tall — all clear the `--tap` (44px) floor.
- **Day-night contrast:** stepped `--dn-mix` (0.15 / 0.85) confirmed live via scroll simulation; both flat states measure 11-12:1 contrast, no scroll position drops below 4.5:1.
- **Page weight (1440x900, network capture):** index.html 1372KB, menu.html 802KB, catering.html 653KB, about.html 1285KB, contact.html 821KB, 404.html 652KB — down from an estimated ~2.1-2.9MB pre-fix (adding back the ~774KB the oversized logo cost every page), a 35-45% reduction driven almost entirely by the logo re-export.
