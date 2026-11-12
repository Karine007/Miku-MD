// ===== SPECIAL: the volcano erupts — share / like goal to save Herberg =====
const ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const backOut=k=>{const c=1.9;return 1+(c+1)*Math.pow(k-1,3)+c*Math.pow(k-1,2);};
NEW.forEach(g=>g.userData.t=-1); roadParts.forEach(g=>g.userData.t=-1); CUTT.fill(-10);
const ERUPT=4.5;
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
const WALLV=CV-27, wallMat=new THREE.MeshStandardMaterial({color:'#c9ccd1',roughness:.9});
const WALL=[];for(let u=CU-62;u<=CU+46;u+=4){const g=new THREE.Group();const vv=WALLV+Math.pow((u-CU)/40,2)*-3;g.add(box(4.3,7,2.6,wallMat,0,3.5,0));g.add(box(1.3,1.2,2.6,wallMat,-1.4,7.6,0));g.add(box(1.3,1.2,2.6,wallMat,1.4,7.6,0));
 const p=L(u,vv);g.position.set(p.x,p.y-.5,p.z);g.lookAt(L(u,vv+5).setY(p.y-.5));g.visible=false;g.userData.t=39.4+(u-(CU-62))/108*1.8;scene.add(g);WALL.push(g);}

const SH=[
 {t0:0,   t1:4.4, p:[L(0,-150,120),L(0,-140,112)], l:[L(30,90,20),L(30,92,22)], f:46},
 {t0:4.4, t1:8.8, p:[L(-24,36,62),L(-34,26,74)], l:[L(CU,CV,40),L(CU,CV,50)], f:50},
 {t0:8.8, t1:14.6,p:[L(CU+52,CV+30,78),L(CU+40,CV+22,64)], l:[L(CU-6,CV-46,4),L(CU-8,CV-56,2)], f:52},
 {t0:14.6,t1:19.4,p:[L(-34,-10,30),L(-26,-4,27)], l:[L(16,74,14),L(18,78,15)], f:54},
 {t0:19.4,t1:25.2,p:[L(CU-36,34,112),L(CU-36,46,102)], l:[L(CU-18,CV-32,0),L(CU-18,CV-32,0)], f:50},
 {t0:25.2,t1:31.4,p:[L(0,-64,92),L(8,-54,82)], l:[L(0,48,0),L(2,50,0)], f:50},
 {t0:31.4,t1:38.8,p:[L(0,-132,104),L(0,-120,96)], l:[L(30,92,14),L(30,92,14)], f:46},
 {t0:38.8,t1:44.2,p:[L(CU-74,WALLV-84,74),L(CU-56,WALLV-90,70)], l:[L(CU-8,WALLV-16,0),L(CU-8,WALLV-16,0)], f:50},
 {t0:44.2,t1:50,  p:[L(0,-118,140),L(0,-150,170)], l:[L(30,84,10),L(30,84,10)], f:46},
];
const DUR=50;
const caps=[
 ['c1',.2,4.4,TXT.s0],['c1',4.7,8.8,TXT.s1],['c1',9.0,14.6,TXT.s2],['c1',14.8,19.4,TXT.s3],['c1',19.6,25.2,TXT.s4],
 ['c1',25.4,31.4,TXT.s5],['c2',27.0,31.4,TXT.s5b],['c1',31.6,38.8,TXT.s6],['c2',34.0,38.8,TXT.s6b],['c1',39.0,44.2,TXT.s7],['c1',44.4,DUR,TXT.s8],['c2',46.4,DUR,TXT.s8b],
];
const TAGS=[
 ['🔥 LAVA','coming down the mountain',()=>FLOWS[1].tip.position.clone().add(v3(0,6,0)),11.0,14.6],
 ['🔥 LAVA FRONT','still moving...',()=>FLOWS[1].tip.position.clone().add(v3(0,5,0)),20.2,25.2],
 ['✈️ AIRPORT','next in line',()=>L(0,RV,8).setY(AY+10),20.8,25.2],
 ['🧱 LAVA WALL','built if we hit ONE goal',()=>L(CU-8,WALLV,14),41.0,44.2],
];
$('tags').innerHTML=TAGS.map(t=>`<div class="ntag"><div class="tt">${t[0]}</div><div class="ts">${t[1]}</div></div>`).join('');
// extra overlays: red alarm vignette, countdown, "IF WE FAIL" tint
const stage=$('c1').parentNode;
stage.insertAdjacentHTML('beforeend',`<div id="vign" style="position:absolute;inset:0;pointer-events:none;box-shadow:inset 0 0 220px 60px rgba(232,40,20,.9);opacity:0"></div>
<div id="tint" style="position:absolute;inset:0;background:rgba(255,70,20,.28);mix-blend-mode:multiply;opacity:0"></div>
<div id="timer" style="position:absolute;top:1180px;left:50%;transform:translateX(-50%);background:#e8334f;border:6px solid #1d232b;border-radius:26px;box-shadow:0 9px 0 rgba(0,0,0,.3);color:#fff;font-family:Nunito;font-weight:900;font-size:76px;padding:6px 34px;white-space:nowrap;opacity:0">⏳ <span id="clock">24:00:00</span></div>`);
$('timer').dataset.base='translateX(-50%)';
$('goals').style.top='1000px';
window.CAPTION_TIMES=[...new Set(caps.map(c=>c[1]))].concat(TAGS.map(t=>t[3]),[19.8,32.4,33.0,44.8,45.4]).concat(WALL.map(w=>Math.round(w.userData.t*10)/10).filter((x,i,a)=>a.indexOf(x)===i&&i%3===0));
window.CUTS=SH.map(s=>s.t0);
window.BOOMS=[ERUPT,8.9,25.6];window.MOOD='tense';
function popAt(el,t,a,b,{inDur=.28,outDur=.15}={}){
 if(t<a||t>b){el.style.opacity=0;return 0;}
 const k=clamp((t-a)/inDur), ko=clamp((b-t)/outDur);const s= k<1 ? (k<.6? .55+.6*(k/.6) : 1.15-.15*((k-.6)/.4)) : 1;
 el.style.opacity=Math.min(k*2,ko,1); el.style.transform=(el.dataset.base||'')+` scale(${s})`; return 1;}
const proj=(v)=>{const p=v.clone().project(camera);return [(p.x+1)/2*1080,(1-p.y)/2*1920,p.z];};
const hms=s=>{s=Math.max(0,Math.floor(s));return [s/3600|0,(s/60|0)%60,s%60].map(x=>String(x).padStart(2,'0')).join(':');};

window.setTime=function(t){
 const sh=SH.find(s=>t>=s.t0&&t<s.t1)||SH[SH.length-1];
 const k=ease(clamp((t-sh.t0)/(sh.t1-sh.t0)));
 camera.position.lerpVectors(sh.p[0],sh.p[1],k); const look=new THREE.Vector3().lerpVectors(sh.l[0],sh.l[1],k);
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
 const fk=t>=25.6&&t<31.4?ease(clamp((t-25.6)/4.2)):0; flood.visible=fk>0; if(fk>0){const rows=Math.ceil(fk*flood.userData.rows);flood.geometry.setDrawRange(0,rows*flood.userData.cols*6);flood.material.color.setHSL(.045,1,.5+.05*Math.sin(t*5));}
 // the lava wall plan
 for(const w of WALL){const kk=t>=38.8&&t<44.2?clamp((t-w.userData.t)/.4):0;w.visible=kk>0;if(kk>0)w.scale.set(1,Math.max(.01,backOut(kk)),1);}

 renderer.render(scene,camera);

 // ---------- UI ----------
 const used={c1:false,c2:false};
 for(const [id,a,b,txt] of caps){ if(t>=a&&t<=b){const el=$(id); if(el.dataset.txt!==txt){el.innerHTML=txt;el.dataset.txt=txt;} popAt(el,t,a,b); used[id]=true; } }
 for(const id in used) if(!used[id]) $(id).style.opacity=0;
 $('popn').textContent='1,354';
 const tg=$('tag');if(t>=8.8){tg.textContent='🚨 DANGER';tg.style.background='#e8334f';tg.style.color='#fff';tg.style.opacity=Math.sin(t*6)>-.3?1:.35;}else tg.style.opacity=0;
 $('vign').style.opacity=t<ERUPT?0:(t<ERUPT+.6?1:.35+.3*(.5+.5*Math.sin(t*4.5)));
 $('tint').style.opacity=t>=25.4&&t<31.4?Math.min(1,(t-25.4)/.4):0;
 const tOn=(t>=19.8&&t<25.2)||(t>=44.8&&t<=DUR);popAt($('timer'),t,t<30?19.8:44.8,t<30?25.2:DUR);
 $('clock').textContent=hms(86400-(t-19.8)*1);
 [...$('goals').children].forEach((el,i)=>{const on=(t>=31.4&&t<38.8)||(t>=44.2);const a=t<40?32.4+i*.6:45.4+i*.6;popAt(el,t,on?a:99,on?(t<40?38.8:DUR):0);el.querySelector('i').style.width=(3*ease(clamp((t-a-.2)/.8)))+'%';el.classList.toggle('hot',Math.sin(t*5+i)>.6);});
 if(t>=44.2){$('timer').style.top='1560px';}else $('timer').style.top='1180px';
 [...$('tags').children].forEach((el,i)=>{const [_,__,pf,a,b]=TAGS[i];const pp=proj(pf());el.dataset.base='translate(-50%,-100%)';const hw=el.offsetWidth/2+24;el.style.left=Math.min(1080-hw,Math.max(hw,pp[0]))+'px';el.style.top=Math.max(560+el.offsetHeight+18,pp[1])+'px';popAt(el,t,a,b);if(pp[2]>1)el.style.opacity=0;});
 let fl=0; for(const c of window.CUTS){ if(c>0&&t>=c&&t<c+.12) fl=.5*(1-(t-c)/.12);} if(t>=ERUPT&&t<ERUPT+.5){fl=Math.max(fl,1-(t-ERUPT)/.5);$('flash').style.background='#ffb14a';}else $('flash').style.background='#fff';
 $('flash').style.opacity=fl;
};
window.DUR=DUR; window.__T2={camera,renderer,scene,L,LW,FLOWS,CU,CV};
document.fonts.ready.then(()=>{window.setTime(0);window.READY=true;});
