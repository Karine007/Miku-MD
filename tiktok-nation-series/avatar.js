// Renders square profile-picture variants from the island scene.
const { chromium } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const root = __dirname;
const server = http.createServer((req, res) => {
  const p = path.join(root, decodeURIComponent(req.url.split('?')[0]));
  if (!p.startsWith(root) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': { '.html': 'text/html', '.js': 'text/javascript', '.woff2': 'font/woff2' }[path.extname(p)] || 'application/octet-stream' });
  fs.createReadStream(p).pipe(res);
});
const shots = {
  // name: [camera pos, look target, fov]
  top:   [[8, 330, 120], [-4, 0, 2], 34],
  tilt:  [[118, 212, 262], [-6, 2, -6], 34],
};
(async () => {
  await new Promise(r => server.listen(8766, r));
  const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  await page.goto('http://localhost:8766/index.html?lang=en');
  await page.waitForFunction('window.READY === true', null, { timeout: 120000 });
  for (const [name, [p, l, fov]] of Object.entries(shots)) {
    await page.evaluate(({ p, l, fov }) => {
      window.setTime(2.0);
      const { camera, renderer, scene, clouds } = window.__T;
      document.getElementById('ui').style.display = 'none';
      clouds.forEach(c => c.visible = false);
      scene.fog = null; scene.traverse(o => { if (o.material && o.material.opacity === .82) { o.material.transparent = false; o.material.opacity = 1; } });
      const c = document.getElementById('c'); c.style.height = '1080px';
      renderer.setSize(1080, 1080, false);
      camera.aspect = 1; camera.fov = fov; camera.position.set(...p); camera.lookAt(...l); camera.updateProjectionMatrix();
      renderer.render(scene, camera);
    }, { p, l, fov });
    await page.screenshot({ path: path.join(root, `av_${name}.png`), clip: { x: 0, y: 0, width: 1080, height: 1080 } });
  }
  await browser.close(); server.close();
})();
