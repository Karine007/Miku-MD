# Le Piège Photo — court métrage d'horreur (vertical)

An original French horror short (~2 min, 1080x1920) in a flat doodle-cartoon style.
Original story, characters (Inès, Malik, Théo) and creature: a trail camera strapped to a tree
photographs a pale figure getting closer to the tent… until someone takes the camera down.

- `src/story.json` — beats (scene, action, clock, photo settings, narration line)
- `src/make_voice.py` — Gemini TTS narration (voice "Charon", French), alignment and timeline
  (`TRIM` and `*.cuts.json` remove a few seconds the TTS model improvised; checked by transcription)
- `src/make_sounds.py` — crickets, wind, fire, drone, heartbeat, shutter, phone buzz, zipper, stings
- `src/scene.js` — 2D canvas renderer (bundle with esbuild to `assets/scene.js`)

```
python3 src/make_voice.py && python3 src/make_sounds.py
npx esbuild src/scene.js --bundle --format=iife --minify --outfile=assets/scene.js
npx hyperframes render -o le-piege-photo-raw.mp4 -q delivery -w 4
```
