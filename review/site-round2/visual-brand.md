# Saffron & Rice — Full-Site Council, Round 2 (re-review after fixes)
## Lenses: VISUAL FIDELITY + BRAND
Date: 2026-07-18

Method: fresh Playwright screenshots (1440 + 390, viewport + scroll states, plus full-page captures with real incremental scrolling to trigger scroll-linked animations) of all six pages served from a clean `python3 -m http.server 8299` instance, driven with Chromium at `/opt/pw-browsers`. Rebuilt composites vs `research/refs/{khufus,laguna,tastavents,berenjak}` in `review/site-round2/composites/`. Every round-1 finding was independently re-measured live (`getBoundingClientRect`, `elementFromPoint`-style intersection checks) rather than trusted from the fixlogs — see verification section below.

---

## SCORES

| Lens | Score | Bar |
|---|---|---|
| Visual Fidelity | **9.6 / 10** | 9.5 |
| Brand | **9.5 / 10** | 9.5 |

**Both clear the bar. PASS.**

---

## VERIFICATION OF ROUND-1 FINDINGS

### C1 — Footer wordmark overlapping `.footer__bar` — FIXED, verified 12/12
Scrolled to bottom of all 6 pages at both 1440 and 390, `getBoundingClientRect()` on `.footer__wordmark` vs `.footer__bar`:

| Page | 1440 wordmark bottom → bar top | 390 wordmark bottom → bar top | Overlap |
|---|---|---|---|
| index.html | 841.9 → 841.9 | 727.6 → 727.6 | No |
| menu.html | 841.6 → 841.6 | 662.0 → 662.0 | No |
| catering.html | 842.1 → 842.1 | 662.4 → 662.4 | No |
| about.html | 841.7 → 841.7 | 727.6 → 727.6 | No |
| contact.html | 841.7 → 841.7 | 727.9 → 727.9 | No |
| 404.html | 842.3 → 842.3 | 728.3 → 728.3 | No |

Every page: wordmark's bottom edge lands exactly at the bar's top edge (touching, not intersecting) — the fix (bounded `max-height`, no more `translateY(18%)` overflow, intrinsic `width`/`height` on the SVG) reads as intentional now. Visual: `review/site-round2/shots/index_1440_footer.png`, `index_390_footer.png`. The "© 2026 Saffron and Rice, LLC" / address line is fully legible, clear of the wordmark's white "S" and pink "R" glyphs — composite `07_footer_vs_khufus.png` confirms it reads at Khufu's caliber.

### C2 — Purple crocus petal over "Hand-pressed" dish-card copy — FIXED, verified
Live bounding-box intersection test between all 4 `.home-trio` float ornaments and every `.dish-card h3`/`.dish-card p` at 1440 and 390: **zero overlaps**. The petal now sits in the section's top-left margin strip, well clear of the card grid — see `review/site-round2/shots/index_1440_trio.png` / composite `02_home_trio_vs_khufus.png`. "Hand-pressed skewers of beef or chicken" (and the "Koobideh, off the coals" card generally) reads clean with no ornament intrusion.

### M1 — Catering pin-out 10/20/30 vs platter-stat 1/2/3 collision — FIXED, verified
Scrolled 1440 viewport in 100px increments from 2200–3000px, running a bounding-box intersection check between `.tier__num` and `.pstat__num` at every step: **zero collisions across the full range**. Screenshots at 2600/2700/2800/2900/3000 (`review/site-round2/shots/catering_1440_scroll*.png`) show the tier board fully cleared before the platter cards with their "8/16/24," "4/8/12," "10/20/30(tomatoes)," "1/2/3(stews)" stat grid enter — no garbled numeral strings anywhere in the transition. The added `280vh` pin height + `#platters` top padding gives clean separation.

### N1 — PLACEHOLDER_ORIGIN in JSON-LD — left as-is per instructions (deploy-step owned), confirmed not leaking into rendered/visible text. Not a visual/brand defect; no action needed this round.

### N2 — Mobile home black gap after CTAs — FIXED, verified
Mobile full-page capture (settled, 3.5s), cropped to the CTA→next-section transition (`/tmp/mobile_cta_gap.png` region, y≈3800–5200 of a 9443px page): "See the full menu" / "Call" buttons flow directly into the next section with normal section-rhythm spacing — no dead black stretch. Measured `.dn-band` height dropped to ~281px as claimed in fixlog-B, matching the site's `--sect` rhythm.

### N3 — Menu squiggle underline too crude — FIXED, verified
`review/site-round2/shots/menu_1440_underline.png`: the "Party Platters" header underline is now a tighter, proportionate hand-drawn squiggle that reads consistent with the site's other thread-divider ornaments, not stretched/distorted. Composite `03_menu_underline_vs_tastavents.png` holds up fine next to Tastavents' editorial type treatment.

### Logo weight — confirmed down
Nav emblem renders crisp at 46×46 (now serving the re-exported `emblem-96.png`), footer emblem crisp at its slot — no softness/blur from upscaling a downsized JPEG artifact, matches fixlog-A's claim of the dedicated 96px/192px exports.

### Regression check
- Zero console/page errors across all 6 pages × 2 viewports.
- One capture-artifact caught and ruled out during this review, not a real bug: an early hero screenshot taken at a shallow 800ms settle caught the intro-loader's fading overlay text ("Threads of saffron, mountains of rice...") ghosted over the hero headline. Re-verified at a 3.5s settle (and via a full incremental scroll-through) — the hero renders perfectly clean, no residual text, no `[class*=intro]`/`[class*=loader]` elements left in a visible state. This is a screenshot-timing issue in this review's own tooling, not a site defect.
- Also ruled out: `about.html`/`catering.html` full-page screenshots taken with a single non-incremental scroll show large solid-black bands mid-page. Confirmed via a real incremental scroll-through (`/tmp/about_scrolled_full.png`) that these are GSAP ScrollTrigger-pinned sections that only paint their content once actually scrolled into view — a full-page-screenshot capture artifact common to scrollytelling patterns, not a rendering bug. No action needed.
- No new collisions, no new overlapping ornaments, no new contrast issues introduced by either fix track.

---

## COMPOSITES

1. `review/site-round2/composites/01_home_hero_vs_laguna_khufus.png` — home hero vs Laguna + Khufu's hero
2. `review/site-round2/composites/02_home_trio_vs_khufus.png` — home dish-card trio (post C2 fix) vs Khufu's "recognition" module
3. `review/site-round2/composites/03_menu_underline_vs_tastavents.png` — menu header/underline (post N3 fix) vs Tastavents editorial hero
4. `review/site-round2/composites/04_catering_platters_vs_tastavents.png` — catering platter cards (post M1 fix) vs Tastavents chef bios
5. `review/site-round2/composites/05_about_vs_khufus.png` — about timeline vs Khufu's story chapter
6. `review/site-round2/composites/06_contact_vs_khufus.png` — contact hero vs Khufu's dune hero
7. `review/site-round2/composites/07_footer_vs_khufus.png` — footer (post C1 fix), legible legal/address copy
8. `review/site-round2/composites/08_mobile_home_vs_laguna_khufus.png` — mobile home (post N2 fix) vs Laguna/Khufu's mobile

---

## WHAT'S WORKING (unchanged strengths, re-confirmed)

- Home hero copy ("Fire on the coals, gold in the rice, the *sofreh* is set.") still the standout line of the site, and now renders with zero overlay artifacts.
- About page's dated, sourced era-attribution timeline (2020–2021 Saffron Food Market → 2026 Saffron & Rice) remains the strongest brand differentiator on the site — specific and honest in a way the reference sites' manufactured "chapters" aren't.
- Palette discipline holds: no bleed of crocus purple into price/red, or vice versa, anywhere in the six-page sweep post-fix.
- Zero em dashes (re-grepped).
- Catering's numeral-heavy stat grid (8/16/24, 4/8/12, 10/20/30, 1/2/3 across three platter tiers) is inherently a lot of adjacent numerals in a tight layout — the fix gives it clean separation from the pinned tier board without the animation losing its rhythm.

---

## REMAINING OBSERVATIONS (non-blocking, do not affect PASS)

- N1 (PLACEHOLDER_ORIGIN) is still an open pre-launch checklist item — confirmed harmless to rendered pages, correctly deferred to the deploy step. Flagging again only so it doesn't get lost before go-live.
- No new critical or major findings surfaced in this pass. The site is at reference caliber on both lenses.

---

## VERDICT

**Visual Fidelity: 9.6/10 — PASS.** All three layout-collision bugs (footer wordmark, home petal, catering pin-out numerals) are verifiably fixed with live rect/intersection checks, not just visual spot-checks, across every page/viewport combination in scope. The composites hold up directly against Khufu's, Laguna, and Tastavents without qualification.

**Brand: 9.5/10 — PASS, at bar.** The differentiating brand material (dated provenance story, halal sourcing quotes, specific dish copy) is intact and unaffected by the fix passes; the two visual bugs that were dragging brand perception down in round 1 (petal-over-copy reading as sloppy, footer swallowing the legal/address line) are resolved, so the brand voice now reads through cleanly on every page. Sitting exactly at bar rather than comfortably above it — recommend keeping N1 on the pre-launch checklist as the one remaining professionalism gap, but it does not block PASS since it never surfaces in the rendered page.
