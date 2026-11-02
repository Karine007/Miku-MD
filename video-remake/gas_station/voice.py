#!/usr/bin/env python3
"""
Voice-over for the gas-station episode (Gemini TTS, needs GEMINI_API_KEY for new recordings).

Voices:
  narrator - Charon: male, calm, close-mic second-person narration (like the reference)
  radio    - Kore:   female emergency-broadcast voice, radio filtered

Each role is recorded in as few requests as possible (free tier = 10 TTS requests/day/model),
then cut into lines by matching each line's length to its syllable count at real pauses.
Writes timeline.json (start/end of every beat, driven by the real clip lengths) and the voice track.

    python3 voice.py voice_track.wav
"""
import json
import os
import sys
import wave

import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))
import voices as V          # noqa: E402  (shared TTS / alignment / cutting helpers)
from script import BEATS    # noqa: E402

SR = V.SR
CACHE = os.path.join(HERE, "voices")
MODEL = "gemini-3.8-flash-lite-tts"
VOICE = {"narrator": "Charon", "radio": "Kore"}
BATCH = 14
LEAD = 0.6                  # silence before the first line
GAIN = {"narrator": 1.0, "radio": 0.75}

# reuse voices.py machinery with this episode's settings
V.VOICES = {"narrator": VOICE["narrator"], "radio": VOICE["radio"]}
V.ROLE_VOICE = {"narrator": "narrator", "radio": "radio"}
V.STYLES = {"narrator": "", "radio": ""}
V.FX = {"narrator": None, "radio": "radio"}
V.FILTERS["radio"] = (",highpass=f=450,lowpass=f=3000,acompressor=threshold=0.08:ratio=6,"
                      "acrusher=bits=10:mix=0.25,volume=1.7")


def tts(role, texts, out):
    """Plain lines only (no style instruction, so nothing extra gets read aloud)."""
    import base64
    import urllib.request
    body = {"contents": [{"parts": [{"text": "\n\n".join(texts)}]}],
            "generationConfig": {"responseModalities": ["AUDIO"],
                                 "speechConfig": {"voiceConfig": {"prebuiltVoiceConfig": {
                                     "voiceName": VOICE[role]}}}}}
    req = urllib.request.Request(
        f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent",
        data=json.dumps(body).encode(),
        headers={"Content-Type": "application/json", "x-goog-api-key": os.environ["GEMINI_API_KEY"]})
    r = json.load(urllib.request.urlopen(req, timeout=300))
    try:
        part = r["candidates"][0]["content"]["parts"][0]["inlineData"]
    except (KeyError, IndexError):
        raise RuntimeError(f"no audio for {role}: {json.dumps(r)[:500]}")
    data = base64.b64decode(part["data"])
    if data[:4] == b"RIFF":
        j = data.find(b"RIFF", 4)
        open(out, "wb").write(data[j if j > 0 else 0:])
    else:
        with wave.open(out, "wb") as w:
            w.setnchannels(1)
            w.setsampwidth(2)
            w.setframerate(24000)
            w.writeframes(data)


def align(path, texts):
    """No instruction is sent with the lines, so there is no extra speech to strip; the cutter
    only needs the line count (cuts come from syllable-length matching at real pauses)."""
    return {"lines": [{"i": i, "start": 0.0, "end": 0.0} for i in range(len(texts))], "extra": []}


V.align = align


def main():
    out = sys.argv[1] if len(sys.argv) > 1 else "voice_track.wav"
    os.makedirs(CACHE, exist_ok=True)
    by_role = {}
    for k, b in enumerate(BEATS):
        if b[1]:
            by_role.setdefault(b[1], []).append(k)
    clips = {}
    for role, ks in by_role.items():
        chunks = [ks[i:i + BATCH] for i in range(0, len(ks), BATCH)]
        for c, ck in enumerate(chunks):
            name = f"{role}_{c}"
            path = os.path.join(CACHE, name + ".wav")
            texts = [BEATS[k][2] for k in ck]
            if not os.path.exists(path):
                print(f"TTS {name}: {len(ck)} lines", flush=True)
                tts(role, texts, path)
            segs = V.split_aligned(path, texts)
            clips.update(zip(ck, segs))

    t = LEAD
    timeline, pieces = [], []
    for k, (scene, role, text, hold, overlay) in enumerate(BEATS):
        if role:
            sig, _ = V.process(clips[k], role, 99)
            sig = sig / (np.abs(sig).max() or 1) * 0.7 * GAIN[role]
            pieces.append((t, sig))
            dur = len(sig) / SR
        else:
            dur = 0.0
        timeline.append({"i": k, "scene": scene, "start": round(t, 3), "speech_end": round(t + dur, 3),
                         "end": round(t + dur + hold, 3), "overlay": overlay, "text": text, "role": role})
        print(f"{k:02d} {t:6.2f}-{t + dur + hold:6.2f} {scene:12s} {text[:60]}")
        t += dur + hold
    total = t
    track = np.zeros((int(SR * (total + 0.5)), 2), np.float32)
    for st, sig in pieces:
        i = int(st * SR)
        track[i:i + len(sig)] += sig[:, None] * 1.0
    json.dump({"duration": round(total, 3), "beats": timeline}, open(os.path.join(HERE, "timeline.json"), "w"),
              indent=1, ensure_ascii=False)
    pcm = (np.clip(track, -1, 1) * 32000).astype(np.int16)
    with wave.open(out, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())
    print(f"total {total:.2f}s")


if __name__ == "__main__":
    main()
