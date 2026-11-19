// Scenes: iPhone, mistakes, too late, the end, today
import { THREE, M, E, mesh, box, rbox, cyl, sph, grp, V, clamp, ease, eio, backOut, lerp, pop, dolly, canvasTex, FONT, rrect, label, sign,
  person, holdPhone, walk, SCR, screen, blackberry, touchPhone, appGrid, pager, tablet, desk, chair, floor, wall, calendar, cash, tree, flag,
  snowfall, bubble, bar, rng } from './bb_kit.js';
import { stage, SKINS, SHIRTS, OFF, rug, lamp, bbmLogo, crown } from './bb_scenes_a.js';
export const SB = []; const S = (id, build) => SB.push({ id, build });
function spot(g, x = 0, z = 0, c = '#fff4d6', I = 40) { const s = new THREE.SpotLight(c, I, 14, .45, .5, 1.2); s.position.set(x, 7, z + 1); s.target.position.set(x, 0, z); g.add(s, s.target);
  const cone = mesh(new THREE.ConeGeometry(1.6, 7, 24, 1, true), new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: .07, side: THREE.DoubleSide, depthWrite: false }), x, 3.5, z, false); g.add(cone); return [s, cone]; }
function pedestal(c = '#e9e4ef') { return grp(cyl(.8, .9, .9, c, 0, .45, 0, 32), cyl(.9, .9, .06, '#b9b2c6', 0, .93, 0, 32)); }
function tile(text, c, s = .5) { const t = canvasTex(200, 200, (x, w, h) => { x.fillStyle = c; rrect(x, 0, 0, w, h, 44); x.fill(); x.fillStyle = '#fff'; x.font = FONT(text.length > 4 ? 40 : 52); x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(text, w / 2, h / 2 + 4); });
  const m = rbox(s, s, .1, .08, c); const f = new THREE.Mesh(new THREE.PlaneGeometry(s * .98, s * .98), new THREE.MeshBasicMaterial({ map: t, transparent: true })); f.position.z = .052; return grp(m, f); }
function redX(s = 1) { const g = new THREE.Group(); [1, -1].forEach(k => { const b = box(1.2 * s, .18 * s, .06, E('#e5383b', 1.4)); b.rotation.z = k * Math.PI / 4; g.add(b); }); return g; }
function tvSet(scrTex, w = 1.8) { const g = grp(box(w, w * .58, .08, '#111')); const s = new THREE.Mesh(new THREE.PlaneGeometry(w * .94, w * .52), new THREE.MeshBasicMaterial({ map: scrTex, toneMapped: false })); s.position.z = .045; g.add(s); return g; }
const glassScreen = (c, w, h) => { c.fillStyle = '#0b0b10'; c.fillRect(0, 0, w, h); const g = c.createLinearGradient(0, 0, w, h); g.addColorStop(0, '#2b5f9e'); g.addColorStop(1, '#6b3fa0'); c.fillStyle = g; rrect(c, w * .38, h * .1, w * .24, h * .8, 18); c.fill();
  const col = ['#34c759', '#ff9f0a', '#0a84ff', '#ff375f', '#5e5ce6', '#ffd60a']; for (let i = 0; i < 12; i++) { c.fillStyle = col[i % 6]; rrect(c, w * .4 + (i % 3) * w * .068, h * .18 + (i / 3 | 0) * h * .15, w * .05, w * .05, 6); c.fill(); } };

// ===== IPHONE =====
S('s_jobs', () => {
  const g = stage('#14161f', '#0b0d14'); const scr = tvSet(screen(glassScreen, 640, 360), 5.2); scr.position.set(0, 3.1, -3.8); g.add(scr);
  const p = person({ shirt: '#15151a', pants: '#3a5a8a', skin: SKINS[0], hair: '#6b6b6b', bald: true, glasses: true }); p.position.set(0, 0, 0); g.add(p);
  const ph = touchPhone(); ph.scale.setScalar(.34); p.userData.armR.add(ph); ph.position.set(0, -.72, .06); ph.rotation.set(0, 0, 0);
  spot(g, 0, 0, '#fff', 60); const d = sign('JANUARY 2007', { bg: '#ffffff', size: 60 }); d.scale.setScalar(.5); d.position.set(0, .5, 1.6); d.rotation.x = -.6; g.add(d);
  const kb = label('NO KEYBOARD', { bg: '#e5383b', fg: '#fff', size: 60 }); kb.scale.setScalar(.45); kb.position.set(.95, 2.65, .3); g.add(kb);
  return { g, bg: ['#050608', '#1a1c28'], focus: V(0, 1.5, 0), cam: dolly(V(0, 2.2, 8.5), V(.3, 2.2, 4.2), V(0, 2.4, -1), V(0, 2.0, 0)),
    light: L => { L.hemi.intensity = .35; L.key.intensity = .7; L.fill.intensity = .2; },
    upd: lt => { const k = ease((lt - 1.2) / .8); p.userData.armR.rotation.x = -lerp(.1, 2.5, k); ph.rotation.x = lerp(0, -.3, k); pop(d, lt, .3); pop(kb, lt, 3.4); } };
});
S('s_tread', () => {
  const g = stage('#c9cbd8', '#4a5a8a', { z: -6.5 }); const tm = grp(box(1, .18, 2.2, '#2b2f3a', 0, .09, 0), box(.86, .02, 2.0, '#15161a', 0, .19, 0), box(.06, 1.2, .06, '#555', -.45, .7, -.95), box(.06, 1.2, .06, '#555', .45, .7, -.95), box(1, .3, .2, '#2b2f3a', 0, 1.3, -.95)); g.add(tm);
  const p = person({ shirt: '#d9d9d9', pants: '#2b2f3a', skin: SKINS[0], hair: '#7a6a5a', glasses: true }); p.position.set(0, .2, 0); g.add(p);
  const tv = tvSet(screen(glassScreen, 480, 270), 2.2); tv.position.set(0, 2.6, 3.2); tv.rotation.y = Math.PI; g.add(tv);
  const nm = sign('MIKE LAZARIDIS · FOUNDER', { bg: '#ffd23f', size: 50 }); nm.scale.setScalar(.34); nm.position.set(0, 2.9, -.2); nm.rotation.y = Math.PI; g.add(nm);
  const th = bubble('it will crush the network!', '#ffffff', '#1d2433', 1.5); th.position.set(.3, 3.7, 2.0); th.rotation.y = Math.PI; th.scale.setScalar(1.6); g.add(th);
  return { g, bg: ['#26336a', '#d9b2bd'], focus: V(0, 1, 0), cam: dolly(V(-1.9, 3.0, -4.6), V(-1.5, 2.8, -4.0), V(0, 2.2, 2.2), V(0, 2.2, 2.2)),
    upd: lt => { walk(p, lt, 7, .45); p.userData.legL.rotation.x *= 1; pop(nm, lt, .8); pop(th, lt, 3.4); } };
});
S('s_ceo', () => {
  const g = stage('#cdbfb0', '#2f3c6e'); const d = desk(2.4, 1.1, '#6b4430'); g.add(d); const c = chair('#222'); c.position.z = -.9; g.add(c);
  const p = person({ suit: '#23283a', tie: '#7a1c2b', skin: SKINS[4], hair: '#3a2a1c' }); p.position.set(0, 0, -.75); g.add(p);
  const sh = sign('JIM BALSILLIE · CO-CEO', { bg: '#ffd23f', size: 50 }); sh.scale.setScalar(.45); sh.position.set(0, 2.5, -.6); g.add(sh);
  const bb = bubble('just one more phone...', '#ffffff', '#1d2433', 1.7); bb.position.set(.3, 3.2, -.4); g.add(bb);
  const tp = touchPhone(); tp.scale.setScalar(.4); tp.rotation.x = -Math.PI / 2; tp.position.set(.5, .86, .1); g.add(tp);
  const r = rng(4); for (let i = 0; i < 6; i++) { const q = touchPhone({ screen: screen((c, w, h) => { c.fillStyle = ['#555', '#777', '#446'][i % 3]; c.fillRect(0, 0, w, h); }, 16, 32) }); q.scale.setScalar(.3); q.rotation.x = -Math.PI / 2; q.rotation.z = r(); q.position.set(-.9 + (i % 3) * .3, .86, -.2 + (i / 3 | 0) * .3); g.add(q); }
  return { g, bg: ['#26336a', '#d9b2bd'], cam: dolly(V(.4, 2.4, 4.4), V(0, 2.2, 3.6), V(0, 1.6, -.3), V(0, 1.8, -.3)),
    upd: lt => { pop(sh, lt, .4); pop(bb, lt, 1.6); p.userData.armR.rotation.x = -.6 - Math.max(0, Math.sin(lt * 3)) * .4; p.userData.head.rotation.z = Math.sin(lt * 2) * .1; } };
});
S('s_glass', () => {
  const g = stage('#d6d0e0', '#2a3366');
  const scr = canvasTex(300, 560, (c, w, h, n = 0) => { c.fillStyle = '#ffffff'; c.fillRect(0, 0, w, h); c.fillStyle = '#1d2433'; c.font = FONT(34); c.fillText(('Helo wrold, im tpying').slice(0, n), 16, 80);
    c.fillStyle = '#d1d5de'; c.fillRect(0, h * .6, w, h * .4); c.fillStyle = '#fff'; for (let r = 0; r < 3; r++) for (let k = 0; k < 10; k++) { rrect(c, 4 + k * 29.5, h * .62 + r * 62, 25, 52, 5); c.fill(); } });
  const ph = touchPhone({ screen: scr }); ph.scale.setScalar(2.2); ph.position.set(0, 1.9, 0); g.add(ph);
  const fing = grp(cyl(.11, .12, 1.4, SKINS[1], 0, .7, 0, 10), sph(.11, SKINS[1], 0, 0, 0, 10)); fing.rotation.x = -1; g.add(fing);
  return { g, bg: ['#232c66', '#dcb3c9'], focus: V(0, 2, 0), cam: dolly(V(0, 2.0, 3.8), V(0, 1.9, 3.2), V(0, 1.75, 0), V(0, 1.7, 0)),
    upd: lt => { const n = Math.floor(lt * 7); if (scr.n !== n) { scr.n = n; scr.redraw(n); } const k = lt * 7 % 1; fing.position.set(-.4 + ((n * 37) % 10) / 10 * .8, 1.15 + Math.floor(n % 3) * -.14, .25 + Math.abs(Math.sin(k * Math.PI)) * .15); } };
});
S('s_apps', () => {
  const g = stage('#d0c8e4', '#2a3366'); const ph = touchPhone(); ph.scale.setScalar(1.7); ph.position.set(0, 1.9, 0); g.add(ph); g.add(pedestal('#e2def0'));
  const T = [['WEB', '#0a84ff'], ['MUSIC', '#ff375f'], ['PHOTOS', '#ff9f0a'], ['MAPS', '#34c759']].map(([n, c], i) => { const t = tile(n, c, .62); g.add(t); return t; });
  const A = []; const r = rng(21); for (let i = 0; i < 40; i++) { const t = rbox(.26, .26, .06, .05, SHIRTS[i % 10]); t.userData.a = r() * Math.PI * 2; t.userData.r = 1.2 + r() * 1.3; t.userData.y = r() * 3; g.add(t); A.push(t); }
  const pos = [[-1.15, 2.9], [1.15, 2.9], [-1.15, 1.2], [1.15, 1.2]];
  return { g, bg: ['#232c66', '#dcb3c9'], focus: V(0, 1.5, 0), cam: dolly(V(0, 2.1, 6.4), V(0, 2.1, 7.2), V(0, 2.0, 0), V(0, 2.1, 0)),
    upd: lt => { T.forEach((t, i) => { pop(t, lt, 2.6 + i * .8); t.position.set(pos[i][0], pos[i][1] + Math.sin(lt * 2 + i) * .06, .4); t.rotation.y = Math.sin(lt + i) * .3; });
      A.forEach((t, i) => { const k = clamp((lt - 6.4 - i * .05) / 1.2); t.visible = k > 0; const a = t.userData.a + lt * .8; const rr = t.userData.r * ease(k); t.position.set(Math.cos(a) * rr, .6 + t.userData.y * ease(k) + .4, Math.sin(a) * rr * .6 - .2); t.rotation.set(a, a * .7, 0); t.scale.setScalar(ease(k) + .01); }); } };
});

// ===== MISTAKES =====
S('s_sales', () => {
  const g = stage('#1e2650', '#151c3f'); const a = bar(3, '#5a6b8c', .9), b = bar(3, '#bfc8d9', .9); a.position.x = -.8; b.position.x = .8; g.add(a, b);
  const pa = blackberry(); pa.scale.setScalar(.6); g.add(pa); const pb = touchPhone(); pb.scale.setScalar(.6); g.add(pb);
  const la = sign('BLACKBERRY', { bg: '#ffffff', size: 50 }), lb = sign('IPHONE', { bg: '#ffffff', size: 50 }); la.scale.setScalar(.42); lb.scale.setScalar(.42); la.position.set(-.8, .35, .7); lb.position.set(.8, .35, .7); g.add(la, lb);
  return { g, bg: ['#0c1330', '#3a2a5e'], focus: V(0, 1.5, 0), cam: dolly(V(0, 2.2, 6.6), V(0, 2.1, 5.8), V(0, 1.7, 0), V(0, 1.7, 0)),
    upd: lt => { const ha = 2.6 + lt * .05, hb = .3 + ease(lt / 3.6) * 1.9; a.scale.y = ha / 3; b.scale.y = hb / 3; pa.position.set(-.8, ha + .45, 0); pb.position.set(.8, hb + .45, 0); pa.rotation.y = pb.rotation.y = Math.sin(lt) * .3; } };
});
S('s_storm', () => {
  const g = stage('#d8cfe0', '#2a3366'); const ph = touchPhone({ body: '#1d1f26', screen: screen(appGrid, 300, 560) }); ph.add(rbox(.64, 1.2, .05, .08, '#a8afba', 0, 0, -.02)); ph.scale.setScalar(1.9); ph.position.set(0, 1.9, 0); g.add(ph);
  const fing = grp(cyl(.11, .12, 1.4, SKINS[0], 0, .7, 0, 10), sph(.11, SKINS[0], 0, 0, 0, 10)); fing.rotation.x = -1.2; g.add(fing);
  const cl = label('CLICK!', { bg: '#ffd23f', fg: '#1d2433', size: 70, radius: 40 }); cl.scale.setScalar(.45); cl.position.set(.9, 2.9, .4); g.add(cl);
  const nm = sign('BLACKBERRY STORM · 2008', { bg: '#ffffff', size: 50 }); nm.scale.setScalar(.45); nm.position.set(0, .5, .9); nm.rotation.x = -.5; g.add(nm);
  const rv = sign('REVIEWS: 1/5', { bg: '#e5383b', fg: '#fff', size: 70 }); rv.scale.setScalar(.5); rv.position.set(-.6, 3.4, .5); g.add(rv);
  const bx = []; for (let i = 0; i < 4; i++) { const b = grp(box(.7, .5, .5, '#c8a77a'), box(.72, .06, .52, '#a88a5e', 0, .1, 0)); b.position.set(-2.4 + i * .5, .25, 1.5 - i * .4); g.add(b); bx.push(b); }
  const rt = sign('RETURNED', { bg: '#14161c', fg: '#ffd23f', size: 60 }); rt.scale.setScalar(.45); rt.position.set(-1.5, 1.4, 1.2); g.add(rt);
  return { g, bg: ['#232c66', '#dcb3c9'], focus: V(0, 1.5, 0), cam: u => { const k = ease((u - .62) / .2); return { p: V(lerp(.2, -1, k), lerp(2.2, 2.0, k), lerp(4.4, 5.6, k)), l: V(lerp(0, -.7, k), lerp(1.95, 1.5, k), 0), fov: 40 }; },
    upd: lt => { const pr = Math.max(0, Math.sin(lt * 3)); ph.position.z = -pr * .12; fing.position.set(.1, 1.95, .3 + (1 - pr) * .35); fing.visible = lt < 6.4;
      cl.visible = pr > .7 && lt < 5; pop(nm, lt, .4); pop(rv, lt, 4.4); bx.forEach((b, i) => pop(b, lt, 6.6 + i * .2)); pop(rt, lt, 7.2); } };
});
S('s_playbook', () => {
  const g = stage('#d4cce2', '#2a3366');
  const scr = screen((c, w, h) => { const gg = c.createLinearGradient(0, 0, w, h); gg.addColorStop(0, '#1d3c6e'); gg.addColorStop(1, '#3a2a6e'); c.fillStyle = gg; c.fillRect(0, 0, w, h);
    const col = ['#3d8bfd', '#20c997', '#f59f00', '#e64980', '#7950f2', '#12b886', '#fd7e14']; for (let i = 0; i < 8; i++) { if (i == 0) { c.strokeStyle = '#e5383b'; c.lineWidth = 6; c.setLineDash([10, 8]); rrect(c, 40, 60, 100, 100, 18); c.stroke(); c.setLineDash([]); continue; } c.fillStyle = col[i % 7]; rrect(c, 40 + (i % 4) * 130, 60 + (i / 4 | 0) * 140, 100, 100, 18); c.fill(); } }, 560, 340);
  const tb = tablet({ screen: scr }); tb.position.set(0, 1.6, 0); tb.rotation.x = -.2; g.add(tb, box(.3, .9, .3, '#555', 0, .6, -.2), box(1, .06, .6, '#555', 0, .03, -.1));
  const x = redX(.4); x.position.set(-.47, 1.84, .2); g.add(x);
  const nm = sign('PLAYBOOK · 2011', { bg: '#ffffff', size: 54 }); nm.scale.setScalar(.45); nm.position.set(0, 2.55, 0); g.add(nm);
  const ne = sign('NO EMAIL APP', { bg: '#e5383b', fg: '#fff', size: 64 }); ne.scale.setScalar(.5); ne.position.set(0, .7, .8); g.add(ne);
  return { g, bg: ['#232c66', '#dcb3c9'], focus: V(0, 1.4, 0), cam: dolly(V(-.6, 2.0, 4.4), V(0, 1.9, 3.6), V(0, 1.6, 0), V(0, 1.65, 0)), upd: lt => { pop(nm, lt, .3); pop(x, lt, 2.2); pop(ne, lt, 3.0); } };
});
S('s_price', () => {
  const g = stage('#d9cfd9', '#2f3f6a');
  const tag = (txt, c) => { const t = grp(rbox(1.5, .8, .06, .08, c)); const l = label(txt, { fg: '#fff', size: 110 }); l.scale.setScalar(.55); l.position.z = .04; t.add(l, sph(.06, '#fff', -.6, 0, .04)); return t; };
  const a = tag('$499', '#2b2f3a'), b = tag('$199', '#e5383b'); a.position.set(-.5, 2.6, 0); a.rotation.z = .1; b.position.set(.5, 1.7, .3); b.rotation.z = -.1; g.add(a, b);
  const strike = box(1.6, .1, .05, E('#e5383b', 1.5)); strike.position.set(-.5, 2.6, .08); strike.rotation.z = .1; g.add(strike);
  const pile = cash(3, 2, 3, { c: '#4caf6a' }); pile.position.set(0, 0, .3); g.add(pile);
  const loss = sign('-$485 MILLION', { bg: '#14161c', fg: '#ff6b6b', size: 90 }); loss.scale.setScalar(.55); loss.position.set(0, 1.0, 1.1); g.add(loss);
  const fire = []; for (let i = 0; i < 12; i++) { const f = mesh(new THREE.ConeGeometry(.12, .4, 5), E(i % 2 ? '#ff8a2a' : '#ffcf3a', 2), (i % 4 - 1.5) * .35, .55, (i / 4 | 0) * .25 + .1, false); pile.add(f); fire.push(f); }
  return { g, bg: ['#26356a', '#e5bfcb'], focus: V(0, 1.4, 0), cam: dolly(V(0, 2.4, 5.6), V(.3, 2.0, 4.6), V(0, 2.0, 0), V(0, 1.4, 0)),
    upd: lt => { pop(a, lt, .1); strike.scale.x = ease((lt - .9) / .4) + .001; pop(b, lt, 1.6); const burn = clamp((lt - 3.2) / 3); pile.userData.bricks.forEach((br, i) => br.visible = i / 18 > burn * .8);
      fire.forEach((f, i) => { f.visible = lt > 3.2; f.scale.y = .7 + Math.sin(lt * 12 + i) * .3; }); pop(loss, lt, 3.4); } };
});
S('s_outage', () => {
  const g = stage('#2a2f45', '#1c2238'); const cal = calendar('OCTOBER 2011', '10', 'MONDAY'); cal.scale.setScalar(.8); cal.position.set(-1.1, 3.1, -3.5); g.add(cal);
  const tw = grp(); for (let i = 0; i < 4; i++) { const l = cyl(.04, .04, 3.4, '#8a93a6', 0, 1.7, 0, 4); l.position.x = (i % 2 - .5) * .5 * (1 - 0); l.position.z = (i / 2 | 0) - .5; l.rotation.z = (i % 2 - .5) * .1; tw.add(l); }
  const bl = sph(.12, E('#ff3a3a', 2), 0, 3.5, 0); tw.add(bl); tw.position.set(1.6, 0, -2); g.add(tw);
  const errS = screen((c, w, h) => { c.fillStyle = '#1a1c22'; c.fillRect(0, 0, w, h); c.fillStyle = '#e5383b'; c.beginPath(); c.arc(w / 2, 100, 50, 0, 7); c.fill(); c.fillStyle = '#fff'; c.font = FONT(80); c.textAlign = 'center'; c.fillText('!', w / 2, 128); c.font = FONT(26, 800); c.fillText('Message not sent', w / 2, 200); });
  const P = []; for (let i = 0; i < 3; i++) { const p = blackberry({ screen: errS }); p.scale.setScalar(.7); p.position.set((i - 1) * .75, .75, .6); p.rotation.x = -.2; g.add(p); P.push(p); }
  const D = ['DAY 1', 'DAY 2', 'DAY 3'].map((n, i) => { const s = sign(n, { bg: '#ffd23f', size: 60 }); s.scale.setScalar(.45); s.position.set((i - 1) * .8, 1.7, .8); g.add(s); return s; });
  return { g, bg: ['#141a33', '#2e2346'], focus: V(0, 1.3, 0), cam: dolly(V(0, 3.0, 6.4), V(0, 2.2, 4.6), V(0, 2.6, -1.5), V(0, 1.4, 0)),
    light: L => { L.hemi.intensity = .7; L.key.intensity = 1.4; }, upd: lt => { pop(cal, lt, .1); P.forEach((p, i) => { pop(p, lt, 1.6 + i * .2); p.position.y = .75 + Math.sin(lt * 20 + i) * .01 * (lt > 3); }); D.forEach((s, i) => pop(s, lt, 3.4 + i * 1)); bl.visible = Math.sin(lt * 5) > 0; } };
});
S('s_green', () => {
  const g = stage('#cfe4d6', '#2a5a4a'); const P = []; for (let i = 0; i < 3; i++) { const p = touchPhone({ screen: screen((c, w, h) => { c.fillStyle = '#ece5dd'; c.fillRect(0, 0, w, h); c.fillStyle = '#25a36a'; c.fillRect(0, 0, w, 70); for (let k = 0; k < 5; k++) { c.fillStyle = k % 2 ? '#dcf8c6' : '#ffffff'; rrect(c, k % 2 ? 100 : 20, 100 + k * 80, 180, 56, 14); c.fill(); } }, 300, 560) });
    p.scale.setScalar(1); p.position.set((i - 1) * .9, 1.6, (i == 1) * .3); p.rotation.y = (1 - i) * .3; g.add(p); P.push(p); }
  const B = []; for (let i = 0; i < 8; i++) { const b = bubble(['ok!', 'lol', 'here', 'yes', ':)', 'omw', 'nice', 'haha'][i], '#25a36a', '#fff', .55); g.add(b); B.push(b); }
  return { g, bg: ['#1f4a4a', '#cfe7c9'], focus: V(0, 1.5, 0), cam: dolly(V(0, 2.0, 4.8), V(0, 1.9, 4.2), V(0, 1.8, 0), V(0, 1.8, 0)),
    upd: lt => B.forEach((b, i) => { const k = ((lt * .6 + i / 8) % 1); b.position.set(((i % 4) - 1.5) * .8, 1 + k * 2.6, .7); b.material.opacity = Math.sin(k * Math.PI); }) };
});

// ===== TOO LATE =====
S('s_bb10', () => {
  const g = stage('#262a44', '#191d36'); g.add(pedestal()); spot(g);
  const ph = touchPhone({ screen: screen((c, w, h) => { c.fillStyle = '#0f1116'; c.fillRect(0, 0, w, h); c.fillStyle = '#fff'; c.font = FONT(40); c.fillText('Hub', 20, 60); for (let k = 0; k < 8; k++) { c.fillStyle = k % 2 ? '#1c2028' : '#232836'; c.fillRect(0, 90 + k * 56, w, 54); c.fillStyle = '#4aa3ff'; c.fillRect(20, 108 + k * 56, 18, 18); c.fillStyle = '#c9d1e0'; c.fillRect(54, 110 + k * 56, 140 + (k * 37 % 80), 12); } }, 300, 560), button: false });
  ph.scale.setScalar(1.25); ph.position.y = 1.8; g.add(ph);
  const nm = sign('BLACKBERRY 10 · 2013', { bg: '#ffffff', size: 54 }); nm.scale.setScalar(.45); nm.position.set(0, 3.0, -.5); g.add(nm);
  const late = sign('6 YEARS LATE', { bg: '#e5383b', fg: '#fff', size: 80 }); late.scale.setScalar(.55); late.position.set(0, .45, 1.2); late.rotation.x = -.4; g.add(late);
  const yr = label('2007 → 2013', { size: 90, fg: '#ffd23f' }); yr.scale.setScalar(.55); yr.position.set(0, 4.2, -3.8); g.add(yr);
  return { g, bg: ['#0e1330', '#2a2148'], focus: V(0, 1.5, 0), cam: dolly(V(1.5, 2.4, 5.6), V(-.3, 2.1, 4.4), V(0, 1.9, 0), V(0, 2.0, 0)),
    light: L => { L.hemi.intensity = .55; L.key.intensity = 1.3; }, upd: lt => { ph.rotation.y = Math.sin(lt * .8) * .4; pop(nm, lt, .4); pop(yr, lt, 3.0); pop(late, lt, 4.6); } };
});
S('s_unsold', () => {
  const g = stage('#9a9aa6', '#5a5d6e', { w: 30 }); const geo = new THREE.BoxGeometry(.7, .5, .5); const n = 260; const im = new THREE.InstancedMesh(geo, M('#c8a77a'), n); const d = new THREE.Object3D(); let i = 0;
  for (let x = -6; x <= 6; x++) for (let z = 0; z < 4; z++) for (let y = 0; y < 5 && i < n; y++) { if (Math.abs(x) < 1 && z > 1) continue; d.position.set(x * .75, .25 + y * .52, -3.5 + z * .55 + (x % 2) * .05); d.updateMatrix(); im.setMatrixAt(i++, d.matrix); }
  im.count = i; im.castShadow = true; im.receiveShadow = true; g.add(im);
  const tag = sign('UNSOLD PHONES · ~$1 BILLION', { bg: '#ffd23f', size: 60 }); tag.scale.setScalar(.55); tag.position.set(0, 3.4, -.8); g.add(tag);
  for (let k = 0; k < 3; k++) { const l = box(1.8, .06, .3, E('#fff9e0', 1.5), (k - 1) * 3, 5.6, -1); g.add(l); }
  return { g, bg: ['#3a3d4e', '#7a7d8e'], focus: V(0, 1.4, -2), cam: dolly(V(0, 2.0, 5.5), V(0, 3.2, 4.8), V(0, 1.6, -2), V(0, 2.2, -2)), upd: lt => pop(tag, lt, 1.4) };
});
S('s_deal', () => {
  const g = stage('#cdbfb0', '#2f3c6e'); const d = desk(2.4, 1.1, '#6b4430'); g.add(d);
  const a = person({ suit: '#23283a', skin: SKINS[0], hair: '#555' }), b = person({ suit: '#3a3f4b', skin: SKINS[2], hair: '#111' }); a.position.set(-.85, 0, 0); a.rotation.y = Math.PI / 2; b.position.set(.85, 0, 0); b.rotation.y = -Math.PI / 2; g.add(a, b);
  const ct = canvasTex(300, 400, (c, w, h) => { c.fillStyle = '#fbf7ec'; c.fillRect(0, 0, w, h); c.fillStyle = '#1d2433'; c.font = FONT(36); c.textAlign = 'center'; c.fillText('OFFER', w / 2, 60); c.font = FONT(64); c.fillStyle = '#2e8b57'; c.fillText('$4.7B', w / 2, 150); c.fillStyle = '#b8b0a0'; for (let k = 0; k < 6; k++) c.fillRect(30, 200 + k * 28, 240, 9); });
  const half = (s) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(.35, .9), new THREE.MeshStandardMaterial({ map: ct, side: THREE.DoubleSide })); ct.repeat; m.geometry.attributes.uv.array.forEach((v, i, arr) => { if (i % 2 == 0) arr[i] = s ? .5 + v * .5 : v * .5; }); m.geometry.attributes.uv.needsUpdate = true; return m; };
  const L = half(0), R = half(1); L.position.set(-.175, 1.5, 0); R.position.set(.175, 1.5, 0); g.add(L, R);
  const x = redX(.5); x.position.set(0, 1.5, .2); g.add(x);
  const fa = sign('DEAL FALLS APART', { bg: '#e5383b', fg: '#fff', size: 60 }); fa.scale.setScalar(.45); fa.position.set(0, 2.55, 0); g.add(fa);
  return { g, bg: ['#26336a', '#d9b2bd'], cam: dolly(V(0, 2.0, 4.6), V(0, 1.9, 3.8), V(0, 1.5, 0), V(0, 1.6, 0)),
    upd: lt => { const k = ease((lt - 1.8) / .8); a.userData.armR.rotation.x = -1.2 * (1 - k * .8); b.userData.armR.rotation.x = -1.2 * (1 - k * .8); L.position.set(-.175 - k * .7, 1.5 - k * .5, 0); L.rotation.z = k * .8; R.position.set(.175 + k * .7, 1.5 - k * .5, 0); R.rotation.z = -k * .8; pop(x, lt, 2.4); pop(fa, lt, 2.6); } };
});
S('s_bbmall', () => {
  const g = stage('#d0c8e4', '#2a3366'); const lg = bbmLogo(); lg.scale.setScalar(.6); g.add(lg);
  const ip = touchPhone(), an = touchPhone({ body: '#2a3a2a', button: false }); ip.position.set(-.9, 1.4, 0); an.position.set(.9, 1.4, 0); g.add(ip, an);
  const la = sign('IPHONE', { bg: '#fff', size: 50 }), lb = sign('ANDROID', { bg: '#a4c639', fg: '#fff', size: 50 }); la.scale.setScalar(.4); lb.scale.setScalar(.4); la.position.set(-.9, .55, .3); lb.position.set(.9, .55, .3); g.add(la, lb);
  const em = bubble('anyone here...?', '#ffffff', '#1d2433', 1.3); em.position.set(0, 3.0, .3); g.add(em);
  return { g, bg: ['#232c66', '#dcb3c9'], focus: V(0, 1.5, 0), cam: dolly(V(0, 2.1, 5.2), V(0, 2.0, 4.6), V(0, 1.8, 0), V(0, 1.9, 0)),
    upd: lt => { const k = clamp(lt / 2.2); const side = k < .5 ? -1 : 1; lg.position.set(lerp(-.9, .9, eio(k)), 2.3 + Math.sin(k * Math.PI * 2) * .3, .3); lg.rotation.y = lt * 2; pop(em, lt, 2.8); } };
});
S('s_fb', () => {
  const g = stage('#1e2650', '#151c3f'); const big = cash(4, 3, 18, { c: '#3fa35f' }); big.position.x = -.95; const sm = cash(3, 2, 6, { c: '#5a6478' }); sm.position.x = 1.2; g.add(big, sm);
  const t1 = sign('$19 BILLION', { bg: '#ffd23f', size: 90 }), t2 = sign('ALL OF\nBLACKBERRY', { bg: '#ffffff', size: 50 }), t3 = sign('WHATSAPP DEAL · 2014', { bg: '#25a36a', fg: '#fff', size: 50 });
  t1.scale.setScalar(.55); t1.position.set(-.95, 3.1, .6); t2.scale.setScalar(.45); t2.position.set(1.2, 1.35, .5); t3.scale.setScalar(.45); t3.position.set(-.95, 3.65, .6); g.add(t1, t2, t3);
  return { g, bg: ['#0c1330', '#3a2a5e'], focus: V(0, 1.5, 0), cam: dolly(V(.3, 1.8, 6.6), V(.2, 2.4, 5.8), V(0, 1.4, 0), V(0, 2.0, 0)),
    upd: lt => { const B = big.userData.bricks; const n = Math.floor(ease((lt - .5) / 3) * B.length); B.forEach((b, i) => b.visible = i < n); pop(t1, lt, 3.2); pop(t3, lt, 1.0); pop(sm, lt, 4.2); pop(t2, lt, 4.6); } };
});

// ===== THE END =====
S('s_stop', () => {
  const g = stage('#8e93a6', '#4a5068'); const belt = box(7, .1, .8, '#2b2f3a', 0, .9, 0); g.add(belt, box(7, .9, .7, '#5a6070', 0, .45, 0));
  const P = []; for (let i = 0; i < 9; i++) { const p = blackberry(); p.scale.setScalar(.35); p.rotation.x = -Math.PI / 2; g.add(p); P.push(p); }
  const light = sph(.18, E('#3fdc6a', 2), 1.8, 2.4, -.5); g.add(light, cyl(.04, .04, 1.4, '#444', 1.8, 1.7, -.5));
  const s = sign('PHONE PRODUCTION ENDS · 2016', { bg: '#ffffff', size: 54 }); s.scale.setScalar(.5); s.position.set(0, 3.2, -3.8); g.add(s);
  return { g, bg: ['#3a3d4e', '#a0a4b8'], focus: V(0, 1, 0), cam: dolly(V(-.9, 2.0, 2.8), V(-.5, 1.9, 2.3), V(0, 1.0, 0), V(0, 1.05, 0)),
    upd: lt => { const sp = clamp(1 - (lt - 1.4) / 1.4); const off = lt * 1.2 - Math.max(0, lt - 1.4) * 1.2 + (1 - sp) * 0; const pos = Math.min(lt, 1.4) * 1.2 + (lt > 1.4 ? (1 - Math.pow(1 - clamp((lt - 1.4) / 1.4), 2)) * .7 : 0);
      P.forEach((p, i) => { p.position.set(((i * .8 + pos) % 7.2) - 3.6, .98, 0); }); light.material = lt > 2.2 ? E('#ff3a3a', 2.4) : E('#3fdc6a', 2); pop(s, lt, .3); } };
});
S('s_toy', () => {
  const g = stage('#c9b8a8', '#4a5a7a'); const sofa = grp(box(2.6, .45, 1, '#7a4a6a', 0, .4, 0), box(2.6, .8, .25, '#6a3a5a', 0, .9, -.4), box(.25, .6, 1, '#6a3a5a', -1.2, .6, 0), box(.25, .6, 1, '#6a3a5a', 1.2, .6, 0)); sofa.position.z = -.5; g.add(sofa);
  const p = person({ suit: '#2b3045', shirt: '#f4f4f4', tie: '#2a4aa0', skin: SKINS[2], hair: '#9a9a9a' }); p.position.set(0, .1, -.45); p.userData.legL.rotation.x = -1.4; p.userData.legR.rotation.x = -1.4; g.add(p);
  const toy = grp(rbox(.7, 1.2, .25, .12, '#e5383b')); for (let k = 0; k < 9; k++) toy.add(cyl(.08, .08, .06, ['#ffd23f', '#3f8cff', '#3fdc6a'][k % 3], -.2 + (k % 3) * .2, -.35 + (k / 3 | 0) * -.18 + .2, .13, 12).rotateX(Math.PI / 2));
  toy.add(box(.5, .3, .02, '#9fd8ff', 0, .32, .13)); toy.add(cyl(.03, .03, .4, '#ffd23f', .25, .75, 0, 6)); toy.scale.setScalar(.45); p.userData.armR.add(toy); toy.position.set(0, -.75, .1); toy.rotation.x = -1.6;
  p.userData.armR.rotation.x = -1.3; p.userData.head.rotation.x = .2;
  const bb = bubble('like a toy phone for a 3-year-old', '#ffffff', '#1d2433', 1.8); bb.position.set(0, 2.6, -.2); g.add(bb);
  const d = sign('2016', { bg: '#ffd23f', size: 70 }); d.scale.setScalar(.45); d.position.set(-1.3, 2.9, -3.8); g.add(d);
  return { g, bg: ['#26336a', '#d9b2bd'], focus: V(0, 1, 0), cam: dolly(V(.6, 1.9, 4.2), V(.2, 1.7, 3.2), V(0, 1.4, -.4), V(0, 1.5, -.4)),
    upd: lt => { pop(bb, lt, 2.8); pop(d, lt, .3); p.userData.head.rotation.z = Math.sin(lt * 1.4) * .08; } };
});
S('s_kim', () => {
  const g = stage('#e6d4dc', '#5a3a5e'); const d = desk(2, 1, '#f1ece4'); g.add(d);
  const st = canvasTex(480, 300, (c, w, h, n = 0) => { c.fillStyle = '#ffffff'; c.fillRect(0, 0, w, h); c.fillStyle = '#e9ecf2'; c.fillRect(0, 0, w, 50); c.fillStyle = '#3a4a6a'; c.font = FONT(28); c.fillText('auction search: "blackberry bold"', 16, 34);
    for (let k = 0; k < 3; k++) { c.fillStyle = '#20232b'; c.fillRect(20, 70 + k * 74, 50, 64); c.fillStyle = '#1d2433'; c.font = FONT(24, 800); c.fillText('Used BlackBerry', 90, 100 + k * 74); c.fillStyle = k < n ? '#e5383b' : '#2e8b57'; c.font = FONT(24); c.fillText(k < n ? 'SOLD OUT' : 'Buy now', 330, 100 + k * 74); } });
  const lap = grp(box(1.3, .05, .9, '#c0c4cc', 0, 0, 0)); const lid = grp(box(1.3, .85, .04, '#c0c4cc', 0, .42, 0)); const sc = new THREE.Mesh(new THREE.PlaneGeometry(1.2, .75), new THREE.MeshBasicMaterial({ map: st })); sc.position.set(0, .42, .025); lid.add(sc); lid.position.z = -.45; lid.rotation.x = -.15; lap.add(lid); lap.position.y = .85; g.add(lap);
  const p = person({ shirt: '#1a1a1f', skin: SKINS[1], hair: '#120c0a', long: true }); p.position.set(0, 0, 1.05); p.rotation.y = Math.PI; p.userData.armL.rotation.x = -1.1; p.userData.armR.rotation.x = -1.1; p.userData.head.rotation.x = .2; g.add(p);
  const bbs = []; for (let i = 0; i < 3; i++) { const b = blackberry(); b.scale.setScalar(.3); b.rotation.x = -Math.PI / 2; b.position.set(.7 + i * .02, .86 + i * .05, .25); b.rotation.z = i * .4; g.add(b); bbs.push(b); }
  return { g, bg: ['#3a2a5e', '#ecc3cf'], focus: V(0, 1, 0), cam: dolly(V(-2.0, 2.1, 1.9), V(-1.6, 1.9, 1.5), V(0, 1.15, -.3), V(0, 1.2, -.3)),
    upd: lt => { const n = clamp(Math.floor((lt - 1.6) / .7), 0, 3); if (st.n !== n) { st.n = n; st.redraw(n); } bbs.forEach((b, i) => pop(b, lt, .2 + i * .3)); } };
});
S('s_zero', () => {
  const g = stage('#1e2650', '#151c3f'); const C = ['#3a6fd8', '#3ccf7e', '#e8505b', '#f5a623', '#9b59b6', '#26a69a']; const B = [];
  for (let i = 0; i < 6; i++) { const b = bar(1.2 + (i * 37 % 5) * .3, C[i], .55); b.position.set((i - 2.5) * .66, 0, -.6); g.add(b); B.push(b); }
  const z = label('0.0%', { size: 220, fg: '#ffffff' }); z.scale.setScalar(.58); z.position.set(0, 1.25, .8); g.add(z);
  const s = sign("BLACKBERRY'S SHARE OF NEW SMARTPHONES", { bg: '#ffd23f', size: 40 }); s.scale.setScalar(.45); s.position.set(0, .42, 1.0); g.add(s);
  const ph = blackberry(); ph.scale.setScalar(.35); ph.position.set(0, .14, 1.4); ph.rotation.x = -Math.PI / 2; g.add(ph);
  return { g, bg: ['#0c1330', '#3a2a5e'], focus: V(0, 1, 0), cam: dolly(V(0, 2.0, 5.6), V(0, 1.7, 4.4), V(0, 1.4, 0), V(0, 1.2, 0)), upd: lt => { B.forEach((b, i) => b.scale.y = ease((lt - i * .1) / .7) + .001); pop(z, lt, 1.6, .6); pop(s, lt, 2.2); } };
});
S('s_bbmdead', () => {
  const g = stage('#2a2f45', '#1c2238'); const lg = bbmLogo(); lg.position.y = 2.1; g.add(lg);
  const parts = []; for (let i = 0; i < 16; i++) { const p = box(.35, .35, .3, '#16181d'); p.position.set((i % 4 - 1.5) * .35, 2.1 + (1.5 - (i / 4 | 0)) * .35, 0); p.userData.v = V((i % 4 - 1.5) * .8, 1 + (i * 7 % 5) * .3, (i % 3 - 1) * .6); p.visible = false; g.add(p); parts.push(p); }
  const y = label('2019', { size: 140, fg: '#ffd23f' }); y.scale.setScalar(.6); y.position.set(0, 3.6, -3.6); g.add(y);
  return { g, bg: ['#141a33', '#2e2346'], focus: V(0, 1.5, 0), cam: dolly(V(0, 2.3, 5), V(0, 2.2, 4.4), V(0, 2.0, 0), V(0, 1.8, 0)),
    upd: lt => { const k = Math.max(0, lt - 1.0); lg.visible = k == 0; parts.forEach(p => { p.visible = k > 0; const v = p.userData.v; p.position.set(p.userData.x0 ??= p.position.x, 0, 0); p.position.set(p.userData.x0 + v.x * k, (p.userData.y0 ??= 2.1 + (1.5 - (parts.indexOf(p) / 4 | 0)) * .35) + v.y * k - 4.9 * k * k, v.z * k); p.rotation.set(k * 3, k * 2, 0); if (p.position.y < .17) p.position.y = .17; }); pop(y, lt, .2); } };
});
S('s_off', () => {
  const g = stage('#2a2f45', '#1c2238'); const cal = calendar('JANUARY 2022', '4', 'TUESDAY'); cal.scale.setScalar(.9); cal.position.set(0, 3.2, -3.5); g.add(cal);
  const shelf = box(4.8, .12, .9, '#6b4a33', 0, .9, 0); g.add(shelf, box(4.8, .9, .8, '#4a3424', 0, .45, 0));
  const P = []; for (let i = 0; i < 7; i++) { const t = screen([SCR.home, SCR.mail, SCR.bbm][i % 3]); const p = blackberry({ screen: t, body: i == 3 ? '#20345f' : '#1a1c21' }); p.userData.onTex = t; p.scale.setScalar(.55); p.position.set((i - 3) * .66, 1.29, 0); p.rotation.x = -.1; g.add(p); P.push(p); }
  return { g, bg: ['#141a33', '#2e2346'], focus: V(0, 1.4, 0), cam: dolly(V(0, 2.8, 5.8), V(0, 1.7, 3.6), V(0, 2.6, -2), V(0, 1.35, 0)),
    light: (L, lt) => { L.hemi.intensity = lerp(1.0, .45, ease((lt - 2) / 3)); }, upd: lt => { pop(cal, lt, .1); P.forEach((p, i) => { const off = lt > 2.0 + Math.abs(i - 3) * .35; p.userData.screen.material.map = off ? OFF : p.userData.onTex; p.userData.led.visible = !off; }); } };
});
S('s_no911', () => {
  const g = stage('#2a2f45', '#1c2238'); const S3 = ['DATA', 'TEXTS', '911'].map((n, i) => { const s = sign(n, { bg: '#ffffff', size: 100 }); s.scale.setScalar(.55); s.position.set(0, 3.2 - i * 1.0, -1); g.add(s); const x = redX(.55); x.position.set(0, 3.2 - i * 1.0, -.85); g.add(x); return [s, x]; });
  const ph = blackberry({ screen: OFF }); ph.scale.setScalar(.9); ph.position.set(0, .62, .4); ph.rotation.x = -1.2; g.add(ph);
  return { g, bg: ['#141a33', '#2e2346'], focus: V(0, 1.5, -1), cam: dolly(V(0, 2.3, 5.2), V(0, 2.2, 4.6), V(0, 2.1, -1), V(0, 2.1, -1)), upd: lt => S3.forEach(([s, x], i) => { pop(s, lt, i * .7); pop(x, lt, i * .7 + .4); }) };
});
S('s_paper', () => {
  const g = stage('#3a2f2a', '#241c18'); const d = desk(2.6, 1.3, '#5a3a26'); g.add(d); const l = lamp('#ffd9a0'); l.position.set(-.9, .82, -.3); l.scale.setScalar(1.4); g.add(l);
  const pp = []; for (let i = 0; i < 9; i++) { const p = box(.85, .012, 1.1, '#f7f3ea', 0, .835 + i * .013, 0); p.rotation.y = (i * 37 % 10 - 5) * .02; g.add(p); pp.push(p); }
  const ph = blackberry({ screen: OFF }); ph.scale.setScalar(.55); ph.rotation.x = -Math.PI / 2; ph.rotation.z = .3; ph.position.set(0, .99, 0); g.add(ph);
  const tag = sign('PAPERWEIGHT', { bg: '#f5f1e6', fg: '#3a2a1c', size: 50 }); tag.scale.setScalar(.35); tag.position.set(.55, .87, .45); tag.rotation.x = -Math.PI / 2; tag.rotation.z = -.2; g.add(tag);
  return { g, bg: ['#1a1210', '#4a3428'], focus: V(0, .9, 0), cam: dolly(V(.8, 2.0, 1.9), V(.5, 1.7, 1.4), V(0, .9, 0), V(0, .95, 0)),
    light: L => { L.hemi.intensity = .5; L.key.intensity = 1.2; L.key.color.set('#ffd9a8'); }, upd: lt => pop(tag, lt, 1.2) };
});

// ===== TODAY =====
S('s_secure', () => {
  const g = stage('#151b2e', '#0d1222'); const LEDs = [];
  for (let i = 0; i < 6; i++) { const r = grp(box(.9, 2.6, .8, '#1f2638', 0, 1.3, 0)); for (let k = 0; k < 10; k++) { const l = box(.06, .04, .02, E('#39ff9c', 2), -.3 + (k % 2) * .1, .3 + k * .22, .41); r.add(l); LEDs.push(l); } r.position.set(i % 2 ? 2 : -2, 0, -3 + (i / 2 | 0) * 1.1); r.rotation.y = i % 2 ? -Math.PI / 2 : Math.PI / 2; g.add(r); }
  const sh = canvasTex(300, 340, (c, w, h) => { c.fillStyle = '#2f80ed'; c.beginPath(); c.moveTo(w / 2, 6); c.lineTo(w - 12, 50); c.lineTo(w - 30, 220); c.lineTo(w / 2, h - 6); c.lineTo(30, 220); c.lineTo(12, 50); c.closePath(); c.fill();
    c.fillStyle = '#fff'; rrect(c, w / 2 - 50, 150, 100, 80, 12); c.fill(); c.strokeStyle = '#fff'; c.lineWidth = 16; c.beginPath(); c.arc(w / 2, 150, 34, Math.PI, 0); c.stroke(); });
  const shield = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 1.6), new THREE.MeshBasicMaterial({ map: sh, transparent: true, side: THREE.DoubleSide })); shield.position.set(0, 2.1, -1); g.add(shield);
  const s = sign('CYBERSECURITY', { bg: '#ffffff', size: 70 }); s.scale.setScalar(.5); s.position.set(0, .9, -.6); g.add(s);
  return { g, bg: ['#060a16', '#18233f'], focus: V(0, 1, -1), cam: dolly(V(0, 1.9, 4.6), V(0, 2.0, 3.6), V(0, 1.7, -1), V(0, 1.8, -1)),
    light: L => { L.hemi.intensity = .5; L.key.intensity = 1; L.key.color.set('#bcd4ff'); }, upd: lt => { pop(shield, lt, .8, .6); shield.rotation.y = Math.sin(lt * 1.2) * .5; pop(s, lt, 1.6); LEDs.forEach((l, i) => l.visible = Math.sin(lt * 9 + i * 2.3) > -.3); } };
});
function car(c = '#e8505b') { const g = grp(rbox(1.9, .5, .95, .12, c, 0, .45, 0), rbox(1.1, .45, .85, .12, c, -.1, .85, 0), box(1.0, .36, .87, E('#9fd8ff', .3), -.1, .86, 0)); [[-.6, .45], [.6, .45], [-.6, -.45], [.6, -.45]].forEach(([x, z]) => g.add(cyl(.22, .22, .16, '#15161a', x, .22, z, 12).rotateX(Math.PI / 2))); return g; }
S('s_car', () => {
  const g = stage('#7fb069', null, { w: 60, d: 60 }); g.add(box(4, .02, 60, '#3a3f4b', 0, .01, 0)); for (let i = 0; i < 20; i++) g.add(box(.12, .025, 1, '#f5f1e6', 0, .02, -28 + i * 3));
  const r = rng(13); for (let i = 0; i < 30; i++) { const t = tree(1 + r() * .8); t.position.set((r() > .5 ? 1 : -1) * (3.5 + r() * 8), 0, -28 + r() * 56); g.add(t); }
  const cr = car('#3f8cff'); cr.rotation.y = Math.PI / 2; g.add(cr);
  const dash = grp(box(2.4, .9, .6, '#1d1f26', 0, 0, 0)); const ds = canvasTex(480, 220, (c, w, h, t = 0) => { c.fillStyle = '#0d1018'; c.fillRect(0, 0, w, h); c.strokeStyle = '#2a3550'; c.lineWidth = 3; for (let k = 0; k < 8; k++) { c.beginPath(); c.moveTo(0, k * 30 + (t * 40) % 30); c.lineTo(w * .55, k * 30 + (t * 40) % 30); c.stroke(); }
    c.strokeStyle = '#3f8cff'; c.lineWidth = 10; c.beginPath(); c.moveTo(w * .28, h); c.quadraticCurveTo(w * .28, h * .4, w * .45, h * .2); c.stroke(); c.fillStyle = '#ffd23f'; c.beginPath(); c.arc(w * .28, h * .8, 10, 0, 7); c.fill();
    c.fillStyle = '#fff'; c.font = FONT(30); c.fillText('NAVIGATION', w * .6, 60); c.font = FONT(24, 800); c.fillStyle = '#9aa7c0'; c.fillText('Turn left in 300 m', w * .6, 100); c.fillText('Media · Climate', w * .6, 140); });
  const sc = new THREE.Mesh(new THREE.PlaneGeometry(1.6, .7), new THREE.MeshBasicMaterial({ map: ds, toneMapped: false })); sc.position.set(0, .1, .31); dash.add(sc); dash.position.set(0, 60, 0); g.add(dash);
  const tag = sign('200 MILLION+ CARS', { bg: '#ffd23f', size: 64 }); tag.scale.setScalar(.5); g.add(tag);
  const q = sign('QNX', { bg: '#14161c', fg: '#fff', size: 60 }); q.scale.setScalar(.4); q.position.set(.75, .62, .32); dash.add(q);
  return { g, bg: ['#5a8fd8', '#f2d1b0'], fog: new THREE.Fog('#f2d1b0', 15, 40), focus: V(0, 1, 0),
    cam: (u, lt) => { const z = 10 - lt * 3; if (lt < 3.8) return { p: V(3.2, 2.4, z + 4.5), l: V(0, .8, z - .5), fov: 42 }; return { p: V(0, 60.2, 2.2), l: V(0, 60.05, 0), fov: 40 }; },
    upd: lt => { const z = 10 - lt * 3; cr.position.set(0, 0, z); tag.position.set(0, 2.2, z - 1); pop(tag, lt, 1.6); ds.redraw(lt); pop(q, lt, 4.4); },
    light: (L, lt) => { if (lt >= 3.8) { L.key.position.set(3, 66, 6); L.key.target.position.set(0, 60, 0); } else { const z = 10 - lt * 3; L.key.position.set(5, 9, z + 6); L.key.target.position.set(0, 0, z); } } };
});
S('s_moral', () => {
  const g = stage('#d6cfe0', '#2a3366'); const ph = blackberry(); ph.scale.setScalar(3.2); ph.position.set(0, 1.9, 0); ph.rotation.x = -.35; g.add(ph);
  const K = []; for (let i = 0; i < 14; i++) { const k = rbox(.15, .17, .1, .03, '#2b2e35'); g.add(k); k.userData.x = ((i * 7) % 10 - 4.5) * .18; k.userData.y = 1.6 - (i % 4) * .25; K.push(k); }
  const kf = sign('THE KEYBOARD IS FOREVER?', { bg: '#ffffff', size: 54 }); kf.scale.setScalar(.48); kf.position.set(0, 3.55, -.4); g.add(kf);
  return { g, bg: ['#232c66', '#dcb3c9'], focus: V(0, 1.5, 0), cam: dolly(V(0, 2.4, 4.2), V(0, 2.1, 5.0), V(0, 1.6, 0), V(0, 1.8, 0)),
    upd: lt => { pop(kf, lt, .5); K.forEach((k, i) => { const t = Math.max(0, lt - 2 - i * .2); k.visible = t > 0; k.position.set(k.userData.x + t * .3 * (i % 2 ? 1 : -1), Math.max(.08, k.userData.y + 1.2 * t - 4.9 * t * t), .5 + t * .6); k.rotation.set(t * 4, t * 3, 0); }); } };
});
S('s_love', () => {
  const g = stage('#1c1f30', '#101320'); g.add(pedestal('#cfc8dc')); const [sp, cone] = spot(g, 0, 0, '#fff1d6', 55);
  const ph = blackberry(); ph.scale.setScalar(1.15); ph.position.y = 1.72; ph.rotation.x = -.1; g.add(ph);
  return { g, bg: ['#05070f', '#1c1830'], focus: V(0, 1.5, 0), cam: dolly(V(0, 2.1, 4.2), V(0, 2.0, 3.0), V(0, 1.7, 0), V(0, 1.75, 0)),
    light: (L, lt) => { L.hemi.intensity = .25 * (1 - ease((lt - 1.5) / 2.2)) + .05; L.key.intensity = .5; L.fill.intensity = .1; }, upd: lt => { const k = 1 - ease((lt - 1.6) / 2.2); sp.intensity = 55 * k + 4; cone.material.opacity = .07 * k; ph.rotation.y = Math.sin(lt * .6) * .2; } };
});
S('s_follow', () => {
  const g = stage('#1e2650', '#151c3f'); const a = blackberry(); a.position.set(-.55, 1.6, 0); a.rotation.y = .3; const b = touchPhone(); b.position.set(.55, 1.6, 0); b.rotation.y = -.3; g.add(a, b);
  const t = label('MORE TECH STORIES', { size: 90, fg: '#ffffff' }); t.scale.setScalar(.42); t.position.set(0, 2.7, 0); g.add(t);
  const btn = label(window.YT ? 'SUBSCRIBE' : '+  FOLLOW', { bg: window.YT ? '#ff0033' : '#fe2c55', fg: '#fff', size: 90, radius: 60 }); btn.scale.setScalar(.6); btn.position.set(0, .55, .7); g.add(btn);
  return { g, bg: ['#0c1330', '#3a2a5e'], focus: V(0, 1.5, 0), cam: dolly(V(0, 1.8, 5), V(0, 1.8, 4.4), V(0, 1.7, 0), V(0, 1.7, 0)),
    upd: lt => { pop(t, lt, .2); pop(btn, lt, .7); btn.scale.multiplyScalar(1 + Math.sin(lt * 5) * .03 * (lt > 1.2)); a.position.y = b.position.y = 1.6 + Math.sin(lt * 1.5) * .05; } };
});
