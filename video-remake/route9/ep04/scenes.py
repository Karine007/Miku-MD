"""
Episode 4 scenes. Loaded by ../../gas_station/render.py with its helpers in this namespace
(P, D, grad, dim, stick, stick_lying, store_bg, night_sky, gas_station, zombie, add_light, ease,
clamp, mix, font, K, PW, PH, INK, ORANGE, math, random, np, Image, ImageDraw, ImageFilter).
"""

NIGHT_TINT = (150, 156, 180)


def txt(d, xy, s, size, fill, name="Inter-Regular.otf", anchor="mm"):
    d.d.text((xy[0] * K, xy[1] * K), s, font=font(name, int(size * K)), fill=fill, anchor=anchor)


def cb_radio(img, t, x=360, y=330, s=1.0, live=False, low=True, mic=False):
    """Ray's CB radio, front-on. Returns the image."""
    d = D(img)
    d.rr((x - 230 * s, y - 90 * s, x + 230 * s, y + 90 * s), 14 * s, fill=(40, 42, 48), outline=INK, w=5 * s)
    d.rr((x - 200 * s, y - 60 * s, x - 40 * s, y + 10 * s), 8 * s, fill=(14, 30, 22))
    txt(d, (x - 120 * s, y - 25 * s), "19", int(56 * s), (120, 255, 150) if live or True else (40, 80, 50),
        "InterDisplay-Black.otf")
    txt(d, (x - 120 * s, y + 30 * s), "CHANNEL", int(14 * s), (170, 170, 176), "InterDisplay-Bold.otf")
    for i in range(8):
        on = live and (math.sin(t * 9 + i * 0.7) * 0.5 + 0.5) * 8 > i
        d.rect((x + 0 * s + i * 22 * s, y - 50 * s, x + 14 * s + i * 22 * s, y - 30 * s),
               fill=(255, 170, 40) if on else (60, 52, 40))
    for i, lab in enumerate(("VOL", "SQ")):
        kx = x + 40 * s + i * 110 * s
        d.circ(kx, y + 40 * s, 30 * s, fill=(22, 22, 26), outline=(90, 90, 96), w=3 * s)
        a = math.radians(-220 + (40 if (low and i == 0) else 160))
        d.line([(kx, y + 40 * s), (kx + 24 * s * math.cos(a), y + 40 * s + 24 * s * math.sin(a))],
               fill=(230, 230, 230), w=4 * s)
        txt(d, (kx, y + 80 * s), lab, int(12 * s), (170, 170, 176), "InterDisplay-Bold.otf")
    d.line([(x + 230 * s, y + 40 * s), (x + 280 * s, y + 120 * s), (x + 240 * s, y + 220 * s)], fill=INK, w=5 * s)
    if live:
        img = add_light(img, x + 80 * s, y - 40 * s, int(160 * s), (90, 60, 10), 0.4)
    return img


# --------------------------------------------------------------------------
def sc_alone(t, lt):
    img = store_bg(P(), dark=0.6)
    d = D(img)
    rnd = random.Random(4)
    for _ in range(18):
        x, y = rnd.uniform(60, 680), rnd.uniform(500, 620)
        c = random.Random(int(x)).choice([(200, 60, 50), (240, 180, 40), (60, 120, 190)])
        d.poly([(x, y), (x + 24, y - 6), (x + 28, y + 10), (x + 4, y + 14)], fill=mix(c, (20, 20, 30), 0.6))
    stick(d, 360, 420, 0.9, "you", pose="sit", face="neutral", t=t, tint=NIGHT_TINT)
    return img


def sc_dead_phone(t, lt):
    img = P()
    d = D(img)
    d.rect((0, 0, PW, PH), fill=(20, 22, 28))
    d.line([(720, 640), (470, 470)], fill=INK, w=40)
    d.rr((220, 40, 500, 620), 34, fill=(18, 18, 22), outline=(80, 80, 90), w=5)
    d.rr((236, 56, 484, 604), 24, fill=(6, 6, 8))
    if 1.2 < lt < 1.8:
        d.rr((330, 300, 390, 330), 4, outline=(200, 40, 40), w=3)
        d.rect((334, 304, 340, 326), fill=(200, 40, 40))
    d.circ(500, 470, 46, fill=INK)
    d.line([(486, 430), (470, 360)], fill=INK, w=18)
    return img


def sc_locker(t, lt):
    img = P()
    d = D(img)
    d.rect((0, 0, PW, PH), fill=(30, 32, 40))
    d.rect((150, 40, 570, 620), fill=(110, 116, 124), outline=INK, w=5)
    d.rect((170, 60, 550, 600), fill=(40, 42, 48))
    d.rr((180, 30, 300, 70), 6, fill=(230, 226, 214), outline=INK, w=2)
    txt(d, (240, 50), "RAY", 22, (30, 30, 30), "InterDisplay-Black.otf")
    d.poly([(200, 90), (300, 90), (310, 330), (190, 330)], fill=(170, 40, 36), outline=INK, w=3)
    d.rect((240, 90, 260, 330), fill=(236, 232, 222))
    d.rect((340, 90, 520, 230), fill=(236, 232, 222), outline=INK, w=3)
    d.rect((352, 102, 508, 218), fill=(150, 190, 220))
    stick(d, 430, 140, 0.55, "ray", face="smile", t=0, tint=(250, 240, 226))
    d.poly([(400, 122), (430, 104), (460, 122), (456, 128), (404, 128)], fill=(240, 190, 40), outline=INK, w=2)
    img = cb_radio(img, t, 420, 430, 0.5)
    img = add_light(img, 360, 300, 300, (40, 40, 40), 0.3)
    return img


def sc_cb(t, lt):
    img = P()
    d = D(img)
    d.rect((0, 0, PW, PH), fill=(16, 18, 24))
    d.rect((0, 470, PW, PH), fill=(70, 30, 26))
    return cb_radio(img, t, 340, 320, 1.0)


def sc_cb_knob(t, lt):
    img = P()
    d = D(img)
    d.rect((0, 0, PW, PH), fill=(28, 30, 36))
    d.circ(360, 320, 180, fill=(22, 22, 26), outline=(90, 90, 96), w=8)
    a = math.radians(-220 + 160 - 120 * ease(lt / 2.0))
    d.line([(360, 320), (360 + 150 * math.cos(a), 320 + 150 * math.sin(a))], fill=(230, 230, 230), w=14)
    txt(d, (360, 560), "VOL", 36, (170, 170, 176), "InterDisplay-Bold.otf")
    for i in range(11):
        aa = math.radians(-220 + i * 26)
        d.line([(360 + 200 * math.cos(aa), 320 + 200 * math.sin(aa)), (360 + 220 * math.cos(aa), 320 + 220 * math.sin(aa))],
               fill=(150, 150, 156), w=4)
    d.line([(720, 200), (520, 290)], fill=INK, w=40)
    d.circ(520, 300, 40, fill=INK)
    return img


def sc_cb_mic(t, lt):
    img = store_bg(P(), dark=0.75)
    d = D(img)
    stick(d, 360, 260, 1.6, "you", face="worried", arms="hold", t=t, tint=NIGHT_TINT)
    d.rr((330, 390, 400, 470), 14, fill=(30, 30, 34), outline=INK, w=3)
    for i in range(4):
        d.line([(340, 406 + i * 12), (390, 406 + i * 12)], fill=(60, 60, 66), w=3)
    d.line([(400, 470), (460, 560), (430, 640)], fill=INK, w=5)
    return img


def sc_cb_wait(t, lt):
    img = P()
    d = D(img)
    d.rect((0, 0, PW, PH), fill=(16, 18, 24))
    d.rect((0, 470, PW, PH), fill=(70, 30, 26))
    img = cb_radio(img, t, 340, 320, 1.0)
    d = D(img)
    # clock in the corner, hands spinning: an hour passes
    d.circ(600, 110, 60, fill=(230, 226, 214), outline=INK, w=4)
    a = math.radians(-90 + lt * 360 / 4.0 * 12)
    b = math.radians(-90 + lt * 30 / 4.0)
    d.line([(600, 110), (600 + 46 * math.cos(a), 110 + 46 * math.sin(a))], fill=INK, w=4)
    d.line([(600, 110), (600 + 30 * math.cos(b), 110 + 30 * math.sin(b))], fill=INK, w=6)
    return img


def sc_cb_live(t, lt):
    img = P()
    d = D(img)
    d.rect((0, 0, PW, PH), fill=(16, 18, 24))
    d.rect((0, 470, PW, PH), fill=(70, 30, 26))
    return cb_radio(img, t, 340, 320, 1.0, live=True)


def sc_map(t, lt):
    img = P()
    d = D(img)
    d.rect((0, 0, PW, PH), fill=(226, 220, 196))
    for i in range(12):
        d.line([(0, i * 60), (PW, i * 60 + 40)], fill=(214, 206, 180), w=2)
    d.line([(360, 620), (360, 20)], fill=(70, 70, 76), w=22)
    d.line([(360, 620), (360, 20)], fill=(230, 200, 80), w=3)
    k = ease(lt / 3.5)
    y0, y1 = 520, 140
    for y, lab in ((y0, "MILE 127 \u00b7 GAS STATION"), (y1, "MILE 130 \u00b7 MOTEL")):
        d.circ(360, y, 16, fill=(200, 50, 40), outline=INK, w=3)
        txt(d, (388, y), lab, 22, (30, 30, 30), "InterDisplay-Bold.otf", "lm")
    yy = y0 + (y1 - y0) * k
    for i in range(int(k * 14)):
        y = y0 - (y0 - y1) * i / 14
        d.circ(330, y, 5, fill=(200, 50, 40))
    d.circ(330, yy, 8, fill=(200, 50, 40))
    return img


def sc_pumps_dark(t, lt):
    img = gas_station(P(), t, lights=False, truck=True)
    d = D(img)
    for x in (0, 236, 472, 704):
        d.rect((x, 0, x + 16, PH), fill=(30, 30, 36), outline=INK, w=2)
    d.rect((0, 600, PW, PH), fill=(40, 22, 20))
    return dim(img, 0.45)


def sc_napkin(t, lt):
    img = P()
    d = D(img)
    d.rect((0, 0, PW, PH), fill=(60, 30, 26))
    d.poly([(170, 110), (560, 90), (580, 520), (150, 540)], fill=(244, 242, 236), outline=INK, w=3)
    for i in range(8):
        d.line([(170, 130 + i * 52), (560, 112 + i * 52)], fill=(230, 228, 220), w=2)
    words = ["5.  MOVE", "ONLY AT", "DAWN."]
    k = clamp((lt - 0.6) / 3.0)
    n = int(k * sum(len(w) for w in words))
    f = font("InterDisplay-BoldItalic.otf", 52 * K)
    used = 0
    for i, w in enumerate(words):
        take = max(0, min(len(w), n - used))
        used += len(w)
        if take:
            d.d.text(((220 + i * 8) * K, (200 + i * 90) * K), w[:take], font=f, fill=(30, 40, 120))
    return dim(img, 0.2)


def sc_sleep_cb(t, lt):
    img = store_bg(P(), dark=0.8)
    d = D(img)
    d.poly([(80, 520), (520, 500), (550, 600), (60, 620)], fill=(96, 74, 52), outline=INK, w=3)
    stick_lying(d, 240, 540, "you", "sleep", NIGHT_TINT)
    d.rr((300, 500, 380, 530), 6, fill=(40, 42, 48), outline=INK, w=2)
    d.rect((310, 506, 330, 516), fill=(60, 160, 90))
    for i in range(3):
        ph = (t * 0.6 + i / 3) % 1
        c = mix((30, 30, 40), (150, 160, 170), (1 - ph) * 0.8)
        d.arc((320 - 20 - ph * 50, 470 - ph * 50, 340 + 20 + ph * 50, 530 + ph * 50), 220, 320, fill=c, w=2)
    return img


def sc_draft(t, lt):
    img = store_bg(P(), dark=0.8)
    d = D(img)
    d.poly([(80, 520), (520, 500), (550, 600), (60, 620)], fill=(96, 74, 52), outline=INK, w=3)
    rise = ease(lt / 1.2)
    stick(d, 240, 470 - 60 * rise, 0.85, "you", pose="sit", face="o", t=t, tint=NIGHT_TINT, look=1)
    for i in range(3):
        ph = (t * 0.5 + i / 3) % 1
        a = (1 - ph) * 0.7
        d.circ(290 + ph * 50, 430 - 60 * rise - ph * 30, 8 + ph * 14, fill=mix((26, 28, 36), (200, 206, 214), a))
    for i in range(5):
        y = 200 + i * 60
        ph = (t * 0.8 + i * 0.2) % 1
        d.line([(PW - ph * 400, y), (PW - ph * 400 - 80, y + 6)], fill=(70, 80, 96), w=3)
    return img


def sc_storeroom(t, lt):
    img = P()
    d = D(img)
    d.rect((0, 0, PW, PH), fill=(14, 16, 22))
    d.poly([(0, PH), (220, 420), (500, 420), (PW, PH)], fill=(30, 32, 38))
    for side in (-1, 1):
        for j in range(4):
            x0 = 360 + side * (240 - j * 40)
            d.rect((min(x0, x0 + side * 120), 120 + j * 20, max(x0, x0 + side * 120), 420 - j * 10),
                   fill=(26, 28, 34), outline=INK, w=2)
            for r in range(4):
                y = 150 + r * 70 + j * 10
                d.line([(x0, y), (x0 + side * 120, y)], fill=(40, 42, 50), w=4)
                for b in range(3):
                    bx = x0 + side * (14 + b * 34)
                    d.rect((min(bx, bx + side * 26), y - 30, max(bx, bx + side * 26), y - 2), fill=(56, 46, 36))
    d.rect((300, 200, 420, 420), fill=(60, 66, 76), outline=INK, w=3)
    img = add_light(img, 360, 400, 160, (40, 60, 80), 0.5)
    fog = Image.new("L", img.size, 0)
    fd = ImageDraw.Draw(fog)
    for i in range(10):
        x = 360 + math.sin(t + i) * 80 + (i - 5) * 30
        y = 430 + (i % 3) * 20
        fd.ellipse(((x - 60) * K, (y - 20) * K, (x + 60) * K, (y + 20) * K), fill=50)
    fog = fog.filter(ImageFilter.GaussianBlur(12 * K))
    return Image.composite(Image.new("RGB", img.size, (180, 196, 210)), img, fog)


def sc_dock_open(t, lt):
    img = P()
    night_sky(img)
    d = D(img)
    d.rect((0, 380, PW, PH), fill=(30, 30, 36))
    d.rect((0, 0, PW, 60), fill=(20, 20, 26))
    d.rect((0, 0, 130, PH), fill=(26, 28, 34))
    d.rect((590, 0, PW, PH), fill=(26, 28, 34))
    for y in range(70, 200, 22):
        d.rect((130, y, 590, y + 14), fill=(84, 88, 96), outline=INK, w=2)
    d.rect((130, 520, 590, PH), fill=(54, 56, 62))
    img = add_light(img, 360, 420, 300, (40, 50, 70), 0.6)
    return img


def sc_cooler_empty(t, lt):
    img = P()
    d = D(img)
    d.rect((0, 0, PW, PH), fill=(120, 170, 190))
    d.poly([(0, 0), (140, 120), (140, 460), (0, PH)], fill=(100, 146, 166), outline=INK, w=3)
    d.poly([(PW, 0), (580, 120), (580, 460), (PW, PH)], fill=(100, 146, 166), outline=INK, w=3)
    d.poly([(0, PH), (140, 460), (580, 460), (PW, PH)], fill=(140, 186, 200))
    d.rect((140, 120, 580, 460), fill=(150, 196, 212))
    d.rect((470, 140, 560, 440), fill=(30, 40, 50), outline=INK, w=3)
    d.rr((280, 420, 440, 520), 6, fill=(150, 110, 70), outline=INK, w=3)
    d.poly([(300, 400), (420, 396), (424, 424), (304, 428)], fill=(240, 238, 230), outline=INK, w=2)
    for i in range(4):
        for j in range(5):
            d.rect((312 + j * 20, 402 + i * 6, 326 + j * 20, 406 + i * 6), outline=(80, 80, 80), w=1)
    return dim(img, 0.45)


def sc_footprints(t, lt):
    img = P()
    d = D(img)
    d.rect((0, 0, PW, PH), fill=(60, 62, 70))
    for i in range(6):
        d.line([(0, 100 + i * 100), (PW, 80 + i * 100)], fill=(54, 56, 64), w=3)
    img = add_light(img, 360, 200, 400, (40, 46, 60), 0.6)
    d = D(img)
    k = ease(lt / 3.0)
    for i in range(int(2 + k * 7)):
        side = -1 if i % 2 else 1
        x = 360 + side * 28 + i * 6
        y = 600 - i * 70
        d.ell((x - 18, y - 32, x + 18, y + 32), fill=(36, 40, 50))
        for tdx in (-12, -4, 4, 12):
            d.circ(x + tdx, y - 40, 5, fill=(36, 40, 50))
    return dim(img, 0.25)


def sc_footprints_far(t, lt):
    img = P()
    night_sky(img)
    d = D(img)
    d.rect((0, 320, PW, PH), fill=(34, 34, 40))
    d.poly([(330, 300), (390, 300), (PW, PH), (0, PH)], fill=(44, 44, 50))
    for i in range(10):
        f = i / 10
        x = 360 + (1 - f) * 40 * (1 if i % 2 else -1) * 0.5
        y = PH - (PH - 320) * f
        s = 1 - f * 0.85
        d.ell((x - 10 * s, y - 16 * s, x + 10 * s, y + 16 * s), fill=(24, 26, 32))
    d.rect((540, 250, 548, 300), fill=(70, 70, 76))
    d.rr((500, 220, 600, 252), 4, fill=(40, 40, 46), outline=(90, 90, 96), w=2)
    txt(d, (550, 236), "STARLIGHT", 13, (110, 110, 120), "InterDisplay-Bold.otf")
    k = ease(lt / 4)
    if k > 0.2:
        zombie(d, 372, 296 - 4, 0.12, t, 0, color=(110, 30, 30), shirt=(140, 30, 30))
    return dim(img, 0.15)
