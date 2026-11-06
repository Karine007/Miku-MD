// "Would You Still Love Me?" — a short original toy-brick (Lego-style) comedy sketch, vertical 1080x1920.
// render(t) is a pure function of time. Voice timings (seconds in the film) are below in LINES.
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
const W = 1080, H = 1920;
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
  const cam = new THREE.PerspectiveCamera(40, W / H, 0.1, 600);
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

  // ---------- minifigs (generic toy figures, original characters)
  const yellowSkin = plastic('#ffd23c'), BLACK = new THREE.MeshBasicMaterial({ color: '#111' });
  const mk = (geo, mat, x, y, z, p) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.castShadow = true; p.add(m); return m; };
  const LOOKS = {
    dan: { shirt: '#3c8d5a', pants: '#2f3a4f', hair: '#6b3e1f' },
    mira: { shirt: '#8e4fb8', pants: '#3a3550', hair: '#1d1512', long: 1, lips: '#c8323a' },
    ray: { shirt: '#5f6672', pants: '#2b2d33', bald: 1, beard: '#2a2320' },
  };
  function fig(look) {
    const L = LOOKS[look], root = new THREE.Group(), body = new THREE.Group(); root.add(body); body.position.y = 1.6; scene.add(root);
    const o = -1.6, P = plastic(L.pants), S = plastic(L.shirt), skin = yellowSkin;
    mk(new THREE.BoxGeometry(1.1, 0.3, 0.6), P, 0, 1.35 + o, 0, body);
    const legs = [-0.28, 0.28].map(x => { const p = new THREE.Group(); p.position.set(x, 1.3 + o, 0); body.add(p); mk(new THREE.BoxGeometry(0.52, 1.2, 0.6), P, 0, -0.6, 0, p); mk(new THREE.BoxGeometry(0.52, 0.2, 0.78), P, 0, -1.2, 0.08, p); return p; });
    const tg = new THREE.CylinderGeometry(0.42, 0.62, 1.25, 4, 1); tg.rotateY(Math.PI / 4); tg.scale(1.2, 1, 0.62); mk(tg, S, 0, 2.12 + o, 0, body);
    if (L.bald) { const hood = new THREE.Mesh(new THREE.TorusGeometry(0.36, 0.13, 8, 20), S); hood.rotation.x = Math.PI / 2; hood.position.set(0, 2.8 + o, -0.04); body.add(hood); mk(new THREE.BoxGeometry(0.5, 0.3, 0.05), plastic('#7d7f86'), 0, 1.85 + o, 0.34, body); }
    mk(new THREE.CylinderGeometry(0.22, 0.22, 0.15, 14), skin, 0, 2.82 + o, 0, body);
    const head = new THREE.Group(); head.position.set(0, 3.2 + o, 0); body.add(head);
    mk(new THREE.CylinderGeometry(0.4, 0.4, 0.7, 24), skin, 0, 0, 0, head);
    if (L.bald) mk(new THREE.CylinderGeometry(0.2, 0.2, 0.12, 16), skin, 0, 0.41, 0, head);
    const eyes = [-0.14, 0.14].map(x => mk(new THREE.SphereGeometry(0.065, 12, 8), BLACK, x, 0.08, 0.38, head));
    const glint = eyes.map(e => mk(new THREE.SphereGeometry(0.02, 6, 4), new THREE.MeshBasicMaterial({ color: '#fff' }), e.position.x + 0.025, 0.11, 0.44, head));
    const brows = [-0.15, 0.15].map(x => mk(new THREE.BoxGeometry(0.16, 0.035, 0.03), BLACK, x, 0.23, 0.385, head));
    const lipM = L.lips ? new THREE.MeshBasicMaterial({ color: L.lips }) : BLACK;
    const smile = new THREE.Mesh(new THREE.TorusGeometry(0.15, L.lips ? 0.035 : 0.025, 6, 16, Math.PI), lipM); smile.rotation.z = Math.PI; smile.position.set(0, -0.09, 0.39); head.add(smile);
    const frown = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.025, 6, 16, Math.PI), lipM); frown.position.set(0, -0.2, 0.39); head.add(frown); frown.visible = false;
    const mouthO = mk(new THREE.CylinderGeometry(0.09, 0.09, 0.03, 16), plastic('#5b1a12'), 0, -0.13, 0.39, head); mouthO.rotation.x = Math.PI / 2; mouthO.visible = false;
    const teeth = mk(new THREE.BoxGeometry(0.16, 0.04, 0.02), new THREE.MeshBasicMaterial({ color: '#fff' }), 0, -0.06, 0.41, head); teeth.visible = false;
    if (L.lips) for (const x of [-0.14, 0.14]) for (const k of [-1, 0, 1]) { const l = mk(new THREE.BoxGeometry(0.012, 0.05, 0.01), BLACK, x + k * 0.04 + (x > 0 ? 0.03 : -0.03), 0.165, 0.39, head); l.rotation.z = k * 0.4 + (x > 0 ? -0.3 : 0.3); }
    if (L.hair && !L.long) { mk(new THREE.CylinderGeometry(0.43, 0.43, 0.28, 24), plastic(L.hair), 0, 0.42, -0.03, head); mk(new THREE.BoxGeometry(0.42, 0.16, 0.34), plastic(L.hair), 0.08, 0.6, 0.06, head); }
    if (L.long) { const hm = plastic(L.hair, { roughness: 0.65, clearcoat: 0.05 }); mk(new THREE.CylinderGeometry(0.44, 0.44, 0.3, 24), hm, 0, 0.42, -0.03, head); mk(new THREE.BoxGeometry(0.95, 1.05, 0.42), hm, 0, -0.15, -0.26, head); for (const x of [-0.42, 0.42]) mk(new THREE.BoxGeometry(0.14, 0.9, 0.5), hm, x, -0.1, -0.02, head); mk(new THREE.BoxGeometry(0.7, 0.12, 0.2), hm, 0.1, 0.33, 0.33, head).rotation.z = -0.25; }
    if (L.beard) { const bm = plastic(L.beard); mk(new THREE.TorusGeometry(0.33, 0.06, 6, 20, Math.PI), bm, 0, -0.08, 0.12, head).rotation.set(Math.PI / 2 + 0.25, Math.PI, 0); }
    const arm = s => { const p = new THREE.Group(); p.position.set(s * 0.66, 2.62 + o, 0); body.add(p); const a = mk(new THREE.CylinderGeometry(0.15, 0.17, 0.95, 12), S, 0, -0.42, 0.05, p); a.rotation.z = s * 0.18;
      const hand = new THREE.Group(); hand.position.set(s * 0.1, -0.95, 0.12); p.add(hand); mk(new THREE.TorusGeometry(0.13, 0.07, 8, 16), skin, 0, 0, 0, hand).rotation.y = Math.PI / 2; return { p, hand }; };
    const armR = arm(1), armL = arm(-1);
    return { root, body, legs, head, armR, armL, smile, frown, mouthO, teeth, eyes, glint, brows };
  }
  // face: smile | smug | touched | shocked | laugh | neutral ; talk = mouth flapping
  function face(f, kind, talk, t) {
    f.smile.visible = ['smile', 'smug', 'touched'].includes(kind) && !talk; f.frown.visible = false; f.teeth.visible = kind === 'laugh';
    f.mouthO.visible = talk > 0 || kind === 'shocked' || kind === 'laugh';
    const open = kind === 'laugh' ? 2.4 + Math.abs(Math.sin(t * 13)) * 0.9 : kind === 'shocked' ? 1.7 : 0.6 + Math.abs(Math.sin(t * 15)) * 1.3;
    f.mouthO.scale.set(kind === 'laugh' ? 1.9 : kind === 'shocked' ? 1.3 : 1.1, 1, open); f.mouthO.position.y = kind === 'laugh' || kind === 'shocked' ? -0.17 : -0.13;
    const ey = kind === 'laugh' ? 0.22 : kind === 'smug' ? 0.55 : kind === 'shocked' ? 1.6 : 1;
    f.eyes.forEach((e, k) => { e.scale.set(kind === 'shocked' ? 1.5 : 1, ey, 1); f.glint[k].visible = kind !== 'laugh'; });
    const B = { smug: [[0.0, 0.0], [0.08, -0.35]], touched: [[0.03, -0.3], [0.03, 0.3]], shocked: [[0.12, 0.15], [0.12, -0.15]], laugh: [[0.05, -0.35], [0.05, 0.35]] }[kind] || [[0, 0], [0, 0]];
    f.brows.forEach((b, k) => { b.position.y = 0.23 + B[k][0]; b.rotation.z = B[k][1]; });
    if (kind === 'smug') f.smile.rotation.z = Math.PI + 0.25; else f.smile.rotation.z = Math.PI;
  }
  function sit(f, x, y, z, yaw, { arms = [-0.5, -0.5], pitch = 0, head = 0, headY = 0 } = {}) {
    f.root.position.set(x, y, z); f.root.rotation.y = yaw; f.body.position.y = 0.45; f.body.rotation.set(pitch, 0, 0);
    f.legs.forEach(l => l.rotation.x = -1.5); f.armL.p.rotation.x = arms[0]; f.armR.p.rotation.x = arms[1]; f.head.rotation.set(head, headY, 0);
  }

  // ---------- living room
  const room = new THREE.Group(); scene.add(room);
  plate(room, 40, 26, '#b98a56', 0, 0, 0);
  plate(room, 16, 8, '#c4553f', 0, 0.4, 4);
  wall(room, 40, 18, '#f3e3c3', '#ead6b0', 0, 0, -4.5);
  // sofa
  const SOFA = '#2e8f8c';
  brick(room, 12, 4, 2.2, SOFA, 0, 0, -1.6, { studs: false });
  brick(room, 12, 1, 3.4, SOFA, 0, 2.2, -3.1, { studs: false });
  for (const x of [-6.5, 6.5]) brick(room, 1, 4, 3.4, shadeC(SOFA, -0.12), x, 0, -1.6, { studs: true });
  for (const x of [-2.9, 2.9]) brick(room, 5.6, 3, 0.6, '#3aa7a3', x, 2.2, -1.3, { studs: false });
  brick(room, 2, 1, 2, '#f2c230', -4.4, 2.8, -2.4, { studs: false }).rotation.z = 0.15;
  brick(room, 2, 1, 2, '#e9e4da', 4.4, 2.8, -2.4, { studs: false }).rotation.z = -0.15;
  // wall pictures + shelf + lamp + plant
  brick(room, 5, 0.4, 3.6, '#6b4a2a', -1.2, 8, -4.0, { studs: false }); brick(room, 4.2, 0.45, 2.8, '#8fc4dc', -1.2, 8.4, -3.95, { studs: false }); brick(room, 4.2, 0.5, 1.2, '#7fae5a', -1.2, 8.4, -3.9, { studs: false });
  brick(room, 2.6, 0.4, 2.6, '#6b4a2a', 4.2, 9, -4.0, { studs: false }); brick(room, 2, 0.45, 2, '#f3a86a', 4.2, 9.3, -3.95, { studs: false });
  brick(room, 2, 2, 2.4, '#7a5232', 9, 0, -1.6); cyl(room, 0.15, 3, '#d0c8b8', 9, 2.4, -1.6); const shade = cyl(room, 0.9, 1.2, '#fff2d2', 9, 5.2, -1.6, 20, glow('#ffe7b0', 0.6));
  const lampL = new THREE.PointLight('#ffd9a0', 30, 30, 1.6); lampL.position.set(9, 5.6, -0.6); room.add(lampL);
  brick(room, 2, 2, 1.6, '#c4553f', -9, 0, -1.8); for (let k = 0; k < 6; k++) brick(room, 1, 1, 1.4, '#3f9e4f', -9 + Math.cos(k) * 0.6, 1.6 + k * 0.45, -1.8 + Math.sin(k * 2) * 0.5, { studs: false }).rotation.set(k * 0.4, k, k * 0.3);
  // shelf with books
  brick(room, 7, 1, 0.4, '#7a5232', -10.5, 7, -4.0, { studs: false }); ['#c8361f', '#1e62c8', '#f2c230', '#2e9e4e', '#8e4fb8'].forEach((c, k) => brick(room, 0.8, 0.8, 1.6, c, -13 + k * 1.1, 7.4, -4.0, { studs: false }));
  function shadeC(hex, k) { const c = new THREE.Color(hex); c.multiplyScalar(1 + k); return '#' + c.getHexString(); }

  // ---------- podcast desk (reaction scene), far away at x = 100
  const pod = new THREE.Group(); pod.position.x = 100; scene.add(pod);
  plate(pod, 30, 20, '#3a3f4a', 0, 0, 0);
  wall(pod, 30, 18, '#2b3550', '#26304a', 0, 0, -5);
  brick(pod, 26, 0.4, 0.4, '#3fa9ff', 0, 3.2, -4.4, { studs: false, mat: glow('#3fa9ff', 2.2) });
  brick(pod, 26, 0.4, 0.4, '#3fa9ff', 0, 9.6, -4.4, { studs: false, mat: glow('#ff4fa0', 1.6) });
  for (let k = 0; k < 5; k++) brick(pod, 2, 0.6, 2, k % 2 ? '#474f66' : '#3c4459', -8 + k * 4, 5.2, -4.5, { studs: false });
  brick(pod, 3, 0.4, 1.6, '#f2c230', 6.5, 6.4, -4.4, { studs: false });
  const desk = brick(pod, 11, 4, 2.5, '#6b4a2a', 0, 0, 1.2);
  brick(pod, 11.4, 4.4, 0.3, '#8a6240', 0, 2.5, 1.2, { studs: false });
  cyl(pod, 0.12, 1.2, '#222', -1.6, 2.8, 1.4); const micHead = cyl(pod, 0.3, 0.8, '#2a2a2a', -1.4, 3.8, 1.2); micHead.rotation.z = -0.5; micHead.rotation.x = 0.4;
  cyl(pod, 0.2, 0.9, '#c8e8f8', 2.6, 2.8, 1.8); cyl(pod, 0.2, 0.9, '#c8e8f8', 3.2, 2.8, 1.4);
  const chair = brick(pod, 3, 3, 2.2, '#222831', 0, 0, -1.2, { studs: false }); brick(pod, 3, 0.8, 2.6, '#3a2230', 0, 2.2, -2.6, { studs: false });
  const podKey = new THREE.PointLight('#fff1dc', 32, 40, 1.4); podKey.position.set(103, 9, 8); scene.add(podKey);
  const podRim = new THREE.PointLight('#5fb0ff', 40, 30, 1.4); podRim.position.set(96, 6, -3); scene.add(podRim);

  const DAN = fig('dan'), MIRA = fig('mira'), RAY = fig('ray');

  // ---------- timing (film seconds) — voice clips placed by src/make_audio.py
  const LINES = [
    { who: 'mira', a: 0.63, b: 6.94, text: 'Babe... if I lost all my money tomorrow, would you still love me?' },
    { who: 'dan', a: 7.6, b: 9.01, text: 'Of course I would.' },
    { who: 'mira', a: 9.62, b: 11.9, text: 'Aww... really?' },
    { who: 'dan', a: 12.57, b: 17.02, text: "Yeah. I'd miss you... but I'd still love you." },
    { who: 'mira', a: 17.64, b: 18.4, text: 'WHAT?!' },
  ];
  const LAUGH_AT = 20.0, TOTAL = 26.0;
  const speaking = (who, t) => LINES.some(l => l.who === who && t > l.a && t < l.b && !(l.who === 'dan' && t > 13.25 && t < 13.6) && !(l.who === 'mira' && t > 3.4 && t < 3.7) && !(l.who === 'mira' && t > 5.25 && t < 5.65));

  function shot(from, look, to, lookTo, k) { cam.position.copy(from).lerp(to, ease(k)); const l = look.clone().lerp(lookTo, ease(k)); cam.lookAt(l); }
  sun.position.set(10, 22, 18); sun.target.position.set(0, 2, -1);

  function render3d(t) {
    const SEAT = 2.65;
    // couple
    const danTalk = speaking('dan', t) ? 1 : 0, miraTalk = speaking('mira', t) ? 1 : 0;
    const shocked = t > 17.5;
    sit(DAN, -2.3, SEAT, -1.2, 0.3, { arms: t > 12.4 && t < 17.3 ? [-0.5, -1.1 + Math.sin(t * 2) * 0.1] : [-0.5, -0.5], head: 0, headY: t > 13.6 && t < 17.4 ? -0.15 : 0.12 });
    sit(MIRA, 2.3, SEAT, -1.2, -0.3, { arms: shocked ? [-2.3, -2.3] : t > 9.5 && t < 12.2 ? [-1.6, -1.6] : [-0.6, -0.5], pitch: shocked ? -0.12 : t < 7 ? 0.08 : 0, head: shocked ? -0.08 : 0, headY: shocked ? 0.25 : -0.12 });
    face(DAN, t > 13.6 ? 'smug' : 'smile', danTalk, t);
    face(MIRA, shocked ? 'shocked' : t > 9.4 && t < 12.3 ? 'touched' : 'smile', shocked ? 0 : miraTalk, t);
    if (shocked) MIRA.mouthO.visible = true;
    // reaction guy
    const lt = Math.max(0, t - LAUGH_AT), rock = Math.sin(lt * 5.2);
    RAY.root.position.set(100, 2.05, -1.1); RAY.root.rotation.y = 0; RAY.body.position.y = 0.45;
    RAY.body.rotation.set(lt < 0.4 ? 0 : -0.22 + rock * 0.2 + (lt > 3 ? 0.18 : 0), 0, Math.sin(lt * 2.6) * 0.12);
    RAY.legs.forEach(l => l.rotation.x = -1.5);
    RAY.armR.p.rotation.x = lt > 2.6 ? -1.35 + Math.max(0, Math.sin(lt * 10)) * -0.6 : -2.6 + Math.sin(lt * 7) * 0.25; RAY.armL.p.rotation.x = lt > 2.6 ? -2.7 : -2.4 + Math.sin(lt * 7 + 1) * 0.25;
    RAY.head.rotation.set(-0.3 + rock * 0.12, Math.sin(lt * 1.7) * 0.25, 0);
    face(RAY, lt < 0.25 ? 'smile' : 'laugh', 0, t);
    // cameras
    if (t < LAUGH_AT) {
      scene.background = new THREE.Color('#e9dcc0');
      if (t < 7.4) shot(v3(0, 6.2, 17.5), v3(0, 4.1, -1.2), v3(0, 5.8, 15), v3(0, 4.1, -1.2), t / 7.4);
      else if (t < 9.4) shot(v3(-0.6, 5.0, 7.2), v3(-2.3, 4.4, -1.2), v3(-0.7, 5.0, 6.6), v3(-2.3, 4.4, -1.2), (t - 7.4) / 2);
      else if (t < 12.2) shot(v3(0.6, 5.0, 7.2), v3(2.3, 4.4, -1.2), v3(0.7, 5.0, 6.6), v3(2.3, 4.4, -1.2), (t - 9.4) / 2.8);
      else if (t < 17.4) shot(v3(-0.6, 5.0, 7.4), v3(-2.3, 4.4, -1.2), v3(-1.0, 4.9, 5.4), v3(-2.3, 4.5, -1.2), (t - 12.2) / 5.2);
      else { const k = clamp((t - 17.4) / 0.25); const sh = t > 17.6 ? Math.sin(t * 60) * 0.06 * (1 - clamp((t - 17.6) / 1.5)) : 0; shot(v3(0.7 + sh, 5.0 + sh, 7.4), v3(2.3, 4.3, -1.2), v3(1.3 + sh, 4.9, 5.6), v3(2.3, 4.4, -1.2), k); }
    } else {
      scene.background = new THREE.Color('#1e2436');
      const k = clamp(lt / 6), sh = Math.sin(t * 23) * 0.04;
      shot(v3(100.6 + sh, 5.6, 9.5), v3(100, 3.9, -1.1), v3(100.3 + sh, 5.2, 7.2), v3(100, 4.1, -1.1), k);
    }
    hemi.intensity = t < LAUGH_AT ? 0.7 : 0.35; sun.intensity = t < LAUGH_AT ? 2.4 : 0.5;
  }

  // ---------- captions (bold, word-by-word highlight)
  const F = 'DejaVu Sans';
  function captions(t) {
    const l = LINES.find(l => t > l.a - 0.1 && t < l.b + 0.35); if (!l) return;
    const words = l.text.split(' '), tot = l.text.length; let acc = 0; const times = words.map(w => { const s = l.a + acc / tot * (l.b - l.a); acc += w.length + 1; return s; });
    let cur = 0; times.forEach((s, k) => { if (t >= s) cur = k; });
    const chunk = Math.floor(cur / 3) * 3, show = words.slice(chunk, chunk + 3);
    const size = l.text === 'WHAT?!' ? 150 : 84;
    g2.save(); g2.font = `900 ${size}px ${F}`; g2.textBaseline = 'middle'; g2.lineJoin = 'round';
    const full = show.join(' ').toUpperCase(); let fs = size; while (g2.measureText(full).width > 960 && fs > 40) { fs -= 4; g2.font = `900 ${fs}px ${F}`; } const wFull = g2.measureText(full).width; let x = W / 2 - wFull / 2; const y = H * 0.7;
    show.forEach((w, k) => { const s = w.toUpperCase() + (k < show.length - 1 ? ' ' : ''); g2.lineWidth = fs / 5; g2.strokeStyle = '#000'; g2.strokeText(s, x, y); g2.fillStyle = chunk + k === cur ? '#ffd23c' : '#ffffff'; g2.fillText(s, x, y); x += g2.measureText(s).width; });
    g2.restore();
  }
  function render(t) {
    render3d(t); r.render(scene, cam);
    g2.setTransform(1, 0, 0, 1, 0, 0); g2.clearRect(0, 0, W, H);
    if (t < LAUGH_AT) captions(t);
    // flash cut into the reaction, fade at the very start and end
    let fade = 0; if (t < 0.3) fade = 1 - t / 0.3; if (t > TOTAL - 0.4) fade = (t - (TOTAL - 0.4)) / 0.4;
    if (t > LAUGH_AT && t < LAUGH_AT + 0.18) { g2.fillStyle = `rgba(255,255,255,${1 - (t - LAUGH_AT) / 0.18})`; g2.fillRect(0, 0, W, H); }
    if (fade > 0) { g2.fillStyle = `rgba(0,0,0,${fade})`; g2.fillRect(0, 0, W, H); }
  }
  return { render };
}
window.SofaFilm = { create };
