"""
Episode 9 scenes. Loaded by ../../gas_station/render.py with its helpers in this namespace.
Reuses Episode 8 (Harlan Dam, parade; which loads Ep7/Ep6/Ep1/Ep4 + the cast).
"""
import os as _os

exec(open(_os.path.join(_os.path.dirname(_os.path.abspath(__file__)), "..", "ep08", "scenes.py")).read())

RAY_TURNED = (150, 168, 150)
CONSOLE = (44, 50, 60)


def turned_ray(d, x, y, s, t=0.0):
    stick(d, x, y, s, "ray", face="creepy", t=t, tint=RAY_TURNED)
    for ex in (-12, 12):
        d.line([(x + ex * s - 6 * s, y - 10 * s), (x + ex * s + 4 * s, y + 6 * s)], fill=(30, 30, 30), w=1.6 * s)


def control_room(img, t, window_dark=0.0):
    d = D(img)
    d.rect((0, 0, PW, PH), fill=(30, 34, 42))
    d.rect((40, 40, 680, 300), fill=(14, 18, 30), outline=INK, w=6)
    for x in (240, 460):
        d.line([(x, 40), (x, 300)], fill=INK, w=6)
    if window_dark < 1:
        for i in range(7):
            lx = 80 + i * 90
            img = add_light(img, lx, 90, 60, (140, 130, 90), 0.5 * (1 - window_dark))
        d = D(img)
    d.poly([(0, 400), (PW, 400), (PW, PH), (0, PH)], fill=(40, 44, 52))
    d.rect((0, 330, PW, 420), fill=CONSOLE, outline=INK, w=4)
    rnd = random.Random(5)
    for i in range(20):
        x = 30 + i * 34
        on = (math.sin(t * 2 + i) > 0)
        d.rect((x, 350, x + 18, 362), fill=rnd.choice([(60, 200, 90), (230, 180, 40), (220, 60, 50)]) if on else (40, 44, 50))
    return img


def countdown_panel(img, t, txt_time):
    d = D(img)
    d.rect((0, 0, PW, PH), fill=(30, 34, 42))
    d.rr((120, 120, 600, 520), 16, fill=(60, 64, 72), outline=INK, w=5)
    d.d.text((360 * K, 170 * K), "FLOODGATE  AUTO-OPEN", font=font("InterDisplay-Black.otf", 30 * K),
             fill=(220, 220, 220), anchor="mm")
    d.rr((170, 220, 550, 360), 10, fill=(10, 14, 12))
    d.d.text((360 * K, 292 * K), txt_time, font=font("InterDisplay-Bold.otf", 92 * K), fill=(255, 70, 50), anchor="mm")
    d.d.text((360 * K, 420 * K), "SET BY: B. CALDER", font=font("Inter-Medium.otf", 20 * K), fill=(180, 180, 186),
             anchor="mm")
    img = add_light(img, 360, 290, 260, (90, 10, 10), 0.4)
    return img


# --------------------------------------------------------------------------
def sc_dam_top(t, lt):
    img = P()
    night_sky(img)
    d = D(img)
    d.rect((0, 400, PW, PH), fill=(100, 104, 110))
    d.rect((0, 380, PW, 404), fill=(130, 134, 140), outline=INK, w=3)
    for i in range(8):
        x = 40 + i * 92
        d.line([(x, 380), (x, 160)], fill=(80, 80, 86), w=5)
        img = add_light(img, x, 160, 110, (150, 140, 90), 0.55)
        d = D(img)
        d.rect((x - 14, 150, x + 14, 168), fill=(255, 252, 230))
    stick(d, 280, 300, 0.75, "you", face="worried", t=t)
    person(d, 420, 296, 0.8, "boone", face="neutral", t=t)
    return img


def channel(img, t, ray=False, lights=1.0):
    d = D(img)
    d.rect((0, 0, PW, PH), fill=(30, 32, 40))
    d.poly([(0, 0), (140, 0), (220, PH), (0, PH)], fill=(84, 88, 96), outline=INK, w=3)
    d.poly([(PW, 0), (580, 0), (500, PH), (PW, PH)], fill=(84, 88, 96), outline=INK, w=3)
    if lights:
        img = add_light(img, 360, 0, 520, (120, 114, 80), 0.6 * lights)
        d = D(img)
    rnd = random.Random(23)
    for row in range(6):
        y = 80 + row * 95
        for i in range(9):
            x = 170 + (row * 0.6) * 0 + i * 45 + rnd.uniform(-10, 10)
            if 150 < x < 570:
                zombie(d, x, y, 0.32 + row * 0.05, t, row * 9 + i, color=(150, 166, 138), shirt=(90, 86, 76), up=True)
    if ray:
        turned_ray(d, 360, 410, 0.55, t)
    return img


def sc_channel(t, lt):
    return channel(P(), t)


def sc_control_room(t, lt):
    img = control_room(P(), t)
    d = D(img)
    d.rr((440, 230, 640, 330), 8, fill=(36, 40, 48), outline=INK, w=3)
    for i in range(4):
        d.line([(456, 250 + i * 16), (560, 250 + i * 16)], fill=(70, 74, 82), w=4)
    d.circ(600, 280, 24, fill=(26, 28, 34), outline=(90, 90, 96), w=3)
    stick(d, 240, 300, 0.85, "you", face="neutral", t=t, look=1)
    return img


def sc_dam_radio(t, lt):
    img = P()
    d = D(img)
    d.rect((0, 0, PW, PH), fill=(30, 34, 42))
    d.rr((80, 140, 640, 500), 20, fill=(36, 40, 48), outline=INK, w=6)
    for i in range(10):
        d.line([(120, 190 + i * 26), (360, 190 + i * 26)], fill=(60, 64, 72), w=8)
    d.rr((400, 180, 600, 280), 8, fill=(14, 30, 22))
    d.d.text((500 * K, 230 * K), "SHELTER", font=font("InterDisplay-Bold.otf", 28 * K), fill=(120, 255, 150), anchor="mm")
    for i in range(8):
        on = (math.sin(t * 9 + i * 0.7) * 0.5 + 0.5) * 8 > i
        d.rect((410 + i * 22, 320, 424 + i * 22, 340), fill=(255, 170, 40) if on else (60, 52, 40))
    img = add_light(img, 500, 240, 200, (40, 90, 50), 0.4)
    return img


def sc_you_lean(t, lt):
    img = control_room(P(), t)
    img = dim(img, 0.3)
    d = D(img)
    stick(d, 360, 280, 2.3, "you", face="o", t=t)
    return img


def sc_you_grip(t, lt):
    img = control_room(P(), t)
    d = D(img)
    for hx in (220, 500):
        d.circ(hx, 330, 34, fill=(26, 26, 30))
        d.line([(hx, 360), (hx + (hx - 360) * 0.4, PH)], fill=(46, 84, 150), w=50)
    return dim(img, 0.2)


def sc_tell_boone(t, lt):
    img = control_room(P(), t)
    d = D(img)
    stick(d, 250, 300, 0.95, "you", face="worried", arms="hold", t=t, look=1)
    person(d, 480, 296, 1.0, "boone", face="neutral", t=t, look=-1)
    return img


def sc_boone_tight(t, lt):
    img = control_room(P(), t)
    img = dim(img, 0.35)
    d = D(img)
    person(d, 360, 280, 2.5, "boone", face="worried", t=t)
    return img


def sc_timer(t, lt):
    secs = 40 * 60 - int(lt)
    return countdown_panel(P(), t, f"{secs // 3600}:{secs // 60 % 60:02d}:{secs % 60:02d}")


def sc_dani_door(t, lt):
    img = control_room(P(), t)
    img = dim(img, 0.35)
    d = D(img)
    d.rect((200, 60, 520, PH), fill=(60, 64, 72), outline=INK, w=5)
    d.rect((220, 80, 500, PH), fill=(18, 20, 26))
    person(d, 340, 280, 1.5, "dani", face="neutral", t=t)
    person(d, 450, 380, 0.85, "milo", face="worried", t=t)
    return img


def sc_rule1(t, lt):
    img = P()
    night_sky(img)
    img = harlan_dam(img, t, s=1.1, base=470, lit=1.0)
    return img


def sc_dark_plan(t, lt):
    img = P()
    night_sky(img)
    k = ease((lt - 1.0) / 3.0)
    img = harlan_dam(img, t, s=1.1, base=470, lit=1 - k)
    return dim(img, 0.3 * k)


def sc_ray_up(t, lt):
    return channel(P(), t, ray=True)


def sc_ray_zoom(t, lt):
    img = P()
    d = D(img)
    d.rect((0, 0, PW, PH), fill=(30, 32, 40))
    img = add_light(img, 360, 0, 520, (120, 114, 80), 0.6)
    d = D(img)
    for x in (110, 610):
        zombie(d, x, 240, 1.2, t, x, color=(150, 166, 138), shirt=(90, 86, 76), up=True)
    k = ease(lt / 3.0)
    turned_ray(d, 360, 260 - 20 * k, 2.2 + 0.4 * k, t)
    return img


def sc_boone_glass(t, lt):
    img = control_room(P(), t)
    d = D(img)
    person(d, 360, 200, 2.0, "boone", face="sad", t=t)
    d.ell((470, 160, 540, 240), fill=(26, 26, 30))
    return img


def sc_countdown(t, lt):
    return countdown_panel(P(), t, "0:40:00" if (t % 1) < 0.6 else "0:39:59")
