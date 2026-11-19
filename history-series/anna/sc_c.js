// Scenes: the trap, the truth, the trial, the strange ending
import { THREE, M, E, mesh, box, rbox, cyl, sph, grp, V, clamp, ease, eio, backOut, lerp, pop, dolly, canvasTex, FONT, rrect, label, sign, walk, bubble, rng, floor, wall, snowfall } from './kit.js';
import { human, CAST, SKINS2, HAIRS, blink, talk, idle } from './human.js';
import { stage, room, windowPane, building, skyline, jet, stairs, car, siren, palm, pool, paper, laptop, monitor, card, terminal, note, stack, flyingNotes, counter, door, plant, lampStand, bars, sofa, bed, table, glass, frame, abstractArt, phoneChat } from './props.js';
import { tag, big, guest } from './sc_a.js';
export const SC = []; const S = (id, build) => SC.push({ id, build });
const GOLD = '#ffd23f';
const frown = (p, k = 1) => { const [l, r] = p.userData.brows; l.rotation.z = .1 + .35 * k; r.rotation.z = -.1 - .35 * k; };
const sit = p => { const { legL, legR } = p.userData; legL.rotation.x = legR.rotation.x = -1.5; p.position.y -= .32; };
const cop = (i) => human({ suit: '#1b2a55', tie: '#1b2a55', shirt: '#1b2a55', skin: SKINS2[i % 5], hair: HAIRS.dark, hairStyle: 'short', cap: '#14203f', badge: GOLD, seed: 80 + i });
function phoneBig(lines, title) {
  const t = canvasTex(360, 640, phoneChat(lines, { title })); const g = grp(rbox(1.0, 1.8, .08, .1, '#15161a', 0, 0, 0));
  const s = new THREE.Mesh(new THREE.PlaneGeometry(.9, 1.6), new THREE.MeshBasicMaterial({ map: t, toneMapped: false })); s.position.z = .045; g.add(s); g.userData.tex = t; return g;
}
function clinic() {
  const g = stage('#e6d2b0', null, { w: 34, d: 24 }); g.add(box(30, .02, 3.2, '#4a4a50', 0, .01, 2.8));
  const b = grp(box(7, 3.2, 3, '#f4efe6', 0, 1.6, -2.5), box(7.4, .2, 3.4, '#d9cfc0', 0, 3.3, -2.5)); for (let i = 0; i < 5; i++) { const w = windowPane(.9, 1.1, '#9fd0e8', '#e8e2d8', .2); w.position.set(-2.8 + i * 1.4, 2.2, -.96); b.add(w); }
  const d = door('#6a8a9a', 1.4, 2.2); d.position.set(0, 0, -.98); b.add(d); g.add(b);
  for (const [x, z] of [[-4.6, -.6], [4.6, -.4], [-6.4, 1], [6, 1.2]]) { const p = palm(3.6, x * 7); p.position.set(x, 0, z); g.add(p); }
  return g;
}

// ===== THE TRAP =====
S('h_wait', () => {
  const g = room('#c9bba8', '#3d4a63', { w: 10, h: 5, side: false }); const r = CAST.rachel(); r.position.set(-.6, 0, .2); r.rotation.y = .3; g.add(r);
  const ph = phoneBig([[1, 'Any news on the money?'], [0, 'Transfer delayed!'], [1, 'It has been weeks...'], [0, 'Trust fund issue, sorry!']], 'Anna'); ph.position.set(.55, 1.75, .5); ph.rotation.y = -.25; ph.scale.setScalar(.8); g.add(ph);
  return { g, bg: ['#1c2433', '#7a8aa8'], focus: V(0, 1.5, 0), cam: dolly(V(0, 2.0, 4.0), V(0, 1.95, 3.4), V(0, 1.7, 0), V(0, 1.75, 0)),
    upd: lt => { idle(r, lt); frown(r, clamp(lt / 6) * .8); const n = Math.min(4, Math.floor(lt / 1.6) + 1); if (ph.userData.tex.n !== n) { ph.userData.tex.n = n; ph.userData.tex.redraw(n); } } };
});
S('h_five', () => {
  const g = stage('#3a3546', '#1d1a26'); const r = CAST.rachel(); r.position.set(-.95, 0, .3); r.rotation.y = .5; g.add(r);
  const owed = mesh(new THREE.BoxGeometry(.5, 2.2, .5).translate(0, 1.1, 0), '#e8505b', .1, 0, 0), back = mesh(new THREE.BoxGeometry(.5, .18, .5).translate(0, .09, 0), '#7ed321', .8, 0, 0); g.add(owed, back);
  const l1 = big('$62,000', '#ff8a96', .26); l1.position.set(.1, 2.5, .4); g.add(l1); const l2 = big('$5,000', '#a8f07a', .26); l2.position.set(.8, .55, .4); g.add(l2);
  return { g, bg: ['#141220', '#4a3f5e'], focus: V(0, 1.5, 0), cam: dolly(V(0, 2.3, 5.4), V(0, 2.2, 4.8), V(0, 1.7, 0), V(0, 1.7, 0)),
    upd: lt => { idle(r, lt); frown(r, .9); owed.scale.y = Math.max(.01, ease(lt / .8)); back.scale.y = Math.max(.01, ease((lt - 1.4) / .6)); pop(l1, lt, .7); pop(l2, lt, 1.9); } };
});
S('h_crack', () => {
  const g = stage('#8a8f99', '#2a2f40'); const h = building(6, 6, 1, '#d8cbb5', { seed: 2, lit: .7, win: '#5a6b8a' }); h.position.set(0, 0, -3.6); g.add(h);
  const dr = door('#3a2418', 1.6, 2.6); dr.position.set(0, 0, -3.05); g.add(dr); g.add(box(3, .1, 1.4, '#7a1c2b', 0, 2.9, -2.4));
  const dm = human({ suit: '#7a1c2b', tie: '#c9a54b', skin: SKINS2[4], hair: HAIRS.black, hairStyle: 'short', cap: '#7a1c2b', seed: 12 }); dm.position.set(-.3, 0, -2.2); g.add(dm);
  const a = CAST.anna(); g.add(a); const cs = rbox(.45, .6, .22, .05, '#7b4a2c', 0, 0, 0); g.add(cs);
  const t = tag('CHECKED OUT', '#e8505b', '#fff', .36); t.position.set(0, 2.5, -1.4); g.add(t);
  return { g, bg: ['#26304a', '#a7b4cf'], focus: V(0, 1, -1), cam: dolly(V(.6, 2.2, 4.4), V(.3, 2.1, 3.8), V(0, 1.4, -1.2), V(0, 1.45, -1.2)),
    upd: lt => { idle(dm, lt); frown(dm, 1); dm.userData.armR.rotation.x = -1.4; const k = ease(clamp((lt - .3) / 1.5)); a.position.set(lerp(.1, .9, k), 0, lerp(-2.0, -.4, k)); a.rotation.y = .4; frown(a, .6); if (k > 0 && k < 1) walk(a, lt, 7, .35); else idle(a, lt);
      const c2 = ease(clamp((lt - .2) / .9)); cs.position.set(lerp(-.1, 1.5, c2), .3 + Math.sin(c2 * Math.PI) * .6, lerp(-1.9, .2, c2)); cs.rotation.z = c2 * 2; pop(t, lt, 1.3); } };
});
S('h_police', () => {
  const g = stage('#4a4f5c', '#2a2f40'); const b = building(5, 4, 1, '#c9ccd4', { seed: 6, win: '#5a6b8a' }); b.position.set(0, 0, -3.5); g.add(b);
  const s = sign('PRIVATE JET CO.', { bg: '#1d2433', fg: '#fff', size: 60 }); s.scale.setScalar(.45); s.position.set(0, 3.3, -2.9); g.add(s);
  const c = car('#f4f4f6', { police: true }); c.position.set(0, 0, -.4); c.rotation.y = .35; g.add(c);
  const o = cop(1); o.position.set(-1.4, 0, -.2); o.rotation.y = .4; g.add(o);
  return { g, bg: ['#11141f', '#3b3550'], focus: V(0, 1, 0), cam: dolly(V(.4, 2.2, 5.6), V(.2, 2.1, 4.8), V(0, 1.2, -.6), V(0, 1.3, -.6)),
    light: L => { L.hemi.intensity = .8; }, upd: lt => { siren(c, lt); idle(o, lt); pop(s, lt, .1); } };
});
S('h_malibu', () => {
  const g = clinic(); const t = tag('MALIBU · REHAB CLINIC', '#ffffff', '#1d2433', .42); t.position.set(0, 3.3, -.6); g.add(t);
  const ph = phoneBig([[0, "I'm in Malibu now."], [0, 'Staying at a clinic.'], [1, 'Lunch soon?']], 'Anna'); ph.position.set(.5, 1.6, 2.6); ph.rotation.y = -.2; ph.scale.setScalar(.8); g.add(ph);
  return { g, bg: ['#f2865a', '#ffd9a8'], focus: V(0, 1, -1), cam: dolly(V(-.8, 2.4, 7.2), V(-.2, 2.3, 6.2), V(0, 1.8, -.6), V(.2, 1.8, -.4)),
    light: L => { L.key.color.set('#ffc59e'); }, upd: lt => { pop(t, lt, .3); pop(ph, lt, 1.6); const n = Math.min(3, Math.max(1, Math.floor((lt - 1.6) / 1.2) + 1)); if (ph.userData.tex.n !== n) { ph.userData.tex.n = n; ph.userData.tex.redraw(n); } } };
});
S('h_trap', () => {
  const g = room('#c9bba8', '#2f3a4a', { w: 10, h: 5, side: false }); const t = table(.7); g.add(t);
  const r = CAST.rachel(); r.position.set(-.9, 0, .1); r.rotation.y = .9; g.add(r);
  const d = human({ coat: '#5a4a3a', top: '#5a4a3a', bottom: '#2d3446', skin: SKINS2[2], hair: HAIRS.dark, hairStyle: 'short', stache: true, badge: GOLD, seed: 90 }); d.position.set(.9, 0, .1); d.rotation.y = -.9; g.add(d);
  const mp = paper({ head: 'PLAN', title: 'LUNCH · OCT 3', big: 'LA', bigSize: 80 }); mp.rotation.x = -Math.PI / 2; mp.scale.setScalar(.6); mp.position.set(0, .81, 0); g.add(mp);
  const tg = tag('THE TRAP', GOLD, '#1d2433', .36); tg.position.set(0, 2.45, 0); g.add(tg);
  return { g, bg: ['#1c2433', '#7a8aa8'], focus: V(0, 1, 0), cam: dolly(V(0, 2.6, 4.4), V(0, 2.5, 3.8), V(0, 1.3, 0), V(0, 1.35, 0)),
    upd: lt => { idle(r, lt); idle(d, lt); talk(d, lt, lt < 2.2); d.userData.armR.rotation.x = -.9; pop(tg, lt, .8); } };
});
S('h_arrest', () => {
  const g = clinic(); const a = CAST.anna({ smile: true, glasses: '#111', shades: true }); g.add(a);
  const c = car('#f4f4f6', { police: true }); g.add(c); const o1 = cop(2), o2 = cop(3); g.add(o1, o2);
  const dt = tag('OCTOBER 3, 2017', '#ffffff', '#1d2433', .45); dt.position.set(0, 3.3, -.6); g.add(dt);
  const ar = tag('ARRESTED', '#e8505b', '#fff', .4); ar.position.set(0, 3.2, .4); g.add(ar);
  return { g, bg: ['#f2865a', '#ffd9a8'], focus: V(0, 1, 0), cam: dolly(V(2.4, 2.4, 7.2), V(1.4, 2.2, 5.8), V(0, 1.4, -.2), V(0, 1.5, 0)),
    light: L => { L.key.color.set('#ffc59e'); },
    upd: lt => { pop(dt, lt, .2); const k = ease(clamp(lt / 3)); a.position.set(0, 0, lerp(-.8, .9, k)); if (k < 1) walk(a, lt, 6, .35); else idle(a, lt);
      const ck = ease(clamp((lt - 2.2) / 1.8)); c.position.set(lerp(9, 2.4, ck), 0, 2.6); siren(c, lt);
      const ok = ease(clamp((lt - 4.2) / 1.6)); o1.position.set(lerp(2.2, .9, ok), 0, lerp(2.4, 1.3, ok)); o2.position.set(lerp(2.6, -.8, ok), 0, lerp(3.0, 1.6, ok)); o1.lookAt(a.position); o2.lookAt(a.position); o1.visible = o2.visible = lt > 4.1; if (ok > 0 && ok < 1) { walk(o1, lt, 7, .4); walk(o2, lt + 1, 7, .4); } else { idle(o1, lt); idle(o2, lt); }
      if (lt > 4.5) { a.rotation.y = lerp(0, .8, ease((lt - 4.5) / .5)); } if (lt > 6.4) { a.userData.armL.rotation.x = a.userData.armR.rotation.x = -.3; a.userData.armL.rotation.z = .3; a.userData.armR.rotation.z = -.3; o1.userData.armL.rotation.x = -1; }
      pop(ar, lt, 6.6); } };
});

// ===== THE TRUTH =====
S('i_truth', () => {
  const g = stage('#2a2433', '#1a1622');
  const tex = canvasTex(500, 640, (c, w, h) => { c.fillStyle = '#f2ecdf'; c.fillRect(0, 0, w, h); c.fillStyle = '#1d1d1d'; c.font = FONT(44); c.textAlign = 'center'; c.fillText('THE DAILY NEWS', w / 2, 60); c.fillRect(20, 76, w - 40, 4); c.font = FONT(64); c.fillText('THE FAKE', w / 2, 170); c.fillText('HEIRESS', w / 2, 240);
    c.fillStyle = '#9a948a'; c.fillRect(30, 280, 200, 160); c.fillStyle = '#c8c2b6'; for (let i = 0; i < 12; i++) c.fillRect(250, 290 + i * 26, 210, 10); for (let i = 0; i < 6; i++) c.fillRect(30, 470 + i * 26, 430, 10); });
  const np = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 2.05), new THREE.MeshStandardMaterial({ map: tex, roughness: .9, side: THREE.DoubleSide })); np.position.set(0, 1.8, 0); g.add(np);
  return { g, bg: ['#120e18', '#3e3350'], focus: V(0, 1.8, 0), cam: dolly(V(0, 1.9, 3.8), V(0, 1.85, 3.2), V(0, 1.75, 0), V(0, 1.75, 0)),
    upd: lt => { const k = ease(clamp(lt / 1.2)); np.rotation.z = (1 - k) * 8; np.scale.setScalar(Math.max(.01, k)); } };
});
S('i_sorokin', () => {
  const g = stage('#3a3546', '#1d1a26'); const a = CAST.anna({ glasses: false }); a.position.set(0, 0, .3); g.add(a);
  const d = tag('ANNA DELVEY', '#ffffff', '#5a5f6c', .3); d.position.set(0, 2.75, .4); g.add(d); const x = box(1.0, .03, .03, '#e8303f', 0, 2.75, .5); g.add(x);
  const s = tag('ANNA SOROKIN', GOLD, '#1d2433', .4); s.position.set(0, 2.35, .5); g.add(s);
  return { g, bg: ['#141220', '#4a3f5e'], focus: V(0, 1.6, 0), cam: dolly(V(0, 2.1, 3.6), V(0, 2.1, 3.1), V(0, 1.95, 0), V(0, 2.0, 0)),
    upd: lt => { idle(a, lt); pop(d, lt, 0); x.scale.x = Math.max(.01, ease((lt - .4) / .4)); pop(s, lt, .9); } };
});
S('i_moscow', () => {
  const g = stage('#e8edf2', null, { w: 40, d: 30 }); for (let i = 0; i < 5; i++) { const b = building(3, 4.5 + (i % 2) * 1.5, 1.6, ['#b9b4aa', '#a8a39a', '#c4bfb4'][i % 3], { seed: i + 20, wx: .5, lit: .4, roof: '#e8edf2' }); b.position.set(-6 + i * 3.1, 0, -3); g.add(b); }
  const tr = grp(rbox(1, 1.1, 1.3, .1, '#3a6b8a', 0, .8, 0), box(2.6, 1.4, 1.3, '#d9d4c8', -1.9, .95, 0)); for (const x of [-2.6, -1.2, .1]) for (const z of [-.6, .6]) { const w = cyl(.28, .28, .2, '#16171b', x, .3, z); w.rotation.x = Math.PI / 2; tr.add(w); }
  tr.position.set(.8, 0, .6); g.add(tr); const sn = snowfall(160, 14, 8, 8, 4); g.add(sn);
  const t = tag('NEAR MOSCOW · 1991', '#ffffff', '#1d2433', .5); t.position.set(0, 2.9, 0); g.add(t);
  const t2 = tag('DAD: TRUCK DRIVER', GOLD, '#1d2433', .42); t2.position.set(.2, 2.25, .8); g.add(t2);
  return { g, bg: ['#8a9ab0', '#e8edf2'], focus: V(0, 1, 0), cam: dolly(V(-.6, 2.2, 7.6), V(0, 2.1, 6.6), V(0, 1.6, -.5), V(0, 1.7, -.5)),
    upd: (lt) => { sn.userData.tick(lt); pop(t, lt, .2); pop(t2, lt, 2.2); tr.position.x = .8 - Math.max(0, lt - 2.4) * .3; } };
});
S('i_germany', () => {
  const g = stage('#9ac07a', null, { w: 30, d: 24 }); const h = grp(box(4, 2.6, 3, '#f2ede2', 0, 1.3, 0), mesh(new THREE.ConeGeometry(3, 1.4, 4), '#9a4a3a', 0, 3.3, 0)); h.children[1].rotation.y = Math.PI / 4; h.children[1].scale.set(1, 1, .8);
  const d = door('#5a3a28', .9, 1.8); d.position.set(0, 0, 1.51); h.add(d); h.position.set(0, 0, -3); g.add(h);
  const fl = grp(cyl(.03, .03, 3, '#ccc', 0, 1.5, 0, 8), box(1, .2, .02, '#1b1b1b', .5, 2.85, 0), box(1, .2, .02, '#c8202f', .5, 2.65, 0), box(1, .2, .02, '#f2c418', .5, 2.45, 0)); fl.position.set(-2.8, 0, -1.2); g.add(fl);
  const P = [human({ skin: SKINS2[0], hair: HAIRS.brown, hairStyle: 'short', top: '#5a6b8a', seed: 101 }), human({ female: true, skin: SKINS2[0], hair: HAIRS.blonde, hairStyle: 'bob', dress: '#8e2c48', seed: 102 }), CAST.anna({ glasses: false, dress: null, top: '#d96a4c', bottom: '#2d3446', heels: false })];
  P[2].scale.setScalar(.85); P.forEach((p, i) => { p.position.set(-1 + i * 1, 0, .4); g.add(p); });
  const t = tag('MOVING TO GERMANY', '#ffffff', '#1d2433', .34); t.position.set(0, 3.0, .4); g.add(t);
  return { g, bg: ['#7fb3e0', '#e8f2fb'], focus: V(0, 1, 0), cam: dolly(V(0, 2.3, 6.4), V(0, 2.2, 5.6), V(0, 1.6, -.5), V(0, 1.7, -.5)), upd: lt => { P.forEach((p, i) => idle(p, lt + i)); pop(t, lt, .2); } };
});
S('i_paths', () => {
  const g = stage('#cfc3d6', '#2a2f55'); const a = CAST.anna({ glasses: false }); g.add(a);
  const mk = (t, sub, x, c) => { const s = grp(cyl(.04, .04, 2.2, '#555', 0, 1.1, 0, 8)); const b = tag(t, c, '#fff', .42); b.position.set(0, 2.25, .05); s.add(b); const sb = tag(sub, '#ffffff', '#1d2433', .26); sb.position.set(0, 1.85, .05); s.add(sb); s.position.set(x, 0, -.6); g.add(s); return s; };
  const s1 = mk('LONDON', 'ART SCHOOL · LEFT', -.85, '#1d3b6e'), s2 = mk('PARIS', 'MAGAZINE INTERN', .85, '#b3162e');
  const nm = tag('SOROKIN → DELVEY', GOLD, '#1d2433', .36); nm.position.set(0, 3.2, 0); g.add(nm);
  return { g, bg: ['#1d2244', '#8f84b8'], focus: V(0, 1, 0), cam: dolly(V(0, 2.3, 5.0), V(0, 2.3, 4.6), V(0, 1.7, 0), V(0, 1.8, 0)),
    upd: lt => { pop(s1, lt, .3); pop(s2, lt, 2.4); const x = lt < 2 ? lerp(-2.0, -.9, ease(lt / 1.6)) : lerp(-.9, .8, ease((lt - 2.2) / 2.2)); a.position.set(x, 0, .3); const mv = (lt < 1.6) || (lt > 2.2 && lt < 4.4); a.rotation.y = mv ? Math.PI / 2 : 0; if (mv) walk(a, lt, 7, .4); else idle(a, lt); pop(nm, lt, 5.4); } };
});
S('i_act', () => {
  const g = room('#d9c6b8', '#6a4a5a', { w: 8, h: 4.5, side: false }); const mr = grp(rbox(1.5, 2.2, .1, .08, '#c9a54b', 0, 0, 0), mesh(new THREE.PlaneGeometry(1.3, 2.0), M('#cfe0ea', { roughness: .05, metalness: .6 }), 0, 0, .06)); mr.position.set(0, 1.9, -2.9); g.add(mr);
  const a = CAST.anna({ glasses: false }); a.position.set(-.55, 0, -.6); a.rotation.y = Math.PI + .3; g.add(a); const b = CAST.anna({ glasses: false, smile: true }); b.position.set(0, .3, -2.75); b.scale.setScalar(.75); g.add(b);
  const sh = grp(rbox(.2, .12, .03, .04, '#111', -.088, 0, 0), rbox(.2, .12, .03, .04, '#111', .088, 0, 0), box(.05, .02, .02, '#111', 0, .02, 0)); sh.position.set(.087 * 0, .33, .27); b.userData.head.add(sh);
  const t = tag('ACT RICH', GOLD, '#1d2433', .34); t.position.set(0, 3.25, -2.6); g.add(t);
  return { g, bg: ['#2d1f2c', '#b98a8a'], focus: V(0, 1.5, -1.5), cam: dolly(V(1.4, 2.3, 1.6), V(1.1, 2.2, 1.1), V(0, 1.9, -2.6), V(0, 1.95, -2.6)),
    upd: lt => { idle(b, lt, .3); a.userData.head.rotation.y = 0; sh.visible = lt > 1.6; pop(t, lt, 2.2); a.userData.armR.rotation.x = lt < 1.6 ? -2.4 * ease(lt / 1) : lerp(-2.4, 0, ease((lt - 1.6) / .5)); } };
});

// ===== TRIAL =====
function court() {
  const g = room('#7a5a40', '#5a3e2a', { w: 12, h: 5.5, side: false, skirt: '#3a2618' });
  const bench = grp(box(3.2, 1.6, .9, '#4a2e1c', 0, .8, 0), box(3.3, .08, 1, '#6a4a30', 0, 1.62, 0)); bench.position.set(0, 0, -2.2); g.add(bench);
  const j = human({ suit: '#111114', tie: '#111114', shirt: '#111114', skin: SKINS2[1], hair: HAIRS.grey, hairStyle: 'short', glasses: true, seed: 110 }); j.position.set(0, .4, -2.6); g.add(j);
  const seal = cyl(.5, .5, .05, '#c9a54b', 0, 3.6, -2.85, 24); seal.rotation.x = Math.PI / 2; g.add(seal);
  return { g, judge: j };
}
S('j_court', () => {
  const { g, judge } = court(); const t = grp(box(2, .08, .8, '#5a3a28', 0, .78, 0), box(1.9, .74, .06, '#4a2e20', 0, .38, -.35)); t.position.set(-.8, 0, .6); g.add(t);
  const a = CAST.anna({ dress: '#f2f0ec', glasses: '#111' }); a.position.set(-.8, 0, 1.3); a.rotation.y = Math.PI; g.add(a);
  const st = human({ female: true, skin: SKINS2[3], hair: HAIRS.black, hairStyle: 'bun', top: '#222', bottom: '#222', seed: 111 }); st.position.set(1.6, 0, 1.4); st.rotation.y = -1.2; g.add(st);
  const rack = grp(cyl(.03, .03, 1.2, '#888', -.6, 1.6, 0, 8), cyl(.03, .03, 1.2, '#888', .6, 1.6, 0, 8), cyl(.025, .025, 1.25, '#888', 0, 2.2, 0, 8)); rack.children[2].rotation.z = Math.PI / 2; rack.add(box(1.3, .04, .4, '#888', 0, 1.0, 0));
  ['#151517', '#8e2c48', '#f2f0ec', '#2c5d8e'].forEach((c, i) => rack.add(rbox(.24, .9, .1, .05, c, -.45 + i * .3, 1.7, 0))); rack.position.set(2.2, 0, .4); rack.rotation.y = -.6; g.add(rack);
  const tg = tag('MANHATTAN · 2019', '#ffffff', '#1d2433', .45); tg.position.set(0, 3.0, -1.4); g.add(tg); const sty = tag('PERSONAL STYLIST', GOLD, '#1d2433', .34); sty.position.set(1.2, 2.55, 1.3); g.add(sty);
  return { g, bg: ['#2a1810', '#8a6040'], focus: V(0, 1, 0), cam: dolly(V(.6, 2.5, 6.6), V(.8, 2.4, 5.6), V(0, 1.6, -.2), V(.3, 1.6, 0)),
    upd: lt => { idle(judge, lt); idle(st, lt); blink(a, lt); pop(tg, lt, .3); pop(sty, lt, 3.4); st.userData.armR.rotation.x = lt > 3.4 ? -1.0 : 0; } };
});
S('j_lawyer', () => {
  const { g } = court(); const box_ = grp(box(3, .9, 1.4, '#4a2e1c', 0, .45, 0)); box_.position.set(-2, 0, .6); box_.rotation.y = .5; g.add(box_);
  const J = []; for (let i = 0; i < 6; i++) { const p = guest(i + 120); p.scale.setScalar(.9); p.position.set(-2.8 + (i % 3) * .8 + (i / 3 | 0) * .25, (i / 3 | 0) * .1, .2 + (i / 3 | 0) * .7 + (i % 3) * .35); p.rotation.y = 1.1; g.add(p); J.push(p); }
  const l = human({ suit: '#2b2f3a', tie: '#3a5a8a', skin: SKINS2[1], hair: HAIRS.brown, hairStyle: 'slick', glasses: true, seed: 130 }); l.position.set(.8, 0, 1); l.rotation.y = -1.2; g.add(l);
  const bb = bubble('Fake it till\nyou make it!', '#ffffff', '#1d2433', 1.3); bb.scale.setScalar(.7); bb.position.set(.2, 2.75, 1); g.add(bb);
  return { g, bg: ['#2a1810', '#8a6040'], focus: V(0, 1, 0), cam: dolly(V(1.8, 2.4, 5.8), V(1.4, 2.3, 5.0), V(-.5, 1.5, .6), V(-.4, 1.6, .6)),
    upd: lt => { J.forEach((p, i) => { idle(p, lt + i); }); idle(l, lt); talk(l, lt); l.userData.armR.rotation.x = -1 - Math.sin(lt * 3) * .3; l.userData.armL.rotation.x = -.6; pop(bb, lt, .6); } };
});
S('j_guilty', () => {
  const g = stage('#2a1810', '#1a0f0a'); const gv = grp(cyl(.18, .18, .6, '#6a3a1e', 0, 0, 0, 16), cyl(.04, .04, .9, '#6a3a1e', 0, -.4, 0, 8)); gv.children[0].rotation.z = Math.PI / 2; const piv = grp(gv); gv.position.set(0, .45, 0); piv.position.set(.6, 1.0, 0); g.add(piv);
  const bl = cyl(.45, .5, .2, '#6a3a1e', .1, .1, 0, 20); g.add(bl);
  const t = sign('GUILTY', { bg: '#b3162e', fg: '#fff', size: 110 }); t.scale.setScalar(.5); t.position.set(0, 2.5, -.6); g.add(t);
  const t2 = tag('8 CHARGES · GRAND LARCENY', '#ffffff', '#1d2433', .26); t2.position.set(0, 1.95, -.5); g.add(t2);
  return { g, bg: ['#120806', '#5a3020'], focus: V(0, 1, 0), cam: dolly(V(0, 2.0, 4.2), V(0, 1.95, 3.6), V(0, 1.6, 0), V(0, 1.6, 0)),
    upd: lt => { piv.rotation.z = lt < .7 ? -1.0 * ease(lt / .5) : lerp(-1.0, .35, ease((lt - .7) / .15)); pop(t, lt, .85); pop(t2, lt, 1.5); } };
});
S('j_twist', () => {
  const g = stage('#3a3546', '#1d1a26'); const c = card('#c9a54b', 'R. WILLIAMS'); c.position.set(0, 1.8, 0); g.add(c);
  const l = big('$62,000', '#ffffff', .3); l.position.set(0, 2.4, .1); g.add(l);
  const st = label('NOT GUILTY', { fg: '#3ad17a', border: '#3ad17a', size: 70, w: 1.1 }); st.position.set(0, 1.75, .1); st.rotation.z = .2; g.add(st);
  const r = CAST.rachel(); r.position.set(-1.2, 0, -.4); r.rotation.y = .5; g.add(r);
  const t = tag('SHE HANDED OVER HER CARD', GOLD, '#1d2433', .24); t.position.set(0, 1.05, .2); g.add(t);
  return { g, bg: ['#141220', '#4a3f5e'], focus: V(0, 1.5, 0), cam: dolly(V(0, 2.0, 3.8), V(0, 1.95, 3.3), V(0, 1.7, 0), V(0, 1.7, 0)),
    upd: lt => { idle(r, lt); pop(c, lt, .2); pop(l, lt, .5); pop(st, lt, 1.6, .3); pop(t, lt, 2.8); c.rotation.y = Math.sin(lt) * .2; } };
});
S('j_sentence', () => {
  const g = room('#5a5e68', '#4a4e58', { w: 8, h: 4.5, side: false }); const a = CAST.anna({ dress: '#e8763a', glasses: '#111' }); a.position.set(0, 0, -1); g.add(a);
  const b = bars(3.4, 3, 11); b.position.set(0, 0, .2); g.add(b);
  const t = big('4–12 YEARS', '#ffffff', .4); t.position.set(0, 2.85, .4); g.add(t);
  return { g, bg: ['#1a1c22', '#4a4e58'], focus: V(0, 1, -.5), cam: dolly(V(0, 2.0, 4.2), V(0, 2.0, 3.6), V(0, 1.7, -.5), V(0, 1.75, -.5)),
    light: L => { L.hemi.intensity = .8; }, upd: lt => { idle(a, lt, .4); frown(a, .4); pop(t, lt, .3); } };
});
S('j_sorry', () => {
  const g = room('#5a5e68', '#3a3e48', { w: 8, h: 4.5, side: false }); const a = CAST.anna({ dress: '#151517', glasses: '#111' }); a.position.set(-.6, 0, -.4); a.rotation.y = .4; g.add(a);
  const rp = human({ female: true, skin: SKINS2[2], hair: HAIRS.brown, hairStyle: 'bob', top: '#3a5a8a', bottom: '#222', seed: 140 }); rp.position.set(1.0, 0, .3); rp.rotation.y = -.9; g.add(rp);
  const mic = grp(cyl(.03, .03, .3, '#222', 0, 0, 0, 8), sph(.06, '#444', 0, .17, 0, 10)); mic.position.set(0, -.62, .1); mic.rotation.x = -1; rp.userData.armR.add(mic);
  const bb = bubble("I'd be lying if I said\nI was sorry for anything.", '#ffffff', '#1d2433', 1.9); bb.scale.setScalar(.8); bb.position.set(-.1, 2.7, -.3); g.add(bb);
  return { g, bg: ['#1a1c22', '#5a5e70'], focus: V(0, 1, 0), cam: dolly(V(.4, 2.2, 4.4), V(.2, 2.15, 3.8), V(0, 1.7, -.1), V(-.1, 1.75, -.1)),
    upd: lt => { idle(a, lt); idle(rp, lt); rp.userData.armR.rotation.x = -1.3; talk(rp, lt, lt < 1.4); talk(a, lt, lt > 1.6 && lt < 4.6); pop(bb, lt, 1.6); } };
});

// ===== THE ENDING =====
S('k_netflix', () => {
  const g = room('#5a5e68', '#4a4e58', { w: 8, h: 4.5, side: false }); const a = CAST.anna({ dress: '#e8763a', glasses: '#111', smile: true }); a.position.set(-.5, 0, -1); g.add(a);
  const b = bars(3.4, 3, 11); b.position.set(0, 0, .1); g.add(b);
  const cl = grp(box(.9, .5, .06, '#1d1d1d', 0, 0, 0)); const top = grp(box(.9, .14, .06, '#f2f2f2', .45, 0, 0)); top.position.set(-.45, .32, 0); cl.add(top); cl.position.set(.65, 2.0, .5); cl.scale.setScalar(.7); g.add(cl);
  const ck = paper({ head: 'PAY TO: ANNA', headC: '#1f7a43', title: 'STORY RIGHTS', big: '$320,000', bigSize: 60, sig: true }); ck.scale.set(.75, .45, .75); ck.position.set(-.2, 1.5, .25); g.add(ck);
  const t = tag('TV DEAL · IN JAIL', '#e8505b', '#fff', .34); t.position.set(0, 2.85, .4); g.add(t);
  return { g, bg: ['#1a1c22', '#4a4e58'], focus: V(0, 1, -.5), cam: dolly(V(.4, 2.1, 4.2), V(.2, 2.0, 3.6), V(0, 1.65, -.3), V(0, 1.7, -.3)),
    light: L => { L.hemi.intensity = .9; }, upd: lt => { idle(a, lt); top.rotation.z = lt > 1 && lt < 1.3 ? .5 : (lt < 1 ? .5 * ease(lt) : 0); pop(cl, lt, .2); pop(ck, lt, 2.6); pop(t, lt, 1.4); a.userData.armR.rotation.x = lt > 3.2 ? -1.2 : 0; } };
});
S('k_payback', () => {
  const g = stage('#8a8f99', null, { w: 30, d: 20 }); const b1 = building(2.4, 4, 1.2, '#c9ccd4', { seed: 3 }); b1.position.set(-1.6, 0, -2.4); g.add(b1); const b2 = building(2.4, 5, 1.2, '#d8cbb5', { seed: 4, lit: .5 }); b2.position.set(1.6, 0, -2.4); g.add(b2);
  const s1 = tag('BANKS', '#ffffff', '#1d2433', .45); s1.position.set(-1.6, 4.4, -1.6); g.add(s1); const s2 = tag('HOTELS', '#ffffff', '#1d2433', .45); s2.position.set(1.6, 5.4, -1.6); g.add(s2);
  const N = []; for (let i = 0; i < 14; i++) { const n = note(); n.scale.setScalar(.6); g.add(n); N.push(n); }
  const t = tag('PAYING IT BACK', GOLD, '#1d2433', .45); t.position.set(0, 2.0, 1); g.add(t);
  return { g, bg: ['#5b7fb8', '#e9d8c3'], focus: V(0, 2, -2), cam: dolly(V(0, 2.6, 7.6), V(0, 2.8, 7.0), V(0, 2.6, -2), V(0, 2.8, -2)),
    upd: lt => { N.forEach((n, i) => { const k = clamp(((lt * 1.3 + i * .14) % 1.4) / 1.4); const L_ = i % 2 ? 1 : -1; n.position.set(lerp(0, L_ * 1.6, k), 1.2 + Math.sin(k * Math.PI) * 1.4, lerp(2.4, -1.6, k)); n.rotation.set(k * 5, k * 3, 0); }); pop(t, lt, .2); } };
});
S('k_ice', () => {
  const g = stage('#8a8f99', '#5a5e68'); const wl = box(10, 3.4, .5, '#9a9ea8', 0, 1.7, -3); g.add(wl); for (let i = 0; i < 8; i++) g.add(cyl(.03, .03, .8, '#666', -4.2 + i * 1.2, 3.8, -3, 6));
  const gl = bars(1.6, 2.6, 7); gl.position.set(-.8, 0, -2.7); g.add(gl); const gr = bars(1.6, 2.6, 7); gr.position.set(.8, 0, -2.7); g.add(gr);
  const a = CAST.anna({ glasses: '#111' }); g.add(a);
  const van = car('#f4f4f6'); van.scale.set(1.2, 1.3, 1.1); g.add(van); const vl = label('IMMIGRATION', { fg: '#1b2a55', size: 56, w: 1.3 }); vl.position.set(-.1, .5, .52); van.add(vl);
  const t = tag('FREE · 2021', '#7ed321', '#1d2433', .45); t.position.set(0, 2.9, -1.6); g.add(t); const t2 = tag('DETAINED: VISA', '#e8505b', '#fff', .45); t2.position.set(0, 2.9, -1.5); g.add(t2);
  return { g, bg: ['#7c8db0', '#d8dde8'], focus: V(0, 1, -1), cam: dolly(V(.6, 2.4, 6.4), V(.3, 2.3, 5.6), V(0, 1.6, -1), V(0, 1.6, -1)),
    upd: lt => { const o = ease(clamp(lt / 1.2)); gl.position.x = -.8 - o * 1.4; gr.position.x = .8 + o * 1.4; const k = ease(clamp((lt - .6) / 1.8)); a.position.set(0, 0, lerp(-2.8, -.4, k)); if (k > 0 && k < 1) walk(a, lt, 6, .35); else idle(a, lt);
      pop(t, lt, .9); t.visible = t.visible && lt < 3.1; const vk = ease(clamp((lt - 2.6) / 1.4)); van.position.set(lerp(9, 1.6, vk), 0, .9); pop(t2, lt, 3.4); if (lt > 3.6) frown(a, .7); } };
});
S('k_series', () => {
  const g = stage('#1c1f2a', '#121420'); const SCR = [];
  const tex = canvasTex(400, 240, (c, w, h) => { const gr = c.createLinearGradient(0, 0, w, h); gr.addColorStop(0, '#2a0f18'); gr.addColorStop(1, '#6a1a2a'); c.fillStyle = gr; c.fillRect(0, 0, w, h); c.fillStyle = '#fff'; c.font = FONT(46); c.textAlign = 'center'; c.fillText('INVENTING', w / 2, 105); c.fillText('ANNA', w / 2, 160); c.fillStyle = '#e8505b'; c.fillRect(w / 2 - 50, 185, 100, 6); });
  for (let i = 0; i < 9; i++) { const m = monitor(tex, 1.2, .72); m.scale.setScalar(.85); m.position.set(-1.35 + (i % 3) * 1.35, 1.2 + (i / 3 | 0) * 1.0, -.5 - Math.abs((i % 3) - 1) * .3); m.rotation.y = -((i % 3) - 1) * .3; m.children.slice(2).forEach(x => x.visible = false); g.add(m); SCR.push(m); }
  const t = tag('2022 · WATCHED WORLDWIDE', GOLD, '#1d2433', .3); t.position.set(0, .7, .6); g.add(t);
  return { g, bg: ['#0c0d14', '#2a2440'], focus: V(0, 2, 0), cam: dolly(V(0, 2.3, 5.0), V(0, 2.2, 4.4), V(0, 2.1, -.5), V(0, 2.1, -.5)), light: L => { L.hemi.intensity = .8; },
    upd: lt => { SCR.forEach((m, i) => pop(m, lt, .1 + i * .12)); pop(t, lt, 1.6); } };
});
S('k_dance', () => {
  const g = stage('#1a1424', '#120c1c'); const fl = mesh(new THREE.CylinderGeometry(3, 3, .04, 40), M('#d8c8a8', { roughness: .2, metalness: .3 }), 0, .02, 0); g.add(fl);
  const ball = sph(.4, null, 0, 4.2, 0, 14); ball.material = M('#e8e8f0', { metalness: 1, roughness: .2, flatShading: true }); g.add(ball, cyl(.01, .01, 1.4, '#888', 0, 5.1, 0, 4));
  const a = CAST.anna({ dress: '#c9a54b', glasses: '#111', smile: true, flare: .5 }); g.add(a); const mon = rbox(.13, .1, .13, .03, '#111', 0, -.66, .02); a.userData.legR.add(mon); const led = sph(.015, null, 0, -.62, .09, 6); led.material = E('#ff2a3a', 3); a.userData.legR.add(led);
  const p = human({ suit: '#151517', tie: '#151517', shirt: '#fff', skin: SKINS2[1], hair: HAIRS.dark, hairStyle: 'slick', smile: true, seed: 150 }); g.add(p);
  const t1 = tag('ANKLE MONITOR', '#e8505b', '#fff', .28); t1.position.set(.7, .5, 1.2); g.add(t1);
  const t2 = tag('VOTED OFF · WEEK 1', '#ffffff', '#1d2433', .34); t2.position.set(0, 2.6, 0); g.add(t2);
  const sp = []; for (let i = 0; i < 4; i++) { const d = mesh(new THREE.CylinderGeometry(.6, .9, .02, 24), E(['#ff4fa3', '#4fd1ff', '#ffd23f', '#9b59ff'][i], .7), 0, .05, 0, false); g.add(d); sp.push(d); }
  return { g, bg: ['#0c0814', '#3a1a4a'], focus: V(0, 1, 0), cam: dolly(V(.6, 1.6, 5.0), V(.4, 2.0, 4.4), V(0, .9, 0), V(0, 1.5, 0)), light: L => { L.hemi.intensity = .9; },
    upd: lt => { const an = lt * 1.6; a.position.set(Math.cos(an) * .45, 0, Math.sin(an) * .45); p.position.set(-Math.cos(an) * .45, 0, -Math.sin(an) * .45); a.lookAt(p.position); p.lookAt(a.position);
      a.userData.armR.rotation.x = p.userData.armL.rotation.x = -1.4; a.userData.armL.rotation.z = -1.2; p.userData.armR.rotation.x = -1; blink(a, lt); blink(p, lt); led.visible = Math.sin(lt * 8) > 0;
      ball.rotation.y = lt; sp.forEach((d, i) => { d.position.set(Math.sin(lt * 1.2 + i * 1.6) * 2, .05, Math.cos(lt + i) * 1.6); }); pop(t1, lt, .8); t1.visible = t1.visible && lt < 3.6; pop(t2, lt, 4.0); } };
});
S('k_moral', () => {
  const g = stage('#3a1520', '#1a0d14'); g.add(box(1.6, .02, 9, '#b3162e', 0, .01, 0));
  const a = CAST.anna({ smile: true }); a.position.set(0, 0, .6); g.add(a);
  const P = []; for (let i = 0; i < 6; i++) { const p = guest(i + 160, { female: false }); p.position.set((i % 2 ? 1 : -1) * (1.6 + (i / 2 | 0) * .5), 0, -.6 + (i / 2 | 0) * .9); p.lookAt(0, 0, .6); g.add(p); const cm = grp(box(.25, .18, .2, '#222', 0, 0, 0)); cm.position.set(0, -.6, .15); p.userData.armR.add(cm); p.userData.armR.rotation.x = -1.6; P.push(p); }
  const fl = []; P.forEach((p, i) => { const f = sph(.07, null, 0, 0, 0, 8); f.material = E('#fff', 3); f.position.copy(p.position).add(V(0, 1.55, 0)); g.add(f); fl.push(f); });
  const t = tag('FAMOUS', GOLD, '#1d2433', .42); t.position.set(0, 2.95, .2); g.add(t);
  return { g, bg: ['#120a12', '#4a1a2a'], focus: V(0, 1.5, 0), cam: dolly(V(0, 2.2, 5.6), V(0, 2.1, 4.4), V(0, 1.8, 0), V(0, 1.95, .4)), light: L => { L.hemi.intensity = .9; },
    upd: lt => { idle(a, lt); P.forEach((p, i) => blink(p, lt + i)); fl.forEach((f, i) => f.visible = Math.sin(lt * 9 + i * 2.3) > .7); pop(t, lt, 2.4); } };
});
S('k_follow', () => {
  const g = stage('#2a2f55', '#1d2244'); const a = CAST.anna({ smile: true }); a.position.set(-.55, 0, 0); a.rotation.y = .3; g.add(a); const r = CAST.rachel({ smile: true }); r.position.set(.55, 0, 0); r.rotation.y = -.3; g.add(r);
  const tt = label('MORE TRUE STORIES', { fg: '#fff', size: 80 }); tt.scale.setScalar(.42); tt.position.set(0, 2.95, 0); g.add(tt);
  const fb = sign('+ FOLLOW', { bg: '#fe2c55', fg: '#fff', size: 90, radius: 60, frame: '#fe2c55' }); fb.scale.setScalar(.42); fb.position.set(0, .55, .9); g.add(fb);
  return { g, bg: ['#141a3a', '#5a4a8a'], focus: V(0, 1.5, 0), cam: dolly(V(0, 2.1, 5.0), V(0, 2.1, 4.6), V(0, 1.7, 0), V(0, 1.7, 0)),
    upd: lt => { idle(a, lt); idle(r, lt); pop(tt, lt, .2); pop(fb, lt, .8); fb.scale.setScalar(.42 * (1 + Math.max(0, Math.sin(lt * 4)) * .06) * (lt > .8 ? 1 : .001)); } };
});
