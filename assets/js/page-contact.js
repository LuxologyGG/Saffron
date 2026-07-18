/* =============================================================
   Saffron and Rice, contact page module.
   Loads LAST: vendor -> data.js -> app.js -> page-contact.js.
   Eval-time: fills the HUD coordinate/hours readout, the services
   and order/follow chips, and wires the map toggle, all from
   window.SITE, so the shared reveal/scramble/draw systems in app.js
   can hook the injected nodes at boot.
   SR.ready: hero intro (title rise, script line, arch photo clip).
   The compass draw-on, HUD row stagger, and scramble-in all run
   through app.js's generic data-draw / data-reveal-group /
   data-scramble systems, no bespoke code needed for those.
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

  /* Oxford-style list join: a, b, and c. */
  function joinList(arr) {
    if (!arr || !arr.length) return "";
    if (arr.length === 1) return arr[0];
    if (arr.length === 2) return arr[0] + " and " + arr[1];
    return arr.slice(0, -1).join(", ") + ", and " + arr[arr.length - 1];
  }

  /* Decimal degrees -> "33.8107 N" style HUD readout, no invented
     precision beyond what data.js carries. */
  function fmtCoords(lat, lng) {
    if (typeof lat !== "number" || typeof lng !== "number") return "";
    var latDir = lat >= 0 ? "N" : "S";
    var lngDir = lng >= 0 ? "E" : "W";
    return Math.abs(lat).toFixed(4) + "° " + latDir + ", " +
      Math.abs(lng).toFixed(4) + "° " + lngDir;
  }

  var company = SITE.company || {};
  var addr = company.address || {};

  /* ------------------------------------------------- hero HUD dl */
  function fillHud() {
    var mount = $("[data-hud-rows]");
    if (!mount) return;
    var rows = [];
    /* BM-R3-2: factual values (coordinates, address, phone) must never
       render garbled, so they fade; only labels-adjacent Hours and
       Services keep the scramble treatment. */
    if (typeof addr.lat === "number" && typeof addr.lng === "number") {
      rows.push({ k: "Coordinates", v: fmtCoords(addr.lat, addr.lng), fade: true });
    }
    if (addr.full) rows.push({ k: "Address", v: addr.full, fade: true });
    if (company.hours && company.hours.short) rows.push({ k: "Hours", v: company.hours.short });
    if (company.phone) rows.push({ k: "Phone", v: company.phone, fade: true });
    if (company.services && company.services.length) {
      rows.push({ k: "Services", v: joinList(company.services) });
    }
    mount.innerHTML = rows.map(function (r) {
      var attr = r.fade ? 'data-reveal="fade"' : "data-scramble";
      return '<div class="hud-row" data-reveal-item>' +
        '<dt class="hud-row__k">' + esc(r.k) + "</dt>" +
        '<dd class="hud-row__v" ' + attr + '>' + esc(r.v) + "</dd>" +
      "</div>";
    }).join("");
  }

  /* ------------------------------------------- 01 services chips */
  function fillServices() {
    var mount = $("[data-c-services]");
    if (!mount || !company.services) return;
    mount.innerHTML = company.services.map(function (s) {
      return "<li>" + esc(s) + "</li>";
    }).join("");
  }

  /* --------------------------------------- 01 order and follow */
  function fillActions() {
    var mount = $("[data-c-actions]");
    if (!mount) return;
    var order = (SITE.orderLinks && SITE.orderLinks[0]) || null;
    var insta = (SITE.social && SITE.social[0]) || null;
    var html = "";
    if (order) {
      html += SR && SR.button070 ? SR.button070({ href: order.href, blank: true, label: order.label }) :
        '<a class="btn" href="' + esc(order.href) + '" target="_blank" rel="noopener">' +
        '<span class="btn__text">' + esc(order.label) + "</span></a>";
    }
    if (insta) {
      html += '<a class="btn" href="' + esc(insta.href) + '" target="_blank" rel="noopener">' +
        '<span class="btn__text">' + esc(insta.label) + "</span></a>";
    }
    mount.innerHTML = html;
  }

  /* --------------------------------------------------- 02 the map */
  /* Two self-hosted static PNGs (close + area), each with a saffron
     marker positioned by percentage. A button toggles which layer is
     visible; no iframe, no live tiles, ever. */
  function initMapToggle() {
    var panel = $("[data-mappanel]");
    var toggle = panel && $("[data-map-toggle]", panel);
    var label = panel && $("[data-map-toggle-label]", panel);
    var layers = panel ? $$("[data-map-layer]", panel) : [];
    if (!panel || !toggle || !layers.length) return;
    var isArea = false;

    function render() {
      layers.forEach(function (layer) {
        var wants = isArea ? "area" : "local";
        layer.classList.toggle("is-active", layer.getAttribute("data-map-layer") === wants);
      });
      toggle.setAttribute("aria-pressed", String(isArea));
      if (label) label.textContent = isArea ? "Show the close up map" : "Show the area map";
    }

    toggle.addEventListener("click", function () {
      isArea = !isArea;
      render();
    });
    render();
  }

  fillHud();
  fillServices();
  fillActions();
  initMapToggle();

  if (!SR) return;

  /* ------------------------------------------------ hero intro */
  /* Title lines rise and blur-clear, the script line settles, then
     the arch photo clip-wipes open. The HUD dl, the eyebrow scramble,
     and the compass draw-on all run on app.js's generic systems
     (data-reveal-group / data-scramble / data-draw), so they are not
     duplicated here. Reduced motion or a missing vendor: the markup
     already rests in its final, complete state. */
  SR.onBoot(function () {
    if (SR.reduce || typeof window.gsap === "undefined") return;
    var g = window.gsap;
    var hero = $(".c-hero");
    if (!hero) return;

    SR.ready(function () {
      var run = function () {
        var tl = g.timeline({ defaults: { ease: "sr" } });
        var title = $("[data-c-title]");
        if (title && window.SplitText) {
          var split = new window.SplitText(title, { type: "lines", mask: "lines", linesClass: "sl" });
          tl.from(split.lines, { yPercent: 118, filter: "blur(7px)", duration: 1.1, stagger: .12 }, .05);
        } else if (title) {
          tl.from(title, { y: 36, opacity: 0, duration: 1 }, .05);
        }
        tl.from(".c-hero__script", { y: 14, opacity: 0, duration: .7 }, .45);

        var media = $(".c-hero__ph", hero);
        if (media) {
          tl.fromTo(media, { clipPath: "inset(0 0 100% 0)" },
            { clipPath: "inset(0% 0 0 0)", duration: 1.2, ease: "srInOut", clearProps: "clipPath" }, .2);
          var img = $("img", media);
          if (img) tl.from(img, { scale: 1.16, duration: 1.7 }, .2);
        }
      };
      if (d.fonts && d.fonts.ready) d.fonts.ready.then(run); else run();
    });
  });
})();
