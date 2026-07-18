# Design Spec Review, Round 1: Lenses 3 (Motion) and 4 (Code & Performance)

Targets: `assets/css/tokens.css`, `research/design-brief.md`
Baselines: `research/refs/{khufus,laguna,tastavents}/design-system.md`, `assets/js/vendor/MANIFEST.md`, `assets/css/fonts.css`
Pass bar: 9.5. Neither lens passes this round.

---

## LENS 3, MOTION: 8.3 / 10

The spine is strong: the easing/duration tokens are correctly transcribed from the measured references (`--e-reveal` = Khufu's measured `cubic-bezier(.18,1,.25,1)`, `--t-reveal: .82s` = the 820ms masked line rise; `--e-inout` = Khufu's wipe curve; `--e-out` = Tastavents' easeOutCubic). Home, Menu, and 404 heroes have concrete choreography. But a build agent working only from this brief would have to invent numbers for roughly a third of the motion moments, and the Lenis integration, page transitions, and several reduced-motion branches are unspecified. That is exactly where under-delivery happens.

### Findings

**M-1 (CRITICAL). Lenis is vendored but never specified.**
`assets/js/vendor/MANIFEST.md` ships lenis.min.js 1.3.11 and lenis.css, yet neither the brief nor tokens.css says how it runs: lerp/duration value, wheel multiplier, whether it drives ScrollTrigger (`lenis.on('scroll', ScrollTrigger.update)` + `gsap.ticker.add`), whether it is disabled on touch, and that it must be skipped entirely under prefers-reduced-motion. Khufu's baseline measures a 0.10 exponential smoothing factor for scroll catch-up; nothing maps that to Lenis config.
FIX: In `research/design-brief.md`, add a new section "## 5. Motion engine contract" specifying exactly: `new Lenis({ lerp: 0.1, wheelMultiplier: 1, smoothWheel: true, syncTouch: false })`; wire-up `lenis.on('scroll', ScrollTrigger.update); gsap.ticker.add((t) => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0)`; Lenis not instantiated when `matchMedia('(prefers-reduced-motion: reduce)')` matches; native scroll on touch.

**M-2 (CRITICAL). The page-transition wipe exists only as a z-index token.**
tokens.css defines `--z-transition: 95 /* page transition wipe */` and `--e-inout` is annotated "wipes/curtains", but no page in the brief specifies a transition: what element wipes (ink curtain? cream?), direction, duration, easing, what happens on first load vs internal navigation, and its reduced-motion fallback (instant cut). A build agent will either skip it or improvise.
FIX: In `research/design-brief.md` section 2 (before "Home") or the new motion-contract section, add: "Page transition: full-viewport ink (`--ink`) curtain at `--z-transition`; exit wipe translates up 100% -> 0 in `--t-med` (.6s) `--e-inout` on link click, then navigates; entry reveals by translating 0 -> -100% in `--t-med` `--e-inout` 80ms after load. Reduced motion: no curtain, instant navigation."

**M-3 (MAJOR). About hero (year scrubber) has zero motion numbers.**
"a horizontal year scrubber ... that scrubs archival-graded storefront imagery" names no trigger, scroll distance, snap behavior, image transition (crossfade? wipe?), duration, or easing. This is the whole hero of the page.
FIX: In the About hero paragraph, specify: "ScrollTrigger pinned section, 300vh; progress maps linearly to the 4 eras; images crossfade 0.5s `--e-ui` with a 1.04 -> 1.0 settle scale; the year marker slides along the rule scrub-tied; snap: `snap: 1/3` with 0.4s `--e-out`. Reduced motion: no pin, four static year+image rows stacked."

**M-4 (MAJOR). Catering hero scrub is vague where Laguna's baseline is measured.**
"a horizontal row of arch-sm platter photos steps up in size ... as a scroll-scrubbed sequence" gives no pin length, scale range, or stagger. The Laguna baseline this borrows from is precise (dolly 1.08 -> 2.3 over ~2700px; handoffs at measured y-ranges). Similarly the Home dolly-zoom says "scroll-scrubbed slow zoom" without the range; Laguna's measured factor (~+0.045 scale per 100px, clamped at 2.3) should be translated to a spec, e.g. scale 1.05 -> 1.35 over a 160vh pin (a deli hero should not zoom 2.3x, but the chosen numbers must be WRITTEN).
FIX: Home hero: "pinned 160vh; arch image scales 1.05 -> 1.32 scrub-tied (scrub: true), headline masks rise 820ms `--e-reveal` staggered 90ms on load (not scroll); ghost SAFFRON layer opacity 0 -> .44 -> 0 across the pin (Laguna text-stroke curve)." Catering hero: "pinned 220vh; three platter cards scale-step 0.9 -> 1.0 sequentially, each over 1/3 of progress, `--e-out` catch-up; counts flip via SplitText y-mask 0.6s `--e-reveal`. Reduced motion: static row at final sizes."

**M-5 (MAJOR). Reduced-motion matrix has gaps.**
Brief section 4 covers preloader, scrub, floats, dolly, marquee, but omits per-effect fallbacks for: the shamse spinner (Menu hero + 404), the Contact arch-window parallax, the About year scrubber, the blinking status dot (`k-blink`), the ken burns keyframe, the testimonial fan slider, and the page transition. The CSS guard catches keyframes, but the JS-driven ones (parallax, scrubber, slider transforms) need explicit static states.
FIX: In section 4 bullet 2, extend the list: "no shamse rotation (static rosette), no arch-window parallax (static image), year scrubber renders as stacked static rows, status dot solid (no blink), testimonial slider becomes buttons-only instant swaps, no page-transition curtain, no ken burns (static crop)."

**M-6 (MAJOR). Several named moments lack trigger/duration/easing triples.**
Inventory of vague spots a build agent will under-deliver on: (a) Menu shamse "spins slowly", no rotation period (give e.g. 60s linear via `k-spin`; 404 "imperceptibly slowly", give 120s); (b) Occasions marquee, no px/s or duration (Tastavents-style, specify e.g. 80s linear loop, pause-free, duplicated track with `k-marquee`); (c) sine floats, no amplitude/period mapping to Laguna's measured +/-9px (the `k-float` keyframe uses +/-8px, fine, but no per-element duration ladder, e.g. 6s/7.3s/8.1s desync); (d) Contact parallax "drifts slower than scroll", no factor (Laguna baseline: 0.12-0.15x, specify `yPercent: -12` scrub); (e) sticky category rail roll-up hover, no duration (specify 0.35s `--e-ui`, Dokmeh two-layer swap); (f) testimonial fan transitions (Khufu's baseline: ~0.35s); (g) IO reveal defaults, Khufu's measured `opacity .44s .08s` never adopted as the sitewide scroll-reveal default.
FIX: Add a "Motion defaults" table to the brief: scroll-reveal default = y 28px + opacity, 0.6s `--e-out`, 80ms stagger, IO threshold 0.2, once; hover default = 0.3s `--e-ui`; slider = 0.35s `--e-ui`; spin periods, marquee duration, float ladder, parallax factors as above. Every per-page section then only overrides deltas.

**M-7 (MINOR). Preloader spec is 90% there but misses hold/exit timing and the storage key.**
Khufu's baseline gives WORD_STAGGER 90ms (adopted), HOLD_MS 3600, EXIT_MS 450, sessionStorage gating. The brief adopts only the stagger.
FIX: In Home section 1: "per-line hold 2400ms (3 lines, tighter than Khufu's 3600), exit fade+rise 450ms `--e-reveal`, sessionStorage key `snrIntroSeen`, Skip pill always focusable first."

**M-8 (MINOR). Token/easing mapping loose ends.**
`--e-osmo: cubic-bezier(.19,1,.22,1)` maps to no reference and is cited nowhere in the brief; unassigned tokens invite inconsistent use. Tastavents' primary rhythm is 0.4s (25 uses at easeInOutCubic) but the duration ladder jumps .3s -> .6s.
FIX: In tokens.css motion block, either delete `--e-osmo` or comment its single intended use; add `--t-ui: .4s; /* Tastavents primary UI rhythm */` and reference it for hover/roll-up specs in the brief.

---

## LENS 4, CODE & PERFORMANCE: 8.6 / 10

tokens.css parses clean (all `color-mix()`, `clamp()`, custom-property, and keyframe syntax valid; verified values against the logo-derived palette; no external references anywhere; fonts.css is fully self-hosted with `font-display: swap`; MANIFEST load order is sensible). The semantic-token + `.on-dark` re-point architecture is genuinely good. Deductions are for a text-zoom accessibility defect in the fluid type scale, two borderline contrast tokens shipped as "AA" without margin, and missing perf guidance the build agent will need.

### Findings

**C-1 (MAJOR). Fluid type scale breaks browser text zoom (px-only clamps).**
Every `--fs-*` uses px min/max with a pure-vw preferred value, e.g. `--fs-body: clamp(15px, 1.02vw, 17px)`. Pure-vw middles do not respond to text-only zoom, and px bounds ignore user font-size preferences; WCAG 1.4.4 (resize to 200%) fails for the vw-dominant range. Also `--fs-body`'s preferred term (1.02vw = 14.7px at 1440) is below its own 15px floor until ~1470px wide, so "fluidity" barely exists in the common range.
FIX: In tokens.css "Fluid type scale", rewrite every clamp as rem + vw hybrid, e.g. `--fs-body: clamp(0.9375rem, 0.85rem + 0.45vw, 1.0625rem)`; `--fs-h1: clamp(2.75rem, 1.2rem + 6.2vw, 8rem)`; same pattern for eyebrow/mono/lead/h4/h3/h2/display (keep current px endpoints, convert to rem, and make the preferred term `Arem + Bvw` so it actually interpolates between the endpoints).

**C-2 (MAJOR). Two "AA-safe" tokens are borderline and one is likely under 4.5:1.**
Computed: `--fg-faint` light = 60% ink over `#f6efe1` = approx `#6b6a63` on `#f6efe1`, approx 4.6:1 (passes, zero margin). `.on-dark` `--fg-faint` = 52% paper over ink = approx `#878478` on `#0e110f`, approx 4.7:1 (zero margin). `--accent-deep #7a5c26` on `--paper-1 #f0e2ce` (gold text on the ALT cream, which the brief explicitly allows) is approx 4.3:1, FAILS AA for body-size text. The comments claim "AA on cream" without stating which cream.
FIX: In tokens.css, darken `--accent-deep` to `#6e5322` (approx 4.9:1 on `#f0e2ce`, 5.6:1 on `#f6efe1`) and bump `--fg-faint` mixes to 64% (light) and 56% (dark). In design-brief.md section 4, change "Gold as text always uses --accent-deep #7a5c26" to the new hex and add "verified against BOTH grounds --paper and --paper-1".

**C-3 (MAJOR). Perf contract for the scroll effects is unwritten.**
The brief plans: 220vh background-color lerp (Home day-to-night), a scrub dolly-zoom on a full-bleed image, ken burns at scale 1.14, `k-drift` at scale 1.15, multiple float layers, and grain PNG overlays. None of these carry a perf rule, so the build agent can legally ship background-color animation on `body` (full-page repaint every frame), unhinted composite layers, or blanket `will-change`.
FIX: Add to the brief's new motion-contract section: (1) day-to-night lerps a CSS variable consumed by ONE section-level element, never `body`/`html`, and animates `background-color` on that single element only (accept the repaint, forbid animating it on ancestors); (2) all scrubbed/floating media move via `transform`/`opacity` only; (3) `will-change: transform` allowed ONLY on the hero dolly image and active float cutouts, added/removed by JS around the effect, never in stylesheet-wide rules; (4) hero images `<= 2560px` wide, AVIF/WebP with JPEG fallback, `loading="lazy"` below the fold, explicit width/height attributes; grain PNG `<= 64KB`, tiled, on its own pseudo-element at `opacity < .12`.

**C-4 (MINOR). `overflow-x: hidden` on body only.**
With Lenis, `overflow-x: hidden` on `body` (line 174) can create an unintended scroll container and break `position: sticky` descendants in some engines; html is left unguarded.
FIX: tokens.css Reset: change to `html { overflow-x: clip; } body { overflow-x: clip; }` (clip avoids spawning a scroll container; keep hidden as fallback via `@supports not (overflow: clip)` if desired).

**C-5 (MINOR). Reduced-motion guard nukes `k-marquee` to a half-shifted end state.**
`animation-duration: .001ms; animation-iteration-count: 1` leaves a `k-marquee` element resting at `translate3d(-50%,0,0)`, i.e. permanently scrolled half a track, showing the duplicate copy. The brief's fallback ("static wrapped line") depends on app.css/JS also removing the duplicated track; nothing says so.
FIX: In design-brief.md section 4 reduced-motion bullet, add: "marquee markup includes the text once in a `.marquee-static` fallback; under reduced motion the duplicated animated track is `display: none` and the static line shows." Optionally add to tokens.css guard: `@media (prefers-reduced-motion: reduce) { [class*="marquee"] { animation: none !important; transform: none !important; } }`.

**C-6 (MINOR). `color-mix()` and `overflow: clip` have no stated browser floor.**
tokens.css leans on `color-mix(in srgb, ...)` for all hairlines and soft text. Baseline support is fine (2023+ evergreen), but a zero-build project with no fallback line means Safari 15/older Chromium get invisible borders and default-colored text with no documented decision.
FIX: Add one comment line at the top of the semantic-token block in tokens.css: "Browser floor: 2023 evergreen (color-mix, clip). No fallbacks by design." Or, if older support is wanted, add literal hex fallback declarations immediately before each color-mix line.

**C-7 (MINOR). Architecture note: data.js -> app.js contract is sound but under-specified for the no-JS promise.**
Brief section 4 promises "all pages are readable with JS disabled (data.js hydration on top of server-rendered fallbacks where practical)". There is no server; this is a static zero-build site, so "server-rendered fallbacks" is impossible as written and the menu page (data renders "verbatim from data.js") would be EMPTY without JS, contradicting the promise.
FIX: In design-brief.md section 4 bullet 3, replace "server-rendered fallbacks where practical" with: "menu/catering item data is authored directly in the HTML; data.js is the single source used by a build-time-free inline hydration that VERIFIES and enhances (price ticks, category counts), plus `<noscript>` styling that reveals all content with motion-initial states cleared (no `opacity: 0` in stylesheets; hidden-until-reveal states are applied by JS only)". The last clause is the load-bearing rule: initial hidden states must be JS-applied, never CSS-authored.

**C-8 (MINOR). Unused/undocumented tokens.**
`--e-osmo` (see M-8), `--steel-2`/`--steel-3` and `--paper-3` have no documented role, `--black #070907` never referenced by any semantic token, and `--accent-1 #c2984f` sits 3% off `--accent-base` with no stated purpose. Dead tokens breed inconsistent component CSS.
FIX: In tokens.css, either add a one-line role comment to each (`--paper-3: deep cream, arch-panel inner shadow ground` etc.) or delete `--accent-1` and `--black`.

---

## Verdict

| Lens | Score | Pass (9.5) |
|---|---|---|
| 3 Motion | 8.3 | NO |
| 4 Code & Performance | 8.6 | NO |

Top fixes in priority order: M-1 (Lenis contract), M-2 (page transition spec), C-1 (rem-based clamps), C-2 (accent-deep contrast), M-3/M-4 (About and Catering hero numbers), C-3 (perf contract), M-5 (reduced-motion matrix).
