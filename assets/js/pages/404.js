/* =============================================================
   Saffron & Rice, 404 hero module (assets/js/pages/404.js)
   Loads LAST, after app.js. One job: the load-time entrance for
   the hero content below the h1. A ScrollTrigger reveal is wrong
   here because the whole page fits one viewport with content low
   in it, so this fires on load instead, mirroring the app.js
   contracts:
   - hidden states are applied HERE, right before the tween, never
     in CSS, so with JS off (or any vendor missing) the page ships
     complete;
   - under prefers-reduced-motion nothing runs at all;
   - house ease snrReveal (registered by app.js) when available.
   The shamse spin itself is pure CSS (k-spin via .shamse--spin)
   and the sine-floats belong to app.js initFloats(); neither is
   touched here. House rules: no em dashes.
   ============================================================= */
(function () {
  "use strict";
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (typeof window.gsap === "undefined") return;

  var ease = (typeof window.CustomEase !== "undefined") ? "snrReveal" : "power3.out";
  var stage = document.querySelector(".nf__stage");
  var items = Array.prototype.slice.call(
    document.querySelectorAll(".nf__eyebrow, .nf__line, .nf__actions, .nf__trail")
  );

  if (stage) {
    gsap.set(stage, { opacity: 0, scale: 0.94, y: 12 });
    gsap.to(stage, { opacity: 1, scale: 1, y: 0, duration: 0.9, ease: ease, delay: 0.05 });
  }
  if (items.length) {
    gsap.set(items, { opacity: 0, y: 24 });
    gsap.to(items, {
      opacity: 1, y: 0, duration: 0.6, ease: ease, stagger: 0.08, delay: 0.3,
      onComplete: function () { gsap.set(items, { clearProps: "all" }); }
    });
  }
})();
