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

## Council verdicts
(none yet — pass bar 9.5 on every lens: visual fidelity, motion, code/perf, brand, accessibility, devil's advocate)

## Decisions
- D1: Branch name — see header.
- D2: Logos found in repo (other agent's branch `research/source-assets/`); treated as brand assets per task allowance, no recreation needed.
