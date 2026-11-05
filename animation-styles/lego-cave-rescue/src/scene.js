// "Trapped 148 ft Under" — a 60 s toy-brick retelling of a cave-rescue story, told on a brick
// cut-away diorama (surface, flooded shaft, long tunnel, hidden air chamber).
// Bundled to ../assets/scene.js and driven by the HyperFrames timeline via LegoFilm.render(t).
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

const W = 1080, H = 1920, DUR = 60;
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, k) => a + (b - a) * k;
const ease = k => k * k * (3 - 2 * k);
const seg = (t, a, b) => clamp((t - a) / (b - a));
let seed = 4242; const rand = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };

// ---------- cave geometry (1 unit = 1 brick)
const SHAFT = [8, 13], SURF = 0;
const floorY = x => -31 + 1.5 * Math.sin(x * 0.25);
const TUN = [-26, 13], TUN_H = 5;
const CH = { x0: -42, x1: -26, y0: -33, y1: -17, water: -27 };
const LEDGE = { x1: -36, top: -26 };
function isCave(x, y) { // x,y = cell centre
  if (x > SHAFT[0] && x < SHAFT[1] && y < SURF && y > -31.5) return true;
  if (x > TUN[0] - 1 && x < TUN[1] && y > floorY(x) && y < floorY(x) + TUN_H) return true;
  if (x > CH.x0 && x < CH.x1 && y > CH.y0 && y < CH.y1) {
    const r = Math.hypot((x - (CH.x0 + CH.x1) / 2) / 8.5, (y - (CH.y0 + CH.y1) / 2) / 8.2);
    if (r > 1) return false;
    if (x < LEDGE.x1 && y < LEDGE.top) return false; // dry ledge
    return true;
  }
  return false;
}
const waterAt = (x, y) => isCave(x, y) && (x > CH.x1 - 1 ? true : y < CH.water);

export function create(canvas, ui) {
  const r = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true });
  r.setPixelRatio(1); r.setSize(W, H, false);
  r.shadowMap.enabled = true; r.shadowMap.type = THREE.PCFSoftShadowMap;
  r.toneMapping = THREE.ACESFilmicToneMapping;
  const scene = new THREE.Scene();
  scene.environment = new THREE.PMREMGenerator(r).fromScene(new RoomEnvironment(), 0.04).texture;
  const cam = new THREE.PerspectiveCamera(40, W / H, 0.1, 400);

  const sun = new THREE.DirectionalLight('#fff4e0', 2.6); sun.position.set(20, 40, 40);
  sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); sun.shadow.bias = -0.0008;
  Object.assign(sun.shadow.camera, { left: -30, right: 30, top: 20, bottom: -20, near: 1, far: 120 });
  sun.target.position.set(10, 0, 0); scene.add(sun, sun.target);
  const hemi = new THREE.HemisphereLight('#ffffff', '#55606a', 0.7); scene.add(hemi);

  const mats = {};
  const plastic = (c, o = {}) => mats[c + JSON.stringify(o)] ??= new THREE.MeshPhysicalMaterial({ color: c, roughness: 0.28, clearcoat: 0.5, clearcoatRoughness: 0.25, ...o });
  const stud = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 18);

  // ---------- rock diorama (instanced bricks, running bond)
  const X0 = -48, X1 = 26, Y0 = -52, DEPTH = 4;
  const rockGeo = new THREE.BoxGeometry(1, 1, 1);
  const rock = new THREE.InstancedMesh(rockGeo, new THREE.MeshStandardMaterial({ roughness: 0.45, metalness: 0 }), 9000);
  const back = new THREE.InstancedMesh(rockGeo, new THREE.MeshStandardMaterial({ roughness: 0.6 }), 3000);
  rock.receiveShadow = true; rock.castShadow = true;
  const m4 = new THREE.Matrix4(), col = new THREE.Color(), q = new THREE.Quaternion(), sc = new THREE.Vector3(), ps = new THREE.Vector3();
  let nr = 0, nb = 0;
  const rockCol = (x, y, edge) => {
    if (y > -1) return col.set(rand() > .5 ? '#4caf50' : '#43a047');
    if (y > -3) return col.set(rand() > .5 ? '#7a5230' : '#6d4a2b');
    if (edge && rand() > 0.55) return col.set(rand() > .5 ? '#5f8f3a' : '#6e9e45'); // moss
    const g = ['#4a4e55', '#3f434a', '#565a61', '#5b5246', '#4d463d'][Math.floor(rand() * 5)]; return col.set(g);
  };
  const nearCave = (x, y) => isCave(x + 1, y) || isCave(x - 1, y) || isCave(x, y + 1) || isCave(x, y - 1);
  for (let y = Y0; y < 0; y++) {
    const off = (y & 1);
    for (let x = X0 + off; x < X1; x += 2) {
      const a = !isCave(x + 0.5, y + 0.5), b = !isCave(x + 1.5, y + 0.5) && x + 1 < X1;
      const put = (cx, w, e) => { ps.set(cx, y + 0.5, 0); sc.set(w - 0.06, 0.94, DEPTH); m4.compose(ps, q, sc); rock.setMatrixAt(nr, m4); rock.setColorAt(nr++, rockCol(cx, y, e)); };
      if (a && b) put(x + 1, 2, nearCave(x + 0.5, y + 0.5) || nearCave(x + 1.5, y + 0.5));
      else { if (a) put(x + 0.5, 1, true); if (b) put(x + 1.5, 1, true); }
      for (const [cx, ok] of [[x + 0.5, !a], [x + 1.5, !b && x + 1 < X1]]) if (ok) {
        ps.set(cx, y + 0.5, -DEPTH / 2 - 0.25); sc.set(0.94, 0.94, 0.5); m4.compose(ps, q, sc); back.setMatrixAt(nb, m4);
        back.setColorAt(nb++, col.set(['#2c3036', '#30343a', '#353129'][Math.floor(rand() * 3)]));
      }
    }
  }
  rock.count = nr; back.count = nb; scene.add(rock, back);
  // grass studs on the surface
  const studs = new THREE.InstancedMesh(stud, plastic('#4caf50'), 400); let ns = 0;
  for (let x = X0; x < X1; x++) for (const z of [-1.5, -0.5, 0.5, 1.5]) if (!(x + 0.5 > SHAFT[0] && x + 0.5 < SHAFT[1])) { m4.makeTranslation(x + 0.5, 0.1, z); studs.setMatrixAt(ns++, m4); }
  studs.count = ns; scene.add(studs);
  // land behind the diorama for surface shots
  const land = new THREE.Mesh(new THREE.BoxGeometry(X1 - X0 + 80, 0.6, 80), plastic('#5cb85c')); land.position.set((X0 + X1) / 2, -0.3, -42); land.receiveShadow = true; scene.add(land);
  for (const [x, z, s, c] of [[-10, -60, 22, '#5aa845'], [20, -66, 26, '#6fb556'], [45, -58, 18, '#4f9a3c'], [-35, -62, 20, '#63ad4d']]) {
    const hill = new THREE.Mesh(new THREE.SphereGeometry(s, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), plastic(c, { roughness: 0.9, clearcoat: 0 })); hill.scale.y = 0.4; hill.position.set(x, 0, z); scene.add(hill);
  }
  function brick(w, d, h, c, x, y, z, studsOn = true, parent = scene) {
    const g = new THREE.Group(), mt = plastic(c);
    const b = new THREE.Mesh(new THREE.BoxGeometry(w - 0.04, h - 0.04, d - 0.04), mt); b.castShadow = b.receiveShadow = true; g.add(b);
    if (studsOn) for (let i = 0; i < w; i++) for (let j = 0; j < d; j++) { const s = new THREE.Mesh(stud, mt); s.position.set(i - (w - 1) / 2, h / 2 + 0.1, j - (d - 1) / 2); g.add(s); }
    g.position.set(x, y + h / 2, z); parent.add(g); return g;
  }
  const tree = (x, z, s = 1) => { brick(1, 1, 3 * s, '#6b3e26', x, 0, z, false); brick(4, 4, 1.2, '#2e7d32', x, 3 * s, z); brick(3, 3, 1.2, '#388e3c', x, 3 * s + 1.2, z); brick(1, 1, 1, '#43a047', x, 3 * s + 2.4, z); };
  [[-6, -1, 1.2], [1, -4, 1], [-15, -6, 1.3], [22, -3, 1.1], [4, -12, 1.4], [-24, -2, 1]].forEach(a => tree(...a));
  brick(3, 2, 1, '#9e9e9e', 18.5, 0, -1, true); // rock
  // navy truck
  const truck = new THREE.Group(); scene.add(truck); truck.position.set(21, 0, -7);
  brick(6, 3, 2, '#37474f', 0, 0.6, 0, false, truck); brick(2, 3, 1.6, '#455a64', 3.5, 0.6, 0, true, truck);
  for (const [x, z] of [[-2, 1.6], [2.6, 1.6], [-2, -1.6], [2.6, -1.6]]) { const w = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 0.5, 20), plastic('#111')); w.rotation.x = Math.PI / 2; w.position.set(x, 0.6, z); truck.add(w); }

  // ---------- water volumes (translucent extrusions of the cave outline)
  const waterMat = new THREE.MeshPhysicalMaterial({ color: '#1e88e5', roughness: 0.1, transparent: true, opacity: 0.38, depthWrite: false, clearcoat: 1 });
  const ext = (shape, zf = 1.9, zb = -1.9) => { const g = new THREE.ExtrudeGeometry(shape, { depth: zf - zb, bevelEnabled: false, curveSegments: 24 }); g.translate(0, 0, zb); const m = new THREE.Mesh(g, waterMat); m.renderOrder = 2; scene.add(m); return m; };
  const sh = new THREE.Shape(); sh.moveTo(SHAFT[0], -27); sh.lineTo(SHAFT[1], -27); sh.lineTo(SHAFT[1], -0.35); sh.lineTo(SHAFT[0], -0.35); ext(sh);
  const tu = new THREE.Shape(); tu.moveTo(TUN[1], floorY(TUN[1])); for (let x = TUN[1]; x >= TUN[0] - 1; x -= 0.5) tu.lineTo(x, floorY(x)); for (let x = TUN[0] - 1; x <= TUN[1]; x += 0.5) tu.lineTo(x, Math.min(floorY(x) + TUN_H, x > SHAFT[0] ? -26.9 : 99)); ext(tu);
  const cw = new THREE.Shape(); const cx0 = (CH.x0 + CH.x1) / 2, cy0 = (CH.y0 + CH.y1) / 2;
  cw.moveTo(LEDGE.x1, CH.water); for (let a = 0; a <= 1; a += 0.02) { const ang = -Math.PI * 0.12 - a * (Math.PI * 0.85); const px = cx0 + Math.cos(ang) * 8.5, py = cy0 + Math.sin(ang) * 8.2; cw.lineTo(Math.max(LEDGE.x1, px), Math.min(CH.water, py)); }
  cw.lineTo(CH.x1 + 0.5, CH.water); ext(cw);
  const pondTop = new THREE.Mesh(new THREE.BoxGeometry(SHAFT[1] - SHAFT[0], 0.3, 4), new THREE.MeshPhysicalMaterial({ color: '#2196f3', roughness: 0.05, transparent: true, opacity: 0.8, clearcoat: 1 }));
  pondTop.position.set((SHAFT[0] + SHAFT[1]) / 2, -0.4, 0); scene.add(pondTop);
  const chamberSurf = new THREE.Mesh(new THREE.BoxGeometry(CH.x1 - LEDGE.x1 + 1, 0.12, 3.8), new THREE.MeshPhysicalMaterial({ color: '#4fc3f7', roughness: 0.02, transparent: true, opacity: 0.55, clearcoat: 1, emissive: '#0d47a1', emissiveIntensity: 0.2 }));
  chamberSurf.position.set((CH.x1 + LEDGE.x1) / 2, CH.water, 0); scene.add(chamberSurf);
  // river streaks in the chamber + current streaks in the tunnel
  const streakMat = new THREE.MeshBasicMaterial({ color: '#bfe9ff', transparent: true, opacity: 0.5, depthWrite: false });
  const streaks = []; for (let i = 0; i < 30; i++) { const s = new THREE.Mesh(new THREE.BoxGeometry(1.6 + rand() * 2, 0.05, 0.05), streakMat); scene.add(s); streaks.push([s, rand(), rand(), rand()]); }

  // ---------- labels (canvas sprites)
  function label(text, color = '#ffd400', w = 256) {
    const c = document.createElement('canvas'); c.width = w; c.height = 96; const g = c.getContext('2d');
    g.font = '900 64px DejaVu Sans, sans-serif'; g.textAlign = 'center'; g.lineWidth = 10; g.strokeStyle = '#000'; g.strokeText(text, w / 2, 70); g.fillStyle = color; g.fillText(text, w / 2, 70);
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(c), depthTest: false, transparent: true })); s.scale.set(w / 64 * 0.55, 0.82, 1); s.renderOrder = 10; scene.add(s); return s;
  }
  const L148 = label('148 ft'); L148.scale.set(5, 1.9, 1); L148.position.set(10.5, -10, 2.5);
  const depthBar = new THREE.Mesh(new THREE.BoxGeometry(0.15, 31, 0.15), new THREE.MeshBasicMaterial({ color: '#ffd400' })); depthBar.position.set(14, -15.5, 2.2); scene.add(depthBar);
  const L164 = label('164 ft'); L164.position.set(-2, floorY(-2) + 1.9, 2.6);
  const L262 = label('262 ft'); L262.position.set(-17.6, floorY(-17.6) + 2.0, 2.6);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(1.4, 0.09, 8, 48), new THREE.MeshBasicMaterial({ color: '#ffd400', depthTest: false })); ring.renderOrder = 11; scene.add(ring);
  const marker = new THREE.PointLight('#ffefc0', 0, 8, 1.2); scene.add(marker);

  // ---------- minifigs
  const yellow = plastic('#ffd500'), black = new THREE.MeshBasicMaterial({ color: '#111' });
  const mk = (geo, mat, x, y, z, p) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.castShadow = true; p.add(m); return m; };
  function fig({ shirt, pants, hat = null, cap = null, tank = null, mask = false, fins = false, lamp = false, face = 'smile' }) {
    const root = new THREE.Group(), body = new THREE.Group(); root.add(body); body.position.y = 1.6; scene.add(root);
    const o = -1.6, P = plastic(pants), S = plastic(shirt);
    mk(new THREE.BoxGeometry(1.1, 0.3, 0.6), P, 0, 1.35 + o, 0, body);
    const legs = [-0.28, 0.28].map(x => { const p = new THREE.Group(); p.position.set(x, 1.3 + o, 0); body.add(p); mk(new THREE.BoxGeometry(0.52, 1.2, 0.6), P, 0, -0.6, 0, p); mk(new THREE.BoxGeometry(0.52, 0.2, 0.75), P, 0, -1.2, 0.07, p); if (fins) mk(new THREE.BoxGeometry(0.5, 0.06, 1.3), plastic('#111'), 0, -1.28, 0.6, p); return p; });
    const tg = new THREE.CylinderGeometry(0.42, 0.62, 1.25, 4, 1); tg.rotateY(Math.PI / 4); tg.scale(1.2, 1, 0.62); mk(tg, S, 0, 2.12 + o, 0, body);
    mk(new THREE.CylinderGeometry(0.22, 0.22, 0.15, 14), yellow, 0, 2.82 + o, 0, body);
    const head = new THREE.Group(); head.position.set(0, 3.2 + o, 0); body.add(head);
    mk(new THREE.CylinderGeometry(0.4, 0.4, 0.7, 24), yellow, 0, 0, 0, head);
    for (const x of [-0.14, 0.14]) mk(new THREE.SphereGeometry(0.055, 10, 8), black, x, 0.08, 0.38, head);
    const mouth = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.025, 6, 16, Math.PI), black); mouth.rotation.z = face === 'smile' ? Math.PI : 0; mouth.position.set(0, face === 'smile' ? -0.08 : -0.2, 0.39); head.add(mouth);
    if (hat) { mk(new THREE.CylinderGeometry(0.44, 0.44, 0.3, 24), plastic(hat), 0, 0.48, 0, head); mk(new THREE.BoxGeometry(0.8, 0.06, 0.4), plastic(hat), 0, 0.36, 0.4, head); }
    if (cap) { mk(new THREE.CylinderGeometry(0.46, 0.42, 0.25, 24), plastic(cap), 0, 0.46, 0, head); mk(new THREE.CylinderGeometry(0.5, 0.5, 0.06, 24), plastic('#111'), 0, 0.36, 0.05, head); }
    if (mask) { mk(new THREE.BoxGeometry(0.62, 0.3, 0.12), new THREE.MeshPhysicalMaterial({ color: '#9be7ff', transparent: true, opacity: 0.6, roughness: 0 }), 0, 0.1, 0.42, head); mk(new THREE.TorusGeometry(0.41, 0.05, 6, 24), plastic('#222'), 0, 0.1, 0, head).rotation.x = Math.PI / 2; }
    let beam = null, spot = null;
    if (lamp) {
      mk(new THREE.CylinderGeometry(0.12, 0.12, 0.25, 12), plastic('#eee'), 0, 0.45, 0.3, head).rotation.x = Math.PI / 2;
      spot = new THREE.SpotLight('#fff3d6', 0, 26, 0.38, 0.6, 1.3); spot.position.set(0, 0.45, 0.4); head.add(spot);
      const tgt = new THREE.Object3D(); tgt.position.set(0, 0.45, 10); head.add(tgt); spot.target = tgt;
      const bg = new THREE.ConeGeometry(2.6, 11, 24, 1, true); bg.translate(0, -5.5, 0); bg.rotateX(-Math.PI / 2);
      beam = new THREE.Mesh(bg, new THREE.MeshBasicMaterial({ color: '#fff6d8', transparent: true, opacity: 0.12, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }));
      beam.position.set(0, 0.45, 0.4); head.add(beam);
    }
    if (tank) { mk(new THREE.CylinderGeometry(0.3, 0.3, 1.2, 16), plastic(tank), 0, 2.15 + o, -0.62, body); mk(new THREE.CylinderGeometry(0.1, 0.1, 0.25, 8), plastic('#888'), 0, 2.85 + o, -0.62, body); }
    const arm = s => { const p = new THREE.Group(); p.position.set(s * 0.66, 2.62 + o, 0); body.add(p); const a = mk(new THREE.CylinderGeometry(0.15, 0.17, 0.95, 12), S, 0, -0.42, 0.05, p); a.rotation.z = s * 0.18;
      const hand = new THREE.Group(); hand.position.set(s * 0.1, -0.95, 0.12); p.add(hand); mk(new THREE.TorusGeometry(0.13, 0.07, 8, 16), yellow, 0, 0, 0, hand).rotation.y = Math.PI / 2; return { p, hand }; };
    const armR = arm(1), armL = arm(-1);
    return { root, body, legs, head, armR, armL, beam, spot };
  }
  function pose(f, { x, y, z = 0, mode = 'stand', dir = 1, t = 0, yaw = null, pitch = 0, vis = true, light = 0 }) {
    f.root.visible = vis; if (!vis) { if (f.spot) f.spot.intensity = 0; return; }
    f.root.position.set(x, y, z);
    f.root.rotation.y = yaw !== null ? yaw : (mode === 'stand' || mode === 'sit' ? 0 : dir * Math.PI / 2);
    f.body.rotation.set(0, 0, 0); f.body.position.y = 1.6;
    let la = 0, ra = 0, lg = 0;
    if (mode === 'walk') { lg = Math.sin(t * 10) * 0.6; la = lg * 0.7; ra = -lg * 0.7; f.root.position.y += Math.abs(Math.sin(t * 10)) * 0.1; }
    if (mode === 'swim') { f.body.rotation.x = Math.PI / 2 * 0.9 + pitch; lg = Math.sin(t * 9) * 0.4; la = 0.25; ra = 0.25; }
    if (mode === 'tread') { lg = Math.sin(t * 6) * 0.5; la = -1.3 + Math.sin(t * 6) * 0.4; ra = -1.3 - Math.sin(t * 6) * 0.4; }
    if (mode === 'sit') { f.body.position.y = 0.45; f.legs.forEach(l => l.rotation.x = -1.45); la = -1.0; ra = -1.0; f.body.rotation.x = 0.35; f.head.rotation.x = 0.35; }
    if (mode === 'jump') { f.body.rotation.x = Math.PI * 0.5 * clamp(t); la = -2.8; ra = -2.8; }
    if (mode !== 'sit') { f.legs[0].rotation.x = lg; f.legs[1].rotation.x = -lg; f.head.rotation.x = mode === 'swim' ? -1.15 : 0; }
    f.armL.p.rotation.x = la; f.armR.p.rotation.x = ra;
    if (f.spot) { f.spot.intensity = light * 90; f.beam.visible = light > 0.05; f.beam.material.opacity = 0.13 * light; }
  }
  const valdez = fig({ shirt: '#e65100', pants: '#bf360c', mask: true, fins: true, tank: '#9e9e9e' });
  const spear = new THREE.Group(); valdez.armR.hand.add(spear);
  mk(new THREE.CylinderGeometry(0.05, 0.05, 3.4, 8), plastic('#cfd8dc'), 0, 0.6, 0, spear); mk(new THREE.ConeGeometry(0.14, 0.5, 8), plastic('#90a4ae'), 0, 2.5, 0, spear);
  spear.rotation.x = Math.PI / 2;
  const navyBoss = fig({ shirt: '#0d2a5c', pants: '#0d2a5c', cap: '#ffffff' });
  const navyDivers = [0, 1, 2].map(() => fig({ shirt: '#1b1b1b', pants: '#1b1b1b', tank: '#1565c0', mask: true, fins: true, lamp: true }));
  const gus = fig({ shirt: '#b0bec5', pants: '#78909c', tank: '#29b6f6', mask: true, fins: true, lamp: true });
  const rossi = fig({ shirt: '#7e57c2', pants: '#5e35b1', tank: '#29b6f6' });
  // fish
  const fish = new THREE.Group(); scene.add(fish);
  const fb = new THREE.Mesh(new THREE.SphereGeometry(0.9, 20, 14), plastic('#cfd8dc', { metalness: 0.3 })); fb.scale.set(1.2, 0.55, 0.4); fish.add(fb);
  const ft = new THREE.Mesh(new THREE.ConeGeometry(0.5, 0.8, 4), plastic('#b0bec5')); ft.rotation.z = -Math.PI / 2; ft.position.x = 1.35; ft.scale.z = .3; fish.add(ft);
  mk(new THREE.SphereGeometry(0.09, 8, 6), black, -0.75, 0.12, 0.3, fish);
  // evidence props
  const spearProp = new THREE.Group(); scene.add(spearProp); mk(new THREE.CylinderGeometry(0.05, 0.05, 3.4, 8), plastic('#cfd8dc'), 0, 0, 0, spearProp).rotation.z = Math.PI / 2 - 0.08; spearProp.position.set(-2, floorY(-2) + 0.2, 0.5);
  const tankProp = new THREE.Group(); scene.add(tankProp); mk(new THREE.CylinderGeometry(0.32, 0.32, 1.5, 16), plastic('#fdd835'), 0, 0, 0, tankProp).rotation.z = Math.PI / 2; tankProp.position.set(-18.5, floorY(-18.5) + 0.35, 0.3);
  const bagProp = brick(1, 1, 0.8, '#6d4c41', -16.6, floorY(-16.6), 0.6, false);
  const battery = new THREE.Group(); scene.add(battery); mk(new THREE.CylinderGeometry(0.16, 0.16, 0.6, 12), plastic('#fdd835'), 0, 0, 0, battery).rotation.z = 1.2; battery.position.set(-22, floorY(-22) + 0.2, 0.5);
  // safety line from Rossi to Gus
  const ropeGeo = new THREE.BufferGeometry(); ropeGeo.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(3 * 40), 3));
  const rope = new THREE.Line(ropeGeo, new THREE.LineBasicMaterial({ color: '#ffeb3b' })); rope.frustumCulled = false; scene.add(rope);
  // bubbles
  const bubbleMat = new THREE.MeshPhysicalMaterial({ color: '#e3f6ff', transparent: true, opacity: 0.7, roughness: 0, clearcoat: 1 });
  const bubbles = []; for (let i = 0; i < 40; i++) { const b = new THREE.Mesh(new THREE.SphereGeometry(0.1 + rand() * 0.12, 10, 8), bubbleMat); scene.add(b); bubbles.push([b, rand(), rand()]); }
  const splashes = []; for (let i = 0; i < 16; i++) { const d = new THREE.Mesh(new THREE.SphereGeometry(0.14, 8, 6), bubbleMat); scene.add(d); splashes.push([d, rand() * Math.PI, 2 + rand() * 3, 3 + rand() * 3]); }
  const valdezGlow = new THREE.PointLight('#7fa8ff', 0, 10, 1.4); scene.add(valdezGlow);

  // ---------- story data
  const tunnelY = x => floorY(x) + 2.4;
  const CAPS = [
    [0.2, 2.8, 'A fisherman was trapped 148 ft under water…'], [2.8, 5, '…for 15 whole days.'],
    [5, 8, 'It all started with one big fish.'], [8, 11, 'He chased it deep into a flooded cave.'],
    [11, 14, 'Then, by pure luck, he popped up in a hidden air pocket.'], [14, 17, 'Dry rock above the water kept him out of the cold.'],
    [17, 19, 'But there was no food. No light.'], [19, 21, 'All he could do was wait… and hope.'],
    [21.4, 24, 'Up on the surface, a Navy team finally arrived.'], [24, 27, 'Three cave divers went straight in.'],
    [27, 30, '164 ft into the tunnel…'], [30, 33, '…they found his fishing spear. He came this way!'],
    [33.4, 35.2, 'Two more days, 230 ft deeper: nothing.'], [35.2, 37, 'The Navy called it off. The town refused to quit.'],
    [37.4, 39.2, 'Two expert cave divers were called in.'], [39.2, 41, 'Gus dives. Rossi holds the line.'],
    [41, 44, '262 ft in: an empty air tank and a fishing bag.'], [44, 48, 'Low on air and exhausted, Gus has to turn back.'],
    [48.4, 50.6, 'Next day, he finds a flashlight battery.'], [50.6, 53, 'Then a strong current hits him. He swims up…'],
    [53, 55.6, '…and breaks into a huge air chamber.'], [55.6, 57.4, 'Could Valdez still be alive?'], [57.4, 59.2, 'Gus shouts into the dark…'],
  ];
  const CARDS = [[21, 24, 'JULY 29 · DAY 6'], [33, 35.5, 'JULY 30'], [37, 39.5, 'AUG 6'], [48, 50.5, 'AUG 7']];
  const KEYW = /(148 ft|15 whole days|big fish|air pocket|no food|No light|Navy|164 ft|spear|230 ft|nothing|262 ft|empty air tank|fishing bag|turn back|battery|current|huge air chamber|still be alive\?)/g;
  let lastCap = null;
  const v3 = (x, y, z) => new THREE.Vector3(x, y, z);
  // shots: [start, end, ambience(0 cave .. 1 day), camFrom, lookFrom, camTo, lookTo]
  const SHOTS = [
    [0, 5, 0.75, v3(12, -6, 46), v3(11, -10, 0), v3(-27, -22, 58), v3(-27, -24, 0)],
    [5, 11, 0.12, v3(8, -26, 17), v3(8, -28.5, 0), v3(-20, -25, 17), v3(-20, -28.5, 0)],
    [11, 17, 0.1, v3(-31, -24, 15), v3(-31, -26.5, 0), v3(-35, -23.5, 13), v3(-36, -25.5, 0)],
    [17, 21, 0.03, v3(-37, -23.5, 9), v3(-37.5, -25, 0), v3(-37, -23.8, 7.5), v3(-37.5, -25.2, 0)],
    [21, 27, 1, v3(16, 4.5, 22), v3(12.5, 0, 0), v3(13, 2, 18), v3(11, -3, 0)],
    [27, 33, 0.1, v3(6, -27, 16), v3(6, -30, 0), v3(-2, -28, 14), v3(-2, -31.2, 0)],
    [33, 37, 1, v3(16, 4, 24), v3(16, 1, 0), v3(15, 4.5, 26), v3(16, 1.5, 0)],
    [37, 41, 1, v3(16, 4, 20), v3(12.5, 0.5, 0), v3(13, 1, 18), v3(11, -3, 0)],
    [41, 48, 0.08, v3(-12, -27, 15), v3(-12, -30, 0), v3(-17.5, -28, 13), v3(-17.5, -31, 0)],
    [48, 53, 0.08, v3(-17, -27.5, 15), v3(-19, -30.5, 0), v3(-26, -25.5, 15), v3(-27, -28.5, 0)],
    [53, 60, 0.06, v3(-29, -25, 13), v3(-30, -26.5, 0), v3(-30, -24.5, 10), v3(-31, -26, 0)],
  ];
  const bg = new THREE.Color(), SKY = new THREE.Color('#9fd8ff'), DARK = new THREE.Color('#0a0d12');

  function render(t) {
    const shot = SHOTS.find(s => t >= s[0] && t < s[1]) || SHOTS[SHOTS.length - 1];
    const p = ease(seg(t, shot[0], shot[1])), amb = shot[2];
    cam.position.lerpVectors(shot[3], shot[5], p); cam.lookAt(new THREE.Vector3().lerpVectors(shot[4], shot[6], p));
    sun.intensity = 2.6 * amb; hemi.intensity = 0.12 + 0.6 * amb; scene.environmentIntensity = 0.06 + 0.94 * amb;
    bg.copy(DARK).lerp(SKY, amb); scene.background = bg;
    const sid = SHOTS.indexOf(shot);
    // hide everything, then place per shot
    [valdez, navyBoss, gus, rossi, ...navyDivers].forEach(f => pose(f, { x: 0, y: 0, vis: false }));
    fish.visible = false; rope.visible = false; ring.visible = false; marker.intensity = 0; valdezGlow.intensity = 0;
    L148.visible = depthBar.visible = sid === 0; L164.visible = sid === 5; L262.visible = sid === 8;
    spearProp.visible = t > 9 && t < 33; tankProp.visible = bagProp.visible = t > 10; battery.visible = t > 10 && t < 50;
    truck.visible = t > 21 && t < 36;
    streaks.forEach(([s]) => s.visible = false); bubbles.forEach(([b]) => b.visible = false); splashes.forEach(([d]) => d.visible = false);
    const bub = (x, y, n = 8) => { for (let i = 0; i < n; i++) { const [b, a, c] = bubbles[i + (n === 8 ? 0 : 8)] || bubbles[i]; const k = (t * 0.8 + a) % 1; b.visible = true; b.position.set(x + Math.sin(k * 9 + c * 6) * 0.3, y + k * 3, 0.5 + c); } };
    const splash = (x, t0) => { const k = seg(t, t0, t0 + 0.8); splashes.forEach(([d, a, s, u]) => { if (k > 0 && k < 1) { d.visible = true; d.position.set(x + Math.cos(a) * s * k * (a > 1.57 ? -1 : 1) * 0.5, -0.3 + u * k - 6 * k * k, Math.sin(a)); } }); };

    if (sid === 0) { // establishing: down the shaft, along the tunnel, into the chamber
      pose(valdez, { x: -37.5, y: LEDGE.top, mode: 'sit' }); valdezGlow.intensity = 25; valdezGlow.position.set(-37, -23, 3);
      marker.intensity = 0;
      ring.visible = t > 3.5; ring.position.set(-37.5, -24.6, 2.5); ring.scale.setScalar(1.6 + Math.sin(t * 6) * 0.08);
    }
    if (sid === 1) { // chasing the fish along the tunnel
      const fx = lerp(6, -24, seg(t, 5, 11)), vx = fx + 4.5;
      fish.visible = true; fish.position.set(fx, tunnelY(fx) + Math.sin(t * 3) * 0.4, 0); fish.rotation.set(0, 0, Math.sin(t * 9) * 0.1);
      pose(valdez, { x: vx, y: tunnelY(vx) - 1.4, mode: 'swim', dir: -1, t });
      bub(vx + 1, tunnelY(vx));
    }
    if (sid === 2) { // surfacing in the air pocket and climbing the ledge
      const k = seg(t, 11, 13.2), k2 = seg(t, 13.6, 15.5);
      if (t < 13.2) pose(valdez, { x: lerp(-26.5, -32.5, k), y: lerp(-30, -28.6, ease(k)), mode: 'swim', dir: -1, t, pitch: -0.5 * k });
      else if (t < 13.6) pose(valdez, { x: -32.5, y: -28.6 + Math.sin(t * 5) * 0.05, mode: 'tread', t, yaw: -0.4 });
      else pose(valdez, { x: lerp(-32.5, -37.5, ease(k2)), y: lerp(-28.6, LEDGE.top, ease(k2)), mode: k2 < 1 ? 'walk' : 'sit', t, dir: -1 });
      splash(-32.5, 12.9 + 0.0); splashes.forEach(([d]) => d.position.y += CH.water + 0.3);
      valdezGlow.intensity = 14; valdezGlow.position.set(-33, -23, 4);
    }
    if (sid === 3) { pose(valdez, { x: -37.5, y: LEDGE.top, mode: 'sit' }); valdezGlow.intensity = 5 + Math.sin(t * 2) * 1; valdezGlow.position.set(-36, -23.5, 3); }
    if (sid === 4 || sid === 6) { // surface: navy team
      const leave = sid === 6 ? seg(t, 34.5, 37) : 0;
      pose(navyBoss, { x: 16 + leave * 8, y: 0.2, mode: leave > 0 ? 'walk' : 'stand', t, dir: 1, z: 0.3 });
      navyDivers.forEach((d, i) => {
        if (sid === 6) { pose(d, { x: 14.5 + i * 1.6 + leave * 8, y: 0.2, z: -0.4, mode: leave > 0 ? 'walk' : 'stand', t: t + i, dir: 1 }); return; }
        const jt = 24.3 + i * 0.7, k = seg(t, jt, jt + 0.55);
        if (t < jt) pose(d, { x: 14 + i * 1.5 - seg(t, 22, 24) * 0.6, y: 0.2, mode: t > 22 && t < 24 ? 'walk' : 'stand', dir: -1, t, z: -0.6 + i * 0.3 });
        else { const x = lerp(13.4 + i * 0.2, 10.5 + i * 0.5, k), y = k < 1 ? 0.2 + Math.sin(k * Math.PI) * 2 - k * 1.5 : -1.3 - (t - jt - 0.55) * 4; pose(d, { x, y, mode: 'jump', t: k, dir: -1, vis: y > -6 }); }
        splash(10.5 + i * 0.5, jt + 0.5);
      });
      if (sid === 4) { /* splash handled above */ }
    }
    if (sid === 5) { // navy divers search the tunnel
      navyDivers.forEach((d, i) => { const x = lerp(10, -0.5, seg(t, 27, 31.5)) + i * 2.6; pose(d, { x, y: tunnelY(x) - 1.4 + i * 0.4, mode: 'swim', dir: -1, t: t + i, light: 1 }); bub(x + 1, tunnelY(x) + 0.5, 4); });
      ring.visible = t > 30; ring.position.set(-2, floorY(-2) + 0.4, 2.5); ring.scale.setScalar(0.7 + Math.sin(t * 6) * 0.04);
    }
    if (sid === 7) { // Gus & Rossi
      pose(rossi, { x: 14.2, y: 0.2, mode: 'stand', yaw: -0.7 });
      const jt = 39.4, k = seg(t, jt, jt + 0.55);
      if (t < jt) pose(gus, { x: lerp(16.5, 13.6, seg(t, 37.5, 39)), y: 0.2, mode: t < 39 ? 'walk' : 'stand', dir: -1, t });
      else { const x = lerp(13.4, 10.5, k), y = k < 1 ? 0.2 + Math.sin(k * Math.PI) * 2 - k * 1.5 : -1.3 - (t - jt - 0.55) * 3; pose(gus, { x, y, mode: 'jump', t: k, dir: -1 }); }
      splash(10.5, jt + 0.5);
      rope.visible = t > jt;
      if (rope.visible) { gus.root.updateMatrixWorld(true); const a = new THREE.Vector3(); rossi.armR.hand.getWorldPosition(a); const b = new THREE.Vector3(); gus.body.getWorldPosition(b); setRope(a, b, 0.4); }
    }
    if (sid === 8) { // Gus finds tank + bag, air runs low, turns back
      const turn = seg(t, 45, 46.2);
      const x = t < 45 ? lerp(-10, -15.5, ease(seg(t, 41, 43.5))) : lerp(-15.5, -12, ease(seg(t, 46, 48)));
      pose(gus, { x, y: tunnelY(x) - 1.2 + Math.sin(t * 1.5) * 0.15, mode: 'swim', dir: turn < 0.5 ? -1 : 1, t, light: 1 });
      bub(x, tunnelY(x) + 0.5, 6);
      ring.visible = t > 42 && t < 45.5; ring.position.set(-17.6, floorY(-17.6) + 0.6, 2.5); ring.scale.setScalar(1.0 + Math.sin(t * 6) * 0.05);
    }
    if (sid === 9) { // next day: battery, then the current
      const x = lerp(-15, -24.5, ease(seg(t, 48, 52.4)));
      const up = seg(t, 51.4, 53);
      pose(gus, { x, y: tunnelY(x) - 1.2 + up * 1.5, mode: 'swim', dir: -1, t, light: 1, pitch: -0.7 * up });
      bub(x, tunnelY(x) + 0.5, 6);
      ring.visible = t > 49 && t < 50.8; ring.position.set(-22, floorY(-22) + 0.3, 2.5); ring.scale.setScalar(0.6);
      if (t > 50.6) streaks.forEach(([s, a, b, c]) => { const k = (t * 1.6 + a) % 1; s.visible = true; s.position.set(lerp(-30, -14, k), floorY(-20) + 0.6 + b * 4, 1.5 + c * 0.5); });
    }
    if (sid === 10) { // surfacing in the huge air chamber
      const k = seg(t, 53, 54.6);
      const y = lerp(-30, CH.water - 1.75, ease(k));
      pose(gus, { x: lerp(-27, -30, k), y, mode: k < 1 ? 'swim' : 'tread', dir: -1, t, pitch: -1.3 * (1 - k) - 0.2, light: 1, yaw: k < 1 ? null : -0.9 + Math.sin(t * 0.9) * 0.6 });
      splash(-30, 54.4); splashes.forEach(([d]) => d.position.y += CH.water + 0.3);
      streaks.forEach(([s, a, b, c]) => { const kk = (t * 0.5 + a) % 1; s.visible = b > 0.5; s.position.set(lerp(-26, -35, kk), CH.water - 0.5 - b * 2, 1 + c); });
      if (t > 58.8) gus.spot.intensity *= 1 - seg(t, 58.8, 59.6);
    }
    r.render(scene, cam);

    // ---------- 2D overlays
    const cap = CAPS.find(c => t >= c[0] && t < c[1]);
    const capText = cap ? cap[2] : '';
    if (capText !== lastCap) { ui.caption.innerHTML = capText ? capText.replace(KEYW, '<span class="hl">$1</span>') : ''; lastCap = capText; }
    if (cap) { const k = seg(t, cap[0], cap[0] + 0.18); ui.caption.style.transform = `translateX(-50%) scale(${0.85 + 0.15 * ease(k)})`; ui.caption.style.opacity = k; } else ui.caption.style.opacity = 0;
    const card = CARDS.find(c => t >= c[0] && t < c[1]);
    ui.card.textContent = card ? card[2] : ''; ui.card.style.opacity = card ? Math.min(seg(t, card[0], card[0] + 0.3), 1 - seg(t, card[1] - 0.3, card[1])) : 0;
    const airOn = (t > 41 && t < 53);
    ui.air.style.opacity = airOn ? 1 : 0;
    const air = t < 48 ? lerp(0.55, 0.12, seg(t, 41, 46)) : lerp(0.95, 0.7, seg(t, 48, 53));
    ui.airFill.style.width = (air * 100) + '%'; ui.airFill.style.background = air < 0.25 ? (Math.floor(t * 4) % 2 ? '#ff1744' : '#b71c1c') : '#ffd400';
    ui.bubble.style.opacity = t > 57.6 && t < 59.4 ? 1 : 0;
    ui.bubble.style.transform = `scale(${0.6 + 0.4 * ease(seg(t, 57.6, 57.9))})`;
    ui.end.style.opacity = seg(t, 59.0, 59.4);
    ui.fade.style.opacity = 0.85 * seg(t, 58.9, 59.5) + (t < 0.25 ? 1 - t * 4 : 0);
  }
  function setRope(a, b, sag) { const pa = ropeGeo.attributes.position; for (let i = 0; i < 40; i++) { const k = i / 39; pa.setXYZ(i, lerp(a.x, b.x, k), lerp(a.y, b.y, k) - Math.sin(k * Math.PI) * sag, lerp(a.z, b.z, k)); } pa.needsUpdate = true; }
  return { render };
}
window.LegoFilm = { create, DUR };
