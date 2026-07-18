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

## Council verdicts

### Design spec — Round 1 (2026-07-18): FAIL
Scores: Visual 8.6, Brand 8.9, Motion 8.3, Code/Perf 8.6, Accessibility 7.9, Devil's Advocate 7.2 (bar 9.5 all lenses).
Reviews: review/design-spec/round1-*.md. Headline fixes: swap display face to a vendored serif (Fraunces/Instrument Serif); rename "Carte"->"Counter"; red-lite contrast on dark (#e0685f/#e0736c for text); shamse 404-only, new Menu hero device; preloader cap 2.2s Home-only; Lenis motion-engine contract + page-transition spec; rem+vw clamp rewrite; perf contract (transform/opacity only); complete reduced-motion matrix incl. marquee fix; :focus-visible block + 12px floor + 44px tap utility; photo license manifest + era-attributed testimonials; menu page puts prices/CTA first; drop unverified About timeline years; halal as supplier statements not certification seals.
(none yet — pass bar 9.5 on every lens: visual fidelity, motion, code/perf, brand, accessibility, devil's advocate)

## Decisions
- D1: Branch name — see header.
- D2: Logos found in repo (other agent's branch `research/source-assets/`); treated as brand assets per task allowance, no recreation needed.
