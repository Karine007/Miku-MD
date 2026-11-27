import json
def ts(x): x = max(0, x); return f'{int(x//60)}:{int(x%60):02d}'
K = {
'ftx': dict(title='FTX: How $8 Billion Vanished in One Week', dur='4:32',
  titles=['How $8 Billion Vanished in One Week (FTX)', 'He Was Worth $26 Billion in Shorts. Then It All Vanished', 'The Next Warren Buffett... Now in Prison (FTX Story)'],
  desc="At 30, Sam Bankman-Fried was worth $26 billion on paper, wore shorts to work and slept on a beanbag. Then, in one week, FTX collapsed and about $8 billion of customer money was gone. This is the full story of how FTX rose, and fell.",
  ch=[('h_worth', 'The $26 billion guy in shorts'), ('n_parents', 'Who is Sam Bankman-Fried?'), ('b_alameda', 'Alameda and the bitcoin trick'), ('g_fast', 'Arenas, Super Bowl ads, superstars'), ('n_two', 'The secret backdoor'), ('c_leak', 'The leak and the bank run'), ('c_froze', 'Bankrupt in a week'), ('n_ray', 'Where did the money go?'), ('a_arrest', 'Arrest and trial'), ('a_guilty', '25 years in prison'), ('a_from', 'Rise and ruin')],
  tags='ftx, ftx collapse, sam bankman-fried, sbf, crypto, bitcoin, alameda research, binance, cz, caroline ellison, crypto documentary, rise and ruin, true story, fraud documentary',
  hashtags='#ftx #crypto #truestory', pin="Would YOU have trusted FTX after the Super Bowl ad and Tom Brady? 🤔 YES or NO 👇",
  short='the FTX Shorts (`ftx/sh_ftx_p1.mp4`, `p2`, `p3`)'),
'wework': dict(title='WeWork: The $47 Billion Company That Rented Desks', dur='4:14',
  titles=['The $47 Billion Company That Just Rented Desks (WeWork)', 'Tequila, Private Jets and $47 Billion: The WeWork Story', 'From $47 Billion to Bankrupt: What Happened to WeWork?'],
  desc="In 2019, WeWork was worth $47 billion. It didn't invent anything. It rented desks. Its founder handed out tequila shots, flew a $60 million jet and wanted to be the world's first trillionaire. Four years later, the company was bankrupt. This is the full story of how WeWork rose, and fell.",
  ch=[('h_worth', 'The $47 billion desk company'), ('n_kibbutz', 'Who is Adam Neumann?'), ('b_idea', 'The idea, and the catch'), ('d_dream', 'Selling a dream'), ('i_love', 'SoftBank and $47 billion'), ('n_jet', 'The one big problem'), ('f_file', 'The IPO filing'), ('p_panic', 'The fall of Adam'), ('r_again', 'Pandemic and empty offices'), ('r_spac', 'Bankrupt'), ('n_flow', "Adam's next company")],
  tags='wework, wework documentary, adam neumann, softbank, masayoshi son, wework ipo, wework bankruptcy, startup failure, business documentary, rise and ruin, true story, flow adam neumann',
  hashtags='#wework #business #truestory', pin="Would YOU have rented a WeWork desk for the free beer? 🍺 YES or NO 👇",
  short='the WeWork Shorts (`wework/sh_wework_p1.mp4`, `p2`, `p3`)'),
}
for n, k in K.items():
    s = open(f'{n}/timeline_long.js').read(); d = json.loads(s[s.index('=') + 1:].rstrip().rstrip(';')); sc = d['scenes']
    chap = '\n'.join(f"{ts(0 if i == 0 else sc[a])} {b}" for i, (a, b) in enumerate(k['ch']))
    script = '\n\n'.join(f'**{c}:** {t}' for c, t in json.load(open(f'{n}/script_long.json')))
    open(f'{n}/posts/{n}_long_post.md', 'w').write(f"""# {k['title']}: full YouTube episode

**Video:** `{n}/output/{n}_youtube_16x9.mp4` ({ts(d['dur'])}, 1920×1080)
**Thumbnail:** `{n}/branding/youtube_thumbnail_{n}_long.png`

Built the same way as the Fyre long form: a cold open on the shock number with a big sticker, a question in the first 20 seconds, moments that pull viewers into the next section, energetic narration, big bottom captions, and a subscribe ending.

## Title (pick one; the first is recommended)
""" + '\n'.join(f'{i+1}. {t}' for i, t in enumerate(k['titles'])) + f"""

## Description
{k['desc']}

{chap}

New Rise & Ruin story every week. Subscribe so you don't miss the next one.

{k['hashtags']}

## Tags
{k['tags']}

## Pinned comment
{k['pin']}

## Posting tips
- Upload the custom thumbnail, and paste the description so the chapters appear automatically.
- Add an end screen over the last 15 seconds: your best video plus a subscribe element.
- Set the **Related video** on {k['short']} to this episode, so Short viewers go straight to the full story.
- After 48 hours, check **impressions click-through rate** (aim for 5% or more) and **average view duration** (aim for 40% or more).

## Voiceover script
{script}
""")
    print(n, ts(d['dur'])); print(chap)
