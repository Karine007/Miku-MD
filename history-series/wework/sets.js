// Reusable sets and cast for the Elizabeth Holmes episode.
import { THREE, V, M, B, G, at, box, rbox, cyl, sph, capsule, mesh, panel, textTex, canvasTex, flat, checker, planks, sign, tag, person, sit, pose, room, windowBlinds, NIGHT_WIN, frame, smiley, clock, desk, chair, plant, tree, palm, house, car, ground, strip, clouds, edison, laptop, bookshelf, lerp, ease, noise, FONT, rr, SKIN } from './kit.js';

export const dolly = (p0, p1, l0, l1, fov = 38) => (u) => { const k = ease(u); return { p: p0.clone().lerp(p1, k), l: l0.clone().lerp(l1 || l0, k), fov }; };

// ---------- cast ----------
export const holmes = (o = {}) => person(Object.assign({ skin: SKIN[0], hair: '#d9b26a', hairStyle: 'bun', top: '#232327', pants: '#232327', shirt: false, turtle: true, mouth: '#9b5058', brows: '#a8844e', bigEyes: 1.2, seed: 1 }, o));
export const kidLiz = (o = {}) => person(Object.assign({ kid: true, skin: SKIN[0], hair: '#e0bb72', hairStyle: 'bob', top: '#f08cb4', pants: '#6a7ac9', shirt: false, brows: '#b8935a', seed: 2 }, o));
export const sunny = (o = {}) => person(Object.assign({ skin: SKIN[3], hair: '#1d1714', top: '#3d4a63', pants: '#2a3040', shirt: '#e9eef5', seed: 3 }, o));
export const erika = (o = {}) => person(Object.assign({ skin: SKIN[5], hair: '#1a1414', hairStyle: 'long', coat: '#fafafa', top: '#7aa9d8', pants: '#3a4560', seed: 4 }, o));
export const tyler = (o = {}) => person(Object.assign({ skin: SKIN[0], hair: '#6b4a32', coat: '#fafafa', top: '#5c8a6a', pants: '#3a4560', seed: 5 }, o));
export const reporter = (o = {}) => person(Object.assign({ skin: SKIN[0], hair: '#2a2020', glasses: '#222', top: '#2a4a7a', pants: '#2e3550', shirt: '#eef2f8', seed: 6 }, o));
export const father = (o = {}) => person(Object.assign({ skin: SKIN[0], hair: '#5a3e2a', stache: 1, top: '#3f7a52', pants: '#2e3550', seed: 7 }, o));
export const mother = (o = {}) => person(Object.assign({ skin: SKIN[0], hair: '#7a5236', hairStyle: 'bob', top: '#5c79c9', pants: '#2e3550', glasses: '#333', seed: 8 }, o));
const SUITS = ['#2b2f3d', '#3a3f55', '#4a4a52', '#2f3a33', '#3a2f2a'], TIES = ['#7a1c2b', '#1c3a7a', '#c9a54b', '#3f7a52'];
export const oldMan = (i, o = {}) => person(Object.assign({ skin: SKIN[i % 3], hair: ['#d8d8dc', '#b9b9be', '#9a9aa2'][i % 3], hairStyle: i % 4 === 3 ? 'bald' : 'short', glasses: i % 2 ? '#333' : null, top: SUITS[i % 5], pants: SUITS[i % 5], tie: TIES[i % 4], seed: 10 + i }, o));
const TOPS = ['#d64545', '#3f7a52', '#5c79c9', '#e2b84a', '#8a5ac9', '#2e8a8a', '#e8579a', '#7a5236'];
export function extra(i, o = {}) {
  const fem = i % 2 === 0;
  return person(Object.assign({ skin: SKIN[(i * 3) % 6], hair: ['#1d1714', '#6b4a32', '#d8b06a', '#3b2a20', '#a2502a'][(i * 7) % 5], hairStyle: fem ? ['bob', 'long', 'bun', 'pony'][i % 4] : ['short', 'side', 'short', 'bald'][(i >> 1) % 4], top: TOPS[(i * 5) % 8], pants: ['#2e3550', '#3a3a42', '#4a3a2a'][i % 3], glasses: i % 5 === 1 ? '#333' : null, seed: 20 + i }, o));
}
export const labTech = (i, o = {}) => extra(i, Object.assign({ coat: '#fafafa' }, o));

// ---------- rooms ----------
export function office(o = {}) {
  const g = room({ w: 9, d: 7, wall: o.wall || '#d9cfe6', side: o.side || '#cfc3e0', floor: flat(o.floor || '#cdb9a6', 3) });
  g.add(windowBlinds(2.2, 1.5, -2.4, 1.9, -3.46, Object.assign({ curtain: o.curtain || '#e98fb3' }, o.night ? NIGHT_WIN : {})));
  g.add(frame(.7, .9, 1.2, 2.0, -3.47, smiley()), frame(.6, .6, 2.3, 2.1, -3.47, (c, w, h) => { c.fillStyle = '#e8579a'; c.fillRect(w * .3, h * .3, w * .4, h * .4); }, '#f3e3a1'));
  const ck = clock(3.4, 2.4, -3.45); g.add(ck); g.userData.clock = ck;
  if (o.desk !== false) { g.add(desk(2.6, 1.1, .3, -1.2, '#8a5634')); g.add(at(laptop(), 1.1, .79, -1.2, Math.PI + .5)); }
  g.add(plant(-3.8, -2.8, 1.3), plant(3.8, -2.8, 1));
  return g;
}
export function lab(o = {}) {
  const g = room({ w: 12, d: 7, wall: o.wall || '#d4e6ea', side: '#c6dde3', floor: checker('#eef1f2', '#d9e1e6', 8) });
  for (let i = 0; i < 3; i++) g.add(windowBlinds(1.4, 1.4, -3 + i * 2.6, 2.0, -3.46, o.night ? NIGHT_WIN : {}));
  g.add(at(G(box(5, .08, 1, '#e9eef0', 0, .92, 0), box(5, .88, .9, '#c1d0d8', 0, .44, 0)), 0, 0, -2.6));
  for (let i = 0; i < 6; i++) g.add(cyl(.035, .035, .16, ['#e86a8a', '#6aa8e8', '#f0c35a'][i % 3], 1.2 + i * .14, 1.04, -2.5, 10));
  if (o.edison !== false) { const e = edison(o.screen || 'EDISON', o.screenCol || '#7fd0ff'); e.position.set(-.5, .96, -2.6); g.add(e); g.userData.edison = e; }
  return g;
}
export function street(o = {}) {
  const g = G(ground(o.night ? '#2f5a3a' : '#7dbd67'), strip(240, 8, o.night ? '#2c2e38' : '#5b5d66', 0, 9), strip(240, 2, o.night ? '#7f7c78' : '#d7d2c9', 0, 4.2, .015), strip(2.2, 6, o.night ? '#7f7c78' : '#d7d2c9', 0, 0, .016));
  if (!o.night) for (let i = -12; i < 12; i++) g.add(strip(2, .18, '#f1d65a', i * 5, 9, .02));
  g.add(house(0, -4, { wall: o.wall || '#b5636c', wreath: true, night: o.night }), house(-11, -5, { wall: '#9fb3c9', shutter: '#3f5a7d', ry: .1, night: o.night }), house(11, -5, { wall: '#e2c58f', shutter: '#8a5a2c', ry: -.1, night: o.night }));
  g.add(tree(-5.5, -1.5, 1.1), tree(6, -2, 1));
  if (!o.night) g.add(clouds());
  return g;
}
export function kitchen() {
  const g = room({ w: 8, d: 6, wall: '#f1d98f', side: '#ead08a', floor: checker('#f4f0ea', '#cf3b3b', 5) });
  const tiles = canvasTex(256, 128, (c, w, h) => { c.fillStyle = '#f6f4ee'; c.fillRect(0, 0, w, h); for (let i = 0; i < 8; i++) for (let j = 0; j < 4; j++) { c.fillStyle = (i + j) % 3 === 0 ? '#5aa86a' : '#e9e6de'; c.fillRect(i * 32 + 2, j * 32 + 2, 28, 28); } }, [4, 1]);
  g.add(panel(8, 1.0, tiles, 0, 1.45, -2.98));
  g.add(box(6, .92, .7, '#7a4a2c', 0, .46, -2.6), box(6, .06, .74, '#e9e3d8', 0, .95, -2.6));
  g.add(box(1.4, .8, .5, '#7a4a2c', 2.4, 2.5, -2.75), box(1.4, .8, .5, '#7a4a2c', -2.4, 2.5, -2.75));
  g.add(windowBlinds(1.6, 1.1, 0, 2.3, -2.97, { blinds: false, curtain: '#d94c4c' }));
  const tex = canvasTex(256, 256, (c, w, h) => { c.fillStyle = '#b84444'; c.fillRect(0, 0, w, h); c.strokeStyle = 'rgba(40,10,10,.35)'; c.lineWidth = 6; for (let i = 0; i < 9; i++) { c.beginPath(); c.moveTo(i * 32, 0); c.lineTo(i * 32, h); c.stroke(); c.beginPath(); c.moveTo(0, i * 32); c.lineTo(w, i * 32); c.stroke(); } });
  const tbl = G(box(2.2, .06, 1.3, M('#fff', { map: tex }), 0, .76, 0)); for (const sx of [-1, 1]) for (const sz of [-1, 1]) tbl.add(box(.08, .76, .08, '#6e3f22', sx * 1, .38, sz * .55)); g.add(at(tbl, 0, 0, -.6));
  return g;
}
export function court() {
  const g = room({ w: 12, d: 9, h: 4, wall: '#efe4cf', side: '#e6d8bf', floor: flat('#4b5f8a', 4), ceil: '#f4efe6' });
  const wood = planks('#7b4b2c', 2);
  g.add(box(12, 1.4, .1, M('#fff', { map: wood }), 0, .7, -4.44));
  g.add(at(G(box(4, 1.5, 1, M('#fff', { map: wood }), 0, .75, 0), box(4.2, .1, 1.1, '#5e3820', 0, 1.52, 0)), 0, 0, -3.4));
  const s = sign('SUPERIOR COURT', { bg: '#5e3820', fg: '#e9d29a', w: 3.2 }); s.position.set(0, 3.4, -4.48); g.add(s);
  const seal = cyl(.6, .6, .05, '#c9a54a', 0, 2.5, -4.46, 40); seal.rotation.x = Math.PI / 2; g.add(seal);
  const fl = G(cyl(.025, .025, 2.6, '#c9a54a', 0, 1.3, 0), box(.9, .6, .02, '#2b4fa8', .46, 2.2, 0)); g.add(at(fl, 2.6, 0, -4.1));
  const judge = oldMan(1, { top: '#1e1e22', pants: '#1e1e22', tie: null, shirt: '#f2f2f2' }); g.add(sit(at(judge, 0, .6, -4.0))); pose(judge, [-.7, 0, .1], [-.7, 0, -.1], -.6, -.6); g.userData.judge = judge;
  g.add(at(G(box(1.2, .9, .9, M('#fff', { map: wood }), 0, .45, 0)), -2.6, 0, -2.6));
  // jury box on the right
  g.add(at(G(box(.2, 1.0, 4, M('#fff', { map: wood }), 0, .5, 0)), 4.4, 0, -1.2));
  const jury = []; for (let r = 0; r < 2; r++) for (let i = 0; i < 5; i++) { const p = extra(i + r * 5 + 3); g.add(sit(at(p, 5.0 + r * .7, r * .3, -3 + i * .9, -Math.PI / 2), .48)); jury.push(p); }
  g.userData.jury = jury;
  g.add(desk(3, 1, 1.4, -.4, '#6e3f22'), desk(3, 1, -1.8, -.4, '#6e3f22'));
  return g;
}
export function stage(o = {}) {
  const g = room({ w: 16, d: 12, h: 6, wall: '#3b2f5e', side: '#33284f', floor: flat('#2d2547', 4) });
  g.add(at(G(box(8, .6, 3.5, '#4a3b6e', 0, .3, 0), box(8, .04, 3.5, '#5b4a85', 0, .62, 0)), 0, 0, -4));
  const scr = panel(6.5, 3.4, textTex([[o.big || 'THERANOS', 170, '#ffffff', 300], [o.small || 'ONE TINY DROP', 64, '#f3c4dd', 450, 800]], { w: 1280, h: 680, draw: (c, w, h) => { const gr = c.createRadialGradient(w / 2, h / 2, 50, w / 2, h / 2, w * .6); gr.addColorStop(0, o.c1 || '#8a3fd1'); gr.addColorStop(1, o.c2 || '#3a1a6a'); c.fillStyle = gr; c.fillRect(0, 0, w, h); for (let i = 0; i < 70; i++) { c.fillStyle = 'rgba(255,255,255,.5)'; c.fillRect((i * 397) % w, (i * 211) % h, 3, 3); } } }), 0, 3.4, -5.9, 0, true);
  g.add(scr);
  const spot = new THREE.SpotLight('#ffe9f4', 40, 20, .35, .6); spot.position.set(.4, 7, 1); spot.target.position.set(.4, 0, -3.6); g.add(spot, spot.target);
  if (o.crowd !== false) for (let r = 0; r < 3; r++) for (let i = -4; i <= 4; i++) { const p = extra(i + r * 9 + 40); g.add(sit(at(p, i * .9 + (r % 2) * .4, 0, r * 1.2, Math.PI))); }
  return g;
}
export function studio(o = {}) {
  const g = room({ w: 12, d: 9, h: 5, wall: '#4a2f78', side: '#3d2766', floor: flat('#3a2a5a', 4) });
  g.add(panel(8, 3.6, textTex([[o.big || 'TECH TONIGHT', 110, '#ffffff', 250], [o.small || 'THE INTERVIEW', 52, '#f7c6e0', 360, 800]], { w: 1280, h: 576, draw: (c, w, h) => { const gr = c.createLinearGradient(0, 0, w, h); gr.addColorStop(0, '#6a2fb0'); gr.addColorStop(1, '#c03f8a'); c.fillStyle = gr; c.fillRect(0, 0, w, h); for (let i = 0; i < 90; i++) { c.fillStyle = 'rgba(255,255,255,.45)'; c.beginPath(); c.arc((i * 397) % w, (i * 211) % h, (i % 3) + 1, 0, 7); c.fill(); } } }), 0, 2.4, -4.4, 0, true));
  const arm = () => G(rbox(1, .45, .9, .15, '#c7c2cf', 0, .3, 0), rbox(1, .6, .2, .08, '#c7c2cf', 0, .7, -.38));
  g.add(at(arm(), -1.1, 0, -2, .5), at(arm(), 1.1, 0, -2, -.5), cyl(.35, .35, .5, '#2a2240', 0, .25, -1.6), cyl(.06, .06, .14, '#e86a8a', 0, .57, -1.6));
  return g;
}
export function campus(o = {}) {
  const g = G(ground('#86c070'), strip(14, 60, '#e3d3b3', 0, 0, .012));
  const stone = '#e6cfa2', roof = '#c4553f';
  const bld = (x, z, w, ry) => { const b = G(box(w, 4, 4, stone, 0, 2, 0)); const rf = new THREE.Mesh(new THREE.CylinderGeometry(.01, 2.6, 1.4, 4, 1), M(roof)); rf.rotation.y = Math.PI / 4; rf.scale.set(w / 3.6, 1, 1.1); rf.position.y = 4.7; rf.castShadow = true; b.add(rf);
    const n = Math.floor(w / 1.6); for (let i = 0; i < n; i++) { const ax = -w / 2 + .8 + i * (w - 1.6) / Math.max(1, n - 1); b.add(box(1.0, 1.9, .1, '#7a5a3a', ax, 1.0, 2.0), sph(.5, '#7a5a3a', ax, 1.95, 2.0, 1, 1, .2, 16), box(.3, 3.6, .3, '#efdcb4', ax + .7, 1.8, 2.05)); }
    for (let i = 0; i < n; i++) b.add(box(.6, .7, .06, '#5b7ea8', -w / 2 + .8 + i * (w - 1.6) / Math.max(1, n - 1), 3.2, 2.02)); return at(b, x, 0, z, ry); };
  g.add(bld(0, -16, 18, 0), bld(-14, -5, 12, Math.PI / 2), bld(14, -5, 12, -Math.PI / 2));
  const s = sign(o.sign || 'STANFORD UNIVERSITY', { bg: '#8c1515', fg: '#ffffff', w: 4 }); s.position.set(0, 4.9, -13.9); g.add(s);
  for (const x of [-5, 5]) for (const z of [-9, -3, 3]) g.add(palm(x, z, .9));
  g.add(clouds());
  return g;
}
export function clinic() {
  const g = room({ w: 9, d: 7, wall: '#d6e9f2', side: '#c9e0ec', floor: checker('#f2f4f6', '#dfe6ec', 6) });
  g.add(windowBlinds(1.6, 1.3, -2.6, 2.0, -3.46, {}));
  const cal = panel(.8, 1, textTex([['WAITING', 52, '#c43b3b', 50], ['3 DAYS', 110, '#333', 190]], { w: 320, h: 400, draw: (c, w, h) => { c.fillStyle = '#c43b3b'; c.fillRect(0, 0, w, 90); c.fillStyle = '#fff'; c.font = FONT(44); c.textAlign = 'center'; c.fillText('JULY', w / 2, 60); c.fillStyle = '#ddd'; for (let i = 0; i < 3; i++) for (let j = 0; j < 6; j++) c.fillRect(20 + j * 48, 270 + i * 40, 36, 28); } }), 2.4, 1.9, -3.46);
  g.add(cal);
  const ch = G(rbox(.7, .15, .7, .05, '#6a8fc9', 0, .5, 0), rbox(.7, .8, .15, .05, '#6a8fc9', 0, .95, -.32), box(.12, .1, .7, '#6a8fc9', .38, .72, 0), box(.5, .5, .5, '#ccd3da', 0, .22, 0));
  g.add(at(ch, 0, 0, -1.6));
  g.add(at(G(box(1.2, .9, .6, '#e6ecf0', 0, .45, 0)), -1.6, 0, -2.6));
  return g;
}
export function boardroom() {
  const g = room({ w: 12, d: 8, wall: '#d9d0c4', side: '#cfc4b6', floor: flat('#6a5a7a', 3) });
  g.add(windowBlinds(2.4, 1.6, -3, 2.0, -3.96, {}), windowBlinds(2.4, 1.6, 3, 2.0, -3.96, {}));
  g.add(box(6, .08, 1.6, '#6e4428', 0, .76, -1), box(5.6, .74, .2, '#5e3820', 0, .37, -1));
  g.add(frame(1.2, .8, 0, 2.2, -3.97, (c, w, h) => { c.fillStyle = '#7fb0d8'; c.fillRect(0, 0, w, h); c.fillStyle = '#4f9a4f'; c.beginPath(); c.moveTo(0, h); c.lineTo(w * .4, h * .4); c.lineTo(w * .7, h * .7); c.lineTo(w, h * .3); c.lineTo(w, h); c.fill(); }));
  return g;
}
export function pharmacy(o = {}) {
  const g = room({ w: 12, d: 8, wall: '#eef2f4', side: '#e4eaee', floor: checker('#f4f6f8', '#e2e8ec', 8) });
  const s = sign('PHARMACY', { bg: '#d63a3a', fg: '#fff', w: 3 }); s.position.set(0, 2.8, -3.96); g.add(s);
  const cols = ['#e86a6a', '#6aa8e8', '#f0c35a', '#7ac06a', '#c58ae8', '#f7f7f7'];
  for (const x of [-4, 4]) { const sh = G(box(3, 2, .5, '#d9dee2', 0, 1, 0)); for (let r = 0; r < 4; r++) for (let i = 0; i < 9; i++) sh.add(box(.24, .3, .3, cols[(i + r * 2) % 6], -1.3 + i * .32, .3 + r * .45, .1)); g.add(at(sh, x, 0, -3.6)); }
  g.add(box(3.2, 1, .7, '#ffffff', 0, .5, -2.6), box(3.3, .06, .8, '#d63a3a', 0, 1.02, -2.6));
  if (o.booth) { const b = sign(o.booth, { bg: o.closed ? '#555' : '#2f7de1', fg: '#fff', w: 2.4 }); b.position.set(0, 1.6, -2.58); g.add(b); g.userData.booth = b; }
  return g;
}
export function hq(o = {}) {
  const g = G(ground(o.night ? '#2f5a3a' : '#86c070'), strip(30, 12, o.night ? '#3a3a44' : '#9a9aa2', 0, 6, .012));
  const glass = canvasTex(512, 512, (c, w, h) => { c.fillStyle = o.night ? '#1d2a44' : '#8fb6d8'; c.fillRect(0, 0, w, h); for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) { c.fillStyle = o.night ? (((i * 7 + j * 3) % 5) ? '#24304d' : '#3a466a') : ((i + j) % 3 ? '#a9c9e6' : '#7aa5cc'); c.fillRect(i * 64 + 4, j * 64 + 4, 56, 56); } }, [3, 2]);
  const b = new THREE.Mesh(new THREE.BoxGeometry(16, 7, 8), M('#fff', { map: glass })); b.position.set(0, 3.5, -4); b.castShadow = b.receiveShadow = true; g.add(b);
  g.add(box(16.4, .4, 8.4, '#e6e6ea', 0, 7.2, -4), box(4, 2.6, .2, '#e6e6ea', 0, 1.3, .05));
  const s = sign('THERANOS', { bg: 'none', fg: o.night ? '#9aa3b8' : '#ffffff', w: 6, px: 150 }); s.position.set(0, 5.7, .02); g.add(s);
  g.add(tree(-10, 0, 1.1), tree(10, -1, 1), tree(-6.5, 3, .8), tree(7, 3, .8));
  if (!o.night) g.add(clouds());
  return g;
}
export function bedroom() {
  const g = room({ w: 8, d: 6, wall: '#f4c9da', side: '#efbdd0', floor: flat('#d9c2a6', 3) });
  g.add(windowBlinds(1.5, 1.2, -2, 1.9, -2.96, { curtain: '#f3e3a1' }));
  g.add(frame(.6, .8, 1.0, 2.0, -2.97, smiley('#5c79c9')), frame(.5, .5, 2.0, 2.2, -2.97, (c, w, h) => { c.fillStyle = '#f3e3a1'; c.beginPath(); c.arc(w / 2, h / 2, w * .3, 0, 7); c.fill(); }, '#9ec9ef'));
  g.add(at(G(rbox(1.2, .4, 2.2, .1, '#ffffff', 0, .35, 0), rbox(1.25, .2, 1.6, .08, '#a98ad8', 0, .6, .3), rbox(.6, .15, .35, .06, '#ffffff', 0, .62, -.8), box(1.3, 1, .1, '#e6a0bf', 0, .7, -1.1)), 3, 0, -1.6));
  g.add(at(bookshelf(1.2, 1.6, '#e7d3b8'), -3.5, 0, -2.7));
  g.add(desk(1.4, .7, -1.2, -2.3, '#e7d3b8'));
  return g;
}
export function prison() {
  const g = G(ground('#c9b98f'), strip(40, 6, '#b5a684', 0, 4, .012));
  for (const x of [-7, 7]) { const b = G(box(10, 3, 5, '#e6dccb', 0, 1.5, 0), box(10.3, .3, 5.3, '#a89a86', 0, 3.1, 0)); for (let i = 0; i < 6; i++) b.add(box(.5, .7, .06, '#5b6e86', -4 + i * 1.6, 1.9, 2.52)); g.add(at(b, x, 0, -7)); }
  for (let i = -14; i <= 14; i++) g.add(cyl(.05, .05, 3, '#8a8f96', i * 1.2, 1.5, 1, 8));
  const fence = panel(34, 3, canvasTex(256, 64, (c, w, h) => { c.clearRect(0, 0, w, h); c.strokeStyle = 'rgba(120,125,135,.7)'; c.lineWidth = 2; for (let i = -64; i < w + 64; i += 8) { c.beginPath(); c.moveTo(i, 0); c.lineTo(i + 64, h); c.stroke(); c.beginPath(); c.moveTo(i + 64, 0); c.lineTo(i, h); c.stroke(); } }, [8, 1]), 0, 1.5, 1);
  fence.material.transparent = true; fence.material.side = THREE.DoubleSide; g.add(fence);
  const fl = G(cyl(.05, .05, 6, '#c9ccd2', 0, 3, 0), box(1.4, .8, .02, '#2b4fa8', .72, 5.4, 0), box(1.4, .27, .021, '#d64545', .72, 5.0, .001)); g.add(at(fl, 0, 0, -4));
  g.add(clouds());
  return g;
}
export function gov() {
  const g = G(ground('#86c070'), strip(16, 30, '#d7d2c9', 0, 4, .012));
  const b = G(box(18, 6, 6, '#eeeae2', 0, 3, -8)); for (let i = 0; i < 8; i++) b.add(cyl(.35, .4, 5, '#ffffff', -7 + i * 2, 3, -4.6, 18)); b.add(box(18.5, .8, 1.5, '#e6e2d8', 0, 5.9, -4.6));
  const pd = new THREE.Mesh(new THREE.CylinderGeometry(.01, 10.5, 2, 3), M('#e6e2d8')); pd.rotation.set(Math.PI / 2, 0, 0); pd.rotation.order = 'YXZ'; pd.scale.set(1, 1, .2);
  for (let i = 0; i < 4; i++) b.add(box(18 - i * .1, .25, .6, '#dcd7cc', 0, .125 + i * .25, -3.6 + i * -.3));
  g.add(b); const s = sign('HEALTH REGULATORS', { bg: 'none', fg: '#6a6a72', w: 6 }); s.position.set(0, 5.9, -3.84); g.add(s);
  g.add(tree(-11, -3, 1.1), tree(11, -3, 1.1), clouds());
  return g;
}
export function newsroom() {
  const g = room({ w: 9, d: 7, wall: '#cfdcee', side: '#c3d2e8', floor: flat('#b9a28c', 3) });
  const cork = canvasTex(512, 320, (c, w, h) => { c.fillStyle = '#c99a62'; c.fillRect(0, 0, w, h); noise(c, w, h, .15); [['#f6e58a', 40, 40], ['#f7c2d6', 190, 60], ['#bfe3f7', 330, 30], ['#f6e58a', 100, 180], ['#c9f0c0', 300, 170]].forEach(([cl, x, y]) => { c.fillStyle = cl; c.fillRect(x, y, 110, 90); c.fillStyle = '#d43b3b'; c.beginPath(); c.arc(x + 55, y + 8, 7, 0, 7); c.fill(); }); c.strokeStyle = '#d43b3b'; c.lineWidth = 3; c.beginPath(); c.moveTo(95, 48); c.lineTo(245, 68); c.lineTo(155, 188); c.lineTo(355, 178); c.stroke(); });
  g.add(box(2.6, 1.6, .05, '#8a5a34', 1.2, 2.0, -3.46), panel(2.5, 1.5, cork, 1.2, 2.0, -3.43));
  g.add(windowBlinds(1.6, 1.4, -2.6, 2.0, -3.46, {}));
  g.add(desk(2.6, 1.2, 0, -1.2, '#6e4428'));
  g.add(box(.7, .45, .05, '#22262e', -.9, 1.2, -1.6), box(.06, .3, .06, '#22262e', -.9, .93, -1.6), panel(.64, .38, flat('#f2f4f8'), -.9, 1.2, -1.57));
  const papers = canvasTex(256, 320, (c, w, h) => { c.fillStyle = '#fbfaf6'; c.fillRect(0, 0, w, h); c.fillStyle = '#bbb'; for (let i = 0; i < 12; i++) c.fillRect(20, 30 + i * 22, 200 - (i % 4) * 30, 8); c.strokeStyle = '#d43b3b'; c.lineWidth = 5; c.beginPath(); c.ellipse(120, 140, 80, 22, 0, 0, 7); c.stroke(); });
  [[-.2, -.9, .2], [.5, -.85, -.3], [.9, -1.1, .1]].forEach(([x, z, r]) => { const p = panel(.32, .4, papers, x, .795, z); p.rotation.set(-Math.PI / 2, 0, r); g.add(p); });
  g.add(chair(0, -.25, Math.PI));
  return g;
}
export function secretLab() {
  const g = room({ w: 10, d: 7, h: 3, wall: '#5a6474', side: '#4e5868', floor: flat('#3e4552', 4), ceil: '#3a404c' });
  for (let i = 0; i < 4; i++) { const m = G(rbox(1.4, 1.6, 1, .06, '#c9ccd2', 0, .8, 0), panel(.6, .3, flat('#3fd17a'), 0, 1.25, .505), box(1.1, .1, .5, '#9aa0a8', 0, .5, .5)); g.add(at(m, -3.3 + i * 2.2, 0, -2.8)); }
  const lt = new THREE.PointLight('#cfe6ff', 8, 10); lt.position.set(0, 2.7, -1); g.add(lt);
  return g;
}
export function closet() {
  const g = room({ w: 6, d: 5, wall: '#efe6dc', side: '#e6dbcf', floor: flat('#cdb9a6', 2) });
  g.add(cyl(.025, .025, 4.4, '#c9ccd2', 0, 2.2, -2.1).rotateZ(Math.PI / 2));
  for (let i = 0; i < 11; i++) { const x = -2 + i * .4; const sh = G(cyl(.004, .004, .1, '#999', 0, 2.15, 0, 6), rbox(.34, .7, .12, .05, '#1f1f23', 0, 1.75, 0), cyl(.06, .07, .07, '#1f1f23', 0, 2.13, 0, 12), capsule(.05, .5, '#1f1f23', -.2, 1.65, 0), capsule(.05, .5, '#1f1f23', .2, 1.65, 0)); sh.children[3].rotation.z = .12; sh.children[4].rotation.z = -.12; g.add(at(sh, x, 0, -2.0)); }
  g.add(box(4.6, .1, .7, '#e7d3b8', 0, .8, -2.1), box(4.6, .8, .7, '#d9c2a6', 0, .4, -2.1));
  return g;
}
export function dark(c = '#2a2440') { return room({ w: 14, d: 10, h: 6, wall: c, side: c, floor: flat('#26203a', 4) }); }
