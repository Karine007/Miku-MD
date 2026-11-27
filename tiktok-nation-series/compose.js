// Composes final profile pictures over the rendered island + a circle-crop preview sheet.
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const root = __dirname;
const img = 'data:image/png;base64,' + fs.readFileSync(path.join(root, 'av_tilt.png')).toString('base64');
const font = 'data:font/woff2;base64,' + fs.readFileSync(path.join(root, 'node_modules/@fontsource/lilita-one/files/lilita-one-latin-400-normal.woff2')).toString('base64');
const pin = (fill, x, y, s) => `<svg style="position:absolute;left:${x}px;top:${y}px;width:${s}px;height:${s * 1.26}px;filter:drop-shadow(0 14px 10px rgba(0,0,0,.35))" viewBox="0 0 38 48">
  <path d="M19 47C19 47 3 29 3 18a16 16 0 0 1 32 0c0 11-16 29-16 29z" fill="${fill}" stroke="#fff" stroke-width="2.6"/>
  <circle cx="19" cy="13.5" r="4.6" fill="#fff"/><path d="M10.5 27c0-5 3.8-7.6 8.5-7.6s8.5 2.6 8.5 7.6z" fill="#fff"/></svg>`;
const base = (inner) => `<!doctype html><html><head><style>@font-face{font-family:L;src:url(${font})}
 body{margin:0;width:1080px;height:1080px;overflow:hidden}
 .bg{position:absolute;inset:0;background:url(${img}) center/cover}
 .glow{position:absolute;inset:0;background:radial-gradient(circle at 50% 54%,rgba(130,230,255,.35) 0,rgba(130,230,255,0) 46%),radial-gradient(circle at 50% 50%,rgba(0,0,0,0) 55%,rgba(0,30,70,.35) 100%)}
 .tag{position:absolute;left:50%;transform:translateX(-50%) rotate(-3deg);font-family:L;color:#fff;-webkit-text-stroke:16px #15191f;paint-order:stroke fill;text-shadow:0 10px 0 rgba(0,0,0,.35);white-space:nowrap}
 .tag b{color:#ffcc2e;font-weight:400}
</style></head><body><div class="bg"></div><div class="glow"></div>${inner}</body></html>`;
const variants = {
  avatar_island: base(''),
  avatar_pin: base(pin('#f08a24', 560, 300, 250)),
  avatar_1eq1: base(pin('#f08a24', 600, 250, 210) + `<div class="tag" style="top:735px;font-size:190px">1<b>=</b>1</div>`),
};
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1080 } });
  for (const [name, html] of Object.entries(variants)) {
    await page.setContent(html); await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: path.join(root, `${name}.png`) });
  }
  // preview: how each looks as a TikTok avatar (big circle + tiny comment-size circle)
  const cells = Object.keys(variants).map(n => {
    const d = 'data:image/png;base64,' + fs.readFileSync(path.join(root, `${n}.png`)).toString('base64');
    return `<div style="display:flex;flex-direction:column;align-items:center;gap:14px"><img src="${d}" style="width:300px;height:300px;border-radius:50%"><img src="${d}" style="width:48px;height:48px;border-radius:50%"><div style="font:600 22px sans-serif">${n}</div></div>`;
  }).join('');
  await page.setViewportSize({ width: 1080, height: 470 });
  await page.setContent(`<body style="margin:0;background:#fff;display:flex;gap:50px;justify-content:center;padding:30px">${cells}</body>`);
  await page.screenshot({ path: path.join(root, 'avatar_preview.png') });
  await browser.close();
})();
