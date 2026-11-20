// 72 scenes for the Elizabeth Holmes episode (ids match anchors.json).
import { THREE, V, M, B, G, at, box, rbox, cyl, sph, capsule, panel, textTex, canvasTex, flat, sign, tag, pop, person, sit, pose, idle, talk, walk, wave, blink, clock, spinClock, desk, chair, plant, car, edison, syringe, tubeRack, drop, money, bill, newspaper, heart, laptop, frame, lerp, ease, clamp, backOut, FONT, rr, SKIN, wrap } from './kit.js';
import { dolly, holmes, kidLiz, sunny, erika, tyler, reporter, father, mother, oldMan, extra, labTech, office, lab, street, kitchen, court, stage, studio, campus, clinic, boardroom, pharmacy, hq, bedroom, prison, gov, newsroom, secretLab, closet, dark } from './sets.js';

export const SCENES = []; const S = (id, build) => SCENES.push({ id, build });
const IN = ['#cfd8ea', '#ece9ef', '#f6efe8'], OUT = ['#9fc3ec', '#cfe0f2', '#f2ede6'], NIGHT = ['#0f1630', '#22284a', '#3b3460'], PURPLE = ['#2a1f44', '#3a2b5c', '#4a3a6a'];
const GOLD = '#c9902a', RED = '#d63a3a', BLUE = '#2f7de1', PINK = '#d63a7a', GREEN = '#2e8a4a', DARK = '#3a2f5e';
function screenSwap(e, plan) { let last = -1; return lt => { let k = -1; plan.forEach((p, i) => { if (lt >= p[0]) k = i; }); if (k !== last && k >= 0) { last = k; e.userData.setScreen(plan[k][1], plan[k][2]); } }; }
function spotOn(g, x, y, z, tx, ty, tz, c = '#fff4e0', i = 30) { const s = new THREE.SpotLight(c, i, 18, .45, .5); s.position.set(x, y, z); s.target.position.set(tx, ty, tz); g.add(s, s.target); return s; }
function pedestal(g, x = 0, z = 0) { g.add(cyl(.55, .6, .9, '#efe9f2', x, .45, z, 32)); }
function finger(skin = SKIN[0]) { const f = G(); const c = new THREE.Mesh(new THREE.CapsuleGeometry(.09, .55, 6, 16), M(skin)); c.rotation.z = Math.PI / 2; f.add(c); const nail = sph(.06, '#f6dccb', -.32, .055, 0, 1, .4, .9, 12); f.add(nail); return f; }
function bulb() { const g = G(sph(.18, '#fff3a8', 0, 0, 0), cyl(.08, .08, .12, '#b9bcc2', 0, -.2, 0, 12)); g.children[0].material = B('#fff3a8'); return g; }
function globe() { const t = canvasTex(1024, 512, (c, w, h) => { c.fillStyle = '#5aa0d8'; c.fillRect(0, 0, w, h); c.fillStyle = '#7cc46a'; [[180, 150, 120, 90], [260, 330, 70, 110], [520, 140, 90, 60], [560, 300, 80, 110], [760, 170, 150, 80], [840, 360, 60, 40]].forEach(([x, y, rx, ry]) => { c.beginPath(); c.ellipse(x, y, rx, ry, 0, 0, 7); c.fill(); }); }); return new THREE.Mesh(new THREE.SphereGeometry(1, 48, 32), M('#fff', { map: t })); }
function boxProp(c = '#c9a27a') { return G(box(.5, .35, .4, c, 0, .175, 0), box(.52, .02, .1, '#b08a62', 0, .35, 0)); }
function counterTex(val) { return textTex([[val, 150, '#ffffff', 200]], { bg: '#1e2433', w: 1200, h: 400, draw: (c, w, h) => { c.fillStyle = '#e8c46a'; c.font = FONT(56, 900); c.textAlign = 'center'; c.fillText("ELIZABETH HOLMES' FORTUNE", w / 2, 70); } }); }
const fmt = n => '$' + Math.round(n).toLocaleString('en-US');

// ================= HOOK =================
S('h_drop', () => {
  const g = campus(); const h = holmes({ bag: '#c0303a' }); g.add(h);
  return { g, sky: OUT, pill: 'STANFORD DROPOUT', focus: V(0, 1, -6), cam: dolly(V(1.8, 1.5, 1.5), V(1.1, 1.45, .2), V(0, 1.8, -9), V(0, 1.5, -5)),
    upd: lt => { const k = clamp(lt / 5.6); h.position.set(.3, 0, lerp(-11, -4.2, k)); walk(h, lt, 7, .42); } };
});
S('h_finger', () => {
  const g = lab({ screen: 'READY', screenCol: '#7fd0ff' }); const e = g.userData.edison; e.position.set(-.3, .96, -2.6);
  const f = finger(); f.position.set(.75, 1.42, -2.25); g.add(f); const d = drop(.55); g.add(d); const cart = G(rbox(.18, .1, .12, .02, '#f4f4f4', 0, 0, 0), cyl(.02, .02, .12, '#d42a3a', 0, .1, 0, 10)); cart.position.set(.15, 1.01, -2.25); g.add(cart);
  const sw = screenSwap(e, [[0, 'READY', '#7fd0ff'], [2.6, 'TESTING...', '#f0c35a'], [4.2, '200+ TESTS', '#7ae08a']]);
  return { g, sky: IN, pill: 'ONE TINY DROP', pillAt: 1, focus: V(0, 1, -2.4), cam: dolly(V(.9, 1.55, .2), V(.6, 1.5, -.2), V(.1, 1.3, -2.4), V(-.05, 1.28, -2.5), 40),
    upd: lt => { const k = clamp((lt - 1.2) / .8); d.position.set(.38, lerp(1.36, 1.1, k * k), -2.25); d.visible = lt < 2.1; d.scale.setScalar(1); sw(lt); } };
});
S('h_needle', () => {
  const g = clinic(); const sy = syringe(1.6); sy.rotation.z = .5; sy.position.set(0, 1.5, -1.2); g.add(sy);
  const x = tag('✕', { bg: RED, fg: '#fff', h: .45 }); x.position.set(.75, 1.9, -.9); g.add(x); const ck = clock(1.8, 1.6, -1.5, .3); g.add(ck);
  return { g, sky: IN, pill: 'NO NEEDLES · NO WAITING', pillAt: .3, focus: V(0, 1.4, -1.2), cam: dolly(V(.4, 1.6, 2.2), V(.2, 1.55, 1.6), V(.4, 1.5, -1.2), V(.5, 1.5, -1.2)),
    upd: lt => { sy.rotation.y = lt * .6; pop(x, lt, .25); spinClock(ck, lt, 0); x.material.opacity = 1; } };
});
S('h_money', () => {
  const g = office(); const h = holmes(); g.add(at(h, .3, 0, -2.0)); pose(h, [0, 0, .08], [0, 0, -.08]);
  const stacks = []; for (let i = 0; i < 9; i++) { const m = money(1, -.6 + (i % 3) * .55, -1.4 + Math.floor(i / 3) * .25); m.position.y = .79; m.scale.set(.6, 1, .6); g.add(m); stacks.push(m); }
  return { g, sky: IN, pill: 'ALMOST $1 BILLION', pillColor: GREEN, focus: V(0, 1, -1.5), cam: dolly(V(.2, 1.7, 1.8), V(.3, 1.6, 1.2), V(.1, 1.2, -1.6), V(.2, 1.25, -1.7)),
    upd: lt => { idle(h, lt); stacks.forEach((m, i) => { const k = clamp((lt - i * .2) / .4); m.scale.set(.6, Math.max(.001, backOut(k)) * (1 + (i % 4)), .6); m.visible = k > 0; }); } };
});
S('h_worth', () => {
  const g = hq();
  return { g, sky: OUT, pill: '$9 BILLION', pillColor: GREEN, pillAt: .3, focus: V(0, 3, -3), sun: [-6, 12, 8], cam: dolly(V(-2, 1.6, 16), V(-.5, 2.4, 13), V(0, 4.5, -3), V(0, 4.2, -3)) };
});
S('h_jobs', () => {
  const g = stage(); const h = holmes(); g.add(at(h, .4, .62, -3.6, -.1)); pose(h, [0, 0, .08], [-1.1, 0, -.4], 0, -1);
  return { g, sky: PURPLE, dim: .45, pill: 'THE NEXT STEVE JOBS?', pillColor: '#8a3fd1', focus: V(0, 1, -3), cam: dolly(V(0, 2.6, 6.4), V(.2, 2.4, 5.2), V(0, 2.4, -4), V(.2, 2.2, -4), 42),
    upd: lt => { idle(h, lt); talk(h, lt); } };
});
S('h_problem', () => {
  const g = dark('#241f38'); pedestal(g); const e = edison(); e.position.set(0, .9, 0); g.add(e); spotOn(g, 0, 5, 2, 0, 1, 0, '#fff4e0', 60);
  const sw = screenSwap(e, [[0, 'EDISON', '#7fd0ff'], [2.2, 'ERROR', '#ff5a5a']]);
  return { g, sky: PURPLE, dim: .35, pill: 'IT DID NOT WORK', pillColor: RED, pillAt: 2.4, focus: V(0, 1, 0), cam: dolly(V(.9, 1.7, 3.2), V(.4, 1.5, 2.0), V(0, 1.3, 0), V(0, 1.35, 0)),
    upd: lt => { sw(lt); e.rotation.y = lt > 2.2 ? Math.sin(lt * 40) * .02 * clamp(3 - lt) : 0; } };
});
S('h_truth', () => {
  const g = lab(); const a = erika(), b = tyler(); g.add(at(a, -.6, 0, -1.2, .5), at(b, .6, 0, -1.2, -.5));
  return { g, sky: IN, pill: 'TWO YOUNG EMPLOYEES', pillColor: BLUE, focus: V(0, 1, -1.2), cam: dolly(V(-.8, 1.6, 2.4), V(.3, 1.6, 1.8), V(0, 1.45, -1.2)),
    upd: lt => { idle(a, lt); idle(b, lt); const k = ease((lt - 2.5) / .8); a.rotation.y = lerp(.5, .1, k); b.rotation.y = lerp(-.5, -.1, k); talk(a, lt, lt < 2.4); talk(b, lt, lt > 2.4 && lt < 4); } };
});
S('h_title', () => {
  const g = dark('#2c2350'); const h = holmes(); g.add(at(h, 0, 0, 0)); spotOn(g, 0, 6, 3, 0, 1, 0, '#ffe9f4', 70);
  const e = edison(); e.scale.setScalar(.7); e.position.set(1.0, 0, -.4); e.rotation.y = -.4; g.add(e);
  return { g, sky: PURPLE, dim: .5, title: ['ELIZABETH HOLMES', 'RISE & RUIN'], focus: V(0, 1, 0), cam: dolly(V(-1.2, 1.2, 4.2), V(1.0, 1.1, 4.0), V(0, 1.6, 0), V(.2, 1.6, 0)),
    upd: lt => idle(h, lt) };
});

// ================= CHILDHOOD =================
S('c_dc', () => {
  const g = street(); const k = kidLiz(), m = mother(); g.add(k, m);
  return { g, sky: OUT, pill: 'WASHINGTON, D.C. · 1990s', pillColor: BLUE, pillAt: .2, focus: V(0, 1, 2), sun: [-6, 12, 8], cam: dolly(V(-1, 1.8, 9), V(.5, 1.7, 8), V(0, 1.6, 0)),
    upd: lt => { const x = lerp(-3, 0, clamp(lt / 1.9)); k.position.set(x, 0, 4.2); m.position.set(x - .7, 0, 4.0); k.rotation.y = m.rotation.y = Math.PI / 2; walk(k, lt, 8, .4); walk(m, lt, 6.5, .35); } };
});
S('c_girl', () => {
  const g = bedroom(); const k = kidLiz(); g.add(sit(at(k, -1.2, 0, -1.7, Math.PI), .4)); g.add(chair(-1.2, -1.75, Math.PI, '#e6a0bf'));
  const book = G(box(.3, .02, .22, '#5c79c9', 0, 0, 0)); book.position.set(-1.2, .8, -2.2); g.add(book);
  k.rotation.y = 0; k.position.z = -1.55; pose(k, [-.9, 0, .2], [-.9, 0, -.2], -.6, -.6);
  return { g, sky: IN, name: ['YOUNG ELIZABETH', 'QUIET AND SERIOUS'], focus: V(-1, 1, -2), cam: dolly(V(.6, 1.4, 1.4), V(.2, 1.3, 1.0), V(-1.2, 1.0, -1.9)),
    upd: lt => { blink(k, lt); k.userData.head.rotation.x = .25 + Math.sin(lt) * .03; } };
});
S('c_relative', () => {
  const g = kitchen(); const k = kidLiz(), a = extra(2, { hairStyle: 'bob', top: '#e2b84a', glasses: '#333' }); g.add(at(k, .5, 0, -.2, -.9), at(a, -.7, 0, -.4, .9));
  return { g, sky: IN, focus: V(0, 1, -.3), cam: dolly(V(0, 1.4, 3.2), V(-.2, 1.35, 2.6), V(0, 1.15, -.3)),
    upd: lt => { idle(k, lt); idle(a, lt); a.userData.body.rotation.x = .12; talk(a, lt, lt < 3.6); pose(a, [0, 0, .1], [-.6, -.3, -.2], 0, -.8); } };
});
S('c_billion', () => {
  const g = bedroom(); const k = kidLiz({ smile: 1 }); g.add(at(k, 0, 0, -.6)); pose(k, [0, 0, -2.4], [0, 0, 2.4], 0, 0);
  const t = tag('$1,000,000,000', { bg: '#ffd23f', fg: '#3a2a10', h: .4 }); t.position.set(0, 1.75, -.6); g.add(t);
  return { g, sky: IN, pill: 'A BILLIONAIRE', pillColor: GOLD, pillAt: .2, focus: V(0, 1, -.6), cam: dolly(V(0, 1.3, 2.4), V(0, 1.3, 2.0), V(0, 1.25, -.6)),
    upd: lt => { blink(k, lt); pop(t, lt, .1); k.position.y = Math.abs(Math.sin(lt * 5)) * .08; } };
});
S('c_invent', () => {
  const g = bedroom(); const k = kidLiz(); g.add(at(k, -2.6, 0, -1.9, -.5)); pose(k, [-1.1, 0, .2], [-1.1, 0, -.2], -.6, -.6);
  g.add(frame(.7, .9, -1.4, 2.0, -2.97, (c, w, h) => { c.fillStyle = '#d9c2a6'; c.fillRect(0, 0, w, h); c.fillStyle = '#f2d0b5'; c.beginPath(); c.arc(w / 2, h * .42, w * .2, 0, 7); c.fill(); c.fillStyle = '#e6e6e6'; c.beginPath(); c.ellipse(w / 2, h * .2, w * .22, h * .07, 0, 0, 7); c.fill(); c.fillStyle = '#3a3a42'; c.fillRect(w * .2, h * .66, w * .6, h * .34); c.fillStyle = '#e6e6e6'; c.fillRect(w * .4, h * .55, w * .2, h * .06); }, '#d9c2a6'));
  const b = bulb(); b.position.set(-2.6, 1.85, -1.9); g.add(b);
  return { g, sky: IN, pill: 'GREAT INVENTORS', pillColor: BLUE, focus: V(-2, 1, -2), cam: dolly(V(-.4, 1.4, .8), V(-.7, 1.35, .5), V(-2.2, 1.2, -2.3)),
    upd: lt => { blink(k, lt); pop(b, lt, .8); } };
});
S('c_needle', () => {
  const g = clinic(); const k = kidLiz(); g.add(sit(at(k, 0, 0, -1.55), .55)); pose(k, [-.3, 0, .5], [-.3, 0, -.5], -1.2, -1.2);
  const d = extra(5, { coat: '#fafafa', hairStyle: 'short' }); g.add(at(d, .9, 0, -1.1, -1.1)); const sy = syringe(.7); sy.rotation.z = 1.2; d.userData.armR.userData.el.add(sy); sy.position.set(0, -.3, .05);
  pose(d, [0, 0, .1], [-1.2, 0, 0], 0, -.3);
  return { g, sky: IN, pill: 'TERRIFIED OF NEEDLES', pillColor: RED, focus: V(0, 1, -1.5), cam: dolly(V(-.4, 1.3, 1.6), V(-.2, 1.25, 1.1), V(.2, 1.0, -1.5)),
    upd: lt => { blink(k, lt); k.userData.body.rotation.x = -.12 - Math.sin(lt * 20) * .01; idle(d, lt); } };
});
S('c_idea', () => {
  const g = clinic(); const k = kidLiz(); g.add(at(k, 0, 0, -1.2)); const b = bulb(); b.position.set(-.1, 1.62, -1.2); g.add(b);
  const dr = drop(1.2); dr.position.set(.6, 1.4, -1.2); g.add(dr);
  return { g, sky: IN, pill: 'THE BIG IDEA', pillColor: GOLD, focus: V(0, 1, -1.2), cam: dolly(V(0, 1.2, 1.6), V(0, 1.25, 1.2), V(.1, 1.2, -1.2)),
    upd: lt => { idle(k, lt); pop(b, lt, .3); pop(dr, lt, 1.0); dr.rotation.y = lt; } };
});

// ================= STANFORD =================
S('s_stanford', () => {
  const g = campus(); const h = holmes({ bag: '#c0303a', top: '#7a3a5a', turtle: false, shirt: '#f2efe8', pants: '#3a4560' }); g.add(h);
  const st = []; for (let i = 0; i < 6; i++) { const p = extra(i + 60, { bag: TOPS_[i % 4] }); g.add(p); st.push(p); }
  return { g, sky: OUT, pill: 'STANFORD · 2002', pillColor: '#8c1515', focus: V(0, 1, -4), cam: dolly(V(-3, 2.2, 5), V(-1.5, 2.0, 3.5), V(0, 1.6, -6), V(0, 1.6, -7)),
    upd: lt => { h.position.set(0, 0, lerp(-1, -7, lt / 5.1)); h.rotation.y = Math.PI; walk(h, lt, 7, .4); st.forEach((p, i) => { const dir = i % 2 ? 1 : -1; p.position.set(-4 + (i % 3) * 4 + (i % 2) * 1.2, 0, -10 + ((lt * 1.1 * dir + i * 3) % 12 + 12) % 12); p.rotation.y = dir > 0 ? 0 : Math.PI; walk(p, lt + i, 7, .4); }); } };
});
const TOPS_ = ['#3a6ea5', '#c0303a', '#2e8a4a', '#e2b84a'];
S('s_class', () => {
  const r = office({ wall: '#e3ecd9', side: '#d8e3cc', desk: false, curtain: '#7ac06a' });
  const board = G(box(4, 1.6, .06, '#2f4a3a', 0, 0, 0), panel(3.8, 1.4, textTex([['E = mc²   ΔG = ΔH − TΔS', 64, '#f2f2f2', 90, 800], ['PV = nRT    k = Ae^(−Ea/RT)', 56, '#f2f2f2', 190, 800]], { bg: '#2f4a3a', w: 1024, h: 380 }), 0, 0, .04));
  board.position.set(0, 1.9, -3.4); r.add(board);
  const ck = clock(3.2, 2.5, -3.45, .3); r.add(ck);
  const h = holmes({ top: '#7a3a5a', turtle: false, shirt: '#f2efe8', pants: '#3a4560' });
  const seats = [];
  for (let row = 0; row < 2; row++) for (let i = 0; i < 3; i++) { const x = -1.6 + i * 1.6, z = -.6 + row * 1.4; r.add(desk(1.0, .6, x, z - .45, '#c9a27a')); const p = (row === 1 && i === 1) ? h : extra(i + row * 3 + 70); r.add(sit(at(p, x, 0, z, Math.PI))); pose(p, [-1, 0, .2], [-1, 0, -.2], -.4, -.4); seats.push(p); }
  return { g: r, sky: IN, pill: 'TOO SLOW', pillColor: RED, focus: V(0, 1, -1), cam: dolly(V(1.6, 1.6, 3.2), V(1.2, 1.5, 2.6), V(-.3, 1.2, -.8), V(-.1, 1.2, -.8)),
    upd: lt => { spinClock(ck, lt, 6); h.userData.head.rotation.y = Math.sin(lt * 3) * .4; seats.forEach((p, i) => p !== h && blink(p, lt + i)); } };
});
S('s_fund', () => {
  const g = kitchen(); const f = father(), m = mother(), h = holmes({ top: '#7a3a5a', turtle: false, shirt: '#f2efe8', pants: '#3a4560' });
  g.add(sit(at(f, -.6, 0, -1.4))); g.add(sit(at(m, .6, 0, -1.4))); g.add(chair(-.6, -1.5, 0, '#6e3f22'), chair(.6, -1.5, 0, '#6e3f22')); g.add(at(h, 1.6, 0, -.2, -1.2));
  pose(f, [-.8, 0, .2], [-.8, 0, -.2], -.5, -.5); pose(m, [-.8, 0, .2], [-.8, 0, -.2], -.5, -.5);
  const j = G(cyl(.16, .16, .36, '#cfe8f2', 0, .18, 0, 20), cyl(.17, .17, .05, '#c9a54a', 0, .38, 0, 20), box(.2, .16, .1, '#7cb27a', 0, .1, 0));
  const lb = sign('COLLEGE FUND', { bg: '#fff', fg: '#333', w: .34, px: 60 }); lb.position.set(0, .2, .165); j.add(lb); g.add(j);
  return { g, sky: IN, pill: 'HER COLLEGE FUND', pillColor: GREEN, focus: V(0, 1, -.8), cam: dolly(V(-.4, 1.7, 2.6), V(.2, 1.6, 2.2), V(.2, 1.0, -.7), V(.4, 1.0, -.6)),
    upd: lt => { const k = ease((lt - 1.2) / 1.2); j.position.set(lerp(0, 1.25, k), lerp(.79, 1.0, k), lerp(-.5, -.15, k)); pose(h, [0, 0, .08], [lerp(0, -.8, ease((lt - .6) / .6)), 0, -.1], 0, -.3); idle(f, lt); idle(m, lt); blink(h, lt); f.userData.head.rotation.y = .4 * k; m.userData.head.rotation.y = .5 * k; } };
});
S('s_out', () => {
  const g = campus(); const h = holmes({ bag: '#c0303a', top: '#7a3a5a', turtle: false, shirt: '#f2efe8', pants: '#3a4560' }); g.add(h);
  return { g, sky: OUT, pill: 'DROPPED OUT AT 19', pillColor: '#8c1515', pillAt: .2, focus: V(0, 1, -4), cam: dolly(V(-2.4, 1.3, -1), V(-2.2, 1.4, -2), V(0, 1.4, -6), V(0, 1.4, -4)),
    upd: lt => { h.position.set(0, 0, lerp(-9, -3, lt / 2.4)); walk(h, lt, 7, .42); } };
});
const smallOffice = () => { const r = office({ wall: '#e8dccb', side: '#e0d2bf', curtain: '#c9a27a' }); r.add(at(boxProp(), -2.4, 0, -2.6), at(boxProp('#b8916a'), -2.0, 0, -2.9), at(boxProp(), -2.2, .35, -2.75)); return r; };
S('s_office', () => {
  const g = smallOffice(); const h = holmes(); g.add(chair(.3, -2.1, 0)); g.add(sit(at(h, .3, 0, -2.0))); pose(h, [-.9, 0, .1], [-.9, 0, -.1], -.4, -.4);
  return { g, sky: IN, pill: 'A TINY OFFICE', pillColor: '#7a5236', focus: V(0, 1, -1.5), cam: dolly(V(.1, 1.5, 1.7), V(.2, 1.45, 1.3), V(.3, 1.2, -2)),
    upd: lt => { idle(h, lt); } };
});
S('s_name', () => {
  const g = smallOffice(); const h = holmes(); g.add(at(h, -.8, 0, -1.6, .3)); pose(h, [0, 0, .08], [-1.5, 0, -.6], 0, -.4);
  const s = sign('THERANOS', { bg: '#ffffff', fg: '#2f3a5a', w: 2.2, px: 140 }); s.position.set(1.3, 2.2, -3.4); g.add(s); s.userData.base = s.scale.clone();
  const t1 = tag('THERAPY', { bg: BLUE, fg: '#fff', h: .26 }), t2 = tag('DIAGNOSIS', { bg: PINK, fg: '#fff', h: .26 }); t1.position.set(.6, 1.55, -3.2); t2.position.set(2.0, 1.55, -3.2); g.add(t1, t2);
  return { g, sky: IN, pill: 'THERAPY + DIAGNOSIS', pillColor: BLUE, pillAt: 2.2, focus: V(0, 1, -2), cam: dolly(V(-.2, 1.6, 2.0), V(.1, 1.6, 1.6), V(.5, 1.6, -2.6)),
    upd: lt => { pop(s, lt, .2, .5); pop(t1, lt, 1.4); pop(t2, lt, 1.8); idle(h, lt); } };
});

// ================= THE PROMISE =================
S('p_pitch', () => {
  const g = boardroom(); const h = holmes(); g.add(at(h, -2.6, 0, -2.4, .7)); pose(h, [0, 0, .08], [-1.4, 0, -.5], 0, -.3);
  const scr = panel(2.4, 1.35, textTex([['ONE DROP', 96, '#fff', 110], ['= 200+ TESTS', 80, '#ffd23f', 230]], { bg: '#2f3a5a', w: 800, h: 450 }), -3.8, 1.9, -3.9, 0, true); g.add(scr);
  for (let i = 0; i < 3; i++) { const p = oldMan(i + 2); g.add(chair(-.6 + i * 1.6, -.1, Math.PI)); g.add(sit(at(p, -.6 + i * 1.6, 0, -.2, Math.PI))); pose(p, [-.8, 0, .2], [-.8, 0, -.2], -.5, -.5); }
  return { g, sky: IN, pill: 'THE PITCH', pillColor: BLUE, focus: V(-1, 1, -1.5), cam: dolly(V(1.8, 1.8, 2.6), V(1.2, 1.7, 2.2), V(-2.2, 1.4, -2.2)),
    upd: lt => { idle(h, lt); talk(h, lt); } };
});
S('p_today', () => {
  const g = clinic(); const p = extra(9, { top: '#e2b84a' }); g.add(sit(at(p, 0, 0, -1.55), .55)); pose(p, [-.3, 0, .2], [-1.3, .6, -.1], -.2, 0);
  const n = extra(4, { coat: '#bfe0e8', hairStyle: 'bun' }); g.add(at(n, .9, 0, -1.1, -1.2)); pose(n, [0, 0, .1], [-1.1, 0, 0], 0, -.5); const sy = syringe(.6); sy.rotation.z = 1.4; n.userData.armR.userData.el.add(sy); sy.position.set(0, -.3, .05);
  const r = tubeRack(6); r.position.set(-1.6, .9, -2.5); g.add(r);
  return { g, sky: IN, pill: 'NEEDLE · TUBES · DAYS', pillColor: RED, focus: V(0, 1, -1.8), cam: dolly(V(-1.4, 1.6, 1.6), V(-.6, 1.6, 1.4), V(.2, 1.2, -1.8), V(.8, 1.5, -2.6)),
    upd: lt => { idle(p, lt); idle(n, lt); } };
});
S('p_drops', () => {
  const g = lab({ edison: false }); const f = finger(); f.position.set(.6, 1.35, -2.2); g.add(f);
  const ds = [0, 1, 2].map(i => { const d = drop(.75); g.add(d); return d; }); const cart = G(cyl(.06, .06, .26, '#f4f4f4', 0, .13, 0, 16), cyl(.045, .045, .22, '#d42a3a', 0, .13, .001, 16)); cart.position.set(.27, .96, -2.2); g.add(cart);
  return { g, sky: IN, pill: 'JUST A FEW DROPS', pillColor: RED, focus: V(0, 1, -2.2), cam: dolly(V(1.0, 1.6, .2), V(.85, 1.55, -.1), V(.25, 1.2, -2.3), V(.25, 1.18, -2.3), 34),
    upd: lt => ds.forEach((d, i) => { const k = clamp((lt - .4 - i * .8) / .6); d.position.set(.27, lerp(1.3, 1.2, k * k), -2.2); d.visible = k < 1 && lt > .4 + i * .8 - .3; }) };
});
S('p_machine', () => {
  const g = lab(); const e = g.userData.edison; const pr = G(rbox(.7, .35, .5, .05, '#e8e8ea', 0, .175, 0), box(.5, .02, .3, '#ffffff', 0, .36, -.05)); pr.position.set(.6, .96, -2.6); g.add(pr);
  const tl = tag('PRINTER SIZE', { bg: '#555', fg: '#fff', h: .14 }); tl.position.set(.6, 1.5, -2.6); g.add(tl);
  const names = ['CHOLESTEROL', 'VITAMIN D', 'IRON', 'BLOOD SUGAR', 'HORMONES', 'INFECTIONS']; const ts = names.map((n, i) => { const t = tag(n, { bg: ['#2f7de1', '#d63a7a', '#2e8a4a', '#c9902a', '#8a3fd1', '#d63a3a'][i], fg: '#fff', h: .14 }); t.position.set(-1.6 + (i % 2) * 2.2, 2.3 - Math.floor(i / 2) * .3, -2.4); g.add(t); return t; });
  return { g, sky: IN, pill: 'HUNDREDS OF TESTS', pillColor: BLUE, pillAt: 1.8, focus: V(0, 1, -2.5), cam: dolly(V(-.2, 1.7, .9), V(-.1, 1.75, .5), V(-.2, 1.6, -2.6)),
    upd: lt => { pop(tl, lt, .4); ts.forEach((t, i) => pop(t, lt, 1.2 + i * .35)); } };
});
S('p_edison', () => {
  const g = lab(); const e = g.userData.edison;
  g.add(frame(.8, 1.0, -.5, 2.3, -3.44, (c, w, h) => { c.fillStyle = '#d9c2a6'; c.fillRect(0, 0, w, h); c.fillStyle = '#f2d0b5'; c.beginPath(); c.arc(w / 2, h * .42, w * .2, 0, 7); c.fill(); c.fillStyle = '#e6e6e6'; c.beginPath(); c.ellipse(w / 2, h * .23, w * .23, h * .07, 0, 0, 7); c.fill(); c.fillStyle = '#3a3a42'; c.fillRect(w * .2, h * .66, w * .6, h * .34); c.fillStyle = '#333'; c.fillRect(w * .43, h * .44, 5, 5); c.fillRect(w * .54, h * .44, 5, 5); }, '#d9c2a6'));
  return { g, sky: IN, name: ['THE EDISON', 'NAMED AFTER THOMAS EDISON'], focus: V(-.5, 1.4, -2.6), cam: dolly(V(-.1, 1.6, -.6), V(-.3, 1.65, -.9), V(-.5, 1.6, -2.7)) };
});
S('p_world', () => {
  const g = dark('#1f3050'); const gl = globe(); gl.position.set(0, 1.6, -1); g.add(gl); spotOn(g, 2, 5, 3, 0, 1.6, -1, '#ffffff', 40);
  const ring = []; for (let i = 0; i < 12; i++) { const p = extra(i + 80); const a = i / 12 * Math.PI * 2; g.add(at(p, Math.sin(a) * 2.6, 0, -1 + Math.cos(a) * 2.6, a + Math.PI)); ring.push(p); }
  return { g, sky: ['#1f3050', '#2c4570', '#3a5a8a'], dim: .7, pill: 'HEALTHCARE FOR EVERYONE', pillColor: BLUE, focus: V(0, 1, -1), cam: dolly(V(0, 2.4, 5), V(.6, 2.6, 4.4), V(0, 1.4, -1)),
    upd: lt => { gl.rotation.y = lt * .5; ring.forEach((p, i) => { idle(p, lt + i); if (i % 3 === 0) wave(p, lt + i); }); } };
});

// ================= IMAGE =================
S('i_look', () => {
  const g = office(); const h = holmes(); g.add(at(h, .2, 0, -.4));
  return { g, sky: IN, name: ['ELIZABETH HOLMES', 'FOUNDER & CEO OF THERANOS'], focus: V(0, 1, -.4), cam: dolly(V(-.3, 1.6, 1.7), V(-.1, 1.62, 1.3), V(.2, 1.45, -.4)),
    upd: lt => idle(h, lt) };
});
S('i_turtle', () => {
  const g = closet(); const h = holmes(); g.add(at(h, 1.6, 0, -.6, -.6));
  return { g, sky: IN, pill: 'A BLACK TURTLENECK, EVERY DAY', pillColor: '#232327', focus: V(0, 1.5, -1.5), cam: dolly(V(-1.6, 1.7, 2.4), V(-.6, 1.65, 2.2), V(-.2, 1.6, -2), V(.6, 1.5, -1.4)),
    upd: lt => idle(h, lt) };
});
S('i_voice', () => {
  const g = stage({ crowd: false, big: 'THERANOS', small: 'THE FUTURE OF HEALTH' }); const h = holmes(); g.add(at(h, 0, .62, -3.6));
  const pod = G(box(.6, 1.1, .4, '#e8e4ee', 0, .55, 0), cyl(.01, .01, .3, '#333', 0, 1.25, -.05, 6), sph(.03, '#222', 0, 1.4, 0)); pod.position.set(0, .62, -3.1); g.add(pod);
  const rings = [0, 1, 2].map(() => { const r = new THREE.Mesh(new THREE.TorusGeometry(.3, .012, 8, 48), B('#ffd0e8', { transparent: true })); r.position.set(0, 2.25, -3.0); g.add(r); return r; });
  return { g, sky: PURPLE, dim: .5, pill: 'A DEEP, CALM VOICE', pillColor: '#8a3fd1', focus: V(0, 1.5, -3.5), cam: dolly(V(1.2, 2.2, 1.4), V(.8, 2.15, .8), V(0, 2.0, -3.6)),
    upd: lt => { idle(h, lt); talk(h, lt); rings.forEach((r, i) => { const k = ((lt * .6 + i / 3) % 1); r.scale.setScalar(1 + k * 3); r.material.opacity = 1 - k; }); } };
});
S('i_blink', () => {
  const g = office(); const h = holmes({ bigEyes: 1.25 }); g.add(at(h, 0, 0, 0));
  return { g, sky: IN, pill: 'SHE BARELY BLINKED', pillColor: '#232327', pillAt: .15, focus: V(0, 1.6, 0), cam: dolly(V(0, 1.64, .75), V(0, 1.64, .6), V(0, 1.6, 0), V(0, 1.6, 0), 32),
    upd: lt => { h.userData.head.rotation.set(0, 0, 0); } };
});
S('i_work', () => {
  const g = office({ night: true, desk: false }); const ck = clock(3.4, 2.4, -3.4, .3); g.add(ck);
  const ws = []; for (let i = 0; i < 4; i++) { const x = -2.4 + (i % 2) * 2.6, z = -1.8 + Math.floor(i / 2) * 1.8; g.add(desk(1.4, .8, x, z, '#8a5634'), at(laptop(), x, .79, z + .05, Math.PI)); const p = i === 3 ? holmes() : extra(i + 90); g.add(chair(x, z + .7, Math.PI)); g.add(sit(at(p, x, 0, z + .6, Math.PI))); pose(p, [-1, 0, .2], [-1, 0, -.2], -.5, -.5); ws.push(p); }
  const lamp = new THREE.PointLight('#ffe2b0', 6, 8); lamp.position.set(0, 2.6, -.8); g.add(lamp);
  return { g, sky: NIGHT, dim: .75, pill: 'ALMOST EVERY DAY OF THE YEAR', pillColor: DARK, focus: V(0, 1, -1), cam: dolly(V(2.2, 2.2, 3.4), V(1.6, 2.0, 2.8), V(-.4, 1.0, -1.2)),
    upd: lt => { spinClock(ck, lt, 10); ws.forEach((p, i) => { blink(p, lt + i); p.userData.armL.rotation.x = -1 + Math.sin(lt * 14 + i) * .05; p.userData.armR.rotation.x = -1 + Math.cos(lt * 13 + i) * .05; }); } };
});
S('i_love', () => {
  const g = hq(); const hs = []; for (let i = 0; i < 9; i++) { const hh = heart(['#e8579a', '#f07aa8', '#d63a7a'][i % 3]); hh.scale.setScalar(.6); g.add(hh); hs.push(hh); }
  return { g, sky: OUT, pill: 'SILICON VALLEY FELL IN LOVE', pillColor: PINK, pillAt: .2, focus: V(0, 3, -3), sun: [-6, 12, 8], cam: dolly(V(3, 2, 14), V(1.5, 2.6, 12.5), V(0, 4, -3)),
    upd: lt => hs.forEach((hh, i) => { const k = ((lt * .5 + i / 9) % 1); hh.position.set(-7 + i * 1.75, 1 + k * 8, 2 + (i % 3)); hh.rotation.y = lt + i; hh.visible = lt > i * .12; }) };
});

// ================= MONEY =================
S('m_pour', () => {
  const g = office(); const h = holmes({ smile: 1 }); g.add(at(h, .2, 0, -.6)); pose(h, [0, 0, -1.2], [0, 0, 1.2], -.4, -.4);
  const bs = []; for (let i = 0; i < 40; i++) { const b = bill(); b.material.side = THREE.DoubleSide; g.add(b); bs.push(b); }
  return { g, sky: IN, pill: 'THE MONEY POURED IN', pillColor: GREEN, pillAt: .2, focus: V(0, 1, -.6), cam: dolly(V(0, 1.6, 2.6), V(0, 1.6, 2.3), V(0, 1.5, -.6)),
    upd: lt => { idle(h, lt); bs.forEach((b, i) => { const sp = .9 + (i % 5) * .15; const y = 3.4 - ((lt * sp + i * .37) % 3.4); b.position.set(((i * 53) % 40) / 10 - 2, y, -1.8 + ((i * 29) % 30) / 10); b.rotation.set(lt * 2 + i, lt * 1.5 + i * 2, i); }); } };
});
S('m_inv', () => {
  const g = boardroom(); const ps = []; const nm = [['RUPERT MURDOCH', .1], ['THE WALTON FAMILY', 1.1], ['THE DeVOS FAMILY', 2.5]];
  const ts = nm.map(([n, t0], i) => { const p = oldMan(i + 5, i === 1 ? { hair: '#7a5236', hairStyle: 'bob', tie: null, top: '#8a3a4a', shirt: '#f2efe8' } : {}); g.add(chair(-1.6 + i * 1.6, -1.9, 0)); g.add(sit(at(p, -1.6 + i * 1.6, 0, -1.8))); pose(p, [-.8, 0, .2], [-.8, 0, -.2], -.5, -.5); ps.push(p);
    const t = tag(n, { bg: '#ffffff', fg: GREEN, h: .17 }); t.position.set(-1.6 + i * 1.6, 1.75, -1.8); g.add(t); return [t, t0]; });
  g.add(money(6, 0, -.9).translateY(.8));
  return { g, sky: IN, name: ['THE INVESTORS', 'BILLIONAIRE FAMILIES'], focus: V(0, 1, -1.5), cam: dolly(V(0, 1.7, 2.8), V(.1, 1.65, 2.4), V(0, 1.25, -1.6)),
    upd: lt => { ps.forEach((p, i) => idle(p, lt + i)); ts.forEach(([t, t0]) => pop(t, lt, t0)); } };
});
S('m_total', () => {
  const g = dark('#1f2a26'); const m = money(27, 0, 0); g.add(m); spotOn(g, 0, 6, 2, 0, 0, 0, '#fff4e0', 60);
  return { g, sky: ['#1f2a26', '#2a3a33', '#33463d'], dim: .4, pill: 'ABOUT $900 MILLION', pillColor: GREEN, pillAt: .6, focus: V(0, .5, 0), cam: dolly(V(2.2, 1.6, 2.8), V(1.4, 1.3, 2.2), V(0, .4, 0)),
    upd: lt => m.children.forEach((s, i) => { const k = clamp((lt - i * .08) / .3); s.visible = k > 0; s.scale.setScalar(Math.max(.001, backOut(k))); }) };
});
S('m_board', () => {
  const g = boardroom(); const nm = { 1: ['HENRY KISSINGER', 3.6], 3: ['GEORGE SHULTZ', 5.2], 4: ['GEN. JAMES MATTIS', 8.0] }; const ts = [];
  const ps = [];
  for (let i = 0; i < 6; i++) { const side = i < 3 ? -1 : 1, x = -2 + (i % 3) * 2; const p = oldMan(i, i === 4 ? { hairStyle: 'short', hair: '#b9b9be', glasses: null, tie: '#1c3a7a' } : {}); g.add(chair(x, -1 + side * 1.2, side < 0 ? 0 : Math.PI)); g.add(sit(at(p, x, 0, -1 + side * 1.1, side < 0 ? 0 : Math.PI))); pose(p, [-.8, 0, .2], [-.8, 0, -.2], -.5, -.5); ps.push(p);
    if (nm[i]) { const t = tag(nm[i][0], { bg: '#ffffff', fg: '#2f3a5a', h: .17 }); t.position.set(x, 1.75, -1 + side * 1.1); g.add(t); ts.push([t, nm[i][1]]); } }
  const h = holmes(); g.add(at(h, -3.5, 0, -1, Math.PI / 2));
  return { g, sky: IN, pill: 'A BOARD FULL OF LEGENDS', pillColor: '#2f3a5a', pillAt: .4, focus: V(0, 1, -1), cam: (u) => { const k = ease(u); return { p: V(lerp(-4.5, 3.5, k), 2.0, 2.6), l: V(lerp(-2.5, 2.2, k), 1.1, -1) }; },
    upd: lt => { ps.forEach((p, i) => idle(p, lt + i)); idle(h, lt); talk(h, lt, lt < 3); ts.forEach(([t, t0]) => pop(t, lt, t0)); } };
});
S('m_walg', () => {
  const g = pharmacy({ booth: 'THERANOS WELLNESS CENTER' }); const cs = [0, 1, 2].map(i => { const p = extra(i + 100); g.add(p); return p; });
  return { g, sky: IN, pill: 'THE WALGREENS DEAL', pillColor: RED, focus: V(0, 1, -2), cam: dolly(V(-1.2, 1.7, 3.2), V(-.4, 1.65, 2.6), V(0, 1.4, -2.6)),
    upd: lt => cs.forEach((p, i) => { p.position.set(-2.5 + ((lt * .9 + i * 1.8) % 5), 0, -1 + i * .6); p.rotation.y = Math.PI / 2; walk(p, lt + i, 6.5, .35); }) };
});

// ================= PEAK =================
S('k_nine', () => {
  const g = hq(); const t = tag('$9,000,000,000', { bg: '#ffd23f', fg: '#3a2a10', h: 1.0 }); t.position.set(0, 9, -2); g.add(t);
  return { g, sky: OUT, pill: 'WORTH $9 BILLION', pillColor: GREEN, pillAt: .9, focus: V(0, 3, -3), sun: [-6, 12, 8], cam: dolly(V(4, 1.5, 12), V(2, 3.2, 14), V(0, 4, -3), V(0, 6.5, -3)),
    upd: lt => pop(t, lt, .6, .6) };
});
S('k_half', () => {
  const g = dark('#2c2350'); const a = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, .3, 48, 1, false, 0, Math.PI), M('#e8579a')), b = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, .3, 48, 1, false, Math.PI, Math.PI), M('#c9c4d6'));
  const pie = G(a, b); pie.rotation.x = Math.PI / 2.4; pie.position.set(0, 1.6, 0); g.add(pie); spotOn(g, 0, 6, 3, 0, 1.6, 0, '#ffffff', 50);
  const h = holmes(); g.add(at(h, -1.8, 0, .4, .4));
  return { g, sky: PURPLE, dim: .55, pill: 'SHE OWNED ABOUT HALF', pillColor: PINK, pillAt: .3, focus: V(0, 1.4, 0), cam: dolly(V(0, 1.9, 6.2), V(-.3, 1.8, 5.6), V(-.5, 1.4, 0)),
    upd: lt => { pie.rotation.z = lt * .4; idle(h, lt); a.position.x = .1 * ease(lt / .6); } };
});
S('k_young', () => {
  const g = dark('#f2e6d8'); const cov = panel(3.2, 4.2, canvasTex(640, 840, (c, w, h) => { c.fillStyle = '#f7f1e8'; c.fillRect(0, 0, w, h); c.fillStyle = '#c0303a'; c.font = FONT(110, 900); c.textAlign = 'center'; c.fillText('FORTUNE 40', w / 2, 120); c.fillStyle = '#222'; c.font = FONT(44, 900); c.fillText('THE YOUNGEST', w / 2, 640); c.fillText('SELF-MADE BILLIONAIRE', w / 2, 700); c.fillStyle = '#e8579a'; c.font = FONT(36, 800); c.fillText('AGE 30', w / 2, 760); }), 0, 2.2, -1.6);
  g.add(cov); const h = holmes(); g.add(at(h, 2.2, .2, -1.0, -.3)); g.add(cyl(.7, .75, .2, '#ffffff', 2.2, .1, -1.0, 32));
  const fl = []; for (let i = 0; i < 6; i++) { const l = new THREE.PointLight('#ffffff', 0, 6); l.position.set(-2 + i * .8, 1.6, 1.5); g.add(l); fl.push(l); }
  return { g, sky: ['#f2e6d8', '#f6ece2', '#f9f2ea'], pill: 'YOUNGEST SELF-MADE WOMAN BILLIONAIRE', pillColor: GOLD, pillAt: .3, focus: V(0, 1.5, -1.4), cam: dolly(V(.8, 1.7, 4.6), V(.9, 1.75, 4.0), V(1.0, 1.9, -1.4)),
    upd: lt => { idle(h, lt); fl.forEach((l, i) => l.intensity = ((lt * 3 + i * .37) % 1) < .08 ? 30 : 0); } };
});
S('k_stage', () => {
  const g = stage({ big: 'THERANOS', small: 'THE FUTURE OF HEALTHCARE', c1: '#d14f8a', c2: '#5a1a6a' }); const h = holmes(); g.add(at(h, -.6, .62, -3.6, .2)); pose(h, [0, 0, .08], [-1.2, 0, -.5], 0, -.9);
  return { g, sky: PURPLE, dim: .45, pill: 'COVERS · STAGES · LIVE TV', pillColor: '#8a3fd1', focus: V(0, 1, -3), cam: dolly(V(-3, 3.2, 6), V(2, 2.8, 6), V(0, 2.2, -4)),
    upd: lt => { idle(h, lt); talk(h, lt); h.position.x = lerp(-.8, .6, ease(lt / 4.9)); h.rotation.y = .2 - .4 * ease(lt / 4.9); } };
});
S('k_tv', () => {
  const g = studio(); const h = holmes(); g.add(sit(at(h, -1.1, 0, -1.95, .5), .6)); pose(h, [-.7, 0, .15], [-.9, 0, -.2], -.6, -.9);
  const host = extra(3, { skin: SKIN[3], top: '#3a3f6a', tie: '#c03f8a', shirt: '#eef', hairStyle: 'short' }); g.add(sit(at(host, 1.1, 0, -1.95, -.5), .6)); pose(host, [-.7, 0, .2], [-.7, 0, -.2], -.6, -.6);
  return { g, sky: PURPLE, dim: .85, pill: 'ON LIVE TV', pillColor: '#c03f8a', pillAt: .2, focus: V(0, 1, -2), cam: dolly(V(0, 1.6, 4.0), V(-.3, 1.55, 3.4), V(0, 1.25, -2)),
    upd: lt => { idle(h, lt); idle(host, lt); talk(host, lt); } };
});

// ================= THE SECRET =================
S('x_inside', () => {
  const g = lab({ night: true }); const lt_ = new THREE.PointLight('#bfe0ff', 5, 8); lt_.position.set(0, 2.6, -1.5); g.add(lt_);
  return { g, sky: NIGHT, night: true, pill: 'INSIDE THERANOS', pillColor: DARK, focus: V(0, 1, -2), cam: dolly(V(-2.4, 1.7, 3), V(-.8, 1.6, 2.0), V(0, 1.2, -2.6)) };
});
S('x_fail', () => {
  const g = lab({ screen: 'ERROR', screenCol: '#ff5a5a' }); const e = g.userData.edison; const t = labTech(11, { hairStyle: 'short' }); g.add(at(t, .7, 0, -1.7, -.5));
  const sw = screenSwap(e, [[0, 'TESTING...', '#f0c35a'], [1.0, 'ERROR', '#ff5a5a'], [3.4, 'WRONG RESULT', '#ff5a5a']]);
  const x = tag('✕', { bg: RED, fg: '#fff', h: .3 }); x.position.set(-.5, 1.95, -2.5); g.add(x);
  return { g, sky: IN, pill: 'WRONG RESULTS', pillColor: RED, pillAt: 1.2, focus: V(0, 1, -2.4), cam: dolly(V(-1.4, 1.6, .6), V(-1.0, 1.55, .2), V(-.2, 1.4, -2.4)),
    upd: lt => { sw(lt); pop(x, lt, 1.1); idle(t, lt); const k = ease((lt - 1.4) / .5); pose(t, [0, 0, .08], [lerp(0, -2.6, k), 0, -.2], 0, lerp(0, -1.6, k)); } };
});
S('x_hidden', () => {
  const g = secretLab(); const ts = [0, 1].map(i => { const p = labTech(i + 12); g.add(at(p, -2.2 + i * 2.2, 0, -1.9, Math.PI)); pose(p, [-1, 0, .2], [-1, 0, -.2], -.5, -.5); return p; });
  const t = tag("OTHER COMPANIES' MACHINES", { bg: '#ffffff', fg: '#3a4552', h: .2 }); t.position.set(0, 2.3, -2.4); g.add(t);
  return { g, sky: NIGHT, dim: .7, pill: 'BEHIND CLOSED DOORS', pillColor: DARK, focus: V(0, 1, -2), cam: dolly(V(2.4, 1.7, 2.6), V(1.2, 1.6, 2.2), V(-.4, 1.2, -2.6)),
    upd: lt => { ts.forEach((p, i) => blink(p, lt + i)); pop(t, lt, 2.4); } };
});
S('x_hide', () => {
  const g = lab(); g.add(box(4, 3.2, .12, '#c6dde3', 4, 1.6, -1)); const door = box(1.0, 2.1, .08, '#7a8a96', 3, 1.05, -.92); g.add(door);
  const s = sign('AUTHORIZED ONLY', { bg: RED, fg: '#fff', w: .9 }); s.position.set(3, 2.35, -.9); g.add(s);
  const h = holmes(); const vs = [0, 1].map(i => oldMan(i + 7)); g.add(h, ...vs);
  return { g, sky: IN, pill: 'HIDDEN FROM VISITORS', pillColor: RED, focus: V(1, 1, -.5), cam: dolly(V(.4, 1.7, 3.2), V(.9, 1.7, 3.0), V(1.4, 1.3, -.6)),
    upd: lt => { const x = lerp(2.6, -.6, clamp(lt / 2.2)); h.position.set(x, 0, .1); vs.forEach((v, i) => { v.position.set(x + 1 + i * .8, 0, .2 + i * .3); v.rotation.y = -Math.PI / 2; walk(v, lt + i, 6, .35); }); h.rotation.y = -Math.PI / 2; walk(h, lt, 6.5, .35); } };
});
S('x_sunny', () => {
  const g = lab(); const s = sunny(); g.add(at(s, .2, 0, -.6, -.2)); pose(s, [-1.2, .6, 1.3], [-1.2, -.6, -1.3], -1.8, -1.8);
  return { g, sky: IN, name: ['SUNNY BALWANI', 'PRESIDENT & COO'], focus: V(0, 1, -.6), cam: dolly(V(-.8, 1.4, 1.8), V(-.5, 1.45, 1.4), V(.2, 1.5, -.6)),
    upd: lt => idle(s, lt) };
});
S('x_bf', () => {
  const g = office(); const s = sunny(), h = holmes(); g.add(at(s, .45, 0, -.6, -.35), at(h, -.45, 0, -.6, .35));
  const ht = heart(); ht.scale.setScalar(.3); ht.position.set(0, 2.0, -.6); g.add(ht); ht.userData.base = ht.scale.clone();
  return { g, sky: IN, pill: 'SECRET COUPLE', pillColor: PINK, pillAt: .7, focus: V(0, 1, -.6), cam: dolly(V(0, 1.6, 2.2), V(0, 1.6, 1.8), V(0, 1.55, -.6)),
    upd: lt => { idle(s, lt); idle(h, lt); pop(ht, lt, .3); ht.rotation.y = Math.sin(lt * 2) * .4; } };
});
S('x_fired', () => {
  const g = lab(); const w = labTech(13, { coat: null }); const bx = boxProp(); w.userData.body.add(bx); bx.position.set(0, .85, .32); pose(w, [-1.2, 0, .1], [-1.2, 0, -.1], -.3, -.3); g.add(w);
  const guard = extra(14, { top: '#1f2b4d', pants: '#1f2b4d', cap: '#1f2b4d', hairStyle: 'short' }); g.add(at(guard, 2.2, 0, .2, -.8)); pose(guard, [-1.2, .6, 1.3], [-1.2, -.6, -1.3], -1.8, -1.8);
  const cam_ = G(box(.3, .18, .18, '#e6e6ea', 0, 0, 0), cyl(.06, .06, .05, '#222', 0, 0, .1).rotateX(Math.PI / 2)); cam_.position.set(-2.6, 2.7, -3.3); g.add(cam_);
  return { g, sky: IN, pill: 'WATCHED · THREATENED · FIRED', pillColor: RED, focus: V(0, 1, -.5), cam: dolly(V(-1, 1.6, 3.4), V(-.4, 1.6, 3.0), V(.6, 1.2, -.2)),
    upd: lt => { w.position.set(lerp(-1.5, 1.4, clamp(lt / 4)), 0, -.2); w.rotation.y = Math.PI / 2; const a = Math.sin(lt * 6) * .35; w.userData.legL.rotation.x = a; w.userData.legR.rotation.x = -a; blink(w, lt); idle(guard, lt); cam_.rotation.y = Math.sin(lt) * .5; } };
});

// ================= WHISTLEBLOWERS =================
S('w_two', () => {
  const g = lab(); const a = erika(), b = tyler(); g.add(at(a, -.4, 0, -1.4, .3), at(b, .4, 0, -1.4, -.3));
  const pp = panel(.3, .4, textTex([['RESULT', 50, '#333', 60], ['✕', 160, RED, 220]], { w: 256, h: 340 }), 0, 1.25, -1.15); pp.rotation.x = -.3; g.add(pp);
  return { g, sky: IN, pill: 'THEY COULD NOT STAY SILENT', pillColor: BLUE, pillAt: .3, focus: V(0, 1, -1.4), cam: dolly(V(0, 1.5, .9), V(0, 1.5, .6), V(0, 1.35, -1.3)),
    upd: lt => { idle(a, lt); idle(b, lt); pose(a, [0, 0, .08], [-.9, -.3, -.2], 0, -.6); pose(b, [-.9, .3, .2], [0, 0, -.08], -.6, 0); } };
});
S('w_names', () => {
  const g = lab(); const a = erika(), b = tyler(); g.add(at(a, -.5, 0, -.6, .15), at(b, .5, 0, -.6, -.15));
  const t = tag('GRANDSON OF GEORGE SHULTZ', { bg: '#ffffff', fg: '#2f3a5a', h: .13 }); t.position.set(.5, 2.0, -.6); g.add(t);
  const rs = []; for (let i = 0; i < 3; i++) { const pp = panel(.4, .5, textTex([['PATIENT RESULT', 34, '#333', 50], ['WRONG', 70, RED, 200]], { w: 256, h: 320 }), -1.4 + i * 1.4, 2.5, -1.5, 0, true); g.add(pp); rs.push(pp); }
  return { g, sky: IN, name: ['ERIKA CHEUNG & TYLER SHULTZ', 'THE WHISTLEBLOWERS'], focus: V(0, 1, -.6), cam: dolly(V(-.4, 1.6, 2.2), V(.3, 1.6, 1.7), V(0, 1.6, -.6), V(0, 1.8, -.8)),
    upd: lt => { idle(a, lt); idle(b, lt); pop(t, lt, 1.8); rs.forEach(r => r.visible = false); } };
});
S('w_reg', () => {
  const g = gov(); const a = erika({ coat: null, top: '#7aa9d8' }), b = tyler({ coat: null, top: '#5c8a6a' }); g.add(a, b);
  return { g, sky: OUT, pill: 'THEY WENT TO THE REGULATORS', pillColor: BLUE, pillAt: .2, focus: V(0, 2, -3), sun: [-6, 12, 8], cam: dolly(V(-3, 2, 9), V(-2, 2.2, 8), V(0, 2.6, -4)),
    upd: lt => { const z = lerp(3, .5, clamp(lt / 1.8)); a.position.set(-.4, 0, z); b.position.set(.4, 0, z + .2); a.rotation.y = b.rotation.y = Math.PI; walk(a, lt, 7, .4); walk(b, lt + .3, 7, .4); } };
});
S('w_reporter', () => {
  const g = newsroom(); const r = reporter(); g.add(sit(at(r, 0, 0, -.35, Math.PI))); pose(r, [-.9, 0, .2], [-.9, 0, -.2], -.6, -.6);
  const ph = G(rbox(.08, .16, .02, .01, '#222', 0, 0, 0)); r.userData.armR.userData.el.add(ph); ph.position.set(0, -.3, .06);
  return { g, sky: IN, name: ['JOHN CARREYROU', 'THE WALL STREET JOURNAL'], focus: V(0, 1, -.6), cam: dolly(V(2.4, 1.9, -3.0), V(1.9, 1.8, -2.6), V(-.2, 1.1, -.3)),
    upd: lt => { blink(r, lt); const k = ease((lt - 1.5) / .5); pose(r, [-.9, 0, .2], [lerp(-.9, -2.4, k), 0, lerp(-.2, -.5, k)], -.6, lerp(-.6, -2.0, k)); talk(r, lt, lt > 2); } };
});
S('w_lawyers', () => {
  const g = newsroom(); const r = reporter(); g.add(sit(at(r, 0, 0, -.35, Math.PI))); pose(r, [-.9, 0, .2], [-.9, 0, -.2], -.6, -.6);
  const ls = [0, 1, 2].map(i => { const p = oldMan(i + 8, { hair: '#2a2020', hairStyle: 'short', top: '#1e1e22', pants: '#1e1e22', tie: '#7a1c2b', glasses: '#222' }); g.add(p); const bc = G(rbox(.4, .3, .1, .03, '#3a2a20', 0, 0, 0)); p.userData.armR.userData.el.add(bc); bc.position.set(0, -.36, 0); return p; });
  return { g, sky: IN, pill: 'LAWYERS SENT AFTER HIM', pillColor: '#232327', focus: V(0, 1, 0), cam: dolly(V(-2.4, 1.8, 2.4), V(-2.0, 1.7, 2.0), V(.3, 1.2, 0)),
    upd: lt => { blink(r, lt); ls.forEach((p, i) => { const k = clamp(lt / 1.6); p.position.set(-1.2 + i * 1.2, 0, lerp(3.4, 1.1, k)); p.rotation.y = Math.PI; if (k < 1) walk(p, lt + i, 6, .35); else idle(p, lt); }); } };
});
S('w_pub', () => {
  const g = dark('#e9e1d4'); const np = newspaper('BLOOD-TEST STARTUP STRUGGLES', 'Former employees raise questions about its technology', 1.4); np.position.set(0, 1.3, 0); g.add(np);
  return { g, sky: ['#e9e1d4', '#efe8dc', '#f3ede4'], pill: 'HE PUBLISHED ANYWAY', pillColor: '#232327', pillAt: .3, focus: V(0, 1.5, 0), cam: dolly(V(0, 1.45, 4.0), V(0, 1.45, 3.5), V(0, 1.45, 0)),
    upd: lt => { const k = backOut(clamp(lt / .6)); np.scale.setScalar(Math.max(.01, k)); np.rotation.z = (1 - clamp(lt / .6)) * 6; } };
});

// ================= THE FALL =================
S('f_oct', () => {
  const g = dark('#7b4b2c'); const tb = panel(10, 10, flat('#8a5a38', 3), 0, 0, 0); tb.rotation.x = -Math.PI / 2; g.add(tb);
  const np = newspaper('BLOOD-TEST STARTUP STRUGGLES', 'October 2015', 1.2); np.rotation.set(-Math.PI / 2, 0, .15); np.position.set(0, .02, 0); g.add(np);
  return { g, sky: IN, pill: 'OCTOBER 2015', pillColor: '#7b4b2c', pillAt: .1, focus: V(0, 0, 0), cam: dolly(V(.3, 2.2, 1.4), V(.2, 1.9, 1.2), V(0, 0, -.1)) };
});
S('f_bomb', () => {
  const g = office(); const h = holmes(); g.add(at(h, .2, 0, -.8)); pose(h, [-2.4, 0, .4], [-2.4, 0, -.4], -1.6, -1.6);
  const ns = []; for (let i = 0; i < 10; i++) { const n = newspaper('STARTUP STRUGGLES', '', .5); n.material.side = THREE.DoubleSide; g.add(n); ns.push(n); }
  return { g, sky: IN, pill: 'IT HIT LIKE A BOMB', pillColor: RED, pillAt: .2, focus: V(0, 1, -.8), cam: dolly(V(0, 1.6, 2.4), V(0, 1.6, 2.0), V(0, 1.5, -.8)),
    upd: lt => { blink(h, lt); ns.forEach((n, i) => { const a = i / 10 * Math.PI * 2, r = .3 + lt * 1.6; n.position.set(Math.cos(a) * r, 1.5 + Math.sin(a) * r * .6, -.4 + Math.sin(a * 2) * .3); n.rotation.set(lt * 3 + i, lt * 2 + i, i); }); } };
});
S('f_insp', () => {
  const g = lab(); const is = [0, 1].map(i => { const p = extra(i + 120, { top: '#2f4a6a', pants: '#2a3040', tie: '#c9a54b' }); g.add(p); const cb = G(box(.22, .3, .02, '#8a6a4a', 0, 0, 0), box(.18, .24, .021, '#ffffff', 0, -.01, .005)); p.userData.armL.userData.el.add(cb); cb.position.set(0, -.3, .08); pose(p, [-.9, 0, .1], [-.6, 0, -.1], -.8, -.6); return p; });
  return { g, sky: IN, pill: 'SERIOUS PROBLEMS FOUND', pillColor: RED, focus: V(0, 1, -1.5), cam: dolly(V(1.6, 1.7, 2.2), V(1.0, 1.65, 1.8), V(-.3, 1.3, -2.0)),
    upd: lt => is.forEach((p, i) => { p.position.set(lerp(2.5, -.4 + i * 1.2, clamp(lt / 1.8)), 0, -1.6 + i * .5); p.rotation.y = lt < 1.8 ? -Math.PI / 2 : Math.PI; if (lt < 1.8) walk(p, lt + i, 6, .35); else idle(p, lt); }) };
});
S('f_walg', () => {
  const g = pharmacy({ booth: 'CLOSED', closed: true });
  return { g, sky: IN, pill: 'WALGREENS ENDED THE DEAL', pillColor: RED, pillAt: .2, focus: V(0, 1, -2), cam: dolly(V(.6, 1.6, 2.4), V(.3, 1.55, 1.8), V(0, 1.4, -2.6)) };
});
S('f_results', () => {
  const g = office(); const bin = G(cyl(.3, .25, .6, '#9aa0a8', 0, .3, 0, 24)); bin.position.set(0, 0, -.4); g.add(bin);
  const ps = []; for (let i = 0; i < 14; i++) { const p = panel(.25, .32, textTex([['TEST RESULT', 30, '#333', 40], ['VOID', 80, RED, 170]], { w: 200, h: 256 }), 0, 0, 0); p.material.side = THREE.DoubleSide; g.add(p); ps.push(p); }
  return { g, sky: IN, pill: '2 YEARS OF RESULTS THROWN OUT', pillColor: RED, pillAt: .2, focus: V(0, .5, -.4), cam: dolly(V(.8, 1.6, 1.8), V(.5, 1.5, 1.5), V(0, .7, -.4)),
    upd: lt => ps.forEach((p, i) => { const k = ((lt * .9 + i / 14) % 1); p.position.set(Math.sin(i * 2.3) * .2 * (1 - k), lerp(2.4, .4, k), -.4 + Math.cos(i * 1.7) * .15 * (1 - k)); p.rotation.set(i + lt * 2, i * 2 + lt, 0); p.visible = lt > i * .1; }) };
});
S('f_zero', () => {
  const g = dark('#1e2433'); const tex = counterTex(fmt(4.5e9)); const p = panel(4.8, 1.6, tex, 0, 1.7, 0, 0, true); g.add(p); let last = '';
  const draw = (v) => { const c = tex.userData.ctx; const nt = counterTex(v); p.material.map = nt; p.material.needsUpdate = true; };
  return { g, sky: ['#1e2433', '#252c3e', '#2c3448'], dim: .6, pill: 'FORBES: $0', pillColor: RED, pillAt: 2.8, focus: V(0, 1.7, 0), cam: dolly(V(0, 1.7, 4.2), V(0, 1.7, 3.6), V(0, 1.7, 0)),
    upd: lt => { const k = ease((lt - .8) / 1.8); const v = fmt(4.5e9 * (1 - k)); if (v !== last) { last = v; draw(v); } p.position.x = lt > 2.6 && lt < 3.0 ? Math.sin(lt * 60) * .05 : 0; } };
});
S('f_shut', () => {
  const g = hq(); const s = sign('CLOSED', { bg: RED, fg: '#fff', w: 2.4 }); s.position.set(0, 1.6, .2); g.add(s);
  return { g, sky: ['#2a2f5a', '#5a4a7a', '#c98a7a'], dim: .65, pill: 'SHUT DOWN · 2018', pillColor: DARK, pillAt: .2, focus: V(0, 3, -3), sun: [-6, 12, 8], cam: dolly(V(-1.5, 2, 20), V(0, 2.2, 17), V(0, 3.6, -3)),
    upd: lt => pop(s, lt, .4) };
});
S('f_charge', () => {
  const g = street({ night: true }); const c1 = car(-3.2, 7.6, .25, '#ffffff', true), c2 = car(3.6, 8.0, -.3, '#ffffff', true); g.add(c1, c2);
  const cops = [0, 1].map(i => { const c = extra(i + 130, { top: '#1f2b4d', pants: '#1a2440', cap: '#1f2b4d', hairStyle: 'short' }); g.add(at(c, -1 + i * 2, 0, 1.4 + i * .3, i ? -.3 : .3)); return c; });
  const red = new THREE.PointLight('#ff3b3b', 30, 14), blue = new THREE.PointLight('#3b6bff', 30, 14); red.position.set(-3.5, 1.6, 7.4); blue.position.set(3.9, 1.6, 7.8); g.add(red, blue);
  return { g, sky: NIGHT, night: true, pill: 'CHARGED WITH FRAUD', pillColor: RED, pillAt: .3, focus: V(0, 1, 2), sun: [-6, 12, 8], cam: dolly(V(.4, 2.4, 13), V(.2, 2.2, 11.5), V(0, 1.6, 0)),
    upd: lt => { const on = Math.floor(lt * 4) % 2; red.intensity = on ? 40 : 5; blue.intensity = on ? 5 : 40; cops.forEach((c, i) => idle(c, lt + i)); } };
});

// ================= ENDING =================
S('e_jury', () => {
  const g = court(); const jury = g.userData.jury;
  return { g, sky: IN, pill: 'GUILTY', pillColor: RED, pillAt: 2.2, focus: V(3, 1, -1), cam: dolly(V(1.2, 1.7, 1.6), V(1.6, 1.65, 1.2), V(5.2, 1.1, -1.4)),
    upd: lt => jury.forEach((p, i) => blink(p, lt + i)) };
});
S('e_sent', () => {
  const g = court(); const h = holmes({ top: '#2a2d3a', turtle: false, shirt: '#f2efe8', pants: '#2a2d3a' }); g.add(at(h, -1.8, 0, .4, Math.PI)); const j = g.userData.judge;
  return { g, sky: IN, pill: '11 YEARS IN PRISON', pillColor: RED, pillAt: .6, focus: V(0, 1, -2), cam: dolly(V(-3.6, 1.7, 1.4), V(-3.3, 1.7, 1.0), V(-.8, 1.4, -3)),
    upd: lt => { idle(h, lt); talk(j, lt); blink(j, lt); } };
});
S('e_sunny', () => {
  const g = court(); const s = sunny(); g.add(at(s, 1.4, 0, .4, Math.PI));
  return { g, sky: IN, pill: 'SUNNY: ALMOST 13 YEARS', pillColor: RED, pillAt: .2, focus: V(0, 1, -1), cam: dolly(V(-.4, 1.6, -2.2), V(-.1, 1.6, -1.8), V(1.4, 1.5, .4)),
    upd: lt => idle(s, lt) };
});
S('e_texas', () => {
  const g = prison();
  return { g, sky: ['#9fc3ec', '#e8d9c0', '#f2e2c8'], pill: 'TEXAS · TODAY', pillColor: '#7b4b2c', pillAt: .3, focus: V(0, 2, -5), sun: [-6, 12, 8], cam: dolly(V(-3, 1.7, 10), V(1, 1.9, 9), V(0, 2, -6)) };
});
S('e_wish', () => {
  const g = bedroom(); const k = kidLiz({ smile: 1 }); g.add(at(k, 0, 0, -.6)); pose(k, [0, 0, -2.4], [0, 0, 2.4], 0, 0);
  const t = tag('$1,000,000,000', { bg: '#ffd23f', fg: '#3a2a10', h: .4 }); t.position.set(0, 1.75, -.6); g.add(t);
  return { g, sky: IN, pill: 'SHE GOT HER WISH', pillColor: GOLD, pillAt: .4, focus: V(0, 1, -.6), cam: dolly(V(.8, 1.4, 2.4), V(.4, 1.35, 2.0), V(0, 1.3, -.6)),
    upd: lt => { blink(k, lt); pop(t, lt, .2); } };
});
S('e_lost', () => {
  const g = dark('#241f38'); pedestal(g); const e = edison('ERROR', '#ff5a5a'); e.position.set(0, .9, 0); g.add(e); spotOn(g, 0, 5, 2, 0, 1, 0, '#fff4e0', 60);
  const t = tag('$0', { bg: RED, fg: '#fff', h: .45 }); t.position.set(1.1, 1.75, 0); g.add(t);
  return { g, sky: PURPLE, dim: .35, pill: 'SOLD AS A MIRACLE', pillColor: '#8a3fd1', pillAt: 2.6, focus: V(0, 1, 0), cam: dolly(V(-2.4, 2.4, 3.6), V(-1.0, 1.6, 2.4), V(0, 1.3, 0)),
    upd: lt => pop(t, lt, 1.0) };
});
S('e_sub', () => {
  const g = dark('#2c2350'); const h = holmes(); g.add(at(h, -1.2, 0, -.5, .3)); const e = edison('ERROR', '#ff5a5a'); e.position.set(1.0, 0, -.4); e.rotation.y = -.4; g.add(e); spotOn(g, 0, 6, 3, 0, 1, 0, '#ffe9f4', 60);
  return { g, sky: PURPLE, dim: .4, title: ['RISE & RUIN', 'SUBSCRIBE FOR MORE TRUE STORIES'], focus: V(0, 1, 0), cam: dolly(V(0, 1.4, 4.6), V(0, 1.5, 4.0), V(0, 1.7, 0)),
    upd: lt => idle(h, lt) };
});
