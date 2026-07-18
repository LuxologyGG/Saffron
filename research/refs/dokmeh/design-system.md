# Dokmeh Agency (hidokmeh.com) — Design System Extraction

Tehran web/design agency, Awwwards-winning. Captured 2026-07-18, homepage, desktop 1440 + mobile 390. WordPress front with heavy custom CSS animation.

## Palette
- Electric ultramarine blue ground: ~`#2222EE`-family saturated blue (hero background)
- Vivid yellow: `#FFE600` (rgb 255,230,0) — signature accent; giant splat/sun shape in hero, nav icons
- Ink black `#000` / `#222222`, white `#FFF`
- Sage green: `#84986E` (rgb 132,152,110) secondary accent
- High-clash primary pairing (blue x yellow) with grain/noise texture over shapes — contemporary Tehran-poster energy.

## Type
- **PP Neue Montreal** — main sans, huge tight-tracked headlines ("WEBSITE, BRAND, AND MORE."), letter-spacing down to -7px / -32px at display sizes.
- **Martian Mono** — uppercase mono for nav/labels ("PROJECTS ABOUT US CONTACT US").
- Bilingual: a Farsi "فارسی" language toggle in Farsi script; Persian typography treated as a first-class UI element.

## Shape/ornament
- Giant 10-point sun/splat blob (yellow) — reads as a modernized shamse (sun rosette) medallion, centered like a tile medallion with logo + headline inside it.
- Floating grainy diamond/gem shapes around the hero (noise-textured).
- Rounded-pill nav bar (radius 56px+/120px), radii family: 6/12/20/30/35/56/120px.

## Motion
- Custom keyframes: `superMario` / `superMarioFirst` (stepped jump animation), `MoveScaleUpInitial` / `MoveScaleUpEnd` (text roll-up hover: translateY 100%→0 with scale), `rotate1` (slow spin — likely the sun medallion), `commingsoon` marquee.
- Hover model: two-layer text swap (roll-up), ~0.4–0.6s cubic ease.
- Awwwards/CSSDA "Honors" side tab, marquee tickers.

## Persian-relevant takeaways
- Shamse/sun-medallion geometry abstracted into a brand blob — Persian ornament made flat, giant, and playful rather than filigreed.
- Farsi script co-exists with Latin grotesque; RTL toggle built in.
- Grain/noise over saturated flat color = contemporary Iranian poster-design lineage (Tehran graphic scene).
