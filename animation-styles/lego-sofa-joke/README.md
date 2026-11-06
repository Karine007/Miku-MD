# Would You Still Love Me? — vertical brick sketch

A short original comedy sketch (vertical 1080x1920, ~26 s) in a toy-brick style, made for Reels/Shorts.
Inspired by the "couple on the sofa + twist answer + someone cracking up" format, with its own joke,
characters (Dan, Mira, and Ray the laughing podcast host) and sets.

- `src/make_voice.py` — Gemini TTS: two-speaker dialogue (Kore = Mira, Puck = Dan) and Ray's laugh
- `src/make_audio.py` — mixes the voices with a synthesized pluck bed, a "dun-dun" sting and a whoosh → `assets/mix.wav`
- `src/scene.js` — three.js scene + word-by-word captions (bundle with esbuild to `assets/scene.js`)

```
python3 src/make_voice.py && python3 src/make_audio.py
npx esbuild src/scene.js --bundle --format=iife --minify --outfile=assets/scene.js
npx hyperframes render -o would-you-still-love-me-raw.mp4 -q delivery -w 4
```
