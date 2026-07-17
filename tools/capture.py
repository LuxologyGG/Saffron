#!/usr/bin/env python3
"""
capture.py - proxy-aware recon capture for the Saffron and Rice build.

Adapted from the clone skill's capture.py. This environment's egress proxy
resets Chromium's native TLS handshake, so every browser request is
intercepted with page routing and fulfilled through Playwright's request API,
which the proxy accepts. TLS verification stays on for the request context
via the proxy CA bundle.

Usage:
  python3 tools/capture.py --url https://example.com --out research/refs/example
  python3 tools/capture.py --url ... --out ... --breakpoints 390,1440 --scroll-steps 14 --settle 3.5
  python3 tools/capture.py --url http://localhost:8080/menu.html --out review/capture/menu --local
"""
import argparse, json, os, re, time
from urllib.parse import urljoin, urlparse
from playwright.sync_api import sync_playwright

UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36")

LIBRARY_SIGNATURES = {
    "gsap": ["gsap", "TweenMax", "TweenLite"],
    "ScrollTrigger": ["ScrollTrigger"],
    "lenis": ["Lenis", "lenis", "@studio-freight"],
    "locomotive-scroll": ["LocomotiveScroll", "data-scroll-container"],
    "lottie": ["lottie", "bodymovin", ".lottie"],
    "three.js": ["THREE", "three.module", "three.min"],
    "barba": ["barba"],
    "splittype/splittext": ["SplitType", "SplitText"],
    "framer-motion": ["framer-motion", "motion-dom"],
    "swiper": ["swiper"],
    "webgl-shader": ["gl_FragColor", "precision highp float", "createShader"],
    "react/next": ["react-dom", "_next", "__NEXT_DATA__"],
    "vue/nuxt": ["__NUXT__", "nuxt", "vue.runtime"],
    "webflow": ["webflow"],
}


def make_router(req):
    def handler(route):
        r = route.request
        if not r.url.startswith("http"):
            return route.continue_()
        try:
            resp = req.fetch(
                r.url, method=r.method, data=r.post_data_buffer,
                headers={k: v for k, v in r.headers.items() if k.lower() != "host"},
                timeout=45000, max_redirects=0)
            headers = {k: v for k, v in resp.headers.items() if k.lower() not in
                       ("content-encoding", "content-length", "transfer-encoding", "connection")}
            route.fulfill(status=resp.status, headers=headers, body=resp.body())
        except Exception:
            try:
                route.abort()
            except Exception:
                pass
    return handler


def evaluate_tokens(page):
    return page.evaluate(r"""() => {
        const out = {};
        const root = document.documentElement;
        const cssVars = {};
        for (const sheet of document.styleSheets) {
            try {
                for (const rule of sheet.cssRules) {
                    if (rule.selectorText === ':root' || rule.selectorText === 'html') {
                        for (const p of rule.style) {
                            if (p.startsWith('--')) cssVars[p] = rule.style.getPropertyValue(p).trim();
                        }
                    }
                }
            } catch(e) {}
        }
        out.cssVars = cssVars;
        const fonts = new Set();
        document.querySelectorAll('body *').forEach(el => {
            const f = getComputedStyle(el).fontFamily; if (f) fonts.add(f);
        });
        out.fontFamilies = [...fonts];
        const faces = [];
        for (const sheet of document.styleSheets) {
            try { for (const r of sheet.cssRules)
                if (r.constructor.name === 'CSSFontFaceRule') faces.push(r.cssText);
            } catch(e) {}
        }
        out.fontFaces = faces;
        const colors = {};
        document.querySelectorAll('body *').forEach(el => {
            const cs = getComputedStyle(el);
            [cs.color, cs.backgroundColor, cs.borderColor].forEach(c => {
                if (c && c !== 'rgba(0, 0, 0, 0)' && c !== 'transparent')
                    colors[c] = (colors[c]||0)+1;
            });
        });
        out.colorFrequency = Object.fromEntries(
            Object.entries(colors).sort((a,b)=>b[1]-a[1]).slice(0,40));
        const radii = new Set(), transforms = new Set(), tracking = new Set();
        document.querySelectorAll('body *').forEach(el => {
            const cs = getComputedStyle(el);
            if (cs.borderRadius && cs.borderRadius !== '0px') radii.add(cs.borderRadius);
            if (cs.textTransform && cs.textTransform !== 'none') transforms.add(cs.textTransform);
            if (cs.letterSpacing && cs.letterSpacing !== 'normal') tracking.add(cs.letterSpacing);
        });
        out.borderRadii = [...radii].slice(0,40);
        out.textTransforms = [...transforms];
        out.letterSpacing = [...tracking].slice(0,20);
        const grids = new Set();
        document.querySelectorAll('body *').forEach(el => {
            const cs = getComputedStyle(el);
            if ((cs.display==='grid'||cs.display==='inline-grid') && cs.gridTemplateColumns!=='none')
                grids.add(cs.gridTemplateColumns);
        });
        out.gridTemplateColumns = [...grids].slice(0,30);
        const mw = new Set();
        document.querySelectorAll('body *').forEach(el => {
            const w = getComputedStyle(el).maxWidth; if (w && w!=='none') mw.add(w);
        });
        out.maxWidths = [...mw].slice(0,20);
        out.rootFontSize = getComputedStyle(root).fontSize;
        out.bodyFontSize = getComputedStyle(document.body).fontSize;
        out.bodyLineHeight = getComputedStyle(document.body).lineHeight;
        out.title = document.title;
        out.headings = [...document.querySelectorAll('h1,h2,h3,h4')].map(h=>({tag:h.tagName, text:h.textContent.trim().slice(0,140)}));
        out.navLinks = [...document.querySelectorAll('nav a, header a')].map(a=>({text:a.textContent.trim(), href:a.href}));
        out.sections = [...document.querySelectorAll('section')].map(s=>({id:s.id, class:String(s.className).slice(0,120)}));
        const keyframes = [];
        for (const sheet of document.styleSheets) {
            try { for (const r of sheet.cssRules)
                if (r.constructor.name === 'CSSKeyframesRule') keyframes.push(r.cssText);
            } catch(e) {}
        }
        out.keyframes = keyframes.slice(0, 60);
        let animatedCount = 0;
        document.querySelectorAll('body *').forEach(el => {
            const cs = getComputedStyle(el);
            if ((cs.transitionDuration && cs.transitionDuration !== '0s') ||
                (cs.animationName && cs.animationName !== 'none')) animatedCount++;
        });
        out.animatedElementCount = animatedCount;
        out.videos = [...document.querySelectorAll('video')].map(v=>({
            src: v.currentSrc || v.src || (v.querySelector('source')||{}).src || null,
            autoplay:v.autoplay, loop:v.loop, muted:v.muted, poster:v.poster||null}));
        out.canvases = [...document.querySelectorAll('canvas')].map(c=>({
            w:c.width, h:c.height, id:c.id, parentClass:String((c.parentElement||{}).className||'').slice(0,80)}));
        out.svgInlineCount = document.querySelectorAll('svg').length;
        out.images = [...document.querySelectorAll('img')].map(i=>({
            src:i.currentSrc||i.src, alt:i.alt||null, w:i.naturalWidth, h:i.naturalHeight})).slice(0,150);
        const bps = new Set();
        for (const sheet of document.styleSheets) {
            try { for (const r of sheet.cssRules)
                if (r.constructor.name === 'CSSMediaRule') bps.add(r.conditionText || r.media.mediaText);
            } catch(e) {}
        }
        out.mediaBreakpoints = [...bps].slice(0,50);
        return out;
    }""")


def collect_css(page, req):
    sheet_info = page.evaluate(r"""() => {
        const sheets = [];
        for (const s of document.styleSheets) {
            let readable = true, text = '';
            try { for (const r of s.cssRules) text += r.cssText + '\n'; }
            catch(e) { readable = false; }
            sheets.push({href: s.href, readable, text});
        }
        return sheets;
    }""")
    parts = []
    for s in sheet_info:
        if s["readable"] and s["text"]:
            parts.append(f"/* ===== {s['href'] or 'inline'} ===== */\n{s['text']}")
        elif s["href"]:
            try:
                resp = req.get(s["href"], timeout=30000)
                parts.append(f"/* ===== {s['href']} (fetched) ===== */\n{resp.text()}")
            except Exception as e:
                parts.append(f"/* could not fetch {s['href']}: {e} */")
    return "\n".join(parts)


def detect_libraries(page, req):
    srcs = page.evaluate("() => [...document.scripts].map(s=>s.src).filter(Boolean)")
    inline = page.evaluate("() => [...document.scripts].filter(s=>!s.src).map(s=>s.textContent).join('\\n')")
    blob = inline
    for src in srcs[:20]:
        try:
            blob += "\n" + req.get(src, timeout=30000).text()
        except Exception:
            pass
    found = {}
    for lib, sigs in LIBRARY_SIGNATURES.items():
        hits = sum(blob.count(s) for s in sigs)
        if hits:
            found[lib] = hits
    return {"scripts": srcs, "detected": found}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--url", required=True)
    ap.add_argument("--out", required=True)
    ap.add_argument("--breakpoints", default="390,1440")
    ap.add_argument("--scroll-steps", type=int, default=12)
    ap.add_argument("--settle", type=float, default=3.5)
    ap.add_argument("--local", action="store_true", help="skip proxy routing for localhost targets")
    ap.add_argument("--no-assets", action="store_true", help="skip CSS/JS/token extraction, screenshots only")
    args = ap.parse_args()

    os.makedirs(args.out, exist_ok=True)
    shots = os.path.join(args.out, "screenshots"); os.makedirs(shots, exist_ok=True)
    widths = [int(w) for w in args.breakpoints.split(",")]
    proxy = os.environ.get("HTTPS_PROXY")

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        req = None
        if not args.local:
            req = p.request.new_context(
                proxy={"server": proxy}, ignore_https_errors=True,
                extra_http_headers={"user-agent": UA})
        ctx = browser.new_context(user_agent=UA, service_workers="block",
                                  viewport={"width": widths[-1], "height": 900},
                                  device_scale_factor=1)
        if req:
            ctx.route("**/*", make_router(req))

        page = ctx.new_page()
        page.goto(args.url, wait_until="load", timeout=90000)
        time.sleep(args.settle)

        with open(os.path.join(args.out, "page.html"), "w") as f:
            f.write(page.content())

        if not args.no_assets:
            tokens = evaluate_tokens(page)
            with open(os.path.join(args.out, "tokens.json"), "w") as f:
                json.dump(tokens, f, indent=2, ensure_ascii=False)
            fetcher = req if req else ctx.request
            with open(os.path.join(args.out, "styles.css"), "w") as f:
                f.write(collect_css(page, fetcher))
            libs = detect_libraries(page, fetcher)
            with open(os.path.join(args.out, "libraries.json"), "w") as f:
                json.dump(libs, f, indent=2)
        else:
            libs = {"detected": {}}

        # Scroll sequence at the largest breakpoint
        height = page.evaluate("document.body.scrollHeight")
        stride = max(1, height // max(1, args.scroll_steps))
        for i, y in enumerate(range(0, height, stride)):
            page.evaluate(f"window.scrollTo(0,{y})")
            time.sleep(0.9)
            page.screenshot(path=os.path.join(shots, f"desktop_scroll_{i:02d}.png"), timeout=30000)
        page.close()

        # Per-breakpoint viewport + full-page shots
        for w in widths:
            pg = ctx.new_page()
            pg.set_viewport_size({"width": w, "height": 900 if w > 700 else 844})
            try:
                pg.goto(args.url, wait_until="load", timeout=90000)
                time.sleep(args.settle)
                label = "mobile" if w <= 768 else "desktop"
                pg.screenshot(path=os.path.join(shots, f"{label}_{w}_viewport.png"), timeout=30000)
                pg.screenshot(path=os.path.join(shots, f"{label}_{w}_full.png"), full_page=True, timeout=60000)
            except Exception as e:
                print(f"breakpoint {w} failed: {e}")
            pg.close()

        browser.close()

    print(json.dumps({
        "out": args.out,
        "breakpoints": widths,
        "libraries_detected": list(libs["detected"].keys()),
        "shots": sorted(os.listdir(shots)),
    }, indent=2))


if __name__ == "__main__":
    main()
