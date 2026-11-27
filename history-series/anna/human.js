// Softer, more natural low-poly people: rounded head and body, real eyes (white, iris, pupil, highlight),
// eyebrows, nose, lips, ears, several hair styles, dresses, suits, glasses. Same userData as kit.person():
// { armL, armR, legL, legR, head, torso } plus { eyes, mouth, brows } for blinking and talking.
import { THREE, M, grp } from './kit.js';

const SM = (c, o = {}) => M(c, Object.assign({ flatShading: false, roughness: .62 }, o));
function m(geo, c, x = 0, y = 0, z = 0, mat) {
  const o = new THREE.Mesh(geo, mat || SM(c)); o.position.set(x, y, z); o.castShadow = true; o.receiveShadow = true; return o;
}
const cap = (r, l, c, x, y, z) => m(new THREE.CapsuleGeometry(r, l, 6, 14), c, x, y, z);
const ball = (r, c, x, y, z, sx = 1, sy = 1, sz = 1, seg = 20) => { const o = m(new THREE.SphereGeometry(r, seg, seg * 3 / 4 | 0), c, x, y, z); o.scale.set(sx, sy, sz); return o; };
import { RoundedBoxGeometry } from './node_modules/three/examples/jsm/geometries/RoundedBoxGeometry.js';
const rb = (w, h, d, r, c, x, y, z) => m(new RoundedBoxGeometry(w, h, d, 4, r), c, x, y, z);

export const SKINS2 = ['#f3cfb3', '#e7b48f', '#c98e66', '#9a6342', '#6b4229', '#f6d9c4'];
export const HAIRS = { black: '#1d1714', brown: '#4a2f1f', auburn: '#a2502a', blonde: '#d8b06a', copper: '#c2652e', grey: '#9a9aa2', dark: '#2b1d14' };

export function human(o = {}) {
  const g = new THREE.Group();
  const skin = o.skin || SKINS2[1], hair = o.hair || HAIRS.brown, fem = !!o.female;
  const top = o.dress || o.suit || o.coat || o.top || '#4a78c9', bottom = o.bottom || (o.suit || '#2d3446');
  const shW = fem ? .46 : .56;
  // legs (pivot at hip)
  const legC = o.dress || o.skirt ? skin : bottom, legR_ = o.dress || o.skirt ? .062 : .092;
  const mkLeg = () => grp(cap(legR_, .62, legC, 0, -.4, 0),
    o.heels ? grp(rb(.13, .1, .26, .04, o.shoe || '#18181c', 0, -.79, .05), m(new THREE.CylinderGeometry(.02, .02, .1), o.shoe || '#18181c', 0, -.8, -.06))
      : rb(.17, .12, .3, .05, o.shoe || '#1c1c20', 0, -.78, .05));
  const legL = mkLeg(); legL.position.set(fem ? -.1 : -.12, .86, 0); const legR = mkLeg(); legR.position.set(fem ? .1 : .12, .86, 0);
  g.add(legL, legR);
  // hips / skirt
  if (o.dress || o.skirt) { const sk = m(new THREE.CylinderGeometry(.23, o.flare ?? .36, .6, 22), o.skirt || o.dress, 0, .7, 0); g.add(sk); }
  else g.add(rb(fem ? .42 : .48, .22, .28, .1, bottom, 0, .9, 0));
  // torso
  const torso = rb(shW, fem ? .62 : .66, fem ? .28 : .32, .13, top, 0, 1.24, 0); g.add(torso);
  if (o.suit) {
    g.add(m(new THREE.CylinderGeometry(.0, .11, .34, 3), o.shirt || '#f4f4f4', 0, 1.39, .155)); g.children.at(-1).rotation.set(0, 0, Math.PI);
    g.add(rb(.06, .34, .02, .01, o.tie || '#8a1c2b', 0, 1.33, .17));
  }
  if (o.coat) { g.add(rb(shW + .04, .5, .05, .02, o.coat, 0, 1.0, .0)); }
  if (o.necklace) g.add(m(new THREE.TorusGeometry(.1, .012, 6, 20, Math.PI), o.necklace, 0, 1.52, .13, M(o.necklace, { metalness: .8, roughness: .3, flatShading: false })).rotateZ(Math.PI));
  if (o.badge) g.add(rb(.1, .1, .02, .01, o.badge, .15, 1.38, .16));
  if (o.bag) { const b = grp(rb(.26, .2, .09, .04, o.bag, 0, -.68, .08)); g.userData.bag = b; }
  // arms (pivot at shoulder)
  const sleeve = o.sleeve || top;
  const mkArm = () => grp(cap(.07, .4, sleeve, 0, -.26, 0), ball(.068, skin, 0, -.6, 0, .9, 1.15, .75));
  const armL = mkArm(); armL.position.set(-(shW / 2 + .05), 1.5, 0); const armR = mkArm(); armR.position.set(shW / 2 + .05, 1.5, 0);
  if (g.userData.bag) armL.add(g.userData.bag);
  g.add(armL, armR);
  // head
  const head = new THREE.Group(); head.position.y = 1.56; g.add(head);
  head.add(m(new THREE.CylinderGeometry(.065, .075, .18, 14), skin, 0, .06, 0));
  const skull = ball(.25, skin, 0, .31, 0, .92, 1.12, .98, 32); head.add(skull);
  // ears
  head.add(ball(.05, skin, -.235, .3, -.01, .45, 1, .8), ball(.05, skin, .235, .3, -.01, .45, 1, .8));
  // eyes
  const iris = o.eyes || '#5a3a22'; const eyes = new THREE.Group(); eyes.position.set(0, .33, 0); head.add(eyes);
  const W_ = SM('#fbfbf8', { roughness: .3 }), P_ = SM('#0b0b0d', { roughness: .2 }), HL = M('#ffffff', { emissive: '#ffffff', emissiveIntensity: 1, flatShading: false });
  for (const s of [-1, 1]) {
    const e = new THREE.Group(); e.position.set(s * .085, 0, .2);
    const wh = ball(.048, '#fbfbf8', 0, 0, 0, 1, .82, .55); wh.material = W_; e.add(wh);
    e.add(ball(.029, iris, 0, -.002, .02, 1, 1, .5));
    e.add(m(new THREE.SphereGeometry(.015, 12, 8), null, 0, -.002, .032, P_));
    e.add(m(new THREE.SphereGeometry(.0065, 8, 6), null, .01, .01, .037, HL));
    if (fem) { const l = rb(.1, .014, .02, .006, '#1a1416', 0, .036, .012); l.rotation.z = -s * .12; e.add(l); }
    eyes.add(e);
  }
  // brows
  const brows = [-1, 1].map(s => { const b = rb(.1, .022, .02, .009, o.brow || hair, s * .088, .41, .225); b.rotation.z = -s * .1; head.add(b); return b; });
  // nose
  head.add(ball(.03, o.nose || skin, 0, .26, .245, .85, 1.1, 1), ball(.02, skin, 0, .31, .235, .8, 1.6, .8));
  // mouth
  const mouth = new THREE.Group(); mouth.position.set(0, .175, .228); head.add(mouth);
  const lip = o.lips || (fem ? '#b8545c' : '#a8665c');
  const ul = ball(.026, lip, 0, 0, -.004, 1.45, .5, .4, 16); const ll = cap(.0045, .055, '#5a1f24', 0, .001, .006); ll.rotation.z = Math.PI / 2;
  mouth.add(ul, ll);
  if (o.smile) { const sm = m(new THREE.TorusGeometry(.045, .009, 6, 16, Math.PI * .8), '#6b2a2e', 0, .02, .006); sm.rotation.z = Math.PI + Math.PI * .1; mouth.add(sm); ul.visible = ll.visible = false; }
  // facial hair
  if (o.beard) { const bd = ball(.2, hair, 0, .2, .04, 1.05, .8, 1); head.add(bd); bd.scale.set(1.12, .78, 1.02); bd.position.set(0, .17, .02); mouth.position.z = .262; }
  if (o.stache) head.add(rb(.12, .025, .03, .012, hair, 0, .205, .24));
  // hair styles
  const hs = o.hairStyle || (fem ? 'long' : 'short');
  if (hs !== 'bald') {
    const capG = new THREE.SphereGeometry(.268, 28, 14, 0, Math.PI * 2, 0, Math.PI * .55);
    const hc = m(capG, hair, 0, .33, -.01); hc.scale.set(.96, 1.12, 1.05); hc.rotation.x = -.42; head.add(hc);
    if (hs === 'long' || hs === 'wavy') {
      head.add(rb(.5, .64, .17, .08, hair, 0, .12, -.13));
      head.add(rb(.1, .52, .18, .05, hair, -.215, .16, -.02), rb(.1, .52, .18, .05, hair, .215, .16, -.02));
    } else if (hs === 'bob') {
      head.add(rb(.52, .32, .2, .08, hair, 0, .25, -.1), rb(.1, .3, .2, .05, hair, -.22, .25, .0), rb(.1, .3, .2, .05, hair, .22, .25, .0));
    } else if (hs === 'bun') {
      head.add(ball(.11, hair, 0, .52, -.2)); head.add(rb(.48, .22, .14, .07, hair, 0, .33, -.17));
    } else if (hs === 'slick') {
      head.add(rb(.44, .1, .42, .05, hair, 0, .53, -.02));
    } else if (hs === 'curly') {
      for (let i = 0; i < 14; i++) { const a = i / 14 * Math.PI * 2; head.add(ball(.09, hair, Math.cos(a) * .22, .45 + Math.sin(i * 1.7) * .05, Math.sin(a) * .2 - .03)); }
    } else head.add(rb(.46, .2, .12, .06, hair, 0, .36, -.18));
  }
  if (o.glasses) {
    const gc = o.glasses === true ? '#141414' : o.glasses; const GM = M(gc, { flatShading: false, roughness: .35 });
    for (const s of [-1, 1]) { const r = m(new THREE.TorusGeometry(.058, o.thick ? .014 : .008, 8, 24), null, s * .087, .33, .262, GM); head.add(r); }
    head.add(m(new THREE.BoxGeometry(.06, .012, .012), null, 0, .34, .265, GM));
    if (o.shades) for (const s of [-1, 1]) head.add(m(new THREE.CircleGeometry(.056, 20), null, s * .087, .33, .262, M('#101418', { transparent: true, opacity: .85, flatShading: false })));
  }
  if (o.hat) head.add(m(new THREE.CylinderGeometry(.27, .27, .2, 20), o.hat, 0, .6, 0), m(new THREE.CylinderGeometry(.42, .42, .02, 24), o.hat, 0, .5, 0));
  if (o.cap) { head.add(m(new THREE.SphereGeometry(.27, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2), o.cap, 0, .4, 0), rb(.28, .03, .22, .01, o.cap, 0, .42, .3)); }
  if (o.earrings) for (const s of [-1, 1]) head.add(m(new THREE.SphereGeometry(.018, 10, 8), null, s * .24, .22, .0, M('#e8c25a', { metalness: .9, roughness: .25, flatShading: false })));
  head.traverse(x => { if (x.isMesh) x.receiveShadow = false; });
  g.userData = { armL, armR, legL, legR, head, torso, eyes, mouth, brows, blinkOff: (o.seed || 0) * 1.37 };
  return g;
}

// blink every few seconds, talk = mouth moves
export function blink(p, lt) { const k = ((lt + p.userData.blinkOff) % 3.6); p.userData.eyes.scale.y = k < .12 ? .12 : 1; }
export function talk(p, lt, on = true) { p.userData.mouth.scale.y = on ? 1 + Math.abs(Math.sin(lt * 11)) * 1.4 * (Math.sin(lt * 2.3) > -.3 ? 1 : 0) : 1; }
export function idle(p, lt, a = 1) {
  const { head, armL, armR, torso } = p.userData; head.rotation.y = Math.sin(lt * .7 + p.userData.blinkOff) * .12 * a; head.rotation.z = Math.sin(lt * .5) * .03 * a;
  armL.rotation.z = -.06 - Math.sin(lt * 1.1) * .02; armR.rotation.z = .06 + Math.sin(lt * 1.1) * .02; blink(p, lt);
}
// characters used across the story
export const CAST = {
  anna: (x = {}) => human(Object.assign({ female: true, skin: SKINS2[5], hair: HAIRS.copper, hairStyle: 'long', eyes: '#3b5b6e', glasses: '#111', thick: true,
    dress: '#151517', shoe: '#111', heels: true, lips: '#a8424e', earrings: true, seed: 1 }, x)),
  rachel: (x = {}) => human(Object.assign({ female: true, skin: SKINS2[0], hair: HAIRS.blonde, hairStyle: 'long', eyes: '#4a6d8c', top: '#e9e3d6', bottom: '#2f3a52', seed: 2 }, x)),
  banker: (x = {}) => human(Object.assign({ suit: '#262b3a', tie: '#7a1c2b', skin: SKINS2[1], hair: HAIRS.grey, hairStyle: 'slick', glasses: true, seed: 3 }, x)),
};
