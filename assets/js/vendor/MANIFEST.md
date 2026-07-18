# Vendor manifest

All runtime dependencies are self-hosted. No CDN references at runtime.

## JS (assets/js/vendor/)

| File | Library | Version | Source |
|---|---|---|---|
| gsap.min.js | GSAP core | 3.13.0 | https://registry.npmjs.org/gsap/-/gsap-3.13.0.tgz (dist/gsap.min.js) |
| ScrollTrigger.min.js | GSAP ScrollTrigger | 3.13.0 | same tarball, dist/ScrollTrigger.min.js |
| SplitText.min.js | GSAP SplitText | 3.13.0 | same tarball, dist/SplitText.min.js |
| ScrambleTextPlugin.min.js | GSAP ScrambleText | 3.13.0 | same tarball, dist/ScrambleTextPlugin.min.js |
| CustomEase.min.js | GSAP CustomEase | 3.13.0 | same tarball, dist/CustomEase.min.js |
| lenis.min.js | Lenis smooth scroll | 1.3.11 | https://registry.npmjs.org/lenis/-/lenis-1.3.11.tgz (dist/lenis.min.js) |

## CSS

| File | Library | Version | Source |
|---|---|---|---|
| assets/css/vendor/lenis.css | Lenis styles | 1.3.11 | same Lenis tarball, dist/lenis.css |
| assets/css/fonts.css | local @font-face declarations | - | authored |

## Fonts (assets/fonts/)

| File | Family / weight | Source |
|---|---|---|
| Fraunces-Variable.woff2 | Fraunces variable, wght 100-900, opsz 9-144, normal (v38, latin) | Google Fonts (via google-webfonts-helper family lookup / fonts.gstatic.com): https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,100..900;1,9..144,100..900 (OFL) |
| Fraunces-Italic-Variable.woff2 | Fraunces variable, wght 100-900, opsz 9-144, italic (v38, latin) | Google Fonts (as above, OFL) |
| GeneralSans-400.woff2 | General Sans 400 | Fontshare API: https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600 |
| GeneralSans-500.woff2 | General Sans 500 | Fontshare API (as above) |
| GeneralSans-600.woff2 | General Sans 600 | Fontshare API (as above) |
| ChivoMono-400.woff2 | Chivo Mono 400 (v11) | google-webfonts-helper: https://gwfh.mranftl.com/api/fonts/chivo-mono?subsets=latin |
| ChivoMono-500.woff2 | Chivo Mono 500 (v11) | google-webfonts-helper (as above) |

Load order in HTML: fonts.css, vendor/lenis.css, then site CSS; scripts at end of body: gsap.min.js, ScrollTrigger.min.js, SplitText.min.js, ScrambleTextPlugin.min.js, CustomEase.min.js, lenis.min.js, then site JS.
