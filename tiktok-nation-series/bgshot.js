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
  await new Promise(r => server.listen(8767, r));
  const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  await page.goto(`http://localhost:8767/${pageName}`);
  await page.waitForFunction('window.READY === true', null, { timeout: 120000 });
  await page.evaluate(({ P, Lk, fov }) => {
    window.setTime(57.9);
    const { camera, renderer, scene, L } = window.__T2;
    document.getElementById('ui').style.display = 'none';
    camera.position.copy(L(...P)); camera.lookAt(L(...Lk)); camera.fov = fov; camera.updateProjectionMatrix();
    renderer.render(scene, camera);
  }, { P: JSON.parse(P), Lk: JSON.parse(Lk), fov: Number(fov) });
  await page.screenshot({ path: path.join(root, out) });
  await browser.close(); server.close();
})();
