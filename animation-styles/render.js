// Renders every scene in ./scenes to a still PNG (and optionally an MP4 via ffmpeg).
//   node render.js               -> stills in ./samples
//   node render.js --video       -> also 6s 30fps MP4 per style in ./videos
// Each scene exposes window.renderAt(t) so frames are deterministic (HyperFrames-style seekable timeline).
const { chromium } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');

const ROOT = __dirname, VIDEO = process.argv.includes('--video'), FPS = 30;
const STILL_T = { '01': 2.3, '02': 4.5, '03': 3.6, '04': 1.2, '05': 0.9, '06': 1.7, '07': 5, '08': 2.5, '09': 2.2, '10': 2.3 };
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' };
const server = http.createServer((q, s) => {
  const f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0]));
  if (!f.startsWith(ROOT) || !fs.existsSync(f)) { s.writeHead(404); return s.end(); }
  s.writeHead(200, { 'content-type': mime[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(s);
});

(async () => {
  await new Promise(r => server.listen(0, r));
  const port = server.address().port;
  const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const page = await browser.newPage({ viewport: { width: 540, height: 960 }, deviceScaleFactor: 2 });
  page.on('pageerror', e => console.error('  page error:', e.message));
  await page.addInitScript(() => { window.__frozen = true; });
  fs.mkdirSync(path.join(ROOT, 'samples'), { recursive: true });
  const scenes = fs.readdirSync(path.join(ROOT, 'scenes')).filter(f => /^\d\d-.*\.html$/.test(f)).sort();
  for (const f of scenes) {
    const id = f.slice(0, 2), name = f.replace('.html', '');
    await page.goto(`http://localhost:${port}/scenes/${f}`);
    await page.waitForFunction(() => typeof window.renderAt === 'function', null, { timeout: 30000 });
    await page.evaluate(t => window.renderAt(t), STILL_T[id] ?? 2);
    const stage = await page.$('#stage');
    await stage.screenshot({ path: path.join(ROOT, 'samples', `${name}.png`) });
    console.log('still', name);
    if (VIDEO) {
      const dir = path.join(ROOT, '.frames', name); fs.mkdirSync(dir, { recursive: true });
      for (let i = 0; i < 6 * FPS; i++) {
        await page.evaluate(t => window.renderAt(t), i / FPS);
        await stage.screenshot({ path: path.join(dir, `${String(i).padStart(4, '0')}.png`) });
      }
      fs.mkdirSync(path.join(ROOT, 'videos'), { recursive: true });
      execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', path.join(dir, '%04d.png'),
        '-vf', 'scale=1080:1920', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', path.join(ROOT, 'videos', `${name}.mp4`)]);
      fs.rmSync(dir, { recursive: true });
      console.log('video', name);
    }
  }
  await browser.close(); server.close();
})();
