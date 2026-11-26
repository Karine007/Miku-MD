// ===== DAY 13: Olympics won 2–0 → RDA's 190,000-seat Olympic stadium + torch, RDA's airline to space (flown by One United),
// Neck Hurts' spire moves to the Ocean Tower, bridges connect every island, Hotel Island, a bigger Egypt island with mummies,
// the SCP Foundation inside the volcano, Jack's Burgers island, K-RYPT13's walled Filipino town, Nikolozi's stadium island,
// Kola Beach, Day 14 vote =====
// (make_day13.py prepends the Day 5 → Day 12 builds, all standing, and injects the Day 11 + Day 12 "life" blocks)
const ISL13=[];
function mk13(u,v,r,name,top){const g=new THREE.Group();g.add(cyl(r,r+4,6,sandM,0,-1,0,36));g.add(cyl(r-4,r-1.5,2.4,top||grassM,0,2.3,0,34));
 const bld=new THREE.Group();bld.position.y=T10;g.add(bld);const sp=label10(name);sp.position.set(0,58,0);g.add(sp);
 const p=LW(u,v);g.position.set(p.x,SEA,p.y);g.rotation.y=FACE;g.visible=false;scene.add(g);
 const ref=new THREE.Object3D();ref.position.copy(g.position);ref.rotation.copy(g.rotation);ref.updateMatrixWorld(true);
 const o={g,bld,sp,ref,r,u,v};ISL13.push(o);return o;}
const IL4=(i,x,y,z)=>ISL13[i].ref.localToWorld(v3(x,y+SEA+T10,z));
const em13=(c,i=1.2)=>std(c,{emissive:c,emissiveIntensity:i});
function mummy(s=1){const p=pawn('#efe6d2',s);for(let k=0;k<5;k++)p.add(cyl(.335,.335,.07,std('#cbbf9f'),0,.35+k*.22,0,10));
 for(const z of [-.2,.2])p.add(box(.6,.14,.14,std('#efe6d2'),.35,1.15,z));for(const z of [-.1,.1])p.add(box(.05,.06,.06,em13('#ff3b3b',1.6),.27,1.6,z));return p;}

// ---------- island 0: 🏟️ RDA's OLYMPIC STADIUM — 190,000 seats, the Olympic torch, athletes on the track
const OLY=(()=>{const o=mk13(0,-520,70,'RDA (as BA Europe)',std('#86cf5e'));const b=o.bld;const SX=1.35,R0=26;
 const prof=[[R0,0],[R0,1.2],[R0+19,15],[R0+21,15],[R0+21,0]].map(([x,y])=>new THREE.Vector2(x,y));
 const bowl=new THREE.Mesh(new THREE.LatheGeometry(prof,64),std('#e9eef2',{side:THREE.DoubleSide}));bowl.scale.x=SX;b.add(bowl);
 const roofR=new THREE.Mesh(new THREE.TorusGeometry(R0+20,1.1,8,64),std('#ffffff',{metalness:.3}));roofR.rotation.x=Math.PI/2;roofR.scale.x=SX;roofR.position.y=15.6;b.add(roofR);
 const N=4200,CC=['#e8334f','#2f7de1','#f2c230','#2fa36b','#ffffff','#9b59d6','#ff8a2a','#1d232b'];
 const im=new THREE.InstancedMesh(new THREE.BoxGeometry(.9,1.1,.9),std('#ffffff'),N);const dm=new THREE.Object3D();
 for(let i=0;i<N;i++){const a=(i*2.399963)%(Math.PI*2),s=((i*0.7548776662+.13)%1);const r=R0+1.6+s*17.4;dm.position.set(Math.cos(a)*r*SX,4.2+s*12.6,Math.sin(a)*r);dm.scale.setScalar(1.3);dm.rotation.y=-a;dm.updateMatrix();im.setMatrixAt(i,dm.matrix);im.setColorAt(i,new THREE.Color(CC[i%8]));}
 b.add(im);o.crowd=im;
 const inf=cyl(R0-.2,R0-.2,.3,std('#5fb544'),0,.15,0,48);inf.scale.x=SX;b.add(inf);
 const trk=new THREE.Mesh(new THREE.RingGeometry(19,25.6,64),std('#c8553d'));trk.rotation.x=-Math.PI/2;trk.scale.set(SX,1,1);trk.position.y=.32;b.add(trk);
 for(let k=1;k<4;k++){const ln=new THREE.Mesh(new THREE.RingGeometry(19+k*1.65,19.12+k*1.65,64),std('#ffffff'));ln.rotation.x=-Math.PI/2;ln.scale.set(SX,1,1);ln.position.y=.34;b.add(ln);}
 const RC=['#0085c7','#1d232b','#df0024','#f4c300','#009f3d'],rings=new THREE.Group();[[-8,0],[0,0],[8,0],[-4,-3.6],[4,-3.6]].forEach(([x,y],i)=>{const t=new THREE.Mesh(new THREE.TorusGeometry(3.4,.55,8,28),std(RC[i],{metalness:.3}));t.position.set(x,y,0);rings.add(t);});
 rings.position.set(0,24,R0+22);b.add(rings);b.add(box(.6,10,.6,MT.dark,-10,18,R0+22));b.add(box(.6,10,.6,MT.dark,10,18,R0+22));
 const cau=new THREE.Group();cau.add(cyl(.8,1.2,10,MT.dark,0,5,0,10));cau.add(cyl(3.2,1.6,2.4,gold10,0,11,0,16));const fl=new THREE.Group();
 for(let k=0;k<3;k++){const f=new THREE.Mesh(new THREE.ConeGeometry(2.2-k*.5,5-k,10),em13(['#ff6a00','#ffb12a','#fff1a0'][k],1.8));f.position.y=14+k*.5;fl.add(f);}cau.add(fl);cau.position.set(-(R0+21)*SX*.97,15,0);b.add(cau);o.flame=fl;
 const FLC=['#c8102e','#2f7de1','#f2c230','#2fa36b','#ffffff','#ff8a2a','#9b59d6','#1d232b'];for(let k=0;k<16;k++){const a=k/16*Math.PI*2;const f=new THREE.Group();f.add(cyl(.12,.12,7,MT.dark,0,3.5,0,6));f.add(box(2.6,1.6,.08,std(FLC[k%8]),1.35,6.2,0));f.position.set(Math.cos(a)*(R0+21)*SX,15.6,Math.sin(a)*(R0+21));f.rotation.y=-a;b.add(f);}
 const sg=sign('HERBERG OLYMPIC STADIUM · 190,000 SEATS','#0f5c8c','#ffffff',40,3);sg.position.set(0,6,(R0+21)+.4);b.add(sg);
 const ath=[];for(let k=0;k<6;k++){const p=pawn(['#e8334f','#2f7de1','#f2c230','#2fa36b','#9b59d6','#ff8a2a'][k],1.3);b.add(p);ath.push(p);}o.ath=ath;
 const pod=new THREE.Group();[[0,3,gold10],[-3.2,2,std('#c0c6cc',{metalness:.5})],[3.2,1.4,std('#c98b45',{metalness:.4})]].forEach(([x,h,m])=>pod.add(box(3,h,3,m,x,h/2,0)));pod.position.set(0,.3,-8);b.add(pod);
 const rp=pawn('#0f5c8c',1.4);rp.add(box(1,.12,1,std('#ffffff'),0,2.2,0));rp.position.set(0,3.3,-8);b.add(rp);o.who=rp;
 for(const [x,z] of [[-70,30],[70,30],[-66,-36],[66,-36],[0,-58]]){const pp=palm10(1.1);pp.position.set(x,0,z);b.add(pp);}
 o.bowl=bowl;return o;})();

// ---------- island 1: 🍔 JACK'S BURGERS (okbroiknoq) — "Day 1 of asking" — on its own island
const JACK=(()=>{const o=mk13(-170,-480,30,'.',std('#8ccf5e'));const b=o.bld;
 const r=new THREE.Group();r.add(box(18,7,11,std('#fff3c4'),0,3.5,0));r.add(box(18.6,1.2,11.6,std('#e8334f'),0,7.6,0));r.add(box(14,3.4,.08,MT.glass,0,3,5.55));
 const s=sign("JACK'S BURGERS",'#e8334f','#fff3c4',14,2.2);s.position.set(0,6,5.65);r.add(s);r.position.set(0,0,-6);b.add(r);
 const bg=new THREE.Group();const bun=std('#e2a24a');const top=new THREE.Mesh(new THREE.SphereGeometry(5,20,12,0,Math.PI*2,0,Math.PI/2),bun);top.position.y=3.4;bg.add(top);
 bg.add(cyl(5.2,5.2,.6,std('#3fa34a'),0,2.9,0,20));bg.add(box(9.6,.3,9.6,std('#f2c230'),0,2.5,0).rotateY(.4));bg.add(cyl(5,5,1.6,std('#6b3a1f'),0,1.6,0,20));bg.add(cyl(5,4.6,1.2,bun,0,.4,0,20));
 for(let k=0;k<10;k++){const a=k*2.4;bg.add(new THREE.Mesh(new THREE.SphereGeometry(.25,6,4),std('#fff3c4')).translateX(Math.cos(a)*2.6).translateY(6.6+Math.sin(k)*.4).translateZ(Math.sin(a)*2.6));}
 bg.position.set(0,8.2,-6);b.add(bg);o.burger=bg;
 for(const [x,z] of [[-10,8],[-4,10],[4,10],[10,8]]){const t=new THREE.Group();t.add(box(3,.3,2,MT.wood,0,1.4,0));for(const s2 of [-1,1])t.add(box(3,.25,.6,MT.wood,0,.8,s2*1.3));t.add(cyl(.08,.08,4,MT.dark,0,2,0,6));t.add(new THREE.Mesh(new THREE.ConeGeometry(2,1,8),std(['#e8334f','#f2c230'][Math.abs(x)%2])).translateY(4.2));t.position.set(x,0,z);b.add(t);}
 const cu=[];for(let k=0;k<5;k++){const p=pawn(['#30c2a8','#9b59d6','#f2d33a','#3e8fe6','#e85d75'][k],1);p.position.set(-8+k*4,0,6.6);b.add(p);cu.push(p);}o.cu=cu;
 const jk=pawn('#e8334f',1.3);jk.add(box(.8,.18,.9,std('#e8334f'),.15,1.82,0));jk.position.set(-12,0,1);b.add(jk);o.who=jk;
 for(const [x,z] of [[-19,-4],[19,-4],[16,14]]){const pp=palm10(.9);pp.position.set(x,0,z);b.add(pp);}
 const ds=sign('DAY 1 OF ASKING ✓','#1d232b','#ffffff',8,1.3);ds.position.set(0,1.4,o.r-4.6);b.add(ds);return o;})();

// ---------- island 2: 🇵🇭 K-RYPT13 (shared!) — a THICK WALL with a Filipino town inside
function phFlag(){const c=document.createElement('canvas');c.width=300;c.height=150;const x=c.getContext('2d');x.fillStyle='#0038a8';x.fillRect(0,0,300,75);x.fillStyle='#ce1126';x.fillRect(0,75,300,75);
 x.fillStyle='#ffffff';x.beginPath();x.moveTo(0,0);x.lineTo(130,75);x.lineTo(0,150);x.closePath();x.fill();x.fillStyle='#fcd116';x.beginPath();x.arc(42,75,16,0,7);x.fill();
 for(const [px,py] of [[12,18],[12,132],[105,75]]){x.beginPath();x.arc(px,py,6,0,7);x.fill();}const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t;}
const KRY=(()=>{const o=mk13(170,-480,36,'K-RYPT13',std('#86cf5e'));const b=o.bld;const wl=std('#a39880');
 const N=30;for(let k=0;k<N;k++){const a=k/N*Math.PI*2;if(Math.abs(Math.sin(a)-1)<.012)continue;const x=Math.cos(a)*27,z=Math.sin(a)*27;if(z>24)continue;const w=box(6.2,9,4.4,wl,x,4.5,z);w.rotation.y=-a+Math.PI/2;b.add(w);
  if(k%2)b.add(box(1.6,1.6,4.6,wl,x,9.8,z).rotateY(-a+Math.PI/2));}
 const gt=new THREE.Group();gt.add(box(2.6,12,5,wl,-5,6,0));gt.add(box(2.6,12,5,wl,5,6,0));gt.add(box(12.6,3,5,wl,0,12,0));gt.add(box(7,8,.3,std('#5a3a1f'),0,4,-2.4));gt.position.set(0,0,27);b.add(gt);
 const ws=sign('FILIPINO TOWN','#0038a8','#fcd116',10,1.6);ws.position.set(0,12,29.6);b.add(ws);
 const HC=['#f4ead2','#ffd9b8','#cfe8ff','#d9f2c4','#ffe2ef'];[[-14,-8],[-8,-15],[2,-17],[12,-12],[16,-2],[-16,4],[-10,12],[12,10]].forEach(([x,z],i)=>{const h=new THREE.Group();for(const [px,pz] of [[-1.8,-1.6],[1.8,-1.6],[-1.8,1.6],[1.8,1.6]])h.add(cyl(.18,.18,2.4,MT.wood,px,1.2,pz,6));
  h.add(box(4.6,3,4,std(HC[i%5]),0,3.9,0));const rf=new THREE.Mesh(new THREE.ConeGeometry(4.2,3,4),std('#b08a4a'));rf.rotation.y=Math.PI/4;rf.position.y=6.9;h.add(rf);h.add(box(1,1.6,.1,std('#5a3a1f'),0,3.2,2.05));h.position.set(x,0,z);h.rotation.y=Math.atan2(-x,-z);b.add(h);});
 const ch=new THREE.Group();ch.add(box(8,9,8,std('#fbf6ea'),0,4.5,0));ch.add(box(9,3,1,std('#fbf6ea'),0,10.5,4));for(const x of [-3,3])ch.add(box(2,13,2,std('#fbf6ea'),x,6.5,4.2));ch.add(box(2.4,4,.2,std('#5a3a1f'),0,2,4.1));
 ch.add(box(.3,2.4,.3,MT.dark,0,13.4,4));ch.add(box(1.4,.3,.3,MT.dark,0,13.8,4));ch.position.set(0,0,-4);b.add(ch);
 const jp=new THREE.Group();const jc=['#e8334f','#2f7de1','#f2c230'];jp.add(box(7,2.2,2.8,std('#cfd8e0',{metalness:.6}),0,1.6,0));jp.add(box(2,1.4,2.6,std('#cfd8e0',{metalness:.6}),4.2,1.2,0));for(let k=0;k<3;k++)jp.add(box(7.1,.3,2.9,std(jc[k]),0,1.2+k*.5,0));
 jp.add(box(7.4,.3,3,std('#2f7de1'),0,2.85,0));for(const x of [-2.4,2.6])for(const z of [-1.4,1.4]){const w=cyl(.55,.55,.3,blk,x,.55,z,10);w.rotation.x=Math.PI/2;jp.add(w);}const js=sign('JEEPNEY','#f2c230','#e8334f',4,.7);js.position.set(0,3.4,0);jp.add(js);b.add(jp);o.jeep=jp;
 const fl=new THREE.Group();fl.add(cyl(.14,.14,12,MT.dark,0,6,0,6));const fm=new THREE.Mesh(new THREE.PlaneGeometry(5,2.5),new THREE.MeshStandardMaterial({map:phFlag(),side:THREE.DoubleSide}));fm.position.set(2.55,10.6,0);fl.add(fm);fl.position.set(-6,0,14);b.add(fl);o.flag=fm;
 const pp=[];for(let k=0;k<6;k++){const p=pawn(['#0038a8','#ce1126','#fcd116','#30c2a8','#e85d75','#ffffff'][k],1);b.add(p);pp.push(p);}o.pp=pp;
 const kp=pawn('#1d232b',1.3);kp.add(box(.7,.25,.12,std('#fcd116'),0,1.6,.3));kp.position.set(6,0,16);b.add(kp);o.who=kp;return o;})();

// ---------- island 3: 🏟️ NIKOLOZI — an island with a stadium
const NIK=(()=>{const o=mk13(-300,-470,30,'NIKOLOZI',std('#86cf5e'));const b=o.bld;
 b.add(box(28,.3,17,std('#4fae3a'),0,.15,0));for(let k=0;k<7;k++)b.add(box(4,.32,17,k%2?std('#5ebd47'):std('#4fae3a'),-12+k*4,.16,0));
 for(const [w,d,x,z] of [[28,.3,0,-8.4],[28,.3,0,8.4],[.3,17,-14,0],[.3,17,14,0],[.3,17,0,0]])b.add(box(w,.34,d,whiteM,x,.17,z));
 for(const s of [-1,1]){const g=new THREE.Group();g.add(box(.3,3,.3,whiteM,0,1.5,-3));g.add(box(.3,3,.3,whiteM,0,1.5,3));g.add(box(.3,.3,6.3,whiteM,0,3,0));g.position.set(s*14,0,0);b.add(g);}
 const SC=std('#2f5fb5');for(const [w,d,x,z,ry] of [[30,4,0,-12,0],[30,4,0,12,Math.PI],[19,4,-17,0,Math.PI/2],[19,4,17,0,-Math.PI/2]]){const st=new THREE.Group();for(let r=0;r<3;r++)st.add(box(w,1.2,1.6,r%2?std('#e8334f'):SC,0,.6+r*1.2,-r*1.6));st.position.set(x,0,z);st.rotation.y=ry;b.add(st);}
 for(const [x,z] of [[-18,-13],[18,-13],[-18,13],[18,13]]){const l=new THREE.Group();l.add(cyl(.25,.3,14,MT.dark,0,7,0,6));l.add(box(3,1.6,.6,em13('#fff4c2',1.3),0,14.4,0));l.position.set(x,0,z);l.lookAt(b.position.x,14,b.position.z);b.add(l);}
 const sg=sign('NIKOLOZI STADIUM','#2f5fb5','#ffffff',12,1.8);sg.position.set(0,5.4,-14.2);sg.rotation.y=Math.PI;b.add(sg);const sg2=sg.clone();sg2.position.z=14.2;sg2.rotation.y=0;b.add(sg2);
 const pl=[];for(let k=0;k<6;k++){const p=pawn(k<3?'#2f5fb5':'#e8334f',.9);b.add(p);pl.push(p);}o.pl=pl;const ball=new THREE.Mesh(new THREE.SphereGeometry(.4,10,8),std('#ffffff'));b.add(ball);o.ball=ball;
 const nk=pawn('#2f5fb5',1.3);nk.position.set(-6,0,17.5);b.add(nk);o.who=nk;return o;})();

// ---------- island 4: 🏨 EGYPTIAN MAPPER — stores and hotels: HOTEL ISLAND
const HOT=(()=>{const o=mk13(300,-470,32,'egyptian mapper',std('#86cf5e'));const b=o.bld;
 [[-12,-8,26,'#f4ead2','GRAND HOTEL','#c0392b'],[0,-12,34,'#cfe8ff','HERBERG PLAZA','#0f5c8c'],[12,-8,22,'#ffe2ef','PALM HOTEL','#2fa36b']].forEach(([x,z,h,c,n,sc])=>{const t=new THREE.Group();t.add(box(8,h,7,std(c),0,h/2,0));
  for(let f=3;f<h-1;f+=2.6){t.add(box(8.1,1,7.1,em13('#ffe9a8',.25),0,f,0));}t.add(box(8.6,1,7.6,std(sc),0,h+.5,0));const s=sign(n,sc,'#ffffff',7.4,1.1);s.position.set(0,h-1.6,3.56);t.add(s);t.position.set(x,0,z);b.add(t);});
 const SH=[['SHOES','#2f7de1'],['GIFTS','#f2c230'],['CAFE','#c98b45'],['TECH','#9b59d6'],['FASHION','#e8334f']];SH.forEach(([n,c],i)=>{const s=new THREE.Group();s.add(box(5,4,4,std('#fbf8f1'),0,2,0));for(let k=0;k<4;k++)s.add(box(1.25,.25,2.2,k%2?whiteM:std(c),-1.9+k*1.27,4.2,2.6).rotateX(-.35));
  const sg=sign(n,c,'#ffffff',4.4,.8);sg.position.set(0,3.3,2.05);s.add(sg);s.add(box(3,2,.08,MT.glass,0,1.3,2.04));s.position.set(-12+i*6,0,8);b.add(s);});
 b.add(box(10,.2,5,std('#3fd0e8',{roughness:.1}),14,.25,-1));b.add(box(11,.15,6,std('#e8e2d2'),14,.12,-1));
 const tour=[];for(let k=0;k<6;k++){const p=pawn(['#30c2a8','#f2d33a','#e85d75','#3e8fe6','#9b59d6','#ff8a4c'][k],.9);b.add(p);tour.push(p);}o.tour=tour;
 const em=pawn('#8a2be2',1.3);em.add(crown(1.1).translateY(2));em.position.set(-18,0,14);b.add(em);o.who=em;
 for(const [x,z] of [[-24,0],[24,10],[-22,-14],[22,-16]]){const pp=palm10(1);pp.position.set(x,0,z);b.add(pp);}return o;})();
ISL13.forEach(o=>o.g.traverse(q=>{if(q.isMesh&&q!==o.crowd){q.castShadow=true;q.receiveShadow=true;}}));

// ---------- 🏖️ KOLA BEACH, right next to Kola Motors (a sandbar beach on the sea side of Kola's island)
const KBE=(()=>{const o=ISL11[5];const g=new THREE.Group();g.add(cyl(18,21,5,sandM,0,-.6,0,30));
 const UC=['#e8334f','#2f7de1','#f2c230','#2fa36b','#ff6fa8'];for(let k=0;k<5;k++){const x=-12+k*6,z=-2+(k%2)*5;const u=new THREE.Group();u.add(cyl(.1,.1,4,MT.dark,0,3.9,0,6));u.add(new THREE.Mesh(new THREE.ConeGeometry(2.4,1,10),std(UC[k])).translateY(5.8));
  u.add(box(1.6,.12,3,std(UC[(k+2)%5]),1.6,2.05,0));u.position.set(x,0,z);g.add(u);}
 const sg=sign('KOLA BEACH','#c0392b','#ffffff',8,1.4);sg.position.set(0,3.8,10);g.add(sg);g.add(box(.2,3,.2,MT.dark,-3.4,3.2,9.9));g.add(box(.2,3,.2,MT.dark,3.4,3.2,9.9));
 const sw=[];for(let k=0;k<4;k++){const p=pawn(['#30c2a8','#f2d33a','#e85d75','#3e8fe6'][k],1);g.add(p);sw.push(p);}g.userData.sw=sw;
 const ball=new THREE.Mesh(new THREE.SphereGeometry(.7,12,8),std('#ffffff'));g.add(ball);g.userData.ball=ball;
 g.position.copy(o.ref.localToWorld(v3(46,SEA+1.4,0)));g.rotation.copy(o.ref.rotation);g.visible=false;scene.add(g);return g;})();

// ---------- 🏺 KINGDOM OF EGYPT: a bigger island, more pyramids, and MUMMIES on top
const EGI=ISL10[8];const EGX=(()=>{const b=EGI.bld;const g=new THREE.Group();b.add(g);
 for(const [x,z,s] of [[-18,-4,5.5],[18,3,5],[-6,16,4]]){const p=new THREE.Mesh(new THREE.ConeGeometry(s,s*1.15,4),std('#e0b866',{flatShading:true}));p.rotation.y=Math.PI/4;p.position.set(x,s*.575,z);p.castShadow=true;g.add(p);}
 const M2=[[0,17.2,-6,1.2],[-15,6.1,-12,1],[15,6.1,-12,1],[-18,6.4,-4,.9],[18,5.8,3,.9],[-6,4.7,16,.8]].map(([x,y,z,s])=>{const m=mummy(s);m.position.set(x,y,z);m.rotation.y=Math.PI/2;g.add(m);return m;});
 g.userData.m=M2;g.visible=false;return g;})();

// ---------- 🔬 ONLINE STRANGER: the SCP FOUNDATION inside the volcano (a blast door in the slope... don't open it)
const SCP=(()=>{const h0=H(V.x,V.y);const dir=new THREE.Vector2(1,.35).normalize();let R=8;for(;R<120;R+=1){if(H(V.x+dir.x*R,V.y+dir.y*R)<h0*.42)break;}
 const x=V.x+dir.x*R,z=V.y+dir.y*R,y=H(x,z);{const fx=x+dir.x*14,fz=z+dir.y*14,dx=fx-SITE_A.x,dy=fz-SITE_A.y,n=SZ*SZ+SX*SX;const cu=(-SZ*dx+SX*dy)/n,cv=(-SX*dx-SZ*dy)/n;clearTrees([[cu-26,cu+26,cv-26,cv+26]]);}const g=new THREE.Group();g.position.set(x-dir.x*2,y,z-dir.y*2);g.rotation.y=Math.atan2(dir.x,dir.y);
 const cc=std('#7d8590');g.add(box(18,14,6,cc,0,5,-1));g.add(box(20,1.2,7,std('#5a616b'),0,12.4,-1));
 const hz=document.createElement('canvas');hz.width=256;hz.height=32;{const x2=hz.getContext('2d');for(let i=-2;i<20;i++){x2.fillStyle=i%2?'#1d232b':'#f2c230';x2.beginPath();x2.moveTo(i*16,32);x2.lineTo(i*16+16,0);x2.lineTo(i*16+32,0);x2.lineTo(i*16+16,32);x2.fill();}}
 const hzT=new THREE.CanvasTexture(hz);for(const yy of [.4,10.4]){const st=new THREE.Mesh(new THREE.PlaneGeometry(14,1),new THREE.MeshStandardMaterial({map:hzT}));st.position.set(0,yy+.1,2.05);g.add(st);}
 g.add(box(12,9.6,1,std('#0b0d12'),0,5.2,1.3));const eyes=[];for(const ex of [-1.4,1.4]){const e=new THREE.Mesh(new THREE.SphereGeometry(.45,10,8),em13('#ff2020',2.4));e.position.set(ex,6.6,1.9);g.add(e);eyes.push(e);}
 const dl=box(6,9.6,.8,std('#9aa3ad',{metalness:.6,roughness:.35}),-3,5.2,2.1),dr=box(6,9.6,.8,std('#9aa3ad',{metalness:.6,roughness:.35}),3,5.2,2.1);g.add(dl,dr);
 for(const d of [dl,dr]){d.add(box(.4,9.6,.86,std('#f2c230'),d===dl?2.8:-2.8,0,0));}
 const s=sign('SCP FOUNDATION','#1d232b','#ffffff',12,1.8);s.position.set(0,11.2,2.6);g.add(s);
 const s2=sign('SECURE · CONTAIN · PROTECT','#ffffff','#1d232b',10,.9);s2.position.set(0,.9,4.2);g.add(s2);g.add(box(.2,1.6,.2,MT.dark,-4.4,.4,4.1));g.add(box(.2,1.6,.2,MT.dark,4.4,.4,4.1));
 const lamps=[];for(const lx of [-8,8]){const l=new THREE.Mesh(new THREE.SphereGeometry(.7,10,8),em13('#ff3b3b',2));l.position.set(lx,10,2.4);g.add(l);lamps.push(l);}
 const gd=[];for(const gx of [-6.5,6.5]){const p=pawn('#1d232b',1.6);p.add(box(.7,.2,.12,std('#ffffff'),0,1.15,.33));p.position.set(gx,0,4.6);g.add(p);gd.push(p);}
 const ws=sign('⚠ DO NOT OPEN','#e8334f','#ffffff',6,1.2);ws.position.set(0,7.4,2.6);ws.visible=false;g.add(ws);
 g.userData={dl,dr,eyes,lamps,gd,ws,dir,top:v3(x,y,z)};g.traverse(q=>{if(q.isMesh)q.castShadow=true;});g.visible=false;scene.add(g);return g;})();

// ---------- 🌉 EGYPTIAN MAPPER + IRIDO: bridges connecting all the islands
const ALLI=[...ISL10,...ISL11,...ISL12,...ISL13].map(o=>({u:o.u,v:o.v,r:o===EGI?o.r*1.3:o.r}));
const BRG=(()=>{const out=[];const segD=(p,a,b)=>{const ab=b.clone().sub(a);const t=clamp(p.clone().sub(a).dot(ab)/ab.lengthSq());return p.distanceTo(a.clone().addScaledVector(ab,t));};
 const P=o=>new THREE.Vector2(o.u,o.v);const deck=std('#e9e4da'),rail=std('#c0392b'),pyl=std('#b9b3a6');
 for(let i=0;i<ALLI.length;i++)for(let j=i+1;j<ALLI.length;j++){const a=ALLI[i],c=ALLI[j];const du=Math.abs(a.u-c.u),dv=Math.abs(a.v-c.v);const d=Math.hypot(du,dv);
  if(d>175||!(dv<26||du<26))continue;const A=P(a),B=P(c);if(ALLI.some((o,k)=>k!==i&&k!==j&&segD(P(o),A,B)<o.r+3))continue;
  const dir=B.clone().sub(A).normalize();const s=A.clone().addScaledVector(dir,a.r-3),e=B.clone().addScaledVector(dir,-(c.r-3));const ws=LW(s.x,s.y),we=LW(e.x,e.y);
  const W0=v3(ws.x,SEA+T10+.2,ws.y),W1=v3(we.x,SEA+T10+.2,we.y);const len=W0.distanceTo(W1);const g=new THREE.Group();g.position.copy(W0);g.lookAt(W1.x,W0.y,W1.z);
  const NS=Math.max(4,Math.round(len/8));for(let k=0;k<NS;k++){const f0=k/NS,f1=(k+1)/NS,fm=(f0+f1)/2;const y0=Math.sin(f0*Math.PI)*4,y1=Math.sin(f1*Math.PI)*4,ym=(y0+y1)/2;const sl=len/NS;
   const sg=new THREE.Group();sg.add(box(5,.6,sl+.25,deck,0,0,0));for(const x of [-2.6,2.6])sg.add(box(.25,1,sl+.25,rail,x,.7,0));sg.position.set(0,ym,fm*len);sg.rotation.x=-Math.atan2(y1-y0,sl);g.add(sg);
   if(k%2&&k<NS-1){const h=ym+SEA+T10+.2-SEA+1.5;g.add(box(1.4,h,1.4,pyl,0,ym-h/2,fm*len));}}
  g.userData={d:Math.hypot((a.u+c.u)/2,(a.v+c.v)/2+130)};g.visible=false;g.traverse(q=>{if(q.isMesh)q.castShadow=true;});scene.add(g);out.push(g);}
 out.sort((x,y)=>x.userData.d-y.userData.d);return out;})();
// main island ↔ the first row of islands: one big bridge from the coast to Dash's island
{const o=ISL10[0];let v=-110;for(;v<0;v+=1){if(H(LW(30,v).x,LW(30,v).y)>SEA+1.2)break;}const s=LW(30,v-2),e=LW(30*.4,-130+o.r-2);
 const W0=v3(s.x,Math.max(H(s.x,s.y),SEA)+.4,s.y),W1=v3(e.x,SEA+T10+.2,e.y);const len=W0.distanceTo(W1);const g=new THREE.Group();g.position.copy(W0);g.lookAt(W1);
 const NS=Math.round(len/8);for(let k=0;k<NS;k++){const sg=new THREE.Group();sg.add(box(6,.6,len/NS+.3,std('#e9e4da'),0,0,0));for(const x of [-3.1,3.1])sg.add(box(.25,1,len/NS+.3,std('#c0392b'),x,.7,0));sg.position.set(0,Math.sin((k+.5)/NS*Math.PI)*3,(k+.5)/NS*len);g.add(sg);}
 g.userData={d:0};g.visible=false;scene.add(g);BRG.unshift(g);}
const BCARS=[...Array(14)].map((_,i)=>{const c=car11(['#c0392b','#2f7de1','#f2c230','#ffffff','#2fa36b','#9b59d6','#1d232b'][i%7]);c.scale.setScalar(.8);c.visible=false;scene.add(c);return c;});

// ---------- ✈️ RDA's airline goes to SPACE, flown by One United (oneunitedofficial2): a rocket-plane off the hub island's runway
const RJET=(()=>{const j=plane('#ffffff','#0f5c8c','RDA');j.scale.setScalar(1.5);const fl=[];for(const x of [-3.4,3.4]){const f=new THREE.Mesh(new THREE.ConeGeometry(.55,4,10),new THREE.MeshBasicMaterial({color:'#ffb347',transparent:true,opacity:.9}));f.rotation.x=-Math.PI/2;f.position.set(x,1.1,-1.4);j.add(f);fl.push(f);}
 j.userData.fl=fl;j.visible=false;scene.add(j);return j;})();
const STREAK=[...Array(40)].map(()=>{const m=new THREE.Mesh(new THREE.BoxGeometry(.25,.25,30),new THREE.MeshBasicMaterial({color:'#ffffff',transparent:true,opacity:.6,fog:false}));m.visible=false;scene.add(m);return m;});
const AIRI=ISL12[0];

// ---------- timeline: design time = the voice take's time (line starts from the transcript)
const TD=[0,6.03,12.01,19.03,24.61,28.73,34.13,39.43,46.59,50.33,54.29,57.49,60.99,68.34];
const DUR=TD[TD.length-1];
const TR=window.DAY13_TR||TD, RDUR=TR[TR.length-1];
const pw=(x,A,B)=>{for(let i=0;i<A.length-1;i++)if(x<=A[i+1]||i==A.length-2)return B[i]+(B[i+1]-B[i])*clamp((x-A[i])/(A[i+1]-A[i]));};
const toD=tr=>pw(tr,TR,TD), toR=td=>pw(td,TD,TR);
const isleCam4=(i,R=1)=>({p:[IL4(i,-24*R,30*R,92*R),IL4(i,-10*R,25*R,80*R)],l:[IL4(i,0,5*R,0),IL4(i,0,5*R,0)],f:50});
OLY.t=6.3;HOT.t=29.0;JACK.t=46.8;KRY.t=50.6;NIK.t=54.5;ISL13.forEach(o=>{o.tb=o.t+.6;});
const T_TORCH=10.0,T_JET=12.6,T_SP=20.4,T_BR=25.4,T_EG=34.6,T_SCP=40.2,T_DOOR=43.6,T_KB=57.8;
scene.updateMatrixWorld(true);const SPW0=SPIRE.getWorldPosition(v3(0,0,0));scene.attach(SPIRE);const SPQ=SPIRE.quaternion.clone();
const OCT=v3(ocean.position.x,ocean.userData.topY-14.5,ocean.position.z);
const SH=[
 {t0:0,t1:6.03, p:[L(330,-720,360),L(-330,-720,360)], l:[L(150,-330,0),L(-150,-330,0)], f:50},
 {t0:6.03,t1:12.01, p:[IL4(0,-50,110,150),IL4(0,-24,86,120)], l:[IL4(0,0,0,4),IL4(0,0,0,4)], f:50},
 {t0:12.01,t1:19.03, jet:true, f:55},
 {t0:19.03,t1:24.61, p:[L(-470,-430,250),L(-440,-400,240)], l:[L(-56,-2,170),L(-50,-10,170)], f:52},
 {t0:24.61,t1:28.73, p:[L(-260,-560,330),L(120,-600,380)], l:[L(-60,-300,0),L(60,-300,0)], f:52},
 Object.assign({t0:28.73,t1:34.13},isleCam4(4,1.2)),
 {t0:34.13,t1:39.43, p:[IL(8,-40,40,110),IL(8,-22,34,96)], l:[IL(8,0,10,-2),IL(8,0,10,-2)], f:50},
 {t0:39.43,t1:46.59, scp:true, f:48},
 Object.assign({t0:46.59,t1:50.33},isleCam4(1,1.1)),
 Object.assign({t0:50.33,t1:54.29},isleCam4(2,1.3)),
 Object.assign({t0:54.29,t1:57.49},isleCam4(3,1.1)),
 {t0:57.49,t1:60.99, kola:true, f:50},
 {t0:60.99,t1:DUR, p:[L(0,-800,430),L(0,-860,520)], l:[L(0,-320,0),L(0,-320,0)], f:50},
];
const caps=[['c1',.2,6.03,TXT.d0],['c2',2.6,6.03,TXT.d0b],['c1',6.03,12.01,TXT.d1],['c2',9.6,12.01,TXT.d1b],['c1',12.01,19.03,TXT.d2],['c2',15.4,19.03,TXT.d2b],
 ['c1',19.03,24.61,TXT.d3],['c1',24.61,28.73,TXT.d4],['c1',28.73,34.13,TXT.d5],['c1',34.13,39.43,TXT.d6],['c1',39.43,46.59,TXT.d7],['c2',43.4,46.59,TXT.d7b],
 ['c1',46.59,50.33,TXT.d8],['c1',50.33,54.29,TXT.d9],['c1',54.29,57.49,TXT.d10],['c1',57.49,60.99,TXT.d11],['c1',60.99,DUR,TXT.d12],['c2',65.0,DUR,TXT.d12b]];
const TAGS=[
 ['🏟️ 190,000 SEATS','RDA (as BA Europe)',()=>wp12(OLY.who).add(v3(0,4,0)),7.4,12.01],
 ['🚀 RDA TO SPACE','flown by @oneunitedofficial2',()=>wp12(RJET).add(v3(0,7,0)),13.4,16.4],
 ['🗼 SPIRE → OCEAN TOWER','neck hurts',()=>SPIRE.localToWorld(v3(0,SPIRE.userData.H+8,0)),20.0,24.61],
 ['🌉 BRIDGES','egyptian mapper · IRIDO',()=>L(0,-215,40),25.8,28.73],
 ['🏨 HOTEL ISLAND','egyptian mapper',()=>wp12(HOT.who).add(v3(0,4.4,0)),29.8,34.13],
 ['🏺 MORE PYRAMIDS + MUMMIES','socialist Kingdom of Egypt',()=>wp12(EGI.eg).add(v3(0,4.5,0)),35.6,39.43],
 ['🔬 SCP FOUNDATION','Online_Stranger',()=>SCP.localToWorld(v3(0,15,2)),40.8,43.3],
 ["🍔 JACK'S BURGERS",'okbroiknoq · day 1 of asking',()=>wp12(JACK.who).add(v3(0,4.4,0)),47.6,50.33],
 ['🇵🇭 FILIPINO TOWN','K-RYPT13 · shared!',()=>wp12(KRY.who).add(v3(0,4.4,0)),51.4,54.29],
 ['🏟️ NIKOLOZI STADIUM','𖢖NIKOLOZI🍁',()=>wp12(NIK.who).add(v3(0,4.4,0)),55.2,57.49],
 ['🏖️ KOLA BEACH','Kola',()=>KBE.localToWorld(v3(0,8,10)),58.4,60.99],
];
$('tags').innerHTML=TAGS.map(t=>`<div class="ntag"><div class="tt">${t[0]}</div><div class="ts">${t[1]}</div></div>`).join('');
window.CAPTION_TIMES=[...new Set(caps.map(c=>c[1]))].concat(TAGS.map(t=>t[3]),ISL13.map(o=>o.t),ISL13.map(o=>o.tb),[.8,1.6,T_TORCH,T_JET,T_SP,T_BR,T_EG,T_SCP,T_KB,61.8,62.6,65.0,66.0]).map(toR);
window.CUTS=SH.map(s=>s.t0).map(toR);
window.BOOMS=[toR(T_DOOR)];
function popAt(el,t,a,b,{inDur=.28,outDur=.15}={}){
 if(t<a||t>b){el.style.opacity=0;return 0;}
 const k=clamp((t-a)/inDur), ko=clamp((b-t)/outDur);const s= k<1 ? (k<.6? .55+.6*(k/.6) : 1.15-.15*((k-.6)/.4)) : 1;
 el.style.opacity=Math.min(k*2,ko,1); el.style.transform=(el.dataset.base||'')+` scale(${s})`; return 1;}
const proj=(v)=>{const p=v.clone().project(camera);return [(p.x+1)/2*1080,(1-p.y)/2*1920,p.z];};
// the rocket-plane: take-off roll on the hub runway, then straight up
function jetAt(t){const tt=t-T_JET;if(tt<1.4)return AIRI.ref.localToWorld(v3(-28+Math.max(0,tt)*Math.max(0,tt)*16,SEA+T10+.4,4));
 const u=tt-1.4;const base=AIRI.ref.localToWorld(v3(-28+1.96*16+u*40,SEA+T10+.4,4));base.y+=u*u*u*26+u*14;return base;}

window.setTime=function(tr){const t=toD(tr);
 const sh=SH.find(s=>t>=s.t0&&t<s.t1)||SH[SH.length-1];
 const k=ease(clamp((t-sh.t0)/(sh.t1-sh.t0)));
 // everything from Days 5 → 12, alive and fully built
 {const TL=t+100;
  (function(t){const sh={};
//@@LIFE@@
  })(TL);}
 ISL10.forEach(o=>{o.sp.visible=false;});ISL11.forEach(o=>{o.sp.visible=false;});ISL12.forEach(o=>{o.sp.visible=false;});SPCLOUD.forEach(c=>c.visible=false);
 const wide=t<6.03||t>=60.99||sh===SH[4];
 // Titanic keeps sailing, further out
 {const u=-320+((t*5)%640);const p=LW(u,-640),q=LW(u+1,-640);TITAN.visible=true;TITAN.position.set(p.x,SEA+1.2+Math.sin(t*1.1)*.15,p.y);TITAN.lookAt(TITAN.position.clone().add(v3(q.x-p.x,0,q.y-p.y)));TITAN.rotateY(-Math.PI/2);}
 // the new islands
 ISL13.forEach((o,i)=>{const kk=clamp((t-o.t)/.6);o.g.visible=kk>0;if(kk>0){o.g.scale.setScalar(Math.max(.001,backOut(kk)));o.g.position.y=SEA-9+9*ease(kk);}
   const kb=clamp((t-o.tb)/.55);o.bld.visible=kb>0;if(kb>0)o.bld.scale.setScalar(Math.max(.001,backOut(kb)));
   o.sp.material.opacity=1;o.sp.visible=wide&&kk>=1;o.who.rotation.y=Math.sin(t*1.2+i)*.6;});
 // Olympics: torch, athletes, crowd wave
 {const fk=clamp((t-T_TORCH)/.6);OLY.flame.visible=fk>0;OLY.flame.scale.set(fk*(1+Math.sin(t*12)*.08),fk*(1+Math.sin(t*15)*.15),fk*(1+Math.sin(t*12)*.08));
  OLY.ath.forEach((p,i)=>{const a=t*.55+i*.32;const r=21+(i%3)*1.4;p.position.set(Math.cos(a)*r*1.35,.35+Math.abs(Math.sin(t*9+i))*.25,Math.sin(a)*r);p.rotation.y=-a;});
  OLY.who.position.y=3.3+(t>7&&t<12?Math.abs(Math.sin(t*5))*.4:0);}
 // RDA's rocket-plane
 {const on=t>=T_JET-1&&t<19.03;RJET.visible=on;if(on){const P=jetAt(t),Q=jetAt(t+.03);if(Q.distanceTo(P)<1e-3)Q.copy(P).add(AIRI.ref.localToWorld(v3(1,0,0)).sub(AIRI.ref.position));RJET.position.copy(P);RJET.lookAt(Q);
   RJET.userData.fl.forEach((f,i)=>{f.visible=t>T_JET;f.scale.set(1,1+Math.sin(t*40+i)*.3+(t>T_JET+1.4?2.2:0),1);});}
  AIRI.jets.forEach(j=>j.visible=!(t>=T_JET-1.2&&t<19.03));}
 // the spire flies from the Kingdom Tower to the Ocean Tower
 {const kk=ease(clamp((t-T_SP)/2.6));SPIRE.position.lerpVectors(SPW0,OCT,kk);SPIRE.position.y+=Math.sin(kk*Math.PI)*70;SPIRE.quaternion.copy(SPQ);SPIRE.rotateZ(Math.sin(kk*Math.PI)*.25);SPIRE.scale.set(1,1,1);SPIRE.visible=true;}
 // bridges appear one after another, cars drive over them
 BRG.forEach((g,i)=>{const kk=clamp((t-T_BR-i*.045)/.35);g.visible=kk>0;if(kk>0)g.scale.set(1,1,Math.max(.001,ease(kk)));});
 BCARS.forEach((c,i)=>{const g=BRG[(i*5)%BRG.length];c.visible=t>T_BR+2&&g&&g.visible;if(!c.visible)return;const L0=g.children.length;const segs=g.children.filter(q=>q.type==='Group');const n=segs.length;
   const ph=((t*.12+i*.37)%1);const sgi=segs[Math.min(n-1,Math.floor(ph*n))];const lp=sgi.position.clone();lp.x=(i%2?1.2:-1.2);lp.y+=.4;const wpos=g.localToWorld(lp);c.position.copy(wpos);
   const fw=g.localToWorld(v3(0,0,1)).sub(g.position);c.lookAt(wpos.clone().addScaledVector(fw,i%2?1:-1));});
 // Egypt: bigger island + mummies
 {const kk=clamp((t-T_EG)/.8);const s=1+.3*ease(kk);EGI.g.scale.setScalar(s);EGX.visible=t>=T_EG+.5;if(EGX.visible){const ke=clamp((t-T_EG-.5)/.5);EGX.scale.setScalar(Math.max(.001,backOut(ke)));}
  EGX.userData.m.forEach((m,i)=>{m.rotation.y=Math.PI/2+Math.sin(t*1.3+i)*.5;m.children.slice(-4,-2).forEach(a=>a.rotation.z=Math.sin(t*3+i)*.2);});}
 // the SCP door: lights, guards... and it opens a crack
 {SCP.visible=true;const U=SCP.userData;const op=clamp((t-T_DOOR)/1.2);U.dl.position.x=-3-op*1.6;U.dr.position.x=3+op*1.6;U.eyes.forEach(e=>{e.visible=op>.2;e.material.emissiveIntensity=2+Math.sin(t*9)*.6;});
  U.lamps.forEach((l,i)=>l.material.emissiveIntensity=Math.sin(t*8+i*Math.PI)>0?2.4:.2);U.gd.forEach((p,i)=>{p.rotation.y=op>.3?(i?.6:-.6)+Math.sin(t*20)*.1:Math.sin(t*.9+i)*.3;});U.ws.visible=t>T_DOOR-1.4;}
 // Jack's, K-RYPT13, Nikolozi, Hotel island life
 {JACK.burger.rotation.y=t*.8;JACK.burger.position.y=8.2+Math.sin(t*2)*.3;JACK.cu.forEach((p,i)=>{p.position.y=Math.abs(Math.sin(t*4+i))*.2;});}
 {const a=t*.35;KRY.jeep.position.set(Math.cos(a)*9,0,Math.sin(a)*6+2);KRY.jeep.rotation.y=-a-Math.PI/2;KRY.flag.rotation.y=Math.sin(t*3)*.15;KRY.pp.forEach((p,i)=>{const b2=t*.4*(i%2?1:-1)+i;p.position.set(Math.cos(b2)*14,Math.abs(Math.sin(t*4+i))*.15,Math.sin(b2)*12);});}
 {const bp=NIK.ball;const bx=Math.sin(t*1.3)*10,bz=Math.sin(t*2.1)*5;bp.position.set(bx,.4+Math.abs(Math.sin(t*5))*.6,bz);NIK.pl.forEach((p,i)=>{p.position.set(bx+Math.cos(i*1.05+t)*4*(1+i%2),0,bz+Math.sin(i*1.05+t)*3);});}
 {HOT.tour.forEach((p,i)=>{const a=t*.3*(i%2?1:-1)+i*1.1;p.position.set(Math.cos(a)*14,Math.abs(Math.sin(t*4+i))*.12,6+Math.sin(a)*3);p.rotation.y=-a;});}
 // Kola Beach
 {const kk=clamp((t-T_KB)/.6);KBE.visible=kk>0;if(kk>0){KBE.scale.setScalar(Math.max(.001,backOut(kk)));}const sw=KBE.userData.sw;sw.forEach((p,i)=>{p.position.set(-10+i*6,-1.6+Math.sin(t*3+i)*.1,16+(i%2)*2);});
  KBE.userData.ball.position.set(Math.sin(t*1.6)*6,1.4+Math.abs(Math.sin(t*3.2))*4,4);}

 // --- camera
 STARS.material.opacity=0;
 if(sh.jet){const P=jetAt(Math.max(t,T_JET));const back=AIRI.ref.localToWorld(v3(-1,0,0)).sub(AIRI.ref.position).normalize();const side=AIRI.ref.localToWorld(v3(0,0,1)).sub(AIRI.ref.position).normalize();
   if(t<T_JET+1.6){camera.position.copy(AIRI.ref.localToWorld(v3(-40,SEA+T10+9,30)));camera.lookAt(P.clone().add(v3(0,2,0)));}
   else {const u=t-T_JET-1.6;camera.position.copy(P).addScaledVector(back,34).addScaledVector(side,18).add(v3(0,-14-u*2,0));camera.lookAt(P);}
   const sk=clamp((P.y-260)/900);scene.background.copy(SKY0).lerp(SKY1,sk);STARS.material.opacity=clamp((sk-.3)/.4);scene.fog.near=1400+sk*5000;scene.fog.far=2600+sk*8000;
   STREAK.forEach((m,i)=>{const on=t>T_JET+2.2;m.visible=on;if(!on)return;const ph=((t*2.2+i/40)%1);const a=i*2.4;const off=v3(Math.cos(a)*(8+(i%5)*3),0,Math.sin(a)*(8+(i%5)*3));m.position.copy(P).add(off).add(v3(0,40-ph*140,0));m.rotation.set(Math.PI/2,0,0);});}
 else {STREAK.forEach(m=>m.visible=false);
  if(sh.spire){const mid=SPW0.clone().lerp(OCT,.5);const dirc=v3(-(OCT.z-SPW0.z),0,OCT.x-SPW0.x).normalize();camera.position.copy(mid).addScaledVector(dirc,250-20*k).add(v3(0,10,0));camera.lookAt(mid.clone().add(v3(0,10,0)));}
  else if(sh.scp){const U=SCP.userData;const d=v3(U.dir.x,0,U.dir.y);const side=v3(-d.z,0,d.x);const c=SCP.localToWorld(v3(0,6,0));const near=t>T_DOOR-1.2?1:0;
   camera.position.copy(c).addScaledVector(d,(near?26:50)-6*k).addScaledVector(side,(near?3:12)).add(v3(0,near?12:26,0));camera.lookAt(c.clone().add(v3(0,near?1:-1,0)));}
  else if(sh.kola){const c=KBE.localToWorld(v3(0,2,0));camera.position.copy(KBE.localToWorld(v3(-22+8*k,16,46)));camera.lookAt(KBE.localToWorld(v3(0,1,-14)));}
  else {camera.position.lerpVectors(sh.p[0],sh.p[1],k);camera.lookAt(new THREE.Vector3().lerpVectors(sh.l[0],sh.l[1],k));}
  scene.background.copy(SKY0);}
 camera.fov=sh.f||46;camera.near=.5;camera.updateProjectionMatrix();
 STARS.position.copy(camera.position);
 renderer.render(scene,camera);

 // ---------- UI ----------
 const used={c1:false,c2:false};
 for(const [id,a,b,txt] of caps){ if(t>=a&&t<=b){const el=$(id); if(el.dataset.txt!==txt){el.innerHTML=txt;el.dataset.txt=txt;} popAt(el,t,a,b); used[id]=true; } }
 for(const id in used) if(!used[id]) $(id).style.opacity=0;
 $('popn').textContent=(1467).toLocaleString('en-US');
 if(t<30){ $('t_vA').textContent=TXT.oA; $('t_vB').textContent=TXT.oB; popAt($('votes'),t,.5,2.55); const kk=clamp((t-.8)/1.0); $('barA').style.width=(100*kk)+'%'; $('barB').style.width='0%'; $('nA').textContent=kk>.5?'2':''; $('nB').textContent=kk>.5?'0':''; }
 else { $('t_vA').textContent=TXT.vA; $('t_vB').textContent=TXT.vB; popAt($('votes'),t,61.8,65.6); $('barA').style.width='0%'; $('barB').style.width='0%'; $('nA').textContent='?'; $('nB').textContent='?'; }
 [...$('goals').children].forEach(el=>popAt(el,t,99,0));
 [...$('tags').children].forEach((el,i)=>{const [_,__,pf,a,b]=TAGS[i];const pp=proj(pf());el.dataset.base='translate(-50%,-100%)';const hw=el.offsetWidth/2+24;el.style.left=Math.min(1080-hw,Math.max(hw,pp[0]))+'px';el.style.top=Math.max(560+el.offsetHeight+18,pp[1])+'px';popAt(el,t,a,b);if(pp[2]>1)el.style.opacity=0;});
 [...$('laws').children].forEach((c,i)=>popAt(c,t,65.0+i*1.0,DUR));
 let fl=0; for(const c of window.CUTS){ if(c>0&&tr>=c&&tr<c+.12) fl=.5*(1-(tr-c)/.12);} $('flash').style.opacity=fl;
};
window.DUR=RDUR; window.__T2={camera,renderer,scene,L,LW};
document.fonts.ready.then(()=>{window.setTime(0);window.READY=true;});
