#!/usr/bin/env python3
"""
Procedural remake of the short horror video "NUIT 1 - LE VOCAL".

Everything (backgrounds, character, phone UI, captions, clock, effects) is drawn
with Pillow, frame by frame, at 2x and downsampled to 720x1280 @ 30 fps.
Frames are piped straight to ffmpeg.  The sound design is synthesized by
audio.py.

Usage:
    python3 render.py out.mp4            # full video (silent, see make.sh)
    python3 render.py --still 12.5 x.png # render one frame for preview
"""
import math
import os
import random
import subprocess
import sys
from functools import lru_cache
from multiprocessing import Pool

import numpy as np
from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageFont

W, H = 720, 1280
K = 2                      # supersampling factor
FPS = 30
DURATION = 104.37
FONT_DIR = "/usr/share/fonts/opentype/inter/"

# --------------------------------------------------------------------------
# palette
# --------------------------------------------------------------------------
WALL = (40, 47, 118)
WALL2 = (45, 53, 128)
FLOOR = (40, 28, 38)
BLANKET = (128, 46, 46)
BLANKET_D = (96, 34, 38)
HEADBOARD = (72, 40, 48)
RED = (255, 69, 48)
NEON = (255, 40, 40)
INK = (8, 8, 20)

NIGHT = dict(face=(98, 110, 200), hood=(14, 16, 42), hair=(80, 92, 178),
             body=(34, 42, 100), shirt=(96, 116, 215), eye=(205, 214, 255))
DAY = dict(face=(236, 218, 194), hood=(16, 16, 22), hair=(244, 236, 214),
           body=(26, 26, 32), shirt=(236, 230, 220), eye=(250, 250, 250))


def lerp(a, b, t):
    return a + (b - a) * t


def clamp(x, a=0.0, b=1.0):
    return max(a, min(b, x))


def ease(t):
    t = clamp(t)
    return t * t * (3 - 2 * t)


def mix(c1, c2, t):
    return tuple(int(lerp(a, b, t)) for a, b in zip(c1, c2))


# --------------------------------------------------------------------------
# drawing wrapper: all coordinates in 720x1280 space, scaled by K
# --------------------------------------------------------------------------
class D:
    def __init__(self, img):
        self.im = img
        self.d = ImageDraw.Draw(img)

    @staticmethod
    def _b(box):
        return [v * K for v in box]

    @staticmethod
    def _p(pts):
        return [(x * K, y * K) for x, y in pts]

    def rect(self, box, fill=None, outline=None, w=0):
        self.d.rectangle(self._b(box), fill=fill, outline=outline, width=int(w * K))

    def rr(self, box, r, fill=None, outline=None, w=0):
        self.d.rounded_rectangle(self._b(box), radius=r * K, fill=fill,
                                 outline=outline, width=int(w * K))

    def ell(self, box, fill=None, outline=None, w=0):
        self.d.ellipse(self._b(box), fill=fill, outline=outline, width=int(w * K))

    def circ(self, cx, cy, r, fill=None, outline=None, w=0):
        self.ell((cx - r, cy - r, cx + r, cy + r), fill, outline, w)

    def poly(self, pts, fill=None, outline=None, w=0):
        p = self._p(pts)
        self.d.polygon(p, fill=fill)
        if outline and w:
            self.d.line(p + [p[0]], fill=outline, width=int(w * K), joint="curve")

    def line(self, pts, fill, w=2):
        self.d.line(self._p(pts), fill=fill, width=max(1, int(w * K)), joint="curve")

    def arc(self, box, a0, a1, fill, w=2):
        self.d.arc(self._b(box), a0, a1, fill=fill, width=int(w * K))


def smooth(pts, n=8):
    """Catmull-Rom closed spline through pts."""
    out = []
    L = len(pts)
    for i in range(L):
        p0, p1, p2, p3 = pts[i - 1], pts[i], pts[(i + 1) % L], pts[(i + 2) % L]
        for j in range(n):
            t = j / n
            t2, t3 = t * t, t * t * t
            x = 0.5 * ((2 * p1[0]) + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2
                       + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3)
            y = 0.5 * ((2 * p1[1]) + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2
                       + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3)
            out.append((x, y))
    return out


def open_spline(pts, n=10):
    pts = [pts[0]] + list(pts) + [pts[-1]]
    out = []
    for i in range(1, len(pts) - 2):
        p0, p1, p2, p3 = pts[i - 1], pts[i], pts[i + 1], pts[i + 2]
        for j in range(n):
            t = j / n
            t2, t3 = t * t, t * t * t
            out.append(tuple(0.5 * ((2 * p1[k]) + (-p0[k] + p2[k]) * t
                                    + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t2
                                    + (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * t3) for k in (0, 1)))
    out.append(pts[-2])
    return out


def partial(pts, frac):
    """First frac of a polyline (by point count, fine for dense splines)."""
    n = max(2, int(len(pts) * clamp(frac)))
    return pts[:n]


# --------------------------------------------------------------------------
# cached image helpers
# --------------------------------------------------------------------------
@lru_cache(maxsize=64)
def vgrad(c1, c2, h=H * K, w=W * K):
    t = np.linspace(0, 1, h)[:, None]
    a = np.array(c1)[None, None, :] * (1 - t[..., None]) + np.array(c2)[None, None, :] * t[..., None]
    a = np.repeat(a, w, axis=1)
    return Image.fromarray(a.astype(np.uint8), "RGB")


@lru_cache(maxsize=128)
def radial_patch(r, color, strength, power=1.6):
    """Additive radial light patch (RGB), size 2r x 2r in 2x space."""
    n = 2 * r * K
    y, x = np.mgrid[0:n, 0:n].astype(np.float32)
    d = np.sqrt((x - r * K) ** 2 + (y - r * K) ** 2) / (r * K)
    f = np.clip(1 - d, 0, 1) ** power * strength
    a = f[..., None] * np.array(color, np.float32)[None, None, :]
    return Image.fromarray(np.clip(a, 0, 255).astype(np.uint8), "RGB")


def add_light(img, cx, cy, r, color, strength=1.0, power=1.6):
    r = int(r)
    strength = round(strength * 20) / 20
    if strength <= 0:
        return img
    p = radial_patch(r, color, strength, power)
    x0, y0 = int((cx - r) * K), int((cy - r) * K)
    bx0, by0 = max(0, x0), max(0, y0)
    bx1, by1 = min(img.width, x0 + p.width), min(img.height, y0 + p.height)
    if bx1 <= bx0 or by1 <= by0:
        return img
    region = img.crop((bx0, by0, bx1, by1))
    pp = p.crop((bx0 - x0, by0 - y0, bx1 - x0, by1 - y0))
    img.paste(ImageChops.add(region, pp), (bx0, by0))
    return img


@lru_cache(maxsize=1)
def vignette():
    y, x = np.mgrid[0:H, 0:W].astype(np.float32)
    d = np.sqrt(((x - W / 2) / (W * 0.62)) ** 2 + ((y - H / 2) / (H * 0.62)) ** 2)
    v = np.clip(1.15 - d * 0.75, 0.25, 1.0)
    return (v[..., None] * np.ones(3)[None, None, :]).astype(np.float32)


@lru_cache(maxsize=1)
def grains():
    rng = np.random.default_rng(7)
    return [rng.normal(0, 3.0, (H, W, 1)).astype(np.float32) for _ in range(6)]


def neon(img, polylines, color=NEON, width=4, glow=10, core=(255, 150, 140), alpha=1.0):
    """Glowing neon strokes. polylines: list of point lists (720 space)."""
    if alpha <= 0.01:
        return img
    xs = [p[0] for pl in polylines for p in pl]
    ys = [p[1] for pl in polylines for p in pl]
    pad = glow * 3 + width
    x0, y0 = int(max(0, min(xs) - pad)), int(max(0, min(ys) - pad))
    x1, y1 = int(min(W, max(xs) + pad)), int(min(H, max(ys) + pad))
    if x1 <= x0 or y1 <= y0:
        return img
    box = (x0 * K, y0 * K, x1 * K, y1 * K)
    m = Image.new("L", (box[2] - box[0], box[3] - box[1]), 0)
    md = ImageDraw.Draw(m)
    for pl in polylines:
        if len(pl) > 1:
            md.line([((x - x0) * K, (y - y0) * K) for x, y in pl], fill=255,
                     width=int(width * K), joint="curve")
    blur = m.filter(ImageFilter.GaussianBlur(glow * K))
    region = img.crop(box)
    g = Image.new("RGB", m.size, color)
    region = ImageChops.add(region, ImageChops.multiply(g, Image.merge("RGB", [blur.point(lambda v: min(255, v * 2.2 * alpha))] * 3)))
    c = Image.new("RGB", m.size, mix(color, core, 0.6))
    region = Image.composite(c, region, m.point(lambda v: int(v * alpha)))
    img.paste(region, box[:2])
    return img


# --------------------------------------------------------------------------
# fonts and text
# --------------------------------------------------------------------------
@lru_cache(maxsize=32)
def font(name, size):
    return ImageFont.truetype(FONT_DIR + name, size)


CAP_FONT = "InterDisplay-Black.otf"
SQUEEZE = 0.74


def rich_text(markup, size, base=(255, 255, 255), stroke=5, squeeze=SQUEEZE,
              red=RED, grey=(200, 200, 212), stroke_fill=(10, 10, 22)):
    """Render caption markup: *red*, ~grey~. Returns RGBA image (1x)."""
    f = font(CAP_FONT, int(size))
    segs, cur, mode = [], "", None
    for ch in markup:
        if ch in "*~":
            if cur:
                segs.append((cur, mode))
            cur = ""
            mode = None if mode == ch else ch
        else:
            cur += ch
    if cur:
        segs.append((cur, mode))
    colors = {None: base, "*": red, "~": grey}
    total = sum(f.getlength(s) for s, _ in segs)
    asc, desc = f.getmetrics()
    pad = stroke + 6
    im = Image.new("RGBA", (int(total + pad * 2), asc + desc + pad * 2), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    x = pad
    # stroke pass then fill pass, so outlines never cover neighbours
    for s, m in segs:
        d.text((x, pad), s, font=f, fill=stroke_fill, stroke_width=stroke, stroke_fill=stroke_fill)
        x += f.getlength(s)
    x = pad
    for s, m in segs:
        d.text((x, pad), s, font=f, fill=colors[m])
        x += f.getlength(s)
    im = im.resize((max(1, int(im.width * squeeze)), im.height), Image.LANCZOS)
    return im


def paste_center(base, overlay, cx, cy, scale=1.0, alpha=1.0, angle=0):
    o = overlay
    if scale != 1.0:
        o = o.resize((max(1, int(o.width * scale)), max(1, int(o.height * scale))), Image.LANCZOS)
    if angle:
        o = o.rotate(angle, resample=Image.BICUBIC, expand=True)
    if alpha < 1:
        a = o.getchannel("A").point(lambda v: int(v * alpha))
        o = o.copy()
        o.putalpha(a)
    base.alpha_composite(o, (int(cx - o.width / 2), int(cy - o.height / 2)))


# --------------------------------------------------------------------------
# the character
# --------------------------------------------------------------------------
HAIR = [(-143, -168), (-118, -203), (-68, -228), (12, -246), (102, -250), (182, -265),
        (246, -287), (214, -236), (172, -198), (120, -160), (142, -128), (152, -53),
        (127, -98), (82, -120), (2, -128), (-78, -113), (-108, -128)]


def character(d, cx, cy, s, eyes="open", mouth="line", pal=NIGHT, body=True,
              tear=0.0, blink=False, look=(0, 0), t=0.0, hands_phone=False):
    def P(x, y):
        return (cx + x * s, cy + y * s)

    def B(x0, y0, x1, y1):
        a, b = P(x0, y0)
        c, e = P(x1, y1)
        return (a, b, c, e)

    if body:
        d.rr(B(-318, 165, 222, 760), 150 * s, fill=pal["body"], outline=INK, w=3 * s)
        d.rect(B(-98, 168, 72, 760), fill=pal["shirt"])
        if hands_phone:
            d.rr(B(-200, 380, 150, 760), 26 * s, fill=None, outline=(150, 170, 255), w=4 * s)
            d.rr(B(-268, 420, -205, 690), 30 * s, fill=(104, 124, 225), outline=INK, w=3 * s)
            d.rr(B(150, 420, 213, 690), 30 * s, fill=(104, 124, 225), outline=INK, w=3 * s)
    # hood
    d.ell(B(-295, -275, 149, 189), fill=pal["hood"], outline=INK, w=3 * s)
    # face
    d.poly(smooth([P(-100, -120), P(0, -132), P(98, -122), P(108, 10), P(60, 110), P(0, 130),
                   P(-70, 100), P(-104, 0)], 8), fill=pal["face"], outline=INK, w=3 * s)
    # hair tuft
    d.poly(smooth([P(*p) for p in HAIR], 5), fill=pal["hair"], outline=INK, w=3.5 * s)
    # mask band
    d.poly([P(-104, -92), P(150, -96), P(150, -10), P(-104, -6)], fill=(6, 6, 10))
    ex, ey = look
    eye = pal["eye"]
    L, R = (-28 + ex, -50 + ey), (60 + ex, -52 + ey)
    if blink:
        eyes = "closed"
    for (x, y) in (L, R):
        if eyes == "open":
            d.rect(B(x - 20, y - 18, x + 20, y + 20), fill=eye)
        elif eyes == "squint":
            d.rect(B(x - 22, y - 2, x + 22, y + 10), fill=eye)
            d.line([P(x - 26, y - 14), P(x + 24, y - 8)], fill=eye, w=6 * s)
        elif eyes == "dots":
            d.circ(*P(x, y), 18 * s, fill=eye)
            d.circ(*P(x + 2, y + 2), 8 * s, fill=INK)
        elif eyes == "wide":
            d.circ(*P(x, y), 22 * s, fill=eye)
            d.circ(*P(x, y), 6 * s, fill=INK)
        elif eyes == "closed":
            d.arc(B(x - 22, y - 26, x + 22, y + 10), 20, 160, fill=eye, w=6 * s)
        elif eyes == "happy":
            d.arc(B(x - 22, y - 8, x + 22, y + 30), 200, 340, fill=eye, w=7 * s)
        elif eyes == "shut":
            d.line([P(x - 20, y - 8), P(x, y + 8), P(x + 20, y - 8)], fill=eye, w=6 * s)
        elif eyes == "red":
            d.circ(*P(x, y), 16 * s, fill=(255, 60, 50))
    mx, my = 44, 56
    if mouth == "line":
        d.line([P(mx - 22, my), P(mx + 22, my - 3)], fill=INK, w=7 * s)
    elif mouth == "o":
        d.ell(B(mx - 16, my - 22, mx + 16, my + 18), fill=INK)
        d.ell(B(mx - 9, my - 2, mx + 9, my + 14), fill=(170, 40, 50))
    elif mouth == "smile":
        d.arc(B(mx - 30, my - 34, mx + 30, my + 10), 25, 155, fill=INK, w=6 * s)
    elif mouth == "frown":
        d.arc(B(mx - 24, my - 2, mx + 24, my + 30), 205, 335, fill=INK, w=6 * s)
    elif mouth == "stitch":
        pts = [P(mx - 40 + i * 8, my + (-6 if i % 2 else 6)) for i in range(11)]
        d.line([P(mx - 40, my), P(mx + 40, my)], fill=(190, 30, 40), w=5 * s)
        d.line(pts, fill=(255, 70, 60), w=4.5 * s)
    if tear > 0:
        tx, ty = P(R[0] + 14, R[1] + 30 + tear * 60)
        d.poly([(tx, ty - 22 * s), (tx - 9 * s, ty), (tx + 9 * s, ty)], fill=(190, 225, 255))
        d.circ(tx, ty + 2 * s, 9 * s, fill=(190, 225, 255))


# --------------------------------------------------------------------------
# reusable set pieces
# --------------------------------------------------------------------------
def wall(img, base=WALL, stripe=WALL2, y1=H, step=44):
    d = D(img)
    d.rect((0, 0, W, y1), fill=base)
    for x in range(0, W, step):
        d.rect((x, 0, x + step // 2, y1), fill=stripe)
    return d


def zzz(d, x, y, t, color=(200, 205, 240), big=1.0):
    f_ = [(0, 0, 18), (32, -32, 24), (60, -70, 30)]
    for i, (dx, dy, sz) in enumerate(f_):
        ph = (t * 0.9 + i * 0.33) % 1.0
        a = math.sin(ph * math.pi)
        c = mix((40, 47, 118), color, a)
        sz *= big
        xx, yy = x + dx * big, y + dy * big - ph * 20
        d.line([(xx, yy), (xx + sz, yy), (xx, yy + sz), (xx + sz, yy + sz)], fill=c, w=3.5 * big)


def phone_body(img, t, x0=162, y0=212, x1=558, y1=1020, shake=0.0):
    """Hand holding a big phone. Returns screen box."""
    d = D(img)
    sx = math.sin(t * 90) * shake * 6
    x0, x1 = x0 + sx, x1 + sx
    # arm
    d.poly([(300 + sx, y1 - 20), (390 + sx, y1 - 20), (370, H + 10), (250, H + 10)], fill=(176, 154, 138))
    d.poly([(300 + sx, y1 - 20), (330 + sx, y1 - 20), (290, H + 10), (250, H + 10)], fill=(150, 128, 114))
    # thumb + fingers
    d.rr((x0 - 18, 560, x0 + 14, 660), 16, fill=(160, 138, 122), outline=INK, w=2)
    for i in range(3):
        d.rr((x1 - 12, 470 + i * 52, x1 + 16, 512 + i * 52), 14, fill=(160, 138, 122), outline=INK, w=2)
    d.rr((x0, y0, x1, y1), 54, fill=(18, 18, 22), outline=(70, 70, 82), w=5)
    scr = (x0 + 14, y0 + 14, x1 - 14, y1 - 14)
    return scr


def screen_mask(scr, r=42):
    m = Image.new("L", (W * K, H * K), 0)
    ImageDraw.Draw(m).rounded_rectangle([v * K for v in scr], radius=r * K, fill=255)
    return m


def ui_text(d, xy, text, size, fill, name="Inter-SemiBold.otf", anchor="mm"):
    d.d.text((xy[0] * K, xy[1] * K), text, font=font(name, int(size * K)), fill=fill, anchor=anchor)


def notif(d, scr, y, who="Maman", alpha=1.0, light=False):
    x0, _, x1, _ = scr
    bg = (88, 80, 128) if not light else (60, 60, 70)
    d.rr((x0 + 22, y, x1 - 22, y + 62), 16, fill=mix((20, 20, 26), bg, alpha))
    d.rr((x0 + 34, y + 17, x0 + 60, y + 43), 7, fill=mix((20, 20, 26), (52, 199, 89), alpha))
    d.rr((x0 + 41, y + 25, x0 + 53, y + 34), 3, fill=mix((20, 20, 26), (255, 255, 255), alpha))
    tc = mix((20, 20, 26), (245, 245, 250), alpha)
    sc = mix((20, 20, 26), (200, 200, 215), alpha)
    ui_text(d, (x0 + 72, y + 22), who, 12, tc, "Inter-Bold.otf", "lm")
    ui_text(d, (x0 + 72, y + 41), "Message vocal", 11, sc, "Inter-Regular.otf", "lm")
    ui_text(d, (x1 - 36, y + 22), "maintenant", 9, sc, "Inter-Regular.otf", "rm")


@lru_cache(maxsize=8)
def waveform(seed, n=26):
    rnd = random.Random(seed)
    return [0.25 + 0.75 * abs(math.sin(i * 0.7 + seed)) * rnd.random() for i in range(n)]


def voice_bubble(d, x0, y, w, playing, progress, seed, dur):
    d.rr((x0, y, x0 + w, y + 46), 23, fill=(44, 44, 52))
    d.circ(x0 + 24, y + 23, 13, fill=(240, 240, 245))
    if playing:
        d.rect((x0 + 19, y + 16, x0 + 22, y + 30), fill=(44, 44, 52))
        d.rect((x0 + 26, y + 16, x0 + 29, y + 30), fill=(44, 44, 52))
    else:
        d.poly([(x0 + 20, y + 15), (x0 + 31, y + 23), (x0 + 20, y + 31)], fill=(44, 44, 52))
    bars = waveform(seed)
    bx = x0 + 48
    span = w - 100
    for i, a in enumerate(bars):
        xx = bx + i * span / len(bars)
        hh = 3 + a * 15
        col = (235, 235, 240) if i / len(bars) < progress else (120, 120, 130)
        d.rect((xx, y + 23 - hh, xx + 3, y + 23 + hh), fill=col)
    secs = int(dur * progress) if playing else int(dur)
    ui_text(d, (x0 + w - 18, y + 32), f"0:0{secs}", 9, (150, 150, 160), "Inter-Regular.otf", "rm")


@lru_cache(maxsize=1)
def bokeh_static():
    img = vgrad((26, 24, 60), (8, 8, 20)).copy()
    for i in range(9):
        rnd = random.Random(i * 31)
        img = add_light(img, rnd.uniform(0, W), rnd.uniform(0, H), int(rnd.uniform(60, 160)), (40, 40, 90), 0.5)
    return img


def bokeh_bg(img, t, tint=None):
    return bokeh_static().copy()


# --------------------------------------------------------------------------
# scenes: each returns a 2x RGB image.  t = absolute time, lt = local time
# --------------------------------------------------------------------------
def sc_bedroom_wide(t, lt):
    img = Image.new("RGB", (W * K, H * K))
    d = wall(img)
    d.rect((0, 830, W, H), fill=FLOOR)
    d.rect((0, 820, W, 834), fill=(55, 40, 55))
    # window + moon
    d.rect((62, 190, 222, 502), fill=(112, 120, 210))
    d.rect((70, 200, 214, 492), fill=(22, 28, 80))
    img = add_light(img, 187, 272, 90, (60, 60, 120), 0.8)
    d = D(img)
    d.circ(187, 272, 27, fill=(245, 245, 255))
    d.rect((138, 200, 146, 492), fill=(112, 120, 210))
    d.rect((70, 342, 214, 350), fill=(112, 120, 210))
    d.rect((10, 175, 64, 548), fill=(52, 72, 205))
    d.rect((218, 175, 274, 548), fill=(52, 72, 205))
    # poster
    d.rect((285, 245, 432, 428), fill=(186, 158, 64))
    star = [(358 + 70 * math.cos(math.radians(-90 + i * 36)) * (1 if i % 2 == 0 else 0.42),
             338 + 70 * math.sin(math.radians(-90 + i * 36)) * (1 if i % 2 == 0 else 0.42)) for i in range(10)]
    d.poly(star, fill=(168, 52, 52))
    # nightstand
    d.rect((600, 740, W, 960), fill=(60, 34, 44), outline=INK, w=3)
    # bed
    d.rr((122, 572, 596, 860), 18, fill=HEADBOARD, outline=INK, w=3)
    d.ell((195, 640, 522, 748), fill=(112, 122, 205), outline=INK, w=2)
    character(d, 372, 690, 0.36, eyes="closed" if lt < 2.6 else "squint", mouth="line", body=False)
    d.poly([(150, 760), (585, 760), (675, 1125), (45, 1125)], fill=BLANKET, outline=INK, w=3)
    d.poly([(160, 775), (575, 775), (580, 810), (155, 810)], fill=(112, 122, 205))
    for xx in (250, 360, 470):
        d.line([(xx, 815), (xx + (xx - 360) * 0.5, 1120)], fill=BLANKET_D, w=2)
    d.rect((20, 1125, 700, 1200), fill=(50, 26, 32))
    if lt < 2.6:
        zzz(d, 432, 545, t)
    # phone on nightstand
    vib = 2.0 <= lt
    ox = math.sin(t * 80) * 3 if vib else 0
    if lt >= 2.0:
        img = add_light(img, 666, 700, 160, (60, 90, 255) if lt >= 3 else (255, 40, 40), 0.55)
        d = D(img)
    d.rr((650 + ox, 670, 682 + ox, 730), 6, fill=(20, 20, 30), outline=(255, 50, 50) if 2 <= lt < 3 else INK, w=2)
    if lt >= 3:
        d.rr((654 + ox, 675, 678 + ox, 724), 4, fill=(120, 150, 255))
        for i in (1, 2):
            d.arc((630 - i * 10, 680 - i * 6, 650, 720 + i * 6), 120, 240, fill=(170, 190, 255), w=2)
    return img


def sc_face_bed(t, lt):
    img = Image.new("RGB", (W * K, H * K))
    d = wall(img)
    img = add_light(img, 380, 700, 520, (40, 50, 140), 0.6)
    d = D(img)
    d.ell((60, 480, 700, 900), fill=(105, 115, 200), outline=INK, w=3)
    eyes = "squint" if lt < 0.6 else ("open" if lt < 1.0 else "squint")
    character(d, 380, 690, 1.05, eyes=eyes, mouth="line" if lt < 1 else "frown", body=False,
              blink=(0.55 < lt < 0.65))
    d.poly([(0, 900), (W, 880), (W, H), (0, H)], fill=BLANKET, outline=INK, w=4)
    if lt >= 1.0:
        k = ease((lt - 1.0) / 0.4)
        layer = Image.new("RGBA", (W, H))
        txt = rich_text("*3:07*", 150, stroke=0, squeeze=0.9)
        txt = txt.rotate(4, resample=Image.BICUBIC, expand=True)
        paste_center(layer, txt, 380, 300, 0.9 + 0.1 * k, k)
        ld = ImageDraw.Draw(layer)
        drip = clamp((lt - 1.4) / 1.5)
        for i, (x, maxl) in enumerate([(300, 70), (352, 40), (420, 90), (470, 55)]):
            L = maxl * drip
            if L > 2:
                ld.line([(x, 350), (x, 350 + L)], fill=(230, 40, 40, 255), width=5)
                ld.ellipse((x - 5, 350 + L - 4, x + 5, 350 + L + 6), fill=(230, 40, 40, 255))
        big = layer.resize((W * K, H * K), Image.BILINEAR)
        img.paste(big.convert("RGB"), (0, 0), big)
    return img


def sc_phone_lock(t, lt):
    img = bokeh_bg(Image.new("RGB", (W * K, H * K)), t)
    scr = phone_body(img, t, shake=1.0 if lt < 0.4 else 0)
    s = vgrad((70, 46, 120), (30, 24, 62))
    img.paste(s, (0, 0), screen_mask(scr))
    d = D(img)
    ui_text(d, (360, 300), "jeudi 30 octobre", 15, (225, 220, 240), "Inter-Medium.otf")
    ui_text(d, (360, 368), "03:07", 76, (240, 238, 250), "Inter-Light.otf")
    k = ease(lt / 0.35)
    notif(d, scr, lerp(400, 462, k), alpha=k)
    d.rr((320, 228, 400, 250), 11, fill=(5, 5, 8))
    return img


def sc_phone_chat(t, lt, msgs, playing_idx, prog, banner=None, banner_k=0.0):
    img = bokeh_bg(Image.new("RGB", (W * K, H * K)), t)
    scr = phone_body(img, t, shake=1.0 if banner and banner_k < 1 and lt < 1.2 else 0)
    img.paste(Image.new("RGB", img.size, (16, 16, 20)), (0, 0), screen_mask(scr))
    d = D(img)
    d.rect((scr[0], 250, scr[2], 320), fill=(26, 26, 32))
    d.circ(360, 270, 15, fill=(110, 110, 120))
    ui_text(d, (360, 270), "M", 14, (245, 245, 250), "Inter-Bold.otf")
    ui_text(d, (360, 300), msgs[0][2], 10, (220, 220, 230), "Inter-Medium.otf")
    ui_text(d, (196, 270), "‹", 30, (10, 132, 255), "Inter-Regular.otf")
    ui_text(d, (360, 340), "Aujourd'hui 03:07", 9, (130, 130, 140), "Inter-Regular.otf")
    for i, (seed, dur, who) in enumerate(msgs):
        voice_bubble(d, 190, 362 + i * 64, 250, i == playing_idx, prog if i == playing_idx else 1.0, seed, dur)
    if banner:
        notif(d, scr, lerp(200, 236, ease(banner_k)), who=banner, alpha=ease(banner_k), light=True)
    d.rr((320, 228, 400, 250), 11, fill=(5, 5, 8))
    return img


def closeup(t, lt, eyes="open", mouth="line", tear=0.0, dim=0.0, hands=False, circle=None,
            glow=1.0, look=(0, 0)):
    img = vgrad((26, 30, 92), (34, 44, 140)).copy()
    img = add_light(img, 400, 1180, 620, (90, 110, 255), 0.55 * glow)
    d = D(img)
    bob = math.sin(t * 1.6) * 3
    character(d, 418, 598 + bob, 1.0, eyes=eyes, mouth=mouth, tear=tear, look=look,
              blink=(eyes == "open" and (t % 3.7) < 0.12), hands_phone=hands)
    img = add_light(img, 400, 1200, 520, (60, 80, 220), 0.45 * glow)
    if mouth == "stitch":
        img = neon(img, [[(442, 654 + bob), (502, 654 + bob)]], color=(255, 50, 50), width=2, glow=6, alpha=0.6)
    if circle is not None:
        k, face_k = circle
        cx, cy, r = 575, 330, 138
        ring = [(cx + r * math.cos(a) * (1 + 0.05 * math.sin(a * 3)),
                 cy + r * math.sin(a)) for a in np.linspace(-2.2, -2.2 + 2 * math.pi * 1.04, 120)]
        inner = [(cx - 40 + 70 * math.cos(a) * 0.6, cy + 20 + 80 * math.sin(a)) for a in np.linspace(0.5, 0.5 + 2 * math.pi, 60)]
        lines = [partial(ring, k)]
        if k > 0.6:
            lines.append(partial(inner, (k - 0.6) / 0.4))
        if face_k > 0:
            img = add_light(img, cx, cy, 200, (180, 30, 30), 0.5 * face_k)
            lines += [[(cx - 52, cy - 8), (cx - 24, cy - 6)], [(cx + 22, cy - 6), (cx + 50, cy - 8)],
                      open_spline([(cx - 50, cy + 40), (cx, cy + 70), (cx + 52, cy + 38)])]
        img = neon(img, lines, width=4, glow=10)
    if dim:
        img = Image.blend(img, Image.new("RGB", img.size, (4, 4, 12)), dim)
    return img


def sc_bed_side(t, lt, mood="worried", neon_k=1.0, snore=True, day=False, line_k=1.0):
    img = Image.new("RGB", (W * K, H * K))
    if day:
        d = wall(img, (150, 136, 171), (160, 146, 181))
        img = add_light(img, 520, 120, 600, (60, 40, 60), 0.6)
        d = D(img)
        d.rect((0, 590, 345, H), fill=(110, 68, 40), outline=INK, w=4)
        pal = DAY
    else:
        d = wall(img)
        d.rect((0, 590, 345, H), fill=(58, 36, 44), outline=INK, w=4)
        pal = NIGHT
    eyes, mouth, look = {"worried": ("squint", "line", (6, 0)),
                         "scared": ("dots", "stitch", (10, 0)),
                         "breath": ("squint", "stitch", (8, 0)),
                         "happy": ("happy", "smile", (0, 0)),
                         "suspect": ("squint", "line", (10, 0)),
                         "shock": ("dots", "o", (12, 0))}[mood]
    character(d, 195, 820, 0.62, eyes=eyes, mouth=mouth, pal=pal, body=False, look=look)
    bl = (196, 76, 46) if day else BLANKET
    d.poly([(0, 1000), (420, 985), (470, 1060), (470, H), (0, H)], fill=bl, outline=INK, w=4)
    d.poly([(420, 985), (W, 985), (W, H), (470, H), (470, 1060)], fill=(130, 70, 40) if day else (52, 30, 36))
    # neon: the sleeping figure behind the wall
    wl = [(420, 600), (700, 600), (700, 470)]
    figure = [open_spline([(430, 600), (470, 560), (515, 555), (560, 585), (610, 580), (640, 590)]),
              [(653 + 24 * math.cos(a), 578 + 22 * math.sin(a)) for a in np.linspace(0, 2 * math.pi, 40)],
              [(643, 575), (650, 575)], [(658, 575), (665, 575)],
              [(445, 600), (445, 572)]]
    br = 1 + 0.04 * math.sin(t * 2.2)
    figure = [[(x, 600 - (600 - y) * br) for x, y in pl] for pl in figure]
    img = neon(img, [partial(wl, line_k)], width=3.5, glow=8)
    if neon_k > 0:
        img = neon(img, figure, width=3.5, glow=9, alpha=neon_k)
    d = D(img)
    if snore and neon_k > 0.5:
        for i in range(2):
            ph = (t * 0.45 + i * 0.5) % 1
            c = mix(WALL if not day else (150, 136, 171), (190, 190, 210), math.sin(ph * math.pi) * 0.8)
            d.arc((520 + i * 34, 470 - ph * 30, 560 + i * 34, 560 - ph * 30), 200, 300, fill=c, w=2)
    return img


def sc_title(t, lt):
    img = Image.new("RGB", (W * K, H * K), (6, 4, 6))
    img = add_light(img, 360, 620, 420, (120, 10, 10), 0.8 + 0.15 * math.sin(t * 5))
    return img


def sc_door(t, lt, light_k=1.0, feet=0.0, peek=True):
    img = Image.new("RGB", (W * K, H * K))
    d = wall(img)
    d.rect((0, 1000, W, H), fill=(36, 26, 36))
    d.rect((180, 302, 540, 1010), fill=(30, 22, 30))
    d.rect((198, 320, 522, 1007), fill=(46, 36, 42), outline=INK, w=3)
    d.rect((222, 345, 498, 980), outline=(56, 44, 52), w=3)
    d.circ(512, 690, 8, fill=(140, 150, 175))
    d.rect((480, 686, 512, 694), fill=(140, 150, 175))
    if light_k > 0:
        gl = Image.new("L", (W * K, H * K), 0)
        gd = ImageDraw.Draw(gl)
        gd.polygon([(200 * K, 1005 * K), (520 * K, 1005 * K), (650 * K, 1280 * K), (70 * K, 1280 * K)],
                   fill=int(150 * light_k))
        gl = gl.filter(ImageFilter.GaussianBlur(18 * K))
        img = Image.composite(Image.new("RGB", img.size, (230, 172, 96)), img, gl)
        d = D(img)
        d.rect((200, 1002, 520, 1008), fill=mix((46, 36, 42), (255, 214, 140), light_k))
        if feet > 0:
            for fx in (318, 392):
                d.poly([(fx, 1008), (fx + 22, 1008), (fx + 30 + 30 * feet, 1280), (fx - 18 - 30 * feet, 1280)],
                       fill=(28, 22, 26))
    if peek:
        d.ell((-60, 1180, 300, 1400), fill=BLANKET, outline=INK, w=3)
        character(d, 140, 1235, 0.38, eyes="squint", mouth="line", body=False, look=(10, 0))
        d.poly([(0, 1260), (330, 1240), (330, 1280), (0, 1280)], fill=BLANKET, outline=INK, w=3)
    return img


def sc_hiding(t, lt, eyes="squint", zz=0.0, look=(0, 0)):
    img = Image.new("RGB", (W * K, H * K))
    d = wall(img)
    d.ell((60, 820, 900, 1040), fill=(105, 115, 200), outline=INK, w=3)
    character(d, 410, 905, 0.92, eyes=eyes, mouth="line", body=False, look=look)
    d.poly([(0, 930), (W, 925), (W, H), (0, H)], fill=BLANKET, outline=INK, w=4)
    for hx in (300, 470):
        for i in range(4):
            d.rr((hx + i * 18, 905, hx + i * 18 + 16, 950), 7, fill=(98, 110, 200), outline=INK, w=2.5)
    if zz > 0:
        for i, (dx, dy, sz) in enumerate([(0, 0, 34), (40, -50, 44), (90, -110, 56)]):
            if zz > i * 0.3:
                x, y = 560 + dx, 720 + dy
                d.line([(x, y), (x + sz, y), (x, y + sz), (x + sz, y + sz)], fill=(235, 50, 50), w=6)
    return img


def sc_handle(t, lt):
    img = Image.new("RGB", (W * K, H * K))
    d = D(img)
    d.rect((0, 0, W, H), fill=(56, 42, 40))
    for x in range(0, W, 120):
        d.line([(x, 0), (x, H)], fill=(46, 34, 34), w=3)
    img = add_light(img, 262, 790, 220, (120, 90, 20), 0.6)
    d = D(img)
    d.rr((198, 457, 326, 888), 22, fill=(62, 72, 120), outline=INK, w=4)
    ang = math.radians(32 * ease((lt - 0.5) / 2.3))
    px, py = 262, 595
    L = 240
    ex, ey = px + L * math.cos(ang), py + L * math.sin(ang)
    d.line([(px, py), (ex, ey)], fill=INK, w=40)
    d.line([(px, py), (ex, ey)], fill=(78, 92, 160), w=32)
    d.circ(px, py, 40, fill=(70, 82, 140), outline=INK, w=4)
    d.circ(262, 782, 14, fill=(255, 205, 80))
    d.poly([(254, 790), (270, 790), (274, 822), (250, 822)], fill=(255, 205, 80))
    return img


def sc_cave(t, lt, marks=0, knock=0.0):
    img = Image.new("RGB", (W * K, H * K), (6, 5, 5))
    d = D(img)
    d.poly([(0, 0), (252, 504), (252, 882), (0, H)], fill=(30, 24, 18))
    d.poly([(W, 0), (468, 504), (468, 882), (W, H)], fill=(26, 20, 16))
    d.poly([(0, H), (252, 882), (468, 882), (W, H)], fill=(52, 34, 24))
    d.poly([(0, 0), (252, 504), (468, 504), (W, 0)], fill=(10, 8, 8))
    img = add_light(img, 360, 900, 380, (160, 40, 10), 0.75)
    d = D(img)
    sx = math.sin(t * 120) * 4 * knock
    d.rect((262 + sx, 504, 458 + sx, 882), fill=(70, 48, 30), outline=(120, 82, 50), w=4)
    d.rect((280 + sx, 530, 440 + sx, 690), outline=(96, 66, 42), w=3)
    d.rect((280 + sx, 710, 440 + sx, 860), outline=(96, 66, 42), w=3)
    d.rect((262 + sx, 872, 458 + sx, 882), fill=(255, 90, 40))
    if marks:
        xs = [360] if marks == 1 else [330, 360, 390]
        img = neon(img, [[(x + sx, 600), (x + sx, 700)] for x in xs], color=(255, 30, 30), width=5, glow=8)
    return img


def sc_sitting(t, lt, idx):
    img = Image.new("RGB", (W * K, H * K))
    d = wall(img)
    sky_k = clamp((idx - 4) / 4.5)
    d.rect((396, 190, 684, 515), fill=(80, 90, 200), outline=INK, w=3)
    sky = vgrad(mix((14, 18, 52), (90, 110, 190), sky_k), mix((14, 18, 52), (210, 150, 120), sky_k), 300 * K, 128 * K)
    img.paste(sky, (408 * K, 202 * K))
    img.paste(sky, (548 * K, 202 * K))
    d = D(img)
    if idx >= 6:
        sun_k = clamp((idx - 6) / 2)
        if idx >= 7:
            img = add_light(img, 615, 460, 160, (255, 200, 80), 0.45 * sun_k)
            d = D(img)
            d.circ(615, 470, 22, fill=(250, 200, 70))
        else:
            img = neon(img, [[(615 + 20 * math.cos(a), 455 + 20 * math.sin(a)) for a in np.linspace(0, 6.3, 30)]]
                       + [[(615 + 30 * math.cos(a), 455 + 30 * math.sin(a)), (615 + 40 * math.cos(a), 455 + 40 * math.sin(a))]
                          for a in np.linspace(3.4, 5.2, 4)], width=3, glow=6)
    d = D(img)
    d.rect((0, 700, 430, H), fill=(58, 36, 44), outline=INK, w=4)
    character(d, 300, 790, 0.5, eyes="open" if idx % 3 else "squint", mouth="stitch", look=(4, 0))
    d.rr((225, 905, 365, 990), 10, fill=(20, 20, 26), outline=INK, w=3)
    for hx in (205, 340):
        d.rr((hx, 925, hx + 44, 975), 18, fill=(98, 110, 200), outline=INK, w=2.5)
    img = add_light(img, 295, 890, 260, (60, 80, 220), 0.5)
    d = D(img)
    d.poly([(0, 985), (W, 965), (W, H), (0, H)], fill=BLANKET, outline=INK, w=4)
    for xx in (180, 380, 560):
        d.line([(xx, 990), (xx - 40, H)], fill=BLANKET_D, w=2)
    return img


def sc_call(t, lt):
    img = bokeh_bg(Image.new("RGB", (W * K, H * K)), t)
    ringing = lt < 2.0
    scr = phone_body(img, t, shake=0.7 if ringing and (lt % 0.6) < 0.3 else 0)
    img.paste(vgrad((40, 46, 62), (14, 16, 24)), (0, 0), screen_mask(scr))
    d = D(img)
    ui_text(d, (350, 415), "Maman", 30, (235, 235, 240), "Inter-Light.otf")
    hx, hy = 420, 412
    d.circ(hx - 6, hy - 4, 7, fill=(240, 50, 60))
    d.circ(hx + 6, hy - 4, 7, fill=(240, 50, 60))
    d.poly([(hx - 13, hy - 1), (hx + 13, hy - 1), (hx, hy + 13)], fill=(240, 50, 60))
    sub = "appel entrant..." if ringing else f"00:{int(lt - 2):02d}"
    ui_text(d, (360, 452), sub, 11, (170, 170, 180), "Inter-Regular.otf")
    d.circ(360, 560, 44, fill=(110, 112, 122))
    ui_text(d, (360, 560), "M", 40, (245, 245, 250), "Inter-SemiBold.otf")
    if ringing:
        d.circ(270, 800, 34, fill=(240, 60, 50))
        d.circ(450, 800, 34, fill=(50, 200, 90))
        pulse = (lt % 1.0)
        d.circ(450, 800, 34 + 20 * pulse, outline=mix((16, 16, 22), (50, 200, 90), 1 - pulse), w=3)
    else:
        for i, lab in enumerate(["silence", "clavier", "HP"]):
            x = 280 + i * 80
            d.circ(x, 660, 26, fill=(70, 72, 82))
            ui_text(d, (x, 700), lab, 8, (170, 170, 180), "Inter-Regular.otf")
        d.circ(360, 810, 34, fill=(240, 60, 50))
    d.rr((320, 228, 400, 250), 11, fill=(5, 5, 8))
    return img


def sc_end(t, lt):
    img = Image.new("RGB", (W * K, H * K), (8, 7, 10))
    img = add_light(img, 360, 700, 380, (40, 10, 14), 0.6)
    return img


# --------------------------------------------------------------------------
# timeline
# --------------------------------------------------------------------------
def scene_at(t):
    """Return (image2x, location, show_clock, zoom, shake)."""
    loc, clock, zoom, shake = "CHAMBRE", True, 0.0, 0.0
    if t < 4:
        img, zoom = sc_bedroom_wide(t, t), t / 4 * 0.04
        shake = 0.3 if 2 <= t < 4 else 0
    elif t < 7:
        img, zoom = sc_face_bed(t, t - 4), (t - 4) / 3 * 0.05
    elif t < 10:
        img = sc_phone_lock(t, t - 7)
    elif t < 12:
        img = sc_phone_chat(t, t - 10, [(1, 4, "Maman")], 0, clamp((t - 10) / 1.6))
    elif t < 16:
        lt = t - 12
        img = closeup(t, lt, eyes="open" if lt < 1 else "dots", mouth="line" if lt < 1 else "o",
                      tear=clamp((lt - 1) / 3) if lt >= 1 else 0)
        zoom = lt / 4 * 0.06
    elif t < 18.4:
        img = sc_bed_side(t, t - 16, "worried")
    elif t < 19:
        img = sc_bed_side(t, t - 16, "shock")
    elif t < 21:
        img, clock = sc_title(t, t - 19), False
    elif t < 28:
        lt = t - 21
        prog = clamp((t - 25) / 2.6)
        img = sc_phone_chat(t, lt, [(1, 4, "Maman"), (2, 7, "Maman")], 1 if t >= 25 else -1, prog,
                            banner="Maman" if lt < 1.6 else None, banner_k=clamp(lt / 0.3))
    elif t < 32:
        lt = t - 28
        img = closeup(t, lt, eyes="squint" if lt < 1 else "dots", mouth="line" if lt < 1 else "stitch")
        zoom = lt / 4 * 0.05
    elif t < 39:
        lt = t - 32
        mood = "breath" if lt < 6 else "scared"
        nk = 1.0 if t < 38 else clamp(1 - (t - 38) / 0.4)
        img = sc_bed_side(t, lt, mood, neon_k=nk)
        zoom = lt / 7 * 0.04
    elif t < 44:
        img = sc_door(t, t - 39, light_k=ease((t - 39.3) / 0.8))
        zoom = (t - 39) / 5 * 0.05
    elif t < 45:
        img = sc_hiding(t, t - 44, eyes="dots", look=(8, 0))
    elif t < 47:
        img = sc_door(t, t - 45, feet=ease((t - 45) / 0.6))
        zoom = 0.05 + (t - 45) / 2 * 0.04
    elif t < 51:
        lt = t - 47
        img = sc_hiding(t, lt, eyes="dots" if lt < 2.8 else "shut", zz=clamp((lt - 3) / 0.8),
                        look=(0, 0) if lt < 1 else (8 * math.sin(lt * 2), 0))
    elif t < 55:
        img, zoom = sc_handle(t, t - 51), (t - 51) / 4 * 0.06
    elif t < 61:
        lt = t - 55
        loc = "CAVE"
        kn = 0
        for kt in (57.15, 57.5, 59.05, 59.4, 59.75):
            if 0 <= t - kt < 0.18:
                kn = 1 - (t - kt) / 0.18
        img = sc_cave(t, lt, marks=0 if t < 59.05 else (1 if t < 59.75 else 3), knock=kn)
        zoom, shake = lt / 6 * 0.08, kn * 1.2
    elif t < 69:
        lt = t - 61
        circ = None
        if t >= 65.3:
            circ = (clamp((t - 65.3) / 1.4), clamp((t - 67.4) / 0.5))
        img = closeup(t, lt, eyes="squint" if t < 64 else "dots", mouth="stitch", hands=True, circle=circ,
                      glow=1.4 if (t < 63.5 and (t * 6) % 1 < 0.5) else 1.0)
        shake = 0.25 if t < 63.5 else 0
        zoom = lt / 8 * 0.05
    elif t < 70:
        img = sc_phone_chat(t, t - 69, [(9, 3, "Moi")], 0, clamp(t - 69), banner="Moi", banner_k=1.0)
    elif t < 72:
        img = closeup(t, t - 70, eyes="dots", mouth="stitch", tear=0.0)
        zoom = 0.04 + (t - 70) / 2 * 0.04
    elif t < 74:
        img = closeup(t, t - 72, eyes="dots", mouth="stitch", dim=0.6)
    elif t < 75:
        img = sc_sitting(t, 0, 0)
    elif t < 84:
        img = sc_sitting(t, t - 75, int(t - 75))
    elif t < 93:
        img = sc_call(t, t - 84)
    elif t < 98:
        img = sc_bed_side(t, t - 93, "happy", neon_k=0, day=True)
        zoom = (t - 93) / 5 * 0.03
    elif t < 99:
        img = sc_bed_side(t, t - 93, "suspect", neon_k=0, day=True)
    elif t < 101:
        img = sc_bed_side(t, t - 93, "shock", neon_k=clamp((t - 99) / 0.5), day=True)
        zoom, shake = 0.04 + (t - 99) * 0.06, 0.3
    else:
        img, clock = sc_end(t, t - 101), False
    return img, loc, clock, zoom, shake


CAPTIONS = [
    (0, 2, "*IMAGINE...*"), (2, 3, "TON ~TÉLÉPHONE~"), (3, 4, "*VIBRE.*"),
    (4, 5.3, "IL EST *TROIS HEURES*"), (5.3, 7, "SEPT DU MATIN."),
    (7, 9, "UN MESSAGE *VOCAL...*"), (9, 10, "DE TA *MÈRE.*"),
    (10, 11.5, "« NE DESCENDS *PAS...* »"),
    (12, 13, "« JE SUIS *ENFERMÉE* »"), (13, 14, "« DANS LA *CAVE.* »"), (14, 16, "SAUF ~QUE...~"),
    (16, 18, "TU L'ENTENDS *RONFLER.*"), (18, 19, "*À CÔTÉ.*"),
    (22, 23, "TON ~TÉLÉPHONE~"), (23, 24, "*VIBRE* ENCORE."), (24, 26, "UN *DEUXIÈME VOCAL.*"),
    (26, 28, "« CELLE QUI DORT *À CÔTÉ...* »"),
    (28, 29.4, "« CE N'EST *PAS MOI.* »"), (29.4, 30.4, "« SURTOUT... »"), (30.4, 32, "« NE LA *RÉVEILLE* PAS. »"), (33, 34, "TU RETIENS ~TON~"), (34, 35, "*SOUFFLE.*"),
    (35, 36, "ET ~DERRIÈRE~ LE"), (36, 37, "MUR..."), (37, 38, "LE *RONFLEMENT*"), (38, 39, "S'ARRÊTE."),
    (39, 40, "UNE *PORTE GRINCE*", "top"), (40, 42, "DANS LE COULOIR.", "top"),
    (42, 43, "DES *PAS.*", "top"), (43, 44, "*LENTS.*", "top"), (44, 45, "*LENTS.*"),
    (45, 46, "ILS S'ARRÊTENT...", "top"), (46, 47, "DEVANT TA *PORTE.*", "top"),
    (48, 49, "« MON *CHÉRI ?* »"), (49, 50, "« TU *DORS ?* »"),
    (51, 53, "LA *POIGNÉE* TOURNE..."), (53, 54.5, "DOUCEMENT."),
    (55, 56, "ET TOUT EN *BAS,*"), (56, 57, "DANS LA *CAVE...*"), (57, 59, "QUELQU'UN *FRAPPE.*"),
    (59, 60.5, "*TROIS COUPS.*"),
    (61, 62, "TON ~TÉLÉPHONE~"), (62, 63, "*VIBRE* UNE DERNIÈRE"), (63, 64, "FOIS."),
    (64, 66, "UN *TROISIÈME VOCAL.*"), (66, 68, "MAIS CETTE VOIX-LÀ..."), (68, 69, "C'EST LA *TIENNE.*"),
    (69.7, 72, "« NE RÉPONDS À *AUCUNE* DES DEUX ! »"),
    (75, 76, "ALORS TU NE"), (76, 77, "RÉPONDS *PAS.*"), (77, 78, "TU NE BOUGES"), (78, 79, "PLUS."),
    (79, 80, "TU NE RESPIRES"), (80, 81, "PLUS."), (81, 82, "JUSQU'AU ~LEVER~"), (82, 84, "DU *SOLEIL.*"),
    (87, 88, "« MON *CHÉRI ?* »", "phone"), (88, 89, "« C'EST *MAMAN.* »", "phone"),
    (89, 90, "« MON *AVION* VIENT »", "phone"), (90, 91, "D'ATTERRIR. »", "phone"),
    (91, 92.6, "« JE SERAI LÀ DANS UNE ~HEURE.~ »", "phone"),
    (93, 94, "TA *MÈRE* ÉTAIT"), (94, 96, "PARTIE TOUTE LA *SEMAINE.*"), (96, 98, "ET DANS LA CHAMBRE D'À *CÔTÉ...*"),
    (99, 100, "LE *RONFLEMENT*"), (100, 101, "*REPREND.*"),
]
PHONE_SCENES = [(7, 12), (21, 28), (69, 70), (84, 93)]
LAPSE = ["03:15:06", "03:33:17", "03:59:53", "04:32:02", "05:06:51", "05:41:26", "06:12:54", "06:38:23", "06:54:59"]


def clock_text(t):
    if t < 75:
        s = 3 * 3600 + 7 * 60 + int(t)
    elif t < 84:
        return LAPSE[int(t - 75)]
    else:
        s = 7 * 3600 + int(t - 84)
    return f"{s // 3600:02d}:{s // 60 % 60:02d}:{s % 60:02d}"


@lru_cache(maxsize=256)
def cap_image(text):
    quote = text.startswith("«") or text.endswith("»")
    base = (196, 224, 255) if quote else (255, 255, 255)
    grey = (150, 170, 205) if quote else (200, 200, 212)
    return rich_text(text, 82, base=base, grey=grey)


def overlay(frame, t):
    """1x overlay layer: clock, captions, title cards, banner, flash."""
    img = frame.convert("RGBA")
    d = ImageDraw.Draw(img)
    _, loc, clock, _, _ = TL_META(t)
    if clock:
        lbl = f"NUIT 1  ·  {loc}"
        f1 = font("Inter-Bold.otf", 17)
        wlab = f1.getlength(lbl)
        x0 = 360 - (wlab + 20) / 2
        if (t % 1.2) < 0.8:
            d.ellipse((x0, 87, x0 + 10, 97), fill=(255, 64, 56))
        d.text((x0 + 20, 92), lbl, font=f1, fill=(225, 225, 235), anchor="lm")
        d.text((360, 142), clock_text(t), font=font("Inter-Bold.otf", 46), fill=(250, 250, 252),
               anchor="mm", stroke_width=1, stroke_fill=(20, 20, 30))
    for c in CAPTIONS:
        s, e, txt = c[:3]
        pos = c[3] if len(c) > 3 else None
        if s <= t < e and txt:
            lt = t - s
            sc = 1.0 + 0.18 * (1 - ease(lt / 0.12))
            y = 248 if pos == "top" else (1060 if pos == "phone" or any(a <= t < b for a, b in PHONE_SCENES) else 1035)
            ci = cap_image(txt)
            if ci.width > 680:
                sc *= 680 / ci.width
            paste_center(img, ci, 360, y, sc, alpha=clamp(lt / 0.06))
    # title card
    if 19 <= t < 21:
        k = ease((t - 19) / 0.3)
        t1 = rich_text("*NUIT 1*", 120, stroke=0, red=(240, 40, 36))
        glow = t1.filter(ImageFilter.GaussianBlur(14))
        paste_center(img, glow, 360, 600, 1.0, k)
        paste_center(img, t1, 360, 600, 1.0 + 0.05 * (1 - k), k)
        paste_center(img, rich_text("LE VOCAL", 62, stroke=0, base=(236, 230, 230)), 360, 690, 1.0, k)
        d.text((360, 752), "NIGHT 1 · THE VOICEMAIL", font=font("Inter-SemiBold.otf", 15),
               fill=mix((6, 4, 6), (170, 150, 150), k), anchor="mm")
    # rule banner
    if 72 <= t < 74:
        k = ease((t - 72) / 0.18)
        ban = Image.new("RGBA", (780, 270), (240, 64, 52, 255))
        bd = ImageDraw.Draw(ban)
        paste_center(ban, rich_text("RÈGLE N°1", 64, base=(28, 10, 10), stroke=0), 390, 62)
        paste_center(ban, rich_text("NE RÉPONDS JAMAIS À UNE VOIX", 54, stroke=0), 390, 136)
        paste_center(ban, rich_text("QUE TU NE VOIS PAS", 54, stroke=0), 390, 196)
        bd.text((390, 246), "RULE #1 · NEVER ANSWER A VOICE YOU CAN'T SEE", font=font("Inter-SemiBold.otf", 13),
                fill=(255, 225, 220), anchor="mm")
        paste_center(img, ban, 360 + (1 - k) * -720, 648, 1.0, 1.0, angle=2.5)
    # end card
    if t >= 101:
        lt = t - 101
        paste_center(img, rich_text("NUIT 1", 74, stroke=0), 360, 600, 1, ease(lt / 0.4))
        paste_center(img, rich_text("LE VOCAL", 48, stroke=0, base=(200, 200, 205)), 360, 668, 1, ease(lt / 0.4))
        if lt > 0.8:
            k = ease((lt - 0.8) / 0.25)
            fin = Image.new("RGBA", (420, 260), (0, 0, 0, 0))
            fd = ImageDraw.Draw(fin)
            fd.text((210, 110), "FIN", font=font("InterDisplay-BlackItalic.otf", 150), fill=(232, 30, 30),
                    anchor="mm")
            drip = clamp((lt - 1.1) / 1.5)
            for x, ml in [(110, 60), (160, 36), (250, 74), (300, 48)]:
                L = ml * drip
                if L > 1:
                    fd.line([(x, 160), (x, 160 + L)], fill=(232, 30, 30), width=7)
                    fd.ellipse((x - 6, 154 + L, x + 6, 166 + L), fill=(232, 30, 30))
            paste_center(img, fin, 360, 800, 1.25 - 0.25 * k, k, angle=-3)
    return img.convert("RGB")


_meta_cache = {}


def TL_META(t):
    return _meta_cache[t]


def postfx(img1x, t, flash=0.0, glitch=0.0, fade=0.0):
    a = np.asarray(img1x).astype(np.float32)
    a *= vignette()
    a += grains()[int(t * FPS) % 6]
    if glitch > 0:
        shift = int(10 * glitch)
        a[..., 0] = np.roll(a[..., 0], shift, axis=1)
        a[..., 2] = np.roll(a[..., 2], -shift, axis=1)
    if flash > 0:
        a = a * (1 - flash) + 235 * flash
    if fade > 0:
        a *= (1 - fade)
    return Image.fromarray(np.clip(a, 0, 255).astype(np.uint8), "RGB")


def render_frame(i):
    t = i / FPS
    img2x, loc, clock, zoom, shake = scene_at(t)
    _meta_cache[t] = (None, loc, clock, zoom, shake)
    z = 1 + zoom
    cw, ch = W * K / z, H * K / z
    rnd = random.Random(i)
    sx = (rnd.random() - 0.5) * 2 * shake * 10 * K
    sy = (rnd.random() - 0.5) * 2 * shake * 10 * K
    if shake:
        z = max(z, 1 + 2 * shake * 10 * K / (W * K))
        cw, ch = W * K / z, H * K / z
    x0 = min(max(0, (W * K - cw) / 2 + sx), W * K - cw)
    y0 = min(max(0, (H * K - ch) / 2 + sy), H * K - ch)
    frame = img2x.resize((W, H), Image.LANCZOS, box=(x0, y0, x0 + cw, y0 + ch))
    # scene-change fades / flashes
    flash = glitch = fade = 0.0
    if 18 <= t < 19:
        flash = 0.82 * (1 - ease((t - 18) / 0.9)) + 0.1
        glitch = 1.0 if (i % 4) < 2 else 0.4
    if 18.85 <= t < 19.15:
        fade = 1.0
    if 74 <= t < 75:
        fade = 1 - abs(t - 74.5) * 2
    if 100.8 <= t < 101.1:
        fade = 1.0
    for cut in (4, 7, 12, 16, 21, 28, 32, 39, 51, 55, 61, 84, 93):
        if 0 <= t - cut < 0.12:
            fade = max(fade, 1 - (t - cut) / 0.12)
    if 66.8 <= t < 67.4 and (i % 3 == 0):
        glitch = 0.6
    if 99 <= t < 99.15:
        flash = 0.5
    if t > DURATION - 0.6:
        fade = max(fade, clamp((t - (DURATION - 0.6)) / 0.6))
    frame = overlay(frame, t)
    frame = postfx(frame, t, flash, glitch, fade)
    _meta_cache.pop(t, None)
    return frame.tobytes()


def main():
    if len(sys.argv) >= 2 and sys.argv[1] == "--still":
        t = float(sys.argv[2])
        i = int(round(t * FPS))
        Image.frombytes("RGB", (W, H), render_frame(i)).save(sys.argv[3])
        return
    out = sys.argv[1] if len(sys.argv) > 1 else "video.mp4"
    n = int(DURATION * FPS)
    ff = subprocess.Popen(["ffmpeg", "-y", "-v", "error", "-f", "rawvideo", "-pix_fmt", "rgb24",
                           "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-", "-c:v", "libx264",
                           "-preset", "medium", "-crf", "23", "-pix_fmt", "yuv420p", out],
                          stdin=subprocess.PIPE)
    with Pool(os.cpu_count()) as pool:
        for k, fr in enumerate(pool.imap(render_frame, range(n), chunksize=8)):
            ff.stdin.write(fr)
            if k % 300 == 0:
                print(f"frame {k}/{n}", flush=True)
    ff.stdin.close()
    ff.wait()


if __name__ == "__main__":
    main()
