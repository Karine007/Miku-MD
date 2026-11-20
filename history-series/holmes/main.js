import { THREE, canvasTex, FONT, clamp, backOut, ease } from './kit.js';
const TL = window.TL;
await document.fonts.load(FONT(72, 900)); await document.fonts.load(FONT(30, 800));
const { SCENES } = await import('./scenes.js');
const W = 1920, H = 1080;
const R = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
R.setPixelRatio(1); R.setSize(W, H); R.outputColorSpace = THREE.SRGBColorSpace; R.toneMapping = THREE.NoToneMapping;
R.shadowMap.enabled = true; R.shadowMap.type = THREE.PCFSoftShadowMap; document.body.prepend(R.domElement);
const scene = new THREE.Scene();
const cam = new THREE.PerspectiveCamera(38, W / H, .05, 400);
const hemi = new THREE.HemisphereLight('#f3f1ff', '#a99c9a', 1.55); const key = new THREE.DirectionalLight('#fff6ea', 1.25); const amb = new THREE.AmbientLight('#ffffff', .35);
key.castShadow = true; key.shadow.mapSize.set(2048, 2048); key.shadow.radius = 6; key.shadow.bias = -.0005; key.shadow.normalBias = .02;
Object.assign(key.shadow.camera, { left: -12, right: 12, top: 12, bottom: -12, near: .5, far: 80 }); scene.add(hemi, key, key.target, amb);
const skyC = {}; const sky = (a, b, c) => skyC[a + b + c] || (skyC[a + b + c] = canvasTex(64, 1024, (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, a); gr.addColorStop(.55, b); gr.addColorStop(1, c); g.fillStyle = gr; g.fillRect(0, 0, w, h); }));

const defs = SCENES.filter(d => TL.scenes[d.id] !== undefined).sort((a, b) => TL.scenes[a.id] - TL.scenes[b.id]);
const missing = SCENES.filter(d => TL.scenes[d.id] === undefined).map(d => d.id); if (missing.length) console.error('no anchor for', missing);
const list = defs.map(d => { const r = d.build(); r.g.visible = false; scene.add(r.g); r.t0 = TL.scenes[d.id]; r.id = d.id; return r; });
list.forEach((r, i) => r.t1 = i + 1 < list.length ? list[i + 1].t0 : TL.dur); list[0].t0 = 0;

// captions: chunks of up to 5 words, broken at punctuation / pauses
const WD = TL.words; const chunks = []; let cur = [];
WD.forEach((w, i) => { cur.push(i); const nx = WD[i + 1]; if (!nx || cur.length >= 5 || /[.,?!:;]$/.test(w[2]) || nx[0] - w[1] > .35) { chunks.push(cur); cur = []; } });
const capEl = document.getElementById('cap'); let lastChunk = -2;
function caption(t) {
  let ci = -1;
  for (let i = 0; i < chunks.length; i++) { const a = WD[chunks[i][0]][0] - .1, nxt = chunks[i + 1] ? WD[chunks[i + 1][0]][0] - .1 : 1e9, end = WD[chunks[i].at(-1)][1] + .8; if (t >= a && t < Math.min(nxt, end)) { ci = i; break; } }
  if (ci !== lastChunk) { capEl.innerHTML = ci < 0 ? '' : chunks[ci].map(j => `<span>${WD[j][2].replace(/[<>&]/g, '')}</span>`).join(' '); lastChunk = ci; }
  if (ci < 0) return; const sp = capEl.children; let cj = -1;
  chunks[ci].forEach((j, k) => { const on = t >= WD[j][0] - .03; sp[k].className = on ? 'on' : ''; if (on) cj = k; }); if (cj >= 0) sp[cj].className = 'on cur';
}
const nameEl = document.getElementById('name'), pillEl = document.getElementById('pill'), titleEl = document.getElementById('title'); let lastOv = null;
function overlays(r, lt) {
  if (lastOv !== r) { lastOv = r; nameEl.querySelector('b').textContent = r.name ? r.name[0] : ''; nameEl.querySelector('i').textContent = r.name ? r.name[1] : '';
    pillEl.textContent = r.pill || ''; pillEl.style.color = r.pillColor || '#d63a7a'; titleEl.querySelector('b').textContent = r.title ? r.title[0] : ''; titleEl.querySelector('i').textContent = r.title ? r.title[1] : ''; }
  const nk = r.name ? ease((lt - .25) / .35) : 0; nameEl.style.opacity = nk; nameEl.style.transform = `translateX(${(1 - nk) * -40}px)`;
  const pt = r.pillAt ?? .45; const pk = r.pill ? (lt < pt ? 0 : backOut((lt - pt) / .4)) : 0; pillEl.style.transform = `translateX(-50%) scale(${pk})`;
  const tk = r.title ? ease((lt - .3) / .5) : 0; titleEl.style.opacity = tk; titleEl.style.transform = `scale(${.9 + .1 * tk})`;
  capEl.style.display = r.title ? 'none' : 'block';
}
window.setTime = t => {
  let k = list.findIndex(r => t >= r.t0 && t < r.t1); if (k < 0) k = list.length - 1;
  list.forEach((r, i) => r.g.visible = i === k);
  const r = list[k]; const lt = t - r.t0, u = clamp(lt / (r.t1 - r.t0));
  hemi.color.set('#f3f1ff'); hemi.groundColor.set('#a99c9a'); hemi.intensity = 1.55; key.color.set('#fff6ea'); key.intensity = 1.25; amb.intensity = .35;
  if (r.night) { hemi.color.set('#5a66a0'); hemi.groundColor.set('#1a1830'); hemi.intensity = .75; key.color.set('#8fa0e0'); key.intensity = .45; amb.intensity = .2; }
  if (r.dim) { hemi.intensity *= r.dim; key.intensity *= r.dim; amb.intensity *= r.dim; }
  const f = r.focus || new THREE.Vector3(0, 1, 0); const sd = r.sun || [4, 9, 6]; key.position.set(f.x + sd[0], f.y + sd[1], f.z + sd[2]); key.target.position.copy(f);
  if (r.upd) r.upd(lt, u, t);
  const c = r.cam(u, lt); cam.position.copy(c.p); cam.fov = c.fov || 38; cam.updateProjectionMatrix(); cam.lookAt(c.l);
  const s = r.sky || ['#cfd8ea', '#ece9ef', '#f6efe8']; scene.background = sky(...s);
  caption(t); overlays(r, lt);
  R.render(scene, cam);
};
if (location.search.includes('clean')) for (const id of ['cap', 'name', 'pill', 'title']) document.getElementById(id).style.visibility = 'hidden';
window.DUR = TL.dur; window.CAPTION_TIMES = []; window.CUTS = list.slice(1).map(r => r.t0); window.MOOD = 'doc';
window.SCENE_LIST = list.map(r => [r.id, +r.t0.toFixed(2), +r.t1.toFixed(2)]);
window.setTime(0); window.READY = true;
