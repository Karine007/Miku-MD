// node shot.js <storyDir> <page.html> <out.jpg> <t> [clean=1]  -> 1920x1080 screenshot of the page at time t
const { chromium } = require('playwright'); const http = require('http'), fs = require('fs'), path = require('path');
const [dir, page_, out, t, clean] = process.argv.slice(2); const root = path.resolve(dir);
const srv = http.createServer((q, r) => { const p = path.join(root, decodeURIComponent(q.url.split('?')[0])); if (!fs.existsSync(p) || fs.statSync(p).isDirectory()) { r.writeHead(404); return r.end(); } r.writeHead(200, { 'Content-Type': { '.html': 'text/html', '.js': 'text/javascript', '.woff2': 'font/woff2' }[path.extname(p)] || 'application/octet-stream' }); fs.createReadStream(p).pipe(r); });
(async () => { await new Promise(r => srv.listen(8890, r)); const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const pg = await b.newPage({ viewport: { width: 1920, height: 1080 } }); await pg.goto(`http://localhost:8890/${page_}?lang=en${clean === '1' ? '&clean' : ''}`); await pg.waitForFunction('window.READY === true', null, { timeout: 120000 });
  await pg.evaluate(t => window.setTime(t), Number(t)); await pg.screenshot({ path: out, type: 'jpeg', quality: 92 }); await b.close(); srv.close(); })();
