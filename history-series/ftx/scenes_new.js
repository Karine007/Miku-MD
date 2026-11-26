
// ================= LONG-FORM EXTRA SCENES (appended to scenes.js by ../longform/build_long.sh) =================
import { house, heart } from './kit.js';
import { father, mother, oldMan } from './sets.js';
const GLASS = (night) => canvasTex(256, 512, (c, w, h) => { c.fillStyle = night ? '#1d2a44' : '#8fb6d8'; c.fillRect(0, 0, w, h); for (let i = 0; i < 5; i++) for (let j = 0; j < 14; j++) { c.fillStyle = night ? (((i * 7 + j * 3) % 4) ? '#24304d' : '#ffd88a') : ((i + j) % 3 ? '#a9c9e6' : '#7aa5cc'); c.fillRect(8 + i * 50, 8 + j * 36, 40, 28); } });
function bldg(w, h, d, label, bg, fg, night) { const g = G(); const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), M('#fff', { map: GLASS(night) })); b.position.y = h / 2; b.castShadow = b.receiveShadow = true; g.add(b); g.add(box(w + .3, .4, d + .3, '#e6e6ea', 0, h + .2, 0)); const s = sign(label, { bg, fg, w: w * .8, px: 130 }); s.position.set(0, 3, d / 2 + .03); g.add(s); g.add(box(2.4, 2.2, .1, '#e6e6ea', 0, 1.1, d / 2 + .02)); return g; }
function lineChart(f, col, n = 40) { const g = G(box(8, 5, .1, '#ffffff', 0, 2.5, -2)); const pts = []; for (let i = 0; i < n; i++) { const x = -3.6 + i * 7.2 / (n - 1); pts.push(V(x, .7 + f(i / (n - 1)) * 3.8, -1.9)); } const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: col })); g.add(line); const dots = pts.map(p => { const s = sph(.07, col, p.x, p.y, p.z); g.add(s); return s; }); g.userData.draw = k => { const m = Math.floor(clamp(k) * n); line.geometry.setDrawRange(0, m); dots.forEach((s, i) => s.visible = i < m); }; return g; }
function chatTex(rows) { return canvasTex(400, 800, (c, w, h) => { c.fillStyle = '#eef1f6'; c.fillRect(0, 0, w, h); c.fillStyle = '#2f7de1'; c.fillRect(0, 0, w, 90); c.fillStyle = '#fff'; c.font = FONT(36); c.textAlign = 'center'; c.fillText('#expenses', w / 2, 60); c.textAlign = 'left';
  rows.forEach((r, i) => { const y = 130 + i * 160; c.fillStyle = r[1] ? '#d8f5c8' : '#ffffff'; rr(c, r[1] ? 120 : 24, y, 256, 110, 24); c.fill(); c.fillStyle = '#222'; c.font = FONT(30, 800); c.fillText(r[0], r[1] ? 140 : 44, y + 66);
    if (r[1]) { c.fillStyle = '#ffcf3a'; c.beginPath(); c.arc(330, y + 55, 34, 0, 7); c.fill(); c.fillStyle = '#5a3a10'; c.beginPath(); c.arc(318, y + 46, 5, 0, 7); c.arc(342, y + 46, 5, 0, 7); c.fill(); c.lineWidth = 5; c.strokeStyle = '#5a3a10'; c.beginPath(); c.arc(330, y + 58, 16, .3, 2.84); c.stroke(); } }); }); }

S('n_famous', () => {
  const g = stage({ big: 'CRYPTO BAHAMAS', small: 'FTX PRESENTS', c1: '#1aa0c8', c2: '#0b1426' }); const s = at(sam(), -1.2, .62, -4); const p = at(oldMan(2, { hair: '#e8e8ea' }), .2, .62, -4); const st = at(extra(4, { top: '#e8579a', hairStyle: 'long', hair: '#d8b06a' }), 1.6, .62, -4); g.add(s, p, st);
  const t = tag('FORMER PRESIDENTS · SUPERSTARS', { fg: GOLD, h: .42 }); t.position.set(0, 2.55, -2.6); g.add(t);
  return { g, sky: NIGHT, night: true, dim: 1.3, focus: V(0, 1.6, -4), cam: dolly(V(-1.4, 2.4, 6), V(.6, 2.2, 4.4), V(0, 1.9, -4)), upd: lt => { idle(s, lt); idle(p, lt + 1); idle(st, lt + 2); wave(st, lt); talk(p, lt); pop(t, lt, .5); } };
});
S('n_vanish', () => {
  const g = dark('#1c1a2e'); const vault = G(box(5, 4, .4, '#6a7180', 0, 2, 0)); const hole = cyl(1.5, 1.5, .5, '#14121e', 0, 2, .05, 40); hole.rotation.x = Math.PI / 2; vault.add(hole); g.add(at(vault, 0, 0, -3.6));
  const door = G(cyl(1.55, 1.55, .3, '#9aa3b0', 0, 0, 0, 40)); door.children[0].rotation.x = Math.PI / 2; for (let k = 0; k < 6; k++) { const sp = box(.08, 1.2, .08, '#c9ccd4', 0, 0, .2); sp.rotation.z = k * Math.PI / 3; door.add(sp); } const pivot = G(door); door.position.x = 1.55; pivot.position.set(-1.55, 2, -3.2); g.add(pivot);
  const c = big('$8 BILLION', RED, '#ffffff', 3, 200); c.position.set(0, 4.6, -3.3); g.add(c); const gone = tag('GONE', { bg: RED, fg: '#fff', h: .7 }); gone.position.set(0, 2, -2.6); g.add(gone);
  const ms = []; for (let i = 0; i < 10; i++) { const m = money(1, 0, 0); g.add(m); ms.push(m); }
  return { g, sky: NIGHT, night: true, dim: 1.4, focus: V(0, 2.4, -3), cam: dolly(V(0, 2.6, 6.4), V(0, 2.7, 5), V(0, 2.8, -3)), upd: (lt, u) => { pivot.rotation.y = -ease(lt / 1.4) * 1.7; pop(c, lt, .2); pop(gone, lt, 99); if (u > .6) pop(gone, lt, 0); ms.forEach((m, i) => { const ph = clamp(lt * .6 - i * .08); m.visible = ph > 0 && ph < 1; m.position.set(Math.sin(i * 2.1) * ph * 4, 2 + ph * 3, -3.4 + ph * 5); m.rotation.set(lt * 3 + i, lt, 0); }); } };
});
S('n_parents', () => {
  const g = G(ground('#86c070'), strip(30, 6, '#d7d2c9', 0, 5, .012)); g.add(house(0, -4, { wall: '#e6d6b0', roof: '#a0523a', shutter: '#4a6a8a' })); g.add(palm(-7, -3, 1.1), palm(7, -2, 1), tree(-10, -7, 1.2), clouds());
  const f = at(father({ glasses: '#333' }), -1.4, 0, 1.4), m = at(mother({ glasses: '#333' }), 1.4, 0, 1.4), k = at(sam({ kid: true, top: '#5c79c9' }), 0, 0, 1.8); g.add(f, m, k);
  const t = tag('PARENTS: STANFORD LAW PROFESSORS', { fg: '#8c1515', h: .32 }); t.position.set(0, 2.3, 1.4); g.add(t); const w = tag('MATH WHIZ  π ∑ √', { fg: BLUE, h: .26 }); w.position.set(0, 1.55, 2.1); g.add(w);
  return { g, sky: OUT, name: ['SAM BANKMAN-FRIED', 'CALIFORNIA'], focus: V(0, 1, 1), cam: dolly(V(-1, 1.9, 9), V(0, 1.7, 7), V(0, 1.4, 0)), upd: (lt, u) => { idle(f, lt); idle(m, lt + 1); idle(k, lt + 2); pop(t, lt, .5); pop(w, lt, 99); if (u > .62) pop(w, lt, 0); } };
});
S('n_give', () => {
  const g = dark('#24304a'); const s = at(sam(), -1.8, 0, -.6, .4); g.add(s); const h = heart('#e8579a'); h.scale.setScalar(1.6); h.position.set(2, 2.2, -1.6); g.add(h);
  const pile = money(16, 0, 0); pile.position.set(-.4, 0, -1); g.add(pile); const ms = []; for (let i = 0; i < 8; i++) { const m = money(1, 0, 0); m.scale.setScalar(.6); g.add(m); ms.push(m); }
  const t = tag('MAKE MONEY → GIVE IT AWAY', { fg: PINK, h: .38 }); t.position.set(0, 3.1, -1.4); g.add(t);
  return { g, sky: NIGHT, night: true, dim: 1.4, pill: 'EARN TO GIVE', pillColor: PINK, focus: V(0, 1.6, -1), cam: dolly(V(0, 2.2, 6.4), V(0, 2.2, 5.2), V(0, 2, -1)), upd: lt => { idle(s, lt); pop(t, lt, .4); h.rotation.y = Math.sin(lt * 1.5) * .4; ms.forEach((m, i) => { const ph = (lt * .45 + i / 8) % 1; m.position.set(-.4 + ph * 2.4, .8 + Math.sin(ph * Math.PI) * 2, -1.2 - ph * .4); m.rotation.y = lt * 2 + i; }); } };
});
S('n_japan', () => {
  const g = dark('#1e2a3e'); const a = card([['USA', 90, '#ffffff', 150], ['$10,000', 150, '#7fd0ff', 340]], { w: 2.6, cw: 900, h: 512, bg: '#1d3a6a', basic: true }); a.position.set(-2.2, 2.6, -2.4);
  const b = card([['JAPAN', 90, '#ffffff', 150], ['$11,000', 150, '#ffd23f', 340]], { w: 2.6, cw: 900, h: 512, bg: '#a01e2e', basic: true }); b.position.set(2.2, 2.6, -2.4); g.add(a, b);
  const coin = cyl(.45, .45, .12, '#f2a33a', 0, 0, 0, 32); coin.rotation.x = Math.PI / 2; const cs = G(coin); const bt = sign('₿', { bg: 'none', fg: '#fff', w: .6, px: 200 }); bt.position.z = .07; cs.add(bt); g.add(cs);
  const p = tag('+ $1,000 PROFIT', { fg: GREEN, h: .45 }); p.position.set(2.2, .75, -2.2); g.add(p); const s = at(sam(), 0, 0, 0); g.add(s);
  return { g, sky: NIGHT, night: true, dim: 1.4, pill: 'BUY CHEAP, SELL HIGH', pillColor: GREEN, focus: V(0, 2, -2), cam: dolly(V(0, 2.3, 6.4), V(0, 2.3, 5.4), V(0, 2.2, -2)), upd: lt => { idle(s, lt); pop(a, lt, .1); pop(b, lt, .4); const ph = (lt * .5) % 1; cs.position.set(-2.2 + ph * 4.4, 1.5 + Math.sin(ph * Math.PI) * 1.4, -2); cs.rotation.y = lt * 4; pop(p, lt, 1.4); } };
});
S('n_bahamas', () => {
  const g = bahamas({}); const tw = bldg(5, 9, 5, 'PENTHOUSE', '#0b1426', FTXC); tw.position.set(-10, 0, -10); g.add(tw); const s1 = at(ftxSign(2.6), 0, 3.6, -4.4); g.add(s1);
  const ppl = [sam(), caroline(), extra(11), extra(14)].map((p, i) => { at(p, -1.8 + i * 1.2, 0, 1.4, 0); g.add(p); return p; });
  const t = tag('FTX MOVES TO THE BAHAMAS', { fg: TEAL, h: .38 }); t.position.set(0, 2.35, 1.4); g.add(t);
  return { g, sky: OUT, focus: V(0, 1.4, 0), sun: [8, 14, 8], cam: dolly(V(3, 2.2, 11), V(1, 2.4, 8.4), V(-1, 2.2, -2)), upd: lt => { ppl.forEach((p, i) => idle(p, lt + i)); pop(t, lt, .4); } };
});
S('n_congress', () => {
  const g = room({ w: 14, d: 10, h: 4.4, wall: '#e9e2d0', side: '#ded5c0', floor: flat('#3d4f7a', 4) }); const dais = box(10, 1.3, 1, '#7b4b2c', 0, .65, -3.4); g.add(dais); g.add(box(10, .2, 1.4, '#5e3820', 0, 1.35, -3.4));
  const s0 = sign('U.S. CONGRESS · HEARING', { bg: '#5e3820', fg: '#e9d29a', w: 4.2, px: 110 }); s0.position.set(0, 2.85, -4.95); g.add(s0);
  const reps = [0, 1, 2, 3, 4].map(i => { const p = oldMan(i); sit(p); at(p, -4 + i * 2, .6, -3.95); g.add(p); return p; });
  g.add(desk(1.6, .8, 0, .6, '#6e3f22')); const s = at(sam({ top: '#2e3550', shirt: '#ffffff', tie: '#3a4a8a' }), 0, 0, 1.3, Math.PI); g.add(s); g.add(cyl(.02, .02, .3, '#222', 0, .95, .4, 8));
  const d = tag('$ TENS OF MILLIONS TO POLITICIANS', { fg: GREEN, h: .34 }); d.position.set(0, 2.6, -2); g.add(d);
  return { g, sky: IN, pill: 'TESTIFIED IN CONGRESS', pillColor: BLUE, focus: V(0, 1.3, -1), cam: dolly(V(3.4, 2.2, 5.6), V(2.2, 2.1, 4.6), V(0, 1.4, -1.8)), upd: (lt, u) => { reps.forEach((p, i) => idle(p, lt + i)); idle(s, lt); talk(s, lt); pop(d, lt, 99); if (u > .5) pop(d, lt, 0); } };
});
S('n_two', () => {
  const g = G(ground('#9aa0a8'), strip(60, 8, '#5b5d66', 0, 6)); const a = bldg(6, 12, 6, 'FTX', '#0b1426', FTXC); a.position.set(-5, 0, -4); const b = bldg(6, 10, 6, 'ALAMEDA', '#1b1b1f', '#ffffff'); b.position.set(5, 0, -4); g.add(a, b);
  const wall = box(.4, 3, 8, '#d63a3a', 0, 1.5, -4); g.add(wall); const t = tag('SEPARATE COMPANIES', { fg: '#333', h: 1.2 }); t.position.set(0, 7.5, -1); g.add(t); g.add(at(skyline({ n: 16, seed: 5 }), 0, 0, -40), clouds());
  return { g, sky: OUT, focus: V(0, 4, -4), sun: [10, 18, 10], cam: dolly(V(0, 3, 20), V(0, 4, 16), V(0, 5, -4)), upd: lt => pop(t, lt, .4) };
});
S('n_backdoor', () => {
  const g = G(ground('#2f3a4a'), strip(60, 8, '#2c2e38', 0, 6)); const a = bldg(6, 12, 6, 'FTX', '#0b1426', FTXC, true); a.position.set(-5, 0, -4); const b = bldg(6, 10, 6, 'ALAMEDA', '#1b1b1f', '#ffffff', true); b.position.set(5, 0, -4); g.add(a, b);
  const pipe = cyl(.3, .3, 10, '#ffd23f', 0, .5, -.6, 20); pipe.rotation.z = Math.PI / 2; pipe.material = B('#ffd23f'); g.add(pipe);
  const ms = []; for (let i = 0; i < 6; i++) { const m = money(1, 0, 0); m.scale.setScalar(.7); g.add(m); ms.push(m); }
  const t = tag('SECRET BACKDOOR', { bg: RED, fg: '#fff', h: 1.1 }); t.position.set(0, 3.6, -.6); g.add(t); const u2 = tag('UNLIMITED BORROWING', { fg: RED, h: .7 }); u2.position.set(0, 2.4, -.6); g.add(u2);
  return { g, sky: NIGHT, night: true, focus: V(0, 2, -2), cam: dolly(V(-2, 3, 13), V(1, 2.6, 10.4), V(0, 2.4, -2)), upd: lt => { pop(t, lt, .3); pop(u2, lt, 1.2); ms.forEach((m, i) => { const ph = (lt * .35 + i / 6) % 1; m.position.set(-4.5 + ph * 9, .9, -.6); m.rotation.y = lt * 2; }); } };
});
S('n_bets', () => {
  const g = dark('#1c1a2e'); const screens = []; for (let i = 0; i < 3; i++) { const sc = lineChart(k => 1 - k * k * .95 + Math.sin(k * 20) * .03, RED); sc.scale.setScalar(.42); sc.position.set(-2.6 + i * 2.6, 1.1, -2.4); g.add(sc); screens.push(sc); }
  const c = at(caroline(), 0, 0, .4, Math.PI); g.add(c); const t = tag('− $ BILLIONS', { bg: RED, fg: '#fff', h: .6 }); t.position.set(0, 3.6, -1.6); g.add(t); const cr = tag('CRYPTO CRASH 2022', { fg: RED, h: .34 }); cr.position.set(0, 3, -1.6); g.add(cr);
  return { g, sky: NIGHT, night: true, dim: 1.4, focus: V(0, 1.8, -2), cam: dolly(V(-1, 2.3, 5.6), V(0, 2.3, 4.6), V(0, 2, -2)), upd: lt => { idle(c, lt); screens.forEach(s => s.userData.draw(lt / 2)); pop(cr, lt, .3); pop(t, lt, 1.4); } };
});
S('n_tweet', () => {
  const g = dark('#1c2a40'); const ph = phone(canvasTex(400, 800, (c, w, h) => { c.fillStyle = '#ffffff'; c.fillRect(0, 0, w, h); c.fillStyle = '#5fcade'; c.beginPath(); c.arc(60, 90, 34, 0, 7); c.fill(); c.fillStyle = '#111'; c.font = FONT(30); c.fillText('SBF', 110, 85); c.fillStyle = '#777'; c.font = FONT(22, 800); c.fillText('@SBF_FTX', 110, 115);
    c.fillStyle = '#111'; c.font = FONT(46); c.fillText('FTX is fine.', 30, 230); c.fillText('Assets are fine.', 30, 300); c.fillStyle = '#999'; c.font = FONT(22, 800); c.fillText('Nov 7, 2022', 30, 360); }), { w: 1.3 }); ph.position.set(0, 2.4, -1); g.add(ph);
  const x = tag('DELETED', { bg: RED, fg: '#fff', h: .7 }); x.position.set(0, 2.4, -.7); x.material.rotation = -.2; g.add(x);
  return { g, sky: NIGHT, night: true, dim: 1.4, focus: V(0, 2.4, -1), cam: dolly(V(-.4, 2.4, 4.6), V(0, 2.4, 3.6), V(0, 2.4, -1)), upd: (lt, u) => { pop(ph, lt, .1); pop(x, lt, 99); if (u > .62) pop(x, lt, 0); } };
});
S('n_ray', () => {
  const g = office(); const r = at(oldMan(3, { hair: '#d8d8dc', hairStyle: 'short', glasses: '#333' }), 0, 0, -1.4); g.add(r);
  const boxes = []; for (let i = 0; i < 9; i++) { const b = box(.6, .4, .45, '#c9a27a', -2.6 + (i % 3) * .65 + (i > 5 ? 4.5 : 0), .2 + Math.floor((i % 6) / 3) * .42, -2.4); g.add(b); boxes.push(b); }
  const t = tag('HE CLEANED UP ENRON', { fg: '#333', h: .36 }); t.position.set(0, 2.6, -1.2); g.add(t);
  return { g, sky: IN, name: ['JOHN J. RAY III', 'NEW CEO OF FTX'], focus: V(0, 1.4, -1.4), cam: dolly(V(-.8, 1.8, 4.6), V(0, 1.7, 3.6), V(0, 1.5, -1.6)), upd: lt => { idle(r, lt); pop(t, lt, 1.2); } };
});
S('n_quote', () => {
  const g = dark('#1c1a2e'); const q = card([['“NEVER IN MY CAREER…', 92, '#ffffff', 160], ['a complete failure of', 76, '#ffd23f', 300], ['corporate controls”', 76, '#ffd23f', 390]], { w: 4, cw: 1400, h: 520, bg: '#1c1a2e', basic: true }); q.position.set(0, 2.6, -2); g.add(q);
  const by = tag('— JOHN J. RAY III', { fg: '#333', h: .3 }); by.position.set(1.2, 1.4, -1.8); g.add(by);
  return { g, sky: NIGHT, night: true, focus: V(0, 2.4, -2), cam: dolly(V(0, 2.4, 5.6), V(0, 2.4, 4.4), V(0, 2.4, -2)), upd: lt => { pop(q, lt, .2); pop(by, lt, 1.2); } };
});
S('n_chaos', () => {
  const g = hqRoom(); const ph = phone(chatTex([['Approve $$$?', 0], ['', 1], ['Approve $$$$?', 0], ['', 1]]), { w: 1.1 }); ph.position.set(-1.4, 2.2, -1.4); g.add(ph);
  const notes = []; for (let i = 0; i < 9; i++) { const n = panel(.3, .3, flat(['#f6e58a', '#f7c2d6', '#bfe3f7'][i % 3]), 1 + (i % 3) * .42, 1.6 + Math.floor(i / 3) * .42, -2.4); n.rotation.z = (i % 2 ? .15 : -.12); g.add(n); notes.push(n); }
  const t = tag('APPROVED WITH EMOJI', { fg: RED, h: .38 }); t.position.set(1.5, 3.1, -1.4); g.add(t); const r = tag('NO PROPER RECORDS', { fg: '#333', h: .3 }); r.position.set(1.6, 1.1, -2.2); g.add(r);
  return { g, sky: IN, focus: V(0, 2, -1.8), cam: dolly(V(0, 2.2, 4.6), V(0, 2.2, 3.8), V(0, 2.1, -2)), upd: (lt, u) => { pop(ph, lt, .1); pop(t, lt, .5); notes.forEach((n, i) => pop(n, lt, 99)); if (u > .45) { notes.forEach((n, i) => pop(n, lt, i * .06 + 0)); pop(r, lt, .5); } else r.visible = false; } };
});
S('n_house', () => {
  const g = G(ground('#86c070'), strip(30, 6, '#d7d2c9', 0, 5, .012)); g.add(house(0, -4, { wall: '#dcd3c3', roof: '#5d5866' }), tree(-8, -3, 1.2), tree(8, -2, 1.1), clouds());
  const s = at(sam(), 0, 0, 1.6); g.add(s); const mon = box(.14, .1, .14, '#1b1b20', -.1, .12, 1.62); g.add(mon); const led = sph(.025, '#ff3b3b', -.1, .18, 1.7); led.material = B('#ff3b3b'); g.add(led);
  const b = big('$250 MILLION BOND', GREEN, '#ffffff', 3.4, 115); b.position.set(0, 3.9, -.9); g.add(b); const t = tag("HOUSE ARREST · PARENTS' HOME", { fg: '#333', h: .32 }); t.position.set(0, 2.5, 1.6); g.add(t);
  return { g, sky: OUT, focus: V(0, 1.5, 0), cam: dolly(V(-1, 2, 9), V(0, 2, 7.2), V(0, 2, -1)), upd: lt => { idle(s, lt); pop(b, lt, .3); pop(t, lt, 1.2); led.visible = (lt * 2 % 1) < .5; } };
});
S('n_jail', () => {
  const g = prison(); const s = at(sam({ top: '#2e3550' }), .6, 0, 4, Math.PI); g.add(s); const o = at(extra(7, { top: '#1d2a44', cap: '#1d2a44' }), -.4, 0, 4.2, Math.PI); g.add(o);
  const t = tag('BAIL REVOKED', { bg: RED, fg: '#fff', h: .6 }); t.position.set(0, 3, 2); g.add(t); const w = tag('WITNESS TAMPERING', { fg: RED, h: .34 }); w.position.set(0, 2.3, 2); g.add(w);
  return { g, sky: GREY, focus: V(0, 1.4, 1), cam: dolly(V(2, 1.8, 10), V(1, 1.8, 8.6), V(0, 1.6, 0)), upd: (lt, u) => { s.position.z = 4 - u * 2.2; o.position.z = 4.2 - u * 2.2; walk(s, lt, 5, .3); walk(o, lt + .3, 5, .3); pop(t, lt, .4); pop(w, lt, 1); } };
});
S('n_stand', () => {
  const g = court(); const s = at(sam({ top: '#2e3550', shirt: '#ffffff', tie: '#3a4a8a' }), -2.6, .1, -2.3); g.add(s);
  const ts = [[-3.6, 2.5], [-1.4, 2.9], [-3.1, 3.2], [-1.6, 2.2]].map(([x, y], i) => { const t = tag('"I don\'t recall"', { fg: i % 2 ? BLUE : '#333', h: .3 }); t.position.set(x, y, -2); g.add(t); return t; });
  return { g, sky: IN, pill: '"I DON\'T REMEMBER"', pillColor: BLUE, focus: V(-2.6, 1.6, -2.3), cam: dolly(V(-.6, 2, 2.6), V(-1.2, 1.9, 1.6), V(-2.6, 1.8, -2.4)), upd: lt => { idle(s, lt); talk(s, lt); ts.forEach((t, i) => pop(t, lt, .5 + i * .7)); } };
});
S('n_repay', () => {
  const g = street(); const ps = [0, 1, 2, 3, 4].map(i => { const p = crowdP(i + 3); p.position.set(-3 + i * 1.5, 0, 2); g.add(p); const ph = phone(phoneTex([['REFUND', 80, '#2ecc71', 320], ['118%', 110, '#ffffff', 470]]), { w: .18 }); ph.position.set(.18, 1.25, .25); ph.rotation.x = -.4; p.add(ph); pose(p, [0, 0, 0], [-1.1, 0, .2], 0, -1.2); return p; });
  const b = big('MONEY BACK (IN DOLLARS)', GREEN, '#ffffff', 4.4, 95); b.position.set(0, 3.4, 0); g.add(b);
  return { g, sky: OUT, focus: V(0, 1.8, 1), cam: dolly(V(0, 2.2, 9), V(0, 2.3, 7.2), V(0, 2.2, 0)), upd: lt => { ps.forEach((p, i) => { idle(p, lt + i); }); pop(b, lt, .4); } };
});
S('n_btc', () => {
  const g = G(strip(40, 40, '#e9e6e0', 0, 0)); const ch = lineChart(k => k < .15 ? .1 : .1 + Math.pow((k - .15) / .85, 1.4) * .9 + Math.sin(k * 30) * .03, GREEN); g.add(ch);
  const a = tag('NOV 2022: CUSTOMERS PAID HERE', { fg: RED, h: .3 }); a.position.set(-1.6, 1.6, -1.6); const b = tag('CRYPTO TODAY', { fg: GREEN, h: .42 }); b.position.set(2.2, 5.1, -1.6); g.add(a, b);
  return { g, sky: GREY, pill: 'CRYPTO SOARED', pillColor: GREEN, focus: V(0, 2.4, -2), cam: dolly(V(0, 2.5, 6.4), V(0, 2.5, 5.2), V(0, 2.5, -2)), upd: (lt, u) => { ch.userData.draw(u * 1.4); pop(a, lt, .3); pop(b, lt, 99); if (u > .7) pop(b, lt, 0); } };
});
