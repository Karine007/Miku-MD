"""Builds the Gemini-TTS narrator track and the film's time map.

1. Voices the narration with Gemini TTS in a few grouped requests (free tier: 3 req/min, 10/day per
   model), cached as assets/vo/groupN.wav. Needs GEMINI_API_KEY (only when the cache is missing).
2. Splits each group into lines at the pauses nearest Gemini's alignment (src/align_voice.py).
3. Tightens long dramatic pauses, speeds up slightly, and lays each line at the start of its story beat.
4. Wherever a line is longer than its beat, the beat is stretched: assets/timemap.json/js maps film time
   to story time, so visuals, captions, music and effects all stay in sync with the voice.
Outputs: assets/voiceover.wav, assets/timemap.json, assets/timemap.js; updates durations in index.html.
"""
import base64, itertools, json, os, re, subprocess, sys, time, urllib.request, wave
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.join(HERE, '..')
VO = os.path.join(ROOT, 'assets', 'vo'); os.makedirs(VO, exist_ok=True)
sys.path.insert(0, HERE)
from voice_lines import LINES, GROUPS, SHOUT
MODEL = os.environ.get('GEMINI_TTS_MODEL', 'gemini-3.1-flash-tts-preview')
NARRATOR, SHOUTER = 'Charon', 'Puck'
GROUP_STYLE = 'Say suspensefully, like a gripping true-story narrator, with a short pause between each line:\n'
SR = 44100
SPEED = 1.1          # gentle overall speed-up of the narrator
MAX_PAUSE = 0.24     # longest silence kept inside a line (s)
LEAD, TAIL = 0.12, 0.28

def tts(text, voice, style, path):
    if os.path.exists(path): return
    body = {'contents': [{'parts': [{'text': style + text}]}],
            'generationConfig': {'responseModalities': ['AUDIO'], 'speechConfig': {'voiceConfig': {'prebuiltVoiceConfig': {'voiceName': voice}}}}}
    req = urllib.request.Request(f'https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent', data=json.dumps(body).encode(),
                                 headers={'Content-Type': 'application/json', 'x-goog-api-key': os.environ['GEMINI_API_KEY']})
    d = json.load(urllib.request.urlopen(req, timeout=180))
    part = d['candidates'][0]['content']['parts'][0]['inlineData']
    rate = int(re.search(r'rate=(\d+)', part['mimeType']).group(1))
    with wave.open(path, 'wb') as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(rate); w.writeframes(base64.b64decode(part['data']))
    time.sleep(21)  # stay under 3 requests/minute

def read(path):
    with wave.open(path) as w: return np.frombuffer(w.readframes(w.getnframes()), '<i2').astype(np.float32) / 32768, w.getframerate()

def envelope(x, r, hop_s=0.01):
    hop = int(r * hop_s); return np.array([np.sqrt(np.mean(x[i:i + hop] ** 2)) for i in range(0, len(x) - hop, hop)]), hop

def silent_runs(x, r, min_len=0.1):
    e, hop = envelope(x, r); q = e < max(0.008, np.percentile(e, 95) * 0.06); runs, i = [], 0
    while i < len(q):
        if q[i]:
            j = i
            while j < len(q) and q[j]: j += 1
            if (j - i) * hop / r >= min_len: runs.append((i * hop, j * hop))
            i = j
        else: i += 1
    return runs

def tighten(x, r):
    """Trim edges and shorten internal pauses to MAX_PAUSE."""
    keep, pos = [], 0
    for a, b in silent_runs(x, r, 0.05):
        keep.append(x[pos:a])
        if a > 0 and b < len(x) - 1: keep.append(x[a:a + min(b - a, int(MAX_PAUSE * r))])
        pos = b
    keep.append(x[pos:])
    y = np.concatenate(keep)
    e, hop = envelope(y, r); loud = np.where(e > max(0.008, np.percentile(e, 95) * 0.06))[0]
    return y[max(0, loud[0] * hop - int(0.03 * r)): (loud[-1] + 1) * hop + int(0.08 * r)]

def to_44k(x, r, speed):
    raw = os.path.join(VO, '_tmp_in.raw'); out = os.path.join(VO, '_tmp_out.raw')
    (x * 32767).astype('<i2').tofile(raw)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 's16le', '-ar', str(r), '-ac', '1', '-i', raw, '-af', f'atempo={speed:.4f}', '-ar', str(SR), '-f', 's16le', out], check=True)
    y = np.fromfile(out, '<i2').astype(np.float32) / 32768; os.remove(raw); os.remove(out); return y

# ---- 1-2: voice groups, split by alignment
clips = {}
for g, idx in enumerate(GROUPS):
    p = os.path.join(VO, f'group{g}.wav')
    tts('\n'.join(LINES[i][2] for i in idx), NARRATOR, GROUP_STYLE, p)
    x, r = read(p)
    al = json.load(open(os.path.join(VO, f'group{g}.align.json')))
    # choose cuts among real pauses so every line has a similar speaking rate, near the alignment hint
    runs = silent_runs(x, r, 0.25)
    cands = [((a + b) / 2, b - a) for a, b in runs]
    speech = lambda a, b: (b - a) / r - sum(max(0, min(b, rb) - max(a, ra)) for ra, rb in silent_runs(x[a:b], r, 0.05) for ra, rb in [(ra + a, rb + a)]) / r
    targets = [(al[k]['end'] + al[k + 1]['start']) / 2 for k in range(len(idx) - 1)]
    chars = [len(LINES[i][2]) for i in idx]
    best, best_score = None, 1e9
    for combo in itertools.combinations(range(len(cands)), len(idx) - 1):
        cs = [int(cands[c][0]) for c in combo]; edges = [0] + cs + [len(x)]
        rates = [chars[k] / max(0.2, speech(edges[k], edges[k + 1])) for k in range(len(idx))]
        med = float(np.median(rates))
        score = sum(np.log(rt / med) ** 2 for rt in rates) + 0.04 * sum(abs(c / r - t) for c, t in zip(cs, targets))
        if score < best_score: best, best_score = cs, score
    cuts = [0] + best
    cuts.append(len(x))
    for k, i in enumerate(idx):
        clips[i] = to_44k(tighten(x[cuts[k]:cuts[k + 1]], r), r, SPEED)
        print(f'  line {i:2d}: {len(clips[i]) / SR:4.2f}s  {len(LINES[i][2]) / (len(clips[i]) / SR):5.1f} chars/s  {LINES[i][2]}')
sp = os.path.join(VO, 'shout.wav')
tts(SHOUT[2], SHOUTER, 'Shout in Spanish, hopeful and desperate: ', sp)
xs, rs = read(sp); shout = to_44k(tighten(xs, rs), rs, 1.0)
echo = np.concatenate([shout, np.zeros(int(0.9 * SR), np.float32)])
for d, gn in [(0.22, 0.45), (0.45, 0.28), (0.7, 0.16)]: k = int(d * SR); echo[k:k + len(shout)] += shout * gn

# ---- 3-4: time map. Beats: one per line, then the shout, then the end card.
beats = [(LINES[i][0] if i else 0.0, (LINES[i + 1][0] if i + 1 < len(LINES) else SHOUT[0])) for i in range(len(LINES))]
beats += [(SHOUT[0], SHOUT[1]), (SHOUT[1], 60.0)]
voice_len = [len(clips[i]) / SR for i in range(len(LINES))] + [len(echo) / SR, 0]
segs, T, mix = [], 0.0, []
for k, (s0, s1) in enumerate(beats):
    lead = 0.35 if k == 0 else LEAD
    need = voice_len[k] + lead + (TAIL if k < len(beats) - 2 else 0.1)
    dur = max(s1 - s0, need) if k < len(beats) - 1 else 2.2
    segs.append([round(T, 4), round(T + dur, 4), s0, s1])
    if voice_len[k]: mix.append((T + lead, clips[k] if k < len(LINES) else echo))
    print(f'beat {k:2d} story {s0:5.1f}-{s1:5.1f} ({s1 - s0:4.1f}s) -> film {T:6.2f}-{T + dur:6.2f} ({dur:4.1f}s) voice {voice_len[k]:4.2f}s')
    T += dur
total = round(T, 3)
track = np.zeros(int(total * SR) + 2 * SR, np.float32)
for at, x in mix: a = int(at * SR); track[a:a + len(x)] += x
track = track[: int(total * SR)]
track = track / (np.max(np.abs(track)) + 1e-9) * 0.95
with wave.open(os.path.join(ROOT, 'assets', 'voiceover.wav'), 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.stack([track, track], 1) * 32767).astype('<i2').tobytes())
tm = {'total': total, 'segments': segs}
json.dump(tm, open(os.path.join(ROOT, 'assets', 'timemap.json'), 'w'), indent=1)
open(os.path.join(ROOT, 'assets', 'timemap.js'), 'w').write('window.TIMEMAP = ' + json.dumps(tm) + ';\n')
html = os.path.join(ROOT, 'index.html'); s = open(html).read()
s = re.sub(r'data-duration="[\d.]+"', f'data-duration="{total}"', s); open(html, 'w').write(s)
print(f'film length {total:.2f}s; wrote voiceover.wav, timemap.json/js; updated index.html')
