# Rise & Ruin: YouTube channel kit

True stories of how they rose, and how it all fell apart. Companies, con artists, empires, all animated in 3D.

## 1. Name and handle

| Field | Value |
|---|---|
| Channel name | **Rise & Ruin** |
| Handle (first choice) | **@RiseAndRuin** |
| If taken | @RiseAndRuinStories, @RiseAndRuinTV, @TheRiseAndRuin |

The name fits every story you've made so far: BlackBerry rose to $80 billion and fell; Anna Delvey rose into New York's elite and fell into prison. It also works for future topics (Blockbuster, Theranos, Nokia, FTX, Enron, Kodak, Myspace...).

Other names, if you prefer one of these:
- **Peak & Plunge**
- **The Downfall Files**
- **Too Big To Last**
- **Then It All Fell Apart**

If you switch, tell me and I'll re-render the banner and logo with the new name in a few minutes.

## 2. Branding files (this folder)

| File | Where it goes in YouTube Studio |
|---|---|
| `profile_picture_800.png` | Customisation → Branding → Picture (800×800, YouTube crops it to a circle) |
| `banner_2560x1440.png` | Customisation → Branding → Banner image. Logo and text sit in the 1546×423 centre "safe area", so nothing gets cut off on phone, desktop or TV |
| `watermark_150.png` | Customisation → Branding → Video watermark → display "Entire video" (it becomes a Subscribe button on every video) |

The logo is a gold line climbing to a crown, then a red line crashing down: the rise and the ruin.
The source is in `src/brand.html`. Run `node src/shot.js` to re-render it.

## 3. Channel description (Customisation → Basic info → Description)

```
Every empire has a peak. Every con has a crack. This channel is about what happens next.

Rise & Ruin tells the true stories of companies, scammers, and icons who climbed all the way to the top, and then lost everything. How did BlackBerry go from $80 billion to almost nothing? How did a 25-year-old fake heiress fool New York's richest people? Every story is fully animated in 3D, fast-paced, and fact-checked.

New story every week. Subscribe so you don't miss the next downfall.

Topics: business history, company collapses, scams and con artists, tech failures, true stories.
```

## 4. Keywords (Settings → Channel → Basic info → Keywords)

```
rise and fall, rise and ruin, true stories, business stories, company collapse, downfall, scam stories, con artist, documentary, animated documentary, 3d animation, tech history, blackberry, anna delvey, business history, what happened to, fake heiress, startup failure
```

## 5. Basic settings

- **Country of residence:** set your real country. This affects monetisation and tax.
- **Default upload settings** (Settings → Upload defaults):
  - Category: **Education** (documentary-style stories rank well there; Entertainment also works)
  - Language: **English**, and caption certification "None"
  - Tags: paste the keywords above
  - Comments: "Hold potentially inappropriate comments for review"
- **Audience:** "No, it's not made for kids". Important: the videos are animated, but the topics (fraud, prison) are for adults. Marking them "made for kids" turns off comments, notifications and most ads.
- **Altered or synthetic content:** answer **No** for these videos. That disclosure is for realistic footage of real people saying or doing things they didn't. Stylised 3D animation and an AI narrator voice don't need it. Still, it's good practice to mention "Narration voice is AI-generated" in each description; the kits already include a line for this.
- **Features:** verify the channel with your phone number (Settings → Channel → Feature eligibility). This unlocks custom thumbnails, which you need, and videos longer than 15 minutes.

## 6. Layout (Customisation → Layout)

- **Channel trailer for people who aren't subscribed:** the BlackBerry video. It has the strongest hook ("$80 billion to ZERO").
- **Featured video for returning subscribers:** your newest upload.
- **Sections:**
  1. Popular videos
  2. Playlist **"Company Collapses"** (BlackBerry, plus future ones like Nokia or Blockbuster)
  3. Playlist **"Scams & Con Artists"** (Anna Delvey, plus future ones like Elizabeth Holmes or Frank Abagnale)

Create those two playlists in Studio → Content → Playlists before uploading, then add each video to its playlist when you publish.

## 7. Links (Customisation → Basic info → Links)

- TikTok: your TikTok profile link
- Shown on banner: TikTok

## 8. Your first two uploads

| | BlackBerry | Anna Delvey |
|---|---|---|
| Video | `blackberry/output/blackberry_youtube_16x9.mp4` | `anna/output/anna_youtube_16x9.mp4` |
| Thumbnail | `blackberry/branding/youtube_thumbnail_blackberry.png` | `anna/branding/youtube_thumbnail_anna.png` |
| Title, description, chapters, tags, pinned comment | `blackberry/posts/blackberry_youtube.md` | `anna/posts/anna_youtube.md` |
| Playlist | Company Collapses | Scams & Con Artists |

**Suggested schedule:**
- Publish BlackBerry first.
- Publish Anna 3–4 days later.
- After that, post one long video a week, on the same day and at the same time (for example Saturday, 3 pm in your time zone).

**Shorts boost:** also upload the vertical TikTok versions (`*_story_en.mp4`) as YouTube Shorts a day or two after each long video. Add the long video as the Short's "Related video" so viewers can click through to the full story.

## 9. Upload checklist (each video)

1. Upload the mp4 → paste the title and description from the kit (the chapters are inside the description, starting at 0:00).
2. Upload the custom thumbnail.
3. Add it to its playlist.
4. Audience: not made for kids.
5. Paste the tags.
6. Category: Education.
7. Add an **end screen** (last 20 s):
   - "Subscribe" element plus "Best for viewer" video.
   - The video already says "Subscribe for more…" there.
8. Optionally schedule it instead of publishing right away.
9. After publishing, post the pinned comment from the kit and pin it.

## 10. Monetisation notes (YouTube Partner Program)

- **Requirements:** 1,000 subscribers plus either 4,000 watch hours in 12 months or 10M Shorts views in 90 days.
- **YouTube's "inauthentic / repetitive content" policy rejects channels that look mass-produced.** Things that help:
  - every story has its own script, scenes and thumbnail (already the case);
  - vary hooks and music;
  - keep facts accurate.
- **Every script must be your own writing.** Don't re-upload or copy narration from other creators' TikToks, even if a TikTok gave you the idea.
