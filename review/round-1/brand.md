# Brand Lens — Round 1 — Saffron and Rice

**Score: 7.2 / 10**

## Summary

The design system itself is disciplined and honest: the real owner-derived logo marks (emblem,
full lockup, wordmark SVG) are used correctly and at dignified sizes with no permanent visual
squashing anywhere I could find; the saffron gold / pomegranate / crocus / teal palette traces
cleanly to `tokens.css` with zero rogue rendered colors across all six pages; the four-font type
system (Cormorant Garamond / Manrope / IBM Plex Mono / Gulzar) is applied with total consistency
on every page; all six heroes are genuinely distinct and match their DESIGN-BRIEF signatures; the
halal story is present verbatim in three separate places (menu credential panel, catering panel,
about pledge) and exceeds the brief's minimum; there are no em dashes in any shipped file; reviews
and hours match `data.js`/`BUSINESS.md` exactly.

Against that strong baseline, three concrete, verifiable defects sit right in this lens's
crosshairs: the Persian-script "translit" annotation pattern is broken on three of six menu
chapter headers (it shows unrelated English captions instead of the actual transliteration,
directly contradicting the correct pattern used everywhere else on the site, e.g. about.html);
one unsourced, unflagged factual claim ("New Zealand, grass-fed, halal.") was invented for the
Lamb Shank item with no basis in the printed menu, `BUSINESS.md`, or `DELIVERY-NOTES.md`; and the
footer's full-lockup `<img>` ships wrong `width`/`height` attributes that declare an aspect ratio
40% off the real asset, which the CSS silently self-heals after load but which reserves the wrong
layout box and will visibly jump on slower connections. None of these are gate-blocking on their
own, but they are exactly the kind of thing this lens exists to catch, hence the mid-7s score
rather than a round-1-flatters-itself 9.

## Findings

| ID | Severity | Location | Finding | Fix |
|---|---|---|---|---|
| BR-1 | MAJOR | `assets/js/page-menu.js:78-81` (`headHtml`), rendered on `menu.html` chapter headers for `id="kababs"`, `id="stews"`, `id="sandwiches"` | The Persian-script chapter eyebrow (`.script-fa`) is paired with a `.translit` span that is supposed to carry "Latin transliteration always present" (DESIGN-BRIEF, Berenjak rule). Instead the code renders `sec.note` into that slot, which is an unrelated English caption, not a transliteration: کباب ("kabab") is captioned "Served off the flame.", خورش ("khoresh"/stew) is captioned "The second price is the vegetarian version.", ساندویچ ("sandwich") is captioned "Wrap or soft baguette." A reader who knows the word sees Latin text next to it that does not say what the word says. This directly contradicts the site's own correct pattern used everywhere else — e.g. about.html: زعفران → "Za'faran", آتش → "Atash", خانواده → "Khanevadeh", and the header's own زعفران و برنج → "Za'faran o berenj, saffron and rice" — so it reads as a genuine bug, not a style choice. Confirmed live via DOM evaluation of the rendered `.script-line` pairs on `menu.html`. | Give each menu section object in `data.js` a real `translit` field (e.g. kababs: "Kabab", stews: "Khoresh", sandwiches: "Sandwich") and render that in the `.translit` span; move the current caption text (serving note, veg-pricing note, bread note) into the existing `chapter__foot`/body copy where it already lives correctly elsewhere, not into the transliteration slot. Also add `fa`/translit to `appetizers`, `rice`, and `platters` sections, which currently show the Persian eyebrow with no Latin annotation at all. |
| BR-2 | MAJOR | `assets/js/data.js:134`, rendered on `menu.html` under "Lamb Shank with Baghali Polo" ($25.99) | The dish description reads "New Zealand, grass-fed, halal." This is a specific, falsifiable sourcing claim (country of origin + feed practice) that does not appear anywhere in the source material: the printed menu scan only lists "Lamb Shank with Baghali Polo" with no origin text (`research/business/BUSINESS.md` section 2), and it is not logged as an assumption in `DELIVERY-NOTES.md` the way the Dizzy price and hours were. It reads as invented, which the brief explicitly forbids ("no invented facts," "no superlatives that cannot be sourced"). | Remove "New Zealand" (and "grass-fed" unless it can be sourced) from the description, or replace with the verbatim printed-menu text ("Lamb shank, potato, beans" pattern used for Dizzy). If the owner confirms the sourcing later, log it as a confirmed fact in `DELIVERY-NOTES.md` the way other assumptions are tracked. |
| BR-3 | MAJOR | `assets/js/app.js:169` (`footer__seal` markup, all pages) | The footer's real full-lockup image ships as `<img src="assets/img/brand/logo-lockup.png" ... width="692" height="484">`. The actual intrinsic file is 800×910 (ratio 0.879, portrait) per `PIL.Image.open`, but the markup declares 692×484 (ratio 1.430, landscape) — a 63% ratio error. Browsers use these attributes to reserve layout space before the image decodes; measured live, the reserved box briefly renders at ratio 1.430 while `naturalWidth/Height` are still 0, then jumps to the correct 0.879 once the image finishes loading (confirmed via Playwright: `rendRatio` goes from 1.430 to 0.879 between first paint and post-load on index/about/contact). The final settled state is correct (CSS `width:100%;height:auto` self-heals it), so this is not a permanent visual squash, but it is a real, measurable metadata error on the real lockup mark and causes a layout shift right where the brand's signature seal sits. | Correct the `width`/`height` attributes to `800`/`910` (or drop them and add `aspect-ratio: 800/910` in CSS) so the reserved box matches the real asset from first paint. |
| BR-4 | MINOR | `assets/img/ornament/crocus-line.svg`, `assets/img/ornament/thread-flourish.svg` | Both dedicated ornament SVGs referenced in the brief's "ambient detailing: faint saffron-thread line ornaments" and the crocus color's "ornament only" mandate exist as clean, non-kitsch line art but are never referenced by any `.html`, `.css`, or `.js` file in the shipped site (`grep` for both filenames returns zero hits outside `assets/img/ornament/` itself). The `--crocus`/`--crocus-lite` tokens are likewise defined in `tokens.css` but never applied via `color`/`fill`/`background` anywhere in the stylesheets — crocus purple currently only reaches the page through the raster logo art (emblem/lockup), not through the live ornament system the brief describes. | Wire at least one of the two SVGs into an actual scene (e.g. the about.html day-to-night chapter, or as a divider on the halal panels) with `stroke: var(--crocus)` or `var(--crocus-lite)`, or remove the unused assets and token comment if the ornament system was intentionally cut. |
| BR-5 | MINOR | `menu.html` chapter headers for `id="appetizers"`, `id="rice"`, `id="platters"` | These three sections have a `script-fa` Persian eyebrow (پیش غذا, برنج, مهمانی) but no `sec.note`, so no Latin annotation renders at all next to them (confirmed via DOM query — `translit: null` for all three). Combined with BR-1, this means none of the six menu chapters currently shows a correct, honest transliteration: three show a wrong one, three show none. | Same fix as BR-1: add a real transliteration string per section in `data.js` so all six chapter headers carry consistent, accurate Latin annotations. |

## Checks run (with evidence)

- **Logo authenticity and sizing.** Read `assets/img/brand/emblem.png` (700×484), `logo-lockup.png`
  (800×910), `favicon-192.png`, `logo-text.svg` (viewBox 1034×496) directly with the Read tool;
  visually confirmed they are the real owner mark (script "S", crocus flower over a rice bowl,
  "PERSIAN • MIDDLE EASTERN KITCHEN" tagline, diamond-and-rule ornament) matching the description
  in `research/business/BUSINESS.md` §4. Grepped all six HTML pages for `brand/emblem`,
  `brand/logo`, `brand/favicon` and confirmed identical nav/favicon markup on every page. Grepped
  `app.js`/`page-*.js` to confirm nav uses `emblem.png`, loader uses `emblem.png` + `logo-text.svg`
  (stroke-draw, recolored via `currentColor` to `var(--paper)`, confirmed no rogue red/gold/ink
  bleed-through in loader screenshots), footer uses `logo-lockup.png` (full lockup).
- **Squash/aspect-ratio audit.** Wrote a Playwright script (`aspect.py`/`aspect2.py`) that reads
  `naturalWidth/naturalHeight` vs rendered `getBoundingClientRect()` for every nav/footer/loader
  brand `<img>` on all six pages. Nav emblem: rendered ratio 1.446 = intrinsic ratio 1.446 on
  every page, no squash. Loader emblem: `width="480" height="332"` = exact 1.446 match. Footer
  lockup: intrinsic 0.879, HTML attributes declare 1.430 (BR-3), final rendered ratio after load
  is correct at 0.879 on all six pages once scrolled into view and `complete: true`.
- **Favicon.** Confirmed `<link rel="icon">`/`apple-touch-icon` tags identical across all six
  pages via grep; confirmed `favicon.ico`, `favicon-32/48/192/512.png` exist and are visually the
  cropped emblem (read `favicon-192.png` directly).
- **Rogue-color probe.** Served the site locally on port 8133, ran a Playwright script that walks
  every DOM element on all six pages, reads computed `color`/`backgroundColor`/`borderColor`, and
  collected the full set of unique rendered values (58/53/57/53/53/34 unique declarations per
  page). Converted every `rgb()` value back to hex and matched all of them either exactly against
  a `tokens.css` swatch or against a `color-mix()` blend of two swatches at the ratio tokens.css
  itself specifies (e.g. `fg-soft` = ink 76%/paper 24% → rgb(71,68,64), verified by hand
  computation). Found zero unaccounted-for colors. Also grepped every `.html`/`.css`/`.js` file
  for literal hex codes outside `tokens.css`: the only hits were (a) hardcoded fallback defaults in
  `page-about.js`'s `hex()` helper that read the real CSS custom property at runtime and only fall
  back to the literal if the read fails — all four fallbacks exactly match their token, and (b) the
  native fill colors baked into `logo-text.svg` (#071115/#b4161a/#c79a43), which are neutralized by
  `.loader__mark path { fill: currentColor }` in `app.css:617` and never actually render — confirmed
  the loader wordmark renders monochrome paper-cream in screenshots, not multicolor.
- **Type consistency.** Playwright script sampling computed `fontFamily` on h1/h2/h3, `body`,
  `.eyebrow`, `.price`, `.script-fa`, `.mono` across all six pages. Cormorant Garamond on every
  heading, Manrope on body, IBM Plex Mono on eyebrows/prices/mono labels, Gulzar (with Cormorant
  fallback) on every script line, with zero exceptions on any page. Confirmed `assets/css/fonts.css`
  self-hosts all four families as local woff2 with no external requests (network-response probe
  across all six pages returned zero 4xx/5xx of any kind, including fonts).
- **Halal story.** Grepped `data.js` for the verbatim claims, then live-rendered all six pages and
  checked `document.body.innerText` for both exact strings. Both claims present verbatim on all
  six pages: full credential panel on `menu.html` (`aside.halal`, rendered by `page-menu.js`
  inside the Grill & Kababs section, "Word for word from our printed menu" sourcing line), full
  panel on `catering.html` (`on-teal` "Halal, in writing" chapter) and `about.html` ("The halal
  pledge" chapter), plus the beef line alone as a homepage CTA caption on `index.html`. All text
  matches `data.js` `company.halal.beef`/`chicken` exactly, no paraphrase drift.
- **Persian identity / no costume cliché.** Read `assets/img/ornament/*.svg` (clean line art, no
  arabesque/mashrabiya/genie-lamp motifs). Confirmed no faux-Arabic display typeface is used
  anywhere (type audit above: only the four declared families render). Checked every
  `script-fa`/`translit` pair site-wide via a DOM query across index.html and menu.html and found
  the pattern correct in 5 of 8 live instances and broken in 3 (BR-1, BR-5).
- **Distinct hero per page.** Read the full desktop screenshot and at least two scroll-sequence
  frames per page from `review/round-1/capture/<page>/screenshots/`. index: centered wordmark seal
  reveal on ink, then a kabab/saffron-thread hero. menu: pinned film-strip scrub compressing
  portrait dish photos into a carta panel. catering: three-photo arch triptych with "counted out,
  tray by tray" copy and 10/20/30-guest stat blocks. about: sticky ground darkening cream-to-ink
  across market/fire/family chapters with a hand-on-coals photo. contact: HUD-style mono
  coordinate/hours/services readout with a hand-drawn compass rose pointing down PCH. 404: scattered
  saffron-thread canvas with an arch-doorway "back to the kitchen" button. All six are genuinely
  distinct, matching their DESIGN-BRIEF signatures; no repeated template.
- **Voice / no invented facts.** Cross-checked homepage, about, and menu copy against
  `assets/js/data.js` and `research/business/BUSINESS.md`. Hours, address, phone, review quotes and
  attributions, "under new management"/2024 transition framing (sourced to the ~May 2024 Instagram
  post in `BUSINESS.md` §Transition), and the Dizzy $25.99 price (flagged assumption, correctly
  shown without a false-certainty tone) all check out. Found one unsourced claim (BR-2).
- **No em dashes.** Ran the exact required command from the working directory:
  `python3 -c "import pathlib,sys; [print(p) for p in pathlib.Path('.').rglob('*') if p.suffix in ('.html','.css','.js','.md') and 'research' not in str(p) and 'node_modules' not in str(p) and '—' in p.read_text(errors='ignore')]"`.
  Only hit: `review/round-1/codeperf.md` (another lens's review artifact, not a shipped site file,
  correctly out of scope per the instruction to file hits in shipped html/css/js). Zero hits in any
  of the six pages, any `assets/css/*.css`, or any `assets/js/*.js`. Also spot-checked
  `DESIGN-BRIEF.md`, `DELIVERY-NOTES.md`, `PROGRESS.md` directly (0 hits each) even though they are
  outside the strict scope.
- **Reduced motion / no-JS.** Rendered `index.html` with Playwright's `reduced_motion="reduce"`
  context and again with `java_script_enabled=False`. Both renders show the page fully resolved
  in a finished-looking resting state (hero text, imagery, CTAs, chapter numerals all in place,
  no mid-animation artifacts, no invisible/zero-opacity blocks). No-JS drops JS-only data
  (review quotes list stayed empty header-only under the "Neighbors talk" section) but that is a
  functionality-lens concern, not filed here.
- **Server/asset integrity.** Served the repo locally via `python3 -m http.server 8133` and ran a
  full six-page network-response sweep with Playwright; zero 4xx/5xx responses for any asset
  (images, fonts, JS, CSS) on any page.
