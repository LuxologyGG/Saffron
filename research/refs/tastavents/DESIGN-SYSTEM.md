# Tastavents — Design System Recon (R2b)

Reference: https://tastavents.com — Awwwards Honorable Mention (Oct 2024). Mediterranean fine-dining
restaurant, Hotel Marina Badalona, Barcelona. Credits in footer: design paisana.studio, dev programatorio,
CMS emexs. One-page site organized as six numbered "chapters" (I Presentación … VI Contacto y Reservas)
plus a gallery epilogue and footer. Role in our build: **menu + gallery interaction blueprint** — warm
earthy palette on cream, gesture/scrub-driven scrolling, elegant experiential menu presentation.

Evidence: `screenshots/clean_desktop_*.png`, `screenshots/menu_desktop_step_*.png`,
`screenshots/hscroll_desktop_step_*.png`, `screenshots/clean_mobile_*.png`, `tokens.json`,
`libraries.json`, `styles.css`, `page.html`.

Note on capture: a Cookiebot consent modal blocks the first paint; all `clean_*` and `menu_*` shots were
taken after programmatic consent. The original `desktop_scroll_*.png` set is contaminated by the modal
and superseded.

---

## 1. Root sizing model (the master trick)

`html { font-size: 0.520833vw }` on desktop (= 10px at a 1920 design canvas; measured 7.5px at 1440),
`1.30209vw` on tablet, `2.56411vw` on mobile (= 10px at 390). **Every dimension on the site is in rem** —
type, padding, radii, component widths. The whole page scales like a poster; "design px" below are the
1920-canvas values (rem × 10), with measured 1440 values in parens.

## 2. Type system

Two families + one icon font:

- **Display ("font-2"): `ivypresto-display`** (Adobe Fonts, `@import use.typekit.net/gpb2cpw.css`),
  weight 100, always UPPERCASE, line-height 1.0–1.1. Thin, high-contrast didone-ish serif.
- **UI/body ("font-1"): `Optima`** (self-hosted woff2, 400 + 700). Humanist glyphic sans for every
  paragraph, label, button, form element.
- `icomoon` for arrows/phone/diamond/eye glyphs.

Measured scale (class → rem → px at 1440):

| Role | Class | rem | px @1440 | Notes |
|---|---|---|---|---|
| Hero H1 | `fs--188` | 18.8 | 141 | ivypresto 100, uppercase, lh 1.0, centered, split-words; mobile 4.6rem |
| Section H2 | `fs--116` | 11.6 | 87 | ivypresto 100, uppercase, lh 1.0–1.1; mobile 4–6rem |
| Sub-headline | `fs--72` | 7.2 | 54 | pinned-section headline over photos |
| Chef name / statements | ~7.4–10 | — | 55–75 | ivypresto giant left/right split layouts |
| Background letters | 86.6 | 650 | decorative word behind collage ("MEDITERRANEAS") |
| Footer logotype | 22.2–28 | 165–210 | letterspaced custom logotype drawing |
| Body paragraph | `paragraph-24` / `fs--24` | 2.4 | 18 | Optima 400, lh 1.4–1.5 |
| Small text | `fs--18` / `fs--16` | 1.8 / 1.6 | 13.5 / 12 | info blocks, slide text |
| **All UI chrome** | `fs--12` | 1.2 | 9 | buttons, nav items, eyebrows, form labels — uppercase, tracking 0.3em |

Measured letter-spacing set: 0.3em (~2.7–4px) on all uppercase UI; near-zero on display type.
The size gap (9px UI vs 141px display) is the core typographic drama.

## 3. Palette (from `:root` CSS vars + measured frequency)

Warm earth on cream; dark panels for contrast chapters.

| Token | Hex | Usage |
|---|---|---|
| `--white-2` | `#FFEDDD` | page cream field, button fills (highest-frequency bg) |
| `--white-3` | `#FFF1DD` | header/nav-overlay cream |
| `--brown-1` | `#3E270F` | primary text on cream (espresso) |
| `--brown-4` | `#34290E` | scrolled header bar, chef panel (dark olive-brown) |
| `--brown-5` | `#806641` | RESERVAS pill fill (active state) |
| `--brown-6` | `#997550` | hairlines / separators |
| `--brown-7` | `#CAB98E` | soft gold accents |
| `--black-1` | `#1D1D1B` | dark panels: carta card, cocina section, galeria, footer |
| `--black-2` | `#1F1200` | loader / transition veil |
| `--yellow-1` | `#FCE9B9` | cream-gold display type on dark & on hero photos |
| `--yellow-2` | `#E6D49B` | body text on dark panels (also 20%-alpha hairlines) |
| `--orange-1` | `#D24C00` | galeria display type accent (burnt orange) |
| `--red-1` / `--green-1` | `#C50000` / `#2AC500` | form error/success only |

Michelin red badge in footer is imagery, not a token.

## 4. Spacing, grid, radius

- **Grid**: Bootstrap-style 12-col (`col-lg-5`, `offset-lg-2`…) inside `container-fluid` whose gutter is
  `--padding-fluid: 1rem` (10px design) — i.e., near-full-bleed with hairline margins. Asymmetric editorial
  placements via offsets (e.g., eyebrow col-2 offset-1, paragraph col-5 offset-2).
- **Spacing utilities**: `pt-lg-165` = 16.5rem etc. (class number ÷ 10 = rem). Observed rhythm: section
  top pads 9–16.5rem, bottoms 8–19.5rem, mobile 4–10rem. `--header-height: 10.8rem`.
- **Radius**: `0.4rem` (3–4px) on every image/card/panel — barely-rounded editorial look; pill buttons
  `4.3rem` (fully rounded, measured 32.25px); `50%` circles for hamburger/icon buttons.
- Max content width `1432.5px` at 1440 (95.5vw); most sections are full-bleed minus 1rem gutters.

## 5. Header / navigation

- Fixed header. Over the hero it is chrome-less (tiny cream utility links left, centered letterspaced
  logotype, pill CTAs right: RESERVAS filled cream, REGALA outlined, circular hamburger).
- On scroll, a **dark inset bar** (`--brown-4`) paints in behind it — inset by the 1rem page gutter on
  each side (`#header::after` width `calc(100% - padding)`), 0.8s `cubic-bezier(0.645,0.045,0.355,1)`.
  Logotype + links flip to cream. (`clean_desktop_scroll_04.png` top bar.)
- Hamburger opens a **dropdown sheet** (not full black overlay): cream `#FFF1DD` panel under the header
  containing a numbered chapter list — Roman numeral column + uppercase Optima titles, brown hairline row
  separators, **active-section dot** on the current chapter — flanked left by a photo thumb and right by a
  rail with "llámanos para hacer tu reserva", team photo, phone number. Below the sheet the page dims.
  (`clean_desktop_nav_overlay.png`, `clean_mobile_nav_overlay.png`.)
- Anchor navigation (one-pager): items scroll to `#presentacion` … `#contacto-y-reservas`.

## 6. Loader & transitions

- `.loading-progressbar`: near-black `#1F1200` full screen with a **12rem × 0.1rem hairline progress
  bar**, fill = `scaleX(var(--percentage))` in cream, 0.6s easeInOutCubic updates; bar collapses
  (`scaleY(0)`) and the veil lifts. `#main-transition` div reserved for route transitions.
- Text reveals: headings carry `.split-words`; words animate `translateY(110%) → 0` (keyframes
  `slide-up`, `slide-up2` adds 1deg rotation settle). Blocks use `fadeInUp` (3rem rise), images use
  clip-path wipes `in-width-left/right` (`clip-path: inset(0 100% 0 0) → inset(0)`).
- **Declarative animation microformat**: elements carry `data-aos="fadeInUp .6s ease-out-cubic .4s,
  d:loop, trigger:.container-left"` — preset + duration + easing + delay + scrub-loop flag + custom
  trigger selector. A custom engine reads these and builds GSAP timelines. Very stealable pattern.

## 7. Scroll / motion stack

- **GSAP + ScrollTrigger** (75/7 signature hits) drive pinning and scrubbing. **No Lenis detected**;
  the single locomotive-scroll hit is one `data-scroll-container` attribute (custom smooth-scroll or
  native). **Swiper** (109 hits) runs the hero crossfade and gallery sliders. React/Next fingerprints are
  from the CMS runtime, not the page architecture (site is server-rendered HTML + rem CSS).
- Easing vocabulary (by frequency): `cubic-bezier(0.645,0.045,0.355,1)` easeInOutCubic ×67 (default,
  0.4s UI / 0.8s layout), `cubic-bezier(0.215,0.61,0.355,1)` easeOutCubic ×34 (entrances, 0.8–1.2s),
  `cubic-bezier(0.42,0,0.58,1)` ×17, `cubic-bezier(0.785,0.135,0.15,0.86)` ×13 (header ink-in),
  `cubic-bezier(0.19,1,0.155,1.01)` for 1s background-size photo zooms on hover.

## 8. Hero construction

(`clean_desktop_hero.png`, `clean_mobile_hero.png`)

1. Full-viewport Swiper crossfading **pairs** of images: a heavily blurred food photo as the full-bleed
   backdrop + a small sharp portrait card (~195×290 @1440, radius 0.4rem) dead-center.
2. A hairline rule above the card; header floats transparent on top.
3. H1 "Un Viaje Gastronómico Único" — 141px thin ivypresto uppercase cream `#FCE9B9`, 3 centered lines,
   split-word slide-up on load — **overlapping the small card** (text z-above image).
   The blur keeps contrast; the sharp card gives a focal jewel. Slider dots lower-left.
4. Mobile: identical recipe, logotype sits above the card, H1 tucks to the card's lower edge.

## 9. MENU PRESENTATION IN DETAIL (why this reference exists)

The site's insight: **the menu is presented as an experience, not a list.** Two complementary systems:

### 9a. Section V "Menú Excepcional" — pinned film-strip → carta card
(`menu_desktop_step_00…06.png`, sequence; mobile `menu_mobile_step_*.png`)

1. **Chapter intro on cream**: centered eyebrow `V · MENÚ EXCEPCIONAL` (9px caps, Roman numeral),
   then H2 "Homenaje al Producto, Gustos Genuinos" at 87px ivypresto brown, split-word reveal.
2. **Pinned scrub** (`.container-sticky[data-sticky][data-trigger=parent]`, 100vh pin, section scroll
   length ≈ 3.4× viewport): five portrait food photos (`gallery-item`, fixed aspect 1 : 1.2885, width
   61.7rem, radius 0.4rem, z-indexes 5→1) enter as a full-width row of ~3 visible panels.
3. As you scrub, items 2–5 **compress into narrow vertical strips** (accordion/film-strip: first image
   stays dominant at ~470px, the rest collapse to ~65–115px slivers, 0.8s easeOutCubic with per-item
   `--pos-top` stagger of 1.2rem).
4. Final beat: the strip slides left and the **carta panel** (`.container-carta`, `#1D1D1B`, radius
   0.4rem, `data-aos="trigger:.carta-trigger"`) wipes in from the right to occupy the right half.
5. **Carta panel contents** (centered, on dark): line-art cloche/menu SVG icon in gold → one 18px Optima
   paragraph in `#E6D49B` ("En Tastavents, el ingrediente es el rey…") → two stacked pill buttons
   (cream `#FFEDDD` fill, espresso text, 9px caps, 0.3em tracking, arrow glyph):
   **CARTA DE VINOS** → external wine-list web app (web.winerim.com), and
   **MENÚ DEGUSTACIÓN** → seasonal PDF (`Carta_03-2026_ESP.pdf`, ~600KB, month-stamped filename;
   same PDF linked from three contexts). **No dishes or prices are rendered in-page** — itemization is
   entirely offloaded to PDF/wine-app; the page sells appetite with imagery and a single positioning line.
6. Mobile: the pin is dropped; images stack vertically and the carta card **slides up as a full-width
   bottom sheet** with the same icon/paragraph/buttons, buttons full-width stacked pills.

### 9b. Section II "Nuestra Cocina" — ingredient rails (dish-label pattern)
(`clean_desktop_scroll_04.png`, mobile `clean_mobile_scroll_02.png` bottom)

- Full-bleed dark `#1D1D1B` panel. The H2 renders as giant cream ivypresto words layered OVER the
  content ("Ingredientes Exquisitos, Platos memorables.").
- Center column: large food photo (oyster + wine) + 18px cream paragraph + the same two pill CTAs
  (cream on dark) — CTAs to wine list and tasting menu repeat here.
- **Left and right vertical rails** of small dish/ingredient photos, each labeled in 9px tracked
  uppercase Optima: ALBAHACA, SUPREMA ATÚN ROJO, GAMBAS, PULPO, ROSSINYOLS… The rails are slow vertical
  marquees (custom `<p-marquee>` element), giving a living "deli case" feel. Labels are separated by
  20%-alpha gold hairlines.
- Mobile: rails merge into ONE horizontal marquee strip, 10.9rem tall, labels alternating with thumbs.
- This is the transplantable "menu item as labeled imagery" system: name-in-caps + photo + hairline,
  no prices on the page.

### 9c. "Veladas Mediterráneas" pinned collage (gallery/experience blueprint)
(`hscroll_desktop_step_00…03.png`)

- `.horizontal-scroll` section (actually a vertical scrub, ~1.45× viewport): full-bleed food photo
  backdrop, an 86.6rem cream word drifting behind, and three cream **caption cards** (title 14px caps +
  icon badge circle + 2-line 12px text + portrait photo, 0.4rem radius, gold border) that ride upward at
  different parallax rates and settle into a staggered composition. Card recipe = eyebrow + icon + one
  sentence + photo. Section IV (chef) and VI (contact) reuse giant-name + split-photo layouts.

## 10. Imagery treatment

- Photography only on the home page — **no video found** (`tokens.videos` empty); "video integration"
  ambitions from the brief map to the crossfading blurred hero and marquee motion.
- Consistent warm grade (amber/terracotta light, dark ceramics); portrait 1:1.29 crops for cards,
  full-bleed landscape for section backdrops.
- **Blur-up pattern baked into markup**: every image is a pair — `.thumb` (blurred placeholder,
  `data-preload`) under `.original` (`data-lazy`) — giving progressive sharpen on load.
- Hover zoom via `background-size` transition (1s, springy bezier), parallax via
  `data-parallax data-translate-y="8rem"` on select images.
- Giant display type is layered both OVER photos (hero, cocina) and BEHIND cards (collage) — the
  type-photo interleave is a signature.

## 11. Hover / interaction states

- **Letter-swap buttons**: every button/nav label is `.container-span` with `data-letter` duplicate —
  on hover the visible span slides `translateY(-105%)` and the `::after` copy rises into place,
  0.4s easeInOutCubic. Applied to pills, nav rows, submit, "Ver galería".
- Pills also run a fill-slide (`::before translateY`) darkening/toggling fill on hover; arrow glyphs
  nudge right. Nav rows swap Roman numeral + title simultaneously; active chapter keeps a filled dot.
- Form fields: hairline-underlined uppercase labels, reveal animations per field (`container-reveal`).
- Cursor stays default (no custom cursor). Reviews/Instagram links open external.

## 12. Mobile adaptations (390)

- Root rem becomes 2.56411vw → same proportions, larger relative type (H1 4.6rem, H2 4–6rem).
- Pins/scrubs removed: menu film-strip → vertical stack + bottom-sheet carta card; collage cards stack;
  ingredient rails → single horizontal marquee.
- Buttons: full-width stacked pills; header keeps both pill CTAs visible even on mobile (booking-first).
- Nav sheet is full-screen with identical numbered list; contact iframe (TheFork widget) full-width.
- Breakpoints: 767.98px and 1025px (plus landscape guards) — a simple 3-tier system.

## 13. What to steal (systems only)

1. **vw-locked rem root** (0.520833vw desktop / 2.56411vw mobile): the whole layout scales as one
   poster; adopt for our menu and gallery pages.
2. **Two-voice type system**: thin uppercase display serif at 87–141px vs a single 9px/0.3em-tracked
   caps size for ALL UI. (Substitute free faces: ivypresto → e.g. Cormorant/Italiana-class thin serif;
   Optima is licensed — use a free humanist sans. Choose in synthesis phase.)
3. **Numbered-chapter IA** (Roman numeral eyebrows I–VI) reused verbatim in the nav sheet with an
   active-section dot — gives a tasting-menu narrative to a one-pager or to our multi-page nav.
4. **Palette architecture** (not the hexes per se, though they suit us): cream field `#FFEDDD` +
   espresso text `#3E270F` + near-black panels `#1D1D1B` + cream-gold display `#FCE9B9` + one burnt
   accent `#D24C00` — maps directly to saffron/rice/herb branding.
5. **Pinned film-strip → carta-card menu reveal**: 5 dish photos scrub from row → slivers → dark CTA
   panel. For Saffron and Rice, the end panel should hold REAL menu categories/prices (their PDF-only
   menu is the one thing NOT to copy for a deli).
6. **Ingredient-rail marquee with tracked caps labels + hairlines** — perfect for deli-case items and
   catering trays; collapses to a horizontal marquee on mobile.
7. **data-aos-style declarative animation attributes** feeding GSAP/ScrollTrigger presets
   (fadeInUp/clip-wipe/split-words slide-up with the 0.645/0.215 bezier pair) — cheap to implement,
   consistent motion voice.
8. **Header ink-in**: transparent over hero → gutter-inset dark bar on scroll.
9. **Hairline progress loader on near-black** + split-word hero reveal as the entry ritual.
10. **Blur-up thumb/original image pairs** and background-size hover zooms for the gallery.

## Deviations / cautions

- Menu content: Tastavents shows zero prices/dishes in-page (fine-dining PDF ritual). A deli/catering
  site must render items and prices in-page — steal the *staging* (chapter intro → imagery scrub → dark
  panel), put the actual list where their PDF buttons are.
- Fonts (ivypresto via Adobe Fonts, Optima licensed) cannot be self-hosted freely — pick free analogs.
- The "horizontal-scroll" class is a misnomer — motion is vertical scrub with parallax; no true
  horizontal gesture section exists on the page.
- Cookiebot modal on first load (avoid consent walls if possible).
- Site is ES/CA/EN/FR multilingual; EN copy exists at /en/change-language if copywriting reference needed.
