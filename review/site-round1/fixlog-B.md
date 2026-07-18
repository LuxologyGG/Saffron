# Fix-track B — Page-specific visual findings (council round 1)

Files owned/touched: `assets/css/pages/home.css`, `assets/css/pages/catering.css`, `assets/css/pages/menu.css`.
No HTML, app.css, tokens.css, or app.js touched. No hidden-until-JS states introduced. No em dashes.

## C2 (CRITICAL) — Purple crocus petal over "Hand-pressed" copy, home page
**Finding:** `.home-trio .fc-petal-1 { top: 34%; left: 3.5% }` (home.css:171) landed the opaque crocus-purple
petal cutout mid-word inside the first dish card's body copy, since `left:3.5%` is computed against the
full `.home-trio` section width (the float layer is `inset:0` over the whole section) not the card's text
column.

**Change:** `assets/css/pages/home.css`, `.home-trio` ornament block (was lines 170-173). Moved all four
ornaments (`fc-thread`, `fc-petal-1`, `fc-petal-2`, `fc-grain`) into the section's outer margin strip —
tight to the top/bottom edges and the outermost 0.4-0.6% horizontal inset, above the head or below the
repnote — so none of them can land inside the card text column at any breakpoint, including mobile where
cards stack full-width (previous `left:9%`/`right:12%` values were well inside the stacked column there
too). Verified no ornament/dish-card-text bounding-box overlap at 1440 and 390 via Playwright rect
intersection check (see verification below).

## M1 (MAJOR) — Catering pin-out collides with #platters stat numbers around scroll 2700px
**Finding:** `.spread.is-pinned { height: 220vh }` (catering.css:46) released the pinned tier board
(10/20/30) right as `#platters`' `.pstat__num` values (1/2/3) entered the viewport, so the two numeral
groups shared a row during the scrub's easing tail.

**Change:** `assets/css/pages/catering.css`:
- Bumped `.spread.is-pinned` height from `220vh` to `280vh` for more scroll runway before unpin.
- Added `#platters { padding-top: clamp(48px, 10vh, 120px) }` so the incoming section's stat numerals
  start further below the point where the pinned board finishes scrolling away, giving guaranteed
  clearance even under scrub-easing lag.

No JS change was needed: `catering.js`'s ScrollTrigger uses `start:"top top"`/`end:"bottom bottom"`
relative to the section's own height, so the per-tier animation fractions scale automatically with the
new pin depth.

Verified: scrolled 1440px viewport in 100px increments from 2400-3000px, checking
`.tier__num` vs `.pstat__num` bounding-box intersection at each step. Zero collisions across the full
range (previously found the run around 2700px, per the finding).

## N3 (MINOR) — Menu hand-drawn underline rougher than other ornaments
**Finding:** `.mcat__head .thread-divider { width: 100% }` (menu.css:182, inside a `max-width:1000px`
header) stretched the shared 520x14 squiggle path (`preserveAspectRatio="none"`) across up to 1000px,
distorting the curve's x-scale far more than the divider's narrower usages elsewhere on the site, reading
as a rougher hand.

**Change:** `assets/css/pages/menu.css`. Capped `.mcat__head .thread-divider` at `max-width: 460px`
(closer to the SVG's native 520-unit viewBox, so the stretch ratio matches the rest of the site's
thread-divider usage) and added `vector-effect: non-scaling-stroke` on the path so the stroke weight
stays visually consistent regardless of the container's scale.

## N2 (MINOR) — Mobile home large empty gap after day/night CTAs
**Finding:** `.dn-band { min-height: 110vh }` (home.css) is viewport-height-driven rather than
content-driven; two of these bands stack on mobile as the authored no-JS/reduced-motion truth, and short
copy + CTA content centered in a 110vh band reads as a large dead gap below the CTAs.

**Change:** `assets/css/pages/home.css`. Added a `max-width: 700px` override:
`.dn-band { min-height: 0; padding-block: var(--sect) }`, replacing the raw viewport-height figure with
the site's own `--sect` spacing token so mobile band height is driven by content + rhythm-consistent
padding instead of a fixed fraction of the viewport. Measured band height dropped from ~929px (110vh at
an 844px-tall mobile viewport) to ~281px, matching the rest of the page's section rhythm.

## Verification

- Served the repo with `python3 -m http.server 8199`, drove Chromium via Playwright
  (`PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers`).
- `home.html` at 1440x900 and 390x844: zero console errors; zero bounding-box overlaps between
  `.home-trio .float-cutout` ornaments and `.dish-card h3`/`.dish-card p` text.
- `catering.html` at 1440x900: zero console errors; scrolled 2400-3000px in 100px steps, zero
  bounding-box overlaps between `.tier__num` and `.pstat__num`.
- `menu.html` at 1440x900: zero console errors; underline screenshot captured for visual check.
- Mobile home `.dn-band` measured height: ~281px (down from ~929px), confirming the gap tightened to the
  spacing-token rhythm.
- Screenshots saved to `review/site-round1/fixB/`:
  - `home_trio_desktop.png`, `home_trio_mobile.png`
  - `catering_scroll_2700.png`
  - `menu_underline.png`
  - (no `catering_collision_*.png` files were produced, since the automated per-100px collision check
    found zero collisions across the whole 2400-3000px range)
