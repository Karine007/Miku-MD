// ===== REQUESTS PART 1: faith & public services =====
function sign(text,bg,fg,w=3,h=.8){const c=document.createElement('canvas');c.width=512;c.height=Math.round(512*h/w);const x=c.getContext('2d');x.fillStyle=bg;x.fillRect(0,0,c.width,c.height);
 x.fillStyle=fg;x.font=`bold ${Math.round(c.height*.62)}px Nunito, sans-serif`;x.textAlign='center';x.textBaseline='middle';x.fillText(text,c.width/2,c.height/2+4);
 return new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(c)}));}
function prism(w,h,len,m,y){const o=new THREE.Mesh(new THREE.CylinderGeometry(w/Math.sqrt(3),w/Math.sqrt(3),len,3),m);o.rotation.x=Math.PI/2;o.rotation.y=0;o.scale.set(1,h/(w*.5),1);o.rotation.z=Math.PI;o.position.y=y;o.castShadow=true;return o;}
const pawnMini=(c,s=.7)=>{const g=new THREE.Group();const m=std(c);const b=new THREE.Mesh(new THREE.CapsuleGeometry(.32,.7,4,8),m);b.position.y=.7;const h=new THREE.Mesh(new THREE.SphereGeometry(.27,10,8),m);h.position.y=1.55;g.add(b,h);g.scale.setScalar(s);return g;};

// church (@gellie96) — mosque (@stoopidsoup24, @dzak1r_) — side by side
const church=placeAt((()=>{const g=new THREE.Group();g.add(box(5,6,9,MT.white,0,1,0));
 const r=new THREE.Mesh(new THREE.ConeGeometry(3.9,2.6,4),MT.red);r.rotation.y=Math.PI/4;r.scale.set(.95,1,1.7);r.position.y=5.3;r.castShadow=true;g.add(r);
 g.add(box(2.6,10,2.6,MT.white,0,3,4.6));const sp=new THREE.Mesh(new THREE.ConeGeometry(1.8,3.6,4),MT.red);sp.rotation.y=Math.PI/4;sp.position.set(0,9.8,4.6);g.add(sp);
 g.add(box(.25,1.8,.25,MT.gold,0,12.4,4.6));g.add(box(1.1,.25,.25,MT.gold,0,12.7,4.6));g.add(box(1.2,2,.1,MT.wood,0,.6,5.95));
 for(const x of [-2.52,2.52])for(const z of [-2.5,0,2.5]){const w=box(.08,1.6,.9,std('#7fb6e8'),x,2.6,z);g.add(w);}return g;})(),-33,6,4.6,0,8);
const mosque=placeAt((()=>{const g=new THREE.Group();g.add(box(8,5,8,MT.wall,0,.5,0));g.add(cyl(2.8,2.8,1,MT.wall,0,3.5,0,16));
 const d=new THREE.Mesh(new THREE.SphereGeometry(3,18,12,0,Math.PI*2,0,Math.PI/2),std('#2f9e7a'));d.position.y=4;d.castShadow=true;g.add(d);g.add(cyl(.12,.12,1.2,MT.gold,0,7.4,0,6));
 g.add(new THREE.Mesh(new THREE.SphereGeometry(.3,10,8),MT.gold).translateY(8.1));
 for(const x of [-4.6,4.6]){g.add(cyl(.55,.65,11,MT.white,x,4.5,3.4,10));g.add(cyl(.8,.8,.4,MT.white,x,8.6,3.4,10));const c=new THREE.Mesh(new THREE.ConeGeometry(.6,1.6,10),std('#2f9e7a'));c.position.set(x,10.8,3.4);g.add(c);}
 g.add(box(2,2.6,.1,std('#2f9e7a'),0,.8,4.02));return g;})(),-33,19,7.8,0,8);
// school (@jairus_is_bro2, @dreror3098, head teacher @isoksekolahfairs)
const kids=[];
const school=placeAt((()=>{const g=new THREE.Group();const y=std('#f5d76e');g.add(box(10,5,4,y,0,.5,-2));g.add(box(4,5,6,y,-3,.5,2.5));
 g.add(roof4(10.5,1.6,MT.red,3.8).translateZ(-2));g.add(box(.9,.9,.1,MT.white,0,2.6,.02));const s=sign('SCHOOL','#ffffff','#2f7de1',4,.9);s.position.set(1.8,2.6,.05);g.add(s);
 const yard=new THREE.Mesh(new THREE.BoxGeometry(8,.3,6),std('#c9a26b'));yard.position.set(3,0,3.5);g.add(yard);
 for(let i=0;i<7;i++){const k=pawnMini(['#e85d75','#3e8fe6','#f2d33a','#7bd65b','#9b59d6','#ff8a4c','#30c2a8'][i],.55);k.position.set(1+((i*37)%7),.2,1.5+((i*53)%4));k.userData.i=i;g.add(k);kids.push(k);}
 const fp=new THREE.Group();flagOn(fp,0,1.4);fp.position.set(7,0,.5);g.add(fp);return g;})(),30,16,11.5,0,9);
// hospital (owner @ammar.983)
const hospital=placeAt((()=>{const g=new THREE.Group();g.add(box(9,7,7,MT.white,0,1.5,0));g.add(box(9.4,.5,7.4,std('#d7e3ea'),0,5.2,0));
 const r=std('#e8334f');g.add(box(2.2,.6,.2,r,0,3.3,3.55));g.add(box(.6,2.2,.2,r,0,3.3,3.55));
 const s=sign('HOSPITAL','#ffffff','#e8334f',4.2,.8);s.position.set(0,1.4,3.56);g.add(s);
 const pad=new THREE.Mesh(new THREE.CylinderGeometry(2.2,2.2,.15,20),std('#3a3a3a'));pad.position.set(0,5.5,0);g.add(pad);const hs=sign('H','#3a3a3a','#ffffff',2,2);hs.rotation.x=-Math.PI/2;hs.position.set(0,5.6,0);g.add(hs);
 return g;})(),30,1,17.5,0,9);
// police (@pepsis099) + fire station (@tommy67778)
const police=placeAt((()=>{const g=new THREE.Group();g.add(box(6,4.5,5,std('#3a6fc4'),0,.5,0));g.add(box(6.4,.5,5.4,MT.white,0,2.9,0));
 const s=sign('POLICE','#ffffff','#1d3f8a',4,.8);s.position.set(0,2,2.52);g.add(s);
 const car=new THREE.Group();car.add(box(1.6,.8,3,MT.white,0,.5,0));car.add(box(1.4,.6,1.6,std('#1d3f8a'),0,1.1,-.2));const lt=box(.8,.25,.3,std('#e8334f'),0,1.5,-.2);car.add(lt);car.position.set(3.8,0,4);g.add(car);g.userData.lt=lt;return g;})(),-26,29,23.0,0,8);
const fire=placeAt((()=>{const g=new THREE.Group();const rd=std('#c93a2e');g.add(box(7,5,5,rd,0,.5,0));g.add(roof4(7.4,1.4,MT.dark,3.7));
 for(const x of [-1.7,1.7])g.add(box(2.6,2.8,.1,MT.white,x,.4,2.52));const s=sign('FIRE','#ffffff','#c93a2e',2.4,.7);s.position.set(0,2.6,2.53);g.add(s);
 const tr=new THREE.Group();tr.add(box(1.8,1.3,4.2,rd,0,.8,0));tr.add(box(1.6,.9,1.2,rd,0,1.6,1.4));const lad=box(.5,.15,3.6,std('#d9d9d9'),0,2,-.4);lad.rotation.x=-.12;tr.add(lad);
 for(const x of [-.9,.9])for(const z of [-1.3,1.3]){const w=cyl(.35,.35,.3,MT.dark,x,.35,z,10);w.rotation.z=Math.PI/2;tr.add(w);}tr.position.set(4.6,0,4.2);g.add(tr);return g;})(),-16,29,23.6,0,8);
// fountain around the statue (@neyth5701) + coat of arms banners on parliament (@goldsilver286297)
const fountain=place((()=>{const g=new THREE.Group();g.add(cyl(3.6,3.8,1,MT.stone,0,.3,0,24));const w=new THREE.Mesh(new THREE.CylinderGeometry(3.3,3.3,.2,24),std('#4fb7ef',{roughness:.2}));w.position.y=.75;g.add(w);
 const jets=[];for(let i=0;i<10;i++){const j=new THREE.Mesh(new THREE.SphereGeometry(.25,8,6),std('#bfe8ff',{roughness:.1}));g.add(j);jets.push(j);}g.userData.jets=jets;return g;})(),0,0,29.0,0,0);
NEW.push(fountain);
function shieldTex(){const c=document.createElement('canvas');c.width=256;c.height=320;const x=c.getContext('2d');x.beginPath();x.moveTo(20,10);x.lineTo(236,10);x.lineTo(236,170);x.quadraticCurveTo(236,280,128,312);x.quadraticCurveTo(20,280,20,170);x.closePath();x.save();x.clip();
 [['#f08a24',0],['#2f8fe0',1],['#4fbf3a',2]].forEach(([col,i])=>{x.fillStyle=col;x.fillRect(0,10+i*101,256,102);});x.fillStyle='#f2c230';x.beginPath();x.moveTo(58,250);x.lineTo(128,95);x.lineTo(198,250);x.fill();x.fillStyle='#d9473b';x.beginPath();x.arc(128,92,18,0,7);x.fill();x.restore();
 x.lineWidth=12;x.strokeStyle='#f2c230';x.stroke();return new THREE.CanvasTexture(c);}
const banners=place((()=>{const g=new THREE.Group();const mt=new THREE.MeshBasicMaterial({map:shieldTex(),transparent:true,side:THREE.DoubleSide});
 for(const x of [-3.6,3.6]){const b=new THREE.Mesh(new THREE.PlaneGeometry(2.2,2.75),mt);b.position.set(x,3,4.55);g.add(b);}return g;})(),0,9,31.4,0,.5);
NEW.push(banners);
// post office (@auroraandjacobysk) + treasury (@jagerwind) replace two town houses near the plaza
const PO=swapTownHouse(13,8), TR=swapTownHouse(-15,11);
const postOffice=placeAt((()=>{const g=new THREE.Group();g.add(box(5,4,4,std('#ffd23f'),0,.5,0));g.add(roof4(5.3,1.3,MT.blue,3.1));const s=sign('POST','#2f7de1','#ffffff',2.6,.7);s.position.set(0,1.9,2.02);g.add(s);
 g.add(box(.6,1.1,.5,std('#2f7de1'),2.9,.55,2.4));return g;})(),PO[0],PO[1],34.5,0,4);
const treasury=placeAt((()=>{const g=new THREE.Group();g.add(box(6,4,4.5,MT.stone,0,.5,0));const ped=prism(6.4,1.4,4.9,MT.stone,3.2);g.add(ped);
 for(let i=0;i<4;i++)g.add(cyl(.25,.25,2.8,MT.white,-2.1+i*1.4,1.1,2.5,8));const c=new THREE.Mesh(new THREE.CylinderGeometry(.9,.9,.2,20),MT.gold);c.rotation.x=Math.PI/2;c.position.set(0,3.4,2.7);g.add(c);return g;})(),TR[0],TR[1],35.2,0,4);

ANIM.push(t=>{
 kids.forEach(k=>{const i=k.userData.i;k.position.y=.2+Math.abs(Math.sin(t*6+i))*.35;k.position.x=1+((i*37)%7)+Math.sin(t*1.5+i)*.8;});
 police.userData.lt.material.color.set(Math.sin(t*12)>0?'#e8334f':'#2f7de1');
 const r=clamp((t-29.0)/1.2); statue.position.y=statue.userData.y0??=statue.position.y; statue.position.y=statue.userData.y0+1.2*ease(r);
 fountain.userData.jets.forEach((j,i)=>{const a=i/10*Math.PI*2,ph=((t*1.2+i*.1)%1);j.position.set(Math.cos(a)*(1.4+ph*1.6),1+ph*2.4-ph*ph*2.4,Math.sin(a)*(1.4+ph*1.6));});
});

const SEGS=[
 {t0:0,t1:4,p:[L(40,-62,62),L(32,-52,52)],l:[L(0,8,8),L(0,8,8)],f:50,
  caps:[['c1',.2,4,'You asked...<br><b>we built it</b>'],['c2',1.0,4,'Part <b>1</b> of 4<span class="sub">faith & public services</span>']]},
 {t0:4,t1:11,p:[L(-6,-17,25),L(-10,-14,23)],l:[L(-33,12,4),L(-33,12,4)],f:55,
  caps:[['c1',4.2,7.5,'Your #1 request:<br>a <b>church</b> ⛪'],['c1',7.7,11,'...and a <b>mosque</b> 🕌<br>everyone is welcome']],
  tags:[['⛪ CHURCH','@gellie96',()=>L(-33,6,13.5),5.0,11],['🕌 MOSQUE','@stoopidsoup24 · @dzak1r_',()=>L(-33,19,12),8.2,11],['🙏 PRIEST','@myusernameisusername14',()=>L(-30,3,2.5),9.2,11]]},
 {t0:11,t1:17,p:[L(8,-6,22),L(11,-3,20)],l:[L(30,16,10),L(30,16,10)],f:55,
  caps:[['c1',11.2,17,'A <b>school</b>...<br>a FUN one!']],
  tags:[['🏫 SCHOOL','@jairus_is_bro2 · @dreror3098',()=>L(23,12,6),12.0,17],['🧑‍🏫 HEAD TEACHER','@isoksekolahfairs',()=>L(36,21,1),13.2,17]]},
 {t0:17,t1:22.5,p:[L(10,-22,22),L(13,-19,20)],l:[L(30,1,9),L(30,1,9)],f:55,
  caps:[['c1',17.2,22.5,'A <b>hospital</b><br>so nobody stays sick']],
  tags:[['🏥 HOSPITAL','owner: @ammar.983',()=>L(30,1,9),18.0,22.5],['💊 ALSO ASKED','@wifjeifjzjwiro · @umaraliffadhly',()=>L(27,-3,2.5),19.0,22.5]]},
 {t0:22.5,t1:28.5,p:[L(-21,2,22),L(-21,6,20)],l:[L(-21,29,8),L(-21,29,8)],f:55,
  caps:[['c1',22.7,28.5,'<b>Police</b> &<br><b>firefighters</b> 🚒']],
  tags:[['🚓 POLICE','@pepsis099',()=>L(-26,29,7),23.6,28.5],['🚒 FIREFIGHTER','@tommy67778',()=>L(-16,29,7.5),24.6,28.5]]},
 {t0:28.5,t1:34,p:[L(13,-16,14),L(10,-14,13)],l:[L(0,4,3),L(0,4,3)],f:55,
  caps:[['c1',28.7,31.2,'The statue got a<br><b>fountain</b> ⛲'],['c1',31.4,34,'+ our <b>coat of arms</b> 🛡️']],
  tags:[['⛲ FOUNTAIN','@neyth5701',()=>L(0,0,7.5),29.6,34],['🛡️ COAT OF ARMS','@goldsilver286297',()=>L(3.6,5,7),31.9,34]]},
 {t0:34,t1:39,p:[L(0,-32,36),L(0,-29,33)],l:[L(0,9,2),L(0,9,2)],f:60,
  caps:[['c1',34.2,39,'A <b>post office</b> 📮<br>and a <b>treasury</b> 💰']],
  tags:[['📮 POST OFFICE','@auroraandjacobysk',()=>L(PO[0],PO[1],6),35.0,39],['💰 TREASURY','@jagerwind',()=>L(TR[0],TR[1],6.5),35.8,39]]},
 {t0:39,t1:46,p:[L(46,-66,64),L(56,-80,80)],l:[L(0,8,6),L(0,8,6)],f:50,
  caps:[['c1',39.2,46,'Didn\'t see yours?<br><b>Part 2</b> is next!'],['c2',41.0,46,'<b>Follow</b> + comment your request<span class="sub">❤️ 2,000 likes = a <b>second city</b> 🏙️</span>']]},
];
