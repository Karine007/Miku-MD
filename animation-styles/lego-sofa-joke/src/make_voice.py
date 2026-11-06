"""Voices for the sofa joke with Gemini TTS: one two-speaker request for the dialogue + one for the laugh."""
import base64, json, os, re, subprocess, time, urllib.request, wave
KEY = os.environ['GEMINI_API_KEY']; VO = os.path.join(os.path.dirname(__file__), '..', 'assets', 'vo')
MODELS = ['gemini-3.8-flash-tts', 'gemini-3.1-flash-tts-preview']
def api(model, body):
    req = urllib.request.Request(f'https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent', data=json.dumps(body).encode(), headers={'Content-Type': 'application/json', 'x-goog-api-key': KEY})
    return json.load(urllib.request.urlopen(req, timeout=240))
def save(d, path):
    part = next(p['inlineData'] for p in d['candidates'][0]['content']['parts'] if 'inlineData' in p)
    mime, data = part.get('mimeType', ''), base64.b64decode(part['data'])
    if data[:4] == b'RIFF' or any(k in mime for k in ('wav', 'mpeg', 'mp3', 'ogg', 'opus')):
        open(path + '.src', 'wb').write(data); subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', path + '.src', '-ac', '1', '-ar', '24000', path], check=True); os.remove(path + '.src'); return
    m = re.search(r'rate=(\d+)', mime); w = wave.open(path, 'wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(int(m.group(1)) if m else 24000); w.writeframes(data); w.close()
def tts(name, text, speech):
    path = os.path.join(VO, name + '.wav')
    if os.path.exists(path): return
    body = {'contents': [{'parts': [{'text': text}]}], 'generationConfig': {'responseModalities': ['AUDIO'], 'speechConfig': speech}}
    for a in range(6):
        try: d = api(MODELS[a // 3], body); break
        except Exception as e: print('retry', e, flush=True); time.sleep(25)
    else: raise SystemExit('tts failed')
    json.dump(d, open(path + '.response.json', 'w')); save(d, path); print('voiced', name, flush=True); time.sleep(21)
duo = {'multiSpeakerVoiceConfig': {'speakerVoiceConfigs': [
    {'speaker': 'Wife', 'voiceConfig': {'prebuiltVoiceConfig': {'voiceName': 'Kore'}}},
    {'speaker': 'Husband', 'voiceConfig': {'prebuiltVoiceConfig': {'voiceName': 'Puck'}}}]}}
tts('dialogue', 'TTS the following comedy sketch between a married couple on a sofa, natural and playful, with a clear pause between lines:\n'
    'Wife: (sweetly) Babe... if I lost all my money tomorrow, would you still love me?\n'
    'Husband: (confident) Of course I would.\n'
    'Wife: (touched) Aww... really?\n'
    'Husband: (casual) Yeah. I\'d miss you... but I\'d still love you.\n'
    'Wife: (shocked, loud) WHAT?!', duo)
tts('laugh', 'Say while laughing really hard and happily: Hahaha! Ha ha ha ha ha! Hahahaha! Oh my... ha ha ha ha!', {'voiceConfig': {'prebuiltVoiceConfig': {'voiceName': 'Puck'}}})
