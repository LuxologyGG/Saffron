#!/usr/bin/env python3
import os
from PIL import Image

ROOT = "/tmp/claude-0/-home-user-Saffron/24349566-67b3-502f-ae5a-53d67a044c7a/scratchpad/saffron-b"
SHOTS = os.path.join(ROOT, "review/site-round1/shots")
REFS = os.path.join(ROOT, "research/refs")
OUT = os.path.join(ROOT, "review/composites")

def load(p):
    return Image.open(p).convert("RGB")

def composite(left_paths, right_paths, out_name, target_w=900, label_left="SITE", label_right="REF"):
    imgs_l = [load(p) for p in left_paths]
    imgs_r = [load(p) for p in right_paths]
    def resize_col(imgs, w):
        out = []
        for im in imgs:
            r = w / im.width
            out.append(im.resize((w, int(im.height * r))))
        return out
    imgs_l = resize_col(imgs_l, target_w)
    imgs_r = resize_col(imgs_r, target_w)
    col_l_h = sum(i.height for i in imgs_l) + 10 * (len(imgs_l) - 1)
    col_r_h = sum(i.height for i in imgs_r) + 10 * (len(imgs_r) - 1)
    h = max(col_l_h, col_r_h) + 40
    gap = 20
    w = target_w * 2 + gap
    canvas = Image.new("RGB", (w, h), (30, 30, 30))
    y = 40
    for im in imgs_l:
        canvas.paste(im, (0, y))
        y += im.height + 10
    y = 40
    for im in imgs_r:
        canvas.paste(im, (target_w + gap, y))
        y += im.height + 10
    canvas.save(os.path.join(OUT, out_name))
    print("wrote", out_name, canvas.size)

# 1. home hero vs laguna + khufus hero
composite(
    [f"{SHOTS}/home_d1440_viewport.png"],
    [f"{REFS}/laguna/home/screenshots/desktop_scroll_00_0.png", f"{REFS}/khufus/home/screenshots/desktop_scroll_00_0.png" if os.path.exists(f"{REFS}/khufus/home/screenshots/desktop_scroll_00_0.png") else f"{REFS}/khufus/home/screenshots/desktop_1440_viewport.png"],
    "01_home_hero_vs_laguna_khufus.png"
)

# 2. day-night band vs khufus day-to-night (use mid scrolls)
composite(
    [f"{SHOTS}/home_d1440_scroll_03_2700.png", f"{SHOTS}/home_d1440_scroll_04_3600.png"],
    [f"{REFS}/khufus/home/screenshots/desktop_scroll_04_2980.png", f"{REFS}/khufus/home/screenshots/desktop_scroll_08_5960.png"],
    "02_day_night_vs_khufus.png"
)

# 3. menu chapters vs tastavents + khufus menu
composite(
    [f"{SHOTS}/menu_d1440_viewport.png", f"{SHOTS}/menu_d1440_scroll_02_1800.png"],
    [f"{REFS}/tastavents/home/screenshots/desktop_scroll_02_1998.png", f"{REFS}/khufus/menu/screenshots/desktop_1440_viewport.png" if os.path.exists(f"{REFS}/khufus/menu/screenshots/desktop_1440_viewport.png") else f"{REFS}/khufus/menu/screenshots/desktop_scroll_00_0.png"],
    "03_menu_chapters_vs_tastavents_khufus.png"
)

# 4. catering frame vs tastavents
composite(
    [f"{SHOTS}/catering_d1440_viewport.png", f"{SHOTS}/catering_d1440_scroll_03_2700.png"],
    [f"{REFS}/tastavents/home/screenshots/desktop_scroll_00_0.png", f"{REFS}/tastavents/home/screenshots/desktop_scroll_05_4995.png"],
    "04_catering_vs_tastavents.png"
)

# 5. about vs khufus story
composite(
    [f"{SHOTS}/about_d1440_viewport.png", f"{SHOTS}/about_d1440_scroll_03_2700.png"],
    [f"{REFS}/khufus/about/screenshots/desktop_scroll_02_1280.png", f"{REFS}/khufus/about/screenshots/desktop_scroll_05_3200.png"],
    "05_about_vs_khufus_story.png"
)

# 6. contact vs khufus contact
composite(
    [f"{SHOTS}/contact_d1440_viewport.png"],
    [f"{REFS}/khufus/contact/screenshots/desktop_1440_viewport.png"],
    "06_contact_vs_khufus.png"
)

# 7. footer comparison (bottom shots)
composite(
    [f"{SHOTS}/home_d1440_bottom.png"],
    [f"{REFS}/khufus/about/screenshots/desktop_scroll_12_7680.png"],
    "07_footer_vs_khufus.png"
)

# 8. mobile home vs laguna/khufus mobile
composite(
    [f"{SHOTS}/home_m390_viewport.png", f"{SHOTS}/home_m390_scroll_2.png"],
    [f"{REFS}/laguna/home/screenshots/mobile_390_viewport.png", f"{REFS}/khufus/home/screenshots/mobile_390_viewport.png"],
    "08_mobile_home_vs_laguna_khufus.png",
    target_w=390
)

print("done")
