// ===== DAY 2 TIMELINE =====
const ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const v3=(x,y,z)=>new THREE.Vector3(x,y,z);
const backOut=k=>{const c=1.9;return 1+(c+1)*Math.pow(k-1,3)+c*Math.pow(k-1,2);};
const SH=[
 {t0:0,   t1:4.6, p:[v3(70,215,230),v3(48,195,210)], l:[v3(0,0,4),v3(-2,0,6)]},
 {t0:4.6, t1:9.2, p:[v3(20,165,175),v3(14,150,160)], l:[v3(-6,0,10),v3(-6,0,8)]},
 {t0:9.2, t1:14.2,p:[v3(80,70,90),v3(66,62,78)], l:[v3(-18,26,-20),v3(-20,28,-22)]},
 {t0:14.2,t1:19.2,p:[v3(FLAG_P.x+2.6,FLAG_P.y+3.6,FLAG_P.z+13),v3(FLAG_P.x+2.2,FLAG_P.y+3.7,FLAG_P.z+11)], l:[v3(FLAG_P.x+1.8,FLAG_P.y+4.3,FLAG_P.z),v3(FLAG_P.x+1.8,FLAG_P.y+4.4,FLAG_P.z)]},
 {t0:19.2,t1:24.2,p:[L(44,-52,58),L(34,-44,48)], l:[L(0,3,0),L(0,3,0)], f:55},
 {t0:24.2,t1:28.8,p:[L(22,-26,22),L(17,-22,19)], l:[L(0,7,5),L(0,7,5)], f:55},
 {t0:28.8,t1:32.8,p:[L(30,-22,24),L(26,-19,21)], l:[L(11,0,3),L(11,0,3)], f:55},
 {t0:32.8,t1:37.2,p:[L(12,-28,26),L(8,-25,23)], l:[L(-5,2,8),L(-5,2,8)], f:55},
 {t0:37.2,t1:41.2,p:[L(-22,-2,22),L(-19,0,19)], l:[L(-5,16,1),L(-5,16,1)], f:55},
 {t0:41.2,t1:46.2,p:[L(14,-64,36),L(8,-60,33)], l:[L(1,-14,6),L(1,-14,6)], f:55},
 {t0:46.2,t1:50.8,p:[L(26,-40,36),L(36,-62,62)], l:[L(0,3,0),L(0,3,0)]},
 {t0:50.8,t1:58,  p:[L(-28,-48,44),L(-36,-56,52)], l:[L(0,4,0),L(0,4,0)]},
];
const DUR=58;
const caps=[
 ['c1',0.2,4.6,TXT.s1],
 ['c1',4.8,9.2,TXT.s2a],['c2',6.6,9.2,TXT.s2b],
 ['c1',9.4,14.2,TXT.s3a],['c2',9.6,11.6,TXT.s3b],
 ['c1',14.4,19.2,TXT.s4a],['c2',15.6,19.2,TXT.s4b],
 ['c1',19.4,24.2,TXT.s5],
 ['c1',24.4,28.8,TXT.s6],
 ['c1',29.0,32.8,TXT.s7],
 ['c1',33.0,37.2,TXT.s8],
 ['c1',37.4,41.2,TXT.s9],
 ['c1',41.4,46.2,TXT.s10],
 ['c2',46.4,50.8,TXT.s11],
 ['c1',51.0,DUR,TXT.s12],['c2',55.2,DUR,TXT.s12b],
];
// name tags pinned to buildings: [text, sub, worldPos, t0, t1]
const TAGS=[
 ['🏛️ PARLIAMENT','idea: @vachechu',()=>L(0,9,11.5),25.2,28.8],
 ['🏠 HOUSE #1','@giorgito4',()=>L(9,-3,6.2),29.4,32.8],
 ['🏠 HOUSE #2','@tuguldurtuguldur446',()=>L(13,2,6.2),30.0,32.8],
 ['🏅 HALL OF HONOUR','@halloweentime577',()=>L(-11,4,9),33.4,37.2],
 ['🗿 STATUE','@hyperstat',()=>L(0,0,5.4),34.4,37.2],
 ['🐷 PORK FARM','@imuiuiaskmeanything',()=>L(-5,17,4.5),38.0,41.2],
 ['🛡️ DEFENCE COMMANDER','@dusan_rajic',()=>L(-16,-6,10.4),42.0,46.2],
 ['⚓ NAVY','idea: @radamel.falcao98',()=>v3(ship.position.x,SEA+8,ship.position.z),42.6,46.2],
];
$('tags').innerHTML=TAGS.map(t=>`<div class="ntag"><div class="tt">${t[0]}</div><div class="ts">${t[1]}</div></div>`).join('');
window.CAPTION_TIMES=[...new Set(caps.map(c=>c[1]))].concat(TAGS.map(t=>t[3]),[5.6,6.0,10.0,12.2,52.6,53.2]);
window.CUTS=SH.map(s=>s.t0);
window.POPS=[...new Set(city.map(g=>Math.round(g.userData.t*10)/10))].filter(t=>t>24);
window.CAPTION_TIMES=window.CAPTION_TIMES.concat(window.POPS);
function popAt(el,t,a,b,{inDur=.28,outDur=.15}={}){
 if(t<a||t>b){el.style.opacity=0;return 0;}
 const k=clamp((t-a)/inDur), ko=clamp((b-t)/outDur);const s= k<1 ? (k<.6? .55+.6*(k/.6) : 1.15-.15*((k-.6)/.4)) : 1;
 el.style.opacity=Math.min(k*2,ko,1); el.style.transform=(el.dataset.base||'')+` scale(${s})`; return 1;}
const proj=(v)=>{const p=v.clone().project(camera);return [(p.x+1)/2*1080,(1-p.y)/2*1920,p.z];};

window.setTime=function(t){
 const sh=SH.find(s=>t>=s.t0&&t<s.t1)||SH[SH.length-1];
 const k=ease(clamp((t-sh.t0)/(sh.t1-sh.t0)));
 camera.position.lerpVectors(sh.p[0],sh.p[1],k); camera.lookAt(new THREE.Vector3().lerpVectors(sh.l[0],sh.l[1],k));
 camera.fov=sh.f||42; camera.updateProjectionMatrix();
 clouds.forEach((c,i)=>{c.userData.bx??=c.position.x;c.position.x=c.userData.bx+t*1.2*(i%2?1:-1);});
 clouds[4].position.set(-30+clamp((t-46.2)/4.6)*60,95,120);
 smoke.forEach((b,i)=>{const ph=((t*.12+i/smoke.length)%1);b.position.set(V.x+ph*14+Math.sin(i*3)*2,H(V.x,V.y)+4+ph*30,V.y-ph*6);b.scale.setScalar(.6+ph*2.2);b.material.opacity=.8*(1-ph);});
 lava.material.color.setHSL(.06,1,.5+.06*Math.sin(t*4));
 ghosts.forEach(g=>g.visible=false); pawns.forEach(p=>p.visible=false);
 // flag: raised during its shot, stays up afterwards
 flagGrp.visible = t>=14.2&&t<19.2;
 if(flagGrp.visible){const a=flagG.attributes.position.array;for(let i=0;i<a.length;i+=3){const x=flagBase[i];a[i+2]=Math.sin(x*1.6-t*5)*.22*(x/3.6);a[i+1]=flagBase[i+1]-x*.03;}flagG.attributes.position.needsUpdate=true;flagG.computeVertexNormals();
  const r=ease(clamp((t-14.5)/2.2)); flag.position.y=FLAG_P.y+1.6+r*4.0;}
 // city reveals
 for(const g of city){const kk=clamp((t-g.userData.t)/.45);g.visible=kk>0;if(kk>0){const s=Math.max(.001,backOut(kk));g.scale.setScalar((g.userData.s0??=g.scale.x)*s);}}
 if(ship.visible){ship.position.y=ship.userData.base.y+Math.sin(t*1.6)*.15;ship.rotation.z=Math.sin(t*1.3)*.04;}
 pigs.forEach(p=>{const i=p.userData.i;const a=t*.5+i*1.7;p.position.set(Math.sin(a*1.3+i)*3,Math.abs(Math.sin(t*6+i))*.08,Math.cos(a+i*2)*2.2);p.rotation.y=-a*1.3+i;});

 renderer.render(scene,camera);

 // ---------- UI ----------
 const used={c1:false,c2:false};
 for(const [id,a,b,txt] of caps){ if(t>=a&&t<=b){const el=$(id); if(el.dataset.txt!==txt){el.innerHTML=txt;el.dataset.txt=txt;} popAt(el,t,a,b); used[id]=true; } }
 for(const id in used) if(!used[id]) $(id).style.opacity=0;
 // HUD
 const pop=Math.round(72*ease(clamp((t-.6)/2.6))); $('popn').textContent=pop;
 const named=t>=11.8; $('t_nation').textContent= named?TXT.nation2:TXT.nation; $('flagicon').style.display=named?'none':'block'; $('flagtri').style.display=named?'block':'none';
 $('pill').style.transform=`translateX(-50%) scale(${named&&t<12.4?1+.25*Math.sin((t-11.8)/.6*Math.PI):1})`;
 // vote bars
 popAt($('votes'),t,5.2,9.2); const vk=ease(clamp((t-5.6)/1.0));
 $('barA').style.width=(8/9*100*vk)+'%'; $('barB').style.width=(1/9*100*vk)+'%'; $('nA').textContent=Math.round(8*vk); $('nB').textContent=Math.round(1*vk);
 // name reveal
 popAt($('namecard'),t,11.8,14.2,{inDur:.4});
 // pins A/B over the island in the vote shot
 for(const [el,s] of [[$('pinA'),SITE_A],[$('pinB'),SITE_B]]){ if(t<4.8||t>=9.2){el.style.opacity=0;continue;} const pp=proj(v3(s.x,Math.max(H(s.x,s.y),SEA)+3,s.y));
   el.style.left=pp[0]+'px';el.style.top=pp[1]+'px';el.style.opacity=1;el.style.transformOrigin='50% 100%';
   el.style.transform=`scale(${el.id==='pinA'?(t>6.6?1.1+.08*Math.sin(t*8):.9):(t>6.6?.6:.9)})`; el.style.filter=(el.id==='pinB'&&t>6.6)?'grayscale(1)':'none';}
 // name tags
 [...$('tags').children].forEach((el,i)=>{const [_,__,pf,a,b]=TAGS[i];const pp=proj(pf());el.dataset.base=`translate(-50%,-100%)`;const hw=el.offsetWidth/2+24;el.style.left=Math.min(1080-hw,Math.max(hw,pp[0]))+'px';el.style.top=pp[1]+'px';popAt(el,t,a,b);if(pp[2]>1)el.style.opacity=0;});
 // law cards
 [...$('laws').children].forEach((c,i)=>popAt(c,t,52.6+i*.6,DUR));
 let fl=0; for(const c of window.CUTS){ if(c>0&&t>=c&&t<c+.12) fl=.5*(1-(t-c)/.12);} $('flash').style.opacity=fl;
};
window.DUR=DUR; window.__T2={camera,renderer,scene,L};
document.fonts.ready.then(()=>{window.setTime(0);window.READY=true;});
