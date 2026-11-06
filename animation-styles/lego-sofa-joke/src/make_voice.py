"""Voices for the sofa sketch with Gemini TTS: one request per line (exact boundaries), pauses trimmed.
Writes assets/vo/lineN.wav, assets/lines.js (timings for the scene) and assets/voice.wav."""
import base64, json, os, re, subprocess, time, urllib.request, wave
import numpy as np
KEY = os.environ['GEMINI_API_KEY']; ROOT = os.path.join(os.path.dirname(__file__), '..'); VO = os.path.join(ROOT, 'assets', 'vo')
MODELS = ['gemini-3.8-flash-tts', 'gemini-3.1-flash-tts-preview']
# the TTS model improvised a short extra sentence before lines 0-2; skip it (checked by transcription)
TRIM = {0: 5.25, 1: 3.45, 2: 3.4}
R = 44100; START, GAP, MAX_PAUSE, HOLD = 0.45, 0.35, 0.35, 1.8
LINES = [
    ('mira', 'Kore', 'Say sweetly and a little playfully, at a natural, flowing conversational pace', 'Babe, if I lost all my money tomorrow... would you still love me?'),
    ('dan', 'Puck', 'Say confidently and warmly, without hesitation', 'Of course I would.'),
    ('mira', 'Kore', 'Say softly, touched and smiling', 'Aww... really?'),
    ('dan', 'Puck', 'Say casually and cheekily, like it is obvious', "Yeah. I'd miss you... but I'd still love you."),
    ('mira', 'Kore', 'Shout in loud, shocked disbelief', 'WHAT?!'),
]
def api(model, body):
    req = urllib.request.Request(f'https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent', data=json.dumps(body).encode(), headers={'Content-Type': 'application/json', 'x-goog-api-key': KEY})
    return json.load(urllib.request.urlopen(req, timeout=240))
def save(d, path):
    part = next(p['inlineData'] for p in d['candidates'][0]['content']['parts'] if 'inlineData' in p)
    mime, data = part.get('mimeType', ''), base64.b64decode(part['data'])
    if data[:4] == b'RIFF' or any(k in mime for k in ('wav', 'mpeg', 'mp3', 'ogg', 'opus')):
        open(path + '.src', 'wb').write(data); subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', path + '.src', '-ac', '1', '-ar', '24000', path], check=True); os.remove(path + '.src'); return
    m = re.search(r'rate=(\d+)', mime); w = wave.open(path, 'wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(int(m.group(1)) if m else 24000); w.writeframes(data); w.close()
def tts(path, voice, style, text):
    if os.path.exists(path): return
    body = {'contents': [{'parts': [{'text': f'{style}: {text}'}]}], 'generationConfig': {'responseModalities': ['AUDIO'], 'speechConfig': {'voiceConfig': {'prebuiltVoiceConfig': {'voiceName': voice}}}}}
    for a in range(8):
        try:
            d = api(MODELS[0 if a < 4 else 1], body)
            if 'content' not in d['candidates'][0]: raise ValueError(d['candidates'][0].get('finishReason'))
            break
        except Exception as e: print('  retry', e, flush=True); time.sleep(25)
    else: raise SystemExit('tts failed')
    json.dump(d, open(path + '.response.json', 'w')); save(d, path); print('voiced', os.path.basename(path), flush=True); time.sleep(21)
def read(p):
    w = wave.open(p); x = np.frombuffer(w.readframes(w.getnframes()), '<i2').astype(np.float32) / 32768; r = w.getframerate()
    return np.interp(np.arange(0, len(x) * R / r) * r / R, np.arange(len(x)), x)
def tighten(x):
    hop = int(R * 0.01); n = len(x) // hop; e = np.sqrt(np.mean(x[:n * hop].reshape(n, hop) ** 2, 1)); m = e > max(0.008, np.percentile(e, 95) * 0.06)
    idx = np.where(m)[0]; x = x[max(0, idx[0] * hop - int(0.03 * R)):(idx[-1] + 1) * hop + int(0.08 * R)]
    n = len(x) // hop; e = np.sqrt(np.mean(x[:n * hop].reshape(n, hop) ** 2, 1)); m = e > max(0.008, np.percentile(e, 95) * 0.06)
    out, pos, i, pauses = [], 0, 0, []
    while i < n:
        if not m[i]:
            j = i
            while j < n and not m[j]: j += 1
            if j - i > MAX_PAUSE * 100 and j < n: out.append(x[pos:i * hop + int(MAX_PAUSE * R)]); pos = j * hop
            i = j
        else: i += 1
    out.append(x[pos:]); return np.concatenate(out)
clips = []
for k, (who, voice, style, text) in enumerate(LINES):
    p = os.path.join(VO, f'line{k}.wav'); tts(p, voice, style, text); clips.append(tighten(read(p)[int(TRIM.get(k, 0) * R):]))
t, timing = START, []
for k, c in enumerate(clips):
    if k: t += GAP if k != 4 else 0.25
    timing.append({'who': LINES[k][0], 'a': round(t, 3), 'b': round(t + len(c) / R, 3), 'text': LINES[k][3]}); t += len(c) / R
total = round(t + HOLD, 2)
track = np.zeros(int(total * R), np.float32)
for c, l in zip(clips, timing): a = int(l['a'] * R); track[a:a + len(c)] += c
track = track / (np.max(np.abs(track)) + 1e-9) * 0.95
w = wave.open(os.path.join(ROOT, 'assets', 'voice.wav'), 'wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(R); w.writeframes((track * 32767).astype('<i2').tobytes()); w.close()
open(os.path.join(ROOT, 'assets', 'lines.js'), 'w').write('window.SKETCH = ' + json.dumps({'total': total, 'lines': timing}) + ';\n')
for l in timing: print(f"{l['a']:6.2f}-{l['b']:6.2f} {l['who']:5s} {l['text']}")
print('total', total)
