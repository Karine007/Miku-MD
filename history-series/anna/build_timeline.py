# Joins the voice takes, gets word timings with faster-whisper, aligns them to the script,
# and writes timeline.js (words + scene start times) plus the voice track.
# usage: python3 build_timeline.py <takes_dir> <out_dir>
import json, os, re, sys, wave, difflib
import numpy as np
os.environ.setdefault('HF_HUB_OFFLINE', '1')
from faster_whisper import WhisperModel
TK, OUT = sys.argv[1], sys.argv[2]; HERE = os.path.dirname(os.path.abspath(__file__))
script = json.load(open(os.path.join(HERE, 'script.json'))); anchors = json.load(open(os.path.join(HERE, 'anchors.json')))
LEAD, GAP, TAIL = .5, .55, 3.0
groups = [('A', script[0:4]), ('B', script[4:7]), ('C', script[7:11])]
model = WhisperModel('base.en', device='cpu', compute_type='int8')
norm = lambda w: re.sub(r"[^a-z0-9]", '', w.lower())
pcm_all = []; words = []; t = LEAD; rate = 24000
for k, chs in groups:
    with wave.open(f'{TK}/{k}/take.wav') as w: rate = w.getframerate(); a = np.frombuffer(w.readframes(w.getnframes()), np.int16)
    # trim leading/trailing silence
    nz = np.where(np.abs(a) > 400)[0]; a = a[max(0, nz[0] - int(.05 * rate)): nz[-1] + int(.25 * rate)]
    f = a.astype(np.float32) / 32768
    n16 = int(len(f) * 16000 / rate); f16 = np.interp(np.arange(n16) * rate / 16000, np.arange(len(f)), f).astype(np.float32)
    segs, _ = model.transcribe(f16, word_timestamps=True, language='en', beam_size=5)
    hw = [(x.start + t, x.end + t, x.word.strip()) for s in segs for x in s.words]
    sw = ' '.join(c[1] for c in chs).split()
    hn = [norm(x[2]) for x in hw]; sn = [norm(x) for x in sw]
    sm = difflib.SequenceMatcher(None, hn, sn, autojunk=False)
    out = [None] * len(sw)
    for op, i1, i2, j1, j2 in sm.get_opcodes():
        if op == 'equal':
            for d in range(i2 - i1): out[j1 + d] = (hw[i1 + d][0], hw[i1 + d][1])
        elif op == 'replace':
            a0, a1 = hw[i1][0], hw[i2 - 1][1]; n = j2 - j1
            for d in range(n): out[j1 + d] = (a0 + (a1 - a0) * d / n, a0 + (a1 - a0) * (d + 1) / n)
    # fill inserts by interpolation
    for j in range(len(sw)):
        if out[j] is None:
            p = next((out[q][1] for q in range(j - 1, -1, -1) if out[q]), t); nx = next((out[q][0] for q in range(j + 1, len(sw)) if out[q]), p + .3)
            out[j] = (p, min(nx, p + .3))
    ratio = sm.ratio(); print(f'take {k}: {len(a)/rate:.1f}s  match {ratio:.3f}  heard {len(hw)} words / script {len(sw)}')
    print('   heard tail:', ' '.join(x[2] for x in hw[-8:]))
    words += [[round(out[j][0], 3), round(out[j][1], 3), sw[j]] for j in range(len(sw))]
    pcm_all.append(np.zeros(int((LEAD if not pcm_all else 0) * rate), np.int16)); pcm_all.append(a); pcm_all.append(np.zeros(int(GAP * rate), np.int16))
    t += len(a) / rate + GAP
voice = np.concatenate(pcm_all); dur = round(len(voice) / rate + TAIL, 2)
os.makedirs(OUT, exist_ok=True)
with wave.open(f'{OUT}/voice.wav', 'wb') as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(rate); w.writeframes(voice.tobytes())
# scene anchors: sequential search
wn = [norm(w[2]) for w in words]; scenes = {}; pos = 0
for sid, ph in anchors:
    pn = [norm(x) for x in ph.split()]
    for i in range(pos, len(wn) - len(pn) + 1):
        if wn[i:i + len(pn)] == pn: scenes[sid] = round(words[i][0] - .12, 3); pos = i + 1; break
    else: print('ANCHOR NOT FOUND', sid, ph)
json.dump({'words': words, 'scenes': scenes, 'dur': dur}, open(f'{OUT}/tl.json', 'w'))
open(os.path.join(HERE, 'timeline.js'), 'w').write('window.TL=' + json.dumps({'words': words, 'scenes': scenes, 'dur': dur}) + ';\n')
print('dur', dur, 'scenes', len(scenes))
