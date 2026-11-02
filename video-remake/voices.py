#!/usr/bin/env python3
"""
Voice-over for the remake, generated with Gemini TTS (needs GEMINI_API_KEY).

Three voices, as in the story:
  narrator  - male storyteller, low and tense             (Charon)
  mother    - the "mother" voice: fake voicemails, the thing
              at the door, and the real mom on the phone    (Sulafat)
  me        - your own voice in the third voicemail         (Enceladus)

Each role is generated in ONE request (free tier allows 10 TTS requests/day/model) and
split at its pauses. Recordings are cached in voices/<role>.wav (delete one to regenerate).
    python3 voices.py voice_track.wav      # generate missing clips + build the track
"""
import base64
import json
import os
import subprocess
import sys
import time
import urllib.error
import urllib.request
import wave

import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
CACHE = os.path.join(HERE, "voices")
MODEL = os.environ.get("TTS_MODEL", "gemini-3.1-flash-tts-preview")   # free tier: 10 requests/day/model
SR = 44100
DUR = 104.37

BATCH = 13
# roles recorded in the same request as another role (saves free-tier requests)
SHARE = {"door": "fake"}
# per-role model override (each model has its own daily free quota)
ROLE_MODEL = {"me": "gemini-3.8-flash-lite-tts", "narrator_1": "gemini-3.8-flash-lite-tts"}  # keyed by batch name
VOICES = {"narrator": "Charon", "mother": "Sulafat", "me": "Enceladus"}

STYLES = {
    "narrator": "Dis d'une voix grave, basse, lente et posée de conteur, presque chuchotée",
    "fake": "Dis en chuchotant, d'une voix de maman inquiète et essoufflée",
    "door": "Dis en chuchotant lentement, d'une voix de maman douce et sucrée",
    "me": "Dis en chuchotant vite, d'une voix de jeune homme inquiet et essoufflé",
    "real": "Dis d'une voix de maman joyeuse et détendue, souriante",
}
ROLE_VOICE = {"narrator": "narrator", "fake": "mother", "door": "mother", "real": "mother", "me": "me"}
# phone = voicemail / call band-pass, door = muffled through a door with a little room
FX = {"narrator": None, "fake": "phone", "door": "door", "me": "phone", "real": "phone"}

# seconds trimmed from the start of a line's clip (TTS stutters), by line index
TRIM_START = {18: 0.37}

# (start, latest_end, role, text)
LINES = [
    (0.2, 2.0, "narrator", "Imagine..."),
    (2.1, 4.0, "narrator", "Ton téléphone vibre."),
    (4.1, 7.0, "narrator", "Il est trois heures sept du matin."),
    (7.1, 10.0, "narrator", "Un message vocal... de ta mère."),
    (10.1, 12.0, "fake", "Ne descends pas !"),
    (12.0, 14.0, "fake", "Je suis enfermée dans la cave !"),
    (14.1, 19.0, "narrator", "Sauf que... tu l'entends ronfler. Dans la chambre d'à côté."),
    (21.6, 24.0, "narrator", "Ton téléphone vibre encore."),
    (24.0, 25.9, "narrator", "Un deuxième vocal."),
    (26.0, 28.0, "fake", "Celle qui dort à côté..."),
    (28.1, 32.9, "fake", "Ce n'est pas moi. Surtout... ne la réveille pas."),
    (33.0, 35.0, "narrator", "Tu retiens ton souffle."),
    (35.0, 39.0, "narrator", "Et derrière le mur... le ronflement s'arrête."),
    (39.1, 42.0, "narrator", "Une porte grince dans le couloir."),
    (42.0, 45.0, "narrator", "Des pas. Lents."),
    (45.0, 47.8, "narrator", "Ils s'arrêtent... devant ta porte."),
    (48.0, 50.6, "door", "Mon chéri ? Tu dors ?"),
    (51.0, 54.9, "narrator", "La poignée tourne... doucement."),
    (55.0, 59.0, "narrator", "Et tout en bas, dans la cave... quelqu'un frappe."),
    (59.0, 60.9, "narrator", "Trois coups."),
    (61.0, 64.0, "narrator", "Ton téléphone vibre une dernière fois."),
    (64.0, 66.0, "narrator", "Un troisième vocal."),
    (66.0, 68.0, "narrator", "Mais cette voix-là..."),
    (68.0, 69.6, "narrator", "c'est la tienne."),
    (69.7, 72.0, "me", "Ne réponds à aucune des deux !"),
    (75.0, 77.0, "narrator", "Alors tu ne réponds pas."),
    (77.0, 79.0, "narrator", "Tu ne bouges plus."),
    (79.0, 81.0, "narrator", "Tu ne respires plus."),
    (81.0, 84.0, "narrator", "Jusqu'au lever du soleil."),
    (86.6, 89.0, "real", "Mon chéri ? C'est maman !"),
    (89.0, 92.8, "real", "Mon avion vient d'atterrir. Je serai là dans une heure !"),
    (93.0, 96.0, "narrator", "Ta mère était partie toute la semaine."),
    (96.1, 98.9, "narrator", "Et dans la chambre d'à côté..."),
    (99.0, 101.2, "narrator", "le ronflement reprend."),
]


def tts_batch(role, texts, out, model=MODEL):
    """One request per role: all its lines, separated by long pauses."""
    prompt = STYLES[role] + " :\n\n" + "\n\n".join(t.rstrip(".!") + "..." if not t.endswith("?") else t
                                                   for t in texts)
    body = {"contents": [{"parts": [{"text": prompt}]}],
            "safetySettings": [{"category": c, "threshold": "BLOCK_NONE"} for c in (
                "HARM_CATEGORY_HARASSMENT", "HARM_CATEGORY_HATE_SPEECH",
                "HARM_CATEGORY_SEXUALLY_EXPLICIT", "HARM_CATEGORY_DANGEROUS_CONTENT")],
            "generationConfig": {"responseModalities": ["AUDIO"],
                                 "speechConfig": {"voiceConfig": {"prebuiltVoiceConfig": {
                                     "voiceName": VOICES[ROLE_VOICE[role]]}}}}}
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"
    for attempt in range(3):
        req = urllib.request.Request(url, data=json.dumps(body).encode(), headers={
            "Content-Type": "application/json", "x-goog-api-key": os.environ["GEMINI_API_KEY"]})
        try:
            r = json.load(urllib.request.urlopen(req, timeout=300))
            try:
                part = r["candidates"][0]["content"]["parts"][0]["inlineData"]
            except (KeyError, IndexError):
                raise RuntimeError(f"no audio for {role}: {json.dumps(r)[:600]}")
            break
        except urllib.error.HTTPError as e:
            msg = e.read().decode()[:300]
            if "per day" in msg or "PerDay" in msg:
                raise RuntimeError("Gemini daily TTS quota exhausted: " + msg)
            print(f"  retry ({e.code})", flush=True)
            time.sleep(30 * (attempt + 1))
    else:
        raise RuntimeError(f"TTS failed for role {role}")
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


def syllables(text):
    import re
    t = text.lower()
    t = re.sub(r"e([\s.,!?…]|$)", r"\1", t)          # mute final e
    return max(1, len(re.findall(r"[aeiouyàâéèêëîïôûùœ]+", t)))


def align(path, texts):
    """Ask Gemini for the start/end of each expected line inside a batch recording (cached as JSON)."""
    cache = path[:-4] + ".align.json"
    if os.path.exists(cache):
        return json.load(open(cache))
    audio = base64.b64encode(open(path, "rb").read()).decode()
    listing = "\n".join(f"{i}: {t}" for i, t in enumerate(texts))
    prompt = ("This recording contains these French lines, spoken in order:\n" + listing +
              "\nGive the precise start and end time in seconds (2 decimals) of each line, and also list any "
              "other speech that is NOT one of these lines (e.g. spoken instructions). Answer only JSON: "
              '{"lines":[{"i":0,"start":0.0,"end":0.0}],"extra":[{"start":0.0,"end":0.0,"text":""}]}')
    body = {"contents": [{"parts": [{"inline_data": {"mime_type": "audio/wav", "data": audio}}, {"text": prompt}]}],
            "generationConfig": {"responseMimeType": "application/json", "temperature": 0}}
    req = urllib.request.Request(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent",
        data=json.dumps(body).encode(),
        headers={"Content-Type": "application/json", "x-goog-api-key": os.environ["GEMINI_API_KEY"]})
    r = json.load(urllib.request.urlopen(req, timeout=300))
    res = json.loads(r["candidates"][0]["content"]["parts"][0]["text"])
    json.dump(res, open(cache, "w"), ensure_ascii=False, indent=1)
    return res


def split_aligned(path, texts):
    """Cut a batch recording into its lines.

    Gemini's per-line timings are only approximate, so they are rescaled onto the voiced span of
    the file and each boundary is snapped (dynamic programming, order preserved) to a real pause.
    Any leading speech that is not a line (e.g. a read-out instruction) is dropped."""
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-f", "f32le", "-ac", "1", "-ar", str(SR), "-"],
                         capture_output=True, check=True).stdout
    x = np.frombuffer(raw, np.float32)
    hop = int(0.01 * SR)
    rms = np.sqrt(np.convolve(x ** 2, np.ones(hop * 3) / (hop * 3), "same"))[::hop]
    voiced = rms > rms.max() * 0.04
    idx = np.flatnonzero(voiced)
    v0, v1 = idx[0] / 100, idx[-1] / 100
    gaps, k = [], idx[0]
    while k < idx[-1]:
        if not voiced[k]:
            j = k
            while j < idx[-1] and not voiced[j]:
                j += 1
            if j - k >= 8:                                  # pauses >= 80 ms
                gaps.append(((k + j) / 200, (j - k) / 100, k / 100, j / 100))
            k = j
        k += 1

    # expected boundaries: proportional to syllable count (+ a pause per line), laid over the
    # voiced span; a leading read-out instruction (reported by align()) is skipped first.
    al = align(path, texts)
    lines = sorted(al["lines"], key=lambda d: d["i"])
    extra = [e for e in (al.get("extra") or []) if e["end"] <= lines[0]["start"] + 0.3]
    want = []
    if extra:
        p1 = max(lines[-1]["end"], extra[-1]["end"] + 0.1)
        cut = v0 + extra[-1]["end"] / p1 * (v1 - v0)
        want.append(cut)
        v0s = min(gaps, key=lambda g: abs(g[0] - cut))[3]
    else:
        v0s = v0
    # choose cuts so every line's length matches (rate * syllables + pause): DP over pauses
    syl = np.array([syllables(t) for t in texts], float)
    pause = np.array([0.35 * (t.count("...") + t.count(". ") + t.count("? ")) for t in texts])
    B = len(texts) - 1
    if B == 0:                                  # single line: just the voiced span
        return [x[int(max(0, v0s - 0.03) * SR): int((v1 + 0.12) * SR)].copy()]
    G = len(gaps)
    if G < B:
        raise RuntimeError(f"{path}: only {G} pauses for {B} cuts")
    rate = (v1 - v0s - pause.sum() - 0.4 * B) / syl.sum()
    exp = rate * syl + pause

    def seg_cost(a, b, i):                      # segment i spans [a, b]
        d = b - a
        return ((d - exp[i]) / max(0.4, exp[i])) ** 2

    ends = [g[2] for g in gaps]
    INF = 1e18
    cost = np.full((B, G), INF)
    back = np.full((B, G), -1)
    for g in range(G):
        if ends[g] > v0s:
            cost[0, g] = seg_cost(v0s, ends[g], 0) - 0.3 * gaps[g][1]
    for b in range(1, B):
        for g in range(b, G):
            for h in range(b - 1, g):
                c = cost[b - 1, h]
                if c < INF:
                    c = c + seg_cost(gaps[h][3], ends[g], b) - 0.3 * gaps[g][1]
                    if c < cost[b, g]:
                        cost[b, g], back[b, g] = c, h
    if B == 0:
        chosen = []
    else:
        total = [cost[B - 1, g] + seg_cost(gaps[g][3], v1, B) if cost[B - 1, g] < INF else INF for g in range(G)]
        g = int(np.argmin(total))
        chosen = [g]
        for b in range(B - 1, 0, -1):
            g = int(back[b, g])
            chosen.append(g)
        chosen = [gaps[c] for c in reversed(chosen)]
    bounds = [v0s] + [t for c in chosen for t in (c[2], c[3])] + [v1]
    segs = []
    for a, b in zip(bounds[0::2], bounds[1::2]):
        segs.append(x[int(max(0, a - 0.03) * SR): int((b + 0.12) * SR)].copy())
    return segs


def process(sig, role, max_len):
    """Speed up slightly if it overruns its slot, then apply the role's effect."""
    n = len(sig) / SR
    tempo = min(1.3, max(1.0, n / max(0.4, max_len)))
    chain = "anull" + (f",atempo={tempo:.3f}" if tempo > 1.0 else "") + FILTERS[FX[role]]
    out = subprocess.run(["ffmpeg", "-v", "error", "-f", "f32le", "-ar", str(SR), "-ac", "1", "-i", "-",
                          "-af", chain, "-f", "f32le", "-"], input=sig.tobytes(),
                         capture_output=True, check=True).stdout
    return np.frombuffer(out, np.float32), tempo


FILTERS = {
    None: "",
    "phone": ",highpass=f=320,lowpass=f=3400,acompressor=threshold=0.1:ratio=4,volume=1.6,"
             "aecho=0.8:0.4:18:0.15",
    "door": ",lowpass=f=1900,aecho=0.8:0.6:45|90:0.35|0.2,volume=1.4",
}


def main():
    out = sys.argv[1] if len(sys.argv) > 1 else "voice_track.wav"
    os.makedirs(CACHE, exist_ok=True)
    by_role = {}
    for k, line in enumerate(LINES):
        by_role.setdefault(SHARE.get(line[2], line[2]), []).append(k)
    batches = []                                  # long roles are split in chunks of <= BATCH lines
    for role, ks in by_role.items():
        chunks = [ks[i:i + BATCH] for i in range(0, len(ks), BATCH)]
        for c, ck in enumerate(chunks):
            batches.append((role, ck, f"{role}_{c}" if len(chunks) > 1 else role))
    clips = {}
    for role, ks, name in batches:
        path = os.path.join(CACHE, f"{name}.wav")
        if not os.path.exists(path):
            print(f"TTS [{role}] {len(ks)} lines", flush=True)
            tts_batch(role, [LINES[k][3] for k in ks], path, ROLE_MODEL.get(name, MODEL))
        segs = split_aligned(path, [LINES[k][3] for k in ks])
        extra = align(path, [LINES[k][3] for k in ks]).get("extra") or []
        if extra:
            print(f"  {name}: extra speech ignored: {extra}")
        clips.update(zip(ks, segs))
    track = np.zeros((int(SR * DUR), 2), np.float32)
    for k, (start, end, role, text) in enumerate(LINES):
        clip = clips[k][int(TRIM_START.get(k, 0) * SR):]
        sig, tempo = process(clip, role, end - start)
        gain = {"narrator": 1.0, "fake": 0.8, "door": 0.75, "me": 0.8, "real": 0.85}[role]
        pan = {"door": -0.25}.get(role, 0.0)
        i = int(start * SR)
        sig = sig[: len(track) - i]
        sig = sig / (np.abs(sig).max() or 1) * 0.7 * gain
        l, r = np.cos((pan + 1) * np.pi / 4) * 1.41, np.sin((pan + 1) * np.pi / 4) * 1.41
        track[i:i + len(sig), 0] += sig * l
        track[i:i + len(sig), 1] += sig * r
        flag = "  <-- overruns" if start + len(sig) / SR > end + 0.3 else ""
        print(f"{k:02d} {start:6.1f}-{start + len(sig) / SR:6.1f} (slot {end:5.1f}) x{tempo:.2f} {text}{flag}")
    pcm = (np.clip(track, -1, 1) * 32000).astype(np.int16)
    with wave.open(out, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())


if __name__ == "__main__":
    main()
