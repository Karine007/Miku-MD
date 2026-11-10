"""English narration for 'The Yakhchal' with Gemini TTS, and the film timeline built from it.

- Voices spoken beats in groups (free tier: 3 requests/min, 10/day per TTS model) -> assets/vo/groupN.wav
- Asks a Gemini text model where each line sits in its group (cached groupN.align.json)
- Splits at real pauses (DP: even speaking rate + near the alignment), trims long pauses
- Each beat lasts as long as its line (+ breathing room); silent beats (day cards) get a fixed time
Outputs: assets/voiceover.wav, assets/timeline.json + assets/timeline.js (window.FILM), subtitles.srt,
and sets data-duration in index.html. Re-running uses the cache; only missing pieces call the API.
"""
import base64, json, os, re, subprocess, time, urllib.request, wave
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.join(HERE, '..')
VO = os.path.join(ROOT, 'assets', 'vo'); os.makedirs(VO, exist_ok=True)
STORY = json.load(open(os.path.join(HERE, 'story.json')))
BEATS = STORY['beats']
TTS_MODELS = [os.environ.get('GEMINI_TTS_MODEL', 'gemini-3.8-flash-tts'), 'gemini-3.1-flash-tts-preview']
TEXT_MODELS = ['gemini-3.5-flash', 'gemini-3.8-flash', 'gemini-3.7-flash', 'gemini-3.6-flash']
VOICE = STORY.get('narrator', 'Charon')
STYLE = ''  # no spoken-style instruction: the TTS model sometimes reads it aloud
SR, SPEED, MAX_PAUSE = 44100, 1.08, 0.3
GROUP = 8
# the TTS model improvised a few seconds of its own narration before groups 1 and 2; skip it (checked by transcription)
TRIM = {}
SILENT_BEAT = {'endcard': 2.5}
KEY = os.environ.get('GEMINI_API_KEY', '')

def api(model, body, timeout=240):
    req = urllib.request.Request(f'https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent',
                                 data=json.dumps(body).encode(), headers={'Content-Type': 'application/json', 'x-goog-api-key': KEY})
    return json.load(urllib.request.urlopen(req, timeout=timeout))

def save_audio(d, path):
    part = next(p['inlineData'] for p in d['candidates'][0]['content']['parts'] if 'inlineData' in p)
    mime, data = part.get('mimeType', ''), base64.b64decode(part['data'])
    if 'wav' in mime or data[:4] == b'RIFF' or 'mpeg' in mime or 'mp3' in mime or 'ogg' in mime or 'opus' in mime:
        tmp = path + '.src'; open(tmp, 'wb').write(data)
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', tmp, '-ac', '1', '-ar', '24000', '-c:a', 'pcm_s16le', path], check=True); os.remove(tmp); return
    m = re.search(r'rate=(\d+)', mime); rate = int(m.group(1)) if m else 24000
    with wave.open(path, 'wb') as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(rate); w.writeframes(data)

def tts(text, path):
    if os.path.exists(path): return
    if os.path.exists(path + '.response.json'): save_audio(json.load(open(path + '.response.json')), path); return
    body = {'contents': [{'parts': [{'text': STYLE + text}]}], 'generationConfig': {'responseModalities': ['AUDIO'],
            'speechConfig': {'voiceConfig': {'prebuiltVoiceConfig': {'voiceName': VOICE}}}}}
    for attempt in range(8):
        model = TTS_MODELS[0 if attempt < 4 else 1]
        try:
            d = api(model, body); break
        except Exception as e:
            print('   tts retry', model, e, flush=True); time.sleep(25)
    else: raise SystemExit('TTS failed')
    json.dump(d, open(path + '.response.json', 'w'))  # keep the raw reply so a parsing bug never wastes quota
    save_audio(d, path)
    print('   voiced', os.path.basename(path), flush=True); time.sleep(21)

def align(path, lines, out):
    if os.path.exists(out): return json.load(open(out))
    audio = base64.b64encode(open(path, 'rb').read()).decode()
    listing = '\n'.join(f'{k}: {l}' for k, l in enumerate(lines))
    body = {'contents': [{'parts': [{'inlineData': {'mimeType': 'audio/wav', 'data': audio}}, {'text': 'This audio is a narrator reading these lines in order:\n' + listing +
            '\nReturn JSON: a list of objects {"line": n, "start": seconds, "end": seconds} giving exactly when each line is spoken, precise to 0.1 s.'}]}],
            'generationConfig': {'responseMimeType': 'application/json', 'temperature': 0}}
    for attempt in range(8):
        model = TEXT_MODELS[attempt % len(TEXT_MODELS)]
        try:
            res = json.loads(api(model, body)['candidates'][0]['content']['parts'][0]['text'])
            assert len(res) == len(lines); json.dump(res, open(out, 'w')); print('   aligned', os.path.basename(path), 'with', model, flush=True); return res
        except Exception as e:
            print('   align retry', model, e, flush=True); time.sleep(15)
    # fallback: estimate line boundaries from text length (the rate-balanced splitter does the rest)
    x, r = read(path); dur = len(x) / r; tot = sum(len(l) for l in lines); acc, res = 0.0, []
    for k, l in enumerate(lines):
        a = acc / tot * dur; acc += len(l); res.append({'line': k, 'start': round(a, 2), 'end': round(acc / tot * dur, 2)})
    print('   alignment unavailable, using text-length estimate for', os.path.basename(path), flush=True)
    return res

def read(p):
    with wave.open(p) as w: return np.frombuffer(w.readframes(w.getnframes()), '<i2').astype(np.float32) / 32768, w.getframerate()

def loud_mask(x, r, hop_s=0.01):
    hop = int(r * hop_s); n = len(x) // hop
    e = np.sqrt(np.mean(x[: n * hop].reshape(n, hop) ** 2, axis=1))
    return e > max(0.008, np.percentile(e, 95) * 0.06), hop

def runs_of(mask, val, min_frames):
    out, i = [], 0
    while i < len(mask):
        if mask[i] == val:
            j = i
            while j < len(mask) and mask[j] == val: j += 1
            if j - i >= min_frames: out.append((i, j))
            i = j
        else: i += 1
    return out

def tighten(x, r):
    m, hop = loud_mask(x, r)
    loud = np.where(m)[0]
    if not len(loud): return x[:0]
    x = x[max(0, loud[0] * hop - int(0.03 * r)): (loud[-1] + 1) * hop + int(0.1 * r)]
    m, hop = loud_mask(x, r); keep, pos = [], 0
    for a, b in runs_of(m, False, 5):
        a *= hop; b *= hop
        keep.append(x[pos:a]); keep.append(x[a:a + min(b - a, int(MAX_PAUSE * r))]); pos = b
    keep.append(x[pos:]); return np.concatenate(keep)

def to_44k(x, r):
    raw, out = os.path.join(VO, '_in.raw'), os.path.join(VO, '_out.raw')
    (np.clip(x, -1, 1) * 32767).astype('<i2').tofile(raw)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 's16le', '-ar', str(r), '-ac', '1', '-i', raw, '-af', f'atempo={SPEED}', '-ar', str(SR), '-f', 's16le', out], check=True)
    y = np.fromfile(out, '<i2').astype(np.float32) / 32768; os.remove(raw); os.remove(out); return y

def split(x, r, lines, al):
    """DP over real pauses: pick cuts so each line's speaking rate is close to the group's, near alignment hints."""
    m, hop = loud_mask(x, r)
    cum = np.concatenate([[0], np.cumsum(m)])  # loud frames prefix sum
    gaps = [((a + b) // 2, b - a) for a, b in runs_of(m, False, 20)]
    cands = [0] + [g[0] for g in gaps] + [len(m)]
    chars = [max(4, len(l)) for l in lines]
    rate = sum(chars) / max(1, cum[-1])
    hint = [0] + [((al[k]['end'] + al[k + 1]['start']) / 2) * r / hop for k in range(len(lines) - 1)] + [len(m)]
    n, K = len(cands), len(lines)
    INF = 1e18; best = np.full((K + 1, n), INF); back = np.zeros((K + 1, n), int); best[0][0] = 0
    for k in range(1, K + 1):
        for j in range(1, n):
            for i in range(j):
                if best[k - 1][i] >= INF: continue
                sp = cum[cands[j]] - cum[cands[i]]
                if sp < 10: continue
                c = best[k - 1][i] + np.log(chars[k - 1] / (sp * rate)) ** 2 + 0.02 * abs(cands[j] - hint[k])
                if c < best[k][j]: best[k][j] = c; back[k][j] = i
    j, edges = n - 1, []
    for k in range(K, 0, -1): edges.append(cands[j]); j = back[k][j]
    edges = [0] + edges[::-1]
    return [x[edges[k] * hop: edges[k + 1] * hop] for k in range(K)]

spoken = [i for i, b in enumerate(BEATS) if b['t']]
groups = [spoken[i:i + GROUP] for i in range(0, len(spoken), GROUP)]
clips = {}
for g, idx in enumerate(groups):
    lines = [BEATS[i]['t'] for i in idx]
    p = os.path.join(VO, f'group{g:02d}.wav'); tts('\n'.join(lines), p)
    if g in TRIM:
        q = p.replace('.wav', '.trim.wav')
        if not os.path.exists(q): subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', p, '-ss', str(TRIM[g]), q], check=True)
        p = q
    al = align(p, lines, p.replace('.wav', '.align.json'))
    x, r = read(p)
    cf = p.replace('.wav', '.cuts.json')  # hand-checked cut points (at real pauses), when the aligner is off
    if os.path.exists(cf):
        c = [0] + [int(v * r) for v in json.load(open(cf))['cuts']] + [len(x)]; segs = [x[c[k]:c[k + 1]] for k in range(len(lines))]
    else: segs = split(x, r, lines, al)
    for i, seg in zip(idx, segs):
        clips[i] = to_44k(tighten(seg, r), r)
        print(f'  beat {i:2d}: {len(clips[i]) / SR:5.2f}s {len(BEATS[i]["t"]) / max(0.1, len(clips[i]) / SR):5.1f} c/s  {BEATS[i]["t"][:60]}', flush=True)

timeline, T, mix = [], 0.6, []
for i, b in enumerate(BEATS):
    if i in clips:
        lead, tail = 0.15, 0.3
        dur = lead + len(clips[i]) / SR + tail; mix.append((T + lead, clips[i]))
    else: dur = SILENT_BEAT.get(b['s'], 2.0)
    timeline.append({**b, 'start': round(T, 3), 'dur': round(dur, 3)}); T += dur
total = round(T, 3)
track = np.zeros(int((total + 1) * SR), np.float32)
for at, c in mix: a = int(at * SR); track[a:a + len(c)] += c
track = track[: int(total * SR)]; track = track / (np.max(np.abs(track)) + 1e-9) * 0.95
with wave.open(os.path.join(ROOT, 'assets', 'voiceover.wav'), 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.stack([track, track], 1) * 32767).astype('<i2').tobytes())
film = {'title': STORY['title'], 'total': total, 'beats': timeline}
json.dump(film, open(os.path.join(ROOT, 'assets', 'timeline.json'), 'w'), indent=1)
open(os.path.join(ROOT, 'assets', 'timeline.js'), 'w').write('window.FILM = ' + json.dumps(film) + ';\n')
# YouTube subtitle file
fmt = lambda s: f'{int(s // 3600):02d}:{int(s % 3600 // 60):02d}:{int(s % 60):02d},{int(round(s % 1 * 1000)) % 1000:03d}'
srt, n = [], 0
for (at, c), i in zip(mix, [i for i in range(len(BEATS)) if i in clips]):
    n += 1; srt.append(f'{n}\n{fmt(at)} --> {fmt(at + len(c) / SR)}\n{BEATS[i]["t"]}\n')
open(os.path.join(ROOT, 'subtitles.srt'), 'w').write('\n'.join(srt))
html = os.path.join(ROOT, 'index.html')
if os.path.exists(html):
    s = open(html).read(); open(html, 'w').write(re.sub(r'data-duration="[\d.]+"', f'data-duration="{total}"', s))
print(f'film length {total:.1f}s ({total / 60:.1f} min)')
