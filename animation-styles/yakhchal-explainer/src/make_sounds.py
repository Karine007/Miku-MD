"""Music bed + effects for 'The Yakhchal' from the voice-driven timeline -> assets/soundtrack.wav."""
import json, os, wave, numpy as np
R = 44100; ROOT = os.path.join(os.path.dirname(__file__), '..'); rng = np.random.RandomState(5)
FILM = json.load(open(os.path.join(ROOT, 'assets', 'timeline.json'))); T = FILM['total']; B = {b['s']: b for b in FILM['beats']}
out = np.zeros(int((T + 1) * R), np.float32)
def put(x, at, g=1.0):
    a = int(at * R); n = min(len(x), len(out) - a)
    if n > 0: out[a:a + n] += x[:n] * g
def lp(x, k): return np.convolve(x, np.ones(k) / k, 'same')
def pluck(f, d=0.45):
    n = int(R * d); buf = np.random.RandomState(int(f)).uniform(-1, 1, int(R / f)); y = np.zeros(n)
    for i in range(n): y[i] = buf[i % len(buf)]; buf[i % len(buf)] = 0.497 * (buf[i % len(buf)] + buf[(i + 1) % len(buf)])
    return y
def kick(): t = np.arange(int(0.25 * R)) / R; return np.sin(2 * np.pi * (60 + 90 * np.exp(-t * 30)) * t) * np.exp(-t * 14)
def hat(): n = int(0.05 * R); x = rng.uniform(-1, 1, n); return (x - lp(x, 4)) * np.exp(-np.arange(n) / R * 80) * 0.5
def whoosh(): n = int(0.45 * R); t = np.arange(n) / R; x = lp(rng.uniform(-1, 1, n), 12) * np.sin(np.pi * t / 0.45) ** 2; return x * 0.5
def thunk(): n = int(0.18 * R); t = np.arange(n) / R; return (np.sin(2 * np.pi * 110 * t) * np.exp(-t * 25) + lp(rng.uniform(-1, 1, n), 6) * np.exp(-t * 35)) * 0.6
def water(d): n = int(d * R); x = lp(rng.uniform(-1, 1, n), 5) - lp(rng.uniform(-1, 1, n), 40); m = 0.7 + 0.3 * np.sin(np.arange(n) / R * 7); return x * m * 0.35 * np.minimum(1, np.arange(n) / R / 0.6)
def chime(): t = np.arange(int(1.6 * R)) / R; return sum(np.sin(2 * np.pi * f * t) for f in (1046.5, 1318.5, 1568)) * np.exp(-t * 3) * 0.12
# upbeat bed: 112 bpm, pluck arpeggio + soft kick/hat
beat = 60 / 112; notes = [261.6, 329.6, 392.0, 523.3, 440.0, 392.0, 329.6, 392.0, 293.7, 349.2, 440.0, 587.3, 523.3, 440.0, 349.2, 440.0]
t, k = 0.0, 0
while t < T - 0.5:
    put(pluck(notes[k % 16]), t, 0.10); put(pluck(notes[k % 16] / 2, 0.6), t, 0.05) if k % 4 == 0 else None
    if k % 2 == 0: put(kick(), t, 0.12)
    put(hat(), t + beat / 4, 0.05); t += beat / 2; k += 1
for b in FILM['beats'][1:]: put(whoosh(), b['start'] - 0.2, 0.25)
def wind(d, g=1): n = int(d * R); x = lp(lp(rng.uniform(-1, 1, n), 60), 60); return x * (0.6 + 0.4 * np.sin(np.arange(n) / R * 0.5)) * 0.6 * g
def crickets(d):
    n = int(d * R); t = np.arange(n) / R; y = np.zeros(n)
    for f, rate, ph in [(4300, 7, 0), (4700, 5.5, 1.3)]: y += np.sin(2 * np.pi * f * t) * (np.sin(2 * np.pi * rate * t + ph) > 0.6)
    return lp(y, 3) * 0.04
def crack(): n = int(0.3 * R); t = np.arange(n) / R; return (rng.uniform(-1, 1, n) * np.exp(-t * 25) + np.sin(2 * np.pi * 2400 * t) * np.exp(-t * 40) * 0.5) * 0.5
def build(): n = int(0.2 * R); t = np.arange(n) / R; return np.sin(2 * np.pi * 90 * t) * np.exp(-t * 22) * 0.7
def sizzle(d): n = int(d * R); x = rng.uniform(-1, 1, n); return (x - lp(x, 3)) * 0.05
def drip(): t = np.arange(int(0.12 * R)) / R; return np.sin(2 * np.pi * (900 + 1500 * t) * t) * np.exp(-t * 40) * 0.4
put(water(B['pools']['dur'] * 0.7), B['pools']['start'] + B['pools']['dur'] * 0.3, 0.45)
for i in range(8): put(build(), B['wall']['start'] + B['wall']['dur'] * (0.08 + 0.08 * i), 0.6)
put(wind(B['night']['dur']), B['night']['start'], 0.8); put(crickets(B['night']['dur']), B['night']['start'], 1)
for i in range(6): put(crack(), B['harvest']['start'] + B['harvest']['dur'] * (0.1 + 0.13 * i), 0.7)
for n in ('hook', 'summer'): put(sizzle(B[n]['dur']), B[n]['start'], 1)
for i in range(10): put(drip(), B['melt']['start'] + B['melt']['dur'] * (0.05 + 0.09 * i), 0.6)
put(chime(), B['today']['start'] + 0.8, 1.0); put(chime(), B['endcard']['start'], 0.8)
out = out[:int(T * R)]; fade = int(1.5 * R); out[-fade:] *= np.linspace(1, 0, fade); out = out / (np.max(np.abs(out)) + 1e-9) * 0.9
w = wave.open(os.path.join(ROOT, 'assets', 'soundtrack.wav'), 'wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(R)
w.writeframes((np.stack([out, out], 1) * 32767).astype('<i2').tobytes()); w.close(); print('soundtrack', T)
