# Design Spec Review, Round 2 (re-review after fixes): Visual & Brand Lenses
Targets re-examined: assets/css/tokens.css, research/design-brief.md, assets/css/fonts.css, assets/js/data.js.
Method: every round-1 finding checked against the actual file contents (not the fix log's claims), plus a regression sweep (grep for carte/clash/steel/e-osmo/tracking-wide/em dashes, font file presence in assets/fonts, node --check on data.js, contrast spot-recomputation).
Pass bar: 9.5. Verdict this round: **PASSED, both lenses.**

---

## Verification of round-1 findings

### Lens 1: Visual

| # | Finding | Verified state | Status |
|---|---|---|---|
| V1 MAJOR | Clash Display fights brand; no italics | fonts.css declares Fraunces variable normal + true italic @font-face pairs; both woff2 files exist in assets/fonts; ClashDisplay files gone; tokens.css --font-display is Fraunces with serif fallbacks; brief section 1 type roles rewritten, every emphasis-word moment (Home hero, Home s2, About hero) names Fraunces italic; zero "Clash" hits outside the removal note | FIXED |
| V2 MAJOR | --red-lite 3.67:1 as text on ink | tokens.css: --red-lite re-commented fills/ticks only; new --red-text-dark #e0736c; .on-dark maps --accent-2-text to it. Spot-recomputed #e0736c on #0e110f: ~5.6:1, AA with margin. Mirrored in brief section 4 and Menu section 2 | FIXED (adopted a11y lens hex, stronger than round-1 suggestion) |
| V3 MAJOR | Menu/404 shared shamse hero | Menu hero now the scroll-scrubbed dotted-leader "set the table" device with khatam ticks at chips; explicit "No shamse spinner here"; k-spin keyframe comment says 404 only; motion table says 404 only | FIXED |
| V4 MINOR | --arch 120px mobile floor | tokens.css: `--arch: clamp(72px, 15vw, 220px)` with rationale comment | FIXED |
| V5 MINOR | Dead tokens (steel, --tracking-wide, --e-osmo) | All deleted; --tracking-mono kept with stated consumer; header states the every-token-has-a-consumer rule; grep confirms zero hits | FIXED |
| V6 MINOR | No shadow/grain tokens | --shadow-1/--shadow-2/--grain-url/--grain-opacity present with consumers; referenced in brief ornament item 5, Catering s1, perf contract item 4 | FIXED |
| V7 MINOR | h4-to-h3 type gap | --fs-h3s clamp(1.375rem ... 2rem) (22-32px) + .h3s utility with role comment; brief Menu s2 names item rows at --fs-h3s | FIXED |

### Lens 2: Brand

| # | Finding | Verified state | Status |
|---|---|---|---|
| B1 MAJOR | "The Carte" fine-dining framing | Menu page is "The Counter"; grep finds zero "carte" occurrences anywhere; z-index comment now "counter menu overlay"; numbered-index mechanic retained | FIXED |
| B2 MAJOR | Ceremonial preloader / buried practicals | Preloader hard-capped 2200ms including 450ms exit, auto-dismiss, Home only, never on data-saver or reduced motion, sessionStorage `snrIntroSeen`, Skip pill first in focus order; Home hero states address, hours line, and phone visible in first viewport or sticky nav before any scroll choreography | FIXED |
| B3 MINOR | Unverified timeline years | Stronger remedy applied: 2008/2015/2018 deleted; brief and data.js `story` carry only verified milestones (blog era 2020-2021, LLC filed 2026-03-16) with provenance strings | FIXED (superseding fix accepted) |
| B4 MINOR | Loose "ivan" naming | Ornament item 3 renamed "Persianate arch masks"; Contact hero arch set inside a thin rectangular hairline frame so the one prominent use reads as a true ivan portal | FIXED |
| B5 MINOR | No functional Farsi companion | Contact hours row carries functional micro-label "ساعات کار" beside the Latin; ornament item 6 codifies one calligraphic moment + one micro-label, no-copied-assets rule restated | FIXED |
| B6 MINOR | Occasions marquee order | "Nowruz. Mehmooni. Shab-e Yalda. Game Day." | FIXED |

## Regression sweep

- No em dashes in any of the four files; no "carte"/"steel"/"e-osmo"/"tracking-wide" residue; `node --check assets/js/data.js` passes.
- Cross-lens fixes did not break these lenses: the fluid rem+vw type rewrite preserves the round-1 px design targets in comments; --fs-h3s slots correctly between h4 (24px) and h3 (46px); the .on-dark scope still re-points only semantic names; A6's large-text-only day-to-night flip is honestly documented with computed ratios rather than an impossible dual-4.5:1 claim, which this lens accepts as the correct visual-integrity call.
- New material (shadow steps, grain hook, --t-ui, .h3s, focus ring, tap targets) all carries stated consumers, consistent with the file's own governance rule.
- Nit, not scored against the bar: the restraint rule "red appears only on prices, seals, and one hero" is now mildly stretched by the Menu leader-line khatam ticks and the Catering headline counts; both read as seal/price-adjacent uses, but a future editor could widen the hole. Optional polish: reword the rule to "prices, seals/ticks, and one hero headline."

## Scores

| Lens | Round 1 | Round 2 | Bar | Status |
|---|---|---|---|---|
| Visual & design fidelity | 8.6 | 9.6 | 9.5 | PASS |
| Brand | 8.9 | 9.7 | 9.5 | PASS |

Visual 9.6: all three majors and four minors verifiably closed in-file; the Fraunces decision resolves the deepest identity conflict and the token system is now fully governed (no dead tokens, every consumer stated, AA claims spot-check true). Remaining distance to 10 is execution risk, not spec deficiency.
Brand 9.7: the de-Frenched Counter, honesty-gated timeline, era-attributed testimonials, quoted-not-certified halal handling, and the functional Farsi micro-label make the honesty spine airtight; the one nit above is optional polish.

**Verdict: PASSED. No required fixes remain for these lenses.**
