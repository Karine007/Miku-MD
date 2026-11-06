// "18 Days in the Radio Tower" — toy-brick (Lego-style) version. Original story and characters.
// render(t) draws frame t: a three.js brick world for story scenes + a 2D overlay for info cards.
// Timing comes from window.FILM (the voice-driven timeline made by the narration step).
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

const W = 1920, H = 1080;
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, k) => a + (b - a) * k;
const ease = k => k * k * (3 - 2 * k);
const seg = (t, a, b) => clamp((t - a) / (b - a));
let seed = 99; const rand = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
const v3 = (x, y, z) => new THREE.Vector3(x, y, z);

export function create(canvas3d, canvas2d) {
  const r = new THREE.WebGLRenderer({ canvas: canvas3d, antialias: true, preserveDrawingBuffer: true });
  r.setPixelRatio(1); r.setSize(W, H, false);
  r.shadowMap.enabled = true; r.shadowMap.type = THREE.PCFSoftShadowMap;
  r.toneMapping = THREE.ACESFilmicToneMapping;
  const scene = new THREE.Scene();
  scene.environment = new THREE.PMREMGenerator(r).fromScene(new RoomEnvironment(), 0.04).texture;
  const cam = new THREE.PerspectiveCamera(38, W / H, 0.1, 600);
  const g2 = canvas2d.getContext('2d');

  const sun = new THREE.DirectionalLight('#fff4e0', 2.4); sun.castShadow = true; sun.shadow.mapSize.set(1536, 1536); sun.shadow.bias = -0.0008;
  Object.assign(sun.shadow.camera, { left: -30, right: 30, top: 30, bottom: -30, near: 1, far: 140 });
  scene.add(sun, sun.target);
  const hemi = new THREE.HemisphereLight('#ffffff', '#6a6a72', 0.6); scene.add(hemi);

  // ---------- bricks
  const mats = {};
  const plastic = (c, o = {}) => mats[c + JSON.stringify(o)] ??= new THREE.MeshPhysicalMaterial({ color: c, roughness: 0.26, clearcoat: 0.55, clearcoatRoughness: 0.2, ...o });
  const glow = (c, i = 2) => mats['g' + c + i] ??= new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: i, roughness: 0.4 });
  const studGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 16);
  const boxGeo = new THREE.BoxGeometry(1, 1, 1);
  function brick(parent, w, d, h, c, x, y, z, { studs = true, mat = null, shadow = true } = {}) {
    const m = mat || plastic(c), g = new THREE.Group();
    const b = new THREE.Mesh(boxGeo, m); b.scale.set(w - 0.04, h - 0.04, d - 0.04); b.castShadow = shadow; b.receiveShadow = true; g.add(b);
    if (studs && w * d <= 64) for (let i = 0; i < w; i++) for (let j = 0; j < d; j++) { const s = new THREE.Mesh(studGeo, m); s.position.set(i - (w - 1) / 2, h / 2 + 0.1, j - (d - 1) / 2); s.castShadow = shadow; g.add(s); }
    g.position.set(x, y + h / 2, z); parent.add(g); return g;
  }
  function plate(parent, w, d, c, x, y, z) { // big baseplate with instanced studs
    const m = plastic(c); const b = new THREE.Mesh(boxGeo, m); b.scale.set(w, 0.4, d); b.position.set(x, y - 0.2, z); b.receiveShadow = true; parent.add(b);
    const n = Math.min(w * d, 4000), inst = new THREE.InstancedMesh(studGeo, m, n); const mm = new THREE.Matrix4(); let k = 0;
    for (let i = 0; i < w && k < n; i++) for (let j = 0; j < d && k < n; j++) { mm.makeTranslation(x - w / 2 + 0.5 + i, y + 0.1, z - d / 2 + 0.5 + j); inst.setMatrixAt(k++, mm); }
    inst.count = k; inst.receiveShadow = true; parent.add(inst); return b;
  }
  function wall(parent, w, h, c1, c2, x, y, z, rotY = 0) { // running-bond brick wall, 1 deep
    const g = new THREE.Group(); g.position.set(x, y, z); g.rotation.y = rotY; parent.add(g);
    const inst = new THREE.InstancedMesh(boxGeo, new THREE.MeshPhysicalMaterial({ roughness: 0.3, clearcoat: 0.4 }), Math.ceil(w / 2 + 1) * h);
    const mm = new THREE.Matrix4(), q = new THREE.Quaternion(), sc = new THREE.Vector3(), ps = new THREE.Vector3(), col = new THREE.Color(); let k = 0;
    for (let row = 0; row < h; row++) for (let i = -(row % 2); i < w; i += 2) {
      const x0 = Math.max(0, i), x1 = Math.min(w, i + 2); if (x1 <= x0) continue;
      ps.set(-w / 2 + (x0 + x1) / 2, row + 0.5, 0); sc.set(x1 - x0 - 0.05, 0.95, 1); mm.compose(ps, q, sc); inst.setMatrixAt(k, mm); inst.setColorAt(k++, col.set(rand() > 0.5 ? c1 : c2));
    }
    inst.count = k; inst.receiveShadow = true; g.add(inst); return g;
  }
  function cyl(parent, rad, h, c, x, y, z, seg = 20, mat = null) { const m = new THREE.Mesh(new THREE.CylinderGeometry(rad, rad, h, seg), mat || plastic(c)); m.position.set(x, y + h / 2, z); m.castShadow = true; m.receiveShadow = true; parent.add(m); return m; }

  // ---------- minifigs (generic toy figures)
  const yellowSkin = plastic('#ffd23c'), BLACK = new THREE.MeshBasicMaterial({ color: '#111' });
  const mk = (geo, mat, x, y, z, p) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.castShadow = true; p.add(m); return m; };
  const LOOKS = {
    remi: { shirt: '#3d4f6e', pants: '#2b2f38', hair: '#5a3a22', glasses: 1, phones: 1, scarf: '#c8361f' },
    tess: { shirt: '#f2b51d', pants: '#3a5a9a', hair: '#7a4a2a', pony: 1 },
    kid: { shirt: '#4caf50', pants: '#5d4037', cap: '#1e62c8', small: 1 },
    pilot: { shirt: '#5d6b3e', pants: '#5d6b3e', helmet: '#e8e8e0' },
    zombie: { shirt: '#6e665a', pants: '#3c4a3a', skin: '#9fbf7f', zombie: 1 },
    survivor1: { shirt: '#c0392b', pants: '#2c3e50', hair: '#222' },
    survivor2: { shirt: '#8e44ad', pants: '#34495e', hair: '#a0522d' },
  };
  function fig(look) {
    const L = LOOKS[look] || look, root = new THREE.Group(), body = new THREE.Group(); root.add(body); body.position.y = 1.6; scene.add(root);
    const o = -1.6, P = plastic(L.pants), S = plastic(L.shirt), skin = L.skin ? plastic(L.skin) : yellowSkin;
    mk(new THREE.BoxGeometry(1.1, 0.3, 0.6), P, 0, 1.35 + o, 0, body);
    const legs = [-0.28, 0.28].map(x => { const p = new THREE.Group(); p.position.set(x, 1.3 + o, 0); body.add(p); mk(new THREE.BoxGeometry(0.52, 1.2, 0.6), P, 0, -0.6, 0, p); mk(new THREE.BoxGeometry(0.52, 0.2, 0.78), P, 0, -1.2, 0.08, p); return p; });
    const tg = new THREE.CylinderGeometry(0.42, 0.62, 1.25, 4, 1); tg.rotateY(Math.PI / 4); tg.scale(1.2, 1, 0.62); mk(tg, S, 0, 2.12 + o, 0, body);
    if (L.zombie) { mk(new THREE.BoxGeometry(0.5, 0.35, 0.05), plastic('#4a4036'), 0.15, 1.8 + o, 0.33, body); }
    mk(new THREE.CylinderGeometry(0.22, 0.22, 0.15, 14), skin, 0, 2.82 + o, 0, body);
    const head = new THREE.Group(); head.position.set(0, 3.2 + o, 0); body.add(head);
    mk(new THREE.CylinderGeometry(0.4, 0.4, 0.7, 24), skin, 0, 0, 0, head);
    const eyes = [-0.14, 0.14].map(x => mk(new THREE.SphereGeometry(0.06, 10, 8), L.zombie ? plastic('#f2f2e0') : BLACK, x, 0.08, 0.38, head));
    const smile = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.025, 6, 16, Math.PI), BLACK); smile.rotation.z = Math.PI; smile.position.set(0, -0.09, 0.39); head.add(smile);
    const frown = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.025, 6, 16, Math.PI), BLACK); frown.position.set(0, -0.2, 0.39); head.add(frown); frown.visible = false;
    const mouthO = mk(new THREE.CylinderGeometry(0.08, 0.08, 0.03, 12), plastic('#5b1a12'), 0, -0.12, 0.39, head); mouthO.rotation.x = Math.PI / 2; mouthO.visible = false;
    const tear = mk(new THREE.SphereGeometry(0.05, 8, 6), plastic('#5fb4f0'), 0.16, -0.02, 0.4, head); tear.visible = false;
    if (L.hair) { mk(new THREE.CylinderGeometry(0.43, 0.43, 0.28, 24), plastic(L.hair), 0, 0.42, -0.03, head); mk(new THREE.BoxGeometry(0.3, 0.16, 0.3), plastic(L.hair), 0.1, 0.62, 0.05, head); }
    if (L.pony) { mk(new THREE.CylinderGeometry(0.43, 0.43, 0.3, 24), plastic(L.hair), 0, 0.42, -0.03, head); mk(new THREE.CylinderGeometry(0.13, 0.08, 0.7, 10), plastic(L.hair), 0, 0.15, -0.5, head).rotation.x = 0.5; }
    if (L.cap) { mk(new THREE.CylinderGeometry(0.44, 0.44, 0.3, 24), plastic(L.cap), 0, 0.46, 0, head); mk(new THREE.BoxGeometry(0.6, 0.06, 0.4), plastic(L.cap), 0, 0.33, 0.45, head); }
    if (L.helmet) { mk(new THREE.SphereGeometry(0.5, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), plastic(L.helmet), 0, 0.25, 0, head); mk(new THREE.BoxGeometry(0.6, 0.18, 0.1), plastic('#2a2a2a', { clearcoat: 1 }), 0, 0.34, 0.45, head); }
    if (L.zombie) { mk(new THREE.BoxGeometry(0.5, 0.12, 0.3), plastic('#3c3a32'), -0.05, 0.42, 0, head); }
    if (L.glasses) { for (const x of [-0.15, 0.15]) mk(new THREE.TorusGeometry(0.12, 0.022, 6, 18), BLACK, x, 0.08, 0.4, head); mk(new THREE.BoxGeometry(0.08, 0.02, 0.02), BLACK, 0, 0.1, 0.41, head); }
    if (L.scarf) { mk(new THREE.TorusGeometry(0.3, 0.1, 8, 18), plastic(L.scarf), 0, 2.78 + o, 0, body).rotation.x = Math.PI / 2; mk(new THREE.BoxGeometry(0.2, 0.55, 0.1), plastic(L.scarf), 0.2, 2.45 + o, 0.33, body).rotation.z = 0.2; }
    if (L.phones) { const pm = plastic('#2a2d33'); const band = new THREE.Mesh(new THREE.TorusGeometry(0.38, 0.05, 6, 20, Math.PI), pm); band.position.set(0, 2.72 + o, 0.05); band.rotation.set(Math.PI / 2 + 0.6, 0, 0); body.add(band); for (const x of [-0.4, 0.4]) mk(new THREE.CylinderGeometry(0.16, 0.16, 0.12, 14), pm, x, 2.74 + o, 0.12, body).rotation.z = Math.PI / 2; }
    const arm = s => { const p = new THREE.Group(); p.position.set(s * 0.66, 2.62 + o, 0); body.add(p); const a = mk(new THREE.CylinderGeometry(0.15, 0.17, 0.95, 12), S, 0, -0.42, 0.05, p); a.rotation.z = s * 0.18;
      const hand = new THREE.Group(); hand.position.set(s * 0.1, -0.95, 0.12); p.add(hand); mk(new THREE.TorusGeometry(0.13, 0.07, 8, 16), skin, 0, 0, 0, hand).rotation.y = Math.PI / 2; return { p, hand }; };
    const armR = arm(1), armL = arm(-1);
    if (L.small) root.scale.setScalar(0.72);
    return { root, body, legs, head, armR, armL, smile, frown, mouthO, tear, eyes, items: {} };
  }
  // poses: arm/leg rotations about x (negative = forward/up), body pitch, head pitch/yaw
  const POSE = {
    stand: {}, sit: { sit: 1, legs: [-1.5, -1.5], arms: [-0.5, -0.5] },
    mic: { sit: 1, legs: [-1.5, -1.5], arms: [-1.0, -0.6], pitch: 0.15 },
    phone: { sit: 1, legs: [-1.5, -1.5], arms: [-0.4, -2.6], headZ: 0.15 },
    think: { sit: 1, legs: [-1.5, -1.5], arms: [-0.5, -2.2], head: -0.15 },
    surprised: { sit: 1, legs: [-1.5, -1.5], arms: [-2.4, -2.4], pitch: -0.15, head: 0.2 },
    listen: { sit: 1, legs: [-1.5, -1.5], arms: [-0.6, -2.9], head: 0.15, headZ: 0.2 },
    cry: { sit: 1, legs: [-1.5, -1.5], arms: [-2.3, -2.3], pitch: 0.45, head: 0.4 },
    scared: { arms: [-1.3, -1.3], pitch: -0.15, head: 0.15 },
    look: { arms: [-0.1, -0.2], head: 0.05 }, binoculars: { arms: [-2.0, -2.0], head: 0.0 },
    push: { arms: [-1.5, -1.5], pitch: 0.4, legs: [0.5, -0.4] }, peek: { arms: [-1.3, -0.6], pitch: 0.2, head: 0.2 },
    reach: { arms: [-0.2, -1.5] }, laugh: { arms: [-2.8, -2.8], head: 0.35, pitch: -0.15 },
    carry: { arms: [-1.0, -1.0], pitch: 0.1 }, pour: { arms: [-1.4, -1.0], pitch: 0.35, head: 0.25 },
    climb: { arms: [-3.0, -3.0], head: 0.45, legs: [-0.5, 0.1] }, sneak: { arms: [-0.6, -0.6], pitch: 0.4, legs: [-0.5, 0.3] },
    freeze: { arms: [0, 0] }, hug: { arms: [-1.5, -1.5], pitch: 0.2 }, wave: { arms: [0, -2.8] },
    zombie: { arms: [-1.45, -1.3], pitch: 0.15, head: -0.3, headZ: 0.3 },
  };
  function pose(f, { x = 0, y = 0, z = 0, yaw = 0, p = 'stand', walk = 0, t = 0, face = 'smile', talk = 0, vis = true, scale = null } = {}) {
    f.root.visible = vis; if (!vis) return; if (scale !== null) f.root.scale.setScalar(scale);
    const P = POSE[p] || POSE.stand;
    f.root.position.set(x, y, z); f.root.rotation.y = yaw;
    f.body.position.y = 1.6 - (P.sit ? 1.15 : 0); f.body.rotation.set(P.pitch || 0, 0, 0);
    const sw = walk ? Math.sin(t * 9) * 0.6 * walk : 0;
    const legs = P.legs || [0, 0]; f.legs[0].rotation.x = legs[0] + sw; f.legs[1].rotation.x = legs[1] - sw;
    const arms = P.arms || [0, 0]; f.armL.p.rotation.x = arms[0] - sw * 0.7; f.armR.p.rotation.x = arms[1] + sw * 0.7;
    if (walk) f.root.position.y += Math.abs(Math.sin(t * 9)) * 0.1 * walk;
    f.head.rotation.set(P.head || 0, 0, P.headZ || 0);
    f.smile.visible = face === 'smile' || face === 'happy'; f.frown.visible = face === 'worried' || face === 'cry' || face === 'scared';
    f.mouthO.visible = face === 'surprised' || talk > 0; f.mouthO.scale.set(1, 1, talk ? 0.6 + Math.abs(Math.sin(t * 15)) * 1.2 : 1.4);
    if (talk) f.smile.visible = false;
    f.tear.visible = face === 'cry'; if (face === 'cry') f.tear.position.y = -0.02 - (t * 0.6 % 0.3);
  }
  const C = { remi: fig('remi'), tess: fig('tess'), kid: fig('kid'), pilot: fig('pilot'), s1: fig('survivor1'), s2: fig('survivor2') };
  const Z = Array.from({ length: 14 }, () => fig('zombie'));
  const all = [...Object.values(C), ...Z];
  // hand props
  const flashlight = new THREE.Group(); cyl(flashlight, 0.12, 0.5, '#d0d0d0', 0, -0.25, 0); C.remi.armR.hand.add(flashlight); flashlight.rotation.x = Math.PI / 2;
  const torch = new THREE.SpotLight('#fff3d0', 0, 40, 0.42, 0.5, 1.2); torch.position.set(0, 0.2, 0.3); C.remi.armR.hand.add(torch); const torchT = new THREE.Object3D(); torchT.position.set(0, 0, 12); C.remi.armR.hand.add(torchT); torch.target = torchT;
  const binos = new THREE.Group(); for (const x of [-0.18, 0.18]) cyl(binos, 0.12, 0.45, '#222', x, 0, 0); binos.rotation.x = Math.PI / 2; binos.position.set(0, 0.6, 0.55); C.remi.head.add(binos);
  const phoneP = brick(C.remi.armR.hand, 0.3, 0.2, 0.8, '#2c2e33', 0, -0.2, 0, { studs: false });
  const can = new THREE.Group(); cyl(can, 0.35, 0.9, '#c8361f', 0, -0.45, 0); C.remi.armR.hand.add(can);
  const choc = brick(C.remi.armR.hand, 0.6, 0.15, 0.3, '#6d3b1f', 0, -0.1, 0.2, { studs: false });
  const kidRadio = brick(C.tess.armR.hand, 0.4, 0.25, 0.3, '#333', 0, -0.15, 0.1, { studs: false });
  const headset = new THREE.Mesh(new THREE.TorusGeometry(0.4, 0.06, 6, 18, Math.PI), plastic('#333')); C.pilot.armR.hand.add(headset);

  // ---------- city skyline generator (instanced windows)
  function city(parent, { x0, x1, z0, z1, minH = 8, maxH = 30, tower = null, seedv = 1 }) {
    const g = new THREE.Group(); parent.add(g); seed = seedv;
    const lit = [], dark = [];
    const cols = ['#5d6a78', '#6f7a86', '#4f5a68', '#7d8794', '#8a7d6e'];
    for (let x = x0; x < x1; ) {
      const w = 4 + Math.floor(rand() * 5), d = 4 + Math.floor(rand() * 4), h = minH + Math.floor(rand() * (maxH - minH)), z = z0 + rand() * (z1 - z0);
      brick(g, w, d, h, cols[Math.floor(rand() * 5)], x + w / 2, 0, z, { studs: false, shadow: false });
      for (let yy = 1.5; yy < h - 1; yy += 2) for (let xx = 0.8; xx < w - 0.6; xx += 1.4) (rand() > 0.72 ? lit : dark).push([x + xx, yy, z + d / 2 + 0.03]);
      x += w + 0.6 + rand() * 1.5;
    }
    const mkI = (arr, mat) => { const inst = new THREE.InstancedMesh(new THREE.PlaneGeometry(0.7, 1), mat, Math.max(1, arr.length)); const mm = new THREE.Matrix4(); arr.forEach(([x, y, z], i) => { mm.makeTranslation(x, y, z); inst.setMatrixAt(i, mm); }); inst.count = arr.length; g.add(inst); return inst; };
    g.userData.lit = mkI(lit, mats.cityLit ??= new THREE.MeshStandardMaterial({ color: '#ffd77a', emissive: '#ffc85a', emissiveIntensity: 1.2 }));
    mkI(dark, mats.cityDark ??= new THREE.MeshStandardMaterial({ color: '#2c3646', roughness: 0.2, metalness: 0.3 }));
    return g;
  }
  function fireSpot(parent, x, y, z, s = 1) {
    const g = new THREE.Group(); g.position.set(x, y, z); parent.add(g);
    const flames = [0, 1, 2].map(i => { const m = new THREE.Mesh(new THREE.ConeGeometry(0.6 * s, 2 * s, 6), glow(i % 2 ? '#ffb02e' : '#ff5a1f', 2.5)); m.position.set((i - 1) * 0.7 * s, s, 0); g.add(m); return m; });
    const smoke = [0, 1, 2, 3].map(i => { const m = new THREE.Mesh(new THREE.SphereGeometry(1.2 * s, 10, 8), plastic('#555a60', { transparent: true, opacity: 0.55, roughness: 0.9, clearcoat: 0 })); g.add(m); return m; });
    const light = new THREE.PointLight('#ff7a30', 30 * s, 22 * s, 1.6); light.position.y = 1.5 * s; g.add(light);
    g.userData.tick = t => { flames.forEach((m, i) => { m.scale.y = 0.8 + 0.4 * Math.abs(Math.sin(t * 9 + i * 2)); }); smoke.forEach((m, i) => { const k = (t * 0.25 + i / 4) % 1; m.position.set(Math.sin(i + t * 0.3) * s, 2 * s + k * 9 * s, 0); m.scale.setScalar(0.6 + k * 1.4); m.material.opacity = 0.55 * (1 - k); }); light.intensity = (26 + 8 * Math.sin(t * 13)) * s; };
    return g;
  }
  const fires = [];
  // helicopter
  function makeHeli() {
    const h = new THREE.Group(); scene.add(h); const G = '#5f6e48';
    brick(h, 5, 3, 2.4, G, 0, 0, 0, { studs: false }); brick(h, 1.6, 2.6, 1.8, '#9fd3ee', 3, 0.3, 0, { studs: false, mat: plastic('#9fd3ee', { transparent: true, opacity: 0.75 }) });
    brick(h, 6, 0.8, 0.8, G, -5, 1.2, 0, { studs: false }); brick(h, 0.4, 0.4, 1.6, G, -8, 1.2, 0, { studs: false });
    const rotor = new THREE.Group(); rotor.position.set(0, 2.8, 0); h.add(rotor); brick(rotor, 14, 0.5, 0.15, '#222', 0, 0, 0, { studs: false }); brick(rotor, 0.5, 14, 0.15, '#222', 0, 0, 0, { studs: false });
    for (const z of [-1.4, 1.4]) brick(h, 5, 0.3, 0.3, '#333', 0, -0.9, z, { studs: false });
    const beam = new THREE.Mesh(new THREE.ConeGeometry(5, 26, 24, 1, true), new THREE.MeshBasicMaterial({ color: '#fff6c8', transparent: true, opacity: 0.12, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide })); beam.position.set(2, -13, 0); h.add(beam);
    const spot = new THREE.SpotLight('#fff6d0', 0, 70, 0.3, 0.5, 1); spot.position.set(2, -0.5, 0); const st = new THREE.Object3D(); st.position.set(4, -30, 0); h.add(spot, st); spot.target = st;
    h.userData = { rotor, beam, spot }; return h;
  }
  const heli = makeHeli();

  // ================= SETS =================
  const sets = {};
  const SET = (name, x) => { const g = new THREE.Group(); g.position.set(x, 0, 0); scene.add(g); sets[name] = g; return g; };
  // --- studio (x=0): room 24 wide, window on back-right wall looking at the city
  const studio = SET('studio', 0);
  plate(studio, 26, 18, '#8d6e63', 0, 0, 0);
  wall(studio, 26, 14, '#e8dcc0', '#dccfb2', 0, 0, -9);
  wall(studio, 18, 14, '#e8dcc0', '#dccfb2', -13, 0, 0, Math.PI / 2);
  const winHole = new THREE.Mesh(new THREE.PlaneGeometry(12, 7), new THREE.MeshBasicMaterial({ color: '#000', transparent: true, opacity: 0 })); // (visual: we cut the wall by overlaying the window frame and a city backdrop)
  const winFrame = new THREE.Group(); studio.add(winFrame); winFrame.position.set(5, 3.5, -8.45);
  const glass = new THREE.Mesh(new THREE.PlaneGeometry(12, 7.5), new THREE.MeshBasicMaterial({ color: '#ffffff' })); winFrame.add(glass);
  const winRT = new THREE.WebGLRenderTarget(1024, 640); glass.material = new THREE.MeshBasicMaterial({ map: winRT.texture });
  for (const [w, h, x, y] of [[12.6, 0.4, 0, 3.9], [12.6, 0.4, 0, -3.9], [0.4, 8.2, -6.2, 0], [0.4, 8.2, 6.2, 0], [0.3, 7.6, 0, 0], [12, 0.3, 0, 0]]) brick(winFrame, w, 0.4, h, '#5a4636', x, y - h / 2, 0.1, { studs: false });
  // ON AIR sign
  const onAirMat = new THREE.MeshStandardMaterial({ color: '#6b2a22', emissive: '#ff2a12', emissiveIntensity: 0 });
  brick(studio, 4, 0.4, 1.4, '#6b2a22', -5, 9.5, -8.6, { studs: false, mat: onAirMat });
  const onAirTex = (() => { const c = document.createElement('canvas'); c.width = 256; c.height = 96; const g = c.getContext('2d'); g.fillStyle = '#fff3e0'; g.font = 'bold 64px DejaVu Sans'; g.textAlign = 'center'; g.fillText('ON AIR', 128, 70); return new THREE.CanvasTexture(c); })();
  const onAirTxt = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 1.3), new THREE.MeshBasicMaterial({ map: onAirTex, transparent: true })); onAirTxt.position.set(-5, 10.2, -8.38); studio.add(onAirTxt);
  const onAirLight = new THREE.PointLight('#ff3a20', 0, 10, 1.5); onAirLight.position.set(-5, 10, -7); studio.add(onAirLight);
  // desk, console, mic, phone
  brick(studio, 10, 4, 0.5, '#6d4c41', -2, 3, -3, { studs: true }); for (const x of [-6.5, 2.5]) brick(studio, 0.6, 3.6, 3, '#5d4037', x, 0, -3, { studs: false });
  brick(studio, 5, 2, 0.6, '#37393f', -3, 3.5, -3.6, { studs: false });
  const consoleLights = []; for (let i = 0; i < 8; i++) { const m = brick(studio, 0.4, 0.4, 0.25, i % 3 ? '#cfcfcf' : '#e33', -5 + i * 0.6, 4.1, -3.3, { studs: false, mat: glow(i % 3 ? '#9be37a' : '#ff4433', 0.2) }); consoleLights.push(m); }
  const micArm = new THREE.Group(); studio.add(micArm); micArm.position.set(1.4, 3.5, -2.2);
  cyl(micArm, 0.08, 2.2, '#222', 0, 0, 0, 8); const micHead = cyl(micArm, 0.3, 0.9, '#2c2e33', -1.0, 2.3, -2.2, 16); micHead.rotation.set(-0.7, 0, 0.6);
  const phoneBase = brick(studio, 1.6, 1.0, 0.4, '#2c2e33', 1.6, 3.5, -2.6, { studs: false });
  const phoneLeds = [0, 1, 2, 3].map(i => brick(studio, 0.25, 0.25, 0.12, '#444', 1.0 + i * 0.4, 3.9, -2.3, { studs: false, mat: new THREE.MeshStandardMaterial({ color: '#554', emissive: '#ffcc22', emissiveIntensity: 0 }) }));
  // chair
  const chair = new THREE.Group(); studio.add(chair); chair.position.set(-0.5, 0, -6.4); brick(chair, 2.2, 2.2, 0.4, '#2f3238', 0, 2.0, 0, { studs: false }); brick(chair, 2.2, 0.4, 2.6, '#2f3238', 0, 2.4, -1.0, { studs: false }); cyl(chair, 0.15, 2, '#555', 0, 0, 0, 8);
  // door + barricade state
  brick(studio, 0.4, 4, 7, '#8a6a4a', -12.6, 0, 3, { studs: false });
  const cabinet = brick(studio, 1.6, 2.4, 4, '#7d868c', -11.6, 0, 3); const sofa = new THREE.Group(); studio.add(sofa); brick(sofa, 2.4, 6, 1.6, '#3f7a64', 0, 0, 0); brick(sofa, 0.8, 6, 2.6, '#3f7a64', -0.8, 1.6, 0); sofa.position.set(-10.2, 0, 3);
  const lamp = new THREE.PointLight('#ffc27a', 0, 26, 1.5); lamp.position.set(-2, 7, 0); studio.add(lamp);
  brick(studio, 3, 3, 0.4, '#ffe8a0', -2, 13.3, -1, { studs: false, mat: glow('#ffe8b0', 0.4) });
  // window city: rendered into a texture with its own camera
  const windowScene = new THREE.Scene();
  const wcam = new THREE.PerspectiveCamera(42, 12 / 7.5, 0.1, 400); wcam.position.set(0, 26, 40); wcam.lookAt(0, 14, -40);
  const wsun = new THREE.DirectionalLight('#fff4e0', 2); wsun.position.set(20, 40, 30); const whemi = new THREE.HemisphereLight('#fff', '#556', 0.7); windowScene.add(wsun, whemi);
  windowScene.environment = scene.environment;
  const wCity = city(windowScene, { x0: -90, x1: 90, z0: -70, z1: -20, minH: 10, maxH: 40, seedv: 7 });
  plate(windowScene, 200, 120, '#4a4f55', 0, 0, -40);
  const wFires = [[-30, -40], [12, -30], [46, -55], [-60, -60]].map(([x, z], i) => fireSpot(windowScene, x, 2, z, 2.2));
  const wHeli = makeHeli(); windowScene.add(wHeli); wHeli.scale.setScalar(1.3);

  // --- hallway (x=200): stairwell door, vending machine
  const hall = SET('hall', 200);
  plate(hall, 30, 14, '#9e9e9e', 0, 0, 0); wall(hall, 30, 12, '#b7b0a2', '#aaa294', 0, 0, -7);
  const sDoor = new THREE.Group(); hall.add(sDoor); sDoor.position.set(-4, 0, -6.4);
  brick(sDoor, 5, 0.6, 8, '#7f8790', 0, 0, 0, { studs: false }); brick(sDoor, 1.2, 0.4, 0.4, '#444', 1.6, 3.6, 0.5, { studs: false });
  const stairsSign = (() => { const c = document.createElement('canvas'); c.width = 256; c.height = 64; const g = c.getContext('2d'); g.fillStyle = '#e8e8e8'; g.font = 'bold 48px DejaVu Sans'; g.textAlign = 'center'; g.fillText('STAIRS', 128, 50); const m = new THREE.Mesh(new THREE.PlaneGeometry(3, 0.75), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), transparent: true })); m.position.set(0, 6.8, 0.32); sDoor.add(m); return m; })();
  const doorDark = brick(hall, 4.6, 0.2, 7.6, '#050608', -4, 0, -6.8, { studs: false, mat: new THREE.MeshBasicMaterial({ color: '#050608' }) });
  const hCabinet = brick(hall, 3, 1.6, 4.4, '#7d868c', 0, 0, -5); const hSofa = new THREE.Group(); hall.add(hSofa); brick(hSofa, 6, 2.4, 1.6, '#3f7a64', 0, 0, 0); brick(hSofa, 6, 0.8, 2.6, '#3f7a64', 0, 1.6, 0.8); hSofa.position.set(-4, 0, -3.4);
  wall(hall, 14, 12, '#b7b0a2', '#aaa294', 15, 0, 0, Math.PI / 2);
  const vend = new THREE.Group(); hall.add(vend); vend.position.set(9, 0, -5.6); brick(vend, 4.4, 2, 8, '#c0281e', 0, 0, 0, { studs: true });
  brick(vend, 3, 0.2, 5.6, '#cfeaf3', -0.4, 1.6, 1.0, { studs: false, mat: plastic('#cfeaf3', { transparent: true, opacity: 0.5 }) });
  const snacks = []; const sc = ['#f2b51d', '#1e62c8', '#6d3b1f', '#4caf50', '#ff7a30'];
  for (let rr = 0; rr < 5; rr++) for (let cc = 0; cc < 3; cc++) snacks.push(brick(vend, 0.7, 0.5, 0.7, sc[(rr + cc) % 5], -1.4 + cc * 1, 2 + rr * 1.05, 0.7, { studs: false }));
  const hallLight = new THREE.PointLight('#ffe2b0', 0, 30, 1.4); hallLight.position.set(2, 10, 2); hall.add(hallLight);

  // --- stairwell top-down (x=400)
  const well = SET('well', 400);
  for (let k = 0; k < 14; k++) { const y = -k * 4, s = 9; for (const [w, d, x, z] of [[s * 2, 2, 0, -s], [s * 2, 2, 0, s], [2, s * 2, -s, 0], [2, s * 2, s, 0]]) brick(well, w, d, 0.8, k % 2 ? '#7b7f88' : '#6c707a', x, y, z, { studs: k < 2 && w * d <= 40, shadow: false }); }
  for (let k = 0; k < 14; k++) for (let st = 0; st < 6; st++) brick(well, 2, 1, 0.5, '#8a8e96', -9 + st * 2.8, -k * 4 - st * 0.6, -6.6 + (k % 2) * 13, { studs: false, shadow: false });
  const wellLight = new THREE.PointLight('#cfe0ff', 0, 60, 1.2); wellLight.position.set(0, 4, 0); well.add(wellLight);

  // --- roof (x=600)
  const roof = SET('roof', 600);
  plate(roof, 34, 22, '#7d7f84', 0, 0, 0);
  for (const [x, z, w, d] of [[0, -11, 34, 1], [0, 11, 34, 1], [-17, 0, 1, 22], [17, 0, 1, 22]]) brick(roof, w, d, 1, '#6c6e73', x, 0, z, { studs: true });
  const mast = new THREE.Group(); roof.add(mast); mast.position.set(10, 0, -6); for (let k = 0; k < 12; k++) { brick(mast, 1, 1, 1.6, k % 3 === 2 ? '#d33' : '#ddd', -0.6, k * 1.6, 0, { studs: false }); brick(mast, 1, 1, 1.6, k % 3 === 2 ? '#d33' : '#ddd', 0.6, k * 1.6, 0, { studs: false }); }
  const mastLight = brick(mast, 0.8, 0.8, 0.8, '#f33', 0, 19.2, 0, { studs: false, mat: glow('#ff3322', 3) });
  const gen = new THREE.Group(); roof.add(gen); gen.position.set(3, 0, -6); brick(gen, 4, 3, 2.6, '#4f6b48', 0, 0, 0); brick(gen, 1, 1, 1.4, '#333', 1.2, 2.6, 0, { studs: false });
  const spotRig = new THREE.Group(); roof.add(spotRig); spotRig.position.set(-8, 0, -6); cyl(spotRig, 0.3, 2, '#555', 0, 0, 0); const lampHead = cyl(spotRig, 1, 1.2, '#ddd', 0, 2.2, 0); lampHead.rotation.x = 1.0;
  const cans = [-10, -7.5, -5, -2.5].map((x, i) => { const g = new THREE.Group(); g.position.set(x, 0, 4); roof.add(g); cyl(g, 1, 2.4, '#6e7f87', 0, 0, 0, 20, plastic('#6e7f87', { transparent: true, opacity: 0.75 })); const w = cyl(g, 0.9, 1, '#4fa8e8', 0, 0.05, 0, 20, plastic('#4fa8e8', { transparent: true, opacity: 0.85 })); g.userData.water = w; return g; });
  const rope = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1, 6), plastic('#d9c48a')); scene.add(rope);
  const rainGeo = new THREE.BufferGeometry(); const RN = 1500; const rp = new Float32Array(RN * 6); rainGeo.setAttribute('position', new THREE.BufferAttribute(rp, 3));
  const rain = new THREE.LineSegments(rainGeo, new THREE.LineBasicMaterial({ color: '#cfe2f2', transparent: true, opacity: 0.55 })); rain.frustumCulled = false; scene.add(rain);
  const rainSeed = Array.from({ length: RN }, () => [rand(), rand(), rand()]);
  const roofCity = city(roof, { x0: -120, x1: 120, z0: -110, z1: -50, minH: 6, maxH: 24, seedv: 21 }); roofCity.position.y = -20;
  const flash = new THREE.DirectionalLight('#dfe8ff', 0); flash.position.set(0, 50, 20); roof.add(flash);

  // --- tower exterior (x=800): skyline + tall radio tower
  const tow = SET('tower', 800);
  plate(tow, 260, 160, '#3e434a', 0, 0, -40);
  const tCity = city(tow, { x0: -120, x1: 120, z0: -90, z1: -10, minH: 8, maxH: 30, seedv: 33 });
  const tower = new THREE.Group(); tow.add(tower); tower.position.set(0, 0, -30);
  brick(tower, 10, 10, 62, '#5b6573', 0, 0, 0, { studs: false });
  for (let k = 0; k < 10; k++) brick(tower, 1, 1, 1.8, k % 3 === 2 ? '#d33' : '#ddd', 0, 62 + k * 1.8, 0, { studs: false });
  const tBeacon = brick(tower, 1.2, 1.2, 1.2, '#f33', 0, 80, 0, { studs: false, mat: glow('#ff3322', 3) });
  const towerWins = []; for (let y = 2; y < 60; y += 2) for (let x = -4; x <= 4; x += 1.6) { const m = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 1.2), new THREE.MeshStandardMaterial({ color: '#2c3646', emissive: '#ffd77a', emissiveIntensity: 0 })); m.position.set(x, y, 5.03); tower.add(m); towerWins.push([m, y / 60 + rand() * 0.15]); }
  const towerGlow = new THREE.PointLight('#ffd48a', 0, 120, 1.2); towerGlow.position.set(0, 40, 14); tower.add(towerGlow);
  const tFires = [[-50, -40], [40, -60], [70, -25]].map(([x, z]) => fireSpot(tow, x, 0.5, z, 2.5));

  // --- street at dawn (x=1000)
  const street = SET('street', 1000);
  plate(street, 70, 30, '#7d7a76', 0, 0, 0);
  for (let k = -3; k <= 3; k++) brick(street, 4, 0.8, 0.12, '#e8e2d0', k * 9, 0, 3, { studs: false });
  brick(street, 70, 4, 0.4, '#b9b2a4', 0, 0, -9, { studs: false });
  seed = 5; for (let k = 0; k < 8; k++) { const h = 10 + Math.floor(rand() * 10); brick(street, 8, 4, h, ['#b7856a', '#a59585', '#c2a98d', '#8f9aa3'][k % 4], -32 + k * 9, 0, -13, { studs: false }); for (let y = 2; y < h - 1; y += 3) for (let x = 0; x < 3; x++) brick(street, 1.2, 0.2, 1.4, '#9fc3d6', -34.5 + k * 9 + x * 2.5, y, -10.9, { studs: false }); }
  const bakery = (() => { const c = document.createElement('canvas'); c.width = 256; c.height = 64; const g = c.getContext('2d'); g.fillStyle = '#fff0d0'; g.fillRect(0, 0, 256, 64); g.fillStyle = '#7a3b1f'; g.font = 'bold 44px DejaVu Sans'; g.textAlign = 'center'; g.fillText('BAKERY', 128, 48); const m = new THREE.Mesh(new THREE.PlaneGeometry(5, 1.25), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c) })); m.position.set(-23, 6, -10.8); street.add(m); return m; })();
  const bus = new THREE.Group(); street.add(bus); bus.position.set(8, 0, -3); brick(bus, 14, 4, 4, '#e0a020', 0, 0.8, 0); for (let k = 0; k < 6; k++) brick(bus, 1.6, 0.2, 1.6, '#9fd3ee', -5.5 + k * 2.2, 2.6, 2.05, { studs: false }); for (const x of [-4.5, 4.5]) for (const z of [-2, 2]) { const w = cyl(bus, 0.9, 0.6, '#222', x, 0.0, z); w.rotation.x = Math.PI / 2; w.position.y = 0.9; }
  const pharmacy = (() => { brick(street, 6, 0.4, 7, '#e8f0e8', -30, 0, -10.6, { studs: false }); brick(street, 1, 0.3, 3, '#2e9e4e', -30, 3.6, -10.3, { studs: false }); brick(street, 3, 0.3, 1, '#2e9e4e', -30, 4.6, -10.3, { studs: false }); })();

  // --- bridge + river (x=1200)
  const bridge = SET('bridge', 1200);
  plate(bridge, 80, 40, '#3f86b8', 0, -1.5, 0);
  const waterTop = new THREE.Mesh(new THREE.PlaneGeometry(80, 40), new THREE.MeshPhysicalMaterial({ color: '#5aa7d8', roughness: 0.05, transparent: true, opacity: 0.6, clearcoat: 1 })); waterTop.rotation.x = -Math.PI / 2; waterTop.position.y = -1.0; bridge.add(waterTop);
  plate(bridge, 20, 40, '#6b8f4a', -40, 0, 0); plate(bridge, 20, 40, '#6b8f4a', 40, 0, 0);
  brick(bridge, 64, 4, 0.8, '#7a5a3a', 0, 5, 0); for (const x of [-24, -8, 8, 24]) brick(bridge, 1.2, 1.2, 7, '#6a4a2a', x, -1.5, 1.4, { studs: false }); for (let k = -15; k <= 15; k++) brick(bridge, 0.4, 0.4, 1.6, '#6a4a2a', k * 2, 5.8, 1.8, { studs: false });
  const boat = new THREE.Group(); bridge.add(boat); boat.position.set(2, -1.2, 6); brick(boat, 12, 5, 1.6, '#a3452a', 0, 0, 0); brick(boat, 4, 3, 2.4, '#ece6d0', -2, 1.6, 0);

  // --- helicopter cabin (x=1400)
  const cabin = SET('cabin', 1400);
  plate(cabin, 18, 10, '#3d4536', 0, 0, 0); wall(cabin, 18, 9, '#4c5a3c', '#45523a', 0, 0, -5);
  const cabWin = new THREE.Mesh(new THREE.CircleGeometry(3.2, 32), new THREE.MeshBasicMaterial({ map: winRT.texture })); cabWin.position.set(3, 5, -4.4); cabin.add(cabWin);
  brick(cabin, 7, 2.4, 1.8, '#2f3528', -4, 0, -2.5, { studs: false });
  const cabLight = new THREE.PointLight('#9fd0ff', 0, 30, 1.2); cabLight.position.set(0, 7, 4); cabin.add(cabLight);

  // --- riverside camp (x=1600)
  const camp = SET('camp', 1600);
  plate(camp, 50, 30, '#7fa556', 0, 0, 0); brick(camp, 50, 8, 0.2, '#4f97c8', 0, 0, -14, { studs: false });
  [[-14, -4, '#c8361f'], [-5, -7, '#e0a020'], [10, -6, '#1e62c8'], [18, -2, '#4caf50']].forEach(([x, z, c]) => { const t = new THREE.Mesh(new THREE.ConeGeometry(3.6, 5, 4), plastic(c)); t.position.set(x, 2.5, z); t.rotation.y = Math.PI / 4; t.castShadow = true; camp.add(t); });
  const campfire = fireSpot(camp, 2, 0.2, 1, 0.8); for (let k = 0; k < 6; k++) brick(camp, 1, 1, 0.5, '#888', 2 + Math.cos(k) * 1.6, 0, 1 + Math.sin(k) * 1.6, { studs: false });
  const campLight = new THREE.PointLight('#ffd0a0', 0, 50, 1); campLight.position.set(0, 14, 10); camp.add(campLight);

  // ================= LIGHT MOODS =================
  const MOODS = {
    day: { bg: '#b8d8ec', sun: 2.4, sunC: '#fff4e0', hemi: 0.75, env: 1.0, lamp: 0, exp: 1.0 },
    night: { bg: '#141b30', sun: 0.25, sunC: '#7f95d0', hemi: 0.22, env: 0.18, lamp: 1, exp: 1.05 },
    dark: { bg: '#07090e', sun: 0.06, sunC: '#7f95d0', hemi: 0.1, env: 0.06, lamp: 0, exp: 1.1 },
    alarm: { bg: '#141b30', sun: 0.2, sunC: '#ff6a5a', hemi: 0.3, env: 0.15, lamp: 0, exp: 1.0 },
    storm: { bg: '#3d4652', sun: 0.6, sunC: '#b8c8d8', hemi: 0.45, env: 0.4, lamp: 0, exp: 1.0 },
    dawn: { bg: '#f0b48a', sun: 1.8, sunC: '#ffc89a', hemi: 0.6, env: 0.7, lamp: 0, exp: 1.0 },
    dusk: { bg: '#5a4468', sun: 0.9, sunC: '#ff9a70', hemi: 0.4, env: 0.4, lamp: 0.6, exp: 1.0 },
  };
  function applyMood(m, setPos) {
    const M = MOODS[m] || MOODS.day;
    scene.background = new THREE.Color(M.bg); sun.intensity = M.sun; sun.color.set(M.sunC); hemi.intensity = M.hemi; scene.environmentIntensity = M.env; r.toneMappingExposure = M.exp;
    sun.position.set(setPos.x + 18, 40, 30); sun.target.position.set(setPos.x, 0, 0);
    windowScene.background = new THREE.Color(M.bg); wsun.intensity = M.sun * 0.9; wsun.color.set(M.sunC); whemi.intensity = M.hemi * 1.1; windowScene.environmentIntensity = M.env;
    const night = ['night', 'dark', 'alarm', 'dusk'].includes(m);
    mats.cityLit.emissiveIntensity = night ? 1.4 : 0.15;
    return M;
  }

  // ================= DIRECTOR =================
  const FILM = window.FILM;
  function shot(from, look, to, lookTo, p) { cam.position.lerpVectors(from, to, ease(p)); cam.lookAt(new THREE.Vector3().lerpVectors(look, lookTo, ease(p))); }
  function render3d(b, p, t, i) {
    const L = b.light || 'day';
    Object.values(sets).forEach(s => s.visible = false); heli.visible = false; rope.visible = false; rain.visible = false; flash.intensity = 0;
    all.forEach(f => pose(f, { vis: false })); torch.intensity = 0;
    [flashlight, binos, phoneP, can, choc, kidRadio, headset].forEach(o => o.visible = false);
    fires.length = 0;
    const R = C.remi;
    let setName = { studio: 'studio', window: 'studio', stairs: 'hall', door: 'hall', vending: 'hall', stairwell: 'well', roof: 'roof', tower: 'tower', street: 'street', bridge: 'bridge', heli: 'cabin', camp: 'camp' }[b.s];
    const S = sets[setName]; S.visible = true; const X = S.position.x;
    const M = applyMood(L, S.position);
    const at = (x, y, z) => v3(X + x, y, z);
    // studio state
    cabinet.visible = i >= 6; sofa.visible = i >= 24; hCabinet.visible = true; hSofa.visible = i >= 24;
    if (setName === 'studio') {
      const on = b.onair || b.a === 'onair';
      onAirMat.emissiveIntensity = on ? 1.6 + 0.3 * Math.sin(t * 3) : 0.05; onAirLight.intensity = on ? 14 : 0;
      lamp.intensity = L === 'alarm' ? (p > 0.75 ? 0 : (Math.floor(t * 4) % 2 ? 35 : 6)) : (M.lamp ? 40 : 8);
      lamp.color.set(L === 'alarm' ? '#ff3a2a' : '#ffc27a');
      consoleLights.forEach((m, k) => m.children[0].material.emissiveIntensity = on ? 0.6 + 0.6 * Math.abs(Math.sin(t * 5 + k)) : 0.15);
      const ring = (i === 0 && p > 0.15) || b.a === 'phone';
      phoneLeds.forEach((m, k) => m.children[0].material.emissiveIntensity = ring && Math.floor(t * 6 + k) % 2 ? 2.5 : 0);
      wFires.forEach(f => { f.visible = true; f.userData.tick(t); });
      wHeli.visible = b.a === 'heli_far'; if (wHeli.visible) { wHeli.position.set(lerp(-70, 50, p), 30 + Math.sin(t) * 2, -40); wHeli.userData.rotor.rotation.y = t * 30; wHeli.userData.spot.intensity = 0; wHeli.userData.beam.visible = true; }
      r.setRenderTarget(winRT); r.render(windowScene, wcam); r.setRenderTarget(null);
      const a = b.a;
      if (b.s === 'window') {
        const pp = a === 'binoculars' ? 'binoculars' : 'look'; binos.visible = a === 'binoculars';
        pose(R, { x: X + 3.2, y: 0, z: -7.4, yaw: Math.PI, p: pp, t, face: a === 'heli_far' ? 'surprised' : 'worried' });
        shot(at(6.5, 6.2, -1), at(4.5, 4.6, -8.5), at(5.8, 5.9, -2.5), at(4.5, 4.8, -8.5), p);
        return;
      }
      let pp = 'mic', face = 'smile', talk = 0;
      if (a === 'onair') { talk = 1; if (i === 0 && p > 0.25) { pp = 'surprised'; talk = 0; face = 'surprised'; } }
      if (a === 'phone') { pp = 'phone'; face = 'scared'; phoneP.visible = true; }
      if (a === 'think') { pp = 'think'; face = 'worried'; }
      if (a === 'surprised') { pp = p > 0.35 ? 'surprised' : 'mic'; face = p > 0.35 ? 'surprised' : 'smile'; talk = p < 0.35 ? 1 : 0; }
      if (a === 'listen') { pp = 'listen'; face = 'worried'; }
      if (a === 'worried') { pp = 'listen'; face = 'worried'; }
      if (a === 'cry') { pp = p > 0.35 ? 'cry' : 'listen'; face = p > 0.35 ? 'cry' : 'smile'; }
      if (a === 'alarm') { pp = p > 0.15 ? 'scared' : 'mic'; face = 'scared'; }
      const standing = !POSE[pp].sit;
      pose(R, { x: X - 0.5, y: standing ? 0 : 2.15, z: standing ? -5.6 : -6.3, yaw: 0, p: pp, t, face, talk });
      const close = ['listen', 'worried', 'cry', 'surprised', 'think', 'phone'].includes(a);
      if (i === 0) shot(at(10, 10, 22), at(-0.5, 4.5, -6), at(4, 7.5, 12), at(-0.5, 4.8, -6), p);
      else if (close) shot(at(-3.5, 6.6, 2.0), at(-0.5, 5.6, -6.3), at(-2.6, 6.3, 0.6), at(-0.5, 5.6, -6.3), p);
      else if (a === 'alarm') shot(at(-6, 8, 12), at(-0.5, 4.5, -6), at(-3, 7, 9), at(-0.5, 4.5, -6), p);
      else shot(at(-7, 8, 13), at(-0.5, 4.5, -6), at(-4, 7, 10), at(-0.5, 4.8, -6), p);
      return;
    }
    if (setName === 'hall') {
      hallLight.intensity = L === 'day' ? 40 : 6;
      sDoor.position.x = -4; sDoor.rotation.y = 0; doorDark.visible = b.s === 'stairs';
      hCabinet.position.set(-4, 0, -5); hSofa.position.set(-4, 0, -3.2);
      if (b.s === 'vending') {
        hCabinet.visible = true;
        const k = ease(seg(p, 0.15, 0.4)); choc.visible = p > 0.45;
        snacks.forEach((s, n) => s.visible = !(n < 3 && p > 0.4 + n * 0.1));
        pose(R, { x: X + 9 - 0.5, y: 0, z: -2.2, yaw: Math.PI, p: k > 0.5 ? 'reach' : 'stand', t, face: p > 0.5 ? 'happy' : 'smile' });
        shot(at(4, 7, 10), at(8, 4, -4), at(5, 6, 8), at(8.5, 4, -4), p); return;
      }
      if (b.s === 'stairs') { // peek through the door into the dark stairwell
        hCabinet.visible = false; hSofa.visible = false;
        const open = ease(seg(p, 0.15, 0.6)) * 0.9; sDoor.position.x = -4 - open * 2.5; sDoor.rotation.y = open * 0.9;
        flashlight.visible = true; torch.intensity = 140;
        pose(R, { x: X - 1.5, y: 0, z: -3.2, yaw: Math.PI + 0.5, p: 'peek', t, face: 'scared' });
        shot(at(6, 6, 8), at(-3, 4, -5), at(4, 5.5, 6.5), at(-3.5, 4, -6), p); return;
      }
      // door close-ups: barricade, scratch, sofa, hold
      const a = b.a, shake = (a === 'scratch' || a === 'hold' || (a === 'sofa' && p > 0.4)) ? Math.sin(t * 40) * (a === 'hold' ? 0.12 : 0.04) : 0;
      sDoor.position.x = -4 + shake; flashlight.visible = true; torch.intensity = 90;
      let rx = 0, pp = 'scared';
      if (a === 'barricade') { const k = ease(seg(p, 0.25, 0.75)); hCabinet.position.set(lerp(6, -4, k), 0, -5); rx = lerp(8.5, -1.5, k); pp = 'push'; hSofa.visible = false; pose(R, { x: X + rx, y: 0, z: -4.6, yaw: -Math.PI / 2, p: pp, t, walk: k > 0 && k < 1 ? 0.5 : 0, face: 'scared' }); }
      else if (a === 'sofa') { const k = ease(seg(p, 0.05, 0.45)); hSofa.position.set(lerp(10, -4, k), 0, -3.2); pose(R, { x: X + lerp(14, 0, k), y: 0, z: -2.6, yaw: -Math.PI / 2, p: 'push', t, face: 'scared' }); }
      else { pose(R, { x: X + 3.5, y: 0, z: -1, yaw: -Math.PI / 2 - 0.4, p: a === 'hold' ? 'push' : 'scared', t, face: 'scared' }); if (a === 'hold') R.root.position.x = X + 1.5; }
      shot(at(5, 6, 13), at(-3, 3.5, -5), at(3, 5.5, 11), at(-3.5, 3.8, -5), p); return;
    }
    if (setName === 'well') { // looking down the stairwell
      wellLight.intensity = 40;
      const n = b.a === 'horde' ? 14 : 4;
      for (let k = 0; k < n; k++) { const depth = 6 + (k * 7) % 40 - (b.a === 'horde' ? p * 8 : p * 2); const side = k % 4; const along = ((k * 37) % 13 - 6);
        const pos = [[along, -depth, -6.6], [7, -depth, along], [along, -depth, 6.4], [-7, -depth, along]][side];
        pose(Z[k], { x: X + pos[0], y: pos[1], z: pos[2], yaw: [0, -Math.PI / 2, Math.PI, Math.PI / 2][side], p: 'zombie', walk: 0.4, t: t + k, scale: 1.7 }); }
      shot(at(0.5, 22, 0.8), at(0, -20, 0), at(0.3, 18, 0.5), at(0, -20, 0), p); return;
    }
    if (setName === 'roof') {
      rain.visible = L === 'storm';
      const genOn = (b.a === 'fuel' && p > 0.8) || b.a === 'rescue' || b.a === 'lightup';
      lampHead.material = genOn ? glow('#fff4c0', 3) : plastic('#ddd');
      cans.forEach((c, k) => { c.visible = b.a === 'rain' || b.a === 'laugh'; const lvl = (b.a === 'laugh' ? 1 : p) * (0.5 + 0.12 * k); c.userData.water.scale.y = Math.max(0.05, lvl * 2.2); c.userData.water.position.y = lvl * 1.1; });
      let rx = 0, pp = 'stand', face = 'smile', walk = 0, yaw = 0, ry = 0;
      if (b.a === 'rain') { const k = seg(p, 0, 0.6); rx = lerp(-16, -6, k); pp = 'carry'; walk = k < 1 ? 0.7 : 0; yaw = Math.PI / 2; face = 'worried'; }
      if (b.a === 'laugh') { rx = -6; pp = 'laugh'; face = 'happy'; }
      if (b.a === 'fuel') { rx = 0.5; pp = 'pour'; face = 'worried'; yaw = Math.PI / 2; can.visible = true; }
      if (b.a === 'rescue') { rx = -1; pp = 'climb'; face = 'surprised'; ry = lerp(0, 5, ease(seg(p, 0.55, 1))); }
      pose(R, { x: X + rx, y: ry, z: 1, yaw, p: pp, walk, t, face });
      if (L === 'storm') {
        const pa = rain.geometry.attributes.position.array;
        rainSeed.forEach(([a, bb, c], k) => { const x = X - 25 + a * 50, z = -15 + c * 30, y = 30 - ((t * 25 + bb * 30) % 30); pa.set([x, y, z, x - 0.2, y - 1.2, z], k * 6); }); rain.geometry.attributes.position.needsUpdate = true;
        const f = (b.a === 'rain' && p > 0.05 && p < 0.1) || (b.a === 'laugh' && p > 0.6 && p < 0.65); flash.intensity = f ? 6 : 0;
      }
      if (b.a === 'rescue') { heli.visible = true; heli.position.set(X - 1, 22 + Math.sin(t * 2) * 0.4, 1); heli.userData.rotor.rotation.y = t * 30; heli.userData.spot.intensity = 400; heli.userData.beam.visible = true; rope.visible = true; const top = 20.5, bot = ry + 5.5; rope.scale.y = top - bot; rope.position.set(X - 1, (top + bot) / 2, 1.2); }
      const close = b.a === 'laugh' || b.a === 'fuel';
      if (b.a === 'rescue') shot(at(9, 3.5, 16), at(-1, 7, 1), at(7, 4, 14), at(-1, 10, 1), p);
      else if (close) shot(at(4, 6, 12), at(-2, 3.5, 0), at(2, 5.5, 10), at(-2, 3.8, 0), p);
      else shot(at(-4, 9, 22), at(-6, 3, 0), at(-2, 8, 19), at(-6, 3, 0), p);
      return;
    }
    if (setName === 'tower') {
      tFires.forEach(f => f.userData.tick(t));
      const lit = b.a === 'lightup' ? ease(seg(p, 0.3, 0.9)) : 1;
      towerWins.forEach(([m, th]) => m.material.emissiveIntensity = lit > th ? 2.2 : 0.02); towerGlow.intensity = 220 * lit;
      tBeacon.children[0].material.emissiveIntensity = Math.floor(t * 1.5) % 2 ? 3 : 0.3;
      heli.visible = true; heli.userData.rotor.rotation.y = t * 30; heli.userData.spot.intensity = 300; heli.userData.beam.visible = true;
      if (b.a === 'lightup') { heli.position.set(X - 70, 30, -60); heli.rotation.y = 0; }
      else { const k = ease(p); heli.position.set(X + lerp(-70, -22, k), lerp(30, 50, k), lerp(-60, -34, k)); heli.rotation.y = lerp(0, -0.9, k); }
      shot(at(30, 18, 70), at(0, 34, -30), at(22, 22, 62), at(0, 38, -30), p); return;
    }
    if (setName === 'street') {
      const zLook = b.a === 'freeze' ? ease(seg(p, 0.15, 0.4)) : b.a === 'turnaway' ? 1 - ease(seg(p, 0.35, 0.7)) : 0;
      pose(Z[0], { scale: 1, x: X + 2, y: 0, z: 0.5, yaw: lerp(Math.PI / 2, -Math.PI / 2 + 0.3, zLook), p: 'zombie', t, walk: 0.15 });
      pose(Z[1], { scale: 1, x: X + 18, y: 0, z: -1, yaw: Math.PI / 2, p: 'zombie', t: t + 1, walk: 0.15 });
      pose(Z[2], { scale: 1, x: X - 6, y: 0, z: -6, yaw: Math.PI, p: 'zombie', t: t + 2, walk: 0.1 });
      const prog = b.a === 'sneak' ? ease(seg(p, 0.1, 1)) * 0.5 : b.a === 'freeze' ? 0.5 : 0.5 + ease(seg(p, 0.6, 1)) * 0.45;
      const moving = !(b.a === 'freeze' || (b.a === 'turnaway' && p < 0.6));
      const tx = lerp(-30, 28, prog);
      pose(C.tess, { x: X + tx, y: 0, z: 5, yaw: Math.PI / 2, p: moving ? 'sneak' : 'freeze', walk: moving ? 0.5 : 0, t, face: b.a === 'freeze' ? 'scared' : 'worried' });
      pose(C.kid, { x: X + tx - 2.2, y: 0, z: 5.6, yaw: Math.PI / 2, p: moving ? 'sneak' : 'freeze', walk: moving ? 0.5 : 0, t: t + 0.4, face: 'scared' });
      const cx = lerp(-30, 28, prog) + 4;
      if (b.a === 'freeze') shot(at(cx - 2, 5, 16), at(cx - 2, 2.5, 2), at(cx - 1, 4.5, 13), at(cx - 1, 2.5, 2), p);
      else shot(at(cx - 6, 7, 22), at(cx - 4, 3, 0), at(cx - 4, 6.5, 20), at(cx - 2, 3, 0), p);
      return;
    }
    if (setName === 'bridge') {
      const k = ease(seg(p, 0, 0.7));
      pose(C.tess, { x: X + lerp(-36, -6, k), y: k < 0.15 ? 0 : 5.8, z: 0.8, yaw: Math.PI / 2, p: k < 1 ? 'stand' : 'wave', walk: k < 1 ? 0.8 : 0, t, face: 'happy' });
      pose(C.kid, { x: X + lerp(-38.5, -8.5, k), y: k < 0.15 ? 0 : 5.8, z: 0.8, yaw: Math.PI / 2, p: k < 1 ? 'stand' : 'wave', walk: k < 1 ? 0.8 : 0, t: t + 0.4, face: 'happy' });
      pose(C.s1, { x: X - 1, y: 0.4, z: 6, yaw: -0.4, p: 'wave', t, face: 'happy' }); pose(C.s2, { x: X + 5, y: 0.4, z: 6.5, yaw: -0.7, p: 'stand', t, face: 'happy' });
      boat.position.y = -1.2 + Math.sin(t * 1.5) * 0.12; waterTop.position.y = -1.0 + Math.sin(t) * 0.05;
      shot(at(-14, 10, 30), at(-6, 4, 0), at(-8, 9, 26), at(-3, 4, 0), p); return;
    }
    if (setName === 'cabin') {
      cabLight.intensity = 30; r.setRenderTarget(winRT); r.render(windowScene, wcam); r.setRenderTarget(null);
      heli.visible = false; headset.visible = true;
      pose(C.pilot, { x: X + 3, y: 0, z: 0, yaw: -Math.PI / 2 + 0.3, p: 'reach', t, face: 'happy' });
      pose(R, { x: X - 3.5, y: 0.75, z: -2.6, yaw: 0.6, p: p > 0.6 ? 'cry' : 'sit', t, face: p > 0.6 ? 'cry' : 'surprised' });
      R.root.position.y = 0.75 + Math.sin(t * 20) * 0.02;
      shot(at(0, 6, 12), at(-0.5, 4, -1), at(0, 5.5, 10), at(-0.5, 4, -1), p); return;
    }
    if (setName === 'camp') {
      campfire.userData.tick(t); campLight.intensity = 30;
      const k = ease(seg(p, 0.05, 0.55));
      kidRadio.visible = true;
      pose(R, { x: X + lerp(22, 5, k), y: 0, z: 4, yaw: -Math.PI / 2, p: k < 1 ? 'stand' : 'hug', walk: k < 1 ? 0.8 : 0, t, face: 'happy' });
      pose(C.tess, { x: X + 2.5, y: 0, z: 4, yaw: Math.PI / 2, p: k > 0.9 ? 'hug' : 'wave', t, face: 'happy' });
      pose(C.kid, { x: X + 1, y: 0, z: 5, yaw: Math.PI / 2, p: 'wave', t, face: 'happy' });
      pose(C.s1, { x: X - 8, y: 0, z: 2, yaw: 0.5, p: 'stand', t, face: 'happy' }); pose(C.s2, { x: X - 4, y: 0, z: -1, yaw: 0.3, p: 'wave', t, face: 'happy' });
      shot(at(6, 7, 22), at(3, 3, 2), at(4, 6, 18), at(3, 3.2, 2), p); return;
    }
  }

  // ================= 2D OVERLAY: cards, day cards, end card, subtitles =================
  const F = 'DejaVu Sans';
  function studs2d(bg, col) { g2.fillStyle = bg; g2.fillRect(0, 0, W, H); for (let y = 30; y < H; y += 60) for (let x = 30; x < W; x += 60) { g2.beginPath(); g2.arc(x, y, 17, 0, 7); g2.fillStyle = col; g2.fill(); g2.beginPath(); g2.arc(x - 3, y - 3, 12, 0, 7); g2.fillStyle = 'rgba(255,255,255,0.18)'; g2.fill(); } }
  function panel(x, y, w, h) { g2.fillStyle = 'rgba(0,0,0,0.25)'; g2.fillRect(x + 12, y + 14, w, h); g2.fillStyle = '#fffaf0'; g2.fillRect(x, y, w, h); g2.lineWidth = 8; g2.strokeStyle = '#1b1b1b'; g2.strokeRect(x, y, w, h); }
  function txt(s, x, y, size, { color = '#1b1b1b', align = 'center', alpha = 1, stroke = null } = {}) { g2.save(); g2.globalAlpha = alpha; g2.font = `900 ${size}px ${F}`; g2.textAlign = align; g2.textBaseline = 'middle'; if (stroke) { g2.lineWidth = size / 7; g2.strokeStyle = stroke; g2.lineJoin = 'round'; g2.strokeText(s, x, y); } g2.fillStyle = color; g2.fillText(s, x, y); g2.restore(); }
  function legoBrick2d(x, y, w, h, col) { g2.fillStyle = col; g2.fillRect(x, y, w, h); g2.strokeStyle = 'rgba(0,0,0,0.35)'; g2.lineWidth = 3; g2.strokeRect(x, y, w, h); const n = Math.max(1, Math.round(w / 34)); for (let k = 0; k < n; k++) { g2.fillStyle = col; g2.fillRect(x + (k + 0.5) * w / n - 9, y - 8, 18, 9); g2.strokeRect(x + (k + 0.5) * w / n - 9, y - 8, 18, 9); } }
  function card(b, p) {
    const k = ease(seg(p, 0.05, 0.4)), c = b.card;
    studs2d('#f2c230', '#e0b020'); panel(160, 110, 1600, 800);
    const title = { supplies: b.vals && b.vals.water > 10 ? 'SUPPLIES · DAY 2' : 'SUPPLIES · DAY 9', rules: "REMI'S RULES", fuel: 'GENERATOR', fuel2: 'FUEL · DAY 15', notes: 'FIELD NOTES', map1: '12 BLOCKS', map2: 'THE ROUTE', end: '18 DAYS' }[c];
    txt(title, W / 2, 200, 84, { color: '#c8361f' });
    if (c === 'supplies') {
      const rows = [['WATER', b.vals.water, 18, '#2f8be0', 'bottles'], ['FOOD', b.vals.food, 41, '#7a4a2a', 'snacks'], ['FUEL', b.vals.fuel, 40, '#c8361f', 'liters']];
      rows.forEach(([n, v, max, col, unit], j) => { const y = 360 + j * 170; txt(n, 300, y, 54, { align: 'left' }); g2.fillStyle = '#ddd5c4'; g2.fillRect(600, y - 34, 800, 68); const cnt = Math.round(18 * v / max * k); for (let s = 0; s < cnt; s++) legoBrick2d(604 + s * 44, y - 28, 40, 56, col); txt(`${Math.round(v * k)} ${unit}`, 1460, y, 50, { align: 'left', color: j === 0 && v < 10 ? '#c8361f' : '#1b1b1b' }); });
    }
    if (c === 'rules') ['1  One meal a day', '2  Two bottles of water', '3  No noise near the stairs'].forEach((s, j) => { const kk = ease(seg(p, 0.2 + j * 0.25, 0.35 + j * 0.25)); txt(s, 400, 380 + j * 170, 76, { align: 'left', alpha: kk }); if (kk > 0.5) txt('✓', 320, 380 + j * 170, 80, { color: '#2e9e4e' }); });
    if (c === 'fuel' || c === 'fuel2') {
      const left = c === 'fuel' ? 40 : 3, hrs = left / 2;
      g2.fillStyle = '#ddd5c4'; g2.fillRect(330, 320, 260, 480); for (let s = 0; s < Math.ceil(12 * left / 40); s++) legoBrick2d(340, 760 - s * 38, 240, 32, '#c8361f'); txt(`${left} L`, 460, 850, 64);
      txt('÷ 2 liters per hour', 760, 450, 70, { align: 'left', alpha: ease(seg(p, 0.25, 0.4)) });
      txt(`= ${hrs} ${hrs === 1 ? 'hour' : 'hours'} of power`, 760, 600, 82, { align: 'left', color: '#c8361f', alpha: ease(seg(p, 0.45, 0.6)) });
      if (c === 'fuel2') txt('one last broadcast', 760, 740, 58, { align: 'left', alpha: ease(seg(p, 0.65, 0.8)) });
    }
    if (c === 'notes') ['Follow noise + light', 'Avoid the cold river wind', 'Slowest just after sunrise'].forEach((s, j) => { const kk = ease(seg(p, 0.1 + j * 0.3, 0.3 + j * 0.3)); legoBrick2d(300, 345 + j * 170, 60, 60, ['#2f8be0', '#2e9e4e', '#f2c230'][j]); txt(s, 420, 375 + j * 170, 70, { align: 'left', alpha: kk }); });
    if (c === 'map1' || c === 'map2') {
      const ox = 300, oy = 290; g2.fillStyle = '#7fae5a'; g2.fillRect(ox, oy, 1320, 570);
      g2.fillStyle = '#4f97c8'; g2.beginPath(); g2.moveTo(ox, oy + 470); g2.lineTo(ox + 400, oy + 440); g2.lineTo(ox + 900, oy + 500); g2.lineTo(ox + 1320, oy + 450); g2.lineTo(ox + 1320, oy + 570); g2.lineTo(ox, oy + 570); g2.fill(); txt('RIVER', ox + 1150, oy + 520, 40, { color: '#fff' });
      for (let rr = 0; rr < 4; rr++) for (let q = 0; q < 9; q++) legoBrick2d(ox + 40 + q * 142, oy + 40 + rr * 100, 110, 66, ['#b0a898', '#c9c0ae', '#9e968a'][(rr + q) % 3]);
      legoBrick2d(ox + 1180, oy + 30, 60, 90, '#c8361f'); txt('TOWER', ox + 1210, oy + 150, 34, { color: '#fff', stroke: '#000' });
      legoBrick2d(ox + 60, oy + 330, 70, 70, '#e8f0e8'); txt('+', ox + 95, oy + 365, 60, { color: '#2e9e4e' }); txt('PHARMACY', ox + 95, oy + 430, 32, { color: '#fff', stroke: '#000' });
      g2.save(); g2.lineWidth = 12; g2.lineCap = 'round';
      if (c === 'map1') { g2.setLineDash([24, 20]); g2.strokeStyle = '#1b1b1b'; g2.beginPath(); g2.moveTo(ox + 130, oy + 340); g2.lineTo(ox + 650, oy + 200); g2.lineTo(ox + 1180, oy + 80); g2.stroke(); for (let z = 0; z < 12; z++) { g2.fillStyle = '#9fbf7f'; g2.beginPath(); g2.arc(ox + 300 + (z * 97) % 800, oy + 120 + (z * 53) % 260, 16, 0, 7); g2.fill(); } }
      else { const pts = [[ox + 95, oy + 400], [ox + 160, oy + 455], [ox + 500, oy + 430], [ox + 860, oy + 480], [ox + 1040, oy + 455]]; const n = Math.max(2, Math.ceil(pts.length * ease(seg(p, 0.15, 0.8)))); g2.strokeStyle = '#c8361f'; g2.beginPath(); pts.slice(0, n).forEach(([x, y], j) => j ? g2.lineTo(x, y) : g2.moveTo(x, y)); g2.stroke(); txt('SUNRISE', ox + 320, oy + 520, 36, { color: '#fff', stroke: '#000' }); txt('← WIND', ox + 760, oy + 395, 36, { color: '#fff', stroke: '#000' }); legoBrick2d(ox + 1020, oy + 470, 90, 40, '#a3452a'); txt('BOAT', ox + 1065, oy + 545, 32, { color: '#fff', stroke: '#000' }); }
      g2.restore();
    }
    if (c === 'end') [['0', 'fights'], ['18', 'nights on air'], ['2', 'kids guided home'], ['1', 'light in the dark']].forEach(([n, l], j) => { const kk = ease(seg(p, 0.08 + j * 0.18, 0.2 + j * 0.18)); const x = 560 + (j % 2) * 800, y = 400 + Math.floor(j / 2) * 270; txt(n, x, y, 140, { color: '#c8361f', alpha: kk }); txt(l, x, y + 105, 52, { alpha: kk }); });
  }
  function subtitles(b, t) {
    if (!b.t) return;
    const tail = b.s === 'card' ? 0.9 : 0.55, vStart = b.start + 0.25, vLen = Math.max(0.5, b.dur - 0.25 - tail);
    // split into sentence chunks, each shown for a share of the line proportional to its length
    const parts = b.t.match(/[^.!?…]+[.!?…]*\s*/g).map(s => s.trim()).filter(Boolean);
    const chunks = []; let cur = '';
    parts.forEach(s => { if ((cur + ' ' + s).trim().length > 70 && cur) { chunks.push(cur.trim()); cur = s; } else cur = (cur + ' ' + s).trim(); }); if (cur) chunks.push(cur);
    const tot = chunks.reduce((a, s) => a + s.length, 0); let acc = 0, show = null;
    for (const s of chunks) { const a = vStart + acc / tot * vLen; acc += s.length; const z = vStart + acc / tot * vLen; if (t >= a - 0.05 && t < z + (s === chunks[chunks.length - 1] ? tail : 0)) { show = s; break; } }
    if (!show) return;
    g2.save(); g2.font = `800 50px ${F}`; g2.textAlign = 'center'; g2.textBaseline = 'middle';
    const words = show.split(' '), lines = []; let ln = '';
    words.forEach(w => { if (g2.measureText(ln + ' ' + w).width > 1500 && ln) { lines.push(ln); ln = w; } else ln = (ln + ' ' + w).trim(); }); lines.push(ln);
    lines.forEach((l, j) => { const y = H - 70 - (lines.length - 1 - j) * 62; g2.lineWidth = 9; g2.lineJoin = 'round'; g2.strokeStyle = '#000'; g2.strokeText(l, W / 2, y); g2.fillStyle = '#fff'; g2.fillText(l, W / 2, y); });
    g2.restore();
  }

  function render(t) {
    const i = Math.max(0, FILM.beats.findIndex(b => t < b.start + b.dur));
    const b = FILM.beats[i] || FILM.beats[FILM.beats.length - 1];
    const p = clamp((t - b.start) / b.dur);
    g2.setTransform(1, 0, 0, 1, 0, 0); g2.clearRect(0, 0, W, H);
    const flat = ['card', 'daycard', 'endcard'].includes(b.s);
    canvas3d.style.visibility = flat ? 'hidden' : 'visible';
    if (!flat) render3d(b, p, t, i), r.render(scene, cam);
    if (b.s === 'card') card(b, p);
    if (b.s === 'daycard') { g2.fillStyle = '#101114'; g2.fillRect(0, 0, W, H); const k = ease(seg(p, 0, 0.25)); txt(b.day, W / 2, H / 2, 190, { color: '#f2c230', stroke: '#c8361f', alpha: k }); }
    if (b.s === 'endcard') { studs2d('#1e62c8', '#1a55ad'); txt('18 DAYS IN THE', W / 2, H / 2 - 150, 100, { color: '#fff', stroke: '#000', alpha: ease(seg(p, 0, 0.3)) }); txt('RADIO TOWER', W / 2, H / 2 - 20, 150, { color: '#f2c230', stroke: '#c8361f', alpha: ease(seg(p, 0, 0.3)) }); txt('Thanks for listening.', W / 2, H / 2 + 150, 64, { color: '#fff', stroke: '#000', alpha: ease(seg(p, 0.25, 0.5)) }); }
    if (b.title && p < 0.85) { const k = Math.min(seg(p, 0.02, 0.12), 1 - seg(p, 0.7, 0.85)); txt(b.title.slice(0, Math.floor(b.title.length * seg(p, 0.02, 0.2))), 80, 80, 60, { align: 'left', color: '#f2c230', stroke: '#000', alpha: k }); }
    subtitles(b, t);
    // short dips to black between different scenes
    const prev = FILM.beats[i - 1], next = FILM.beats[i + 1]; let fade = 0;
    if (prev && prev.s !== b.s) fade = Math.max(fade, 1 - clamp((t - b.start) / 0.25));
    if (next && next.s !== b.s) fade = Math.max(fade, clamp((t - (b.start + b.dur - 0.25)) / 0.25));
    if (t < 0.6) fade = 1 - t / 0.6;
    if (fade > 0) { g2.fillStyle = `rgba(8,8,10,${fade})`; g2.fillRect(0, 0, W, H); }
  }
  return { render };
}
window.BrickFilm = { create };
