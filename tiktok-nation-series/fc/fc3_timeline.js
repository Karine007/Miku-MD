// ---------- timeline: design time = the voice take's time (line starts from the transcript)
const TD=[0,9.6,13.9,17.52,19.72,26.46,31.06,35.92,43.34,48.64,53.86,57.3,61.8,67.3];
const TR=window.FC_TR||TD,DUR=TR[TR.length-1];
const pw=(x,A,B)=>{for(let i=0;i<A.length-1;i++)if(x<=A[i+1]||i==A.length-2)return B[i]+(B[i+1]-B[i])*clamp((x-A[i])/(A[i+1]-A[i]));};
const toD=tr=>pw(tr,TR,TD),toR=td=>pw(td,TD,TR);
const SEATW=i=>SEATS[i].getWorldPosition(v3(0,0,0));
const T_RAIN=4.4,T_STAMP=11.1,T_GREY=11.74,T_NET=14.3,T_HOLE=15.3,T_ROOF=16.3,T_NS=17.9,T_CARS=32.6,T_OUT=34.3,T_KO=48.64,G1=52.3,G2=55.7,G3=59.5,T_END=60.2;
const T_DEV=35.92,T_SHA=37.56,T_AQQ=38.94,T_EQU=40.3,T_IDC=41.54,T_REF=43.34,T_SEAT=[45.38,45.98,46.4];
const SH=[
 {t0:0,t1:4.2,p:[v3(110,120,-170),v3(60,46,-92)],l:[v3(0,0,10),v3(0,2,8)]},
 {t0:4.2,t1:9.6,p:[v3(-62,13,10),v3(-56,15,-4)],l:[v3(0,6,0),v3(0,7,0)]},
 {t0:9.6,t1:13.9,p:[v3(-50,11,-14),v3(-44,9,-20)],l:[v3(0,5,0),v3(0,4,0)]},
 {t0:13.9,t1:15.2,p:[v3(-PL/2+18,7,-18),v3(-PL/2+15,6,-15)],l:[v3(-PL/2-1,3.6,0),v3(-PL/2-1,3.6,0)]},
 {t0:15.2,t1:16.2,p:[v3(0,62,-34),v3(0,56,-28)],l:[v3(0,0,0),v3(0,0,0)]},
 {t0:16.2,t1:17.52,clubhouse:true},
 {t0:17.52,t1:19.72,p:[v3(34,18,4),v3(26,22,8)],l:[v3(0,9,-40),v3(0,8,-40)]},
 {t0:19.72,t1:26.46,p:[v3(-10,9,6),v3(8,8,10)],l:[v3(-2,4,PW/2+12),v3(2,4,PW/2+12)]},
 {t0:26.46,t1:31.06,p:[v3(-22,13,-26),v3(-10,10,-22)],l:[v3(-6,0,0),v3(-6,0,2)]},
 {t0:31.06,t1:35.92,p:[v3(36,11,-6),v3(24,12,-6)],l:[v3(30,2,-31),v3(6,2,-26)]},
 {t0:35.92,t1:37.5,p:[v3(-2,9,-30),v3(-4,9.5,-29)],l:[v3(-6,4.2,-12),v3(-6,4.4,-12)]},
 {t0:37.5,t1:38.9,p:[v3(-5,9,8),v3(-7,9.5,9)],l:[v3(-8,4.2,PW/2+2.6),v3(-8,4.2,PW/2+2.6)]},
 {t0:38.9,t1:41.5,p:[v3(2,9,-30),v3(5,9,-29)],l:[v3(0,4,-12),v3(6,4,-12)]},
 {t0:41.5,t1:43.34,p:[v3(25,6,12),v3(27,6.5,13)],l:[v3(30,2.5,PW/2+2.4),v3(30,2.5,PW/2+2.4)]},
 {t0:43.34,t1:45.3,p:[v3(15,9,-29),v3(13,9,-28)],l:[v3(12,4,-12),v3(12,4.2,-12)]},
 {t0:45.3,t1:48.64,stand:true},
 {t0:48.64,t1:53.86,match:1},
 {t0:53.86,t1:57.3,match:1},
 {t0:57.3,t1:61.8,match:1},
 {t0:61.8,t1:67.3,p:[v3(0,40,-70),v3(0,52,-92)],l:[v3(0,0,10),v3(0,0,12)]},
];
const CAPS=[['c1',.2,4.2,'Day 3:<br><b>Herberg FC</b> ⚽'],['c1',4.2,9.6,'The donations<br>got <b>crazy</b> 💸'],['c1',9.6,13.9,'Time to be<br><b>honest</b> 😬'],
 ['c1',13.9,15.2,'Nets:<br><b>gone</b> ❌'],['c1',15.2,16.2,'Holes:<br><b>back</b> 🕳️'],['c1',16.2,17.52,'Roof:<br><b>leaking</b> 💧'],['c1',17.52,19.72,'The new stand?<br><b>Gone.</b>'],
 ['c1',19.72,21.3,'No more<br><b>fake money</b> 🚫'],['c1',21.3,26.46,'The<br><b>new rule</b> 👇'],['c1',26.46,31.06,'The club<br><b>fund</b> 🪙'],['c2',30.2,31.06,"That's <b>it.</b>"],
 ['c1',31.06,35.92,'First match:<br><b>Kola Motors</b> 🚗'],['c1',35.92,43.34,'New <b>roles</b><br>from your comments'],['c1',43.34,45.3,'Our <b>referee</b> 🟨'],['c1',45.3,48.64,'<b>3 new</b><br>fans 🎟️'],
 ['c1',48.64,52.9,'<b>KICKOFF!</b> ⚽'],['c1',52.9,53.86,'<b>NO NET!</b> 😭'],['c1',53.86,55.6,'Equitor<br><b>crosses...</b>'],['c1',55.6,57.3,'<b>GOAL!</b><br>Milan! ⚽'],
 ['c1',57.3,59.4,'Last<br><b>minute...</b>'],['c1',59.4,61.8,'Lost because<br>of a <b>hole</b> 🕳️'],['c1',61.8,67.3,"Let's <b>rebuild</b><br>it together 💪"]];
const TAGS=[
 ['🚗 KOLA MOTORS','won the vote',()=>CARS[0].localToWorld(v3(0,6.4,0)),33.9,35.92],
 ['<span class="no">C</span>CAPTAIN','Девин 🦈',()=>devin.getWorldPosition(v3(0,7.6,0)),36.1,37.5],
 ['🧢 COACH','$hane',()=>shane.getWorldPosition(v3(0,7.6,0)),37.7,38.9],
 ['<span class="no">#8</span>MIDFIELD','Aqqaluk',()=>aqq.getWorldPosition(v3(0,7.6,0)),39.1,40.3],
 ['<span class="no">#11</span>RIGHT WING','equitor',()=>equi.getWorldPosition(v3(0,7.6,0)),40.45,41.5],
 ['⚽ BALL BOY','IDC',()=>idc.getWorldPosition(v3(0,5.6,0)),41.7,43.34],
 ['🟨 REFEREE','Online_Stranger',()=>ref.getWorldPosition(v3(0,7.6,0)),43.5,45.3],
 ['🎟️ NEW SEATS','Dreni · mort · AB_22',()=>SEATW(8).add(v3(0,3.8,0)),46.6,48.64],
];
$('tags').innerHTML=TAGS.map(t=>`<div class="ntag"><div class="tt">${t[0]}</div><div class="ts">${t[1]}</div></div>`).join('');
const HEARTS=[...Array(10)].map(()=>{const d=document.createElement('div');d.className='heart';d.textContent='❤️';$('hearts').appendChild(d);return d;});
window.CAPTION_TIMES=[...new Set(CAPS.map(c=>c[1]))].concat(TAGS.map(t=>t[3]),[4.3,6.86,21.4,22.5,23.94,25.28,27.6,T_CARS,T_SEAT[0],T_SEAT[1],T_SEAT[2],62.4]).map(toR);
window.CUTS=SH.map(s=>s.t0).map(toR);window.BOOMS=[T_STAMP,T_NS,G1,G2,G3].map(toR);
function popAt(el,t,a,b,{inDur=.28,outDur=.15}={}){if(t<a||t>b){el.style.opacity=0;return 0;}const k=clamp((t-a)/inDur),ko=clamp((b-t)/outDur);const s=k<1?(k<.6?.55+.6*(k/.6):1.15-.15*((k-.6)/.4)):1;
 el.style.opacity=Math.min(k*2,ko,1);el.style.transform=(el.dataset.base||'')+` scale(${s})`;return 1;}
const proj=v=>{const p=v.clone().project(camera);return [(p.x+1)/2*1080,(1-p.y)/2*1920,p.z];};
const walk=(p,t,sp=8,amp=.5)=>{const {legs,arms}=p.userData;legs[0].rotation.z=Math.sin(t*sp)*amp;legs[1].rotation.z=-Math.sin(t*sp)*amp;arms[0].rotation.z=-Math.sin(t*sp)*amp;arms[1].rotation.z=Math.sin(t*sp)*amp;};
const still=p=>{const {legs,arms}=p.userData;legs.forEach(l=>{l.rotation.z=0;l.rotation.x=0;});arms.forEach(a=>{a.rotation.z=0;a.rotation.x=0;});};
const cheer=(p,t,i=0)=>{const up=Math.sin(t*7+i)>-.3;p.userData.arms.forEach((a,j)=>a.rotation.x=up?(j?-2.8:2.8):(j?-1.6:1.6));p.position.y=Math.abs(Math.sin(t*7+i))*.7;};
const popS=(o,t,t0,s=1)=>{const kk=clamp((t-t0)/.5);o.visible=kk>0;if(kk>0)o.scale.setScalar(s*Math.max(.001,backOut(kk)));return kk;};
// ---------- the match: ball keyframes [t, x, z, y, arcHeight, jump]
const KF=[[0,0,0,0],[T_KO,0,0,0],[49.3,0,0,0],[50.6,-22,3,0],[51.8,-36,1,0],[52.6,-50,0,0],[53.4,-58,-1,0],
 [53.86,14,15,0,0,1],[54.4,26,15,0],[55.15,29,1,5.4,3],[55.7,37,-2,3.4],[56.4,41,-3,0,1.2],
 [57.3,-8,-8,0,0,1],[58.3,-23,-11,0],[59.4,-37,-9,0,6],[60,-41,-9,0,.8],[99,-41,-9,0]];
function ballAt(t){if(t<T_KO)return null;for(let i=0;i<KF.length-1;i++){const a=KF[i],b=KF[i+1];if(t>=a[0]&&t<b[0]){if(b[5])return v3(a[1],a[3],a[2]);const k=(t-a[0])/(b[0]-a[0]);
 return v3(a[1]+(b[1]-a[1])*k,a[3]+(b[3]-a[3])*k+4*(b[4]||0)*k*(1-k),a[2]+(b[2]-a[2])*k);}}return v3(-41,0,-9);}
const HOME=new Map([[keeper,[-33,0]],[chef,[-25,-7]],[aeth,[-25,7]],[extras[1],[-20,-15]],[devin,[-14,0]],[aqq,[-9,9]],[extras[0],[-9,-10]],[extras[2],[-5,-4]],[milan,[-2,2]],[equi,[-3,16]]]);
const PRE=new Map([[extras[0],[-21,-6]],[keeper,[-15,-6]],[extras[1],[-9,-6]],[chef,[-3,-6]],[aeth,[3,-6]],[extras[2],[9,-6]],[milan,[15,-6]],[devin,[-6,-12]],[aqq,[0,-12]],[equi,[6,-12]]]);
const PRET={[devin.uuid]:T_DEV,[aqq.uuid]:T_AQQ,[equi.uuid]:T_EQU};
const FANTEX={};function fanTex(n){if(!FANTEX[n])FANTEX[n]=textTex(n+(n==1?' FAN':' FANS'),'#ffffff',n?'#1f8a4c':'#d63a3a',1024,Math.round(1024*2.2/7),Math.round(1024*2.2/7*.55));return FANTEX[n];}

window.setTime=function(tr){const t=toD(tr);const sh=SH.find(s=>t>=s.t0&&t<s.t1)||SH[SH.length-1];const k=ease(clamp((t-sh.t0)/(sh.t1-sh.t0)));
 // life
 LAMPS[1].material.emissiveIntensity=t>=T_HOLE?((Math.sin(t*23)>.3&&Math.sin(t*7.1)>-.2)?1.4:0):1.2;
 GULLS.forEach((g,i)=>{const a=t*.35+i*1.3;g.position.set(Math.cos(a)*(50+i*8),34+i*3+Math.sin(t+i)*2,Math.sin(a)*(36+i*5));g.rotation.y=-a;});
 seagull.position.y=2.3+Math.abs(Math.sin(t*3))*.12;seagull.rotation.y=-Math.PI/2+Math.sin(t*.7)*.5;
 mower.visible=t<19.72;mower.position.set(-20+((t*3.4)%44),0,-14);king.userData.arms.forEach(a=>a.rotation.z=-1.1);king.userData.head.rotation.y=Math.sin(t*1.5)*.3;
 kingStand.visible=true;trophy.visible=false;SPARK.forEach(s=>s.visible=false);
 // fake money: rains down, turns grey, disappears
 BILLS.forEach(b=>{const {x,z,d,r}=b.userData;const tt=t-T_RAIN-d;const gone=clamp((t-12.3-(r%7)*.08)/.5);b.visible=tt>0&&gone<1;if(!b.visible)return;const y=Math.max(.25+(r%5)*.09,26-tt*9);
  b.position.set(x+Math.sin(tt*2+r)*1.5,y,z+Math.cos(tt*1.7+r));b.rotation.set(y>.5?tt*3+r:0,r,y>.5?tt*2:0);b.material=t>=T_GREY+(r%5)*.06?GREY:b.userData.m0;b.scale.setScalar(Math.max(.001,1-gone));});
 // back to the old stadium: nets go, holes come back, the roof leaks, the new stand falls down
 {const kk=clamp((t-T_NET)/.4);NETL.visible=NETR.visible=kk<1;NETL.scale.setScalar(Math.max(.001,1-ease(kk)));NETR.scale.setScalar(Math.max(.001,1-ease(kk)));goalL.rotation.x=.12*ease(clamp((t-T_NET-.2)/.5));NONET.forEach(o=>o.visible=t>=T_NET+.3);}
 {const kk=clamp((t-T_HOLE)/.5);const s=Math.max(.001,backOut(kk));HOLEM.forEach(m=>{m.scale.setScalar(s);m.visible=kk>0;});DIRTM.forEach(m=>{m.scale.setScalar(s);m.visible=kk>0;});PUD.forEach((p,i)=>{p.scale.setScalar(s*(1+Math.sin(t*2+i)*.03));p.visible=kk>0;});
  SPARK2.forEach(sp=>sp.visible=false);}
 {const kk=clamp((t-T_ROOF)/.6);patch.visible=kk<1;patch.position.y=9.5+ease(kk)*14;patch.rotation.z=kk*2;DRIPS.forEach((d,i)=>{const ph=((t*.9+i/4)%1);d.position.set(1.2,8-ph*7,6);d.visible=t>T_ROOF+.3&&ph<.95;});bucket.visible=t>T_ROOF+.2;}
 {NS.visible=t<T_NS+1.1;TIERS.forEach((tr2,i)=>{const kk=clamp((t-T_NS-(6-i)*.1)/.5);tr2.visible=kk<1;tr2.scale.y=Math.max(.001,1-ease(kk));});
  SCAF.forEach((p,i)=>{const kk=clamp((t-T_NS-.2-(i%5)*.05)/.6);p.rotation.z=(i%2?1:-1)*1.4*ease(kk);});crane.rotation.z=1.3*ease(clamp((t-T_NS-.3)/.8));
  jib.rotation.y=Math.sin(t*.6)*.8;load.position.y=-8.6+Math.sin(t*1.2)*1.5;hook.position.y=-4+Math.sin(t*1.2)*.75;WORK.forEach((w,i)=>{w.userData.arms[0].rotation.x=Math.sin(t*6+i)*.8;w.position.x=-14+i*9+Math.sin(t*.8+i)*1.2;});
  PUFF.forEach((p,i)=>{const kk=clamp((t-T_NS-.15-(i%6)*.06)/1.6);p.visible=kk>0&&kk<1;if(!p.visible)return;const {x,y,z}=p.userData;p.position.set(x,y*(.4+kk*.8),z);p.scale.setScalar(.4+kk*1.6);p.material.opacity=.9*(1-kk);});
  const tk=clamp((t-T_NS-.2)/.4);TACO.visible=tk<1;TACO.scale.setScalar(Math.max(.001,1-ease(tk)));bigTaco.rotation.y=t*1.2;stranger.visible=false;}
 // the squad
 const B=ballAt(t);if(B)ball.position.set(B.x,.55+B.y,B.z);else ball.position.set(-3,.55,-12);
 const match=t>=T_KO;
 [...HOME.keys()].forEach((p,i)=>{if(!p.userData.legs)return;still(p);p.position.y=0;p.rotation.set(0,0,0);
  const t0=PRET[p.uuid];if(t0!==undefined&&!match){popS(p,t,t0);}else{p.visible=true;p.scale.setScalar(1);}
  if(!match){const h=PRE.get(p);p.position.set(h[0],0,h[1]);p.rotation.y=Math.PI/2;p.userData.head.rotation.y=Math.sin(t*1.1+i)*.25;if(t0!==undefined&&t>t0+.4&&t<t0+1.6)p.userData.arms.forEach((a,j)=>a.rotation.x=j?-2.6:2.6);return;}
  const h=HOME.get(p);let x=h[0],z=h[1];if(p!==keeper){x+=(B.x-h[0])*.16;z+=(B.z-h[1])*.16;}else{z=clamp(B.z*.3,-4,4);}
  p.position.set(x,0,z);p.rotation.y=0;p.userData.head.rotation.y=0;walk(p,t,7,.35);});
 // equitor carries the ball, Milan's header, the keeper dives the wrong way
 if(match){if(t>=53.86&&t<54.4){equi.position.set(B.x-1.4,0,B.z+.3);walk(equi,t,11,.7);}
  if(t>=54.6&&t<55.7){milan.position.set(28.4,0,1.3);const jk=clamp((t-54.9)/.5);milan.position.y=4*jk*(1-jk)*2.2;milan.rotation.y=-.2;}
  if(t>=55.7&&t<57.3){cheer(milan,t,0);cheer(equi,t,1.3);}
  if(t>=51.1&&t<53.86){const dk=ease(clamp((t-51.1)/.35));keeper.position.z=-1-3*dk;keeper.rotation.x=-1.25*dk;keeper.position.y=.6*dk;}
  if(t>=58.9&&t<61.8){const dk=ease(clamp((t-58.9)/.4));keeper.position.set(-33,1.4*dk*(1-dk)*4,-6);keeper.userData.arms.forEach((a,j)=>a.rotation.x=(j?-2.8:2.8)*dk);}
  if(t>=T_END){[...HOME.keys()].forEach(p=>{if(!p.userData.legs)return;still(p);p.position.y=0;p.userData.head.rotation.z=-.5;p.userData.arms.forEach(a=>a.rotation.x=0);});}else [...HOME.keys()].forEach(p=>{if(p.userData.head)p.userData.head.rotation.z=0;});}
 else [...HOME.keys()].forEach(p=>{if(p.userData.head)p.userData.head.rotation.z=0;});
 // the pig mascot on the sideline
 striker.position.set(10,Math.abs(Math.sin(t*5))*.6,20);striker.rotation.y=Math.PI/2;striker.userData.tl.rotation.z=Math.sin(t*12)*.4;sash.visible=sash2.visible=true;
 // Kola Motors arrive by car and walk onto the pitch
 CARS.forEach((c,i)=>{const kk=ease(clamp((t-T_CARS-i*.35)/2.2));c.visible=t>=T_CARS-.1&&t<T_KO;c.position.set(lerp(92+i*12,12-i*15,kk),0,-31+i*.5);c.rotation.y=Math.PI;
  c.children.forEach(w=>{if(w.geometry&&w.geometry.type==='CylinderGeometry')w.rotation.y=-t*8*(kk<1?1:0);});});
 KOLA.forEach((p,i)=>{still(p);p.position.y=0;p.rotation.x=0;p.userData.head.rotation.z=0;const h=p.userData.home;const start=[i%2?-3:12-0,-29];p.visible=t>=T_OUT;if(!p.visible)return;
  if(!match){const kk=clamp((t-T_OUT-i*.12)/1.5);p.position.set(lerp(start[0],h[0],kk),0,lerp(start[1],h[1],kk));p.rotation.y=kk<1?-Math.atan2(h[1]-start[1],h[0]-start[0]):Math.PI;if(kk<1)walk(p,t,9,.6);return;}
  let x=h[0],z=h[1];if(i){x+=(B.x-h[0])*.18;z+=(B.z-h[1])*.18;}else z=clamp(B.z*.3,-4,4);p.position.set(x,0,z);p.rotation.y=Math.PI;walk(p,t,7,.35);});
 if(match){const nine=KOLA[6],eight=KOLA[5];if(t>=49.3&&t<50.7){nine.position.set(B.x+1.3,0,B.z-.2);walk(nine,t,11,.7);}
  if(t>=57.0&&t<57.4){eight.position.set(-6.6,0,-7.8);}
  if(t>=55.4&&t<55.9){const dk=ease(clamp((t-55.4)/.3));KOLA[0].position.z=1+2.6*dk;KOLA[0].rotation.x=1.2*dk;KOLA[0].position.y=.5*dk;}
  if((t>=G1+.1&&t<53.86)||t>=G3+.1){KOLA.forEach((p,i)=>{if(i)cheer(p,t,i);});}}
 // coach, ball boy, referee
 shane.visible=t>=T_SHA;if(shane.visible){popS(shane,t,T_SHA);still(shane);shane.rotation.y=Math.PI/2;shane.userData.arms[1].rotation.x=t<T_SHA+1.4?-2.4:(match?Math.sin(t*5)*1.2-1.2:0);}
 idc.visible=t>=T_IDC;if(idc.visible){popS(idc,t,T_IDC,.7);still(idc);idc.rotation.y=Math.PI/2;idc.position.set(30+(match&&t>=52.6&&t<53.86?-1:0),0,PW/2+2.4);idc.userData.arms.forEach((a,j)=>a.rotation.x=(t>T_IDC+.3&&t<T_IDC+1.4)?(j?-2.5:2.5):0);}
 ref.visible=t>=T_REF;if(ref.visible){popS(ref,t,T_REF);still(ref);if(!match){ref.position.set(12,0,-12);ref.rotation.y=Math.PI/2;ref.userData.arms[0].rotation.z=(t>T_REF+.3&&t<T_REF+1.5)?-1.8:0;}
  else{ref.position.set(B.x*.7+3,0,clamp(B.z+10,-18,20));ref.rotation.y=Math.PI/2;walk(ref,t,6,.3);if(t>=T_END){still(ref);ref.userData.arms[0].rotation.z=-1.8;}}}
 // the stand: Day 2 fans + three new seats
 OGS.forEach(({i,p})=>{p.visible=true;p.scale.setScalar(1);SEATS[i].children[0].material=SEATS[i].children[1].material=M.gold;});ardaPlate.visible=punzPlate.visible=true;ardaPlate.scale.setScalar(1);punzPlate.scale.setScalar(1);
 SEATS[6].children[0].material=SEATS[6].children[1].material=M.gold;
 Object.values(FANS).forEach(f=>{f.visible=true;f.scale.setScalar(.38);});
 NEWSEATS.forEach(({i,p,f},n)=>{popS(p,t,T_SEAT[n]);popS(f,t,T_SEAT[n]+.15,.38);if(n==0)SEATS[i].children[0].material=SEATS[i].children[1].material=t>=T_SEAT[0]?M.gold:M.seat;});
 const allF=[...Object.entries(FANS).map(([i,f])=>[+i,f]),...NEWSEATS.map(s=>[s.i,s.f])];
 allF.forEach(([i,f],n)=>{if(!f.visible)return;const sad=t>=T_END&&t<61.8;const ch=!sad&&(match?((t>=55.7&&t<57.3)||Math.sin(t*5+n*1.7)>.6):Math.sin(t*5+n*1.7)>.2);
  f.userData.arms.forEach((a,j)=>{a.rotation.x=ch?(j?-2.7:2.7):0;});f.position.y=SEATS[i].position.y-.72+(ch?.08:0);f.userData.head.rotation.z=sad?-.5:0;});
 const nf=5+T_SEAT.filter(x=>t>=x+.15).length;fanSign.material.map=fanTex(nf);$('fans').textContent=nf;
 // camera
 if(sh.clubhouse){const c=CH.localToWorld(v3(-6+4*k,17,27));camera.position.copy(c);camera.lookAt(CH.localToWorld(v3(1,7.5,0)));}
 else if(sh.match){const tx=clamp(B.x,-38,38),tz=clamp(B.z,-12,12);camera.position.set(tx*.7,25,-38+tz*.3);camera.lookAt(tx*.85,0,tz*.4);}
 else if(sh.stand){const a=SEATW(3),b2=SEATW(10);const kk=ease(clamp((t-45.3)/2.2));const s=a.clone().lerp(b2,kk);camera.position.set(s.x+3,s.y+5,s.z-13);camera.lookAt(s.x,s.y+1,s.z);}
 else {camera.position.lerpVectors(sh.p[0],sh.p[1],k);camera.lookAt(new THREE.Vector3().lerpVectors(sh.l[0],sh.l[1],k));}
 camera.fov=50;camera.updateProjectionMatrix();renderer.render(scene,camera);
 // UI
 const used={c1:false,c2:false};for(const [id,a,b,txt] of CAPS){if(t>=a&&t<=b){const el=$(id);if(el.dataset.txt!==txt){el.innerHTML=txt;el.dataset.txt=txt;}popAt(el,t,a,b);used[id]=true;}}for(const id in used)if(!used[id])$(id).style.opacity=0;
 popAt($('cmt'),t,4.3,11.0);popAt($('cmt2'),t,6.86,11.0);
 {const on=popAt($('stamp'),t,T_STAMP,13.8,{inDur:.22});if(on){$('stamp').dataset.base='rotate(-8deg)';}}
 popAt($('rule'),t,21.4,26.4);[...$('rule').querySelectorAll('.r')].forEach((r,i)=>popAt(r,t,[22.5,23.94,25.28][i],26.4));
 HEARTS.forEach((h,i)=>{const ph=((t-22.5)*.9+i/10)%1;const on=t>22.5&&t<26.3;h.style.opacity=on?(1-ph):0;h.style.left=(160+((i*137)%760))+'px';h.style.top=(1560-ph*420)+'px';h.style.transform=`scale(${.7+ph*.5})`;});
 popAt($('fund'),t,26.9,31.0);{const n=Math.floor(Math.pow(clamp((t-27.6)/1.9),.6)*1024);$('fundv').textContent='🪙 '+n.toLocaleString('en-US');}
 popAt($('score'),t,T_KO+.3,61.75);{const h=t>=G2?1:0,ko=(t>=G1?1:0)+(t>=G3?1:0);$('scv').textContent=h+' - '+ko;}
 popAt($('goalp'),t,62.2,DUR+1);{const kk=ease(clamp((t-62.7)/1.1));$('gfill').style.width=(kk*51.2)+'%';$('gnum').textContent='🪙 '+Math.round(kk*1024).toLocaleString('en-US')+' / 2,000';}
 [...$('tags').children].forEach((el,i)=>{const [_,__,pf,a,b]=TAGS[i];const pp=proj(pf());el.dataset.base='translate(-50%,-100%)';const hw=el.offsetWidth/2+24;el.style.left=Math.min(1080-hw,Math.max(hw,pp[0]))+'px';el.style.top=Math.max(560+el.offsetHeight+18,pp[1])+'px';popAt(el,t,a,b);if(pp[2]>1)el.style.opacity=0;});
 let fl=0;for(const c of window.CUTS){if(c>0&&tr>=c&&tr<c+.12)fl=.5*(1-(tr-c)/.12);}$('flash').style.opacity=fl;
};
const lerp=(a,b,k)=>a+(b-a)*k;
window.DUR=DUR;window.__T2={camera,renderer,scene,L:(u,v,h=0)=>v3(u,h,v)};
document.fonts.ready.then(()=>{window.setTime(0);window.READY=true;});
