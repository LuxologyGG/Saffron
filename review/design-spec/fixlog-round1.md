# Fix log, round 1
Maps every round-1 council finding to the change made. Paths relative to repo root. Line numbers refer to post-fix files.

## round1-visual-brand.md, Lens 1 (Visual)

| Finding | Fix |
|---|---|
| V1 MAJOR display face | Vendored Fraunces variable (wght 100-900, opsz 9-144) normal + true italic from Google Fonts into assets/fonts/Fraunces-Variable.woff2 and Fraunces-Italic-Variable.woff2; deleted all three ClashDisplay-*.woff2. assets/css/fonts.css:1-20 new @font-face pair. assets/css/tokens.css:75 `--font-display: "Fraunces", Georgia, ...`. assets/js/vendor/MANIFEST.md fonts table updated. design-brief.md:18 type roles rewritten (Clash removed entirely, italic axis serves the emphasis-word moves); every "Clash Display" mention in page concepts replaced with Fraunces. |
| V2 MAJOR --red-lite on dark | tokens.css:48-49 `--red-lite` commented fills-only, new `--red-text-dark: #e0736c`; tokens.css .on-dark block (~line 177) `--accent-2-text: var(--red-text-dark)`. Mirrored in design-brief.md section 4 contrast bullet and Menu section 2. (Used the a11y review's #e0736c, which supersedes this finding's #e0685f suggestion; both AA.) |
| V3 MAJOR Menu/404 shared shamse hero | design-brief.md Menu hero: shamse spinner removed; replacement device is the review's suggestion, a scroll-scrubbed dotted-leader line that "sets the table" across the counter cover, terminating in khatam ticks at category chips. Shamse spins on 404 only (ornament plan item 2, motion defaults table). |
| V4 MINOR arch mobile floor | tokens.css:126 `--arch: clamp(72px, 15vw, 220px)`. |
| V5 MINOR dead tokens | tokens.css: deleted --steel/--steel-2/--steel-3, --tracking-wide, --e-osmo (also C-8/M-8); --tracking-mono kept with consumer comment; header states "every token has a stated consumer". |
| V6 MINOR shadow/grain tokens | tokens.css:118-121 `--shadow-1`, `--shadow-2`, `--grain-url`, `--grain-opacity`; referenced in design-brief.md ornament item 5, Catering section 1, and section 5 perf contract. |
| V7 MINOR h4/h3 gap | tokens.css:92 `--fs-h3s: clamp(1.375rem, 1.13rem + 0.96vw, 2rem)` (22-32px) + `.h3s` utility; design-brief.md Menu section 2 names item rows at --fs-h3s. |

## round1-visual-brand.md, Lens 2 (Brand)

| Finding | Fix |
|---|---|
| B1 MAJOR "The Carte" | Menu concept renamed "The Counter" in design-brief.md; every carte occurrence purged (hero paragraph, section 1 "menu overlay flattened", section 4 "counter menu overlay" in tokens.css:154 z-index comment and .on-dark comment). Numbered-index mechanic kept. |
| B2 MAJOR preloader/ceremony | design-brief.md Home section 1: hard cap 2200ms total including 450ms exit, auto-dismiss, Home only, never on data-saver or reduced motion, sessionStorage `snrIntroSeen`, Skip pill first in focus order. Home hero paragraph: address, hours line, phone visible in first viewport or sticky nav before any scroll choreography. |
| B3 MINOR timeline verification gate | Superseded by the stronger devil's-advocate fix: unverified years (2008/2015/2018) deleted from the brief; About hero uses only verified facts (blog era 2020/2021, LLC filed 2026-03-16), rendered from data.js `story` entries with provenance comments (assets/js/data.js story block). |
| B4 MINOR ivan naming | design-brief.md ornament item 3 renamed "Persianate arch masks"; Contact hero arch window set inside a thin rectangular hairline frame so one prominent use reads as a true ivan portal. |
| B5 MINOR Farsi functional companion | design-brief.md Contact section 1: hours row gets functional micro-label "ساعات کار" beside the Latin, original SVG or vendored Farsi-capable webfont, no-copied-assets rule restated; ornament plan item 6 updated (one calligraphic moment + one micro-label). |
| B6 MINOR occasions order | design-brief.md Catering section 4: "Nowruz. Mehmooni. Shab-e Yalda. Game Day." |

## round1-motion-code.md, Lens 3 (Motion)

| Finding | Fix |
|---|---|
| M-1 CRITICAL Lenis contract | design-brief.md new "## 5. Motion engine contract": exact Lenis config (lerp 0.1, wheelMultiplier 1, smoothWheel true, syncTouch false), ScrollTrigger wire-up lines verbatim, lagSmoothing(0), native scroll on touch, no instantiation under reduced motion. |
| M-2 CRITICAL page transition | design-brief.md section 2 "Page transition (all pages)": ink curtain at --z-transition, up 100%->0 exit .6s --e-inout, entry 0->-100% .6s --e-inout 80ms after load, no curtain on first load, reduced motion instant. Also in motion defaults table. |
| M-3 MAJOR About scrubber numbers | design-brief.md About hero: pinned 300vh, linear era mapping, .5s --e-ui crossfade with 1.04->1.0 settle, scrub-tied marker, snap per era .4s --e-out, reduced-motion stacked rows. (Eras are now the verified two, not four; snap spec adapted accordingly.) |
| M-4 MAJOR Home/Catering scrub numbers | Home hero: pinned 160vh, scale 1.05->1.32 scrub-tied, headline masks rise on load 820ms --e-reveal 90ms stagger, ghost SAFFRON opacity 0->.44->0. Catering hero: pinned 220vh, tier cards scale-step 0.9->1.0 each over 1/3 progress --e-out, counts flip SplitText y-mask .6s --e-reveal, reduced-motion static row. |
| M-5 MAJOR reduced-motion matrix | design-brief.md section 4 bullet 2: complete matrix now includes shamse rotation, Contact parallax, About scrubber, k-blink dot, ken burns, testimonial slider (buttons-only instant swaps), page transition, marquee static-line fallback. |
| M-6 MAJOR missing triples | design-brief.md section 5 "Motion defaults" table: scroll-reveal default (y 28px + opacity, .6s --e-out, 80ms stagger, IO 0.2 once), hover .3s --e-ui, slider .35s --e-ui, shamse 120s (404 only; Menu spinner no longer exists), marquee 80s linear duplicated track, float ladder 6s/7.3s/8.1s at 8px, parallax yPercent -12, rail roll-up .35s --e-ui in Menu section 3. |
| M-7 MINOR preloader timing | Home section 1: total hard cap 2200ms (tighter than Khufu's, reconciled with Brand B2), exit fade+rise 450ms --e-reveal, sessionStorage key `snrIntroSeen`, Skip pill focusable first. |
| M-8 MINOR easing loose ends | tokens.css: --e-osmo deleted; `--t-ui: .4s` added with Tastavents comment and referenced for roll-ups in the brief. |

## round1-motion-code.md, Lens 4 (Code & Performance)

| Finding | Fix |
|---|---|
| C-1 MAJOR px-only clamps | tokens.css fluid type scale (lines 82-95): every --fs-* rewritten as rem + vw hybrid with interpolating `Arem + Bvw` preferred terms; px design targets kept as comments; --fs-body uses the review's exact clamp; --fs-body preferred term now actually interpolates. |
| C-2 MAJOR borderline contrast | tokens.css: --accent-deep #6e5322 (comment states both-creams ratios); --fg-faint mixes raised to 64% (light) and 56% (dark). design-brief.md section 4 updated to #6e5322 "verified against BOTH grounds". |
| C-3 MAJOR perf contract | design-brief.md section 5 perf contract: single-element bg lerp (never body/html), transform/opacity only, JS-scoped will-change on hero dolly + active floats only, image budget (<=2560px, AVIF/WebP+JPEG, lazy below fold, width/height attrs), grain <=64KB tiled pseudo-element opacity <.12. |
| C-4 MINOR overflow | tokens.css reset: `html { overflow-x: clip }` and `body { overflow-x: clip }` with Lenis comment. |
| C-5 MINOR marquee freeze | tokens.css reduced-motion guard: `[class*="marquee"] { animation:none; transform:none }` + comment requiring .marquee-static single-line fallback; design-brief.md Catering section 4 and reduced-motion matrix state the markup rule. |
| C-6 MINOR browser floor | tokens.css semantic block comment: "Browser floor: 2023 evergreen (color-mix, overflow: clip). No fallbacks by design." |
| C-7 MINOR no-JS promise | design-brief.md section 4 "No-JS and hidden states" bullet: content authored in HTML, data.js verifies/enhances, and the load-bearing rule: no stylesheet-authored opacity:0, hidden initial states applied by JS only. "Server-rendered fallbacks" wording removed. |
| C-8 MINOR undocumented tokens | tokens.css: --accent-1 and --black deleted; --paper-2/--paper-3/--white given role comments; --e-osmo/steel deleted (see V5). |

## round1-a11y-devil.md, Lens 5 (Accessibility)

| Finding | Fix |
|---|---|
| A1 MAJOR red text on ink | Same as V2: --red-text-dark #e0736c wired to .on-dark --accent-2-text; brief rules red on night bands. |
| A2 MAJOR fg-faint on --bg-2 | tokens.css --fg-faint 64% mix light (comment: AA on both grounds); dark left at review-passing 56% (bumped from 52 per parent instruction). |
| A3 MAJOR no :focus-visible | tokens.css after reset: the exact `:where(...):focus-visible` ring block + `:focus:not(:focus-visible)` reset from the review. |
| A4 MAJOR type floors | tokens.css --fs-eyebrow and --fs-mono floors at 12px (0.75rem); design-brief.md section 4: nothing below 12px, disclosures at --fs-body minimum (Menu section 4 restates). |
| A5 MAJOR keyboard/AT for heroes | design-brief.md: About scrubber as role="tablist" buttons with arrow keys, content in DOM order (About hero + section 4); Home headline real DOM text with SplitText as enhancement (Home hero + section 4); testimonial prev/next .tap-44 + aria-live="polite" (Home section 6). |
| A6 MAJOR day-to-night contrast hole | design-brief.md Home section 5: stepped fg flip at 55%, copy at large-text scale only inside the band, computed flip ratios stated (ink 3.7:1, paper 4.1:1, both above 3:1 large-text AA). Note: the review's assumption that both sides clear 4.5:1 at a single flip point is mathematically impossible for this cream/ink pair, so the spec constrains the band to large text where 3:1 is the AA threshold; this satisfies the finding's intent with honest numbers. |
| A7 MINOR eyebrow tick contrast | tokens.css .eyebrow::before now uses --accent-text (5.4:1 light / 8.7:1 dark), --red variant uses --accent-2-text; comment + brief ornament item 1 declare the tick decorative with text carrying meaning. |
| A8 MINOR reduced-motion gaps | tokens.css guard: `animation-delay: 0ms !important` added; marquee rule added (see C-5). |
| A9 MINOR tap target token | tokens.css `--tap: 44px` + `.tap-44` utility; brief section 4 lists the controls that get it (nav links, chips, testimonial arrows, rail items, Skip pill, sticky tel bar). |
| A10 MINOR aria-hidden rule | tokens.css .ghost comment; design-brief.md section 4 decorative-elements bullet (ghost, shamse watermark, thread dividers, ornament SVGs all aria-hidden). |

## round1-a11y-devil.md, Lens 6 (Devil's Advocate)

| Finding | Fix |
|---|---|
| D1 CRITICAL photo provenance | research/business/assets/manifest.md: license-status column added (all rows "Unlicensed, reference only, DO NOT SHIP") + license plan paragraph (owned-photography swap path, licensed-stock interim with disclosure, Home hero owned/licensed only, per-asset manifest row requirement). design-brief.md section 1 "Imagery honesty and licensing" block; data.js photography comment rewritten. |
| D2 MAJOR old-era testimonials | assets/js/data.js testimonials: who = "Yelp reviewer, on the kitchen in its Saffron Food Mart era" on all three + provenance comment; brief Home section 6 and section 3a require era attribution. |
| D3 MAJOR unverifiable timeline | Unverified years removed from brief; data.js `story` array carries only verified milestones with provenance strings (blog coverage 2020/2021, LLC filed 2026-03-16); About hero re-specced to one photo + typographic era rule, archival scrubber demoted to post-photoshoot enhancement. |
| D4 MAJOR menu buries content | design-brief.md Menu: hero capped 70vh with category index + first prices in first mobile viewport; sticky bottom tel: CTA from data.js (.tap-44); item rows never JS-gated, render immediately; prices at --fs-body minimum, never letter-spaced; rosette removed from Menu entirely (also V3). |
| D5 MAJOR asset-blocked heroes | design-brief.md section 1 final bullet + Catering and About heroes: both re-specced to ONE photo plus typographic/SVG structure at launch, multi-photo sequences listed as post-photoshoot enhancements; six distinct heroes kept as compositional layouts. |
| D6 MAJOR halal as certification | design-brief.md section 3a: claims render as quoted supplier statements, seal ornament decorative and unlabeled, never in JSON-LD; About section 3 and Home section 4 updated; data.js halalNote added. |
| D7 MINOR Khufu-clone thinness | design-brief.md section 1: saffron-thread linework promoted to load-bearing sitewide divider system (ornament item 4, About section 2 rule headers); preloader tightened to <=2.2s session-gated with Skip first (see B2/M-7). |
| D8 MINOR data inconsistencies | Home section 3: stews card links to Party Platters with "in our combos" copy; Menu section 2: price renderer handles "69.99" and "199" verbatim, no invented ".00"; Contact section 1: blinking dot removed, static khatam ornament with no open/closed semantics (k-blink keyframe retained in tokens for other uses but the dot is static by spec). |
| D9 MINOR baseline deliverables | design-brief.md section 4 final bullet: per-page titles/descriptions, JSON-LD Restaurant (no halal, no unverified hours), sitemap/robots, skip link, hero preload, explicit reference to council baseline 05-accessibility-seo.md Part B. |

## Validation
- `node --check assets/js/data.js`: pass.
- tokens.css: brace-balance check pass; no color-mix/clamp syntax changes beyond reviewed forms.
- Grep: zero occurrences of "carte", "steel", "e-osmo", "tracking-wide", em dashes, or Clash Display (outside the removal note) across produced files.

## Deviations (justified)
1. A6: specified a large-text 3:1 stepped flip instead of the review's dual 4.5:1, because no flip point on the cream-to-ink lerp satisfies 4.5:1 on both sides (computed); the spec instead bans body-size text from the lerp band, which is strictly safer.
2. V2 vs A1 hex conflict: adopted A1's #e0736c (5.6:1) over V2's #e0685f (4.9:1) since one value must win; both reviews' intent (AA red text on ink) is met with margin.
3. B3 vs D3 conflict: D3's stronger remedy (delete unverified years) was applied, per the parent instruction; B3's data.js gating survives via the provenance-commented `story` array.
