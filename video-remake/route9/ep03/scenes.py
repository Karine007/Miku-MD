"""
Episode 3 scenes. Loaded by ../../gas_station/render.py with its helpers in this namespace
(P, D, grad, dim, stick, stick_lying, store_bg, zombie, add_light, ease, clamp, mix, font, K,
PW, PH, INK, ORANGE, math, random, np, Image, ImageDraw, ImageFilter, sc_ray_dark, ...).
Reused from the engine: ray_dark, fridge.
"""

NIGHT_TINT = (150, 156, 180)
RAY_SICK = (176, 186, 178)


def dark_store(dark=0.74):
    return store_bg(P(), dark=dark)


def cooler_wall(img, door_open=0.0, glow=0.0):
    """Walk-in cooler door, front-on, in the dark store."""
    d = D(img)
    d.rect((0, 0, PW, PH), fill=(16, 18, 26))
    d.rect((0, 500, PW, PH), fill=(28, 30, 38))
    d.rect((180, 50, 540, 520), fill=(60, 66, 76), outline=INK, w=5)
    if door_open > 0:
        gap = 300 * door_open
        img = add_light(img, 360, 280, 260, (50, 80, 100), 0.6)
        d = D(img)
        d.rect((196, 66, 196 + gap, 506), fill=(150, 210, 230))
    d.poly([(196 + 300 * door_open, 66), (524, 66), (524, 506), (196 + 300 * door_open, 506)],
           fill=(92, 100, 112), outline=INK, w=4)
    d.d.text((440 * K, 120 * K), "WALK-IN", font=font("InterDisplay-Black.otf", 26 * K), fill=(210, 214, 220), anchor="mm")
    d.rr((470, 260, 506, 296), 6, fill=(170, 170, 176), outline=INK, w=3)
    if glow:
        img = add_light(img, 360, 300, 300, (40, 60, 80), glow)
    return img


def bolt_on(d, closed=True):
    d.rr((500, 300, 560, 330), 4, fill=(120, 120, 126), outline=INK, w=3)
    x = 470 if closed else 520
    d.rr((x, 306, x + 60, 324), 4, fill=(190, 190, 196), outline=INK, w=2)


# --------------------------------------------------------------------------
def sc_confess(t, lt):
    img = cooler_wall(P(), glow=0.25)
    d = D(img)
    d.rect((150, 500, 570, 530), fill=(70, 74, 84), outline=INK, w=3)
    stick(d, 300, 360, 1.05, "ray", pose="sit", face="worried", t=t, tint=RAY_SICK, look=1)
    d.rr((262, 450, 292, 470), 6, fill=(236, 232, 222), outline=INK, w=2)
    d.rect((264, 452, 290, 468), fill=(220, 210, 200))
    d.line([(266, 460), (288, 460)], fill=(150, 30, 30), w=3)
    stick(d, 560, 380, 0.95, "you", pose="sit", face="worried", t=t, tint=NIGHT_TINT, look=-1)
    return dim(img, 0.1)


def sc_keys(t, lt):
    img = P()
    d = D(img)
    d.rect((0, 0, PW, PH), fill=(14, 16, 22))
    img = add_light(img, 360, 340, 300, (50, 56, 70), 0.6)
    d = D(img)
    k = ease(lt / 1.2)
    d.line([(PW, PH), (430, 430)], fill=INK, w=60)
    d.ell((170, 300 - 20 * k, 470, 470), fill=(26, 26, 30))
    for i in range(4):
        a = math.radians(200 + i * 22 - 30 * k)
        d.line([(320, 380), (320 + 150 * math.cos(a), 380 + 150 * math.sin(a) * (1 - 0.6 * k))], fill=(26, 26, 30), w=34)
    if k > 0.4:
        a = ease((k - 0.4) / 0.6)
        c = mix((14, 16, 22), (210, 200, 160), a)
        d.circ(320, 360, 26, outline=c, w=6)
        d.rr((300, 380, 340, 470), 8, fill=mix((14, 16, 22), (40, 40, 44), a), outline=c, w=3)
        d.rr((350, 360, 372, 450), 4, fill=c)
        d.rect((364, 420, 380, 428), fill=c)
        d.rect((364, 436, 376, 444), fill=c)
        d.rr((260, 330, 300, 360), 6, fill=mix((14, 16, 22), (130, 60, 44), a))
    return img


def sc_ticket4(t, lt):
    img = P()
    d = D(img)
    d.rect((0, 0, PW, PH), fill=(60, 30, 26))
    d.poly([(150, 120), (580, 90), (600, 520), (170, 560)], fill=(232, 228, 206), outline=INK, w=4)
    for i in range(10):
        d.line([(170 + i * 42, 112 - i * 3), (186 + i * 42, 548 - i * 4)], fill=(218, 208, 180), w=2)
    words = ["IF YOU'RE", "SCRATCHED,", "SAY SO."]
    k = clamp((lt - 0.8) / 3.4)
    n_chars = int(k * sum(len(w) for w in words))
    f = font("InterDisplay-BoldItalic.otf", 50 * K)
    used = 0
    pen = (280, 230)
    for i, w in enumerate(words):
        take = max(0, min(len(w), n_chars - used))
        used += len(w)
        if take:
            d.d.text(((230 + i * 6) * K, (220 + i * 90) * K), w[:take], font=f, fill=(130, 20, 24))
            pen = (230 + i * 6 + f.getlength(w[:take]) / K, 250 + i * 90)
    if lt < 4.6:
        px, py = pen
        d.line([(px + 4, py), (px + 180, py + 160)], fill=(40, 120, 200), w=16)
        d.line([(px, py - 4), (px + 14, py + 10)], fill=INK, w=8)
        d.line([(px + 180, py + 160), (720, 640)], fill=(176, 186, 178), w=24)
    return dim(img, 0.15)


def sc_promise(t, lt):
    img = P()
    d = D(img)
    d.rect((0, 0, PW, PH), fill=(12, 14, 20))
    img = add_light(img, 360, 300, 320, (40, 50, 60), 0.6)
    d = D(img)
    stick(d, 360, 270, 2.5, "ray", face="worried", arms="down", t=t, tint=RAY_SICK)
    return img


def sc_cards(t, lt, tap=False):
    img = store_bg(P(), dark=0.35)
    d = D(img)
    d.ell((230, 520, 520, 600), fill=(120, 120, 114))
    stick(d, 270, 410, 0.9, "you", pose="sit", face="neutral", arms="cards", t=t, look=1)
    shake = math.sin(t * 38) * 2.5
    stick(d, 470 + shake, 404, 0.9, "ray", pose="sit", face="smile", arms="cards", t=t, look=-1, tint=RAY_SICK)
    for i in range(3):
        d.rr((360 + i * 22, 556 - i * 4, 380 + i * 22, 584 - i * 4), 3, fill=(250, 250, 250), outline=INK, w=2)
    if tap:
        for k, tt in enumerate((0.4, 0.9)):
            if lt > tt:
                a = clamp(1 - (lt - tt) / 0.6)
                if a > 0:
                    d.circ(430, 580, 16 + 30 * (1 - a), outline=mix((120, 120, 114), (255, 255, 255), a), w=3)
        d.line([(452, 470), (430, 572)], fill=INK, w=5)
    return img


def sc_cards_tap(t, lt):
    return sc_cards(t, lt, tap=True)


def sc_stare(t, lt):
    img = dark_store(0.7)
    d = D(img)
    d.rect((300, 150, 560, 330), fill=(8, 10, 18), outline=INK, w=4)
    stick(d, 420, 300, 1.1, "ray", face="neutral", t=t, tint=RAY_SICK)
    d.rect((380, 270, 460, 330), fill=(40, 40, 50))
    img = add_light(img, 430, 240, 140, (20, 30, 40), 0.4)
    return img


def sc_danny(t, lt):
    img = P()
    d = D(img)
    d.rect((0, 0, PW, PH), fill=(10, 12, 18))
    img = add_light(img, 360, 300, 320, (40, 46, 56), 0.6)
    d = D(img)
    stick(d, 360, 270, 2.6, "ray", face="smile", t=t, tint=(166, 180, 166))
    return img


def sc_you_frozen(t, lt):
    img = P()
    d = D(img)
    d.rect((0, 0, PW, PH), fill=(10, 12, 18))
    img = add_light(img, 360, 300, 300, (30, 36, 50), 0.6)
    d = D(img)
    stick(d, 360, 280, 2.4, "you", face="scared", t=t, tint=NIGHT_TINT)
    return img


def sc_hands_look(t, lt):
    img = P()
    d = D(img)
    d.rect((0, 0, PW, PH), fill=(10, 12, 18))
    img = add_light(img, 360, 360, 320, (36, 44, 52), 0.6)
    d = D(img)
    stick(d, 360, 200, 1.8, "ray", face="worried", arms="hold", t=t, tint=RAY_SICK)
    for hx in (300, 420):
        d.circ(hx, 470, 22, fill=(176, 186, 178), outline=INK, w=3)
    return img


def sc_into_cooler(t, lt):
    k = ease(lt / 3.0)
    close = ease((lt - 3.2) / 1.2)
    img = cooler_wall(P(), door_open=0.85 * (1 - close), glow=0.2)
    d = D(img)
    if close < 0.9:
        stick(d, 330 - 40 * k, 250 + 10 * k, 1.0 - 0.25 * k, "ray", face="neutral", t=t, tint=RAY_SICK, look=-1)
    stick(d, 600, 330, 0.95, "you", face="worried", t=t, tint=NIGHT_TINT, look=-1)
    return img


def sc_door_closed(t, lt):
    img = cooler_wall(P(), glow=0.15)
    d = D(img)
    bolt_on(d, closed=False)
    stick(d, 610, 330, 0.95, "you", face="worried", t=t, tint=NIGHT_TINT, look=-1)
    return img


def sc_guard(t, lt, night=False):
    img = cooler_wall(P(), glow=0.12)
    d = D(img)
    bolt_on(d, closed=True)
    stick(d, 330, 380, 1.0, "you", pose="sit", face="worried" if not night else "neutral", t=t, tint=NIGHT_TINT)
    if not night:
        for i in range(3):
            ph = (t * 0.5 + i / 3) % 1
            c = mix((60, 66, 76), (200, 210, 230), (1 - ph) * math.sin(ph * math.pi))
            x, y = 470 + ph * 60, 200 - ph * 70
            d.d.text((x * K, y * K), "♪", font=font("Inter-Bold.otf", 30 * K), fill=c, anchor="mm")
    return dim(img, 0.35 if night else 0.0)


def sc_guard_night(t, lt):
    return sc_guard(t, lt, night=True)


def sc_taps(t, lt):
    img = P()
    d = D(img)
    d.rect((0, 0, PW, PH), fill=(30, 34, 42))
    d.rect((60, 0, 660, PH), fill=(92, 100, 112), outline=INK, w=6)
    for y in range(40, PH, 60):
        d.line([(60, y), (660, y)], fill=(84, 92, 104), w=2)
    img = add_light(img, 360, 300, 300, (30, 40, 50), 0.4)
    d = D(img)
    for k, tt in enumerate((0.9, 1.5)):
        if lt > tt:
            a = clamp(1 - (lt - tt) / 0.7)
            if a > 0:
                r = 20 + 80 * (1 - a)
                d.circ(360, 320, r, outline=mix((92, 100, 112), (230, 236, 240), a), w=5)
    shake = 0
    for tt in (0.9, 1.5):
        if 0 <= lt - tt < 0.15:
            shake = 6
    if shake:
        img = img.transform(img.size, Image.AFFINE, (1, 0, shake * K, 0, 1, 0))
    return dim(img, 0.25)


def sc_bolt(t, lt):
    img = P()
    d = D(img)
    d.rect((0, 0, PW, PH), fill=(30, 34, 42))
    d.rect((0, 0, PW, PH), fill=(92, 100, 112))
    for y in range(40, PH, 60):
        d.line([(0, y), (PW, y)], fill=(84, 92, 104), w=2)
    d.rr((260, 260, 560, 360), 10, fill=(120, 120, 126), outline=INK, w=5)
    d.rr((200, 280, 420, 340), 8, fill=(190, 190, 196), outline=INK, w=4)
    d.rr((300, 240, 330, 290), 6, fill=(170, 170, 176), outline=INK, w=3)
    reach = 0.5 + 0.5 * math.sin(min(lt, 2.5) * 1.2)
    hx = 330 - 80 * (1 - reach) * 0.4
    d.line([(PW, PH), (hx + 120, 420)], fill=(26, 26, 30), w=40)
    d.circ(hx + 70, 380, 40, fill=(26, 26, 30))
    for i in range(3):
        d.line([(hx + 50 + i * 18, 360), (hx + 30 + i * 18, 320 + 10 * (1 - reach))], fill=(26, 26, 30), w=14)
    if lt > 3.0:
        k = ease((lt - 3.0) / 1.0)
        img = img.transform(img.size, Image.AFFINE, (1, 0, 0, 0, 1, 0))
        img = dim(img, 0.2 * k)
    return dim(img, 0.3)


def sc_fridge(t, lt):
    """Drinks cooler, mostly empty: 14 bottles left."""
    img = P()
    d = D(img)
    d.rect((0, 0, PW, PH), fill=(40, 44, 52))
    left = [(0, 0), (0, 1), (0, 2), (0, 3), (0, 4), (1, 0), (1, 1), (1, 2), (2, 0), (2, 1), (2, 3), (3, 0), (3, 2), (3, 4)]
    for i in range(3):
        x0 = 30 + i * 226
        d.rr((x0, 40, x0 + 210, 600), 8, fill=(170, 190, 204), outline=INK, w=5)
        for row in range(4):
            y0 = 70 + row * 130
            d.line([(x0 + 10, y0 + 110), (x0 + 200, y0 + 110)], fill=(120, 130, 140), w=4)
            for b in range(5):
                if i == 0 and (row, b) in left[:7] or i == 1 and (row, b) in left[7:12] or i == 2 and (row, b) in left[12:]:
                    bx = x0 + 22 + b * 37
                    d.rr((bx, y0 + 30, bx + 26, y0 + 108), 6, fill=(150, 200, 236), outline=INK, w=2)
                    d.rect((bx + 8, y0 + 20, bx + 18, y0 + 32), fill=(40, 110, 200))
                    d.rect((bx, y0 + 60, bx + 26, y0 + 76), fill=(240, 246, 250))
        d.rect((x0 + 190, 280, x0 + 198, 360), fill=(160, 160, 166))
    return dim(img, 0.35)
