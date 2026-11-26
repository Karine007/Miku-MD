
// ================= LONG-FORM EXTRA SCENES (appended to scenes.js by ../longform/build_long.sh) =================
import { palm, house, spinClock } from './kit.js';
import { oldMan } from './sets.js';
import { sea, tent } from './props2.js';
function lineChart(f, col, n = 40) { const g = G(box(8, 5, .1, '#ffffff', 0, 2.5, -2)); const pts = []; for (let i = 0; i < n; i++) { const x = -3.6 + i * 7.2 / (n - 1); pts.push(V(x, .7 + f(i / (n - 1)) * 3.8, -1.9)); } const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: col })); g.add(line); const dots = pts.map(p => { const s = sph(.07, col, p.x, p.y, p.z); g.add(s); return s; }); g.userData.draw = k => { const m = Math.floor(clamp(k) * n); line.geometry.setDrawRange(0, m); dots.forEach((s, i) => s.visible = i < m); }; return g; }
const rebekah = (o = {}) => person(Object.assign({ skin: SKIN[0], hair: '#e0c27a', hairStyle: 'long', top: '#f2f2f2', pants: '#2a2a30', seed: 204 }, o));
const bottle = () => G(cyl(.09, .11, .36, '#d9c48a', 0, .18, 0, 12), cyl(.035, .035, .12, '#d9c48a', 0, .42, 0, 10), cyl(.04, .04, .05, '#1b1b1f', 0, .5, 0, 10));
function bld(w, h, d, label, col, night) { const g = G(box(w, h, d, col, 0, h / 2, 0), box(w + .2, .3, d + .2, '#e6e6ea', 0, h + .15, 0)); for (let j = 0; j < Math.floor(h / 1.4) - 1; j++) for (let i = 0; i < Math.floor(w / 1.4); i++) g.add(box(.7, .6, .05, night ? (((i + j) % 3) ? '#24304d' : '#ffd88a') : '#9fc3e4', -w / 2 + .9 + i * 1.4, 2.2 + j * 1.4, d / 2 + .02)); const s = sign(label, { bg: WEBLK, fg: '#ffffff', w: Math.min(w * .8, 4), px: 120 }); s.position.set(0, 1.2, d / 2 + .04); g.add(s); return g; }

S('n_tequila', () => {
  const g = dark('#2a1f3a'); const a = at(adam(), 0, 0, -.6); g.add(a); const tb = G(box(3.2, .08, 1.2, '#c9a27a', 0, .9, 0)); for (const x of [-1.4, 1.4]) tb.add(box(.08, .9, 1, '#2a2a30', x, .45, 0)); g.add(at(tb, 0, 0, .4));
  const bt = bottle(); bt.position.set(-.8, .94, .4); g.add(bt); const shots = []; for (let i = 0; i < 6; i++) { const s = cyl(.05, .04, .1, '#fff6c8', -.2 + i * .25, .99, .55, 10); g.add(s); shots.push(s); }
  const ppl = [0, 1, 2, 3].map(i => { const p = worker(i + 2); at(p, -3 + i * 2 + (i > 1 ? .4 : -.4), 0, -1.6); g.add(p); return p; });
  const t1 = tag('TEQUILA SHOTS', { fg: GOLD, h: .4 }); t1.position.set(-1.8, 2.45, -.4); const t2 = tag('$60M PRIVATE JET', { fg: BLUE, h: .4 }); t2.position.set(1.8, 2.45, -.4); const t3 = tag('"WORLD\'S FIRST TRILLIONAIRE"', { bg: WEBLK, fg: '#ffd23f', h: .46 }); t3.position.set(0, 3.0, -.4); g.add(t1, t2, t3);
  const sp = new THREE.SpotLight('#ffd0f0', 40, 20, .5, .6); sp.position.set(0, 6, 3); sp.target.position.set(0, 0, 0); g.add(sp, sp.target);
  return { g, sky: NIGHT, night: true, dim: 1.5, focus: V(0, 1.4, 0), cam: dolly(V(-1, 2.2, 6.4), V(0, 2.2, 5.2), V(0, 1.7, -.4)), upd: (lt, u) => { idle(a, lt); pose(a, [0, 0, 0], [-1.6 - Math.sin(lt * 3) * .2, 0, .2], 0, -.8); ppl.forEach((p, i) => { idle(p, lt + i); p.position.y = Math.abs(Math.sin(lt * 6 + i)) * .1; pose(p, [0, 0, -2.4], [0, 0, 2.4], 1.2, 1.2); }); pop(t1, lt, .3); [t2, t3].forEach(t => t.visible = false); if (u > .35) pop(t2, lt, 0); if (u > .62) pop(t3, lt, 0); } };
});
S('n_crash', () => {
  const g = tower({ night: true }); const c = big('BANKRUPT', '#ffffff', RED, 6, 200); c.position.set(0, 12, 1); g.add(c); const y = tag('4 YEARS LATER', { fg: RED, h: 1 }); y.position.set(0, 9.4, 1.5); g.add(y);
  return { g, sky: NIGHT, night: true, focus: V(0, 8, 0), cam: dolly(V(4, 3, 24), V(1, 5, 19), V(0, 10, -2)), upd: lt => { pop(y, lt, .2); pop(c, lt, .9); } };
});
S('n_kibbutz', () => {
  const g = G(ground('#a8c46a'), strip(40, 4, '#d9c79a', 0, 3, .012)); for (let i = 0; i < 5; i++) g.add(strip(4, 14, i % 2 ? '#c9b25a' : '#7fae4a', -12 + i * 4.2, -14, .013));
  g.add(house(-7, -6, { w: 5, d: 4, wall: '#f0e6d0', roof: '#c0563f', porch: false }), house(0, -7, { w: 6, d: 4, wall: '#efe2c4', roof: '#c0563f', porch: false }), house(7, -6, { w: 5, d: 4, wall: '#f0e6d0', roof: '#c0563f', porch: false }), tree(-11, -3, 1.2), tree(11, -2, 1.1), tree(4, -11, 1), clouds());
  const kids = [adam({ kid: true, beard: 0, hairStyle: 'short', top: '#5c79c9' }), worker(1, { kid: true }), worker(4, { kid: true }), worker(5, { kid: true })].map((p, i) => { at(p, -1.8 + i * 1.2, 0, 1.6, 0); g.add(p); return p; });
  const bk = G(cyl(.25, .2, .25, '#b98a4a', 0, 0, 0, 14)); for (let i = 0; i < 4; i++) bk.add(sph(.08, '#e8742a', -.1 + (i % 2) * .2, .14, -.06 + (i >> 1) * .12)); g.add(bk);
  const t = tag('KIBBUTZ · EVERYONE SHARES', { fg: GREEN, h: .38 }); t.position.set(0, 1.95, 1.6); g.add(t);
  return { g, sky: OUT, name: ['ADAM NEUMANN', 'FOUNDER, WEWORK'], focus: V(0, 1, 0), cam: dolly(V(-1, 1.8, 8.4), V(0, 1.6, 6.4), V(0, 1.2, -1)), upd: lt => { kids.forEach((p, i) => idle(p, lt + i)); const ph = (lt * .4) % 1, k = Math.floor(ph * 3), f = (ph * 3) % 1; bk.position.set(-1.8 + (k + f) * 1.2, .95 + Math.sin(f * Math.PI) * .3, 1.85); pop(t, lt, .8); } };
});
S('n_navy', () => {
  const g = G(sea('#3f8fc4')); const hull = G(box(3, 1.6, 14, '#8a939e', 0, .5, 0), box(2.2, 1.6, 4, '#9aa3ae', 0, 2, -1), box(1.4, 1.2, 2, '#9aa3ae', 0, 3.3, -1.2), cyl(.08, .08, 3, '#6a737e', 0, 4.8, -1.2, 8)); const bow = new THREE.Mesh(new THREE.ConeGeometry(1.5, 3, 4), M('#8a939e')); bow.rotation.x = Math.PI / 2; bow.rotation.y = Math.PI / 4; bow.scale.set(1, 1, .5); bow.position.set(0, .5, 8.4); hull.add(bow); hull.rotation.y = Math.PI / 2; hull.position.set(0, 0, -6); g.add(hull);
  const a = at(adam({ beard: 0, hairStyle: 'short', top: '#f4f4f2', pants: '#f4f4f2' }), 0, 1.3, -4.6); g.add(a); g.add(at(skyline({ n: 16, seed: 9 }), 30, 0, -70), clouds());
  const t = tag('ISRAELI NAVY', { fg: BLUE, h: .4 }); t.position.set(-2, 3.6, -4.6); const ny = tag('→ NEW YORK AT 22', { fg: WEBLK, h: .5 }); ny.position.set(3, 4.4, -4.6); g.add(t, ny);
  return { g, sky: OUT, focus: V(0, 1.4, -5), sun: [8, 14, 8], cam: dolly(V(-3, 3, 7), V(1, 3, 5), V(0, 2.6, -5)), upd: (lt, u) => { idle(a, lt); hull.position.y = Math.sin(lt * 1.2) * .08; a.position.y = 1.3 + hull.position.y; pop(t, lt, .3); ny.visible = false; if (u > .45) pop(ny, lt, 0); } };
});
S('n_krawlers', () => {
  const g = room({ w: 10, d: 8, wall: '#f6e6ee', side: '#f0dce6', floor: flat('#c9b39a', 3) }); g.add(desk(3, 1.2, 0, -2.2, '#e9dfcf'));
  const one = G(rbox(.8, .9, .2, .1, '#9fd0f0', 0, 0, 0), rbox(.3, .5, .2, .08, '#9fd0f0', -.22, -.6, 0), rbox(.3, .5, .2, .08, '#9fd0f0', .22, -.6, 0), rbox(.3, .3, .2, .08, '#9fd0f0', -.55, .28, 0), rbox(.3, .3, .2, .08, '#9fd0f0', .55, .28, 0)); for (const x of [-.22, .22]) { const p = cyl(.14, .14, .06, '#f26a8a', x, -.6, .12, 18); p.rotation.x = Math.PI / 2; one.add(p); }
  one.position.set(0, 1.9, -2.6); g.add(one); const t = tag('BABY CLOTHES WITH KNEE PADS', { fg: PINK, h: .32 }); t.position.set(0, 3.1, -2.4); g.add(t); const x = tag('FLOPPED', { bg: RED, fg: '#fff', h: .5 }); x.position.set(0, 1.6, -2.2); x.material.rotation = .15; g.add(x);
  return { g, sky: IN, focus: V(0, 1.8, -2.4), cam: dolly(V(-.4, 2, 4), V(0, 2, 3.2), V(0, 2, -2.4)), upd: (lt, u) => { pop(one, lt, .1); pop(t, lt, .5); one.rotation.y = Math.sin(lt) * .3; x.visible = false; if (u > .55) pop(x, lt, 0); } };
});
S('n_risk', () => {
  const g = dark('#2a2a36'); g.add(G(new THREE.Mesh(new THREE.ConeGeometry(.5, 1.2, 3), M('#7a8090'))).translateY(.6).translateZ(-1.5)); const beam = G(box(6, .14, .5, '#c9a27a', 0, 0, 0)); beam.position.set(0, 1.25, -1.5); g.add(beam);
  const L = card([['15 YEARS', 120, '#ffffff', 200], ['of rent WeWork owes', 52, '#ffd23f', 330, 800]], { w: 1.8, cw: 800, h: 480, bg: RED, basic: true }); L.position.set(-2.4, 1.55, .3); beam.add(L); const lb = box(1.4, .9, .5, '#4a4f5a', -2.4, .5, 0); beam.add(lb);
  const R = card([['1 MONTH', 120, '#ffffff', 200], ['members can leave', 52, '#bfe3f7', 330, 800]], { w: 1.8, cw: 800, h: 480, bg: BLUE, basic: true }); R.position.set(2.4, .65, 0); beam.add(R); const rb = box(.6, .3, .4, '#dfe4ea', 2.4, .22, 0); beam.add(rb);
  return { g, sky: NIGHT, night: true, dim: 1.4, pill: 'THE CATCH', pillColor: RED, focus: V(0, 1.6, -1.5), cam: dolly(V(0, 2, 6.4), V(0, 2, 5.4), V(0, 1.8, -1.5)), upd: lt => { beam.rotation.z = ease(lt / 1.6) * .22; pop(L, lt, .2); pop(R, lt, .9); } };
});
S('n_camp', () => {
  const g = G(ground('#2f5a3a')); for (let i = 0; i < 7; i++) { const t = tent(['#f1efe8', '#e9d6b0', '#d9e6f0'][i % 3]); t.position.set(-12 + i * 4, 0, -10 - (i % 2) * 3); g.add(t); }
  const st = G(box(8, .8, 4, '#2a2a30', 0, .4, 0)); st.add(box(.2, 5, .2, '#555', -4, 2.5, -2), box(.2, 5, .2, '#555', 4, 2.5, -2), box(8.4, .3, .3, '#555', 0, 5, -2)); const s = sign('WEWORK SUMMER CAMP', { bg: WEBLK, fg: '#ffffff', w: 6, px: 120 }); s.position.set(0, 4.2, -1.9); st.add(s); st.position.set(0, 0, -4); g.add(st);
  const lights = []; for (let i = 0; i < 5; i++) { const l = sph(.18, '#fff', -3.2 + i * 1.6, 4.7, -5.8); l.material = B(['#ff6ab8', '#6ad0ff', '#ffd23f'][i % 3]); g.add(l); lights.push(l); }
  const ppl = []; for (let r = 0; r < 2; r++) for (let i = 0; i < 6; i++) { const p = worker(i + r * 6); at(p, -4 + i * 1.6 + r * .8, 0, 1 + r * 1.4, Math.PI); g.add(p); ppl.push(p); }
  return { g, sky: NIGHT, night: true, dim: 1.3, pill: 'PARTIES UNTIL DAWN', pillColor: PINK, focus: V(0, 2, -2), cam: dolly(V(-3, 2.6, 9), V(2, 2.8, 8), V(0, 2.4, -3)), upd: lt => { lights.forEach((l, i) => l.visible = Math.sin(lt * 6 + i) > -.3); ppl.forEach((p, i) => { idle(p, lt + i); p.position.y = Math.abs(Math.sin(lt * 6 + i)) * .12; pose(p, [0, 0, -2.6], [0, 0, 2.6], 1, 1); }); } };
});
S('n_barefoot', () => {
  const g = G(sea('#4fb3d9'), strip(60, 14, '#f1dfb4', 0, 4, .0)); g.add(palm(-6, -1, 1.1), palm(7, 0, 1), clouds()); const a = at(adam({ top: '#f4f4f2' }), -1, 0, 3); g.add(a);
  const board = G(rbox(.5, .08, 2.2, .2, '#ffd23f', 0, 0, 0)); board.rotation.y = .5; board.position.set(.8, .06, 3.2); g.add(board);
  const ts = [['BAREFOOT', -1.9, 2.5, '#333'], ['SURFING', 0, 2.95, BLUE], ['NO MEAT AT EVENTS', 1.7, 2.5, GREEN]].map(([s, x, y, c]) => { const t = tag(s, { fg: c, h: .36 }); t.position.set(x, y, 2.4); g.add(t); return t; });
  return { g, sky: OUT, focus: V(0, 1.2, 2), sun: [8, 14, 8], cam: dolly(V(-1, 1.8, 9), V(0, 1.8, 7.6), V(0, 1.6, 2)), upd: (lt, u) => { idle(a, lt); ts.forEach((t, i) => { t.visible = false; if (u > i * .3) pop(t, lt, 0); }); } };
});
S('n_crazier', () => {
  const g = boardroom(); const s = at(son(), -1, 0, .2, .4), a = at(adam(), 1, 0, .2, -.4); g.add(s, a); const q = tag('"BE CRAZIER!"', { bg: '#ffd23f', fg: WEBLK, h: .3 }); q.position.set(-1, 2.2, .2); g.add(q);
  return { g, sky: IN, pill: 'THINK BIGGER', pillColor: GREEN, focus: V(0, 1.4, 0), cam: dolly(V(.8, 1.7, 4.4), V(0, 1.7, 3.6), V(0, 1.5, 0)), upd: lt => { idle(s, lt); idle(a, lt + 1); talk(s, lt); pose(s, [0, 0, 0], [0, 0, 2.6], 0, .4); pop(q, lt, .5); } };
});
S('n_we', () => {
  const g = G(ground('#9aa0a8'), strip(60, 8, '#5b5d66', 0, 6)); const a = bld(6, 10, 5, 'WELIVE', '#e9d9c4'); a.position.set(-8, 0, -6); const b = bld(5, 5, 5, 'WEGROW', '#f2c6d6'); b.position.set(0, 0, -6); g.add(a, b);
  const pool = G(box(6, .5, 5, '#e6e6ea', 0, .25, 0)); const w = new THREE.Mesh(new THREE.PlaneGeometry(5.4, 4.4, 30, 1), M('#4fb3e9')); w.rotation.x = -Math.PI / 2; w.position.y = .52; pool.add(w); pool.position.set(8, 0, -4); g.add(pool);
  const wt = tag('WAVE POOLS', { fg: BLUE, h: 1 }); wt.position.set(8, 2.6, -4); g.add(wt); g.add(at(skyline({ n: 16, seed: 4 }), 0, 0, -40), clouds());
  return { g, sky: OUT, focus: V(0, 3, -5), sun: [10, 18, 10], cam: dolly(V(-4, 4, 17), V(4, 4.4, 15), V(0, 3.6, -5)), upd: lt => { const p = w.geometry.attributes.position; for (let i = 0; i < p.count; i++) p.setZ(i, Math.sin(p.getX(i) * 2 - lt * 4) * .12); p.needsUpdate = true; pop(a, lt, .1); pop(b, lt, .6); pop(pool, lt, 1.1); pop(wt, lt, 1.4); } };
});
S('n_jet', () => {
  const g = G(ground('#9aa0a8'), strip(80, 12, '#4a4c55', 0, 0, .012)); const j = jet({ name: 'WE', stripe: WEBLK, gear: true }); j.position.set(0, 1.55, 0); j.rotation.y = Math.PI / 2; g.add(j);
  g.add(house(-14, -14, { wall: '#efe6d6', roof: '#5d5866' }), house(14, -14, { wall: '#dfe8ef', roof: '#5d5866' }), tree(-20, -10, 1.3), tree(20, -10, 1.2), clouds());
  const t = tag('PRIVATE JET + MANSIONS', { fg: WEBLK, h: 1 }); t.position.set(0, 5.6, 0); const b = tag('BORROWED $ HUNDREDS OF MILLIONS', { fg: RED, h: .8 }); b.position.set(0, 4.4, 0); g.add(t, b);
  return { g, sky: OUT, focus: V(0, 1.5, 0), sun: [10, 18, 10], cam: dolly(V(-6, 2.6, 15), V(4, 2.8, 13), V(0, 2, 0)), upd: (lt, u) => { pop(t, lt, .3); b.visible = false; if (u > .5) pop(b, lt, 0); } };
});
S('n_hour', () => {
  const g = dark('#2a2030'); const c = clock(0, 2.6, -2.8, .9); g.add(c); const k = big('$217,000', RED, '#ffffff', 3.4, 200); k.position.set(0, 4.5, -2.6); g.add(k); const h = tag('LOST EVERY HOUR', { fg: RED, h: .45 }); h.position.set(0, 1.2, -2.4); g.add(h);
  const ms = []; for (let i = 0; i < 12; i++) { const m = money(1, 0, 0); g.add(m); ms.push(m); }
  return { g, sky: NIGHT, night: true, dim: 1.4, focus: V(0, 2.6, -2.6), cam: dolly(V(0, 2.8, 6.6), V(0, 2.8, 5.4), V(0, 2.8, -2.6)), upd: lt => { spinClock(c, lt, 8); pop(k, lt, .2); pop(h, lt, .7); ms.forEach((m, i) => { const ph = (lt * .5 + i / 12) % 1; m.position.set(Math.sin(i * 2.7) * 3.2, 5.5 - ph * 5.5, -1.8 + Math.cos(i) * .6); m.rotation.set(lt * 2 + i, lt, 0); }); } };
});
S('n_rebekah', () => {
  const g = office(); const r = at(rebekah(), 1.4, 0, -1.2, -.3); g.add(r); const doc = card([['IF ADAM DIES...', 90, '#1b1b1f', 160], ['Rebekah helps choose', 60, '#555', 300, 800], ['the next CEO', 60, '#555', 380, 800]], { w: 2.2, cw: 900, h: 520 }); doc.position.set(-.8, 1.9, -2); g.add(doc);
  return { g, sky: IN, name: ['REBEKAH NEUMANN', "ADAM'S WIFE"], focus: V(0, 1.6, -1.6), cam: dolly(V(-.6, 1.8, 4.2), V(0, 1.8, 3.4), V(.2, 1.7, -1.8)), upd: lt => { idle(r, lt); pop(doc, lt, .4); } };
});
S('n_wsj', () => {
  const g = office(); const n = newspaper("WEWORK FOUNDER'S WILD RIDE", 'Parties on the ground and on his jet', 2.4); n.position.set(0, 1.9, -1.4); g.add(n);
  return { g, sky: IN, pill: 'THE STORIES COME OUT', pillColor: RED, focus: V(0, 1.9, -1.4), cam: dolly(V(.4, 1.8, 4.4), V(0, 1.8, 3.4), V(0, 1.75, -1.4)), upd: lt => pop(n, lt, .2) };
});
S('n_flow', () => {
  const g = G(ground('#9aa0a8'), strip(60, 8, '#5b5d66', 0, 6)); const b = bld(8, 16, 6, 'FLOW', '#e6eef0'); b.position.set(0, 0, -6); g.add(b); g.add(at(skyline({ n: 16, seed: 11 }), 0, 0, -40), clouds());
  const a = at(adam({ top: '#2a2a30' }), 0, 0, 1.6); g.add(a); const c = big('$350 MILLION', GREEN, '#ffffff', 4, 190); c.position.set(0, 6, -2.8); g.add(c); const s = tag('STILL A BILLIONAIRE', { fg: GOLD, h: .55 }); s.position.set(0, 3.2, 1.6); g.add(s);
  return { g, sky: OUT, pill: 'HIS NEXT COMPANY', pillColor: GREEN, focus: V(0, 3, -2), sun: [10, 18, 10], cam: dolly(V(-2, 2.4, 12), V(1, 2.8, 10), V(0, 4, -3)), upd: (lt, u) => { idle(a, lt); wave(a, lt); pop(s, lt, .3); c.visible = false; if (u > .4) pop(c, lt, 0); } };
});
S('n_lesson', () => {
  const g = cowork({ seed: 21 }); g.userData.ppl.forEach(p => p.visible = false); const t = tag('IN THE END... JUST DESKS', { fg: WEBLK, h: .5 }); t.position.set(0, 2.9, -1); g.add(t);
  return { g, sky: GREY, dim: .75, focus: V(0, 1, -1), cam: dolly(V(3, 2.4, 6.6), V(-1, 2, 5.6), V(0, 1, -1.5), V(0, 1, -2)), upd: lt => pop(t, lt, .8) };
});
