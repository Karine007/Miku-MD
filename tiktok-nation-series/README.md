# "Let's build a nation together": TikTok series generator

This is a vertical (1080×1920, 51 s) TikTok video in the style of the viral "on crée un pays tous ensemble" format. It uses a low‑poly 3D world, a game HUD (Day / Population / Unnamed nation) and bold white and yellow captions, and the audience runs the story through follows and comments.

Everything is generated from code: Three.js renders the scene, Playwright captures it frame by frame, and ffmpeg encodes the video. A synthesized royalty‑free soundtrack is included.

| File | What it is |
|---|---|
| `output/nation_day1_en.mp4` | Final video, English |
| `output/nation_day1_en_voiceover_pro.mp4` | Final video, English, **expressive Higgsfield voice "Kevin"** (recommended, 53 s) |
| `output/nation_day1_en_voiceover.mp4` | English with the free offline Piper voice |
| `voice_kevin/` | The 11 Higgsfield voice takes (one per scene), reusable with `voiceover.py` |
| `output/nation_day1_fr.mp4` | Final video, French |
| `voiceover.py` | Scene-synced English voiceover (Piper TTS, offline and free) mixed over the music, which drops under the voice |
| `index.html` | The 3D scene, HUD, captions and full timeline (`setTime(t)`) |
| `render.js` | Renders stills or the full video (`node render.js video en out.mp4 30`) |
| `audio.py` | Music bed plus pop/whoosh SFX synced to captions and cuts |

## Why this format gets views (and how the video uses each lever)

1. **Hook in the first second.** The opening is a question ("What if we built a nation... together?") over a satisfying aerial shot, and the HUD tells viewers immediately that this is a game.
2. **The viewer becomes part of the content.** "1 follower = 1 citizen" turns *following* into *participating*, and the population counter gives followers a reason to come back.
3. **"Will you be the first?"** This line plays on FOMO and being early, which is the main reason people follow at Day 1.
4. **Comments drive the story.** The name and flag are decided by the most‑liked comment, so people comment *and* like other comments, and every interaction pushes the video in the algorithm.
5. **A/B vote with a debatable option.** "B · at the volcano: super fertile... but risky" is chosen to start arguments in the comments. Debate = comments = reach.
6. **Series format.** "Tomorrow: Day 2" builds a habit. Each episode should show the results of the previous vote: the population number, the winning name/flag (drawn by AI), and the capital being built.
7. **Retention.** There's a cut every 3–5 s, a pop sound on every caption, counters animating and cards popping in. Nothing on screen stays still for long.

## Posting checklist

- **Caption:** `What if we built a nation together? 🌋🏝️ 1 follower = 1 citizen #nation #simulation #vote #worldbuilding`
  - FR: `Et si on créait une nation tous ensemble ? 🌋🏝️ 1 abonné = 1 habitant #nation #simulation #vote #pays`
- **Pin your own first comment:** "Vote A or B 👇 + suggest the name & flag (most liked wins)".
- **Reply to top comments with video replies** in the next episodes ("You chose the volcano... here's what happened").
- **Sound:** the video ships with its own music. You can also lower it and add a trending sound in the TikTok editor at low volume.
- Post **every day at the same hour** and keep the HUD numbers real (Day N, actual follower count).

## Making Day 2+

All on‑screen text lives in the `TXT` object at the top of `index.html` (English and French). Change the texts, the `DAY` number and the population value, adjust shots in `SH`, then run:

```bash
npm install three@0.160.0 @fontsource/lilita-one@5.0.8 @fontsource/nunito@5.0.8
node render.js stills en 2,10,20          # quick preview frames
node render.js video en silent.mp4 30     # full render (writes cues.json)
python3 audio.py cues.json music.wav
ffmpeg -i silent.mp4 -i music.wav -c:v copy -c:a aac -b:a 192k -shortest out.mp4
```

### Voiceover

Edit the `LINES` list in `voiceover.py`. Each entry has a start time, the end of its scene and the text; a line that runs too long is sped up to fit. Then run:

```bash
pip install piper-tts
curl -LO https://huggingface.co/rhasspy/piper-voices/resolve/v1.0.0/en/en_US/ryan/high/en_US-ryan-high.onnx
curl -LO https://huggingface.co/rhasspy/piper-voices/resolve/v1.0.0/en/en_US/ryan/high/en_US-ryan-high.onnx.json
python3 voiceover.py en_US-ryan-high.onnx cues.json silent.mp4 out_voiceover.mp4
# or with pre-generated takes (line_0..line_10 as .wav/.flac):
python3 voiceover.py voice_kevin cues.json silent.mp4 out_voiceover_pro.mp4
```

## Channel branding

| Item | Suggestion |
|---|---|
| Username | **@followerisland** (backups: `@followers.island`, `@buildanation.daily`, `@islandbyvotes`) |
| Display name | **Follower Island 🌋 Day 1** (update the day number with each episode) |
| Bio | `An island built by YOU 🏝️ 1 follower = 1 citizen 🗳️ Vote in the comments · New day every day` |
| Profile picture | `branding/avatar_pin.png` (recommended). Alternatives: `avatar_island.png`, `avatar_1eq1.png` |

The avatars are rendered from the same 3D island as the videos (`node avatar.js && node compose.js`), so the channel and the episodes look like one brand. `branding/avatar_preview.png` shows how each looks inside TikTok's circular crop.

### Episode covers

`branding/cover_day1.png` (1080×1920) is the cover for Day 1. `cover_day1_grid.png` shows the 3:4 area TikTok shows in the profile grid; all the text sits inside it. To make the next cover, run:

```bash
node avatar.js cover   # renders the island background (av_cover.png)
node cover.js 2        # writes cover_day2.png with "DAY 2"
```

To upload it in TikTok: **Edit cover → Upload from gallery** (on mobile), or **Cover → Upload** on TikTok Studio desktop.
