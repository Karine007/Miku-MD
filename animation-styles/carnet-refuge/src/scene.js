// "Le Carnet du Refuge" — original French horror short, vertical 1080x1920, flat geometric cartoon style
// (front-facing characters, round heads, big round eyes, flat shapes with thin outlines, dark night palette).
// Original story and characters (Nora, Jules, Sami). render(t) is a pure function of time; the beat
// timeline (window.FILM) comes from src/make_voice.py, so the visuals follow the Gemini narration.
const W = 1080, H = 1920;
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, k) => a + (b - a) * k;
const ease = k => k * k * (3 - 2 * k);
const seg = (t, a, b) => clamp((t - a) / (b - a));
const OUT = '#16161d';

export function create(canvas) {
  const ctx = canvas.getContext('2d');
  let rs = 1; const rnd = () => { rs = (rs * 16807) % 2147483647; return (rs - 1) / 2147483646; };
  const shade = (hex, k) => { let h = hex.slice(1); if (h.length === 3) h = h.split('').map(c => c + c).join(''); const n = parseInt(h, 16); const f = v => Math.round(clamp(v * (1 + k), 0, 255)); return `rgb(${f(n >> 16 & 255)},${f(n >> 8 & 255)},${f(n & 255)})`; };
  function rr(x, y, w, h, r, fill, line = OUT, lw = 3) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); if (fill) { ctx.fillStyle = fill; ctx.fill(); } if (line) { ctx.strokeStyle = line; ctx.lineWidth = lw; ctx.stroke(); } }
  function circ(x, y, r, fill, line = OUT, lw = 3) { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); if (fill) { ctx.fillStyle = fill; ctx.fill(); } if (line) { ctx.strokeStyle = line; ctx.lineWidth = lw; ctx.stroke(); } }
  function ell(x, y, rx, ry, fill, line = OUT, lw = 3, rot = 0) { ctx.beginPath(); ctx.ellipse(x, y, rx, ry, rot, 0, Math.PI * 2); if (fill) { ctx.fillStyle = fill; ctx.fill(); } if (line) { ctx.strokeStyle = line; ctx.lineWidth = lw; ctx.stroke(); } }
  function poly(P, fill, line = OUT, lw = 3) { ctx.beginPath(); P.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.closePath(); if (fill) { ctx.fillStyle = fill; ctx.fill(); } if (line) { ctx.strokeStyle = line; ctx.lineJoin = 'round'; ctx.lineWidth = lw; ctx.stroke(); } }
  function ln(P, col = OUT, w = 4) { ctx.beginPath(); P.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.strokeStyle = col; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.stroke(); }
  function glow(x, y, r, col, a) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, `rgba(${col},${a})`); g.addColorStop(1, `rgba(${col},0)`); ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2); ctx.restore(); }
  function dark(x, y, r, a = 0.8, col = '6,8,16') { const g = ctx.createRadialGradient(x, y, r * 0.15, x, y, r); g.addColorStop(0, `rgba(${col},0)`); g.addColorStop(1, `rgba(${col},${a})`); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); }
  function txt(s, x, y, size, { col = '#fff', font = 'DejaVu Sans', weight = 'bold', align = 'center', alpha = 1, sx = 1 } = {}) { ctx.save(); ctx.globalAlpha = alpha; ctx.translate(x, y); ctx.scale(sx, 1); ctx.font = `${weight} ${size}px ${font}`; ctx.textAlign = align; ctx.textBaseline = 'middle'; ctx.fillStyle = col; ctx.fillText(s, 0, 0); ctx.restore(); }
  const grainC = [0, 1, 2].map(k => { const c = document.createElement('canvas'); c.width = 360; c.height = 640; const g = c.getContext('2d'); const d = g.createImageData(360, 640); let s = 7 + k * 131; for (let i = 0; i < d.data.length; i += 4) { s = (s * 16807) % 2147483647; const v = s % 256; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 255; } g.putImageData(d, 0, 0); return c; });
  function grain(t, a) { ctx.save(); ctx.globalAlpha = a; ctx.globalCompositeOperation = 'overlay'; ctx.drawImage(grainC[Math.floor(t * 12) % 3], 0, 0, W, H); ctx.restore(); }

  // ---------- characters (original designs), front-facing flat rig; (x, y) = feet, s = scale (~1 => 450px tall)
  const LOOK = {
    nora: { skin: '#f1c9a5', hair: 'bob', hairCol: '#1d1a22', coat: '#2f8f8a', shirt: '#f2d35b', pants: '#2c3346', shoes: '#7a3f2a', freckles: 1 },
    jules: { skin: '#f6dbc2', hair: 'curls', hairCol: '#e8c46a', coat: '#d0922c', shirt: '#3a3f4e', pants: '#4a3d33', shoes: '#26262e' },
    sami: { skin: '#9c6644', hair: 'bun', hairCol: '#16110e', coat: '#6b4fa0', shirt: '#b9bcc4', pants: '#2b2b33', shoes: '#c9452d', strap: '#c9452d' },
  };
  function head(L, { face = 'calm', gaze = [0, 0], talk = 0, t = 0, blink = 0, back = 0 } = {}) { // head centred at (0,0), radius 70
    if (L.hair === 'bob') { rr(-84, -82, 168, 150, 60, L.hairCol); }
    if (L.hair === 'bun') circ(0, -86, 28, L.hairCol);
    circ(0, 0, 70, L.skin);
    if (L.hair === 'bob') { poly([[-72, -20], [-70, -55], [-40, -78], [10, -82], [55, -70], [74, -36], [72, -12], [40, -40], [-10, -44], [-48, -30]], L.hairCol); }
    if (L.hair === 'curls') { rs = 4; for (let k = 0; k < 11; k++) { const a = Math.PI * (1.05 + k * 0.09); circ(Math.cos(a) * 64, Math.sin(a) * 60 - 6, 20 + rnd() * 6, L.hairCol); } }
    if (L.hair === 'bun') poly([[-70, -6], [-66, -44], [-36, -68], [0, -72], [36, -68], [66, -44], [70, -6], [52, -38], [0, -48], [-52, -38]], L.hairCol);
    if (back) { if (L.hair === 'bob' || L.hair === 'bun') circ(0, -4, 72, L.hairCol); else { rs = 6; for (let k = 0; k < 14; k++) circ(Math.cos(k) * 50, Math.sin(k * 1.7) * 50, 22, L.hairCol); } return; }
    const closed = face === 'sleep' || blink > 0.5;
    const big = face === 'scared' || face === 'shock' ? 1.15 : 1;
    for (const sx of [-1, 1]) {
      const ex = sx * 26, ey = -4;
      if (closed) ln([[ex - 14, ey + 2], [ex, ey + 7], [ex + 14, ey + 2]], OUT, 4);
      else { circ(ex, ey, 17 * big, '#ffffff', OUT, 3); circ(ex + gaze[0] * 6, ey + gaze[1] * 6, face === 'shock' ? 5 : 7.5, OUT, null); circ(ex + gaze[0] * 6 + 2.5, ey + gaze[1] * 6 - 2.5, 2, '#fff', null); }
      const tilt = { worried: 0.35, scared: 0.4, shock: -0.1, laugh: -0.15, angry: -0.4 }[face] || 0;
      const by = ey - 30 - (face === 'shock' ? 8 : 0);
      ln([[ex - 13 * sx * -1 * -1 - 13, by + (sx < 0 ? tilt * 12 : -tilt * 12) * -1], [ex + 13, by + (sx < 0 ? -tilt * 12 : tilt * 12) * -1]].map(([x, y], k) => [x, y]), OUT, 5);
    }
    if (L.freckles) for (const sx of [-1, 1]) for (let k = 0; k < 3; k++) circ(sx * (38 + k * 6), 22 + (k % 2) * 6, 2.2, '#b9784e', null);
    ctx.globalAlpha = 0.25; ell(-44, 26, 12, 7, '#e0605a', null); ell(44, 26, 12, 7, '#e0605a', null); ctx.globalAlpha = 1;
    const my = 38;
    if (talk > 0) { const o = 4 + Math.abs(Math.sin(t * 16)) * 9; ell(0, my, 13, o, '#6a1f1f', OUT, 3); }
    else if (face === 'laugh') { poly([[-20, my - 6], [20, my - 6], [0, my + 16]], '#6a1f1f'); }
    else if (face === 'smile') ln([[-16, my - 2], [0, my + 6], [16, my - 2]], OUT, 4);
    else if (face === 'shock' || face === 'scared') ell(0, my + 2, 9, 12, '#6a1f1f', OUT, 3);
    else if (face === 'worried') ln([[-14, my + 4], [0, my - 2], [14, my + 4]], OUT, 4);
    else ln([[-12, my], [12, my]], OUT, 4);
  }
  // arms: angle from straight down, + = outward. hold: draw a notebook between the hands
  function person(x, y, s, L, { face = 'calm', gaze = [0, 0], talk = 0, t = 0, arms = [0.12, 0.12], sit = 0, hold = 0, lamp = 0, bob = 0, blink = 0, back = 0 } = {}) {
    ctx.save(); ctx.translate(x, y - bob); ctx.scale(s, s);
    ctx.globalAlpha = 0.25; ell(0, 4, 90, 14, '#000', null); ctx.globalAlpha = 1;
    const legH = sit ? 60 : 150;
    for (const sx of [-1, 1]) { rr(sx * 26 - 17, -legH - 6, 34, legH + 2, 12, L.pants); ell(sx * 30, -4, 26, 13, L.shoes); }
    const top = -legH - 160;
    const arm = (sx, a) => { ctx.save(); ctx.translate(sx * 62, top + 18); ctx.rotate(-sx * a); rr(-15, -8, 30, 140, 15, L.coat); circ(0, 140, 15, L.skin); ctx.restore(); };
    if (!hold) { arm(-1, arms[0]); arm(1, arms[1]); }
    poly([[-66, top + 6], [66, top + 6], [62, -legH], [-62, -legH]], L.coat); rr(-66, top, 132, 30, 15, L.coat, null);
    poly([[-18, top + 4], [18, top + 4], [16, -legH - 4], [-16, -legH - 4]], L.shirt);
    if (L.strap) { ln([[-48, top + 8], [-38, -legH - 10]], L.strap, 12); ln([[48, top + 8], [38, -legH - 10]], L.strap, 12); }
    rr(-14, top - 22, 28, 30, 8, L.skin);
    if (hold) { // forearms forward holding an open notebook
      for (const sx of [-1, 1]) { ctx.save(); ctx.translate(sx * 62, top + 18); ctx.rotate(sx * 0.55); rr(-15, -8, 30, 110, 15, L.coat); ctx.restore(); }
      poly([[-70, top + 70], [0, top + 82], [70, top + 70], [70, top + 150], [0, top + 162], [-70, top + 150]], '#efe6cf'); ln([[0, top + 82], [0, top + 162]], '#a89a7a', 3);
      circ(-60, top + 128, 15, L.skin); circ(60, top + 128, 15, L.skin);
    }
    ctx.save(); ctx.translate(0, top - 92); head(L, { face, gaze, talk, t, blink, back }); if (lamp) { rr(-58, -58, 116, 14, 6, '#2b2d33'); rr(-16, -66, 32, 24, 6, '#f2c230'); } ctx.restore();
    ctx.restore();
    if (lamp) glow(x, y - (legH + 252 + 92 + 54) * s, 300 * s, '255,230,160', 0.25);
  }

  // ---------- sets
  function snowSky(t, a = 1) {
    const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#0a1020'); g.addColorStop(0.6, '#1a2742'); g.addColorStop(1, '#2a3754'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    circ(800, 330, 64, '#e9ecf2', null); glow(800, 330, 280, '230,235,245', 0.22);
    poly([[-100, 1150], [260, 620], [520, 1000], [760, 700], [1180, 1150]], '#3a4864', null); poly([[260, 620], [330, 720], [290, 700], [230, 740], [200, 700]], '#dfe5ee', null); poly([[760, 700], [840, 800], [790, 790], [730, 820], [700, 780]], '#dfe5ee', null);
    poly([[-100, 1250], [400, 980], [1180, 1250]], '#4a5a78', null);
  }
  function snowfall(t, n = 140, speed = 1, wind = 60) { ctx.save(); ctx.fillStyle = '#ffffff'; rs = 77; for (let i = 0; i < n; i++) { const x0 = rnd() * W, sp = (60 + rnd() * 120) * speed, r = 1.5 + rnd() * 3.5; const y = (rnd() * H + t * sp) % H; const x = (x0 + t * wind * (0.5 + rnd()) + Math.sin(t + i) * 12) % W; ctx.globalAlpha = 0.5 + rnd() * 0.5; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); } ctx.restore(); }
  function hut(x, y, w, lit = 1) {
    rr(x - w / 2, y - w * 0.55, w, w * 0.55, 6, '#6d6a66');
    rs = 3; for (let k = 0; k < 14; k++) rr(x - w / 2 + 10 + rnd() * (w - 60), y - w * 0.52 + rnd() * w * 0.45, 30 + rnd() * 30, 18 + rnd() * 10, 6, '#7d7a76', '#5a5753', 2);
    poly([[x - w / 2 - 40, y - w * 0.53], [x, y - w * 0.95], [x + w / 2 + 40, y - w * 0.53]], '#4a3628'); poly([[x - w / 2 - 44, y - w * 0.5], [x, y - w * 0.97], [x + w / 2 + 44, y - w * 0.5], [x + w / 2 + 20, y - w * 0.56], [x, y - w * 0.88], [x - w / 2 - 20, y - w * 0.56]], '#eef2f7');
    rr(x - w * 0.36, y - w * 0.38, w * 0.22, w * 0.18, 4, lit ? '#ffcf73' : '#1c2233'); ln([[x - w * 0.25, y - w * 0.38], [x - w * 0.25, y - w * 0.2]], OUT, 4);
    rr(x + w * 0.08, y - w * 0.42, w * 0.2, w * 0.42, 4, '#5a3a26');
    if (lit) glow(x - w * 0.25, y - w * 0.29, w * 0.6, '255,200,110', 0.35);
    poly([[x - w / 2 - 60, y], [x + w / 2 + 60, y], [x + w / 2 + 40, y + 30], [x - w / 2 - 40, y + 30]], '#e6ebf2', null);
  }
  function woodRoom(t, { stove = 1, light = 1 } = {}) {
    ctx.fillStyle = '#5c3e2a'; ctx.fillRect(0, 0, W, H); for (let k = 0; k < 14; k++) { ctx.fillStyle = k % 2 ? '#62432e' : '#583b28'; ctx.fillRect(k * 80, 0, 80, 1300); ln([[k * 80, 0], [k * 80, 1300]], '#3e2a1c', 3); }
    ctx.fillStyle = '#3e2c20'; ctx.fillRect(0, 1300, W, H); for (let k = 0; k < 8; k++) ln([[0, 1300 + k * 80], [W, 1300 + k * 80]], '#2e2016', 3);
    // small window with snow
    rr(700, 260, 260, 240, 6, '#16223a', '#2e2016', 14); ln([[830, 260], [830, 500]], '#2e2016', 10); ln([[700, 380], [960, 380]], '#2e2016', 10); ctx.save(); ctx.beginPath(); ctx.rect(700, 260, 260, 240); ctx.clip(); snowfall(t, 30, 1.4, 120); ctx.restore();
    if (stove) { rr(60, 980, 220, 320, 20, '#2b2b30'); rr(100, 1070, 140, 110, 12, '#1a1a1e'); const f = 0.7 + 0.3 * Math.abs(Math.sin(t * 9)); ctx.globalAlpha = f; ell(170, 1150, 50, 30, '#f08a2c', null); ell(170, 1155, 28, 18, '#ffd26a', null); ctx.globalAlpha = 1; rr(150, 560, 40, 420, 6, '#2b2b30'); glow(170, 1130, 620, '255,140,60', 0.35 * light * f); }
  }
  function table(x, y) { rr(x - 260, y, 520, 40, 8, '#7a5236'); rr(x - 230, y + 40, 30, 260, 6, '#5e3e28'); rr(x + 200, y + 40, 30, 260, 6, '#5e3e28'); }
  function candle(x, y, t) { rr(x - 14, y - 70, 28, 70, 5, '#efe6cf'); ell(x, y - 88 + Math.sin(t * 13), 8, 16, '#ffd26a', null); glow(x, y - 90, 420, '255,190,100', 0.4 + 0.05 * Math.sin(t * 17)); }

  // the notebook (top-down)
  const OLD = ['Merci pour le bois !  — Paul', 'Vue magnifique au lever du soleil.', 'Neige jusqu\'aux genoux. On redescend demain.', 'Le poêle tire mal, ouvrez la trappe.  — L & M'];
  const WARN = ['Nous sommes trois.', 'Il est 3h12.', 'Il frappe encore.', 'N\'ouvrez pas.'];
  function hand(s, x, y, size, col, alpha = 1) { ctx.save(); ctx.globalAlpha = alpha; ctx.font = `700 ${size}px Kalam`; ctx.fillStyle = col; ctx.textBaseline = 'middle'; ctx.fillText(s, x, y); ctx.restore(); }
  function notebook(t, { right = 'warn', reveal = 1, flip = 0, date = 0, zoom = 1, cx = 540, cy = 960, wet = 0 } = {}) {
    ctx.save(); ctx.translate(cx, cy); ctx.scale(zoom, zoom); ctx.translate(-540, -960);
    ctx.fillStyle = '#3a2618'; ctx.fillRect(-600, -600, W + 1200, H + 1200); for (let k = 0; k < 30; k++) ln([[-600, k * 90 - 300], [W + 600, k * 90 - 260]], 'rgba(0,0,0,0.18)', 6);
    ctx.globalAlpha = 0.35; rr(70, 470, 960, 1020, 20, '#000', null); ctx.globalAlpha = 1;
    poly([[60, 450], [540, 480], [540, 1480], [60, 1450]], '#efe6cf'); poly([[540, 480], [1020, 450], [1020, 1450], [540, 1480]], '#f3ebd6');
    for (let k = 0; k < 15; k++) { ln([[90, 560 + k * 62], [520, 575 + k * 62]], 'rgba(90,120,170,0.35)', 2); ln([[560, 575 + k * 62], [990, 560 + k * 62]], 'rgba(90,120,170,0.35)', 2); }
    ln([[540, 480], [540, 1480]], 'rgba(0,0,0,0.35)', 6);
    OLD.forEach((s, k) => { ctx.save(); ctx.translate(100, 620 + k * 150); ctx.rotate(0.02); ctx.font = '700 34px Kalam'; ctx.fillStyle = ['#2a3a7a', '#3a3a3a', '#1f5a3a', '#5a2a2a'][k]; const words = s.split(' '); let line = '', yy = 0; words.forEach(w => { if (ctx.measureText(line + w).width > 400) { ctx.fillText(line, 0, yy); line = ''; yy += 48; } line += w + ' '; }); ctx.fillText(line, 0, yy); ctx.restore(); });
    if (right === 'warn' || right === 'writing') {
      hand('6 nov. — nuit', 760, 540, 34, '#555', 1); if (date) { ctx.strokeStyle = `rgba(220,40,40,${date})`; ctx.lineWidth = 6; ctx.beginPath(); ctx.ellipse(860, 540, 140 * (0.6 + 0.4 * date), 40, -0.05, 0, Math.PI * 2 * date); ctx.stroke(); }
      const total = WARN.join('').length; let shown = Math.floor(total * reveal);
      WARN.forEach((s, k) => { const n = Math.max(0, Math.min(s.length, shown)); shown -= s.length; if (n > 0) hand(s.slice(0, n), 572, 680 + k * 124, 48, '#4a4a4f'); if (right === 'writing' && n > 0 && n < s.length) { ctx.save(); ctx.font = '700 48px Kalam'; const px = 572 + ctx.measureText(s.slice(0, n)).width; ctx.restore(); poly([[px, 690 + k * 124], [px + 26, 600 + k * 124], [px + 46, 610 + k * 124], [px + 12, 700 + k * 124]], '#e9c13a'); poly([[px, 690 + k * 124], [px + 8, 676 + k * 124], [px + 16, 690 + k * 124]], '#333'); } });
    }
    if (right === 'thanks') { hand('Merci de', 580, 860, 74, `rgba(25,25,40,${0.4 + 0.6 * reveal})`); hand('m\'avoir ouvert.', 575, 980, 66, `rgba(25,25,40,${0.4 + 0.6 * reveal})`); if (wet) { ctx.globalAlpha = 0.5; rs = 9; for (let k = 0; k < 6; k++) ell(640 + rnd() * 320, 1040 + rnd() * 40 + ((t * 30 + k * 20) % 60) * wet, 4, 10, '#191928', null); ctx.globalAlpha = 1; } }
    if (right === 'blank') { hand('Nous étions trois.', 575, 820, 52, 'rgba(25,25,40,0.95)'); }
    if (flip > 0 && flip < 1) { const k = ease(flip), x = lerp(1020, 60, k); poly([[540, 480], [x, 450 + 40 * Math.sin(k * Math.PI)], [x, 1450 - 40 * Math.sin(k * Math.PI)], [540, 1480]], k < 0.5 ? '#f3ebd6' : '#e9dfc6'); }
    ctx.restore();
  }

  const S = {};
  S.carnet = (b, p, t) => {
    const a = b.a;
    if (a === 'hook') notebook(t, { right: 'warn', reveal: 1, zoom: lerp(1.55, 1.4, p), cx: lerp(380, 420, p), cy: lerp(700, 760, p) });
    if (a === 'flip') notebook(t, { right: p > 0.55 ? 'warn' : 'none', reveal: p > 0.55 ? 0 : 0, flip: seg(p, 0.15, 0.6), zoom: 1 });
    if (a === 'warning') notebook(t, { right: 'warn', reveal: ease(seg(p, 0.05, 0.85)), zoom: lerp(1.0, 1.35, ease(p)), cx: lerp(540, 330, ease(p)), cy: lerp(960, 900, ease(p)) });
    if (a === 'date') notebook(t, { right: 'warn', reveal: 1, date: ease(seg(p, 0.35, 0.7)), zoom: lerp(1.35, 2.2, ease(seg(p, 0, 0.6))), cx: lerp(330, 0, ease(seg(p, 0, 0.6))), cy: lerp(900, 1420, ease(seg(p, 0, 0.6))) });
    if (a === 'writing') notebook(t, { right: 'writing', reveal: lerp(0.0, 0.85, seg(p, 0.05, 0.95)), zoom: 1.35, cx: 330, cy: 900 });
    if (a === 'turn') notebook(t, { right: p > 0.4 ? 'thanks' : 'warn', reveal: p > 0.4 ? 0.5 : 0.85, flip: seg(p, 0.05, 0.4), zoom: 1 });
    if (a === 'thanks') notebook(t, { right: 'thanks', reveal: 1, wet: 1, zoom: lerp(1.2, 1.6, ease(p)), cx: lerp(470, 250, ease(p)), cy: 860 });
    const flick = 0.85 + 0.15 * Math.sin(t * 13) * Math.sin(t * 7.3);
    dark(620, 900, 1000, 0.72 * (2 - flick)); glow(700, 700, 800, '255,190,110', 0.18 * flick);
  };
  S.outside = (b, p, t) => {
    snowSky(t); hut(700, 1380, 460, 1);
    ctx.fillStyle = '#e6ebf2'; ctx.fillRect(0, 1380, W, H); ctx.fillStyle = '#cfd7e4'; for (let k = 0; k < 6; k++) ell(100 + k * 200, 1500 + (k % 2) * 60, 140, 26, '#d7deea', null);
    const k = ease(seg(p, 0, 0.8));
    [['nora', -60, 0], ['jules', -230, 0.6], ['sami', -400, 1.2]].forEach(([n, off, ph]) => person(lerp(80 + off, 520 + off * 0.7, k), 1720, 0.72, LOOK[n], { face: 'calm', t, gaze: [0.6, 0], bob: Math.abs(Math.sin(t * 6 + ph)) * 8 * (1 - k * 0.6), lamp: 1, arms: [0.2, 0.2] }));
    snowfall(t, 180, 1.6, 160); dark(540, 1200, 1100, 0.55);
  };
  S.inside = (b, p, t) => {
    const a = b.a, night = a === 'write';
    woodRoom(t, { stove: 1, light: night ? 0.5 : 1 });
    // bunks on the right wall
    for (let k = 0; k < 2; k++) { rr(720, 640 + k * 330, 330, 40, 6, '#7a5236'); rr(730, 600 + k * 330, 310, 40, 10, ['#8a3a3a', '#3a5a8a'][k]); }
    rr(1030, 560, 24, 760, 6, '#5e3e28');
    table(470, 1330);
    if (a === 'enter') { person(270, 1690, 0.85, LOOK.sami, { face: 'calm', t, gaze: [0.4, 0] }); person(520, 1720, 0.9, LOOK.nora, { face: 'smile', t }); person(780, 1700, 0.85, LOOK.jules, { face: 'smile', t, gaze: [-0.4, 0] }); rr(400, 1280, 140, 50, 6, '#5d3a26'); }
    if (a === 'read' || a === 'sami') {
      person(280, 1700, 0.85, LOOK.sami, { face: a === 'sami' ? 'laugh' : 'smile', talk: a === 'sami' && p < 0.6 ? 1 : 0, t, gaze: [0.5, 0], arms: a === 'sami' ? [0.5, 0.9] : [0.12, 0.12] });
      person(800, 1700, 0.85, LOOK.nora, { face: 'calm', t, gaze: [-0.5, 0] });
      person(540, 1760, 0.95, LOOK.jules, { face: 'smile', talk: a === 'read' ? 1 : 0, t, gaze: [0, 0.5], hold: 1 });
    }
    if (a === 'write') { candle(700, 1330, t); person(470, 1800, 0.95, LOOK.nora, { face: 'calm', t, gaze: [0, 0.8], hold: 1 }); }
    if (night) dark(650, 1100, 900, 0.85); else dark(540, 1100, 1300, 0.4);
  };
  S.face = (b, p, t) => {
    woodRoom(t); dark(540, 900, 900, 0.6);
    person(540, 2350, 2.5, LOOK.nora, { face: p < 0.35 ? 'calm' : 'worried', t, gaze: p < 0.5 ? [0, 0.7] : [0, 0], blink: 0 });
    glow(200, 1300, 700, '255,140,60', 0.2);
  };
  S.bunks = (b, p, t) => {
    const a = b.a;
    woodRoom(t, { stove: 1, light: 0.25 });
    // three bunks stacked: heads poking out of blankets
    const bunk = (y, L, col, awake, gaze) => { rr(110, y, 860, 60, 8, '#6b4a30'); rr(130, y - 70, 160, 80, 30, '#e8e0d0'); ctx.save(); ctx.translate(230, y - 70); ctx.scale(0.75, 0.75); head(L, { face: awake ? (a === 'silence' ? 'shock' : 'scared') : 'sleep', gaze, t }); ctx.restore(); rr(280, y - 60, 680, 80, 26, col); for (let k = 1; k < 5; k++) ln([[280 + k * 136, y - 54], [280 + k * 136, y + 14]], shade(col, -0.2), 3); };
    bunk(600, LOOK.sami, '#7a3a4a', a === 'walls' || a === 'silence', [0.6, -0.4]);
    bunk(900, LOOK.jules, '#3a5a8a', a !== 'sleep', a === 'knock' ? [-0.9, -0.2] : [0.5, -0.6]);
    bunk(1200, LOOK.nora, '#2f7a6a', a === 'walls' || a === 'silence', [-0.4, -0.6]);
    dark(540, 1100, 900, 0.88, '4,6,14');
    glow(830, 380, 360, '150,180,230', 0.14);
    const toc = (x, y, at) => { const k = seg(p, at, at + 0.06), f = 1 - seg(p, at + 0.06, at + 0.2); if (k > 0 && f > 0) txt('TOC', x, y, 96, { col: '#f2f2f2', alpha: Math.min(k, f), sx: 0.85 }); };
    if (a === 'knock') { [0.5, 0.6, 0.7].forEach((at, k) => toc(170 + k * 50, 520 + k * 70, at)); }
    if (a === 'walls') { [[0.18, 120, 600], [0.3, 960, 640], [0.48, 160, 1250], [0.62, 940, 1230], [0.78, 540, 340]].forEach(([at, x, y]) => toc(x, y, at)); }
    if (a !== 'sleep') { const hb = Math.abs(Math.sin(t * 4.5)); ctx.fillStyle = `rgba(120,0,0,${0.08 * hb})`; ctx.fillRect(0, 0, W, H); }
  };
  S.window = (b, p, t) => {
    ctx.fillStyle = '#0e1628'; ctx.fillRect(0, 0, W, H);
    const z = b.a === 'none' ? lerp(1, 1.5, ease(p)) : 1; ctx.save(); ctx.translate(540, 1100); ctx.scale(z, z); ctx.translate(-540, -1100);
    const g = ctx.createLinearGradient(0, 300, 0, 1700); g.addColorStop(0, '#22304e'); g.addColorStop(1, '#cfd7e4'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#dfe6f0'; ctx.fillRect(0, 900, W, H);
    // footprints from the forest edge to the door (bottom right), none leaving
    for (let k = 0; k < 16; k++) { const u = k / 15, x = lerp(150, 830, u) + (k % 2 ? 22 : -22), y = lerp(960, 1620, u * u), sz = lerp(0.5, 1.4, u); ell(x, y, 13 * sz, 22 * sz, '#9aa7bc', null, 0, 0.3); }
    rr(800, 1560, 300, 400, 6, '#5a3a26'); ctx.globalAlpha = 0.9; poly([[780, 1550], [1120, 1550], [1120, 1600], [780, 1600]], '#eef2f7', null); ctx.globalAlpha = 1;
    rs = 12; for (let k = 0; k < 14; k++) { const x = rnd() * W; poly([[x - 60, 930], [x, 640 + rnd() * 80], [x + 60, 930]], '#15203a', null); }
    ctx.restore();
    snowfall(t, 120, 1.2, 90);
    rr(-20, -20, W + 40, 260, 0, '#3e2a1c', null); rr(-20, H - 260, W + 40, 300, 0, '#3e2a1c', null); rr(-20, 0, 120, H, 0, '#3e2a1c', null); rr(W - 100, 0, 140, H, 0, '#3e2a1c', null); ln([[540, 240], [540, H - 260]], '#3e2a1c', 26); ln([[100, 960], [W - 100, 960]], '#3e2a1c', 22);
    dark(540, 1100, 1000, 0.55);
  };
  S.watch = (b, p, t) => {
    ctx.fillStyle = '#07090e'; ctx.fillRect(0, 0, W, H);
    rr(380, 500, 320, 900, 60, '#22242a', null); rr(330, 700, 420, 460, 90, '#3a3d45'); rr(370, 740, 340, 380, 60, '#0b1a12');
    const show = p > 0.3 || Math.floor(t * 2) % 2 ? '03:12' : '03:11';
    txt(show, 540, 930, 120, { col: '#56f08a', font: 'DejaVu Sans Mono' }); glow(540, 930, 300, '80,240,140', 0.25);
    person(540, 2700, 3.0, LOOK.jules, { face: 'scared', t, gaze: [0, 1] }); dark(540, 930, 900, 0.7);
  };
  S.door = (b, p, t) => {
    woodRoom(t, { stove: 0 }); const k = ease(seg(p, 0, 0.35));
    rr(300, 520, 480, 800, 6, '#07090f'); const sky = ctx.createLinearGradient(0, 520, 0, 1320); sky.addColorStop(0, '#0d1424'); sky.addColorStop(1, '#3a4864'); ctx.fillStyle = sky; ctx.fillRect(300, 520, 480, 800);
    ctx.save(); ctx.beginPath(); ctx.rect(300, 520, 480, 800); ctx.clip(); snowfall(t, 80, 2, -260); ctx.restore();
    poly([[300, 520], [300 + 480 * (1 - k * 0.8), 540], [300 + 480 * (1 - k * 0.8), 1300], [300, 1320]], '#6a4a32'); circ(300 + 480 * (1 - k * 0.8) - 40, 930, 12, '#c9a24a');
    ctx.save(); ctx.globalAlpha = 0.6; for (let i = 0; i < 40; i++) { const u = ((t * 0.9 + i / 40) % 1); circ(lerp(540, 540 + (i % 7 - 3) * 160, u), lerp(950, 1700 + (i % 5) * 40, u), 3 + u * 5, '#ffffff', null); } ctx.restore();
    for (const [x, L] of [[230, LOOK.sami], [540, LOOK.jules], [850, LOOK.nora]]) { ctx.save(); ctx.globalAlpha = 0.97; person(x, 2050, 1.1, { ...L, coat: '#0d0f16', shirt: '#0d0f16', pants: '#0a0b10', shoes: '#0a0b10', skin: '#151720', hairCol: '#0a0b10' }, { face: 'calm', t, back: 1 }); ctx.restore(); }
    dark(540, 920, 1000, 0.7);
  };
  S.card = (b, p, t) => { notebook(t, { right: 'blank', zoom: lerp(1.0, 1.25, ease(p)), cx: 540, cy: 960 }); dark(600, 900, 1000, 0.75); };
  S.endcard = (b, p, t) => {
    ctx.fillStyle = '#06070b'; ctx.fillRect(0, 0, W, H); const k = ease(seg(p, 0, 0.3));
    txt('LE CARNET', W / 2, 820, 130, { col: '#eef0f4', alpha: k, sx: 0.85 }); txt('DU REFUGE', W / 2, 960, 130, { col: '#e2382c', alpha: k, sx: 0.85 });
    hand('N\'ouvrez pas.', 380, 1110, 64, `rgba(200,200,205,${ease(seg(p, 0.3, 0.6))})`);
    snowfall(t, 60, 0.6, 30);
  };

  // ---------- HUD + captions
  function hud(b) {
    if (!b.clock) return;
    const lab = FILM.beats.slice(0, FILM.beats.indexOf(b) + 1).reverse().find(x => x.hud)?.hud || '';
    ctx.save(); ctx.fillStyle = '#e2382c'; ctx.beginPath(); ctx.arc(W / 2 - 235, 108, 9, 0, 7); ctx.fill(); ctx.restore();
    txt(lab, W / 2 + 10, 110, 30, { col: '#e8e8e8' }); txt(b.clock, W / 2, 182, 64, { col: '#ffffff', font: 'DejaVu Sans Mono' });
  }
  function captions(b, t) {
    if (!b.t) return;
    const tail = b.s === 'card' ? 1.0 : 0.6, a0 = b.start + 0.25, len = Math.max(0.5, b.dur - 0.25 - tail);
    const words = b.t.split(' '), tot = b.t.length; let acc = 0; const times = words.map(w => { const s = a0 + acc / tot * len; acc += w.length + 1; return s; });
    let cur = -1; times.forEach((s, k) => { if (t >= s) cur = k; }); if (cur < 0) return;
    const chunk = Math.floor(cur / 3) * 3, show = words.slice(chunk, chunk + 3);
    ctx.save(); let fs = 88; const SX = 0.82; ctx.font = `900 ${fs}px DejaVu Sans`; const full = show.join(' ').toUpperCase(); while (ctx.measureText(full).width * SX > 960 && fs > 44) { fs -= 4; ctx.font = `900 ${fs}px DejaVu Sans`; }
    ctx.translate(W / 2, H * 0.75); ctx.scale(SX, 1); let x = -ctx.measureText(full).width / 2; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
    show.forEach((w, k) => { const s = w.toUpperCase() + (k < show.length - 1 ? ' ' : ''); ctx.lineWidth = fs / 4.5; ctx.strokeStyle = '#000'; ctx.strokeText(s, x, 0); ctx.fillStyle = chunk + k === cur ? '#ff4a3d' : '#ffffff'; ctx.fillText(s, x, 0); x += ctx.measureText(s).width; });
    ctx.restore();
  }
  const FILM = window.FILM;
  function render(t) {
    const i = Math.max(0, FILM.beats.findIndex(b => t < b.start + b.dur));
    const b = FILM.beats[i] || FILM.beats[FILM.beats.length - 1];
    const p = clamp((t - b.start) / b.dur);
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, W, H);
    const cam = ['card', 'endcard', 'carnet'].includes(b.s) ? 1 : 1.0 + 0.04 * p;
    ctx.translate(W / 2, H / 2); ctx.scale(cam, cam); ctx.translate(-W / 2, -H / 2);
    (S[b.s] || S.endcard)(b, p, t, i);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    grain(t, 0.07);
    const v = ctx.createRadialGradient(W / 2, H / 2, H * 0.35, W / 2, H / 2, H * 0.75); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,0.5)'); ctx.fillStyle = v; ctx.fillRect(0, 0, W, H);
    hud(b); captions(b, t);
    const prev = FILM.beats[i - 1], next = FILM.beats[i + 1]; let fade = 0;
    if (prev && prev.s !== b.s) fade = Math.max(fade, 1 - clamp((t - b.start) / 0.25));
    if (next && next.s !== b.s) fade = Math.max(fade, clamp((t - (b.start + b.dur - 0.25)) / 0.25));
    if (t < 0.6) fade = 1 - t / 0.6;
    if (fade > 0) { ctx.fillStyle = `rgba(0,0,0,${fade})`; ctx.fillRect(0, 0, W, H); }
  }
  return { render };
}
window.CarnetFilm = { create };
