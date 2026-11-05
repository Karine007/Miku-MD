# Gone Fishing — 10 s brick-style film (HyperFrames)

A toy-brick fisherman walks from his house to the lake, catches a fish, and walks home at night.
1080x1920, 30 fps, with synthesized sound (music, birds, footsteps, cast, reel, splash, crickets, owl, door).

- `index.html` — HyperFrames composition (timeline, titles, audio clips)
- `src/scene.js` — three.js scene; bundled to `assets/scene.js`, driven by the GSAP timeline
- `src/make_sounds.py` — generates every WAV in `sounds/`
- `gone-fishing-lego.mp4` — the rendered film

```
python3 src/make_sounds.py                               # regenerate sounds
npx esbuild src/scene.js --bundle --format=iife --minify --outfile=assets/scene.js   # needs three in node_modules
npx hyperframes snapshot --at 1,5,8                      # preview frames
npx hyperframes render -o gone-fishing-lego.mp4 -q delivery
```
