# Synthesizes an upbeat, royalty-free music bed + pop/whoosh SFX synced to cues.json
import json, sys, wave
import numpy as np

SR = 44100
cues = json.load(open(sys.argv[1]))
dur = cues['dur']
n = int(SR * dur)
t = np.arange(n) / SR
mix = np.zeros(n)

def note_freq(m): return 440.0 * 2 ** ((m - 69) / 12)
def env(length, a=0.005, d=0.25):
    e = np.ones(length); ai = int(a * SR)
    e[:ai] = np.linspace(0, 1, ai)
    e[ai:] = np.exp(-np.arange(length - ai) / (d * SR))
    return e
def add(sig, start):
    i = int(start * SR); j = min(n, i + len(sig))
    if i < n: mix[i:j] += sig[:j - i]

bpm = 112; beat = 60 / bpm
# I - V - vi - IV in C major (bright "adventure" feel)
chords = [[60, 64, 67], [55, 59, 62], [57, 60, 64], [53, 57, 60]]
bars = int(dur / (beat * 4)) + 1
for b in range(bars):
    ch = chords[b % 4]; t0 = b * 4 * beat
    # soft pad
    L = int(4 * beat * SR); tt = np.arange(L) / SR
    pad = sum(np.sin(2 * np.pi * note_freq(m) * tt) + .3 * np.sin(2 * np.pi * 2 * note_freq(m) * tt) for m in ch)
    pe = np.minimum(1, tt / .3) * np.minimum(1, (4 * beat - tt) / .3)
    add(.035 * pad * pe, t0)
    # plucked arpeggio (8ths)
    for k in range(8):
        m = ch[[0, 1, 2, 1, 0, 2, 1, 2][k]] + 12
        L = int(.4 * SR); tt = np.arange(L) / SR
        f = note_freq(m)
        sig = (np.sin(2 * np.pi * f * tt) + .4 * np.sin(2 * np.pi * 2 * f * tt) + .15 * np.sin(2 * np.pi * 3 * f * tt)) * env(L, .003, .12)
        add(.06 * sig, t0 + k * beat / 2)
    # bass
    for k in range(4):
        L = int(beat * .9 * SR); tt = np.arange(L) / SR
        f = note_freq(ch[0] - 24)
        add(.14 * np.sin(2 * np.pi * f * tt) * env(L, .005, .25), t0 + k * beat)
    # kick on beats, shaker on offbeats (skip first 2 bars for a soft intro)
    if b >= 1:
        for k in range(4):
            L = int(.18 * SR); tt = np.arange(L) / SR
            kick = np.sin(2 * np.pi * (50 + 90 * np.exp(-tt * 40)) * tt) * env(L, .001, .07)
            add(.32 * kick, t0 + k * beat)
            L2 = int(.06 * SR)
            add(.03 * np.random.default_rng(b * 10 + k).standard_normal(L2) * env(L2, .001, .015), t0 + k * beat + beat / 2)

# SFX: pop on caption/card appearance, whoosh on cuts
rng = np.random.default_rng(1)
for c in cues['caps']:
    L = int(.12 * SR); tt = np.arange(L) / SR
    pop = np.sin(2 * np.pi * (500 + 900 * np.exp(-tt * 45)) * tt) * env(L, .001, .03)
    add(.35 * pop, c)
for c in cues['cuts'][1:]:
    L = int(.35 * SR); tt = np.arange(L) / SR
    noise = rng.standard_normal(L)
    # crude band-pass sweep via moving average differences
    k = np.convolve(noise, np.ones(8) / 8, 'same') - np.convolve(noise, np.ones(40) / 40, 'same')
    w = np.sin(np.pi * tt / tt[-1]) ** 2
    add(.22 * k * w, c - .2)

# fade out last 1.5s
fo = int(1.5 * SR); mix[-fo:] *= np.linspace(1, 0, fo)
mix /= max(1e-9, np.abs(mix).max()) / .89
st = np.repeat((mix * 32767).astype(np.int16)[:, None], 2, axis=1)
with wave.open(sys.argv[2], 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(st.tobytes())
print('ok', dur)
