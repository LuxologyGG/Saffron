/* =============================================================
   Saffron and Rice, 404 page module.
   Loads LAST: vendor -> data.js -> app.js -> page-404.js.
   SR.onBoot: mounts the spilled-saffron hero canvas (a tipped bowl
   silhouette that spills threads, scattering and settling on a
   loop, purely a function of elapsed time so a single reduced-motion
   frame reads correctly).
   SR.ready: plays the hero intro once the loader or arrival curtain
   has cleared. Reduced motion: everything lands in its final state,
   no tweens are ever created.
   House rule: no em dashes anywhere, in copy or comments.
   ============================================================= */
(function () {
  "use strict";

  var SR = window.SR;
  var d = document;
  var $ = function (s, c) { return (c || d).querySelector(s); };

  if (!SR) return;

  /* ------------------------------ hero canvas: spilled saffron */
  /* A tipped bowl silhouette sits low left; threads spawn at its
     rim and travel outward on a per-thread parametric arc (angle,
     speed, gravity, wobble), each looping on its own lifetime. Every
     position is a pure function of elapsed time t, so the reduced
     motion path (a single draw call at a fixed t) paints a valid,
     already scattered still frame with no incremental state needed. */
  SR.onBoot(function () {
    var cv = $("[data-nf-canvas]");
    if (!cv) return;
    var host = cv.closest(".nf-hero") || cv.parentElement;

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
    var RIM = tokenRgb("--accent-lite", [224, 176, 84]);
    var BOWL = tokenRgb("--ink-3", [42, 36, 31]);

    var threads = [], bowl = null, mouth = null, spillAngle = 0;
    var W = 0, H = 0;

    function rnd(a, b) { return a + Math.random() * (b - a); }
    function rot(x, y, ang) {
      var c = Math.cos(ang), s = Math.sin(ang);
      return { x: x * c - y * s, y: x * s + y * c };
    }

    function build(w, h) {
      W = w; H = h;
      var scale = Math.min(w, h);
      bowl = {
        x: w * 0.16,
        y: h * 0.72,
        rx: Math.max(46, Math.min(128, scale * 0.13)),
        ry: 0,
        tilt: -0.5
      };
      bowl.ry = bowl.rx * 0.44;

      var mOff = rot(bowl.rx * 0.82, -bowl.ry * 0.1, bowl.tilt);
      mouth = { x: bowl.x + mOff.x, y: bowl.y + mOff.y };
      var sOff = rot(1, -0.1, bowl.tilt);
      spillAngle = Math.atan2(sOff.y, sOff.x);

      var n = Math.round(Math.min(46, Math.max(20, w / 38)));
      threads = [];
      for (var i = 0; i < n; i++) {
        var pome = Math.random() < 0.16;
        var life = rnd(4400, 9200);
        var ang = spillAngle + rnd(-0.85, 0.55);
        threads.push({
          phase: Math.random() * life,
          life: life,
          vx: Math.cos(ang) * rnd(0.02, 0.062),
          vy0: Math.sin(ang) * rnd(0.02, 0.062) - rnd(0, 0.018),
          gravity: rnd(0.00016, 0.00034),
          floor: bowl.y + rnd(4, 48),
          wobbleAmp: rnd(3, 14),
          wobbleFreq: rnd(0.0014, 0.0032),
          wobblePhase: rnd(0, Math.PI * 2),
          len: rnd(22, 58) * (w > 700 ? 1 : 0.72),
          curl: rnd(0.5, 1.4),
          rot0: rnd(0, Math.PI * 2),
          rotV: rnd(-1, 1) * 0.0007,
          lw: rnd(0.8, 1.7),
          col: pome ? POME : (Math.random() < 0.5 ? GOLD_LITE : GOLD_BASE),
          baseAlpha: pome ? rnd(0.2, 0.36) : rnd(0.3, 0.6)
        });
      }
    }

    function drawBowl(ctx) {
      ctx.save();
      ctx.translate(bowl.x, bowl.y);
      ctx.rotate(bowl.tilt);
      ctx.beginPath();
      ctx.moveTo(-bowl.rx, -bowl.ry * 0.15);
      ctx.bezierCurveTo(-bowl.rx, bowl.ry * 1.7, bowl.rx, bowl.ry * 1.7, bowl.rx, -bowl.ry * 0.15);
      ctx.bezierCurveTo(bowl.rx * 0.65, bowl.ry * 0.4, -bowl.rx * 0.65, bowl.ry * 0.4, -bowl.rx, -bowl.ry * 0.15);
      ctx.closePath();
      ctx.fillStyle = "rgb(" + BOWL[0] + "," + BOWL[1] + "," + BOWL[2] + ")";
      ctx.fill();
      ctx.strokeStyle = "rgba(" + RIM[0] + "," + RIM[1] + "," + RIM[2] + ",.5)";
      ctx.lineWidth = 1.3;
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(0, -bowl.ry * 0.15, bowl.rx * 0.74, bowl.ry * 0.56, 0, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(" + RIM[0] + "," + RIM[1] + "," + RIM[2] + ",.36)";
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();
    }

    function drawThread(ctx, x, y, rot0, L, c, col, alpha, lw) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot0);
      ctx.strokeStyle = "rgba(" + col[0] + "," + col[1] + "," + col[2] + "," + alpha + ")";
      ctx.lineWidth = lw;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(-L / 2, 0);
      ctx.bezierCurveTo(-L * 0.18, -L * 0.2 * c, L * 0.16, L * 0.18 * c, L / 2, -L * 0.1 * c);
      ctx.stroke();
      ctx.lineWidth = lw * 2.1;
      ctx.beginPath();
      ctx.moveTo(L / 2 - Math.max(3, L * 0.07), -L * 0.085 * c);
      ctx.lineTo(L / 2, -L * 0.1 * c);
      ctx.stroke();
      ctx.restore();
    }

    function draw(ctx, w, h, t) {
      if (!threads.length || W !== w || H !== h) build(w, h);
      ctx.clearRect(0, 0, w, h);
      drawBowl(ctx);
      for (var i = 0; i < threads.length; i++) {
        var th = threads[i];
        var lt = (t + th.phase) % th.life;
        var p = lt / th.life;
        var x = mouth.x + th.vx * lt + Math.sin(lt * th.wobbleFreq + th.wobblePhase) * th.wobbleAmp;
        var yRaw = mouth.y + th.vy0 * lt + th.gravity * lt * lt * 0.5;
        var y = Math.min(yRaw, th.floor);
        var fadeIn = Math.min(1, p / 0.07);
        var fadeOut = 1 - Math.max(0, (p - 0.8) / 0.2);
        var alpha = th.baseAlpha * Math.max(0, Math.min(fadeIn, fadeOut));
        if (alpha <= 0.004) continue;
        var rotv = th.rot0 + th.rotV * lt;
        drawThread(ctx, x, y, rotv, th.len, th.curl, th.col, alpha, th.lw);
      }
    }
    draw.resize = build;

    SR.mountCanvas(cv, draw, { host: host, staticT: 5200 });
  });

  /* ------------------------------------- core message: fast reveal */
  /* The "404" numeral and "Page not found" kicker are the message a
     lost visitor actually needs. They run on their own short timeline
     started at boot, decoupled from the shared loader/curtain chain
     and from the slower staged hero-intro below, so they resolve in
     well under 1.5s regardless of how long the ambient scatter-canvas
     or the rest of the entrance choreography takes. Reduced motion:
     no tween runs, so the CSS default (visible) already reads as the
     finished state. */
  SR.onBoot(function () {
    if (SR.reduce || typeof window.gsap === "undefined") return;
    var g = window.gsap;
    var num = $(".nf-hero__num");
    var kicker = $(".nf-hero__kicker");
    if (!num && !kicker) return;
    var tl = g.timeline({ defaults: { ease: "sr" } });
    if (num) tl.from(num, { opacity: 0, y: 22, duration: .5 }, 0);
    if (kicker) tl.from(kicker, { y: 14, opacity: 0, duration: .45 }, .12);
  });

  /* --------------------------------------------- hero intro */
  SR.onBoot(function () {
    if (SR.reduce || typeof window.gsap === "undefined") return;
    var g = window.gsap;
    var title = $("[data-nf-title]");
    if (!title) return;

    SR.ready(function () {
      var run = function () {
        var tl = g.timeline({ defaults: { ease: "sr" } });
        if (window.SplitText) {
          var split = new window.SplitText(title, { type: "lines", mask: "lines", linesClass: "sl" });
          tl.from(split.lines, { yPercent: 118, filter: "blur(7px)", duration: 1.1, stagger: .12 }, 0);
        } else {
          tl.from(title, { y: 40, opacity: 0, duration: 1.1 }, 0);
        }
        tl.from(".nf-hero__script", { y: 14, opacity: 0, duration: .7 }, .3)
          .from(".nf-hero__lead", { y: 16, opacity: 0, duration: .7 }, .45)
          .from(".nf-door", { y: 20, opacity: 0, duration: .8 }, .6)
          .from(".nf-hero__quick", { y: 12, opacity: 0, duration: .6 }, .75);
      };
      if (d.fonts && d.fonts.ready) d.fonts.ready.then(run); else run();
    });
  });
})();
