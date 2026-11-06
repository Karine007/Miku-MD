# 18 Days in the Radio Tower — toy-brick version (HyperFrames + three.js)

Same original story and the same Gemini narration as `../stickman-radio-tower`, rebuilt as a 3D
toy-brick world: brick-built studio, hallway, stairwell, roof, city skyline, street, bridge, helicopter
and camp, with generic toy figures (Remi, Tess, her brother, the pilot, survivors and the infected).
Burned-in subtitles plus `subtitles.srt` for YouTube. 1920x1080, 24 fps, ~5.5 min.

- `src/scene.js` — three.js brick sets + figure rig + per-beat director; 2D overlay for info cards,
  day cards, end card and subtitles. Bundled to `assets/scene.js`.
- `assets/timeline.js`, `assets/voiceover.wav`, `assets/soundtrack.wav` — shared with the stick-figure cut
  (made by `../stickman-radio-tower/src/make_voice.py` and `make_sounds.py`).

```
npx esbuild src/scene.js --bundle --format=iife --minify --outfile=assets/scene.js   # needs three in node_modules
npx hyperframes snapshot --at 6,40,135,216,282
npx hyperframes render -o 18-days-radio-tower-lego-raw.mp4 -q delivery -w 4 --fps 24
ffmpeg -i 18-days-radio-tower-lego-raw.mp4 -c:v libx264 -preset slow -crf 21 -tune animation -c:a aac -b:a 192k -movflags +faststart 18-days-radio-tower-lego-1080p.mp4
```
No brand names or logos are used; it's a generic brick style.
