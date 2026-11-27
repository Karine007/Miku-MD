// Soft pastel matte 3D kit (style option 1): Lambert materials, slim mannequin people, pastel rooms, canvas-text props.
import * as THREE from 'three';
import { RoundedBoxGeometry } from './node_modules/three/examples/jsm/geometries/RoundedBoxGeometry.js';
export { THREE };
export const V = (x, y, z) => new THREE.Vector3(x, y, z);
export const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const lerp = (a, b, k) => a + (b - a) * k;
export const ease = k => { k = clamp(k); return k * k * (3 - 2 * k); };
export const backOut = k => { k = clamp(k); const c = 1.7; return 1 + (c + 1) * Math.pow(k - 1, 3) + c * Math.pow(k - 1, 2); };
export const FONT = (px, w = 900) => `${w} ${px}px Nunito`;
export function rng(seed) { let s = seed * 9301 + 49297; return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; }; }

// ---------- materials & meshes ----------
const cache = {};
export function M(c, o = {}) {
  if (o.map || o.noCache) { const m = new THREE.MeshLambertMaterial(Object.assign({ color: c }, o)); delete m.noCache; return m; }
  const k = c + JSON.stringify(o); return cache[k] || (cache[k] = new THREE.MeshLambertMaterial(Object.assign({ color: c }, o)));
}
export const B = (c, o = {}) => new THREE.MeshBasicMaterial(Object.assign({ color: c, fog: false }, o));
export function mesh(geo, c, x = 0, y = 0, z = 0, o) {
  const m = new THREE.Mesh(geo, typeof c === 'string' ? M(c, o) : c); m.position.set(x, y, z); m.castShadow = true; m.receiveShadow = true; return m;
}
export const box = (w, h, d, c, x, y, z) => mesh(new THREE.BoxGeometry(w, h, d), c, x, y, z);
export const rbox = (w, h, d, r, c, x, y, z) => mesh(new RoundedBoxGeometry(w, h, d, 3, r), c, x, y, z);
export const cyl = (rt, rb, h, c, x, y, z, n = 24) => mesh(new THREE.CylinderGeometry(rt, rb, h, n), c, x, y, z);
export const sph = (r, c, x, y, z, sx = 1, sy = 1, sz = 1, n = 24) => { const m = mesh(new THREE.SphereGeometry(r, n, Math.max(6, n * .7 | 0)), c, x, y, z); m.scale.set(sx, sy, sz); return m; };
export const capsule = (r, l, c, x, y, z) => mesh(new THREE.CapsuleGeometry(r, l, 5, 14), c, x, y, z);
export const G = (...a) => { const g = new THREE.Group(); a.forEach(o => o && g.add(o)); return g; };
export const at = (o, x, y, z, ry = 0) => { o.position.set(x, y, z); o.rotation.y = ry; return o; };

// ---------- canvas textures ----------
export function canvasTex(w, h, draw, rep) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); draw(g, w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; t.userData = { canvas: c, ctx: g };
  if (rep) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(...rep); } return t;
}
export function noise(g, w, h, a = .05) { const r = rng(w + h); for (let i = 0; i < w * h / 60; i++) { g.fillStyle = `rgba(${r() < .5 ? '0,0,0' : '255,255,255'},${r() * a})`; g.fillRect(r() * w, r() * h, 2, 2); } }
export const checker = (c1, c2, n) => canvasTex(256, 256, (g, w, h) => { for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) { g.fillStyle = (i + j) % 2 ? c2 : c1; g.fillRect(i * 128, j * 128, 128, 128); } noise(g, w, h, .03); }, [n, n]);
export const planks = (c, n) => canvasTex(512, 512, (g, w, h) => { g.fillStyle = c; g.fillRect(0, 0, w, h); for (let i = 0; i < 8; i++) { g.fillStyle = `rgba(0,0,0,${.03 + (i % 3) * .02})`; g.fillRect(0, i * 64, w, 64); g.fillStyle = 'rgba(0,0,0,.12)'; g.fillRect(0, i * 64, w, 2); g.fillRect(((i * 197) % 400) + 50, i * 64, 2, 64); } noise(g, w, h, .04); }, [n, n]);
const flatC = {};
export const flat = (c, n = 1) => flatC[c + n] || (flatC[c + n] = canvasTex(256, 256, (g, w, h) => { g.fillStyle = c; g.fillRect(0, 0, w, h); noise(g, w, h, .035); }, [n, n]));
export const siding = c => canvasTex(256, 256, (g, w, h) => { g.fillStyle = c; g.fillRect(0, 0, w, h); for (let i = 0; i < 16; i++) { g.fillStyle = 'rgba(0,0,0,.09)'; g.fillRect(0, i * 16 + 13, w, 3); g.fillStyle = 'rgba(255,255,255,.08)'; g.fillRect(0, i * 16, w, 2); } }, [3, 2]);
export function textTex(lines, o = {}) {
  const w = o.w || 1024, h = o.h || 256;
  return canvasTex(w, h, (g) => {
    if (o.bg !== 'none') { g.fillStyle = o.bg || '#fff'; g.fillRect(0, 0, w, h); }
    if (o.draw) o.draw(g, w, h);
    g.textAlign = o.align || 'center'; g.textBaseline = 'middle';
    lines.forEach(([t, px, col, y, wt, x]) => { g.font = FONT(px, wt || 900); g.fillStyle = col; g.fillText(t, x ?? (o.align === 'left' ? 40 : w / 2), y); });
    if (o.noise !== false && o.bg !== 'none') noise(g, w, h, .025);
  });
}
export const panel = (w, h, tex, x = 0, y = 0, z = 0, ry = 0, basic) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), basic ? B('#fff', { map: tex, transparent: true }) : M('#ffffff', { map: tex, transparent: true })); m.position.set(x, y, z); m.rotation.y = ry; m.receiveShadow = true; return m; };
// flat sign with text, w in metres; height from aspect
export function sign(text, o = {}) {
  const px = o.px || 120, c = document.createElement('canvas').getContext('2d'); c.font = FONT(px); const tw = c.measureText(text).width + px * 1.2;
  const W = Math.ceil(tw), H = Math.ceil(px * 1.7);
  const t = canvasTex(W, H, (g) => { if (o.bg !== 'none') { g.fillStyle = o.bg || '#fff'; rr(g, 0, 0, W, H, o.r ?? H * .2); g.fill(); } g.font = FONT(px); g.fillStyle = o.fg || '#222'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(text, W / 2, H * .54); });
  const w = o.w || 2, m = panel(w, w * H / W, t, 0, 0, 0, 0, o.basic); return m;
}
export function rr(g, x, y, w, h, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }
// camera-facing floating label (sprite)
export function tag(text, o = {}) {
  const px = 110, c = document.createElement('canvas').getContext('2d'); c.font = FONT(px); const W = Math.ceil(c.measureText(text).width + px * 1.1), H = Math.ceil(px * 1.65);
  const t = canvasTex(W, H, (g) => { g.fillStyle = o.bg || '#ffffff'; rr(g, 4, 4, W - 8, H - 8, H * .28); g.fill(); g.font = FONT(px); g.fillStyle = o.fg || '#d63a7a'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(text, W / 2, H * .55); });
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, depthTest: o.depthTest ?? true, fog: false })); const h = o.h || .35; s.scale.set(h * W / H, h, 1); s.userData.base = s.scale.clone(); return s;
}
export function pop(o, lt, t0, dur = .45) { const k = clamp((lt - t0) / dur); const s = k <= 0 ? 0.0001 : backOut(k); const b = o.userData.base || (o.userData.base = o.scale.clone()); o.scale.set(b.x * s, b.y * s, b.z * s); o.visible = k > 0; }

// ---------- people ----------
export const SKIN = ['#f2d0b5', '#e6b993', '#c9946c', '#97643f', '#6e4429', '#efcfae'];
export function person(o = {}) {
  const g = new THREE.Group();
  const tall = o.kid ? .66 : 1, ch = 1;
  const skin = o.skin || SKIN[0], top = o.top || '#4a6fc4', pants = o.pants || '#2e3550', shoe = o.shoe || '#2a2a30';
  const legLen = .82 * tall, hipY = legLen + .05;
  const mkLeg = (s) => {
    const hip = new THREE.Group(); hip.position.set(s * .085, hipY, 0);
    hip.add(cyl(.068, .06, legLen / 2, o.dress ? skin : pants, 0, -legLen / 4, 0, 14));
    const knee = new THREE.Group(); knee.position.y = -legLen / 2; hip.add(knee);
    knee.add(cyl(.058, .05, legLen / 2, o.dress ? skin : pants, 0, -legLen / 4, 0, 14));
    knee.add(sph(.075, shoe, 0, -legLen / 2 - .01, .05, 1, .62, 1.6, 16));
    hip.userData.knee = knee; return hip;
  };
  const legL = mkLeg(-1), legR = mkLeg(1); g.add(legL, legR);
  const body = new THREE.Group(); g.add(body);
  const tH = .58 * (o.kid ? .78 : 1);
  body.add(rbox(.38, tH + .08, .25, .1, top, 0, hipY + tH / 2 - .02, 0));
  body.add(sph(.16, o.dress || pants, 0, hipY + .03, 0, 1.05, .45, .72, 16));
  if (o.dress) { const sk = cyl(.17, .27, .42, o.dress, 0, hipY - .12, 0, 20); sk.scale.z = .8; body.add(sk); }
  if (o.shirt !== false) {
    const v = new THREE.Mesh(new THREE.CircleGeometry(.075, 3), M(o.shirt || '#f6f2ee')); v.rotation.z = -Math.PI / 2; v.scale.set(1.5, .9, 1);
    v.position.set(0, hipY + tH - .06, .127); body.add(v);
    if (o.tie) body.add(box(.035, .16, .01, o.tie, 0, hipY + tH - .14, .131));
  }
  if (o.turtle) body.add(cyl(.06, .07, .08, top, 0, hipY + tH + .03, 0, 16));
  const shY = hipY + tH - .02;
  body.add(sph(.08, top, -.17, shY - .04, 0, 1, .8, 1, 14), sph(.08, top, .17, shY - .04, 0, 1, .8, 1, 14));
  if (o.coat) { const c = rbox(.42, .95 * tall, .27, .1, o.coat, 0, hipY + tH - .44 * tall, -.005); body.add(c); body.add(box(.01, .5 * tall, .01, '#dcdcdc', 0, hipY + tH - .35, .14)); }
  const mkArm = (s) => {
    const a = new THREE.Group(); a.position.set(s * .22, shY - .04, 0);
    a.add(capsule(.052, .22 * tall, o.coat || o.sleeve || top, 0, -.15 * tall, 0));
    const el = new THREE.Group(); el.position.y = -.29 * tall; a.add(el);
    el.add(capsule(.046, .2 * tall, o.coat || o.sleeve || top, 0, -.12 * tall, 0), sph(.048, skin, 0, -.28 * tall, 0, .85, 1.1, .7, 12));
    a.userData.el = el; a.rotation.z = s * .08; return a;
  };
  const armL = mkArm(-1), armR = mkArm(1); body.add(armL, armR);
  body.add(cyl(.045, .05, .1, skin, 0, shY + .05, 0, 12));
  const head = new THREE.Group(); head.position.y = shY + .2; body.add(head);
  const hs = o.kid ? 1.12 : 1;
  head.add(sph(.125 * hs, skin, 0, 0, 0, .88, 1.12, .94, 28));
  head.add(sph(.03 * hs, skin, -.112 * hs, 0, 0, .5, 1, .8, 10), sph(.03 * hs, skin, .112 * hs, 0, 0, .5, 1, .8, 10));
  const fz = .113 * hs; const eyes = [];
  for (const s of [-1, 1]) {
    const e = sph(.013 * hs * (o.bigEyes || 1), '#231c1c', s * .042 * hs, .012 * hs, fz, 1, 1.25, .5, 10); head.add(e); eyes.push(e);
    const br = box(.042 * hs, .009 * hs, .01, o.brows || o.hair || '#3b2a20', s * .043 * hs, .045 * hs, fz - .004); br.rotation.z = -s * (o.brow ?? .12); head.add(br);
  }
  head.add(sph(.016 * hs, skin, 0, -.012 * hs, fz + .01, .9, 1.2, 1, 10));
  const mouth = box(.042 * hs, .007 * hs, .01, o.mouth || '#a5545a', 0, -.05 * hs, fz - .006); head.add(mouth);
  if (o.smile) mouth.scale.set(1.2, 1.4, 1);
  if (o.stache) head.add(rbox(.07 * hs, .018 * hs, .02, .008, o.hair || '#3b2a20', 0, -.033 * hs, fz - .002));
  if (o.beard) head.add(sph(.1 * hs, o.hair || '#3b2a20', 0, -.06 * hs, .03, 1, .7, .9, 16));
  if (o.glasses) {
    const gm = M(o.glasses);
    for (const s of [-1, 1]) { const r = new THREE.Mesh(new THREE.TorusGeometry(.03 * hs, .0045 * hs, 6, 24), gm); r.position.set(s * .043 * hs, .012 * hs, fz + .01); head.add(r); }
    head.add(box(.025 * hs, .004 * hs, .004, o.glasses, 0, .016 * hs, fz + .012));
  }
  const hc = o.hair || '#3b2a20', hst = o.hairStyle || 'short';
  if (hst !== 'bald') {
    head.add(sph(.132 * hs, hc, 0, .03 * hs, -.022 * hs, .93, 1.07, .98, 24));
    if (hst === 'bob') { const bb = cyl(.122 * hs, .132 * hs, .16 * hs, hc, 0, -.03 * hs, -.03 * hs, 24); bb.scale.z = .92; head.add(bb); }
    if (hst === 'long') head.add(rbox(.24 * hs, .34 * hs, .1, .05, hc, 0, -.1 * hs, -.07 * hs));
    if (hst === 'bun') head.add(sph(.06 * hs, hc, 0, .08 * hs, -.12 * hs, 1, 1, 1, 14));
    if (hst === 'side') head.add(sph(.06 * hs, hc, .05 * hs, .1 * hs, .06 * hs, 1.6, .5, 1, 14));
    if (hst === 'pony') head.add(capsule(.04 * hs, .14 * hs, hc, 0, -.04 * hs, -.15 * hs));
  } else head.add(sph(.128 * hs, hc, 0, -.01, -.03, .95, .8, .95, 20));
  if (o.cap) { head.add(cyl(.13 * hs, .13 * hs, .06, o.cap, 0, .1 * hs, 0)); head.add(box(.15 * hs, .012, .1, o.cap, 0, .075 * hs, .1 * hs)); head.add(sph(.02, '#e2c35a', 0, .11 * hs, .128 * hs, 1, 1, .4)); }
  if (o.bag) { const bg_ = rbox(.3, .32, .14, .05, o.bag, 0, hipY + tH * .6, -.17); body.add(bg_); }
  g.userData = { armL, armR, legL, legR, head, body, eyes, mouth, seed: (o.seed ?? Math.random() * 10) };
  return g;
}
export const sit = (p, h = .48) => { const u = p.userData; for (const l of [u.legL, u.legR]) { l.rotation.x = -Math.PI / 2; l.userData.knee.rotation.x = Math.PI / 2; } u.sitY = h - u.legL.position.y; p.position.y += u.sitY; u.sitting = true; return p; };
export const pose = (p, aL = [0, 0, 0], aR = [0, 0, 0], eL = 0, eR = 0) => { const u = p.userData; u.armL.rotation.set(...aL); u.armR.rotation.set(...aR); u.armL.userData.el.rotation.x = eL; u.armR.userData.el.rotation.x = eR; u.pose = [aL, aR, eL, eR]; return p; };
export function idle(p, t) { const u = p.userData; const s = u.seed; u.head.rotation.y = Math.sin(t * .7 + s) * .08; u.head.rotation.x = Math.sin(t * .9 + s * 2) * .03; u.body.position.y = Math.sin(t * 2.2 + s) * .004; blink(p, t); }
export function blink(p, t) { const u = p.userData; const ph = (t + u.seed * 1.3) % 3.7; const k = ph < .12 ? .15 : 1; u.eyes.forEach(e => e.scale.y = 1.25 * k); }
export function talk(p, t, on = true) { const u = p.userData; u.mouth.scale.y = on ? 1 + 2.2 * Math.abs(Math.sin(t * 11 + Math.sin(t * 3))) : 1; }
export function walk(p, t, sp = 7, amp = .45) {
  const u = p.userData; const a = Math.sin(t * sp) * amp;
  u.legL.rotation.x = a; u.legR.rotation.x = -a; u.legL.userData.knee.rotation.x = Math.max(0, -a) * .8; u.legR.userData.knee.rotation.x = Math.max(0, a) * .8;
  u.armL.rotation.x = -a * .8; u.armR.rotation.x = a * .8; u.body.position.y = Math.abs(Math.cos(t * sp)) * .025; blink(p, t);
}
export function wave(p, t, side = 'R') { const a = side === 'R' ? p.userData.armR : p.userData.armL; const s = side === 'R' ? 1 : -1; a.rotation.set(0, 0, s * 2.5); a.userData.el.rotation.set(0, 0, s * (.3 + Math.sin(t * 8) * .35)); }

// ---------- props ----------
export function room(o) {
  const g = new THREE.Group(); const w = o.w || 10, d = o.d || 8, h = o.h || 3.2;
  const fl = new THREE.Mesh(new THREE.PlaneGeometry(w, d), M('#fff', { map: o.floor || flat('#cdb9a6', 3) })); fl.rotation.x = -Math.PI / 2; fl.receiveShadow = true; g.add(fl);
  const back = new THREE.Mesh(new THREE.PlaneGeometry(w, h), M('#fff', { map: o.wallTex || flat(o.wall) })); back.position.set(0, h / 2, -d / 2); back.receiveShadow = true; g.add(back);
  for (const s of [-1, 1]) { const sd = new THREE.Mesh(new THREE.PlaneGeometry(d, h), M('#fff', { map: flat(o.side || o.wall) })); sd.rotation.y = -s * Math.PI / 2; sd.position.set(s * w / 2, h / 2, 0); sd.receiveShadow = true; g.add(sd); }
  g.add(box(w, .12, .04, o.trim || '#ffffff', 0, .06, -d / 2 + .02));
  if (o.ceil) { const c = new THREE.Mesh(new THREE.PlaneGeometry(w, d), M(o.ceil)); c.rotation.x = Math.PI / 2; c.position.y = h; g.add(c); }
  return g;
}
export function windowBlinds(w, h, x, y, z, o = {}) {
  const g = new THREE.Group();
  g.add(box(w + .12, h + .12, .06, o.frame || '#ffffff', 0, 0, 0));
  g.add(panel(w, h, canvasTex(256, 256, (c, W_, H_) => { const gr = c.createLinearGradient(0, 0, 0, H_); gr.addColorStop(0, o.sky1 || '#9ec9ef'); gr.addColorStop(1, o.sky2 || '#d9eef7'); c.fillStyle = gr; c.fillRect(0, 0, W_, H_); c.fillStyle = o.hill || '#8fc47e'; c.fillRect(0, H_ * .78, W_, H_); }), 0, 0, .035));
  if (o.blinds !== false) for (let i = 0; i < 9; i++) g.add(box(w, .022, .03, '#f4f4f2', 0, h / 2 - .05 - i * (h * .055), .06));
  g.add(box(.04, h, .02, o.frame || '#ffffff', 0, 0, .05), box(w, .04, .02, o.frame || '#ffffff', 0, 0, .05));
  if (o.curtain) for (const s of [-1, 1]) g.add(rbox(.32, h + .3, .08, .03, o.curtain, s * (w / 2 + .1), -.05, .1));
  return at(g, x, y, z);
}
export const NIGHT_WIN = { sky1: '#1a2348', sky2: '#2c3766', hill: '#1a2348' };
export function frame(w, h, x, y, z, draw, col = '#e9d9e6') { return G(box(w + .08, h + .08, .04, '#f8f6f2', x, y, z), panel(w, h, canvasTex(256, Math.max(32, 256 * h / w | 0), (g, W_, H_) => { g.fillStyle = col; g.fillRect(0, 0, W_, H_); draw && draw(g, W_, H_); }), x, y, z + .025)); }
export const smiley = (c = '#e8579a') => (g, w, h) => { g.fillStyle = '#f4c9a8'; g.beginPath(); g.arc(w / 2, h * .48, w * .2, 0, 7); g.fill(); g.fillStyle = c; g.fillRect(w * .3, h * .22, w * .4, h * .1); g.fillRect(w * .26, h * .72, w * .48, h * .22); g.fillStyle = '#333'; g.fillRect(w * .42, h * .46, 6, 6); g.fillRect(w * .56, h * .46, 6, 6); };
export function clock(x, y, z, r = .22) {
  const c = cyl(r, r, .05, '#ffffff', 0, 0, 0, 32); c.rotation.x = Math.PI / 2;
  const f = new THREE.Mesh(new THREE.CircleGeometry(r * .97, 32), M('#fff', { map: canvasTex(256, 256, (g) => { g.fillStyle = '#fff'; g.beginPath(); g.arc(128, 128, 120, 0, 7); g.fill(); g.strokeStyle = '#333'; g.lineWidth = 10; g.stroke(); g.lineWidth = 6; g.lineCap = 'round'; for (let i = 0; i < 12; i++) { const a = i / 12 * 6.283; g.beginPath(); g.moveTo(128 + Math.sin(a) * 96, 128 - Math.cos(a) * 96); g.lineTo(128 + Math.sin(a) * 108, 128 - Math.cos(a) * 108); g.stroke(); } }) }));
  f.position.z = .03;
  const hm = box(.012, r * .5, .01, '#333', 0, r * .22, .05), mn = box(.01, r * .75, .01, '#333', 0, r * .33, .055);
  const hp = G(hm), mp = G(mn); hp.position.z = 0; const g = G(c, f, hp, mp); g.userData.hands = [hp, mp];
  return at(g, x, y, z);
}
export const spinClock = (c, t, sp = 1) => { c.userData.hands[0].rotation.z = -t * sp * .3 - 1; c.userData.hands[1].rotation.z = -t * sp * 3.6; };
export function desk(w, d, x, z, c = '#7a4a2c', ry = 0) { const g = G(box(w, .06, d, c, 0, .76, 0)); for (const sx of [-1, 1]) for (const sz of [-1, 1]) g.add(box(.06, .76, .06, c, sx * (w / 2 - .06), .38, sz * (d / 2 - .06))); return at(g, x, 0, z, ry); }
export function chair(x, z, ry = 0, c = '#3c3f4a') { const g = G(rbox(.5, .08, .5, .03, c, 0, .46, 0), rbox(.5, .55, .07, .03, c, 0, .75, -.22), cyl(.03, .03, .42, '#555', 0, .23, 0), cyl(.25, .25, .03, '#555', 0, .02, 0)); return at(g, x, 0, z, ry); }
export function plant(x, z, s = 1) { return at(G(cyl(.16 * s, .12 * s, .3 * s, '#c9744e', 0, .15 * s, 0), sph(.28 * s, '#5e9e5a', 0, .55 * s, 0, 1, 1.2, 1), sph(.2 * s, '#6db368', .12 * s, .75 * s, .05, 1, 1.1, 1)), x, 0, z); }
export function tree(x, z, s = 1, c = '#4f9a4f') { return at(G(cyl(.12 * s, .16 * s, 1.6 * s, '#7a5236', 0, .8 * s, 0, 10), sph(1.1 * s, c, 0, 2.3 * s, 0), sph(.85 * s, '#5aa957', .7 * s, 2.0 * s, .3 * s), sph(.8 * s, '#468c48', -.6 * s, 2.1 * s, -.2 * s)), x, 0, z); }
export function palm(x, z, s = 1) { const g = G(); for (let i = 0; i < 6; i++) { const t = cyl(.1 * s, .13 * s, .7 * s, '#9a7a56', Math.sin(i * .3) * .1 * s, .35 * s + i * .66 * s, 0, 10); g.add(t); } for (let i = 0; i < 7; i++) { const l = sph(.9 * s, '#4f9a4f', 0, 0, 0, 1, .12, .3, 12); l.position.set(Math.cos(i / 7 * 6.28) * .7 * s, 4.1 * s, Math.sin(i / 7 * 6.28) * .7 * s); l.rotation.y = -i / 7 * 6.28; l.rotation.z = -.35; g.add(l); } return at(g, x, 0, z); }
export function house(x, z, o = {}) {
  const g = new THREE.Group(); const w = o.w || 8, d = o.d || 6, h = 2.8;
  const wall = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), M('#fff', { map: siding(o.wall || '#b9636a') })); wall.position.y = h / 2 + .3; wall.castShadow = wall.receiveShadow = true; g.add(wall);
  g.add(box(w + .2, .3, d + .2, '#d9d4cc', 0, .15, 0));
  const roof = new THREE.Mesh(new THREE.ConeGeometry(Math.hypot(w, d) / 2 * 1.08, 1.7, 4, 1), M(o.roof || '#5d5866')); roof.rotation.y = Math.PI / 4; roof.scale.set(1, 1, d / w); roof.position.y = h + .3 + .85; roof.castShadow = true; g.add(roof);
  g.add(box(1.0, 2.0, .08, '#fdfdfb', 0, 1.3, d / 2 + .02), box(.82, 1.85, .05, o.door || '#f5f2ec', 0, 1.25, d / 2 + .06));
  const win = o.night ? { blinds: false, sky1: '#ffd88a', sky2: '#ffc66a', hill: '#ffc66a' } : { blinds: false, sky1: '#3c5a86', sky2: '#6f8fbf', hill: '#3c5a86' };
  for (const s of [-1, 1]) { const wx = s * w * .3; g.add(windowBlinds(1.3, 1.1, wx, 1.9, d / 2 + .02, win)); g.add(box(.25, 1.25, .06, o.shutter || '#7d2f3d', wx - .8, 1.9, d / 2 + .05), box(.25, 1.25, .06, o.shutter || '#7d2f3d', wx + .8, 1.9, d / 2 + .05)); }
  if (o.porch !== false) { g.add(box(w * .7, .2, 1.6, '#c8a27a', 0, .4, d / 2 + .8)); for (const s of [-1, 1]) g.add(box(.1, 2.5, .1, '#f6f2ec', s * w * .33, 1.6, d / 2 + 1.5)); g.add(box(w * .72, .12, 1.8, '#eae6df', 0, 2.9, d / 2 + .85)); }
  if (o.wreath) { const t = new THREE.Mesh(new THREE.TorusGeometry(.18, .05, 8, 20), M('#3f8a48')); t.position.set(0, 1.75, d / 2 + .1); g.add(t); }
  return at(g, x, 0, z, o.ry || 0);
}
export function car(x, z, ry, c = '#3b5fa8', police) {
  const g = G(rbox(2.0, .55, 4.2, .2, c, 0, .55, 0), rbox(1.7, .5, 2.2, .18, police ? '#f6f6f4' : c, 0, 1.05, -.2));
  g.add(rbox(1.72, .36, 2.0, .1, '#9fb6d6', 0, 1.06, -.2));
  for (const sx of [-1, 1]) for (const sz of [-1.3, 1.3]) { const wh = cyl(.36, .36, .26, '#26262c', sx * .95, .36, sz, 18); wh.rotation.z = Math.PI / 2; g.add(wh); }
  if (police) { g.add(rbox(2.02, .3, 4.22, .1, '#1f2b4d', 0, .7, 0)); const r = box(.5, .14, .26, '#e53b3b', -.3, 1.38, -.2), b = box(.5, .14, .26, '#3b6be5', .3, 1.38, -.2); r.material = B('#ff4a4a'); b.material = B('#4a7bff'); g.add(r, b); g.userData.lights = [r, b]; }
  return at(g, x, 0, z, ry);
}
export function ground(c = '#7fbf6a', s = 240) { const m = new THREE.Mesh(new THREE.PlaneGeometry(s, s), M('#fff', { map: flat(c, 10) })); m.rotation.x = -Math.PI / 2; m.receiveShadow = true; return m; }
export function strip(w, d, c, x, z, y = .01, tex) { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), M('#fff', { map: tex || flat(c) })); m.rotation.x = -Math.PI / 2; m.position.set(x, y, z); m.receiveShadow = true; return m; }
export function clouds(y = 34, z = -110, a = .55) {
  const ct = canvasTex(1024, 256, (g) => { g.fillStyle = `rgba(255,255,255,${a})`; [[180, 120, 170, 22], [300, 100, 120, 18], [700, 150, 220, 20], [860, 128, 120, 16]].forEach(([x, y, rx, ry]) => { g.beginPath(); g.ellipse(x, y, rx, ry, 0, 0, 7); g.fill(); }); });
  const cl = new THREE.Mesh(new THREE.PlaneGeometry(220, 55), new THREE.MeshBasicMaterial({ map: ct, transparent: true, depthWrite: false, fog: false })); cl.position.set(0, y, z); return cl;
}
// the "Edison" box; screen texture can be swapped
export function edison(screen = 'EDISON', col = '#7fd0ff') {
  const scr = (t, c) => textTex([[t, 70, c, 128]], { bg: '#20252d', w: 512, h: 256 });
  const sp = panel(.44, .24, scr(screen, col), 0, .62, .295);
  const g = G(rbox(.7, .9, .55, .06, '#f4f4f4', 0, .45, 0), rbox(.5, .32, .02, .02, '#20252d', 0, .62, .28), sp, box(.4, .08, .3, '#d9dde2', 0, .1, .17), box(.6, .03, .02, '#e2e6ea', 0, .3, .28));
  g.userData.setScreen = (t, c) => { sp.material.map = scr(t, c); sp.material.needsUpdate = true; };
  return g;
}
export function syringe(s = 1) { return G(cyl(.05 * s, .05 * s, .5 * s, '#e8f3fa', 0, 0, 0, 16), cyl(.04 * s, .04 * s, .3 * s, '#e05a5a', 0, -.08 * s, 0, 12), cyl(.008 * s, .008 * s, .3 * s, '#c9ccd2', 0, -.4 * s, 0, 8), cyl(.07 * s, .07 * s, .02 * s, '#c9ccd2', 0, .26 * s, 0, 16), cyl(.02 * s, .02 * s, .16 * s, '#c9ccd2', 0, .34 * s, 0, 8)); }
export function tubeRack(n = 6) { const g = G(box(.12 * n + .1, .06, .2, '#dfe5ea', 0, .03, 0)); for (let i = 0; i < n; i++) g.add(cyl(.035, .035, .3, '#c0303a', (i - (n - 1) / 2) * .12, .2, 0, 12), cyl(.038, .038, .05, ['#5a7ae0', '#e0b35a', '#7ac06a'][i % 3], (i - (n - 1) / 2) * .12, .37, 0, 12)); return g; }
export function drop(s = 1) { const g = G(sph(.1 * s, '#d42a3a', 0, 0, 0, 1, 1, 1, 24)); const c = new THREE.Mesh(new THREE.ConeGeometry(.088 * s, .17 * s, 24), M('#d42a3a')); c.position.y = .1 * s; g.add(c); return g; }
export function money(n = 1, x = 0, z = 0) { const g = G(); for (let i = 0; i < n; i++) { const st = G(box(.6, .16, .28, '#7cb27a', 0, .08, 0), box(.1, .17, .29, '#e9e2c6', 0, .08, 0)); st.position.set((i % 3) * .66 - .66, Math.floor(i / 9) * .17, (Math.floor(i / 3) % 3) * .32 - .32); st.rotation.y = (i * 37 % 10) * .02; g.add(st); } return at(g, x, 0, z); }
export function bill() { return panel(.36, .16, flat('#8cc08a'), 0, 0, 0, 0); }
export function newspaper(head, sub = '', w = 1.2) {
  const t = canvasTex(800, 1040, (g, W, H) => { g.fillStyle = '#f6f3ea'; g.fillRect(0, 0, W, H); g.fillStyle = '#222'; g.textAlign = 'center'; g.font = FONT(60, 900); g.fillText('THE DAILY JOURNAL', W / 2, 90); g.fillRect(40, 120, W - 80, 6);
    g.font = FONT(64, 900); wrap(g, head, W / 2, 230, W - 100, 72); g.font = FONT(28, 800); g.fillStyle = '#555'; g.fillText(sub, W / 2, 470);
    g.fillStyle = '#c9c4b8'; g.fillRect(60, 520, 330, 260); for (let i = 0; i < 14; i++) g.fillRect(420, 520 + i * 34, 320 - (i % 3) * 40, 14); for (let i = 0; i < 6; i++) g.fillRect(60, 820 + i * 34, 680 - (i % 2) * 120, 14); noise(g, W, H, .03); });
  return panel(w, w * 1.3, t);
}
export function wrap(g, text, x, y, mw, lh) { const ws = text.split(' '); let line = ''; for (const w of ws) { const tst = line ? line + ' ' + w : w; if (g.measureText(tst).width > mw && line) { g.fillText(line, x, y); line = w; y += lh; } else line = tst; } g.fillText(line, x, y); }
export function heart(c = '#e8579a') { const s = new THREE.Shape(); s.moveTo(0, -.5); s.bezierCurveTo(-.9, .1, -.5, .9, 0, .4); s.bezierCurveTo(.5, .9, .9, .1, 0, -.5); const m = new THREE.Mesh(new THREE.ExtrudeGeometry(s, { depth: .15, bevelEnabled: true, bevelSize: .05, bevelThickness: .05, bevelSegments: 3 }), M(c)); m.castShadow = true; return m; }
export function laptop(c = '#c9ccd4', scr = '#8fb6e8') { return G(box(.5, .02, .34, c, 0, 0, 0), box(.5, .32, .02, c, 0, .16, -.16), panel(.46, .28, flat(scr), 0, .16, -.148)); }
export function bookshelf(w = 1.6, h = 2, c = '#8a5634') { const g = G(box(w, h, .35, c, 0, h / 2, 0)); const cols = ['#d64545', '#3f7a52', '#5c79c9', '#e2b84a', '#8a5ac9', '#e8579a']; for (let r = 0; r < 4; r++) { let x = -w / 2 + .1; let i = r * 5; while (x < w / 2 - .15) { const bw = .06 + (i * 7 % 5) * .015; g.add(box(bw, .3, .25, cols[i % 6], x + bw / 2, .2 + r * (h / 4) + .15, .06)); x += bw + .01; i++; } } return g; }
