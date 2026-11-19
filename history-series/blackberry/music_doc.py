# Calm documentary music bed (original, synthesized) + soft whooshes on scene cuts.
# usage: python3 music_doc.py <cues.json> <out.wav>
import json, sys, wave
import numpy as np
SR = 44100
cues = json.load(open(sys.argv[1])); dur = cues['dur']; n = int(SR * dur); t = np.arange(n) / SR
L = np.zeros(n); Rr = np.zeros(n)
nf = lambda m: 440 * 2 ** ((m - 69) / 12)
def add(sig, start, pan=0.):
    i = int(start * SR); j = min(n, i + len(sig))
    if i < n: L[i:j] += sig[:j - i] * (1 - pan) ; Rr[i:j] += sig[:j - i] * (1 + pan)
bpm = 84; beat = 60 / bpm; bar = 4 * beat
prog = [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]]   # Am F C G
rng = np.random.default_rng(3)
for b in range(int(dur / bar) + 1):
    ch = prog[b % 4]; t0 = b * bar; Ln = int(bar * 1.15 * SR); tt = np.arange(Ln) / SR
    env = np.minimum(1, tt / .8) * np.minimum(1, (bar * 1.15 - tt) / .6)
    pad = sum(np.sin(2 * np.pi * nf(m) * tt + .3 * np.sin(2 * np.pi * .2 * tt)) + .25 * np.sin(2 * np.pi * nf(m + 12) * tt) for m in ch)
    add(.03 * pad * env, t0)
    bass = np.sin(2 * np.pi * nf(ch[0] - 12) * tt) * np.exp(-tt / 1.5); add(.06 * bass, t0)
    # soft piano-like plucks on an 8th pattern
    pat = [0, 2, 1, 2, 0, 2, 1, 2]
    for k in range(8):
        if b >= 2 and (k % 2 == 0 or rng.random() < .5):
            m = ch[pat[k]] + 12; Lp = int(1.4 * SR); tp = np.arange(Lp) / SR; f = nf(m)
            s = (np.sin(2 * np.pi * f * tp) + .4 * np.sin(4 * np.pi * f * tp) + .15 * np.sin(6 * np.pi * f * tp)) * np.exp(-tp / .45) * np.minimum(1, tp / .004)
            add(.035 * s, t0 + k * beat / 2, pan=(.3 if k % 2 else -.3))
    # light hats after intro
    if b >= 4:
        for k in range(8):
            Lh = int(.05 * SR); h = rng.standard_normal(Lh) * np.exp(-np.arange(Lh) / (SR * .012)); h = np.diff(h, prepend=0)
            add(.012 * h, t0 + k * beat / 2 + (beat / 4 if k % 2 else 0) * 0)
        Lk = int(.25 * SR); tk = np.arange(Lk) / SR; kick = np.sin(2 * np.pi * (50 + 60 * np.exp(-tk / .03)) * tk) * np.exp(-tk / .12)
        for k in (0, 2): add(.07 * kick, t0 + k * beat)
for c in cues.get('cuts', []):
    Lw = int(.35 * SR); tw = np.arange(Lw) / SR; w = rng.standard_normal(Lw)
    w = np.convolve(w, np.ones(30) / 30, 'same') * np.sin(np.pi * tw / .35) ** 2; add(.05 * w, c - .18)
fade = np.minimum(1, t / 1.5) * np.minimum(1, (dur - t) / 2.5); L *= fade; Rr *= fade
st = np.stack([L, Rr], 1); st /= max(1e-9, np.abs(st).max()) / .7
with wave.open(sys.argv[2], 'wb') as w: w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((st * 32767).astype(np.int16).tobytes())
print('music', round(dur, 2))
