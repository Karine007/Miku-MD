// Low-poly kit for the BlackBerry story: materials, people, phones, signs, props.
import * as THREE from 'three';
import { RoundedBoxGeometry } from './node_modules/three/examples/jsm/geometries/RoundedBoxGeometry.js';
export { THREE };

const MC = {};
export function M(c, o = {}) {
  const k = c + JSON.stringify(o);
  if (!MC[k]) MC[k] = new THREE.MeshStandardMaterial(Object.assign({ color: c, roughness: .78, metalness: 0, flatShading: true }, o));
  return MC[k];
}
export const E = (c, i = 1) => M(c, { emissive: c, emissiveIntensity: i });
export function mesh(geo, mat, x = 0, y = 0, z = 0, cast = true) {
  const m = new THREE.Mesh(geo, typeof mat === 'string' ? M(mat) : mat);
  m.position.set(x, y, z); m.castShadow = cast; m.receiveShadow = true; return m;
}
export const box = (w, h, d, c, x = 0, y = 0, z = 0) => mesh(new THREE.BoxGeometry(w, h, d), c, x, y, z);
export const rbox = (w, h, d, r, c, x = 0, y = 0, z = 0) => mesh(new RoundedBoxGeometry(w, h, d, 3, r), c, x, y, z);
export const cyl = (rt, rb, h, c, x = 0, y = 0, z = 0, seg = 16) => mesh(new THREE.CylinderGeometry(rt, rb, h, seg), c, x, y, z);
export const sph = (r, c, x = 0, y = 0, z = 0, seg = 12) => mesh(new THREE.SphereGeometry(r, seg, Math.max(6, seg * 2 / 3 | 0)), c, x, y, z);
export const grp = (...ch) => { const g = new THREE.Group(); ch.forEach(c => g.add(c)); return g; };
export const V = (x, y, z) => new THREE.Vector3(x, y, z);

// ---------- easing / animation ----------
export const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const ease = x => { x = clamp(x); return x * x * (3 - 2 * x); };
export const eio = x => { x = clamp(x); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
export const backOut = x => { x = clamp(x); const c = 1.70158; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
export const lerp = (a, b, t) => a + (b - a) * t;
// pop an object in (scale 0 -> s) starting at time t0 (scene-local seconds)
export function pop(o, lt, t0, d = .45, s = 1) {
  const k = backOut((lt - t0) / d) * s; const v = Math.max(1e-4, k);
  if (!o.userData.s0) o.userData.s0 = o.scale.clone();
  o.scale.copy(o.userData.s0).multiplyScalar(v); o.visible = lt >= t0;
}
export function dolly(p0, p1, l0, l1, fov0 = 40, fov1 = fov0, e = eio) {
  return u => { const k = e(u); return { p: p0.clone().lerp(p1, k), l: l0.clone().lerp(l1 || l0, k), fov: lerp(fov0, fov1, k) }; };
}

// ---------- canvas textures ----------
export function canvasTex(w, h, draw) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const ctx = c.getContext('2d'); const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
  t.redraw = (...a) => { ctx.clearRect(0, 0, w, h); draw(ctx, w, h, ...a); t.needsUpdate = true; };
  t.redraw(); t.ctx = ctx; return t;
}
export const FONT = (px, w = 900) => `${w} ${px}px Nunito, sans-serif`;
export function rrect(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); }
// text plane; opts: w (world width), bg, fg, size (px), pad, font, radius, lines (array or \n), align
export function label(text, o = {}) {
  const lines = String(text).split('\n'); const size = o.size || 72; const pad = o.pad ?? 28;
  const cv = document.createElement('canvas').getContext('2d'); cv.font = o.font || FONT(size);
  const tw = Math.max(...lines.map(l => cv.measureText(l).width)) + pad * 2; const th = lines.length * size * 1.18 + pad * 2;
  const W = Math.ceil(tw), H = Math.ceil(th);
  const tex = canvasTex(W, H, (ctx, w, h) => {
    if (o.bg) { ctx.fillStyle = o.bg; rrect(ctx, 0, 0, w, h, o.radius ?? 18); ctx.fill(); }
    if (o.border) { ctx.strokeStyle = o.border; ctx.lineWidth = 8; rrect(ctx, 4, 4, w - 8, h - 8, o.radius ?? 18); ctx.stroke(); }
    ctx.font = o.font || FONT(size); ctx.fillStyle = o.fg || '#fff'; ctx.textBaseline = 'middle'; ctx.textAlign = 'center';
    lines.forEach((l, i) => ctx.fillText(l, w / 2, pad + size * 1.18 * (i + .5)));
  });
  const ww = o.w || W / 200; const m = new THREE.Mesh(new THREE.PlaneGeometry(ww, ww * H / W),
    new THREE.MeshBasicMaterial({ map: tex, transparent: true, toneMapped: false, side: o.double ? THREE.DoubleSide : THREE.FrontSide }));
  m.renderOrder = 2; return m;
}
// a board (box) with a label on its front
export function sign(text, o = {}) {
  const l = label(text, Object.assign({ bg: o.bg || '#ffffff', fg: o.fg || '#1d2433' }, o));
  const w = l.geometry.parameters.width, h = l.geometry.parameters.height;
  const b = box(w + .06, h + .06, o.depth || .08, o.frame || '#2a2f3a'); l.position.z = (o.depth || .08) / 2 + .003;
  return grp(b, l);
}

// ---------- background gradient ----------
const BG = {};
export function bgTex(top, bot) {
  const k = top + bot; if (BG[k]) return BG[k];
  return BG[k] = canvasTex(4, 256, (ctx, w, h) => { const g = ctx.createLinearGradient(0, 0, 0, h); g.addColorStop(0, top); g.addColorStop(1, bot); ctx.fillStyle = g; ctx.fillRect(0, 0, w, h); });
}

// ---------- people ----------
const SKIN = ['#e9b98f', '#c98d64', '#8d5a3b', '#5f3b26', '#f1c9a5'];
export function person(o = {}) {
  const g = new THREE.Group(); const skin = o.skin || SKIN[1];
  const shirt = o.shirt || '#4a90d9', pants = o.pants || '#2c3443', top = o.suit || shirt;
  const legL = grp(box(.22, .8, .24, pants, 0, -.4, 0), box(.24, .12, .32, o.shoe || '#1c1c1f', 0, -.76, .04)); legL.position.set(-.13, .82, 0);
  const legR = legL.clone(); legR.position.x = .13;
  const torso = box(.62, .76, .34, top, 0, 1.2, 0);
  g.add(legL, legR, torso);
  if (o.suit) { g.add(box(.2, .5, .02, o.shirt || '#f4f4f4', 0, 1.32, .175)); g.add(box(.07, .42, .025, o.tie || '#b3262e', 0, 1.3, .19)); }
  if (o.badge) g.add(box(.12, .12, .02, o.badge, .17, 1.38, .18));
  const arm = c => grp(box(.18, .5, .2, c, 0, -.25, 0), box(.17, .2, .19, skin, 0, -.6, 0));
  const armL = arm(top); armL.position.set(-.41, 1.54, 0); const armR = arm(top); armR.position.set(.41, 1.54, 0);
  g.add(armL, armR);
  const head = new THREE.Group(); head.position.y = 1.62;
  head.add(box(.16, .1, .16, skin, 0, .03, 0)); // neck
  head.add(box(.44, .44, .42, skin, 0, .3, 0));
  head.add(box(.06, .07, .02, '#15161a', -.1, .32, .215), box(.06, .07, .02, '#15161a', .1, .32, .215));
  if (o.hair !== null) {
    const hc = o.hair || '#2b1d14';
    if (o.bald) head.add(box(.46, .14, .2, hc, 0, .34, -.13));
    else { head.add(box(.47, .13, .45, hc, 0, .55, -.01)); head.add(box(.47, .3, .1, hc, 0, .4, -.19)); }
    if (o.long) head.add(box(.48, .5, .14, hc, 0, .22, -.18));
  }
  if (o.glasses) head.add(box(.36, .05, .02, '#111', 0, .33, .225));
  if (o.beard) head.add(box(.44, .14, .05, o.hair || '#2b1d14', 0, .13, .2));
  if (o.cap) head.add(box(.48, .1, .46, o.cap, 0, .57, 0), box(.3, .03, .2, o.cap, 0, .52, .3));
  g.add(head);
  g.userData = { armL, armR, legL, legR, head, torso };
  return g;
}
// put a phone in the right hand, held up in front of the chest
export function holdPhone(p, ph, look = true, s = .32) {
  const { armR, armL, head } = p.userData;
  armR.rotation.x = -1.25; armR.rotation.z = .35; armL.rotation.x = -1.1; armL.rotation.z = -.3;
  ph.scale.setScalar(s); ph.position.set(-.05, -.66, .08); ph.rotation.set(-1.9, 0, -.35); armR.add(ph);
  if (look) head.rotation.x = .38; return ph;
}
export function walk(p, t, sp = 6, a = .5) {
  const { legL, legR, armL, armR } = p.userData; const s = Math.sin(t * sp) * a;
  legL.rotation.x = s; legR.rotation.x = -s; armL.rotation.x = -s * .8; armR.rotation.x = s * .8;
}

// ---------- phones ----------
// screen painters (ctx, w, h, t)
export const SCR = {
  off: (c, w, h) => { c.fillStyle = '#06070a'; c.fillRect(0, 0, w, h); },
  home: (c, w, h) => {
    const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#16325e'); g.addColorStop(1, '#0a1428'); c.fillStyle = g; c.fillRect(0, 0, w, h);
    c.fillStyle = '#fff'; c.font = FONT(64, 800); c.textAlign = 'left'; c.fillText('10:08', 22, 82);
    for (let i = 0; i < 4; i++) c.fillRect(w - 110 + i * 12, 34 - i * 6, 8, 6 + i * 6); c.font = FONT(20, 800); c.fillText('3G', w - 56, 34);
    const col = ['#3d8bfd', '#20c997', '#f59f00', '#e64980', '#7950f2', '#12b886', '#fd7e14', '#4c6ef5'];
    for (let i = 0; i < 8; i++) { c.fillStyle = col[i]; rrect(c, 24 + (i % 4) * 74, 130 + (i / 4 | 0) * 64, 52, 46, 9); c.fill(); }
  },
  mail: (c, w, h) => {
    c.fillStyle = '#f2f4f8'; c.fillRect(0, 0, w, h); c.fillStyle = '#1b3a6b'; c.fillRect(0, 0, w, 44);
    c.fillStyle = '#fff'; c.font = FONT(24); c.textAlign = 'left'; c.fillText('Messages', 14, 31);
    for (let i = 0; i < 5; i++) {
      c.fillStyle = i == 0 ? '#dfe9ff' : '#f2f4f8'; c.fillRect(0, 48 + i * 38, w, 36);
      c.fillStyle = '#1d2433'; c.font = FONT(19, 900); c.fillText(['New email', 'Meeting 3pm', 'Re: Q3 report', 'Flight update', 'Lunch?'][i], 14, 72 + i * 38);
      c.fillStyle = '#9aa3b2'; c.fillRect(170, 64 + i * 38, 120, 6);
    }
  },
  bbm: (c, w, h, t = 9) => {
    c.fillStyle = '#e9edf3'; c.fillRect(0, 0, w, h); c.fillStyle = '#26303f'; c.fillRect(0, 0, w, 44);
    c.fillStyle = '#fff'; c.font = FONT(24); c.textAlign = 'left'; c.fillText('BBM  ·  Chats', 14, 31);
    const msgs = [['hey!! u there?', 0], ['yes :)', 1], ['send me ur PIN', 0]];
    msgs.forEach(([m, me], i) => { if (t < i * .6) return; c.fillStyle = me ? '#3f8cff' : '#fff'; const x = me ? w - 180 : 12; rrect(c, x, 58 + i * 50, 168, 38, 12); c.fill(); c.fillStyle = me ? '#fff' : '#1d2433'; c.font = FONT(19, 800); c.fillText(m, x + 12, 83 + i * 50); });
  },
};
export function screen(painter, w = 320, h = 240) { return canvasTex(w, h, painter); }

// classic BlackBerry (front faces +z). 1.12 tall. opts: screen (texture), body color
export function blackberry(o = {}) {
  const g = new THREE.Group(); const body = o.body || '#1a1c21';
  g.add(rbox(.66, 1.14, .13, .06, body));
  g.add(rbox(.62, 1.1, .1, .05, o.rim || '#9aa1ab', 0, 0, -.02)); // chrome rim peeking
  const scr = o.screen || screen(SCR.home);
  const sm = new THREE.Mesh(new THREE.PlaneGeometry(.52, .39), new THREE.MeshBasicMaterial({ map: scr, toneMapped: false }));
  sm.position.set(0, .28, .066); g.add(sm); g.userData.screen = sm;
  g.add(box(.56, .43, .005, '#0b0c0f', 0, .28, .063));
  // nav row + trackball
  g.add(box(.5, .07, .02, '#24272e', 0, .015, .066));
  g.add(mesh(new THREE.SphereGeometry(.032, 12, 8), M('#cfd5de', { metalness: .6, roughness: .25, flatShading: false }), 0, .016, .075));
  g.add(box(.05, .03, .01, '#3fbf5f', -.17, .016, .077), box(.05, .03, .01, '#e04545', .17, .016, .077));
  // keyboard: 4 rows x 10 keys as one instanced mesh
  const kg = new RoundedBoxGeometry(.046, .052, .03, 2, .012);
  const keys = new THREE.InstancedMesh(kg, M(o.keys || '#2b2e35', { roughness: .45 }), 40); const d = new THREE.Object3D(); let i = 0;
  for (let r = 0; r < 4; r++) for (let k = 0; k < 10; k++) {
    d.position.set(-.252 + k * .056, -.1 - r * .08, .07); d.rotation.set(0, 0, (k - 4.5) * .025); d.updateMatrix(); keys.setMatrixAt(i++, d.matrix);
  }
  keys.castShadow = true; g.add(keys);
  for (let r = 0; r < 3; r++) g.add(box(.6, .006, .012, '#9aa1ab', 0, -.06 - r * .08 - .04, .07)); // chrome frets
  g.add(box(.08, .012, .01, '#e33', .24, .52, .066)); // LED
  g.userData.led = g.children[g.children.length - 1];
  return g;
}
// generic glass slab touch phone (no logos)
export function touchPhone(o = {}) {
  const g = new THREE.Group();
  g.add(rbox(.6, 1.16, .07, .08, o.body || '#16171b'));
  const scr = o.screen || screen(appGrid, 300, 560);
  const sm = new THREE.Mesh(new THREE.PlaneGeometry(.52, .96), new THREE.MeshBasicMaterial({ map: scr, toneMapped: false }));
  sm.position.z = .037; g.add(sm); g.userData.screen = sm;
  if (o.button !== false) g.add(cyl(.035, .035, .01, '#2a2c33', 0, -.53, .036, 16).rotateX(Math.PI / 2));
  return g;
}
export function appGrid(c, w, h) {
  const g = c.createLinearGradient(0, 0, w, h); g.addColorStop(0, '#2b5f9e'); g.addColorStop(1, '#6b3fa0'); c.fillStyle = g; c.fillRect(0, 0, w, h);
  const col = ['#34c759', '#ff9f0a', '#0a84ff', '#ff375f', '#5e5ce6', '#ffd60a', '#30b0c7', '#ff453a', '#64d2ff', '#bf5af2', '#32d74b', '#ff9500', '#ac8e68', '#66d4cf', '#e5e5ea', '#ff6482'];
  for (let i = 0; i < 16; i++) { c.fillStyle = col[i]; rrect(c, 22 + (i % 4) * 70, 60 + (i / 4 | 0) * 84, 52, 52, 13); c.fill(); }
  for (let i = 0; i < 4; i++) { c.fillStyle = col[(i * 5) % 16]; rrect(c, 22 + i * 70, h - 82, 52, 52, 13); c.fill(); }
}
export function pager() {
  const g = grp(rbox(.7, .4, .2, .06, '#2d3340'));
  const scr = screen((c, w, h) => { c.fillStyle = '#9fc59a'; c.fillRect(0, 0, w, h); c.fillStyle = '#1e3a1e'; c.font = FONT(44, 800); c.fillText('555-0142', 18, 70); }, 300, 110);
  const s = new THREE.Mesh(new THREE.PlaneGeometry(.5, .18), new THREE.MeshBasicMaterial({ map: scr, toneMapped: false })); s.position.set(0, .05, .101); g.add(s);
  g.add(box(.12, .05, .03, '#596173', -.15, -.12, .1), box(.12, .05, .03, '#596173', .15, -.12, .1));
  return g;
}
export function tablet(o = {}) {
  const g = grp(rbox(1.5, .95, .06, .06, '#18191d'));
  const s = new THREE.Mesh(new THREE.PlaneGeometry(1.36, .82), new THREE.MeshBasicMaterial({ map: o.screen || screen(appGrid, 560, 340), toneMapped: false }));
  s.position.z = .032; g.add(s); g.userData.screen = s; return g;
}

// ---------- props ----------
export function desk(w = 2.4, d = 1.1, c = '#7a5236', h = .78) {
  const g = grp(box(w, .08, d, c, 0, h, 0));
  [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([a, b]) => g.add(box(.08, h, .08, c, a * (w / 2 - .08), h / 2, b * (d / 2 - .08))));
  return g;
}
export function chair(c = '#2d3340') {
  return grp(box(.5, .08, .5, c, 0, .48, 0), box(.5, .55, .08, c, 0, .78, -.22), box(.06, .48, .06, '#111', 0, .24, 0));
}
export function floor(w, d, c, y = 0) { const f = box(w, .1, d, c, 0, y - .05, 0); f.castShadow = false; return f; }
export function wall(w, h, c, z = -5, x = 0, ry = 0) { const m = box(w, h, .12, c, x, h / 2, z); m.rotation.y = ry; m.castShadow = false; return m; }
export function calendar(month, day, wd = '', o = {}) {
  const tex = canvasTex(400, 460, (c, w, h) => {
    c.fillStyle = '#fbfbf7'; rrect(c, 0, 0, w, h, 26); c.fill();
    c.fillStyle = o.red || '#d6322f'; rrect(c, 0, 0, w, 120, [26, 26, 0, 0]); c.fill();
    c.fillStyle = '#fff'; c.font = FONT(54); c.textAlign = 'center'; c.fillText(month, w / 2, 80);
    c.fillStyle = '#20232b'; c.font = FONT(230); c.fillText(day, w / 2, 340);
    c.font = FONT(44, 800); c.fillStyle = '#6a7080'; c.fillText(wd, w / 2, 420);
  });
  const g = grp(box(2.06, 2.36, .12, '#d9d9d2'));
  const f = new THREE.Mesh(new THREE.PlaneGeometry(2, 2.3), new THREE.MeshBasicMaterial({ map: tex, toneMapped: false })); f.position.z = .065; g.add(f);
  g.add(cyl(.06, .06, .2, '#555', -.6, 1.2, 0).rotateX(Math.PI / 2), cyl(.06, .06, .2, '#555', .6, 1.2, 0).rotateX(Math.PI / 2));
  return g;
}
// a stack of cash bricks; returns group with userData.bricks for animated filling
export function cash(nx, nz, ny, o = {}) {
  const g = new THREE.Group(); const b = [];
  const geo = new THREE.BoxGeometry(.5, .14, .24);
  for (let y = 0; y < ny; y++) for (let x = 0; x < nx; x++) for (let z = 0; z < nz; z++) {
    const m = mesh(geo, M(o.c || '#4caf6a'), (x - (nx - 1) / 2) * .53, .07 + y * .145, (z - (nz - 1) / 2) * .27);
    m.add(box(.08, .145, .245, '#e8e2c8')); g.add(m); b.push(m);
  }
  g.userData.bricks = b; return g;
}
export function tree(h = 1, c = '#2f7d4f', snow = false) {
  const g = grp(cyl(.06 * h, .08 * h, .4 * h, '#6b4a2f', 0, .2 * h, 0, 6));
  for (let i = 0; i < 3; i++) { g.add(mesh(new THREE.ConeGeometry((.55 - i * .14) * h, .55 * h, 7), snow && i == 2 ? '#f4f7fb' : c, 0, (.55 + i * .32) * h, 0)); }
  return g;
}
export function flag(stars = true) {
  const tex = canvasTex(300, 180, (c, w, h) => {
    for (let i = 0; i < 13; i++) { c.fillStyle = i % 2 ? '#fff' : '#c4323a'; c.fillRect(0, i * h / 13, w, h / 13 + 1); }
    c.fillStyle = '#26407a'; c.fillRect(0, 0, w * .42, h * 7 / 13);
    if (stars) { c.fillStyle = '#fff'; for (let i = 0; i < 30; i++) c.fillRect(8 + (i % 6) * 20, 8 + (i / 6 | 0) * 18, 5, 5); }
  });
  const f = new THREE.Mesh(new THREE.PlaneGeometry(1.1, .66, 8, 1), new THREE.MeshStandardMaterial({ map: tex, side: THREE.DoubleSide, roughness: .9 }));
  f.position.set(.58, 2.3, 0); f.castShadow = true;
  return grp(cyl(.03, .03, 2.8, '#c9a74b', 0, 1.4, 0, 8), f, sph(.06, '#e0c060', 0, 2.83, 0));
}
export function snowfall(n, w, h, d, seed = 1) {
  const pos = new Float32Array(n * 3); let s = seed;
  const r = () => (s = (s * 16807) % 2147483647) / 2147483647;
  for (let i = 0; i < n; i++) { pos[i * 3] = (r() - .5) * w; pos[i * 3 + 1] = r() * h; pos[i * 3 + 2] = (r() - .5) * d; }
  const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos.slice(), 3));
  const p = new THREE.Points(geo, new THREE.PointsMaterial({ color: '#ffffff', size: .06 }));
  p.userData.tick = t => { const a = geo.attributes.position.array; for (let i = 0; i < n; i++) { a[i * 3 + 1] = ((pos[i * 3 + 1] - t * .6) % h + h) % h; a[i * 3] = pos[i * 3] + Math.sin(t + i) * .1; } geo.attributes.position.needsUpdate = true; };
  return p;
}
// chat bubble with dots / text
export function bubble(text, c = '#3f8cff', fg = '#fff', w = 1.2) {
  return label(text, { bg: c, fg, size: 64, radius: 40, w });
}
// simple bar (pillar) chart element
export function bar(h, c, w = .6) { return mesh(new THREE.BoxGeometry(w, h, w).translate(0, h / 2, 0), c); }
// rng
export function rng(seed) { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; }
