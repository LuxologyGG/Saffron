# KHUFU'S (khufus.com) — Extracted Design System

Recon date: 2026-07-18. Stack: WordPress + Astra theme + Elementor Pro, with heavy custom hand-written sections (`khf-*`, `khx-*`, `kh-*`, `mnq-*`, `mps5-*` namespaces) injected as inline `<script>`/`<style>` blocks. NO GSAP, NO Lenis — all motion is custom rAF + CSS keyframes + IntersectionObserver. Detected libs: Lottie (5.10.1, CDN), Swiper (Elementor bundled), jQuery.

## 1. Palette (sampled from computed styles, ordered by frequency)

Core brand (custom sections):
- `#342818` — deep umber brown (58 uses): dark headings on light, intro overlay text base
- `#3F2C1F` — dark cocoa (38 + many alpha variants): primary text/CTA color in warm sections; alpha steps used constantly: `rgba(63,44,31,.76)`, `.74`, `.6`, `.56`, `.5`, `.14`, `.08`
- `#5C472B` — bronze (borders at `rgba(92,71,43,.08)`)
- `#6A4C36` / `#3D291C` / `#7B5E4A` / `#8B715C` — supporting browns
- `#5A4726`-ish intro overlay bg (solid warm brown full-screen; sampled ~`#5a4a2c`)
- `#1E120C` — near-black espresso (`--kh-end-bg`, scroll-driven background darkening target)
- `#EADFD4` / `#EADFD3` — warm sand/beige section bg
- `#D9BFA8`-ish blush-sand gradient zones (pillars section fades from cream to peachy sand)
- `#FAF7F2` — warm off-white (`rgba(250,247,242,.86)` panel fills)
- `#FFFFFF` — white (333 uses; hero text, dark-section text)
- `#1E293B` (slate) and `#67768E` (gray-blue, 713 uses) — Astra theme defaults leaking into generic text; NOT brand, ignore when re-skinning
- Astra globals: `--ast-global-color-0: #060097`, `-1: #c10fff`, `-7: #ffcd57` — unused theme leftovers, not visible in design

Rule: the brand is a warm monochrome ramp (white → sand `#EADFD4` → blush → bronze → cocoa `#3F2C1F` → espresso `#1E120C`), zero accent hue. Contrast comes from photography and light/dark section alternation.

## 2. Typography

Families (all self-hosted/@font-face; Inter via Cloudflare cf-fonts):
- **IvyOra Display** (`IvyOraDisplay`, serif) — display headlines. Weight 300 for hero (w/ 600 italic `<em>` spans for emphasis words), letter-spacing ~0.01em–0.05em, frequently uppercase.
- **Golden Hopes** (`GoldenHopes`, cursive script) — handwritten sub-lines under headings ("Recognition With Substance", polaroid captions).
- **Bricolage Grotesque** — UI/label/kicker font: buttons, kickers, small caps meta. 13px, weight 300, uppercase, letter-spacing 0.08em is the standard button spec.
- **Plus Jakarta Sans** / **Inter** — body paragraph fallbacks (Astra base).

Scale (fluid clamps found in CSS):
- Hero H1: `clamp(58px, 18vw, 92px)` mobile-driven; large display also `clamp(78px, 8vw, 146px)`
- Section H2: `clamp(28px, 3vw, 46px)`, `clamp(30px, 2.5vw, 44px)`, `clamp(22px, 2.35vw, 40px)`
- H3/card titles: `clamp(22px, 1.7vw, 30px)`, `clamp(32px, 2.15vw, 38px)`
- Root/body: 18px / line-height 29.7px (1.65)
- Kickers/labels: 12–13px uppercase, tracking 2.2–3.74px (e.g. "01 / SETTING", "FINAL INVITATION")
- Letter-spacing inventory: 0.64, 0.8, 1.04, 1.12, 1.84, 2.2, 2.4, 2.64, 2.8, 3, 3.74 px

Signature type moves: giant ghost section numerals ("01"…"07") in ultra-light serif at ~8–15% opacity behind/beside headings; italic serif emphasis words inside roman uppercase headlines; script overlays crossing baseline of serif caps.

## 3. Spacing, grid, containers

- Containers: Astra `--ast-normal-container-width: 1200px`; custom sections use `max-width: 1440px` and full-bleed `100vw` breakouts (`margin-left: calc(50% - 50vw)`)
- Content max-widths in use: 320/340/355/360/390/460/470/480/500/560/680/720px (text columns ~560–720px)
- Default block padding: 100px top/bottom, 80px sides (`--wp--custom--ast-default-block-*-padding`); custom sections 60–70px vertical
- Grids: `repeat(3, 1fr)` trios (why-panels, award cards), asymmetric 2-col `500px 740px` and `560px 560px 88px` editorial splits
- Section rhythm alternates: white → sand → dark brown → white, with one scroll section (`.kh-cta-reveal`) at 240vh (220vh tablet, 120vh mobile) driving a sticky color transition

## 4. Radii & image treatment

- Radii: `999px`/`50px` pill buttons; `6px` cards; **`120px 120px 0 0` / `80px 80px 0 0` arch ("pylon") tops** on feature images — the signature Egyptian-arch mask; `10%` on small thumbs
- Photography: warm-graded film-like stills + b/w mixed; polaroid frames (white border, slight rotation, stacked/fanned); tilted snapshots (±2–4° rotate) in collage rows; full-bleed background video in hero (autoplay/loop/muted mp4)
- Line-art ornaments: thin single-stroke Egyptian motifs (lotus columns, cartouche dividers) in pale bronze at low opacity as section dividers and margins

## 5. Motion system (all custom, no GSAP/Lenis)

Easings found in CSS: `cubic-bezier(0.18, 1, 0.25, 1)` (hero line reveal — dominant "luxury out-expo" curve), `cubic-bezier(0.22, 1, 0.36, 1)`, `cubic-bezier(0.77, 0, 0.18, 1)` (in-out wipes), `cubic-bezier(0.2, 0.9, 0.2, 1)`, `cubic-bezier(0, 0.33, 0.07, 1.03)` (slight overshoot), `cubic-bezier(0.18, 0.92, 0.18, 1)`.

Key recipes (extracted from inline JS/CSS):

1. **Intro preloader** (`Khufus-Preloader-main` plugin): full-screen solid brown overlay; 4 poetic lines shown word-by-word. Constants: `WORD_STAGGER = 90ms` per word, `HOLD_MS = 3600` per line, `EXIT_MS = 450`. Line-in: `khfLineIn` fade+16px rise; line-out: fade+12px up-shift. Words animate `khfWordIn` (fade + 10px rise). Lead words (`.khf-lead`) render in brighter serif vs dimmer rest. sessionStorage-gated (`khufusIntroSeen:<origin+path>`), skipped on reload; pill "Skip Intro" button bottom-center. Runs per-page path.
2. **Hero headline mask reveal**: each line wrapped `.khf-line { overflow:hidden }` > `.khf-line-inner` starting `translate3d(0,115%,0) rotateZ(0.9deg)`, animating to rest via `khfLineIn 820ms cubic-bezier(0.18,1,0.25,1)` forwards, staggered per line; fires only after `document.fonts.load('300 1em "IvyOraDisplay"')` resolves (FOUT-safe).
3. **Why-panels parallax** (`#khfWhySec`): 3 columns; on rAF scroll, outer panels drift opposite directions. Math: normalized center offset clamped [-1,1], dead-zone 0.2, smoothstep ease `t*t*(3-2*t)`, y = `dir * 220 * speed(0.25 default, data-speed attr) * t`. Disabled ≤1024px; becomes click accordion ≤767px.
4. **Scroll-driven dark-mode CTA** (`#khCtaReveal`, 240vh, sticky child): progress eased with exponential smoothing `eased += (p - eased) * 0.10` per frame; background lerps `--kh-start-bg` (#fff) → `--kh-end-bg` (#1e120c), text color lerps in sync, ornament/button borders lerp opacity (0.55→0.28, 0.08→0.12), scale lerps 0.94→1.04. The whole page appears to "turn to night" as you scroll — mirrors the day-to-evening restaurant narrative ("The Experience Evolves With The Light").
5. **Reveal-on-scroll**: IntersectionObserver adds `is-in`/`kh-home-story-animate` classes; standard transition `opacity 0.44s 0.08s, transform 0.44s 0.08s` or `opacity .3s/.35s + translate`; delay utility classes (`kh-home-story-delay3`).
6. **Polaroid slider** (`#monarqPolaroidSliderV2`): full-bleed stacked-photo carousel with numbered index buttons (01/02/03), counter button ("1/4"), fanned rotation transforms; transitions ~0.35s.
7. **Reserve dropdown** (`.mnq-reserve-wrapper`): header pill button opens a small dropdown with 2 options (Breakfast & Lunch / Dinner–Bistro); `max-height/opacity/padding 0.35s` accordion transition; only one open at a time.
8. **Hover micro-interactions**: underline-retract CTA (`::after` 1px line, `width 0.3s ease-in-out` collapses to 0 + label fades to 0.4 opacity); button transitions `border-color/color/opacity/background-color/transform 0.3s`; card hover lifts `transform .4s var(--e-transform-transition-duration)`.
9. `scroll-behavior: smooth` on html (native, no smooth-scroll lib).

Timing summary: micro 0.2–0.35s; reveals 0.44–0.82s; hero 820ms; ambient scroll effects frame-lerped at 0.10 smoothing factor.

## 6. Nav / footer patterns

- Header: centered stacked logo ("KHU / FU'S" two-line wordmark with bird hieroglyph marks) with a thin vertical rule dropping below it; only two flanking links: RESERVATIONS (dropdown pill trigger) and BISTRO (external khufusbistro.com). No hamburger, no conventional menu — ultra-minimal.
- Sticky behaviors modest; header sits over hero video (white text) and inverts contextually.
- Footer: dark cocoa; four pill CTAs (Reserve Your Table / Explore The Menu / Plan Your Visit / Explore The Group) in Bricolage 13px uppercase; MONARQ. group credit link; social icons (FB/IG/LinkedIn); thin-line Egyptian ornament dividers.

## 7. Content/voice

Kicker + display + script sub-line stacking on every section; numbered chapters 01–07 (Setting, Composition, Atmosphere, Global Recognition, … Hospitality Culture, Final Invitation). Copy is restrained, second-person, "heritage not performance" register. Awards band: "MENA's 50 Best, No. 1" repeated cards with pyramid photography.
