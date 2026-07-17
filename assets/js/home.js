/* =============================================================
   Saffron and Rice, home page module.
   Loads LAST: vendor -> data.js -> app.js -> home.js.
   Eval-time: fills every factual mount from window.SITE (so the
   shared systems in app.js can hook the injected nodes at boot).
   SR.onBoot: mounts the saffron-thread hero canvas.
   SR.ready: plays the hero intro once the loader or arrival
   curtain has cleared. Reduced motion: everything lands static.
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

  function section(id) {
    var list = (SITE.menu && SITE.menu.sections) || [];
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  }
  function item(sec, id) {
    if (!sec) return null;
    for (var i = 0; i < sec.items.length; i++) if (sec.items[i].id === id) return sec.items[i];
    return null;
  }
  function money(n) {
    if (typeof n !== "number") return "";
    return "$" + (Number.isInteger(n) ? String(n) : n.toFixed(2));
  }

  /* ------------------------------------------ 02 kabab cards */
  function fillKababs() {
    var mount = $("[data-kabab-cards]");
    var sec = section("kababs");
    if (!mount || !sec) return;
    var picks = ["beef-koobideh", "beef-barg", "chicken-soltani"];
    mount.innerHTML = picks.map(function (id, i) {
      var it = item(sec, id);
      if (!it) return "";
      return '<article class="kcard" data-reveal-item>' +
        '<p class="kcard__idx">0' + (i + 1) + "</p>" +
        '<h3 class="kcard__name">' + esc(it.name) + "</h3>" +
        (it.desc ? '<p class="kcard__desc">' + esc(it.desc) + "</p>" : "") +
        '<p class="kcard__price">' + esc(money(it.price)) + "</p>" +
      "</article>";
    }).join("");
    var note = $("[data-kabab-note]");
    if (note && sec.note) note.textContent = sec.note;
    $$("[data-fa-of]").forEach(function (el) {
      var s = section(el.getAttribute("data-fa-of"));
      if (s && s.fa) el.textContent = s.fa;
    });
    var beef = $("[data-halal-beef]");
    if (beef && SITE.company && SITE.company.halal) beef.textContent = SITE.company.halal.beef;
  }

  /* --------------------------------------- 03 dish marquee */
  function fillMarquee() {
    var track = $("[data-dish-marquee]");
    if (!track) return;
    var picks = [
      ["kababs", "beef-koobideh"], ["stews", "ghorme-sabzi"], ["rice", "zereschk-polo"],
      ["kababs", "chicken-barg"], ["stews", "fasenjoon"], ["appetizers", "kashk-e-bademjoon"],
      ["kababs", "beef-soltani"], ["stews", "gheyme"], ["rice", "baghali-polo"],
      ["kababs", "salmon-kabab"], ["stews", "tahchin"], ["appetizers", "ash-e-reshteh"]
    ];
    track.innerHTML = picks.map(function (p) {
      var it = item(section(p[0]), p[1]);
      return it ? '<span class="marquee__item">' + esc(it.name) + "</span>" : "";
    }).join("");
  }

  /* -------------------------------------- 04 platter stats */
  function fillPlatters() {
    var mount = $("[data-platter-stats]");
    var sec = section("platters");
    if (!mount || !sec) return;
    var picks = ["platter-10", "platter-20", "platter-30"];
    mount.innerHTML = picks.map(function (id) {
      var it = item(sec, id);
      if (!it) return "";
      return '<div class="stat" data-reveal-item>' +
        '<div class="stat__num"><span data-count="' + esc(it.serves) + '" data-plain>0</span>' +
          '<span class="stat__unit">guests</span></div>' +
        '<div class="stat__label">' + esc(it.name) + "</div>" +
        '<div class="stat__price">' + esc(money(it.price)) + "</div>" +
      "</div>";
    }).join("");
  }

  /* ---------------------------------------- 05 review cards */
  function starSvg() {
    return '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
      '<path d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.2 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8z"/></svg>';
  }
  function fillReviews() {
    var mount = $("[data-review-cards]");
    var reviews = (SITE.reviews || []).slice(0, 3);
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

  /* ------------------------------------------- 06 services */
  function fillServices() {
    var mount = $("[data-services]");
    var c = SITE.company;
    if (!mount || !c || !c.services) return;
    mount.innerHTML = c.services.map(function (s) {
      return "<li>" + esc(s) + "</li>";
    }).join("");
  }

  fillKababs();
  fillMarquee();
  fillPlatters();
  fillReviews();
  fillServices();

  if (!SR) return;

  /* ------------------------------ hero canvas: saffron threads */
  /* Thin gold and pomegranate filaments drifting over the ink
     ground, each with its own depth; scrolling pulls them upward
     on a lag ramp (deeper threads catch up slower). Colors come
     from the computed tokens, not hardcoded hex. */
  SR.onBoot(function () {
    var cv = $("[data-hero-threads]");
    if (!cv) return;
    var host = cv.closest(".hero") || cv.parentElement;

    function tokenRgb(name, fallback) {
      var v = getComputedStyle(d.documentElement).getPropertyValue(name).trim();
      var m = v.match(/^#([0-9a-f]{6})$/i);
      if (!m) return fallback;
      var n = parseInt(m[1], 16);
      return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
    }
    var GOLD_LITE = tokenRgb("--accent-lite", [224, 176, 84]);
    var GOLD_BASE = tokenRgb("--accent-base", [192, 138, 40]);
    var POME = tokenRgb("--pomegranate-lite", [201, 111, 111]);

    var threads = [];
    var W = 0, H = 0;

    function rnd(a, b) { return a + Math.random() * (b - a); }

    function build(w, h) {
      W = w; H = h;
      var n = Math.round(Math.min(30, Math.max(12, w / 52)));
      threads = [];
      for (var i = 0; i < n; i++) {
        var depth = rnd(.22, 1);
        var pome = (i % 5 === 4);
        threads.push({
          x: Math.random() * w,
          y: Math.random() * h,
          len: rnd(30, 86) * (.6 + depth * .55),
          curl: rnd(.5, 1.5),
          rot: rnd(0, Math.PI * 2),
          rotV: rnd(-1, 1) * .00016,
          drift: rnd(-1, 1) * .009,
          sway: rnd(0, Math.PI * 2),
          swayV: rnd(.00028, .00062),
          amp: rnd(6, 20),
          depth: depth,
          lw: rnd(.8, 1.7) * (.55 + depth * .5),
          col: pome ? POME : (Math.random() < .5 ? GOLD_LITE : GOLD_BASE),
          alpha: (pome ? rnd(.2, .38) : rnd(.26, .6)) * (.5 + depth * .55),
          sy: 0
        });
      }
    }

    function draw(ctx, w, h, t) {
      if (!threads.length || W !== w || H !== h) build(w, h);
      ctx.clearRect(0, 0, w, h);
      var scroll = window.scrollY || 0;
      for (var i = 0; i < threads.length; i++) {
        var th = threads[i];
        /* lag-ramped scroll pull: deep threads chase the scroll slowly */
        var target = scroll * th.depth * .42;
        th.sy += (target - th.sy) * (.015 + .045 * th.depth);
        var span = w + 200;
        var px = (((th.x + t * th.drift) % span) + span) % span - 100;
        var py = th.y + Math.sin(t * th.swayV + th.sway) * th.amp - th.sy;
        py = ((py % (h + 160)) + (h + 160)) % (h + 160) - 80;
        var rot = th.rot + t * th.rotV + Math.sin(t * th.swayV * .7 + th.sway) * .25;
        var L = th.len, c = th.curl;
        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(rot);
        ctx.strokeStyle = "rgba(" + th.col[0] + "," + th.col[1] + "," + th.col[2] + "," + th.alpha + ")";
        ctx.lineWidth = th.lw;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(-L / 2, 0);
        ctx.bezierCurveTo(-L * .18, -L * .2 * c, L * .16, L * .18 * c, L / 2, -L * .1 * c);
        ctx.stroke();
        /* stigma tip: a short thicker flare */
        ctx.lineWidth = th.lw * 2.1;
        ctx.beginPath();
        ctx.moveTo(L / 2 - Math.max(3, L * .07), -L * .085 * c);
        ctx.lineTo(L / 2, -L * .1 * c);
        ctx.stroke();
        ctx.restore();
      }
    }
    draw.resize = build;

    SR.mountCanvas(cv, draw, { host: host, staticT: 4200 });
  });

  /* --------------------------------------------- hero intro */
  SR.onBoot(function () {
    if (SR.reduce || typeof window.gsap === "undefined") return;
    var g = window.gsap;
    var title = $("[data-hero-title]");
    if (!title) return;

    SR.ready(function () {
      var run = function () {
        var tl = g.timeline({ defaults: { ease: "sr" } });
        if (window.SplitText) {
          var split = new window.SplitText(title, { type: "lines", mask: "lines", linesClass: "sl" });
          tl.from(split.lines, { yPercent: 118, filter: "blur(7px)", duration: 1.15, stagger: .12 }, .05);
        } else {
          tl.from(title, { y: 40, opacity: 0, duration: 1.1 }, .05);
        }
        tl.from(".hero__kicker", { y: 18, opacity: 0, duration: .7 }, .3)
          .from(".hero__script", { y: 16, opacity: 0, duration: .7 }, .55)
          .from(".hero__ctas", { y: 16, opacity: 0, duration: .7 }, .7)
          .from(".hero__hud", { opacity: 0, duration: .8 }, .9)
          .fromTo(".hero__arch-mask",
            { clipPath: "inset(100% 0 0 0)" },
            { clipPath: "inset(0% 0 0 0)", duration: 1.5, ease: "srInOut" }, .15)
          .from(".hero__arch-mask img", { scale: 1.18, duration: 1.9 }, .15);
      };
      if (d.fonts && d.fonts.ready) d.fonts.ready.then(run); else run();
    });
  });
})();
