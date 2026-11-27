// Renders the channel branding images: node shot.js  (outputs into ../)
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch();
  const jobs = [['profile', 800, 800, 'profile_picture_800.png', false], ['watermark', 150, 150, 'watermark_150.png', true], ['banner', 2560, 1440, 'banner_2560x1440.png', false]];
  for (const [m, w, h, out, transparent] of jobs) {
    const pg = await b.newPage({ viewport: { width: w, height: h } });
    await pg.goto('file://' + path.join(__dirname, 'brand.html') + '#' + m);
    await pg.waitForFunction('window.READY===true');
    await pg.screenshot({ path: path.join(__dirname, '..', out), omitBackground: transparent });
    await pg.close();
  }
  await b.close();
})();
