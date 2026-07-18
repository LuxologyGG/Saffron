/* =============================================================
   Saffron and Rice, shared shell + motion engine.
   Load order: vendor (gsap, ScrollTrigger, CustomEase, SplitText,
   ScrambleText, DrawSVG, lenis) -> data.js -> app.js -> [page js].

   What this file does:
   - html.js class, Lenis + GSAP + ScrollTrigger wiring, house eases.
   - Builds the runtime shell: overlay menu, first-visit loader,
     arch transition curtain, full footer markup from window.SITE.
   - Data binding: [data-bind="dot.path"] textContent and
     [data-bind-href="dot.path"] href resolve against window.SITE.
   - Effect systems on data attributes, every one of them leaves
     elements in their FINAL state under prefers-reduced-motion or
     when a vendor is missing:
       data-reveal (masked line rise + blur clear; "fade", "clip")
       data-reveal-group (+ optional data-reveal-item children)
       data-scramble          mono labels resolve into themselves
       data-parallax="0.2"    drift inside the parent band
       data-count="30"        odometer (data-decimals data-prefix
                              data-suffix data-plain)
       data-draw              DrawSVG stroke draw-on (inline svg)
       data-marquee           seamless rail (.marquee__track inside)
   - Page hook API on window.SR:
       SR.onBoot(fn)   run fn during boot, after core systems exist
       SR.ready(fn)    run fn when the loader / arrival curtain has
                       cleared (heroes start here)
       SR.mountCanvas(canvas, draw, opts) DPR-aware canvas loop with
                       IntersectionObserver pause; reduced motion
                       renders ONE static frame. draw(ctx, w, h, t).
                       opts: { host, staticT }. Returns api or null.
       SR.marquee(el)  (re)measure a marquee after filling it
       SR.reduce SR.fine SR.$ SR.$$ SR.site SR.refresh()
   House rule: no em dashes anywhere, in copy or comments.
   ============================================================= */
(function () {
  "use strict";

  var d = document;
  var root = d.documentElement;
  root.classList.add("js");
  /* The head watchdog checks this flag before force-clearing overlays. */
  window.__SR_BOOTED = true;

  var SITE = window.SITE || {};
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var hasGsap = typeof window.gsap !== "undefined";
  var g = window.gsap;

  var $ = function (s, c) { return (c || d).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || d).querySelectorAll(s)); };

  function store(key, val) {
    try {
      if (val === undefined) return window.sessionStorage.getItem(key);
      if (val === null) window.sessionStorage.removeItem(key);
      else window.sessionStorage.setItem(key, val);
    } catch (e) { return null; }
    return null;
  }

  /* 404.html deploys with root-relative links (it can be served at any
     nested miss path); it sets data-root="/" on <html> so runtime-built
     links match its static ones. Every other page leaves this empty. */
  var ROOT = root.getAttribute("data-root") || "";

  var NAV_LINKS = [
    { label: "Menu", href: "menu.html" },
    { label: "Catering", href: "catering.html" },
    { label: "About", href: "about.html" },
    { label: "Contact", href: "contact.html" }
  ];

  /* ------------------------------------------------ SR public api */
  var bootQueue = [];
  var readyQueue = [];
  var readyFired = false;

  function notifyReady() {
    if (readyFired) return;
    readyFired = true;
    readyQueue.forEach(function (fn) { try { fn(); } catch (e) { console.error(e); } });
    readyQueue = [];
  }

  var SR = window.SR = {
    reduce: reduce, fine: fine, site: SITE, $: $, $$: $$,
    onBoot: function (fn) { bootQueue.push(fn); },
    ready: function (fn) { if (readyFired) fn(); else readyQueue.push(fn); },
    mountCanvas: mountCanvas,
    marquee: measureMarquee,
    button070: button070,
    refresh: function () { if (hasGsap && window.ScrollTrigger) window.ScrollTrigger.refresh(); }
  };

  /* --------------------------------------------------- data binds */
  function getPath(obj, path) {
    if (!obj || !path) return undefined;
    return path.split(".").reduce(function (o, k) {
      return (o === undefined || o === null) ? undefined : o[k];
    }, obj);
  }

  function bindData() {
    $$("[data-bind]").forEach(function (el) {
      var v = getPath(SITE, el.getAttribute("data-bind"));
      if (v !== undefined && v !== null) el.textContent = v;
    });
    $$("[data-bind-href]").forEach(function (el) {
      var v = getPath(SITE, el.getAttribute("data-bind-href"));
      if (v) el.setAttribute("href", v);
    });
  }

  /* Wrap every .btn__text for the CSS letter-swap hover. */
  function wrapSwaps() {
    $$(".btn__text").forEach(function (el) {
      if ($(".swap", el)) return;
      var text = el.textContent.trim();
      el.textContent = "";
      var s = d.createElement("span");
      s.className = "swap";
      s.setAttribute("data-text", text);
      s.textContent = text;
      el.appendChild(s);
    });
  }

  /* -------------------------------------------------- footer */
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  /* The house primary CTA: Osmo button-070, corner brackets that
     spread on hover, accent fill. opts: href OR hrefBind (data-bind-href),
     label OR textBind (data-bind), blank (target=_blank + noopener). */
  function button070(opts) {
    opts = opts || {};
    var hrefAttr = opts.hrefBind ? ' data-bind-href="' + esc(opts.hrefBind) + '"' :
      ' href="' + esc(opts.href || "#") + '"';
    var target = opts.blank ? ' target="_blank" rel="noopener"' : "";
    var textBind = opts.textBind ? ' data-bind="' + esc(opts.textBind) + '"' : "";
    var label = opts.label != null ? esc(opts.label) : "";
    return '<a class="button-070 is-accent"' + hrefAttr + target + '>' +
      '<span class="button-070__bg-wrap">' +
        '<span class="button-070__corner-wrap">' +
          '<span class="button-070__corner is--top-left"></span>' +
          '<span class="button-070__corner is--top-right"></span>' +
          '<span class="button-070__corner is--bottom-left"></span>' +
          '<span class="button-070__corner is--bottom-right"></span>' +
        "</span>" +
        '<span class="button-070__bg"></span>' +
      "</span>" +
      '<span class="button-070__inner"><span class="button-070__text"' + textBind + '>' + label + "</span></span>" +
    "</a>";
  }

  function renderFooter() {
    var host = $("[data-site-footer]");
    var c = SITE.company;
    if (!host || !c) return;
    var order = (SITE.orderLinks && SITE.orderLinks[0]) || null;
    var insta = (SITE.social && SITE.social[0]) || null;
    var a = c.address || {};
    var pageLinks = NAV_LINKS.map(function (l) {
      return '<li><a class="footer__navlink" href="' + ROOT + l.href + '">' + esc(l.label) + "</a></li>";
    }).join("");
    host.innerHTML =
      '<div class="wrap">' +
        '<div class="footer__top">' +
          '<div class="footer__seal">' +
            '<img src="' + ROOT + 'assets/img/brand/logo-lockup.png" ' +
                 'alt="' + esc(c.name) + ", " + esc(c.tagline) + '" loading="lazy" width="800" height="910">' +
          "</div>" +
          '<div class="footer__lede">' +
            '<p class="script-fa footer__fa" lang="fa" dir="rtl" aria-hidden="true">' + esc(c.scriptFa) + "</p>" +
            '<p class="footer__tag">' + esc(c.tagline) + ", " + esc(a.city) + ", " + esc(a.state) + "</p>" +
            '<div class="menu__ctas">' +
              (order ? button070({ href: order.href, blank: true, label: order.label }) : "") +
              '<a class="btn" href="' + esc(c.phoneHref) + '"><span class="btn__text">' + esc(c.phone) + "</span></a>" +
            "</div>" +
          "</div>" +
        "</div>" +
        '<div class="footer__grid">' +
          '<div class="footer__col">' +
            '<p class="footer__label">Find us</p>' +
            "<address>" + esc(a.street) + "<br>" + esc(a.city) + ", " + esc(a.state) + " " + esc(a.zip) + "</address>" +
            '<a class="tlink" href="' + esc(a.mapsUrl) + '" target="_blank" rel="noopener">Directions</a>' +
          "</div>" +
          '<div class="footer__col">' +
            '<p class="footer__label">Hours</p>' +
            "<p>" + esc(c.hours && c.hours.label) + "</p>" +
            "<p>" + esc(c.hours && c.hours.note) + "</p>" +
            '<a class="footer__phone" href="' + esc(c.phoneHref) + '">' + esc(c.phone) + "</a>" +
          "</div>" +
          '<div class="footer__col">' +
            '<p class="footer__label">Order and follow</p>' +
            "<ul>" +
              (order ? '<li><a href="' + esc(order.href) + '" target="_blank" rel="noopener">' + esc(order.label) + "</a></li>" : "") +
              (insta ? '<li><a href="' + esc(insta.href) + '" target="_blank" rel="noopener">' + esc(insta.label) + "</a></li>" : "") +
              pageLinks +
            "</ul>" +
          "</div>" +
          '<div class="footer__col footer__halal">' +
            '<p class="footer__label">Our kitchen</p>' +
            "<p>" + esc((c.services || []).join(" / ")) + "</p>" +
            "<p>" + esc(c.halal && c.halal.beef) + "</p>" +
            "<p>" + esc(c.halal && c.halal.chicken) + "</p>" +
          "</div>" +
        "</div>" +
        '<div class="footer__colophon">' +
          "<p>&copy; 2026 " + esc(c.name) + ", " + esc(a.city) + ", California.</p>" +
          "<p>" + esc(SITE.imageNote) + "</p>" +
        "</div>" +
      "</div>";
  }

  /* ------------------------------------------------- active link */
  function currentPage() {
    var p = location.pathname.split("/").pop();
    return p === "" ? "index.html" : p;
  }

  function markActive() {
    var page = currentPage();
    $$(".nav__link, .menu__link").forEach(function (a) {
      var href = a.getAttribute("href");
      if (href === page) {
        a.classList.add("is-active");
        a.setAttribute("aria-current", "page");
      }
    });
  }

  /* -------------------------------------------------- overlay menu */
  var menuEl = null, toggleEl = null;

  function buildMenuOverlay() {
    toggleEl = $("[data-menu-toggle]");
    if (!toggleEl) return;
    var c = SITE.company || {};
    var order = (SITE.orderLinks && SITE.orderLinks[0]) || null;
    menuEl = d.createElement("div");
    menuEl.className = "menu";
    menuEl.id = "site-menu";
    menuEl.innerHTML =
      '<nav aria-label="Site menu"><ul class="menu__list">' +
        NAV_LINKS.map(function (l, i) {
          return '<li class="menu__item"><a class="menu__link" href="' + ROOT + l.href + '">' +
            '<span class="menu__index">0' + (i + 1) + "</span><span>" + esc(l.label) + "</span></a></li>";
        }).join("") +
      "</ul></nav>" +
      '<div class="menu__script">' +
        '<span class="script-fa" lang="fa" dir="rtl" aria-hidden="true">' + esc(c.scriptFa) + "</span>" +
        '<span class="menu__translit">Za’faran o berenj, ' + esc(c.tagline) + "</span>" +
      "</div>" +
      '<div class="menu__ctas">' +
        (order ? button070({ href: order.href, blank: true, label: order.label }) : "") +
        '<a class="btn btn--price" href="' + esc(c.phoneHref) + '"><span class="btn__text">' + esc(c.phone) + "</span></a>" +
      "</div>";
    d.body.appendChild(menuEl);
  }

  function menuIsOpen() { return d.body.classList.contains("menu-open"); }

  function setMenu(open) {
    if (!menuEl || !toggleEl) return;
    d.body.classList.toggle("menu-open", open);
    toggleEl.setAttribute("aria-expanded", String(open));
    toggleEl.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    /* Seal off every landmark outside the overlay so Tab cannot escape
       into it: main content, the footer, and the header's own brand
       link and nav (the toggle itself stays reachable, it is the
       close control). .nav__links/.nav__call are already display:none
       at the width the overlay opens, so inert on them is defensive. */
    [$("#main"), $("[data-site-footer]"), $(".nav__brand"), $(".nav__links"), $(".nav__call")].forEach(function (el) {
      if (el) { if (open) el.setAttribute("inert", ""); else el.removeAttribute("inert"); }
    });
    if (window.lenisRef) { if (open) window.lenisRef.stop(); else window.lenisRef.start(); }
    if (open) {
      if (hasGsap && !reduce) {
        g.fromTo($$(".menu__item, .menu__script, .menu__ctas", menuEl),
          { y: 36, opacity: 0 },
          { y: 0, opacity: 1, duration: .7, ease: "sr", stagger: .07, overwrite: true, clearProps: "opacity,transform" });
      }
      requestAnimationFrame(function () {
        var first = $(".menu__link", menuEl);
        if (first) first.focus();
      });
    } else {
      toggleEl.focus();
    }
  }

  function initMenu() {
    if (!menuEl || !toggleEl) return;
    toggleEl.addEventListener("click", function () { setMenu(!menuIsOpen()); });
    d.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menuIsOpen()) setMenu(false);
    });
    menuEl.addEventListener("click", function (e) {
      var a = e.target.closest("a");
      if (a && a.classList.contains("menu__link")) setMenu(false);
    });
  }

  /* ------------------------------------------------------- lenis */
  function initLenis() {
    if (reduce || typeof window.Lenis === "undefined" || !hasGsap) return;
    var lenis = new window.Lenis({
      duration: 1.15,
      easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
      smoothWheel: true
    });
    window.lenisRef = lenis;
    if (window.ScrollTrigger) lenis.on("scroll", window.ScrollTrigger.update);
    g.ticker.add(function (t) { lenis.raf(t * 1000); });
    g.ticker.lagSmoothing(0);
  }

  function initAnchors() {
    $$('a[href^="#"]:not(.skip-link)').forEach(function (a) {
      a.addEventListener("click", function (e) {
        var id = a.getAttribute("href");
        if (id.length < 2) return;
        var t = $(id);
        if (!t) return;
        e.preventDefault();
        if (window.lenisRef) window.lenisRef.scrollTo(t, { offset: -70 });
        else t.scrollIntoView();
        t.setAttribute("tabindex", "-1");
        t.focus({ preventScroll: true });
      });
    });
  }

  function initSkip() {
    var skip = $(".skip-link");
    if (!skip) return;
    skip.addEventListener("click", function (e) {
      e.preventDefault();
      var main = $("#main");
      if (!main) return;
      if (window.lenisRef) window.lenisRef.scrollTo(main, { immediate: true });
      else main.scrollIntoView();
      main.focus({ preventScroll: true });
    });
  }

  /* --------------------------------------- curtain + transitions */
  var curtain = null;

  function buildCurtain() {
    curtain = d.createElement("div");
    curtain.className = "curtain";
    curtain.setAttribute("aria-hidden", "true");
    d.body.appendChild(curtain);
    if (hasGsap) g.set(curtain, { yPercent: 115 });
  }

  function curtainCover(cb) {
    if (!curtain || !hasGsap || reduce) { if (cb) cb(); return; }
    g.killTweensOf(curtain);
    curtain.classList.add("is-active");
    g.fromTo(curtain, { yPercent: 115 }, {
      yPercent: 0, duration: .72, ease: "srInOut", onComplete: cb
    });
  }

  function parkCurtain() {
    if (!curtain) return;
    curtain.classList.remove("is-active");
    if (hasGsap) g.set(curtain, { yPercent: 115 });
    else curtain.style.transform = "translateY(115%)";
  }

  function curtainReveal() {
    if (!curtain) { notifyReady(); return; }
    if (!hasGsap || reduce) {
      parkCurtain();
      notifyReady();
      return;
    }
    g.killTweensOf(curtain);
    curtain.classList.add("is-active");
    g.set(curtain, { yPercent: 0 });
    /* Reveal is already in motion (the cover already fully hid the
       page), so it wants a settle, not an ease-in: srSoft over
       srInOut here, "motion that settles like steam". */
    g.to(curtain, {
      yPercent: -115, duration: .9, ease: "srSoft", delay: .08,
      onStart: notifyReady,
      onComplete: parkCurtain
    });
  }

  function initTransitions() {
    d.addEventListener("click", function (e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      var a = e.target.closest("a");
      if (!a) return;
      var href = a.getAttribute("href");
      if (!href || href.charAt(0) === "#" || href.indexOf("mailto:") === 0 ||
          href.indexOf("tel:") === 0 || a.target === "_blank" ||
          a.hasAttribute("download") || a.hasAttribute("data-no-transition")) return;
      if (a.origin && a.origin !== location.origin) return;
      if (a.href === location.href) { e.preventDefault(); return; }
      e.preventDefault();
      if (menuIsOpen()) setMenu(false);
      store("srArrive", "1");
      curtainCover(function () { window.location.href = a.href; });
    });
    window.addEventListener("pageshow", function (e) {
      if (!e.persisted) return;
      root.classList.remove("sr-cover");
      parkCurtain();
      var loader = $(".loader");
      if (loader) loader.remove();
      if (menuIsOpen()) setMenu(false);
      notifyReady();
    });
  }

  /* ------------------------------------------------------- loader */
  function buildLoader() {
    var c = SITE.company || {};
    var a = c.address || {};
    var el = d.createElement("div");
    el.className = "loader";
    el.setAttribute("role", "status");
    el.setAttribute("aria-label", "Loading");
    el.innerHTML =
      '<div class="loader__inner">' +
        '<div class="loader__row">' +
          '<span class="loader__line loader__line--l"></span>' +
          '<span class="loader__seal"><img src="' + ROOT + 'assets/img/brand/emblem.png" alt="" width="480" height="332"></span>' +
          '<span class="loader__line loader__line--r"></span>' +
        "</div>" +
        '<div class="loader__mark" aria-hidden="true"></div>' +
        '<p class="loader__word">' + esc(c.name || "Saffron & Rice") + "</p>" +
        '<p class="loader__fa script-fa" lang="fa" dir="rtl" aria-hidden="true">' + esc(c.scriptFa) + "</p>" +
        '<p class="loader__kicker">' + esc(a.city) + ", California</p>" +
      "</div>";
    d.body.appendChild(el);
    /* Inline the vector wordmark so its letterforms can stroke-draw.
       Local same-origin fetch; the text word stays as the fallback.
       el._started (set by runLoader's go(), CP-6) flags that the
       180ms fallback already kicked the timeline off with the plain
       text word; if the fetch lands after that we skip the swap
       entirely rather than pop a fully-inked, never-drawn SVG in
       mid-animation. */
    if (window.fetch) {
      el._markReady = fetch(ROOT + "assets/img/brand/logo-text.svg")
        .then(function (r) { return r.ok ? r.text() : null; })
        .then(function (txt) {
          if (!txt || el._started) return false;
          var slot = $(".loader__mark", el);
          if (!slot || !el.isConnected) return false;
          slot.innerHTML = txt;
          var svg = slot.querySelector("svg");
          if (!svg) return false;
          svg.setAttribute("aria-hidden", "true");
          svg.setAttribute("focusable", "false");
          el.classList.add("loader--marked");
          return true;
        })
        .catch(function () { return false; });
    }
    return el;
  }

  function runLoader() {
    var loader = buildLoader();
    root.classList.remove("sr-cover");
    if (!hasGsap || reduce) {
      loader.remove();
      notifyReady();
      return;
    }
    if (window.lenisRef) window.lenisRef.stop();
    /* Give the wordmark fetch a beat to land; never hold boot longer. */
    var started = false;
    function go() {
      if (started) return;
      started = true;
      loader._started = true;
      runLoaderTimeline(loader);
    }
    if (loader._markReady) {
      loader._markReady.then(go, go);
      setTimeout(go, 180);
    } else {
      go();
    }
  }

  function runLoaderTimeline(loader) {
    var tl = g.timeline({
      defaults: { ease: "sr" },
      onComplete: function () {
        loader.remove();
        if (window.lenisRef) window.lenisRef.start();
      }
    });
    var marked = loader.classList.contains("loader--marked");
    var markPaths = marked ? $$(".loader__mark path", loader) : [];
    var wordTargets = [$(".loader__fa", loader), $(".loader__kicker", loader)];
    if (!markPaths.length) wordTargets.unshift($(".loader__word", loader));

    tl.fromTo($$(".loader__line", loader), { scaleX: 0 }, { scaleX: 1, duration: .9, stagger: 0 })
      .fromTo($(".loader__seal", loader), { y: 26, opacity: 0, scale: .94 },
        { y: 0, opacity: 1, scale: 1, duration: .85 }, .15);
    if (markPaths.length) {
      /* Letterforms draw their outlines, then ink themselves in. */
      g.set(markPaths, { stroke: "currentColor", strokeWidth: 1, fillOpacity: 0, drawSVG: "0%" });
      tl.to(markPaths, { drawSVG: "100%", duration: 1.0, stagger: .05, ease: "none" }, .4)
        .to(markPaths, { fillOpacity: 1, duration: .5, ease: "sr" }, "-=.45")
        .to(markPaths, { strokeOpacity: 0, duration: .35, ease: "sr" }, "<+.1");
    }
    tl.fromTo(wordTargets,
        { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: .7, stagger: .1 },
        markPaths.length ? "-=.55" : .45)
      .to(loader, {
        yPercent: -112, duration: .95, ease: "srInOut", delay: markPaths.length ? .35 : .5,
        onStart: notifyReady
      });
  }

  /* -------------------------------------------------- nav state */
  function initNavState() {
    var nav = $("[data-nav]");
    if (!nav) return;
    var darkSections = $$('[data-nav-theme="dark"], .on-dark, .on-teal').filter(function (el) {
      /* data-nav-ignore: element uses a dark token scope for styling
         only (e.g. the about dusk stage, whose ground starts cream);
         a separate marker element drives the nav flip instead. */
      return !el.closest(".menu") && !el.hasAttribute("data-nav-ignore");
    });
    var ticking = false;
    function update() {
      ticking = false;
      var y = window.scrollY || 0;
      nav.classList.toggle("is-scrolled", y > 24);
      var probe = nav.offsetHeight * .6;
      var dark = false;
      var wideEnough = window.innerWidth * .7;
      for (var i = 0; i < darkSections.length; i++) {
        var r = darkSections[i].getBoundingClientRect();
        /* Only full-bleed bands theme the fixed nav; a narrow dark
           card nested in a column (e.g. a CTA panel) must not flip it. */
        if (r.width < wideEnough) continue;
        if (r.top <= probe && r.bottom >= probe && r.height > 0) { dark = true; break; }
      }
      nav.classList.toggle("nav--over-dark", dark);
    }
    function onScroll() {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
  }

  /* ------------------------------------------------ reveal systems */
  function stagger(el, fallback) {
    var v = parseFloat(getComputedStyle(el).getPropertyValue("--stagger"));
    return isNaN(v) ? fallback : v / 1000;
  }

  /* Reveals are LAZY: elements rest in their finished state and only
     get their hidden "from" state the instant their trigger enters,
     so a JS stall, reduced motion, or a full-page snapshot never
     shows a half-revealed page. */
  function onceEnter(el, start, run) {
    window.ScrollTrigger.create({ trigger: el, start: start, once: true, onEnter: run });
  }

  function initReveals() {
    if (!hasGsap || !window.ScrollTrigger || reduce) return;

    $$('[data-reveal=""], [data-reveal="lines"]').forEach(function (el) {
      if (el.dataset.srDone) return; el.dataset.srDone = "1";
      if (typeof window.SplitText === "undefined") return;
      onceEnter(el, "top 88%", function () {
        var split = new window.SplitText(el, { type: "lines", mask: "lines", linesClass: "sl" });
        g.fromTo(split.lines,
          { yPercent: 115, filter: "blur(6px)" },
          { yPercent: 0, filter: "blur(0px)", duration: 1.05, ease: "sr",
            stagger: stagger(el, .09) });
      });
    });

    $$('[data-reveal="fade"]').forEach(function (el) {
      if (el.dataset.srDone) return; el.dataset.srDone = "1";
      onceEnter(el, "top 90%", function () {
        g.fromTo(el, { y: 34, opacity: 0 },
          { y: 0, opacity: 1, duration: .95, ease: "sr", clearProps: "opacity,transform" });
      });
    });

    $$('[data-reveal="clip"]').forEach(function (el) {
      if (el.dataset.srDone) return; el.dataset.srDone = "1";
      onceEnter(el, "top 88%", function () {
        g.fromTo(el, { clipPath: "inset(0 0 100% 0)" },
          { clipPath: "inset(0 0 0% 0)", duration: 1.1, ease: "sr", clearProps: "clipPath" });
      });
    });

    $$("[data-reveal-group]").forEach(function (grp) {
      if (grp.dataset.srDone) return; grp.dataset.srDone = "1";
      var items = $$("[data-reveal-item]", grp);
      if (!items.length) items = $$(":scope > *", grp);
      if (!items.length) return;
      onceEnter(grp, "top 86%", function () {
        g.fromTo(items, { y: 38, opacity: 0 },
          { y: 0, opacity: 1, duration: .9, ease: "sr", stagger: stagger(grp, .08),
            clearProps: "opacity,transform" });
      });
    });
  }

  function initScramble() {
    if (!hasGsap || !window.ScrollTrigger || reduce ||
        typeof window.ScrambleTextPlugin === "undefined") return;
    $$("[data-scramble]").forEach(function (el) {
      if (el.dataset.srDone) return; el.dataset.srDone = "1";
      var text = el.innerText;
      if (!text.trim()) return;
      window.ScrollTrigger.create({
        trigger: el, start: "top 92%", once: true,
        onEnter: function () {
          g.to(el, {
            duration: 1.05,
            scrambleText: { text: text, chars: "upperCase", speed: .9 }
          });
        }
      });
    });
  }

  function initParallax() {
    if (!hasGsap || !window.ScrollTrigger || reduce) return;
    $$("[data-parallax]").forEach(function (el) {
      var sp = parseFloat(el.dataset.parallax) || .15;
      g.fromTo(el, { yPercent: -sp * 50 }, {
        yPercent: sp * 50, ease: "none",
        scrollTrigger: {
          trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true
        }
      });
    });
  }

  function initCounters() {
    $$("[data-count]").forEach(function (el) {
      if (el.dataset.srDone) return; el.dataset.srDone = "1";
      var target = parseFloat(el.dataset.count) || 0;
      var dec = parseInt(el.dataset.decimals || "0", 10);
      var pre = el.dataset.prefix || "";
      var suf = el.dataset.suffix || "";
      var plain = el.hasAttribute("data-plain");
      var fmt = function (v) {
        var n = dec ? v.toFixed(dec) : (plain ? String(Math.round(v)) : Math.round(v).toLocaleString("en-US"));
        return pre + n + suf;
      };
      /* Rest state is the final number; the odometer only arms when
         the element scrolls in. */
      el.textContent = fmt(target);
      if (!hasGsap || !window.ScrollTrigger || reduce) return;
      onceEnter(el, "top 90%", function () {
        var obj = { v: 0 };
        el.textContent = fmt(0);
        g.to(obj, {
          v: target, duration: 1.9, ease: "power2.out",
          onUpdate: function () { el.textContent = fmt(obj.v); }
        });
      });
    });
  }

  function initDraw() {
    $$("[data-draw]").forEach(function (svg) {
      if (svg.dataset.srDone) return; svg.dataset.srDone = "1";
      var paths = $$("path, line, circle, rect, polyline, ellipse", svg);
      if (!paths.length) return;
      if (!hasGsap || !window.ScrollTrigger || reduce ||
          typeof window.DrawSVGPlugin === "undefined") return;
      onceEnter(svg, "top 88%", function () {
        g.fromTo(paths, { drawSVG: "0%" },
          { drawSVG: "100%", duration: 1.3, ease: "power2.out", stagger: .08 });
      });
    });
  }

  /* ------------------------------------------------------ marquee */
  function measureMarquee(m) {
    var track = $(".marquee__track", m);
    if (!track) return;
    if (!track.dataset.ready) {
      var html = track.innerHTML;
      track.innerHTML =
        '<span class="marquee__half">' + html + "</span>" +
        '<span class="marquee__half" aria-hidden="true">' + html + "</span>";
      track.dataset.ready = "1";
    }
    var speed = parseFloat(m.dataset.marqueeSpeed || "60");
    var w = track.scrollWidth / 2;
    if (w > 0) m.style.setProperty("--marquee-dur", (w / speed).toFixed(2) + "s");
  }

  function initMarquees() {
    var all = $$("[data-marquee]");
    if (!all.length) return;
    var measureAll = function () { all.forEach(measureMarquee); };
    measureAll();
    if (d.fonts && d.fonts.ready) d.fonts.ready.then(measureAll);
    var rz;
    window.addEventListener("resize", function () {
      clearTimeout(rz); rz = setTimeout(measureAll, 220);
    });
  }
  /* ------------------------------------------------- image blur-up */
  function initBlurup() {
    $$(".ph > img").forEach(function (img) {
      var done = function () {
        img.classList.remove("is-loading");
        img.classList.add("is-loaded");
        var ph = img.closest(".ph");
        if (ph) ph.classList.add("is-done");
      };
      if (img.complete && img.naturalWidth) { done(); return; }
      img.classList.add("is-loading");
      img.addEventListener("load", done, { once: true });
      img.addEventListener("error", done, { once: true });
    });
  }

  /* ------------------------------------------------- canvas mount */
  function mountCanvas(cv, draw, opts) {
    opts = opts || {};
    if (!cv) return null;
    var ctx = cv.getContext("2d");
    if (!ctx) return null;
    var host = opts.host || cv.parentElement || cv;
    var W = 0, H = 0, raf = 0, running = false, t0 = 0, api;

    function size() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = host.clientWidth; H = host.clientHeight;
      if (!W || !H) return;
      cv.width = Math.round(W * dpr);
      cv.height = Math.round(H * dpr);
      cv.style.width = W + "px";
      cv.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (typeof draw.resize === "function") draw.resize(W, H);
    }

    function frame(now) {
      raf = requestAnimationFrame(frame);
      draw(ctx, W, H, now - t0);
    }
    function play() {
      if (running || reduce) return;
      running = true;
      t0 = performance.now() - (opts.staticT || 0);
      raf = requestAnimationFrame(frame);
    }
    function pause() {
      running = false;
      cancelAnimationFrame(raf);
    }

    size();
    var rz;
    window.addEventListener("resize", function () {
      clearTimeout(rz);
      rz = setTimeout(function () {
        size();
        if (reduce) draw(ctx, W, H, opts.staticT || 3200);
      }, 180);
    });

    api = { ctx: ctx, play: play, pause: pause, size: size,
            get w() { return W; }, get h() { return H; } };

    if (reduce) {
      draw(ctx, W, H, opts.staticT || 3200);
      return api;
    }
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { en.isIntersecting ? play() : pause(); });
      }, { threshold: .01 }).observe(host);
    } else {
      play();
    }
    return api;
  }

  /* --------------------------------------------------------- boot */
  function boot() {
    try {
      if (hasGsap) {
        var plugins = [];
        ["ScrollTrigger", "CustomEase", "SplitText", "ScrambleTextPlugin", "DrawSVGPlugin"]
          .forEach(function (p) { if (window[p]) plugins.push(window[p]); });
        if (plugins.length) g.registerPlugin.apply(g, plugins);
        if (window.CustomEase) {
          window.CustomEase.create("sr", "0.22,1,0.36,1");
          window.CustomEase.create("srInOut", "0.65,0.05,0.36,1");
          window.CustomEase.create("srSoft", "0.19,1,0.22,1");
        }
      }

      renderFooter();
      buildMenuOverlay();
      bindData();
      wrapSwaps();
      markActive();
      initBlurup();
      initMenu();
      initLenis();
      buildCurtain();
      initTransitions();
      initNavState();
      initSkip();
      initAnchors();
      initParallax();
      initMarquees();
      /* Reveals, scramble, counters, and draw-ons arm ScrollTrigger
         "once" triggers. If armed at raw boot time, any instance that
         already sits within the first viewport (a hero eyebrow, an
         above-the-fold HUD row, a hero odometer) fires immediately,
         while still hidden behind the loader or arrival curtain, so
         the effect is "spent" before the visitor ever sees it. Gate
         the arming behind SR.ready so it always plays on reveal,
         above the fold or not. Below-the-fold instances are unaffected:
         they only fire once actually scrolled into view regardless of
         when the trigger was created, and scrolling is locked while
         the loader/curtain covers the page. */
      SR.ready(function () {
        initReveals();
        initScramble();
        initCounters();
        initDraw();
      });

      bootQueue.forEach(function (fn) { try { fn(); } catch (e) { console.error(e); } });
      bootQueue = [];

      /* Entry choreography: first visit loader, arrival curtain, or none. */
      var seen = store("srSeen") === "1";
      var arriving = store("srArrive") === "1";
      store("srArrive", null);
      if (!seen) {
        store("srSeen", "1");
        runLoader();
      } else if (arriving) {
        root.classList.remove("sr-cover");
        curtainReveal();
      } else {
        root.classList.remove("sr-cover");
        notifyReady();
      }

      if (hasGsap && window.ScrollTrigger) {
        if (d.fonts && d.fonts.ready) d.fonts.ready.then(function () { window.ScrollTrigger.refresh(); });
        window.addEventListener("load", function () { window.ScrollTrigger.refresh(); });
      }
    } catch (err) {
      /* Fail soft: never leave the page covered or half-hidden. */
      console.error(err);
      root.classList.remove("sr-cover");
      var loader = $(".loader");
      if (loader) loader.remove();
      if (curtain) curtain.style.transform = "translateY(115%)";
      notifyReady();
    }
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
