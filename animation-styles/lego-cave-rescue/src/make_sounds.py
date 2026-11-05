"""Synthesizes the full 60 s soundtrack for 'Trapped 148 ft Under' (music + sound effects).
Writes ../assets/soundtrack.wav. Deterministic; no external samples."""
import os, wave
import numpy as np

SR = 44100; DUR = 60
rng = np.random.default_rng(11)
L = np.zeros(DUR * SR); R = np.zeros(DUR * SR)

def tt(sec): return np.arange(int(sec * SR)) / SR
def lowpass(x, k):
    y = np.empty_like(x); a = 0.0
    for i, v in enumerate(x): a += k * (v - a); y[i] = a
    return y
def fast_lp(x, n):  # moving-average smoothing (cheap low-pass for long signals)
    c = np.cumsum(np.insert(x, 0, 0)); y = (c[n:] - c[:-n]) / n
    return np.concatenate([y, np.zeros(n - 1)])
def env(n, a, r):
    e = np.ones(n); A, Rr = int(a * SR), int(r * SR)
    if A: e[:A] = np.linspace(0, 1, A)
    if Rr: e[-Rr:] *= np.linspace(1, 0, Rr)
    return e
def put(x, at, g=1.0, pan=0.0):
    i = int(at * SR); j = min(len(L), i + len(x)); x = x[: j - i] * g
    L[i:j] += x * (1 - pan) * 0.5 * 2 ** 0.5; R[i:j] += x * (1 + pan) * 0.5 * 2 ** 0.5
def pluck(f, dur, damp=0.996):
    n = int(dur * SR); p = max(2, int(SR / f)); b = rng.uniform(-1, 1, p); o = np.empty(n)
    for i in range(n): o[i] = b[i % p]; b[i % p] = damp * 0.5 * (b[i % p] + b[(i + 1) % p])
    return o * env(n, 0.002, 0.08)

# ---------- music: dark minor pad (A minor) with heartbeat-like pulses, swell at the end
t = tt(DUR)
chords = [(0, [110, 130.8, 164.8]), (8, [87.3, 110, 130.8]), (16, [98, 123.5, 146.8]), (21, [130.8, 164.8, 196]),
          (27, [110, 130.8, 164.8]), (33, [87.3, 110, 130.8]), (37, [98, 123.5, 146.8]), (41, [110, 130.8, 164.8]),
          (48, [87.3, 110, 130.8]), (53, [82.4, 103.8, 123.5]), (57.4, [110, 130.8, 155.6])]
pad = np.zeros(len(t))
for i, (st, fs) in enumerate(chords):
    en = chords[i + 1][0] if i + 1 < len(chords) else DUR
    a, b = int(st * SR), int(en * SR); seg = t[a:b] - st; n = b - a
    s = sum(np.sin(2 * np.pi * f * seg) + 0.5 * np.sin(2 * np.pi * f * 1.003 * 2 * seg) + 0.3 * np.sin(2 * np.pi * f * 0.997 * seg) for f in fs)
    pad[a:b] += s * env(n, min(0.8, n / SR / 3), min(0.8, n / SR / 3))
swell = 0.55 + 0.45 * np.clip((t - 50) / 7, 0, 1) * (t < 59)
pad *= swell * 0.12
put(pad, 0, 1.0)
# melody plucks (sparse, sad)
mel = [(1.0, 440), (2.0, 392), (3.0, 329.6), (5.5, 440), (6.5, 523.3), (7.5, 493.9), (9.0, 440), (12, 329.6), (13, 349.2), (14, 329.6),
       (22, 523.3), (22.6, 587.3), (23.2, 659.3), (25, 587.3), (28, 440), (29, 493.9), (30.2, 523.3), (31, 659.3),
       (34, 349.2), (35, 329.6), (36, 293.7), (38, 392), (38.6, 440), (39.2, 493.9), (42, 440), (43, 415.3), (44, 392),
       (49, 440), (50, 523.3), (51, 587.3), (54, 659.3), (55, 698.5), (56, 659.3), (57.5, 622.3)]
for at, f in mel: put(pluck(f, 1.6, 0.997), at, 0.22, pan=0.2)
# low pulse / heartbeat in tense parts
def thump():
    n = int(0.18 * SR); u = np.arange(n) / SR
    return np.sin(2 * np.pi * (60 + 40 * np.exp(-u * 30)) * u) * np.exp(-u * 18)
for a, b, rate in [(17, 21, 1.2), (44, 48, 1.6), (50.6, 57.4, 1.9)]:
    x = a
    while x < b: put(thump(), x, 0.9); put(thump(), x + 0.22, 0.6); x += 1 / rate * 1.2

# ---------- ambiences
def ambience_water(sec):  # muffled underwater rumble + bubble blips
    n = int(sec * SR); x = fast_lp(rng.normal(0, 1, n), 60) * 6
    for k in range(int(sec * 5)):
        at = rng.uniform(0, sec - 0.1); m = int(rng.uniform(0.03, 0.07) * SR); u = np.arange(m) / SR
        f0 = rng.uniform(500, 1400); i = int(at * SR)
        x[i:i + m] += np.sin(2 * np.pi * np.cumsum(f0 * (1 + u * 25)) / SR) * np.exp(-u * 50) * 0.35
    return x * env(n, 0.3, 0.3)
def ambience_day(sec):
    n = int(sec * SR); u = np.arange(n) / SR
    x = fast_lp(rng.normal(0, 1, n), 120) * 4 * (0.6 + 0.4 * np.sin(u * 0.8))
    for k in range(int(sec * 2)):
        at = rng.uniform(0, sec - 0.2); m = int(rng.uniform(0.06, 0.12) * SR); w = np.arange(m) / SR
        f0 = rng.uniform(2800, 4000); sw = f0 + rng.choice([-1, 1]) * 1400 * w / w[-1]; i = int(at * SR)
        x[i:i + m] += np.sin(2 * np.pi * np.cumsum(sw) / SR) * np.sin(np.pi * w / w[-1]) ** 2 * 0.3
    return x * env(n, 0.3, 0.3)
def drips(sec, count):
    x = np.zeros(int(sec * SR))
    for k in range(count):
        m = int(0.12 * SR); u = np.arange(m) / SR; i = int(rng.uniform(0, sec - 0.2) * SR)
        x[i:i + m] += np.sin(2 * np.pi * np.cumsum(1200 + 1800 * np.exp(-u * 40)) / SR) * np.exp(-u * 30)
    # cave echo
    y = x.copy()
    for d, g in [(0.11, 0.5), (0.23, 0.3), (0.37, 0.18)]: k = int(d * SR); y[k:] += x[:-k] * g
    return y
for a, b in [(5, 11), (11, 13.2), (27, 33), (41, 53), (53, 54.6)]: put(ambience_water(b - a), a, 0.55)
for a, b in [(0, 5), (21, 27), (33, 41)]: put(ambience_day(b - a), a, 0.35)
put(drips(4, 5), 17, 0.25); put(drips(8, 7), 13.3, 0.15); put(drips(5.5, 6), 54.5, 0.25)

# ---------- one-shot effects
def splash():
    n = int(0.9 * SR); u = np.arange(n) / SR
    x = lowpass(rng.normal(0, 1, n), 0.3) * np.exp(-u * 6)
    for i in range(8):
        m = int(0.05 * SR); w = np.arange(m) / SR; j = int((0.12 + i * 0.07) * SR)
        x[j:j + m] += np.sin(2 * np.pi * rng.uniform(900, 1700) * w * (1 + w * 8)) * np.exp(-w * 60) * 0.4
    return x
def whoosh():
    n = int(0.6 * SR); u = np.arange(n) / SR
    return lowpass(rng.normal(0, 1, n), 0.08) * np.sin(np.pi * u / u[-1]) ** 2 * 3
def ding():
    n = int(1.4 * SR); u = np.arange(n) / SR
    return sum(np.sin(2 * np.pi * f * u) * np.exp(-u * d) for f, d in [(880, 3), (1320, 4), (1760, 6)]) * 0.5
def beep():
    n = int(0.12 * SR); u = np.arange(n) / SR
    return np.sign(np.sin(2 * np.pi * 1000 * u)) * 0.3 * env(n, 0.005, 0.02)
def gasp():
    n = int(0.5 * SR); u = np.arange(n) / SR
    return lowpass(rng.normal(0, 1, n), 0.2) * np.sin(np.pi * u / u[-1]) * 0.8
def step():
    n = int(0.08 * SR); u = np.arange(n) / SR
    return (np.sin(2 * np.pi * 700 * u) * 0.5 + rng.normal(0, 0.4, n)) * np.exp(-u * 70)
def rush(sec):
    n = int(sec * SR); u = np.arange(n) / SR
    return fast_lp(rng.normal(0, 1, n), 8) * 2.5 * np.clip(u / 0.5, 0, 1) * np.clip((sec - u) / 0.6, 0, 1)
def shout():  # "¿Ho-la?" — two vowel syllables (formant synth) with cave echo
    out = np.zeros(int(2.0 * SR))
    for st, dur, f0, (f1, f2) in [(0, 0.28, 180, (500, 900)), (0.32, 0.4, 210, (750, 1250))]:
        n = int(dur * SR); u = np.arange(n) / SR
        src = np.sign(np.sin(2 * np.pi * np.cumsum(f0 * (1 + 0.1 * u)) / SR))
        v = sum(np.sin(2 * np.pi * f * u) * 0 for f in (f1,))  # placeholder for clarity
        voice = np.zeros(n)
        for f, bw in [(f1, 0.12), (f2, 0.08)]:  # crude resonators: ring-modulate source by formant sines
            voice += src * np.sin(2 * np.pi * f * u) * bw * 4
        voice = lowpass(voice, 0.25) * env(n, 0.03, 0.08)
        out[int(st * SR):int(st * SR) + n] += voice
    y = out.copy()
    for d, g in [(0.25, 0.55), (0.5, 0.35), (0.8, 0.2), (1.1, 0.12)]: k = int(d * SR); y[k:] += out[:-k] * g
    return y

put(splash(), 12.9, 0.7); put(gasp(), 13.1, 0.6)
for i in range(3): put(splash(), 24.8 + i * 0.7, 0.7, pan=-0.3 + i * 0.3)
put(splash(), 39.9, 0.8); put(splash(), 54.4, 0.7); put(gasp(), 54.6, 0.7)
for at in (21, 33, 37, 48): put(whoosh(), at - 0.1, 0.6)
for at in (30, 42, 49): put(ding(), at, 0.5)
for k in range(14): put(beep(), 44.5 + k * 0.25, 0.35)
for k in range(10): put(step(), 34.6 + k * 0.24, 0.5, pan=0.4)
for k in range(6): put(step(), 22 + k * 0.3, 0.4); put(step(), 37.5 + k * 0.28, 0.4)
put(rush(2.6), 50.6, 0.7)
put(shout(), 57.7, 0.9)
put(-np.cos(np.linspace(0, np.pi, int(1.2 * SR))) * 0 + 0, 0)
# final stinger
n = int(2.5 * SR); u = np.arange(n) / SR
put(sum(np.sin(2 * np.pi * f * u) for f in (110, 164.8, 233.1)) * np.exp(-u * 1.2) * 0.25, 59.0, 1.0)

mix = np.stack([L, R], 1)
mix[-int(0.4 * SR):] *= np.linspace(1, 0, int(0.4 * SR))[:, None]
mix = mix / np.max(np.abs(mix)) * 0.92
out = os.path.join(os.path.dirname(__file__), '..', 'assets', 'soundtrack.wav')
with wave.open(out, 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix * 32767).astype('<i2').tobytes())
print('wrote', os.path.abspath(out))
