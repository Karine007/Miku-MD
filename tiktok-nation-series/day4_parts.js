// ===== DAY 4 TIMELINE: the great rebuild =====
const ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const backOut=k=>{const c=1.9;return 1+(c+1)*Math.pow(k-1,3)+c*Math.pow(k-1,2);};
// roads draw outward from the plaza
roadParts.forEach(g=>{g.userData.t=16.4+Math.min(110,g.userData.d)/110*5.2;});
// landmarks pop in the "own lot" sequence (already timed 24-30.4); coast + town requests later (timed in v2_world)
const AY=airport.position.y+airport.userData.dy;
cessna.position.copy(L(10,RV+6.5)).setY(AY+.6);cessna.rotation.y=ALONG_ANG;
const SH=[
 {t0:0,   t1:4.4, p:[L(0,-175,235),L(0,-165,225)], l:[L(0,40,0),L(0,40,0)], f:46},
 {t0:4.4, t1:9.2, p:[L(0,-160,215),L(4,-150,205)], l:[L(0,40,0),L(0,40,0)], f:46},
 {t0:9.2, t1:16,  p:[L(-40,-64,92),L(-14,-54,82)], l:[L(0,34,0),L(0,34,0)], f:50},
 {t0:16,  t1:24,  p:[L(0,-46,118),L(0,-34,106)], l:[L(0,36,0),L(0,38,0)], f:50},
 {t0:24,  t1:34,  p:[L(76,-34,52),L(-66,-34,52)], l:[L(0,30,2),L(0,30,2)], f:52},
 {t0:34,  t1:39.5,p:[L(0,84,150),L(0,74,140)], l:[L(0,-42,0),L(0,-46,0)], f:52},
 {t0:39.5,t1:42.6,p:[L(-56,-42,24),L(-66,-38,22)], l:[L(-66,-5,3),L(-66,-5,3)], f:56},
 {t0:42.6,t1:45.6,p:[L(68,-32,20),L(72,-30,18)], l:[L(86,-6,11),L(86,-6,11)], f:55},
 {t0:45.6,t1:48.4,p:[L(46,-26,16),L(36,-24,15)], l:[L(30,3,2),L(30,3,2)], f:58},
 {t0:48.4,t1:51.2,p:[L(-36,36,34),L(-40,40,32)], l:[L(-48,74,6),L(-48,76,6)], f:56},
 {t0:51.2,t1:56,  p:[L(152,-28,30),L(148,-22,28)], l:[L(130,4,3),L(130,4,3)], f:55},
 {t0:56,  t1:63,  p:[L(0,-118,168),L(0,-140,196)], l:[L(0,40,0),L(0,40,0)], f:46},
];
const DUR=63;
const caps=[
 ['c1',.2,4.4,TXT.s0],
 ['c1',4.6,9.2,TXT.s1],['c2',6.9,9.2,TXT.s1b],
 ['c1',9.4,12.6,TXT.s2a],['c1',12.8,16,TXT.s2b],
 ['c1',16.2,24,TXT.s3],
 ['c1',24.2,29,TXT.s4a],['c1',29.2,34,TXT.s4b],
 ['c1',34.2,39.5,TXT.s5],
 ['c1',39.7,42.6,TXT.s6a],['c1',42.8,45.6,TXT.s6b],
 ['c1',45.8,48.4,TXT.s7a],['c1',48.6,51.2,TXT.s7b],
 ['c1',51.4,56,TXT.s8],['c2',53.6,56,TXT.s8b],
 ['c1',56.2,DUR,TXT.s9],['c2',59.6,DUR,TXT.s9b],
];
const TAGS=[
 ['🛣️ ROADS','@led77263 · @karlthegreat45 · @siarieslangto',()=>L(0,18,1),18.0,24],
 ['🌉 BRIDGES','@doomstrikerhehe',()=>{const p=bridge1.position;return v3(p.x,p.y+4,p.z).lerp(isleT.position,.45).setY(p.y+4);},35.0,39.5],
 ['⚓ PORT SUNNY','@warenoty90',()=>L(28,-11,6),36.0,39.5],
 ['🏰 COAST MANSION','@cocobananapotato',()=>L(-88,-5,12),40.1,42.6],
 ['🏠 BEACH HOUSE','@myshayla861',()=>L(-58,-6,6),40.7,42.6],
 ['⛱️ BEACH SPOT','@_eruzazyy',()=>L(-32,-7,4),41.3,42.6],
 ['🗼 LIGHTHOUSE MAN','@ihyxiyo765',()=>L(86,-6,17),43.2,45.6],
 ['🍦 ICE CREAM TRUCK','@liambluee · @muazzambotak',()=>iceTruck.position.clone().add(v3(0,4,0)),46.2,48.4],
 ['🎵 MUSIC SHOP','@illityunahstan',()=>L(17,45,7),46.8,48.4],
 ['🌾 WATERMILL','@dusan_rajic',()=>L(WM[0],WM[1],8),48.9,51.2],
 ['🗼 AIR TRAFFIC CONTROL','@rainbowpopsicle1777',()=>L(8,RV+9.5,0).setY(AY+12),49.5,51.2],
 ['🛩️ CESSNA','@liam_aviation747',()=>cessna.position.clone().add(v3(0,3,0)),50.1,51.2],
];
$('tags').innerHTML=TAGS.map(t=>`<div class="ntag"><div class="tt">${t[0]}</div><div class="ts">${t[1]}</div></div>`).join('');
window.CAPTION_TIMES=[...new Set(caps.map(c=>c[1]))].concat(TAGS.map(t=>t[3]),[5.0,6.8,52.0,52.4,54.4,57.4,58.0]);
window.CUTS=SH.map(s=>s.t0);
window.POPS=[...new Set(NEW.map(g=>Math.round(g.userData.t*10)/10))].filter(t=>t>23);window.CAPTION_TIMES=window.CAPTION_TIMES.concat(window.POPS);
window.BOOMS=[];
function popAt(el,t,a,b,{inDur=.28,outDur=.15}={}){
 if(t<a||t>b){el.style.opacity=0;return 0;}
 const k=clamp((t-a)/inDur), ko=clamp((b-t)/outDur);const s= k<1 ? (k<.6? .55+.6*(k/.6) : 1.15-.15*((k-.6)/.4)) : 1;
 el.style.opacity=Math.min(k*2,ko,1); el.style.transform=(el.dataset.base||'')+` scale(${s})`; return 1;}
const proj=(v)=>{const p=v.clone().project(camera);return [(p.x+1)/2*1080,(1-p.y)/2*1920,p.z];};

window.setTime=function(t){
 const sh=SH.find(s=>t>=s.t0&&t<s.t1)||SH[SH.length-1];
 const k=ease(clamp((t-sh.t0)/(sh.t1-sh.t0)));
 camera.position.lerpVectors(sh.p[0],sh.p[1],k); camera.lookAt(new THREE.Vector3().lerpVectors(sh.l[0],sh.l[1],k)); camera.fov=sh.f||46; camera.updateProjectionMatrix();
 clouds.forEach((c,i)=>{c.userData.bx??=c.position.x;c.position.x=c.userData.bx+t*1.4*(i%2?1:-1);c.visible=!(t>=34&&t<56);});
 smoke.forEach((b,i)=>{const ph=((t*.12+i/smoke.length)%1);b.position.set(V.x+ph*20+Math.sin(i*3)*3,H(V.x,V.y)+5+ph*40,V.y-ph*9);b.scale.setScalar(.9+ph*3);b.material.opacity=.8*(1-ph);});
 lava.material.color.setHSL(.06,1,.5+.06*Math.sin(t*4));
 ghosts.forEach(g=>g.visible=false); pawns.forEach(p=>p.visible=false); flagGrp.visible=false; siteA.visible=siteB.visible=false;
 cutAt(t);
 for(const g of roadParts){const kk=clamp((t-g.userData.t)/.35);g.visible=kk>0;g.scale.set(1,Math.max(.01,kk),Math.max(.01,kk));}
 for(const g of NEW){ if(g.userData.t<0){g.visible=true;continue;} const kk=clamp((t-g.userData.t)/.45);g.visible=kk>0;if(kk>0){const s=Math.max(.001,backOut(kk));g.scale.setScalar(s);}
   if(g.userData.base!==undefined&&g.visible){g.position.y=g.userData.base+Math.sin(t*1.5+g.position.x)*.15;g.rotation.z=Math.sin(t*1.2+g.position.z)*.04;}}
 peopleAt(t,t>=24.6);
 plaza.userData.jets.forEach((j,i)=>{const a=i/10*Math.PI*2,ph=((t*1.2+i*.1)%1);j.position.set(Math.cos(a)*(1.3+ph*1.6),1.2+ph*2.4-ph*ph*2.4,Math.sin(a)*(1.3+ph*1.6));});
 kids.forEach(kd=>{const i=kd.userData.i;kd.position.y=.25+Math.abs(Math.sin(t*6+i))*.35;});
 police.userData.lt.material.color.set(Math.sin(t*12)>0?'#e8334f':'#2f7de1');
 pizzeria.userData.sign.rotation.y=t*1.5; watermill.userData.wheel.rotation.z=-t*1.2; lighthouse.userData.piv.rotation.y=t*1.6;
 { const cu=coaster.userData.curve,ph=(t*.09)%1;coaster.userData.cart.position.copy(cu.getPoint(ph));coaster.userData.cart.lookAt(cu.getPoint((ph+.004)%1)); }
 // ice cream truck drives the coast boulevard
 iceTruck.visible=t>=26; if(iceTruck.visible){const a=(t*.022)%2,f=a<1?a:2-a,dir=a<1?1:-1;const u=-30+f*90;const lane=dir>0?-.9:.9;iceTruck.position.copy(L(u,lane,.26));iceTruck.lookAt(L(u+dir*2,lane,.26));}
 // jetliner circles the island
 { const a=t*.12;const c=L(0,30);jetliner.position.set(c.x+Math.cos(a)*190,95,c.z+Math.sin(a)*150);jetliner.lookAt(c.x+Math.cos(a+.05)*190,95,c.z+Math.sin(a+.05)*150);jetliner.rotateY(-Math.PI/2); }
 birds.forEach(b=>{const {i,wl,wr}=b.userData;const a=t*.25+i*.7;const R=60+(i%3)*20;const c=L(0,20);b.position.set(c.x+Math.cos(a)*R,52+(i%4)*6+Math.sin(t+i)*1.5,c.z+Math.sin(a)*R*.8);b.rotation.y=-a;const fl=Math.sin(t*10+i)*.5;wl.rotation.z=.35+fl;wr.rotation.z=-.35-fl;});

 renderer.render(scene,camera);

 // ---------- UI ----------
 const used={c1:false,c2:false};
 for(const [id,a,b,txt] of caps){ if(t>=a&&t<=b){const el=$(id); if(el.dataset.txt!==txt){el.innerHTML=txt;el.dataset.txt=txt;} popAt(el,t,a,b); used[id]=true; } }
 for(const id in used) if(!used[id]) $(id).style.opacity=0;
 $('popn').textContent=Math.round(1160+194*ease(clamp((t-.6)/2.6))).toLocaleString('en-US');
 popAt($('before'),t,5.0,9.2,{inDur:.4}); $('before').querySelector('.xmark').style.opacity=t>=6.8?Math.min(1,(t-6.8)/.15):0;
 if(t>=6.8&&t<7.2) $('before').style.transform=`rotate(${Math.sin(t*60)*2}deg)`;
 popAt($('votes'),t,51.8,56); const vk=ease(clamp((t-52.0)/1.0));
 $('barA').style.width=(STATS.votesA/9*100*vk)+'%'; $('barB').style.width=(STATS.votesB/9*100*vk)+'%'; $('nA').textContent=Math.round(STATS.votesA*vk); $('nB').textContent=Math.round(STATS.votesB*vk);
 [...$('goals').children].forEach((el,i)=>{popAt(el,t,54.4,56);el.querySelector('i').style.width=(Math.max(.03,64/2000)*100*ease(clamp((t-54.6)/.8)))+'%';});
 [...$('tags').children].forEach((el,i)=>{const [_,__,pf,a,b]=TAGS[i];const pp=proj(pf());el.dataset.base='translate(-50%,-100%)';const hw=el.offsetWidth/2+24;el.style.left=Math.min(1080-hw,Math.max(hw,pp[0]))+'px';el.style.top=Math.max(560+el.offsetHeight+18,pp[1])+'px';popAt(el,t,a,b);if(pp[2]>1)el.style.opacity=0;});
 [...$('laws').children].forEach((c,i)=>popAt(c,t,57.4+i*.6,DUR));
 let fl=0; for(const c of window.CUTS){ if(c>0&&t>=c&&t<c+.12) fl=.5*(1-(t-c)/.12);} $('flash').style.opacity=fl;
};
window.DUR=DUR; window.__T2={camera,renderer,scene,L,bridge1,bridge2,isleT,isleC,LW};
document.fonts.ready.then(()=>{window.setTime(0);window.READY=true;});
