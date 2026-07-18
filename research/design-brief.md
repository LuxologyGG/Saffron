# Saffron & Rice, Design Brief
Design language: **"Sofreh at Dusk"**. Synthesis date 2026-07-18, revised after council round 1. Zero-build, self-hosted, no em dashes anywhere, distinct hero per page.

## 1. The language, in one paragraph

Sofreh at Dusk is a heritage-luxury system for a Persian and Middle Eastern deli: a warm rice-cream day ground that turns, page by page and scroll by scroll, toward an espresso green-black night, with saffron gold as the single primary accent and two logo-native supporting hues (saffron-thread red for prices and seals, crocus purple for ornament linework) used as spice, never as grounds. Structure comes from Khufu's heritage-luxury choreography (poetic preloader, day-to-night scroll narrative, chaptered kickers, arch-topped imagery), Laguna's arch-mask and sticky-panel cinema (200px top-corner arches, cream/ink inversion, sine-floating ingredient cutouts), and Tastavents' framed-viewport plating (a constant cream picture frame, numbered menu index, fluid type), while the ornament vocabulary is authentically Persian per Berenjak, Lo'bat, and Dokmeh: khatam diamond ticks, an original shamse rosette medallion, Persianate arch masks, and restrained Farsi word accents. Every borrowing is a **re-skinned system, never copied assets**: no reference font, image, SVG, hex, or copy line is reused; the palette is sampled from the client's own logo, the type is the vendored Fraunces / General Sans / Chivo Mono stack, and every ornament is drawn as original SVG. One original signature is load-bearing on every page: the saffron-thread linework is the sitewide divider system (it replaces generic hairlines wherever a section divider appears), so the ours layer carries structure, not just decoration.

### Logo-sampled palette (assets/img/brand/Saffronlogobg.png)
| Role | Hex | Source in logo |
|---|---|---|
| Saffron gold (primary accent) | #b68b4a (lite #d4a95d, deep #6e5322) | ampersand, ring, bowl ornament |
| Deep red (secondary) | #970e0d (deep #741010, lite #c1403a fills-only on dark, text-on-dark #e0736c) | saffron threads, RICE letters, diamond seal |
| Crocus purple (secondary) | #7b3397 (lite #ac7cba, deep #57266d, dusk #380f51) | crocus petals |
| Bowl green-black | #25332e (leaf #3b4c3e) | bowl band, leaf shadows |
| Warm cream (day ground) | #f6efe1 / #f0e2ce | rice mound |
| Script ink (night ground) | #0e110f | calligraphic S |

Type roles: **Fraunces variable 100-900 with true italics** (display; the high-contrast serif voice that matches the calligraphic wordmark and the serif display registers of every baseline; its italic axis serves every "italic emphasis word" moment in this brief), General Sans 400-600 (body), Chivo Mono 400/500 (eyebrows, prices, HUD labels). Clash Display is removed from the stack entirely; no grotesk display survives. All fonts self-hosted in assets/fonts, declared in assets/css/fonts.css.

### Imagery honesty and licensing
- Every rendered image must be either owner-supplied or explicitly licensed; blog-scraped photos are research reference ONLY and never ship. research/business/assets/manifest.md carries a license-status column per asset; anything not cleared is replaced by owned photography or licensed stock labeled representative.
- The Home hero photograph must be the owner's own or licensed stock, never a scraped blog image.
- An image manifest (slug, source, license, era) is a build deliverable; the imagesDisclosure line from data.js renders wherever representative (non-owner) photography appears.
- Heroes that are asset-blocked (Spread multi-platter sequence, About multi-era archive) ship on ONE photo plus typographic/SVG structure; the multi-photo sequences are listed post-photoshoot enhancements, not launch requirements.

## 2. Page-by-page concepts (distinct hero per page, mandatory)

### Page transition (all pages)
Full-viewport ink (--ink) curtain at --z-transition. Exit: curtain translates up 100% -> 0 over --t-med (.6s) --e-inout on internal link click, then navigates. Entry: curtain reveals by translating 0 -> -100% over --t-med --e-inout, starting 80ms after load. First load: no curtain (the preloader or the page itself opens). Reduced motion: no curtain, instant navigation.

### Home ("The Sofreh")
Hero signature: **arch-framed dolly-zoom hero**. Full-bleed kabab-fire photograph (owned or licensed, see section 1) masked by the big Persian arch (--arch-radius). Pinned 160vh; the arch image scales 1.05 -> 1.32 scrub-tied (scrub: true). The three-line Fraunces headline rises through overflow masks on LOAD, not scroll: 820ms --t-reveal, --e-reveal, 90ms stagger; the emphasis word sets in Fraunces italic. A ghost outline "SAFFRON" layer runs opacity 0 -> .44 -> 0 across the pin (Laguna text-stroke curve). Headline text is real DOM text; split spans are a JS enhancement (see section 4, JS-applied hidden states). Address, hours line ("Call to confirm hours"), and phone are visible within the first viewport or the sticky nav, before any scroll choreography. Borrowed from Laguna's cover zoom (research/refs/laguna/home/screenshots/desktop_scroll_00_0.png and desktop_scroll_01_2721.png) and Khufu's masked line reveal (research/refs/khufus/home/screenshots/clean_desktop_1440_viewport.png).
Sections:
1. Poetic preloader, once per session and Home only: ink overlay, three lines about saffron and rice typed word by word (90ms stagger), khatam diamond pulsing, Skip pill (always first in focus order). Hard cap 2200ms total including the 450ms fade+rise exit (--e-reveal); auto-dismisses without interaction; never runs on data-saver connections, under reduced motion, or on any page except Home; sessionStorage key `snrIntroSeen`. Re-skin of Khufu's intro (research/refs/khufus/home/screenshots/state_desktop_intro_overlay.png).
2. Welcome statement: serif-scale display intro with an italicized emphasis word (Fraunces italic), chapter kicker "01 / The Kitchen" (Khufu's chapter system, research/refs/khufus/home/screenshots/desktop_scroll_02_1490.png).
3. Signature dishes trio: three arch-sm cards (koobideh, stews, rice) with sine-floating saffron-thread and crocus SVG cutouts drifting desynchronized behind (Laguna's cristal floats, research/refs/laguna/home/screenshots/desktop_scroll_04_10884.png). The stews card links honestly to Party Platters with copy "in our combos" (stews exist only inside combo platters in the owner menu).
4. Halal + service modes band: on-dark strip, mono labels; halal claims render as quoted supplier statements (see section 3a), the khatam seal ornament beside them is decorative and unlabeled.
5. Day-to-night scroll CTA: 220vh sticky section lerping cream #f6efe1 to ink #0e110f while copy narrates lunch counter to dinner spread. The text does NOT lerp: fg flips in one step from ink to paper at the 55 percent scroll point, and all copy inside the lerp band is set at --fs-h3 scale or larger (WCAG large text). At the flip the ground is approximately #76736e; computed ratios there are ink 3.7:1 and paper 4.1:1, both above the 3:1 large-text AA threshold, and each side only improves moving away from the flip. Body-size text never sits on the lerping ground. Ground lerp rules in section 5 perf contract. (Khufu's #khCtaReveal, research/refs/khufus/home/screenshots/desktop_scroll_09_6705.png through desktop_scroll_11_8195.png).
6. Testimonials: fanned polaroid-style cards with numbered index pills (Khufu's polaroid slider, research/refs/khufus/home/screenshots/state_desktop_polaroid_slide2.png). Quotes attribute their era honestly per data.js (Saffron Food Mart era). Prev/next controls are .tap-44 targets; the active card region carries aria-live="polite"; card transition .35s --e-ui.
7. Footer: cropped giant "SAFFRON & RICE" wordmark sliced by the viewport bottom over the night ground (Berenjak footer, research/refs/berenjak/home/screenshots/desktop_1440_full.png).

### Menu ("The Counter")
Hero signature: **set-the-table hero, 70vh maximum**. Night ground; a centered arch-dome panel holds a featured dish photo with the dish name in giant Fraunces beneath and category chips in mono. The distinct device: a scroll-scrubbed dotted-leader line "sets the table", drawing horizontally across the counter cover from 0 to 100 percent width over the hero's scroll depth, terminating in a red khatam tick at each category chip as it passes. No shamse spinner here; the rosette is 404-only as a motion device and appears elsewhere only as a static watermark. Borrowed from Khufu's menu spotlight (research/refs/khufus/menu/screenshots/clean_desktop_1440_viewport.png); the leader line is ours, an extension of the menu rows' dotted leaders.
The category index and first prices are visible in the first viewport on mobile (hero max 70vh guarantees it). A sticky bottom bar on mobile carries a tel: CTA "Call (310) 504-0310" reading number and href from data.js; it is a .tap-44 target.
Sections:
1. Category index as a numbered hairline table (01 Party Platters / 02 Rice / 03 Sandwiches), rows separated by 20 percent alpha gold hairlines (decorative only, never a boundary), anchor jumps; the Tastavents menu overlay flattened into the page (research/refs/tastavents/interactions/screenshots/desktop_1440_menu_open_settled.png).
2. Per-category bands alternating cream and night; item rows: name in display at --fs-h3s, desc in body, dotted leader, price in Chivo Mono at --fs-body minimum with a red diamond tick; prices are never letter-spaced into decoration. On night bands red price TEXT uses --accent-2-text (#e0736c, AA on ink); #c1403a stays fills/ticks only. The price renderer handles both owner formats ("69.99" and "199") verbatim and never invents ".00". Data renders verbatim from data.js, owner-authoritative. Item rows are authored in the HTML and render immediately: they are NEVER JS-gated, never opacity 0 in CSS, and data.js hydration only verifies and enhances (price ticks, category counts).
3. Sticky category rail on desktop with roll-up hover labels, .35s --e-ui two-layer swap (Dokmeh, research/refs/dokmeh/home/screenshots/desktop_1440_scroll_02.png); rail items are .tap-44.
4. Disclosure band: consumption and price disclaimers plus "call to confirm hours", set at --fs-body minimum (disclosures never render at --fs-mono size).

### Catering & Party Platters ("The Spread")
Hero signature: **spread-builder hero**. Cream ground framed by the constant viewport picture frame; headline "Feed Ten. Feed Thirty." with the counts in red. Launch version runs on ONE platter photo inside an arch-sm frame plus three typographic tier panels (10 / 20 / 30 guests, counts at display scale, red diamond seals); the three-photo stepping sequence is a post-photoshoot enhancement. Choreography (with photos, or applied to the typographic panels at launch): pinned 220vh; the three tier cards scale-step 0.9 -> 1.0 sequentially, each over one third of pin progress, --e-out catch-up; the counts flip via SplitText y-mask .6s --e-reveal. Reduced motion: static row at final sizes. Frame borrowed from Tastavents' passe-partout (research/refs/tastavents/home/screenshots/desktop_1440_viewport.png); stepping sticky choreography from Laguna's panel handoffs (research/refs/laguna/home/screenshots/desktop_scroll_05_13605.png).
Sections:
1. Platter tiers: three large cards mapped to the owner's Party Platter menu, price sealed in a red diamond stamp; hover lifts with gold hairline and --shadow-1.
2. How it works: 3-step numbered chapter rows (choose platter, call, pick up or delivery).
3. Stews and add-ons band on-dark with floating herb cutouts.
4. Occasions marquee: giant display marquee ("Nowruz. Mehmooni. Shab-e Yalda. Game Day.") re-skinning Tastavents' fs-866 marquee (research/refs/tastavents/home/screenshots/desktop_scroll_09_8991.png). 80s linear loop, pause-free, duplicated track via k-marquee; markup includes the line once in a .marquee-static fallback shown under reduced motion.
5. CTA: phone-first booking card, mono phone number at h3 scale.

### About ("The Story")
Hero signature: **light editorial timeline hero**. The one predominantly light hero: warm cream, small mono kicker, headline with an italic emphasis word (Fraunces italic). Timeline content is limited to VERIFIED moments only: the location's food coverage era (Discovering LA 2020, Eat the World LA 2021, under the prior Saffron Food Mart name) and the new chapter (Saffron & Rice LLC filed 2026-03-16). No other years are asserted anywhere; unverified lineage is omitted, never approximated. Launch hero runs on ONE grain-treated photo plus a typographic era rule (two labeled stops); the multi-image archival scrubber is a post-photoshoot enhancement.
Enhanced scrubber spec (when imagery exists): ScrollTrigger pinned section, 300vh; progress maps linearly to the eras; images crossfade .5s --e-ui with a 1.04 -> 1.0 settle scale; the era marker slides along the rule scrub-tied; snap to each era stop with .4s --e-out. Keyboard and AT model: the era stops are a role="tablist" of buttons with arrow-key support; pointer scrubbing is enhancement only; all era content sits in DOM order. Reduced motion: no pin, static era rows stacked. Light story structure from Berenjak (research/refs/berenjak/story/screenshots/desktop_1440_scroll_01.png).
Sections:
1. New-management statement: honest copy, "formerly Saffron Food Market"; grain-textured photo treated as a pasted snapshot (Berenjak heritage collage, research/refs/berenjak/home/screenshots/desktop_1440_scroll_02.png).
2. Counter stations grid: Kabab / Stews / Rice / Deli with saffron-thread rule headers (Berenjak location grid re-skinned, research/refs/berenjak/home/screenshots/desktop_1440_scroll_04.png).
3. Halal sourcing band on-dark: the two owner statements as quoted supplier statements (typographic quotes with attribution "per our suppliers"), decorative khatam ornament unlabeled; never dressed as certification marks (see section 3a).
4. One Farsi calligraphic moment: "نوش جان" (Noosh-e jan) drawn as original SVG script over a photo, Latin annotation beneath (Lo'bat bilingual lockup, research/refs/lobat/home/screenshots/desktop_1440_full.png).

### Contact ("The Visit")
Hero signature: **split arch-window hero**. Left half: night panel with stacked mono facts (address, phone at display scale, service-mode chips); right half: storefront photo inside a tall arch-dome window set within a thin rectangular hairline frame (so the arch reads as a true ivan portal) that parallax-drifts slower than scroll (yPercent: -12, scrub-tied). Structure from Khufu's contact/plan-your-visit editorial (research/refs/khufus/contact/screenshots/clean_desktop_1440_viewport.png) with Laguna's arch window (research/refs/laguna/home/screenshots/desktop_scroll_07_19047.png).
Sections:
1. Hours card: "Open daily, call (310) 504-0310 to confirm hours" honesty-first. The hours row carries a functional Farsi micro-label "ساعات کار" beside the Latin (same original-SVG technique or a vendored Farsi-capable webfont; the no-copied-assets rule applies). No blinking status dot: the site cannot know open/closed state, so the khatam diamond beside the hours line is a static ornament with no open/closed semantics.
2. Map/directions band: PCH cross-street description plus embedded-free static map image, gold route line drawn as original SVG.
3. Service modes: four pill rows with underline-retract hover (Khufu's CTA hover, research/refs/khufus/home/screenshots/state_desktop_whybtn_hover.png); pills are .tap-44.
4. Footer wordmark as on Home.

### 404 ("The Spilled Bowl")
Hero signature: **shamse medallion hero**, the ONLY page where the rosette spins. Full-viewport night ground; a giant original saffron-gold shamse rosette SVG rotates at 120s linear (imperceptible) with "404" cut out of its heart in Fraunces; scattered rice-grain and thread SVG cutouts sine-float around it; one line of copy and a gold pill home. Geometry from Dokmeh's sun-medallion blob (research/refs/dokmeh/home/screenshots/desktop_1440_scroll_00.png), floats from Laguna, reduced to a single-viewport page.

## 3. Ornament plan (all original SVG, drawn in-repo, never copied)

1. **Khatam diamond tick**: 7px rotated square, the default eyebrow/list marker (tokens .eyebrow::before). Gold default, red and crocus variants. The tick is decorative; the label text alone always carries the meaning (category color never encodes information by itself). Inspired by Berenjak's wordmark diamond; drawn as CSS/SVG primitive.
2. **Shamse rosette medallion**: original 12-point rosette built from two rotated squares plus petal arcs, single-stroke. Spinning use: 404 hero only. Elsewhere: static faint watermark behind section heads, aria-hidden="true". Never sampled from any reference asset.
3. **Persianate arch masks**: the border-radius arch family (--arch, --arch-sm, --arch-dome) on imagery and panels; the "pylon" mechanic from Khufu's and Laguna re-read through a Persianate arch silhouette. On the Contact hero window the arch sits inside a thin rectangular hairline frame so that one prominent use reads as a true ivan portal.
4. **Saffron-thread linework**: thin hand-drawn crimson thread strands as SVG dividers and floating cutouts. This is the sitewide divider system: wherever a section divider or rule-header appears, it is a saffron-thread strand, not a generic hairline (load-bearing signature, see section 1).
5. **Crocus petal cutouts**: 2-3 original flat petal SVGs in the purple family for float layers; grain overlay for the archival grade uses the tokens --grain-url tile at --grain-opacity on its own pseudo-element (see section 5 perf contract).
6. **Farsi accents**: one calligraphic moment per site (About, "نوش جان") plus one functional micro-label (Contact hours, "ساعات کار"); both original vectors or a vendored Farsi-capable webfont; never a rendered reference font.
Restraint rule: gold carries the site; red appears only on prices, seals, and one hero; purple only in ornament linework and float cutouts. Neither red nor purple is ever a background.

### 3a. Claims honesty
- Halal: the two owner-provided strings render verbatim as QUOTED supplier statements, visually plain quotes, never dressed as certification seals or stamps; the khatam ornament near them is decorative and unlabeled. data.js carries halalNote ("Ask us about our halal sourcing") for any surface needing a shorter line. Halal claims never enter JSON-LD.
- Testimonials: all current quotes predate the transition; every rendered card attributes the era ("Yelp reviewer, on the kitchen in its Saffron Food Mart era"). Old-era quotes are never attributed to "Saffron & Rice".
- Timeline: only verified facts (LLC filing 2026-03-16; blog coverage 2020/2021) are rendered; years come from data.js with provenance comments; anything unverified is omitted.

## 4. Accessibility, reduced motion, and baseline deliverables

- Contrast: body text is ink #0e110f on cream (AAA) or cream on ink (AAA). Gold as text always uses --accent-deep #6e5322 on light (verified against BOTH grounds --paper 5.6:1 and --paper-1 4.9:1) and --accent-lite #d4a95d on dark. Red text on light uses #741010; red text on dark uses #e0736c (--accent-2-text under .on-dark); #c1403a is fills/ticks only on dark. Purple text on light uses #57266d. Raw #b68b4a and #7b3397 are never used as small text on cream. --fg-faint is mixed to pass AA on both --bg and --bg-2 in each scope.
- prefers-reduced-motion, complete matrix (CSS guard in tokens.css plus explicit JS branches): no preloader typing (skip entirely, content immediate); no scroll scrubbing (day-to-night section renders as two static stacked bands); no sine floats; no dolly zoom (static arch image); no shamse rotation (static rosette, 404 included); no Contact arch-window parallax (static image); About era scrubber renders as stacked static rows (no pin); status/khatam dots solid (no k-blink); no ken burns (static crop); testimonial slider becomes buttons-only instant swaps; no page-transition curtain (instant navigation); marquee shows the .marquee-static single line while the duplicated animated track is display: none. Content order never depends on motion.
- No-JS and hidden states: this is a static zero-build site. Menu and catering item data is authored directly in the HTML; data.js is the single source used by build-time-free inline hydration that VERIFIES and enhances (price ticks, category counts). No stylesheet ever authors opacity: 0 or other hidden-until-reveal states; **hidden initial states are applied by JS only**, so with JS disabled every page is fully readable, and a noscript path needs to clear nothing.
- Keyboard and AT: global :focus-visible ring ships in tokens.css (2px --focus outline, 2px offset). The counter menu overlay and any dropdown trap focus and close on Escape. The About era scrubber is a role="tablist" of buttons with arrow keys (pointer scrubbing is enhancement). Hero headlines are real DOM text; SplitText spans are JS enhancement. Testimonial prev/next are .tap-44 with aria-live="polite" on the active card. Controls with the 44px floor (.tap-44): nav links, category chips, testimonial arrows, category rail items, Skip pill, sticky tel: bar.
- Type floors: nothing renders below 12px; disclaimers and disclosures render at --fs-body minimum, never at mono label size.
- Decorative elements: .ghost words, the shamse watermark, saffron-thread dividers, and all ornament SVGs are aria-hidden="true"; .ghost is additionally user-select: none.
- Every arch-masked image keeps meaningful alt text; the imagesDisclosure line from data.js renders wherever representative photography appears.
- No autoplaying sound; any looping video is muted, has a reduced-motion poster fallback, and is decorative-only.
- Baseline deliverables (hard gates, per the council baseline 05-accessibility-seo.md Part B): unique per-page titles and meta descriptions; JSON-LD Restaurant block (name, address, phone, servesCuisine; never halal claims, never unverified hours); sitemap.xml and robots.txt; skip-to-content link first in DOM; hero image preloaded with explicit width/height.
- House rule enforced sitewide: no em dashes in any copy, code comment, or label; hyphens for ranges only.

## 5. Motion engine contract

Engine: GSAP 3.13 + ScrollTrigger + SplitText + Lenis 1.3, all vendored (assets/js/vendor/MANIFEST.md).

- Lenis config: `new Lenis({ lerp: 0.1, wheelMultiplier: 1, smoothWheel: true, syncTouch: false })` (lerp 0.1 matches Khufu's measured exponential smoothing). Wire-up: `lenis.on('scroll', ScrollTrigger.update); gsap.ticker.add((t) => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0);`. Native scroll on touch. Lenis is NOT instantiated when `matchMedia('(prefers-reduced-motion: reduce)')` matches; nor is any scrub/pin timeline.
- Motion defaults (per-page sections override deltas only):
  | Moment | Spec |
  |---|---|
  | Scroll-reveal default | y 28px + opacity, .6s --e-out, 80ms stagger, IO threshold 0.2, once |
  | Hover default | .3s --e-ui (use --t-ui .4s for roll-ups/two-layer swaps) |
  | Slider/card transitions | .35s --e-ui |
  | Masked line reveal | 820ms --e-reveal, 90ms stagger |
  | Shamse spin | 404 only, 120s linear |
  | Marquee | 80s linear loop, duplicated track, .marquee-static fallback |
  | Sine float ladder | k-float amplitude 8px; per-element durations 6s / 7.3s / 8.1s desynced |
  | Parallax factor | yPercent: -12 scrub (Contact arch window) |
  | Page transition | ink curtain, .6s --e-inout each way, 80ms entry delay |
- Perf contract:
  1. The day-to-night lerp animates a CSS variable consumed by ONE section-level element, never body or html; background-color animates on that single element only (accept its repaint; forbid animating it on ancestors).
  2. All scrubbed and floating media move via transform and opacity only.
  3. will-change: transform is allowed ONLY on the hero dolly image and currently-active float cutouts, added and removed by JS around the effect, never in stylesheet-wide rules.
  4. Image budget: hero images <= 2560px wide, AVIF or WebP with JPEG fallback, loading="lazy" below the fold, explicit width and height attributes on every img. Grain PNG <= 64KB, tiled, on its own pseudo-element at opacity below .12 (--grain-opacity default .06).
