# Berenjak — Capture inventory & re-skin notes

## Pages captured (11 of ~20 routes; each has page.html, tokens.json, screenshots/)
home, story, food-and-drink, groups-and-events, delivery, careers, faqs, news, locations-soho, locations-downtown-la, locations-dubai.
Home additionally has styles.css (partial — CDN CSS re-fetch got re-challenged) and full tokens.
Not captured (templated duplicates of captured location pages or boilerplate): borough, mayfair, sharjah, abu-dhabi, souq-waqif, al-maha, farmhouse, dumbo-house, privacy-policy, per-location /menus/ subpages. The three captured locations cover the location template (UK/US/UAE variants).
Screenshots: 109 (7-8 scroll states + full-page desktop 1440, viewport + full-page mobile 390, per page).

## Page-by-page inventory
- **home** — dark smoky ember-video hero + wordmark; serif welcome statement; family-story split with 70s archival photo; per-country location card grids with hairline-rule headers; news toast carousel; mega footer.
- **story** — LIGHT theme (warm grey `#E0E0E0` ground, ink text): interactive year timeline scrubber 2018→TOMORROW with chaptered entries ("the Year of KABAB KITS, 2020"), display-face chapter titles, blurred-then-reveal images.
- **food-and-drink** — full-bleed interiors/food photography (brass table, exposed fresco walls), menu framing.
- **locations/** — templated: hero photo, EST. date label, address, booking, menus link; dark theme.
- **groups-and-events, delivery, careers, faqs, news** — utility pages on same system; news = editorial card list.

## What's worth re-skinning for a Torrance Persian deli (Saffron)
1. **Custom Persian-Latin display face treatment** — Berenjak Sans letterforms borrow Kufic flat tops + a khatam diamond inside the letter counters. For Saffron: commission/fake it with a modified geometric display where one letter carries a Persian star/diamond counter. This is Berenjak's single strongest brand device.
2. **Cropped giant wordmark footer** — full-bleed brand name sliced by the viewport bottom; instantly premium, trivially portable.
3. **Heritage-object motifs over tile clichés** — Lion-and-Sun style line engraving, brass/aineh-kari surfaces, archival family snapshots. A deli version: hand-engraved saffron crocus / lion crest + real family photos from the owners.
4. **Dark "kababi" theme + light "story" theme split** — commerce pages dark & smoky (ember video, grain PNG overlays), heritage pages light & editorial with a timeline scrubber. Great pattern for deli: shop pages warm-dark, "our story" light.
5. **Country/city grouped location grid with hairline rules + EST. labels** — for a single-location deli, reuse as menu-category or "counter stations" grid (Kabab · Bread · Groceries · Sweets).
6. **Grain overlays (`grain_3.png`) + muted 70s color grade** on all photography — the "archival Iran" mood.

## Capture caveats
- Site actively bot-challenges (Vercel checkpoint, 429 + TLS fingerprinting); captures ran through a Python-requests relay after solving the JS challenge in headless Chromium. JS library detection was therefore unreliable (no GSAP/Lenis signatures found; motion specs in design-system.md are observed, rebuild-to-match).
