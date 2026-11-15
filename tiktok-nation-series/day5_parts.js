// ===== DAY 5: the beach resort wins + your requests =====
const ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const backOut=k=>{const c=1.9;return 1+(c+1)*Math.pow(k-1,3)+c*Math.pow(k-1,2);};
sun.shadow.mapSize.set(2048,2048);  // lighter render
NEW.forEach(g=>g.userData.t=-1); roadParts.forEach(g=>g.userData.t=-1); CUTT.fill(-10);
const [CU,CV]=cityUV(V.x,V.y);
const AY=airport.position.y+airport.userData.dy;
cessna.position.copy(L(10,RV+6.5)).setY(AY+.6);cessna.rotation.y=ALONG_ANG;

// ---------- the cooled lava rivers from the eruption (black rock now)
const rockMat=new THREE.MeshStandardMaterial({color:'#3b3330',roughness:1,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2,side:THREE.DoubleSide});
function ribbon(pts,wf,lift,mat){const pos=[];for(let i=0;i<pts.length-1;i++){const a=pts[i],b=pts[i+1];const du=b[0]-a[0],dv=b[1]-a[1],l=Math.hypot(du,dv)||1;const nu=-dv/l,nv=du/l;
  const wa=wf(i/(pts.length-1)),wb=wf((i+1)/(pts.length-1));const q=[[a[0]+nu*wa,a[1]+nv*wa],[a[0]-nu*wa,a[1]-nv*wa],[b[0]+nu*wb,b[1]+nv*wb],[b[0]-nu*wb,b[1]-nv*wb]].map(([u,v])=>{const p=LW(u,v);return [p.x,Math.max(H(p.x,p.y),SEA)+lift,p.y];});
  pos.push(...q[0],...q[1],...q[2],...q[1],...q[3],...q[2]);}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.computeVertexNormals();const m=new THREE.Mesh(g,mat);m.frustumCulled=false;m.receiveShadow=true;scene.add(m);return m;}
[[[CU,CV],[CU-5,CV-10],[CU-14,CV-20],[CU-22,CV-29],[CU-27,CV-39]],[[CU,CV],[CU+2,CV-10],[CU+6,CV-18],[CU+2,CV-26],[CU+4,CV-30]],[[CU,CV],[CU+6,CV-9],[CU+18,CV-17],[CU+28,CV-22],[CU+35,CV-29]]].forEach((cp,fi)=>{
 const pts=new THREE.CatmullRomCurve3(cp.map(([u,v])=>v3(CU+(u-CU)*.7,0,CV+(v-CV)*.66))).getSpacedPoints(70).map(p=>[p.x+Math.sin(p.z*.35+fi)*.6,p.z]);ribbon(pts,k=>3.1+k*2.6,.7,rockMat);});
// ---------- kept from the rain episode: hero statue + weather station
const heroes=(()=>{const g=new THREE.Group();const gold=std('#f2c230',{metalness:.6,roughness:.35});g.add(box(4,1.6,4,MT.stone,0,.8,0));g.add(box(3.2,.6,3.2,MT.white,0,1.9,0));
 for(const x of [-.8,.8]){const f=new THREE.Group();const b=new THREE.Mesh(new THREE.CapsuleGeometry(.5,1.1,4,8),gold);b.position.y=1.1;const h=new THREE.Mesh(new THREE.SphereGeometry(.5,12,10),gold);h.position.y=2.4;f.add(b,h);f.position.set(x,2.2,0);g.add(f);}
 const s=sign('OUR FIREFIGHTER HEROES','#1d232b','#ffcc2e',3.8,.6);s.position.set(0,.9,2.02);g.add(s);g.traverse(o=>o.castShadow=true);return place(g,40,100,-1,Math.PI);})();
const weather=(()=>{const g=new THREE.Group();g.add(box(4,2.6,3.4,MT.white,0,1.3,0));g.add(box(4.3,.3,3.7,std('#2f7de1'),0,2.75,0));
 for(const x of [-.5,.5])for(const z of [-.5,.5])g.add(box(.18,7,.18,MT.dark,2.8+x,3.5,z));const ball=new THREE.Mesh(new THREE.SphereGeometry(1.5,16,12),MT.white);ball.position.set(2.8,8,0);g.add(ball);
 const s=sign('WEATHER STATION','#ffffff','#1d3f8a',3.4,.55);s.position.set(0,1.6,1.72);g.add(s);g.traverse(o=>o.castShadow=true);return place(g,-46,100,-1,Math.PI);})();

// ---------- 🏖️ THE BEACH RESORT (vote winner, @_eruzazyy) on its own island
const RU=-106,RVv=-44,RR=22;
const resortIsle=isle(RU,RVv,RR,9.9);resortIsle.children.slice().forEach(o=>{if(o.geometry===roundG)resortIsle.remove(o);});
resortIsle.userData.t=9.4;resortIsle.userData.isle=true;resortIsle.visible=false;NEW.push(resortIsle);
const ry=r=>resortIsle.userData.top*(1-Math.pow(Math.min(r/RR,1.2),2.2));
{const g=new THREE.Group();const y0=ry(0);const glass=std('#7fc4e8',{roughness:.2,metalness:.2});
 [[11,6.5],[8.5,5],[6,3.6]].forEach(([w,d],i)=>{g.add(box(w,3.2,d,MT.white,0,y0+1.6+i*3.2,0));g.add(box(w+.1,.9,d+.1,glass,0,y0+2+i*3.2,0));});
 g.add(box(6.6,.4,4.2,std('#2f8fe0'),0,y0+9.8,0));const s=sign('HERBERG BEACH RESORT','#ffffff','#2f8fe0',7,1);s.position.set(0,y0+4.3,3.3);g.add(s);
 const pool=box(8,.3,4,std('#3fc7f0',{roughness:.1}),0,ry(9)+.25,9);g.add(box(9,.25,5,MT.white,0,ry(9)+.1,9),pool);
 for(let i=0;i<9;i++){const a=-1.9+i*.48,r=14.5;const x=Math.sin(a)*r,z=Math.cos(a)*r,y=ry(r);const p=new THREE.Group();p.add(cyl(.07,.07,2.4,MT.white,0,1.2,0,6));const c=new THREE.Mesh(new THREE.ConeGeometry(1.5,.6,8),[MT.red,MT.orange,MT.blue,MT.teal][i%4]);c.position.y=2.5;p.add(c);
  p.add(box(.8,.2,1.9,MT.white,1.2,.35,0));p.position.set(x,y,z);g.add(p);}
 for(let i=0;i<10;i++){const a=i/10*Math.PI*2+.3,r=18;const x=Math.sin(a)*r,z=Math.cos(a)*r,y=ry(r);const p=new THREE.Group();const tr=cyl(.25,.35,5,MT.wood,0,2.5,0,6);tr.rotation.z=.15;p.add(tr);
  for(let k=0;k<5;k++){const lf=new THREE.Mesh(new THREE.ConeGeometry(.6,3.2,4),std('#3fa34d',{flatShading:true}));lf.position.set(Math.cos(k*1.26)*1.3+.4,5,Math.sin(k*1.26)*1.3);lf.rotation.set(Math.sin(k*1.26)*1.2,0,-Math.cos(k*1.26)*1.2);p.add(lf);}p.position.set(x,y,z);g.add(p);}
 g.traverse(o=>o.castShadow=true);resortIsle.add(g);}
const resortBridge=bridgeTo(-86,resortIsle,10.6);
// overwater villas (@liam_eshan_oliveros) + the luxury villa + yacht (@mytypecanbe_a_ig)
function villa(big){const g=new THREE.Group();const s=big?1.7:1;for(const x of [-1.6,1.6])for(const z of [-1.6,1.6])g.add(cyl(.15,.15,3,MT.wood,x*s,-.3,z*s,6));
 g.add(box(5*s,.3,5*s,MT.wood,0,1.3,0));g.add(box(3.6*s,2.2,3.4*s,MT.white,0,2.5,-.3*s));g.add(roof4(4.6*s,1.8,std('#c99a5b'),4.5,4.4*s));g.add(box(2.4*s,.1,1.2*s,MT.glass,0,2.6,1.45*s));
 if(big){g.add(box(3,.25,2,std('#3fc7f0'),2.8,1.5,2.6));const sg=sign('LUXURY VILLA','#ffffff','#c99a5b',3,.6);sg.position.set(0,3.5,1.42*s);g.add(sg);}g.traverse(o=>o.castShadow=true);return g;}
const VILLAS=[];[-1.0,-.5,0,.5,1.0].forEach((a,i)=>{const u=RU+Math.sin(a)*31,v=RVv-Math.cos(a)*31;const g=villa(false);const p=LW(u,v);g.position.set(p.x,SEA+.2,p.y);g.lookAt(LW(RU,RVv).x,SEA+.2,LW(RU,RVv).y);
 const wk=box(1.4,.25,10,MT.wood,0,1.3,6.5);g.add(wk);g.userData.t=17.4+i*.35;g.visible=false;scene.add(g);NEW.push(g);VILLAS.push(g);});
const luxVilla=(()=>{const g=villa(true);const p=LW(RU,RVv-48);g.position.set(p.x,SEA+.2,p.y);g.lookAt(LW(RU,RVv).x,SEA+.2,LW(RU,RVv).y);g.userData.t=19.4;g.visible=false;scene.add(g);NEW.push(g);return g;})();
const yacht=(()=>{const g=new THREE.Group();const w=MT.white;g.add(box(3.4,1.4,10,w,0,.7,0));const bow=new THREE.Mesh(new THREE.ConeGeometry(1.7,3.4,4),w);bow.rotation.x=Math.PI/2;bow.rotation.y=Math.PI/4;bow.scale.set(1,1,.42);bow.position.set(0,.7,6.6);g.add(bow);
 g.add(box(2.8,1.2,5,w,0,2,-.6));g.add(box(2.9,.5,5.1,MT.glass,0,2.1,-.6));g.add(box(2,1,2.6,w,0,3.1,-1));g.add(box(3.5,.12,10.1,std('#1d3f8a'),0,.3,0));
 g.traverse(o=>o.castShadow=true);const p=LW(RU+26,RVv-30);g.position.set(p.x,SEA+.1,p.y);g.rotation.y=FACE+.6;g.userData.t=20.4;g.userData.base=SEA+.1;g.visible=false;scene.add(g);NEW.push(g);return g;})();

// ---------- 🏙️ skyscraper + mall (@originally_criss @trooper7095 @k17.gaming)
const tower=place((()=>{const g=new THREE.Group();g.add(box(20,5,10,MT.wall3,0,2.5,0));g.add(box(20.2,1.4,10.2,MT.glass,0,2.6,0));const s=sign('HERBERG MALL','#ffffff','#9b59d6',6,1);s.position.set(0,4.2,5.12);g.add(s);
 const tw=new THREE.Group();const gl=std('#5d8fc4',{roughness:.25,metalness:.3});tw.add(box(7,34,7,gl,0,17,0));for(let k=1;k<9;k++)tw.add(box(7.15,.35,7.15,MT.white,0,k*4,0));tw.add(box(4,3,4,MT.white,0,35.5,0));tw.add(cyl(.12,.12,6,MT.dark,0,40,0,6));
 tw.position.set(6,5,0);g.add(tw);g.traverse(o=>o.castShadow=true);return g;})(),-18,85,22.4);
// 🏎️ go-kart track (@hammertime.op @sarmad.mustafa03)
const KU=46,KV=85,KA=10,KB=4.6;
const karts=[];const kartTrack=place((()=>{const g=new THREE.Group();g.add(box(2*KA+6,7,2*KB+6,MT.grass,0,-3.4,0));for(let i=0;i<56;i++){const a0=i/56*Math.PI*2,a1=(i+1)/56*Math.PI*2;const x0=Math.cos(a0)*KA,z0=Math.sin(a0)*KB,x1=Math.cos(a1)*KA,z1=Math.sin(a1)*KB;const sg=box(2.6,.2,Math.hypot(x1-x0,z1-z0)+.15,MT.road,(x0+x1)/2,.2,(z0+z1)/2);sg.rotation.y=Math.atan2(x1-x0,z1-z0);g.add(sg);}
 const inner=new THREE.Mesh(new THREE.CircleGeometry(1,40),MT.grass);inner.rotation.x=-Math.PI/2;inner.scale.set(KA-1.8,KB-1.6,1);inner.position.y=.2;g.add(inner);
 for(let i=0;i<40;i++){const a=i/40*Math.PI*2;const t=cyl(.35,.35,.4,i%2?MT.red:MT.white,Math.cos(a)*(KA+1.9),.2,Math.sin(a)*(KB+1.9),8);g.add(t);}
 const ban=new THREE.Group();ban.add(cyl(.1,.1,3,MT.dark,-1.8,1.5,0,6));ban.add(cyl(.1,.1,3,MT.dark,1.8,1.5,0,6));const s=sign('GO-KART','#ffffff','#1d232b',3.8,.7);s.position.y=3;ban.add(s);ban.position.set(0,0,KB);g.add(ban);
 ['#e8334f','#2f7de1','#f2d33a','#4fbf3a'].forEach(c=>{const k=new THREE.Group();k.scale.setScalar(1.5);k.add(box(.9,.35,1.5,std(c),0,.45,0));k.add(new THREE.Mesh(new THREE.SphereGeometry(.28,8,6),std('#ffffff')));k.children[1].position.set(0,.9,-.1);g.add(k);karts.push(k);});
 g.traverse(o=>o.castShadow=true);return g;})(),KU,KV,26.4,0,3.6);
// 🥐 bakery (@hxz_player88) + water tower (@mrkitkat64)
const bakery=place(shop('BAKERY','#f2c38b','#7a4a1e',MT.wall2,MT.orange),26,79,29.9);
const waterTower=place((()=>{const g=new THREE.Group();for(const x of [-1.6,1.6])for(const z of [-1.6,1.6]){const l=cyl(.18,.22,9,MT.dark,x,4.5,z,6);g.add(l);}
 g.add(cyl(3,3,4,std('#9fd3f0'),0,11,0,20));const top=new THREE.Mesh(new THREE.ConeGeometry(3.2,1.6,20),std('#7fb6d6'));top.position.y=13.8;g.add(top);const s=sign('HERBERG','#1d3f8a','#ffffff',3.6,.8);s.position.set(0,11,3.02);g.add(s);
 g.traverse(o=>o.castShadow=true);return g;})(),-66,84,30.7);
// 🚨 tornado siren (@derpy_derp_0 @notrealpilot)
const siren=place((()=>{const g=new THREE.Group();g.add(cyl(.2,.3,10,MT.dark,0,5,0,8));const head=new THREE.Group();head.add(box(1.2,1.2,1.2,std('#f2d33a'),0,0,0));
 for(const a of [0,Math.PI/2,Math.PI,-Math.PI/2]){const h=new THREE.Mesh(new THREE.CylinderGeometry(.75,.25,1.4,12,1,true),std('#f2d33a',{side:THREE.DoubleSide}));h.rotation.z=Math.PI/2;h.position.x=1.2;const p=new THREE.Group();p.add(h);p.rotation.y=a;head.add(p);}
 head.position.y=10.4;g.add(head);g.userData.head=head;g.traverse(o=>o.castShadow=true);return g;})(),16,80,33.4);
const waves=[0,1,2].map(()=>{const m=new THREE.Mesh(new THREE.TorusGeometry(1,.08,6,40),new THREE.MeshBasicMaterial({color:'#ffe066',transparent:true,opacity:0}));m.rotation.x=Math.PI/2;scene.add(m);return m;});
// 🚁 helicopter landing on the hospital helipad (@panam.fan)
const heli=(()=>{const g=new THREE.Group();g.add(new THREE.Mesh(new THREE.CapsuleGeometry(.8,1.6,6,10),std('#e8334f')));g.children[0].rotation.x=Math.PI/2;g.children[0].position.y=1.1;
 g.add(box(1.2,.5,.9,MT.glass,0,1.3,1.2));g.add(box(.3,.3,3.4,std('#e8334f'),0,1.3,-2.6));g.add(box(.1,1,.6,MT.white,0,1.7,-4.2));for(const x of [-.6,.6])g.add(box(.1,.1,2.6,MT.dark,x,.1,0));
 const rot=new THREE.Group();rot.add(box(6,.06,.3,MT.dark,0,0,0));rot.add(box(.3,.06,6,MT.dark,0,0,0));rot.position.y=2.25;g.add(rot);g.userData.rot=rot;g.traverse(o=>o.castShadow=true);g.visible=false;scene.add(g);return g;})();
const PAD=(()=>{const p=hospital.position;return v3(p.x,p.y+7.15,p.z);})();
// 🎓 Heroes Academy (@vortexverse585) + 🌳 Elias Park (@username673180)
const heroSign=sign('HEROES ACADEMY','#ffffff','#e8334f',5.6,1);heroSign.position.set(-2,4.1,-.36);heroSign.visible=false;school.add(heroSign);
const eliasArch=(()=>{const g=new THREE.Group();g.add(box(.5,4,.5,MT.wood,-3,2,0));g.add(box(.5,4,.5,MT.wood,3,2,0));const s=sign('ELIAS PARK','#ffffff','#3f9a3a',6.6,1.2);s.position.y=4.2;g.add(s);g.position.set(0,0,5.9);g.visible=false;park.add(g);return g;})();
// 🚌 bus station by the lighthouse (@jjdoms2704) + 🚕 taxis (@kaiyn_bomb19)
const busStop=place((()=>{const g=new THREE.Group();g.add(box(6,.2,2.4,MT.stone,0,.1,0));g.add(box(6.2,.2,2.6,std('#2f8fe0'),0,2.8,0));g.add(box(6,2.5,.1,MT.glass,0,1.45,-1.1));g.add(box(4,.2,.7,MT.wood,0,.7,-.6));
 g.add(cyl(.08,.08,3.6,MT.dark,3.6,1.8,.6,6));const s=sign('BUS','#ffffff','#2a9d3a',1.4,1);s.position.set(3.6,3.4,.65);g.add(s);g.traverse(o=>o.castShadow=true);return g;})(),68,-5.4,44.4);
const bus=place((()=>{const g=new THREE.Group();g.add(box(2.4,2.4,7.4,std('#3fae49'),0,1.6,0));g.add(box(2.45,.8,6.8,MT.glass,0,2.2,.1));for(const x of [-1.1,1.1])for(const z of [-2.4,2.4]){const w=cyl(.45,.45,.3,MT.dark,x,.45,z,10);w.rotation.z=Math.PI/2;g.add(w);}
 g.traverse(o=>o.castShadow=true);return g;})(),62,-1.4,44.8,Math.PI/2);
function car(c){const g=new THREE.Group();g.add(box(1.7,.8,3.4,std(c),0,.7,0));g.add(box(1.5,.7,1.8,MT.glass,0,1.4,-.2));g.add(box(.7,.25,.35,std('#1d232b'),0,1.9,-.2));for(const x of [-.8,.8])for(const z of [-1.1,1.1]){const w=cyl(.3,.3,.2,MT.dark,x,.3,z,10);w.rotation.z=Math.PI/2;g.add(w);}g.traverse(o=>o.castShadow=true);scene.add(g);return g;}
const TAXI=[[0,98.5,-.9],[18,30,.9],[36,70,-.9]].map(([v,ph,lane])=>{const g=car('#f6c624');g.userData={v,ph,lane};return g;});

const SH=[
 {t0:0,   t1:4,   p:[L(0,-150,120),L(0,-140,112)], l:[L(0,40,10),L(0,40,10)], f:46},
 {t0:4,   t1:9,   p:[L(-30,-96,64),L(-38,-100,62)], l:[L(-80,-24,0),L(-82,-26,0)], f:50},
 {t0:9,   t1:17,  orbit:{c:[RU,RVv,4],r:54,h:30,a0:-.2,a1:1.1}, f:50},
 {t0:17,  t1:22,  p:[L(-80,-112,26),L(-92,-116,24)], l:[L(RU,-76,2),L(RU,-76,2)], f:52},
 {t0:22,  t1:26,  p:[L(12,42,32),L(6,44,36)], l:[L(-14,86,18),L(-14,86,20)], f:52},
 {t0:26,  t1:29.5,p:[L(22,50,44),L(28,49,42)], l:[L(KU,KV,0),L(KU,KV,0)], f:46},
 {t0:29.5,t1:31.2,p:[L(20,67,11),L(18,68,11)], l:[L(26,79,3),L(26,79,3)], f:54},
 {t0:31.2,t1:33,  p:[L(-54,66,16),L(-56,67,16)], l:[L(-66,84,9),L(-66,84,9)], f:54},
 {t0:33,  t1:36.5,p:[L(4,60,17),L(7,62,16)], l:[L(16,80,9),L(16,80,9)], f:54},
 {t0:36.5,t1:40,  p:[L(-20,32,19),L(-22,34,18)], l:[L(-36,45,8),L(-36,45,8)], f:54},
 {t0:40,  t1:42,  p:[L(-27,11,11),L(-29,10,11)], l:[L(-33,26,4),L(-33,26,4)], f:55},
 {t0:42,  t1:44,  p:[L(0,47,9),L(2,47,9)], l:[L(0,62,2),L(0,62,2)], f:55},
 {t0:44,  t1:47.5,p:[L(54,-18,10),L(58,-18,9)], l:[L(68,-3,2),L(68,-3,2)], f:55},
 {t0:47.5,t1:55,  p:[L(0,-118,168),L(0,-140,196)], l:[L(0,40,0),L(0,40,0)], f:46},
];
const DUR=55;
const caps=[
 ['c1',.2,4,TXT.d0],['c1',4.2,9,TXT.d1],['c1',9.2,17,TXT.d2],['c1',17.2,22,TXT.d3],['c1',22.2,26,TXT.d4],['c1',26.2,29.5,TXT.d5],['c1',29.7,33,TXT.d6],
 ['c1',33.2,36.5,TXT.d7],['c1',36.7,40,TXT.d8],['c1',40.2,44,TXT.d9],['c1',44.2,47.5,TXT.d10],['c1',47.7,DUR,TXT.d11],['c2',51,DUR,TXT.d11b],
];
const TAGS=[
 ['🏖️ BEACH RESORT','idea by @_eruzazyy',()=>L(RU,RVv,16),11.0,17],
 ['🏝️ WATER VILLAS','@liam_eshan_oliveros',()=>VILLAS[2].position.clone().add(v3(0,7,0)),18.0,22],
 ['🛥️ YACHT','@mytypecanbe_a_ig',()=>yacht.position.clone().add(v3(0,6,0)),20.8,22],
 ['🏙️ SKYSCRAPER + MALL','@originally_criss · @trooper7095 · @k17.gaming',()=>L(-12,85,30),23.0,26],
 ['🏎️ GO-KART TRACK','@hammertime.op · @sarmad.mustafa03',()=>L(KU,KV,8),27.0,29.5],
 ['🥐 BAKERY','@hxz_player88',()=>L(26,79,7),30.0,31.2],
 ['💧 WATER TOWER','@mrkitkat64',()=>L(-66,84,18),31.6,33],
 ['🚨 TORNADO SIREN','@derpy_derp_0 · @notrealpilot',()=>L(16,80,14),33.8,36.5],
 ['🚁 HELIPAD','@panam.fan',()=>heli.position.clone().add(v3(0,4,0)),37.4,40],
 ['🎓 HEROES ACADEMY','@vortexverse585',()=>L(-37,27,10),40.8,42],
 ['🌳 ELIAS PARK','@username673180',()=>L(0,58,7),42.6,44],
 ['🚌 BUS STATION','@jjdoms2704',()=>L(68,-5.4,6),44.8,47.5],
 ['🚕 TAXI DRIVER','@kaiyn_bomb19',()=>TAXI[0].position.clone().add(v3(0,3.5,0)),45.6,47.5],
];
$('tags').innerHTML=TAGS.map(t=>`<div class="ntag"><div class="tt">${t[0]}</div><div class="ts">${t[1]}</div></div>`).join('');
window.CAPTION_TIMES=[...new Set(caps.map(c=>c[1]))].concat(TAGS.map(t=>t[3]),[4.6,5.0,48.6,49.2]);
window.CUTS=SH.map(s=>s.t0);
window.POPS=[...new Set(NEW.filter(g=>g.userData.t>0).map(g=>Math.round(g.userData.t*10)/10))].concat([40.4,41.6]);window.CAPTION_TIMES=window.CAPTION_TIMES.concat(window.POPS);
window.BOOMS=[];
function popAt(el,t,a,b,{inDur=.28,outDur=.15}={}){
 if(t<a||t>b){el.style.opacity=0;return 0;}
 const k=clamp((t-a)/inDur), ko=clamp((b-t)/outDur);const s= k<1 ? (k<.6? .55+.6*(k/.6) : 1.15-.15*((k-.6)/.4)) : 1;
 el.style.opacity=Math.min(k*2,ko,1); el.style.transform=(el.dataset.base||'')+` scale(${s})`; return 1;}
const proj=(v)=>{const p=v.clone().project(camera);return [(p.x+1)/2*1080,(1-p.y)/2*1920,p.z];};

window.setTime=function(t){
 const sh=SH.find(s=>t>=s.t0&&t<s.t1)||SH[SH.length-1];
 const k=ease(clamp((t-sh.t0)/(sh.t1-sh.t0)));
 if(sh.orbit){const o=sh.orbit;const a=o.a0+(o.a1-o.a0)*k;const c=L(o.c[0],o.c[1],o.c[2]);camera.position.set(c.x+Math.sin(a+FACE)*o.r,c.y+o.h,c.z+Math.cos(a+FACE)*o.r);camera.lookAt(c);}
 else {camera.position.lerpVectors(sh.p[0],sh.p[1],k); camera.lookAt(new THREE.Vector3().lerpVectors(sh.l[0],sh.l[1],k));}
 camera.fov=sh.f||46; camera.updateProjectionMatrix();
 clouds.forEach((c,i)=>{c.userData.bx??=c.position.x;c.position.x=c.userData.bx+t*1.4*(i%2?1:-1);});
 smoke.forEach((b,i)=>{const ph=((t*.12+i/smoke.length)%1);b.position.set(V.x+ph*20+Math.sin(i*3)*3,H(V.x,V.y)+5+ph*40,V.y-ph*9);b.scale.setScalar(.9+ph*3);b.material.opacity=.6*(1-ph);});
 lava.material.color.setHSL(.06,1,.5+.06*Math.sin(t*4));
 ghosts.forEach(g=>g.visible=false); pawns.forEach(p=>p.visible=false); flagGrp.visible=false; siteA.visible=siteB.visible=false;
 cutAt(t);
 for(const g of roadParts)g.visible=true;
 for(const g of NEW){ if(g.userData.t<0){g.visible=true;g.scale.setScalar(1);}else{const kk=clamp((t-g.userData.t)/.5);g.visible=kk>0;if(kk>0)g.scale.setScalar(Math.max(.001,backOut(kk)));}
   if(g.userData.base!==undefined&&g.visible){g.position.y=g.userData.base+Math.sin(t*1.5+g.position.x)*.15;g.rotation.z=Math.sin(t*1.2+g.position.z)*.04;}}
 peopleAt(t,true);
 plaza.userData.jets.forEach((j,i)=>{const a=i/10*Math.PI*2,ph=((t*1.2+i*.1)%1);j.position.set(Math.cos(a)*(1.3+ph*1.6),1.2+ph*2.4-ph*ph*2.4,Math.sin(a)*(1.3+ph*1.6));});
 kids.forEach(kd=>{const i=kd.userData.i;kd.position.y=.25+Math.abs(Math.sin(t*6+i))*.35;});
 police.userData.lt.material.color.set(Math.sin(t*12)>0?'#e8334f':'#2f7de1');
 pizzeria.userData.sign.rotation.y=t*1.5; watermill.userData.wheel.rotation.z=-t*1.2; lighthouse.userData.piv.rotation.y=t*1.6;
 { const cu=coaster.userData.curve,ph=(t*.09)%1;coaster.userData.cart.position.copy(cu.getPoint(ph));coaster.userData.cart.lookAt(cu.getPoint((ph+.004)%1)); }
 iceTruck.visible=false;
 { const a=t*.12;const c=L(0,30);jetliner.position.set(c.x+Math.cos(a)*190,95,c.z+Math.sin(a)*150);jetliner.lookAt(c.x+Math.cos(a+.05)*190,95,c.z+Math.sin(a+.05)*150);jetliner.rotateY(-Math.PI/2); }
 birds.forEach(b=>{const {i,wl,wr}=b.userData;const a=t*.25+i*.7;const R=60+(i%3)*20;const c=L(0,20);b.position.set(c.x+Math.cos(a)*R,52+(i%4)*6+Math.sin(t+i)*1.5,c.z+Math.sin(a)*R*.8);b.rotation.y=-a;const fl=Math.sin(t*10+i)*.5;wl.rotation.z=.35+fl;wr.rotation.z=-.35-fl;});
 // karts race
 karts.forEach((kt,i)=>{const a=t*(1.1+i*.07)+i*1.4;kt.position.set(Math.cos(a)*KA,0,Math.sin(a)*KB);kt.rotation.y=-Math.atan2(Math.cos(a)*KB,-Math.sin(a)*KA)+Math.PI/2;});
 // siren spins + sound rings while it's on screen
 siren.userData.head.rotation.y=t*3; waves.forEach((w,i)=>{const on=t>=34&&t<36.5;const ph=((t*.9+i/3)%1);const c=L(16,80,10.4);w.position.copy(c);w.scale.setScalar(1+ph*14);w.material.opacity=on?.7*(1-ph):0;});
 // helicopter descends onto the pad
 { const hk=ease(clamp((t-36.6)/2.6));heli.visible=t>=36.6;heli.position.copy(PAD).add(v3(-12*(1-hk),22*(1-hk),6*(1-hk)));heli.rotation.y=FACE+.4*(1-hk);heli.userData.rot.rotation.y=t*(hk<1?25:8); }
 // signs
 heroSign.visible=t>=40.4;heroSign.scale.setScalar(Math.max(.001,backOut(clamp((t-40.4)/.45))));
 eliasArch.visible=t>=41.6;eliasArch.scale.setScalar(Math.max(.001,backOut(clamp((t-41.6)/.45))));
 // taxis loop the avenues
 TAXI.forEach(g=>{const {v,ph,lane}=g.userData;const u=-60+(((t*9+ph)%130)+130)%130;g.position.copy(L(u,v+lane,.1));g.lookAt(L(u+2,v+lane,.1));});

 renderer.render(scene,camera);

 // ---------- UI ----------
 const used={c1:false,c2:false};
 for(const [id,a,b,txt] of caps){ if(t>=a&&t<=b){const el=$(id); if(el.dataset.txt!==txt){el.innerHTML=txt;el.dataset.txt=txt;} popAt(el,t,a,b); used[id]=true; } }
 for(const id in used) if(!used[id]) $(id).style.opacity=0;
 $('popn').textContent=Math.round(1354+108*ease(clamp((t-.6)/2.6))).toLocaleString('en-US');
 popAt($('votes'),t,4.6,9); const vk=ease(clamp((t-5.0)/1.0));
 $('barA').style.width=(2/6*100*vk)+'%'; $('barB').style.width=(4/6*100*vk)+'%'; $('nA').textContent=Math.round(2*vk); $('nB').textContent=Math.round(4*vk);
 [...$('goals').children].forEach(el=>popAt(el,t,99,0));
 [...$('tags').children].forEach((el,i)=>{const [_,__,pf,a,b]=TAGS[i];const pp=proj(pf());el.dataset.base='translate(-50%,-100%)';const hw=el.offsetWidth/2+24;el.style.left=Math.min(1080-hw,Math.max(hw,pp[0]))+'px';el.style.top=Math.max(560+el.offsetHeight+18,pp[1])+'px';popAt(el,t,a,b);if(pp[2]>1)el.style.opacity=0;});
 [...$('laws').children].forEach((c,i)=>popAt(c,t,48.6+i*.6,DUR));
 let fl=0; for(const c of window.CUTS){ if(c>0&&t>=c&&t<c+.12) fl=.5*(1-(t-c)/.12);} $('flash').style.opacity=fl;
};
window.DUR=DUR; window.__T2={camera,renderer,scene,L,LW};
document.fonts.ready.then(()=>{window.setTime(0);window.READY=true;});
