# PROGRESS - Saffron and Rice website build

Run started: 2026-07-17. Orchestrator: Claude Code (remote session), branch `claude/saffron-rice-website-3ms1ya`.

## Environment decisions (pre-phase)

- Repo was empty, no source-assets folder present. Proceeding per the prompt fallback: menu data
  comes from the authoritative transcription in the brief, logo and photos come from live listings.
- camron-website-create skill installed: using its pipeline references and templates per stage.
- clone skill installed: its capture.py adapted into tools/capture.py.
- claude-council plugin NOT installed: Phase 4 uses six pinned subagent lenses per the brief.
- Egress proxy resets Chromium's native TLS handshake (curl and Node fetch pass, browser resets on
  every host, nothing in the proxy relay log). Fix: tools/capture.py intercepts all browser requests
  with Playwright routing and fulfills them through the Playwright request API over HTTPS_PROXY.
  TLS verification stays on. Verified working against khufus.com.
- berenjak.com sits behind a Vercel bot checkpoint; R2 agent will retry and fall back to
  WebFetch-based recon if the checkpoint cannot be cleared.
- Heavy capture artifacts (reference screenshots, fetched HTML/CSS) are gitignored; the distilled
  DESIGN-SYSTEM.md files and all deliverable markdown stay in git.

## Phase 1 - RESEARCH: in progress

Agents: R1 business recon, R2a-e award-site recon (khufus, tastavents, laguna, berenjak, lobat),
R3 photography. Running as a single parallel workflow.

## Phase 2 - SYNTHESIS: not started
## Phase 3 - EXECUTION: not started
## Phase 4 - REVIEW: not started
## Phase 5 - DEPLOY AND VERIFY: not started
