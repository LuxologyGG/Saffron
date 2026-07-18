# Round 1b Fix Log

Addresses the late council report `review/site-round1/a11y-devil.md` (Accessibility 7.8, Devil's Advocate 8.4, both FAIL against the 9.5 gate).

## 1. CRITICAL - Mobile nav toggle unclickable while menu open

`assets/css/tokens.css`: `--z-nav` raised from `60` to `90` (now exceeds `--z-overlay: 80`). Root cause was a nested-stacking-context bug: `.nav__toggle`'s own `z-index: calc(var(--z-overlay) + 1)` (81) was never compared against `.menu` (80) because `.nav__toggle` is trapped inside `.nav`'s stacking context, which only had `z-index: 60`.

Verified with Playwright at 390x844 on all 6 pages: open the menu, click the toggle again. `toggle_close_clickable: True` and `aria-expanded` returns to `"false"` on every page (index, menu, about, contact, catering, 404).

## 2. CRITICAL - Naming consistency: "Saffron Food Mart" -> "Saffron Food Market"

Per the owner brief and the business's own former domain (saffronfoodmarket.com), "Market" is authoritative. Replaced every occurrence of "Saffron Food Mart" with "Saffron Food Market" in:
- `assets/js/data.js` (`company.formerly`, `story[0].label`, all 3 `testimonials[].who` fields, plus a new honest provenance note explaining Yelp used "Mart" but display is standardized to "Market")
- `about.html` (era stop name, era label, 3 testimonial figcaptions)
- `index.html`, `catering.html` (testimonial figcaptions)
- `404.html` (data-site fallback text)
- `research/shell-snippets.html` (source-of-truth template, not a served page, fixed for consistency)

Repo-wide grep for "Food Mart" across `*.html`, `*.js`, `*.css` returns zero matches.

## 3. MAJOR - Footer heading order skip (h2 -> h4)

Changed the footer `<h4>Explore</h4>` / `<h4>Visit</h4>` on `index.html`, `menu.html`, `about.html`, `contact.html`, `catering.html` to `<h3>` (each of these pages already has an `<h2>` and `<h3>` earlier in the document, so h3 continues the existing hierarchy without a skip).

`404.html` has no `<h2>`/`<h3>` anywhere else on the page (only the `<h1>`), so its footer headings were changed to `<h2>` instead, keeping `h1 -> h2` with no skip there.

CSS: `.footer__col h4 { ... }` in `assets/css/app.css` updated to `.footer__col h2, .footer__col h3 { ... }` so visual styling (mono eyebrow style) is preserved regardless of the semantic level used per page.

Verified via Playwright: queried `h1..h6` sequence on all 6 pages at both viewports and both motion settings (24 checks total), zero heading-order skips detected, and axe-core's `heading-order` rule reports no violations on any page.

## 4. MAJOR - Price display consistency (party platters)

Did not change the authoritative values in `assets/js/data.js` (`"199"`, `"319"`, `"449"` stay as owner-provided strings). Added a one-line comment above the `party-platters` item list explaining prices are authoritative and display always pads to 2 decimals.

Display-side fix:
- `assets/js/app.js`: added a `formatPrice()` helper (`parseFloat(v).toFixed(2)`), exposed as `window.formatPrice` for reuse by page modules, and wired into `hydrate()` so any `[data-site]` node whose path ends in `.price` renders padded (covers `index.html`'s home-teaser prices, which use `data-site="menu.0.items.N.price"`).
- `assets/js/pages/menu.js`: `verifyMenu()`'s data-fidelity healer now compares/heals against `formatPrice(item.price)` instead of the raw string, so it won't "heal" the static `199.00` back down to `199`.
- Static HTML updated to show 2 decimals: `menu.html` (`data-item-price`), `catering.html` (both the decorative hero seals and the `data-menu-price` pricing-table seals).

Verified: scraped all `[data-item-price]`, `[data-menu-price]`, `.mrow__price`, `.seal span` text nodes across all 6 pages/viewports/motion settings, zero bare-integer prices remain; every visible price renders with 2 decimals (`199.00`, `319.00`, `449.00`, alongside the existing `69.99` etc.).

## 5. ARIA fixes

**(a) catering.html counters, `aria-prohibited-attr`.** SplitText (with `aria:"auto"`, the default) sets `aria-label` on the element it splits, and `<p>`'s implicit role doesn't support `aria-label` as an accessible-name source. Changed the three tier-count elements from `<p class="tier__num display">10</p>` (etc., 10/20/30) to `<span class="tier__num display" role="text">10</span>`, matching the ARIA 1.2 `role="text"` pattern for flattening animated sub-markup into one string for AT. Added `display: block` to `.tier__num` in `assets/css/pages/catering.css` since the element is no longer a block-level `<p>` by default.

**(b) about.html era panels, `aria-allowed-role`.** `role="tabpanel"` was applied to `<article>` elements (`#era-panel-0`, `#era-panel-1`), whose implicit role isn't in some validators' allow-list for that override. Changed both to `<div class="era__panel" ...>` (open and close tags). Confirmed `assets/js/pages/about.js` only ever selects panels via the `[data-era-panel]` attribute, never by tag name, so no JS changes were needed.

**(c) contact.html link-in-text-block.** The inline phone link inside `.form__hint` relied on color alone. Added `text-decoration: underline; text-underline-offset: 2px;` to `.form__hint a` in `assets/css/pages/contact.css` (hover state now thickens the underline instead of introducing it).

Verified via axe-core (`aria-prohibited-attr`, `aria-allowed-role`, `link-in-text-block`, `heading-order`) on all 6 pages at 1440x900: zero violations for any of the four tracked rules.

## Verification summary

- Server: `python3 -m http.server 8080` from repo root.
- Playwright: `/opt/pw-browsers` chromium, `PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers`.
- Matrix: 6 pages x 2 viewports (1440x900, 390x844) x 2 motion settings (normal, `prefers-reduced-motion: reduce`) = 24 checks.
  - Console errors / page errors: 0 across all 24 checks.
  - Heading-order skips (h1..h6 sequence, own script + axe-core `heading-order`): 0 across all 24 checks and all 6 pages.
  - "Food Mart" string anywhere in rendered body text: 0 across all 24 checks.
  - Bare-integer (no-decimal) visible prices: 0 across all 24 checks.
- Mobile nav toggle open-then-close-by-click: verified separately at 390x844 on all 6 pages, `toggle_close_clickable: True` and `aria-expanded` returns to `"false"` on every page.
- axe-core targeted rules (`aria-prohibited-attr`, `aria-allowed-role`, `link-in-text-block`, `heading-order`) at 1440x900: 0 violations on all 6 pages.

No em dashes were introduced. No hidden-until-JS CSS states were introduced (the `formatPrice` hydration only rewrites already-visible text content; static fallback markup was updated in place rather than relying on JS to fix a hidden default).
