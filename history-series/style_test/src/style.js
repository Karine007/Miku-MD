// Style test: soft matte pastel 3D (mannequin people, clean pastel rooms, gradient skies, karaoke captions).
// index.html?s=1..10  each number = one scene + one small style variant.
import * as THREE from 'three';
import { RoundedBoxGeometry } from '../node_modules/three/examples/jsm/geometries/RoundedBoxGeometry.js';

const S = +(new URLSearchParams(location.search).get('s') || 1);
// variant knobs per picture
const V = {
  1: { name: 'Soft matte' },
  2: { name: 'Smooth satin', mat: 'std' },
  3: { name: 'Cel bands', mat: 'toon' },
  4: { name: 'Faceted', flat: true },
  5: { name: 'Ink outline', outline: true },
  6: { name: 'Paper grain', grain: true },
  7: { name: 'Chunky figures', chunky: true },
  8: { name: 'Golden film', warm: true, grain: true },
  9: { name: 'Tall mannequin', tall: 1.12 },
  10: { name: 'High-key pastel', bright: 1.18 },
}[S];

// ---------- renderer ----------
const W = 1920, H = 1080;
const R = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
R.setPixelRatio(1); R.setSize(W, H); R.outputColorSpace = THREE.SRGBColorSpace;
R.toneMapping = THREE.NoToneMapping; R.shadowMap.enabled = true; R.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.prepend(R.domElement);
const scene = new THREE.Scene();
const cam = new THREE.PerspectiveCamera(36, W / H, .05, 300);
const b = V.bright || 1;
const hemi = new THREE.HemisphereLight(V.warm ? '#fff0dc' : '#f3f1ff', V.warm ? '#a98a6c' : '#a99c9a', 1.55 * b); scene.add(hemi);
const key = new THREE.DirectionalLight(V.warm ? '#ffd9a6' : '#fff6ea', 1.25 * b); key.castShadow = true;
key.shadow.mapSize.set(2048, 2048); key.shadow.radius = 6; key.shadow.bias = -.0005; key.shadow.normalBias = .02;
Object.assign(key.shadow.camera, { left: -14, right: 14, top: 14, bottom: -14, near: .5, far: 80 });
scene.add(key, key.target);
const amb = new THREE.AmbientLight('#ffffff', .35 * b); scene.add(amb);
if (V.grain) document.getElementById('grain').style.display = 'block';
if (V.warm) document.getElementById('vig').style.display = 'block';

// ---------- materials ----------
const toonGrad = (() => { const d = new Uint8Array([90, 170, 255]); const t = new THREE.DataTexture(d, 3, 1, THREE.RedFormat); t.minFilter = t.magFilter = THREE.NearestFilter; t.needsUpdate = true; return t; })();
const cache = {};
function M(c, o = {}) {
  const k = c + JSON.stringify(o); if (cache[k] && !o.map) return cache[k];
  let m;
  const base = Object.assign({ color: c }, o);
  if (o.basic) { delete base.basic; m = new THREE.MeshBasicMaterial(base); }
  else if (V.mat === 'toon') m = new THREE.MeshToonMaterial(Object.assign(base, { gradientMap: toonGrad }));
  else if (V.mat === 'std') m = new THREE.MeshStandardMaterial(Object.assign({ roughness: .55, metalness: 0 }, base));
  else m = new THREE.MeshLambertMaterial(Object.assign({ flatShading: !!V.flat }, base));
  if (V.mat === 'std' && V.flat) m.flatShading = true;
  return cache[k] = m;
}
const outlineMat = new THREE.MeshBasicMaterial({ color: '#2a2230', side: THREE.BackSide });
outlineMat.onBeforeCompile = s => { s.vertexShader = s.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\n transformed += normal * 0.022;'); };

function mesh(geo, c, x = 0, y = 0, z = 0, o) {
  const m = new THREE.Mesh(geo, typeof c === 'string' ? M(c, o) : c); m.position.set(x, y, z); m.castShadow = true; m.receiveShadow = true; return m;
}
const seg = V.flat ? .45 : 1;
const box = (w, h, d, c, x, y, z, o) => mesh(new THREE.BoxGeometry(w, h, d), c, x, y, z, o);
const rbox = (w, h, d, r, c, x, y, z, o) => mesh(new RoundedBoxGeometry(w, h, d, V.flat ? 1 : 3, r), c, x, y, z, o);
const cyl = (rt, rb_, h, c, x, y, z, n = 24) => mesh(new THREE.CylinderGeometry(rt, rb_, h, Math.max(6, n * seg | 0)), c, x, y, z);
const sph = (r, c, x, y, z, sx = 1, sy = 1, sz = 1, n = 24) => { const m = mesh(new THREE.SphereGeometry(r, Math.max(8, n * seg | 0), Math.max(6, n * .7 * seg | 0)), c, x, y, z); m.scale.set(sx, sy, sz); return m; };
const capsule = (r, l, c, x, y, z) => mesh(new THREE.CapsuleGeometry(r, l, V.flat ? 2 : 5, V.flat ? 7 : 14), c, x, y, z);
const G = (...a) => { const g = new THREE.Group(); a.forEach(o => o && g.add(o)); return g; };
const at = (o, x, y, z, ry = 0) => { o.position.set(x, y, z); o.rotation.y = ry; return o; };

// ---------- canvas textures ----------
function canvasTex(w, h, draw, rep) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); draw(g, w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  if (rep) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(...rep); } return t;
}
const F = (px, w = 900) => `${w} ${px}px Nunito`;
function noise(g, w, h, a = .05) { for (let i = 0; i < w * h / 60; i++) { g.fillStyle = `rgba(${Math.random() < .5 ? '0,0,0' : '255,255,255'},${Math.random() * a})`; g.fillRect(Math.random() * w, Math.random() * h, 2, 2); } }
const checker = (c1, c2, n) => canvasTex(256, 256, (g, w, h) => { for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) { g.fillStyle = (i + j) % 2 ? c2 : c1; g.fillRect(i * 128, j * 128, 128, 128); } noise(g, w, h, .03); }, [n, n]);
const planks = (c, n) => canvasTex(512, 512, (g, w, h) => { g.fillStyle = c; g.fillRect(0, 0, w, h); for (let i = 0; i < 8; i++) { g.fillStyle = `rgba(0,0,0,${.03 + (i % 3) * .02})`; g.fillRect(0, i * 64, w, 64); g.fillStyle = 'rgba(0,0,0,.12)'; g.fillRect(0, i * 64, w, 2); g.fillRect(((i * 197) % 400) + 50, i * 64, 2, 64); } noise(g, w, h, .04); }, [n, n]);
const flat = (c, n = 1) => canvasTex(256, 256, (g, w, h) => { g.fillStyle = c; g.fillRect(0, 0, w, h); noise(g, w, h, .035); }, [n, n]);
const siding = c => canvasTex(256, 256, (g, w, h) => { g.fillStyle = c; g.fillRect(0, 0, w, h); for (let i = 0; i < 16; i++) { g.fillStyle = 'rgba(0,0,0,.09)'; g.fillRect(0, i * 16 + 13, w, 3); g.fillStyle = 'rgba(255,255,255,.08)'; g.fillRect(0, i * 16, w, 2); } }, [3, 2]);
function textTex(lines, o = {}) {
  const w = o.w || 1024, h = o.h || 256;
  return canvasTex(w, h, (g) => {
    g.fillStyle = o.bg || '#fff'; if (o.bg !== 'none') g.fillRect(0, 0, w, h);
    if (o.draw) o.draw(g, w, h);
    g.textAlign = o.align || 'center'; g.textBaseline = 'middle';
    lines.forEach(([t, px, col, y, wt, x]) => { g.font = F(px, wt || 900); g.fillStyle = col; g.fillText(t, x ?? (o.align === 'left' ? 40 : w / 2), y); });
    if (o.noise !== false) noise(g, w, h, .025);
  });
}
const panel = (w, h, tex, x, y, z, ry = 0) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), M('#ffffff', { map: tex })); m.position.set(x, y, z); m.rotation.y = ry; m.receiveShadow = true; return m; };

// ---------- sky ----------
function sky(top, mid, bot, clouds = true) {
  scene.background = canvasTex(64, 1024, (g, w, h) => {
    const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, top); gr.addColorStop(.55, mid); gr.addColorStop(1, bot); g.fillStyle = gr; g.fillRect(0, 0, w, h);
  });
  if (!clouds) return;
  const ct = canvasTex(1024, 256, (g, w, h) => {
    g.fillStyle = 'rgba(255,255,255,.55)';
    [[180, 120, 170, 22], [300, 100, 120, 18], [700, 150, 220, 20], [860, 128, 120, 16]].forEach(([x, y, rx, ry]) => { g.beginPath(); g.ellipse(x, y, rx, ry, 0, 0, 7); g.fill(); });
  });
  const cl = new THREE.Mesh(new THREE.PlaneGeometry(220, 55), new THREE.MeshBasicMaterial({ map: ct, transparent: true, depthWrite: false, fog: false }));
  cl.position.set(0, 34, -110); scene.add(cl);
}

// ---------- people ----------
const SKIN = ['#f2d0b5', '#e6b993', '#c9946c', '#97643f', '#6e4429'];
function person(o = {}) {
  const g = new THREE.Group();
  const tall = (V.tall || 1) * (o.kid ? .72 : 1), ch = V.chunky ? 1.32 : 1;
  const skin = o.skin || SKIN[0], top = o.top || '#4a6fc4', pants = o.pants || '#2e3550', shoe = o.shoe || '#2a2a30';
  const legLen = .82 * tall, hipY = legLen + .05;
  // legs with knee pivots
  const mkLeg = (s) => {
    const hip = new THREE.Group(); hip.position.set(s * .085 * ch, hipY, 0);
    const thigh = cyl(.068 * ch, .06 * ch, legLen / 2, o.dress ? skin : pants, 0, -legLen / 4, 0, 14); hip.add(thigh);
    const knee = new THREE.Group(); knee.position.y = -legLen / 2; hip.add(knee);
    knee.add(cyl(.058 * ch, .05 * ch, legLen / 2, o.dress ? skin : pants, 0, -legLen / 4, 0, 14));
    knee.add(sph(.075 * ch, shoe, 0, -legLen / 2 - .01, .05, 1, .62, 1.6, 16));
    hip.userData.knee = knee; return hip;
  };
  const legL = mkLeg(-1), legR = mkLeg(1); g.add(legL, legR);
  // torso (tapered, jacket)
  const tH = .58 * (o.kid ? .8 : 1) * (V.chunky ? 1.05 : 1);
  const torso = rbox(.38 * ch, tH + .08, .25 * ch, .1, top, 0, hipY + tH / 2 - .02, 0); g.add(torso);
  g.add(sph(.16 * ch, o.dress || pants, 0, hipY + .03, 0, 1.05, .45, .72, 16));
  if (o.dress) { const sk = cyl(.17 * ch, .27 * ch, .42, o.dress, 0, hipY - .12, 0, 20); sk.scale.z = .8; g.add(sk); }
  if (o.shirt !== false) { // V of shirt under jacket lapels
    const v = new THREE.Mesh(new THREE.CircleGeometry(.075, 3), M(o.shirt || '#f6f2ee')); v.rotation.z = -Math.PI / 2; v.scale.set(1.5, .9, 1);
    v.position.set(0, hipY + tH - .06, .127 * ch); g.add(v);
    if (o.tie) g.add(box(.035, .16, .01, o.tie, 0, hipY + tH - .14, .131 * ch));
  }
  const shY = hipY + tH - .02;
  g.add(sph(.08 * ch, top, -.17 * ch, shY - .04, 0, 1, .8, 1, 14), sph(.08 * ch, top, .17 * ch, shY - .04, 0, 1, .8, 1, 14));
  // arms
  const mkArm = (s) => {
    const a = new THREE.Group(); a.position.set(s * .22 * ch, shY - .04, 0);
    a.add(capsule(.052 * ch, .22, o.sleeve || top, 0, -.15, 0));
    const el = new THREE.Group(); el.position.y = -.29; a.add(el);
    el.add(capsule(.046 * ch, .2, o.sleeve || top, 0, -.12, 0), sph(.048 * ch, skin, 0, -.28, 0, .85, 1.1, .7, 12));
    a.userData.el = el; a.rotation.z = s * .08; return a;
  };
  const armL = mkArm(-1), armR = mkArm(1); g.add(armL, armR);
  // neck + head
  g.add(cyl(.045 * ch, .05 * ch, .1, skin, 0, shY + .05, 0, 12));
  const head = new THREE.Group(); head.position.y = shY + .2 * (V.chunky ? 1.1 : 1); g.add(head);
  const hs = V.chunky ? 1.28 : 1;
  head.add(sph(.125 * hs, skin, 0, 0, 0, .88, 1.12, .94, 28));
  head.add(sph(.03 * hs, skin, -.112 * hs, 0, 0, .5, 1, .8, 10), sph(.03 * hs, skin, .112 * hs, 0, 0, .5, 1, .8, 10));
  const fz = .113 * hs;
  for (const s of [-1, 1]) {
    head.add(sph(.013 * hs, '#231c1c', s * .042 * hs, .012 * hs, fz, 1, 1.25, .5, 10));
    const br = box(.042 * hs, .009 * hs, .01, o.hair || '#3b2a20', s * .043 * hs, .045 * hs, fz - .004); br.rotation.z = -s * (o.brow ?? .12); head.add(br);
  }
  head.add(sph(.016 * hs, skin, 0, -.012 * hs, fz + .01, .9, 1.2, 1, 10));
  const mo = box(.042 * hs, .006 * hs, .01, o.mouth || '#a5545a', 0, -.05 * hs, fz - .006); head.add(mo);
  if (o.smile) { mo.scale.set(1.2, 1.4, 1); }
  if (o.stache) head.add(rbox(.07 * hs, .018 * hs, .02, .008, o.hair || '#3b2a20', 0, -.033 * hs, fz - .002));
  if (o.glasses) {
    const gm = M(o.glasses);
    for (const s of [-1, 1]) { const r = new THREE.Mesh(new THREE.TorusGeometry(.03 * hs, .0045 * hs, 6, 24), gm); r.position.set(s * .043 * hs, .012 * hs, fz + .01); head.add(r); }
    head.add(box(.025 * hs, .004 * hs, .004, o.glasses, 0, .016 * hs, fz + .012));
  }
  // hair
  const hc = o.hair || '#3b2a20', hst = o.hairStyle || 'short';
  if (hst !== 'bald') {
    if (hst === 'beanie') head.add(sph(.134 * hs, o.beanie || '#e8579a', 0, .03 * hs, -.008, .93, .95, 1, 24));
    else head.add(sph(.132 * hs, hc, 0, .03 * hs, -.022 * hs, .93, 1.07, .98, 24));
    if (hst === 'bob') { const bb = cyl(.122 * hs, .132 * hs, .16 * hs, hc, 0, -.03 * hs, -.03 * hs, 24); bb.scale.z = .92; head.add(bb); }
    if (hst === 'long') { const l = rbox(.24 * hs, .34 * hs, .1, .05, hc, 0, -.1 * hs, -.07 * hs); head.add(l); }
    if (hst === 'bun') head.add(sph(.06 * hs, hc, 0, .08 * hs, -.12 * hs, 1, 1, 1, 14));
    if (hst === 'side') head.add(sph(.06 * hs, hc, .05 * hs, .1 * hs, .06 * hs, 1.6, .5, 1, 14));
  }
  if (o.cap) { head.add(cyl(.13 * hs, .13 * hs, .06, o.cap, 0, .1 * hs, 0)); head.add(box(.15 * hs, .012, .1, o.cap, 0, .075 * hs, .1 * hs)); head.add(sph(.02, '#e2c35a', 0, .11 * hs, .128 * hs, 1, 1, .4)); }
  if (o.coat) { const c = cyl(.205 * ch, .23 * ch, .95 * tall, o.coat, 0, hipY + tH - .44 * tall, -.005, 20); c.scale.z = .7; g.add(c); }
  g.userData = { armL, armR, legL, legR, head };
  if (V.outline) { const ms = []; g.traverse(m => { if (m.isMesh) { m.geometry.computeBoundingSphere(); if (m.geometry.boundingSphere.radius * Math.max(m.scale.x, m.scale.y, m.scale.z) > .06) ms.push(m); } }); ms.forEach(m => { const ol = new THREE.Mesh(m.geometry, outlineMat); ol.castShadow = false; m.add(ol); }); }
  return g;
}
const sit = (p, h = .48) => { const u = p.userData; for (const l of [u.legL, u.legR]) { l.rotation.x = -Math.PI / 2; l.userData.knee.rotation.x = Math.PI / 2; } p.position.y += h - (u.legL.position.y); return p; };
const pose = (p, aL = [0, 0, 0], aR = [0, 0, 0], eL = 0, eR = 0) => { const u = p.userData; u.armL.rotation.set(...aL); u.armR.rotation.set(...aR); u.armL.userData.el.rotation.x = eL; u.armR.userData.el.rotation.x = eR; return p; };

// ---------- props ----------
function room(o) {
  const g = new THREE.Group(); const w = o.w || 10, d = o.d || 8, h = o.h || 3.2;
  const fl = new THREE.Mesh(new THREE.PlaneGeometry(w, d), M('#fff', { map: o.floor })); fl.rotation.x = -Math.PI / 2; fl.receiveShadow = true; g.add(fl);
  const wm = M('#fff', { map: o.wallTex || flat(o.wall) });
  const back = new THREE.Mesh(new THREE.PlaneGeometry(w, h), wm); back.position.set(0, h / 2, -d / 2); back.receiveShadow = true; g.add(back);
  for (const s of [-1, 1]) { const sd = new THREE.Mesh(new THREE.PlaneGeometry(d, h), M('#fff', { map: o.wallTex || flat(o.side || o.wall) })); sd.rotation.y = -s * Math.PI / 2; sd.position.set(s * w / 2, h / 2, 0); sd.receiveShadow = true; g.add(sd); }
  g.add(box(w, .12, .04, o.trim || '#ffffff', 0, .06, -d / 2 + .02));
  if (o.ceil) { const c = new THREE.Mesh(new THREE.PlaneGeometry(w, d), M(o.ceil)); c.rotation.x = Math.PI / 2; c.position.y = h; g.add(c); }
  scene.add(g); return g;
}
function windowBlinds(w, h, x, y, z, o = {}) {
  const g = new THREE.Group();
  g.add(box(w + .12, h + .12, .06, o.frame || '#ffffff', 0, 0, 0));
  g.add(panel(w, h, canvasTex(256, 256, (c, W_, H_) => { const gr = c.createLinearGradient(0, 0, 0, H_); gr.addColorStop(0, o.sky1 || '#9ec9ef'); gr.addColorStop(1, o.sky2 || '#d9eef7'); c.fillStyle = gr; c.fillRect(0, 0, W_, H_); c.fillStyle = o.hill || '#8fc47e'; c.fillRect(0, H_ * .78, W_, H_); }), 0, 0, .035));
  if (o.blinds !== false) for (let i = 0; i < 9; i++) g.add(box(w, .022, .03, '#f4f4f2', 0, h / 2 - .05 - i * (h * .055), .06));
  g.add(box(.04, h, .02, o.frame || '#ffffff', 0, 0, .05), box(w, .04, .02, o.frame || '#ffffff', 0, 0, .05));
  if (o.curtain) for (const s of [-1, 1]) g.add(rbox(.32, h + .3, .08, .03, o.curtain, s * (w / 2 + .1), -.05, .1));
  return at(g, x, y, z);
}
function frame(w, h, x, y, z, draw, col = '#e9d9e6') { return G(box(w + .08, h + .08, .04, '#f8f6f2', x, y, z), panel(w, h, canvasTex(256, 256 * h / w | 0, (g, W_, H_) => { g.fillStyle = col; g.fillRect(0, 0, W_, H_); draw && draw(g, W_, H_); }), x, y, z + .025)); }
const smiley = (g, w, h, c = '#e8579a') => { g.fillStyle = '#f4c9a8'; g.beginPath(); g.arc(w / 2, h * .48, w * .2, 0, 7); g.fill(); g.fillStyle = c; g.fillRect(w * .3, h * .22, w * .4, h * .1); g.fillRect(w * .26, h * .72, w * .48, h * .22); g.fillStyle = '#333'; g.fillRect(w * .42, h * .46, 6, 6); g.fillRect(w * .56, h * .46, 6, 6); };
function clock(x, y, z, r = .22) {
  const t = canvasTex(256, 256, (g, w, h) => { g.fillStyle = '#fff'; g.beginPath(); g.arc(128, 128, 120, 0, 7); g.fill(); g.strokeStyle = '#333'; g.lineWidth = 10; g.stroke(); g.lineWidth = 6; g.lineCap = 'round'; for (let i = 0; i < 12; i++) { const a = i / 12 * 6.283; g.beginPath(); g.moveTo(128 + Math.sin(a) * 96, 128 - Math.cos(a) * 96); g.lineTo(128 + Math.sin(a) * 108, 128 - Math.cos(a) * 108); g.stroke(); } g.lineWidth = 9; g.beginPath(); g.moveTo(128, 128); g.lineTo(128, 52); g.moveTo(128, 128); g.lineTo(176, 150); g.stroke(); });
  const c = cyl(r, r, .05, '#ffffff', x, y, z, 32); c.rotation.x = Math.PI / 2; const f = new THREE.Mesh(new THREE.CircleGeometry(r * .97, 32), M('#fff', { map: t })); f.position.set(x, y, z + .03); return G(c, f);
}
function desk(w, d, x, z, c = '#7a4a2c', ry = 0) { const g = G(box(w, .06, d, c, 0, .76, 0)); for (const sx of [-1, 1]) for (const sz of [-1, 1]) g.add(box(.06, .76, .06, c, sx * (w / 2 - .06), .38, sz * (d / 2 - .06))); return at(g, x, 0, z, ry); }
function chair(x, z, ry = 0, c = '#3c3f4a') { const g = G(rbox(.5, .08, .5, .03, c, 0, .46, 0), rbox(.5, .55, .07, .03, c, 0, .75, -.22), cyl(.03, .03, .42, '#555', 0, .23, 0), cyl(.25, .25, .03, '#555', 0, .02, 0)); return at(g, x, 0, z, ry); }
function plant(x, z, s = 1) { return at(G(cyl(.16 * s, .12 * s, .3 * s, '#c9744e', 0, .15 * s, 0), sph(.28 * s, '#5e9e5a', 0, .55 * s, 0, 1, 1.2, 1), sph(.2 * s, '#6db368', .12 * s, .75 * s, .05, 1, 1.1, 1)), x, 0, z); }
function tree(x, z, s = 1) { return at(G(cyl(.12 * s, .16 * s, 1.6 * s, '#7a5236', 0, .8 * s, 0, 10), sph(1.1 * s, '#4f9a4f', 0, 2.3 * s, 0), sph(.85 * s, '#5aa957', .7 * s, 2.0 * s, .3 * s), sph(.8 * s, '#468c48', -.6 * s, 2.1 * s, -.2 * s)), x, 0, z); }
function house(x, z, o = {}) {
  const g = new THREE.Group(); const w = o.w || 8, d = o.d || 6, h = 2.8;
  const wall = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), M('#fff', { map: siding(o.wall || '#b9636a') })); wall.position.y = h / 2 + .3; wall.castShadow = wall.receiveShadow = true; g.add(wall);
  g.add(box(w + .2, .3, d + .2, '#d9d4cc', 0, .15, 0));
  const roof = new THREE.Mesh(new THREE.ConeGeometry(Math.hypot(w, d) / 2 * 1.08, 1.7, 4, 1), M(o.roof || '#5d5866')); roof.rotation.y = Math.PI / 4; roof.scale.set(1, 1, d / w); roof.position.y = h + .3 + .85; roof.castShadow = true; g.add(roof);
  g.add(box(1.0, 2.0, .08, '#fdfdfb', 0, 1.3, d / 2 + .02), box(.82, 1.85, .05, o.door || '#f5f2ec', 0, 1.25, d / 2 + .06));
  for (const s of [-1, 1]) { const wx = s * w * .3; g.add(windowBlinds(1.3, 1.1, wx, 1.9, d / 2 + .02, { blinds: false, sky1: '#3c5a86', sky2: '#6f8fbf', hill: '#3c5a86' })); g.add(box(.25, 1.25, .06, o.shutter || '#7d2f3d', wx - s * -.8, 1.9, d / 2 + .05), box(.25, 1.25, .06, o.shutter || '#7d2f3d', wx + s * -.8, 1.9, d / 2 + .05)); }
  if (o.porch !== false) { g.add(box(w * .7, .2, 1.6, '#c8a27a', 0, .4, d / 2 + .8)); for (const s of [-1, 1]) g.add(box(.1, 2.5, .1, '#f6f2ec', s * w * .33, 1.6, d / 2 + 1.5)); g.add(box(w * .72, .12, 1.8, '#eae6df', 0, 2.9, d / 2 + .85)); }
  if (o.wreath) { const t = new THREE.Mesh(new THREE.TorusGeometry(.18, .05, 8, 20), M('#3f8a48')); t.position.set(0, 1.75, d / 2 + .1); g.add(t); }
  return at(g, x, 0, z, o.ry || 0);
}
function car(x, z, ry, c = '#3b5fa8', police) {
  const g = G(rbox(2.0, .55, 4.2, .2, c, 0, .55, 0), rbox(1.7, .5, 2.2, .18, police ? '#f6f6f4' : c, 0, 1.05, -.2));
  g.add(rbox(1.72, .36, 2.0, .1, '#9fb6d6', 0, 1.06, -.2));
  for (const sx of [-1, 1]) for (const sz of [-1.3, 1.3]) { const wh = cyl(.36, .36, .26, '#26262c', sx * .95, .36, sz, 18); wh.rotation.z = Math.PI / 2; g.add(wh); }
  if (police) { g.add(rbox(2.02, .3, 4.22, .1, '#f6f6f4', 0, .7, 0), box(.5, .14, .26, '#e53b3b', -.3, 1.38, -.2), box(.5, .14, .26, '#3b6be5', .3, 1.38, -.2)); }
  return at(g, x, 0, z, ry);
}
function ground(c = '#7fbf6a', s = 200) { const m = new THREE.Mesh(new THREE.PlaneGeometry(s, s), M('#fff', { map: flat(c, 8) })); m.rotation.x = -Math.PI / 2; m.receiveShadow = true; scene.add(m); return m; }
function strip(w, d, c, x, z, y = .01, tex) { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), M('#fff', { map: tex || flat(c) })); m.rotation.x = -Math.PI / 2; m.position.set(x, y, z); m.receiveShadow = true; scene.add(m); return m; }

// ---------- overlays ----------
function overlay({ words = [], cur = -1, name, pill, pillColor }) {
  document.getElementById('cap').innerHTML = words.map((w, i) => `<span class="${i < cur ? 'on' : i === cur ? 'cur' : ''}">${w}</span>`).join(' ');
  if (name) { const n = document.getElementById('name'); n.style.display = 'block'; n.querySelector('b').textContent = name[0]; n.querySelector('i').textContent = name[1]; }
  if (pill) { const p = document.getElementById('pill'); p.style.display = 'block'; p.textContent = pill; if (pillColor) p.style.color = pillColor; }
  document.getElementById('badge').textContent = S + ' · ' + V.name;
}
function shot(p, l, fov = 36) { cam.position.set(...p); cam.fov = fov; cam.updateProjectionMatrix(); cam.lookAt(...l); }
function sun(x, y, z, tx = 0, ty = 0, tz = 0) { key.position.set(x, y, z); key.target.position.set(tx, ty, tz); }

// ---------- the 10 scenes (Elizabeth Holmes / Theranos as the test story) ----------
const HOLMES = { skin: SKIN[0], hair: '#d9b26a', hairStyle: 'bun', top: '#232327', pants: '#232327', shirt: '#232327', mouth: '#9b5058' };
const SC = {
  // 1 founder's office, name card
  1() {
    sky('#cfd8ea', '#ece9ef', '#f6efe8', false);
    room({ w: 9, d: 7, wall: '#d9cfe6', side: '#cfc3e0', floor: flat('#cdb9a6', 3) });
    scene.add(windowBlinds(2.2, 1.5, -2.4, 1.9, -3.46, { curtain: '#e98fb3' }));
    scene.add(frame(.7, .9, 1.2, 2.0, -3.47, smiley), frame(.6, .6, 2.3, 2.1, -3.47, (g, w, h) => { g.fillStyle = '#e8579a'; g.fillRect(w * .3, h * .3, w * .4, h * .4); }, '#f3e3a1'));
    scene.add(clock(3.4, 2.4, -3.45));
    scene.add(desk(2.6, 1.1, .3, -1.2, '#8a5634'));
    const lap = G(box(.5, .02, .34, '#c9ccd4', 0, .8, 0), box(.5, .32, .02, '#c9ccd4', 0, .96, -.16), panel(.46, .28, flat('#8fb6e8'), 0, .96, -.148)); scene.add(at(lap, 1.1, 0, -1.2, Math.PI + .5));
    scene.add(chair(.3, -2.1, 0));
    const h = person({ ...HOLMES }); scene.add(sit(at(h, .3, 0, -2.0))); pose(h, [-.9, 0, .1], [-.9, 0, -.1], -.4, -.4);
    scene.add(plant(-3.8, -2.8, 1.3), plant(3.8, -2.8, 1));
    sun(4, 9, 6, 0, 0, -1.5);
    shot([0.1, 1.45, 1.5], [0.3, 1.2, -2], 40);
    overlay({ words: ['She', 'was', 'only', '19'], cur: 3, name: ['ELIZABETH HOLMES', 'THE FOUNDER'] });
  },
  // 2 lab with the Edison box
  2() {
    sky('#d6e2ee', '#eef1f4', '#f4f4f2', false);
    room({ w: 10, d: 7, wall: '#d4e6ea', side: '#c6dde3', floor: checker('#eef1f2', '#d9e1e6', 7) });
    for (let i = 0; i < 3; i++) scene.add(windowBlinds(1.4, 1.4, -3 + i * 2.2, 2.0, -3.46, {}));
    const bench = G(box(5, .08, 1, '#e9eef0', 0, .92, 0), box(5, .88, .9, '#c1d0d8', 0, .44, 0)); scene.add(at(bench, 0, 0, -2.6));
    const ed = G(rbox(.7, .9, .55, .06, '#f4f4f4', 0, 1.42, 0), rbox(.5, .32, .02, .02, '#20252d', 0, 1.55, .28), panel(.44, .24, textTex([['EDISON', 70, '#7fd0ff', 128]], { bg: '#20252d', w: 512, h: 256 }), 0, 1.55, .295), box(.4, .08, .3, '#d9dde2', 0, 1.0, .1));
    scene.add(at(ed, -.4, 0, -2.6));
    for (let i = 0; i < 6; i++) scene.add(cyl(.035, .035, .16, ['#e86a8a', '#6aa8e8', '#f0c35a'][i % 3], 1.0 + i * .14, 1.04, -2.5, 10));
    const tech = person({ skin: SKIN[2], hair: '#1d1714', hairStyle: 'short', top: '#7aa9d8', pants: '#3a4560', coat: '#fafafa', glasses: '#333' });
    scene.add(at(tech, 1.4, 0, -1.6, -.5)); pose(tech, [-.6, 0, .2], [0, 0, -.1], -.9, 0);
    const h = person({ ...HOLMES }); scene.add(at(h, -1.6, 0, -1.3, .4)); pose(h, [0, 0, .08], [-.5, 0, -.3], 0, -1.2);
    sun(3, 9, 6, 0, 0, -2);
    shot([0, 1.7, 3.6], [-.1, 1.25, -2], 40);
    overlay({ words: ['A', 'single', 'drop', 'of', 'blood'], cur: 2, pill: 'THE EDISON', pillColor: '#2f7de1' });
  },
  // 3 suburban street with neighbours
  3() {
    sky('#9fc3ec', '#cfe0f2', '#f2ede6');
    ground('#7dbd67'); strip(200, 8, '#5b5d66', 0, 9); for (let i = -10; i < 10; i++) strip(2, .18, '#f1d65a', i * 5, 9, .02);
    strip(200, 2, '#d7d2c9', 0, 4.2, .015); strip(2.2, 6, '#d7d2c9', 0, 0, .016);
    scene.add(house(0, -4, { wall: '#b5636c', wreath: true }), house(-11, -5, { wall: '#9fb3c9', shutter: '#3f5a7d', ry: .1 }), house(11, -5, { wall: '#e2c58f', shutter: '#8a5a2c', ry: -.1 }));
    scene.add(tree(-5.5, -1.5, 1.1), tree(6, -2, 1));
    const h = person({ ...HOLMES, top: '#ffffff', pants: '#2c2f3a', shirt: '#ffffff' }); scene.add(at(h, -.6, 0, 1.6, .1));
    const m = person({ skin: SKIN[0], hair: '#6b4a32', hairStyle: 'bob', top: '#5c79c9', pants: '#2e3550', glasses: '#333', smile: 1 }); scene.add(at(m, .6, 0, 1.3, -.2)); pose(m, [0, 0, .1], [-.3, 0, -.5], 0, -1.3);
    const n = person({ skin: SKIN[3], hair: '#1d1714', top: '#d64545', pants: '#2b2f3b', cap: '#2f3d2f' }); scene.add(at(n, -3.2, 0, .2, .4)); pose(n, [0, 0, .1], [0, 0, 2.5], 0, -.5);
    scene.add(car(6.5, 9, Math.PI / 2, '#3b5fa8'));
    sun(-6, 12, 8);
    shot([.2, 1.8, 7.8], [0, 1.6, 0], 38);
    overlay({ words: ['A', 'quiet', 'neighbourhood.'], cur: 2 });
  },
  // 4 kitchen, checker floor, father at table
  4() {
    sky('#e9e3d6', '#f2ece2', '#f6f1ea', false);
    room({ w: 8, d: 6, wall: '#f1d98f', side: '#ead08a', floor: checker('#f4f0ea', '#cf3b3b', 5) });
    const tiles = canvasTex(256, 128, (g, w, h) => { g.fillStyle = '#f6f4ee'; g.fillRect(0, 0, w, h); for (let i = 0; i < 8; i++) for (let j = 0; j < 4; j++) if ((i + j) % 3 === 0) { g.fillStyle = '#5aa86a'; g.fillRect(i * 32 + 2, j * 32 + 2, 28, 28); } else { g.fillStyle = '#e9e6de'; g.fillRect(i * 32 + 2, j * 32 + 2, 28, 28); } });
    tiles.wrapS = THREE.RepeatWrapping; tiles.repeat.set(4, 1);
    scene.add(panel(8, 1.0, tiles, 0, 1.45, -2.98));
    scene.add(G(box(6, .92, .7, '#7a4a2c', 0, .46, -2.6), box(6, .06, .74, '#e9e3d8', 0, .95, -2.6)));
    for (let i = 0; i < 5; i++) scene.add(sph(.03, '#e2c35a', -2.4 + i * 1.2, .7, -2.24));
    scene.add(box(1.4, .8, .5, '#7a4a2c', 2.4, 2.5, -2.75), box(1.4, .8, .5, '#7a4a2c', -2.4, 2.5, -2.75));
    scene.add(windowBlinds(1.6, 1.1, 0, 2.3, -2.97, { blinds: false, curtain: '#d94c4c' }));
    scene.add(panel(.7, .9, textTex([['MARCH', 90, '#c43b3b', 70], ['', 1, '#000', 0]], { w: 256, h: 330, draw: (g, w, h) => { g.fillStyle = '#c43b3b'; g.fillRect(0, 0, w, 30); g.fillStyle = '#ccc'; for (let i = 0; i < 5; i++) for (let j = 0; j < 7; j++) g.fillRect(16 + j * 33, 140 + i * 36, 24, 24); } }), 2.6, 1.6, -2.97));
    const tex = canvasTex(256, 256, (g, w, h) => { g.fillStyle = '#b84444'; g.fillRect(0, 0, w, h); g.strokeStyle = 'rgba(40,10,10,.35)'; g.lineWidth = 6; for (let i = 0; i < 9; i++) { g.beginPath(); g.moveTo(i * 32, 0); g.lineTo(i * 32, h); g.stroke(); g.beginPath(); g.moveTo(0, i * 32); g.lineTo(w, i * 32); g.stroke(); } });
    const tbl = G(box(2.2, .06, 1.3, M('#fff', { map: tex }), 0, .76, 0)); for (const sx of [-1, 1]) for (const sz of [-1, 1]) tbl.add(box(.08, .76, .08, '#6e3f22', sx * 1, .38, sz * .55)); scene.add(at(tbl, 0, 0, -.6));
    scene.add(panel(.5, .22, textTex([['$1,200', 60, '#2b5b35', 128]], { bg: '#cfe8cf', w: 512, h: 256 }), -.2, .8, -.4).rotateX(-Math.PI / 2));
    scene.add(panel(.4, .26, flat('#ffffff'), .5, .795, -.5).rotateX(-Math.PI / 2));
    scene.add(chair(0, -1.5, 0, '#6e3f22'));
    const f = person({ skin: SKIN[1], hair: '#4a3020', hairStyle: 'short', top: '#3f7a52', pants: '#2e3550', stache: 1, shirt: '#f2efe8' });
    scene.add(sit(at(f, 0, 0, -1.4))); pose(f, [-.8, 0, .25], [-.8, 0, -.25], -.5, -.5);
    sun(3, 8, 6, 0, 0, -1);
    shot([0, 1.7, 2.6], [0, 1.1, -1.5], 40);
    overlay({ words: ['Her', 'father', 'paid', 'every', 'month'], cur: 1, name: ['CHRISTIAN HOLMES', 'THE FATHER'] });
  },
  // 5 courtroom
  5() {
    sky('#e7e1d6', '#efe8dc', '#f3ede4', false);
    room({ w: 12, d: 9, h: 4, wall: '#efe4cf', side: '#e6d8bf', floor: flat('#4b5f8a', 4), ceil: '#f4efe6' });
    const wood = planks('#7b4b2c', 2);
    scene.add(G(box(12, 1.4, .1, M('#fff', { map: wood }), 0, .7, -4.44)));
    const bench = G(box(4, 1.5, 1, M('#fff', { map: wood }), 0, .75, 0), box(4.2, .1, 1.1, '#5e3820', 0, 1.52, 0)); scene.add(at(bench, 0, 0, -3.4));
    scene.add(panel(3.4, .5, textTex([['SUPERIOR COURT', 120, '#e9d29a', 128]], { bg: '#5e3820', w: 1024, h: 256 }), 0, 3.3, -4.48));
    const seal = cyl(.6, .6, .05, '#c9a54a', 0, 2.5, -4.46, 40); seal.rotation.x = Math.PI / 2; scene.add(seal);
    const fl = G(cyl(.025, .025, 2.6, '#c9a54a', 0, 1.3, 0)); const flag = box(.9, .6, .02, '#2b4fa8', .46, 2.2, 0); fl.add(flag); scene.add(at(fl, 2.6, 0, -4.1));
    const judge = person({ skin: SKIN[0], hair: '#cfcfd2', hairStyle: 'short', top: '#1e1e22', glasses: '#333' }); scene.add(sit(at(judge, 0, .6, -4.0))); pose(judge, [-.7, 0, .1], [-.7, 0, -.1], -.6, -.6);
    const stand = G(box(1.2, .9, .9, M('#fff', { map: wood }), 0, .55, 0)); scene.add(at(stand, -2.6, 0, -2.6));
    const h = person({ ...HOLMES, top: '#2a2d3a', shirt: '#f2efe8' }); scene.add(sit(at(h, -2.6, 0, -3.05), .62)); pose(h, [-.5, 0, .1], [-.5, 0, -.1], -.5, -.5);
    const table = desk(3, 1, 1.6, -.4, '#6e3f22'); scene.add(table);
    scene.add(box(.5, .08, .35, '#e8dcc0', 1.4, .83, -.4));
    for (let i = 0; i < 2; i++) { const l = person({ skin: SKIN[i ? 3 : 1], hair: '#2a2020', top: i ? '#3a4a6a' : '#5a5a62', tie: '#7a2030' }); scene.add(sit(at(l, 1.0 + i * 1.2, 0, .6, Math.PI))); }
    sun(2, 10, 5, 0, 0, -2);
    shot([-.1, 1.75, 2.8], [-1.1, 1.45, -3.2], 40);
    overlay({ words: ['Guilty', 'on', 'four', 'counts'], cur: 2, pill: 'IN COURT', pillColor: '#7b4b2c' });
  },
  // 6 stage keynote with big screen and audience
  6() {
    sky('#2a1f44', '#3a2b5c', '#4a3a6a', false);
    room({ w: 16, d: 12, h: 6, wall: '#3b2f5e', side: '#33284f', floor: flat('#2d2547', 4) });
    const st = G(box(8, .6, 3.5, '#4a3b6e', 0, .3, 0), box(8, .04, 3.5, '#5b4a85', 0, .62, 0)); scene.add(at(st, 0, 0, -4));
    const scr = panel(6.5, 3.4, textTex([['THERANOS', 170, '#ffffff', 300], ['ONE TINY DROP', 64, '#f3c4dd', 450, 800]], { w: 1280, h: 680, draw: (g, w, h) => { const gr = g.createRadialGradient(w / 2, h / 2, 50, w / 2, h / 2, w * .6); gr.addColorStop(0, '#8a3fd1'); gr.addColorStop(1, '#3a1a6a'); g.fillStyle = gr; g.fillRect(0, 0, w, h); for (let i = 0; i < 70; i++) { g.fillStyle = 'rgba(255,255,255,.5)'; g.fillRect(Math.random() * w, Math.random() * h, 3, 3); } } }), 0, 3.4, -5.9);
    scr.material = new THREE.MeshBasicMaterial({ map: scr.material.map }); scene.add(scr);
    const h = person({ ...HOLMES }); scene.add(at(h, .4, .62, -3.6, -.1)); pose(h, [0, 0, .08], [-1.1, 0, -.4], 0, -1);
    const spot = new THREE.SpotLight('#ffe9f4', 40, 20, .35, .6); spot.position.set(.4, 7, 1); spot.target.position.set(.4, 0, -3.6); spot.castShadow = true; scene.add(spot, spot.target);
    const cols = ['#d64545', '#3f7a52', '#5c79c9', '#e2b84a', '#8a5ac9', '#2e3550'];
    for (let r = 0; r < 3; r++) for (let i = -4; i <= 4; i++) { const p = person({ skin: SKIN[(i + r + 9) % 5], hair: ['#1d1714', '#6b4a32', '#d8b06a'][(i + r + 9) % 3], hairStyle: ['short', 'bob', 'bun'][(i * 7 + r + 30) % 3], top: cols[(i + r * 2 + 12) % 6] }); scene.add(sit(at(p, i * .9 + (r % 2) * .4, 0, 0 + r * 1.2, Math.PI))); }
    hemi.intensity *= .45; key.intensity *= .35; amb.intensity *= .6;
    sun(0, 10, 6, 0, 0, -3);
    shot([0, 2.6, 6.4], [0, 2.4, -4], 42);
    overlay({ words: ['The', 'next', 'Steve', 'Jobs?'], cur: 2, pill: 'THE KEYNOTE', pillColor: '#8a3fd1' });
  },
  // 7 reporter at desk with documents
  7() {
    sky('#d8dde8', '#ecebef', '#f4f1ec', false);
    room({ w: 9, d: 7, wall: '#cfdcee', side: '#c3d2e8', floor: flat('#b9a28c', 3) });
    const cork = canvasTex(512, 320, (g, w, h) => { g.fillStyle = '#c99a62'; g.fillRect(0, 0, w, h); noise(g, w, h, .15); [['#f6e58a', 40, 40], ['#f7c2d6', 190, 60], ['#bfe3f7', 330, 30], ['#f6e58a', 100, 180], ['#c9f0c0', 300, 170]].forEach(([c, x, y]) => { g.fillStyle = c; g.fillRect(x, y, 110, 90); g.fillStyle = '#d43b3b'; g.beginPath(); g.arc(x + 55, y + 8, 7, 0, 7); g.fill(); }); g.strokeStyle = '#d43b3b'; g.lineWidth = 3; g.beginPath(); g.moveTo(95, 48); g.lineTo(245, 68); g.lineTo(155, 188); g.lineTo(355, 178); g.stroke(); });
    scene.add(G(box(2.6, 1.6, .05, '#8a5a34', 1.2, 2.0, -3.46), panel(2.5, 1.5, cork, 1.2, 2.0, -3.43)));
    scene.add(windowBlinds(1.6, 1.4, -2.6, 2.0, -3.46, {}));
    scene.add(desk(2.6, 1.2, 0, -1.2, '#6e4428'));
    scene.add(G(box(.7, .45, .05, '#22262e', -.9, 1.2, -1.6), box(.06, .3, .06, '#22262e', -.9, .93, -1.6), panel(.64, .38, textTex([['DRAFT', 80, '#334', 90], ['', 1, '#000', 0]], { bg: '#f2f4f8', w: 512, h: 300, draw: (g) => { g.fillStyle = '#c8cdd6'; for (let i = 0; i < 5; i++) g.fillRect(40, 150 + i * 26, 300 + (i * 53) % 120, 12); } }), -.9, 1.2, -1.57)));
    const papers = canvasTex(256, 320, (g, w, h) => { g.fillStyle = '#fbfaf6'; g.fillRect(0, 0, w, h); g.fillStyle = '#bbb'; for (let i = 0; i < 12; i++) g.fillRect(20, 30 + i * 22, 200 - (i % 4) * 30, 8); g.strokeStyle = '#d43b3b'; g.lineWidth = 5; g.beginPath(); g.ellipse(120, 140, 80, 22, 0, 0, 7); g.stroke(); });
    [[-.8, -.9, .2], [.7, -.85, -.3], [.9, -1.0, .1]].forEach(([x, z, r]) => { const p = panel(.32, .4, papers, x, .795, z); p.rotation.set(-Math.PI / 2, 0, r); scene.add(p); });
    scene.add(chair(0, -.25, Math.PI));
    const rep = person({ skin: SKIN[0], hair: '#2a2020', hairStyle: 'short', top: '#2a4a7a', pants: '#2e3550', glasses: '#222', shirt: '#eef2f8' });
    scene.add(sit(at(rep, 0, 0, -.35, Math.PI))); pose(rep, [-.9, 0, .2], [-.9, 0, -.2], -.6, -.6);
    sun(-3, 8, 5, 0, 0, -1.5);
    shot([2.4, 1.9, -3.0], [-.2, 1.1, -.3], 42);
    overlay({ words: ['One', 'reporter', 'started', 'digging'], cur: 1, name: ['JOHN CARREYROU', 'THE REPORTER'] });
  },
  // 8 night: police at the house
  8() {
    sky('#0f1630', '#22284a', '#3b3460');
    ground('#2f5a3a'); strip(200, 8, '#2c2e38', 0, 9); strip(200, 2, '#7f7c78', 0, 4.2, .015); strip(2.2, 6, '#7f7c78', 0, 0, .016);
    scene.add(house(0, -4, { wall: '#7e3f4a', shutter: '#4a1f2a', wreath: true }));
    scene.add(tree(-6, -2, 1.1), tree(6.5, -2.5, 1));
    scene.add(car(-3.2, 7.6, .25, '#ffffff', true), car(3.6, 8.0, -.3, '#ffffff', true));
    for (let i = 0; i < 2; i++) { const c = person({ skin: SKIN[i * 3], hair: '#1d1714', top: '#1f2b4d', pants: '#1a2440', cap: '#1f2b4d' }); scene.add(at(c, -1 + i * 2, 0, 1.4 + i * .3, i ? -.3 : .3)); }
    const red = new THREE.PointLight('#ff3b3b', 30, 14); red.position.set(-3.5, 1.6, 7.4); const blue = new THREE.PointLight('#3b6bff', 30, 14); blue.position.set(3.9, 1.6, 7.8); scene.add(red, blue);
    const win = new THREE.PointLight('#ffd27a', 6, 6); win.position.set(0, 1.8, -.4); scene.add(win);
    hemi.color.set('#5a66a0'); hemi.groundColor.set('#1a1830'); hemi.intensity = .7 * b; key.color.set('#8fa0e0'); key.intensity = .45 * b; amb.intensity = .2;
    sun(-6, 12, 8);
    shot([.4, 2.4, 13], [0, 1.6, 0], 36);
    overlay({ words: ['Then', 'the', 'FBI', 'arrived.'], cur: 2, pill: 'JUNE 2018', pillColor: '#2a3a7a' });
  },
  // 9 TV studio interview
  9() {
    sky('#2b1d48', '#4a2a6a', '#6a3a7a', false);
    room({ w: 12, d: 9, h: 5, wall: '#4a2f78', side: '#3d2766', floor: flat('#3a2a5a', 4) });
    const bg = panel(8, 3.6, textTex([['MAD MONEY MAKERS', 110, '#ffffff', 250], ['THE INTERVIEW', 52, '#f7c6e0', 360, 800]], { w: 1280, h: 576, draw: (g, w, h) => { const gr = g.createLinearGradient(0, 0, w, h); gr.addColorStop(0, '#6a2fb0'); gr.addColorStop(1, '#c03f8a'); g.fillStyle = gr; g.fillRect(0, 0, w, h); for (let i = 0; i < 90; i++) { g.fillStyle = 'rgba(255,255,255,.45)'; g.beginPath(); g.arc(Math.random() * w, Math.random() * h, Math.random() * 3 + 1, 0, 7); g.fill(); } } }), 0, 2.4, -4.4);
    bg.material = new THREE.MeshBasicMaterial({ map: bg.material.map }); scene.add(bg);
    const arm = G(rbox(1, .45, .9, .15, '#c7c2cf', 0, .3, 0), rbox(1, .6, .2, .08, '#c7c2cf', 0, .7, -.38));
    scene.add(at(arm.clone(), -1.1, 0, -2, .5), at(arm.clone(), 1.1, 0, -2, -.5));
    scene.add(cyl(.35, .35, .5, '#2a2240', 0, .25, -1.6), cyl(.06, .06, .14, '#e86a8a', 0, .57, -1.6));
    const h = person({ ...HOLMES }); scene.add(sit(at(h, -1.1, 0, -1.95, .5), .6)); pose(h, [-.7, 0, .15], [-.9, 0, -.2], -.6, -.9);
    const host = person({ skin: SKIN[3], hair: '#1d1714', top: '#3a3f6a', tie: '#c03f8a', shirt: '#eef' }); scene.add(sit(at(host, 1.1, 0, -1.95, -.5), .6)); pose(host, [-.7, 0, .2], [-.7, 0, -.2], -.6, -.6);
    hemi.intensity *= .8;
    sun(2, 9, 7, 0, 0, -2);
    shot([0, 1.6, 4.2], [0, 1.25, -2], 40);
    overlay({ words: ['Millions', 'watched', 'her', 'interview'], cur: 0, pill: 'ON LIVE TV', pillColor: '#c03f8a' });
  },
  // 10 close-up of the indictment document on a desk
  10() {
    sky('#e8e2d8', '#efe9e0', '#f2ede6', false);
    const tbl = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), M('#fff', { map: planks('#8a5a38', 3) })); tbl.rotation.x = -Math.PI / 2; tbl.receiveShadow = true; scene.add(tbl);
    const folder = box(2.3, .03, 3.0, '#d8b98a', -.2, .015, .1); folder.rotation.y = .12; scene.add(folder);
    const doc = canvasTex(820, 1060, (g, w, h) => {
      g.fillStyle = '#fbfaf5'; g.fillRect(0, 0, w, h); g.strokeStyle = '#7a8fb8'; g.lineWidth = 10; g.strokeRect(30, 30, w - 60, h - 60);
      g.fillStyle = '#334'; g.textAlign = 'center'; g.font = F(34, 800); g.fillText('UNITED STATES DISTRICT COURT', w / 2, 120); g.font = F(26, 800); g.fillText('NORTHERN DISTRICT OF CALIFORNIA', w / 2, 165);
      g.font = F(64, 900); g.fillStyle = '#1e2433'; g.fillText('INDICTMENT', w / 2, 280);
      g.textAlign = 'left'; g.font = F(30, 800); g.fillStyle = '#444'; g.fillText('UNITED STATES v.', 90, 380); g.fillText('ELIZABETH A. HOLMES', 90, 425);
      g.fillStyle = '#c7c7c7'; for (let i = 0; i < 9; i++) g.fillRect(90, 500 + i * 42, 640 - (i % 3) * 90, 14);
      g.font = F(30, 800); g.fillStyle = '#444'; g.fillText('WIRE FRAUD · 11 COUNTS', 90, 920);
      g.strokeStyle = '#d43b3b'; g.lineWidth = 6; g.beginPath(); g.ellipse(250, 912, 200, 40, 0, 0, 7); g.stroke();
      g.strokeStyle = '#c0392b'; g.lineWidth = 5; g.beginPath(); g.arc(650, 940, 70, 0, 7); g.stroke(); g.font = F(22, 900); g.fillStyle = '#c0392b'; g.textAlign = 'center'; g.fillText('FILED', 650, 948);
    });
    const p = panel(1.8, 2.33, doc, -.1, .04, .05); p.rotation.set(-Math.PI / 2, 0, .2); scene.add(p);
    const pen = G(cyl(.03, .03, 1.1, '#20262e', 0, 0, 0, 12), cyl(.03, .005, .12, '#c9a54a', 0, -.6, 0, 12)); pen.rotation.set(Math.PI / 2, 0, -.9); pen.position.set(1.2, .05, .3); scene.add(pen);
    const mug = G(cyl(.22, .2, .45, '#e8579a', 0, .225, 0), new THREE.Mesh(new THREE.TorusGeometry(.12, .035, 8, 18), M('#e8579a'))); mug.children[1].position.set(.24, .25, 0); mug.children[1].rotation.y = Math.PI / 2; scene.add(at(mug, 1.5, 0, -1.2));
    sun(-3, 8, 4);
    shot([.6, 3.1, 2.3], [-.1, 0, .05], 40);
    overlay({ words: ['Eleven', 'counts', 'of', 'fraud.'], cur: 0, pill: 'CASE FILE', pillColor: '#7b4b2c' });
  },
};

await document.fonts.load(F(60)); await document.fonts.load(F(30, 800));
SC[S]();
R.render(scene, cam);
window.READY = true;
