# Trapped 148 ft Under — 60 s brick-style retelling (HyperFrames)

A toy-brick version of a cave-rescue story, told on a cut-away brick diorama: a fisherman chases
a fish into a flooded cave and survives in a hidden air pocket; a Navy team finds his spear but calls off
the search; two cave divers (Gus and Rossi) keep going, find his tank, bag and a battery, and Gus surfaces
in a huge air chamber… *to be continued* (the source video ends on the same cliffhanger).

Captions are written fresh (not copied from the source). Visuals, music and effects are original;
the narration is generated with Gemini TTS. 1080x1920, 30 fps. The table below is in story time.

| Time | Beat |
|------|------|
| 0–5 | Cut-away: surface, 148 ft shaft, tunnel, air chamber |
| 5–21 | Chasing the fish, surfacing in the air pocket, waiting in the dark |
| 21–37 | July 29: Navy divers search, find the spear; July 30: search called off |
| 37–53 | Aug 6–7: Gus dives (Rossi on the line), finds tank, bag, battery; low air; strong current |
| 53–60 | Gus breaks into the huge air chamber, shouts — "To be continued…" |

- `index.html` — HyperFrames composition (canvas, captions, date cards, air gauge, audio)
- `src/scene.js` — three.js diorama + characters + story timeline; bundled to `assets/scene.js`
- `src/make_sounds.py` — synthesizes `assets/soundtrack.wav` (music, bubbles, splashes, drips, current), retimed to the voice
- `src/voice_lines.py` — narration script (one line per story beat)
- `src/align_voice.py` — asks a Gemini text model where each line sits in the grouped recordings
- `src/make_voice.py` — Gemini TTS narrator (voice "Charon"; shout: "Puck"), split per line, tightened,
  and the time map (`assets/timemap.json`) that stretches story beats to fit the voice
- `trapped-148ft-lego.mp4` — original 60 s cut (captions + music only)
- `trapped-148ft-lego-voiceover.mp4` — ~95 s cut with the Gemini voiceover

```
GEMINI_API_KEY=... python3 src/align_voice.py   # only if assets/vo/*.align.json are missing
GEMINI_API_KEY=... python3 src/make_voice.py    # uses cached assets/vo/group*.wav when present
python3 src/make_sounds.py
npx esbuild src/scene.js --bundle --format=iife --minify --outfile=assets/scene.js   # needs three in node_modules
npx hyperframes snapshot --at 1,12,25,43,55
npx hyperframes render -o trapped-148ft-lego-voiceover.mp4 -q delivery -w 4
```
