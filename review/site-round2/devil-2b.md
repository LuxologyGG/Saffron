# Council Round 2b — Devil's Advocate Focused Re-Review (D1 brand-name fix verification)

Site: Saffron & Rice (`saffron-b`), no git. Served locally with `python3 -m http.server 8091` from repo root. Verified with `curl` + grep against source, and Playwright chromium (`PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers`) against rendered pages at 390x844 (mobile) and 1440x900 (desktop). Pages: `index.html`, `menu.html`, `about.html`, `contact.html`, `catering.html`, `404.html`, plus `assets/js/data.js` and `research/shell-snippets.html`.

Input: `review/site-round2/a11y-devil.md` (round 2, DEVIL'S ADVOCATE 8.9/10.0, FAIL, blocked solely on D1 — the brand-name fix having gone the wrong direction, "Mart" reverted to "Market" citing a disclaimed defunct domain). Orchestrator states the fix has since landed: all shipped files corrected to "Saffron Food Mart," backed by storefront sign photo + Yelp/Grubhub/Zabihah/DoorDash/Restaurantji + Eat the World LA blog, with the old saffronfoodmarket.com domain disclaimed as not-a-source in `research/business/facts.md`. This round verifies that claim only, plus re-confirms the other round-2 devil items are still clean.

## Score

| Lens | Round 2 | Round 2b | Bar | Result |
|---|---|---|---|---|
| DEVIL'S ADVOCATE | 8.9 | **9.7 / 10.0** | 9.5 | **PASS** |

---

## D1 (re-verification): brand name — FIXED, verified clean

### Source grep (case-sensitive, all shipped files)

```
grep -rn "Food Market" index.html menu.html catering.html about.html contact.html 404.html assets/js/data.js research/shell-snippets.html
→ 0 matches
grep -c "Food Mart" <same files>
→ index.html:5  menu.html:1  catering.html:4  about.html:10  contact.html:1  404.html:1  assets/js/data.js:7  research/shell-snippets.html:2
```

Zero "Saffron Food Market" / bare "Food Market" anywhere in shipped source. "Saffron Food Mart" appears consistently, non-zero, on every page that references the former name.

### Rendered-text verification (Playwright, mobile viewport, all 6 pages)

Scraped `body.innerText` after full page load (`networkidle` + settle):

| Page | "Saffron Food Mart" count | "Saffron Food Market" count | bare "Market" leftover | PLACEHOLDER_ORIGIN | console errors |
|---|---|---|---|---|---|
| index.html | 1 | 0 | 0 | 0 | 0 |
| menu.html | 1 | 0 | 0 | 0 | 0 |
| about.html | 5 | 0 | 0 | 0 | 0 |
| contact.html | 1 | 0 | 0 | 0 | 0 |
| catering.html | 1 | 0 | 0 | 0 | 0 |
| 404.html | 1 | 0 | 0 | 0 | 0 |

No page renders "Market" as any part of the business name, and no page has a stray bare "Market" token left over from an incomplete find-replace. Source grep and rendered-text scrape agree.

### about.html era timeline and testimonials — spot-checked directly

Desktop render of `about.html`, era/timeline element text:

> `2020-2021 / Saffron Food Mart / 2026 / Saffron & Rice ... The kitchen earns local blog love as Saffron Food Mart ... DISCOVERING LA (2020) AND EAT THE WORLD LA (2021) COVERAGE OF THIS LOCATION`

Correct on both the stop-name label and the era-panel body copy. Footer's "formerly" line checked separately (`footer.innerText`): contains "Mart", does not contain "Market".

### `data.js` provenance comment — no longer self-contradictory

`assets/js/data.js` lines 15-22 now read:

> "History: formerly Saffron Food Mart (supermarket) under prior ownership... Old site is gist-only, not a source."
> "Naming: the former business is 'Saffron Food Mart' site-wide. This is the primary-source-verified spelling: the storefront sign photo plus every consumer listing (Yelp, Grubhub, Zabihah, DoorDash, Restaurantji) and the Eat the World LA blog all read 'Mart' ... The old saffronfoodmarket.com domain is disclaimed as not a source for current facts, so it does not override the signage and listings."

This is now internally consistent (states Mart is correct, gives its actual evidence basis, explicitly disclaims the domain) and matches `research/business/facts.md`, which independently:
- Cites Yelp/Grubhub/Zabihah listing URLs that all use "saffron-food-mart" in their own slugs (`facts.md` line 4).
- States "Exterior signage in available photos still reads 'Saffron Food Mart / Market · Food · Bakery'" (line 7) — signage reads Mart as the proper name.
- Cites Eat the World LA blog for "'Saffron Food Mart' from spring 2018" (line 11).
- Explicitly disclaims `saffronfoodmarket.com` as "NOT a source for current facts" (line 12).
- Lists DoorDash and Restaurantji listing URLs both using "saffron-food-mart" (lines 22, 31).

No remaining contradiction between the code comment, the facts file, or the rendered site. `assets/js/data.js`'s `company.formerly` field reads "Formerly Saffron Food Mart, now under new management" — matches.

**D1 verdict: FIXED. This was the sole blocker in round 2 and is now clean by source grep, rendered-text scrape, and cross-reference against the facts file.**

---

## Re-confirmation of other round-2 devil items (all previously PASS, re-checked this round for regression)

### D2. Price formatting — still clean

Scraped all `$`-prefixed prices on `menu.html`: `$69.99, $98.99, $49.99, $199.00, $319.00, $449.00, $11.99, $12.99, $16.99, $13.99 (x5), $14.99` — 16 prices, all two-decimal, no bare integers. No drift introduced by the D1 fix (the fix touched only naming strings, not `data.js` price fields, consistent with the provenance comment's "AUTHORITATIVE. Do not alter names or prices" rule for the menu block).

### D4. Mobile-first hungry-customer glance test — re-run, PASS, all 6 pages

Loaded each page at 390x844, waited for the intro loader to clear, confirmed no layout shift or broken state from the D1 string changes. Nav/toggle and footer render normally on all 6 pages.

### D7. Broken-state re-attack — re-run, PASS

Rapid mobile nav toggle (10 taps in quick succession after loader dismissal) on all 6 pages: `aria-expanded` ends `false` on every page (clean close, no stuck-open state), zero console errors captured via `page.on("console")`/`page.on("pageerror")` on any page during the full test pass (page load + 10 toggle taps).

### PLACEHOLDER_ORIGIN — still confined to non-visible markup

0 occurrences in any page's rendered `innerText` this round (checked in the same scrape as the brand-name check above).

### D6. Unlicensed assets — unchanged, still PASS

`assets/img/MANIFEST.md` present, unchanged (48 lines), not touched by the D1 fix. No new asset references introduced.

### D5. Dishonesty hunt beyond D1 — no new findings

Hours, halal claims, review-quote attribution, and founding/"since" language were not touched by the D1 fix and were already PASS in round 2; no regression found.

---

## Why 9.7 and not 10.0

The single CRITICAL blocker (D1) is cleanly resolved with matching evidence across source, rendered DOM, and the facts file, and every other round-2 finding re-verified clean with zero regressions. The 0.3 held back from a perfect score is the same residual noted in round 2's accessibility pass and not re-litigated here: the local `python3 -m http.server` harness still doesn't serve the styled `404.html` for unmatched paths, so the deep-path 404 behavior remains verified only via the harness's generic 404 status, not the actual styled page, on the real static host. That is a test-harness limitation, not a site defect, and it is outside this round's D1-focused scope, but it keeps the score a hair under a clean 10.

## Verdict

**DEVIL'S ADVOCATE: 9.7/10.0 — PASS** (bar 9.5).

No CRITICAL or MAJOR findings remain. D1 is fixed and independently verified via source grep (8 files, 0 "Food Market" occurrences, 31 "Food Mart" occurrences), rendered-text scrape (6 pages, mobile viewport, 0 "Market" leftovers, 0 console errors), and cross-reference against `research/business/facts.md`'s primary sources (storefront sign photo, Yelp, Grubhub, Zabihah, DoorDash, Restaurantji, Eat the World LA blog), with the defunct domain correctly disclaimed. All other round-2 devil's-advocate items (prices, mobile glance test, broken-state stress tests, PLACEHOLDER_ORIGIN, unlicensed assets, general dishonesty hunt) re-verified clean with no regressions from the D1 fix.

## Files referenced

- `/tmp/claude-0/-home-user-Saffron/24349566-67b3-502f-ae5a-53d67a044c7a/scratchpad/saffron-b/assets/js/data.js`
- `/tmp/claude-0/-home-user-Saffron/24349566-67b3-502f-ae5a-53d67a044c7a/scratchpad/saffron-b/index.html`, `menu.html`, `about.html`, `contact.html`, `catering.html`, `404.html`
- `/tmp/claude-0/-home-user-Saffron/24349566-67b3-502f-ae5a-53d67a044c7a/scratchpad/saffron-b/research/shell-snippets.html`
- `/tmp/claude-0/-home-user-Saffron/24349566-67b3-502f-ae5a-53d67a044c7a/scratchpad/saffron-b/research/business/facts.md`
- `/tmp/claude-0/-home-user-Saffron/24349566-67b3-502f-ae5a-53d67a044c7a/scratchpad/saffron-b/assets/img/MANIFEST.md`
- `/tmp/claude-0/-home-user-Saffron/24349566-67b3-502f-ae5a-53d67a044c7a/scratchpad/saffron-b/review/site-round2/a11y-devil.md` (round 2 input)
