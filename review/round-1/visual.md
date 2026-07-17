# Visual Lens Review, Round 1

Reviewer: VISUAL lens. Site: Saffron and Rice (/home/user/Saffron). Served on localhost:8135.

## Score: 7.2 / 10

The site executes the DESIGN-BRIEF chapter grammar (ghost numeral, mono eyebrow, display
title with italic emphasis, script annotation, hairline rule, footnote) faithfully and
repeats it across six pages without feeling like a template, thanks to real layout variety
(odometer stats, film-strip menu scrub, FAQ two-column, HUD coordinate readout, sticky
day-to-night hero). Arch masks are consistent (round dome for imagery, ogee for hero
signatures), ghost Persian words and numerals sit behind content at correctly low opacity,
type scale steps are deliberate, and mobile keeps the hierarchy legible with comfortable
75px nav tap rows. It is held back from award-ready by one systemic, sitewide spacing
defect (dead, unornamented gaps between same-background chapters) and one real photography
curation miss (a prop-cluttered hero photo), plus small polish misses in numeral glyph
choice and card-height rhythm.

## Findings

| ID | Severity | Location | Finding | Fix |
|----|----------|----------|---------|-----|
| VS1 | MAJOR | Sitewide: `index.html` `#reviews`→`#visit`, `catering.html` `#platters`→`#combos`, `#combos`→`#how`, `#faq`→`#order`, `about.html` every chapter join (`#turn`,`#cooking`,`#halal`,`#beliefs`,`#reviews`,`#visit`), `contact.html` `#essentials`→`#map` | Every `.chapter` section uses `padding-block: var(--sect)` (clamp 80px–200px) on both top and bottom. When two chapters share the same cream background (no color-band break to carry visual interest), the stacked padding produces a plain, ornament-free gap measured at 273–346px at 1440px viewport (confirmed live via bounding-box measurement: index reviews-footnote-to-visit-numeral = 273.6px; catering combo-footnote-to-how-numeral = 346px; about, every chapter pair = 346px; contact essentials-to-map = 346px). This reproduces identically under `prefers-reduced-motion: reduce`, so it is a base-CSS layout fact, not a motion artifact. The brief explicitly calls for "dead space earns its keep (thread ornaments, mono readouts, ticks) without clutter" — these gaps currently carry nothing: no thread line, no tick, no mono readout, just blank paper. On a 1920px+ desktop the gap grows past 346px since `--sect` clamps at 200px per side. It reads as an air pocket, not a considered pause, especially since the two-chapter run happens 3–5 times per page. | On same-background consecutive chapters, either (a) drop the leading chapter's `padding-bottom` or the trailing chapter's `padding-top` to `--sect-sm` or less so the pair reads as one breath instead of two, or (b) fill the gap with the ambient detailing the brief promises elsewhere (a faint saffron-thread line, a centered accent tick, a small mono readout) so the space is authored rather than incidental. Menu.html does not have this problem because its `.msec`/`.mband` categories interleave photo bands between carta sections — use that interleaving pattern (or the fix above) on the other four pages. |
| VS2 | MAJOR | `index.html` `#sofreh .band__media img` (`assets/img/home-menu-teaser.jpg`), full-bleed chapter-03 band, also feeds the film-strip source pool referenced in `menu.html` | The source photo used for the full-bleed "One cloth, many hands" band shows a blue plastic order-number tag on a toothpick stuck directly into the fesenjoon dish (visible in the top-left plate and, more prominently, in the dark stew plate at image-right, confirmed both in the raw asset and in the live render at 1440px). It reads as a restaurant table marker, not deliberate styling, and is the single most eye-catching object in the frame at chapter-03 scale because of its saturated blue against a warm, dark, mostly red/gold palette everywhere else on the site. This runs against the brief's own "documentary but polished" food-styling direction (Berenjak system: warm dark documentary styling, not theme-park clutter) and is a genuine crop/curation miss, not a rendering bug. | Recrop tighter to exclude the tag and the visible forks/butter packet at image edges, or swap to an alternate frame from the same shoot per the brief's stated one-line-swappable imagery system in `data.js`. If no clean alternate exists, clone-retouch the tag out; it is small and isolated enough to remove without disturbing the dish. |
| VS3 | MINOR | `catering.html` `#how .step__num` (line 219, `<span class="step__num" aria-hidden="true">1</span>`) | The "Three steps to a full table" mini-chapter numbers its three columns 1/2/3 at large ghost scale in Cormorant Garamond. Rendered, the standalone "1" (no leading zero, unlike every other chapter numeral on the site which uses "01"/"02" etc.) produces a serif glyph with top and bottom serifs that is visually indistinguishable from a capital "I", while "2" and "3" read as ordinary numerals sitting right next to it — confirmed by pixel crop, the sequence visually reads "I, 2, 3" not "1, 2, 3". This breaks the numeral-progression convention used everywhere else on the site (which always double-digits: 01, 02, 03...) and is a real, if small, legibility snag. | Format these as "01"/"02"/"03" to match every other numbered element on the site, or set `.step__num` in the mono font (`--font-mono`) instead of the display serif, where "1" cannot be misread as "I". |
| VS4 | MINOR | `index.html` `#reviews` grid, third card (Frida / Yelp 2024), `.review-card` or equivalent | The reviews grid is a 3-up row of equal-height cards with attribution pinned near the bottom. Because quote length varies a lot (Shakira: 5 lines, Florence: 4 lines, Frida: 2 lines) and the row is forced to one shared height, Frida's card carries roughly 60–70px of unclaimed vertical whitespace between the end of her quote and the "— FRIDA YELP, 2024" line, while the other two cards read tight and intentional. `about.html`'s equivalent reviews section avoids this by laying out 4 reviews in a 2x2 grid where row height is set per row, not across the whole set, and reads far more even. | Either cap/pad quote length so all three read within one line-count of each other, switch the index reviews grid to the same 2x2 (or independent-row) pattern used on about.html, or vertically center the quote block within the card instead of top-aligning it so the leftover space distributes above and below rather than pooling under the text. |

## Notes / things checked and NOT filed (ruled out as capture or environment artifacts)

- Loader-only screenshots: `review/round-1/capture/*/screenshots/mobile_390_*.png` and several
  `desktop_1440_full.png`/`desktop_scroll_00.png` frames show only the centered emblem/logo
  loader, not page content. Confirmed this is the sessionStorage-gated first-visit loader
  firing on the capture tool's fresh browser context (per task brief), not a stuck or broken
  state — re-rendered live with a 4s wait and the real hero/content appears correctly on every
  page (index, menu, catering, about, contact, 404, both viewports).
- Gray placeholder arches on `menu.html` (`desktop_1440_full.png`): confirmed these are
  lazy-loaded images (`loading="lazy"`) that the capture's full-page screenshot mode caught
  before the scroll-triggered load fired. Re-rendered live with a scroll-through pass; all
  chapter-break arch photos load and crop correctly (round dome mask, warm documentary
  tablescape, tea and dates spread).
- Odometer counts mid-animation ("9 GUESTS", "17 GUESTS", "26 GUESTS" instead of 10/20/30;
  "7/10/8 SERVES" on catering mobile hero instead of 10/20/30): confirmed these are the
  odometer count-up animation caught mid-flight by the scroll capture's timing. Final state
  (verified live and in `prefers-reduced-motion: reduce`) always settles to the correct
  10/20/30.
- Scramble-text eyebrows caught mid-scramble ("CATERING AND PARTY PLATTERP", "THE MARKETZMXQCP",
  "COORDINATES AND HOURM"): confirmed via live timing test (`.hero-kicker` textContent polled
  every 200ms) that `ScrambleTextPlugin` starts around 2.4s and settles to the correct final
  copy by ~3.2s. Not a copy bug.
- Large solid-black regions at the top of `about.html` full-page captures (desktop and mobile):
  confirmed this is the ScrollTrigger pin spacer for the sticky day-to-night hero (ground fades
  cream to ink while chapter numerals 01/02/03 advance in place); scrolled through it live and
  the pinned content (market-to-kitchen story, Persian script line, coordinates) renders
  correctly frame by frame, matching the brief's described About signature.
- Hard, unornamented straight-line join between the black hero and the first cream chapter on
  `index.html`: initially flagged as a candidate "hard ugly join," but the brief's form
  language explicitly reserves curvature for the arch motif only ("Hard edges everywhere,
  with a single heritage curve") — a flat color-band edge here is on-brief, not a defect.
- `.measure` (62ch) on `catering.html` lead paragraphs computes to ~806px at 1440px viewport;
  confirmed via `getComputedStyle` this is correct `ch`-unit math for Manrope at
  `--fs-lead` (~21.6px), not an unconstrained/overflowing measure.
- Optical alignment: nav logo, footer "FIND US" column, and chapter body copy (title, not
  ghost numeral) all left-align to x=72px at 1440px viewport (confirmed via bounding boxes on
  index.html). The ghost numeral itself sits ~7px inside that line, which is normal optical
  inset for an oversized serif "0" glyph, not a gutter mismatch.
- Pomegranate price text (`--price #7c3034`) on paper (`#f7f1e6`): computed contrast ratio
  ≈8:1, comfortably AA, matching the brief's "AA-checked at each stop" claim.
- Arch mask usage audited across all six pages: round dome (`.arch`) used for content imagery
  (chapter photos, map, footer logo), pointed ogee (`.arch--ogee`) reserved for hero-signature
  moments (index hero, 404 doorway glow) — consistent with brief, no mixed usage found.
- Ghost Persian word/numeral legibility: spot-checked `#fire` on index (ghost "کباب" behind
  chapter-02 price cards) — sits at low opacity behind content, does not muddy the price cards
  or copy.
- Teal alternate dark stage (`on-teal`) usage: 1 use each on index, catering, contact; 2 on
  menu; 0 on about/404 — consistent with brief's "sparing" instruction, not overused.

## Checks run

1. Read every file in `review/round-1/capture/{index,menu,catering,about,contact,404}/screenshots/`
   (desktop full/viewport, desktop_scroll_00 through the last available step, mobile
   full/viewport) with the Read tool.
2. Read `DESIGN-BRIEF.md` and `assets/css/tokens.css` in full to establish the type scale,
   spacing scale (`--sect`, `--gutter`, `--measure`), arch/hairline form language, and motion
   contract before judging conformance.
3. Served the repo on `localhost:8135` and drove Playwright (Chromium) directly for live
   verification of every candidate finding, at both 1440x900 desktop and 390x844 mobile
   viewports, including: fresh-context loader timing, lazy-load image settling, scramble-text
   timing, odometer settle state, ScrollTrigger pin behavior on about.html, `reduced-motion:
   reduce` full-page render, and mobile hamburger nav open state.
4. Measured live DOM geometry (`bounding_box()`) for: gutter alignment of nav/chapter/footer
   across index.html; inter-chapter gap sizes on index, catering, about, and contact
   (`#id` to `#id` first-content-top vs last-content-bottom deltas); `.lead.measure` computed
   width vs `--measure` token; tap-row height of the mobile overlay nav links.
5. Opened the raw source image `assets/img/home-menu-teaser.jpg` directly to confirm the
   blue order-tag prop is in the original asset, not a rendering artifact.
6. Cross-checked `.step__num` HTML source in catering.html against its rendered glyph via a
   pixel crop to confirm the "1"-reads-as-"I" issue is real and not a screenshot compression
   artifact.
7. Grepped `tokens.css` and page CSS for `.arch`, `on-teal`, `on-dark`, `.measure`, hairline
   rule classes to confirm consistent usage rules and computed values referenced above.
8. Computed WCAG contrast ratio by hand for `--price` (pomegranate) on `--paper` to confirm
   the brief's AA claim for the one accent-adjacent color most likely to be marginal.
9. Compared chapter-01 desktop layout against `review/composites/02-build-vs-REF-index-
   chapter-khufus-skeleton.png` for craft reference only (numeral/eyebrow/title/body/rule/
   image placement match the reference system closely).
10. Read `review/composites/` listing to confirm no other composite offered relevant
    spacing/hierarchy reference beyond the one used.
