# Design Spec Review, Round 1: Lens 5 (Accessibility) + Lens 6 (Devil's Advocate)

Targets: assets/css/tokens.css, research/design-brief.md (with assets/js/data.js and the skill a11y/SEO baseline as evidence).
Method: contrast ratios below are COMPUTED (WCAG relative luminance), not eyeballed. Pass bar 9.5.

---

## LENS 5, ACCESSIBILITY. Score: 7.9 / 10

### Computed contrast table (sRGB, WCAG 2.1)

| Combo | Ratio | Verdict |
|---|---|---|
| ink #0e110f on paper #f6efe1 (body) | 16.60 | AAA pass |
| paper on ink (body, dark) | 16.60 | AAA pass |
| accent-deep #7a5c26 on paper (gold text on cream) | 5.42 | AA pass |
| accent-deep on paper-1 #f0e2ce (alt cream) | 4.87 | AA pass |
| accent-lite #d4a95d on ink (gold on espresso) | 8.71 | AA pass |
| accent-base #b68b4a on paper | 2.71 | FAILS 4.5 text AND 3:1 non-text |
| red #970e0d on paper (red price accents on cream) | 7.70 | AA pass |
| red-deep #741010 on paper | 10.06 | AA pass |
| red-lite #c1403a on ink | 3.67 | FAILS 4.5 for normal text |
| crocus-deep #57266d on paper | 9.64 | pass |
| crocus-lite #ac7cba on ink | 5.74 | pass |
| fg-faint light (60% mix) on paper | 4.75 | AA pass |
| fg-faint light on paper-1 (--bg-2) | 4.26 | FAILS 4.5 |
| fg-faint dark (52% mix) on ink | 5.08 | AA pass |
| fg-soft light / dark | 7.69 / 8.38 | pass |
| accent-ink #1c1408 on gold fill (CTA text) | 5.88 | pass |
| focus ring: accent-deep vs paper / accent-lite vs ink | 5.42 / 8.71 | pass 3:1 |
| steel-2 #8a8271 on paper | 3.33 | fails as body text, large-only |
| 20%-alpha gold hairline on ink (menu rules) | ~1.32 | decorative only, never a boundary |
| ghost stroke (18% ink) on paper | 1.47 | decorative, must be aria-hidden |

The core proposition of the brief's section 4 checks out: gold-deep on cream, gold-lite on ink, red on cream all clear AA. Good discipline. The failures are at the edges:

### Findings

1. **MAJOR. `.on-dark --accent-2-text: var(--red-lite)` computes 3.67:1 on ink, below 4.5:1.** The menu alternates cream and NIGHT bands (brief, Menu section 2), and any red-colored text (price seals, tick labels) on a night band fails AA at Chivo Mono price sizes (13px). FIX: in tokens.css `.on-dark`, add a lighter red for text, e.g. `--red-text-dark: #e0736c` (computes ~5.6:1 on #0e110f) and point `--accent-2-text` at it; keep `--red-lite` for fills/ticks only. Alternatively rule in the brief: on night bands red is tick-only, price TEXT stays `--fg`.

2. **MAJOR. `--fg-faint` fails on `--bg-2`.** `--fg-faint` is mixed for `--paper` (4.75) but the semantic layer also defines `--bg-2: var(--paper-1)`, where the same token computes 4.26:1. Any caption on an alt-cream section fails AA. FIX: raise the mix to 64% ink (`color-mix(in srgb, var(--ink) 64%, var(--paper))` computes about 5.5 on paper, ~4.9 on paper-1) so one token passes on both grounds. Same check on dark: fg-faint dark on `--bg-2` (#141a16) is ~4.8, passes, leave it.

3. **MAJOR. No `:focus-visible` rule exists anywhere in tokens.css.** The file defines `--focus` and the brief promises "2px visible outline offset", but tokens.css contains the reset (which strips button/input borders and outlines by inheritance of `border:0`) and NO ring. If app.css misses it, keyboard users get nothing. The skill baseline (A2) makes this a hard gate. FIX: add to tokens.css, directly after the reset:
   `:where(a,button,input,select,textarea,[tabindex]):focus-visible { outline: 2px solid var(--focus); outline-offset: 2px; border-radius: 2px; }`
   `:where(a,button,input,select,textarea):focus:not(:focus-visible) { outline: none; }`

4. **MAJOR. Type-size floor broken: `--fs-eyebrow` bottoms at 10px, `--fs-mono` at 11px.** 10px uppercase mono with .16em tracking is below any reasonable legibility floor, and these tokens carry real content (category chips, HUD labels, halal band labels, disclosure copy per Menu section 4). FIX: raise floors to `--fs-eyebrow: clamp(12px, .76vw, 12px)` (i.e. 12px min) and `--fs-mono: clamp(12px, .84vw, 13px)`. Disclaimers/disclosures must render at `--fs-body` minimum, never `--fs-mono`; add that sentence to brief section 4.

5. **MAJOR. Brief hero concepts lack keyboard/AT specs for their signature interactions.** Section 4 covers the carte overlay (focus trap + Escape: good) but: (a) the About "year scrubber" has no keyboard model; a drag/scroll scrubber is unusable by keyboard and AT. FIX: spec it as a `role="tablist"` of four year buttons (2008/2015/2018/2026) with arrow-key support, scrubbing as pointer enhancement only; content of all four eras must be in DOM order. (b) The Home dolly-zoom + masked-line hero: spec that headline text is real DOM text (not split-span-only with opacity:0 initial state) so no-JS and AT read it; the noscript un-hide from the skill baseline (A8) must be a listed deliverable. (c) Testimonial fanned polaroids: prev/next controls need 44px targets and `aria-live="polite"` on the active card; add to brief.

6. **MAJOR. Day-to-night 220vh lerp has a mid-transition contrast hole.** Lerping bg cream to ink "while text inverts in sync" guarantees a scroll range where fg and bg cross near-equal luminance and contrast approaches 1:1. FIX: spec the text swap as a stepped flip (fg switches from ink to paper at the ~45% scroll point, both AA at the swap because the mid ground is either still light enough for ink at >4.5 or dark enough for paper), not a continuous fg lerp. State the two swap-point ratios in the brief.

7. **MINOR. Eyebrow khatam tick uses `--accent` raw (#b68b4a), 2.71:1 on paper.** As a meaningful non-text indicator (category color coding: gold/red/crocus variants) it should clear 3:1. FIX: point `.eyebrow::before` at `--accent-text` on light scope (5.42), or declare the tick decorative and ensure the label text alone carries meaning (then no change needed; say so in the brief).

8. **MINOR. Reduced-motion guard is CSS-complete but two gaps:** (a) `k-marquee` at .001ms with `iteration-count:1` freezes at translate3d(-50%): fine only if content is duplicated; add a comment requiring duplication or an explicit `animation: none` for `.marquee` under the guard. (b) `scroll-behavior:auto` is set, good, but nothing zeroes `animation-delay`; a long-delayed one-shot reveal still leaves content invisible for the delay. Add `animation-delay: 0ms !important` to the guard.

9. **MINOR. Tap-target floor promised (44px) but no token/utility exists.** Add `--tap: 44px;` to tokens.css and a utility `.tap { min-height: var(--tap); min-width: var(--tap); display: inline-flex; align-items: center; justify-content: center; }`, and name in the brief which controls get it (nav links, chips, testimonial arrows, category rail items, Skip pill).

10. **MINOR. `.ghost` (1.47:1 stroke) and the shamse watermark must be `aria-hidden="true"` / `user-select:none` is present but the brief should state the aria rule.** One sentence in brief section 4.

Why 7.9: the primary text/accent architecture is genuinely AA-verified and the token/scope design (semantic tokens + .on-dark) is exactly the right shape; but a computed AA failure on a token the menu page will actually hit (red-lite text on night bands), a failing fg-faint on --bg-2, a missing focus-visible rule in the shipped CSS, a 10px type floor, and unspecced keyboard models for two hero signatures are five distinct AA-relevant defects. Fix list above is exhaustive; all are cheap.

---

## LENS 6, DEVIL'S ADVOCATE. Score: 7.2 / 10

### Findings

1. **CRITICAL. Photography provenance is a legal and honesty hole.** data.js: "Photography: blog-sourced representative imagery of this location (pre-transition era)." Blog-sourced means someone else's copyrighted photos, of the PREVIOUS business, presented for the new one. The disclosure line ("representative of the kitchen and its dishes") does not cure copyright, and "pre-transition era" photos of a supermarket dressed as the new deli's kabab-fire hero is borderline misrepresentation. FIX: (a) verify license for every image and record it in research/business/facts.md with source URL and license; anything unlicensed is replaced with owner-supplied photos or licensed stock explicitly labeled representative; (b) the Home hero "kabab-fire photograph" must be either the owner's or licensed stock, never a scraped blog image; (c) add an image manifest (slug, source, license, era) requirement to the brief.

2. **MAJOR. Testimonials are reviews of the previous business under a site that leads with "now under new management."** All three Yelp quotes predate the transition (same location, old name). Praising "consistently the most flavorful dishes" from the old kitchen while simultaneously marketing a management change is having it both ways. FIX: attribute honestly in the rendered card, e.g. who: "Yelp reviewer, Saffron Food Mart era", or drop the polaroid section until post-transition reviews exist. Do not attribute old-era quotes to "Saffron & Rice."

3. **MAJOR. The About timeline (2008 / 2015 / 2018 / 2026 with "archival-graded storefront imagery") asserts a lineage the data layer does not verify.** data.js only knows "formerly Saffron Food Market... under prior ownership." Whose lineage is 2008 Shayan and 2015 Seaside: the new owners' other ventures, or the location's? If it is the PRIOR owner's history, the new-management site cannot claim it; if it is the new owners', facts.md must source it. Also: four eras of archival storefront photos almost certainly do not exist as licensable assets. FIX: gate the timeline hero on verified facts + owned imagery; fallback hero (already light-editorial) works with a single dated statement and one photo. Add the year list to data.js with a provenance comment or delete the years from the brief.

4. **MAJOR. The menu page buries the one thing a hungry customer wants.** Sequence before the first price: night-ground carte-cover hero, featured-dish spotlight, spinning shamse rosette, category chips, then a numbered category index table, THEN items. That is two full screens of theater on the site's most-used page, on a menu of only 3 categories / 16 items. And there is no persistent order/call action on the page at all; the phone number first appears on Catering and Contact. FIX: (a) hero max 70vh with the category index visible in the first viewport at mobile; (b) sticky bottom bar on Menu (mobile) with `tel:` CTA "Call (310) 504-0310" reading from data.js; (c) rosette is decorative, must not delay content paint (no JS-gated reveal on item rows: rows render server-side/immediately); (d) prices at minimum `--fs-body` in Chivo Mono, never letter-spaced to decoration.

5. **MAJOR. Six distinct heroes vs actual content volume is over-scoped, and two heroes have no content to feed them.** The Spread hero needs three tiered platter photos (10/20/30 guests): no such photography exists per data.js. The About hero needs four eras of archival imagery (see finding 3). Meanwhile Menu, the page that matters, gets the most fragile hero. FIX: keep six distinct heroes as compositional layouts (that is achievable) but re-spec Spread and About heroes to run on ONE photo plus typographic/SVG structure, with the multi-photo sequences listed as post-photoshoot enhancements. State in the brief which heroes are asset-blocked and their shipping fallback.

6. **MAJOR. Halal claims rendered as "engraved-style cards" and "red khatam seals" visually imply certification marks.** The strings are owner-provided marketing copy ("100% Certified Grass Fed Halal"); dressing them as seals/stamps makes the SITE assert certification. If challenged, "the owner told us" is weak. FIX: render the claims verbatim as quoted supplier statements, keep the seal ornament purely decorative and unlabeled, and add to data.js a `halalNote` such as "Ask us about our halal sourcing" unless a certifier name is verified in facts.md. Never put halal claims in JSON-LD.

7. **MINOR (distinctiveness). "Sofreh at Dusk" is structurally a Khufu's clone with a Persian coat.** Count the Khufu's borrowings on Home alone: poetic preloader, chapter kickers, day-to-night scroll CTA, polaroid testimonials, masked line reveal, plus Berenjak's footer wordmark. The genuinely ours layer (khatam tick, shamse, ivan-arch reading of the radius mask, Farsi accent, logo-sampled palette) is real but thin against that skeleton. Verdict: acceptable for a re-skin pipeline IF the ornament plan is executed fully; it is the only thing standing between this and template feel. FIX: promote one original signature to load-bearing status per page (e.g. the saffron-thread linework as the sitewide divider system replacing generic hairlines), and cut the preloader to first-visit-only under 2.5s with the Skip pill focusable first: a deli customer mid-lunch-decision should never wait on poetry twice.

8. **MINOR. Data inconsistencies the design will expose.** (a) Home signature trio is "koobideh, stews, rice" but stews exist only inside combo platters; the stew card can only link to Party Platters, which reads broken. Either link it there with honest copy ("in our combos") or swap the third card to Sandwiches. (b) Price formats mix "69.99" and "199" (owner-verbatim, do not edit data): the price renderer must handle both without inventing ".00". (c) `hours: null` with "call to confirm": good honesty; but the Contact "blinking status dot" implies live open/closed state the site cannot know. Remove the dot or make it a static ornament with no open/closed semantics.

9. **MINOR. Scope creep at the edges, under-scope at the core.** A 404 shamse hero, session-scoped preloader, and 220vh lerp are specced in loving detail, while the brief never mentions: per-page titles/descriptions, JSON-LD Restaurant block, sitemap/robots, hero preload, or the skip link, all hard gates in the council baseline. FIX: add a "Baseline deliverables" section to the brief referencing 05-accessibility-seo.md Part B explicitly, so round 2 does not discover missing SEO scaffolding.

Why 7.2: the palette provenance, honesty scaffolding in data.js (null hours, disclosure lines, verbatim menu), and re-skin discipline are better than typical; but a copyright-exposed image pipeline, old-business testimonials under a new-management banner, an unverifiable lineage timeline, seal-dressed halal claims, and a theater-first menu page are exactly the failures that hurt a real deli. None are hard to fix; all are currently specced in the wrong direction.

---

## Verdict

Both lenses below the 9.5 bar. Round 1: REVISE.

Top fixes by leverage:
1. tokens.css: add the `:focus-visible` block; fix `.on-dark --accent-2-text` (red text on ink 3.67:1); raise `--fg-faint` light mix to 64%; raise mono/eyebrow floors to 12px; add `--tap: 44px` + utility. (Lens 5, items 1-4, 9)
2. Brief: image manifest with license per asset; hero photography must be owned or licensed, never blog-scraped. (Lens 6, item 1)
3. Brief: era-attribute the Yelp quotes; gate the About timeline years on facts.md verification. (Lens 6, items 2-3)
4. Menu page: first-viewport category index, sticky tel: CTA, no JS-gated item rows. (Lens 6, item 4)
5. Brief: keyboard spec for the year scrubber (tablist model) and stepped fg flip for the day-to-night lerp. (Lens 5, items 5-6)
