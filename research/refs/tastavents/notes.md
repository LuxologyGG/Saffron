# Tastavents — Capture Inventory & Signature Moments

## Pages captured
Single-page site (one long scroll, sections I–VI) + language variants (ES canonical; /ca /en /fr same layout). Only routes discovered: `/`, `/ca`, `/en`, `/fr`, `/xx/change-language`. Menus are PDFs. "Reservas" and "Regala" are anchor/external links — no separate routes.

- `home/` — full recon of https://tastavents.com (ES):
  - `screenshots/`: 12 desktop scroll states (0→10989px), desktop_1440 viewport + full-page, mobile_390 viewport + full-page (16 shots)
  - `page.html` (rendered DOM), `styles.css` (280KB all rules), `tokens.json`, `libraries.json`, `loader.html` (preloader markup), `assets/` (74 images + manifest)
- `interactions/screenshots/` (10 shots): menu overlay open (desktop+mobile, 2 frames each), scrolled-to-reservation state, gallery before/after next-slide (desktop+mobile)

Capture note: a Cookiebot consent wall blocks first paint; dismissed by presetting the `CookieConsent` cookie. Outbound browser traffic had to be tunneled through the session proxy via request interception (patched capture.py in scratchpad root).

## Section inventory (single page, numbered chapters)
1. **Hero** — full-bleed food photo, small centered portrait inset card, 3-line cream ivypresto headline "Un Viaje Gastronomico Unico", top bar with RESERVAS (filled cream pill) / REGALA (outline pill) / circular hamburger.
2. **I Presentación** — cream section, ghost sand-colored display type, editorial intro.
3. **II Nuestra Cocina** — espresso section; vertical marquee columns of tall ingredient cards with uppercase captions (ATUN ROJO, CALABAZAS, GAMBAS, PULPO); center column with body copy + pill CTAs (CARTA DE VINOS, MENÚ DEGUSTACIÓN); burnt-orange display lines.
4. **III Espacio Singular** — cream; sea-view space gallery, progressive blur-to-sharp image strip.
5. **IV Chef Destacado** — chef feature.
6. **V Menú Excepcional** — menu highlight, giant serif marquee.
7. **VI Contacto y Reservas** — espresso footer band with hours, address (Hotel Marina Badalona), phone, gallery Swiper with orange rotating medallion between circular prev/next arrows.

## 5 signature moments
1. **Cream picture-frame around the whole viewport** — a constant `#FFEDDD` border frames every scroll position, making dark sections read like plated dishes; header pills float inside it.
2. **Chapter-menu overlay as a numbered table** — full-width cream overlay with the I–VI index in hairline-bordered rows (20%-alpha gold borders), flanked by chef photo and a phone-reservation card: menu as a tasting-menu card.
3. **Blur-to-sharp scroll gallery** — food images enter as heavy gaussian blobs and resolve to sharp on scroll (WebGL/curtains + GSAP ScrollTrigger), unmistakably "aroma materializing".
4. **Burnt-orange rotating medallion** (`#D24C00`, "S" monogram) as the gallery hub between circular arrows — the only saturated accent on the whole page.
5. **Overlay typography** — enormous ivypresto-display uppercase in `#FCE9B9` set directly over photography, plus ghost `#CAB98E` watermark headlines on cream; fluid vw-rem system scales it perfectly at any width.

## Rebuild pointers
- One easing does most of the work: `cubic-bezier(0.645,0.045,0.355,1)` @ 0.4s; reveals via clip-path `reveal-*` keyframes with 0.16–0.2s staggers.
- Attribute-driven reveal system (`data-aos="fadeInUp .6s ease-out-cubic .4s, trigger:.container-left"`) — cleanly reimplementable with GSAP ScrollTrigger.
- Fluid type: root font-size 0.520833vw desktop / 1.30209vw tablet / 2.56411vw mobile; everything in rem.
