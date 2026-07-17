# Motion Lens — Round 1

**Score: 7.3 / 10**

## Summary

The motion system is broad, deliberate, and mostly executes exactly as DESIGN-BRIEF.md
specifies: the first-visit loader (hairline growth, emblem settle, wordmark stroke-draw
then fill, dome exit), scroll reveals, scramble text, odometers, DrawSVG ornaments,
marquees, the menu's pinned film-strip scrub, the about page's day-to-night interpolation,
the catering arch triptych with lag-ramped scrub, the contact compass draw, the 404
spilled-thread canvas, offscreen canvas pausing, and every reduced-motion fallback were all
individually fired, watched to completion, and confirmed to land in the correct final state.
Frame timing during Lenis-driven scroll on index and menu holds a clean 60fps.

Set against that, one finding is serious: the arch-curtain page transition — the single most
repeated motion element on the site, used on every internal navigation — has a real,
100%-reproducible implementation bug that roughly doubles its intended travel distance,
compressing the visible portion of the wipe into a shorter, snappier window than the coded
easing and duration imply. It still "works" (covers, navigates, reveals) but does not read as
the smooth dome-curtain wipe the brief and the CSS choreography intend. This is documented
below with an isolated minimal repro and a confirmed one-line fix.

A second, minor finding: one of the three documented house easing curves (`srSoft`) is
registered and never used anywhere in the codebase.

## Findings

| ID | Severity | Location | Finding | Fix |
|----|----------|----------|---------|-----|
| MO1 | MAJOR | `assets/css/app.css:632-637` (`.curtain`) + `assets/js/app.js:345-351` (`buildCurtain`) | The arch-curtain transition's parked/hidden position is set **twice**: once as a static CSS rule (`transform: translateY(115%);` on `.curtain`) and again via `g.set(curtain, { yPercent: 115 })` in `buildCurtain()`. GSAP composites its `yPercent` write on top of the element's existing CSS-authored `transform`, so the two 115%s add instead of one superseding the other, producing an actual translateY of **230%** (measured: 2070px on a 900px-tall viewport, 1610px at 700px, 2484px at 1080px — a consistent 2.3× ratio, i.e. exactly 115%+115%, on every one of the 6 pages). Because the tween's *end* value (`yPercent: 0`) is unaffected by this (0% of anything is 0), the curtain still ends up fully covering and still still navigates/reveals correctly — but the *start* value is twice as far away, so under the same coded `.72s`/`.9s` durations and `srInOut` easing, the curtain doesn't become visible until roughly the back half of each tween instead of gradually crossing the whole viewport. A dense screenshot sequence through a real `index.html → menu.html` nav (90ms steps) shows the page fully uncovered at t=270ms, then **fully black** at t=360ms, then the destination page **fully revealed** by t=450ms — the entire visible wipe collapses into roughly a 150-200ms window instead of reading as a smooth ~0.7s cover + ~0.9s reveal. Verified with `gsap.getProperty`, `getComputedStyle().transform`, and a from-scratch minimal repro (`transform: translateY(115%)` in CSS + `gsap.set(el,{yPercent:115})` in JS reproduces 230% on a synthetic element with none of `.curtain`'s other properties; removing either the CSS line or the JS call alone yields the correct 115%/1035px). This is not a headless-testing artifact — it is a deterministic CSS/GSAP composition bug that will reproduce in any real browser. | Delete the redundant declaration. Either remove `transform: translateY(115%);` from `.curtain` in `assets/css/app.css` (keep `display:none` only; the JS `g.set` establishes the parked position) **or** remove `g.set(curtain, { yPercent: 115 });` from `buildCurtain()` in `assets/js/app.js` and let the CSS alone park it before JS ever touches it. Either change alone was confirmed (via isolated repro) to produce the correct 1035px/115% park position; do not do both differently or a similar double-application can recur. |
| MO2 | MINOR | `assets/js/app.js:792` (`CustomEase.create("srSoft", ...)`) | `srSoft` is registered as a house easing curve (matches DESIGN-BRIEF.md's "sr/srInOut/srSoft" motion-plan vocabulary and tokens.css's curve family) but is never passed as an `ease:` value anywhere in `app.js`, `home.js`, or any `page-*.js`. One third of the documented easing system never ships in any visible animation — either it was meant for an effect that got cut, or it is simply dead code. | Either apply `srSoft` somewhere it makes sense (e.g. the softer settle on `data-parallax`/`data-draw`, or the About day-to-night `render()` step transitions, which currently use raw linear interpolation with no named curve) or remove the unused `CustomEase.create` call and its mention as a shipped curve. |

## Checks run (with evidence)

1. **Read the full motion engine** (`assets/js/app.js`, 864 lines) and every page module
   (`home.js`, `page-menu.js`, `page-catering.js`, `page-about.js`, `page-contact.js`,
   `page-404.js`) to build a complete map of every `data-reveal`, `data-reveal-group`,
   `data-scramble`, `data-count`, `data-draw`, `data-parallax`, `data-marquee`, canvas mount,
   and page-specific timeline, plus the loader, curtain, and Lenis/ScrollTrigger wiring.
   Confirmed `CustomEase.create("sr", "0.22,1,0.36,1")`, `srInOut`
   (`0.65,0.05,0.36,1`), `srSoft` (`0.19,1,0.22,1`) match `tokens.css`'s
   `--e-reveal`/`--e-out`/`--e-inout` family in spirit; `sr`/`srInOut` are used consistently
   for reveals/curtain/loader, `power2.out`/`power2.inOut`/`power3.out` are used deliberately
   for scroll-scrubbed and count-up choreography (reasonable, not a token violation).

2. **Served the site locally** (`python3 -m http.server 8131`) and drove it with headless
   Chromium via Playwright for every live-interaction check below.

3. **First-visit loader, frame-by-frame.** Polled `document.querySelector('.loader')` and
   `.loader--marked` every 200ms across a fresh browser context's first load of `index.html`.
   Confirmed: hairline lines grow, emblem settles, the wordmark SVG (`assets/img/brand/logo-text.svg`,
   12 paths) is fetched and inlined, `strokeDasharray`/`fillOpacity`/`strokeOpacity` were sampled
   mid-timeline and showed the letterforms genuinely stroke-drawing (`stroke-dasharray:
   465px,8.6px` at t=1200ms, `fillOpacity:0/strokeOpacity:1`) then inking in solid
   (`fillOpacity:1/strokeOpacity:0` at t=1800ms) before the whole loader translates off
   (`yPercent -112`, `srInOut`) — screenshots at t=700/1200/1800/2500ms visually confirm the
   full sequence. `.loader` is removed from the DOM and `sessionStorage.srSeen` flips to `"1"`
   at the same instant, ~3.6s after load (`t≈3600ms` in a 200ms-resolution poll), and
   `lenisRef.isStopped` flips `true→false` at that exact same poll tick, confirming
   `window.lenisRef.start()` fires correctly on loader completion (scroll is not left locked).

4. **Loader-does-not-replay / curtain-not-loader on internal nav.** In one browser context:
   let the first-visit loader finish on `index.html`, then `click()`ed the real `Menu` nav
   link and polled `hasLoader` / `.curtain` className every 50ms through the whole
   navigation. Result: `.loader` never reappears (`hasLoader: False` at every sample,
   before, during, and after the real page navigation), `.curtain` gains `is-active`
   immediately on click and keeps it through landing on `menu.html`, confirming the
   curtain — not the loader — governs same-tab internal navigation, exactly as specified.
   Also confirmed a plain full reload of the same page mid-session does not replay the
   loader (`sessionStorage.srSeen` already `"1"`).

5. **Arch curtain transition, deep dive** — see MO1 above. Methods used: (a) a dense
   90ms-step screenshot sequence across a real click-driven navigation; (b)
   `gsap.getProperty(curtain,'yPercent')` polled through the whole cover→land→reveal
   sequence; (c) direct `getComputedStyle(curtain).transform` / `getBoundingClientRect()`
   inspection; (d) an isolated from-scratch minimal repro created via `page.evaluate` that
   reproduces the exact 230%/2.3× figure with a synthetic element carrying only
   `.curtain`'s `transform`/`display` properties, and confirms either of two one-line fixes
   resolves it. Reproduced identically on `index.html`, `about.html`, `catering.html`,
   `contact.html`, `404.html`, and at three viewport heights (700/900/1080px).

6. **Reduced motion, full page set.** Loaded all 6 pages in a `reduced_motion: "reduce"`
   Playwright context and screenshotted top/mid/bottom scroll positions of each
   (`/tmp/.../scratchpad/probes/rm_*.png`). Every page rendered fully finished: index hero
   text/image/HUD all in place, no half-revealed `data-reveal`/`data-reveal-group` elements
   anywhere, catering's arch triptych and odometers already at final values (10/20/30) with
   no clipping, about's day-to-night hero already at a settled state with all three step
   lines visible, contact's HUD rows and compass fully drawn, 404's spilled-thread canvas
   painted a single valid static frame, and the menu page swapped its pinned film-strip hero
   for the calm stacked grid intro (matching the "desktop and motion-ok only" `gsap.matchMedia`
   gate). Confirmed via `sessionStorage`/DOM polling that under reduced motion the loader
   never appears and the curtain never activates on internal nav (instant, flash-free
   navigation).

7. **Marquee seam.** Confirmed the CSS keyframe (`tokens.css`: `@keyframes k-marquee { to {
   transform: translate3d(-50%,0,0); } }`) combined with `app.js`'s `measureMarquee()`
   duplicating the track content into two identical halves guarantees a mathematically
   seamless loop (translating exactly half the doubled width always lines the second half up
   where the first started). Verified live: `track.scrollWidth = 7720px` for the index dish
   marquee, animation `linear infinite`, and under reduced motion the track sits at its
   natural (untransformed) position showing only the first, non-duplicated portion in the
   viewport — no visible duplicate-text artifact.

8. **Offscreen canvas pause.** For both the index hero saffron-thread canvas
   (`[data-hero-threads]`) and the 404 spilled-thread canvas (`[data-nf-canvas]`), captured
   `canvas.toDataURL()` twice ~700ms apart while the canvas was in view (pixels changed —
   animation running), then again after `window.scrollTo`-ing the canvas far offscreen
   (pixels identical — animation paused), then again after scrolling back into view (pixels
   changed again — animation resumed). Confirms the `IntersectionObserver`-driven
   `play()`/`pause()` wiring in `SR.mountCanvas` genuinely stops the rAF loop offscreen
   rather than merely being invisible.

9. **Frame rate during Lenis scroll.** Injected a `requestAnimationFrame` timestamp
   collector and drove `window.lenisRef.scrollTo(y, {duration: 2.2})` on `index.html`
   (through the hero canvas + parallax bands) and `menu.html` (through the pinned
   film-strip scrub zone and into the plain menu list), sampling ~145 frames per run:
   - index 0→3000px: 145 frames, avg Δ16.67ms, **59.99fps**, 0 frames over 20.8ms
   - index 3000→7000px: 144 frames, avg Δ16.78ms, **58.59fps**, 1 frame at 33.3ms (single
     borderline frame, not a sustained stall)
   - menu 0→1800px (through the pin): 145 frames, avg Δ16.67ms, **60.00fps**, 0 dropped frames
   - menu 1800→5000px: 145 frames, avg Δ16.67ms, **60.00fps**, 0 dropped frames
   No meaningful jank; the pinned film-strip scrub in particular held a clean 60fps.

10. **Odometers land exact values.** Polled `[data-cat-count]` on catering mid-count
    (`8/14/16` on `10/20/30` targets) and ~2.5s later (`10/20/30` exact, no drift/overshoot);
    same for the home page's `[data-platter-stats]` counters and catering's own
    `[data-platter-bands]` counters post-scroll-trigger — all settle on exact integer
    targets with `power2.out` easing, no repeat-on-rescroll (ScrollTrigger `once:true`).

11. **Contact scramble + compass draw.** Confirmed `[data-hud-rows] .hud-row__v` resolves to
    the correct final strings (coordinates, address, hours, phone, services) after the
    `ScrambleTextPlugin` run. Confirmed the compass `[data-draw]` SVG's `stroke-dasharray`
    moves from a partial-draw state (`142px drawn / 197px gap`) to a fully-drawn state
    (`339px drawn / 0.1px gap`) after scrolling it into view.

12. **Menu pinned film-strip + carta wipe, desktop-only gate.** Read the `gsap.matchMedia`
    condition in `page-menu.js` (`"(min-width: 901px) and (prefers-reduced-motion:
    no-preference)"`) and confirmed via the mobile (390px) capture that the hero renders as
    a plain stacked list/grid with no pin, matching the "mobile keeps a designed, calmer
    motion pass" requirement. On desktop, screenshots through the scroll range show the
    three-cell row compressing to slivers, the dark carta panel wiping in from the right,
    and the real itemized menu (`Appetizers`, chapter numerals, prices) rendering
    chapter-by-chapter beneath it — matches the brief's staging exactly.

13. **About day-to-night interpolation.** Read `page-about.js`'s `render(t)` function and
    confirmed it mixes `--bg`/`--fg`/`--fg-soft`/`--fg-faint`/`--accent-text` from the same
    AA-checked token stops the rest of the site uses (not an invented ramp), driven by a
    scrub-linked `ScrollTrigger` (`start: "top top", end: "bottom bottom", scrub: .35`).
    Screenshots through the runway show a genuine gradual cream→ink transition (fully cream
    at scroll-in, a visibly mixed gray-brown mid-scrub, fully ink by the end of the pinned
    stage) with the progress bar (`data-dusk-bar`) and step opacity/translate advancing in
    lockstep. The later halal-pledge dark band is a separate always-on-dark chapter (per
    Lo'bat's "full-bleed alternating color bands" system, explicitly named in
    DESIGN-BRIEF.md), not a second scrub — working as designed, not a bug.

14. **Catering odometers + arch triptych rise.** Confirmed the hero timeline's `SplitText`
    title reveal, script/CTA stagger, `clipPath: inset(100%→0%)` dome rise on each
    `.cat-arch__ph`, and the `data-cat-count` odometers landing on exact 10/20/30 all fire
    in sequence and hold their final state. Confirmed the separate lag-ramped scrub
    (`scrollTrigger: { scrub: .4 + i*.5 }` per triptych figure) is wired and produces
    increasing drift per figure as designed.

15. **No-JS / boot-watchdog fallback.** Read the inline boot shim in every page `<head>`:
    a `sr-cover` class is applied pre-paint only when a loader/curtain is actually going to
    run, and a 4-second watchdog (`if (!window.__SR_BOOTED) ... classList.add("sr-noboot")`)
    force-clears the cover and hides `.loader`/`.curtain` via
    `html.sr-noboot .loader, html.sr-noboot .curtain { display: none !important; }` if
    `app.js` never boots — confirms a JS failure cannot leave the page permanently covered.

## Notes

- The single dropped frame in check #9 (index 3000→7000px, one frame at 33.3ms out of 144)
  is not treated as a finding — it is an isolated one-off, not a sustained stutter, and the
  same scroll range in the other three runs held a clean 60fps.
- MO1 was independently re-derived through three different investigative paths (visual
  screenshot timing, live GSAP property inspection, and an isolated from-scratch CSS/GSAP
  repro) before being written up, specifically to rule out a headless/Playwright artifact
  per this review's instructions — the repro does not involve scrolling, hover, or any of
  the flagged programmatic-scroll-vs-Lenis interactions, so it is not covered by the "known
  testing artifact" exemption and should be treated as a real, user-facing defect.
