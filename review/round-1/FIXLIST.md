# Round 1 — Ordered Fix List

Chair-compiled from all six round-1 lens reviews (motion, codeperf, brand, a11y, visual,
benchmark). 32 findings total, 0 critical / 15 major / 17 minor. No literal cross-lens
duplicates were found this round (see REVIEW-LOG.md §Dedup notes).

Order: criticals (none) → majors grouped by owning file/area (one fixer can take one
cluster) → cheap minors. Within each cluster, highest-impact first.

---

## MAJORS

### Cluster A — Core shell: `assets/js/app.js` + `assets/css/app.css`
Three unrelated majors all live in the site-wide chrome file pair. One fixer can own
both files for this pass.

**1. MO1 — Arch-curtain transition travels 2x its intended distance**
- File(s): `assets/css/app.css:635` (`.curtain { transform: translateY(115%); }`), `assets/js/app.js:350,365` (`buildCurtain()`, `g.set(curtain, { yPercent: 115 })`)
- Exact change: Delete `transform: translateY(115%);` from the `.curtain` rule in `app.css` (keep `display:none` there) OR delete the two `g.set(curtain, { yPercent: 115 })` calls at `app.js:350` and `app.js:365`. Do only one — the JS `g.fromTo(curtain, { yPercent: 115 }, ...)` at line 357 already establishes the correct starting point for the tween itself. Pick removing the CSS line (simplest, leaves JS as sole source of truth for the parked position).
- Verify: `gsap.getProperty(document.querySelector('.curtain'), 'yPercent')` immediately after `buildCurtain()` runs should read `115`, not `230`. Click an internal nav link (e.g. index → menu) and confirm `getComputedStyle(curtain).transform` translateY resolves to ~115% of viewport height at the parked frame, then screenshot the transition at 90ms steps — the destination page should not go from "fully covered" to "fully revealed" in under 200ms; it should track the coded `.72s` cover / `.9s` reveal durations.

**2. AX1 — Mobile menu overlay does not trap focus; header renders on top of it**
- File(s): `assets/js/app.js` `setMenu()`/`initMenu()` (~L261-297), `assets/css/app.css` `.menu` z-index (~L167) vs `.nav` z-index (~L73)
- Exact change: In `setMenu(open)`, add `inert` to `<header class="nav">` (or at minimum to `.nav__brand` and any nav links/call button outside the toggle) whenever the menu opens, and remove it on close — mirroring the existing `inert` handling already applied to `#main`/`[data-site-footer]`. Also raise `.menu`'s z-index above `.nav`'s (e.g. swap `calc(var(--z-nav) - 1)` for `calc(var(--z-nav) + 1)`, or reorder so `.menu` is not stacked below `.nav`).
- Verify: At 390×844, open the mobile menu, Tab through every stop. Confirm focus never lands on `.nav__brand`/nav links while `menu-open`, and cycles only through skip-link (already outside) → menu items → back to first. Screenshot the open overlay and confirm the header logo no longer renders visibly above the paper panel.

**3. BR-3 — Footer logo `width`/`height` attributes declare the wrong aspect ratio**
- File(s): `assets/js/app.js:169` (`footer__seal` markup, `<img src="assets/img/brand/logo-lockup.png" width="692" height="484">`)
- Exact change: Change `width="692" height="484"` to `width="800" height="910"` (the real intrinsic size of `assets/img/brand/logo-lockup.png`), or drop the attributes and add `aspect-ratio: 800/910` to the CSS rule that sizes `.footer__seal img`.
- Verify: Load any page, before the image finishes decoding read `getBoundingClientRect()` on `.footer__seal img` and confirm the reserved box ratio is already ~0.879 (not 1.430) at first paint — no jump once `naturalWidth/Height` populate.

### Cluster B — Menu content & rendering: `assets/js/data.js` + `assets/js/page-menu.js` (+ `assets/css/page-menu.css`)

**4. BR-1 — Menu chapter "translit" span shows an unrelated caption, not the Persian transliteration (3 of 6 chapters)**
- File(s): `assets/js/data.js` (section objects `kababs` L102-104, `stews` L123-125, `sandwiches` L151-153), `assets/js/page-menu.js:78-81` (`headHtml()`, renders `sec.note` into `.translit`)
- Exact change: Add a `translit` field to each of the 6 menu section objects in `data.js` (e.g. `kababs: "Kabab"`, `stews: "Khoresh"`, `sandwiches: "Sandwich"`, `appetizers: "Pish ghaza"`, `rice: "Berenj"`, `platters: "Mehmani"` — confirm exact Latinization against `about.html`'s existing correct pairs: زعفران→"Za'faran", آتش→"Atash", خانواده→"Khanevadeh"). In `page-menu.js` `headHtml()`, change `(sec.note ? '<span class="translit">' + esc(sec.note) + "</span>" : "")` to render `sec.translit` instead of `sec.note`. Move the existing `note` copy (serving note, veg-pricing note, bread note) into the chapter's `chapter__foot`/body copy slot where it belongs, not the transliteration slot — do not delete it, relocate it.
- Verify: DOM-query every `.script-line` pair on `menu.html` and confirm all 6 chapters render a real Latin transliteration of the adjacent Persian word (not English prose), matching the site's own correct pattern on `about.html`.

**5. AX3 — Menu hero pinned carta panel: hours readout fails AA contrast (3.12:1)**
- File(s): `assets/css/page-menu.css` `.mhero.is-pinned .mhero__carta` (~L97-104), `.mhero__hours`/`.mhero__meta-item` (~L113-116); `assets/css/tokens.css` `.on-teal` `--fg-faint` (~L161)
- Exact change: `.mhero__carta` sits on `.on-teal`'s `--bg-2` (`--teal` rgb(50,65,66)), but `--fg-faint` in `.on-teal` is mixed against `--teal-deep` (darker), not `--teal`. Simplest fix: in `page-menu.css`, change `.mhero__hours`/`.mhero__meta-item` from `color: var(--fg-faint)` to `color: var(--fg-soft)` (already measured 5.48:1 against `--teal`, passes). Do not touch the shared `--fg-faint` token globally unless you also re-verify every other `--bg`-scoped (not `--bg-2`-scoped) use of `--fg-faint` still passes.
- Verify: Scroll `menu.html` desktop (≥901px) into the pinned hero state, `getComputedStyle` the "DAILY 11 AM TO 8 PM" hours text and its background, compute contrast — must be ≥4.5:1.

### Cluster C — Data integrity: `assets/js/data.js`

**6. BR-2 — Unsourced sourcing claim invented for Lamb Shank**
- File(s): `assets/js/data.js:134` (`lamb-shank` item, `desc: "New Zealand, grass-fed, halal."`)
- Exact change: Remove "New Zealand, grass-fed, halal." — replace with verbatim printed-menu text or a plain description with no invented origin/feed claim (e.g. follow the `dizzy` item's pattern one line below: `"Lamb shank, potato, beans."` style, adjusted to what's actually on the printed menu for this dish). If the owner later confirms sourcing, log it as a confirmed fact in `DELIVERY-NOTES.md`.
- Verify: `grep -n "New Zealand" assets/js/data.js` returns nothing; the item's description is either verbatim menu text or absent, with no falsifiable origin/feed claim.

### Cluster D — No-JS / crawler fallback: `index.html`, `menu.html`, `assets/js/app.js`, `assets/js/page-menu.js`

**7. CP-1 — No-JS render is structurally incomplete (menu loses all 50 dishes, footer/NAP/hrefs empty)**
- File(s): `menu.html` (`[data-menu-root]`), `index.html` (`[data-bind]`/`[data-bind-href]` spans), `assets/js/app.js` `renderFooter()`, `assets/js/page-menu.js` `renderMenu()`
- Exact change: Prerender the factual strings that are currently bind-only into the static HTML — address, hours, phone, tagline, disclaimer text, and real `href` values on every `data-bind-href` anchor (nav "Call us", "Order online", "Directions") — so `bindData()` overwrites already-correct static content rather than filling empty placeholders. For `menu.html`, at minimum add a `<noscript>` block with the phone number, Grubhub link, and a one-line "call for the full menu" note; ideally prerender the `.mlist` markup statically from `data.js` values since `data.js` is the single source of truth anyway.
- Verify: Load each page with `java_script_enabled=False` (or JS disabled in a real browser). Footer must show real page links/phone/social, not an empty band. `index.html`'s Visit section must show the real address and hours, not `","` and blanks. Every nav/hero CTA anchor must have a working `href` (not just `data-bind-href`). `menu.html` must show at least contact info and a path to the full menu, not zero dish content.

### Cluster E — `404.html`

**8. CP-2 — 404.html's relative asset URLs break on nested missing paths**
- File(s): `404.html` (lines ~11-22 link/script tags, ~102-110 img tags — all relative `assets/css/...` etc.)
- Exact change: Switch every asset URL and internal link in `404.html` (only this file) to root-relative (`/assets/css/...`, `/assets/js/...`, `/index.html`), matching the domain-root deploy already committed to by `sitemap.xml`/canonical tags.
- Verify: Simulate a nested miss (`/old/menu/does-not-exist`) against the deployed site (or locally by serving from a subpath) and confirm `404.html`'s CSS/JS/images all resolve and the page renders fully styled, not bare HTML.

### Cluster F — Design tokens: `assets/css/tokens.css`

**9. AX2 — Catering price stat fails AA contrast on `.on-teal` (4.04:1)**
- File(s): `assets/css/tokens.css` `.on-teal` block (~L166, `--price: var(--pomegranate-lite)`), `assets/css/app.css` `.stat__price` (~L502-505)
- Exact change: Give `.stat__price` inside `.on-teal` its own override that doesn't share the `--pomegranate-lite` token with the passing `.on-dark` use (e.g. add `.on-teal .stat__price { color: var(--fg-soft); }` or a new lighter pomegranate variant scoped to `.on-teal` only, retested to clear 4.5:1 against `--teal-deep` #222d2e).
- Verify: `getComputedStyle` the "$199/$319/$449" price line under `index.html`'s catering guest-count stats, compute contrast against its actual background — must be ≥4.5:1.

### Cluster G — Sitewide chapter spacing: `assets/css/app.css`

**10. VS1 — Consecutive same-background chapters stack into 273-346px dead, unornamented gaps**
- File(s): `assets/css/app.css` `.chapter` rule (`padding-block: var(--sect)`), affecting `index.html #reviews→#visit`, `catering.html #platters→#combos`/`#combos→#how`/`#faq→#order`, `about.html` every chapter join, `contact.html #essentials→#map`
- Exact change: Add a modifier (e.g. `.chapter--tight` or a `[data-chapter-follows-same-bg]` pattern) that reduces `padding-top` on a chapter immediately following another chapter with the same background to `--sect-sm` or less, applied at each of the listed joins; or insert the ambient detailing the brief calls for (thread-line ornament, mono readout, tick) into the gap. `menu.html` already avoids this by interleaving photo bands — prefer that pattern where a suitable band image exists.
- Verify: Re-measure the same joins with `getBoundingClientRect()` (footnote-bottom to next-numeral-top) at 1440px — should drop well under the current 273-346px range, or the gap should contain a visible ornament element.

### Cluster H — Index hero + kabab chapter: `index.html`, `assets/css/home.css`

**11. BM01 — Homepage hero image capped at 470px inset thumbnail, contradicting brief's "full-bleed" spec**
- File(s): `assets/css/home.css:41-45` (`.hero__arch { width: min(100%, 470px); ... }`)
- Exact change: Scale `.hero__arch` to a true environmental panel (≥55-65vw desktop, or full viewport height), driven by the scroll-scrub growth already described in the motion plan. This is a design/CSS-layout change, not a one-line fix — expect to touch the hero's grid/positioning rules around it too.
- Verify: At 1440px, `.hero__arch`'s rendered width should be well over 700px (not 470px); screenshot the hero and confirm the kabab photograph reads as the establishing shot, not a supporting thumbnail next to a text block.

**12. BM02 — Kabab chapter (chapter 02) ships as a bare price table with zero photography**
- File(s): `index.html` chapter 02 section, `assets/css/home.css`
- Exact change: Reuse `assets/img/menu-kabab.jpg` grill photography in an arch or full-bleed treatment inside chapter 02, matching the arch/photo pattern already used in chapters 01 and 03.
- Verify: Full-page screenshot of `index.html` at 1440px — chapter 02 should contain a photo element, not just a 3-column price table on a black field.

### Cluster I — Home hero photo curation: `assets/img/home-menu-teaser.jpg` (asset, not code)

**13. VS2 — Full-bleed "One cloth, many hands" band shows a blue plastic order-tag prop**
- File(s): `assets/img/home-menu-teaser.jpg` (source asset), `assets/js/data.js` (if swapping to an alternate frame)
- Exact change: Recrop tighter to exclude the tag and visible forks/butter packet at image edges, or swap to an alternate frame from the same shoot if one exists without the tag; clone-retouch as a last resort.
- Verify: Open the live-rendered `#sofreh` band on `index.html` at 1440px and confirm no saturated-blue prop is visible in the frame.

### Cluster J — About day/night hero: `about.html`

**14. BM03 — `.ab-dusk` hero runs ~3,000px of scroll with zero photography**
- File(s): `about.html:112-155` (`.ab-dusk` chapter)
- Exact change: Add at least one photograph (interior/evening shot) that cross-fades or darkens in sync with the existing ground-color transition (`render(t)` in `page-about.js` already interpolates color stops — hook an `opacity`/`filter` step for an image into the same scrub).
- Verify: Scroll through the pinned day-to-night stage on `about.html` and confirm at least one photographic element is visible and transitions in step with the color change, not just typography.

### Cluster K — Catering photography: `catering.html`

**15. BM04 — ~6,000px of catering.html's 9,313px total height carries zero imagery**
- File(s): `catering.html` sections 02, 03, 05, and the halal section 04
- Exact change: Break up sections 02/03/05 with at least one supporting image each (platter close-ups, prep shots), reusing the existing catering photography set already shot for this page.
- Verify: Full-page screenshot of `catering.html` — no single stretch longer than ~2,000-2,500px should be pure text/pricing with no image.

---

## MINORS (cheap, roughly ordered easiest/most-isolated first)

**16. AX4 — Two decorative Persian-script ghost words missing `lang="fa" dir="rtl"`**
- File(s): `catering.html:246` (`.ch-halal__ghost.script-fa`), `index.html:202` (`.ch-fire__ghost.script-fa`)
- Exact change: Add `lang="fa" dir="rtl"` to both elements, matching all 12 other `.script-fa` instances site-wide.
- Verify: `grep -c 'script-fa'` occurrences with `lang="fa" dir="rtl"` across all HTML/JS templates should equal the total `.script-fa` count (14/14, not 12/14).

**17. VS3 — Catering "Three steps" numeral "1" reads as capital "I"**
- File(s): `catering.html:219` (`<span class="step__num">1</span>` and siblings)
- Exact change: Format as `01`/`02`/`03` to match every other chapter numeral on the site, or set `.step__num` in `--font-mono` instead of the display serif.
- Verify: Screenshot the "Three steps" mini-chapter and visually confirm the sequence reads unambiguously as 01/02/03.

**18. AX5 — Footer nav links "Menu"/"About" under 44px tap-target width at 390px**
- File(s): `assets/js/app.js` `renderFooter()` `pageLinks` (~L162-164)
- Exact change: Add horizontal padding or `min-width` to the footer nav-link `<li><a>` elements so hit area reaches ≥44×44px, matching other footer links that already pass.
- Verify: `getBoundingClientRect()` on the "Menu" and "About" footer links at 390px width — both dimensions ≥44px.

**19. MO2 — `srSoft` house easing curve registered but never used**
- File(s): `assets/js/app.js:792` (`CustomEase.create("srSoft", ...)`)
- Exact change: Apply `srSoft` to an effect currently using an unnamed/raw curve (e.g. the About day-to-night `render()` interpolation), or remove the unused `CustomEase.create` registration if the effect was intentionally cut.
- Verify: `grep -n "srSoft" assets/js/*.js` shows at least one use as an `ease:` value, or the registration is removed entirely (no dead declaration either way).

**20. CP-5 — 11 dead CSS utility classes + leftover `.split-mask`**
- File(s): `assets/css/tokens.css` (lines ~212, 239, 249-258: `.display`, `.h3`, `.grid`, `.cols-2/3/4`, `.flex`, `.between`, `.items-end`, `.keep-2`), `assets/css/app.css:671` (`.split-mask`)
- Exact change: Delete the unused utility classes and `.split-mask`. Leave `app.css:281` `.button-070.is-ink` alone (documented reserved variant).
- Verify: `grep` each removed class name across all `.html`/`.js` — zero remaining references before deletion (already confirmed by codeperf); CSS file size drops, no visual regression on any page.

**21. CP-6 — Loader wordmark fetch race can swap in a fully-inked SVG mid-timeline**
- File(s): `assets/js/app.js` `runLoader()` (~L466-477), `buildLoader()` fetch `.then` (~L437-451)
- Exact change: Expose a `started` flag on the loader element when the 180ms `setTimeout(go, 180)` fallback fires; in the fetch `.then`, check the flag and skip injecting/swapping the SVG if the timeline already started.
- Verify: Throttle network to simulate a slow SVG fetch (>180ms) and confirm the loader either shows the fallback word start-to-finish or the SVG only appears pre-timeline-start — no visible mid-animation pop-in.

**22. CP-7 — 2.2MB of unreferenced logo files at repo root + partially-tracked `research/`**
- File(s): `Saffronlogobg.png`, `saffronlogonobg.png`, `saffron_rice_text_only_high_quality.svg` (repo root); `research/` (92MB)
- Exact change: Delete or move the three root files into `research/`; exclude `research/` from the deploy (`.vercelignore` or equivalent branch/publish-dir exclusion).
- Verify: `grep -rl "Saffronlogobg\|saffronlogonobg\|saffron_rice_text_only" --include=*.html --include=*.css --include=*.js .` returns nothing (already true); confirm the deploy config excludes `research/`.

**23. BR-4 — Ornament SVGs and crocus tokens defined but never used**
- File(s): `assets/img/ornament/crocus-line.svg`, `assets/img/ornament/thread-flourish.svg`, `assets/css/tokens.css` (`--crocus`/`--crocus-lite`)
- Exact change: Wire at least one SVG into a live scene (e.g. `about.html` day-to-night chapter, or a halal-panel divider) with `stroke: var(--crocus)`/`var(--crocus-lite)`, or remove the unused assets/tokens if the ornament system was intentionally cut.
- Verify: `grep` the two filenames across HTML/CSS — at least one live reference; render the page and confirm the ornament is visible at the intended low-key scale.

**24. BR-5 — Three more menu chapters (appetizers/rice/platters) show no Latin annotation at all**
- File(s): same as #4 (`assets/js/data.js` sections `appetizers`/`rice`/`platters`, `assets/js/page-menu.js:78-81`)
- Exact change: Fix in the same commit as #4 (BR-1) — add `translit` values for these three sections too so all 6 chapters carry consistent annotations.
- Verify: Same DOM query as #4 — all 6 `.script-line` pairs render a non-empty, correct `.translit` span.

**25. VS4 — Index reviews grid: uneven whitespace under a short 2-line quote**
- File(s): `index.html` `#reviews` grid, third card (Frida / Yelp 2024)
- Exact change: Either match quote lengths more closely, switch to the 2×2/independent-row pattern already used on `about.html`, or vertically center the quote block within the card instead of top-aligning it.
- Verify: Screenshot the reviews grid at 1440px — no card should show >~20px of obviously unclaimed whitespace between quote end and attribution relative to its neighbors.

**26. CP-4 — Loader wordmark SVG (163KB) and brand PNGs heavier than needed**
- File(s): `assets/img/brand/logo-text.svg`, `logo-lockup.png` (102KB), `emblem.png` (78KB)
- Exact change: Run `logo-text.svg` through svgo at 1-decimal path precision (target <40KB); re-export `logo-lockup.png`/`emblem.png` at display resolution or as WebP (~30-40KB each).
- Verify: File sizes on disk drop as targeted; visually diff the loader/footer/nav brand marks before and after — no visible quality loss at rendered size.

**27. CP-3 — Six photos/maps re-encode 1.5-2x heavier than needed**
- File(s): `assets/img/catering-platters.jpg` (684KB), `catering-hero.jpg` (551KB), `home-hero.jpg` (485KB), `home-menu-teaser.jpg` (468KB), `map-area.png` (570KB), `map-local.png` (450KB)
- Exact change: Re-encode the JPEGs with mozjpeg q72-78 (or add WebP via `<picture>`); convert the two map PNGs to JPEG/WebP. Target ≤280KB for 1800px heroes, ≤200KB for maps.
- Verify: Full-scroll transfer size on `menu.html` drops from ~3.75MB meaningfully (target ~2.25MB); visual quality check at 100% zoom shows no visible banding/artifacting.

**28. BM05 — Menu hero filmstrip has inconsistent exposure/color grading across 5 photos**
- File(s): menu hero filmstrip source images (`.mhero__strip`, `menu.html:146-181`)
- Exact change: Apply a shared color grade/exposure curve across the 5 strip images (lift the grill shot's shadows, match white balance).
- Verify: View the filmstrip at desktop width — the 5 frames should read as one graded sequence, not a snapshot grab-bag.

**29. BM08 — 404 hero numeral/kicker sit at opacity:0 for 3-5s before reveal resolves**
- File(s): `404.html:78-79` (`.nf-hero__num`, `.nf-hero__kicker`), associated `page-404.js` timeline
- Exact change: Decouple the "404"/"Page not found" text reveal timing from the longer scatter-canvas animation so the core message resolves within ~1.5s regardless of the ambient thread animation's pace.
- Verify: Load `404.html` fresh, poll `getComputedStyle` opacity on the numeral/kicker every 200ms — should reach 1 by ~1.5s, not 3-5s.

**30. BM09 — Mobile hero has no mission-statement copy, just a static logo on black**
- File(s): `index.html` mobile hero, `assets/css/home.css`
- Exact change: Add a one-line mission statement to the mobile hero using the site's established first-person-plural voice, or surface it in the loader before curtain-lift.
- Verify: Screenshot the mobile (390px) hero — a copy line beyond the logo lockup should be visible.

**31. BM06 — Arch motif is always a one-off frame, never a repeating structural grid**
- File(s): design-level, `index.html`/`catering.html` + `assets/css/home.css`/`app.css`
- Exact change: Repeat the arch shape as an actual grid unit in one section (e.g. index chapter 03 or catering's platter grid), and treat one Farsi/Arabic word at large decorative scale in at least one hero.
- Verify: Screenshot the chosen section — arch shape should appear ≥3-4x as a repeating grid unit, not a single frame.

**32. BM07 — No human/family storytelling moment at hero/pull-quote scale**
- File(s): `index.html` full-bleed "FROM OUR KITCHEN" band, new photography if needed
- Exact change: Add one first-person family-voice pull-quote moment tied to real interior/kitchen photography, sized as a genuine editorial beat, not a 3-word caption.
- Verify: Screenshot the section — a substantive first-person quote block should be present, not just a caption.

---

## Notes for whoever picks this up

- Clusters A, B, C, D, E, F, G are pure code/CSS fixes — no new photography needed, cheapest to close per finding.
- Clusters H, I, J, K (BM01-04, VS2) plus minors #28-32 require either new photo treatment, re-crops, or copywriting — batch these as one design pass since they share the same "needs art direction" root cause flagged independently by both the visual and benchmark lenses.
- Items #4 and #24 (BR-1, BR-5) are the same fix in the same file — do them together.
