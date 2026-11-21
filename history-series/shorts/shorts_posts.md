# Rise & Ruin Shorts: post kit (6 Shorts, 2 parts per story)

Each story is cut into **Part 1 (the rise)** and **Part 2 (the fall)**. Every Short is vertical 1080×1920, under 60 seconds, with new narration and the original 3D scenes.
Post Part 1 first and Part 2 a few hours later or the next day. Part 1 ends with "Follow for part two". After posting Part 2, pin a comment on Part 1 linking to it (on YouTube, use "Related video" to link Part 1 to Part 2).

| Short | Video | Cover |
|---|---|---|
| BlackBerry · Part 1 | `output/blackberry_p1_short.mp4` | `covers/blackberry_p1.png` |
| BlackBerry · Part 2 | `output/blackberry_p2_short.mp4` | `covers/blackberry_p2.png` |
| Anna Delvey · Part 1 | `output/anna_p1_short.mp4` | `covers/anna_p1.png` |
| Anna Delvey · Part 2 | `output/anna_p2_short.mp4` | `covers/anna_p2.png` |
| Elizabeth Holmes · Part 1 | `output/holmes_p1_short.mp4` | `covers/holmes_p1.png` |
| Elizabeth Holmes · Part 2 | `output/holmes_p2_short.mp4` | `covers/holmes_p2.png` |

---

## BlackBerry · Part 1
**Title:** How BlackBerry Ruled the World (Part 1) #shorts
**Description / caption:** In 2008 one phone company was worth $80 billion, and a president fought his own security team to keep its phone 📱 This is how BlackBerry rose. Part 2: how it lost everything. Follow so you don't miss it!
**Hashtags:** #blackberry #riseandruin #techhistory #business #truestory #shorts #fyp
**Pinned comment:** Did you ever own a BlackBerry? 📱 Part 2 is up next 👇

## BlackBerry · Part 2
**Title:** How BlackBerry Lost Everything (Part 2) #shorts
**Description / caption:** The iPhone, the Storm, a 3-day outage, and then the phones went dead for good 💀 Part 2 of the BlackBerry story. Watch Part 1 first!
**Hashtags:** #blackberry #iphone #riseandruin #techhistory #business #shorts #fyp
**Pinned comment:** Where did BlackBerry go wrong? Was it the keyboard, or something else? 👇

## Anna Delvey · Part 1
**Title:** The Fake Heiress Who Fooled New York (Part 1) #shorts
**Description / caption:** She said she was a German heiress with a €60 million fortune. The fortune didn't exist 💸 Part 1 of the Anna Delvey story. Follow for Part 2!
**Hashtags:** #annadelvey #inventinganna #riseandruin #truestory #scam #shorts #fyp
**Pinned comment:** Would you have believed her? 👀 Part 2 is coming 👇

## Anna Delvey · Part 2
**Title:** The Trip That Caught Anna Delvey (Part 2) #shorts
**Description / caption:** A $62,000 trip to Marrakech, a friend who wanted her money back, and a police trap 🚔 Part 2 of the Anna Delvey story. Watch Part 1 first!
**Hashtags:** #annadelvey #inventinganna #riseandruin #truecrime #scam #shorts #fyp
**Pinned comment:** Should Netflix have paid her for her story? 🤔👇

## Elizabeth Holmes · Part 1
**Title:** The $9 Billion Blood Test (Part 1) #shorts
**Description / caption:** One drop of blood, hundreds of tests, a $9 billion company and the youngest self-made woman billionaire in the world 🩸 Part 1 of the Elizabeth Holmes story. Follow for Part 2!
**Hashtags:** #elizabethholmes #theranos #riseandruin #truestory #startup #shorts #fyp
**Pinned comment:** Would you have invested? 💰 Part 2 shows what was really inside the box 👇

## Elizabeth Holmes · Part 2
**Title:** The Box That Never Worked (Part 2) #shorts
**Description / caption:** The machine didn't work, two young employees told the truth, and a reporter brought it all down ⚖️ Part 2 of the Elizabeth Holmes story. Watch Part 1 first!
**Hashtags:** #elizabethholmes #theranos #riseandruin #truecrime #fraud #shorts #fyp
**Pinned comment:** What do you think: genius gone wrong, or a scam from day one? 👇

---

## Narration scripts
The exact narration for each Short is in `<story>_p1.json` / `<story>_p2.json` (same folder). The voice is AI-generated (Gemini, voice Puck). Each part is one continuous take, sped up a few percent where needed to stay under 60 seconds.

## How they're made
- `short_timeline.py <name> <take.wav> <out_dir>` aligns the take, picks the scenes whose opening words appear in the script (`<name>_anchors.json`) and writes `../<story>/timeline_<name>.js`.
- Pages: `../anna/anna_p1.html`, `../blackberry/blackberry_p1.html`, `../holmes/holmes_p1.html` (and `_p2`). Holmes renders in vertical mode (`window.VERT`), with a wider camera on text-heavy shots (`window.VFOV`).
- Rendered with each story's `par_chunks.sh` at 1080×1920, with music from `../anna/music_doc.py`, mixed at -14 LUFS.
