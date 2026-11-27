// ===== REQUESTS PART 4 (remake): volcano village, rail, river & a new East District — world coordinates =====
// CLEAR: [[-30,3,20],[-22,-11,5],[-6,-14,7],[3,-19,8],[-50,-15,10],[-58,-4,11],[10,11,9],[37,24,18],[-24,31,7],[-26,20,6],[-28,10,6],[-29,0,6],[-29,-9,7],[24,14,6]]
const PRIOR=(()=>{const lv=window.LEVEL||0;return ()=>lv<(window.LEVEL||0);})();
window.CROWD_SCALE=.9;                                   // smaller citizens: the island feels bigger and less crowded
const pawnMini=(c,s=.8)=>{const g=new THREE.Group();const m=std(c);const b=new THREE.Mesh(new THREE.CapsuleGeometry(.32,.7,4,8),m);b.position.y=.7;const h=new THREE.Mesh(new THREE.SphereGeometry(.27,10,8),m);h.position.y=1.55;g.add(b,h);g.traverse(o=>o.castShadow=true);g.scale.setScalar(s);return g;};
function sign(text,bg,fg,w=3,h=.8){const c=document.createElement('canvas');c.width=512;c.height=Math.round(512*h/w);const x=c.getContext('2d');x.fillStyle=bg;x.fillRect(0,0,c.width,c.height);
 x.fillStyle=fg;x.font=`bold ${Math.round(c.height*.6)}px Nunito, sans-serif`;x.textAlign='center';x.textBaseline='middle';x.fillText(text,c.width/2,c.height/2+4);
 return new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(c),side:THREE.DoubleSide}));}
const W=(x,z,h=0)=>v3(x,Math.max(H(x,z),SEA)+h,z);
function toUV(x,z){const dx=x-CITY.x,dz=z-CITY.y;return [dx*ALONG.x+dz*ALONG.y, -(dx*SEAWARD.x+dz*SEAWARD.y)];}
function placeW(g,x,z,t,rot=0,r=6){const [u,v]=toUV(x,z);return placeAt(g,u,v,t,rot,r);}
const DARK=std('#4a5058'), GLASS=std('#9fd4f2',{roughness:.2,metalness:.1}), FRAME=std('#ffffff'), LAMPGLOW=std('#fff2b0',{emissive:'#ffd86a',emissiveIntensity:.9});
const FLOWERS=[std('#ff6fb1'),std('#ffd84a'),std('#ffffff'),std('#b98cff'),std('#ff7a3a')];
CROWD.forEach(p=>{if(Math.hypot(p.x+28,p.z-2)<22||Math.hypot(p.x-37,p.z-24)<20)p.hide=true;});   // keep the new areas readable

// ---------- detail kit
function detailedHouse(w,d,h,wall,roof,seed=0,{garden=true,smoke=true}={}){const g=new THREE.Group();
 g.add(box(w,h+2,d,wall,0,(h+2)/2-2,0));                                             // walls (sunk into the slope)
 const r=new THREE.Mesh(new THREE.ConeGeometry(Math.max(w,d)*.78,1.6,4),roof);r.rotation.y=Math.PI/4;r.scale.set(w/Math.max(w,d),1,d/Math.max(w,d));r.position.y=h+.8;r.castShadow=true;g.add(r);
 g.add(box(.62,1.15,.08,MT.wood,0,.58,d/2+.04));g.add(box(.78,.1,.1,FRAME,0,1.2,d/2+.05));                    // door + lintel
 for(const x of [-w*.3,w*.3]){g.add(box(.62,.56,.06,GLASS,x,1.45,d/2+.04));g.add(box(.72,.08,.08,FRAME,x,1.77,d/2+.06));g.add(box(.72,.08,.12,FRAME,x,1.13,d/2+.07));
  const fb=box(.66,.16,.22,MT.wood,x,1.02,d/2+.16);g.add(fb);for(let k=0;k<3;k++){const f=new THREE.Mesh(new THREE.SphereGeometry(.08,6,5),FLOWERS[(seed+k)%5]);f.position.set(x-.2+k*.2,1.16,d/2+.18);g.add(f);}}
 for(const z of [-d*.2,d*.2]){g.add(box(.06,.5,.55,GLASS,w/2+.03,1.45,z));g.add(box(.06,.5,.55,GLASS,-w/2-.03,1.45,z));}
 const ch=box(.42,1.3,.42,MT.stone,w*.25,h+1.1,-d*.15);g.add(ch);g.userData.chimney=v3(w*.25,h+1.9,-d*.15);
 if(garden){const fm=std('#f3ecd8');for(let k=-3;k<=3;k++){g.add(box(.08,.5,.08,fm,k*.55,.25,d/2+1.6));}g.add(box(3.4,.06,.05,fm,0,.42,d/2+1.6));
  for(let k=0;k<4;k++){const b=new THREE.Mesh(new THREE.IcosahedronGeometry(.32,0),std(k%2?'#4f9e3a':'#5fb83a',{flatShading:true}));b.position.set(-1.4+k*.95,.2,d/2+1.1);g.add(b);}}
 g.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;}});g.userData.smoke=smoke;return g;}
const lampG=new THREE.Group();
function lamp(p){const g=new THREE.Group();g.add(cyl(.07,.09,3.2,DARK,0,1.6,0,6));g.add(box(.5,.08,.08,DARK,.22,3.15,0));const l=box(.3,.22,.3,LAMPGLOW,.42,3.02,0);g.add(l);g.position.copy(p);lampG.add(g);return g;}
const bushG=new THREE.Group(), rockG=new THREE.Group();
function bush(x,z,s=1){const b=new THREE.Mesh(new THREE.IcosahedronGeometry(.6*s,0),std(['#4f9e3a','#5fb83a','#3f8a32'][Math.abs(Math.round(x*7+z))%3],{flatShading:true}));b.position.copy(W(x,z,.25*s));b.castShadow=true;bushG.add(b);}
function rock(x,z,s=1){const r=new THREE.Mesh(new THREE.DodecahedronGeometry(.8*s,0),std(['#6f6a62','#857e74','#5d5650'][Math.abs(Math.round(x*3+z*5))%3],{flatShading:true}));r.position.copy(W(x,z,.2*s));r.rotation.set(x,z,x+z);r.castShadow=true;rockG.add(r);}
const smokePuffs=[];function smokeSource(fnPos,n=4,col='#d8d8d8'){for(let i=0;i<n;i++){const b=new THREE.Mesh(new THREE.IcosahedronGeometry(.45,1),new THREE.MeshStandardMaterial({color:col,flatShading:true,transparent:true,opacity:.7}));b.userData={fnPos,i,n};b.visible=false;scene.add(b);smokePuffs.push(b);}}

// ---------- volcano village: two neighbourhoods either side of the railway, with gardens (@abu_alfuariq @bastiboy33 @melzenjorel)
const VILLAGE=[[-44,-3],[-41,5],[-37,-7],[-36,1],[-39,12],[-44,10],[-18,-5],[-15,3],[-12,-7],[-10,2],[-33,9],[-22,-1]];
const WALLS=[std('#e2c9a0'),std('#cfb287'),MT.wall2,std('#d9e6ef'),MT.wall];const ROOFS=[MT.red,MT.dark,MT.orange,MT.blue,std('#8a3a2a')];
const villageHouses=VILLAGE.map(([x,z],i)=>{const g=detailedHouse(2.8+(i%3)*.4,2.6+(i%2)*.5,2.2+(i%4)*.25,WALLS[i%5],ROOFS[(i*2)%5],i);
 const h=placeW(g,x,z,4.6+i*.2,((i*.9)%3)-1.4,4);smokeSource(()=>h.localToWorld(h.userData.chimney.clone()),3);return h;});
// village paths + lamps
for(const [x0,z0,x1,z1] of [[-44,1,-33,3],[-40,-7,-37,12],[-20,-6,-14,11],[-22,1,-14,3]]){const n=Math.ceil(Math.hypot(x1-x0,z1-z0)/1.6);
 for(let i=0;i<=n;i++){const x=x0+(x1-x0)*i/n,z=z0+(z1-z0)*i/n;const s=box(1.4,.12,1.4,std('#c9b48a'),0,0,0);s.position.copy(W(x,z,.04));s.rotation.y=Math.atan2(x1-x0,z1-z0);s.receiveShadow=true;lampG.add(s);if(i%4==2)lamp(W(x+1.1,z+.6));}}
for(let i=0;i<40;i++){const a=i*2.4,r=8+((i*37)%10)*1.6;const x=-29+Math.cos(a)*r*1.2,z=2+Math.sin(a)*r*.8;if(Math.abs(x+28)<3)continue;bush(x,z,.8+(i%3)*.3);}
for(let i=0;i<46;i++){const a=i*2.39,r=10+((i*53)%10)*2.2;const x=V.x+Math.cos(a)*r,z=V.y+Math.sin(a)*r;if(Math.hypot(x+28,z-2)<14)continue;rock(x,z,.7+(i%4)*.35);}
const keeper=placeW((()=>{const g=detailedHouse(3,3,2.6,MT.stone,MT.red,3,{garden:false});const f=new THREE.Group();flagOn(f,0,1.1);f.position.set(1.9,0,0);g.add(f);
 const k=pawnMini('#e85d2a',1);k.position.set(0,-.2,2.4);g.add(k);g.add(cyl(.05,.05,1.4,DARK,-.6,.5,2.3,5));return g;})(),-22,-11,6.8,0,4);
smokeSource(()=>keeper.localToWorld(keeper.userData.chimney.clone()),3);
// house on the crater rim with the owner's name (@marryeyebrow)
const rim=placeW((()=>{const g=detailedHouse(3.4,3,2.6,std('#3d3535'),std('#d9473b'),1,{garden:false});const s=sign('@marryeyebrow','#1d1d1d','#ffcc2e',3.2,.7);s.position.set(0,2.35,1.53);g.add(s);
 for(let k=0;k<5;k++)g.add(box(.14,.7,.14,std('#2a2424'),-1.6+k*.8,.35,2.6));return g;})(),-22,-19.6,11.6,Math.PI,3);
// weather & volcano watch station (@jairobojai @icedagger28)
const anemo=new THREE.Group();
const station=placeW((()=>{const g=new THREE.Group();g.add(box(4,3,3.4,MT.white,0,.3,0));for(const x of [-1,1])g.add(box(.8,.6,.06,GLASS,x,1.2,1.73));
 const dome=new THREE.Mesh(new THREE.SphereGeometry(1.5,16,12),MT.white);dome.position.set(0,3.2,0);g.add(dome);g.add(box(.5,.5,.5,std('#e8334f'),0,4.8,0));
 g.add(cyl(.08,.08,5,DARK,2.4,2.5,0,5));for(let k=0;k<3;k++){const c=new THREE.Mesh(new THREE.SphereGeometry(.25,6,5,0,Math.PI),std('#e8334f'));c.position.set(Math.cos(k*2.1)*.6,0,Math.sin(k*2.1)*.6);anemo.add(c);}anemo.position.set(2.4,5,0);g.add(anemo);
 const panel=box(2,.08,1.2,std('#20324f',{metalness:.5,roughness:.3}),-2.6,.8,0);panel.rotation.z=.5;g.add(panel);g.traverse(o=>{if(o.isMesh)o.castShadow=true;});return g;})(),-6,-14,16.6,0,4);
// paleontologist's dino house (@shanelolxd)
const dino=placeW((()=>{const g=detailedHouse(4,3.4,2.6,std('#d9c48a'),std('#6b8e23'),2,{garden:false});
 const bone=std('#f3ecd8');const sk=new THREE.Group();sk.add(box(5,.35,.35,bone,0,1.8,0));for(let k=0;k<6;k++)sk.add(box(.18,1.1,.18,bone,-2+k*.8,1.3,0));sk.add(box(1.1,.7,.6,bone,3,2.2,0));sk.add(box(.3,1.5,.3,bone,-1.6,.8,0));sk.add(box(.3,1.5,.3,bone,1.4,.8,0));
 sk.add(box(.5,.15,.9,bone,3.4,1.75,0));sk.position.set(0,0,4.6);g.add(sk);return g;})(),3,-19,17.4,Math.PI/2,5);
// ---------- railway with sleepers, a steam train and a road with cars (@luka.ostojic56 · @newhamm.william · roads @led77263 @karlthegreat45 @siarieslangto)
const RAIL=[[-24,31],[-25,24],[-26,18],[-27,10],[-28,2],[-29,-8]].map(([x,z])=>W(x,z,.35));
const railCurve=new THREE.CatmullRomCurve3(RAIL);
const railG=new THREE.Group();
for(const off of [-.55,.55]){const pts=[];for(let i=0;i<=200;i++){const p=railCurve.getPoint(i/200),tg=railCurve.getTangent(i/200);pts.push(p.clone().add(v3(-tg.z,0,tg.x).normalize().multiplyScalar(off)).add(v3(0,.12,0)));}
 railG.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),300,.09,5,false),std('#9aa0a6',{metalness:.6,roughness:.35})));}
const bal=std('#7a7066');for(let i=0;i<=170;i++){const p=railCurve.getPoint(i/170),tg=railCurve.getTangent(i/170);const s=box(1.9,.14,.32,MT.wood,0,0,0);s.position.copy(p);s.lookAt(p.clone().add(tg));railG.add(s);
 const b=box(2.6,.25,.6,bal,0,0,0);b.position.copy(p);b.position.y-=.18;b.lookAt(p.clone().add(tg));railG.add(b);}
railG.userData.t=21.2;railG.visible=false;scene.add(railG);city.push(railG);NEW.push(railG);
for(let i=0;i<=60;i++){const a=railCurve.getPoint(i/60);CROWD.forEach(p=>{if(Math.hypot(p.x-a.x,p.z-a.z)<6)p.hide=true;});}
const roadPts=[];for(let i=0;i<=120;i++){const p=railCurve.getPoint(i/120),tg=railCurve.getTangent(i/120);const q=p.clone().add(v3(-tg.z,0,tg.x).normalize().multiplyScalar(3.6));q.y=Math.max(H(q.x,q.z),SEA)+.14;roadPts.push(q);}
const roadCurve=new THREE.CatmullRomCurve3(roadPts);
const roadG=new THREE.Group();for(let i=0;i<=120;i++){const p=roadCurve.getPoint(i/120),tg=roadCurve.getTangent(i/120);const r=box(2.8,.22,1.9,std('#5a5f66'),0,0,0);r.position.copy(p);r.lookAt(p.clone().add(tg));roadG.add(r);
 if(i%3==0){const d=box(.16,.05,.9,MT.white,0,0,0);d.position.copy(p);d.position.y+=.13;d.lookAt(p.clone().add(tg));roadG.add(d);}
 if(i%10==5){const side=v3(-tg.z,0,tg.x).normalize().multiplyScalar(1.9);lamp(p.clone().add(side).setY(p.y-.1));}}
roadG.userData.t=21.6;roadG.visible=false;scene.add(roadG);city.push(roadG);NEW.push(roadG);
const cars=[['#e8334f',0],['#3e8fe6',.33],['#ffcc2e',.66]].map(([c,ph])=>{const g=new THREE.Group();g.add(box(1.3,.6,2.4,std(c),0,.45,0));g.add(box(1.1,.5,1.3,GLASS,0,.95,-.15));
 for(const x of [-.62,.62])for(const z of [-.75,.75]){const w=cyl(.24,.24,.2,DARK,x,.24,z,10);w.rotation.z=Math.PI/2;g.add(w);}g.traverse(o=>o.castShadow=true);g.userData.ph=ph;g.visible=false;scene.add(g);return g;});
function stationModel(name){const g=new THREE.Group();g.add(box(7,3.4,3,MT.wall,0,.4,0));for(let k=-2;k<=2;k++)g.add(box(.8,1,.06,GLASS,k*1.3,1.4,1.53));g.add(box(7.8,.4,4.2,std('#8a3a2a'),0,2.3,.5));
 for(const x of [-3.4,3.4])g.add(cyl(.1,.1,2,FRAME,x,1.1,2.4,6));g.add(box(8,.5,2.2,MT.stone,0,-.1,2.7));const s=sign(name,'#1d3f8a','#ffffff',5,.8);s.position.set(0,2.85,2.62);g.add(s);
 const clock=new THREE.Mesh(new THREE.CylinderGeometry(.4,.4,.08,16),FRAME);clock.rotation.x=Math.PI/2;clock.position.set(0,1.9,1.56);g.add(clock);g.traverse(o=>{if(o.isMesh)o.castShadow=true;});return g;}
const st1=railCurve.getPoint(0), st2=railCurve.getPoint(1);
const stationCity=placeW(stationModel('VARDIA'),st1.x+4,st1.z+1,21.8,0,6);
const stationVillage=placeW(stationModel('VOLCANO VILLAGE'),st2.x+4.5,st2.z+1,22.2,0,6);
const train=(()=>{const g=new THREE.Group();const loco=new THREE.Group();const red=std('#b8302a'),blk=std('#2b2b2b'),gold=std('#d9b44a',{metalness:.5,roughness:.4});
 loco.add(cyl(.75,.75,3,blk,0,1.3,.6,14).rotateX(Math.PI/2));loco.add(box(1.7,1.9,1.5,red,0,1.4,-1.2));loco.add(box(1.9,.2,1.8,blk,0,2.45,-1.2));loco.add(cyl(.25,.32,.9,blk,0,2.3,1.6,10));
 loco.add(box(1.8,.35,4.2,blk,0,.45,0));loco.add(box(.06,.5,.6,GLASS,.86,1.7,-1.2));loco.add(box(.06,.5,.6,GLASS,-.86,1.7,-1.2));loco.add(cyl(.2,.2,.15,gold,0,1.3,2.15,12).rotateX(Math.PI/2));
 for(const x of [-.9,.9])for(const z of [-1.4,0,1.4]){const w=cyl(.38,.38,.15,red,x,.42,z,12);w.rotation.z=Math.PI/2;loco.add(w);}
 const carsT=[loco];for(let k=0;k<2;k++){const c=new THREE.Group();c.add(box(1.7,1.6,3.6,std(k?'#2f7de1':'#2e7d4f'),0,1.15,0));c.add(box(1.8,.18,3.7,blk,0,2.02,0));c.add(box(1.75,.3,3.65,blk,0,.42,0));
  for(let w=0;w<3;w++){c.add(box(1.74,.55,.7,GLASS,0,1.35,-1.1+w*1.1));}for(const x of [-.85,.85])for(const z of [-1.2,1.2]){const wh=cyl(.3,.3,.14,blk,x,.32,z,10);wh.rotation.z=Math.PI/2;c.add(wh);}carsT.push(c);}
 carsT.forEach(c=>{c.traverse(o=>o.castShadow=true);g.add(c);});g.userData.cars=carsT;g.visible=false;scene.add(g);return g;})();
smokeSource(()=>train.userData.cars[0].localToWorld(v3(0,2.9,1.6)),6,'#eeeeee');
// ---------- volcano military base (@notthomash) + national park (@nottrr2324) on the west slope
const base=placeW((()=>{const g=new THREE.Group();const ol=std('#6b7d3a');g.add(box(10,.4,10,MT.stone,0,-.2,0));g.add(box(5,2.6,3.6,ol,-1.5,1,-2));
 const r=new THREE.Mesh(new THREE.CylinderGeometry(1.8,1.8,5,12,1,false,0,Math.PI),ol);r.rotation.z=Math.PI/2;r.position.set(-1.5,2.3,-2);g.add(r);
 const tank=new THREE.Group();tank.add(box(2,.8,3,ol,0,.5,0));tank.add(box(1.3,.6,1.4,ol,0,1.2,-.2));const gun=cyl(.12,.12,2,DARK,0,1.25,1.2,6);gun.rotation.x=Math.PI/2;tank.add(gun);tank.position.set(2.6,0,1.6);g.add(tank);
 const pad=new THREE.Mesh(new THREE.CylinderGeometry(1.6,1.6,.1,16),std('#3a3a3a'));pad.position.set(-2.4,.05,2.8);g.add(pad);
 for(let k=-4;k<=4;k++){g.add(box(.1,1.2,.1,DARK,k*1.2,.6,4.9));g.add(box(.1,1.2,.1,DARK,k*1.2,.6,-4.9));}g.add(box(10,.06,.06,DARK,0,1.1,4.9));g.add(box(10,.06,.06,DARK,0,1.1,-4.9));
 const tw=new THREE.Group();tw.add(box(.2,4,.2,MT.wood,-.6,2,-.6));tw.add(box(.2,4,.2,MT.wood,.6,2,-.6));tw.add(box(.2,4,.2,MT.wood,-.6,2,.6));tw.add(box(.2,4,.2,MT.wood,.6,2,.6));tw.add(box(1.8,.9,1.8,MT.wood,0,4.3,0));tw.position.set(4,0,-3.6);g.add(tw);
 for(let k=0;k<4;k++){const s=pawnMini('#3f5a2a',.7);s.position.set(1+k*.8,0,-.2);g.add(s);}return g;})(),-50,-15,27.6,0,7);
const park=placeW((()=>{const g=new THREE.Group();for(let i=0;i<16;i++){const a=i/16*Math.PI*2;g.add(box(.16,.9,.16,MT.wood,Math.cos(a)*9,.3,Math.sin(a)*9));}
 for(let i=0;i<12;i++){const a=i*2.4,r=2+((i*37)%10)/10*6;const t=new THREE.Mesh(pineG,std(i%2?'#2f7a3a':'#3f8a3a',{flatShading:true}));t.position.set(Math.cos(a)*r,-.4,Math.sin(a)*r);t.scale.setScalar(.7+(i%3)*.15);g.add(t);}
 const pond=new THREE.Mesh(new THREE.CylinderGeometry(2.2,2.2,.15,20),std('#4fb7ef',{roughness:.2}));pond.position.set(-3,.05,3);g.add(pond);
 const s=sign('NATIONAL PARK','#2e6b3f','#ffffff',4.4,.9);s.position.set(0,1.6,9.3);g.add(s);g.add(box(.15,1.6,.15,MT.wood,-2,.4,9.3));g.add(box(.15,1.6,.15,MT.wood,2,.4,9.3));
 const deer=[];for(let k=0;k<2;k++){const d=new THREE.Group();const dm=std('#a0703a');const b=new THREE.Mesh(new THREE.CapsuleGeometry(.3,.8,4,8),dm);b.rotation.z=Math.PI/2;b.position.y=.9;d.add(b);const h=new THREE.Mesh(new THREE.SphereGeometry(.25,8,6),dm);h.position.set(.6,1.3,0);d.add(h);
  for(const [x,z] of [[-.3,-.15],[-.3,.15],[.3,-.15],[.3,.15]])d.add(box(.1,.7,.1,dm,x,.35,z));d.add(box(.05,.4,.05,std('#6b4a2b'),.6,1.65,.1));d.add(box(.05,.4,.05,std('#6b4a2b'),.6,1.65,-.1));d.position.set(2-k*3,0,-2+k*4);g.add(d);deer.push(d);}
 g.userData.deer=deer;return g;})(),-58,-4,28.4,0,10);
// ---------- dam on the river (@zen_plank08) + the river gets a name (@plen_n_nado)
const dam=placeW((()=>{const g=new THREE.Group();g.add(box(11,5,2,MT.stone,0,-.5,0));g.add(box(11.4,.5,2.4,std('#a8a092'),0,2.1,0));for(let k=-5;k<=5;k++)g.add(box(.12,.6,.12,DARK,k,2.6,1));
 for(let k=-1;k<=1;k++){const w=new THREE.Mesh(new THREE.BoxGeometry(1.2,3,.2),std('#8fd3ff',{transparent:true,opacity:.85}));w.position.set(k*3,.5,1.15);g.add(w);}
 const ph=new THREE.Group();ph.add(box(3,2.4,2.4,MT.wall3,0,.6,0));ph.add(box(3.2,.3,2.6,DARK,0,1.9,0));ph.add(box(.8,.5,.06,GLASS,0,1.1,1.23));ph.position.set(7,0,1);g.add(ph);
 for(let k=0;k<4;k++){const py=new THREE.Group();py.add(box(.2,6,.2,DARK,0,3,0));py.add(box(1.8,.12,.12,DARK,0,5.6,0));py.position.set(9+k*5,0,4+k*2);g.add(py);}return g;})(),10,11,33.0,-.55,6);
const riverSign=(()=>{const s=sign('THEIBURG RIVER','#2f7de1','#ffffff',8,1.3);const p=W(15,24,4.5);s.position.copy(p);s.lookAt(p.x+10,p.y,p.z+10);s.visible=false;scene.add(s);return s;})();
// ---------- NEW EAST DISTRICT across the river: industry + workers' homes (@tiv_2220 @nellokumag @graysprunki123 @failure5960)
const ED=[37,24];
const sawmill=placeW((()=>{const g=new THREE.Group();g.add(box(6,3,4,std('#9c6b3c'),0,.3,0));g.add(roof4(6.4,1.4,MT.dark,2.5));g.add(box(1.6,1.8,.08,MT.wood,-1.5,.6,2.03));
 for(let k=0;k<9;k++){const l=cyl(.32,.32,4,std(k%2?'#8a5a33':'#7a4a26'),0,.35+Math.floor(k/3)*.62,3.6,8);l.rotation.z=Math.PI/2;l.position.x=-.6+(k%3)*.62;l.position.z=3.4+Math.floor(k/3)*.0;g.add(l);}
 const blade=new THREE.Mesh(new THREE.CylinderGeometry(.9,.9,.1,16),std('#c0c0c0',{metalness:.6}));blade.rotation.x=Math.PI/2;blade.position.set(3.3,1,0);g.add(blade);g.userData.blade=blade;
 const lj=pawnMini('#c0392b',.8);lj.position.set(2,0,3);g.add(lj);g.add(box(.08,.8,.08,MT.wood,2.4,.8,3));return g;})(),ED[0]-8,ED[1]-9,38.6,0,6);
const factory=placeW((()=>{const g=new THREE.Group();g.add(box(10,4.6,6.4,std('#b6b8bc'),0,.6,0));for(let k=0;k<4;k++){const r=new THREE.Mesh(new THREE.CylinderGeometry(1.25,1.25,6.4,3,1,false,0,Math.PI),std('#8c939b'));r.rotation.x=Math.PI/2;r.rotation.y=Math.PI/2;r.position.set(-3.75+k*2.5,3,0);g.add(r);}
 for(let k=0;k<4;k++)g.add(box(1.4,.7,.06,GLASS,-3.6+k*2.4,2.2,3.22));g.add(box(2.6,2.6,.08,std('#d9d9d9'),2.8,.5,3.22));
 g.add(cyl(.6,.8,8,std('#a0522d'),4.2,4.4,-2.2,10));g.add(cyl(.62,.62,.5,MT.white,4.2,6.6,-2.2,10));const s=sign('TRUCKS','#2b2b2b','#ffcc2e',3.4,.8);s.position.set(-1.6,3.95,3.23);g.add(s);
 const truck=new THREE.Group();truck.add(box(1.6,1.4,1.6,std('#e8334f'),0,.9,1.8));truck.add(box(1.7,1.7,3,MT.white,0,1.05,-.6));truck.add(box(1.4,.5,.06,GLASS,0,1.3,2.62));
 for(const x of [-.82,.82])for(const z of [1.6,-1.4]){const w=cyl(.32,.32,.18,DARK,x,.32,z,10);w.rotation.z=Math.PI/2;truck.add(w);}truck.position.set(-3,0,5.4);g.add(truck);g.userData.truck=truck;
 for(let k=0;k<3;k++){const w=pawnMini(['#f2a33a','#ffcc2e','#ff8a4c'][k],.75);w.position.set(1+k*1.1,0,4.6);g.add(w);}g.traverse(o=>{if(o.isMesh)o.castShadow=true;});return g;})(),ED[0]+2,ED[1]+2,39.4,0,8);
smokeSource(()=>factory.localToWorld(v3(4.2,8.8,-2.2)),6,'#bdbdbd');
// workers' homes + a little square
const EH=[[ED[0]-6,ED[1]+10],[ED[0]-1,ED[1]+13],[ED[0]+5,ED[1]+12],[ED[0]+10,ED[1]+8],[ED[0]+11,ED[1]-3],[ED[0]+7,ED[1]-9]];
EH.forEach(([x,z],i)=>{const g=detailedHouse(3,2.8,2.4,WALLS[(i+2)%5],ROOFS[(i+1)%5],i+5);const h=placeW(g,x,z,40.2+i*.15,(i*.6)%2,4);smokeSource(()=>h.localToWorld(h.userData.chimney.clone()),2);});
const ringRoad=[];for(let i=0;i<=48;i++){const a=i/48*Math.PI*2;ringRoad.push(W(ED[0]+Math.cos(a)*14,ED[1]+Math.sin(a)*12,.16));}
{const rc=new THREE.CatmullRomCurve3(ringRoad,true);for(let i=0;i<72;i++){const p=rc.getPoint(i/72),tg=rc.getTangent(i/72);const r=box(2.8,.22,1.8,std('#5a5f66'),0,0,0);r.position.copy(p);r.lookAt(p.clone().add(tg));r.receiveShadow=true;lampG.add(r);
 if(i%3==0){const d=box(.14,.05,.8,MT.white,0,0,0);d.position.copy(p);d.position.y+=.12;d.lookAt(p.clone().add(tg));lampG.add(d);} if(i%9==4){const side=v3(-tg.z,0,tg.x).normalize().multiplyScalar(1.9);lamp(p.clone().add(side).setY(p.y-.12));}}}
for(let i=0;i<24;i++){const a=i*2.5,r=15+((i*37)%10)*.6;bush(ED[0]+Math.cos(a)*r,ED[1]+Math.sin(a)*r*.9,.8+(i%3)*.25);}
lampG.visible=bushG.visible=rockG.visible=true;scene.add(lampG,bushG,rockG);
// birds circling over the island
const birds=[];for(let i=0;i<9;i++){const b=new THREE.Group();const m=std('#2b2b2b');const wl=box(.9,.05,.25,m,-.42,0,0);wl.rotation.z=.35;const wr=box(.9,.05,.25,m,.42,0,0);wr.rotation.z=-.35;b.add(wl,wr);b.userData={i,wl,wr};scene.add(b);birds.push(b);}

ANIM.push(t=>{
 anemo.rotation.y=t*6;
 const tk=PRIOR()?1:clamp((t-22.4)/4.2);train.visible=PRIOR()||t>=22.0;
 if(train.visible) train.userData.cars.forEach((c,k)=>{const s=Math.max(0,Math.min(1,.18+ease(tk)*.8-k*.035));const p=railCurve.getPoint(s),q=railCurve.getPoint(Math.min(1,s+.01));c.position.copy(p);c.lookAt(q.x,q.y,q.z);});
 cars.forEach(c=>{c.visible=roadG.visible;if(!c.visible)return;const s=((t*.035+c.userData.ph)%1);const p=roadCurve.getPoint(s),q=roadCurve.getPoint(Math.min(.999,s+.01));c.position.copy(p);c.lookAt(q.x,q.y,q.z);});
 park.userData.deer.forEach((d,k)=>{d.position.x=2-k*3+Math.sin(t*.6+k)*1.5;d.rotation.y=Math.cos(t*.6+k)>0?0:Math.PI;});
 riverSign.visible=PRIOR()||t>=33.6;
 sawmill.userData.blade.rotation.y=t*12;
 const tr=factory.userData.truck;tr.position.x=-3+Math.sin(t*.7)*2;
 smokePuffs.forEach(b=>{const {fnPos,i,n}=b.userData;let src;try{src=fnPos();}catch(e){return;}const ph=((t*.3+i/n)%1);b.visible=true;
   b.position.set(src.x+ph*1.6,src.y+ph*4,src.z+ph*.8);b.scale.setScalar(.5+ph*1.6);b.material.opacity=.65*(1-ph);});
 birds.forEach(b=>{const {i,wl,wr}=b.userData;const a=t*.25+i*.7;const R=40+(i%3)*14;b.position.set(-10+Math.cos(a)*R,48+(i%4)*5+Math.sin(t+i)*1.5,-5+Math.sin(a)*R*.8);b.rotation.y=-a;const f=Math.sin(t*10+i)*.5;wl.rotation.z=.35+f;wr.rotation.z=-.35-f;});
});

const SEGS=[
 {t0:0,t1:4,p:[v3(40,150,120),v3(30,140,110)],l:[W(-14,4,0),W(-14,4,0)],f:48,
  caps:[['c1',.2,4,'You asked...<br><b>we built it</b>'],['c2',1.0,4,'Part <b>4</b> of 4<span class="sub">volcano village, rail & a new district</span>']]},
 {t0:4,t1:11,p:[W(4,16,34),W(2,13,32)],l:[W(-30,2,2),W(-30,0,2)],f:60,
  caps:[['c1',4.2,11,'A <b>volcano village</b> 🌋<br>for the brave ones']],
  tags:[['🏘️ VOLCANO HOUSES','@abu_alfuariq · @bastiboy33 · @melzenjorel',()=>W(-38,4,6),5.4,11],['🌋 VOLCANO KEEPER','@metallicmax2_reborn',()=>W(-22,-11,6),7.2,11]]},
 {t0:11,t1:16,p:[W(-10,2,64),W(-12,-1,62)],l:[W(-22,-19,1),W(-22,-19,1)],f:50,
  caps:[['c1',11.2,16,'A house <b>on the crater</b>...<br>with your name on it 😳']],
  tags:[['🏠 CRATER HOUSE','@marryeyebrow',()=>W(-22,-19.6,6),12.0,16]]},
 {t0:16,t1:21,p:[W(30,-4,30),W(28,-6,28)],l:[W(-1,-16,8),W(-1,-16,8)],f:55,
  caps:[['c1',16.2,21,'A <b>volcano watch</b> station<br>& a <b>dino house</b> 🦖']],
  tags:[['🌦️ WEATHER & VOLCANO WATCH','@jairobojai · @icedagger28',()=>W(-6,-14,8),17.0,21],['🦖 PALEONTOLOGIST','@shanelolxd',()=>W(3,-19,6),18.0,21]]},
 {t0:21,t1:27,p:[W(0,24,30),W(-2,20,28)],l:[W(-26,14,4),W(-27,4,6)],f:58,
  caps:[['c1',21.2,27,'A <b>steam train</b> 🚂<br>from Vardia to the village']],
  tags:[['🚂 RAILWAY','@luka.ostojic56',()=>train.userData.cars[0].position.clone().add(v3(0,4,0)),22.6,27],['🧑‍✈️ STATION MASTER','@newhamm.william',()=>W(st2.x+4.5,st2.z+1,6),23.6,27],['🛣️ ROADS','@led77263 · @karlthegreat45 · @siarieslangto',()=>W(-20,26,3),24.6,27]]},
 {t0:27,t1:32,p:[W(-86,-28,30),W(-84,-25,28)],l:[W(-54,-9,5),W(-54,-9,5)],f:58,
  caps:[['c1',27.2,32,'A <b>military base</b> 🪖<br>& a <b>national park</b> 🦌']],
  tags:[['🪖 VOLCANO BASE','@notthomash',()=>W(-50,-15,6),28.0,32],['🦌 NATIONAL PARK','@nottrr2324',()=>W(-58,-4,5),29.0,32]]},
 {t0:32,t1:38,p:[W(-4,36,38),W(-2,32,36)],l:[W(11,13,2),W(11,13,2)],f:58,
  caps:[['c1',32.2,35,'The river got a name...<br><b>Theiburg River</b> 🌊'],['c1',35.2,38,'Nuclear plant next to a volcano?<br>😅 we built a <b>dam</b> instead']],
  tags:[['🌊 RIVER NAME','@plen_n_nado',()=>W(15,24,7.4),33.6,38],['⚡ DAM','@zen_plank08 · @bratina1534',()=>W(10,11,5),35.4,38]]},
 {t0:38,t1:45,p:[W(66,-10,58),W(62,-8,55)],l:[W(ED[0],ED[1],2),W(ED[0],ED[1],2)],f:58,
  caps:[['c1',38.2,41.6,'The city got too full...<br>so: a <b>new district</b>! 🏗️'],['c1',41.8,45,'Sawmill, <b>truck factory</b><br>& homes for the workers']],
  tags:[['🪓 LUMBERJACK','@tiv_2220',()=>W(ED[0]-8,ED[1]-9,6),39.0,45],['🚚 TRUCK FACTORY','@nellokumag',()=>W(ED[0]+2,ED[1]+2,9.5),39.8,45],['👷 WORKERS','@graysprunki123 · @failure5960',()=>W(ED[0]+2,ED[1]+7,3),40.6,45]]},
 {t0:45,t1:53,p:[W(-10,150,190),W(-10,190,230)],l:[W(-14,0,10),W(-14,0,12)],f:46,
  caps:[['c1',45.2,53,'4 parts. <b>60+ requests</b>.<br>All built. 🏝️'],['c2',47.0,53,'<b>Name the new district</b> 👇<span class="sub">+ Day 4 vote: <b>Vellera</b> or <b>San Vista</b>?</span>']]},
];
