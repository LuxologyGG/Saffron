#!/usr/bin/env python3
"""Live verification that routes browser requests through the proxy path.
Same technique as tools/capture.py (Chromium's native stack is reset by the
egress proxy; the Playwright request API over HTTPS_PROXY works). For each
page: zero console errors, zero pageerrors, zero external runtime requests
(any host other than the deploy host), full-page screenshots into verification/.
"""
import os, sys
from urllib.parse import urlparse
from playwright.sync_api import sync_playwright

UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36")
PAGES = ["index.html","menu.html","catering.html","about.html","contact.html","404.html"]

def main(base):
    base = base.rstrip("/"); host = urlparse(base).netloc
    proxy = os.environ.get("HTTPS_PROXY")
    os.makedirs("verification", exist_ok=True)
    failures = []
    with sync_playwright() as p:
        b = p.chromium.launch(headless=True)
        req = p.request.new_context(proxy={"server": proxy}, ignore_https_errors=True,
                                    extra_http_headers={"user-agent": UA})
        for w, label in [(1440,"desktop"),(390,"mobile")]:
            ctx = b.new_context(viewport={"width":w,"height":900 if w>700 else 844},
                                user_agent=UA, service_workers="block")
            for page in PAGES:
                errors, ext = [], []
                pg = ctx.new_page()
                pg.on("console", lambda m,e=errors: e.append(m.type+": "+m.text[:120]) if m.type in ("error","warning") else None)
                pg.on("pageerror", lambda exc,e=errors: e.append("pageerror: "+str(exc)[:120]))
                def route(r, x=ext):
                    u = r.request.url
                    if u.startswith("http"):
                        h = urlparse(u).netloc
                        if h and h != host:
                            x.append(u[:110])
                        try:
                            resp = req.fetch(u, method=r.request.method,
                                             headers={k:v for k,v in r.request.headers.items() if k.lower()!="host"},
                                             timeout=45000, max_redirects=3)
                            hdr = {k:v for k,v in resp.headers.items() if k.lower() not in
                                   ("content-encoding","content-length","transfer-encoding","connection")}
                            return r.fulfill(status=resp.status, headers=hdr, body=resp.body())
                        except Exception:
                            return r.abort()
                    return r.continue_()
                ctx_page_route = pg.route("**/*", route)
                url = base + "/" + page
                try:
                    pg.goto(url, wait_until="load", timeout=60000)
                    pg.wait_for_timeout(3500)
                    pg.evaluate("window.scrollTo(0, document.body.scrollHeight)")
                    pg.wait_for_timeout(2000)
                    pg.screenshot(path=os.path.join("verification", f"{page.split('.')[0]}_{label}.png"), full_page=True)
                except Exception as e:
                    failures.append(f"{label} {page}: LOAD FAILED {str(e)[:80]}"); pg.close(); continue
                if errors: failures.append(f"{label} {page}: console {errors}")
                if ext: failures.append(f"{label} {page}: EXTERNAL {ext}")
                print(f"{label} {page}: console={'CLEAN' if not errors else errors} external={'NONE' if not ext else ext}")
                pg.close()
            ctx.close()
        b.close()
    print("\n=== RESULT ===")
    if failures:
        for f in failures: print(" -", f)
        sys.exit(1)
    print("ALL SIX PAGES CLEAN on the LIVE URL at desktop and mobile: zero console errors, zero external runtime requests.")

if __name__ == "__main__":
    main(sys.argv[1])
