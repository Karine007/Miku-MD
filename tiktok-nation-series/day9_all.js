window.DAY9_TR=[0, 5.25, 12.95, 18.35, 23.55, 29.95, 34.15, 40.15, 46.65, 51.45, 56.65, 61.55, 71.8];
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

const SH=[
 {t0:0,    t1:4.2,  p:[L(60,-150,120),L(66,-140,112)], l:[L(0,40,10),L(0,40,10)], f:46},
 {t0:4.2,  t1:9.2,  p:[L(-118,56,34),L(-104,58,36)], l:[L(-10,74,8),L(0,74,8)], f:50},
 {t0:9.2,  t1:13.2, p:[L(-66,-34,18),L(-70,-40,26)], l:[L(-112,46,52),L(-112,46,62)], f:58},
 {t0:13.2, t1:17.2, p:[L(-79,47,22),L(-80,49,19)], l:[L(-84,63,2),L(-84,63,2)], f:54},
 {t0:17.2, t1:23.2, p:[L(16,-36,16),L(12,-32,13)], l:[L(0,8,1),L(0,8,1)], f:54},
 {t0:23.2, t1:27.2, p:[L(110,56,28),L(114,60,24)], l:[L(124,91,5),L(124,91,5)], f:52},
 {t0:27.2, t1:31.2, p:[L(4,74,20),L(7,77,26)], l:[L(27,104,20),L(27,104,24)], f:54},
 {t0:31.2, t1:36.2, p:[L(-96,104,40),L(-96,113,30)], l:[L(-96,130,16),L(-96,130,17)], f:54},
 {t0:36.2, t1:40.2, metro:true, f:54},
 {t0:40.2, t1:44.2, p:[L(-77,62,36),L(-76,66,31)], l:[L(-76,93,4),L(-76,93,4)], f:54},
 {t0:44.2, t1:48.2, p:[L(0,50,330),L(0,50,352)], l:[L(0,51,0),L(0,51,0)], f:50},
 {t0:48.2, t1:58,   p:[L(0,40,370),L(0,-55,560)], l:[L(0,41,0),L(0,-54,0)], f:50},
];
const DUR=58;
const TD=[0,4.2,9.2,13.2,17.2,23.2,27.2,31.2,36.2,40.2,44.2,48.2,58];
const TR=window.DAY9_TR||TD, RDUR=TR[TR.length-1];
const pw=(x,A,B)=>{for(let i=0;i<A.length-1;i++)if(x<=A[i+1]||i==A.length-2)return B[i]+(B[i+1]-B[i])*clamp((x-A[i])/(A[i+1]-A[i]));};
const toD=tr=>pw(tr,TR,TD), toR=td=>pw(td,TD,TR);
const caps=[
 ['c1',.2,4.2,TXT.d0],['c1',4.2,9.2,TXT.d1],['c1',9.2,13.2,TXT.d2],['c1',13.2,17.2,TXT.d3],['c1',17.2,20.6,TXT.d4],['c1',20.6,23.2,TXT.d4b],['c1',23.2,27.2,TXT.d5],['c1',27.2,31.2,TXT.d6],
 ['c1',31.2,36.2,TXT.d7],['c1',36.2,40.2,TXT.d8],['c1',40.2,44.2,TXT.d9],['c1',44.2,48.2,TXT.d10],['c1',48.2,DUR,TXT.d11],['c2',51.6,DUR,TXT.d11b],
];
const wp=g=>g.getWorldPosition(v3(0,0,0));
const TAGS=[
 ['🛣️ R32 HIGHWAY','idea: @k17.gaming',()=>L(-30,HV,HB9-gy(-30,HV)+3),6.2,9.2],
 ['🗼 KINGDOM TOWER','AB_22',()=>L(KU9,KV9,30),10.4,13.2],
 ['🏥 PET HOSPITAL','Orbit tree',()=>L(PU,PV,8),14.2,17.2],
 ['🧱 FLOOD WALLS','mr.nine.v.3',()=>L(0,-5,6),21.0,23.2],
 ["🏰 MANKY'S MANSION",'manky',()=>L(MU,MV,18),24.2,27.2],
 ['🎧 AIR TRAFFIC CONTROL','D4SH.av',()=>L(AU,AV,34),28.2,31.2],
 ['🌲 WATCH TOWER','John Angelo',()=>wp(watch9.userData.jn).add(v3(0,3,0)),32.6,36.2],
 ['🚇 RDA METRO','RDA (as BA Europe)',rdaTag,38.4,40.2],
 ['🎓 PROFESSOR','RY#$U',()=>wp(uni.userData.pr).add(v3(0,3,0)),41.4,44.2],
];
$('tags').innerHTML=TAGS.map(t=>`<div class="ntag"><div class="tt">${t[0]}</div><div class="ts">${t[1]}</div></div>`).join('');
window.CAPTION_TIMES=[...new Set(caps.map(c=>c[1]))].concat(TAGS.map(t=>t[3]),[4.6,5.0,20.6,45.9,49.4,50.8,49.6],POP9.filter(g=>!HW.includes(g)&&!MTR.includes(g)).map(g=>g.userData.t),ISL.map(g=>g.userData.t)).map(toR);
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
 if(sh.metro){metroAt(t);const c=mtrain[1].position,d=mtrain[0].position.clone().sub(c).normalize();const side=v3(-d.z,0,d.x);camera.position.copy(c).addScaledVector(d,-14+4*k).addScaledVector(side,-11).add(v3(0,6,0));camera.lookAt(c.clone().addScaledVector(d,6));}
 else {camera.position.lerpVectors(sh.p[0],sh.p[1],k); camera.lookAt(new THREE.Vector3().lerpVectors(sh.l[0],sh.l[1],k));}
 camera.fov=sh.f||46; camera.updateProjectionMatrix();
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
 for(const g of POP9){const kk=clamp((t-g.userData.t)/.5);g.visible=kk>0;if(kk>0)g.scale.setScalar(Math.max(.001,backOut(kk)));}
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

// Day 9 life
 hcarsAt(t); metroAt(t);
 { const lv=floodLvl(t);floodW.visible=t>17.7&&t<23.2;floodW.position.y=lv;floodW.children[1].position.z=-14.4+Math.sin(t*3)*.4;
   const wk=wallK(t);FWALL.forEach(w=>{w.visible=t>20.5;w.position.y=w.userData.y0+3.4*Math.min(1,wk)+(wk>1?(wk-1)*0:0);});
   const rk=clamp((t-17.4)/.6)*(1-clamp((t-22.4)/.6));rain9At(t,rk);sun.intensity=2.3*(1-.55*rk);scene.background.set('#8fd0ff').lerp(new THREE.Color('#6d7f8f'),rk); }
 { const far=t>=44.2;scene.fog.near=far?1400:420;scene.fog.far=far?2600:980; }
 ISL.forEach(g=>{const kk=clamp((t-g.userData.t)/.6);g.visible=kk>0;if(kk>0){g.scale.setScalar(Math.max(.001,1.5*backOut(kk)));g.position.y=SEA-9+9*ease(kk);g.userData.sp.material.opacity=clamp((t-g.userData.t-.3)/.3);}});
 { const P=petHosp.userData;P.pt.userData.tl.rotation.z=.5+Math.sin(t*9)*.5;P.vet.rotation.y=Math.sin(t*1.4)*.5;P.amb.children[2].material.emissiveIntensity=Math.sin(t*12)>0?2:.2; }
 mansion9.userData.mk.rotation.y=Math.sin(t*1.1)*.6;
 atc.userData.rad.rotation.y=t*2.2;atc.userData.bcn.material.emissiveIntensity=Math.sin(t*5)>0?2:.2;
 watch9.userData.fl.rotation.y=Math.sin(t*2)*.25;watch9.userData.jn.rotation.y=Math.sin(t*.9)*.8;
 { const U=uni.userData;U.pr.rotation.y=Math.sin(t*1.3)*.5;U.st.forEach((p,i)=>{p.position.y=U.T+Math.max(0,Math.sin(t*3+i*1.7))*.15;}); }
 renderer.render(scene,camera);

 // ---------- UI ----------
 const used={c1:false,c2:false};
 for(const [id,a,b,txt] of caps){ if(t>=a&&t<=b){const el=$(id); if(el.dataset.txt!==txt){el.innerHTML=txt;el.dataset.txt=txt;} popAt(el,t,a,b); used[id]=true; } }
 for(const id in used) if(!used[id]) $(id).style.opacity=0;
 $('popn').textContent=(1466).toLocaleString('en-US');
 popAt($('votes'),t,4.6,9); const vk=ease(clamp((t-5.0)/1.0));
 $('barA').style.width=(100*vk)+'%'; $('barB').style.width=(50*vk)+'%'; $('nA').textContent=Math.round(2*vk); $('nB').textContent=Math.round(1*vk);
 [...$('goals').children].forEach(el=>popAt(el,t,99,0));
 [...$('tags').children].forEach((el,i)=>{const [_,__,pf,a,b]=TAGS[i];const pp=proj(pf());el.dataset.base='translate(-50%,-100%)';const hw=el.offsetWidth/2+24;el.style.left=Math.min(1080-hw,Math.max(hw,pp[0]))+'px';el.style.top=Math.max(560+el.offsetHeight+18,pp[1])+'px';popAt(el,t,a,b);if(pp[2]>1)el.style.opacity=0;});
 [...$('laws').children].forEach((c,i)=>popAt(c,t,49.4+i*1.4,51.9));
 popAt(fullEl,t,45.9,48.3,{inDur:.22}); { const on=t>=49.6; shareEl.style.opacity=on?1:0; if(on){const pz=1+.1*Math.max(0,Math.sin((t-49.6)*6)); shareEl.style.transform=`scale(${Math.min(1,(t-49.6)/.25)*pz})`;} }
 let fl=0; for(const c of window.CUTS){ if(c>0&&tr>=c&&tr<c+.12) fl=.5*(1-(tr-c)/.12);} $('flash').style.opacity=fl;
};
window.DUR=RDUR; window.__T2={camera,renderer,scene,L,LW};
document.fonts.ready.then(()=>{window.setTime(0);window.READY=true;});
