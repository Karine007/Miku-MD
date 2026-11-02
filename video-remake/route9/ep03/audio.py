#!/usr/bin/env python3
"""Episode 3 sound design (numpy only), keyed to timeline.json beats by scene name."""
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
rng = np.random.default_rng(13)
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


def knock(t0, gain=0.5, f=150):
    m = int(0.25 * SR)
    s = (np.sin(2 * np.pi * f * T(m)) + 0.5 * np.sin(2 * np.pi * 2.7 * f * T(m))) * np.exp(-T(m) * 30)
    put(t0, s + 0.3 * lp(noise(m), 1500) * np.exp(-T(m) * 60), gain)


# bed: sad low drone + cooler compressor hum all episode
t = T(N)
sad = 0.5 * np.sin(2 * np.pi * 55 * t) + 0.3 * np.sin(2 * np.pi * 65.4 * t) + 0.2 * np.sin(2 * np.pi * 82.4 * t)
hum = np.sin(2 * np.pi * 58 * t) + 0.4 * lp(noise(N), 250)
out += (0.05 * sad * (0.6 + 0.4 * np.sin(2 * np.pi * 0.04 * t)) + 0.04 * hum)[:, None] * 0.8

# keys jingle
s = beats("keys")[0]["start"]
for k in range(6):
    put(s + 0.9 + k * 0.05, tone(3200 + 400 * (k % 3), 0.15, 30), 0.05)

# pen scribble for rule 4
s = beats("ticket4")[0]["start"]
m = int(3.2 * SR)
scr = (lp(noise(m), 4000) - lp(noise(m), 1500)) * (np.abs(np.sin(2 * np.pi * 5 * T(m))) > 0.4)
put(s + 0.9, scr * env(m, 0.3, 0.4), 0.06)
put(s + 0.15, tone(110, 0.5, 6), 0.5)

# cards shuffle + two taps on the floor
s = beats("cards")[0]["start"]
for k in range(4):
    m = int(0.12 * SR)
    put(s + 0.8 + k * 1.2, lp(noise(m), 5000) * np.exp(-T(m) * 30), 0.15)
s = beats("cards_tap")[0]["start"]
knock(s + 0.4, 0.35, 120)
knock(s + 0.9, 0.35, 120)

# "Danny": sting
s = beats("danny")[0]["start"]
m = int(2.5 * SR)
st = sum(np.sin(2 * np.pi * f * T(m)) for f in (196, 207.65, 277.18)) / 3 * np.exp(-T(m) * 1.6)
put(s + 2.2, st * env(m, 0.005, 0.4), 0.2)

# into the cooler: door swing, slam
s, e = span("into_cooler")
m = int(1.4 * SR)
f = 160 + 60 * np.sin(np.linspace(0, 3, m))
put(s + 0.3, np.sin(np.cumsum(2 * np.pi * f / SR)) * env(m, 0.2, 0.5), 0.05)
m = int(0.6 * SR)
put(s + 4.3, (np.sin(2 * np.pi * 70 * T(m)) * np.exp(-T(m) * 9) + 0.4 * lp(noise(m), 1200) * np.exp(-T(m) * 25)), 0.8)

# bolt slide
s = beats("guard")[0]["start"]
m = int(0.5 * SR)
put(s + 0.4, (lp(noise(m), 3000) - lp(noise(m), 600)) * env(m, 0.05, 0.1), 0.3)
put(s + 0.9, tone(900, 0.08, 40) + tone(1400, 0.08, 40), 0.2)

# Ray humming through the steel: an original slow tune, muffled, fading over the guard beats
s, e = beats("guard")[1]["start"], beats("guard_night")[0]["start"] + 1.0
notes = [196, 220, 247, 220, 196, 165, 175, 196, 220, 196, 175, 165]
d = (e - s) / len(notes)
for i, f0 in enumerate(notes):
    m = int(d * SR)
    tt = T(m)
    f = f0 * (1 + 0.006 * np.sin(2 * np.pi * 5 * tt))
    ph = np.cumsum(2 * np.pi * f / SR)
    v = (np.sin(ph) + 0.4 * np.sin(2 * ph) + 0.2 * np.sin(3 * ph)) * env(m, 0.15, 0.25)
    fade = max(0.0, 1 - i / len(notes)) ** 1.2
    put(s + i * d, lp(v, 600) * fade, 0.09, 0.15)

# heartbeat from day seven
hb0, hb1 = beats("guard_night")[0]["start"], beats("bolt")[-1]["end"]
k = hb0
while k < hb1:
    for dt, g in ((0, 0.4), (0.24, 0.28)):
        m = int(0.25 * SR)
        put(k + dt, np.sin(2 * np.pi * 48 * T(m)) * np.exp(-T(m) * 16), g)
    k += 60 / (60 + 30 * (k - hb0) / (hb1 - hb0))

# two soft taps on the cooler door
s = beats("taps")[0]["start"]
knock(s + 0.9, 0.55, 95)
knock(s + 1.5, 0.55, 95)

# final sting on "You keep your promise."
s = beats("bolt")[-1]["start"] + 2.0
m = int(3.0 * SR)
st = sum(np.sin(2 * np.pi * f * T(m)) for f in (196, 207.65, 277.18, 415.3)) / 4 * np.exp(-T(m) * 1.2)
put(s, st * env(m, 0.005, 0.5), 0.3)
put(s, np.sin(2 * np.pi * 40 * T(m) * (1 - 0.3 * T(m) / 3)) * np.exp(-T(m) * 1.5), 0.6)

out *= 0.9
out = np.tanh(out * 1.2) / math.tanh(1.2)
fo = int(0.8 * SR)
out[-fo:] *= np.linspace(1, 0, fo)[:, None]
with wave.open(sys.argv[1] if len(sys.argv) > 1 else "sfx.wav", "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes((np.clip(out, -1, 1) * 32000).astype(np.int16).tobytes())
