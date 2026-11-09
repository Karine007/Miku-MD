// ===== DAY 2 SCENE ADDITIONS (spliced into day2.html by make_day2.py) =====
// ---------- Herberg flag (tricolor by @radamel.falcao98: orange top = volcano, blue = ocean, green bottom = forests)
function tricolor(w=512,h=340){const c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');
 [['#f08a24',0],['#2f8fe0',1],['#4fbf3a',2]].forEach(([col,i])=>{x.fillStyle=col;x.fillRect(0,i*h/3,w,h/3+1);});return new THREE.CanvasTexture(c);}
const FLAG_TEX=tricolor();
flag.material.map=FLAG_TEX; flag.material.needsUpdate=true;

// ---------- city local frame around site A: u = along the coast, v = inland (+) / seaward (-)
const SEAWARD=new THREE.Vector2(SITE_A.x,SITE_A.y).normalize(); const ALONG=new THREE.Vector2(-SEAWARD.y,SEAWARD.x);
const CITY=SITE_A.clone().addScaledVector(SEAWARD,-2);
function LW(u,v){return new THREE.Vector2(CITY.x+ALONG.x*u-SEAWARD.x*v, CITY.y+ALONG.y*u-SEAWARD.y*v);}
function L(u,v,h=0){const p=LW(u,v);return new THREE.Vector3(p.x,Math.max(H(p.x,p.y),SEA)+h,p.y);}
const FACE=Math.atan2(-SEAWARD.x,-SEAWARD.y)+Math.PI; // buildings face the sea
const std=(c,o={})=>new THREE.MeshStandardMaterial(Object.assign({color:c,flatShading:true,roughness:.85},o));
const MT={wall:std('#f4ead2'),wall2:std('#ffd9b8'),wall3:std('#e9f0f5'),stone:std('#b9b3a6'),dark:std('#6f6a62'),wood:std('#8a5a33'),
 red:std('#d9473b'),blue:std('#3a78c9'),orange:std('#ee8a2a'),teal:std('#3fb5b0'),gold:std('#f2c230',{metalness:.5,roughness:.35}),
 pink:std('#f4a3b4'),barn:std('#b8382c'),white:std('#ffffff'),plaza:std('#d8d2c4'),road:std('#c9c1ae'),hull:std('#7a4a26'),sail:new THREE.MeshStandardMaterial({map:FLAG_TEX,side:THREE.DoubleSide})};
const box=(w,h,d,m,x=0,y=0,z=0)=>{const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);o.position.set(x,y,z);o.castShadow=o.receiveShadow=true;return o;};
const cyl=(r1,r2,h,m,x=0,y=0,z=0,s=10)=>{const o=new THREE.Mesh(new THREE.CylinderGeometry(r1,r2,h,s),m);o.position.set(x,y,z);o.castShadow=true;return o;};
const roof4=(w,h,m,y)=>{const o=new THREE.Mesh(new THREE.ConeGeometry(w*.75,h,4),m);o.rotation.y=Math.PI/4;o.position.y=y;o.castShadow=true;return o;};
const city=[]; // {g, t: reveal time}
function place(g,u,v,t,rot=0,sink=.3){const p=L(u,v);g.position.set(p.x,p.y-sink,p.z);g.rotation.y=FACE+rot;g.userData.t=t;g.visible=false;scene.add(g);city.push(g);return g;}
function flagOn(g,y,s=1){g.add(cyl(.06*s,.06*s,2.4*s,MT.wood,0,y+1.2*s,0,6));const f=new THREE.Mesh(new THREE.PlaneGeometry(1.5*s,1*s),new THREE.MeshStandardMaterial({map:FLAG_TEX,side:THREE.DoubleSide}));f.position.set(.78*s,y+1.9*s,0);g.add(f);return f;}

// plaza + roads
{ const g=new THREE.Group();const d=new THREE.Mesh(new THREE.CylinderGeometry(5.5,5.5,1.2,28),MT.plaza);d.position.y=.2;d.receiveShadow=true;g.add(d);place(g,0,0,19.6,0,.4); }
function road(u0,v0,u1,v1,t){const n=Math.ceil(Math.hypot(u1-u0,v1-v0)/1.5);for(let i=0;i<n;i++){const a=i/n,b=(i+1)/n;const um=u0+(u1-u0)*(a+b)/2,vm=v0+(v1-v0)*(a+b)/2;
 const g=new THREE.Group();const s=box(2,1,2.1,MT.road,0,0,0);s.receiveShadow=true;g.add(s);place(g,um,vm,t+i*.03,0,.5);
 const w0=LW(u0,v0),w1=LW(u1,v1);g.rotation.y=Math.atan2(w1.x-w0.x,w1.y-w0.y);}}
road(0,-5.5,3,-11,19.8); road(5.5,0,15,1,19.9); road(-5.5,0,-15,2,19.9); road(0,5.5,0,12,20); road(-2,12,-5,17,20.1);

// generic houses (the town)
function townHouse(i){const g=new THREE.Group();const w=2.2+(i*37%10)/10*1.4,d=2.2+(i*53%10)/10*1.2,h=1.8+(i*71%10)/10*1.3;
 g.add(box(w,h+2,d,[MT.wall,MT.wall2,MT.wall3][i%3],0,(h+2)/2-2,0));g.add(roof4(Math.max(w,d),1.5,[MT.red,MT.blue,MT.orange,MT.teal][i%4],h+.75));
 g.add(box(.6,1,.08,MT.wood,0,.5,d/2+.02));return g;}
const SPECIAL=[[0,0,7],[0,9,8],[-11,4,6],[9,-3,3.5],[13,2,3.5],[-5,17,7],[-16,-6,4],[3,-11,3]];
{ let i=0; for(let k=0;k<400&&i<30;k++){ const u=-22+((k*7919)%440)/10, v=-7+((k*104729)%300)/10; const p=LW(u,v);
   if(Math.max(H(p.x,p.y),0)<SEA+1.2) continue; if(Math.abs(u)<1.4||Math.abs(v)<1.2) continue;
   if(SPECIAL.some(s=>Math.hypot(u-s[0],v-s[1])<s[2]+2)) continue; if(city.some(c=>c.userData.uv&&Math.hypot(c.userData.uv[0]-u,c.userData.uv[1]-v)<3.6)) continue;
   const g=townHouse(i); place(g,u,v,19.9+i*.13,((k%4)-1.5)*.15); g.userData.uv=[u,v]; i++; } }

// parliament (@vachechu)
const parliament=(()=>{const g=new THREE.Group();g.add(box(12,6,7,MT.wall,0,1,0));g.add(box(13,.6,8,MT.stone,0,4.3,0));
 for(let i=0;i<6;i++)g.add(cyl(.35,.35,4,MT.white,-5+i*2,1.8,4.1,8));
 const ped=new THREE.Mesh(new THREE.CylinderGeometry(1.6,1.6,13,3),MT.white);ped.rotation.z=Math.PI/2;ped.rotation.x=Math.PI/2*0+0;ped.scale.set(1,1,.6);ped.position.set(0,5.2,4.0);ped.rotation.set(0,0,Math.PI/2);g.add(ped);
 g.add(cyl(2.4,2.4,1.6,MT.white,0,5.4,-.6,16));const dome=new THREE.Mesh(new THREE.SphereGeometry(2.4,16,10,0,Math.PI*2,0,Math.PI/2),MT.teal);dome.position.set(0,6.2,-.6);dome.castShadow=true;g.add(dome);
 g.add(box(4,.3,2,MT.stone,0,-.05,4.9));flagOn(g,8.5,1.3);return place(g,0,9,24.6,0,.5);})();
// houses #1 (@giorgito4) and #2 (@tuguldurtuguldur446)
const house1=(()=>{const g=townHouse(3);g.scale.setScalar(1.35);g.add(box(.2,1.4,.2,MT.wood,1.6,.7,1.9));return place(g,9,-3,29.0);})();
const house2=(()=>{const g=townHouse(6);g.scale.setScalar(1.35);return place(g,13,2,29.6);})();
// hall of honour (@halloweentime577)
const hall=(()=>{const g=new THREE.Group();g.add(box(7,5,5.5,MT.wall2,0,.5,0));g.add(roof4(7.8,3,MT.gold,4.5));
 for(let i=0;i<4;i++)g.add(cyl(.3,.3,3.4,MT.white,-2.4+i*1.6,1.5,3,8));
 for(const x of [-2.4,2.4]){const b=new THREE.Mesh(new THREE.PlaneGeometry(.9,2.2),std('#c0392b',{side:THREE.DoubleSide}));b.position.set(x,2.2,2.8);g.add(b);}
 return place(g,-11,4,33.0);})();
// statue (@hyperstat) on the plaza
const statue=(()=>{const g=new THREE.Group();g.add(box(2.2,2,2.2,MT.stone,0,.6,0));
 const body=new THREE.Mesh(new THREE.CapsuleGeometry(.55,1.2,6,12),MT.gold);body.position.y=2.75;const head=new THREE.Mesh(new THREE.SphereGeometry(.45,16,12),MT.gold);head.position.y=4.05;
 const arm=new THREE.Mesh(new THREE.CapsuleGeometry(.16,.9,4,8),MT.gold);arm.position.set(.55,3.6,0);arm.rotation.z=-.6;g.add(body,head,arm);g.traverse(o=>o.castShadow=true);return place(g,0,0,34.0,0,0);})();
// pork farm (@imuiuiaskmeanything)
const pigs=[];
const farm=(()=>{const g=new THREE.Group();const W=9,D=7;
 for(let i=0;i<=W;i++)for(const z of [-D/2,D/2])g.add(box(.15,1,.15,MT.wood,-W/2+i,.5,z));
 for(let i=0;i<=D;i++)for(const x of [-W/2,W/2])g.add(box(.15,1,.15,MT.wood,x,.5,-D/2+i));
 for(const z of [-D/2,D/2])g.add(box(W,.12,.08,MT.wood,0,.8,z)); for(const x of [-W/2,W/2])g.add(box(.08,.12,D,MT.wood,x,.8,0));
 const barn=new THREE.Group();barn.add(box(4,3.4,3.4,MT.barn,0,.7,0));barn.add(roof4(4.6,1.8,MT.dark,3.3));barn.add(box(1.4,1.8,.1,MT.white,0,.9,1.72));barn.position.set(-6.8,0,-.5);g.add(barn);
 const ground=new THREE.Mesh(new THREE.BoxGeometry(W,.6,D),std('#a3784c'));ground.position.y=-.15;g.add(ground);
 for(let i=0;i<6;i++){const p=new THREE.Group();const b=new THREE.Mesh(new THREE.CapsuleGeometry(.38,.7,6,10),MT.pink);b.rotation.z=Math.PI/2;b.position.y=.5;
  const h=new THREE.Mesh(new THREE.SphereGeometry(.32,12,10),MT.pink);h.position.set(.62,.65,0);const sn=cyl(.13,.13,.14,std('#e98aa0'),.92,.6,0,8);sn.rotation.z=Math.PI/2;
  p.add(b,h,sn);p.traverse(o=>o.castShadow=true);p.userData.i=i;g.add(p);pigs.push(p);}
 return place(g,-5,17,37.4,.2,.1);})();
// watchtower + commander (@dusan_rajic)
const tower=(()=>{const g=new THREE.Group();g.add(cyl(1.8,2.1,10,MT.stone,0,3,0,10));g.add(cyl(2.3,2.3,.6,MT.stone,0,8.3,0,10));
 for(let i=0;i<8;i++){const a=i/8*Math.PI*2;g.add(box(.6,.7,.6,MT.stone,Math.cos(a)*2,8.95,Math.sin(a)*2));}
 const cm=std('#2e6b3f');const b=new THREE.Mesh(new THREE.CapsuleGeometry(.32,.7,6,10),cm);b.position.y=9.3;const h=new THREE.Mesh(new THREE.SphereGeometry(.28,12,10),cm);h.position.y=10.15;g.add(b,h);
 flagOn(g,8.6,1.1);return place(g,-16,-6,41.4);})();
// pier + navy ship (@radamel.falcao98)
const pier=(()=>{const g=new THREE.Group();for(let i=0;i<12;i++){g.add(box(3,.25,1.3,MT.wood,0,0,-i*1.4));if(i%2==0)for(const x of [-1.4,1.4])g.add(cyl(.15,.15,3,MT.wood,x,-1.2,-i*1.4,6));}
 const p=L(3,-9.5);g.position.set(p.x,SEA+.55,p.z);g.rotation.y=FACE;g.userData.t=41.2;g.visible=false;scene.add(g);city.push(g);return g;})();
const ship=(()=>{const g=new THREE.Group();const hull=box(2.6,1.3,7,MT.hull,0,.3,0);g.add(hull);const bow=new THREE.Mesh(new THREE.ConeGeometry(1.3,2.2,4),MT.hull);bow.rotation.x=Math.PI/2;bow.rotation.y=Math.PI/4;bow.scale.set(1,1,.55);bow.position.set(0,.3,4.4);g.add(bow);
 g.add(box(2.4,.2,6.8,std('#c9a26b'),0,.98,0));g.add(cyl(.12,.15,6.5,MT.wood,0,4.2,.4,6));
 const sail=new THREE.Mesh(new THREE.PlaneGeometry(3.6,2.8,8,4),MT.sail);sail.rotation.y=Math.PI/2;sail.position.set(0,4.4,.4);g.add(sail);
 for(const z of [-1.8,0,1.8])for(const x of [-1.32,1.32]){const c=cyl(.16,.16,.7,MT.dark,x,.5,z,8);c.rotation.z=Math.PI/2;g.add(c);}
 const p=L(10,-27);g.position.set(p.x,SEA+.1,p.z);g.rotation.y=FACE+Math.PI/2+.3;g.userData.t=41.6;g.userData.base=g.position.clone();g.visible=false;scene.add(g);city.push(g);return g;})();

// trees inside the new city were already excluded (radius set in make_day2.py); hide day-1 ghost sites
siteA.visible=siteB.visible=false;

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
