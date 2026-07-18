#!/usr/bin/env python3
"""Council round-1 fresh screenshot capture for Saffron & Rice."""
import os, sys, time
from playwright.sync_api import sync_playwright

BASE = "http://127.0.0.1:8899"
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "shots")
os.makedirs(OUT, exist_ok=True)

PAGES = [
    ("home", "/index.html"),
    ("menu", "/menu.html"),
    ("catering", "/catering.html"),
    ("about", "/about.html"),
    ("contact", "/contact.html"),
    ("404", "/404.html"),
]

os.environ["PLAYWRIGHT_BROWSERS_PATH"] = "/opt/pw-browsers"

def settle(page, ms=800):
    page.wait_for_timeout(ms)

def capture(pw, name, path):
    console_errors = []
    ext_requests = []
    browser = pw.chromium.launch(headless=True)
    # ---------- desktop ----------
    ctx = browser.new_context(viewport={"width": 1440, "height": 900}, device_scale_factor=1)
    page = ctx.new_page()
    page.on("console", lambda m: console_errors.append(m.text) if m.type == "error" else None)
    page.on("request", lambda r: ext_requests.append(r.url) if not r.url.startswith(BASE) and not r.url.startswith("data:") else None)
    page.goto(BASE + path, wait_until="networkidle")
    settle(page, 3200)  # allow preloader / entrance animations
    page.screenshot(path=f"{OUT}/{name}_d1440_viewport.png")
    # scroll states
    total = page.evaluate("document.documentElement.scrollHeight")
    step = 900
    positions = list(range(step, max(total - 900, step) + 1, step))
    # cap number of shots for very long pages: keep at most 14 evenly
    if len(positions) > 14:
        idxs = [round(i * (len(positions) - 1) / 13) for i in range(14)]
        positions = [positions[i] for i in sorted(set(idxs))]
    for i, y in enumerate(positions, 1):
        page.evaluate(f"window.scrollTo(0, {y})")
        settle(page, 1100)
        page.screenshot(path=f"{OUT}/{name}_d1440_scroll_{i:02d}_{y}.png")
    # bottom / footer
    page.evaluate("window.scrollTo(0, document.documentElement.scrollHeight)")
    settle(page, 1400)
    page.screenshot(path=f"{OUT}/{name}_d1440_bottom.png")
    page.evaluate("window.scrollTo(0, 0)")
    settle(page, 900)
    try:
        page.screenshot(path=f"{OUT}/{name}_d1440_full.png", full_page=True)
    except Exception as e:
        print(f"  full-page failed for {name}: {e}")
    ctx.close()
    # ---------- mobile ----------
    ctx = browser.new_context(viewport={"width": 390, "height": 844}, device_scale_factor=2,
                              is_mobile=True, has_touch=True,
                              user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1")
    page = ctx.new_page()
    page.on("console", lambda m: console_errors.append("[m] " + m.text) if m.type == "error" else None)
    page.goto(BASE + path, wait_until="networkidle")
    settle(page, 3200)
    page.screenshot(path=f"{OUT}/{name}_m390_viewport.png")
    total = page.evaluate("document.documentElement.scrollHeight")
    # three mid states
    for i, frac in enumerate([0.25, 0.5, 0.75], 1):
        page.evaluate(f"window.scrollTo(0, {int(total * frac)})")
        settle(page, 1000)
        page.screenshot(path=f"{OUT}/{name}_m390_scroll_{i}.png")
    page.evaluate("window.scrollTo(0, document.documentElement.scrollHeight)")
    settle(page, 1200)
    page.screenshot(path=f"{OUT}/{name}_m390_bottom.png")
    page.evaluate("window.scrollTo(0, 0)")
    settle(page, 800)
    try:
        page.screenshot(path=f"{OUT}/{name}_m390_full.png", full_page=True)
    except Exception as e:
        print(f"  mobile full-page failed for {name}: {e}")
    ctx.close()
    browser.close()
    print(f"{name}: done. console_errors={len(console_errors)} ext_requests={len(set(ext_requests))}")
    for e in console_errors[:6]:
        print("   ERR:", e[:200])
    for u in list(set(ext_requests))[:6]:
        print("   EXT:", u[:160])

with sync_playwright() as pw:
    only = sys.argv[1:] if len(sys.argv) > 1 else None
    for name, path in PAGES:
        if only and name not in only:
            continue
        try:
            capture(pw, name, path)
        except Exception as e:
            print(f"{name}: FAILED {e}")
