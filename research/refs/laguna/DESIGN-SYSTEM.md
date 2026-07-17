# Laguna Al-Sha'ab — culinaryodissey.uprock.pro — Design System Recon (R2c)

Awwwards Honorable Mention, Oct 2025. "Culinary Odyssey by the Sea" — a fictional Arabic/Mediterranean
fine-dining concept produced by the Uprock design school (footer admits "Created for demonstration
purposes only"; imagery is AI-generated, e.g. `comfyui_kvadrat.webp`). Role for Saffron and Rice:
**motion and scroll-pattern reference** — immersive parallax, fullscreen composition handoffs, refined
luxury atmosphere. **We document the SYSTEM only — never copy assets, fonts, images, palettes, or copy.**

Captured 2026-07-17 at 1440 and 390. Evidence: `screenshots/desktop_scroll_00..16.png` (authoritative
scroll walk), `desktop_1440_full.png` (29,726px tall = ~33 viewports), `mobile_390_full.png`,
`tokens.json`, `libraries.json`, `styles.css`, `page.html`.

Platform note: Russian site-builder (megagroup "mosaic" + jQuery), BUT the entire motion system runs on
**GSAP + ScrollTrigger + CustomEase bundled inside the platform's `do.js`**, driven by **declarative JSON
animation configs embedded in the HTML** (200 configs extracted and parsed — see Motion). Wheel smoothing
via SmoothScroll 1.4.10 (CDN). `react/next` in libraries.json is a false positive (VK-ID SDK bundle).
The whole page is **vw/vh-sized** — every font-size, padding, and radius is in `vw`, so the design
scales like a poster (like Tastavents' rem trick, done with raw vw units).

---

## 1. Type stack and scale (measured)

Three voices + one leftover:

| Voice | Family (theirs) | Role |
|---|---|---|
| Display serif | LTRemark (woff, single weight 400) | ALL headings, ghost words, numerals, footer wordmark — high-contrast didone-ish serif, always UPPERCASE |
| Accent italic serif | Playfair Display italic (Google WebFont) | Chef quotes only — the single emotional voice |
| UI/body sans | Inter | Paragraphs, nav, labels, buttons, form |
| One-off | Oceanic (woff) | Burger-overlay menu headers only |

Measured classes (vw → px at 1440):

- `.h1`/`.h2`: LTRemark **9.58vw = 138px**, line-height **90%**, letter-spacing **-0.02em**, uppercase.
- `.text-decor` (ghost background words "CONCEPT", "SALT" captions stage): **19.46vw = 280px**, ls -0.03em.
- Ghost SALT letters: individual SVG letterforms ~29.33vw (422px) tall, laid out as a word across the stage.
- Drinks slide titles: 6.51vw = 94px (mix-blend difference, see §11). `.h5` 8.06vw, `.h6` 7.56vw, `.h7` 6.55vw.
- Cover room titles (`.cover__text1`): **7.58vw = 109px** with `-webkit-text-stroke: 0.2vw rgba(42,66,76,0.2)`
  — a faint cool-toned stroke that keeps white type legible over bright sky.
- `.text-quote` (Playfair italic): **6.05vw = 87px**, lh 100%, ls -0.03em, sentence case with typographic quotes.
- `.form-h2`: 5.04vw, ls -0.04em. Roman numerals `.text-number`: LTRemark 2.52vw = 36px.
- Body (Inter): 1.21vw = 17px labels @60% opacity; 1.41vw = 20px links; 1.61vw kickers; **1.95vw = 28px
  paragraphs, `text-align: justify`, lh 110%** — justified body blocks ~36vw wide are a signature.
- **ALL tracking is negative** (-0.02 to -0.05em display, **-0.04em on Inter UI**) — tight, modern, zero
  letterspaced-caps anywhere. The opposite of Khufu's tracked-kicker system.
- Casing rule: display = UPPERCASE serif; quotes = italic sentence case; body/UI = sentence case.

Scale skeleton (desktop): 280 ghost / 138 H1 / 94–109 slide titles / 87 quote / 36 numerals / 28 body /
20 links / 17 labels. Line-height 90–110% everywhere — the page is set tight.

## 2. Palette (converted from computed colorFrequency)

Two-pole system — warm cream vs deep ink — plus one cool dark stage:

| Hex | Usage |
|---|---|
| `#FCF2E1` | Cream — page field, light text on dark, btn-light (1136 hits, dominant) |
| `#F6F2E8` | Second cream — invite/drinks mask fill, subtle card contrast |
| `#252527` | Ink near-black — body text, btn-dark, footer/product stage |
| `#1E242E` | Dark navy-blue — gastronomic-show stage, form dome, burger panel |
| `#A1805D` @ 0.5 | Bronze/sand tint overlay on cover imagery (the only "color") |
| `#FFFFFF` | Header text over imagery, crystal-mask strokes |

Alpha discipline (one ink, tinted): ink @ 0.1 (hairlines `.line-dark`, ghost borders), 0.2 (inactive
numerals), 0.6 (secondary text, descriptions), 0.7 (photo overlays `rgba(0,0,0,0.7)`); cream @ 0.05–0.1
(ghost letters on dark), 0.3 (inactive numerals on dark), 0.6 (labels on dark). Ghost type is always the
stage color lightened/darkened ~5–8%, never a new hue. Atmosphere (sunset golds, lagoon blues, rose)
comes 100% from PHOTOGRAPHY; CSS colors are only cream/ink/navy/bronze-tint.

Ignore: `#2BBBDC`, `#3290FF`, `#404855` (site-builder widget defaults); `#FF0000` ×24 = **ScrollTrigger
debug markers left enabled** (`"markers": true` in shipped configs — see flags).

## 3. Spacing and grid

- No fixed container: full-bleed sections; content max-widths `min(960px…1296px)`; text columns 34–40vw
  (justified paragraphs ~36vw); form column 40.32vw.
- Everything spaced in vw: gutters 3.02vw; button padding 2.02vw × 8.06vw; micro-gaps 0.5–2vw.
- Measured grids: rooms/cards `repeat(3, 460px)`; team + footer `repeat(5, ~262px)`; two-col 671px × 2;
  an asymmetric editorial row `161px / 295px / 682px / 301px`.
- Footer grid: 5 columns, top row = label+value stacks (Contacts / Address / Opening hours), giant row-gap
  (30vw) pushing the wordmark to the bottom edge.
- Vertical rhythm is VIEWPORT-quantized, not padding-quantized: chapters are 100vh stages inside
  100–1850vh scroll wrappers; breathing space = full-viewport photo interludes, not whitespace bands.

## 4. Radius language

**The arch (round-top dome) IS the brand geometry**: `border-radius: 50% 50% 0 0` (viewport-wide dome
masks), `200px 200px 0 0`, `19.76vw 19.76vw 0 0` (drinks arch frame), `284px/204px/140px … 0 0` variants.
Rectangles for photos/cards; buttons soft **1.01vw ≈ 10–15px**; circles only for tiny UI dots. The arch
motif repeats at every scale: logo frame, image masks, scene-transition curtains, footer logo. (For
Saffron and Rice: the Persian/Moorish arch carries the same move natively.)

## 5. Nav pattern

- **Fixed header, `min-height: 100vh`, `pointer-events: none`** (children re-enable) — it is a full-viewport
  overlay STAGE, not a bar: grid `1fr 1fr 1fr` (wordmark left / arch logo center / links+CTA right),
  padding 15px top, 30px sides.
- Links: Inter ~17px, -0.04em; CTA "Reservation" = outlined 1px pill-ish (10px radius) ghost button.
- **Nav color is scroll-choreographed**: COLOR scrub effects flip header/nav between white and `#1E242E`
  exactly at section boundaries (white over imagery/dark stages, ink over cream) — 25 COLOR effects in
  the config dump do this plus pagination states. No blend-mode on the header; it's driven.
- Burger (mobile/alt): full-height panel `#1E242E`, cream LTRemark links 55px, Oceanic section headers.

## 6. Loader / intro

- `.cover-preloader`: fixed black full-viewport layer over the cover, faded out on load.
- Hero image enters via **SIZE curtain**: `height 0% → 100%` over **2s, power1.in** (APPEAR_ON_SCREEN
  config), so the lagoon photo "draws" itself under the already-present title. Entrance delays run
  0 / 1 / 1.2–1.8 / 3–4s — a long, confident load sequence.
- No word-by-word intro ritual (unlike Khufu's); the 700vh cover journey IS the intro.

## 7. MOTION — the core system (extended)

### 7.1 Architecture

All signature motion = **GSAP ScrollTrigger scrubs declared as JSON configs** (200 parsed from the HTML):
`trigger → effects[] → keyframes + options`. Four trigger types measured:

| Trigger | Count | Use |
|---|---|---|
| SCROLL_TRANSFORM | 154 | scrubbed parallax/choreography (the site) |
| HOVER | 23 | 0.5–0.7s opacity/move micro-states |
| APPEAR_ON_SCREEN | 17 | entrances, 2s, power1.in, staggered delays |
| CLICK | 19 | dome-mask expansions (reservation overlay) |

Effect vocabulary is tiny — **MOVE (134), OPACITY (214), COLOR (25), SIZE (11), SCALE (2)** — richness
comes from layering 3–8 single-property effects per element group, not from complex tweens.

### 7.2 Scrub window + segment grammar

- 143/154 scroll effects use ONE window: trigger `top → bottom` vs scroller `100% → 0%` — i.e. the scrub
  spans the section's entire visible traverse. Rare variants start at trigger center or +5/10/20%.
- Choreography-within-a-pin uses **startKeyframe/endKeyframe percent bands** of that window:
  - Five-chapter sequences (courses, cocktails): equal fifths **0–20 / 20–40 / 40–60 / 60–80 / 80–100**.
  - Caption/label swaps: narrow bands (5–10, 16–20, 33–45, 45–55, 55–64, 64–69, 69–81, 73–75).
  - Long drifts: 0–100, 0–80, 10–80.
  This is the transferable trick: **one ScrollTrigger per section, all children keyed to % bands of its
  progress** (GSAP timeline with position labels), instead of dozens of independent triggers.

### 7.3 Scrub lag = depth ("smoothing", mapped to GSAP `scrub: N`)

Measured distribution: **0** (×26, hard-locked: masks, camera moves) / **0.2–0.3** (×55, headlines) /
**0.5–1** (×27, mid layers) / **2** (×18, images) / **4–5** (×7, deep bg) / **10** (×21, floating salt
crystals — they keep drifting seconds after you stop). Layered catch-up lag, not different distances,
is what makes the parallax feel dimensional. This is the single most stealable number set.

### 7.4 Easing tokens

- `power1.inOut` — house scrub ease (×267): gentle S-curve on nearly every scrubbed move/fade.
- `power1.in` — entrances + hover (×138), duration 0.5–2s.
- `none` — direct 1:1 mapping (×23): dome masks, size wipes that must track the finger.
- `cubic-bezier(0.68, -0.55, 0.265, 1.55)` — back-in-out overshoot, used for the marquee drop
  (`y: -60vh → 0`) and pops (`y: 0 → 30%`) — playful counterpoint, ×5.
- `cubic-bezier(0.86, 0, 0.07, 1)` — hard quint-like inOut for opacity snaps (×9);
  `(0.77, 0, 0.175, 1)` and `(0.25, 0.1, 0.25, 1)` appear once or twice.
- Durations (non-scrub): hover 0.3–0.7s; entrances 1–2s; click masks 1s; CSS fallbacks 300ms ease.

### 7.5 Amplitude grammar

- **Texture parallax is TINY**: crystals/photos drift ±1–3vw / ±1–3vh (e.g. `x: 3vw→-1vw, y: 0→1vh`).
  Dozens of small opposing vectors read as shimmer, never seasickness.
- **Structural moves are HUGE**: panels `y: 100% → 0`; title drop `y: -60vh → 0` (with overshoot ease);
  ghost-caption strips slide `x: 0 → -150px`; camera stage `width: 200%` pans horizontally inside pins.
- **Opacity crossfades in adjacent bands**: outgoing 1→0 in band N, incoming 0→1 in band N+1; ghost
  layers breathe 0.05↔0.6 and 0.01↔0.1; "hold" keyframes (1→1, 0.6→0.6) pin values through bands.
- **COLOR scrubs**: header/nav white↔`#1E242E`; numerals ink@0.2↔ink@1 as chapters pass.

### 7.6 Pinned sections (measured heights)

| Section | Wrapper height | Sticky stage | Content |
|---|---|---|---|
| Cover journey | **700vh** | `.vert-camera` 100vh top:0 | 3 fullscreen rooms hand off via dome masks |
| Gastronomic show + SALT | **1000vh** (alt 1850vh at 1920) | sticky-wrapper 100vh | intro → ghost SALT stage → 5 courses |
| Drinks | ~**500vh** | `.drinks__sticky` top:11.25vh | 5 cocktails in one pinned arch |
| Chef | **250vh** | team-photo stage 100vh | quote + portrait over blurred brigade |
| Invite | **300vh** | `.invite-sticky` 100vh | dome mask rises, crystals drift |
| Footer | — | `position: sticky; bottom: 0; z-index: 0` | page lifts off the parked footer |

### 7.7 Transition grammar (how fullscreen compositions hand off)

1. **Dome-curtain rise**: next scene lives inside a viewport-wide `border-radius: 50% 50% 0 0` mask that
   scrubs up (`y: 100% → 0`) over the current scene — cover rooms, invite, form all use it. THE move.
2. **Full-bleed photo interlude**: between pinned chapters, one plain 100–120vh photograph (restaurant
   band, golden-hour cocktail, arch window) resets the eye before the next pin. Pins never touch.
3. **Stage-color flip**: cream → navy via full-viewport bg swap while the fixed header COLOR-scrubs to
   match — the "lights dimming" beat before the show section.
4. **Wipe + slide-up swap** (within pins): outgoing arch image SIZE-wipes `height 100% → 0` while the
   next title slides up through an overflow-hidden mask; numerals COLOR-flip. Repeat ×5.
5. **Click dome**: "Reservation" expands a fixed 1vw×1vh round-top mask at bottom-center to
   **170vw/170vw circle (130vw at ≥1440), 1s, ease none**, revealing the fixed navy form scene;
   second click plays it backwards. Booking = a place, not a popup.
6. **Footer reveal**: last section scrolls away from a bottom-sticky z-0 footer.
- Wheel smoothing: SmoothScroll 1.4.10 (inertial wheel); scrub lag does the rest.
- `prefers-reduced-motion: reduce` handled only by framework CSS (0.01ms transitions) — GSAP configs
  do NOT check it (their gap; we must do better).

## 8. Hero construction

Fixed header stage over: (1) full-viewport lagoon photograph — symmetric arch pavilion mirrored in
still water, dawn palette — under (2) bronze tint `rgba(161,128,93,0.5)`; (3) centered two-line LTRemark
title 9.58vw with faint cool text-stroke, upper third; (4) NO hero CTA — the outlined Reservation chip
lives in the nav; (5) image enters as a 2s height-curtain under the title. The hero is beat one of a
700vh pinned journey (rooms: "THE OCEAN ROOM" → "THE SALT BAR"), so the "hero" is really a 3-scene film.

## 9. Menu / dish presentation

- **Courses I–V as a scroll-scrubbed tasting sequence** (not a list): each beat = kicker "Course N"
  (60% ink) + LTRemark title + justified 2-line description + dish photo **clipped inside a crystal-facet
  polygon** (1px white stroked SVG mask) + giant ghost statement strip sliding horizontally behind
  ("LIGHTNESS — BIRTH OF A DIALOGUE", "UNITY — EARTH AND SEA") + roman-numeral progress I–V.
- **Cocktails**: one pinned arch frame; photo swaps by vertical wipe; title overlaps the arch and
  self-inverts via blend (see §11); ingredient line (Inter, centered) below; numerals track progress.
- The "menu" is narrative theater — five beats, one dish each — perfect model for a signature-dishes or
  catering-menu highlight reel (NOT for a full deli price list; pair with a conventional menu page).

## 10. Imagery treatment and crops

- One photographic world: warm Mediterranean-Arabic architecture (arches, cream plaster, sea), golden
  hour, high key — consistency IS the luxury cue. People shots get `backdrop-filter: blur(5px)` +
  `rgba(0,0,0,0.7)` overlay when text sits on them.
- Crops: fullscreen 100vh rooms; arch-masked portrait (39.5vw × 42vw); crystal-polygon dish masks;
  square-ish team tiles; portrait footer tiles (832×1248).
- Object layer: photoreal cutout salt crystals (webp, 78–390px) drifting at scrub-lag 10 + line-art
  crystal outlines (SVG strokes) as bg ornament at ~30% — SAME motif twice (photoreal + line art), a
  cheap depth trick. Ghost SALT SVG letters at bg+5% sit between ornament and content.

## 11. Signature graphic device — blend-mode title inversion

`.arch-text { color: #FCF2E1; mix-blend-mode: difference }` — slide titles are one text node overlapping
the arch photo: over cream bg it renders near-ink; over the photo it inverts into complementary color
(reads teal/sea-green over warm rose imagery — screenshots 10/11). Title + image + chemistry, zero
manual color management. Works with any imagery. Strongly stealable.

## 12. Hover and interaction states

Desktop-only (all HOVER configs `disabled: true` ≤991px): opacity lifts 0.2→1 / dims 1→0.6 over
0.5–0.7s power1.in; small MOVE nudges (±1vw); buttons `.btn-light`/`.btn-dark` swap-invert cream↔ink,
300ms ease; nav links dim; no scale-zoom image hovers at all — restraint vs Khufu's zoom grammar.
Numerals: inactive stage-color @ 0.2–0.3 → active full, via COLOR scrub not hover.

## 13. Mobile adaptations (390)

- **All SCROLL_TRANSFORM/HOVER/CLICK configs are disabled ≤991px** — mobile is a plain linear scroll:
  pins → stacked 100svh-ish blocks; course/cocktail scrubs → Swiper carousels (17 swiper refs);
  reservation dome → inline form section; header → burger panel.
- Type re-scales via vw at mobile values (H1 ~12–15vw); justified paragraphs go centered ragged; team
  becomes a stacked name list; footer stacks with giant wordmark kept full-width.
- Verdict: their mobile is a feature-cut, not a re-composition (Khufu's approach is better; take the
  lesson: keep light parallax + swipe sequences on mobile rather than deleting the identity).

## 14. What to steal (systems only)

1. **Declarative band choreography**: one ScrollTrigger per chapter; every child keyed to % bands
   (fifths for slide sequences, narrow bands for caption swaps, holds between). Build as one GSAP
   timeline per section with labels — trivially maintainable, infinitely tunable.
2. **Scrub-lag depth ramp**: 0 / 0.3 / 1 / 2 / 5 / 10 catch-up seconds as the parallax depth axis;
   tiny ±1–3vw texture drift vs huge 60–100vh structural moves. (For us: saffron threads, pistachios,
   rose petals, barberries drifting at lag 8–10 over ghost Farsi calligraphy.)
3. **Arch dome-curtain transitions**: `border-radius: 50% 50% 0 0` viewport masks scrubbing up between
   fullscreen scenes, and the click-driven dome that swallows the page for the reservation form
   (170vw circle, 1s, linear, reversible). The arch is already Persian vocabulary.
4. **Pin heights as pacing tokens**: 700vh opening journey / 1000vh showcase / 500vh drinks / 300vh
   invite / 250vh chef — chapter importance expressed as scroll distance, with one full-bleed photo
   interlude between pins so they never collide.
5. **Fixed 100vh header-stage** whose text COLOR-scrubs (white↔ink) at section boundaries; outlined
   Reservation chip always live in it.
6. **Blend-mode title inversion** (`mix-blend-mode: difference`) for display titles overlapping arch
   imagery — self-managing two-tone typography.
7. **Ghost-word stage**: 280px+ display words (or giant letter SVGs) at stage-color ±5%, sliding
   horizontally at low lag behind content; sequenced corner captions (STORIES / ART / TASTE pattern).
8. **Course-by-course tasting narrative** for signature dishes: kicker + title + justified 2-line
   description + masked photo + ghost statement + roman-numeral progress; 5 beats in one pin.
9. **Easing token set**: scrub = power1.inOut; entrances = power1.in 1–2s with 1–4s stagger delays;
   direct-mapped masks = none; one overshoot curve `cubic-bezier(0.68,-0.55,0.265,1.55)` reserved for
   a single playful drop per page.
10. **Two-pole palette discipline**: cream field + near-black ink + ONE dark stage color + one 50%
    photo-tint bronze; ghost/inactive states are stage-color alphas, never new hues.
11. **vw-proportional sizing** for poster-like scaling of display comps (pair with rem/clamp floors
    for accessibility — their raw-vw text has no min size, ours must).
12. **Bottom-sticky footer reveal** (z-0 under everything) with the giant full-width wordmark as the
    final image.
13. **Anti-lessons**: don't ship `markers: true` remnants (their red debug artifacts are in prod CSS
    frequency); don't kill all motion on mobile; wire `prefers-reduced-motion` into the JS layer, not
    just CSS.

## 15. Do NOT copy

LTRemark / Oceanic / Playfair-italic-as-quotes combo as-is; the cream/navy hex values; salt-crystal
iconography, SALT letterforms, crystal polygon masks; lagoon/arch AI photography; any copy ("Culinary
Odyssey by the Sea", course names, chef fiction); the arch logo. Content itself is unusable anyway
(fictional demo, AI images, typos like "IMAGIC", "WHISPE"). We take the choreography physics, band
grammar, dome-mask transitions, and pacing system only, re-skinned to Saffron and Rice's Persian
identity with real Torrance-deli content.
