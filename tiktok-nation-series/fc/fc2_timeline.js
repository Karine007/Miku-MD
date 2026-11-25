// ---------- timeline: design time = the voice take's time (line starts from the transcript)
const TD=[0,6.57,12.89,15.99,17.69,20.35,25.11,28.59,31.65,37.49,42.73,45.87,55.44];
const TR=window.FC_TR||TD,DUR=TR[TR.length-1];
const pw=(x,A,B)=>{for(let i=0;i<A.length-1;i++)if(x<=A[i+1]||i==A.length-2)return B[i]+(B[i+1]-B[i])*clamp((x-A[i])/(A[i+1]-A[i]));};
const toD=tr=>pw(tr,TR,TD),toR=td=>pw(td,TD,TR);
const SEATW=i=>SEATS[i].getWorldPosition(v3(0,0,0));
const T_FIX=13.5,T_NET=16.3,T_ROOF=18.2,T_MILAN=21.0,T_PIG=22.9,T_AETH=25.5,T_CHEF=26.4,T_TACO=28.8,T_OG=32.6,T_PUNZ=38.0,T_ARDA=40.0,T_NS=43.0;
const SH=[
 {t0:0,t1:6.57,p:[v3(110,120,-170),v3(60,46,-92)],l:[v3(0,0,10),v3(0,2,8)]},
 {t0:6.57,t1:12.89,p:[v3(-6,10,-44),v3(6,16,-54)],l:[v3(0,7,0),v3(0,6,0)]},
 {t0:12.89,t1:15.99,p:[v3(0,62,-34),v3(0,56,-28)],l:[v3(0,0,0),v3(0,0,0)]},
 {t0:15.99,t1:17.69,p:[v3(-PL/2+18,7,-18),v3(-PL/2+15,6,-15)],l:[v3(-PL/2-1,3.6,0),v3(-PL/2-1,3.6,0)]},
 {t0:17.69,t1:20.35,clubhouse:true},
 {t0:20.35,t1:25.11,p:[v3(30,8,-24),v3(26,8.5,-21)],l:[v3(13,3.6,-2),v3(12,3.4,2)]},
 {t0:25.11,t1:28.59,p:[v3(-13,8,-27),v3(-8,8,-25)],l:[v3(3,3.6,-6),v3(5,3.4,-5)]},
 {t0:28.59,t1:31.65,p:[v3(17,10,11),v3(20,9,14)],l:[v3(30,5,31),v3(30,5,31)]},
 {t0:31.65,t1:37.49,stand:true},
 {t0:37.49,t1:42.73,stand2:true},
 {t0:42.73,t1:45.87,p:[v3(34,18,4),v3(26,22,8)],l:[v3(0,9,-40),v3(0,10,-40)]},
 {t0:45.87,t1:55.44,p:[v3(-92,42,6),v3(-112,56,10)],l:[v3(0,0,4),v3(0,0,4)]},
];
const CAPS=[['c1',.2,6.57,'Day 2:<br><b>Herberg FC</b> ⚽'],['c1',6.57,12.89,'<b>8 BILLION</b><br>dollars?! 💸'],['c2',8.3,12.89,'Yes. <b>Yes you can.</b>'],
 ['c1',12.89,15.99,'Pitch:<br><b>FIXED</b> ✅'],['c1',15.99,17.69,'<b>Real nets</b> 🥅'],['c1',17.69,20.35,'No more<br><b>leaks</b> 💧'],
 ['c1',20.35,25.11,'New <b>striker!</b> ⚽'],['c2',22.7,25.11,"Sorry pig... you're<br>the <b>mascot</b> now 🐷"],['c1',25.11,28.59,'New <b>defender!</b> 🛡️'],
 ['c1',28.59,31.65,'The <b>taco stand</b><br>is open! 🌮'],['c1',31.65,37.49,"The stand isn't<br><b>empty</b> anymore! 🏟️"],['c1',37.49,42.73,'<b>Seat Nº1</b><br>goes to...'],['c2',40.0,42.73,'<b>ARDA!</b> 🥇'],
 ['c1',42.73,45.87,'A <b>new stand</b><br>is going up 🏗️'],['c1',45.87,55.44,'Day 3:<br><b>first match!</b>']];
const TAGS=[
 ['<span class="no">#9</span>STRIKER','@MILAN',()=>milan.getWorldPosition(v3(0,7.6,0)),21.6,22.6],
 ['🐷 MASCOT','formerly #9',()=>striker.getWorldPosition(v3(0,4.6,0)),23.6,25.11],
 ['<span class="no">#5</span>DEFENDER','AetheriaNation',()=>aeth.getWorldPosition(v3(0,7.6,0)),26.0,28.59],
 ['🌮 TACO STAND','Online_Stranger',()=>stranger.getWorldPosition(v3(0,5.6,0)),29.4,31.65],
 ['🎟️ OG SEATS','batangmakulit · RDA · @MILAN',()=>SEATW(5).add(v3(0,4.2,0)),33.6,37.49],
 ['💺 TOOK A SEAT','PunzistTV',()=>SEATW(9).add(v3(0,3.6,0)),38.2,39.9],
 ['🥇 SEAT Nº1','ARDA · first comment + like',()=>SEATW(6).add(v3(0,3.6,0)),40.4,42.73],
 ['🏗️ NEW STAND','paid by neck hurts',()=>NS.localToWorld(v3(0,16,0)),43.6,45.87],
];
$('tags').innerHTML=TAGS.map(t=>`<div class="ntag"><div class="tt">${t[0]}</div><div class="ts">${t[1]}</div></div>`).join('');
const HEARTS=[...Array(10)].map(()=>{const d=document.createElement('div');d.className='heart';d.textContent='❤️';$('hearts').appendChild(d);return d;});
window.CAPTION_TIMES=[...new Set(CAPS.map(c=>c[1]))].concat(TAGS.map(t=>t[3]),[1.6,7.4,9.8,T_FIX,T_NET,T_ROOF,T_MILAN,T_AETH,T_TACO,T_OG,T_PUNZ,T_ARDA,46.4,47.1,47.8,50.6,51.6]).map(toR);
window.CUTS=SH.map(s=>s.t0).map(toR);window.BOOMS=[toR(9.9)];
function popAt(el,t,a,b,{inDur=.28,outDur=.15}={}){if(t<a||t>b){el.style.opacity=0;return 0;}const k=clamp((t-a)/inDur),ko=clamp((b-t)/outDur);const s=k<1?(k<.6?.55+.6*(k/.6):1.15-.15*((k-.6)/.4)):1;
 el.style.opacity=Math.min(k*2,ko,1);el.style.transform=(el.dataset.base||'')+` scale(${s})`;return 1;}
const proj=v=>{const p=v.clone().project(camera);return [(p.x+1)/2*1080,(1-p.y)/2*1920,p.z];};
const walk=(p,t,sp=8,amp=.5)=>{const {legs,arms}=p.userData;legs[0].rotation.z=Math.sin(t*sp)*amp;legs[1].rotation.z=-Math.sin(t*sp)*amp;arms[0].rotation.z=-Math.sin(t*sp)*amp;arms[1].rotation.z=Math.sin(t*sp)*amp;};
const popS=(o,t,t0,s=1)=>{const kk=clamp((t-t0)/.5);o.visible=kk>0;if(kk>0)o.scale.setScalar(s*Math.max(.001,backOut(kk)));return kk;};
const lerpP=(a,b,k)=>v3(a[0]+(b[0]-a[0])*k,0,a[1]+(b[1]-a[1])*k);

window.setTime=function(tr){const t=toD(tr);const sh=SH.find(s=>t>=s.t0&&t<s.t1)||SH[SH.length-1];const k=ease(clamp((t-sh.t0)/(sh.t1-sh.t0)));
 // life
 LAMPS[1].material.emissiveIntensity=t<T_FIX?((Math.sin(t*23)>.3&&Math.sin(t*7.1)>-.2)?1.4:0):1.2;
 GULLS.forEach((g,i)=>{const a=t*.35+i*1.3;g.position.set(Math.cos(a)*(50+i*8),34+i*3+Math.sin(t+i)*2,Math.sin(a)*(36+i*5));g.rotation.y=-a;});
 seagull.position.y=2.3+Math.abs(Math.sin(t*3))*.12;seagull.rotation.y=-Math.PI/2+Math.sin(t*.7)*.5;
 {mower.position.set(-20+((t*3.4)%44),0,-14);king.userData.arms.forEach(a=>a.rotation.z=-1.1);king.userData.head.rotation.y=Math.sin(t*1.5)*.3;}
 kingStand.visible=true;kingStand.userData.arms[1].rotation.x=0;kingStand.userData.arms[1].rotation.z=0;trophy.visible=false;SPARK.forEach(s=>s.visible=false);
 // money rain → the fund explodes
 BILLS.forEach(b=>{const {x,z,d,r}=b.userData;const tt=t-7.0-d;b.visible=tt>0&&t<15.99;if(!b.visible)return;const y=Math.max(.25+(r%5)*.09,26-tt*9);b.position.set(x+Math.sin(tt*2+r)*1.5,y,z+Math.cos(tt*1.7+r));b.rotation.set(y>.5?tt*3+r:0,r,y>.5?tt*2:0);});
 // the pitch gets fixed: holes, dirt and puddles disappear
 {const kk=clamp((t-T_FIX)/1.1);const s=Math.max(.001,1-ease(kk));HOLEM.forEach(m=>{m.scale.setScalar(s);m.visible=kk<1;});DIRTM.forEach(m=>{m.scale.setScalar(s);m.visible=kk<1;});PUD.forEach((p,i)=>{p.scale.setScalar(s*(1+Math.sin(t*2+i)*.03));p.visible=kk<1;});
  SPARK2.forEach((sp,i)=>{const on=t>T_FIX&&t<T_FIX+1.6;sp.visible=on;if(on){const h=[...HOLES,...DIRT][i%13];const ph=clamp((t-T_FIX)/1.6);sp.position.set(h[0]+Math.cos(i)*2*ph,1+ph*6,h[1]+Math.sin(i)*2*ph);sp.scale.setScalar(1.2*(1-ph)+.2);sp.rotation.set(t*3,t*2,0);}});}
 // nets + the leaning goal stands up straight
 {const kk=clamp((t-T_NET)/.45);NETL.visible=NETR.visible=kk>0;NETL.scale.setScalar(Math.max(.001,backOut(kk)));NETR.scale.setScalar(Math.max(.001,backOut(kk)));goalL.rotation.x=.12*(1-ease(clamp((t-T_NET+.3)/.5)));NONET.forEach(o=>o.visible=t<T_NET);}
 // the roof patch drops in; the drips stop
 {const kk=clamp((t-T_ROOF)/.5);patch.visible=kk>0;patch.position.y=9.5+(1-ease(kk))*8;DRIPS.forEach((d,i)=>{const ph=((t*.9+i/4)%1);d.position.set(1.2,8-ph*7,6);d.visible=t<T_ROOF+.4&&ph<.95;});bucket.visible=t<T_ROOF+.6;}
 // squad: Milan signs, the pig walks off with its MASCOT sash, Aetheria in, the chef walks to the taco stand
 LINE.forEach((p,i)=>{if(p.userData.legs){p.userData.head.rotation.y=Math.sin(t*1.1+i)*.25;p.userData.arms.forEach(a=>{a.rotation.z=0;a.rotation.x=0;});p.userData.legs.forEach(l=>l.rotation.z=0);}});
 popS(milan,t,T_MILAN);if(milan.visible){milan.userData.arms.forEach((a,j)=>a.rotation.x=(t>T_MILAN+.4&&t<T_MILAN+2)?(j?-2.8:2.8):0);milan.userData.head.rotation.y=Math.sin(t*1.3)*.3;}
 {const kk=clamp((t-T_PIG)/2.0);const P=lerpP([15,-6],[10,20],kk);striker.position.set(P.x,(kk>0&&kk<1)?Math.abs(Math.sin(t*9))*.4:(t>T_PIG+2?Math.abs(Math.sin(t*5))*.6:0),P.z);
  striker.rotation.y=kk>0&&kk<1?-Math.atan2(26,-5):(t>T_PIG+2?Math.PI/2:0);striker.userData.tl.rotation.z=Math.sin(t*12)*.4;sash.visible=sash2.visible=t>=T_PIG-.6;}
 popS(aeth,t,T_AETH);if(aeth.visible){aeth.userData.arms.forEach((a,j)=>a.rotation.x=(t>T_AETH+.4&&t<T_AETH+1.6)?(j?-1.2:1.2):0);}
 {if(t<T_CHEF){chef.position.set(3,0,t>=T_AETH-.2?-1.5:-6);chef.rotation.y=Math.PI/2;}
  else if(t<T_TACO){const kk=clamp((t-T_CHEF)/(T_TACO-T_CHEF));const P=lerpP([3,-1.5],[26,26],kk);chef.position.set(P.x,0,P.z);chef.rotation.y=-Math.atan2(32,23);walk(chef,t,9,.6);}
  else {chef.position.set(31.6,0,32.4);chef.rotation.y=Math.PI/2;chef.userData.arms[1].rotation.x=-1+Math.sin(t*6)*.5;}}
 {const kk=popS(TACO,t,T_TACO);bigTaco.rotation.y=t*1.2;stranger.userData.arms[0].rotation.x=Math.sin(t*4)*.6;stranger.userData.head.rotation.y=Math.sin(t*1.4)*.4;}
 // the ball at Milan's feet
 if(milan.visible){const ph=t*2.2;ball.position.set(15+Math.sin(ph)*1.6,.55+Math.abs(Math.sin(ph*2))*1.4,-3.6);}else ball.position.set(-3,.55,-12);
 keeper.position.x=-9;
 // the stand fills up
 OGS.forEach(({i,p},n)=>{const t0=T_OG+n*.5;popS(p,t,t0);const on=t>=t0;SEATS[i].children[0].material=SEATS[i].children[1].material=on?M.gold:M.seat;popS(FANS[i],t,t0+.15,.38);});
 popS(punzPlate,t,T_PUNZ);popS(FANS[9],t,T_PUNZ+.15,.38);
 {const on=t>=T_ARDA;popS(ardaPlate,t,T_ARDA);popS(FANS[6],t,T_ARDA+.15,.38);SEATS[6].children[0].material=SEATS[6].children[1].material=on?M.gold:M.seat;}
 Object.values(FANS).forEach((f,i)=>{if(!f.visible)return;const ch=Math.sin(t*5+i*1.7)>.2;f.userData.arms.forEach((a,j)=>{a.rotation.x=ch?(j?-2.7:2.7):0;});f.position.y=SEATS[[4,5,7,9,6][i]].position.y-.72+(ch?.08:0);});
 fanSign.material.map=fanTex(t);
 // the new stand goes up
 {NS.visible=t>=T_NS-1.5;TIERS.forEach((tr2,i)=>{const kk=clamp((t-T_NS-i*.28)/.5);tr2.visible=kk>0;tr2.scale.y=Math.max(.001,backOut(kk));});jib.rotation.y=Math.sin(t*.6)*.8;load.position.y=-8.6+Math.sin(t*1.2)*1.5;hook.position.y=-4+Math.sin(t*1.2)*.75;
  WORK.forEach((w,i)=>{w.userData.arms[0].rotation.x=Math.sin(t*6+i)*.8;w.position.x=-14+i*9+Math.sin(t*.8+i)*1.2;});}
 // camera
 if(sh.clubhouse){const c=CH.localToWorld(v3(-6+4*k,17,27));camera.position.copy(c);camera.lookAt(CH.localToWorld(v3(1,7.5,0)));}
 else if(sh.stand){const s=SEATW(5);camera.position.set(s.x+9-5*k,s.y+5,s.z-13+3*k);camera.lookAt(s.x+.6,s.y+1,s.z);}
 else if(sh.stand2){const a=SEATW(9),b=SEATW(6);const kk=ease(clamp((t-39.3)/.9));const s=a.clone().lerp(b,kk);camera.position.set(s.x+4,s.y+4.4,s.z-10);camera.lookAt(s.x,s.y+1,s.z);}
 else {camera.position.lerpVectors(sh.p[0],sh.p[1],k);camera.lookAt(new THREE.Vector3().lerpVectors(sh.l[0],sh.l[1],k));}
 camera.fov=50;camera.updateProjectionMatrix();renderer.render(scene,camera);
 // UI
 const used={c1:false,c2:false};for(const [id,a,b,txt] of CAPS){if(t>=a&&t<=b){const el=$(id);if(el.dataset.txt!==txt){el.innerHTML=txt;el.dataset.txt=txt;}popAt(el,t,a,b);used[id]=true;}}for(const id in used)if(!used[id])$(id).style.opacity=0;
 popAt($('cmt'),t,1.6,6.4);popAt($('fund'),t,7.4,12.89);popAt($('likeb'),t,7.4,9.6);
 {let n=1000+Math.floor(clamp((t-7.6)/.9)*16);if(t>9.8)n=1016+Math.floor(Math.pow(clamp((t-9.8)/1.4),3)*8e9);$('fundv').textContent='🪙 '+n.toLocaleString('en-US');}
 HEARTS.forEach((h,i)=>{const ph=((t-7.6)*.9+i/10)%1;const on=t>7.6&&t<9.6;h.style.opacity=on?(1-ph):0;h.style.left=(200+((i*137)%680))+'px';h.style.top=(1500-ph*520)+'px';h.style.transform=`scale(${.7+ph*.5})`;});
 {const n=[T_OG,T_OG+.5,T_OG+1,T_PUNZ,T_ARDA].filter(x=>t>=x+.15).length;$('fans').textContent=n;}
 const ch=[...$('choices').children];$('choices').style.opacity=t>=46.2&&t<=DUR+1?1:0;ch.forEach((c,i)=>popAt(c,t,46.4+i*.7,60));
 popAt($('topc'),t,50.6,60);popAt($('dec'),t,51.6,60);
 [...$('tags').children].forEach((el,i)=>{const [_,__,pf,a,b]=TAGS[i];const pp=proj(pf());el.dataset.base='translate(-50%,-100%)';const hw=el.offsetWidth/2+24;el.style.left=Math.min(1080-hw,Math.max(hw,pp[0]))+'px';el.style.top=Math.max(560+el.offsetHeight+18,pp[1])+'px';popAt(el,t,a,b);if(pp[2]>1)el.style.opacity=0;});
 let fl=0;for(const c of window.CUTS){if(c>0&&tr>=c&&tr<c+.12)fl=.5*(1-(tr-c)/.12);}$('flash').style.opacity=fl;
};
const FANTEX={};function fanTex(t){const n=[T_OG,T_OG+.5,T_OG+1,T_PUNZ,T_ARDA].filter(x=>t>=x+.15).length;if(!FANTEX[n])FANTEX[n]=textTex(n+(n==1?' FAN':' FANS'),'#ffffff',n?'#1f8a4c':'#d63a3a',1024,Math.round(1024*2.2/7),Math.round(1024*2.2/7*.55));return FANTEX[n];}
window.DUR=DUR;window.__T2={camera,renderer,scene,L:(u,v,h=0)=>v3(u,h,v)};
document.fonts.ready.then(()=>{window.setTime(0);window.READY=true;});
