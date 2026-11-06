# 18 Days in the Radio Tower — hand-drawn stick-figure film (HyperFrames)

An original outbreak-survival story: Remi, a late-night radio DJ (round glasses, headphones, red scarf),
is trapped at the top of the city's tallest tower. He rations supplies, studies the infected through
binoculars, broadcasts survival tips every night, guides two kids (Tess and her brother) to a rescue boat
over the radio, and finally lights up the whole tower to call in a helicopter.

Original script, characters and artwork. 1920x1080 (YouTube long-form), ~5.5 min, Gemini TTS narration
(voice "Charon"), synthesized music and effects, plus `subtitles.srt` for YouTube captions.

- `src/story.json` — the script: one beat per narration line (scene, action, light, cards, sound effects)
- `src/make_voice.py` — Gemini TTS in grouped requests (free-tier friendly, cached in `assets/vo/`),
  line splitting, timeline (`assets/timeline.json/js`) and `subtitles.srt`
- `src/make_sounds.py` — music bed + effects placed on the timeline → `assets/soundtrack.wav`
- `src/scene.js` — canvas renderer: sketchy "boiling" ink lines, paper grain, stick-figure rig, 13 scenes,
  info cards; bundled to `assets/scene.js`
- `index.html` — HyperFrames composition

```
GEMINI_API_KEY=... python3 src/make_voice.py
python3 src/make_sounds.py
npx esbuild src/scene.js --bundle --format=iife --outfile=assets/scene.js
npx hyperframes snapshot --at 5,60,180
npx hyperframes render -o 18-days-radio-tower.mp4 -q delivery -w 4
```
Fonts: Kalam and Patrick Hand (SIL Open Font License), bundled in `assets/fonts/`.
