// "Le Piège Photo" — original French horror short, vertical 1080x1920, flat doodle cartoon style.
// Original story, characters (Inès, Malik, Théo) and creature. render(t) is a pure function of time;
// the beat timeline (window.FILM) comes from src/make_voice.py so visuals follow the Gemini narration.
const W = 1080, H = 1920;
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, k) => a + (b - a) * k;
const ease = k => k * k * (3 - 2 * k);
const seg = (t, a, b) => clamp((t - a) / (b - a));
const INK = '#23201d';

export function create(canvas) {
  const ctx = canvas.getContext('2d');
  // ---------- deterministic jitter ("line boil" at 8 fps, like hand-drawn animation)
  let rs = 1;
  const rnd = () => { rs = (rs * 16807) % 2147483647; return (rs - 1) / 2147483646; };
  let boil = 0;
  const J = () => 0;
  // ---------- sketchy primitives
  let FLAT = true;
  const shade = (hex, k) => { if (typeof hex !== 'string' || hex[0] !== '#') return hex; let h = hex.slice(1); if (h.length === 3) h = h.split('').map(c => c + c).join('');
    const n = parseInt(h, 16); const f = v => Math.round(clamp(v * (1 + k), 0, 255)); return `rgb(${f(n >> 16 & 255)},${f(n >> 8 & 255)},${f(n & 255)})`; };
  function path(pts, { close = false, fill = null, stroke = INK, w = 4, j = 1.4, alpha = 1 } = {}) {
    if (FLAT && stroke) { if (fill) { stroke = shade(fill, -0.22); w = Math.min(w, 3); } else if (stroke === INK) { stroke = '#5b4a3e'; w = w * 0.8; } }
    ctx.save(); ctx.globalAlpha = alpha; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    const P = pts.map(([x, y]) => [x + J(j), y + J(j)]);
    if (fill) { ctx.beginPath(); P.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.closePath(); ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) {
      ctx.strokeStyle = stroke; ctx.lineWidth = w; ctx.beginPath();
      const Q = close ? [...P, P[0]] : P;
      Q.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
      ctx.stroke();
    }
    ctx.restore();
  }
  const line = (x1, y1, x2, y2, w = 4, stroke = INK, j = 1.2) => path([[x1, y1], [x2, y2]], { w, stroke, j });
  const rect = (x, y, w, h, fill, o = {}) => path([[x, y], [x + w, y], [x + w, y + h], [x, y + h]], { close: true, fill, ...o });
  function circle(x, y, r, fill, o = {}) {
    const n = Math.max(10, Math.round(r / 2.5)), pts = [];
    for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2; pts.push([x + Math.cos(a) * r, y + Math.sin(a) * r]); }
    path(pts, { close: true, fill, j: Math.min(1.4, r / 12), ...o });
  }
  function text(s, x, y, size, { font = 'Kalam', color = INK, align = 'center', rot = 0, alpha = 1 } = {}) {
    ctx.save(); ctx.globalAlpha = alpha; ctx.translate(x, y); ctx.rotate(rot + J(0.004)); ctx.font = `bold ${Math.round(size * 0.82)}px DejaVu Sans`; ctx.fillStyle = color; ctx.textAlign = align; ctx.textBaseline = 'middle'; ctx.fillText(s, 0, 0); ctx.restore();
  }
  function wash(x, y, w, h, col, a = 0.5) { ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = col; ctx.fillRect(x, y, w, h); ctx.restore(); }

  // ---------- stick-figure rig (angles in radians measured from straight down; + = toward facing direction)
  const POSES = {
    stand: { lean: 0, head: 0, aL: [0.15, 0.1], aR: [-0.15, -0.1], lL: [0.08, 0], lR: [-0.08, 0] },
    sit: { lean: -0.05, head: 0, aL: [0.5, 1.2], aR: [0.4, 1.3], lL: [1.45, -1.45], lR: [1.35, -1.35], sit: 1 },
    mic: { lean: 0.15, head: 0.05, aL: [0.9, 1.4], aR: [0.4, 1.2], lL: [1.45, -1.45], lR: [1.35, -1.35], sit: 1 },
    phone: { lean: 0.05, head: -0.1, aL: [0.4, 1.0], aR: [2.4, 2.4], lL: [1.45, -1.45], lR: [1.35, -1.35], sit: 1 },
    think: { lean: 0, head: 0.15, aL: [0.3, 2.6], aR: [0.5, 1.6], lL: [1.45, -1.45], lR: [1.35, -1.35], sit: 1 },
    surprised: { lean: -0.18, head: -0.15, aL: [1.6, 0.6], aR: [1.4, 0.7], lL: [1.45, -1.45], lR: [1.35, -1.35], sit: 1 },
    listen: { lean: 0.1, head: 0.2, aL: [2.5, 2.6], aR: [0.5, 1.2], lL: [1.45, -1.45], lR: [1.35, -1.35], sit: 1 },
    cry: { lean: 0.35, head: 0.55, aL: [1.3, 2.5], aR: [1.2, 2.6], lL: [1.45, -1.45], lR: [1.35, -1.35], sit: 1 },
    scared: { lean: -0.15, head: -0.1, aL: [0.9, 1.6], aR: [0.8, 1.7], lL: [0.2, 0], lR: [-0.25, 0] },
    look: { lean: 0.05, head: 0.1, aL: [0.1, 0.1], aR: [-0.1, 0.2], lL: [0.06, 0], lR: [-0.06, 0] },
    binoculars: { lean: 0.08, head: 0, aL: [1.6, 1.4], aR: [1.4, 1.6], lL: [0.08, 0], lR: [-0.08, 0] },
    push: { lean: 0.5, head: 0.2, aL: [1.7, 0.2], aR: [1.5, 0.3], lL: [-0.5, 0.1], lR: [0.4, 0.4] },
    peek: { lean: 0.25, head: 0.25, aL: [1.2, 0.3], aR: [0.9, 1.4], lL: [0.1, 0], lR: [-0.25, 0] },
    reach: { lean: 0.1, head: -0.1, aL: [1.5, 0.2], aR: [0.2, 0.1], lL: [0.08, 0], lR: [-0.08, 0] },
    laugh: { lean: -0.2, head: -0.35, aL: [2.6, 0.3], aR: [2.4, 0.4], lL: [0.2, 0], lR: [-0.2, 0] },
    carry: { lean: 0.15, head: 0, aL: [0.9, 0.9], aR: [0.8, 1.0], lL: [0.1, 0], lR: [-0.1, 0] },
    pour: { lean: 0.3, head: 0.3, aL: [1.4, 0.8], aR: [1.0, 1.2], lL: [0.2, 0], lR: [-0.2, 0.2] },
    climb: { lean: 0, head: -0.4, aL: [3.0, 0.05], aR: [2.9, 0.05], lL: [0.4, -0.6], lR: [-0.1, -0.3] },
    sneak: { lean: 0.35, head: -0.2, aL: [0.6, 0.9], aR: [0.4, 1.0], lL: [0.6, -1.0], lR: [-0.2, -0.6] },
    freeze: { lean: 0, head: 0, aL: [0.05, 0], aR: [-0.05, 0], lL: [0.02, 0], lR: [-0.02, 0] },
    hug: { lean: 0.25, head: 0.2, aL: [1.5, 1.4], aR: [1.4, 1.5], lL: [0.1, 0], lR: [-0.15, 0] },
    zombie: { lean: 0.15, head: 0.35, aL: [1.5, 0.15], aR: [1.3, 0.25], lL: [0.12, 0], lR: [-0.15, 0.1] },
    wave: { lean: 0, head: -0.1, aL: [2.7, 0.6], aR: [0.2, 0.1], lL: [0.08, 0], lR: [-0.08, 0] },
  };
  function mixPose(a, b, k) { const o = {}; for (const key of Object.keys(a)) o[key] = Array.isArray(a[key]) ? a[key].map((v, i) => lerp(v, b[key][i], k)) : lerp(a[key], b[key] ?? 0, k); return o; }
  function walkPose(ph, base = POSES.stand, amt = 1) {
    const s = Math.sin(ph) * amt; return { ...base, lL: [0.55 * s, Math.max(0, -s) * 0.7], lR: [-0.55 * s, Math.max(0, s) * 0.7], aL: [-0.45 * s + base.aL[0] * 0.3, 0.3], aR: [0.45 * s + base.aR[0] * 0.3, 0.3], bob: Math.abs(Math.cos(ph)) * 4 * amt };
  }
  // character looks (original designs)
  const LOOK = {
    theo: { skin: '#f6dcc4', hair: 'messy', hairCol: '#c4632d', shirt: '#3f6fb5', pants: '#2f3440', shoes: '#e8e4da', sleeves: 1, lamp: 1 },
    malik: { skin: '#a8714c', hair: 'short', hairCol: '#1b1410', shirt: '#7a828d', pants: '#3b3f2e', shoes: '#c9452d', sleeves: 1, cap: '#3b7a45' },
    ines: { skin: '#e8b48a', hair: 'pony', hairCol: '#2a1a12', shirt: '#f0c330', pants: '#3c5a8c', shoes: '#5a3a2a', sleeves: 1 },
  };
  const SURV = ['#7a9a5a', '#b5577a', '#5a7ab5', '#c98a3a', '#8a6ab0'];
  let survN = 0;
  // thick outlined stroke (sleeves, trousers)
  function band(pts, col, wide, ink) {
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const go = () => { ctx.beginPath(); pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.stroke(); };
    ctx.strokeStyle = ink; ctx.lineWidth = wide + 7; go(); ctx.strokeStyle = col; ctx.lineWidth = wide; go();
  }
  function stick(pts, ink, w = 7) { ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = ink; ctx.lineWidth = w; ctx.beginPath(); pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.stroke(); }
  function blob(x, y, rx, ry, fill, ink, w = 4.5, rot = 0) { ctx.beginPath(); ctx.ellipse(x, y, rx, ry, rot, 0, Math.PI * 2); if (fill) { ctx.fillStyle = fill; ctx.fill(); } if (ink) { ctx.strokeStyle = ink; ctx.lineWidth = w; ctx.stroke(); } }
  function poly(P, fill, ink, w = 4.5) { ctx.lineJoin = 'round'; ctx.beginPath(); P.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.closePath(); if (fill) { ctx.fillStyle = fill; ctx.fill(); } if (ink) { ctx.strokeStyle = ink; ctx.lineWidth = w; ctx.stroke(); } }
  // x,y = feet position; s = scale (1 ~ 330px tall); dir = 1 faces right, -1 left
  function figure(x, y, s, pose, look = LOOK.theo, { dir = 1, face = 'neutral', talk = 0, ink = INK, t = 0, prop = null } = {}) {
    
    FLAT = false; ink = INK;
    const L = { thigh: 58, shin: 56, torso: 92, ua: 46, fa: 44 }, R = look.small ? 54 : 50;
    ctx.save(); ctx.translate(x, y - (pose.bob || 0) * s); ctx.scale(s * dir, s);
    // soft floor shadow
    ctx.save(); ctx.globalAlpha = 0.16; blob(0, 2, 62, 10, '#000', null); ctx.restore();
    const hipY = pose.sit ? -L.shin - 10 : -(L.thigh + L.shin) * (Math.cos(pose.lL[0]) * 0.5 + Math.cos(pose.lR[0]) * 0.5) * 0.98 - 6;
    const hip = [0, hipY];
    const leg = (hipA, kneeA, back) => {
      const k = [hip[0] + Math.sin(hipA) * L.thigh, hip[1] + Math.cos(hipA) * L.thigh];
      const f = [k[0] + Math.sin(hipA + kneeA) * L.shin, k[1] + Math.cos(hipA + kneeA) * L.shin];
      const pc = back ? shade(look.pants, -0.12) : look.pants;
      if (look.shorts) { band([hip, [lerp(hip[0], k[0], 0.75), lerp(hip[1], k[1], 0.75)]], pc, 24, ink); stick([[lerp(hip[0], k[0], 0.7), lerp(hip[1], k[1], 0.7)], k, f], ink, 7); }
      else band([hip, k, [lerp(k[0], f[0], 0.9), lerp(k[1], f[1], 0.9)]], pc, 22, ink);
      blob(f[0] + 9, f[1] - 4, 17, 9.5, back ? shade(look.shoes, -0.12) : look.shoes, ink, 4);
    };
    leg(...pose.lR, 1);
    const up = [Math.sin(pose.lean), -Math.cos(pose.lean)], nr = [Math.cos(pose.lean), Math.sin(pose.lean)];
    const neck = [hip[0] + up[0] * L.torso, hip[1] + up[1] * L.torso];
    const sh = [lerp(hip[0], neck[0], 0.86), lerp(hip[1], neck[1], 0.86)];
    const hands = [];
    const arm = (a, e, back) => {
      const el = [sh[0] + Math.sin(a + pose.lean) * L.ua, sh[1] + Math.cos(a + pose.lean) * L.ua];
      const h = [el[0] + Math.sin(a + e + pose.lean) * L.fa, el[1] + Math.cos(a + e + pose.lean) * L.fa];
      const sc = back ? shade(look.shirt, -0.12) : look.shirt;
      if (look.sleeves) { band([sh, el, [lerp(el[0], h[0], 0.7), lerp(el[1], h[1], 0.7)]], sc, 20, ink); stick([[lerp(el[0], h[0], 0.7), lerp(el[1], h[1], 0.7)], h], ink, 7); }
      else { stick([sh, el, h], ink, 7); band([sh, [lerp(sh[0], el[0], 0.5), lerp(sh[1], el[1], 0.5)]], sc, 22, ink); }
      blob(h[0], h[1], 9, 9, ink, null); hands[back ? 0 : 1] = h;
    };
    arm(...pose.aR, 1);
    leg(...pose.lL, 0);
    // pants top + shirt
    band([[hip[0] - nr[0] * 10, hip[1] - nr[1] * 10 + 2], [hip[0] + nr[0] * 10, hip[1] + nr[1] * 10 + 2]], look.pants, 26, ink);
    const P = (u, n) => [hip[0] + up[0] * u + nr[0] * n, hip[1] + up[1] * u + nr[1] * n];
    const torso = look.torn ? [P(-4, -27), P(4, -31), P(-6, -18), P(0, -9), P(-8, 2), P(-2, 14), P(-7, 27), P(L.torso - 10, 31), P(L.torso, 22), P(L.torso + 2, -22), P(L.torso - 10, -31)]
                            : [P(-6, -28), P(-6, 28), P(L.torso - 10, 32), P(L.torso, 22), P(L.torso + 2, -22), P(L.torso - 10, -32)];
    poly(torso, look.shirt, ink, 4.5);
    if (look.sleeves) { stick([P(L.torso - 6, 0), P(10, 0)], shade(look.shirt, -0.25), 3); }
    // head
    const ha = pose.lean + pose.head;
    const hc = [neck[0] + Math.sin(ha) * (R * 0.82), neck[1] - Math.cos(ha) * (R * 0.82)];
    if (look.scarf) { band([[neck[0] - 22 * nr[0], neck[1] + 6], [neck[0] + 24 * nr[0], neck[1] + 4]], look.scarf, 16, ink); band([[neck[0] - 12, neck[1] + 8], [neck[0] - 20, neck[1] + 42 + Math.sin(t * 3) * 3]], look.scarf, 14, ink); }
    if (look.phones) { stick([[neck[0] - 24, neck[1] - 4], [neck[0], neck[1] + 10], [neck[0] + 24, neck[1] - 4]], '#2b2d33', 7); blob(neck[0] - 24, neck[1] - 4, 11, 13, '#4b4f57', ink, 4); blob(neck[0] + 24, neck[1] - 4, 11, 13, '#4b4f57', ink, 4); }
    ctx.save(); ctx.translate(hc[0], hc[1]); ctx.rotate(ha * 0.6);
    if (look.hair === 'pony') { const sw = Math.sin(t * 4) * 4; poly([[-R * 0.7, -R * 0.55], [-R * 1.55, -R * 0.1 + sw], [-R * 1.6, R * 0.55 + sw], [-R * 1.15, R * 0.35], [-R * 0.85, R * 0.05]], look.hairCol, ink, 4); blob(-R * 0.8, -R * 0.45, 9, 9, '#d2462e', ink, 3); }
    blob(0, 0, R, R, look.skin, ink, 5.5);
    // hair
    if (look.hair === 'spiky' || look.hair === 'messy' || look.hair === 'short') {
      const pts = [], n = look.hair === 'short' ? 9 : 12, a0 = Math.PI * 0.95, a1 = Math.PI * 1.78;
      const tip = look.hair === 'short' ? 7 : look.hair === 'messy' ? 16 : 11;
      for (let k = 0; k <= n * 2; k++) { const aa = lerp(a0, a1, k / (n * 2)); const rr = k % 2 ? R + tip * (0.7 + 0.3 * Math.sin(k * 2.3)) : R - 1; pts.push([Math.cos(aa) * rr, Math.sin(aa) * rr]); }
      pts.push([Math.cos(a1) * R * 0.95, Math.sin(a1) * R * 0.6], [R * 0.35, -R * 0.62], [-R * 0.2, -R * 0.5], [-R * 0.62, -R * 0.2], [-R * 0.9, R * 0.25]);
      poly(pts, look.hairCol, ink, 3.5);
      if (look.hair === 'messy') { stick([[-R * 0.2, -R * 0.55], [-R * 0.05, -R * 0.2]], look.hairCol, 6); }
    }
    if (look.hair === 'pony') poly([[-R * 1.02, R * 0.3], [-R * 0.98, -R * 0.4], [-R * 0.55, -R * 0.88], [0, -R * 1.04], [R * 0.6, -R * 0.84], [R * 0.95, -R * 0.35], [R * 0.4, -R * 0.55], [-R * 0.1, -R * 0.45], [-R * 0.55, -R * 0.1], [-R * 0.7, R * 0.35]], look.hairCol, ink, 3.5);
    if (look.cap) { poly([[-R * 1.0, -R * 0.15], [-R * 0.85, -R * 0.75], [0, -R * 1.08], [R * 0.8, -R * 0.75], [R * 0.98, -R * 0.2]], look.cap, ink, 4); poly([[R * 0.6, -R * 0.3], [R * 1.55, -R * 0.2], [R * 1.5, -R * 0.05], [R * 0.85, -R * 0.08]], shade(look.cap, -0.15), ink, 4); }
    if (look.helmet) { poly([[-R * 1.08, R * 0.15], [-R * 1.0, -R * 0.65], [0, -R * 1.12], [R * 1.0, -R * 0.65], [R * 1.08, -R * 0.2], [R * 0.2, -R * 0.35], [-R * 0.6, R * 0.15]], look.helmet, ink, 4.5); blob(-R * 0.75, R * 0.1, 12, 16, '#2b2d33', ink, 3); }
    if (look.lamp) { stick([[-R * 0.98, -R * 0.35], [R * 0.95, -R * 0.42]], '#2b2d33', 7); blob(R * 0.92, -R * 0.42, 9, 11, '#f39a2a', ink, 3); }
    // face: two big outlined eyes, small pupils looking toward +x
    const big = face === 'surprised' || face === 'scared' ? 1.12 : 1;
    const E = [[R * 0.08, -R * 0.08], [R * 0.6, -R * 0.06]], erx = R * 0.27 * big, ery = R * 0.32 * big;
    const gaze = face === 'think' ? [2, -6] : face === 'cry' || face === 'worried' ? [3, 3] : [4, 1];
    const pr = face === 'surprised' || face === 'scared' ? 3.6 : 5.2;
    if (face === 'cry') {
      E.forEach(([ex, ey]) => { stick([[ex - 11, ey + 2], [ex, ey + 6], [ex + 11, ey + 2]], ink, 4.5); });
      const k = (t * 1.6) % 1; ctx.save(); ctx.globalAlpha = 1 - k; blob(E[0][0] - 4, E[0][1] + 18 + k * 40, 5, 8, '#6fb4e0', '#3b7fb0', 2); blob(E[1][0] + 6, E[1][1] + 18 + ((k + 0.5) % 1) * 40, 5, 8, '#6fb4e0', '#3b7fb0', 2); ctx.restore();
    } else if (face === 'happy') {
      E.forEach(([ex, ey]) => { blob(ex, ey, erx, ery, '#fff', ink, 4); ctx.save(); ctx.beginPath(); ctx.ellipse(ex, ey, erx - 2, ery - 2, 0, 0, 7); ctx.clip(); blob(ex + gaze[0], ey + 4, pr + 1, pr + 1, ink, null); ctx.fillStyle = look.skin; ctx.fillRect(ex - erx, ey + ery * 0.45, erx * 2, ery); ctx.restore(); stick([[ex - erx + 2, ey + ery * 0.45], [ex + erx - 2, ey + ery * 0.45]], ink, 3.5); });
    } else {
      E.forEach(([ex, ey]) => { blob(ex, ey, erx, ery, look.zombie ? '#f3f0d8' : '#fff', ink, 4); blob(ex + gaze[0] * (look.zombie ? 0.2 : 1), ey + gaze[1], look.zombie ? 2.6 : pr, look.zombie ? 2.6 : pr, ink, null); if (!look.zombie) blob(ex + gaze[0] + 1.5, ey + gaze[1] - 1.8, 1.4, 1.4, '#fff', null); });
      if (look.zombie) { stick([[E[0][0] - 12, E[0][1] + ery + 2], [E[0][0] + 6, E[0][1] + ery + 8]], '#7a8a5a', 3); }
    }
    if (look.glasses) { E.forEach(([ex, ey]) => blob(ex, ey, erx + 4, ery + 3, null, ink, 3)); stick([[E[0][0] + erx + 5, E[0][1]], [E[1][0] - erx - 5, E[1][1]]], ink, 3.5); stick([[E[0][0] - erx - 6, E[0][1] - 2], [-R * 0.85, -R * 0.1]], ink, 3.5); }
    // brows
    const brow = { worried: [5, -4], scared: [6, -5], surprised: [-8, -8], think: [-3, 4], cry: [6, -5], angry: [-4, 6] }[face] || [0, 0];
    E.forEach(([ex, ey], k) => { const by = ey - ery - (look.glasses ? 13 : 9); const inner = k === 0 ? brow[1] : brow[0], outer = k === 0 ? brow[0] : brow[1]; stick([[ex - 11, by - outer * 0.0 + (k === 0 ? brow[0] : brow[1]) * 0.6], [ex + 11, by + (k === 0 ? brow[1] : brow[0]) * 0.6]], ink, 4.5); });
    // mouth (small, under and slightly behind the eyes)
    const mx = R * 0.42, my = R * 0.5;
    if (talk > 0) { const o = 3 + Math.abs(Math.sin(t * 17)) * 8 * talk; blob(mx, my, 8 + o * 0.3, o * 0.75 + 2, '#7a2a22', ink, 3.5); }
    else if (face === 'happy') { ctx.beginPath(); ctx.moveTo(mx - 15, my - 4); ctx.quadraticCurveTo(mx, my + 16, mx + 15, my - 4); ctx.closePath(); ctx.fillStyle = '#7a2a22'; ctx.fill(); ctx.strokeStyle = ink; ctx.lineWidth = 3.5; ctx.stroke(); }
    else if (face === 'scared' || face === 'surprised') blob(mx, my + 2, 7, 9, '#7a2a22', ink, 3.5);
    else if (face === 'worried' || face === 'cry') { ctx.beginPath(); ctx.moveTo(mx - 10, my + 5); ctx.quadraticCurveTo(mx, my - 5, mx + 10, my + 5); ctx.strokeStyle = ink; ctx.lineWidth = 4; ctx.stroke(); }
    else if (look.zombie) { ctx.beginPath(); ctx.moveTo(mx - 12, my); ctx.lineTo(mx - 4, my + 5); ctx.lineTo(mx + 4, my - 1); ctx.lineTo(mx + 12, my + 4); ctx.strokeStyle = ink; ctx.lineWidth = 4; ctx.stroke(); }
    else { ctx.beginPath(); ctx.moveTo(mx - 9, my); ctx.quadraticCurveTo(mx, my + 3, mx + 9, my - 1); ctx.strokeStyle = ink; ctx.lineWidth = 4; ctx.stroke(); }
    if (look.zombie) { blob(-R * 0.3, R * 0.35, 7, 5, '#8a4a3a', null); }
    ctx.restore();
    // front arm last (over the body)
    arm(...pose.aL, 0);
    if (prop) { FLAT = false; prop([hands[0], hands[1]], ctx); }
    ctx.restore();
    FLAT = true;
    return [hands[0], hands[1]].map(([hx, hy]) => [x + hx * s * dir, y + hy * s - (pose.bob || 0) * s]);
  }

  // ---------- shared pieces
  const noise = [0, 1, 2, 3].map(k => { const c = document.createElement('canvas'); c.width = 540; c.height = 960; const g = c.getContext('2d'); const d = g.createImageData(540, 960); let s = 11 + k * 977;
    for (let i = 0; i < d.data.length; i += 4) { s = (s * 16807) % 2147483647; const v = s % 256; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 255; } g.putImageData(d, 0, 0); return c; });
  function grain(t, a = 0.08) { ctx.save(); ctx.globalAlpha = a; ctx.globalCompositeOperation = 'overlay'; ctx.drawImage(noise[Math.floor(t * 12) % 4], 0, 0, W, H); ctx.restore(); }
  function vignette(a = 0.55, r0 = 0.35) { const v = ctx.createRadialGradient(W / 2, H / 2, H * r0, W / 2, H / 2, H * 0.75); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, `rgba(0,0,0,${a})`); ctx.fillStyle = v; ctx.fillRect(0, 0, W, H); }
  function glowAt(x, y, r, col, a) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, col.replace('A', a)); g.addColorStop(1, col.replace('A', 0)); ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2); ctx.restore(); }
  function darkAround(x, y, r, col = '8,10,22', a = 0.78) { const g = ctx.createRadialGradient(x, y, r * 0.15, x, y, r); g.addColorStop(0, `rgba(${col},0)`); g.addColorStop(1, `rgba(${col},${a})`); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); }
  function pine(x, y, h, col) { const w = h * 0.42; poly([[x, y - h], [x + w * 0.5, y - h * 0.55], [x + w * 0.32, y - h * 0.55], [x + w, y], [x - w, y], [x - w * 0.32, y - h * 0.55], [x - w * 0.5, y - h * 0.55]], col, null); }
  function nightSky(top = '#0b1226', bot = '#1d2c4c') {
    const g = ctx.createLinearGradient(0, 0, 0, 1100); g.addColorStop(0, top); g.addColorStop(1, bot); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    rs = 99; for (let i = 0; i < 70; i++) { ctx.globalAlpha = 0.4 + rnd() * 0.6; blob(rnd() * W, rnd() * 820, 1.2 + rnd() * 2, 1.2 + rnd() * 2, '#f4f0d8', null); } ctx.globalAlpha = 1;
    blob(820, 300, 70, 70, '#f2ecd0', null); glowAt(820, 300, 260, 'rgba(240,235,200,A)', 0.25);
  }
  function forestLine(y, col, seed, n = 14, hmin = 260, hmax = 460) { rs = seed; for (let i = 0; i < n; i++) pine(-40 + i * (W + 80) / (n - 1) + rnd() * 30, y, hmin + rnd() * (hmax - hmin), col); }
  function tent(x, y, w, h, col, { glow = 0, door = 0 } = {}) {
    poly([[x - w / 2, y], [x - w * 0.36, y - h * 0.72], [x, y - h], [x + w * 0.36, y - h * 0.72], [x + w / 2, y]], col, '#101410', 4);
    poly([[x - w * 0.16, y], [x, y - h * 0.82], [x + w * 0.16, y]], shade(col, -0.25), '#101410', 3);
    stick([[x, y - h * 0.82], [x, y]], '#101410', 3);
    if (glow) { ctx.save(); ctx.globalAlpha = glow; poly([[x - w / 2 + 8, y - 4], [x - w * 0.36 + 6, y - h * 0.72 + 6], [x, y - h + 10], [x + w * 0.36 - 6, y - h * 0.72 + 6], [x + w / 2 - 8, y - 4]], '#ffd98a', null); ctx.restore(); glowAt(x, y - h * 0.45, w * 0.9, 'rgba(255,200,110,A)', 0.35 * glow); }
  }
  function fire(x, y, s, t) {
    for (const [a, c] of [[-0.35, '#5a3a22'], [0.35, '#6b4428']]) { ctx.save(); ctx.translate(x, y); ctx.rotate(a); poly([[-110 * s, -14 * s], [110 * s, -14 * s], [110 * s, 14 * s], [-110 * s, 14 * s]], c, '#1a120c', 3); ctx.restore(); }
    for (let k = 0; k < 5; k++) { const fx = x + (k - 2) * 24 * s, fh = (90 + Math.abs(Math.sin(t * 9 + k * 1.7)) * 70) * s * (k === 2 ? 1.4 : 1);
      poly([[fx - 26 * s, y], [fx - 10 * s, y - fh * 0.6], [fx + Math.sin(t * 7 + k) * 10 * s, y - fh], [fx + 12 * s, y - fh * 0.55], [fx + 26 * s, y]], k % 2 ? '#f7b538' : '#e8542c', null); }
    poly([[x - 30 * s, y], [x, y - 80 * s - Math.abs(Math.sin(t * 11)) * 20 * s], [x + 30 * s, y]], '#ffe27a', null);
  }
  // the creature: very tall, thin, pale, no face but two eyeshine dots
  function creature(x, y, h, { lean = 0, arm = 0, eyes = 1, alpha = 1 } = {}) {
    ctx.save(); ctx.globalAlpha = alpha; ctx.translate(x, y); ctx.rotate(lean); const w = h * 0.11, col = '#e9efe6';
    stick([[-w * 0.4, 0], [-w * 0.3, -h * 0.42]], col, w * 0.32); stick([[w * 0.4, 0], [w * 0.3, -h * 0.42]], col, w * 0.32);
    poly([[-w * 0.6, -h * 0.4], [-w * 0.75, -h * 0.8], [w * 0.75, -h * 0.8], [w * 0.6, -h * 0.4]], col, null);
    stick([[-w * 0.75, -h * 0.78], [-w * 1.3, -h * 0.5 + arm * h * 0.1], [-w * 1.1 - arm * w, -h * 0.18 + arm * h * 0.05]], col, w * 0.26);
    stick([[w * 0.75, -h * 0.78], [w * 1.3, -h * 0.5], [w * 1.2, -h * 0.16]], col, w * 0.26);
    blob(0, -h * 0.88, w * 0.62, w * 0.8, col, null);
    if (eyes) { blob(-w * 0.22, -h * 0.89, w * 0.1, w * 0.1, '#ffffff', null); blob(w * 0.22, -h * 0.89, w * 0.1, w * 0.1, '#ffffff', null); glowAt(0, -h * 0.89, w * 0.8, 'rgba(255,255,255,A)', 0.5); }
    ctx.restore();
  }
  function bag(x, y, w, h, col) { poly([[x, y], [x + w, y], [x + w + 10, y + h * 0.5], [x + w, y + h], [x, y + h], [x - 6, y + h * 0.5]], col, '#14110f', 4); for (let k = 1; k < 5; k++) stick([[x + w * k / 5, y + 8], [x + w * k / 5, y + h - 8]], shade(col, -0.2), 3); }
  function phone(x, y, s = 1, on = 1, rot = 0) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); poly([[-28 * s, -50 * s], [28 * s, -50 * s], [28 * s, 50 * s], [-28 * s, 50 * s]], '#15171c', '#0a0a0c', 3); if (on) poly([[-23 * s, -44 * s], [23 * s, -44 * s], [23 * s, 44 * s], [-23 * s, 44 * s]], '#bfe6ff', null); ctx.restore(); if (on) glowAt(x, y, 260 * s, 'rgba(170,215,255,A)', 0.35); }

  // ---------- scenes
  const S = {};
  S.campfire = (b, p, t) => {
    nightSky(); forestLine(980, '#0e1830', 3, 12, 300, 520);
    ctx.fillStyle = '#12203a'; ctx.fillRect(0, 960, W, 130); ctx.globalAlpha = 0.5; for (let k = 0; k < 6; k++) { ctx.fillStyle = '#e8e2c2'; ctx.fillRect(760 + Math.sin(t + k) * 20, 980 + k * 18, 120 - k * 14, 4); } ctx.globalAlpha = 1;
    forestLine(1100, '#0a1222', 8, 9, 380, 620);
    ctx.fillStyle = '#273128'; ctx.fillRect(0, 1080, W, H); ctx.fillStyle = '#2f3a2e'; ctx.fillRect(0, 1260, W, H);
    tent(200, 1250, 380, 300, '#3f7a4a');
    const a = b.a;
    if (a === 'wide') {
      fire(540, 1600, 1, t);
      poly([[180, 1590], [380, 1590], [380, 1625], [180, 1625]], '#5a3a22', '#1a120c', 3); poly([[700, 1590], [900, 1590], [900, 1625], [700, 1625]], '#5a3a22', '#1a120c', 3);
      figure(290, 1700, 1.0, POSES.sit, LOOK.malik, { dir: 1, face: 'happy', t, talk: 0 });
      figure(800, 1700, 1.0, POSES.sit, LOOK.ines, { dir: -1, face: 'happy', t });
      figure(560, 1440, 0.78, POSES.sit, LOOK.theo, { dir: -1, face: 'neutral', t, prop: hs => { stick([hs[1], [hs[1][0] + 60, hs[1][1] + 70]], '#d9c9a0', 4); blob(hs[1][0] + 62, hs[1][1] + 74, 12, 10, '#fff7ea', '#2a2a2a', 2.5); } });
      darkAround(540, 1560, 1100); glowAt(540, 1520, 700, 'rgba(255,150,60,A)', 0.32 + 0.05 * Math.sin(t * 13));
    }
    if (a === 'malik') {
      fire(860, 1900, 1.2, t);
      figure(430, 2050, 2.6, POSES.carry, LOOK.malik, { dir: 1, face: 'happy', talk: 0, t, prop: hs => { ctx.save(); ctx.translate(hs[1][0] + 20, hs[1][1] - 30); poly([[-40, -55], [40, -55], [40, 55], [-40, 55]], '#5d6b3e', '#141a0c', 4); blob(0, -10, 24, 24, '#20242a', '#0a0a0a', 4); blob(0, -10, 11, 11, '#4a6a8a', null); blob(26, -40, 5, 5, Math.floor(t * 2) % 2 ? '#ff3b2a' : '#5a1a14', null); poly([[-30, 25], [30, 25], [30, 40], [-30, 40]], '#3b452a', null); ctx.restore(); } });
      darkAround(820, 1500, 1100, '8,10,22', 0.7); glowAt(860, 1650, 700, 'rgba(255,150,60,A)', 0.3 + 0.05 * Math.sin(t * 13));
    }
    if (a === 'ines') {
      fire(220, 1900, 1.2, t);
      figure(640, 2050, 2.6, POSES.laugh, LOOK.ines, { dir: -1, face: 'happy', t });
      darkAround(260, 1500, 1100, '8,10,22', 0.7); glowAt(220, 1650, 700, 'rgba(255,150,60,A)', 0.3 + 0.05 * Math.sin(t * 13));
    }
  };
  S.tree = (b, p, t) => {
    nightSky('#0a1022', '#18243f'); forestLine(1150, '#0b1428', 5, 10, 420, 700);
    ctx.fillStyle = '#222b24'; ctx.fillRect(0, 1150, W, H);
    tent(760, 1420, 360, 280, '#3f7a4a');
    poly([[90, 0], [250, 0], [270, H], [70, H]], '#3b2a1e', '#120c08', 5); for (let k = 0; k < 9; k++) stick([[110 + (k * 37) % 120, k * 210], [130 + (k * 37) % 120, k * 210 + 120]], '#2a1d14', 5);
    const k = ease(seg(p, 0.1, 0.6));
    stick([[70, 980], [270, 1000]], '#2b3a1f', 12);
    ctx.save(); ctx.translate(lerp(380, 300, k), 960); poly([[-50, -70], [50, -70], [50, 70], [-50, 70]], '#5d6b3e', '#141a0c', 4); blob(10, -15, 28, 28, '#20242a', '#0a0a0a', 4); blob(10, -15, 12, 12, '#4a6a8a', null); blob(38, -50, 6, 6, Math.floor(t * 2) % 2 ? '#ff3b2a' : '#5a1a14', null); ctx.restore();
    if (Math.floor(t * 2) % 2) glowAt(338, 910, 60, 'rgba(255,60,40,A)', 0.6);
    figure(560, 1560, 1.5, POSES.reach, LOOK.malik, { dir: -1, face: 'happy', talk: 1, t });
    darkAround(400, 1100, 1000, '6,8,18', 0.72);
  };
  S.tentout = (b, p, t) => {
    nightSky(); forestLine(1000, '#0e1830', 4, 12, 320, 540);
    ctx.fillStyle = '#12203a'; ctx.fillRect(0, 990, W, 110); forestLine(1120, '#0a1222', 9, 9, 380, 620); ctx.fillStyle = '#263027'; ctx.fillRect(0, 1100, W, H);
    const glow = b.a === 'glow' ? 1 - 0.0 * p : 1 - ease(seg(p, 0.1, 0.45));
    tent(540, 1500, 680, 520, '#3f7a4a', { glow });
    if (glow > 0.05) { ctx.save(); ctx.globalAlpha = glow * 0.85; [[370, 1430, 0.9], [540, 1420, 1], [700, 1435, 0.95]].forEach(([x, y, s]) => { blob(x, y - 60 * s, 46 * s, 50 * s, '#3a2a18', null); poly([[x - 70 * s, y + 70], [x - 50 * s, y - 20 * s], [x + 50 * s, y - 20 * s], [x + 70 * s, y + 70]], '#3a2a18', null); }); ctx.restore(); }
    blob(540, 1880, 60, 20, '#1b1a18', null); for (let k = 0; k < 3; k++) { ctx.globalAlpha = 0.25; blob(540 + Math.sin(t + k) * 20, 1820 - k * 60 - (t * 20) % 60, 30 + k * 10, 30 + k * 10, '#9aa0a6', null); ctx.globalAlpha = 1; }
    darkAround(540, 1350, 1100, '6,8,20', 0.7);
  };
  function tentInside(t, lit = 1) {
    ctx.fillStyle = '#16231b'; ctx.fillRect(0, 0, W, H);
    poly([[-60, H], [540, 160], [W + 60, H]], '#2c4a35', null); poly([[540, 160], [500, H], [580, H]], '#24402e', null);
    stick([[540, 160], [540, 1100]], '#1a2a20', 4);
    for (let k = 0; k < 7; k++) stick([[540, 260 + k * 8], [100 + k * 140, H]], 'rgba(0,0,0,0.12)', 3);
  }
  function sleeper(x, y, s, look, bagCol) { blob(x - 262 * s, y + 10 * s, 70 * s, 34 * s, '#e8e0d0', '#14110f', 3); ctx.save(); ctx.translate(x, y); ctx.rotate(-Math.PI / 2); figure(0, 0, s, POSES.stand, look, { dir: 1, face: 'happy', t: 0 }); ctx.restore(); bag(x - 205 * s, y - 62 * s, 240 * s, 124 * s, bagCol); }
  S.tentin = (b, p, t) => {
    tentInside(t);
    sleeper(520, 1000, 1.0, LOOK.ines, '#a8452e'); sleeper(560, 1230, 1.0, LOOK.malik, '#2f5f8a');
    // close the sleepers' eyes: a soft mask band over the eyes is simpler than a new face mode
    const a = b.a, scared = a === 'frozen';
    const sitK = a === 'wake' ? ease(seg(p, 0.05, 0.4)) : 1;
    bag(380, 1640, 600, 170, '#3f7a4a');
    figure(470, 1760, 1.45, mixPose(POSES.stand, POSES.carry, sitK), LOOK.theo, { dir: 1, face: scared ? 'scared' : a === 'wake' ? 'worried' : 'neutral', t, prop: a !== 'wake' ? hs => { const h = hs[1]; ctx.save(); ctx.translate(h[0] + 20, h[1] - 30); poly([[-28, -50], [28, -50], [28, 50], [-28, 50]], '#15171c', '#0a0a0c', 3); poly([[-23, -44], [23, -44], [23, 44], [-23, 44]], '#bfe6ff', null); ctx.restore(); } : null });
    bag(380, 1700, 640, 220, '#3f7a4a');
    darkAround(600, 1300, 900, '4,8,10', 0.85);
    if (a !== 'wake') glowAt(640, 1260, 520, 'rgba(170,215,255,A)', 0.32);
    if (scared) { const k = Math.abs(Math.sin(t * 4.5)); ctx.fillStyle = `rgba(120,0,0,${0.12 * k})`; ctx.fillRect(0, 0, W, H); }
  };
  S.face = (b, p, t) => {
    tentInside(t);
    const a = b.a;
    const face = a === 'doubt' ? 'think' : a === 'relief' ? 'happy' : a === 'buzz' ? (p > 0.3 ? 'surprised' : 'happy') : 'scared';
    const shake = a === 'fear' ? Math.sin(t * 40) * 4 : a === 'buzz' && p > 0.12 && p < 0.4 ? Math.sin(t * 70) * 3 : 0;
    figure(440 + shake, 2050, 3.3, POSES.carry, LOOK.theo, { dir: 1, face, t });
    const buzz = a === 'buzz' && p > 0.12 && p < 0.45 ? Math.sin(t * 90) * 6 : 0;
    phone(760 + buzz, 1500, 2.2, 1, -0.15);
    if (a === 'buzz' && p > 0.12) { ctx.save(); ctx.globalAlpha = clamp((p - 0.12) * 6); poly([[650, 1330], [880, 1330], [880, 1400], [650, 1400]], '#ffffff', null); ctx.font = 'bold 26px DejaVu Sans'; ctx.fillStyle = '#111'; ctx.fillText('CAM-01 : 1 nouvelle photo', 662, 1374); ctx.restore(); }
    darkAround(640, 1000, 900, '4,8,12', 0.85);
    glowAt(700, 1150, 700, 'rgba(160,210,255,A)', a === 'fear' ? 0.4 : 0.3);
  };
  // night-vision trail-camera photo
  S.photo = (b, p, t) => {
    const zoom = 1 + 0.06 * p; ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(zoom, zoom); ctx.translate(-W / 2, -H / 2);
    ctx.fillStyle = '#1c1c1c'; ctx.fillRect(0, 0, W, H);
    const f = b.fig;
    if (f === 'lens') {
      ctx.fillStyle = '#2a2a2a'; ctx.fillRect(0, 0, W, H);
      blob(540, 900, 640, 820, '#d9d9d9', null); blob(540, 1000, 420, 560, '#eeeeee', null);
      blob(330, 800, 70, 90, '#0a0a0a', null); blob(750, 800, 70, 90, '#0a0a0a', null); blob(330, 790, 22, 22, '#ffffff', null); blob(750, 790, 22, 22, '#ffffff', null);
      glowAt(330, 790, 120, 'rgba(255,255,255,A)', 0.5); glowAt(750, 790, 120, 'rgba(255,255,255,A)', 0.5);
      ctx.save(); ctx.filter = 'blur(10px)'; ctx.globalAlpha = 0.5; blob(540, 900, 600, 760, '#ffffff', null); ctx.restore();
    } else if (f === 'door') {
      ctx.fillStyle = '#353535'; ctx.fillRect(0, 0, W, H);
      poly([[-80, H], [540, 120], [W + 80, H]], '#8a8a8a', null); poly([[160, H], [540, 420], [920, H]], '#6e6e6e', '#2a2a2a', 6);
      ctx.strokeStyle = '#d0d0d0'; ctx.lineWidth = 5; ctx.setLineDash([10, 8]); ctx.beginPath(); ctx.moveTo(190, H - 40); ctx.quadraticCurveTo(540, 300, 890, H - 40); ctx.stroke(); ctx.setLineDash([]);
      poly([[500, 470], [560, 470], [560, 540], [500, 540]], '#e0e0e0', '#222', 3);
      creature(1010, 1980, 1500, { lean: -0.12, arm: 1.2, eyes: 0, alpha: 0.55 });
    } else {
      ctx.fillStyle = '#2a2a2a'; ctx.fillRect(0, 0, W, 1000);
      rs = 21; for (let i = 0; i < 9; i++) { const x = 40 + i * 125 + rnd() * 30; poly([[x - 16, 1010], [x - 10, 300], [x + 10, 300], [x + 16, 1010]], '#4a4a4a', null); pine(x, 760, 520, '#3a3a3a'); }
      ctx.fillStyle = '#5a5a5a'; ctx.fillRect(0, 1000, W, 70); ctx.fillStyle = '#6e6e6e'; ctx.fillRect(0, 1070, W, H);
      rs = 5; for (let i = 0; i < 60; i++) blob(rnd() * W, 1100 + rnd() * 800, 6 + rnd() * 16, 3 + rnd() * 5, '#7c7c7c', null);
      tent(520, 1420, 560, 420, '#a8a8a8');
      if (f === 'far') creature(820, 1010, 230, { lean: 0 });
      if (f === 'lake') creature(230, 1150, 420, { lean: 0.03 });
      if (f === 'side') creature(870, 1500, 760, { lean: -0.32, arm: 1 });
    }
    ctx.restore();
    // IR look: green-grey tint, flash falloff, grain, vignette, stamp
    ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = '#9fe0a8'; ctx.fillRect(0, 0, W, H); ctx.restore();
    const fl = ctx.createRadialGradient(W / 2, H * 0.62, 100, W / 2, H * 0.6, H * 0.8); fl.addColorStop(0, 'rgba(255,255,255,0.08)'); fl.addColorStop(1, 'rgba(0,0,0,0.55)'); ctx.fillStyle = fl; ctx.fillRect(0, 0, W, H);
    grain(t, 0.22); ctx.fillStyle = 'rgba(0,0,0,0.06)'; for (let y = 0; y < H; y += 4) ctx.fillRect(0, y, W, 1);
    ctx.fillStyle = 'rgba(0,0,0,0.75)'; ctx.fillRect(0, H - 110, W, 110); ctx.font = 'bold 34px DejaVu Sans Mono'; ctx.fillStyle = '#e8ffe8'; ctx.textBaseline = 'middle';
    ctx.fillText(`CAM-01   ${b.clock}   11°C   ☾`, 40, H - 55); ctx.textAlign = 'right'; ctx.fillText(`#${String(b.n).padStart(3, '0')}`, W - 40, H - 55); ctx.textAlign = 'left';
    // app header (viewed on Théo's phone) — not on the opening hook
    if (!b.hook) { ctx.fillStyle = 'rgba(10,12,14,0.8)'; ctx.fillRect(0, 0, W, 150); ctx.font = 'bold 36px DejaVu Sans'; ctx.fillStyle = '#ffffff'; ctx.fillText(`‹  Photos  ·  ${b.n}/${Math.max(28, b.n)}`, 40, 95); }
    const fk = clamp(1 - (t - b.start) / 0.22); if (fk > 0) { ctx.fillStyle = `rgba(255,255,255,${fk})`; ctx.fillRect(0, 0, W, H); }
  };
  S.zip = (b, p, t) => {
    ctx.fillStyle = '#0d1611'; ctx.fillRect(0, 0, W, H);
    poly([[-80, H], [540, 140], [W + 80, H]], '#2c4a35', null); poly([[150, H], [540, 420], [930, H]], '#244030', '#101a13', 6);
    const k = ease(seg(p, 0.15, 0.95)), ang = lerp(0, 1, k);
    // zipper path along the door arc; the opened part shows black
    const P = s => { const u = s; return [lerp(lerp(185, 540, u), lerp(540, 895, u), u), lerp(lerp(H - 40, 380, u), lerp(380, H - 40, u), u)]; };
    ctx.strokeStyle = '#9aa69c'; ctx.lineWidth = 5; ctx.setLineDash([10, 8]); ctx.beginPath(); for (let s = 0; s <= 1; s += 0.02) { const [x, y] = P(s); s ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); ctx.setLineDash([]);
    const s1 = 0.08 + ang * 0.55;
    ctx.beginPath(); for (let s = 0.08; s <= s1; s += 0.01) { const [x, y] = P(s); const off = Math.sin((s - 0.08) / Math.max(0.01, s1 - 0.08) * Math.PI) * 60 * k; s === 0.08 ? ctx.moveTo(x, y) : ctx.lineTo(x + off * 0.4, y + off * 0.3); }
    for (let s = s1; s >= 0.08; s -= 0.01) { const [x, y] = P(s); ctx.lineTo(x, y); } ctx.closePath(); ctx.fillStyle = '#000'; ctx.fill();
    const [zx, zy] = P(s1); poly([[zx - 18, zy - 22], [zx + 18, zy - 22], [zx + 18, zy + 22], [zx - 18, zy + 22]], '#c8c8c8', '#222', 3);
    if (p > 0.82) { const [ex, ey] = P(0.2); ctx.globalAlpha = clamp((p - 0.82) * 8); blob(ex + 26, ey - 30, 7, 7, '#ffffff', null); blob(ex + 52, ey - 34, 7, 7, '#ffffff', null); glowAt(ex + 39, ey - 32, 60, 'rgba(255,255,255,A)', 0.6); ctx.globalAlpha = 1; }
    darkAround(540, 1000, 1000, '0,0,0', 0.8);
    ctx.save(); ctx.globalAlpha = 0.95; figure(760, 2150, 2.6, POSES.scared, LOOK.theo, { dir: -1, face: 'scared', t, ink: '#000' }); ctx.restore();
    ctx.fillStyle = 'rgba(0,0,0,0.55)'; ctx.fillRect(0, 1500, W, H);
  };
  S.card = (b, p, t) => {
    ctx.fillStyle = '#07090a'; ctx.fillRect(0, 0, W, H);
    const n = Math.min(31, Math.floor(ease(seg(p, 0.05, 0.75)) * 31) + 1);
    for (let k = 0; k < n; k++) { const x = 70 + (k % 5) * 190, y = 300 + Math.floor(k / 5) * 190; ctx.fillStyle = k > 26 ? '#5f7a62' : '#33453a'; ctx.fillRect(x, y, 170, 170); if (k >= 9 && k <= 29) { const hh = k < 18 ? 40 : k < 27 ? 80 : 130; ctx.globalAlpha = 0.85; creature(x + 120, y + 160, hh); ctx.globalAlpha = 1; } }
    ctx.font = 'bold 120px DejaVu Sans'; ctx.textAlign = 'center'; ctx.fillStyle = '#e2382c'; ctx.fillText(`${n}`, W / 2, 1720); ctx.font = 'bold 50px DejaVu Sans'; ctx.fillStyle = '#d8d8d8'; ctx.fillText('photos', W / 2, 1790); ctx.textAlign = 'left';
    grain(t, 0.08);
  };
  S.endcard = (b, p, t) => {
    ctx.fillStyle = '#050607'; ctx.fillRect(0, 0, W, H);
    const k = ease(seg(p, 0, 0.3)); ctx.globalAlpha = k; ctx.textAlign = 'center';
    ctx.font = 'bold 120px DejaVu Sans'; ctx.fillStyle = '#e9efe6'; ctx.fillText('LE PIÈGE', W / 2, 860); ctx.fillStyle = '#e2382c'; ctx.fillText('PHOTO', W / 2, 1000);
    ctx.font = '44px DejaVu Sans'; ctx.fillStyle = '#9aa29a'; ctx.globalAlpha = ease(seg(p, 0.3, 0.6)); ctx.fillText('Ne laisse jamais une caméra tourner la nuit.', W / 2, 1120); ctx.textAlign = 'left'; ctx.globalAlpha = 1;
    creature(540, 1700, 380, { alpha: 0.15 + 0.1 * Math.sin(t * 2) });
  };

  // ---------- captions: short phrases, current word highlighted
  function captions(b, t) {
    if (!b.t) return;
    const tail = b.s === 'card' ? 1.0 : 0.6, a0 = b.start + 0.25, len = Math.max(0.5, b.dur - 0.25 - tail);
    const words = b.t.split(' '), tot = b.t.length; let acc = 0; const times = words.map(w => { const s = a0 + acc / tot * len; acc += w.length + 1; return s; });
    let cur = -1; times.forEach((s, k) => { if (t >= s) cur = k; }); if (cur < 0) return;
    const chunk = Math.floor(cur / 3) * 3, show = words.slice(chunk, chunk + 3);
    ctx.save(); let fs = 82; ctx.font = `900 ${fs}px DejaVu Sans`; const full = show.join(' ').toUpperCase(); while (ctx.measureText(full).width > 980 && fs > 40) { fs -= 4; ctx.font = `900 ${fs}px DejaVu Sans`; }
    let x = W / 2 - ctx.measureText(full).width / 2; const y = H * 0.74; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
    show.forEach((w, k) => { const s = w.toUpperCase() + (k < show.length - 1 ? ' ' : ''); ctx.lineWidth = fs / 5; ctx.strokeStyle = '#000'; ctx.strokeText(s, x, y); ctx.fillStyle = chunk + k === cur ? '#ffd23c' : '#ffffff'; ctx.fillText(s, x, y); x += ctx.measureText(s).width; });
    ctx.restore();
  }
  function hud(b) {
    if (!b.clock || b.s === 'photo') return;
    const hudText = FILM.beats.slice(0, FILM.beats.indexOf(b) + 1).reverse().find(x => x.hud)?.hud || '';
    ctx.save(); ctx.textAlign = 'center'; ctx.font = 'bold 30px DejaVu Sans'; ctx.fillStyle = '#e8e8e8'; ctx.fillText('● ' + hudText, W / 2, 110);
    ctx.font = 'bold 64px DejaVu Sans Mono'; ctx.fillStyle = '#ffffff'; ctx.fillText(b.clock, W / 2, 185); ctx.beginPath(); ctx.arc(W / 2 - ctx.measureText('● ' + hudText).width * 0.47 - 0, 100, 9, 0, 7); ctx.restore();
  }

  const FILM = window.FILM;
  function render(t) {
    const i = Math.max(0, FILM.beats.findIndex(b => t < b.start + b.dur));
    const b = FILM.beats[i] || FILM.beats[FILM.beats.length - 1];
    const p = clamp((t - b.start) / b.dur);
    rs = Math.floor(t * 8) * 977 + 11;
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, W, H);
    const cam = ['card', 'endcard', 'photo'].includes(b.s) ? 1 : 1.0 + 0.04 * p;
    ctx.translate(W / 2, H / 2); ctx.scale(cam, cam); ctx.translate(-W / 2, -H / 2);
    (S[b.s] || S.endcard)(b, p, t, i);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    if (b.s !== 'photo') { grain(t, 0.06); vignette(0.5); }
    hud(b); captions(b, t);
    const prev = FILM.beats[i - 1], next = FILM.beats[i + 1]; let fade = 0;
    if (prev && prev.s !== b.s && b.s !== 'photo') fade = Math.max(fade, 1 - clamp((t - b.start) / 0.25));
    if (next && next.s !== b.s && next.s !== 'photo') fade = Math.max(fade, clamp((t - (b.start + b.dur - 0.25)) / 0.25));
    if (t < 0.6) fade = 1 - t / 0.6;
    if (fade > 0) { ctx.fillStyle = `rgba(0,0,0,${fade})`; ctx.fillRect(0, 0, W, H); }
  }
  return { render };
}
window.PiegeFilm = { create };
