const { chromium } = require('playwright');
(async () => { const b = await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader']}); const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  const errs=[]; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type()==='error') errs.push(m.text()); });
  for (const s of process.argv.slice(2)) { errs.length=0;
    await p.goto(`http://127.0.0.1:8765/style/index.html?s=${s}`); 
    try { await p.waitForFunction(() => window.READY, null, { timeout: 120000 }); } catch(e) { console.log(s,'TIMEOUT',errs); continue; }
    await p.waitForTimeout(200); await p.screenshot({ path: `out/style_${String(s).padStart(2,'0')}.png`, timeout: 0 }); console.log(s, 'ok', errs.join(' | ')); }
  await b.close(); })();
