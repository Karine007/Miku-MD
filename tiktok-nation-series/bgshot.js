// Renders a clean background frame (no UI) from a page at a given time+camera, for covers.
// usage: node bgshot.js day2.html out.png "[px,py,pz]" "[lx,ly,lz]" fov   (coords in city-local L(u,v,h) when page has L)
const { chromium } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const root = __dirname;
const server = http.createServer((req, res) => {
  const p = path.join(root, decodeURIComponent(req.url.split('?')[0]));
  if (!p.startsWith(root) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': { '.html': 'text/html', '.js': 'text/javascript', '.woff2': 'font/woff2' }[path.extname(p)] || 'application/octet-stream' });
  fs.createReadStream(p).pipe(res);
});
(async () => {
  const [pageName, out, P, Lk, fov] = process.argv.slice(2);
  await new Promise(r => server.listen(Number(process.env.PORT || 8767), r));
  const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  await page.goto(`http://localhost:${process.env.PORT || 8767}/${pageName}`);
  await page.waitForFunction('window.READY === true', null, { timeout: 120000 });
  await page.evaluate(({ P, Lk, fov, T }) => {
    window.setTime(T);
    const { camera, renderer, scene, L } = window.__T2;
    document.getElementById('ui').style.display = 'none';
    if (P.length === 4) camera.position.set(P[0], P[1], P[2]); else camera.position.copy(L(...P)); if (Lk.length === 4) camera.lookAt(Lk[0], Lk[1], Lk[2]); else camera.lookAt(L(...Lk));  // 4 values = world coords camera.fov = fov; camera.updateProjectionMatrix();
    renderer.render(scene, camera);
  }, { P: JSON.parse(P), Lk: JSON.parse(Lk), fov: Number(fov), T: Number(process.env.T || 57.9) });
  await page.screenshot({ path: path.join(root, out) });
  await browser.close(); server.close();
})();
