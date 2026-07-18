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
