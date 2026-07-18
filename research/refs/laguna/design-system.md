# Laguna Al-Sha'ab (culinaryodissey.uprock.pro) — Extracted Design System

Source: live capture 2026-07-18, desktop 1440x900 @2x and mobile 390x844 @2x.
Raw artifacts: `home/{page.html, styles.css, tokens.json, libraries.json, scrolltriggers.json (empty — gsap scoped), transform_samples.json, assets/, screenshots/}`.

## 1. Palette (exact, by computed-style frequency)

| Role | Value | Hex | Freq |
|---|---|---|---|
| Primary cream (bg light sections, text on dark) | rgb(252, 242, 225) | #FCF2E1 | 1136 |
| Ink / near-black (text, dark-section bg) | rgb(37, 37, 39) | #252527 | 612 |
| Pure white (accents) | rgb(255,255,255) | #FFFFFF | 108 |
| Cream 60% (secondary text on dark) | rgba(252,242,225,.6) | — | 72 |
| Alt warm paper | rgb(246, 242, 232) | #F6F2E8 | 11 |
| Deep blue-slate (sea imagery tint) | rgb(30, 36, 46) | #1E242E | 8 |
| Ink 20% / 10% (hairlines, dividers) | rgba(37,37,39,.2/.1) | — | 35 |
| Warm taupe 15% (soft fills) | rgba(175,166,157,.15) | — | 4 |
| Bronze 50% (accents) | rgba(161,128,93,.5) | #A1805D @50% | 3 |
| Error red (form validation) | rgb(255,0,0) | #FF0000 | 24 |

Two-mode system: light sections on #FCF2E1 with #252527 text; `dark-section` inverts (bg #252527, text #FCF2E1, secondary at 60% alpha).

## 2. Typography

- Families: **LTRemark** (display serif/decorative, self-hosted @font-face), **Playfair Display** (serif headings), **Inter** (body/UI), fallback Arial/Helvetica. "YS Text" appears only in the Yandex captcha widget — ignore.
- Root/body font-size: 16px. Text-transform: uppercase used widely for labels/nav.
- Letter-spacing is consistently negative and scale-linked: -0.56 to -0.64px (body/small), -1.2 to -1.6px (mid headings), -1.9 to -2.0px (large headings), -2.25 to -2.9px (XL), and an extreme -8.25px on the giant hero display line.
- Huge outline type: `.text-stroke` class — transparent fill with stroke (hero "text3" layer), used as oversized backdrop word.
- Arched/arc-set text: `.arch-text h7` rows (five staggered lines forming an arch over the chef/arch section).

## 3. Spacing, grid, layout

- Max content widths: 1296px (primary container), 960px, ~1160px; column blocks ~346px, ~436px, ~575px, ~835px.
- Grids observed: 3-col 460px (dish cards), 5-col ~262px (team), 2-col ~671px, and a 4-col asymmetric editorial row `161px / 295px / 682px / auto`.
- Breakpoints (media queries): 479 / 767 / 991 / 1279 / 1439 / 1919 — six-tier system: mobile <480, phablet 480–767, tablet 768–991, desktop 992–1279, 1280–1439, 1440–1919, 1920+.
- Page is a long single-scroll: 13 `section` blocks, total scroll height ~33,650px at 1440 (~8,800px at 390) — a very long pinned-sequence page.

## 4. Radii

- Signature shape: **arch / half-dome** — `border-radius: 200px 200px 0 0` (and fluid variants 141px, 204.6px, 284.5px top-corners-only, plus `50% 50% 0 0`) applied to images and masks. Full circles (50%) for badges/spinning stamps. Small UI radii: 3px, ~10px, 11px.

## 5. Motion system (measured live, not guessed)

Engine: GSAP 3 + ScrollTrigger + CustomEase + Observer bundled inside the site builder runtime (`do.js`); Swiper for carousels; SmoothScroll 1.4.10 for wheel smoothing; curtains/ogl traces present. `prefers-reduced-motion` media query supported. Three CSS keyframes only: `spin` / `islands-spin` (360° infinite rotation — rotating circular badge stamps).

All section motion is ScrollTrigger-scrubbed with pinned (`position: sticky`/pin) wrappers. Measured stages at 1440x900 (scroll y in px):

1. **Hero cover zoom (y 0–2700):** `cover__img1` scales 1.077 → 2.3 (measured 1.077 @0, 1.646 @1200, 2.28 @2721, clamps at 2.3) while pinned — a scrub-tied dolly-zoom into the cover photo through an arch mask (`cover-mask3` is sticky). Factor ≈ +0.045 scale per 100px scroll.
2. **Cover text layers (y ~2700–5400):** `mask-content` translates 0 → -450px; outline `text-stroke` layer fades 0 → .44 → 0 and rises -128px — crossfading stacked title layers.
3. **About parallax (y ~5400–8100):** decorative text wrapper drifts +400px down, `about__img` +324px — background layers move WITH scroll at roughly 0.12–0.15x factor (slower than content).
4. **Dishes reveal (y ~8100):** `product__text-decor-wrapper` pops scale 0 → 1 with opacity 0 → 1 (toggle-style, not scrubbed); `product__cristal` slides y +450 → 0 with fade-in.
5. **Idle float loops:** all `img-cristal` and `salt-img` elements oscillate y between roughly -70 and +9px (most ±9px) continuously — yoyo sine-eased float loops on scattered ingredient/crystal cutouts, desynchronized per element.
6. **Big image wipe (y ~16300–19000):** full-bleed image translates +362 → +527px as next section overtakes.
7. **Arch text sequence (y ~19000–21800):** five `arch-text`/`arch-title-mask` lines start at +503px, rise to 0 staggered (line1 first, lines 2, then 3-5), each fading out after arrival except the last — a scrub-staggered arch-title build.
8. **Chef → team handoff (y ~21800–27200):** `chef__team-wrapper-sticky` rises -540 → 0 while `section-chef` exits +675 — overlapping panel slide.
9. **Invite panel (y ~24500–27200):** sticky `invite__img` slides -540 → 0 (curtain-up reveal into the invitation/booking panel), followed by sticky form section and footer (footer image also arch-masked).
10. **Header:** fixed; hides by -234px translate + opacity 0 near page end (footer overlap).

Easing/duration notes: scrubbed tweens are scroll-tied (no fixed duration); ScrollTrigger's smooth-scrub uses `ease: "expo"` catch-up (found in bundle). Interaction transitions in CSS are minimal (0.2s linear opacity; lightbox cubic-bezier(0.4, 0, 0.22, 1)) — nearly all motion is JS inline-style driven. gsap instance is module-scoped (not on window), so exact tween eases beyond the above are rebuild-to-match from the measured stage tables in `transform_samples.json`.

## 6. Interaction inventory

- Preloader: captured (`home/loader.html`).
- Swiper carousel (dish/paginator SVGs 1-4 in assets).
- Rotating circular text badges (`spin`/`islands-spin`, 360° linear infinite).
- Custom cursors: default only (pointer/text) — no custom cursor element.
- Photo lightbox (PhotoSwipe — `pswp` keyframes/vars).
- Sticky booking form (`sticky-form` section) + Yandex SmartCaptcha.
- No videos, no canvas on the home page.
