"""
Episode 6 scenes. Loaded by ../../gas_station/render.py with its helpers in this namespace.
Reuses Episode 1's road/dashboard helpers and Episode 4's CB radio (loaded below).
"""
import os as _os

_HERE = _os.path.dirname(_os.path.abspath(__file__))
for _ep in ("ep01", "ep04"):
    exec(open(_os.path.join(_HERE, "..", _ep, "scenes.py")).read())

NIGHT_TINT = (150, 156, 180)


def can(d, x, y, s=1.0, fill_k=0.0):
    d.rr((x - 30 * s, y - 50 * s, x + 30 * s, y + 50 * s), 8 * s, fill=(190, 40, 34), outline=INK, w=3 * s)
    d.rr((x + 4 * s, y - 70 * s, x + 18 * s, y - 50 * s), 3 * s, fill=(230, 190, 40), outline=INK, w=2 * s)
    d.rr((x - 22 * s, y - 64 * s, x - 2 * s, y - 50 * s), 4 * s, fill=(160, 30, 28), outline=INK, w=2 * s)
    if fill_k > 0:
        d.rect((x - 26 * s, y + 46 * s - 90 * s * fill_k, x - 20 * s, y + 46 * s), fill=(250, 220, 120))


def lot_dark(img, t, glow=0.0):
    img = gas_station(img, t, lights=False, truck=True, car=True)
    if glow:
        img = add_light(img, 290, 320, int(60 + 80 * glow), (60, 120, 90), 0.8 * glow)
    return dim(img, 0.35)


# --------------------------------------------------------------------------
def sc_door_keys(t, lt):
    img = store_bg(P(), dark=0.8)
    d = D(img)
    d.rect((300, 150, 560, 330), fill=(10, 12, 20), outline=INK, w=4)
    stick(d, 430, 300, 1.0, "you", face="worried", arms="hold", t=t, tint=NIGHT_TINT, look=1)
    d.circ(434, 362, 10, outline=(210, 200, 160), w=4)
    d.rr((442, 358, 466, 366), 3, fill=(210, 200, 160))
    return img


def sc_lot_walk(t, lt):
    img = lot_dark(P(), t)
    d = D(img)
    k = ease(lt / 5.0)
    x = 600 - 330 * k
    stick(d, x, 340 + 20 * k, 0.55, "you", face="worried", t=t * 3, tint=NIGHT_TINT, look=-1)
    return img


def sc_cab(t, lt):
    img = P()
    d = D(img)
    d.rect((0, 0, PW, PH), fill=(16, 16, 20))
    d.rect((60, 60, 660, 360), fill=(26, 30, 44), outline=(10, 10, 12), w=12)
    night_strip = P()
    night_sky(night_strip)
    img.paste(night_strip.crop((60 * K, 0, 660 * K, 300 * K)), (60 * K, 60 * K))
    d = D(img)
    d.rect((60, 60, 660, 360), outline=(10, 10, 12), w=12)
    d.rect((0, 360, PW, PH), fill=(30, 22, 18))
    d.rr((80, 420, 640, 520), 20, fill=(70, 34, 26), outline=INK, w=4)
    sw = math.sin(t * 3) * 14
    d.line([(360, 60), (360 + sw * 0.4, 150)], fill=(200, 200, 200), w=2)
    d.poly([(360 + sw, 150), (340 + sw, 200), (380 + sw, 200)], fill=(40, 140, 70), outline=INK, w=2)
    d.poly([(360 + sw, 180), (334 + sw, 236), (386 + sw, 236)], fill=(40, 140, 70), outline=INK, w=2)
    d.rect((354 + sw, 236, 366 + sw, 250), fill=(110, 70, 40))
    return dim(img, 0.2)


def sc_truck_bed(t, lt):
    img = lot_dark(P(), t)
    d = D(img)
    d.rect((0, 300, PW, PH), fill=(60, 30, 24), outline=INK, w=4)
    d.rect((0, 300, PW, 330), fill=(80, 40, 30))
    for i, x in enumerate((220, 360, 500)):
        can(d, x, 460, 1.4)
    return img


def sc_breaker(t, lt):
    img = P()
    d = D(img)
    d.rect((0, 0, PW, PH), fill=(40, 40, 46))
    d.rr((170, 60, 550, 600), 12, fill=(90, 94, 100), outline=INK, w=5)
    d.d.text((360 * K, 104 * K), "BREAKER", font=font("InterDisplay-Black.otf", 30 * K), fill=(30, 30, 30), anchor="mm")
    flip = lt > 4.6
    for i, lab in enumerate(["CANOPY", "SIGN", "STORE", "COOLER", "PUMPS"]):
        y = 160 + i * 84
        d.rr((220, y, 500, y + 60), 6, fill=(70, 74, 80), outline=INK, w=3)
        d.d.text((300 * K, (y + 30) * K), lab, font=font("InterDisplay-Bold.otf", 20 * K), fill=(220, 220, 220), anchor="mm")
        on = lab == "PUMPS" and flip
        d.rr((400, y + 10, 470, y + 50), 6, fill=(30, 30, 34), outline=INK, w=2)
        d.rr((404 if on else 436, y + 14, 434 if on else 466, y + 46), 4, fill=(60, 200, 90) if on else (90, 90, 90))
    hy = 496 if lt > 3.6 else 620
    d.line([(PW, PH), (470, hy + 40)], fill=INK, w=24)
    d.circ(450, hy + 20, 32, fill=INK)
    return dim(img, 0.35)


def sc_pump_on(t, lt):
    img = P()
    d = D(img)
    d.rect((0, 0, PW, PH), fill=(12, 14, 20))
    on = lt > 0.5
    if on:
        img = add_light(img, 360, 250, 300, (40, 120, 80), 0.7)
        d = D(img)
    d.rr((220, 100, 500, 620), 14, fill=(150, 46, 36), outline=INK, w=5)
    d.rect((260, 150, 460, 300), fill=(20, 60, 40) if on else (20, 24, 28))
    if on:
        d.d.text((360 * K, 200 * K), "PUMP 4", font=font("InterDisplay-Black.otf", 34 * K), fill=(130, 255, 170), anchor="mm")
        d.d.text((360 * K, 250 * K), "0.000 GAL", font=font("InterDisplay-Bold.otf", 26 * K), fill=(130, 255, 170), anchor="mm")
    d.d.text((360 * K, 400 * K), "4", font=font("InterDisplay-Black.otf", 120 * K), fill=(255, 210, 120), anchor="mm")
    return img


def sc_heads_turn(t, lt):
    img = P()
    night_sky(img)
    d = D(img)
    d.rect((0, 320, PW, PH), fill=(30, 30, 36))
    d.poly([(330, 300), (390, 300), (PW, PH), (0, PH)], fill=(40, 40, 46))
    rnd = random.Random(31)
    for i in range(14):
        depth = rnd.random() ** 1.4
        x = 360 + (rnd.random() - 0.5) * (80 + 600 * depth)
        y = 310 + 250 * depth
        s = 0.12 + 0.4 * depth
        zombie(d, x, y - 110 * s, s, t, i, color=mix((40, 40, 46), (120, 130, 112), depth), shirt=(50, 48, 44),
               up=lt > 0.8)
    img = add_light(img, 680, 600, 160, (40, 120, 80), 0.4)
    return img


def sc_filling(t, lt):
    img = P()
    d = D(img)
    d.rect((0, 0, PW, PH), fill=(16, 18, 24))
    img = add_light(img, 520, 120, 260, (40, 120, 80), 0.5)
    d = D(img)
    d.rect((0, 520, PW, PH), fill=(40, 40, 46))
    k = (lt / 4.0) % 1
    can(d, 300, 420, 1.8, fill_k=k)
    d.line([(560, 0), (560, 200), (420, 300)], fill=(20, 20, 20), w=14)
    d.rr((370, 280, 440, 330), 8, fill=(40, 40, 44), outline=INK, w=3)
    d.line([(380, 320), (340, 330)], fill=(60, 60, 64), w=8)
    d.d.text((560 * K, 140 * K), f"{k * 5:.3f}", font=font("InterDisplay-Bold.otf", 30 * K), fill=(130, 255, 170), anchor="mm")
    return img


def sc_coming(t, lt):
    img = lot_dark(P(), t, glow=1.0)
    d = D(img)
    k = ease(lt / 5.0)
    for i, (x0, y0) in enumerate(((60, 300), (650, 310), (520, 290), (140, 320))):
        x = x0 + (290 - x0) * k * 0.6
        zombie(d, x, y0 + 30 * k, 0.4 + 0.15 * k, t, i, color=(110, 124, 104), shirt=(60, 58, 52))
    return img


def sc_yank(t, lt):
    img = lot_dark(P(), t, glow=0.8)
    d = D(img)
    stick(d, 330, 310, 0.6, "you", face="scared", arms="shrug", t=t * 4, tint=NIGHT_TINT, look=-1)
    for i in range(2):
        a = clamp(lt / 0.8 - i * 0.3)
        can(d, 300 - 120 * a + i * 40, 380 - 60 * math.sin(a * math.pi), 0.5)
    return img


def sc_ignition(t, lt):
    img = road_pov(P(), t * 0.02, speed=0.0, glow=1.0 if lt > 1.6 else 0.0, sky=True)
    img = dashboard(img, fuel_light=False, radio_glow=lt > 1.4)
    if lt < 1.6:
        img = dim(img, 0.5)
    return img


def sc_faces(t, lt):
    img = road_pov(P(), t * 0.05, speed=0.0, glow=1.0)
    d = D(img)
    rnd = random.Random(8)
    for i in range(9):
        x = 80 + i * 70 + rnd.uniform(-20, 20)
        s = 0.5 + rnd.random() * 0.4
        zombie(d, x, 300 + rnd.uniform(-10, 20), s, t, i, color=(160, 172, 140), shirt=(80, 76, 66))
    return dashboard(img)


def sc_drive_through(t, lt):
    img = road_pov(P(), t, speed=1.8, glow=1.0)
    d = D(img)
    for i in range(3):
        ph = (lt * 0.7 + i / 3) % 1
        side = -1 if i % 2 else 1
        x = 360 + side * (60 + 300 * ph)
        zombie(d, x, 290 + 120 * ph, 0.4 + 0.9 * ph, t, i)
    img = dashboard(img, wheel_rot=10 * math.sin(t * 6))
    sh = 6 if (lt % 1.3) < 0.12 else 0
    if sh:
        img = img.transform(img.size, Image.AFFINE, (1, 0, sh * K, 0, 1, sh * K))
    return img


def sc_mile_signs(t, lt):
    img = road_pov(P(), t, speed=1.5, glow=1.0)
    d = D(img)
    num = "128" if lt < 1.8 else "129"
    k = ease((lt % 1.8) / 1.8)
    x, y, s = 470 + 220 * k, 300 + 120 * k, 0.4 + 1.3 * k
    d.rect((x - 4 * s, y, x + 4 * s, y + 110 * s), fill=(150, 150, 156))
    d.rr((x - 30 * s, y - 70 * s, x + 30 * s, y), 4 * s, fill=(26, 110, 60), outline=(240, 240, 240), w=2 * s)
    d.d.text((x * K, (y - 50 * s) * K), "MILE", font=font("InterDisplay-Bold.otf", int(14 * s * K)), fill=(240, 240, 240), anchor="mm")
    d.d.text((x * K, (y - 24 * s) * K), num, font=font("InterDisplay-Black.otf", int(24 * s * K)), fill=(240, 240, 240), anchor="mm")
    return dashboard(img)


def motel_exterior(img, t, lights_on=False):
    night_sky(img)
    d = D(img)
    d.rect((0, 380, PW, PH), fill=(36, 36, 42))
    d.rect((60, 200, 660, 420), fill=(150, 120, 96), outline=INK, w=4)
    d.rect((60, 190, 660, 214), fill=(90, 70, 60), outline=INK, w=3)
    for i in range(6):
        x = 90 + i * 96
        d.rect((x, 290, x + 50, 410), fill=(70, 50, 44), outline=INK, w=3)
        d.rect((x + 58, 300, x + 86, 340), fill=(30, 34, 44), outline=INK, w=2)
        d.d.text(((x + 25) * K, 280 * K), str(9 + i), font=font("InterDisplay-Bold.otf", 16 * K), fill=(240, 230, 210), anchor="mm")
    d.rect((640, 60, 650, 200), fill=(70, 70, 76))
    d.rr((520, 40, 700, 110), 8, fill=(40, 40, 50), outline=(90, 90, 100), w=3)
    d.d.text((610 * K, 66 * K), "STARLIGHT", font=font("InterDisplay-Black.otf", 24 * K),
             fill=(255, 120, 200) if lights_on else (80, 70, 80), anchor="mm")
    d.d.text((610 * K, 94 * K), "MOTEL", font=font("InterDisplay-Bold.otf", 18 * K),
             fill=(255, 120, 200) if lights_on else (80, 70, 80), anchor="mm")
    return img


def sc_motel(t, lt):
    img = motel_exterior(P(), t)
    img = add_light(img, 360, 640, 360, (110, 104, 70), 0.6)
    return dim(img, 0.2)


def sc_room12(t, lt):
    img = motel_exterior(P(), t)
    d = D(img)
    x = 90 + 3 * 96
    d.rect((x, 290, x + 50, 410), fill=(8, 8, 12), outline=INK, w=3)
    d.poly([(x + 50, 290), (x + 76, 300), (x + 76, 412), (x + 50, 410)], fill=(70, 50, 44), outline=INK, w=3)
    img = add_light(img, x + 25, 450, 160, (110, 104, 70), 0.5)
    return dim(img, 0.15)


def sc_room_inside(t, lt):
    img = P()
    d = D(img)
    d.rect((0, 0, PW, PH), fill=(60, 50, 56))
    d.rect((0, 420, PW, PH), fill=(70, 56, 50))
    for x in (110, 400):
        d.rr((x, 330, x + 220, 470), 10, fill=(200, 196, 186), outline=INK, w=4)
        d.rr((x + 10, 320, x + 80, 352), 10, fill=(240, 236, 226), outline=INK, w=2)
        d.rect((x, 400, x + 220, 470), fill=(120, 60, 60), outline=INK, w=3)
    for i, (x, c) in enumerate(((620, (60, 110, 60)), (670, (60, 80, 140)))):
        d.rr((x - 24, 470, x + 24, 560), 12, fill=c, outline=INK, w=3)
        d.rr((x - 14, 456, x + 14, 478), 6, outline=INK, w=3)
    img = add_light(img, 360, 640, 400, (110, 104, 70), 0.5)
    return dim(img, 0.35)


def sc_cb_bed(t, lt):
    img = sc_room_inside(t, lt)
    img = cb_radio(img, t, 300, 360, 0.55, live=True)
    return img


def sc_recorder(t, lt):
    img = P()
    d = D(img)
    d.rect((0, 0, PW, PH), fill=(120, 60, 60))
    d.rr((150, 160, 570, 480), 16, fill=(40, 40, 46), outline=INK, w=5)
    for cx in (270, 450):
        d.circ(cx, 290, 70, fill=(200, 190, 170), outline=INK, w=4)
        a = t * 3
        for k in range(3):
            aa = a + k * 2.09
            d.line([(cx, 290), (cx + 60 * math.cos(aa), 290 + 60 * math.sin(aa))], fill=(60, 50, 40), w=8)
        d.circ(cx, 290, 18, fill=(40, 40, 46))
    d.rect((200, 380, 520, 440), fill=(30, 30, 34))
    d.circ(500, 200, 10, fill=(255, 40, 30) if (t % 1) < 0.6 else (90, 20, 20))
    d.poly([(100, 420), (620, 380), (630, 420), (110, 460)], fill=(220, 210, 170), outline=INK, w=2)
    d.rr((480, 440, 640, 520), 14, fill=(30, 30, 34), outline=INK, w=3)
    return dim(img, 0.25)


def sc_doorway(t, lt):
    img = motel_exterior(P(), t)
    img = dim(img, 0.2)
    d = D(img)
    d.rect((0, 0, 200, PH), fill=(14, 12, 16))
    d.rect((520, 0, PW, PH), fill=(14, 12, 16))
    stick(d, 360, 330, 1.3, "you", face="worried", t=t, tint=(24, 24, 30))
    return img


def sc_convoy(t, lt):
    img = P()
    night_sky(img)
    d = D(img)
    d.rect((0, 320, PW, PH), fill=(30, 30, 36))
    d.poly([(330, 300), (390, 300), (PW, PH), (0, PH)], fill=(40, 40, 46))
    k = ease(lt / 6.0)
    for i in range(7):
        f = clamp(i / 7 * 0.6 + k * 0.4)
        y = 300 + 200 * f ** 2
        x = 360 + (i % 2 - 0.5) * 30 * f
        r = 3 + 26 * f ** 2
        img = add_light(img, x, y, int(30 + 140 * f), (130, 120, 80), 0.5)
        d = D(img)
        d.circ(x - r * 1.4, y, r * 0.5, fill=(255, 252, 230))
        d.circ(x + r * 1.4, y, r * 0.5, fill=(255, 252, 230))
        if i % 2 == 0:
            d.rect((x - r * 2, y - r * 2.2, x + r * 2, y - r * 1.6), fill=(255, 220, 120))
    return img
