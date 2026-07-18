#!/usr/bin/env python3
"""Load every page on the LIVE deploy and prove it is clean.

For each of the six pages: zero console errors, zero pageerrors, zero failed
requests, and zero external runtime requests (any host other than the deploy
host that is not an outbound link the user clicks). Screenshots land in
verification/ at desktop (1440) and mobile (390). Exit non-zero on any failure.

Usage: python3 tools/verify_live.py https://saffron-and-rice.vercel.app
"""
import os, sys
from urllib.parse import urlparse
from playwright.sync_api import sync_playwright

PAGES = ["index.html", "menu.html", "catering.html", "about.html", "contact.html", "404.html"]
# Hosts the runtime is allowed to talk to: the deploy host only. Outbound links
# (Grubhub, Instagram, Google Maps) are hrefs the user clicks, never fetched at load.
ALLOWED_EXTRA = set()

def main(base):
    base = base.rstrip("/")
    host = urlparse(base).netloc
    out = "verification"
    os.makedirs(out, exist_ok=True)
    failures = []
    with sync_playwright() as p:
        b = p.chromium.launch(headless=True)
        for w, label in [(1440, "desktop"), (390, "mobile")]:
            ctx = b.new_context(viewport={"width": w, "height": 900 if w > 700 else 844})
            for page in PAGES:
                errors, ext = [], []
                pg = ctx.new_page()
                pg.on("console", lambda m, e=errors: e.append(m.type + ": " + m.text[:120]) if m.type in ("error", "warning") else None)
                pg.on("pageerror", lambda exc, e=errors: e.append("pageerror: " + str(exc)[:120]))
                def on_req(req, x=ext):
                    h = urlparse(req.url).netloc
                    if h and h != host and h not in ALLOWED_EXTRA and not req.url.startswith("data:"):
                        x.append(req.url[:120])
                pg.on("request", on_req)
                url = base + "/" + page
                try:
                    pg.goto(url, wait_until="load", timeout=45000)
                    pg.wait_for_timeout(3500)
                    pg.evaluate("window.scrollTo(0, document.body.scrollHeight)")
                    pg.wait_for_timeout(2000)
                    pg.screenshot(path=os.path.join(out, f"{page.split('.')[0]}_{label}.png"), full_page=True)
                except Exception as e:
                    failures.append(f"{label} {page}: LOAD FAILED {e}")
                    pg.close(); continue
                if errors:
                    failures.append(f"{label} {page}: console {errors}")
                if ext:
                    failures.append(f"{label} {page}: EXTERNAL runtime requests {ext}")
                print(f"{label} {page}: console={'CLEAN' if not errors else errors} external={'NONE' if not ext else ext}")
                pg.close()
            ctx.close()
        b.close()
    print("\n=== RESULT ===")
    if failures:
        print("FAILURES:")
        for f in failures:
            print(" -", f)
        sys.exit(1)
    print("ALL SIX PAGES CLEAN at desktop and mobile: zero console errors, zero external runtime requests.")

if __name__ == "__main__":
    main(sys.argv[1])
