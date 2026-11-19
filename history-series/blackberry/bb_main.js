import { THREE, bgTex, FONT } from './bb_kit.js';
const TL = window.TL;
await document.fonts.load(FONT(72, 900)); await document.fonts.load(FONT(72, 800));
const { SCENES } = await import('./bb_scenes.js');

const R = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
R.setPixelRatio(1); R.setSize(1080, 1920); R.toneMapping = THREE.ACESFilmicToneMapping; R.toneMappingExposure = 1.05;
R.outputColorSpace = THREE.SRGBColorSpace; R.shadowMap.enabled = true; R.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.prepend(R.domElement);
const scene = new THREE.Scene();
const cam = new THREE.PerspectiveCamera(40, 1080 / 1920, .05, 400);
const hemi = new THREE.HemisphereLight('#e4ecff', '#4b3a55', 1.2); scene.add(hemi);
const key = new THREE.DirectionalLight('#fff1dc', 2.4); key.castShadow = true; key.shadow.mapSize.set(2048, 2048);
Object.assign(key.shadow.camera, { left: -9, right: 9, top: 9, bottom: -9, near: .5, far: 60 }); key.shadow.bias = -.0004; key.shadow.normalBias = .02;
scene.add(key, key.target);
const fill = new THREE.DirectionalLight('#a9bcff', .6); fill.position.set(-8, 5, -4); scene.add(fill);

// build scenes in timeline order
const defs = SCENES.filter(d => TL.scenes[d.id] !== undefined).sort((a, b) => TL.scenes[a.id] - TL.scenes[b.id]);
const missing = SCENES.filter(d => TL.scenes[d.id] === undefined).map(d => d.id); if (missing.length) console.error('no anchor for', missing);
const list = defs.map((d, i) => { const r = d.build(); r.g.visible = false; scene.add(r.g); r.t0 = TL.scenes[d.id]; r.id = d.id; return r; });
list.forEach((r, i) => r.t1 = i + 1 < list.length ? list[i + 1].t0 : TL.dur);
list[0].t0 = 0;

// captions: chunk words
const W = TL.words; const chunks = []; let cur = [];
W.forEach((w, i) => {
  cur.push(i); const nx = W[i + 1]; const end = /[.,?!:;]$/.test(w[2]);
  if (!nx || cur.length >= 3 || end || nx[0] - w[1] > .32) { chunks.push(cur); cur = []; }
});
const capEl = document.getElementById('cap'); let lastChunk = -2;
function caption(t) {
  let ci = -1;
  for (let i = 0; i < chunks.length; i++) {
    const a = W[chunks[i][0]][0] - .08; const nxt = chunks[i + 1] ? W[chunks[i + 1][0]][0] - .08 : 1e9;
    const lastEnd = W[chunks[i][chunks[i].length - 1]][1] + .7;
    if (t >= a && t < Math.min(nxt, lastEnd)) { ci = i; break; }
  }
  if (ci !== lastChunk) { capEl.innerHTML = ci < 0 ? '' : chunks[ci].map(j => `<span>${W[j][2].replace(/[<>&]/g, '')}</span>`).join(' '); lastChunk = ci; }
  if (ci < 0) return;
  const sp = capEl.children; let curJ = -1;
  chunks[ci].forEach((j, k) => { const on = t >= W[j][0] - .03; sp[k].className = on ? 'on' : ''; if (on) curJ = k; });
  if (curJ >= 0) sp[curJ].className = 'on cur' + (/\d|\$|%/.test(W[chunks[ci][curJ]][2]) ? ' hl' : '');
}

const tmp = new THREE.Vector3();
window.setTime = t => {
  let k = list.findIndex(r => t >= r.t0 && t < r.t1); if (k < 0) k = list.length - 1;
  list.forEach((r, i) => r.g.visible = i === k);
  const r = list[k]; const lt = t - r.t0, u = clamp01(lt / (r.t1 - r.t0));
  // lights default
  hemi.intensity = 1.2; key.intensity = 2.4; key.color.set('#fff1dc'); fill.intensity = .6;
  const f = r.focus || new THREE.Vector3(0, 1, 0);
  key.position.set(f.x + 5, f.y + 9, f.z + 6); key.target.position.copy(f);
  if (r.light) r.light({ hemi, key, fill }, lt, u);
  if (r.upd) r.upd(lt, u, t);
  const c = r.cam(u, lt); cam.position.copy(c.p); cam.fov = (c.fov || 40) * 1.38; cam.setViewOffset(1080, 1920, 0, -(r.shift ?? 170), 1080, 1920); cam.updateProjectionMatrix(); cam.lookAt(c.l);
  if (c.roll) cam.rotateZ(c.roll);
  scene.background = bgTex(...(r.bg || ['#121a3a', '#3a2d56']));
  scene.fog = r.fog || null;
  caption(t);
  R.render(scene, cam);
};
function clamp01(x) { return Math.min(1, Math.max(0, x)); }
window.DUR = TL.dur; window.CAPTION_TIMES = []; window.CUTS = list.slice(1).map(r => r.t0); window.MOOD = 'doc';
window.SCENE_LIST = list.map(r => [r.id, r.t0, r.t1]);
window.setTime(0); window.READY = true;
