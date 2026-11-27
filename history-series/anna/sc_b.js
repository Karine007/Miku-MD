// Scenes: the bank loan, the tricks, Morocco
import { THREE, M, E, mesh, box, rbox, cyl, sph, grp, V, clamp, ease, eio, backOut, lerp, pop, dolly, canvasTex, FONT, rrect, label, sign, walk, bubble, rng, floor, wall } from './kit.js';
import { human, CAST, SKINS2, HAIRS, blink, talk, idle } from './human.js';
import { stage, room, windowPane, building, skyline, jet, stairs, car, siren, palm, pool, paper, laptop, monitor, card, terminal, note, stack, flyingNotes, counter, door, plant, lampStand, bars, sofa, bed, table, glass, frame, abstractArt, phoneChat } from './props.js';
import { tag, big, guest } from './sc_a.js';
export const SB = []; const S = (id, build) => SB.push({ id, build });
const GOLD = '#ffd23f';
const frown = (p, k = 1) => { const [l, r] = p.userData.brows; l.rotation.z = .1 + .35 * k; r.rotation.z = -.1 - .35 * k; };
const sit = p => { const { legL, legR } = p.userData; legL.rotation.x = legR.rotation.x = -1.5; p.position.y -= .32; };
function office(wc = '#3d4a63') {
  const g = room('#c9bba8', wc, { w: 10, h: 5, side: false, skirt: '#5a4a3a' });
  const w = windowPane(2.4, 1.8, '#a9c9ef', '#e8e2d8', .3); w.position.set(-2.2, 2.7, -2.92); g.add(w);
  const sk = skyline(6, 4, { hmax: 3, lit: .2 }); sk.scale.setScalar(.25); sk.position.set(-2.2, 1.85, -2.96); g.add(sk);
  return g;
}
function deskB() { return grp(box(2.2, .08, 1.0, '#5a3a28', 0, .78, 0), box(2.1, .74, .06, '#4a2e20', 0, .38, -.45), box(.06, .74, .9, '#4a2e20', -1.05, .38, 0), box(.06, .74, .9, '#4a2e20', 1.05, .38, 0)); }

// ===== BANK =====
S('e_loan', () => {
  const g = office(); const d = deskB(); g.add(d);
  const bk = CAST.banker(); bk.position.set(0, 0, -.9); sit(bk); g.add(bk);
  const a = CAST.anna(); a.position.set(-.3, 0, 1.0); a.rotation.y = Math.PI - .2; sit(a); g.add(a);
  const p = paper({ head: 'LOAN APPLICATION', title: 'AMOUNT', big: '$22,000,000', sig: true }); p.position.set(.15, 1.25, .2); p.rotation.set(-.2, .7, 0); p.scale.setScalar(.5); g.add(p);
  return { g, bg: ['#2a3550', '#9fb0cc'], focus: V(0, 1, 0), cam: dolly(V(3.2, 2.1, 1.4), V(2.7, 2.0, 1.1), V(0, 1.35, 0), V(.1, 1.35, 0)),
    upd: lt => { idle(bk, lt); blink(a, lt); talk(a, lt, lt > .5 && lt < 3.5); pop(p, lt, 1.2); bk.userData.head.rotation.x = .15; } };
});
S('e_statements', () => {
  const g = stage('#5a3a28', null); const P = [];
  for (let i = 0; i < 3; i++) { const p = paper({ head: 'BANK · ZÜRICH', headC: '#b3162e', title: 'ACCOUNT BALANCE', big: i === 1 ? '€60,000,000' : ['€24,000,000', '', '€18,500,000'][i], bigSize: 46 }); p.rotation.x = -Math.PI / 2; p.rotation.z = (i - 1) * .2; p.position.set((i - 1) * .8, .02 + i * .01, (i % 2) * .15); g.add(p); P.push(p); }
  const ch = mesh(new THREE.CylinderGeometry(.5, .5, .02, 4), '#c8202f', 1.3, .03, -.9); g.add(ch); const cr = grp(box(.5, .02, .14, '#fff', 0, .045, 0), box(.14, .02, .5, '#fff', 0, .045, 0)); cr.position.set(1.3, 0, -.9); g.add(cr);
  const t = tag('SWISS ACCOUNTS', '#ffffff', '#1d2433', .32); t.position.set(0, .9, .7); t.rotation.x = -.6; g.add(t);
  return { g, bg: ['#2a1a12', '#7a5040'], focus: V(0, 0, 0), cam: dolly(V(0, 3.4, 1.6), V(0, 3.0, 1.2), V(0, 0, -.2), V(0, 0, -.1)), shift: 120,
    upd: lt => { P.forEach((p, i) => pop(p, lt, .2 + i * .35)); pop(t, lt, 1.6); } };
});
S('e_fake', () => {
  const g = room('#2c2a35', '#1f2433', { w: 8, h: 4.5, side: false }); const d = deskB(); g.add(d);
  const a = CAST.anna(); a.position.set(0, 0, .9); a.rotation.y = Math.PI; sit(a); g.add(a);
  const lt_ = laptop(canvasTex(300, 190, (c, w, h) => { c.fillStyle = '#fff'; c.fillRect(0, 0, w, h); c.fillStyle = '#b3162e'; c.fillRect(0, 0, w, 30); c.fillStyle = '#1d2433'; c.font = FONT(26); c.fillText('€60,000,000', 40, 110); }));
  lt_.position.set(0, .82, .1); lt_.rotation.y = Math.PI; g.add(lt_);
  const pr = grp(rbox(.7, .3, .5, .05, '#d9dbe0', 0, .15, 0), box(.5, .02, .2, '#222', 0, .31, .1)); pr.position.set(-.8, .82, -.1); g.add(pr);
  const p = paper({ head: 'BANK · ZÜRICH', headC: '#b3162e', big: '€60,000,000', bigSize: 46, stamp: 'FAKE' }); p.scale.setScalar(.6); g.add(p);
  const lamp = lampStand('#ffd28a'); lamp.scale.setScalar(.5); lamp.position.set(.85, .82, -.2); g.add(lamp);
  return { g, bg: ['#0b0d18', '#262c48'], focus: V(0, 1, 0), cam: dolly(V(-.6, 2.0, -2.8), V(-.4, 1.9, -2.3), V(-.2, 1.2, .3), V(-.3, 1.25, .2)), shift: 150,
    light: L => { L.hemi.intensity = .6; L.key.intensity = 1.5; L.key.color.set('#ffd29a'); },
    upd: lt => { blink(a, lt); a.userData.armL.rotation.x = a.userData.armR.rotation.x = -1.1 + Math.sin(lt * 14) * .05; const k = ease(clamp(lt / 1)); p.position.set(-.8, 1.05 + k * .5, -.05 - k * .25); p.rotation.set(-.3, Math.PI, 0); p.userData.stamp.visible = lt > 1.3; } };
});
S('e_email', () => {
  const g = office(); const d = deskB(); g.add(d);
  const bk = CAST.banker(); bk.position.set(0, 0, .9); bk.rotation.y = Math.PI; sit(bk); g.add(bk);
  const msg = ['Dear Sir,', 'I can confirm Ms. Delvey\'s', 'assets in Switzerland.', 'All funds are available.', '', 'Best regards,', 'Peter Hennecke'];
  const tex = canvasTex(640, 400, (c, w, h, n = 0) => { c.fillStyle = '#fff'; c.fillRect(0, 0, w, h); c.fillStyle = '#e9edf4'; c.fillRect(0, 0, w, 96); c.fillStyle = '#1d2433'; c.font = FONT(26); c.fillText('From: Peter Hennecke', 24, 40); c.font = FONT(22, 800); c.fillStyle = '#5a6478'; c.fillText('Financial adviser · Germany', 24, 76);
    c.fillStyle = '#1d2433'; c.font = FONT(26, 800); let left = n; msg.forEach((l, i) => { if (left <= 0) return; c.fillText(l.slice(0, left), 30, 140 + i * 36); left -= l.length + 1; }); });
  const mo = monitor(tex, 1.6, 1.0); mo.position.set(0, 1.62, -.1); g.add(mo);
  const nm = tag('PETER HENNECKE', GOLD, '#1d2433', .26); nm.position.set(0, 2.3, -.2); g.add(nm);
  return { g, bg: ['#2a3550', '#9fb0cc'], focus: V(0, 1.5, 0), cam: dolly(V(.9, 2.3, 3.0), V(.5, 2.0, 2.2), V(0, 1.7, -.1), V(0, 1.65, -.1)),
    upd: lt => { const n = Math.floor(clamp((lt - .8) / 6) * 160); if (tex.n !== n) { tex.n = n; tex.redraw(n); } blink(bk, lt); pop(nm, lt, 4.5); } };
});
S('e_peter', () => {
  const g = stage('#2a2433', '#1a1622');
  const pm = human({ suit: '#14141a', tie: '#14141a', skin: '#2a2a33', hair: '#14141a', hairStyle: 'slick', seed: 40 }); pm.position.set(0, 0, .6); g.add(pm);
  const q = big('?', '#ffffff', .7, 150); q.position.set(0, 2.6, .8); g.add(q);
  const a = CAST.anna({ smile: true }); a.position.set(0, 0, -.6); g.add(a);
  const lp = laptop(canvasTex(300, 190, (c, w, h) => { c.fillStyle = '#e9edf4'; c.fillRect(0, 0, w, h); c.fillStyle = '#1d2433'; c.font = FONT(24); c.fillText('peter.hennecke@...', 20, 60); }));
  const tb = table(.5); tb.position.set(0, 0, 0); g.add(tb); lp.position.set(0, .8, 0); lp.rotation.y = Math.PI; lp.scale.setScalar(.7); g.add(lp);
  const eq = tag('PETER = ANNA', GOLD, '#1d2433', .36); eq.position.set(0, 2.75, 0); g.add(eq);
  return { g, bg: ['#120e18', '#3e3350'], focus: V(0, 1, 0), cam: dolly(V(0, 2.2, 4.8), V(0, 2.1, 4.0), V(0, 1.6, 0), V(0, 1.7, -.3)),
    light: L => { L.hemi.intensity = .9; },
    upd: lt => { const k = clamp((lt - 1.2) / .6); pm.scale.setScalar(Math.max(.001, 1 - ease(k))); pm.visible = k < 1; pop(q, lt, .1); q.visible = lt < 1.4; idle(a, lt); pop(eq, lt, 2.0); tb.visible = lp.visible = lt > 1.4; } };
});
S('e_overdraft', () => {
  const g = stage('#3a4256', '#262c3c');
  const p = paper({ head: 'LOAN APPLICATION', big: '$22,000,000', stamp: 'DENIED' }); p.position.set(-.55, 1.9, 0); p.rotation.z = .08; g.add(p);
  const c = card('#1d3b6e', 'A. DELVEY'); c.position.set(.55, 1.5, .3); c.rotation.set(0, -.2, -.1); g.add(c);
  const od = big('$100,000', '#7ee08a', .26); od.position.set(.5, 2.1, .4); g.add(od); const od2 = tag('OVERDRAFT', '#ffffff', '#1d2433', .3); od2.position.set(.55, .95, .4); g.add(od2);
  return { g, bg: ['#141a2a', '#4a5470'], focus: V(0, 1.5, 0), cam: dolly(V(0, 1.8, 3.8), V(0, 1.8, 3.2), V(0, 1.6, 0), V(0, 1.6, 0)),
    upd: lt => { pop(p, lt, .1); p.userData.stamp.visible = lt > .9; if (lt > .9 && lt < 1.2) p.userData.stamp.scale.setScalar(1 + (1.2 - lt) * 3); else p.userData.stamp.scale.setScalar(1); pop(c, lt, 2.5); pop(od, lt, 2.9); pop(od2, lt, 3.2); c.rotation.y = -.2 + Math.sin(lt * 1.5) * .15; } };
});
S('e_lawyers', () => {
  const g = office('#2f3a4a'); const t = grp(box(3.4, .08, 1.3, '#3a2a20', 0, .78, 0), cyl(.08, .08, .76, '#222', -1.3, .38, 0, 8), cyl(.08, .08, .76, '#222', 1.3, .38, 0, 8)); g.add(t);
  const L = [0, 1, 2].map(i => { const p = guest(i * 2 + 41, { female: false, suit: ['#20242e', '#2b2f3a', '#3a2f2a'][i], hairStyle: ['slick', 'short', 'bald'][i] }); p.position.set(-1.1 + i * 1.1, 0, -.8); sit(p); g.add(p); return p; });
  const a = CAST.anna(); a.position.set(1.9, 0, .3); a.rotation.y = -1.2; g.add(a);
  const s = tag('INVESTMENT FIRM', '#ffffff', '#1d2433', .34); s.position.set(-.6, 3.3, -2.8); g.add(s);
  const fn = flyingNotes(10, 12); fn.position.set(0, -1.6, -.3); g.add(fn);
  const lb = big('$100,000', '#7ee08a', .4); lb.position.set(0, 2.65, 0); g.add(lb); const lb2 = tag('LEGAL FEES', GOLD, '#1d2433', .28); lb2.position.set(0, 2.25, .1); g.add(lb2);
  return { g, bg: ['#1c2433', '#7a8aa8'], focus: V(0, 1, 0), cam: dolly(V(.4, 2.6, 5.4), V(.2, 2.5, 4.8), V(0, 1.5, -.2), V(0, 1.6, -.2)),
    upd: lt => { L.forEach((p, i) => { idle(p, lt + i); }); idle(a, lt); a.userData.armR.rotation.x = -.9; fn.userData.upd(lt); pop(lb, lt, .9); pop(lb2, lt, 1.3); pop(s, lt, .2); } };
});
S('e_back', () => {
  const g = office('#2f3a4a'); const dr = door('#3a2418'); dr.position.set(2.2, 0, -2.9); g.add(dr);
  const L = [0, 1].map(i => { const p = guest(i * 2 + 41, { female: false, suit: ['#20242e', '#2b2f3a'][i], hairStyle: ['slick', 'short'][i] }); p.position.set(-1.6 + i * 1.1, 0, -.4); g.add(p); return p; });
  const pr = paper({ head: 'PROOF OF FUNDS', big: '?', bigSize: 120 }); pr.scale.setScalar(.6); pr.position.set(-.7, 1.6, .3); g.add(pr);
  const a = CAST.anna(); g.add(a);
  const fn = []; for (let i = 0; i < 8; i++) { const n = note(); n.scale.setScalar(.6); g.add(n); fn.push(n); }
  const lb = big('$55,000', '#7ee08a', .4); lb.position.set(.8, 2.6, -.5); g.add(lb); const lb2 = tag('BACK TO ANNA', GOLD, '#1d2433', .28); lb2.position.set(.8, 2.2, -.4); g.add(lb2);
  return { g, bg: ['#1c2433', '#7a8aa8'], focus: V(0, 1, 0), cam: dolly(V(0, 2.4, 5.6), V(.3, 2.4, 5.0), V(0, 1.5, -.6), V(.3, 1.6, -.8)),
    upd: lt => { L.forEach((p, i) => { idle(p, lt + i); frown(p, .6); }); pop(pr, lt, .2); L[0].userData.armR.rotation.x = -1.2;
      const k = clamp((lt - 1.4) / 3); a.position.set(lerp(.6, 2.1, ease(k)), 0, lerp(.6, -2.4, ease(k))); a.rotation.y = Math.PI - .5; if (k > 0 && k < 1) walk(a, lt, 7, .4); else idle(a, lt); a.visible = k < .98;
      fn.forEach((n, i) => { const t = clamp((lt - 3 - i * .12) / 1.2); n.visible = t > 0 && t < 1; n.position.set(lerp(-1, 1.6, t), 1.4 + Math.sin(t * Math.PI) * 1, lerp(0, -1.8, t)); n.rotation.set(t * 6, t * 3, 0); });
      pop(lb, lt, 3.4); pop(lb2, lt, 3.7); } };
});

// ===== TRICKS =====
S('f_bills', () => {
  const g = stage('#cbb9a6', '#4a3a55'); const a = CAST.anna(); a.position.set(0, 0, 0); g.add(a);
  const B = []; const r = rng(17); for (let i = 0; i < 26; i++) { const p = paper({ head: 'INVOICE', headC: ['#b3162e', '#1d3b6e', '#1f7a43'][i % 3], big: '$' + (1 + Math.floor(r() * 9)) + ',' + (100 + Math.floor(r() * 899)), bigSize: 50 }); p.scale.setScalar(.45); p.userData.x = (r() - .5) * 3; p.userData.z = (r() - .5) * 1.6 + .3; p.userData.rz = r() * 6; p.userData.d = i * .07; g.add(p); B.push(p); }
  return { g, bg: ['#2d2438', '#c39aa6'], focus: V(0, 1, 0), cam: dolly(V(0, 2.3, 4.6), V(0, 2.2, 4.0), V(0, 1.3, 0), V(0, 1.3, 0)),
    upd: lt => { idle(a, lt); frown(a, .4); B.forEach((p, i) => { const t = clamp((lt - p.userData.d) / .6); p.visible = lt > p.userData.d; p.position.set(p.userData.x, lerp(4, .03 + i * .004, ease(t)), p.userData.z); p.rotation.set(-Math.PI / 2 * ease(t), 0, p.userData.rz); }); } };
});
S('f_soho', () => {
  const g = room('#d9cbb8', '#a9786a', { w: 9, h: 5, skirt: '#7a5a4a', side: false }); const b = bed('#f4f1ea', '#3a2a22'); b.position.set(-1, 0, -1.4); g.add(b);
  const a = CAST.anna({ dress: '#f4f1ea', heels: false, glasses: '#111' }); a.position.set(-.7, 0, -.15); sit(a); a.position.y += .12; a.rotation.y = .3; g.add(a); const ph = rbox(.08, .16, .02, .01, '#111', 0, -.62, .06); a.userData.armR.add(ph);
  const cart = grp(box(.9, .05, .6, '#ddd', 0, .8, 0), box(.9, .05, .6, '#ddd', 0, .3, 0), cyl(.25, .25, .25, '#d8d8de', 0, .95, 0, 18), sph(.24, '#e2e2e8', 0, 1.08, 0, 16)); cart.children.at(-1).scale.y = .6; g.add(cart);
  const s = sign('SOHO', { bg: '#1d2433', fg: GOLD, size: 70 }); s.scale.setScalar(.45); s.position.set(1.2, 3.3, -2.9); g.add(s);
  const T = ['ROOM SERVICE', 'SPA', 'ON MY ROOM'].map((t, i) => { const l = tag(t, '#ffffff', '#1d2433', .3); l.position.set(.9, 2.4 - i * .4, -.4); g.add(l); return l; });
  return { g, bg: ['#3a2a2a', '#d8a890'], focus: V(0, 1, 0), cam: dolly(V(1.2, 2.6, 4.4), V(.9, 2.5, 3.8), V(0, 1.2, -.8), V(.1, 1.3, -.8)),
    upd: lt => { idle(a, lt); a.userData.armR.rotation.x = -1.9; a.userData.head.rotation.z = .25; cart.position.set(lerp(2.4, 1.1, ease(lt / 1.2)), 0, .3); T.forEach((l, i) => pop(l, lt, 1.2 + i * .6)); } };
});
S('f_tab', () => {
  const g = room('#d8c8b8', '#6a4a3a', { w: 9, h: 5, side: false }); const c = counter(3.2); c.position.set(0, 0, -.6); g.add(c);
  const cl = human({ female: true, suit: '#2b2f3d', tie: '#2b2f3d', skin: SKINS2[2], hair: HAIRS.black, hairStyle: 'bun', seed: 50 }); cl.position.set(-.55, 0, -1.4); g.add(cl);
  const tex = canvasTex(300, 420, (cx, w, h, n = 0) => { cx.fillStyle = '#fbfaf6'; cx.fillRect(0, 0, w, h); cx.fillStyle = '#1d2433'; cx.font = FONT(28); cx.textAlign = 'center'; cx.fillText('ROOM 1408', w / 2, 50); cx.font = FONT(22, 800); cx.fillStyle = '#8a8f9c'; for (let i = 0; i < 6; i++) cx.fillRect(30, 80 + i * 30, 240, 10); cx.fillStyle = '#d3263a'; cx.font = FONT(58); cx.fillText('$' + n.toLocaleString('en-US'), w / 2, 340); });
  const rc = new THREE.Mesh(new THREE.PlaneGeometry(.75, 1.05), new THREE.MeshStandardMaterial({ map: tex, roughness: .9 })); rc.position.set(.5, 1.7, -.5); rc.rotation.y = -.15; g.add(rc);
  return { g, bg: ['#2a1d18', '#a7806a'], focus: V(0, 1.4, -1), cam: dolly(V(.2, 2.0, 3.6), V(0, 1.9, 3.0), V(0, 1.7, -.8), V(0, 1.7, -.8)),
    upd: lt => { idle(cl, lt); frown(cl, .7); cl.userData.armR.rotation.x = -1.3; const n = Math.round(30000 * ease(clamp((lt - .3) / 2.4)) / 50) * 50; if (tex.n !== n) { tex.n = n; tex.redraw(n); } pop(rc, lt, .1); } };
});
S('f_checks', () => {
  const g = room('#d8d0c4', '#33405a', { w: 10, h: 5, side: false }); const c = counter(3.2, '#3d4a63', '#e9e2d4'); c.position.set(0, 0, -.4); g.add(c);
  const tl = human({ suit: '#2b3a55', tie: '#c9a54b', skin: SKINS2[1], hair: HAIRS.brown, hairStyle: 'short', seed: 51 }); tl.position.set(.3, 0, -1.2); g.add(tl);
  const a = CAST.anna(); a.position.set(-.8, 0, .6); a.rotation.y = Math.PI - .5; g.add(a);
  const ch = [0, 1, 2].map(i => { const p = paper({ head: 'CHECK', headC: '#1f7a43', big: '$' + ['60,000', '50,000', '50,000'][i], bigSize: 52, stamp: 'BOUNCED' }); p.scale.set(.6, .3, .6); p.rotation.x = -Math.PI / 2; p.position.set(-.3 + i * .35, 1.13 + i * .003, -.3); g.add(p); return p; });
  const sk = stack(10); sk.position.set(.6, 1.12, -.5); g.add(sk);
  const l1 = big('$160,000 IN', '#ffffff', .34); l1.position.set(0, 2.85, -.4); g.add(l1);
  const l2 = big('$70,000 OUT', '#7ee08a', .34); l2.position.set(0, 2.45, -.4); g.add(l2);
  return { g, bg: ['#1c2433', '#7a8aa8'], focus: V(0, 1, 0), cam: dolly(V(1.4, 2.7, 5.4), V(1.0, 2.6, 4.8), V(-.1, 1.5, -.3), V(-.1, 1.5, -.3)),
    upd: lt => { idle(a, lt); idle(tl, lt); ch.forEach((p, i) => { pop(p, lt, .3 + i * .3); const b = lt > 4.6 ? Math.abs(Math.sin((lt - 4.6) * 6 + i)) * .3 * Math.max(0, 1 - (lt - 4.6) / 2.5) : 0; p.position.y = 1.13 + b; p.userData.stamp.visible = lt > 4.6; p.userData.stamp.scale.setScalar(1 / .6 * .6); });
      pop(l1, lt, 1.0); pop(l2, lt, 2.8); const k = ease(clamp((lt - 2.6) / 1)); sk.position.set(lerp(.6, -.5, k), 1.12, lerp(-.5, -.1, k)); } };
});
S('f_jet', () => {
  const g = new THREE.Group(); const j = jet(); g.add(j); const C = []; const r = rng(31);
  for (let i = 0; i < 26; i++) { const c = sph(1 + r() * 1.4, '#ffffff', (r() - .5) * 30, -3 - r() * 2, (r() - .5) * 16, 10); c.scale.y = .45; g.add(c); C.push(c); }
  const om = tag('OMAHA', '#ffffff', '#1d2433', .4); om.position.set(0, 1.6, 0); g.add(om);
  const inv = paper({ head: 'PRIVATE JET', big: '$35,000', stamp: 'UNPAID' }); inv.scale.setScalar(1); inv.position.set(.3, 1.2, 2.4); inv.rotation.y = .4; g.add(inv);
  return { g, bg: ['#5a7fc8', '#f8d2b0'], focus: V(0, 0, 0), cam: dolly(V(3.6, 1.4, 6.2), V(2.4, 1.2, 5.6), V(0, .4, 0), V(0, .5, 0)),
    upd: lt => { j.position.y = Math.sin(lt * 1.3) * .1; j.rotation.z = Math.sin(lt) * .03; C.forEach((c, i) => { c.position.x = ((c.position.x + 15 - .12) % 30 + 30) % 30 - 15; }); pop(om, lt, .5); om.visible = om.visible && lt < 3.4; pop(inv, lt, 3.5); inv.userData.stamp.visible = lt > 4.6; } };
});
S('f_trick', () => {
  const g = stage('#c9bcd0', '#2a2f55');
  const T = [['ACT RICH', GOLD], ['MOVE FAST', '#4fd1ff'], ['BE GONE', '#ff7a8a']].map(([t, c], i) => { const s = tag(`${i + 1}. ${t}`, c, '#1d2433', .42); s.position.set(-.1, 3.0 - i * .5, -1); g.add(s); return s; });
  const a = CAST.anna(); g.add(a); const cs = rbox(.45, .6, .22, .05, '#7b4a2c', 0, 0, 0); g.add(cs);
  return { g, bg: ['#1d2244', '#8f84b8'], focus: V(0, 1, 0), cam: dolly(V(0, 2.4, 6.0), V(0, 2.4, 5.6), V(0, 1.7, 0), V(0, 1.7, 0)),
    upd: lt => { T.forEach((s, i) => pop(s, lt, .4 + i * 1.6)); const k = clamp((lt - 3.0) / 3.4); a.position.set(lerp(-1.0, 3.4, k), 0, .4); a.rotation.y = k > 0 ? Math.PI / 2 : .3; if (k > 0) walk(a, lt, 8, .45); else idle(a, lt); cs.position.set(a.position.x + .05, .35, .7); } };
});

// ===== MOROCCO =====
S('g_invite', () => {
  const g = stage('#c9c2b8', '#e9e2d8', { z: -4 }); const w = windowPane(8, 2.6, '#bfe0ff', '#d8d2c8', .2); w.position.set(0, 2.2, -3.9); g.add(w);
  const j = jet(); j.scale.setScalar(.6); j.position.set(3, 1.8, -6.5); g.add(j);
  const brd = canvasTex(500, 200, (c, w, h) => { c.fillStyle = '#121418'; c.fillRect(0, 0, w, h); c.fillStyle = '#ffd23f'; c.font = FONT(40); c.fillText('DEPARTURES', 24, 52); c.fillStyle = '#fff'; c.font = FONT(36, 800); c.fillText('MARRAKECH    GATE 7', 24, 120); c.fillStyle = '#7ee08a'; c.fillText('BOARDING', 24, 175); });
  const bd = new THREE.Mesh(new THREE.PlaneGeometry(2.2, .88), new THREE.MeshBasicMaterial({ map: brd, toneMapped: false })); bd.position.set(0, 4.0, -3.85); g.add(bd);
  const P = [CAST.anna(), human({ skin: SKINS2[3], hair: HAIRS.black, hairStyle: 'bald', top: '#2a9d8f', bottom: '#222', seed: 60 }), human({ skin: SKINS2[1], hair: HAIRS.brown, hairStyle: 'curly', top: '#5a5a66', bottom: '#2d3446', beard: true, seed: 61 }), CAST.rachel()];
  const N = ['ANNA', 'TRAINER', 'VIDEOGRAPHER', 'RACHEL']; const L = [];
  const cam_ = grp(box(.25, .18, .3, '#222', 0, 0, 0), cyl(.07, .07, .14, '#111', 0, 0, .2, 12)); cam_.children[1].rotation.x = Math.PI / 2;
  P.forEach((p, i) => { p.position.set(-1.8 + i * 1.2, 0, 0); g.add(p); const l = tag(N[i], i === 3 ? GOLD : '#ffffff', '#1d2433', .38); l.position.set(-1.8 + i * 1.2, 2.45 + (i % 2) * .25, .1); g.add(l); L.push(l); });
  cam_.position.set(.05, -.62, .15); P[2].userData.armR.add(cam_);
  return { g, bg: ['#9fc3e8', '#eef4fb'], focus: V(0, 1, 0), cam: dolly(V(0, 2.5, 8.2), V(.2, 2.4, 7.4), V(0, 1.7, 0), V(0, 1.8, -.4)),
    upd: lt => { P.forEach((p, i) => idle(p, lt + i)); P[2].userData.armR.rotation.x = -1.2; L.forEach((l, i) => pop(l, lt, 1.5 + i * 1.0)); pop(bd, lt, .3); j.position.x = 3 - Math.max(0, lt - 6) * 1.2; j.position.y = 1.8 + Math.max(0, lt - 6) * .3; } };
});
S('g_rachel', () => {
  const g = stage('#3a3546', '#1d1a26'); const r = CAST.rachel(); r.position.set(0, 0, .4); g.add(r);
  const t = tag('RACHEL\nVANITY FAIR PHOTO EDITOR', GOLD, '#1d2433', .2); t.position.set(0, 1.3, .9); g.add(t);
  return { g, bg: ['#141220', '#4a3f5e'], focus: V(0, 1.8, 0), cam: dolly(V(.2, 2.0, 2.9), V(0, 1.95, 2.5), V(0, 1.85, 0), V(0, 1.85, 0)),
    light: L => { L.hemi.intensity = .9; L.key.intensity = 2.8; }, upd: lt => { idle(r, lt); pop(t, lt, .1); } };
});
function villa() {
  const g = stage('#e6c9a2', null, { w: 30, d: 24 }); const pl = pool(4.2, 2.4); pl.position.set(0, 0, .2); g.add(pl);
  const vw = new THREE.Group(); vw.add(box(10, 4, .6, '#f0d7b5', 0, 2, -3.2));
  for (let i = 0; i < 5; i++) { const ar = grp(box(1.1, 1.8, .1, '#3a6b8a', 0, 1.1, 0), cyl(.55, .55, .1, '#3a6b8a', 0, 2.0, 0, 18)); ar.children[1].rotation.x = Math.PI / 2; ar.position.set(-3.6 + i * 1.8, 0, -2.86); vw.add(ar); }
  vw.add(box(10.4, .3, .8, '#d9b48a', 0, 4.1, -3.2)); g.add(vw);
  for (const [x, z] of [[-3.4, -1.6], [3.4, -1.6], [-4.2, 1.5], [4.4, 1.2]]) { const p = palm(3.4, x * 3); p.position.set(x, 0, z); g.add(p); }
  for (let i = 0; i < 3; i++) { const lg = grp(box(.6, .12, 1.6, '#ffffff', 0, .35, 0), box(.6, .5, .12, '#ffffff', 0, .55, -.75)); lg.children[1].rotation.x = -.5; lg.position.set(-1.8 + i * 1.8, 0, 2.2); g.add(lg); }
  return { g, water: pl.userData.water };
}
S('g_villa', () => {
  const { g, water } = villa(); const t = tag('MARRAKECH', '#ffffff', '#1d2433', .36); t.position.set(0, 3.0, -1.5); g.add(t);
  const pr = big('$7,000 / NIGHT', GOLD, .55); pr.position.set(0, 2.3, 0); g.add(pr);
  return { g, bg: ['#f29a5a', '#ffe3b8'], focus: V(0, 1, -1), cam: dolly(V(-1.6, 3.6, 8.6), V(.6, 3.0, 7.4), V(0, 1.4, -1), V(0, 1.6, -1)),
    light: L => { L.key.color.set('#ffd2a0'); L.key.intensity = 2.8; }, upd: lt => { pop(t, lt, .3); pop(pr, lt, 3.4); water.material.emissiveIntensity = .3 + Math.sin(lt * 2) * .08; } };
});
S('g_onher', () => {
  const { g } = villa(); const t = table(.7); t.position.set(0, 0, 2.4); g.add(t);
  for (let i = 0; i < 4; i++) { const pl = cyl(.16, .12, .03, '#fff', Math.cos(i * 1.57) * .4, .81, 2.4 + Math.sin(i * 1.57) * .4, 16); g.add(pl); g.add(sph(.08, ['#f5a623', '#e8505b', '#7ed321', '#ffca28'][i], Math.cos(i * 1.57) * .4, .87, 2.4 + Math.sin(i * 1.57) * .4, 8)); }
  const a = CAST.anna({ dress: '#f4f1ea', smile: true, glasses: '#111', shades: true }); a.position.set(-.9, 0, 2.6); a.rotation.y = .9; g.add(a);
  const r = CAST.rachel({ smile: true }); r.position.set(.95, -.32, 2.2); r.rotation.y = -.9; r.userData.legL.rotation.x = r.userData.legR.rotation.x = -1.5; g.add(r);
  const bb = bubble("It's all on me!", '#ffffff', '#1d2433', 1.4); bb.scale.setScalar(.5); bb.position.set(-.45, 2.5, 2.7); g.add(bb);
  return { g, bg: ['#f29a5a', '#ffe3b8'], focus: V(0, 1, 2), cam: dolly(V(.3, 2.2, 6.2), V(.2, 2.1, 5.6), V(0, 1.4, 2.4), V(0, 1.5, 2.4)),
    light: L => { L.key.color.set('#ffd2a0'); }, upd: lt => { idle(a, lt); idle(r, lt); talk(a, lt, lt < 1.8); a.userData.armR.rotation.x = -1; a.userData.armR.rotation.z = .6; pop(bb, lt, .2); } };
});
S('g_declined', () => {
  const g = stage('#b9a58a', '#5a4030'); const t = terminal('wait'); t.position.set(0, .4, 0); t.scale.setScalar(1.4); g.add(t);
  const c = card('#1d1f26', 'A. DELVEY'); c.scale.setScalar(.7); g.add(c);
  return { g, bg: ['#3a2418', '#c8a07a'], focus: V(0, 1, 0), cam: dolly(V(.3, 1.6, 2.6), V(.1, 1.55, 2.1), V(0, 1.25, 0), V(0, 1.3, 0)),
    upd: lt => { const s = lt < 1.2 ? 'wait' : 'no'; if (t.userData.tex.s !== s) { t.userData.tex.s = s; t.userData.tex.redraw(s); } const k = ease(clamp(lt / .7)); c.position.set(-.35, lerp(2.8, 2.05, k), .3); c.rotation.set(-.2, 0, .25); } };
});
S('g_ask', () => {
  const g = room('#d9b48a', '#f0d7b5', { w: 10, h: 5, side: false }); for (let i = 0; i < 3; i++) { const ar = grp(box(1.1, 2.2, .1, '#3a6b8a', 0, 1.3, 0)); ar.position.set(-2.4 + i * 2.4, 0, -2.9); g.add(ar); }
  const M_ = [0, 1].map(i => { const p = human({ suit: ['#2a2a30', '#3a2f2a'][i], tie: '#7a1c2b', skin: SKINS2[2 + i], hair: HAIRS.black, hairStyle: i ? 'bald' : 'slick', stache: true, seed: 70 + i }); p.position.set(-1.9 + i * .9, 0, -.9); p.rotation.y = .5; g.add(p); return p; });
  const a = CAST.anna(); a.position.set(.5, 0, .2); g.add(a); const r = CAST.rachel(); r.position.set(1.6, 0, .4); r.rotation.y = -.6; g.add(r);
  const bb = bubble('Could you put it\non your card?\nJust for now.', '#ffffff', '#1d2433', 1.5); bb.scale.setScalar(.75); bb.position.set(.9, 2.75, .3); g.add(bb);
  const c = card('#c9a54b', 'R. WILLIAMS'); c.scale.setScalar(.35); g.add(c);
  return { g, bg: ['#5a3a28', '#e8c49a'], focus: V(0, 1, 0), cam: dolly(V(-.2, 2.4, 6.2), V(.4, 2.2, 5.0), V(-.2, 1.6, -.2), V(.6, 1.7, 0)),
    upd: lt => { M_.forEach((p, i) => { idle(p, lt + i); frown(p, 1); p.userData.armR.rotation.x = i ? 0 : -1.0; }); idle(a, lt); idle(r, lt);
      a.rotation.y = lt < 2.2 ? -.6 : lerp(-.6, .9, ease((lt - 2.2) / .6)); talk(a, lt, lt > 2.8 && lt < 5.2); pop(bb, lt, 2.9); bb.visible = bb.visible && lt < 5.6;
      const k = ease(clamp((lt - 5.6) / .8)); c.visible = lt > 5.4; r.userData.armR.rotation.x = lt > 5.4 ? -1.1 : 0; c.position.set(lerp(1.3, .9, k), 1.4, .9); c.rotation.set(0, -.6, 0); frown(r, lt > 3 ? .5 : 0); } };
});
S('g_bill', () => {
  const g = stage('#3a3546', '#1d1a26'); const r = CAST.rachel(); r.position.set(-.7, 0, .4); r.rotation.y = .4; g.add(r);
  const tex = canvasTex(300, 760, (c, w, h) => { c.fillStyle = '#fbfaf6'; c.fillRect(0, 0, w, h); c.fillStyle = '#1d2433'; c.font = FONT(28); c.textAlign = 'center'; c.fillText('HOTEL · MARRAKECH', w / 2, 50); c.font = FONT(20, 800); c.fillStyle = '#7a8090'; const it = ['VILLA', 'VILLA', 'VILLA', 'DINNER', 'SPA', 'GUIDE', 'BREAKFAST', 'DINNER', 'VILLA', 'TRANSFER']; it.forEach((t, i) => { c.textAlign = 'left'; c.fillText(t, 30, 100 + i * 46); c.textAlign = 'right'; c.fillText('$' + (500 + i * 437 % 6000).toLocaleString('en-US'), w - 30, 100 + i * 46); }); c.textAlign = 'center'; c.fillStyle = '#d3263a'; c.font = FONT(56); c.fillText('$62,000', w / 2, 700); });
  const rc = new THREE.Mesh(new THREE.PlaneGeometry(.9, 2.28), new THREE.MeshStandardMaterial({ map: tex, roughness: .9 })); rc.position.set(.45, 1.6, .2); g.add(rc);
  const t = tag("MORE THAN RACHEL'S YEARLY PAY", GOLD, '#1d2433', .24); t.position.set(0, .55, 1.0); g.add(t);
  return { g, bg: ['#141220', '#4a3f5e'], focus: V(0, 1.5, 0), cam: dolly(V(0, 2.0, 4.2), V(0, 1.9, 3.6), V(0, 1.5, 0), V(0, 1.5, 0)),
    upd: lt => { idle(r, lt); frown(r, .8); r.userData.mouth.scale.set(1, 2.2, 1); const k = ease(clamp(lt / 1.6)); rc.scale.set(1, Math.max(.01, k), 1); rc.position.y = 2.74 - 1.14 * k; pop(t, lt, 2.6); } };
});
