import json, os
from playwright.sync_api import sync_playwright

BASE = "http://localhost:8299"
OUT = "/tmp/claude-0/-home-user-Saffron/24349566-67b3-502f-ae5a-53d67a044c7a/scratchpad/saffron-b/review/site-round2/shots"
pages = ["index.html","menu.html","catering.html","about.html","contact.html","404.html"]

results = {}

with sync_playwright() as p:
    browser = p.chromium.launch()
    for vp,name in [((1440,900),"1440"), ((390,844),"390")]:
        ctx = browser.new_context(viewport={"width":vp[0],"height":vp[1]})
        for pg in pages:
            page = ctx.new_page()
            errs=[]
            page.on("pageerror", lambda e: errs.append(str(e)))
            page.goto(f"{BASE}/{pg}", wait_until="networkidle")
            page.wait_for_timeout(800)
            slug = pg.replace(".html","")
            # full page screenshot
            page.screenshot(path=f"{OUT}/{slug}_{name}_top.png", full_page=True)
            results[f"{slug}_{name}_errors"] = errs

            if pg=="index.html":
                # scroll to bottom, check footer wordmark vs bar
                page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
                page.wait_for_timeout(1000)
                page.screenshot(path=f"{OUT}/{slug}_{name}_footer.png")
                rect = page.evaluate("""() => {
                  const w = document.querySelector('.footer__wordmark');
                  const b = document.querySelector('.footer__bar');
                  if(!w||!b) return null;
                  const wr = w.getBoundingClientRect();
                  const br = b.getBoundingClientRect();
                  return {wordmark:[wr.top,wr.bottom], bar:[br.top,br.bottom], overlap: !(wr.bottom<=br.top || wr.top>=br.bottom)};
                }""")
                results[f"{slug}_{name}_footer_rect"] = rect

                # home trio petal check
                page.evaluate("document.querySelector('#trio, .home-trio')?.scrollIntoView()")
                page.wait_for_timeout(500)
                page.screenshot(path=f"{OUT}/{slug}_{name}_trio.png")
                ov = page.evaluate("""() => {
                  const petals = document.querySelectorAll('.home-trio .fc-petal-1, .home-trio .fc-petal-2, .home-trio .fc-thread, .home-trio .fc-grain');
                  const texts = document.querySelectorAll('.dish-card h3, .dish-card p');
                  let hits=[];
                  petals.forEach(pe=>{
                    const pr = pe.getBoundingClientRect();
                    texts.forEach(t=>{
                      const tr = t.getBoundingClientRect();
                      const overlap = !(pr.right<=tr.left||pr.left>=tr.right||pr.bottom<=tr.top||pr.top>=tr.bottom);
                      if(overlap) hits.push({petal:pe.className, text:t.textContent.slice(0,30)});
                    });
                  });
                  return hits;
                }""")
                results[f"{slug}_{name}_petal_overlap"] = ov

                if name=="390":
                    gap = page.evaluate("""() => {
                      const band = document.querySelector('.dn-band');
                      if(!band) return null;
                      const r = band.getBoundingClientRect();
                      return {height: r.height};
                    }""")
                    results[f"{slug}_{name}_dnband"] = gap

            if pg=="catering.html" and name=="1440":
                for y in range(2200, 3100, 100):
                    page.evaluate(f"window.scrollTo(0,{y})")
                    page.wait_for_timeout(300)
                    ov = page.evaluate("""() => {
                      const tiers = document.querySelectorAll('.tier__num, [class*=tier__num]');
                      const stats = document.querySelectorAll('.pstat__num, [class*=pstat__num]');
                      let hits=[];
                      tiers.forEach(te=>{
                        const tr=te.getBoundingClientRect();
                        if(tr.width===0) return;
                        stats.forEach(se=>{
                          const sr=se.getBoundingClientRect();
                          if(sr.width===0) return;
                          const overlap = !(tr.right<=sr.left||tr.left>=sr.right||tr.bottom<=sr.top||tr.top>=sr.bottom);
                          if(overlap) hits.push({y, tier:tr, stat:sr, tierText:te.textContent, statText:se.textContent});
                        });
                      });
                      return hits;
                    }""")
                    if ov:
                        results.setdefault(f"catering_collisions", []).extend(ov)
                    page.screenshot(path=f"{OUT}/catering_1440_scroll{y}.png")

            if pg == "menu.html" and name == "1440":
                page.evaluate("document.querySelector('.mcat__head, .thread-divider')?.scrollIntoView()")
                page.wait_for_timeout(400)
                page.screenshot(path=f"{OUT}/menu_1440_underline.png")

            page.close()
        ctx.close()
    browser.close()

with open(f"{OUT}/../verify_results.json","w") as f:
    json.dump(results, f, indent=2, default=str)
print(json.dumps(results, indent=2, default=str))
