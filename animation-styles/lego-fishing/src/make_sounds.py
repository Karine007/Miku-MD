"""Synthesizes every sound for the Lego fishing film (no external samples).
Writes 44.1 kHz WAV files into ../sounds. Deterministic (fixed seed).

Timeline (seconds) it is designed for:
  0.0-10  music  : gentle plucked melody, day -> night (slower, softer at end)
  0.0-6   day    : wind + birdsong
  0.4-2.8 steps  : plastic footsteps walking to the lake
  3.0     cast   : rod whoosh + bobber plop
  4.2-5.0 reel   : reel clicks
  5.0     splash : fish pulled out of water
  5.4     yay    : little "ta-da" chime
  6.0-10  night  : crickets + owl hoot
  7.2-9.6 steps  : walking home
  9.6     door   : door click + close
"""
import os, wave
import numpy as np

SR = 44100
rng = np.random.default_rng(7)
OUT = os.path.join(os.path.dirname(__file__), '..', 'sounds')
os.makedirs(OUT, exist_ok=True)

def t(sec): return np.arange(int(sec * SR)) / SR
def env(n, a, r):
    e = np.ones(n); A = int(a * SR); R = int(r * SR)
    if A: e[:A] = np.linspace(0, 1, A)
    if R: e[-R:] *= np.linspace(1, 0, R)
    return e
def lowpass(x, k):  # one-pole low-pass, k in (0,1)
    y = np.empty_like(x); acc = 0.0
    for i, v in enumerate(x): acc += k * (v - acc); y[i] = acc
    return y
def place(buf, clip, at):
    i = int(at * SR); j = min(len(buf), i + len(clip)); buf[i:j] += clip[: j - i]
def save(name, x, gain=0.9):
    x = x / (np.max(np.abs(x)) + 1e-9) * gain
    st = np.stack([x, x], 1)
    with wave.open(os.path.join(OUT, name), 'wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((st * 32767).astype('<i2').tobytes())

def pluck(freq, dur, damp=0.996):  # Karplus-Strong string
    n = int(dur * SR); p = int(SR / freq); buf = rng.uniform(-1, 1, p); out = np.empty(n)
    for i in range(n):
        out[i] = buf[i % p]; buf[i % p] = damp * 0.5 * (buf[i % p] + buf[(i + 1) % p])
    return out * env(n, 0.002, 0.05)

# ---- music: day melody (C major), then night (A minor, slower)
music = np.zeros(int(10.5 * SR))
N = {'C4': 261.6, 'D4': 293.7, 'E4': 329.6, 'F4': 349.2, 'G4': 392.0, 'A4': 440.0, 'B4': 493.9, 'C5': 523.3, 'E5': 659.3, 'A3': 220.0, 'G3': 196.0, 'C3': 130.8, 'F3': 174.6, 'E3': 164.8}
day = ['C4', 'E4', 'G4', 'E4', 'A4', 'G4', 'E4', 'D4', 'C4', 'E4', 'G4', 'C5', 'B4', 'G4', 'A4', 'G4', 'E4', 'G4', 'E5', 'C5']
for i, nm in enumerate(day): place(music, pluck(N[nm], 0.6) * 0.5, 0.05 + i * 0.29)
for i, nm in enumerate(['C3', 'F3', 'G3', 'C3']): place(music, pluck(N[nm], 1.4, 0.998) * 0.45, 0.05 + i * 1.45)
night = ['A4', 'E4', 'C4', 'E4', 'G4', 'E4', 'D4', 'C4', 'A3', 'C4', 'E4', 'A4']
for i, nm in enumerate(night): place(music, pluck(N[nm], 0.9, 0.997) * 0.35, 6.0 + i * 0.36)
for i, nm in enumerate(['A3', 'F3', 'E3']): place(music, pluck(N[nm] / 2, 1.6, 0.998) * 0.35, 6.0 + i * 1.45)
music *= env(len(music), 0.05, 1.2)
save('music.wav', music, 0.8)

# ---- day ambience: wind + birds
d = t(6.5)
wind = lowpass(rng.normal(0, 1, len(d)), 0.01) * (0.6 + 0.4 * np.sin(d * 0.9))
birds = np.zeros(len(d))
for k in range(14):
    at = 0.2 + k * 0.43 + rng.uniform(0, 0.15); n = int(rng.uniform(0.06, 0.14) * SR); tt = np.arange(n) / SR
    f0 = rng.uniform(2800, 4200); sweep = f0 + rng.choice([-1, 1]) * 1600 * tt / tt[-1]
    chirp = np.sin(2 * np.pi * np.cumsum(sweep) / SR) * np.sin(np.pi * tt / tt[-1]) ** 2
    for rep in range(rng.integers(1, 4)): place(birds, chirp * 0.5, at + rep * 0.09)
save('day.wav', wind * 0.6 + birds * env(len(d), 0.1, 0.8), 0.7)

# ---- footsteps (hollow plastic tok)
def step():
    n = int(0.09 * SR); tt = np.arange(n) / SR
    return (np.sin(2 * np.pi * 900 * tt) * 0.6 + rng.normal(0, 0.4, n)) * np.exp(-tt * 70)
st = np.zeros(int(2.6 * SR))
for i in range(9): place(st, step() * (0.8 + 0.2 * (i % 2)), i * 0.27)
save('steps.wav', st, 0.6)

# ---- cast: whoosh then plop
c = np.zeros(int(1.2 * SR)); n = int(0.45 * SR); tt = np.arange(n) / SR
wh = rng.normal(0, 1, n); wh = lowpass(wh, 0.15) * np.sin(np.pi * tt / tt[-1]) ** 2
place(c, wh, 0)
n = int(0.25 * SR); tt = np.arange(n) / SR
plop = np.sin(2 * np.pi * np.cumsum(300 + 900 * np.exp(-tt * 30)) / SR) * np.exp(-tt * 18)
place(c, plop + rng.normal(0, 0.15, n) * np.exp(-tt * 25), 0.55)
save('cast.wav', c, 0.8)

# ---- reel clicks
r = np.zeros(int(0.9 * SR))
for i in range(18):
    n = int(0.012 * SR); place(r, rng.normal(0, 1, n) * np.exp(-np.arange(n) / SR * 400), i * 0.045)
save('reel.wav', r, 0.5)

# ---- splash (fish out of water)
n = int(0.9 * SR); tt = np.arange(n) / SR
sp = lowpass(rng.normal(0, 1, n), 0.35) * np.exp(-tt * 6)
drops = np.zeros(n)
for i in range(10):
    m = int(0.05 * SR); u = np.arange(m) / SR
    place(drops, np.sin(2 * np.pi * rng.uniform(900, 1800) * u * (1 + u * 8)) * np.exp(-u * 60) * 0.4, 0.15 + i * 0.06)
save('splash.wav', sp + drops, 0.85)

# ---- ta-da chime
ch = np.zeros(int(1.2 * SR))
for i, f in enumerate([523.3, 659.3, 784.0, 1046.5]):
    n = int(0.9 * SR); tt = np.arange(n) / SR
    place(ch, (np.sin(2 * np.pi * f * tt) + 0.3 * np.sin(4 * np.pi * f * tt)) * np.exp(-tt * 4) * 0.4, i * 0.08)
save('tada.wav', ch, 0.55)

# ---- night: crickets + owl
d = t(4.5); cr = np.zeros(len(d))
for k in range(3):
    f = 4200 + k * 350; rate = 14 + k * 3
    gate = (np.sin(2 * np.pi * rate * d + k) > 0.3) * (np.sin(2 * np.pi * 0.7 * d + k * 2) > -0.2)
    cr += np.sin(2 * np.pi * f * d) * lowpass(gate.astype(float), 0.02) * 0.3
for at in (1.2, 1.75):
    n = int(0.45 * SR); tt = np.arange(n) / SR
    place(cr, np.sin(2 * np.pi * (390 - 40 * tt) * tt) * np.sin(np.pi * tt / tt[-1]) ** 1.5 * 0.8, at)
cr += lowpass(rng.normal(0, 1, len(d)), 0.005) * 0.4
save('night.wav', cr * env(len(d), 0.6, 0.3), 0.6)

# ---- door: click + soft thud
n = int(0.6 * SR); tt = np.arange(n) / SR
door = np.zeros(n)
place(door, rng.normal(0, 1, 400) * np.exp(-np.arange(400) / SR * 300), 0)
place(door, (np.sin(2 * np.pi * 90 * tt) + lowpass(rng.normal(0, 1, n), 0.08)) * np.exp(-tt * 12), 0.18)
save('door.wav', door, 0.8)
print('sounds written to', os.path.abspath(OUT))
