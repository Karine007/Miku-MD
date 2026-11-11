// ===== REQUESTS PART 4: volcano village, rail, roads, river & industry (world coordinates) =====
// CLEAR: [[-29,0,15],[-22,-11,5],[-6,-14,7],[3,-19,8],[-50,-15,10],[-58,-4,11],[10,11,9],[28,7,8],[33,26,10],[-24,31,7],[-26,20,6],[-28,10,6],[-29,0,6],[-29,-9,7]]
const PRIOR=(()=>{const lv=window.LEVEL||0;return ()=>lv<(window.LEVEL||0);})();
const pawnMini=(c,s=.8)=>{const g=new THREE.Group();const m=std(c);const b=new THREE.Mesh(new THREE.CapsuleGeometry(.32,.7,4,8),m);b.position.y=.7;const h=new THREE.Mesh(new THREE.SphereGeometry(.27,10,8),m);h.position.y=1.55;g.add(b,h);g.traverse(o=>o.castShadow=true);g.scale.setScalar(s);return g;};
function sign(text,bg,fg,w=3,h=.8){const c=document.createElement('canvas');c.width=512;c.height=Math.round(512*h/w);const x=c.getContext('2d');x.fillStyle=bg;x.fillRect(0,0,c.width,c.height);
 x.fillStyle=fg;x.font=`bold ${Math.round(c.height*.6)}px Nunito, sans-serif`;x.textAlign='center';x.textBaseline='middle';x.fillText(text,c.width/2,c.height/2+4);
 return new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(c),side:THREE.DoubleSide}));}
const W=(x,z,h=0)=>v3(x,Math.max(H(x,z),SEA)+h,z);
function toUV(x,z){const dx=x-CITY.x,dz=z-CITY.y;return [dx*ALONG.x+dz*ALONG.y, -(dx*SEAWARD.x+dz*SEAWARD.y)];}
function placeW(g,x,z,t,rot=0,r=6){const [u,v]=toUV(x,z);return placeAt(g,u,v,t,rot,r);}
const DARK=std('#4a5058');

// ---------- volcano village on the safe south flank (@abu_alfuariq @bastiboy33 @melzenjorel · keeper @metallicmax2_reborn)
const VILLAGE=[[-38,-4],[-36,2],[-41,4],[-20,3],[-22,8],[-17,-2],[-35,8],[-42,-1]];
VILLAGE.forEach(([x,z],i)=>{const g=new THREE.Group();g.add(box(2.8,3.4,2.6,[std('#e2c9a0'),std('#cfb287'),MT.wall2][i%3],0,-.2,0));g.add(roof4(3.2,1.4,[MT.red,MT.dark,MT.orange][i%3],2.2));
 g.add(box(.5,.9,.08,MT.wood,0,.15,1.32));placeW(g,x,z,4.6+i*.25,(i*.7)%3,4);});
const keeper=placeW((()=>{const g=new THREE.Group();g.add(box(3,3,3,MT.stone,0,0,0));g.add(roof4(3.4,1.5,MT.red,2.2));const f=new THREE.Group();flagOn(f,0,1.1);f.position.set(1.8,0,0);g.add(f);
 const k=pawnMini('#e85d2a',1);k.position.set(0,-.2,2.4);g.add(k);return g;})(),-22,-11,6.8,0,4);
// house on the crater rim with the owner's name (@marryeyebrow)
const rim=placeW((()=>{const g=new THREE.Group();g.add(box(3.4,3,3,std('#3d3535'),0,.4,0));g.add(roof4(3.8,1.4,std('#d9473b'),2.6));
 const s=sign('@marryeyebrow','#1d1d1d','#ffcc2e',3.2,.7);s.position.set(0,1.1,1.52);g.add(s);return g;})(),-22,-19.6,11.6,Math.PI,3);
// weather & volcano watch station (@jairobojai @icedagger28)
const anemo=new THREE.Group();
const station=placeW((()=>{const g=new THREE.Group();g.add(box(4,3,3.4,MT.white,0,.3,0));const dome=new THREE.Mesh(new THREE.SphereGeometry(1.5,14,10),MT.white);dome.position.set(0,3.2,0);g.add(dome);
 g.add(cyl(.08,.08,5,DARK,2.4,2.5,0,5));for(let k=0;k<3;k++){const c=new THREE.Mesh(new THREE.SphereGeometry(.25,6,5,0,Math.PI),std('#e8334f'));c.position.set(Math.cos(k*2.1)*.6,0,Math.sin(k*2.1)*.6);anemo.add(c);}anemo.position.set(2.4,5,0);g.add(anemo);
 return g;})(),-6,-14,16.6,0,4);
// paleontologist's dino house next to the ruins (@shanelolxd)
const dino=placeW((()=>{const g=new THREE.Group();g.add(box(4,3,3.4,std('#d9c48a'),0,.3,0));g.add(roof4(4.4,1.3,std('#6b8e23'),2.4));
 const bone=std('#f3ecd8');const sk=new THREE.Group();sk.add(box(5,.35,.35,bone,0,1.8,0));for(let k=0;k<6;k++)sk.add(box(.18,1.1,.18,bone,-2+k*.8,1.3,0));sk.add(box(1.1,.7,.6,bone,3,2.2,0));sk.add(box(.3,1.5,.3,bone,-1.6,.8,0));sk.add(box(.3,1.5,.3,bone,1.4,.8,0));
 sk.position.set(0,0,4);g.add(sk);return g;})(),3,-19,17.4,Math.PI/2,5);
// ---------- railway from Vardia to the village (@luka.ostojic56 · station master @newhamm.william) + road (@led77263 @karlthegreat45 @siarieslangto)
const RAIL=[[-24,31],[-25,24],[-26,18],[-27,10],[-28,2],[-29,-8]].map(([x,z])=>W(x,z,.35));
const railCurve=new THREE.CatmullRomCurve3(RAIL);
const railG=new THREE.Group();railG.add(new THREE.Mesh(new THREE.TubeGeometry(railCurve,300,.32,5,false),DARK));
for(let i=0;i<=150;i++){const p=railCurve.getPoint(i/150),tg=railCurve.getTangent(i/150);const s=box(2.2,.18,.4,MT.wood,0,0,0);s.position.copy(p);s.position.y-=.15;s.lookAt(p.clone().add(tg));railG.add(s);}
railG.userData.t=21.2;railG.visible=false;scene.add(railG);city.push(railG);NEW.push(railG);
for(let i=0;i<=60;i++){const a=railCurve.getPoint(i/60);CROWD.forEach(p=>{if(Math.hypot(p.x-a.x,p.z-a.z)<5)p.hide=true;});}
const roadG=new THREE.Group();for(let i=0;i<=110;i++){const p=railCurve.getPoint(i/110),tg=railCurve.getTangent(i/110);const side=v3(-tg.z,0,tg.x).normalize().multiplyScalar(3.4);
 const q=p.clone().add(side);q.y=Math.max(H(q.x,q.z),SEA)+.1;const r=box(2.6,.25,1.9,MT.road,0,0,0);r.position.copy(q);r.lookAt(q.clone().add(tg));roadG.add(r);}
roadG.userData.t=21.6;roadG.visible=false;scene.add(roadG);city.push(roadG);NEW.push(roadG);
function stationModel(name){const g=new THREE.Group();g.add(box(7,3.4,3,MT.wall,0,.4,0));g.add(box(7.6,.4,4,std('#8a3a2a'),0,2.3,.4));g.add(box(8,.5,2,MT.stone,0,-.1,2.6));
 const s=sign(name,'#1d3f8a','#ffffff',5,.8);s.position.set(0,1.6,1.52);g.add(s);return g;}
const st1=railCurve.getPoint(0), st2=railCurve.getPoint(1);
const stationCity=placeW(stationModel('VARDIA'),st1.x+4,st1.z+1,21.8,0,6);
const stationVillage=placeW(stationModel('VOLCANO VILLAGE'),st2.x+4.5,st2.z+1,22.2,0,6);
const train=(()=>{const g=new THREE.Group();const loco=new THREE.Group();loco.add(box(1.8,1.7,4,std('#c0392b'),0,1,0));loco.add(cyl(.5,.5,1.2,DARK,0,2.3,1.2,10));loco.add(box(1.7,1,1.4,std('#2b2b2b'),0,2.1,-1.1));
 const cars=[loco];for(let k=0;k<2;k++){const c=new THREE.Group();c.add(box(1.7,1.7,3.6,std(k?'#2f7de1':'#f2c230'),0,1,0));for(let w=0;w<3;w++)c.add(box(1.72,.5,.6,std('#bfe3f5'),0,1.4,-1.1+w*1.1));cars.push(c);}
 cars.forEach(c=>{c.traverse(o=>o.castShadow=true);g.add(c);});g.userData.cars=cars;g.visible=false;scene.add(g);return g;})();
// ---------- volcano military base (@notthomash) + national park (@nottrr2324)
const base=placeW((()=>{const g=new THREE.Group();const ol=std('#6b7d3a');g.add(box(9,.4,9,MT.stone,0,-.2,0));g.add(box(5,2.6,3.6,ol,-1.5,1,-2));
 const r=new THREE.Mesh(new THREE.CylinderGeometry(1.8,1.8,5,12,1,false,0,Math.PI),ol);r.rotation.z=Math.PI/2;r.position.set(-1.5,2.3,-2);g.add(r);
 const tank=new THREE.Group();tank.add(box(2,.8,3,ol,0,.5,0));tank.add(box(1.3,.6,1.4,ol,0,1.2,-.2));const gun=cyl(.12,.12,2,DARK,0,1.25,1.2,6);gun.rotation.x=Math.PI/2;tank.add(gun);tank.position.set(2.6,0,1.6);g.add(tank);
 const pad=new THREE.Mesh(new THREE.CylinderGeometry(1.6,1.6,.1,16),std('#3a3a3a'));pad.position.set(-2,.05,2.6);g.add(pad);
 for(let k=0;k<4;k++){const s=pawnMini('#3f5a2a',.8);s.position.set(1+k*.9,0,-3.6);g.add(s);}return g;})(),-50,-15,27.6,0,7);
const park=placeW((()=>{const g=new THREE.Group();for(let i=0;i<10;i++){const a=i/10*Math.PI*2;g.add(box(.18,1,.18,MT.wood,Math.cos(a)*8,.3,Math.sin(a)*8));}
 for(let i=0;i<9;i++){const a=i*2.4,r=2+((i*37)%10)/10*5;const t=new THREE.Mesh(pineG,std('#2f7a3a',{flatShading:true}));t.position.set(Math.cos(a)*r,-.4,Math.sin(a)*r);t.scale.setScalar(.8);g.add(t);}
 const s=sign('NATIONAL PARK','#2e6b3f','#ffffff',4.4,.9);s.position.set(0,1.6,8.3);g.add(s);g.add(box(.15,1.6,.15,MT.wood,-2,.4,8.3));g.add(box(.15,1.6,.15,MT.wood,2,.4,8.3));
 const deer=new THREE.Group();const dm=std('#a0703a');const b=new THREE.Mesh(new THREE.CapsuleGeometry(.3,.8,4,8),dm);b.rotation.z=Math.PI/2;b.position.y=.9;deer.add(b);const h=new THREE.Mesh(new THREE.SphereGeometry(.25,8,6),dm);h.position.set(.6,1.3,0);deer.add(h);
 for(const [x,z] of [[-.3,-.15],[-.3,.15],[.3,-.15],[.3,.15]])deer.add(box(.1,.7,.1,dm,x,.35,z));deer.position.set(2,0,-2);g.add(deer);g.userData.deer=deer;return g;})(),-58,-4,28.4,0,9);
// ---------- dam on the river (@zen_plank08) + the river gets a name (@plen_n_nado)
const dam=placeW((()=>{const g=new THREE.Group();g.add(box(11,5,2,MT.stone,0,-.5,0));g.add(box(11.4,.5,2.4,std('#a8a092'),0,2.1,0));
 for(let k=-1;k<=1;k++){const w=new THREE.Mesh(new THREE.BoxGeometry(1.2,3,.2),std('#8fd3ff',{transparent:true,opacity:.85}));w.position.set(k*3,.5,1.15);g.add(w);}
 const ph=new THREE.Group();ph.add(box(3,2.4,2.4,MT.wall3,0,.6,0));ph.add(box(3.2,.3,2.6,DARK,0,1.9,0));ph.position.set(7,0,1);g.add(ph);return g;})(),10,11,33.0,-.55,6);
const riverSign=(()=>{const s=sign('THEIBURG RIVER','#2f7de1','#ffffff',8,1.3);const p=W(15,24,4.5);s.position.copy(p);s.lookAt(p.x+10,p.y,p.z+10);s.visible=false;scene.add(s);return s;})();
// ---------- industry: sawmill (@tiv_2220), truck factory (@nellokumag), workers (@graysprunki123 @failure5960)
const chim=[];
const sawmill=placeW((()=>{const g=new THREE.Group();g.add(box(6,3,4,std('#9c6b3c'),0,.3,0));g.add(roof4(6.4,1.4,MT.dark,2.5));for(let k=0;k<6;k++){const l=cyl(.35,.35,4,std('#8a5a33'),-2+k*.0,.35+k%3*.7,3.4,8);l.rotation.z=Math.PI/2;l.position.x=(k%2)*.6-.3;g.add(l);}
 const blade=new THREE.Mesh(new THREE.CylinderGeometry(.9,.9,.1,16),std('#c0c0c0'));blade.rotation.x=Math.PI/2;blade.position.set(3.3,1,0);g.add(blade);g.userData.blade=blade;return g;})(),28,7,38.6,0,6);
const factory=placeW((()=>{const g=new THREE.Group();g.add(box(9,4.4,6,std('#b6b8bc'),0,.6,0));for(let k=0;k<3;k++){const r=new THREE.Mesh(new THREE.CylinderGeometry(1.5,1.5,6,3,1,false,0,Math.PI),std('#8c939b'));r.rotation.x=Math.PI/2;r.rotation.y=Math.PI/2;r.position.set(-3+k*3,2.9,0);g.add(r);}
 g.add(cyl(.6,.8,7,std('#a0522d'),3.6,4,-2,10));const s=sign('TRUCKS','#2b2b2b','#ffcc2e',3.4,.8);s.position.set(-1,1.6,3.02);g.add(s);
 const truck=new THREE.Group();truck.add(box(1.6,1.4,1.6,std('#e8334f'),0,.9,1.8));truck.add(box(1.7,1.7,3,MT.white,0,1.05,-.6));truck.position.set(-3,0,5);g.add(truck);g.userData.truck=truck;
 for(let k=0;k<3;k++){const w=pawnMini(['#f2a33a','#ffcc2e','#ff8a4c'][k],.8);w.position.set(1+k*1.2,0,4);g.add(w);}return g;})(),33,26,39.4,0,7);
const fsmoke=[];for(let i=0;i<6;i++){const b=new THREE.Mesh(new THREE.IcosahedronGeometry(.9,1),new THREE.MeshStandardMaterial({color:'#bdbdbd',flatShading:true,transparent:true,opacity:.7}));b.visible=false;scene.add(b);fsmoke.push(b);}

ANIM.push(t=>{
 anemo.rotation.y=t*6;
 // train runs from Vardia up to the village
 const tk=PRIOR()?1:clamp((t-22.4)/4.2);train.visible=PRIOR()||t>=22.0;
 if(train.visible) train.userData.cars.forEach((c,k)=>{const s=Math.max(0,Math.min(1,.18+ease(tk)*.8-k*.035));const p=railCurve.getPoint(s),q=railCurve.getPoint(Math.min(1,s+.01));c.position.copy(p);c.lookAt(q.x,q.y,q.z);});
 const d=park.userData.deer;d.position.x=2+Math.sin(t*.6)*1.5;d.rotation.y=Math.cos(t*.6)>0?0:Math.PI;
 riverSign.visible=PRIOR()||t>=33.6;
 sawmill.userData.blade.rotation.y=t*12;
 const tr=factory.userData.truck;tr.position.x=-3+Math.sin(t*.7)*2;
 const fp=factory.getWorldPosition(v3(0,0,0));fsmoke.forEach((b,i)=>{const ph=((t*.25+i/fsmoke.length)%1);b.visible=factory.visible;b.position.set(fp.x+3+ph*3,fp.y+8+ph*7,fp.z-2);b.scale.setScalar(.6+ph*1.8);b.material.opacity=.7*(1-ph);});
});

const SEGS=[
 {t0:0,t1:4,p:[v3(40,150,120),v3(30,140,110)],l:[W(-22,-4,0),W(-22,-4,0)],f:48,
  caps:[['c1',.2,4,'You asked...<br><b>we built it</b>'],['c2',1.0,4,'Part <b>4</b> of 4<span class="sub">volcano village, rail & river</span>']]},
 {t0:4,t1:11,p:[W(-8,40,44),W(-10,36,42)],l:[W(-30,1,3),W(-30,0,3)],f:58,
  caps:[['c1',4.2,11,'A <b>volcano village</b> 🌋<br>for the brave ones']],
  tags:[['🏘️ VOLCANO HOUSES','@abu_alfuariq · @bastiboy33 · @melzenjorel',()=>W(-38,2,6),5.4,11],['🌋 VOLCANO KEEPER','@metallicmax2_reborn',()=>W(-22,-11,6),7.2,11]]},
 {t0:11,t1:16,p:[W(-12,0,62),W(-14,-3,60)],l:[W(-22,-19,1),W(-22,-19,1)],f:52,
  caps:[['c1',11.2,16,'A house <b>on the crater</b>...<br>with your name on it 😳']],
  tags:[['🏠 CRATER HOUSE','@marryeyebrow',()=>W(-22,-19.6,6),12.0,16]]},
 {t0:16,t1:21,p:[W(30,-4,30),W(28,-6,28)],l:[W(-1,-16,12),W(-1,-16,12)],f:55,
  caps:[['c1',16.2,21,'A <b>volcano watch</b> station<br>& a <b>dino house</b> 🦖']],
  tags:[['🌦️ WEATHER & VOLCANO WATCH','@jairobojai · @icedagger28',()=>W(-6,-14,8),17.0,21],['🦖 PALEONTOLOGIST','@shanelolxd',()=>W(3,-19,6),18.0,21]]},
 {t0:21,t1:27,p:[W(4,40,34),W(2,36,32)],l:[W(-26,16,6),W(-27,6,8)],f:58,
  caps:[['c1',21.2,27,'A <b>railway</b> 🚂<br>from Vardia to the village']],
  tags:[['🚂 RAILWAY','@luka.ostojic56',()=>train.userData.cars[0].position.clone().add(v3(0,4,0)),22.6,27],['🧑‍✈️ STATION MASTER','@newhamm.william',()=>W(st2.x+4.5,st2.z+1,6),23.6,27],['🛣️ ROADS','@led77263 · @karlthegreat45 · @siarieslangto',()=>W(-21,26,3),24.6,27]]},
 {t0:27,t1:32,p:[W(-86,-28,30),W(-84,-25,28)],l:[W(-54,-9,5),W(-54,-9,5)],f:58,
  caps:[['c1',27.2,32,'A <b>military base</b> 🪖<br>& a <b>national park</b> 🦌']],
  tags:[['🪖 VOLCANO BASE','@notthomash',()=>W(-50,-15,6),28.0,32],['🦌 NATIONAL PARK','@nottrr2324',()=>W(-58,-4,5),29.0,32]]},
 {t0:32,t1:38,p:[W(-4,36,38),W(-2,32,36)],l:[W(11,13,2),W(11,13,2)],f:58,
  caps:[['c1',32.2,35,'The river got a name...<br><b>Theiburg River</b> 🌊'],['c1',35.2,38,'Nuclear plant next to a volcano?<br>😅 we built a <b>dam</b> instead']],
  tags:[['🌊 RIVER NAME','@plen_n_nado',()=>W(15,24,7.4),33.6,38],['⚡ DAM','@zen_plank08 · @bratina1534',()=>W(10,11,5),35.4,38]]},
 {t0:38,t1:44,p:[W(58,-6,38),W(54,-4,36)],l:[W(30,16,2),W(30,16,2)],f:58,
  caps:[['c1',38.2,44,'<b>Sawmill</b> & a <b>truck factory</b> 🚚<br>jobs for everyone!']],
  tags:[['🪓 LUMBERJACK','@tiv_2220',()=>W(28,7,6),39.0,44],['🚚 TRUCK FACTORY','@nellokumag',()=>W(33,26,9),39.8,44],['👷 WORKERS','@graysprunki123 · @failure5960',()=>W(36,31,3),40.6,44]]},
 {t0:44,t1:52,p:[W(-10,150,190),W(-10,190,230)],l:[W(-14,0,10),W(-14,0,12)],f:46,
  caps:[['c1',44.2,52,'4 parts. <b>60+ requests</b>.<br>All built. 🏝️'],['c2',46.0,52,'Comment your next idea 👇<span class="sub">Day 4 vote: <b>Vellera</b> or <b>San Vista</b>?</span>']]},
];
