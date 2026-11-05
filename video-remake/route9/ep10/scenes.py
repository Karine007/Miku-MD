"""
Episode 10 (finale) scenes. Loaded by ../../gas_station/render.py with its helpers in this namespace.
Reuses Episode 9 (control room, channel, countdown, turned Ray; which loads Ep8/7/6/1/4 + the cast).
"""
import os as _os

exec(open(_os.path.join(_os.path.dirname(_os.path.abspath(__file__)), "..", "ep09", "scenes.py")).read())

DAWN = ((70, 80, 110), (180, 150, 140))


def dawn_sky(img, k=1.0):
    img.paste(grad(mix((14, 18, 38), DAWN[0], k), mix((88, 52, 54), DAWN[1], k)), (0, 0))
    d = D(img)
    d.poly([(0, 300), (120, 262), (260, 286), (400, 250), (560, 280), (720, 258), (720, 340), (0, 340)],
           fill=mix((26, 24, 36), (60, 60, 70), k))
    return d


# --------------------------------------------------------------------------
def sc_countdown(t, lt):
    secs = 10 * 60 - int(lt)
    return countdown_panel(P(), t, f"0:{secs // 60:02d}:{secs % 60:02d}")


def sc_breaker_room(t, lt):
    img = P()
    d = D(img)
    d.rect((0, 0, PW, PH), fill=(40, 42, 50))
    d.rr((60, 60, 660, 600), 12, fill=(84, 88, 96), outline=INK, w=5)
    labels = ["SPILLWAY", "WALKWAY", "CONTROL", "PUMPS", "GATE 1-5", "DAM LIGHTS"]
    for i, lab in enumerate(labels):
        x0, y0 = 100 + (i % 3) * 190, 110 + (i // 3) * 240
        d.rr((x0, y0, x0 + 150, y0 + 190), 8, fill=(60, 64, 72), outline=INK, w=3)
        d.d.text(((x0 + 75) * K, (y0 + 26) * K), lab, font=font("InterDisplay-Bold.otf", 18 * K),
                 fill=(255, 210, 120) if lab == "DAM LIGHTS" else (220, 220, 220), anchor="mm")
        d.rr((x0 + 55, y0 + 50, x0 + 95, y0 + 170), 6, fill=(30, 30, 34), outline=INK, w=2)
        d.rr((x0 + 45, y0 + 56, x0 + 105, y0 + 80), 6, fill=(200, 50, 40), outline=INK, w=2)
    return img


def sc_boone_door(t, lt):
    img = control_room(P(), t)
    img = dim(img, 0.3)
    d = D(img)
    person(d, 360, 270, 2.2, "boone", face="worried", t=t)
    return img


def sc_you_think(t, lt):
    img = control_room(P(), t)
    img = dim(img, 0.35)
    d = D(img)
    stick(d, 360, 280, 2.3, "you", face="worried", t=t)
    return img


def sc_milo_radio(t, lt):
    img = control_room(P(), t)
    d = D(img)
    d.rr((420, 230, 640, 330), 8, fill=(36, 40, 48), outline=INK, w=3)
    d.rect((300, 470, 400, 490), fill=(110, 70, 50), outline=INK, w=3)
    for lx in (310, 390):
        d.line([(lx, 490), (lx, 600)], fill=(110, 70, 50), w=8)
    person(d, 350, 330, 0.85, "milo", face="worried", t=t, look=1)
    return img


def sc_milo_look(t, lt):
    img = control_room(P(), t)
    d = D(img)
    person(d, 250, 320, 1.0, "milo", face="worried", t=t, look=1)
    stick(d, 480, 300, 1.05, "you", face="neutral", t=t, look=-1)
    return img


def sc_lever(t, lt):
    img = P()
    d = D(img)
    d.rect((0, 0, PW, PH), fill=(60, 64, 72))
    d.d.text((360 * K, 90 * K), "DAM LIGHTS", font=font("InterDisplay-Black.otf", 44 * K), fill=(255, 210, 120), anchor="mm")
    d.rr((300, 150, 420, 560), 12, fill=(30, 30, 34), outline=INK, w=4)
    k = ease((lt - 0.4) / 0.6)
    y = 190 + 300 * k
    d.rr((260, y, 460, y + 60), 10, fill=(200, 50, 40), outline=INK, w=4)
    d.circ(360, y + 30, 46, fill=(26, 26, 30))
    d.line([(360, y + 60), (480, PH)], fill=(46, 84, 150), w=60)
    return img


def sc_lights_out(t, lt):
    img = P()
    night_sky(img)
    d = D(img)
    d.rect((0, 470, PW, PH), fill=(28, 28, 34))
    n_on = max(0.0, 1 - lt / 3.2)
    img = harlan_dam(img, t, s=1.1, base=470, lit=n_on)
    if lt > 3.2:
        img = dim(img, 0.35)
    return img


def sc_drift(t, lt):
    img = P()
    d = D(img)
    d.rect((0, 0, PW, PH), fill=(16, 18, 30))
    d.poly([(0, 0), (140, 0), (220, PH), (0, PH)], fill=(50, 54, 66), outline=INK, w=3)
    d.poly([(PW, 0), (580, 0), (500, PH), (PW, PH)], fill=(50, 54, 66), outline=INK, w=3)
    img = add_light(img, 600, 60, 300, (40, 50, 80), 0.5)
    d = D(img)
    rnd = random.Random(23)
    k = ease(lt / 6.0)
    for row in range(6):
        y = 80 + row * 95
        for i in range(9):
            x0 = 170 + i * 45 + rnd.uniform(-10, 10)
            spread = (x0 - 360) * 0.6 * k + rnd.uniform(-30, 30) * k
            x = x0 + spread
            if 150 < x0 < 570:
                zombie(d, x, y + 30 * k, 0.32 + row * 0.05, t, row * 9 + i, color=(90, 100, 96), shirt=(54, 52, 50))
    return img


def sc_code(t, lt):
    img = P()
    d = D(img)
    d.rect((0, 0, PW, PH), fill=(14, 16, 22))
    img = add_light(img, 360, 320, 260, (120, 110, 70), 0.6)
    d = D(img)
    d.rr((200, 100, 520, 560), 16, fill=(60, 64, 72), outline=INK, w=5)
    typed = "0911"[: min(4, int(lt / 0.6))]
    d.rr((230, 130, 490, 200), 6, fill=(10, 14, 12))
    d.d.text((360 * K, 166 * K), typed + ("_" if len(typed) < 4 else ""), font=font("InterDisplay-Bold.otf", 50 * K),
             fill=(120, 255, 150), anchor="mm")
    for i, key in enumerate("123456789*0#"):
        x = 260 + (i % 3) * 100
        y = 250 + (i // 3) * 76
        d.rr((x - 34, y - 26, x + 34, y + 26), 8, fill=(90, 94, 100), outline=INK, w=2)
        d.d.text((x * K, y * K), key, font=font("InterDisplay-Bold.otf", 28 * K), fill=(240, 240, 240), anchor="mm")
    order = "0911"
    if len(typed) < 4:
        nk = order[len(typed)]
        i = "123456789*0#".index(nk)
        x, y = 260 + (i % 3) * 100, 250 + (i // 3) * 76
        d.circ(x + 10, y + 30, 26, fill=(26, 26, 30))
        d.line([(x + 30, y + 50), (PW, PH)], fill=(110, 112, 118), w=50)
    return img


def sc_frozen_timer(t, lt):
    img = countdown_panel(P(), t, "0:00:42")
    k = ease((lt - 3.0) / 3.0)
    return Image.blend(img, Image.new("RGB", img.size, (150, 140, 140)), 0.25 * k)


def stairs_bg(img, k_dawn=1.0):
    dawn_sky(img, k_dawn)
    d = D(img)
    d.rect((0, 0, 180, PH), fill=(110, 114, 120), outline=INK, w=3)
    for i in range(10):
        y = 120 + i * 52
        x = 200 + i * 40
        d.rect((x, y, x + 140, y + 14), fill=(90, 94, 100), outline=INK, w=2)
    d.line([(200, 100), (600, 620)], fill=(70, 74, 80), w=6)
    return d


def sc_stairs(t, lt):
    img = P()
    d = stairs_bg(img)
    k = ease(lt / 8.0)
    i = 9 - 7 * k
    x, y = 270 + i * 40, 120 + i * 52 - 150
    turned_ray(d, x, y, 0.75, t)
    return dim(img, 0.1)


def sc_ray_glass(t, lt):
    img = P()
    dawn_sky(img)
    d = D(img)
    turned_ray(d, 360, 260, 2.3, 0)
    d.rect((0, 0, PW, PH), outline=(60, 64, 72), w=40)
    for tt in (4.6, 5.4):
        if lt > tt:
            a = clamp(1 - (lt - tt) / 0.7)
            if a > 0:
                d.circ(470, 330, 20 + 100 * (1 - a), outline=mix((120, 120, 130), (240, 240, 250), a), w=4)
    glass = Image.new("RGB", img.size, (200, 210, 220))
    return Image.blend(img, glass, 0.12)


def sc_boone_glass(t, lt):
    img = P()
    dawn_sky(img)
    d = D(img)
    person(d, 360, 260, 2.3, "boone", face="sad", t=t)
    d.ell((470, 160, 560, 260), fill=(26, 26, 30))
    for tt in (1.2, 1.7):
        if lt > tt:
            a = clamp(1 - (lt - tt) / 0.7)
            if a > 0:
                d.circ(515, 210, 20 + 100 * (1 - a), outline=mix((120, 120, 130), (240, 240, 250), a), w=4)
    return Image.blend(img, Image.new("RGB", img.size, (200, 210, 220)), 0.1)


def sc_ray_leaves(t, lt):
    img = P()
    d = dawn_sky(img)
    d.rect((0, 340, PW, PH), fill=(70, 80, 70))
    d.poly([(0, 340), (200, 300), (420, 330), (720, 290), (720, 360), (0, 360)], fill=(60, 72, 62))
    k = ease(lt / 8.0)
    for i in range(7):
        x = 120 + i * 80 + k * 30
        zombie(d, x, 300 - 30 * k + (i % 2) * 10, 0.22 - 0.06 * k, t, i, color=(110, 120, 104), shirt=(60, 58, 52))
    turned_ray(d, 380 + 40 * k, 470 - 170 * k, 0.75 - 0.45 * k, t * 2)
    return img


def church(img, people=True, pickup=True):
    d = dawn_sky(img, 1.0)
    d.rect((0, 380, PW, PH), fill=(90, 110, 80))
    d.rect((220, 180, 500, 430), fill=(236, 232, 222), outline=INK, w=4)
    d.poly([(200, 190), (360, 90), (520, 190)], fill=(150, 60, 50), outline=INK, w=4)
    d.rect((330, 30, 390, 120), fill=(236, 232, 222), outline=INK, w=3)
    d.poly([(320, 40), (360, 0), (400, 40)], fill=(150, 60, 50), outline=INK, w=3)
    d.line([(360, 52), (360, 92)], fill=INK, w=5)
    d.line([(346, 66), (374, 66)], fill=INK, w=5)
    d.rr((320, 300, 400, 430), 30, fill=(110, 70, 50), outline=INK, w=3)
    for i in range(3):
        d.rect((240 + i * 0, 440 + i * 14, 480, 452 + i * 14), fill=(170, 166, 156), outline=INK, w=2)
    d.d.text((360 * K, 160 * K), "SAINT AGNES", font=font("InterDisplay-Black.otf", 22 * K), fill=(60, 50, 50), anchor="mm")
    if people:
        rnd = random.Random(41)
        for i in range(14):
            x = 230 + i * 18 + rnd.uniform(-6, 6)
            y = 420 + (i % 3) * 14
            c = rnd.choice([(200, 80, 60), (60, 110, 160), (80, 140, 90), (150, 120, 60)])
            d.rect((x - 5, y, x + 5, y + 22), fill=c)
            d.circ(x, y - 6, 7, fill=SKIN, outline=INK, w=1.5)
    if pickup:
        d.rr((540, 470, 700, 530), 10, fill=(130, 60, 44), outline=INK, w=3)
        d.rr((560, 440, 650, 474), 8, fill=(120, 54, 40), outline=INK, w=3)
        for wx in (570, 670):
            d.circ(wx, 530, 14, fill=INK)
    return img


def sc_church(t, lt):
    img = church(P())
    img = add_light(img, 600, 60, 260, (90, 70, 40), 0.4)
    return img


def sc_mom_steps(t, lt):
    img = church(P(), people=True, pickup=False)
    img = dim(img, 0.15)
    d = D(img)
    k = ease(lt / 1.2)
    person(d, 360, 300 + 40 * k, 1.6, "mom", face="smile", t=t * 3)
    return img


def sc_hug(t, lt):
    img = church(P(), people=True, pickup=False)
    img = dim(img, 0.2)
    d = D(img)
    stick(d, 320, 300, 1.4, "you", face="sleep", arms="hold", t=t, look=1)
    person(d, 420, 304, 1.4, "mom", face="smile", arms="hug", t=t, look=-1)
    person(d, 120, 390, 0.9, "dani", face="smile", t=t)
    person(d, 610, 420, 0.75, "milo", face="smile", t=t)
    return img


def sc_chalkboard(t, lt):
    img = P()
    d = D(img)
    d.rect((0, 0, PW, PH), fill=(120, 90, 60))
    d.rr((40, 30, 680, 610), 10, fill=(34, 52, 44), outline=(100, 70, 44), w=14)
    rules = ["1. NO LIGHTS AFTER SUNSET", "2. TWO BOTTLES A DAY", "3. SOMEONE STAYS AWAKE",
             "4. IF SCRATCHED, SAY SO", "5. MOVE ONLY AT DAWN", "6. NOT EVERY LIGHT IS SAFE"]
    f = font("InterDisplay-BoldItalic.otf", 32 * K)
    for i, r in enumerate(rules):
        d.d.text((90 * K, (80 + i * 64) * K), r, font=f, fill=(226, 226, 216))
    last = "7. SOME OF THEM REMEMBER"
    n = int(len(last) * clamp((lt - 1.0) / 4.0))
    if n:
        d.d.text((90 * K, (80 + 6 * 64 + 10) * K), last[:n], font=f, fill=(255, 220, 140))
    return img


def sc_hills_night(t, lt):
    img = P()
    night_sky(img)
    d = D(img)
    d.circ(560, 120, 40, fill=(240, 240, 230))
    img = add_light(img, 560, 120, 200, (60, 60, 70), 0.5)
    d = D(img)
    d.poly([(0, 380), (180, 300), (360, 360), (540, 290), (720, 350), (720, PH), (0, PH)], fill=(24, 30, 30))
    d.poly([(0, 470), (240, 420), (480, 470), (720, 430), (720, PH), (0, PH)], fill=(18, 22, 22))
    stick(d, 470, 286, 0.12, "ray", face="creepy", t=t, tint=(130, 150, 130))
    return img
