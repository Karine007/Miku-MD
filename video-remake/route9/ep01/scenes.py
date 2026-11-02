"""
Episode 1 scenes. Loaded by ../../gas_station/render.py with its helpers already in this
namespace (P, D, grad, dim, stick, zombie, night_sky, gas_station, add_light, ease, clamp, mix,
font, K, PW, PH, INK, ORANGE, math, random, np, Image, ImageDraw, ImageFilter).
Each sc_<name>(t, lt) returns the 720x640 panel at 2x.
"""

ROAD = (44, 44, 50)
DASH = (18, 18, 22)


def road_pov(img, t, speed=1.0, horizon=270, glow=0.0, lane_x=0.0, sky=True):
    """Driver's view: sky, dark hills, converging road, moving lane dashes, headlight cone."""
    if sky:
        night_sky(img)
    d = D(img)
    vx = 360 + lane_x
    d.poly([(0, horizon + 10), (PW, horizon + 10), (PW, PH), (0, PH)], fill=(22, 24, 28))
    d.poly([(vx - 12, horizon), (vx + 12, horizon), (PW + 120, PH), (-120, PH)], fill=ROAD)
    for k in range(10):
        f = ((k / 10) + t * 0.9 * speed) % 1.0
        z0, z1 = f ** 2.2, min(1, (f + 0.05) ** 2.2)
        y0, y1 = horizon + (PH - horizon) * z0, horizon + (PH - horizon) * z1
        w0, w1 = 2 + 10 * z0, 2 + 10 * z1
        d.poly([(vx - w0, y0), (vx + w0, y0), (vx + w1, y1), (vx - w1, y1)], fill=(220, 200, 120))
    for side in (-1, 1):
        d.line([(vx + side * 14, horizon), (vx + side * 470, PH)], fill=(200, 200, 200), w=3)
    cone = Image.new("L", img.size, 0)
    ImageDraw.Draw(cone).polygon([(vx * K - 90 * K, horizon * K + 60 * K), (vx * K + 90 * K, horizon * K + 60 * K),
                                  (PW * K + 200 * K, PH * K), (-200 * K, PH * K)], fill=int(70 + 60 * glow))
    cone = cone.filter(ImageFilter.GaussianBlur(30 * K))
    return Image.composite(Image.new("RGB", img.size, (230, 220, 170)), img, cone)


def dashboard(img, wheel_rot=0.0, fuel_light=False, radio_glow=False):
    d = D(img)
    d.poly([(0, 500), (PW, 500), (PW, PH), (0, PH)], fill=DASH)
    d.rect((0, 492, PW, 504), fill=(34, 34, 40))
    cx, cy = 230, 640
    d.circ(cx, cy, 150, outline=(10, 10, 12), w=26)
    a = math.radians(-90 + wheel_rot)
    d.line([(cx, cy), (cx + 140 * math.cos(a - 1.2), cy + 140 * math.sin(a - 1.2))], fill=(10, 10, 12), w=22)
    d.line([(cx, cy), (cx + 140 * math.cos(a + 1.2), cy + 140 * math.sin(a + 1.2))], fill=(10, 10, 12), w=22)
    for gx in (200, 268):
        d.circ(gx, 540, 26, fill=(28, 30, 36), outline=(60, 60, 70), w=2)
    if fuel_light:
        d.circ(268, 540, 8, fill=(255, 150, 30))
    rc = (120, 200, 255) if radio_glow else (40, 50, 60)
    d.rr((470, 520, 600, 560), 6, fill=(12, 14, 18), outline=(60, 60, 70), w=2)
    d.rect((480, 530, 590, 550), fill=rc if radio_glow else (20, 26, 30))
    return img


def phone_frame(img, t, bg=(24, 26, 34)):
    """Phone held in a hand, close-up. Returns D and the screen box (inner)."""
    d = D(img)
    d.rect((0, 0, PW, PH), fill=bg)
    d.line([(720, 640), (470, 470)], fill=INK, w=40)
    d.rr((220, 40, 500, 620), 34, fill=(18, 18, 22), outline=(80, 80, 90), w=5)
    d.rr((236, 56, 484, 604), 24, fill=(236, 236, 240))
    return d


def thumb(d):
    d.circ(500, 470, 46, fill=INK)
    d.line([(486, 430), (470, 360)], fill=INK, w=18)


def txt(d, xy, s, size, fill, name="Inter-Regular.otf", anchor="lm"):
    d.d.text((xy[0] * K, xy[1] * K), s, font=font(name, int(size * K)), fill=fill, anchor=anchor)


def status_bar(d, battery="31%", bars=0, red=False):
    txt(d, (266, 86), battery, 13, (220, 40, 40) if red else (30, 30, 30), "Inter-Bold.otf")
    for i in range(4):
        d.rect((440 + i * 9, 86 - i * 5, 446 + i * 9, 96), fill=(40, 40, 44) if i < bars else (190, 190, 196))
    if bars == 0:
        txt(d, (478, 90), "x", 14, (220, 40, 40), "Inter-Bold.otf", "mm")


# --------------------------------------------------------------------------
def sc_garage(t, lt):
    img = P()
    d = D(img)
    d.rect((0, 0, PW, PH), fill=(64, 66, 72))
    d.rect((0, 0, PW, 90), fill=(40, 42, 48))
    for x in range(0, PW, 180):
        d.rect((x + 40, 84, x + 140, 94), fill=(250, 246, 220))
    img = add_light(img, 360, 120, 420, (60, 60, 50), 0.6)
    d = D(img)
    d.poly([(0, 420), (PW, 420), (PW, PH), (0, PH)], fill=(92, 94, 98))
    for x in (60, 300, 540):
        d.rect((x, 120, x + 40, 420), fill=(110, 112, 118), outline=INK, w=3)
        d.rect((x, 200, x + 40, 230), fill=(230, 190, 40))
    d.d.text((520 * K, 160 * K), "LEVEL 3", font=font("InterDisplay-Black.otf", 30 * K), fill=(230, 190, 40), anchor="mm")
    for i, x in enumerate((440, 600)):
        d.line([(x, 440), (x + 40, 600)], fill=(230, 230, 220), w=4)
    d.rr((440, 380, 640, 470), 18, fill=(66, 98, 140), outline=INK, w=4)
    d.rr((470, 340, 610, 392), 14, fill=(56, 84, 120), outline=INK, w=3)
    d.rect((482, 348, 598, 386), fill=(150, 176, 200))
    for wx in (480, 600):
        d.circ(wx, 470, 20, fill=INK)
    walk = min(1.0, lt / 3.5)
    stick(d, 140 + walk * 220, 300, 0.95, "you", face="neutral", t=t * 3, look=1)
    return img


def sc_missed_call(t, lt):
    img = P()
    d = phone_frame(img, t)
    status_bar(d, "64%", bars=3)
    txt(d, (360, 140), "9:15", 54, (30, 30, 30), "Inter-Light.otf", "mm")
    txt(d, (360, 186), "Tuesday", 15, (100, 100, 110), "Inter-Medium.otf", "mm")
    k = ease(lt / 0.4)
    y = 250 - 20 * (1 - k)
    d.rr((250, y, 470, y + 70), 16, fill=mix((236, 236, 240), (255, 255, 255), k), outline=mix((236, 236, 240), (210, 210, 216), k), w=2)
    d.circ(282, y + 35, 18, fill=mix((236, 236, 240), (220, 60, 50), k))
    txt(d, (282, y + 35), "M", 16, (255, 255, 255), "Inter-Bold.otf", "mm")
    txt(d, (312, y + 24), "Mom", 16, mix((236, 236, 240), (20, 20, 20), k), "Inter-Bold.otf")
    txt(d, (312, y + 48), "Missed call  ·  8:41 PM", 12, mix((236, 236, 240), (200, 50, 40), k))
    thumb(d)
    return img


def sc_voicemail(t, lt):
    img = P()
    d = phone_frame(img, t)
    status_bar(d, "63%", bars=3)
    txt(d, (360, 120), "Voicemail", 20, (30, 30, 30), "Inter-Bold.otf", "mm")
    d.circ(360, 220, 50, fill=(220, 60, 50))
    txt(d, (360, 220), "M", 44, (255, 255, 255), "Inter-Bold.otf", "mm")
    txt(d, (360, 296), "Mom", 22, (20, 20, 20), "Inter-SemiBold.otf", "mm")
    txt(d, (360, 324), "8:41 PM  ·  0:09", 13, (120, 120, 130), "Inter-Regular.otf", "mm")
    prog = clamp(lt / 7.0)
    rnd = random.Random(3)
    for i in range(30):
        x = 262 + i * 6.6
        h = 4 + rnd.random() * 26
        c = (40, 120, 240) if i / 30 < prog else (190, 190, 200)
        d.rect((x, 400 - h / 2, x + 3.5, 400 + h / 2), fill=c)
    d.circ(360, 480, 30, fill=(40, 120, 240))
    d.rect((350, 466, 356, 494), fill=(255, 255, 255))
    d.rect((364, 466, 370, 494), fill=(255, 255, 255))
    thumb(d)
    return img


def sc_call_failed(t, lt):
    img = P()
    d = phone_frame(img, t)
    status_bar(d, "62%", bars=2)
    d.rr((236, 56, 484, 604), 24, fill=(40, 44, 54))
    txt(d, (360, 150), "Mom", 30, (240, 240, 245), "Inter-Light.otf", "mm")
    st = "calling..." if lt < 1.3 else "Call failed"
    txt(d, (360, 190), st, 14, (180, 180, 190) if lt < 1.3 else (240, 90, 80), "Inter-Regular.otf", "mm")
    d.circ(360, 300, 50, fill=(110, 112, 122))
    txt(d, (360, 300), "M", 42, (245, 245, 250), "Inter-SemiBold.otf", "mm")
    d.circ(360, 500, 32, fill=(240, 60, 50))
    thumb(d)
    return img


def sc_onramp(t, lt):
    img = road_pov(P(), t, speed=0.6, lane_x=60 * (1 - ease(lt / 3)))
    d = D(img)
    d.rect((520, 120, 526, 300), fill=(90, 90, 96))
    d.rr((440, 70, 680, 170), 8, fill=(26, 110, 60), outline=(240, 240, 240), w=3)
    d.d.text((560 * K, 104 * K), "PINE HOLLOW", font=font("InterDisplay-Bold.otf", 26 * K), fill=(240, 240, 240), anchor="mm")
    d.d.text((560 * K, 142 * K), "198", font=font("InterDisplay-Bold.otf", 30 * K), fill=(240, 240, 240), anchor="mm")
    d.rr((440, 30, 560, 66), 6, fill=(240, 240, 240), outline=INK, w=2)
    d.d.text((500 * K, 48 * K), "9 NORTH", font=font("InterDisplay-Black.otf", 20 * K), fill=(30, 30, 30), anchor="mm")
    return dashboard(img)


def sc_traffic(t, lt):
    img = road_pov(P(), t, speed=1.0)
    d = D(img)
    d.poly([(300, 270), (330, 270), (-160, PH), (-460, PH)], fill=(36, 36, 42))
    rnd = random.Random(7)
    for k in range(16):
        f = ((k / 16) + t * 0.35) % 1.0
        z = f ** 2
        y = 272 + (PH - 272) * z
        x = 316 - (316 + 360) * z + rnd.uniform(-10, 10) * z
        r = 2 + 18 * z
        img = add_light(img, x - r * 1.6, y, int(16 + 120 * z), (120, 110, 80), 0.6)
        d = D(img)
        d.circ(x - r * 1.6, y, r * 0.5, fill=(255, 250, 220))
        d.circ(x + r * 0.2, y, r * 0.5, fill=(255, 250, 220))
    return dashboard(img)


def sc_car_radio(t, lt):
    img = P()
    d = D(img)
    d.rect((0, 0, PW, PH), fill=(14, 14, 18))
    d.rr((80, 200, 640, 440), 20, fill=(24, 24, 30), outline=(60, 60, 70), w=4)
    d.rr((140, 240, 580, 330), 10, fill=(20, 60, 80))
    img = add_light(img, 360, 285, 260, (20, 70, 100), 0.7)
    d = D(img)
    d.d.text((360 * K, 270 * K), "FM 98.1", font=font("InterDisplay-Bold.otf", 34 * K), fill=(150, 230, 255), anchor="mm")
    d.d.text((360 * K, 308 * K), "EMERGENCY ALERT", font=font("InterDisplay-Black.otf", 20 * K),
             fill=(255, 120, 90) if (t * 2) % 1 < 0.6 else (100, 160, 190), anchor="mm")
    for cx in (180, 540):
        d.circ(cx, 386, 30, fill=(36, 36, 44), outline=(70, 70, 80), w=3)
    for i in range(8):
        d.rr((250 + i * 28, 370, 270 + i * 28, 400), 4, fill=(36, 36, 44))
    return img


def sc_mile_marker(t, lt):
    img = road_pov(P(), t, speed=1.2)
    d = D(img)
    k = ease(lt / 2.0)
    x = 470 + 220 * k
    y = 300 + 120 * k
    s = 0.4 + 1.3 * k
    d.rect((x - 4 * s, y, x + 4 * s, y + 110 * s), fill=(150, 150, 156))
    d.rr((x - 30 * s, y - 70 * s, x + 30 * s, y), 4 * s, fill=(26, 110, 60), outline=(240, 240, 240), w=2 * s)
    d.d.text((x * K, (y - 50 * s) * K), "MILE", font=font("InterDisplay-Bold.otf", int(14 * s * K)), fill=(240, 240, 240), anchor="mm")
    d.d.text((x * K, (y - 24 * s) * K), "118", font=font("InterDisplay-Black.otf", int(24 * s * K)), fill=(240, 240, 240), anchor="mm")
    return dashboard(img)


def sc_trooper(t, lt):
    img = road_pov(P(), t, speed=0.5)
    d = D(img)
    flash_red = (t * 3) % 1 < 0.5
    img = add_light(img, 520, 360, 240, (140, 20, 20) if flash_red else (20, 40, 160), 0.7)
    d = D(img)
    d.rr((420, 330, 640, 420), 14, fill=(230, 230, 228), outline=INK, w=4)
    d.rr((460, 296, 600, 340), 10, fill=(40, 46, 56), outline=INK, w=3)
    d.rect((420, 360, 640, 380), fill=(30, 40, 70))
    d.d.text((530 * K, 371 * K), "STATE TROOPER", font=font("InterDisplay-Black.otf", 14 * K), fill=(230, 230, 228), anchor="mm")
    d.rr((490, 284, 516, 296), 3, fill=(255, 60, 60) if flash_red else (90, 30, 30))
    d.rr((544, 284, 570, 296), 3, fill=(60, 100, 255) if not flash_red else (30, 40, 90))
    d.poly([(420, 340), (380, 330), (380, 410), (420, 410)], fill=(220, 220, 218), outline=INK, w=3)
    for wx in (450, 610):
        d.circ(wx, 420, 18, fill=INK)
    return dashboard(img, radio_glow=True)


def man_in_road(img, t, lt, s=1.0, x=360, turned=False, color=(150, 166, 138)):
    d = D(img)
    img = add_light(img, x, 300, int(160 * s), (90, 86, 60), 0.6)
    d = D(img)
    if not turned:
        r = 30 * s
        y = 250
        d.poly([(x - 24 * s, y + r), (x + 24 * s, y + r), (x + 26 * s, y + r + 90 * s), (x - 26 * s, y + r + 90 * s)],
               fill=(96, 92, 80), outline=INK, w=3 * s)
        for lx in (-14, 14):
            d.line([(x + lx * s * 0.5, y + r + 88 * s), (x + lx * s, y + r + 160 * s)], fill=INK, w=5 * s)
        for side in (-1, 1):
            d.line([(x + side * 22 * s, y + r + 10 * s), (x + side * 30 * s, y + r + 76 * s)], fill=INK, w=5 * s)
        d.circ(x, y, r, fill=(60, 56, 50), outline=INK, w=3 * s)
    else:
        zombie(d, x, 250, s, t, 0)
    return img


def sc_man_road(t, lt):
    img = road_pov(P(), t, speed=0.8 * (1 - ease(lt / 2)), glow=0.6)
    img = man_in_road(img, t, lt, s=0.55 + 0.25 * ease(lt / 2))
    return dashboard(img)


def sc_brake(t, lt):
    img = road_pov(P(), t * 0.05, speed=0.0, glow=0.7)
    img = man_in_road(img, t, lt, s=0.9)
    img = add_light(img, 360, 700, 500, (120, 20, 10), 0.35)
    img = dashboard(img, wheel_rot=-6)
    sh = math.exp(-lt * 4) * 10
    if sh > 0.3:
        img = img.transform(img.size, Image.AFFINE, (1, 0, sh * math.sin(lt * 70) * K, 0, 1, sh * 0.5 * K))
    return img


def sc_man_turns(t, lt):
    img = P()
    d = D(img)
    d.rect((0, 0, PW, PH), fill=(10, 10, 14))
    img = add_light(img, 360, 320, 360, (110, 104, 74), 0.85)
    d = D(img)
    k = ease((lt - 0.6) / 1.8)
    if k < 0.5:
        d.circ(360, 300, 150, fill=(60, 56, 50), outline=INK, w=6)
        d.poly([(200, 470), (520, 470), (560, PH), (160, PH)], fill=(96, 92, 80), outline=INK, w=6)
    else:
        d.poly([(200, 470), (520, 470), (560, PH), (160, PH)], fill=(96, 92, 80), outline=INK, w=6)
        d.circ(360, 300, 150, fill=(150, 166, 138), outline=INK, w=6)
        for ex in (-50, 50):
            d.circ(360 + ex, 280, 30, fill=(40, 44, 40))
            d.circ(360 + ex, 280, 9, fill=(210, 214, 200))
        d.ell((330, 340, 390, 400), fill=(50, 40, 40))
    return img


def sc_man_walks(t, lt):
    img = road_pov(P(), t * 0.05, speed=0.0, glow=0.7)
    d = D(img)
    for x in (30, 690):
        for i in range(4):
            tx = x + (i - 1.5) * 40 * (1 if x < 360 else -1)
            d.poly([(tx, 120 + i * 20), (tx - 50, 330), (tx + 50, 330)], fill=(16, 26, 22), outline=INK, w=2)
    k = ease(lt / 3.5)
    img = man_in_road(img, t, lt, s=0.9 + 0.4 * k, turned=True)
    d = D(img)
    if lt > 1.8:
        a = ease((lt - 1.8) / 1.2)
        zombie(d, 120 + 40 * a, 270, 0.6, t, 1.3, color=mix((16, 26, 22), (130, 146, 118), a), shirt=mix((16, 26, 22), (80, 76, 66), a))
        zombie(d, 600 - 40 * a, 280, 0.62, t, 2.1, color=mix((16, 26, 22), (130, 146, 118), a), shirt=mix((16, 26, 22), (80, 76, 66), a))
    return dashboard(img)


def sc_swerve(t, lt):
    img = road_pov(P(), t, speed=1.8, lane_x=-120 * math.sin(min(1, lt / 1.6) * math.pi), glow=0.4)
    d = D(img)
    side = 1 if lt < 1.0 else -1
    zx = 360 + side * (120 + lt * 260)
    if 0.2 < lt < 2.0:
        zombie(d, zx, 300, 0.7 + lt * 0.4, t, 0)
    img = dashboard(img, wheel_rot=-35 * math.sin(min(1, lt / 1.6) * math.pi))
    ang = -6 * math.sin(min(1, lt / 1.6) * math.pi)
    return img.rotate(ang, resample=Image.BICUBIC, center=(PW * K / 2, PH * K / 2), fillcolor=(10, 10, 14))


def sc_mirror(t, lt):
    img = road_pov(P(), t, speed=1.0)
    img = dashboard(img)
    m = Image.new("RGB", (300 * K, 110 * K), (0, 0, 0))
    mm = P()
    night_sky(mm)
    dm = D(mm)
    dm.poly([(0, 280), (PW, 280), (PW, PH), (0, PH)], fill=(22, 24, 28))
    dm.poly([(350, 270), (370, 270), (PW, PH), (0, PH)], fill=ROAD)
    mm = add_light(mm, 360, 600, 300, (120, 10, 10), 0.6)
    dm = D(mm)
    for i, (x, s) in enumerate(((300, 0.9), (420, 0.8), (360, 0.6))):
        zombie(dm, x, 330 - s * 30, s, t, i, color=(110, 30, 30), shirt=(60, 20, 20))
    m = mm.resize((460 * K, 409 * K)).crop((0, 110 * K, 460 * K, 290 * K))
    d = D(img)
    d.rr((124, 26, 596, 218), 22, fill=(10, 10, 12))
    img.paste(m, (130 * K, 32 * K))
    d = D(img)
    d.rr((130, 32, 590, 212), 20, outline=(10, 10, 12), w=8)
    d.rect((350, 0, 370, 32), fill=(10, 10, 12))
    return img


def sc_hands(t, lt):
    img = road_pov(P(), t, speed=0.9)
    img = dashboard(img, radio_glow=lt < 2.6)
    d = D(img)
    sh = math.sin(t * 40) * 2.5
    for hx in (100, 360):
        d.circ(hx + sh, 520, 30, fill=INK)
        d.line([(hx + sh, 540), (hx + sh + (hx - 230) * 0.3, PH)], fill=INK, w=16)
    if 2.6 < lt < 2.9:
        img = add_light(img, 535, 540, 60, (80, 120, 160), 0.6)
    return img


def sc_fuel(t, lt):
    img = P()
    d = D(img)
    d.rect((0, 0, PW, PH), fill=DASH)
    for gx, lab in ((220, "MPH"), (500, "FUEL")):
        d.circ(gx, 320, 150, fill=(24, 26, 32), outline=(70, 70, 80), w=6)
        for i in range(9):
            a = math.radians(150 + i * 30)
            d.line([(gx + 120 * math.cos(a), 320 + 120 * math.sin(a)), (gx + 140 * math.cos(a), 320 + 140 * math.sin(a))],
                   fill=(200, 200, 210), w=4)
        d.d.text((gx * K, 400 * K), lab, font=font("InterDisplay-Bold.otf", 22 * K), fill=(180, 180, 190), anchor="mm")
    a = math.radians(150 + 120 + 8 * math.sin(t * 3))
    d.line([(220, 320), (220 + 120 * math.cos(a), 320 + 120 * math.sin(a))], fill=(255, 90, 40), w=6)
    a2 = math.radians(158)
    d.line([(500, 320), (500 + 120 * math.cos(a2), 320 + 120 * math.sin(a2))], fill=(255, 90, 40), w=6)
    on = lt > 0.6 and (lt % 1.0) < 0.75
    if on:
        img = add_light(img, 500, 240, 80, (140, 80, 10), 0.8)
        d = D(img)
    d.rr((468, 220, 532, 262), 6, fill=(255, 160, 30) if on else (60, 50, 30))
    d.d.text((500 * K, 241 * K), "FUEL", font=font("InterDisplay-Black.otf", 14 * K), fill=(30, 20, 10), anchor="mm")
    d.d.text((500 * K, 460 * K), "12 MI", font=font("InterDisplay-Black.otf", 34 * K), fill=(255, 160, 30), anchor="mm")
    return img


def sc_battery(t, lt):
    img = P()
    d = phone_frame(img, t)
    status_bar(d, "31%", bars=0, red=True)
    d.rect((236, 110, 484, 150), fill=(246, 246, 248))
    txt(d, (360, 130), "Mom", 16, (30, 30, 30), "Inter-SemiBold.otf", "mm")
    if lt > 3.0:
        msg = "On my way"[: int((lt - 3.0) * 8)]
        d.rr((300, 200, 470, 244), 18, fill=(40, 120, 240))
        txt(d, (316, 222), msg, 16, (255, 255, 255))
        if lt > 5.0:
            txt(d, (466, 262), "Sending...", 11, (130, 130, 136), "Inter-Regular.otf", "rm")
    d.rr((250, 540, 470, 580), 18, fill=(255, 255, 255), outline=(200, 200, 206), w=2)
    txt(d, (266, 560), "iMessage", 13, (170, 170, 176))
    thumb(d)
    return img


def sc_last_sign(t, lt):
    img = road_pov(P(), t, speed=0.7)
    d = D(img)
    k = ease(lt / 3.0)
    d.rect((150, 180 - 30 * k, 158, 320), fill=(90, 90, 96))
    d.rect((562, 180 - 30 * k, 570, 320), fill=(90, 90, 96))
    d.rr((120, 60 - 40 * k, 600, 190 - 30 * k), 10, fill=(26, 110, 60), outline=(240, 240, 240), w=4)
    y0 = 60 - 40 * k
    d.d.text((360 * K, (y0 + 36) * K), "LAST SERVICES", font=font("InterDisplay-Black.otf", 34 * K), fill=(240, 240, 240), anchor="mm")
    d.d.text((360 * K, (y0 + 82) * K), "NEXT 60 MILES", font=font("InterDisplay-Bold.otf", 28 * K), fill=(240, 240, 240), anchor="mm")
    d.poly([(520, y0 + 104), (560, y0 + 104), (560, y0 + 96), (580, y0 + 112), (560, y0 + 128), (560, y0 + 120), (520, y0 + 120)],
           fill=(240, 240, 240))
    return dashboard(img)


def sc_ramp(t, lt):
    img = road_pov(P(), t, speed=0.5, glow=0.3, lane_x=40 * math.sin(lt * 0.8))
    d = D(img)
    d.rect((0, 0, PW, 280), fill=(10, 12, 18))
    for side in (-1, 1):
        for i in range(7):
            x = 360 + side * (60 + i * 60 + (i * i) * 6)
            h = 140 + i * 50
            lean = side * -20
            d.poly([(x + lean, 260 - h * 0.6), (x - 40 - i * 6, 300 + i * 10), (x + 40 + i * 6, 300 + i * 10)],
                   fill=(12, 20, 16), outline=INK, w=2)
    return dashboard(img)


def sc_station_far(t, lt):
    img = road_pov(P(), t, speed=0.4)
    img = add_light(img, 360, 262, int(90 + 20 * ease(lt / 3)), (140, 120, 60), 0.8)
    d = D(img)
    s = 0.18 + 0.08 * ease(lt / 3)
    d.rect((360 - 80 * s, 262 - 22 * s, 360 + 80 * s, 262 - 14 * s), fill=(255, 252, 230))
    d.rect((360 + 60 * s, 262 - 30 * s, 360 + 160 * s, 262), fill=(92, 86, 78))
    d.rect((360 + 70 * s, 262 - 22 * s, 360 + 150 * s, 262 - 8 * s), fill=(255, 226, 150))
    return dashboard(img)


def sc_pickup_behind(t, lt):
    img = P()
    night_sky(img)
    d = D(img)
    d.rect((0, 330, PW, PH), fill=(30, 30, 36))
    d.poly([(330, 300), (390, 300), (PW, PH), (0, PH)], fill=(40, 40, 46))
    for i in range(6):
        y0 = 340 + i * 52
        d.rect((354, y0, 366, y0 + 24), fill=(120, 110, 70))
    k = ease(lt / 5)
    s = 0.25 + 0.15 * k
    x, y = 360, 330 + 60 * k
    d.rr((x - 120 * s, y - 40 * s, x + 120 * s, y + 30 * s), 10 * s, fill=(70, 34, 26), outline=INK, w=3 * s)
    d.rr((x - 70 * s, y - 80 * s, x + 70 * s, y - 36 * s), 8 * s, fill=(62, 30, 24), outline=INK, w=3 * s)
    d.rect((x - 60 * s, y - 72 * s, x + 60 * s, y - 44 * s), fill=(14, 14, 18))
    for hx in (-90, 90):
        d.circ(x + hx * s, y - 8 * s, 10 * s, fill=(40, 40, 36))
    if lt > 4.0:
        img = add_light(img, 620, 250, 140, (110, 100, 60), 0.5)
    return dim(img, 0.15)
