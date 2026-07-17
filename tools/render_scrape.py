#!/usr/bin/env python3
"""render_scrape.py - load URLs in Chromium via the proxy-routed request API,
dump rendered text, HTML, and a screenshot for each.
Usage: python3 tools/render_scrape.py OUTDIR URL [URL...]
"""
import json, os, sys, time
from playwright.sync_api import sync_playwright

UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36")


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


def slug(u):
    import re
    return re.sub(r'[^a-z0-9]+', '_', u.lower().split('//', 1)[-1])[:80].strip('_')


def main():
    outdir = sys.argv[1]
    urls = sys.argv[2:]
    settle = float(os.environ.get("SETTLE", "6"))
    os.makedirs(outdir, exist_ok=True)
    proxy = os.environ.get("HTTPS_PROXY")
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        req = p.request.new_context(proxy={"server": proxy}, ignore_https_errors=True,
                                    extra_http_headers={"user-agent": UA})
        ctx = browser.new_context(user_agent=UA, service_workers="block",
                                  viewport={"width": 1440, "height": 1000},
                                  device_scale_factor=1)
        ctx.route("**/*", make_router(req))
        for u in urls:
            name = slug(u)
            page = ctx.new_page()
            try:
                page.goto(u, wait_until="load", timeout=90000)
                time.sleep(settle)
                # scroll to trigger lazy loads
                for y in (800, 1800, 3200, 5000, 8000):
                    page.evaluate(f"window.scrollTo(0,{y})")
                    time.sleep(0.6)
                page.evaluate("window.scrollTo(0,0)")
                time.sleep(1)
                open(os.path.join(outdir, name + ".html"), "w").write(page.content())
                txt = page.evaluate("() => document.body.innerText")
                open(os.path.join(outdir, name + ".txt"), "w").write(txt)
                page.screenshot(path=os.path.join(outdir, name + ".png"), timeout=30000)
                print(json.dumps({"url": u, "ok": True, "title": page.title(), "chars": len(txt)}))
            except Exception as e:
                print(json.dumps({"url": u, "ok": False, "err": str(e)[:200]}))
            page.close()
        browser.close()


if __name__ == "__main__":
    main()
