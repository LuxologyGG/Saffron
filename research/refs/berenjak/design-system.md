# Berenjak (berenjak.com) — Design System Extraction

Source: live capture 2026-07-18, desktop 1440 / mobile 390, scroll sequence + full-page.
Stack: Next.js (App Router) + Sanity CMS, Vercel-hosted, design credit "Everything In Between".
Note: site sits behind a Vercel bot-challenge; captures were made through a request-relay, so JS bundle analysis (GSAP/Lenis detection) was limited — motion notes below are observed/computed, not extracted from source where marked (~).

## Palette (computed color frequency, homepage)
- `#E0E0E0` (rgb 224,224,224) — dominant ivory/bone text + line color on dark grounds (510 uses)
- `#27271E` (rgb 39,39,30) — primary ground: deep olive-charcoal ("black tea" green-black) (33)
- `#361811` (rgb 54,24,17) — footer ground: dark date/walnut brown (9)
- `#212121` / `rgba(33,33,33,.75)` — overlays, scrims
- Accent seen in photography/logo hardware: brass/saffron gold (physical brand, not a CSS token)
- Location pages shift ground hue per city (footer brown vs body olive) — sectional "room color" changes rather than one background.

## Type
- Display: **Triptych (serif)** — used for editorial serif moments, classical bookish feel, wide letter-spacing uppercase labels (tracking 2–4px, `uppercase`).
- Brand/display 2: **"Berenjak Sans"** — custom Persian-influenced Latin display face. Distinctive features: the J/A ligature with a diamond (Persian star/khatam motif) counter, flat-topped geometric letterforms echoing Kufic/Arabic script proportions. Used for the wordmark, city names ("DUBAI", "SHARJAH" — note the arch-shaped J), and giant section titles.
- Scale: giant edge-to-edge display setting — "OUR LOCATIONS" and footer "BERENJAK" run full-bleed, cropped by the viewport bottom (~300px+ cap height).
- Labels: small caps, letter-spacing 2.8px / 4px, e.g. "EST. 2023", "SCROLL DOWN", nav items.
- Body: Triptych serif, ~16px, generous line-height, ivory on dark.

## Spacing & grid
- 3-column card grid for locations (equal columns, ~64px gutters), country-name centered headers with hairline rules extending left/right (`QATAR ———`).
- Very tall sections, one idea per viewport; text blocks max-width ~600px, asymmetric 2-col splits (text left ~45%, full-bleed image right 50%+, image touches viewport edge).
- Footer is a mega-map: 8 columns of arrow-prefixed (→) links, then the cropped giant wordmark.

## Radii
- `100px` (pill buttons — "BOOK NOW" outlined pill), `6px`, `4px` (cards/inputs). Essentially: pills + near-square.

## Ornament / Persian motifs
- **Lion & Sun (Shir-o-Khorshid)** line-engraving as the header crest/logo mark.
- **Diamond/khatam star** embedded in the wordmark's JA ligature (also appears as ◆ in "SHARJAH" J).
- **RicePattern** component (class `RicePattern_*`): decorative repeating rice-grain pattern band.
- **Film-grain textures**: `img/grain_3.png` etc. layered over hero video/imagery for archival, smoky look.
- Hero: dark smoky particle field (embers/dust video) behind the wordmark — "kabab fire" atmosphere rather than literal tile patterns.
- Archival family photography (70s Iran beach photo) treated as pasted snapshots — heritage collage.
- Persian rug and interior photography carry the pattern language; the UI itself stays restrained.

## Motion (observed ~)
- `@keyframes scroll { 0% translateX(0) → 100% translateX(-100%) }` — infinite marquee/ticker (used for scrolling text bands).
- Scroll-down indicator: animated descending arrow under "SCROLL DOWN" label.
- News toast slides in bottom-right as a card carousel (1/5 pager, prev/next arrows).
- Section reveals: images and giant titles ease in on scroll (transform/opacity, ~0.6–0.9s, soft ease-out ~) ; giant titles are pinned/cropped at viewport bottom.
- Animated element count: ~1 CSS-animated element at rest; motion is JS-driven (Next/React; no GSAP/Lenis signatures found in inline HTML — rebuild-to-match).

## Component inventory
Header (crest + 3 links + pill CTA) · full-viewport hero with video + grain · intro serif statement · story split (text/archival photo) · location cards by country with hairline-rule country headers · news toast carousel · mega-footer with arrowed link columns + cropped wordmark.
