// ===== DAY 4 · FIREFIGHTERS: trucks fight the lava, but only a wall can stop it =====
const ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const backOut=k=>{const c=1.9;return 1+(c+1)*Math.pow(k-1,3)+c*Math.pow(k-1,2);};
NEW.forEach(g=>g.userData.t=-1); roadParts.forEach(g=>g.userData.t=-1); CUTT.fill(-10);
const ERUPT=-30;
sun.shadow.mapSize.set(2048,2048);  // lighter render
const [CU,CV]=cityUV(V.x,V.y);                       // crater in the city frame (~49, 141)
const hemi=scene.children.find(o=>o.isHemisphereLight);
const SKY0=new THREE.Color('#8fd0ff'),SKY1=new THREE.Color('#c9785a'),FOG0=scene.fog.color.clone(),FOG1=new THREE.Color('#b98a72');
const AY=airport.position.y+airport.userData.dy;
cessna.position.copy(L(10,RV+6.5)).setY(AY+.6);cessna.rotation.y=ALONG_ANG;

// ---------- lava rivers: ribbons draped on the slope, revealed segment by segment
const lavaMat=new THREE.MeshBasicMaterial({color:'#ff5a14',polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2,side:THREE.DoubleSide});
const coreMat=new THREE.MeshBasicMaterial({color:'#ffd23a',polygonOffset:true,polygonOffsetFactor:-4,polygonOffsetUnits:-4,side:THREE.DoubleSide});
const crustMat=new THREE.MeshBasicMaterial({color:'#3a1d14',polygonOffset:true,polygonOffsetFactor:-1,polygonOffsetUnits:-1,side:THREE.DoubleSide});
function ribbon(pts,wf,lift,mat){const pos=[];for(let i=0;i<pts.length-1;i++){const a=pts[i],b=pts[i+1];const du=b[0]-a[0],dv=b[1]-a[1],l=Math.hypot(du,dv)||1;const nu=-dv/l,nv=du/l;
  const wa=wf(i/(pts.length-1)),wb=wf((i+1)/(pts.length-1));const q=[[a[0]+nu*wa,a[1]+nv*wa],[a[0]-nu*wa,a[1]-nv*wa],[b[0]+nu*wb,b[1]+nv*wb],[b[0]-nu*wb,b[1]-nv*wb]].map(([u,v])=>{const p=LW(u,v);return [p.x,Math.max(H(p.x,p.y),SEA)+lift,p.y];});
  pos.push(...q[0],...q[1],...q[2],...q[1],...q[3],...q[2]);}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));const m=new THREE.Mesh(g,mat);m.frustumCulled=false;m.userData.n=pts.length-1;scene.add(m);return m;}
const FLOWS=[[[CU,CV],[CU-5,CV-10],[CU-14,CV-20],[CU-22,CV-29],[CU-27,CV-27-12]],
             [[CU,CV],[CU+2,CV-10],[CU+6,CV-18],[CU+2,CV-26],[CU+4,CV-30]],
             [[CU,CV],[CU+6,CV-9],[CU+18,CV-17],[CU+28,CV-22],[CU+35,CV-29]]].map((cp,fi)=>{
 const pts=new THREE.CatmullRomCurve3(cp.map(([u,v])=>v3(CU+(u-CU)*.7,0,CV+(v-CV)*.66))).getSpacedPoints(70).map(p=>[p.x+Math.sin(p.z*.35+fi)*.6,p.z]);
 const w=k=>2.2+k*2.6+Math.sin(k*19+fi)*.35;
 const parts=[ribbon(pts,k=>w(k)+.9,.7,crustMat),ribbon(pts,w,.85,lavaMat),ribbon(pts,k=>w(k)*.35,.95,coreMat)];
 const tip=new THREE.Mesh(new THREE.SphereGeometry(1,14,10),new THREE.MeshBasicMaterial({color:'#ff7a1f'}));tip.scale.set(4,1.4,4);scene.add(tip);
 const glow=new THREE.PointLight('#ff6a1a',0,40,1.6);scene.add(glow);
 return {pts,parts,tip,glow,w};});
// how far down the mountain the lava has come (0..1), it stops 1 day from the airport
const flowK=t=>t<ERUPT+.8?0:Math.min(1,.62*ease(clamp((t-ERUPT-.8)/8))+.26*clamp((t-13.3)/6)+.12*clamp((t-19.4)/5.4));
function lavaAt(t){const k=flowK(t);for(const [fi,F] of FLOWS.entries()){const kk=clamp(k*(1-fi*.04));const n=Math.floor(kk*(F.pts.length-1));
  F.parts.forEach(m=>{m.visible=n>0;m.geometry.setDrawRange(0,n*6);});
  F.tip.visible=n>1;F.glow.intensity=n>1?260:0;if(n>1){const [u,v]=F.pts[n];const p=L(u,v,.5);F.tip.position.copy(p);F.glow.position.copy(p).setY(p.y+4);F.tip.scale.set(F.w(kk)*1.05,1.3+.2*Math.sin(t*5+fi),F.w(kk)*1.05);}}
 lavaMat.color.setHSL(.045,1,.48+.05*Math.sin(t*5));coreMat.color.setHSL(.12,1,.58+.06*Math.sin(t*7+1));}
// ---------- lava bombs + ash column
const NB=140,bombs=new THREE.InstancedMesh(new THREE.IcosahedronGeometry(.7,0),new THREE.MeshBasicMaterial({color:'#ff7a1a'}),NB);bombs.frustumCulled=false;scene.add(bombs);
const BOMB=[...Array(NB)].map((_,i)=>{const a=i*2.399,sp=4+((i*37)%10)*.9;return {vx:Math.cos(a)*sp,vz:Math.sin(a)*sp,vy:20+((i*53)%10)*1.6,ph:(i*.618)%1,s:.6+((i*17)%10)/12};});
const CTOP=H(V.x,V.y)+3;
function bombsAt(t){const on=t>=ERUPT;for(let i=0;i<NB;i++){const b=BOMB[i];const P=2.6;const age=(t-ERUPT)-b.ph*P;let s=0;
  if(on&&age>0){const a=(age%P);_p.set(V.x+b.vx*a,CTOP+b.vy*a-11*a*a,V.y+b.vz*a);s=_p.y>H(_p.x,_p.z)?b.s*(t<ERUPT+3?1.6:1):0;}
  _q.identity();_s.setScalar(s);_m.compose(_p,_q,_s);bombs.setMatrixAt(i,_m);}bombs.instanceMatrix.needsUpdate=true;}
const ash=[...Array(26)].map((_,i)=>{const m=new THREE.Mesh(new THREE.IcosahedronGeometry(4,1),new THREE.MeshStandardMaterial({color:'#4b4442',flatShading:true,transparent:true,opacity:0}));scene.add(m);return m;});
function ashAt(t){const k=clamp((t-ERUPT)/1.2);ash.forEach((b,i)=>{const ph=((t-ERUPT)*.07+i/ash.length)%1;const r=ph*16;b.visible=k>0;
  b.position.set(V.x+Math.sin(i*2.1)*r+ph*30,CTOP+4+ph*90*k,V.y+Math.cos(i*2.1)*r*.6-ph*12);b.scale.setScalar((.7+ph*3.2)*k);b.material.opacity=.92*(1-ph*ph);});}
// ---------- "if we fail" preview: a lava sheet floods the capital (shot 6 only)
const flood=(()=>{const pos=[],U0=-84,U1=84,V0=-4,V1=112,S=4;for(let v=V1;v>V0;v-=S)for(let u=U0;u<U1;u+=S){const q=[[u,v],[u+S,v],[u,v-S],[u+S,v-S]].map(([a,b])=>{const p=L(a,b,1.5);return [p.x,p.y,p.z];});pos.push(...q[0],...q[2],...q[1],...q[1],...q[2],...q[3]);}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));const m=new THREE.Mesh(g,new THREE.MeshBasicMaterial({color:'#ff5a14',side:THREE.DoubleSide}));m.frustumCulled=false;m.visible=false;scene.add(m);
 m.userData.rows=(V1-V0)/S;m.userData.cols=(U1-U0)/S;return m;})();
// ---------- the lava wall we build if a goal is hit (shown as a plan)
const WALLV=CV-27, wallMat=new THREE.MeshStandardMaterial({color:'#c9ccd1',roughness:.9,transparent:true,opacity:.55});
const WALL=[];for(let u=CU-62;u<=CU+46;u+=4){const g=new THREE.Group();const vv=WALLV+Math.pow((u-CU)/40,2)*-3;g.add(box(4.3,7,2.6,wallMat,0,3.5,0));g.add(box(1.3,1.2,2.6,wallMat,-1.4,7.6,0));g.add(box(1.3,1.2,2.6,wallMat,1.4,7.6,0));
 const p=L(u,vv);g.position.set(p.x,p.y-.5,p.z);g.lookAt(L(u,vv+5).setY(p.y-.5));g.visible=false;g.userData.t=26.6+(u-(CU-62))/108*1.4;scene.add(g);WALL.push(g);}


// ---------- fire trucks + firefighters (@south_parkfan39 @tommy67778)
function fireTruck(){const g=new THREE.Group();const rd=std('#d92b25'),wh=std('#f4f4f4');g.add(box(2.3,1.9,5.2,rd,0,1.35,-.4));g.add(box(2.3,1.5,1.7,rd,0,1.15,2.95));g.add(box(2.1,.7,.08,MT.glass,0,1.55,3.82));
 g.add(box(2.34,.25,5.24,wh,0,1.0,-.4));const lad=new THREE.Group();lad.add(box(.12,.12,5,MT.white,-.45,0,0));lad.add(box(.12,.12,5,MT.white,.45,0,0));for(let k=-2;k<=2;k++)lad.add(box(.9,.08,.08,MT.white,0,0,k));lad.position.set(0,2.45,-.6);lad.rotation.x=-.06;g.add(lad);
 const lr=box(.6,.25,.4,std('#ff2a2a',{emissive:'#ff2a2a',emissiveIntensity:1}),-.45,2.05,3.1),lb=box(.6,.25,.4,std('#2a6dff',{emissive:'#2a6dff',emissiveIntensity:1}),.45,2.05,3.1);g.add(lr,lb);g.userData={lr,lb};
 for(const x of [-1.1,1.1])for(const z of [-2.2,-.6,2.8]){const w=cyl(.45,.45,.3,MT.dark,x,.45,z,10);w.rotation.z=Math.PI/2;g.add(w);}g.traverse(o=>o.castShadow=true);g.scale.setScalar(1.15);scene.add(g);return g;}
const PARK=[[30,106],[48,108],[68,108]], FT=FLOWS.map(F=>F.pts[F.pts.length-1]);
const TRUCKS=PARK.map((pk,i)=>{const g=fireTruck();const route=[[-32.7+i*1.7,61],[-31+i*.2,55.4],[47.6-i*.4,55.4],[47.6-i*.4,92],[pk[0],pk[1]]];
 let len=0;const seg=route.slice(1).map((p,k)=>{const a=route[k];const l=Math.hypot(p[0]-a[0],p[1]-a[1]);len+=l;return l;});g.userData.route=route;g.userData.seg=seg;g.userData.len=len;g.userData.t0=6.0+i*.8;return g;});
function routeAt(g,k){let d=k*g.userData.len;const r=g.userData.route,sg=g.userData.seg;for(let j=0;j<sg.length;j++){if(d<=sg[j]||j==sg.length-1){const f=Math.min(1,d/sg[j]);return [r[j][0]+(r[j+1][0]-r[j][0])*f,r[j][1]+(r[j+1][1]-r[j][1])*f,r[j+1][0]-r[j][0],r[j+1][1]-r[j][1]];}d-=sg[j];}}
const FF=[];TRUCKS.forEach((tr,i)=>{for(const sd of [-1.6,1.6]){const p=new THREE.Group();const b=new THREE.Mesh(new THREE.CapsuleGeometry(.34,.75,4,8),std('#f2c230'));b.position.y=.75;const h=new THREE.Mesh(new THREE.SphereGeometry(.36,10,8),std('#d92b25'));h.position.y=1.65;
 const hose=box(.14,.14,1.1,MT.dark,0,1.1,.6);p.add(b,h,hose);p.traverse(o=>o.castShadow=true);p.scale.setScalar(1.05);p.visible=false;scene.add(p);FF.push({p,i,sd});}});
const NDROP=26,drops=new THREE.InstancedMesh(new THREE.SphereGeometry(.28,8,6),new THREE.MeshStandardMaterial({color:'#bfe8ff',emissive:'#5fb8ff',emissiveIntensity:.35,roughness:.2}),FF.length*NDROP);drops.frustumCulled=false;scene.add(drops);
const steam=[...Array(30)].map(()=>{const m=new THREE.Mesh(new THREE.IcosahedronGeometry(1.6,1),new THREE.MeshStandardMaterial({color:'#f4f4f4',flatShading:true,transparent:true,opacity:0}));m.visible=false;scene.add(m);return m;});
const SPRAY0=14.4,SPRAY1=27;
function trucksAt(t){TRUCKS.forEach((g,i)=>{const k=ease(clamp((t-g.userData.t0)/7.4));const [u,v,du,dv]=routeAt(g,k);const P=L(u,v,0);g.position.copy(P);
  if(k<1){const l=Math.hypot(du,dv)||1;g.lookAt(L(u+du/l*3,v+dv/l*3,0).setY(P.y));}else g.lookAt(L(u,v+5,0).setY(P.y));
  const on=Math.sin(t*14+i)>0;g.userData.lr.material.emissiveIntensity=on?2:0;g.userData.lb.material.emissiveIntensity=on?0:2;});
 const spraying=t>=SPRAY0&&t<SPRAY1;
 FF.forEach((f,j)=>{const tr=TRUCKS[f.i];const arrived=t>=tr.userData.t0+7.5;f.p.visible=arrived;if(!arrived)return;const [pu,pv]=PARK[f.i];const P=L(pu+f.sd,pv+3.6,0);f.p.position.copy(P);const T=FT[f.i];const tgt=L(T[0],T[1],.6);f.p.lookAt(tgt.x,P.y,tgt.z);
  for(let n=0;n<NDROP;n++){const idx=j*NDROP+n;let s=0;if(spraying){const ph=((t*1.3+n/NDROP+j*.13)%1);const a=f.p.position.clone().add(v3(0,1.3,0));const b=tgt.clone().add(v3(Math.sin(n*7+j)*1.2,0,Math.cos(n*5+j)*1.2));_p.lerpVectors(a,b,ph);_p.y+=Math.sin(ph*Math.PI)*7;s=1-ph*.3;}
   _q.identity();_s.setScalar(s);_m.compose(_p,_q,_s);drops.setMatrixAt(idx,_m);}});
 drops.instanceMatrix.needsUpdate=true;
 steam.forEach((m,i)=>{const T=FT[i%3];const ph=((t*.45+i/steam.length)%1);m.visible=spraying;if(!spraying)return;const c=L(T[0],T[1],0);m.position.set(c.x+Math.sin(i*2.3)*2.5,c.y+1+ph*14,c.z+Math.cos(i*1.7)*2.5);m.scale.setScalar(.6+ph*2.2);m.material.opacity=.75*(1-ph);});
 // lava front cools a little while we spray, then it is clear it's not enough
 const cool=t<SPRAY0?0:t<21.2?clamp((t-SPRAY0-1)/4)*.55:t<23.8?.55-.05*Math.sin(t*3):Math.max(0,.55-(t-23.8)*.5);
 FLOWS.forEach(F=>{F.tip.material.color.set('#ff7a1f').lerp(new THREE.Color('#5a2a1c'),cool);F.glow.intensity=260*(1-cool*.8);});}

const SH=[
 {t0:0,   t1:3.6, p:[L(0,-132,104),L(0,-124,99)], l:[L(30,92,14),L(30,92,14)], f:46},
 {t0:3.6, t1:8,   p:[L(-12,34,15),L(-17,38,13)], l:[L(-31,60,3),L(-30,58,2)], f:52},
 {t0:8,   t1:14,  follow:true, f:54},
 {t0:14,  t1:21,  p:[L(40,84,17),L(33,87,15)], l:[L(46,112,4),L(46,112,4)], f:52},
 {t0:21,  t1:26,  p:[L(56,98,11),L(58,101,10)], l:[L(50,117,3),L(50,118,3)], f:54},
 {t0:26,  t1:32,  p:[L(CU-74,WALLV-84,74),L(CU-56,WALLV-90,70)], l:[L(CU-8,WALLV-16,0),L(CU-8,WALLV-16,0)], f:50},
 {t0:32,  t1:38,  p:[L(0,-132,104),L(0,-120,96)], l:[L(30,92,14),L(30,92,14)], f:46},
 {t0:38,  t1:43,  p:[L(0,-118,140),L(0,-150,170)], l:[L(30,84,10),L(30,84,10)], f:46},
];
const DUR=43;
const caps=[
 ['c1',.2,3.6,TXT.f0],['c1',3.8,8,TXT.f1],['c1',8.2,14,TXT.f2],['c1',14.2,21,TXT.f3],['c1',21.2,23.6,TXT.f4],['c1',23.8,26,TXT.f5],['c2',24.4,26,TXT.f5b],
 ['c1',26.2,32,TXT.f6],['c2',28,32,TXT.f6b],['c1',32.2,38,TXT.f7],['c1',38.2,DUR,TXT.f8],['c2',40,DUR,TXT.f8b],
];
const TAGS=[
 ['🚒 FIRE STATION','requested by @tommy67778',()=>L(-31,63,9),4.4,8],
 ['👩‍🚒 FIREFIGHTER','@south_parkfan39',()=>FF[0].p.position.clone().add(v3(0,3.2,0)),15.0,21],
 ['👨‍🚒 FIREFIGHTER','@tommy67778',()=>FF[5].p.position.clone().add(v3(0,3.2,0)),15.6,21],
 ['🧱 LAVA WALL','🔒 unlocks at 1,000 shares',()=>L(CU-8,WALLV,14),27.4,32],
];
$('tags').innerHTML=TAGS.map(t=>`<div class="ntag"><div class="tt">${t[0]}</div><div class="ts">${t[1]}</div></div>`).join('');
// extra overlays: red alarm vignette, countdown, "IF WE FAIL" tint
const stage=$('c1').parentNode;
stage.insertAdjacentHTML('beforeend',`<div id="vign" style="position:absolute;inset:0;pointer-events:none;box-shadow:inset 0 0 220px 60px rgba(232,40,20,.9);opacity:0"></div>
<div id="tint" style="position:absolute;inset:0;background:rgba(255,70,20,.28);mix-blend-mode:multiply;opacity:0"></div>
<div id="timer" style="position:absolute;top:1180px;left:50%;transform:translateX(-50%);background:#e8334f;border:6px solid #1d232b;border-radius:26px;box-shadow:0 9px 0 rgba(0,0,0,.3);color:#fff;font-family:Nunito;font-weight:900;font-size:76px;padding:6px 34px;white-space:nowrap;opacity:0">⏳ <span id="clock">24:00:00</span></div>`);
$('timer').dataset.base='translateX(-50%)';
$('goals').style.top='1000px';
window.CAPTION_TIMES=[...new Set(caps.map(c=>c[1]))].concat(TAGS.map(t=>t[3]),[32.4,33.0,38.6,14.4,21.2,23.8]).concat(WALL.map(w=>Math.round(w.userData.t*10)/10).filter((x,i,a)=>a.indexOf(x)===i&&i%3===0));
window.CUTS=SH.map(s=>s.t0);
window.BOOMS=[23.8];window.MOOD='tense';
function popAt(el,t,a,b,{inDur=.28,outDur=.15}={}){
 if(t<a||t>b){el.style.opacity=0;return 0;}
 const k=clamp((t-a)/inDur), ko=clamp((b-t)/outDur);const s= k<1 ? (k<.6? .55+.6*(k/.6) : 1.15-.15*((k-.6)/.4)) : 1;
 el.style.opacity=Math.min(k*2,ko,1); el.style.transform=(el.dataset.base||'')+` scale(${s})`; return 1;}
const proj=(v)=>{const p=v.clone().project(camera);return [(p.x+1)/2*1080,(1-p.y)/2*1920,p.z];};
const hms=s=>{s=Math.max(0,Math.floor(s));return [s/3600|0,(s/60|0)%60,s%60].map(x=>String(x).padStart(2,'0')).join(':');};

window.setTime=function(t){
 const sh=SH.find(s=>t>=s.t0&&t<s.t1)||SH[SH.length-1];
 const k=ease(clamp((t-sh.t0)/(sh.t1-sh.t0)));
 trucksAt(t);
 let look;if(sh.follow){const g=TRUCKS[0];const d=new THREE.Vector3(0,0,1).applyQuaternion(g.quaternion);camera.position.copy(g.position).addScaledVector(d,-24).add(v3(-6,14,0));look=g.position.clone().addScaledVector(d,8);sh.p=[camera.position.clone(),camera.position.clone()];sh.l=[look,look];}
 else {camera.position.lerpVectors(sh.p[0],sh.p[1],k); look=new THREE.Vector3().lerpVectors(sh.l[0],sh.l[1],k);}
 // earthquake shake: hard at the eruption, then a constant rumble
 const A=t<ERUPT?0:(t<ERUPT+4.3?1.1*Math.exp(-(t-ERUPT)*.7)+.12:.12)*(sh.p[0].distanceTo(sh.l[0])/90);
 camera.position.add(v3(Math.sin(t*41)*A,Math.sin(t*37+1)*A*.7,Math.sin(t*43+2)*A));
 camera.lookAt(look); camera.fov=sh.f||46; camera.updateProjectionMatrix();
 // the sky turns ashy after the eruption
 const sk=clamp((t-ERUPT)/3)*.85; scene.background.copy(SKY0).lerp(SKY1,sk); scene.fog.color.copy(FOG0).lerp(FOG1,sk);
 if(hemi)hemi.intensity=1.25-.4*sk; sun.color.set('#fff3dc').lerp(new THREE.Color('#ffb08a'),sk);
 clouds.forEach((c,i)=>{c.userData.bx??=c.position.x;c.position.x=c.userData.bx+t*1.4*(i%2?1:-1);});
 smoke.forEach((b,i)=>{const ph=((t*.12+i/smoke.length)%1);b.visible=t<ERUPT;b.position.set(V.x+ph*20+Math.sin(i*3)*3,H(V.x,V.y)+5+ph*40,V.y-ph*9);b.scale.setScalar(.9+ph*3);b.material.opacity=.8*(1-ph);});
 lava.material.color.setHSL(.06,1,t<ERUPT?.5:.6+.08*Math.sin(t*6)); lava.scale.setScalar(t<ERUPT?1:1.25);
 ghosts.forEach(g=>g.visible=false); pawns.forEach(p=>p.visible=false); flagGrp.visible=false; siteA.visible=siteB.visible=false;
 cutAt(t); bombsAt(t); ashAt(t); lavaAt(t);
 for(const g of roadParts)g.visible=true;
 for(const g of NEW){g.visible=true;g.scale.setScalar(1);if(g.userData.base!==undefined){g.position.y=g.userData.base+Math.sin(t*1.5+g.position.x)*.15;g.rotation.z=Math.sin(t*1.2+g.position.z)*.04;}}
 // citizens: calm, then running in panic
 const tw=t+4*Math.max(0,t-ERUPT-1); peopleAt(tw,true);
 plaza.userData.jets.forEach((j,i)=>{const a=i/10*Math.PI*2,ph=((t*1.2+i*.1)%1);j.position.set(Math.cos(a)*(1.3+ph*1.6),1.2+ph*2.4-ph*ph*2.4,Math.sin(a)*(1.3+ph*1.6));});
 kids.forEach(kd=>{const i=kd.userData.i;kd.position.y=.25+Math.abs(Math.sin(t*6+i))*.35;});
 police.userData.lt.material.color.set(Math.sin(t*12)>0?'#e8334f':'#2f7de1');
 pizzeria.userData.sign.rotation.y=t*1.5; watermill.userData.wheel.rotation.z=-t*1.2; lighthouse.userData.piv.rotation.y=t*1.6;
 { const cu=coaster.userData.curve,ph=(t*.09)%1;coaster.userData.cart.position.copy(cu.getPoint(ph));coaster.userData.cart.lookAt(cu.getPoint((ph+.004)%1)); }
 iceTruck.visible=true;{const a=(t*.022)%2,f=a<1?a:2-a,dir=a<1?1:-1;const u=-30+f*90;const lane=dir>0?-.9:.9;iceTruck.position.copy(L(u,lane,.26));iceTruck.lookAt(L(u+dir*2,lane,.26));}
 { const a=t*.12;const c=L(0,30);jetliner.position.set(c.x+Math.cos(a)*190,95,c.z+Math.sin(a)*150);jetliner.lookAt(c.x+Math.cos(a+.05)*190,95,c.z+Math.sin(a+.05)*150);jetliner.rotateY(-Math.PI/2); }
 birds.forEach(b=>{const {i,wl,wr}=b.userData;const a=t*(t<ERUPT?.25:.6)+i*.7;const R=60+(i%3)*20;const c=L(0,20);b.position.set(c.x+Math.cos(a)*R,52+(i%4)*6+Math.sin(t+i)*1.5,c.z+Math.sin(a)*R*.8);b.rotation.y=-a;const fl=Math.sin(t*(t<ERUPT?10:18)+i)*.5;wl.rotation.z=.35+fl;wr.rotation.z=-.35-fl;});
 // what-if flood
 const fk=false?ease(clamp((t-25.6)/4.2)):0; flood.visible=fk>0; if(fk>0){const rows=Math.ceil(fk*flood.userData.rows);flood.geometry.setDrawRange(0,rows*flood.userData.cols*6);flood.material.color.setHSL(.045,1,.5+.05*Math.sin(t*5));}
 // the lava wall plan
 for(const w of WALL){const kk=t>=26&&t<32.2?clamp((t-w.userData.t)/.4):0;w.visible=kk>0;if(kk>0)w.scale.set(1,Math.max(.01,backOut(kk)),1);}

 renderer.render(scene,camera);

 // ---------- UI ----------
 const used={c1:false,c2:false};
 for(const [id,a,b,txt] of caps){ if(t>=a&&t<=b){const el=$(id); if(el.dataset.txt!==txt){el.innerHTML=txt;el.dataset.txt=txt;} popAt(el,t,a,b); used[id]=true; } }
 for(const id in used) if(!used[id]) $(id).style.opacity=0;
 $('popn').textContent='1,354';
 const tg=$('tag');if(t>=8.8){tg.textContent='🚨 DANGER';tg.style.background='#e8334f';tg.style.color='#fff';tg.style.opacity=Math.sin(t*6)>-.3?1:.35;}else tg.style.opacity=0;
 $('vign').style.opacity=t<ERUPT?0:(t<ERUPT+.6?1:.35+.3*(.5+.5*Math.sin(t*4.5)));
 $('tint').style.opacity=0;
 const tOn=(t>=19.8&&t<25.2)||(t>=44.8&&t<=DUR);popAt($('timer'),t,38.6,DUR);
 $('clock').textContent=hms(61325-(t-38.6)*1);
 [...$('goals').children].forEach((el,i)=>{const on=(t>=32&&t<38)||(t>=38.6);const a=t<38?32.4+i*.6:39.2+i*.6;popAt(el,t,on?a:99,on?(t<38?38:DUR):0);el.querySelector('i').style.width='0%';el.classList.toggle('hot',Math.sin(t*5+i)>.6);});
 if(t>=38){$('timer').style.top='1560px';}else $('timer').style.top='1180px';
 [...$('tags').children].forEach((el,i)=>{const [_,__,pf,a,b]=TAGS[i];const pp=proj(pf());el.dataset.base='translate(-50%,-100%)';const hw=el.offsetWidth/2+24;el.style.left=Math.min(1080-hw,Math.max(hw,pp[0]))+'px';el.style.top=Math.max(560+el.offsetHeight+18,pp[1])+'px';popAt(el,t,a,b);if(pp[2]>1)el.style.opacity=0;});
 let fl=0; for(const c of window.CUTS){ if(c>0&&t>=c&&t<c+.12) fl=.5*(1-(t-c)/.12);} if(t>=ERUPT&&t<ERUPT+.5){fl=Math.max(fl,1-(t-ERUPT)/.5);$('flash').style.background='#ffb14a';}else $('flash').style.background='#fff';
 $('flash').style.opacity=fl;
};
window.DUR=DUR; window.__T2={camera,renderer,scene,L,LW,FLOWS,CU,CV};
document.fonts.ready.then(()=>{window.setTime(0);window.READY=true;});
