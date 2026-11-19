// Scenes: hook, arrival, New York life, the club dream
import { THREE, M, E, mesh, box, rbox, cyl, sph, grp, V, clamp, ease, eio, backOut, lerp, pop, dolly, canvasTex, FONT, rrect, label, sign, walk, bubble, rng, floor, wall } from './kit.js';
import { human, CAST, SKINS2, HAIRS, blink, talk, idle } from './human.js';
import { stage, room, windowPane, building, skyline, jet, stairs, car, siren, palm, pool, paper, laptop, monitor, card, terminal, note, stack, flyingNotes, counter, door, plant, lampStand, bars, sofa, bed, table, glass, frame, abstractArt, phoneChat } from './props.js';
export const SA = []; const S = (id, build) => SA.push({ id, build });
const GOLD = '#ffd23f';
export const tag = (t, bg = GOLD, fg = '#1d2433', s = .5) => { const l = sign(t, { bg, fg, size: 56 }); l.scale.setScalar(s); return l; };
export const big = (t, fg = GOLD, s = 1, size = 120) => { const l = label(t, { fg, size, pad: 10 }); l.scale.setScalar(s); return l; };
export function guest(i, x = {}) {
  const r = rng(i * 13 + 7); const fem = i % 2 === 0; const sk = SKINS2[i % SKINS2.length]; const hs = fem ? ['long', 'bob', 'bun', 'curly'][i % 4] : ['short', 'slick', 'curly', 'bald'][i % 4];
  const hc = [HAIRS.black, HAIRS.brown, HAIRS.blonde, HAIRS.dark, HAIRS.auburn][(i * 3) % 5];
  const o = fem ? { female: true, dress: ['#8e2c48', '#2c5d8e', '#e2b13c', '#3c8e6a', '#5a3c8e', '#d96a4c'][i % 6], heels: true } : { suit: ['#262b3a', '#3a2f2a', '#2f3a33', '#44465a'][i % 4], tie: ['#7a1c2b', '#1c3a7a', '#c9a54b'][i % 3] };
  return human(Object.assign({ skin: sk, hair: hc, hairStyle: hs, seed: i, glasses: r() < .2, beard: !fem && r() < .25 }, o, x));
}
const marble = (w, d, c = '#e9e4dc') => floor(w, d, c);
function column(h = 4, c = '#e7e1d6') { return grp(cyl(.28, .3, h, c, 0, h / 2, 0, 18), box(.8, .2, .8, c, 0, .1, 0), box(.8, .2, .8, c, 0, h - .1, 0)); }

// ===== HOOK =====
S('a_bank', () => {
  const g = room('#e7e0d4', '#b9a98f', { w: 12, h: 6, skirt: '#7a6a52', side: false });
  for (const x of [-3.6, -1.2, 1.2, 3.6]) { const c = column(5.2); c.position.set(x, 0, -2.4); g.add(c); }
  const s = sign('MANHATTAN BANK', { bg: '#1f2a44', fg: '#e8d6a8', size: 60 }); s.scale.setScalar(.6); s.position.set(0, 4.6, -2.9); g.add(s);
  const d = grp(box(2.4, .9, .9, '#5a3a28', 0, .45, 0), box(2.5, .06, 1, '#e8e0d0', 0, .93, 0)); d.position.set(.9, 0, -.4); g.add(d);
  const bk = CAST.banker(); bk.position.set(.9, 0, -1.3); g.add(bk);
  const a = CAST.anna(); g.add(a);
  const amt = big('$22,000,000', GOLD, .45); amt.position.set(.2, 3.0, 0); g.add(amt);
  return { g, bg: ['#6b5a46', '#d8c8b0'], focus: V(0, 1, 0), cam: dolly(V(-.6, 2.4, 6.6), V(.2, 2.2, 5.2), V(.1, 1.5, -.5), V(.4, 1.6, -.6)),
    upd: lt => { const k = clamp(lt / 3.2); a.position.set(lerp(-3.4, -.1, ease(k)), 0, .5); a.rotation.y = k < 1 ? Math.PI / 2 : lerp(Math.PI / 2, .6, ease((lt - 3.2) / .6)); if (k < 1) walk(a, lt, 7, .4); else { walk(a, 0, 0, 0); idle(a, lt); }
      idle(bk, lt); bk.rotation.y = .2; pop(amt, lt, 3.6); if (lt > 3.6) talk(a, lt, lt < 5.4); } };
});
S('a_heiress', () => {
  const g = stage('#cfc3c8', null);
  const fl = grp(box(4.4, .9, .1, '#1b1b1b', 0, 4.15, -2), box(4.4, .9, .1, '#c8202f', 0, 3.25, -2), box(4.4, .9, .1, '#f2c418', 0, 2.35, -2)); g.add(fl);
  const a = CAST.anna(); g.add(a);
  const t1 = tag('GERMAN HEIRESS', '#ffffff', '#1d2433', .3); t1.position.set(0, 2.55, .6); t1.rotation.z = .06; g.add(t1);
  const t2 = big('€60,000,000', GOLD, .2); t2.position.set(0, 1.4, 1.0); g.add(t2);
  return { g, bg: ['#3a2f4a', '#b78f9e'], focus: V(0, 1.8, 0), cam: dolly(V(.3, 1.95, 3.4), V(0, 1.9, 2.7), V(0, 1.75, 0), V(0, 1.8, 0)),
    upd: lt => { idle(a, lt); a.userData.armR.rotation.x = -.15; pop(t1, lt, .7); pop(t2, lt, 2.2); } };
});
S('a_hotel', () => {
  const g = room('#d9cbb8', '#e9dfcf', { w: 9, h: 5, skirt: '#b5a58c', side: false });
  const b = bed(); b.position.set(-1.6, 0, -1.6); g.add(b); const w = windowPane(1.8, 2.2, '#ffd9a8', '#efe6d6', .5); w.position.set(1.6, 2.6, -2.9); g.add(w);
  const a = CAST.anna(); a.position.set(-.3, 0, .4); a.rotation.y = .5; g.add(a);
  const bh = human({ suit: '#7a1c2b', tie: '#c9a54b', skin: SKINS2[3], hair: HAIRS.black, hairStyle: 'short', cap: '#7a1c2b', seed: 9 }); bh.position.set(1.2, 0, .6); bh.rotation.y = -.7; g.add(bh);
  const n = note(); n.scale.setScalar(.8); g.add(n); const fn = flyingNotes(16, 3); g.add(fn);
  const st = tag('5-STAR HOTELS', '#ffffff', '#1d2433', .5); st.position.set(-.5, 3.0, -1.5); g.add(st);
  return { g, bg: ['#5a4636', '#e3c9a7'], focus: V(0, 1, 0), cam: dolly(V(.6, 2.3, 5.4), V(.2, 2.1, 4.6), V(0, 1.4, 0), V(0, 1.5, 0)),
    upd: lt => { idle(a, lt); idle(bh, lt); a.userData.armR.rotation.x = -1.1 * ease(lt / .6); a.userData.armR.rotation.z = -.2; n.position.set(.35 + .1 * ease(lt / .6), 1.3, 1.0); n.rotation.set(0, -.3, .2);
      fn.userData.upd(lt - .8); pop(st, lt, .3); bh.userData.mouth.scale.y = 1; } };
});
S('a_jet', () => {
  const g = stage('#9aa0a8', null, { w: 40, d: 30 }); const j = jet(); j.position.set(.4, 1.1, -1); j.rotation.y = -.25; g.add(j);
  const st = stairs(7); st.position.set(.6, 0, .6); st.rotation.y = Math.PI - .25; g.add(st);
  const a = CAST.anna(); g.add(a); for (let i = 0; i < 6; i++) g.add(box(.08, .02, 1.2, '#f2f2f2', -6 + i * 2.4, .02, 2.5));
  return { g, bg: ['#f2a65a', '#ffe3b8'], focus: V(0, 1, 0), cam: dolly(V(-3.2, 2.0, 9.5), V(-2.4, 2.2, 8.4), V(.4, 1.3, -.5), V(.4, 1.4, -.5)),
    upd: lt => { const k = clamp(lt / 1.8); a.position.set(.75 - .0, .12 + k * .84, 1.6 - k * 1.4); a.rotation.y = Math.PI - .25; walk(a, lt, 8, .35); } };
});
S('a_vault', () => {
  const g = room('#5d6474', '#3f4656', { w: 9, h: 5, side: false });
  const ring = cyl(1.6, 1.6, .3, '#9aa2b2', 0, 2.2, -2.75, 32); ring.rotation.x = Math.PI / 2; g.add(ring);
  const hole = cyl(1.35, 1.35, .32, '#1b1f29', 0, 2.2, -2.73, 32); hole.rotation.x = Math.PI / 2; g.add(hole);
  const dr = new THREE.Group(); const dd = cyl(1.35, 1.35, .35, '#b6bdcb', 1.35, 0, 0, 32); dd.rotation.x = Math.PI / 2; dr.add(dd);
  for (let i = 0; i < 3; i++) { const sp = box(1.4, .08, .08, '#7a8294', 1.35, 0, .3); sp.rotation.z = i * Math.PI / 3; dr.add(sp); }
  dr.position.set(-1.35, 2.2, -2.45); g.add(dr);
  for (let i = 0; i < 3; i++) g.add(box(2, .05, .4, '#5a6170', 0, 1.4 + i * .6, -2.85));
  const z = big('€0', '#ff5a5a', 1.4, 160); z.position.set(0, 2.2, -1.8); g.add(z);
  return { g, bg: ['#141824', '#3a4052'], focus: V(0, 2, -2), cam: dolly(V(.6, 2.3, 4.2), V(.2, 2.25, 3.0), V(0, 2.2, -2.6), V(0, 2.2, -2.6)),
    light: (L, lt) => { L.hemi.intensity = .8; L.key.intensity = 2; }, upd: lt => { dr.rotation.y = -1.9 * eio(clamp((lt - .3) / 1.6)); pop(z, lt, 2.1); } };
});
S('a_friend', () => {
  const g = stage('#3b4150', '#262b3a');
  const c = car('#f4f4f6', { police: true }); c.position.set(-1.1, 0, -.6); c.rotation.y = .9; g.add(c);
  const x = big('X', '#ff4d5e', 1.4, 200); x.position.set(-1.1, 1.3, .6); x.scale.setScalar(.8); g.add(x);
  const r = CAST.rachel(); r.position.set(1.0, 0, .6); r.rotation.y = -.35; g.add(r);
  const spot = mesh(new THREE.CylinderGeometry(.6, .9, .02, 32), E('#ffe9b0', .6), 1.0, .02, .6, false); g.add(spot);
  const t = tag('A FRIEND', GOLD, '#1d2433', .55); t.position.set(1.0, 2.6, .7); t.scale.setScalar(.4); g.add(t);
  return { g, bg: ['#11141f', '#3b3550'], focus: V(0, 1, 0), cam: dolly(V(-.2, 2.4, 7.4), V(.2, 2.3, 6.6), V(-.1, 1.3, 0), V(.1, 1.4, 0)),
    light: (L, lt) => { L.hemi.intensity = .7; L.key.intensity = 1.6; }, upd: lt => { siren(c, lt); pop(x, lt, 1.6); pop(t, lt, 3.9); idle(r, lt); spot.visible = lt > 3.6; } };
});
S('a_title', () => {
  const g = stage('#3a1520', '#1a0d14'); const rug = box(1.6, .02, 9, '#b3162e', 0, .01, 0); g.add(rug);
  const a = CAST.anna({ smile: true, glasses: '#111', shades: true }); a.position.set(0, 0, .6); g.add(a);
  const T = sign('ANNA DELVEY', { bg: '#14101a', fg: GOLD, size: 110, border: GOLD }); T.scale.setScalar(.62); T.position.set(0, 3.6, -1.5); g.add(T);
  const pill = tag('THE TRUE STORY', '#e8505b', '#fff', .45); pill.position.set(0, 2.85, -1.2); g.add(pill);
  const fl = []; const r = rng(4); for (let i = 0; i < 10; i++) { const f = sph(.08, null, (i % 2 ? 1 : -1) * (2 + r() * 1.5), .8 + r() * 1.6, -1 + r() * 2.5, 8); f.material = E('#ffffff', 3); g.add(f); fl.push(f); }
  return { g, bg: ['#120a12', '#4a1a2a'], focus: V(0, 1.5, 0), cam: dolly(V(0, 2.1, 5.8), V(0, 2.2, 4.8), V(0, 2.0, 0), V(0, 2.2, 0)),
    light: (L) => { L.hemi.intensity = .9; }, upd: lt => { idle(a, lt); pop(T, lt, .1); pop(pill, lt, .6); fl.forEach((f, i) => f.visible = Math.sin(lt * 9 + i * 2.7) > .75); } };
});

// ===== ARRIVAL =====
S('b_ny', () => {
  const g = stage('#2c3247', null, { w: 50, d: 30 }); const sk = skyline(18, 11, { hmax: 9, lit: .5 }); sk.position.z = -3; g.add(sk);
  const sk2 = skyline(14, 5, { hmax: 12, lit: .3, colors: ['#2f3650', '#3a4260'] }); sk2.position.set(0, 0, -8); sk2.scale.setScalar(1.3); g.add(sk2);
  const t = tag('NEW YORK · 2013', '#ffffff', '#1d2433', .6); t.position.set(0, 2.2, 1); g.add(t);
  return { g, bg: ['#2a2f63', '#f39a78'], focus: V(0, 3, -3), cam: dolly(V(0, 2.4, 9), V(0, 3.0, 7.6), V(0, 3.4, -3), V(0, 3.8, -3)),
    light: (L) => { L.key.color.set('#ffc59e'); L.key.intensity = 2; }, upd: lt => pop(t, lt, .3) };
});
S('b_runway', () => {
  const g = stage('#24212b', '#15131b'); g.add(box(1.6, .3, 9, '#f2f0ec', 0, .15, -1.5));
  const models = [0, 1].map(i => { const m = human({ female: true, skin: SKINS2[i ? 4 : 0], hair: i ? HAIRS.black : HAIRS.blonde, hairStyle: i ? 'bun' : 'long', dress: i ? '#e8505b' : '#f2f2f2', heels: true, seed: 20 + i }); g.add(m); return m; });
  const a = CAST.anna({ dress: null, coat: '#c9a27a', top: '#c9a27a', bottom: '#1d1d22' }); a.position.set(1.6, 0, 1.6); a.rotation.y = -.9; g.add(a);
  const cs = grp(rbox(.5, .7, .25, .06, '#7b4a2c', 0, .35, 0), box(.2, .06, .05, '#222', 0, .73, 0)); cs.position.set(2.05, 0, 1.9); g.add(cs);
  const fl = []; for (let i = 0; i < 12; i++) { const f = sph(.06, null, (i % 2 ? 1.4 : -1.4), .9 + (i % 3) * .3, -4 + i * .6, 8); f.material = E('#fff', 3); g.add(f); fl.push(f); }
  const t = tag('FASHION WEEK', '#ffffff', '#1d2433', .5); t.position.set(0, 3.3, -3); g.add(t);
  return { g, bg: ['#0f0d14', '#3a2f45'], focus: V(0, 1, -1), cam: dolly(V(2.4, 2.4, 8.2), V(2.0, 2.3, 7.2), V(.4, 1.4, -1), V(.6, 1.5, -.5)),
    light: (L) => { L.hemi.intensity = .8; }, upd: lt => { models.forEach((m, i) => { const z = -5 + ((lt * 1.2 + i * 3) % 6); m.position.set(0, .3, z); walk(m, lt + i, 6, .3); blink(m, lt); }); idle(a, lt); fl.forEach((f, i) => f.visible = Math.sin(lt * 10 + i * 1.9) > .8); pop(t, lt, .2); } };
});
S('b_stay', () => {
  const g = room('#cbbfae', '#efe8dc', { w: 9, h: 5, side: false });
  const cal = canvasTex(360, 420, (c, w, h, n = 1) => { c.fillStyle = '#fff'; c.fillRect(0, 0, w, h); c.fillStyle = '#d3263a'; c.fillRect(0, 0, w, 90); c.fillStyle = '#fff'; c.font = FONT(44); c.textAlign = 'center'; c.fillText('DAYS IN NYC', w / 2, 62); c.fillStyle = '#1d2433'; c.font = FONT(n > 99 ? 150 : 190); c.fillText(String(n), w / 2, 300); });
  const cp = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 1.75), new THREE.MeshStandardMaterial({ map: cal, roughness: .8 })); cp.position.set(-1.3, 2.9, -2.92); g.add(cp);
  const a = CAST.anna(); a.position.set(.25, 0, .2); a.rotation.y = -.3; g.add(a);
  const cs = grp(rbox(.5, .7, .25, .06, '#7b4a2c', 0, .35, 0)); cs.position.set(1.2, 0, .4); g.add(cs);
  return { g, bg: ['#4a4a5e', '#d4c4b4'], focus: V(0, 1.5, -1), cam: dolly(V(-.2, 2.3, 5.2), V(-.4, 2.4, 4.4), V(-.4, 2.0, -1), V(-.5, 2.2, -1.2)),
    upd: lt => { const n = lt < 1.3 ? 1 + Math.floor(lt * 3) : lt < 2.4 ? Math.floor(5 + (lt - 1.3) * 60) : Math.min(999, Math.floor(70 + (lt - 2.4) ** 2 * 400)); if (cal.n !== n) { cal.n = n; cal.redraw(n); } idle(a, lt); } };
});
S('b_nojob', () => {
  const g = stage('#9a9aa2', '#6a6e7c'); for (let i = 0; i < 5; i++) { const b = building(2.4, 5, 1, ['#b8775a', '#8e6250', '#a9826a'][i % 3], { seed: i, wx: .8 }); b.position.set(-5 + i * 2.5, 0, -3.5); g.add(b); }
  g.add(box(24, .16, 2.5, '#c9c9cc', 0, .08, -1.8));
  const a = CAST.anna({ dress: null, coat: '#c9a27a', top: '#c9a27a', bottom: '#1d1d22' }); a.position.set(0, .16, -1.2); g.add(a);
  const cs = grp(rbox(.5, .7, .25, .06, '#7b4a2c', 0, .35, 0)); cs.position.set(.55, .16, -1.1); g.add(cs);
  const mk = (t) => { const s = tag(t, '#ffffff', '#d3263a', .32); g.add(s); return s; };
  const s1 = mk('NO JOB'), s2 = mk('NO APARTMENT'); s1.position.set(-.55, 2.75, -.6); s2.position.set(.5, 2.35, -.6);
  return { g, bg: ['#7c8db0', '#d8dde8'], focus: V(0, 1, -1), cam: dolly(V(0, 2.2, 5), V(0, 2.1, 4.3), V(0, 1.7, -1), V(0, 1.8, -1)),
    upd: lt => { idle(a, lt); pop(s1, lt, .1); pop(s2, lt, .9); } };
});
S('b_case', () => {
  const g = stage('#d8c6c0', '#4a3a55');
  const base = rbox(2.2, .4, 1.4, .08, '#7b4a2c', 0, .2, 0); g.add(base); const lid = grp(rbox(2.2, .12, 1.4, .06, '#6a3e24', 0, .06, .7)); lid.position.set(0, .4, -.7); g.add(lid);
  const items = []; const C = ['#e8505b', '#f2f2f2', '#151517', '#c9a27a', '#4a90d9', '#e2b13c'];
  for (let i = 0; i < 6; i++) { const it = rbox(.6, .1, .45, .04, C[i], -.66 + (i % 3) * .66, .45, -.3 + (i / 3 | 0) * .6); g.add(it); items.push(it); }
  const sg = grp(rbox(.5, .14, .2, .06, '#111', 0, 0, 0)); sg.position.set(.3, .62, .1); g.add(sg);
  const lb = ['DESIGNER', 'SILK', 'SUNGLASSES'].map((t, i) => { const l = tag(t, '#ffffff', '#1d2433', .28); l.position.set(-.7 + i * .7, 1.2 + (i % 2) * .3, .3); g.add(l); return l; });
  const bb = bubble('...and a story', '#ffd23f', '#1d2433', 1.6); bb.position.set(0, 1.85, .2); bb.scale.setScalar(.7); g.add(bb);
  return { g, bg: ['#2d2438', '#c39aa6'], focus: V(0, .5, 0), cam: dolly(V(0, 3.0, 3.6), V(0, 2.8, 3.0), V(0, .6, 0), V(0, .9, 0)),
    upd: lt => { lid.rotation.x = -1.9 * eio(clamp(lt / .8)); items.forEach((it, i) => pop(it, lt, .6 + i * .12)); pop(sg, lt, 1.4); lb.forEach((l, i) => pop(l, lt, 1.2 + i * .35)); pop(bb, lt, 2.8); } };
});
S('b_name', () => {
  const g = room('#d9c6b8', '#5a3a4a', { w: 10, h: 5, side: false });
  const a = CAST.anna(); a.position.set(-.6, 0, .3); a.rotation.y = .5; g.add(a);
  const g1 = guest(1, { smile: true }), g2 = guest(2); g1.position.set(.9, 0, .6); g1.rotation.y = -.8; g2.position.set(1.3, 0, -.5); g2.rotation.y = -.9; g.add(g1, g2);
  const gl = glass(); gl.position.set(0, -.62, .06); a.userData.armL.add(gl);
  const nm = tag('ANNA DELVEY', GOLD, '#1d2433', .5); nm.position.set(-.6, 2.65, .4); g.add(nm);
  const th = new THREE.Group(); th.position.set(-.4, 3.6, -.6); g.add(th);
  th.add(rbox(3.2, 1.9, .1, .3, '#ffffff', 0, 0, -.1));
  const man = grp(box(1.6, .8, .5, '#efe6d6', 0, -.2, 0), mesh(new THREE.ConeGeometry(1.1, .5, 4), '#7a3a2a', 0, .45, 0)); man.children[1].rotation.y = Math.PI / 4; man.position.set(-.5, -.2, 0); th.add(man);
  const fl = grp(box(.7, .15, .02, '#1b1b1b', 0, .15, 0), box(.7, .15, .02, '#c8202f', 0, 0, 0), box(.7, .15, .02, '#f2c418', 0, -.15, 0)); fl.position.set(.95, .2, .05); th.add(fl);
  const eu = label('€€€', { fg: '#1f9d55', size: 70 }); eu.scale.setScalar(.6); eu.position.set(.95, -.45, .06); th.add(eu);
  return { g, bg: ['#2d1f2c', '#b98a8a'], focus: V(0, 1.2, 0), cam: dolly(V(.2, 2.4, 6), V(0, 2.6, 5.2), V(0, 2.0, 0), V(0, 2.4, 0)),
    upd: lt => { idle(a, lt); talk(a, lt, true); idle(g1, lt); idle(g2, lt); a.userData.armL.rotation.x = -.9; a.userData.armR.rotation.x = -.6 - Math.sin(lt * 3) * .2; pop(nm, lt, .4); pop(th, lt, 3.2); g1.userData.head.rotation.x = Math.sin(lt * 4) * .08; } };
});

// ===== LIFE =====
function partyRoom() {
  const g = room('#2c2433', '#3a2d48', { w: 12, h: 6, side: false });
  for (let i = 0; i < 3; i++) { const f = frame(1.2, .9, abstractArt(i + 2)); f.position.set(-3 + i * 3, 3, -2.9); g.add(f); }
  return g;
}
S('c_believe', () => {
  const g = partyRoom(); const a = CAST.anna(); a.position.set(0, 0, 0); g.add(a);
  const G = [3, 4, 5, 6].map((i, k) => { const p = guest(i, { smile: true }); const an = -1.1 + k * .75; p.position.set(Math.sin(an) * 1.6, 0, Math.cos(an) * 1.6 - .2 + .4); p.lookAt(0, 0, -.2); g.add(p); return p; });
  return { g, bg: ['#1a1324', '#5a3a5e'], focus: V(0, 1, 0), cam: dolly(V(0, 2.6, 5.4), V(0, 2.5, 4.8), V(0, 1.6, 0), V(0, 1.7, 0)),
    light: L => { L.hemi.intensity = 1; }, upd: lt => { idle(a, lt); talk(a, lt); G.forEach((p, i) => { blink(p, lt); p.userData.head.rotation.x = Math.max(0, Math.sin(lt * 5 + i)) * .18; }); } };
});
S('c_rest', () => {
  const g = room('#5a3a2c', '#7a2c34', { w: 10, h: 5, side: false });
  const t = table(.7); t.position.set(0, 0, 0); g.add(t); const a = CAST.anna(); a.position.set(-.55, -.32, -.45); a.rotation.y = .5; g.add(a);
  const ch = grp(box(.5, .06, .5, '#3a2418', 0, .5, 0), box(.5, .7, .06, '#3a2418', 0, .85, -.25)); ch.position.set(-.6, 0, -.55); ch.rotation.y = .5; g.add(ch);
  const pl = cyl(.18, .14, .03, '#fff', -.1, .82, -.05, 20); g.add(pl); const gl = glass(); gl.position.set(.25, .86, -.1); g.add(gl);
  const bt = grp(cyl(.07, .07, .4, '#1f4a2c', 0, .2, 0, 12), cyl(.025, .03, .15, '#1f4a2c', 0, .47, 0, 8), cyl(.03, .03, .05, GOLD, 0, .56, 0, 8)); bt.position.set(.4, .8, .15); g.add(bt);
  const w = human({ suit: '#151517', tie: '#151517', shirt: '#fff', skin: SKINS2[2], hair: HAIRS.black, hairStyle: 'slick', seed: 11 }); w.position.set(1.2, 0, -.4); w.rotation.y = -.6; g.add(w);
  for (let i = 0; i < 3; i++) { const l = lampStand(); l.scale.setScalar(.7); l.position.set(-3 + i * 3, 2.2, -2.7); g.add(l); }
  return { g, bg: ['#2a1418', '#8a4a3a'], focus: V(0, 1, 0), cam: dolly(V(.8, 2.0, 3.6), V(.5, 1.9, 3.0), V(-.1, 1.2, -.2), V(-.2, 1.25, -.3)),
    light: L => { L.key.color.set('#ffd2a0'); }, upd: lt => { idle(a, lt); a.userData.armR.rotation.x = -.9 - Math.sin(lt * 4) * .15; idle(w, lt); } };
});
S('c_tips', () => {
  const g = stage('#8a8f99', '#2a2f40'); const h = building(6, 6, 1, '#d8cbb5', { seed: 2, lit: .7, win: '#5a6b8a' }); h.position.set(0, 0, -3.6); g.add(h);
  const dr = door('#3a2418', 1.6, 2.6); dr.position.set(0, 0, -3.05); g.add(dr); const aw = box(3, .1, 1.4, '#7a1c2b', 0, 2.9, -2.4); g.add(aw);
  const hs = sign('THE HOTEL', { bg: '#1d2433', fg: GOLD, size: 60 }); hs.scale.setScalar(.5); hs.position.set(0, 3.3, -1.75); g.add(hs);
  const dm = human({ suit: '#7a1c2b', tie: '#c9a54b', skin: SKINS2[4], hair: HAIRS.black, hairStyle: 'short', cap: '#7a1c2b', seed: 12 }); dm.position.set(.7, 0, -1.5); dm.rotation.y = -.5; g.add(dm);
  const a = CAST.anna(); a.position.set(-.5, 0, -1); a.rotation.y = .7; g.add(a);
  const n = note(); n.scale.setScalar(.7); g.add(n); const fn = flyingNotes(10, 9); fn.position.set(0, 0, -1); g.add(fn);
  const lb = big('$100', '#7ee08a', .45); lb.position.set(.1, 2.15, -.8); g.add(lb);
  return { g, bg: ['#26304a', '#a7b4cf'], focus: V(0, 1, -1), cam: dolly(V(-.3, 2.0, 5.0), V(-.1, 2.0, 4.2), V(.1, 1.4, -1.2), V(.1, 1.45, -1.2)),
    upd: lt => { idle(a, lt); idle(dm, lt); const k = ease(clamp(lt / .8)); a.userData.armR.rotation.x = -1.2 * k; n.position.set(lerp(-.25, .1, k), 1.3, -.7); n.rotation.set(0, .5, .2); n.visible = lt < 2.2;
      dm.userData.armL.rotation.x = lt > 1 ? -1.1 : 0; pop(lb, lt, .9); fn.userData.upd(lt - 2.4); dm.userData.mouth.scale.y = 1; } };
});
S('c_party', () => {
  const g = partyRoom(); const P = [];
  for (let i = 0; i < 9; i++) { const p = guest(i + 7, { smile: i % 3 === 0 }); p.position.set(-2.4 + (i % 5) * 1.2, 0, -.9 + (i / 5 | 0) * 1.5 + (i % 2) * .2); p.rotation.y = (i % 2 ? -.4 : .4); g.add(p); P.push(p); }
  const a = CAST.anna({ smile: true }); a.position.set(0, 0, 1.2); g.add(a);
  const L = [['ARTISTS', '#e8505b', -1.5, 2.9], ['BANKERS', '#4a90d9', 0, 3.3], ['MILLIONAIRES', GOLD, 1.4, 2.9]].map(([t, c, x, y]) => { const s = tag(t, c, c === GOLD ? '#1d2433' : '#fff', .42); s.position.set(x, y, -.6); g.add(s); return s; });
  const disco = []; for (let i = 0; i < 5; i++) { const d = mesh(new THREE.CylinderGeometry(.5, .9, .02, 24), E(['#ff4fa3', '#4fd1ff', '#ffd23f', '#9b59ff', '#4fff9a'][i], .8), -3 + i * 1.5, .02, 0, false); g.add(d); disco.push(d); }
  return { g, bg: ['#130c1c', '#4a2a5a'], focus: V(0, 1, 0), cam: dolly(V(.4, 3.0, 8.8), V(-.2, 2.9, 7.8), V(0, 1.6, 0), V(0, 1.7, 0)),
    light: L => { L.hemi.intensity = .9; L.key.intensity = 2; }, upd: lt => { P.forEach((p, i) => { idle(p, lt + i); p.position.y = Math.abs(Math.sin(lt * 4 + i)) * .06; }); idle(a, lt); L.forEach((s, i) => pop(s, lt, .5 + i * .9)); disco.forEach((d, i) => { d.position.x = -3 + i * 1.5 + Math.sin(lt * 1.5 + i) * .8; d.position.z = Math.cos(lt + i) * 1.2; }); } };
});
S('c_nobody', () => {
  const g = partyRoom(); const P = [];
  for (let i = 0; i < 4; i++) { const p = guest(i + 21); const an = -.9 + i * .6; p.position.set(Math.sin(an) * 2, 0, Math.cos(an) * 1.2 - .6); p.lookAt(0, 0, .2); g.add(p); P.push(p); }
  const a = CAST.anna({ smile: true }); a.position.set(0, 0, .6); g.add(a);
  const q = P.map((p, i) => { const l = big('?', '#ffffff', .8, 150); l.position.copy(p.position).add(V(0, 2.6, 0)); g.add(l); return l; });
  const sh = tag('NOBODY ASKS', '#ffffff', '#1d2433', .36); sh.position.set(0, 2.85, -.2); g.add(sh);
  return { g, bg: ['#130c1c', '#4a2a5a'], focus: V(0, 1, 0), cam: dolly(V(0, 2.6, 6.2), V(0, 2.0, 2.6), V(0, 1.8, 0), V(0, 1.95, .6)),
    light: L => { L.hemi.intensity = 1; }, upd: lt => { P.forEach((p, i) => idle(p, lt + i)); idle(a, lt * .5, .4);
      q.forEach((l, i) => { pop(l, lt, .3 + i * .2); const k = clamp((lt - 2 - i * .15) / .4); if (k > 0) l.scale.setScalar(Math.max(.001, .8 * (1 - ease(k)))); l.visible = l.visible && k < 1; });
      pop(sh, lt, 2.6); sh.visible = sh.visible && lt < 5.2; } };
});

// ===== CLUB DREAM =====
S('d_dream', () => {
  const g = stage('#cbbfd8', '#2a2f55'); const a = CAST.anna(); a.position.set(-.6, 0, .4); a.rotation.y = .35; g.add(a);
  const th = grp(rbox(2.4, 1.6, .1, .3, '#1d3b6e', 0, 0, 0)); th.position.set(.5, 2.9, -.2); th.scale.setScalar(.72);
  const bp = canvasTex(400, 260, (c, w, h) => { c.strokeStyle = '#cfe3ff'; c.lineWidth = 4; c.strokeRect(30, 40, 340, 190); c.beginPath(); c.moveTo(30, 110); c.lineTo(370, 110); c.moveTo(30, 170); c.lineTo(370, 170); c.moveTo(200, 40); c.lineTo(200, 230); c.stroke(); c.fillStyle = '#cfe3ff'; c.font = FONT(26); c.fillText('CLUB', 60, 90); c.fillText('ART', 230, 150); });
  const p = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 1.43), new THREE.MeshBasicMaterial({ map: bp, toneMapped: false })); p.position.z = .06; th.add(p); g.add(th);
  for (let i = 0; i < 3; i++) { const d = sph(.08 + i * .04, '#fff', -.2 + i * .25, 2.1 + i * .22, .1); g.add(d); }
  return { g, bg: ['#1d2244', '#8f84b8'], focus: V(0, 1.5, 0), cam: dolly(V(.2, 2.4, 4.8), V(.1, 2.5, 4.2), V(.1, 2.1, 0), V(.1, 2.3, 0)), upd: lt => { idle(a, lt); a.userData.head.rotation.x = -.2; pop(th, lt, .2); } };
});
S('d_found', () => {
  const g = room('#e9e4dc', '#f6f3ee', { w: 12, h: 5.5, skirt: '#cfc7ba', wc2: '#efebe4' });
  for (let i = 0; i < 4; i++) { const f = frame(1.1, 1.4, abstractArt(i + 5), '#1d1d1d'); f.position.set(-2.6 + i * 1.75, 2.4, -2.9); g.add(f); }
  const ped = grp(box(.6, 1, .6, '#ffffff', 0, .5, 0), sph(.3, '#e8b04a', 0, 1.3, 0, 16)); ped.position.set(1.8, 0, .2); g.add(ped);
  const s = sign('THE ANNA DELVEY\nFOUNDATION', { bg: '#14101a', fg: '#f2e6c8', size: 64 }); s.scale.setScalar(.75); s.position.set(0, 4.1, -2.8); g.add(s);
  const P = [30, 31, 32].map((i, k) => { const p = guest(i); p.position.set(-1.8 + k * 1.3, 0, -.8 + (k % 2) * .5); p.rotation.y = Math.PI + (k - 1) * .4; g.add(p); return p; });
  return { g, bg: ['#d8d2c8', '#f6f3ee'], focus: V(0, 1.5, -1), cam: dolly(V(.6, 2.6, 6.6), V(0, 2.8, 5.6), V(0, 2.4, -1.5), V(0, 2.8, -1.5)), upd: lt => { pop(s, lt, .3); P.forEach((p, i) => idle(p, lt + i)); } };
});
S('d_rooms', () => {
  const g = stage('#d7c9bd', '#2a2f55'); const bld = new THREE.Group(); g.add(bld);
  const F = [['MEMBERS LOUNGE', '#7a2c46'], ['RESTAURANT', '#8a5a2c'], ['GALLERIES', '#e9e4dc']].reverse();
  const floors = F.map(([t, c], i) => { const f = grp(box(4.4, .12, 2.4, '#b8ad9e', 0, 0, 0), box(4.4, 1.3, .1, c, 0, .7, -1.15), box(.1, 1.3, 2.4, '#cfc4b6', -2.15, .7, 0));
    if (i === 0) for (let k = 0; k < 3; k++) { const fr = frame(.7, .55, abstractArt(k + 9), '#1d1d1d'); fr.position.set(-1.3 + k * 1.3, .8, -1.08); f.add(fr); }
    if (i === 1) for (let k = 0; k < 3; k++) { const t2 = table(.35); t2.scale.setScalar(.7); t2.position.set(-1.3 + k * 1.3, .06, 0); f.add(t2); }
    if (i === 2) { const so = sofa(); so.scale.setScalar(.6); so.position.set(-.5, .06, -.5); f.add(so); const lp = lampStand(); lp.scale.setScalar(.6); lp.position.set(1.2, .06, -.6); f.add(lp); }
    const l = tag(t, '#ffffff', '#1d2433', .38); l.position.set(1.0, 1.2, .9); f.add(l); f.userData.l = l; f.position.y = i * 1.45; bld.add(f); return f; });
  bld.add(box(4.4, .14, 2.4, '#8a7e70', 0, 4.35, 0));
  return { g, bg: ['#2a2f55', '#c7b3c6'], focus: V(0, 2, 0), cam: dolly(V(1.4, 2.4, 7.6), V(.8, 2.6, 6.6), V(0, 2.1, 0), V(0, 2.3, 0)),
    upd: lt => floors.forEach((f, i) => { pop(f, lt, .2 + i * 1.2); pop(f.userData.l, lt, .6 + i * 1.2); }) };
});
S('d_building', () => {
  const g = stage('#8d8f96', null, { w: 40, d: 30 }); g.add(box(30, .02, 4, '#3d3f46', 0, .01, 2.5));
  const ch = new THREE.Group(); const st = '#b9a68a';
  ch.add(box(4, 7, 3, st, 0, 3.5, 0)); for (let j = 0; j < 6; j++) for (let i = 0; i < 4; i++) { const w = mesh(new THREE.BoxGeometry(.45, .75, .05), M('#3b4a5e', { roughness: .2 }), -1.4 + i * .93, 1.1 + j * 1.0, 1.51); ch.add(w); const arch = cyl(.225, .225, .05, '#3b4a5e', -1.4 + i * .93, 1.48 + j * 1.0, 1.51, 12); arch.rotation.x = Math.PI / 2; ch.add(arch); }
  ch.add(box(4.3, .3, 3.3, '#a39176', 0, 7.1, 0)); const rf = mesh(new THREE.ConeGeometry(2.6, 1.6, 4), '#6b5a48', 0, 8.0, 0); rf.rotation.y = Math.PI / 4; rf.scale.set(1.1, 1, .8); ch.add(rf);
  ch.add(door('#3a2418', 1, 1.8)); ch.children.at(-1).position.set(0, 0, 1.52);
  ch.position.set(0, 0, -2); g.add(ch);
  for (const x of [-4.4, 4.4]) { const b = building(3.6, 9, 3, '#7a8090', { seed: x > 0 ? 3 : 4, wx: .6 }); b.position.set(x, 0, -2.2); g.add(b); }
  const ss = sign('PARK AVE S', { bg: '#1f7a43', fg: '#fff', size: 60 }); ss.scale.setScalar(.4); ss.position.set(-2.6, 2.6, 1.2); g.add(ss, cyl(.04, .04, 2.6, '#444', -2.6, 1.3, 1.15, 8));
  const nm = tag('CHURCH MISSIONS HOUSE', GOLD, '#1d2433', .5); nm.position.set(0, 2.6, 1.6); g.add(nm);
  return { g, bg: ['#5b7fb8', '#e9d8c3'], focus: V(0, 3, -2), cam: dolly(V(1.5, 1.4, 9.6), V(.3, 2.0, 8.2), V(0, 4.4, -2), V(0, 4.6, -2), 40, 38), shift: 120,
    upd: lt => { pop(nm, lt, 1.6); pop(ss, lt, .6); } };
});
S('d_money', () => {
  const g = stage('#2c3a2f', '#1b2a20'); const a = CAST.anna(); a.position.set(0, 0, .4); g.add(a);
  const S_ = []; for (let i = 0; i < 8; i++) { const s = grp(); const an = i / 8 * Math.PI * 2; s.position.set(Math.cos(an) * 1.7, 0, Math.sin(an) * 1.0 - .2); g.add(s); S_.push(s); }
  const lb = big('$$$', '#7ee08a', .6, 160); lb.position.set(0, 2.6, 0); g.add(lb);
  return { g, bg: ['#0f1a12', '#3c6a46'], focus: V(0, 1, 0), cam: dolly(V(0, 2.4, 5.6), V(0, 2.6, 4.8), V(0, 1.4, 0), V(0, 1.6, 0)),
    upd: lt => { idle(a, lt); a.userData.armL.rotation.z = -.6; a.userData.armR.rotation.z = .6; S_.forEach((s, i) => { const n = Math.min(14, Math.floor(Math.max(0, lt - i * .1) * 8)); while (s.children.length < n) s.add(box(.5, .06, .22, '#8fb88a', 0, .03 + s.children.length * .065, 0)); }); pop(lb, lt, .8); } };
});
