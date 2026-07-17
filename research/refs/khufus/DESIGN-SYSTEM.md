# KHUFU'S — khufus.com — Design System Recon (R2a)

Awwwards Honorable Mention, May 2026. Egyptian heritage fine dining at the Giza Plateau.
PRIMARY structural reference for Saffron and Rice: heritage-luxury restraint, slow-reveal scroll
storytelling, negative space, atmosphere-first. **We document the SYSTEM only — never copy assets,
fonts, images, or exact palettes.**

Captured 2026-07-17 at 1440 and 390. Evidence: `screenshots/` (`post_intro_desktop_00..16` and
`post_intro_mobile_00..10` are authoritative — the plain `desktop_scroll_*` series was partially
consumed by the intro overlay), `menu/screenshots/` (inner page), `tokens.json`, `styles.css`,
`libraries.json`, `page.html`.

Platform note: WordPress + Elementor + Astra, with the award-grade parts implemented as **custom
plugin sections** (class prefixes `khf-`, `khx-`, `kh-`, `mps5-`, `pnav-`, by studio "MonArq").
The polish lives entirely in those custom sections, not the framework.

---

## 1. Type stack and scale (measured)

Three-voice system — a light display serif, a workhorse grotesque, and a handwritten script accent:

| Voice | Family (theirs) | Role |
|---|---|---|
| Display serif | IvyOra Display (woff2, weights 100–700; w300 "Light" is the default display weight; true italics used for emphasis words) | All H1–H3, big menu words, footer wordmark |
| UI/body grotesque | Bricolage Grotesque (variable TTF) | Kickers, body copy, buttons, nav panel, captions |
| Script accent | Golden Hopes (cursive, single weight) | Handwritten annotations under titles, polaroid captions |
| Framework leftovers | Inter, Plus Jakarta Sans, Roboto | Astra/Elementor defaults — NOT part of the visual identity |

Measured values (1440px viewport):

- Root/body font-size: **18px**; body line-height 29.7px (1.65).
- **Hero H1**: IvyOra 300, **64px / 65.92px line-height (1.03)**, letter-spacing 0.64px (0.01em),
  white, caps, with the final word set in *italic* as emphasis ("...PART OF THE *TABLE*").
- **Section H2** (e.g. "DINING AT THE EDGE OF HISTORY"): IvyOra 300, **45px**, uppercase, with the
  first word italic. CSS-authored section titles: `clamp(30px, 2.5vw, 44px)`, line-height **0.98**.
- CTA finale title: `clamp(28px, 3vw, 46px)`, line-height 0.98, letter-spacing 0.018em, uppercase,
  emphasis words in `font-style: italic; font-weight: 700`.
- **Ghost chapter numerals** ("01"–"08"): IvyOra 300, `clamp(78px, 8vw, 146px)`, color
  `rgba(92,71,43,0.08)`, line-height 0.8, absolutely positioned behind the kicker/title block.
- **Kickers/eyebrows**: Bricolage 10–11px, weight 400–500, uppercase, letter-spacing
  **0.22em–0.34em** (measured 2.2–3.74px). This extreme tracking on tiny caps is a signature.
- **Body**: Bricolage 13–14px, weight 300–400, line-height **1.78–1.85**, max-width 470px (66–72ch
  for centered blocks).
- Footnotes/annotations: 11px, line-height 1.72, 60% ink.
- **Script accent**: Golden Hopes `clamp(22px, 1.7vw, 30px)`, `transform: rotate(-2deg)`,
  offset `margin-left: 88–98px` so it overlaps the title's last line like a signature.
- Header nav links: IvyOra 300, 18px. Nav overlay panel links: Bricolage 300, 16px, uppercase,
  0.04em tracking.
- Buttons/text-links: Bricolage 11–13px, 0.08em (links) to 0.24em (buttons), uppercase.
- Casing rule: display = UPPERCASE serif; script = capitalize, never uppercase; body = sentence case.

Scale skeleton (desktop): 146 ghost / 64 hero / 44–46 section / 28 card / 18 nav / 13–14 body / 11
note / 10 kicker. Mobile: `clamp(25px, 8vw, 34px)` titles, `clamp(58px, 18vw, 92px)` ghost numerals.

## 2. Palette (converted to hex from computed colorFrequency)

**Brand ink ramp (warm espresso browns) — the real palette:**

| Hex | Usage |
|---|---|
| `#3f2c1f` | Primary ink on light bgs; borders at alpha |
| `#342818` | Deep ink, polaroid captions, arrow buttons |
| `#3d291c` | "pre-white-shift" CTA text color (var `--kh-pre-white-shift`) |
| `#5c472b` | Intro overlay bg; panel bg (var `--panel-bg`); ghost numerals at 8% |
| `#6a4c36` | Mid-brown accent: kickers, script text, small labels |
| `#7b5e4a` / `#8b715c` | Hover states of brown UI (arrows, indexes) |
| `#1e120c` | Near-black chocolate — CTA end state (`--kh-end-bg`), footer bg |

**Lights:** `#ffffff`, `#faf7f2` (glass card base), `#eadfd4`/`#eadfd3` (parchment/script on dark),
`#e3e1de → #d8d6d3` (polaroid frame gradient), `#d4d1cd` (photo stage placeholder).

**Alpha discipline** (they tint one ink instead of adding colors):
ink at 0.08 (ghost/ornament), 0.14 (dividers), 0.24–0.28 (inactive UI), 0.5–0.6 (secondary text,
borders), 0.74–0.76 (body), 0.88 (strong); white at 0.08 (glass btn bg), 0.45–0.55 (borders),
0.82–0.88 (body on dark).

**The sand/rose atmosphere comes from PHOTOGRAPHY, not CSS** — hero and section backdrops are dusty
desert-toned images; CSS backgrounds are only white → parchment → brown → chocolate.

**Ignore in tokens.json:** `#060097`, `#c10fff`, `#f9f6fe`, `#ffcd57`, `#67768e`, `#69727d`,
`#1e293b` — Astra/Elementor framework defaults that never render as brand color.

Shadows are huge and soft, never harsh: `0 18px 60px rgba(0,0,0,.14)` (media),
`0 20px 70px rgba(0,0,0,.10)` (panels), `0 22px 44px rgba(0,0,0,.08)` (glass card),
polaroid: `0 18px 55px rgba(0,0,0,.05)` + inset 1px white top-light.

## 3. Spacing and grid

- Content container 1200px (framework); real sections run **full-bleed** and set their own widths:
  CTA `min(980px, 88vw)`, copy columns 470–560px, polaroid center column 560px.
- Section vertical padding: **80px desktop / 60–70px tablet / 30–44px mobile**; block preset
  100px top/bottom, 80px sides; hero and story sections are **100vh with 60px inner padding**.
- Signature grids (measured `grid-template-columns`):
  - Why-panels: `repeat(3, 1fr)` with **6px gaps** (near-seamless image triptych), panels 80vh.
  - Home story: `minmax(320px, 500px) 1fr`, gap **80px** (copy left, imagery right).
  - Polaroid slider shell: `clamp(460px, ..., 720px) 560px 88px`, column-gap 56px (photo | copy |
    vertical index rail).
  - Image column trio: `repeat(3,1fr)`, gap 18px, **staggered heights 72% / 100% / 62%** with
    bottom-margins 8% / 0 / 14% — the editorial collage rhythm.
- Micro-spacing rhythm: 10–14px between kicker/title/body; 84px × 1px hairline divider + 12px; 
  22–30px card padding; 34px before button groups.
- Whitespace strategy: 200–500px of empty background between chapters; screenshots 09/10 show a
  full viewport with a single centered text block and two 8%-opacity pillar ornaments.

## 4. Radius language

**Zero-radius editorial.** Buttons and cards are hard rectangles (`border-radius: 0 !important` on
CTAs). Exactly three sanctioned exceptions: `999px` pill (Skip Intro button), `120px/80px 0 0`
arch-top (vase/arch mask float — a heritage arch motif), and 50% circles (explore arrow buttons on
the menu page). 6px appears only in framework leftovers.

## 5. Nav pattern

- **Split transparent header**: left — two text links (RESERVATIONS, BISTRO) in IvyOra 18px; center
  — stacked logo mark (~50px); right — minimal two-line hamburger. White over imagery. No solid bar,
  no border; the header simply sits on the hero.
- Hamburger opens a **curtain dropdown panel** (`pnav-`): links stacked, Bricolage 16px w300
  uppercase, each row separated by a 1px `rgba(255,255,255,0.26)` hairline that **animates scaleX
  from the left**, rows fade/rise `translateY(10px) → 0` with **40ms per-item stagger**
  (40/80/120...360ms). Row hover: text dims to 72% white, tiny arrow icon nudges `translateX(3px)`.
  Underline animates out to the right / in from the left, 0.45s ease.
- Nav IA: About, The Experience, Menus, Gallery, The Legacy, Reservations, Location & Hours, Bistro,
  Contact — plus persistent RESERVATIONS in the header.

## 6. Loader / intro and page transitions

- **Full-screen intro overlay** (`#khufusIntro`): fixed, `100svh`, bg `#5c472b`, max z-index; while
  active `body > :not(#khufusIntro) { visibility: hidden }` and scroll locked.
- Content: centered poetic lines (IvyOra 300, `clamp(22px, 2.35vw, 40px)`, line-height 1.25, white,
  lead words italic), revealed **word-by-word**: each word `opacity 0, translateY(10px)` animating
  in over **600ms cubic-bezier(0.18, 0.92, 0.18, 1)** with a per-word `--d` delay; whole line exits
  upward (-12px) over 500ms. Four to five lines play in sequence (~8–10s total).
- Top-center: small logo + a 1px × 40px vertical divider (a recurring motif). Bottom-center:
  "Skip Intro" pill, 1px white/55% border, transparent fill.
- **Exit**: overlay fades 420ms `cubic-bezier(0.4, 0, 0.2, 1)` with a subtle `scale(1.01)` — the
  page underneath is already composed, so the reveal feels like a curtain lift.
- No cross-page transition system detected (standard WP page loads); the intro carries the ritual.

## 7. Motion: libraries, easing, durations

- **No GSAP, no Lenis, no Locomotive, no Barba** (runtime check: all false). Native scroll.
  `libraries.json` shows only lottie-web 5.10.1 (CDN) and Swiper/jQuery via Elementor. All signature
  motion is **hand-rolled CSS transitions + IntersectionObserver `.show` classes + position:sticky**.
- Easing tokens (frequency-ordered from styles.css):
  - `cubic-bezier(0.22, 1, 0.36, 1)` — the house curve (quint-out feel), used at 0.55–1s for
    reveals.
  - `cubic-bezier(0.77, 0, 0.18, 1)` — symmetric in-out, 0.85s, for photo-layer slide pushes.
  - `cubic-bezier(0.18, 0.92, 0.18, 1)` — intro word/line animations, 500–600ms.
  - `cubic-bezier(0.4, 0, 0.2, 1)` — 420ms utility fades.
- **Reveal grammar** (`.kh-home-story-animate`): initial `opacity 0; translateY(36px);
  blur(2px)` → clear over **1s** house curve, with stagger delays **0.1 / 0.18 / 0.26 / 0.34s**.
  Ornament masks add the same with `opacity → 0.28` only.
- Micro-interactions: 0.3–0.4s; content swaps: fade-out 0.24s / fade-in 0.44s with 0.08s delay;
  image zooms: 1.2s `cubic-bezier(0.22, 0.61, 0.36, 1)`.
- `prefers-reduced-motion: reduce` is respected (transitions set to none in custom sections).

## 8. Hero construction

Layers, bottom → top: (1) full-viewport dusty desert photograph (warm sand/rose tones, pyramid on
the right third, tiny camel figures lower-left for scale); (2) soft bottom gradient scrim blending
the photo into the next section's sand-pink background — sections feel continuous, not stacked;
(3) transparent split header; (4) centered two-line uppercase serif H1 at optical center (top edge
~41% of viewport), final word italic; (5) a single small underlined text CTA ("RESERVE YOUR TABLE",
13px tracked caps) — **no button, no box**. Scale contrast is the drama: 64px headline vs 13px CTA
vs an enormous quiet photograph. Mobile swaps in a SHORTER headline ("WHERE THE *SETTING* LEADS" vs
desktop's longer line) — copy is re-authored per breakpoint, not just re-wrapped.

## 9. Menu / gallery presentation

- **Menu page**: chocolate-brown full-bleed stage with faint hieroglyph line-art murals (SVG masks
  at ~6–10% opacity). Category index = huge white serif word (BREAKFAST / LUNCH / BEVERAGES,
  ~72px+) on a band, right-aligned circular arrow + "EXPLORE ◆ Morning Selections" label + rule
  line. Expanding a category reveals an **interactive paper "book"**: a two-page cream spread
  (page labels "SET / PAGE 01"), dish names 11px tracked caps + 12px descriptions on hairline rows,
  TURN PAGES arrows (44px square outline buttons), **PDF MENU download**, and a right-hand
  "BREAKFAST JOURNEY — select a dish to view more" panel. Selecting a dish opens a detail view:
  large left serif title, center photo, right description + VIEW MORE. Menu is staged as an
  exploration, not a list — "designed to be explored rather than scanned."
- **Home galleries**: (a) `khx-gallery` — a horizontal `width: max-content` track inside a
  `perspective: 1400px` viewport, items `clamp(420px, 36vw, 760px)` at 4:3, drag/press to move
  (3D-tilted filmstrip); (b) `monarq-polaroid-slider-v2` — a polaroid object (gradient frame,
  gloss sheen pseudo-elements, Golden Hopes caption + logo mark) whose photos **push-slide**
  horizontally (0.85s, 0.77/0/0.18/1) while the copy column cross-fades; navigated by a vertical
  rail of numeral buttons (01/02/03 — active = italic bold, shifted -4px); (c) awards: stacked
  offset cards ("1/4" counter + arrow) with a brown info card overlapping the photo stack.

## 10. Imagery treatment and crops

- Two photographic modes only: warm dusty color (atmosphere/place) and **desaturated
  black-and-white (people/kitchen/craft)** — B/W is done in CSS (`filter: saturate(0)` /
  `grayscale(0.78) saturate(0.45)`), so hovers can restore life via scale rather than color.
- Crops: tall portrait columns (the 72/100/62% trio), 4:3 filmstrip frames, 46:43 polaroid, 80vh
  triptych panels. Images sit under gradient overlays (`to top, rgba(61,41,28,.65) → transparent`)
  when text overlays them.
- Ornament layer: heritage line-art SVGs (pillars, vases, pattern murals, hieroglyph strips)
  applied as **CSS mask + background-color tints at 0.08–0.32 opacity** — theming by silhouette,
  recolorable per background. Glass caption cards: `rgba(250,247,242,0.86)` + `blur(12px)` +
  1px ink/8% border.

## 11. Hover and interaction states

- Images: slow zoom `scale(1.05)` over 1.2s; panel caption lifts `translateY(22px) → 0` (0.4s);
  hidden ornament icon fades to 0.32 opacity and settles `scale(0.94) → 1`.
- Hover-to-expand panels: `max-height 0 → 240px` + fade + rise for hidden paragraphs (desktop
  hover, tap on mobile).
- Text links: pre-rendered 1px underline **retracts to width 0** on hover while the link dims to
  0.4 opacity (inverse-underline pattern).
- Buttons: `translateY(-2px)` lift; ghost buttons brighten border (0.45 → 0.65 white) and fill
  `rgba(255,255,255,0.08 → 0.14)`; glass buttons use `backdrop-filter: blur(6px)`.
- Slider indexes: inactive 28% ink → active **italic bold** full ink with -4px shift; arrows:
  border+color warm to `#7b5e4a`, -1px lift.
- The **CTA background-morph** (see 12) is itself the page's biggest "interaction."

## 12. Scroll storytelling architecture (the core system)

Homepage = 8 numbered chapters: 01 intro/story → 02 why-triptych → 03 global recognition →
04 experience filmstrip → 05 meet the chef (polaroid) → 08 evening ("The experience evolves with
the light") → final invitation CTA → footer. Each chapter: ghost numeral + kicker + serif title +
script annotation + short body + hairline + footnote — the SAME skeleton every time, so the reader
learns the rhythm.

**Signature move — `kh-cta-reveal`**: outer section `height: 240vh`; inner `position: sticky;
top: 0; height: 100vh`. As the user scrolls through the 240vh, JS interpolates the sticky stage's
background **white → browns → `#1e120c`** (CSS variables `--kh-start-bg`/`--kh-end-bg`) while all
text colors flip brown → white, the inner block scales **0.94 → 1**, flanking pillar ornaments sit
at 0.16 opacity, and only near the end do the buttons+hieroglyph ornament arm (`.is-visible`,
0.55s house curve, translateY 26px). Captured live in `post_intro_desktop_10..12` (same DOM, three
background states). Dark footer follows, so the page literally ends at night — matching the
"evolves with the light" narrative. Day-to-night as scroll progress is the single strongest idea
on the site.

## 13. Mobile adaptations (390px)

- Desktop/mobile are often **parallel DOM sections** (`kh-home-story-sec` vs
  `kh-home-story-mobile`), not reflowed grids — copy is shortened and compositions rebuilt.
- Hero: different, shorter headline; CTA link pinned near bottom; same photo.
- Chapter headers center-align; ghost numerals shrink to `clamp(58px, 18vw, 92px)` and sit behind
  centered kickers.
- Why-triptych → stacked full-width cards (min-height 460px), hover-reveals become always-measured
  tap reveals; polaroid slider → swipe stage (`touch-action: pan-y`, grab cursors) with horizontal
  numeral pagination; filmstrip items `min(88vw, 520px)`, gap 18px.
- Footer 4 columns → accordion rows (title + chevron + 1px dividers) + social icons.
- Buttons go full-width; page gutter 30px; section padding 44–60px.
- Breakpoints that matter: 1360 (slider shell compresses), 1024 (grids collapse to 1-col),
  921/767 (mobile compositions swap in), 520/480 (intro text wraps, type floors).

## 14. What to steal (systems only)

1. **The chapter skeleton**: ghost numeral (brand ink @ 8%) + tracked micro-kicker + light serif
   uppercase title + rotated script annotation overlapping the title + short body + 84px hairline +
   footnote. Repeat it everywhere; it IS the brand voice. (For Saffron and Rice: Persian
   calligraphic script accent instead of Golden Hopes; our own numeral treatment.)
2. **Three-voice type system** with extreme scale contrast (146/64 display vs 10px kickers @
   0.24–0.34em tracking) and italic emphasis words inside uppercase serif headlines.
3. **One-ink alpha ramp** instead of a multi-color palette: single warm ink at
   .08/.14/.28/.5/.6/.76/.88 over white→parchment→deep-dark stage backgrounds; photography carries
   the color.
4. **Intro overlay ritual**: 3–4 poetic lines, word-stagger 600ms, skip pill, 420ms fade+scale
   exit, scroll-locked, once per session. Cheap to build (pure CSS/JS), huge atmosphere.
5. **Sticky background-morph finale**: 240vh section, 100vh sticky stage, scroll-driven light→dark
   color interpolation with text flip and late-arming CTA buttons. Day-to-night = a natural
   Persian-hospitality metaphor too (bazaar noon → saffron dusk).
6. **Easing/duration tokens**: house curve `cubic-bezier(0.22,1,0.36,1)` @ 0.55–1s; push-slide
   `cubic-bezier(0.77,0,0.18,1)` @ 0.85s; word-in `cubic-bezier(0.18,0.92,0.18,1)` @ 600ms;
   reveal = opacity+36px rise+2px blur with 80–100ms staggers; micro 0.3–0.4s; respect
   reduced-motion.
7. **Hover grammar**: 1.2s slow zoom, caption lift, retracting underline, -2px button lift, glass
   ghost buttons, italic-bold active indexes.
8. **Menu-as-object**: category bands with giant serif words + explore affordance, expanding into
   a paper spread with page-turns, PDF download, and per-dish detail panel. Perfect model for a
   deli/catering menu (Breakfast/Lunch/Catering spreads).
9. **Editorial collage grids**: near-seamless 6px triptych; staggered-height 72/100/62% column
   trios; offset stacked cards with counters; glass caption cards over desaturated photography.
10. **Ornaments as CSS masks**: line-art heritage motifs (for us: Persian arches, pomegranates,
    saffron crocus, tilework strips) tinted via background-color at 8–32% opacity — recolorable on
    any background, no baked-in colors.
11. **Zero-radius discipline** with two sanctioned exceptions (pill for the skip/CTA chip, arch-top
    mask as heritage motif).
12. **Mobile as re-composition**: shorter mobile headlines, parallel mobile sections, tap-reveals
    replacing hovers, accordion footer.
13. **No-framework feasibility proof**: every signature effect here is native scroll + IO + CSS
    transitions + sticky. With our GSAP+Lenis stack we can exceed this smoothly, but nothing
    requires heavy machinery.

## 15. Do NOT copy

IvyOra Display / Bricolage Grotesque / Golden Hopes fonts; the espresso-brown hex ramp as-is; the
pyramid/desert/hieroglyph iconography; intro copy or any text; photography; the Khufu's logo or
MENA 50 Best badges. We take the skeleton, rhythm, and motion physics only, re-skinned to Saffron
and Rice's own Persian identity.
