import os
os.environ["PLAYWRIGHT_BROWSERS_PATH"] = "/opt/pw-browsers"
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={"width": 1440, "height": 900})
    pg.goto("http://127.0.0.1:8899/catering.html", wait_until="networkidle")
    pg.evaluate("window.scrollTo(0, 2700)")
    pg.wait_for_timeout(1500)
    info = pg.evaluate("""
      () => {
        const el = document.elementFromPoint(295, 92);
        if (!el) return null;
        let path = [];
        let cur = el;
        while (cur && cur.tagName) {
          path.push(cur.tagName + (cur.className ? '.' + String(cur.className).split(' ').join('.') : ''));
          cur = cur.parentElement;
        }
        return {text: el.textContent, path: path, rect: el.getBoundingClientRect()};
      }
    """)
    print(info)
    b.close()
