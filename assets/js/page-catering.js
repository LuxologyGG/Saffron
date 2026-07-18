/* =============================================================
   Saffron and Rice, catering page module.
   Loads LAST: vendor -> data.js -> app.js -> page-catering.js.
   Eval-time: fills every factual mount from window.SITE (platter
   bands, combos, services, FAQ, review, Persian annotation) so the
   shared systems in app.js can hook the injected nodes at boot.
   SR.ready: hero intro (title rise, dome triptych rising from the
   band's bottom edge, serves odometers, phone lockup settle).
   Reduced motion: everything already rests in its final state.
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
  /* "3-4" -> "3 to 4" for prose and chips. */
  function servesWords(s) { return String(s || "").replace("-", " to "); }
  /* Oxford-style list join: a, b, and c. */
  function joinList(arr) {
    if (arr.length <= 1) return arr.join("");
    if (arr.length === 2) return arr[0] + " and " + arr[1];
    return arr.slice(0, -1).join(", ") + ", and " + arr[arr.length - 1];
  }

  var platterSec = section("platters");

  /* -------------------------------------- hero Persian annotation */
  function fillFa() {
    var el = $("[data-cat-fa]");
    if (el && platterSec && platterSec.fa) el.textContent = platterSec.fa;
  }

  /* ------------------------------------ 01 the party platter bands */
  /* BM06 / item 31: repeat the dome-arch mask as a real grid unit (one
     small arch photo per tray) instead of a single one-off hero frame,
     reusing this page's own triptych photography, decorative repeats
     so they carry aria-hidden + empty alt (the hero triptych above
     already names each photo for screen readers). */
  var platterPhotos = {
    "platter-10": "assets/img/catering-platters.jpg",
    "platter-20": "assets/img/home-menu-teaser.jpg",
    "platter-30": "assets/img/menu-kabab.jpg"
  };
  function fillPlatters() {
    var mount = $("[data-platter-bands]");
    if (!mount || !platterSec) return;
    var picks = ["platter-10", "platter-20", "platter-30"];
    mount.innerHTML = picks.map(function (id) {
      var it = item(platterSec, id);
      if (!it) return "";
      var lines = String(it.desc || "").replace(/\.$/, "").split(", ").map(function (ln) {
        return "<li>" + esc(ln) + "</li>";
      }).join("");
      var photo = platterPhotos[id];
      return '<article class="platter" data-reveal-item>' +
        (photo ? '<div class="ph arch platter__ph" aria-hidden="true"><img src="' + esc(photo) + '" loading="lazy" alt=""></div>' : "") +
        '<div class="platter__serves">' +
          '<span class="platter__count"><span data-count="' + esc(it.serves) + '" data-plain>' + esc(it.serves) + "</span></span>" +
          '<span class="platter__unit">serves</span>' +
        "</div>" +
        '<div class="platter__body">' +
          '<h3 class="platter__name">' + esc(it.name) + "</h3>" +
          '<ul class="platter__lines">' + lines + "</ul>" +
        "</div>" +
        '<p class="platter__price">' + esc(money(it.price)) + "</p>" +
      "</article>";
    }).join("");
  }

  /* -------------------------------- 02 stews combo, family combos */
  function fillCombos() {
    var mount = $("[data-combo-cards]");
    if (!mount || !platterSec) return;
    var picks = ["stews-combo", "family-combo", "deluxe-family-combo"];
    mount.innerHTML = picks.map(function (id, i) {
      var it = item(platterSec, id);
      if (!it) return "";
      /* The serves sentence in the desc becomes a mono chip instead. */
      var desc = String(it.desc || "").replace(/\s*Serves[^.]*\.\s*$/, "");
      return '<article class="combo" data-reveal-item>' +
        '<p class="combo__idx">0' + (i + 1) + "</p>" +
        '<h3 class="combo__name">' + esc(it.name) + "</h3>" +
        (desc ? '<p class="combo__desc">' + esc(desc) + "</p>" : "") +
        (it.serves ? '<p class="combo__serves">Serves ' + esc(servesWords(it.serves)) + "</p>" : "") +
        '<p class="combo__price">' + esc(money(it.price)) + "</p>" +
      "</article>";
    }).join("");
  }

  /* --------------------------------------- 03 services chips */
  function fillServices() {
    var mount = $("[data-cat-services]");
    var c = SITE.company;
    if (!mount || !c || !c.services) return;
    mount.innerHTML = c.services.map(function (s) {
      return "<li>" + esc(s) + "</li>";
    }).join("");
  }

  /* ------------------------------------------------- 05 FAQ */
  /* Every answer is composed from facts data.js carries. No lead
     time exists in the data, so none is promised: we say call and
     we will plan it together. */
  function fillFaq() {
    var mount = $("[data-cat-faq]");
    var c = SITE.company || {};
    if (!mount) return;

    var rows = [];

    rows.push({
      q: "How far ahead should we call?",
      a: 'There is no set lead time to quote. Call <a data-bind-href="company.phoneHref" data-bind="company.phone"></a> ' +
         "and we will plan it with you, the date, the headcount, and the trays."
    });

    /* Stew choice, parsed from the platter descriptions. */
    var stewBits = [];
    ["platter-10", "platter-20", "platter-30"].forEach(function (id) {
      var it = item(platterSec, id);
      if (!it) return;
      var m = /choice of (\d+) stews?/i.exec(it.desc || "");
      if (m) {
        stewBits.push(m[1] + (m[1] === "1" ? " stew" : " stews") + " with the " + it.name.toLowerCase());
      }
    });
    rows.push({
      q: "Which stews can we choose?",
      a: stewBits.length ?
        "Any of them. Your choice comes from our Home Style Stews pots: " + esc(joinList(stewBits)) + "." :
        "Any of them. Your choice comes from our Home Style Stews pots."
    });

    var fam = item(platterSec, "family-combo");
    var dfam = item(platterSec, "deluxe-family-combo");
    var stews = item(platterSec, "stews-combo");
    var famBits = [];
    if (fam && fam.serves) famBits.push("the " + fam.name + " serves " + servesWords(fam.serves));
    if (dfam && dfam.serves) famBits.push("the " + dfam.name + " serves " + servesWords(dfam.serves));
    var famLine = famBits.length ? famBits.join(" and ").replace(/^t/, "T") + ". " : "";
    var stewLine = stews ?
      "The " + stews.name + " brings " +
      joinList(stews.desc.replace(/\.$/, "").toLowerCase().split(", ")) + " in one order." : "";
    rows.push({
      q: "What about a smaller table?",
      a: esc(famLine + stewLine)
    });

    var services = (c.services || []).map(function (s) { return s.toLowerCase(); });
    rows.push({
      q: "Do you deliver?",
      a: services.length ?
        "Yes. Our kitchen runs " + esc(joinList(services)) + ". Tell us where the table is when you call." :
        "Yes. Ask about delivery when you call."
    });

    rows.push({
      q: "When can we pick up?",
      a: '<span data-bind="company.hours.label"></span>. <span data-bind="company.hours.note"></span>'
    });

    mount.innerHTML = rows.map(function (r) {
      return '<div class="faq__row" data-reveal-item>' +
        '<dt class="faq__q">' + r.q + "</dt>" +
        '<dd class="faq__a">' + r.a + "</dd>" +
      "</div>";
    }).join("");
  }

  /* ------------------------------------------- 06 review card */
  function starSvg() {
    return '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
      '<path d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.2 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8z"/></svg>';
  }
  function fillReview() {
    var mount = $("[data-cat-review]");
    var reviews = SITE.reviews || [];
    if (!mount || !reviews.length) return;
    /* Pick the big pickup order quote; it is the catering story. */
    var r = reviews[3] || reviews[0]; /* Walter, not shown on index (VS-R2-4) */
    var stars = "";
    for (var i = 0; i < r.stars; i++) stars += starSvg();
    mount.innerHTML = '<article class="review">' +
      '<div class="review__stars" aria-hidden="true">' + stars + "</div>" +
      '<span class="sr-only">' + r.stars + " out of 5 stars on " + esc(r.src) + "</span>" +
      '<blockquote class="review__quote">' + esc(r.quote) + "</blockquote>" +
      '<p class="review__who"><b>' + esc(r.who) + "</b><span>" + esc(r.src) + ", " + esc(r.date) + "</span></p>" +
    "</article>";
  }

  fillFa();
  fillPlatters();
  fillCombos();
  fillServices();
  fillFaq();
  fillReview();

  if (!SR) return;

  /* ------------------------------------------------ hero intro */
  /* Title lines rise, the dome triptych climbs out of the band's
     bottom edge, serves counts odometer up, the phone lockup lands
     last. Reduced motion or missing vendors: the markup already
     rests in its final state, so we simply do nothing. */
  SR.onBoot(function () {
    if (SR.reduce || typeof window.gsap === "undefined") return;
    var g = window.gsap;
    var hero = $(".cat-hero");
    if (!hero) return;

    SR.ready(function () {
      var run = function () {
        var tl = g.timeline({ defaults: { ease: "sr" } });
        var title = $("[data-cat-title]");
        if (title && window.SplitText) {
          var split = new window.SplitText(title, { type: "lines", mask: "lines", linesClass: "sl" });
          tl.from(split.lines, { yPercent: 118, filter: "blur(7px)", duration: 1.15, stagger: .12 }, .05);
        } else if (title) {
          tl.from(title, { y: 40, opacity: 0, duration: 1.1 }, .05);
        }
        tl.from(".cat-hero__script", { y: 16, opacity: 0, duration: .7 }, .5)
          .from(".cat-hero__call > *", { y: 22, opacity: 0, duration: .8, stagger: .09 }, .55)
          .fromTo($$(".cat-arch__ph", hero),
            { clipPath: "inset(100% 0 0 0)" },
            { clipPath: "inset(0% 0 0 0)", duration: 1.35, ease: "srInOut", stagger: .14,
              clearProps: "clipPath" }, .25)
          .from($$(".cat-arch__ph img", hero), { scale: 1.16, duration: 1.8, stagger: .14 }, .25)
          .from($$(".cat-arch__serve", hero), { y: 18, opacity: 0, duration: .7, stagger: .12 }, .9);

        /* Serves odometers: 0 to 10 / 20 / 30 in step with the domes. */
        $$("[data-cat-count]", hero).forEach(function (el, i) {
          var target = parseFloat(el.getAttribute("data-cat-count")) || 0;
          var obj = { v: 0 };
          el.textContent = "0";
          g.to(obj, {
            v: target, duration: 1.5, delay: .95 + i * .16, ease: "power2.out",
            onUpdate: function () { el.textContent = String(Math.round(obj.v)); }
          });
        });
      };
      if (d.fonts && d.fonts.ready) d.fonts.ready.then(run); else run();
    });
  });

  /* Scrub depth: the domes keep rising at ramped lags as the band
     scrolls away, Laguna's lag-depth grammar on our arch triptych. */
  SR.onBoot(function () {
    if (SR.reduce || typeof window.gsap === "undefined" || !window.ScrollTrigger) return;
    var g = window.gsap;
    var hero = $(".cat-hero");
    if (!hero) return;
    $$(".cat-arch", hero).forEach(function (fig, i) {
      g.to(fig, {
        yPercent: -(3 + i * 3.5), ease: "none",
        scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: .4 + i * .5 }
      });
    });
  });
})();
