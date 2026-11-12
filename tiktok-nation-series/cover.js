// Composes the episode cover (1080x1920) over the rendered island.
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const root = __dirname;
// usage: node cover.js <day> [bg.png] [line1] [BIG] [line3] [pill] [pinOff]
const [day = '1', bg = 'av_cover.png', l1 = "Let's build a", big = 'nation', l3 = 'together', pill = '1 FOLLOWER = 1 CITIZEN', pinOff] = process.argv.slice(2);
const b64 = (p, t) => `data:${t};base64,` + fs.readFileSync(path.join(root, p)).toString('base64');
const img = b64(bg, 'image/png');
const lil = b64('node_modules/@fontsource/lilita-one/files/lilita-one-latin-400-normal.woff2', 'font/woff2');
const nun = b64('node_modules/@fontsource/nunito/files/nunito-latin-900-normal.woff2', 'font/woff2');
const html = `<!doctype html><html><head><style>
@font-face{font-family:L;src:url(${lil})} @font-face{font-family:N;font-weight:900;src:url(${nun})}
body{margin:0;width:1080px;height:1920px;overflow:hidden;position:relative}
.bg{position:absolute;inset:0;background:url(${img}) center/cover}
.sky{position:absolute;inset:0;background:${process.env.SKY || 'linear-gradient(180deg,#5fb4ec 0,rgba(95,180,236,0) 38%),radial-gradient(ellipse at 50% 64%,rgba(150,235,255,.38) 0,rgba(150,235,255,0) 50%),linear-gradient(0deg,rgba(0,30,70,.35) 0,rgba(0,30,70,0) 22%)'}}
.t{position:absolute;left:0;right:0;text-align:center;font-family:L;color:#fff;-webkit-text-stroke:18px #15191f;paint-order:stroke fill;text-shadow:0 12px 0 rgba(0,0,0,.35);text-transform:uppercase;line-height:1}
.t b{color:#ffcc2e;font-weight:400}
.day{position:absolute;top:262px;left:50%;transform:translateX(-50%) rotate(-4deg);background:${process.env.BADGE || '#ffcc2e'};color:${process.env.BADGE_FG || '#15191f'} !important;border:8px solid #15191f;border-radius:30px;box-shadow:0 12px 0 rgba(0,0,0,.3);font-family:N;font-weight:900;color:#15191f;font-size:84px;padding:6px 40px 10px;letter-spacing:2px}
.pill{position:absolute;left:50%;transform:translateX(-50%);background:#fff;border:7px solid #15191f;border-radius:60px;box-shadow:0 10px 0 rgba(0,0,0,.3);font-family:N;font-weight:900;color:#15191f;font-size:50px;padding:10px 34px;white-space:nowrap;display:flex;align-items:center;gap:16px}
</style></head><body>
<div class="bg"></div><div class="sky"></div>
<div class="day">${/^\d/.test(day) ? `DAY ${day}` : day}</div>
<div class="t" style="top:430px;font-size:104px">${l1}</div>
<div class="t" style="top:536px;font-size:${big.length > 7 ? Math.floor(1700 / big.length) : 236}px"><b>${big}</b></div>
<div class="t" style="top:776px;font-size:104px">${l3}</div>
${pinOff ? '' : `<svg style="position:absolute;left:600px;top:1080px;width:150px;height:190px;filter:drop-shadow(0 12px 8px rgba(0,0,0,.35))" viewBox="0 0 38 48"><path d="M19 47C19 47 3 29 3 18a16 16 0 0 1 32 0c0 11-16 29-16 29z" fill="#f08a24" stroke="#fff" stroke-width="2.6"/><circle cx="19" cy="13.5" r="4.6" fill="#fff"/><path d="M10.5 27c0-5 3.8-7.6 8.5-7.6s8.5 2.6 8.5 7.6z" fill="#fff"/></svg>`}
<div class="pill" style="top:1500px"><svg width="54" height="54" viewBox="0 0 24 24"><circle cx="12" cy="7" r="5" fill="#15191f"/><path d="M2 23c0-6 4.5-9 10-9s10 3 10 9z" fill="#15191f"/></svg>${pill}</div>
</body></html>`;
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  await page.setContent(html); await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: path.join(root, `${process.env.OUT || "cover_day" + day}.png`) });
  await page.screenshot({ path: path.join(root, `${process.env.OUT || "cover_day" + day}_grid.png`), clip: { x: 0, y: 240, width: 1080, height: 1440 } });
  await browser.close();
})();
