#!/usr/bin/env python3
"""Episode 5 sound design (numpy only), keyed to timeline.json beats by scene name."""
import json
import math
import os
import sys
import wave

import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
TL = json.load(open(os.path.join(HERE, "timeline.json")))
SR = 44100
DUR = TL["duration"]
N = int(SR * (DUR + 0.5))
rng = np.random.default_rng(21)
out = np.zeros((N, 2), np.float32)
BEATS = TL["beats"]


def beats(scene):
    return [b for b in BEATS if b["scene"] == scene]


def span(scene):
    bs = beats(scene)
    return bs[0]["start"], bs[-1]["end"]


def T(n):
    return np.arange(n) / SR


def lp(x, cutoff):
    k = max(1, int(SR / cutoff / 2))
    c = np.cumsum(np.concatenate([[0], x]))
    y = (c[k:] - c[:-k]) / k
    return np.concatenate([y, np.zeros(len(x) - len(y))]).astype(np.float32)


def noise(n):
    return rng.normal(0, 1, n).astype(np.float32)


def env(n, a=0.01, r=0.1):
    e = np.ones(n, np.float32)
    na, nr = min(n, int(a * SR)), min(n, int(r * SR))
    if na:
        e[:na] = np.linspace(0, 1, na)
    if nr:
        e[-nr:] *= np.linspace(1, 0, nr)
    return e


def put(t0, sig, gain=1.0, pan=0.0):
    i = int(t0 * SR)
    if i >= N or i < 0:
        return
    sig = sig[: N - i]
    l, r = math.cos((pan + 1) * math.pi / 4) * 1.41, math.sin((pan + 1) * math.pi / 4) * 1.41
    out[i:i + len(sig), 0] += sig * gain * l
    out[i:i + len(sig), 1] += sig * gain * r


def tone(f, d, decay=0.0):
    n = int(d * SR)
    return np.sin(2 * np.pi * f * T(n)) * np.exp(-T(n) * decay)


def static(a, b, gain):
    n = int((b - a) * SR)
    put(a, (lp(noise(n), 3500) - lp(noise(n), 800)) * env(n, 0.05, 0.2), gain)


def squelch(t0, gain=0.12):
    m = int(0.18 * SR)
    put(t0, (lp(noise(m), 5000) - lp(noise(m), 1200)) * np.exp(-T(m) * 12), gain)
    put(t0, tone(1100, 0.05, 30), gain * 0.5)



def knock(t0, gain=0.5, f=150):
    m = int(0.25 * SR)
    s = (np.sin(2 * np.pi * f * T(m)) + 0.5 * np.sin(2 * np.pi * 2.7 * f * T(m))) * np.exp(-T(m) * 30)
    put(t0, s + 0.3 * lp(noise(m), 1500) * np.exp(-T(m) * 60), gain)


def heartbeat(a, b, bpm0, bpm1, gain=0.4):
    k = a
    while k < b:
        for dt, g in ((0, gain), (0.24, gain * 0.7)):
            m = int(0.25 * SR)
            put(k + dt, np.sin(2 * np.pi * 48 * T(m)) * np.exp(-T(m) * 16), g)
        k += 60 / (bpm0 + (bpm1 - bpm0) * (k - a) / max(0.1, b - a))


def sting(t0, gain=0.3):
    m = int(3.0 * SR)
    st = sum(np.sin(2 * np.pi * f * T(m)) for f in (196, 207.65, 277.18, 415.3)) / 4 * np.exp(-T(m) * 1.2)
    put(t0, st * env(m, 0.005, 0.5), gain)
    put(t0, np.sin(2 * np.pi * 40 * T(m) * (1 - 0.3 * T(m) / 3)) * np.exp(-T(m) * 1.5), gain * 2)


# bed: drone that tightens toward the end
t = T(N)
tension = np.clip((t - 50) / 60, 0, 1)
drone = 0.5 * np.sin(2 * np.pi * 55 * t) + 0.3 * np.sin(2 * np.pi * 58.3 * t) + 0.2 * np.sin(2 * np.pi * 82.4 * t)
out += ((0.045 + 0.04 * tension) * drone + 0.07 * lp(noise(N), 220))[:, None] * 0.8

# dock wind, then shelf scrape
a, b = span("dock_dark")
n = int((b - a + 2) * SR)
put(a, lp(noise(n), 400) * env(n, 0.5, 1.5), 0.12)
s, e = span("shove")
m = int(3.2 * SR)
scrape = (lp(noise(m), 1800) - lp(noise(m), 300)) * (0.6 + 0.4 * np.sin(2 * np.pi * 6 * T(m)))
put(s + 0.2, scrape * env(m, 0.1, 0.3), 0.18)
put(s + 3.4, np.sin(2 * np.pi * 70 * T(int(0.5 * SR))) * np.exp(-T(int(0.5 * SR)) * 9), 0.5)

# keys jingle
s = beats("keys_pocket")[0]["start"]
for k in range(6):
    put(s + 0.5 + k * 0.05, tone(3200 + 400 * (k % 3), 0.15, 30), 0.05)

# CB: static + squelch around each Dani line, squelch on your replies
for bt in beats("cb_live"):
    static(bt["start"] - 0.2, bt["end"], 0.04)
    squelch(bt["start"] - 0.1, 0.16)
for bt in beats("cb_mic"):
    squelch(bt["start"] + 0.3, 0.14)
    squelch(bt["end"] - 0.4, 0.14)
gm = beats("grip_mic")[0]
put(gm["start"] + 2.1, tone(1800, 0.03, 120) + 0.5 * np.concatenate([noise(300), np.zeros(int(0.03 * SR) - 300)]), 0.3)
squelch(gm["start"] + 2.15, 0.22)          # the button press, then he transmits
squelch(gm["end"] - 1.2, 0.18)

# nightfall: crickets outside from the timelapse onward
a = beats("timelapse")[0]["start"] + 2.0
b = beats("ray_leaves")[0]["end"]
n = int((b - a) * SR)
tt = T(n)
chirp = np.sin(2 * np.pi * 4300 * tt) * (np.sin(2 * np.pi * 28 * tt) > 0.3) * (np.sin(2 * np.pi * 0.9 * tt) > 0)
put(a, chirp * env(n, 1.0, 1.0), 0.015, -0.3)

# Ray appears: low swell; heartbeat while you crouch
s = beats("lot_ray")[0]["start"]
m = int(3.0 * SR)
put(s, (noise(m) - lp(noise(m), 700)) * (T(m) / 3.0) ** 2, 0.06)
heartbeat(beats("ray_watch")[0]["start"], beats("eyes_shut")[-1]["end"], 70, 104, 0.26)

# two taps on the glass
s = beats("knuckle")[0]["start"]
knock(s + 0.25, 0.6, 520)
knock(s + 1.1, 0.6, 520)

# footsteps walking away
s = beats("ray_leaves")[0]["start"]
for k in range(8):
    m = int(0.15 * SR)
    put(s + 0.4 + k * 0.7, lp(noise(m), 900) * np.exp(-T(m) * 30), 0.2 * (1 - k / 9))

# "He knocked. Twice." - two knocks through the CB, then the sting on the last line
s = beats("cb_live")[-1]["start"]
knock(s + 1.5, 0.25, 140)
knock(s + 1.9, 0.25, 140)
heartbeat(beats("grip_mic")[0]["start"], beats("grab_keys")[0]["end"], 96, 120, 0.2)
s = beats("grab_keys")[0]["start"]
for k in range(5):
    put(s + 0.9 + k * 0.04, tone(3000 + 500 * (k % 2), 0.12, 30), 0.05)
sting(beats("grab_keys")[0]["end"] - 1.4)

out *= 0.9
out = np.tanh(out * 1.2) / math.tanh(1.2)
fo = int(0.8 * SR)
out[-fo:] *= np.linspace(1, 0, fo)[:, None]
with wave.open(sys.argv[1] if len(sys.argv) > 1 else "sfx.wav", "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes((np.clip(out, -1, 1) * 32000).astype(np.int16).tobytes())
