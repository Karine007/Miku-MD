// Scenes for the WeWork Rise & Ruin Shorts (ids match ../shorts/wework_p*_anchors.json).
import { THREE, V, M, B, G, at, box, rbox, cyl, sph, panel, textTex, canvasTex, flat, checker, sign, tag, pop, person, sit, pose, idle, talk, walk, wave, blink, clock, desk, chair, plant, tree, car, money, newspaper, laptop, frame, ground, strip, clouds, room, lerp, ease, clamp, backOut, FONT, rr, SKIN, rng } from './kit.js';
import { dolly, extra, office, court, dark, stage, boardroom, newsroom, street } from './sets.js';
import { phone, card, calendar, tv, skyline, jet, crossTag } from './props2.js';

export const SCENES = []; const S = (id, build) => SCENES.push({ id, build });
const IN = ['#cfd8ea', '#ece9ef', '#f6efe8'], OUT = ['#7fc0ec', '#bfe2f4', '#f4ecd8'], DUSK = ['#3a3a6a', '#a06a8a', '#f0a87a'], NIGHT = ['#0f1630', '#22284a', '#3b3460'], GREY = ['#7d8796', '#a3abb6', '#c4c8cc'];
const RED = '#d63a3a', GREEN = '#2e8a4a', BLUE = '#2f7de1', PINK = '#d63a7a', GOLD = '#c9902a', WEBLK = '#1b1b1f';
// cast (stylised, not portraits)
const adam = (o = {}) => person(Object.assign({ skin: SKIN[1], hair: '#2a1f18', hairStyle: 'long', beard: 1, top: '#1f1f23', pants: '#2a2a30', shirt: false, seed: 201 }, o));
const miguel = (o = {}) => person(Object.assign({ skin: SKIN[2], hair: '#1d1714', hairStyle: 'short', top: '#7a8aa0', pants: '#3a3a42', seed: 202 }, o));
const son = (o = {}) => person(Object.assign({ skin: SKIN[0], hair: '#2a2a2a', hairStyle: 'bald', top: '#2e3550', pants: '#2e3550', shirt: '#ffffff', tie: '#3a4a8a', glasses: '#333', seed: 203 }, o));
const suit = (i, o = {}) => extra(i, Object.assign({ top: ['#2e3550', '#3a3a42', '#4a3a5a'][i % 3], shirt: '#ffffff', tie: ['#c03a3a', '#3a5ac0', '#c0a03a'][i % 3] }, o));
const worker = (i, o = {}) => extra(i + 30, Object.assign({ top: ['#f0a0b8', '#7ac0e8', '#f7d36a', '#c58ae8', '#7ac06a', '#f26a21'][i % 6] }, o));
const fmt = n => '$' + Math.round(n).toLocaleString('en-US');
const big = (txt, col = '#1b1b1f', bg = '#ffffff', w = 4, px = 200) => card([[txt, px, col, 256]], { w, bg, cw: 1400, h: 512, basic: true });
function weLogo(w = 3, dark = true) { return sign('wework', { bg: dark ? WEBLK : '#ffffff', fg: dark ? '#ffffff' : WEBLK, w, px: 150 }); }
function tower(o = {}) {
  const g = G(ground(o.night ? '#2f3a4a' : '#9aa0a8'), strip(60, 8, o.night ? '#2c2e38' : '#5b5d66', 0, 6));
  const glass = canvasTex(256, 512, (c, w, h) => { c.fillStyle = o.night ? '#1d2a44' : '#8fb6d8'; c.fillRect(0, 0, w, h); for (let i = 0; i < 5; i++) for (let j = 0; j < 14; j++) { c.fillStyle = o.night ? (((i * 7 + j * 3) % 4) ? '#24304d' : '#ffd88a') : ((i + j) % 3 ? '#a9c9e6' : '#7aa5cc'); c.fillRect(8 + i * 50, 8 + j * 36, 40, 28); } });
  const b = new THREE.Mesh(new THREE.BoxGeometry(8, 22, 7), M('#fff', { map: glass })); b.position.set(0, 11, -4); b.castShadow = b.receiveShadow = true; g.add(b);
  const l = weLogo(4.4); l.position.set(0, 4.2, -.48); g.add(l); g.add(box(3, 2.6, .2, '#e6e6ea', 0, 1.3, -.45));
  g.add(at(skyline({ n: 18, seed: o.seed || 3, night: o.night }), 0, 0, -40)); if (!o.night) g.add(clouds());
  return g;
}
function cowork(o = {}) {
  const g = room({ w: 14, d: 10, h: 3.6, wall: '#f2efe8', side: '#e8e4da', floor: flat('#b88a5a', 4), trim: '#2a2a30' });
  // glass walls with black frames
  for (const x of [-4.5, 4.5]) { g.add(box(.06, 3.2, 6, M('#bfe0f0', { transparent: true, opacity: .35 }), x, 1.6, -1.5)); for (let k = 0; k < 4; k++) g.add(box(.08, 3.2, .08, '#2a2a30', x, 1.6, -4.5 + k * 2)); }
  const neon = sign('DO WHAT YOU LOVE', { bg: 'none', fg: '#ff7ab8', w: 4, px: 130, basic: true }); neon.position.set(0, 2.7, -4.95); g.add(neon);
  // desks + people
  const ppl = []; const q = rng(o.seed || 5);
  for (let r = 0; r < 2; r++) for (let i = 0; i < 3; i++) { const x = -2.4 + i * 2.4, z = -2.6 + r * 2.2; g.add(desk(1.8, .9, x, z, '#e9dfcf')); g.add(at(laptop(), x, .79, z, Math.PI)); const p = worker(i + r * 3); sit(p); p.position.set(x, 0, z + .75); p.rotation.y = Math.PI; g.add(p); ppl.push(p); }
  // beer taps + coffee
  const bar = G(box(2.4, 1, .7, '#2a2a30', 0, .5, 0), box(2.5, .06, .8, '#c9a27a', 0, 1.02, 0)); for (let k = 0; k < 3; k++) bar.add(cyl(.04, .04, .4, '#d9d9d9', -.6 + k * .6, 1.25, -.1, 8), sph(.06, ['#f0c35a', '#d68a3a', '#f0e0a0'][k], -.6 + k * .6, 1.47, -.1));
  bar.add(cyl(.09, .07, .2, '#ffffff', .9, 1.15, .15, 10)); g.add(at(bar, -5.6, 0, 1.6, Math.PI / 2));
  g.add(plant(5.8, -4.2, 1.3), plant(-5.8, -4.2, 1.2));
  g.userData.ppl = ppl; g.userData.bar = bar; return g;
}
function chart(vals, col, o = {}) { const g = G(box(5, 3.2, .1, '#ffffff', 0, 1.6, 0)); const n = vals.length; const bars = vals.map((v, i) => { const b = box(.5, 1, .12, col, -1.9 + i * (3.8 / (n - 1)), 0, .08); g.add(b); return b; }); g.userData.set = k => bars.forEach((b, i) => { const h = Math.max(.02, vals[i] * 2.6 * k); b.scale.y = h; b.position.y = .25 + h / 2; }); if (o.label) { const t = sign(o.label, { bg: 'none', fg: '#333', w: 2.6, px: 110 }); t.position.set(0, 2.95, .07); g.add(t); } return g; }

// ================= PART 1: RISE =================
S('h_worth', () => {
  const g = tower(); const c = big('$47,000,000,000', '#1b8a4a', '#ffffff', 6.5, 170); c.position.set(0, 14, 2); g.add(c);
  return { g, sky: OUT, pill: 'WORTH $47 BILLION', pillColor: GREEN, focus: V(0, 6, 0), sun: [8, 16, 10], cam: dolly(V(-6, 2, 22), V(-2, 3, 16), V(0, 12, -2), V(0, 13, -2), 40), upd: lt => pop(c, lt, .5) };
});
S('h_rent', () => {
  const g = cowork(); const k = tag('IT RENTED OFFICES', { fg: WEBLK, h: .5 }); k.position.set(0, 2.9, -1); g.add(k);
  return { g, sky: IN, focus: V(0, 1, -1), cam: dolly(V(-3, 2.6, 7), V(1, 2.3, 6), V(0, 1, -1.5), V(0, 1, -1.8)), upd: lt => { pop(k, lt, .5); g.userData.ppl.forEach((p, i) => idle(p, lt + i)); } };
});
S('h_title', () => {
  const g = tower({ night: true }); return { g, sky: NIGHT, night: true, title: ['WEWORK', 'RISE & RUIN'], focus: V(0, 6, 0), cam: dolly(V(4, 3, 26), V(-3, 4, 22), V(0, 10, -2), V(0, 11, -2), 42) };
});
S('b_open', () => {
  const g = street(); const a = at(adam(), -.6, 0, 2.2, .2), m = at(miguel(), .7, 0, 2.2, -.2); g.add(a, m); const s = weLogo(2.6); s.position.set(0, 2.9, -1.48); g.add(s);
  const ny = tag('NEW YORK · 2010', { fg: BLUE, h: .2 }); ny.position.set(0, .5, 3.2); g.add(ny);
  return { g, sky: OUT, name: ['ADAM NEUMANN', '& MIGUEL McKELVEY'], focus: V(0, 1, 1), cam: dolly(V(0, 1.6, 8), V(0, 1.5, 6.2), V(0, 1.4, 1.5)), upd: lt => { idle(a, lt); idle(m, lt + 1); talk(a, lt, lt > .6); pop(ny, lt, .4); wave(m, lt); } };
});
S('b_idea', () => {
  const g = tower(); const c = card([['LEASE', 120, '#1b1b1f', 110], ['10–15 YEARS', 150, '#d63a3a', 300], ['signed: WeWork', 60, '#555', 430, 800]], { w: 2.4, cw: 800, h: 520 }); c.position.set(1.8, 3, 1.5); c.rotation.y = -.3; g.add(c);
  return { g, sky: OUT, pill: 'LONG LEASES', pillColor: RED, focus: V(0, 3, 0), cam: dolly(V(6, 2, 12), V(4, 2.4, 9), V(1, 3.4, -1), V(2, 3.2, 0)), upd: lt => pop(c, lt, .3) };
});
S('b_glass', () => {
  const g = cowork({ seed: 7 }); const t = tag('BEER ON TAP 🍺', { fg: GOLD, h: .42 }); t.position.set(-4.6, 2.1, 2.4); g.add(t);
  return { g, sky: IN, focus: V(-4, 1, 1), cam: dolly(V(-1, 1.9, 6), V(-2.4, 1.8, 5), V(-5.4, 1.2, 1.6), V(-5.4, 1.2, 1.6)), upd: lt => { pop(t, lt, .5); g.userData.ppl.forEach((p, i) => idle(p, lt + i)); } };
});
S('b_month', () => {
  const g = cowork({ seed: 9 }); const ts = g.userData.ppl.map((p, i) => { const t = tag(['$450', '$600', '$800'][i % 3] + '/mo', { fg: GREEN, h: .3 }); t.position.copy(p.position).add(V(0, 1.6, 0)); g.add(t); return t; });
  return { g, sky: IN, pill: 'DESKS BY THE MONTH', pillColor: BLUE, focus: V(0, 1, -1), cam: dolly(V(0, 3.6, 6.5), V(0, 3.2, 5.6), V(0, .8, -1.5)), upd: lt => { ts.forEach((t, i) => pop(t, lt, .3 + i * .18)); g.userData.ppl.forEach((p, i) => idle(p, lt + i)); } };
});
S('d_dream', () => {
  const g = stage({ big: 'WEWORK', small: 'WE ARE A COMMUNITY', c1: '#3a3a44', c2: '#111114' }); const a = at(adam({ top: '#2a2a30' }), 0, .9, -1); pose(a, [0, 0, -.4], [0, 0, 2.2], 0, .6); g.add(a);
  return { g, sky: NIGHT, night: true, dim: 1.2, pill: 'HE SOLD A DREAM', pillColor: PINK, focus: V(0, 2, -1), cam: dolly(V(0, 1.9, 6), V(0, 2, 4.4), V(0, 2, -1)), upd: lt => { idle(a, lt); talk(a, lt); } };
});
S('d_consc', () => {
  const g = stage({ big: 'WEWORK', small: ' ', c1: '#3a3a44', c2: '#111114' }); const scr = card([['ELEVATE THE WORLD\'S', 96, '#ffffff', 190], ['CONSCIOUSNESS', 130, '#ffd23f', 330]], { w: 6, cw: 1400, h: 520, bg: '#1b1b1f', basic: true }); scr.position.set(0, 3.6, -3.4); g.add(scr);
  const a = at(adam({ top: '#2a2a30' }), 0, .9, -1); pose(a, [0, 0, -2.2], [0, 0, 2.2], .5, .5); g.add(a);
  return { g, sky: NIGHT, night: true, focus: V(0, 2.4, -2), cam: dolly(V(-2, 2, 9), V(1, 2.4, 7.5), V(0, 3, -2), V(0, 3.1, -2)), upd: lt => { idle(a, lt); talk(a, lt); pop(scr, lt, .2); } };
});
S('i_love', () => {
  const g = boardroom(); const ps = [0, 1, 2, 3].map(i => { const p = suit(i); sit(p); p.position.set(-2.2 + i * 1.45, 0, -.1); p.rotation.y = Math.PI; g.add(p); return p; }); const ch = chart([.2, .35, .6, .9, 1.2], GREEN, { label: 'VALUE' }); ch.position.set(0, .4, -3.7); ch.scale.setScalar(.7); g.add(ch);
  return { g, sky: IN, pill: 'INVESTORS LOVED IT', pillColor: GREEN, focus: V(0, 1, -1), cam: dolly(V(0, 2.4, 5), V(0, 2.2, 4.2), V(0, 1.4, -2.4)), upd: lt => { ch.userData.set(clamp(lt / 1.4)); ps.forEach((p, i) => { idle(p, lt + i); pose(p, [-1.2, 0, -.3], [-1.2, 0, .3], -1 - Math.abs(Math.sin(lt * 9 + i)) * .5, -1 - Math.abs(Math.sin(lt * 9 + i + 1)) * .5); }); } };
});
S('i_son', () => {
  const g = boardroom(); const s = at(son(), -1, 0, .2); const a = at(adam(), 1, 0, .2); g.add(s, a); pose(s, [0, 0, 0], [-1.3, 0, .4], 0, -.4); pose(a, [0, 0, 0], [-1.3, 0, -.4], 0, -.4);
  const m = money(18, 0, -1); m.position.set(0, .8, -1); g.add(m); const t = tag('BILLIONS 💰', { fg: GREEN, h: .45 }); t.position.set(0, 2.6, -.5); g.add(t);
  return { g, sky: IN, name: ['MASAYOSHI SON', 'SOFTBANK'], focus: V(0, 1.2, 0), cam: dolly(V(-1.4, 1.6, 5), V(-.6, 1.6, 4), V(0, 1.3, -.2)), upd: lt => { idle(s, lt); idle(a, lt + 1); pop(t, lt, 1.2); m.scale.setScalar(.6 + clamp(lt / 1.5) * .6); } };
});
S('g_spread', () => {
  const g = G(ground('#9aa0a8')); const sk = skyline({ n: 30, seed: 8 }); g.add(sk); const q = rng(4); const ts = [];
  for (let i = 0; i < 14; i++) { const t = tag('WE', { bg: WEBLK, fg: '#fff', h: 2.6 }); t.position.set((q() - .5) * 60, 10 + q() * 22, -20 - q() * 30); g.add(t); ts.push(t); }
  g.add(clouds());
  return { g, sky: OUT, pill: 'HUNDREDS OF BUILDINGS', pillColor: WEBLK, focus: V(0, 10, -20), sun: [10, 20, 10], cam: dolly(V(-10, 14, 30), V(8, 18, 26), V(0, 14, -30), V(0, 15, -30), 44), upd: lt => ts.forEach((t, i) => pop(t, lt, .15 + i * .16)) };
});
S('g_47', () => {
  const g = tower(); const c = big('$47 BILLION', '#1b8a4a', '#ffffff', 6, 210); c.position.set(0, 14, 2); g.add(c); const d = calendar('2019', 'JAN', 'valuation', '#1b1b1f'); d.position.set(-3.6, 9, 2.2); g.add(d);
  return { g, sky: OUT, focus: V(0, 10, 0), cam: dolly(V(3, 8, 18), V(0, 11, 14), V(0, 13, 0), V(0, 13.4, 0), 40), upd: lt => { pop(c, lt, .3); pop(d, lt, .8); } };
});
S('x_problem', () => {
  const g = dark('#24203a'); const a = at(adam(), 0, 0, 0); g.add(a); const sp = new THREE.SpotLight('#ffffff', 40, 20, .35, .6); sp.position.set(0, 6, 2); sp.target.position.set(0, 0, 0); g.add(sp, sp.target);
  return { g, sky: NIGHT, night: true, pill: 'ONE PROBLEM...', pillColor: RED, focus: V(0, 1, 0), cam: dolly(V(0, 1.7, 5), V(0, 1.6, 3.6), V(0, 1.4, 0)), upd: lt => idle(a, lt) };
});
S('x_money', () => {
  const g = boardroom(); const ch = chart([1.1, .7, .2, -.4, -.9].map(v => Math.max(.05, v + 1) / 2), RED, { label: 'PROFIT' }); ch.position.set(0, .5, -2.5); g.add(ch); const m = money(9, 0, 0); m.position.set(0, .8, -.6); g.add(m);
  const t = tag('LOSING MONEY 📉', { fg: RED, h: .5 }); t.position.set(0, 3.4, -2.3); g.add(t);
  return { g, sky: GREY, focus: V(0, 1.6, -2), cam: dolly(V(0, 2.2, 4.6), V(0, 2.1, 3.6), V(0, 1.8, -2.5)), upd: lt => { ch.userData.set(clamp(1 - lt / 2.2) * .7 + .3); m.scale.setScalar(Math.max(.05, 1 - lt / 2.5)); pop(t, lt, .4); } };
});

// ================= PART 2: THE IPO =================
S('f_file', () => {
  const g = G(ground('#9aa0a8')); const nyse = G(box(14, 8, 4, '#f2eee6', 0, 4, -6)); for (let i = 0; i < 6; i++) nyse.add(cyl(.35, .35, 6, '#ffffff', -5 + i * 2, 3, -3.6, 14)); nyse.add(box(14.6, 1.6, 4.6, '#e6e0d4', 0, 8.4, -6));
  const fl = card([['NYSE', 200, '#1b1b1f', 256]], { w: 3, cw: 800, h: 512, bg: '#ffffff' }); fl.position.set(0, 8.4, -3.6); nyse.add(fl); g.add(nyse); g.add(clouds());
  const doc = card([['FORM S-1', 110, '#1b1b1f', 120], ['WeWork', 150, '#1b1b1f', 300], ['going public', 60, '#555', 430, 800]], { w: 2.4, cw: 800, h: 520 }); doc.position.set(0, 2.2, 2); g.add(doc);
  return { g, sky: OUT, pill: 'GOING PUBLIC', pillColor: BLUE, focus: V(0, 3, -2), cam: dolly(V(-3, 2, 10), V(-1, 2.2, 7.5), V(0, 3, -2), V(0, 2.6, 0)), upd: lt => pop(doc, lt, .4) };
});
S('f_numbers', () => {
  const g = office(); const doc = card([['WEWORK · S-1', 80, '#1b1b1f', 70], ['Revenue  $1.8B', 70, '#2e8a4a', 210, 800], ['Net loss  –$1.9B', 70, '#d63a3a', 330, 800], ['2018', 60, '#777', 440, 800]], { w: 2.6, cw: 800, h: 520 }); doc.position.set(0, 1.9, -2.4); g.add(doc);
  return { g, sky: IN, focus: V(0, 1.8, -2.4), cam: dolly(V(-1, 1.9, 2.4), V(0, 1.9, 1.4), V(0, 1.85, -2.4)), upd: lt => pop(doc, lt, .2) };
});
S('f_loss', () => {
  const g = dark('#2a2036'); const c = big('–$1.9 BILLION', '#d63a3a', '#ffffff', 5, 190); c.position.set(0, 3, -2); g.add(c); const m = money(18, 0, 0); m.position.set(0, 0, 0); g.add(m);
  return { g, sky: NIGHT, night: true, dim: 1.4, pill: 'LOST IN ONE YEAR', pillColor: RED, focus: V(0, 1.6, -1), cam: dolly(V(0, 2, 7), V(0, 2.2, 5.2), V(0, 2.2, -1.6)), upd: lt => { pop(c, lt, .3); m.scale.setScalar(Math.max(.02, 1 - lt / 2.4)); m.rotation.y = lt; } };
});
S('f_strange', () => {
  const g = office(); const doc = card([['S-1', 120, '#1b1b1f', 120], ['page 147...', 70, '#555', 300, 800]], { w: 2, cw: 800, h: 520 }); doc.position.set(0, 1.9, -2.4); g.add(doc); const q = tag('?!', { fg: RED, h: .6 }); q.position.set(.9, 2.6, -2.2); g.add(q);
  return { g, sky: IN, focus: V(0, 1.8, -2.4), cam: dolly(V(1, 2, 2.6), V(.3, 1.95, 1.6), V(0, 1.9, -2.4)), upd: lt => pop(q, lt, .6) };
});
S('f_lease', () => {
  const g = tower(); const a = at(adam(), 3, 0, 2); g.add(a); const k = tag('OWNED BY ADAM', { fg: RED, h: .5 }); k.position.set(0, 7, 1); g.add(k); const r = tag('RENT → WEWORK PAYS', { fg: BLUE, h: .45 }); r.position.set(0, 5.8, 1); g.add(r);
  return { g, sky: OUT, pill: 'CONFLICT OF INTEREST', pillColor: RED, focus: V(0, 4, 0), cam: dolly(V(5, 2, 12), V(3, 2.6, 9.5), V(0, 4.6, 0)), upd: lt => { idle(a, lt); pop(k, lt, .3); pop(r, lt, 1.1); } };
});
S('f_we', () => {
  const g = dark('#2a2036'); const w = big('“We” ™', '#1b1b1f', '#ffffff', 4.4, 240); w.position.set(0, 2.6, -2); g.add(w);
  return { g, sky: NIGHT, night: true, dim: 1.4, pill: 'TRADEMARKED "WE"', pillColor: PINK, focus: V(0, 2.4, -2), cam: dolly(V(-1, 2.4, 6), V(0, 2.5, 4.4), V(0, 2.6, -2)), upd: lt => pop(w, lt, .2) };
});
S('f_paid', () => {
  const g = boardroom(); const m = money(27, 0, 0); m.position.set(0, .82, -1); g.add(m); const c = big('$5.9 MILLION', '#2e8a4a', '#ffffff', 3.8, 190); c.position.set(0, 2.7, -2.6); g.add(c);
  const back = tag('(LATER RETURNED)', { fg: '#555', h: .35 }); back.position.set(0, 1.9, -1.4); g.add(back);
  return { g, sky: IN, focus: V(0, 1.6, -1.5), cam: dolly(V(0, 2.2, 4.4), V(0, 2.1, 3.6), V(0, 1.8, -2)), upd: (lt, u) => { pop(c, lt, .2); pop(back, lt, Math.max(1.2, (u > .55 ? 0 : 99))); m.scale.setScalar(.5 + clamp(lt / 1.2) * .6); } };
});
S('p_panic', () => {
  const g = newsroom(); const ps = [0, 1, 2].map(i => { const p = suit(i + 4); p.position.set(-1.5 + i * 1.5, 0, 1); p.rotation.y = 0; g.add(p); return p; });
  return { g, sky: IN, pill: 'INVESTORS PANICKED', pillColor: RED, focus: V(0, 1.4, 0), cam: dolly(V(0, 1.6, 6), V(0, 1.6, 4.6), V(0, 1.4, 0)), upd: lt => ps.forEach((p, i) => { idle(p, lt + i); pose(p, [0, 0, -2.6], [0, 0, 2.6], 1.4 + Math.sin(lt * 8 + i) * .2, 1.4 + Math.sin(lt * 8 + i) * .2); }) };
});
S('p_melt', () => {
  const g = dark('#2a2036'); const vals = [47, 20, 15, 10]; const c = card([['$47B', 220, '#2e8a4a', 256]], { w: 4.6, cw: 1024, h: 512 }); c.position.set(0, 2.6, -2); g.add(c);
  const mats = vals.map(v => textTex([[`$${v}B`, 220, v > 30 ? '#2e8a4a' : '#d63a3a', 256]], { w: 1024, h: 512, bg: '#ffffff' }));
  return { g, sky: NIGHT, night: true, dim: 1.4, pill: 'THE VALUE MELTS', pillColor: RED, focus: V(0, 2.4, -2), cam: dolly(V(0, 2.4, 6), V(0, 2.5, 4.6), V(0, 2.6, -2)), upd: (lt, u) => { const i = Math.min(3, Math.floor(u * 4.2)); if (c.material.map !== mats[i]) { c.material.map = mats[i]; c.material.needsUpdate = true; } c.position.y = 2.6 - u * .6; c.scale.setScalar(1 - u * .35); } };
});
S('p_down', () => {
  const g = office(); const a = at(adam(), 0, 0, -.4); g.add(a); const t = tag('STEPS DOWN AS CEO', { fg: RED, h: .28 }); t.position.set(0, 2.5, -.4); g.add(t);
  return { g, sky: IN, focus: V(0, 1.4, -.4), cam: dolly(V(0, 1.6, 4.4), V(0, 1.55, 3.4), V(0, 1.4, -.4)), upd: lt => { idle(a, lt); a.position.x = Math.max(-3, -lt * .5); walk(a, lt, 5, .3); a.rotation.y = -Math.PI / 2; pop(t, lt, .4); } };
});
S('p_cancel', () => {
  const g = G(ground('#9aa0a8')); const doc = card([['WEWORK IPO', 140, '#1b1b1f', 256]], { w: 4, cw: 1024, h: 512 }); doc.position.set(0, 2.6, 0); g.add(doc); const x = big('CANCELLED', '#ffffff', '#d63a3a', 3.6, 170); x.position.set(0, 2.6, .05); x.rotation.z = .2; g.add(x); g.add(clouds());
  return { g, sky: GREY, focus: V(0, 2.4, 0), cam: dolly(V(0, 2.5, 6), V(0, 2.6, 4.6), V(0, 2.6, 0)), upd: lt => pop(x, lt, .3) };
});
S('p_rescue', () => {
  const g = boardroom(); const s = at(son(), -.8, 0, .2); g.add(s); const m = money(27, 0, 0); m.position.set(.4, .82, -1); g.add(m); const t = tag('SOFTBANK TAKES OVER', { fg: BLUE, h: .28 }); t.position.set(0, 2.6, -.6); g.add(t);
  return { g, sky: IN, focus: V(0, 1.2, -.4), cam: dolly(V(-1, 1.7, 4.6), V(0, 1.7, 3.8), V(0, 1.3, -.4)), upd: lt => { idle(s, lt); pop(t, lt, .4); } };
});
S('p_exit', () => {
  const g = G(ground('#9cc47a'), strip(300, 14, '#6a6c74', 0, 0)); const j = jet({ name: 'ADAM', stripe: '#1b1b1f' }); j.position.set(0, .2, -2); j.rotation.y = -Math.PI / 2; g.add(j); const a = at(adam({ top: '#2a2a30' }), 3, 0, 2, -Math.PI / 2); g.add(a);
  const c = big('$1,000,000,000+', '#2e8a4a', '#ffffff', 5, 170); c.position.set(0, 5.4, 0); g.add(c); g.add(clouds());
  return { g, sky: OUT, pill: 'A BILLION-DOLLAR EXIT', pillColor: GOLD, focus: V(0, 2, 0), sun: [8, 14, 6], cam: dolly(V(9, 2.4, 12), V(6, 2.8, 10), V(0, 3, -1)), upd: lt => { idle(a, lt); walk(a, lt, 6, .35); a.position.x = 3 - lt * .7; pop(c, lt, .4); } };
});

// ================= PART 3: RUIN =================
S('r_again', () => {
  const g = cowork({ seed: 11 }); const t = tag('A FRESH START?', { fg: BLUE, h: .5 }); t.position.set(0, 3, -1); g.add(t);
  return { g, sky: IN, focus: V(0, 1, -1), cam: dolly(V(3, 2.4, 7), V(-1, 2.2, 6), V(0, 1, -1.5)), upd: lt => { pop(t, lt, .4); g.userData.ppl.forEach((p, i) => idle(p, lt + i)); } };
});
S('r_jobs', () => {
  const g = cowork({ seed: 12 }); const ps = g.userData.ppl; const t = tag('THOUSANDS OF JOBS CUT', { fg: RED, h: .48 }); t.position.set(0, 3, -1); g.add(t);
  return { g, sky: GREY, focus: V(0, 1, -1), cam: dolly(V(0, 3, 7), V(0, 2.7, 6), V(0, 1, -1.5)), upd: lt => { pop(t, lt, .3); ps.forEach((p, i) => { const gone = lt > .5 + i * .25; p.visible = !gone; }); } };
});
S('r_covid', () => {
  const g = cowork({ seed: 13 }); g.userData.ppl.forEach(p => p.visible = false); const c = calendar('PANDEMIC', '2020', 'offices empty', '#555'); c.position.set(0, 2.4, -4.9); g.add(c);
  return { g, sky: GREY, dim: .8, pill: 'OFFICES WENT EMPTY', pillColor: '#555', focus: V(0, 1, -1), cam: dolly(V(-3, 2, 7), V(2, 2.2, 6.4), V(0, 1.3, -2)), upd: lt => pop(c, lt, .3) };
});
S('r_spac', () => {
  const g = G(ground('#9aa0a8')); const nyse = G(box(14, 8, 4, '#f2eee6', 0, 4, -6)); for (let i = 0; i < 6; i++) nyse.add(cyl(.35, .35, 6, '#ffffff', -5 + i * 2, 3, -3.6, 14)); g.add(nyse); const w = weLogo(5); w.position.set(0, 7.2, -3.5); g.add(w);
  const c = big('$9 BILLION', '#2e8a4a', '#ffffff', 4.4, 200); c.position.set(0, 3, 1); g.add(c); g.add(clouds());
  return { g, sky: OUT, pill: 'PUBLIC AT LAST · 2021', pillColor: BLUE, focus: V(0, 4, -2), cam: dolly(V(-3, 2.4, 11), V(0, 2.8, 8.5), V(0, 4, -2)), upd: lt => pop(c, lt, .5) };
});
S('r_fifth', () => {
  const g = dark('#2a2036'); const a = box(1.2, 4.7, .3, '#2e8a4a', -1.2, 2.35, -1), b = box(1.2, .9, .3, '#d63a3a', 1.2, .45, -1); g.add(a, b);
  const la = tag('$47B', { fg: GREEN, h: .45 }); la.position.set(-1.2, 5.1, -1); const lb = tag('$9B', { fg: RED, h: .45 }); lb.position.set(1.2, 1.3, -1); g.add(la, lb);
  return { g, sky: NIGHT, night: true, dim: 1.4, pill: 'LESS THAN A FIFTH', pillColor: RED, focus: V(0, 2, -1), cam: dolly(V(0, 2.4, 8), V(0, 2.6, 6.4), V(0, 2.4, -1)), upd: lt => { b.scale.y = clamp(lt / .8) || .01; pop(la, lt, .2); pop(lb, lt, .8); } };
});
S('r_leases', () => {
  const g = G(ground('#9aa0a8')); const sk = skyline({ n: 20, seed: 12 }); g.add(at(sk, 0, 0, -6)); const ts = []; const q = rng(9);
  for (let i = 0; i < 8; i++) { const t = card([['LEASE', 120, '#1b1b1f', 120], ['$$$ / year', 90, '#d63a3a', 330]], { w: 2, cw: 800, h: 520 }); t.position.set((q() - .5) * 16, 4 + q() * 8, (q() - .5) * 4); t.rotation.y = (q() - .5) * .6; g.add(t); ts.push(t); }
  return { g, sky: GREY, pill: 'EXPENSIVE LEASES', pillColor: RED, focus: V(0, 6, 0), cam: dolly(V(0, 6, 16), V(0, 7, 12), V(0, 7, 0)), upd: lt => ts.forEach((t, i) => { pop(t, lt, .2 + i * .25); t.position.y -= .002; }) };
});
S('r_shares', () => {
  const g = G(box(8, 5, .1, '#ffffff', 0, 2.5, -2)); const pts = []; for (let i = 0; i < 40; i++) { const x = -3.6 + i * .18, y = 4.4 - Math.pow(i / 39, .5) * 3.9 + Math.sin(i * 1.7) * .08; pts.push(V(x, y, -1.9)); }
  const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: '#d63a3a', linewidth: 4 })); g.add(line); const segs = pts.map((p, i) => { const s = sph(.07, '#d63a3a', p.x, p.y, p.z); g.add(s); return s; });
  const t = tag('–99%', { fg: RED, h: .8 }); t.position.set(1.3, 3.8, -1.6); g.add(t); g.add(strip(40, 40, '#e9e6e0', 0, 0));
  return { g, sky: GREY, pill: 'SHARES CRASHED', pillColor: RED, focus: V(0, 2.4, -2), cam: dolly(V(0, 2.5, 6.4), V(0, 2.5, 5.2), V(0, 2.5, -2)), upd: (lt, u) => { const n = Math.floor(clamp(u * 1.4) * 40); line.geometry.setDrawRange(0, n); segs.forEach((s, i) => s.visible = i < n); pop(t, lt, 1.2); } };
});
S('r_bankrupt', () => {
  const g = tower({ night: true }); const n = newspaper('WEWORK FILES FOR BANKRUPTCY', 'November 2023', 2.6); n.position.set(0, 3, 3); n.rotation.x = -.15; g.add(n);
  return { g, sky: NIGHT, night: true, pill: 'BANKRUPT · 2023', pillColor: RED, focus: V(0, 3, 2), cam: dolly(V(0, 3, 10.5), V(0, 3, 8.4), V(0, 2.8, 3)), upd: lt => pop(n, lt, .3) };
});
S('r_once', () => {
  const g = tower({ night: true }); const c = big('$47,000,000,000', '#777777', '#ffffff', 6, 170); c.position.set(0, 12, 2); g.add(c); const x = crossTag(.9); x.position.set(3.4, 13.2, 2.3); g.add(x);
  return { g, sky: NIGHT, night: true, focus: V(0, 8, 0), cam: dolly(V(-3, 6, 26), V(-1, 8, 22), V(0, 11.5, 0)), upd: lt => { pop(c, lt, .2); pop(x, lt, 1.0); } };
});
S('r_end', () => {
  const g = tower({ night: true }); return { g, sky: NIGHT, night: true, title: ['RISE & RUIN', 'WEWORK'], focus: V(0, 6, 0), cam: dolly(V(6, 3, 26), V(-2, 5, 22), V(0, 10, -2)) };
});
S('e_sub', () => {
  const g = tower({ night: true }); return { g, sky: NIGHT, night: true, title: window.SHORT_END || ['FOLLOW', 'RISE & RUIN'], focus: V(0, 6, 0), cam: dolly(V(-4, 3, 24), V(3, 4, 21), V(0, 10, -2)) };
});
