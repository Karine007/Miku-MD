# Builds a Short's timeline from one voice take: optional speed-up, word timings (faster-whisper),
# scene start times from the anchors that appear in the Short's script.
# usage: python3 short_timeline.py <name> <take.wav> <out_dir> [max_take_seconds]
import json, os, re, sys, wave, difflib, subprocess
import numpy as np
os.environ.setdefault('HF_HUB_OFFLINE', '1')
from faster_whisper import WhisperModel
NAME, TAKE, OUT = sys.argv[1:4]; MAXT = float(sys.argv[4]) if len(sys.argv) > 4 else 57.0
HERE = os.path.dirname(os.path.abspath(__file__)); story = NAME.split('_')[0]
script = json.load(open(f'{HERE}/{NAME}.json')); anchors = json.load(open(f'{HERE}/{NAME}_anchors.json'))
LEAD, TAIL = .4, 1.8
os.makedirs(OUT, exist_ok=True)
with wave.open(TAKE) as w: rate = w.getframerate(); a = np.frombuffer(w.readframes(w.getnframes()), np.int16)
nz = np.where(np.abs(a) > 400)[0]; a = a[max(0, nz[0] - int(.05 * rate)): nz[-1] + int(.25 * rate)]
L = len(a) / rate; sp = max(1.0, L / MAXT)
if sp > 1.001:
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-f', 's16le', '-ar', str(rate), '-ac', '1', '-i', '-', '-af', f'atempo={sp:.4f}', '-f', 's16le', '-'], input=a.tobytes(), capture_output=True).stdout
    a = np.frombuffer(raw, np.int16)
print(f'take {L:.1f}s  speed x{sp:.3f} -> {len(a)/rate:.1f}s')
f = a.astype(np.float32) / 32768; n16 = int(len(f) * 16000 / rate); f16 = np.interp(np.arange(n16) * rate / 16000, np.arange(len(f)), f).astype(np.float32)
segs, _ = WhisperModel('base.en', device='cpu', compute_type='int8').transcribe(f16, word_timestamps=True, language='en', beam_size=5)
norm = lambda w: re.sub(r"[^a-z0-9]", '', w.lower())
hw = [(x.start + LEAD, x.end + LEAD, x.word.strip()) for s in segs for x in s.words]
sw = ' '.join(c[1] for c in script).split(); hn = [norm(x[2]) for x in hw]; sn = [norm(x) for x in sw]
sm = difflib.SequenceMatcher(None, hn, sn, autojunk=False); out = [None] * len(sw)
for op, i1, i2, j1, j2 in sm.get_opcodes():
    if op == 'equal':
        for d in range(i2 - i1): out[j1 + d] = (hw[i1 + d][0], hw[i1 + d][1])
    elif op == 'replace':
        a0, a1 = hw[i1][0], hw[i2 - 1][1]; n = j2 - j1
        for d in range(n): out[j1 + d] = (a0 + (a1 - a0) * d / n, a0 + (a1 - a0) * (d + 1) / n)
for j in range(len(sw)):
    if out[j] is None:
        p = next((out[q][1] for q in range(j - 1, -1, -1) if out[q]), LEAD); nx = next((out[q][0] for q in range(j + 1, len(sw)) if out[q]), p + .3)
        out[j] = (p, min(nx, p + .3))
print(f'match {sm.ratio():.3f}')
words = [[round(out[j][0], 3), round(out[j][1], 3), sw[j]] for j in range(len(sw))]
voice = np.concatenate([np.zeros(int(LEAD * rate), np.int16), a]); dur = round(len(voice) / rate + TAIL, 2)
with wave.open(f'{OUT}/voice.wav', 'wb') as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(rate); w.writeframes(voice.tobytes())
wn = [norm(w[2]) for w in words]; scenes = {}; pos = 0
for sid, ph in anchors:
    pn = [norm(x) for x in ph.split()]
    for i in range(pos, len(wn) - len(pn) + 1):
        if wn[i:i + len(pn)] == pn: scenes[sid] = round(words[i][0] - .12, 3); pos = i + 1; break
    else: print('ANCHOR NOT FOUND', sid, ph)
TL = {'words': words, 'scenes': scenes, 'dur': dur}
json.dump(TL, open(f'{OUT}/tl.json', 'w'))
open(f'{HERE}/../{story}/timeline_{NAME}.js', 'w').write('window.TL=' + json.dumps(TL) + ';\n')
print('dur', dur, 'scenes', len(scenes))
