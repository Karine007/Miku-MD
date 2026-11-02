#!/usr/bin/env python3
"""Episode 6 sound design (numpy only), keyed to timeline.json beats by scene name."""
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
rng = np.random.default_rng(29)
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


# bed: urgent drone, rising
t = T(N)
tension = np.clip((t - 30) / 60, 0, 1)
drone = 0.5 * np.sin(2 * np.pi * 55 * t) + 0.3 * np.sin(2 * np.pi * 58.3 * t) + 0.25 * np.sin(2 * np.pi * 73.4 * t)
pulse = 0.5 + 0.5 * np.sign(np.sin(2 * np.pi * (1.4 + 0.8 * tension) * t))
out += ((0.045 + 0.04 * tension) * drone * (0.8 + 0.2 * pulse) + 0.07 * lp(noise(N), 220))[:, None] * 0.8

# outside: crickets until the engine starts
a = beats("lot_walk")[0]["start"]
b = beats("ignition")[0]["start"]
n = int((b - a) * SR)
tt = T(n)
chirp = np.sin(2 * np.pi * 4300 * tt) * (np.sin(2 * np.pi * 28 * tt) > 0.3) * (np.sin(2 * np.pi * 0.9 * tt) > 0)
put(a, chirp * env(n, 0.5, 0.5), 0.015, -0.3)

# door + forty steps
s = beats("door_keys")[0]["start"]
put(s + 5.5, np.concatenate([noise(400), np.zeros(10)]) * np.exp(-T(410) * 40), 0.3)
s = beats("lot_walk")[0]["start"]
for k in range(9):
    m = int(0.12 * SR)
    put(s + 0.2 + k * 0.5, lp(noise(m), 1300) * np.exp(-T(m) * 40), 0.16, 0.3 - 0.07 * k)

# cab door, gas cans clank
s = beats("cab")[0]["start"]
put(s + 0.1, np.sin(2 * np.pi * 90 * T(int(0.4 * SR))) * np.exp(-T(int(0.4 * SR)) * 14), 0.3)
s = beats("truck_bed")[0]["start"]
for k in range(3):
    put(s + 0.4 + k * 0.35, tone(380 + 60 * k, 0.3, 12) + 0.5 * tone(910 + 90 * k, 0.3, 18), 0.08)

# breaker clunk, pump beep
s = beats("breaker")[1]["start"]
put(s + 1.0, np.concatenate([noise(300), np.zeros(10)]) * np.exp(-T(310) * 80), 0.8)
put(s + 1.0, tone(70, 0.4, 9), 0.6)
s = beats("pump_on")[0]["start"]
put(s + 0.5, tone(2200, 0.35, 2) * env(int(0.35 * SR), 0.005, 0.05), 0.17)
put(s + 0.5, tone(60, 0.6, 5), 0.6)

# heads turn: groans spread
s = beats("heads_turn")[0]["start"]
for k in range(5):
    groan(s + 0.6 + k * 0.5, f0=84 + 9 * k, gain=0.07, pan=(k % 3 - 1) * 0.6)

# filling: pump motor + glugging
a, b = span("filling")
n = int((b - a) * SR)
put(a, (np.sin(2 * np.pi * 120 * T(n)) * 0.5 + lp(noise(n), 700)) * env(n, 0.1, 0.2), 0.08)
gl = lp(noise(n), 500) * (np.abs(np.sin(2 * np.pi * 7 * T(n))) ** 4)
put(a, gl * env(n, 0.1, 0.2), 0.2)
s = beats("coming")[0]["start"]
for k in range(6):
    groan(s + k * 0.7, f0=90 + 5 * k, gain=0.09 + 0.02 * k, pan=(k % 3 - 1) * 0.5)

# yank: nozzle clatter, cans thrown
s = beats("yank")[0]["start"]
put(s + 0.2, tone(700, 0.3, 14) + tone(1600, 0.3, 20), 0.15)
thud(s + 0.6, 0.4)
thud(s + 0.9, 0.35)

# ignition: starter crank then engine; road from here to the motel
s = beats("ignition")[0]["start"]
m = int(1.4 * SR)
crank = np.sign(np.sin(2 * np.pi * 12 * T(m))) * lp(noise(m), 600)
put(s + 0.1, crank * env(m, 0.02, 0.1), 0.25)
a, b = s + 1.5, beats("motel")[0]["start"] + 1.0
n = int((b - a) * SR)
eng = np.sign(np.sin(2 * np.pi * (42 + 18 * np.clip(T(n) / 4, 0, 1)) * T(n))) * 0.4 + lp(noise(n), 500)
put(a, lp(eng, 600) * env(n, 0.2, 1.0), 0.18)

# faces: groan swell; driving through: thuds
s = beats("faces")[0]["start"]
for k in range(4):
    groan(s + 0.3 + k * 0.4, f0=80 + 7 * k, gain=0.12, pan=(k % 2 - 0.5))
a, b = span("drive_through")
k = a + 0.4
i = 0
while k < b - 0.5:
    thud(k, 0.45 if i % 2 == 0 else 0.3)
    k += 1.3 if i % 2 == 0 else 0.9
    i += 1

# motel: engine off, wind; room door creak
s = beats("motel")[0]["start"]
n = int((DUR - s) * SR)
put(s, lp(noise(n), 400) * env(n, 1.0, 1.0), 0.07)
s = beats("room12")[0]["start"]
m = int(1.0 * SR)
f = 280 + 120 * np.linspace(0, 1, m)
put(s + 0.4, np.sin(np.cumsum(2 * np.pi * f / SR)) * env(m, 0.05, 0.3), 0.05)

# the loop: tape hiss + squelch around Dani's recording, and the click of the recorder
a, b = span("cb_bed")
static(a - 0.6, b + 0.4, 0.035)
squelch(a - 0.55, 0.16)
a, b = span("recorder")
n = int((b - a) * SR)
put(a, (lp(noise(n), 6000) - lp(noise(n), 2000)) * env(n, 0.1, 0.2), 0.03)
put(a + 0.3, tone(2600, 0.02, 200), 0.2)

# convoy: distant engines rising, then the sting
a, b = span("convoy")
n = int((b - a + 2) * SR)
tt = T(n)
roar = lp(np.sign(np.sin(2 * np.pi * 38 * tt)) * 0.5 + lp(noise(n), 300), 500) * np.clip(tt / (b - a), 0, 1) ** 1.5
put(a, roar * env(n, 0.1, 1.5), 0.25)
heartbeat(beats("recorder")[0]["start"], b, 80, 112, 0.22)
sting(beats("convoy")[-1]["start"] + 1.2)

out *= 0.9
out = np.tanh(out * 1.2) / math.tanh(1.2)
fo = int(0.8 * SR)
out[-fo:] *= np.linspace(1, 0, fo)[:, None]
with wave.open(sys.argv[1] if len(sys.argv) > 1 else "sfx.wav", "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes((np.clip(out, -1, 1) * 32000).astype(np.int16).tobytes())
