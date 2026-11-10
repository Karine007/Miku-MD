# The Yakhchal — 3D explainer (vertical)

An original ~1:28 explainer in the same natural 3D format as `../qanat-explainer`: how ancient desert
"ice pits" made and stored ice. Shaded shallow pools freeze on winter nights, workers carry the ice into a
deep pit under a thick-walled stepped dome (sarooj mortar), hot air escapes through the top, meltwater drains
away, and there is still ice in summer. Physical sky with day / night / dawn lighting, PBR textures, soft
shadows, a dome + pit cutaway, one-word captions and an upbeat Gemini narrator (voice "Puck").

- `src/story.json` — narration beats (one shot each); `src/make_voice.py` — Gemini TTS (no spoken style
  prompt) → timeline / voiceover / subtitles (`assets/vo/*.cuts.json` = line cuts at real pauses)
- `src/make_sounds.py` — music bed, whooshes, water, building, wind, ice cracks, drips, chimes
- `src/scene.js` — three.js world + caption overlay (bundle with esbuild to `assets/scene.js`)
