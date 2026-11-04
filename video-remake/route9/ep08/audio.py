#!/usr/bin/env python3
"""Episode 8 sound design (numpy only), keyed to timeline.json beats by scene name."""
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
rng = np.random.default_rng(41)
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


def groan(t0, d=1.8, f0=92, gain=0.12, pan=0.0):
    m = int(d * SR)
    f = f0 * (1 + 0.15 * np.sin(2 * np.pi * 1.3 * T(m)))
    sg = np.sign(np.sin(np.cumsum(2 * np.pi * f / SR))) * 0.5 + 0.5 * lp(noise(m), 600)
    put(t0, lp(sg, 700) * env(m, 0.3, 0.5), gain, pan)


def thud(t0, gain=0.5):
    m = int(0.4 * SR)
    put(t0, np.sin(2 * np.pi * 55 * T(m)) * np.exp(-T(m) * 12) + 0.4 * lp(noise(m), 900) * np.exp(-T(m) * 30), gain)




# bed: floodlight hum + truck idle + distant crowd for the whole lot section; low sad pad
t = T(N)
drone = 0.5 * np.sin(2 * np.pi * 55 * t) + 0.3 * np.sin(2 * np.pi * 65.4 * t) + 0.2 * np.sin(2 * np.pi * 82.4 * t)
out += (0.045 * drone + 0.05 * lp(noise(N), 220))[:, None] * 0.8
a = 0.0
b = beats("mirror_pickup")[0]["start"]
n = int((b - a) * SR)
tt = T(n)
hum = np.sin(2 * np.pi * 60 * tt) + 0.5 * np.sin(2 * np.pi * 120 * tt)
idle = lp(np.sign(np.sin(2 * np.pi * 30 * tt)) * 0.5 + lp(noise(n), 200), 350)
crowd = lp(noise(n), 600) * (0.6 + 0.4 * np.sin(2 * np.pi * 0.8 * tt))
put(a, (0.3 * hum + idle + 0.5 * crowd) * env(n, 1.0, 1.0), 0.045)

# "Two taps": a soft swell
s = beats("boone_away")[0]["start"]
m = int(5.0 * SR)
sw = (np.sin(2 * np.pi * 220 * T(m)) + 0.6 * np.sin(2 * np.pi * 277.2 * T(m)) + 0.4 * np.sin(2 * np.pi * 329.6 * T(m)))
put(s, sw * np.sin(np.pi * T(m) / 5.0) ** 2, 0.025)

# herding: crowd swell + groans
s = beats("herd_wide")[0]["start"]
for k in range(4):
    groan(s + 0.5 + k * 1.4, f0=86 + 7 * k, gain=0.06, pan=(k % 3 - 1) * 0.6)

# spillway: rushing water as the gates open
a, b = span("spillway")
n = int((b - a) * SR)
rush = lp(noise(n), 1500) - lp(noise(n), 150)
put(a, rush * np.clip((T(n) - 1.5) / 2.5, 0, 1) * env(n, 0.1, 0.6), 0.06)

# river map: a single low note under "Where your mom lives"
s = beats("river_map")[0]["start"]
put(s + 3.0, tone(98, 2.5, 1.2), 0.25)

# rule card thump
s = beats("rule6")[0]["start"]
put(s + 0.15, tone(110, 0.5, 6), 0.5)

# ride: truck doors, engines pulling out, convoy rumble + shuffling crowd to the end
s = beats("boone_offer")[0]["end"] - 0.6
for k in range(2):
    put(s + k * 0.4, np.sin(2 * np.pi * 90 * T(int(0.4 * SR))) * np.exp(-T(int(0.4 * SR)) * 14), 0.3)
a = beats("mirror_pickup")[0]["start"]
b = beats("dam_far")[0]["start"] + 1.0
n = int((b - a) * SR)
tt = T(n)
rumble = lp(np.sign(np.sin(2 * np.pi * 34 * tt)) * 0.5 + lp(noise(n), 260), 420)
shuffle = lp(noise(n), 900) * (0.5 + 0.5 * np.abs(np.sin(2 * np.pi * 1.6 * tt)))
put(a, (rumble + 0.5 * shuffle) * env(n, 1.0, 1.5), 0.08)
for k in range(5):
    groan(beats("parade")[0]["start"] + k * 2.2, f0=84 + 5 * k, gain=0.045, pan=(k % 3 - 1) * 0.7)

# red vest: heartbeat; dam reveal: stadium-light buzz + sting
heartbeat(beats("red_vest")[0]["start"], beats("dam_far")[0]["start"] + 1.0, 72, 96, 0.22)
a = beats("dam_far")[0]["start"]
n = int((DUR - a) * SR)
put(a, (np.sin(2 * np.pi * 120 * T(n)) + 0.4 * np.sin(2 * np.pi * 240 * T(n))) * env(n, 1.5, 1.0), 0.04)
sting(a + 2.2, 0.3)

out *= 0.9
out = np.tanh(out * 1.2) / math.tanh(1.2)
fo = int(0.8 * SR)
out[-fo:] *= np.linspace(1, 0, fo)[:, None]
with wave.open(sys.argv[1] if len(sys.argv) > 1 else "sfx.wav", "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes((np.clip(out, -1, 1) * 32000).astype(np.int16).tobytes())
