import os
os.environ["PLAYWRIGHT_BROWSERS_PATH"] = "/opt/pw-browsers"
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={"width": 1440, "height": 900})
    pg.goto("http://127.0.0.1:8899/catering.html", wait_until="networkidle")
    pg.evaluate("window.scrollTo(0, 2700)")
    pg.wait_for_timeout(1500)
    html = pg.eval_on_selector(".tier--10", "el => el.outerHTML")
    print(html)
    b.close()
