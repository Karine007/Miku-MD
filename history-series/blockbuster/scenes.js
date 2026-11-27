// Scenes for the Blockbuster episode (ids match anchors.json).
import { THREE, V, M, B, G, at, box, rbox, cyl, sph, capsule, panel, textTex, canvasTex, flat, checker, sign, tag, pop, person, sit, pose, idle, talk, walk, wave, blink, clock, desk, chair, plant, tree, car, money, newspaper, laptop, frame, ground, strip, clouds, room, lerp, ease, clamp, backOut, FONT, rr, SKIN, wrap, rng } from './kit.js';
import { dolly, extra, oldMan, office, court, dark, stage, studio, boardroom, newsroom } from './sets.js';
import { phone, card, calendar, tv, skyline, jet, crossTag } from './props2.js';

export const SCENES = []; const S = (id, build) => SCENES.push({ id, build });
const IN = ['#cfd8ea', '#ece9ef', '#f6efe8'], OUT = ['#7fb8ec', '#c4dff4', '#f4ecd8'], DUSK = ['#2a2f6a', '#7a5a9a', '#f0a07a'], NIGHT = ['#0f1630', '#22284a', '#3b3460'], PURPLE = ['#2a1f44', '#3a2b5c', '#4a3a6a'], GREY = ['#7d8796', '#a3abb6', '#c4c8cc'];
const BLUE = '#1f4fb8', YEL = '#f6c629', RED = '#d6283a', GREEN = '#2e8a4a', GOLD = '#c9902a', PINK = '#d63a7a';
// cast
const cook = (o = {}) => person(Object.assign({ skin: SKIN[0], hair: '#6b4a32', stache: 1, glasses: '#333', top: '#c9b38f', pants: '#4a3a2a', shirt: '#f4efe6', tie: '#7a1c2b', seed: 201 }, o));
const wayne = (o = {}) => person(Object.assign({ skin: SKIN[0], hair: '#b9b9be', top: '#2b2f3d', pants: '#2b2f3d', tie: '#c9a54b', seed: 202 }, o));
const reed = (o = {}) => person(Object.assign({ skin: SKIN[0], hair: '#3b2a20', top: '#5c79c9', pants: '#3a3a42', shirt: false, seed: 203 }, o));
const marc = (o = {}) => person(Object.assign({ skin: SKIN[0], hair: '#6b4a32', hairStyle: 'side', glasses: '#333', top: '#3f7a52', pants: '#c2ab84', shirt: false, seed: 204 }, o));
const antioco = (o = {}) => person(Object.assign({ skin: SKIN[0], hair: '#9a9aa2', hairStyle: 'side', top: '#22252e', pants: '#22252e', tie: RED, seed: 205 }, o));
const keyes = (o = {}) => person(Object.assign({ skin: SKIN[0], hair: '#5a4a3a', glasses: '#333', top: '#3a3f55', pants: '#3a3f55', tie: BLUE, seed: 206 }, o));
const clerk = (i, o = {}) => extra(i + 90, Object.assign({ top: BLUE, shirt: YEL }, o));
const fam = () => [extra(2, { top: '#d64545' }), extra(5, { top: '#3f7a52' }), person({ kid: true, skin: SKIN[0], hair: '#d8b06a', hairStyle: 'pony', top: '#e8579a', seed: 207 }), person({ kid: true, skin: SKIN[0], hair: '#6b4a32', top: '#e2b84a', seed: 208 })];
const spot = (g, x, y, z, tx, ty, tz, c = '#fff4e0', i = 40) => { const s = new THREE.SpotLight(c, i, 24, .5, .5); s.position.set(x, y, z); s.target.position.set(tx, ty, tz); g.add(s, s.target); return s; };
const fmt = n => '$' + Math.round(n).toLocaleString('en-US');
const TAPE = ['#d64545', '#3f7a52', '#5c79c9', '#e2b84a', '#8a5ac9', '#2e8a8a', '#e8579a', '#f08a3a', '#2a2a30'];
// ---- props ----
function storeSign(w = 6, txt = 'BLOCKBUSTER', sub = 'VIDEO') { return panel(w, w * .26, textTex([[txt, 128, BLUE, 125, 900], [sub, 54, BLUE, 215, 900]], { w: 1024, h: 266, bg: YEL, draw: (c, W, H) => { c.fillStyle = YEL; rr(c, 0, 0, W, H, 40); c.fill(); } }), 0, 0, 0, 0, true); }
function storefront(o = {}) {
  const g = G(); const lit = o.lit !== false; g.add(box(14, 5, 8, BLUE, 0, 2.5, -4)); g.add(box(14.2, .4, 8.2, '#163a8a', 0, 5.1, -4));
  const s = storeSign(6.5); s.position.set(0, 3.8, .02); g.add(s); g.userData.sign = s;
  const win = M(lit ? '#ffe9a8' : '#2a3048'); if (lit) win.emissive = new THREE.Color('#5a4a20');
  for (const x of [-4.5, 4.5]) g.add(mesh2(new THREE.BoxGeometry(4, 2.2, .1), win, x, 1.4, .02)); g.add(mesh2(new THREE.BoxGeometry(2, 2.6, .1), M(lit ? '#fff3c8' : '#22283c'), 0, 1.3, .03));
  if (o.closed) { const c = sign('CLOSED', { bg: RED, fg: '#fff', w: 1.4 }); c.position.set(0, 1.6, .1); g.add(c); }
  return g;
}
function mesh2(geo, mat, x, y, z) { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.castShadow = m.receiveShadow = true; return m; }
function lotGround(night) { return G(ground(night ? '#2f5a3a' : '#86c070'), strip(60, 18, night ? '#2c2e38' : '#7a7c84', 0, 8, .01), strip(60, 3, night ? '#5a5a62' : '#cfcac0', 0, 1.5, .015)); }
function shelf(n = 5, seed = 1, rows = 5, w = 2.4) {
  const g = G(box(w, 2.1, .4, '#e9e6ee', 0, 1.05, 0)); const q = rng(seed);
  for (let r = 0; r < rows; r++) { g.add(box(w, .04, .42, '#cfcad8', 0, .25 + r * .4, .02)); let x = -w / 2 + .08; while (x < w / 2 - .1) { const c = TAPE[(q() * 9) | 0]; g.add(box(.11, .3, .2, c, x + .055, .42 + r * .4, .12)); x += .14; } }
  return g;
}
function storeIn(o = {}) {
  const g = room({ w: 14, d: 12, h: 3.6, wall: '#2a55b8', side: '#2450a8', floor: checker('#f2f0ea', '#dfe3ec', 10), ceil: '#f4f4f6' });
  const s = storeSign(4, 'BLOCKBUSTER', o.sub || 'VIDEO'); s.position.set(0, 2.8, -5.95); g.add(s);
  for (let i = 0; i < 3; i++) for (const s2 of [-1, 1]) { const sh = shelf(5, i * 7 + (s2 + 2), 5, 3); sh.position.set(s2 * 1.6, 0, -3.8 + i * 3); sh.rotation.y = s2 * Math.PI / 2; g.add(sh); }
  for (let i = 0; i < 4; i++) { const sh = shelf(5, 30 + i); sh.position.set(-5.2 + i * 3.5, 0, -5.7); g.add(sh); }
  for (let i = 0; i < 4; i++) g.add(box(2.6, .05, .5, '#ffffff', -4.5 + i * 3, 3.55, -1)); return g;
}
function counter() { const g = G(box(3.6, 1, .8, BLUE, 0, .5, 0), box(3.7, .06, .9, YEL, 0, 1.02, 0), box(.5, .4, .4, '#2a2a30', -1, 1.25, 0)); const pc = G(box(.5, .3, .02, '#3a3a40', 0, 1.3, -.05)); g.add(pc);
  for (let i = 0; i < 6; i++) g.add(box(.18, .25, .12, ['#e86a6a', '#f0c35a', '#7ac06a', '#c58ae8'][i % 4], .6 + (i % 3) * .22, 1.17, -.15 + Math.floor(i / 3) * .2)); return g; }
function vhs(label = '', c = '#1d1d22') { const g = G(rbox(1.9, .25, 1.05, .04, c, 0, 0, 0)); g.add(box(1.0, .01, .5, '#f4f4f4', 0, .13, .1)); for (const x of [-.4, .4]) { const r = cyl(.17, .17, .012, '#ddd', x, .13, -.2, 20); g.add(r); }
  if (label) { const s = panel(1.0, .5, textTex([[label, 64, '#d6283a', 128]], { w: 512, h: 256, bg: '#fffbe6' }), 0, .14, .1); s.rotation.x = -Math.PI / 2; g.add(s); } return g; }
function envelope(s = 1, txt = 'NETFLIX') { const g = G(box(1.2 * s, .02 * s, .62 * s, '#d6283a', 0, 0, 0)); const p = panel(1.1 * s, .55 * s, textTex([[txt, 120, '#fff', 130]], { w: 1024, h: 260, bg: '#d6283a' }), 0, .012 * s, 0); p.rotation.x = -Math.PI / 2; g.add(p); return g; }
function upEnvelope(s = 1, txt) { const e = envelope(s, txt); e.rotation.x = Math.PI / 2; return e; }
function crt(tex) { const g = G(rbox(.9, .75, .8, .06, '#e8e2d4', 0, 0, 0)); const p = panel(.72, .54, tex, 0, .02, .405, 0, true); g.add(p, box(1.1, .06, .5, '#e0dacc', 0, -.45, .5)); g.userData.screen = p; return g; }
function kiosk() { const g = G(box(1.4, 2.2, .8, RED, 0, 1.1, 0), box(1.42, .4, .82, '#b81f30', 0, 2.0, 0)); const sc = panel(.6, .4, textTex([['$1', 150, '#fff', 128]], { w: 384, h: 256, bg: '#2a2a30' }), -.25, 1.3, .41, 0, true); g.add(sc, box(.3, .05, .1, '#222', .35, 1.0, .42), box(.3, .05, .1, '#222', .35, 1.5, .42)); return g; }
function worldMap() { return canvasTex(2048, 1024, (c, w, h) => { c.fillStyle = '#9ec9e8'; c.fillRect(0, 0, w, h); c.fillStyle = '#e9e2cf'; [[420, 330, 300, 190], [560, 720, 150, 230], [1050, 300, 170, 120], [1110, 640, 170, 230], [1500, 330, 360, 190], [1700, 760, 140, 90]].forEach(([x, y, rx, ry]) => { c.beginPath(); c.ellipse(x, y, rx, ry, 0, 0, 7); c.fill(); }); }); }
const PINS = (() => { const q = rng(21); const a = []; const C = [[420, 330, 300, 190], [560, 720, 150, 230], [1050, 300, 170, 120], [1110, 640, 170, 230], [1500, 330, 360, 190], [1700, 760, 140, 90]]; for (let i = 0; i < 160; i++) { const [x, y, rx, ry] = C[i < 70 ? 0 : (i % 6)]; const t = q() * 6.28, r = Math.sqrt(q()) * .85; a.push([(x + Math.cos(t) * rx * r) / 2048, (y + Math.sin(t) * ry * r) / 1024]); } return a; })();
function mapScene(o = {}) {
  const g = dark('#1e2a4a'); const m = panel(8, 4, worldMap(), 0, 0, 0); m.rotation.x = -Math.PI / 2; m.position.y = .02; g.add(m);
  const pins = PINS.slice(0, o.n || 160).map(([u, v]) => { const p = G(cyl(.03, .03, .25, '#ffffff', 0, .12, 0, 6), sph(.07, YEL, 0, .27, 0, 1, 1, 1, 10)); p.position.set(-4 + u * 8, 0, -2 + v * 4); g.add(p); return p; });
  g.userData.pins = pins; return g;
}
const counterCard = (top, col = BLUE) => { const c = card([[top, 70, '#fff', 70], ['0', 220, '#fff', 280]], { w: 3.2, cw: 1024, h: 420, bg: col }); c.userData.top = top; c.userData.col = col; return c; };
function setCounter(c, s) { if (c.userData.s === s) return; c.userData.s = s; const t = c.material.map, x = t.userData.ctx, cv = t.userData.canvas; x.fillStyle = c.userData.col; x.fillRect(0, 0, cv.width, cv.height); x.fillStyle = '#fff'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.font = FONT(70); x.fillText(c.userData.top, cv.width / 2, 70); x.font = FONT(200); x.fillText(s, cv.width / 2, 270); t.needsUpdate = true; }
function townStreet(o = {}) { const g = lotGround(o.night); const sf = storefront(o); g.add(sf); g.userData.store = sf; g.add(tree(-10, -2, 1.1), tree(10, -3, 1)); if (!o.night) g.add(clouds()); return g; }
function mountains() { const g = G(); [[-30, -60, 18, 22], [0, -70, 24, 30], [30, -62, 16, 20]].forEach(([x, z, r, h]) => { const m = new THREE.Mesh(new THREE.ConeGeometry(r, h, 6), M('#8a9ab8')); m.position.set(x, h / 2, z); g.add(m); const sn = new THREE.Mesh(new THREE.ConeGeometry(r * .3, h * .3, 6), M('#ffffff')); sn.position.set(x, h * .85, z); g.add(sn); }); return g; }

// ================= HOOK =================
S('h_friday', () => {
  const g = townStreet({ night: true }); const c = car(-10, 8, Math.PI / 2, '#d64545'); g.add(c);
  return { g, sky: NIGHT, night: true, pill: 'FRIDAY NIGHT', pillColor: BLUE, focus: V(0, 2, 0), cam: dolly(V(-6, 2, 16), V(-2, 2.4, 14), V(0, 2.5, 0)), upd: lt => { c.position.x = -12 + ease(clamp(lt / 4)) * 10; } };
});
S('h_store', () => {
  const g = townStreet(); const f = fam(); f.forEach((p, i) => g.add(at(p, -1.5 + i * .9, 0, 4)));
  return { g, sky: OUT, pill: 'BLUE & YELLOW', pillColor: BLUE, focus: V(0, 2, 0), cam: dolly(V(0, 2.4, 14), V(0, 2.8, 11), V(0, 3, 0)), upd: lt => f.forEach((p, i) => { walk(p, lt + i, 7, .4); p.position.z = 4 - lt * .7; p.rotation.y = Math.PI; }) };
});
S('h_peak', () => {
  const g = mapScene(); const pins = g.userData.pins; const c = counterCard('STORES'); c.position.set(0, .9, -2.7); c.rotation.x = -.6; g.add(c);
  return { g, sky: PURPLE, dim: .8, focus: V(0, 0, 0), cam: dolly(V(0, 5.5, 5.5), V(0, 5, 4.6), V(0, 1.3, -1.1)), upd: lt => { const k = clamp(lt / 3.5); pins.forEach((p, i) => p.visible = i / pins.length < k); setCounter(c, Math.round(k * 9000).toLocaleString('en-US') + (k >= 1 ? '+' : '')); } };
});
S('h_two', () => {
  const g = boardroom(); const r = reed(), m = marc(); g.add(r, m);
  return { g, sky: IN, pill: 'TWO MEN WALK IN', pillColor: RED, focus: V(0, 1.2, -1), cam: dolly(V(2.4, 1.7, 3.4), V(1.6, 1.7, 3.0), V(0, 1.3, -1)), upd: lt => { [r, m].forEach((p, i) => { walk(p, lt + i); p.position.set(-.5 + i * .9, 0, 2.4 - ease(clamp(lt / 3)) * 2.2); p.rotation.y = Math.PI; }); } };
});
S('h_laugh', () => {
  const g = boardroom(); const ex = [antioco(), oldMan(0), oldMan(1), oldMan(3)]; ex.forEach((p, i) => { g.add(sit(at(p, -2 + i * 1.3, 0, -1.9, 0))); });
  return { g, sky: IN, pill: 'THEY LAUGHED', pillColor: RED, focus: V(0, 1.2, -1.9), cam: dolly(V(0, 1.5, 2.6), V(0, 1.4, 2.0), V(0, 1.2, -1.9)), upd: lt => ex.forEach((p, i) => { idle(p, lt); p.userData.body.position.y = Math.abs(Math.sin(lt * 9 + i)) * .03; p.userData.head.rotation.x = -.15 - Math.abs(Math.sin(lt * 9 + i)) * .1; talk(p, lt); }) };
});
S('h_netflix', () => {
  const g = dark('#140c10'); const e = upEnvelope(2.6); e.position.set(0, 1.7, 0); g.add(e); spot(g, 0, 5, 4, 0, 1.7, 0, '#fff4e0', 70);
  return { g, sky: ['#1a0a0e', '#2a1016', '#3a1820'], dim: .5, pill: 'NETFLIX', pillColor: RED, pillAt: .8, focus: V(0, 1.7, 0), cam: dolly(V(0, 1.7, 4.4), V(0, 1.7, 3.2), V(0, 1.7, 0)), upd: lt => { e.rotation.y = Math.sin(lt * .8) * .3; } };
});
S('h_title', () => {
  const g = townStreet({ night: true });
  return { g, sky: NIGHT, night: true, title: ['BLOCKBUSTER', 'RISE & RUIN'], focus: V(0, 2, 0), cam: dolly(V(-3, 2.2, 16), V(3, 2.4, 15), V(0, 5.6, 0)) };
});

// ================= START =================
S('s_dallas', () => {
  const g = G(ground('#c9b98f'), skyline({ n: 20, seed: 4 }), strip(200, 10, '#7a7c84', 0, 4, .01)); const c = calendar('DALLAS, TEXAS', '1985', '', BLUE); c.position.set(0, 3.2, 6); g.add(c);
  return { g, sky: OUT, focus: V(0, 4, -10), cam: dolly(V(0, 3, 12), V(0, 3.4, 10.5), V(0, 4, -10), V(0, 3.6, 0)), upd: lt => pop(c, lt, .4) };
});
S('s_cook', () => {
  const g = townStreet(); const p = cook(); g.add(at(p, 1.2, 0, 2.5, -.2)); pose(p, [0, 0, .1], [-.8, 0, -.4], 0, -.9);
  return { g, sky: OUT, name: ['DAVID COOK', 'FOUNDER · 1985'], focus: V(1, 1.4, 2), cam: dolly(V(-.2, 1.6, 5.4), V(.4, 1.6, 4.6), V(1.1, 1.5, 2.5)), upd: lt => { idle(p, lt); talk(p, lt); } };
});
S('s_small', () => {
  const g = room({ w: 6, d: 5, h: 2.6, wall: '#5a4a3a', side: '#4e4032', floor: flat('#6a5a4a', 2) }); const sh = shelf(4, 50, 4, 2.4); sh.position.set(0, 0, -2.2); g.add(sh); const lt0 = new THREE.PointLight('#ffcf8a', 3, 6); lt0.position.set(0, 2.2, 0); g.add(lt0);
  for (let i = 0; i < 6; i++) g.add(at(G(box(.2, .3, .12, TAPE[i], 0, .15, 0)), -1 + i * .4, 0, -1 + (i % 2) * .3, i));
  return { g, sky: PURPLE, dim: .45, pill: 'SMALL, DARK & MESSY', pillColor: '#6a5a4a', focus: V(0, 1, -1.5), cam: dolly(V(.6, 1.6, 2.4), V(.2, 1.5, 1.8), V(0, 1.1, -2)) };
});
S('s_big', () => {
  const g = storeIn(); const f = [extra(3), extra(8), extra(11)]; f.forEach((p, i) => g.add(at(p, -2.4 + i * 2.4, 0, 1 + (i % 2), Math.PI)));
  return { g, sky: IN, pill: 'HUGE & BRIGHT', pillColor: BLUE, focus: V(0, 1.4, -2), cam: dolly(V(0, 2.4, 6), V(0, 2.1, 4.6), V(0, 1.6, -4)), upd: lt => f.forEach(p => idle(p, lt)) };
});
S('s_comp', () => {
  const tex = canvasTex(480, 360, (c, w, h) => { c.fillStyle = '#0a2a14'; c.fillRect(0, 0, w, h); c.fillStyle = '#5aff8a'; c.font = '24px monospace'; ['TAPE #00417  TOP GUN', 'STATUS: IN STORE', 'TAPE #00418  GHOSTBUSTERS', 'STATUS: RENTED', 'TAPE #00419  BACK TO..', 'STATUS: IN STORE', '> _'].forEach((s, i) => c.fillText(s, 20, 40 + i * 44)); });
  const g = dark('#2a3048'); const c = crt(tex); c.position.set(-.4, 1.3, 0); g.add(c, box(2.4, .05, 1.2, '#8a5634', 0, .82, .2)); const t = vhs(); t.scale.setScalar(.35); t.position.set(.75, .9, .3); g.add(t); spot(g, 0, 5, 3, 0, 1.2, 0, '#fff4e0', 60);
  const bc = panel(.5, .2, canvasTex(256, 100, (x, w, h) => { x.fillStyle = '#fff'; x.fillRect(0, 0, w, h); x.fillStyle = '#000'; for (let i = 0; i < 40; i++) if ((i * 7) % 3) x.fillRect(10 + i * 6, 10, (i % 3) + 1, 80); }), .75, .99, .3); bc.rotation.x = -Math.PI / 2; g.add(bc);
  return { g, sky: PURPLE, dim: .6, pill: 'EVERY TAPE TRACKED', pillColor: GREEN, focus: V(0, 1.2, 0), cam: dolly(V(.8, 1.6, 2.6), V(.3, 1.5, 2.0), V(0, 1.2, 0)) };
});
S('s_name', () => {
  const g = townStreet(); const s = g.userData.store.userData.sign;
  return { g, sky: OUT, focus: V(0, 3, 0), cam: dolly(V(0, 3.4, 9), V(0, 3.6, 7.4), V(0, 3.7, 0)), upd: lt => pop(s, lt, .3, .6) };
});

// ================= GROWTH =================
S('g_wayne', () => {
  const g = office({ wall: '#d9d0c4', curtain: '#c9a54b' }); const w = wayne(); g.add(at(w, .2, 0, -.4, -.15)); pose(w, [0, 0, .1], [-.8, 0, -.4], 0, -1);
  return { g, sky: IN, name: ['WAYNE HUIZENGA', 'BUSINESSMAN'], focus: V(0, 1.3, -.4), cam: dolly(V(-.8, 1.6, 3), V(-.3, 1.6, 2.3), V(.2, 1.5, -.4)), upd: lt => { idle(w, lt); talk(w, lt); } };
});
S('g_speed', () => {
  const g = mapScene({ n: 120 }); const pins = g.userData.pins;
  return { g, sky: PURPLE, dim: .8, pill: 'NEW STORES EVERYWHERE', pillColor: BLUE, focus: V(0, 0, 0), cam: dolly(V(-3, 4, 4), V(2, 4, 4), V(0, 0, -.5)), upd: lt => pins.forEach((p, i) => pop(p, lt, i * .03, .25)) };
});
S('g_17', () => {
  const g = dark('#2a3048'); const ck = clock(-1.2, 1.8, 0, .7); g.add(ck); const sf = storefront(); sf.scale.setScalar(.18); sf.position.set(1.3, .9, 0); g.add(sf, box(1.6, .05, 1.4, '#86c070', 1.3, .88, -.6)); spot(g, 0, 5, 4, 0, 1.4, 0, '#fff4e0', 60);
  const t = tag('EVERY 17 HOURS', { bg: YEL, fg: BLUE, h: .4 }); t.position.set(0, 2.9, 0); g.add(t);
  return { g, sky: PURPLE, dim: .6, focus: V(0, 1.6, 0), cam: dolly(V(0, 1.8, 5), V(0, 1.8, 4.2), V(0, 1.7, 0)), upd: lt => { ck.userData.hands[1].rotation.z = -lt * 8; ck.userData.hands[0].rotation.z = -lt * .7; pop(t, lt, .4); sf.scale.setScalar(.18 * backOut(clamp((lt % 1.6) / .5))); } };
});
S('g_viacom', () => {
  const g = boardroom(); const w = wayne(), v = oldMan(2); g.add(at(w, -.45, 0, -.2, .9), at(v, .45, 0, -.2, -.9)); pose(w, [0, 0, .1], [-1.2, -.6, -.1], 0, -.3); pose(v, [-1.2, .6, .1], [0, 0, -.1], -.3, 0);
  return { g, sky: IN, pill: 'SOLD FOR $8.4 BILLION', pillColor: GREEN, pillAt: .8, focus: V(0, 1.2, -.2), cam: dolly(V(-.6, 1.6, 3), V(0, 1.6, 2.4), V(0, 1.3, -.2)), upd: lt => { idle(w, lt); idle(v, lt); const s = Math.sin(lt * 9) * .08; w.userData.armR.rotation.x = -1.2 + s; v.userData.armL.rotation.x = -1.2 + s; } };
});

// ================= FRIDAY =================
S('f_ritual', () => {
  const g = townStreet({ night: true }); const f = fam(); f.forEach((p, i) => g.add(p));
  return { g, sky: DUSK, dim: .8, pill: 'A FRIDAY RITUAL', pillColor: GOLD, focus: V(0, 1.5, 1), cam: dolly(V(3, 1.8, 9), V(1.5, 1.8, 7.5), V(0, 1.6, 0)), upd: lt => f.forEach((p, i) => { walk(p, lt + i, 7, .4); p.position.set(-1.2 + i * .8, 0, 5 - lt * .8); p.rotation.y = Math.PI; }) };
});
S('f_aisles', () => {
  const g = storeIn(); const f = fam(); f.forEach((p, i) => g.add(p));
  return { g, sky: IN, pill: 'WALKING THE AISLES', pillColor: BLUE, focus: V(0, 1.2, 0), cam: u => { const z = 4 - u * 4; return { p: V(0, 1.7, z + 2.6), l: V(0, 1.3, z - 2), fov: 44 }; }, upd: (lt, u) => f.forEach((p, i) => { walk(p, lt + i, 6, .35); p.position.set(-.3 + (i % 2) * .6, 0, 4 - u * 4 - Math.floor(i / 2) * .8); p.rotation.y = Math.PI; }) };
});
S('f_candy', () => {
  const g = storeIn(); const c = counter(); c.position.set(0, 0, 1.5); g.add(c); const k = clerk(1); g.add(at(k, 0, 0, .8)); const pop1 = G(cyl(.15, .11, .3, '#e8e2d4', 0, .15, 0, 16), sph(.16, '#fff3c8', 0, .32, 0, 1, .5, 1)); pop1.position.set(-.6, 1.05, 1.6); g.add(pop1);
  return { g, sky: IN, pill: 'POPCORN & CANDY', pillColor: RED, focus: V(0, 1.2, 1.4), cam: dolly(V(.8, 1.6, 4.4), V(.4, 1.5, 3.6), V(0, 1.2, 1.3)), upd: lt => { idle(k, lt); talk(k, lt); } };
});
S('f_new', () => {
  const g = storeIn(); const wall = G(box(6, 2.4, .2, '#f4f4f4', 0, 1.2, 0)); const q = rng(3); for (let r = 0; r < 4; r++) for (let i = 0; i < 16; i++) if (q() > .55) wall.add(box(.24, .4, .12, TAPE[(i + r) % 9], -2.8 + i * .37, .45 + r * .55, .14)); wall.position.set(0, 0, -2.8); g.add(wall);
  const s = sign('NEW RELEASES', { bg: RED, fg: '#fff', w: 2.6 }); s.position.set(0, 2.75, -2.68); g.add(s); const p = extra(6); g.add(at(p, .4, 0, -1.4, Math.PI)); pose(p, [0, 0, .1], [-1.6, 0, -.2], 0, -.2);
  return { g, sky: IN, pill: 'ALL GONE?', pillColor: RED, pillAt: 1.5, focus: V(0, 1.4, -2.6), cam: dolly(V(-.8, 1.7, 2.2), V(-.4, 1.6, 1.4), V(0, 1.5, -2.6)), upd: lt => idle(p, lt) };
});
S('f_rewind', () => {
  const g = dark('#2a3048'); const t = vhs('BE KIND, REWIND'); t.position.set(0, 1.4, 0); t.rotation.x = .9; g.add(t); spot(g, 0, 5, 3, 0, 1.4, 0, '#fff4e0', 70);
  return { g, sky: PURPLE, dim: .5, focus: V(0, 1.4, 0), cam: dolly(V(0, 1.9, 2.6), V(0, 1.8, 2.0), V(0, 1.45, 0)), upd: lt => { t.rotation.z = Math.sin(lt * .8) * .12; } };
});
S('f_late', () => {
  const g = dark('#2a3048'); const c = calendar('DUE', 'FRI', 'RETURNED: TUESDAY', RED); c.position.set(-.9, 1.6, 0); g.add(c); const t = tag('LATE FEE', { bg: RED, fg: '#fff', h: .5 }); t.position.set(1.1, 1.9, .2); g.add(t); spot(g, 0, 5, 4, 0, 1.6, 0, '#fff4e0', 60);
  return { g, sky: PURPLE, dim: .5, focus: V(0, 1.6, 0), cam: dolly(V(0, 1.6, 4), V(0, 1.6, 3.4), V(.1, 1.6, 0)), upd: lt => pop(t, lt, 1.2) };
});
S('f_fees', () => {
  const g = dark('#2a3048'); const m = money(27, 0, 0); m.position.y = .9; g.add(m, cyl(1.4, 1.5, .9, '#efe9f2', 0, .45, 0, 32)); spot(g, 0, 5, 3, 0, 1, 0, '#fff4e0', 60);
  return { g, sky: PURPLE, dim: .5, pill: "HUNDREDS OF MILLIONS A YEAR", pillColor: GREEN, focus: V(0, 1.2, 0), cam: dolly(V(0, 2.6, 4), V(0, 2.4, 3.4), V(0, 1.1, 0)), upd: lt => m.children.forEach((s, i) => { const k = clamp((lt - i * .08) / .3); s.visible = k > 0; s.scale.y = Math.max(.01, backOut(k)); }) };
});

// ================= NETFLIX =================
S('n_angry', () => {
  const g = storeIn(); const c = counter(); c.position.set(0, 0, 1.5); g.add(c); const k = clerk(2); g.add(at(k, 0, 0, .8)); const cs = [extra(13), extra(15)]; g.add(at(cs[0], -.5, 0, 2.4, Math.PI), at(cs[1], .5, 0, 2.6, Math.PI)); cs.forEach(p => pose(p, [0, 0, .1], [-1.4, 0, -.2], 0, -.5));
  return { g, sky: IN, pill: 'ANGRY CUSTOMERS', pillColor: RED, focus: V(0, 1.3, 1.8), cam: dolly(V(-1.6, 1.8, 0), V(-1.2, 1.7, -.2), V(0, 1.4, 2.2)), upd: lt => { idle(k, lt); cs.forEach((p, i) => { idle(p, lt); talk(p, lt); p.userData.armR.rotation.x = -1.4 + Math.sin(lt * 8 + i) * .3; }); } };
});
S('n_reed', () => {
  const g = office({ wall: '#e8dccf', curtain: '#d6283a' }); const r = reed(); g.add(at(r, .2, 0, -.4, -.15));
  return { g, sky: IN, name: ['REED HASTINGS', 'CO-FOUNDER · NETFLIX'], focus: V(0, 1.3, -.4), cam: dolly(V(-.8, 1.6, 3), V(-.3, 1.6, 2.3), V(.2, 1.5, -.4)), upd: lt => { idle(r, lt); talk(r, lt); } };
});
S('n_legend', () => {
  const g = dark('#2a3048'); const rc = card([['VIDEO RENTAL RECEIPT', 46, '#444', 60], ['LATE FEE', 80, '#222', 180], ['$40.00', 150, RED, 330]], { w: 1.4, cw: 600, h: 460, bg: '#fbfaf2' }); rc.position.set(0, 1.6, 0); g.add(rc); spot(g, 0, 5, 3, 0, 1.6, 0, '#fff4e0', 60);
  return { g, sky: PURPLE, dim: .5, pill: 'THE LEGEND', pillColor: GOLD, focus: V(0, 1.6, 0), cam: dolly(V(.3, 1.7, 2.6), V(0, 1.6, 2.0), V(0, 1.6, 0)), upd: lt => { rc.rotation.z = Math.sin(lt) * .05; } };
});
S('n_start', () => {
  const g = office({ wall: '#efe4cf', curtain: '#d6283a' }); const r = reed(), m = marc(); g.add(at(r, -.5, 0, -.3, .3), at(m, .6, 0, -.3, -.3)); const bx = []; for (let i = 0; i < 4; i++) { const b = box(.5, .35, .4, '#c9a27a', -2.6 + (i % 2) * .55, .175 + Math.floor(i / 2) * .35, -1.8); g.add(b); }
  const c = calendar('NETFLIX', '1997', '', RED); c.position.set(2.4, 2.0, -3.4); c.scale.setScalar(.6); g.add(c);
  return { g, sky: IN, name: ['MARC RANDOLPH', 'CO-FOUNDER · NETFLIX'], focus: V(0, 1.3, -.3), cam: dolly(V(-.4, 1.6, 3.4), V(0, 1.6, 2.6), V(0, 1.4, -.4)), upd: lt => { idle(r, lt); idle(m, lt); talk(m, lt, lt < 2); talk(r, lt, lt > 2); } };
});
S('n_web', () => {
  const tex = canvasTex(480, 360, (c, w, h) => { c.fillStyle = '#fff'; c.fillRect(0, 0, w, h); c.fillStyle = RED; c.fillRect(0, 0, w, 60); c.fillStyle = '#fff'; c.font = FONT(40); c.textAlign = 'center'; c.fillText('NETFLIX', w / 2, 44); for (let i = 0; i < 8; i++) { c.fillStyle = TAPE[i]; c.fillRect(30 + (i % 4) * 108, 90 + Math.floor(i / 4) * 130, 90, 110); } });
  const g = office({ wall: '#efe4cf', curtain: '#d6283a' }); const c = crt(tex); c.position.set(.3, 1.2, -1.2); c.rotation.y = .1; g.add(c);
  return { g, sky: IN, pill: 'PICK ONLINE', pillColor: RED, focus: V(0, 1.2, -1.2), cam: dolly(V(.9, 1.5, 1.2), V(.6, 1.4, .6), V(.3, 1.25, -1.2)) };
});
S('n_mail', () => {
  const g = townStreet(); const mb = G(cyl(.05, .05, 1.1, '#555', 0, .55, 0, 8), rbox(.4, .4, .7, .15, '#2f4a7a', 0, 1.25, 0)); mb.position.set(2, 0, 4); g.add(mb); const e = upEnvelope(.6); g.add(e);
  return { g, sky: OUT, pill: 'IN A RED ENVELOPE', pillColor: RED, focus: V(2, 1.2, 4), cam: dolly(V(4.6, 1.7, 7.6), V(3.8, 1.6, 6.8), V(2, 1.4, 4)), upd: lt => { const k = ease(clamp((lt - .3) / 1.2)); e.position.set(2, lerp(3.2, 1.75, k), 4.5); e.rotation.y = lerp(1.6, .5, k); } };
});
S('n_nofee', () => {
  const g = dark('#140c10'); const e = upEnvelope(1.8); e.position.set(0, 1.6, 0); g.add(e); const t = tag('NO LATE FEES', { bg: '#fff', fg: RED, h: .55 }); t.position.set(0, 2.6, .3); g.add(t); spot(g, 0, 5, 4, 0, 1.6, 0, '#fff4e0', 60);
  return { g, sky: ['#1a0a0e', '#2a1016', '#3a1820'], dim: .5, focus: V(0, 1.9, 0), cam: dolly(V(0, 1.9, 4.4), V(0, 1.9, 3.6), V(0, 1.95, 0)), upd: lt => { pop(t, lt, .4); e.rotation.y = Math.sin(lt) * .2; } };
});

// ================= OFFER =================
S('o_losing', () => {
  const g = dark('#2a3048'); const ch = card([['NETFLIX · 2000', 64, '#fff', 60]], { w: 3.2, cw: 1024, h: 560, bg: '#1d1d22', draw: (c, w, h) => { c.strokeStyle = RED; c.lineWidth = 14; c.beginPath(); [[80, 160], [260, 230], [420, 210], [600, 330], [780, 380], [940, 480]].forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.stroke(); } });
  ch.position.set(0, 1.7, 0); g.add(ch); spot(g, 0, 5, 4, 0, 1.7, 0, '#fff4e0', 60);
  return { g, sky: PURPLE, dim: .5, pill: 'LOSING MONEY', pillColor: RED, focus: V(0, 1.7, 0), cam: dolly(V(0, 1.7, 4.2), V(0, 1.7, 3.4), V(0, 1.7, 0)) };
});
S('o_fly', () => {
  const g = G(ground('#c9b98f'), clouds(20, -80)); const j = jet({ name: false, stripe: RED }); g.add(j);
  return { g, sky: OUT, pill: 'FLYING TO DALLAS', pillColor: BLUE, focus: V(0, 8, 0), cam: dolly(V(12, 9, 16), V(6, 9.5, 14), V(0, 8, 0), V(-4, 8, 0), 42), upd: lt => { j.position.set(-lt * 3 + 4, 8, 0); j.rotation.set(0, -Math.PI / 2, 0); } };
});
S('o_meet', () => {
  const g = boardroom(); const a = antioco(); g.add(sit(at(a, 0, 0, -1.9, 0))); const r = reed(), m = marc(); g.add(sit(at(r, -.7, 0, -.1, Math.PI)), sit(at(m, .7, 0, -.1, Math.PI)));
  return { g, sky: IN, name: ['JOHN ANTIOCO', 'CEO · BLOCKBUSTER'], focus: V(0, 1.2, -1.5), cam: dolly(V(2.6, 1.6, .6), V(2.1, 1.6, .2), V(0, 1.2, -1.5)), upd: lt => { idle(a, lt); idle(r, lt); idle(m, lt); } };
});
S('o_offer', () => {
  const g = boardroom(); const c = card([['NETFLIX', 90, '#fff', 90], ['$50,000,000', 120, '#fff', 250]], { w: 1.6, cw: 1024, h: 360, bg: RED }); c.rotation.x = -Math.PI / 2; c.position.set(0, .81, -1); g.add(c);
  const r = reed(); g.add(sit(at(r, -.7, 0, -.1, Math.PI))); pose(r, [-1.1, 0, .2], [0, 0, 0], -.5, 0);
  return { g, sky: IN, pill: 'BUY US FOR $50 MILLION', pillColor: RED, pillAt: 1.2, focus: V(0, 1, -1), cam: dolly(V(.3, 2.4, .9), V(.1, 2.2, .4), V(0, .8, -1)), upd: lt => idle(r, lt) };
});
S('o_laugh', () => {
  const g = boardroom(); const ex = [antioco(), oldMan(0), oldMan(1)]; ex.forEach((p, i) => g.add(sit(at(p, -1.3 + i * 1.3, 0, -1.9, 0))));
  const t = tag('HA HA HA', { bg: '#fff', fg: RED, h: .4 }); t.position.set(0, 2.4, -1.9); g.add(t);
  return { g, sky: IN, focus: V(0, 1.2, -1.9), cam: dolly(V(-1, 1.5, 2.4), V(0, 1.45, 1.8), V(0, 1.3, -1.9)), upd: lt => { pop(t, lt, .8); ex.forEach((p, i) => { idle(p, lt); p.userData.body.position.y = Math.abs(Math.sin(lt * 10 + i)) * .03; talk(p, lt); }); } };
});
S('o_no', () => {
  const g = dark('#2a3048'); const n = card([['NO.', 300, '#fff', 200]], { w: 3, cw: 900, h: 400, bg: BLUE }); n.position.set(0, 1.8, 0); g.add(n); spot(g, 0, 5, 4, 0, 1.8, 0, '#fff4e0', 60);
  return { g, sky: PURPLE, dim: .5, focus: V(0, 1.8, 0), cam: dolly(V(0, 1.8, 5), V(0, 1.8, 4.2), V(0, 1.8, 0)), upd: lt => pop(n, lt, .1) };
});

// ================= PEAK =================
S('p_why', () => {
  const g = G(ground('#86c070'), skyline({ n: 14, seed: 6 })); const t = box(8, 22, 8, BLUE, 0, 11, -8); g.add(t); const s = storeSign(6); s.position.set(0, 20, -3.98); g.add(s); g.add(clouds());
  return { g, sky: OUT, pill: 'WHY SAY YES?', pillColor: BLUE, focus: V(0, 6, -8), sun: [-6, 14, 8], cam: dolly(V(-6, 2, 18), V(-3, 4, 15), V(0, 14, -8), V(0, 15, -8), 46) };
});
S('p_peak', () => {
  const g = mapScene(); const c = counterCard('STORES · 2004', BLUE); c.position.set(0, .9, -2.7); c.rotation.x = -.6; g.add(c);
  return { g, sky: PURPLE, dim: .8, focus: V(0, 0, 0), cam: dolly(V(0, 5.5, 5.5), V(0, 5, 4.6), V(0, 1.3, -1.1)), upd: lt => setCounter(c, Math.round(clamp(lt / 2) * 9094).toLocaleString('en-US')) };
});
S('p_emp', () => {
  const g = dark('#24305a'); const ps = []; for (let r = 0; r < 4; r++) for (let i = 0; i < 9; i++) { const p = clerk(r * 9 + i); p.position.set(-3.2 + i * .8 + (r % 2) * .4, 0, -r * .9); g.add(p); ps.push(p); } spot(g, 0, 7, 5, 0, 1, -1.5, '#fff4e0', 80);
  const t = tag('~84,000 EMPLOYEES', { bg: YEL, fg: BLUE, h: .45 }); t.position.set(0, 2.7, 0); g.add(t);
  return { g, sky: PURPLE, dim: .7, focus: V(0, 1, -1.4), cam: dolly(V(0, 2.2, 6), V(0, 2.1, 5.2), V(0, 1.3, -1.4)), upd: lt => { ps.forEach(p => idle(p, lt)); pop(t, lt, .5); } };
});
S('p_tiny', () => {
  const g = townStreet(); const e = upEnvelope(.4); e.position.set(0, .2, 5); g.add(e, box(.3, .05, .3, '#9a9aa2', 0, .02, 5));
  return { g, sky: OUT, pill: 'TINY NETFLIX', pillColor: RED, focus: V(0, .5, 4), cam: dolly(V(.6, .5, 7), V(.3, .8, 6.4), V(0, .3, 5), V(0, 2.4, 0), 44) };
});

// ================= FIGHT =================
S('x_danger', () => {
  const g = office({ wall: '#d9d0c4', curtain: '#8a5634' }); const a = antioco(); g.add(at(a, .3, 0, -.3, Math.PI)); const t = tv(textTex([['NETFLIX', 110, '#fff', 128]], { w: 512, h: 256, bg: RED }), 1.4); t.position.set(.3, 1.8, -3.3); g.add(t);
  return { g, sky: IN, pill: 'HE SAW THE DANGER', pillColor: RED, focus: V(0, 1.4, -2), cam: dolly(V(1.2, 1.7, 2.2), V(.9, 1.7, 1.6), V(.3, 1.7, -3)), upd: lt => idle(a, lt) };
});
S('x_online', () => {
  const g = office({ wall: '#d9d0c4', curtain: '#8a5634' }); const lp = laptop('#c9ccd4', BLUE); lp.scale.setScalar(2); lp.position.set(.3, .8, -1.2); g.add(lp);
  const s = sign('BLOCKBUSTER ONLINE', { bg: YEL, fg: BLUE, w: .8 }); s.position.set(.3, 1.12, -1.5); g.add(s);
  return { g, sky: IN, pill: 'BLOCKBUSTER ONLINE · 2004', pillColor: BLUE, focus: V(0, 1, -1.2), cam: dolly(V(1, 1.5, .8), V(.7, 1.4, .3), V(.3, 1.1, -1.4)) };
});
S('x_nofee', () => {
  const g = dark('#2a3048'); const c = card([['LATE FEES', 150, '#fff', 140]], { w: 3, cw: 1024, h: 280, bg: RED }); c.position.set(0, 1.8, 0); g.add(c); const x = box(3.2, .14, .02, '#1d1d22', 0, 1.8, .04); x.rotation.z = .12; x.userData.base = x.scale.clone(); g.add(x); spot(g, 0, 5, 4, 0, 1.8, 0, '#fff4e0', 60);
  return { g, sky: PURPLE, dim: .5, pill: 'THE END OF LATE FEES', pillColor: GREEN, focus: V(0, 1.8, 0), cam: dolly(V(0, 1.8, 4.6), V(0, 1.8, 3.8), V(0, 1.8, 0)), upd: lt => pop(x, lt, .7) };
});
S('x_cost', () => {
  const g = boardroom(); const ex = [oldMan(0), oldMan(2), oldMan(3)]; ex.forEach((p, i) => { g.add(at(p, -1.3 + i * 1.3, 0, -1.4)); pose(p, [0, 0, .1], [-1.6, 0, -.3], 0, -.4); });
  const ms = []; for (let i = 0; i < 10; i++) { const b = box(.36, .02, .16, '#8cc08a', 0, 0, 0); g.add(b); ms.push(b); }
  return { g, sky: IN, pill: 'INVESTORS FURIOUS', pillColor: RED, focus: V(0, 1.3, -1.4), cam: dolly(V(0, 1.7, 3), V(0, 1.6, 2.4), V(0, 1.4, -1.4)), upd: lt => { ex.forEach((p, i) => { idle(p, lt); talk(p, lt); p.userData.armR.rotation.x = -1.6 + Math.sin(lt * 7 + i) * .4; }); ms.forEach((b, i) => { const k = (lt * .5 + i * .1) % 1; b.position.set(-1.5 + i * .33, .9 + k * 2.4, -.6); b.rotation.set(k * 6, k * 4, 0); }); } };
});
S('x_out', () => {
  const g = boardroom(); const a = antioco(); g.add(a); const bx = G(box(.5, .3, .4, '#c9a27a', 0, 0, 0)); bx.position.set(0, .95, .3); a.add(bx); pose(a, [-.9, 0, .2], [-.9, 0, -.2], -.6, -.6);
  return { g, sky: IN, pill: 'PUSHED OUT · 2007', pillColor: RED, focus: V(0, 1.2, 0), cam: dolly(V(2, 1.6, 4), V(1.6, 1.6, 3.4), V(0, 1.3, 0)), upd: lt => { walk(a, lt, 6, .35); a.userData.armL.rotation.x = -.9; a.userData.armR.rotation.x = -.9; a.position.set(-2 + lt * .6, 0, -.6); a.rotation.y = Math.PI / 2; } };
});
S('x_new', () => {
  const g = storeIn(); const k = keyes(); g.add(at(k, 0, 0, 1.4, Math.PI * .05)); pose(k, [0, 0, .1], [-.8, 0, -.4], 0, -.9);
  return { g, sky: IN, name: ['THE NEW BOSS', 'BACK TO THE STORES'], focus: V(0, 1.3, 1.4), cam: dolly(V(-.6, 1.6, 4.6), V(-.2, 1.6, 3.8), V(0, 1.5, 1.4)), upd: lt => { idle(k, lt); talk(k, lt); } };
});
S('x_radar', () => {
  const g = dark('#0c1a14'); const sc = new THREE.Mesh(new THREE.CircleGeometry(1.3, 48), B('#0f3a22')); sc.position.set(0, 1.7, 0); g.add(sc);
  for (const r of [.4, .8, 1.2]) { const ring = new THREE.Mesh(new THREE.RingGeometry(r - .01, r + .01, 48), B('#3aff8a')); ring.position.set(0, 1.7, .01); g.add(ring); }
  const sw = new THREE.Mesh(new THREE.PlaneGeometry(1.3, .03), B('#7aff9a')); sw.geometry.translate(.65, 0, 0); sw.position.set(0, 1.7, .02); g.add(sw);
  const t = tag('NETFLIX? NOT ON THE RADAR', { bg: '#fff', fg: '#1a6a3a', h: .3 }); t.position.set(0, 3.25, 0); g.add(t);
  return { g, sky: ['#06100c', '#0c1a14', '#12241a'], dim: .5, focus: V(0, 1.7, 0), cam: dolly(V(0, 2.2, 4.4), V(0, 2.2, 3.8), V(0, 2.2, 0)), upd: lt => { sw.rotation.z = -lt * 2.5; pop(t, lt, .6); } };
});

// ================= STREAMING =================
S('t_change', () => {
  const g = townStreet(); return { g, sky: GREY, dim: .7, pill: 'THE WORLD CHANGED', pillColor: '#555', focus: V(0, 2, 0), cam: dolly(V(8, 3, 14), V(4, 3, 12), V(0, 2.6, 0)) };
});
S('t_kiosk', () => {
  const g = G(ground('#9a9aa2'), strip(30, 14, '#c9c4ba', 0, 0, .01)); const k = kiosk(); g.add(k); const p = extra(9); g.add(at(p, .2, 0, 1.2, Math.PI)); pose(p, [0, 0, .1], [-1.4, 0, -.2], 0, -.3);
  return { g, sky: OUT, pill: '$1 A NIGHT', pillColor: RED, focus: V(0, 1.3, 0), cam: dolly(V(-2.4, 1.7, 3.6), V(-1.8, 1.6, 3.0), V(0, 1.4, 0)), upd: lt => idle(p, lt) };
});
S('t_stream', () => {
  const g = room({ w: 8, d: 6, wall: '#cfc8e0', side: '#c6bdd8', floor: flat('#b9a28c', 3) }); const t = tv(textTex([['NETFLIX', 140, '#fff', 120], ['STREAMING · 2007', 44, '#ffd0d0', 220, 800]], { w: 600, h: 300, bg: '#b81f30' }), 2); t.position.set(0, 1.6, -2.9); g.add(t);
  const sofa = G(rbox(2.6, .45, .9, .1, '#5c79c9', 0, .4, 0), rbox(2.6, .6, .25, .1, '#5c79c9', 0, .8, .35)); g.add(at(sofa, 0, 0, 1.2)); const f = fam(); f.forEach((p, i) => g.add(sit(at(p, -.9 + i * .6, 0, 1.1, Math.PI), p.userData && i > 1 ? .4 : .48)));
  return { g, sky: IN, dim: .7, pill: 'STREAMING', pillColor: RED, focus: V(0, 1.2, -1), cam: dolly(V(-1.4, 1.7, 3.8), V(-.6, 1.6, 3.2), V(0, 1.4, -1.6)), upd: lt => f.forEach(p => idle(p, lt)) };
});
S('t_play', () => {
  const g = dark('#140c10'); const rm = G(rbox(.5, 1.6, .15, .1, '#2a2a30', 0, 0, 0)); const b = cyl(.18, .18, .05, RED, 0, .3, .08, 24); b.rotation.x = Math.PI / 2; rm.add(b); const tri = new THREE.Mesh(new THREE.CircleGeometry(.09, 3), B('#fff')); tri.position.set(.01, .3, .11); rm.add(tri);
  rm.position.set(0, 1.5, 0); rm.rotation.x = -.3; g.add(rm); spot(g, 0, 5, 4, 0, 1.5, 0, '#fff4e0', 60);
  return { g, sky: ['#1a0a0e', '#2a1016', '#3a1820'], dim: .5, pill: 'JUST PRESS PLAY', pillColor: RED, focus: V(0, 1.6, 0), cam: dolly(V(0, 1.9, 2.4), V(0, 1.85, 1.9), V(0, 1.75, 0)), upd: lt => { b.position.z = lt > 1 && lt < 1.3 ? .05 : .08; } };
});
S('t_quiet', () => {
  const g = storeIn(); const k = clerk(4); g.add(at(k, 1, 0, 1.4, Math.PI * .1)); return { g, sky: IN, dim: .7, pill: 'THE AISLES WENT QUIET', pillColor: '#555', focus: V(0, 1.3, 0), cam: dolly(V(0, 2.4, 6), V(0, 2.2, 5), V(0, 1.4, -3)), upd: lt => idle(k, lt) };
});

// ================= FALL =================
S('z_debt', () => {
  const g = dark('#2a3048'); const c = counterCard('DEBT', RED); c.position.set(0, 1.8, 0); g.add(c); spot(g, 0, 5, 4, 0, 1.8, 0, '#fff4e0', 60);
  return { g, sky: PURPLE, dim: .5, pill: 'DROWNING IN DEBT', pillColor: RED, focus: V(0, 1.8, 0), cam: dolly(V(0, 1.8, 4.4), V(0, 1.8, 3.6), V(0, 1.8, 0)), upd: lt => setCounter(c, '$' + (clamp(lt / 2.4) * 900).toFixed(0) + 'M+') };
});
S('z_bank', () => {
  const g = dark('#2a3048'); const n = newspaper('BLOCKBUSTER FILES FOR BANKRUPTCY', 'September 2010', 1.6); n.position.set(0, 1.6, 0); g.add(n); spot(g, 0, 5, 4, 0, 1.6, 0, '#fff4e0', 70);
  return { g, sky: PURPLE, dim: .5, pill: 'BANKRUPT', pillColor: RED, focus: V(0, 1.6, 0), cam: dolly(V(.3, 1.6, 4.4), V(0, 1.6, 3.4), V(0, 1.6, 0)), upd: lt => { n.rotation.z = (1 - ease(lt / .8)) * 3; n.scale.setScalar(Math.max(.01, ease(lt / .8))); } };
});
S('z_close', () => {
  const g = townStreet({ lit: false, closed: true }); return { g, sky: GREY, dim: .7, pill: 'STORE CLOSING', pillColor: RED, focus: V(0, 2, 0), cam: dolly(V(-2, 1.8, 10), V(0, 2, 8.4), V(0, 2.2, 0)) };
});
S('z_jobs', () => {
  const g = townStreet({ lit: false, closed: true }); const ps = [0, 1, 2].map(i => { const p = clerk(i + 5); g.add(p); const b = box(.45, .3, .35, '#c9a27a', 0, .95, .32); p.add(b); return p; });
  return { g, sky: GREY, dim: .75, pill: 'THOUSANDS OF JOBS LOST', pillColor: '#555', focus: V(0, 1.2, 3), cam: dolly(V(3, 1.7, 9), V(2, 1.7, 8), V(0, 1.3, 3)), upd: lt => ps.forEach((p, i) => { walk(p, lt + i, 5, .3); pose(p, [-.9, 0, .2], [-.9, 0, -.2], -.6, -.6); p.position.set(-1 + i, 0, 1.5 + lt * .6); }) };
});
S('z_2014', () => {
  const g = mapScene(); const pins = g.userData.pins; const c = counterCard('STORES · 2014', RED); c.position.set(0, .9, -2.7); c.rotation.x = -.6; g.add(c);
  return { g, sky: PURPLE, dim: .7, focus: V(0, 0, 0), cam: dolly(V(0, 5.5, 5.5), V(0, 5, 4.6), V(0, 1.3, -1.1)), upd: lt => { const k = clamp(lt / 3); pins.forEach((p, i) => p.visible = i === 37 || i / pins.length > k); setCounter(c, Math.round(9094 * (1 - k)).toLocaleString('en-US')); } };
});

// ================= END =================
S('e_one', () => {
  const g = mapScene(); const pins = g.userData.pins; pins.forEach((p, i) => p.visible = i === 37); const p = pins[37]; p.scale.setScalar(2.5);
  return { g, sky: PURPLE, dim: .6, pill: 'EXCEPT ONE', pillColor: YEL, focus: p.position.clone(), cam: dolly(V(p.position.x, 4, p.position.z + 4), V(p.position.x, 1.6, p.position.z + 1.8), p.position.clone()) };
});
S('e_bend', () => {
  const g = townStreet(); g.add(mountains()); const ps = [0, 1, 2, 3].map(i => { const p = extra(i + 40); p.position.set(-2.4 + i * 1.5, 0, 4); p.rotation.y = Math.PI; g.add(p); return p; }); pose(ps[1], [0, 0, .1], [-1.5, 0, -.3], 0, -.8);
  return { g, sky: OUT, name: ['BEND, OREGON', 'THE LAST BLOCKBUSTER'], focus: V(0, 2, 0), cam: dolly(V(-3, 2, 13), V(0, 2.4, 11.5), V(0, 2.6, 0)), upd: lt => ps.forEach(p => idle(p, lt)) };
});
S('e_worth', () => {
  const g = dark('#140c10'); const a = card([['COULD HAVE BOUGHT IT FOR', 50, '#fff', 60], ['$50 MILLION', 120, '#fff', 180]], { w: 2.4, cw: 1024, h: 280, bg: BLUE }); a.position.set(0, 2.5, 0); g.add(a);
  const b = card([['NETFLIX TODAY', 50, '#fff', 60], ['$100s OF BILLIONS', 88, '#fff', 180]], { w: 3.2, cw: 1024, h: 280, bg: RED }); b.position.set(0, 1.3, 0); g.add(b); spot(g, 0, 5, 4, 0, 1.8, 0, '#fff4e0', 60);
  return { g, sky: ['#1a0a0e', '#2a1016', '#3a1820'], dim: .5, focus: V(0, 1.9, 0), cam: dolly(V(0, 1.9, 5), V(0, 1.9, 4.2), V(0, 1.9, 0)), upd: lt => { pop(a, lt, .2); pop(b, lt, 1.8); } };
});
S('e_lesson', () => {
  const g = dark('#2a3048'); const big = antioco(); big.scale.setScalar(1.6); g.add(at(big, -1, 0, 0, .4)); const small = reed(); small.scale.setScalar(.7); g.add(at(small, 1, 0, .4, -.4)); spot(g, 0, 6, 4, 0, 1, 0, '#fff4e0', 70);
  return { g, sky: PURPLE, dim: .55, pill: "DON'T LAUGH AT THE LITTLE GUY", pillColor: GOLD, focus: V(0, 1.2, 0), cam: dolly(V(0, 1.8, 6), V(0, 1.7, 5), V(0, 1.4, 0)), upd: lt => { idle(big, lt); idle(small, lt); const k = ease(clamp((lt - 1) / 2)); small.scale.setScalar(lerp(.7, 1.9, k)); big.scale.setScalar(lerp(1.6, .8, k)); } };
});
S('e_sub', () => {
  const g = townStreet({ night: true }); return { g, sky: NIGHT, night: true, title: window.SHORT_END || ['SUBSCRIBE', 'RISE & RUIN'], focus: V(0, 2, 0), cam: dolly(V(3, 2.2, 16), V(-3, 2.4, 15), V(0, 5.6, 0)) };
});
