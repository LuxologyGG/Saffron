/* =============================================================
   Saffron & Rice, Menu page module ("The Counter")
   Loads LAST, after data.js and app.js. Three jobs:

   1. DATA FIDELITY: every rendered item row is authored statically
      in menu.html; this module verifies each name, desc, price,
      category title, and note against window.SITE.menu (the single
      source of truth), heals any drift, and reports the result on
      window.__menuFidelity. Rows are NEVER generated or JS-gated.
   2. ENHANCE: category item counts hydrate from the data.
   3. MOTION (skipped entirely under prefers-reduced-motion): the
      hero's scroll-scrubbed dotted leader "sets the table", red
      khatam ticks popping at each category chip, and the desktop
      category rail active state. Row reveals, masked category
      titles, and divider draw-ons ride the shared app.js hooks.

   House rules: no em dashes anywhere; relative URLs only.
   ============================================================= */
(function () {
  "use strict";

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var SITE = window.SITE || {};
  var menuData = SITE.menu || [];
  var motion = !reduce &&
    typeof window.gsap !== "undefined" &&
    typeof window.ScrollTrigger !== "undefined";

  /* innerText keeps visual line breaks (SplitText may have wrapped a
     heading already); normalize all whitespace before comparing. */
  function norm(el) {
    var t = el.innerText != null ? el.innerText : el.textContent;
    return (t || "").replace(/\s+/g, " ").trim();
  }

  /* ---------------- 1. Data fidelity: verify + heal ---------------- */
  function verifyMenu() {
    var report = { checked: 0, expected: 0, fixed: [], missing: [], ok: false };
    menuData.forEach(function (cat) {
      report.expected += cat.items.length;
      var sec = $('[data-menu-cat="' + cat.slug + '"]');
      if (!sec) { report.missing.push(cat.slug); return; }

      var title = $("[data-cat-title]", sec);
      if (title && norm(title) !== cat.title) {
        title.textContent = cat.title;
        report.fixed.push(cat.slug + ":title");
      }
      var note = $("[data-cat-note]", sec);
      if (cat.note && note && norm(note) !== cat.note) {
        note.textContent = cat.note;
        report.fixed.push(cat.slug + ":note");
      }
      if (cat.note && !note) report.missing.push(cat.slug + ":note");

      /* enhance: category counts from the data */
      $$('[data-cat-count="' + cat.slug + '"]').forEach(function (c) {
        var want = cat.items.length + " item" + (cat.items.length === 1 ? "" : "s");
        if (norm(c) !== want) c.textContent = want;
      });

      var rows = $$("[data-menu-item]", sec);
      if (rows.length > cat.items.length) report.missing.push(cat.slug + ":extra-rows");
      cat.items.forEach(function (item, i) {
        var row = rows[i];
        if (!row) { report.missing.push(cat.slug + "[" + i + "]"); return; }
        report.checked++;
        var pairs = [
          ["[data-item-name]", item.name, "name"],
          ["[data-item-desc]", item.desc, "desc"],
          ["[data-item-price]", item.price, "price"]
        ];
        pairs.forEach(function (p) {
          var el = $(p[0], row);
          if (!el) { report.missing.push(cat.slug + "[" + i + "]:" + p[2]); return; }
          if (norm(el) !== p[1]) {
            el.textContent = p[1];
            report.fixed.push(cat.slug + "[" + i + "]:" + p[2]);
          }
        });
      });
    });
    report.ok = report.checked === report.expected &&
      report.fixed.length === 0 && report.missing.length === 0;
    window.__menuFidelity = report;
    if (!report.ok) console.warn("Menu fidelity healed drift:", report);
  }

  /* ---------------- 3a. Hero: the set-the-table leader ----------------
     No-JS truth: dots and ticks ship fully visible, cover retracted.
     With motion: the cover extends, then a scrub retracts it left to
     right over the hero's scroll depth; each khatam tick pops as the
     leader reaches its chip. Transform/opacity only (perf contract). */
  function initSetline() {
    var hero = $("[data-mhero]");
    var line = $(".setline", hero || document);
    if (!hero || !line) return;
    var cover = $(".setline__cover", line);
    var ticks = $$(".setline__tick", line);
    var chips = $$("[data-chip]");

    function place() {
      var lr = line.getBoundingClientRect();
      if (!lr.width) return;
      chips.forEach(function (chip, i) {
        var t = ticks[i];
        if (!t) return;
        var cr = chip.getBoundingClientRect();
        var x = ((cr.left + cr.right) / 2 - lr.left) / lr.width;
        x = Math.max(0.03, Math.min(0.97, x));
        t.style.setProperty("--x", (x * 100).toFixed(2) + "%");
        t.setAttribute("data-pos", x.toFixed(3));
      });
    }
    place();
    window.addEventListener("resize", function () { window.requestAnimationFrame(place); });

    if (!motion || !cover) return;
    gsap.set(cover, { scaleX: 1 });
    gsap.set(ticks, { scale: 0.2, opacity: 0 });
    var on = ticks.map(function () { return false; });
    ScrollTrigger.create({
      trigger: hero,
      start: "top top",
      end: "bottom top",
      scrub: true,
      onUpdate: function (self) {
        var p = self.progress;
        gsap.set(cover, { scaleX: 1 - p });
        ticks.forEach(function (t, i) {
          var pos = parseFloat(t.getAttribute("data-pos") || String((i + 1) / 4));
          var hit = p >= pos;
          if (hit !== on[i]) {
            on[i] = hit;
            gsap.to(t, {
              scale: hit ? 1 : 0.2, opacity: hit ? 1 : 0,
              duration: 0.3, ease: "power2.out", overwrite: "auto"
            });
          }
        });
      }
    });
  }

  /* ---------------- 3a2. First-viewport rows ----------------
     app.js staggers item rows in on scroll (data-reveal-group). Rows
     already inside the first viewport at load (mobile guarantee: the
     first prices are visible without scrolling) must not wait for a
     scroll that may never come: reveal them immediately. The later
     scroll trigger then tweens to values they already hold (no-op). */
  function initFirstRows() {
    if (!motion) return;
    var early = $$("[data-reveal-item]").filter(function (el) {
      return el.getBoundingClientRect().top < window.innerHeight;
    });
    if (!early.length) return;
    gsap.to(early, {
      y: 0, opacity: 1, duration: 0.6, ease: "power2.out",
      stagger: 0.08, delay: 0.15, overwrite: "auto"
    });
  }

  /* ---------------- 3b. Desktop category rail ----------------
     Ships [hidden] in markup (pure enhancement; chips + index cover
     no-JS). Revealed here, active state follows the chapter in view.
     Functional nav state, so it runs under reduced motion too. */
  function initRail() {
    var rail = $(".mrail");
    if (!rail || typeof window.IntersectionObserver === "undefined") return;
    var cats = $$("[data-menu-cat]");
    if (!cats.length) return;
    rail.hidden = false;

    var items = {};
    $$("[data-rail]", rail).forEach(function (a) { items[a.getAttribute("data-rail")] = a; });
    function setActive(slug) {
      Object.keys(items).forEach(function (k) {
        items[k].classList.toggle("is-active", k === slug);
      });
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) setActive(e.target.getAttribute("data-menu-cat"));
      });
    }, { rootMargin: "-40% 0px -55% 0px", threshold: 0 });
    cats.forEach(function (sec) { io.observe(sec); });

    /* only show the rail while the chapters are on screen */
    var first = cats[0], last = cats[cats.length - 1];
    var vis = new IntersectionObserver(function () {
      var top = first.getBoundingClientRect().top;
      var bottom = last.getBoundingClientRect().bottom;
      var inside = top < window.innerHeight * 0.7 && bottom > window.innerHeight * 0.3;
      rail.hidden = !inside;
    }, { rootMargin: "20% 0px 20% 0px", threshold: [0, 0.05, 0.5, 1] });
    vis.observe(first);
    vis.observe(last);
  }

  function init() {
    verifyMenu();
    initSetline();
    initFirstRows();
    initRail();
    window.__menuBooted = true;
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
