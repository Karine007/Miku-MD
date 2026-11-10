# Generates one WAV per voiceover line with Google Gemini TTS.
# usage: GEMINI_API_KEY=... python3 gemini_tts.py <lines.json> <out_dir> [voice] [model] [--single]
#   writes out_dir/line_0.wav, line_1.wav, ... (24 kHz mono) for voiceover.py
#   --single: one request for the whole script (free tier allows ~10 requests/model/day); the take
#   is then split into lines with split_take.py using local word timestamps.
import base64, json, os, sys, time, urllib.request, urllib.error, wave

LINES, OUT = sys.argv[1], sys.argv[2]
VOICE = sys.argv[3] if len(sys.argv) > 3 else 'Puck'
MODEL = sys.argv[4] if len(sys.argv) > 4 else 'gemini-3.8-flash-tts'
STYLE = "Say in an upbeat, excited storyteller voice: "
KEY = os.environ['GEMINI_API_KEY']
os.makedirs(OUT, exist_ok=True)

def tts(text):
    body = {"contents": [{"parts": [{"text": STYLE + text}]}],
            "generationConfig": {"responseModalities": ["AUDIO"],
                                 "speechConfig": {"voiceConfig": {"prebuiltVoiceConfig": {"voiceName": VOICE}}}}}
    req = urllib.request.Request(f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent",
                                 data=json.dumps(body).encode(), headers={"Content-Type": "application/json", "x-goog-api-key": KEY})
    for attempt in range(8):
        try:
            with urllib.request.urlopen(req, timeout=120) as r:
                d = json.load(r)
            part = d["candidates"][0]["content"]["parts"][0]["inlineData"]
            return base64.b64decode(part["data"]), part.get("mimeType", "")
        except urllib.error.HTTPError as e:
            msg = e.read().decode()[:300]
            if e.code in (429, 500, 503) and attempt < 7:
                time.sleep(20 + attempt * 10); continue  # per-minute quota: wait it out
            raise SystemExit(f"HTTP {e.code}: {msg}")

lines = json.load(open(LINES))
if '--single' in sys.argv:
    script = '\n'.join(item[2] if isinstance(item, list) else item for item in lines)
    pcm, mime = tts(script)
    rate = int(mime.split('rate=')[1].split(';')[0]) if 'rate=' in mime else 24000
    with wave.open(os.path.join(OUT, 'take.wav'), 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(rate); w.writeframes(pcm)
    print(f'take: {len(pcm) / 2 / rate:.2f}s'); sys.exit()
for i, item in enumerate(lines):
    text = item[2] if isinstance(item, list) else item
    pcm, mime = tts(text)
    rate = 24000
    if 'rate=' in mime: rate = int(mime.split('rate=')[1].split(';')[0])
    with wave.open(os.path.join(OUT, f'line_{i}.wav'), 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(rate); w.writeframes(pcm)
    print(f'line {i}: {len(pcm) / 2 / rate:.2f}s  {text[:60]}', flush=True)
    time.sleep(4)  # stay under the per-minute request quota
