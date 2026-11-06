# Le Carnet du Refuge — court métrage d'horreur (vertical)

An original French horror short (~2 min, 1080x1920) in a flat geometric cartoon style: front-facing
characters with round heads and big round eyes, flat shapes with thin outlines, a dark night palette,
an on-screen clock and bold word captions. Original story and characters (Nora, Jules, Sami): three hikers
shelter in a mountain hut and find a warning in its logbook, written in Nora's handwriting, dated tonight.

- `src/story.json` — beats; `src/make_voice.py` — Gemini TTS narration (voice "Charon", French) + timeline
  (`TRIM` and `assets/vo/*.cuts.json` drop prompt text the TTS read aloud and set line cuts at real pauses;
  checked by transcription)
- `src/make_sounds.py` — wind, stove, knocks, pencil, page turns, heartbeat, watch ticks, door creak, stings
- `src/scene.js` — 2D canvas renderer (bundle with esbuild to `assets/scene.js`); handwriting uses Kalam (OFL)

```
python3 src/make_voice.py && python3 src/make_sounds.py
npx esbuild src/scene.js --bundle --format=iife --minify --outfile=assets/scene.js
npx hyperframes render -o le-carnet-du-refuge-raw.mp4 -q delivery -w 4
```
