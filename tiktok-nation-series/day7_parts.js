// ===== DAY 7: the railway wins + your requests =====
// (make_day7.py prepends the Day 5 + Day 6 builds, all already standing)
POP.forEach(g=>{g.userData.t=-1;});
const POP7=[];
function fireTruck(){const g=new THREE.Group();const rd=std('#d92b25'),wh=std('#f4f4f4');g.add(box(2.3,1.9,5.2,rd,0,1.35,-.4));g.add(box(2.3,1.5,1.7,rd,0,1.15,2.95));g.add(box(2.1,.7,.08,MT.glass,0,1.55,3.82));
 g.add(box(2.34,.25,5.24,wh,0,1.0,-.4));const lad=new THREE.Group();lad.add(box(.12,.12,5,MT.white,-.45,0,0));lad.add(box(.12,.12,5,MT.white,.45,0,0));for(let k=-2;k<=2;k++)lad.add(box(.9,.08,.08,MT.white,0,0,k));lad.position.set(0,2.45,-.6);lad.rotation.x=-.06;g.add(lad);
 const lr=box(.6,.25,.4,std('#ff2a2a',{emissive:'#ff2a2a',emissiveIntensity:1}),-.45,2.05,3.1),lb=box(.6,.25,.4,std('#2a6dff',{emissive:'#2a6dff',emissiveIntensity:1}),.45,2.05,3.1);g.add(lr,lb);g.userData={lr,lb};
 for(const x of [-1.1,1.1])for(const z of [-2.2,-.6,2.8]){const w=cyl(.45,.45,.3,MT.dark,x,.45,z,10);w.rotation.z=Math.PI/2;g.add(w);}g.traverse(o=>o.castShadow=true);g.scale.setScalar(1.15);scene.add(g);return g;}
function at7(g,u,v,t,rot=0,y0=0){place(g,u,v,t,rot,y0);POP7.push(g);return g;}
const crown=(s=1)=>{const c=new THREE.Group();const gold=std('#f2c230',{metalness:.6,roughness:.3});c.add(cyl(.32*s,.32*s,.22*s,gold,0,0,0,12));for(let i=0;i<5;i++){const a=i/5*Math.PI*2;const sp=new THREE.Mesh(new THREE.ConeGeometry(.08*s,.25*s,6),gold);sp.position.set(Math.cos(a)*.27*s,.2*s,Math.sin(a)*.27*s);c.add(sp);}return c;};

// ---------- 🚂 THE RAILWAY (vote winner): elevated line over Avenue 36 + Herberg Central (@newhamm.william @k17.gaming)
const RLV=36, RLY=L(0,RLV).y+9, RU0=-76, RU1=92;
const railway=(()=>{const g=new THREE.Group();const deckM=std('#b9b2a4'),railM=std('#6b6f75');
 for(let u=RU0;u<RU1;u+=4){const a=LW(u,RLV),b=LW(u+4,RLV);const seg=new THREE.Group();seg.add(box(3.6,.6,4.05,deckM,0,0,0));for(const x of [-.75,.75])seg.add(box(.14,.18,4.05,railM,x,.38,0));for(let k=-1.5;k<=1.5;k+=1)seg.add(box(2.2,.1,.3,MT.wood,0,.3,k));
  seg.position.set((a.x+b.x)/2,RLY,(a.y+b.y)/2);seg.rotation.y=ALONG_ANG+Math.PI/2;g.add(seg);
  if(Math.round(u)%12===0){const p=L(u+2,RLV);const pl=box(.7,RLY-p.y,.7,deckM,0,0,0);pl.position.set(p.x,(RLY+p.y)/2,p.z);g.add(pl);}}
 g.traverse(o=>{o.castShadow=true;o.receiveShadow=true;});g.userData.t=9.6;g.visible=false;scene.add(g);POP7.push(g);return g;})();
const station=at7((()=>{const g=new THREE.Group();const y=RLY-L(86,RLV).y;g.add(box(12,.5,3,MT.stone,0,y-.1,3.4));g.add(box(12,.5,3,MT.stone,0,y-.1,-3.4));
 for(const z of [-3.4,3.4])for(const x of [-5,0,5])g.add(cyl(.15,.15,3.4,MT.white,x,y+1.6,z+(z>0?1:-1),6));g.add(box(13,.3,10,std('#c93a2e'),0,y+3.4,0));
 const s=sign('HERBERG CENTRAL','#ffffff','#1d3f8a',6,1);s.position.set(0,y+2.6,5);g.add(s);for(const z of [-5,5]){const st=box(2,y,4,MT.stone,6.6,y/2,z*.9);g.add(st);}
 for(const z of [-3.4,3.4])g.add(box(.7,y,.7,MT.stone,-5.5,y/2,z));
 const tm=pawn('#1d3f8a',1);const cap=box(.6,.2,.6,std('#1d3f8a'),0,1.9,0);tm.add(cap);tm.position.set(1.5,y+.15,3.6);g.add(tm);g.userData.tm=tm;
 const cat=new THREE.Group();const cm=std('#f2a33a');cat.add(box(.4,.32,.7,cm,0,.3,0));const hd=box(.34,.3,.3,cm,0,.55,.42);cat.add(hd);for(const x of [-.1,.1]){const e=new THREE.Mesh(new THREE.ConeGeometry(.07,.15,4),cm);e.position.set(x,.76,.42);cat.add(e);}const tl=box(.07,.07,.5,cm,0,.5,-.5);tl.rotation.x=-.8;cat.add(tl);cat.position.set(2.4,y+.15,3.6);g.add(cat);g.userData.cat=cat;
 g.traverse(o=>o.castShadow=true);return g;})(),86,RLV,10.4,Math.PI/2);
function rcar(c,loco){const g=new THREE.Group();g.add(box(2.2,2.2,6,std(c),0,1.5,0));g.add(box(2.25,.7,5.6,MT.glass,0,1.9,0));g.add(box(2.3,.25,6.1,MT.white,0,.5,0));if(loco){g.add(box(2.1,1,1.4,std('#1d232b'),0,2.9,1.6));g.add(cyl(.3,.3,1.2,MT.dark,0,3.2,2.4,8));}for(const z of [-2,2])g.add(box(1.8,.5,1,MT.dark,0,.35,z));g.traverse(o=>o.castShadow=true);return g;}
const train=[rcar('#c93a2e',true),rcar('#f4ead2'),rcar('#f4ead2')];train.forEach(c=>{c.visible=false;scene.add(c);});
const trainU=t=>t<11?-72:t<16?-72+150*ease((t-11)/5):t<34?78:t<44?78-146*ease((t-34)/10):t<52?-68:-68+146*ease(clamp((t-52)/9));

// ---------- 👑 Egyptian Mapper on top of the castle with a crown (@egyptianmapper16)
const king=(()=>{const k=pawn('#8a2be2',1.3);const c=crown(1.3);c.position.y=2.35;k.add(c);const cape=box(.9,1.2,.1,std('#c0392b'),0,1,-.3);k.add(cape);const y=castle.userData.top+12;k.position.set(0,y,0);k.visible=false;castle.add(k);return k;})();
// ---------- ⛪ priest + altar boys at the church (@donotdisturb_luke)
const priestGrp=at7((()=>{const g=new THREE.Group();const pr=pawn('#1d232b',1);pr.add(box(.3,.12,.06,MT.white,0,1.28,.3));g.add(pr);for(const x of [-1.2,1.2]){const b=pawn('#ffffff',.75);b.add(box(.5,.5,.06,std('#c0392b'),0,.9,.28));b.position.x=x;b.position.z=-.4;g.add(b);}
 const alt=box(1.6,.9,.7,MT.white,0,.45,1.2);g.add(alt);g.add(box(.08,.6,.08,std('#f2c230'),0,1.2,1.2));g.add(box(.4,.08,.08,std('#f2c230'),0,1.35,1.2));g.traverse(o=>o.castShadow=true);g.userData.pr=pr;return g;})(),-41.6,2.6,21.4,Math.PI);
// ---------- ⚒️ blacksmith (@lil_jonesy777)
const smith=at7((()=>{const g=new THREE.Group();const st=std('#8d7b68');g.add(box(7,4,5,st,0,2,0));g.add(roof4(7.6,1.6,std('#5b4636'),4.6));g.add(box(1.2,6,1.2,std('#6b5b4a'),2.6,3.5,-1.4));
 const fur=box(2,1.4,1.2,std('#ff6a1a',{emissive:'#ff4a00',emissiveIntensity:1}),-1.6,.8,2.6);g.add(fur);g.add(box(1.1,.5,.6,MT.dark,1.2,.9,3));g.add(box(.5,.6,.5,MT.dark,1.2,.3,3));
 const s=sign('BLACKSMITH','#ffffff','#5b4636',3.6,.7);s.position.set(0,3.2,2.52);g.add(s);const sm=pawn('#5b4636',.95);sm.add(box(.6,.7,.06,std('#2b2b2b'),0,.9,.3));sm.position.set(2.4,0,3.4);g.add(sm);g.userData.sm=sm;
 const puffs=[];for(let i=0;i<5;i++){const p=new THREE.Mesh(new THREE.IcosahedronGeometry(.7,1),new THREE.MeshStandardMaterial({color:'#8a8a8a',transparent:true,opacity:.7,flatShading:true}));g.add(p);puffs.push(p);}g.userData.puffs=puffs;
 const sparks=[];for(let i=0;i<8;i++){const p=new THREE.Mesh(new THREE.SphereGeometry(.08,6,4),new THREE.MeshBasicMaterial({color:'#ffd23a'}));g.add(p);sparks.push(p);}g.userData.sparks=sparks;
 g.traverse(o=>o.castShadow=true);return g;})(),8,87,25.4);
// ---------- 🚓 police commander (@somedude9898, asked by @hawki771) + 🚒 fire captain (@south_parkfan39)
const cop=at7((()=>{const g=new THREE.Group();const c=car('#ffffff');scene.remove(c);c.add(box(1.72,.3,3.42,std('#1d3f8a'),0,.8,0));const lb=box(.9,.2,.3,std('#e8334f',{emissive:'#e8334f',emissiveIntensity:1}),0,2.1,-.2);c.add(lb);c.position.set(-2.6,0,0);g.add(c);g.userData.lb=lb;
 const cm=pawn('#1d3f8a',1.05);const hat=box(.7,.22,.7,std('#1d232b'),0,1.9,0);cm.add(hat);cm.add(box(.25,.25,.06,std('#f2c230'),.15,1.25,.3));cm.position.set(1.2,0,0);g.add(cm);for(const x of [2.6,3.6]){const o=pawn('#3e6fc4',.85);o.position.set(x,0,-.6);g.add(o);}
 g.traverse(o=>o.castShadow=true);return g;})(),-40.5,57.6,29.4,Math.PI);
const captain=at7((()=>{const g=new THREE.Group();const tr=fireTruck();scene.remove(tr);tr.rotation.y=Math.PI/2;tr.position.set(-3.2,0,0);g.add(tr);g.userData.tr=tr;
 const fc=new THREE.Group();const b=new THREE.Mesh(new THREE.CapsuleGeometry(.36,.8,4,8),std('#f2c230'));b.position.y=.78;const h=new THREE.Mesh(new THREE.SphereGeometry(.38,10,8),std('#ffffff'));h.position.y=1.7;fc.add(b,h);fc.add(box(.3,.3,.06,std('#f2c230',{metalness:.6}),0,1.1,.36));fc.position.set(2.2,0,0);fc.scale.setScalar(1.1);g.add(fc);
 g.traverse(o=>o.castShadow=true);return g;})(),-31,57.4,33.4,Math.PI);
// ---------- ⛴️ ferry + its sailor (@johnyomama541)
const ferry=(()=>{const g=new THREE.Group();const w=MT.white;g.add(box(5,1.6,12,std('#2f8fe0'),0,.6,0));g.add(box(5.1,.4,12.1,w,0,1.5,0));g.add(box(4,1.6,6,w,0,2.5,0));g.add(box(4.1,.5,6.1,MT.glass,0,2.7,0));g.add(box(2.4,1.2,2,w,0,3.9,-1));
 g.add(cyl(.4,.4,1.6,std('#e8334f'),0,4.8,-1.6,10));const s=sign('HERBERG FERRY','#ffffff','#2f8fe0',4,.7);s.position.set(2.56,2,0);s.rotation.y=Math.PI/2;g.add(s);
 for(let i=0;i<5;i++){const p=pawn(['#f2a33a','#e85d75','#3e8fe6','#7bd65b','#9b59d6'][i],.7);p.position.set(-1.6+i*.8,1.7,4.6);g.add(p);}const sl=pawn('#ffffff',.85);sl.add(box(.5,.15,.5,MT.white,0,1.9,0));sl.add(box(.6,.08,.06,std('#1d3f8a'),0,1.2,.31));sl.position.set(0,4.5,.4);g.add(sl);g.userData.sl=sl;
 g.traverse(o=>o.castShadow=true);g.visible=false;scene.add(g);return g;})();
const FERRY_A=[34,-22],FERRY_B=[90,-42];
// ---------- ⚓ navy warship (@ryyy7220)
const navy=(()=>{const g=new THREE.Group();const gr=std('#7d8892'),gr2=std('#5f6a73');g.add(box(5,2,22,gr,0,.8,0));const bow=new THREE.Mesh(new THREE.ConeGeometry(2.5,6,4),gr);bow.rotation.x=Math.PI/2;bow.rotation.y=Math.PI/4;bow.scale.set(1,1,.6);bow.position.set(0,.8,13.5);g.add(bow);
 g.add(box(3.6,3,6,gr2,0,3.2,-2));g.add(box(2.6,1.6,3,gr2,0,5.4,-2.5));g.add(cyl(.12,.12,4,MT.dark,0,8,-2.8,6));for(const z of [5,-8]){const tu=new THREE.Group();tu.add(cyl(1,1.1,.9,gr2,0,0,0,12));const gun=cyl(.15,.15,3,gr2,0,.2,1.4,8);gun.rotation.x=Math.PI/2;tu.add(gun);tu.position.set(0,2.2,z);if(z<0)tu.rotation.y=Math.PI;g.add(tu);}
 const s=sign('H-01','#ffffff','#5f6a73',1.6,.8);s.position.set(2.52,1,8);s.rotation.y=Math.PI/2;g.add(s);const fl=new THREE.Mesh(new THREE.PlaneGeometry(1.4,.9),new THREE.MeshStandardMaterial({map:FLAG_TEX,side:THREE.DoubleSide}));fl.position.set(.7,9.4,-2.8);g.add(fl);
 const sailor=pawn('#ffffff',.95);sailor.add(cyl(.3,.3,.15,MT.white,0,1.95,0,10));sailor.position.set(0,1.8,9);g.add(sailor);for(let i=0;i<4;i++){const p=pawn('#ffffff',.8);p.position.set(-1.4+(i%2)*2.8,1.8,2-i*2.4);g.add(p);}
 g.traverse(o=>o.castShadow=true);const p=LW(-62,-30);g.position.set(p.x,SEA+.1,p.y);g.rotation.y=ALONG_ANG;g.userData.t=41.4;g.userData.base=SEA+.1;g.visible=false;scene.add(g);POP7.push(g);g.userData.sailor=sailor;return g;})();
// ---------- 🏨 hotel by the sea (@lol240000000000000000000)
const hotel=at7((()=>{const g=new THREE.Group();const w=std('#fbf3e4');g.add(box(9,14,7,w,0,7,0));for(let f=0;f<5;f++){g.add(box(9.1,.3,7.1,std('#e08a3c'),0,2.6+f*2.6,0));for(let k=0;k<4;k++)g.add(box(1.4,1.2,.06,MT.glass,-3.3+k*2.2,1.6+f*2.6,3.53));}
 g.add(box(9.4,.6,7.4,std('#e08a3c'),0,14.3,0));const s=sign('HOTEL','#ffffff','#e08a3c',4,1);s.position.set(0,12.4,3.6);g.add(s);g.add(box(4,.2,2,std('#e08a3c'),0,2.8,4.4));
 for(let i=0;i<2;i++){const p=new THREE.Group();p.add(cyl(.2,.25,3,MT.wood,0,1.5,0,6));const lf=new THREE.Mesh(new THREE.ConeGeometry(1.2,1.4,6),std('#3fa34d'));lf.position.y=3.4;p.add(lf);p.position.set(i?4:-4,0,4.6);g.add(p);}
 g.traverse(o=>o.castShadow=true);return g;})(),84,6,45.4);
// ---------- 🚁 Antarctic Airlines helicopter pilot (@official_lifthansa)
const aheli=(()=>{const g=new THREE.Group();const b=new THREE.Mesh(new THREE.CapsuleGeometry(.9,1.8,6,10),std('#eaf6ff'));b.rotation.x=Math.PI/2;b.position.y=1.2;g.add(b);g.add(box(1.85,.45,2.8,std('#2f8fe0'),0,1.2,0));g.add(box(1.3,.6,1,MT.glass,0,1.5,1.3));
 g.add(box(.35,.35,3.6,std('#2f8fe0'),0,1.4,-2.8));g.add(box(.1,1.1,.7,std('#2f8fe0'),0,1.9,-4.5));const rot=new THREE.Group();rot.add(box(7,.06,.3,MT.dark,0,0,0));rot.add(box(.3,.06,7,MT.dark,0,0,0));rot.position.y=2.4;g.add(rot);g.userData.rot=rot;
 const s=sign('ANTARCTIC','#2f8fe0','#ffffff',1.8,.4);s.position.set(.93,1.2,.2);s.rotation.y=Math.PI/2;g.add(s);g.traverse(o=>o.castShadow=true);g.visible=false;scene.add(g);return g;})();
const AH_C=L(-24,112,0);

const SH=[
 {t0:0,   t1:4,   p:[L(60,-150,120),L(66,-140,112)], l:[L(0,40,10),L(0,40,10)], f:46},
 {t0:4,   t1:9,   p:[L(-10,-10,40),L(-6,-6,38)], l:[L(10,36,8),L(12,36,8)], f:50},
 {t0:9,   t1:13,  p:[L(-30,8,30),L(-10,10,30)], l:[L(10,RLV,9),L(30,RLV,9)], f:52},
 {t0:13,  t1:17,  p:[L(70,24,16),L(72,26,15)], l:[L(86,RLV,10),L(86,RLV,10)], f:54},
 {t0:17,  t1:21,  king:true, f:50},
 {t0:21,  t1:25,  p:[L(-36,-8,6),L(-38,-9,6)], l:[L(-41.6,3,1.6),L(-41.6,3,1.6)], f:55},
 {t0:25,  t1:29,  p:[L(-2,70,16),L(0,71,15)], l:[L(8,87,3),L(8,87,3)], f:52},
 {t0:29,  t1:33,  p:[L(-36,48,8),L(-38,48,8)], l:[L(-40.5,58,1.5),L(-40.5,58,1.5)], f:55},
 {t0:33,  t1:37,  p:[L(-26,48,8),L(-28,48,8)], l:[L(-31,58,1.5),L(-31,58,1.5)], f:55},
 {t0:37,  t1:41,  follow:'ferry', f:54},
 {t0:41,  t1:45,  p:[L(-40,-8,16),L(-44,-10,15)], l:[L(-62,-30,4),L(-62,-30,4)], f:52},
 {t0:45,  t1:49,  p:[L(70,-16,12),L(72,-14,12)], l:[L(84,6,9),L(84,6,9)], f:54},
 {t0:49,  t1:53,  p:[L(-2,88,30),L(-6,90,30)], track:'aheli', f:52},
 {t0:53,  t1:62,  p:[L(70,-112,168),L(84,-132,196)], l:[L(0,40,0),L(0,40,0)], f:46},
];
const DUR=62;
const TD=[0,4.2,9.2,17.2,21.2,25.2,29.2,33.2,37.2,41.2,45.2,49.2,53.2,62];
const TR=window.DAY7_TR||TD, RDUR=TR[TR.length-1];
const pw=(x,A,B)=>{for(let i=0;i<A.length-1;i++)if(x<=A[i+1]||i==A.length-2)return B[i]+(B[i+1]-B[i])*clamp((x-A[i])/(A[i+1]-A[i]));};
const toD=tr=>pw(tr,TR,TD), toR=td=>pw(td,TD,TR);
const caps=[
 ['c1',.2,4,TXT.d0],['c1',4.2,9,TXT.d1],['c1',9.2,17,TXT.d2],['c1',17.2,21,TXT.d3],['c1',21.2,25,TXT.d4],['c1',25.2,29,TXT.d5],['c1',29.2,33,TXT.d6],
 ['c1',33.2,37,TXT.d7],['c1',37.2,41,TXT.d8],['c1',41.2,45,TXT.d9],['c1',45.2,49,TXT.d10],['c1',49.2,53,TXT.d11],['c1',53.2,DUR,TXT.d12],['c2',57,DUR,TXT.d12b],
];
const TAGS=[
 ['🚂 RAILWAY','@newhamm.william · @k17.gaming',()=>L(20,RLV,14),10.6,13],
 ['🚉 TRAIN MASTER + CAT','@newhamm.william',()=>station.userData.tm.getWorldPosition(v3(0,0,0)).add(v3(0,2.8,0)),14.0,17],
 ['👑 KING OF THE CASTLE','@egyptianmapper16',()=>king.getWorldPosition(v3(0,0,0)).add(v3(0,4,0)),18.0,21],
 ['⛪ THE PRIEST','@donotdisturb_luke',()=>priestGrp.userData.pr.getWorldPosition(v3(0,0,0)).add(v3(0,2.6,0)),22.0,25],
 ['⚒️ BLACKSMITH','@lil_jonesy777',()=>L(8,87,8),26.0,29],
 ['🚓 3RD DIVISION COMMANDER','@somedude9898 · @hawki771',()=>L(-40.5,57.6,4.4),30.0,33],
 ['🚒 FIRE CAPTAIN','@south_parkfan39',()=>L(-31,57.4,4.6),34.0,37],
 ['⛴️ FERRY SAILOR','@johnyomama541',()=>ferry.userData.sl.getWorldPosition(v3(0,0,0)).add(v3(0,2.6,0)),38.0,41],
 ['⚓ NAVY','@ryyy7220',()=>navy.userData.sailor.getWorldPosition(v3(0,0,0)).add(v3(0,2.6,0)),42.0,45],
 ['🏨 HOTEL','@lol240000000000000000000',()=>L(84,6,17),46.0,49],
 ['🚁 ANTARCTIC PILOT','@official_lifthansa',()=>aheli.position.clone().add(v3(0,4,0)),50.0,53],
];
$('tags').innerHTML=TAGS.map(t=>`<div class="ntag"><div class="tt">${t[0]}</div><div class="ts">${t[1]}</div></div>`).join('');
window.CAPTION_TIMES=[...new Set(caps.map(c=>c[1]))].concat(TAGS.map(t=>t[3]),[4.6,5.0,54.4,55.0],POP7.map(g=>g.userData.t),[17.6]).map(toR);
window.CUTS=SH.map(s=>s.t0).map(toR);
window.BOOMS=[];
function popAt(el,t,a,b,{inDur=.28,outDur=.15}={}){
 if(t<a||t>b){el.style.opacity=0;return 0;}
 const k=clamp((t-a)/inDur), ko=clamp((b-t)/outDur);const s= k<1 ? (k<.6? .55+.6*(k/.6) : 1.15-.15*((k-.6)/.4)) : 1;
 el.style.opacity=Math.min(k*2,ko,1); el.style.transform=(el.dataset.base||'')+` scale(${s})`; return 1;}
const proj=(v)=>{const p=v.clone().project(camera);return [(p.x+1)/2*1080,(1-p.y)/2*1920,p.z];};

window.setTime=function(tr){const t=toD(tr);
 const sh=SH.find(s=>t>=s.t0&&t<s.t1)||SH[SH.length-1];
 const k=ease(clamp((t-sh.t0)/(sh.t1-sh.t0)));
 // moving things first (the ferry shot follows the ferry)
 { const fk=((t*.04)%2);const f=fk<1?fk:2-fk;const dir=fk<1?1:-1;const u=FERRY_A[0]+(FERRY_B[0]-FERRY_A[0])*ease(f),v=FERRY_A[1]+(FERRY_B[1]-FERRY_A[1])*ease(f);const p=LW(u,v);ferry.visible=t>=36.8;
   ferry.position.set(p.x,SEA+.15+Math.sin(t*1.5)*.12,p.y);const q=LW(u+(FERRY_B[0]-FERRY_A[0])*.01*dir,v+(FERRY_B[1]-FERRY_A[1])*.01*dir);ferry.lookAt(q.x,ferry.position.y,q.y); }
 if(sh.follow==='ferry'){const d=new THREE.Vector3(0,0,1).applyQuaternion(ferry.quaternion);camera.position.copy(ferry.position).addScaledVector(d,-34).add(v3(12,18,0));camera.lookAt(ferry.position.clone().addScaledVector(d,4).add(v3(0,2,0)));}
 else if(sh.king){castle.updateMatrixWorld(true);const kp=king.getWorldPosition(v3(0,0,0));const a=LW(78,112),b=LW(78,96);const d=v3(b.x-a.x,0,b.y-a.y).normalize();const side=v3(-d.z,0,d.x);camera.position.copy(kp).addScaledVector(d,16+4*k).addScaledVector(side,6-4*k).add(v3(0,5,0));camera.lookAt(kp.clone().add(v3(0,1.5,0)));}
 else if(sh.track==='aheli'){camera.position.lerpVectors(sh.p[0],sh.p[1],k);camera.lookAt(aheli.position);}
 else if(sh.orbit){const o=sh.orbit;const a=o.a0+(o.a1-o.a0)*k;const c=L(o.c[0],o.c[1],o.c[2]);camera.position.set(c.x+Math.sin(a+FACE)*o.r,c.y+o.h,c.z+Math.cos(a+FACE)*o.r);camera.lookAt(c);}
 else {camera.position.lerpVectors(sh.p[0],sh.p[1],k); camera.lookAt(new THREE.Vector3().lerpVectors(sh.l[0],sh.l[1],k));}
 camera.fov=sh.f||46; camera.updateProjectionMatrix();
 clouds.forEach((c,i)=>{c.userData.bx??=c.position.x;c.position.x=c.userData.bx+t*1.4*(i%2?1:-1);});
 smoke.forEach((b,i)=>{const ph=((t*.12+i/smoke.length)%1);b.position.set(V.x+ph*20+Math.sin(i*3)*3,H(V.x,V.y)+5+ph*40,V.y-ph*9);b.scale.setScalar(.9+ph*3);b.material.opacity=.6*(1-ph);});
 lava.material.color.setHSL(.06,1,.5+.06*Math.sin(t*4));
 ghosts.forEach(g=>g.visible=false); pawns.forEach(p=>p.visible=false); flagGrp.visible=false; siteA.visible=siteB.visible=false;
 cutAt(t);
 for(const g of roadParts)g.visible=true;
 for(const g of NEW){ if(POP7.includes(g))continue; g.visible=true;g.scale.setScalar(1);
   if(g.userData.base!==undefined){g.position.y=g.userData.base+Math.sin(t*1.5+g.position.x)*.15;g.rotation.z=Math.sin(t*1.2+g.position.z)*.04;}}
 for(const g of POP){g.visible=true;g.scale.setScalar(1);}
 for(const g of POP7){const kk=clamp((t-g.userData.t)/.5);g.visible=kk>0;if(kk>0){if(g===railway)g.scale.set(1,Math.max(.01,ease(kk)),1);else g.scale.setScalar(Math.max(.001,backOut(kk)));}
   if(g.userData.base!==undefined&&g.visible){g.position.y=g.userData.base+Math.sin(t*1.5+g.position.x)*.12;}}
 peopleAt(t,true);
 plaza.userData.jets.forEach((j,i)=>{const a=i/10*Math.PI*2,ph=((t*1.2+i*.1)%1);j.position.set(Math.cos(a)*(1.3+ph*1.6),1.2+ph*2.4-ph*ph*2.4,Math.sin(a)*(1.3+ph*1.6));});
 kids.forEach(kd=>{const i=kd.userData.i;kd.position.y=.25+Math.abs(Math.sin(t*6+i))*.35;});
 police.userData.lt.material.color.set(Math.sin(t*12)>0?'#e8334f':'#2f7de1');
 pizzeria.userData.sign.rotation.y=t*1.5; watermill.userData.wheel.rotation.z=-t*1.2; lighthouse.userData.piv.rotation.y=t*1.6;
 { const cu=coaster.userData.curve,ph=(t*.09)%1;coaster.userData.cart.position.copy(cu.getPoint(ph));coaster.userData.cart.lookAt(cu.getPoint((ph+.004)%1)); }
 iceTruck.visible=false;
 { const a=t*.12;const c=L(0,30);jetliner.position.set(c.x+Math.cos(a)*190,95,c.z+Math.sin(a)*150);jetliner.lookAt(c.x+Math.cos(a+.05)*190,95,c.z+Math.sin(a+.05)*150);jetliner.rotateY(-Math.PI/2); }
 birds.forEach(b=>{const {i,wl,wr}=b.userData;const a=t*.25+i*.7;const R=60+(i%3)*20;const c=L(0,20);b.position.set(c.x+Math.cos(a)*R,52+(i%4)*6+Math.sin(t+i)*1.5,c.z+Math.sin(a)*R*.8);b.rotation.y=-a;const fl=Math.sin(t*10+i)*.5;wl.rotation.z=.35+fl;wr.rotation.z=-.35-fl;});
 karts.forEach((kt,i)=>{const a=t*(1.1+i*.07)+i*1.4;kt.position.set(Math.cos(a)*KA,0,Math.sin(a)*KB);kt.rotation.y=-Math.atan2(Math.cos(a)*KB,-Math.sin(a)*KA)+Math.PI/2;});
 siren.userData.head.rotation.y=t*.6; waves.forEach(w=>w.material.opacity=0);
 heli.visible=true;heli.position.copy(PAD);heli.rotation.y=FACE;heli.userData.rot.rotation.y=0;
 TAXI.forEach(g=>{const {v,ph,lane}=g.userData;const u=-60+(((t*9+ph)%130)+130)%130;g.position.copy(L(u,v+lane,.1));g.lookAt(L(u+2,v+lane,.1));});
 base.userData.rotor.children[2].rotation.y=t*6;base.userData.rotor.children[3].rotation.y=t*6;
 desert.userData.camels.forEach((c,i)=>{c.rotation.y=i*1.3+Math.sin(t*.6+i)*.5;});
 lab.userData.bub.forEach((b,i)=>{const ph=((t*.7+i/6)%1);b.position.set(Math.sin(i*2)*.6,7.6+ph*3,1+Math.cos(i*2)*.6);b.scale.setScalar(1-ph*.6);});
 { const w=fun.userData.wheel;w.rotation.z=t*.35;fun.userData.cabs.forEach((c,i)=>{const a=i/10*Math.PI*2;c.position.set(Math.cos(a)*7,Math.sin(a)*7-1,0);c.rotation.z=-w.rotation.z;});fun.userData.car.rotation.y=t*.8;
   fun.userData.mascots.forEach((m,i)=>{m.position.y=.15+Math.abs(Math.sin(t*4+i))*.6;}); }
 { const pl=court.userData.pl,bl=court.userData.ball;pl.forEach((p,i)=>{p.position.x=-3+i*2+Math.sin(t*2+i)*1.2;p.position.z=(i%2?1.5:-1.5)+Math.cos(t*1.7+i)*.8;});const ph=(t*.8)%1;const a=pl[Math.floor(t*.8)%4].position;bl.position.set(a.x,.6+Math.abs(Math.sin(ph*Math.PI*3))*1.6,a.z+.6); }
 // Day 7 life
 { const u0=trainU(t);train.forEach((c,i)=>{const u=u0-i*6.4;c.visible=railway.visible&&t>=10.2;const p=LW(u,RLV);c.position.set(p.x,RLY+.3,p.y);const q=LW(u+1,RLV);c.lookAt(q.x,RLY+.3,q.y);}); }
 station.userData.cat.rotation.y=Math.sin(t*1.3)*.8;station.userData.cat.children[4].rotation.z=Math.sin(t*6)*.4;
 king.visible=t>=17.6;if(king.visible){const kk=clamp((t-17.6)/.45);king.scale.setScalar(Math.max(.001,backOut(kk)));king.rotation.y=Math.sin(t*.8)*.6;}
 priestGrp.userData.pr.rotation.z=Math.sin(t*2)*.06;
 smith.userData.sm.rotation.x=Math.max(0,Math.sin(t*7))*.3;smith.userData.puffs.forEach((p,i)=>{const ph=((t*.35+i/5)%1);p.position.set(2.6+ph*1.5,7+ph*6,-1.4);p.scale.setScalar(.6+ph*1.6);p.material.opacity=.7*(1-ph);});
 smith.userData.sparks.forEach((p,i)=>{const ph=((t*1.6+i/8)%1);p.position.set(1.2+Math.sin(i*2.3)*ph*1.2,1.3+ph*1.4-ph*ph*1.6,3+Math.cos(i*2.3)*ph*1.2);p.visible=ph<.9;});
 cop.userData.lb.material.color.set(Math.sin(t*12)>0?'#e8334f':'#2f7de1');cop.userData.lb.material.emissive.set(Math.sin(t*12)>0?'#e8334f':'#2f7de1');
 { const tr2=captain.userData.tr;const on=Math.sin(t*14)>0;tr2.userData.lr.material.emissiveIntensity=on?2:0;tr2.userData.lb.material.emissiveIntensity=on?0:2; }
 navy.userData.sailor.rotation.y=Math.sin(t*1.2)*.4;
 { aheli.visible=t>=48.8;const a=t*.5;aheli.position.set(AH_C.x+Math.cos(a)*16,AH_C.y+20+Math.sin(t*1.3)*1.2,AH_C.z+Math.sin(a)*16);aheli.lookAt(AH_C.x+Math.cos(a+.1)*16,aheli.position.y,AH_C.z+Math.sin(a+.1)*16);aheli.userData.rot.rotation.y=t*25; }

 renderer.render(scene,camera);

 // ---------- UI ----------
 const used={c1:false,c2:false};
 for(const [id,a,b,txt] of caps){ if(t>=a&&t<=b){const el=$(id); if(el.dataset.txt!==txt){el.innerHTML=txt;el.dataset.txt=txt;} popAt(el,t,a,b); used[id]=true; } }
 for(const id in used) if(!used[id]) $(id).style.opacity=0;
 $('popn').textContent=Math.round(1464+2*ease(clamp((t-.6)/2.6))).toLocaleString('en-US');
 popAt($('votes'),t,4.6,9); const vk=ease(clamp((t-5.0)/1.0));
 $('barA').style.width=(100*vk)+'%'; $('barB').style.width='0%'; $('nA').textContent=Math.round(2*vk); $('nB').textContent='0';
 [...$('goals').children].forEach(el=>popAt(el,t,99,0));
 [...$('tags').children].forEach((el,i)=>{const [_,__,pf,a,b]=TAGS[i];const pp=proj(pf());el.dataset.base='translate(-50%,-100%)';const hw=el.offsetWidth/2+24;el.style.left=Math.min(1080-hw,Math.max(hw,pp[0]))+'px';el.style.top=Math.max(560+el.offsetHeight+18,pp[1])+'px';popAt(el,t,a,b);if(pp[2]>1)el.style.opacity=0;});
 [...$('laws').children].forEach((c,i)=>popAt(c,t,54.4+i*.6,DUR));
 let fl=0; for(const c of window.CUTS){ if(c>0&&tr>=c&&tr<c+.12) fl=.5*(1-(tr-c)/.12);} $('flash').style.opacity=fl;
};
window.DUR=RDUR; window.__T2={camera,renderer,scene,L,LW};
document.fonts.ready.then(()=>{window.setTime(0);window.READY=true;});
