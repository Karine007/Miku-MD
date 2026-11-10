// ===== DAY 1 RECAP SCENE (spliced into recap.html by make_recap.py) =====
const STATS = {views: 975, likes: 37, comments: 36, shares: 3, saves: 6, followers: 80};
const SEAWARD=new THREE.Vector2(SITE_A.x,SITE_A.y).normalize(); const ALONG=new THREE.Vector2(-SEAWARD.y,SEAWARD.x);
const CITY=SITE_A.clone().addScaledVector(SEAWARD,-2);
function LW(u,v){return new THREE.Vector2(CITY.x+ALONG.x*u-SEAWARD.x*v, CITY.y+ALONG.y*u-SEAWARD.y*v);}
function L(u,v,h=0){const p=LW(u,v);return new THREE.Vector3(p.x,Math.max(H(p.x,p.y),SEA)+h,p.y);}
siteA.visible=siteB.visible=false;

// ---------- citizens: one pawn per follower, dropped onto the beach site
const PCOL=['#f2a33a','#30c2a8','#9b59d6','#e85d75','#3e8fe6','#f2d33a','#7bd65b','#ff8a4c','#ff6fb1','#5fd3f3'];
const bodyG=new THREE.CapsuleGeometry(.32,.7,5,10), headG=new THREE.SphereGeometry(.27,14,10);
const citizens=[];
{ let k=0; for(let i=0;i<4000&&citizens.length<STATS.followers;i++){
    const r=2+Math.sqrt(i/4000)*20, a=i*2.39996;               // golden-angle spiral, densest in the middle
    const u=Math.cos(a)*r, v=Math.sin(a)*r*.75+2; const p=LW(u,v); const y=H(p.x,p.y);
    if(y<SEA+.9||riverDist(p.x,p.y)<4) continue;
    if(citizens.some(c=>Math.hypot(c.userData.u-u,c.userData.v-v)<1.7)) continue;
    const m=new THREE.MeshStandardMaterial({color:PCOL[k%PCOL.length],roughness:.5});
    const g=new THREE.Group();const b=new THREE.Mesh(bodyG,m);b.position.y=.7;const h=new THREE.Mesh(headG,m);h.position.y=1.55;g.add(b,h);
    g.traverse(o=>o.castShadow=true);g.userData={u,v,y,k,t:4.9+k*.055+((k*37)%10)*.012};g.visible=false;scene.add(g);citizens.push(g);k++; } }
// the "YOU?" pawn for the follow call-to-action
const you=(()=>{const m=new THREE.MeshStandardMaterial({color:'#ffffff',roughness:.4,emissive:'#ffcc2e',emissiveIntensity:.35});
 const g=new THREE.Group();const b=new THREE.Mesh(bodyG,m);b.position.y=.7;const h=new THREE.Mesh(headG,m);h.position.y=1.55;g.add(b,h);g.traverse(o=>o.castShadow=true);
 const p=L(0,-1);g.position.copy(p);g.userData={y:p.y};g.visible=false;scene.add(g);return g;})();

// ---------- "the map gets bigger" ghost island offshore
const newLand=(()=>{const g=new THREE.Group();const shape=new THREE.Shape();const n=14;
 for(let i=0;i<=n;i++){const a=i/n*Math.PI*2,r=26*(1+.22*Math.sin(a*3+1)+.12*Math.cos(a*5));const x=Math.cos(a)*r,y=Math.sin(a)*r;i?shape.lineTo(x,y):shape.moveTo(x,y);}
 const geo=new THREE.ExtrudeGeometry(shape,{depth:3,bevelEnabled:false});geo.rotateX(-Math.PI/2);
 g.add(new THREE.Mesh(geo,new THREE.MeshBasicMaterial({color:'#e4fbff',transparent:true,opacity:.55,depthWrite:false})));
 g.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo,20),new THREE.LineBasicMaterial({color:'#ffffff'})));
 g.position.set(52,SEA-1.5,122);g.visible=false;scene.add(g);return g;})();

// ---------- volcano eruption teaser (lava bombs)
// mystery gift box for the "save" goal
const gift=(()=>{const g=new THREE.Group();const gm=new THREE.MeshStandardMaterial({color:'#9b59d6',roughness:.5}),rm=new THREE.MeshStandardMaterial({color:'#ffcc2e',metalness:.3,roughness:.4});
 const b=new THREE.Mesh(new THREE.BoxGeometry(4,3.4,4),gm);b.position.y=1.7;const lid=new THREE.Mesh(new THREE.BoxGeometry(4.4,.9,4.4),gm);lid.position.y=3.8;
 const r1=new THREE.Mesh(new THREE.BoxGeometry(.7,4.5,4.5),rm);r1.position.y=2.2;const r2=new THREE.Mesh(new THREE.BoxGeometry(4.5,4.5,.7),rm);r2.position.y=2.2;
 const bow1=new THREE.Mesh(new THREE.TorusGeometry(.8,.25,8,16),rm);bow1.position.set(-.6,4.7,0);bow1.rotation.y=Math.PI/2;const bow2=bow1.clone();bow2.position.x=.6;
 g.add(b,lid,r1,r2,bow1,bow2);g.traverse(o=>o.castShadow=true);const p=L(0,9);g.position.copy(p);g.userData.y=p.y;g.visible=false;scene.add(g);return g;})();
const bombs=[];for(let i=0;i<16;i++){const b=new THREE.Mesh(new THREE.IcosahedronGeometry(2.4,0),new THREE.MeshBasicMaterial({color:i%3?'#ff6a1a':'#ffcc2e'}));b.visible=false;scene.add(b);bombs.push(b);}

// ===== TIMELINE =====
const ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const v3=(x,y,z)=>new THREE.Vector3(x,y,z);
const SH=[
 {t0:0,   t1:4.6, p:[v3(70,215,230),v3(50,198,212)], l:[v3(0,0,4),v3(-2,0,6)]},
 {t0:4.6, t1:11.2,p:[L(36,-50,56),L(28,-42,46)], l:[L(0,3,0),L(0,3,0)], f:50},
 {t0:11.2,t1:16.2,p:[L(10,-22,10),L(6,-19,9)], l:[L(0,3,1),L(0,4,1)], f:55},
 {t0:16.2,t1:22.2,p:[L(-14,-20,14),L(-10,-18,12)], l:[L(0,3,1),L(0,3,1)], f:55},
 {t0:22.2,t1:26.2,p:[v3(150,150,260),v3(130,165,252)], l:[v3(10,30,20),v3(10,30,14)], f:46},
 {t0:26.2,t1:30.2,p:[v3(80,70,92),v3(68,64,82)], l:[v3(-18,64,-18),v3(-19,66,-20)], f:46},
 {t0:30.2,t1:34.2,p:[L(30,-46,52),L(24,-40,44)], l:[L(0,6,16),L(0,6,16)], f:50},
 {t0:34.2,t1:40,  p:[L(8,-16,9),L(5,-12,7)], l:[L(0,-1,2),L(0,-1,2)], f:55},
];
const DUR=40;
const caps=[
 ['c1',0.2,4.6,TXT.s1],
 ['c1',4.8,11.2,TXT.s2a],['c2',9.6,11.2,TXT.s2b],
 ['c1',11.4,16.2,TXT.s3],
 ['c1',16.4,22.2,TXT.s4],
 ['c1',22.4,34.2,TXT.s5],
 ['c1',34.4,DUR,TXT.s6],['c2',36.0,DUR,TXT.s6b],
];
// first commenters get name tags over a citizen near the front
const TAGN=['@radamel.falcao98','@dusan_rajic','@hyperstat','@giorgito4','@opanak_offical','@vachechu'];
const tagged=[-7.5,-4.5,-1.5,1.5,4.5,7.5].map(u0=>citizens.slice().sort((a,b)=>(Math.abs(a.userData.u-u0)+a.userData.v*.5)-(Math.abs(b.userData.u-u0)+b.userData.v*.5))[0]);
$('tags').innerHTML=TAGN.map(n=>`<div class="ntag"><div class="ts">${n}</div></div>`).join('')+`<div class="ntag you"><div class="tt">YOU?</div></div>`;
const BUBBLES=TXT.bubbles; // [text, @user]
$('bubbles').innerHTML=BUBBLES.map(b=>`<div class="bub"><div class="bq">${b[0]}</div><div class="bu">${b[1]}</div></div>`).join('');
$('goals').innerHTML=TXT.goals.map(g=>`<div class="goal"><div class="ge">${g[0]}</div><div class="gb"><div class="gt">${g[1]}</div><div class="gs">${g[2]}</div><div class="bar"><i style="background:${g[5]}"></i></div></div><div class="gn">${g[3]}/${g[4]}</div></div>`).join('');
window.CAPTION_TIMES=[...new Set(caps.map(c=>c[1]))].concat([1.2,1.6,2.0, 11.8,12.2,12.6,13.0,13.4,13.8, 17.0,18.0,19.0,20.0, 23.6,26.6,29.6, 35.0]);
window.CUTS=SH.map(s=>s.t0);
function popAt(el,t,a,b,{inDur=.28,outDur=.15}={}){
 if(t<a||t>b){el.style.opacity=0;return 0;}
 const k=clamp((t-a)/inDur), ko=clamp((b-t)/outDur);const s= k<1 ? (k<.6? .55+.6*(k/.6) : 1.15-.15*((k-.6)/.4)) : 1;
 el.style.opacity=Math.min(k*2,ko,1); el.style.transform=(el.dataset.base||'')+` scale(${s})`; return 1;}
const proj=(v)=>{const p=v.clone().project(camera);return [(p.x+1)/2*1080,(1-p.y)/2*1920,p.z];};
const CRATER=v3(V.x,H(V.x,V.y)+2,V.y);

window.setTime=function(t){
 const sh=SH.find(s=>t>=s.t0&&t<s.t1)||SH[SH.length-1];
 const k=ease(clamp((t-sh.t0)/(sh.t1-sh.t0)));
 camera.position.lerpVectors(sh.p[0],sh.p[1],k); camera.lookAt(new THREE.Vector3().lerpVectors(sh.l[0],sh.l[1],k));
 camera.fov=sh.f||42; camera.updateProjectionMatrix();
 clouds.forEach((c,i)=>{c.userData.bx??=c.position.x;c.position.x=c.userData.bx+t*1.2*(i%2?1:-1);});
 smoke.forEach((b,i)=>{const ph=((t*.12+i/smoke.length)%1);b.position.set(V.x+ph*14+Math.sin(i*3)*2,H(V.x,V.y)+4+ph*30,V.y-ph*6);b.scale.setScalar(.6+ph*2.2);b.material.opacity=.8*(1-ph);});
 lava.material.color.setHSL(.06,1,.5+.06*Math.sin(t*4));
 ghosts.forEach(g=>g.visible=false); pawns.forEach(p=>p.visible=false); flagGrp.visible=false;

 // citizens drop from the sky with a bounce, then idle-bob
 let landed=0;
 for(const c of citizens){const d=t-c.userData.t; c.visible=d>-.6;
  if(!c.visible) continue; const p=LW(c.userData.u,c.userData.v);
  let y; if(d<0){y=c.userData.y+(-d)*45;} else {landed++; const bnc=Math.abs(Math.sin(d*9))*Math.exp(-d*5)*1.2; y=c.userData.y+bnc+Math.abs(Math.sin(t*4+c.userData.k))*.06;}
  c.position.set(p.x,y-.1,p.y); c.scale.setScalar(1.45); c.lookAt(camera.position.x,c.position.y,camera.position.z);}
 // YOU? pawn
 { const d=t-35.0; you.visible=d>-.6; if(you.visible){const y=d<0?you.userData.y+(-d)*40:you.userData.y+Math.abs(Math.sin(d*9))*Math.exp(-d*4)*1.3;you.position.y=y;you.scale.setScalar(1.6);you.lookAt(camera.position.x,y,camera.position.z);} }
 // new land grows while the "share" goal is on screen
 const g1=clamp((t-23.8)/3); newLand.visible=t>=23.6&&t<34.2; newLand.scale.set(Math.max(.01,ease(g1)),1,Math.max(.01,ease(g1)));
 // eruption teaser while the "like" goal is on screen
 bombs.forEach((b,i)=>{const d=t-26.9-i*.12; b.visible=t>=26.6&&t<30.2&&d>0&&d<2.2; if(b.visible){const a=i*2.4,sp=6+(i%4)*2;b.position.set(CRATER.x+Math.cos(a)*sp*d,CRATER.y+22*d-9.8*d*d*1.6,CRATER.z+Math.sin(a)*sp*d);}});
 lava.scale.setScalar(t>=26.6&&t<30.2?1.3+.2*Math.sin(t*12):1);
 { const d=t-30.9; gift.visible=t>=30.2&&t<34.2&&d>-.7; if(gift.visible){gift.position.y=d<0?gift.userData.y+(-d)*60:gift.userData.y+Math.abs(Math.sin(d*8))*Math.exp(-d*4)*2;gift.rotation.y=t*.8;} }

 renderer.render(scene,camera);

 // ---------- UI ----------
 const used={c1:false,c2:false};
 for(const [id,a,b,txt] of caps){ if(t>=a&&t<=b){const el=$(id); if(el.dataset.txt!==txt){el.innerHTML=txt;el.dataset.txt=txt;} popAt(el,t,a,b); used[id]=true; } }
 for(const id in used) if(!used[id]) $(id).style.opacity=0;
 $('popn').textContent = t<34.9 ? landed : STATS.followers + (t>=35.0?1:0);
 $('tag').style.opacity = t>=35.0 ? 1 : 0;
 // stats card
 [...$('stats').children].forEach((c,i)=>popAt(c,t,1.2+i*.4,4.6));
 const sk=ease(clamp((t-1.4)/1.6)); [['sv',STATS.views],['sl',STATS.likes],['sc',STATS.comments]].forEach(([id,n])=>$(id).textContent=Math.round(n*sk).toLocaleString('en-US'));
 // name tags on the first citizens
 [...$('tags').children].forEach((el,i)=>{const isYou=i===TAGN.length;const c=isYou?you:tagged[i];
   if(!c||!c.visible){el.style.opacity=0;return;} const pp=proj(c.position.clone().add(v3(0,isYou?3.4:(i%2?4.4:2.6),0)));
   el.dataset.base='translate(-50%,-100%)';const hw=el.offsetWidth/2+20;el.style.left=Math.min(1080-hw,Math.max(hw,pp[0]))+'px';el.style.top=pp[1]+'px';
   isYou?popAt(el,t,35.4,DUR):popAt(el,t,11.8+i*.4,16.2); if(pp[2]>1)el.style.opacity=0;});
 // comment bubbles
 [...$('bubbles').children].forEach((el,i)=>popAt(el,t,17.0+i,22.2));
 // goals
 [...$('goals').children].forEach((el,i)=>{popAt(el,t,23.6+i*3,34.2);const g=TXT.goals[i];const f=ease(clamp((t-24.0-i*3)/1.2))*g[3]/g[4];
   el.querySelector('i').style.width=(Math.max(.04,f)*100)+'%'; el.classList.toggle('hot',t>=23.6+i*3&&t<26.6+i*3);});
 let fl=0; for(const c of window.CUTS){ if(c>0&&t>=c&&t<c+.12) fl=.5*(1-(t-c)/.12);} $('flash').style.opacity=fl;
};
window.DUR=DUR; window.__T2={camera,renderer,scene,L};
document.fonts.ready.then(()=>{window.setTime(0);window.READY=true;});
