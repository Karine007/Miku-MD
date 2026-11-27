# Elizabeth Holmes: the $9 billion blood test (Rise & Ruin)

The first episode in the new soft pastel 3D style (style test option 1, "Soft matte"): slim mannequin people, pastel sets, word-by-word captions with a highlight box, dark name cards and white keyword pills.

- `script.json` 11 chapters (690 words), `anchors.json` 72 scene anchors, `take*.json` voice takes
- `build_timeline.py <takes_dir> <out_dir>` aligns the 3 voice takes and writes `timeline.js`
- `holmes.html` + `main.js` engine, `kit.js` style kit (people, props, text), `sets.js` sets and cast, `scenes.js` the 72 scenes
- `stills.js <out_dir> [frac]` one check frame per scene (`ONLY=id1,id2`, `CLEAN=1` hides overlays)
- Render: `W=1920 H=1080 ./par_chunks.sh holmes.html yt_holmes.mp4 7680`, music from `../anna/music_doc.py`, then voice + music mix
- Needs `node_modules` with three@0.160 and @fontsource/nunito (symlinked, not committed)
- `branding/youtube_thumbnail_holmes.png`, `posts/holmes_youtube.md`
