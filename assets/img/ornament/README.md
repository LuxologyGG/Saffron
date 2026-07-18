# Ornament assets — Saffron & Rice

All vector artwork in this directory is **original, hand-authored SVG** drawn
in-repo for this project (see `research/design-brief.md` section 3, "Ornament
plan"). Nothing is traced, sampled, or copied from any reference site or asset.
All SVGs use `currentColor`, so color comes from the CSS context
(`--ornament`, `.thread-divider`, `.float-cutout--*` variants). Every use is
decorative: **inline the SVG and add `aria-hidden="true"` and `focusable="false"`**
(exception: `farsi-hours.svg`, see below).

| File | What it is | Usage |
|---|---|---|
| `shamse.svg` | Original 12-fold Persian sun-rosette medallion: outer ring, 12 petal arcs, two rotated 12-point star polygons (line work) + filled 12-point burst core. | 404 hero (inline, `.shamse--spin` there only) and static `.shamse-watermark` behind section heads. `aria-hidden="true"`. |
| `thread-saffron.svg` | Slender curving saffron-thread strand with two offshoots, stroke-only. Every path carries `pathLength="1"` for the `[data-draw]` scroll draw-on. `preserveAspectRatio="none"` so it stretches to any divider width at 14px tall. | The sitewide `.thread-divider` (replaces generic hairlines). Inline inside the divider element. `aria-hidden="true"`. |
| `khatam-tick.svg` | Small khatam diamond: outline diamond + solid inner diamond. | Eyebrow/list marker where the CSS `::before` primitive isn't enough (e.g. hours line, seals). Decorative only; never encodes state. `aria-hidden="true"`. |
| `crocus-petal-1.svg` | Broad crocus petal with a center-vein overlay (fill + 35% fill-opacity vein). | `.float-cutout` sine-float layer (crocus purple family via CSS `color`). `aria-hidden="true"`. |
| `crocus-petal-2.svg` | Slender curved crocus petal, same technique. | Same as above. |
| `saffron-thread-cutout.svg` | Small tangle of three thread strokes with stigma-tip dots. | `.float-cutout--thread` (red family). `aria-hidden="true"`. |
| `rice-grain-1.svg` | Straight rice grain (pointed lens fill). | Float layer, 404 hero scatter. `aria-hidden="true"`. |
| `rice-grain-2.svg` | Curved rice grain. | Same as above. |
| `ivan-arch-frame.svg` | Thin rectangular hairline frame with an inset Persianate pointed-dome arch (double line + tiny finial), reading as an ivan portal. | Decorative border, notably the Contact arch-window hero frame. `aria-hidden="true"`. |
| `farsi-hours.svg` | The Farsi micro-label "ساعات کار" (*sa'at-e kar*, "working hours"), shaped RTL with HarfBuzz and outlined to paths from Vazirmatn Regular. | Beside the Latin hours label on Contact. This one is **functional text**: keep `role="img"` + `aria-label="Working hours"` (already in the file). If the adjacent Latin text already says "Hours", you may instead mark it `aria-hidden="true"` to avoid double announcement. |
| `grain.png` | 256×256 monochrome film-grain noise tile (self-generated Gaussian noise, palette-quantized PNG, ~40 KB, under the 64 KB budget). | Consumed only via `--grain-url` on the `.grained::after` pseudo-element at `--grain-opacity` (default .06). Never place as an `<img>`. |

## License

- All SVG geometry and `grain.png`: original work created for Saffron & Rice;
  same license as the rest of this repository.
- `farsi-hours.svg` letterform outlines derive from the
  [Vazirmatn](https://github.com/rastikerdar/vazirmatn) typeface,
  © The Vazirmatn Project Authors, licensed under the SIL Open Font
  License 1.1. The OFL permits embedding outlines in documents/artwork;
  the font file itself is not shipped.

## Notes

- `thread-saffron.svg` strokes are `stroke-linecap="round"`, width 1.4/1.1;
  color inherits (`currentColor`) so the `.thread-divider` red/gold variants
  and on-dark lite shades in `app.css` apply automatically.
- `shamse.svg` line weight is tuned for 160–480px render sizes (watermark and
  404 hero). At tiny sizes prefer `khatam-tick.svg`.
- All files were rasterized and visually verified with headless Chromium
  (Playwright) on light and dark grounds.
