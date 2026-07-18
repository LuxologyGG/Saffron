/* =============================================================
   Saffron & Rice, Home hero module (home.js)
   Loads LAST (after data.js and app.js). Owns the Home-only
   choreography the shared engine does not cover:

   1. Arch-framed dolly zoom: the hero photo scales 1.05 -> 1.32
      scrub-tied across the 160vh runway (CSS-sticky stage).
      will-change: transform is added/removed around the effect
      per the perf contract (hero dolly image only).
   2. Ghost outline "SAFFRON": opacity 0 -> .44 -> 0 across the
      pin (Laguna text-stroke curve).
   3. Day-to-night handoff: flags [data-daynight] with .is-lerping
      so the two static bands go transparent and the app.js ground
      lerp shows through. Without this flag (no JS, reduced motion,
      missing vendor) the bands render as authored: two static
      stacked bands, per the brief matrix.

   HIDDEN-STATE CONTRACT: every initial state here is JS-applied
   and only when motion actually runs. Under reduced motion this
   module does nothing at all.
   House rules: no em dashes; relative URLs only.
   ============================================================= */
(function () {
  "use strict";

  function ready(fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }

  ready(function () {
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var motion = !reduce &&
      typeof window.gsap !== "undefined" &&
      typeof window.ScrollTrigger !== "undefined";
    if (!motion) return;

    var hero = document.querySelector(".home-hero");

    /* ---- 1. Dolly zoom (scale 1.05 -> 1.32, scrub: true) ---- */
    var img = hero ? hero.querySelector(".home-hero__arch img") : null;
    if (hero && img) {
      gsap.set(img, { scale: 1.05, transformOrigin: "50% 62%" });
      gsap.to(img, {
        scale: 1.32,
        ease: "none",
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          onToggle: function (self) {
            /* perf contract: will-change only while the effect is live */
            img.style.willChange = self.isActive ? "transform" : "auto";
          }
        }
      });
    }

    /* ---- 2. Ghost outline crossfade (0 -> .44 -> 0) ---- */
    var ghost = hero ? hero.querySelector(".home-hero__ghost") : null;
    if (hero && ghost) {
      gsap.set(ghost, { opacity: 0 });
      gsap.timeline({
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom bottom",
          scrub: true
        }
      })
        .to(ghost, { opacity: 0.44, ease: "none", duration: 1 })
        .to(ghost, { opacity: 0, ease: "none", duration: 1 });
    }

    /* ---- 3. Day-to-night: hand the bands to the app.js lerp ---- */
    document.querySelectorAll("[data-daynight]").forEach(function (sec) {
      sec.classList.add("is-lerping");
    });
  });
})();
