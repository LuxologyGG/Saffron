# BENCHMARK Lens — Round 1

Site: Saffron and Rice (saffron-and-rice), 6 pages. Judged against `review/composites/` (build LEFT / reference
RIGHT) plus full-page captures in `review/round-1/capture/*/screenshots/` and reference full-page shots in
`research/refs/{khufus,tastavents,laguna,lobat}/screenshots/`. References used across the 12 composites: KHUFU'S
(desert/Giza fine-dining), Tastavents (Mediterranean tasting-menu restaurant), Laguna Al-Sha'ab (editorial
seafood restaurant), Lo'bat (Persian jewelry e-commerce, arch-motif reference only).

## Score: 6.2 / 10

Solid typographic and brand fundamentals, a real and consistent arch/ghost-numeral/mono-label system, and one
or two sections that legitimately hold their own next to the reference set. But the site's single most important
signature move (the index hero) ships at a fraction of its specified scale, and several chapters across index,
about, and catering carry zero photography over long scroll distances where the references never stop
art-directing. This is an honest round-1 baseline: the bones are award-adjacent, the execution density is not
yet there.

---

## Per-composite verdicts

### 01 — index hero vs KHUFU'S hero — **FALLS SHORT** (largest gap in the review)
Build: dark ground, oversized serif headline ("Off the flame, under the *saffron*"), drifting saffron-thread
canvas, small inset food photo bottom-right (`.hero__arch`, capped `width: min(100%, 470px)`,
`aspect-ratio: 10/14` — `assets/css/home.css:41-45`). KHUFU'S: single continuous full-bleed desert photograph
(camel + pyramids in haze) with type floating directly on top of the image — the photograph *is* the composition.
DESIGN-BRIEF.md line 74 explicitly specifies "full-bleed kabab hero inside a slow ogee-arch reveal" for this
exact spot — the shipped hero does not match its own brief. What ships reads as an editorial text block with a
supporting thumbnail, not an establishing shot. This is the site's mission-critical first impression and it is
the weakest composite in the set.
**Fix**: scale `.hero__arch` to a true environmental panel (≥55-65vw or full viewport height on desktop), let the
ogee mask grow via the scroll-scrub already planned in the motion plan, and let the kabab photograph carry the
opening beat the way KHUFU'S desert shot does.

### 02 — index chapter vs KHUFU'S chapter skeleton — **HOLDS ITS OWN** (reference partially unloaded, limited comparison)
Reference right pane loaded as a gray skeleton placeholder for the main image, so direct image-treatment
comparison is not fully possible. Structurally, though, the build's numbered-chapter language (ghost "01",
mono eyebrow "THE KITCHEN", arch photo mask, thin botanical line icon) mirrors KHUFU'S chapter grammar (ghost
"05", eyebrow "MEET THE CHEF", numbered index rail) closely enough to read as the same design family. KHUFU'S
does add one flourish the build lacks anywhere: a script/signature pull-line under a headline ("Innovation Meets
Tradition") and paired prev/next chapter arrows — a wayfinding + voice device worth borrowing.

### 03 — index "Koobideh, barg, soltani" vs Laguna dish showcase — **FALLS SHORT**
This is the sharpest content gap in the review. Laguna turns its "Course IV" moment into full art direction: a
faceted wireframe "gem" cut-out around the dish photo, a course-progress dial (I–V), oversized ghost type
("UNITY - EARTH AND SEA") behind the frame, floating crystal line-art. The build's equivalent chapter — the
kabab flagship, arguably the single dish the whole brand is built on — is a bare 3-column price table on a black
field with only a faint kebab-skewer watermark; confirmed against the full page
(`review/round-1/capture/index/screenshots/desktop_1440_full.png`) that this section carries **no food
photography at all**, even though styled grill photography of these exact dishes exists elsewhere in the shoot
(`assets/img/menu-kabab.jpg`).
**Fix**: give chapter 02 the same arch/photo treatment used in chapters 01 and 03, using the existing
`menu-kabab.jpg` grill photography, so the kabab chapter is not the one chapter in the page with nothing to
look at.

### 04 — menu hero filmstrip vs Tastavents pin — **HOLDS ITS OWN, with a grading problem**
Structurally close: both use a full-bleed vertical-strip collage of dish photos beside a dark info panel. The
build's hero photo (grilling meat close-up) is genuinely strong and cinematic. But the 5-photo filmstrip mixes
wildly inconsistent exposure and color grading — a dark, high-contrast grill shot sits directly beside a bright
saffron-rice shot beside dark herb/pickle shots — so the strip reads as a grab-bag of snapshots rather than one
graded sequence. Tastavents keeps every frame in its strip at the same clean, bright, styled-plate exposure, so
five different dishes still read as one continuous idea.
**Fix**: run a shared color grade / exposure curve across the 5 hero strip images (lift the grill shot's
shadows, match white balance) so the filmstrip unifies instead of fragmenting.

### 05 — menu carta vs Tastavents carta — **HOLDS ITS OWN**
Reference crop shows its branding statement card, not a text menu, so this is not a true apples-to-apples
image-treatment comparison. On its own terms the build's dotted-leader menu list (serif dish name, price,
one-line description, sticky numbered category rail) is clean, legible, and a legitimate classic restaurant-menu
solution — arguably the build's most confidently "finished" piece of UI in the whole site. Confirmed via full
page (`capture/menu/screenshots/desktop_1440_full.png`) that after the hero strip the remainder of the page
(roughly 6 of 8 sections) is pure text with only two arch photo bands breaking up a ~15,800px scroll — thinner
on imagery than the references' continuous photography, but the typographic system itself is a genuine strength.

### 06 — catering hero vs Laguna hero — **FALLS SHORT on atmosphere, holds its own on type**
Both are full-bleed photographic heroes with overlaid serif type. The build's overhead catering-platter flatlay
is legible and moody with a nice italic gold accent on "thirty," but it is a single flat plane — no foreground/
background separation, no depth cue. Laguna deliberately blurs a foreground row of arches to reveal a glowing
dusk sky and sailboat-lit horizon behind — real depth-of-field staging that reads as cinematic rather than
photographic-flatlay. The build's color grade (neutral browns/blacks) is also far less distinctive than Laguna's
dusk palette (pink/blue sky against warm stone).
**Fix**: either shoot/composite a layered foreground element (blurred platter edge, steam, smoke from the grill)
in front of the hero photo, or push the color grade toward a more specific time-of-day palette instead of a
generic dark scrim.

### 07 — about day/night vs KHUFU'S evening chapter — **FALLS SHORT**
The build's "ab-dusk" hero is a scroll-driven cream-to-ink color transition carrying only typography (headline,
Farsi caption, 3-step kicker/text list) — confirmed via full page that this section runs roughly 3,000px of pure
color-and-type scroll with zero photography anywhere in the transition. KHUFU'S equivalent beat ("The experience
evolves with the light," numbered "08," eyebrow, script sub-headline "A softer, deeper atmosphere," CTA "Continue
to Khufu's Bistro") pairs the same narrative idea with a dedicated three-image night-photography filmstrip
(candlelit table, pour, glass) right beside the copy. The build's version is a legitimate and on-brand conceit
(day becomes night is the site's own decorative bracket) but over that much scroll distance with nothing to look
at, it reads thin next to the reference's fully dressed chapter.
**Fix**: bring at least one or two photographs into the dusk transition — even a single evening/interior shot
that cross-fades or darkens in sync with the ground color would close most of this gap.

### 08 — contact hero vs KHUFU'S "final invitation" — **HOLDS ITS OWN** (different but valid answer)
KHUFU'S goes for extreme minimal luxury: centered mixed-weight serif line, two flanking Egyptian-column line
ornaments, huge whitespace, a 3-word label row. The build goes the opposite direction: left-aligned oversized
headline, a "coordinates and hours" data motif (lat/long, a grid-line texture, corner brackets, a compass icon
lower on the page) — a HUD/precision conceit that suits a neighborhood deli's honest, no-nonsense positioning
better than borrowed luxury-restaurant minimalism would. The composition is confident and internally consistent.
This is one of the few spots in the site where the build's chosen idea is arguably more appropriate to the brand
than a literal copy of the reference's mood would have been, even though the reference's craft (ornament
quality, negative-space control) still reads more expensive.

### 09 — index mobile vs Tastavents mobile — **FALLS SHORT** (hero), reference partly obscured by a cookie banner
Reference viewport is covered by a Cookiebot consent modal for most of the visible fold, limiting comparison, but
what's visible below it (a framed sunset-sailboat photo layered over a wood-table image with a giant ghost
letterform) confirms Tastavents keeps art-directing at mobile width. The build's mobile hero, by contrast, is
pure logo lockup on solid black — no photography at all above the fold on the phone. Scrolling further, the
build's mobile "Koobideh, barg, soltani" chapter is confirmed as photo-less at mobile width too, same as desktop
(finding 03 above applies identically on mobile).

### 10 — menu mobile vs KHUFU'S mobile — **HOLDS ITS OWN**
Reference's mobile intro is a strong, confident move worth noting even though it's not really an "image
treatment": a full-viewport loader carrying a bold first-person manifesto line ("At Khufu's, Egyptian cuisine is
treated as heritage, not performance.") and a "Skip Intro" button. The build's mobile hero is just a static logo
lockup with no equivalent statement of intent. Below the fold, the build's dotted-leader menu list reflows
cleanly and stays legible at mobile width — no responsive breakage, comparable information density to what a
menu page needs.
**Fix (minor)**: consider a one-line mission statement on the mobile hero (or the loader) in the site's own
established "warm, first-person-plural family voice" — the copy voice exists in the brief, it's just not used as
a hero-scale statement anywhere on mobile.

### 11 — arch motif vs Lo'bat's mihrab grid — **FALLS SHORT**
The build's dome-arch photo mask (used on index chapter 01, menu bands, about market photo) is a nice, consistent
recurring device, but every instance is a single one-off photo frame. Lo'bat builds the identical Islamic-arch
geometry into the *structural grid itself* — a repeating mihrab silhouette used as the container for every
product tile across a 4-up grid, reinforced by a large hand-lettered Arabic word treated as a graphic element,
not a caption. The build's Farsi/Arabic script (رمعفران و برنج etc.) is always small caption-scale throughout the
site; it never gets to be a compositional element the way Lo'bat's calligraphy or KHUFU'S ghost numerals do.
**Fix**: pick one section (index chapter 03 "One cloth, many hands," or the catering platter grid) and repeat the
arch shape 3-4x as the actual grid unit, and in at least one hero treat a Farsi word at large decorative scale
rather than small caption scale.

### 12 — full-bleed band vs Laguna's chef-quote band — **FALLS SHORT**
Laguna spends this exact slot on human storytelling: staff mid-service photography, a spotlighted chef, two
large italic pull-quotes ("I don't just cook" / "I script with fish and salt"), and a dense narrative paragraph
building mythology around a named chef. The build's equivalent full-bleed band is a single strong overhead food
photo (tahchin + khoresh on tableware) captioned only "FROM OUR KITCHEN" — a good photo functioning purely as a
spacer, with no narrative payload. Saffron and Rice is a family deli without a name-chef persona, so a literal
copy of Laguna's device wouldn't be honest to the brand — but the brief already establishes a warm,
first-person-plural family voice that is never used at this scale anywhere in the site.
**Fix**: give the site one moment of first-person family-voice storytelling (a short pull-quote from the family,
tied to real interior/kitchen photography) so there is one section built around people and story, not just food
and price.

---

## Findings

| ID | Severity | Location | Finding | Fix |
|----|----------|----------|---------|-----|
| BM01 | MAJOR | `index.html` hero, `.hero__arch` in `assets/css/home.css:41-45` | The homepage hero image is capped at `width: min(100%, 470px)`, a small inset thumbnail, while DESIGN-BRIEF.md:74 specifies "full-bleed kabab hero inside a slow ogee-arch reveal." Against KHUFU'S full-bleed desert hero (composite 01), the build's hero reads as a text block with a supporting photo, not an establishing shot — the weakest single moment in the review. | Scale the arch image to a true environmental panel (≥55-65vw desktop, or full-height), drive its growth off scroll per the motion plan already written in the brief. |
| BM02 | MAJOR | `index.html` chapter 02 "Koobideh, barg, soltani" (`assets/css/home.css`, section after `.hero`); confirmed via `capture/index/screenshots/desktop_1440_full.png` | The kabab chapter — the brand's flagship dish category — ships as a bare 3-column price table with zero photography, while chapters 01 and 03 both carry arch/photo treatments. Composite 03 shows how far this falls short of Laguna's fully art-directed dish-showcase moment for an equivalent single-dish highlight. | Reuse the existing `assets/img/menu-kabab.jpg` grill photography in an arch or full-bleed treatment inside this chapter so it isn't the one photo-less chapter on the page. |
| BM03 | MAJOR | `about.html` `.ab-dusk` hero (`about.html:112-155`) | The day-to-night hero runs roughly 3,000px of pure color-transition-plus-typography scroll with no photography anywhere in the transition. KHUFU'S equivalent "evening" chapter (composite 07) pairs the same narrative beat with a dedicated 3-image night-photography filmstrip. Over that much scroll distance with nothing to look at, the build's version reads thin. | Add at least one photograph (interior/evening shot) that cross-fades or darkens in sync with the ground-color transition. |
| BM04 | MAJOR | `catering.html` sections 02, 03, 05 and halal section 04; confirmed via `capture/catering/screenshots/desktop_1440_full.png` | Roughly 6,000px of the catering page's 9,313px total height carries zero imagery — only the hero flatlay and the closing CTA arch have a photo. Section 04's "Halal, in writing" is a giant ghost Arabic watermark with no supporting photography. Against the references' continuous photographic texture at every scroll stop, long stretches read as a pricing spec sheet. | Break up sections 02/03/05 with at least one supporting image each (platter close-ups, prep shots) reusing the existing catering photography set. |
| BM05 | MINOR | `menu.html` hero filmstrip, `.mhero__strip` (`menu.html:146-181`) | The 5-photo hero filmstrip mixes inconsistent exposure/color grading (a dark high-contrast grill shot beside a bright saffron-rice shot beside dark herb/pickle shots), reading as a snapshot grab-bag rather than a graded editorial sequence, unlike Tastavents' uniformly bright, clean-plate filmstrip (composite 04). | Apply a shared color grade / exposure curve across the 5 strip images so the sequence reads as one continuous idea. |
| BM06 | MINOR | Site-wide arch motif (`.arch`, `.arch--ogee` classes across `home.css`, `about.html`, `menu.html`) vs Lo'bat reference (composite 11) | The dome-arch photo mask is used consistently but always as a single one-off photo frame; Lo'bat embeds the same geometry into a repeating structural grid across a whole product wall, and pairs it with large-scale hand-lettered Arabic type. The build's Farsi/Arabic script is always small caption-scale, never a graphic-scale element. | Repeat the arch shape as an actual grid unit in one section (e.g. index chapter 03 or catering platter grid), and treat one Farsi/Arabic word at large decorative scale in at least one hero. |
| BM07 | MINOR | Full-bleed food band on index, "FROM OUR KITCHEN" caption (composite 12) | The build has no section built around human/family storytelling comparable to Laguna's chef-quote band (composite 12) — its equivalent full-bleed photo is captioned with 3 words only. The brief already defines a warm first-person-plural family voice that is never used at hero/pull-quote scale anywhere on the site. | Add one first-person family-voice pull-quote moment tied to real interior/kitchen photography, sized and placed as a genuine editorial beat rather than a caption. |
| BM08 | MINOR | `404.html`, `.nf-hero__num` / `.nf-hero__kicker` (`404.html:78-79`) | Verified live: the ghost "404" numeral and "Page not found" kicker sit at `opacity: 0` for roughly 3-5 seconds after load (measured via computed style at 2.5s = opacity 0, at 6s = opacity 1) before the scramble-text reveal resolves. Reduced-motion contexts render instantly correct (verified). On the one page whose entire job is telling the visitor they hit a dead end, several seconds of a blank hero risks reading as broken to a fast-scrolling juror rather than deliberate. | Decouple the "404" / "Page not found" text reveal timing from the longer scatter-canvas animation so the core message resolves within ~1.5s regardless of the ambient thread animation's pace. |
| BM09 | MINOR | Mobile hero, `index.html` (composite 09) | Mobile hero is a static centered logo lockup on solid black with no photography and no mission-statement copy, while Tastavents commits its mobile-viewport real estate to a bold first-person manifesto line even inside its loader ("At Khufu's, Egyptian cuisine is treated as heritage, not performance" — comparable device, composite 10). The build's copy voice (brief: "warm, first-person-plural family voice") is never used at hero scale on mobile. | Add a one-line mission statement to the mobile hero using the site's established copy voice, or surface it in the loader before curtain-lift. |

---

## checksRun

1. Read all 12 files in `review/composites/` (01-12) at full resolution via the Read tool; cropped composite 09
   and 10 (tall mobile stitches) into 1400-2000px vertical slices with PIL to read type/detail that was
   illegible at the full 13,000+px composite scale.
2. Read full-page desktop captures for all 6 build pages (`capture/{index,menu,catering,about,contact,404}/
   screenshots/desktop_1440_full.png`) to check whether composite crops were representative of the whole page
   (confirmed: sections shown in composites 03/06/07/12 were representative, not cherry-picked worst-case).
3. Read reference screenshot directory listings for khufus, laguna, lobat, tastavents (`research/refs/*/
   screenshots/`) to confirm composite crops existed in a broader reference context.
4. Grepped `index.html`, `about.html`, `menu.html`, `assets/css/home.css`, `assets/js/page-menu.js`,
   `assets/js/data.js` to verify implementation against DESIGN-BRIEF.md's stated per-page signature-hero spec
   (section "Distinct hero signature per page").
5. Read DESIGN-BRIEF.md in full (form language, motion plan, per-page hero signature list, copy voice) to judge
   build-vs-brief fidelity, not just build-vs-reference.
6. Served the site locally (`python3 -m http.server 8136`) and drove it with Playwright (Python) to verify two
   suspected visual issues seen in composites were not real: (a) a gray "blank" arch photo band in
   composite 02/menu full-page — confirmed via `scroll_into_view_if_needed` + 3s settle that the image (
   `assets/img/menu-hero.jpg`) loads correctly and the blank was a lazy-load capture-timing artifact on the
   reference side of that composite, not a build bug; (b) a "905ZN" zip-code misread in composite 08 — confirmed
   via `document.body.innerText` that the DOM renders the correct "90505," a composite-compression/font
   legibility artifact, not a real content bug. Neither was filed as a finding.
7. Verified a genuine issue found while probing composite artifacts: `404.html`'s ghost numeral and kicker sit
   at `opacity: 0` for several seconds post-load (measured via `getComputedStyle` at 2.5s and 6s) before the
   scramble-text reveal completes; confirmed reduced-motion context renders both immediately at opacity 1 (per
   the "reduced-motion renders must always look finished" requirement, which holds) but standard-motion visitors
   see a blank hero for multiple seconds. Filed as BM08.
8. Measured `.hero__arch` CSS dimensions directly (`assets/css/home.css:41-45`) to quantify how far the index
   hero image's actual rendered size falls short of "full-bleed" as specified in DESIGN-BRIEF.md line 74; used
   this as the basis for BM01.
9. Cross-checked mobile composites (09, 10) against corresponding `mobile_390_full.png` captures where the
   composite crop was ambiguous or reference content was obscured by a cookie-consent modal.

## Notes

- Composite 02's reference pane (KHUFU'S) had not finished loading its hero image (rendered as a gray skeleton
  box) at capture time — this limited direct image-treatment comparison for that one composite; verdict given
  is based on structural/typographic comparison only, not image quality.
- Two suspected defects surfaced during this review turned out to be capture/compression artifacts rather than
  real site bugs (see checksRun #6) and were deliberately excluded from the findings table to avoid false
  positives, per the reviewer brief's caution about programmatic-scroll and screenshot artifacts.
- The site's strongest moments by this lens are the menu page's typographic system (composite 05) and the
  contact page's HUD/data-driven reinterpretation of the "minimal invitation" trope (composite 08) — both are
  places where the build found its own confident answer rather than a weaker copy of the reference move.
- The single highest-leverage fix for the next round is BM01 (index hero scale): it is the first thing every
  visitor and every juror sees, it directly contradicts the project's own written brief, and fixing it alone
  would likely move the overall score more than any other single change.
- This lens did not evaluate accessibility, performance, motion-implementation correctness, or brand-fact
  accuracy — those are covered by sibling lenses reviewing the same round.
