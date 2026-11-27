// ===== DAY 8: the zoo wins + your requests =====
// (make_day8.py prepends the Day 5 + Day 6 + Day 7 builds, all already standing)
POP7.forEach(g=>{g.userData.t=-1;});
const POP8=[];
function clearCrowd(u,v,r){const w=LW(u,v);CROWD.forEach(p=>{if(Math.hypot(p.x-w.x,p.z-w.y)<r)p.y=-500;});}
function at8(g,u,v,t,rot=0,y0=0,clr=8){place(g,u,v,t,rot,y0);POP8.push(g);clearCrowd(u,v,clr);return g;}
const tan=std('#d9a441'),brn=std('#8a5a2b'),gry=std('#9aa0a6'),blk=std('#1d232b'),wht=std('#f4f4f4'),org=std('#f28c28');
function quad(g,M,w,d,h,x0=0,y0=0){for(const x of [-w/2,w/2])for(const z of [-d/2,d/2])g.add(box(.22,h,.22,M,x0+x,y0+h/2,z));}
function lion(){const g=new THREE.Group();g.add(box(2.2,1,1,tan,0,1.2,0));quad(g,tan,1.6,.6,.8);const hd=new THREE.Group();hd.add(box(1.15,1.15,.7,brn,0,0,-.05));hd.add(box(.75,.75,.75,tan,.15,0,0));hd.add(box(.25,.2,.3,blk,.55,0,0));hd.position.set(1.3,1.7,0);g.add(hd);g.userData.hd=hd;
 const tl=box(1,.12,.12,tan,-1.5,1.4,0);tl.rotation.z=.6;g.add(tl);g.traverse(o=>o.castShadow=true);return g;}
function elephant(){const g=new THREE.Group();g.add(box(3,2,1.8,gry,0,2.2,0));for(const x of [-1,1])for(const z of [-.6,.6])g.add(cyl(.32,.32,1.4,gry,x,.7,z,8));const hd=new THREE.Group();hd.add(box(1.3,1.3,1.3,gry,0,0,0));
 for(const z of [-.8,.8])hd.add(box(.15,1.3,1.1,gry,-.2,0,z));const tr=cyl(.18,.3,1.8,gry,.75,-1,0,8);hd.add(tr);hd.add(box(.6,.12,.12,wht,.7,-.4,.45));hd.add(box(.6,.12,.12,wht,.7,-.4,-.45));hd.position.set(1.9,2.6,0);g.add(hd);g.userData.hd=hd;g.traverse(o=>o.castShadow=true);return g;}
function giraffe(){const g=new THREE.Group();const y=std('#e8b84a'),sp=std('#9b5a24');g.add(box(2,1,.8,y,0,2.3,0));for(const x of [-.75,.75])for(const z of [-.28,.28])g.add(box(.2,1.9,.2,y,x,.95,z));
 const nk=new THREE.Group();nk.add(box(.4,2.6,.4,y,0,1.3,0));nk.add(box(.9,.45,.45,y,.3,2.6,0));for(const z of [-.12,.12])nk.add(box(.08,.35,.08,sp,0,3,z));nk.position.set(.85,2.6,0);nk.rotation.z=-.25;g.add(nk);g.userData.nk=nk;
 for(let i=0;i<6;i++)g.add(box(.35,.08,.35,sp,-.7+i*.3,2.81,(i%2?.15:-.15)));g.traverse(o=>o.castShadow=true);return g;}
function penguin(){const g=new THREE.Group();const b=new THREE.Mesh(new THREE.CapsuleGeometry(.28,.45,4,8),blk);b.position.y=.55;g.add(b);g.add(box(.3,.5,.12,wht,0,.52,.22));const bk=new THREE.Mesh(new THREE.ConeGeometry(.08,.22,6),org);bk.rotation.x=Math.PI/2;bk.position.set(0,.85,.3);g.add(bk);g.traverse(o=>o.castShadow=true);return g;}
function monkey(){const g=new THREE.Group();const b=std('#7a4a26');g.add(new THREE.Mesh(new THREE.SphereGeometry(.4,8,6),b));const h=new THREE.Mesh(new THREE.SphereGeometry(.3,8,6),b);h.position.set(0,.55,.1);g.add(h);g.add(box(.3,.22,.1,std('#e8c49a'),0,.52,.36));g.traverse(o=>o.castShadow=true);return g;}
function dog(s=1,c='#c98a4b'){const g=new THREE.Group();const m=std(c),d=std('#6b4423');g.add(box(1.6*s,.8*s,.7*s,m,0,.9*s,0));quad(g,m,1.1*s,.45*s,.55*s);const hd=new THREE.Group();hd.add(box(.7*s,.65*s,.6*s,m,0,0,0));hd.add(box(.4*s,.3*s,.4*s,m,.45*s,-.12*s,0));hd.add(box(.12*s,.12*s,.12*s,blk,.68*s,-.05*s,0));
 for(const z of [-.24,.24]){const e=box(.15*s,.4*s,.2*s,d,-.1*s,.35*s,z*s);e.rotation.x=z>0?-.3:.3;hd.add(e);}hd.position.set(.95*s,1.45*s,0);g.add(hd);const tl=box(.12*s,.6*s,.12*s,m,-.85*s,1.4*s,0);tl.rotation.z=.5;g.add(tl);g.userData.tl=tl;g.userData.hd=hd;g.traverse(o=>o.castShadow=true);return g;}
function kitty(c='#f2a33a',s=1){const g=new THREE.Group();const cm=std(c);g.add(box(.7*s,.32*s,.4*s,cm,0,.3*s,0));g.add(box(.34*s,.3*s,.3*s,cm,.42*s,.55*s,0));for(const z of [-.1,.1]){const e=new THREE.Mesh(new THREE.ConeGeometry(.07*s,.15*s,4),cm);e.position.set(.42*s,.76*s,z*s);g.add(e);}const tl=box(.5*s,.07*s,.07*s,cm,-.5*s,.5*s,0);tl.rotation.z=.8;g.add(tl);g.userData.tl=tl;g.traverse(o=>o.castShadow=true);return g;}
const fence=(g,x0,x1,z0,z1,y,c='#8a5a33',gap=0)=>{const M=std(c);const L1=(ax,az,bx,bz)=>{const len=Math.hypot(bx-ax,bz-az);const b=box(len,1,.15,M,(ax+bx)/2,y+.5,(az+bz)/2);b.rotation.y=-Math.atan2(bz-az,bx-ax);g.add(b);};
 L1(x0,z0,x1,z0);L1(x0,z0,x0,z1);L1(x1,z0,x1,z1);if(gap){L1(x0,z1,-gap,z1);L1(gap,z1,x1,z1);}else L1(x0,z1,x1,z1);};
const tree8=(s=1)=>{const g=new THREE.Group();g.add(cyl(.25*s,.35*s,3*s,MT.wood,0,1.5*s,0,6));const lf=new THREE.Mesh(new THREE.IcosahedronGeometry(1.6*s,0),std('#3f9a45'));lf.position.y=3.6*s;lf.castShadow=true;g.add(lf);return g;};

// ---------- 🦁 HERBERG ZOO (vote winner, @kofipif)
const ZU=78,ZV=86;clearTrees([[ZU-18,ZU+18,ZV-13,ZV+13]]);
const zoo=at8((()=>{const g=slab(32,22,'#8fc76a',ZU,ZV);const T=g.userData.top;const sand=std('#e3c88f'),path=std('#d8cdb8');
 g.add(box(32,.08,3,path,0,T+.04,0));g.add(box(3,.08,22,path,0,T+.05,0));fence(g,-15.5,15.5,-10.5,10.5,T,'#6b4a2b',2.2);
 // pens: lion (back-left), elephant (back-right), penguins (front-left), giraffe (front-right)
 g.add(box(12,.1,7.5,sand,-8.5,T+.06,-6));fence(g,-14.5,-2.5,-9.8,-2.2,T,'#4a4a4a');const rk=new THREE.Mesh(new THREE.DodecahedronGeometry(1.4,0),MT.stone);rk.position.set(-12,T+.8,-7.5);g.add(rk);
 g.add(box(12,.1,7.5,std('#b9a27a'),8.5,T+.06,-6));fence(g,2.5,14.5,-9.8,-2.2,T,'#4a4a4a');
 g.add(box(12,.1,7.5,std('#cfe8f2'),-8.5,T+.06,6));g.add(box(6,.12,4,std('#3aa7d8',{roughness:.2}),-10,T+.08,6.5));fence(g,-14.5,-2.5,2.2,9.8,T,'#e9f0f5');
 g.add(box(12,.1,7.5,std('#a7cf6a'),8.5,T+.06,6));fence(g,2.5,14.5,2.2,9.8,T,'#6b4a2b');const tt=tree8(1.4);tt.position.set(12.5,T,4);g.add(tt);
 const L1=lion();L1.position.set(-9,T,-6);g.add(L1);const L2=lion();L2.scale.setScalar(.8);L2.position.set(-5.5,T,-4.2);L2.rotation.y=2.4;g.add(L2);
 const E1=elephant();E1.position.set(8,T,-6);E1.rotation.y=Math.PI;g.add(E1);const E2=elephant();E2.scale.setScalar(.6);E2.position.set(12,T,-4);E2.rotation.y=2.6;g.add(E2);
 const G1=giraffe();G1.position.set(7,T,6);G1.rotation.y=-.4;g.add(G1);const G2=giraffe();G2.scale.setScalar(.8);G2.position.set(10.5,T,7.6);G2.rotation.y=2.8;g.add(G2);
 const pens=[];for(let i=0;i<6;i++){const p=penguin();p.position.set(-13.5+i*1.1,T,3.4+(i%2)*.8);g.add(p);pens.push(p);}
 const mk=monkey();mk.position.set(12.5,T+4.2,4.9);g.add(mk);
 const gate=new THREE.Group();for(const x of [-2.6,2.6])gate.add(box(.6,5,.6,std('#6b4a2b'),x,2.5,0));const s=sign('HERBERG ZOO','#2f8f3a','#ffffff',6,1.1);s.position.set(0,5.2,.35);gate.add(s);gate.position.set(0,T,10.6);g.add(gate);
 const kp=pawn('#7a8a3a',1.05);kp.add(cyl(.55,.55,.12,std('#c9b27a'),0,1.92,0,12));kp.add(cyl(.32,.34,.3,std('#c9b27a'),0,2.06,0,12));kp.position.set(1.8,T,4.6);g.add(kp);
 const vis=[];for(let i=0;i<6;i++){const v=pawn(['#e85d75','#3e8fe6','#f2d33a','#7bd65b','#9b59d6','#ff8a4c'][i],i%3?.85:.6);v.position.set(-6+i*2.4,T,i%2?1.2:-1.2);g.add(v);vis.push(v);}
 g.userData={L1,L2,E1,E2,G1,G2,pens,mk,kp,vis,T};g.traverse(o=>o.castShadow=true);return g;})(),ZU,ZV,9.6,0,0,16);

// ---------- 🐱 GARLIC CORP HQ, named after Garlic the cat (@christmastime4167)
const garlic=at8((()=>{const g=new THREE.Group();const pu=std('#7a4fd1'),pl=std('#efe6ff');g.add(box(9,22,8,pu,0,11,0));for(let f=0;f<7;f++)g.add(box(9.1,.9,8.1,MT.glass,0,3+f*2.8,0));g.add(box(9.6,.6,8.6,pl,0,22.3,0));
 const s=sign('GARLIC CORP','#ffffff','#7a4fd1',7,1.2);s.position.set(0,19.6,4.06);g.add(s);const ct=kitty('#f6f1e4',5);ct.position.set(0,0,7.5);ct.rotation.y=-Math.PI/2;g.add(ct);g.userData.ct=ct;
 g.add(box(4,.5,2.2,MT.stone,0,.25,7.5));g.traverse(o=>o.castShadow=true);return g;})(),20,63,17.6,0,0,9);

// ---------- 🩺 top doctor at the hospital (@be_not_afra1d)
const doctor=at8((()=>{const g=new THREE.Group();const d=pawn('#ffffff',1.1);d.add(box(.62,.08,.06,blk,0,1.3,.31));d.add(box(.08,.4,.06,blk,.18,1.1,.31));d.add(cyl(.09,.09,.06,std('#c0c6cc'),.18,.88,.33,10));g.add(d);g.userData.d=d;
 for(const x of [-1.4,1.4]){const n=pawn('#5ec7c2',.9);n.position.set(x,0,-.4);g.add(n);}g.add(box(1.2,.5,2.2,MT.white,3,.6,0));g.add(box(1.25,.12,2.25,std('#5ec7c2'),3,.9,0));g.traverse(o=>o.castShadow=true);return g;})(),-36,39.6,21.6,0,0,4);

// ---------- 🏠 Herberg Children's Home (@online_stranger7)
const orph=at8((()=>{const g=slab(14,11,'#9fd27a',33,85);const T=g.userData.top;const h=homeModel(8,5,4,std('#ffd9b8'),std('#e8605a'),3);h.position.set(-2,T,-1.5);g.add(h);
 const s=sign("CHILDREN'S HOME",'#ffffff','#e8605a',5,.8);s.position.set(-2,T+3.2,1.05);g.add(s);const sw=new THREE.Group();sw.add(box(.15,3,.15,std('#e8334f'),-1.2,1.5,0));sw.add(box(.15,3,.15,std('#e8334f'),1.2,1.5,0));sw.add(box(2.6,.15,.15,std('#e8334f'),0,3,0));
 const seat=new THREE.Group();seat.add(box(.04,2.2,.04,MT.dark,0,-1.1,0));const kd=pawn('#3e8fe6',.5);kd.position.y=-2.4;seat.add(kd);seat.position.y=3;sw.add(seat);sw.position.set(4.5,T,2.5);g.add(sw);g.userData.seat=seat;
 const kids8=[];for(let i=0;i<5;i++){const k=pawn(['#e85d75','#f2d33a','#7bd65b','#9b59d6','#ff8a4c'][i],.5);k.position.set(-4.5+i*1.5,T,3.4);g.add(k);kids8.push(k);}const ad=pawn('#2f8f7a',.95);ad.position.set(-5.5,T,2.2);g.add(ad);g.userData.kids=kids8;g.userData.T=T;
 g.traverse(o=>o.castShadow=true);return g;})(),33,85,25.6,0,0,8);

// ---------- 📱 phone store (@kengkengismeeeee)
const phones=at8((()=>{const g=new THREE.Group();g.add(box(9,4.6,6,std('#f7f7f7'),0,2.3,0));g.add(box(8.6,3.6,.08,MT.glass,0,2,3.02));g.add(box(9.2,.4,6.2,std('#2b2f3d'),0,4.7,0));
 const s=sign('PHONE STORE','#2b2f3d','#ffffff',5,.8);s.position.set(0,4.1,3.12);g.add(s);for(const x of [-2.4,2.4]){g.add(box(2.6,.9,1.2,std('#d8c3a5'),x,.45,4.4));for(let k=0;k<3;k++){const ph=box(.4,.06,.75,blk,x-.8+k*.8,.95,4.4);g.add(ph);g.add(box(.34,.02,.66,std('#4aa3ff',{emissive:'#4aa3ff',emissiveIntensity:.8}),x-.8+k*.8,.99,4.4));}}
 const big=new THREE.Group();big.add(box(1.6,3,.25,blk,0,0,0));big.add(box(1.4,2.7,.05,std('#ff7ab6',{emissive:'#ff4fa0',emissiveIntensity:.7}),0,0,.14));big.position.set(0,7,0);g.add(big);g.userData.big=big;
 const cl=pawn('#2f7de1',.95);cl.position.set(0,0,4.6);g.add(cl);for(const x of [-3.6,3.6]){const c=pawn(x<0?'#f2d33a':'#e85d75',.85);c.position.set(x,0,5.4);g.add(c);}g.traverse(o=>o.castShadow=true);return g;})(),-1,46,29.6,0,0,6);

// ---------- 🏫 Herberg High School (@raphaelryeku)
const high=at8((()=>{const g=new THREE.Group();const bl=std('#8fb8e8');g.add(box(16,7,7,bl,0,3.5,-1));g.add(box(16.4,.5,7.4,MT.white,0,7.2,-1));for(let f=0;f<2;f++)for(let k=0;k<6;k++)g.add(box(1.5,1.3,.06,MT.glass,-6.2+k*2.5,2+f*3,2.53));
 const s=sign('HERBERG HIGH','#ffffff','#1d3f8a',6,1);s.position.set(0,6,2.6);g.add(s);g.add(box(1.4,7.5,1.4,MT.white,7.6,3.75,2));const bell=cyl(.4,.4,1,std('#f2c230'),7.6,8,2,10);g.add(bell);
 g.add(box(12,.15,6,std('#d9774b'),0,.08,6.2));const hoop=box(.12,3.2,.12,MT.white,5.5,1.6,8.8);g.add(hoop);g.add(box(1,.7,.08,MT.white,5.5,3.3,8.7));const ball=new THREE.Mesh(new THREE.SphereGeometry(.28,10,8),std('#f28c28'));g.add(ball);g.userData.ball=ball;
 const st=[];for(let i=0;i<5;i++){const p=pawn(['#e85d75','#3e8fe6','#f2d33a','#7bd65b','#9b59d6'][i],.75);p.position.set(-4+i*2,0,5.6+(i%2)*1.4);g.add(p);st.push(p);}g.userData.st=st;g.traverse(o=>o.castShadow=true);return g;})(),-16,63,33.6,0,0,11);

// ---------- 🏊 public swimming pool (@hotdog_editz1)
const pool=at8((()=>{const g=new THREE.Group();g.add(box(18,.3,12,std('#e9e2d0'),0,.15,0));const w=box(14,.12,8,std('#3fb6e8',{roughness:.15,metalness:.1}),0,.32,0);g.add(w);g.userData.w=w;
 for(let k=-2;k<=2;k++)g.add(box(14,.05,.08,MT.white,0,.4,k*1.6));const db=box(.8,.15,3,MT.white,0,1.8,-4.8);g.add(db);g.add(box(.6,1.8,.6,MT.white,0,.9,-5.8));
 const hd=pawn('#e8334f',.85);g.add(hd);g.userData.hd=hd;const sw=[];for(let i=0;i<4;i++){const p=pawn(['#3e8fe6','#f2d33a','#7bd65b','#ff8a4c'][i],.7);p.position.set(-5+i*3.2,-.6,i%2?1.6:-1.6);g.add(p);sw.push(p);}g.userData.sw=sw;
 for(const x of [-7.6,7.6]){const u=new THREE.Group();u.add(cyl(.06,.06,2.6,MT.white,0,1.3,0,6));const top=new THREE.Mesh(new THREE.ConeGeometry(1.6,.6,8),std(x<0?'#e8334f':'#f2d33a'));top.position.y=2.7;u.add(top);u.position.set(x,0,4.6);g.add(u);}
 const s=sign('HERBERG POOL','#ffffff','#2f8fe0',4,.7);s.position.set(0,1.1,6.05);g.add(s);g.traverse(o=>o.castShadow=true);return g;})(),52,-12,37.6,0,0,10);

// ---------- 🐕 the blue skyscraper with a dog on top (@haz3398, @grand.rejent)
const blueTower=at8((()=>{const g=new THREE.Group();const b=std('#2f7de1',{metalness:.3,roughness:.35}),gl=std('#9fd0ff',{metalness:.4,roughness:.15});g.add(box(9,46,9,b,0,23,0));for(let f=0;f<15;f++)g.add(box(9.1,.8,9.1,gl,0,2.8+f*3,0));
 g.add(box(10,.8,10,std('#1d4f9a'),0,46.4,0));const dg=dog(3.4,'#d99a52');dg.position.set(0,46.8,0);g.add(dg);g.userData.dg=dg;g.userData.top=46.8;g.traverse(o=>o.castShadow=true);return g;})(),3,65,41.6,0,0,8);

// ---------- ✈️ fighter jet + pilot Bob (@baraqiqy)
const jet=(()=>{const g=new THREE.Group();const gm=std('#8b98a6'),dk=std('#55606b');const fu=cyl(.55,.9,8,gm,0,0,0,10);fu.rotation.x=Math.PI/2;g.add(fu);const nose=new THREE.Mesh(new THREE.ConeGeometry(.55,2.4,10),gm);nose.rotation.x=Math.PI/2;nose.position.z=5.2;g.add(nose);
 const wing=new THREE.Mesh(new THREE.BufferGeometry().setFromPoints([v3(0,0,2.4),v3(-5,0,-2),v3(5,0,-2)]),gm);wing.geometry.computeVertexNormals();wing.material=std('#8b98a6',{side:THREE.DoubleSide});g.add(wing);
 g.add(box(.12,2.2,1.8,dk,0,1.2,-3.2));for(const x of [-1.4,1.4])g.add(box(2.4,.1,1.1,dk,x,0,-3.6));const can=new THREE.Mesh(new THREE.SphereGeometry(.55,10,8),MT.glass);can.scale.set(1,.8,2);can.position.set(0,.65,2.4);g.add(can);
 const pl=pawn('#4a5a3a',.45);pl.add(new THREE.Mesh(new THREE.SphereGeometry(.24,8,6),std('#f2f2f2')).translateY(1.65));pl.position.set(0,.05,2.2);g.add(pl);const fl=box(.6,.6,1.2,std('#ff8a2a',{emissive:'#ff6a00',emissiveIntensity:2}),0,0,-4.4);g.add(fl);g.userData.fl=fl;
 g.traverse(o=>o.castShadow=true);g.scale.setScalar(1.4);g.visible=false;scene.add(g);return g;})();
const JC=L(10,40,0);const jetPos=t=>{const a=-(t-44)*.42;return v3(JC.x+Math.cos(a)*70,JC.y+48+Math.sin(t*.9)*3,JC.z+Math.sin(a)*58);};

// ---------- 🚨 SWAT headquarters (@samsamsamsams4m)
const swat=at8((()=>{const g=new THREE.Group();const dk=std('#2b2f36');g.add(box(10,6,7,dk,0,3,-1));g.add(box(10.4,.5,7.4,std('#1b1e23'),0,6.2,-1));const s=sign('SWAT HQ','#1b1e23','#ffffff',4.2,.9);s.position.set(0,4.6,2.56);g.add(s);
 const van=new THREE.Group();van.add(box(2.2,2.2,5,blk,0,1.4,0));van.add(box(2,.7,.08,MT.glass,0,1.9,2.52));for(const x of [-1,1])for(const z of [-1.6,1.6]){const w=cyl(.42,.42,.3,MT.dark,x*1.05,.42,z,10);w.rotation.z=Math.PI/2;van.add(w);}const vs=sign('SWAT','#1b1e23','#ffffff',1.8,.5);vs.position.set(1.12,1.6,0);vs.rotation.y=Math.PI/2;van.add(vs);
 const lb=box(1.2,.2,.3,std('#2a6dff',{emissive:'#2a6dff',emissiveIntensity:1}),0,2.6,.8);van.add(lb);van.position.set(-6.5,0,3);g.add(van);g.userData.lb=lb;
 const team=[];for(let i=0;i<4;i++){const p=pawn('#2b2f36',.95);p.add(cyl(.36,.38,.3,blk,0,1.95,0,10));p.add(box(.6,.7,.08,std('#3a3f46'),0,1.1,.3));p.position.set(-1.5+i*1.5,0,4.2);g.add(p);team.push(p);}g.userData.team=team;
 g.traverse(o=>o.castShadow=true);return g;})(),-54,46,49.6,0,0,9);

// ---------- 🐶 pet store (@javdere)
const pets=at8((()=>{const g=new THREE.Group();g.add(box(8,4.2,5.5,std('#ffe0a3'),0,2.1,0));g.add(roof4(8.6,1.4,std('#3aa7a0'),6));g.add(box(5,2.4,.08,MT.glass,0,1.6,2.78));const aw=box(8.4,.25,1.6,std('#3aa7a0'),0,3.3,3.4);aw.rotation.x=.25;g.add(aw);
 const s=sign('PET STORE','#ffffff','#3aa7a0',4,.8);s.position.set(0,3.9,2.8);g.add(s);const jv=pawn('#e8334f',1);jv.position.set(2.6,0,4.6);g.add(jv);
 const pups=[];[['#c98a4b',0],['#f4f4f4',1],['#3b3b3b',0]].forEach(([c,k],i)=>{const d=dog(.45,c);d.position.set(-2.8+i*1.4,0,4.6);d.rotation.y=-Math.PI/2+.3*i;g.add(d);pups.push(d);});
 const kits=[];['#f2a33a','#9a9a9a'].forEach((c,i)=>{const k=kitty(c,.8);k.position.set(.6+i*1.2,0,5.6);k.rotation.y=-Math.PI/2-.4;g.add(k);kits.push(k);});g.userData.pups=pups;g.userData.kits=kits;
 g.traverse(o=>o.castShadow=true);return g;})(),62,-2,53.6,0,0,7);

const ZL=(du,dv,h)=>{const p=L(ZU+du,ZV+dv);return v3(p.x,zoo.position.y+zoo.userData.T+h,p.z);};
const SH=[
 {t0:0,   t1:4,   p:[L(60,-150,120),L(66,-140,112)], l:[L(0,40,10),L(0,40,10)], f:46},
 {t0:4,   t1:9,   p:[L(50,40,46),L(54,44,42)], l:[L(76,86,2),L(76,86,2)], f:50},
 {t0:9,   t1:13,  p:[L(58,50,40),L(66,54,32)], l:[L(78,86,0),L(78,86,1)], f:52},
 {t0:13,  t1:17,  p:[ZL(-5,-25,14),ZL(-2,-24,17)], l:[ZL(-1,0,1),ZL(0,0,1)], f:54},
 {t0:17,  t1:21,  p:[L(30,32,16),L(28,34,18)], l:[L(20,62,8),L(20,62,11)], f:54},
 {t0:21,  t1:25,  p:[L(-35,33,4.4),L(-36.5,33.6,4.2)], l:[L(-36,40,2),L(-36,40,2)], f:55},
 {t0:25,  t1:29,  p:[L(42,70,22),L(39,71,20)], l:[L(33,86,7),L(33,86,7)], f:52},
 {t0:29,  t1:33,  p:[L(4,33,20),L(2,34,18)], l:[L(-1,46,2),L(-1,46,2)], f:55},
 {t0:33,  t1:37,  p:[L(-6,44,12),L(-8,45,11)], l:[L(-16,63,3),L(-16,63,3)], f:54},
 {t0:37,  t1:41,  p:[L(62,-30,14),L(60,-29,13)], l:[L(52,-12,0),L(52,-12,0)], f:54},
 {t0:41,  t1:45,  p:[L(-16,22,30),L(-13,25,36)], l:[L(3,65,40),L(3,65,46)], f:56},
 {t0:45,  t1:49,  jet:true, f:52},
 {t0:49,  t1:53,  p:[L(-46,30,10),L(-48,31,9)], l:[L(-54,46,2),L(-54,46,2)], f:54},
 {t0:53,  t1:57,  p:[L(72,-22,10),L(69,-21,9)], l:[L(62,-1,2),L(62,-1,2)], f:54},
 {t0:57,  t1:66,  p:[L(70,-112,168),L(84,-132,196)], l:[L(0,40,0),L(0,40,0)], f:46},
];
const DUR=66;
const TD=[0,4.2,9.2,17.2,21.2,25.2,29.2,33.2,37.2,41.2,45.2,49.2,53.2,57.2,66];
const TR=window.DAY8_TR||TD, RDUR=TR[TR.length-1];
const pw=(x,A,B)=>{for(let i=0;i<A.length-1;i++)if(x<=A[i+1]||i==A.length-2)return B[i]+(B[i+1]-B[i])*clamp((x-A[i])/(A[i+1]-A[i]));};
const toD=tr=>pw(tr,TR,TD), toR=td=>pw(td,TD,TR);
const caps=[
 ['c1',.2,4,TXT.d0],['c1',4.2,9,TXT.d1],['c1',9.2,17,TXT.d2],['c1',17.2,21,TXT.d3],['c1',21.2,25,TXT.d4],['c1',25.2,29,TXT.d5],['c1',29.2,33,TXT.d6],
 ['c1',33.2,37,TXT.d7],['c1',37.2,41,TXT.d8],['c1',41.2,45,TXT.d9],['c1',45.2,49,TXT.d10],['c1',49.2,53,TXT.d11],['c1',53.2,57,TXT.d12],['c1',57.2,DUR,TXT.d13],['c2',61,DUR,TXT.d13b],
];
const wp=g=>g.getWorldPosition(v3(0,0,0));
const TAGS=[
 ['🦁 HERBERG ZOO','@kofipif',()=>L(78,86,14),10.4,13],
 ['🧑‍🌾 HEAD ZOOKEEPER','@kofipif',()=>wp(zoo.userData.kp).add(v3(0,3,0)),14.0,17],
 ['🐱 GARLIC CORP HQ','@christmastime4167',()=>L(20,63,26),18.0,21],
 ['🩺 TOP DOCTOR','@be_not_afra1d',()=>wp(doctor.userData.d).add(v3(0,2.8,0)),22.0,25],
 ["🏠 CHILDREN'S HOME",'@online_stranger7',()=>L(33,85,9),26.0,29],
 ['📱 PHONE STORE','@kengkengismeeeee',()=>L(-1,46,10),30.0,33],
 ['🏫 HIGH SCHOOL','@raphaelryeku',()=>L(-16,63,10),34.0,37],
 ['🏊 SWIMMING POOL','@hotdog_editz1',()=>L(52,-12,5),38.0,41],
 ['🐕 BLUE DOG TOWER','@haz3398 · @grand.rejent',()=>L(3,65,60),42.0,45],
 ['✈️ JET PILOT','@baraqiqy',()=>jet.position.clone().add(v3(0,4,0)),46.0,49],
 ['🚨 SWAT HQ','@samsamsamsams4m',()=>L(-54,46,9),50.0,53],
 ['🐶 PET STORE','@javdere',()=>L(62,-2,8),54.0,57],
];
$('tags').innerHTML=TAGS.map(t=>`<div class="ntag"><div class="tt">${t[0]}</div><div class="ts">${t[1]}</div></div>`).join('');
window.CAPTION_TIMES=[...new Set(caps.map(c=>c[1]))].concat(TAGS.map(t=>t[3]),[4.6,5.0,58.4,59.0],POP8.map(g=>g.userData.t)).map(toR);
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
 { jet.visible=t>=44.6;const p=jetPos(t),q=jetPos(t+.05);jet.position.copy(p);jet.lookAt(q);jet.rotateZ(-.45);jet.userData.fl.scale.z=1+Math.sin(t*40)*.3; }
 if(sh.jet){const p=jetPos(t),q=jetPos(t+.05);const d=q.clone().sub(p).normalize();const side=v3(-d.z,0,d.x);camera.position.copy(p).addScaledVector(d,-20+6*k).addScaledVector(side,-9).add(v3(0,5,0));camera.lookAt(p.clone().addScaledVector(d,6));}
 else {camera.position.lerpVectors(sh.p[0],sh.p[1],k); camera.lookAt(new THREE.Vector3().lerpVectors(sh.l[0],sh.l[1],k));}
 camera.fov=sh.f||46; camera.updateProjectionMatrix();
 clouds.forEach((c,i)=>{c.userData.bx??=c.position.x;c.position.x=c.userData.bx+t*1.4*(i%2?1:-1);});
 smoke.forEach((b,i)=>{const ph=((t*.12+i/smoke.length)%1);b.position.set(V.x+ph*20+Math.sin(i*3)*3,H(V.x,V.y)+5+ph*40,V.y-ph*9);b.scale.setScalar(.9+ph*3);b.material.opacity=.6*(1-ph);});
 lava.material.color.setHSL(.06,1,.5+.06*Math.sin(t*4));
 ghosts.forEach(g=>g.visible=false); pawns.forEach(p=>p.visible=false); flagGrp.visible=false; siteA.visible=siteB.visible=false;
 cutAt(t);
 for(const g of roadParts)g.visible=true;
 for(const g of NEW){ if(POP8.includes(g))continue; g.visible=true;g.scale.setScalar(1);
   if(g.userData.base!==undefined){g.position.y=g.userData.base+Math.sin(t*1.5+g.position.x)*.15;g.rotation.z=Math.sin(t*1.2+g.position.z)*.04;}}
 for(const g of POP){g.visible=true;g.scale.setScalar(1);}
 for(const g of POP7){g.visible=true;g.scale.setScalar(1);if(g.userData.base!==undefined){g.position.y=g.userData.base+Math.sin(t*1.5+g.position.x)*.12;}}
 for(const g of POP8){const kk=clamp((t-g.userData.t)/.5);g.visible=kk>0;if(kk>0)g.scale.setScalar(Math.max(.001,backOut(kk)));}
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

 renderer.render(scene,camera);

 // ---------- UI ----------
 const used={c1:false,c2:false};
 for(const [id,a,b,txt] of caps){ if(t>=a&&t<=b){const el=$(id); if(el.dataset.txt!==txt){el.innerHTML=txt;el.dataset.txt=txt;} popAt(el,t,a,b); used[id]=true; } }
 for(const id in used) if(!used[id]) $(id).style.opacity=0;
 $('popn').textContent=(1466).toLocaleString('en-US');
 popAt($('votes'),t,4.6,9); const vk=ease(clamp((t-5.0)/1.0));
 $('barA').style.width=(100*vk)+'%'; $('barB').style.width='0%'; $('nA').textContent=Math.round(3*vk); $('nB').textContent='0';
 [...$('goals').children].forEach(el=>popAt(el,t,99,0));
 [...$('tags').children].forEach((el,i)=>{const [_,__,pf,a,b]=TAGS[i];const pp=proj(pf());el.dataset.base='translate(-50%,-100%)';const hw=el.offsetWidth/2+24;el.style.left=Math.min(1080-hw,Math.max(hw,pp[0]))+'px';el.style.top=Math.max(560+el.offsetHeight+18,pp[1])+'px';popAt(el,t,a,b);if(pp[2]>1)el.style.opacity=0;});
 [...$('laws').children].forEach((c,i)=>popAt(c,t,58.4+i*.6,DUR));
 let fl=0; for(const c of window.CUTS){ if(c>0&&tr>=c&&tr<c+.12) fl=.5*(1-(tr-c)/.12);} $('flash').style.opacity=fl;
};
window.DUR=RDUR; window.__T2={camera,renderer,scene,L,LW};
document.fonts.ready.then(()=>{window.setTime(0);window.READY=true;});
