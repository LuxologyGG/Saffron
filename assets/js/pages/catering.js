/* =============================================================
   Saffron & Rice, Catering page module ("The Spread")
   Loads LAST, after app.js. Owns exactly one device: the
   spread-builder hero choreography from the design brief.

   Contract (brief, Catering hero):
   - Pinned 220vh; the three tier panels scale-step 0.9 -> 1.0
     sequentially, each over one third of pin progress, with an
     --e-out catch-up (scrub smoothing + snrOut ease).
   - The counts flip via SplitText y-mask, .6s --e-reveal.
   - Reduced motion / no JS / narrow viewports: no pin, static row
     at final sizes (the page is authored that way; .is-pinned and
     every hidden state are applied HERE only when the scrub runs).
   House rules: no em dashes; relative URLs only.
   ============================================================= */
(function () {
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var motion = !reduce &&
    typeof window.gsap !== "undefined" &&
    typeof window.ScrollTrigger !== "undefined" &&
    typeof window.SplitText !== "undefined";
  if (!motion) return;

  var spread = document.querySelector(".spread");
  if (!spread) return;

  /* app.js (loaded before this file) registers the snrReveal / snrOut
     CustomEase curves; fall back to stock eases if it could not. */
  var easeOut = typeof window.CustomEase !== "undefined" ? "snrOut" : "power2.out";
  var easeReveal = typeof window.CustomEase !== "undefined" ? "snrReveal" : "power3.out";

  var mm = gsap.matchMedia();
  mm.add("(min-width: 900px)", function () {
    spread.classList.add("is-pinned");

    var tiers = gsap.utils.toArray(".spread .tier");
    var splits = [];
    var tl = null;
    var alive = true;

    /* Fonts settle before SplitText slices the counts; the build is
       async, so the cleanup below tears it down manually (async work
       is outside gsap.matchMedia's automatic revert). */
    var flips = [];
    var checkFlips = function (progress) {
      flips.forEach(function (f) {
        if (!f.on && progress >= f.at) {
          /* count flip: SplitText y-mask rise, .6s --e-reveal */
          f.on = true;
          gsap.to(f.chars, { yPercent: 0, duration: 0.6, ease: easeReveal, stagger: 0.05, overwrite: "auto" });
        } else if (f.on && progress < f.at - 0.06) {
          f.on = false;
          gsap.to(f.chars, { yPercent: 112, duration: 0.35, ease: "power2.in", overwrite: "auto" });
        }
      });
    };
    var build = function () {
      if (!alive) return;
      tl = gsap.timeline({
        scrollTrigger: {
          trigger: spread,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.4, /* catch-up smoothing per the --e-out contract */
          onUpdate: function (self) { checkFlips(self.progress); }
        }
      });
      tiers.forEach(function (tier, i) {
        gsap.set(tier, { scale: 0.9, transformOrigin: "50% 100%" });
        /* one third of pin progress per tier: positions 0 / 1 / 2 of 3 */
        tl.to(tier, { scale: 1, duration: 1, ease: easeOut }, i);
        var num = tier.querySelector(".tier__num");
        if (num) {
          var split = new SplitText(num, { type: "chars", mask: "chars" });
          splits.push(split);
          gsap.set(split.chars, { yPercent: 112 }); /* JS-applied hidden state */
          /* flip threshold: the start of this tier's third of the pin
             (tier one flips immediately on landing) */
          flips.push({ chars: split.chars, at: i / 3, on: false });
        }
      });
      ScrollTrigger.refresh();
      checkFlips(tl.scrollTrigger ? tl.scrollTrigger.progress : 0);
    };
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(build);
    else build();

    return function () {
      alive = false;
      if (tl) {
        if (tl.scrollTrigger) tl.scrollTrigger.kill();
        tl.kill();
        tl = null;
      }
      splits.forEach(function (s) { s.revert(); });
      splits = [];
      gsap.set(tiers, { clearProps: "transform" });
      spread.classList.remove("is-pinned");
    };
  });
})();
