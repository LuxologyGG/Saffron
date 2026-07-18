# Council Round 2 — Accessibility + Devil's Advocate (re-review after fixes)

Site: Saffron & Rice (`saffron-b`), no git. Served locally with `python3 -m http.server 8080` from repo root. Tested with Playwright chromium (`/opt/pw-browsers`, `PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers`) and axe-core 4.x vendored locally (`npm i axe-core` into the scratchpad, injected via `page.add_script_tag(path=...)`, zero external network requests). Pages: `index.html`, `menu.html`, `about.html`, `contact.html`, `catering.html`, `404.html`. Re-review input: round-1 report (`review/site-round1/a11y-devil.md`, scores 7.8/8.4, both FAIL) and fix logs `fixlog-A.md`, `fixlog-B.md`, `fixlog-1b.md`.

## Scores

| Lens | Round 1 | Round 2 | Bar | Result |
|---|---|---|---|---|
| ACCESSIBILITY | 7.8 | **9.7 / 10.0** | 9.5 | **PASS** |
| DEVIL'S ADVOCATE | 8.4 | **8.9 / 10.0** | 9.5 | **FAIL** |

Accessibility clears the bar: every round-1 CRITICAL/MAJOR/MINOR item is verifiably fixed, axe-core is clean on all four targeted rules plus a full-ruleset run on all 6 pages, and the day/night contrast dead zone is gone. Devil's Advocate does **not** clear the bar: the round-1b fix for the brand-name finding (D1) went in the wrong direction — it replaced the correct name with the incorrect one, backed by a citation to the business's defunct e-commerce domain rather than the primary-source evidence (photographed storefront sign, three independent business-directory listings) already sitting in `research/business/facts.md`. That is a new, self-inflicted honesty defect, not a residual one, and it is CRITICAL for the same reason the original finding was.

---

## ACCESSIBILITY — 9.7/10.0 — PASS

### Automated: axe-core, all 6 pages

Ran axe twice per page at 1440x900: (a) targeted at the four rules the round-1 report flagged (`aria-prohibited-attr`, `aria-allowed-role`, `link-in-text-block`, `heading-order`), and (b) a full unrestricted `axe.run()`.

| Page | Targeted violations | Full-ruleset violations | Console errors |
|---|---|---|---|
| index.html | 0 | 0 | 0 |
| menu.html | 0 | 0 | 0 |
| about.html | 0 | 0 | 0 |
| contact.html | 0 | 0 | 0 |
| catering.html | 0 | 0 | 0 |
| 404.html | 0 | 0 | 0 |

Zero violations of any kind, on any page, in either scan. This confirms A3 (heading-order), A4 (`aria-prohibited-attr` on catering counters), A5 (`aria-allowed-role` on about.html era panels), and A6 (`link-in-text-block` on the contact-page phone link) are all resolved, and the full-ruleset pass finds nothing new introduced by the fixes.

### A1. Skip link, index.html — FIXED, verified

Fresh page load, first `Tab`: `document.activeElement` = `{tag: "A", cls: "skip-link"}`. `Enter` moves real focus to `#main` (`document.activeElement.id === "main"`). Root cause (round 1: `skip.focus()` in the preloader's `exit()` stealing the first tab stop) was removed per `fixlog-A.md` rather than patched around — the loader no longer moves focus at all, which is the simpler-correct fix since it was never a real focus-trapped dialog. Matches the other 5 pages' pre-existing correct behavior.

### A2 / D3. Mobile nav toggle clickable while menu open, all 6 pages, 390px — FIXED, verified

Automated open→close-by-click on all 6 pages at 390x844:

| Page | Opens (`aria-expanded`) | Closes by second click | OK |
|---|---|---|---|
| index.html | true | false | yes |
| menu.html | true | false | yes |
| about.html | true | false | yes |
| contact.html | true | false | yes |
| catering.html | true | false | yes |
| 404.html | true | false | yes |

`--z-nav` raised from 60 to 90 in `assets/css/tokens.css` (now exceeds `--z-overlay: 80`), which fixes the nested-stacking-context bug where `.nav__toggle`'s own `z-index:81` was never compared against `.menu` because it was trapped inside `.nav`'s lower-z-index stacking context. Also stress-tested with 10 rapid taps in ~0.5s on every page (see Devil's Advocate D7 below) — toggle remains responsive, no stuck-open state, zero console errors.

### A3. Footer heading order — FIXED, verified

Queried the full `h1..h6` sequence on all 6 pages. No page has an out-of-order jump:

- `index.html`: H1, H2, H2, H3, H3, H3, H2, H3, H3, H3, H2, H2, H2, H3, H3
- `menu.html`: H1, H2, H3×5, H2, H3×3, H2, H3×7, H2, H3×2
- `about.html`: H1, H2×4, H3×4, H2×3, H3×2
- `contact.html`: H1, H2×3, H3×2
- `catering.html`: H1, H2, H3×3, H2, H3×2, H2, H3×3, H2, H3, H2×2, H3×2
- `404.html`: H1, H2, H2

Every page's footer columns now render `<h3>` (or `<h2>` on `404.html`, which has no other `h2`/`h3` on the page — that keeps `h1 → h2` with no skip, a reasonable per-page adaptation the round-1 report didn't anticipate but is correct). axe's `heading-order` rule independently confirms zero violations. FIXED.

### A4 / A5 / A6. ARIA fixes — FIXED, verified

- `catering.html` tier counters: `<p aria-label="10">` → `<span role="text" aria-label="10">` (etc. for 20/30). `aria-prohibited-attr`: 0 violations.
- `about.html` era panels: `<article role="tabpanel">` → `<div role="tabpanel">`. `aria-allowed-role`: 0 violations.
- `contact.html` inline phone link: `.form__hint a` now carries `text-decoration: underline`. `link-in-text-block`: 0 violations.

### A8. Tap targets — FIXED, verified

Measured at 390x844 on all 6 pages:

- `.skip-link`: 170×44 (was flagged as under-height in round 1's related finding; now exactly 44 tall).
- `.nav__brand`: 44×44.
- `.footer__col a` (6 links checked per page): heights all exactly 44; widths 38-130 depending on link text (WCAG 2.5.5 cares about the shorter axis when the element isn't block-level; all pass on height, several also clear 44 on width).
- `about.html` callbar: `is-on` class present, `<a href="tel:+13105040310">` visible and reachable (44px-tall row, on-screen at y=788-832 in the 844px-tall mobile viewport — no scroll needed to reach it from a typical fold).

Identical results across index, menu, about, contact, catering, 404 — the shared shell CSS fix (`fixlog-A.md`, `.nav__link`/`.skip-link`/`.footer__col a`/`.nav__brand` all given `min-height: var(--tap)`) applies uniformly. FIXED.

### A9. Day-night contrast — FIXED, verified

`assets/js/app.js` `initDayNight()` now sets `--dn-mix` to one of two flat values (0.15 pre-flip / 0.85 post-flip) in lockstep with the `.is-night` class, replacing the continuous scrub that passed through a muddy ~50% grey midpoint in round 1. Confirmed the stepped implementation is still in place (`sec.style.setProperty("--dn-mix", night ? "0.85" : "0.15")`, `assets/js/app.js` line ~476) — this is the same fix `fixlog-A.md` reported and computed contrast for (12.1:1 at mix=0.15, 11.3:1 at mix=0.85), both far above the 4.5:1/3:1 floors, at **every** scroll rest point since there are now only two possible background states rather than a continuum. No residual dead zone. FIXED.

### A10. Prices — all 2 decimals, verified

Scraped all visible `$`-prefixed price text on `menu.html`: `$69.99, $98.99, $49.99, $199.00, $319.00, $449.00, $11.99, $12.99, $16.99, $13.99 (x5), $14.99` — 16 prices, all with exactly two decimals, including the three party platters that were bare integers in round 1 (`$199` → `$199.00`, etc.). `index.html` and `catering.html` show no bare `$`-prefixed text in the current viewport-rendered scrape (their price displays are in seals/data-bound spans picked up by the same `formatPrice()` hydration described in `fixlog-1b.md`); spot-checked catering.html's pricing table and hero seals directly in the DOM and both show `.00`-padded values. FIXED.

### Remaining accessibility items (not deductions, just notes)

- `PLACEHOLDER_ORIGIN`: still confined to `<link>`/meta/JSON-LD on every page; 0 occurrences in any page's rendered `innerText`. Unchanged pass from round 1.
- Reduced-motion, no-JS content, JSON-LD validity: not re-tested exhaustively this round since round 1 found no issues and no fix log touched that surface; spot-checked JSON-LD still parses and `<main>` still carries full body copy in raw HTML on all 6 pages.

### Why not 10.0

Two small deductions keep this at 9.7 rather than a clean 10:
1. `404.html`'s footer heading level (`h2`) diverges from the other five pages' `h3` — locally correct (no skip on that page), but it means a screen-reader user navigating by heading level across the site sees an inconsistent level for the same visual/semantic footer block depending which page they're on. Not a WCAG failure, a minor consistency smell.
2. The local `python3 -m http.server` test harness still does not auto-serve `404.html` for unmatched paths (confirmed again this round — `deep-path` request returns HTTP 404 with the harness's generic body, not the styled custom page). This remains a test-harness limitation flagged in round 1, not a site defect, but it is still unverified end-to-end on the real static host.

---

## DEVIL'S ADVOCATE — 8.9/10.0 — FAIL

### D1 (re-attack). Brand-name fix went the wrong direction — CRITICAL, NEW FINDING

Round 1 found the site inconsistent between "Saffron Food Mart" (correct, per `research/business/facts.md`) and "Saffron Food Market" (wrong), and told `data.js` to be corrected to "Mart." The round-1b fix (`fixlog-1b.md` item 2) did the opposite: it replaced **every** occurrence of "Mart" with "Market" across the whole site, on the stated rationale that "Market" is authoritative because of "the business's own former domain (saffronfoodmarket.com)" and "the owner brief."

Re-checked `research/business/facts.md` directly (lines 4-11), which is the project's own verification doc:
- The address/phone/identity section cites three independent primary listings — **Yelp** (`yelp.com/biz/saffron-food-mart-torrance-2`), **Grubhub** (`saffron-food-mart-3801-pacific-coast-hwy-torrance`), **Zabihah** (`saffron-food-mart-torrance-ca`) — all three use "Mart" in their own listing slugs/titles, not "Market."
- `research/business/assets/manifest.md` line 2 and line 8 independently confirm this from a **photograph of the actual storefront sign**: "red 'Saffron Food Mart 310.504.0310' sign" — this is the single strongest piece of evidence in the whole research set (a photo of the physical signage), and it says "Mart."
- `facts.md` line 7 explicitly states: *"Nearly all public listings... still show the OLD name 'Saffron Food Mart'... Exterior signage in available photos still reads 'Saffron Food Mart / Market · Food · Bakery.'"* — note this line's own reading of the signage photo is "Saffron Food Mart" as the business name, with "/ Market · Food · Bakery" read as separate awning category text ("Market" as in "grocery market," a business-type descriptor), not part of the compound proper name.
- `facts.md` line 12 explicitly calls the old domain "NOT a source for current facts": *"Old website https://www.saffronfoodmarket.com/ describes the prior supermarket-era business — NOT a source for current facts."* The round-1b fix cited exactly this domain as its authority, directly against the facts file's own explicit caution.
- `research/design-brief.md`, the project's own design source-of-truth, uses "Saffron Food Mart" three separate times (lines 39, 61, 92) for testimonial attribution and timeline copy, and only once uses "Market" (line 64) — itself likely a typo in the brief, not a deliberate override of the verified name, since it contradicts the same document's other three uses.

Net: of five independent evidence sources touching this question (Yelp listing, Grubhub listing, Zabihah listing, a photograph of the physical sign, and the design brief's own preponderant usage), four say "Mart" and the fifth (the defunct domain name) is explicitly disclaimed by the facts file as not a valid source. The round-1b fix chose the domain name over the photographed sign and the three verified directory listings, then wrote a comment into `data.js` (lines 19-21) that frames this backwards choice as "the authoritative... spelling," while also acknowledging in the same comment "The Yelp listing used 'Mart'" — i.e., the fix log's own text acknowledges the primary-source evidence it overrode.

This is a confident, thoroughly-documented factual reversal — a business's own visible storefront signage was overruled by an inactive e-commerce domain, and the resulting single wrong string was then propagated into 8+ places across all 6 pages (confirmed via rendered-text grep this round: `market_count` is 1-5 per page, `mart_count` is 0 everywhere). A hungry customer who drives to 3801 Pacific Coast Hwy with "Saffron Food Market" in mind and sees a sign that (per the site's own research) reads "Saffron Food Mart" experiences exactly the kind of address/identity mismatch this lens exists to catch — worse, because round 1 already caught the correct direction and round 1b un-fixed it.

**Exact fix**: revert `assets/js/data.js` line 33 (`formerly:`), the provenance comment at lines 19-21, `story[0].label`/`era__stop-name`, all `testimonials[].who` fields, and every corresponding rendered string in `index.html`, `about.html`, `catering.html`, `contact.html`, `menu.html`, `404.html`, `research/shell-snippets.html` back to "Saffron Food Mart." If there is genuine uncertainty about which spelling the current owner prefers, that is a question for the owner brief, not something to resolve by citing a decommissioned domain the facts file itself disclaims — until confirmed otherwise, weight of evidence (photographed signage + 3 directory listings) says "Mart."

### D2. Price formatting — FIXED, verified

Party-platter prices (`$199`, `$319`, `$449`) now render `$199.00`/`$319.00`/`$449.00` on `menu.html`, matching the two-decimal format of every other item. `fixlog-1b.md`'s approach — keep the authoritative raw values in `data.js` untouched and pad only at display time via a `formatPrice()` hydration helper — is the right call structurally (doesn't risk corrupting the owner-provided price data) and verified working: 16/16 scraped prices on `menu.html` show exactly two decimals, zero bare integers found. FIXED.

### D4. Mobile-first hungry-customer glance test — re-run, PASS, all 6 pages

Re-ran the 390×844 first-fold check this round via the tap-target and callbar scans above: phone number and address remain reachable within the fold/one-scroll on every page (confirmed directly for `about.html`'s callbar: visible, `is-on`, tel link at y=788 well within the 844px viewport). No regression introduced by the round-1b/A/B fixes. PASS.

### D6. Unlicensed assets — unchanged from round 1, PASS

Not re-audited exhaustively this round (no fix log touched `assets/img/` or `MANIFEST.md`); round 1's finding here was MINOR (brand/ornament assets undocumented but not evidenced as third-party) and not flagged as requiring action in any of the three fix logs. Spot-checked `assets/img/MANIFEST.md` is unchanged and still covers the stock photography set with verified sources. No new unlicensed-asset risk introduced.

### D7. Broken-state re-attack — all PASS

- **Rapid mobile nav toggle** (10 taps in ~0.5s, all 6 pages): toggle remained clickable/responsive after the burst on every page, zero console errors, no stuck-open state that resists further input (this is the exact D3/A2 embarrassment scenario from round 1 — confirmed fixed, not just spot-fixed for a slow double-click).
- **Double-click a nav link** (index → menu): single clean navigation, final URL correct, zero console errors/exceptions.
- **bfcache back**: navigated index→menu→back; landed on `index.html`, `<main>` present, no blank/broken intermediate state.
- **Deep-path 404**: `GET /totally/fake/deep-path-xyz` → HTTP 404. (Harness doesn't render the custom `404.html` body locally, same caveat as round 1 — verify on the real host.)
- **PLACEHOLDER_ORIGIN in visible text**: 0 occurrences across all 6 pages' rendered `innerText`, confirmed by direct scrape this round (not just grep of source).

No console errors in any of the above scenarios.

### D5. Dishonesty hunt beyond D1 — no new findings

Re-checked hours language, halal claims, review-quote attribution, and "since"/founding claims — all unchanged from round 1's PASS and no fix log touched them. The D1 brand-name regression above is the only dishonesty issue found this round, but it is CRITICAL on its own.

### Why 8.9 and not lower / not higher

Every round-1 devil's-advocate finding except the brand name is now cleanly fixed and independently re-verified (prices, embarrassment stress tests, mobile glance test, PLACEHOLDER_ORIGIN, unlicensed assets). The remaining gap is concentrated entirely in D1: a single confidently-executed but backwards correction that reintroduces the exact class of defect (unverified/incorrect factual claim about the business's own identity, repeated site-wide) the lens exists to catch, and does so with a fabricated-sounding provenance trail ("the business's own former domain... and the owner brief both use 'Market'") that a careful audit shows is weaker than the evidence it overrode. That is serious enough to hold the score below the bar by itself, but it is a single, well-scoped, single-string fix (revert 8-10 occurrences) rather than a systemic problem, which is why the score sits just under 9.0 rather than back down near round 1's 8.4.

---

## Summary of remaining CRITICAL/MAJOR findings

1. **CRITICAL (D1)** — `assets/js/data.js` and every page's rendered copy say "Saffron Food **Market**"; the weight of verified evidence in `research/business/facts.md` and `research/business/assets/manifest.md` (photographed storefront sign, Yelp/Grubhub/Zabihah listing slugs, the design brief's predominant usage) says "Saffron Food **Mart**." Revert the string in `data.js` line 33 and the provenance comment at lines 19-21, plus every corresponding occurrence in `index.html`, `about.html`, `catering.html`, `contact.html`, `menu.html`, `404.html`, and `research/shell-snippets.html` (8+ occurrences per current grep, `market_count` 1-5 per page / `mart_count` 0 everywhere).

No other CRITICAL or MAJOR findings remain. All accessibility items and all other devil's-advocate items from round 1 are verified fixed.

## Verdict

- **ACCESSIBILITY: 9.7/10.0 — PASS** (bar 9.5).
- **DEVIL'S ADVOCATE: 8.9/10.0 — FAIL** (bar 9.5) — blocked solely by D1 (brand-name reversal). Fix is a single scoped string revert; recommend a fast round 3 focused only on D1 rather than a full re-review, since everything else this round is clean.

## Files referenced

- `/tmp/claude-0/-home-user-Saffron/24349566-67b3-502f-ae5a-53d67a044c7a/scratchpad/saffron-b/assets/js/data.js`
- `/tmp/claude-0/-home-user-Saffron/24349566-67b3-502f-ae5a-53d67a044c7a/scratchpad/saffron-b/assets/js/app.js`
- `/tmp/claude-0/-home-user-Saffron/24349566-67b3-502f-ae5a-53d67a044c7a/scratchpad/saffron-b/assets/css/tokens.css`
- `/tmp/claude-0/-home-user-Saffron/24349566-67b3-502f-ae5a-53d67a044c7a/scratchpad/saffron-b/index.html`, `menu.html`, `about.html`, `contact.html`, `catering.html`, `404.html`
- `/tmp/claude-0/-home-user-Saffron/24349566-67b3-502f-ae5a-53d67a044c7a/scratchpad/saffron-b/research/business/facts.md`
- `/tmp/claude-0/-home-user-Saffron/24349566-67b3-502f-ae5a-53d67a044c7a/scratchpad/saffron-b/research/business/assets/manifest.md`
- `/tmp/claude-0/-home-user-Saffron/24349566-67b3-502f-ae5a-53d67a044c7a/scratchpad/saffron-b/research/design-brief.md`
- `/tmp/claude-0/-home-user-Saffron/24349566-67b3-502f-ae5a-53d67a044c7a/scratchpad/saffron-b/review/site-round1/a11y-devil.md`, `fixlog-A.md`, `fixlog-B.md`, `fixlog-1b.md`
