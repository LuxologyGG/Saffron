import os
os.environ["PLAYWRIGHT_BROWSERS_PATH"] = "/opt/pw-browsers"
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={"width": 1440, "height": 900})
    pg.goto("http://127.0.0.1:8899/index.html", wait_until="networkidle")
    pg.wait_for_timeout(3200)
    # progressive scroll like capture.py
    total = pg.evaluate("document.documentElement.scrollHeight")
    print("total scrollHeight after load:", total)
    step = 900
    y = step
    while y < total - 900:
        pg.evaluate(f"window.scrollTo(0,{y})")
        pg.wait_for_timeout(300)
        y += step
    pg.evaluate("window.scrollTo(0, document.documentElement.scrollHeight)")
    pg.wait_for_timeout(1400)
    rect = pg.eval_on_selector(".footer__wordmark", "el => el.getBoundingClientRect()")
    bar = pg.eval_on_selector(".footer__bar", "el => el.getBoundingClientRect()")
    total2 = pg.evaluate("document.documentElement.scrollHeight")
    print("wordmark rect:", rect)
    print("bar rect:", bar)
    print("total scrollHeight after scroll seq:", total2)
    pg.screenshot(path="/tmp/claude-0/-home-user-Saffron/24349566-67b3-502f-ae5a-53d67a044c7a/scratchpad/saffron-b/review/composites/verify_footer_progressive.png")
    b.close()
