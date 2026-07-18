# PHOTO-MAP — Saffron and Rice stock photo set

> **Precedence note:** Real photos of the actual business in `research/business/assets/` take
> precedence at integration time. This map is the gap-filler set — each slot swaps in one line
> (replace the filename referenced by the slot; keep the slot name stable in the codebase).

All photos sourced from Pexels under the **Pexels license** (free for commercial use, no
attribution required, no permission needed). Every file was downloaded at ~2000px width,
verified as a real JPEG, and visually inspected. Direct CDN pattern used:
`https://images.pexels.com/photos/{id}/pexels-photo-{id}.jpeg?auto=compress&cs=tinysrgb&w=2000`.

| Slot | Filename | Dimensions | Source page | Photographer | License | Description |
|------|----------|------------|-------------|--------------|---------|-------------|
| home-hero | home-hero.jpg | 2000x3000 | https://www.pexels.com/photo/delicious-restaurant-meal-with-meat-17794709/ | Abolfazl Zarghami | Pexels license | Koobideh + joojeh (chicken) kabab on a white plate, saffron rice behind, shallow depth of field through green foreground blur — authentic Persian restaurant plate, dramatic vertical. |
| home-story | home-story.jpg | 2000x1333 | https://www.pexels.com/photo/red-saffron-spice-on-brown-wooden-spoon-10487658/ | Victoria Bowers | Pexels license | Macro of deep-red saffron threads piled on a wooden spoon against a dark moody slate background. |
| home-menu-teaser | home-menu-teaser.jpg | 2000x2667 | https://www.pexels.com/photo/authentic-middle-eastern-grilled-kebab-meal-31151727/ | Sinarz97 | Pexels license | Overhead spread of Persian kabab platters, whole golden tahdig/tahchin rounds, and stew on hammered silver trays. |
| menu-hero | menu-hero.jpg | 2000x1333 | https://www.pexels.com/photo/a-table-with-food-on-it-and-a-bowl-of-soup-16133045/ | Shameel Mukkath | Pexels license | Persian feast table: zereshk polo with barberries, green herb stew, sabzi khordan, shirazi salad, tea and lanterns on a patterned red cloth. |
| menu-appetizers | menu-appetizers.jpg | 2000x3000 | https://www.pexels.com/photo/a-top-view-of-delicious-food-on-plates-6419572/ | Polina Tankilevitch | Pexels license | Top view of hummus with paprika, a second creamy dip, grilled bread and pita bowls on white tile — clean mezze composition. |
| menu-kabab | menu-kabab.jpg | 2000x3555 | https://www.pexels.com/photo/juicy-kebabs-grilling-over-smoky-charcoal-fire-36890236/ | Mohamed9380 | Pexels license | Three koobideh-style ground-meat skewers over glowing red charcoal with rising smoke — dramatic grill shot. |
| menu-stew | menu-stew.jpg | 2000x3000 | https://www.pexels.com/photo/traditional-persian-meal-with-colorful-rice-37941013/ | Golboo | Pexels license | Overhead of a ghormeh-sabzi-style green herb stew with beans in a glass bowl beside a saffron-and-berry decorated rice platter and mast-o-khiar. |
| menu-rice | menu-rice.jpg | 2000x3000 | https://www.pexels.com/photo/delicious-persian-tahchin-with-garnish-33166886/ | Golboo | Pexels license | Golden saffron tahchin dome (crispy rice cake) crowned with zereshk barberries on an elegant table setting. |
| catering-hero | catering-hero.jpg | 2000x2667 | https://www.pexels.com/photo/top-view-of-people-enjoy-meal-14399248/ | Ayse | Pexels license | Overhead marble table with many hands reaching into shared plates of hummus, falafel, wraps and salads — communal party-table energy. |
| catering-platters | catering-platters.jpg | 2000x2384 | https://www.pexels.com/photo/middle-eastern-feast-with-halal-cuisine-in-vancouver-30119029/ | Saba Foods | Pexels license | Feast-for-a-crowd platter: braised lamb shank over saffron-yellow rice ringed by shakshuka, grilled meats, dips and flatbreads. |
| about-hero | about-hero.jpg | 2000x1333 | https://www.pexels.com/photo/spice-stand-at-the-marketplace-19227962/ | AXP Photography | Pexels license | Bazaar spice stand with vivid pyramids of sumac, turmeric, barberries, rock sugar and chickpeas under a patterned canopy. |
| kitchen-people | kitchen-people.jpg | 1067x1600 | https://www.pexels.com/photo/20488508/ | Gül Işık | Pexels license | Overhead shot of several hands reaching across a shared table of dates, walnuts, olives, and dips, mid motion, no faces, no branding. Saved at 1600px max side, quality ~74, warm grade applied (brightness 0.94, +saturation, warmer channel balance) to match the set's amber mood. |
| about-kitchen | about-kitchen.jpg | 2000x1433 | https://www.pexels.com/photo/chef-grilling-kebabs-in-gaziantep-restaurant-37028501/ | Hasan Huseyin Turan | Pexels license | Chef in apron working skewers with tongs over a long smoking charcoal kabab grill in a restaurant kitchen. |
| contact-hero | contact-hero.jpg | 2000x1333 | https://www.pexels.com/photo/interior-of-restaurant-14590691/ | Jonathan Borba | Pexels license | Warm amber-lit restaurant interior with wood ceilings, round tables and cozy evening glow — generic but inviting. |
| texture-1 | texture-1.jpg | 2000x3000 | https://www.pexels.com/photo/black-cloth-in-close-up-photography-7641148/ | Eva Bronzini | Pexels license | Near-black woven fabric close-up with soft folds and subtle green-tinged sheen — dark moody background texture. |
| texture-2 | texture-2.jpg | 2000x1500 | https://www.pexels.com/photo/close-up-photo-of-a-beige-painted-concrete-wall-12998745/ | Sora Noao | Pexels license | Cream/blush aged plaster wall with fine cracks and trowel texture — light background texture. |

## Flags / caveats

- **BM-R2-6 (round 2 fix pass)**: added a 16th slot, kitchen-people.jpg, sourced fresh from
  Pexels (candidates screened against "restaurant counter service", "kebab shop staff", "middle
  eastern restaurant people", and "chef serving customers" searches; most hits were either
  posed/looking-at-camera stock shots, a food-truck shot with a legible sticker logo, or too
  dark/nightlife-toned for the set). Photo 20488508 (Gül Işık) cleared every bar: candid hands
  mid motion, no faces, no branding, and warm enough after grading to sit with the rest of the
  set. It replaces home-menu-teaser.jpg as the ground for index.html's #sofreh pull-quote band
  ONLY; home-menu-teaser.jpg is untouched and still used wherever else it was already placed.
- **All 15 (now 16) slots sourced from Pexels** (Pexels license: free commercial use, no
  attribution required). No Unsplash images were used — Pexels search yielded stronger authentic
  Persian subjects and its CDN was directly reachable from this environment.
- **menu-rice**: first candidate (Pexels 37991957, zereshk polo) was rejected during visual QA
  because a Red Bull can was visible in the background; replaced with the tahchin shot above.
  The chosen shot has a blurred stemmed glass of a red drink (reads as pomegranate/sour-cherry
  sharbat) in the background — acceptable, but crop upper-third if it reads as wine.
- **menu-stew**: authentic home-style ghormeh sabzi (overhead, glass bowl, serving spoons) —
  genuine but slightly homey rather than studio-styled; best cropped tight on the stew bowl.
- **about-kitchen**: partial Turkish restaurant signage visible in the top-left corner; safe to
  crop out (subject is center-right).
- **home-menu-teaser**: shows a multi-platter kabab + tahdig spread rather than a single kabab
  platter — chosen deliberately because it is more appetizing and more distinctly Persian than
  the single-platter candidates.
- **contact-hero**: generic warm wood interior (not the actual Torrance location, and not
  Persian-decorated). Replace with a real storefront/interior photo from
  `research/business/assets/` if one exists.
- Verticals (home-hero, menu-kabab, menu-stew, menu-appetizers, menu-rice, texture-1) are
  portrait orientation — for wide hero crops use CSS `object-fit: cover` with a center or
  upper-center focal point.
