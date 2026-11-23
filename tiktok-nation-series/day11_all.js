window.DAY11_TR=[0, 6.55, 15.53, 21.04, 25.25, 29.97, 36.48, 41.71, 47.22, 50.89, 57.46, 63.36, 71.19, 81.58];
// ===== DAY 5: the beach resort wins + your requests =====
const ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const backOut=k=>{const c=1.9;return 1+(c+1)*Math.pow(k-1,3)+c*Math.pow(k-1,2);};
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
 const PC=['#f2a33a','#30c2a8','#9b59d6','#e85d75','#3e8fe6','#f2d33a','#ff8a4c','#ff6fb1'];
 for(let i=0;i<18;i++){const a=i*.83+.2,r=11.5+(i%3)*1.6;const pw2=pawn(PC[i%8],.75);pw2.position.set(Math.sin(a)*r,ry(r),Math.cos(a)*r);g.add(pw2);}
 for(let i=0;i<3;i++){const h=new THREE.Mesh(new THREE.SphereGeometry(.28,10,8),std(PC[i+2]));h.position.set(-2.5+i*2.4,ry(9)+.5,9+(i%2?.8:-.8));g.add(h);}
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
 tw.position.set(6,5,0);g.add(tw);
 g.add(box(20,.12,9,MT.road,0,.06,9.6));for(let i=0;i<8;i++){const c=new THREE.Group();c.add(box(1.6,.7,3.2,std(['#e8334f','#2f7de1','#f2f2f2','#3a3a3a','#4fbf3a','#f2d33a','#9b59d6','#ff8a4c'][i]),0,.55,0));c.add(box(1.4,.55,1.6,MT.glass,0,1.1,-.2));c.position.set(-8.4+i*2.4,0,9.6+(i%2?2.2:-2.2));g.add(c);}
 for(let i=0;i<5;i++)g.add(box(.12,.02,4,MT.white,-9.6+i*4.8,.13,9.6));g.traverse(o=>o.castShadow=true);return g;})(),-18,85,22.4);
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
;
// flower beds around the new builds
[[26,74.5],[22,79],[30,79],[-60,80],[-72,80],[-12,78.8],[-24,78.8],[56,78],[36,78]].forEach(([u,v],j)=>{const g=new THREE.Group();g.add(box(3,.3,1.4,std('#7a5133'),0,.15,0));for(let k=0;k<7;k++){const f=new THREE.Mesh(new THREE.SphereGeometry(.28,8,6),std(['#ff6fb1','#f2d33a','#e8334f','#ffffff','#9b59d6'][(k+j)%5]));f.position.set(-1.2+k*.4,.45,(k%2?.3:-.3));g.add(f);}place(g,u,v,-1);});
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

// ===== DAY 7: the railway wins + your requests =====
// (make_day7.py prepends the Day 5 + Day 6 builds, all already standing)
POP.forEach(g=>{g.userData.t=-1;});
const POP7=[];
function fireTruck(){const g=new THREE.Group();const rd=std('#d92b25'),wh=std('#f4f4f4');g.add(box(2.3,1.9,5.2,rd,0,1.35,-.4));g.add(box(2.3,1.5,1.7,rd,0,1.15,2.95));g.add(box(2.1,.7,.08,MT.glass,0,1.55,3.82));
 g.add(box(2.34,.25,5.24,wh,0,1.0,-.4));const lad=new THREE.Group();lad.add(box(.12,.12,5,MT.white,-.45,0,0));lad.add(box(.12,.12,5,MT.white,.45,0,0));for(let k=-2;k<=2;k++)lad.add(box(.9,.08,.08,MT.white,0,0,k));lad.position.set(0,2.45,-.6);lad.rotation.x=-.06;g.add(lad);
 const lr=box(.6,.25,.4,std('#ff2a2a',{emissive:'#ff2a2a',emissiveIntensity:1}),-.45,2.05,3.1),lb=box(.6,.25,.4,std('#2a6dff',{emissive:'#2a6dff',emissiveIntensity:1}),.45,2.05,3.1);g.add(lr,lb);g.userData={lr,lb};
 for(const x of [-1.1,1.1])for(const z of [-2.2,-.6,2.8]){const w=cyl(.45,.45,.3,MT.dark,x,.45,z,10);w.rotation.z=Math.PI/2;g.add(w);}g.traverse(o=>o.castShadow=true);g.scale.setScalar(1.15);scene.add(g);return g;}
function at7(g,u,v,t,rot=0,y0=0){place(g,u,v,t,rot,y0);POP7.push(g);return g;}
const crown=(s=1)=>{const c=new THREE.Group();const gold=std('#f2c230',{metalness:.6,roughness:.3});c.add(cyl(.32*s,.32*s,.22*s,gold,0,0,0,12));for(let i=0;i<5;i++){const a=i/5*Math.PI*2;const sp=new THREE.Mesh(new THREE.ConeGeometry(.08*s,.25*s,6),gold);sp.position.set(Math.cos(a)*.27*s,.2*s,Math.sin(a)*.27*s);c.add(sp);}return c;};

// ---------- 🚂 THE RAILWAY (vote winner): elevated line over Avenue 36 + Herberg Central (@newhamm.william @k17.gaming)
const RLV=36, RLY=L(0,RLV).y+9, RU0=-76, RU1=92;
const railway=(()=>{const g=new THREE.Group();const deckM=std('#b9b2a4'),railM=std('#6b6f75');
 for(let u=RU0;u<RU1;u+=4){const a=LW(u,RLV),b=LW(u+4,RLV);const seg=new THREE.Group();seg.add(box(3.6,.6,4.05,deckM,0,0,0));for(const x of [-.75,.75])seg.add(box(.14,.18,4.05,railM,x,.38,0));for(let k=-1.5;k<=1.5;k+=1)seg.add(box(2.2,.1,.3,MT.wood,0,.3,k));
  seg.position.set((a.x+b.x)/2,RLY,(a.y+b.y)/2);seg.rotation.y=ALONG_ANG+Math.PI/2;g.add(seg);
  if(Math.round(u)%12===0){const p=L(u+2,RLV);const pl=box(.7,RLY-p.y,.7,deckM,0,0,0);pl.position.set(p.x,(RLY+p.y)/2,p.z);g.add(pl);}}
 g.traverse(o=>{o.castShadow=true;o.receiveShadow=true;});g.userData.t=9.6;g.visible=false;scene.add(g);POP7.push(g);return g;})();
const station=at7((()=>{const g=new THREE.Group();const y=RLY-L(86,RLV).y;g.add(box(12,.5,3,MT.stone,0,y-.1,3.4));g.add(box(12,.5,3,MT.stone,0,y-.1,-3.4));
 for(const z of [-3.4,3.4])for(const x of [-5,0,5])g.add(cyl(.15,.15,3.4,MT.white,x,y+1.6,z+(z>0?1:-1),6));g.add(box(13,.3,10,std('#c93a2e'),0,y+3.4,0));
 const s=sign('HERBERG CENTRAL','#ffffff','#1d3f8a',6,1);s.position.set(0,y+2.6,5);g.add(s);for(const z of [-5,5]){const st=box(2,y,4,MT.stone,6.6,y/2,z*.9);g.add(st);}
 for(const z of [-3.4,3.4])g.add(box(.7,y,.7,MT.stone,-5.5,y/2,z));
 const tm=pawn('#1d3f8a',1);const cap=box(.6,.2,.6,std('#1d3f8a'),0,1.9,0);tm.add(cap);tm.position.set(1.5,y+.15,3.6);g.add(tm);g.userData.tm=tm;
 const cat=new THREE.Group();const cm=std('#f2a33a');cat.add(box(.4,.32,.7,cm,0,.3,0));const hd=box(.34,.3,.3,cm,0,.55,.42);cat.add(hd);for(const x of [-.1,.1]){const e=new THREE.Mesh(new THREE.ConeGeometry(.07,.15,4),cm);e.position.set(x,.76,.42);cat.add(e);}const tl=box(.07,.07,.5,cm,0,.5,-.5);tl.rotation.x=-.8;cat.add(tl);cat.position.set(2.4,y+.15,3.6);g.add(cat);g.userData.cat=cat;
 g.traverse(o=>o.castShadow=true);return g;})(),86,RLV,10.4,Math.PI/2);
function rcar(c,loco){const g=new THREE.Group();g.add(box(2.2,2.2,6,std(c),0,1.5,0));g.add(box(2.25,.7,5.6,MT.glass,0,1.9,0));g.add(box(2.3,.25,6.1,MT.white,0,.5,0));if(loco){g.add(box(2.1,1,1.4,std('#1d232b'),0,2.9,1.6));g.add(cyl(.3,.3,1.2,MT.dark,0,3.2,2.4,8));}for(const z of [-2,2])g.add(box(1.8,.5,1,MT.dark,0,.35,z));g.traverse(o=>o.castShadow=true);return g;}
const train=[rcar('#c93a2e',true),rcar('#f4ead2'),rcar('#f4ead2')];train.forEach(c=>{c.visible=false;scene.add(c);});
const trainU=t=>t<11?-72:t<16?-72+150*ease((t-11)/5):t<34?78:t<44?78-146*ease((t-34)/10):t<52?-68:-68+146*ease(clamp((t-52)/9));

// ---------- 👑 Egyptian Mapper on top of the castle with a crown (@egyptianmapper16)
const king=(()=>{const k=pawn('#8a2be2',1.3);const c=crown(1.3);c.position.y=2.35;k.add(c);const cape=box(.9,1.2,.1,std('#c0392b'),0,1,-.3);k.add(cape);const y=castle.userData.top+12;k.position.set(0,y,0);k.visible=false;castle.add(k);return k;})();
// ---------- ⛪ priest + altar boys at the church (@donotdisturb_luke)
const priestGrp=at7((()=>{const g=new THREE.Group();const pr=pawn('#1d232b',1);pr.add(box(.3,.12,.06,MT.white,0,1.28,.3));g.add(pr);for(const x of [-1.2,1.2]){const b=pawn('#ffffff',.75);b.add(box(.5,.5,.06,std('#c0392b'),0,.9,.28));b.position.x=x;b.position.z=-.4;g.add(b);}
 const alt=box(1.6,.9,.7,MT.white,0,.45,1.2);g.add(alt);g.add(box(.08,.6,.08,std('#f2c230'),0,1.2,1.2));g.add(box(.4,.08,.08,std('#f2c230'),0,1.35,1.2));g.traverse(o=>o.castShadow=true);g.userData.pr=pr;return g;})(),-41.6,2.6,21.4,Math.PI);
// ---------- ⚒️ blacksmith (@lil_jonesy777)
const smith=at7((()=>{const g=new THREE.Group();const st=std('#8d7b68');g.add(box(7,4,5,st,0,2,0));g.add(roof4(7.6,1.6,std('#5b4636'),4.6));g.add(box(1.2,6,1.2,std('#6b5b4a'),2.6,3.5,-1.4));
 const fur=box(2,1.4,1.2,std('#ff6a1a',{emissive:'#ff4a00',emissiveIntensity:1}),-1.6,.8,2.6);g.add(fur);g.add(box(1.1,.5,.6,MT.dark,1.2,.9,3));g.add(box(.5,.6,.5,MT.dark,1.2,.3,3));
 const s=sign('BLACKSMITH','#ffffff','#5b4636',3.6,.7);s.position.set(0,3.2,2.52);g.add(s);const sm=pawn('#5b4636',.95);sm.add(box(.6,.7,.06,std('#2b2b2b'),0,.9,.3));sm.position.set(2.4,0,3.4);g.add(sm);g.userData.sm=sm;
 const puffs=[];for(let i=0;i<5;i++){const p=new THREE.Mesh(new THREE.IcosahedronGeometry(.7,1),new THREE.MeshStandardMaterial({color:'#8a8a8a',transparent:true,opacity:.7,flatShading:true}));g.add(p);puffs.push(p);}g.userData.puffs=puffs;
 const sparks=[];for(let i=0;i<8;i++){const p=new THREE.Mesh(new THREE.SphereGeometry(.08,6,4),new THREE.MeshBasicMaterial({color:'#ffd23a'}));g.add(p);sparks.push(p);}g.userData.sparks=sparks;
 g.traverse(o=>o.castShadow=true);return g;})(),8,87,25.4);
// ---------- 🚓 police commander (@somedude9898, asked by @hawki771) + 🚒 fire captain (@south_parkfan39)
const cop=at7((()=>{const g=new THREE.Group();const c=car('#ffffff');scene.remove(c);c.add(box(1.72,.3,3.42,std('#1d3f8a'),0,.8,0));const lb=box(.9,.2,.3,std('#e8334f',{emissive:'#e8334f',emissiveIntensity:1}),0,2.1,-.2);c.add(lb);c.position.set(-2.6,0,0);g.add(c);g.userData.lb=lb;
 const cm=pawn('#1d3f8a',1.05);const hat=box(.7,.22,.7,std('#1d232b'),0,1.9,0);cm.add(hat);cm.add(box(.25,.25,.06,std('#f2c230'),.15,1.25,.3));cm.position.set(1.2,0,0);g.add(cm);for(const x of [2.6,3.6]){const o=pawn('#3e6fc4',.85);o.position.set(x,0,-.6);g.add(o);}
 g.traverse(o=>o.castShadow=true);return g;})(),-40.5,57.6,29.4,Math.PI);
const captain=at7((()=>{const g=new THREE.Group();const tr=fireTruck();scene.remove(tr);tr.rotation.y=Math.PI/2;tr.position.set(-3.2,0,0);g.add(tr);g.userData.tr=tr;
 const fc=new THREE.Group();const b=new THREE.Mesh(new THREE.CapsuleGeometry(.36,.8,4,8),std('#f2c230'));b.position.y=.78;const h=new THREE.Mesh(new THREE.SphereGeometry(.38,10,8),std('#ffffff'));h.position.y=1.7;fc.add(b,h);fc.add(box(.3,.3,.06,std('#f2c230',{metalness:.6}),0,1.1,.36));fc.position.set(2.2,0,0);fc.scale.setScalar(1.1);g.add(fc);
 g.traverse(o=>o.castShadow=true);return g;})(),-31,57.4,33.4,Math.PI);
// ---------- ⛴️ ferry + its sailor (@johnyomama541)
const ferry=(()=>{const g=new THREE.Group();const w=MT.white;g.add(box(5,1.6,12,std('#2f8fe0'),0,.6,0));g.add(box(5.1,.4,12.1,w,0,1.5,0));g.add(box(4,1.6,6,w,0,2.5,0));g.add(box(4.1,.5,6.1,MT.glass,0,2.7,0));g.add(box(2.4,1.2,2,w,0,3.9,-1));
 g.add(cyl(.4,.4,1.6,std('#e8334f'),0,4.8,-1.6,10));const s=sign('HERBERG FERRY','#ffffff','#2f8fe0',4,.7);s.position.set(2.56,2,0);s.rotation.y=Math.PI/2;g.add(s);
 for(let i=0;i<5;i++){const p=pawn(['#f2a33a','#e85d75','#3e8fe6','#7bd65b','#9b59d6'][i],.7);p.position.set(-1.6+i*.8,1.7,4.6);g.add(p);}const sl=pawn('#ffffff',.85);sl.add(box(.5,.15,.5,MT.white,0,1.9,0));sl.add(box(.6,.08,.06,std('#1d3f8a'),0,1.2,.31));sl.position.set(0,4.5,.4);g.add(sl);g.userData.sl=sl;
 g.traverse(o=>o.castShadow=true);g.visible=false;scene.add(g);return g;})();
const FERRY_A=[34,-22],FERRY_B=[90,-42];
// ---------- ⚓ navy warship (@ryyy7220)
const navy=(()=>{const g=new THREE.Group();const gr=std('#7d8892'),gr2=std('#5f6a73');g.add(box(5,2,22,gr,0,.8,0));const bow=new THREE.Mesh(new THREE.ConeGeometry(2.5,6,4),gr);bow.rotation.x=Math.PI/2;bow.rotation.y=Math.PI/4;bow.scale.set(1,1,.6);bow.position.set(0,.8,13.5);g.add(bow);
 g.add(box(3.6,3,6,gr2,0,3.2,-2));g.add(box(2.6,1.6,3,gr2,0,5.4,-2.5));g.add(cyl(.12,.12,4,MT.dark,0,8,-2.8,6));for(const z of [5,-8]){const tu=new THREE.Group();tu.add(cyl(1,1.1,.9,gr2,0,0,0,12));const gun=cyl(.15,.15,3,gr2,0,.2,1.4,8);gun.rotation.x=Math.PI/2;tu.add(gun);tu.position.set(0,2.2,z);if(z<0)tu.rotation.y=Math.PI;g.add(tu);}
 const s=sign('H-01','#ffffff','#5f6a73',1.6,.8);s.position.set(2.52,1,8);s.rotation.y=Math.PI/2;g.add(s);const fl=new THREE.Mesh(new THREE.PlaneGeometry(1.4,.9),new THREE.MeshStandardMaterial({map:FLAG_TEX,side:THREE.DoubleSide}));fl.position.set(.7,9.4,-2.8);g.add(fl);
 const sailor=pawn('#ffffff',.95);sailor.add(cyl(.3,.3,.15,MT.white,0,1.95,0,10));sailor.position.set(0,1.8,9);g.add(sailor);for(let i=0;i<4;i++){const p=pawn('#ffffff',.8);p.position.set(-1.4+(i%2)*2.8,1.8,2-i*2.4);g.add(p);}
 g.traverse(o=>o.castShadow=true);const p=LW(-62,-30);g.position.set(p.x,SEA+.1,p.y);g.rotation.y=ALONG_ANG;g.userData.t=41.4;g.userData.base=SEA+.1;g.visible=false;scene.add(g);POP7.push(g);g.userData.sailor=sailor;return g;})();
// ---------- 🏨 hotel by the sea (@lol240000000000000000000)
const hotel=at7((()=>{const g=new THREE.Group();const w=std('#fbf3e4');g.add(box(9,14,7,w,0,7,0));for(let f=0;f<5;f++){g.add(box(9.1,.3,7.1,std('#e08a3c'),0,2.6+f*2.6,0));for(let k=0;k<4;k++)g.add(box(1.4,1.2,.06,MT.glass,-3.3+k*2.2,1.6+f*2.6,3.53));}
 g.add(box(9.4,.6,7.4,std('#e08a3c'),0,14.3,0));const s=sign('HOTEL','#ffffff','#e08a3c',4,1);s.position.set(0,12.4,3.6);g.add(s);g.add(box(4,.2,2,std('#e08a3c'),0,2.8,4.4));
 for(let i=0;i<2;i++){const p=new THREE.Group();p.add(cyl(.2,.25,3,MT.wood,0,1.5,0,6));const lf=new THREE.Mesh(new THREE.ConeGeometry(1.2,1.4,6),std('#3fa34d'));lf.position.y=3.4;p.add(lf);p.position.set(i?4:-4,0,4.6);g.add(p);}
 g.traverse(o=>o.castShadow=true);return g;})(),84,6,45.4);
// ---------- 🚁 Antarctic Airlines helicopter pilot (@official_lifthansa)
const aheli=(()=>{const g=new THREE.Group();const b=new THREE.Mesh(new THREE.CapsuleGeometry(.9,1.8,6,10),std('#eaf6ff'));b.rotation.x=Math.PI/2;b.position.y=1.2;g.add(b);g.add(box(1.85,.45,2.8,std('#2f8fe0'),0,1.2,0));g.add(box(1.3,.6,1,MT.glass,0,1.5,1.3));
 g.add(box(.35,.35,3.6,std('#2f8fe0'),0,1.4,-2.8));g.add(box(.1,1.1,.7,std('#2f8fe0'),0,1.9,-4.5));const rot=new THREE.Group();rot.add(box(7,.06,.3,MT.dark,0,0,0));rot.add(box(.3,.06,7,MT.dark,0,0,0));rot.position.y=2.4;g.add(rot);g.userData.rot=rot;
 const s=sign('ANTARCTIC','#2f8fe0','#ffffff',1.8,.4);s.position.set(.93,1.2,.2);s.rotation.y=Math.PI/2;g.add(s);g.traverse(o=>o.castShadow=true);g.visible=false;scene.add(g);return g;})();
const AH_C=L(-24,112,0);

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
// ===== DAY 9: the R32 highway wins + your requests + "share to grow the island" =====
// (make_day9.py prepends the Day 5 + Day 6 + Day 7 + Day 8 builds, all already standing)
POP8.forEach(g=>{g.userData.t=-1;});
const POP9=[];
function at9(g,u,v,t,rot=0,y0=0,clr=8){place(g,u,v,t,rot,y0);POP9.push(g);clearCrowd(u,v,clr);return g;}
function add9(g,t){g.userData.t=t;g.visible=false;scene.add(g);POP9.push(g);return g;}
const conc=std('#c9c5bc'),conc2=std('#a9a59c'),ylw=std('#f2c230'),tglass=std('#7fc3e8',{roughness:.1,metalness:.2,transparent:true,opacity:.55});
const gy=(u,v)=>L(u,v).y;
const dirAt=(a,b)=>Math.atan2(-(b.z-a.z),b.x-a.x);              // rotation.y that points local +x from a to b
function miniCar(c){const g=new THREE.Group();g.add(box(3.2,1,1.6,std(c),0,.7,0));g.add(box(1.7,.8,1.45,MT.glass,-.2,1.5,0));for(const x of [-1,1])for(const z of [-.8,.8]){const w=cyl(.36,.36,.25,MT.dark,x*1.05,.36,z,10);w.rotation.x=Math.PI/2;g.add(w);}g.traverse(o=>o.castShadow=true);return g;}

// ---------- 🛣️ R32 HIGHWAY (vote winner, idea by @k17.gaming): an elevated 6-lane highway across the whole island
const HV=72;let HB9=-99;for(let u=-100;u<=100;u+=4)HB9=Math.max(HB9,gy(u,HV));HB9+=10;
const deckY=u=>{const a=Math.abs(u);if(a<=100)return HB9;const k=clamp((a-100)/24);const s=k*k*(3-2*k);return HB9+(gy(u,HV)+.4-HB9)*s;};
const HW=[];
for(let u=-124;u<122;u+=4){const a=L(u,HV),b=L(u+4,HV);const y0=deckY(u),y1=deckY(u+4);const g=new THREE.Group();
 const len=Math.hypot(b.x-a.x,b.z-a.z,y1-y0)+.15;const dk=new THREE.Group();dk.add(box(len,.8,11,MT.road,0,0,0));for(const z of [-5.4,5.4])dk.add(box(len,1,.4,conc,0,.6,z));dk.add(box(len,.5,.5,conc,0,.4,0));
 for(const z of [-3.6,-1.8,1.8,3.6])dk.add(box(len*.45,.03,.16,MT.line,0,.42,z));dk.rotation.z=Math.atan2(y1-y0,len);g.add(dk);
 const gr=gy(u+2,HV);const ph=(y0+y1)/2-gr;if(((u+124)/4)%3===0&&ph>1.2){for(const z of [-3,3])g.add(cyl(.8,.9,ph,conc2,0,-ph/2,z,10));g.add(box(1.6,1,9,conc2,0,-.9,0));}
 g.position.set((a.x+b.x)/2,(y0+y1)/2,(a.z+b.z)/2);g.rotation.y=dirAt(a,b);g.traverse(o=>o.castShadow=true);add9(g,5.0+(u+124)/246*3.2);HW.push(g);}
// overhead R32 sign
const r32sign=(()=>{const u=-40,a=L(u,HV),b=L(u+1,HV);const g=new THREE.Group();for(const z of [-5.6,5.6])g.add(box(.5,7,.5,MT.dark,0,3.5,z));g.add(box(.6,.6,11.8,MT.dark,0,6.8,0));
 const s=sign('R32 HIGHWAY','#1f7a3a','#ffffff',9,1.8);s.position.set(-.35,5.6,0);s.rotation.y=-Math.PI/2;g.add(s);const s2=sign('R32 HIGHWAY','#1f7a3a','#ffffff',9,1.8);s2.position.set(.35,5.6,0);s2.rotation.y=Math.PI/2;g.add(s2);
 g.position.set(a.x,deckY(u)+.4,a.z);g.rotation.y=dirAt(a,b);return add9(g,6.6);})();
const HCARS=['#e8334f','#2f7de1','#f2d33a','#ffffff','#7bd65b','#ff8a4c','#9b59d6','#3b3b3b','#e85d75','#3fb5b0'].map((c,i)=>{const g=miniCar(c);g.userData={i,lane:[-4.5,-2.7,-.9,.9,2.7,4.5][i%6],ph:i*27};g.visible=false;scene.add(g);return g;});
function hcarsAt(t){HCARS.forEach(g=>{const {lane,ph}=g.userData;const dir=lane<0?1:-1;const sp=16;let u=-118+((((t-6.5)*sp*(dir>0?1:1)+ph)%236)+236)%236;if(dir<0)u=118-(u+118);
  g.visible=t>6.8;const p=L(u,HV+lane*.92),q=L(u+dir,HV+lane*.92);g.position.set(p.x,deckY(u)+.42,p.z);g.rotation.y=dirAt(p,q);});}

// ---------- 🗼 KINGDOM TOWER (AB_22): the tallest tower in Herberg
const KU9=-112,KV9=46;clearTrees([[KU9-16,KU9+16,KV9-16,KV9+16]]);
const ktower=at9((()=>{const g=slab(26,26,'#cfc8bb',KU9,KV9);const T=g.userData.top;const silver=std('#cfd8e0',{metalness:.55,roughness:.25}),band=std('#6f8aa3',{metalness:.4,roughness:.3});
 g.add(box(20,4,20,std('#e9e4da'),0,T+2,0));const Hh=118,R0=11,R1=1.4;const body=cyl(R1,R0,Hh,silver,0,T+4+Hh/2,0,3);g.add(body);
 for(let k=1;k<12;k++){const y=k*Hh/12;const r=R0-(R0-R1)*y/Hh;g.add(cyl(r+.25,r+.25,.6,band,0,T+4+y,0,3));}
 {const y=Hh*.8,r=R0-(R0-R1)*.8;g.add(cyl(r+3.2,r+3.2,.7,std('#ffffff'),0,T+4+y,0,24));}
 g.add(cyl(.05,.5,26,silver,0,T+4+Hh+13,0,8));g.add(new THREE.Mesh(new THREE.SphereGeometry(.5,8,6),std('#ff3b3b',{emissive:'#ff2020',emissiveIntensity:1.5})).translateY(T+4+Hh+26));
 const s=sign('KINGDOM TOWER','#1d2a3a','#f2c230',9,1.3);s.position.set(0,T+3,10.05);g.add(s);
 for(let i=0;i<5;i++){const p=pawn(['#e85d75','#3e8fe6','#f2d33a','#7bd65b','#9b59d6'][i],.8);p.position.set(-6+i*3,T,12);g.add(p);}
 g.userData.T=T;g.userData.top=T+4+Hh+26;g.traverse(o=>o.castShadow=true);return g;})(),KU9,KV9,10.0,0,0,15);

// ---------- 🏥 PET HOSPITAL (Orbit tree)
const PU=-84,PV=63;
const petHosp=at9((()=>{const g=new THREE.Group();g.add(box(12,5.4,7,std('#ffffff'),0,2.7,-1));g.add(box(12.4,.5,7.4,std('#3fb5b0'),0,5.6,-1));g.add(box(5,2.8,.08,MT.glass,-2.5,1.6,2.53));
 const s=sign('PET HOSPITAL','#3fb5b0','#ffffff',6,1);s.position.set(0,4.4,2.56);g.add(s);
 const cr=new THREE.Group();cr.add(box(2.4,.7,.3,std('#e8334f'),0,0,0));cr.add(box(.7,2.4,.3,std('#e8334f'),0,0,0));cr.position.set(4,2.4,2.6);g.add(cr);
 g.add(box(2,.12,1.6,std('#ffffff'),2,4.2+2.4,-1));
 const vet=pawn('#ffffff',1);vet.add(box(.62,.08,.06,blk,0,1.3,.31));vet.position.set(1.2,0,4.4);g.add(vet);
 g.add(box(2.4,1,1.4,std('#c0c6cc'),-1.6,.5,4.6));const pt=dog(.5,'#c98a4b');pt.position.set(-1.9,1,4.6);g.add(pt);
 const cone=new THREE.Mesh(new THREE.CylinderGeometry(.38,.14,.32,12,1,true),std('#ffffff',{side:THREE.DoubleSide,transparent:true,opacity:.85}));cone.rotation.z=Math.PI/2;cone.position.set(.55,.72,0);pt.add(cone);
 const kt=kitty('#9a9a9a',.9);kt.position.set(-1.2,1,4.4);g.add(kt);kt.add(box(.36,.1,.42,std('#ffffff'),.42,.62,0));
 const amb=new THREE.Group();amb.add(box(4.4,2.2,2.2,std('#ffffff'),0,1.4,0));amb.add(box(4.42,.4,2.22,std('#3fb5b0'),0,1.4,0));amb.add(box(1,.25,.4,std('#e8334f',{emissive:'#e8334f',emissiveIntensity:1}),0,2.6,0));
 for(const x of [-1.4,1.4])for(const z of [-1.1,1.1]){const w=cyl(.4,.4,.3,MT.dark,x,.4,z,10);w.rotation.x=Math.PI/2;amb.add(w);}amb.position.set(-7.6,0,3.6);g.add(amb);g.userData={pt,kt,vet,amb};
 g.traverse(o=>o.castShadow=true);return g;})(),PU,PV,14.0,0,0,8);

// ---------- 🌊 FLASH FLOOD (mr.nine.v.3) + the new flood walls that hold it back
const FG0=gy(0,8);
const floodW=(()=>{const g=new THREE.Group();const w=box(150,1,30,std('#3a8fd0',{transparent:true,opacity:.86,roughness:.15}),0,-.5,0);g.add(w);
 const foam=box(150,.12,1.2,std('#e9f6ff',{transparent:true,opacity:.9}),0,.02,-14.4);g.add(foam);const p=L(0,4);g.position.set(p.x,SEA,p.z);g.rotation.y=FACE;g.visible=false;scene.add(g);return g;})();
const FWALL=[];for(let u=-68;u<=68;u+=6){if(Math.abs(u+38)<5||Math.abs(u-40)<5)continue;const a=L(u,-5),b=L(u+1,-5);const g=new THREE.Group();g.add(box(6.05,4.4,1.2,conc,0,2.2,0));
 for(let k=0;k<3;k++){const st=box(1.6,.5,1.25,k%2?blk:ylw,-2+k*2,4.3,0);g.add(st);}g.position.set(a.x,Math.max(a.y,SEA)-3.4,a.z);g.rotation.y=dirAt(a,b);g.userData.y0=g.position.y;g.traverse(o=>o.castShadow=true);g.visible=false;scene.add(g);FWALL.push(g);}
const NR9=1400,rain9=new THREE.InstancedMesh(new THREE.BoxGeometry(.09,2.4,.09),new THREE.MeshBasicMaterial({color:'#d6e9ff',transparent:true,opacity:.65}),NR9);rain9.frustumCulled=false;scene.add(rain9);
const RD9=[...Array(NR9)].map((_,i)=>[((i*.6180339)%1-.5)*70,((i*.7548776)%1)*50,((i*.5698403)%1-.5)*70]);
function rain9At(t,k){const fw=new THREE.Vector3();camera.getWorldDirection(fw);const c=camera.position.clone().addScaledVector(fw,30);for(let i=0;i<NR9;i++){const [x,y,z]=RD9[i];let s=0;if(k>0&&(i/NR9)<k){_p.set(c.x+x,c.y-25+(((y-t*40)%50)+50)%50,c.z+z);s=_p.distanceTo(camera.position)>8?1:0;}_q.identity();_s.setScalar(s);_m.compose(_p,_q,_s);rain9.setMatrixAt(i,_m);}rain9.instanceMatrix.needsUpdate=true;}
const floodLvl=t=>{const up=ease(clamp((t-17.9)/1.9)),dn=ease(clamp((t-21.3)/1.4));return SEA-.6+(FG0+1.7-SEA+.6)*up*(1-dn);};
const wallK=t=>backOut(clamp((t-20.6)/.7));

// ---------- 🏰 MANKY'S MANSION
const MU=124,MV=92;clearTrees([[MU-20,MU+20,MV-16,MV+16]]);
const mansion9=at9((()=>{const g=slab(32,24,'#a9d67e',MU,MV);const T=g.userData.top;const wh=std('#fbf8f1'),gd=std('#d9b04a',{metalness:.5,roughness:.35});
 g.add(box(20,6,9,wh,0,T+3,-4));g.add(box(20.6,.5,9.6,gd,0,T+6.2,-4));g.add(box(13,4.6,7.5,wh,0,T+8.6,-4.5));g.add(box(13.6,.5,8.1,gd,0,T+11.1,-4.5));
 for(let k=0;k<6;k++){g.add(cyl(.35,.35,6,wh,-6.25+k*2.5,T+3,.9,10));}g.add(box(15,.6,1.6,wh,0,T+6.3,.9));
 for(let f=0;f<2;f++)for(let k=0;k<5;k++)g.add(box(1.6,f?1.8:2.4,.06,MT.glass,-6+k*3,T+(f?8.8:2.8),f?-.72:.47));
 g.add(box(12,.2,6,std('#e8e2d2'),0,T+.1,6));g.add(box(10,.16,4.4,std('#3fb6e8',{roughness:.12,metalness:.1}),0,T+.22,6));
 for(const x of [-13,13]){const tr=tree8(1.1);tr.position.set(x,T,6);g.add(tr);}const tr2=tree8(1.3);tr2.position.set(-13,T,-6);g.add(tr2);
 const car=miniCar('#e8334f');car.position.set(9.5,T,6.5);car.rotation.y=.4;g.add(car);
 const s=sign("MANKY'S MANSION",'#1d232b','#f2c230',8,1.1);s.position.set(0,T+5,.47+1.3);g.add(s);
 const mk=pawn('#9b59d6',1);mk.position.set(-2.5,T,3.6);mk.add(cyl(.3,.34,.35,gd,0,1.92,0,8));g.add(mk);g.userData={mk,T};
 g.traverse(o=>o.castShadow=true);return g;})(),MU,MV,24.0,0,0,14);

// ---------- 🗼 NEW AIR TRAFFIC CONTROL TOWER (D4SH.av)
const AU=27,AV=104;clearTrees([[AU-8,AU+8,AV-8,AV+8]]);
const atc=at9((()=>{const g=slab(10,10,'#cfc8bb',AU,AV);const T=g.userData.top;g.add(box(8,3,7,std('#e9f0f5'),0,T+1.5,0));
 g.add(cyl(1.5,2,22,std('#f4f4f4'),0,T+11,0,14));g.add(cyl(3.2,2.4,1,std('#e9f0f5'),0,T+22.4,0,10));
 const cab=cyl(3.3,2.9,3,std('#2d5f80',{roughness:.12,metalness:.35,transparent:true,opacity:.7}),0,T+24.4,0,10);g.add(cab);g.add(cyl(3.6,3.6,.5,std('#f4f4f4'),0,T+26.1,0,10));
 const ctl=pawn('#2f7de1',1);ctl.position.set(0,T+22.9,1.6);g.add(ctl);
 const rad=new THREE.Group();rad.add(box(.25,1.6,.25,MT.dark,0,.8,0));rad.add(box(3,.9,.2,std('#f4f4f4'),0,1.8,0));rad.position.set(0,T+26.3,0);g.add(rad);g.userData={rad,ctl};
 const bcn=new THREE.Mesh(new THREE.SphereGeometry(.3,8,6),std('#ff3b3b',{emissive:'#ff2020',emissiveIntensity:1.5}));bcn.position.set(0,T+28.6,0);g.add(bcn);g.userData.bcn=bcn;
 const s=sign('AIR TRAFFIC CONTROL','#2f7de1','#ffffff',7,.9);s.position.set(0,T+2.2,3.55);g.add(s);g.traverse(o=>o.castShadow=true);return g;})(),AU,AV,28.0,0,0,6);

// ---------- 🌲 JOHN'S WATCH TOWER in the forest (ג'ון אנג'לו, "day 2 of asking")
const WU=-96,WV=130;clearTrees([[WU-5,WU+5,WV-5,WV+5]]);
const watch9=at9((()=>{const g=new THREE.Group();const wd=std('#8a5a33'),wd2=std('#a8743f');const Hh=17;
 for(const x of [-2.4,2.4])for(const z of [-2.4,2.4]){const l=box(.6,Hh+.6,.6,wd,x*.8,Hh/2,z*.8);l.rotation.z=x*.035;l.rotation.x=-z*.035;g.add(l);}
 for(let k=1;k<4;k++){const y=k*Hh/4;for(const z of [-2,2]){g.add(box(4.4,.25,.25,wd2,0,y,z));g.add(box(.25,.25,4.4,wd2,z,y,0));}}
 g.add(box(7,.5,7,wd2,0,Hh,0));for(const s of [-3.4,3.4]){g.add(box(7,1,.18,wd,0,Hh+.75,s));g.add(box(.18,1,7,wd,s,Hh+.75,0));}
 g.add(box(4.2,3,4.2,std('#c98a4b'),0,Hh+1.75,-.6));g.add(box(1.6,1,.06,std('#ffe9a8',{emissive:'#ffd36b',emissiveIntensity:.8}),0,Hh+2,1.52));
 const rf=new THREE.Mesh(new THREE.ConeGeometry(3.8,2.4,4),std('#3d6b3a'));rf.rotation.y=Math.PI/4;rf.position.set(0,Hh+4.4,-.6);g.add(rf);
 for(let k=0;k<12;k++)g.add(box(1.2,.12,.12,MT.dark,0,1+k*1.35,2.9));for(const x of [-.6,.6])g.add(box(.12,Hh,.12,MT.dark,x,Hh/2,2.9));
 const fp=box(.12,4,.12,MT.dark,3.1,Hh+2.5,3.1);g.add(fp);const fl=sign('JOHN','#e8334f','#ffffff',1.8,1);fl.position.set(3.1+.9,Hh+3.9,3.1);g.add(fl);g.userData.fl=fl;
 const jn=pawn('#2f7de1',1);jn.position.set(1.4,Hh+.25,2.2);g.add(jn);g.userData.jn=jn;g.userData.H=Hh;
 g.traverse(o=>o.castShadow=true);return g;})(),WU,WV,32.0,0,0,5);

// ---------- 🚇 RDA METRO (RDA as BA Europe): an elevated metro line from the beach to the university
const MUu=-48;let MB=-99;for(let v=2;v<=98;v+=4)MB=Math.max(MB,gy(MUu,v));MB+=6;
const MTR=[];
for(let v=2;v<98;v+=4){const a=L(MUu,v),b=L(MUu,v+4);const g=new THREE.Group();g.add(box(4.15,.6,4.2,conc,0,0,0));for(const z of [-.8,.8])g.add(box(4.15,.18,.16,MT.dark,0,.38,z));
 for(const z of [-2.05,2.05])g.add(box(4.15,.5,.16,conc2,0,.5,z));const gr=gy(MUu,v+2);const ph=MB-gr;if(((v-2)/4)%3===1&&ph>1)g.add(cyl(.6,.7,ph,conc2,0,-ph/2,0,10));
 g.position.set((a.x+b.x)/2,MB,(a.z+b.z)/2);g.rotation.y=dirAt(a,b);g.traverse(o=>o.castShadow=true);add9(g,36.6+(v-2)/96*1.4);MTR.push(g);}
const MST=[27,63,95].map((v,i)=>{const a=L(MUu,v),b=L(MUu,v+1);const g=new THREE.Group();for(const z of [-3.5,3.5]){g.add(box(12,.5,2.6,std('#e9e4da'),0,.05,z));g.add(box(12,.25,2.8,std('#2f6fd6'),0,4.2,z));for(const x of [-5,0,5])g.add(box(.25,4,.25,MT.dark,x,2.2,z+(z>0?1.1:-1.1)));}
 const m=sign('M','#2f6fd6','#ffffff',1.8,1.8);m.position.set(0,6.3,0);m.rotation.y=Math.PI/2;g.add(m);const m2=sign('M','#2f6fd6','#ffffff',1.8,1.8);m2.position.set(0,6.3,0);m2.rotation.y=-Math.PI/2;g.add(m2);g.add(box(.2,1.8,.2,MT.dark,0,4.8,0));
 const s=sign(['BEACH','CITY','UNIVERSITY'][i],'#2f6fd6','#ffffff',4.4,.8);s.position.set(0,3.3,-4.85);g.add(s);const s2=sign('RDA METRO','#2f6fd6','#ffffff',4.4,.8);s2.position.set(0,3.3,4.85);g.add(s2);
 g.position.set(a.x,MB+.3,a.z);g.rotation.y=dirAt(a,b);g.traverse(o=>o.castShadow=true);return add9(g,37.6+i*.4);});
const mtrain=[0,1,2].map(i=>{const g=new THREE.Group();g.add(box(6.2,2.4,2.5,std('#f7f7f7'),0,1.6,0));g.add(box(6.22,.5,2.52,std('#2f6fd6'),0,1.05,0));g.add(box(5.4,.8,2.54,MT.glass,0,2.05,0));
 if(i==0)g.add(box(.2,1.2,2.2,MT.glass,3.1,1.9,0));const s=sign('RDA METRO','#2f6fd6','#ffffff',3,.55);s.position.set(0,1.05,1.27);g.add(s);g.traverse(o=>o.castShadow=true);g.visible=false;scene.add(g);return g;});
const mtV=t=>{const ph=((t*.11)%2+2)%2;const k=ph<1?ph:2-ph;return 8+84*(k*k*(3-2*k));};
function metroAt(t){const v0=mtV(t),dir=mtV(t+.05)>=v0?1:-1;mtrain.forEach((c,i)=>{const v=v0-dir*i*6.5;const p=L(MUu,v),q=L(MUu,v+dir);c.visible=t>38.2;c.position.set(p.x,MB+.3,p.z);c.rotation.y=dirAt(p,q);});}
const rdaTag=()=>{const c=mtrain[0];return c.position.clone().add(v3(0,4.5,0));};

// ---------- 🎓 HERBERG UNIVERSITY (RY#$U is the professor)
const UU=-76,UV=93;clearTrees([[UU-16,UU+16,UV-12,UV+12]]);
const uni=at9((()=>{const g=slab(30,22,'#9fd27a',UU,UV);const T=g.userData.top;const cr=std('#f2e6c9'),br=std('#c4573f');
 g.add(box(13,7,8,cr,0,T+3.5,-5));for(let k=0;k<6;k++)g.add(cyl(.38,.38,6.4,std('#ffffff'),-5+k*2,T+3.2,-.6,10));
 const ped=new THREE.Mesh(new THREE.CylinderGeometry(1.6,1.6,13.4,3),std('#ffffff'));ped.rotation.z=Math.PI/2;ped.rotation.x=Math.PI/2;ped.scale.set(1,1,.55);ped.position.set(0,T+7.3,-.9);g.add(ped);
 const dm=new THREE.Mesh(new THREE.SphereGeometry(3.4,18,10,0,Math.PI*2,0,Math.PI/2),std('#3fb5b0'));dm.position.set(0,T+7,-5);g.add(dm);g.add(cyl(.2,.2,1.6,ylw,0,T+11,-5,6));
 for(const x of [-10,10]){g.add(box(7,5.4,7,br,x,T+2.7,-5));g.add(box(7.4,.4,7.4,MT.white,x,T+5.6,-5));for(let k=0;k<2;k++)g.add(box(1.4,1.4,.06,MT.glass,x-1.5+k*3,T+3,-1.46));}
 const s=sign('HERBERG UNIVERSITY','#1d3f8a','#ffffff',8,1);s.position.set(0,T+8.4,.45);g.add(s);
 g.add(box(4.6,2.4,.2,std('#24433a'),0,T+2.4,2.2));g.add(box(5,.2,.4,std('#8a5a33'),0,T+1.15,2.2));
 const pr=pawn('#1d232b',1.05);pr.position.set(2.8,T,2.8);pr.add(box(.8,.08,.8,blk,0,1.95,0));pr.add(cyl(.22,.22,.2,blk,0,1.84,0,8));pr.add(box(.04,.4,.04,ylw,.38,1.75,.38));g.add(pr);
 const st=[];for(let r=0;r<2;r++)for(let k=0;k<5;k++){const p=pawn(['#e85d75','#3e8fe6','#f2d33a','#7bd65b','#9b59d6'][k],.72);p.position.set(-4+k*2,T,6+r*2);p.rotation.y=Math.PI;g.add(p);st.push(p);}
 g.userData={pr,st,T};g.traverse(o=>o.castShadow=true);return g;})(),UU,UV,41.0,0,0,12);

// ---------- 🏝️ the ending: the island is full, so share to make new islands
const ISL=[[-78,-128],[82,-124],[2,-172],[-104,-190],[106,-186],[-46,-232],[52,-230],[-132,-112]].map(([u,v],i)=>{const g=new THREE.Group();
 g.add(cyl(19,22,6,std('#e9d39a'),0,-1,0,18));g.add(cyl(14,16.5,2.2,std('#7cc95a'),0,2.4,0,16));for(let k=0;k<3;k++){const tr=tree8(1.2);const a=k*2.1+i;tr.position.set(Math.cos(a)*7,3.4,Math.sin(a)*7);g.add(tr);}
 g.add(box(.4,9,.4,MT.dark,0,7.5,0));const fl=sign('?','#f08a24','#ffffff',4,2.6);fl.position.set(2,10.6,0);g.add(fl);
 const c=document.createElement('canvas');c.width=512;c.height=150;const x=c.getContext('2d');x.fillStyle='#ffffff';x.beginPath();x.roundRect(6,6,500,138,40);x.fill();x.lineWidth=10;x.strokeStyle='#1d232b';x.stroke();
 x.fillStyle='#1d232b';x.font='900 66px Nunito, sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText('YOUR ISLAND?',256,80);
 const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(c),depthTest:false,fog:false}));sp.scale.set(38,11.2,1);sp.position.set(0,24,0);sp.renderOrder=10;g.add(sp);g.userData.sp=sp;
 const p=LW(u,v);g.position.set(p.x,SEA,p.y);g.userData.t=52.0+i*.42;g.visible=false;scene.add(g);return g;});
// extra on-screen elements for the ending
const fullEl=document.createElement('div');fullEl.id='full9';fullEl.textContent='FULL!';
fullEl.style.cssText='position:absolute;left:50%;top:930px;font-family:Lilita,Nunito;font-size:210px;color:#e8334f;border:16px solid #e8334f;border-radius:36px;padding:0 50px;background:rgba(255,255,255,.88);opacity:0;z-index:20;letter-spacing:6px';
fullEl.dataset.base='translate(-50%,-50%) rotate(-12deg)';document.body.appendChild(fullEl);
const shareEl=document.createElement('div');shareEl.id='share9';
shareEl.innerHTML='<svg viewBox="0 0 100 100" width="150" height="150"><path d="M58 18 L92 48 L58 78 L58 60 C34 60 20 68 8 86 C12 58 28 40 58 36 Z" fill="#ffffff" stroke="#1d232b" stroke-width="6" stroke-linejoin="round"/></svg>';
shareEl.style.cssText='position:absolute;right:46px;top:1020px;width:200px;height:200px;border-radius:50%;background:#f08a24;border:8px solid #1d232b;display:flex;align-items:center;justify-content:center;opacity:0;z-index:20;box-shadow:0 10px 0 rgba(0,0,0,.25)';
document.body.appendChild(shareEl);

// ===== DAY 10: 10 shares = 10 new islands (one per commenter) + a steam train + the Day 11 vote =====
// (make_day10.py prepends the Day 5 → Day 9 builds, all already standing)
POP9.forEach(g=>{g.userData.t=-1;});
ISL.forEach(g=>{g.visible=false;});
const sandM=std('#e9d39a'),grassM=std('#7cc95a'),terra=std('#c8643c'),gold10=std('#f2c230',{metalness:.6,roughness:.3}),cash=std('#5dbb63'),stone10=std('#b8b0a2'),navy10=std('#7d8a96');
const pinkM=std('#f4a6b6'),pink2=std('#e98fa2'),brick=std('#e6d3b3'),dkgreen=std('#2f6b3a'),whiteM=std('#fbf8f1');
function label10(text,sub){const c=document.createElement('canvas');c.width=640;c.height=190;const x=c.getContext('2d');x.fillStyle='#ffffff';x.beginPath();x.roundRect(6,6,628,178,46);x.fill();x.lineWidth=10;x.strokeStyle='#1d232b';x.stroke();
 x.fillStyle='#1d232b';x.textAlign='center';x.textBaseline='middle';let fs=74;x.font=`900 ${fs}px Nunito, sans-serif`;while(x.measureText(text).width>580&&fs>30){fs-=2;x.font=`900 ${fs}px Nunito, sans-serif`;}x.fillText(text,320,sub?78:98);
 if(sub){x.fillStyle='#2f7de1';x.font='900 40px Nunito, sans-serif';x.fillText(sub,320,148);}
 const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(c),depthTest:false,fog:false,transparent:true}));sp.scale.set(44,13,1);sp.renderOrder=10;return sp;}
// island bases: row A faces the main island, row B faces the open sea
const ISL10=[], T10=3.5;
function makeIsle(u,v,r,faceMain,name,top){const g=new THREE.Group();g.add(cyl(r,r+4,6,sandM,0,-1,0,30));g.add(cyl(r-4,r-1.5,2.4,top||grassM,0,2.3,0,28));
 const bld=new THREE.Group();bld.position.y=T10;g.add(bld);const sp=label10(name);sp.position.set(0,52,0);g.add(sp);
 const p=LW(u,v);g.position.set(p.x,SEA,p.y);g.rotation.y=FACE+(faceMain?Math.PI:0);g.visible=false;scene.add(g);
 const ref=new THREE.Object3D();ref.position.copy(g.position);ref.rotation.copy(g.rotation);ref.updateMatrixWorld(true);
 const o={g,bld,sp,ref,r,u,v};ISL10.push(o);return o;}
const IL=(i,x,y,z)=>ISL10[i].ref.localToWorld(v3(x,y+SEA,z));
const palm10=(s=1)=>{const g=new THREE.Group();const tr=cyl(.3*s,.45*s,7*s,MT.wood,0,3.5*s,0,6);tr.rotation.z=.12;g.add(tr);for(let k=0;k<6;k++){const lf=box(4.6*s,.12*s,1.1*s,std('#3fa34a'),0,0,0);const a=k/6*Math.PI*2;lf.position.set(Math.cos(a)*2*s+.8*s,7*s,Math.sin(a)*2*s);lf.rotation.y=-a;lf.rotation.z=-.35;g.add(lf);}g.traverse(o=>o.castShadow=true);return g;};
const pine10=(s=1)=>{const g=new THREE.Group();g.add(cyl(.25*s,.35*s,2*s,MT.wood,0,1*s,0,6));for(let k=0;k<3;k++){const c=new THREE.Mesh(new THREE.ConeGeometry((2.2-k*.5)*s,2.6*s,7),std(k%2?'#2f7a3a':'#3a8c42'));c.position.y=(2.4+k*1.5)*s;c.castShadow=true;g.add(c);}return g;};
function pig(s=1){const g=new THREE.Group();g.add(box(1.5*s,.9*s,.9*s,pinkM,0,.85*s,0));for(const x of [-.5,.5])for(const z of [-.3,.3])g.add(box(.22*s,.45*s,.22*s,pink2,x*s,.22*s,z*s));
 const hd=new THREE.Group();hd.add(box(.7*s,.7*s,.75*s,pinkM,0,0,0));hd.add(box(.2*s,.36*s,.44*s,pink2,.42*s,-.08*s,0));for(const z of [-.24,.24]){const e=box(.12*s,.28*s,.22*s,pink2,-.05*s,.42*s,z*s);e.rotation.x=z>0?-.4:.4;hd.add(e);}
 hd.add(box(.06*s,.1*s,.1*s,blk,.36*s,.14*s,.2*s));hd.add(box(.06*s,.1*s,.1*s,blk,.36*s,.14*s,-.2*s));hd.position.set(.95*s,1.05*s,0);g.add(hd);g.userData.hd=hd;
 const tl=new THREE.Mesh(new THREE.TorusGeometry(.14*s,.05*s,5,8,4.5),pink2);tl.position.set(-.8*s,1.05*s,0);tl.rotation.y=Math.PI/2;g.add(tl);g.traverse(o=>o.castShadow=true);return g;}
function tank10(c='#5d7a46'){const g=new THREE.Group();const m=std(c);g.add(box(5,1.3,3,m,0,1,0));for(const z of [-1.6,1.6])g.add(box(5.4,1,.7,blk,0,.55,z));const tu=new THREE.Group();tu.add(box(2.4,1,2,m,0,0,0));tu.add(cyl(.18,.18,3.4,m,1.8,0,0,8).rotateZ(Math.PI/2));tu.position.y=2.1;g.add(tu);g.userData.tu=tu;g.traverse(o=>o.castShadow=true);return g;}
function fighter(){const g=new THREE.Group();const m=std('#8f9aa5');const b=cyl(.5,.7,9,m,0,0,0,10);b.rotation.z=Math.PI/2;g.add(b);const n=new THREE.Mesh(new THREE.ConeGeometry(.5,2,10),m);n.rotation.z=-Math.PI/2;n.position.x=5.5;g.add(n);
 const w=new THREE.Mesh(new THREE.BufferGeometry().setFromPoints([v3(1.5,0,0),v3(-2.5,0,4.6),v3(-3.4,0,4.6),v3(-3,0,0),v3(-3.4,0,-4.6),v3(-2.5,0,-4.6),v3(1.5,0,0),v3(-3,0,0)]),m);
 g.add(box(4,.18,9,m,-1.2,0,0));g.add(box(1.6,2.2,.16,m,-3.8,1.1,0));g.add(box(1.4,.5,.9,std('#2d5f80',{roughness:.1}),2.4,.5,0));g.traverse(o=>o.castShadow=true);g.position.y=1.2;return g;}
function logoTex(){const c=document.createElement('canvas');c.width=512;c.height=512;const x=c.getContext('2d');x.fillStyle='#1b4f9c';x.fillRect(0,0,512,512);
 x.fillStyle='#cfe9ff';x.beginPath();x.arc(256,210,150,0,Math.PI*2);x.fill();
 const mt=(cx,w,h,col)=>{x.fillStyle=col;x.beginPath();x.moveTo(cx-w,330);x.lineTo(cx,330-h);x.lineTo(cx+w,330);x.fill();x.fillStyle='#ffffff';x.beginPath();x.moveTo(cx-w*.32,330-h*.68);x.lineTo(cx,330-h);x.lineTo(cx+w*.32,330-h*.68);x.lineTo(cx+w*.12,330-h*.6);x.lineTo(cx,330-h*.7);x.lineTo(cx-w*.14,330-h*.6);x.fill();};
 mt(180,120,170,'#5d7fa8');mt(320,140,220,'#3f6491');x.fillStyle='#ffffff';x.font='900 58px Nunito, sans-serif';x.textAlign='center';x.fillText('ANTARCTIC',256,400);x.font='900 50px Nunito, sans-serif';x.fillText('AIRLINES',256,456);
 return new THREE.CanvasTexture(c);}

// ---------- island 0: DASH (D4SH.av, shared!) private airport + Antarctic Airlines skyscraper + mansion
{const o=makeIsle(0,-130,36,true,'D4SH.av');const b=o.bld;
 b.add(box(58,.2,7,MT.road,0,.12,-15));for(let k=-5;k<=5;k++)b.add(box(2.4,.05,.4,MT.line,k*5,.24,-15));for(const x of [-27,27])for(let k=-2;k<=2;k++)b.add(box(.5,.05,1,MT.line,x,.24,-15+k*1.2));
 const hg=new THREE.Group();hg.add(box(10,5,8,std('#e9f0f5'),0,2.5,0));const hr=cyl(5,5,10,std('#c9d3dc'),0,5,0,16,);hr.rotation.z=Math.PI/2;hr.scale.set(1,1,.8);hg.add(hr);hg.add(box(6,4,.1,MT.dark,0,2,4.05));hg.position.set(20,0,-6);b.add(hg);
 const pj=plane('#ffffff','#1b4f9c','D4SH');pj.scale.setScalar(.55);pj.rotation.y=Math.PI/2;pj.position.set(-8,.3,-15);b.add(pj);
 const sk=new THREE.Group();const H=62;sk.add(box(9,H,9,std('#7fb6dc',{roughness:.12,metalness:.35}),0,H/2,0));for(let k=1;k<16;k++)sk.add(box(9.2,.3,9.2,std('#e9f0f5'),0,k*H/16,0));
 const lt=logoTex();for(let k=0;k<4;k++){const pl=new THREE.Mesh(new THREE.PlaneGeometry(8.4,8.4),new THREE.MeshBasicMaterial({map:lt}));const a=k*Math.PI/2;pl.position.set(Math.sin(a)*4.62,H-5.2,Math.cos(a)*4.62);pl.rotation.y=a;sk.add(pl);}
 sk.add(box(7,1.2,7,std('#e9f0f5'),0,H+.6,0));sk.add(cyl(.12,.3,8,MT.dark,0,H+5,0,6));sk.position.set(-15,0,6);b.add(sk);
 const mn=new THREE.Group();mn.add(box(13,4.6,7,whiteM,0,2.3,0));mn.add(box(13.4,.4,7.4,gold10,0,4.8,0));mn.add(box(8,3.6,5.6,whiteM,0,6.8,-.4));mn.add(box(8.4,.4,6,gold10,0,8.8,-.4));for(let k=0;k<5;k++)mn.add(cyl(.28,.28,4.6,whiteM,-4.8+k*2.4,2.3,3.9,8));
 for(let k=0;k<4;k++)mn.add(box(1.5,1.8,.06,MT.glass,-4.5+k*3,2.5,3.53));mn.add(box(7,.14,3.6,std('#3fb6e8',{roughness:.1}),0,.12,7.4));mn.position.set(13,0,8);b.add(mn);
 const ds=pawn('#2f7de1',1.2);ds.position.set(5,0,13);b.add(ds);o.dash=ds;
 const s=sign("D4SH'S ISLAND",'#1b4f9c','#ffffff',10,1.6);s.position.set(0,1.6,o.r-5.6);b.add(s);b.add(box(.3,1.6,.3,MT.dark,-4.8,.8,o.r-5.7));b.add(box(.3,1.6,.3,MT.dark,4.8,.8,o.r-5.7));
 for(const [x,z] of [[-28,6],[28,10],[-6,22]]){const p=palm10(.9);p.position.set(x,0,z);b.add(p);}}

// ---------- island 1: DANIEL — Italian style: pastel houses, terracotta roofs, bell tower, canal + gondola
{const o=makeIsle(-180,-130,28,true,'Daniel');const b=o.bld;
 b.add(box(40,.2,5,MT.water,0,.14,2));for(const x of [-5,6]){const br=new THREE.Mesh(new THREE.CylinderGeometry(3.2,3.2,2.2,16,1,false,0,Math.PI),stone10);br.rotation.z=Math.PI/2;br.rotation.y=Math.PI/2;br.scale.set(1,.35,1);br.position.set(x,.3,2);b.add(br);}
 const gd=new THREE.Group();gd.add(box(5,.5,1,blk,0,.4,0));const pr=new THREE.Mesh(new THREE.ConeGeometry(.4,1.2,4),blk);pr.rotation.z=-1.2;pr.position.set(2.8,.9,0);gd.add(pr);const gp=pawn('#ffffff',.7);gp.add(box(.7,.1,.7,std('#e8334f'),0,1.95,0));gp.position.set(-1.6,.6,0);gd.add(gp);gd.position.set(-12,0,2);b.add(gd);o.gond=gd;
 const PAST=['#f6c9a8','#f2e1a0','#f4b6a6','#e7d6c0','#f7d7c4','#d9e7c9','#f5c28e'];
 [[-14,-8],[-7,-9],[0,-8],[7,-9],[-12,10],[-4,11],[12,10]].forEach(([x,z],i)=>{const h=homeModel(5,4.6,4+(i%3)*1.4,std(PAST[i%PAST.length]),terra,i);h.position.set(x,0,z);h.rotation.y=z>0?0:Math.PI;b.add(h);});
 const bt=new THREE.Group();bt.add(box(4,22,4,brick,0,11,0));bt.add(box(4.6,.6,4.6,whiteM,0,17,0));for(let k=0;k<4;k++){const a=k*Math.PI/2;bt.add(box(1.4,2.4,.1,blk,Math.sin(a)*2.02,19.2,Math.cos(a)*2.02).rotateY(a));}
 bt.add(box(4.6,.5,4.6,whiteM,0,21,0));const rf=new THREE.Mesh(new THREE.ConeGeometry(3,4,4),terra);rf.rotation.y=Math.PI/4;rf.position.y=23.2;bt.add(rf);bt.position.set(15,0,-6);b.add(bt);
 for(const [x,z] of [[-20,-2],[20,4],[-19,6],[19,-12]]){const c=new THREE.Mesh(new THREE.ConeGeometry(1.1,7,8),dkgreen);c.position.set(x,3.5,z);c.castShadow=true;b.add(c);}
 const ft=new THREE.Group();ft.add(cyl(2.4,2.6,.8,stone10,0,.4,0,16));ft.add(cyl(2.1,2.1,.2,MT.water,0,.82,0,16));ft.add(cyl(.3,.4,2,stone10,0,1.4,0,8));ft.position.set(4,0,-15);b.add(ft);
 const dn=pawn('#3e8fe6',1.1);dn.position.set(2,0,8);b.add(dn);o.dan=dn;
 const s=sign('PICCOLA ITALIA','#2f8f4e','#ffffff',8,1.3);s.position.set(0,1.4,o.r-5.6);b.add(s);}

// ---------- island 2: CHILL (chilllikethatyk, day 2 of asking) — massive port + giant cruise ship
{const o=makeIsle(-90,-130,28,true,'@chilllikethatyk');const b=o.bld;
 b.add(box(44,1.2,8,MT.stone,0,-.2,o.r-6));for(let k=0;k<8;k++)b.add(cyl(.4,.5,.8,MT.dark,-19+k*5.4,.6,o.r-2.6,8));
 const tm=new THREE.Group();tm.add(box(18,6,9,std('#f4f4f4'),0,3,0));tm.add(box(18.4,.6,9.4,std('#2f7de1'),0,6.3,0));tm.add(box(16,2.4,.1,MT.glass,0,3,4.55));const ts=sign('CRUISE TERMINAL','#2f7de1','#ffffff',10,1.3);ts.position.set(0,5.1,4.6);tm.add(ts);tm.position.set(-4,0,6);b.add(tm);
 for(const x of [-18,15]){const cr=new THREE.Group();cr.add(box(.8,12,.8,std('#f2a33a'),0,6,0));cr.add(box(12,.7,.7,std('#f2a33a'),3,12,0));cr.add(box(.12,3.5,.12,MT.dark,8,10,0));cr.position.set(x,0,o.r-8);cr.rotation.y=-Math.PI/2;b.add(cr);}
 for(let k=0;k<10;k++)b.add(box(4,2,2.2,[MT.red,MT.blue,MT.orange,MT.teal,std('#f2c230'),MT.green][k%6],-16+(k%5)*4.4,1+(k>4?2:0),-8));
 const sh=new THREE.Group();const L0=58;sh.add(box(L0,6,10,std('#ffffff'),0,1,0));sh.add(box(L0+.1,1.2,10.1,std('#1b4f9c'),0,-1.2,0));const bw=new THREE.Mesh(new THREE.ConeGeometry(5,8,4),std('#ffffff'));bw.rotation.z=-Math.PI/2;bw.rotation.x=Math.PI/4;bw.scale.set(1,1,.98);bw.position.set(L0/2+3.6,1.4,0);sh.add(bw);
 for(let d=0;d<4;d++){const w=L0-8-d*8;sh.add(box(w,2.4,9-d*.8,std('#fbfbfb'),-3-d*1.5,5.2+d*2.4,0));for(const z of [1,-1])sh.add(box(w-1,.7,.06,std('#2d5f80',{roughness:.15}),-3-d*1.5,5.3+d*2.4,z*(4.5-d*.4+.03)));}
 for(const x of [-10,-2])sh.add(box(3.4,4.6,3.2,std('#e8334f'),x,16.8,0));for(let k=0;k<3;k++)sh.add(box(1.6,.6,.06,std('#2d5f80'),-L0/2+6+k*3,1.6,5.03));
 const cs=sign('HERBERG CRUISES','#1b4f9c','#ffffff',14,1.6);cs.position.set(8,2.2,5.06);sh.add(cs);sh.position.set(0,SEA-T10-.6,o.r+7);sh.traverse(q=>q.castShadow=true);b.add(sh);o.ship=sh;
 const ch=pawn('#9b59d6',1.2);ch.position.set(10,0,o.r-7);b.add(ch);o.chill=ch;
 const s=sign('CHILL CRUISE PORT','#1d232b','#f2c230',9,1.3);s.position.set(10,1.4,-o.r+8);s.rotation.y=Math.PI;b.add(s);}

// ---------- island 3: DAVE (D4VE) — the richest man in Herberg: Gold Island, bank, gold bars, statue
{const o=makeIsle(90,-130,28,true,'D4VE',std('#f5d76e'));const b=o.bld;
 const bk=new THREE.Group();bk.add(box(20,1.2,12,whiteM,0,.6,0));bk.add(box(18,8,10,std('#f7f1e1'),0,5.2,-.5));for(let k=0;k<7;k++)bk.add(cyl(.55,.55,8,whiteM,-7.8+k*2.6,5.2,5.2,10));
 const ped=new THREE.Mesh(new THREE.CylinderGeometry(3,3,20,3),gold10);ped.rotation.z=Math.PI/2;ped.rotation.x=Math.PI/2;ped.scale.set(1,1,.45);ped.position.set(0,10.4,4.4);bk.add(ped);bk.add(box(20,.8,12,gold10,0,9.4,-.4));
 const bs=sign("DAVE'S BANK",'#1d232b','#f2c230',9,1.4);bs.position.set(0,8.2,5.95);bk.add(bs);const ds=new THREE.Mesh(new THREE.SphereGeometry(1.6,12,8),gold10);ds.position.set(0,12.6,-1);bk.add(ds);bk.position.set(0,0,-8);b.add(bk);
 for(let s=0;s<3;s++)for(let k=0;k<4-s;k++)for(let j=0;j<2;j++)b.add(box(1.6,.6,.8,gold10,-15+k*1.7+s*.85,.3+s*.6,6+j*.9));
 for(let s=0;s<4;s++)for(let k=0;k<3;k++)b.add(box(1.4,.5,.7,cash,13+k*1.5,.25+s*.5,6+(s%2)*.4));
 const st=new THREE.Group();st.add(box(3,3,3,stone10,0,1.5,0));const gp=pawn('#f2c230',3.2);gp.traverse(q=>{if(q.isMesh)q.material=gold10;});gp.position.y=3;st.add(gp);const cr=cyl(.9,1.1,1,gold10,0,3+5.7,0,8);st.add(cr);st.position.set(0,0,9);b.add(st);
 const dv=pawn('#2f7de1',1.2);dv.add(box(.6,.4,.6,blk,0,2,0));dv.add(box(.9,.06,.9,blk,0,1.82,0));dv.position.set(5,0,12);b.add(dv);o.dave=dv;
 const coins=[];for(let k=0;k<14;k++){const c=cyl(.5,.5,.12,gold10,0,0,0,12);c.rotation.x=Math.PI/2;b.add(c);coins.push(c);}o.coins=coins;
 const s=sign('RICHEST MAN IN HERBERG','#f2c230','#1d232b',12,1.4);s.position.set(0,1.4,o.r-5.6);b.add(s);}

// ---------- island 4: JOMOTHY — the Jomothy Grand Hotel on the beach
{const o=makeIsle(180,-130,28,true,'Jomothy');const b=o.bld;
 const ht=new THREE.Group();const HH=26;ht.add(box(24,HH,8,std('#fdf6ea'),0,HH/2,0));for(let f=1;f<9;f++){ht.add(box(24.4,.35,9.6,std('#ffffff'),0,f*HH/9,.6));for(let k=0;k<6;k++)ht.add(box(2.6,1.6,.06,MT.glass,-10+k*4,f*HH/9+1.2,4.03));}
 ht.add(box(24.6,1.2,8.6,std('#e8334f'),0,HH+.6,0));const hs=sign('JOMOTHY GRAND HOTEL','#e8334f','#ffffff',14,2);hs.position.set(0,HH+3,0);ht.add(hs);ht.add(box(.3,2.4,.3,MT.dark,-5,HH+1.6,0));ht.add(box(.3,2.4,.3,MT.dark,5,HH+1.6,0));
 ht.add(box(6,3.4,2,std('#e8334f'),0,1.7,5));ht.position.set(0,0,-8);b.add(ht);
 b.add(box(14,.3,7,std('#e8e2d2'),-5,.15,7));b.add(box(12,.2,5.4,std('#3fb6e8',{roughness:.1}),-5,.26,7));
 [['#e8334f',8,8],['#2f7de1',12,12],['#f2c230',16,7],['#e8334f',4,15]].forEach(([c,x,z])=>{const u=new THREE.Group();u.add(cyl(.1,.1,3,MT.white,0,1.5,0,6));const cn=new THREE.Mesh(new THREE.ConeGeometry(2,1,10),std(c));cn.position.y=3.1;u.add(cn);u.add(box(2.4,.25,.9,MT.white,1.4,.4,0));u.position.set(x,0,z);b.add(u);});
 for(const [x,z] of [[-20,-4],[20,-2],[-17,12],[19,14],[-8,17]]){const p=palm10(1);p.position.set(x,0,z);b.add(p);}
 const jm=pawn('#ff8a4c',1.2);jm.add(box(.6,.5,.08,std('#ffffff'),0,1,.32));jm.position.set(-1,0,13);b.add(jm);o.jom=jm;
 const gs=[];for(let k=0;k<4;k++){const p=pawn(['#30c2a8','#9b59d6','#f2d33a','#e85d75'][k],.8);p.position.set(-9+k*3,0,7);b.add(p);gs.push(p);}o.guests=gs;}

// ---------- island 5: BOSNJAK (bosnjak_16_) — the presidential palace
{const o=makeIsle(-180,-215,28,false,'bosnjak_16_');const b=o.bld;
 const pl=new THREE.Group();pl.add(box(26,1.2,14,stone10,0,.6,0));pl.add(box(24,7,11,whiteM,0,4.7,-1));pl.add(box(24.4,.6,11.4,std('#d9b04a',{metalness:.4}),0,8.4,-1));
 for(let k=0;k<8;k++)pl.add(cyl(.5,.5,7,whiteM,-9.8+k*2.8,4.7,5.6,10));const ped=new THREE.Mesh(new THREE.CylinderGeometry(3,3,24,3),whiteM);ped.rotation.z=Math.PI/2;ped.rotation.x=Math.PI/2;ped.scale.set(1,1,.42);ped.position.set(0,9.6,5);pl.add(ped);
 const dm=new THREE.Mesh(new THREE.SphereGeometry(4.6,20,12,0,Math.PI*2,0,Math.PI/2),std('#d9b04a',{metalness:.5,roughness:.3}));dm.position.set(0,8.8,-2);pl.add(dm);pl.add(cyl(4.7,4.7,2,whiteM,0,9.4,-2,20));
 const f=flagPole(pl,-.9,13.4,-2,1.4);o.flag=f;for(let k=0;k<5;k++)pl.add(box(1.4,2.4,.06,MT.glass,-8+k*4,4.4,4.53));
 const ps=sign('PRESIDENTIAL PALACE','#1d3f8a','#ffffff',11,1.4);ps.position.set(0,8,6.5);pl.add(ps);pl.position.set(0,0,-6);b.add(pl);
 b.add(box(3,.08,16,std('#c92a2a'),0,.1,9));for(const x of [-3,3])for(let k=0;k<3;k++){const gd=pawn('#1d232b',1);gd.add(cyl(.32,.32,.8,blk,0,2.1,0,8));gd.position.set(x,0,4+k*5);b.add(gd);}
 const pr=pawn('#1d232b',1.3);const sash=box(.08,1.2,.08,std('#e8334f'),0,.9,.34);sash.rotation.z=.7;pr.add(sash);pr.add(box(.9,.12,.9,blk,0,1.95,0));pr.position.set(0,0,15);b.add(pr);o.pres=pr;
 for(const x of [-12,12]){const f2=flagPole(b,x,0,14,1.3);}for(const [x,z] of [[-19,8],[19,8],[-18,-12],[18,-12]]){const t=tree8(1.2);t.position.set(x,0,z);b.add(t);}}

// ---------- island 6: UI UI (Xx_ui_ui_xX) — "make my pork farm bigger": a whole farm island
{const o=makeIsle(-90,-215,28,false,'Xx_ui_ui_xX');const b=o.bld;
 const bn=new THREE.Group();bn.add(box(12,7,9,std('#c0392b'),0,3.5,0));const rf=new THREE.Mesh(new THREE.CylinderGeometry(4.8,4.8,12.4,4,1),std('#5f646b'));rf.rotation.z=Math.PI/2;rf.rotation.x=Math.PI/4;rf.scale.set(1,1,1.2);rf.position.y=7.2;bn.add(rf);
 bn.add(box(4,4.4,.1,std('#f4f4f4'),0,2.2,4.55));bn.add(box(3.6,.3,.12,std('#c0392b'),0,2.2,4.6).rotateZ(.8));bn.add(box(3.6,.3,.12,std('#c0392b'),0,2.2,4.6).rotateZ(-.8));bn.position.set(-10,0,-10);b.add(bn);
 const sl=new THREE.Group();sl.add(cyl(2.4,2.4,14,std('#cfd8e0',{metalness:.4}),0,7,0,16));sl.add(new THREE.Mesh(new THREE.SphereGeometry(2.4,16,8,0,Math.PI*2,0,Math.PI/2),std('#cfd8e0',{metalness:.4})).translateY(14));sl.position.set(1,0,-12);b.add(sl);
 fence(b,-20,20,-2,18,0,'#f3ecd8',3);b.add(box(10,.12,6,std('#7a5230'),-6,.08,10));
 const pigs=[];for(let k=0;k<14;k++){const p=pig(1.1);const a=k*2.399;p.position.set(Math.cos(a)*(4+k*.9)*.95,0,8+Math.sin(a)*(3+k*.35)*.9);p.rotation.y=a*1.7;b.add(p);pigs.push(p);}o.pigs=pigs;
 const fm=pawn('#3e8fe6',1.2);fm.add(cyl(.9,.9,.12,std('#e2c27a'),0,1.92,0,12));fm.add(cyl(.38,.38,.3,std('#e2c27a'),0,2.08,0,10));fm.position.set(12,0,0);b.add(fm);o.farmer=fm;
 const s=sign('UI UI PORK FARM','#c0392b','#ffffff',9,1.4);s.position.set(0,1.4,o.r-4.8);b.add(s);
 for(const [x,z] of [[18,-12],[-21,4],[20,6]]){const t=tree8(1.1);t.position.set(x,0,z);b.add(t);}}

// ---------- island 7: ONLINE STRANGER — "make the military stronger": Fortress Island
{const o=makeIsle(0,-215,30,false,'Online_Stranger',std('#a7b08a'));const b=o.bld;
 const R=19;for(let k=0;k<24;k++){const a=k/24*Math.PI*2;if(Math.abs(Math.sin(a))<.12&&Math.cos(a)<0)continue;const w=box(5.2,4.4,1.6,stone10,Math.sin(a)*R,2.2,Math.cos(a)*R);w.rotation.y=a;b.add(w);if(k%2==0)b.add(box(1.4,1,1.7,stone10,Math.sin(a)*R,4.9,Math.cos(a)*R).rotateY(a));}
 for(let k=0;k<4;k++){const a=k*Math.PI/2+Math.PI/4;const tw=new THREE.Group();tw.add(cyl(2.6,3,9,stone10,0,4.5,0,12));tw.add(cyl(3.1,3.1,1,stone10,0,9.4,0,12));tw.position.set(Math.sin(a)*R,0,Math.cos(a)*R);b.add(tw);}
 const tks=[];[[-7,4,.3],[0,7,0],[7,3,-.3]].forEach(([x,z,r])=>{const t=tank10();t.position.set(x,0,z);t.rotation.y=-Math.PI/2+r;b.add(t);tks.push(t);});o.tanks=tks;
 const hp=new THREE.Group();hp.add(cyl(6,6,.2,MT.road,0,.1,0,24));hp.add(box(.6,.05,5,MT.line,-1.5,.22,0));hp.add(box(.6,.05,5,MT.line,1.5,.22,0));hp.add(box(3,.05,.6,MT.line,0,.22,0));hp.position.set(0,0,-8);b.add(hp);
 const fj=fighter();fj.position.set(0,0,-8);fj.rotation.y=Math.PI/2;b.add(fj);o.jet=fj;
 const rd=new THREE.Group();rd.add(box(.4,5,.4,MT.dark,0,2.5,0));const dish=new THREE.Mesh(new THREE.SphereGeometry(2.4,14,8,0,Math.PI*2,0,Math.PI/2.6),std('#f4f4f4',{side:THREE.DoubleSide}));dish.rotation.x=-Math.PI/2.4;dish.position.y=5.4;rd.add(dish);rd.position.set(11,0,-10);b.add(rd);o.radar=rd;
 const ws=new THREE.Group();ws.add(box(36,3,7,navy10,0,0,0));const bw=new THREE.Mesh(new THREE.ConeGeometry(3.5,6,4),navy10);bw.rotation.z=-Math.PI/2;bw.rotation.x=Math.PI/4;bw.position.set(21,0,0);ws.add(bw);
 ws.add(box(8,4,5,navy10,-4,3.5,0));ws.add(box(4,3,3.6,navy10,-4,7,0));ws.add(cyl(.2,.2,5,MT.dark,-4,10.5,0,6));const gt=new THREE.Group();gt.add(box(3,1.4,2.6,navy10,0,0,0));gt.add(cyl(.2,.2,4,navy10,2.4,0,0,8).rotateZ(Math.PI/2));gt.position.set(10,2.2,0);ws.add(gt);
 ws.add(box(36.1,.5,7.1,std('#c0392b'),0,-1.4,0));const ns=sign('HNS HERBERG','#7d8a96','#ffffff',8,1.2);ns.position.set(4,.4,3.56);ws.add(ns);ws.position.set(0,SEA-T10+.4,o.r+9);ws.traverse(q=>q.castShadow=true);b.add(ws);o.war=ws;
 const os=pawn('#5d7a46',1.2);os.add(cyl(.35,.35,.3,std('#5d7a46'),0,1.92,0,10));os.position.set(-3,0,13);b.add(os);o.soldier=os;
 const s=sign('FORTRESS ISLAND','#3b4a2a','#ffffff',9,1.4);s.position.set(0,6.2,R+.9);b.add(s);}

// ---------- island 8: KINGDOM OF EGYPT — "expand the island" + a pyramid
{const o=makeIsle(90,-215,28,false,'Kingdom of Egypt',std('#e6c77e'));const b=o.bld;
 const py=new THREE.Mesh(new THREE.ConeGeometry(15,17,4),std('#e0b866',{flatShading:true}));py.rotation.y=Math.PI/4;py.position.set(0,8.5,-6);py.castShadow=true;b.add(py);
 const cap=new THREE.Mesh(new THREE.ConeGeometry(2.6,3,4),gold10);cap.rotation.y=Math.PI/4;cap.position.set(0,15.6,-6);b.add(cap);
 for(const x of [-15,15]){const p2=new THREE.Mesh(new THREE.ConeGeometry(5,6,4),std('#d9ad5a',{flatShading:true}));p2.rotation.y=Math.PI/4;p2.position.set(x,3,-12);p2.castShadow=true;b.add(p2);}
 const ob=new THREE.Group();ob.add(box(1.6,12,1.6,std('#d8c39a'),0,6,0));const ot=new THREE.Mesh(new THREE.ConeGeometry(1.15,1.6,4),gold10);ot.rotation.y=Math.PI/4;ot.position.y=12.8;ob.add(ot);ob.position.set(13,0,7);b.add(ob);
 const sx=new THREE.Group();sx.add(box(7,2.4,3,std('#d9ad5a'),0,1.2,0));sx.add(box(2.6,3,2.6,std('#d9ad5a'),3.6,2.6,0));sx.add(box(.6,2.6,3.2,std('#2f7de1'),3.6,2.8,0));sx.position.set(-9,0,8);sx.rotation.y=-.3;b.add(sx);
 for(const [x,z] of [[-20,0],[20,-2],[-4,15],[18,14]]){const p=palm10(1);p.position.set(x,0,z);b.add(p);}
 b.add(box(10,.15,5,MT.water,4,.1,14));const eg=pawn('#f2c230',1.2);eg.add(cyl(.5,.3,.8,std('#2f7de1'),0,2.1,0,8));eg.position.set(0,0,10);b.add(eg);o.eg=eg;
 const s=sign('EGYPT ISLAND','#d9ad5a','#1d232b',8,1.3);s.position.set(0,1.4,o.r-5);b.add(s);}

// ---------- island 9: PUNZIST (PunzistTV) — "the back of the island is a forest": your own forest island
{const o=makeIsle(180,-215,28,false,'PunzistTV',std('#5fae4a'));const b=o.bld;
 for(let k=0;k<46;k++){const a=k*2.399,r=7+((k*37)%17);const x=Math.cos(a)*r,z=Math.sin(a)*r;if(z>6&&Math.abs(x)<9)continue;const t=k%3?pine10(1.1+((k*13)%5)*.12):tree8(1+((k*7)%4)*.1);t.position.set(x,0,z);t.rotation.y=k;b.add(t);}
 const cb=new THREE.Group();cb.add(box(7,4,5.4,std('#8a5a33'),0,2,0));for(let k=0;k<5;k++)cb.add(box(7.2,.25,5.6,std('#6b4423'),0,.5+k*.8,0));cb.add(roof4(8,3,std('#3d6b3a'),5.4,6.6));
 cb.add(box(1.2,2,.1,std('#5a3a1f'),0,1,2.75));cb.add(box(1.4,1,.06,std('#ffe9a8',{emissive:'#ffd36b',emissiveIntensity:.8}),2.2,2.2,2.74));cb.add(box(.8,2.6,.8,MT.stone,2.4,6.2,-1));cb.position.set(0,0,0);b.add(cb);
 const fire=new THREE.Group();for(let k=0;k<5;k++){const l=box(1.6,.25,.25,MT.wood,0,.15,0);l.rotation.y=k*1.26;fire.add(l);}const fl=new THREE.Mesh(new THREE.ConeGeometry(.6,1.6,7),std('#ff8a2a',{emissive:'#ff6a00',emissiveIntensity:1.4}));fl.position.y=.9;fire.add(fl);fire.position.set(3,0,9);b.add(fire);o.flame=fl;
 const pz=pawn('#e8334f',1.2);pz.position.set(0,0,10);b.add(pz);o.pz=pz;const puffs=[];for(let k=0;k<5;k++){const p=new THREE.Mesh(new THREE.IcosahedronGeometry(.7,0),new THREE.MeshStandardMaterial({color:'#d8d8d8',transparent:true,opacity:.7}));b.add(p);puffs.push(p);}o.puffs=puffs;
 const s=sign("PUNZIST'S FOREST",'#2f6b3a','#ffffff',9,1.4);s.position.set(0,1.4,o.r-4.8);b.add(s);}
ISL10.forEach(o=>o.g.traverse(q=>{if(q.isMesh){q.castShadow=true;q.receiveShadow=true;}}));

// ---------- 🚂 William Newham: the train now runs on STEAM
const steam=(()=>{const g=new THREE.Group();const bk=std('#1d232b'),rd=std('#c0392b'),br=std('#d9b04a',{metalness:.5,roughness:.3});
 const bo=cyl(1.05,1.05,4.4,bk,0,1.9,.9,16);bo.rotation.x=Math.PI/2;g.add(bo);g.add(cyl(1.1,1.1,.2,br,0,1.9,3.1,16).rotateX(Math.PI/2));g.add(box(2.4,.5,6.4,rd,0,.6,0));
 g.add(cyl(.32,.45,1.6,bk,0,3.5,2.4,10));g.add(cyl(.55,.4,.4,bk,0,4.4,2.4,10));g.add(new THREE.Mesh(new THREE.SphereGeometry(.45,10,6,0,Math.PI*2,0,Math.PI/2),br).translateY(2.95).translateZ(.6));
 g.add(box(2.4,2.6,2,bk,0,2.4,-2.1));g.add(box(2.6,.25,2.3,rd,0,3.8,-2.1));for(const x of [-1.21,1.21])g.add(box(.06,.9,1,MT.glass,x,2.9,-2));
 const cw=new THREE.Mesh(new THREE.ConeGeometry(1.1,1,4),rd);cw.rotation.x=Math.PI/2;cw.rotation.y=Math.PI/4;cw.scale.set(1,.5,1);cw.position.set(0,.5,3.5);g.add(cw);
 const wh=[];for(const z of [-2,-.5,1])for(const x of [-1.15,1.15]){const w=cyl(.62,.62,.2,rd,x,.62,z,14);w.rotation.z=Math.PI/2;g.add(w);wh.push(w);}g.userData.wh=wh;
 g.traverse(o=>o.castShadow=true);g.visible=false;scene.add(g);return g;})();
const SPUFF=[...Array(10)].map(()=>{const p=new THREE.Mesh(new THREE.IcosahedronGeometry(.8,1),new THREE.MeshStandardMaterial({color:'#f2f2f2',transparent:true,opacity:.85,flatShading:true}));p.visible=false;scene.add(p);return p;});
const locoU=t=>-72+((t*14)%164);
const locoAt=t=>{const u=locoU(t);const p=LW(u,RLV),q=LW(u+1,RLV);return {p:v3(p.x,RLY+.3,p.y),d:v3(q.x-p.x,0,q.y-p.y).normalize()};};

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
