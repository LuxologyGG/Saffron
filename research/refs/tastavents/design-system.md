# Tastavents (tastavents.com) — Design System Extraction

Source: live capture 2026-07-18 (Playwright, desktop 1440 / mobile 390, DPR 2).
Raw artifacts: `home/` (page.html, styles.css, tokens.json, libraries.json, assets/, screenshots/), `interactions/screenshots/`.
Site is a single-page scroll narrative (sections numbered I–VI) with ES/CA/EN/FR language variants of the same page.

## 1. Palette (from `:root` CSS vars, verbatim)

| Token | Hex | Usage |
|---|---|---|
| `--black-1` | `#1D1D1B` | near-black ink |
| `--black-2` | `#1F1200` | warm espresso black — main dark section bg |
| `--brown-1` | `#3E270F` | dark chocolate brown (3rd most frequent color) |
| `--brown-2` | `#584513` | olive-brown |
| `--brown-3` / `--brown-5` | `#7F6641` / `#806641` | mid umber |
| `--brown-4` | `#34290E` | deep olive — header bar bg on scroll |
| `--brown-6` | `#997550` | caramel |
| `--brown-7` | `#CAB98E` | sand / muted gold (ghost display text) |
| `--yellow-1` | `#FCE9B9` | pale champagne — hero display type on photos |
| `--yellow-2` | `#E6D49B` | gold-cream — dominant text color on dark (2nd most frequent) |
| `--orange-1` | `#D24C00` | burnt orange accent (Swiper center medallion, highlighted display lines) |
| `--white-2` | `#FFEDDD` | peach-cream — page background + picture-frame border |
| `--white-3` | `#FFF1DD` | lighter cream variant |
| `--red-1` / `--green-1` | `#C50000` / `#2ac500` | form error/success only |

Computed color frequency confirms: `#E6D49B` (738 uses), `#3E270F` (564), `#FCE9B9` (397) are the working triad over `#1F1200`/`#FFEDDD` grounds. Hairline borders are `rgba(230,212,155,0.2)` (20% gold-cream) — used heavily in menu-overlay table rows.

## 2. Typography

- **Display serif:** `ivypresto-display, serif` (Adobe Fonts). Tall high-contrast didone-style serif, mostly uppercase, used for all hero/section display lines.
- **Body / UI:** `Optima, sans-serif` — flared humanist sans, letterspaced uppercase for nav, labels, buttons.
- **Icon font:** `icomoon`.
- **Fluid root:** `html { font-size: 0.520833vw }` desktop (= 7.5px at 1440), `1.30209vw` tablet, `2.56411vw` mobile — the whole layout scales in rem with viewport (1rem = 7.5px at 1440; multiply rem values by 7.5 for px).
- Scale in use (rem, desktop): display up to 86.6rem-class marquee (`fs--866`), section display ~7.2rem+, headings 4–5rem, body 1.6–2rem, labels 1.1–1.4rem.
- Letterspacing on uppercase UI: 2.7px / 3.3px / 4px. Body line-height ≈ 1.15 (8.625/7.5).
- Signature treatment: huge cream serif headline overlaid directly on full-bleed photography; "ghost" watermark headlines in `#CAB98E` at low contrast on cream; burnt-orange `#D24C00` display lines on espresso.

## 3. Spacing, grid, layout

- Bootstrap-style 12-col fraction max-widths (16.66/25/33.33/41.66/66.66/91.66%) + containers `1432.5px` and `1095px` (191rem / 146rem fluid).
- `--header-height: 10.8rem`; utility spacing like `pb-lg-165` (rem-scaled classes).
- The entire viewport is framed by a constant `#FFEDDD` border ("passe-partout" picture frame) around every section, dark or light.
- Sections alternate cream `#FFEDDD` and espresso `#1F1200` backgrounds; images frequently break the section boundary (overlap dark→cream).
- Breakpoints: 768px and 1025px are the working cutoffs (plus 576, landscape-phone special cases).

## 4. Radii

`50%` (circular buttons/medallions), `32.25px`/`37.5px` (pill buttons ≈ 4.3–5rem), `6px`/`3px` (small cards/inputs), `1.5px` hairlines. Buttons are pills or perfect circles — nothing squared.

## 5. Motion specs (extracted values)

Libraries actually detected in fetched JS (`libraries.json` hit counts): **GSAP (75) + ScrollTrigger (7), Swiper (109), curtains/ogl-class WebGL (31), locomotive-scroll (1 ref), react (41 — bundler artifacts)**. Custom in-house AOS-style attribute system `data-aos="fadeInUp .6s ease-out-cubic .4s, d:loop, trigger:.container-left"` drives reveals.

Easings (CSS, by frequency):
- Primary: `cubic-bezier(0.645, 0.045, 0.355, 1)` (easeInOutCubic) — 25× at 0.4s, plus 0.6s and 0.8s variants.
- Secondary out: `cubic-bezier(0.215, 0.61, 0.355, 1)` (easeOutCubic) at 0.3/0.6/0.8/1.2s.
- Snappy: `cubic-bezier(0.785, 0.135, 0.15, 0.86)` (easeInOutCirc) at 0.2/0.3s for hovers.
- Standard: `cubic-bezier(0.42, 0, 0.58, 1)` at 0.4/0.6s.
- Stagger delays: 0.16s / 0.2s / 0.3–0.6s ladder on grouped reveals.

GSAP (from app-33d544c6.js): `ease:"power1.out"`, `"power4"`, `"expo"`, `"circInOut"`, `duration:.3/.5`; ScrollTrigger used for pin/scrub of the horizontal ingredient strips and marquee.

Keyframes present (38 blocks): `reveal-up/down/left/right` (clip-path wipes), `fadeInUp/Down`, `scale-left/scale-top`, `in-width-left/right` (rule lines growing), `rotate` (spinning medallion), `progressbar` (Swiper autoplay progress), `click`.

Swiper config: `speed: 800` (content sliders) and `1200` (fade gallery), fade + watch-progress variants; autoplay progress bar animation.

## 6. Gesture / interaction inventory

- **Full-screen menu overlay** (`#bt-menu` circular hamburger, top right): cream overlay sliding under the header, 3-column layout — chef photo (left), numbered I–VI section index as a bordered table (center, rows separated by 20% gold hairlines), reservation card with team photo + phone (right). Items are `data-scrollto` buttons (single-page anchor jumps). Close morphs hamburger → X in same circle.
- **Drag/swipe galleries:** 6 Swiper instances, 35 slides total; gallery section with prev/next circle buttons flanking a rotating burnt-orange medallion with the "S" mark; slide transition 800–1200ms.
- **Scroll-triggered progressive-blur gallery:** food photos render blurred (WebGL/curtains-class canvas treatment, 31 lib hits) and sharpen as they enter; also parallax offsets (28 `parallax` refs in markup).
- **Marquee:** giant `fs--866` uppercase serif marquee (`.marquee-wrapper`, horizontal) + twin `marquee-vertical marquee-left/right` columns; hover-triggered `.marquee-trigger`.
- **Custom cursor wrapper** (`.cursor-wrapper`) present.
- **Buttons:** letter-swap hover (`data-letter` attribute duplicating label), 0.2–0.3s easeInOutCirc.
- **Preloader:** logo loader captured in `loader.html` (`.loader-logo`), separate loader JS bundle.
- **Reservas:** header pill scroll-jumps to section VI (contact/booking) — no modal.

## 7. Image treatment

- Warm, low-key food photography; full-bleed hero with a small portrait-orientation inset video-like card centered above headline.
- Images sit in cream-framed sections, often cropped as tall portrait cards with ingredient captions in letterspaced Optima uppercase (`SUPREMA ATUN ROJO`, `GAMBAS`, `PULPO`).
- Progressive blur-to-sharp reveal on scroll; slight parallax on most imagery; no visible filters beyond warm grading.
- Assets: 74 images downloaded to `home/assets/` with manifest.
