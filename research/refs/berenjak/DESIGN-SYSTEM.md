# Berenjak — Design System & Authenticity Reference (R2d)

**Site:** https://berenjak.com — Tehran-style kababi, Michelin Bib Gourmand (Soho since 2019, Dubai 2024), JKS Restaurants, founder Kian Samyani. Website design: Everything In Between, London (footer credit, links to e-i-b.com). Interiors: North End Design.

## Access status (read first)

The live site sits behind a **Vercel Security Checkpoint** bot wall. It was **NOT cleared**: browser capture (6 reload attempts, 14s settles), curl (HTTP 429), and WebFetch (HTTP 403) all got the checkpoint. This document was instead **reconstructed from primary sources that bypass the wall**:

- **Wayback Machine** (Aug–Sep 2025 snapshots): full server-rendered HTML of home, /story/, /food-and-drink/, /locations/soho/, menus pages, /groups-and-events/, and the "Berenjak is coming to Los Angeles" news page — complete copy, DOM structure, headings, class names, and the Sanity CMS data payloads. Saved under `pages/` and `home/`.
- **Sanity CDN (cdn.sanity.io, project th1xvac1)** — publicly reachable: the actual **menu PDFs** (typeset brand artifacts, saved in `menus/`) and **10 photographs** (food, interiors, facade; saved in `photos/`).
- The site's compiled CSS/JS chunks were never archived, so **web font names, exact hex values, and rendered web layout are NOT verifiable**. Everything below is tagged **[OBSERVED]** (verified in HTML/PDF/photo) or **[INFERRED]**.

Caution: an early screenshot showed the lion logo in bright blue — that was the **browser default link color on an unstyled page**, not a brand color. Do not use blue on this evidence.

---

## 1. Brand voice — how Berenjak writes [OBSERVED, quoted verbatim]

Positioning line (meta description): *"Berenjak is a Micheline Bib Gourmand winning Persian kababi shaped by founder Kian Samyani's childhood memories and family recipes. The menu reflects simple, authentic flavours reimagined for today."*

- H1s are short and categorical: **"A Persian Kababi"**, **"Our Classics"**, **"The Journey"**, **"Groups and Events"**.
- Signature taglines: *"Inspired by Tradition, Reimagined for Today."* / *"From our family, to yours"* / *"Four countries, seven cities, One Global Kababi"*.
- Menu-page framing copy: *"Our menu is centred around charcoal grilled kababs, which form the centrepiece of any Berenjak meal. Add some mazeh, breads, and khoresht (stews), and you're feasting."*
- Founder quote used as a pull-quote: *"Berenjak is much more than just a restaurant. It's family and culture, past, present, and future." — Kian Samyani, Founder*
- Each location gets a poetic **epithet**: Soho = *"The Tehran hole-in-the-wall"*; Borough = *"The townhouse of the Alborz Mountains"* — printed on the menus and used as the location page H2.
- Dictionary-entry brand module: **"Be · ren · jak"** with IPA */ˌbɛrɛnˈdʒæk/* and the naming story (the toasted-rice snack made by Kian's "khaleh" — aunt — Khaleh Nahid).
- Story page is a year-by-year timeline (2018 → "Tomorrow"), each year themed: *"the Year of REFINEMENT AND RECOGNITION"*, *"the Year of KABAB KITS"*. Voice is first-person-plural, warm, self-deprecating, concrete: *"we weren't (and still aren't) without our critics"*, *"hounding hundreds of local suppliers for cold pressed rapeseed oil"*, *"packing enough boxes to fill our restaurants with cardboard a hundred times over"*.

**Voice formula:** family memory + specific place/date + humble confidence + zero exoticism clichés. Persian words are used unitalicized and matter-of-factly, with a short appositive gloss on first use ("khoresht (stews)", "musir — wild Persian shallots").

## 2. Dish naming conventions [OBSERVED]

- **Persian transliterated name is the dish name**; English never replaces it: Koobideh Kabab, Jujeh Kabab, Mast O Musir, Kashk E Bademjoon, Ghormeh Sabzi, Mirza Ghasemi, Taftoon, Sangak, Sofreh, Noon O Mazeh.
- Transliteration style: informal-phonetic, capitalized every word, "O" for the ezafe/"and" (Mast O Khiar), "E" for ezafe (Kashk E Bademjoon, Baal E Morgh). No diacritics, no academic romanization.
- On the Food & Drink page each dish title is paired with **Persian script** beneath it (CMS field `titleArabic`): "Koobideh Kabab / كباب کوبیده", "Jujeh Kabab / جوجه کباب", "Chaee / چای". Cocktails (Watermelon Shumpine, Preserved Lemon Margarita) get no script — script is reserved for genuinely Persian items.
- Menu descriptions are **ingredient litanies, not adjectives**: "Minced lamb shoulder, onions and black pepper" (Koobideh 21); "Boneless chicken breast marinated in saffron, lemon, yoghurt and tomato" (Jujeh 22); "Saffron rice, salted butter, crispy rice (add zereshk £2.5)" (House Rice 7). Provenance names appear where real ("St Ewes Farm eggs", "Salkini olives", "Bulgarian white cheese").
- The dish-encyclopedia module adds two more layers per dish: a **history/anecdote label** ("Once baked for soldiers — 'sangak' means 'little stone'… dating back to the Safavid era"; the Gilan tea-plantation story for Chaee) and a **region tag** ("All over the country"). Structure per dish: Description / Ingredients / [prev–next] Dishes.
- Playful bilingual coinage is allowed for drinks: **"Watermelon Shumpine"** — "Named after the Iranian pronunciation of Champagne".

## 3. Menu structure for a kababi [OBSERVED — from typeset PDFs]

Section order on the a la carte: **Aperitif** (2 cocktails + Zeytoon/Ajil snacks) → **Noon O Mazeh** (breads: Taftoon, Sangak; dips/mazeh: Mast O Musir, Mast O Khiar, Hummus, Mirza Ghasemi, Panir Sabzi, Kashk E Bademjoon, Black Truffle Olivieh, Baal E Morgh) → **Kababs** (Jigar, Koobideh, Jujeh, Jujeh Tond, Barreh Tond, Chenjeh; £19–45) → **Sofreh** (sides: Balal, Sibzamini, Shirazi, House Rice, Khiarshoor, Torshi Haftebijar, Torshi Phel Phel; £4–8) → **Khoresht** (stews: Ghaimeh Bademjoon, Ghormeh Sabzi, Ghalieh Mahi) → brand-story box. Menu tabs on site: A la carte / Set menus / Drinks / Wine, delivered as PDFs.

Naming the sides section **"Sofreh"** (the family table-spread cloth) is a strong cultural move; prices are bare numerals, no currency symbols.

## 4. Verified visual language

**Logo system [OBSERVED]:** two marks — (a) custom **BERENJAK logotype**, quirky semi-serif caps with a distinctive conjoined JA/descending-hook "J" (on menus, facade); (b) **Qajar lion-and-sun** (shir-o-khorshid: lion with scimitar, rising sun, crown) as the secondary crest, printed small at menu top-right. Header carries both a compact icon and a full wordmark SVG (`Header_darkBackgroundIcon` / `lightBackgroundIcon` variants).

**Menu print design [OBSERVED]:** single-color black on white/cream; letterpress-newspaper composition — hairline ruled boxes, multi-column; section heads and dish names in **letterspaced all-caps serif**; descriptions in small roman/italic serif; **woven geometric Persian-textile ornament strips** as section dividers. Embedded font in the Borough PDF: **"Triptych"** [OBSERVED] (a revivalist jobbing-press serif; foundry attribution David Jonathan Ross **[INFERRED]**).

**Web typography [OBSERVED structure, faces unknown]:** utility classes `t-h1`, `t-h2`, `t-body-mid`, plus `t-uc` (uppercase) and `t-uc-slight` — an uppercase-tracking system consistent with the menus. Line-broken editorial headings ("The Tehran / hole–in–the–wall") with en-dashes. Web font files were not archived — **do not claim a specific web typeface**.

**Color [OBSERVED as named CMS themes]:** Sanity per-section theme names: **burgundy, forest, indigo, moss, salt, umber** (+ inherit). Exact hex values lost with the CSS. Photographic evidence matches: oxblood/burgundy painted facade with cream logotype (Borough), sage-green plaster + oxblood ceiling with gold stencil border inside, dark woods, aged brass/pewter. **[INFERRED]** working palette: deep burgundy #6E1F26-ish, forest/moss greens, warm cream, umber brown, with saffron accents from food.

**Photography & food styling [OBSERVED from 10 downloaded photos]:**
- Documentary kitchen reportage: koobideh held on a long flat skewer over live coals at the mangal, hands and motion in frame, smoke, near-black background.
- Finishing gestures: microplane snowing cheese/walnut over hummus on a **beaded pewter/silver bazaar plate**, shallow depth of field, steel counter.
- Plating props: hammered and beaded silver/pewter bowls and trays (Persian bazaar metalware), khoresht + saffron rice with tahdig served in lidded pewter pots, torshi in tiny matching bowls; surfaces of **green marble, aged wood, grey marble**; window-light chiaroscuro, deep shadows, warm highlights.
- Color pops come from the food itself: saffron-yellow oil, rose-pink pickled shallots on white mast, herbs.
- Interiors: Qajar-portrait paintings in gilt frames, paisley/termeh upholstery, lattice fretwork arches, candles and string lights. No flat-lay, no bright white studio shots, no stock-styled "Middle Eastern spread from above".

## 5. Site architecture & UX patterns [OBSERVED]

- Nav: **Story / Food & Drink / Locations** + persistent **Book now**. Footer: About (Food & Drink, Story, News, Events, Careers) / Links (FAQs, Delivery, Instagram, Privacy) / locations grouped by country (UK, Emirates, Qatar, Soho House), © JKS Restaurants, design credit.
- Home: full-bleed hero ("A Persian Kababi") → intro ("From our family / To yours") → locations index grouped by country with region H2s and location-card arrows → newsletter.
- Location pages: "Est. 2018" chip, H1 place name, epithet H2, address in small caps, Menus + Book buttons, "Scroll down to explore" cue, events cross-sell, pronunciation/dictionary module.
- Food & Drink page = **editorial dish encyclopedia** with prev/next dish navigation ("Previous Dish: *Koobideh Kabab*"), per-dish color theme from the named palette, bilingual titles, history labels. This, not a price list, is the brand's food page; prices live in the PDF menus.
- Tech notes: Next.js App Router + Sanity CMS; blurred LQIP image placeholders; arrows as inline SVGs; CSS-module class naming (`Hero_hero__`, `Dishes_titleArabic__`).

## 6. Authentic vs costume — the cultural cues that matter

What makes Berenjak read authentic (all grounded in observed practice):
1. **Persian-first naming** with casual transliteration and real script as a typographic layer — never "Chicken Skewers (Jujeh)".
2. **Specificity over atmosphere**: named people (Khaleh Nahid, Shwan Baban), named places (Romilly St, Gilan, Alborz, Caspian), named eras (Safavid, Qajar, Pahlavi), named equipment (mangal, tanoor, samovar).
3. **Family memoir as brand story**, told plainly with dates and addresses — not "ancient land of spices" mythologizing.
4. Cultural terms carried into UX labels: Sofreh, Noon O Mazeh, Khoresht as section names with one-word glosses.
5. Ornament used sparingly and structurally (menu divider strips, stencil borders, fretwork) — not as wallpaper; the lion-and-sun used like a crest, small.
6. Confident modern crossovers (Black Truffle Olivieh, Preserved Lemon Margarita, "Shumpine") that show a living cuisine, not a museum.
Costume tells to avoid: mosque-dome/arabesque clip-art, "1001 Nights" fonts (faux-Arabic Latin letterforms), italicized/apologetic foreign words, camels/genie lamps, generic "exotic Middle East" adjectives ("mystical", "oriental").

## 7. What to steal for Saffron and Rice (Torrance deli & catering)

- Persian-first dish names + ingredient-litany descriptions + optional Persian script line; bare-numeral prices.
- Menu sections in the kababi grammar: Noon o Mazeh / Kababs / Khoresht / Sofreh (+ deli case & catering trays as our own additions).
- A short "From our family to yours" naming/founder story block, and a location epithet ("The PCH corner kitchen" style — ours to write).
- One-color letterpress menu aesthetic with a geometric textile divider; letterspaced-caps headings paired with quiet serif body.
- Named earth-tone palette (burgundy/moss/umber/salt) with saffron as the accent that only food photography supplies.
- Dark, warm, hands-in-frame photography direction; metal serveware props.

## 8. Asset inventory (this folder)

- `DESIGN-SYSTEM.md` — this file
- `home/` — rendered homepage DOM (`page.html`), `tokens.json` (content structure; style values are browser defaults — ignore), screenshots (unstyled render; logo shots only), `styles.css` (Wayback chrome only — ignore)
- `pages/` — raw archived HTML: story, food-and-drink, soho, soho-menus, borough-menus, groups, la-news (+ `borough-menus.txt`)
- `menus/` — 4 menu PDFs from Sanity CDN (053f… = Soho a la carte, ae35… = Borough a la carte dinner; two more are 0-page/preview PDFs)
- `photos/` — 10 JPGs: Borough facade, Borough interior, DUMBO interior, Doha terrace, koobideh-at-mangal, hummus finishing, khoresht + rice pewter set, mast o musir on pewter, + 2 more
- `attempts/` — bot-wall attempt evidence (checkpoint HTML/screenshots)

Berenjak LA context [OBSERVED]: opened in the Arts District's Soho Warehouse (Sept 2025, members-only Soho House site; news page + press). Berenjak is now the closest high-authority Persian brand comparison in Saffron and Rice's own metro.
