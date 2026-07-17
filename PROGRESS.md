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

## Phase 1 - RESEARCH: DONE (workflow wf_337fcdc2-543, 7/7 agents, 0 errors)

- research/business/BUSINESS.md + 20 assets. Hours found (daily 11-8, four concurring sources,
  no first-party GBP). Dizzy price NOT found anywhere live; per the brief, set 25.99 and logged.
  Real logo recovered from the June-2026 menu scan. 4 usable new-era review quotes. One verified
  live order link (Grubhub). All other platforms bot-walled; recorded in BUSINESS.md.
- research/refs/{khufus,tastavents,laguna,berenjak,lobat}/DESIGN-SYSTEM.md, all with screenshots
  except berenjak (Vercel bot wall never cleared; reconstructed from Wayback + Sanity CDN, so its
  doc covers voice, menu grammar, and verified print/visual facts).
- research/photos/: 15 slots filled (all Pexels license), PHOTO-MAP.md with per-slot provenance.
- Decisions: watermarked listing photos are reference-only, never shipped. South Bay Food Hall
  venue naming kept off brand surfaces, logged in DELIVERY-NOTES.md.

## Phase 2 - SYNTHESIS: DONE

- DESIGN-BRIEF.md: chapter-editorial structure (KHUFU'S), pinned menu staging with real in-page
  items (Tastavents, their PDF flaw rejected), arch dome transition grammar + lag-depth drift
  (Laguna), Persian-first naming voice (Berenjak), arch mask + calligraphy confidence (Lo'bat).
- assets/css/tokens.css + fonts.css. Palette sampled from the real white-balanced lockup:
  ink #0f0d0c, paper #f7f1e6, saffron gold accent family, pomegranate #7c3034, crocus #4c2f7d,
  bowl teal #324142. Type: Cormorant Garamond / Manrope / IBM Plex Mono / Gulzar, self-hosted.
- Brand assets built from the real mark: assets/img/brand/ lockup (light grounds), emblem
  (both grounds, rice interior kept opaque), favicon set. No redrawn approximation.
- assets/js/data.js written by the orchestrator directly from the authoritative transcription:
  full menu, exact prices, veg second prices, halal claims, verbatim disclaimer, hours, reviews,
  order link, image slot map. Dizzy 25.99 marked priceAssumed.
- DELIVERY-NOTES.md: 7 owner-confirmation flags.
- assets/js/vendor/: GSAP 3.15 core + ScrollTrigger, CustomEase, ScrambleText, SplitText,
  DrawSVG + Lenis 1.3, self-hosted. assets/img/: 15 optimized production photos (QA crops done).

## Phase 3 - EXECUTION: in progress
## Phase 3 - EXECUTION: not started
## Phase 4 - REVIEW: not started
## Phase 5 - DEPLOY AND VERIFY: not started
