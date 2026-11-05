# 10 Animation Styles

Ten 9:16 (1080x1920) animated scenes, one per style, built with HTML/SVG/Canvas/three.js.
Each scene exposes `window.renderAt(t)` (seekable timeline, HyperFrames-style), so frames render deterministically.

| # | Style | File |
|---|-------|------|
| 1 | Pixel Art | scenes/01-pixel-art.html |
| 2 | Chalkboard | scenes/02-chalkboard.html |
| 3 | Glow Sketch | scenes/03-glow-sketch.html |
| 4 | PS2 Style | scenes/04-ps2-style.html |
| 5 | Comic Art | scenes/05-comic-art.html |
| 6 | Flat Vector | scenes/06-flat-vector.html |
| 7 | Minimal doodle essay ("Dan Koe style") | scenes/07-dan-koe-style.html |
| 8 | CGI Motion | scenes/08-cgi-motion.html |
| 9 | Toy brick ("Lego style") | scenes/09-brick-style.html |
| 10 | 3D "what if" short with captions ("ZackD Films style") | scenes/10-zackd-films.html |

## Render
```
node render.js          # stills -> samples/
node render.js --video  # also 6s 30fps MP4s -> videos/ (needs ffmpeg)
```
Requires Playwright (Chromium). Open any scene in a browser via a local server to watch it live.
