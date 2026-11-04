"""
Episode 7 scenes. Loaded by ../../gas_station/render.py with its helpers in this namespace.
Reuses Episode 6 (motel, which itself loads Ep1 + Ep4) and the shared cast (Dani, Milo, Boone).
"""
import os as _os

_HERE = _os.path.dirname(_os.path.abspath(__file__))
exec(open(_os.path.join(_HERE, "..", "ep06", "scenes.py")).read().replace(
    '_HERE = _os.path.dirname(_os.path.abspath(__file__))', '_HERE = "%s"' % _os.path.join(_HERE, "..", "ep06")))
_HERE = _os.path.dirname(_os.path.abspath(__file__))
exec(open(_os.path.join(_HERE, "..", "cast.py")).read())

NIGHT_TINT = (150, 156, 180)
SHED = (74, 56, 40)


def ice_machine(d, x, y, s=1.0):
    d.rr((x - 60 * s, y - 150 * s, x + 60 * s, y), 6 * s, fill=(200, 210, 220), outline=INK, w=3 * s)
    d.rect((x - 50 * s, y - 140 * s, x + 50 * s, y - 100 * s), fill=(40, 110, 200))
    d.d.text((x * K, (y - 120 * s) * K), "ICE", font=font("InterDisplay-Black.otf", int(28 * s * K)),
             fill=(255, 255, 255), anchor="mm")


def shed_inside(img, t, slat_light=0.0, sweep=None):
    d = D(img)
    d.rect((0, 0, PW, PH), fill=(20, 16, 14))
    for x in range(0, PW, 60):
        d.rect((x, 0, x + 50, PH), fill=(32, 26, 20))
    d.rect((0, 520, PW, PH), fill=(28, 24, 20))
    for i, c in enumerate(((220, 60, 90), (60, 160, 200), (240, 200, 60), (90, 190, 110))):
        d.rr((560 + i * 34, 260, 584 + i * 34, 540), 12, fill=mix(c, (20, 16, 14), 0.5), outline=INK, w=2)
    if slat_light >= 0.3:
        mask = Image.new("L", img.size, 0)
        md = ImageDraw.Draw(mask)
        off = 0 if sweep is None else sweep
        for x in range(0, PW + 400, 60):
            xx = x - 200 + off
            md.polygon([((xx + 50) * K, 0), ((xx + 60) * K, 0), ((xx - 140) * K, PH * K), ((xx - 150) * K, PH * K)],
                       fill=int(200 * slat_light))
        mask = mask.filter(ImageFilter.GaussianBlur(4 * K))
        img = Image.composite(Image.new("RGB", img.size, (250, 248, 230)), img, mask)
    return img


# --------------------------------------------------------------------------
def sc_hide_truck(t, lt):
    img = motel_exterior(P(), t)
    d = D(img)
    ice_machine(d, 120, 470, 1.0)
    k = ease(lt / 3.0)
    x = 520 - 280 * k
    d.rr((x - 90, 430, x + 90, 490), 10, fill=(70, 34, 26), outline=INK, w=3)
    d.rr((x - 50, 400, x + 50, 436), 8, fill=(62, 30, 24), outline=INK, w=3)
    for wx in (-60, 60):
        d.circ(x + wx, 490, 14, fill=INK)
    ice_machine(d, 120, 470, 1.0) if x < 230 else None
    return dim(img, 0.3)


def sc_shed_psst(t, lt):
    img = P()
    night_sky(img)
    d = D(img)
    d.rect((0, 380, PW, PH), fill=(30, 40, 50))
    d.rect((0, 420, 300, PH), fill=(30, 80, 110), outline=INK, w=3)
    for x in range(0, 300, 30):
        d.line([(x, 380), (x, 420)], fill=(140, 140, 150), w=3)
    d.line([(0, 380), (300, 380)], fill=(140, 140, 150), w=4)
    d.poly([(360, 200), (520, 120), (680, 200)], fill=(90, 66, 46), outline=INK, w=4)
    d.rect((380, 200, 660, 520), fill=SHED, outline=INK, w=4)
    for x in range(380, 660, 28):
        d.line([(x, 200), (x, 520)], fill=(56, 42, 30), w=3)
    k = ease(lt / 1.5)
    d.rect((470, 300, 498, 380), fill=(8, 6, 6))
    if k > 0.3:
        for ex in (478, 490):
            d.circ(ex, 330, 4, fill=(240, 240, 240))
    return dim(img, 0.25)


def sc_shed_in(t, lt):
    img = shed_inside(P(), t, slat_light=0.12)
    d = D(img)
    person(d, 210, 360, 0.95, "dani", face="worried", pose="sit", t=t, tint=NIGHT_TINT, look=1)
    person(d, 360, 400, 0.75, "milo", face="scared", pose="sit", t=t, tint=NIGHT_TINT)
    stick(d, 500, 360, 0.95, "you", pose="sit", face="worried", t=t, tint=NIGHT_TINT, look=-1)
    return img


def sc_dani_close(t, lt):
    img = shed_inside(P(), t, slat_light=0.08)
    d = D(img)
    person(d, 360, 270, 2.4, "dani", face="worried", t=t, tint=(176, 180, 200))
    return img


def sc_you_close(t, lt):
    img = shed_inside(P(), t, slat_light=0.08)
    d = D(img)
    stick(d, 360, 280, 2.4, "you", face="o", t=t, tint=NIGHT_TINT)
    return img


def sc_herding(t, lt):
    img = P()
    night_sky(img)
    d = D(img)
    d.rect((0, 330, PW, PH), fill=(30, 30, 36))
    d.poly([(330, 300), (390, 300), (PW, PH), (0, PH)], fill=(40, 40, 46))
    img = add_light(img, 300, 480, 280, (130, 126, 100), 0.6)
    d = D(img)
    k = (lt * 0.05) % 1
    rnd = random.Random(12)
    for i in range(16):
        depth = rnd.random()
        x = 120 + rnd.random() * 380
        y = 400 + 160 * depth
        s = 0.25 + 0.3 * depth
        zombie(d, x + k * 40, y - 110 * s, s, t, i, color=(150, 166, 138), shirt=(90, 86, 76))
    utility_truck(d, 560, 470, 0.9)
    return img


def sc_milo_close(t, lt):
    img = shed_inside(P(), t, slat_light=0.08)
    d = D(img)
    person(d, 360, 300, 2.2, "milo", face="sad", arms="cap", t=t, tint=(176, 180, 200))
    return img


def sc_dam_map(t, lt):
    img = P()
    d = D(img)
    d.rect((0, 0, PW, PH), fill=(226, 220, 196))
    for i in range(12):
        d.line([(0, i * 60), (PW, i * 60 + 40)], fill=(214, 206, 180), w=2)
    d.line([(560, 0), (520, 200), (600, 420), (560, PH)], fill=(110, 160, 210), w=26)
    d.line([(360, 620), (360, 140), (520, 120)], fill=(70, 70, 76), w=18)
    d.circ(360, 560, 14, fill=(200, 50, 40), outline=INK, w=3)
    d.d.text((340 * K, 560 * K), "MOTEL", font=font("InterDisplay-Bold.otf", 22 * K), fill=(30, 30, 30), anchor="rm")
    d.rect((500, 100, 580, 140), fill=(120, 120, 126), outline=INK, w=3)
    img = add_light(img, 540, 120, 90, (120, 110, 40), 0.6 + 0.2 * math.sin(t * 4))
    d = D(img)
    d.d.text((540 * K, 80 * K), "HARLAN DAM", font=font("InterDisplay-Black.otf", 24 * K), fill=(30, 30, 30), anchor="mm")
    k = ease(lt / 2.5)
    for i in range(int(k * 14)):
        f = i / 14
        y = 540 - 400 * min(1, f * 1.15)
        x = 330 if y > 150 else 330 + (150 - y)
        d.circ(x, y, 5, fill=(200, 50, 40))
    return img


def sc_shed_dark(t, lt):
    img = shed_inside(P(), t, slat_light=0.0)
    d = D(img)
    for x, s in ((210, 0.95), (360, 0.75), (500, 0.95)):
        d.circ(x, 360 + (1 - s) * 140, 34 * s, fill=(14, 12, 12))
    return img


def sc_floodlights(t, lt):
    img = motel_exterior(P(), t)
    img = dim(img, 0.35)
    sweep = 140 + 500 * ((lt / 3.5) % 1)
    beam = Image.new("L", img.size, 0)
    ImageDraw.Draw(beam).polygon([(0, 640 * K), (sweep * K - 70 * K, 150 * K), (sweep * K + 70 * K, 150 * K),
                                  (PW * K * 0.3, 640 * K)], fill=150)
    beam = beam.filter(ImageFilter.GaussianBlur(20 * K))
    img = Image.composite(Image.new("RGB", img.size, (250, 248, 230)), img, beam)
    img = add_light(img, sweep, 330, 180, (120, 120, 100), 0.7)
    return img


def sc_slats(t, lt):
    img = shed_inside(P(), t, slat_light=0.7, sweep=lt * 80)
    d = D(img)
    for i, (x, who) in enumerate(((180, "dani"), (360, "milo"), (540, "you"))):
        d.circ(x, 500, 30, fill=(150, 140, 130) if who != "you" else (150, 140, 130), outline=INK, w=3)
        d.line([(x + 30, 505), (x + 150, 515)], fill=INK, w=5)
    return img


def lot_with_trucks(img, t, n=4):
    night_sky(img)
    d = D(img)
    d.rect((0, 330, PW, PH), fill=(36, 36, 42))
    for i in range(n):
        x = 120 + i * 170
        img = add_light(img, x - 20, 280, 140, (130, 126, 100), 0.5)
        d = D(img)
        utility_truck(d, x, 420, 0.55)
        for j in range(3):
            zombie(d, x - 70 + j * 20, 370, 0.22, t, i * 3 + j, color=(150, 166, 138), shirt=(90, 86, 76))
    return img


def sc_boone_out(t, lt):
    img = lot_with_trucks(P(), t, n=3)
    d = D(img)
    person(d, 360, 380, 1.1, "boone", face="neutral", arms="megaphone", item="megaphone", t=t)
    return img


def sc_shed_scared(t, lt):
    img = shed_inside(P(), t, slat_light=0.35, sweep=lt * 30)
    d = D(img)
    shake = math.sin(t * 30) * 3
    person(d, 250 + math.sin(t * 6) * 8, 330, 1.3, "dani", face="worried", pose="sit", t=t, tint=(176, 180, 200))
    person(d, 470 + shake, 370, 1.05, "milo", face="scared", pose="sit", arms="hug", t=t, tint=(176, 180, 200))
    return img


def sc_trucks_crowd(t, lt):
    img = lot_with_trucks(P(), t, n=4)
    d = D(img)
    for x in range(0, PW, 60):
        d.rect((x + 18, 0, x + 60, PH), fill=(32, 26, 20))
    return img


def sc_boone_low(t, lt):
    img = lot_with_trucks(P(), t, n=2)
    img = dim(img, 0.2)
    d = D(img)
    person(d, 360, 250, 1.8, "boone", face="sad", arms="down", t=t)
    return img


def sc_boone_close(t, lt):
    img = P()
    d = D(img)
    d.rect((0, 0, PW, PH), fill=(14, 14, 20))
    img = add_light(img, 360, 600, 380, (110, 100, 70), 0.7)
    d = D(img)
    person(d, 360, 280, 2.8, "boone", face="sad", t=t)
    return img


def sc_photo_match(t, lt):
    img = P()
    d = D(img)
    d.rect((0, 0, PW, PH), fill=(14, 14, 20))
    k = ease(lt / 1.5)
    d.rect((60, 140, 320, 360), fill=(236, 232, 222), outline=INK, w=4)
    d.rect((74, 154, 306, 346), fill=(150, 190, 220))
    person(d, 190, 230, 0.9, "boone", face="smile", t=0, tint=(250, 240, 226))
    img = add_light(img, 540, 400, 260, (110, 100, 70), 0.5 * k)
    d = D(img)
    person(d, 540, 300, 1.6, "boone", face="sad", t=t)
    return img
