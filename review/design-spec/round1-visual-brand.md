# Design Spec Review, Round 1: Visual & Brand Lenses
Targets: assets/css/tokens.css, research/design-brief.md
Baselines consulted: khufus, laguna, tastavents, berenjak design-system.md + notes.md; dokmeh and lobat notes.md; brand logo Saffronlogobg.png (viewed); khufus clean_desktop_1440_viewport.png (viewed).
Pass bar: 9.5. Verdict this round: NOT PASSED (both lenses below bar).

---

## LENS 1: VISUAL & DESIGN FIDELITY — Score: 8.6 / 10

The token system is unusually complete for a spec: semantic indirection (components read --bg/--fg/--accent, never raw scale), an .on-dark scope that re-points the same names, fluid clamps, a real motion vocabulary with named easings matching the extracted reference curves (cubic-bezier(.18,1,.25,1) is verbatim Khufu's hero curve), z-index plan, reduced-motion CSS guard, and an arch family that credibly re-reads Laguna's 200px arch and Khufu's 120px pylon. The palette is genuinely logo-derived: gold #b68b4a, red #970e0d, crocus #7b3397, bowl green #25332e, cream #f0e2ce all check against the viewed logo. This is at the level where execution, not intent, decides awwwards caliber. Findings below are what keeps it off 9.5.

### Findings

1. **MAJOR — Display face fights the brand and every baseline.** All four baselines carry a serif display voice (Khufu's IvyOra Display, Tastavents ivypresto didone, Berenjak Triptych serif + Kufic-influenced Berenjak Sans, Laguna Playfair/LTRemark), and the logo itself is a high-contrast calligraphic serif wordmark. Clash Display is a geometric agency grotesk (Dokmeh's register, the one reference whose notes explicitly caution "agency-loud"). A Clash-only display layer will read tech-startup, not heritage-luxury, and will clash with the wordmark in the nav and footer.
   FIX: In assets/css/fonts.css and tokens.css line 74, replace or pair the display slot with a self-hosted high-contrast serif (e.g. Instrument Serif or Fraunces 72pt, both openly licensable and vendorable). Concretely in tokens.css: `--font-display: "Fraunces", "Clash Display", serif;` and add a `--font-display-alt` if Clash is retained for numerals/ghost words. Update design-brief.md section 1 and the Type roles line to state the serif display and where (if anywhere) Clash survives. Reserve italic serif for the brief's "italic emphasis word" moves, which currently have no italic-capable face at all (Clash Display ships no italics; the brief's About and Home heroes both specify italicized emphasis words). That is a spec contradiction as written.

2. **MAJOR — --red-lite #c1403a fails AA as text on the night ground.** Contrast of #c1403a on #0e110f is roughly 3.7:1. The .on-dark scope maps `--accent-2-text: var(--red-lite)` (tokens.css line 155), and the brief puts red on prices and seals inside on-dark menu bands (Menu section 2), i.e. small Chivo Mono text. Below 4.5:1.
   FIX: tokens.css line 45, lighten `--red-lite` to `#e0685f` (about 4.9:1 on #0e110f) or add a dedicated `--red-text-dark: #e0685f` and point line 155 at it; keep #c1403a for non-text seals/ticks. Mirror the value change in design-brief.md section 4 contrast bullet.

3. **MAJOR — Menu hero and 404 hero share the same signature.** Both are "night ground + centered arch/medallion + slowly spinning original shamse rosette" (brief sections Menu and 404). Two of six heroes hanging on the identical ornament-spin device undercuts the "genuinely distinct hero per page" mandate.
   FIX: design-brief.md, Menu hero paragraph: remove the spinning shamse from the Menu hero apex (keep it 404-only and as static watermark elsewhere). Replace with a distinct device already in your system, e.g. a scroll-scrubbed dotted-leader line that "sets the table" by drawing across the carte cover, or the category chips animating in as khatam ticks. State the replacement explicitly.

4. **MINOR — --arch mobile floor is too big.** `--arch: clamp(120px, 16vw, 220px)`: at 390px viewports the 120px floor on a full-bleed image (390px wide) makes the top corners consume 62 percent of the width, effectively a lopsided dome, not the 1440-scale ivan proportion.
   FIX: tokens.css line 111, change to `--arch: clamp(72px, 15vw, 220px);` (15vw of 1440 = 216, preserving desktop scale; 72px at 390 keeps the arch an arch).

5. **MINOR — Dead and unhoused tokens.** `--steel/--steel-2/--steel-3` (lines 25-27) duplicate the --fg-faint role and are referenced by no semantic token; `--tracking-wide` (line 93) and `--e-osmo` (line 123) are never consumed by any utility or named use in the brief; "--e-osmo" also name-leaks a third-party studio rather than a reference in your baseline set.
   FIX: tokens.css: either delete the three steel steps and --tracking-wide and --e-osmo, or bind them (e.g. `--fg-caption: var(--steel);` consumed by figure captions, rename --e-osmo to --e-soft). Every token should have a stated consumer; add the consumer in the trailing comment.

6. **MINOR — No elevation or texture tokens despite the brief depending on them.** The brief mandates grain overlays ("archival grade", ornament plan item 5) and hover lifts (Catering section 1), but tokens.css defines no `--shadow` steps and no `--grain-opacity`/asset hook. Re-skins will hard-code these in component CSS, breaking the values-only-diff promise in the file header.
   FIX: tokens.css, add under Form language: `--shadow-1: 0 10px 30px rgba(14,17,15,.10); --shadow-2: 0 24px 60px rgba(14,17,15,.16); --grain-url: url("../img/ornament/grain.png"); --grain-opacity: .06;` and reference them in design-brief.md ornament item 5.

7. **MINOR — Type scale gap between h4 and h3.** 24px max to 46px max with nothing between; the references run intermediate card-title sizes (Khufu's clamp(22px,1.7vw,30px) and clamp(32px,2.15vw,38px)). Card titles and menu item names will be forced to pick a wrong size.
   FIX: tokens.css line 83, insert `--fs-h5` no; rather add after line 83: `--fs-h3s: clamp(22px, 2.1vw, 32px);` (menu item names, card titles) and note the role in the comment; mention it in design-brief.md Menu section 2 ("item rows: name in display at --fs-h3s").

---

## LENS 2: BRAND — Score: 8.9 / 10

The honesty spine is real and unusual: "formerly Saffron Food Market", "call to confirm hours", phone-first catering CTA, owner-authoritative data.js menu rendered verbatim, imagesDisclosure wherever representative photography appears, halal claims limited to the two owner claims. No em dashes anywhere in either file (verified by grep). The ornament plan is the strongest part: every device (khatam tick, original 12-point shamse, saffron-thread linework, crocus petals, one Farsi moment "نوش جان" with Latin caption) is specified as drawn-in-repo original SVG, matching the berenjak/lobat/dokmeh guidance almost point for point, and the restraint rule (gold carries; red only prices/seals/one hero; purple ornament-only; neither ever a ground) is exactly the discipline the references model. What holds it under bar:

### Findings

1. **MAJOR — "The Carte" is a French fine-dining word on a Persian deli.** The Menu page concept name, the "carte-style numbered menu overlay", and "carte cover" language import Tastavents' Barcelona fine-dining framing wholesale. A Torrance halal deli under new family management does not have a carte; it has a counter and a sofreh. This is the single clearest fine-dining-clone tell in the spec.
   FIX: design-brief.md, Menu section: rename the concept from "The Carte" to "The Counter" (or "The Spread Sheet" is banned; keep it plain). Replace every "carte" occurrence (Menu hero paragraph, Home section 5 "menu carte", tokens.css line 134 comment "carte menu overlay", accessibility bullet "the carte overlay") with "counter menu" / "menu overlay". Keep the numbered-index mechanic; it is the word, not the structure, that is off-brand.

2. **MAJOR — The poetic preloader and 220vh day-to-night narrative skew ceremonial for a lunch-counter audience.** Khufu's is a destination fine-dining restaurant; a deli's core user is checking hours, menu, and platter prices on a phone. A typed three-line poem before content is a conversion tax that also reads fine-dining. The brief already includes a Skip pill and once-per-session, which helps, but the default posture is still wrong for the business.
   FIX: design-brief.md Home section 1: cap the preloader at a hard 2.2s total (state the number), auto-dismiss without interaction, never on mobile data-saver or reduced motion, and never on any page except Home. Add one sentence to section 2 (Home) stating that address, hours line, and phone are visible within the first viewport or the sticky nav, before any scroll choreography.

3. **MINOR — Timeline facts presented without a verification gate.** About hero hard-codes 2008 Shayan, 2015 Seaside, 2018 Saffron Food Mart, 2026 Saffron & Rice. The honesty rules elsewhere always route facts through the owner (data.js, "owner-authoritative"), but these years are stated bare.
   FIX: design-brief.md About hero paragraph: append "(years render from data.js timeline entries, owner-verified; any unverified year is omitted, never approximated)".

4. **MINOR — "Ivan arch" naming is loosely applied.** An ivan (eyvan) is a rectangular-framed vaulted portal; the token family is round-top half-domes, closer to a generic Persianate arch or a mihrab silhouette. Calling it an ivan in ornament item 3 slightly overstates the authenticity claim the brief stakes its credibility on.
   FIX: design-brief.md ornament item 3: rename to "Persianate arch masks" and add one sentence: on at least one prominent use (Contact hero window), set the arch inside a thin rectangular hairline frame so it actually reads as an ivan portal rather than a rounded rectangle.

5. **MINOR — One Farsi moment is right, but it lacks a diaspora-practical companion.** Lo'bat and dokmeh notes both flag bilingual UI as the authenticity signal for the Torrance Iranian-American community; a single decorative "نوش جان" is ornament, not welcome.
   FIX: design-brief.md, Contact section 1 or footer spec: add one functional Farsi micro-label pair (e.g. hours row annotated "ساعات کار" beside the Latin, rendered as the same original SVG technique or a vendored Farsi-capable webfont with the no-copied-assets rule restated). Keep the one-calligraphic-moment rule; this is a micro-label, not a second script moment.

6. **MINOR — "Game Day" in the occasions marquee sits oddly against Mehmooni and Nowruz.** It is defensible (South Bay catering reality) but tonally it flattens the line. Not a violation, a sharpening.
   FIX: design-brief.md Catering section 4: reorder to "Nowruz. Mehmooni. Shab-e Yalda. Game Day." so the Persian occasions establish the register before the crossover one lands.

---

## Score summary

| Lens | Score | Bar | Status |
|---|---|---|---|
| Visual & design fidelity | 8.6 | 9.5 | FAIL |
| Brand | 8.9 | 9.5 | FAIL |

Top fixes for round 2, in order: (1) serif display face decision + italics (Visual F1), (2) rename and de-French the Carte (Brand F1), (3) fix --red-lite AA on dark (Visual F2), (4) de-duplicate Menu/404 shamse heroes (Visual F3), (5) cap the preloader and surface hours/phone in viewport one (Brand F2).
