# Design Spec Review, Round 2 (re-review after fixes): Lens 5 (Accessibility) + Lens 6 (Devil's Advocate)

Targets re-read in full: assets/css/tokens.css, research/design-brief.md, assets/js/data.js, research/business/assets/manifest.md, plus round1-a11y-devil.md and fixlog-round1.md.
Method: every changed-token contrast ratio RECOMPUTED from hex (WCAG 2.1 relative luminance), not taken from the fixlog. Pass bar 9.5.

---

## Recomputed contrast table (independent, sRGB)

| Combo | Recomputed | Verdict |
|---|---|---|
| --red-text-dark #e0736c on ink #0e110f | 6.18 | AA pass (fixlog said 5.6; actual is better) |
| #e0736c on --ink-1 #141a16 (dark --bg-2) | 5.75 | AA pass |
| --accent-deep #6e5322 on --paper #f6efe1 | 6.28 | AA pass |
| #6e5322 on --paper-1 #f0e2ce | 5.64 | AA pass |
| --fg-faint light, 64% mix = #62615b, on paper / paper-1 | 5.43 / 4.87 | AA pass on BOTH grounds (round-1 failure closed) |
| --fg-faint dark, 56% mix = #908d85, on ink / ink-1 | 5.73 / 5.33 | AA pass on both |
| --fg-soft light on paper / paper-1 | 7.69 / 6.90 | pass |
| --fg-soft dark on ink / ink-1 | 8.38 / 7.79 | pass |
| --accent-lite #d4a95d on ink / ink-1 | 8.71 / 8.10 | pass |
| --red-deep #741010 on paper | 10.06 | pass |
| crocus-deep #57266d on paper / crocus-lite #ac7cba on ink | 9.64 / 5.74 | pass |
| accent-ink #1c1408 on gold fills #b68b4a / #d4a95d | 5.88 / 8.35 | pass |
| Focus ring: #6e5322 vs paper / #d4a95d vs ink | 6.28 / 8.71 | pass 3:1 with margin |
| Day-night flip point ~#76736e: ink / paper | 4.02 / 4.13 | both above 3:1 large-text AA (brief claims 3.7 / 4.1, conservative) |

Every round-1 computed failure is closed with margin. Note: several tokens.css/brief comments UNDERSTATE ratios (e.g. #6e5322 on paper documented 5.6, actual 6.28; #e0736c documented 5.6, actual 6.18). Errors are all in the safe direction; cosmetic only.

## LENS 5, ACCESSIBILITY. Score: 9.7 / 10

Verification of the ten round-1 findings:
1. Red text on ink: FIXED. tokens.css:43 defines --red-text-dark #e0736c; .on-dark points --accent-2-text at it (line 163) and comments --red-lite fills/ticks only. Brief section 2 (Menu section 2) and section 4 restate the rule. 6.18:1 recomputed.
2. --fg-faint on --bg-2: FIXED. Light mix raised to 64% (5.43 / 4.87 on both creams); dark at 56% (5.73 / 5.33). One token now passes on both grounds in both scopes.
3. :focus-visible: FIXED. tokens.css:195-200 ships the exact :where(...):focus-visible 2px ring + offset and the :focus:not(:focus-visible) reset, with a "must never be removed" comment.
4. Type floors: FIXED. --fs-eyebrow and --fs-mono floor at 0.75rem (12px); whole scale rewritten rem+vw (also closes the zoom concern); brief section 4 states the 12px floor and disclosures at --fs-body minimum (Menu section 4 restates).
5. Keyboard/AT hero specs: FIXED. About scrubber is role="tablist" buttons with arrow keys, content in DOM order (About hero + section 4); Home headline is real DOM text with SplitText as JS enhancement; testimonial prev/next .tap-44 with aria-live="polite" (Home section 6, section 4).
6. Day-to-night contrast hole: FIXED, honestly. Stepped one-step fg flip at 55%, band restricted to --fs-h3+ (large text), computed flip ratios stated. The fixlog's deviation note is correct: dual 4.5:1 at one flip point is mathematically impossible for this pair; the large-text 3:1 constraint is the right call and my recomputation (4.02 / 4.13) clears it with margin.
7. Eyebrow tick: FIXED. .eyebrow::before uses --accent-text; --red variant uses --accent-2-text; declared decorative in both files.
8. Reduced-motion gaps: FIXED. animation-delay:0ms !important added; [class*="marquee"] animation/transform kill + .marquee-static markup rule in guard comment, brief matrix, and Catering section 4.
9. Tap targets: FIXED. --tap: 44px token + .tap-44 utility with the consumer list in both files.
10. aria-hidden rule: FIXED. .ghost comment + brief section 4 decorative-elements bullet covering ghost, shamse watermark, thread dividers, ornament SVGs.

No regressions found: the reset still preserves the ring (outline stripping only via the :focus:not(:focus-visible) rule); [class*="marquee"] also matching .marquee-static is harmless (static line has no animation/transform); Fraunces variable at the declared weights covers all utility classes; k-blink retained but the Contact dot is static by spec and the keyframe sits behind the guard.

Residual (below-bar-relevance) nits, not blocking:
- N1: Update the understated ratio comments in tokens.css:36,43 and brief section 4 to the recomputed values (6.28/5.64 for #6e5322; 6.18 for #e0736c) so future reviews do not re-flag a phantom margin.
- N2: Brief flip-point figures (3.7/4.1) are slightly low vs recomputed (4.02/4.13); conservative, fine to leave.

Why 9.7 and not 10: the two documentation nits above, and the preloader "typed word by word" moment still relies on the JS-applied-hidden-states rule for its no-JS story (the rule exists and covers it; it is just the one place where a slip in app.js would be user-visible).

## LENS 6, DEVIL'S ADVOCATE. Score: 9.6 / 10

Verification of the nine round-1 findings, checked against the actual files (not the fixlog):
1. Photo provenance: FIXED. manifest.md now carries a License status column, all ten rows "Unlicensed (blog copyright), reference only, DO NOT SHIP", plus a license plan paragraph (owner-photography target, licensed-stock interim with disclosure, Home hero owned/licensed only, per-asset manifest row required). Brief section 1 "Imagery honesty and licensing" block matches; data.js photography comment rewritten to the same effect.
2. Old-era testimonials: FIXED. All three data.js quotes attribute "Yelp reviewer, on the kitchen in its Saffron Food Mart era" with a provenance comment forbidding attribution to "Saffron & Rice"; brief 3a and Home section 6 restate.
3. Unverifiable timeline: FIXED, with the stronger remedy. 2008/2015/2018 are gone from every file; data.js story array carries only the two verified milestones with provenance strings (blog coverage 2020/2021; LLC filed 2026-03-16); About hero re-specced to one photo + typographic era rule, scrubber demoted to post-photoshoot enhancement.
4. Menu buries content: FIXED. Hero capped 70vh with category index + first prices in first mobile viewport; sticky bottom tel: bar reading from data.js (.tap-44); item rows authored in HTML, never JS-gated, never CSS-hidden; prices --fs-body minimum, never letter-spaced; shamse spinner removed from Menu (404-only).
5. Asset-blocked heroes: FIXED. Section 1 final bullet plus Catering and About heroes both re-specced to ONE photo + typographic/SVG structure at launch; multi-photo sequences explicitly post-photoshoot; six distinct heroes preserved as compositions.
6. Halal as certification: FIXED. Section 3a: verbatim quoted supplier statements, seal ornament decorative and unlabeled, never in JSON-LD (section 4 baseline bullet repeats the JSON-LD ban); data.js halalNote present.
7. Khufu-clone thinness: ADDRESSED. Saffron-thread linework promoted to the load-bearing sitewide divider system (section 1 closing sentence + ornament item 4 + About section 2); preloader capped 2200ms, session-gated, Skip first in focus order, Home only, never on data-saver/reduced-motion.
8. Data inconsistencies: FIXED. Stews card links to Party Platters with "in our combos" copy; price renderer handles "69.99"/"199" verbatim without inventing ".00"; Contact blinking dot removed, khatam static with no open/closed semantics.
9. Baseline deliverables: FIXED. Section 4 final bullet: per-page titles/descriptions, JSON-LD Restaurant (no halal, no unverified hours), sitemap/robots, skip link first in DOM, hero preload with dimensions, explicit reference to council baseline 05-accessibility-seo.md Part B.

New-weakness sweep: no honesty regressions introduced. Two residual nits, not blocking:
- N3: Contact section 2 "embedded-free static map image": a static map tile is itself licensed imagery (e.g. map-provider ToS). The section-1 licensing rule technically covers it ("every rendered image... explicitly licensed") but the map is the one image class the manifest plan does not name; add "including the static map tile" to the licensing bullet at build time.
- N4: The Farsi calligraphic moments ("نوش جان", "ساعات کار") drawn as original SVG carry a correctness risk (misdrawn script is worse than none); recommend a native-reader check as a build QA step. Spec-level honesty is fine.

Why 9.6: every round-1 CRITICAL/MAJOR is genuinely closed in the files with the honest (not cosmetic) remedy, several with the stronger of two proposed options; only the two named nits remain, both edge-case and non-blocking.

---

## Verdict

| Lens | Round 1 | Round 2 | Bar 9.5 |
|---|---|---|---|
| Accessibility | 7.9 | 9.7 | PASS |
| Devil's Advocate | 7.2 | 9.6 | PASS |

Round 2: **PASS, both lenses.** No mandatory fixes. Optional polish (non-blocking): N1 update understated ratio comments to recomputed values; N3 name the static map tile in the licensing bullet; N4 native-reader QA on the Farsi vectors.
