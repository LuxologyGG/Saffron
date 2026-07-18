# Design Spec Review, Round 2 (re-review after fixes): Lenses 3 (Motion) and 4 (Code & Performance)

Targets re-examined: `assets/css/tokens.css`, `research/design-brief.md`, `assets/css/fonts.css`, `assets/js/vendor/MANIFEST.md`, against `review/design-spec/round1-motion-code.md` and `review/design-spec/fixlog-round1.md`.
Pass bar: 9.5. **Both lenses pass.**

---

## Verification of round-1 findings

### Lens 3, Motion

| Finding | Verified state |
|---|---|
| M-1 CRITICAL Lenis contract | FIXED. Brief section 5 carries the exact config (`lerp: 0.1, wheelMultiplier: 1, smoothWheel: true, syncTouch: false`), the ScrollTrigger wire-up lines verbatim (`lenis.on('scroll', ScrollTrigger.update)`, `gsap.ticker.add((t) => lenis.raf(t * 1000))`, `lagSmoothing(0)`), native scroll on touch, and the no-instantiation rule under reduced motion extended to "nor is any scrub/pin timeline" (stronger than asked). |
| M-2 CRITICAL page transition | FIXED. "Page transition (all pages)" block in section 2: ink curtain at --z-transition, exit 100% -> 0 over .6s --e-inout, entry 0 -> -100% .6s --e-inout with 80ms delay, first-load exemption, reduced-motion instant. Also mirrored in the motion defaults table. |
| M-3 MAJOR About scrubber | FIXED (with a justified devil's-advocate demotion). Enhanced scrubber spec carries pin 300vh, linear era mapping, .5s --e-ui crossfade with 1.04 -> 1.0 settle, scrub-tied marker, .4s --e-out snap, tablist keyboard model, reduced-motion stacked rows. Launch version honestly runs on one photo + typographic era rule since unverified years were deleted (D3); the motion numbers survive for the enhancement. Acceptable resolution. |
| M-4 MAJOR Home/Catering scrub numbers | FIXED. Home: pinned 160vh, scale 1.05 -> 1.32 scrub-tied, headline masks on LOAD 820ms --e-reveal 90ms stagger, ghost opacity 0 -> .44 -> 0. Catering: pinned 220vh, tier cards 0.9 -> 1.0 each over one third of progress --e-out, SplitText count flip .6s --e-reveal, reduced-motion static row, and the choreography is explicitly stated to apply to the launch typographic panels too (closes the asset-blocked gap). |
| M-5 MAJOR reduced-motion matrix | FIXED. Section 4 bullet 2 now enumerates all previously missing branches: shamse rotation (404 included), Contact arch-window parallax, About scrubber stacked rows, k-blink solid, ken burns static crop, testimonial buttons-only instant swaps, no page-transition curtain, marquee .marquee-static fallback. The one blinking-dot consumer (Contact) was additionally removed by spec (D8), and the JS/CSS dual-guard rule is stated in tokens.css. Complete. |
| M-6 MAJOR missing triples | FIXED. Section 5 motion defaults table covers scroll-reveal default (y 28px + opacity, .6s --e-out, 80ms stagger, IO 0.2, once), hover .3s --e-ui with --t-ui .4s for roll-ups, slider .35s --e-ui, masked reveal 820ms/90ms, shamse 120s (Menu spinner no longer exists per V3, so the 60s case is moot), marquee 80s duplicated track, float ladder 6s/7.3s/8.1s at 8px (matches k-float amplitude), parallax yPercent -12, page transition. Menu rail roll-up .35s --e-ui in Menu section 3. The new Menu dotted-leader hero device carries its own scrub spec (0 -> 100% width over hero scroll depth). |
| M-7 MINOR preloader timing | FIXED. Hard cap 2200ms including 450ms --e-reveal exit, auto-dismiss, sessionStorage `snrIntroSeen`, Skip first in focus order, plus data-saver and reduced-motion exclusions (reconciled with Brand B2; tighter than Khufu's 3600, deliberately). |
| M-8 MINOR easing loose ends | FIXED. --e-osmo deleted; `--t-ui: .4s` added with Tastavents comment and consumed by the roll-up/hover specs. |

### Lens 4, Code & Performance

| Finding | Verified state |
|---|---|
| C-1 MAJOR px-only clamps | FIXED, math checked at 16px root. All --fs-* are rem + vw hybrids with genuinely interpolating preferred terms: body 13.6px + 0.45vw = 15.4px at 400w rising to its 17px cap (~1210w); eyebrow/mono floor at 0.75rem (12px, A4 floor honored); h2 hits 34.0 -> 78.0 across 400 -> 1440 within rounding; h3s/h3/h4/lead all land on their commented endpoints. Text zoom now scales every step via the rem terms. Two cosmetic nits noted below (N-1). |
| C-2 MAJOR borderline contrast | FIXED, ratios recomputed: --accent-deep #6e5322 is 5.6:1 on #f0e2ce and 6.3:1 on #f6efe1 (both AA with margin; the inline comment understates these, see N-2). --fg-faint light at 64% mix computes ~5.3:1 on --paper and ~4.8:1 on --paper-1; dark at 56% computes ~5.7:1 on ink. --red-text-dark #e0736c on ink ~6.2:1. Brief section 4 states the new hex and the BOTH-grounds rule. All pass with real margin. |
| C-3 MAJOR perf contract | FIXED. Section 5 perf contract: single-element variable-driven bg lerp (never body/html), transform/opacity only for scrubbed and floating media, JS-scoped will-change limited to hero dolly + active floats, image budget (<= 2560px, AVIF/WebP + JPEG, lazy below fold, width/height attrs), grain <= 64KB tile at opacity < .12 with --grain-opacity .06 default. |
| C-4 MINOR overflow | FIXED. `overflow-x: clip` on both html and body with the Lenis rationale comment. |
| C-5 MINOR marquee freeze | FIXED. Reduced-motion guard adds `[class*="marquee"] { animation: none !important; transform: none !important; }` plus the markup rule (single line in .marquee-static, duplicated track hidden), restated in Catering section 4 and the matrix. Also checked the other keyframes for end-state residue: fill-mode defaults to none, so the generic .001ms/1-iteration guard leaves k-kenburns/k-float/k-blink elements at their base styles; no residue. |
| C-6 MINOR browser floor | FIXED. Comment at the semantic block: "Browser floor: 2023 evergreen (color-mix, overflow: clip). No fallbacks by design." |
| C-7 MINOR no-JS promise | FIXED. "Server-rendered fallbacks" wording gone; menu/catering data authored in HTML, data.js verifies and enhances, and the load-bearing rule (no stylesheet-authored opacity: 0; hidden initial states JS-applied only) is stated in bold in section 4 and restated for Menu item rows ("NEVER JS-gated"). |
| C-8 MINOR undocumented tokens | FIXED. --accent-1, --black, --steel family, --e-osmo, --tracking-wide deleted; --paper-2/--paper-3/--white/--leaf carry role comments; header asserts the every-token-has-a-consumer rule. |

### Regression sweep
fonts.css is coherent with the V1 fix (Fraunces normal + italic variable, no Clash remnant, all font-display: swap, weight-range syntax correct); MANIFEST.md fonts table and load order match; brief timing tokens all resolve to real tokens.css names (--t-reveal .82s, --t-med .6s, --t-ui .4s, --e-reveal/--e-ui/--e-out/--e-inout all present); no orphan reference to --e-osmo, steel, or "carte" survives; z-index ladder comments match the renamed "counter menu overlay". No regressions found.

---

## Residual nits (non-blocking, below the fix bar)

- N-1 (cosmetic): --fs-h1's comment says "44 -> 128" against the stated 400/1440 endpoints, but 8rem is only reached near 1755px viewport (~108px at 1440); --fs-display's negative rem term (-0.35rem) slightly dampens pure text-zoom response at small widths. Both are the review-prescribed clamps and behave correctly; only the endpoint comments oversell.
- N-2 (cosmetic): the --accent-deep comment states "4.9:1 on #f0e2ce, 5.6:1 on #f6efe1"; recomputed values are 5.6:1 and 6.3:1. Understatement in the safe direction.
- N-3 (cosmetic): --e-expo, k-drift, and k-chev have descriptive comments but no named consumer in the brief, mildly bending the "every token has a stated consumer" house rule; --red-wash/--crocus-wash likewise. Harmless at this count.

---

## Verdict

| Lens | Round 1 | Round 2 | Pass (9.5) |
|---|---|---|---|
| 3 Motion | 8.3 | **9.6** | YES |
| 4 Code & Performance | 8.6 | **9.6** | YES |

Both critical findings, all five majors, and all minors are verifiably fixed in the files, several beyond the prescribed remedy (scrub/pin timelines excluded under reduced motion, launch fallbacks for asset-blocked heroes carrying the same choreography). Remaining items are three cosmetic comment nits that do not affect build correctness. CONFIRMED PASS, no new fix list required.
