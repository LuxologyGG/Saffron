# Integration pass, Saffron & Rice rebuild B

Date: 2026-07-18. Scope: centralize the page agents' scoped shell fixes,
remove cross-page inconsistencies, standardize the canonical origin,
and re-verify the whole site. All page work was done by six parallel
page agents; this pass touched only shared shell files, page heads, and
the scoped duplicates listed below.

## 1. Shell fixes centralized (landed once, duplicates removed)

### 1a. .on-dark ground paint
- ADDED tokens.css: `:where(.on-dark) { background-color: var(--bg);
  color: var(--fg); }` directly under the `.on-dark` token re-point
  block. `:where()` keeps specificity at zero so page rules (gradient
  heroes, the day-to-night band) still win with a bare class selector.
- REMOVED the scoped duplicates:
  - home.css: scope-level `.on-dark { background-color/color }` block;
    also the now-redundant single-property grounds on `.home-counter`,
    `.home-testimonials`, `.home-disclosures` (all on-dark-only).
  - menu.css: `:where(.on-dark) { color: var(--fg); }` repair block;
    redundant `background: var(--bg)` on `.mindex` and `.mdisclose`.
  - catering.css: the `.stews, .book, .page-catering .footer` paint
    rule (`.stews { overflow: clip; }` kept).
  - about.css: `.halal` trimmed to `{ overflow: clip; }`.
  - contact.css: `.contact-hero` and `.say-hello` ground declarations
    trimmed.
  - 404.css: `.nf` ground declarations trimmed. `body { background:
    var(--ink); }` KEPT (intentional: whole-page night overscroll).
- KEPT intentional per-section grounds that differ or serve light
  sections: `.mhero` (radial gradient over var(--bg)), `.mcat` (applies
  to light and dark chapters), `.home-welcome`, `.home-trio`
  (paper-1), `.spread`, `.combos`, `.occasions`, `.disclosure`,
  `.dn-band--day/night`, `.setline__cover` (element, not a scope).

### 1b. .nav__toggle stacking
Already in app.css (`flex-direction: column` on the toggle). Removed
the scoped copies from home.css, catering.css (`.page-catering
.nav__toggle`), and 404.css. No copies existed in menu/about/contact.
Verified at 390px: computed `flex-direction: column`, burger renders as
three stacked bars.

### 1c. Footer paint
Present ONCE in app.css (`.footer { background: var(--bg); color:
var(--fg); }`); comment updated to reference the central rule. The
catering-scoped copy (part of 1a's removed rule) is gone.

### 1d. Footer giant wordmark contrast
MOVED from home.css to app.css: `.footer__wordmark img { filter:
invert(1) hue-rotate(180deg); opacity: .9; }`. Before this, the
near-ink wordmark SVG was invisible on the night footer of menu,
catering, about, contact, and 404 (only home had the fix). Verified by
screenshot on all six pages (review/pages/integration/footer_*.png):
cream script, gold ampersand, rose RICE, consistent everywhere.

### 1e. SplitText descender clipping
MOVED from contact.css to app.css: `[data-reveal="lines"]
.snr-mask-line-mask { padding-bottom: .16em; margin-bottom: -.16em; }`.
The class is derived from app.js `linesClass: "snr-line"` (SplitText
suffixes every word in the class with `-mask`), so the fix now covers
masked line reveals on every page, not just Contact.

## 2. Canonical origin standardized

- Every canonical link, og:url, og:image, twitter:image, JSON-LD
  url/image/logo/@id, sitemap `<loc>`, and the robots `Sitemap:` line
  now uses the literal token `https://PLACEHOLDER_ORIGIN` as origin
  with the real path kept (e.g. `https://PLACEHOLDER_ORIGIN/menu.html`).
  - index/menu/catering/about: were hardcoded
    `https://luxologygg.github.io/Saffron/...`, now tokenized.
  - contact/sitemap/robots: were bare `PLACEHOLDER_ORIGIN/...`, now
    carry the `https://` scheme literally so the swap is host-only.
  - 404.html intentionally carries no absolute URLs (noindex).
- Head comments about the origin updated and made identical on all
  five indexed pages.
- ADDED deploy/ORIGIN-SWAP.md: the one-command sed
  (`sed -i 's|PLACEHOLDER_ORIGIN|luxologygg.github.io/Saffron|g' ...`),
  custom-domain variant, and post-swap verification grep.
- Dry-ran the swap on a copy: zero tokens left, URLs match the exact
  previous GitHub Pages URLs byte for byte.

## 3. Head consistency

- CSS order now IDENTICAL on all six pages: fonts.css ->
  vendor/lenis.css -> tokens.css -> app.css -> pages.css ->
  pages/<page>.css. pages.css (the shared-page-styles stub prescribed
  by the shell head block) was linked only on index and menu; now on
  ALL six. This also fixes a real bug: contact.html uses `.repnote`,
  which lives in pages.css and was unstyled there.
- The "CSS cascade order is STRICT" comment now names the same chain
  everywhere; contact's stale "(No shared pages.css exists in this
  build)" note removed.
- Favicons: index's full generated set (favicon.ico + 32/48/192/512
  PNG + apple-touch-icon) copied to all six pages; the other five had
  been pointing at the raw logo PNG.
- JS order verified identical everywhere: gsap -> ScrollTrigger ->
  SplitText -> ScrambleText -> CustomEase -> lenis -> data.js ->
  app.js -> pages/<page>.js.

## 4. Bug found by integration testing: page-transition blackout

The curtain's CSS resting state `transform: translateY(101%)` computes
to a PIXEL matrix (+909px at 900px viewport). GSAP reads that as a
persistent pixel `y` offset underneath every `yPercent` tween, so:
- the exit wipe animated one viewport too low (never covered the page),
- the entry reveal ENDED at viewport top, leaving the full-viewport ink
  panel covering every page reached through an internal link
  (screenshot evidence: scratchpad curtain_bug_after_reveal.png, solid
  ink). pointer-events: none kept clicks working, which is why nothing
  else failed.
Each page agent tested its page via direct load (the covered flag never
set), so only the cross-page click-through exposed it.

FIX (app.js initCurtain): after building the curtain,
`gsap.set(curtain, { y: 0, yPercent: 101 })` zeroes the pixel offset
and takes ownership in percentage space. Verified: exit wipe covers
mid-transition (top 376px at 300ms), entry reveal ends fully offscreen
above (translateY(-909px)), arriving page fully visible.

## 5. Other integration fixes

- menu.html opts the sticky call bar on (`callbar is-on`) but lacked
  catering's footer-bar clearance; added the same `@media (max-width:
  700px) { .footer__bar { padding-bottom: 84px; } }` to menu.css.
  Callbar `is-on` remains a per-page opt-in per the shell snippet
  (menu + catering on; other pages ship the bar in DOM, off).
- assets/img/ornament/README.md title had the repo's only text
  em dash in a shipped file; replaced.

## 6. Verification matrix

Server: python3 http.server (localhost). Browser: headless Chromium
141 via Playwright. Checks per cell: zero console errors, zero page
errors, zero failed requests (incl. any status >= 400), zero external
requests, footer wordmark filter applied, footer ink/paper paint,
every .on-dark scope painted (non-transparent, non-cream), callbar in
DOM. Each cell scrolled end to end to fire all scroll-driven code.

| Page | 1440 normal | 1440 reduced | 390 normal | 390 reduced |
|---|---|---|---|---|
| index.html | PASS | PASS | PASS | PASS |
| menu.html | PASS | PASS | PASS | PASS |
| catering.html | PASS | PASS | PASS | PASS |
| about.html | PASS | PASS | PASS | PASS |
| contact.html | PASS | PASS | PASS | PASS |
| 404.html | PASS | PASS | PASS | PASS |

24/24 cells PASS (re-run in full after the app.js curtain fix).

Additional passes, all PASS:
- Cross-page nav click-through (index -> menu -> catering -> about ->
  contact -> index): every hop navigates, zero console errors, zero
  4xx/5xx, aria-current="page" set on exactly the right nav link on
  every arrival, curtain offscreen after each reveal, callbar in DOM
  everywhere. Every relative href on the shell (nav, overlay, footer,
  callbar) HEAD-checked: all resolve.
- 404.html: no nav link claims aria-current (correct).
- Mobile overlay nav (390): hamburger opens the overlay (column-stacked
  bars verified), menu link navigates, zero console errors.
- No-JS: index (3660 chars visible, h1 + footer rendered) and menu
  (2593 chars, all 16 menu item rows present) fully readable, zero
  failed requests.
- Em dashes (U+2014) in shipped files: zero. (Two JPGs match the byte
  sequence inside compressed image data, not text; PROGRESS.md and
  research/review docs are build logs, not shipped pages.)

Integration screenshots: review/pages/integration/ (six footer shots
at 1440 + menu 390 callbar shot).

## 7. Residual risks / known nits

- The footer bar text overlaps the pale cropped wordmark glyphs at some
  widths (by design, Berenjak slice; the wordmark is aria-hidden
  decorative). Contrast of the bar text over the pale S is reduced but
  the text also sits over ink for most of its run. Council accepted
  this composition on Home; now it is consistent everywhere.
- `:where(.on-dark)` paints backgrounds at zero specificity; any future
  night section with its own gradient must keep declaring it (existing
  ones verified).
- The origin swap must run at deploy (see deploy/ORIGIN-SWAP.md);
  until then crawlers would see the placeholder host. robots/sitemap
  are also tokenized, so a deploy without the swap is detectable by the
  verification grep in that file.
- Playwright cells cover Chromium only; Safari/Firefox untested in this
  environment (site uses 2023-evergreen features per the brief:
  color-mix, overflow: clip).
- The 404 deep-path <base> injection was verified only at site root
  here; GitHub Pages nested-path behavior was verified by the 404 page
  agent and is unchanged by this pass.
