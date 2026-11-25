// ===== HERBERG FC, DAY 2: Neck Hurts donates 8 billion → fix the pitch, nets, roof; Milan signs as striker (the pig becomes mascot),
// AetheriaNation at defender, the chef goes to Online Stranger's taco stand, OG seats (batangmakulit, RDA, Milan), PunzistTV's seat,
// ARDA gets seat Nº1, a new stand goes up, Day 3 vote: who do we play? =====
// ---------- money rain
const BILLS=[...Array(110)].map((_,i)=>{const m=box(1.8,.08,.9,i%4?std('#5dbb63'):M.gold,0,0,0);m.visible=false;m.userData={x:-34+((i*37)%68),z:-20+((i*23)%40),d:(i%17)/17*2.6,r:i};scene.add(m);return m;});
// ---------- nets (both goals), and the leaning goal straightened
function netTex(rx,ry){const c=document.createElement('canvas');c.width=c.height=128;const x=c.getContext('2d');x.strokeStyle='#ffffff';x.lineWidth=6;x.strokeRect(0,0,128,128);const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(rx,ry);return t;}
function addNet(goal,s){const mk=(w,h,rx,ry)=>new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshStandardMaterial({map:netTex(rx,ry),transparent:true,alphaTest:.3,side:THREE.DoubleSide,roughness:.9}));
 const n=new THREE.Group();const bk=mk(12.6,7.5,14,8);bk.position.set(s*4,3.75,0);bk.rotation.y=Math.PI/2;n.add(bk);const tp=mk(4,12.6,4,14);tp.rotation.x=-Math.PI/2;tp.position.set(s*2,7.5,0);n.add(tp);
 for(const z of [-6,6]){const sd=mk(4,7.5,4,8);sd.position.set(s*2,3.75,z);n.add(sd);}n.add(cyl(.12,.12,12.6,M.white,s*4,7.5,0,6).rotateX(Math.PI/2));n.visible=false;goal.add(n);return n;}
const NETL=addNet(goalL,-1),NETR=addNet(goalR,1);
// ---------- the roof gets patched
const patch=box(2.8,.5,10.7,std('#c9d3db',{metalness:.5,roughness:.35}),.85,9.5,0);patch.visible=false;CH.add(patch);
// ---------- MILAN signs as #9; the pig becomes the club mascot
const milan=person({num:'9',hair:'#2b1a10',skin:M.skin3});milan.position.set(15,0,-6);milan.rotation.y=Math.PI/2;milan.visible=false;scene.add(milan);
const sash=sign2('MASCOT','#f2c230','#1d232b',3.4,.9);sash.position.set(0,2.6,.92);striker.add(sash);const sash2=sash.clone();sash2.position.z=-.92;sash2.rotation.y=Math.PI;striker.add(sash2);sash.visible=sash2.visible=false;
// ---------- AETHERIANATION is the new #5 defender
const aeth=person({num:'5',hair:'#d8b04a',shirt:G});aeth.position.set(3,0,-6);aeth.rotation.y=Math.PI/2;aeth.visible=false;scene.add(aeth);
// ---------- ONLINE STRANGER's taco stand (the chef cooks there now)
const TACO=new THREE.Group();TACO.position.set(30,0,31);scene.add(TACO);TACO.visible=false;
TACO.add(box(10,3.4,4,std('#f4ead2'),0,1.7,0));TACO.add(box(10.4,.4,4.4,std('#e8334f'),0,3.5,0));
for(let k=0;k<6;k++)TACO.add(box(1.7,.3,3,k%2?M.white:std('#e8334f'),-4.3+k*1.72,6.4,-1.6).rotateX(-.35));
for(const x of [-4.8,4.8])TACO.add(cyl(.15,.15,6.4,M.metal,x,3.2,-2.8,6));
const tsg=sign2("STRANGER'S TACOS",'#2fa36b','#ffffff',9,1.4);tsg.position.set(0,7.6,-2.4);tsg.rotation.y=Math.PI;TACO.add(tsg);
const bigTaco=(()=>{const g=new THREE.Group();const sh=new THREE.Mesh(new THREE.CylinderGeometry(2,2,1.4,18,1,false,0,Math.PI),std('#f2c230'));sh.rotation.x=Math.PI/2;sh.rotation.z=Math.PI;g.add(sh);
 for(let k=0;k<7;k++)g.add(sph(.45,[std('#3fa34a'),std('#e8334f'),std('#8a5a33')][k%3],-1.5+k*.5,.1+Math.sin(k)*.15,0,8));g.position.set(0,9.2,-1);return g;})();TACO.add(bigTaco);
const stranger=person({shirt:'#5f646b',hair:'#1d232b'});stranger.position.set(-2,0,1.6);stranger.rotation.y=Math.PI/2;stranger.scale.setScalar(.7);TACO.add(stranger);
{const sg=box(.1,.5,1,std('#1d232b'),.62,4.3,0);stranger.add(sg);}// shades
for(let k=0;k<4;k++){const tc=new THREE.Group();const sh=new THREE.Mesh(new THREE.CylinderGeometry(.4,.4,.3,10,1,false,0,Math.PI),std('#f2c230'));sh.rotation.x=Math.PI/2;tc.add(sh);tc.add(sph(.18,std('#3fa34a'),0,.15,0,6));tc.position.set(-3+k*1.6,3.9,-1.2);TACO.add(tc);}
// ---------- the stand fills up: OG seats with names, PunzistTV, and ARDA in seat Nº1
const plate=(seat,txt)=>{const p=sign2(txt,'#f2c230','#1d232b',2.2,.6);p.position.set(0,.9,.47);p.rotation.y=Math.PI;p.visible=false;seat.add(p);return p;};
const OGS=[[4,'BATANG'],[5,'RDA'],[7,'MILAN']].map(([i,n])=>({i,p:plate(SEATS[i],n)}));
ogPlate.visible=false;const ardaPlate=plate(SEATS[6],'Nº1 ARDA');const punzPlate=plate(SEATS[9],'PUNZIST');
function fan(col,hair){const p=person({shirt:col,hair});p.scale.setScalar(.38);p.userData.legs.forEach(l=>l.rotation.z=1.45);p.rotation.y=Math.PI/2;p.visible=false;ST.add(p);return p;}
const seatFan=(i,col,hair)=>{const f=fan(col,hair);const s=SEATS[i].position;f.position.set(s.x,s.y-.72,s.z+.05);return f;};
const FANS={4:seatFan(4,'#e8334f','#1d232b'),5:seatFan(5,'#0f5c8c','#3b2a1c'),7:seatFan(7,G,'#2b1a10'),9:seatFan(9,'#9b59d6','#e8c35a'),6:seatFan(6,'#f2c230','#1d232b')};
FANS[6].userData.head.add(cyl(.75,.8,.5,M.gold,0,1.15,0,10));// ARDA: first fan crown
// ---------- the new stand across the pitch (paid for by Neck Hurts)
const NS=new THREE.Group();NS.position.set(0,0,-(PW/2+9));NS.rotation.y=Math.PI;scene.add(NS);NS.visible=false;
const conc=std('#cfd3d6'),TIERS=[];for(let r=0;r<7;r++){const t=box(46,1.4,3,conc,0,.7+r*1.6,r*3);t.userData.r=r;NS.add(t);TIERS.push(t);}
const SCAF=[];for(let k=0;k<8;k++)for(const z of [0,18]){const p=cyl(.18,.18,16,std('#f2a33a'),-24+k*6.8,8,z-1,6);NS.add(p);SCAF.push(p);}
for(let y=4;y<16;y+=4)for(const z of [-1,17])NS.add(box(48,.25,.25,std('#f2a33a'),0,y,z));
const crane=new THREE.Group();crane.add(box(1.6,40,1.6,std('#f2c230'),0,20,0));const jib=new THREE.Group();jib.add(box(34,1.2,1.2,std('#f2c230'),8,0,0));jib.add(box(4,3,3,M.dark,-8,-1,0));
const hook=box(.2,8,.2,M.dark,20,-4,0);jib.add(hook);const load=box(4,1.2,3,conc,20,-8.6,0);jib.add(load);jib.position.y=40;crane.add(jib);crane.position.set(28,0,10);NS.add(crane);
const nsg=sign2('THE NECK HURTS STAND','#1f8a4c','#ffffff',22,2.6);nsg.position.set(0,3,-1.8);nsg.rotation.y=Math.PI;NS.add(nsg);
const soon=sign2('COMING SOON','#f2c230','#1d232b',10,2);soon.position.set(0,13,-1.4);soon.rotation.y=Math.PI;NS.add(soon);
const WORK=[...Array(4)].map((_,k)=>{const w=person({shirt:'#ff8a2a',hair:null});w.userData.head.add(cyl(1.05,1.15,.6,std('#f2c230'),0,.6,0,12));w.scale.setScalar(.6);w.position.set(-14+k*9,0,-4);w.rotation.y=-Math.PI/2;NS.add(w);return w;});
const SPARK2=[...Array(18)].map(()=>{const s=new THREE.Mesh(new THREE.OctahedronGeometry(.5,0),new THREE.MeshBasicMaterial({color:'#fff6b0'}));s.visible=false;scene.add(s);return s;});
NS.traverse(o=>{if(o.isMesh)o.castShadow=true;});TACO.traverse(o=>{if(o.isMesh)o.castShadow=true;});
