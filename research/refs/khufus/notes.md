# KHUFU'S — Page inventory & signature moments

Captured 2026-07-18 at 1440 (desktop) and 390 (mobile), full-page + 12-step scroll sequences + interaction states. Note: `desktop_1440_viewport/full` and `mobile_390_*` on some pages show the intro overlay (it fires per-path); use `clean_desktop_1440_*` / `clean_mobile_390_*` for intro-free shots. Scroll-sequence shots are intro-free.

## Page inventory (8 pages, from sitemap.xml)

| Dir | URL | What it is |
|---|---|---|
| home | / | Hero video (pyramids/camel mp4) + 7 numbered chapters: why-panels trio, awards band, polaroid slider, chef/founder story, day-to-night scroll CTA, final invitation |
| menu | /menu/ | Dark cocoa bg with hieroglyph frieze; "Current Selection" featured-dish spotlight (dish name in giant serif, category chips, VIEW MORE); menu browser below |
| experience | /experience/ | Chaptered editorial: "THE VIEW" ghost-word bands, numbered expanding image columns (01/02/03), dark overlay cards with slash-separated keyword meta (STILLNESS / AWARENESS / PRESENCE / SCALE) |
| reservations | /reservations/ | FouRez booking widget (3-step: Your Details / Booking / Review) embedded in white card on dark brown + hieroglyph frieze; 2-col serif FAQ accordion (+/− toggles, hairline dividers) |
| about | /about/ | Story/heritage editorial |
| gallery | /gallery/ | Photo collections (polaroid/tilted collage language) |
| legacy | /legacy/ | "THE LEGACY" — founder/team page; full-bleed kitchen photo hero, 3-line serif headline w/ script sub-line crossing the baseline, "SCROLL TO DISCOVER" affordance, giant ghost "LEGACY" word |
| contact | /contact/ | Contact/plan-your-visit |

Interaction-state shots (home/screenshots/): `state_desktop_reserve_dropdown_open`, `state_desktop_nav_hover`, `state_desktop_whybtn_hover`, `state_desktop_polaroid_slide2`, `state_desktop_intro_overlay(_line2)`, `state_mobile_top`.

## Signature moments worth re-skinning (ranked)

1. **Poetic intro overlay** — solid warm-brown full-screen, 4 lines typed word-by-word (90ms stagger, 3.6s hold/line, 450ms exit), lead words brighter, pill "Skip Intro". Once per session per path. Sets the whole tone before any UI exists.
2. **Day-to-night scroll CTA** (`#khCtaReveal`) — 240vh sticky section where background lerps white → espresso #1E120C and text inverts as you scroll (rAF smoothing 0.10), narrating "the experience evolves with the light". The single most memorable mechanic.
3. **Masked hero line reveal** — overflow-hidden lines rising from 115% with 0.9° rotation, 820ms `cubic-bezier(0.18,1,0.25,1)`, gated on the display font loading; italic serif emphasis words inside roman caps.
4. **Chapter system** — numbered 01–07 kickers + giant ghost numerals/words (THE VIEW, LEGACY) at ~10% opacity behind headings; kicker (tracked caps 12px) → serif display → handwritten script sub-line stack on every section.
5. **Hieroglyph line-art layer** — pale single-stroke Egyptian friezes/lotus columns drawn across dark sections at low opacity (menu, reservations, footer edges); pylon-arch image masks (border-radius 120px 120px 0 0).
6. Runner-ups: polaroid fan slider with numbered index buttons; parallax why-panels drifting in opposite directions (dead-zone smoothstep, ±220px max); underline-retract hover on text CTAs; two-line stacked wordmark with bird glyphs + vertical rule dropping into hero.

## Re-skin gotchas
- Astra/Elementor default slate/blue-gray text (#67768E) is theme residue, not brand — don't carry it over.
- All motion is hand-rolled rAF/IO/CSS keyframes (no GSAP/Lenis despite the awwwards look); easings and constants are in design-system.md §5.
- Intro overlay per-page-path can double-fire in captures — anything automated must set the sessionStorage key or click #khfSkip.
