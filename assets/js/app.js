/* =============================================================
   Saffron & Rice, Motion engine (app.js)
   "Sofreh at Dusk". Self-hosted GSAP 3.13 + Lenis 1.3, zero
   external runtime deps. Load order (end of body, strict):
   gsap -> ScrollTrigger -> SplitText -> ScrambleTextPlugin ->
   CustomEase -> lenis -> data.js (window.SITE) -> this file.

   SHELL MARKUP: pages are static HTML. Each page copies the
   canonical head + nav + footer blocks VERBATIM from
   research/shell-snippets.html. This engine then hydrates the
   shared strings ([data-site] nodes) from window.SITE and wires
   the motion hooks. Nothing here injects nav/footer wholesale;
   with JS disabled every page stays complete and readable.

   HIDDEN-STATE CONTRACT (design brief section 4): no stylesheet
   authors opacity: 0. Every hidden initial state is applied HERE,
   immediately before its reveal tween, and only when motion runs.

   REDUCED-MOTION CONTRACT (brief section 4 matrix): when
   prefers-reduced-motion matches, this file instantiates NO
   Lenis, NO ScrollTrigger scrubs/pins, NO reveals, NO scramble,
   NO parallax, NO counters, NO floats, NO curtain, NO preloader.
   Content is already visible; there is nothing to clear. The only
   things that still run under reduce are functional, non-motion
   systems: hydration, nav state classes, the menu focus trap, and
   instant testimonial swaps.

   House rules: no em dashes anywhere; relative URLs only.
   ============================================================= */
(function () {
  "use strict";

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var saveData = !!(navigator.connection && navigator.connection.saveData);
  var SITE = window.SITE || {};
  var hasGsap = typeof window.gsap !== "undefined";

  /* Motion only runs with the full vendor stack AND no reduce flag.
     Because hidden states are JS-applied only, a missing vendor or a
     reduce preference needs no cleanup path: the page is already
     complete. */
  var motion = hasGsap && !reduce &&
    typeof window.ScrollTrigger !== "undefined" &&
    typeof window.SplitText !== "undefined" &&
    typeof window.CustomEase !== "undefined";

  var EASE_REVEAL = "power3.out"; /* replaced by CustomEase below when available */
  var EASE_OUT = "power2.out";
  var EASE_INOUT = "power2.inOut";
  if (motion) {
    gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase);
    if (typeof window.ScrambleTextPlugin !== "undefined") gsap.registerPlugin(ScrambleTextPlugin);
    /* House easings, mirrors of the tokens.css curves */
    CustomEase.create("snrReveal", "0.18,1,0.25,1");   /* --e-reveal */
    CustomEase.create("snrOut", "0.215,0.61,0.355,1"); /* --e-out    */
    CustomEase.create("snrInOut", "0.77,0,0.18,1");    /* --e-inout  */
    EASE_REVEAL = "snrReveal";
    EASE_OUT = "snrOut";
    EASE_INOUT = "snrInOut";
  }

  /* ---------------- Lenis smooth scroll ----------------
     Brief contract: lerp 0.1, wheelMultiplier 1, smoothWheel true,
     syncTouch false (native scroll on touch). NOT instantiated under
     reduced motion. Single RAF loop via gsap.ticker. */
  var lenis = null;
  function initLenis() {
    if (!motion || typeof window.Lenis === "undefined") return;
    lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, smoothWheel: true, syncTouch: false });
    window.lenisRef = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
    /* in-page anchors: smooth scroll AND move real focus */
    $$('a[href^="#"]').forEach(function (a) {
      a.addEventListener("click", function (e) {
        var id = a.getAttribute("href");
        var t = id.length > 1 ? $(id) : null;
        if (!t) return;
        e.preventDefault();
        lenis.scrollTo(t, { offset: -76 });
        t.setAttribute("tabindex", "-1");
        t.focus({ preventScroll: true });
      });
    });
  }

  /* ---------------- Hydration from window.SITE ----------------
     Shell markup carries fallback text; nodes tagged
     data-site="company.phone" (etc) are synced to data.js so a fact
     edits in ONE place. data-site-href prefixes tel:/mailto handled
     by storing full href values in data.js (phoneHref). Runs always,
     reduce included. */
  function get(path) {
    return path.split(".").reduce(function (o, k) { return o == null ? o : o[k]; }, SITE);
  }
  function hydrate() {
    $$("[data-site]").forEach(function (el) {
      var v = get(el.getAttribute("data-site"));
      if (typeof v === "string" && v) el.textContent = v;
    });
    $$("[data-site-href]").forEach(function (el) {
      var v = get(el.getAttribute("data-site-href"));
      if (typeof v === "string" && v) el.setAttribute("href", v);
    });
    var yr = $("[data-year]");
    if (yr) yr.textContent = String(new Date().getFullYear());
  }

  /* ---------------- Nav state + mobile menu ----------------
     Transparent over hero; .is-scrolled past 24px. Menu overlay:
     aria-expanded, Escape closes, focus trapped inside the overlay
     plus the toggle, background inert, scroll locked (Lenis stop or
     body overflow via .menu-open). Functional, so it runs under
     reduce too. */
  function initNav() {
    var nav = $(".nav");
    if (!nav) return;
    var onScroll = function () {
      nav.classList.toggle("is-scrolled", (window.scrollY || 0) > 24);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    /* aria-current on the link matching this page */
    var here = location.pathname.split("/").pop() || "index.html";
    $$(".nav__link, .menu__link").forEach(function (a) {
      var href = a.getAttribute("href");
      if (href === here) a.setAttribute("aria-current", "page");
    });

    var toggle = $(".nav__toggle");
    var menu = $(".menu");
    if (!toggle || !menu) return;
    if (!menu.id) menu.id = "site-menu";
    toggle.setAttribute("aria-controls", menu.id);
    toggle.setAttribute("aria-expanded", "false");
    var inertEls = [$("#main"), $("footer"), $(".callbar")].filter(Boolean);
    var open = false;

    function setOpen(next) {
      open = next;
      document.body.classList.toggle("menu-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      inertEls.forEach(function (el) { el.inert = open; });
      if (lenis) { open ? lenis.stop() : lenis.start(); }
      if (open) {
        var first = $("a, button", menu);
        if (first) first.focus();
      } else {
        toggle.focus();
      }
    }
    toggle.addEventListener("click", function () { setOpen(!open); });
    $$("a", menu).forEach(function (a) { a.addEventListener("click", function () { setOpen(false); }); });
    document.addEventListener("keydown", function (e) {
      if (!open) return;
      if (e.key === "Escape") { setOpen(false); return; }
      if (e.key !== "Tab") return;
      /* focus trap: cycle within the overlay plus the toggle button */
      var focusables = [toggle].concat($$("a, button", menu)).filter(function (el) {
        return el.offsetParent !== null || el === toggle;
      });
      if (!focusables.length) return;
      var first = focusables[0], last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }

  /* ---------------- Poetic preloader (Home only) ----------------
     Runs only when: the page ships a .loader (index.html only), the
     session has not seen it (snrIntroSeen), motion is allowed, and
     the connection is not data-saver. Hard cap 2200ms TOTAL including
     the 450ms fade+rise exit. Skip pill is first in focus order.
     Hidden word states are applied here, never in CSS. */
  function runLoader(done) {
    var loader = $(".loader");
    var eligible = loader && motion && !saveData;
    var seen = false;
    try { seen = sessionStorage.getItem("snrIntroSeen") === "1"; } catch (e) {}
    if (!eligible || seen) {
      if (loader) loader.remove();
      done();
      return;
    }
    try { sessionStorage.setItem("snrIntroSeen", "1"); } catch (e) {}
    loader.classList.add("is-active");

    /* wrap each word of each line for the typed cadence */
    var words = [];
    $$(".loader__line", loader).forEach(function (line) {
      var frag = document.createDocumentFragment();
      Array.prototype.slice.call(line.childNodes).forEach(function (node) {
        var isEm = node.nodeName === "EM";
        var text = node.textContent;
        text.split(/\s+/).forEach(function (w) {
          if (!w) return;
          var s = document.createElement("span");
          s.style.display = "inline-block";
          if (isEm) { var em = document.createElement("em"); em.textContent = w; s.appendChild(em); }
          else s.textContent = w;
          frag.appendChild(s);
          frag.appendChild(document.createTextNode(" "));
          words.push(s);
        });
      });
      line.textContent = "";
      line.appendChild(frag);
    });

    var finished = false;
    function exit() {
      if (finished) return;
      finished = true;
      gsap.to(loader, {
        opacity: 0, y: -24, duration: 0.45, ease: EASE_REVEAL,
        onComplete: function () { loader.remove(); done(); }
      });
    }
    /* word rise, 90ms stagger, but the 2200ms cap always wins */
    gsap.set(words, { opacity: 0, y: 14 });
    gsap.to(words, {
      opacity: 1, y: 0, duration: 0.4, ease: EASE_REVEAL,
      stagger: Math.min(0.09, words.length ? 1.3 / words.length : 0.09)
    });
    /* Do not move focus into the overlay: the loader is not a trapped
       dialog (no inert/aria-modal on the rest of the document), so
       stealing focus here would let a second Tab escape into the live,
       visually-covered page underneath. Leaving focus alone keeps the
       skip link the first real Tab stop, matching every other page. */
    var skip = $(".loader__skip", loader);
    if (skip) { skip.addEventListener("click", exit); }
    setTimeout(exit, 2200 - 450); /* hard cap incl. the 450ms exit */
  }

  /* ---------------- Ink-curtain page transition ----------------
     Full-viewport --ink panel at --z-transition, built here so no
     page markup is needed. Exit: 101% -> 0 over .6s --e-inout, then
     navigate. Entry: 0 -> -101% over .6s, starting 80ms after load,
     ONLY when the previous page covered itself (snrCurtain flag);
     first loads open clean. Reduced motion: never built, navigation
     is instant. */
  function initCurtain() {
    if (!motion) return;
    var curtain = document.createElement("div");
    curtain.className = "curtain";
    curtain.setAttribute("aria-hidden", "true");
    document.body.appendChild(curtain);
    /* The CSS resting state translateY(101%) computes to a PIXEL matrix,
       which GSAP would keep as a permanent y offset under every yPercent
       tween (the entry reveal would end covering the page). Take over in
       percentage space: zero the pixel part, park at 101% offscreen. */
    gsap.set(curtain, { y: 0, yPercent: 101 });

    var covered = false;
    try { covered = sessionStorage.getItem("snrCurtain") === "1"; } catch (e) {}
    if (covered) {
      try { sessionStorage.removeItem("snrCurtain"); } catch (e) {}
      gsap.set(curtain, { yPercent: 0 });
      gsap.to(curtain, { yPercent: -101, duration: 0.6, ease: EASE_INOUT, delay: 0.08 });
    }

    document.addEventListener("click", function (e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      var a = e.target.closest ? e.target.closest("a") : null;
      if (!a) return;
      var href = a.getAttribute("href");
      if (!href || href.charAt(0) === "#" || href.indexOf("mailto:") === 0 || href.indexOf("tel:") === 0 ||
          a.target === "_blank" || a.hasAttribute("download") || a.hasAttribute("data-no-transition")) return;
      if (a.origin && a.origin !== location.origin) return;
      if (a.href === location.href) { e.preventDefault(); return; }
      e.preventDefault();
      try { sessionStorage.setItem("snrCurtain", "1"); } catch (err) {}
      gsap.fromTo(curtain, { yPercent: 101 }, {
        yPercent: 0, duration: 0.6, ease: EASE_INOUT,
        onComplete: function () { window.location.href = a.href; }
      });
    });
    /* bfcache: a covered page restored via Back must clear the panel */
    window.addEventListener("pageshow", function (e) {
      if (e.persisted) gsap.set(curtain, { yPercent: 101 });
    });
  }

  /* ---------------- Reveals ----------------
     [data-reveal="lines"]  masked line rise, SplitText, 820ms
                            --e-reveal, 90ms stagger (brief default)
     [data-reveal] (plain)  y 28px + opacity, .6s --e-out, 80ms
                            stagger within a [data-reveal-group]
     Hidden states are applied by JS a beat before the tween; under
     reduce this whole function never runs and content stays put. */
  function initReveals() {
    $$('[data-reveal="lines"]').forEach(function (el) {
      var run = function () {
        var split = new SplitText(el, { type: "lines", mask: "lines", linesClass: "snr-line" });
        gsap.set(split.lines, { yPercent: 112 });
        var play = function () {
          gsap.to(split.lines, { yPercent: 0, duration: 0.82, ease: EASE_REVEAL, stagger: 0.09 });
        };
        if (el.hasAttribute("data-reveal-load")) play();
        else ScrollTrigger.create({ trigger: el, start: "top 85%", once: true, onEnter: play });
      };
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(run); else run();
    });

    $$("[data-reveal]:not([data-reveal='lines'])").forEach(function (el) {
      gsap.set(el, { y: 28, opacity: 0 });
      gsap.to(el, {
        y: 0, opacity: 1, duration: 0.6, ease: EASE_OUT,
        scrollTrigger: { trigger: el, start: "top 80%", once: true }
      });
    });

    $$("[data-reveal-group]").forEach(function (grp) {
      var items = $$("[data-reveal-item]", grp);
      if (!items.length) return;
      gsap.set(items, { y: 28, opacity: 0 });
      gsap.to(items, {
        y: 0, opacity: 1, duration: 0.6, ease: EASE_OUT, stagger: 0.08,
        scrollTrigger: { trigger: grp, start: "top 80%", once: true }
      });
    });
  }

  /* ---------------- Scramble ([data-scramble]) ----------------
     Chars resolve INTO the real text; DOM reverts to a clean single
     text node on complete (selectable, screen-reader clean). */
  function initScramble() {
    if (typeof window.ScrambleTextPlugin === "undefined") return;
    $$("[data-scramble]").forEach(function (el) {
      var split = new SplitText(el, { type: "words", wordsClass: "snr-word" });
      ScrollTrigger.create({
        trigger: el, start: "top 88%", once: true,
        onEnter: function () {
          gsap.to(split.words, {
            duration: 1.0, stagger: 0.03,
            scrambleText: { text: "{original}", chars: "upperCase", speed: 0.9 },
            onComplete: function () { split.revert(); }
          });
        }
      });
    });
  }

  /* ---------------- Parallax ([data-parallax]) ----------------
     Brief default factor: yPercent -12, scrub-tied, parent as the
     trigger (Contact arch window et al). Optional override value:
     data-parallax="-18". Transform-only per the perf contract. */
  function initParallax() {
    $$("[data-parallax]").forEach(function (el) {
      var amt = parseFloat(el.getAttribute("data-parallax"));
      if (isNaN(amt)) amt = -12;
      gsap.fromTo(el, { yPercent: -amt / 2 }, {
        yPercent: amt / 2, ease: "none",
        scrollTrigger: {
          trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true
        }
      });
    });
  }

  /* ---------------- Odometers ([data-count]) ----------------
     Markup already prints the FINAL value (no-JS truth). We animate
     0 -> target only when motion runs; under reduce the printed
     value simply stays. data-decimals / data-prefix supported. */
  function initCounters() {
    $$("[data-count]").forEach(function (el) {
      var target = parseFloat(el.getAttribute("data-count"));
      if (isNaN(target)) return;
      var dec = parseInt(el.getAttribute("data-decimals") || "0", 10);
      var pre = el.getAttribute("data-prefix") || "";
      var obj = { v: 0 };
      var fmt = function (v) { return pre + (dec ? v.toFixed(dec) : String(Math.round(v))); };
      ScrollTrigger.create({
        trigger: el, start: "top 88%", once: true,
        onEnter: function () {
          el.textContent = fmt(0);
          gsap.to(obj, {
            v: target, duration: 1.6, ease: EASE_OUT,
            onUpdate: function () { el.textContent = fmt(obj.v); }
          });
        }
      });
    });
  }

  /* ---------------- SVG draw-on ([data-draw]) ----------------
     Strokes hidden by JS (dasharray = length) then drawn to 0.
     Under reduce this never runs, so the SVG ships fully drawn. */
  function initDraw() {
    $$("[data-draw]").forEach(function (svg) {
      var paths = $$("path, line, circle, rect, polyline", svg);
      var drawable = paths.filter(function (p) {
        return p.getTotalLength && p.getTotalLength() > 0;
      });
      drawable.forEach(function (p) {
        var len = p.getTotalLength();
        p.style.strokeDasharray = String(len);
        p.style.strokeDashoffset = String(len);
      });
      if (!drawable.length) return;
      gsap.to(drawable, {
        strokeDashoffset: 0, duration: 1.1, ease: EASE_OUT, stagger: 0.06,
        scrollTrigger: { trigger: svg, start: "top 85%", once: true }
      });
    });
  }

  /* ---------------- Sine-float ladder ----------------
     .float-cutout elements get the brief's desynced duration ladder
     (6s / 7.3s / 8.1s, amplitude 8px via k-float) and start floating.
     CSS keyframe, so the tokens.css reduce guard is a second net. */
  var FLOAT_LADDER = ["6s", "7.3s", "8.1s"];
  function initFloats() {
    $$(".float-cutout").forEach(function (el, i) {
      el.style.setProperty("--float-dur", FLOAT_LADDER[i % FLOAT_LADDER.length]);
      el.style.animationDelay = (-(i * 1.7) % 8) + "s"; /* desync phases */
      el.classList.add("is-floating");
    });
  }

  /* ---------------- Marquee ----------------
     Duplicates the track once for the seamless 80s linear loop
     (k-marquee translates -50%). The .marquee-static single line in
     markup is the reduced-motion truth; under reduce we do NOT
     duplicate, and the CSS media query swaps tracks anyway. */
  function initMarquee() {
    if (reduce) return;
    $$(".marquee").forEach(function (m) {
      var track = $(".marquee__track", m);
      if (!track) return;
      track.setAttribute("aria-hidden", "true");
      track.innerHTML += track.innerHTML;
      track.style.setProperty("--marquee-dur", m.getAttribute("data-marquee-dur") || "80s");
    });
  }

  /* ---------------- Day-to-night lerp helper ----------------
     [data-daynight] section: ties --dn-mix to scroll progress on THAT
     element only (perf contract: never body/html). The fg does not
     lerp: .is-night flips in one step at 55% progress, together with
     the background. --dn-mix is intentionally STEPPED (two flat
     values, not a continuous 0->1 lerp) so no scroll rest position
     ever lands the background in the muddy mid-grey band where
     neither ink nor paper text clears 4.5:1 (measured dead zone was
     roughly progress 0.42-0.63 under the old continuous lerp). Under
     reduce this never runs and the section renders as authored (the
     page ships it as two static stacked bands per the matrix). */
  function initDayNight() {
    $$("[data-daynight]").forEach(function (sec) {
      ScrollTrigger.create({
        trigger: sec, start: "top 60%", end: "bottom 90%", scrub: true,
        onUpdate: function (self) {
          var night = self.progress >= 0.55;
          /* 0.15 / 0.85 keep the background comfortably light or dark
             on either side of the flip (>7:1 against the paired text
             color), never resting at the ~0.5 grey midpoint. */
          sec.style.setProperty("--dn-mix", night ? "0.85" : "0.15");
          sec.classList.toggle("is-night", night);
        }
      });
    });
  }

  /* ---------------- Testimonial band ----------------
     One visible .tcard at a time; prev/next .tap-44 buttons; stage
     carries aria-live="polite". Motion: .35s --e-ui fade/slide via
     GSAP. Reduce: instant swaps, buttons still work (brief matrix:
     "buttons-only instant swaps"). Fan rotation alternates. */
  function initTestimonials() {
    $$(".testimonials").forEach(function (root) {
      var stage = $(".tcard-stage", root);
      var cards = $$(".tcard", root);
      if (!stage || cards.length < 2) return;
      stage.setAttribute("aria-live", "polite");
      var i = 0;
      cards.forEach(function (c, n) {
        c.hidden = n !== 0;
        c.classList.add(n % 2 ? "tcard--fan-r" : "tcard--fan-l");
      });
      var pill = $(".tnav__pill", root);
      function show(next) {
        var from = cards[i];
        i = (next + cards.length) % cards.length;
        var to = cards[i];
        if (pill) pill.textContent = (i + 1) + " / " + cards.length;
        if (!motion) { from.hidden = true; to.hidden = false; return; }
        gsap.to(from, {
          opacity: 0, y: 10, duration: 0.35, ease: "power2.inOut",
          onComplete: function () {
            from.hidden = true;
            gsap.set(from, { clearProps: "opacity,y" });
            to.hidden = false;
            gsap.fromTo(to, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.35, ease: "power2.inOut" });
          }
        });
      }
      if (pill) pill.textContent = "1 / " + cards.length;
      var prev = $("[data-tprev]", root), next = $("[data-tnext]", root);
      if (prev) prev.addEventListener("click", function () { show(i - 1); });
      if (next) next.addEventListener("click", function () { show(i + 1); });
    });
  }

  /* ---------------- Boot ---------------- */
  function boot() {
    initLenis();
    if (motion) {
      initFloats();
      initReveals();
      initScramble();
      initParallax();
      initCounters();
      initDraw();
      initDayNight();
      var refresh = function () { ScrollTrigger.refresh(); };
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(refresh);
      setTimeout(refresh, 800); /* late images / layout shift */
    }
    window.__siteBooted = true;
  }

  function init() {
    hydrate();
    initNav();
    initMarquee();
    initTestimonials();
    initCurtain();
    if (motion) runLoader(boot);
    else { var l = $(".loader"); if (l) l.remove(); boot(); }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
