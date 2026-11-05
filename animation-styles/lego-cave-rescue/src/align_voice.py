"""Asks a Gemini text model where each narrated line starts/ends inside each grouped voice recording.
Caches assets/vo/groupN.align.json. Needs GEMINI_API_KEY."""
import json, base64, urllib.request, os, sys, time
HERE = os.path.dirname(os.path.abspath(__file__)); VO = os.path.join(HERE, '..', 'assets', 'vo')
sys.path.insert(0, HERE)
from voice_lines import LINES, GROUPS
MODELS = ['gemini-3.5-flash', 'gemini-3.8-flash', 'gemini-3.7-flash', 'gemini-3.6-flash']
for g, idx in enumerate(GROUPS):
    out = os.path.join(VO, f'group{g}.align.json')
    if os.path.exists(out): continue
    audio = base64.b64encode(open(os.path.join(VO, f'group{g}.wav'), 'rb').read()).decode()
    lines = '\n'.join(f'{k}: {LINES[i][2]}' for k, i in enumerate(idx))
    body = {'contents': [{'parts': [{'inlineData': {'mimeType': 'audio/wav', 'data': audio}}, {'text': 'This audio is a narrator reading these lines in order:\n' + lines + '\nReturn JSON: a list of objects {"line": n, "start": seconds, "end": seconds} giving exactly when each line is spoken, precise to 0.1 s.'}]}],
            'generationConfig': {'responseMimeType': 'application/json', 'temperature': 0}}
    d = None
    for attempt in range(12):
        model = MODELS[attempt % len(MODELS)]
        try:
            req = urllib.request.Request(f'https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent', data=json.dumps(body).encode(), headers={'Content-Type': 'application/json', 'x-goog-api-key': os.environ['GEMINI_API_KEY']})
            d = json.load(urllib.request.urlopen(req, timeout=180))
            res = json.loads(d['candidates'][0]['content']['parts'][0]['text'])
            assert len(res) == len(idx), res
            break
        except Exception as e:
            print(' ', model, e); d = None; time.sleep(15)
    if d is None: raise SystemExit(f'alignment failed for group {g}')
    json.dump(res, open(out, 'w')); print(g, model, res)
