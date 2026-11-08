# The Qanat — 3D explainer (vertical)

An original ~1:12 explainer in a fast, casual 3D-explainer format: bright low-poly 3D, quick camera moves,
one bold caption word at a time, and an upbeat narrator (Gemini TTS, voice "Puck").
Topic: how desert villages get water from a qanat — mother well, gently sloping tunnel, access shafts,
outlet, green fields — with an underground cutaway view.

- `src/story.json` — narration beats (one camera shot each)
- `src/make_voice.py` — Gemini TTS (no spoken style prompt) + alignment → `assets/timeline.js`, `voiceover.wav`, `subtitles.srt`
- `src/make_sounds.py` — music bed, whooshes, digging, water, chimes
- `src/scene.js` — three.js world + caption overlay (bundle with esbuild to `assets/scene.js`)

```
python3 src/make_voice.py && python3 src/make_sounds.py
npx esbuild src/scene.js --bundle --format=iife --minify --outfile=assets/scene.js
npx hyperframes render -o the-qanat-raw.mp4 -q delivery -w 4 --fps 24
```
