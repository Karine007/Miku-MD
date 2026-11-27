// ===== HERBERG 2.0 — the rebuilt, road-planned capital on the bigger island (Day 4+) =====
// Local frame around SITE_A: u along the coast, v inland (v=0 is the coast boulevard, the beach is v<0).
const v3=(x,y,z)=>new THREE.Vector3(x,y,z);
const SX=SITE_A.x/Math.hypot(SITE_A.x,SITE_A.y), SZ=SITE_A.y/Math.hypot(SITE_A.x,SITE_A.y);
function LW(u,v){return new THREE.Vector2(SITE_A.x-SZ*u-SX*v, SITE_A.y+SX*u-SZ*v);}
function L(u,v,h=0){const p=LW(u,v);return v3(p.x,Math.max(H(p.x,p.y),SEA)+h,p.y);}
const FACE=Math.atan2(SX,SZ);                                   // local +z points out to sea
const ALONG_ANG=Math.atan2(-SX,-SZ);                            // local +x runs along +u
// ---------- kit
const std=(c,o={})=>new THREE.MeshStandardMaterial(Object.assign({color:c,roughness:.8},o));
const MT={wall:std('#f4ead2'),wall2:std('#ffd9b8'),wall3:std('#e9f0f5'),wall4:std('#e2c9a0'),wall5:std('#d9e6ef'),stone:std('#c4beb2'),dark:std('#5f646b'),wood:std('#8a5a33'),
 red:std('#d9473b'),blue:std('#3a78c9'),orange:std('#ee8a2a'),teal:std('#3fb5b0'),green:std('#2f9e7a'),gold:std('#f2c230',{metalness:.5,roughness:.35}),white:std('#ffffff'),pink:std('#f4a3b4'),
 glass:std('#9fd4f2',{roughness:.15,metalness:.1}),road:std('#4d5259',{roughness:.95}),walk:std('#cfc8bb',{roughness:.95}),line:std('#f5f1e6'),plaza:std('#e3dccd',{roughness:.95}),lamp:std('#fff2b0',{emissive:'#ffd86a',emissiveIntensity:.9}),
 grass:std('#79c950'),water:std('#4fb7ef',{roughness:.15})};
const FLOWERS=[std('#ff6fb1'),std('#ffd84a'),std('#ffffff'),std('#b98cff'),std('#ff7a3a')];
const box=(w,h,d,m,x=0,y=0,z=0)=>{const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);o.position.set(x,y,z);o.castShadow=o.receiveShadow=true;return o;};
const cyl=(r1,r2,h,m,x=0,y=0,z=0,s=12)=>{const o=new THREE.Mesh(new THREE.CylinderGeometry(r1,r2,h,s),m);o.position.set(x,y,z);o.castShadow=true;return o;};
const roof4=(w,h,m,y,d)=>{const g=new THREE.Group();const o=new THREE.Mesh(new THREE.ConeGeometry(.75,h,4),m);o.rotation.y=Math.PI/4;o.castShadow=true;g.add(o);g.scale.set(w,1,d||w);g.position.y=y;return g;};  // scale outside the 45° turn = rectangular roof
function sign(text,bg,fg,w=3,h=.8){const c=document.createElement('canvas');c.width=512;c.height=Math.round(512*h/w);const x=c.getContext('2d');x.fillStyle=bg;x.fillRect(0,0,c.width,c.height);
 x.fillStyle=fg;x.font=`bold ${Math.round(c.height*.6)}px Nunito, sans-serif`;x.textAlign='center';x.textBaseline='middle';x.fillText(text,c.width/2,c.height/2+4);
 return new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(c),side:THREE.DoubleSide}));}
function tricolor(){const c=document.createElement('canvas');c.width=512;c.height=340;const x=c.getContext('2d');[['#f08a24',0],['#2f8fe0',1],['#4fbf3a',2]].forEach(([col,i])=>{x.fillStyle=col;x.fillRect(0,i*340/3,512,114);});return new THREE.CanvasTexture(c);}
const FLAG_TEX=tricolor();
function flagPole(g,x,y,z,s=1){g.add(cyl(.07*s,.07*s,5*s,MT.dark,x,y+2.5*s,z,6));const f=new THREE.Mesh(new THREE.PlaneGeometry(1.8*s,1.2*s),new THREE.MeshStandardMaterial({map:FLAG_TEX,side:THREE.DoubleSide}));f.position.set(x+.92*s,y+4.3*s,z);g.add(f);return f;}
const pawn=(c,s=.8)=>{const g=new THREE.Group();const m=std(c);const b=new THREE.Mesh(new THREE.CapsuleGeometry(.32,.7,4,8),m);b.position.y=.7;const h=new THREE.Mesh(new THREE.SphereGeometry(.27,10,8),m);h.position.y=1.55;g.add(b,h);g.traverse(o=>o.castShadow=true);g.scale.setScalar(s);return g;};
function homeModel(w,d,h,wall,roof,seed=0){const g=new THREE.Group();
 g.add(box(w,h+1,d,wall,0,(h+1)/2-.5,0));
 g.add(roof4(w+.35,1.6,roof,h+.8,d+.35));
 g.add(box(.62,1.15,.08,MT.wood,0,.58,d/2+.04));g.add(box(.78,.1,.1,MT.white,0,1.2,d/2+.05));
 for(const x of [-w*.3,w*.3]){g.add(box(.62,.56,.06,MT.glass,x,1.45,d/2+.04));g.add(box(.72,.08,.08,MT.white,x,1.77,d/2+.06));g.add(box(.66,.16,.22,MT.wood,x,1.02,d/2+.16));
  for(let k=0;k<3;k++){const f=new THREE.Mesh(new THREE.SphereGeometry(.08,6,5),FLOWERS[(seed+k)%5]);f.position.set(x-.2+k*.2,1.16,d/2+.18);g.add(f);}}
 for(const z of [-d*.2,d*.2]){g.add(box(.06,.5,.55,MT.glass,w/2+.03,1.45,z));g.add(box(.06,.5,.55,MT.glass,-w/2-.03,1.45,z));}
 g.add(box(.42,1.3,.42,MT.stone,w*.25,h+1.1,-d*.15));g.userData.chimney=v3(w*.25,h+1.9,-d*.15);
 const fm=std('#f3ecd8');for(let k=-3;k<=3;k++)g.add(box(.08,.5,.08,fm,k*.6,.25,d/2+1.3));g.add(box(3.7,.06,.05,fm,0,.42,d/2+1.3));
 for(let k=0;k<3;k++){const b=new THREE.Mesh(new THREE.IcosahedronGeometry(.3,0),std(k%2?'#4f9e3a':'#5fb83a',{flatShading:true}));b.position.set(-1+k,.2,d/2+.8);g.add(b);}
 g.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;}});return g;}
const WALLS=[MT.wall,MT.wall2,MT.wall3,MT.wall4,MT.wall5], ROOFS=[MT.red,MT.dark,MT.orange,MT.blue,std('#8a3a2a'),MT.teal];
// ---------- placement + reveal
const NEW=[];
function place(g,u,v,t,rot=0,y0=0){const p=L(u,v);g.position.set(p.x,p.y+y0,p.z);g.rotation.y=FACE+rot;g.userData.t=t;g.visible=false;scene.add(g);NEW.push(g);return g;}
// ---------- road network
const AVES=[0,18,36,54,72], STREETS=[-72,-48,-24,0,24,48,72];
const SEGROAD=[];                                               // [u0,v0,u1,v1]
for(const v of AVES) SEGROAD.push([-96,v,96,v]);
for(const u of STREETS){ if(u!==0) SEGROAD.push([u,0,u,72]); }
SEGROAD.push([0,72,0,92]);                                      // road to the airport
SEGROAD.push([96,36,118,36]);                                   // road to the stadium
SEGROAD.push([-96,36,-118,36]);                                 // road to the park
const roadParts=[];                                             // {g, d: distance from the plaza}
const LAMPS=[];
function riverNear(p){return riverDist(p.x,p.z)<5;}
for(const [u0,v0,u1,v1] of SEGROAD){const len=Math.hypot(u1-u0,v1-v0),n=Math.ceil(len/3);const ang=Math.atan2(u1-u0,v1-v0);
 for(let i=0;i<n;i++){const a=(i+.5)/n;const u=u0+(u1-u0)*a,v=v0+(v1-v0)*a;const p=L(u,v);const bridge=riverNear(p);
  const g=new THREE.Group();const y=bridge?Math.max(p.y,3.4+Math.max(0,v)*.05)+.6:p.y;
  g.add(box(4,.24,3.08,MT.road,0,.12,0));
  for(const sx of [-2.6,2.6])g.add(box(1.2,.32,3.08,MT.walk,sx,.16,0));
  if(i%2==0)g.add(box(.16,.03,1.3,MT.line,0,.255,0));
  if(bridge){for(const sx of [-3.2,3.2])g.add(box(.18,.9,3.08,MT.stone,sx,.6,0));g.add(box(5.6,1.2,3.08,MT.stone,0,-.5,0));}
  if(i%4==1&&!bridge){const l=new THREE.Group();l.add(cyl(.07,.09,3.2,MT.dark,0,1.6,0,6));l.add(box(.5,.08,.08,MT.dark,-.22,3.15,0));l.add(box(.3,.22,.3,MT.lamp,-.42,3.02,0));l.position.set(3.05,.3,0);g.add(l);}
  g.position.set(p.x,y,p.z);g.rotation.y=FACE+ang+Math.PI;g.userData={t:0,d:Math.hypot(u,v-9)};g.visible=false;scene.add(g);roadParts.push(g);}}
// intersections get a paved square
for(const v of AVES)for(const u of STREETS){if(u===0&&v<72)continue;const p=L(u,v);const g=new THREE.Group();g.add(box(6.4,.26,6.4,MT.road,0,.13,0));g.position.set(p.x,p.y,p.z);g.rotation.y=FACE;g.userData={d:Math.hypot(u,v-9)};g.visible=false;scene.add(g);roadParts.push(g);}
// ---------- blocks: lots never overlap (each block is ~17.6 x 11.6 between roads)
const B=(u,v)=>({u,v});
// central plaza (merged block)
const plaza=place((()=>{const g=new THREE.Group();g.add(box(40,.3,11.4,MT.plaza,0,.15,0));for(let i=-4;i<=4;i++)g.add(box(.12,.02,11.4,std('#d3cbbb'),i*4.4,.31,0));
 g.add(cyl(3.6,3.8,1,MT.stone,0,.6,0,28));const w=new THREE.Mesh(new THREE.CylinderGeometry(3.3,3.3,.2,28),MT.water);w.position.y=1.05;g.add(w);
 g.add(box(1.8,2.4,1.8,MT.stone,0,2.2,0));const st=new THREE.Group();const body=new THREE.Mesh(new THREE.CapsuleGeometry(.55,1.2,6,12),MT.gold);body.position.y=4.5;const head=new THREE.Mesh(new THREE.SphereGeometry(.45,16,12),MT.gold);head.position.y=5.8;st.add(body,head);g.add(st);
 for(const x of [-14,-8,8,14]){g.add(box(1.4,.6,1.4,MT.stone,x,.6,-3.6));const t=new THREE.Mesh(new THREE.IcosahedronGeometry(1.3,1),std('#5fb83a',{flatShading:true}));t.position.set(x,2.2,-3.6);t.castShadow=true;g.add(t);g.add(cyl(.15,.18,1.2,MT.wood,x,1.2,-3.6,6));}
 for(const x of [-11,11]){g.add(box(2,.12,.6,MT.wood,x,.7,3.4));g.add(box(.12,.5,.6,MT.dark,x-.9,.45,3.4));g.add(box(.12,.5,.6,MT.dark,x+.9,.45,3.4));}
 flagPole(g,-18,.3,3.8,1.3);flagPole(g,18,.3,3.8,1.3);
 const jets=[];for(let i=0;i<10;i++){const j=new THREE.Mesh(new THREE.SphereGeometry(.22,8,6),std('#bfe8ff',{roughness:.1}));g.add(j);jets.push(j);}g.userData.jets=jets;return g;})(),0,9,24.0);
// parliament + hall of honour + treasury (merged block)
const parliament=place((()=>{const g=new THREE.Group();g.add(box(14,6,7,MT.wall,0,2.5,0));g.add(box(15,.6,8,MT.stone,0,5.8,0));
 for(let i=0;i<7;i++)g.add(cyl(.35,.35,5,MT.white,-6+i*2,2.5,4.1,10));const ped=new THREE.Mesh(new THREE.CylinderGeometry(1.7,1.7,14.6,3),MT.white);ped.rotation.set(0,0,Math.PI/2);ped.scale.set(1,1,.55);ped.position.set(0,6.8,3.6);g.add(ped);
 g.add(cyl(2.6,2.6,1.6,MT.white,0,7,-.6,20));const d=new THREE.Mesh(new THREE.SphereGeometry(2.6,20,12,0,Math.PI*2,0,Math.PI/2),MT.teal);d.position.set(0,7.8,-.6);d.castShadow=true;g.add(d);
 for(let k=-2;k<=2;k++)g.add(box(4,.25,1.4,MT.stone,0,.12+(2-Math.abs(k))*0,5.2+k*.0));g.add(box(6,.5,2,MT.stone,0,.25,5.4));flagPole(g,0,10.4,-.6,1.2);
 for(const x of [-4.5,4.5]){const s=new THREE.Mesh(new THREE.PlaneGeometry(2,2.5),new THREE.MeshBasicMaterial({map:FLAG_TEX,side:THREE.DoubleSide}));s.position.set(x,3.6,4.15);g.add(s);}return g;})(),0,27,25.0);
const hall=place((()=>{const g=new THREE.Group();g.add(box(7,5,5.5,MT.wall2,0,2,0));g.add(roof4(7.8,3,MT.gold,6));for(let i=0;i<4;i++)g.add(cyl(.3,.3,4,MT.white,-2.4+i*1.6,2,3,8));return g;})(),-15,27,25.3);
const treasury=place((()=>{const g=new THREE.Group();g.add(box(6,4,4.5,MT.stone,0,1.6,0));for(let i=0;i<4;i++)g.add(cyl(.25,.25,3.2,MT.white,-2.1+i*1.4,1.6,2.5,8));
 const c=new THREE.Mesh(new THREE.CylinderGeometry(.9,.9,.2,20),MT.gold);c.rotation.x=Math.PI/2;c.position.set(0,3.4,2.4);g.add(c);g.add(roof4(6.4,1.4,MT.stone,4.3,4.9));return g;})(),15,27,25.5);
// pizzeria + café on the plaza block corners
function shop(name,bg,fg,wall,roof){const g=new THREE.Group();g.add(box(4.2,3.8,3.8,wall,0,1.4,0));g.add(roof4(4.4,1.2,roof,3.9));
 for(let k=0;k<5;k++)g.add(box(.84,.1,1.2,k%2?MT.white:std(bg),-1.68+k*.84,2.3,2.4));const s=sign(name,bg,fg,3.8,.8);s.position.set(0,2.95,1.93);g.add(s);
 g.add(box(1.4,.06,1,MT.glass,0,1.2,1.92));g.add(box(.7,1.4,.08,MT.wood,1.3,.7,1.92));return g;}
// west column: church + mosque, school, hospital, police + fire
const church=place((()=>{const g=new THREE.Group();g.add(box(5,6,9,MT.white,0,2,0));g.add(roof4(5.6,2.6,MT.red,6.3,9.6));
 g.add(box(2.6,10,2.6,MT.white,0,4,4.6));const sp=new THREE.Mesh(new THREE.ConeGeometry(1.8,3.6,4),MT.red);sp.rotation.y=Math.PI/4;sp.position.set(0,10.8,4.6);g.add(sp);
 g.add(box(.25,1.8,.25,MT.gold,0,13.4,4.6));g.add(box(1.1,.25,.25,MT.gold,0,13.7,4.6));g.add(box(1.2,2,.1,MT.wood,0,1,5.95));for(const x of [-2.52,2.52])for(const z of [-2.5,0,2.5])g.add(box(.08,1.6,.9,MT.glass,x,3,z));return g;})(),-41.6,9,25.8,0);
const mosque=place((()=>{const g=new THREE.Group();g.add(box(8,5,8,MT.wall,0,2,0));g.add(cyl(2.8,2.8,1,MT.wall,0,5,0,20));const d=new THREE.Mesh(new THREE.SphereGeometry(3,20,12,0,Math.PI*2,0,Math.PI/2),MT.green);d.position.y=5.5;d.castShadow=true;g.add(d);
 for(const x of [-4.6,4.6]){g.add(cyl(.55,.65,11,MT.white,x,5.5,3.2,12));g.add(cyl(.8,.8,.4,MT.white,x,9.6,3.2,12));const c=new THREE.Mesh(new THREE.ConeGeometry(.6,1.6,12),MT.green);c.position.set(x,11.8,3.2);g.add(c);}
 g.add(box(2,2.6,.1,MT.green,0,1.3,4.02));return g;})(),-32.6,9,26.0,0);
const kids=[];
const school=place((()=>{const g=new THREE.Group();const y=std('#f5d76e');g.add(box(11,5,4,y,-2,2,-2.5));g.add(roof4(11.5,1.6,MT.red,5.3,4.4).translateX(-2).translateZ(-2.5));
 for(let k=0;k<4;k++)g.add(box(1.2,1,.06,MT.glass,-6+k*2.6,2.6,-.48));const s=sign('SCHOOL','#ffffff','#2f7de1',4,.9);s.position.set(-2,4.1,-.45);g.add(s);
 const yard=box(10,.25,4,std('#c9a26b'),2,.12,2.6);g.add(yard);for(let i=0;i<7;i++){const k=pawn(['#e85d75','#3e8fe6','#f2d33a','#7bd65b','#9b59d6','#ff8a4c','#30c2a8'][i],.5);k.position.set(-2+i*1.3,.25,2.6);k.userData.i=i;g.add(k);kids.push(k);}
 g.add(box(.1,1.6,.1,MT.white,5.5,.8,4.4));g.add(box(.1,1.6,.1,MT.white,5.5,.8,.8));return g;})(),-36,27,26.3);
const hospital=place((()=>{const g=new THREE.Group();g.add(box(10,7,7,MT.white,0,3,0));g.add(box(10.4,.5,7.4,std('#d7e3ea'),0,6.7,0));const r=std('#e8334f');g.add(box(2.2,.6,.2,r,0,4.6,3.55));g.add(box(.6,2.2,.2,r,0,4.6,3.55));
 for(let f=0;f<2;f++)for(let k=0;k<4;k++)if(k!=1&&k!=2||f==0)g.add(box(1,.8,.06,MT.glass,-3.6+k*2.4,1.6+f*2.4,3.53));const s=sign('HOSPITAL','#ffffff','#e8334f',4.2,.8);s.position.set(0,1.4,3.56);g.add(s);
 const pad=cyl(2.2,2.2,.15,std('#3a3a3a'),0,7.05,0,24);g.add(pad);const hs=sign('H','#3a3a3a','#ffffff',2,2);hs.rotation.x=-Math.PI/2;hs.position.set(0,7.15,0);g.add(hs);return g;})(),-36,45,26.6);
const police=place((()=>{const g=new THREE.Group();g.add(box(7,4.5,5,std('#3a6fc4'),0,1.8,0));g.add(box(7.4,.5,5.4,MT.white,0,4.2,0));const s=sign('POLICE','#ffffff','#1d3f8a',4,.8);s.position.set(0,3.2,2.52);g.add(s);
 const car=new THREE.Group();car.add(box(1.6,.8,3,MT.white,0,.5,0));car.add(box(1.4,.6,1.6,std('#1d3f8a'),0,1.1,-.2));const lt=box(.8,.25,.3,std('#e8334f'),0,1.5,-.2);car.add(lt);car.position.set(4.6,0,3.6);g.add(car);g.userData.lt=lt;return g;})(),-40.5,63,26.9);
const fire=place((()=>{const g=new THREE.Group();const rd=std('#c93a2e');g.add(box(7,5,5,rd,0,2,0));g.add(roof4(7.4,1.4,MT.dark,5.2));for(const x of [-1.7,1.7])g.add(box(2.6,2.8,.1,MT.white,x,1.4,2.52));
 const s=sign('FIRE','#ffffff','#c93a2e',2.4,.7);s.position.set(0,3.7,2.53);g.add(s);return g;})(),-31,63,27.1);
// centre-north blocks: post office, news, gaming café, music shop  |  park with pond
const postOffice=place((()=>{const g=shop('POST','#2f7de1','#ffffff',std('#ffd23f'),MT.blue);g.add(box(.6,1.1,.5,std('#2f7de1'),2.6,.55,2.4));return g;})(),-17,45,27.4);
const news=place(shop('HERBERG NEWS','#e8334f','#ffffff',MT.wall3,MT.dark),-8,45,27.6);
const gaming=place((()=>{const g=shop('GAMING CAFÉ','#2b2b3a','#5ff3ff',std('#2b2b3a'),std('#b44cff',{emissive:'#b44cff',emissiveIntensity:.6}));return g;})(),8,45,27.8);
const musicShop=place((()=>{const g=shop('MUSIC','#1d1d1d','#ffcc2e',std('#f0e6ff'),std('#7b4cff'));const n=new THREE.Group();n.add(cyl(.18,.18,.12,std('#1d1d1d'),0,0,0,10));n.add(box(.06,.9,.06,std('#1d1d1d'),.16,.45,0));n.position.set(-1.6,4.8,1.6);n.rotation.x=Math.PI/2;g.add(n);return g;})(),17,45,28.0);
const park=place((()=>{const g=new THREE.Group();g.add(box(40,.2,11.4,MT.grass,0,.1,0));const pond=new THREE.Mesh(new THREE.CylinderGeometry(3,3,.15,24),MT.water);pond.position.set(-8,.25,0);g.add(pond);
 for(let i=0;i<10;i++){const x=-18+i*4,z=i%2?-3.6:3.6;if(Math.abs(x+8)<4&&Math.abs(z)<4)continue;const t=new THREE.Mesh(new THREE.IcosahedronGeometry(1.4,1),std(i%3?'#5fb83a':'#4f9e3a',{flatShading:true}));t.position.set(x,2.4,z);t.castShadow=true;g.add(t);g.add(cyl(.15,.2,1.6,MT.wood,x,1,z,6));}
 g.add(box(30,.06,1.4,MT.walk,0,.22,0));for(const x of [4,12])g.add(box(2,.12,.6,MT.wood,x,.7,1.2));return g;})(),0,63,28.4);
// east column: food street + baguette, ice-cream parlour, houses
const FOOD=[['JACK\'S BURGERS','#ffcc2e','#c0392b'],['KEBAB','#c0392b','#ffffff'],['DONUTS','#ff8fc2','#ffffff'],['BAGUETTES','#2f6fd6','#ffffff']];
const foodShops=FOOD.map(([n,bg,fg],i)=>place(shop(n,bg,fg,WALLS[i%5],ROOFS[i%6]),29.4+i*4.4,9,28.8+i*.2));
const pizzeria=place((()=>{const g=shop('PIZZA','#d9473b','#ffffff',MT.wall,MT.red);const pc=document.createElement('canvas');pc.width=pc.height=128;const x=pc.getContext('2d');x.fillStyle='#e9b35f';x.beginPath();x.arc(64,64,62,0,7);x.fill();x.fillStyle='#d9473b';x.beginPath();x.arc(64,64,50,0,7);x.fill();
 const sg=new THREE.Mesh(new THREE.CircleGeometry(1.1,20),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(pc),side:THREE.DoubleSide}));sg.position.set(0,5.2,1);g.add(sg);g.userData.sign=sg;return g;})(),38,27,29.6);
const icecream=place((()=>{const g=shop('ICE CREAM','#ff8fc2','#ffffff',std('#fff4fa'),std('#ff8fc2'));const c=new THREE.Group();c.add(new THREE.Mesh(new THREE.ConeGeometry(.5,1.2,10),std('#e9b35f')));const s=new THREE.Mesh(new THREE.SphereGeometry(.55,12,10),std('#ffd1e8'));s.position.y=.8;c.add(s);c.rotation.x=Math.PI;c.position.set(0,5.4,1.2);g.add(c);return g;})(),30,27,30.0);
// residential lots: four houses per block, each on its own lot
const RES_BLOCKS=[[-60,9],[-60,27],[-60,45],[60,9],[60,27],[60,45],[60,63],[42,27],[36,45],[36,63]];
const houses=[];
RES_BLOCKS.forEach(([bu,bv],bi)=>{const lots=bu===42?[[.6,0]]:[[-4.4,-2.8],[4.4,-2.8],[-4.4,2.8],[4.4,2.8]];
 lots.forEach(([du,dv],k)=>{const i=bi*4+k;const front=dv<0?0:Math.PI;const g=homeModel(3+(i%3)*.3,2.8,2.3+(i%4)*.2,WALLS[i%5],ROOFS[(i*2+1)%6],i);
  houses.push(place(g,bu+du,bv+(dv<0?-2.6:2.6),30.4+bi*.25+k*.06,front));});});
// riverside: watermill (@dusan_rajic) on the north-west corner where the river crosses town
const WM=(()=>{let best=[-60,63],bd=1e9;for(let u=-80;u<=-48;u+=2)for(let v=50;v<=80;v+=2){const p=LW(u,v);const d=Math.abs(riverDist(p.x,p.y)-6);if(d<bd){bd=d;best=[u,v];}}return best;})();
const watermill=place((()=>{const g=new THREE.Group();g.add(box(5,4.4,4,std('#d8c39a'),0,1.7,0));g.add(roof4(5.6,1.8,std('#8a3a2a'),4.8));
 const wheel=new THREE.Group();wheel.add(new THREE.Mesh(new THREE.TorusGeometry(2,.18,6,20),MT.wood));for(let k=0;k<8;k++){const p=box(.25,4,.6,MT.wood,0,0,0);p.rotation.z=k/8*Math.PI;wheel.add(p);}
 wheel.position.set(3.2,1.8,0);wheel.rotation.y=Math.PI/2;g.add(wheel);g.userData.wheel=wheel;return g;})(),WM[0],WM[1],48.6,Math.PI/2);
// ---------- coast: waterfront, piers, Port Sunny, lighthouse, mansion, beach houses, beach spot
function pier(u,len,t){const g=new THREE.Group();for(let i=0;i<len;i++){g.add(box(3,.25,1.3,MT.wood,0,0,i*1.4));if(i%2==0)for(const x of [-1.4,1.4])g.add(cyl(.15,.15,3,MT.wood,x,-1.2,i*1.4,6));}
 const p=L(u,-12);g.position.set(p.x,SEA+.6,p.z);g.rotation.y=FACE;g.userData.t=t;g.visible=false;scene.add(g);NEW.push(g);return g;}
pier(-6,14,31.0);pier(6,14,31.1);pier(-20,10,31.2);
function ship(sz,sail){const g=new THREE.Group();g.add(box(2.6,1.3,7,std('#7a4a26'),0,.3,0));const bow=new THREE.Mesh(new THREE.ConeGeometry(1.3,2.2,4),std('#7a4a26'));bow.rotation.x=Math.PI/2;bow.rotation.y=Math.PI/4;bow.scale.set(1,1,.55);bow.position.set(0,.3,4.4);g.add(bow);
 g.add(box(2.4,.2,6.8,std('#c9a26b'),0,.98,0));g.add(cyl(.12,.15,6.5,MT.wood,0,4.2,.4,6));const s=new THREE.Mesh(new THREE.PlaneGeometry(3.6,2.8),sail?std(sail,{side:THREE.DoubleSide}):new THREE.MeshStandardMaterial({map:FLAG_TEX,side:THREE.DoubleSide}));s.rotation.y=Math.PI/2;s.position.set(0,4.4,.4);g.add(s);g.scale.setScalar(sz);return g;}
const BOATS=[];function floatAt(g,u,v,t,rot=0){const p=L(u,v);g.position.set(p.x,SEA+.1,p.z);g.rotation.y=FACE+rot;g.userData.t=t;g.userData.base=SEA+.1;g.visible=false;scene.add(g);NEW.push(g);BOATS.push(g);return g;}
floatAt(ship(1.2),-26,-34,31.4,1.6);floatAt(ship(1.3),-8,-40,31.5,1.9);
// Port Sunny (@warenoty90): trade dock, cranes, cargo ship
const portSunny=place((()=>{const g=new THREE.Group();g.add(box(16,.6,7,MT.stone,0,-.1,3));for(let k=0;k<6;k++)g.add(box(1.8,1.5,1.5,[MT.red,MT.blue,MT.orange,MT.teal,std('#f2c230'),MT.green][k],-6+k*2.2,.9,1.6));
 for(const x of [-5,4]){const cr=new THREE.Group();cr.add(box(.4,7,.4,std('#f2a33a'),0,3.5,0));cr.add(box(6,.35,.35,std('#f2a33a'),1.6,7,0));cr.add(box(.1,2,.1,MT.dark,4,6,0));cr.position.set(x,0,5.4);g.add(cr);}
 const s=sign('PORT SUNNY','#ffcc2e','#1d3f8a',6,1);s.position.set(0,2.4,-.4);g.add(s);g.add(box(.2,2.4,.2,MT.dark,-2.6,1.2,-.4));g.add(box(.2,2.4,.2,MT.dark,2.6,1.2,-.4));return g;})(),28,-11,34.6);
const cargo=floatAt((()=>{const g=new THREE.Group();g.add(box(4,2,14,std('#1d3f8a'),0,.6,0));g.add(box(3.6,.3,13.6,std('#c94a3a'),0,1.65,0));for(let k=0;k<4;k++)g.add(box(3,1.4,2.4,[MT.red,MT.orange,MT.teal,std('#f2c230')][k],0,2.5,-4.5+k*2.8));
 g.add(box(3.2,3,2.6,MT.white,0,3.2,5.4));g.add(cyl(.5,.6,2,std('#e8334f'),0,5.6,5.4,10));return g;})(),30,-30,34.9,Math.PI/2+.1);
// lighthouse + the lighthouse man (@ihyxiyo765) + keeper (@grate_the_gratefu)
const beam=new THREE.Mesh(new THREE.ConeGeometry(3,24,16,1,true),new THREE.MeshBasicMaterial({color:'#fff3a8',transparent:true,opacity:.26,depthWrite:false,side:THREE.DoubleSide}));
const lighthouse=place((()=>{const g=new THREE.Group();for(let i=0;i<6;i++)g.add(cyl(1.8-i*.16,1.9-i*.16,2.2,i%2?MT.white:MT.red,0,i*2.2+.6,0,16));
 g.add(cyl(1.6,1.6,.3,MT.dark,0,13.3,0,16));g.add(cyl(1.1,1.1,1.6,std('#fff3a8',{emissive:'#ffdf6a',emissiveIntensity:.8}),0,14.2,0,14));g.add(new THREE.Mesh(new THREE.ConeGeometry(1.4,1.4,14),MT.red).translateY(15.7));
 const man=pawn('#2f7de1',.8);man.position.set(1.3,13.45,0);g.add(man);const hut=box(3,2.2,2.4,MT.white,3.6,1,0);g.add(hut);g.add(roof4(3.4,1,MT.red,2.6).translateX(3.6));
 const piv=new THREE.Group();piv.position.y=14.2;beam.rotation.z=Math.PI/2;beam.position.x=12;piv.add(beam);g.add(piv);g.userData.piv=piv;return g;})(),86,-6,42.8);
// mansion at the coast (@cocobananapotato)
const mansion=place((()=>{const g=new THREE.Group();const w=std('#fbf6ec');g.add(box(12,6,7,w,0,2.5,0));g.add(box(5,8.5,5,w,0,3.8,1));g.add(roof4(12.6,2,std('#4a5a7a'),6.4,7.6));g.add(roof4(5.6,2.2,std('#4a5a7a'),9.2));
 for(let f=0;f<2;f++)for(let k=0;k<5;k++)g.add(box(1,1.1,.06,MT.glass,-5+k*2.5,1.6+f*2.6,3.53));for(let i=0;i<4;i++)g.add(cyl(.28,.28,4.4,MT.white,-1.8+i*1.2,2.2,3.9,8));
 const pool=box(7,.25,3,MT.water,0,-.2,6.6);g.add(pool);for(const x of [-6.5,6.5]){const p=new THREE.Mesh(new THREE.IcosahedronGeometry(1.2,1),std('#4f9e3a',{flatShading:true}));p.position.set(x,1.6,5.4);g.add(p);g.add(cyl(.12,.16,1.4,MT.wood,x,.7,5.4,6));}
 const fp=new THREE.Group();flagPole(fp,0,0,0,1);fp.position.set(6.6,0,-2.6);g.add(fp);return g;})(),-88,-5,39.8);
// beach houses (@myshayla861) + beach spot with parasols (@_eruzazyy)
const beachHouses=[-66,-58,-50].map((u,i)=>place((()=>{const g=homeModel(3.2,3,2.4,[std('#bfe8f5'),std('#ffe0b8'),std('#d8f5d0')][i],[MT.blue,MT.orange,MT.teal][i],i+20);g.add(box(3.6,.15,1.6,MT.wood,0,.05,2.4));return g;})(),u,-6,40.3+i*.15));
const beachSpot=place((()=>{const g=new THREE.Group();for(let k=0;k<6;k++){const x=-7.5+k*3;g.add(cyl(.06,.06,2.2,MT.white,x,1.1,0,5));const p=new THREE.Mesh(new THREE.ConeGeometry(1.3,.6,8),[MT.red,MT.orange,MT.teal,MT.blue,std('#f2c230'),MT.pink][k]);p.position.set(x,2.3,0);g.add(p);
 g.add(box(.7,.08,1.7,[MT.white,std('#f2c230')][k%2],x+.9,.12,.4));}const vb=new THREE.Group();vb.add(box(.08,2,.08,MT.white,-3,1,0));vb.add(box(.08,2,.08,MT.white,3,1,0));vb.add(box(6,.6,.03,std('#ffffff'),0,1.7,0));vb.position.set(0,0,-3.2);g.add(vb);return g;})(),-32,-7,40.9);
// ---------- bridges to the two new islands (@doomstrikerhehe)
function isle(u,v,R,sd){const c=LW(u,v);const g=new THREE.Group();let geo=new THREE.PlaneGeometry(R*2.6,R*2.6,40,40);geo.rotateX(-Math.PI/2);const pa=geo.attributes.position;
 const hh=(x,z)=>{const d=Math.hypot(x,z)/R;return (1-Math.pow(Math.min(d,1.5),2.2))*5.5+(fbm(x*.08+sd,z*.08)-.5)*2.4;};
 const col=new Float32Array(pa.count*3);for(let i=0;i<pa.count;i++){const y=hh(pa.getX(i),pa.getZ(i));pa.setY(i,y);if(y<-1)C.set('#7fd6d0');else if(y<1.4)C.set('#efdfa8');else C.set('#79c950');col[i*3]=C.r;col[i*3+1]=C.g;col[i*3+2]=C.b;}
 geo.setAttribute('color',new THREE.BufferAttribute(col,3));geo.computeVertexNormals();const m=new THREE.Mesh(geo,new THREE.MeshStandardMaterial({vertexColors:true}));m.receiveShadow=true;g.add(m);
 for(let i=0;i<18;i++){const a=i*2.4+sd,r=R*(.35+.45*((i*37)%10)/10);const x=Math.cos(a)*r,z=Math.sin(a)*r,y=hh(x,z);if(y<1.6)continue;const t=new THREE.Mesh(roundG,std('#5fb83a',{flatShading:true}));t.position.set(x,y-.4,z);t.scale.setScalar(.7);t.castShadow=true;g.add(t);}
 g.position.set(c.x,SEA-.6,c.y);g.userData.top=hh(0,0);scene.add(g);return g;}
const isleT=isle(-42,-66,20,3.3), isleC=isle(44,-62,17,7.1);
{const t=new THREE.Group();const y0=isleT.userData.top;for(let i=0;i<5;i++)t.add(box(7,1,7,i%2?MT.blue:MT.white,0,y0+.5+i,0));t.add(cyl(3.6,3.6,.6,MT.white,0,y0+5.3,0,20));
 const d=new THREE.Mesh(new THREE.SphereGeometry(3.4,20,12,0,Math.PI*2,0,Math.PI/2),MT.gold);d.position.y=y0+5.6;t.add(d);isleT.add(t);}
{const c=new THREE.Group();const y0=isleC.userData.top;c.add(box(4.5,3,3.5,MT.wall2,0,y0+1.2,0));c.add(roof4(4.8,1.4,MT.teal,y0+3.4));
 for(let i=0;i<4;i++){const a=i*1.6+.4,x=Math.cos(a)*5,z=Math.sin(a)*5;c.add(cyl(.08,.08,2.2,MT.white,x,y0+1.1,z,6));const p=new THREE.Mesh(new THREE.ConeGeometry(1.4,.6,8),i%2?MT.red:MT.orange);p.position.set(x,y0+2.3,z);c.add(p);}isleC.add(c);}
function bridgeTo(u0,isl,t){const a=L(u0,-11);const b=isl.position;const dx=b.x-a.x,dz=b.z-a.z,len=Math.hypot(dx,dz)-14;const g=new THREE.Group();const n=Math.ceil(len/3);
 for(let i=0;i<n;i++){const s=(i+.5)/n*len;const seg=new THREE.Group();const arch=Math.sin((i+.5)/n*Math.PI)*2.2;seg.add(box(4.6,.4,3.1,MT.stone,0,arch,0));seg.add(box(3.4,.06,3.1,MT.road,0,arch+.22,0));
  for(const x of [-2.2,2.2])seg.add(box(.16,.8,3.1,MT.white,x,arch+.6,0));if(i%3==1){seg.add(box(1,6,1,MT.stone,0,arch-3,0));}if(i%5==2){const l=new THREE.Group();l.add(cyl(.06,.07,2.6,MT.dark,0,1.3,0,6));l.add(box(.26,.2,.26,MT.lamp,0,2.6,0));l.position.set(2.2,arch,0);seg.add(l);}
  seg.position.set(0,0,s);g.add(seg);}
 g.position.set(a.x,Math.max(a.y,SEA+1.4)+.4,a.z);g.rotation.y=Math.atan2(dx,dz);g.userData.t=t;g.visible=false;scene.add(g);NEW.push(g);return g;}
const bridge1=bridgeTo(-38,isleT,34.2), bridge2=bridgeTo(40,isleC,34.4);
// ---------- outskirts: airport (+ air traffic control @rainbowpopsicle1777, Cessna @liam_aviation747), stadium, amusement park
const RV=96;
const airport=place((()=>{const g=new THREE.Group();const p0=L(0,RV);const top=Math.max(p0.y,L(-30,RV).y,L(30,RV).y)+1.2;const dy=top-p0.y;
 g.add(box(64,14,11,std('#86c45a'),0,dy-7.2,0));g.add(box(62,.4,7,MT.road,0,dy,0));for(let i=-7;i<=7;i++)g.add(box(2.4,.05,.35,MT.white,i*4,dy+.22,0));
 const term=new THREE.Group();term.add(box(16,4,5,std('#bfe3f5'),0,2,0));term.add(box(16.4,.5,5.4,MT.white,0,4.2,0));const s=sign('HERBERG AIRPORT','#ffffff','#2f7de1',8,.9);s.position.set(0,3.2,2.52);term.add(s);
 const ct=new THREE.Group();ct.add(cyl(.9,1.1,9,MT.white,0,4.5,0,12));ct.add(cyl(2,1.7,2,std('#3d6f8f'),0,9.6,0,12));ct.add(box(.1,1.4,.1,MT.dark,0,11.2,0));ct.position.set(10.5,0,0);term.add(ct);term.position.set(-2,dy,-9.5);g.add(term);
 g.add(box(24,.3,6,std('#8a8f94'),-2,dy-.05,-6));g.userData.dy=dy;return g;})(),0,RV,0.0);
airport.userData.t=-1;
function planeModel(col,s=1){const g=new THREE.Group();const m=std(col);const f=new THREE.Mesh(new THREE.CapsuleGeometry(.7,6,6,12),m);f.rotation.z=Math.PI/2;g.add(f);
 g.add(box(1.6,.15,8,m,.2,0,0));g.add(box(.9,1.8,.15,m,-3.3,1,0));g.add(box(.8,.12,3,m,-3.3,.3,0));const ck=new THREE.Mesh(new THREE.SphereGeometry(.5,10,8),std('#2f6fa8'));ck.position.set(2.9,.35,0);g.add(ck);g.traverse(o=>o.castShadow=true);g.scale.setScalar(s);return g;}
const jetliner=planeModel('#ffffff',1.1), cessna=planeModel('#f2c230',.5);scene.add(jetliner,cessna);
const SU=110,SV=36;
const stadium=place((()=>{const g=new THREE.Group();const p0=L(SU,SV);const lift=Math.max(0,L(SU-10,SV).y-p0.y,L(SU+10,SV).y-p0.y)+.6;
 g.add(box(28,10,21,std('#86c45a'),0,lift-5.2,0));g.add(box(18,.3,11,std('#4caf50'),0,lift,0));for(let i=0;i<6;i++)g.add(box(3,.02,11,std('#43a047'),-7.5+i*3,lift+.17,0));
 const W=MT.white;g.add(box(18,.04,.15,W,0,lift+.2,5.4));g.add(box(18,.04,.15,W,0,lift+.2,-5.4));g.add(box(.15,.04,11,W,0,lift+.2,0));
 for(let r=0;r<4;r++){const m=r%2?MT.blue:MT.red;g.add(box(22+r*1.2,1,1.6,m,0,lift+.5+r*.9,7+r*1.4));g.add(box(22+r*1.2,1,1.6,m,0,lift+.5+r*.9,-7-r*1.4));g.add(box(1.6,1,15+r*1.6,r%2?MT.red:MT.blue,11.5+r*1.4,lift+.5+r*.9,0));g.add(box(1.6,1,15+r*1.6,r%2?MT.red:MT.blue,-11.5-r*1.4,lift+.5+r*.9,0));}
 const s=sign('CLUB FC HERBEGUS','#1d3f8a','#ffcc2e',12,1.5);s.position.set(0,lift+5.6,-12.6);g.add(s);g.userData.lift=lift;return g;})(),SU,SV,0.0,Math.PI/2);
stadium.userData.t=-1;
const coaster=place((()=>{const g=new THREE.Group();const pts=[];for(let i=0;i<=120;i++){const a=i/120*Math.PI*2;pts.push(v3(Math.cos(a)*9,4+3*Math.sin(a*2)+(Math.abs(a-Math.PI)<.6?5*Math.cos((a-Math.PI)/.6*Math.PI/2):0),Math.sin(a)*5));}
 const curve=new THREE.CatmullRomCurve3(pts,true);g.add(new THREE.Mesh(new THREE.TubeGeometry(curve,200,.28,6,true),MT.red));for(let i=0;i<24;i++){const p=curve.getPoint(i/24);g.add(cyl(.12,.12,p.y,std('#d9d9d9'),p.x,p.y/2,p.z,5));}
 const cart=new THREE.Group();cart.add(box(1.4,.8,2,std('#ffcc2e'),0,.6,0));g.add(cart);g.userData={curve,cart};return g;})(),-112,36,0.0);
coaster.userData.t=-1;
// San Vista site marker (named on Day 4, built at 2,000 likes)
const sanVista=place((()=>{const g=new THREE.Group();for(let k=0;k<4;k++){g.add(box(.2,1.2,.2,MT.wood,(k%2?1:-1)*9,.6,(k<2?1:-1)*7));}g.add(box(18,.06,.06,std('#f2a33a'),0,1,7));g.add(box(18,.06,.06,std('#f2a33a'),0,1,-7));g.add(box(.06,.06,14,std('#f2a33a'),9,1,0));g.add(box(.06,.06,14,std('#f2a33a'),-9,1,0));
 const s=sign('SAN VISTA · COMING SOON','#1d3f8a','#ffcc2e',8,1.1);s.position.set(0,2.4,7.1);g.add(s);g.add(box(.2,2.6,.2,MT.dark,-3.6,1.3,7.1));g.add(box(.2,2.6,.2,MT.dark,3.6,1.3,7.1));return g;})(),130,4,51.5);
// ---------- the forest that was cut for the city: trees stand, then fall to stumps
const cutPine=new THREE.InstancedMesh(pineG,std('#2f7a3a',{flatShading:true}),CUT.length), cutTrunk=new THREE.InstancedMesh(trunkG,MT.wood,CUT.length);
const stumpG=new THREE.CylinderGeometry(.3,.38,.45,8);stumpG.translate(0,.22,0);const stumps=new THREE.InstancedMesh(stumpG,std('#9c7a52'),CUT.length);
cutPine.castShadow=cutTrunk.castShadow=true;scene.add(cutPine,cutTrunk,stumps);
const CUTIN=CUT.map(([x,,z])=>{const [u,v]=cityUV(x,z);return u>CITY_RECT.u0&&u<CITY_RECT.u1&&v>CITY_RECT.v0&&v<CITY_RECT.v1+8;});
const CUTT=CUT.map(([x,y,z])=>{const [u,v]=cityUV(x,z);return 9.4+Math.min(6,Math.hypot(u,v-30)/16)+((x*13+z*7)%1+1)%1*.6;});
const _m=new THREE.Matrix4(),_q=new THREE.Quaternion(),_s=new THREE.Vector3(),_p=new THREE.Vector3(),_e=new THREE.Euler();
function cutAt(t){CUT.forEach(([x,y,z,s],i)=>{const d=t-CUTT[i];const fall=Math.min(1,Math.max(0,d/.5));const gone=d>.7;const H0=Math.max(H(x,z),SEA);
  _e.set(fall*1.4,(x+z)%6,0);_q.setFromEuler(_e);_s.setScalar(gone?0:s);_p.set(x,H0-.2,z);_m.compose(_p,_q,_s);cutPine.setMatrixAt(i,_m);cutTrunk.setMatrixAt(i,_m);
  _q.identity();_s.setScalar(d>.35&&!CUTIN[i]?s:0);_m.compose(_p,_q,_s);stumps.setMatrixAt(i,_m);});
 cutPine.instanceMatrix.needsUpdate=cutTrunk.instanceMatrix.needsUpdate=stumps.instanceMatrix.needsUpdate=true;}
// ---------- citizens: countryside crowd (small) + pedestrians on the sidewalks
const STATS={views:978,likes:64,shares:7,saves:13,followers:1354,votesA:3,votesB:6};
const NC=900, NP=454, bodyGI=new THREE.CapsuleGeometry(.32,.7,4,8), headGI=new THREE.SphereGeometry(.27,10,8), cMat=new THREE.MeshStandardMaterial({roughness:.5});
const PCOL=['#f2a33a','#30c2a8','#9b59d6','#e85d75','#3e8fe6','#f2d33a','#7bd65b','#ff8a4c','#ff6fb1','#5fd3f3'].map(c=>new THREE.Color(c));
const bodies=new THREE.InstancedMesh(bodyGI,cMat,NC+NP), heads=new THREE.InstancedMesh(headGI,cMat,NC+NP);bodies.castShadow=heads.castShadow=true;scene.add(bodies,heads);
const CROWD=[];
for(let i=0;i<90000&&CROWD.length<NC;i++){const x=(rnd()-.5)*300,z=(rnd()-.5)*300,y=H(x,z);if(y<SEA+.8||y>18||riverDist(x,z)<5)continue;const [u,v]=cityUV(x,z);
 if(u>-120&&u<140&&v>-16&&v<108)continue;if(Math.hypot(x-SITE_B.x,z-SITE_B.y)<16)continue;CROWD.push({x,y,z,c:PCOL[CROWD.length%10]});}
const WALKERS=[];for(let i=0;i<NP;i++){const r=SEGROAD[i%11];const side=(i%2?1:-1)*2.6;WALKERS.push({r,side,ph:((i*.6180339)%1),sp:(.006+((i*37)%10)*.0006)*(i%3?1:-1),c:PCOL[(i*7)%10]});}
CROWD.forEach((p,i)=>{bodies.setColorAt(i,p.c);heads.setColorAt(i,p.c);});WALKERS.forEach((w,i)=>{bodies.setColorAt(NC+i,w.c);heads.setColorAt(NC+i,w.c);});
const CS=.85;
function peopleAt(t,walkOn){for(let i=0;i<CROWD.length;i++){const p=CROWD[i];const y=p.y+Math.abs(Math.sin(t*3+i))*.05;_q.identity();_s.setScalar(CS);_p.set(p.x,y+.7*CS-.1,p.z);_m.compose(_p,_q,_s);bodies.setMatrixAt(i,_m);_p.y=y+1.55*CS-.1;_m.compose(_p,_q,_s);heads.setMatrixAt(i,_m);}
 for(let i=0;i<WALKERS.length;i++){const w=WALKERS[i];const [u0,v0,u1,v1]=w.r;let a=((w.ph+t*w.sp)%1+1)%1;const u=u0+(u1-u0)*a,v=v0+(v1-v0)*a;const len=Math.hypot(u1-u0,v1-v0);const nu=-(v1-v0)/len,nv=(u1-u0)/len;
  const P=L(u+nu*w.side,v+nv*w.side,.32);const s=walkOn?CS*.95:0;const bob=Math.abs(Math.sin(t*8+i))*.08;_q.identity();_s.setScalar(s);_p.set(P.x,P.y+.7*s-.1+bob,P.z);_m.compose(_p,_q,_s);bodies.setMatrixAt(NC+i,_m);_p.y=P.y+1.55*s-.1+bob;_m.compose(_p,_q,_s);heads.setMatrixAt(NC+i,_m);}
 bodies.instanceMatrix.needsUpdate=heads.instanceMatrix.needsUpdate=true;}
// ice cream truck (@liambluee @muazzambotak) driving the coast boulevard
const iceTruck=(()=>{const g=new THREE.Group();g.add(box(1.8,1.8,3.4,std('#fff4fa'),0,1.1,0));g.add(box(1.7,1.2,1.2,std('#ff8fc2'),0,.85,2.1));g.add(box(1.5,.5,.06,MT.glass,0,1.2,2.72));
 const c=new THREE.Group();c.add(new THREE.Mesh(new THREE.ConeGeometry(.35,.9,10),std('#e9b35f')));const s=new THREE.Mesh(new THREE.SphereGeometry(.4,10,8),std('#ffd1e8'));s.position.y=.6;c.add(s);c.rotation.x=Math.PI;c.position.set(0,2.6,0);g.add(c);
 for(const x of [-.9,.9])for(const z of [-1.1,1.6]){const w=cyl(.32,.32,.2,MT.dark,x,.32,z,10);w.rotation.z=Math.PI/2;g.add(w);}g.traverse(o=>o.castShadow=true);g.visible=false;scene.add(g);return g;})();
// birds
const birds=[];for(let i=0;i<9;i++){const b=new THREE.Group();const m=std('#2b2b2b');const wl=box(.9,.05,.25,m,-.42,0,0);wl.rotation.z=.35;const wr=box(.9,.05,.25,m,.42,0,0);wr.rotation.z=-.35;b.add(wl,wr);b.userData={i,wl,wr};scene.add(b);birds.push(b);}
// cooled lava flows + ruins on the far side of the volcano
const awayAng=Math.atan2(V.y-SITE_A.y,V.x-SITE_A.x);
[-.75,-.25,.3,.8].forEach((da,fi)=>{const a=awayAng+da;let x=V.x+Math.cos(a)*12,z=V.y+Math.sin(a)*12;const pts=[];let dx=Math.cos(a),dz=Math.sin(a);
 for(let s=0;s<120;s++){const y=H(x,z);pts.push(v3(x,Math.max(y,SEA)+.5,z));if(y<SEA+.2)break;const gx=H(x+1,z)-H(x-1,z),gz=H(x,z+1)-H(x,z-1),gl=Math.hypot(gx,gz)||1;dx=dx*.6-gx/gl*.4;dz=dz*.6-gz/gl*.4;const dl=Math.hypot(dx,dz);dx/=dl;dz/=dl;x+=dx*1.8;z+=dz*1.8;}
 scene.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),pts.length*2,1.6,6,false),std('#5a2f24')));});
const ruins=(()=>{const g=new THREE.Group();const st=std('#cbbf9f'),st2=std('#a99d80');for(let i=0;i<22;i++){const a=i/22*Math.PI*2;const h=2.5+((i*53)%10)/10*3.5*(i%5==0?.35:1);const p=new THREE.Group();p.add(box(1.1,h,1.1,st,0,h/2,0));if(h>4)p.add(box(2.3,.7,1.2,st2,0,h+.35,0));p.position.set(Math.cos(a)*8,0,Math.sin(a)*8);p.rotation.y=-a;g.add(p);}
 const tw=new THREE.Group();tw.add(cyl(1.8,2.1,7,st2,0,3.5,0,8));tw.position.set(13,0,-4);g.add(tw);g.position.set(SITE_B.x,H(SITE_B.x,SITE_B.y)-.2,SITE_B.y);scene.add(g);return g;})();
