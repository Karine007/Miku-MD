#!/usr/bin/env python3
"""Synthesized sound design for the gas-station episode, keyed to timeline.json. numpy only."""
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
rng = np.random.default_rng(5)
out = np.zeros((N, 2), np.float32)
START = {b["i"]: b["start"] for b in TL["beats"]}
END = {b["i"]: b["end"] for b in TL["beats"]}


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
    na, nr = int(a * SR), int(r * SR)
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


def tone(f, d, gain=1.0, decay=0.0):
    n = int(d * SR)
    tt = T(n)
    return np.sin(2 * np.pi * f * tt) * np.exp(-tt * decay) * gain


# --- music bed: low drone + slow dissonant pad, rising tension ------------
t = T(N)
tension = np.clip((t - 30) / 80, 0, 1)
drone = 0.5 * np.sin(2 * np.pi * 49 * t) + 0.35 * np.sin(2 * np.pi * 49.4 * t) + 0.2 * np.sin(2 * np.pi * 73.4 * t)
pad = (np.sin(2 * np.pi * 196 * t) + np.sin(2 * np.pi * 207.6 * t) * tension) * (0.5 + 0.5 * np.sin(2 * np.pi * 0.05 * t))
bed = 0.06 * drone + 0.012 * pad + 0.1 * lp(noise(N), 250)
quiet = np.ones(N, np.float32)
for a, b, g in [(START[18], END[18], 0.45)]:
    quiet[int(a * SR):int(b * SR)] = g
out += (bed * quiet)[:, None] * 0.8

# night ambience: crickets (outdoor scenes)
for i in (0, 1, 6, 10):
    a, b = START[i], END[i]
    n = int((b - a) * SR)
    tt = T(n)
    chirp = np.sin(2 * np.pi * 4300 * tt) * (np.sin(2 * np.pi * 28 * tt) > 0.3) * (np.sin(2 * np.pi * 0.9 * tt) > 0)
    put(a, chirp * env(n, 0.3, 0.3), 0.02, -0.3)

# fluorescent hum inside the store
for i in (2, 5, 13, 14, 18):
    a, b = START[i], END[i]
    n = int((b - a) * SR)
    tt = T(n)
    put(a, (np.sin(2 * np.pi * 120 * tt) + 0.3 * np.sin(2 * np.pi * 240 * tt)) * env(n, 0.2, 0.2), 0.02)

# coffee machine: three gurgles
for k in range(3):
    n = int(0.6 * SR)
    g = lp(noise(n), 700) * (np.abs(np.sin(2 * np.pi * 9 * T(n))) ** 2) * env(n, 0.02, 0.2)
    put(START[3] + 0.1 + k * 0.75, g, 0.35 if k == 2 else 0.2)
put(START[3] + 0.1, tone(880, 0.12, 0.2, 20))

# radio: static + three alert tones before the voice (voice starts at beat start)
n = int((END[4] - START[4]) * SR)
st = lp(noise(n), 3500) - lp(noise(n), 900)
put(START[4], st * env(n, 0.1, 0.3), 0.05)
for k in range(2):
    put(START[4] - 0.05 + k * 0.32, (tone(853, 0.25) + tone(960, 0.25)) * env(int(0.25 * SR), 0.01, 0.03), 0.05)

# radio switched off: click
put(START[5] + 0.3, np.concatenate([noise(200) * 0.8, np.zeros(10)]), 0.3)

# pickup truck: engine idle then door creak
n = int(3.0 * SR)
eng = (np.sign(np.sin(2 * np.pi * 32 * T(n))) * 0.4 + lp(noise(n), 200)) * env(n, 0.8, 1.0)
put(START[6], lp(eng, 400), 0.35, -0.2)
n = int(0.8 * SR)
f = 260 + 120 * np.linspace(0, 1, n)
put(START[6] + 2.6, np.sin(np.cumsum(2 * np.pi * f / SR)) * env(n, 0.05, 0.3), 0.1, -0.2)

# zombie groans (low, filtered)
def groan(t0, d=1.6, f0=95, gain=0.18, pan=0.0):
    n = int(d * SR)
    tt = T(n)
    f = f0 * (1 + 0.15 * np.sin(2 * np.pi * 1.3 * tt))
    s = np.sign(np.sin(np.cumsum(2 * np.pi * f / SR))) * 0.5 + 0.5 * lp(noise(n), 600)
    put(t0, lp(s, 700) * env(n, 0.3, 0.5), gain, pan)


groan(START[7] + 0.8)
groan(START[7] + 3.4, f0=88)
for k in range(8):
    groan(START[8] + 0.4 + k * 0.9, d=2.2, f0=80 + (k * 7) % 30, gain=0.08 + 0.015 * k, pan=(k % 3 - 1) * 0.5)

# breaker switch: clunk + power-down whine
sw = START[9] + 1.6
put(sw, np.concatenate([noise(300), np.zeros(10)]) * np.exp(-T(310) * 80), 0.8)
put(sw, tone(70, 0.4, 0.8, 9))
n = int(1.4 * SR)
f = np.linspace(240, 40, n)
put(sw + 0.05, np.sin(np.cumsum(2 * np.pi * f / SR)) * env(n, 0.01, 0.5), 0.12)

# thump on glass
th = START[11] + 0.4
n = int(0.5 * SR)
put(th, (np.sin(2 * np.pi * 60 * T(n)) * np.exp(-T(n) * 10) + 0.4 * lp(noise(n), 1200) * np.exp(-T(n) * 30)), 0.9)
put(th, lp(noise(int(0.6 * SR)), 5000) * np.exp(-T(int(0.6 * SR)) * 8), 0.08)
for k in range(3):
    put(th + 0.7 + k * 0.5, np.sin(2 * np.pi * 55 * T(n)) * np.exp(-T(n) * 14), 0.25 - 0.06 * k)

# rule cards / counts: soft paper whoosh + hit
for i in (12, 14, 15, 16, 17, 20):
    n = int(0.3 * SR)
    w = (lp(noise(n), 3000) - lp(noise(n), 500)) * np.sin(np.pi * T(n) / 0.3) ** 2
    put(START[i] - 0.05, w, 0.12)
    put(START[i] + 0.15, tone(110, 0.5, 0.5, 6))

# hot dog roller hum
n = int((END[16] - START[16]) * SR)
put(START[16], (np.sin(2 * np.pi * 100 * T(n)) + 0.4 * lp(noise(n), 400)) * env(n, 0.1, 0.2), 0.05)

# pen scribble
n = int(3.0 * SR)
scr = (lp(noise(n), 4000) - lp(noise(n), 1500)) * (np.abs(np.sin(2 * np.pi * 5 * T(n))) > 0.4)
put(START[17] + 1.4, scr * env(n, 0.3, 0.4), 0.06)

# day one: cards shuffle
for k in range(4):
    n = int(0.12 * SR)
    put(START[18] + 1.2 + k * 1.1, lp(noise(n), 5000) * np.exp(-T(n) * 30), 0.15)

# phone: message received + sent + failed
put(START[19] + 0.8, tone(1318, 0.12, 0.2, 18) + 0, 1.0)
put(START[19] + 0.95, tone(1760, 0.18, 0.2, 14), 1.0)
put(START[19] + 1.6, tone(1046, 0.1, 0.18, 20), 1.0)
put(START[19] + 4.4, tone(330, 0.25, 0.2, 6), 1.0)

# night: heartbeat from day four until the end
hb0, hb1 = START[21], END[27]
k = hb0
bpm = 64
while k < hb1:
    for dt, g in ((0, 0.4), (0.24, 0.28)):
        n = int(0.25 * SR)
        put(k + dt, np.sin(2 * np.pi * 48 * T(n)) * np.exp(-T(n) * 16), g)
    bpm = 64 + 40 * (k - hb0) / (hb1 - hb0)
    k += 60 / bpm

# cooler door: compressor hum + slow creak
n = int((END[23] - START[23]) * SR)
put(START[23], (np.sin(2 * np.pi * 58 * T(n)) + lp(noise(n), 300)) * env(n, 0.3, 0.3), 0.1)
n = int(1.6 * SR)
f = 180 + 50 * np.sin(np.linspace(0, 3, n))
put(START[23] + 0.3, np.sin(np.cumsum(2 * np.pi * f / SR)) * env(n, 0.2, 0.5), 0.06)

# sleeve: drip
for k in range(3):
    put(START[25] + 0.8 + k * 0.7, tone(1400 - k * 200, 0.08, 0.3, 50))

# final sting on "There is no shutter." and end card boom
n = int(3.0 * SR)
tt = T(n)
sting = sum(np.sin(2 * np.pi * f * tt) for f in (196, 207.65, 277.18, 415.3)) / 4 * np.exp(-tt * 1.2)
put(START[27] + 1.1, sting * env(n, 0.005, 0.5), 0.35)
put(START[27] + 1.1, np.sin(2 * np.pi * 40 * tt * (1 - 0.3 * tt / 3)) * np.exp(-tt * 1.5), 0.7)
n = int(1.5 * SR)
riser = (noise(n) - lp(noise(n), 800)) * (T(n) / 1.5) ** 2.5 * env(n, 0.0, 0.25)
put(START[27] - 0.4, riser, 0.1)

out *= 0.9
out = np.tanh(out * 1.2) / math.tanh(1.2)
fo = int(0.8 * SR)
out[-fo:] *= np.linspace(1, 0, fo)[:, None]
with wave.open(sys.argv[1] if len(sys.argv) > 1 else "sfx.wav", "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes((np.clip(out, -1, 1) * 32000).astype(np.int16).tobytes())
