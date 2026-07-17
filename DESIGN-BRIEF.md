# DESIGN BRIEF, Saffron and Rice

Synthesized 2026-07-17 from research/refs/*/DESIGN-SYSTEM.md and research/business/BUSINESS.md.
Systems were extracted from the references; zero assets, fonts, copy, or exact palettes were taken.

## The one-line concept

A quiet, editorial Persian sofreh: chapters of warm cream and near-black, saffron gold used like
gilding, imagery held inside Persian arches, dish names spoken Persian-first, motion that settles
like steam rather than snaps.

## What each reference contributes (systems only)

- KHUFU'S (primary structure): numbered-chapter editorial storytelling. Each chapter shares one
  skeleton: ghost numeral at low opacity, mono micro-kicker, large display-serif title with an
  italic emphasis word, a script or Persian annotation, short body, hairline rule, footnote. One
  reveal grammar everywhere: opacity plus a 30 to 40px rise plus a small blur clearing, about 1s on
  cubic-bezier(.22,1,.36,1), 80 to 100ms staggers. Their signature day-to-night sticky color
  interpolation becomes our About page hero: the market-to-kitchen story told as a ground that
  darkens from cream to ink as you scroll. Hard edges everywhere, with a single heritage curve.
- Tastavents (menu and gallery blueprint): chapter intro (numeral eyebrow, big serif) leading into
  a pinned scrub where portrait dish photos compress into a film strip before a dark panel wipes
  in. We keep the staging but reject their PDF-only menu: our carta panel opens into a REAL
  itemized in-page menu with prices. Also stolen as systems: vertical marquee rails labeling
  ingredient photos in tracked caps, blur-up image pairs, letter-swap hovers, hairline progress
  loader.
- Laguna Al-Sha'ab (motion grammar): arch dome-curtain masks (border-radius 50% 50% 0 0) as the
  universal scene transition, scrub lag-depth ramps (0/.3/1/2 s) on drifting decorative objects,
  ghost words behind chapters, pinned multi-viewport sequences with percent-band choreography.
  Their failures become our floors: we honor prefers-reduced-motion, we set minimum font sizes,
  we ship no debug markers, and mobile keeps a designed (if calmer) motion pass.
- Berenjak (Persian authenticity): dish naming Persian-first with a Persian script line and
  ingredient-litany descriptions; menu grammar of a real kababi; warm dark documentary food
  styling; family voice ("from our kitchen") without theme-park ornament. Authentic-vs-costume
  rule: Persian script appears as small honest annotations, never as faux-Arabic display type.
- Lo'bat (Persian visual language from award work): calligraphy-as-mark confidence (our real
  lockup carries this), full-bleed alternating color bands, the arch mask as the recurring
  image primitive, hairline-growth preloader, mono UI voice against a script accent.

## Palette (sampled from the real lockup, not from any reference)

Ink #0f0d0c, paper cream #f7f1e6, saffron gold accent family #c08a28 / lite #e0b054 / deep
#7d5610, pomegranate #7c3034 (prices, phone, small rules), crocus #4c2f7d (ornament only),
bowl teal #324142 with deep stage #222d2e (alternate dark band). Two grounds plus one accent
family; pomegranate and crocus are brand tones, not accents, and stay sparing.

## Type

- Display: Cormorant Garamond 400/500/600 plus 500 italic. Light, high-contrast serif; caps
  slightly tracked; italic carries emphasis words inside titles.
- Body: Manrope 400/500/600/700.
- Mono: IBM Plex Mono 400/500 for eyebrows, indices, prices, HUD labels.
- Persian script: Gulzar (Nastaliq) for short authentic annotations with Latin transliteration
  always present. Decorative aria-hidden usage plus real dish-name lines.
All self-hosted woff2, OFL licensed, in assets/fonts.

## Form language

Hard edges (radius 0) everywhere except the arch, the single curved form: round dome arch for
image masks and scene transitions, pointed ogee arch clip for signature moments. Hairline rules,
ghost numerals, mono labels, generous negative space. Ambient detailing: faint saffron-thread
line ornaments, tiny accent ticks before eyebrows.

## Motion plan

Lenis smooth scroll plus GSAP (ScrollTrigger, CustomEase, SplitText, ScrambleText, DrawSVG), all
self-hosted. First-visit-only loader: hairline lines grow, the real emblem settles, curtain lifts.
Page transitions: arch dome curtain wipe. Scroll reveals: masked line rises with blur clear.
Marquees for dish-name rails. Odometers for catering counts. Every effect has a reduced-motion
static fallback; offscreen canvases pause via IntersectionObserver.

## Distinct hero signature per page (never repeated)

1. index: full-bleed kabab hero inside a slow ogee-arch reveal; canvas of drifting saffron
   threads (gold and pomegranate strands) with scrub lag; oversized serif title with Nastaliq
   annotation; ghost numeral chapter sequence follows.
2. menu: "the sofreh" pinned film-strip scrub: portrait dish photos compress to slivers, a dark
   carta panel wipes in, then the real itemized menu renders chapter by chapter.
3. catering: platter-scale statement hero with odometer counts (10/20/30 serves) rising over an
   arch triptych of platter photography; pomegranate CTA lockup around the phone number.
4. about: day-to-night interpolation: sticky hero whose ground fades cream to ink while the
   new-management story advances in chapters; ends on the halal sourcing pledge in gold on ink.
5. contact: HUD-style info readout: mono coordinates and hours, embedded map, arch-masked interior
   photo, drawn-on compass rose pointing down PCH.
6. 404: spilled saffron: threads scatter across the canvas; an arch doorway button leads home.

## Copy voice

Warm, first-person-plural family voice, plain confident sentences, Persian dish names first with
short honest descriptions from the printed menu. No superlatives that cannot be sourced. No em
dashes anywhere, in copy or comments. Halal claims verbatim from the printed menu. The disclaimer
prints verbatim in the menu page footer.

## Non-negotiables carried from research

- Real logo lockup and emblem (extracted, white-balanced, background-keyed) in nav and footer;
  favicon derived from the emblem.
- Hours: Daily 11 AM to 8 PM (Grubhub live schedule, IG bio, Restaurant Guru mirror, checked
  2026-07-17). Shown with a "call to confirm holidays" softener.
- Dizzy price: 25.99, ASSUMED to match the lamb shank tier, logged in DELIVERY-NOTES.md.
- Order links: Grubhub live store link only (verified); other platforms bot-walled, not shown as
  dead links.
- Reviews shown with first name, star rating, platform. Only new-era reviews.
- Production imagery is curated license-free photography mapped one-line-swappable in data.js;
  an honest representative-imagery note ships in the footer colophon. Watermarked listing photos
  are reference-only and never ship.
