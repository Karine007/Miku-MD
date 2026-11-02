#!/usr/bin/env python3
"""Episode 4 sound design (numpy only), keyed to timeline.json beats by scene name."""
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
rng = np.random.default_rng(17)
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


# lonely bed: hollow drone + fluorescent-free silence hum
t = T(N)
tension = np.clip((t - 85) / 30, 0, 1)
drone = 0.5 * np.sin(2 * np.pi * 55 * t) + 0.3 * np.sin(2 * np.pi * 61.7 * t) + 0.2 * np.sin(2 * np.pi * 82.4 * t)
out += ((0.045 + 0.04 * tension) * drone + 0.07 * lp(noise(N), 220))[:, None] * 0.8

# locker door creak
s = beats("locker")[0]["start"]
m = int(0.9 * SR)
f = 300 + 140 * np.linspace(0, 1, m) + 30 * np.sin(2 * np.pi * 9 * T(m))
put(s + 0.2, np.sin(np.cumsum(2 * np.pi * f / SR)) * env(m, 0.05, 0.3), 0.05)

# CB: power-on squelch, low static under every CB scene, knob clicks
s = beats("cb")[0]["start"]
squelch(s + 0.5, 0.18)
for sc in ("cb", "cb_knob", "cb_mic", "cb_wait", "cb_live", "map", "pumps_dark"):
    a, b = span(sc)
    static(a, b, 0.03 if sc != "cb_live" else 0.045)
s = beats("cb_knob")[0]["start"]
for k in range(5):
    put(s + 0.3 + k * 0.3, tone(2600, 0.02, 200), 0.15)
s = beats("cb_mic")[0]["start"]
squelch(s + 1.0, 0.1)
squelch(beats("cb_mic")[0]["end"] - 0.3, 0.1)

# the hour: clock ticks
a, b = span("cb_wait")
k = a + 0.2
while k < b - 0.2:
    put(k, tone(3000, 0.02, 250), 0.12)
    k += 0.25

# Dani: squelch before each transmission
for bt in beats("cb_live"):
    squelch(bt["start"] - 0.1, 0.16)

# pen on napkin
s = beats("napkin")[0]["start"]
m = int(3.0 * SR)
put(s + 0.6, (lp(noise(m), 4000) - lp(noise(m), 1500)) * (np.abs(np.sin(2 * np.pi * 5 * T(m))) > 0.4) * env(m, 0.3, 0.3), 0.06)
put(s + 0.15, tone(110, 0.5, 6), 0.5)

# sleeping: slow breathing
a, b = span("sleep_cb")
n = int((b - a) * SR)
br = lp(noise(n), 900) * (np.clip(np.sin(2 * np.pi * 0.25 * T(n)), 0, 1) ** 2)
put(a, br * env(n, 0.5, 0.5), 0.05)

# cold draft: wind from the dock, rising to the end
a = beats("draft")[0]["start"]
b = DUR - 3.0
n = int((b - a) * SR)
tt = T(n)
wind = lp(noise(n), 400) * (0.6 + 0.4 * np.sin(2 * np.pi * 0.17 * tt)) * np.clip(tt / 4, 0, 1)
put(a, wind * env(n, 1.0, 1.5), 0.12)

# dock: metal door rattle in the wind
s = beats("dock_open")[0]["start"]
for k in range(4):
    m = int(0.2 * SR)
    put(s + 0.4 + k * 0.9, (lp(noise(m), 2500) - lp(noise(m), 500)) * np.exp(-T(m) * 15), 0.15, 0.3)

# empty cooler: compressor hum
a, b = span("cooler_empty")
n = int((b - a) * SR)
put(a, (np.sin(2 * np.pi * 58 * T(n)) + 0.5 * lp(noise(n), 300)) * env(n, 0.3, 0.3), 0.08)

# heartbeat over the footprints, final sting
hb0, hb1 = beats("footprints")[0]["start"], beats("footprints_far")[-1]["end"]
k = hb0
while k < hb1:
    for dt, g in ((0, 0.4), (0.24, 0.28)):
        m = int(0.25 * SR)
        put(k + dt, np.sin(2 * np.pi * 48 * T(m)) * np.exp(-T(m) * 16), g)
    k += 60 / 84
s = beats("footprints_far")[-1]["start"] + 1.4
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
