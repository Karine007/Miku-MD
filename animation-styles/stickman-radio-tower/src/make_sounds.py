"""Music bed + sound effects for '18 Days in the Radio Tower', placed on the voice-driven timeline.
Reads assets/timeline.json (from make_voice.py); each beat's "fx" list = [[effect, fraction_of_beat], ...].
Writes assets/soundtrack.wav. Everything is synthesized (no samples), deterministic."""
import json, os, wave
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.join(HERE, '..')
FILM = json.load(open(os.path.join(ROOT, 'assets', 'timeline.json')))
SR = 44100; DUR = FILM['total']; N = int(DUR * SR) + SR
rng = np.random.default_rng(18)
L = np.zeros(N, np.float32); R = np.zeros(N, np.float32)

def put(x, at, g=1.0, pan=0.0):
    i = int(max(0, at) * SR); j = min(N, i + len(x)); x = x[: j - i] * g
    L[i:j] += x * (1 - pan) * 0.7071 * 1.414 / 2 * 2; R[i:j] += x * (1 + pan) * 0.7071 * 1.414 / 2 * 2
def u(sec): return np.arange(int(sec * SR)) / SR
def smooth(x, n): c = np.cumsum(np.insert(x, 0, 0)); y = (c[n:] - c[:-n]) / n; return np.concatenate([y, np.zeros(n - 1)])
def env(n, a, r):
    e = np.ones(n); A, B = int(a * SR), int(r * SR)
    if A: e[:A] = np.linspace(0, 1, A)
    if B: e[-B:] *= np.linspace(1, 0, B)
    return e
def noise(sec, lp=4): return smooth(rng.normal(0, 1, int(sec * SR)), lp)
def tone(f, sec, decay=3.0): t = u(sec); return np.sin(2 * np.pi * f * t) * np.exp(-t * decay)
def pluck(f, sec, damp=0.996):
    n = int(sec * SR); p = max(2, int(SR / f)); b = rng.uniform(-1, 1, p); o = np.empty(n)
    for i in range(n): o[i] = b[i % p]; b[i % p] = damp * 0.5 * (b[i % p] + b[(i + 1) % p])
    return o * env(n, 0.002, 0.1)

# ---------- effects
def fx_phones(sec=2.4): t = u(sec); ring = np.sign(np.sin(2 * np.pi * 440 * t)) * 0.3 + np.sin(2 * np.pi * 480 * t) * 0.3; return ring * (np.sin(2 * np.pi * 10 * t) > 0) * ((t % 1.2) < 0.8) * 0.5
def fx_sirens(sec=4): t = u(sec); f = 650 + 250 * np.sin(2 * np.pi * 0.5 * t); return np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.25 * env(len(t), 0.8, 1.0)
def fx_alarm(sec=3): t = u(sec); return np.sign(np.sin(2 * np.pi * 880 * t)) * ((t * 3) % 1 < 0.5) * 0.25
def fx_powerdown(sec=1.4): t = u(sec); f = 220 * np.exp(-t * 2); return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 1.5) * 0.6 + noise(sec, 8) * np.exp(-t * 3) * 0.5
def fx_creak(sec=1.2): t = u(sec); f = 180 + 120 * np.sin(t * 7) ** 2; return np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR)) * 0.12 * env(len(t), 0.1, 0.3) * (0.5 + 0.5 * np.sin(t * 60))
def fx_groans(sec=3.0):
    out = np.zeros(int(sec * SR))
    for k in range(4):
        n = int(rng.uniform(0.8, 1.4) * SR); t = np.arange(n) / SR; f = rng.uniform(90, 140) * (1 - 0.2 * t)
        v = np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR)) * smooth(np.abs(rng.normal(0, 1, n)), 400) * 0.6
        a = int(rng.uniform(0, sec - 1.4) * SR); out[a:a + n] += smooth(v, 6) * np.sin(np.pi * t / t[-1])
    return out * 0.5
def fx_slam(sec=0.8): t = u(sec); return (np.sin(2 * np.pi * 70 * t) + noise(sec, 3) * 0.8) * np.exp(-t * 9)
def fx_drag(sec=1.6): t = u(sec); return noise(sec, 30) * (0.6 + 0.4 * np.sin(t * 30)) * env(len(t), 0.1, 0.3) * 0.8
def fx_whoosh(sec=0.7): t = u(sec); return noise(sec, 25) * np.sin(np.pi * t / t[-1]) ** 2 * 1.4
def fx_tick(sec=0.15): return tone(1600, sec, 40) * 0.4
def fx_vend(sec=1.0): t = u(sec); return np.concatenate([noise(0.5, 12) * 0.5 * env(int(0.5 * SR), 0.02, 0.1), tone(140, 0.5, 12) * 0.8])
def fx_generator(sec=3.0): t = u(sec); return (np.sign(np.sin(2 * np.pi * 52 * t)) * 0.15 + noise(sec, 40) * 0.4) * env(len(t), 0.4, 0.6)
def fx_static(sec=1.5): t = u(sec); return rng.normal(0, 1, len(t)) * 0.12 * env(len(t), 0.05, 0.4)
def fx_crackle(sec=1.2): t = u(sec); x = rng.normal(0, 1, len(t)) * (rng.random(len(t)) > 0.995) * 1.5 + rng.normal(0, 0.15, len(t)); return smooth(x, 2) * env(len(t), 0.02, 0.3)
def fx_wind(sec=4.0): t = u(sec); return noise(sec, 120) * 3 * (0.6 + 0.4 * np.sin(t * 0.9)) * env(len(t), 0.8, 0.8)
def fx_pencil(sec=0.6): t = u(sec); return noise(sec, 2) * 0.25 * (np.sin(t * 40) > 0) * env(len(t), 0.02, 0.1)
def fx_scratch(sec=1.4): t = u(sec); return smooth(rng.normal(0, 1, len(t)), 2) * 0.35 * ((t * 7) % 1 < 0.6) * env(len(t), 0.05, 0.2)
def fx_rattle(sec=0.9): t = u(sec); return (np.sin(2 * np.pi * 300 * t) * 0.3 + noise(sec, 2) * 0.4) * ((t * 14) % 1 < 0.4) * env(len(t), 0.01, 0.2)
def fx_thunder(sec=3.5): t = u(sec); return noise(sec, 200) * 9 * np.exp(-t * 1.3) * (1 + 0.6 * np.sin(t * 9))
def fx_rain(sec=None): return None  # handled as a continuous bed below
def fx_bang(sec=0.7): t = u(sec); return (np.sin(2 * np.pi * 60 * t) + noise(sec, 2) * 0.6) * np.exp(-t * 12) * 1.2
def fx_heartbeat(sec=2.4):
    out = np.zeros(int(sec * SR))
    for k in range(3):
        for d in (0, 0.22):
            n = int(0.18 * SR); t = np.arange(n) / SR; a = int((k * 0.8 + d) * SR); out[a:a + n] += np.sin(2 * np.pi * (55 + 30 * np.exp(-t * 30)) * t) * np.exp(-t * 18) * (1 if d == 0 else 0.6)
    return out
def fx_water(sec=4.0): t = u(sec); return noise(sec, 60) * 2.2 * (0.7 + 0.3 * np.sin(t * 2.1)) * env(len(t), 0.5, 0.8)
def fx_pour(sec=2.6): t = u(sec); return smooth(rng.normal(0, 1, len(t)), 3) * 0.3 * (0.8 + 0.2 * np.sin(t * 25)) * env(len(t), 0.2, 0.4)
def fx_switch(sec=0.3): t = u(sec); return noise(sec, 1) * np.exp(-t * 60) * 1.2
def fx_hum(sec=3.0): t = u(sec); return (np.sin(2 * np.pi * 60 * t) + 0.5 * np.sin(2 * np.pi * 120 * t)) * 0.2 * env(len(t), 0.5, 1)
def heli(sec, rate=7, amp=1.0):
    t = u(sec); thump = (np.sin(2 * np.pi * rate * t) > 0.6) * 1.0; return (smooth(rng.normal(0, 1, len(t)), 40) * 3 * smooth(thump, 400) + np.sin(2 * np.pi * 45 * t) * 0.1) * amp
def fx_heli_far(sec=4.0): return heli(sec, 6, 0.35) * env(int(sec * SR), 1.0, 0.8)
def fx_heli_near(sec=4.0): return heli(sec, 8, 0.9) * env(int(sec * SR), 0.4, 0.8)
def fx_heli_inside(sec=6.0): return heli(sec, 8, 0.45) * env(int(sec * SR), 0.3, 1.0)
def fx_fire_crackle(sec=4.0): t = u(sec); return smooth(rng.normal(0, 1, len(t)) * (rng.random(len(t)) > 0.997) * 2, 3) + noise(sec, 80) * 0.6
FX = {k[3:]: v for k, v in globals().items() if k.startswith('fx_')}
GAIN = {'thunder': 0.7, 'groans': 0.8, 'phones': 0.6, 'alarm': 0.5, 'sirens': 0.5, 'generator': 0.6, 'static': 0.6, 'whoosh': 0.5}

for b in FILM['beats']:
    for name, frac in b.get('fx', []):
        at = b['start'] + frac * b['dur']
        if name == 'rain': continue
        f = FX[name]; x = f(min(b['dur'] * (1 - frac) + 0.5, 8)) if name in ('wind', 'water', 'heli_far', 'heli_near', 'heli_inside', 'fire_crackle', 'generator', 'groans', 'hum') else f()
        put(x, at, GAIN.get(name, 0.8), pan=float(rng.uniform(-0.3, 0.3)))
# continuous rain over the storm beats
storm = [b for b in FILM['beats'] if b.get('light') == 'storm']
if storm:
    a, z = storm[0]['start'], storm[-1]['start'] + storm[-1]['dur']
    r = (rng.normal(0, 1, int((z - a) * SR)) * 0.25 + noise(z - a, 6) * 0.5) * env(int((z - a) * SR), 0.8, 1.0)
    put(r, a, 0.7)
# dark-scene room tone
for b in FILM['beats']:
    if b.get('light') == 'dark': put(noise(b['dur'], 300) * 6 * env(int(b['dur'] * SR), 0.3, 0.3), b['start'], 0.5)

# ---------- music: soft piano-like plucks over a low pad; mood follows the light of each beat
MOODS = {'night': ([110, 130.8, 164.8], [440, 523.3, 659.3, 587.3]), 'dark': ([98, 116.5, 146.8], [392, 349.2, 311.1, 293.7]),
         'alarm': ([92.5, 110, 138.6], [370, 415.3, 349.2, 311.1]), 'day': ([130.8, 164.8, 196], [523.3, 659.3, 784, 659.3]),
         'storm': ([98, 116.5, 146.8], [392, 466.2, 440, 392]), 'dawn': ([146.8, 185, 220], [587.3, 740, 880, 740]),
         'dusk': ([110, 138.6, 164.8], [440, 554.4, 659.3, 554.4])}
t_all = np.arange(N) / SR
pad = np.zeros(N, np.float32)
for b in FILM['beats']:
    m = b.get('light') or ('night' if b['s'] in ('daycard', 'endcard') else 'day')
    chord, mel = MOODS.get(m, MOODS['night'])
    a, z = int(b['start'] * SR), int((b['start'] + b['dur']) * SR); seg = t_all[a:z]
    s = sum(np.sin(2 * np.pi * f * seg) + 0.35 * np.sin(2 * np.pi * f * 2.003 * seg) for f in chord) / 3
    pad[a:z] += s * env(z - a, min(0.6, (z - a) / SR / 3), min(0.6, (z - a) / SR / 3))
    step = 1.1 if m in ('day', 'dawn') else 1.6
    k = 0; at = b['start'] + 0.2
    while at < b['start'] + b['dur'] - 0.3:
        put(pluck(mel[k % len(mel)], 1.8, 0.997), at, 0.16, pan=0.25); k += 1; at += step
put(pad * 0.09, 0, 1.0)
# finale swell from the moment the tower lights up
lit = next((b for b in FILM['beats'] if b.get('a') == 'lightup'), None)
if lit:
    a = lit['start']; n = int((DUR - a) * SR); t = np.arange(n) / SR
    sw = sum(np.sin(2 * np.pi * f * t) for f in (146.8, 220, 293.7, 370)) * 0.06 * np.clip(t / 4, 0, 1) * env(n, 0.5, 2.0)
    put(sw, a, 1.0)

mix = np.stack([L, R], 1)[: int(DUR * SR)]
mix[-int(1.5 * SR):] *= np.linspace(1, 0, int(1.5 * SR))[:, None]
mix = mix / (np.max(np.abs(mix)) + 1e-9) * 0.9
with wave.open(os.path.join(ROOT, 'assets', 'soundtrack.wav'), 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix * 32767).astype('<i2').tobytes())
print(f'wrote soundtrack.wav ({DUR:.1f}s)')
