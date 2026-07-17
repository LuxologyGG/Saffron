/* =============================================================
   Saffron and Rice, menu page module.
   Loads LAST: vendor -> data.js -> app.js -> page-menu.js.
   Eval-time: renders EVERY section and EVERY item from
   SITE.menu.sections (rows, halal credential, arch photo bands,
   sticky section index, strip captions), so the shared systems in
   app.js can hook the injected nodes at boot.
   SR.onBoot: hero film-strip pin (gsap.matchMedia, desktop and
   motion-ok only) plus the scrollspy for the sticky index.
   SR.ready: hero entrance. Mobile, reduced motion, and no-JS all
   read the same markup as a calm stacked intro in its final state.
   House rule: no em dashes anywhere, in copy or comments.
   ============================================================= */
(function () {
  "use strict";

  var SITE = window.SITE || {};
  var d = document;
  var $ = function (s, c) { return (c || d).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || d).querySelectorAll(s)); };

  var sections = (SITE.menu && SITE.menu.sections) || [];

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function money(n, whole) {
    if (typeof n !== "number") return "";
    return whole ? "$" + String(n) : "$" + n.toFixed(2);
  }
  /* Format-only: prefix each numeral in a verbatim priceLabel with $ */
  function dollarize(label) {
    return String(label).replace(/\d+(?:\.\d\d)?/g, function (m) { return "$" + m; });
  }

  /* ------------------------------------------------ row rendering */
  function priceHtml(it) {
    if (it.priceLabel) {
      return '<span class="mrow__price">' + esc(dollarize(it.priceLabel)) + "</span>";
    }
    if (typeof it.veg === "number") {
      return '<span class="mrow__price mrow__price--dual">' +
        '<span class="mrow__pv"><em>meat</em>' + money(it.price) + "</span>" +
        '<span class="mrow__pv"><em>vegetarian</em>' + money(it.veg) + "</span>" +
      "</span>";
    }
    return '<span class="mrow__price">' + money(it.price, it.wholePrice === true) + "</span>";
  }

  function rowHtml(it) {
    return '<li class="mrow" data-reveal="fade">' +
      '<div class="mrow__line">' +
        '<h3 class="mrow__name">' + esc(it.name) + "</h3>" +
        '<span class="mrow__leader" aria-hidden="true"></span>' +
        priceHtml(it) +
      "</div>" +
      (it.desc ? '<p class="mrow__desc">' + esc(it.desc) + "</p>" : "") +
    "</li>";
  }

  /* Italic emphasis on the final word of multi-word titles */
  function emTitle(title) {
    var words = String(title).split(" ");
    if (words.length < 2) return esc(title);
    var last = words.pop();
    return esc(words.join(" ")) + " <em>" + esc(last) + "</em>";
  }

  function headHtml(sec, i) {
    var count = sec.items.length;
    return '<header class="chapter__head msec__head">' +
      '<span class="chapter__num" aria-hidden="true">' + pad(i + 1) + "</span>" +
      '<p class="eyebrow" data-scramble>' + count + (count === 1 ? " dish" : " dishes") + "</p>" +
      '<h2 class="h2 msec__title" id="msec-t-' + esc(sec.id) + '" data-reveal>' + emTitle(sec.title) + "</h2>" +
      (sec.fa ?
        '<div class="script-line msec__script" data-reveal="fade">' +
          '<span class="script-fa" lang="fa" dir="rtl" aria-hidden="true">' + esc(sec.fa) + "</span>" +
          (sec.note ? '<span class="translit">' + esc(sec.note) + "</span>" : "") +
        "</div>" : "") +
    "</header>";
  }

  /* Arch photo bands between chapter groups. Slots come from the
     section photo fields in data.js; menu-hero fills the kabab band
     so the strip images above are not repeated back to back. */
  var BANDS = {
    kababs:   { img: "assets/img/menu-hero.jpg", w: 1800, h: 1200,
                alt: "A Persian feast table with rice, green herb stew, fresh herbs, and tea" },
    stews:    { img: "assets/img/menu-stew.jpg", w: 1463, h: 1800,
                alt: "A bowl of green herb stew with beans beside a decorated saffron rice platter" },
    platters: { img: "assets/img/catering-platters.jpg", w: 1510, h: 1800,
                alt: "A feast platter of braised lamb over saffron rice ringed by dips and flatbreads" }
  };

  function bandHtml(sec) {
    var b = BANDS[sec.id];
    if (!b) return "";
    return '<figure class="mband" data-reveal="clip">' +
      '<div class="mband__arch arch"><div class="ph mband__ph">' +
        '<img src="' + b.img + '" width="' + b.w + '" height="' + b.h + '" loading="lazy" decoding="async"' +
        ' data-parallax="0.14" alt="' + esc(b.alt) + '">' +
      "</div></div>" +
      '<figcaption class="mband__cap">' + esc(sec.title) + "</figcaption>" +
    "</figure>";
  }

  /* Halal credential block, claims verbatim from data.js */
  function halalHtml() {
    var h = SITE.company && SITE.company.halal;
    if (!h) return "";
    return '<aside class="halal" data-reveal="fade" aria-label="Halal sourcing">' +
      '<p class="eyebrow">Our meat</p>' +
      '<ul class="halal__list">' +
        "<li>" + esc(h.beef) + "</li>" +
        "<li>" + esc(h.chicken) + "</li>" +
      "</ul>" +
      '<p class="halal__src">Word for word from our printed menu</p>' +
    "</aside>";
  }

  function sectionHtml(sec, i) {
    return bandHtml(sec) +
      '<section class="msec" id="' + esc(sec.id) + '" aria-labelledby="msec-t-' + esc(sec.id) + '">' +
        headHtml(sec, i) +
        '<ul class="mlist">' + sec.items.map(rowHtml).join("") + "</ul>" +
        (sec.id === "kababs" ? halalHtml() : "") +
      "</section>";
  }

  function renderMenu() {
    var root = $("[data-menu-root]");
    if (!root || !sections.length) return;
    root.innerHTML = sections.map(sectionHtml).join("");
  }

  function renderIndex() {
    var host = $("[data-menu-index]");
    if (!host || !sections.length) return;
    host.innerHTML =
      '<p class="eyebrow eyebrow--plain mindex__label">The carta</p>' +
      '<ul class="mindex__list">' +
      sections.map(function (sec, i) {
        return '<li><a class="mindex__link" href="#' + esc(sec.id) + '" data-spy="' + esc(sec.id) + '">' +
          '<span class="mindex__num">' + pad(i + 1) + "</span>" +
          '<span class="mindex__t">' + esc(sec.title) + "</span></a></li>";
      }).join("") +
      "</ul>";
  }

  /* Film-strip captions read the real section titles */
  function fillCaps() {
    $$("[data-cap-of]").forEach(function (el) {
      var id = el.getAttribute("data-cap-of");
      for (var i = 0; i < sections.length; i++) {
        if (sections[i].id === id) { el.textContent = sections[i].title; return; }
      }
    });
  }

  renderMenu();
  renderIndex();
  fillCaps();

  var SR = window.SR;
  if (!SR) return;

  /* ------------------------------------------------- scrollspy */
  SR.onBoot(function () {
    var links = $$("[data-spy]");
    if (!links.length) return;
    var secEls = links.map(function (a) {
      return d.getElementById(a.getAttribute("data-spy"));
    });
    var ticking = false;
    function update() {
      ticking = false;
      var line = window.innerHeight * .38;
      var active = -1;
      for (var i = 0; i < secEls.length; i++) {
        if (secEls[i] && secEls[i].getBoundingClientRect().top <= line) active = i;
      }
      links.forEach(function (a, i) {
        var on = i === active;
        a.classList.toggle("is-active", on);
        if (on) a.setAttribute("aria-current", "location");
        else a.removeAttribute("aria-current");
      });
    }
    function onScroll() {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
  });

  /* --------------------------------- hero: pinned film-strip scrub */
  /* Desktop and motion-ok only. gsap.matchMedia reverts every tween,
     set, and ScrollTrigger it creates when the condition flips, so
     resizing to mobile or enabling reduced motion restores the calm
     stacked intro that the CSS default state already styles. */
  SR.onBoot(function () {
    var section = $("[data-mhero]");
    var strip = $("[data-mhero-strip]");
    var carta = $("[data-mhero-carta]");
    if (!section || !strip || !carta) return;
    if (typeof window.gsap === "undefined" || !window.ScrollTrigger) return;
    var g = window.gsap;
    if (typeof g.matchMedia !== "function") return;

    var mm = g.matchMedia();
    mm.add("(min-width: 901px) and (prefers-reduced-motion: no-preference)", function () {
      section.classList.add("is-pinned");
      var cells = $$("[data-mhero-cell]", strip);
      var caps = $$(".mhero__cap", strip);
      var rest = cells.slice(1);
      var restCaps = caps.slice(1);
      var inner = $$(":scope > *", carta);

      /* Panel parks off the right edge; yPercent centers it. */
      g.set(carta, { xPercent: 112, yPercent: -50 });

      var tl = g.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=260%",
          scrub: true,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true
        }
      });
      /* Beat 1: the row compresses into slivers, first dish dominant */
      tl.to(rest, { width: 72, duration: 2.4, ease: "power2.inOut", stagger: .55 }, .4)
        .to(restCaps, { opacity: 0, duration: .9, ease: "none", stagger: .55 }, .3)
        /* Beat 2: the carta panel wipes in from the right */
        .to(strip, { x: -40, duration: 3, ease: "power2.inOut" }, 4.4)
        .to(carta, { xPercent: 0, duration: 3, ease: "power3.out" }, 4.4)
        .fromTo(inner, { y: 34, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.4, ease: "power2.out", stagger: .35 }, 5.2)
        /* Beat 3: a settle beat before the pin releases */
        .to({}, { duration: 1.2 });

      return function () {
        section.classList.remove("is-pinned");
      };
    });
  });

  /* ---------------------------------------------- hero entrance */
  SR.ready(function () {
    if (SR.reduce || typeof window.gsap === "undefined") return;
    var g = window.gsap;
    var section = $("[data-mhero]");
    if (!section) return;

    var run = function () {
      var cells = $$("[data-mhero-cell]", section);
      var tl = g.timeline({ defaults: { ease: "sr" } });
      if (section.classList.contains("is-pinned")) {
        tl.from(cells, {
          yPercent: 14, opacity: 0, duration: 1.15, stagger: .09,
          clearProps: "opacity,transform"
        });
        var hud = $(".mhero__hud", section);
        if (hud) tl.from(hud, { opacity: 0, duration: .8, clearProps: "opacity" }, .7);
      } else {
        var title = $("[data-mhero-title]");
        if (window.SplitText && title) {
          var split = new window.SplitText(title, { type: "lines", mask: "lines", linesClass: "sl" });
          tl.from(split.lines, { yPercent: 118, filter: "blur(6px)", duration: 1.1, stagger: .1 }, .05);
        }
        tl.from($$(".mhero__kicker, .mhero__script, .mhero__note, .mhero__meta", section),
            { y: 20, opacity: 0, duration: .75, stagger: .1, clearProps: "opacity,transform" }, .35)
          .from(cells, {
            y: 26, opacity: 0, duration: .9, stagger: .07,
            clearProps: "opacity,transform"
          }, .55);
      }
    };
    if (d.fonts && d.fonts.ready) d.fonts.ready.then(run); else run();
  });
})();
