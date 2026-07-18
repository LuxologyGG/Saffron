# Round 2 fix notes

One paragraph per item. All work done directly in the local tree; the orchestrator owns
git history for this pass.

## 1. BM-R2-1 + MO-R2-2, loader rework

Rebuilt `runLoaderTimeline` in `assets/js/app.js` with explicit, overlapping positions instead
of chained relative offsets: hairlines 0 to .5s, seal settle .1 to .6s, wordmark stroke-draw .3
to .95s with the fill overlapping the last .3s of the draw, kicker/mission/script fading in
alongside from .35s, and the exit lift starting a minimal `+=.12` after the content group ends
(.72s duration). Measured end-to-end in a fresh Playwright context (in-page
`performance.now()`, not wall-clock across the Python/CDP boundary): loader removed at
~2.35s from navigation start, ~2.0s from the loader actually mounting, comfortably under the
2.4s ceiling in both the normal and the delayed-wordmark path. Added `p.loader__mission`
bound to `company.mission`, folded into the same reveal group as the kicker. Added a mono
`.loader__skip` "Skip" button (46px tall via the shared `.btn` component, top-right, paper text
on the ink ground, `--focus` locally repointed to `--accent-lite` for a visible focus ring) that
calls `loader._tl.progress(1)`; Escape does the same via a document keydown listener that is
torn down in the timeline's `onComplete`. Folded in MO-R2-2: `runLoaderTimeline` now exposes
`loader._tl`, and the wordmark fetch's `.then` replaces the hard `el._started` guard with a
`tl.time() <= 0.35` window that, when true, swaps the SVG in and plays a standalone injected
draw/fill/stroke-fade tween so a late-arriving mark still draws instead of popping in fully
inked. Verified: skip-by-click removes the loader in ~0.18s with no console errors; Escape
removes it; a simulated 250ms route delay on `logo-text.svg` still shows `loader--marked` with
`fillOpacity: 1` / `strokeOpacity: 0` at 1.55s (screenshot confirms the wordmark fully drawn);
second navigation shows no loader; reduced motion shows no loader at all; console silent in
every case.

## 2. MO-R2-1, index scroll jank

Chose the image-decode approach over pre-splitting SplitText: it is a small, local change to
one shared helper (`onceEnter` in `assets/js/app.js`) rather than restructuring the documented
"reveals are LAZY" contract that the reduced-motion/JS-stall guarantees depend on. `onceEnter`
now collects any `<img>` inside the trigger element and calls `img.decode().catch(()=>{})` on
each before invoking the reveal callback, so a still-decoding arch photo (the likeliest jank
source, since the clip-path reveals sit directly on large portrait crops) no longer forces a
synchronous decode on the same frame as the tween's first paint. Measured with a Playwright
`requestAnimationFrame` sampler during a simulated Lenis wheel sweep of the full index page (3
trials each, 1440px): before, frames over 34ms averaged 6.67 (6, 7, 7); after, 4.00 (3, 6, 3).
That is a real, repeatable improvement but not a clean "2 or fewer" every run; this sandbox's
headless Chromium appears to have its own scheduling noise (a documented artifact elsewhere in
this project: programmatic scroll does not perfectly reproduce real input), and the noise shows
up on both sides of the comparison. No console errors in any trial.

## 3. VS-R2-5, sofreh quote mobile scrim

At `max-width: 900px` in `assets/css/home.css`, `.ch-sofreh__band::after` now runs a taller
(92% vs 66%) four-stop gradient (92%/78%/30%/0% ink) instead of the two-stop desktop version, so
the scrim reaches further up under a bright crop before fading to transparent. Verified with a
390px screenshot of `#sofreh`: the pull-quote and "FROM OUR KITCHEN" cite read cleanly over the
new photo with no contrast complaints.

## 4. VS-R2-3, catering platters-to-combos gap

Re-measured first, as instructed: with `chapter--tight`/`chapter--close` already in place the
footnote-to-numeral gap was 309.6px at 1440, over the ~260px ceiling. Added join-scoped
overrides in `assets/css/page-catering.css` (`#platters.chapter--close` /
`#combos.chapter--tight`, both `clamp(50px, 5.4vw, 74px)`) instead of touching the shared
`--sect-sm` token other joins on the page still use, and tightened `.ch-gap`'s own
`padding-block` to `clamp(14px, 1.8vw, 22px)`. Re-measured: gap now 232px (74 / 22 / 40 thread /
22 / 74), and because both halves use the same clamp value the thread ornament lands exactly
centered by construction, no extra centering rule needed.

## 5. VS-R2-7a, contact teal call band counterweight

Added a right-aligned mono readout to `#visit-us` in `contact.html`: restructured the section's
`.wrap` into `.ch-call__grid` (existing content in `.ch-call__col`, a new `.ch-call__readout`
aside), with an "ON THE HIGHWAY" eyebrow and three `hud-row` pairs (Hours, Today, Located) bound
via `data-bind` to `company.hours.short`, `company.hours.days.0.t`, and
`company.address.street`, the same vocabulary as the contact hero's own HUD. Collapses to a
single left-aligned column under 900px. Uses the existing `.eyebrow`/`.hud-row__v` tokens
(`--fg-soft`/`--fg-faint`, already AA-checked on the teal scope), no new colors. Verified at
1440: the right half is no longer empty and the block reads as an intentional part of the house
HUD vocabulary rather than a form.

## 6. VS-R2-7b, catering order review card

`.close-review .review` no longer gets `height: 100%`; `.close-review` instead gets
`align-self: center` inside `.close-grid` (which still uses `align-items: stretch` for the row,
but the grid item itself now opts out via its own align-self). The review card keeps its
natural content height and centers next to the taller dome CTA panel, so `.review__who`'s
`margin-top: auto` no longer gets stretched into a visible gap. Verified with a screenshot: the
quote and byline sit together with normal internal spacing, no dead zone.

## 7. BM-R2-2, about section 02 media

Swapped the `#turn` arch figure from `about-kitchen.jpg` (which the dusk hero already owns) to
`menu-kabab.jpg`, with a new `.ab-media__img--kabab { object-position: 50% 46%; }` tuned so the
arch crop lands on the skewers rather than the smoke above or the coals below, given the
container's 4:4.7 aspect against the source's much taller native ratio. Alt text updated to
"Koobideh skewers grilling over glowing charcoal, smoke rising off the flame", matching what is
actually shown (the previous alt text already described a grill scene, mismatched against the
old kitchen-interior image, so this also fixes an existing alt/image mismatch). Verified with a
1440px render: the section now reads distinctly from the hero.

## 8. BM-R2-3, index catering chapter platter chip

Added one small arch-masked photo (`catering-platters.jpg`, decorative, `alt=""`) beside the
odometer trio in `#catering`, wrapped in a new `.pstats-band` flex row (`.pstats` at `flex: 1`,
the chip fixed at `clamp(84px, 8vw, 128px)` wide, `aspect-ratio: 4 / 4.7`, matching the site's
arch-photo scale elsewhere, e.g. `.cat-band__arch`). Hidden at `max-width: 900px` alongside the
page's other decorative-only elements. Verified at 1440: the chapter now has one supporting
image without competing with the odometer numbers for attention.

## 9. BM-R2-4, hero arch scroll growth

Added a `gsap.matchMedia` block in `assets/js/home.js` scoped to
`(prefers-reduced-motion: no-preference)` that scrubs `.hero__arch-mask img` from `scale: 1` to
`1.06` over a ScrollTrigger on `.hero` (`start: "top top"`, `end: "bottom top"`, `scrub: true`).
Wired to arm only via `tl.call(armArchScrollGrowth)` at the end of the existing hero intro
timeline (which already tweens the same element's scale from 1.18 down to 1), so the two never
fight over the same transform; the scrub always starts from the exact resting value the intro
leaves behind. Verified by sampling the computed transform at five scroll positions: scale rose
smoothly and monotonically from 1.0 at scrollY 0 to 1.048 at scrollY 900 (heading to 1.06 as the
hero's own height scrolls past), no jumps, console silent. Reduced-motion context: transform
stays `none` at any scroll position, confirming matchMedia skips the effect entirely rather than
just leaving it in a static end state.

## 10. BM-R2-5, contact hero scramble scoping

Removed `data-scramble` from the Coordinates, Address, and Phone `dd` values in the hero HUD
(`contact.html`) and replaced it with `data-reveal="fade"`, per the brief's explicit scope
(zip/coordinates/phone/address); the "Coordinates and hours" eyebrow and the Hours/Services
values, which were not called out, keep their scramble. Verified with a 1.2s-post-load
screenshot of a returning-visitor context (loader bypassed via `sessionStorage.srSeen`, since a
first-time visit would still be under the ~2s loader at 1.2s and never reach the hero content):
every HUD value renders as clean final text, no scrambled digits anywhere.

## 11. BM-R2-6, peopled photography

Screened Pexels candidates against "restaurant counter service", "kebab shop staff", "middle
eastern restaurant people", and "chef serving customers"; most hits were posed camera-facing
shots, a food-truck photo with a legible sticker logo, or too dark/nightlife-toned for the set.
Photo 20488508 (Gül Işık, Pexels license) cleared every bar: several hands candidly reaching
across a shared table of dates, walnuts, olives, and dips, mid motion, no faces, no branding,
and it directly echoes the sofreh chapter's own title ("One cloth, many hands"). Resized to
1067x1600 (1600px max side), warm-graded (brightness 0.94, +10% saturation, warmer channel
balance) to sit with the rest of the set, saved at quality 74 as `assets/img/kitchen-people.jpg`
(121KB, under the 280KB target). Swapped into `#sofreh`'s `.band__media` on index.html only;
`home-menu-teaser.jpg` is untouched and still used on catering.html. `PHOTO-MAP.md` got a new
slot row plus a caveat note documenting the swap and the candidates that were rejected.
Verified at 1440 and 390 with the strengthened scrim from item 3: the quote reads cleanly over
the photo at both widths.

## Final sweep

Console sweep across all six pages (index, menu, catering, about, contact, 404) at 1440px and
390px, each loaded, settled 3.2s, and scrolled through in eighths: zero errors, zero warnings.
Reduced-motion full-page screenshots of index, about, and contact: every effect lands in its
finished state (odometers at final counts, HUD rows at final text, images fully visible, no
half-revealed content). Em-dash sweep of every changed HTML/CSS/JS file (about.html,
assets/css/{home,page-about,page-catering,page-contact,app}.css, assets/js/{app,home}.js,
contact.html, index.html): clean. `research/photos/PHOTO-MAP.md` also changed (one new row, one
new caveat paragraph); the lines I added are clean, but the file carries pre-existing em dashes
from the original research pass that predate this round and were left alone as out of scope for
an internal research doc. Both dev servers (8154, and the temporary 8155 used for the before/
after FPS worktree comparison) were killed at the end of the session.

## Round 2, accessibility pass (5 items)

### 1. AX-R2-2, dusk scrub parked contrast

The root cause: `render(t)` mixed `--bg` from paper toward ink and `--fg` from ink toward
paper on the SAME `t`, so at any parked position both landed on nearly the same mid-tone by
construction, and by IVT a plain crossfade of two colors moving in opposite directions must hit
1:1 contrast at exactly one instant regardless of easing. Fixed `assets/js/page-about.js` by
replacing the linear mix for every foreground token (`--fg`, `--fg-soft`, `--fg-faint`,
`--accent-text`) with `pickFg()`, which every frame chooses whichever of the token's ink-side or
paper-side anchor currently reads better against the live `--bg`, and only in the narrow sliver
where neither clears the AA target (4.75, a buffer above the legal 4.5) numerically bisects that
anchor toward true black or white until it does. Outside that sliver the output is bit-identical
to the old anchors, so resting states are untouched. Also fixed the inactive-step opacity floor
(previously `.26`, effectively ~2:1 with any real text): raised the base floor to `.6` and added
`safeOpacity()`, the same bisection idea applied to alpha-blend-over-bg instead of hue. Kicker
(`fg-faint`) and body line (`fg`) now get independently computed opacities instead of one shared
value, because fg-faint's own full-opacity contrast against the paper extreme is only ~5.24:1,
thin enough that a shared floor driven by its worst case would force the whole row to ~0.95
opacity and erase the dim/arrived read entirely; splitting them lets the body line dim to a real
~.6 while the kicker, which has less room to give, holds its own higher floor. Verified with a
Playwright parked sweep (lenis/scroll-jump to y = 0, 200, ... 2160 [runway end], plus 2260 past
it) sampling the actual computed `--bg`/color of `.ab-dusk__addr`, `.ab-dusk__kicker`, both
`.ab-dusk__line`s, and both step children (blending in each element's live opacity by hand before
computing contrast). Worst reading across the full sweep (also cross-checked at a 40px step):
4.705-4.717:1, comfortably above 4.5 everywhere; title lines never dropped below 4.6:1 (well
past the 3:1 large-text floor). Console silent throughout. Sweep table (200px steps, contrast
ratios; title is both lines, identical value):

| y (px into runway) | bg | addr | kicker | title | step1 text / kicker | step2 text / kicker |
|---:|---|---:|---:|---:|---:|---:|
| 0 | rgb(247,241,230) | 5.24 | 8.61 | 17.25 | 4.91 / 4.75 | 4.91 / 4.75 |
| 200 | rgb(226,220,210) | 4.80 | 7.10 | 14.22 | 4.76 / 4.77 | 4.76 / 4.77 |
| 400 | rgb(204,199,190) | 4.76 | 5.76 | 11.52 | 4.73 / 4.73 | 4.73 / 4.73 |
| 600 | rgb(183,178,169) | 4.75 | 4.75 | 9.19 | 4.77 / 4.72 | 4.77 / 4.72 |
| 800 | rgb(161,157,149) | 4.79 | 4.78 | 7.18 | 4.76 / 4.76 | 4.76 / 4.76 |
| 1000 | rgb(140,135,129) | 4.78 | 4.77 | 5.45 | 4.74 / 4.75 | 4.74 / 4.75 |
| 1200 | rgb(118,114,109) | 4.77 | 4.77 | 4.77 | 4.75 / 4.75 | 4.75 / 4.75 |
| 1400 | rgb(97,93,89) | 4.76 | 4.77 | 5.80 | 5.80 / 4.76 | 4.76 / 4.74 |
| 1600 | rgb(75,72,69) | 4.75 | 4.75 | 8.08 | 8.08 / 4.75 | 5.24 / 4.73 |
| 1800 | rgb(54,51,48) | 4.77 | 5.89 | 11.17 | 11.17 / 4.77 | 9.19 / 4.74 |
| 2000 | rgb(32,30,28) | 4.86 | 7.79 | 14.78 | 14.78 / 4.86 | 14.78 / 4.86 |
| 2160 (end) | rgb(15,13,12) | 5.67 | 9.09 | 17.25 | 17.25 / 5.67 | 17.25 / 5.67 |
| 2260 (past end, clamped) | rgb(15,13,12) | 5.67 | 9.09 | 17.25 | 17.25 / 5.67 | 17.25 / 5.67 |

### 2. AX-R2-3, skip-link vs overlay menu

`setMenu(true)` sets `inert` on `#main`, the footer, and the header's nav/brand, but the
skip-link sits before the header in the DOM so it was never in that inert set, remaining
Tab-reachable (via Shift+Tab back out of the menu, or forward-Tab wraparound) while the overlay
was open. Its click handler unconditionally targeted `#main`, which was inert at that point, so
`main.focus()` silently failed: a reachable but dead no-op. Fixed `initSkip()` in `assets/js/
app.js` to call `setMenu(false)` first when the menu is open, before scrolling to and focusing
`#main`, so activating the skip-link now always works. Verified with a real Tab-cycle at
390x844: opened the overlay, pressed Tab through all 5 menu links/CTAs, wrapped through `BODY`
to the skip-link, pressed Enter, and confirmed via `document.activeElement`/`body.classList`/
`#main`'s inert attribute that the menu closed and focus landed cleanly on `<main id="main">`.

### 3. AX-R2-5, catering hero scrim

Deepened `.cat-hero__bg::after` in `assets/css/page-catering.css`: raised the gradient's weakest
stop from 84% to 90% ink, bumped the top/bottom stops (92%/90% to 94%/96%), and added a fourth
stop at 68% (96%) specifically covering the band where the triptych's serve-count numerals and
captions sit, since that was past the old weak point. Verified by hiding the numeral text via JS
and pixel-sampling a screenshot at 1440 in a tight box around each numeral's original position
(so the sample reads the true photo+scrim ground, not anti-aliased glyph edges): brightest pixel
behind "10"/"20"/"30" now reads 15.5 / 14.9 / 15.3:1 against the paper-colored numeral text, up
from ~12-12.6:1 before the change (own baseline measurement; well past the 3:1 floor either way).
Also confirmed the visible gap between each caption and its arch photo (≥14px) so the deepened
scrim doesn't bleed into or flatten the unrelated arch-dome food photography below.

### 4. AX-R2-6, menu strip caption fade

`assets/js/page-menu.js`'s pinned film-strip timeline tweened `restCaps` opacity 1 to 0 over a
0.9-unit duration with a 0.55 stagger, out of a pin whose captions can sit semi-transparent (and
still `visibility: visible`, so still hit-testable and screen-reader-exposed) over bright strip
photography for a wide swath of the scrub. Switched to `autoAlpha` (opacity + `visibility`
coupled, so a faded-out caption is properly `hidden` once it reaches 0, not just invisible-looking)
and compressed duration to 0.08 with a 0.12 stagger, a "short beat" instead of a slow drift.
Verified two ways: (1) parking at 3 generic mid-pin positions (20/50/80% of the pin's scroll
range) shows every caption at a clean `opacity:1/visibility:visible` or `opacity:0/
visibility:hidden` pair, never in between; (2) a fine 0.5%-step scan across the whole pin
confirmed the theoretically-unavoidable transitional window (a continuous tween must cross every
intermediate value) shrank from roughly 33% of the pin's scroll range before the fix to about
4-5% after, i.e. from a wide, easily parked-on band to a narrow sliver a normal scroll gesture is
unlikely to land on and rest at.

### 5. AX-R2-7, prerendered data-bind fallbacks

`bindData()` in `assets/js/app.js` unconditionally overwrites `textContent` from `window.SITE`
when a value exists, so prerendering the exact matching string is idempotent by construction (no
flash, no mismatch). Filled every empty `[data-bind]` element on `catering.html` (both hours
label/note pairs in the hero note and the CTA dome, plus `company.halal.beef`/`.chicken`),
`about.html` (the dusk hero address line, `company.story`, `company.intro`, both halal claims,
and the visit section's address/hours label/hours note), and `index.html` (`company.story`,
`company.intro`) with the verbatim strings from `assets/js/data.js`. Verified with
`java_script_enabled=False` on all three pages: zero `[data-bind]` elements with empty
`textContent` remain on any of them.

### Final sweep

Console check across all six pages (index, menu, catering, about, contact, 404) at 1440x900 and
390x844, each loaded, settled ~1.2s, and scrolled through in eighths: zero errors, zero warnings
everywhere. Reduced-motion full-page screenshot of about.html: the dusk hero renders at its
finished ink/night ground with every title line, step, and the address line fully legible (no
partial reveal, matching the CSS default `.on-dark` fallback), and every other chapter (cook
cards, halal pledge, beliefs, reviews, visit) shows fully-revealed content. Em-dash sweep
(literal U+2014, plus U+2013/U+2015 as a broader check) of every file touched this pass
(`assets/js/page-about.js`, `assets/js/app.js`, `assets/js/page-menu.js`,
`assets/css/page-catering.css`, `about.html`, `catering.html`, `index.html`): clean. Dev server
on port 8158 was killed at the end of the session.
