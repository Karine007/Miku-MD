// "The Qanat" — original 3D explainer (vertical 1080x1920) in a natural, rounded 3D look:
// physical sky + sun, soft shadows, textured sand terrain, rounded adobe houses, curved palms, glossy water,
// and a carved underground cutaway (real holes in a textured earth wall showing the well, tunnel and shafts).
// render(t) is a pure function of time; beat timing (window.FILM) comes from src/make_voice.py.
import * as THREE from 'three';
import { Sky } from 'three/examples/jsm/objects/Sky.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

const W = 1080, H = 1920;
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, k) => a + (b - a) * k;
const ease = k => k * k * (3 - 2 * k);
const seg = (t, a, b) => clamp((t - a) / (b - a));
const v3 = (x, y, z) => new THREE.Vector3(x, y, z);
let seed = 7; const rand = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };

// ---------- world shape
const rise = x => Math.max(0, x - 5) * 0.25;
const gauss = (x, z, cx, cz, a, r) => a * Math.exp(-((x - cx) ** 2 + (z - cz) ** 2) / (r * r));
function h(x, z) {
  let y = rise(x) + 0.45 * Math.sin(x * 0.13 + z * 0.09) * Math.cos(z * 0.11 - x * 0.04) + 0.2 * Math.sin(x * 0.41 + z * 0.37);
  y += gauss(x, z, 165, -25, 45, 35) + gauss(x, z, 150, 38, 36, 30) + gauss(x, z, 192, 8, 58, 42) + gauss(x, z, 128, -62, 26, 24) + gauss(x, z, 140, 70, 30, 26);
  if (x < -2) y *= 0.25;
  return y;
}
const gw = x => -12 + Math.max(0, x - 35) * 0.26;
const tunnelY = x => -3.0 + 3.0 * (x / 100);
const TR = 1.2, XL = 6, WELL_X = 100, WELL_HALF = 1.5, SHAFTS = [14, 26, 38, 50, 62, 74, 86], SH = 0.8;
const top = x => h(x, 0);

// deterministic value noise for textures
function noise2(seedv) { const P = new Float32Array(256 * 256); let s = seedv; for (let i = 0; i < P.length; i++) { s = (s * 16807) % 2147483647; P[i] = s / 2147483647; }
  const at = (x, y) => P[((y & 255) << 8) | (x & 255)];
  return (x, y) => { const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi, u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
    return lerp(lerp(at(xi, yi), at(xi + 1, yi), u), lerp(at(xi, yi + 1), at(xi + 1, yi + 1), u), v); }; }
const n1 = noise2(11), n2 = noise2(29);
const fbm = (x, y) => n1(x, y) * 0.5 + n1(x * 2.1, y * 2.1) * 0.25 + n2(x * 4.3, y * 4.3) * 0.15 + n2(x * 9.1, y * 9.1) * 0.1;
function canvasTex(w, hh, paint, repeat = 1) { const c = document.createElement('canvas'); c.width = w; c.height = hh; const g = c.getContext('2d'); const d = g.createImageData(w, hh); paint(d.data, w, hh); g.putImageData(d, 0, 0);
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(repeat, repeat); t.anisotropy = 4; t.colorSpace = THREE.SRGBColorSpace; return t; }
function normalTex(w, hh, height, strength = 2, repeat = 1) { const c = document.createElement('canvas'); c.width = w; c.height = hh; const g = c.getContext('2d'); const d = g.createImageData(w, hh); const H0 = new Float32Array(w * hh);
  for (let y = 0; y < hh; y++) for (let x = 0; x < w; x++) H0[y * w + x] = height(x, y);
  for (let y = 0; y < hh; y++) for (let x = 0; x < w; x++) { const dx = (H0[y * w + (x + 1) % w] - H0[y * w + (x - 1 + w) % w]) * strength, dy = (H0[((y + 1) % hh) * w + x] - H0[((y - 1 + hh) % hh) * w + x]) * strength; const l = Math.hypot(dx, dy, 1), i = (y * w + x) * 4;
    d.data[i] = (-dx / l * 0.5 + 0.5) * 255; d.data[i + 1] = (-dy / l * 0.5 + 0.5) * 255; d.data[i + 2] = (1 / l * 0.5 + 0.5) * 255; d.data[i + 3] = 255; }
  g.putImageData(d, 0, 0); const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(repeat, repeat); return t; }

export function create(canvas3d, canvas2d) {
  const r = new THREE.WebGLRenderer({ canvas: canvas3d, antialias: true, preserveDrawingBuffer: true });
  r.setPixelRatio(1); r.setSize(W, H, false); r.shadowMap.enabled = true; r.shadowMap.type = THREE.PCFSoftShadowMap;
  r.toneMapping = THREE.ACESFilmicToneMapping; r.toneMappingExposure = 0.55; r.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene(); const cam = new THREE.PerspectiveCamera(48, W / H, 0.3, 4000);
  const g2 = canvas2d.getContext('2d');
  // physical sky + matching environment light
  const sky = new Sky(); sky.scale.setScalar(3000); const su = sky.material.uniforms;
  su.turbidity.value = 6; su.rayleigh.value = 1.2; su.mieCoefficient.value = 0.004; su.mieDirectionalG.value = 0.85;
  const sunDir = new THREE.Vector3().setFromSphericalCoords(1, THREE.MathUtils.degToRad(90 - 38), THREE.MathUtils.degToRad(140)); su.sunPosition.value.copy(sunDir); scene.add(sky);
  { const pm = new THREE.PMREMGenerator(r); const es = new THREE.Scene(); const s2 = new Sky(); s2.scale.setScalar(1000); Object.assign(s2.material.uniforms.sunPosition.value, sunDir); s2.material.uniforms.turbidity.value = 6; s2.material.uniforms.rayleigh.value = 1.2; es.add(s2); scene.environment = pm.fromScene(es).texture; }
  scene.fog = new THREE.FogExp2('#cfd9e2', 0.0032);
  const sun = new THREE.DirectionalLight('#fff1d8', 5.5); sun.position.copy(sunDir).multiplyScalar(220).add(v3(20, 0, 0)); sun.target.position.set(20, 0, 0); sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048); Object.assign(sun.shadow.camera, { left: -110, right: 110, top: 110, bottom: -110, near: 20, far: 600 }); sun.shadow.bias = -0.0006; sun.shadow.normalBias = 0.6; scene.add(sun, sun.target);
  scene.add(new THREE.HemisphereLight('#cfe6ff', '#b58a5a', 0.9));

  // ---------- textures
  const sandMap = canvasTex(512, 512, (d, w, hh) => { for (let y = 0; y < hh; y++) for (let x = 0; x < w; x++) { const v = fbm(x / 22, y / 22), g = n2(x * 1.7, y * 1.7), i = (y * w + x) * 4; d[i] = 215 + v * 30 - g * 18; d[i + 1] = 182 + v * 26 - g * 16; d[i + 2] = 132 + v * 20 - g * 14; d[i + 3] = 255; } }, 34);
  const sandNorm = normalTex(512, 512, (x, y) => Math.sin((x + fbm(x / 40, y / 40) * 60) / 7) * 0.5 + n2(x * 1.3, y * 1.3) * 0.6, 1.6, 34);
  const plaster = canvasTex(256, 256, (d, w, hh) => { for (let y = 0; y < hh; y++) for (let x = 0; x < w; x++) { const v = fbm(x / 10, y / 10), i = (y * w + x) * 4; d[i] = 222 + v * 22; d[i + 1] = 196 + v * 20; d[i + 2] = 154 + v * 18; d[i + 3] = 255; } }, 1);
  const plasterN = normalTex(256, 256, (x, y) => fbm(x / 6, y / 6) * 1.5, 2, 1);
  const bark = canvasTex(64, 256, (d, w, hh) => { for (let y = 0; y < hh; y++) for (let x = 0; x < w; x++) { const ring = (y % 18) < 4 ? -30 : 0, v = n1(x / 3, y / 3) * 20, i = (y * w + x) * 4; d[i] = 120 + ring + v; d[i + 1] = 92 + ring + v; d[i + 2] = 62 + ring + v; d[i + 3] = 255; } }, 1); bark.repeat.set(1, 4);
  const waterN = normalTex(256, 256, (x, y) => Math.sin(x / 9 + n1(x / 30, y / 30) * 6) * 0.5 + Math.sin(y / 7 + n2(x / 25, y / 25) * 5) * 0.5, 2.5, 6);
  const woodT = canvasTex(128, 128, (d, w, hh) => { for (let y = 0; y < hh; y++) for (let x = 0; x < w; x++) { const v = Math.sin(y / 3 + n1(x / 9, y / 2) * 4) * 18, i = (y * w + x) * 4; d[i] = 128 + v; d[i + 1] = 90 + v * 0.8; d[i + 2] = 58 + v * 0.6; d[i + 3] = 255; } }, 1);
  // soil cross-section painted in world units: x in [-40, 240], y in [-40, 60]
  const FX0 = -40, FX1 = 240, FY0 = -40, FY1 = 60;
  const soil = canvasTex(2048, 732, (d, w, hh) => { for (let py = 0; py < hh; py++) for (let px = 0; px < w; px++) {
    const x = FX0 + px / w * (FX1 - FX0), y = FY1 - py / hh * (FY1 - FY0), t0 = top(x), i = (py * w + px) * 4; let c;
    const v = fbm(px / 40, py / 40), g = n2(px * 0.6, py * 0.6), pebble = n1(px / 3, py / 3) > 0.93;
    if (y > t0 - 3.2) c = [214, 180, 128]; else if (y > t0 * 0.55 - 9) c = [182, 136, 92]; else c = [138, 104, 82];
    if (x > 40 && y < Math.min(gw(x), t0 - 4)) c = [104, 122, 128];
    const k = 0.9 + v * 0.16 - g * 0.06; d[i] = c[0] * k + (pebble ? -18 : 0); d[i + 1] = c[1] * k + (pebble ? -16 : 0); d[i + 2] = c[2] * k + (pebble ? -12 : 0); d[i + 3] = 255; } }, 1);
  soil.repeat.set(1 / (FX1 - FX0), 1 / (FY1 - FY0)); soil.offset.set(-FX0 / (FX1 - FX0), -FY0 / (FY1 - FY0));
  const soilN = normalTex(512, 512, (x, y) => fbm(x / 7, y / 7) * 2 + (n1(x / 4, y / 4) > 0.8 ? 1 : 0), 2.5, 1); soilN.repeat.set(1 / 12, 1 / 12);
  const darkSoil = canvasTex(256, 256, (d, w, hh) => { for (let y = 0; y < hh; y++) for (let x = 0; x < w; x++) { const v = fbm(x / 9, y / 9), i = (y * w + x) * 4; d[i] = 96 + v * 40; d[i + 1] = 70 + v * 30; d[i + 2] = 52 + v * 22; d[i + 3] = 255; } }, 1); darkSoil.repeat.set(0.25, 0.25);

  const M = {}; const std = (key, o) => M[key] ??= new THREE.MeshStandardMaterial(o);
  const plasterMat = std('plaster', { map: plaster, normalMap: plasterN, roughness: 0.92, color: '#ffffff' });
  const plasterMat2 = std('plaster2', { map: plaster, normalMap: plasterN, roughness: 0.92, color: '#f3dcc0' });
  const woodMat = std('wood', { map: woodT, roughness: 0.8 });
  const waterMat = std('water', { color: '#2f86a6', roughness: 0.06, metalness: 0.05, normalMap: waterN, normalScale: new THREE.Vector2(0.5, 0.5), transparent: true, opacity: 0.92 });
  const tunWaterMat = std('twater', { color: '#3a95d6', roughness: 0.1, metalness: 0.05, normalMap: waterN, emissive: '#0d3a70', emissiveIntensity: 0.9 });
  const shadowed = m => { m.castShadow = true; m.receiveShadow = true; return m; };

  // ---------- terrain halves
  const SAND = new THREE.Color('#f0d7a6'), SLOPE = new THREE.Color('#dcae79'), ROCK = new THREE.Color('#9b7457'), SNOW = new THREE.Color('#f6f6f4');
  function terrain(z0, z1) {
    const g = new THREE.PlaneGeometry(300, z1 - z0, 220, Math.round((z1 - z0) * 0.75)); g.rotateX(-Math.PI / 2);
    const pos = g.attributes.position, col = []; const c = new THREE.Color();
    for (let i = 0; i < pos.count; i++) { const x = pos.getX(i) + 70, z = pos.getZ(i) + (z0 + z1) / 2, y = h(x, z); pos.setXYZ(i, x, y, z);
      const k = clamp((y - rise(x)) / 28); c.copy(SAND).lerp(SLOPE, clamp(x / 110)).lerp(ROCK, k); if (y > 50) c.lerp(SNOW, clamp((y - 50) / 6)); col.push(c.r, c.g, c.b); }
    g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3)); g.computeVertexNormals();
    const uv = g.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setXY(i, pos.getX(i) / 300, pos.getZ(i) / 300);
    const m = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ vertexColors: true, map: sandMap, normalMap: sandNorm, normalScale: new THREE.Vector2(0.7, 0.7), roughness: 0.96 })); m.receiveShadow = true; scene.add(m); return m;
  }
  const backHalf = terrain(-150, 0), frontHalf = terrain(0, 150);

  // ---------- carved cutaway: textured earth wall at z=0 with real holes + hollow interiors behind
  const face = new THREE.Group(); scene.add(face);
  const faceMat = new THREE.MeshStandardMaterial({ map: soil, normalMap: soilN, roughness: 0.95 });
  const holeMat = new THREE.MeshStandardMaterial({ map: darkSoil, normalMap: soilN, roughness: 1, side: THREE.BackSide, color: '#b9a090' });
  let faceMesh = null, holeMeshes = [], lastKey = '';
  function rect(x0, y0, x1, y1) { return [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]; }
  function buildFace(st) {
    const key = [st.tunK, st.wellK, ...st.shaftK].map(v => v.toFixed(3)).join(','); if (key === lastKey) return; lastKey = key;
    if (faceMesh) { face.remove(faceMesh); faceMesh.geometry.dispose(); } holeMeshes.forEach(m => { face.remove(m); m.geometry.dispose(); }); holeMeshes = [];
    const holes = [];
    const xT = lerp(XL, WELL_X - WELL_HALF - 0.1, Math.min(1, st.tunK)), merged = st.tunK >= 1 && st.wellK >= 1;
    const tb = x => tunnelY(x) - TR, tt = x => tunnelY(x) + TR;
    if (xT - XL > 0.6) {
      const P = []; for (let x = XL; x < xT; x += 2) P.push([x, tb(x)]);
      if (merged) { P.push([WELL_X - WELL_HALF, tb(WELL_X - WELL_HALF)], [WELL_X - WELL_HALF, -2.2], [WELL_X + WELL_HALF, -2.2], [WELL_X + WELL_HALF, top(WELL_X) - 0.3], [WELL_X - WELL_HALF, top(WELL_X) - 0.3], [WELL_X - WELL_HALF, tt(WELL_X - WELL_HALF)]); }
      else P.push([xT, tb(xT)], [xT, tt(xT)]);
      const right = merged ? WELL_X - WELL_HALF : xT;
      const pts = []; for (let x = right; x > XL; x -= 2) pts.push(x);
      const tops = []; let xi = right;
      // top edge walking left, with notches for completed shafts
      const done = SHAFTS.map((x, i) => st.shaftK[i] >= 1 && x + SH < right && x - SH > XL);
      for (let x = right; x > XL; x -= 1) { const si = SHAFTS.findIndex((sx, i) => done[i] && Math.abs(x - sx) < SH + 0.5); if (si >= 0) { const sx = SHAFTS[si]; P.push([sx + SH, tt(sx + SH)], [sx + SH, top(sx) - 0.3], [sx - SH, top(sx) - 0.3], [sx - SH, tt(sx - SH)]); x = sx - SH - 0.5; continue; } P.push([x, tt(x)]); }
      P.push([XL, tt(XL)]); holes.push(P);
    }
    SHAFTS.forEach((sx, i) => { const k = st.shaftK[i]; const connected = k >= 1 && sx + SH < (merged ? WELL_X : xT) && xT - XL > 0.6; if (k > 0.01 && !connected) { const y1 = top(sx) - 0.3, y0 = lerp(y1, tt(sx) + 0.15, Math.min(k, 0.999)); holes.push(rect(sx - SH, y0, sx + SH, y1)); } });
    if (!merged && st.wellK > 0.01) { const y1 = top(WELL_X) - 0.3; holes.push(rect(WELL_X - WELL_HALF, lerp(y1, -2.2, st.wellK), WELL_X + WELL_HALF, y1)); }
    const outer = new THREE.Shape(); outer.moveTo(FX0, FY0); for (let x = FX0; x <= FX1; x += 1) outer.lineTo(x, top(x)); outer.lineTo(FX1, FY0);
    holes.forEach(P => { const p = new THREE.Path(); P.forEach(([x, y], i) => i ? p.lineTo(x, y) : p.moveTo(x, y)); outer.holes.push(p);
      const s = new THREE.Shape(); P.forEach(([x, y], i) => i ? s.lineTo(x, y) : s.moveTo(x, y)); const eg = new THREE.ExtrudeGeometry(s, { depth: 2.6, bevelEnabled: false, curveSegments: 1 }); eg.translate(0, 0, -2.6);
      const m = new THREE.Mesh(eg, holeMat); m.receiveShadow = true; face.add(m); holeMeshes.push(m); });
    faceMesh = new THREE.Mesh(new THREE.ShapeGeometry(outer), faceMat); faceMesh.receiveShadow = true; face.add(faceMesh);
  }
  // water inside the tunnel / well
  const unit = new THREE.BoxGeometry(1, 1, 1); unit.translate(0.5, 0, 0);
  const tunWater = new THREE.Mesh(unit, tunWaterMat); tunWater.scale.set(1, 0.9, 2.3); tunWater.position.z = -1.3; face.add(tunWater);
  const wellWater = new THREE.Mesh(new THREE.BoxGeometry(2.9, 1, 2.4), tunWaterMat); face.add(wellWater);
  const foam = Array.from({ length: 30 }, () => { const m = new THREE.Mesh(new THREE.SphereGeometry(0.16, 8, 6), std('foam', { color: '#e8f6ff', roughness: 0.3, emissive: '#5aa0d0', emissiveIntensity: 0.5 })); face.add(m); return m; });
  function placeSeg(m, ax, ay, bx, by, k) { m.position.x = ax; m.position.y = ay; m.rotation.z = Math.atan2(by - ay, bx - ax); m.scale.x = Math.max(0.001, Math.hypot(bx - ax, by - ay) * k); m.visible = k > 0.002; }
  // slope helpers: 3D arrow and ghost tunnels for the "too steep / too flat" comparison
  const glow = (c, o = 0.75) => new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: 0.8, transparent: true, opacity: o, roughness: 0.4 });
  const arrow = new THREE.Group(); { const s = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 1, 16), glow('#ff4a3d', 0.95)); s.rotation.z = Math.PI / 2; s.position.x = 0.5; s.name = 'shaft'; arrow.add(s); const c = new THREE.Mesh(new THREE.ConeGeometry(1.4, 3.4, 20), glow('#ff4a3d', 0.95)); c.rotation.z = -Math.PI / 2; c.name = 'head'; arrow.add(c); } arrow.position.z = 1.2; scene.add(arrow);
  const ghost = (c) => { const m = new THREE.Mesh(new THREE.CylinderGeometry(TR, TR, 1, 20, 1, true), glow(c, 0.45)); m.geometry.translate(0, 0.5, 0); m.geometry.rotateZ(-Math.PI / 2); m.position.z = 1.5; scene.add(m); return m; };
  const steepG = ghost('#ff6a3d'), flatG = ghost('#ffb13d');
  const streaks = Array.from({ length: 24 }, () => { const m = new THREE.Mesh(new THREE.CapsuleGeometry(0.18, 1.6, 4, 8), std('streak', { color: '#ffffff', emissive: '#bfe6ff', emissiveIntensity: 1 })); m.rotation.z = Math.PI / 2; scene.add(m); return m; });

  // ---------- surface: crater mounds over every shaft + the well
  const moundGeo = new THREE.LatheGeometry([[1.25, -0.4], [1.3, 0.3], [1.9, 0.95], [2.8, 1.05], [3.7, 0.55], [4.4, -0.2]].map(([x, y]) => new THREE.Vector2(x, y)), 36);
  const moundMat = new THREE.MeshStandardMaterial({ map: sandMap, normalMap: sandNorm, color: '#d9b17c', roughness: 0.97 });
  const holeCapMat = std('hole', { color: '#1a120d', roughness: 1 });
  const mounds = [...SHAFTS, WELL_X].map(x => { const g = new THREE.Group(); g.position.set(x, top(x), 0); const m = shadowed(new THREE.Mesh(moundGeo, moundMat)); g.add(m); const cap = new THREE.Mesh(new THREE.CircleGeometry(1.28, 24), holeCapMat); cap.rotation.x = -Math.PI / 2; cap.position.y = -0.2; g.add(cap); scene.add(g); return g; });
  // windlass with rope and bucket
  const windlass = new THREE.Group(); scene.add(windlass);
  const post = (x) => { const m = shadowed(new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.25, 3.6, 10), woodMat)); m.position.set(x, 1.8, 0); windlass.add(m); };
  post(-2.2); post(2.2); const bar = shadowed(new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 5, 14), woodMat)); bar.rotation.z = Math.PI / 2; bar.position.y = 3.4; windlass.add(bar);
  const rope = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1, 6), std('rope', { color: '#d9c9a0', roughness: 0.9 })); windlass.add(rope);
  const bucket = shadowed(new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.42, 0.8, 16), woodMat)); windlass.add(bucket);

  // ---------- village
  const village = new THREE.Group(); scene.add(village);
  seed = 11;
  for (let i = 0; i < 28; i++) { const x = -60 + rand() * 52, z = -34 + rand() * 68; if (x > -26 && Math.abs(z) < 16) continue; if (x < -30 && z > 10) continue; const w = 5 + rand() * 4, d = 5 + rand() * 4, hh = 3.4 + rand() * 2.6, mat = i % 2 ? plasterMat : plasterMat2;
    const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = (rand() - 0.5) * 0.3; village.add(g);
    const b = shadowed(new THREE.Mesh(new RoundedBoxGeometry(w, hh, d, 4, 0.45), mat)); b.position.y = hh / 2; g.add(b);
    const roof = shadowed(new THREE.Mesh(new RoundedBoxGeometry(w + 0.4, 0.55, d + 0.4, 3, 0.22), mat)); roof.position.y = hh + 0.1; g.add(roof);
    const door = shadowed(new THREE.Mesh(new RoundedBoxGeometry(1.2, 2.1, 0.3, 2, 0.1), woodMat)); door.position.set(-w * 0.15, 1.05, d / 2); g.add(door);
    for (const sx of [0.22, -0.4]) { const win = new THREE.Mesh(new RoundedBoxGeometry(0.85, 0.85, 0.25, 2, 0.12), std('win', { color: '#2b1e16', roughness: 0.7 })); win.position.set(w * sx + (sx < 0 ? -0.2 : 0), hh * 0.62, d / 2); g.add(win); }
    for (let k = 0; k < 2; k++) { const beam = shadowed(new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.9, 6), woodMat)); beam.rotation.x = Math.PI / 2; beam.position.set(-w / 2 + 1 + k * 1.4, hh - 0.25, d / 2 + 0.35); g.add(beam); }
    if (i % 4 === 0) { const dome = shadowed(new THREE.Mesh(new THREE.SphereGeometry(Math.min(w, d) * 0.36, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), mat)); dome.position.y = hh + 0.35; g.add(dome); }
  }
  { const tw = shadowed(new THREE.Mesh(new RoundedBoxGeometry(3.2, 11, 3.2, 4, 0.35), plasterMat)); tw.position.set(-40, 5.5, -20); village.add(tw); for (const sx of [-1, 1]) { const sl = new THREE.Mesh(new RoundedBoxGeometry(0.4, 2.6, 2.2, 2, 0.15), std('win', { color: '#2b1e16', roughness: 0.7 })); sl.position.set(-40 + sx * 1.55, 9.2, -20); village.add(sl); } }
  // palms: curved segmented trunk + drooping fronds
  const frondGeo = (() => { const g = new THREE.PlaneGeometry(1.3, 5.2, 1, 12); g.translate(0, 2.6, 0); const p = g.attributes.position; for (let i = 0; i < p.count; i++) { const y = p.getY(i), t = y / 5.2; p.setX(i, p.getX(i) * (1 - t * 0.85) * (0.6 + Math.sin(t * Math.PI) * 0.6)); p.setZ(i, -t * t * 2.6 + Math.abs(p.getX(i)) * 0.35); } g.computeVertexNormals(); return g; })();
  const frondMat = new THREE.MeshStandardMaterial({ color: '#4f8a34', roughness: 0.7, side: THREE.DoubleSide });
  function palm(x, z, s = 1, lean = 0.1) { const g = new THREE.Group(); g.position.set(x, 0, z); g.scale.setScalar(s); g.rotation.y = rand() * 6; village.add(g); let px = 0, py = 0;
    for (let k = 0; k < 9; k++) { const a = lean * k / 9, m = shadowed(new THREE.Mesh(new THREE.CylinderGeometry(0.3 - k * 0.012, 0.36 - k * 0.012, 0.95, 12), new THREE.MeshStandardMaterial({ map: bark, roughness: 0.9 }))); m.position.set(px, py + 0.45, 0); m.rotation.z = -a; g.add(m); px += Math.sin(a) * 0.9; py += Math.cos(a) * 0.9; }
    for (let k = 0; k < 11; k++) { const f = shadowed(new THREE.Mesh(frondGeo, frondMat)); f.position.set(px, py, 0); f.rotation.set(0, k / 11 * Math.PI * 2, 0); f.rotateX(-1.0 - (k % 3) * 0.15); g.add(f); }
    const nuts = new THREE.Mesh(new THREE.SphereGeometry(0.35, 12, 8), std('nut', { color: '#6b4a24', roughness: 0.6 })); nuts.position.set(px, py - 0.3, 0); g.add(nuts); }
  seed = 31; [[-14, 8], [-24, -14], [-6, 12], [-31, 4], [-48, 2], [-2, -12], [-18, 16], [-36, -32], [-55, 22], [-10, -18], [-28, 24]].forEach(([x, z], i) => palm(x, z, 0.95 + (i % 3) * 0.15, 0.15 + (i % 4) * 0.08));
  // fields with soft rows + crops
  const fieldMats = []; const FIELDS = [[-46, 22, 22, 18], [-46, -22, 14, 10], [-55, -6, 10, 14]];
  FIELDS.forEach(([x, z, w, d]) => { const m = new THREE.MeshStandardMaterial({ color: '#b98d5a', roughness: 1, map: sandMap }); fieldMats.push(m); for (let k = 0; k < Math.floor(w / 2.2); k++) { const row = new THREE.Mesh(new THREE.CapsuleGeometry(0.45, d - 1.5, 4, 8), m); row.rotation.x = Math.PI / 2; row.position.set(x - w / 2 + 1.2 + k * 2.2, 0.15, z); row.receiveShadow = true; village.add(row); } });
  const crops = []; seed = 21; const cropMat = std('crop', { color: '#4f9a35', roughness: 0.7 });
  for (let i = 0; i < 90; i++) { const fx = FIELDS[i % 3]; const m = shadowed(new THREE.Mesh(new THREE.SphereGeometry(0.55, 10, 8), cropMat)); m.scale.y = 1.3; m.position.set(fx[0] - fx[2] / 2 + 1.2 + Math.floor(rand() * (fx[2] / 2.2)) * 2.2, 0.75, fx[1] - fx[3] / 2 + 1 + rand() * (fx[3] - 2)); village.add(m); crops.push(m); }
  // channel, outlet arch and pool
  const stone = std('stone', { map: plaster, normalMap: plasterN, color: '#c9a77c', roughness: 0.9 });
  const chan = shadowed(new THREE.Mesh(new RoundedBoxGeometry(14, 0.9, 2.4, 3, 0.3), stone)); chan.position.set(-4.5, 0.2, -1.2); village.add(chan);
  const chanW = new THREE.Mesh(new THREE.BoxGeometry(13.4, 0.2, 1.4), waterMat); chanW.position.set(-4.5, 0.55, -1.2); village.add(chanW);
  const arch = shadowed(new THREE.Mesh(new THREE.TorusGeometry(1.5, 0.5, 12, 24, Math.PI), stone)); arch.position.set(2.4, 0.4, -1.2); arch.rotation.y = Math.PI / 2; village.add(arch);
  const pool = shadowed(new THREE.Mesh(new RoundedBoxGeometry(12.5, 1.1, 8.5, 3, 0.4), stone)); pool.position.set(-17, 0.05, -6); village.add(pool);
  const poolW = new THREE.Mesh(new THREE.BoxGeometry(11.2, 0.2, 7.2), waterMat); poolW.position.set(-17, 0.5, -6); village.add(poolW);
  // villagers (rounded)
  function person(robe, wrap, skin = '#a8714c') { const g = new THREE.Group(); const robeM = std('r' + robe, { color: robe, roughness: 0.85 });
    const b = shadowed(new THREE.Mesh(new THREE.CapsuleGeometry(0.62, 1.7, 6, 16), robeM)); b.position.y = 1.5; b.scale.set(1, 1, 0.85); g.add(b);
    const skirt = shadowed(new THREE.Mesh(new THREE.CylinderGeometry(0.66, 0.92, 1.3, 20), robeM)); skirt.position.y = 0.65; g.add(skirt);
    const hd = shadowed(new THREE.Mesh(new THREE.SphereGeometry(0.47, 24, 16), std('sk' + skin, { color: skin, roughness: 0.6 }))); hd.position.y = 3.05; g.add(hd);
    const wr = shadowed(new THREE.Mesh(new THREE.SphereGeometry(0.53, 24, 12, 0, Math.PI * 2, 0, Math.PI * 0.55), std('w' + wrap, { color: wrap, roughness: 0.9 }))); wr.position.y = 3.1; g.add(wr);
    for (const sx of [-1, 1]) { const a = shadowed(new THREE.Mesh(new THREE.CapsuleGeometry(0.17, 1.1, 4, 10), robeM)); a.position.set(sx * 0.72, 1.85, 0.25); a.rotation.x = -0.7; g.add(a); }
    scene.add(g); return g; }
  const p1 = person('#3c6aa6', '#f1ede4'), p2 = person('#a8463c', '#e7d6ae', '#8c5a3c'), digger = person('#7d6c52', '#efe8d6');
  const jug = shadowed(new THREE.Mesh(new THREE.LatheGeometry([[0, 0], [0.32, 0.05], [0.42, 0.35], [0.3, 0.75], [0.14, 0.85], [0.16, 1.0]].map(([x, y]) => new THREE.Vector2(x, y)), 20), std('jug', { color: '#b8643a', roughness: 0.6 }))); jug.position.set(0.1, 1.3, 0.85); p1.add(jug);

  // ---------- state per film time
  const FILM = window.FILM; const B = {}; FILM.beats.forEach(b => B[b.s] = b);
  const at = (name, k = 0) => B[name].start + B[name].dur * k;
  function state(t) {
    const present = t < at('mother_well') || t >= at('aerial');
    const wellK = present ? 1 : ease(seg(t, at('mother_well', 0.05), at('mother_well', 0.75)));
    let tunK = present ? 1 : 0.985 * ease(seg(t, at('tunnel_dig', 0.05), at('tunnel_dig', 0.95)));
    if (!present && t >= at('breakthrough', 0.25)) tunK = 1;
    const shaftK = SHAFTS.map((x, i) => present || t >= at('shafts', 1) ? 1 : ease(seg(t, at('shafts', 0.06 + i * 0.12), at('shafts', 0.18 + i * 0.12))));
    const flowK = present ? 1 : ease(seg(t, at('breakthrough', 0.3), at('underground', 0.95)));
    const villageWater = present ? 1 : ease(seg(t, at('outlet', 0.1), at('outlet', 0.85)));
    const greenK = present ? 1 : ease(seg(t, at('green', 0.05), at('green', 0.9)));
    return { present, wellK, tunK, shaftK, flowK, villageWater, greenK };
  }
  function apply(st, t, cut) {
    if (cut) buildFace(st);
    // water in the tunnel (flows from the well toward the village)
    const A = [WELL_X, tunnelY(WELL_X) - TR + 0.5], Bp = [XL, tunnelY(XL) - TR + 0.5];
    placeSeg(tunWater, A[0], A[1], Bp[0], Bp[1], st.flowK);
    wellWater.visible = st.wellK >= 1; wellWater.position.set(WELL_X, (-2.2 + gw(WELL_X)) / 2, -1.3); wellWater.scale.y = gw(WELL_X) + 2.2;
    waterN.offset.set(-t * 0.25, t * 0.05);
    foam.forEach((f, i) => { const u = (i / foam.length + t * 0.22) % 1; f.visible = cut && st.flowK > 0.05 && u < st.flowK; const x = lerp(WELL_X, XL, u); f.position.set(x, tunnelY(x) - TR + 0.95 + Math.sin(i * 5 + t * 6) * 0.08, -0.4 - (i % 3) * 0.6); });
    mounds.forEach((m, i) => { const k = i < SHAFTS.length ? st.shaftK[i] : st.wellK; m.visible = k > 0.15; m.scale.setScalar(clamp(k * 1.4, 0.01, 1)); });
    chanW.visible = st.villageWater > 0.02; chanW.scale.x = Math.max(0.01, st.villageWater); chanW.position.x = 2.2 - 6.7 * st.villageWater;
    poolW.visible = st.villageWater > 0.4; poolW.position.y = lerp(-0.4, 0.5, seg(st.villageWater, 0.4, 1));
    const fc = new THREE.Color('#b98d5a').lerp(new THREE.Color('#8a7a45'), st.greenK); fieldMats.forEach(m => m.color.copy(fc));
    crops.forEach((c, i) => { const k = clamp(st.greenK * 1.4 - (i % 10) * 0.04); c.visible = k > 0.01; c.scale.set(Math.max(0.01, k), Math.max(0.01, k) * 1.3, Math.max(0.01, k)); });
  }

  // ---------- shots
  function shot(from, to, lf, lt, k) { cam.position.copy(from).lerp(to, ease(k)); cam.lookAt(lf.clone().lerp(lt, ease(k))); }
  function orbit(cx, cy, cz, rr, hgt, a0, a1, k, ly = 0) { const a = lerp(a0, a1, k); cam.position.set(cx + Math.cos(a) * rr, cy + hgt, cz + Math.sin(a) * rr); cam.lookAt(cx, cy + ly, cz); }
  const S = {
    village_dry: p => orbit(-24, 0, 0, 58, 38, 1.05, 1.45, p, 2),
    village_water: p => shot(v3(-7, 4.2, 9), v3(-10, 3.6, 6.5), v3(-14, 1.6, -4), v3(-16, 1.4, -5), p),
    pan_mountains: p => shot(v3(-24, 7, 10), v3(-24, 12, 14), v3(8, 4, -2), v3(130, 34, -10), p),
    mother_well: p => shot(v3(103, 12, 44), v3(102, 12, 36), v3(100, 8, 0), v3(100, 9, 0), p),
    tunnel_dig: p => { const x = lerp(10, 92, ease(seg(p, 0.05, 0.95))); cam.position.set(x - 4, 9, 34); cam.lookAt(x + 3, 0.5, 0); },
    shafts: p => shot(v3(24, 18, 80), v3(76, 26, 86), v3(28, 4, 0), v3(72, 10, 0), p),
    shafts_use: p => shot(v3(56, 17, 26), v3(54, 18, 22), v3(50, 9, 0), v3(50, 10, 0), p),
    slope: p => shot(v3(50, 14, 112), v3(50, 14, 104), v3(52, 6, 0), v3(52, 6, 0), p),
    slope_bad: p => shot(v3(50, 10, 92), v3(50, 10, 90), v3(50, 6, 0), v3(50, 6, 0), p),
    breakthrough: p => shot(v3(94, 5, 22), v3(95, 4, 18), v3(98, 0.5, 0), v3(98, 0.5, 0), p),
    underground: p => { const x = lerp(88, 14, ease(p)); cam.position.set(x + 3, 6, 26); cam.lookAt(x - 4, -1, 0); },
    outlet: p => shot(v3(12, 7, 14), v3(6, 6, 12), v3(-1, 0.6, -1.2), v3(-12, 0.6, -5), p),
    green: p => orbit(-28, 0, 0, 50, 30, 0.5, 0.9, p, 2),
    aerial: p => shot(v3(-40, 55, 58), v3(-30, 75, 68), v3(20, 0, 0), v3(60, 0, 0), p),
    aerial_far: p => shot(v3(-80, 105, 88), v3(-100, 145, 118), v3(40, 0, 0), v3(60, 10, 0), p),
    final: p => orbit(20, 0, 0, 150, 90, 1.4, 1.75, p, 0),
    endcard: p => orbit(20, 0, 0, 160, 100, 1.75, 1.85, p, 0),
  };
  const CUT = new Set(['mother_well', 'tunnel_dig', 'shafts', 'shafts_use', 'slope', 'slope_bad', 'breakthrough', 'underground']);

  function caption(b, t) {
    if (!b.t) return;
    const a0 = b.start + 0.15, len = Math.max(0.4, b.dur - 0.15 - 0.3);
    const words = b.t.split(' '), tot = b.t.length; let acc = 0, cur = -1, ws = 0;
    words.forEach((w, k) => { const s = a0 + acc / tot * len; acc += w.length + 1; if (t >= s) { cur = k; ws = s; } });
    if (cur < 0) return; const w = words[cur];
    const pop = 1 + 0.18 * (1 - clamp((t - ws) / 0.12));
    g2.save(); g2.translate(W / 2, H * 0.47); g2.scale(pop, pop); let fs = 104; g2.font = `900 ${fs}px DejaVu Sans`; while (g2.measureText(w).width > 940) { fs -= 6; g2.font = `900 ${fs}px DejaVu Sans`; }
    g2.textAlign = 'center'; g2.textBaseline = 'middle'; g2.lineJoin = 'round'; g2.shadowColor = 'rgba(0,0,0,0.35)'; g2.shadowBlur = 18; g2.lineWidth = fs / 4; g2.strokeStyle = '#000'; g2.strokeText(w, 0, 0); g2.shadowBlur = 0; g2.fillStyle = '#fff'; g2.fillText(w, 0, 0); g2.restore();
  }
  function render(t) {
    const i = Math.max(0, FILM.beats.findIndex(b => t < b.start + b.dur)); const b = FILM.beats[i] || FILM.beats[FILM.beats.length - 1];
    const p = clamp((t - b.start) / b.dur);
    const cut = CUT.has(b.s); frontHalf.visible = !cut; face.visible = cut;
    const st = state(t); apply(st, t, cut);
    // slope helpers
    arrow.visible = b.s === 'slope'; if (arrow.visible) { const k = ease(seg(p, 0.1, 0.5)), len = 80 * k, x0 = 92, y0 = tunnelY(92) + 5, ang = Math.atan2(tunnelY(12) - tunnelY(92), 12 - 92); arrow.position.set(x0, y0, 1.5); arrow.rotation.z = ang; arrow.getObjectByName('shaft').scale.y = Math.max(0.01, len); arrow.getObjectByName('head').position.x = len + 1.6; }
    const sb = b.s === 'slope_bad'; steepG.visible = sb && p < 0.5; flatG.visible = sb && p >= 0.5; streaks.forEach(s => s.visible = false);
    if (sb) { const [ax, ay, bx, by] = p < 0.5 ? [20, 0.5, 80, 14] : [20, 4, 80, 4]; const g = p < 0.5 ? steepG : flatG; g.position.set(ax, ay, 1.5); g.rotation.z = Math.atan2(by - ay, bx - ax); g.scale.set(1, Math.hypot(bx - ax, by - ay), 1);
      if (p < 0.5) streaks.forEach((s, j) => { const u = (j / streaks.length + t * 1.4) % 1; s.visible = true; s.position.set(lerp(bx, ax, u), lerp(by, ay, u) + Math.sin(j * 3 + t * 25) * 0.4, 1.5 + Math.cos(j) * 0.5); s.rotation.z = Math.atan2(by - ay, bx - ax) + Math.PI / 2; }); }
    // digging props
    windlass.visible = digger.visible = false; p1.position.set(-12.6, 0, -2.4); p1.rotation.y = -0.7; p2.position.set(-20, 0, 1.4); p2.rotation.y = 2.4;
    if (b.s === 'mother_well' || b.s === 'shafts_use') { const x = b.s === 'mother_well' ? WELL_X : 50; windlass.visible = digger.visible = true; windlass.position.set(x, top(x) + 0.6, -1.6); digger.position.set(x + 3.8, top(x) + 0.4, -3); digger.rotation.y = -1.1;
      const depth = b.s === 'mother_well' ? (top(x) + 2) * st.wellK : top(x) - tunnelY(x); const u = Math.sin(t * 1.6) * 0.5 + 0.5; const by = lerp(-depth + 1.2, 2.4, u); bucket.position.set(0, by, 0); rope.position.set(0, (by + 3.4) / 2, 0); rope.scale.y = Math.max(0.05, 3.4 - by); bar.rotation.x = t * 3; }
    (S[b.s] || S.final)(p);
    r.render(scene, cam);
    g2.setTransform(1, 0, 0, 1, 0, 0); g2.clearRect(0, 0, W, H);
    caption(b, t);
    if (b.s === 'endcard') { const k = ease(seg(p, 0, 0.3)); g2.save(); g2.globalAlpha = k; g2.textAlign = 'center'; g2.lineJoin = 'round'; g2.font = '900 150px DejaVu Sans'; g2.lineWidth = 30; g2.strokeStyle = '#000'; g2.strokeText('QANAT', W / 2, H * 0.42); g2.fillStyle = '#fff'; g2.fillText('QANAT', W / 2, H * 0.42); g2.font = '800 52px DejaVu Sans'; g2.lineWidth = 12; g2.strokeText('ancient Persian engineering', W / 2, H * 0.42 + 100); g2.fillStyle = '#ffd23c'; g2.fillText('ancient Persian engineering', W / 2, H * 0.42 + 100); g2.restore(); }
    const prev = FILM.beats[i - 1]; if (prev && t - b.start < 0.08) { g2.fillStyle = `rgba(255,255,255,${0.3 * (1 - (t - b.start) / 0.08)})`; g2.fillRect(0, 0, W, H); }
    if (t < 0.25) { g2.fillStyle = `rgba(0,0,0,${1 - t / 0.25})`; g2.fillRect(0, 0, W, H); }
  }
  return { render };
}
window.QanatFilm = { create };
