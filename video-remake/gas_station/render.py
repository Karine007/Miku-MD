#!/usr/bin/env python3
"""
ZOMBIE OUTBREAK: STRANDED AT A GAS STATION - procedural renderer.

Vertical 720x1280 @ 30 fps: black frame, two-line title on top, a 720x640 illustrated
panel in the middle (y 360-1000), time / count / rule overlays. Every scene is drawn with
Pillow at 2x. Timing comes from timeline.json (built by voice.py from the real voice clips).

    python3 render.py out.mp4
    python3 render.py --still 42.0 frame.png
"""
import json
import math
import os
import random
import subprocess
import sys
from functools import lru_cache
from multiprocessing import Pool

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))

def _load_base():
    """Shared drawing helpers from ../render.py (loaded under another name: this file is render.py too)."""
    import importlib.util
    spec = importlib.util.spec_from_file_location("base_render", os.path.join(os.path.dirname(HERE), "render.py"))
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


_B = _load_base()
D, K, add_light, clamp, ease, font, mix, paste_center, rich_text = (
    _B.D, _B.K, _B.add_light, _B.clamp, _B.ease, _B.font, _B.mix, _B.paste_center, _B.rich_text)

W, H = 720, 1280
PW, PH = 720, 640           # illustrated panel
PY = 360                    # panel top on the frame
FPS = 30
# episode folder (default: this one). It holds script.py, timeline.json and optionally scenes.py
EP = os.path.abspath(os.environ.get("EPISODE", HERE))
TL = json.load(open(os.path.join(EP, "timeline.json")))
DURATION = TL["duration"]
BEATS = TL["beats"]

ORANGE = (255, 128, 32)
INK = (22, 20, 24)
SKIN = (250, 250, 248)


def P(img=None):
    return Image.new("RGB", (PW * K, PH * K), (0, 0, 0)) if img is None else img


def grad(c1, c2, h=PH, w=PW):
    t = np.linspace(0, 1, h * K)[:, None, None]
    a = np.array(c1)[None, None] * (1 - t) + np.array(c2)[None, None] * t
    return Image.fromarray(np.repeat(a, w * K, axis=1).astype(np.uint8), "RGB")


def dim(img, k, color=(8, 10, 22)):
    return Image.blend(img, Image.new("RGB", img.size, color), k) if k > 0 else img


# --------------------------------------------------------------------------
# characters (original designs)
# --------------------------------------------------------------------------
def stick(d, x, y, s=1.0, who="you", pose="stand", face="neutral", look=0, t=0.0,
          arms=None, tint=None, item=None):
    """Stick figure. (x, y) = head centre. who: you | ray. pose: stand | sit | lie."""
    r = 34 * s
    lw = 5 * s
    skin = tint or SKIN
    neck = (x, y + r)
    hip = (x, y + r + 92 * s)
    if pose == "sit":
        hip = (x, y + r + 80 * s)
    # torso clothes
    if who == "you":
        d.poly([(x - 26 * s, neck[1] + 6 * s), (x + 26 * s, neck[1] + 6 * s), (x + 30 * s, hip[1] + 4 * s),
                (x - 30 * s, hip[1] + 4 * s)], fill=(46, 84, 150), outline=INK, w=3 * s)
        d.line([(x, neck[1] + 10 * s), (x, hip[1])], fill=(36, 66, 120), w=2 * s)
    else:
        d.poly([(x - 24 * s, neck[1] + 6 * s), (x + 24 * s, neck[1] + 6 * s), (x + 26 * s, hip[1] + 2 * s),
                (x - 26 * s, hip[1] + 2 * s)], fill=(236, 232, 222), outline=INK, w=3 * s)
        d.poly([(x - 24 * s, neck[1] + 6 * s), (x - 6 * s, neck[1] + 6 * s), (x - 8 * s, hip[1] + 2 * s),
                (x - 26 * s, hip[1] + 2 * s)], fill=(178, 40, 36), outline=INK, w=2.5 * s)
        d.poly([(x + 6 * s, neck[1] + 6 * s), (x + 24 * s, neck[1] + 6 * s), (x + 26 * s, hip[1] + 2 * s),
                (x + 8 * s, hip[1] + 2 * s)], fill=(178, 40, 36), outline=INK, w=2.5 * s)
        d.rr((x + 10 * s, neck[1] + 22 * s, x + 22 * s, neck[1] + 30 * s), 2 * s, fill=(240, 240, 240))
    # legs
    if pose == "stand":
        sw = math.sin(t * 2) * 2 * s
        d.line([hip, (x - 18 * s + sw, hip[1] + 78 * s)], fill=INK, w=lw)
        d.line([hip, (x + 18 * s - sw, hip[1] + 78 * s)], fill=INK, w=lw)
    elif pose == "sit":
        d.line([hip, (x - 46 * s, hip[1] + 6 * s), (x - 30 * s, hip[1] + 40 * s)], fill=INK, w=lw)
        d.line([hip, (x + 46 * s, hip[1] + 6 * s), (x + 30 * s, hip[1] + 40 * s)], fill=INK, w=lw)
    # arms
    sh = (x, neck[1] + 14 * s)
    a = arms or "down"
    if a == "down":
        d.line([(sh[0] - 20 * s, sh[1]), (x - 40 * s, sh[1] + 70 * s)], fill=INK, w=lw)
        d.line([(sh[0] + 20 * s, sh[1]), (x + 40 * s, sh[1] + 70 * s)], fill=INK, w=lw)
    elif a == "shrug":
        d.line([(sh[0] - 20 * s, sh[1]), (x - 56 * s, sh[1] + 20 * s), (x - 64 * s, sh[1] - 18 * s)], fill=INK, w=lw)
        d.line([(sh[0] + 20 * s, sh[1]), (x + 56 * s, sh[1] + 20 * s), (x + 64 * s, sh[1] - 18 * s)], fill=INK, w=lw)
    elif a == "hold":
        d.line([(sh[0] - 20 * s, sh[1]), (x - 30 * s, sh[1] + 40 * s), (x + 4 * s, sh[1] + 44 * s)], fill=INK, w=lw)
        d.line([(sh[0] + 20 * s, sh[1]), (x + 30 * s, sh[1] + 40 * s), (x + 10 * s, sh[1] + 44 * s)], fill=INK, w=lw)
    elif a == "behind":
        d.line([(sh[0] - 20 * s, sh[1]), (x - 40 * s, sh[1] + 70 * s)], fill=INK, w=lw)
        d.line([(sh[0] + 20 * s, sh[1]), (x + 26 * s, sh[1] + 50 * s), (x + 8 * s, sh[1] + 66 * s)], fill=INK, w=lw)
    elif a == "cards":
        d.line([(sh[0] - 20 * s, sh[1]), (x - 26 * s, sh[1] + 46 * s), (x - 2 * s, sh[1] + 40 * s)], fill=INK, w=lw)
        d.line([(sh[0] + 20 * s, sh[1]), (x + 26 * s, sh[1] + 46 * s), (x + 4 * s, sh[1] + 40 * s)], fill=INK, w=lw)
        for i in range(3):
            cx = x - 8 * s + i * 8 * s
            d.rr((cx, sh[1] + 20 * s, cx + 14 * s, sh[1] + 40 * s), 2 * s, fill=(250, 250, 250), outline=INK, w=1.5 * s)
    if item == "cup":
        d.rr((x - 4 * s, sh[1] + 30 * s, x + 14 * s, sh[1] + 54 * s), 2 * s, fill=(240, 236, 226), outline=INK, w=2 * s)
        d.rect((x - 4 * s, sh[1] + 38 * s, x + 14 * s, sh[1] + 44 * s), fill=(150, 90, 50))
    if item == "bottle":
        d.rr((x - 2 * s, sh[1] + 22 * s, x + 12 * s, sh[1] + 58 * s), 4 * s, fill=(170, 210, 240), outline=INK, w=2 * s)
    # head
    d.circ(x, y, r, fill=skin, outline=INK, w=3.5 * s)
    lx = look * 8 * s
    if who == "you":
        d.poly([(x - r * 1.02, y - 6 * s), (x - r * 0.9, y - r * 0.9), (x, y - r * 1.25),
                (x + r * 0.9, y - r * 0.9), (x + r * 1.02, y - 6 * s)], fill=(236, 112, 34), outline=INK, w=3 * s)
        d.rr((x - r * 1.08, y - 14 * s, x + r * 1.08, y - 2 * s), 5 * s, fill=(206, 90, 24), outline=INK, w=2.5 * s)
        d.circ(x + 4 * s, y - r * 1.3, 8 * s, fill=(236, 112, 34), outline=INK, w=2.5 * s)
    else:
        d.arc((x - r, y - r, x + r, y + r), 150, 210, fill=(150, 150, 150), w=7 * s)
        d.arc((x - r, y - r, x + r, y + r), 330, 30, fill=(150, 150, 150), w=7 * s)
        for ex in (-12, 12):
            d.circ(x + ex * s + lx, y - 2 * s, 10 * s, outline=(90, 90, 96), w=1.6 * s)
        d.line([(x - 2 * s + lx, y - 2 * s), (x + 2 * s + lx, y - 2 * s)], fill=INK, w=2 * s)
    ey = y - 2 * s if who == "ray" else y + 2 * s
    if face in ("neutral", "worried", "smile", "o", "scared", "creepy"):
        er = 4.2 * s if face != "scared" else 6 * s
        for ex in (-12, 12):
            if face == "creepy":
                d.circ(x + ex * s + lx, ey, 5.5 * s, fill=(225, 232, 220))
            else:
                d.circ(x + ex * s + lx, ey, er, fill=INK)
    elif face == "sleep":
        for ex in (-12, 12):
            d.arc((x + ex * s - 6 * s, ey - 4 * s, x + ex * s + 6 * s, ey + 4 * s), 0, 180, fill=INK, w=2.5 * s)
    if who == "ray":
        d.d.ellipse([v * K for v in (x - 14 * s, y + 8 * s, x + 14 * s, y + 18 * s)], fill=(140, 140, 140))
    my = y + 18 * s if who == "you" else y + 22 * s
    if face in ("neutral", "sleep"):
        d.line([(x - 8 * s + lx, my), (x + 8 * s + lx, my)], fill=INK, w=2.5 * s)
    elif face == "worried":
        d.arc((x - 9 * s + lx, my - 2 * s, x + 9 * s + lx, my + 8 * s), 200, 340, fill=INK, w=2.5 * s)
    elif face in ("smile", "creepy"):
        d.arc((x - 12 * s + lx, my - 12 * s, x + 12 * s + lx, my + 4 * s), 20, 160, fill=INK, w=3 * s)
    elif face in ("o", "scared"):
        d.ell((x - 5 * s + lx, my - 4 * s, x + 5 * s + lx, my + 6 * s), fill=INK)


def zombie(d, x, y, s=1.0, t=0.0, phase=0.0, sway=1.0, color=(150, 166, 138), shirt=(96, 92, 80), up=False):
    """Original zombie: grey-green round head, hollow eyes, arms forward."""
    a = math.sin(t * 1.6 + phase) * 0.06 * sway
    dx = math.sin(a) * 60 * s
    r = 30 * s
    hx, hy = x + dx, y
    d.poly([(hx - 24 * s, hy + r + 4 * s), (hx + 24 * s, hy + r + 4 * s), (x + 26 * s, hy + r + 96 * s),
            (x - 26 * s, hy + r + 96 * s)], fill=shirt, outline=INK, w=3 * s)
    d.poly([(x - 10 * s, hy + r + 96 * s), (x - 2 * s, hy + r + 70 * s), (x + 8 * s, hy + r + 96 * s)], fill=INK)
    for lx in (-14, 14):
        d.line([(x + lx * s * 0.5, hy + r + 94 * s), (x + lx * s, hy + r + 170 * s)], fill=INK, w=5 * s)
    for side in (-1, 1):
        d.line([(hx + side * 20 * s, hy + r + 18 * s), (hx + side * 30 * s + 26 * s, hy + r + 40 * s)],
               fill=INK, w=5 * s)
    d.circ(hx, hy, r, fill=color, outline=INK, w=3.5 * s)
    oy = -6 * s if up else 0
    for ex in (-10, 10):
        d.circ(hx + ex * s, hy - 2 * s + oy, 7 * s, fill=(40, 44, 40))
        d.circ(hx + ex * s, hy - 2 * s + oy, 2.2 * s, fill=(210, 214, 200))
    d.ell((hx - 7 * s, hy + 10 * s, hx + 7 * s, hy + 22 * s), fill=(50, 40, 40))


# --------------------------------------------------------------------------
# set pieces
# --------------------------------------------------------------------------
def night_sky(img):
    img.paste(grad((14, 18, 38), (88, 52, 54)), (0, 0))
    d = D(img)
    rnd = random.Random(4)
    for _ in range(40):
        x, y = rnd.uniform(0, PW), rnd.uniform(0, 220)
        d.circ(x, y, rnd.uniform(0.8, 1.6), fill=(190, 190, 210))
    d.poly([(0, 300), (120, 262), (260, 286), (400, 250), (560, 280), (720, 258), (720, 340), (0, 340)],
           fill=(26, 24, 36))
    return d


def gas_station(img, t, lights=True, truck=False, car=True):
    d = night_sky(img)
    d.rect((0, 330, PW, PH), fill=(40, 40, 46))
    d.poly([(250, 330), (470, 330), (720, 640), (0, 640)], fill=(52, 52, 58))
    for i in range(6):
        y0 = 340 + i * 52
        d.rect((354, y0, 366, y0 + 24), fill=(150, 140, 90))
    # store building
    d.rect((420, 210, 700, 330), fill=(92, 86, 78), outline=INK, w=3)
    d.rect((420, 196, 700, 214), fill=(170, 46, 40), outline=INK, w=3)
    win = (255, 226, 150) if lights else (36, 40, 52)
    for i in range(3):
        d.rect((440 + i * 82, 236, 508 + i * 82, 300), fill=win, outline=INK, w=3)
    # canopy
    d.rect((60, 214, 400, 246), fill=(226, 224, 216), outline=INK, w=3)
    d.rect((60, 238, 400, 246), fill=(178, 40, 36))
    for px in (110, 350):
        d.rect((px - 8, 246, px + 8, 360), fill=(200, 200, 196), outline=INK, w=2.5)
    for px in (170, 290):
        d.rr((px - 18, 300, px + 18, 362), 4, fill=(208, 60, 46), outline=INK, w=3)
        d.rect((px - 12, 308, px + 12, 326), fill=(40, 46, 56))
    if lights:
        for lx in (130, 230, 330):
            d.rect((lx - 26, 246, lx + 26, 252), fill=(255, 252, 230))
        img = add_light(img, 230, 300, 260, (110, 104, 80), 0.75)
        img = add_light(img, 560, 300, 200, (90, 70, 30), 0.4)
        d = D(img)
    # price sign
    d.rect((62, 110, 68, 330), fill=(70, 70, 76))
    d.rr((26, 70, 104, 140), 6, fill=(226, 224, 216) if lights else (60, 62, 70), outline=INK, w=3)
    font_ = font("InterDisplay-Black.otf", 26 * K)
    d.d.text((65 * K, 92 * K), "GAS", font=font_, fill=(178, 40, 36), anchor="mm")
    d.d.text((65 * K, 120 * K), "3.89", font=font("InterDisplay-Bold.otf", 22 * K),
             fill=(30, 30, 30) if lights else (40, 40, 44), anchor="mm")
    if car:
        d.rr((196, 320, 300, 372), 14, fill=(66, 98, 140), outline=INK, w=3)
        d.rr((214, 300, 284, 330), 10, fill=(56, 84, 120), outline=INK, w=3)
        d.rect((222, 306, 276, 326), fill=(150, 176, 200))
        for wx in (218, 280):
            d.circ(wx, 372, 12, fill=INK)
    if truck:
        d.rr((80, 352, 220, 420), 10, fill=(130, 60, 44), outline=INK, w=3)
        d.rr((150, 322, 220, 360), 8, fill=(120, 54, 40), outline=INK, w=3)
        d.poly([(220, 330), (262, 318), (262, 372), (220, 372)], fill=(116, 52, 38), outline=INK, w=3)
        d.rect((226, 334, 256, 352), fill=(255, 236, 170))
        img = add_light(img, 240, 344, 60, (120, 100, 50), 0.6)
        d = D(img)
        for wx in (104, 196):
            d.circ(wx, 420, 15, fill=INK)
    return img


def store_bg(img, dark=0.0, day=False):
    d = D(img)
    wall = (204, 196, 170) if not day else (214, 206, 178)
    d.rect((0, 0, PW, PH), fill=wall)
    d.rect((0, 0, PW, 70), fill=(150, 146, 132))
    for lx in (120, 360, 600):
        d.rect((lx - 70, 76, lx + 70, 86), fill=(250, 252, 244), outline=(120, 120, 110), w=2)
    d.poly([(0, 460), (PW, 460), (PW, PH), (0, PH)], fill=(176, 176, 168))
    for i in range(10):
        d.line([(i * 90 - 120, PH), (i * 72 + 40, 460)], fill=(160, 160, 152), w=2)
    for j in range(5):
        y = 460 + j * j * 9 + j * 20
        d.line([(0, y), (PW, y)], fill=(160, 160, 152), w=2)
    # window (back wall)
    sky = (30, 34, 54) if not day else (150, 190, 220)
    d.rect((300, 150, 560, 330), fill=sky, outline=INK, w=4)
    d.line([(430, 150), (430, 330)], fill=INK, w=4)
    # shelf left
    d.poly([(0, 150), (190, 210), (190, 470), (0, 560)], fill=(120, 120, 126), outline=INK, w=3)
    rnd = random.Random(2)
    cols = [(200, 60, 50), (240, 180, 40), (60, 120, 190), (80, 160, 90), (230, 120, 40)]
    for row in range(4):
        y0 = 190 + row * 80
        for i in range(8):
            x0 = 6 + i * 22
            yy = y0 + (190 - x0) * 0.0 - (x0 / 190) * 40 + 30
            d.rect((x0, yy, x0 + 18, yy + 42 - row * 2), fill=rnd.choice(cols), outline=INK, w=1.5)
        d.line([(0, y0 + 74), (190, y0 + 34)], fill=INK, w=4)
    # counter right
    d.poly([(470, 360), (720, 360), (720, 560), (470, 560)], fill=(140, 52, 40), outline=INK, w=3)
    d.rect((462, 346, 720, 366), fill=(220, 214, 196), outline=INK, w=3)
    d.rr((600, 300, 680, 350), 6, fill=(50, 50, 56), outline=INK, w=3)
    d.rect((612, 308, 668, 330), fill=(90, 190, 140))
    if dark:
        img = dim(img, dark)
    return img


# --------------------------------------------------------------------------
# scenes (t = absolute seconds, lt = seconds since the scene started)
# --------------------------------------------------------------------------
def sc_highway(t, lt):
    img = gas_station(P(), t)
    d = D(img)
    stick(d, 330, 330, 0.45, "you", look=-1, t=t)
    return img


def sc_highway_dark(t, lt):
    k = ease(lt / 0.25)
    img = gas_station(P(), t, lights=lt < 0.15, truck=True)
    d = D(img)
    for i, x in enumerate((120, 300, 470, 620)):
        zombie(d, x, 330 + (i % 2) * 14, 0.4, t, i, color=(110, 124, 104))
    return dim(img, 0.55 * k)


def sc_store(t, lt, shrug=False):
    img = store_bg(P())
    d = D(img)
    stick(d, 590, 262, 0.95, "ray", face="smile" if shrug else "neutral",
          arms="shrug" if shrug else "hold", t=t, look=-1 if shrug else 0)
    if not shrug:
        d.rect((552, 334, 620, 352), fill=(250, 250, 246), outline=INK, w=2)
        for i in range(4):
            d.line([(560, 338 + i * 4), (612, 338 + i * 4)], fill=(150, 150, 150), w=1)
    else:
        d.rr((520, 318, 572, 350), 6, fill=(70, 60, 50), outline=INK, w=3)
    stick(d, 280, 300, 1.0, "you", face="neutral", look=1 if not shrug else -1, t=t, item="cup", arms="hold")
    return img


def sc_coffee(t, lt):
    img = P()
    d = D(img)
    d.rect((0, 0, PW, PH), fill=(60, 52, 48))
    d.rect((0, 470, PW, PH), fill=(120, 110, 100))
    d.rr((180, 40, 540, 470), 18, fill=(44, 44, 50), outline=INK, w=5)
    d.rect((220, 80, 500, 180), fill=(28, 28, 32))
    for i, c in enumerate(((210, 60, 50), (90, 190, 120), (240, 200, 60))):
        d.circ(270 + i * 90, 130, 18, fill=c if int(lt * 3) % 3 == i else mix(c, (28, 28, 32), 0.6))
    d.rect((300, 200, 420, 240), fill=(20, 20, 24), outline=INK, w=3)
    attempt = min(2, int(lt / 0.75))
    pour = (lt % 0.75) < 0.45 and attempt == 2 or (lt % 0.75) < 0.15
    if pour:
        d.rect((354, 240, 366, 390), fill=(90, 56, 30))
    else:
        for i in range(3):
            yy = 250 + ((lt * 300 + i * 40) % 120)
            d.circ(360, yy, 4, fill=(90, 56, 30))
    d.poly([(310, 380), (410, 380), (398, 470), (322, 470)], fill=(240, 236, 226), outline=INK, w=4)
    d.rect((316, 410, 404, 436), fill=(178, 40, 36))
    fill_k = clamp(lt / 2.4)
    if fill_k > 0:
        d.rect((318, 386 - 0 * fill_k, 402, 392), fill=(90, 56, 30))
    return img


def sc_radio(t, lt):
    img = P()
    d = D(img)
    d.rect((0, 0, PW, PH), fill=(30, 28, 30))
    d.rect((0, 470, PW, PH), fill=(96, 40, 32))
    d.rr((150, 200, 570, 480), 24, fill=(140, 96, 60), outline=INK, w=5)
    d.rr((180, 230, 380, 450), 12, fill=(70, 50, 34), outline=INK, w=3)
    for y in range(244, 440, 14):
        d.line([(196, y), (364, y)], fill=(50, 34, 24), w=4)
    d.rr((400, 240, 540, 320), 8, fill=(240, 200, 120), outline=INK, w=3)
    img = add_light(img, 470, 280, 150, (120, 90, 30), 0.6 + 0.1 * math.sin(t * 9))
    d = D(img)
    nx = 410 + (t * 7 % 1.0) * 0 + 70
    d.line([(nx, 248), (nx, 312)], fill=(200, 40, 30), w=3)
    for i, x in enumerate(range(420, 540, 20)):
        d.line([(x, 300), (x, 312)], fill=INK, w=2)
    for cx in (440, 500):
        d.circ(cx, 400, 26, fill=(60, 44, 30), outline=INK, w=3)
    d.line([(220, 200), (180, 60)], fill=(150, 150, 150), w=4)
    for i in range(3):
        ph = (t * 1.2 + i / 3) % 1
        r = 40 + ph * 140
        c = mix((30, 28, 30), (220, 200, 160), (1 - ph) * 0.8)
        d.arc((570 - r * 0.4, 330 - r, 570 + r, 330 + r), -50, 50, fill=c, w=4)
    return img


def sc_store_shrug(t, lt):
    return sc_store(t, lt, shrug=True)


def sc_window(t, lt):
    img = gas_station(P(), t, truck=True)
    d = D(img)
    if lt > 1.8:
        k = ease((lt - 1.8) / 0.8)
        d.poly([(220, 330), (220 + 34 * k, 322), (220 + 34 * k, 372), (220, 372)], fill=(110, 50, 36), outline=INK, w=3)
    # window frame (inside looking out)
    d.rect((0, 0, PW, 26), fill=(150, 146, 132))
    d.rect((0, 600, PW, PH), fill=(140, 52, 40))
    for x in (0, 236, 472, 704):
        d.rect((x, 0, x + 16, PH), fill=(64, 64, 70), outline=INK, w=2)
    d.rect((0, 590, PW, 606), fill=(64, 64, 70), outline=INK, w=2)
    img = img.copy()
    glare = Image.new("L", img.size, 0)
    gd = ImageDraw.Draw(glare)
    gd.polygon([(80 * K, 0), (140 * K, 0), (40 * K, 600 * K), (-20 * K, 600 * K)], fill=26)
    gd.polygon([(500 * K, 0), (530 * K, 0), (440 * K, 600 * K), (410 * K, 600 * K)], fill=20)
    img = Image.composite(Image.new("RGB", img.size, (230, 230, 240)), img, glare)
    return img


def sc_pump_zombie(t, lt):
    img = P()
    d = D(img)
    d.rect((0, 0, PW, PH), fill=(20, 22, 30))
    d.rect((0, 470, PW, PH), fill=(54, 54, 60))
    d.rect((0, 0, PW, 70), fill=(226, 224, 216), outline=INK, w=3)
    for lx in (180, 540):
        d.rect((lx - 70, 70, lx + 70, 80), fill=(255, 252, 230))
    img = add_light(img, 360, 120, 520, (90, 90, 70), 0.8)
    d = D(img)
    d.rr((440, 230, 560, 540), 10, fill=(208, 60, 46), outline=INK, w=4)
    d.rect((460, 260, 540, 320), fill=(40, 46, 56))
    d.d.text((500 * K, 290 * K), "4", font=font("InterDisplay-Black.otf", 44 * K), fill=(255, 210, 120), anchor="mm")
    d.rect((540, 380, 556, 470), fill=(30, 30, 34))
    zombie(d, 290, 250, 1.35, t, 0, sway=1.6, up=True)
    return img


def sc_horde(t, lt):
    img = P()
    night_sky(img)
    d = D(img)
    d.rect((0, 330, PW, PH), fill=(32, 32, 38))
    d.poly([(340, 300), (380, 300), (720, 640), (0, 640)], fill=(46, 46, 52))
    img = add_light(img, 360, 620, 300, (60, 56, 40), 0.6)
    d = D(img)
    rnd = random.Random(11)
    figs = []
    for i in range(46):
        depth = rnd.random() ** 1.6
        x = 360 + (rnd.random() - 0.5) * (40 + 700 * depth)
        y = 300 + 290 * depth
        figs.append((depth, x, y, rnd.random() * 6))
    walk = ease(lt / 8) * 0.12
    for depth, x, y, ph in sorted(figs):
        dd = clamp(depth + walk)
        x2 = 360 + (x - 360) * (1 + walk * 2)
        y2 = 300 + 290 * dd
        s = 0.12 + 0.5 * dd
        c = mix((40, 40, 46), (120, 130, 112), dd)
        zombie(d, x2, y2 - 110 * s, s, t, ph, color=c, shirt=mix((30, 30, 34), (90, 86, 76), dd))
    return img


def sc_switch(t, lt):
    img = P()
    d = D(img)
    d.rect((0, 0, PW, PH), fill=(150, 146, 132))
    d.rr((170, 60, 550, 600), 12, fill=(120, 124, 130), outline=INK, w=5)
    d.d.text((360 * K, 104 * K), "BREAKER", font=font("InterDisplay-Black.otf", 30 * K), fill=(40, 40, 40), anchor="mm")
    labels = ["CANOPY", "SIGN", "STORE", "COOLER", "PUMPS"]
    flip = lt > 1.6
    for i, lab in enumerate(labels):
        y = 160 + i * 84
        d.rr((220, y, 500, y + 60), 6, fill=(96, 100, 106), outline=INK, w=3)
        d.d.text((300 * K, (y + 30) * K), lab, font=font("InterDisplay-Bold.otf", 20 * K), fill=(230, 230, 230), anchor="mm")
        on = not (flip and lab in ("CANOPY", "SIGN"))
        d.rr((400, y + 10, 470, y + 50), 6, fill=(40, 40, 44), outline=INK, w=2)
        d.rr((404 if on else 436, y + 14, 434 if on else 466, y + 46), 4, fill=(210, 60, 46) if on else (90, 90, 90))
    hx = 420 if lt < 1.6 else 440
    hy = 200 + min(1, lt / 1.4) * 6
    d.line([(720, 620), (hx + 60, hy + 70)], fill=INK, w=18)
    d.circ(hx + 30, hy + 30, 34, fill=INK)
    d.line([(hx + 10, hy + 20), (hx - 12, hy - 6)], fill=INK, w=12)
    if 1.6 < lt < 1.9:
        img = add_light(img, 440, 190, 90, (255, 220, 120), 0.8)
    return img


def sc_glass(t, lt):
    img = P()
    d = D(img)
    d.rect((0, 0, PW, PH), fill=(10, 12, 20))
    for i, x in enumerate((120, 330, 560)):
        a = clamp(1 - (lt - 2.2) / 1.6) if lt > 2.2 else 1.0
        zombie(d, x + (lt * 30 if lt > 2.2 else 0) * (1 if i % 2 else -1), 250 + i * 10, 1.2,
               t, i, color=mix((10, 12, 20), (60, 70, 60), a * 0.9), shirt=mix((10, 12, 20), (40, 40, 40), a))
    hit = lt > 0.4
    if hit:
        cx, cy = 360, 300
        d.circ(cx, cy + 20, 46, fill=(26, 30, 34))
        for i, a in enumerate((-60, -30, 0, 30, 60)):
            r = math.radians(a - 90)
            d.line([(cx + 30 * math.cos(r), cy + 20 + 30 * math.sin(r)),
                    (cx + 84 * math.cos(r), cy + 20 + 84 * math.sin(r))], fill=(26, 30, 34), w=16)
        for i in range(6):
            d.line([(cx - 40 + i * 16, cy + 60), (cx - 44 + i * 16, cy + 60 + 40 + i * 9)], fill=(40, 44, 50), w=4)
    for x in (0, 236, 472, 704):
        d.rect((x, 0, x + 16, PH), fill=(30, 30, 36), outline=INK, w=2)
    shake = math.exp(-(lt - 0.4) * 8) * 8 if lt > 0.4 else 0
    if shake:
        img = img.transform(img.size, Image.AFFINE, (1, 0, shake * math.sin(lt * 90) * K, 0, 1, 0))
    return img


def sc_store_dark(t, lt):
    img = store_bg(P(), dark=0.72)
    d = D(img)
    d.rect((470, 360, 720, 560), fill=(46, 22, 22))
    stick(d, 560, 420, 0.8, "ray", face="neutral", t=t, tint=(150, 156, 180), look=-1)
    stick(d, 640, 430, 0.75, "you", face="worried", t=t, tint=(150, 156, 180), look=-1)
    d.rect((462, 470, 720, 560), fill=(60, 28, 24), outline=INK, w=3)
    return img


def sc_aisle(t, lt):
    img = P()
    d = D(img)
    d.rect((0, 0, PW, PH), fill=(196, 190, 168))
    d.poly([(0, 420), (PW, 420), (PW, PH), (0, PH)], fill=(176, 176, 168))
    d.rect((320, 160, 400, 420), fill=(150, 146, 132))
    rnd = random.Random(5)
    cols = [(220, 60, 50), (246, 186, 40), (60, 130, 200), (90, 170, 90), (236, 120, 40), (150, 80, 160)]
    for side in (-1, 1):
        x_out = 0 if side < 0 else PW
        x_in = 320 if side < 0 else 400
        d.poly([(x_out, 0), (x_in, 160), (x_in, 420), (x_out, PH)], fill=(110, 110, 116), outline=INK, w=3)
        for row in range(5):
            f0, f1 = row / 5, (row + 1) / 5
            for i in range(9):
                u0, u1 = i / 9, (i + 0.8) / 9
                def pt(u, f):
                    xo = x_out + (x_in - x_out) * u
                    top = 0 + 160 * u
                    bot = PH + (420 - PH) * u
                    return (xo, top + (bot - top) * f)
                q = [pt(u0, f0 + 0.03), pt(u1, f0 + 0.03), pt(u1, f1 - 0.02), pt(u0, f1 - 0.02)]
                d.poly(q, fill=rnd.choice(cols), outline=INK, w=1.2)
    return img


def sc_fridge(t, lt):
    img = P()
    d = D(img)
    d.rect((0, 0, PW, PH), fill=(60, 64, 72))
    for i in range(3):
        x0 = 30 + i * 226
        d.rr((x0, 40, x0 + 210, 600), 8, fill=(200, 226, 240), outline=INK, w=5)
        for row in range(4):
            y0 = 70 + row * 130
            d.line([(x0 + 10, y0 + 110), (x0 + 200, y0 + 110)], fill=(140, 150, 160), w=4)
            for b in range(5):
                bx = x0 + 22 + b * 37
                d.rr((bx, y0 + 30, bx + 26, y0 + 108), 6, fill=(150, 200, 236), outline=INK, w=2)
                d.rect((bx + 8, y0 + 20, bx + 18, y0 + 32), fill=(40, 110, 200))
                d.rect((bx, y0 + 60, bx + 26, y0 + 76), fill=(240, 246, 250))
        d.rect((x0 + 190, 280, x0 + 198, 360), fill=(160, 160, 166))
    img = add_light(img, 360, 300, 420, (40, 60, 70), 0.6)
    return img


def sc_roller(t, lt):
    img = P()
    d = D(img)
    d.rect((0, 0, PW, PH), fill=(56, 44, 40))
    d.rect((0, 470, PW, PH), fill=(140, 52, 40))
    d.rr((90, 200, 630, 480), 14, fill=(170, 172, 176), outline=INK, w=5)
    d.rect((120, 230, 600, 440), fill=(60, 56, 54))
    img = add_light(img, 360, 330, 300, (120, 70, 20), 0.55)
    d = D(img)
    for i in range(7):
        y = 250 + i * 28
        d.rr((130, y, 590, y + 16), 8, fill=(190, 190, 196), outline=INK, w=1.5)
    for i in range(5):
        y = 244 + i * 40
        x = 200 + i * 60
        rot = (t * 2 + i) % 1
        d.rr((x, y, x + 210, y + 26), 13, fill=(196, 92, 60), outline=INK, w=3)
        d.line([(x + 20 + rot * 170, y + 6), (x + 30 + rot * 170, y + 20)], fill=(150, 60, 40), w=3)
    d.rr((250, 150, 470, 196), 8, fill=(178, 40, 36), outline=INK, w=3)
    d.d.text((360 * K, 173 * K), "HOT DOGS", font=font("InterDisplay-Black.otf", 28 * K), fill=(255, 236, 200), anchor="mm")
    return img


def sc_ticket(t, lt):
    img = P()
    d = D(img)
    d.rect((0, 0, PW, PH), fill=(140, 52, 40))
    d.rect((0, 0, PW, PH), fill=(150, 60, 46))
    d.poly([(150, 120), (580, 90), (600, 520), (170, 560)], fill=(246, 240, 214), outline=INK, w=4)
    for i in range(10):
        d.line([(170 + i * 42, 112 - i * 3), (186 + i * 42, 548 - i * 4)], fill=(232, 222, 190), w=2)
    words = ["2 BOTTLES", "A DAY", "EACH!"]
    k = clamp((lt - 0.6) / 3.0)
    n_chars = int(k * sum(len(w) for w in words))
    f = font("InterDisplay-BoldItalic.otf", 52 * K)
    used = 0
    pen = (300, 230)
    for i, w in enumerate(words):
        take = max(0, min(len(w), n_chars - used))
        used += len(w)
        if take:
            pos = ((250 + i * 6) * K, (220 + i * 90) * K)
            d.d.text(pos, w[:take], font=f, fill=(30, 40, 120))
            tw = f.getlength(w[:take]) / K
            pen = (250 + i * 6 + tw, 250 + i * 90)
    if lt < 4.4:
        px, py = pen
        d.line([(px + 4, py), (px + 180, py + 160)], fill=(40, 120, 200), w=16)
        d.line([(px, py - 4), (px + 14, py + 10)], fill=INK, w=8)
        d.line([(px + 180, py + 160), (720, 640)], fill=INK, w=24)
    return img


def sc_day1(t, lt):
    img = store_bg(P(), day=True)
    img = add_light(img, 430, 260, 300, (60, 60, 40), 0.5)
    d = D(img)
    d.ell((230, 520, 520, 600), fill=(150, 150, 142))
    stick(d, 270, 410, 0.9, "you", pose="sit", face="smile", arms="cards", t=t, look=1)
    stick(d, 470, 404, 0.9, "ray", pose="sit", face="smile", arms="cards", t=t, look=-1)
    d.poly([(340, 540), (390, 530), (396, 580), (346, 588)], fill=(240, 180, 40), outline=INK, w=3)
    for i in range(3):
        d.rr((360 + i * 22, 556 - i * 4, 380 + i * 22, 584 - i * 4), 3, fill=(250, 250, 250), outline=INK, w=2)
    return img


def sc_phone(t, lt):
    img = P()
    d = D(img)
    d.rect((0, 0, PW, PH), fill=(24, 26, 34))
    d.line([(720, 640), (470, 470)], fill=INK, w=40)
    d.rr((220, 40, 500, 620), 34, fill=(18, 18, 22), outline=(80, 80, 90), w=5)
    d.rr((236, 56, 484, 604), 24, fill=(236, 236, 240))
    bars = 1 if 0.4 < lt < 4.4 else 0
    for i in range(4):
        c = (40, 40, 44) if i < bars else (190, 190, 196)
        d.rect((440 + i * 9, 86 - i * 5, 446 + i * 9, 96), fill=c)
    if bars == 0:
        d.d.text((478 * K, 92 * K), "x", font=font("Inter-Bold.otf", 14 * K), fill=(220, 40, 40), anchor="mm")
    d.d.text((266 * K, 92 * K), "9%", font=font("Inter-Bold.otf", 13 * K), fill=(220, 40, 40), anchor="lm")
    d.rect((236, 110, 484, 150), fill=(246, 246, 248))
    d.d.text((360 * K, 130 * K), "Mom", font=font("Inter-SemiBold.otf", 16 * K), fill=(30, 30, 30), anchor="mm")
    if lt > 0.8:
        d.rr((252, 180, 440, 236), 18, fill=(214, 214, 222))
        d.d.text((266 * K, 208 * K), "where are you??", font=font("Inter-Regular.otf", 16 * K), fill=(20, 20, 20), anchor="lm")
    if lt > 1.6:
        d.rr((290, 256, 470, 336), 18, fill=(40, 120, 240))
        d.d.text((304 * K, 282 * K), "safe. gas station", font=font("Inter-Regular.otf", 16 * K), fill=(255, 255, 255), anchor="lm")
        d.d.text((304 * K, 308 * K), "on route 9. love u", font=font("Inter-Regular.otf", 16 * K), fill=(255, 255, 255), anchor="lm")
        st = "Delivered" if lt < 4.4 else "Not delivered"
        d.d.text((466 * K, 350 * K), st, font=font("Inter-Regular.otf", 11 * K),
                 fill=(130, 130, 136) if lt < 4.4 else (220, 40, 40), anchor="rm")
    img = add_light(img, 360, 320, 300, (40, 44, 60), 0.4)
    d = D(img)
    d.circ(500, 470, 46, fill=INK)
    d.line([(486, 430), (470, 360)], fill=INK, w=18)
    return img


def sc_night(t, lt, empty=False):
    img = store_bg(P(), dark=0.78)
    d = D(img)
    d.poly([(80, 520), (420, 500), (450, 600), (60, 620)], fill=(96, 74, 52), outline=INK, w=3)
    d.poly([(420, 520), (700, 506), (720, 600), (450, 618)], fill=(90, 70, 50), outline=INK, w=3)
    tint = (140, 146, 176)
    if not empty:
        stick_lying(d, 240, 540, "you", "sleep" if lt < 1.5 else "o", tint)
        d.poly([(470, 536), (690, 528), (700, 578), (466, 590)], fill=(70, 70, 120), outline=INK, w=3)
        d.circ(500, 528, 22, fill=tint, outline=INK, w=3)
    else:
        stick(d, 230, 430, 0.85, "you", pose="sit", face="scared", t=t, tint=tint, look=1)
        d.poly([(480, 560), (690, 552), (700, 584), (476, 592)], fill=(70, 70, 120), outline=INK, w=3)
    return img


def stick_lying(d, x, y, who, face, tint):
    d.line([(x + 30, y), (x + 150, y + 4)], fill=INK, w=5)
    d.line([(x + 150, y + 4), (x + 220, y)], fill=INK, w=5)
    d.poly([(x + 30, y - 18), (x + 130, y - 14), (x + 130, y + 18), (x + 30, y + 16)], fill=(46, 84, 150), outline=INK, w=3)
    d.poly([(x + 110, y - 26), (x + 240, y - 30), (x + 250, y + 22), (x + 104, y + 24)], fill=(70, 70, 120), outline=INK, w=3)
    d.circ(x, y, 28, fill=tint, outline=INK, w=3)
    d.poly([(x - 24, y - 12), (x - 6, y - 30), (x + 10, y - 26), (x + 4, y - 4)], fill=(206, 90, 24), outline=INK, w=2.5)
    if face == "sleep":
        d.arc((x - 10, y - 2, x, y + 6), 0, 180, fill=INK, w=2)
        d.arc((x + 4, y - 2, x + 14, y + 6), 0, 180, fill=INK, w=2)
    else:
        d.circ(x - 5, y + 2, 4, fill=INK)
        d.circ(x + 9, y + 2, 4, fill=INK)


def sc_night_empty(t, lt):
    return sc_night(t, lt, empty=True)


def sc_cooler(t, lt):
    img = P()
    d = D(img)
    d.rect((0, 0, PW, PH), fill=(14, 16, 24))
    d.rect((0, 500, PW, PH), fill=(28, 30, 38))
    d.rect((200, 60, 520, 520), fill=(70, 76, 86), outline=INK, w=5)
    gap = 18 + lt * 4
    img = add_light(img, 360 + gap / 2, 300, 260, (60, 90, 110), 0.7)
    d = D(img)
    d.rect((206, 66, 360, 514), fill=(160, 220, 240))
    d.poly([(360 - gap, 66), (514, 70), (514, 510), (360 - gap, 514)], fill=(96, 104, 116), outline=INK, w=4)
    d.rr((380, 270, 420, 300), 6, fill=(170, 170, 176), outline=INK, w=3)
    d.d.text((440 * K, 140 * K), "WALK-IN", font=font("InterDisplay-Black.otf", 26 * K), fill=(220, 220, 220), anchor="mm")
    fog = Image.new("L", img.size, 0)
    fd = ImageDraw.Draw(fog)
    rnd = random.Random(3)
    for i in range(14):
        x = 300 + rnd.uniform(-60, 80) + math.sin(t + i) * 20
        y = 500 + rnd.uniform(-10, 40)
        r = rnd.uniform(30, 70) + lt * 8
        fd.ellipse(((x - r) * K, (y - r * 0.4) * K, (x + r) * K, (y + r * 0.4) * K), fill=60)
    fog = fog.filter(ImageFilter.GaussianBlur(14 * K))
    return Image.composite(Image.new("RGB", img.size, (200, 220, 230)), img, fog)


def sc_ray_back(t, lt):
    img = P()
    d = D(img)
    d.rect((0, 0, PW, PH), fill=(14, 16, 24))
    for side in (-1, 1):
        x_out = 0 if side < 0 else PW
        x_in = 250 if side < 0 else 470
        d.poly([(x_out, 0), (x_in, 140), (x_in, 460), (x_out, PH)], fill=(34, 36, 46), outline=INK, w=3)
    d.poly([(0, PH), (250, 460), (470, 460), (PW, PH)], fill=(30, 32, 40))
    img = add_light(img, 360, 260, 200, (40, 60, 80), 0.6)
    d = D(img)
    step = min(1, lt / 1.5)
    stick(d, 360, 200 + step * 20, 1.15 + step * 0.15, "ray", face="smile", arms="behind", t=t,
          tint=(170, 180, 190), item="bottle")
    return img


def sc_sleeve(t, lt):
    img = P()
    d = D(img)
    d.rect((0, 0, PW, PH), fill=(16, 16, 22))
    d.poly([(-20, 260), (560, 200), (600, 420), (-20, 470)], fill=(236, 232, 222), outline=INK, w=5)
    d.ell((540, 180, 700, 440), fill=(170, 180, 190), outline=INK, w=5)
    k = ease(lt / 2.6)
    stain = Image.new("L", img.size, 0)
    sd = ImageDraw.Draw(stain)
    rnd = random.Random(8)
    for i in range(18):
        x = 360 + rnd.uniform(-1, 1) * 160 * k
        y = 330 + rnd.uniform(-1, 1) * 70 * k
        r = (20 + rnd.uniform(0, 40)) * (0.3 + k)
        sd.ellipse(((x - r) * K, (y - r) * K, (x + r) * K, (y + r) * K), fill=255)
    clip = Image.new("L", img.size, 0)
    ImageDraw.Draw(clip).polygon([(-20 * K, 260 * K), (560 * K, 200 * K), (600 * K, 420 * K), (-20 * K, 470 * K)], fill=255)
    from PIL import ImageChops
    stain = ImageChops.multiply(stain.filter(ImageFilter.GaussianBlur(10 * K)), clip)
    img = Image.composite(Image.new("RGB", img.size, (130, 18, 24)), img, stain.point(lambda v: int(v * 0.9)))
    return img


def sc_ray_dark(t, lt, turn=False):
    img = P()
    d = D(img)
    d.rect((0, 0, PW, PH), fill=(10, 12, 18))
    tint = (150, 168, 150) if turn else (170, 180, 190)
    img = add_light(img, 360, 330, 300, (30, 40, 50), 0.6)
    d = D(img)
    stick(d, 360, 260, 2.6, "ray", face="creepy" if turn and lt > 0.8 else "smile", arms="behind", t=t, tint=tint)
    if turn:
        img = add_light(img, 360, 260, 420, (120, 0, 0), 0.45 * ease(lt / 1.5))
        d = D(img)
        for ex in (-12, 12):
            img = add_light(img, 360 + ex * 2.6, 260 - 2 * 2.6, 26, (120, 140, 110), 0.6 * ease((lt - 0.8) / 0.6))
    return img


def sc_ray_dark2(t, lt):
    return sc_ray_dark(t, lt, turn=True)


def sc_end(t, lt):
    return P()


SCENES = {k[3:]: v for k, v in globals().items() if k.startswith("sc_")}


def _load_episode_module(name):
    """Load <episode>/<name>.py with this module's helpers (stick, zombie, D, ...) in its namespace."""
    import importlib.util
    path = os.path.join(EP, name + ".py")
    if not os.path.exists(path):
        return None
    spec = importlib.util.spec_from_file_location(f"episode_{name}", path)
    mod = importlib.util.module_from_spec(spec)
    mod.__dict__.update({k: v for k, v in globals().items() if not k.startswith("__")})
    spec.loader.exec_module(mod)
    return mod


_SCRIPT = _load_episode_module("script")
_EP_SCENES = _load_episode_module("scenes") if EP != HERE else None
if _EP_SCENES:
    SCENES.update({k[3:]: v for k, v in vars(_EP_SCENES).items() if k.startswith("sc_")})


# --------------------------------------------------------------------------
# timeline helpers
# --------------------------------------------------------------------------
def beat_at(t):
    for b in BEATS:
        if b["start"] <= t < b["end"]:
            return b
    return BEATS[-1] if t >= BEATS[-1]["start"] else BEATS[0]


def scene_start(b):
    """Start of the run of consecutive beats sharing this scene."""
    i = b["i"]
    while i > 0 and BEATS[i - 1]["scene"] == b["scene"]:
        i -= 1
    return BEATS[i]["start"] if i > 0 else 0.0


def scene_end(b):
    i = b["i"]
    while i + 1 < len(BEATS) and BEATS[i + 1]["scene"] == b["scene"]:
        i += 1
    return BEATS[i]["end"]


@lru_cache(maxsize=1)
def title_img():
    img = Image.new("RGBA", (W, 140), (0, 0, 0, 0))
    l1 = rich_text("*ZOMBIE*" + TITLE_1, 64, stroke=0, red=ORANGE, squeeze=0.66)
    l2 = rich_text(TITLE_2, 64, stroke=0, squeeze=0.66)
    paste_center(img, l1, 360, 28)
    paste_center(img, l2, 360, 82)
    return img


TITLE_1 = " OUTBREAK:"
TITLE_2 = _SCRIPT.TITLE[2] if _SCRIPT else "STRANDED AT A GAS STATION"
END_TEXT = getattr(_SCRIPT, "END_TEXT", "PART 2 COMING SOON")
END_SUB = getattr(_SCRIPT, "END_SUB", "FOLLOW SO YOU DON'T MISS IT")


def overlay_label(panel1x, b, lt):
    ov = b.get("overlay")
    if not ov:
        return
    k = ease(lt / 0.25)
    if ov[0] == "time":
        im = rich_text(ov[1], 64, stroke=4, squeeze=0.7)
        paste_center(panel1x, im, 360, 60, 1.15 - 0.15 * k, k)
        d = ImageDraw.Draw(panel1x)
        w = im.width * 0.55 * k
        d.rectangle((360 - w / 2, 98, 360 + w / 2, 103), fill=ORANGE)
    elif ov[0] == "count":
        im = rich_text(f"*{ov[1]}* {ov[2]}", 70, stroke=5, red=ORANGE, squeeze=0.7)
        paste_center(panel1x, im, 360, 580, 1.2 - 0.2 * k, k)
    elif ov[0] == "rule":
        card = Image.new("RGBA", (440, 112), (0, 0, 0, 0))
        cd = ImageDraw.Draw(card)
        cd.rectangle((0, 0, 440, 112), fill=(248, 244, 232, 255), outline=(30, 30, 30, 255), width=3)
        cd.text((18, 10), ov[1], font=font("InterDisplay-Black.otf", 22), fill=(230, 80, 20))
        paste_center(card, rich_text(ov[2], 46, stroke=0, base=(20, 20, 20), squeeze=0.72), 220, 70)
        x = -240 + 470 * k
        paste_center(panel1x, card, x, 92, 1.0, 1.0, angle=1.5)


def render_frame(i):
    t = i / FPS
    b = beat_at(t)
    s0, s1 = scene_start(b), scene_end(b)
    lt = t - s0
    canvas = Image.new("RGB", (W, H), (0, 0, 0))
    if b["scene"] == "end":
        k = ease(lt / 0.5)
        c = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        paste_center(c, rich_text(END_TEXT, 76, stroke=0, squeeze=0.68), 360, 620, 1.0, k)
        paste_center(c, rich_text("*" + END_SUB + "*", 34, stroke=0, red=ORANGE, squeeze=0.7),
                     360, 676, 1.0, k)
        canvas.paste(c, (0, 0), c)
        fade = clamp((t - (DURATION - 0.6)) / 0.6)
        if fade:
            canvas = Image.blend(canvas, Image.new("RGB", canvas.size, (0, 0, 0)), fade)
        return canvas.tobytes()
    panel2x = SCENES[b["scene"]](t, lt)
    # slow push-in over the scene
    z = 1.0 + 0.06 * ease((t - s0) / max(1.0, s1 - s0))
    cw, ch = PW * K / z, PH * K / z
    x0, y0 = (PW * K - cw) / 2, (PH * K - ch) / 2
    panel = panel2x.resize((PW, PH), Image.LANCZOS, box=(x0, y0, x0 + cw, y0 + ch)).convert("RGBA")
    overlay_label(panel, b, t - b["start"])
    panel = panel.convert("RGB")
    # cut fades
    edge = min(t - s0, s1 - t)
    if edge < 0.12:
        panel = Image.blend(Image.new("RGB", panel.size, (0, 0, 0)), panel, clamp(edge / 0.12))
    a = np.asarray(panel).astype(np.float32)
    rng = np.random.default_rng(i % 7)
    a += rng.normal(0, 3, (PH, PW, 1))
    panel = Image.fromarray(np.clip(a, 0, 255).astype(np.uint8))
    canvas.paste(panel, (0, PY))
    tm = title_img()
    canvas.paste(tm, (0, 190), tm)
    return canvas.tobytes()


def main():
    if len(sys.argv) >= 2 and sys.argv[1] == "--still":
        t = float(sys.argv[2])
        Image.frombytes("RGB", (W, H), render_frame(int(round(t * FPS)))).save(sys.argv[3])
        return
    out = sys.argv[1] if len(sys.argv) > 1 else "video.mp4"
    n = int(DURATION * FPS)
    ff = subprocess.Popen(["ffmpeg", "-y", "-v", "error", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}",
                           "-r", str(FPS), "-i", "-", "-c:v", "libx264", "-preset", "medium", "-crf", "21",
                           "-pix_fmt", "yuv420p", out], stdin=subprocess.PIPE)
    with Pool(os.cpu_count()) as pool:
        for k, fr in enumerate(pool.imap(render_frame, range(n), chunksize=8)):
            ff.stdin.write(fr)
            if k % 300 == 0:
                print(f"frame {k}/{n}", flush=True)
    ff.stdin.close()
    ff.wait()


if __name__ == "__main__":
    main()
