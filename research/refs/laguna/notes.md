# Laguna Al-Sha'ab — Recon Notes

Target: https://culinaryodissey.uprock.pro/ (Awwwards Honorable Mention; built on the UpRock/mosaic site builder — GSAP runtime bundled in /g/s3/mosaic/js/do/redesign/do.js).

## Pages captured
- `/` (home) — the entire experience; 13 sections, ~33.6k px scroll at 1440.
- `/creators` — near-empty credits/placeholder page (82KB HTML, 9 assets).
- `/page-8` — placeholder page, ~identical to /creators.

## Section inventory (home, in order)
1. header (fixed)
2. section-cover — hero: arch-masked photo, scrub dolly-zoom (scale 1.08→2.3)
3. section-about — parallax decor text + image drift
4. section-img — full-bleed transition image
5. product-dishes (dark) — sticky wrapper, dish showcase, Swiper paginator, floating "cristal" cutouts
6. dishes-drinks-img — transition image
7. section-drinks — drinks with sticky inner column
8. section-chef (dark) — arch-text 5-line staggered build over chef portrait
9. section-chef-1920 (dark) — wide-screen variant
10. section-team (dark) — 5-col team grid, sticky handoff from chef
11. section-invite — curtain-up sticky image reveal into invitation
12. sticky-form — pinned reservation form (Yandex SmartCaptcha)
13. footer (dark) — arch-masked portrait image

## Signature moments (steal-worthy)
- Arch motif everywhere: 200px+ top-corner radii turning every image into a Moorish arch/dome; footer and hero share the mask.
- Scroll-scrubbed hero dolly-zoom through the arch mask into the scene (scale to 2.3x) with layered title crossfade incl. outline-stroke giant type (-8.25px tracking).
- Arch-set typography: five staggered "arch-text" lines rising +503px→0 in scrub sequence, masked per-line.
- Constant desynchronized sine-float loops on scattered ingredient/salt/crystal PNG cutouts (±9 to ±70px) — the page always breathes.
- Long sticky-panel choreography: each section pins, next slides over (-540/+675px handoffs); page is one continuous cinematic scroll.
- Rotating circular text stamps (spin 360° infinite).
- Cream #FCF2E1 / ink #252527 two-mode inversion via `.dark-section`.

## Screenshot count
- home/screenshots: 30 (desktop 1440 viewport+full, 13-step desktop scroll sequence, mobile 390 viewport+full, 13-step mobile scroll sequence)
- creators/screenshots: 17 (viewport+full at 1440 and 390, 13-step desktop scroll)
- page-8/screenshots: 17 (same)
- Total: 64

## Capture caveats
- Chromium could not tunnel through the sandbox proxy (TLS reset); worked around by relaying every request through Playwright's route.fetch (Node stack). Script copy: scratchpad/capture_proxy.py.
- gsap is module-scoped (not window.gsap), so ScrollTrigger configs were reverse-measured via transform sampling at 14 scroll offsets (home/transform_samples.json), not read from the API.
- Assets localized under home/assets (84 files) + JS bundles (do.js, main.min.js, common.min.js).
