// "Gone Fishing" — a 10 s toy-brick film. Bundled to ../assets/scene.js (IIFE) and driven by the
// HyperFrames GSAP timeline in index.html through window.LegoFilm.render(t). Fully deterministic.
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

const W = 1080, H = 1920;
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, k) => a + (b - a) * k;
const ease = k => k * k * (3 - 2 * k);
const seg = (t, a, b) => clamp((t - a) / (b - a)); // 0..1 progress of t inside [a,b]
// piecewise-linear keyframes [[t, v], ...] with smoothstep between keys
function keys(t, ks) {
  if (t <= ks[0][0]) return ks[0][1];
  for (let i = 1; i < ks.length; i++) if (t <= ks[i][0]) return lerp(ks[i - 1][1], ks[i][1], ease(seg(t, ks[i - 1][0], ks[i][0])));
  return ks[ks.length - 1][1];
}
let seed = 12345; const rand = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };

export function create(canvas) {
  const r = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true });
  r.setPixelRatio(1); r.setSize(W, H, false);
  r.shadowMap.enabled = true; r.shadowMap.type = THREE.PCFSoftShadowMap;
  r.toneMapping = THREE.ACESFilmicToneMapping;
  const scene = new THREE.Scene();
  const envTex = new THREE.PMREMGenerator(r).fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = envTex;
  scene.fog = new THREE.Fog('#8fd3ff', 30, 70);
  const cam = new THREE.PerspectiveCamera(42, W / H, 0.1, 300);

  // ---------- lights
  const sun = new THREE.DirectionalLight('#fff4e0', 2.6);
  sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); sun.shadow.bias = -0.0006;
  Object.assign(sun.shadow.camera, { left: -22, right: 22, top: 22, bottom: -22, near: 1, far: 80 });
  scene.add(sun, sun.target);
  const hemi = new THREE.HemisphereLight('#ffffff', '#6a8a50', 0.7); scene.add(hemi);
  const moonLight = new THREE.DirectionalLight('#8fb0ff', 0); moonLight.position.set(-10, 20, 12); scene.add(moonLight);

  // ---------- brick helpers
  const U = 0.8, BH = 0.96, mats = {};
  const plastic = (c, o = {}) => mats[c + JSON.stringify(o)] ??= new THREE.MeshPhysicalMaterial({ color: c, roughness: 0.25, clearcoat: 0.5, clearcoatRoughness: 0.2, ...o });
  const stud = new THREE.CylinderGeometry(0.24, 0.24, 0.17, 20);
  function brick(w, d, h, color, x, y, z, studs = true, parent = scene, mat) {
    const g = new THREE.Group(), m = mat || plastic(color);
    const b = new THREE.Mesh(new THREE.BoxGeometry(w * U - 0.03, h * BH - 0.03, d * U - 0.03), m);
    b.castShadow = b.receiveShadow = true; g.add(b);
    if (studs) for (let i = 0; i < w; i++) for (let j = 0; j < d; j++) {
      const s = new THREE.Mesh(stud, m); s.castShadow = true;
      s.position.set((i - (w - 1) / 2) * U, h * BH / 2 + 0.085, (j - (d - 1) / 2) * U); g.add(s);
    }
    g.position.set(x, y + h * BH / 2, z); parent.add(g); return g;
  }
  function studField(w, d, color, x, y, z, mat) {
    const inst = new THREE.InstancedMesh(stud, mat || plastic(color), w * d); const m = new THREE.Matrix4(); let k = 0;
    for (let i = 0; i < w; i++) for (let j = 0; j < d; j++) { m.makeTranslation(x + (i - (w - 1) / 2) * U, y + 0.085, z + (j - (d - 1) / 2) * U); inst.setMatrixAt(k++, m); }
    inst.receiveShadow = true; scene.add(inst); return inst;
  }

  // ---------- world: baseplate, path, lake, dock
  const GW = 60, GD = 30;
  const ground = new THREE.Mesh(new THREE.BoxGeometry(GW * U, 0.3, GD * U), plastic('#4caf50'));
  ground.position.set(4, -0.15, -2); ground.receiveShadow = true; scene.add(ground);
  // lake: a hole in the green filled with translucent blue tile
  const lakeX = 13, lakeW = 22, lakeD = 18;
  studField(GW, GD, '#4caf50', 4, 0, -2).count = GW * GD;
  const waterMat = new THREE.MeshPhysicalMaterial({ color: '#1f7fd6', roughness: 0.08, metalness: 0, clearcoat: 1, transparent: true, opacity: 0.88 });
  const water = new THREE.Mesh(new THREE.BoxGeometry(lakeW * U, 0.2, lakeD * U), waterMat);
  water.position.set(lakeX, 0.2, -2); water.receiveShadow = true; scene.add(water);
  // sand border tiles
  for (let i = -1; i <= lakeD; i++) { brick(1, 1, 0.33, '#e6cf8f', lakeX - lakeW * U / 2 - U / 2, 0, -2 - lakeD * U / 2 + i * U + U / 2, false); }
  // path tiles house -> lake
  for (let x = -6.5; x < lakeX - lakeW * U / 2 - 0.5; x += U) brick(1, 2, 0.33, (Math.round(x / U) % 2) ? '#c9b48a' : '#d8c59c', x, 0, 1, false);
  // dock
  for (let i = 0; i < 6; i++) brick(2, 3, 0.33, i % 2 ? '#8d5a35' : '#7a4a2a', 5.2 + i * 2 * U, 0.35, 1, false);
  for (const x of [5.2, 9.0]) for (const z of [0, 2]) brick(1, 1, 1, '#5d3a1e', x, -0.6, z, false);
  // reeds
  for (let i = 0; i < 14; i++) { const x = lakeX - 8 + rand() * 16, z = -8.5 + rand() * 1.2; brick(1, 1, 1 + Math.floor(rand() * 2), '#2e7d32', x, 0.3, z, false); }

  // ---------- house
  const house = new THREE.Group(); scene.add(house); house.position.set(-9, 0, -1.2);
  for (let row = 0; row < 6; row++) for (let i = 0; i < 9; i++) {
    const x = (i - 4) * U, isDoor = Math.abs(i - 1) < 1 && row < 4, isWin = (i === 6) && row >= 2 && row <= 3;
    if (isDoor || isWin) continue;
    brick(1, 4, 1, row % 2 ? '#f5f5f5' : '#ececec', x, row * BH, 0, row === 5, house);
  }
  const roofC = '#c62828';
  for (let k = 0; k < 4; k++) brick(11 - k * 2, 6, 1, roofC, 0, 6 * BH + k * BH, 0, true, house);
  brick(1, 1, 3, '#6d4c41', 2.6, 7 * BH, 0, true, house); // chimney
  const door = brick(2, 1, 4, '#1565c0', 0.4, 0, 1.4, false, house); // door panel (pivots open at end)
  const doorPivot = new THREE.Group(); house.add(doorPivot); doorPivot.position.set(1.2, 0, 1.6); doorPivot.attach(door);
  const winMat = new THREE.MeshStandardMaterial({ color: '#9fdcf6', emissive: '#ffb84d', emissiveIntensity: 0, roughness: 0.1 });
  brick(1, 1, 2, '#9fdcf6', 6 * U - 4 * U, 2 * BH, 1.2, false, house, winMat);
  const winLight = new THREE.PointLight('#ffb84d', 0, 14, 1.5); winLight.position.set(1.6, 2.6, 3); house.add(winLight);
  const porchLight = new THREE.PointLight('#ffcf80', 0, 10, 1.5); porchLight.position.set(-0.2, 4.4, 2.6); house.add(porchLight);
  const lampMat = new THREE.MeshStandardMaterial({ color: '#fff3c4', emissive: '#ffcf80', emissiveIntensity: 0 });
  const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.22, 16, 12), lampMat); lamp.position.copy(porchLight.position); house.add(lamp);

  // ---------- trees & flowers
  function tree(x, z, s = 1) {
    brick(1, 1, 2, '#6b3e26', x, 0, z, false);
    brick(3, 3, 1, '#2e7d32', x, 2 * BH, z); brick(3, 3, 1, '#388e3c', x, 3 * BH, z); brick(1, 1, 1, '#43a047', x, 4 * BH, z);
  }
  [[-15, -5], [-4, -6], [0, -9], [3, -6.5], [-13, 3], [24, -7], [-17, 6]].forEach(([x, z]) => tree(x, z));
  for (let i = 0; i < 18; i++) { const x = -14 + rand() * 18, z = 3.2 + rand() * 4.5; const c = ['#e53935', '#fdd835', '#ffffff', '#ab47bc'][i % 4]; brick(1, 1, 0.33, c, x, 0, z, true); }

  // ---------- sky: sun, moon, stars, clouds
  const sunBall = new THREE.Mesh(new THREE.SphereGeometry(3, 24, 16), new THREE.MeshBasicMaterial({ color: '#ffe082', fog: false }));
  const moonBall = new THREE.Mesh(new THREE.SphereGeometry(2.2, 24, 16), new THREE.MeshBasicMaterial({ color: '#f3f0dc', fog: false }));
  scene.add(sunBall, moonBall);
  const sp = []; for (let i = 0; i < 400; i++) sp.push(-60 + rand() * 140, 8 + rand() * 50, -55);
  const sg = new THREE.BufferGeometry(); sg.setAttribute('position', new THREE.Float32BufferAttribute(sp, 3));
  const starMat = new THREE.PointsMaterial({ color: '#ffffff', size: 0.35, transparent: true, opacity: 0, fog: false });
  scene.add(new THREE.Points(sg, starMat));
  const clouds = new THREE.Group(); scene.add(clouds);
  const cloudMat = plastic('#ffffff', { transparent: true, opacity: 1 });
  for (const [x, y] of [[-12, 17], [6, 20], [20, 16]]) { const g = new THREE.Group(); brick(5, 2, 1, '', 0, 0, 0, true, g, cloudMat); brick(3, 2, 1, '', 0.4, BH, 0, true, g, cloudMat); g.position.set(x, y, -20); clouds.add(g); }

  // ---------- minifig fisherman (generic toy figure)
  const man = new THREE.Group(); scene.add(man);
  const yellow = plastic('#ffd500'), shirt = plastic('#2e7d32'), pants = plastic('#1e3a8a'), black = new THREE.MeshBasicMaterial({ color: '#111' });
  const mk = (geo, mat, x, y, z, parent) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.castShadow = true; parent.add(m); return m; };
  const hip = mk(new THREE.BoxGeometry(1.1, 0.3, 0.6), pants, 0, 1.35, 0, man);
  const legs = [-0.28, 0.28].map(x => { const p = new THREE.Group(); p.position.set(x, 1.3, 0); man.add(p); mk(new THREE.BoxGeometry(0.52, 1.2, 0.6), pants, 0, -0.6, 0, p); mk(new THREE.BoxGeometry(0.52, 0.2, 0.75), pants, 0, -1.2, 0.07, p); return p; });
  const torsoGeo = new THREE.CylinderGeometry(0.42, 0.62, 1.25, 4, 1); torsoGeo.rotateY(Math.PI / 4); torsoGeo.scale(1.2, 1, 0.62);
  const torso = mk(torsoGeo, shirt, 0, 2.12, 0, man);
  mk(new THREE.BoxGeometry(0.62, 0.9, 0.05), plastic('#8d6e63'), 0, 2.1, 0.36, man); // vest stripe
  mk(new THREE.CylinderGeometry(0.22, 0.22, 0.15, 16), yellow, 0, 2.82, 0, man); // neck
  const head = new THREE.Group(); head.position.set(0, 3.2, 0); man.add(head);
  mk(new THREE.CylinderGeometry(0.4, 0.4, 0.7, 28), yellow, 0, 0, 0, head);
  for (const x of [-0.14, 0.14]) mk(new THREE.SphereGeometry(0.055, 10, 8), black, x, 0.08, 0.38, head);
  const smile = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.025, 6, 16, Math.PI), black); smile.rotation.z = Math.PI; smile.position.set(0, -0.08, 0.39); head.add(smile);
  // bucket hat
  mk(new THREE.CylinderGeometry(0.62, 0.62, 0.06, 28), plastic('#c8a46a'), 0, 0.4, 0, head);
  mk(new THREE.CylinderGeometry(0.36, 0.44, 0.32, 28), plastic('#c8a46a'), 0, 0.56, 0, head);
  const arm = side => { const p = new THREE.Group(); p.position.set(side * 0.66, 2.62, 0); man.add(p);
    const a = mk(new THREE.CylinderGeometry(0.15, 0.17, 0.95, 12), shirt, 0, -0.42, 0.05, p); a.rotation.z = side * 0.18;
    const hand = new THREE.Group(); hand.position.set(side * 0.1, -0.95, 0.12); p.add(hand);
    mk(new THREE.TorusGeometry(0.13, 0.07, 8, 16), yellow, 0, 0, 0, hand).rotation.y = Math.PI / 2; return { p, hand }; };
  const armR = arm(1), armL = arm(-1);
  // fishing rod in right hand (points along +x when cast)
  const rod = new THREE.Group(); armR.hand.add(rod);
  const rodLen = 4.2; mk(new THREE.CylinderGeometry(0.03, 0.06, rodLen, 8), plastic('#4e342e'), 0, rodLen / 2, 0, rod);
  mk(new THREE.CylinderGeometry(0.14, 0.14, 0.12, 14), plastic('#9e9e9e'), 0, 0.5, 0.12, rod).rotation.x = Math.PI / 2;
  const rodTip = new THREE.Object3D(); rodTip.position.y = rodLen; rod.add(rodTip);
  // lantern in left hand (lit at night)
  const lantern = new THREE.Group(); armL.hand.add(lantern); lantern.position.set(0, -0.45, 0);
  mk(new THREE.CylinderGeometry(0.2, 0.2, 0.05, 6), plastic('#333'), 0, 0.3, 0, lantern);
  const lanternGlass = mk(new THREE.CylinderGeometry(0.17, 0.17, 0.42, 6), new THREE.MeshStandardMaterial({ color: '#ffe9a8', emissive: '#ffb347', emissiveIntensity: 0, transparent: true, opacity: 0.9 }), 0, 0.05, 0, lantern);
  mk(new THREE.CylinderGeometry(0.2, 0.2, 0.05, 6), plastic('#333'), 0, -0.18, 0, lantern);
  const lanternLight = new THREE.PointLight('#ffb347', 0, 9, 1.6); lantern.add(lanternLight);
  // fishing line + bobber
  const lineGeo = new THREE.BufferGeometry(); lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(32 * 3), 3));
  const line = new THREE.Line(lineGeo, new THREE.LineBasicMaterial({ color: '#f5f5f5' })); line.frustumCulled = false; scene.add(line);
  const bobber = new THREE.Group(); scene.add(bobber);
  mk(new THREE.SphereGeometry(0.18, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2), plastic('#e53935'), 0, 0, 0, bobber);
  mk(new THREE.SphereGeometry(0.18, 16, 10, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), plastic('#fafafa'), 0, 0, 0, bobber);
  const ripples = [0, 1, 2].map(() => { const m = new THREE.Mesh(new THREE.TorusGeometry(1, 0.03, 6, 40), new THREE.MeshBasicMaterial({ color: '#cfeaff', transparent: true })); m.rotation.x = Math.PI / 2; scene.add(m); return m; });
  // fish
  const fish = new THREE.Group(); scene.add(fish);
  const fishBody = new THREE.Mesh(new THREE.SphereGeometry(0.5, 20, 14), plastic('#ff8f00')); fishBody.scale.set(1, 0.55, 0.32); fishBody.castShadow = true; fish.add(fishBody);
  const tail = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.45, 4), plastic('#ff6f00')); tail.rotation.z = Math.PI / 2; tail.position.x = -0.6; tail.scale.z = 0.3; fish.add(tail);
  mk(new THREE.SphereGeometry(0.06, 8, 6), black, 0.3, 0.07, 0.15, fish); mk(new THREE.SphereGeometry(0.06, 8, 6), black, 0.3, 0.07, -0.15, fish);
  const splashDrops = []; for (let i = 0; i < 14; i++) { const d = new THREE.Mesh(new THREE.SphereGeometry(0.09, 8, 6), plastic('#bfe3ff', { transparent: true, opacity: 0.9 })); scene.add(d); splashDrops.push([d, rand() * Math.PI * 2, 1 + rand() * 1.5, 2 + rand() * 2]); }

  const C = { day: new THREE.Color('#8fd3ff'), dusk: new THREE.Color('#ff9e6b'), night: new THREE.Color('#0b1636') };
  const sky = new THREE.Color(), tmpV = new THREE.Vector3(), tipV = new THREE.Vector3();
  const DOCK_X = 9.6, HOME_X = -8.6, BOB_X = 15.2, BOB_Z = 1, WATER_Y = 0.32;

  function render(t) {
    // ----- day -> night (6.0 .. 7.3)
    const n = seg(t, 5.8, 7.3);
    if (n < 0.5) sky.copy(C.day).lerp(C.dusk, ease(n * 2)); else sky.copy(C.dusk).lerp(C.night, ease(n * 2 - 1));
    scene.background = sky; scene.fog.color.copy(sky);
    const sunA = lerp(1.15, -0.25, ease(n));
    sunBall.position.set(22, Math.sin(sunA) * 30 - 4, -50); sunBall.material.color.set(n < 0.4 ? '#ffe082' : '#ff7043');
    sun.position.set(20, Math.max(2, Math.sin(sunA) * 30), 18); sun.target.position.set(2, 0, 0);
    sun.intensity = lerp(2.6, 0, ease(clamp(n * 1.25))); sun.color.set(n < .3 ? '#fff4e0' : '#ffb27a');
    moonBall.position.set(-14, lerp(-6, 26, ease(seg(t, 6.3, 7.6))), -50);
    moonLight.intensity = lerp(0, 0.9, n); hemi.intensity = lerp(0.75, 0.22, n); hemi.color.set(n > .6 ? '#6f86c9' : '#ffffff');
    starMat.opacity = ease(seg(t, 6.7, 7.6));
    r.toneMappingExposure = 1.0; scene.environmentIntensity = lerp(1.0, 0.12, ease(n));
    const nightOn = ease(seg(t, 6.6, 7.2));
    winMat.emissiveIntensity = nightOn * 2.2; winLight.intensity = nightOn * 30; porchLight.intensity = nightOn * 20; lampMat.emissiveIntensity = nightOn * 3;
    lanternGlass.material.emissiveIntensity = nightOn * 3; lanternLight.intensity = nightOn * 16; lantern.visible = t > 6.4;
    clouds.position.x = t * 0.5; cloudMat.opacity = 1 - n * 0.85;

    // ----- fisherman path
    const x = keys(t, [[0, HOME_X], [0.4, HOME_X], [2.8, DOCK_X], [7.3, DOCK_X], [9.5, HOME_X + 0.6], [10, HOME_X + 0.6]]);
    const walking = (t > 0.4 && t < 2.8) || (t > 7.3 && t < 9.5);
    const z = keys(t, [[0, 1.6], [9.4, 1.6], [9.9, -0.6]]);
    man.position.set(x, 0.3 + (x > 5.6 ? 0.35 : 0) + (walking ? Math.abs(Math.sin(t * 11)) * 0.12 : 0), z);
    // facing: +x (to lake) then -x (home) then into house
    let yaw = keys(t, [[0, Math.PI / 2], [6.6, Math.PI / 2], [7.2, -Math.PI / 2], [9.4, -Math.PI / 2], [9.6, Math.PI]]);
    man.rotation.y = yaw;
    const swing = walking ? Math.sin(t * 11) * 0.6 : 0;
    legs[0].rotation.x = swing; legs[1].rotation.x = -swing;
    // joy jump after the catch
    const joy = seg(t, 5.4, 6.0); if (joy > 0 && joy < 1) man.position.y += Math.sin(joy * Math.PI) * 0.8;
    // right arm (rod): carry -> raise back -> cast forward -> hold -> pull up
    const castBack = seg(t, 2.9, 3.15), castFwd = seg(t, 3.15, 3.35), pull = seg(t, 4.5, 5.0);
    armR.p.rotation.x = walking ? -swing * 0.6 - 0.3 : lerp(-0.6, -2.4, ease(castBack)) + 1.6 * ease(castFwd) - 0.9 * ease(pull) * (t < 6.6 ? 1 : 0);
    if (t > 6.6) armR.p.rotation.x = -0.4 - swing * 0.4;
    rod.rotation.x = t < 2.9 || t > 6.6 ? 0.9 : lerp(0.9, 1.5, ease(castFwd)) - 0.6 * ease(pull);
    rod.visible = t < 6.8 || true;
    if (t > 6.6) rod.rotation.x = 1.25; // rod on shoulder going home
    armL.p.rotation.x = walking ? swing * 0.6 : (joy > 0 && joy < 1 ? -2.6 * Math.sin(joy * Math.PI) : -0.2);
    armL.p.rotation.z = 0;
    head.rotation.y = t > 3.4 && t < 4.4 ? Math.sin(t * 3) * 0.15 : 0;
    // door opens at the end, man disappears inside
    doorPivot.rotation.y = -1.6 * ease(seg(t, 9.2, 9.5)) + 1.6 * ease(seg(t, 9.85, 10));
    man.visible = t < 9.88;
    man.updateMatrixWorld(true);
    rodTip.getWorldPosition(tipV);

    // ----- bobber & line
    let bobOn = t > 3.2 && t < 5.05, bx, by, bz = BOB_Z;
    const fly = seg(t, 3.2, 3.55);
    if (fly < 1) { bx = lerp(tipV.x, BOB_X, fly); by = lerp(tipV.y, WATER_Y, fly) + Math.sin(fly * Math.PI) * 2.2; }
    else {
      const dip = t > 4.15 && t < 4.5 ? Math.sin((t - 4.15) * 40) * 0.12 - 0.1 : 0;
      bx = lerp(BOB_X, BOB_X - 2.5, ease(pull)); by = WATER_Y + Math.sin(t * 4) * 0.03 + dip;
    }
    bobber.visible = bobOn; bobber.position.set(bx, by, bz);
    // fish: jumps out 5.0-5.45 then hangs from the line / in hand
    const jump = seg(t, 5.0, 5.45);
    fish.visible = t > 5.0;
    if (t > 5.0) {
      if (t < 6.6) {
        const hx = tipV.x, hy = tipV.y - 1.1;
        fish.position.set(lerp(BOB_X - 2.5, hx, ease(jump)), lerp(WATER_Y, hy, ease(jump)) + Math.sin(jump * Math.PI) * 1.5, BOB_Z);
        fish.rotation.set(0, 0, -Math.PI / 2 + Math.sin(t * 18) * 0.35 * (1 - seg(t, 5.6, 6.4)));
      } else { // carried home on the line, swinging gently
        fish.position.set(tipV.x, tipV.y - 1.0, tipV.z); fish.rotation.set(0, 0, -Math.PI / 2 + Math.sin(t * 6) * 0.2);
      }
    }
    const lineEnd = t > 5.0 ? tmpV.set(fish.position.x + (t < 6.6 ? 0 : 0), fish.position.y + 0.5, fish.position.z) : tmpV.set(bx, by + 0.15, bz);
    line.visible = t > 3.18 && t < 9.88;
    const pos = lineGeo.attributes.position;
    const sag = t > 5.0 ? 0 : (fly < 1 ? 0.3 : 0.9 * (1 - ease(pull)) + 0.05);
    for (let i = 0; i < 32; i++) { const k = i / 31; pos.setXYZ(i, lerp(tipV.x, lineEnd.x, k), lerp(tipV.y, lineEnd.y, k) - Math.sin(k * Math.PI) * sag, lerp(tipV.z, lineEnd.z, k)); }
    pos.needsUpdate = true;
    // ripples
    ripples.forEach((rp, i) => {
      const start = [3.55, 4.15, 5.0][i], k = seg(t, start, start + 1.2);
      rp.visible = k > 0 && k < 1; const cx = i === 2 ? BOB_X - 2.5 : BOB_X;
      rp.position.set(cx, WATER_Y + 0.02, BOB_Z); rp.scale.setScalar(0.2 + k * 1.6); rp.material.opacity = 1 - k;
    });
    splashDrops.forEach(([d, a, sp, up]) => { const k = seg(t, 5.0, 5.8); d.visible = k > 0 && k < 1; d.position.set(BOB_X - 2.5 + Math.cos(a) * sp * k, WATER_Y + up * k - 4.5 * k * k, BOB_Z + Math.sin(a) * sp * k * 0.6); });

    // ----- camera: follows the man, frames bobber while fishing
    const cx = keys(t, [[0, -6], [0.6, -6], [2.8, 10.6], [5.6, 11.2], [6.4, 10.4], [7.3, 9], [9.4, -6.6], [10, -6.8]]);
    const cz = keys(t, [[0, 21], [3, 22], [5.3, 18.5], [6.3, 20], [9.4, 21], [10, 17.5]]);
    cam.position.set(cx + 2.5, 8.2, cz + 3.5); cam.lookAt(cx, 2.2, 0);
    r.render(scene, cam);
  }
  return { render };
}

window.LegoFilm = { create };
