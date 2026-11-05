"""
Route 9 cast added from Episode 7 on: Dani, Milo, Boone, and Mom in Episode 10 (original designs).
exec()'d into an episode's scenes.py namespace, which already has the engine helpers
(D, INK, SKIN, math, ...). Same stick-figure language as `stick()` in the engine.
"""


def person(d, x, y, s=1.0, who="dani", face="neutral", look=0, pose="stand", arms="down", t=0.0, tint=None,
           item=None):
    """who: dani | milo | boone | mom. (x, y) = head centre."""
    r = 34 * s
    lw = 5 * s
    skin = tint or SKIN
    neck = (x, y + r)
    hip = (x, y + r + (80 if pose == "sit" else 92) * s)
    top = {"dani": (64, 118, 72), "milo": (190, 52, 46), "boone": (110, 112, 118), "mom": (120, 80, 150)}[who]
    d.poly([(x - 26 * s, neck[1] + 6 * s), (x + 26 * s, neck[1] + 6 * s), (x + 30 * s, hip[1] + 4 * s),
            (x - 30 * s, hip[1] + 4 * s)], fill=top, outline=INK, w=3 * s)
    if who == "dani":
        d.line([(x, neck[1] + 10 * s), (x, hip[1])], fill=(44, 90, 52), w=2 * s)
        for side in (-1, 1):
            d.rect((x + side * 14 * s - 4 * s, neck[1] + 40 * s, x + side * 14 * s + 4 * s, neck[1] + 48 * s),
                   fill=(220, 220, 210))
    if who == "boone":
        d.poly([(x - 26 * s, neck[1] + 6 * s), (x - 6 * s, neck[1] + 6 * s), (x - 8 * s, hip[1] + 4 * s),
                (x - 30 * s, hip[1] + 4 * s)], fill=(250, 128, 30), outline=INK, w=2.5 * s)
        d.poly([(x + 6 * s, neck[1] + 6 * s), (x + 26 * s, neck[1] + 6 * s), (x + 30 * s, hip[1] + 4 * s),
                (x + 8 * s, hip[1] + 4 * s)], fill=(250, 128, 30), outline=INK, w=2.5 * s)
        for yy in (0.45, 0.75):
            yv = neck[1] + (hip[1] - neck[1]) * yy
            d.line([(x - 28 * s, yv), (x - 7 * s, yv)], fill=(230, 230, 220), w=4 * s)
            d.line([(x + 7 * s, yv), (x + 28 * s, yv)], fill=(230, 230, 220), w=4 * s)
    # legs
    if pose == "stand":
        sw = math.sin(t * 2) * 2 * s
        d.line([hip, (x - 18 * s + sw, hip[1] + 78 * s)], fill=INK, w=lw)
        d.line([hip, (x + 18 * s - sw, hip[1] + 78 * s)], fill=INK, w=lw)
    elif pose == "sit":
        d.line([hip, (x - 46 * s, hip[1] + 6 * s), (x - 30 * s, hip[1] + 40 * s)], fill=INK, w=lw)
        d.line([hip, (x + 46 * s, hip[1] + 6 * s), (x + 30 * s, hip[1] + 40 * s)], fill=INK, w=lw)
    sh = (x, neck[1] + 14 * s)
    if arms == "down":
        d.line([(sh[0] - 20 * s, sh[1]), (x - 40 * s, sh[1] + 70 * s)], fill=INK, w=lw)
        d.line([(sh[0] + 20 * s, sh[1]), (x + 40 * s, sh[1] + 70 * s)], fill=INK, w=lw)
    elif arms == "megaphone":
        d.line([(sh[0] - 20 * s, sh[1]), (x - 40 * s, sh[1] + 70 * s)], fill=INK, w=lw)
        d.line([(sh[0] + 20 * s, sh[1]), (x + 44 * s, sh[1] - 2 * s), (x + 40 * s, y + 6 * s)], fill=INK, w=lw)
    elif arms == "hug":
        d.line([(sh[0] - 20 * s, sh[1]), (x - 20 * s, sh[1] + 40 * s), (x + 10 * s, sh[1] + 30 * s)], fill=INK, w=lw)
        d.line([(sh[0] + 20 * s, sh[1]), (x + 20 * s, sh[1] + 40 * s), (x - 10 * s, sh[1] + 30 * s)], fill=INK, w=lw)
    elif arms == "cap":
        d.line([(sh[0] - 20 * s, sh[1]), (x - 26 * s, sh[1] + 40 * s), (x + 6 * s, sh[1] + 44 * s)], fill=INK, w=lw)
        d.line([(sh[0] + 20 * s, sh[1]), (x + 26 * s, sh[1] + 40 * s), (x + 12 * s, sh[1] + 44 * s)], fill=INK, w=lw)
        d.ell((x - 20 * s, sh[1] + 32 * s, x + 30 * s, sh[1] + 56 * s), fill=(40, 70, 150), outline=INK, w=2 * s)
    # head
    if who == "dani":
        for side in (-1, 1):
            bx = x + side * r * 0.95
            d.line([(bx, y), (bx + side * 4 * s, y + r * 1.9)], fill=(70, 46, 30), w=9 * s)
            d.circ(bx + side * 4 * s, y + r * 1.9, 5 * s, fill=(220, 60, 90))
    d.circ(x, y, r, fill=skin, outline=INK, w=3.5 * s)
    lx = look * 8 * s
    if who == "mom":
        d.d.chord([v * K for v in (x - r * 1.12, y - r * 1.12, x + r * 1.12, y + r * 1.0)], 180, 360, fill=(120, 104, 92))
        for side in (-1, 1):
            d.rr((x + side * r * 0.82 - 7 * s, y - 6 * s, x + side * r * 0.82 + 7 * s, y + r * 0.7), 6 * s,
                 fill=(120, 104, 92))
    if who == "dani":
        d.arc((x - r, y - r, x + r, y + r), 180, 360, fill=(70, 46, 30), w=10 * s)
        d.line([(x - r * 0.6, y - r * 0.82), (x + r * 0.2, y - r * 0.55)], fill=(70, 46, 30), w=6 * s)
    elif who == "milo":
        d.poly([(x - r * 1.05, y - 4 * s), (x - r * 0.9, y - r * 0.95), (x, y - r * 1.25), (x + r * 0.9, y - r * 0.95),
                (x + r * 1.05, y - 4 * s)], fill=(40, 70, 150), outline=INK, w=3 * s)
        d.poly([(x - r * 0.2 + lx, y - 8 * s), (x + r * 1.7 + lx, y - 2 * s), (x + r * 1.6 + lx, y + 6 * s),
                (x - r * 0.2 + lx, y + 2 * s)], fill=(30, 56, 126), outline=INK, w=2.5 * s)
        d.circ(x, y - r * 1.22, 5 * s, fill=(240, 240, 240))
    elif who == "boone":
        d.poly([(x - r * 1.15, y - 6 * s), (x - r * 0.9, y - r * 0.9), (x, y - r * 1.3), (x + r * 0.9, y - r * 0.9),
                (x + r * 1.15, y - 6 * s)], fill=(250, 206, 40), outline=INK, w=3 * s)
        d.rr((x - r * 1.3, y - 12 * s, x + r * 1.3, y - 2 * s), 4 * s, fill=(236, 190, 30), outline=INK, w=2.5 * s)
        d.line([(x, y - r * 1.28), (x, y - 10 * s)], fill=(236, 190, 30), w=6 * s)
        d.d.chord([v * K for v in (x - r * 0.95, y - r * 0.2, x + r * 0.95, y + r * 1.05)], 0, 180, fill=(96, 62, 38))
    ey = y + 2 * s
    if face in ("neutral", "worried", "smile", "o", "scared", "sad"):
        er = 6 * s if face == "scared" else 4.2 * s
        for ex in (-12, 12):
            d.circ(x + ex * s + lx, ey, er, fill=INK)
    elif face == "sleep":
        for ex in (-12, 12):
            d.arc((x + ex * s - 6 * s, ey - 4 * s, x + ex * s + 6 * s, ey + 4 * s), 0, 180, fill=INK, w=2.5 * s)
    my = y + (16 if who == "boone" else 18) * s
    mouth_col = (240, 230, 220) if who == "boone" else INK
    if face in ("neutral", "sleep"):
        d.line([(x - 8 * s + lx, my), (x + 8 * s + lx, my)], fill=mouth_col, w=2.5 * s)
    elif face in ("worried", "sad"):
        d.arc((x - 9 * s + lx, my - 2 * s, x + 9 * s + lx, my + 8 * s), 200, 340, fill=mouth_col, w=2.5 * s)
    elif face == "smile":
        d.arc((x - 12 * s + lx, my - 12 * s, x + 12 * s + lx, my + 4 * s), 20, 160, fill=mouth_col, w=3 * s)
    elif face in ("o", "scared"):
        d.ell((x - 5 * s + lx, my - 4 * s, x + 5 * s + lx, my + 6 * s), fill=mouth_col)
    if face == "sad":
        d.line([(x + 14 * s + lx, ey + 6 * s), (x + 16 * s + lx, ey + 18 * s)], fill=(140, 190, 240), w=3 * s)
    if item == "megaphone":
        mx, my2 = x + 40 * s, y + 4 * s
        d.poly([(mx - 4 * s, my2 - 10 * s), (mx + 40 * s, my2 - 26 * s), (mx + 40 * s, my2 + 26 * s),
                (mx - 4 * s, my2 + 10 * s)], fill=(236, 236, 230), outline=INK, w=3 * s)
        d.rect((mx + 2 * s, my2 + 4 * s, mx + 12 * s, my2 + 22 * s), fill=(200, 40, 40))


def utility_truck(d, x, y, s=1.0, lights=True):
    """White utility truck with an orange stripe and a boom-mounted floodlight."""
    d.rr((x - 120 * s, y - 70 * s, x + 80 * s, y), 8 * s, fill=(226, 226, 220), outline=INK, w=3 * s)
    d.rr((x + 80 * s, y - 56 * s, x + 140 * s, y), 8 * s, fill=(226, 226, 220), outline=INK, w=3 * s)
    d.rect((x + 92 * s, y - 48 * s, x + 132 * s, y - 28 * s), fill=(40, 46, 56))
    d.rect((x - 120 * s, y - 34 * s, x + 140 * s, y - 24 * s), fill=(250, 128, 30))
    for wx in (-80, 100):
        d.circ(x + wx * s, y, 18 * s, fill=INK)
    d.line([(x - 60 * s, y - 70 * s), (x - 20 * s, y - 150 * s)], fill=(120, 120, 126), w=8 * s)
    d.rr((x - 40 * s, y - 172 * s, x + 4 * s, y - 140 * s), 4 * s, fill=(60, 60, 66), outline=INK, w=2 * s)
    if lights:
        d.rect((x - 36 * s, y - 166 * s, x, y - 146 * s), fill=(255, 252, 230))
