// Extra props shared by the Fyre Festival and Blockbuster episodes (same soft pastel kit).
import { THREE, V, M, B, G, at, box, rbox, cyl, sph, capsule, panel, textTex, canvasTex, flat, sign, tag, ground, strip, clouds, palm, noise, FONT, rr, wrap, rng, clamp, lerp, ease, person, SKIN } from './kit.js';

export function sea(c = '#4fb3d9', s = 500) {
  const t = canvasTex(512, 512, (g, w, h) => { const r = rng(7); g.fillStyle = c; g.fillRect(0, 0, w, h); for (let i = 0; i < 220; i++) { g.fillStyle = 'rgba(255,255,255,.2)'; g.fillRect(r() * w, r() * h, 14 + r() * 16, 2); } }, [40, 40]);
  const m = new THREE.Mesh(new THREE.PlaneGeometry(s, s), M('#fff', { map: t })); m.rotation.x = -Math.PI / 2; m.position.y = -.06; m.receiveShadow = true; return m;
}
export function sand(w = 200, d = 30, x = 0, z = 0, c = '#f1dfb4') { return strip(w, d, c, x, z, .0, flat(c, 8)); }
// sandy island with palms, radius r
export function island(r = 8, palms = 6, seed = 3) {
  const g = G(); const s = cyl(r, r * 1.08, .5, '#f1dfb4', 0, -.2, 0, 40); g.add(s); g.add(cyl(r * .78, r * .82, .55, '#7dbd67', 0, -.12, 0, 40));
  const q = rng(seed); for (let i = 0; i < palms; i++) { const a = q() * 6.28, d = r * (.25 + q() * .45); g.add(palm(Math.cos(a) * d, Math.sin(a) * d, .7 + q() * .4)); }
  return g;
}
export function beach(o = {}) {
  const g = G(sea(o.sea), sand(220, 40, 0, 6, o.sand || '#f1dfb4'));
  const q = rng(o.seed || 5); for (let i = 0; i < (o.palms ?? 7); i++) g.add(palm(-16 + i * 5.2 + q() * 2, -3 - q() * 4, .8 + q() * .4));
  if (!o.night) g.add(clouds(30, -120)); return g;
}
export function jet(o = {}) {
  const c = o.c || '#f7f7f7', st = o.stripe || '#f26a21'; const g = G();
  const body = capsule(.9, 9, c, 0, 0, 0); body.rotation.x = Math.PI / 2; g.add(body);
  g.add(box(12, .14, 2.2, c, 0, -.35, .4), box(4.2, .12, 1.1, c, 0, .2, -4.9), box(.14, 2.1, 1.6, st, 0, 1.3, -5.0));
  for (const s of [-1, 1]) { const e = cyl(.32, .32, 1.3, '#d9dde2', s * 2.6, -.8, .9, 16); e.rotation.x = Math.PI / 2; g.add(e); }
  const nose = box(.9, .25, .4, '#2a3344', 0, .35, 5.15); g.add(nose);
  for (const s of [-1, 1]) { g.add(box(.02, .22, 7.5, st, s * .9, -.25, 0)); for (let i = 0; i < 16; i++) g.add(box(.02, .16, .2, '#2a3344', s * .905, .22, -3.6 + i * .5)); }
  if (o.name !== false) for (const s of [-1, 1]) { const n = sign(o.name || 'FYRE', { bg: 'none', fg: st, w: 2.2, px: 120 }); n.position.set(s * .92, .1, 1.2); n.rotation.y = s * Math.PI / 2; g.add(n); }
  if (o.gear) for (const [x, z] of [[0, 3.6], [-1.3, .2], [1.3, .2]]) { g.add(box(.08, .6, .08, '#888', x, -1.1, z)); const w = cyl(.25, .25, .2, '#26262c', x, -1.4, z, 14); w.rotation.z = Math.PI / 2; g.add(w); }
  return g;
}
export function yacht() {
  const g = G(rbox(2.6, 1.0, 9, .3, '#ffffff', 0, .5, 0), rbox(2.0, .8, 4.2, .2, '#f4f4f4', 0, 1.4, -.8), rbox(1.4, .6, 2.2, .2, '#f4f4f4', 0, 2.1, -1.2));
  g.add(box(2.04, .3, 3.6, '#2a3344', 0, 1.5, -.6), box(1.44, .24, 1.8, '#2a3344', 0, 2.15, -1.1), box(2.62, .12, 9.02, '#2f6db5', 0, .25, 0));
  const bow = new THREE.Mesh(new THREE.ConeGeometry(1.3, 2.4, 4), M('#ffffff')); bow.rotation.x = Math.PI / 2; bow.rotation.y = Math.PI / 4; bow.scale.set(1, 1, .38); bow.position.set(0, .55, 5.4); g.add(bow);
  return g;
}
export function phone(screen, o = {}) {
  const w = o.w || .5; const g = G(rbox(w, w * 2, .06, w * .12, o.c || '#1b1b20', 0, 0, 0));
  const mk = s => s instanceof THREE.Texture ? s : canvasTex(400, 800, (c, W, H) => { c.fillStyle = s || '#f2f2f2'; c.fillRect(0, 0, W, H); });
  const sp = panel(w * .9, w * 1.84, mk(screen), 0, 0, .032, 0, true); g.add(sp);
  g.userData.setScreen = s => { sp.material.map = mk(s); sp.material.needsUpdate = true; }; return g;
}
// instagram-style post with an orange square
export function postTex(user = 'supermodel', likes = '1.2M', col = '#f26a21', label = '') {
  return canvasTex(400, 800, (c, W, H) => { c.fillStyle = '#fff'; c.fillRect(0, 0, W, H); c.fillStyle = '#e0e0e0'; c.beginPath(); c.arc(50, 70, 26, 0, 7); c.fill(); c.fillStyle = '#222'; c.font = FONT(26, 800); c.textAlign = 'left'; c.fillText(user, 90, 80);
    c.fillStyle = col; c.fillRect(0, 120, W, W); if (label) { c.fillStyle = '#fff'; c.font = FONT(56, 900); c.textAlign = 'center'; c.fillText(label, W / 2, 120 + W / 2 + 20); }
    c.fillStyle = '#d63a5a'; c.font = FONT(40, 900); c.textAlign = 'left'; c.fillText('♥', 30, 580); c.fillStyle = '#222'; c.font = FONT(28, 800); c.fillText(likes + ' likes', 80, 578); c.fillStyle = '#9a9a9a'; c.font = FONT(24, 800); c.fillText('#fyrefestival', 30, 630); });
}
export function tent(c = '#f1efe8', o = {}) {
  const g = G(box(2.4, 1.3, 3, c, 0, .65, 0));
  const pr = new THREE.Shape(); pr.moveTo(-1.25, 0); pr.lineTo(0, .9); pr.lineTo(1.25, 0); pr.lineTo(-1.25, 0);
  const rm = new THREE.Mesh(new THREE.ExtrudeGeometry(pr, { depth: 3.04, bevelEnabled: false }), M(c)); rm.position.set(0, 1.3, -1.52); rm.castShadow = rm.receiveShadow = true; g.add(rm);
  g.add(box(.9, 1.1, .02, o.door || '#d9d4c6', 0, .58, 1.51)); if (o.label) { const s = sign(o.label, { bg: '#3a6fb0', fg: '#fff', w: .8 }); s.position.set(0, 1.55, 1.53); g.add(s); }
  return g;
}
export function mattress(c = '#e9e6f0', wet = true) { const g = G(rbox(1.0, .2, 1.9, .06, c, 0, .1, 0)); if (wet) { const p = new THREE.Mesh(new THREE.CircleGeometry(.35, 20), M('#9fb0c4')); p.rotation.x = -Math.PI / 2; p.position.set(.1, .205, .2); p.scale.set(1.2, .8, 1); g.add(p); } return g; }
export function suitcase(i = 0) { const cs = ['#d64545', '#3f7a52', '#5c79c9', '#e2b84a', '#8a5ac9', '#2e8a8a', '#e8579a', '#555']; const c = cs[i % 8]; const h = .55 + (i * 7 % 5) * .06; return G(rbox(.42, h, .25, .05, c, 0, h / 2, 0), box(.16, .04, .04, '#333', 0, h + .03, 0)); }
export function luggagePile(n = 14, seed = 4) { const g = G(); const q = rng(seed); for (let i = 0; i < n; i++) { const s = suitcase(i); s.position.set((q() - .5) * 2.6, i > 8 ? .3 + q() * .2 : 0, (q() - .5) * 1.8); s.rotation.set(i > 8 ? (q() - .5) * .9 : 0, q() * 3, i > 8 ? 1.4 : 0); g.add(s); } return g; }
export function foamBox(open = 1) {
  const g = G(box(.6, .14, .55, '#f4f2ea', 0, .07, 0)); const lid = G(box(.6, .1, .55, '#f1eee4', 0, .05, .275)); lid.position.set(0, .14, -.275); lid.rotation.x = -open * 1.9; g.add(lid); g.userData.lid = lid;
  const sw = G(box(.22, .03, .22, '#ead6a4', 0, .17, 0), box(.21, .012, .21, '#f2c84a', .01, .19, .01), box(.21, .012, .21, '#f6d25a', -.01, .205, -.01), box(.22, .03, .22, '#e3cc98', 0, .225, 0)); sw.position.x = -.12; g.add(sw);
  for (let i = 0; i < 5; i++) g.add(sph(.045, ['#7ac06a', '#5ea85a', '#9ad07a'][i % 3], .16 + (i % 2) * .05, .17, -.1 + i * .05, 1, .5, 1, 10));
  g.add(sph(.03, '#e05a5a', .18, .19, .12, 1, .7, 1, 10)); return g;
}
export function bus(c = '#f2f2f2', stripe = '#2f7de1') {
  const g = G(rbox(2.4, 2.6, 9, .3, c, 0, 1.6, 0), box(2.42, .5, 9.02, stripe, 0, .9, 0), box(2.42, .8, 7.2, '#2a3344', 0, 2.2, -.5), box(2.2, 1.1, .02, '#2a3344', 0, 2.1, 4.51));
  for (const sx of [-1, 1]) for (const sz of [-3, 3]) { const w = cyl(.45, .45, .3, '#26262c', sx * 1.15, .45, sz, 18); w.rotation.z = Math.PI / 2; g.add(w); } return g;
}
export function skyline(o = {}) {
  const g = G(); const q = rng(o.seed || 11); const night = o.night;
  const wt = (bc, lit) => canvasTex(128, 256, (c, w, h) => { c.fillStyle = bc; c.fillRect(0, 0, w, h); for (let i = 0; i < 4; i++) for (let j = 0; j < 10; j++) { c.fillStyle = lit && ((i * 7 + j * 3) % 4 === 0) ? '#ffd88a' : (night ? '#1d2a44' : '#a9c9e6'); c.fillRect(10 + i * 30, 10 + j * 24, 20, 14); } }, [1, 1]);
  for (let i = 0; i < (o.n || 26); i++) { const w = 3 + q() * 3, h = 8 + q() * 26, d = 3 + q() * 3; const bc = ['#c9b8d8', '#b9c6dc', '#d8c4b4', '#a8b4c8', '#e0d0c0'][i % 5]; const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), M('#fff', { map: wt(night ? '#3a3f5a' : bc, night) })); m.position.set(-55 + i * 4.3 + q(), h / 2, -20 - q() * 25); m.castShadow = m.receiveShadow = true; g.add(m); }
  return g;
}
// big card with lines of text (calendar / price board)
export function card(lines, o = {}) { return panel(o.w || 3, (o.w || 3) * (o.h || 512) / (o.cw || 1024), textTex(lines, { w: o.cw || 1024, h: o.h || 512, bg: o.bg || '#ffffff', draw: o.draw }), 0, 0, 0, 0, o.basic); }
export function calendar(top, big, sub = '', col = '#d63a3a') { return card([[top, 70, '#fff', 60], [big, 230, '#2a2a30', 270], [sub, 60, '#777', 440, 800]], { w: 1.6, cw: 512, h: 512, draw: (c, w) => { c.fillStyle = col; c.fillRect(0, 0, w, 120); } }); }
export function rain(g, n = 500, a = 16, top = 8, seed = 9) {
  const q = rng(seed); const pos = new Float32Array(n * 6); const base = []; for (let i = 0; i < n; i++) base.push([(q() - .5) * a, q() * top, (q() - .5) * a, .6 + q() * .5]);
  const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); const ls = new THREE.LineSegments(geo, new THREE.LineBasicMaterial({ color: '#cfe0f2', transparent: true, opacity: .55 })); ls.frustumCulled = false; g.add(ls);
  return lt => { for (let i = 0; i < n; i++) { const [x, y0, z, sp] = base[i]; const y = top - ((top - y0 + lt * 9 * sp) % top); pos.set([x, y, z, x - .03, y - .35, z], i * 6); } geo.attributes.position.needsUpdate = true; };
}
export function tv(tex, w = 1.6) { const g = G(rbox(w + .12, w * .6 + .12, .1, .03, '#1b1b20', 0, 0, 0)); const p = panel(w, w * .6, tex, 0, 0, .055, 0, true); g.add(p); g.userData.screen = p; return g; }
export function scaffold(w = 8, h = 5, d = 3, c = '#6a6f78') { const g = G(); for (let i = 0; i <= 4; i++) for (const z of [0, -d]) g.add(cyl(.06, .06, h, c, -w / 2 + i * w / 4, h / 2, z, 8)); for (const y of [h / 2, h]) for (const z of [0, -d]) g.add(box(w, .1, .1, c, 0, y, z)); for (let i = 0; i <= 4; i++) g.add(box(.1, .1, d, c, -w / 2 + i * w / 4, h, -d / 2)); return g; }
export function gravel(w = 120, c = '#cbbfa8') { return G(strip(w, w, c, 0, 0, 0, canvasTex(256, 256, (g, W, H) => { const q = rng(3); g.fillStyle = c; g.fillRect(0, 0, W, H); for (let i = 0; i < 900; i++) { g.fillStyle = q() < .5 ? 'rgba(90,80,70,.25)' : 'rgba(255,255,255,.25)'; g.fillRect(q() * W, q() * H, 3, 3); } }, [30, 30]))); }
export function puddle(r = 1, x = 0, z = 0) { const p = new THREE.Mesh(new THREE.CircleGeometry(r, 24), M('#8fa6be')); p.rotation.x = -Math.PI / 2; p.position.set(x, .015, z); p.scale.set(1.4, 1, 1); return p; }
export function crossTag(h = .6) { return tag('✕', { bg: '#d63a3a', fg: '#fff', h }); }
