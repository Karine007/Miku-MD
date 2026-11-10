# Splits one continuous voiceover take into per-line clips (line_0.wav ...) for voiceover.py.
# Each line's first words are found in the take's word timestamps (faster-whisper) and the take
# is cut in the pause just before them.
# usage: python3 split_take.py <take.wav> <lines.json> <out_dir>
import json, os, re, subprocess, sys, wave
import numpy as np
from faster_whisper import WhisperModel

TAKE, LINES, OUT = sys.argv[1:4]
norm = lambda w: re.sub(r'[^a-z0-9]', '', w.lower())
raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', TAKE, '-ac', '1', '-ar', '16000', '-f', 'f32le', '-'], capture_output=True, check=True).stdout
segs, _ = WhisperModel('base.en', device='cpu', compute_type='int8').transcribe(np.frombuffer(raw, np.float32), word_timestamps=True)
words = [(norm(w.word), w.start, w.end) for s in segs for w in s.words]
words = [w for w in words if w[0]]
lines = [l[2] if isinstance(l, list) else l for l in json.load(open(LINES))]

starts, pos = [0.0], 0
for k in range(1, len(lines)):
    key = [norm(t) for t in lines[k].split()[:2]]
    key = [t for t in key if t]
    found = None
    for j in range(pos + 1, len(words) - len(key) + 1):
        if [words[j + i][0] for i in range(len(key))] == key:
            found = j; break
    if found is None:  # fall back to text proportion
        frac = sum(len(l) for l in lines[:k]) / sum(len(l) for l in lines)
        found = max(pos + 1, min(len(words) - 1, round(frac * len(words))))
        print(f'  line {k}: anchor not found, using proportional cut')
    starts.append((words[found - 1][2] + words[found][1]) / 2); pos = found

with wave.open(TAKE) as w:
    sr, ch, sw = w.getframerate(), w.getnchannels(), w.getsampwidth(); audio = w.readframes(w.getnframes())
bpf = ch * sw; total = len(audio) / bpf / sr
os.makedirs(OUT, exist_ok=True)
for k, t0 in enumerate(starts):
    t1 = starts[k + 1] if k + 1 < len(starts) else total
    with wave.open(os.path.join(OUT, f'line_{k}.wav'), 'wb') as o:
        o.setnchannels(ch); o.setsampwidth(sw); o.setframerate(sr); o.writeframes(audio[int(t0 * sr) * bpf:int(t1 * sr) * bpf])
    print(f'line {k}: {t0:6.2f}-{t1:6.2f}s  {lines[k][:50]}')
