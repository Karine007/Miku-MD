// "The Yakhchal" — original 3D explainer (vertical 1080x1920) in a natural, rounded 3D look:
// how a desert "ice pit" made and stored ice: shaded pools freeze on winter nights, ice goes into a deep pit
// under a thick-walled stepped dome; hot air escapes at the top. Physical sky with day / night / dawn lighting,
// PBR textures, soft shadows and a cutaway of the dome. render(t) is a pure function of time;
// beat timing (window.FILM) comes from src/make_voice.py.
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
const gauss = (x, z, cx, cz, a, r) => a * Math.exp(-((x - cx) ** 2 + (z - cz) ** 2) / (r * r));
function h(x, z) {
  let y = 0.5 * Math.sin(x * 0.07 + z * 0.05) * Math.cos(z * 0.06 - x * 0.03) + 0.2 * Math.sin(x * 0.23 + z * 0.19);
  const d2 = x * x + z * z; y *= clamp((Math.sqrt(d2) - 40) / 30);                    // flat around the yakhchal
  y += gauss(x, z, 230, -200, 70, 70) + gauss(x, z, 120, -260, 55, 60) + gauss(x, z, 300, -60, 80, 80) + gauss(x, z, -60, -300, 50, 70);
  return y;
}
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
  const scene = new THREE.Scene(); const cam = new THREE.PerspectiveCamera(48, W / H, 0.3, 5000);
  const g2 = canvas2d.getContext('2d');
  // physical sky (sun position changes for night / dawn) + day environment light
  const sky = new Sky(); sky.scale.setScalar(4000); const su = sky.material.uniforms; scene.add(sky);
  const sunDirOf = (elev, az) => new THREE.Vector3().setFromSphericalCoords(1, THREE.MathUtils.degToRad(90 - elev), THREE.MathUtils.degToRad(az));
  { const pm = new THREE.PMREMGenerator(r); const es = new THREE.Scene(); const s2 = new Sky(); s2.scale.setScalar(1000); s2.material.uniforms.sunPosition.value.copy(sunDirOf(40, 140)); s2.material.uniforms.turbidity.value = 6; s2.material.uniforms.rayleigh.value = 1.2; es.add(s2); scene.environment = pm.fromScene(es).texture; }
  scene.fog = new THREE.FogExp2('#d8dde2', 0.0026);
  const sun = new THREE.DirectionalLight('#fff1d8', 5.5); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); Object.assign(sun.shadow.camera, { left: -90, right: 90, top: 90, bottom: -90, near: 20, far: 700 }); sun.shadow.bias = -0.0006; sun.shadow.normalBias = 0.6; scene.add(sun, sun.target);
  const hemi = new THREE.HemisphereLight('#cfe6ff', '#b58a5a', 0.9); scene.add(hemi);
  const lamp = new THREE.PointLight('#ffd7a0', 0, 60, 1.6); scene.add(lamp);
  const stars = (() => { const g = new THREE.BufferGeometry(), p = []; seed = 5; for (let i = 0; i < 900; i++) { const th = rand() * Math.PI * 2, ph = rand() * 1.3; p.push(Math.cos(th) * Math.sin(ph) * 1800, Math.cos(ph) * 1800, Math.sin(th) * Math.sin(ph) * 1800); } g.setAttribute('position', new THREE.Float32BufferAttribute(p, 3)); const m = new THREE.Points(g, new THREE.PointsMaterial({ color: '#ffffff', size: 2.2, sizeAttenuation: false, fog: false, transparent: true })); scene.add(m); return m; })();
  function setLight(mode, k = 1) {
    const L = { day: { el: 40, az: 140, tur: 6, ray: 1.2, sun: 5.5, sunC: '#fff1d8', hemi: 0.9, exp: 0.55, env: 1, fog: '#d8dde2', star: 0 },
      hot: { el: 62, az: 150, tur: 10, ray: 0.8, sun: 6.5, sunC: '#ffe8c0', hemi: 1.0, exp: 0.62, env: 1, fog: '#e8dcc8', star: 0 },
      night: { el: -10, az: 140, tur: 2, ray: 0.4, sun: 1.3, sunC: '#7f9fff', hemi: 0.35, exp: 0.42, env: 0.08, fog: '#0d1422', star: 1 },
      dawn: { el: 7, az: 100, tur: 8, ray: 2.5, sun: 3.2, sunC: '#ffc98e', hemi: 0.55, exp: 0.6, env: 0.6, fog: '#e6c6a6', star: 0 } }[mode];
    su.turbidity.value = L.tur; su.rayleigh.value = L.ray; su.mieCoefficient.value = 0.004; su.mieDirectionalG.value = 0.85; su.sunPosition.value.copy(sunDirOf(L.el, L.az));
    const d = mode === 'night' ? sunDirOf(55, 210) : sunDirOf(Math.max(L.el, 8), L.az); sun.position.copy(d).multiplyScalar(260); sun.target.position.set(0, 0, -10); sun.intensity = L.sun; sun.color.set(L.sunC);
    hemi.intensity = L.hemi; hemi.color.set(mode === 'night' ? '#4a6aa8' : '#cfe6ff'); r.toneMappingExposure = L.exp; scene.environmentIntensity = L.env; scene.fog.color.set(L.fog); stars.material.opacity = L.star; stars.visible = L.star > 0;
  }

  // ---------- textures + materials
  const sandMap = canvasTex(512, 512, (d, w, hh) => { for (let y = 0; y < hh; y++) for (let x = 0; x < w; x++) { const v = fbm(x / 22, y / 22), g = n2(x * 1.7, y * 1.7), i = (y * w + x) * 4; d[i] = 215 + v * 30 - g * 18; d[i + 1] = 182 + v * 26 - g * 16; d[i + 2] = 132 + v * 20 - g * 14; d[i + 3] = 255; } }, 34);
  const sandNorm = normalTex(512, 512, (x, y) => Math.sin((x + fbm(x / 40, y / 40) * 60) / 7) * 0.5 + n2(x * 1.3, y * 1.3) * 0.6, 1.6, 34);
  const plaster = canvasTex(256, 256, (d, w, hh) => { for (let y = 0; y < hh; y++) for (let x = 0; x < w; x++) { const v = fbm(x / 10, y / 10), i = (y * w + x) * 4; d[i] = 222 + v * 22; d[i + 1] = 196 + v * 20; d[i + 2] = 154 + v * 18; d[i + 3] = 255; } }, 1);
  const plasterN = normalTex(256, 256, (x, y) => fbm(x / 6, y / 6) * 1.5, 2, 1);
  const bark = canvasTex(64, 256, (d, w, hh) => { for (let y = 0; y < hh; y++) for (let x = 0; x < w; x++) { const ring = (y % 18) < 4 ? -30 : 0, v = n1(x / 3, y / 3) * 20, i = (y * w + x) * 4; d[i] = 120 + ring + v; d[i + 1] = 92 + ring + v; d[i + 2] = 62 + ring + v; d[i + 3] = 255; } }, 1); bark.repeat.set(1, 4);
  const waterN = normalTex(256, 256, (x, y) => Math.sin(x / 9 + n1(x / 30, y / 30) * 6) * 0.5 + Math.sin(y / 7 + n2(x / 25, y / 25) * 5) * 0.5, 2.5, 6);
  const woodT = canvasTex(128, 128, (d, w, hh) => { for (let y = 0; y < hh; y++) for (let x = 0; x < w; x++) { const v = Math.sin(y / 3 + n1(x / 9, y / 2) * 4) * 18, i = (y * w + x) * 4; d[i] = 128 + v; d[i + 1] = 90 + v * 0.8; d[i + 2] = 58 + v * 0.6; d[i + 3] = 255; } }, 1);
  const brick = canvasTex(512, 512, (d, w, hh) => { for (let y = 0; y < hh; y++) for (let x = 0; x < w; x++) { const row = Math.floor(y / 32), off = row % 2 ? 32 : 0, mortar = (y % 32) < 3 || ((x + off) % 64) < 3; const v = fbm(x / 12, y / 12), i = (y * w + x) * 4; const c = mortar ? [196, 170, 132] : [205 - row % 3 * 6, 160 - row % 3 * 4, 112]; d[i] = c[0] * (0.88 + v * 0.22); d[i + 1] = c[1] * (0.88 + v * 0.22); d[i + 2] = c[2] * (0.88 + v * 0.22); d[i + 3] = 255; } }, 1);
  const brickN = normalTex(512, 512, (x, y) => (((y % 32) < 3 || ((x + (Math.floor(y / 32) % 2 ? 32 : 0)) % 64) < 3) ? -1 : 0) + fbm(x / 8, y / 8) * 0.6, 2.2, 1);
  const soilT = canvasTex(512, 512, (d, w, hh) => { for (let y = 0; y < hh; y++) for (let x = 0; x < w; x++) { const v = fbm(x / 30, y / 30), i = (y * w + x) * 4, k = 0.9 + v * 0.18; const c = y < 60 ? [214, 180, 128] : y < 220 ? [182, 136, 92] : [140, 106, 84]; d[i] = c[0] * k; d[i + 1] = c[1] * k; d[i + 2] = c[2] * k; d[i + 3] = 255; } }, 1);
  const M = {}; const std = (key, o) => M[key] ??= new THREE.MeshStandardMaterial(o);
  const plasterMat = std('plaster', { map: plaster, normalMap: plasterN, roughness: 0.92 });
  const plasterMat2 = std('plaster2', { map: plaster, normalMap: plasterN, roughness: 0.92, color: '#f3dcc0' });
  const woodMat = std('wood', { map: woodT, roughness: 0.8 });
  const domeMat = new THREE.MeshStandardMaterial({ map: brick, normalMap: brickN, roughness: 0.93, color: '#f0d2ae' }); brick.repeat.set(10, 5); brickN.repeat.set(10, 5);
  const domeInMat = new THREE.MeshStandardMaterial({ map: brick, normalMap: brickN, roughness: 0.95, color: '#b49274', side: THREE.BackSide });
  const cutMat = new THREE.MeshStandardMaterial({ map: plaster, normalMap: plasterN, roughness: 0.95, color: '#c99a6c', side: THREE.DoubleSide });
  const waterMat = new THREE.MeshStandardMaterial({ color: '#2f86a6', roughness: 0.06, metalness: 0.05, normalMap: waterN, normalScale: new THREE.Vector2(0.5, 0.5), transparent: true, opacity: 0.92 });
  const iceMat = std('ice', { color: '#e3f4ff', roughness: 0.22, metalness: 0, transparent: true, opacity: 0.92, emissive: '#6aa8d8', emissiveIntensity: 0.15 });
  const strawMat = std('straw', { color: '#d9b45a', roughness: 0.95 });
  const shadowed = m => { m.castShadow = true; m.receiveShadow = true; return m; };

  // ---------- terrain (two halves so the near half can be hidden for cutaway shots)
  const SAND = new THREE.Color('#f0d7a6'), ROCK = new THREE.Color('#a17a5a'), SNOW = new THREE.Color('#f6f6f4');
  function terrain(z0, z1) {
    const g = new THREE.PlaneGeometry(700, z1 - z0, 260, Math.round((z1 - z0) * 0.5)); g.rotateX(-Math.PI / 2);
    const pos = g.attributes.position, col = []; const c = new THREE.Color();
    for (let i = 0; i < pos.count; i++) { const x = pos.getX(i), z = pos.getZ(i) + (z0 + z1) / 2, y = h(x, z); pos.setXYZ(i, x, y, z); c.copy(SAND).lerp(ROCK, clamp((y - 3) / 30)); if (y > 60) c.lerp(SNOW, clamp((y - 60) / 8)); col.push(c.r, c.g, c.b); }
    g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3)); g.computeVertexNormals();
    const uv = g.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setXY(i, pos.getX(i) / 300, pos.getZ(i) / 300);
    const m = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ vertexColors: true, map: sandMap, normalMap: sandNorm, normalScale: new THREE.Vector2(0.7, 0.7), roughness: 0.96 })); m.receiveShadow = true; scene.add(m); return m;
  }
  const backHalf = terrain(-350, 0), frontHalf = terrain(0, 350);

  // ---------- the yakhchal: stepped cone dome (full + cut-away half), ice pit below
  const DOME_R = 13, DOME_H = 19, PIT_R = 9, PIT_D = 9;
  const ro = y => Math.max(1.2, DOME_R * Math.pow(1 - y / DOME_H, 0.8)) - (Math.floor(y / 2.4) % 2) * 0.0;
  const th = y => lerp(2.0, 0.55, y / DOME_H);
  const outerPts = [], innerPts = [];
  for (let i = 0; i <= 8; i++) { const y0 = i * DOME_H / 8.6, y1 = Math.min(DOME_H, y0 + DOME_H / 8.6); outerPts.push(new THREE.Vector2(ro(y0), y0), new THREE.Vector2(ro(y0) - 0.3, y0 + 0.25)); }
  outerPts.push(new THREE.Vector2(1.2, DOME_H)); outerPts.push(new THREE.Vector2(0.9, DOME_H));
  for (let y = 0; y <= DOME_H; y += DOME_H / 24) innerPts.push(new THREE.Vector2(Math.max(0.9, ro(y) - th(y)), y)); innerPts.push(new THREE.Vector2(0.9, DOME_H));
  const domeFull = new THREE.Group(); scene.add(domeFull);
  domeFull.add(shadowed(new THREE.Mesh(new THREE.LatheGeometry(outerPts, 72), domeMat)));
  const door = shadowed(new THREE.Mesh(new THREE.TorusGeometry(1.6, 0.35, 10, 24, Math.PI), cutMat)); door.position.set(0, 2.2, -DOME_R + 0.6); domeFull.add(door);
  const doorHole = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 3.8), std('doorhole', { color: '#1d140e', roughness: 1 })); doorHole.position.set(0, 1.9, -DOME_R + 0.55); doorHole.rotation.y = Math.PI; domeFull.add(doorHole);
  const domeHalf = new THREE.Group(); scene.add(domeHalf);
  domeHalf.add(shadowed(new THREE.Mesh(new THREE.LatheGeometry(outerPts, 40, Math.PI / 2, Math.PI), domeMat)));
  domeHalf.add(new THREE.Mesh(new THREE.LatheGeometry(innerPts, 40, Math.PI / 2, Math.PI), domeInMat));
  for (const sx of [1, -1]) { const s = new THREE.Shape(); s.moveTo(sx * ro(0), 0); for (let y = 0; y <= DOME_H; y += DOME_H / 24) s.lineTo(sx * ro(y), y); for (let y = DOME_H; y >= 0; y -= DOME_H / 24) s.lineTo(sx * Math.max(0.9, ro(y) - th(y)), y); const m = new THREE.Mesh(new THREE.ShapeGeometry(s), cutMat); m.position.z = 0.01; domeHalf.add(m); }
  // ground cut face (U-shaped, open over the pit) + pit interior + trench
  const soilFace = (() => { const s = new THREE.Shape(); s.moveTo(-120, -22); s.lineTo(-120, 0); s.lineTo(-PIT_R, 0); s.lineTo(-PIT_R, -PIT_D); s.lineTo(-1, -PIT_D); s.lineTo(-1, -PIT_D - 1.4); s.lineTo(1, -PIT_D - 1.4); s.lineTo(1, -PIT_D); s.lineTo(PIT_R, -PIT_D); s.lineTo(PIT_R, 0); s.lineTo(120, 0); s.lineTo(120, -22); s.lineTo(-120, -22);
    const g = new THREE.ShapeGeometry(s); const uv = g.attributes.uv, p = g.attributes.position; for (let i = 0; i < uv.count; i++) uv.setXY(i, p.getX(i) / 40, (p.getY(i) + 22) / 22);
    const m = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ map: soilT, roughness: 0.96, normalMap: sandNorm })); m.position.z = 0.02; scene.add(m); return m; })();
  const pitIn = (() => { const g = new THREE.Group(); const wall = new THREE.Mesh(new THREE.CylinderGeometry(PIT_R, PIT_R, PIT_D, 40, 1, true, Math.PI / 2, Math.PI), new THREE.MeshStandardMaterial({ map: soilT, roughness: 1, side: THREE.BackSide, color: '#9c826a' })); wall.position.y = -PIT_D / 2; g.add(wall);
    const floor = new THREE.Mesh(new THREE.CircleGeometry(PIT_R, 40, 0, Math.PI), std('pitfloor', { color: '#7a6250', roughness: 1 })); floor.rotation.x = -Math.PI / 2; floor.position.y = -PIT_D + 0.01; g.add(floor);
    const tr = new THREE.Mesh(new THREE.BoxGeometry(2, 1.4, PIT_R), std('trench', { color: '#4a3a30', roughness: 1, side: THREE.BackSide })); tr.position.set(0, -PIT_D - 0.7, -PIT_R / 2); g.add(tr); scene.add(g); return g; })();
  const trenchWater = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.35, PIT_R), waterMat); trenchWater.position.set(0, -PIT_D - 1.2, -PIT_R / 2); scene.add(trenchWater);
  // ice stack in the pit (layers of blocks with straw between)
  const iceBlocks = []; { const geo = new RoundedBoxGeometry(1.7, 1.1, 1.7, 2, 0.12); for (let layer = 0; layer < 5; layer++) for (let ix = -3; ix <= 3; ix++) for (let iz = 0; iz < 4; iz++) { const x = ix * 1.9, z = -0.9 - iz * 1.9; if (x * x + z * z > (PIT_R - 1.2) ** 2) continue; const m = shadowed(new THREE.Mesh(geo, iceMat)); m.position.set(x + (layer % 2) * 0.3, -PIT_D + 0.55 + layer * 1.35, z); m.userData.layer = layer; scene.add(m); iceBlocks.push(m); }
    for (let layer = 0; layer < 5; layer++) { const s = new THREE.Mesh(new THREE.CylinderGeometry(PIT_R - 1, PIT_R - 1, 0.22, 40, 1, false, Math.PI / 2, Math.PI), strawMat); s.position.y = -PIT_D + 1.2 + layer * 1.35; s.userData.layer = layer; s.userData.straw = 1; scene.add(s); iceBlocks.push(s); } }
  // ---------- shade wall + shallow pools + feeding channel
  const wallG = new THREE.Group(); wallG.position.set(0, 0, -36); scene.add(wallG);
  const wall = shadowed(new THREE.Mesh(new RoundedBoxGeometry(76, 15, 2.6, 3, 0.4), new THREE.MeshStandardMaterial({ map: brick.clone(), normalMap: brickN.clone(), roughness: 0.93, color: '#ecc9a2' }))); wall.material.map.repeat.set(16, 3); wall.material.normalMap.repeat.set(16, 3); wall.geometry.translate(0, 7.5, 0); wallG.add(wall);
  const poolZ = [-31.5, -27, -22.5], pools = poolZ.map(z => { const rim = shadowed(new THREE.Mesh(new RoundedBoxGeometry(64, 0.7, 3.8, 2, 0.25), std('rim', { map: plaster, normalMap: plasterN, color: '#c9a77c', roughness: 0.9 }))); rim.position.set(0, 0.1, z); scene.add(rim);
    const w = new THREE.Mesh(new THREE.BoxGeometry(62.6, 0.2, 2.8), new THREE.MeshStandardMaterial({ color: '#2f86a6', roughness: 0.06, metalness: 0.05, normalMap: waterN, normalScale: new THREE.Vector2(0.5, 0.5), transparent: true, opacity: 0.92 })); w.position.set(0, 0.42, z); w.receiveShadow = true; scene.add(w); return w; });
  const chan = shadowed(new THREE.Mesh(new RoundedBoxGeometry(60, 0.8, 2.4, 2, 0.25), std('rim', {}))); chan.position.set(62, 0.1, -27); scene.add(chan);
  const chanW = new THREE.Mesh(new THREE.BoxGeometry(59, 0.2, 1.5), waterMat); chanW.position.set(62, 0.45, -27); scene.add(chanW);
  // ---------- town, palms, people
  const village = new THREE.Group(); scene.add(village);
  seed = 11;
  for (let i = 0; i < 28; i++) { const x = -102 + rand() * 50, z = -12 + rand() * 64; const w = 5 + rand() * 4, d = 5 + rand() * 4, hh = 3.4 + rand() * 2.6, mat = i % 2 ? plasterMat : plasterMat2;
    const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = (rand() - 0.5) * 0.3; village.add(g);
    const b = shadowed(new THREE.Mesh(new RoundedBoxGeometry(w, hh, d, 4, 0.45), mat)); b.position.y = hh / 2; g.add(b);
    const roof = shadowed(new THREE.Mesh(new RoundedBoxGeometry(w + 0.4, 0.55, d + 0.4, 3, 0.22), mat)); roof.position.y = hh + 0.1; g.add(roof);
    const door = shadowed(new THREE.Mesh(new RoundedBoxGeometry(1.2, 2.1, 0.3, 2, 0.1), woodMat)); door.position.set(-w * 0.15, 1.05, d / 2); g.add(door);
    for (const sx of [0.22, -0.4]) { const win = new THREE.Mesh(new RoundedBoxGeometry(0.85, 0.85, 0.25, 2, 0.12), std('win', { color: '#2b1e16', roughness: 0.7 })); win.position.set(w * sx + (sx < 0 ? -0.2 : 0), hh * 0.62, d / 2); g.add(win); }
    for (let k = 0; k < 2; k++) { const beam = shadowed(new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.9, 6), woodMat)); beam.rotation.x = Math.PI / 2; beam.position.set(-w / 2 + 1 + k * 1.4, hh - 0.25, d / 2 + 0.35); g.add(beam); }
    if (i % 4 === 0) { const dome = shadowed(new THREE.Mesh(new THREE.SphereGeometry(Math.min(w, d) * 0.36, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), mat)); dome.position.y = hh + 0.35; g.add(dome); }
  }

  // palms: curved segmented trunk + drooping fronds
  const frondGeo = (() => { const g = new THREE.PlaneGeometry(1.3, 5.2, 1, 12); g.translate(0, 2.6, 0); const p = g.attributes.position; for (let i = 0; i < p.count; i++) { const y = p.getY(i), t = y / 5.2; p.setX(i, p.getX(i) * (1 - t * 0.85) * (0.6 + Math.sin(t * Math.PI) * 0.6)); p.setZ(i, -t * t * 2.6 + Math.abs(p.getX(i)) * 0.35); } g.computeVertexNormals(); return g; })();
  const frondMat = new THREE.MeshStandardMaterial({ color: '#4f8a34', roughness: 0.7, side: THREE.DoubleSide });
  function palm(x, z, s = 1, lean = 0.1) { const g = new THREE.Group(); g.position.set(x, 0, z); g.scale.setScalar(s); g.rotation.y = rand() * 6; village.add(g); let px = 0, py = 0;
    for (let k = 0; k < 9; k++) { const a = lean * k / 9, m = shadowed(new THREE.Mesh(new THREE.CylinderGeometry(0.3 - k * 0.012, 0.36 - k * 0.012, 0.95, 12), new THREE.MeshStandardMaterial({ map: bark, roughness: 0.9 }))); m.position.set(px, py + 0.45, 0); m.rotation.z = -a; g.add(m); px += Math.sin(a) * 0.9; py += Math.cos(a) * 0.9; }
    for (let k = 0; k < 11; k++) { const f = shadowed(new THREE.Mesh(frondGeo, frondMat)); f.position.set(px, py, 0); f.rotation.set(0, k / 11 * Math.PI * 2, 0); f.rotateX(-1.0 - (k % 3) * 0.15); g.add(f); }
    const nuts = new THREE.Mesh(new THREE.SphereGeometry(0.35, 12, 8), std('nut', { color: '#6b4a24', roughness: 0.6 })); nuts.position.set(px, py - 0.3, 0); g.add(nuts); }
  seed = 31; [[-14, 8], [-24, -14], [-6, 12], [-31, 4], [-48, 2], [-2, -12], [-18, 16], [-36, -32], [-55, 22], [-10, -18], [-28, 24]].forEach(([x, z], i) => palm(x, z, 0.95 + (i % 3) * 0.15, 0.15 + (i % 4) * 0.08));

  seed = 31; [[-62, 20], [-74, -6], [-58, 44], [-90, 12], [-66, 4], [-82, 38], [-50, 28], [-96, -4], [22, 26], [30, 18], [-24, 22]].forEach(([x, z], i) => palm(x, z, 0.95 + (i % 3) * 0.15, 0.15 + (i % 4) * 0.08));
  // villagers (rounded)
  function person(robe, wrap, skin = '#a8714c') { const g = new THREE.Group(); const robeM = std('r' + robe, { color: robe, roughness: 0.85 });
    const b = shadowed(new THREE.Mesh(new THREE.CapsuleGeometry(0.62, 1.7, 6, 16), robeM)); b.position.y = 1.5; b.scale.set(1, 1, 0.85); g.add(b);
    const skirt = shadowed(new THREE.Mesh(new THREE.CylinderGeometry(0.66, 0.92, 1.3, 20), robeM)); skirt.position.y = 0.65; g.add(skirt);
    const hd = shadowed(new THREE.Mesh(new THREE.SphereGeometry(0.47, 24, 16), std('sk' + skin, { color: skin, roughness: 0.6 }))); hd.position.y = 3.05; g.add(hd);
    const wr = shadowed(new THREE.Mesh(new THREE.SphereGeometry(0.53, 24, 12, 0, Math.PI * 2, 0, Math.PI * 0.55), std('w' + wrap, { color: wrap, roughness: 0.9 }))); wr.position.y = 3.1; g.add(wr);
    for (const sx of [-1, 1]) { const a = shadowed(new THREE.Mesh(new THREE.CapsuleGeometry(0.17, 1.1, 4, 10), robeM)); a.position.set(sx * 0.72, 1.85, 0.25); a.rotation.x = -0.7; g.add(a); }
    scene.add(g); return g; }

  const eater = person('#3c6aa6', '#f1ede4'), w1 = person('#7d6c52', '#efe8d6'), w2 = person('#a8463c', '#e7d6ae', '#8c5a3c'), w3 = person('#5a7a4a', '#f1ede4');
  const bowl = shadowed(new THREE.Mesh(new THREE.LatheGeometry([[0, 0], [0.3, 0.02], [0.55, 0.25], [0.62, 0.42]].map(([x, y]) => new THREE.Vector2(x, y)), 24), std('bowl', { color: '#2f6fa8', roughness: 0.35 }))); bowl.position.set(0, 2.05, 0.95); eater.add(bowl);
  const shaved = shadowed(new THREE.Mesh(new THREE.SphereGeometry(0.55, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2), std('shaved', { color: '#f4fbff', roughness: 0.5, emissive: '#9ccbe8', emissiveIntensity: 0.15 }))); shaved.position.set(0, 2.4, 0.95); shaved.scale.y = 0.7; eater.add(shaved);
  const carried = [w1, w2, w3].map(p => { const b = shadowed(new THREE.Mesh(new RoundedBoxGeometry(1.4, 0.9, 1.1, 2, 0.1), iceMat)); b.position.set(0, 3.9, 0.1); p.add(b); return b; });
  // ---------- explainer helpers: arrows / streaks / ingredient piles / dimension bar
  const glowM = c => new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: 1.1, roughness: 0.4, transparent: true, opacity: 0.9 });
  const streak = (c) => { const m = new THREE.Mesh(new THREE.CapsuleGeometry(0.22, 1.8, 4, 8), glowM(c)); scene.add(m); return m; };
  const hotS = Array.from({ length: 18 }, () => streak('#ff6a2d')), coldS = Array.from({ length: 22 }, () => streak('#5ab8ff')), rays = Array.from({ length: 16 }, () => streak('#ffb23d')), drips = Array.from({ length: 16 }, () => { const m = new THREE.Mesh(new THREE.SphereGeometry(0.16, 10, 8), std('drip', { color: '#9fd8ff', roughness: 0.1, emissive: '#3a8ad0', emissiveIntensity: 0.6 })); scene.add(m); return m; });
  const dim = new THREE.Group(); { const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 2, 10), glowM('#ffffff')); bar.rotation.z = Math.PI / 2; dim.add(bar); for (const sx of [-1, 1]) { const c = new THREE.Mesh(new THREE.ConeGeometry(0.35, 0.7, 12), glowM('#ffffff')); c.rotation.z = -sx * Math.PI / 2; c.position.x = sx * 1.05; dim.add(c); } } scene.add(dim);
  const ING = [['sand', '#e2c287'], ['clay', '#a8603e'], ['lime', '#f4f2ec'], ['ash', '#8d8c88'], ['hair', '#3d3028'], ['egg', '#fbf6ea']];
  const piles = ING.map(([n, c], i) => { const g = new THREE.Group(); if (n === 'egg') { for (let k = 0; k < 3; k++) { const e = shadowed(new THREE.Mesh(new THREE.SphereGeometry(0.42, 20, 14), std('egg', { color: c, roughness: 0.45 }))); e.scale.y = 1.3; e.position.set((k - 1) * 0.75, 0.5, (k % 2) * 0.3); g.add(e); } }
    else if (n === 'hair') { for (let k = 0; k < 40; k++) { const f = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.4, 4), std('hair', { color: c, roughness: 0.9 })); f.position.set((rand() - 0.5) * 0.9, 0.45 + rand() * 0.3, (rand() - 0.5) * 0.9); f.rotation.set(rand() * 3, rand() * 3, rand() * 3); g.add(f); } }
    else { const p = shadowed(new THREE.Mesh(new THREE.ConeGeometry(1.1, 1.2, 24), std('pile' + n, { color: c, roughness: 0.95, map: sandMap }))); p.position.y = 0.6; g.add(p); }
    g.position.set(-5 + i * 2.3, 0.2, 6); scene.add(g); return g; });
  const board = shadowed(new THREE.Mesh(new RoundedBoxGeometry(16, 0.4, 4.4, 2, 0.12), woodMat)); board.position.set(0.75, 0, 6); scene.add(board);

  // ---------- time-based state
  const FILM = window.FILM; const B = {}; FILM.beats.forEach(b => B[b.s] = b);
  const at = (name, k = 0) => B[name].start + B[name].dur * k;
  const wordT = (name, word) => { const b = B[name], a0 = b.start + 0.15, len = b.dur - 0.45, i = b.t.toLowerCase().indexOf(word); return a0 + Math.max(0, i) / b.t.length * len; };
  function apply(t, b, p) {
    const building = t >= at('pools') && t < at('night');
    const wallK = t < at('wall') ? (t < at('pools') ? 1 : 0) : (t < at('night') ? ease(seg(t, at('wall', 0.05), at('wall', 0.7))) : 1);
    wallG.scale.y = Math.max(0.001, wallK); wallG.visible = wallK > 0.002;
    const poolFill = t < at('pools') ? 1 : ease(seg(t, at('pools', 0.35), at('pools', 0.9)));
    const freeze = t < at('night') ? 0 : t < at('harvest') ? ease(seg(t, at('night', 0.2), at('night', 0.95))) : (t < at('walls_thick') ? 1 : 0);
    const broken = b.s === 'harvest' ? ease(seg(p, 0.1, 0.9)) : 0;
    pools.forEach((w, i) => { w.visible = poolFill > 0.02; w.position.y = lerp(-0.3, 0.42, poolFill); w.material.color.set('#2f86a6').lerp(new THREE.Color('#e6f4ff'), freeze); w.material.roughness = lerp(0.06, 0.3, freeze); w.material.opacity = lerp(0.92, 0.97, freeze); w.scale.x = Math.max(0.01, 1 - broken * (0.35 + i * 0.15)); w.position.x = -31.3 * (1 - w.scale.x); });
    chanW.visible = t >= at('pools', 0.1); waterN.offset.set(-t * 0.25, t * 0.05);
    const stackN = t < at('pit') ? 5 : t < at('walls_thick') ? 1 + Math.floor(ease(seg(t, at('pit', 0.05), at('pit', 0.9))) * 4.99) : 5;
    const melted = b.s === 'melt' ? 0.1 * p : 0;
    iceBlocks.forEach(m => { m.visible = m.userData.layer < stackN; if (!m.userData.straw) m.scale.y = 1 - melted; });
    trenchWater.visible = b.s === 'melt' || b.s === 'summer'; trenchWater.material = waterMat;
  }

  // ---------- shots
  function shot(from, to, lf, lt, k) { cam.position.copy(from).lerp(to, ease(k)); cam.lookAt(lf.clone().lerp(lt, ease(k))); }
  function orbit(cx, cy, cz, rr, hgt, a0, a1, k, ly = 0) { const a = lerp(a0, a1, k); cam.position.set(cx + Math.cos(a) * rr, cy + hgt, cz + Math.sin(a) * rr); cam.lookAt(cx, cy + ly, cz); }
  const S = {
    hook: p => shot(v3(40, 3.6, 18), v3(39, 3.4, 16), v3(36, 2.7, 9), v3(36, 2.6, 9), p),
    reveal: p => shot(v3(36, 3, 14), v3(34, 9, 46), v3(30, 3, 4), v3(0, 9, 0), p),
    name: p => orbit(0, 0, 0, 52, 14, 1.0, 1.35, p, 8),
    pools: p => shot(v3(44, 14, -8), v3(30, 16, -4), v3(30, 0, -27), v3(0, 0, -27), p),
    wall: p => shot(v3(-20, 14, -2), v3(-14, 18, 4), v3(0, 4, -30), v3(0, 6, -30), p),
    night: p => shot(v3(-26, 9, -10), v3(-20, 8, -12), v3(10, 0, -27), v3(14, 0, -27), p),
    harvest: p => shot(v3(18, 7, -12), v3(14, 8, -8), v3(4, 2, -24), v3(0, 3, -18), p),
    pit: p => shot(v3(0, 6, 34), v3(0, 3, 26), v3(0, -3, 0), v3(0, -5, 0), p),
    walls_thick: p => shot(v3(20, 6, 22), v3(18, 5.5, 18), v3(10.5, 3, 0), v3(10.5, 3, 0), p),
    sarooj: p => shot(v3(1, 9, 18), v3(1, 8.5, 16.5), v3(1, 0.6, 6), v3(1, 0.6, 6), p),
    insulate: p => shot(v3(30, 18, 46), v3(26, 20, 42), v3(0, 6, 0), v3(0, 7, 0), p),
    airflow: p => shot(v3(0, 6, 44), v3(0, 5, 40), v3(0, 4, 0), v3(0, 4, 0), p),
    melt: p => shot(v3(4, -3, 18), v3(3, -4, 15), v3(0, -7, -2), v3(0, -8, -3), p),
    summer: p => shot(v3(34, 6, -2), v3(30, 8, 4), v3(0, 3, -12), v3(0, 6, -6), p),
    today: p => orbit(0, 0, 0, 90, 40, 0.6, 1.0, p, 6),
    final: p => orbit(-20, 0, 0, 150, 85, 1.2, 1.55, p, 0),
    endcard: p => orbit(-20, 0, 0, 160, 95, 1.55, 1.65, p, 0),
  };
  const CUT = new Set(['pit', 'walls_thick', 'sarooj', 'airflow', 'melt']);
  const LIGHT = { hook: 'hot', reveal: 'hot', night: 'night', harvest: 'dawn', summer: 'hot' };

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
    const cut = CUT.has(b.s); frontHalf.visible = !cut; domeFull.visible = !cut; domeHalf.visible = cut; soilFace.visible = pitIn.visible = cut;
    setLight(LIGHT[b.s] || 'day');
    lamp.intensity = cut ? 260 : 0; lamp.position.set(0, 8, 8);
    apply(t, b, p);
    // people
    eater.visible = b.s === 'hook' || b.s === 'reveal' || b.s === 'summer'; eater.position.set(36, 0, 9); eater.rotation.y = 0.55;
    [w1, w2, w3].forEach((w, k) => { w.visible = b.s === 'harvest' || b.s === 'summer'; const u = ((b.s === 'harvest' ? p : p * 0.6) + k * 0.33) % 1; const P0 = v3(6 - k * 6, 0, -20), P1 = v3(0, 0, -14.5); w.position.copy(P0).lerp(P1, u); w.position.y = Math.abs(Math.sin(u * 30)) * 0.12; w.rotation.y = Math.atan2(P1.x - P0.x, P1.z - P0.z); carried[k].visible = b.s === 'harvest' || (b.s === 'summer' && k < 2); });
    // helpers
    hotS.concat(coldS, rays, drips).forEach(s => s.visible = false); dim.visible = false; piles.forEach(g => g.visible = false); board.visible = b.s === 'sarooj';
    if (b.s === 'walls_thick') { dim.visible = p > 0.35; const thick = th(1.5); dim.position.set(DOME_R * Math.pow(1 - 1.5 / DOME_H, 0.8) - thick / 2, 1.5, 0.6); dim.scale.set(thick / 2.1, 1, 1); }
    if (b.s === 'sarooj') ING.forEach(([n], k) => { const ts = wordT('sarooj', n === 'hair' ? 'goat' : n === 'egg' ? 'egg' : n); const k2 = ease(seg(t, ts - 0.05, ts + 0.25)); piles[k].visible = k2 > 0.01; piles[k].scale.setScalar(Math.max(0.01, k2 * (1 + 0.15 * Math.sin(clamp((t - ts) * 8) * Math.PI)))); });
    if (b.s === 'insulate') rays.forEach((s, k) => { const u = (k / rays.length + t * 0.8) % 1; const a = k * 2.4, dir = v3(Math.cos(a) * 0.5, 0.75, Math.sin(a) * 0.5 + 0.4).normalize(); const hitR = 9 + (k % 5); const pos = dir.clone().multiplyScalar(lerp(46, hitR, u)); pos.y += 4; s.visible = true; s.position.copy(pos); s.lookAt(0, 6, 0); s.rotateX(Math.PI / 2); s.material.opacity = 0.9 * (1 - Math.max(0, u - 0.8) * 5); });
    if (b.s === 'airflow') { hotS.forEach((s, k) => { const u = (k / hotS.length + t * 0.35) % 1; s.visible = true; s.position.set(Math.sin(k * 2.1) * lerp(5, 0.6, u), lerp(-2, DOME_H + 3, u), -1.5 - (k % 3)); s.rotation.set(0, 0, 0); });
      coldS.forEach((s, k) => { const u = (k / coldS.length + t * 0.3) % 1, side = k % 2 ? 1 : -1, y = lerp(DOME_H - 4, -6, u); s.visible = true; s.position.set(side * Math.max(1.5, ro(Math.max(0, y)) - th(Math.max(0, y)) - 1.2), y, -1.5 - (k % 3)); s.rotation.set(0, 0, 0); }); }
    if (b.s === 'melt') drips.forEach((d, k) => { const u = (k / drips.length + t * 0.5) % 1; d.visible = true; d.position.set(((k * 1.9) % 12) - 6, lerp(-PIT_D + 6, -PIT_D - 1.1, u), -1 - (k % 4)); });
    (S[b.s] || S.final)(p);
    r.render(scene, cam);
    g2.setTransform(1, 0, 0, 1, 0, 0); g2.clearRect(0, 0, W, H);
    if (LIGHT[b.s] === 'hot') { const g = g2.createLinearGradient(0, 0, 0, H); g.addColorStop(0, 'rgba(255,170,60,0.18)'); g.addColorStop(1, 'rgba(255,120,40,0.08)'); g2.fillStyle = g; g2.fillRect(0, 0, W, H); }
    caption(b, t);
    if (b.s === 'endcard') { const k = ease(seg(p, 0, 0.3)); g2.save(); g2.globalAlpha = k; g2.textAlign = 'center'; g2.lineJoin = 'round'; g2.font = '900 140px DejaVu Sans'; g2.lineWidth = 28; g2.strokeStyle = '#000'; g2.strokeText('YAKHCHAL', W / 2, H * 0.42); g2.fillStyle = '#fff'; g2.fillText('YAKHCHAL', W / 2, H * 0.42); g2.font = '800 52px DejaVu Sans'; g2.lineWidth = 12; g2.strokeText('the ancient desert fridge', W / 2, H * 0.42 + 100); g2.fillStyle = '#7fd0ff'; g2.fillText('the ancient desert fridge', W / 2, H * 0.42 + 100); g2.restore(); }
    const prev = FILM.beats[i - 1]; if (prev && t - b.start < 0.08) { g2.fillStyle = `rgba(255,255,255,${0.3 * (1 - (t - b.start) / 0.08)})`; g2.fillRect(0, 0, W, H); }
    if (t < 0.25) { g2.fillStyle = `rgba(0,0,0,${1 - t / 0.25})`; g2.fillRect(0, 0, W, H); }
  }
  return { render };
}
window.YakhchalFilm = { create };
