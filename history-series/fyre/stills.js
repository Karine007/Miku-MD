// node stills.js out_dir [frac]  -> one jpg per scene at frac of its length (default .6)
const { chromium } = require('playwright'); const http = require('http'), fs = require('fs'), path = require('path');
const root = __dirname; const out = process.argv[2]; const frac = Number(process.argv[3] || .6); fs.mkdirSync(out, { recursive: true });
const server = http.createServer((req, res) => { const p = path.join(root, decodeURIComponent(req.url.split('?')[0])); if (!fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': { '.html': 'text/html', '.js': 'text/javascript', '.woff2': 'font/woff2' }[path.extname(p)] || 'application/octet-stream' }); fs.createReadStream(p).pipe(res); });
(async () => { await new Promise(r => server.listen(8799, r));
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const pg = await b.newPage({ viewport: { width: 1920, height: 1080 } }); const errs = []; pg.on('pageerror', e => errs.push(e.message)); pg.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await pg.goto('http://localhost:8799/'+(process.env.PAGE||'fyre.html')+'' + (process.env.CLEAN ? '?clean=1' : '')); try { await Promise.race([pg.waitForFunction('window.READY===true', null, { timeout: 300000 }), new Promise((_, rj) => pg.on('pageerror', rj))]); } catch (e) { console.log('NOT READY', errs); process.exit(1); }
  const list = await pg.evaluate('window.SCENE_LIST'); const only = process.env.ONLY ? process.env.ONLY.split(',') : null;
  for (const [id, t0, t1] of list) { if (only && !only.includes(id)) continue; await pg.evaluate(t => window.setTime(t), t0 + (t1 - t0) * frac); await pg.screenshot({ path: path.join(out, id + '.jpg'), type: 'jpeg', quality: 80, timeout: 0 }); }
  console.log('done', list.length, errs.slice(0, 5)); await b.close(); server.close(); })();
