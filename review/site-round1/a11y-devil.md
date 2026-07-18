# Full-site council, round 1 — ACCESSIBILITY + DEVIL'S ADVOCATE

Site: Saffron & Rice (built, static). Pages audited: index, menu, catering, about, contact, 404.
Method: hand-audit against `references/05-accessibility-seo.md`, keyboard-walked and instrumented with Playwright/Chromium (390x844 mobile viewport unless noted), plus computed-pixel contrast math for the day-night lerp band. No live network calls made; all findings reproducible against the served repo (`python3 -m http.server 8099`).

---

## ACCESSIBILITY — score 8.1/10 (bar 9.5, FAIL)

### What's solid
- Skip link moves real focus into `<main tabindex="-1">` correctly on every page **except index.html** (see CRITICAL-1).
- Mobile menu: `aria-expanded` flips, Escape closes, focus returns to the toggle, `inert` correctly freezes `#main`/`footer` while the nav itself stays live. Verified with a 10x rapid-click stress test — state stays consistent, zero console errors.
- Contact form: `aria-invalid`, `aria-describedby`→`role="alert"` wiring, and focus-to-first-invalid-field all work as specified (verified live: submitting empty sets `aria-invalid="true"` on `c-name`/`c-phone`/`c-message`, fills the alert nodes, and moves focus to `c-name`).
- `:focus-visible` ring renders (2px solid, `outline-style:solid`) on links and on contact-form inputs on both light and dark grounds; not suppressed by a bare `outline:none`.
- `about.html` era scrubber is a real `role="tablist"`: Arrow/Home/End all move both focus and `aria-selected` correctly.
- `prefers-reduced-motion: reduce` and no-JS both leave all `[data-reveal]`/`[data-scramble]` content at full opacity on every page (0 elements stuck hidden in either mode). No-JS body text is fully present (2.4–3.9k chars per page).
- Heading order is clean (single `h1`, sequential `h2`/`h3`) on every page; landmarks (`main`, `nav`, `footer`) all present and correctly counted.
- `aria-current="page"` set correctly in both the desktop nav and the mobile overlay nav on every page.
- All 5 JSON-LD blocks (index/menu/catering/about/contact) parse as valid JSON; 404.html intentionally ships none and carries `<meta name="robots" content="noindex, nofollow">`. `sitemap.xml` lists exactly the 5 canonical pages (404 correctly excluded); `robots.txt` points at the sitemap and both use the same `PLACEHOLDER_ORIGIN` token, which never leaks into visible copy (grep confirms it only appears in `<link>`/`<meta>`/JSON-LD/comments).
- No console errors under stress (rapid toggle spam, mid-load viewport resize 390→1400→390).

### CRITICAL

**C-1. index.html: the poetic preloader steals the FIRST Tab from the skip link, and traps nothing while doing it.**
- File: `assets/js/app.js`, function `runLoader()`, line ~231: `if (skip) { skip.focus(); ... }`.
- Repro: fresh session (no `snrIntroSeen`), Tab once → focus lands on `.loader__skip` ("Skip" button inside the intro overlay), NOT on `.skip-link`. Verified: on index.html the first real keyboard Tab after page load goes to `nav__brand`, not the skip link — because JS already moved focus into the loader on boot, and the loader has no focus trap (no `inert` on the rest of the page, no `aria-modal="true"`), so a second Tab escapes straight into the live nav underneath the still-visible, still-animating overlay.
- Why it matters: (a) it silently defeats A3's "skip link is the first focusable element" contract — true only on menu/catering/about/contact/404, false on the actual homepage, the page most first-time visitors land on; (b) `role="dialog"` with no `aria-modal="true"` and no `inert`/focus-trap means a screen-reader or keyboard user can tab into nav links, form controls, etc. that are visually covered by the opaque `--ink` overlay for up to ~1.75s, an confusing "click something you can't see" state.
- Fix: add `aria-modal="true"` to `.loader`, and freeze the rest of the document (`document.querySelector('#main')?.toggleAttribute('inert', true)` plus the nav, or simplest: give the loader itself a `inert` release on `.loader` remove) while it is active, same pattern already used correctly for the mobile menu at line ~141. Alternative if a trap is too heavy for a 1.75s decorative overlay: don't call `skip.focus()` at all — let the skip link keep its natural place as first-Tab target, and let the loader be purely visual/`aria-hidden="true"` with `pointer-events` disabled after the initial word animation.

### MAJOR

**M-1. Footer links fail the 44px minimum tap target on every page, including the site's own reference doc's example.**
- File: `assets/css/app.css:478` — `.footer__col a { min-height: 32px; display: inline-flex; align-items: center; width: fit-content; }`
- The project's own `05-accessibility-seo.md` (A5) explicitly lists `.footer__col a` in the sample selector list that must clear 44px. Measured live: footer "Home"/"Menu"/"Catering & Platters"/"About"/"Contact" links and the footer phone number are 32px tall on every one of the 6 pages (index/menu/catering/about/contact/404 all share the same footer markup).
- Fix: `assets/css/app.css:478` → `min-height: var(--tap);` (44px), matching `.menu__foot a` two lines below which already does this correctly (line 204: `min-height: var(--tap)`).

**M-2. Day-night lerp band drops below AA contrast for both text colors right around the 55% flip, on index.html.**
- File: `assets/css/app.css:308-312` (`.daynight` / `.daynight.is-night`), driven by `assets/js/app.js:445-458` (`initDayNight`).
- Computed (not eyeballed): `--ink #0e110f` / `--paper #f6efe1`, background = `color-mix(in srgb, ink calc(dn-mix*100%), paper)`, text flips from ink→paper in one step exactly at scroll progress 0.55.
  | progress (t) | bg rgb | ink-text contrast | paper-text contrast |
  |---|---|---|---|
  | 0.30 | (176,172,162) | 8.42:1 pass | 1.97:1 |
  | 0.50 | (130,128,120) | 4.80:1 pass (barely) | 3.46:1 fail |
  | **0.549** (just before flip) | (119,117,110) | **4.12:1 FAIL** | 4.03:1 fail |
  | 0.55 (flip point) | (118,117,109) | — | 4.04:1 fail |
  | 0.60 | (107,106,99) | 1.75:1 | 4.76:1 pass |
- There is a real dead zone from roughly t=0.42 through t=0.63 where BOTH the pre-flip ink text and the post-flip paper text sit under 4.5:1 (body-text AA). Because this is scroll-scrubbed (`scrub: true`), a user can stop scrolling and rest exactly in that zone — it isn't a transient animation frame, it's a pin-able low-contrast state. Section: `<section class="daynight home-daynight" data-daynight>` on index.html only.
- Fix options (pick one): (a) don't let text sit on the raw lerped background — give `.daynight` copy a scrim/backdrop (e.g. a fixed-opacity `--ink`/`--paper` chip behind headline+body text) so contrast stays constant regardless of `--dn-mix`; (b) narrow the flip window so `dn-mix` itself snaps near the same point the text flips (e.g. use a `steps()`-like snap on background at 45%/65% instead of a smooth 0→1 scrub) so the background is never allowed to sit at the visually "grey" midpoint while text is present; (c) simplest — move the mid-40%..60% band's copy off the animated element entirely (put text in a sibling with a solid, non-lerping background).

### MINOR

- **Mn-1.** `.skip-link` itself (`assets/css/app.css:17-31`) computes to ~40px tall (`padding:10px 18px` on `--fs-mono` text), under the 44px floor. Low priority since it's a keyboard-only, focus-revealed control, but cheap to fix: add `min-height: var(--tap); display:inline-flex; align-items:center;`.
- **Mn-2.** `.nav__brand` (`assets/css/app.css:116` + mobile override `526`) measures 40px wide at narrow viewports once the wordmark text is squeezed out, 4px under 44 on the width axis (height is fine at 44 from `min-height: var(--tap)`). Add `min-width: var(--tap)`.
- **Mn-3.** Inline `say-hello__tel` (contact.html) and other in-sentence tel links measuring <44px are WCAG-exempt (2.5.8 explicitly excludes links inside a block of text) — noted only so the council doesn't double-count these as M-1's siblings.

---

## DEVIL'S ADVOCATE — score 8.4/10 (bar 9.5, FAIL)

### Mobile hungry-customer test (phone / address / a price within 10s)
Tested at 390×844, cold load, waited past the 2.2s loader cap.

| Page | Tel link visible in first viewport | Address visible on page | Price visible in first viewport |
|---|---|---|---|
| index.html | yes (hero) | yes | no (fine, home isn't a menu page) |
| menu.html | yes | yes | yes (sticky call bar + first menu row) |
| catering.html | yes (x2) | yes | no — platter prices are one scroll below the hero |
| **about.html** | **NO** | yes (footer only, off-screen) | no (expected, About isn't pricing) |
| contact.html | yes (hero "fact" card) | yes | n/a |

**MAJOR-DA-1: about.html has no reachable phone number in the first mobile viewport, and its sticky call bar is dead.**
- File: `about.html:392` — `<div class="callbar">` ships WITHOUT the `is-on` class, so per `assets/css/app.css:512-520` (`@media (max-width:700px){ .callbar.is-on{display:block} }`) it never renders on mobile. Compare `catering.html:411` and `menu.html:491`, which both hard-code `class="callbar is-on"` and so DO show the sticky call bar.
- Also confirmed `assets/js/app.js` has no code anywhere that toggles `.is-on` on `.callbar` (grepped) — this isn't a scroll-triggered progressive reveal, it's simply inconsistent between pages: 2 of 6 pages hardcode it on, 4 (index/about/contact/404) hardcode it off.
- Net effect: a mobile visitor who lands on About (a very plausible entry page for someone checking legitimacy/ownership before calling) has to open the hamburger menu or scroll to the footer to find a phone number. That's a real hungry-customer failure.
- Fix: either (a) add `is-on` to the callbar on every page for consistency (cheapest, matches the design intent implied by the class name for a phone-forward restaurant), or (b) if the intent really is scroll-triggered, wire up the missing JS in `app.js` (a simple ScrollTrigger toggling `.is-on` past e.g. the hero) and apply it uniformly — right now it's neither purely static nor purely dynamic, it's an accidental 2-vs-4 split.

### Dishonesty hunt vs `research/business/facts.md`
No violations found — this is the strongest part of the build:
- No "certified halal" claim anywhere (facts.md flags certification as unverified); copy consistently says plain "halal."
- Hours are uniformly softened to "Open daily, call to confirm hours" / "Open daily, call (310) 504-0310 to confirm hours" on every page — matches the facts.md instruction to not assert conflicting hour ranges.
- No `aggregateRating` in any JSON-LD block (facts.md explicitly says omit rather than fabricate) — confirmed via grep, zero hits for `aggregateRating`/`ratingValue`/`reviewCount`.
- Testimonials on index.html are explicitly captioned "Yelp reviewer, on the kitchen in its **Saffron Food Mart era**" — correctly disclosing they predate the ownership change rather than passing off old-era reviews as endorsements of the new kitchen.
- Address (3801 Pacific Coast Hwy, Torrance, CA 90505) and phone ((310) 504-0310) match facts.md exactly everywhere checked, including JSON-LD.
- "Formerly Saffron Food Market, now under new management" disclosure appears in the footer on every page — good, matches the ownership-lineage honesty requirement.

### Unlicensed/unused assets
- `assets/img/MANIFEST.md` shows all 17 shipped photos are individually verified Unsplash-License stand-ins with a disclosure requirement — no licensing violation found.
- **MINOR-DA-2:** 8 of those 17 images (16 files counting `.jpg`+`.webp` pairs: `bread-bakery`, `flatbread`, `herbs-sabzi`, `kabab-flame`, `saffron-threads`, `shawarma-platter`, `tea-hands`, `wrap`) are in `assets/img/` but are not referenced by any `.html` or `.css` file on the built site — dead weight shipped to the repo/deploy target with no user-facing benefit (not a dishonesty issue since they're properly licensed and manifest-disclosed, just repo hygiene). Either wire them into a page (several would suit the About "heritage" section or Menu's bread/sandwich rows) or drop them from `assets/img/` and the manifest.

### Embarrassment / stress hunt
- Rapid nav-toggle spam (10 clicks, 30ms apart) on index.html: state stays consistent (`aria-expanded="true"`, `menu-open` class, `inert` on `#main`), zero console errors.
- Mid-load viewport resize (390→1400→390 during initial page load): zero console errors, page settles cleanly.
- Deep nonexistent path (`/some/deep/nonexistent/path.html`) returns HTTP 404 from the dev server; the custom `404.html` itself is well-formed with `noindex,nofollow` (Python's `http.server` won't route to it automatically — that's a static-host config concern for the eventual deploy target, e.g. GitHub Pages' `404.html` convention, not a defect in this repo).
- No em dashes found anywhere in the 6 HTML files (grepped `—` outside of `&mdash;`, zero hits) — matches the house style rule.
- Price formatting is consistent everywhere checked: JSON-LD `MenuItem.offers.price` values (e.g. `69.99`, `199`) match the rendered `<span data-item-price>` values exactly, all rendered with a `$` glyph via `.mrow__cur`, no stray "USD"/comma/decimal-count drift found.
- `PLACEHOLDER_ORIGIN` never leaks into rendered/visible text on any page — confirmed by grep, it only appears inside `<link rel=canonical>`, OG/Twitter meta, JSON-LD `url`/`image`/`logo`/`@id` fields, and HTML comments explaining the deploy sed step.

---

## Score summary

| Lens | Score | Bar | Verdict |
|---|---|---|---|
| Accessibility | 8.1 / 10 | 9.5 | FAIL |
| Devil's Advocate | 8.4 / 10 | 9.5 | FAIL |

## Top fixes to re-run before round 2

1. **C-1** — `assets/js/app.js` `runLoader()`: stop `skip.focus()` from hijacking the first Tab on index.html, or properly trap the loader dialog (`aria-modal="true"` + `inert` on the rest of the page, mirroring the existing mobile-menu pattern at `app.js:141`).
2. **M-1** — `assets/css/app.css:478`: `.footer__col a { min-height: 32px }` → `min-height: var(--tap)` (44px), site-wide (all 6 pages share this footer).
3. **M-2** — `assets/css/app.css:308-312` + `assets/js/app.js:445-458`: fix the day-night lerp so no scrollable resting point on `.daynight.home-daynight` (index.html) drops text below 4.5:1 — add a scrim/solid backdrop behind the copy, or snap the background transition to match the text's single-step flip.
4. **DA-1** — Make the sticky mobile call bar consistent: either add `is-on` to `about.html`/`index.html`/`contact.html`/`404.html`'s `<div class="callbar">` to match `catering.html`/`menu.html`, or wire the missing scroll-trigger JS and apply it everywhere. About.html in particular currently has zero reachable phone number in the first mobile viewport.
5. **Mn-1/Mn-2** — `assets/css/app.css:17` (`.skip-link`) and `:116`/`:526` (`.nav__brand`) — bump both to the 44px floor for full A5 compliance.
