// ===== CAPITAL CITY (Day 2 build) — shared by Day 2+ episodes =====
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

