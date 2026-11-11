// ===== REQUESTS ENGINE: timeline for "you asked, we built it" episodes =====
// Loaded before the part file: the part file creates buildings with placeAt(), defines SEGS, then startEngine() runs:
//   SEGS = [{t0, t1, p:[camFrom, camTo], l:[lookFrom, lookTo], f:fov, caps:[[id,a,b,html],...], tags:[[title,sub,()=>vec3,a,b],...]}]
const ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const v3=(x,y,z)=>new THREE.Vector3(x,y,z);
const backOut=k=>{const c=1.9;return 1+(c+1)*Math.pow(k-1,3)+c*Math.pow(k-1,2);};
// world after day 3: everything settled
isleT.visible=isleC.visible=true;isleT.position.y=isleC.position.y=SEA-.6;ruins.visible=true;ruins.position.y=ruins.userData.y;
flows.forEach(f=>{f.visible=true;f.material.color.set('#5a2f24');f.geometry.setDrawRange(0,Infinity);});
CROWD.forEach(p=>{p.t=-10;});
function clearCrowd(u,v,r){const w=LW(u,v);CROWD.forEach(p=>{if(Math.hypot(p.x-w.x,p.z-w.y)<r)p.hide=true;});}
const NEW=[];
function placeAt(g,u,v,t,rot=0,r=7){place(g,u,v,t,rot);NEW.push(g);clearCrowd(u,v,r);return g;}
function popAt(el,t,a,b,{inDur=.28,outDur=.15}={}){
 if(t<a||t>b){el.style.opacity=0;return 0;}
 const k=clamp((t-a)/inDur), ko=clamp((b-t)/outDur);const s= k<1 ? (k<.6? .55+.6*(k/.6) : 1.15-.15*((k-.6)/.4)) : 1;
 el.style.opacity=Math.min(k*2,ko,1); el.style.transform=(el.dataset.base||'')+` scale(${s})`; return 1;}
const proj=(v)=>{const p=v.clone().project(camera);return [(p.x+1)/2*1080,(1-p.y)/2*1920,p.z];};
const ANIM=[]; // per-frame callbacks from the part file: fn(t)

function startEngine(){
 const DUR=SEGS[SEGS.length-1].t1;
 const caps=SEGS.flatMap(s=>s.caps||[]), TAGS=SEGS.flatMap(s=>s.tags||[]);
 $('tags').innerHTML=TAGS.map(t=>`<div class="ntag"><div class="tt">${t[0]}</div><div class="ts">${t[1]}</div></div>`).join('');
 window.CAPTION_TIMES=[...new Set(caps.map(c=>c[1]))].concat(TAGS.map(t=>t[3]));
 window.CUTS=SEGS.map(s=>s.t0);
 window.POPS=NEW.map(g=>g.userData.t); window.CAPTION_TIMES=window.CAPTION_TIMES.concat(window.POPS);
 window.setTime=function(t){
  const sh=SEGS.find(s=>t>=s.t0&&t<s.t1)||SEGS[SEGS.length-1];
  const k=ease(clamp((t-sh.t0)/(sh.t1-sh.t0)));
  camera.position.lerpVectors(sh.p[0],sh.p[1],k); camera.lookAt(new THREE.Vector3().lerpVectors(sh.l[0],sh.l[1],k)); camera.fov=sh.f||50; camera.updateProjectionMatrix();
  clouds.forEach((c,i)=>{c.userData.bx??=c.position.x;c.position.x=c.userData.bx+t*1.2*(i%2?1:-1);c.visible=!sh.noClouds;});
  smoke.forEach((b,i)=>{const ph=((t*.12+i/smoke.length)%1);b.position.set(V.x+ph*14+Math.sin(i*3)*2,H(V.x,V.y)+4+ph*30,V.y-ph*6);b.scale.setScalar(.6+ph*2.2);b.material.opacity=.8*(1-ph);});
  lava.material.color.setHSL(.06,1,.5+.06*Math.sin(t*4));
  for(const g of city){ if(g.userData.gone){g.visible=false;continue;} if(g.userData.t<0){g.visible=true;g.scale.setScalar(g.userData.s0??=g.scale.x);continue;}
    const kk=clamp((t-g.userData.t)/.45);g.visible=kk>0;if(kk>0)g.scale.setScalar((g.userData.s0??=g.scale.x)*Math.max(.001,backOut(kk)));}
  pizzeria.userData.sign.rotation.y=t*1.5; ship.position.y=ship.userData.base.y+Math.sin(t*1.6)*.15;
  pigs.forEach(p=>{const i=p.userData.i;const a=t*.5+i*1.7;p.position.set(Math.sin(a*1.3+i)*3,Math.abs(Math.sin(t*6+i))*.08,Math.cos(a+i*2)*2.2);p.rotation.y=-a*1.3+i;});
  ghosts.forEach(g=>g.visible=false); pawns.forEach(p=>p.visible=false); flagGrp.visible=false;
  crowdAt(t); ANIM.forEach(fn=>fn(t));
  renderer.render(scene,camera);
  const used={c1:false,c2:false};
  for(const [id,a,b,txt] of caps){ if(t>=a&&t<=b){const el=$(id); if(el.dataset.txt!==txt){el.innerHTML=txt;el.dataset.txt=txt;} popAt(el,t,a,b); used[id]=true; } }
  for(const id in used) if(!used[id]) $(id).style.opacity=0;
  $('popn').textContent=STATS.followers.toLocaleString('en-US');
  [...$('tags').children].forEach((el,i)=>{const [_,__,pf,a,b]=TAGS[i];const pp=proj(pf());el.dataset.base='translate(-50%,-100%)';const hw=el.offsetWidth/2+24;el.style.left=Math.min(1080-hw,Math.max(hw,pp[0]))+'px';el.style.top=Math.max(560+el.offsetHeight+18,pp[1])+'px';popAt(el,t,a,b);if(pp[2]>1)el.style.opacity=0;});
  if(window.UI) window.UI(t);
  let fl=0; for(const c of window.CUTS){ if(c>0&&t>=c&&t<c+.12) fl=.5*(1-(t-c)/.12);} $('flash').style.opacity=fl;
 };
 window.DUR=DUR; window.__T2={camera,renderer,scene,L};
 document.fonts.ready.then(()=>{window.setTime(0);window.READY=true;});
}
