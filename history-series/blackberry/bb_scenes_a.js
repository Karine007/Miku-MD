// Scenes: hook, origin, CrackBerry, Obama, BBM
import { THREE, M, E, mesh, box, rbox, cyl, sph, grp, V, clamp, ease, eio, backOut, lerp, pop, dolly, canvasTex, FONT, rrect, label, sign,
  person, holdPhone, walk, SCR, screen, blackberry, touchPhone, appGrid, pager, tablet, desk, chair, floor, wall, calendar, cash, tree, flag,
  snowfall, bubble, bar, rng } from './bb_kit.js';
export const SA = []; const S = (id, build) => SA.push({ id, build });

export function stage(fc = '#d8c3bd', wc = '#27305e', o = {}) {
  const g = grp(floor(o.w || 22, o.d || 16, fc)); if (wc) g.add(wall(o.w || 22, o.h || 9, wc, o.z ?? -4)); return g;
}
export const SKINS = ['#e9b98f', '#c98d64', '#8d5a3b', '#5f3b26', '#f1c9a5'];
export const SHIRTS = ['#e8505b', '#4a90d9', '#f5a623', '#7ed321', '#9b59b6', '#1abc9c', '#f06292', '#ffca28', '#5c6bc0', '#26a69a'];
export function setOff(ph, on = false) { ph.userData.screen.material.map = on ? ph.userData.onTex : OFF; }
export const OFF = screen(SCR.off, 16, 16);
export function rug(r, c, ring) { const g = grp(cyl(r, r, .03, c, 0, .015, 0, 40)); if (ring) g.add(cyl(r * .8, r * .8, .035, ring, 0, .016, 0, 40), cyl(r * .76, r * .76, .04, c, 0, .017, 0, 40)); g.children.forEach(m => m.castShadow = false); return g; }
export function lamp(c = '#ffe9b0') { const g = grp(cyl(.15, .2, .05, '#333', 0, .025, 0), cyl(.02, .02, .6, '#333', 0, .3, 0), mesh(new THREE.ConeGeometry(.18, .2, 12, 1, true), M('#2b2b2b', { side: THREE.DoubleSide }), 0, .65, 0)); const l = new THREE.PointLight(c, 3, 3, 1.5); l.position.y = .55; g.add(l); return g; }

// ===== HOOK =====
S('s_worth', () => {
  const g = stage('#1e2650', '#151c3f'); const H = [.5, 1, 1.6, 2.5, 3.6];
  const bars = H.map((h, i) => { const b = bar(h, i == 4 ? '#3ccf7e' : '#3a6fd8', .62); b.position.x = (i - 2) * .78; g.add(b);
    const y = label(String(2000 + i * 2), { size: 56, fg: '#c9d3ff' }); y.scale.setScalar(.55); y.position.set((i - 2) * .78, -.02, .5); y.rotation.x = -1.2; g.add(y); return b; });
  const ph = blackberry(); ph.scale.setScalar(.8); ph.position.set(1.56, 3.6 + .5, 0); g.add(ph);
  const tag = sign('$80 BILLION', { bg: '#ffd23f', size: 96, frame: '#7a5a00' }); tag.scale.setScalar(.7); tag.position.set(0, 5.0, .2); g.add(tag);
  return { g, bg: ['#0c1330', '#3a2a5e'], focus: V(0, 2, 0), cam: dolly(V(-.4, 1.6, 10.5), V(.3, 3.4, 8.2), V(0, 2.2, 0), V(.3, 3.4, 0)),
    upd: lt => { bars.forEach((b, i) => b.scale.y = Math.max(.001, ease((lt - i * .3) / .9))); pop(ph, lt, 1.6); pop(tag, lt, 2.2); ph.rotation.y = Math.sin(lt) * .3; } };
});
function oval(g) {
  g.add(rug(3, '#1f3a7a', '#d8b54a'));
  const f = flag(); f.position.set(-1.6, 0, -3.2); g.add(f);
  const f2 = flag(false); f2.position.set(1.4, 0, -3.2); f2.children[1].material = M('#2a4aa0', { side: THREE.DoubleSide }); g.add(f2);
  const win = box(1.4, 2.4, .05, E('#cfe3ff', .8), 0, 1.9, -3.92); g.add(win); g.add(box(1.5, .08, .1, '#f5f1e6', 0, 3.12, -3.9), box(.06, 2.4, .1, '#f5f1e6', 0, 1.9, -3.88));
}
S('s_pres', () => {
  const g = stage('#e8dcc8', '#f0e6d2'); oval(g);
  const pr = person({ suit: '#1d2333', skin: SKINS[2], hair: '#1a1410', tie: '#2a4aa0' }); pr.position.set(.45, 0, 0); pr.rotation.y = -.5;
  const ph = holdPhone(pr, blackberry({ screen: screen(SCR.mail) })); g.add(pr);
  const ag = person({ suit: '#14161c', skin: SKINS[0], hair: '#3a2a1c', glasses: true, tie: '#111' }); ag.position.set(-.75, 0, .3); ag.rotation.y = .9; g.add(ag);
  return { g, bg: ['#f1e7d6', '#d9c7a8'], cam: dolly(V(.3, 1.9, 5.2), V(.1, 1.7, 4.2), V(0, 1.4, 0), V(0, 1.45, 0)),
    upd: lt => { ag.userData.armR.rotation.x = -lerp(.2, 1.45, ease(lt / 1.2)); pr.rotation.y = -.5 - ease((lt - .8) / 1) * .5; } };
});
S('s_crowd', () => {
  const g = stage('#b9b3c4', null, { w: 30, d: 30 }); g.add(box(30, .02, 3, '#8f8a99', 0, .01, 0)); const r = rng(7); const P = [];
  for (let i = 0; i < 24; i++) {
    const p = person({ shirt: SHIRTS[i % 10], skin: SKINS[i % 5], pants: ['#2c3443', '#4b3b2a', '#22303f'][i % 3], suit: i % 4 == 0 ? '#23283a' : null, hair: ['#2b1d14', '#8a5a2b', '#111', '#c79a54'][i % 4], long: i % 3 == 0 });
    p.position.set((i % 6 - 2.5) * 1.15 + (r() - .5) * .4, 0, ((i / 6 | 0) - 1.5) * 1.3 + (r() - .5) * .4); p.rotation.y = (r() - .5) * 1.2;
    holdPhone(p, blackberry({ screen: screen(i % 2 ? SCR.bbm : SCR.mail) })); g.add(p); P.push(p);
  }
  return { g, bg: ['#7d8fb8', '#e6c3c8'], cam: dolly(V(0, 7.5, 9), V(0, 6.5, 7.6), V(0, 0.6, 0), V(0, .8, 0)),
    upd: lt => P.forEach((p, i) => p.userData.armL.rotation.x = -1.1 + Math.sin(lt * 9 + i) * .05) };
});
S('s_dead', () => {
  const g = stage('#2a2f45', '#1c2238'); const cal = calendar('JANUARY 2022', '4', 'TUESDAY'); cal.position.set(0, 3.1, -3.5); cal.scale.setScalar(.95); g.add(cal);
  const shelf = box(4.6, .12, .9, '#6b4a33', 0, .9, 0); g.add(shelf, box(.12, .9, .8, '#5a3e2b', -2.2, .45, 0), box(.12, .9, .8, '#5a3e2b', 2.2, .45, 0));
  const P = []; for (let i = 0; i < 6; i++) { const t = screen(i % 2 ? SCR.home : SCR.bbm); const p = blackberry({ screen: t }); p.userData.onTex = t; p.scale.setScalar(.62); p.position.set((i - 2.5) * .72, 1.32, 0); p.rotation.x = -.12; g.add(p); P.push(p); }
  return { g, bg: ['#141a33', '#2e2346'], focus: V(0, 1.5, 0), cam: dolly(V(0, 3.4, 6.6), V(0, 1.8, 4.4), V(0, 3, -2), V(0, 1.3, 0)),
    light: (L, lt) => { L.key.intensity = 1.6; L.hemi.intensity = lerp(1.1, .55, ease((lt - 2.5) / 3)); },
    upd: lt => { pop(cal, lt, .1); P.forEach((p, i) => { const off = lt > 3.2 + i * .35; p.userData.screen.material.map = off ? OFF : p.userData.onTex; p.userData.led.visible = !off; }); } };
});
S('s_title', () => {
  const g = stage('#262c48', '#161b33'); const ph = blackberry(); ph.scale.setScalar(2.2); const piv = grp(ph); ph.position.set(0, 1.25, 0); g.add(piv);
  const t = label('THE FALL OF\nBLACKBERRY', { size: 120, fg: '#ffffff' }); t.scale.setScalar(.75); t.position.set(0, 4.3, -3.8); g.add(t);
  return { g, bg: ['#0f1430', '#352951'], focus: V(0, 1.5, 0), cam: dolly(V(0, 2.4, 7), V(0, 2.0, 6.2), V(0, 2.4, 0), V(0, 2.0, 0)),
    upd: lt => { const k = clamp((lt - .9) / .7); piv.rotation.x = -k * k * 1.5; piv.position.z = -k * .1; piv.position.y = k * .1 * 0; pop(t, lt, .2); } };
});

// ===== ORIGIN =====
S('s_waterloo', () => {
  const g = stage('#eef2f8', null, { w: 40, d: 40 }); const b = grp(box(3.6, 2.2, 2.4, '#8c4a3a', 0, 1.1, 0), box(3.8, .2, 2.6, '#f4f7fb', 0, 2.3, 0));
  for (let i = 0; i < 2; i++) b.add(box(.8, .7, .05, E('#ffd27a', 1.2), -1 + i * 2, 1.2, 1.22)); b.add(box(.7, 1.3, .05, '#3b2a22', .0, .65, 1.22));
  const sg = sign('RESEARCH IN MOTION', { bg: '#1e2a44', fg: '#ffffff', size: 64, frame: '#0e1424' }); sg.scale.setScalar(.6); sg.position.set(0, 1.9, 1.26); b.add(sg); g.add(b);
  const r = rng(3); for (let i = 0; i < 14; i++) { const t = tree(1.1 + r() * .9, '#2f6b4f', true); const a = r() * Math.PI * 2, d = 4 + r() * 6; t.position.set(Math.cos(a) * d, 0, Math.sin(a) * d - 2); if (t.position.z > 2.5 && Math.abs(t.position.x) < 3) t.position.x += 4; g.add(t); }
  const post = sign('WATERLOO, CANADA · 1984', { bg: '#f5f1e6', fg: '#1d2433', size: 56 }); post.scale.setScalar(.5); post.position.set(-2.2, 1.0, 2.6); post.rotation.y = .4; g.add(post, cyl(.04, .04, .9, '#5a4030', -2.2, .45, 2.55));
  const sn = snowfall(500, 16, 8, 12); g.add(sn);
  return { g, bg: ['#24305e', '#a8a2c8'], fog: new THREE.Fog('#a8a2c8', 12, 30), focus: V(0, 1, 0), cam: dolly(V(-2.5, 2.5, 9.5), V(-1.2, 1.8, 7), V(0, 1.4, 0), V(-.6, 1.3, 0)),
    light: L => { L.key.color.set('#dfe8ff'); L.key.intensity = 1.6; }, upd: lt => sn.userData.tick(lt) };
});
function pcb(w = .5, d = .35) { const g = grp(box(w, .03, d, '#1f7a4a')); const r = rng(w * 100 | 0); for (let i = 0; i < 6; i++) g.add(box(.06 + r() * .06, .03, .05 + r() * .05, '#222', (r() - .5) * w * .8, .03, (r() - .5) * d * .8)); return g; }
S('s_founders', () => {
  const g = stage('#cdb9a8', '#3a4a7a'); const d = desk(3, 1.2, '#8a6242'); g.add(d);
  const b1 = pcb(); b1.position.set(-.5, .84, .1); const b2 = pcb(.6, .4); b2.position.set(.6, .84, 0); const l = lamp(); l.position.set(1.2, .82, -.35); g.add(b1, b2, l);
  const a = person({ shirt: '#5b7bb5', skin: SKINS[0], hair: '#5a4632', glasses: true, beard: false }); a.position.set(-.7, 0, .95); a.rotation.y = Math.PI;
  const b = person({ shirt: '#b5655b', skin: SKINS[4], hair: '#2b1d14' }); b.position.set(.7, 0, .95); b.rotation.y = Math.PI; g.add(a, b);
  [a, b].forEach(p => { p.userData.armL.rotation.x = -1; p.userData.armR.rotation.x = -1; p.userData.head.rotation.x = .3; });
  const n1 = sign('MIKE LAZARIDIS', { bg: '#ffd23f', size: 60 }); n1.scale.setScalar(.42); n1.position.set(-.8, 2.35, 1.2);
  const n2 = sign('DOUGLAS FREGIN', { bg: '#ffd23f', size: 60 }); n2.scale.setScalar(.42); n2.position.set(.8, 2.8, 1.2);
  const rim = sign('RESEARCH IN MOTION', { bg: '#ffffff', size: 80 }); rim.scale.setScalar(.6); rim.position.set(0, 3.9, -3.9); g.add(n1, n2, rim);
  const sp = sph(.03, E('#fff3a0', 3), -.5, .9, .1); g.add(sp);
  return { g, bg: ['#24305e', '#d4a5a5'], focus: V(0, 1, 0), cam: dolly(V(.4, 2.6, 6.2), V(-.2, 2.2, 5.0), V(0, 1.6, 0), V(0, 1.8, -.5)),
    upd: (lt, u) => { pop(n1, lt, .9); pop(n2, lt, 2.4); pop(rim, lt, 4.8); sp.visible = Math.sin(lt * 23) > .2; a.userData.armR.rotation.x = -1 + Math.sin(lt * 5) * .08; } };
});
S('s_pagers', () => {
  const g = stage('#c9c3d6', '#2f3c6e'); const t = desk(3.2, 1.2, '#5b6278'); g.add(t); const P = [];
  for (let i = 0; i < 3; i++) { const p = pager(); p.position.set((i - 1) * 1, 1.15, 0); p.rotation.x = -.3; g.add(p); P.push(p); const st = cyl(.25, .3, .1, '#333a4a', (i - 1) * 1, .87, 0); g.add(st); }
  return { g, bg: ['#28346a', '#c7a7c4'], cam: dolly(V(0, 2.8, 5.6), V(.3, 2.4, 4.6), V(0, 1.1, 0), V(0, 1.1, 0)),
    upd: lt => P.forEach((p, i) => { p.rotation.y = lt * 1.2 + i * 2; pop(p, lt, i * .4); }) };
});
function spot(g, x = 0, z = 0, c = '#fff4d6', I = 40) { const s = new THREE.SpotLight(c, I, 14, .45, .5, 1.2); s.position.set(x, 7, z + 1); s.target.position.set(x, 0, z); s.castShadow = false; g.add(s, s.target); const cone = mesh(new THREE.ConeGeometry(1.6, 7, 24, 1, true), new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: .07, side: THREE.DoubleSide, depthWrite: false }), x, 3.5, z, false); g.add(cone); return s; }
function pedestal(c = '#e9e4ef') { return grp(cyl(.8, .9, .9, c, 0, .45, 0, 32), cyl(.9, .9, .06, '#b9b2c6', 0, .93, 0, 32)); }
S('s_reveal', () => {
  const g = stage('#262a44', '#191d36'); g.add(pedestal()); spot(g);
  const ph = blackberry({ body: '#20345f', screen: screen(SCR.mail) }); ph.scale.setScalar(1.15); ph.position.y = 1.75; g.add(ph);
  const y = label('1999', { size: 160, fg: '#ffd23f' }); y.scale.setScalar(.7); y.position.set(0, 3.6, -3.6); g.add(y);
  return { g, bg: ['#0e1330', '#2a2148'], focus: V(0, 1.5, 0), cam: dolly(V(2.2, 2.3, 4.6), V(-.3, 2.0, 3.0), V(0, 1.75, 0), V(0, 1.85, 0)),
    light: L => { L.hemi.intensity = .5; L.key.intensity = 1.2; }, upd: lt => { ph.rotation.y = -.9 + ease(lt / 4) * .9 + Math.sin(lt) * .05; ph.position.y = 1.75 + Math.sin(lt * 1.5) * .04; pop(y, lt, 1); } };
});
function envelope() { const t = canvasTex(160, 110, (c, w, h) => { c.fillStyle = '#ffffff'; rrect(c, 0, 0, w, h, 10); c.fill(); c.strokeStyle = '#3d6fd8'; c.lineWidth = 8; c.beginPath(); c.moveTo(6, 8); c.lineTo(w / 2, h * .6); c.lineTo(w - 6, 8); c.stroke(); });
  return mesh(new THREE.BoxGeometry(.4, .28, .02), [M('#fff'), M('#fff'), M('#fff'), M('#fff'), new THREE.MeshBasicMaterial({ map: t }), M('#fff')]); }
S('s_email', () => {
  const g = stage('#c6cbe6', '#3a4c8a'); const ph = blackberry({ screen: screen(SCR.mail) }); ph.scale.setScalar(1.3); ph.position.y = 1.7; g.add(ph); g.add(pedestal('#dfe3f5'));
  const r = rng(11); const EV = []; for (let i = 0; i < 9; i++) { const e = envelope(); const a = r() * Math.PI * 2; e.userData.from = V(Math.cos(a) * 3.2, 1.7 + Math.sin(a) * 2.6, 1); e.userData.t0 = i * .28; g.add(e); EV.push(e); }
  return { g, bg: ['#283a7a', '#e0b6c8'], focus: V(0, 1.5, 0), cam: dolly(V(0, 1.9, 5.4), V(0, 1.8, 4.6), V(0, 1.75, 0), V(0, 1.8, 0)),
    upd: lt => { EV.forEach(e => { const k = clamp((lt - e.userData.t0) / .9); e.visible = k > 0 && k < 1; e.position.copy(e.userData.from).lerp(V(0, 2.05, .2), eio(k)); e.rotation.z = (1 - k) * 2; e.scale.setScalar(1 - k * .7); }); ph.userData.led.visible = Math.sin(lt * 8) > 0; } };
});
S('s_berry', () => {
  const g = stage('#e4d2d8', '#4a3a6e'); const ph = blackberry(); ph.scale.setScalar(2.4); ph.position.set(-.55, 1.9, 0); ph.rotation.set(-.15, .25, 0); g.add(ph);
  const berry = new THREE.Group(); const r = rng(5);
  for (let i = 0; i < 34; i++) { const a = r() * Math.PI * 2, y = r() * 1.1 - .55, rr = Math.sqrt(1 - (y / .62) ** 2) * .38; berry.add(sph(.12, M(i % 5 ? '#3a1d4f' : '#552a6e', { roughness: .3, flatShading: false }), Math.cos(a) * rr, y, Math.sin(a) * rr, 10)); }
  berry.add(mesh(new THREE.ConeGeometry(.2, .12, 6), '#3e7d3a', 0, .66, 0)); berry.add(cyl(.02, .02, .25, '#4f7d3a', 0, .8, 0, 5));
  berry.position.set(.95, 1.45, .6); berry.scale.setScalar(.85); g.add(berry);
  const arrow = label('=', { size: 140, fg: '#ffffff' }); arrow.scale.setScalar(.5); arrow.position.set(.32, 1.45, .8); g.add(arrow);
  return { g, bg: ['#2f2a5e', '#e2b4c6'], focus: V(0, 1.5, 0), cam: dolly(V(-.6, 1.4, 3.6), V(.1, 1.5, 4.4), V(-.5, 1.3, 0), V(.2, 1.5, 0)),
    upd: lt => { pop(berry, lt, 2.2, .6); pop(arrow, lt, 2.8); berry.rotation.y = lt * .5; } };
});

// ===== CRACKBERRY =====
S('s_buyers', () => {
  const g = stage('#d7cfc6', '#2d3a64'); const who = [['#1d2333', '#b3262e', 'BANKER'], ['#3a3f4b', '#2a4aa0', 'LAWYER'], ['#28304a', '#c9a74b', 'POLITICIAN']]; const P = [];
  who.forEach(([s, t, n], i) => { const p = person({ suit: s, tie: t, skin: SKINS[[0, 3, 1][i]], hair: ['#2b1d14', '#111', '#bbb'][i], bald: i == 2 }); p.position.set((i - 1) * 1.2, 0, 0); const ph = holdPhone(p, blackberry({ screen: screen(SCR.mail) })); p.userData.ph = ph; g.add(p); P.push(p);
    const l = sign(n, { bg: '#ffffff', size: 54 }); l.scale.setScalar(.42); l.position.set((i - 1) * 1.2, 2.55, .2); g.add(l); p.userData.l = l; });
  return { g, bg: ['#26336a', '#d9b2bd'], cam: dolly(V(0, 1.9, 6.8), V(0, 1.7, 6), V(0, 1.4, 0), V(0, 1.4, 0)),
    upd: lt => P.forEach((p, i) => { const t0 = i * 1.15; pop(p.userData.ph, lt, t0 + .1); pop(p.userData.l, lt, t0); const k = ease((lt - t0) / .4); p.userData.armR.rotation.x = lerp(0, -1.25, k); p.userData.armL.rotation.x = lerp(0, -1.1, k); p.userData.head.rotation.x = .38 * k; }) };
});
S('s_board', () => {
  const g = stage('#4a3d52', '#1f2747'); const tb = rbox(5.4, .12, 1.8, .05, '#6b4430', 0, .78, 0); g.add(tb, box(.3, .75, 1, '#4a2f22', -1.8, .38, 0), box(.3, .75, 1, '#4a2f22', 1.8, .38, 0));
  const P = []; for (let i = 0; i < 10; i++) { const x = ((i % 5) - 2) * 1.05, z = i < 5 ? -.6 : .6; const c = chair('#1e2230'); c.position.set(x, 0, z * 1.8); c.rotation.y = i < 5 ? 0 : Math.PI; g.add(c);
    const p = blackberry(); p.scale.setScalar(.3); p.rotation.x = -Math.PI / 2; p.position.set(x + .1, .86, z * .9); g.add(p); P.push(p); }
  for (let i = 0; i < 5; i++) g.add(box(1.4, 3.4, .05, E('#9fb8e8', .5), -3.2 + i * 1.6, 2.6, -3.92));
  for (let i = 0; i < 12; i++) g.add(box(.5, 1 + (i * 7 % 5) * .4, .05, '#33416b', -4 + i * .75, 1.2 + (i * 7 % 5) * .2, -3.88));
  return { g, bg: ['#1a2348', '#4a3a66'], focus: V(0, .8, 0), cam: dolly(V(0, 3.6, 5.2), V(1.2, 2.6, 4.2), V(0, .8, 0), V(0, .9, 0)),
    light: L => { L.hemi.intensity = .9; }, upd: lt => P.forEach((p, i) => p.userData.led.material = Math.sin(lt * 5 + i * 1.7) > .3 ? E('#ff2a2a', 4) : M('#5a1515')) };
});
S('s_bed', () => {
  const g = stage('#2a2f4f', '#1a1f3a'); const bed = grp(box(2.2, .45, 3, '#4a3a5e', 0, .25, 0), box(2.1, .2, 2.9, '#e8e4f0', 0, .55, 0), box(2.2, 1.1, .15, '#3a2d4c', 0, .55, -1.5), box(1.4, .18, .5, '#ffffff', 0, .72, -1.15), box(2.15, .14, 1.8, '#5b7bb5', 0, .7, .45)); g.add(bed);
  const p = person({ shirt: '#e6a23c', skin: SKINS[1], hair: '#2b1d14' }); p.position.set(0, .05, -.95); p.userData.legL.rotation.x = -1.5; p.userData.legR.rotation.x = -1.5; p.userData.legL.visible = p.userData.legR.visible = false;
  holdPhone(p, blackberry({ screen: screen(SCR.bbm) })); g.add(p);
  const glow = new THREE.PointLight('#7fb2ff', 2.2, 2.2, 1.4); glow.position.set(0, 1.5, -.3); g.add(glow);
  const moon = sph(.35, E('#fff6d8', 1.5), 2.2, 3.3, -3.9); g.add(moon, box(1.6, 1.6, .05, '#0f1430', 2.2, 3.3, -3.95));
  return { g, bg: ['#0b0f22', '#1f1a38'], focus: V(0, .8, 0), cam: dolly(V(1.2, 2.3, 2.6), V(.7, 2.1, 1.9), V(0, 1.2, -.9), V(0, 1.25, -.9)),
    light: L => { L.hemi.intensity = .7; L.key.intensity = .8; L.key.color.set('#8aa2ff'); L.fill.intensity = .2; }, upd: lt => { glow.intensity = 2.2 + Math.sin(lt * 7) * .3; } };
});
S('s_dict', () => {
  const g = stage('#d8c7d6', '#3b3f72'); const p = person({ suit: '#2b3045', skin: SKINS[0], hair: '#8a5a2b' }); p.position.set(-1.6, 0, .4); p.rotation.y = .3;
  holdPhone(p, blackberry({ screen: screen(SCR.bbm) })); p.userData.torso.rotation.x = .25; p.userData.head.rotation.x = .7; g.add(p);
  const pray = sign('THE “CRACKBERRY PRAYER”', { bg: '#ffffff', size: 50 }); pray.scale.setScalar(.45); pray.position.set(-1.6, 2.5, .5); g.add(pray);
  const bt = canvasTex(700, 460, (c, w, h) => { c.fillStyle = '#fbf7ec'; c.fillRect(0, 0, w, h); c.fillStyle = '#ccc4b0'; c.fillRect(w / 2 - 3, 0, 6, h);
    c.fillStyle = '#8a1c1c'; c.font = FONT(30); c.textAlign = 'center'; c.fillText('WORD OF THE YEAR', w * .75, 70); c.fillText('2006', w * .75, 110);
    c.fillStyle = '#1d2433'; c.font = FONT(58); c.fillText('Crack-', w * .75, 220); c.fillText('Berry', w * .75, 285);
    c.fillStyle = '#9a9384'; for (let i = 0; i < 9; i++) c.fillRect(40, 60 + i * 40, 250 - (i % 3) * 30, 10); for (let i = 0; i < 3; i++) c.fillRect(390, 330 + i * 32, 230, 10); });
  const book = grp(box(2.3, .12, 1.55, '#7a1f2b', 0, 0, 0)); const pg = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 1.45), new THREE.MeshStandardMaterial({ map: bt, roughness: .9 })); pg.rotation.x = -Math.PI / 2; pg.position.y = .065; book.add(pg);
  const st = grp(box(1, .9, .8, '#5b4a6b', 0, .45, 0)); st.add(book); book.position.y = 1.0; book.rotation.x = .55; st.position.set(1.1, 0, .2); g.add(st);
  return { g, bg: ['#2b2f66', '#e3b6c4'], cam: u => { const k = ease((u - .38) / .25); return { p: V(lerp(-1.4, 1.0, k), lerp(1.9, 2.4, k), lerp(4.6, 3.2, k)), l: V(lerp(-1.5, 1.1, k), lerp(1.4, 1.1, k), 0), fov: 40 }; },
    upd: (lt, u) => { pop(pray, lt, .6); pop(book, lt, 3.4, .6); p.userData.armL.rotation.x = -1.1 + Math.sin(lt * 14) * .05; } };
});
S('s_court', () => {
  const g = stage('#6b4a36', '#4a2f22'); const bench = grp(box(3.4, 1.4, 1, '#7a5236', 0, .7, -1.8), box(3.5, .1, 1.1, '#5a3a26', 0, 1.42, -1.8)); g.add(bench);
  const seal = sign('COURT', { bg: '#1d2f6a', fg: '#ffd23f', size: 60, radius: 60 }); seal.scale.setScalar(.6); seal.position.set(0, 3.3, -3.9); g.add(seal);
  const j = person({ suit: '#111216', shirt: '#111216', tie: '#111216', skin: SKINS[0], hair: '#ddd' }); j.position.set(0, .45, -2.4); g.add(j);
  const gav = grp(cyl(.06, .06, .3, '#5a3a26').rotateZ(Math.PI / 2), cyl(.02, .02, .35, '#5a3a26', 0, -.18, 0)); gav.position.set(0, -.62, .15); j.userData.armR.add(gav); j.userData.armR.rotation.x = -1;
  const sw = grp(box(1.2, 1.6, .5, '#2b2f3a', 0, .8, 0)); const lever = grp(cyl(.05, .05, .9, '#c0c6d0', 0, .45, 0), sph(.12, '#d33', 0, .9, 0)); lever.position.set(0, 1.25, .27); sw.add(lever);
  const lab = sign('BLACKBERRY SERVICE\nUNITED STATES', { bg: '#14161c', fg: '#ffffff', size: 40 }); lab.scale.setScalar(.45); lab.position.set(0, .65, .26); sw.add(lab);
  const bulb = sph(.12, E('#ffcf3a', 2), 0, 1.75, 0); sw.add(bulb); sw.position.set(1.7, 0, .6); sw.rotation.y = -.4; g.add(sw);
  const ntp = person({ suit: '#4a4f5c', skin: SKINS[4], hair: '#3a2a1c' }); ntp.position.set(-1.6, 0, .6); ntp.rotation.y = .5; g.add(ntp);
  const nt = sign('NTP', { bg: '#ffffff', size: 70 }); nt.scale.setScalar(.45); nt.position.set(-1.6, 2.5, .6); g.add(nt);
  return { g, bg: ['#2a1c18', '#6a4a3a'], focus: V(0, 1, 0), cam: dolly(V(-.4, 2.4, 6.6), V(.7, 1.9, 4.6), V(0, 1.5, -1), V(.8, 1.3, 0)),
    upd: lt => { pop(nt, lt, 1.4); const k = ease((lt - 4.5) / 4); lever.rotation.x = -k * 1.0; bulb.material = Math.sin(lt * 6) > 0 || lt < 4.5 ? E('#ffcf3a', 2) : E('#ff3a3a', 2.5);
      j.userData.armR.rotation.x = -1 - Math.max(0, Math.sin(lt * 4)) * .5 * (lt > 3 && lt < 6 ? 1 : 0); } };
});
S('s_cash', () => {
  const g = stage('#d9cfd9', '#2f3f6a'); const c = cash(5, 3, 7); g.add(c); const B = c.userData.bricks;
  const tag = sign('$612 MILLION', { bg: '#ffd23f', size: 100, frame: '#7a5a00' }); tag.scale.setScalar(.6); tag.position.set(0, 2.2, 0); g.add(tag);
  return { g, bg: ['#26356a', '#e5bfcb'], cam: dolly(V(2.5, 2.4, 5), V(1.5, 2.2, 4.2), V(0, .6, 0), V(0, .8, 0)),
    upd: lt => { const n = Math.floor(ease(lt / 3) * B.length); B.forEach((b, i) => { b.visible = i < n; }); pop(tag, lt, 2.2); } };
});

// ===== OBAMA =====
S('s_rally', () => {
  const g = stage('#2b3466', '#16204a', { w: 30, d: 20 }); const st = box(5, .6, 2.6, '#1d2a5c', 0, .3, -1); g.add(st);
  const pod = grp(box(.8, 1.1, .5, '#24438a', 0, .55, 0), box(.9, .06, .6, '#c9a74b', 0, 1.12, 0)); pod.position.set(0, .6, -.4); g.add(pod);
  const p = person({ suit: '#1d2333', skin: SKINS[2], hair: '#1a1410', tie: '#2a4aa0' }); p.position.set(0, .6, -1.0); g.add(p);
  const ph = blackberry(); ph.scale.setScalar(.3); p.userData.armR.add(ph); ph.position.set(0, -.72, .05); ph.rotation.x = .2;
  const ban = sign('VOTE 2008', { bg: '#c4323a', fg: '#ffffff', size: 110 }); ban.scale.setScalar(.8); ban.position.set(0, 3.6, -3.9); g.add(ban);
  for (let i = -1; i <= 1; i += 2) { const f = flag(); f.position.set(i * 2.2, .6, -1.8); g.add(f); }
  const r = rng(9); for (let i = 0; i < 26; i++) { const c = person({ shirt: SHIRTS[i % 10], skin: SKINS[i % 5], hair: '#222' }); c.position.set((i % 9 - 4) * .75 + (r() - .5) * .3, 0, 1.4 + (i / 9 | 0) * .8); c.rotation.y = Math.PI + (r() - .5) * .3; c.userData.armR.rotation.x = -2.6 * (i % 3 == 0); c.userData.arm = i % 3 == 0; g.add(c); g.userData[i] = c; }
  return { g, bg: ['#0f1738', '#3a3466'], focus: V(0, 1, -1), cam: dolly(V(1.4, 4.6, 7.4), V(.9, 4.0, 5.0), V(0, 1.7, -1), V(0, 1.8, -1)),
    light: L => { L.key.position.set(2, 8, 6); }, upd: lt => { p.userData.armR.rotation.x = -2.6 + Math.sin(lt * 3) * .15; p.userData.armR.rotation.z = .2; for (let i = 0; i < 26; i++) { const c = g.userData[i]; if (c.userData.arm) c.userData.armR.rotation.x = -2.6 + Math.sin(lt * 6 + i) * .3; } } };
});
S('s_no', () => {
  const g = stage('#e8dcc8', '#f0e6d2'); oval(g);
  const pr = person({ suit: '#1d2333', skin: SKINS[2], hair: '#1a1410', tie: '#2a4aa0' }); pr.position.set(0, 0, -.6); holdPhone(pr, blackberry({ screen: screen(SCR.mail) })); g.add(pr);
  const A = [-1, 1].map(i => { const a = person({ suit: '#14161c', skin: SKINS[i < 0 ? 0 : 3], hair: '#222', glasses: true, tie: '#111' }); a.position.set(i * 1.1, 0, .6); a.rotation.y = i * -2.6; g.add(a); return a; });
  const no = label('NO.', { bg: '#d6322f', fg: '#fff', size: 120, radius: 30 }); no.scale.setScalar(.6); no.position.set(-1.1, 2.7, .7); g.add(no);
  const s1 = sign('HACKERS', { bg: '#14161c', fg: '#ff6b6b', size: 54 }), s2 = sign('PUBLIC RECORD', { bg: '#14161c', fg: '#ffd23f', size: 54 });
  [s1, s2].forEach((s, i) => { s.scale.setScalar(.42); s.position.set(i ? .9 : -.9, 3.4, -1.5); g.add(s); });
  return { g, bg: ['#f1e7d6', '#d9c7a8'], cam: dolly(V(0, 2.6, 6.6), V(0, 2.2, 5.6), V(0, 1.6, 0), V(0, 1.7, 0)),
    upd: lt => { A[0].userData.armR.rotation.x = -1.4 * ease((lt - .3) / .5); pop(no, lt, .7); pop(s1, lt, 2.6); pop(s2, lt, 4.2); } };
});
S('s_pry', () => {
  const g = stage('#e8dcc8', '#f0e6d2'); oval(g);
  const pr = person({ suit: '#1d2333', skin: SKINS[2], hair: '#1a1410', tie: '#2a4aa0' }); g.add(pr); const ph = blackberry({ screen: screen(SCR.home) });
  const { armL, armR, head } = pr.userData; armR.rotation.set(-1.5, 0, .9); armL.rotation.set(-1.5, 0, -.9); ph.scale.setScalar(.34); ph.position.set(0, 1.35, .32); pr.add(ph);
  return { g, bg: ['#f1e7d6', '#d9c7a8'], focus: V(0, 1.4, 0), cam: dolly(V(.6, 1.9, 3.2), V(.2, 1.85, 2.4), V(0, 1.65, 0), V(0, 1.7, 0)),
    upd: lt => { head.rotation.y = Math.sin(lt * 6) * .35 * clamp(lt / .5) * (lt < 3 ? 1 : 0); pr.rotation.y = Math.sin(lt * 1.5) * .1; } };
});
S('s_nsa', () => {
  const g = stage('#1b2236', '#0f1528'); const tb = rbox(2.2, .1, 1.2, .03, '#d9dde6', 0, .85, 0); g.add(tb, box(1.8, .8, 1, '#3a4256', 0, .4, 0));
  const ph = blackberry({ screen: screen(SCR.home) }); ph.scale.setScalar(.6); ph.rotation.x = -.4; ph.position.set(0, 1.25, 0); g.add(ph);
  const dome = mesh(new THREE.CylinderGeometry(.55, .55, 1.1, 32, 1, true), new THREE.MeshStandardMaterial({ color: '#9fd8ff', transparent: true, opacity: .18, roughness: .1, side: THREE.DoubleSide, depthWrite: false }), 0, 1.45, 0, false); g.add(dome);
  const ring = mesh(new THREE.TorusGeometry(.56, .02, 6, 40), E('#39ff9c', 3), 0, 1, 0, false); ring.rotation.x = Math.PI / 2; g.add(ring);
  const T = [-1.4, 1.4, 0].map((x, i) => { const p = person({ shirt: '#f4f6fa', suit: '#f4f6fa', tie: '#4a90d9', skin: SKINS[[1, 4, 3][i]], hair: '#2b1d14', glasses: i == 1 }); p.position.set(x, 0, i == 2 ? -1.2 : .2); p.rotation.y = i == 2 ? 0 : (x < 0 ? 1.2 : -1.2); p.userData.armR.rotation.x = -.9; g.add(p); return p; });
  for (let i = 0; i < 3; i++) { const t = canvasTex(256, 160, (c, w, h) => { c.fillStyle = '#071a12'; c.fillRect(0, 0, w, h); c.fillStyle = '#39ff9c'; for (let k = 0; k < 12; k++) c.fillRect(10, 10 + k * 12, 40 + ((k * 37 + i * 11) % 180), 5); });
    const m = grp(box(1.2, .8, .06, '#111'), new THREE.Mesh(new THREE.PlaneGeometry(1.1, .7), new THREE.MeshBasicMaterial({ map: t }))); m.children[1].position.z = .035; m.position.set((i - 1) * 1.4, 2.6, -3.85); g.add(m); }
  const sh = sign('ENCRYPTED', { bg: '#39ff9c', fg: '#06231a', size: 64 }); sh.scale.setScalar(.5); sh.position.set(0, 2.25, .3); g.add(sh);
  const nsa = sign('NATIONAL SECURITY AGENCY', { bg: '#0f1528', fg: '#9fb8e8', size: 40 }); nsa.scale.setScalar(.5); nsa.position.set(0, 3.55, -3.85); g.add(nsa);
  return { g, bg: ['#050a18', '#18233f'], focus: V(0, 1, 0), cam: dolly(V(1.6, 2.4, 4.8), V(.6, 1.9, 3.4), V(0, 1.4, 0), V(0, 1.5, 0)),
    light: L => { L.hemi.intensity = .5; L.key.intensity = 1.1; L.key.color.set('#bfe9ff'); }, upd: lt => { ring.position.y = 1 + (Math.sin(lt * 2.4) * .5 + .5) * .9; pop(sh, lt, 3.6); T.forEach((p, i) => p.userData.armR.rotation.x = -.9 + Math.sin(lt * 4 + i) * .15); } };
});
S('s_keep', () => {
  const g = stage('#e1d6c8', '#2f3c6e'); const scr = screen((c, w, h) => { c.fillStyle = '#0d1b33'; c.fillRect(0, 0, w, h); c.fillStyle = '#ffd23f'; c.font = FONT(24); c.fillText('APPROVED CONTACTS', 14, 32);
    ['Chief of Staff', 'Press Secretary', 'Senior Adviser', 'Family'].forEach((n, i) => { c.fillStyle = i % 2 ? '#13284a' : '#1a3560'; c.fillRect(0, 48 + i * 44, w, 42); c.fillStyle = '#fff'; c.font = FONT(22, 800); c.fillText(n, 20, 76 + i * 44); }); });
  const ph = blackberry({ screen: scr }); ph.scale.setScalar(2.1); ph.position.set(0, 1.9, 0); ph.rotation.x = -.1; g.add(ph);
  const lock = grp(rbox(.5, .42, .14, .05, '#ffd23f'), mesh(new THREE.TorusGeometry(.16, .045, 8, 20, Math.PI), '#d9b23a', 0, .21, 0)); lock.position.set(.75, 3.0, .35); g.add(lock);
  return { g, bg: ['#26336a', '#e1b6c3'], focus: V(0, 2, 0), cam: dolly(V(0, 2.5, 4.2), V(0, 2.45, 3.5), V(0, 2.3, 0), V(0, 2.35, 0)), upd: lt => { pop(lock, lt, 1.4); lock.rotation.y = Math.sin(lt * 2) * .2; } };
});
S('s_thumb', () => {
  const g = stage('#e8dcc8', '#f0e6d2'); oval(g); const d = desk(2.4, 1.1, '#6b3f26'); d.position.set(0, 0, -1.3); g.add(d); const ch = chair('#3a2a22'); ch.scale.setScalar(1.3); ch.position.set(0, 0, -1.9); g.add(ch);
  const pr = person({ suit: '#1d2333', skin: SKINS[2], hair: '#1a1410', tie: '#2a4aa0' }); pr.position.set(0, -.15, -2.0); pr.userData.legL.rotation.x = -1.4; pr.userData.legR.rotation.x = -1.4; pr.position.y = -.15; g.add(pr);
  pr.userData.legL.position.y = .82; const ph = holdPhone(pr, blackberry({ screen: screen(SCR.bbm) }));
  return { g, bg: ['#f1e7d6', '#d9c7a8'], cam: dolly(V(0, 2.2, 3.4), V(.3, 2.0, 2.5), V(0, 1.4, -1.6), V(0, 1.45, -1.8)),
    upd: lt => { pr.userData.armR.rotation.x = -1.25 + Math.sin(lt * 18) * .03; pr.userData.armL.rotation.x = -1.1 + Math.cos(lt * 17) * .04; } };
});

// ===== BBM =====
export function bbmLogo() { const t = canvasTex(256, 256, (c, w, h) => { c.fillStyle = '#16181d'; rrect(c, 0, 0, w, h, 50); c.fill(); c.fillStyle = '#fff';
  rrect(c, 40, 60, 120, 76, 26); c.fill(); rrect(c, 96, 120, 120, 76, 26); c.fill(); c.fillStyle = '#16181d'; c.font = FONT(56); c.textAlign = 'center'; c.fillText('b', 100, 116); c.fillText('m', 156, 176); });
  const m = rbox(1.4, 1.4, .3, .2, '#16181d'); const f = new THREE.Mesh(new THREE.PlaneGeometry(1.36, 1.36), new THREE.MeshBasicMaterial({ map: t })); f.position.z = .155; return grp(m, f); }
S('s_bbm', () => {
  const g = stage('#cfc6e0', '#2a3366'); const lg = bbmLogo(); lg.position.set(0, 2.9, 0); g.add(lg);
  const a = blackberry({ screen: screen(SCR.bbm) }), b = blackberry({ screen: screen(SCR.bbm) }); a.position.set(-1.1, 1.3, .3); b.position.set(1.1, 1.3, .3); a.rotation.y = .4; b.rotation.y = -.4; g.add(a, b);
  const B = []; for (let i = 0; i < 5; i++) { const bb = bubble(['hey!', 'u there?', 'yes!!', 'lol', 'ping!'][i], i % 2 ? '#3f8cff' : '#ffffff', i % 2 ? '#fff' : '#1d2433', .7); g.add(bb); B.push(bb); }
  const free = sign('FREE · INSTANT', { bg: '#ffd23f', size: 60 }); free.scale.setScalar(.45); free.position.set(0, .35, 1.2); g.add(free);
  return { g, bg: ['#232c66', '#dcb3c9'], focus: V(0, 1.5, 0), cam: dolly(V(0, 2.4, 6.2), V(0, 2.1, 5.2), V(0, 2.2, 0), V(0, 1.8, 0)),
    upd: lt => { pop(lg, lt, .1, .6); lg.rotation.y = Math.sin(lt * 1.3) * .4; pop(a, lt, 3); pop(b, lt, 3.2); pop(free, lt, 4.4);
      B.forEach((bb, i) => { const k = clamp((lt - 4.8 - i * .7) / .7); bb.visible = k > 0 && k < 1; const dir = i % 2 ? -1 : 1; bb.position.set(lerp(-1.1 * dir, 1.1 * dir, eio(k)), 1.9 + Math.sin(k * Math.PI) * .7, .5); }); } };
});
S('s_pin', () => {
  const g = stage('#d6cde0', '#2a3366'); const PIN = '2A7F9C4B';
  const scr = canvasTex(320, 240, (c, w, h, n = 0) => { c.fillStyle = '#e9edf3'; c.fillRect(0, 0, w, h); c.fillStyle = '#26303f'; c.fillRect(0, 0, w, 44); c.fillStyle = '#fff'; c.font = FONT(24); c.fillText('Add Contact', 14, 31);
    c.fillStyle = '#9aa3b2'; c.font = FONT(20, 800); c.fillText('Phone number:', 14, 78); c.strokeStyle = '#c0392b'; c.lineWidth = 4; c.beginPath(); c.moveTo(14, 70); c.lineTo(180, 70); c.stroke();
    c.fillStyle = '#1d2433'; c.font = FONT(24); c.fillText('PIN:', 14, 128); c.fillStyle = '#fff'; c.fillRect(14, 140, 292, 56); c.strokeStyle = '#3f8cff'; c.strokeRect(14, 140, 292, 56);
    c.fillStyle = '#1d2433'; c.font = FONT(40); c.fillText(PIN.slice(0, n) + (n < 8 ? '|' : ''), 26, 183); });
  const ph = blackberry({ screen: scr }); ph.scale.setScalar(2.3); ph.position.set(0, 1.9, 0); g.add(ph);
  return { g, bg: ['#232c66', '#dcb3c9'], focus: V(0, 2, 0), cam: dolly(V(-.5, 2.8, 3.6), V(0, 2.55, 3.0), V(0, 2.4, 0), V(0, 2.45, 0)),
    upd: lt => { const n = clamp(Math.floor((lt - 1.4) / .22), 0, 8); if (scr.n !== n) { scr.n = n; scr.redraw(n); } } };
});
S('s_dr', () => {
  const g = stage('#d6cde0', '#2a3366');
  const scr = canvasTex(320, 240, (c, w, h, st = 'D') => { c.fillStyle = '#e9edf3'; c.fillRect(0, 0, w, h); c.fillStyle = '#26303f'; c.fillRect(0, 0, w, 44); c.fillStyle = '#fff'; c.font = FONT(24); c.fillText('Alex', 14, 31);
    c.fillStyle = '#3f8cff'; rrect(c, 70, 70, 236, 60, 16); c.fill(); c.fillStyle = '#fff'; c.font = FONT(24, 800); c.fillText('so... are we ok?', 86, 108);
    c.fillStyle = st == 'D' ? '#3f8cff' : '#2ecc71'; rrect(c, 250, 146, 56, 56, 14); c.fill(); c.fillStyle = '#fff'; c.font = FONT(44); c.fillText(st, 264, 190); });
  const ph = blackberry({ screen: scr }); ph.scale.setScalar(1.6); ph.position.set(-.3, 1.6, .4); ph.rotation.y = .2; g.add(ph);
  const p = person({ shirt: '#8e6bd1', skin: SKINS[3], hair: '#111', long: true }); p.position.set(1.4, 0, -.6); p.rotation.y = -.6; holdPhone(p, blackberry({ screen: screen(SCR.bbm) })); g.add(p);
  const clk = grp(cyl(.45, .45, .08, '#ffffff', 0, 0, 0, 32).rotateX(Math.PI / 2)); const hand = box(.04, .34, .03, '#222', 0, .15, .06); const hp = grp(hand); clk.add(hp); clk.position.set(1.5, 3.1, -3.9); g.add(clk);
  return { g, bg: ['#232c66', '#dcb3c9'], focus: V(.5, 1.4, 0), cam: dolly(V(-.2, 2.1, 3.4), V(.6, 2.2, 5.2), V(-.2, 1.9, 0), V(.5, 1.9, -.5)),
    upd: lt => { const st = lt > 2.0 ? 'R' : 'D'; if (scr.st !== st) { scr.st = st; scr.redraw(st); } hp.rotation.z = -lt * 2.5; p.userData.head.rotation.x = .38 + Math.sin(lt * 2) * .04; } };
});
function bunting(g, z, y = 3.2, w = 8) { const C = SHIRTS; for (let i = 0; i < 16; i++) { const f = mesh(new THREE.ConeGeometry(.16, .32, 3), M(C[i % 10]), -w / 2 + i * w / 15, y - .18 - Math.sin(i / 15 * Math.PI) * .3, z); f.rotation.x = Math.PI; f.rotation.y = Math.PI / 6; g.add(f); } }
S('s_teens', () => {
  const g = stage('#c7bfae', null, { w: 30, d: 30 }); g.add(box(3, .02, 30, '#8e8778', 0, .01, 0));
  for (let i = 0; i < 6; i++) { const s = i % 2 ? 1 : -1; g.add(box(2.2, 2.6 + (i % 3) * .5, 2, ['#e8a87c', '#85c1e9', '#f7dc6f', '#bb8fce', '#82e0aa', '#f1948a'][i], s * 2.8, 1.3 + (i % 3) * .25, -2 + (i / 2 | 0) * -2.4)); }
  bunting(g, -1.2); bunting(g, -3.8, 3.6);
  const P = []; for (let i = 0; i < 6; i++) { const p = person({ shirt: SHIRTS[(i * 3) % 10], skin: SKINS[(i + 2) % 5], hair: ['#111', '#2b1d14', '#c79a54'][i % 3], long: i % 2 == 0, cap: i == 3 ? '#e8505b' : null }); p.scale.setScalar(.88); p.position.set((i % 3 - 1) * .9, 0, i < 3 ? .6 : -.7); p.rotation.y = (i % 3 - 1) * -.5; holdPhone(p, blackberry({ screen: screen(SCR.bbm) })); g.add(p); P.push(p); }
  const C = ['LONDON', 'LAGOS', 'MEXICO CITY'].map((n, i) => { const s = sign(n, { bg: ['#c4323a', '#2e8b57', '#1f6fb2'][i], fg: '#fff', size: 64 }); s.scale.setScalar(.5); s.position.set((i - 1) * 1.15, 2.6 + (i % 2) * .4, .8); g.add(s); return s; });
  return { g, bg: ['#5a7fc2', '#f2c6a8'], cam: dolly(V(0, 2.2, 6.4), V(0, 2.0, 5.4), V(0, 1.6, 0), V(0, 1.6, 0)),
    upd: lt => { C.forEach((s, i) => pop(s, lt, .8 + i * .7)); P.forEach((p, i) => p.position.y = Math.abs(Math.sin(lt * 4 + i)) * .03); } };
});
S('s_tower', () => {
  const g = stage('#1e2650', '#151c3f', { w: 30 }); const F = []; for (let i = 0; i < 14; i++) { const f = grp(box(1.6, .32, 1.6, i % 2 ? '#2fae6a' : '#38c47a', 0, .16, 0)); for (let k = 0; k < 4; k++) f.add(box(.28, .16, .02, E('#d9fff0', .6), -.54 + k * .36, .16, .81)); f.position.y = i * .34; g.add(f); F.push(f); }
  const ph = blackberry(); ph.scale.setScalar(1.1); g.add(ph);
  const tag = sign('$80+ BILLION', { bg: '#ffd23f', size: 96 }), d = sign('JUNE 2008', { bg: '#ffffff', size: 60 }); tag.scale.setScalar(.6); d.scale.setScalar(.45); g.add(tag, d);
  return { g, bg: ['#0c1330', '#3a2a5e'], focus: V(0, 2.5, 0), cam: u => { const k = eio(u); return { p: V(2.4, lerp(1.6, 5.4, k), 7.6), l: V(0, lerp(1.4, 4.6, k), 0), fov: 40 }; },
    upd: lt => { const n = ease(lt / 2.6) * 14; F.forEach((f, i) => { f.visible = i < n; f.scale.y = clamp(n - i); }); ph.position.y = n * .34 + .6; ph.rotation.y = lt; tag.position.set(0, n * .34 + 1.7, 0); pop(tag, lt, 2.4); d.position.set(0, -0.0 + 1.0, .95); pop(d, lt, .2); } };
});
S('s_share', () => {
  const g = stage('#d9cfe0', '#2a3366'); g.add(box(7, .5, 1.2, '#3a4270', 0, .25, 0)); const P = [];
  for (let i = 0; i < 10; i++) { const isB = i % 10 < 4; const p = isB ? blackberry() : touchPhone({ screen: screen((c, w, h) => { c.fillStyle = '#3a3f52'; c.fillRect(0, 0, w, h); }, 32, 64) }); p.scale.setScalar(.55); p.position.set((i - 4.5) * .62, .82, 0); g.add(p); P.push([p, isB]); }
  const tag = sign('4 IN 10', { bg: '#ffd23f', size: 120 }), sub = sign('U.S. SMARTPHONES · 2010', { bg: '#ffffff', size: 50 }); tag.scale.setScalar(.6); tag.position.set(0, 2.3, 0); sub.scale.setScalar(.5); sub.position.set(0, 1.65, .1); g.add(tag, sub);
  return { g, bg: ['#232c66', '#dcb3c9'], focus: V(0, 1, 0), cam: dolly(V(0, 1.9, 7.2), V(0, 1.7, 6.4), V(0, 1.3, 0), V(0, 1.3, 0)),
    upd: lt => { P.forEach(([p, b], i) => { pop(p, lt, i * .1); if (b) p.position.y = .82 + ease((lt - 1.4) / .4) * .15; }); pop(tag, lt, 1.6); pop(sub, lt, 2); } };
});
export function crown(c = '#ffcf3a') { const g = grp(cyl(.32, .32, .2, c, 0, .1, 0, 10)); for (let i = 0; i < 5; i++) { const a = i / 5 * Math.PI * 2; g.add(mesh(new THREE.ConeGeometry(.08, .22, 4), c, Math.cos(a) * .28, .3, Math.sin(a) * .28), sph(.04, '#e8505b', Math.cos(a) * .32, .12, Math.sin(a) * .32, 6)); } return g; }
S('s_king', () => {
  const g = stage('#5a2030', '#3a1a2a'); g.add(box(1.6, .02, 8, '#c4323a', 0, .01, 1));
  const th = grp(box(1.8, .6, 1.4, '#d9a52f', 0, .3, 0), box(1.6, 2.6, .3, '#d9a52f', 0, 1.6, -.6), box(.25, .6, 1.2, '#c4922a', -.8, .9, 0), box(.25, .6, 1.2, '#c4922a', .8, .9, 0), box(1.3, .14, 1.1, '#8a1c2b', 0, .64, .05)); th.position.z = -1; g.add(th);
  const ph = blackberry(); ph.scale.setScalar(1.4); ph.position.set(0, 1.5, -.85); ph.rotation.x = -.15; g.add(ph); const cr = crown(); cr.scale.setScalar(1.3); cr.position.set(0, 2.32, -.85); g.add(cr);
  const s = sign('KING OF THE KEYBOARD', { bg: '#ffd23f', fg: '#3a1a00', size: 70 }); s.scale.setScalar(.5); s.position.set(0, .55, .9); s.rotation.x = -.5; g.add(s);
  return { g, bg: ['#2a0f1c', '#7a3a4a'], focus: V(0, 1, -1), cam: dolly(V(0, 1.9, 5.2), V(0, 1.8, 4.4), V(0, 1.4, -.8), V(0, 1.5, -.8)), upd: lt => { pop(cr, lt, .3); pop(s, lt, .6); cr.rotation.y = lt; } };
});
