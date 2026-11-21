// ===== DAY 9: the R32 highway wins + your requests + "share to grow the island" =====
// (make_day9.py prepends the Day 5 + Day 6 + Day 7 + Day 8 builds, all already standing)
POP8.forEach(g=>{g.userData.t=-1;});
const POP9=[];
function at9(g,u,v,t,rot=0,y0=0,clr=8){place(g,u,v,t,rot,y0);POP9.push(g);clearCrowd(u,v,clr);return g;}
function add9(g,t){g.userData.t=t;g.visible=false;scene.add(g);POP9.push(g);return g;}
const conc=std('#c9c5bc'),conc2=std('#a9a59c'),ylw=std('#f2c230'),tglass=std('#7fc3e8',{roughness:.1,metalness:.2,transparent:true,opacity:.55});
const gy=(u,v)=>L(u,v).y;
const dirAt=(a,b)=>Math.atan2(-(b.z-a.z),b.x-a.x);              // rotation.y that points local +x from a to b
function miniCar(c){const g=new THREE.Group();g.add(box(3.2,1,1.6,std(c),0,.7,0));g.add(box(1.7,.8,1.45,MT.glass,-.2,1.5,0));for(const x of [-1,1])for(const z of [-.8,.8]){const w=cyl(.36,.36,.25,MT.dark,x*1.05,.36,z,10);w.rotation.x=Math.PI/2;g.add(w);}g.traverse(o=>o.castShadow=true);return g;}

// ---------- 🛣️ R32 HIGHWAY (vote winner, idea by @k17.gaming): an elevated 6-lane highway across the whole island
const HV=72;let HB9=-99;for(let u=-100;u<=100;u+=4)HB9=Math.max(HB9,gy(u,HV));HB9+=10;
const deckY=u=>{const a=Math.abs(u);if(a<=100)return HB9;const k=clamp((a-100)/24);const s=k*k*(3-2*k);return HB9+(gy(u,HV)+.4-HB9)*s;};
const HW=[];
for(let u=-124;u<122;u+=4){const a=L(u,HV),b=L(u+4,HV);const y0=deckY(u),y1=deckY(u+4);const g=new THREE.Group();
 const len=Math.hypot(b.x-a.x,b.z-a.z,y1-y0)+.15;const dk=new THREE.Group();dk.add(box(len,.8,11,MT.road,0,0,0));for(const z of [-5.4,5.4])dk.add(box(len,1,.4,conc,0,.6,z));dk.add(box(len,.5,.5,conc,0,.4,0));
 for(const z of [-3.6,-1.8,1.8,3.6])dk.add(box(len*.45,.03,.16,MT.line,0,.42,z));dk.rotation.z=Math.atan2(y1-y0,len);g.add(dk);
 const gr=gy(u+2,HV);const ph=(y0+y1)/2-gr;if(((u+124)/4)%3===0&&ph>1.2){for(const z of [-3,3])g.add(cyl(.8,.9,ph,conc2,0,-ph/2,z,10));g.add(box(1.6,1,9,conc2,0,-.9,0));}
 g.position.set((a.x+b.x)/2,(y0+y1)/2,(a.z+b.z)/2);g.rotation.y=dirAt(a,b);g.traverse(o=>o.castShadow=true);add9(g,5.0+(u+124)/246*3.2);HW.push(g);}
// overhead R32 sign
const r32sign=(()=>{const u=-40,a=L(u,HV),b=L(u+1,HV);const g=new THREE.Group();for(const z of [-5.6,5.6])g.add(box(.5,7,.5,MT.dark,0,3.5,z));g.add(box(.6,.6,11.8,MT.dark,0,6.8,0));
 const s=sign('R32 HIGHWAY','#1f7a3a','#ffffff',9,1.8);s.position.set(-.35,5.6,0);s.rotation.y=-Math.PI/2;g.add(s);const s2=sign('R32 HIGHWAY','#1f7a3a','#ffffff',9,1.8);s2.position.set(.35,5.6,0);s2.rotation.y=Math.PI/2;g.add(s2);
 g.position.set(a.x,deckY(u)+.4,a.z);g.rotation.y=dirAt(a,b);return add9(g,6.6);})();
const HCARS=['#e8334f','#2f7de1','#f2d33a','#ffffff','#7bd65b','#ff8a4c','#9b59d6','#3b3b3b','#e85d75','#3fb5b0'].map((c,i)=>{const g=miniCar(c);g.userData={i,lane:[-4.5,-2.7,-.9,.9,2.7,4.5][i%6],ph:i*27};g.visible=false;scene.add(g);return g;});
function hcarsAt(t){HCARS.forEach(g=>{const {lane,ph}=g.userData;const dir=lane<0?1:-1;const sp=16;let u=-118+((((t-6.5)*sp*(dir>0?1:1)+ph)%236)+236)%236;if(dir<0)u=118-(u+118);
  g.visible=t>6.8;const p=L(u,HV+lane*.92),q=L(u+dir,HV+lane*.92);g.position.set(p.x,deckY(u)+.42,p.z);g.rotation.y=dirAt(p,q);});}

// ---------- 🗼 KINGDOM TOWER (AB_22): the tallest tower in Herberg
const KU9=-112,KV9=46;clearTrees([[KU9-16,KU9+16,KV9-16,KV9+16]]);
const ktower=at9((()=>{const g=slab(26,26,'#cfc8bb',KU9,KV9);const T=g.userData.top;const silver=std('#cfd8e0',{metalness:.55,roughness:.25}),band=std('#6f8aa3',{metalness:.4,roughness:.3});
 g.add(box(20,4,20,std('#e9e4da'),0,T+2,0));const Hh=118,R0=11,R1=1.4;const body=cyl(R1,R0,Hh,silver,0,T+4+Hh/2,0,3);g.add(body);
 for(let k=1;k<12;k++){const y=k*Hh/12;const r=R0-(R0-R1)*y/Hh;g.add(cyl(r+.25,r+.25,.6,band,0,T+4+y,0,3));}
 {const y=Hh*.8,r=R0-(R0-R1)*.8;g.add(cyl(r+3.2,r+3.2,.7,std('#ffffff'),0,T+4+y,0,24));}
 g.add(cyl(.05,.5,26,silver,0,T+4+Hh+13,0,8));g.add(new THREE.Mesh(new THREE.SphereGeometry(.5,8,6),std('#ff3b3b',{emissive:'#ff2020',emissiveIntensity:1.5})).translateY(T+4+Hh+26));
 const s=sign('KINGDOM TOWER','#1d2a3a','#f2c230',9,1.3);s.position.set(0,T+3,10.05);g.add(s);
 for(let i=0;i<5;i++){const p=pawn(['#e85d75','#3e8fe6','#f2d33a','#7bd65b','#9b59d6'][i],.8);p.position.set(-6+i*3,T,12);g.add(p);}
 g.userData.T=T;g.userData.top=T+4+Hh+26;g.traverse(o=>o.castShadow=true);return g;})(),KU9,KV9,10.0,0,0,15);

// ---------- 🏥 PET HOSPITAL (Orbit tree)
const PU=-84,PV=63;
const petHosp=at9((()=>{const g=new THREE.Group();g.add(box(12,5.4,7,std('#ffffff'),0,2.7,-1));g.add(box(12.4,.5,7.4,std('#3fb5b0'),0,5.6,-1));g.add(box(5,2.8,.08,MT.glass,-2.5,1.6,2.53));
 const s=sign('PET HOSPITAL','#3fb5b0','#ffffff',6,1);s.position.set(0,4.4,2.56);g.add(s);
 const cr=new THREE.Group();cr.add(box(2.4,.7,.3,std('#e8334f'),0,0,0));cr.add(box(.7,2.4,.3,std('#e8334f'),0,0,0));cr.position.set(4,2.4,2.6);g.add(cr);
 g.add(box(2,.12,1.6,std('#ffffff'),2,4.2+2.4,-1));
 const vet=pawn('#ffffff',1);vet.add(box(.62,.08,.06,blk,0,1.3,.31));vet.position.set(1.2,0,4.4);g.add(vet);
 g.add(box(2.4,1,1.4,std('#c0c6cc'),-1.6,.5,4.6));const pt=dog(.5,'#c98a4b');pt.position.set(-1.9,1,4.6);g.add(pt);
 const cone=new THREE.Mesh(new THREE.CylinderGeometry(.38,.14,.32,12,1,true),std('#ffffff',{side:THREE.DoubleSide,transparent:true,opacity:.85}));cone.rotation.z=Math.PI/2;cone.position.set(.55,.72,0);pt.add(cone);
 const kt=kitty('#9a9a9a',.9);kt.position.set(-1.2,1,4.4);g.add(kt);kt.add(box(.36,.1,.42,std('#ffffff'),.42,.62,0));
 const amb=new THREE.Group();amb.add(box(4.4,2.2,2.2,std('#ffffff'),0,1.4,0));amb.add(box(4.42,.4,2.22,std('#3fb5b0'),0,1.4,0));amb.add(box(1,.25,.4,std('#e8334f',{emissive:'#e8334f',emissiveIntensity:1}),0,2.6,0));
 for(const x of [-1.4,1.4])for(const z of [-1.1,1.1]){const w=cyl(.4,.4,.3,MT.dark,x,.4,z,10);w.rotation.x=Math.PI/2;amb.add(w);}amb.position.set(-7.6,0,3.6);g.add(amb);g.userData={pt,kt,vet,amb};
 g.traverse(o=>o.castShadow=true);return g;})(),PU,PV,14.0,0,0,8);

// ---------- 🌊 FLASH FLOOD (mr.nine.v.3) + the new flood walls that hold it back
const FG0=gy(0,8);
const floodW=(()=>{const g=new THREE.Group();const w=box(150,1,30,std('#3a8fd0',{transparent:true,opacity:.86,roughness:.15}),0,-.5,0);g.add(w);
 const foam=box(150,.12,1.2,std('#e9f6ff',{transparent:true,opacity:.9}),0,.02,-14.4);g.add(foam);const p=L(0,4);g.position.set(p.x,SEA,p.z);g.rotation.y=FACE;g.visible=false;scene.add(g);return g;})();
const FWALL=[];for(let u=-68;u<=68;u+=6){if(Math.abs(u+38)<5||Math.abs(u-40)<5)continue;const a=L(u,-5),b=L(u+1,-5);const g=new THREE.Group();g.add(box(6.05,4.4,1.2,conc,0,2.2,0));
 for(let k=0;k<3;k++){const st=box(1.6,.5,1.25,k%2?blk:ylw,-2+k*2,4.3,0);g.add(st);}g.position.set(a.x,Math.max(a.y,SEA)-3.4,a.z);g.rotation.y=dirAt(a,b);g.userData.y0=g.position.y;g.traverse(o=>o.castShadow=true);g.visible=false;scene.add(g);FWALL.push(g);}
const NR9=1400,rain9=new THREE.InstancedMesh(new THREE.BoxGeometry(.09,2.4,.09),new THREE.MeshBasicMaterial({color:'#d6e9ff',transparent:true,opacity:.65}),NR9);rain9.frustumCulled=false;scene.add(rain9);
const RD9=[...Array(NR9)].map((_,i)=>[((i*.6180339)%1-.5)*70,((i*.7548776)%1)*50,((i*.5698403)%1-.5)*70]);
function rain9At(t,k){const fw=new THREE.Vector3();camera.getWorldDirection(fw);const c=camera.position.clone().addScaledVector(fw,30);for(let i=0;i<NR9;i++){const [x,y,z]=RD9[i];let s=0;if(k>0&&(i/NR9)<k){_p.set(c.x+x,c.y-25+(((y-t*40)%50)+50)%50,c.z+z);s=_p.distanceTo(camera.position)>8?1:0;}_q.identity();_s.setScalar(s);_m.compose(_p,_q,_s);rain9.setMatrixAt(i,_m);}rain9.instanceMatrix.needsUpdate=true;}
const floodLvl=t=>{const up=ease(clamp((t-17.9)/1.9)),dn=ease(clamp((t-21.3)/1.4));return SEA-.6+(FG0+1.7-SEA+.6)*up*(1-dn);};
const wallK=t=>backOut(clamp((t-20.6)/.7));

// ---------- 🏰 MANKY'S MANSION
const MU=124,MV=92;clearTrees([[MU-20,MU+20,MV-16,MV+16]]);
const mansion9=at9((()=>{const g=slab(32,24,'#a9d67e',MU,MV);const T=g.userData.top;const wh=std('#fbf8f1'),gd=std('#d9b04a',{metalness:.5,roughness:.35});
 g.add(box(20,6,9,wh,0,T+3,-4));g.add(box(20.6,.5,9.6,gd,0,T+6.2,-4));g.add(box(13,4.6,7.5,wh,0,T+8.6,-4.5));g.add(box(13.6,.5,8.1,gd,0,T+11.1,-4.5));
 for(let k=0;k<6;k++){g.add(cyl(.35,.35,6,wh,-6.25+k*2.5,T+3,.9,10));}g.add(box(15,.6,1.6,wh,0,T+6.3,.9));
 for(let f=0;f<2;f++)for(let k=0;k<5;k++)g.add(box(1.6,f?1.8:2.4,.06,MT.glass,-6+k*3,T+(f?8.8:2.8),f?-.72:.47));
 g.add(box(12,.2,6,std('#e8e2d2'),0,T+.1,6));g.add(box(10,.16,4.4,std('#3fb6e8',{roughness:.12,metalness:.1}),0,T+.22,6));
 for(const x of [-13,13]){const tr=tree8(1.1);tr.position.set(x,T,6);g.add(tr);}const tr2=tree8(1.3);tr2.position.set(-13,T,-6);g.add(tr2);
 const car=miniCar('#e8334f');car.position.set(9.5,T,6.5);car.rotation.y=.4;g.add(car);
 const s=sign("MANKY'S MANSION",'#1d232b','#f2c230',8,1.1);s.position.set(0,T+5,.47+1.3);g.add(s);
 const mk=pawn('#9b59d6',1);mk.position.set(-2.5,T,3.6);mk.add(cyl(.3,.34,.35,gd,0,1.92,0,8));g.add(mk);g.userData={mk,T};
 g.traverse(o=>o.castShadow=true);return g;})(),MU,MV,24.0,0,0,14);

// ---------- 🗼 NEW AIR TRAFFIC CONTROL TOWER (D4SH.av)
const AU=27,AV=104;clearTrees([[AU-8,AU+8,AV-8,AV+8]]);
const atc=at9((()=>{const g=slab(10,10,'#cfc8bb',AU,AV);const T=g.userData.top;g.add(box(8,3,7,std('#e9f0f5'),0,T+1.5,0));
 g.add(cyl(1.5,2,22,std('#f4f4f4'),0,T+11,0,14));g.add(cyl(3.2,2.4,1,std('#e9f0f5'),0,T+22.4,0,10));
 const cab=cyl(3.3,2.9,3,std('#2d5f80',{roughness:.12,metalness:.35,transparent:true,opacity:.7}),0,T+24.4,0,10);g.add(cab);g.add(cyl(3.6,3.6,.5,std('#f4f4f4'),0,T+26.1,0,10));
 const ctl=pawn('#2f7de1',1);ctl.position.set(0,T+22.9,1.6);g.add(ctl);
 const rad=new THREE.Group();rad.add(box(.25,1.6,.25,MT.dark,0,.8,0));rad.add(box(3,.9,.2,std('#f4f4f4'),0,1.8,0));rad.position.set(0,T+26.3,0);g.add(rad);g.userData={rad,ctl};
 const bcn=new THREE.Mesh(new THREE.SphereGeometry(.3,8,6),std('#ff3b3b',{emissive:'#ff2020',emissiveIntensity:1.5}));bcn.position.set(0,T+28.6,0);g.add(bcn);g.userData.bcn=bcn;
 const s=sign('AIR TRAFFIC CONTROL','#2f7de1','#ffffff',7,.9);s.position.set(0,T+2.2,3.55);g.add(s);g.traverse(o=>o.castShadow=true);return g;})(),AU,AV,28.0,0,0,6);

// ---------- 🌲 JOHN'S WATCH TOWER in the forest (ג'ון אנג'לו, "day 2 of asking")
const WU=-96,WV=130;clearTrees([[WU-5,WU+5,WV-5,WV+5]]);
const watch9=at9((()=>{const g=new THREE.Group();const wd=std('#8a5a33'),wd2=std('#a8743f');const Hh=17;
 for(const x of [-2.4,2.4])for(const z of [-2.4,2.4]){const l=box(.6,Hh+.6,.6,wd,x*.8,Hh/2,z*.8);l.rotation.z=x*.035;l.rotation.x=-z*.035;g.add(l);}
 for(let k=1;k<4;k++){const y=k*Hh/4;for(const z of [-2,2]){g.add(box(4.4,.25,.25,wd2,0,y,z));g.add(box(.25,.25,4.4,wd2,z,y,0));}}
 g.add(box(7,.5,7,wd2,0,Hh,0));for(const s of [-3.4,3.4]){g.add(box(7,1,.18,wd,0,Hh+.75,s));g.add(box(.18,1,7,wd,s,Hh+.75,0));}
 g.add(box(4.2,3,4.2,std('#c98a4b'),0,Hh+1.75,-.6));g.add(box(1.6,1,.06,std('#ffe9a8',{emissive:'#ffd36b',emissiveIntensity:.8}),0,Hh+2,1.52));
 const rf=new THREE.Mesh(new THREE.ConeGeometry(3.8,2.4,4),std('#3d6b3a'));rf.rotation.y=Math.PI/4;rf.position.set(0,Hh+4.4,-.6);g.add(rf);
 for(let k=0;k<12;k++)g.add(box(1.2,.12,.12,MT.dark,0,1+k*1.35,2.9));for(const x of [-.6,.6])g.add(box(.12,Hh,.12,MT.dark,x,Hh/2,2.9));
 const fp=box(.12,4,.12,MT.dark,3.1,Hh+2.5,3.1);g.add(fp);const fl=sign('JOHN','#e8334f','#ffffff',1.8,1);fl.position.set(3.1+.9,Hh+3.9,3.1);g.add(fl);g.userData.fl=fl;
 const jn=pawn('#2f7de1',1);jn.position.set(1.4,Hh+.25,2.2);g.add(jn);g.userData.jn=jn;g.userData.H=Hh;
 g.traverse(o=>o.castShadow=true);return g;})(),WU,WV,32.0,0,0,5);

// ---------- 🚇 RDA METRO (RDA as BA Europe): an elevated metro line from the beach to the university
const MUu=-48;let MB=-99;for(let v=2;v<=98;v+=4)MB=Math.max(MB,gy(MUu,v));MB+=6;
const MTR=[];
for(let v=2;v<98;v+=4){const a=L(MUu,v),b=L(MUu,v+4);const g=new THREE.Group();g.add(box(4.15,.6,4.2,conc,0,0,0));for(const z of [-.8,.8])g.add(box(4.15,.18,.16,MT.dark,0,.38,z));
 for(const z of [-2.05,2.05])g.add(box(4.15,.5,.16,conc2,0,.5,z));const gr=gy(MUu,v+2);const ph=MB-gr;if(((v-2)/4)%3===1&&ph>1)g.add(cyl(.6,.7,ph,conc2,0,-ph/2,0,10));
 g.position.set((a.x+b.x)/2,MB,(a.z+b.z)/2);g.rotation.y=dirAt(a,b);g.traverse(o=>o.castShadow=true);add9(g,36.6+(v-2)/96*1.4);MTR.push(g);}
const MST=[27,63,95].map((v,i)=>{const a=L(MUu,v),b=L(MUu,v+1);const g=new THREE.Group();for(const z of [-3.5,3.5]){g.add(box(12,.5,2.6,std('#e9e4da'),0,.05,z));g.add(box(12,.25,2.8,std('#2f6fd6'),0,4.2,z));for(const x of [-5,0,5])g.add(box(.25,4,.25,MT.dark,x,2.2,z+(z>0?1.1:-1.1)));}
 const m=sign('M','#2f6fd6','#ffffff',1.8,1.8);m.position.set(0,6.3,0);m.rotation.y=Math.PI/2;g.add(m);const m2=sign('M','#2f6fd6','#ffffff',1.8,1.8);m2.position.set(0,6.3,0);m2.rotation.y=-Math.PI/2;g.add(m2);g.add(box(.2,1.8,.2,MT.dark,0,4.8,0));
 const s=sign(['BEACH','CITY','UNIVERSITY'][i],'#2f6fd6','#ffffff',4.4,.8);s.position.set(0,3.3,-4.85);g.add(s);const s2=sign('RDA METRO','#2f6fd6','#ffffff',4.4,.8);s2.position.set(0,3.3,4.85);g.add(s2);
 g.position.set(a.x,MB+.3,a.z);g.rotation.y=dirAt(a,b);g.traverse(o=>o.castShadow=true);return add9(g,37.6+i*.4);});
const mtrain=[0,1,2].map(i=>{const g=new THREE.Group();g.add(box(6.2,2.4,2.5,std('#f7f7f7'),0,1.6,0));g.add(box(6.22,.5,2.52,std('#2f6fd6'),0,1.05,0));g.add(box(5.4,.8,2.54,MT.glass,0,2.05,0));
 if(i==0)g.add(box(.2,1.2,2.2,MT.glass,3.1,1.9,0));const s=sign('RDA METRO','#2f6fd6','#ffffff',3,.55);s.position.set(0,1.05,1.27);g.add(s);g.traverse(o=>o.castShadow=true);g.visible=false;scene.add(g);return g;});
const mtV=t=>{const ph=((t*.11)%2+2)%2;const k=ph<1?ph:2-ph;return 8+84*(k*k*(3-2*k));};
function metroAt(t){const v0=mtV(t),dir=mtV(t+.05)>=v0?1:-1;mtrain.forEach((c,i)=>{const v=v0-dir*i*6.5;const p=L(MUu,v),q=L(MUu,v+dir);c.visible=t>38.2;c.position.set(p.x,MB+.3,p.z);c.rotation.y=dirAt(p,q);});}
const rdaTag=()=>{const c=mtrain[0];return c.position.clone().add(v3(0,4.5,0));};

// ---------- 🎓 HERBERG UNIVERSITY (RY#$U is the professor)
const UU=-76,UV=93;clearTrees([[UU-16,UU+16,UV-12,UV+12]]);
const uni=at9((()=>{const g=slab(30,22,'#9fd27a',UU,UV);const T=g.userData.top;const cr=std('#f2e6c9'),br=std('#c4573f');
 g.add(box(13,7,8,cr,0,T+3.5,-5));for(let k=0;k<6;k++)g.add(cyl(.38,.38,6.4,std('#ffffff'),-5+k*2,T+3.2,-.6,10));
 const ped=new THREE.Mesh(new THREE.CylinderGeometry(1.6,1.6,13.4,3),std('#ffffff'));ped.rotation.z=Math.PI/2;ped.rotation.x=Math.PI/2;ped.scale.set(1,1,.55);ped.position.set(0,T+7.3,-.9);g.add(ped);
 const dm=new THREE.Mesh(new THREE.SphereGeometry(3.4,18,10,0,Math.PI*2,0,Math.PI/2),std('#3fb5b0'));dm.position.set(0,T+7,-5);g.add(dm);g.add(cyl(.2,.2,1.6,ylw,0,T+11,-5,6));
 for(const x of [-10,10]){g.add(box(7,5.4,7,br,x,T+2.7,-5));g.add(box(7.4,.4,7.4,MT.white,x,T+5.6,-5));for(let k=0;k<2;k++)g.add(box(1.4,1.4,.06,MT.glass,x-1.5+k*3,T+3,-1.46));}
 const s=sign('HERBERG UNIVERSITY','#1d3f8a','#ffffff',8,1);s.position.set(0,T+8.4,.45);g.add(s);
 g.add(box(4.6,2.4,.2,std('#24433a'),0,T+2.4,2.2));g.add(box(5,.2,.4,std('#8a5a33'),0,T+1.15,2.2));
 const pr=pawn('#1d232b',1.05);pr.position.set(2.8,T,2.8);pr.add(box(.8,.08,.8,blk,0,1.95,0));pr.add(cyl(.22,.22,.2,blk,0,1.84,0,8));pr.add(box(.04,.4,.04,ylw,.38,1.75,.38));g.add(pr);
 const st=[];for(let r=0;r<2;r++)for(let k=0;k<5;k++){const p=pawn(['#e85d75','#3e8fe6','#f2d33a','#7bd65b','#9b59d6'][k],.72);p.position.set(-4+k*2,T,6+r*2);p.rotation.y=Math.PI;g.add(p);st.push(p);}
 g.userData={pr,st,T};g.traverse(o=>o.castShadow=true);return g;})(),UU,UV,41.0,0,0,12);

// ---------- 🏝️ the ending: the island is full, so share to make new islands
const ISL=[[-78,-128],[82,-124],[2,-172],[-104,-190],[106,-186],[-46,-232],[52,-230],[-132,-112]].map(([u,v],i)=>{const g=new THREE.Group();
 g.add(cyl(19,22,6,std('#e9d39a'),0,-1,0,18));g.add(cyl(14,16.5,2.2,std('#7cc95a'),0,2.4,0,16));for(let k=0;k<3;k++){const tr=tree8(1.2);const a=k*2.1+i;tr.position.set(Math.cos(a)*7,3.4,Math.sin(a)*7);g.add(tr);}
 g.add(box(.4,9,.4,MT.dark,0,7.5,0));const fl=sign('?','#f08a24','#ffffff',4,2.6);fl.position.set(2,10.6,0);g.add(fl);
 const c=document.createElement('canvas');c.width=512;c.height=150;const x=c.getContext('2d');x.fillStyle='#ffffff';x.beginPath();x.roundRect(6,6,500,138,40);x.fill();x.lineWidth=10;x.strokeStyle='#1d232b';x.stroke();
 x.fillStyle='#1d232b';x.font='900 66px Nunito, sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText('YOUR ISLAND?',256,80);
 const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(c),depthTest:false,fog:false}));sp.scale.set(38,11.2,1);sp.position.set(0,24,0);sp.renderOrder=10;g.add(sp);g.userData.sp=sp;
 const p=LW(u,v);g.position.set(p.x,SEA,p.y);g.userData.t=52.0+i*.42;g.visible=false;scene.add(g);return g;});
// extra on-screen elements for the ending
const fullEl=document.createElement('div');fullEl.id='full9';fullEl.textContent='FULL!';
fullEl.style.cssText='position:absolute;left:50%;top:930px;font-family:Lilita,Nunito;font-size:210px;color:#e8334f;border:16px solid #e8334f;border-radius:36px;padding:0 50px;background:rgba(255,255,255,.88);opacity:0;z-index:20;letter-spacing:6px';
fullEl.dataset.base='translate(-50%,-50%) rotate(-12deg)';document.body.appendChild(fullEl);
const shareEl=document.createElement('div');shareEl.id='share9';
shareEl.innerHTML='<svg viewBox="0 0 100 100" width="150" height="150"><path d="M58 18 L92 48 L58 78 L58 60 C34 60 20 68 8 86 C12 58 28 40 58 36 Z" fill="#ffffff" stroke="#1d232b" stroke-width="6" stroke-linejoin="round"/></svg>';
shareEl.style.cssText='position:absolute;right:46px;top:1020px;width:200px;height:200px;border-radius:50%;background:#f08a24;border:8px solid #1d232b;display:flex;align-items:center;justify-content:center;opacity:0;z-index:20;box-shadow:0 10px 0 rgba(0,0,0,.25)';
document.body.appendChild(shareEl);

const SH=[
 {t0:0,    t1:4.2,  p:[L(60,-150,120),L(66,-140,112)], l:[L(0,40,10),L(0,40,10)], f:46},
 {t0:4.2,  t1:9.2,  p:[L(-118,56,34),L(-104,58,36)], l:[L(-10,74,8),L(0,74,8)], f:50},
 {t0:9.2,  t1:13.2, p:[L(-66,-34,18),L(-70,-40,26)], l:[L(-112,46,52),L(-112,46,62)], f:58},
 {t0:13.2, t1:17.2, p:[L(-79,47,22),L(-80,49,19)], l:[L(-84,63,2),L(-84,63,2)], f:54},
 {t0:17.2, t1:23.2, p:[L(16,-36,16),L(12,-32,13)], l:[L(0,8,1),L(0,8,1)], f:54},
 {t0:23.2, t1:27.2, p:[L(110,56,28),L(114,60,24)], l:[L(124,91,5),L(124,91,5)], f:52},
 {t0:27.2, t1:31.2, p:[L(4,74,20),L(7,77,26)], l:[L(27,104,20),L(27,104,24)], f:54},
 {t0:31.2, t1:36.2, p:[L(-96,104,40),L(-96,113,30)], l:[L(-96,130,16),L(-96,130,17)], f:54},
 {t0:36.2, t1:40.2, metro:true, f:54},
 {t0:40.2, t1:44.2, p:[L(-77,62,36),L(-76,66,31)], l:[L(-76,93,4),L(-76,93,4)], f:54},
 {t0:44.2, t1:48.2, p:[L(0,50,330),L(0,50,352)], l:[L(0,51,0),L(0,51,0)], f:50},
 {t0:48.2, t1:58,   p:[L(0,40,370),L(0,-55,560)], l:[L(0,41,0),L(0,-54,0)], f:50},
];
const DUR=58;
const TD=[0,4.2,9.2,13.2,17.2,23.2,27.2,31.2,36.2,40.2,44.2,48.2,58];
const TR=window.DAY9_TR||TD, RDUR=TR[TR.length-1];
const pw=(x,A,B)=>{for(let i=0;i<A.length-1;i++)if(x<=A[i+1]||i==A.length-2)return B[i]+(B[i+1]-B[i])*clamp((x-A[i])/(A[i+1]-A[i]));};
const toD=tr=>pw(tr,TR,TD), toR=td=>pw(td,TD,TR);
const caps=[
 ['c1',.2,4.2,TXT.d0],['c1',4.2,9.2,TXT.d1],['c1',9.2,13.2,TXT.d2],['c1',13.2,17.2,TXT.d3],['c1',17.2,20.6,TXT.d4],['c1',20.6,23.2,TXT.d4b],['c1',23.2,27.2,TXT.d5],['c1',27.2,31.2,TXT.d6],
 ['c1',31.2,36.2,TXT.d7],['c1',36.2,40.2,TXT.d8],['c1',40.2,44.2,TXT.d9],['c1',44.2,48.2,TXT.d10],['c1',48.2,DUR,TXT.d11],['c2',51.6,DUR,TXT.d11b],
];
const wp=g=>g.getWorldPosition(v3(0,0,0));
const TAGS=[
 ['🛣️ R32 HIGHWAY','idea: @k17.gaming',()=>L(-30,HV,HB9-gy(-30,HV)+3),6.2,9.2],
 ['🗼 KINGDOM TOWER','AB_22',()=>L(KU9,KV9,30),10.4,13.2],
 ['🏥 PET HOSPITAL','Orbit tree',()=>L(PU,PV,8),14.2,17.2],
 ['🧱 FLOOD WALLS','mr.nine.v.3',()=>L(0,-5,6),21.0,23.2],
 ["🏰 MANKY'S MANSION",'manky',()=>L(MU,MV,18),24.2,27.2],
 ['🎧 AIR TRAFFIC CONTROL','D4SH.av',()=>L(AU,AV,34),28.2,31.2],
 ['🌲 WATCH TOWER','John Angelo',()=>wp(watch9.userData.jn).add(v3(0,3,0)),32.6,36.2],
 ['🚇 RDA METRO','RDA (as BA Europe)',rdaTag,38.4,40.2],
 ['🎓 PROFESSOR','RY#$U',()=>wp(uni.userData.pr).add(v3(0,3,0)),41.4,44.2],
];
$('tags').innerHTML=TAGS.map(t=>`<div class="ntag"><div class="tt">${t[0]}</div><div class="ts">${t[1]}</div></div>`).join('');
window.CAPTION_TIMES=[...new Set(caps.map(c=>c[1]))].concat(TAGS.map(t=>t[3]),[4.6,5.0,20.6,45.9,49.4,50.8,49.6],POP9.filter(g=>!HW.includes(g)&&!MTR.includes(g)).map(g=>g.userData.t),ISL.map(g=>g.userData.t)).map(toR);
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
 // moving things first
 { const fk=((t*.04)%2);const f=fk<1?fk:2-fk;const dir=fk<1?1:-1;const u=FERRY_A[0]+(FERRY_B[0]-FERRY_A[0])*ease(f),v=FERRY_A[1]+(FERRY_B[1]-FERRY_A[1])*ease(f);const p=LW(u,v);ferry.visible=true;
   ferry.position.set(p.x,SEA+.15+Math.sin(t*1.5)*.12,p.y);const q=LW(u+(FERRY_B[0]-FERRY_A[0])*.01*dir,v+(FERRY_B[1]-FERRY_A[1])*.01*dir);ferry.lookAt(q.x,ferry.position.y,q.y); }
 { jet.visible=true;const p=jetPos(t),q=jetPos(t+.05);jet.position.copy(p);jet.lookAt(q);jet.rotateZ(-.45);jet.userData.fl.scale.z=1+Math.sin(t*40)*.3; }
 if(sh.metro){metroAt(t);const c=mtrain[1].position,d=mtrain[0].position.clone().sub(c).normalize();const side=v3(-d.z,0,d.x);camera.position.copy(c).addScaledVector(d,-14+4*k).addScaledVector(side,-11).add(v3(0,6,0));camera.lookAt(c.clone().addScaledVector(d,6));}
 else {camera.position.lerpVectors(sh.p[0],sh.p[1],k); camera.lookAt(new THREE.Vector3().lerpVectors(sh.l[0],sh.l[1],k));}
 camera.fov=sh.f||46; camera.updateProjectionMatrix();
 clouds.forEach((c,i)=>{c.userData.bx??=c.position.x;c.position.x=c.userData.bx+t*1.4*(i%2?1:-1);});
 smoke.forEach((b,i)=>{const ph=((t*.12+i/smoke.length)%1);b.position.set(V.x+ph*20+Math.sin(i*3)*3,H(V.x,V.y)+5+ph*40,V.y-ph*9);b.scale.setScalar(.9+ph*3);b.material.opacity=.6*(1-ph);});
 lava.material.color.setHSL(.06,1,.5+.06*Math.sin(t*4));
 ghosts.forEach(g=>g.visible=false); pawns.forEach(p=>p.visible=false); flagGrp.visible=false; siteA.visible=siteB.visible=false;
 cutAt(t);
 for(const g of roadParts)g.visible=true;
 for(const g of NEW){ if(POP9.includes(g))continue; g.visible=true;g.scale.setScalar(1);
   if(g.userData.base!==undefined){g.position.y=g.userData.base+Math.sin(t*1.5+g.position.x)*.15;g.rotation.z=Math.sin(t*1.2+g.position.z)*.04;}}
 for(const g of POP){g.visible=true;g.scale.setScalar(1);}
 for(const g of POP7){g.visible=true;g.scale.setScalar(1);if(g.userData.base!==undefined){g.position.y=g.userData.base+Math.sin(t*1.5+g.position.x)*.12;}}
 for(const g of POP8){g.visible=true;g.scale.setScalar(1);}
 for(const g of POP9){const kk=clamp((t-g.userData.t)/.5);g.visible=kk>0;if(kk>0)g.scale.setScalar(Math.max(.001,backOut(kk)));}
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
 // Day 7 life (all standing now)
 { const u0=-72+((t*14)%164);train.forEach((c,i)=>{const u=u0-i*6.4;c.visible=true;const p=LW(u,RLV);c.position.set(p.x,RLY+.3,p.y);const q=LW(u+1,RLV);c.lookAt(q.x,RLY+.3,q.y);}); }
 station.userData.cat.rotation.y=Math.sin(t*1.3)*.8;station.userData.cat.children[4].rotation.z=Math.sin(t*6)*.4;
 king.visible=true;king.scale.setScalar(1);king.rotation.y=Math.sin(t*.8)*.6;
 smith.userData.puffs.forEach((p,i)=>{const ph=((t*.35+i/5)%1);p.position.set(2.6+ph*1.5,7+ph*6,-1.4);p.scale.setScalar(.6+ph*1.6);p.material.opacity=.7*(1-ph);});
 smith.userData.sparks.forEach((p,i)=>{const ph=((t*1.6+i/8)%1);p.position.set(1.2+Math.sin(i*2.3)*ph*1.2,1.3+ph*1.4-ph*ph*1.6,3+Math.cos(i*2.3)*ph*1.2);p.visible=ph<.9;});
 cop.userData.lb.material.color.set(Math.sin(t*12)>0?'#e8334f':'#2f7de1');cop.userData.lb.material.emissive.set(Math.sin(t*12)>0?'#e8334f':'#2f7de1');
 { const tr2=captain.userData.tr;const on=Math.sin(t*14)>0;tr2.userData.lr.material.emissiveIntensity=on?2:0;tr2.userData.lb.material.emissiveIntensity=on?0:2; }
 { aheli.visible=true;const a=t*.5;aheli.position.set(AH_C.x+Math.cos(a)*16,AH_C.y+20+Math.sin(t*1.3)*1.2,AH_C.z+Math.sin(a)*16);aheli.lookAt(AH_C.x+Math.cos(a+.1)*16,aheli.position.y,AH_C.z+Math.sin(a+.1)*16);aheli.userData.rot.rotation.y=t*25; }
 // Day 8 life
 { const z=zoo.userData;z.L1.userData.hd.rotation.z=Math.max(0,Math.sin(t*1.4))*.35;z.L2.rotation.y=2.4+Math.sin(t*.7)*.5;z.E1.userData.hd.rotation.z=Math.sin(t*1.8)*.18;z.E2.position.x=12+Math.sin(t*.5)*1.2;
   z.G1.userData.nk.rotation.z=-.25+Math.sin(t*1.1)*.12;z.G2.userData.nk.rotation.z=-.25+Math.sin(t*.9+1)*.12;z.pens.forEach((p,i)=>{p.rotation.z=Math.sin(t*6+i)*.15;p.position.x=-13.5+i*1.1+Math.sin(t*.8+i)*.4;});
   z.mk.position.y=z.T+4.2+Math.abs(Math.sin(t*3))*.6;z.kp.rotation.y=Math.sin(t*1.2)*.5;z.vis.forEach((v,i)=>{v.position.y=z.T+Math.abs(Math.sin(t*4+i))*.12;}); }
 garlic.userData.ct.userData.tl.rotation.z=.8+Math.sin(t*3)*.4;
 doctor.userData.d.rotation.y=Math.sin(t*1.5)*.4;
 { const o=orph.userData;o.seat.rotation.x=Math.sin(t*2.2)*.6;o.kids.forEach((kd,i)=>{kd.position.y=o.T+Math.abs(Math.sin(t*5+i))*.4;}); }
 phones.userData.big.rotation.y=t*1.2;
 { const h=high.userData;const ph=(t*.9)%1;h.ball.position.set(-1+ph*6.5,.6+Math.sin(ph*Math.PI)*3.2,6.4+ph*2.2);h.st.forEach((p,i)=>{p.position.y=Math.abs(Math.sin(t*5+i))*.25;}); }
 { const P=pool.userData;const ph=((t-37.6)*.45)%1;const jp=ph<.5?ph/.5:1;P.hd.position.set(0,ph<.5?1.95+Math.sin(jp*Math.PI)*1.6-jp*1.6:-.6+Math.sin(t*3)*.08,-4.4+jp*3.6);P.hd.rotation.x=ph<.5?jp*2.4:0;
   P.sw.forEach((p,i)=>{p.position.x=-5+i*3.2+Math.sin(t*.9+i)*1.6;p.position.y=-.6+Math.sin(t*3+i)*.08;}); }
 { const d=blueTower.userData.dg;d.userData.tl.rotation.z=.5+Math.sin(t*9)*.5;d.userData.hd.rotation.y=Math.sin(t*.8)*.5; }
 { const s=swat.userData;s.lb.material.emissiveIntensity=Math.sin(t*14)>0?2:.2;s.team.forEach((p,i)=>{p.rotation.y=Math.sin(t*1.5+i)*.3;}); }
 { const P=pets.userData;P.pups.forEach((d,i)=>{d.userData.tl.rotation.z=.5+Math.sin(t*10+i)*.6;d.position.y=Math.abs(Math.sin(t*4+i*1.3))*.25;});P.kits.forEach((k,i)=>{k.userData.tl.rotation.z=.8+Math.sin(t*3+i)*.4;}); }

// Day 9 life
 hcarsAt(t); metroAt(t);
 { const lv=floodLvl(t);floodW.visible=t>17.7&&t<23.2;floodW.position.y=lv;floodW.children[1].position.z=-14.4+Math.sin(t*3)*.4;
   const wk=wallK(t);FWALL.forEach(w=>{w.visible=t>20.5;w.position.y=w.userData.y0+3.4*Math.min(1,wk)+(wk>1?(wk-1)*0:0);});
   const rk=clamp((t-17.4)/.6)*(1-clamp((t-22.4)/.6));rain9At(t,rk);sun.intensity=2.3*(1-.55*rk);scene.background.set('#8fd0ff').lerp(new THREE.Color('#6d7f8f'),rk); }
 { const far=t>=44.2;scene.fog.near=far?1400:420;scene.fog.far=far?2600:980; }
 ISL.forEach(g=>{const kk=clamp((t-g.userData.t)/.6);g.visible=kk>0;if(kk>0){g.scale.setScalar(Math.max(.001,1.5*backOut(kk)));g.position.y=SEA-9+9*ease(kk);g.userData.sp.material.opacity=clamp((t-g.userData.t-.3)/.3);}});
 { const P=petHosp.userData;P.pt.userData.tl.rotation.z=.5+Math.sin(t*9)*.5;P.vet.rotation.y=Math.sin(t*1.4)*.5;P.amb.children[2].material.emissiveIntensity=Math.sin(t*12)>0?2:.2; }
 mansion9.userData.mk.rotation.y=Math.sin(t*1.1)*.6;
 atc.userData.rad.rotation.y=t*2.2;atc.userData.bcn.material.emissiveIntensity=Math.sin(t*5)>0?2:.2;
 watch9.userData.fl.rotation.y=Math.sin(t*2)*.25;watch9.userData.jn.rotation.y=Math.sin(t*.9)*.8;
 { const U=uni.userData;U.pr.rotation.y=Math.sin(t*1.3)*.5;U.st.forEach((p,i)=>{p.position.y=U.T+Math.max(0,Math.sin(t*3+i*1.7))*.15;}); }
 renderer.render(scene,camera);

 // ---------- UI ----------
 const used={c1:false,c2:false};
 for(const [id,a,b,txt] of caps){ if(t>=a&&t<=b){const el=$(id); if(el.dataset.txt!==txt){el.innerHTML=txt;el.dataset.txt=txt;} popAt(el,t,a,b); used[id]=true; } }
 for(const id in used) if(!used[id]) $(id).style.opacity=0;
 $('popn').textContent=(1466).toLocaleString('en-US');
 popAt($('votes'),t,4.6,9); const vk=ease(clamp((t-5.0)/1.0));
 $('barA').style.width=(100*vk)+'%'; $('barB').style.width=(50*vk)+'%'; $('nA').textContent=Math.round(2*vk); $('nB').textContent=Math.round(1*vk);
 [...$('goals').children].forEach(el=>popAt(el,t,99,0));
 [...$('tags').children].forEach((el,i)=>{const [_,__,pf,a,b]=TAGS[i];const pp=proj(pf());el.dataset.base='translate(-50%,-100%)';const hw=el.offsetWidth/2+24;el.style.left=Math.min(1080-hw,Math.max(hw,pp[0]))+'px';el.style.top=Math.max(560+el.offsetHeight+18,pp[1])+'px';popAt(el,t,a,b);if(pp[2]>1)el.style.opacity=0;});
 [...$('laws').children].forEach((c,i)=>popAt(c,t,49.4+i*1.4,51.9));
 popAt(fullEl,t,45.9,48.3,{inDur:.22}); { const on=t>=49.6; shareEl.style.opacity=on?1:0; if(on){const pz=1+.1*Math.max(0,Math.sin((t-49.6)*6)); shareEl.style.transform=`scale(${Math.min(1,(t-49.6)/.25)*pz})`;} }
 let fl=0; for(const c of window.CUTS){ if(c>0&&tr>=c&&tr<c+.12) fl=.5*(1-(tr-c)/.12);} $('flash').style.opacity=fl;
};
window.DUR=RDUR; window.__T2={camera,renderer,scene,L,LW};
document.fonts.ready.then(()=>{window.setTime(0);window.READY=true;});
