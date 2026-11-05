// Shared helpers for the 3D style scenes (PS2, CGI, Brick, What-If).
import * as THREE from 'three';

export function makeRenderer(canvas, { pixelRatio = 2, shadows = true, tone = true } = {}) {
  const r = new THREE.WebGLRenderer({ canvas, antialias: pixelRatio >= 1, preserveDrawingBuffer: true });
  r.setPixelRatio(pixelRatio);
  r.setSize(540, 960, false);
  if (shadows) { r.shadowMap.enabled = true; r.shadowMap.type = THREE.PCFSoftShadowMap; }
  if (tone) { r.toneMapping = THREE.ACESFilmicToneMapping; r.toneMappingExposure = 1.0; }
  return r;
}

// Side-profile car built from extruded shapes. `low` = few curve segments (PS2 look).
export function makeCar({ body, glass, tire, rim, low = false, bevel = true }) {
  const g = new THREE.Group();
  const seg = low ? 2 : 16;
  const s = new THREE.Shape();
  s.moveTo(-2.2, 0.25);
  s.lineTo(-2.25, 0.75);
  s.quadraticCurveTo(-2.2, 0.95, -1.7, 1.0);
  s.lineTo(-0.9, 1.05);
  s.quadraticCurveTo(-0.5, 1.6, 0.1, 1.62);
  s.quadraticCurveTo(0.8, 1.62, 1.1, 1.08);
  s.quadraticCurveTo(2.0, 1.0, 2.25, 0.75);
  s.lineTo(2.25, 0.3);
  s.lineTo(-2.2, 0.25);
  const ext = { depth: 1.7, bevelEnabled: bevel, bevelThickness: 0.12, bevelSize: 0.1, bevelSegments: low ? 1 : 6, curveSegments: seg };
  const bodyGeo = new THREE.ExtrudeGeometry(s, ext);
  bodyGeo.translate(0, 0, -0.85);
  const bodyMesh = new THREE.Mesh(bodyGeo, body);
  bodyMesh.castShadow = true;
  g.add(bodyMesh);
  // windows
  const w = new THREE.Shape();
  w.moveTo(-0.8, 1.08); w.quadraticCurveTo(-0.45, 1.52, 0.1, 1.54); w.quadraticCurveTo(0.7, 1.54, 0.98, 1.08); w.lineTo(-0.8, 1.08);
  const wg = new THREE.ExtrudeGeometry(w, { depth: 1.78, bevelEnabled: false, curveSegments: seg });
  wg.translate(0, 0, -0.89);
  g.add(new THREE.Mesh(wg, glass));
  // wheels
  const tg = new THREE.CylinderGeometry(0.42, 0.42, 0.32, low ? 8 : 40);
  tg.rotateX(Math.PI / 2);
  const rg = new THREE.CylinderGeometry(0.24, 0.24, 0.34, low ? 6 : 32);
  rg.rotateX(Math.PI / 2);
  g.wheels = [];
  for (const [x, z] of [[-1.35, 0.85], [1.4, 0.85], [-1.35, -0.85], [1.4, -0.85]]) {
    const wh = new THREE.Group();
    const t = new THREE.Mesh(tg, tire); t.castShadow = true; wh.add(t);
    wh.add(new THREE.Mesh(rg, rim));
    wh.position.set(x, 0.42, z);
    g.add(wh); g.wheels.push(wh);
  }
  return g;
}

export function boot(render) {
  window.renderAt = render;
  if (!window.__frozen) { const t0 = performance.now(); (function loop() { render((performance.now() - t0) / 1000); requestAnimationFrame(loop); })(); }
  window.__ready = true;
}
