"""
Episode 5 scenes. Loaded by ../../gas_station/render.py with its helpers in this namespace.
Reuses Episode 4's CB / map / dock scenes (loaded below into this same namespace).
"""
import os as _os

exec(open(_os.path.join(_os.path.dirname(_os.path.abspath(__file__)), "..", "ep04", "scenes.py")).read())

NIGHT_TINT = (150, 156, 180)
RAY_TURNED = (150, 168, 150)


def window_frame(d):
    for x in (0, 236, 472, 704):
        d.rect((x, 0, x + 16, PH), fill=(30, 30, 36), outline=INK, w=2)
    d.rect((0, 590, PW, PH), fill=(40, 22, 20))


def lot_view(img, t, ray=False, crowd=3, dark=0.45):
    img = gas_station(img, t, lights=False, truck=True)
    d = D(img)
    rnd = random.Random(2)
    for i in range(crowd):
        x = rnd.uniform(60, 660)
        zombie(d, x, 330 + rnd.uniform(0, 20), 0.35, t, i, color=(100, 112, 96), shirt=(60, 58, 52))
    if ray:
        stick(d, 290, 300, 0.55, "ray", face="creepy", t=t, tint=RAY_TURNED)
    return img


# --------------------------------------------------------------------------
def sc_dock_dark(t, lt):
    return dim(sc_dock_open(t, lt), 0.2)


def sc_shove(t, lt):
    img = P()
    d = D(img)
    d.rect((0, 0, PW, PH), fill=(16, 18, 24))
    d.rect((0, 480, PW, PH), fill=(30, 32, 38))
    d.rect((470, 80, 700, 480), fill=(70, 74, 82), outline=INK, w=4)
    for y in range(100, 460, 24):
        d.rect((480, y, 690, y + 14), fill=(84, 88, 96))
    k = ease(lt / 3.5)
    sx = 140 + 260 * k
    d.rect((sx, 140, sx + 70, 480), fill=(50, 52, 60), outline=INK, w=3)
    for y in range(180, 480, 70):
        d.line([(sx, y), (sx + 70, y)], fill=INK, w=4)
        d.rect((sx + 8, y - 36, sx + 30, y - 4), fill=(110, 70, 50))
    stick(d, sx - 70, 300, 1.0, "you", face="worried", arms="hold", t=t * 3, tint=NIGHT_TINT, look=1)
    return dim(img, 0.1)


def sc_math(t, lt):
    img = store_bg(P(), dark=0.55)
    d = D(img)
    stick(d, 360, 300, 1.0, "you", face="neutral", t=t, tint=NIGHT_TINT)
    return img


def sc_keys_pocket(t, lt):
    img = P()
    d = D(img)
    d.rect((0, 0, PW, PH), fill=(46, 84, 150))
    d.poly([(140, 300), (580, 280), (600, PH), (120, PH)], fill=(36, 66, 120), outline=INK, w=5)
    k = ease(lt / 1.5)
    y = 380 - 180 * k
    d.circ(360, y, 30, outline=(210, 200, 160), w=7)
    d.rr((338, y + 22, 382, y + 120), 8, fill=(40, 40, 44), outline=(210, 200, 160), w=3)
    d.rr((392, y, 414, y + 100), 4, fill=(210, 200, 160))
    d.rect((406, y + 66, 424, y + 74), fill=(210, 200, 160))
    d.ell((300, y - 10 - 0, 440, y + 90), fill=(26, 26, 30))
    for i in range(4):
        d.line([(330 + i * 26, y + 20), (320 + i * 26, y - 40)], fill=(26, 26, 30), w=20)
    return dim(img, 0.4)


def sc_pickup_lot(t, lt):
    img = lot_view(P(), t, crowd=4)
    d = D(img)
    window_frame(d)
    return dim(img, 0.4)


def sc_timelapse(t, lt):
    k = ease(lt / 4.0)
    img = gas_station(P(), t, lights=False, truck=True)
    sky = Image.new("RGB", img.size, (210, 180, 140))
    img = Image.blend(Image.blend(img, sky, 0.35 * (1 - k)), Image.new("RGB", img.size, (6, 8, 16)), 0.4 * k)
    d = D(img)
    window_frame(d)
    return img


def sc_lot_thin(t, lt):
    img = lot_view(P(), t, crowd=2)
    d = D(img)
    window_frame(d)
    return dim(img, 0.45)


def sc_lot_ray(t, lt):
    img = lot_view(P(), t, ray=True, crowd=2)
    d = D(img)
    window_frame(d)
    return dim(img, 0.4)


def sc_ray_watch(t, lt):
    img = P()
    d = D(img)
    d.rect((0, 0, PW, PH), fill=(14, 16, 24))
    d.rect((0, 470, PW, PH), fill=(34, 34, 40))
    img = add_light(img, 360, 200, 300, (40, 44, 50), 0.6)
    d = D(img)
    d.rr((520, 200, 620, 520), 10, fill=(150, 50, 40), outline=INK, w=4)
    stick(d, 330, 250, 1.8, "ray", face="creepy", t=0, tint=RAY_TURNED)
    return img


def sc_crouch(t, lt):
    img = store_bg(P(), dark=0.8)
    d = D(img)
    d.rect((300, 150, 560, 330), fill=(8, 10, 18), outline=INK, w=4)
    d.rect((0, 380, PW, 470), fill=(60, 28, 24), outline=INK, w=3)
    stick(d, 250, 440, 0.95, "you", pose="sit", face="scared", t=t, tint=NIGHT_TINT, look=1)
    return img


def sc_glass_ray(t, lt):
    img = P()
    d = D(img)
    d.rect((0, 0, PW, PH), fill=(10, 12, 20))
    k = ease(lt / 3.0)
    s = 0.8 + 0.9 * k
    stick(d, 360, 330 - 60 * k, s, "ray", face="creepy", t=0, tint=mix((10, 12, 20), RAY_TURNED, 0.4 + 0.5 * k))
    for x in (0, 236, 472, 704):
        d.rect((x, 0, x + 16, PH), fill=(30, 30, 36), outline=INK, w=2)
    return img


def sc_knuckle(t, lt):
    img = P()
    d = D(img)
    d.rect((0, 0, PW, PH), fill=(12, 14, 22))
    d.line([(PW, 140), (440, 300)], fill=(120, 136, 120), w=60)
    d.ell((360, 260, 470, 360), fill=(150, 168, 150), outline=INK, w=4)
    for i in range(3):
        d.line([(380 + i * 26, 268), (372 + i * 26, 250)], fill=INK, w=3)
    for tt in (0.25, 1.1):
        if lt > tt:
            a = clamp(1 - (lt - tt) / 0.7)
            if a > 0:
                d.circ(380, 310, 20 + 120 * (1 - a), outline=mix((12, 14, 22), (200, 210, 220), a), w=4)
    d.line([(0, 0), (PW, PH)], fill=(30, 34, 44), w=2)
    return img


def sc_eyes_shut(t, lt):
    img = P()
    d = D(img)
    d.rect((0, 0, PW, PH), fill=(10, 12, 18))
    img = add_light(img, 360, 300, 300, (30, 34, 50), 0.6)
    d = D(img)
    stick(d, 360, 280, 2.6, "you", face="sleep", t=t, tint=NIGHT_TINT)
    return img


def sc_ray_leaves(t, lt):
    img = P()
    night_sky(img)
    d = D(img)
    d.rect((0, 320, PW, PH), fill=(34, 34, 40))
    d.poly([(330, 300), (390, 300), (PW, PH), (0, PH)], fill=(44, 44, 50))
    k = ease(lt / 6.0)
    s = 0.9 - 0.75 * k
    y = 560 - 250 * k
    stick(d, 360 + 20 * math.sin(t * 2), y - 120 * s, s, "ray", face="creepy", t=t * 2, tint=RAY_TURNED)
    return dim(img, 0.15)


def sc_grip_mic(t, lt):
    img = P()
    d = D(img)
    d.rect((0, 0, PW, PH), fill=(16, 18, 24))
    d.rr((260, 200, 460, 470), 40, fill=(30, 30, 34), outline=INK, w=6)
    for i in range(6):
        d.line([(290, 240 + i * 30), (430, 240 + i * 30)], fill=(60, 60, 66), w=5)
    d.rr((440, 300, 480, 360), 8, fill=(200, 40, 30))
    sh = math.sin(t * 50) * 3
    d.ell((380 + sh, 260, 560 + sh, 420), fill=(26, 26, 30))
    for i in range(4):
        d.line([(400 + sh, 280 + i * 34), (310 + sh, 270 + i * 36)], fill=(26, 26, 30), w=26)
    d.line([(560, 360), (PW, 520)], fill=(26, 26, 30), w=60)
    d.line([(360, 470), (300, 600), (340, PH)], fill=INK, w=6)
    return img


def sc_grab_keys(t, lt):
    img = store_bg(P(), dark=0.75)
    d = D(img)
    k = ease(lt / 1.2)
    if k < 1:
        d.circ(560, 340, 12, outline=(210, 200, 160), w=4)
        d.rr((570, 336, 600, 344), 3, fill=(210, 200, 160))
    hx = 720 - 160 * k if k < 1 else 560 + 200 * ease((lt - 1.2) / 0.6)
    d.line([(PW, 260), (hx, 330)], fill=(26, 26, 30), w=34)
    d.circ(hx, 334, 26, fill=(26, 26, 30))
    stick(d, 260, 300, 1.0, "you", face="worried", t=t, tint=NIGHT_TINT, look=1)
    return img
