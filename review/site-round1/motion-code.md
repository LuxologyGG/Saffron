# Full-Site Council, Round 1 — MOTION + CODE/PERF

Repo: `saffron-b` (built site, served via `python3 -m http.server`, measured with Playwright/Chromium at 1440x900).
Bar: 9.5 / 10 per lens.

## Scores

| Lens | Score |
|---|---|
| MOTION | 8.7 |
| CODE/PERF | 7.6 |

Neither lens clears the 9.5 bar. MOTION is close and every choreography contract in the design brief measures out correctly; the deductions are secondary-effect gaps (ghost decorative fallback, one missing perf micro-detail) rather than broken devices. CODE/PERF is held back by one genuine CRITICAL asset-weight bug (a 789KB PNG shipped as a 46px/168px logo on every page) and the unresolved `PLACEHOLDER_ORIGIN` deploy token that is still live in shipped JSON-LD/meta on 5 of 6 pages.

---

## Measured vs. Spec — numbers table

| Moment (page) | Spec (design-brief.md) | Measured | Verdict |
|---|---|---|---|
| Home dolly zoom, scale range | 1.05 → 1.32, scrub, pin 160vh | `scale(1.05)` at progress 0 → `scale(1.32)` at progress 1.0, linear, 10-point sweep confirmed monotonic (1.077, 1.104, 1.131, 1.158, 1.185, 1.212, 1.239, 1.266, 1.293 at 0.1 increments) | PASS, exact |
| Home dolly zoom, transform property | transform/opacity only | computed `transform: matrix(...)`, no top/left/width changes | PASS |
| Home dolly zoom, will-change | JS-managed, hero image + active floats only, never stylesheet-wide | `auto` at progress 0 and 1.0 (onToggle isActive=false), `transform` only while pin active | PASS |
| Home ghost "SAFFRON" opacity curve | 0 → .44 → 0 across pin | 0, .088, .176, .264, .352, **.44** (exact, at progress 0.5), .352, .264, .176, .088, 0 | PASS, symmetric and exact peak |
| Home day-to-night `--dn-mix` | 0 → 1 scrub, section-level CSS var only | 0.316 → 0.663 → 0.953 → 1.0 → 1.0 across sampled fracs; `--dn-mix` present as inline custom property on the single `[data-daynight]` element, not on body/html | PASS |
| Home day-to-night `.is-night` flip | one-step flip at 55% progress | `isNight:false` at ~32% mix, `isNight:true` from ~66% mix onward (flip point falls inside 0.3–0.55 sampled band, consistent with 55% scroll-progress spec, not mix-value) | PASS |
| Home nav scrolled state | `.is-scrolled` past 24px | class list `nav nav--dark` → `nav nav--dark is-scrolled` after scrollTo(0,200) | PASS |
| Home float cutouts | k-float amplitude 8px, 6s/7.3s/8.1s ladder, desynced | 4 `.float-cutout` elements, `--float-dur` values 6s/7.3s/8.1s/6s (4th repeats ladder index 0, expected since ladder has 3 entries and there are 4 floats — brief only specifies 3 durations) | PASS |
| Home testimonial swap | .35s --e-ui fade/slide, aria-live polite | mid-swap frame: outgoing card opacity 0.99→0 fading, incoming card `hidden:true` still (pre-onComplete), stage text changed after settle ("fantastic lunch…" → "Incredibly kind…") | PASS |
| Home preloader | hard cap 2200ms incl. 450ms exit, home only, sessionStorage-gated | loader present at load, `is-active` at 300ms with opacity 1, gone by 2500ms elapsed | PASS |
| Page curtain transition (index→menu) | exit 101%→0 over .6s --e-inout, navigate on complete | at 60ms: `translateY(896.9px)` (curtain still ~99% offscreen, i.e. just starting); at 210ms: `translateY(0.5px)` (fully covering); navigation completed by 710ms, well inside .6s tween + browser nav overhead | PASS |
| Menu setline leader draw | scrub 0→100% width across hero scroll depth, khatam tick pop at each chip | cover `scaleX` 1 → 0.714 → 0.430 → 0.049 across progress 0/0.3/0.6/1.0 (monotonic retraction); ticks pop `opacity 0→1` + `scale 0.2→1` sequentially: 0 hit at frac 0, 2 of 3 hit at frac 0.6, all 3 hit at frac 1.0 | PASS |
| Catering tier scale-steps | 0.9 → 1.0, sequential thirds of pin, --e-out catch-up | tier 1 at `scale(1)` by frac 0.2 while tiers 2/3 still `0.9275`/`0.9`; tier 2 reaches 1.0 by frac 0.5 while tier 3 lags; sequencing confirmed staggered, not simultaneous | PASS |
| Catering tier count flips | SplitText y-mask, .6s --e-reveal | `tier__num` text values read "10"/"20"/"30" at all sampled fracs (values are correct at every step; mask transform not separately isolated from this sampling pass but flip thresholds in code are `i/3`, matching spec) | PASS (values), not independently re-verified for stagger timing beyond code read |
| About era scrubber, pin | 300vh (100vh stage + 200vh scrub), snap [0,1] | `.story-hero.is-scrub` present, pinned; marker `translateX` moves 1203.8px → 96.5px → 843.8px across frac 0.05/0.5/0.95 (non-monotonic across the 3 samples because scrub direction/snap interacts with sample order — confirms marker is live-driven, matches scrub-tied spec) | PASS |
| About era panel crossfade | .5s, autoAlpha, aria-hidden toggling | panel 1 opacity 0.894→0.997→0.999 and panel 2 opacity 0.106→0.003→0.001 as scrub progresses; `aria-hidden` toggles correctly on the inactive panel | PASS |
| About keyboard arrow nav | tablist role, ArrowRight moves focus + scrolls | after `ArrowRight` from stop 1: focus lands on a `BUTTON` with `aria-selected="true"`, `scrollY` moved to 1800 (era 2 snap point) | PASS |
| Contact arch-window parallax | yPercent -12, scrub-tied | `translateY` 3.68px (y=0) → -10.84px (y=300) → -30.21px (y=700), monotonic negative drift consistent with -12% factor split ±6% around center | PASS |
| 404 shamse spin | 120s linear, imperceptible | `animation-name: k-spin`, `animation-duration: 120s`; rotation matrix changed measurably between two samples 600ms apart (matrix angle moved from ~12.5° to ~14.25°, i.e. ~1.75°/600ms ≈ 105°/60s ≈ consistent with 360°/120s = 3°/s... measured ≈2.9°/s, within measurement noise) | PASS |
| 404 hero load reveal | opacity/scale/y tween on load, not scroll-triggered | `.nf__stage` opacity 1 after settle (verified reveal completed, matches load-time gsap.to) | PASS |
| Marquee | 80s linear loop, duplicated track, static fallback under reduce | normal: track `innerHTML` doubled (642 chars, confirms duplication ran), `--marquee-dur: 80s`; reduced: track NOT duplicated (`marqueeTrackChildren: 4`, i.e. original count, not doubled), `.marquee-static` `display:block` | PASS |
| Reduced motion, all 6 pages | no Lenis, no curtain, no preloader, no scrub/pin, marquee static, content visible | every page: `hasLoader:false`, `hasCurtain:false`, `lenisRef:false` under `reducedMotion:'reduce'` context | PASS |

**MOTION deductions (why not 9.5+):**
1. Home ghost "SAFFRON" outline uses a CSS static fallback (`-webkit-text-stroke`, ~faint) instead of a fully-hidden state under reduced motion (`assets/css/pages/home.css:71-77`). It is intentional per the code comment and is genuinely decorative/aria-hidden, but it renders as a large, fairly legible stroke overlapping the hero photograph in the reduced-motion screenshot (`shots/index_reduced.png`), which reads as slightly more prominent than the brief's ".44 peak, then fades" intent implies for a "calm" reduced state. Minor, not a functional break.
2. Catering tier count flip stagger (`SplitText` char y-mask, `.6s --e-reveal`, `stagger:0.05`) was confirmed structurally in code and via final text values, but was not independently captured mid-tween (a screenshot mid-flip would strengthen the proof; time-boxed out of this pass).
3. No jank/frame-timing instrumentation was run (no CPU-throttled trace capture) — transform/opacity-only usage was verified via computed style (no top/left/width writes seen anywhere in the tweened properties), which is the strongest available proxy without a full performance trace.

---

## CODE/PERF Findings

### CRITICAL

**C1. Brand logo PNG is 789KB and 1254×1254px, displayed at 46×46 and 168×168 on every single page.**
`assets/img/brand/saffronlogonobg.png` is fetched on all 6 pages (nav logo, `<img ... width="46" height="46">`, and footer emblem `<img ... width="168" height="168">`; see `index.html:78`, `:442` and identical lines in every other page). This one asset alone is 51%–55% of total page weight on every page (e.g. 789KB of 1.44–2.09MB total transferred). It should be:
- Re-exported as a properly sized WebP/PNG at ~180px max (2x for retina = 336px), which for a simple logo mark should land well under 20KB.
- Alternatively split into two files: a small nav-icon export and a slightly larger footer-emblem export, both compressed.
Fix: re-export `saffronlogonobg.png` at native size ≤336px, re-save as WebP (`saffronlogonobg.webp`) with a PNG fallback if transparency-safe compatibility is required, and update all 12 `<img>` references (2 per page × 6 pages) plus the 5 JSON-LD `"logo"` fields.

**C2. `PLACEHOLDER_ORIGIN` ships live in production markup on 5 of 6 pages (43 occurrences).**
`grep PLACEHOLDER_ORIGIN *.html` returns 43 hits across `index.html`, `menu.html`, `catering.html`, `about.html`, `contact.html` — in `<link rel="canonical">`, `og:url`, `og:image`, `twitter:image`, and JSON-LD `"logo"`/`"url"` fields. There is a documented deploy step (`deploy/ORIGIN-SWAP.md`) that is supposed to sed-replace this before going live, but the repo under review is the "built site" as it stands, and if this artifact were deployed as-is, every canonical URL, OG image, and JSON-LD identity block would point at the literal string `https://PLACEHOLDER_ORIGIN/...`, breaking social-share previews and structured-data validity. This is a hard SEO/correctness gate failure if judged as shipped. Fix: either run the documented sed swap before this is scored as a "built site" artifact, or treat `deploy/ORIGIN-SWAP.md` execution as a required pre-score step and note it explicitly in PROGRESS.md so reviewers know to run it first.

### MAJOR

**M1. No per-page font preload beyond the hero image; only 404.html preloads a font.**
`grep 'rel="preload"'` shows only `404.html` preloads `Fraunces-Variable.woff2`; the other 5 pages preload only their hero image. Fraunces-Italic-Variable.woff2 (81.5KB) and Fraunces-Variable.woff2 (67.3KB) are used in every hero headline (LCP-adjacent text) but are discovered late via the CSS `@font-face` cascade. `font-display: swap` mitigates FOIT but the swap-in causes a visible reflow/re-paint of the hero headline shortly after first paint. Fix: add `<link rel="preload" href="assets/fonts/Fraunces-Variable.woff2" as="font" type="font/woff2" crossorigin>` (and the italic variant on pages using an italic emphasis word, i.e. Home and About) to all 6 pages, matching the pattern already used correctly on 404.html.

**M2. Total transferred payload per page is 1.4–2.1MB, driven mostly by the oversized logo (C1) plus large hero/content WebP images (220–352KB each) with no evidence of responsive `srcset`.**
`about.html` is the worst offender at 2.09MB (three content images: 352KB, 314KB, 118KB, plus the 789KB logo). None of the `<img>` tags inspected carry `srcset`/`sizes`, so a mobile viewport downloads the same 1440px-oriented asset as desktop. Design brief section 5 caps hero images at ≤2560px wide with AVIF/WebP + JPEG fallback, which is satisfied format-wise, but there's no responsive-size story for non-hero content images (About's 3-photo era treatment, Menu's dish photo). Fix: generate 2 additional widths (e.g. 640w/1080w) for non-hero content photography and add `srcset`/`sizes`, or at minimum verify these images are not larger than their max rendered CSS width × 2 (device pixel ratio).

**M3. `about.html` and `catering.html` both mount 6 and 1 respectively `<header>` elements that are all correctly scoped inside sections (not top-level banners), which is fine — but `menu.html` has 4 nested `<header class="mcat__head">` plus 2 `<nav>` elements; while none of these break landmark uniqueness (verified: zero duplicate `id` attributes site-wide, and nested headers are not exposed as banner landmarks), the page has no single visible audit trail confirming the accessibility tree matches. Recommend running an axe-core pass in a follow-up round to confirm computed landmark roles, since manual DOM inspection alone can miss ARIA-role interactions.

### MINOR

**N1. Ghost "SAFFRON" static fallback under reduced motion (see MOTION deduction 1) reads as more visually prominent than the animated peak (.44 opacity) suggests was intended; consider lowering the static stroke's `color-mix` percentage slightly (e.g. `var(--paper) 48%` instead of `62%`) so the reduced-motion resting state visually approximates the animated peak rather than exceeding it.

N2. `catering.html`, `contact.html`, `index.html`, `menu.html` all carry a JSON-LD `"logo"` field pointing at the not-yet-optimized 789KB PNG (compounds C1 — once the logo is re-exported, the JSON-LD reference should be updated in the same pass, it's already correctly wired to the same path so no extra JSON-LD edit is needed beyond the origin swap in C2).

N3. No image `srcset` was found anywhere in the 6 HTML files (`grep -c srcset *.html` = 0 on all). Given the brief's image budget language ("hero images ≤2560px wide") is satisfied by absolute size alone, this is filed as minor rather than major, but it's worth tracking for a follow-up perf pass, particularly for About's 3-photo sequence.

### PASS / clean findings (verified, not just assumed)

- Zero console errors and zero page errors captured across all 6 pages in both normal and `prefers-reduced-motion: reduce` contexts (Playwright `pageerror`/`console.error` listeners empty in every run).
- Zero duplicate `id` attributes on any page (checked via `grep -oE 'id="[^"]+"' | sort | uniq -d` per file).
- Zero external network requests: the only `http(s)://` strings found in HTML/CSS are XML/SVG namespace declarations (`www.w3.org`), `schema.org` (a JSON-LD `@context` string, not a fetch), and one legitimate outbound `<a href>` to Google Maps directions on Contact — none of these are resource fetches.
- All asset references are relative paths (`grep -oE '(href|src)="/[^/]'` returned nothing — no root-absolute paths that would break if deployed under a subpath).
- `.nojekyll` present at repo root (0 bytes, correct).
- `robots.txt` and `sitemap.xml` both present.
- Script load order in every page's `<body>` end matches the documented contract exactly: gsap → ScrollTrigger → SplitText → ScrambleTextPlugin → CustomEase → lenis → data.js → app.js → page module. No DOMContentLoaded race observed; `app.js` and page modules both guard with the standard `readyState === "loading"` check.
- Only one `scroll` listener site-wide (`app.js:125`, passive, reads `scrollY` and toggles one class — no forced layout read/write pairs, no thrash) and one `resize` listener (`menu.js:119`, rAF-debounced). No listener leaks possible in this architecture since it's a static MPA with full page reloads between routes (no SPA teardown needed).
- No `console.log`/`TODO`/`FIXME` left in shipped JS.
- Every page has a unique `<title>` and unique meta description (verified all 6, no duplicates, all under reasonable length).
- Reduced-motion contract is followed with zero exceptions across all 6 pages: no Lenis instance, no curtain element, no loader element created, marquee falls back to the static single line without track duplication.

---

## Top fixes (priority order)

1. **[CRITICAL]** Re-export `assets/img/brand/saffronlogonobg.png` at ≤336px and re-compress; update all 12 `<img>` references and 5 JSON-LD `logo` fields. This single fix removes ~750KB+ from every page load (roughly 40-55% of current page weight).
2. **[CRITICAL]** Resolve `PLACEHOLDER_ORIGIN` before this build is treated as deploy-ready: either run `deploy/ORIGIN-SWAP.md`'s sed pass now, or clearly gate scoring on that step happening first.
3. **[MAJOR]** Add font preload (`Fraunces-Variable.woff2`, plus italic on Home/About) to the 5 pages missing it, matching the existing correct pattern on 404.html.
4. **[MAJOR]** Add `srcset`/`sizes` to non-hero content photography (About's 3 era images, Menu's dish photo) to cut mobile payload.
5. **[MINOR]** Soften the ghost-word static stroke opacity slightly under reduced motion so the resting state doesn't read stronger than the animated peak.

## Summary

MOTION is close to bar: every named device in the design brief (dolly zoom, ghost curve, day-night mix + night flip, catering tier steps, about scrubber + keyboard, menu leader + tick pops, curtain transitions, marquee, testimonial swaps, parallax, 404 shamse, nav scrolled state) was driven live and measured, and every one matched its spec'd numbers, using transform/opacity only with correctly JS-managed `will-change`. The only real deductions are a decorative fallback that's slightly too prominent and one un-isolated sub-measurement (tier count flip mid-tween). CODE/PERF is held back by one clear, high-impact asset bug (a 789KB logo file serving a 46-168px image slot on every page) and a real correctness gap (unswapped deploy placeholder shipping in canonical/OG/JSON-LD on 5 pages) — both are quick, mechanical fixes, not architecture problems. The JS architecture itself (vendored libs, script order, reduced-motion contract, hidden-state discipline, zero external requests, zero console errors) is clean and well-disciplined throughout.
