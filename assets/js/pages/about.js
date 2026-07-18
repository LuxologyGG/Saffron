/* =============================================================
   Saffron & Rice, About page module (assets/js/pages/about.js)
   "The Story": the light editorial hero's 300vh era scrubber over
   the two VERIFIED milestones (window.SITE.story renders verbatim
   in the markup; app.js hydration keeps it synced). Loads LAST,
   after data.js and app.js (which own hydration, Lenis, and the
   shared motion hooks).

   Enhancement ladder (brief section 2 About + section 4 matrix):
   - No JS: the hero is static stacked era rows; fully readable.
   - JS without motion (prefers-reduced-motion, or vendors absent):
     rows stay stacked with no pin and no scrub; the era stops
     become instant jump buttons that move focus to their row.
   - JS with motion: the hero pins for 300vh (100vh stage + 200vh
     scrub). The era stops become a role="tablist" of role="tab"
     buttons with Left/Right/Up/Down/Home/End arrow support
     (automatic activation); panels crossfade .5s with a
     1.04 -> 1.0 settle on the incoming image; the khatam marker
     slides along the rule scrub-tied (transform only); progress
     snaps to each era stop (.4s ease out). Pointer scrubbing is
     the enhancement; the tablist is the keyboard and AT model.
     ARIA tab semantics are added HERE, only once tab behavior
     exists. Hidden states (panel 2 faded out) are applied HERE
     only, never in a stylesheet.
   House rules: no em dashes anywhere; relative URLs only.
   ============================================================= */
(function () {
  "use strict";

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var motion = !reduce &&
    typeof window.gsap !== "undefined" &&
    typeof window.ScrollTrigger !== "undefined";

  function init() {
    var hero = $(".story-hero");
    if (!hero) return;
    var stops = $$("[data-era-stop]", hero);
    var panels = $$("[data-era-panel]", hero);
    if (stops.length < 2 || stops.length !== panels.length) return;

    /* ---------- Reduced motion / vendor-missing branch ----------
       Matrix: "About era scrubber renders as stacked static rows
       (no pin)". The stops stay plain buttons (no tab semantics)
       and jump instantly to their era row, moving real focus. */
    if (!motion) {
      stops.forEach(function (b, i) {
        b.addEventListener("click", function () {
          var p = panels[i];
          p.setAttribute("tabindex", "-1");
          p.scrollIntoView({ block: "start" });
          p.focus({ preventScroll: true });
        });
      });
      return;
    }

    /* ---------- Scrub enhancement (motion only) ---------- */
    hero.classList.add("is-scrub");
    var rail = $("[data-era-stops]", hero);
    var rule = $(".era__rule", hero);
    var marker = $("[data-era-marker]", hero);
    var imgs = panels.map(function (p) { return $("img", p); });

    /* Tablist semantics appear only now that tab behavior exists */
    rail.setAttribute("role", "tablist");
    rail.setAttribute("aria-label", "Eras of this kitchen");
    stops.forEach(function (b, i) {
      b.setAttribute("role", "tab");
      b.setAttribute("aria-selected", i === 0 ? "true" : "false");
      b.setAttribute("aria-controls", panels[i].id);
      b.setAttribute("tabindex", i === 0 ? "0" : "-1");
      panels[i].setAttribute("role", "tabpanel");
      panels[i].setAttribute("aria-labelledby", b.id);
    });

    var active = 0;
    stops[0].classList.add("is-active");
    /* JS-applied hidden state: every panel after the first starts
       faded out (autoAlpha keeps it out of the AT tree via
       visibility while inactive). Never authored in CSS. */
    panels.forEach(function (p, i) {
      if (i === 0) return;
      gsap.set(p, { autoAlpha: 0 });
      p.setAttribute("aria-hidden", "true");
    });

    function setActive(idx) {
      if (idx === active) return;
      var from = panels[active];
      var to = panels[idx];
      active = idx;
      stops.forEach(function (b, i) {
        b.classList.toggle("is-active", i === idx);
        b.setAttribute("aria-selected", i === idx ? "true" : "false");
        b.setAttribute("tabindex", i === idx ? "0" : "-1");
      });
      from.setAttribute("aria-hidden", "true");
      to.removeAttribute("aria-hidden");
      /* Crossfade .5s (--e-ui family) with the 1.04 -> 1.0 settle */
      gsap.to(from, { autoAlpha: 0, duration: 0.5, ease: "power2.inOut", overwrite: "auto" });
      gsap.to(to, { autoAlpha: 1, duration: 0.5, ease: "power2.inOut", overwrite: "auto" });
      if (imgs[idx]) {
        gsap.fromTo(imgs[idx], { scale: 1.04 }, { scale: 1, duration: 0.5, ease: "power2.out", overwrite: "auto" });
      }
    }

    var setX = gsap.quickSetter(marker, "x", "px");
    function ruleW() { return rule.offsetWidth; }

    var st = ScrollTrigger.create({
      trigger: hero,
      start: "top top",
      end: "+=200%", /* 100vh visible stage + 200vh of scrub = 300vh scrubber */
      pin: true,
      scrub: true,
      snap: { snapTo: [0, 1], duration: 0.4, ease: "power2.out", delay: 0.08 },
      onUpdate: function (self) {
        setX(self.progress * ruleW());
        setActive(self.progress < 0.5 ? 0 : 1);
      },
      onRefresh: function (self) { setX(self.progress * ruleW()); }
    });

    /* Tab activation scrolls the scrubber to that era's snap point.
       st.start / st.end are read at call time so refreshes stay valid. */
    function goTo(idx) {
      var y = idx === 0 ? st.start : st.start + (st.end - st.start);
      if (window.lenisRef) window.lenisRef.scrollTo(y, { duration: 0.9 });
      else window.scrollTo(0, y);
    }
    stops.forEach(function (b, i) {
      b.addEventListener("click", function () { goTo(i); });
      b.addEventListener("keydown", function (e) {
        var n = null;
        if (e.key === "ArrowRight" || e.key === "ArrowDown") n = (i + 1) % stops.length;
        else if (e.key === "ArrowLeft" || e.key === "ArrowUp") n = (i - 1 + stops.length) % stops.length;
        else if (e.key === "Home") n = 0;
        else if (e.key === "End") n = stops.length - 1;
        if (n === null) return;
        e.preventDefault();
        stops[n].focus();
        goTo(n); /* automatic activation: focus moves, era follows */
      });
    });
  }

  /* app.js registered its DOMContentLoaded handler first (script
     order), so by the time this runs, hydration and Lenis exist. */
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
