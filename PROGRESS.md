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

- Run 1 (wf_6ea7685f-f33): shell+home, menu, catering built and self-checked (silent console,
  a11y probes pass). about/contact/404/integration failed at spawn: "Usage credits are required
  for this model." about.html was left on disk without its css/js.
- Skill update received mid-run: camron-website-create now ships reference 10, a mandated
  resources contract. Compliance review: self-hosting, systems-only adaptation, vendored
  GSAP/Lenis, self-hosted fonts, real-first photography, provenance: already compliant.
  Folded into the resumed integration pass: Osmo button-070 corner-bracket CTA as the house
  primary button, dead-vendor-file check, display-font preload, scriptFaTranslit data binding.
- Higgsfield mandate: balance checked = 2 credits (free plan); a hero clip runs about 6. Per the
  cost rule: no generation attempted, no credits burned, cinematic-still fallback kept, shortfall
  and exact top-up documented in DELIVERY-NOTES.md item 8.
- Resume (same run id, cached prefix): about/contact/404 + integration re-running on sonnet.
- Phase 3 COMPLETE (wf_6ea7685f-f33, 7/7, 0 errors). Integration verified: nav and footer
  byte-identical across pages, unified Restaurant JSON-LD with exact NAP, script order identical,
  Osmo button-070 corner-bracket CTA applied site-wide (token-themed, reduced-motion gated), no
  dead vendor files, font+hero preloads present, sitemap/robots/.nojekyll written, silent console
  across all 6 pages at both widths, reduced-motion renders finished. Known artifact documented:
  programmatic scrolling fights the Lenis RAF loop (real input does not reproduce).
- Owner supplied official logo renders + wordmark SVG mid-run (commit c9d7423). Brand set rebuilt
  from them (lockup, cleaned emblem, favicons, 624K total after quantization). Wordmark SVG wired
  into the first-visit loader: DrawSVG stroke-draw then fill, text fallback kept, console clean.

## Phase 4 - REVIEW: in progress

- Round 1 workflow launched (wf_5f7fd380-b81): capture + reference composites, then six blind
  lenses (Motion, Code/Perf, Brand, A11y, Visual, Benchmark) at high effort with sonnet fallback,
  then chair verdict into REVIEW-LOG.md + FIXLIST. Gate: all lenses 9.5+, zero critical/major,
  reviewer-verified fixes, minimum three rounds.
- Round 1 run stalled once (runner died silently on the model-credit wall ~42 min in); resumed
  with cached capture + codeperf, remaining lenses on sonnet. Watchdog self-check-ins armed.
- ROUND 1 VERDICT: NEEDS-WORK, overall 6.87 (motion 7.3, brand 7.2, visual 7.2, a11y 6.8,
  codeperf 6.5, benchmark 6.2). 0 critical, 15 major, 17 minor. Chair themes: on-teal contrast
  scope, under-photographed long scroll (highest leverage), registered-but-unshipped pattern,
  half-built menu transliteration. No lens flagged for rerun.
- ORCHESTRATOR OVERRIDE, finding BR-2 (FIXLIST item 6) REJECTED: the lamb shank desc
  "New Zealand, grass-fed, halal." is verbatim from the authoritative printed-menu transcription
  in the build brief, so it is a sourced claim, not invented copy. data.js now carries a
  provenance comment at the item. Verifier instructed to confirm the desc stayed intact.
- Fix pass launched (wf_b9f008b7-a39): wave 1 code fixers (alpha: shell/tokens/root cleanup +
  full on-teal audit; beta: menu translit, no-JS prerender, 404, image re-encodes), wave 2 design
  fixers (index environmental hero + arch grid + pull-quote; catering/about/contact photography
  and ornaments), wave 3 independent adversarial verifier who alone may write fixed (verified).
  Sanctioned tradeoff recorded: 404.html switches to root-relative URLs (FIXLIST item 8) since a
  nested-path 404 cannot resolve relative assets; the rest of the site stays path-relative.
- Fix pass COMPLETE (wf_b9f008b7-a39, 5/5 agents): 30/32 verified fixed, BR-2 rejected-intact per
  override, CP-1 completed by orchestrator after verification (static footer prerender all six
  pages), VER-2 nav regression fixed (unified nav__call + html[data-root] runtime support for
  404's sanctioned root-relative scheme), contact phone lifted to 5.7:1. All re-verified locally:
  silent console, JS-off complete, nav identity restored.
- ROUND 2 launched as six PARALLEL REMOTE lens agents (own cloud env each, own cores; repo cloned
  from the pushed branch), replacing the local 2-slot queue. Chair aggregates locally when all
  six return. Rounds may not PASS before round 3 per the gate.

- Round-2 fix cycle COMPLETE: consolidated batch (11 items: 2s loader with mission line and skip
  control, peopled sofreh photograph, hero scroll growth, scramble scoping, balance fixes) plus
  the a11y pass (dusk scrub retimed with a per-frame contrast-anchored fg picker, worst parked
  reading 4.705:1; skip-link functional inside the overlay; catering scrim deepened; menu caption
  autoAlpha; all remaining no-JS binds prerendered). All verified with measurement sweeps and
  silent consoles. Round 3 launching as six parallel remote lenses: first live gate attempt.

## Phase 4 - REVIEW: DONE, GATE PASSED (round 4, overall 9.57)

Motion 9.6, Code/Perf 9.6, Brand 9.6, Benchmark 9.6, Visual 9.5, A11y 9.5. Zero critical, zero
major. Four rounds (6.87 -> 8.02 -> 8.88 -> 9.57). Every fix reviewer-verified by a different agent;
rounds 3 and 4 ran the six lenses as isolated remote cloud agents in parallel. Two MINOR polish
items deferred with written reason (REVIEW-LOG round-4 verdict).

## Phase 5 - DEPLOY AND VERIFY: build verified, publish gated on one owner action

- LOCAL DEPLOY-GRADE VERIFICATION DONE: tools/verify_live.py against a clean staging copy (only the
  deployable files) shows all six pages at desktop 1440 and mobile 390 with zero console errors,
  zero page errors, zero external runtime requests. Screenshots in verification/ (committed).
- DEPLOY BLOCKED autonomously, every path credential/setting gated:
  Vercel MCP deploy_to_vercel takes files inline and the site is ~5MB, too large to emit in one
  tool call (a Vercel team exists, no project); no Vercel/Netlify/Surge/Cloudflare CLI tokens;
  GitHub Pages enablement returns "Resource not accessible by integration" for the Actions token and
  the REST API is blocked for this session (a parallel session hit the same wall twice); the
  injected Google Cloud token is a proxy placeholder (invalid) and gcloud is not installed.
- READY TO GO LIVE IN ONE OWNER STEP: (a) import LuxologyGG/Saffron to Vercel (Other / no build /
  output "."), matching the build's canonical saffron-and-rice.vercel.app; or (b) repo Settings ->
  Pages -> Source: GitHub Actions, after which the committed .github/workflows/deploy-pages.yml
  publishes automatically (it adapts 404.html for the /Saffron/ project subpath).
- PR: not applicable. This branch (claude/saffron-rice-website-3ms1ya) is the repo default/HEAD
  branch, so there is no separate base to open a pull request against; the work is already on trunk.
- A self-check is scheduled to detect the site going live (either URL), run live verification, record
  the real URL in FINAL-REPORT.md, and report it.
