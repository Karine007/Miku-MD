"""Ambience + effects for 'Le Piège Photo', laid out from the voice-driven timeline -> assets/soundtrack.wav."""
import json, os, wave, numpy as np
R = 44100; ROOT = os.path.join(os.path.dirname(__file__), '..'); rng = np.random.RandomState(7)
FILM = json.load(open(os.path.join(ROOT, 'assets', 'timeline.json'))); T = FILM['total']
out = np.zeros(int((T + 1) * R), np.float32)
def put(x, at, g=1.0):
    a = int(at * R); n = min(len(x), len(out) - a)
    if n > 0: out[a:a + n] += x[:n] * g
def lp(x, k): return np.convolve(x, np.ones(k) / k, 'same')
def env(n, a=0.01, d=0.2): t = np.arange(n) / R; return np.minimum(1, t / a) * np.exp(-t / d)
def crickets(d):
    n = int(d * R); t = np.arange(n) / R; y = np.zeros(n)
    for f, rate, ph in [(4300, 7, 0), (4700, 5.5, 1.3), (3900, 6.3, 2.1)]:
        y += np.sin(2 * np.pi * f * t) * (np.sin(2 * np.pi * rate * t + ph) > 0.6) * (np.sin(2 * np.pi * 0.4 * t + ph) > -0.2)
    return lp(y, 3) * 0.05
def wind(d, g=1): n = int(d * R); x = lp(lp(rng.uniform(-1, 1, n), 60), 60); m = 0.6 + 0.4 * np.sin(np.arange(n) / R * 0.5); return x * m * 0.5 * g
def crackle(d): n = int(d * R); y = np.zeros(n); idx = rng.randint(0, n, int(d * 14)); y[idx] = rng.uniform(-1, 1, len(idx)); return lp(np.convolve(y, np.exp(-np.arange(300) / 40), 'same'), 2) * 0.25
def drone(d, f=55, g=1): t = np.arange(int(d * R)) / R; return (np.sin(2 * np.pi * f * t) + 0.5 * np.sin(2 * np.pi * f * 1.5 * t + np.sin(t * 0.7)) + 0.3 * np.sin(2 * np.pi * f * 2.02 * t)) * 0.06 * g * np.minimum(1, t / 1.5)
def heartbeat(d, bpm=70):
    y = np.zeros(int(d * R)); n = int(0.12 * R); t = np.arange(n) / R; thump = np.sin(2 * np.pi * 50 * t) * np.exp(-t * 30)
    for k in np.arange(0, d, 60 / bpm):
        for o, g in [(0, 1), (0.22, 0.6)]:
            a = int((k + o) * R); m = min(n, len(y) - a)
            if m > 0: y[a:a + m] += thump[:m] * g
    return y * 0.5
def shutter(): n = int(0.18 * R); x = rng.uniform(-1, 1, n) * env(n, 0.001, 0.02); y = rng.uniform(-1, 1, n) * env(n, 0.001, 0.015); return np.concatenate([x, np.zeros(int(0.06 * R)), y]) * 0.5
def flash(): n = int(0.6 * R); t = np.arange(n) / R; return np.sin(2 * np.pi * (3000 + 2500 * t) * t) * np.exp(-t * 6) * 0.05
def sting(): n = int(3.0 * R); t = np.arange(n) / R; x = sum(np.sin(2 * np.pi * f * t) for f in (61.7, 65.4, 92.5, 130.8, 185)) * np.exp(-t * 1.0) * 0.12; x += rng.uniform(-1, 1, n) * np.exp(-t * 8) * 0.25; return x
def buzz(d): t = np.arange(int(d * R)) / R; return np.sin(2 * np.pi * 150 * t) * (np.sin(2 * np.pi * 2.2 * t) > 0) * 0.25
def zipper(d):
    n = int(d * R); y = np.zeros(n); t = 0
    while t < d: rate = 25 + 40 * (t / d); a = int(t * R); m = min(int(0.006 * R), n - a); y[a:a + m] += rng.uniform(-1, 1, m) * 0.5; t += 1 / rate
    return lp(y, 2)
for b in FILM['beats']:
    s, a, st, d = b['s'], b.get('a'), b['start'], b['dur']
    if s in ('campfire', 'tree', 'tentout'): put(crickets(d), st, 1); put(wind(d, 0.5), st)
    if s == 'campfire': put(crackle(d), st)
    if s in ('tentin', 'face', 'zip', 'card'): put(wind(d, 0.6), st); put(drone(d, 49 if s == 'zip' else 55, 1.3 if s in ('zip', 'card') else 1), st)
    if s == 'photo':
        put(shutter(), st); put(flash(), st + 0.05); put(drone(d, 58, 0.8), st)
        if b.get('hook') or b.get('fig') in ('lens', 'door', 'side'): put(sting(), st + 0.1, 1.0 if b.get('fig') == 'lens' else 0.7)
    if a in ('frozen', 'fear') or s == 'zip': put(heartbeat(d, 92 if s == 'zip' else 78), st)
    if a == 'buzz': put(buzz(d * 0.33), st + d * 0.12)
    if s == 'zip': put(zipper(d * 0.8), st + d * 0.15, 0.8); put(sting(), st + d * 0.83, 1.0)
    if s == 'endcard': put(sting(), st, 0.6)
out = out[:int(T * R)]; out = out / (np.max(np.abs(out)) + 1e-9) * 0.9
w = wave.open(os.path.join(ROOT, 'assets', 'soundtrack.wav'), 'wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(R)
w.writeframes((np.stack([out, out], 1) * 32767).astype('<i2').tobytes()); w.close(); print('soundtrack', T)
