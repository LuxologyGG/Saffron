# Saffron and Rice — Design Review Log

Council process: six independent lenses (motion, codeperf, brand, a11y, visual, benchmark)
review the build each round; a chair pass dedupes findings, sanity-checks scores, and
compiles an ordered fix list. Minimum three rounds. Rounds one and two never PASS.

---

## Round 1 — 2026-07-17

**Verdict: NEEDS-WORK** (round 1 verdict is always NEEDS-WORK per process rules)

### Per-lens scores

| Lens | Score /10 | Findings (Maj/Min) | checksRun depth |
|---|---|---|---|
| Motion | 7.3 | 0 / 1 / 1 | 15 itemized checks, live GSAP property polling, dense screenshot timing, isolated from-scratch repro |
| Code & Perf | 6.5 | 0 / 2 / 5 | 12 checks across 24 page/viewport/motion combos, network + console instrumentation |
| Brand | 7.2 | 0 / 3 / 2 | 12 checks, palette/type/logo audits with Playwright scripts, hand-verified color math |
| Accessibility | 6.8 | 0 / 3 / 2 | 18 checks, full keyboard traces, contrast pixel-extraction, tap-target measurement |
| Visual | 7.2 | 0 / 2 / 2 | 10 checks + 12 ruled-out-artifact notes, live DOM geometry measurement |
| Benchmark | 6.2 | 0 / 4 / 5 | 12 composite verdicts + 9 checksRun items, cross-referenced against 4 reference sites |

**Overall (mean of lens scores): 6.87 / 10**

### Open counts by severity

| Severity | Count |
|---|---|
| CRITICAL | 0 |
| MAJOR | 15 |
| MINOR | 17 |
| **Total open** | **32** |

### Anti-inflation sanity check

Rule: a lens with a suspiciously high score AND thin checksRun gets flagged for rerun.
All six lenses show checksRun depth proportional to (or exceeding) their score — every
lens backed its findings with live Playwright verification (keyboard traces, computed-style
extraction, pixel sampling, frame-timing capture, isolated repros), not just static reading.
No lens scored above 7.3, well short of any plausible pass threshold, and the two lowest
scores (benchmark 6.2, codeperf 6.5) came with checksRun evidence just as thorough as the
higher scores. **No lens is flagged for rerun this round.** Benchmark's 9-item checksRun is
nominally the shortest list, but each item is a full composite-vs-reference verdict (12 of
them) plus live-verification follow-ups on two suspected defects — thin in item count, not
in rigor — and it also produced the lowest score, so there is no "high score + thin
evidence" mismatch to flag.

### Dedup notes

The brief flagged reduced-motion findings as a likely overlap point between Motion and
A11y. In this round neither lens filed reduced-motion as a *finding* — both independently
verified it as a clean pass (Motion check #6: all 6 pages screenshotted top/mid/bottom under
`reduced_motion: reduce`, fully finished; A11y check #11: same result) — so there is nothing
to dedupe there; it is recorded as a shared clean-pass, not a shared bug.

Beyond that specific example, this round's 32 findings were cross-checked pairwise for
literal overlap (same underlying bug reported from two lenses). **None were found to be
true duplicates.** Two related-but-distinct pairs are worth flagging for the fixer's
awareness (not merged, since they are separate defects with separate evidence):

- **BR-1 / BR-5** (both Brand): BR-1 is a wrong-caption bug on 3 menu chapters, BR-5 is a
  missing-caption gap on the other 3. Same file, same fix pattern, different chapters —
  kept as two IDs but scheduled together in the fix list (see FIXLIST.md #4/#24).
- **"Dead code" theme** echoes across three lenses on three unrelated assets — MO2 (unused
  `srSoft` easing curve in `app.js`), CP-5 (11 unused CSS utility classes in `tokens.css`),
  and BR-4 (unused ornament SVGs + `--crocus` tokens). These are not the same finding (three
  different files, three different fixes) but the recurrence suggests the build has a
  general pattern of registering system elements that never get wired up — worth a general
  "ship what you register" pass beyond just these three instances.
- **"Photography-thin sections" theme** echoes across Visual and Benchmark independently:
  VS1 (dead spacing between same-bg chapters) and BM01-04 (multiple pages/chapters with long
  photography-free scroll stretches) are separate, non-overlapping findings (different exact
  locations and different root causes — spacing vs. missing imagery) but they compound each
  other visually and are grouped adjacently in the fix list for a single "art direction pass."

### Full deduped findings table

All findings below are open (status=open). IDs are the lens's own canonical ID; no ID was
merged or renamed. "Alias" column is empty for all rows since no true duplicates were found.

| ID | Sev | Lens | Location | Finding | Fix | Status |
|---|---|---|---|---|---|---|
| MO1 | MAJOR | Motion | `assets/css/app.css:635` (`.curtain`) + `assets/js/app.js:350,365` (`buildCurtain`) | Arch-curtain parked position set twice (static CSS `translateY(115%)` + `gsap.set(yPercent:115)`), GSAP composites additively to 230%, collapsing the visible wipe into ~150-200ms instead of the coded .72s/.9s | Remove one of the two 115% declarations (keep CSS-only or JS-only) | fixed (verified) |
| CP-1 | MAJOR | Code&Perf | `menu.html`, `index.html` binds, `app.js renderFooter()`, `page-menu.js renderMenu()` | No-JS render structurally incomplete: menu loses all 50 dishes, footer empty, NAP shows `","` + blank hours, all `data-bind-href` anchors have no href | Prerender factual strings + real hrefs into static HTML; add `<noscript>` fallback to menu.html | still-open |
| CP-2 | MAJOR | Code&Perf | `404.html` (relative asset URLs, all `<link>/<script>/<img>`) | Relative URLs break on nested missing paths on GitHub Pages/Vercel — 404 page renders unstyled exactly when needed | Switch 404.html only to root-relative asset/link URLs | fixed (verified) |
| BR-1 | MAJOR | Brand | `page-menu.js:78-81` (`headHtml`), `data.js` kababs/stews/sandwiches sections | `.translit` span renders unrelated English caption (`sec.note`) instead of actual Persian transliteration on 3 of 6 menu chapters | Add real `translit` field per section in data.js, render that; move caption text to chapter body copy | fixed (verified) |
| BR-2 | MAJOR | Brand | `data.js:134` (Lamb Shank item) | Unsourced, invented sourcing claim "New Zealand, grass-fed, halal." not present in printed menu or research docs | Remove or replace with verbatim menu text; log as assumption if later confirmed | rejected (verified intact) |
| BR-3 | MAJOR | Brand | `app.js:169` (`footer__seal`) | Footer lockup `<img>` ships `width="692" height="484"` vs real 800x910 intrinsic size — 63% aspect-ratio error, layout jump on load | Correct width/height to 800/910 or use CSS `aspect-ratio` | fixed (verified) |
| AX1 | MAJOR | A11y | `app.js setMenu()/initMenu()`, `.menu`/`.nav` z-index in app.css | Mobile menu overlay doesn't trap focus — Tab escapes into header nav/logo link, which also renders visibly on top of overlay (z-index inversion) | Make header `inert` while menu-open; raise `.menu` z-index above `.nav` | fixed (verified) |
| AX2 | MAJOR | A11y | `app.css .stat__price`, `tokens.css .on-teal --price` | Catering price stat text measures 4.04:1 against `.on-teal` background, below 4.5:1 AA minimum | Scoped override for `.stat__price` on `.on-teal`, distinct from passing `.on-dark` use | fixed (verified) |
| AX3 | MAJOR | A11y | `page-menu.css .mhero.is-pinned .mhero__carta`/`.mhero__hours`, `tokens.css .on-teal --fg-faint` | Menu hero pinned hours readout measures 3.12:1 — `--fg-faint` mixed against wrong ground (`--teal-deep` instead of actual `--bg-2`/`--teal`) | Use `--fg-soft` (5.48:1, passes) for `.mhero__hours`, or scope a correct `--fg-faint` override | fixed (verified) |
| VS1 | MAJOR | Visual | Sitewide: index/catering/about/contact same-background chapter joins | Consecutive same-bg `.chapter` sections stack full `--sect` padding into 273-346px dead, unornamented gaps | Reduce padding at same-bg joins to `--sect-sm`, or fill with ambient ornament/mono readout | fixed (verified) |
| VS2 | MAJOR | Visual | `index.html #sofreh` band, `assets/img/home-menu-teaser.jpg` | Source photo shows a distracting blue plastic order-tag prop, undermining documentary-but-polished food styling | Recrop, swap frame, or clone-retouch the tag out | fixed (verified) |
| BM01 | MAJOR | Benchmark | `index.html` hero, `home.css:41-45 .hero__arch` | Homepage hero capped at 470px inset thumbnail vs DESIGN-BRIEF's "full-bleed kabab hero" spec — largest single gap in the review | Scale to ≥55-65vw/full-height environmental panel, drive growth off scroll | fixed (verified) |
| BM02 | MAJOR | Benchmark | `index.html` chapter 02 "Koobideh, barg, soltani" | Flagship kabab chapter is a bare 3-column price table with zero photography | Reuse `menu-kabab.jpg` grill photography in arch/full-bleed treatment | fixed (verified) |
| BM03 | MAJOR | Benchmark | `about.html:112-155 .ab-dusk` hero | Day-to-night hero runs ~3,000px of pure color/type scroll with no photography anywhere | Add at least one photograph cross-fading/darkening in sync with ground-color transition | fixed (verified) |
| BM04 | MAJOR | Benchmark | `catering.html` sections 02/03/05 + halal section 04 | ~6,000px of catering.html's 9,313px total height carries zero imagery | Break up sections with supporting images from the existing catering photo set | fixed (verified) |
| MO2 | MINOR | Motion | `app.js:792` (`CustomEase.create("srSoft")`) | `srSoft` house easing registered but never used as an ease value anywhere | Apply to an unnamed-curve effect (e.g. about.js render()) or remove registration | fixed (verified) |
| CP-3 | MINOR | Code&Perf | `assets/img/` (6 named JPG/PNG files) | Full-scroll transfer 1.5-2x heavier than needed (menu.html 3.75MB); first-load threshold not breached | Re-encode with mozjpeg q72-78 or WebP; convert map PNGs to JPEG/WebP | fixed (verified) |
| CP-4 | MINOR | Code&Perf | `logo-text.svg` (163KB), `logo-lockup.png`, `emblem.png` | Loader wordmark SVG and brand PNGs heavier than needed for ~1s on-screen loader use | Run svgo at 1-decimal precision; re-export PNGs at display size or WebP | fixed (verified) |
| CP-5 | MINOR | Code&Perf | `tokens.css` (11 utility classes), `app.css:671 .split-mask` | Dead CSS: 11 unused utility classes + leftover `.split-mask` from pre-SplitText approach | Delete unused utilities and `.split-mask` | fixed (verified) |
| CP-6 | MINOR | Code&Perf | `app.js runLoader()`/`buildLoader()` fetch `.then` | Race: late-resolving wordmark SVG fetch can swap in fully-inked SVG mid-loader-timeline on slow hosts | Check a `started` flag in the fetch `.then`, bail if timeline already running | fixed (verified) |
| CP-7 | MINOR | Code&Perf | Repo root (3 logo files, 92MB `research/`) | 2.2MB unreferenced logo files at deploy root; `research/` partially tracked and deployable | Delete/move root files; exclude `research/` from deploy | fixed (verified) |
| AX4 | MINOR | A11y | `catering.html:246`, `index.html:202` (`.script-fa` ghost words) | Two decorative Persian ghost words missing `lang="fa" dir="rtl"` (unlike 12 other instances) | Add `lang="fa" dir="rtl"` to both | fixed (verified) |
| AX5 | MINOR | A11y | `app.js renderFooter()` `pageLinks` | Footer "Menu"/"About" links under 44px tap-target width at 390px | Add horizontal padding/min-width to footer nav-link list items | fixed (verified) |
| VS3 | MINOR | Visual | `catering.html:219 .step__num` | "Three steps" numeral "1" (no leading zero) visually reads as capital "I" | Format as 01/02/03, or use mono font for `.step__num` | fixed (verified) |
| VS4 | MINOR | Visual | `index.html #reviews` grid, 3rd card | Equal-height review cards leave 60-70px unclaimed whitespace under a short quote | Match quote lengths, switch to 2x2 pattern (per about.html), or center quote block | fixed (verified) |
| BM05 | MINOR | Benchmark | `menu.html:146-181 .mhero__strip` | 5-photo hero filmstrip mixes inconsistent exposure/color grading | Apply shared color grade/exposure curve across the 5 images | fixed (verified) |
| BM06 | MINOR | Benchmark | Sitewide arch motif (`.arch`, `.arch--ogee`) | Arch mask always a one-off photo frame, never a repeating structural grid; Farsi script always caption-scale | Repeat arch shape as a grid unit in one section; treat one Farsi word at large decorative scale | fixed (verified) |
| BM07 | MINOR | Benchmark | Index full-bleed "FROM OUR KITCHEN" band | No human/family storytelling moment at hero/pull-quote scale despite brief's family voice | Add one first-person family pull-quote moment tied to real kitchen photography | fixed (verified) |
| BM08 | MINOR | Benchmark | `404.html:78-79 .nf-hero__num/.nf-hero__kicker` | Ghost "404" numeral/kicker sit at opacity:0 for 3-5s post-load before scramble-text resolves | Decouple text reveal timing from longer scatter-canvas animation, resolve within ~1.5s | fixed (verified) |
| BM09 | MINOR | Benchmark | Index mobile hero | Static logo lockup on black, no photography or mission-statement copy | Add one-line mission statement to mobile hero or loader | fixed (verified) |
| BR-4 | MINOR | Brand | `assets/img/ornament/*.svg`, `tokens.css --crocus/--crocus-lite` | Ornament SVGs and crocus tokens defined, referenced by brief, never used in shipped markup | Wire at least one SVG into a live scene, or remove unused assets/tokens | fixed (verified) |
| BR-5 | MINOR | Brand | `menu.html` appetizers/rice/platters chapter headers | 3 more menu chapters show Persian eyebrow with zero Latin annotation at all | Same fix as BR-1: add `translit` field for remaining 3 sections | fixed (verified) |

### Round 1 fix-pass verification addendum — 2026-07-18

Independent verifier pass (see `review/round-1/VERIFICATION.md` for full per-item evidence).
31 of 32 items confirmed fixed live; BR-2 confirmed rejected-intact per orchestrator
override. CP-1 could not be confirmed and is reverted to **still-open** despite three
fixers (menu.html, index.html, contact.html sides) each independently reporting their
own slice done — the FIXLIST's own Verify step ("Footer must show real page links/
phone/social, not an empty band") fails on **all six pages**: `[data-site-footer]` is
built exclusively by `app.js renderFooter()` with zero static or `<noscript>` fallback,
so `innerHTML.length === 0` with JS disabled everywhere, confirmed via
`java_script_enabled=False` sweep. No fixer's file scope included the shared footer
shell itself.

Two new findings surfaced during verification, neither claimed as fixed by any fixer,
both added below and carried into round 2:

| ID | Sev | Lens | Location | Finding | Fix | Status |
|---|---|---|---|---|---|---|
| VER-1 | CRITICAL | Verification | `index.html`/`menu.html`/`catering.html`/`about.html`/`contact.html`/`404.html` `[data-site-footer]`, `assets/js/app.js renderFooter()` | Footer band is 100% empty (`innerHTML` length 0) with JS disabled on all six pages — no static markup or `<noscript>` fallback exists for the shared footer shell, so CP-1's explicit Verify requirement ("Footer must show real page links/phone/social, not an empty band") fails sitewide despite CP-1 being marked done by three separate fixers for their own page slices | Prerender the footer's static markup (page links, phone, address, social, tagline) directly into each page's `<footer data-site-footer>` shell so `renderFooter()` overwrites already-correct content, matching the pattern used for menu.html's dish list | still-open |
| VER-2 | CRITICAL | Verification | `.nav__call` header markup across `index.html`, `menu.html` vs `catering.html`/`about.html`/`contact.html`/`404.html` | Round-1 fixes broke the previously-verified "nav byte-identical across pages" invariant (see PROGRESS.md Phase 3 completion note): index.html and menu.html now prerender `.nav__call` with `href="tel:+13105040310"` and static text `(310) 504-0310`, while catering/about/contact/404 still ship the unbound placeholder (`data-bind-href` only, no `href`, text "Call us") — the nav Call button is dead with JS off on 4 of 6 pages, and the shared nav partial is no longer literally identical across the site | Either prerender `.nav__call`'s href/text identically on all six pages, or revert index.html/menu.html's nav__call to the shared placeholder pending a single fixer taking the whole shared-nav CTA in one pass | still-open |

One additional accessibility gap was found by the alpha fixer's own on-teal contrast
audit and explicitly disclosed as unfixed (not a false claim, so no new CRITICAL row,
but tracked for round 2): `page-contact.css`'s `.call-panel__phone { color: var(--price) }`
on `contact.html #visit-us` measures 4.04:1 against `--teal-deep`, confirmed live at
4.037:1 by the verifier, same root cause as AX2/AX3 but in a file outside alpha's scope.

### Ordered fix list (summary — full detail with exact changes and verification steps in `review/round-1/FIXLIST.md`)

No criticals. Majors grouped by owning file/cluster so one fixer can take one cluster
cleanly; minors follow, roughly cheapest/most-isolated first.

**Majors (15), by cluster:**
1. Cluster A — `assets/js/app.js` + `assets/css/app.css` (core shell): MO1, AX1, BR-3
2. Cluster B — `assets/js/data.js` + `assets/js/page-menu.js` + `assets/css/page-menu.css` (menu content): BR-1, AX3
3. Cluster C — `assets/js/data.js` (data integrity): BR-2
4. Cluster D — `index.html`/`menu.html`/`app.js`/`page-menu.js` (no-JS fallback): CP-1
5. Cluster E — `404.html`: CP-2
6. Cluster F — `assets/css/tokens.css` (on-teal contrast): AX2
7. Cluster G — `assets/css/app.css` (chapter spacing): VS1
8. Cluster H — `index.html`/`assets/css/home.css` (hero + kabab chapter): BM01, BM02
9. Cluster I — `assets/img/home-menu-teaser.jpg` (photo curation): VS2
10. Cluster J — `about.html` (day/night photography): BM03
11. Cluster K — `catering.html` (section photography): BM04

**Minors (17), roughly cheapest-first:** AX4, VS3, AX5, MO2, CP-5, CP-6, CP-7, BR-4, BR-5
(bundle with BR-1), VS4, CP-4, CP-3, BM05, BM08, BM09, BM06, BM07.

Full per-item exact-change instructions and verifier steps: `review/round-1/FIXLIST.md`.

### Themes for next round

1. **On-teal is the weak color scope.** Both AA contrast failures (AX2, AX3) live inside
   `.on-teal`, the newer alternate dark stage — every `.on-dark` pairing a11y checked passed
   comfortably. Recommend a full manual contrast pass over all four `.on-teal` usages
   (catering halal, contact call-panel, index catering-count, menu pinned carta), not just
   patching the two caught this round, in case the same token combination recurs at a
   different font size.
2. **The site under-photographs its own long scroll.** BM01-04 (hero scale, kabab chapter,
   about dusk hero, catering mid-page) and VS1 (dead spacing) independently converge on the
   same root cause from two different lenses: long stretches of the site read as a spec
   sheet, not the documentary-photography-forward brand the brief specifies. This is the
   single biggest thematic gap and the most likely lever to move both the Visual and
   Benchmark scores materially next round — start with BM01 (index hero), the highest-traffic
   and most brief-contradicting instance.
3. **Registered-but-unshipped system elements.** `srSoft` easing, 11 CSS utilities, and two
   ornament SVGs + crocus tokens are all built but never wired up — a recurring pattern
   worth a deliberate "finish or delete" pass rather than three separate one-off fixes.
4. **Menu's Persian annotation system is half-built.** BR-1/BR-5 mean none of the 6 menu
   chapters currently show a correct transliteration (3 wrong, 3 missing) despite the
   correct pattern existing and working correctly on about.html — this is a one-file fix
   with an existing correct template to copy from.
5. **No lens flagged for rerun.** All six showed live-verification depth matching their
   score; the spread (6.2-7.3) is narrow and consistent with a genuine first-pass baseline,
   not score inflation.

---

### Round 1 addendum: orchestrator fixes after verification (pending round-2 reviewer verification)

- VER-1 / CP-1 footer: the full footer markup is now statically prerendered inside
  [data-site-footer] on all six pages (renderFooter overwrites idempotently at runtime).
  JS-off footer measures 2808 chars with real links, phone, halal lines on every page.
- VER-2: nav__call unified: prerendered tel href + phone text on all six pages; the five root
  pages are byte-identical (modulo is-active/aria-current); 404.html differs only by its
  sanctioned root-relative href/src prefixes, now matched at runtime via html[data-root] support
  in app.js (footer and overlay links).
- Contact .call-panel__phone lifted to color-mix(pomegranate-lite 72%, paper) inside .on-teal:
  measured 5.7:1 on teal-deep (was 4.04:1, which passed AA large-text but not the strict line).
- Verified locally: zero console errors/warnings on all six pages, JS-off footers populated,
  nav identity restored. Round-2 lenses must independently re-verify these three.
