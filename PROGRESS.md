# Saffron & Rice — Rebuild B — Progress Log

Orchestrated autonomous rebuild. Branch: `claude/saffron-rice-rebuild-du9vf1` (serves as "rebuild-b"; the session harness mandates this exact push branch, so the requested `rebuild-b` name maps to it — decision logged per autonomy rule). Loop cron job 63651873 fires every 10m.

## Independence
- Remote had no `main`; only the other agent's branch `claude/saffron-rice-website-3ms1ya` (be7594a).
- This branch is a fresh **orphan history**. Nothing taken from the other agent's work except the three brand asset files the task explicitly allows:
  - `assets/img/brand/Saffronlogobg.png` (full emblem on background, 1254×1254)
  - `assets/img/brand/saffronlogonobg.png` (transparent emblem, 1254×1254 RGBA)
  - `assets/img/brand/saffron_rice_text_only_high_quality.svg` (wordmark)
- Deployment will target a distinct URL, never the other agent's.

## Phase log

### Phase 0 — Setup (2026-07-18)
- Fresh clone at scratchpad/saffron-b, orphan branch created, brand assets extracted, loop scheduled.
- Next: load camron-website-create pipeline, clone claude-council, fan out research subagents (business facts, awwwards rediscovery, per-reference full-site recon with clone-skill capture).

### Phase 1 — Research (in flight)
- Awwwards rediscovery COMPLETE: all prior findings confirmed as of 2026-07. KHUFU'S HM (May 2026, now #1 MENA 50 Best) = primary baseline; Laguna Al-Sha'ab HM (Oct 2025, concept piece); Tastavents HM (Oct 2024); Berenjak best real Persian site (no award, bot-protected); zero Persian restaurants on awwwards (Iran page checked). Artifact: research/awwwards-rediscovery.md.
- In flight: business facts agent, 4 reference recon agents (khufus, laguna, tastavents, berenjak+lobat+dokmeh), vendor/scaffold agent (GSAP+Lenis+fonts).
- data.js committed with exact owner menu (authoritative), disclaimers, service modes, halal claims.
- Council tooling: claude-council cloned; 0/7 providers available (no keys/CLIs) → using its LOCAL COUNCIL mode: Claude subagent roles for the 6 lenses, images attached, 9.5 bar.

### Phase 1 — Research COMPLETE (2026-07-18)
- Business facts: research/business/facts.md + reviews.md + 10 photos. Key: LLC "Saffron and Rice, LLC" filed 3/16/2026 at the address; hours UNVERIFIED (say "Open daily, call to confirm"); Yelp 4.1/~173 under old name; 3 usable verbatim quotes merged into data.js.
- Reference recons committed: khufus (8 pages, 179 shots), laguna (64 shots + measured parallax spec), tastavents (28 shots), berenjak+lobat+dokmeh (129 shots). Each has design-system.md + notes.md. These are the council comparison baselines.
- Vendored: GSAP 3.13 (core/ScrollTrigger/SplitText/ScrambleText/CustomEase) + Lenis 1.3.11 + ClashDisplay/GeneralSans/ChivoMono woff2, verified zero-error load.

### Phase 2 — Design synthesis (in flight)
- Synthesis agent producing tokens.css + research/design-brief.md from all four design systems + logo-sampled palette.

### Phase 3 — Build (in flight, 2026-07-18)
- Shell + motion engine COMPLETE and verified (zero console errors, both motion modes). Files: assets/css/app.css, assets/js/app.js, research/shell-snippets.html.
- Original ornament set COMPLETE (11 assets, incl. HarfBuzz-shaped Farsi hours label from Vazirmatn OFL, grain tile). All original vector work.
- Photography COMPLETE: 17 Unsplash-license-verified images (jpg+webp, 4.6MB/3.2MB) + license manifest. Unlicensed blog photos remain research-only, never ship.
- Higgsfield decision: 2 free credits < ~6/clip cost → skip generation, cinematic motion on real stills (skill cost rule). No credits burned.
- Page builds fanned out in parallel: Home, Menu (Counter), Catering, About, Contact (+sitemap/robots), 404. Each self-verifies (Playwright, zero console errors, 1440+390, both motion modes) and screenshots to review/pages/<page>/.

### Phase 3 — Page builds COMPLETE (2026-07-18)
All six pages built, each self-verified (Playwright: zero console errors, zero external requests, 1440+390, normal+reduced motion; no-JS passes where specified):
- Home: arch dolly-zoom hero (1.05->1.32/160vh), day-to-night band, favicons generated. 22 screenshots.
- Menu "The Counter": 70vh dotted-leader hero, EXACT 16/16 item fidelity vs data.js (healer never fired), no-JS shows all rows. 14 screenshots.
- Catering: picture-frame + spread-builder (220vh), exact platter data, JSON-LD offers 6/6. 14 screenshots.
- About: 300vh era scrubber (2 verified milestones only), full tablist keyboard model, new farsi-noosh.svg ornament. 18 screenshots.
- Contact: split arch-window hero, original SVG locator map (zero tile requests), honest phone-first form (no public inbox verified), sitemap.xml + robots.txt. 24 screenshots.
- 404 "Spilled Bowl": spinning shamse w/ cut 404, deep-path base handling. 5 screenshots.
- Integration pass in flight: centralize shell fixes (.on-dark paint, nav toggle, footer wordmark invert, SplitText descenders), PLACEHOLDER_ORIGIN unification, cross-page nav click-through, full-site re-verify.

### Phase 3 — Integration COMPLETE
- All shell fixes centralized in app.css/tokens.css; curtain page-transition blackout bug found & fixed (GSAP yPercent matrix). Canonical origin unified behind `https://PLACEHOLDER_ORIGIN` token + deploy/ORIGIN-SWAP.md. Full-site re-verify 24/24 PASS (6 pages x 2 breakpoints x 2 motion modes), nav click-through clean, zero em dashes shipped. Artifact: review/integration-report.md.

### Phase 4 — Full-site council (round 1 in flight)
- First attempt (Fable 5) hit session/model limits mid-run, no reviews written. Session switched to Opus 4.8; council relaunched on Sonnet (3 agents, 6 lenses, fresh screenshots + reference composites + live motion measurement). Writing to review/site-round1/.

## Council verdicts

### Full site — Round 1 (2026-07-18): FAIL
Scores: Visual 7.6, Brand 8.4, Motion 8.7, Code/Perf 7.6, Accessibility 8.1, Devil's Advocate 8.4 (bar 9.5). Reviews: review/site-round1/*.md; composites review/composites/. Honesty audit CLEAN (no fake certs/ratings/hours/lineage). Fix list:
- CRITICAL footer wordmark box overlaps footer bar (name/address unreadable) — app.css .footer__wordmark reserve size, kill 18% translateY.
- CRITICAL purple crocus petal over "Hand-pressed" copy — home.css .home-trio .fc-petal-1 reposition off text.
- CRITICAL homepage preloader skip.focus() creates untrapped dialog Tab-escape — app.js runLoader: inert/aria-modal or don't focus-hijack.
- CRITICAL nav logo 789KB@1254px shown at 46px — downscale saffronlogonobg to ~96px+192px, rewire all refs; big page-weight win.
- MAJOR catering pin-out collision ~2700px (tier 10/20/30 over card 1/2/3) — catering.css pin depth.
- MAJOR footer__col a min-height 32px<44px; skip-link/nav__brand under 44px — use var(--tap).
- MAJOR day-night lerp dead zone t=0.42-0.63 contrast <4.5:1 — stepped flip / darken.
- MAJOR about.html callbar missing is-on class (no mobile phone) — add is-on.
- MINOR font preloads on 5 pages, srcset on content imgs, menu hand-underline roughness, mobile home gap, PLACEHOLDER_ORIGIN (deploy step).

### Full site — Round 1 fix passes (2026-07-18)
- Track A (shell/perf) DONE: footer wordmark overlap fixed, preloader focus-hijack removed, nav logo downscaled to emblem-96/192.png (page weight -35-45%), tap targets ≥44px, day-night stepped flip (contrast 11-12:1, no dead zone), about callbar is-on, font preloads. Fixlog A.
- Track B (page visuals) DONE: crocus petal off "Hand-pressed" copy, catering pin depth 220->280vh (no 10/20/30 vs 1/2/3 collision), menu underline smoothed, mobile home gap closed. Fixlog B.
- A late a11y/devil report (score 7.8/8.4) surfaced extras -> Round-1b in flight: nav-toggle z-index (--z-nav 90), name standardized to "Saffron Food Market" everywhere (authoritative: former domain saffronfoodmarket.com), footer h4->h3 heading order, price display padded to 2 decimals (data.js values kept authoritative), 3 aria fixes.

### Full site — Round 2 (2026-07-18)
Scores: Visual 9.6 PASS, Brand 9.5 PASS, Motion 9.6 PASS, Code/Perf 9.6 PASS, Accessibility 9.7 PASS, Devil's Advocate 8.9 FAIL. Reviews: review/site-round2/*.md. All round-1 fixes verified live (footer overlap, petal, catering pin, logo weight -774KB/page, stepped day-night 11-12:1, aria clean, tap targets, name/price). Only failing lens = Devil's Advocate, on ONE finding: round-1b name reversal was wrong. DECISION D3: former name is "Saffron Food Mart" (primary sources: storefront sign photo + Yelp/Grubhub/Zabihah/DoorDash/Restaurantji listings + Eat the World LA blog all say Mart; old saffronfoodmarket.com domain disclaimed as not-a-source per facts.md). Reverted all shipped files to "Mart" with honest provenance. Re-verifying devil's-advocate lens (round 2b).

### Full site — Round 2 FINAL (2026-07-18): PASS ✅ (all six lenses)
Visual 9.6, Brand 9.5, Motion 9.6, Code/Perf 9.6, Accessibility 9.7, Devil's Advocate 9.7 (round 2b after name fix). All ≥ 9.5. Reviews: review/site-round2/*.md + devil-2b.md. Site is council-approved and cleared to deploy.

### Design spec — Round 2 (2026-07-18): PASS ✅
Scores: Visual 9.6, Brand 9.7, Motion 9.6, Code/Perf 9.6, Accessibility 9.7, Devil's Advocate 9.6 (all ≥ 9.5). Reviews: review/design-spec/round2-*.md. All round-1 findings verified fixed in-file; contrast ratios independently recomputed. Non-blocking nits logged (comment accuracy, map-tile licensing note, Farsi SVG QA).

### Design spec — Round 1 (2026-07-18): FAIL
Scores: Visual 8.6, Brand 8.9, Motion 8.3, Code/Perf 8.6, Accessibility 7.9, Devil's Advocate 7.2 (bar 9.5 all lenses).
Reviews: review/design-spec/round1-*.md. Headline fixes: swap display face to a vendored serif (Fraunces/Instrument Serif); rename "Carte"->"Counter"; red-lite contrast on dark (#e0685f/#e0736c for text); shamse 404-only, new Menu hero device; preloader cap 2.2s Home-only; Lenis motion-engine contract + page-transition spec; rem+vw clamp rewrite; perf contract (transform/opacity only); complete reduced-motion matrix incl. marquee fix; :focus-visible block + 12px floor + 44px tap utility; photo license manifest + era-attributed testimonials; menu page puts prices/CTA first; drop unverified About timeline years; halal as supplier statements not certification seals.
(none yet — pass bar 9.5 on every lens: visual fidelity, motion, code/perf, brand, accessibility, devil's advocate)

## Decisions
- D1: Branch name — see header.
- D2: Logos found in repo (other agent's branch `research/source-assets/`); treated as brand assets per task allowance, no recreation needed.
