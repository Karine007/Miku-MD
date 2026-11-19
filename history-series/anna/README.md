# Anna Delvey: the fake heiress (history series)

An original ~5½ minute low-poly 3D story inspired by a TikTok explainer on the same topic: our own script, voice, scenes and music.
New in this episode: softer, more natural characters (`human.js`) with rounded heads, eyes with iris/pupil/highlight, brows, nose, lips, ears, hair styles, blinking and talking.

- `script.json` 11 chapters, `anchors.json` 70 scene anchors
- `build_timeline.py <takes_dir> <out_dir>` joins the 3 voice takes, aligns words with faster-whisper, writes `timeline.js`
- `anna.html` + `main.js` engine (shared with the BlackBerry episode), `kit.js` low-poly kit, `props.js` props, `sc_a.js` `sc_b.js` `sc_c.js` scenes
- `music_doc.py` original background score
- `branding/cover_anna.png`, `posts/anna_post.md`
