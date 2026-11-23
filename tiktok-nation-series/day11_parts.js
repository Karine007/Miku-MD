// ===== DAY 11: boats won → the Herusie Ship cruise route, 9 new islands for the commenters, D4SH's space plane, Day 12 vote =====
// (make_day11.py prepends the Day 5 → Day 10 builds, all already standing)
ISL10.forEach(o=>{o.g.visible=true;o.bld.visible=true;});
const ISL11=[];
function makeIsle11(u,v,r,name,top){const g=new THREE.Group();g.add(cyl(r,r+4,6,sandM,0,-1,0,30));g.add(cyl(r-4,r-1.5,2.4,top||grassM,0,2.3,0,28));
 const bld=new THREE.Group();bld.position.y=T10;g.add(bld);const sp=label10(name);sp.position.set(0,52,0);g.add(sp);
 const p=LW(u,v);g.position.set(p.x,SEA,p.y);g.rotation.y=FACE;g.visible=false;scene.add(g);
 const ref=new THREE.Object3D();ref.position.copy(g.position);ref.rotation.copy(g.rotation);ref.updateMatrixWorld(true);
 const o={g,bld,sp,ref,r,u,v};ISL11.push(o);return o;}
const IL2=(i,x,y,z)=>ISL11[i].ref.localToWorld(v3(x,y+SEA,z));
const choc=std('#5a3420'),dough=std('#d39a55'),icing=std('#fff7ee'),cream=std('#fff1d6'),pinkF=std('#ff9ec4'),cherry=std('#e0203a',{roughness:.3});
function car11(c){const g=new THREE.Group();const m=std(c);g.add(box(2,.8,4,m,0,.7,0));g.add(box(1.7,.7,2,m,0,1.4,-.2));g.add(box(1.72,.5,1.6,MT.glass,0,1.45,-.2));
 for(const x of [-1,1])for(const z of [-1.3,1.3]){const w=cyl(.4,.4,.3,blk,x,.4,z,10);w.rotation.z=Math.PI/2;g.add(w);}g.traverse(o=>o.castShadow=true);return g;}
function cruise11(name,col){const sh=new THREE.Group();const L0=58;sh.add(box(L0,6,10,std('#ffffff'),0,1,0));sh.add(box(L0+.1,1.2,10.1,std(col),0,-1.2,0));
 const bw=new THREE.Mesh(new THREE.ConeGeometry(5,8,4),std('#ffffff'));bw.rotation.z=-Math.PI/2;bw.rotation.x=Math.PI/4;bw.position.set(L0/2+3.6,1.4,0);sh.add(bw);
 for(let d=0;d<4;d++){const w=L0-8-d*8;sh.add(box(w,2.4,9-d*.8,std('#fbfbfb'),-3-d*1.5,5.2+d*2.4,0));for(const z of [1,-1])sh.add(box(w-1,.7,.06,std('#2d5f80',{roughness:.15}),-3-d*1.5,5.3+d*2.4,z*(4.5-d*.4+.03)));}
 for(const x of [-10,-2])sh.add(box(3.4,4.6,3.2,std('#9b59d6'),x,16.8,0));
 for(const z of [1,-1]){const cs=sign(name,col,'#ffffff',16,1.8);cs.position.set(6,2.2,z*5.06);if(z<0)cs.rotation.y=Math.PI;sh.add(cs);}
 const wk=[];for(let k=0;k<6;k++){const f=new THREE.Mesh(new THREE.BoxGeometry(3,.2,3),new THREE.MeshBasicMaterial({color:'#ffffff',transparent:true,opacity:.6}));sh.add(f);wk.push(f);}sh.userData.wk=wk;
 sh.traverse(q=>{if(q.isMesh)q.castShadow=true;});scene.add(sh);return sh;}

// ---------- 🛳️ CHILL: one main way to get around — the HERUSIE SHIP, main island ↔ every island
const RPTS=[[47,-98],[47,-172],[225,-172],[225,-257],[-225,-257],[-225,-172],[-47,-172],[-47,-98]];
const RCV=new THREE.CatmullRomCurve3(RPTS.map(([u,v])=>v3(u,0,v)),true,'catmullrom',.15);

const routeAt=ph=>{const a=RCV.getPointAt(((ph%1)+1)%1),b=RCV.getPointAt((((ph+.002)%1)+1)%1);const p=LW(a.x,a.z),q=LW(b.x,b.z);return {p:v3(p.x,SEA,p.y),d:v3(q.x-p.x,0,q.y-p.y).normalize()};};
const DASH=[];{const N=300;for(let k=0;k<N;k++){const r=routeAt(k/N);const m=box(3,.12,.7,std('#ffffff'),0,0,0);m.position.copy(r.p).add(v3(0,.08,0));m.lookAt(r.p.clone().add(r.d).add(v3(0,.08,0)));m.rotateY(Math.PI/2);m.visible=false;scene.add(m);DASH.push(m);}}
const SHIPS=[cruise11('HERUSIE SHIP','#6a3fb5'),cruise11('HERUSIE SHIP','#6a3fb5')];SHIPS.forEach(s=>{s.scale.setScalar(.55);s.visible=false;});
const PIERS=[];for(const u of [-47,47]){const g=new THREE.Group();g.add(box(16,1,7,MT.stone,0,.3,0));const s=sign('HERUSIE TERMINAL','#6a3fb5','#ffffff',12,1.6);s.position.set(0,3,0);g.add(s);g.add(box(.3,2.2,.3,MT.dark,-5.5,1.6,0));g.add(box(.3,2.2,.3,MT.dark,5.5,1.6,0));
 const p=LW(u,-90);g.position.set(p.x,SEA,p.y);g.rotation.y=FACE;g.visible=false;scene.add(g);PIERS.push(g);}
const SPD=1/70, shipPh=(i,t)=>(t*SPD+.43+i*.5);
const chillP=pawn('#9b59d6',1.2);chillP.visible=false;scene.add(chillP);

// ---------- island 0: SARUUL (saruulka_777) — a cookie island
{const o=makeIsle11(-180,-300,28,'saruulka_777',dough);const b=o.bld;
 const ck=(r,x,y,z,rx,ry)=>{const g=new THREE.Group();g.add(cyl(r,r,r*.22,std('#c98b45'),0,0,0,22));for(let k=0;k<9;k++){const a=k*2.4,rr=r*.25+(k%3)*r*.22;g.add(box(r*.16,r*.25,r*.16,choc,Math.cos(a)*rr,0,Math.sin(a)*rr));}
  g.position.set(x,y,z);g.rotation.set(rx,ry,0);b.add(g);return g;};
 const big=ck(9,-8,9.4,-8,Math.PI/2-.15,.3);o.big=big;ck(6,9,6.4,-12,Math.PI/2-.1,-.4);ck(4,16,.5,4,0,0);ck(3.4,-16,.4,8,0,1);ck(5,0,.6,-1,0,0);
 const gl=new THREE.Group();gl.add(cyl(4,3.6,12,new THREE.MeshStandardMaterial({color:'#dff3ff',transparent:true,opacity:.35,roughness:.05}),0,6,0,20));gl.add(cyl(3.7,3.4,10,std('#ffffff'),0,5.1,0,20));gl.position.set(14,0,-2);b.add(gl);
 const hs=new THREE.Group();hs.add(box(8,5,6,std('#a8642e'),0,2.5,0));hs.add(roof4(10,4,std('#7a431c'),7,8));for(const x of [-4,4])hs.add(box(.4,5.2,6.2,icing,x,2.6,0));hs.add(box(8.2,.4,6.2,icing,0,5,0));
 hs.add(box(1.6,2.4,.1,std('#e8334f'),0,1.2,3.05));for(const x of [-2.6,2.6])hs.add(box(1.4,1.2,.1,std('#ffe9a8'),x,3,3.05));hs.position.set(-6,0,8);b.add(hs);
 for(let k=0;k<26;k++){const a=k*2.399,r=6+(k*7)%18;b.add(box(.9,.6,.9,choc,Math.cos(a)*r,.3,Math.sin(a)*r));}
 const sp=pawn('#ff8fb1',1.2);sp.position.set(4,0,12);b.add(sp);o.who=sp;
 const s=sign('COOKIE ISLAND','#7a431c','#ffe9a8',9,1.4);s.position.set(0,1.4,o.r-4.8);b.add(s);}

// ---------- island 1: PHENOMENON (nomephenon) — an island made of cake
{const o=makeIsle11(-90,-300,28,'Phenomenon',pinkF);const b=o.bld;
 const T=[[15,5,cream],[11,5,pinkF],[7,5,icing]];let y=0;const cake=new THREE.Group();
 T.forEach(([r,h,m],i)=>{cake.add(cyl(r,r,h,m,0,y+h/2,0,32));for(let k=0;k<Math.round(r*1.6);k++){const a=k/Math.round(r*1.6)*Math.PI*2;const d=new THREE.Mesh(new THREE.SphereGeometry(.9,8,6),i==1?icing:pinkF);d.position.set(Math.cos(a)*r,y+h-.2,Math.sin(a)*r);d.scale.y=1.6;cake.add(d);}y+=h;});
 const fl=[];for(let k=0;k<7;k++){const a=k/7*Math.PI*2;const cx=Math.cos(a)*4.4,cz=Math.sin(a)*4.4;cake.add(cyl(.25,.25,2.4,[MT.blue,std('#f2c230'),std('#30c2a8')][k%3],cx,y+1.2,cz,8));
  const f=new THREE.Mesh(new THREE.ConeGeometry(.3,.8,8),std('#ffb12a',{emissive:'#ff8a00',emissiveIntensity:1.6}));f.position.set(cx,y+2.8,cz);cake.add(f);fl.push(f);}o.fl=fl;
 for(let k=0;k<8;k++){const a=k/8*Math.PI*2+.2;const c=new THREE.Mesh(new THREE.SphereGeometry(.9,10,8),cherry);c.position.set(Math.cos(a)*9,10.6,Math.sin(a)*9);cake.add(c);}
 cake.position.set(0,0,-4);b.add(cake);o.cake=cake;
 const SPR=[std('#f2c230'),std('#2f7de1'),std('#30c2a8'),std('#e8334f'),std('#ffffff')];for(let k=0;k<60;k++){const a=k*2.399,r=4+(k*11)%22;const s=box(.9,.25,.25,SPR[k%5],Math.cos(a)*r,.15,Math.sin(a)*r);s.rotation.y=k;b.add(s);}
 for(const [x,z] of [[-17,8],[17,8],[0,16],[-19,-6],[19,-8]]){const cc=new THREE.Group();cc.add(cyl(1.6,1.2,1.8,std('#f2a33a'),0,.9,0,12));const t=new THREE.Mesh(new THREE.SphereGeometry(1.8,12,8),pinkF);t.position.y=2.1;t.scale.y=.8;cc.add(t);const ch=new THREE.Mesh(new THREE.SphereGeometry(.45,8,6),cherry);ch.position.y=3.6;cc.add(ch);cc.position.set(x,0,z);b.add(cc);}
 const ph=pawn('#2f7de1',1.2);ph.add(new THREE.Mesh(new THREE.ConeGeometry(.35,.9,10),std('#f2c230')).translateY(2.2));ph.position.set(-6,0,12);b.add(ph);o.who=ph;
 const s=sign('CAKE ISLAND','#ff6fa8','#ffffff',8,1.3);s.position.set(0,1.4,o.r-4.8);b.add(s);}

// ---------- island 2: FRINZ (frinz644) — a village, with Frinz as the king
{const o=makeIsle11(0,-300,32,'frinz',std('#86cf5e'));const b=o.bld;
 const ca=new THREE.Group();ca.add(box(12,9,10,stone10,0,4.5,0));for(const [x,z] of [[-6,-5],[6,-5],[-6,5],[6,5]]){ca.add(cyl(2,2,13,stone10,x,6.5,z,12));const c=new THREE.Mesh(new THREE.ConeGeometry(2.5,4,12),std('#2f5fb5'));c.position.set(x,15,z);ca.add(c);}
 for(let k=0;k<6;k++)ca.add(box(1.2,1,1.2,stone10,-5+k*2,9.5,5));ca.add(box(3,5,.2,std('#5a3a1f'),0,2.5,5.05));const bn=sign('KING FRINZ','#2f5fb5','#f2c230',6,1.2);bn.position.set(0,7,5.12);ca.add(bn);
 flagPole(ca,0,9,0,1.6);ca.position.set(0,0,-10);b.add(ca);
 const th=new THREE.Group();th.add(box(3,.8,2.6,gold10,0,.4,0));th.add(box(3,4.2,.6,gold10,0,2.5,-1.1));th.add(box(2.4,.4,2,std('#c0392b'),0,.95,0));th.position.set(0,0,3);b.add(th);
 const kg=pawn('#8e44ad',1.5);const cr=cyl(.36,.36,.36,gold10,0,1.98,0,10);kg.add(cr);for(let k=0;k<5;k++){const a=k/5*Math.PI*2;const s=new THREE.Mesh(new THREE.ConeGeometry(.1,.3,4),gold10);s.position.set(Math.cos(a)*.3,2.3,Math.sin(a)*.3);kg.add(s);}
 kg.add(box(.9,.1,.5,std('#c0392b'),0,1.2,-.25));kg.position.set(0,1,3.2);b.add(kg);o.who=kg;
 const C=['#f4ead2','#ffd9b8','#e9f0f5','#e2c9a0','#d9e6ef'];[[-20,-2],[-16,9],[-8,17],[8,17],[16,9],[20,-2],[-18,-14],[18,-14]].forEach(([x,z],i)=>{const h=homeModel(5,4.6,4,std(C[i%5]),i%2?terra:std('#8a5a33'),i);h.position.set(x,0,z);h.rotation.y=Math.atan2(-x,3-z);b.add(h);});
 const vl=[];for(let k=0;k<8;k++){const a=k/8*Math.PI*.9+Math.PI*.05;const p=pawn(['#30c2a8','#e85d75','#f2d33a','#3e8fe6'][k%4],1);p.position.set(Math.cos(a)*7,0,3+Math.sin(a)*7);b.add(p);vl.push(p);}o.vl=vl;
 const s=sign('KINGDOM OF FRINZ','#2f5fb5','#f2c230',10,1.4);s.position.set(0,1.4,o.r-4.8);b.add(s);}

// ---------- island 3: YTHAN (kytrie_47) — a farm and a modern house
{const o=makeIsle11(90,-300,28,'Y T H A N',std('#8ccf5e'));const b=o.bld;
 for(let k=0;k<7;k++)b.add(box(20,.4,2,k%2?std('#e6c34a'):std('#4f9e3a'),-6,.2,-16+k*3));
 const tc=new THREE.Group();tc.add(box(2.4,1.6,3.6,std('#2f9e3a'),0,1.4,0));tc.add(box(2,1.6,1.6,std('#2f9e3a'),0,3,-.8));tc.add(box(1.9,1.3,1.5,MT.glass,0,3.1,-.8));
 for(const x of [-1.4,1.4]){const w=cyl(1.1,1.1,.6,blk,x,1.1,-1,12);w.rotation.z=Math.PI/2;tc.add(w);const w2=cyl(.7,.7,.5,blk,x,.7,1.3,12);w2.rotation.z=Math.PI/2;tc.add(w2);}tc.add(cyl(.12,.12,1.4,MT.dark,.6,3,1,6));tc.traverse(q=>q.castShadow=true);b.add(tc);o.tr=tc;
 const mh=new THREE.Group();mh.add(box(12,4,8,whiteM,0,2,0));mh.add(box(9,3.6,7,std('#2b2f36'),2,5.8,-.6));mh.add(box(12.6,.4,8.6,std('#2b2f36'),0,4.1,0));mh.add(box(9.6,.4,7.6,whiteM,2,7.8,-.6));
 mh.add(box(10,3,.08,MT.glass,-.5,2,4.04));mh.add(box(7.6,2.6,.08,MT.glass,2,5.8,2.94));mh.add(box(7,.15,3.4,std('#3fb6e8',{roughness:.1}),0,.12,6.6));mh.position.set(9,0,4);b.add(mh);
 const bn=new THREE.Group();bn.add(box(7,5,6,std('#c0392b'),0,2.5,0));bn.add(roof4(8,3,std('#5f646b'),6.4,7));bn.position.set(-15,0,6);b.add(bn);
 for(const [x,z] of [[-6,10],[-3,12],[-8,13]]){const s=new THREE.Group();s.add(box(1.4,.8,.7,std('#ffffff'),0,.8,0));s.add(box(.6,.6,.6,std('#ffffff'),.8,1.1,0));s.add(box(.5,.25,.72,blk,-.2,.9,0));s.position.set(x,0,z);s.rotation.y=x;b.add(s);}
 const yp=pawn('#2fa36b',1.2);yp.position.set(3,0,12);b.add(yp);o.who=yp;
 const s=sign("YTHAN'S FARM",'#2f6b3a','#ffffff',8,1.3);s.position.set(0,1.4,o.r-4.8);b.add(s);}

// ---------- island 4: MR. BANANO (mr_banano30) — a shoe store
{const o=makeIsle11(180,-300,28,'Mr;banano',std('#86cf5e'));const b=o.bld;
 const st=new THREE.Group();st.add(box(20,8,11,std('#fff3c4'),0,4,0));st.add(box(20.4,1.2,11.4,std('#f2c230'),0,8.4,0));st.add(box(16,4.8,.08,MT.glass,0,3,5.54));
 const ss=sign('BANANO SHOES','#f2c230','#1d232b',14,2);ss.position.set(0,6.7,5.62);st.add(ss);st.position.set(0,0,-6);b.add(st);
 const sn=new THREE.Group();sn.add(box(14,1.4,6,whiteM,0,.7,0));sn.add(box(10,4,5.4,std('#e8334f'),-1.6,3.4,0));sn.add(box(5,2,5.2,std('#e8334f'),4.6,2.4,0));sn.add(box(3,5.4,5.6,std('#1d232b'),-5.4,4.1,0));
 for(let k=0;k<4;k++)sn.add(box(.3,.25,5.5,whiteM,1+k*1.4,4.6-k*.3,0));sn.add(box(14.2,.3,6.2,std('#2f7de1'),0,.15,0));const sw=box(6,.5,.06,whiteM,0,3,2.74);sw.rotation.z=-.3;sn.add(sw);
 sn.position.set(0,9.6+4,-6);sn.rotation.y=.4;sn.traverse(q=>q.castShadow=true);b.add(sn);o.sn=sn;
 const BC=[std('#e8334f'),std('#2f7de1'),std('#1d232b'),std('#f2c230')];for(let s=0;s<3;s++)for(let k=0;k<4-s;k++)b.add(box(2.4,1.2,1.6,BC[(k+s)%4],-17+k*2.6+s*1.3,.6+s*1.2,6));
 const cu=[];for(let k=0;k<4;k++){const p=pawn(['#30c2a8','#9b59d6','#f2d33a','#e85d75'][k],.9);p.position.set(-6+k*3.4,0,4);b.add(p);cu.push(p);}o.cu=cu;
 const bp=pawn('#f2c230',1.2);bp.position.set(7,0,10);b.add(bp);o.who=bp;
 for(const [x,z] of [[-20,-4],[20,-4],[18,10]]){const p=palm10(.9);p.position.set(x,0,z);b.add(p);}
 const s=sign('SNEAKER HEAVEN','#1d232b','#f2c230',9,1.3);s.position.set(0,1.4,o.r-4.8);b.add(s);}

// ---------- island 5: KOLA (kola2335) — a car company
{const o=makeIsle11(270,-130,28,'Kola',std('#9fbf7a'));const b=o.bld;
 const tr=new THREE.Mesh(new THREE.RingGeometry(15,19.5,48),MT.road);tr.rotation.x=-Math.PI/2;tr.scale.set(1.15,.85,1);tr.position.y=.15;b.add(tr);
 const fc=new THREE.Group();fc.add(box(16,6,9,std('#e9f0f5'),0,3,0));for(let k=0;k<4;k++){const r=new THREE.Mesh(new THREE.CylinderGeometry(2.3,2.3,9.2,3),std('#8f9aa5'));r.rotation.x=Math.PI/2;r.position.set(-6+k*4,6.6,0);fc.add(r);}
 fc.add(cyl(.8,1,12,MT.stone,6,6,-3,10));const ks=sign('KOLA MOTORS','#c0392b','#ffffff',12,1.8);ks.position.set(0,4.3,4.56);fc.add(ks);fc.add(box(4,3,.1,MT.dark,-5,1.5,4.55));fc.position.set(-1,0,-1);b.add(fc);
 const sr=new THREE.Group();sr.add(box(7,3.2,5,MT.glass,0,1.6,0));sr.add(box(7.4,.4,5.4,std('#c0392b'),0,3.3,0));const c1=car11('#c0392b');c1.position.set(0,0,0);c1.rotation.y=Math.PI/2;sr.add(c1);sr.position.set(4,0,8);b.add(sr);
 const cars=[];for(let k=0;k<4;k++){const c=car11(['#c0392b','#2f7de1','#f2c230','#ffffff'][k]);b.add(c);cars.push(c);}o.cars=cars;
 const kp=pawn('#c0392b',1.2);kp.position.set(-6,0,8);b.add(kp);o.who=kp;
 const smk=[];for(let k=0;k<5;k++){const p=new THREE.Mesh(new THREE.IcosahedronGeometry(.9,0),new THREE.MeshStandardMaterial({color:'#d8d8d8',transparent:true,opacity:.7}));b.add(p);smk.push(p);}o.smk=smk;}

// ---------- island 6: BURNER (burneraccount100perc) — "do I have an island?" — you do now!
{const o=makeIsle11(270,-215,28,'burneraccount100perc');const b=o.bld;
 const yd=new THREE.Group();yd.add(box(.6,9,.6,MT.dark,-7,4.5,0));yd.add(box(.6,9,.6,MT.dark,7,4.5,0));const ys=sign('YOU DO NOW! ✅','#2fa36b','#ffffff',16,4);ys.position.set(0,8,0);yd.add(ys);yd.position.set(0,0,-12);b.add(yd);o.yes=ys;
 const h=homeModel(8,7,5,std('#ffd9b8'),std('#3a78c9'),3);h.position.set(-10,0,-1);b.add(h);
 const hm=new THREE.Group();const p1=palm10(1),p2=palm10(1);p1.position.set(-5,0,0);p2.position.set(5,0,0);hm.add(p1,p2);const net=box(9,.15,1.6,std('#f2a33a'),0,2.2,0);hm.add(net);hm.position.set(9,0,4);b.add(hm);o.net=net;
 const hp=pawn('#5f646b',1.1);hp.rotation.z=Math.PI/2;hp.position.set(8.6,2.75,4);b.add(hp);
 const fl=new THREE.Group();fl.add(cyl(.12,.12,8,MT.dark,0,4,0,6));const fs=sign('100%','#e8334f','#ffffff',4,2.4);fs.position.set(2.05,6.6,0);fl.add(fs);fl.position.set(14,0,-8);b.add(fl);o.flag=fs;
 const fire=new THREE.Group();for(let k=0;k<5;k++){const l=box(1.6,.25,.25,MT.wood,0,.15,0);l.rotation.y=k*1.26;fire.add(l);}const ff=new THREE.Mesh(new THREE.ConeGeometry(.6,1.6,7),std('#ff8a2a',{emissive:'#ff6a00',emissiveIntensity:1.4}));ff.position.y=.9;fire.add(ff);fire.position.set(-2,0,10);b.add(fire);o.ff=ff;
 const bp=pawn('#1d232b',1.2);bp.position.set(2,0,11);b.add(bp);o.who=bp;
 for(const [x,z] of [[-19,8],[18,-14],[-18,-12]]){const p=palm10(.9);p.position.set(x,0,z);b.add(p);}
 const s=sign("BURNER'S ISLAND",'#1d232b','#ffffff',9,1.4);s.position.set(0,1.4,o.r-4.8);b.add(s);}

// ---------- island 7: R_YANSKIE (r_yanskie, shared!) — Copenhagen style: Nyhavn canal houses + the Little Mermaid
{const o=makeIsle11(-270,-130,28,'R_yanskie');const b=o.bld;
 b.add(box(8,.25,40,MT.water,0,.15,-2));b.add(box(1,.6,40,MT.stone,-4.4,.3,-2));b.add(box(1,.6,40,MT.stone,4.4,.3,-2));
 const NC=['#f2c230','#e8573f','#2f7de1','#ee8a2a','#3fb5b0','#f4ead2','#c0392b','#f6a6b6'];
 for(const side of [-1,1])for(let k=0;k<6;k++){const H=7+((k*5+(side>0?3:0))%4)*1.4;const c=NC[(k*3+(side>0?1:0))%8];const hg=new THREE.Group();hg.add(box(5,H,4.4,std(c),0,H/2,0));
  const gb=new THREE.Mesh(new THREE.CylinderGeometry(0,3.1,2.6,4,1),std('#5a3a2a'));gb.rotation.y=Math.PI/4;gb.scale.set(1,1,.95);gb.position.y=H+1.3;hg.add(gb);
  for(let f=0;f<Math.floor(H/2.4);f++)for(const x of [-1.3,1.3])hg.add(box(.9,1.2,.08,std('#ffffff'),x,1.6+f*2.4,2.22));
  hg.position.set(side*8.4,0,-18+k*5.6);hg.rotation.y=side>0?-Math.PI/2:Math.PI/2;b.add(hg);}
 const bts=[];for(let k=0;k<3;k++){const bt=new THREE.Group();bt.add(box(1.8,.7,4.4,[std('#ffffff'),std('#2f7de1'),std('#c0392b')][k],0,.3,0));bt.add(cyl(.08,.08,4,MT.wood,0,2.4,0,6));bt.position.set(0,0,-14+k*10);b.add(bt);bts.push(bt);}o.bts=bts;
 const mm=new THREE.Group();const rk=new THREE.Mesh(new THREE.IcosahedronGeometry(2.4,0),stone10);rk.scale.set(1.3,.7,1);rk.position.y=.6;mm.add(rk);const st=pawn('#3f8f6a',1.2);st.position.set(0,1.6,0);mm.add(st);
 const tl=box(1.6,.4,.6,std('#3f8f6a'),.9,2,0);tl.rotation.z=.5;mm.add(tl);mm.position.set(14,0,18);mm.rotation.y=-.6;b.add(mm);
 const df=new THREE.Group();df.add(cyl(.1,.1,7,MT.dark,0,3.5,0,6));const dc=document.createElement('canvas');dc.width=180;dc.height=120;const dx=dc.getContext('2d');dx.fillStyle='#c8102e';dx.fillRect(0,0,180,120);dx.fillStyle='#fff';dx.fillRect(50,0,20,120);dx.fillRect(0,50,180,20);
 const dfl=new THREE.Mesh(new THREE.PlaneGeometry(3,2),new THREE.MeshStandardMaterial({map:new THREE.CanvasTexture(dc),side:THREE.DoubleSide}));dfl.position.set(1.55,6,0);df.add(dfl);df.position.set(-15,0,14);b.add(df);o.dk=dfl;
 const rp=pawn('#c8102e',1.2);rp.position.set(-10,0,16);b.add(rp);o.who=rp;
 const s=sign('LITTLE COPENHAGEN','#c8102e','#ffffff',10,1.4);s.position.set(0,1.4,o.r-3.4);b.add(s);}

// ---------- island 8: RDA (rdanorthpacificairways, shared!) — a resort with overwater villas (+ an RDA seaplane)
{const o=makeIsle11(-270,-215,28,'RDA');const b=o.bld;
 const lb=new THREE.Group();lb.add(box(16,5,7,whiteM,0,2.5,0));lb.add(roof4(19,4,std('#c9a26b'),7,10));lb.add(box(12,2.6,.08,MT.glass,0,2,3.54));lb.position.set(0,0,-12);b.add(lb);
 const rs=sign('RDA RESORT','#0f5c8c','#ffffff',8,1.4);rs.position.set(0,6.2,-6.5);b.add(rs);
 b.add(box(16,.3,8,std('#e8e2d2'),0,.15,0));b.add(box(14,.2,6.4,std('#3fd0e8',{roughness:.1}),0,.26,0));
 for(let k=0;k<4;k++){const l=box(1,.4,2.6,MT.white,-6+k*4,.4,6);b.add(l);}
 b.add(box(2,.4,26,MT.wood,0,-T10+SEA+1.2,o.r+8));
 for(let k=0;k<6;k++){const side=k%2?1:-1,z=o.r+2+Math.floor(k/2)*7;const vh=new THREE.Group();for(const [x,zz] of [[-1.6,-1.6],[1.6,-1.6],[-1.6,1.6],[1.6,1.6]])vh.add(cyl(.18,.18,3,MT.wood,x,-1.5,zz,6));
  vh.add(box(5,.4,5,MT.wood,0,0,0));vh.add(box(4,2.6,4,std('#f4ead2'),0,1.5,0));vh.add(roof4(6,2.4,std('#c9a26b'),4,6));vh.add(box(2.6,.4,1.2,MT.wood,-side*3.3,0,0));
  vh.position.set(side*5.4,-T10+SEA+1.6,z);b.add(vh);}
 const sp=plane('#ffffff','#0f5c8c','RDA');sp.scale.setScalar(.45);for(const x of [-1.8,1.8])sp.add(box(.9,.8,9,std('#e8e2d2'),x,-.4,0));sp.position.set(15,-T10+SEA+.4,o.r+10);sp.rotation.y=.4;b.add(sp);o.sea=sp;
 for(const [x,z] of [[-18,0],[18,-2],[-17,10],[17,12],[-10,-20],[10,-20]]){const p=palm10(1);p.position.set(x,0,z);b.add(p);}
 const gs=[];for(let k=0;k<3;k++){const p=pawn(['#30c2a8','#f2d33a','#e85d75'][k],.9);p.position.set(-4+k*4,-.4,0);b.add(p);gs.push(p);}o.gs=gs;
 const rp=pawn('#0f5c8c',1.2);rp.add(box(.8,.1,.8,std('#ffffff'),0,1.95,0));rp.position.set(-11,0,6);b.add(rp);o.who=rp;}
ISL11.forEach(o=>o.g.traverse(q=>{if(q.isMesh){q.castShadow=true;q.receiveShadow=true;}}));

// ---------- 🚀 D4SH: "can we expand into space?" — Antarctic Airlines' supersonic SPACE PLANE, flown by Lifthansa / PTFS
const splane=(()=>{const g=new THREE.Group();const W=std('#ffffff'),N=std('#1d232b'),B=std('#1b4f9c');
 const f=new THREE.Mesh(new THREE.CapsuleGeometry(1.3,14,8,16),W);f.rotation.x=Math.PI/2;f.position.y=2.4;g.add(f);
 const n=new THREE.Mesh(new THREE.ConeGeometry(1.3,5,16),N);n.rotation.x=Math.PI/2;n.position.set(0,2.4,10.4);g.add(n);
 const sh=new THREE.Shape();sh.moveTo(0,6);sh.lineTo(8,-5);sh.lineTo(-8,-5);sh.lineTo(0,6);const wg=new THREE.Mesh(new THREE.ExtrudeGeometry(sh,{depth:.35,bevelEnabled:false}),W);wg.rotation.x=Math.PI/2;wg.position.set(0,1.8,-1.5);g.add(wg);
 const wb=new THREE.Mesh(new THREE.ExtrudeGeometry(sh,{depth:.37,bevelEnabled:false}),B);wb.rotation.x=Math.PI/2;wb.scale.set(.25,.25,1);wb.position.set(0,1.79,-4);g.add(wb);
 const tf=new THREE.Shape();tf.moveTo(0,0);tf.lineTo(4,0);tf.lineTo(1.2,5);tf.lineTo(0,5);const fin=new THREE.Mesh(new THREE.ExtrudeGeometry(tf,{depth:.3,bevelEnabled:false}),W);fin.rotation.y=Math.PI/2;fin.position.set(-.15,3,-4);g.add(fin);
 const lt=logoTex();for(const s of [1,-1]){const pl=new THREE.Mesh(new THREE.PlaneGeometry(3,3),new THREE.MeshBasicMaterial({map:lt}));pl.position.set(s*.2,5.6,-6.2);pl.rotation.y=s*Math.PI/2;g.add(pl);
  const sg=sign('ANTARCTIC AIRLINES','#ffffff','#1b4f9c',8,1.1);sg.position.set(s*1.32,2.8,2.4);sg.rotation.y=s*Math.PI/2;g.add(sg);}
 for(let k=0;k<5;k++)for(const s of [1,-1])g.add(box(.06,.4,.5,MT.glass,s*1.28,3,6+k*.8));
 const fl=[];for(const x of [-1.6,0,1.6]){g.add(cyl(.7,.6,2,N,x,2,-9,12).rotateX(Math.PI/2));const c=new THREE.Mesh(new THREE.ConeGeometry(.6,4,10),new THREE.MeshBasicMaterial({color:'#ffb347',transparent:true,opacity:.9}));c.rotation.x=-Math.PI/2;c.position.set(x,2,-12);g.add(c);fl.push(c);}g.userData.fl=fl;
 for(const z of [-3,6])g.add(cyl(.15,.15,1.2,MT.dark,0,.6,z,6));g.traverse(o=>o.castShadow=true);scene.add(g);return g;})();
const STARS=(()=>{const N=1400,pos=new Float32Array(N*3);for(let i=0;i<N;i++){const a=Math.random()*Math.PI*2,c=Math.random()*1.6-.3,r=1700;pos[i*3]=Math.cos(a)*Math.cos(c)*r;pos[i*3+1]=Math.sin(c)*r;pos[i*3+2]=Math.sin(a)*Math.cos(c)*r;}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(pos,3));const p=new THREE.Points(g,new THREE.PointsMaterial({color:'#ffffff',size:3.2,sizeAttenuation:false,transparent:true,opacity:0,fog:false,depthWrite:false}));scene.add(p);return p;})();
const SKY0=new THREE.Color('#8fd0ff'),SKY1=new THREE.Color('#070b24');
const RWp=t=>{const tt=t-50.6;const a=clamp(tt/2.2);const x=-24+a*a*46;const up=Math.max(0,tt-1.9);return ISL10[0].ref.localToWorld(v3(x+up*up*9+up*12,T10+.3+up*up*16,-15));};
const RW=t=>{const P=RWp(t);let Q=RWp(t+.04);if(Q.distanceTo(P)<1e-3)Q=ISL10[0].ref.localToWorld(v3(-23,T10+.3,-15));return {P,Q};};

// ---------- timeline (design time)
const TD=[0,5.2,11.4,15.6,19.6,23.8,28.2,32.6,37.0,40.6,45.6,50.0,56.6,65];
const isleCam2=(i)=>{const o=ISL11[i];const R=o.r/28;return {p:[IL2(i,-24*R,34*R,92*R),IL2(i,-10*R,28*R,80*R)],l:[IL2(i,0,7*R,0),IL2(i,0,7*R,0)],f:50};};
const SH=[
 {t0:0,t1:5.2, p:[L(300,-470,330),L(-300,-470,330)], l:[L(150,-200,0),L(-150,-200,0)], f:50},
 {t0:5.2,t1:11.4, ship:true, f:50},
];
for(let i=0;i<9;i++)SH.push(Object.assign({t0:TD[i+2],t1:TD[i+3]},isleCam2(i)));
SH[3].l=[IL2(1,0,9,-3),IL2(1,0,9,-3)];
SH[4].p=[IL2(2,-26,40,100),IL2(2,-12,33,88)];SH[4].l=[IL2(2,0,6,-2),IL2(2,0,6,-2)];
SH[6].p=[IL2(4,-24,40,92),IL2(4,-10,34,80)];SH[6].l=[IL2(4,0,10,-2),IL2(4,0,10,-2)];
SH[10].p=[IL2(8,-30,30,104),IL2(8,-16,26,94)];SH[10].l=[IL2(8,0,2,14),IL2(8,0,2,14)];
SH.push({t0:50,t1:56.6,space:true,f:50});
SH.push({t0:56.6,t1:65, p:[L(0,-560,360),L(0,-610,450)], l:[L(0,-190,0),L(0,-190,0)], f:50});
const DUR=65;
const TR=window.DAY11_TR||TD, RDUR=TR[TR.length-1];
const pw=(x,A,B)=>{for(let i=0;i<A.length-1;i++)if(x<=A[i+1]||i==A.length-2)return B[i]+(B[i+1]-B[i])*clamp((x-A[i])/(A[i+1]-A[i]));};
const toD=tr=>pw(tr,TR,TD), toR=td=>pw(td,TD,TR);
ISL11.forEach((o,i)=>{o.t=TD[i+2]+.15;o.tb=TD[i+2]+.75;});
const caps=[['c1',.2,5.2,TXT.d0],['c2',2.7,5.2,TXT.d0b],['c1',5.2,11.4,TXT.d1],['c1',11.4,15.6,TXT.d2],['c1',15.6,19.6,TXT.d3],['c1',19.6,23.8,TXT.d4],['c1',23.8,28.2,TXT.d5],['c1',28.2,32.6,TXT.d6],
 ['c1',32.6,37,TXT.d7],['c1',37,40.6,TXT.d8],['c2',38.6,40.6,TXT.d8b],['c1',40.6,45.6,TXT.d9],['c1',45.6,50,TXT.d10],['c1',50,56.6,TXT.d11],['c2',53.4,56.6,TXT.d11b],['c1',56.6,DUR,TXT.d12],['c2',61.4,DUR,TXT.d12b]];
const wp=g=>g.getWorldPosition(v3(0,0,0));
const TAGS=[
 ['🛳️ HERUSIE SHIP','@chilllikethatyk',()=>wp(SHIPS[0]).add(v3(0,12,0)),6.0,11.4],
 ['🍪 COOKIE ISLAND','saruulka_777',()=>wp(ISL11[0].who).add(v3(0,4,0)),12.4,15.6],
 ['🎂 CAKE ISLAND','Phenomenon',()=>wp(ISL11[1].who).add(v3(0,4.5,0)),16.4,19.6],
 ['👑 KING FRINZ','frinz',()=>wp(ISL11[2].who).add(v3(0,4.5,0)),20.4,23.8],
 ['🚜 FARM + MODERN HOUSE','Y T H A N',()=>wp(ISL11[3].who).add(v3(0,4,0)),24.6,28.2],
 ['👟 BANANO SHOES','Mr;banano',()=>wp(ISL11[4].who).add(v3(0,4,0)),29.0,32.6],
 ['🚗 KOLA MOTORS','Kola',()=>wp(ISL11[5].who).add(v3(0,4,0)),33.4,37],
 ['🏝️ YOUR ISLAND!','burneraccount100perc',()=>wp(ISL11[6].who).add(v3(0,4,0)),37.8,40.6],
 ['🇩🇰 LITTLE COPENHAGEN','R_yanskie',()=>wp(ISL11[7].who).add(v3(0,4,0)),41.4,45.6],
 ['🌴 RDA RESORT','RDA (as BA Europe)',()=>wp(ISL11[8].who).add(v3(0,4,0)),46.4,50],
 ['🚀 SPACE PLANE','flown by Lifthansa / PTFS',()=>wp(splane).add(v3(0,6,0)),51.0,56.6],
];
$('tags').innerHTML=TAGS.map(t=>`<div class="ntag"><div class="tt">${t[0]}</div><div class="ts">${t[1]}</div></div>`).join('');
window.CAPTION_TIMES=[...new Set(caps.map(c=>c[1]))].concat(TAGS.map(t=>t[3]),ISL11.map(o=>o.t),ISL11.map(o=>o.tb),[.8,1.4,3.0,57.4,58.0,60.0,61.0]).map(toR);
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
 // moving things first
 { const fk=((t*.04)%2);const f=fk<1?fk:2-fk;const dir=fk<1?1:-1;const u=FERRY_A[0]+(FERRY_B[0]-FERRY_A[0])*ease(f),v=FERRY_A[1]+(FERRY_B[1]-FERRY_A[1])*ease(f);const p=LW(u,v);ferry.visible=true;
   ferry.position.set(p.x,SEA+.15+Math.sin(t*1.5)*.12,p.y);const q=LW(u+(FERRY_B[0]-FERRY_A[0])*.01*dir,v+(FERRY_B[1]-FERRY_A[1])*.01*dir);ferry.lookAt(q.x,ferry.position.y,q.y); }
 { jet.visible=true;const p=jetPos(t),q=jetPos(t+.05);jet.position.copy(p);jet.lookAt(q);jet.rotateZ(-.45);jet.userData.fl.scale.z=1+Math.sin(t*40)*.3; }
 clouds.forEach((c,i)=>{c.userData.bx??=c.position.x;c.position.x=c.userData.bx+t*1.4*(i%2?1:-1);});
 smoke.forEach((b,i)=>{const ph=((t*.12+i/smoke.length)%1);b.position.set(V.x+ph*20+Math.sin(i*3)*3,H(V.x,V.y)+5+ph*40,V.y-ph*9);b.scale.setScalar(.9+ph*3);b.material.opacity=.6*(1-ph);});
 lava.material.color.setHSL(.06,1,.5+.06*Math.sin(t*4));
 ghosts.forEach(g=>g.visible=false); pawns.forEach(p=>p.visible=false); flagGrp.visible=false; siteA.visible=siteB.visible=false;
 cutAt(t);
 for(const g of roadParts)g.visible=true;
 for(const g of NEW){ if(POP9.includes(g))continue; g.visible=true;g.scale.setScalar(1);
   if(g.userData.base!==undefined){g.position.y=g.userData.base+Math.sin(t*1.5+g.position.x)*.15;g.rotation.z=Math.sin(t*1.2+g.position.z)*.04;}}
 for(const g of POP){g.visible=true;g.scale.setScalar(1);}
 for(const g of POP7){g.visible=true;g.scale.setScalar(1);if(g.userData.base!==undefined){g.position.y=g.userData.base+Math.sin(t*1.5+g.position.x)*.12;}}
 for(const g of POP8){g.visible=true;g.scale.setScalar(1);}
 for(const g of POP9){g.visible=true;g.scale.setScalar(1);}
 
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
 base.userData.rotor.children[2].rotation.y=t*6;base.userData.rotor.children[3].rotation.y=t*6;
 desert.userData.camels.forEach((c,i)=>{c.rotation.y=i*1.3+Math.sin(t*.6+i)*.5;});
 lab.userData.bub.forEach((b,i)=>{const ph=((t*.7+i/6)%1);b.position.set(Math.sin(i*2)*.6,7.6+ph*3,1+Math.cos(i*2)*.6);b.scale.setScalar(1-ph*.6);});
 { const w=fun.userData.wheel;w.rotation.z=t*.35;fun.userData.cabs.forEach((c,i)=>{const a=i/10*Math.PI*2;c.position.set(Math.cos(a)*7,Math.sin(a)*7-1,0);c.rotation.z=-w.rotation.z;});fun.userData.car.rotation.y=t*.8;
   fun.userData.mascots.forEach((m,i)=>{m.position.y=.15+Math.abs(Math.sin(t*4+i))*.6;}); }
 { const pl=court.userData.pl,bl=court.userData.ball;pl.forEach((p,i)=>{p.position.x=-3+i*2+Math.sin(t*2+i)*1.2;p.position.z=(i%2?1.5:-1.5)+Math.cos(t*1.7+i)*.8;});const ph=(t*.8)%1;const a=pl[Math.floor(t*.8)%4].position;bl.position.set(a.x,.6+Math.abs(Math.sin(ph*Math.PI*3))*1.6,a.z+.6); }
 // Day 7 life (all standing now)
 { const u0=-72+((t*14)%164);train.forEach((c,i)=>{const u=u0-i*6.4;c.visible=true;const p=LW(u,RLV);c.position.set(p.x,RLY+.3,p.y);const q=LW(u+1,RLV);c.lookAt(q.x,RLY+.3,q.y);}); }
 station.userData.cat.rotation.y=Math.sin(t*1.3)*.8;station.userData.cat.children[4].rotation.z=Math.sin(t*6)*.4;
 king.visible=true;king.scale.setScalar(1);king.rotation.y=Math.sin(t*.8)*.6;
 smith.userData.puffs.forEach((p,i)=>{const ph=((t*.35+i/5)%1);p.position.set(2.6+ph*1.5,7+ph*6,-1.4);p.scale.setScalar(.6+ph*1.6);p.material.opacity=.7*(1-ph);});
 smith.userData.sparks.forEach((p,i)=>{const ph=((t*1.6+i/8)%1);p.position.set(1.2+Math.sin(i*2.3)*ph*1.2,1.3+ph*1.4-ph*ph*1.6,3+Math.cos(i*2.3)*ph*1.2);p.visible=ph<.9;});
 cop.userData.lb.material.color.set(Math.sin(t*12)>0?'#e8334f':'#2f7de1');cop.userData.lb.material.emissive.set(Math.sin(t*12)>0?'#e8334f':'#2f7de1');
 { const tr2=captain.userData.tr;const on=Math.sin(t*14)>0;tr2.userData.lr.material.emissiveIntensity=on?2:0;tr2.userData.lb.material.emissiveIntensity=on?0:2; }
 { aheli.visible=true;const a=t*.5;aheli.position.set(AH_C.x+Math.cos(a)*16,AH_C.y+20+Math.sin(t*1.3)*1.2,AH_C.z+Math.sin(a)*16);aheli.lookAt(AH_C.x+Math.cos(a+.1)*16,aheli.position.y,AH_C.z+Math.sin(a+.1)*16);aheli.userData.rot.rotation.y=t*25; }
 // Day 8 life
 { const z=zoo.userData;z.L1.userData.hd.rotation.z=Math.max(0,Math.sin(t*1.4))*.35;z.L2.rotation.y=2.4+Math.sin(t*.7)*.5;z.E1.userData.hd.rotation.z=Math.sin(t*1.8)*.18;z.E2.position.x=12+Math.sin(t*.5)*1.2;
   z.G1.userData.nk.rotation.z=-.25+Math.sin(t*1.1)*.12;z.G2.userData.nk.rotation.z=-.25+Math.sin(t*.9+1)*.12;z.pens.forEach((p,i)=>{p.rotation.z=Math.sin(t*6+i)*.15;p.position.x=-13.5+i*1.1+Math.sin(t*.8+i)*.4;});
   z.mk.position.y=z.T+4.2+Math.abs(Math.sin(t*3))*.6;z.kp.rotation.y=Math.sin(t*1.2)*.5;z.vis.forEach((v,i)=>{v.position.y=z.T+Math.abs(Math.sin(t*4+i))*.12;}); }
 garlic.userData.ct.userData.tl.rotation.z=.8+Math.sin(t*3)*.4;
 doctor.userData.d.rotation.y=Math.sin(t*1.5)*.4;
 { const o=orph.userData;o.seat.rotation.x=Math.sin(t*2.2)*.6;o.kids.forEach((kd,i)=>{kd.position.y=o.T+Math.abs(Math.sin(t*5+i))*.4;}); }
 phones.userData.big.rotation.y=t*1.2;
 { const h=high.userData;const ph=(t*.9)%1;h.ball.position.set(-1+ph*6.5,.6+Math.sin(ph*Math.PI)*3.2,6.4+ph*2.2);h.st.forEach((p,i)=>{p.position.y=Math.abs(Math.sin(t*5+i))*.25;}); }
 { const P=pool.userData;const ph=((t-37.6)*.45)%1;const jp=ph<.5?ph/.5:1;P.hd.position.set(0,ph<.5?1.95+Math.sin(jp*Math.PI)*1.6-jp*1.6:-.6+Math.sin(t*3)*.08,-4.4+jp*3.6);P.hd.rotation.x=ph<.5?jp*2.4:0;
   P.sw.forEach((p,i)=>{p.position.x=-5+i*3.2+Math.sin(t*.9+i)*1.6;p.position.y=-.6+Math.sin(t*3+i)*.08;}); }
 { const d=blueTower.userData.dg;d.userData.tl.rotation.z=.5+Math.sin(t*9)*.5;d.userData.hd.rotation.y=Math.sin(t*.8)*.5; }
 { const s=swat.userData;s.lb.material.emissiveIntensity=Math.sin(t*14)>0?2:.2;s.team.forEach((p,i)=>{p.rotation.y=Math.sin(t*1.5+i)*.3;}); }
 { const P=pets.userData;P.pups.forEach((d,i)=>{d.userData.tl.rotation.z=.5+Math.sin(t*10+i)*.6;d.position.y=Math.abs(Math.sin(t*4+i*1.3))*.25;});P.kits.forEach((k,i)=>{k.userData.tl.rotation.z=.8+Math.sin(t*3+i)*.4;}); }

 // Day 9 builds all standing now
 hcarsAt(t); metroAt(t);
 floodW.visible=false; FWALL.forEach(w=>{w.visible=true;w.position.y=w.userData.y0+3.4;}); rain9At(t,0); sun.intensity=2.3; scene.background.set('#8fd0ff');
 scene.fog.near=1400; scene.fog.far=2600;
 ISL.forEach(g=>g.visible=false);
 { const P=petHosp.userData;P.pt.userData.tl.rotation.z=.5+Math.sin(t*9)*.5;P.vet.rotation.y=Math.sin(t*1.4)*.5;P.amb.children[2].material.emissiveIntensity=Math.sin(t*12)>0?2:.2; }
 mansion9.userData.mk.rotation.y=Math.sin(t*1.1)*.6;
 atc.userData.rad.rotation.y=t*2.2;atc.userData.bcn.material.emissiveIntensity=Math.sin(t*5)>0?2:.2;
 watch9.userData.fl.rotation.y=Math.sin(t*2)*.25;watch9.userData.jn.rotation.y=Math.sin(t*.9)*.8;
 { const U=uni.userData;U.pr.rotation.y=Math.sin(t*1.3)*.5;U.st.forEach((p,i)=>{p.position.y=U.T+Math.max(0,Math.sin(t*3+i*1.7))*.15;}); }
 // Day 10 islands: all standing now, with their life
 ISL10.forEach(o=>{o.g.visible=true;o.g.scale.setScalar(1);o.g.position.y=SEA;o.bld.visible=true;o.bld.scale.setScalar(1);o.sp.visible=false;});
 { const o=ISL10[0];o.dash.rotation.y=Math.sin(t*1.2)*.6; }
 { const o=ISL10[1];o.gond.position.x=-12+((t*2.2)%26);o.dan.rotation.y=Math.sin(t)*.6; }
 { const o=ISL10[2];o.ship.position.y=SEA-T10-.6+Math.sin(t*1.1)*.15;o.chill.rotation.y=Math.sin(t*1.4)*.7; }
 { const o=ISL10[3];o.dave.rotation.y=Math.sin(t*1.3)*.5;o.coins.forEach(c=>c.visible=false); }
 { const o=ISL10[4];o.jom.rotation.y=Math.sin(t*1.5)*.6;o.guests.forEach((p,i)=>{p.position.y=Math.abs(Math.sin(t*3+i))*.2;}); }
 { const o=ISL10[5];o.pres.rotation.y=Math.sin(t*.8)*.4;o.flag.rotation.y=Math.sin(t*3)*.12; }
 { const o=ISL10[6];o.pigs.forEach((p,i)=>{p.userData.hd.rotation.z=Math.sin(t*4+i)*.2;p.position.y=Math.max(0,Math.sin(t*5+i*1.3))*.2;});o.farmer.rotation.y=Math.sin(t*1.2)*.6; }
 { const o=ISL10[7];o.tanks.forEach((tk,i)=>{tk.userData.tu.rotation.y=Math.sin(t*.9+i*1.7)*.6;});o.radar.rotation.y=t*1.8;o.war.position.y=SEA-T10+.4+Math.sin(t*1.2)*.15;o.jet.visible=false; }
 { const o=ISL10[8];o.eg.rotation.y=Math.sin(t*1.1)*.6; }
 { const o=ISL10[9];o.flame.scale.set(1,1+Math.sin(t*14)*.18,1);o.pz.rotation.y=Math.sin(t*.9)*.7;o.puffs.forEach((p,i)=>{const ph=((t*.3+i/5)%1);p.position.set(2.4+ph*2,7+ph*7,-1);p.scale.setScalar(.6+ph*1.8);p.material.opacity=.7*(1-ph);}); }
 { train[0].visible=false;steam.visible=true;steam.position.copy(train[0].position);steam.quaternion.copy(train[0].quaternion);steam.userData.wh.forEach(w=>w.rotation.x=t*8);
   SPUFF.forEach((p,i)=>{const ph=((t*1.1+i/10)%1);const L0=locoAt(t-ph*.9);const c=L0.p.clone().addScaledVector(L0.d,2.4);p.visible=true;p.position.set(c.x,c.y+4.6+ph*7,c.z);p.scale.setScalar(.5+ph*2.2);p.material.opacity=.85*(1-ph);}); }

 // Day 11: the Herusie Ship route
 const wide=t<5.2||t>=56.6;
 const rk=clamp((t-5.6)/3.4);DASH.forEach((m,i)=>{m.visible=t>=5.6&&(t>=9||i/DASH.length<rk);});
 PIERS.forEach((g,i)=>{const kk=clamp((t-5.8-i*.3)/.5);g.visible=kk>0;g.scale.setScalar(Math.max(.001,backOut(kk)));});
 SHIPS.forEach((s,i)=>{const r=routeAt(shipPh(i,t));s.visible=true;s.position.copy(r.p).add(v3(0,.3+Math.sin(t*1.2+i)*.12,0));s.lookAt(s.position.clone().add(r.d));s.rotateY(-Math.PI/2);
   s.userData.wk.forEach((f,j)=>{const ph=((t*1.4+j/6)%1);f.position.set(-32-ph*14,-1.6,(j%2?1:-1)*(2+ph*4));f.scale.setScalar(1+ph*1.5);f.material.opacity=.55*(1-ph);});});
 chillP.visible=true;chillP.position.copy(SHIPS[0].localToWorld(v3(-2,13.6,0)));chillP.quaternion.copy(SHIPS[0].quaternion);chillP.rotateY(Math.PI/2);
 // the nine new islands: each rises on its beat, then its buildings pop in
 ISL11.forEach((o,i)=>{const kk=clamp((t-o.t)/.6);o.g.visible=kk>0;if(kk>0){o.g.scale.setScalar(Math.max(.001,backOut(kk)));o.g.position.y=SEA-9+9*ease(kk);}
   const kb=clamp((t-o.tb)/.55);o.bld.visible=kb>0;if(kb>0)o.bld.scale.setScalar(Math.max(.001,backOut(kb)));
   o.sp.material.opacity=wide?1:0;o.sp.visible=wide&&kk>=1;o.who.rotation.y=Math.sin(t*1.2+i)*.6;});
 { const o=ISL11[0];o.big.rotation.y=.3+Math.sin(t*.8)*.15; }
 { const o=ISL11[1];o.fl.forEach((f,i)=>f.scale.set(1,1+Math.sin(t*14+i)*.25,1)); }
 { const o=ISL11[2];o.who.rotation.y=0;o.who.position.y=1+Math.abs(Math.sin(t*2))*.15;o.vl.forEach((p,i)=>{p.position.y=Math.abs(Math.sin(t*5+i))*.35;}); }
 { const o=ISL11[3];const ph=(t*.06)%1;const z=-16+Math.floor(ph*7)*3;const xr=((ph*7)%1);const dir=Math.floor(ph*7)%2?-1:1;o.tr.position.set(-6+(dir>0?-9+xr*18:9-xr*18),.2,z);o.tr.rotation.y=dir>0?-Math.PI/2:Math.PI/2; }
 { const o=ISL11[4];o.sn.rotation.y=.4+t*.5;o.sn.position.y=13.6+Math.sin(t*2)*.4;o.cu.forEach((p,i)=>{p.position.y=Math.abs(Math.sin(t*4+i))*.2;}); }
 { const o=ISL11[5];o.cars.forEach((c,i)=>{const a=t*(.9+i*.08)+i*1.57;c.position.set(Math.cos(a)*17.2*1.15,.2,Math.sin(a)*17.2*.85);c.rotation.y=-a;});
   o.smk.forEach((p,i)=>{const ph=((t*.35+i/5)%1);p.position.set(5+ph*2,12+ph*7,-4);p.scale.setScalar(.6+ph*1.8);p.material.opacity=.7*(1-ph);}); }
 { const o=ISL11[6];o.yes.rotation.z=Math.sin(t*3)*.03;o.flag.rotation.y=Math.sin(t*3)*.2;o.ff.scale.set(1,1+Math.sin(t*14)*.2,1);o.net.rotation.x=Math.sin(t*1.2)*.08; }
 { const o=ISL11[7];o.bts.forEach((b,i)=>{b.position.y=Math.sin(t*1.5+i)*.08;b.rotation.y=Math.sin(t*.6+i)*.06;});o.dk.rotation.y=Math.sin(t*3)*.2; }
 { const o=ISL11[8];o.gs.forEach((p,i)=>{p.position.y=-.4+Math.sin(t*3+i)*.08;});o.sea.position.y=-T10+SEA+.4+Math.sin(t*1.3)*.1; }
 // space plane
 { const R=RW(Math.max(t,50.6));const show=t>=49.6;splane.visible=show;if(show){splane.position.copy(R.P);splane.lookAt(R.Q);splane.userData.fl.forEach((f,i)=>{f.scale.set(1,1+Math.sin(t*40+i)*.3+(t>51.4?1.6:0),1);f.visible=t>50.4;});} else {splane.visible=false;}
   pj10Hide(t); }
 const sk=sh.space?clamp((t-53)/2.4):0;scene.background.copy(SKY0).lerp(SKY1,sk);STARS.material.opacity=clamp((sk-.35)/.4);STARS.position.copy(camera.position);
 if(sh.space){scene.fog.near=1400+sk*4000;scene.fog.far=2600+sk*6000;}
 if(sh.ship){const r=routeAt(shipPh(0,t));const side=v3(-r.d.z,0,r.d.x);camera.position.copy(r.p).addScaledVector(r.d,-80+24*k).addScaledVector(side,-62).add(v3(0,58,0));camera.lookAt(r.p.clone().addScaledVector(r.d,40).add(v3(0,2,0)));}
 else if(sh.space){const R=RW(Math.max(t,50.6));if(t<53.2){const c=ISL10[0].ref.localToWorld(v3(-6+8*k,T10+16,-62));camera.position.copy(c);camera.lookAt(R.P.clone().add(v3(0,2,0)));}
   else {const back=R.P.clone().sub(R.Q).normalize();camera.position.copy(R.P).addScaledVector(back,26).add(v3(0,5-11*clamp((t-53.2)/1.5),0)).add(ISL10[0].ref.localToWorld(v3(0,0,1)).sub(ISL10[0].ref.position).multiplyScalar(22));camera.lookAt(R.P);}}
 else {camera.position.lerpVectors(sh.p[0],sh.p[1],k); camera.lookAt(new THREE.Vector3().lerpVectors(sh.l[0],sh.l[1],k));}
 camera.fov=sh.f||46; camera.updateProjectionMatrix();
 STARS.position.copy(camera.position);
 renderer.render(scene,camera);

 // ---------- UI ----------
 const used={c1:false,c2:false};
 for(const [id,a,b,txt] of caps){ if(t>=a&&t<=b){const el=$(id); if(el.dataset.txt!==txt){el.innerHTML=txt;el.dataset.txt=txt;} popAt(el,t,a,b); used[id]=true; } }
 for(const id in used) if(!used[id]) $(id).style.opacity=0;
 $('popn').textContent=(1460).toLocaleString('en-US');
 if(t<30){ $('t_vA').textContent=TXT.oA; $('t_vB').textContent=TXT.oB; popAt($('votes'),t,.5,2.55); const kk=clamp((t-.8)/1.0); $('barA').style.width=(33*kk)+'%'; $('barB').style.width=(67*kk)+'%'; $('nA').textContent=kk>.5?'1':''; $('nB').textContent=kk>.5?'2':''; }
 else { $('t_vA').textContent=TXT.vA; $('t_vB').textContent=TXT.vB; popAt($('votes'),t,57.4,61.2); $('barA').style.width='0%'; $('barB').style.width='0%'; $('nA').textContent='?'; $('nB').textContent='?'; }
 [...$('goals').children].forEach(el=>popAt(el,t,99,0));
 [...$('tags').children].forEach((el,i)=>{const [_,__,pf,a,b]=TAGS[i];const pp=proj(pf());el.dataset.base='translate(-50%,-100%)';const hw=el.offsetWidth/2+24;el.style.left=Math.min(1080-hw,Math.max(hw,pp[0]))+'px';el.style.top=Math.max(560+el.offsetHeight+18,pp[1])+'px';popAt(el,t,a,b);if(pp[2]>1)el.style.opacity=0;});
 [...$('laws').children].forEach((c,i)=>popAt(c,t,61.4+i*1.0,DUR));
 let fl=0; for(const c of window.CUTS){ if(c>0&&tr>=c&&tr<c+.12) fl=.5*(1-(tr-c)/.12);} $('flash').style.opacity=fl;
};
// D4SH's old parked jet makes way for the space plane on the runway
function pj10Hide(t){ISL10[0].bld.children.forEach(c=>{if(c.userData.isPJ)c.visible=false;});}
{const b=ISL10[0].bld;b.children.forEach(c=>{if(c.type==='Group'&&Math.abs(c.position.x+8)<.01&&Math.abs(c.position.z+15)<.01)c.userData.isPJ=true;});}
window.DUR=RDUR; window.__T2={camera,renderer,scene,L,LW};
document.fonts.ready.then(()=>{window.setTime(0);window.READY=true;});
