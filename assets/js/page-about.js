/* =============================================================
   Saffron and Rice, about page module.
   Loads LAST: vendor -> data.js -> app.js -> page-about.js.
   Eval-time: fills the "what we cook now" triad and the word of
   mouth band from window.SITE so the shared reveal systems in
   app.js can hook the injected nodes at boot.
   SR.onBoot: the day-to-night hero. A tall sticky stage
   (class="on-dark" in the markup) that already rests at its
   finished ink state, every step visible, by default: that is the
   no-JS and prefers-reduced-motion fallback. When motion is
   allowed, this module re-points the stage's own --bg/--fg/
   --fg-soft/--fg-faint/--accent-text custom properties toward the
   light ground and scrubs them back to the .on-dark values as the
   runway scrolls, so descendants (kicker, title, script line,
   steps, hud) all read from the SAME tokens the rest of the site
   uses and simply inherit the live values, no per-element tweens.
   House rule: no em dashes anywhere, in copy or comments.
   ============================================================= */
(function () {
  "use strict";

  var SITE = window.SITE || {};
  var SR = window.SR;
  var d = document;
  var $ = function (s, c) { return (c || d).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || d).querySelectorAll(s)); };

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  /* --------------------------------------- 03 what we cook now */
  function fillCook() {
    var mount = $("[data-cook-cols]");
    var sections = (SITE.menu && SITE.menu.sections) || [];
    if (!mount || !sections.length) return;
    var picks = ["kababs", "stews", "rice"];
    mount.innerHTML = picks.map(function (id, i) {
      var sec = null;
      for (var k = 0; k < sections.length; k++) {
        if (sections[k].id === id) { sec = sections[k]; break; }
      }
      if (!sec) return "";
      var count = sec.items.length;
      var sample = sec.items[0];
      return '<article class="ab-cookcard" data-reveal-item>' +
        '<p class="ab-cookcard__idx">0' + (i + 1) + "</p>" +
        '<h3 class="ab-cookcard__name">' + esc(sec.title) + "</h3>" +
        (sec.fa ? '<span class="script-fa ab-cookcard__fa" lang="fa" dir="rtl" aria-hidden="true">' + esc(sec.fa) + "</span>" : "") +
        '<p class="ab-cookcard__count">' + count + (count === 1 ? " dish" : " dishes") + " on the menu</p>" +
        (sec.note ? '<p class="ab-cookcard__note">' + esc(sec.note) + "</p>" : "") +
        (sample ? '<p class="ab-cookcard__sample">Starts with the ' + esc(sample.name) + ".</p>" : "") +
      "</article>";
    }).join("");
  }

  /* ------------------------------------------------ 06 reviews */
  function starSvg() {
    return '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
      '<path d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.2 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8z"/></svg>';
  }
  function fillReviews() {
    var mount = $("[data-about-reviews]");
    var reviews = SITE.reviews || [];
    if (!mount || !reviews.length) return;
    mount.innerHTML = reviews.map(function (r) {
      var stars = "";
      for (var i = 0; i < r.stars; i++) stars += starSvg();
      return '<article class="review" data-reveal-item>' +
        '<div class="review__stars" aria-hidden="true">' + stars + "</div>" +
        '<span class="sr-only">' + r.stars + " out of 5 stars on " + esc(r.src) + "</span>" +
        '<blockquote class="review__quote">' + esc(r.quote) + "</blockquote>" +
        '<p class="review__who"><b>' + esc(r.who) + "</b><span>" + esc(r.src) + ", " + esc(r.date) + "</span></p>" +
      "</article>";
    }).join("");
  }

  fillCook();
  fillReviews();

  if (!SR) return;

  /* ---------------------------------------- 00 day-to-night hero */
  SR.onBoot(function () {
    if (SR.reduce || typeof window.gsap === "undefined" || !window.ScrollTrigger) return;
    var g = window.gsap;
    var outer = $("[data-dusk]");
    var stage = $("[data-dusk-stage]");
    if (!outer || !stage) return;
    var darkzone = $(".ab-dusk__darkzone", outer);
    var bar = $("[data-dusk-bar]");
    var steps = $$("[data-dusk-step]");
    var photo = $(".ab-dusk__photo img", outer);

    /* Pixel heights, not vh/svh. A full-page screenshot tool can
       briefly resize the real viewport to match the whole document
       to capture it in one shot; a vh-sized multi-viewport runway
       under a sticky vh-sized stage would re-inflate multiplicatively
       when that happens. Pixel values measured from a sane
       innerHeight hold steady through that resize; the guard below
       ignores any resize past a real device's range so a synthetic
       oversized viewport never gets baked in as the new size. */
    function applyDuskSizing() {
      var vh = window.innerHeight;
      if (!vh || vh > 2200) return;
      var ratio = window.innerWidth <= 640 ? 2.6 : 3.4;
      outer.style.height = Math.round(vh * ratio) + "px";
      stage.style.height = vh + "px";
    }
    applyDuskSizing();
    stage.classList.add("is-pinned");
    var duskRz;
    window.addEventListener("resize", function () {
      clearTimeout(duskRz);
      duskRz = setTimeout(applyDuskSizing, 200);
    });

    function hex(name, fallback) {
      var v = getComputedStyle(d.documentElement).getPropertyValue(name).trim();
      return /^#[0-9a-fA-F]{6}$/.test(v) ? v : fallback;
    }
    function toRgb(h) {
      var n = parseInt(h.slice(1), 16);
      return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
    }
    function mix(a, b, t) {
      return [
        Math.round(a[0] + (b[0] - a[0]) * t),
        Math.round(a[1] + (b[1] - a[1]) * t),
        Math.round(a[2] + (b[2] - a[2]) * t)
      ];
    }
    function css(c) { return "rgb(" + c[0] + "," + c[1] + "," + c[2] + ")"; }

    /* AX-R2-2: a plain linear crossfade of fg from ink to paper (and
       bg from paper to ink) on the SAME t necessarily meets itself
       partway, since one rises while the other falls across the same
       range: parked mid-scrub, text and ground converge toward the
       same mid-tone and contrast collapses. Rather than trying to
       out-ease that collision away (any smooth, monotonic crossfade
       still has to cross zero contrast at one exact instant), every
       foreground token below is picked, every frame, against the
       ACTUAL live background: whichever of the ink-side or paper-side
       anchor currently reads better wins, and if neither clears the
       AA floor (only possible in the narrow band right around the
       crossover) it is nudged toward true black or white, numerically,
       just far enough to clear the floor. Outside that narrow band the
       result is bit-identical to the plain ink/paper anchors, so nothing
       changes at rest; only the sliver of scrub around the crossover is
       touched. */
    function relLum(c) {
      function ch(v) { v = v / 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }
      return 0.2126 * ch(c[0]) + 0.7152 * ch(c[1]) + 0.0722 * ch(c[2]);
    }
    function contrastOf(c1, c2) {
      var a = relLum(c1), b = relLum(c2);
      var hi = Math.max(a, b), lo = Math.min(a, b);
      return (hi + 0.05) / (lo + 0.05);
    }
    var BLACK = [0, 0, 0], WHITE = [255, 255, 255];
    var AA_MIN = 4.75; /* comfortably above the 4.5 floor, buffering rounding/AA sampling noise */

    /* Picks the higher-contrast of the two role anchors against bg;
       if neither clears min (only inside the crossover sliver), bisects
       that anchor toward black/white until it does. Guarantees
       contrastOf(result, bg) >= min for any bg between paper and ink. */
    function pickFg(darkC, lightC, bg, min) {
      var cd = contrastOf(darkC, bg), cl = contrastOf(lightC, bg);
      var useLight = cl > cd;
      var base = useLight ? lightC : darkC;
      var best = useLight ? cl : cd;
      if (best >= min) return base;
      var extreme = useLight ? WHITE : BLACK;
      var lo = 0, hi = 1, mid, c;
      for (var i = 0; i < 14; i++) {
        mid = (lo + hi) / 2;
        c = mix(base, extreme, mid);
        if (contrastOf(c, bg) >= min) hi = mid; else lo = mid;
      }
      return mix(base, extreme, hi);
    }

    /* Same guarantee for opacity-faded text: bisects UP from the
       intended resting opacity (never down, so the design's dim/bright
       grammar for "not yet arrived" steps is preserved) until the
       alpha-blended-over-bg color clears min. */
    function safeOpacity(fg, bg, target, min) {
      if (contrastOf(mix(bg, fg, target), bg) >= min) return target;
      var lo = target, hi = 1, mid;
      for (var i = 0; i < 12; i++) {
        mid = (lo + hi) / 2;
        if (contrastOf(mix(bg, fg, mid), bg) >= min) hi = mid; else lo = mid;
      }
      return hi;
    }

    var ink = toRgb(hex("--ink", "#0f0d0c"));
    var paper = toRgb(hex("--paper", "#f7f1e6"));
    var accentDeep = toRgb(hex("--accent-deep", "#7d5610"));
    var accentLite = toRgb(hex("--accent-lite", "#e0b054"));

    /* Mirrors the fg-soft / fg-faint mix ratios tokens.css uses for
       the light ground and the .on-dark ground, so the hero scrubs
       onto the same AA-checked stops as the rest of the site rather
       than inventing a new ramp. */
    var softLight = mix(paper, ink, .76);
    var softDark = mix(ink, paper, .72);
    var faintLight = mix(paper, ink, .62);
    var faintDark = mix(ink, paper, .55);

    function render(t) {
      var bg = mix(paper, ink, t);
      var fg = pickFg(ink, paper, bg, AA_MIN);
      var fgSoft = pickFg(softLight, softDark, bg, AA_MIN);
      var fgFaint = pickFg(faintLight, faintDark, bg, AA_MIN);
      stage.style.setProperty("--bg", css(bg));
      stage.style.setProperty("--fg", css(fg));
      stage.style.setProperty("--fg-soft", css(fgSoft));
      stage.style.setProperty("--fg-faint", css(fgFaint));
      stage.style.setProperty("--accent-text", css(pickFg(accentDeep, accentLite, bg, AA_MIN)));
      if (bar) bar.style.width = (t * 100).toFixed(1) + "%";
      /* BM03: the interior photo darkens/reveals in step with the
         ground, a low ambient wash by day, closer to its full CSS
         fallback opacity (.5) by night. */
      if (photo) photo.style.opacity = (.08 + t * .42).toFixed(2);
      steps.forEach(function (el, i) {
        if (i === 0) {
          el.style.opacity = "1"; el.style.transform = "none";
          var kEl0 = $(".ab-step__kicker", el), tEl0 = $(".ab-step__text", el);
          if (kEl0) kEl0.style.opacity = "1";
          if (tEl0) tEl0.style.opacity = "1";
          /* Arrived step: release the em to its accent color (AX-R4-1). */
          var em0 = $("em", el);
          if (em0) em0.style.color = "";
          return;
        }
        var start = i === 1 ? .32 : .66;
        var local = Math.min(1, Math.max(0, (t - start) / .24));
        /* AX-R2-2: floor raised from .26 to .6 so the resting dim state
           of a not-yet-arrived step still clears AA on its own. Opacity
           is computed and applied SEPARATELY for the kicker (fg-faint)
           and the body line (fg) rather than once for the whole row:
           fg-faint's own natural contrast against the paper extreme is
           already thin (~5.24:1 at full opacity), so a shared floor
           driven by its worst case would force the whole row close to
           full opacity and erase the dim/arrived read entirely. Splitting
           them lets the body line keep a real dim state (~.58+) while
           the smaller kicker label, which has less room to give, holds
           its own higher floor. Transform still moves the row as one. */
        var target = .6 + local * .4;
        var textOp = safeOpacity(fg, bg, target, AA_MIN);
        var kickOp = safeOpacity(fgFaint, bg, target, AA_MIN);
        var kEl = $(".ab-step__kicker", el), tEl = $(".ab-step__text", el);
        /* Full float precision, not toFixed(2): rounding opacity to the
           nearest hundredth can shave off just enough of the safeOpacity
           bisection's margin to dip back under the AA target. */
        if (kEl) kEl.style.opacity = String(kickOp);
        if (tEl) tEl.style.opacity = String(textOp);
        /* AX-R4-1: an accent em (e.g. "fire") cannot clear AA at the row's
           dim opacity, which safeOpacity floors for the ink body color only.
           While the step is dimmed the em borrows the row ink; once it
           arrives it releases back to its CSS accent color. */
        var em = $("em", el);
        if (em) em.style.color = local < 1 ? "var(--fg)" : "";
        el.style.transform = "translateY(" + ((1 - local) * 14).toFixed(1) + "px)";
      });
    }

    render(0);

    /* Shrink the nav's dark-band marker to the back of the runway,
       matching where the ground actually crosses into night. The
       default full-height marker (set in the CSS) is what keeps the
       no-JS / reduced-motion single-ink-state fallback correct. */
    if (darkzone) {
      darkzone.style.top = "46%";
      window.dispatchEvent(new Event("resize"));
    }

    /* MO-R3-1: warm the stage photo's decode before the scrub arms so a
       cold first pass through the runway never pays paint cost mid-frame. */
    if (photo) {
      var pimg = photo.querySelector ? photo.querySelector("img") : null;
      if (!pimg && photo.tagName === "IMG") pimg = photo;
      if (pimg && pimg.decode) pimg.decode().catch(function () {});
    }

    var proxy = { t: 0 };
    g.to(proxy, {
      t: 1, ease: "none",
      scrollTrigger: { trigger: outer, start: "top top", end: "bottom bottom", scrub: .35 },
      onUpdate: function () { render(proxy.t); }
    });
  });
})();
