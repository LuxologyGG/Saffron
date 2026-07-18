# Saffron & Rice, Design Brief
Design language: **"Sofreh at Dusk"**. Synthesis date 2026-07-18. Zero-build, self-hosted, no em dashes anywhere, distinct hero per page.

## 1. The language, in one paragraph

Sofreh at Dusk is a heritage-luxury system for a Persian and Middle Eastern deli: a warm rice-cream day ground that turns, page by page and scroll by scroll, toward an espresso green-black night, with saffron gold as the single primary accent and two logo-native supporting hues (saffron-thread red for prices and seals, crocus purple for ornament linework) used as spice, never as grounds. Structure comes from Khufu's heritage-luxury choreography (poetic preloader, day-to-night scroll narrative, chaptered kickers, arch-topped imagery), Laguna's arch-mask and sticky-panel cinema (200px top-corner arches, cream/ink inversion, sine-floating ingredient cutouts), and Tastavents' framed-viewport plating (a constant cream picture frame, carte-style numbered menu overlay, fluid vw type), while the ornament vocabulary is authentically Persian per Berenjak, Lo'bat, and Dokmeh: khatam diamond ticks, an original shamse rosette medallion, arch masks read as Persian ivan arches, and restrained Farsi word accents. Every borrowing is a **re-skinned system, never copied assets**: no reference font, image, SVG, hex, or copy line is reused; the palette is sampled from the client's own logo, the type is the vendored Clash Display / General Sans / Chivo Mono stack, and every ornament is drawn as original SVG.

### Logo-sampled palette (assets/img/brand/Saffronlogobg.png)
| Role | Hex | Source in logo |
|---|---|---|
| Saffron gold (primary accent) | #b68b4a (lite #d4a95d, deep #7a5c26) | ampersand, ring, bowl ornament |
| Deep red (secondary) | #970e0d (deep #741010, lite #c1403a) | saffron threads, RICE letters, diamond seal |
| Crocus purple (secondary) | #7b3397 (lite #ac7cba, deep #57266d, dusk #380f51) | crocus petals |
| Bowl green-black | #25332e (leaf #3b4c3e) | bowl band, leaf shadows |
| Warm cream (day ground) | #f6efe1 / #f0e2ce | rice mound |
| Script ink (night ground) | #0e110f | calligraphic S |

Type roles: Clash Display 500-700 (display), General Sans 400-600 (body), Chivo Mono 400/500 (eyebrows, prices, HUD labels). All self-hosted in assets/fonts, declared in assets/css/fonts.css.

## 2. Page-by-page concepts (distinct hero per page, mandatory)

### Home ("The Sofreh")
Hero signature: **arch-framed dolly-zoom hero**. Full-bleed kabab-fire photograph masked by the big Persian arch (--arch-radius), scroll-scrubbed slow zoom while a three-line Clash Display headline rises through overflow masks (820ms, cubic-bezier(.18,1,.25,1)); a ghost outline "SAFFRON" layer crossfades behind it. Borrowed from Laguna's cover zoom (research/refs/laguna/home/screenshots/desktop_scroll_00_0.png and desktop_scroll_01_2721.png) and Khufu's masked line reveal (research/refs/khufus/home/screenshots/clean_desktop_1440_viewport.png).
Sections:
1. Poetic preloader, once per session: ink overlay, three lines about saffron and rice typed word by word (90ms stagger), khatam diamond pulsing, Skip pill. Re-skin of Khufu's intro (research/refs/khufus/home/screenshots/state_desktop_intro_overlay.png).
2. Welcome statement: serif-scale display intro with an italicized emphasis word, chapter kicker "01 / The Kitchen" (Khufu's chapter system, research/refs/khufus/home/screenshots/desktop_scroll_02_1490.png).
3. Signature dishes trio: three arch-sm cards (koobideh, stews, rice) with sine-floating saffron-thread and crocus SVG cutouts drifting desynchronized behind (Laguna's cristal floats, research/refs/laguna/home/screenshots/desktop_scroll_04_10884.png).
4. Halal + service modes band: on-dark strip, mono labels, red khatam seals for the halal claims.
5. Day-to-night scroll CTA: 220vh sticky section lerping cream #f6efe1 to ink #0e110f while copy narrates lunch counter to dinner spread; text inverts in sync (Khufu's #khCtaReveal, research/refs/khufus/home/screenshots/desktop_scroll_09_6705.png through desktop_scroll_11_8195.png).
6. Testimonials: fanned polaroid-style cards with numbered index pills (Khufu's polaroid slider, research/refs/khufus/home/screenshots/state_desktop_polaroid_slide2.png).
7. Footer: cropped giant "SAFFRON & RICE" wordmark sliced by the viewport bottom over the night ground (Berenjak footer, research/refs/berenjak/home/screenshots/desktop_1440_full.png).

### Menu ("The Carte")
Hero signature: **carte-cover hero**. Night ground, a centered arch-dome panel holding a featured dish photo, dish name in giant Clash Display beneath, category chips in mono; a thin original shamse rosette spins slowly at the panel apex. Borrowed from Khufu's menu spotlight (research/refs/khufus/menu/screenshots/clean_desktop_1440_viewport.png) plus Tastavents' rotating medallion (research/refs/tastavents/home/screenshots/desktop_scroll_11_10989.png).
Sections:
1. Category index as a numbered hairline table (01 Party Platters / 02 Rice / 03 Sandwiches), rows separated by 20%-alpha gold hairlines, anchor jumps; the Tastavents carte overlay flattened into the page (research/refs/tastavents/interactions/screenshots/desktop_1440_menu_open_settled.png).
2. Per-category bands alternating cream and night; item rows: name in display, desc in body, dotted leader, price in Chivo Mono with a red diamond tick. Data renders verbatim from data.js, owner-authoritative.
3. Sticky category rail on desktop with roll-up hover labels (Dokmeh's two-layer text swap, research/refs/dokmeh/home/screenshots/desktop_1440_scroll_02.png).
4. Disclosure band: consumption and price disclaimers in mono, plus "call to confirm hours".

### Catering & Party Platters ("The Spread")
Hero signature: **spread-builder hero**. Cream ground framed by the constant viewport picture frame; a horizontal row of arch-sm platter photos steps up in size (10, 20, 30 guests) as a scroll-scrubbed sequence, headline "Feed Ten. Feed Thirty." with the counts in red. Frame borrowed from Tastavents' passe-partout (research/refs/tastavents/home/screenshots/desktop_1440_viewport.png); stepping sticky choreography from Laguna's panel handoffs (research/refs/laguna/home/screenshots/desktop_scroll_05_13605.png).
Sections:
1. Platter tiers: three large cards mapped to the owner's Party Platter menu, price sealed in a red diamond stamp; hover lifts with gold hairline.
2. How it works: 3-step numbered chapter rows (choose platter, call, pick up or delivery).
3. Stews and add-ons band on-dark with floating herb cutouts.
4. Occasions marquee: giant display marquee ("Mehmooni. Nowruz. Game Day.") re-skinning Tastavents' fs-866 marquee (research/refs/tastavents/home/screenshots/desktop_scroll_09_8991.png).
5. CTA: phone-first booking card, mono phone number at h3 scale.

### About ("The Story")
Hero signature: **light editorial timeline hero**. The one predominantly light hero: warm cream, small "EST. lineage" mono label, headline with an italic emphasis word, and a horizontal year scrubber (2008 Shayan, 2015 Seaside, 2018 Saffron Food Mart, 2026 Saffron & Rice) that scrubs archival-graded storefront imagery. Borrowed from Berenjak's light story timeline (research/refs/berenjak/story/screenshots/desktop_1440_scroll_01.png).
Sections:
1. New-management statement: honest copy, "formerly Saffron Food Market"; grain-textured photo treated as a pasted snapshot (Berenjak heritage collage, research/refs/berenjak/home/screenshots/desktop_1440_scroll_02.png).
2. Counter stations grid: Kabab / Stews / Rice / Deli with hairline-rule headers (Berenjak location grid re-skinned, research/refs/berenjak/home/screenshots/desktop_1440_scroll_04.png).
3. Halal sourcing band on-dark with the two owner halal claims as engraved-style cards.
4. One Farsi accent moment: "نوش جان" (Noosh-e jan) drawn as original SVG script over a photo, Latin annotation beneath (Lo'bat bilingual lockup, research/refs/lobat/home/screenshots/desktop_1440_full.png).

### Contact ("The Visit")
Hero signature: **split arch-window hero**. Left half: night panel with stacked mono facts (address, phone at display scale, service-mode chips); right half: storefront photo inside a tall arch-dome window that parallax-drifts slower than scroll. Structure from Khufu's contact/plan-your-visit editorial (research/refs/khufus/contact/screenshots/clean_desktop_1440_viewport.png) with Laguna's arch window (research/refs/laguna/home/screenshots/desktop_scroll_07_19047.png).
Sections:
1. Hours card: "Open daily, call (310) 504-0310 to confirm hours" honesty-first; blinking status dot.
2. Map/directions band: PCH cross-street description plus embedded-free static map image, gold route line drawn as original SVG.
3. Service modes: four pill rows with underline-retract hover (Khufu's CTA hover, research/refs/khufus/home/screenshots/state_desktop_whybtn_hover.png).
4. Footer wordmark as on Home.

### 404 ("The Spilled Bowl")
Hero signature: **shamse medallion hero**. Full-viewport night ground; a giant original saffron-gold shamse rosette SVG spins imperceptibly slowly at center with "404" cut out of its heart in Clash Display; scattered rice-grain and thread SVG cutouts sine-float around it; one line of copy and a gold pill home. Geometry from Dokmeh's sun-medallion blob (research/refs/dokmeh/home/screenshots/desktop_1440_scroll_00.png), floats from Laguna, reduced to a single-viewport page.

## 3. Ornament plan (all original SVG, drawn in-repo, never copied)

1. **Khatam diamond tick**: 7px rotated square, the default eyebrow/list marker (tokens .eyebrow::before). Gold default, red and crocus variants. Inspired by Berenjak's wordmark diamond; drawn as CSS/SVG primitive.
2. **Shamse rosette medallion**: original 12-point rosette built from two rotated squares plus petal arcs, single-stroke, used as the menu-hero spinner, the 404 hero, and a faint watermark behind section heads. Never sampled from any reference asset.
3. **Ivan arch masks**: the border-radius arch family (--arch, --arch-sm, --arch-dome) on imagery and panels; the "pylon" mechanic from Khufu's and Laguna re-read as a Persian ivan arch.
4. **Saffron-thread linework**: thin hand-drawn crimson thread strands as SVG dividers and floating cutouts (replaces Khufu's hieroglyph friezes with something ours).
5. **Crocus petal cutouts**: 2-3 original flat petal SVGs in the purple family for float layers; grain PNG overlay (self-generated noise) at low opacity over photography for the archival grade.
6. **Farsi calligraphic accent**: one per site (About page), original vector lettering of "نوش جان" with Latin caption; never a rendered reference font.
Restraint rule: gold carries the site; red appears only on prices, seals, and one hero; purple only in ornament linework and float cutouts. Neither red nor purple is ever a background.

## 4. Accessibility and reduced motion

- Contrast: body text is ink #0e110f on cream (AAA) or cream on ink (AAA). Gold as text always uses --accent-deep #7a5c26 on light and --accent-lite #d4a95d on dark (AA at label sizes). Red text on light uses #741010; purple text on light uses #57266d. Raw #b68b4a and #7b3397 are never used as small text on cream.
- prefers-reduced-motion: the CSS guard in tokens.css zeroes all animations/transitions; the JS engine must also branch: no preloader typing (show final frame, auto-dismiss), no scroll scrubbing (day-to-night section renders as two static stacked bands), no sine floats, no dolly zoom (static arch image), no marquee (static wrapped line). Content order never depends on motion.
- The day-to-night lerp and preloader run entirely as enhancement; all pages are readable with JS disabled (semantic HTML first, data.js hydration on top of server-rendered fallbacks where practical).
- Focus states use --focus with a 2px visible outline offset; the carte overlay and any dropdown trap focus and close on Escape; pills and rows have minimum 44px targets.
- Every arch-masked image keeps meaningful alt text; the imagesDisclosure line from data.js renders wherever representative photography appears.
- No autoplaying sound; any looping video is muted, has reduced-motion poster fallback, and is decorative-only.
- House rule enforced sitewide: no em dashes in any copy, code comment, or label; hyphens for ranges only.
