#!/usr/bin/env python3
"""Synthesized sound design for the remake (numpy only). Writes a 16-bit stereo WAV."""
import math
import sys
import wave

import numpy as np

SR = 44100
DUR = 104.37
N = int(SR * DUR)
rng = np.random.default_rng(3)
out = np.zeros((N, 2), np.float32)


def T(n):
    return np.arange(n) / SR


def fast_lp(x, cutoff):
    """Cheap low-pass: moving average sized from cutoff."""
    k = max(1, int(SR / cutoff / 2))
    c = np.cumsum(np.concatenate([[0], x]))
    y = (c[k:] - c[:-k]) / k
    return np.concatenate([y, np.zeros(len(x) - len(y))]).astype(np.float32)


def env(n, a=0.01, r=0.2):
    e = np.ones(n, np.float32)
    na, nr = int(a * SR), int(r * SR)
    if na:
        e[:na] = np.linspace(0, 1, na)
    if nr:
        e[-nr:] *= np.linspace(1, 0, nr)
    return e


def put(t0, sig, gain=1.0, pan=0.0):
    i = int(t0 * SR)
    if i >= N:
        return
    sig = sig[: N - i]
    l, r = math.cos((pan + 1) * math.pi / 4), math.sin((pan + 1) * math.pi / 4)
    out[i:i + len(sig), 0] += sig * gain * l * 1.41
    out[i:i + len(sig), 1] += sig * gain * r * 1.41


# --- ambient drone ---------------------------------------------------------
t = T(N)
drone = (np.sin(2 * np.pi * 55 * t) + 0.7 * np.sin(2 * np.pi * 55.6 * t) + 0.4 * np.sin(2 * np.pi * 82.4 * t))
drone *= 0.5 + 0.5 * np.sin(2 * np.pi * 0.07 * t)
noise = fast_lp(rng.normal(0, 1, N).astype(np.float32), 300)
amb = 0.05 * drone + 0.25 * noise
mask = np.ones(N, np.float32)
for a, b, g in [(19, 21, 0.2), (93, 101, 0.25), (101, DUR, 0.1)]:
    mask[int(a * SR):int(b * SR)] = g
out[:, 0] += amb * mask * 0.6
out[:, 1] += amb * mask * 0.6


# --- events ----------------------------------------------------------------
def buzz(t0, dur=1.6, gain=0.35):
    """Phone vibration: two pulses per 0.8 s."""
    n = int(dur * SR)
    tt = T(n)
    s = np.sign(np.sin(2 * np.pi * 160 * tt)) * 0.6 + np.sin(2 * np.pi * 80 * tt)
    gate = ((tt % 0.8) < 0.3).astype(np.float32)
    put(t0, fast_lp(s * gate * env(n), 900), gain, 0.3)


def voice(t0, dur, seed, gain=0.18, pitch=210):
    """Muffled, unintelligible 'voice message' gibberish."""
    r = np.random.default_rng(seed)
    n = int(dur * SR)
    tt = T(n)
    f0 = pitch * (1 + 0.15 * np.sin(2 * np.pi * 3.3 * tt) + 0.05 * r.normal(0, 1))
    ph = np.cumsum(2 * np.pi * f0 / SR)
    s = sum(np.sin(ph * h) / h for h in range(1, 7))
    syl = np.clip(np.sin(2 * np.pi * r.uniform(3.5, 5) * tt + r.uniform(0, 6)), 0, 1) ** 0.6
    s = fast_lp(s * syl, 1400) + 0.15 * fast_lp(r.normal(0, 1, n).astype(np.float32), 2500) * syl
    put(t0, s * env(n, 0.05, 0.3), gain)


def snore(t0, dur, gain=0.3, pan=0.5):
    n = int(dur * SR)
    tt = T(n)
    cyc = np.clip(np.sin(2 * np.pi * 0.42 * tt), 0, 1) ** 1.5
    rasp = np.sin(2 * np.pi * 38 * tt) * 0.5 + 0.5
    s = fast_lp(rng.normal(0, 1, n).astype(np.float32), 500) * cyc * (0.4 + 0.6 * rasp)
    put(t0, s * env(n, 0.3, 0.4), gain, pan)


def thump(t0, gain=0.6, f=60, d=0.35, pan=0.0):
    n = int(d * SR)
    tt = T(n)
    s = np.sin(2 * np.pi * f * tt * (1 - 0.4 * tt / d)) * np.exp(-tt * 14)
    s += 0.3 * fast_lp(rng.normal(0, 1, n).astype(np.float32), 900) * np.exp(-tt * 40)
    put(t0, s, gain, pan)


def knock(t0, gain=0.7):
    n = int(0.25 * SR)
    tt = T(n)
    s = (np.sin(2 * np.pi * 180 * tt) + 0.6 * np.sin(2 * np.pi * 410 * tt)) * np.exp(-tt * 35)
    s += 0.5 * fast_lp(rng.normal(0, 1, n).astype(np.float32), 2000) * np.exp(-tt * 70)
    put(t0, s, gain)


def creak(t0, dur=1.2, gain=0.22, f0=320, f1=620):
    n = int(dur * SR)
    tt = T(n)
    f = f0 + (f1 - f0) * (tt / dur) + 40 * np.sin(2 * np.pi * 7 * tt)
    ph = np.cumsum(2 * np.pi * f / SR)
    grit = (rng.random(n) < 0.02).astype(np.float32)
    s = (np.sin(ph) + 0.5 * np.sin(2.01 * ph)) * (0.5 + 0.5 * fast_lp(grit * 20, 60))
    put(t0, s * env(n, 0.1, 0.3), gain, -0.2)


def heartbeat(t0, dur, bpm=72, gain=0.5):
    k = 0.0
    while k < dur:
        thump(t0 + k, gain, 50, 0.25)
        thump(t0 + k + 0.22, gain * 0.7, 46, 0.25)
        k += 60 / bpm


def boom(t0, gain=0.8, d=2.5):
    n = int(d * SR)
    tt = T(n)
    s = np.sin(2 * np.pi * 42 * tt * (1 - 0.3 * tt / d)) * np.exp(-tt * 1.6)
    s += 0.4 * fast_lp(rng.normal(0, 1, n).astype(np.float32), 400) * np.exp(-tt * 3)
    put(t0, s, gain)


def riser(t0, dur, gain=0.25):
    n = int(dur * SR)
    tt = T(n)
    s = rng.normal(0, 1, n).astype(np.float32)
    s = s - fast_lp(s, 600)
    put(t0, s * (tt / dur) ** 2.5, gain)


def sting(t0, gain=0.3, d=1.6):
    n = int(d * SR)
    tt = T(n)
    s = sum(np.sin(2 * np.pi * f * tt + 3 * np.sin(2 * np.pi * 5 * tt)) for f in (311, 330, 466, 622))
    put(t0, s * np.exp(-tt * 2.2) * env(n, 0.005, 0.2) / 4, gain)


def tick(t0, gain=0.25):
    n = int(0.05 * SR)
    tt = T(n)
    put(t0, np.sin(2 * np.pi * 2400 * tt) * np.exp(-tt * 120), gain)


def ring(t0, dur, gain=0.25):
    notes = [659, 784, 988, 784]
    k = 0.0
    i = 0
    while k < dur:
        n = int(0.22 * SR)
        tt = T(n)
        f = notes[i % 4]
        s = (np.sin(2 * np.pi * f * tt) + 0.3 * np.sin(2 * np.pi * 2 * f * tt)) * np.exp(-tt * 9)
        put(t0 + k, s, gain, 0.1)
        k += 0.25
        i += 1


def whoosh(t0, gain=0.15, d=0.35):
    n = int(d * SR)
    tt = T(n)
    s = rng.normal(0, 1, n).astype(np.float32)
    s = fast_lp(s, 3000) - fast_lp(s, 400)
    put(t0, s * np.sin(np.pi * tt / d) ** 2, gain)


# timeline
buzz(2.0, 2.0)
boom(5.0, 0.4)
sting(13.0, 0.18)
snore(16.0, 2.4)
riser(16.6, 1.4, 0.3)
boom(18.0, 1.0)
sting(18.0, 0.35, 1.0)
boom(19.0, 0.8, 3)
buzz(21.0, 2.6)
snore(32.0, 6.0)
heartbeat(33.0, 6.0, 70, 0.35)
boom(38.0, 0.35)
creak(39.0, 1.3)
for k, ft in enumerate([42.0, 42.7, 43.4, 44.1, 44.8, 45.4]):
    thump(ft, 0.45 + 0.05 * k, 75, 0.3, -0.3)
heartbeat(47.0, 4.0, 90, 0.4)
creak(51.3, 2.4, 0.18, 180, 260)
boom(54.6, 0.4)
for kt in (57.15, 57.5):
    knock(kt, 0.6)
for kt in (59.05, 59.4, 59.75):
    knock(kt, 0.9)
buzz(61.0, 2.6)
riser(64.5, 2.5, 0.35)
sting(66.8, 0.4, 2.0)
boom(68.0, 0.7)
boom(72.0, 1.0, 2.5)
whoosh(71.9, 0.3)
for k in range(9):
    tick(75 + k, 0.25)
    whoosh(75 + k - 0.05, 0.08, 0.2)
ring(84.0, 2.0)
riser(97.0, 2.0, 0.3)
boom(99.0, 0.9)
snore(99.0, 5.0, 0.35)
sting(99.0, 0.35, 2.0)
boom(101.8, 0.9, 2.5)
sting(101.8, 0.3, 2.2)

# caption pops (subtle)
for ct in [0, 2, 3, 4, 5, 7, 9, 22, 23, 24, 33, 34, 35, 36, 37, 38, 75, 76, 77, 78, 79, 80, 81, 82, 93, 94, 96]:
    whoosh(ct, 0.04, 0.15)

# master: soft clip, fade
out *= 0.9
out = np.tanh(out * 1.3) / math.tanh(1.3)
fo = int(1.0 * SR)
out[-fo:] *= np.linspace(1, 0, fo)[:, None]
pcm = (np.clip(out, -1, 1) * 32000).astype(np.int16)
with wave.open(sys.argv[1] if len(sys.argv) > 1 else "sfx.wav", "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(pcm.tobytes())
