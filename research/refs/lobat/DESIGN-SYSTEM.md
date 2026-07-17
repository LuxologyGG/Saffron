# Lo'bat — Design System Recon (R2e)

**Live site:** https://lobataccessories.com/ (found via https://www.awwwards.com/sites/lobat)
**Credit:** Dokmeh Agency — Awwwards Nominee, Sep 28 2022 (avg score 8.27). WordPress + WooCommerce theme "Lobat".
**Captured:** 2026-07-17, breakpoints 390 / 1440, 12 scroll steps. Evidence in `screenshots/`, `page.html`, `styles.css`, `tokens.json`, `libraries.json`. Theme JS/CSS pulled to scratchpad for motion analysis.
**Status:** Live and still maintained (product images dated 2025-12; copyright 2026).

Legend: **[O]** = observed directly (screenshot, computed style, source code). **[I]** = inferred.

---

## 1. Typography — how Persian identity is carried

Two-voice system, extremely disciplined:

| Role | Face | Evidence |
|---|---|---|
| Everything UI: nav, H2–H4, body, prices, buttons, footer | **DM Mono** (monospace), forced with `!important` | [O] `"DM Mono", monospace !important` in theme CSS; every screenshot shows mono letterforms |
| Accent script: hero H1 "Be Unique, Be Inspired" + "L'bat" signature under logo | **Roses Please** / **Roses Please Alt** (self-hosted handwritten script, woff2) | [O] `@font-face` in styles.css; hero screenshot |
| Logo | Hand-drawn Persian **Nastaliq-style calligraphy** ("Lo'bat" in Perso-Arabic script), shipped as `logo.svg` — an image, not a webfont | [O] logo.svg 107x140 in header and footer |

**The Persian typographic move [O/I]:** Persian identity is NOT expressed by setting content in Farsi or using an Arabic-script webfont. It is carried by (a) a calligraphic Nastaliq logotype used as a graphic mark, (b) a Latin handwritten script that echoes the calligraphy's ink-and-flourish gesture, and (c) Persian product names transliterated in Latin mono ("Takhmeh", "Sarv", "Aviz"). The mono face plays the neutral "typewriter" voice so the calligraphy reads as art against it. [I] This contrast (machine mono vs. human ink) is the whole typographic idea.

Scale behavior [O]: H2 ~56–64px mono at 1440 ("The lo'bat Concept", "Drop 02"); body 16px/24px mono; nav ~14–15px mono with wide tracking; footer H4 "Stay Wild!" ~48px. Mobile keeps the same faces, H2 wraps to two lines (~34px). Only text-transform observed: `capitalize`.

## 2. Color — hex palette

| Token | Hex | Where | Evidence |
|---|---|---|---|
| Ink (text, buttons, logo) | `#212529` (+ pure `#000` for logo/borders) | all text, pill buttons, thin rules | [O] pixel-sampled + colorFrequency 292 uses |
| Paper white | `#ffffff` with fine dark speckle grain overlay | concept section, product band background | [O] sampled; speckle texture visible in shots 02–06 |
| Dusty mauve | `#cdb0c2` | arch product cards, "Our Wild Way" full band | [O] pixel-sampled twice; also computed style rgb(205,176,194) |
| Sand / khaki | `#cabfa5` | "Drop 02" band, footer band | [O] pixel-sampled twice; computed rgb(202,191,165) |
| Antique cream | `#faebd7` | hero script H1 ink color | [O] rgb(250,235,215) in computed colorFrequency; cream script visible on hero [I: exact mapping to the H1] |
| Photo near-black | ~`#0f1206`–`#1a1c12` | hero photograph field | [O] sampled from hero (photo, not a CSS token) |

System [I]: 3 flat band colors (paper / mauve / sand) + 1 ink + 1 cream accent. Zero gradients in the design language (only WP/bootstrap defaults in CSS). Saturation lives entirely in photography (blue gloves, gold earrings); UI colors are all desaturated, slightly grayed "dusty" tones — very Persian-miniature/plaster-wall.

## 3. Layout system

- **Full-bleed horizontal color bands** as page rhythm [O]: dark hero photo → speckled paper → mauve → paper → sand → sand footer. Each band is a `data-scroll-section` (7 registered sections, `section0`–`section6`) [O in page.html].
- **Centered nav** [O]: links split around a center calligraphic logo that hangs down over the hero (Home/Products/New Arrivals/Who We Are | logo | Login/Cart). White bar, thin black underline rule. Mobile: logo left, "Menu" + two-square glyph right.
- **Ogee-arch (Persian dome) mask as the core shape** [O]: every product card is a mauve panel whose top is a pointed onion-dome/ogee arch (mosque-arch silhouette); cards sit in a 4-column row on desktop, and a small arch "bump" is reused as the divider poking up into the next section (shot 06). This one shape does most of the cultural signaling.
- Bootstrap 12-col grid + Swiper under the hood [O: bootstrap.min.css, swiper classes, `row` classes].
- **Pill buttons** [O]: solid ink-black, `border-radius: 180px` (in tokens), mono label ("Discover More").
- Text blocks are narrow (~60ch) and left-aligned inside bands; headings left-aligned except centered concept intro [O].
- Footer [O]: sand band, giant mono "Stay Wild!", 3 loose columns (social / product list / calligraphy mark), thin rules.

## 4. Imagery treatment

- **Hero** [O]: full-bleed, moody, film-grain analog fashion photograph (near-black field, one saturated prop — cobalt gloves, gold earrings); cream script slogan overlaid low-left; autoplaying product video elsewhere on page (plyr).
- **Product shots** [O]: earrings photographed straight-on, cut out on the flat mauve arch panels — object-as-icon, no scene.
- **Process/about imagery** [O]: snapshot-style photos rotated a few degrees and stacked as a collage, with green plant cutouts overlapping the photo edges and the band boundary (shot 06) — scrapbook energy against the strict mono type.
- **Surreal still-life** [O]: "Drop 02" band uses black mannequin hands balancing a dome and a tray of giant earrings on plain sand ground — product as theater.
- Speckled paper grain overlays the white bands [O]; no drop shadows, no rounded photo corners (only the arch masks and pill buttons are curved).

## 5. Motion patterns

Libraries detected at runtime [O, libraries.json]: **GSAP + ScrollTrigger registered, locomotive-scroll, Swiper, WebGL canvas (2880x1800), Plyr**. `html.is-smooth-scroll-compatible` class gates smooth scroll.

- **Preloader system** [O, CSS keyframes in tokens.json]: two hairline rules grow from 0 to ~45vw/46vw (`growLineOne/Two`), logo scales 0→1 (`growLogo`), and a text marquee sweeps `translateX(105% → -105%)` with an opacity snap (`moveText`); `html.is-loading` → `.loaded` class added 500ms after DOM ready [O, script.js].
- **Smooth scroll + reveals** [O]: locomotive-scroll with 21 `data-scroll` elements, `data-scroll-repeat` (reveals re-fire both directions), per-band `data-scroll-section` splitting for performance. 39 elements carried non-none transforms at capture [O]. [I] Reveals are class-toggled fades/translates (`is-inview`) rather than scrubbed timelines; no pinning observed.
- **Menu** [O, script.js]: full-screen menu panel slides with `TweenMax.to('#header-menu-container', 1.5, { y: '0%'/'130%', ease: Power4.easeOut })` — long 1.5s luxurious ease-out, GSAP v2 syntax.
- **Hover** [I]: product images swap/zoom on hover (jquery.hoverplay.js present suggests hover-triggered video/img play on cards).
- Tempo [I]: slow and buttery — long durations, strong ease-out, no snappy micro-motion; motion personality matches the "poetic" brand copy.

## 6. What to steal (systems only)

1. **The two-voice type system**: one workhorse mono/typewriter face for ALL UI (nav, headings, prices, buttons) + one calligraphic accent used only twice per page (hero line, signature). For Saffron & Rice: mono or grotesque workhorse + a Nastaliq-flavored script accent for "خوش آمدید"-style moments and the logotype.
2. **Calligraphy as mark, not as body text**: Persian identity via a hand-drawn Perso-Arabic logotype (SVG) and transliterated Persian words (Tahdig, Sabzi, Barbari) set in the Latin workhorse — no fake "Arabic-style" Latin fonts.
3. **The ogee/dome arch as a single reusable mask primitive**: menu-item cards, photo frames, and section-divider bumps all cut from the same Persian-arch silhouette. One shape, used everywhere, beats ten ornaments.
4. **Flat color-band page rhythm**: full-bleed alternating bands (paper → dusty accent → warm neutral), each band a scroll-section with its own reveal group. Remap the palette: mauve/sand → saffron gold, pistachio, pomegranate, rice-paper cream, herb-dark ink.
5. **Dusty, grayed UI palette + saturated photography**: keep chrome desaturated so food photos carry the color punch.
6. **Speckle/grain paper texture** on light bands to avoid flat-white sterility.
7. **Preloader grammar**: growing hairlines + scaling mark + one marquee line, gated by an `is-loading` html class — cheap, elegant, GSAP-light.
8. **Motion tempo**: long (1–1.5s) Power4/expo ease-out slides for overlays; repeatable in-view reveals per band; no scroll-scrubbing needed to feel premium.
9. **Ink pill buttons** (huge radius, mono label) as the only rounded UI element besides the arch.

**Do not copy**: the mauve/sand fashion palette literally, the mannequin-hand surrealism, or the Roses Please font itself (license unknown [I]) — steal the roles, not the assets.
