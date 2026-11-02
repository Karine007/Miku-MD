#!/usr/bin/env python3
"""Episode 1 sound design (numpy only), keyed to timeline.json beats by scene name."""
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
rng = np.random.default_rng(9)
out = np.zeros((N, 2), np.float32)


def first(scene):
    return next(b for b in TL["beats"] if b["scene"] == scene)


def span(scene):
    bs = [b for b in TL["beats"] if b["scene"] == scene]
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


# music bed: low drone that swells as the drive gets worse
t = T(N)
tension = np.clip((t - 40) / 50, 0, 1)
drone = 0.5 * np.sin(2 * np.pi * 49 * t) + 0.35 * np.sin(2 * np.pi * 49.4 * t) + 0.2 * np.sin(2 * np.pi * 73.4 * t)
pad = np.sin(2 * np.pi * 196 * t) + np.sin(2 * np.pi * 207.6 * t) * tension
out += ((0.05 + 0.03 * tension) * drone + 0.01 * pad + 0.08 * lp(noise(N), 250))[:, None] * 0.8

# garage: concrete hum + footsteps
a, b = span("garage")
n = int((b - a) * SR)
put(a, (np.sin(2 * np.pi * 60 * T(n)) + 0.5 * lp(noise(n), 300)) * env(n, 0.3, 0.3), 0.05)
for k in range(6):
    m = int(0.12 * SR)
    put(a + 0.3 + k * 0.55, lp(noise(m), 1500) * np.exp(-T(m) * 40), 0.25, -0.2 + 0.08 * k)

# phone: notification, voicemail start, call failed
s = first("missed_call")["start"]
put(s + 0.1, tone(1318, 0.15, 16) + 0.6 * tone(1975, 0.15, 16), 0.15)
put(s + 0.28, tone(1568, 0.25, 10), 0.15)
s = first("call_failed")["start"]
for k in range(3):
    put(s + 0.2 + k * 0.4, tone(440, 0.3, 2) * env(int(0.3 * SR), 0.01, 0.05), 0.08)
for k, f in enumerate((950, 1400, 1800)):
    put(s + 1.4 + k * 0.33, tone(f, 0.28) * env(int(0.28 * SR), 0.01, 0.05), 0.08)

# the drive: engine + road noise from the on-ramp to the station
a = first("onramp")["start"]
b = first("highway")["start"]
n = int((b - a) * SR)
tt = T(n)
road = lp(noise(n), 500) * 0.8 + 0.4 * np.sin(2 * np.pi * (38 + 6 * np.sin(tt * 0.2)) * tt)
lvl = np.ones(n, np.float32)
hs, he = span("hands")
i0, i1 = int((hs + 2.6 - a) * SR), int((he - a) * SR)
lvl[i0:i1] = 0.45                                   # radio off, the silence is worse
put(a, road * env(n, 1.5, 1.5) * lvl, 0.16)

# oncoming traffic whooshes
a, b = span("traffic")
k = a + 0.3
while k < b:
    m = int(1.2 * SR)
    w = (lp(noise(m), 2500) - lp(noise(m), 300)) * np.sin(np.pi * T(m) / 1.2) ** 3
    put(k, w, 0.25, -0.7)
    k += 0.9

# car radio static under the broadcast
a, b = span("car_radio")
n = int((b - a) * SR)
put(a, (lp(noise(n), 3500) - lp(noise(n), 900)) * env(n, 0.05, 0.2), 0.05)
put(a - 0.05, np.concatenate([noise(250), np.zeros(10)]) * 0.5, 0.3)

# trooper: distant siren wail, very faint
a, b = span("trooper")
n = int((b - a) * SR)
f = 700 + 250 * np.sin(2 * np.pi * 0.4 * T(n))
put(a, np.sin(np.cumsum(2 * np.pi * f / SR)) * env(n, 0.8, 1.0), 0.025, 0.4)

# man in the road: rising swell, then brake screech
s = first("man_road")["start"]
m = int(2.5 * SR)
put(s - 0.3, (noise(m) - lp(noise(m), 700)) * (T(m) / 2.5) ** 2, 0.08)
s = first("brake")["start"]
m = int(1.4 * SR)
sc = np.sin(np.cumsum(2 * np.pi * (2300 + 300 * np.sin(2 * np.pi * 13 * T(m))) / SR)) * env(m, 0.02, 0.5)
put(s, sc + 0.5 * lp(noise(m), 4000) * env(m, 0.02, 0.5), 0.12)
put(s + 1.3, tone(52, 0.8, 4), 0.5)


def groan(t0, d=1.8, f0=92, gain=0.15, pan=0.0):
    m = int(d * SR)
    f = f0 * (1 + 0.15 * np.sin(2 * np.pi * 1.3 * T(m)))
    sg = np.sign(np.sin(np.cumsum(2 * np.pi * f / SR))) * 0.5 + 0.5 * lp(noise(m), 600)
    put(t0, lp(sg, 700) * env(m, 0.3, 0.5), gain, pan)


# the turn: sting
s = first("man_turns")["start"]
m = int(2.5 * SR)
st = sum(np.sin(2 * np.pi * f * T(m)) for f in (196, 207.65, 277.18)) / 3 * np.exp(-T(m) * 1.6)
put(s + 1.2, st * env(m, 0.005, 0.4), 0.25)
groan(s + 1.4)
s = first("man_walks")["start"]
groan(s + 0.4, f0=86)
groan(s + 2.0, f0=104, gain=0.1, pan=-0.6)
groan(s + 2.3, f0=80, gain=0.1, pan=0.6)

# swerve: screech + engine roar
s = first("swerve")["start"]
m = int(1.6 * SR)
put(s + 0.2, np.sin(np.cumsum(2 * np.pi * (1900 + 400 * np.sin(2 * np.pi * 9 * T(m))) / SR)) * env(m, 0.02, 0.6), 0.1, -0.4)
m = int(2.5 * SR)
f = np.linspace(40, 90, m)
put(s + 0.6, np.sign(np.sin(np.cumsum(2 * np.pi * f / SR))) * env(m, 0.1, 1.0) * 0.5, 0.12)
s = first("mirror")["start"]
groan(s + 0.5, gain=0.07, pan=0.2)

# radio switched off (click) during "hands"
put(hs + 2.6, np.concatenate([noise(220), np.zeros(10)]) * 0.6, 0.25)

# fuel chime
s = first("fuel")["start"]
put(s + 0.6, tone(1046, 0.6, 4) + 0.5 * tone(1568, 0.6, 5), 0.12)

# typing taps
s = [b for b in TL["beats"] if b["scene"] == "battery"][1]["start"]
for k in range(9):
    m = int(0.04 * SR)
    put(s + 0.8 + k * 0.13 + (k % 3) * 0.02, lp(noise(m), 5000) * np.exp(-T(m) * 90), 0.15)
put(s + 2.2, tone(1318, 0.12, 15), 0.1)

# exit ramp: gravel
a, b = span("ramp")
n = int((b - a) * SR)
grit = (rng.random(n) < 0.004).astype(np.float32) * noise(n)
put(a, lp(grit, 3000) * env(n, 0.3, 0.5), 0.6)

# arrival: engine off, crickets, fluorescent buzz
s = first("highway")["start"]
m = int(1.0 * SR)
put(s, lp(noise(m), 300) * np.linspace(1, 0, m), 0.15)
a, b = s, DUR - 3.5
n = int((b - a) * SR)
tt = T(n)
chirp = np.sin(2 * np.pi * 4300 * tt) * (np.sin(2 * np.pi * 28 * tt) > 0.3) * (np.sin(2 * np.pi * 0.9 * tt) > 0)
put(a, chirp * env(n, 0.5, 0.5), 0.02, -0.3)

# pickup behind: distant idle, then end sting
s = first("pickup_behind")["start"]
m = int(5.5 * SR)
idle = lp(np.sign(np.sin(2 * np.pi * 30 * T(m))) * 0.5 + lp(noise(m), 200), 350)
put(s, idle * env(m, 1.5, 1.0), 0.18, 0.3)
bs = [b for b in TL["beats"] if b["scene"] == "pickup_behind"]
s2 = bs[1]["start"] + 0.9
m = int(3.0 * SR)
st = sum(np.sin(2 * np.pi * f * T(m)) for f in (196, 207.65, 277.18, 415.3)) / 4 * np.exp(-T(m) * 1.2)
put(s2, st * env(m, 0.005, 0.5), 0.3)
put(s2, np.sin(2 * np.pi * 40 * T(m) * (1 - 0.3 * T(m) / 3)) * np.exp(-T(m) * 1.5), 0.6)

out *= 0.9
out = np.tanh(out * 1.2) / math.tanh(1.2)
fo = int(0.8 * SR)
out[-fo:] *= np.linspace(1, 0, fo)[:, None]
with wave.open(sys.argv[1] if len(sys.argv) > 1 else "sfx.wav", "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes((np.clip(out, -1, 1) * 32000).astype(np.int16).tobytes())
