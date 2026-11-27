// ===== HERBERG FC, DAY 1: a citizen asks for a stadium on its own island → the club moves to a new island → build it together =====
const FCG=FC.FCG;{const p=LW(250,100);FCG.position.set(p.x,SEA+1.4,p.y);FCG.rotation.y=FACE+Math.PI;FCG.scale.setScalar(.5);FCG.updateMatrixWorld(true);}
scene.add(sun.target);
const PUFF=[...Array(14)].map(()=>{const m=new THREE.Mesh(new THREE.IcosahedronGeometry(3,0),new THREE.MeshStandardMaterial({color:'#ffffff',transparent:true,opacity:.9,flatShading:true}));m.visible=false;scene.add(m);return m;});
const ST0=stadium.position.clone(),STS=stadium.scale.clone();
// design time (new) ↔ real time, anchored on the voice take's words
const TD=[0,6.2,10.2,15.2,17.6,19.2,20.3,21.7,23.6,25.7,26.8,29.4,32.2,33.4,34.7,36.8,39.2,41.7,46.7,49.2,52.2,56.2,60];
const TR=window.FC_TR||TD, RDUR=TR[TR.length-1];
const pw=(x,A,B)=>{for(let i=0;i<A.length-1;i++)if(x<=A[i+1]||i==A.length-2)return B[i]+(B[i+1]-B[i])*clamp((x-A[i])/(A[i+1]-A[i]));};
const toD=tr=>pw(tr,TR,TD), toR=td=>pw(td,TD,TR);
const O=6;  // the football scenes run 6 s later than in the first cut
const SHW=[
 {t0:0,t1:3.4, p:[L(-40,-230,170),L(60,-120,90)], l:[L(60,40,0),L(105,36,0)]},
 {t0:3.4,t1:6.2, p:[L(88,-14,34),L(96,-4,28)], l:[L(110,36,3),L(110,36,3)]},
 {t0:6.2,t1:10.2, move:true},
];
const CUTS_D=[0,3.4,6.2,10.2,15.2,17.6,19.2,20.3,21.7,25.7,34.7,36.8,39.2,41.7,46.7,52.2];
const CAPS=[['c1',.2,3.4,'Day 1:<br>a <b>new series</b> ⚽'],['c1',3.4,6.2,'A stadium on<br>its <b>own island?</b>'],['c1',6.2,10.2,'Herberg FC<br><b>moved!</b> 🏝️'],
 ['c1',10.2,15.2,'1 follow<br>= <b>1 fan</b>'],['c1',15.2,17.6,"It's a<br><b>disaster</b> 😬"],['c1',17.6,19.2,'Holes in<br>the <b>pitch</b>'],['c1',19.2,20.3,'No <b>net</b>'],['c1',20.3,21.7,'A <b>leaky</b><br>roof 💧'],
 ['c1',21.7,25.7,'Manager:<br><b>the King</b> 👑'],['c2',23.6,25.7,'(also the<br><b>groundsman</b>)'],['c1',25.7,34.7,'The<br><b>squad</b>'],['c1',34.7,36.8,'The dream:<br><b>World Cup</b> 🏆'],['c1',39.2,41.7,'The stand?<br><b>Empty.</b>'],
 ['c1',41.7,46.7,'Comment <b>OG</b><br>for a seat 🎟️'],['c1',46.7,52.2,'We build it<br><b>together</b> 🏗️'],['c1',52.2,60,'Top comment<br><b>decides!</b>']];
const TAGS=[
 ['🏟️ OLD STADIUM','main island',()=>stadium.getWorldPosition(v3(0,9,0)),3.8,6.2],
 ['YOU?','your seat',()=>FC.seatW(6).add(v3(0,1.6,0)),11.4,15.2],
 ['<span class="no">#1</span>KEEPER','scared of the ball',()=>FC.keeper.getWorldPosition(v3(0,7.6,0)),27.0,29.4],
 ['<span class="no">#4</span>DEFENDER','still in his apron',()=>FC.chef.getWorldPosition(v3(0,9.4,0)),29.6,32.2],
 ['<span class="no">#9</span>STRIKER','...a pig 🐷',()=>FC.striker.getWorldPosition(v3(0,4.6,0)),33.4,34.7],
];
$('tags').innerHTML=TAGS.map(t=>`<div class="ntag"><div class="tt">${t[0]}</div><div class="ts">${t[1]}</div></div>`).join('');
const HEARTS=[...Array(10)].map(()=>{const d=document.createElement('div');d.className='heart';d.textContent='❤️';$('hearts').appendChild(d);return d;});
window.CAPTION_TIMES=[...new Set(CAPS.map(c=>c[1]))].concat(TAGS.map(t=>t[3]),[1.4,6.8,8.6,37.2,42.4,47.2,47.8,52.8,53.6,54.4,56.0,57.4]).map(toR);
window.CUTS=CUTS_D.map(toR);window.BOOMS=[toR(6.8)];
function popAt(el,t,a,b,{inDur=.28,outDur=.15}={}){if(t<a||t>b){el.style.opacity=0;return 0;}const k=clamp((t-a)/inDur),ko=clamp((b-t)/outDur);const s=k<1?(k<.6?.55+.6*(k/.6):1.15-.15*((k-.6)/.4)):1;
 el.style.opacity=Math.min(k*2,ko,1);el.style.transform=(el.dataset.base||'')+` scale(${s})`;return 1;}
const proj=v=>{const p=v.clone().project(camera);return [(p.x+1)/2*1080,(1-p.y)/2*1920,p.z];};

window.setTime=function(tr){const t=toD(tr);
 {const TL=t+100;const t_=TL;
  (function(t){
//@@LIFE@@
  })(TL);}
 ISL10.forEach(o=>{o.sp.visible=false;});ISL11.forEach(o=>{o.sp.visible=false;});splane.visible=false;STARS.material.opacity=0;
 $('popn').textContent='0';
 // the old stadium on the main island leaves...
 {const kk=clamp((t-6.5)/.5);stadium.visible=kk<1;stadium.scale.copy(STS).multiplyScalar(Math.max(.001,1-kk));stadium.position.copy(ST0).add(v3(0,kk*10,0));
  PUFF.forEach((p,i)=>{const ph=clamp((t-6.5)/1.4);p.visible=ph>0&&ph<1;const a=i/14*Math.PI*2;p.position.copy(ST0).add(v3(Math.cos(a)*(6+ph*16),4+ph*10+Math.sin(i)*3,Math.sin(a)*(6+ph*16)));p.scale.setScalar(.6+ph*1.6);p.material.opacity=.9*(1-ph);});}
 // ...and the club's new island rises from the sea
 {const kk=clamp((t-7.0)/.8);FCG.visible=kk>0;const s=.5*Math.max(.001,backOut(kk));FCG.scale.setScalar(s);const p=LW(250,100);FCG.position.set(p.x,SEA+1.4-10*(1-ease(kk)),p.y);FCG.updateMatrixWorld(true);}
 const tt=t-O; FC.update(tt);
 // camera
 if(t<10.2){const sh=SHW.find(s=>t>=s.t0&&t<s.t1)||SHW[2];const k=ease(clamp((t-sh.t0)/(sh.t1-sh.t0)));
   if(sh.move){camera.position.lerpVectors(L(95,-60,85),L(200,10,62),k);camera.lookAt(new THREE.Vector3().lerpVectors(L(110,36,0),L(240,95,0),ease(clamp((t-6.4)/1.6))));}
   else {camera.position.lerpVectors(sh.p[0],sh.p[1],k);camera.lookAt(new THREE.Vector3().lerpVectors(sh.l[0],sh.l[1],k));}
   sun.target.position.set(0,0,0);sun.position.set(180,270,135);}
 else {const c=FC.cam(tt);camera.position.copy(FCG.localToWorld(c.p.clone()));camera.lookAt(FCG.localToWorld(c.l.clone()));
   sun.target.position.copy(FCG.position);sun.position.copy(FCG.position).add(v3(180,270,135));}
 sun.target.updateMatrixWorld();camera.fov=50;camera.near=.5;camera.updateProjectionMatrix();renderer.render(scene,camera);
 // UI
 const used={c1:false,c2:false};for(const [id,a,b,txt] of CAPS){if(t>=a&&t<=b){const el=$(id);if(el.dataset.txt!==txt){el.innerHTML=txt;el.dataset.txt=txt;}popAt(el,t,a,b);used[id]=true;}}for(const id in used)if(!used[id])$(id).style.opacity=0;
 popAt($('cmt'),t,1.4,6.0);
 popAt($('crest'),t,8.4,10.2);
 popAt($('match'),t,37.2,39.2);popAt($('ticket'),t,42.4,46.7);popAt($('fund'),t,47.2,52.2);popAt($('likeb'),t,49.6,52.2);
 {const n=1000+Math.floor(clamp((t-49.8)/2.2)*27);$('fundv').textContent='🪙 '+n.toLocaleString('en-US');}
 HEARTS.forEach((h,i)=>{const ph=((t-49.8)*.9+i/10)%1;const on=t>49.8&&t<52.2;h.style.opacity=on?(1-ph):0;h.style.left=(200+((i*137)%680))+'px';h.style.top=(1500-ph*520)+'px';h.style.transform=`scale(${.7+ph*.5})`;});
 const ch=[...$('choices').children];$('choices').style.opacity=t>=52.6&&t<=60?1:0;ch.forEach((c,i)=>popAt(c,t,52.8+i*.75,60));
 popAt($('topc'),t,56.0,60);popAt($('dec'),t,57.2,60);
 [...$('tags').children].forEach((el,i)=>{const [_,__,pf,a,b]=TAGS[i];const pp=proj(pf());el.dataset.base='translate(-50%,-100%)';const hw=el.offsetWidth/2+24;el.style.left=Math.min(1080-hw,Math.max(hw,pp[0]))+'px';el.style.top=Math.max(560+el.offsetHeight+18,pp[1])+'px';popAt(el,t,a,b);if(pp[2]>1)el.style.opacity=0;});
 let fl=0;for(const c of window.CUTS){if(c>0&&tr>=c&&tr<c+.12)fl=.5*(1-(tr-c)/.12);}$('flash').style.opacity=fl;
};
window.DUR=RDUR; window.__T2={camera,renderer,scene,L,LW};
document.fonts.ready.then(()=>{window.setTime(0);window.READY=true;});
