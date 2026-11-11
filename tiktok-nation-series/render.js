// usage: node render.js stills <lang> t1,t2,...   |   node render.js video <lang> <out.mp4> [fps]
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const http = require('http'), fs = require('fs'), path = require('path');
const root = __dirname;
const server = http.createServer((req, res) => {
  const p = path.join(root, decodeURIComponent(req.url.split('?')[0]));
  if (!p.startsWith(root) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
  const ext = path.extname(p);
  res.writeHead(200, { 'Content-Type': { '.html': 'text/html', '.js': 'text/javascript', '.woff2': 'font/woff2' }[ext] || 'application/octet-stream' });
  fs.createReadStream(p).pipe(res);
});
(async () => {
  await new Promise(r => server.listen(Number(process.env.PORT || 8765), r));
  const [mode, lang, arg, fpsArg] = process.argv.slice(2);
  const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  page.on('console', m => { if (m.type() === 'error') console.error('PAGE', m.text()); });
  page.on('pageerror', e => console.error('PAGEERR', e.message));
  await page.goto(`http://localhost:${process.env.PORT || 8765}/${process.env.PAGE || 'index.html'}?lang=${lang}`);
  await page.waitForFunction('window.READY === true', null, { timeout: 120000 });
  if (mode === 'stills') {
    for (const t of arg.split(',').map(Number)) {
      await page.evaluate(t => window.setTime(t), t);
      await page.screenshot({ path: path.join(root, `still_${process.env.PAGE ? path.basename(process.env.PAGE, '.html') + '_' : ''}${lang}_${t}.jpg`), type: 'jpeg', quality: 80 });
    }
  } else {
    const fps = Number(fpsArg || 30);
    const dur = await page.evaluate('window.DUR');
    const caps = await page.evaluate('window.CAPTION_TIMES');
    fs.writeFileSync(path.join(root, 'cues.json'), JSON.stringify({ caps, cuts: await page.evaluate('window.CUTS'), booms: await page.evaluate('window.BOOMS || []'), dur }));
    const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-',
      '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', arg], { stdio: ['pipe', 'inherit', 'inherit'] });
    const n = Math.round(dur * fps); const t0 = Date.now();
    const i0 = Number(process.env.START || 0), i1 = Math.min(n, Number(process.env.END || n));
    for (let i = i0; i < i1; i++) {
      await page.evaluate(t => window.setTime(t), i / fps);
      const buf = await page.screenshot({ type: 'jpeg', quality: 92 });
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
      if (i % 60 === 0) console.log(`frame ${i}/${n} [${i0}-${i1}]  ${((Date.now() - t0) / 1000).toFixed(0)}s`);
    }
    ff.stdin.end(); await new Promise(r => ff.on('close', r));
  }
  await browser.close(); server.close();
})();
