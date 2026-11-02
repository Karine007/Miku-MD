# ZOMBIE OUTBREAK: STRANDED AT A GAS STATION

An original episode made in the format of the vertical "Zombie outbreak" survival shorts
(black frame, two-line orange/white title, illustrated 720×640 panel, time / count / rule
overlays, second-person narration, "PART 2 COMING SOON" ending). Story, script, characters
and artwork are original; everything is generated with code.

| file | what it does |
|------|--------------|
| `script.py` | The episode: 29 beats (scene, speaker, line, hold, overlay). |
| `voice.py`  | Gemini TTS voice-over: **narrator** (Charon, calm close-mic male) and an **emergency radio** broadcast (Kore, radio-filtered). One request per batch of lines, cut at real pauses; writes `timeline.json` so the picture follows the real voice timing. Recordings cached in `voices/`. |
| `render.py` | Draws every scene with Pillow (reuses helpers from `../render.py`): highway gas station at night, store interior, coffee machine, radio, pickup, zombie at pump 4, the horde, breaker panel, glass, inventory, hot-dog roller, lottery ticket, day one, phone, night, walk-in cooler, Ray. |
| `audio.py`  | Synthesized sound design keyed to the timeline: drone/pad, crickets, fluorescent hum, coffee gurgles, alert tones and static, truck, groans, breaker clunk, glass thump, heartbeat, final sting. |
| `make.sh`   | Builds `gas_station.mp4` (effects ducked under the voices). |

Characters: **you** (orange beanie, blue hoodie) and **Ray**, the night clerk (glasses,
grey mustache, red vest).
