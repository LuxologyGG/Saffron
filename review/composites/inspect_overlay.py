import os
os.environ["PLAYWRIGHT_BROWSERS_PATH"] = "/opt/pw-browsers"
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={"width": 1440, "height": 900})
    pg.goto("http://127.0.0.1:8899/index.html", wait_until="networkidle")
    pg.evaluate("window.scrollTo(0, document.body.scrollHeight)")
    pg.wait_for_timeout(1200)
    info = pg.evaluate("""
      () => {
        const el = document.elementFromPoint(720, 400);
        let path = [];
        let cur = el;
        while (cur && cur.tagName) {
          const cs = getComputedStyle(cur);
          path.push({tag: cur.tagName, cls: cur.className, pos: cs.position, z: cs.zIndex, display: cs.display, opacity: cs.opacity});
          cur = cur.parentElement;
        }
        return {text: el.textContent.slice(0,80), path: path};
      }
    """)
    import json
    print(json.dumps(info, indent=2))
    b.close()
