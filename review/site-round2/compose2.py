from PIL import Image
import os

R = "/tmp/claude-0/-home-user-Saffron/24349566-67b3-502f-ae5a-53d67a044c7a/scratchpad/saffron-b/research/refs"
S = "/tmp/claude-0/-home-user-Saffron/24349566-67b3-502f-ae5a-53d67a044c7a/scratchpad/saffron-b/review/site-round2/shots"
O = "/tmp/claude-0/-home-user-Saffron/24349566-67b3-502f-ae5a-53d67a044c7a/scratchpad/saffron-b/review/site-round2/composites"
os.makedirs(O, exist_ok=True)

def crop_top(path, h):
    im = Image.open(path).convert("RGB")
    return im.crop((0,0,im.width, min(h, im.height)))

def resize_h(im, h):
    w = int(im.width * h / im.height)
    return im.resize((w,h), Image.LANCZOS)

def row(specs, out, target_h=680, pad=10, bg=(20,20,20)):
    # specs: list of (path, crop_h or None)
    imgs = []
    for path, ch in specs:
        im = Image.open(path).convert("RGB")
        if ch:
            im = im.crop((0,0,im.width, min(ch, im.height)))
        imgs.append(resize_h(im, target_h))
    total_w = sum(im.width for im in imgs) + pad*(len(imgs)+1)
    canvas = Image.new("RGB", (total_w, target_h+pad*2), bg)
    x = pad
    for im in imgs:
        canvas.paste(im, (x, pad))
        x += im.width + pad
    canvas.save(out)
    print(out, canvas.size)

# 01 home hero vs laguna + khufus hero
row([
    (f"{S}/index_1440_top.png", 900),
    (f"{R}/laguna/home/screenshots/desktop_scroll_00_0.png", None),
    (f"{R}/khufus/home/screenshots/desktop_scroll_00_0.png", None),
], f"{O}/01_home_hero_vs_laguna_khufus.png")

# 02 home trio vs khufus dish grid
row([
    (f"{S}/index_1440_trio.png", None),
    (f"{R}/khufus/home/screenshots/desktop_scroll_03_2235.png", None),
], f"{O}/02_home_trio_vs_khufus.png")

# 03 menu underline vs tastavents
row([
    (f"{S}/menu_1440_underline.png", None),
    (f"{R}/tastavents/home/screenshots/desktop_scroll_02_1998.png", None),
], f"{O}/03_menu_underline_vs_tastavents.png")

# 04 catering platters vs tastavents
row([
    (f"{S}/catering_1440_scroll2800.png", None),
    (f"{R}/tastavents/home/screenshots/desktop_scroll_05_4995.png", None),
], f"{O}/04_catering_platters_vs_tastavents.png")

# 05 about vs khufus story
row([
    (f"{S}/about_1440_top.png", 900),
    (f"{R}/khufus/home/screenshots/desktop_scroll_05_3725.png", None),
], f"{O}/05_about_vs_khufus.png")

# 06 contact vs khufus contact
row([
    (f"{S}/contact_1440_top.png", 900),
    (f"{R}/khufus/contact/screenshots/desktop_scroll_00_0.png", None),
], f"{O}/06_contact_vs_khufus.png")

# 07 footer vs khufus footer (already tight to footer)
row([
    (f"{S}/index_1440_footer.png", None),
], f"{O}/07_footer_vs_khufus.png")

# 08 mobile home vs laguna/khufus mobile
row([
    (f"{S}/index_390_top.png", 1600),
    (f"{R}/laguna/home/screenshots/mobile_scroll_02_1468.png", None),
    (f"{R}/khufus/home/screenshots/mobile_390_full.png", 1600),
], f"{O}/08_mobile_home_vs_laguna_khufus.png", target_h=900)
