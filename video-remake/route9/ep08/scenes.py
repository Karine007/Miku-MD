"""
Episode 8 scenes. Loaded by ../../gas_station/render.py with its helpers in this namespace.
Reuses Episode 7 (shed, trucks, herding, which loads Ep6/Ep1/Ep4) and the shared cast.
"""
import os as _os

_EP7 = _os.path.join(_os.path.dirname(_os.path.abspath(__file__)), "..", "ep07")
exec(open(_os.path.join(_EP7, "scenes.py")).read())   # its relative paths resolve from any sibling episode

NIGHT_TINT = (150, 156, 180)
FLOOD = (236, 232, 210)


def flood_bg(img, t, dim_k=0.0):
    img = lot_with_trucks(img, t, n=2)
    img = add_light(img, 360, 260, 420, (90, 88, 70), 0.5)
    return dim(img, dim_k)


def harlan_dam(img, t, s=1.0, cx=360, base=430, lit=1.0):
    d = D(img)
    w = 520 * s
    d.poly([(cx - w / 2, base), (cx + w / 2, base), (cx + w / 2 - 40 * s, base - 150 * s),
            (cx - w / 2 + 40 * s, base - 150 * s)], fill=(120, 124, 130), outline=INK, w=3 * s)
    for i in range(5):
        gx = cx - w / 2 + 80 * s + i * (w - 160 * s) / 4
        d.rect((gx - 22 * s, base - 120 * s, gx + 22 * s, base - 20 * s), fill=(90, 94, 100), outline=INK, w=2 * s)
    d.rect((cx - w / 2 + 40 * s, base - 160 * s, cx + w / 2 - 40 * s, base - 150 * s), fill=(100, 104, 110))
    for i in range(7):
        lx = cx - w / 2 + 50 * s + i * (w - 100 * s) / 6
        d.line([(lx, base - 160 * s), (lx, base - 220 * s)], fill=(80, 80, 86), w=3 * s)
        if lit:
            img = add_light(img, lx, base - 220 * s, int(90 * s), (150, 140, 90), 0.6 * lit)
            d = D(img)
            d.rect((lx - 10 * s, base - 226 * s, lx + 10 * s, base - 214 * s), fill=(255, 252, 230))
    return img


# --------------------------------------------------------------------------
def sc_step_out(t, lt):
    img = flood_bg(P(), t, 0.1)
    d = D(img)
    k = ease(lt / 3.0)
    d.rect((40, 260, 200, 520), fill=SHED, outline=INK, w=4)
    d.rect((90, 320, 150, 520), fill=(8, 6, 6))
    stick(d, 120 + 140 * k, 400, 0.8, "you", face="worried", t=t * 3, look=1)
    return img


def sc_boone_meet(t, lt):
    img = flood_bg(P(), t, 0.15)
    d = D(img)
    person(d, 380, 240, 1.7, "boone", face="neutral", arms="down", t=t)
    d.line([(420, 400), (470, 540)], fill=(40, 40, 44), w=10)
    d.line([(470, 540), (480, 600)], fill=(80, 56, 36), w=14)
    return img


def sc_boone_talk(t, lt):
    img = P()
    d = D(img)
    d.rect((0, 0, PW, PH), fill=(18, 18, 24))
    img = add_light(img, 200, 120, 400, (110, 104, 80), 0.6)
    d = D(img)
    person(d, 360, 280, 2.6, "boone", face="neutral", t=t)
    return img


def sc_tell_all(t, lt):
    img = flood_bg(P(), t, 0.55)
    d = D(img)
    icons = 4
    shown = min(icons, int(lt / 1.4) + 1)
    for i in range(shown):
        x0 = 30 + i * 172
        d.rr((x0, 70, x0 + 150, 230), 10, fill=(236, 232, 222), outline=INK, w=4)
        cx, cy = x0 + 75, 150
        if i == 0:
            d.circ(cx - 14, cy - 10, 18, outline=(150, 130, 70), w=5)
            d.rr((cx - 4, cy - 2, cx + 30, cy + 10), 3, fill=(150, 130, 70))
        elif i == 1:
            d.rr((cx - 40, cy - 14, cx + 40, cy + 14), 8, fill=(236, 220, 200), outline=INK, w=2)
            d.line([(cx - 30, cy), (cx + 30, cy)], fill=(180, 30, 30), w=5)
        elif i == 2:
            d.rect((cx - 34, cy - 50, cx + 34, cy + 50), fill=(92, 100, 112), outline=INK, w=3)
            d.rr((cx + 14, cy - 8, cx + 28, cy + 8), 3, fill=(170, 170, 176))
        else:
            d.rect((cx - 50, cy - 50, cx + 50, cy + 50), fill=(30, 34, 44), outline=INK, w=3)
            d.circ(cx - 10, cy, 8, outline=(200, 210, 220), w=3)
            d.circ(cx + 14, cy, 8, outline=(200, 210, 220), w=3)
    stick(d, 220, 420, 0.9, "you", face="worried", arms="hold", t=t)
    person(d, 500, 410, 0.95, "boone", face="neutral", t=t)
    return img


def sc_boone_away(t, lt):
    img = P()
    d = D(img)
    d.rect((0, 0, PW, PH), fill=(18, 18, 24))
    img = add_light(img, 600, 140, 380, (110, 104, 80), 0.5)
    d = D(img)
    person(d, 360, 280, 2.6, "boone", face="sad", look=-1, t=t)
    return img


def sc_you_ask(t, lt):
    img = flood_bg(P(), t, 0.4)
    d = D(img)
    stick(d, 360, 280, 2.4, "you", face="o", t=t)
    return img


def sc_herd_wide(t, lt):
    return sc_herding(t, lt)


def sc_spillway(t, lt):
    img = P()
    d = D(img)
    d.rect((0, 0, PW, PH), fill=(226, 220, 196))
    d.poly([(0, 120), (300, 120), (300, 260), (0, 260)], fill=(110, 160, 210))
    d.rect((300, 90, 360, 300), fill=(130, 134, 140), outline=INK, w=4)
    k = ease((lt - 1.5) / 2.5)
    for i in range(4):
        gy = 110 + i * 46
        d.rect((300, gy + 30 * k, 360, gy + 36 + 30 * k * 0), fill=(90, 94, 100), outline=INK, w=2)
    d.poly([(360, 160), (720, 140), (720, 240), (360, 230)], fill=mix((200, 196, 180), (110, 160, 210), k))
    for i in range(10):
        x = 400 + i * 30
        y = 190 + math.sin(i) * 12
        if k < 0.6:
            d.circ(x, y, 6, fill=(110, 124, 104))
    d.d.text((180 * K, 300 * K), "RESERVOIR", font=font("InterDisplay-Bold.otf", 22 * K), fill=(30, 30, 30), anchor="mm")
    d.d.text((330 * K, 340 * K), "FLOODGATES", font=font("InterDisplay-Bold.otf", 22 * K), fill=(30, 30, 30), anchor="mm")
    d.d.text((560 * K, 280 * K), "SPILLWAY", font=font("InterDisplay-Bold.otf", 22 * K), fill=(30, 30, 30), anchor="mm")
    d.line([(360, 400), (700, 400)], fill=(110, 160, 210), w=30)
    d.d.text((540 * K, 450 * K), "RIVER  →  DOWNSTREAM", font=font("InterDisplay-Bold.otf", 22 * K),
             fill=(30, 30, 30), anchor="mm")
    return img


def sc_river_you(t, lt):
    img = flood_bg(P(), t, 0.5)
    d = D(img)
    stick(d, 360, 280, 2.3, "you", face="worried", t=t)
    return img


def sc_river_map(t, lt):
    img = P()
    d = D(img)
    d.rect((0, 0, PW, PH), fill=(226, 220, 196))
    pts = [(360, 60), (330, 160), (390, 260), (340, 380), (380, 520)]
    d.line(pts, fill=(110, 160, 210), w=30)
    d.rect((310, 40, 410, 80), fill=(120, 120, 126), outline=INK, w=3)
    d.d.text((480 * K, 60 * K), "HARLAN DAM", font=font("InterDisplay-Black.otf", 24 * K), fill=(30, 30, 30), anchor="lm")
    k = ease(lt / 3.0)
    for i in range(int(k * 12)):
        f = i / 12
        y = 90 + 410 * f
        d.circ(300, y, 4, fill=(200, 50, 40))
    if k > 0.6:
        d.circ(380, 520, 18, fill=(200, 50, 40), outline=INK, w=3)
        for hx in (420, 450, 480):
            d.poly([(hx, 520), (hx + 14, 506), (hx + 28, 520), (hx + 28, 540), (hx, 540)], fill=(150, 90, 60), outline=INK, w=2)
        d.d.text((560 * K, 560 * K), "PINE HOLLOW", font=font("InterDisplay-Black.otf", 26 * K), fill=(30, 30, 30), anchor="mm")
    return img


def sc_boone_shrug(t, lt):
    img = flood_bg(P(), t, 0.2)
    d = D(img)
    person(d, 360, 240, 1.7, "boone", face="neutral", arms="hug", t=t)
    return img


def sc_you_doubt(t, lt):
    img = flood_bg(P(), t, 0.55)
    d = D(img)
    stick(d, 360, 280, 2.4, "you", face="worried", look=-1, t=t)
    return img


def sc_rule6(t, lt):
    img = flood_bg(P(), t, 0.0)
    return add_light(img, 360, 260, 520, (120, 118, 90), 0.5)


def sc_boone_offer(t, lt):
    img = flood_bg(P(), t, 0.2)
    d = D(img)
    person(d, 300, 300, 1.2, "boone", face="neutral", arms="megaphone", t=t)
    utility_truck(d, 560, 520, 0.9)
    return img


def sc_mirror_pickup(t, lt):
    img = P()
    d = D(img)
    d.rect((0, 0, PW, PH), fill=(20, 20, 24))
    d.rr((140, 120, 580, 470), 40, fill=(10, 10, 12))
    m = P()
    night_sky(m)
    dm = D(m)
    dm.rect((0, 330, PW, PH), fill=(30, 30, 36))
    dm.poly([(330, 300), (390, 300), (PW, PH), (0, PH)], fill=(40, 40, 46))
    dm.rr((280, 380, 440, 450), 10, fill=(70, 34, 26), outline=INK, w=3)
    dm.rr((310, 350, 410, 386), 8, fill=(62, 30, 24), outline=INK, w=3)
    m = dim(m, 0.3).resize((420 * K, 330 * K))
    img.paste(m, (150 * K, 130 * K))
    d = D(img)
    d.rr((150, 130, 570, 460), 34, outline=(10, 10, 12), w=14)
    d.d.text((360 * K, 440 * K), "OBJECTS IN MIRROR ARE CLOSER THAN THEY APPEAR",
             font=font("Inter-Medium.otf", 11 * K), fill=(200, 200, 200), anchor="mm")
    return img


def parade_road(img, t, highlight=False):
    night_sky(img)
    d = D(img)
    d.rect((0, 330, PW, PH), fill=(30, 30, 36))
    d.poly([(330, 300), (390, 300), (PW, PH), (0, PH)], fill=(40, 40, 46))
    img = add_light(img, 360, 520, 360, (130, 126, 100), 0.6)
    d = D(img)
    utility_truck(d, 360, 560, 0.8)
    rnd = random.Random(19)
    for i in range(26):
        depth = rnd.random()
        side = -1 if i % 2 else 1
        x = 360 + side * (90 + 260 * depth) + rnd.uniform(-20, 20)
        y = 330 + 260 * depth
        s = 0.15 + 0.45 * depth
        zombie(d, x, y - 110 * s, s, t, i, color=(150, 166, 138), shirt=(90, 86, 76))
    if highlight:
        stick(d, 190, 380, 0.42, "ray", face="creepy", t=t, tint=(150, 168, 150))
    return img


def sc_parade(t, lt):
    return parade_road(P(), t)


def sc_red_vest(t, lt):
    img = parade_road(P(), t, highlight=True)
    k = ease(lt / 2.0)
    return add_light(img, 190, 400, 90, (90, 10, 10), 0.6 * k)


def sc_dam_far(t, lt):
    img = P()
    night_sky(img)
    d = D(img)
    d.rect((0, 380, PW, PH), fill=(28, 28, 34))
    k = ease(lt / 4.0)
    img = harlan_dam(img, t, s=0.7 + 0.25 * k, base=400, lit=1.0)
    img = add_light(img, 360, 240, 420, (90, 84, 50), 0.4)
    d = D(img)
    d.poly([(330, 640), (390, 640), (372, 400), (348, 400)], fill=(40, 40, 46))
    return img
