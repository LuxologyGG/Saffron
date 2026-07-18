import os
os.environ["PLAYWRIGHT_BROWSERS_PATH"] = "/opt/pw-browsers"
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={"width": 1440, "height": 900})
    pg.goto("http://127.0.0.1:8899/catering.html", wait_until="networkidle")
    pg.evaluate("window.scrollTo(0, 2700)")
    pg.wait_for_timeout(1500)
    pg.screenshot(path="/tmp/claude-0/-home-user-Saffron/24349566-67b3-502f-ae5a-53d67a044c7a/scratchpad/saffron-b/review/composites/verify_catering_2700_settled.png")
    b.close()
