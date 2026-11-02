# NUIT 1 — LE VOCAL (procedural remake)

A frame-by-frame recreation of the vertical (720×1280, 30 fps, ~104 s) French
horror short *"Nuit 1 – Le Vocal"*. Everything is generated with code, with no
image or video assets:

| file        | what it does |
|-------------|--------------|
| `render.py` | Draws every scene with Pillow (2× supersampled): bedroom, phone UI, hooded masked character, door, handle, cellar corridor, time-lapse, phone call, daylight ending, title/end cards, captions with red/grey keywords, the running `NUIT 1 · CHAMBRE` clock, neon glow, zoom/shake, flashes, vignette and grain. Pipes raw frames to ffmpeg. |
| `voices.py` | Voice-over with **Gemini TTS**, 3 voices: male narrator (Charon), the "mother" voice for the fake voicemails, the thing at the door and the real mom on the phone (Sulafat; phone / through-the-door effects), and *your* own voice in the third voicemail (Enceladus). Each role is recorded in one request (free tier = 10 TTS requests/day/model), then cut into lines by matching each line's length to its syllable count at the nearest real pauses. Recordings are cached in `voices/`. |
| `audio.py`  | Synthesizes the sound design with numpy: drone, phone buzzes, muffled voice messages, snoring, heartbeat, door creak, footsteps, knocks, ringtone, booms/stings. |
| `make.sh`   | Builds `nuit1_le_vocal_remake.mp4` (voice-over + sound design, effects ducked under the voices). Pass the original video as an argument to also get a version with the original soundtrack. |

Requirements: Python 3, `pillow`, `numpy`, `ffmpeg`, Inter fonts (`/usr/share/fonts/opentype/inter/`).
Re-recording voices (delete files in `voices/`) needs `GEMINI_API_KEY`.

```bash
./make.sh                      # voice-over + sound design
./make.sh path/to/original.mp4 # + version with the original soundtrack
python3 render.py --still 42.5 frame.png   # preview a single frame
```

## Story / timeline

| time | scene | captions |
|------|-------|----------|
| 0–4 s | bedroom, phone vibrates | IMAGINE… TON TÉLÉPHONE VIBRE. |
| 4–7 | close-up, bloody "3:07" | IL EST TROIS MATIN. |
| 7–12 | lock screen → voice message | UN MESSAGE VOCAL… DE TA MÈRE. « NE DESCENDS PAS… » |
| 12–19 | close-up, snoring behind the wall, flash | « JE SUIS ENFERMÉE » « DANS LA CAVE. » SAUF QUE… TU L'ENTENDS RONFLER. À CÔTÉ. |
| 19–21 | title card | NUIT 1 · LE VOCAL |
| 21–39 | second message, snoring stops | « À CÔTÉ… » « NE LA RÉVEILLE PAS. » … LE RONFLEMENT S'ARRÊTE. |
| 39–55 | door, footsteps, handle turns | UNE PORTE GRINCE… DES PAS. LENTS. « MON CHÉRI ? » « TU DORS ? » LA POIGNÉE TOURNE… |
| 55–61 | cellar, three knocks | BAS, DANS LA CAVE… QUELQU'UN FRAPPE. TROIS COUPS. |
| 61–74 | third message in your own voice, rule | C'EST LA TIENNE. « AUCUNE DES DEUX. » RÈGLE N°1 |
| 75–84 | time-lapse until sunrise | ALORS TU NE RÉPONDS PAS… JUSQU'AU LEVER DU SOLEIL. |
| 84–93 | Mom calls at 07:00 | « MON AVION VIENT D'ATTERRIR. » « DANS UNE HEURE. » |
| 93–104 | twist + end card | TA MÈRE ÉTAIT PARTIE TOUTE LA… CHAMBRE D'À CÔTÉ… LE RONFLEMENT REPREND. FIN |
