// Props for the Anna Delvey story: rooms, buildings, jets, cars, money, papers, screens, palms, pools, court, jail.
import { THREE, M, E, mesh, box, rbox, cyl, sph, grp, V, clamp, ease, canvasTex, FONT, rrect, label, sign, floor, wall, rng } from './kit.js';

export function stage(fc = '#d8c3bd', wc = '#2a2f55', o = {}) {
  const g = grp(floor(o.w || 24, o.d || 18, fc)); if (wc) g.add(wall(o.w || 24, o.h || 10, wc, o.z ?? -4)); return g;
}
// room: back wall + left wall + floor, optional skirting
export function room(fc, wc, o = {}) {
  const w = o.w || 9, d = o.d || 8, h = o.h || 5; const g = grp(floor(w + 6, d + 6, fc));
  g.add(wall(w + 6, h, wc, o.z ?? -3)); if (o.side !== false) g.add(wall(d + 6, h, o.wc2 || wc, 0, o.sx ?? -4.2, Math.PI / 2));
  if (o.skirt) g.add(box(w + 6, .18, .06, o.skirt, 0, .09, (o.z ?? -3) + .09));
  return g;
}
export function windowPane(w, h, c = '#bfe0ff', frame = '#f2efe9', glow = 0) {
  const g = grp(box(w + .12, h + .12, .06, frame), mesh(new THREE.BoxGeometry(w, h, .02), glow ? E(c, glow) : M(c, { roughness: .2, metalness: .1 }), 0, 0, .03));
  g.add(box(.04, h, .03, frame, 0, 0, .04), box(w, .04, .03, frame, 0, 0, .04)); return g;
}
export function building(w, h, d, c, o = {}) {
  const g = grp(box(w, h, d, c, 0, h / 2, 0)); const r = rng(o.seed || 7);
  const cols = Math.max(1, Math.floor(w / (o.wx || .7))), rows = Math.max(1, Math.floor((h - .6) / (o.wy || .8)));
  const lit = o.lit ?? 0; const wm = M(o.win || '#9fc3e8', { roughness: .25 }), lm = E('#ffd98a', 1.3);
  for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) {
    const x = -w / 2 + (i + .5) * w / cols, y = .8 + j * (h - .9) / rows;
    g.add(mesh(new THREE.BoxGeometry(w / cols * .55, (h - .9) / rows * .55, .04), r() < lit ? lm : wm, x, y, d / 2 + .01, false));
  }
  if (o.roof) g.add(box(w + .2, .15, d + .2, o.roof, 0, h + .07, 0));
  return g;
}
export function skyline(n = 14, seed = 3, o = {}) {
  const g = new THREE.Group(); const r = rng(seed); const C = o.colors || ['#4a5675', '#5d6a8a', '#3d4766', '#6e7a99', '#55617f'];
  for (let i = 0; i < n; i++) {
    const w = .8 + r() * 1.2, h = 2 + r() * (o.hmax || 7); const b = building(w, h, .9, C[i % C.length], { seed: i + seed, lit: o.lit ?? .35, win: o.win || '#8fa9cc', wx: .35, wy: .5 });
    b.position.set(-((n - 1) * 1.15) / 2 + i * 1.15 + (r() - .5) * .3, 0, -r() * 2); g.add(b);
  }
  return g;
}
export function jet(c = '#f4f4f6', stripe = '#1f2a44') {
  const g = new THREE.Group(); const B = M(c, { flatShading: false, roughness: .35 }), S = M(stripe, { flatShading: false });
  const body = mesh(new THREE.CapsuleGeometry(.42, 3.6, 8, 18), B); body.rotation.z = Math.PI / 2; g.add(body);
  const nose = mesh(new THREE.ConeGeometry(.42, .9, 18), B, 2.65, 0, 0); nose.rotation.z = -Math.PI / 2; g.add(nose);
  g.add(mesh(new THREE.BoxGeometry(3.6, .06, .02), S, -.1, .05, .42), mesh(new THREE.BoxGeometry(3.6, .06, .02), S, -.1, .05, -.42));
  for (let i = 0; i < 6; i++) for (const z of [.4, -.4]) { const w = mesh(new THREE.SphereGeometry(.07, 10, 8), M('#1a2433', { roughness: .1 }), 1.2 - i * .5, .16, z); w.scale.set(1, .75, .4); g.add(w); }
  const wing = box(1.4, .06, 4.2, c, -.2, -.18, 0); wing.rotation.y = .0; g.add(wing);
  g.add(box(.9, .9, .06, c, -2.3, .7, 0), box(.7, .05, 1.6, c, -2.4, 1.1, 0));
  g.add(cyl(.18, .18, .9, '#cfd2d8', -1.4, .35, .6), cyl(.18, .18, .9, '#cfd2d8', -1.4, .35, -.6)); g.children.at(-1).rotation.z = Math.PI / 2; g.children.at(-2).rotation.z = Math.PI / 2;
  g.add(mesh(new THREE.BoxGeometry(.5, .2, .04), M('#1a2433', { roughness: .1 }), 2.35, .2, .3), mesh(new THREE.BoxGeometry(.5, .2, .04), M('#1a2433', { roughness: .1 }), 2.35, .2, -.3));
  return g;
}
export function stairs(n = 6, c = '#d9dbe0') { const g = new THREE.Group(); for (let i = 0; i < n; i++) g.add(box(.7, .12, .3, c, 0, .1 + i * .14, -i * .22)); g.add(box(.04, .9, 1.4, '#888', .38, .6, -.55).rotateX(-.55)); return g; }
export function car(c = '#2b2f3a', o = {}) {
  const g = new THREE.Group(); const B = M(c, { flatShading: false, roughness: .3, metalness: .3 });
  g.add(mesh(new RoundedBox(2.2, .5, 1.0, .16), B, 0, .42, 0));
  g.add(mesh(new RoundedBox(1.2, .42, .9, .14), B, -.15, .82, 0));
  g.add(mesh(new THREE.BoxGeometry(1.1, .32, .92), M('#1a2433', { roughness: .1 }), -.15, .84, 0));
  for (const x of [-.7, .7]) for (const z of [-.5, .5]) { const w = cyl(.2, .2, .14, '#16171b', x, .2, z, 16); w.rotation.x = Math.PI / 2; g.add(w); }
  g.add(mesh(new THREE.BoxGeometry(.04, .1, .25), E('#fff6d0', 1.5), 1.1, .5, .3), mesh(new THREE.BoxGeometry(.04, .1, .25), E('#fff6d0', 1.5), 1.1, .5, -.3));
  if (o.police) { g.add(box(.3, .12, .5, '#222', -.15, 1.1, 0)); const r = mesh(new THREE.BoxGeometry(.14, .1, .2), E('#ff2a3a', 2), -.15, 1.18, -.13), b = mesh(new THREE.BoxGeometry(.14, .1, .2), E('#2a6bff', 2), -.15, 1.18, .13); g.add(r, b); g.userData.siren = [r, b];
    const l = label('POLICE', { fg: '#1b2a55', size: 60, w: .8 }); l.position.set(-.1, .48, .505); g.add(l); }
  return g;
}
import { RoundedBoxGeometry as RoundedBox } from './node_modules/three/examples/jsm/geometries/RoundedBoxGeometry.js';
export function siren(c, lt) { if (!c.userData.siren) return; const k = Math.floor(lt * 6) % 2; c.userData.siren[0].material.emissiveIntensity = k ? 3 : .2; c.userData.siren[1].material.emissiveIntensity = k ? .2 : 3; }
export function palm(h = 3, seed = 1) {
  const g = new THREE.Group(); const r = rng(seed);
  for (let i = 0; i < 7; i++) { const s = cyl(.1 - i * .006, .12 - i * .006, h / 7, '#8b6a46', Math.sin(i * .5) * .08 * i * .2, h / 14 + i * h / 7, 0, 8); g.add(s); }
  for (let i = 0; i < 7; i++) { const a = i / 7 * Math.PI * 2 + r(); const f = mesh(new THREE.ConeGeometry(.18, 1.4, 4), '#2f8a4c', 0, 0, 0); f.scale.set(1, 1, .25);
    const p = grp(f); f.position.y = .7; f.rotation.set(0, 0, 0); p.rotation.set(0, a, 0); p.children[0].rotation.x = 1.75; p.children[0].position.set(0, .05, .62); p.position.set(.15, h, 0); g.add(p); }
  return g;
}
export function pool(w = 4, d = 2.2) {
  const g = grp(box(w + .5, .1, d + .5, '#efe6d6', 0, .05, 0));
  const water = mesh(new THREE.BoxGeometry(w, .04, d), M('#3fc2d9', { roughness: .08, metalness: .1, emissive: '#0f6f86', emissiveIntensity: .35 }), 0, .1, 0); g.add(water); g.userData.water = water; return g;
}
// a sheet of paper with a title and fake lines; o: title, big (big number text), stamp
export function paper(o = {}) {
  const t = canvasTex(420, 560, (c, w, h) => {
    c.fillStyle = '#fbfaf6'; c.fillRect(0, 0, w, h);
    if (o.head) { c.fillStyle = o.headC || '#1d3b6e'; c.fillRect(0, 0, w, 70); c.fillStyle = '#fff'; c.font = FONT(30); c.textAlign = 'center'; c.fillText(o.head, w / 2, 46); }
    c.textAlign = 'center'; c.fillStyle = '#1d2433'; if (o.title) { c.font = FONT(30); c.fillText(o.title, w / 2, 120); }
    if (o.big) { c.font = FONT(o.bigSize || 54); c.fillStyle = o.bigC || '#1d2433'; c.fillText(o.big, w / 2, 210); }
    c.fillStyle = '#c9ccd4'; for (let i = 0; i < 9; i++) c.fillRect(40, 260 + i * 28, (i % 3 === 2 ? 220 : 340), 10);
    if (o.sig) { c.strokeStyle = '#2b3e8c'; c.lineWidth = 4; c.beginPath(); c.moveTo(250, 510); c.bezierCurveTo(280, 470, 300, 540, 330, 500); c.bezierCurveTo(350, 480, 360, 520, 390, 505); c.stroke(); }
  });
  const m = new THREE.Mesh(new THREE.PlaneGeometry(.84, 1.12), new THREE.MeshStandardMaterial({ map: t, roughness: .9, side: THREE.DoubleSide })); m.castShadow = true; m.receiveShadow = true;
  if (o.stamp) { const s = label(o.stamp, { fg: o.stampC || '#d3263a', border: o.stampC || '#d3263a', size: 64, w: .62 }); s.position.set(0, -.12, .004); s.rotation.z = .25; s.visible = false; m.add(s); m.userData.stamp = s; }
  return m;
}
export function laptop(tex, c = '#c9ccd3') {
  const g = new THREE.Group(); g.add(rbox(1.1, .05, .75, .02, c, 0, .025, 0));
  const lid = grp(rbox(1.1, .72, .04, .02, c, 0, .36, 0)); const s = new THREE.Mesh(new THREE.PlaneGeometry(1.0, .62), new THREE.MeshBasicMaterial({ map: tex, toneMapped: false })); s.position.set(0, .37, .022); lid.add(s);
  lid.position.set(0, .05, -.37); lid.rotation.x = -.25; g.add(lid); g.userData.lid = lid; return g;
}
export function monitor(tex, w = 1.6, h = 1) {
  const g = grp(rbox(w + .1, h + .1, .08, .03, '#1a1c22', 0, 0, 0)); const s = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: tex, toneMapped: false })); s.position.z = .045; g.add(s);
  g.add(box(.1, .5, .08, '#1a1c22', 0, -h / 2 - .25, -.05), box(.6, .04, .35, '#1a1c22', 0, -h / 2 - .5, 0)); return g;
}
export function card(c = '#1d1f26', txt = '') {
  const t = canvasTex(320, 200, (x, w, h) => { const gr = x.createLinearGradient(0, 0, w, h); gr.addColorStop(0, c); gr.addColorStop(1, '#3a3f4f'); x.fillStyle = gr; rrect(x, 0, 0, w, h, 18); x.fill();
    x.fillStyle = '#e3c26a'; rrect(x, 30, 70, 50, 38, 6); x.fill(); x.fillStyle = '#fff'; x.font = FONT(22, 800); x.fillText('•••• •••• •••• 2017', 30, 150); x.font = FONT(20, 800); x.fillText(txt, 30, 182); });
  const m = new THREE.Mesh(new RoundedBox(.86, .54, .02, 2, .04), [M('#222'), M('#222'), M('#222'), M('#222'), new THREE.MeshStandardMaterial({ map: t, roughness: .4 }), M('#222')]); m.castShadow = true; return m;
}
export function terminal(state = 'ok') {
  const g = grp(rbox(.5, .9, .14, .05, '#2a2d35', 0, .45, 0));
  const t = canvasTex(200, 160, (c, w, h, s = state) => { c.fillStyle = s === 'no' ? '#c0283a' : s === 'ok' ? '#1f9d55' : '#203046'; c.fillRect(0, 0, w, h); c.fillStyle = '#fff'; c.font = FONT(s === 'wait' ? 30 : 34); c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(s === 'no' ? 'DECLINED' : s === 'ok' ? 'APPROVED' : 'PROCESSING', w / 2, h / 2); });
  const s = new THREE.Mesh(new THREE.PlaneGeometry(.38, .3), new THREE.MeshBasicMaterial({ map: t, toneMapped: false })); s.position.set(0, .68, .072); g.add(s);
  for (let i = 0; i < 9; i++) g.add(rbox(.09, .06, .02, .01, '#555a66', -.12 + (i % 3) * .12, .38 - (i / 3 | 0) * .09, .075)); g.userData.tex = t; return g;
}
// one green banknote; money(n) = flying bills group
export function note() { const t = noteTex(); const m = new THREE.Mesh(new THREE.PlaneGeometry(.5, .22), new THREE.MeshStandardMaterial({ map: t, side: THREE.DoubleSide, roughness: .8 })); m.castShadow = true; return m; }
let NT; function noteTex() { return NT || (NT = canvasTex(250, 110, (c, w, h) => { c.fillStyle = '#9fc59a'; c.fillRect(0, 0, w, h); c.strokeStyle = '#4f7a4b'; c.lineWidth = 6; c.strokeRect(6, 6, w - 12, h - 12); c.fillStyle = '#4f7a4b'; c.beginPath(); c.ellipse(w / 2, h / 2, 26, 34, 0, 0, 7); c.fill(); c.font = FONT(36); c.fillText('100', 16, 44); c.fillText('100', w - 80, h - 18); })); }
export function stack(n = 10, c) { const g = new THREE.Group(); for (let i = 0; i < n; i++) { const b = box(.5, .05, .22, '#8fb88a', 0, .025 + i * .05, 0); g.add(b); } g.add(box(.12, n * .05 + .005, .23, '#e6dcc0', 0, n * .025, 0)); return g; }
export function flyingNotes(n, seed = 5) {
  const g = new THREE.Group(); const r = rng(seed); const L = [];
  for (let i = 0; i < n; i++) { const m = note(); m.userData = { x: (r() - .5) * 4, z: (r() - .5) * 2.5, y0: 3 + r() * 3, sp: .6 + r() * .6, ph: r() * 6, d: r() * 1.5 }; g.add(m); L.push(m); }
  g.userData.upd = lt => L.forEach(m => { const u = m.userData; const t = Math.max(0, lt - u.d); m.visible = lt > u.d; m.position.set(u.x + Math.sin(t * 2 + u.ph) * .3, Math.max(.05, u.y0 - t * u.sp), u.z); m.rotation.set(t * 2 + u.ph, t + u.ph, Math.sin(t * 3) * .5); });
  return g;
}
export function counter(w = 3, c = '#6b4a35', top = '#e9e2d4') { return grp(box(w, 1.05, .7, c, 0, .52, 0), box(w + .1, .06, .8, top, 0, 1.08, 0)); }
export function door(c = '#5a3a28', w = 1.1, h = 2.3) { return grp(box(w + .2, h + .1, .1, '#e8e2d8', 0, (h + .1) / 2, 0), box(w, h, .12, c, 0, h / 2, .02), sph(.05, '#d8b04a', w * .35, h * .48, .1)); }
export function plant(h = 1) { return grp(cyl(.2, .15, .4, '#c8b9a6', 0, .2, 0), sph(.35 * h, '#3c8a55', 0, .55 + .2 * h, 0, 8), sph(.25 * h, '#4aa265', .15, .8 + .25 * h, .05, 8)); }
export function lampStand(c = '#ffe3a3') { return grp(cyl(.03, .03, 1.6, '#2b2b2b', 0, .8, 0), cyl(.2, .25, .1, '#2b2b2b', 0, .05, 0), mesh(new THREE.CylinderGeometry(.18, .28, .3, 16, 1, true), E(c, .9), 0, 1.65, 0)); }
export function bars(w = 3, h = 2.6, n = 9) { const g = new THREE.Group(); for (let i = 0; i < n; i++) g.add(cyl(.035, .035, h, '#5b6070', -w / 2 + i * w / (n - 1), h / 2, 0, 8)); g.add(box(w + .1, .08, .08, '#5b6070', 0, h, 0), box(w + .1, .08, .08, '#5b6070', 0, h * .45, 0)); return g; }
export function sofa(c = '#8a3b46') { return grp(rbox(2, .4, .9, .1, c, 0, .35, 0), rbox(2, .6, .25, .1, c, 0, .7, -.35), rbox(.25, .5, .9, .1, c, -.95, .55, 0), rbox(.25, .5, .9, .1, c, .95, .55, 0)); }
export function bed(c = '#f4f1ea', frame = '#6b4a35') { return grp(box(1.9, .4, 2.3, frame, 0, .2, 0), rbox(1.8, .25, 2.2, .08, c, 0, .52, 0), rbox(.6, .14, .35, .06, '#fff', -.42, .7, -.85), rbox(.6, .14, .35, .06, '#fff', .42, .7, -.85), box(1.95, 1.0, .12, frame, 0, .6, -1.15), rbox(1.82, .06, 1.1, .03, '#b8454f', 0, .66, .5)); }
export function table(r = .55, c = '#f4f1ea', h = .78) { return grp(cyl(r, r, .05, c, 0, h, 0, 24), cyl(.05, .05, h, '#333', 0, h / 2, 0, 8), cyl(.3, .3, .03, '#333', 0, .015, 0, 16)); }
export function glass(c = '#f3d36b') { return grp(cyl(.05, .03, .14, c, 0, .07, 0, 10), cyl(.006, .006, .12, '#ddd', 0, -.05, 0, 6)); }
export function frame(w, h, painter, fc = '#c9a54b') { const t = canvasTex(Math.round(w * 160), Math.round(h * 160), painter); const g = grp(box(w + .12, h + .12, .06, fc)); const p = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshStandardMaterial({ map: t, roughness: .8 })); p.position.z = .035; g.add(p); return g; }
export function abstractArt(seed) { return (c, w, h) => { const r = rng(seed); c.fillStyle = ['#f3ede2', '#1d2433', '#e8d5c0'][seed % 3]; c.fillRect(0, 0, w, h); for (let i = 0; i < 6; i++) { c.fillStyle = ['#e8505b', '#f5a623', '#4a90d9', '#1d2433', '#7ed321', '#ffd23f'][(i + seed) % 6]; c.beginPath(); if (r() < .5) c.arc(r() * w, r() * h, 10 + r() * w * .25, 0, 7); else c.rect(r() * w * .7, r() * h * .7, r() * w * .5, r() * h * .5); c.fill(); } }; }
export function phoneChat(lines, o = {}) {
  return (c, w, h, n = lines.length) => { c.fillStyle = '#f2f3f7'; c.fillRect(0, 0, w, h); c.fillStyle = '#ffffff'; c.fillRect(0, 0, w, 70); c.fillStyle = '#1d2433'; c.font = FONT(30); c.textAlign = 'center'; c.fillText(o.title || 'Anna', w / 2, 46); c.textAlign = 'left';
    let y = 100; lines.slice(0, n).forEach(([me, t]) => { c.font = FONT(24, 800); const tw = Math.min(w - 90, c.measureText(t).width + 36); const x = me ? w - tw - 18 : 18; c.fillStyle = me ? '#2f7cf6' : '#e3e5ec'; rrect(c, x, y, tw, 52, 20); c.fill(); c.fillStyle = me ? '#fff' : '#1d2433'; c.fillText(t, x + 18, y + 34); y += 66; }); };
}
