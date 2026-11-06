# 18 Days in the Radio Tower — flat cartoon cut

The same original story, Gemini narration (voice "Charon"), music, effects and timing as
`../stickman-radio-tower` and `../lego-radio-tower`, redrawn as a flat-vector cartoon:
big round white heads with bold outlines, large eyes with small pupils, spiky hair,
clothed bodies with thin black limbs, and warm flat backgrounds with soft edges.
All characters (Remi, Tess, her brother, the pilot, the infected) are original designs.

- `src/scene.js` — 2D canvas renderer (`window.CartoonFilm`), driven by `assets/timeline.js`
- Subtitles are burned in; `subtitles.srt` is provided for YouTube captions.

Build and render:

```
npx esbuild src/scene.js --bundle --format=iife --minify --outfile=assets/scene.js
npx hyperframes render -o 18-days-radio-tower-cartoon-raw.mp4 -q delivery -w 4
ffmpeg -i 18-days-radio-tower-cartoon-raw.mp4 -c:v libx264 -preset slow -crf 21 -tune animation -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart 18-days-radio-tower-cartoon-1080p.mp4
```
