# Saffron & Rice — Full-Site Council, Round 1
## Lenses: VISUAL FIDELITY + BRAND
Date: 2026-07-18

Method: fresh Playwright screenshots (1440 + 390, viewport + scroll states) of all six pages, reused/extended `review/site-round1/shots/`. Eight side-by-side composites built in `review/composites/` against `research/refs/{khufus,laguna,tastavents,berenjak}`. Two findings below were additionally verified live in a fresh headless-Chromium session with settled animation state (not just the static capture) to rule out capture-timing artifacts before being logged as bugs.

---

## SCORES

| Lens | Score | Bar |
|---|---|---|
| Visual Fidelity | **7.6 / 10** | 9.5 |
| Brand | **8.4 / 10** | 9.5 |

Neither clears the bar. The design language, type system, and photography direction are genuinely reference-caliber (composites 01, 05, 06 hold up well next to Khufu's/Laguna). But two reproducible layout-collision bugs (footer wordmark, home ornament) and one transitional-scroll collision on Catering are the kind of thing a Khufu's or Berenjak review would never ship, and they are the deciding factor pulling Visual down. Brand is stronger and closer to bar; its deductions are narrower and more fixable.

---

## COMPOSITES

1. `review/composites/01_home_hero_vs_laguna_khufus.png` — home hero vs Laguna hero + Khufu's desert hero
2. `review/composites/02_day_night_vs_khufus.png` — home signatures/day band vs Khufu's imagery band + closing invitation
3. `review/composites/03_menu_chapters_vs_tastavents_khufus.png` — menu chapter nav/rice table vs Tastavents menu hero + Khufu's featured-dish card
4. `review/composites/04_catering_vs_tastavents.png` — catering hero/tiers vs Tastavents hero + chef bios
5. `review/composites/05_about_vs_khufus_story.png` — about timeline vs Khufu's "conceived from context" + chaptered story
6. `review/composites/06_contact_vs_khufus.png` — contact hero vs Khufu's minimal desert-dune hero
7. `review/composites/07_footer_vs_khufus.png` — footer vs Khufu's four-column footer (this composite is what first surfaced the wordmark-overlap bug below)
8. `review/composites/08_mobile_home_vs_laguna_khufus.png` — mobile home vs Laguna/Khufu's mobile

Supporting live-verification screenshots (not part of the required 8, used to confirm bugs are real and not capture artifacts): `review/composites/verify_catering_2700_settled.png`, `review/composites/inspect_wordmark.py` output, `review/composites/verify_footer_progressive.png`.

---

## CRITICAL FINDINGS

### C1. Footer's giant decorative wordmark overlaps and obscures the copyright/legal bar — every page
**File:** `assets/css/app.css`, `.footer__wordmark` (lines 481–489), in relation to `.footer__bar` (line 497) and the markup order in e.g. `index.html` lines 461–467.

The footer intentionally runs a Berenjak-style oversized cropped wordmark (see the code comment at `app.css:445`, "cropped giant wordmark sliced by the viewport bottom"). The SVG (`assets/img/brand/saffron_rice_text_only_high_quality.svg`) is `width:100%; height:auto` with `transform: translateY(18%)` and no reserved intrinsic size on the `<img>` (no `width`/`height` attributes on the tag itself in `index.html:463`), so it loads late and lands taller than the space the design intends.

Verified live (not just the capture): after a full progressive scroll to the bottom of `index.html`, `getBoundingClientRect()` gives:
- `.footer__wordmark`: top 276px, bottom 967px (height 691px)
- `.footer__bar`: top 842px, bottom 900px

The copyright bar sits entirely inside the wordmark's vertical span. Visually this reads exactly as the composite shows: the giant "S" of "Saffron" sits directly on top of "© 2026 S[affr]on and Ri[ce], LLC," and the ampersand/red "R" of "RICE" sits on top of "3801 Pacific Coast Hwy, Torrance." The legal line and the address line are the two most liability-sensitive pieces of copy on the whole site (business name of record, address) and they are the ones getting swallowed.

**Fix:** give `.footer__wordmark img` explicit `width`/`height` (or an `aspect-ratio`) matching the SVG's intrinsic ratio so the browser reserves correct layout space before decode (kills the late-load height jump measured above: total page `scrollHeight` grew from 9959px to 10650px, ~691px, purely from this image loading in). Then reduce or remove the `translateY(18%)` push (or compensate with equal `padding-bottom` on `.footer__wordmark` / `margin-top` on `.footer__bar`) so the wordmark's rendered glyphs never enter the bounding box of `.footer__bar`. A quick correct value: set `.footer__wordmark { margin-bottom: clamp(24px, 6vh, 64px); transform: translateY(6%); }` and re-verify the two rects no longer intersect on 1440 and 390.

### C2. Purple crocus ornament sits directly on top of dish-card copy — home page, "Three things we refuse to rush" section
**File:** `assets/css/pages/home.css:171` — `.home-trio .fc-petal-1 { top: 34%; left: 3.5%; width: 30px; }`

At 1440px, this decorative petal (colored `var(--crocus)`, solid purple, `assets/css/pages/home.css:169`) lands squarely mid-word in the first dish card's body copy: "Hand-pr●essed skewers of beef or chicken" — the purple shape sits directly over the "e" between "pr" and "essed," visibly breaking the word. See composite 02 (left column, card 1). This is not a subtle registration issue; it is a fully opaque shape on top of running text.

**Fix:** the ornament layer (`.float-layer`, `app.css:286`) is `position:absolute; inset:0` over the whole `.home-trio` section, so `left:3.5%` is computed against the full section width, not the card column — it lands almost exactly where the card's text column starts (`--gutter` ≈ 72px at 1440 vs. the petal's ~50px offset, well within its 30px width). Move it fully into the gutter/margin outside the text column, e.g. `.home-trio .fc-petal-1 { top: 6%; left: 0.4%; }`, or drop it below the card grid entirely (`top: 96%`), and re-check against the card's rendered text box at 1440, 1280, and 1024 (the intersection risk changes with `--gutter`'s `clamp()`).

---

## MAJOR FINDINGS

### M1. Catering hero pin-out transition: outgoing tier numbers collide with incoming platter-card stat numbers
**Files:** `catering.html` (`.spread.is-pinned`, driven by `assets/js/pages/catering.js`) and the immediately following `<section class="section platters" id="platters">` (`catering.html:167`).

Scrolling to ~2700px on the 1440 desktop capture (and confirmed after a full 1500ms settle, i.e. not a scrub-lag artifact) shows the pinned tier board's large numerals "10 / 20 / 30" still on screen at the very top of the viewport, with the next section's first `.pcard__stats` values ("1," "2," "3" — the "stew(s) of choice" counts for the 10/20/30 platters) rendering in the same row, a few dozen pixels to the right, at nearly the same vertical position (`elementFromPoint` confirms the "1" belongs to `.pstat__num` inside `.pcard` inside `#platters`, sitting at `y≈68–116px`, essentially the same band as the tier numbers directly above it). The two unrelated numeral sets read as one garbled string ("10 1," "20 2," "30 3") for a full screen's worth of scroll distance during the pin release.

**Fix:** the `.spread.is-pinned` pin depth (`assets/css/pages/catering.css:46`, `height: 220vh`) is releasing before the tier board has fully cleared the viewport, so the platters section is entering while the old board is still partly on screen with nothing behind it to separate them. Increase the pin's effective clearance — either bump `.spread.is-pinned { height: 220vh }` to give more scroll runway before unpin, or add `scroll-margin-top`/`padding-top` to `#platters` sized to the tier board's height so the incoming section starts a full viewport below the point where the board finishes scrolling away. Re-verify by scrolling in 100px increments through the 2400–3000px range on 1440 and checking no two numeral groups occupy overlapping bounding boxes.

---

## MINOR FINDINGS

### N1. JSON-LD `logo` field ships a placeholder origin
**File:** `index.html:46` — `"logo": "https://PLACEHOLDER_ORIGIN/assets/img/brand/saffronlogonobg.png"`. Harmless to the rendered page but will surface as broken structured data / a literal "PLACEHOLDER_ORIGIN" string to any crawler or rich-result validator that runs against the live domain before this is swapped. Flag as a pre-launch checklist item, not a visual bug, but it is an honesty/production-readiness smell worth closing out before this ships.

### N2. Mobile home page has a large empty black gap after the "By dark it sets a dinner spread" CTAs
Visible in composite 08, left column, bottom half: after the "See the full menu" / "Call" buttons there's a tall stretch of unbroken black before the section ends. Worth a pass to confirm this is intentional breathing room and not a collapsed/late-loading element (same lazy-load-without-reserved-height pattern as C1 is worth ruling out here too).

### N3. Menu's hand-drawn red squiggle underline (composite 03, "Rice" heading) reads a little rough at full size
Not wrong per the brand's charcoal/imperfect-line vocabulary, but it is noticeably heavier/cruder than the other line-art ornaments (khatam seal, float-cutouts) elsewhere on the site. Worth a second pass on stroke weight/wobble amplitude for consistency of "hand" across ornament assets.

---

## WHAT'S WORKING (for calibration, not vague praise)

- **Home hero (composite 01):** "Fire on the coals, gold in the rice, the *sofreh* is set." with the Fraunces italic on "sofreh" is a genuinely strong, specific line — reads more confident and more Persian-deli-warm than Laguna's generic "Culinary Odyssey by the Sea," and holds its own compositionally against Khufu's pyramid hero (arch crop on the hero photo is doing real work here).
- **About/story chapter treatment (composite 05):** the "2020–2021 / Saffron Food Market" era-attribution timeline is the honesty payoff of the brand brief working as intended — it's specific, dated, sourced ("Discovering LA (2020) and Eat the World LA (2021) coverage") in a way Khufu's manufactured "Chapter Two: The Threshold" copy is not trying to be. This is the site's strongest brand differentiator and it's executed cleanly with no layout issues found.
- **Contact hero (composite 06):** "You will smell the *charcoal* before you see us." against Khufu's minimal dune background is a fair fight — the italic Fraunces moment and the warm arch-framed market photo carry it.
- **Palette discipline:** grepped `tokens.css` — saffron gold, price red (`--red` family), and crocus purple (`--crocus` family, explicitly commented "ornament, eyebrow accents") are cleanly separated token families; no bleed of purple into price text or red into ornament found in the six-page sweep, aside from the C2 placement bug (color usage itself is correct, only its position is wrong).
- **Zero em dashes:** grepped all six HTML files for U+2014, zero hits.
- **Logo usage:** nav uses the transparent emblem + wordmark pairing (`index.html:78-79`), footer uses the full emblem at larger scale with alt text "Saffron and Rice emblem" (`index.html:442`) — matches the brand brief's prescribed hierarchy.

---

## TOP FIXES, RANKED

1. **C1** — Reserve intrinsic size for `.footer__wordmark img`, reduce its `translateY` push, re-verify against `.footer__bar`'s rect on every page (footer markup is shared, so this is a one-shot sitewide fix). Highest priority: the address and legal name are unreadable on every single page's footer right now.
2. **C2** — Reposition `.home-trio .fc-petal-1` off the text column at `assets/css/pages/home.css:171`. Trivial fix, currently breaks a sentence on the homepage's second fold.
3. **M1** — Add clearance between the Catering pin release and `#platters` section start (`assets/css/pages/catering.css:46` / `catering.html:167`) so tier numerals and platter-stat numerals never share a viewport row.
4. **N1** — Swap `PLACEHOLDER_ORIGIN` for the real domain in JSON-LD before launch.
5. **N2 / N3** — Confirm the mobile black gap is intentional; tighten the menu's squiggle-underline stroke to match the rest of the ornament set.
