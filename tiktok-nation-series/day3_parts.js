// ===== TIMELINE =====
const ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const v3=(x,y,z)=>new THREE.Vector3(x,y,z);
const backOut=k=>{const c=1.9;return 1+(c+1)*Math.pow(k-1,3)+c*Math.pow(k-1,2);};
const MID=new THREE.Vector2((V.x+CITY.x)/2,(V.y+CITY.y)/2);
const SH=[
 {t0:0,   t1:4.2, p:[v3(70,215,230),v3(52,200,214)], l:[v3(0,0,4),v3(-2,0,6)]},
 {t0:4.2, t1:10.4,p:[v3(40,300,300),v3(30,275,280)], l:[v3(-6,0,14),v3(-6,0,12)], f:46},
 {t0:10.4,t1:15.6,p:[L(PZ[0]+14,PZ[1]-20,16),L(PZ[0]+11,PZ[1]-17,14)], l:[L(PZ[0],PZ[1],2),L(PZ[0],PZ[1],2)], f:55},
 {t0:15.6,t1:19.6,p:[v3(150,150,260),v3(135,160,250)], l:[v3(10,50,20),v3(10,50,14)], f:46},
 {t0:19.6,t1:25.4,p:[v3(95,85,105),v3(82,78,95)], l:[v3(-18,58,-18),v3(-19,60,-20)], f:46, shake:1},
 {t0:25.4,t1:30.4,p:[v3(MID.x+70,215,MID.y+95),v3(MID.x+60,200,MID.y+85)], l:[v3(MID.x,0,MID.y),v3(MID.x,0,MID.y-4)], f:46, shake:.4},
 {t0:30.4,t1:38.4,p:[v3(70,240,360),v3(62,225,340)], l:[v3(45,0,75),v3(48,0,78)], f:46},
 {t0:38.4,t1:47.2,p:[v3(SITE_B.x+34,62,SITE_B.y+44),v3(SITE_B.x+26,52,SITE_B.y+36)], l:[v3(SITE_B.x+4,20,SITE_B.y),v3(SITE_B.x+4,20,SITE_B.y)], f:50},
 {t0:47.2,t1:53.2,p:[L(36,-56,52),L(28,-48,44)], l:[L(0,4,12),L(0,4,12)], f:50},
 {t0:53.2,t1:62,  p:[L(-30,-50,46),L(-38,-58,54)], l:[L(0,6,10),L(0,6,10)], f:50},
];
const DUR=62;
const caps=[
 ['c1',0.2,4.2,TXT.s1],
 ['c1',4.4,10.4,TXT.s2a],['c2',7.0,10.4,TXT.s2b],
 ['c1',10.6,15.6,TXT.s3],
 ['c1',15.8,19.6,TXT.s4],
 ['c1',19.8,25.4,TXT.s5a],
 ['c1',25.6,30.4,TXT.s5b],
 ['c1',30.6,38.4,TXT.s6],
 ['c1',38.6,47.2,TXT.s7a],['c2',41.6,47.2,TXT.s7b],
 ['c1',47.4,53.2,TXT.s8],['c2',50.0,53.2,TXT.s8b],
 ['c1',53.4,DUR,TXT.s9],['c2',57.4,DUR,TXT.s9b],
];
const TAGS=[
 [TXT.tags[0][0],TXT.tags[0][1],()=>L(PZ[0],PZ[1],5.4),11.2,15.6],
 [TXT.tags[1][0],TXT.tags[1][1],()=>L(PZ[0]-3.5,PZ[1]-3,2.4),12.0,15.6],
 [TXT.tags[2][0],TXT.tags[2][1],()=>v3(isleT.position.x,isleT.position.y+isleT.userData.top+12,isleT.position.z),33.4,38.4],
 [TXT.tags[3][0],TXT.tags[3][1],()=>v3(isleC.position.x,isleC.position.y+isleC.userData.top+7,isleC.position.z),34.6,38.4],
 [TXT.tags[4][0],TXT.tags[4][1],()=>v3(SITE_B.x,ruins.position.y+6.5,SITE_B.y),42.8,47.2],
 [TXT.tags[5][0],TXT.tags[5][1],()=>v3(SITE_B.x+13,ruins.position.y+8.6,SITE_B.y-4),43.6,47.2],
];
$('tags').innerHTML=TAGS.map(t=>`<div class="ntag"><div class="tt">${t[0]}</div><div class="ts">${t[1]}</div></div>`).join('');
$('bubbles').innerHTML=TXT.bubbles.map(b=>`<div class="bub"><div class="bq">${b[0]}</div><div class="bu">${b[1]}</div></div>`).join('');
$('goals').innerHTML=TXT.goals.map(g=>`<div class="goal"><div class="ge">${g[0]}</div><div class="gb"><div class="gt">${g[1]}</div><div class="gs">${g[2]}</div><div class="bar"><i style="background:${g[5]}"></i></div></div><div class="gn">${g[3]}</div></div>`).join('');
window.CAPTION_TIMES=[...new Set(caps.map(c=>c[1]))].concat(TAGS.map(t=>t[3]),[10.6,11.0,16.4,17.0,17.6,48.0,48.8,49.6,50.4,54.6,55.2]);
window.CUTS=SH.map(s=>s.t0);
window.BOOMS=[19.9,20.6,21.6,31.0,39.2];   // low rumbles for audio.py
function popAt(el,t,a,b,{inDur=.28,outDur=.15}={}){
 if(t<a||t>b){el.style.opacity=0;return 0;}
 const k=clamp((t-a)/inDur), ko=clamp((b-t)/outDur);const s= k<1 ? (k<.6? .55+.6*(k/.6) : 1.15-.15*((k-.6)/.4)) : 1;
 el.style.opacity=Math.min(k*2,ko,1); el.style.transform=(el.dataset.base||'')+` scale(${s})`; return 1;}
const proj=(v)=>{const p=v.clone().project(camera);return [(p.x+1)/2*1080,(1-p.y)/2*1920,p.z];};

window.setTime=function(t){
 const sh=SH.find(s=>t>=s.t0&&t<s.t1)||SH[SH.length-1];
 const k=ease(clamp((t-sh.t0)/(sh.t1-sh.t0)));
 camera.position.lerpVectors(sh.p[0],sh.p[1],k);
 if(sh.shake){const a=sh.shake*Math.max(0,1-(t-sh.t0)/6);camera.position.x+=Math.sin(t*47)*a;camera.position.y+=Math.sin(t*53+1)*a;}
 camera.lookAt(new THREE.Vector3().lerpVectors(sh.l[0],sh.l[1],k)); camera.fov=sh.f||42; camera.updateProjectionMatrix();
 clouds.forEach((c,i)=>{c.userData.bx??=c.position.x;c.position.x=c.userData.bx+t*1.2*(i%2?1:-1);c.visible=!(t>=19.6&&t<30.4)&&!(t>=38.4&&t<47.2);});
 const erupt=t>=19.6, eK=clamp((t-19.6)/2);
 smoke.forEach((b,i)=>{const ph=((t*(erupt?.22:.12)+i/smoke.length)%1);b.position.set(V.x+ph*14+Math.sin(i*3)*2,H(V.x,V.y)+4+ph*(erupt?55:30),V.y-ph*6);b.scale.setScalar((.6+ph*2.2)*(erupt?2:1));b.material.opacity=.8*(1-ph);b.material.color.set(erupt?'#555050':'#9a9a9a');});
 lava.material.color.setHSL(.06,1,.5+.06*Math.sin(t*4)); lava.scale.setScalar(erupt?1.4+.15*Math.sin(t*10):1);
 lavaLight.intensity=erupt?2.5*eK:0;
 ash.forEach((b,i)=>{const ph=((t*.15+i/ash.length)%1);b.visible=erupt;b.position.set(V.x+Math.sin(i*2.3)*8*ph+ph*20,H(V.x,V.y)+10+ph*70,V.y+Math.cos(i*1.7)*8*ph);b.scale.setScalar(1+ph*2.5);b.material.opacity=.85*(1-ph);});
 bombs.forEach((b,i)=>{const d=((t-19.8-i*.09)%2.6+2.6)%2.6; b.visible=t>=19.8+i*.09&&t<30.4; if(b.visible){const a=i*2.4,sp=5+(i%5)*2.4;b.position.set(CRATER.x+Math.cos(a)*sp*d,CRATER.y+26*d-9.8*d*d*1.1,CRATER.z+Math.sin(a)*sp*d);}});
 flows.forEach((f,i)=>{const fk=clamp((t-20.4-i*.5)/7);f.visible=fk>0;f.geometry.setDrawRange(0,Math.floor(f.userData.n*fk/3)*3);});
 for(const g of city){ if(g.userData.gone){g.visible=false;continue;} if(g.userData.t<0){g.visible=true;g.scale.setScalar(g.userData.s0??=g.scale.x);continue;}
   const kk=clamp((t-g.userData.t)/.45);g.visible=kk>0;if(kk>0)g.scale.setScalar((g.userData.s0??=g.scale.x)*Math.max(.001,backOut(kk)));}
 if(pizzeria.visible) pizzeria.userData.sign.rotation.y=t*1.5;
 ship.position.y=ship.userData.base.y+Math.sin(t*1.6)*.15;
 pigs.forEach(p=>{const i=p.userData.i;const a=t*.5+i*1.7;p.position.set(Math.sin(a*1.3+i)*3,Math.abs(Math.sin(t*6+i))*.08,Math.cos(a+i*2)*2.2);p.rotation.y=-a*1.3+i;});
 ghosts.forEach(g=>g.visible=false); pawns.forEach(p=>p.visible=false); flagGrp.visible=false;
 const landed=crowdAt(t);
 // islands rise
 for(const [g,t0] of [[isleT,31.0],[isleC,32.2]]){const r=clamp((t-t0)/2.6);g.visible=r>0;g.position.y=SEA-.6-12*(1-ease(r));}
 // ruins rise with dust
 { const r=clamp((t-39.2)/3.2); ruins.visible=r>0; ruins.position.y=ruins.userData.y-9*(1-ease(r));
   dust.forEach((b,i)=>{const d=t-39.2-i*.12;b.visible=d>0&&d<4.5;if(b.visible){const a=i*2.1;b.position.set(SITE_B.x+Math.cos(a)*(6+d*3),ruins.userData.y+1+d*2.2,SITE_B.y+Math.sin(a)*(6+d*3));b.scale.setScalar(1+d*.8);b.material.opacity=.8*(1-d/4.5);}}); }

 renderer.render(scene,camera);

 // ---------- UI ----------
 const used={c1:false,c2:false};
 for(const [id,a,b,txt] of caps){ if(t>=a&&t<=b){const el=$(id); if(el.dataset.txt!==txt){el.innerHTML=txt;el.dataset.txt=txt;} popAt(el,t,a,b); used[id]=true; } }
 for(const id in used) if(!used[id]) $(id).style.opacity=0;
 $('popn').textContent=Math.max(80,landed).toLocaleString('en-US');
 // vote bars
 popAt($('votes'),t,10.8,15.6); const vk=ease(clamp((t-11.0)/1.0));
 $('barA').style.width=(STATS.votesA/(STATS.votesA+STATS.votesB)*100*vk)+'%'; $('barB').style.width=(STATS.votesB/(STATS.votesA+STATS.votesB)*100*vk)+'%';
 $('nA').textContent=Math.round(STATS.votesA*vk); $('nB').textContent=Math.round(STATS.votesB*vk);
 // unlocked goals
 [...$('goals').children].forEach((el,i)=>{popAt(el,t,16.4+i*.6,19.6);el.querySelector('i').style.width=(100*ease(clamp((t-16.6-i*.6)/.8)))+'%';});
 // name tags
 [...$('tags').children].forEach((el,i)=>{const [_,__,pf,a,b]=TAGS[i];const pp=proj(pf());el.dataset.base='translate(-50%,-100%)';const hw=el.offsetWidth/2+24;el.style.left=Math.min(1080-hw,Math.max(hw,pp[0]))+'px';el.style.top=pp[1]+'px';popAt(el,t,a,b);if(pp[2]>1)el.style.opacity=0;});
 [...$('bubbles').children].forEach((el,i)=>popAt(el,t,48.0+i*.8,53.2));
 [...$('laws').children].forEach((c,i)=>popAt(c,t,54.6+i*.6,DUR));
 let fl=0; for(const c of window.CUTS){ if(c>0&&t>=c&&t<c+.12) fl=.5*(1-(t-c)/.12);} if(t>=19.6&&t<19.9) fl=Math.max(fl,.85*(1-(t-19.6)/.3)); $('flash').style.opacity=fl;
};
window.DUR=DUR; window.__T2={camera,renderer,scene,L};
document.fonts.ready.then(()=>{window.setTime(0);window.READY=true;});
