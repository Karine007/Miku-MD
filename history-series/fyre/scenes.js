// Scenes for the Fyre Festival episode (ids match anchors.json).
import { THREE, V, M, B, G, at, box, rbox, cyl, sph, capsule, panel, textTex, canvasTex, flat, sign, tag, pop, person, sit, pose, idle, talk, walk, wave, blink, clock, desk, chair, plant, palm, car, money, newspaper, heart, laptop, frame, ground, strip, clouds, lerp, ease, clamp, backOut, FONT, rr, SKIN, wrap, rng } from './kit.js';
import { dolly, extra, oldMan, office, court, prison, dark, stage, studio, newsroom } from './sets.js';
import { sea, sand, island, beach, jet, yacht, phone, postTex, tent, mattress, suitcase, luggagePile, foamBox, bus, skyline, card, calendar, rain, tv, scaffold, gravel, puddle, crossTag } from './props2.js';

export const SCENES = []; const S = (id, build) => SCENES.push({ id, build });
const IN = ['#cfd8ea', '#ece9ef', '#f6efe8'], OUT = ['#7fc0ec', '#bfe2f4', '#f4ecd8'], DUSK = ['#3a3a6a', '#a06a8a', '#f0a87a'], NIGHT = ['#0f1630', '#22284a', '#3b3460'], GREY = ['#7d8796', '#a3abb6', '#c4c8cc'], PURPLE = ['#2a1f44', '#3a2b5c', '#4a3a6a'];
const ORANGE = '#e8641e', RED = '#d63a3a', GREEN = '#2e8a4a', BLUE = '#2f7de1', PINK = '#d63a7a', GOLD = '#c9902a';
// cast
const billy = (o = {}) => person(Object.assign({ skin: SKIN[0], hair: '#5a3e2a', hairStyle: 'side', top: '#2f4a7a', pants: '#c2ab84', shirt: '#eef2f8', brows: '#4a3424', seed: 101 }, o));
const ja = (o = {}) => person(Object.assign({ skin: SKIN[4], hair: '#1d1714', beard: 1, top: '#1f1f23', pants: '#2a2a30', shirt: false, seed: 102 }, o));
const model = (i, o = {}) => person(Object.assign({ skin: SKIN[[0, 5, 2, 1][i % 4]], hair: ['#3b2a20', '#d8b06a', '#1d1714', '#7a5236'][i % 4], hairStyle: 'long', top: ['#f6f2ee', '#f0a0b8', '#f7d36a', '#8fd0e8'][i % 4], dress: ['#f6f2ee', '#f0a0b8', '#f7d36a', '#8fd0e8'][i % 4], seed: 110 + i }, o));
const guest = (i, o = {}) => extra(i + 60, Object.assign({ top: ['#f26a21', '#f0a0b8', '#7ac0e8', '#f7d36a', '#c58ae8', '#7ac06a'][i % 6], bag: i % 3 === 0 ? '#c9a27a' : null }, o));
const worker = (i, o = {}) => extra(i + 80, Object.assign({ top: ['#f0a03a', '#e2c35a', '#7a9ac9'][i % 3], cap: ['#d64545', '#3f7a52', '#2f4a7a'][i % 3], pants: '#4a4a52' }, o));
const rolle = (o = {}) => person(Object.assign({ skin: SKIN[4], hair: '#1d1714', hairStyle: 'bun', top: '#2e8a8a', coat: '#ffffff', pants: '#3a3a42', smile: 1, seed: 103 }, o));
const spot = (g, x, y, z, tx, ty, tz, c = '#fff4e0', i = 40) => { const s = new THREE.SpotLight(c, i, 24, .5, .5); s.position.set(x, y, z); s.target.position.set(tx, ty, tz); g.add(s, s.target); return s; };
const orange = (s = 1) => rbox(s, s, .06 * s, .06 * s, '#f26a21', 0, 0, 0);
const fmt = n => '$' + Math.round(n).toLocaleString('en-US');
function festStage(o = {}) {
  const g = G(); g.add(box(10, 1.2, 5, '#2a2a33', 0, .6, -3)); g.add(scaffold(11, 6, 5.5, '#3a3d45').translateZ(-.4).translateY(1.2));
  const scr = panel(7, 3, textTex([[o.big || 'FYRE', 220, '#ffffff', 260]], { w: 1400, h: 600, draw: (c, w, h) => { const gr = c.createLinearGradient(0, 0, w, h); gr.addColorStop(0, '#f26a21'); gr.addColorStop(1, '#d63a7a'); c.fillStyle = gr; c.fillRect(0, 0, w, h); } }), 0, 4.1, -5.4, 0, true); g.add(scr);
  const lights = []; for (let i = 0; i < 6; i++) { const l = cyl(.18, .25, .4, '#ddd', -4.5 + i * 1.8, 7, -.5, 12); l.material = B(['#ff9a4a', '#ff5ab0', '#5ad0ff'][i % 3]); g.add(l); lights.push(l); }
  g.userData.lights = lights; return g;
}
function crowd(g, n = 24, z0 = 2, seed = 2, guestFn = guest) { const q = rng(seed); const ps = []; for (let i = 0; i < n; i++) { const p = guestFn(i); p.position.set((q() - .5) * 12, 0, z0 + q() * 6); p.rotation.y = Math.PI + (q() - .5) * .5; g.add(p); ps.push(p); } return ps; }
function lot(o = {}) { const g = o.noGround ? G() : gravel(160, o.c || '#cbbfa8'); if (!o.empty) { const q = rng(o.seed || 8); for (let r = 0; r < (o.rows || 3); r++) for (let i = 0; i < (o.cols || 6); i++) { const t = tent(); t.position.set(-9 + i * 3.6 + (q() - .5) * .3, 0, -4 - r * 4.4); t.rotation.y = (q() - .5) * .12; g.add(t); } } g.add(palm(-14, -10, 1), palm(13, -12, 1.1), palm(16, -4, .9)); return g; }
function runway(o = {}) { const g = G(ground(o.night ? '#2f5a3a' : '#9cc47a'), strip(300, 14, o.night ? '#2c2e38' : '#6a6c74', 0, 0, .01)); for (let i = -20; i < 20; i++) g.add(strip(4, .3, '#f1f1f1', i * 9, 0, .02)); if (!o.night) g.add(clouds()); return g; }
function terminal(o = {}) { const g = room({ w: 14, d: 9, h: 4, wall: '#e6e2d8', side: '#dcd6ca', floor: flat('#b9b4aa', 4) }); const s = sign(o.sign || 'EXUMA INTERNATIONAL AIRPORT', { bg: '#2f6db5', fg: '#fff', w: 5 }); s.position.set(0, 3.2, -4.45); g.add(s); g.add(box(14, 1.8, .05, '#9fc3e4', 0, 1.6, -4.47)); return g; }
import { room } from './kit.js';
function restaurant() { const g = room({ w: 10, d: 7, wall: '#f4d9a0', side: '#eccd8c', floor: flat('#c9a27a', 3) }); const s = sign("EXUMA POINT BAR & GRILLE", { bg: '#2e8a8a', fg: '#fff', w: 3.6 }); s.position.set(0, 2.8, -3.46); g.add(s); g.add(box(5, 1, .7, '#8a5634', 0, .5, -2.4), box(5.1, .06, .8, '#e9e3d8', 0, 1.02, -2.4)); for (const x of [-3.5, 3.5]) g.add(palm(x, -2.8, .5)); return g; }

// ================= HOOK =================
S('h_party', () => {
  const g = G(sand(80, 80, 0, 0, '#d8c49a'), festStage()); const ps = crowd(g, 30, 1.5, 3); const L = g.children[1].userData.lights;
  return { g, sky: NIGHT, night: true, pill: 'THE PARTY OF THE CENTURY', pillColor: ORANGE, focus: V(0, 2, -2), cam: dolly(V(0, 2.2, 11), V(0, 2.8, 8), V(0, 3, -4), V(0, 3.4, -4), 46),
    upd: lt => { ps.forEach((p, i) => { p.position.y = Math.abs(Math.sin(lt * 6 + i)) * .12; p.userData.armR.rotation.z = 2.6 + Math.sin(lt * 6 + i) * .3; }); L.forEach((l, i) => l.visible = Math.sin(lt * 8 + i * 1.7) > -.3); } };
});
S('h_island', () => {
  const g = G(sea(), island(9, 9)); g.add(at(yacht(), 14, 0, 6, .7));
  return { g, sky: OUT, pill: 'A PRIVATE ISLAND', pillColor: BLUE, focus: V(0, 0, 0), sun: [8, 14, 6], cam: u => ({ p: V(Math.sin(u * 1.2) * 26, 13 - u * 2, Math.cos(u * 1.2) * 26), l: V(0, 0, 0), fov: 40 }) };
});
S('h_models', () => {
  const g = beach(); const ms = [0, 1, 2].map(i => at(model(i), -1 + i, 0, 2, 0)); g.add(...ms);
  return { g, sky: OUT, pill: 'SUPERMODELS', pillColor: PINK, focus: V(0, 1, 2), cam: dolly(V(-1.6, 1.3, 7), V(.6, 1.4, 6), V(0, 1.2, 2), V(0, 1.3, 2)),
    upd: lt => ms.forEach((m, i) => { idle(m, lt); walk(m, lt + i, 6, .3); m.position.z = 2 + lt * .25; }) };
});
S('h_jet', () => {
  const g = G(sea(), island(6, 5).translateX(-30).translateZ(-40)); const j = jet(); g.add(j); g.add(clouds(25, -90));
  return { g, sky: OUT, pill: 'PRIVATE JETS', pillColor: BLUE, focus: V(0, 8, 0), cam: dolly(V(12, 9, 16), V(6, 9.5, 14), V(0, 8, 0), V(-4, 8, 0), 42),
    upd: lt => { j.position.set(-lt * 3 + 4, 8 + Math.sin(lt) * .2, 0); j.rotation.set(0, -Math.PI / 2, Math.sin(lt * .8) * .05); } };
});
S('h_villa', () => {
  const g = beach({ palms: 4 }); const v = G(box(8, 3, 5, '#fbf7ee', 0, 1.5, -3), box(8.6, .3, 5.6, '#c9a27a', 0, 3.1, -3), box(6, 2, .05, '#9fc3e4', 0, 1.4, -.45));
  const pool = strip(6, 3, '#5ac8e8', 0, 2.4, .02); g.add(v, pool, box(6.4, .1, 3.4, '#f4f0e6', 0, .0, 2.4)); for (let i = 0; i < 3; i++) g.add(at(G(rbox(.7, .15, 1.8, .05, '#ffffff', 0, .35, 0)), -3.5 + i * 3.5, 0, 5));
  return { g, sky: OUT, pill: 'LUXURY VILLAS', pillColor: GOLD, focus: V(0, 1, 0), cam: dolly(V(-6, 3, 13), V(-2, 2.6, 11), V(0, 1.5, -1), V(0, 1.4, -1)) };
});
S('h_stars', () => {
  const g = G(sand(80, 80, 0, 0, '#d8c49a'), festStage({ big: 'LIVE' })); const st = [extra(1, { top: '#1f1f23' }), extra(4, { top: '#d63a7a' }), extra(7, { top: '#e2b84a' })]; st.forEach((p, i) => g.add(at(p, -2 + i * 2, 1.2, -2.5)));
  const L = g.children[1].userData.lights;
  return { g, sky: NIGHT, night: true, pill: 'THE BIGGEST STARS', pillColor: '#8a3fd1', focus: V(0, 2, -2), cam: dolly(V(-3, 2.4, 6), V(2, 2.4, 5.5), V(0, 2.4, -2.5)),
    upd: lt => { st.forEach((p, i) => { idle(p, lt); p.userData.armR.rotation.z = 2.4 + Math.sin(lt * 5 + i) * .4; }); L.forEach((l, i) => l.visible = Math.sin(lt * 7 + i) > -.2); } };
});
S('h_paid', () => {
  const g = dark('#2c2350'); const ps = [0, 1, 2, 3, 4].map(i => at(guest(i), -2 + i, 0, 0, 0)); g.add(...ps); spot(g, 0, 6, 4, 0, 1, 0, '#ffe9d4', 60);
  const tk = ps.map((p, i) => { const t = tag('$' + [1500, 4000, 12000, 6000, 2500][i].toLocaleString('en-US'), { bg: '#fff', fg: GREEN, h: .3 }); t.position.set(-2 + i, 2.2, 0); g.add(t); return t; });
  return { g, sky: PURPLE, dim: .6, pill: 'PAID A FORTUNE', pillColor: GREEN, focus: V(0, 1, 0), cam: dolly(V(0, 1.6, 5.5), V(0, 1.5, 4.6), V(0, 1.4, 0)),
    upd: lt => { ps.forEach(p => idle(p, lt)); tk.forEach((t, i) => pop(t, lt, .3 + i * .25)); } };
});
S('h_landed', () => {
  const g = runway(); const j = jet({ gear: true }); g.add(j);
  return { g, sky: GREY, dim: .8, pill: 'THEN THEY LANDED', pillColor: '#555', focus: V(0, 1, 0), cam: dolly(V(14, 3, 14), V(10, 2.5, 12), V(0, 2, 0), V(-4, 2, 0), 40),
    upd: lt => { const k = clamp(lt / 3); j.position.set(lerp(18, -6, ease(k)), lerp(3, 1.65, ease(k)), 0); j.rotation.set(0, -Math.PI / 2, 0); j.rotation.x = 0; } };
});
S('h_tents', () => {
  const g = lot(); const rn = rain(g, 700, 30, 10); g.add(puddle(1.2, -2, 1), puddle(.8, 3, 2));
  return { g, sky: GREY, dim: .65, pill: 'DISASTER TENTS', pillColor: RED, focus: V(0, 1, -4), cam: dolly(V(-4, 2.6, 7), V(1, 2.4, 6), V(0, 1, -6)), upd: lt => rn(lt) };
});
S('h_sandwich', () => {
  const g = dark('#2a2440'); const fb = foamBox(0); fb.scale.setScalar(2.4); fb.position.set(0, .9, 0); g.add(fb, cyl(.8, .9, .9, '#efe9f2', 0, .45, 0, 32)); spot(g, 0, 5, 2, 0, 1, 0, '#fff4e0', 60);
  return { g, sky: PURPLE, dim: .4, pill: 'ONE SAD CHEESE SANDWICH', pillColor: ORANGE, pillAt: 1.2, focus: V(0, 1, 0), cam: dolly(V(0, 2.2, 2.6), V(0, 2, 1.9), V(0, 1.1, 0)),
    upd: lt => { fb.userData.lid.rotation.x = -ease((lt - .3) / .8) * 1.9; } };
});
S('h_title', () => {
  const g = G(sea('#3f8fb8'), island(9, 8)); const tl = lot({ rows: 1, cols: 3, noGround: true }); tl.scale.setScalar(.35); tl.position.set(0, .15, 2); g.add(tl);
  return { g, sky: DUSK, dim: .8, title: ['FYRE FESTIVAL', 'RISE & RUIN'], focus: V(0, 0, 0), cam: u => ({ p: V(Math.sin(u * .8 + 2) * 24, 9, Math.cos(u * .8 + 2) * 24), l: V(0, 1, 0), fov: 40 }) };
});

// ================= BILLY =================
S('b_ny', () => {
  const g = G(ground('#9a9aa2'), skyline(), strip(200, 10, '#5b5d66', 0, 4, .01)); g.add(car(-3, 4, Math.PI / 2, '#e8c040'), car(5, 6, -Math.PI / 2, '#d64545'));
  return { g, sky: OUT, pill: 'NEW YORK', pillColor: BLUE, focus: V(0, 5, -20), cam: dolly(V(0, 3, 22), V(0, 6, 16), V(0, 12, -20), V(0, 14, -20), 46) };
});
S('b_billy', () => {
  const g = office({ wall: '#d6dbe8', curtain: '#7aa0d8' }); const b = billy(); g.add(at(b, .3, 0, -.4, -.2)); pose(b, [0, 0, .1], [-.9, 0, -.3], 0, -1.1);
  return { g, sky: IN, name: ['BILLY MCFARLAND', 'ENTREPRENEUR'], focus: V(0, 1.2, -.4), cam: dolly(V(-.8, 1.6, 3.2), V(-.3, 1.6, 2.4), V(.3, 1.5, -.4)), upd: lt => { idle(b, lt); talk(b, lt); } };
});
S('b_card', () => {
  const g = dark('#1e1e26'); const c = rbox(1.7, 1.07, .04, .08, '#151518', 0, 1.4, 0); g.add(c, cyl(.6, .7, .9, '#2a2a33', 0, .45, 0, 32)); spot(g, 0, 5, 3, 0, 1.4, 0, '#fff0d8', 70);
  const t = panel(1.6, 1.0, textTex([['MEMBERS ONLY', 90, '#e8c46a', 120], ['VIP ACCESS', 60, '#9a9aa2', 300, 800], ['•••• 2013', 56, '#cfcfd4', 420, 800]], { bg: '#151518', w: 1024, h: 640 }), 0, 1.4, .025); g.add(t);
  const grp = G(c, t); g.add(grp);
  return { g, sky: PURPLE, dim: .5, pill: 'A CARD FOR RICH KIDS', pillColor: GOLD, focus: V(0, 1.4, 0), cam: dolly(V(.6, 1.6, 2.6), V(0, 1.5, 2.0), V(0, 1.4, 0)), upd: lt => { grp.rotation.y = Math.sin(lt * .8) * .4; grp.position.y = Math.sin(lt * 1.5) * .04; } };
});
S('b_life', () => {
  const g = G(ground('#9a9aa2'), skyline({ n: 18 }), strip(200, 10, '#5b5d66', 0, 2, .01)); const c = car(0, 2, Math.PI / 2 - .3, '#d63a3a'); g.add(c); const b = billy(); g.add(at(b, 1.6, 0, 3.6, -.4)); pose(b, [0, 0, .1], [0, 0, -.1]);
  const tg = tag('$$$', { bg: '#fff', fg: GREEN, h: .4 }); tg.position.set(1.6, 2.4, 3.6); g.add(tg);
  return { g, sky: OUT, pill: 'THE LIFESTYLE', pillColor: GOLD, focus: V(1, 1, 3), cam: dolly(V(4.5, 1.8, 9), V(3.2, 1.6, 7.6), V(.8, 1.1, 2.6)), upd: lt => { idle(b, lt); pop(tg, lt, 1.2); } };
});

// ================= APP =================
S('a_ja', () => {
  const g = studio({ big: 'FYRE MEDIA', small: '2015' }); const b = billy(), j = ja(); g.add(at(b, -.6, 0, -.6, .3), at(j, .6, 0, -.6, -.3)); pose(j, [0, 0, .1], [-.6, 0, -.4], 0, -.8);
  return { g, sky: PURPLE, dim: .7, name: ['JA RULE', 'RAPPER · CO-FOUNDER'], focus: V(0, 1.2, -.6), cam: dolly(V(.4, 1.6, 3.4), V(.2, 1.6, 2.6), V(0, 1.45, -.6)), upd: lt => { idle(b, lt); idle(j, lt); talk(j, lt, lt < 2.5); talk(b, lt, lt > 2.5); } };
});
S('a_app', () => {
  const g = dark('#2c2350'); const scr = canvasTex(400, 800, (c, W, H) => { const gr = c.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#f26a21'); gr.addColorStop(1, '#d63a7a'); c.fillStyle = gr; c.fillRect(0, 0, W, H); c.fillStyle = '#fff'; c.font = FONT(110); c.textAlign = 'center'; c.fillText('FYRE', W / 2, 300); c.font = FONT(34, 800); c.fillText('BOOK A STAR', W / 2, 380); for (let i = 0; i < 3; i++) { c.fillStyle = 'rgba(255,255,255,.9)'; rr(c, 40, 450 + i * 100, W - 80, 80, 20); c.fill(); c.fillStyle = '#d63a7a'; c.font = FONT(30, 900); c.fillText(['DJ · $50,000', 'RAPPER · $250,000', 'POP STAR · $1M'][i], W / 2, 500 + i * 100); } });
  const p = phone(scr, { w: 1 }); p.position.set(0, 1.5, 0); g.add(p); spot(g, 0, 5, 4, 0, 1.5, 0, '#fff4e0', 70);
  return { g, sky: PURPLE, dim: .5, pill: 'AN APP TO BOOK CELEBRITIES', pillColor: ORANGE, focus: V(0, 1.5, 0), cam: dolly(V(.6, 1.6, 4), V(0, 1.5, 3.2), V(0, 1.5, 0)), upd: lt => { p.rotation.y = Math.sin(lt * .7) * .3; } };
});
S('a_plan', () => {
  const g = office({ wall: '#d6dbe8', curtain: '#7aa0d8' }); const b = billy(); g.add(at(b, 0, 0, -.2)); pose(b, [0, 0, .1], [-2.6, 0, -.2], 0, -.4);
  const bl = G(sph(.18, '#fff3a8', 0, 0, 0), cyl(.08, .08, .12, '#b9bcc2', 0, -.2, 0, 12)); bl.children[0].material = B('#fff3a8'); bl.position.set(0, 2.45, -.2); g.add(bl);
  return { g, sky: IN, pill: 'A WILD PLAN', pillColor: ORANGE, focus: V(0, 1.3, -.2), cam: dolly(V(.3, 1.7, 3), V(.1, 1.8, 2.2), V(0, 1.7, -.2)), upd: lt => { idle(b, lt); pop(bl, lt, .5); } };
});
S('a_fest', () => {
  const g = G(sea(), island(10, 8)); const fs = festStage(); fs.scale.setScalar(.45); fs.position.set(0, .15, -2); g.add(fs);
  return { g, sky: OUT, pill: 'A FESTIVAL ON AN ISLAND', pillColor: ORANGE, focus: V(0, 0, 0), sun: [8, 14, 6], cam: dolly(V(-14, 10, 18), V(-6, 7, 14), V(0, 1, -1), V(0, 1.2, -1), 40) };
});

// ================= PROMO =================
S('p_models', () => {
  const g = G(sea(), island(6, 5).translateZ(-30)); const j = jet({ name: 'FYRE' }); g.add(j); g.add(clouds(22, -90));
  return { g, sky: OUT, pill: 'TOP SUPERMODELS', pillColor: PINK, focus: V(0, 8, 0), cam: dolly(V(-10, 10, 12), V(-12, 9, 6), V(0, 8, 0), V(0, 8, -6), 44),
    upd: lt => { j.position.set(0, 8, -lt * 3); j.rotation.set(0, Math.PI, 0); } };
});
S('p_names', () => {
  const g = beach({ palms: 6 }); const ms = [0, 1, 2].map(i => at(model(i), -1.4 + i * 1.4, 0, 2.5, 0)); g.add(...ms); ms.forEach((m, i) => pose(m, [0, 0, .1], [0, 0, -.1]));
  return { g, sky: OUT, pill: 'SUPERMODELS', pillColor: PINK, focus: V(0, 1, 2.5), cam: dolly(V(2, 1.5, 7), V(-1, 1.5, 6.5), V(0, 1.3, 2.5)), upd: lt => ms.forEach((m, i) => { idle(m, lt); if (i === 1) wave(m, lt); }) };
});
S('p_yacht', () => {
  const g = G(sea()); const y = yacht(); g.add(at(y, 0, 0, 0, .3)); const ms = [0, 2].map(i => { const m = model(i); m.position.set(-.4 + i * .4, 1.8, -.8); g.add(m); return m; });
  const pigs = []; for (let i = 0; i < 3; i++) { const p = G(sph(.35, '#f0b6b0', 0, 0, 0, 1.4, 1, 1), sph(.2, '#f0b6b0', .45, .08, 0)); p.position.set(4 + i * .9, -.05, 3 + i * .6); g.add(p); pigs.push(p); }
  g.add(island(5, 3).translateX(10).translateZ(-6));
  return { g, sky: OUT, pill: 'YACHTS, PIGS & WHITE SAND', pillColor: BLUE, focus: V(0, 1, 0), cam: dolly(V(10, 4, 12), V(7, 3.5, 10), V(1, 1.5, 0), V(2, 1.2, 1)), upd: lt => { y.position.y = Math.sin(lt * 1.3) * .08; ms.forEach(m => idle(m, lt)); pigs.forEach((p, i) => p.position.y = -.05 + Math.sin(lt * 2 + i) * .04); } };
});
S('p_day', () => {
  const g = dark('#2c2350'); const ps = []; for (let i = 0; i < 9; i++) { const p = phone(postTex(['bella', 'emily', 'hailey', 'kendall', 'model', 'influencer', 'dj', 'star', 'icon'][i], ['2.1M', '980K', '1.4M', '3.2M', '540K', '210K', '120K', '1.1M', '760K'][i]), { w: .58 }); p.position.set(-1.5 + (i % 3) * 1.5, .55 + Math.floor(i / 3) * 1.25, -.2 * (i % 2)); g.add(p); ps.push(p); }
  return { g, sky: PURPLE, dim: .7, pill: 'ONE DAY · HUNDREDS OF POSTS', pillColor: ORANGE, focus: V(0, 1.7, 0), cam: dolly(V(0, 1.7, 6.6), V(0, 1.7, 5.8), V(0, 1.7, 0)), upd: lt => ps.forEach((p, i) => pop(p, lt, i * .18, .35)) };
});
S('p_orange', () => {
  const g = dark('#2a2440'); const o = orange(1.6); o.position.set(0, 1.6, 0); g.add(o); spot(g, 0, 6, 4, 0, 1.6, 0, '#fff4e0', 80);
  return { g, sky: PURPLE, dim: .5, pill: 'A SIMPLE ORANGE SQUARE', pillColor: ORANGE, focus: V(0, 1.6, 0), cam: dolly(V(0, 1.6, 4.6), V(0, 1.6, 3.6), V(0, 1.6, 0)), upd: lt => { o.rotation.y = Math.sin(lt * .9) * .5; o.rotation.x = Math.sin(lt * .6) * .1; } };
});
S('p_kendall', () => {
  const g = dark('#2c2350'); const p = phone(postTex('kendall', '3.2M'), { w: 1 }); p.position.set(-.5, 1.5, 0); g.add(p); spot(g, 0, 5, 4, 0, 1.5, 0, '#fff4e0', 60);
  const t = tag('$250,000', { bg: '#fff', fg: GREEN, h: .55 }); t.position.set(.9, 2.1, .3); g.add(t); const t2 = tag('FOR ONE POST', { bg: GREEN, fg: '#fff', h: .3 }); t2.position.set(.9, 1.55, .3); g.add(t2);
  return { g, sky: PURPLE, dim: .5, focus: V(0, 1.5, 0), cam: dolly(V(.2, 1.6, 4.4), V(.2, 1.6, 3.6), V(.1, 1.6, 0)), upd: lt => { pop(t, lt, .8); pop(t2, lt, 1.3); p.rotation.y = .2 + Math.sin(lt) * .05; } };
});

// ================= TICKETS =================
S('t_magic', () => {
  const g = dark('#2c2350'); const ts = []; const q = rng(5); for (let i = 0; i < 40; i++) { const t = G(rbox(.5, .25, .02, .03, '#f26a21', 0, 0, 0)); t.userData.v = [(q() - .5) * 3, 2 + q() * 3, (q() - .5) * 2, q() * 6]; g.add(t); ts.push(t); }
  return { g, sky: PURPLE, dim: .7, pill: 'IT WORKED', pillColor: ORANGE, focus: V(0, 1.5, 0), cam: dolly(V(0, 1.6, 6), V(0, 1.8, 5), V(0, 1.8, 0)),
    upd: lt => ts.forEach((t, i) => { const [vx, vy, vz, r] = t.userData.v; const k = Math.max(0, lt - i * .04); t.position.set(vx * k, .5 + vy * k - 2 * k * k, vz * k); t.rotation.set(r * k, r * k * .5, 0); t.visible = k > 0 && t.position.y > -1; }) };
});
S('t_price', () => {
  const g = dark('#2c2350'); const tk = card([['FYRE FESTIVAL', 90, '#fff', 90], ['', 10, '#fff', 0]], { w: 3.4, cw: 1024, h: 460, bg: '#f26a21' }); tk.position.set(0, 1.9, 0); g.add(tk); spot(g, 0, 5, 4, 0, 1.6, 0, '#fff4e0', 60);
  const pt = card([['$500', 220, GREEN, 140]], { w: 2.4, cw: 1024, h: 280, bg: '#ffffff' }); pt.position.set(0, 1.75, .05); g.add(pt);
  return { g, sky: PURPLE, dim: .5, pill: 'UP TO $12,000', pillColor: GREEN, pillAt: 2.2, focus: V(0, 1.7, 0), cam: dolly(V(0, 1.8, 4.6), V(0, 1.8, 4), V(0, 1.75, 0)),
    upd: lt => { const v = lt < .8 ? 500 : Math.min(12000, 500 + (lt - .8) * 8000); const s = fmt(Math.round(v / 100) * 100); if (pt.userData.s !== s) { pt.userData.s = s; const c = pt.material.map.userData.ctx, cv = pt.material.map.userData.canvas; c.fillStyle = '#fff'; c.fillRect(0, 0, cv.width, cv.height); c.fillStyle = GREEN; c.font = FONT(220); c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(s, cv.width / 2, 140); pt.material.map.needsUpdate = true; } } };
});
S('t_promise', () => {
  const g = dark('#2c2350'); const items = [['🏝', 'LUXURY VILLAS'], ['✈', 'PRIVATE JETS'], ['🍽', 'CHEF MEALS']].map((x, i) => { const c = card([[x[1], 80, '#fff', 128]], { w: 1.6, cw: 800, h: 256, bg: ['#2e8a8a', '#2f6db5', '#c9902a'][i] }); c.position.set(-1.8 + i * 1.8, 1.6, 0); g.add(c); return c; });
  spot(g, 0, 5, 4, 0, 1.5, 0, '#fff4e0', 60);
  return { g, sky: PURPLE, dim: .6, pill: 'THE PROMISE', pillColor: GOLD, focus: V(0, 1.6, 0), cam: dolly(V(0, 1.7, 6.4), V(0, 1.7, 5.6), V(0, 1.6, 0)), upd: lt => items.forEach((c, i) => pop(c, lt, .3 + i * .45)) };
});
S('t_lineup', () => {
  const g = dark('#2a2440'); const pst = card([['FYRE FESTIVAL', 100, '#fff', 110], ['BLINK-182', 120, '#ffe08a', 300], ['MIGOS', 110, '#fff', 450], ['MAJOR LAZER', 110, '#fff', 600], ['+ MORE', 60, '#ffd0b0', 760, 800]], { w: 2.6, cw: 1024, h: 900, draw: (c, w, h) => { const gr = c.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#f26a21'); gr.addColorStop(1, '#d63a7a'); c.fillStyle = gr; c.fillRect(0, 0, w, h); } });
  pst.position.set(0, 1.9, 0); g.add(pst); spot(g, 0, 5, 4, 0, 1.9, 0, '#fff4e0', 70);
  return { g, sky: PURPLE, dim: .5, pill: 'THE LINEUP', pillColor: '#8a3fd1', focus: V(0, 1.9, 0), cam: dolly(V(.4, 1.9, 4.4), V(0, 1.9, 3.4), V(0, 1.9, 0)) };
});
S('t_bought', () => {
  const g = G(ground('#9a9aa2'), skyline({ n: 18 })); const ps = []; const q = rng(4); for (let i = 0; i < 14; i++) { const p = guest(i); p.position.set((q() - .5) * 10, 0, (q() - .5) * 5); p.rotation.y = q() * 6; pose(p, [0, 0, .1], [-1.2, 0, -.3], 0, -1); g.add(p); ps.push(p); const ph = phone('#f26a21', { w: .1 }); ph.position.set(.12, 1.25, .35); p.add(ph); }
  return { g, sky: OUT, pill: 'THOUSANDS BOUGHT IN', pillColor: ORANGE, focus: V(0, 1, 0), cam: dolly(V(0, 4, 10), V(0, 3, 8), V(0, 1, 0)), upd: lt => ps.forEach(p => idle(p, lt)) };
});

// ================= PROBLEMS =================
S('x_problem', () => {
  const g = office({ wall: '#d6dbe8', curtain: '#7aa0d8' }); const b = billy({ brow: -.2 }); g.add(at(b, .3, 0, -.6)); pose(b, [-2.4, 0, .6], [-2.4, 0, -.6], -1.6, -1.6);
  return { g, sky: IN, pill: 'NO FESTIVAL', pillColor: RED, pillAt: 1.2, focus: V(0, 1.3, -.6), cam: dolly(V(.4, 1.6, 2.6), V(.3, 1.6, 2.0), V(.3, 1.5, -.6)), upd: lt => idle(b, lt) };
});
S('x_lost', () => {
  const g = G(sea(), island(8, 7)); const x = crossTag(2.2); x.position.set(0, 4, 0); g.add(x);
  return { g, sky: OUT, pill: 'FIRST ISLAND LOST', pillColor: RED, focus: V(0, 0, 0), cam: dolly(V(-16, 12, 18), V(-10, 10, 16), V(0, 1, 0)), upd: lt => pop(x, lt, .8) };
});
S('x_gravel', () => {
  const g = lot({ empty: true }); g.add(at(G(box(3, 1.4, 2, '#e0b83a', 0, 1, 0), box(1.4, .8, 1.6, '#e0b83a', 1.8, .9, 0)), 5, 0, -4, .3));
  return { g, sky: OUT, pill: 'A BARE GRAVEL LOT', pillColor: '#8a7a5a', focus: V(0, 0, -3), cam: dolly(V(-8, 5, 12), V(-3, 4, 10), V(0, 0, -3)) };
});
S('x_none', () => {
  const g = lot({ empty: true }); const ts = ['NO WATER', 'NO TOILETS', 'NO HOUSES'].map((s, i) => { const t = tag(s, { bg: RED, fg: '#fff', h: .5 }); t.position.set(-3 + i * 3, 2, -2); g.add(t); return t; });
  return { g, sky: OUT, focus: V(0, 1, -2), cam: dolly(V(0, 2.4, 8), V(0, 2.2, 7), V(0, 1.6, -2)), upd: lt => ts.forEach((t, i) => pop(t, lt, .2 + i * .7)) };
});
S('x_experts', () => {
  const g = boardroom(); const ex = [oldMan(0), oldMan(2)]; g.add(at(ex[0], -1.4, 0, -1.6, .4), at(ex[1], -.4, 0, -1.8, .2)); const b = billy(); g.add(at(b, 1.4, 0, -1.2, -.6)); pose(b, [0, 0, .1], [-1.2, 0, -.3], 0, -1); const ph = phone('#f26a21', { w: .1 }); ph.position.set(.12, 1.25, .35); b.add(ph);
  return { g, sky: IN, pill: 'IMPOSSIBLE', pillColor: RED, focus: V(0, 1.2, -1.5), cam: dolly(V(0, 1.7, 3.6), V(.4, 1.7, 3), V(0, 1.4, -1.5)), upd: lt => { ex.forEach((e, i) => { idle(e, lt); e.userData.head.rotation.y = Math.sin(lt * 5 + i) * .25; }); idle(b, lt); } };
});
import { boardroom } from './sets.js';

// ================= MONEY =================
S('m_out', () => {
  const g = dark('#2c2350'); const st = money(9, 0, 0); st.position.y = .9; g.add(st, cyl(1.2, 1.3, .9, '#efe9f2', 0, .45, 0, 32)); spot(g, 0, 5, 3, 0, 1, 0, '#fff4e0', 60);
  return { g, sky: PURPLE, dim: .5, pill: 'MONEY RUNNING OUT', pillColor: RED, focus: V(0, 1, 0), cam: dolly(V(0, 2.4, 3.6), V(0, 2.2, 3.0), V(0, 1, 0)), upd: lt => st.children.forEach((s, i) => s.visible = lt < 4.5 - i * .45) };
});
S('m_borrow', () => {
  const g = office({ wall: '#d6dbe8', curtain: '#7aa0d8' }); const b = billy(); g.add(sit(at(b, .3, 0, -.4, Math.PI))); g.add(chair(.3, -.35, Math.PI));
  const doc = card([['REVENUE', 70, '#333', 70], ['$ 9,000,000', 90, GREEN, 200], ['(REALLY: $60,000)', 50, RED, 330, 800]], { w: .9, cw: 600, h: 420 }); doc.position.set(.3, 1.5, -1.6); g.add(doc);
  return { g, sky: IN, pill: 'LIED TO INVESTORS', pillColor: RED, focus: V(0, 1.2, -1), cam: dolly(V(1.4, 1.7, 1.6), V(1.0, 1.6, 1.0), V(.3, 1.4, -1.4)), upd: lt => { idle(b, lt); } };
});
S('m_workers', () => {
  const g = lot({ empty: true, c: '#8a826e' }); const ws = [0, 1, 2, 3, 4].map(i => at(worker(i), -4 + i * 2, 0, -2 + (i % 2), i * .7)); g.add(...ws); const lights = []; for (const x of [-5, 5]) { const l = new THREE.PointLight('#ffe0a0', 20, 14); l.position.set(x, 4, 0); g.add(l, cyl(.06, .06, 4, '#555', x, 2, 0, 8)); }
  for (let i = 0; i < 4; i++) g.add(at(G(box(2.4, .2, .2, '#c9a27a', 0, .1, 0)), -3 + i * 2, 0, 1, i));
  return { g, sky: NIGHT, night: true, pill: 'BUILDING DAY AND NIGHT', pillColor: GOLD, focus: V(0, 1, -1), cam: dolly(V(-3, 2.2, 7), V(2, 2.2, 6.5), V(0, 1, -1)), upd: lt => ws.forEach((w, i) => { idle(w, lt); w.userData.armR.rotation.x = -1.2 + Math.sin(lt * 7 + i) * .6; }) };
});
S('m_tents', () => {
  const g = lot({ rows: 4, cols: 7 });
  return { g, sky: OUT, pill: 'DISASTER RELIEF TENTS', pillColor: RED, focus: V(0, 0, -6), cam: dolly(V(-12, 9, 10), V(-4, 7, 9), V(0, 0, -8)) };
});

// ================= ARRIVAL =================
S('r_date', () => {
  const g = dark('#2c2350'); const c = calendar('APRIL', '27', '2017', ORANGE); c.position.set(0, 1.6, 0); g.add(c); spot(g, 0, 5, 4, 0, 1.6, 0, '#fff4e0', 60);
  return { g, sky: PURPLE, dim: .5, focus: V(0, 1.6, 0), cam: dolly(V(0, 1.6, 3.6), V(0, 1.6, 2.8), V(0, 1.6, 0)), upd: lt => pop(c, lt, .1) };
});
S('r_planes', () => {
  const g = runway(); const j = jet({ gear: true }); j.position.set(0, 1.65, 0); j.rotation.y = -Math.PI / 2; g.add(j);
  const ps = [0, 1, 2].map(i => at(guest(i), -2 + i * 1.2, 0, 3.5, Math.PI * .1)); g.add(...ps);
  return { g, sky: OUT, pill: 'THE FIRST PLANES LAND', pillColor: BLUE, focus: V(0, 1, 2), cam: dolly(V(6, 2, 12), V(3, 1.8, 10), V(0, 1.6, 1)), upd: lt => ps.forEach((p, i) => { walk(p, lt + i); p.position.z = 3.5 + lt * .6; }) };
});
S('r_bus', () => {
  const g = G(ground('#9cc47a'), strip(200, 8, '#6a6c74', 0, 0, .01)); const bs = bus(); bs.rotation.y = Math.PI / 2; g.add(bs); g.add(palm(-6, -6, 1), palm(5, -7, 1.1));
  const ps = [0, 1, 2, 3].map(i => { const p = guest(i + 2); p.position.set(-3 + i * .9, 0, 2.6); g.add(p); return p; });
  return { g, sky: OUT, pill: 'READY FOR PARADISE', pillColor: ORANGE, focus: V(0, 1, 0), cam: dolly(V(-5, 2, 9), V(-1, 2, 8), V(0, 1.4, 0)), upd: lt => ps.forEach((p, i) => { walk(p, lt + i, 6, .35); p.position.x = -3 + i * .9 + lt * .5; p.rotation.y = Math.PI / 2; }) };
});
S('r_zone', () => {
  const g = lot({ rows: 3, cols: 6 }); const rn = rain(g, 500, 30, 10, 4); g.add(puddle(1.5, 0, 1), luggagePile(10).translateX(4).translateZ(1));
  const ps = [0, 1].map(i => at(guest(i + 4), -1.4 + i * 1.2, 0, 2.6, Math.PI)); g.add(...ps); ps.forEach(p => pose(p, [-2.4, 0, .6], [-2.4, 0, -.6], -1.6, -1.6));
  return { g, sky: DUSK, dim: .7, pill: 'A DISASTER ZONE', pillColor: RED, focus: V(0, 1, -2), cam: dolly(V(0, 1.8, 6.4), V(0, 2.2, 5.4), V(0, 1.2, -3)), upd: lt => { rn(lt); ps.forEach(p => idle(p, lt)); } };
});
S('r_mattress', () => {
  const g = G(gravel(40, '#a89e8a')); const t = tent(); g.add(t); const m = mattress(); m.position.set(.2, 0, 2.4); m.rotation.y = .3; g.add(m); const rn = rain(g, 400, 12, 8, 6);
  return { g, sky: GREY, dim: .55, pill: 'WET MATTRESSES', pillColor: BLUE, focus: V(0, .5, 0), cam: dolly(V(.8, 1.7, 5.6), V(.6, 1.4, 4.6), V(.2, .4, 2.2)), upd: lt => rn(lt) };
});
S('r_luggage', () => {
  const g = G(gravel(60, '#7a7262')); const lp = luggagePile(18, 7); g.add(lp); const ps = [0, 1, 2].map(i => at(guest(i + 1), -2 + i * 2, 0, 2.2, Math.PI + (i - 1) * .4)); g.add(...ps);
  const fl = new THREE.SpotLight('#fff2c8', 30, 12, .3, .6); fl.position.set(0, 3.6, 3.4); fl.target.position.set(0, 0, 0); g.add(fl, fl.target);
  return { g, sky: NIGHT, night: true, pill: 'LUGGAGE DUMPED IN THE DARK', pillColor: '#555', focus: V(0, .5, 0), cam: dolly(V(2, 2.2, 5.6), V(.5, 2, 4.8), V(0, .5, 0)), upd: lt => { ps.forEach(p => idle(p, lt)); fl.target.position.x = Math.sin(lt * 1.3) * 1.2; } };
});
S('r_stage', () => {
  const g = G(gravel(80, '#a89e8a')); const sc = scaffold(10, 5, 4, '#6a6f78'); sc.position.set(0, 0, -3); g.add(sc); g.add(box(3, .6, 2, '#5a5a62', -2, .3, -4));
  const x = tag('NO STAGE', { bg: RED, fg: '#fff', h: .6 }); x.position.set(0, 3, 0); g.add(x); const bx = tag('BLINK-182 PULLED OUT', { bg: '#fff', fg: RED, h: .36 }); bx.position.set(0, 2.2, 0); g.add(bx);
  return { g, sky: GREY, dim: .75, focus: V(0, 2, -2), cam: dolly(V(-2, 2.4, 8), V(1, 2.4, 7), V(0, 2.4, -2)), upd: lt => { pop(bx, lt, .6); pop(x, lt, 2.6); } };
});

// ================= SANDWICH =================
S('s_food', () => {
  const g = dark('#2a2440'); const fb = foamBox(0); fb.scale.setScalar(2.4); fb.position.set(0, .9, 0); g.add(fb, cyl(.8, .9, .9, '#efe9f2', 0, .45, 0, 32)); spot(g, 0, 5, 2, 0, 1, 0, '#fff4e0', 60);
  const t = tag('GOURMET?', { bg: '#fff', fg: GOLD, h: .4 }); t.position.set(0, 1.9, 0); g.add(t);
  return { g, sky: PURPLE, dim: .4, focus: V(0, 1, 0), cam: dolly(V(1.2, 2, 3), V(.6, 1.9, 2.4), V(0, 1.1, 0)), upd: lt => pop(t, lt, .8) };
});
S('s_box', () => {
  const g = dark('#2a2440'); const fb = foamBox(1); fb.scale.setScalar(3); fb.position.set(0, .9, 0); g.add(fb, cyl(.9, 1, .9, '#efe9f2', 0, .45, 0, 32)); spot(g, 0, 5, 2, 0, 1, 0, '#fff4e0', 70);
  return { g, sky: PURPLE, dim: .4, pill: 'BREAD · CHEESE · SALAD', pillColor: ORANGE, pillAt: 1.5, focus: V(0, 1.2, 0), cam: dolly(V(0, 2.4, 1.9), V(-.3, 2.1, 1.4), V(-.2, 1.3, 0), V(-.3, 1.4, 0)) };
});
S('s_photo', () => {
  const g = G(gravel(40, '#a89e8a')); const t = tent(); t.position.z = -3; g.add(t); const p = guest(2); g.add(at(p, 0, 0, 0)); pose(p, [-1.4, 0, .2], [-1.4, 0, -.2], -.4, -.4);
  const fb = foamBox(1); fb.position.set(0, .78, .55); fb.scale.setScalar(.8); g.add(fb, at(G(box(.8, .76, .5, '#c9a27a', 0, .38, 0)), 0, 0, .6));
  const ph = phone(canvasTex(400, 800, (c, W, H) => { c.fillStyle = '#222'; c.fillRect(0, 0, W, H); c.fillStyle = '#f4f2ea'; c.fillRect(60, 260, 280, 260); c.fillStyle = '#ead6a4'; c.fillRect(90, 300, 130, 130); c.fillStyle = '#f2c84a'; c.fillRect(100, 310, 110, 110); c.fillStyle = '#7ac06a'; c.beginPath(); c.arc(270, 380, 40, 0, 7); c.fill(); c.fillStyle = '#fff'; c.beginPath(); c.arc(W / 2, 700, 40, 0, 7); c.fill(); }), { w: .2 }); ph.position.set(0, 1.35, .35); ph.rotation.x = -.5; g.add(ph);
  const fl = new THREE.PointLight('#ffffff', 0, 4); fl.position.set(0, 1.4, .5); g.add(fl);
  return { g, sky: OUT, pill: 'ONE PHOTO', pillColor: BLUE, focus: V(0, 1, 0), cam: dolly(V(-2.4, 1.9, 3.4), V(-1.8, 1.8, 2.8), V(0, 1.25, .3)), upd: lt => { idle(p, lt); fl.intensity = lt > 1.6 && lt < 1.8 ? 40 : 0; } };
});
S('s_world', () => {
  const t = canvasTex(1024, 512, (c, w, h) => { c.fillStyle = '#5aa0d8'; c.fillRect(0, 0, w, h); c.fillStyle = '#7cc46a'; [[180, 150, 120, 90], [260, 330, 70, 110], [520, 140, 90, 60], [560, 300, 80, 110], [760, 170, 150, 80], [840, 360, 60, 40]].forEach(([x, y, rx, ry]) => { c.beginPath(); c.ellipse(x, y, rx, ry, 0, 0, 7); c.fill(); }); });
  const g = dark('#1e1a33'); const gl = new THREE.Mesh(new THREE.SphereGeometry(1.3, 48, 32), M('#fff', { map: t })); gl.position.set(0, 1.7, 0); g.add(gl); spot(g, 2, 5, 5, 0, 1.7, 0, '#fff', 60);
  const ics = []; const q = rng(9); for (let i = 0; i < 14; i++) { const s = tag(['LOL', 'OMG', '#FYRE', 'WOW', 'NO WAY'][i % 5], { bg: '#fff', fg: ORANGE, h: .3 }); const a = q() * 6.28, b = (q() - .5) * 2; s.position.set(Math.cos(a) * 1.7, 1.7 + b, Math.sin(a) * 1.7); g.add(s); ics.push(s); }
  return { g, sky: PURPLE, dim: .6, pill: 'AROUND THE WORLD', pillColor: ORANGE, focus: V(0, 1.7, 0), cam: dolly(V(0, 1.8, 5.2), V(0, 1.8, 4.4), V(0, 1.7, 0)), upd: lt => { gl.rotation.y = lt * .4; ics.forEach((s, i) => pop(s, lt, .3 + i * .2, .3)); } };
});
S('s_airport', () => {
  const g = terminal(); const ps = []; const q = rng(12); for (let i = 0; i < 16; i++) { const p = guest(i); p.position.set((q() - .5) * 10, 0, -2 + q() * 4); p.rotation.y = Math.PI + (q() - .5); g.add(p); ps.push(p); if (i % 3 === 0) { const s = suitcase(i); s.position.set(p.position.x + .35, 0, p.position.z); g.add(s); } }
  const ck = clock(4.5, 2.8, -4.4, .35); g.add(ck);
  return { g, sky: IN, pill: 'STUCK AT THE AIRPORT', pillColor: '#555', focus: V(0, 1.2, -1), cam: dolly(V(-1, 2.2, 7), V(1, 2, 6), V(0, 1.6, -2)), upd: lt => { ps.forEach(p => idle(p, lt)); ck.userData.hands[1].rotation.z = -lt * 2; ck.userData.hands[0].rotation.z = -lt * .2; } };
});
S('s_cancel', () => {
  const g = G(gravel(80, '#a89e8a')); const t = lot({ rows: 2, cols: 5 }); g.add(t); const s = card([['CANCELLED', 170, '#fff', 128]], { w: 4, cw: 1024, h: 256, bg: RED }); s.position.set(0, 2.6, 2); g.add(s);
  return { g, sky: GREY, dim: .8, focus: V(0, 2, 0), cam: dolly(V(0, 2.6, 9), V(0, 2.6, 7.6), V(0, 2.4, 0)), upd: lt => { pop(s, lt, .4); s.rotation.z = lt > .4 ? Math.sin(Math.min(lt - .4, 1) * 12) * .06 * (1 - Math.min(1, lt - .4)) : 0; } };
});

// ================= FALL =================
S('f_fallout', () => {
  const g = dark('#2c2350'); const n = newspaper('LUXURY FESTIVAL ENDS IN CHAOS', 'Guests stranded in the Bahamas', 1.6); n.position.set(0, 1.6, 0); g.add(n); spot(g, 0, 5, 4, 0, 1.6, 0, '#fff4e0', 70);
  return { g, sky: PURPLE, dim: .5, pill: 'HUGE FALLOUT', pillColor: RED, focus: V(0, 1.6, 0), cam: dolly(V(.3, 1.6, 4.4), V(0, 1.6, 3.4), V(0, 1.6, 0)), upd: lt => { n.rotation.z = (1 - ease(lt / .8)) * 3; n.scale.setScalar(Math.max(.01, ease(lt / .8))); } };
});
S('f_law', () => {
  const g = dark('#2c2350'); const ps = []; const q = rng(13); for (let i = 0; i < 26; i++) { const p = card([['LAWSUIT', 90, RED, 90], ['', 1, '#000', 0]], { w: .7, cw: 512, h: 660 }); p.userData.v = [(q() - .5) * 4, 4 + q() * 3, (q() - .5) * 1.5, q() * 3, i * .12]; g.add(p); ps.push(p); }
  return { g, sky: PURPLE, dim: .6, pill: 'LAWSUITS POURED IN', pillColor: RED, focus: V(0, 1.5, 0), cam: dolly(V(0, 1.6, 5.6), V(0, 1.6, 4.8), V(0, 1.5, 0)),
    upd: lt => ps.forEach(p => { const [x, y, z, r, d] = p.userData.v; const k = Math.max(0, lt - d); p.position.set(x, Math.max(.05, y - k * 2.2), z); p.rotation.set(-Math.PI / 2 * clamp((y - p.position.y) / y), 0, r * k * .3); p.visible = lt > d; }) };
});
S('f_unpaid', () => {
  const g = lot({ empty: true, c: '#b8ae98' }); const ws = [0, 1, 2, 3].map(i => at(worker(i), -2.4 + i * 1.6, 0, 0, 0)); g.add(...ws); ws.forEach(w => pose(w, [0, 0, .1], [0, 0, -.1]));
  const t = tag('UNPAID', { bg: RED, fg: '#fff', h: .5 }); t.position.set(0, 2.5, 0); g.add(t);
  return { g, sky: GREY, dim: .85, focus: V(0, 1.2, 0), cam: dolly(V(0, 1.7, 5.6), V(0, 1.6, 4.6), V(0, 1.3, 0)), upd: lt => { ws.forEach(w => { idle(w, lt); w.userData.head.rotation.x = .25; }); pop(t, lt, .8); } };
});
S('f_rolle', () => {
  const g = restaurant(); const r = rolle(); g.add(at(r, 0, 0, -1.6)); pose(r, [-1, 0, .3], [-1, 0, -.3], -.8, -.8); const m = money(3, 0, -1.1); m.position.y = 1.05; m.scale.setScalar(.5); g.add(m);
  const ws = [extra(3), extra(6)]; g.add(at(ws[0], -1.6, 0, -.6, .5), at(ws[1], 1.6, 0, -.6, -.5));
  return { g, sky: IN, name: ['MARYANN ROLLE', 'RESTAURANT OWNER · EXUMA'], pill: '$50,000 OF HER SAVINGS', pillColor: GREEN, pillAt: 2.4, focus: V(0, 1.2, -1.2), cam: dolly(V(.4, 1.6, 3), V(.2, 1.6, 2.4), V(0, 1.4, -1.4)), upd: lt => { idle(r, lt); talk(r, lt); ws.forEach(w => idle(w, lt)); } };
});
S('f_guilty', () => {
  const g = court(); const b = billy({ top: '#2b2f3d', pants: '#2b2f3d', tie: '#7a1c2b' }); g.add(at(b, -1.8, 0, .4, Math.PI * .95));
  return { g, sky: IN, pill: 'GUILTY OF FRAUD', pillColor: RED, pillAt: 1.4, focus: V(0, 1.5, -2), cam: dolly(V(-3.4, 1.8, 4.2), V(-2.6, 1.8, 3.4), V(-.6, 1.5, -2.4)), upd: lt => { idle(b, lt); idle(g.userData.judge, lt); } };
});
S('f_bail', () => {
  const g = office({ wall: '#cfc8d8', curtain: '#8a7aa8' }); const b = billy(); g.add(sit(at(b, .3, 0, -.4, Math.PI))); g.add(chair(.3, -.35, Math.PI));
  const tks = ['MET GALA', 'BURNING MAN', 'GRAMMYS', 'COACHELLA'].map((s, i) => { const t = tag(s, { bg: '#fff', fg: '#8a3fd1', h: .26 }); t.position.set(-1.2 + i * .8, 1.9 + (i % 2) * .3, -1.6); g.add(t); return t; });
  const fk = tag('FAKE TICKETS', { bg: RED, fg: '#fff', h: .32 }); fk.position.set(.3, 2.5, -1.6); g.add(fk);
  return { g, sky: IN, pill: 'ANOTHER SCAM, ON BAIL', pillColor: RED, focus: V(0, 1.6, -1.4), cam: dolly(V(1.2, 1.8, 2.4), V(.8, 1.8, 1.8), V(0, 1.8, -1.6)), upd: lt => { idle(b, lt); tks.forEach((t, i) => pop(t, lt, .3 + i * .3)); pop(fk, lt, 2); } };
});
S('f_prison', () => {
  const g = prison(); const b = billy({ top: '#e98a3a', pants: '#e98a3a', shirt: false }); g.add(at(b, 0, 0, -2.4)); pose(b, [0, 0, .1], [0, 0, -.1]);
  return { g, sky: OUT, pill: '6 YEARS IN PRISON', pillColor: RED, focus: V(0, 1, -2), cam: dolly(V(0, 1.6, 6), V(0, 1.6, 5), V(0, 1.4, -2.4)), upd: lt => idle(b, lt) };
});

// ================= END =================
S('e_docs', () => {
  const g = room({ w: 8, d: 6, wall: '#cfc8e0', side: '#c6bdd8', floor: flat('#b9a28c', 3) }); const tex = textTex([['FYRE', 150, '#fff', 110], ['THE DOCUMENTARY', 46, '#ffd0b0', 210, 800]], { w: 600, h: 300, bg: '#d6501e' });
  const t = tv(tex, 2); t.position.set(0, 1.6, -2.9); g.add(t); const sofa = G(rbox(2.6, .45, .9, .1, '#7a5ac9', 0, .4, 0), rbox(2.6, .6, .25, .1, '#7a5ac9', 0, .8, .35)); g.add(at(sofa, 0, 0, 1.2));
  const ps = [0, 1, 2].map(i => { const p = extra(i + 30); g.add(sit(at(p, -.8 + i * .8, 0, 1.1, Math.PI))); return p; });
  return { g, sky: IN, dim: .7, pill: 'MILLIONS WATCHED', pillColor: '#8a3fd1', focus: V(0, 1.2, -1), cam: dolly(V(-1.2, 1.6, 3.6), V(-.6, 1.5, 3.0), V(0, 1.4, -1.6)), upd: lt => ps.forEach(p => idle(p, lt)) };
});
S('e_released', () => {
  const g = prison(); const b = billy(); g.add(b);
  return { g, sky: OUT, pill: 'RELEASED · 2022', pillColor: BLUE, focus: V(0, 1, 0), cam: dolly(V(2, 1.6, 7), V(1, 1.6, 6), V(0, 1.4, 1)), upd: lt => { walk(b, lt); b.position.set(0, 0, 1.6 + lt * .7); } };
});
S('e_two', () => {
  const g = dark('#2c2350'); const s = card([['FYRE FESTIVAL', 120, '#fff', 120], ['II', 260, '#fff', 340]], { w: 3, cw: 1024, h: 520, draw: (c, w, h) => { const gr = c.createLinearGradient(0, 0, w, h); gr.addColorStop(0, '#f26a21'); gr.addColorStop(1, '#d63a7a'); c.fillStyle = gr; c.fillRect(0, 0, w, h); } });
  s.position.set(0, 1.8, 0); g.add(s); spot(g, 0, 5, 4, 0, 1.8, 0, '#fff4e0', 70); const q = tag('?!', { bg: '#fff', fg: RED, h: .6 }); q.position.set(1.8, 2.8, .3); g.add(q);
  return { g, sky: PURPLE, dim: .5, pill: 'FYRE FESTIVAL 2', pillColor: ORANGE, focus: V(0, 1.8, 0), cam: dolly(V(0, 1.8, 4.6), V(0, 1.8, 3.8), V(0, 1.9, 0)), upd: lt => { pop(s, lt, .2); pop(q, lt, 1.6); } };
});
S('e_post', () => {
  const g = dark('#2a2440'); const p = phone(postTex('fyrefestival', '5.1M'), { w: 1.1 }); p.position.set(0, 1.6, 0); g.add(p); spot(g, 0, 5, 4, 0, 1.6, 0, '#fff4e0', 70);
  return { g, sky: PURPLE, dim: .5, pill: 'A PERFECT POST', pillColor: ORANGE, focus: V(0, 1.6, 0), cam: dolly(V(.6, 1.6, 4.4), V(0, 1.6, 3.2), V(0, 1.6, 0)), upd: lt => { p.rotation.y = Math.sin(lt * .6) * .25; } };
});
S('e_never', () => {
  const g = G(sea('#2a4a6a'), island(9, 8)); const tl = lot({ rows: 1, cols: 3, noGround: true }); tl.scale.setScalar(.35); tl.position.set(0, .15, 2); g.add(tl);
  return { g, sky: NIGHT, night: true, pill: 'A PARTY THAT NEVER EXISTED', pillColor: '#8a3fd1', focus: V(0, 0, 0), cam: u => ({ p: V(Math.sin(u * .9 + 1) * 22, 10 - u * 2, Math.cos(u * .9 + 1) * 22), l: V(0, 0, 0), fov: 40 }) };
});
S('e_sub', () => {
  const g = G(sand(80, 80, 0, 0, '#d8c49a'), festStage({ big: ' ' })); const L = g.children[1].userData.lights;
  return { g, sky: NIGHT, night: true, title: window.SHORT_END || ['SUBSCRIBE', 'RISE & RUIN'], focus: V(0, 2, -2), cam: dolly(V(0, 2.4, 11), V(0, 3, 9), V(0, 3.4, -4)), upd: lt => L.forEach((l, i) => l.visible = Math.sin(lt * 6 + i * 1.7) > -.3) };
});
