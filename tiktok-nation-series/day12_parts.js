// ===== DAY 12: the vote was a tie → BOTH a space station (D4SH) and an underwater city (RDA), RDA North Pacific Airways,
// rainbowpopsicle1777 becomes air traffic control, the castle moves to its own island, the 600 m spire, a mall, Dre's house,
// a chocolate factory island, Milo's Titanic, Day 13 vote =====
// (make_day12.py prepends the Day 5 → Day 11 builds, all already standing, and injects the Day 11 "life" block)
const wp12=g=>g.getWorldPosition(v3(0,0,0));
const ISL12=[];
function mk12(u,v,r,name,top){const g=new THREE.Group();g.add(cyl(r,r+4,6,sandM,0,-1,0,30));g.add(cyl(r-4,r-1.5,2.4,top||grassM,0,2.3,0,28));
 const bld=new THREE.Group();bld.position.y=T10;g.add(bld);const sp=label10(name);sp.position.set(0,52,0);g.add(sp);
 const p=LW(u,v);g.position.set(p.x,SEA,p.y);g.rotation.y=FACE;g.visible=false;scene.add(g);
 const ref=new THREE.Object3D();ref.position.copy(g.position);ref.rotation.copy(g.rotation);ref.updateMatrixWorld(true);
 const o={g,bld,sp,ref,r,u,v};ISL12.push(o);return o;}
const IL3=(i,x,y,z)=>ISL12[i].ref.localToWorld(v3(x,y+SEA+T10,z));
const glass12=new THREE.MeshStandardMaterial({color:'#bfefff',transparent:true,opacity:.28,roughness:.05,metalness:.1,depthWrite:false,side:THREE.DoubleSide});
const emis=(c,i=1.2)=>std(c,{emissive:c,emissiveIntensity:i});

// ---------- 🛰️ (A) D4SH: "I want my airline in space" — HERBERG SPACE STATION, the Antarctic Airlines space plane docked on top
const SC=L(0,-130,640);
const STN=(()=>{const g=new THREE.Group();const W=std('#eef2f6',{metalness:.3,roughness:.4}),G=std('#9aa5b1',{metalness:.5,roughness:.3}),PV=std('#1f3f8f',{metalness:.3,roughness:.25,emissive:'#0a1f55',emissiveIntensity:.4});
 const hub=cyl(5,5,46,W,0,0,0,18);hub.rotation.z=Math.PI/2;g.add(hub);
 for(const x of [-23,23]){const c=cyl(6.4,6.4,3,G,x,0,0,18);c.rotation.z=Math.PI/2;g.add(c);}
 const ring=new THREE.Group();ring.add(new THREE.Mesh(new THREE.TorusGeometry(30,2.6,10,48),W));for(let k=0;k<6;k++){const s=box(1.4,30,1.4,G,0,0,0);s.position.set(0,Math.cos(k/6*Math.PI*2)*15,Math.sin(k/6*Math.PI*2)*15);s.rotation.x=-k/6*Math.PI*2;ring.add(s);}
 for(let k=0;k<24;k++){const a=k/24*Math.PI*2;const w=box(.3,1.2,1.6,emis('#ffe9a8',1.4),0,0,0);w.position.set(2.7,Math.cos(a)*30,Math.sin(a)*30);w.rotation.x=-a;ring.add(w);w.position.x=2.65;}
 ring.rotation.y=Math.PI/2;ring.position.x=-6;g.add(ring);g.userData.ring=ring;
 for(const x of [-38,38])for(const z of [-1,1]){const pn=new THREE.Group();pn.add(box(16,.3,30,PV,0,0,0));for(let k=-2;k<=2;k++)pn.add(box(16.2,.35,.3,G,0,0,k*6));pn.add(box(.4,.4,30,G,0,0,0));pn.position.set(x,0,z*17);g.add(pn);}
 for(const x of [-38,38])g.add(box(1,1,4,G,x,0,0));for(const x of [-30,30])g.add(box(16,1,1,G,x*.85,0,0));
 for(const [x,y] of [[8,8],[-14,-8]]){const m=cyl(4,4,12,W,x,y,0,14);g.add(m);}
 const dock=box(6,4,6,G,4,6.5,0);g.add(dock);
 const s=sign('HERBERG SPACE STATION','#1b4f9c','#ffffff',18,2.4);s.position.set(0,0,5.15);g.add(s);const s2=s.clone();s2.rotation.y=Math.PI;s2.position.z=-5.15;g.add(s2);
 const lt=logoTex();for(const z of [1,-1]){const pl=new THREE.Mesh(new THREE.PlaneGeometry(7,7),new THREE.MeshBasicMaterial({map:lt}));pl.position.set(-23,0,z*6.5);if(z<0)pl.rotation.y=Math.PI;g.add(pl);}
 const fl=new THREE.Mesh(new THREE.PlaneGeometry(4.2,2.8),new THREE.MeshStandardMaterial({map:FLAG_TEX,side:THREE.DoubleSide}));fl.position.set(14,9,0);g.add(fl);g.add(cyl(.12,.12,6,G,12,6,0,6));
 const bl=[];for(const x of [-46,46,0]){const b=new THREE.Mesh(new THREE.SphereGeometry(.6,8,6),emis('#ff3b3b',2));b.position.set(x,x?0:6,0);g.add(b);bl.push(b);}g.userData.bl=bl;
 const astro=pawn('#ffffff',1.3);astro.add(new THREE.Mesh(new THREE.SphereGeometry(.62,12,10),std('#ffcf5a',{metalness:.7,roughness:.15})).translateY(1.7));g.add(astro);g.userData.astro=astro;
 g.position.copy(SC);g.rotation.y=FACE;g.visible=false;g.traverse(q=>{if(q.isMesh)q.castShadow=false;});scene.add(g);return g;})();
const STN_DOCK=()=>STN.localToWorld(v3(4,9.4,0));

// ---------- 🐠 (B) RDA: "B" — HERBERG'S FIRST UNDERWATER CITY, under the sea with an entrance platform on top
const UWu=0,UWv=-385,UP=LW(UWu,UWv),UC=v3(UP.x,SEA,UP.y),FLOOR=SEA-58;
const UW=(()=>{const g=new THREE.Group();g.position.copy(UC);g.rotation.y=FACE;scene.add(g);g.visible=false;
 const bed=cyl(78,84,6,std('#d9c08a'),0,FLOOR-SEA-3,0,40);g.add(bed);
 const sandb=[];for(let k=0;k<30;k++){const a=k*2.399,r=10+(k*13)%62;const rk=new THREE.Mesh(new THREE.IcosahedronGeometry(1.4+(k%3),0),std(['#8a8f96','#a19a8b','#6f7880'][k%3]));rk.position.set(Math.cos(a)*r,FLOOR-SEA+.4,Math.sin(a)*r);rk.scale.y=.6;g.add(rk);}
 const COR=['#ff6f91','#ff9f43','#c56cf0','#ffd32a','#ff5e57'];
 for(let k=0;k<46;k++){const a=k*2.399+.4,r=14+(k*17)%60;const c=new THREE.Group();const m=std(COR[k%5]);for(let j=0;j<4;j++){const b=cyl(.35,.5,3+j%2*2,m,0,1.5,0,6);b.rotation.set((j-1.5)*.4,0,(j%2-.5)*.6);c.add(b);}c.position.set(Math.cos(a)*r,FLOOR-SEA,Math.sin(a)*r);g.add(c);}
 const kelp=[];for(let k=0;k<24;k++){const a=k*1.7,r=20+(k*23)%54;const kp=new THREE.Group();for(let j=0;j<6;j++)kp.add(box(.6,2.2,.2,std('#2f9e5a'),0,1.1+j*2.1,0));kp.position.set(Math.cos(a)*r,FLOOR-SEA,Math.sin(a)*r);g.add(kp);kelp.push(kp);}g.userData.kelp=kelp;
 const DOMES=[[0,0,24],[-36,14,15],[34,12,16],[-6,-38,14],[30,-30,12]];
 const TC=['#f4ead2','#e9f0f5','#ffd9b8','#cfe8ff','#ffe2ef'];
 DOMES.forEach(([x,z,r],i)=>{const base=cyl(r+1.4,r+2,2,std('#9aa5b1',{metalness:.4}),x,FLOOR-SEA+1,z,32);g.add(base);
  const n=Math.round(r/3.2);for(let k=0;k<n;k++){const a=k/n*Math.PI*2+i,rr=(k%3)*r*.22+r*.12;const h=4+((k*7+i*3)%5)*r*.12;const tw=new THREE.Group();tw.add(cyl(1.6,1.8,h,std(TC[(k+i)%5]),0,h/2,0,8));
   for(let f=1;f<h/2.2;f++)tw.add(cyl(1.65,1.65,.4,emis(['#7fe3ff','#ffe9a8','#ff9ec4'][(k+i)%3],1.1),0,f*2.2,0,8));tw.position.set(x+Math.cos(a)*rr,FLOOR-SEA+2,z+Math.sin(a)*rr);g.add(tw);}
  const d=new THREE.Mesh(new THREE.SphereGeometry(r,28,14,0,Math.PI*2,0,Math.PI/2),glass12);d.position.set(x,FLOOR-SEA+2,z);g.add(d);
  const rib=new THREE.Mesh(new THREE.TorusGeometry(r,.25,6,40),std('#dfe8ef',{metalness:.5}));rib.rotation.x=Math.PI/2;rib.position.set(x,FLOOR-SEA+2.2,z);g.add(rib);});
 for(let i=1;i<DOMES.length;i++){const [x,z]=DOMES[i];const a=v3(0,0,0),b=v3(x,0,z);const len=a.distanceTo(b);const t=new THREE.Mesh(new THREE.CylinderGeometry(2.4,2.4,len,14,1,true),glass12);t.rotation.z=Math.PI/2;
  const tg=new THREE.Group();tg.add(t);tg.position.set(x/2,FLOOR-SEA+4,z/2);tg.rotation.y=-Math.atan2(z,x);g.add(tg);}
 const sg=sign('RDA UNDERWATER CITY','#0f5c8c','#ffffff',22,3);sg.position.set(0,FLOOR-SEA+5,24.6);g.add(sg);
 // the way down: entrance platform + glass elevator tube
 const pf=new THREE.Group();pf.add(cyl(9,9.5,2,std('#e9f0f5'),0,.6,0,24));pf.add(cyl(3,3,6,glass12,0,4.4,0,16));pf.add(cyl(3.3,3.3,.5,std('#0f5c8c'),0,7.6,0,16));
 const ps=sign('⬇ UNDERWATER CITY','#0f5c8c','#ffffff',10,1.6);ps.position.set(0,2.4,9.6);pf.add(ps);for(let k=0;k<8;k++){const a=k/8*Math.PI*2;pf.add(cyl(.12,.12,1.4,MT.dark,Math.cos(a)*8.6,2.1,Math.sin(a)*8.6,6));}
 pf.position.set(0,0,0);g.add(pf);
 const tube=new THREE.Mesh(new THREE.CylinderGeometry(2.6,2.6,SEA-FLOOR-26,16,1,true),glass12);tube.position.set(0,(FLOOR-SEA+26)/2-1,0);g.add(tube);
 const lift=box(3.4,3,3.4,emis('#ffe9a8',.6),0,0,0);g.add(lift);g.userData.lift=lift;
 const fish=[];const FC=['#ff9f43','#ffd32a','#4bcffa','#ff5e57','#ffffff','#c56cf0'];for(let k=0;k<26;k++){const f=new THREE.Group();const m=std(FC[k%6]);const b=new THREE.Mesh(new THREE.SphereGeometry(1,10,8),m);b.scale.set(1.6,1,.6);f.add(b);
  const tl=new THREE.Mesh(new THREE.ConeGeometry(.8,1.4,4),m);tl.rotation.z=Math.PI/2;tl.position.x=-2;f.add(tl);f.userData={tl,k,r:16+(k*11)%46,h:FLOOR-SEA+8+(k*7)%30,sp:.25+(k%5)*.06,dir:k%2?1:-1};f.scale.setScalar(.8+(k%3)*.3);g.add(f);fish.push(f);}g.userData.fish=fish;
 const sub=new THREE.Group();const sm=std('#f2c230');const sb=new THREE.Mesh(new THREE.CapsuleGeometry(2.6,9,8,14),sm);sb.rotation.z=Math.PI/2;sub.add(sb);sub.add(box(3,2.6,2,sm,1,3,0));sub.add(cyl(.2,.2,2.4,MT.dark,1.6,5,0,6));
  for(const x of [-3,0,3])for(const z of [1,-1]){const w=cyl(.8,.8,.3,emis('#bfefff',.8),x,0,z*2.45,12);w.rotation.x=Math.PI/2;sub.add(w);}const pr=box(.3,3.4,.6,MT.dark,-7.4,0,0);sub.add(pr);sub.userData.pr=pr;
  const ss=sign('RDA','#0f5c8c','#ffffff',3,1);ss.position.set(1,3,1.05);sub.add(ss);g.add(sub);g.userData.sub=sub;
 const bub=[];for(let k=0;k<40;k++){const b=new THREE.Mesh(new THREE.SphereGeometry(.35,6,5),new THREE.MeshStandardMaterial({color:'#ffffff',transparent:true,opacity:.55}));g.add(b);bub.push(b);}g.userData.bub=bub;
 const diver=pawn('#0f5c8c',1.4);diver.add(box(1,1.2,.6,std('#f2c230'),0,1.2,-.55));g.add(diver);g.userData.diver=diver;
 g.traverse(q=>{if(q.isMesh)q.castShadow=false;});return g;})();
const UWW=(x,y,z)=>UW.localToWorld(v3(x,y,z));
const seaUnder=new THREE.Mesh(new THREE.PlaneGeometry(3000,3000),new THREE.MeshBasicMaterial({color:'#7fd6f5',transparent:true,opacity:.75,side:THREE.BackSide,fog:false}));seaUnder.rotation.x=-Math.PI/2;seaUnder.position.y=SEA-.05;seaUnder.visible=false;scene.add(seaUnder);
const RAYS=[...Array(10)].map((_,k)=>{const m=new THREE.Mesh(new THREE.CylinderGeometry(1.2,4,60,8,1,true),new THREE.MeshBasicMaterial({color:'#e8fbff',transparent:true,opacity:.12,depthWrite:false,fog:false}));m.visible=false;scene.add(m);return m;});

// ---------- island 0: ✈️ RDA NORTH PACIFIC AIRWAYS hub island + 🎧 the new control tower, with RAINBOWPOPSICLE1777 as air traffic control
const AIR=(()=>{const o=mk12(-200,-385,40,'RDA North Pacific Airways',std('#9fd07a'));const b=o.bld;
 b.add(box(70,.25,9,MT.road,0,.15,4));for(let k=0;k<12;k++)b.add(box(3,.27,.5,whiteM,-30+k*5.4,.16,4));for(const x of [-34,34])b.add(box(1,.28,8,whiteM,x,.17,4));
 b.add(box(40,.22,6,std('#8f969e'),2,.12,-6));
 const tm=new THREE.Group();tm.add(box(30,6,9,whiteM,0,3,0));tm.add(box(30.6,.8,9.6,std('#0f5c8c'),0,6.4,0));tm.add(box(26,3.6,.08,MT.glass,0,3,4.54));
 const ts=sign('RDA NORTH PACIFIC AIRWAYS','#0f5c8c','#ffffff',20,1.8);ts.position.set(0,5.6,4.6);tm.add(ts);tm.position.set(4,0,-17);b.add(tm);
 // the tower
 const tw=new THREE.Group();const TW=std('#f4f4f4');tw.add(box(7,3,7,std('#e9f0f5'),0,1.5,0));tw.add(cyl(1.6,2.2,20,TW,0,13,0,14));tw.add(cyl(4.6,3.2,1.2,TW,0,23.6,0,12));
 const floor=cyl(4.4,4.4,.3,std('#5a6470'),0,24.3,0,12);tw.add(floor);
 const cab=new THREE.Mesh(new THREE.CylinderGeometry(4.6,4.2,4,12,1,true),new THREE.MeshStandardMaterial({color:'#9fdcff',transparent:true,opacity:.22,roughness:.05,metalness:.3,depthWrite:false,side:THREE.DoubleSide}));cab.position.y=26.4;tw.add(cab);
 for(let k=0;k<12;k++){const a=k/12*Math.PI*2;tw.add(box(.25,4,.25,std('#dfe5ea'),Math.cos(a)*4.45,26.4,Math.sin(a)*4.45));}
 tw.add(cyl(5,5,.7,std('#0f5c8c'),0,28.7,0,12));const rad=new THREE.Group();rad.add(box(.3,1.6,.3,MT.dark,0,.8,0));rad.add(box(4,1.1,.25,std('#f4f4f4'),0,1.9,0));rad.position.y=29;tw.add(rad);
 const bcn=new THREE.Mesh(new THREE.SphereGeometry(.4,8,6),emis('#ff3b3b',2));bcn.position.y=31.5;tw.add(bcn);
 const desk=box(5,.8,1.4,std('#3a4350'),0,24.8,-1.6);tw.add(desk);for(let k=0;k<3;k++){const sc=box(1.1,.7,.1,emis(['#2fe08a','#4bcffa','#ffd32a'][k],1.3),-1.4+k*1.4,25.5,-1.1);sc.rotation.x=-.5;tw.add(sc);}
 // rainbowpopsicle1777: rainbow shirt, headset + mic
 const ctl=new THREE.Group();const RB=['#e8334f','#ff9f43','#ffd32a','#2fe08a','#2f7de1','#9b59d6'];const p=pawn('#ffd32a',1.5);ctl.add(p);
 for(let k=0;k<6;k++)ctl.add(cyl(.62,.62,.16,std(RB[k]),0,.45+k*.17,0,14));
 const hs=new THREE.Mesh(new THREE.TorusGeometry(.62,.09,6,16,Math.PI),std('#1d232b'));hs.position.y=2.0;ctl.add(hs);
 for(const x of [-.64,.64])ctl.add(cyl(.24,.24,.18,std('#1d232b'),x,2.0,0,10).rotateZ(Math.PI/2));const mic=box(.07,.07,.62,std('#1d232b'),.4,1.72,.3);mic.rotation.y=.5;ctl.add(mic);ctl.add(new THREE.Mesh(new THREE.SphereGeometry(.09,8,6),std('#1d232b')).translateX(.15).translateY(1.72).translateZ(.58));
 ctl.position.set(0,24.45,.2);tw.add(ctl);tw.userData={rad,bcn,ctl};
 const atcS=sign('AIR TRAFFIC CONTROL','#0f5c8c','#ffffff',8,1);atcS.position.set(0,2.2,3.55);tw.add(atcS);
 tw.position.set(-22,0,-14);b.add(tw);o.tw=tw;
 const jets=[];for(let k=0;k<2;k++){const j=plane('#ffffff','#0f5c8c','RDA');j.scale.setScalar(.85);b.add(j);jets.push(j);}o.jets=jets;
 for(const [x,z] of [[-34,-24],[30,-30],[36,18],[-36,20],[16,24],[-12,26]]){const pp=palm10(1);pp.position.set(x,0,z);b.add(pp);}
 const wind=new THREE.Group();wind.add(cyl(.1,.1,5,MT.dark,0,2.5,0,6));const ws=new THREE.Mesh(new THREE.ConeGeometry(.5,2.4,8,1,true),std('#ff8a2a',{side:THREE.DoubleSide}));ws.rotation.z=Math.PI/2;ws.position.set(1.2,4.8,0);wind.add(ws);wind.position.set(32,0,12);b.add(wind);
 o.who=ctl;return o;})();
// RDA jets flying between the islands (the airline's route: main island ↔ the hub ↔ the outer islands)
const RDAJ=[0,1,2].map(i=>{const j=plane('#ffffff','#0f5c8c','RDA');j.scale.setScalar(1.1);j.visible=false;scene.add(j);return j;});
const RDA_RT=new THREE.CatmullRomCurve3([[-200,-385],[-60,-200],[60,40],[200,-130],[230,-330],[0,-470],[-200,-385]].map(([u,v],i)=>{const p=LW(u,v);return v3(p.x,SEA+70+(i%2)*14,p.y);}),true,'catmullrom',.3);
const TRAILS=RDAJ.map(()=>[...Array(14)].map(()=>{const m=new THREE.Mesh(new THREE.SphereGeometry(.9,6,5),new THREE.MeshBasicMaterial({color:'#ffffff',transparent:true,opacity:.5}));m.visible=false;scene.add(m);return m;}));

// ---------- island 1: 🏰 EGYPTIAN MAPPER — his castle moves to its OWN island, and he's king of it
const CASI=(()=>{const o=mk12(-100,-385,36,'egyptian mapper',std('#93c76a'));const b=o.bld;
 king.userData.isK=true;const cc=castle.clone(true);delete king.userData.isK;cc.remove(cc.children[0]);cc.position.set(0,-castle.userData.top,-2);cc.rotation.set(0,0,0);cc.scale.setScalar(1);cc.visible=true;
 const kk=cc.children.find(c=>c.userData.isK);if(kk){kk.visible=true;kk.scale.setScalar(1);delete kk.userData.isK;o.kg=kk;}b.add(cc);o.cc=cc;
 for(let k=0;k<14;k++){const a=k/14*Math.PI*2;b.add(box(3,2.4,1.4,stone10,Math.cos(a)*28,1.2,Math.sin(a)*28).rotateY(-a));}
 const BN=['#c0392b','#2f5fb5','#f2c230'];for(let k=0;k<6;k++){const a=k/6*Math.PI*2+.3;const f=new THREE.Group();f.add(cyl(.1,.1,6,MT.dark,0,3,0,6));f.add(box(1.6,2.4,.08,std(BN[k%3]),.85,4.6,0));f.position.set(Math.cos(a)*24,0,Math.sin(a)*24);b.add(f);}
 const sub=[];for(let k=0;k<6;k++){const p=pawn(['#30c2a8','#e85d75','#f2d33a','#3e8fe6'][k%4],1);p.position.set(-7.5+k*3,0,18);b.add(p);sub.push(p);}o.sub=sub;
 const s=sign('KINGDOM OF EGYPTIAN MAPPER','#8a2be2','#f2c230',15,1.6);s.position.set(0,1.4,o.r-4.2);b.add(s);
 o.who=o.kg||sub[0];return o;})();
const CAS0=castle.position.clone(),CASS=castle.scale.clone();
const PUFF12=[...Array(16)].map(()=>{const m=new THREE.Mesh(new THREE.IcosahedronGeometry(3,0),new THREE.MeshStandardMaterial({color:'#ffffff',transparent:true,opacity:.9,flatShading:true}));m.visible=false;scene.add(m);return m;});

// ---------- island 2: 🛍️ ONLINE STRANGER — HERBERG MALL
const MALL=(()=>{const o=mk12(100,-385,36,'Online_Stranger',std('#9fd07a'));const b=o.bld;
 const m=new THREE.Group();m.add(box(36,11,18,std('#f4ead2'),0,5.5,0));m.add(box(36.6,1,18.6,std('#e8334f'),0,11.4,0));for(let f=0;f<2;f++)m.add(box(32,3.6,.1,MT.glass,0,3+f*5,9.06));
 const dm=new THREE.Mesh(new THREE.SphereGeometry(7,20,10,0,Math.PI*2,0,Math.PI/2),new THREE.MeshStandardMaterial({color:'#bfefff',transparent:true,opacity:.6,roughness:.05}));dm.position.y=11.9;m.add(dm);
 const ms=sign('HERBERG MALL','#e8334f','#ffffff',16,2.6);ms.position.set(0,9.6,9.15);m.add(ms);
 const SH=[['SHOES','#2f7de1'],['TOYS','#f2c230'],['FOOD','#2fa36b'],['GAMES','#9b59d6']];SH.forEach(([n,c],i)=>{const s=sign(n,c,'#ffffff',5,1);s.position.set(-12+i*8,5.6,9.12);m.add(s);});
 m.add(box(8,4,.12,std('#1d232b'),0,2,9.08));m.position.set(0,0,-8);b.add(m);
 const ba=new THREE.Group();ba.add(cyl(.05,.05,10,MT.dark,0,5,0,4));const bb=new THREE.Mesh(new THREE.SphereGeometry(3,16,12),std('#ff4d6d'));bb.position.y=12;ba.add(bb);const bs=sign('OPEN!','#ffffff','#e8334f',4,1.4);bs.position.set(0,12,3.05);ba.add(bs);ba.position.set(15,11.4,-8);b.add(ba);o.bal=ba;
 b.add(box(30,.2,10,MT.road,0,.12,11));const cars=[];for(let k=0;k<7;k++){const c=car11(['#c0392b','#2f7de1','#f2c230','#ffffff','#2fa36b','#9b59d6','#1d232b'][k]);c.position.set(-12+k*4,.2,11+(k%2?2.4:-2.4));b.add(c);cars.push(c);}o.cars=cars;
 const sh=[];for(let k=0;k<10;k++){const p=pawn(['#30c2a8','#9b59d6','#f2d33a','#e85d75','#3e8fe6'][k%5],.9);b.add(p);sh.push(p);}o.sh=sh;
 const bags=[];sh.forEach((p,i)=>{const bg=box(.5,.6,.25,std(['#e8334f','#f2c230','#2f7de1'][i%3]),.55,.8,0);p.add(bg);});
 const os=pawn('#5f646b',1.2);os.add(box(.9,.5,.1,std('#1d232b'),0,1.7,.5));os.position.set(-15,0,4);b.add(os);o.who=os;
 for(const [x,z] of [[-30,-4],[30,-4],[-26,18],[26,18]]){const pp=palm10(.9);pp.position.set(x,0,z);b.add(pp);}
 return o;})();

// ---------- island 3: 🏠 DRE (dre._.dean) — "dude where's my house" — right here!
const DRE=(()=>{const o=mk12(200,-385,30,'D🙊',std('#86cf5e'));const b=o.bld;
 const h=homeModel(12,10,7,std('#cfe8ff'),std('#2f5fb5'),5);h.position.set(0,0,-6);b.add(h);
 const hs=sign("DRE'S HOUSE",'#1d232b','#ffffff',8,1.4);hs.position.set(0,9.8,0);b.add(hs);
 const mb=new THREE.Group();mb.add(cyl(.12,.12,1.6,MT.wood,0,.8,0,6));mb.add(box(1,.8,1.4,std('#e8334f'),0,1.9,0));const ml=sign('DRE','#e8334f','#ffffff',1.2,.5);ml.position.set(.52,1.9,0);ml.rotation.y=Math.PI/2;mb.add(ml);mb.position.set(6,0,6);b.add(mb);
 b.add(box(2.4,.15,10,MT.stone,0,.1,6));for(let k=0;k<12;k++){const a=k/12*Math.PI*2;b.add(box(1.4,1,.3,whiteM,Math.cos(a)*15,.5,Math.sin(a)*15).rotateY(-a+Math.PI/2));}
 const ar=new THREE.Group();const am=std('#ff3b3b',{emissive:'#ff2020',emissiveIntensity:.6});const cn=new THREE.Mesh(new THREE.ConeGeometry(2.6,4,4),am);cn.rotation.x=Math.PI;ar.add(cn);ar.add(box(1.6,4,1.6,am,0,4,0));const hr=sign('HERE!','#ff3b3b','#ffffff',5,1.6);hr.position.set(0,7.6,0);ar.add(hr);
 ar.position.set(0,13,-4);b.add(ar);o.ar=ar;
 const dp=pawn('#f2c230',1.3);const arm=box(.25,1.2,.25,std('#ffd7b3'),.6,1.9,0);dp.add(arm);dp.userData.arm=arm;dp.position.set(-3,0,6);b.add(dp);o.who=dp;
 const dg=new THREE.Group();dg.add(box(1.4,.8,.6,std('#c98b45'),0,.7,0));dg.add(box(.6,.6,.6,std('#c98b45'),.8,1.1,0));dg.position.set(-6,0,8);b.add(dg);o.dog=dg;
 for(const [x,z] of [[-12,-12],[12,-12],[-13,10],[13,8]]){const pp=palm10(.85);pp.position.set(x,0,z);b.add(pp);}
 return o;})();

// ---------- island 4: 🍫 UNITED UNION (followed!) — a CHOCOLATE FACTORY island with a chocolate river
const CHOC=(()=>{const o=mk12(270,-300,30,'United Union',std('#7a4a2a'));const b=o.bld;const cho=std('#5a3420',{roughness:.25,metalness:.1}),milk=std('#a8642e');
 const f=new THREE.Group();f.add(box(22,10,12,std('#f4e3c3'),0,5,0));f.add(box(22.6,1,12.6,std('#8e44ad'),0,10.4,0));for(const x of [-7,0,7])f.add(cyl(1.3,1.6,9,std('#c0392b'),x,15,-2,10));
 const fs=sign('CHOCOLATE FACTORY','#5a3420','#ffd9a8',16,2.2);fs.position.set(0,7.6,6.05);f.add(fs);f.add(box(5,4.6,.1,std('#5a3420'),0,2.3,6.05));
 for(let k=0;k<3;k++)f.add(box(2,2,.1,std('#ffe9a8'),-8+k*16/2,7.4-4.4,6.06));f.position.set(-3,0,-10);b.add(f);
 const puff=[];for(let k=0;k<9;k++){const p=new THREE.Mesh(new THREE.IcosahedronGeometry(1,0),new THREE.MeshStandardMaterial({color:['#ff9ec4','#fff1d6','#c98b45'][k%3],transparent:true,opacity:.8}));b.add(p);puff.push(p);}o.puff=puff;
 const RV=[[6,-4],[8,2],[4,8],[-2,12],[-10,14],[-18,12]];for(let i=0;i<RV.length-1;i++){const [x1,z1]=RV[i],[x2,z2]=RV[i+1];const len=Math.hypot(x2-x1,z2-z1);const s=box(4.4,.35,len+1.4,cho,(x1+x2)/2,.2,(z1+z2)/2);s.rotation.y=Math.atan2(x2-x1,z2-z1);b.add(s);}
 const fall=box(3,5.6,.6,cho,7,2.8,-3.9);b.add(fall);const ripple=[];for(let k=0;k<6;k++){const r=new THREE.Mesh(new THREE.TorusGeometry(1,.12,5,14),milk);r.rotation.x=Math.PI/2;b.add(r);ripple.push(r);}o.ripple=ripple;
 const br=new THREE.Group();br.add(box(6,.4,2,std('#ff9ec4'),0,1.6,0));for(const x of [-2.6,2.6])br.add(cyl(.2,.2,1.6,std('#ffffff'),x,.8,0,6));br.position.set(-6,0,13.2);br.rotation.y=.3;b.add(br);
 const LC=['#e8334f','#2f7de1','#f2c230','#2fa36b','#ff6fa8','#9b59d6'];for(const [x,z,i] of [[-17,-2,0],[-14,4,1],[14,-14,2],[16,4,3],[12,14,4],[-18,-12,5],[2,18,0]]){const lp=new THREE.Group();lp.add(cyl(.18,.18,6,std('#ffffff'),0,3,0,6));const c=cyl(2,2,.5,std(LC[i]),0,6.6,0,18);c.rotation.x=Math.PI/2;lp.add(c);
  const sw=cyl(1.1,1.1,.55,std('#ffffff'),0,6.6,0,14);sw.rotation.x=Math.PI/2;lp.add(sw);lp.position.set(x,0,z);b.add(lp);}
 const bar=new THREE.Group();for(let i=0;i<3;i++)for(let j=0;j<2;j++)bar.add(box(2.4,.8,2.4,cho,i*2.6,0,j*2.6));bar.position.set(13,.4,-2);bar.rotation.y=.4;b.add(bar);
 const wk=[];for(let k=0;k<4;k++){const p=pawn(['#ff9f43','#2fa36b','#ff9f43','#2fa36b'][k],.8);p.add(box(.9,.12,.9,std('#ffffff'),0,1.95,0));p.position.set(-8+k*2.6,0,-2.6);b.add(p);wk.push(p);}o.wk=wk;
 const up=pawn('#1d5fb5',1.25);up.add(cyl(.5,.5,1,std('#5a3420'),0,2.4,0,12));up.position.set(-12,0,5);b.add(up);o.who=up;
 return o;})();
ISL12.forEach(o=>o.g.traverse(q=>{if(q.isMesh){q.castShadow=true;q.receiveShadow=true;}}));

// ---------- 🗼 NECK HURTS: a 600 m SPIRE on top of the Kingdom Tower (it touches the clouds)
const SPIRE=(()=>{const g=new THREE.Group();const T=ktower.userData.T,Hh=118,y0=T+4+Hh;const gold=std('#f2c230',{metalness:.7,roughness:.22}),sil=std('#dfe6ec',{metalness:.6,roughness:.2});
 g.add(cyl(1.4,2,4,gold,0,2,0,10));const H=150;g.add(cyl(.18,1.35,H,sil,0,4+H/2,0,10));for(let k=1;k<8;k++)g.add(cyl(1.35-k*.16+.3,1.35-k*.16+.3,.8,gold,0,4+k*H/9,0,10));
 const tip=new THREE.Mesh(new THREE.SphereGeometry(1.1,10,8),emis('#ff3b3b',2.2));tip.position.y=4+H+1;g.add(tip);g.userData.tip=tip;g.userData.H=H+5;
 g.position.y=y0;ktower.add(g);g.visible=false;return g;})();
const SPCLOUD=[...Array(9)].map((_,k)=>{const c=new THREE.Group();for(let j=0;j<4;j++){const s=new THREE.Mesh(new THREE.SphereGeometry(7+j*1.5,10,8),new THREE.MeshStandardMaterial({color:'#ffffff',transparent:true,opacity:.6}));s.position.set(j*7-10,Math.sin(j)*2,(j%2)*4);c.add(s);}
 const a=k/9*Math.PI*2;c.userData.a=a;scene.add(c);c.visible=false;return c;});

// ---------- 🛳️ MILO: his TITANIC — four funnels, sailing past the new islands (no icebergs!)
const TITAN=(()=>{const s=new THREE.Group();const L0=96;const blkH=std('#1d232b'),red=std('#b3262e'),wht=std('#fbfbfb'),buf=std('#e0b040');
 s.add(box(L0,8,13,blkH,0,1.8,0));s.add(box(L0+.1,2.4,13.1,red,0,-1.6,0));s.add(box(L0+.2,.5,13.2,wht,0,5.6,0));
 const bw=new THREE.Mesh(new THREE.CylinderGeometry(0,6.5,10,4,1),blkH);bw.rotation.z=-Math.PI/2;bw.rotation.x=Math.PI/4;bw.scale.set(1,1,.98);bw.position.set(L0/2+4.6,1.8,0);s.add(bw);
 s.add(box(L0-26,3.4,11.6,wht,-4,7.6,0));s.add(box(L0-40,3,10.6,wht,-4,10.8,0));for(const z of [1,-1])for(let k=0;k<26;k++)s.add(box(1,.8,.06,emis('#ffe9a8',.4),-38+k*2.8,7.8,z*5.83));
 for(const z of [1,-1])for(let k=0;k<40;k++)s.add(box(.7,.7,.06,std('#f7f2e0'),-45+k*2.3,3.6,z*6.53));
 const fun=[];for(let k=0;k<4;k++){const f=new THREE.Group();f.add(cyl(2.2,2.4,11,buf,0,5.5,0,16));f.add(cyl(2.25,2.25,2,blkH,0,10.4,0,16));f.position.set(22-k*14,12.3,0);f.rotation.z=.12;s.add(f);fun.push(f);}
 for(const x of [-L0/2+6,L0/2-8])s.add(cyl(.25,.25,22,MT.wood,x,17,0,6));
 for(const z of [1,-1]){const ns=sign('TITANIC','#1d232b','#f2c230',12,1.8);ns.position.set(L0/2-8,2.6,z*6.58);if(z<0)ns.rotation.y=Math.PI;s.add(ns);}
 const wk=[];for(let k=0;k<8;k++){const f=new THREE.Mesh(new THREE.BoxGeometry(3,.2,3),new THREE.MeshBasicMaterial({color:'#ffffff',transparent:true,opacity:.6}));s.add(f);wk.push(f);}s.userData.wk=wk;
 const smoke=[];for(let k=0;k<16;k++){const p=new THREE.Mesh(new THREE.IcosahedronGeometry(1.6,0),new THREE.MeshStandardMaterial({color:'#8d8d8d',transparent:true,opacity:.7}));s.add(p);smoke.push(p);}s.userData.smoke=smoke;s.userData.fun=fun;
 const mp=pawn('#e8334f',1.4);mp.position.set(L0/2-10,5.9,0);s.add(mp);s.userData.milo=mp;
 const pax=[];for(let k=0;k<8;k++){const p=pawn(['#30c2a8','#9b59d6','#f2d33a','#3e8fe6'][k%4],1);p.position.set(-30+k*7,9.3,(k%2?1:-1)*4.6);s.add(p);pax.push(p);}s.userData.pax=pax;
 s.traverse(q=>{if(q.isMesh)q.castShadow=true;});s.scale.setScalar(.7);s.visible=false;scene.add(s);return s;})();
const TV=-462;
const titU=t=>-150+(t-40)*7.2;
const titAt=t=>{const u=titU(t);const p=LW(u,TV),q=LW(u+1,TV);return {p:v3(p.x,SEA+1.2,p.y),d:v3(q.x-p.x,0,q.y-p.y).normalize()};};
const BERG=[[-40,-520],[160,-540]].map(([u,v])=>{const g=new THREE.Group();const m=new THREE.Mesh(new THREE.IcosahedronGeometry(9,0),std('#f4fbff',{flatShading:true}));m.scale.y=.8;g.add(m);
 const p=LW(u,v);g.position.set(p.x,SEA,p.y);g.visible=false;scene.add(g);return g;});

// ---------- timeline: design time = the voice take's time (line starts from the transcript)
const TD=[0,5.25,11.87,17.31,24.01,31.13,35.87,41.65,44.93,48.15,52.71,58.09,67.36];
const DUR=TD[TD.length-1];
const TR=window.DAY12_TR||TD, RDUR=TR[TR.length-1];
const pw=(x,A,B)=>{for(let i=0;i<A.length-1;i++)if(x<=A[i+1]||i==A.length-2)return B[i]+(B[i+1]-B[i])*clamp((x-A[i])/(A[i+1]-A[i]));};
const toD=tr=>pw(tr,TR,TD), toR=td=>pw(td,TD,TR);
const isleCam3=(i,R=1)=>({p:[IL3(i,-24*R,30*R,92*R),IL3(i,-10*R,25*R,80*R)],l:[IL3(i,0,5*R,0),IL3(i,0,5*R,0)],f:50});
// island beats: island rises, then its buildings pop in
AIR.t=17.5;CASI.t=33.0;MALL.t=41.8;DRE.t=45.1;CHOC.t=48.35;ISL12.forEach(o=>{o.tb=o.t+.6;});
const CAST_GO=32.0;
const SH=[
 {t0:0,t1:5.25, p:[L(320,-650,330),L(-320,-650,330)], l:[L(150,-280,0),L(-150,-280,0)], f:50},
 {t0:5.25,t1:11.87, space:true, f:46},
 {t0:11.87,t1:17.31, under:true, f:52},
 {t0:17.31,t1:24.01, air:true, f:50},
 {t0:24.01,t1:31.13, atc:true, f:44},
 {t0:31.13,t1:32.9, oldc:true, f:50},
 Object.assign({t0:32.9,t1:35.87},isleCam3(1,1.15)),
 {t0:35.87,t1:41.65, spire:true, f:50},
 Object.assign({t0:41.65,t1:44.93},isleCam3(2,1.15)),
 {t0:44.93,t1:48.15, p:[IL3(3,-18,14,52),IL3(3,-8,11,44)], l:[IL3(3,0,7,-2),IL3(3,0,7,-2)], f:50},
 Object.assign({t0:48.15,t1:52.71},isleCam3(4,1.0)),
 {t0:52.71,t1:58.09, titan:true, f:50},
 {t0:58.09,t1:DUR, p:[L(0,-720,390),L(0,-780,470)], l:[L(0,-280,0),L(0,-280,0)], f:50},
];
SH[10].l=[IL3(4,0,7,-2),IL3(4,0,7,-2)];
const caps=[['c1',.2,5.25,TXT.d0],['c2',2.6,5.25,TXT.d0b],['c1',5.25,11.87,TXT.d1],['c2',8.4,11.87,TXT.d1b],['c1',11.87,17.31,TXT.d2],['c1',17.31,24.01,TXT.d3],
 ['c1',24.01,31.13,TXT.d4],['c2',27.4,31.13,TXT.d4b],['c1',31.13,35.87,TXT.d5],['c1',35.87,41.65,TXT.d6],['c1',41.65,44.93,TXT.d7],['c1',44.93,48.15,TXT.d8],['c2',46.4,48.15,TXT.d8b],
 ['c1',48.15,52.71,TXT.d9],['c1',52.71,58.09,TXT.d10],['c2',55.6,58.09,TXT.d10b],['c1',58.09,DUR,TXT.d11],['c2',63.4,DUR,TXT.d11b]];
const TAGS=[
 ['🛰️ SPACE STATION','@official_d4sh · Antarctic Airlines',()=>STN.localToWorld(v3(0,12,0)),6.2,11.87],
 ['🐠 UNDERWATER CITY','RDA (as BA Europe)',()=>UWW(0,FLOOR-SEA+30,0),14.6,17.31],
 ['✈️ RDA NORTH PACIFIC AIRWAYS','RDA (as BA Europe)',()=>wp12(AIR.jets[0]).add(v3(0,6,0)),18.6,24.01],
 ['🎧 AIR TRAFFIC CONTROL','@rainbowpopsicle1777',()=>wp12(AIR.who).add(v3(0,4.2,0)),24.8,31.13],
 ['👑 KING OF HIS OWN ISLAND','egyptian mapper',()=>wp12(CASI.who).add(v3(0,4,0)),33.8,35.87],
 ['🗼 +600 m SPIRE','neck hurts',()=>SPIRE.localToWorld(v3(0,SPIRE.userData.H+6,0)),38.6,41.65],
 ['🛍️ HERBERG MALL','Online_Stranger',()=>wp12(MALL.who).add(v3(0,4,0)),42.6,44.93],
 ["🏠 DRE'S HOUSE",'D🙊 · dre._.dean',()=>wp12(DRE.who).add(v3(0,4,0)),45.6,48.15],
 ['🍫 CHOCOLATE FACTORY','United Union',()=>wp12(CHOC.who).add(v3(0,4.6,0)),49.0,52.71],
 ['🛳️ TITANIC','★»MILO★«',()=>wp12(TITAN.userData.milo).add(v3(0,4,0)),53.6,58.09],
];
$('tags').innerHTML=TAGS.map(t=>`<div class="ntag"><div class="tt">${t[0]}</div><div class="ts">${t[1]}</div></div>`).join('');
const CUTS_D=SH.map(s=>s.t0);
window.CAPTION_TIMES=[...new Set(caps.map(c=>c[1]))].concat(TAGS.map(t=>t[3]),ISL12.map(o=>o.t),ISL12.map(o=>o.tb),[.8,1.6,6.0,13.2,19.0,28.6,32.0,36.6,46.0,58.8,59.6,63.4,64.4]).map(toR);
window.CUTS=CUTS_D.map(toR);
window.BOOMS=[toR(CAST_GO)];
function popAt(el,t,a,b,{inDur=.28,outDur=.15}={}){
 if(t<a||t>b){el.style.opacity=0;return 0;}
 const k=clamp((t-a)/inDur), ko=clamp((b-t)/outDur);const s= k<1 ? (k<.6? .55+.6*(k/.6) : 1.15-.15*((k-.6)/.4)) : 1;
 el.style.opacity=Math.min(k*2,ko,1); el.style.transform=(el.dataset.base||'')+` scale(${s})`; return 1;}
const proj=(v)=>{const p=v.clone().project(camera);return [(p.x+1)/2*1080,(1-p.y)/2*1920,p.z];};
const FOG0=scene.fog.color.clone(),UWC=new THREE.Color('#0d6f9e');
const runway=(o,x,y,z)=>o.ref.localToWorld(v3(x,y+SEA+T10,z));
// a jet's take-off roll along the hub island's runway (local +x), starting at design time t0
function takeoff(j,t,t0){const tt=t-t0;if(tt<0){j.position.set(-28,.2,4);j.rotation.set(0,Math.PI/2,0);return;}
 const x=-28+tt*tt*9;const up=Math.max(0,tt-1.7);j.position.set(x,.2+up*up*7,4);j.rotation.set(0,Math.PI/2,0);j.rotateX(-Math.min(.32,up*.35));}

window.setTime=function(tr){const t=toD(tr);
 const sh=SH.find(s=>t>=s.t0&&t<s.t1)||SH[SH.length-1];
 const k=ease(clamp((t-sh.t0)/(sh.t1-sh.t0)));
 // everything from Days 5 → 11, alive and fully built
 {const TL=t+100;
  (function(t){
//@@LIFE@@
  })(TL);}
 ISL10.forEach(o=>{o.sp.visible=false;});ISL11.forEach(o=>{o.sp.visible=false;});
 const wide=t<5.25||t>=58.09;
 scene.fog.color.copy(FOG0);seaUnder.visible=false;RAYS.forEach(r=>r.visible=false);STARS.material.opacity=0;
 // --- the space station (and the space plane, docked)
 STN.visible=true;STN.userData.ring.rotation.x=t*.25;STN.userData.bl.forEach((b,i)=>b.material.emissiveIntensity=Math.sin(t*4+i)>0?2.2:.2);
 {const a=STN.userData.astro;a.position.set(-10+Math.sin(t*.6)*2,8+Math.sin(t*.9)*1.2,7);a.rotation.set(Math.sin(t*.7)*.4,t*.3,Math.sin(t*.5)*.3);}
 splane.visible=true;{const d=STN_DOCK();splane.position.copy(d);splane.quaternion.copy(STN.quaternion);splane.rotateY(Math.PI/2);splane.userData.fl.forEach(f=>f.visible=false);}
 // --- underwater city life
 UW.visible=true;{const U=UW.userData;U.fish.forEach(f=>{const {k:i,r,h,sp,dir,tl}=f.userData;const a=t*sp*dir+i;f.position.set(Math.cos(a)*r,h+Math.sin(t+i)*1.5,Math.sin(a)*r);f.rotation.y=-a-(dir>0?Math.PI/2:-Math.PI/2);tl.rotation.y=Math.sin(t*9+i)*.5;});
  const sa=t*.12;U.sub.position.set(Math.cos(sa)*46,FLOOR-SEA+22,Math.sin(sa)*46);U.sub.rotation.y=-sa-Math.PI/2;U.sub.userData.pr.rotation.x=t*8;
  U.kelp.forEach((kp,i)=>{kp.rotation.z=Math.sin(t*1.2+i)*.12;kp.rotation.x=Math.cos(t+i)*.08;});
  U.bub.forEach((b,i)=>{const ph=((t*.18+i/40)%1);const a=i*2.4,r=6+(i*7)%40;b.position.set(Math.cos(a)*r+Math.sin(t+i)*.6,FLOOR-SEA+2+ph*(SEA-FLOOR-2),Math.sin(a)*r);b.visible=ph<.97;});
  const lp=((t*.15)%1);const ly=lp<.5?lp*2:2-lp*2;U.lift.position.set(0,FLOOR-SEA+4+ly*(SEA-FLOOR-30),0);
  U.diver.position.set(-14+Math.sin(t*.4)*6,FLOOR-SEA+14+Math.sin(t*.8)*2,30);U.diver.rotation.set(-1.1,Math.sin(t*.4),0);}
 // --- the new islands
 ISL12.forEach((o,i)=>{const kk=clamp((t-o.t)/.6);o.g.visible=kk>0;if(kk>0){o.g.scale.setScalar(Math.max(.001,backOut(kk)));o.g.position.y=SEA-9+9*ease(kk);}
   const kb=clamp((t-o.tb)/.55);o.bld.visible=kb>0;if(kb>0)o.bld.scale.setScalar(Math.max(.001,backOut(kb)));
   o.sp.material.opacity=1;o.sp.visible=wide&&kk>=1;if(o.who&&o!==AIR)o.who.rotation.y=Math.sin(t*1.2+i)*.6;});
 {const T=AIR.tw.userData;T.rad.rotation.y=t*2.2;T.bcn.material.emissiveIntensity=Math.sin(t*5)>0?2:.2;T.ctl.rotation.y=(sh.atc?(t<28.4?Math.sin(t*1.6)*.35:.5):Math.sin(t*1.2)*.6);
  takeoff(AIR.jets[0],t,19.0);takeoff(AIR.jets[1],t,28.6);if(t<19)AIR.jets[1].position.set(-34,.2,-6);
  AIR.jets[1].visible=t>=22;AIR.jets[0].visible=t<27;}
 RDAJ.forEach((j,i)=>{const ph=((t*.012+i/3)%1);const p=RDA_RT.getPointAt(ph),q=RDA_RT.getPointAt((ph+.003)%1);j.visible=t>=17.6;j.position.copy(p);j.lookAt(q);j.rotateZ(Math.sin(t*.5+i)*.15);
   TRAILS[i].forEach((m,n)=>{const pp=RDA_RT.getPointAt(((ph-.0025*(n+1))%1+1)%1);m.visible=j.visible;m.position.copy(pp);m.scale.setScalar(1+n*.12);m.material.opacity=.45*(1-n/14);});});
 {const o=CASI;o.sub.forEach((p,i)=>{p.position.y=Math.abs(Math.sin(t*5+i))*.4;});if(o.kg){o.kg.rotation.y=Math.sin(t*.8)*.6;}}
 {const o=MALL;o.bal.position.y=11.4+Math.sin(t*1.6)*.5;o.bal.rotation.y=Math.sin(t*.8)*.3;o.sh.forEach((p,i)=>{const a=t*.5*(i%2?1:-1)+i*1.3;p.position.set(Math.cos(a)*10,Math.abs(Math.sin(t*5+i))*.15,5+Math.sin(a)*2.4);p.rotation.y=-a;});}
 {const o=DRE;o.ar.position.y=13+Math.abs(Math.sin(t*4))*2.4;o.ar.rotation.y=t*1.2;o.who.userData.arm.rotation.z=2.6+Math.sin(t*10)*.4;o.dog.position.y=Math.abs(Math.sin(t*6))*.3;}
 {const o=CHOC;o.puff.forEach((p,i)=>{const ph=((t*.4+i/9)%1);const x=[-10,-3,4][i%3];p.position.set(x+ph*2,21+ph*9,-12);p.scale.setScalar(.8+ph*2);p.material.opacity=.8*(1-ph);});
  o.ripple.forEach((r,i)=>{const ph=((t*.8+i/6)%1);r.position.set(7,.45,-2.6);r.scale.setScalar(.6+ph*2.6);r.material.opacity=1-ph;r.material.transparent=true;});o.wk.forEach((p,i)=>{p.position.y=Math.abs(Math.sin(t*4+i))*.25;});}
 // --- the castle leaves the main island (puffs), and pops up on its own island
 {const kk=clamp((t-CAST_GO)/.5);castle.visible=kk<1;castle.scale.copy(CASS).multiplyScalar(Math.max(.001,1-kk));castle.position.copy(CAS0).add(v3(0,kk*14,0));
  PUFF12.forEach((p,i)=>{const ph=clamp((t-CAST_GO)/1.3);p.visible=ph>0&&ph<1;const a=i/16*Math.PI*2;p.position.copy(CAS0).add(v3(Math.cos(a)*(8+ph*18),castle.userData.top+4+ph*12+Math.sin(i)*3,Math.sin(a)*(8+ph*18)));p.scale.setScalar(.7+ph*1.8);p.material.opacity=.9*(1-ph);});}
 // --- the spire grows on the Kingdom Tower
 {const kk=clamp((t-36.6)/1.9);SPIRE.visible=kk>0;SPIRE.scale.set(1,Math.max(.001,ease(kk)),1);SPIRE.userData.tip.material.emissiveIntensity=Math.sin(t*5)>0?2.4:.4;
  const top=SPIRE.localToWorld(v3(0,SPIRE.userData.H*.82,0));SPCLOUD.forEach((c,i)=>{c.visible=sh.spire||wide;const a=c.userData.a+t*.05;c.position.set(top.x+Math.cos(a)*44,top.y-30+Math.sin(i*2)*5,top.z+Math.sin(a)*36);});}
 // --- the Titanic
 {const R=titAt(t);TITAN.visible=t>=40;TITAN.position.copy(R.p).add(v3(0,Math.sin(t*1.1)*.15,0));TITAN.lookAt(TITAN.position.clone().add(R.d));TITAN.rotateY(-Math.PI/2);
  const U=TITAN.userData;U.wk.forEach((f,j)=>{const ph=((t*1.3+j/8)%1);f.position.set(-50-ph*16,-1.6,(j%2?1:-1)*(2+ph*5));f.scale.setScalar(1+ph*1.6);f.material.opacity=.55*(1-ph);});
  U.smoke.forEach((p,i)=>{const fn=U.fun[i%4];const ph=((t*.5+i/16)%1);p.position.set(fn.position.x-ph*14,fn.position.y+11+ph*10,0);p.scale.setScalar(.7+ph*2.2);p.material.opacity=.7*(1-ph);});
  U.milo.rotation.y=Math.sin(t*1.4)*.6;U.pax.forEach((p,i)=>{p.position.y=9.3+Math.abs(Math.sin(t*4+i))*.2;});
  BERG.forEach(b=>b.visible=false);}

 // --- camera
 if(sh.space){const sk=1;scene.background.copy(SKY1);STARS.material.opacity=1;scene.fog.near=6000;scene.fog.far=12000;
   const c=STN.localToWorld(v3(-150+190*k,46-16*k,200-50*k));camera.position.copy(c);camera.lookAt(STN.localToWorld(v3(4*k,2,0)));}
 else if(sh.under){const dk=clamp((t-13.1)/1.0);
   if(t<13.1){const kk=ease(clamp((t-11.87)/1.23));camera.position.copy(UWW(0,40-14*kk,62-22*kk));camera.lookAt(UWW(0,0,0));}
   else {const gk=ease(clamp((t-14.1)/3.2));const y=dk<1?26-dk*(26+36):-36-gk*6;const a=-.4+gk*1.1;
     camera.position.copy(UWW(Math.sin(a)*70*(dk<1?.57+.43*dk:1),y,Math.cos(a)*70*(dk<1?.57+.43*dk:1)));camera.lookAt(UWW(0,dk<1?-20*dk:FLOOR-SEA+12,0));}
   if(camera.position.y<SEA){scene.background.copy(UWC);scene.fog.color.copy(UWC);scene.fog.near=20;scene.fog.far=230;seaUnder.visible=true;
     RAYS.forEach((r,i)=>{r.visible=true;const p=UWW(-40+i*9,-30,-10+(i%3)*14);r.position.copy(p);r.rotation.set(.2,0,.15*Math.sin(i));r.material.opacity=.08+.05*Math.sin(t*2+i);});}}
 else if(sh.air){const c=IL3(0,-20-30*k,26+6*k,96-10*k);camera.position.copy(c);camera.lookAt(t<19?IL3(0,-6,4,0):wp12(AIR.jets[0]).lerp(IL3(0,0,4,0),.8));}
 else if(sh.atc){const T=AIR.tw;const cp=T.localToWorld(v3(-2.6+1.6*k,28.6,8.4-1.4*k));const B=AIR.bld;B.updateMatrixWorld(true);const ctlW=AIR.who.getWorldPosition(v3(0,0,0)).add(v3(0,1.4,0));
   camera.position.copy(cp);const L2=t<28.4?ctlW:ctlW.clone().lerp(wp12(AIR.jets[1]),ease(clamp((t-28.4)/1.4))*.2);camera.lookAt(L2);}
 else if(sh.oldc){const c=CAS0.clone();const a=LW(78,112),b=LW(78,96);const d=v3(b.x-a.x,0,b.y-a.y).normalize();const side=v3(-d.z,0,d.x);
   camera.position.copy(c).addScaledVector(d,70+10*k).addScaledVector(side,26-10*k).add(v3(0,38,0));camera.lookAt(c.clone().add(v3(0,castle.userData.top+6,0)));}
 else if(sh.spire){const base=wp12(ktower);const tk=ease(clamp((t-36.2)/2.6));const dir=ktower.localToWorld(v3(0,0,1)).sub(ktower.position).normalize();const side=v3(-dir.z,0,dir.x);
   camera.position.copy(base).addScaledVector(dir,200+230*tk).addScaledVector(side,70-30*k).add(v3(0,50+70*tk,0));camera.lookAt(base.clone().add(v3(0,70+110*tk,0)));}
 else if(sh.titan){const R=titAt(t);const side=v3(-R.d.z,0,R.d.x);camera.position.copy(R.p).addScaledVector(R.d,50-60*k).addScaledVector(side,-78).add(v3(0,30-6*k,0));camera.lookAt(R.p.clone().addScaledVector(R.d,10).add(v3(0,8,0)));}
 else {camera.position.lerpVectors(sh.p[0],sh.p[1],k);camera.lookAt(new THREE.Vector3().lerpVectors(sh.l[0],sh.l[1],k));}
 if(!sh.space&&!(sh.under&&camera.position.y<SEA)){scene.background.copy(SKY0);}
 camera.fov=sh.f||46;camera.near=sh.atc?.3:.5;camera.updateProjectionMatrix();
 STARS.position.copy(camera.position);
 renderer.render(scene,camera);

 // ---------- UI ----------
 const used={c1:false,c2:false};
 for(const [id,a,b,txt] of caps){ if(t>=a&&t<=b){const el=$(id); if(el.dataset.txt!==txt){el.innerHTML=txt;el.dataset.txt=txt;} popAt(el,t,a,b); used[id]=true; } }
 for(const id in used) if(!used[id]) $(id).style.opacity=0;
 $('popn').textContent=(1467).toLocaleString('en-US');
 if(t<30){ $('t_vA').textContent=TXT.oA; $('t_vB').textContent=TXT.oB; popAt($('votes'),t,.5,2.55); const kk=clamp((t-.8)/1.0); $('barA').style.width=(50*kk)+'%'; $('barB').style.width=(50*kk)+'%'; $('nA').textContent=kk>.5?'1':''; $('nB').textContent=kk>.5?'1':''; }
 else { $('t_vA').textContent=TXT.vA; $('t_vB').textContent=TXT.vB; popAt($('votes'),t,58.8,63.2); $('barA').style.width='0%'; $('barB').style.width='0%'; $('nA').textContent='?'; $('nB').textContent='?'; }
 [...$('goals').children].forEach(el=>popAt(el,t,99,0));
 [...$('tags').children].forEach((el,i)=>{const [_,__,pf,a,b]=TAGS[i];const pp=proj(pf());el.dataset.base='translate(-50%,-100%)';const hw=el.offsetWidth/2+24;el.style.left=Math.min(1080-hw,Math.max(hw,pp[0]))+'px';el.style.top=Math.max(560+el.offsetHeight+18,pp[1])+'px';popAt(el,t,a,b);if(pp[2]>1)el.style.opacity=0;});
 [...$('laws').children].forEach((c,i)=>popAt(c,t,63.4+i*1.0,DUR));
 let fl=0; for(const c of window.CUTS){ if(c>0&&tr>=c&&tr<c+.12) fl=.5*(1-(tr-c)/.12);} $('flash').style.opacity=fl;
};
window.DUR=RDUR; window.__T2={camera,renderer,scene,L,LW};
document.fonts.ready.then(()=>{window.setTime(0);window.READY=true;});
