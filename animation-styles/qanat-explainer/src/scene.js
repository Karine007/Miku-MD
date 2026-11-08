// "The Qanat" — original 3D explainer (vertical 1080x1920), fast casual narration + one-word captions.
// A desert village gets water from a qanat: mother well -> gently sloping tunnel -> access shafts -> outlet.
// render(t) is a pure function of time; beat timing (window.FILM) comes from src/make_voice.py.
import * as THREE from 'three';

const W = 1080, H = 1920;
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, k) => a + (b - a) * k;
const ease = k => k * k * (3 - 2 * k);
const seg = (t, a, b) => clamp((t - a) / (b - a));
const v3 = (x, y, z) => new THREE.Vector3(x, y, z);
let seed = 7; const rand = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };

// ---------- world shape
const rise = x => Math.max(0, x - 5) * 0.25;                       // alluvial slope up toward the mountains
const gauss = (x, z, cx, cz, a, r) => a * Math.exp(-((x - cx) ** 2 + (z - cz) ** 2) / (r * r));
function h(x, z) {
  let y = rise(x) + 0.35 * Math.sin(x * 0.17 + z * 0.11) * Math.cos(z * 0.13 - x * 0.05);
  y += gauss(x, z, 165, -25, 45, 35) + gauss(x, z, 150, 38, 36, 30) + gauss(x, z, 192, 8, 58, 42) + gauss(x, z, 128, -62, 26, 24) + gauss(x, z, 140, 70, 30, 26);
  if (x < 4) y *= clamp((x + 4) / 8, 0, 1) * 0 + (x < -2 ? 0.25 : 1);
  return y;
}
const gw = x => -12 + Math.max(0, x - 35) * 0.26;                  // groundwater table rises toward the mountains
const tunnelY = x => -0.6 + 3.0 * (x / 100);                       // tunnel centre line: 3 m drop over 100 m
const WELL_X = 100, SHAFTS = [14, 26, 38, 50, 62, 74, 86];

export function create(canvas3d, canvas2d) {
  const r = new THREE.WebGLRenderer({ canvas: canvas3d, antialias: true, preserveDrawingBuffer: true });
  r.setPixelRatio(1); r.setSize(W, H, false); r.shadowMap.enabled = true; r.shadowMap.type = THREE.PCFSoftShadowMap;
  r.toneMapping = THREE.ACESFilmicToneMapping; r.toneMappingExposure = 1.05;
  const scene = new THREE.Scene(); scene.background = new THREE.Color('#8fcdf2'); scene.fog = new THREE.Fog('#bfe0f2', 180, 420);
  const cam = new THREE.PerspectiveCamera(50, W / H, 0.5, 900);
  const g2 = canvas2d.getContext('2d');
  const sun = new THREE.DirectionalLight('#fff3dc', 2.6); sun.position.set(60, 140, 90); sun.target.position.set(-10, 0, 0); sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024); Object.assign(sun.shadow.camera, { left: -90, right: 90, top: 90, bottom: -90, near: 10, far: 400 }); scene.add(sun, sun.target);
  scene.add(new THREE.HemisphereLight('#dff1ff', '#b08a5a', 1.1));
  const M = {}; const mat = (c, o = {}) => M[c + JSON.stringify(o)] ??= new THREE.MeshLambertMaterial({ color: c, ...o });
  const basic = (c, o = {}) => M['b' + c + JSON.stringify(o)] ??= new THREE.MeshBasicMaterial({ color: c, ...o });
  const box = (w, hh, d, c, x, y, z, p = scene, o = {}) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, hh, d), o.mat || mat(c)); m.position.set(x, y, z); m.castShadow = o.shadow !== false; m.receiveShadow = true; p.add(m); return m; };

  // ---------- terrain (two halves so the near half can be hidden for cutaway shots)
  const SAND = new THREE.Color('#e7c992'), SLOPE = new THREE.Color('#d2a368'), ROCK = new THREE.Color('#8f6a4c'), SNOW = new THREE.Color('#f4f2ee'), GREEN = new THREE.Color('#7fb04f');
  function terrain(z0, z1) {
    const g = new THREE.PlaneGeometry(300, z1 - z0, 150, Math.round((z1 - z0) / 2)); g.rotateX(-Math.PI / 2);
    const pos = g.attributes.position, col = []; const c = new THREE.Color();
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i) + 70, z = pos.getZ(i) + (z0 + z1) / 2, y = h(x, z); pos.setXYZ(i, x, y, z);
      const k = clamp((y - rise(x)) / 30); c.copy(SAND).lerp(SLOPE, clamp(x / 100)).lerp(ROCK, k); if (y > 50) c.lerp(SNOW, clamp((y - 50) / 6));
      col.push(c.r, c.g, c.b);
    }
    g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3)); g.computeVertexNormals();
    const m = new THREE.Mesh(g, new THREE.MeshLambertMaterial({ vertexColors: true })); m.receiveShadow = true; scene.add(m); return m;
  }
  const backHalf = terrain(-140, 0), frontHalf = terrain(0, 140);

  // ---------- cutaway face at z = 0 (flat diagram colours)
  const face = new THREE.Group(); scene.add(face);
  function band(top, bot, x0, x1, c, z, o = {}) { const s = new THREE.Shape(); s.moveTo(x0, top(x0)); for (let x = x0; x <= x1; x += 1.5) s.lineTo(x, top(x)); s.lineTo(x1, top(x1)); for (let x = x1; x >= x0; x -= 1.5) s.lineTo(x, bot(x)); s.lineTo(x0, bot(x0)); const m = new THREE.Mesh(new THREE.ShapeGeometry(s), basic(c, o)); m.position.z = z; face.add(m); return m; }
  const top = x => h(x, 0);
  band(top, () => -40, -60, 220, '#8a6650', 0.01);
  band(top, x => top(x) * 0.55 - 9, -60, 220, '#b88a5f', 0.02);
  band(top, x => top(x) - 3.2, -60, 220, '#d9b679', 0.03);
  const gwBand = band(x => Math.min(gw(x), top(x) - 4), () => -40, 40, 220, '#3c8fd8', 0.04, { transparent: true, opacity: 0.85 });
  rand(); seed = 3; for (let i = 0; i < 70; i++) { const x = -55 + rand() * 270, y = -38 + rand() * 30; if (y < top(x) - 6) { const m = new THREE.Mesh(new THREE.CircleGeometry(0.5 + rand() * 1.4, 7), basic(rand() > 0.5 ? '#7a5a46' : '#9c7a5c')); m.position.set(x, y, 0.045); face.add(m); } }
  // underground features drawn on the face
  const unit = new THREE.BoxGeometry(1, 1, 0.2); unit.translate(0.5, 0, 0);
  const vunit = new THREE.BoxGeometry(1, 1, 0.2); vunit.translate(0, -0.5, 0);
  const DARK = '#2a1d16', WATER = '#2f86e0';
  function seg2(c, thick, z) { const m = new THREE.Mesh(unit, basic(c)); m.position.z = z; m.scale.y = thick; face.add(m); return m; }
  function place(m, ax, ay, bx, by, k) { m.position.x = ax; m.position.y = ay; m.rotation.z = Math.atan2(by - ay, bx - ax); m.scale.x = Math.max(0.001, Math.hypot(bx - ax, by - ay) * k); m.visible = k > 0.001; }
  const tunnel = seg2(DARK, 2.4, 0.1), tunnelWater = seg2(WATER, 1.2, 0.12);
  const steep = seg2('#3a2018', 2.4, 0.13), flat = seg2('#3a2018', 2.4, 0.13), steepW = seg2('#ffffff', 0.5, 0.14), flatW = seg2(WATER, 1.0, 0.14);
  const well = new THREE.Mesh(vunit, basic(DARK)); well.position.set(WELL_X, top(WELL_X), 0.1); well.scale.x = 3; face.add(well);
  const wellWater = new THREE.Mesh(vunit, basic(WATER)); wellWater.position.set(WELL_X, gw(WELL_X), 0.11); wellWater.scale.set(2.8, gw(WELL_X) - 1.0, 1); face.add(wellWater);
  const shafts = SHAFTS.map(x => { const m = new THREE.Mesh(vunit, basic(DARK)); m.position.set(x, top(x), 0.1); m.scale.x = 1.4; face.add(m); return m; });
  const arrow = new THREE.Group(); { const s = new THREE.Mesh(unit, basic('#ff3b30')); s.scale.set(70, 0.7, 1); arrow.add(s); const c = new THREE.Mesh(new THREE.ConeGeometry(2, 4.5, 3), basic('#ff3b30')); c.rotation.z = Math.PI / 2; c.position.x = 70; arrow.add(c); } arrow.position.z = 0.2; face.add(arrow);
  // flowing droplets / streaks in the tunnel
  const drops = []; for (let i = 0; i < 26; i++) { const m = new THREE.Mesh(new THREE.CircleGeometry(0.45, 8), basic('#d8f0ff')); m.position.z = 0.16; face.add(m); drops.push(m); }

  // ---------- surface features
  const RING = new THREE.TorusGeometry(2.2, 0.85, 6, 14);
  const mounds = [...SHAFTS, WELL_X].map(x => { const m = new THREE.Mesh(RING, mat('#c79a62')); m.rotation.x = Math.PI / 2; m.position.set(x, top(x) + 0.2, 0); m.castShadow = true; scene.add(m); return m; });
  const holeCaps = [...SHAFTS, WELL_X].map(x => { const m = new THREE.Mesh(new THREE.CircleGeometry(1.5, 12), basic('#1d140f')); m.rotation.x = -Math.PI / 2; m.position.set(x, top(x) + 0.25, 0); scene.add(m); return m; });
  // windlass (rope + bucket) used for digging
  const windlass = new THREE.Group(); scene.add(windlass);
  box(0.4, 3.4, 0.4, '#7a5232', -2.2, 1.7, 0, windlass); box(0.4, 3.4, 0.4, '#7a5232', 2.2, 1.7, 0, windlass); const bar = box(4.8, 0.45, 0.45, '#5e3e28', 0, 3.3, 0, windlass);
  const rope = box(0.08, 1, 0.08, '#e8dcc0', 0, 0, 0, windlass, { shadow: false }); const bucket = box(0.9, 0.9, 0.9, '#6b4a30', 0, 0, 0, windlass);
  // village: flat-roofed adobe houses, domes, a wind tower, palms, fields, channel, pool
  const village = new THREE.Group(); scene.add(village);
  seed = 11; const houses = [];
  for (let i = 0; i < 26; i++) { const x = -60 + rand() * 52, z = -34 + rand() * 68; if (x > -26 && Math.abs(z) < 16) continue; if (x < -30 && z > 10) continue; const w = 5 + rand() * 4, d = 5 + rand() * 4, hh = 3.4 + rand() * 2.6, c = ['#d9b98a', '#cfa978', '#e2c79c'][i % 3];
    box(w, hh, d, c, x, hh / 2, z, village); box(w + 0.5, 0.5, d + 0.5, '#bf9a6a', x, hh + 0.25, z, village); box(1.2, 2, 0.1, '#5a3a26', x, 1, z + d / 2 + 0.05, village, { shadow: false }); box(0.9, 0.9, 0.1, '#3a2a20', x + w * 0.28, hh * 0.62, z + d / 2 + 0.05, village, { shadow: false });
    if (i % 5 === 0) { const dome = new THREE.Mesh(new THREE.SphereGeometry(Math.min(w, d) * 0.38, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2), mat('#e7d2ac')); dome.position.set(x, hh + 0.5, z); dome.castShadow = true; village.add(dome); } houses.push([x, z]); }
  box(3, 11, 3, '#d4b07e', -40, 5.5, -20, village); for (const sx of [-1, 1]) box(0.3, 2.4, 2.2, '#3a2a20', -40 + sx * 1.5, 9.5, -20, village, { shadow: false });
  const palm = (x, z, s = 1) => { const g = new THREE.Group(); g.position.set(x, 0, z); g.scale.setScalar(s); village.add(g); const tr = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.4, 7, 6), mat('#8a6440')); tr.position.y = 3.5; tr.rotation.z = 0.08; tr.castShadow = true; g.add(tr);
    for (let k = 0; k < 7; k++) { const f = new THREE.Mesh(new THREE.ConeGeometry(0.7, 4.2, 4), mat('#4f8a3a')); f.position.set(Math.cos(k) * 1.6, 6.8, Math.sin(k) * 1.6); f.rotation.set(Math.sin(k) * 1.2, 0, -Math.cos(k) * 1.2); f.castShadow = true; g.add(f); } return g; };
  [[-14, 8], [-24, -14], [-6, 12], [-31, 4], [-48, 2], [-2, -12], [-18, 16], [-36, -32], [-55, 22]].forEach(([x, z], i) => palm(x, z, 0.9 + (i % 3) * 0.15));
  const fieldMats = []; [[-46, 22, 22, 18], [-46, -44 + 22, 14, 10], [-62 + 7, -6, 10, 14]].forEach(([x, z, w, d]) => { const m = new THREE.MeshLambertMaterial({ color: '#c9a46a' }); fieldMats.push(m); const f = new THREE.Mesh(new THREE.BoxGeometry(w, 0.3, d), m); f.position.set(x, 0.15, z); f.receiveShadow = true; village.add(f);
    for (let k = 0; k < Math.floor(w / 2.5); k++) { const row = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.5, d - 1), m); row.position.set(x - w / 2 + 1.5 + k * 2.5, 0.4, z); village.add(row); } });
  const crops = []; seed = 21; for (let i = 0; i < 60; i++) { const fx = [[-46, 22, 22, 18], [-46, -22, 14, 10], [-55, -6, 10, 14]][i % 3]; const m = new THREE.Mesh(new THREE.ConeGeometry(0.5, 1.4, 5), mat('#5c9a3a')); m.position.set(fx[0] - fx[2] / 2 + 1 + rand() * (fx[2] - 2), 0.9, fx[1] - fx[3] / 2 + 1 + rand() * (fx[3] - 2)); village.add(m); crops.push(m); }
  box(13, 0.8, 1.6, '#b48a5a', -4.5, 0.2, -1.2, village); const channelW = box(13, 0.3, 1.0, WATER, -4.5, 0.55, -1.2, village, { shadow: false, mat: new THREE.MeshLambertMaterial({ color: WATER, emissive: '#0b2a55' }) });
  box(12, 0.8, 8, '#b48a5a', -17, 0.0, -6, village); const poolW = box(10.6, 0.2, 6.6, WATER, -17, 0.3, -6, village, { shadow: false, mat: new THREE.MeshLambertMaterial({ color: WATER, emissive: '#0b2a55' }) });
  // villagers
  function person(robe, wrap) { const g = new THREE.Group(); const b = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.85, 2.6, 8), mat(robe)); b.position.y = 1.3; b.castShadow = true; g.add(b); const hd = new THREE.Mesh(new THREE.SphereGeometry(0.5, 12, 10), mat('#b07a52')); hd.position.y = 3.0; g.add(hd); const w = new THREE.Mesh(new THREE.SphereGeometry(0.56, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), mat(wrap)); w.position.y = 3.1; g.add(w);
    const armL = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 1.5, 6), mat(robe)); armL.position.set(-0.75, 1.9, 0.2); armL.rotation.x = -0.6; g.add(armL); const armR = armL.clone(); armR.position.x = 0.75; g.add(armR); scene.add(g); return g; }
  const p1 = person('#3f6fb0', '#f2efe6'), p2 = person('#b0473f', '#e9d9b0'), digger = person('#7a6a4f', '#efe8d6');
  const jug = box(0.6, 0.9, 0.6, '#b8643a', 0, 0, 0, p1); jug.position.set(0, 1.5, 0.9);
  const sunBall = new THREE.Mesh(new THREE.SphereGeometry(9, 20, 14), basic('#fff2b0')); sunBall.position.set(120, 120, -150); scene.add(sunBall);

  // ---------- state per film time
  const FILM = window.FILM; const B = {}; FILM.beats.forEach(b => B[b.s] = b);
  const at = (name, k = 0) => B[name].start + B[name].dur * k;
  function setState(t) {
    const present = t < at('mother_well') || t >= at('aerial');
    const wellK = present ? 1 : ease(seg(t, at('mother_well', 0.05), at('mother_well', 0.75)));
    const tunK = present ? 1 : lerp(0, 0.93, ease(seg(t, at('tunnel_dig', 0.05), at('tunnel_dig', 0.95)))) + (t >= at('breakthrough') ? 0.07 * ease(seg(t, at('breakthrough', 0.05), at('breakthrough', 0.35))) : 0);
    const flowStart = at('breakthrough', 0.35);
    const flowK = present ? 1 : ease(seg(t, flowStart, at('underground', 0.95)));
    const villageWater = present ? 1 : ease(seg(t, at('outlet', 0.1), at('outlet', 0.9)));
    const greenK = present ? 1 : ease(seg(t, at('green', 0.05), at('green', 0.9)));
    // well: grows downward
    const wellDepth = top(WELL_X) - 1.0; well.scale.y = wellDepth * wellK; well.visible = wellK > 0.01; wellWater.visible = wellK > 0.97;
    // tunnel from the outlet to the well
    const ax = 0, ay = tunnelY(0), bx = WELL_X, by = tunnelY(WELL_X); place(tunnel, ax, ay, bx, by, tunK);
    place(tunnelWater, bx, by - 0.3, ax, ay - 0.3, flowK);
    // shafts appear one by one (top down)
    SHAFTS.forEach((x, i) => { const k = present ? 1 : ease(seg(t, at('shafts', 0.08 + i * 0.12), at('shafts', 0.2 + i * 0.12))); shafts[i].scale.y = (top(x) - tunnelY(x)) * k; shafts[i].visible = k > 0.01; mounds[i].visible = k > 0.6; holeCaps[i].visible = k > 0.1; });
    mounds[SHAFTS.length].visible = wellK > 0.5; holeCaps[SHAFTS.length].visible = wellK > 0.05;
    // slope diagrams
    const sb = t >= at('slope_bad') && t < at('breakthrough'); const sp = sb ? (t - at('slope_bad')) / B.slope_bad.dur : 0;
    steep.visible = flat.visible = steepW.visible = flatW.visible = false;
    if (sb && sp < 0.5) { place(steep, 20, -1, 80, 12, 1); steep.visible = true; place(steepW, 80, 12, 20, -1, (t * 3) % 1); steepW.visible = true; }
    if (sb && sp >= 0.5) { place(flat, 20, 3.5, 80, 3.5, 1); flat.visible = true; place(flatW, 20, 3.5, 80, 3.5, 1); flatW.visible = true; }
    tunnel.visible = tunnel.visible && !sb; tunnelWater.visible = tunnelWater.visible && !sb;
    arrow.visible = t >= at('slope') && t < at('slope_bad'); if (arrow.visible) { const k = ease(seg(t, at('slope', 0.1), at('slope', 0.5))); arrow.position.set(lerp(95, 95, 0), tunnelY(95) + 4, 0.2); arrow.rotation.z = Math.PI + Math.atan2(tunnelY(95) - tunnelY(10), 85); arrow.scale.x = Math.max(0.01, k); }
    // droplets along the tunnel once water flows (or along the slope diagrams)
    drops.forEach((d, i) => { d.visible = false; });
    if (flowK > 0.02 && !sb) drops.forEach((d, i) => { const u = (i / drops.length + t * 0.25) % 1; if (u > flowK) return; const x = lerp(WELL_X, 0, u); d.position.set(x, tunnelY(x) - 0.3 + Math.sin(i * 7 + t * 5) * 0.25, 0.16); d.visible = true; });
    if (sb && sp < 0.5) drops.forEach((d, i) => { const u = (i / drops.length + t * 1.2) % 1; d.position.set(lerp(80, 20, u), lerp(12, -1, u) + Math.sin(i * 3 + t * 30) * 0.6, 0.16); d.visible = true; });
    // village water + greening
    channelW.visible = villageWater > 0.02; channelW.scale.x = Math.max(0.01, villageWater); channelW.position.x = 2 - 6.5 * villageWater;
    poolW.visible = villageWater > 0.5; poolW.position.y = lerp(-0.3, 0.3, seg(villageWater, 0.5, 1));
    const fc = new THREE.Color('#c9a46a').lerp(new THREE.Color('#7fb04f'), greenK); fieldMats.forEach(m => m.color.copy(fc));
    crops.forEach((c, i) => { const k = clamp(greenK * 1.4 - (i % 10) * 0.04); c.scale.setScalar(Math.max(0.001, k)); c.visible = k > 0.01; });
    return { present, wellK, flowK };
  }

  // ---------- shots
  function shot(from, to, lf, lt, k) { cam.position.copy(from).lerp(to, ease(k)); cam.lookAt(lf.clone().lerp(lt, ease(k))); }
  function orbit(cx, cy, cz, r, hgt, a0, a1, k, ly = 0) { const a = lerp(a0, a1, k); cam.position.set(cx + Math.cos(a) * r, cy + hgt, cz + Math.sin(a) * r); cam.lookAt(cx, cy + ly, cz); }
  const S = {
    village_dry: (p, t) => orbit(-26, 0, 0, 62, 44, 1.1, 1.5, p, 0),
    village_water: (p, t) => shot(v3(-6, 6, 12), v3(-9, 4.5, 8), v3(-15, 1.4, -5), v3(-16, 1.2, -6), p),
    pan_mountains: (p, t) => shot(v3(-22, 9, 10), v3(-22, 14, 14), v3(10, 6, -2), v3(130, 34, -10), p),
    mother_well: (p, t) => shot(v3(100, 6, 58), v3(100, 8, 48), v3(100, 4, 0), v3(100, 6, 0), p),
    tunnel_dig: (p, t) => { const x = lerp(8, 92, ease(seg(p, 0.05, 0.95))); cam.position.set(x - 2, 6, 52); cam.lookAt(x + 4, 1, 0); },
    shafts: (p, t) => shot(v3(30, 14, 95), v3(70, 18, 100), v3(30, 4, 0), v3(70, 8, 0), p),
    shafts_use: (p, t) => shot(v3(54, 16, 34), v3(52, 18, 28), v3(50, 9, 0), v3(50, 10, 0), p),
    slope: (p, t) => shot(v3(50, 10, 110), v3(50, 10, 104), v3(50, 6, 0), v3(50, 6, 0), p),
    slope_bad: (p, t) => shot(v3(50, 8, 92), v3(50, 8, 90), v3(50, 5, 0), v3(50, 5, 0), p),
    breakthrough: (p, t) => shot(v3(96, 6, 30), v3(97, 5, 26), v3(98, 2, 0), v3(98, 2, 0), p),
    underground: (p, t) => { const x = lerp(92, 10, ease(p)); cam.position.set(x, 8, 40); cam.lookAt(x - 6, 2, 0); },
    outlet: (p, t) => shot(v3(14, 9, 18), v3(8, 8, 16), v3(-2, 0.5, -1), v3(-12, 0.5, -5), p),
    green: (p, t) => orbit(-28, 0, 0, 55, 34, 0.5, 0.9, p, 0),
    aerial: (p, t) => shot(v3(-40, 60, 60), v3(-30, 80, 70), v3(20, 0, 0), v3(60, 0, 0), p),
    aerial_far: (p, t) => shot(v3(-80, 110, 90), v3(-100, 150, 120), v3(40, 0, 0), v3(60, 10, 0), p),
    final: (p, t) => orbit(20, 0, 0, 150, 90, 1.4, 1.75, p, 0),
    endcard: (p, t) => orbit(20, 0, 0, 160, 100, 1.75, 1.85, p, 0),
  };
  const CUT = new Set(['mother_well', 'tunnel_dig', 'shafts', 'shafts_use', 'slope', 'slope_bad', 'breakthrough', 'underground']);

  // ---------- captions: one word at a time, centred
  function caption(b, t) {
    if (!b.t) return;
    const a0 = b.start + 0.15, len = Math.max(0.4, b.dur - 0.15 - 0.3);
    const words = b.t.split(' '), tot = b.t.length; let acc = 0, cur = -1, ws = 0;
    words.forEach((w, k) => { const s = a0 + acc / tot * len; acc += w.length + 1; if (t >= s) { cur = k; ws = s; } });
    if (cur < 0) return; const w = words[cur].replace(/[«»"]/g, '');
    const pop = 1 + 0.18 * (1 - clamp((t - ws) / 0.12));
    g2.save(); g2.translate(W / 2, H * 0.47); g2.scale(pop, pop); let fs = 104; g2.font = `900 ${fs}px DejaVu Sans`; while (g2.measureText(w).width > 940) { fs -= 6; g2.font = `900 ${fs}px DejaVu Sans`; }
    g2.textAlign = 'center'; g2.textBaseline = 'middle'; g2.lineJoin = 'round'; g2.lineWidth = fs / 4; g2.strokeStyle = '#000'; g2.strokeText(w, 0, 0); g2.fillStyle = '#fff'; g2.fillText(w, 0, 0); g2.restore();
  }
  function render(t) {
    const i = Math.max(0, FILM.beats.findIndex(b => t < b.start + b.dur)); const b = FILM.beats[i] || FILM.beats[FILM.beats.length - 1];
    const p = clamp((t - b.start) / b.dur);
    const st = setState(t);
    const cut = CUT.has(b.s); frontHalf.visible = !cut; face.visible = cut;
    // digging props
    windlass.visible = digger.visible = false; p1.visible = p2.visible = true;
    p1.position.set(-12.5, 0, -2.2); p1.rotation.y = -0.6; p2.position.set(-20, 0, 1.2); p2.rotation.y = 2.4;
    if (b.s === 'mother_well' || b.s === 'shafts_use') { const x = b.s === 'mother_well' ? WELL_X : 50; windlass.visible = digger.visible = true; windlass.position.set(x, top(x), -1.5); digger.position.set(x + 3.6, top(x), -2.5); digger.rotation.y = -1.2;
      const depth = b.s === 'mother_well' ? (top(x) - 1) * st.wellK : top(x) - tunnelY(x); const u = (Math.sin(t * 1.6) * 0.5 + 0.5); const by = lerp(-depth + 1.2, 2.2, u); bucket.position.set(0, by, 0); rope.position.set(0, (by + 3.3) / 2, 0); rope.scale.y = Math.max(0.05, 3.3 - by); bar.rotation.x = t * 3; }
    (S[b.s] || S.final)(p, t);
    r.render(scene, cam);
    g2.setTransform(1, 0, 0, 1, 0, 0); g2.clearRect(0, 0, W, H);
    caption(b, t);
    if (b.s === 'endcard') { const k = ease(seg(p, 0, 0.3)); g2.save(); g2.globalAlpha = k; g2.textAlign = 'center'; g2.lineJoin = 'round'; g2.font = '900 150px DejaVu Sans'; g2.lineWidth = 30; g2.strokeStyle = '#000'; g2.strokeText('QANAT', W / 2, H * 0.42); g2.fillStyle = '#fff'; g2.fillText('QANAT', W / 2, H * 0.42); g2.font = '800 52px DejaVu Sans'; g2.lineWidth = 12; g2.strokeText('ancient Persian engineering', W / 2, H * 0.42 + 100); g2.fillStyle = '#ffd23c'; g2.fillText('ancient Persian engineering', W / 2, H * 0.42 + 100); g2.restore(); }
    // quick white flash on cuts between shots
    const prev = FILM.beats[i - 1]; if (prev && t - b.start < 0.08) { g2.fillStyle = `rgba(255,255,255,${0.35 * (1 - (t - b.start) / 0.08)})`; g2.fillRect(0, 0, W, H); }
    if (t < 0.25) { g2.fillStyle = `rgba(0,0,0,${1 - t / 0.25})`; g2.fillRect(0, 0, W, H); }
  }
  return { render };
}
window.QanatFilm = { create };
