// ===== DAY 6: the military base wins + your requests =====
// (built after the Day 5 world: make_day6.py prepends the Day 5 builds with all their pop times set to "already there")
NEW.forEach(g=>g.userData.t=-1);
heroSign.visible=true; eliasArch.visible=true;
const POP=[];   // Day 6 builds, popped in on screen
function at(g,u,v,t,rot=0,y0=0){place(g,u,v,t,rot,y0);POP.push(g);return g;}
// remove forest where the new builds go
function clearTrees(rects){scene.traverse(o=>{if(!o.isInstancedMesh||![pineG,roundG,trunkG].includes(o.geometry))return;const m=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),s=new THREE.Vector3();let ch=false;
 for(let i=0;i<o.count;i++){o.getMatrixAt(i,m);m.decompose(p,q,s);const [u,v]=cityUV(p.x,p.z);if(rects.some(([u0,u1,v0,v1])=>u>u0&&u<u1&&v>v0&&v<v1)){s.setScalar(0);m.compose(p,q,s);o.setMatrixAt(i,m);ch=true;}}if(ch)o.instanceMatrix.needsUpdate=true;});}
const pad=(u,v,w,d)=>{let top=-99;for(let a=-1;a<=1;a+=.5)for(let b=-1;b<=1;b+=.5){const p=LW(u+a*w/2,v+b*d/2);top=Math.max(top,H(p.x,p.y));}return top;};
function slab(w,d,c,u,v){const g=new THREE.Group();const top=pad(u,v,w,d)+.3;const base=L(u,v).y;g.add(box(w,16,d,std(c),0,top-base-8,0));g.userData.top=top-base;return g;}
const OLIVE=std('#6b7a3a'),OLIVE2=std('#55622d'),SAND=std('#e9d39a');
const soldier=(c='#6b7a3a',s=.85)=>pawn(c,s);

// ---------- 🪖 MILITARY BASE (vote winner, @mongolianstarlight: big base, 6 tents, the General)
const BU=-114,BV=80;clearTrees([[BU-26,BU+26,BV-22,BV+22]]);
const base=at((()=>{const g=slab(44,36,'#a99c6a',BU,BV);const y=g.userData.top;
 for(let i=0;i<22;i++){g.add(box(2,1.4,.12,MT.dark,-21+i*2,y+.7,-18));g.add(box(2,1.4,.12,MT.dark,-21+i*2,y+.7,18));}for(let i=0;i<18;i++){g.add(box(.12,1.4,2,MT.dark,-22,y+.7,-17+i*2));if(i<7||i>10)g.add(box(.12,1.4,2,MT.dark,22,y+.7,-17+i*2));}
 const gate=new THREE.Group();gate.add(box(.6,5,.6,OLIVE2,0,2.5,-4));gate.add(box(.6,5,.6,OLIVE2,0,2.5,4));const gs=sign('HERBERG MILITARY BASE','#ffffff','#55622d',8,1.1);gs.rotation.y=Math.PI/2;gs.position.set(.35,5,0);gate.add(gs);gate.position.set(22,y,0);g.add(gate);
 for(let i=0;i<6;i++){const t=new THREE.Mesh(new THREE.CylinderGeometry(0,2.6,2.8,4,1),OLIVE);t.rotation.y=Math.PI/4;t.scale.set(1,1,1.7);t.position.set(-14+(i%3)*7,y+1.4,(i<3?-9:-3));t.castShadow=true;g.add(t);}
 g.add(box(12,4,6,std('#7d8a4a'),-10,y+2,9));g.add(box(12.4,.4,6.4,OLIVE2,-10,y+4.2,9));const hs=sign('HQ','#ffffff','#55622d',2,.8);hs.position.set(-10,y+3,5.95);hs.rotation.y=Math.PI;g.add(hs);
 const tw=new THREE.Group();for(const a of [-1,1])for(const b of [-1,1])tw.add(box(.25,8,.25,MT.wood,a*1.2,4,b*1.2));tw.add(box(3.4,.3,3.4,MT.wood,0,8,0));tw.add(roof4(3.8,1.2,OLIVE2,9.4));tw.position.set(-19,y,-15);g.add(tw);
 const hp=cyl(3.4,3.4,.12,std('#3a3a3a'),10,y+.1,-9,28);g.add(hp);const hh=sign('H','#3a3a3a','#ffffff',2.2,2.2);hh.rotation.x=-Math.PI/2;hh.position.set(10,y+.2,-9);g.add(hh);
 const heli2=new THREE.Group();const body=new THREE.Mesh(new THREE.CapsuleGeometry(.9,1.8,6,10),OLIVE);body.rotation.x=Math.PI/2;body.position.y=1.2;heli2.add(body);heli2.add(box(.35,.35,3.8,OLIVE,0,1.4,-2.8));heli2.add(box(7,.06,.3,MT.dark,0,2.5,0));heli2.add(box(.3,.06,7,MT.dark,0,2.5,0));heli2.position.set(10,y+.2,-9);g.add(heli2);g.userData.rotor=heli2;
 for(const [x,z] of [[2,8],[8,8]]){const tk=new THREE.Group();tk.add(box(3,1.1,4.6,OLIVE,0,.8,0));tk.add(box(3.3,.6,4.8,MT.dark,0,.35,0));tk.add(box(2,.9,2.2,OLIVE2,0,1.8,-.2));const gun=cyl(.16,.16,3.4,OLIVE2,0,1.9,1.8,8);gun.rotation.x=Math.PI/2;tk.add(gun);tk.position.set(x,y,z);g.add(tk);}
 flagPole(g,16,y,10,1.4);
 for(let i=0;i<12;i++){const s=soldier();s.position.set(4+(i%6)*1.6,y,-1+Math.floor(i/6)*1.8);g.add(s);}
 const gen=pawn('#55622d',1.3);const cap=box(.9,.25,.9,std('#f2c230'),0,2.35,0);gen.add(cap);gen.position.set(9,y,-4.4);g.add(gen);g.userData.gen=gen;
 g.traverse(o=>o.castShadow=true);return g;})(),BU,BV,10.6);

// ---------- 🏜️ DESERT ISLAND + Arabian tent + camel farm (@hamd2011_2012)
const DU=104,DV=-46;
const desert=isle(DU,DV,18,4.4);desert.children.slice().forEach(o=>{if(o.geometry===roundG)desert.remove(o);});
{const m=desert.children[0];const col=m.geometry.attributes.color,pa=m.geometry.attributes.position;const c=new THREE.Color();for(let i=0;i<col.count;i++){const y=pa.getY(i);c.set(y<-1?'#7fd6d0':y<1?'#efdfa8':'#e3c27a');col.setXYZ(i,c.r,c.g,c.b);}col.needsUpdate=true;}
desert.userData.t=17.4;desert.visible=false;POP.push(desert);
{const g=new THREE.Group();const y0=desert.userData.top;const dy=r=>y0*(1-Math.pow(Math.min(r/18,1.2),2.2));
 const tent=new THREE.Group();const tm=new THREE.Mesh(new THREE.CylinderGeometry(0,5,3.4,6),std('#f3ead8'));tm.position.y=1.7;tent.add(tm);const st=new THREE.Mesh(new THREE.CylinderGeometry(5.02,5.02,.5,6,1,true),std('#c0392b',{side:THREE.DoubleSide}));st.position.y=.3;tent.add(st);
 tent.add(box(2,.05,3,std('#b5651d'),0,.05,5));tent.position.set(-3,dy(3),-2);g.add(tent);const ts=sign('HAMD\'S TENT','#7a4a1e','#f3ead8',3,.6);ts.position.set(-3,dy(3)+1.2,3.2);g.add(ts);
 for(let i=0;i<10;i++){const a=i/10*Math.PI*2;g.add(box(.12,1,.12,MT.wood,6+Math.cos(a)*5,dy(9)+.5,3+Math.sin(a)*5));}
 const cs=sign('CAMEL FARM','#ffffff','#b5651d',3,.6);cs.position.set(6,dy(9)+1.6,8.2);g.add(cs);
 const camels=[];for(let i=0;i<4;i++){const c=new THREE.Group();const cm=std('#c99a5b');c.add(box(.9,.9,2,cm,0,1.6,0));const hu=new THREE.Mesh(new THREE.SphereGeometry(.55,10,8),cm);hu.position.set(0,2.2,0);c.add(hu);
  c.add(box(.35,1.4,.35,cm,0,2.4,1.1));c.add(box(.4,.4,.8,cm,0,3.1,1.4));for(const x of [-.3,.3])for(const z of [-.7,.7])c.add(box(.18,1.2,.18,cm,x,.6,z));c.position.set(6+Math.cos(i*1.6)*2.6,dy(9),3+Math.sin(i*1.6)*2.4);c.rotation.y=i*1.3;g.add(c);camels.push(c);}
 for(let i=0;i<5;i++){const a=i*1.25+2.4,r=12;const p=new THREE.Group();const tr=cyl(.22,.3,4.5,MT.wood,0,2.25,0,6);tr.rotation.z=.15;p.add(tr);for(let k=0;k<5;k++){const lf=new THREE.Mesh(new THREE.ConeGeometry(.55,3,4),std('#3fa34d',{flatShading:true}));lf.position.set(Math.cos(k*1.26)*1.2+.3,4.5,Math.sin(k*1.26)*1.2);lf.rotation.set(Math.sin(k*1.26)*1.2,0,-Math.cos(k*1.26)*1.2);p.add(lf);}p.position.set(Math.sin(a)*r,dy(r),Math.cos(a)*r);g.add(p);}
 const hm=pawn('#f3ead8',.9);hm.position.set(-3,dy(3),4.2);g.add(hm);g.userData.hamd=hm;
 g.traverse(o=>o.castShadow=true);desert.add(g);desert.userData.camels=camels;desert.userData.hamd=hm;}

// ---------- 🧪 chemistry lab + the scientist (@punzisttv)
const lab=at((()=>{const g=new THREE.Group();g.add(box(10,5,7,MT.white,0,2.5,0));g.add(box(10.2,.6,7.2,std('#2f7de1'),0,4.2,0));g.add(box(10.4,.4,7.4,MT.white,0,5.2,0));
 for(let k=0;k<4;k++)g.add(box(1.4,1,.06,MT.glass,-3.6+k*2.4,2.6,3.53));const s=sign('CHEMISTRY LAB','#ffffff','#2f7de1',5,.8);s.position.set(0,4.2,3.62);g.add(s);
 for(const x of [-3,3])g.add(cyl(.35,.35,2,MT.dark,x,6.4,-1.5,8));
 const fl=new THREE.Group();const fm=new THREE.Mesh(new THREE.SphereGeometry(1.3,14,10),std('#5fe08a',{transparent:true,opacity:.85,emissive:'#2fbf5a',emissiveIntensity:.4}));fl.add(fm);const nk=cyl(.35,.45,1.4,std('#cfeefa',{transparent:true,opacity:.7}),0,1.5,0,10);fl.add(nk);fl.position.set(0,6.9,1);g.add(fl);
 const sci=pawn('#ffffff',.9);sci.add(box(.5,.5,.06,std('#2f7de1'),0,1.2,.33));sci.position.set(2.5,0,5);g.add(sci);g.userData.sci=sci;
 const bub=[];for(let i=0;i<6;i++){const b=new THREE.Mesh(new THREE.SphereGeometry(.22,8,6),std('#7dffa8',{transparent:true,opacity:.8}));g.add(b);bub.push(b);}g.userData.bub=bub;
 g.traverse(o=>o.castShadow=true);return g;})(),84,22,21.6);

// ---------- 🏰 big old castle on the hill (@egyptianmapper16)
clearTrees([[60,98,96,130]]);
const castle=at((()=>{const g=slab(26,26,'#9c937e',78,112);const y=g.userData.top;const st=std('#b8ad94'),st2=std('#a39880');
 for(const [x,z,w,d] of [[0,-11,22,2],[0,11,22,2],[-11,0,2,22],[11,0,2,22]]){g.add(box(w,6,d,st,x,y+3,z));for(let k=-5;k<=5;k+=2){const cx=w>2?k*2:x,cz=w>2?z:k*2;g.add(box(1,1,1,st,cx+(w>2?0:0),y+6.5,cz));}}
 for(const [x,z] of [[-11,-11],[11,-11],[-11,11],[11,11]]){g.add(cyl(2.4,2.6,10,st2,x,y+5,z,12));const r=new THREE.Mesh(new THREE.ConeGeometry(2.9,3.6,12),std('#8a3a2e'));r.position.set(x,y+11.8,z);g.add(r);}
 g.add(box(9,12,9,st2,0,y+6,0));for(const [x,z] of [[-4,-4],[4,-4],[-4,4],[4,4]])g.add(box(1.2,1.2,1.2,st2,x,y+12.6,z));g.add(box(3,4,.4,MT.wood,0,y+2,11.2));
 flagPole(g,0,y+12,0,1.4);g.traverse(o=>o.castShadow=true);return g;})(),78,112,25.4);

// ---------- 🌊 ocean skyscraper, "900 m tall, 200,000 people" (@ilikesouthparkandetc)
const ocean=at((()=>{const g=new THREE.Group();g.add(cyl(11,12,4,MT.stone,0,SEA-1.4,0,28));g.add(cyl(11.2,11.2,.4,MT.white,0,SEA+.7,0,28));
 const gl=std('#6fb7e6',{roughness:.15,metalness:.35});let y=SEA+.9;[[9,40],[7.5,36],[6,32],[4.5,26]].forEach(([w,h])=>{g.add(box(w,h,w,gl,0,y+h/2,0));for(let k=4;k<h;k+=4)g.add(box(w+.1,.3,w+.1,MT.white,0,y+k,0));y+=h;});
 g.add(cyl(.2,.2,14,MT.dark,0,y+7,0,6));const s=sign('OCEAN TOWER · 900 m','#ffffff','#1d3f8a',7,1.2);s.position.set(0,SEA+5,4.6);g.add(s);
 g.traverse(o=>o.castShadow=true);g.userData.topY=y+14;return g;})(),0,-50,29.4,0,0);
ocean.position.y=0; // sits on the sea, not the terrain

// ---------- ✈️ MATEL Air (@mat3lx2_spots) + Antarctic Airlines HQ (@official_d4sh)
function plane(body,tail,name){const g=new THREE.Group();const b=new THREE.Mesh(new THREE.CapsuleGeometry(1.2,10,6,12),std(body));b.rotation.x=Math.PI/2;b.position.y=1.9;g.add(b);
 g.add(box(13,.25,2.6,std(body),0,1.6,.4));g.add(box(4.6,.2,1.4,std(body),0,2.2,-5.4));g.add(box(.25,3,1.8,std(tail),0,3.6,-5.6));for(const x of [-3.4,3.4]){const e=cyl(.5,.5,1.6,MT.dark,x,1.1,1.2,10);e.rotation.x=Math.PI/2;g.add(e);}
 g.add(box(2.6,.12,.12,MT.glass,0,2.6,5.5));const s=sign(name,tail,'#ffffff',3.6,.7);s.position.set(1.23,2.2,0);s.rotation.y=Math.PI/2;g.add(s);const s2=s.clone();s2.position.x=-1.23;s2.rotation.y=-Math.PI/2;g.add(s2);
 for(const z of [-.5,3.8])g.add(cyl(.12,.12,.9,MT.dark,0,.45,z,6));g.traverse(o=>o.castShadow=true);return g;}
const matel=(()=>{const g=plane('#ffffff','#e8334f','MATEL AIR');const p=L(-16,RV);g.position.set(p.x,AY+.2,p.z);g.rotation.y=ALONG_ANG;g.userData.t=33.4;g.visible=false;scene.add(g);POP.push(g);return g;})();
const antarctic=(()=>{const g=plane('#eaf6ff','#2f8fe0','ANTARCTIC');const p=L(16,RV);g.position.set(p.x,AY+.2,p.z);g.rotation.y=ALONG_ANG+Math.PI;g.userData.t=34.0;g.visible=false;scene.add(g);POP.push(g);return g;})();
clearTrees([[-34,-14,104,118]]);
const hq=at((()=>{const g=new THREE.Group();const ice=std('#dff2fb');g.add(box(10,7,7,ice,0,3.5,0));g.add(box(10.3,1,7.3,std('#2f8fe0'),0,6.2,0));for(let f=0;f<2;f++)for(let k=0;k<4;k++)g.add(box(1.4,1,.06,MT.glass,-3.6+k*2.4,1.8+f*2.4,3.53));
 const s=sign('ANTARCTIC AIRLINES HQ','#2f8fe0','#ffffff',7,.9);s.position.set(0,6.2,3.68);g.add(s);
 const pg=new THREE.Group();const pb=new THREE.Mesh(new THREE.CapsuleGeometry(.7,1,6,10),std('#1d232b'));pb.position.y=1.2;pg.add(pb);const belly=new THREE.Mesh(new THREE.SphereGeometry(.55,10,8),MT.white);belly.position.set(0,1.1,.35);pg.add(belly);const bk=new THREE.Mesh(new THREE.ConeGeometry(.18,.5,8),std('#f2a33a'));bk.rotation.x=Math.PI/2;bk.position.set(0,1.9,.75);pg.add(bk);pg.position.set(4,7,1.6);pg.scale.setScalar(1.4);g.add(pg);
 g.traverse(o=>o.castShadow=true);return g;})(),-24,112,34.6);

// ---------- 🏀 basketball court (@raphaelryeku)
const court=at((()=>{const g=new THREE.Group();g.add(box(16,.2,9,std('#d9733a'),0,.1,0));g.add(box(14,.05,7,std('#2f7de1'),0,.22,0));g.add(box(.12,.06,7,MT.white,0,.26,0));
 const cc=new THREE.Mesh(new THREE.TorusGeometry(1.4,.06,4,24),MT.white);cc.rotation.x=Math.PI/2;cc.position.y=.27;g.add(cc);
 for(const x of [-7.4,7.4]){g.add(cyl(.12,.12,3.6,MT.dark,x*1.04,1.8,0,6));g.add(box(.1,1.1,1.6,MT.white,x,3.4,0));const r=new THREE.Mesh(new THREE.TorusGeometry(.4,.05,6,16),std('#ff6a1a'));r.rotation.x=Math.PI/2;r.position.set(x-Math.sign(x)*.5,3,0);g.add(r);}
 const pl=[];for(let i=0;i<4;i++){const p=pawn(i<2?'#e8334f':'#2f7de1',.85);p.position.set(-3+i*2,.2,(i%2?1.5:-1.5));g.add(p);pl.push(p);}g.userData.pl=pl;
 const ball=new THREE.Mesh(new THREE.SphereGeometry(.3,10,8),std('#ff6a1a'));g.add(ball);g.userData.ball=ball;
 g.traverse(o=>o.castShadow=true);return g;})(),84,48,37.6);

// ---------- 🎡 amusement park + mascots (@tjsgame555)
clearTrees([[-112,-82,40,60]]);
const fun=at((()=>{const g=new THREE.Group();g.add(box(26,.15,16,std('#bfe39a'),0,.07,0));
 const wheel=new THREE.Group();const rim=new THREE.Mesh(new THREE.TorusGeometry(7,.25,6,40),std('#e8334f'));wheel.add(rim);for(let i=0;i<8;i++){const sp=box(.15,14,.15,MT.white,0,0,0);sp.rotation.z=i*Math.PI/8;wheel.add(sp);}
 const cabs=[];for(let i=0;i<10;i++){const c=box(1.2,1.1,1,std(['#f2d33a','#2f7de1','#4fbf3a','#ff8a4c','#9b59d6'][i%5]),0,0,0);wheel.add(c);cabs.push(c);}wheel.position.set(-6,8.4,0);g.add(wheel);
 for(const z of [-1,1]){const l=box(.4,9,.4,MT.white,-6,4.2,z);l.rotation.x=z*.15;g.add(l);}g.userData.wheel=wheel;g.userData.cabs=cabs;
 const carousel=new THREE.Group();carousel.add(cyl(4,4,.4,std('#ffd1e8'),0,.4,0,20));carousel.add(cyl(.3,.3,4,MT.white,0,2.4,0,8));const cr=new THREE.Mesh(new THREE.ConeGeometry(4.4,1.8,20),std('#e85d75'));cr.position.y=5;carousel.add(cr);
 for(let i=0;i<6;i++){const a=i/6*Math.PI*2;const h=box(.5,.9,1.2,std(['#ffffff','#f2d33a','#5fd3f3'][i%3]),Math.cos(a)*3,1.4,Math.sin(a)*3);carousel.add(h);carousel.add(cyl(.05,.05,3.4,MT.gold,Math.cos(a)*3,2.6,Math.sin(a)*3,6));}carousel.position.set(7,0,-2);g.add(carousel);g.userData.car=carousel;
 const mascots=[];[['#ff8a4c'],['#5fd3f3'],['#f2d33a']].forEach(([c],i)=>{const m=pawn(c,1.9);const e1=new THREE.Mesh(new THREE.SphereGeometry(.22,8,6),std(c));e1.position.set(-.2,1.85,0);const e2=e1.clone();e2.position.x=.2;m.add(e1,e2);
  const eyes=box(.36,.08,.05,std('#1d232b'),0,1.6,.27);m.add(eyes);m.position.set(1+i*3,.15,5);g.add(m);mascots.push(m);});g.userData.mascots=mascots;
 const s=sign('FUN PARK','#ffffff','#e8334f',4,.8);s.position.set(8,4.2,7.2);g.add(s);g.add(cyl(.1,.1,4,MT.dark,6.2,2,7.2,6));g.add(cyl(.1,.1,4,MT.dark,9.8,2,7.2,6));
 g.traverse(o=>o.castShadow=true);return g;})(),-97,50,41.6);

// ---------- 🏠 "WHERE'S MY HOUSE" (@bradar018)
const bradar=at((()=>{const g=homeModel(5,4.4,3.4,std('#ffe0b8'),MT.blue,3);const s=sign('BRADAR\'S HOUSE','#ffffff','#e8334f',3.6,.7);s.position.set(0,4.6,2.6);g.add(s);
 g.add(box(7,.1,6,MT.grass,0,.05,0));for(let i=0;i<8;i++)g.add(box(.12,.8,.12,MT.white,-3.4+i*1,.4,3.2));const br=pawn('#3e8fe6',.9);br.position.set(1.8,0,3.8);g.add(br);g.userData.br=br;
 g.traverse(o=>o.castShadow=true);return g;})(),82,64,45.6);

const SH=[
 {t0:0,   t1:4,   p:[L(0,-150,120),L(0,-140,112)], l:[L(0,40,10),L(0,40,10)], f:46},
 {t0:4,   t1:9,   p:[L(-70,40,46),L(-76,42,44)], l:[L(BU,BV,0),L(BU,BV,0)], f:50},
 {t0:9,   t1:17,  orbit:{c:[BU,BV,4],r:46,h:30,a0:2.2,a1:3.4}, f:50},
 {t0:17,  t1:21.4,p:[L(DU-30,DV+30,26),L(DU-34,DV+26,24)], l:[L(DU,DV,3),L(DU,DV,3)], f:50},
 {t0:21.4,t1:25.2,p:[L(78,6,12),L(80,7,11)], l:[L(84,22,4),L(84,22,4)], f:54},
 {t0:25.2,t1:29.2,p:[L(34,52,72),L(40,50,70)], l:[L(78,112,12),L(78,112,12)], f:46},
 {t0:29.2,t1:33.2,p:[L(-52,2,26),L(-46,-2,32)], l:[L(0,-50,46),L(0,-50,56)], f:56},
 {t0:33.2,t1:37.4,p:[L(-58,108,18),L(-56,112,18)], l:[L(-2,97,4),L(-2,97,4)], f:50},
 {t0:37.4,t1:41.4,p:[L(74,36,13),L(75,37,12)], l:[L(84,48,1),L(84,48,1)], f:54},
 {t0:41.4,t1:45.4,p:[L(-80,30,22),L(-84,30,21)], l:[L(-97,50,6),L(-97,50,6)], f:52},
 {t0:45.4,t1:49.2,p:[L(74,52,10),L(75,53,9)], l:[L(82,64,3),L(82,64,3)], f:55},
 {t0:49.2,t1:58,  p:[L(70,-112,168),L(84,-132,196)], l:[L(0,40,0),L(0,40,0)], f:46},
];
const DUR=58;
const TD=[0,4.2,9.2,17.2,21.6,25.4,29.4,33.4,37.6,41.6,45.6,49.4,58];
const TR=window.DAY6_TR||TD, RDUR=TR[TR.length-1];
const pw=(x,A,B)=>{for(let i=0;i<A.length-1;i++)if(x<=A[i+1]||i==A.length-2)return B[i]+(B[i+1]-B[i])*clamp((x-A[i])/(A[i+1]-A[i]));};
const toD=tr=>pw(tr,TR,TD), toR=td=>pw(td,TD,TR);
const caps=[
 ['c1',.2,4,TXT.d0],['c1',4.2,9,TXT.d1],['c1',9.2,17,TXT.d2],['c1',17.2,21.4,TXT.d3],['c1',21.6,25.2,TXT.d4],['c1',25.4,29.2,TXT.d5],['c1',29.4,33.2,TXT.d6],
 ['c1',33.4,37.4,TXT.d7],['c1',37.6,41.4,TXT.d8],['c1',41.6,45.4,TXT.d9],['c1',45.6,49.2,TXT.d10],['c1',49.4,DUR,TXT.d11],['c2',53,DUR,TXT.d11b],
];
const TAGS=[
 ['🪖 MILITARY BASE','@mongolianstarlight',()=>L(BU,BV,14),11.0,13.6],
 ['⭐ THE GENERAL','@mongolianstarlight',()=>base.userData.gen.getWorldPosition(v3(0,0,0)).add(v3(0,3.6,0)),13.8,17],
 ['🏜️ DESERT ISLAND + CAMELS','@hamd2011_2012',()=>L(DU,DV,12),18.0,21.4],
 ['🧪 THE SCIENTIST','@punzisttv',()=>lab.userData.sci.getWorldPosition(v3(0,0,0)).add(v3(0,2.6,0)),22.2,25.2],
 ['🏰 OLD CASTLE','@egyptianmapper16',()=>L(78,112,20),26.0,29.2],
 ['🌊 OCEAN TOWER','@ilikesouthparkandetc',()=>L(0,-50,0).setY(70),30.2,33.2],
 ['✈️ MATEL AIR','@mat3lx2_spots',()=>matel.position.clone().add(v3(0,6,0)),34.0,37.4],
 ['🐧 ANTARCTIC AIRLINES HQ','@official_d4sh',()=>L(-24,112,12),34.8,37.4],
 ['🏀 BASKETBALL COURT','@raphaelryeku',()=>L(84,48,6),38.2,41.4],
 ['🎡 FUN PARK + MASCOTS','@tjsgame555',()=>L(-97,50,18),42.2,45.4],
 ['🏠 BRADAR\'S HOUSE','@bradar018',()=>L(82,64,9),46.2,49.2],
];
$('tags').innerHTML=TAGS.map(t=>`<div class="ntag"><div class="tt">${t[0]}</div><div class="ts">${t[1]}</div></div>`).join('');
window.CAPTION_TIMES=[...new Set(caps.map(c=>c[1]))].concat(TAGS.map(t=>t[3]),[4.6,5.0,50.4,51.0],POP.map(g=>g.userData.t)).map(toR);
window.CUTS=SH.map(s=>s.t0).map(toR);
window.BOOMS=[];
function popAt(el,t,a,b,{inDur=.28,outDur=.15}={}){
 if(t<a||t>b){el.style.opacity=0;return 0;}
 const k=clamp((t-a)/inDur), ko=clamp((b-t)/outDur);const s= k<1 ? (k<.6? .55+.6*(k/.6) : 1.15-.15*((k-.6)/.4)) : 1;
 el.style.opacity=Math.min(k*2,ko,1); el.style.transform=(el.dataset.base||'')+` scale(${s})`; return 1;}
const proj=(v)=>{const p=v.clone().project(camera);return [(p.x+1)/2*1080,(1-p.y)/2*1920,p.z];};

window.setTime=function(tr){const t=toD(tr);
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
 for(const g of NEW){ if(POP.includes(g))continue; g.visible=true;g.scale.setScalar(1);
   if(g.userData.base!==undefined){g.position.y=g.userData.base+Math.sin(t*1.5+g.position.x)*.15;g.rotation.z=Math.sin(t*1.2+g.position.z)*.04;}}
 for(const g of POP){const kk=clamp((t-g.userData.t)/.5);g.visible=kk>0;if(kk>0)g.scale.setScalar(Math.max(.001,backOut(kk)));}
 peopleAt(t,true);
 plaza.userData.jets.forEach((j,i)=>{const a=i/10*Math.PI*2,ph=((t*1.2+i*.1)%1);j.position.set(Math.cos(a)*(1.3+ph*1.6),1.2+ph*2.4-ph*ph*2.4,Math.sin(a)*(1.3+ph*1.6));});
 kids.forEach(kd=>{const i=kd.userData.i;kd.position.y=.25+Math.abs(Math.sin(t*6+i))*.35;});
 police.userData.lt.material.color.set(Math.sin(t*12)>0?'#e8334f':'#2f7de1');
 pizzeria.userData.sign.rotation.y=t*1.5; watermill.userData.wheel.rotation.z=-t*1.2; lighthouse.userData.piv.rotation.y=t*1.6;
 { const cu=coaster.userData.curve,ph=(t*.09)%1;coaster.userData.cart.position.copy(cu.getPoint(ph));coaster.userData.cart.lookAt(cu.getPoint((ph+.004)%1)); }
 iceTruck.visible=false;
 { const a=t*.12;const c=L(0,30);jetliner.position.set(c.x+Math.cos(a)*190,95,c.z+Math.sin(a)*150);jetliner.lookAt(c.x+Math.cos(a+.05)*190,95,c.z+Math.sin(a+.05)*150);jetliner.rotateY(-Math.PI/2); }
 birds.forEach(b=>{const {i,wl,wr}=b.userData;const a=t*.25+i*.7;const R=60+(i%3)*20;const c=L(0,20);b.position.set(c.x+Math.cos(a)*R,52+(i%4)*6+Math.sin(t+i)*1.5,c.z+Math.sin(a)*R*.8);b.rotation.y=-a;const fl=Math.sin(t*10+i)*.5;wl.rotation.z=.35+fl;wr.rotation.z=-.35-fl;});
 karts.forEach((kt,i)=>{const a=t*(1.1+i*.07)+i*1.4;kt.position.set(Math.cos(a)*KA,0,Math.sin(a)*KB);kt.rotation.y=-Math.atan2(Math.cos(a)*KB,-Math.sin(a)*KA)+Math.PI/2;});
 siren.userData.head.rotation.y=t*.6; waves.forEach(w=>w.material.opacity=0);
 heli.visible=true;heli.position.copy(PAD);heli.rotation.y=FACE;heli.userData.rot.rotation.y=0;
 TAXI.forEach(g=>{const {v,ph,lane}=g.userData;const u=-60+(((t*9+ph)%130)+130)%130;g.position.copy(L(u,v+lane,.1));g.lookAt(L(u+2,v+lane,.1));});
 // Day 6 life
 base.userData.rotor.children[2].rotation.y=t*6;base.userData.rotor.children[3].rotation.y=t*6;
 base.userData.gen.position.y=base.userData.top+Math.abs(Math.sin(t*3))*.15;
 desert.userData.camels.forEach((c,i)=>{c.rotation.y=i*1.3+Math.sin(t*.6+i)*.5;});
 lab.userData.bub.forEach((b,i)=>{const ph=((t*.7+i/6)%1);b.position.set(Math.sin(i*2)*.6,7.6+ph*3,1+Math.cos(i*2)*.6);b.scale.setScalar(1-ph*.6);});
 { const w=fun.userData.wheel;w.rotation.z=t*.35;fun.userData.cabs.forEach((c,i)=>{const a=i/10*Math.PI*2;c.position.set(Math.cos(a)*7,Math.sin(a)*7-1,0);c.rotation.z=-w.rotation.z;});fun.userData.car.rotation.y=t*.8;
   fun.userData.mascots.forEach((m,i)=>{m.position.y=.15+Math.abs(Math.sin(t*4+i))*.6;m.rotation.y=Math.sin(t*2+i)*.6;}); }
 { const pl=court.userData.pl,bl=court.userData.ball;pl.forEach((p,i)=>{p.position.x=-3+i*2+Math.sin(t*2+i)*1.2;p.position.z=(i%2?1.5:-1.5)+Math.cos(t*1.7+i)*.8;});const ph=(t*.8)%1;const a=pl[Math.floor(t*.8)%4].position;bl.position.set(a.x,.6+Math.abs(Math.sin(ph*Math.PI*3))*1.6,a.z+.6); }
 bradar.userData.br.rotation.y=Math.sin(t*3)*.5;

 renderer.render(scene,camera);

 // ---------- UI ----------
 const used={c1:false,c2:false};
 for(const [id,a,b,txt] of caps){ if(t>=a&&t<=b){const el=$(id); if(el.dataset.txt!==txt){el.innerHTML=txt;el.dataset.txt=txt;} popAt(el,t,a,b); used[id]=true; } }
 for(const id in used) if(!used[id]) $(id).style.opacity=0;
 $('popn').textContent=Math.round(1462+2*ease(clamp((t-.6)/2.6))).toLocaleString('en-US');
 popAt($('votes'),t,4.6,9); const vk=ease(clamp((t-5.0)/1.0));
 $('barA').style.width=(0*vk)+'%'; $('barB').style.width=(100*vk)+'%'; $('nA').textContent='0'; $('nB').textContent=Math.round(4*vk);
 [...$('goals').children].forEach(el=>popAt(el,t,99,0));
 [...$('tags').children].forEach((el,i)=>{const [_,__,pf,a,b]=TAGS[i];const pp=proj(pf());el.dataset.base='translate(-50%,-100%)';const hw=el.offsetWidth/2+24;el.style.left=Math.min(1080-hw,Math.max(hw,pp[0]))+'px';el.style.top=Math.max(560+el.offsetHeight+18,pp[1])+'px';popAt(el,t,a,b);if(pp[2]>1)el.style.opacity=0;});
 [...$('laws').children].forEach((c,i)=>popAt(c,t,50.4+i*.6,DUR));
 let fl=0; for(const c of window.CUTS){ if(c>0&&tr>=c&&tr<c+.12) fl=.5*(1-(tr-c)/.12);} $('flash').style.opacity=fl;
};
window.DUR=RDUR; window.__T2={camera,renderer,scene,L,LW};
document.fonts.ready.then(()=>{window.setTime(0);window.READY=true;});
