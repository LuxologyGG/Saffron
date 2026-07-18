from PIL import Image
import os

R = "/tmp/claude-0/-home-user-Saffron/24349566-67b3-502f-ae5a-53d67a044c7a/scratchpad/saffron-b/research/refs"
S = "/tmp/claude-0/-home-user-Saffron/24349566-67b3-502f-ae5a-53d67a044c7a/scratchpad/saffron-b/review/site-round2/shots"
O = "/tmp/claude-0/-home-user-Saffron/24349566-67b3-502f-ae5a-53d67a044c7a/scratchpad/saffron-b/review/site-round2/composites"
os.makedirs(O, exist_ok=True)

def resize_h(img, h):
    w = int(img.width * h / img.height)
    return img.resize((w, h), Image.LANCZOS)

def row(paths, out, target_h=700, pad=10, bg=(20,20,20)):
    imgs = [Image.open(p).convert("RGB") for p in paths]
    imgs = [resize_h(im, target_h) for im in imgs]
    total_w = sum(im.width for im in imgs) + pad*(len(imgs)+1)
    canvas = Image.new("RGB", (total_w, target_h+pad*2), bg)
    x = pad
    for im in imgs:
        canvas.paste(im, (x, pad))
        x += im.width + pad
    canvas.save(out)
    print(out, canvas.size)

# crop top N px from a full page shot
def crop_top(path, h):
    im = Image.open(path).convert("RGB")
    return im.crop((0,0,im.width, min(h, im.height)))

def save_crop(path, h, out):
    crop_top(path, h).save(out)

jobs = [
  ("01_home_hero_vs_laguna_khufus.png", [
      f"{S}/index_1440_top.png", # will crop
      f"{R}/laguna/home/screenshots/desktop_scroll_00_0.png",
      f"{R}/khufus/home/screenshots/desktop_scroll_00_0.png",
  ]),
  ("07_footer_vs_khufus.png", [
      f"{S}/index_1440_footer.png",
  ]),
  ("03_menu_underline_vs_tastavents.png", [
      f"{S}/menu_1440_underline.png",
      f"{R}/tastavents/home/screenshots/desktop_scroll_02_1998.png",
  ]),
  ("04_catering_platters_vs_tastavents.png", [
      f"{S}/catering_1440_scroll2800.png",
      f"{R}/tastavents/home/screenshots/desktop_scroll_05_4995.png",
  ]),
  ("08_mobile_home_vs_laguna_khufus.png", [
      f"{S}/index_390_top.png",
      f"{R}/laguna/home/screenshots/mobile_scroll_02_1468.png",
      f"{R}/khufus/home/screenshots/mobile_390_full.png",
  ]),
]

for name, paths in jobs:
    row(paths, f"{O}/{name}")

# home trio vs khufus dish grid
row([f"{S}/index_1440_trio.png", f"{R}/khufus/home/screenshots/desktop_scroll_03_2235.png"], f"{O}/02_home_trio_vs_khufus.png")

# about page vs khufus story
row([f"{S}/about_1440_top.png", f"{R}/khufus/legacy/screenshots/desktop_scroll_00_0.png" if os.path.exists(f"{R}/khufus/legacy/screenshots/desktop_scroll_00_0.png") else f"{R}/khufus/home/screenshots/desktop_scroll_05_3725.png"], f"{O}/05_about_vs_khufus.png")

# contact vs khufus
row([f"{S}/contact_1440_top.png", f"{R}/khufus/contact/screenshots/desktop_1440_full.png" if os.path.exists(f"{R}/khufus/contact/screenshots/desktop_1440_full.png") else f"{R}/khufus/home/screenshots/desktop_scroll_00_0.png"], f"{O}/06_contact_vs_khufus.png")
