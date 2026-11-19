# BlackBerry story (history series)

Original 3D low-poly explainer: how BlackBerry went from $80B to a paperweight.

- `script.json` — narration, 10 chapters (original wording)
- `anchors.json` — the phrase that starts each scene
- `build_timeline.py <takes_dir> <out_dir>` — joins the 3 Gemini voice takes, aligns faster-whisper word timings to the script, writes `timeline.js` + `voice.wav`
- `bb.html`, `bb_main.js` (engine + word-by-word captions), `bb_kit.js` (people, phones, props), `bb_scenes_a.js` / `bb_scenes_b.js` (59 scenes)
- `music_doc.py <cues.json> <out.wav>` — synthesized documentary music bed + cut whooshes
- Render: serve this folder with three.js + @fontsource (nunito) in `node_modules`, then `par_chunks.sh bb.html silent_bb.mp4 9932` from the nation-series tools; mix voice + music with loudnorm -14 LUFS.
- `posts/blackberry_post.md` — caption, hashtags, script; `branding/cover_blackberry.png` — cover
