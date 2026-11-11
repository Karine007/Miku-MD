// ===== REQUESTS PART 3: fun, sport & food =====
const PRIOR=(()=>{const lv=window.LEVEL||0;return ()=>lv<(window.LEVEL||0);})();
const pawnMini=(c,s=.8)=>{const g=new THREE.Group();const m=std(c);const b=new THREE.Mesh(new THREE.CapsuleGeometry(.32,.7,4,8),m);b.position.y=.7;const h=new THREE.Mesh(new THREE.SphereGeometry(.27,10,8),m);h.position.y=1.55;g.add(b,h);g.traverse(o=>o.castShadow=true);g.scale.setScalar(s);return g;};
function sign(text,bg,fg,w=3,h=.8){const c=document.createElement('canvas');c.width=512;c.height=Math.round(512*h/w);const x=c.getContext('2d');x.fillStyle=bg;x.fillRect(0,0,c.width,c.height);
 x.fillStyle=fg;x.font=`bold ${Math.round(c.height*.6)}px Nunito, sans-serif`;x.textAlign='center';x.textBaseline='middle';x.fillText(text,c.width/2,c.height/2+4);
 const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(c),side:THREE.DoubleSide}));return m;}

const DARKG2=std('#4a5058');
// ---------- Club FC Herbegus stadium (@milinkovicbird) — players, coach, owner
const SU=52, SV=27;
const players=[];let ball;
const stadium=placeAt((()=>{const g=new THREE.Group();const p0=L(SU,SV);const lift=Math.max(0,L(SU-10,SV).y-p0.y)+.6;
 g.add(box(26,8,19,std('#8fbf5a'),0,lift-4.2,0));                                     // earth platform
 const pitch=box(18,.3,11,std('#4caf50'),0,lift,0);g.add(pitch);
 for(let i=0;i<6;i++)g.add(box(3,.02,11,std('#43a047'),-7.5+i*3,lift+.17,0));
 const W=MT.white;g.add(box(18,.04,.15,W,0,lift+.2,5.4));g.add(box(18,.04,.15,W,0,lift+.2,-5.4));g.add(box(.15,.04,11,W,0,lift+.2,0));
 for(const x of [-9,9]){g.add(box(.15,2,.15,W,x,lift+1,-1.6));g.add(box(.15,2,.15,W,x,lift+1,1.6));g.add(box(.15,.15,3.3,W,x,lift+2,0));}
 const stand=std('#e8334f'),stand2=std('#2f7de1');
 for(let r=0;r<4;r++){g.add(box(22+r*1.2,1,1.6,r%2?stand2:stand,0,lift+.5+r*.9,7+r*1.4));g.add(box(22+r*1.2,1,1.6,r%2?stand2:stand,0,lift+.5+r*.9,-7-r*1.4));
  g.add(box(1.6,1,15+r*1.6,r%2?stand:stand2,11.5+r*1.4,lift+.5+r*.9,0));g.add(box(1.6,1,15+r*1.6,r%2?stand:stand2,-11.5-r*1.4,lift+.5+r*.9,0));}
 for(const [x,z] of [[-14,-11],[14,-11],[-14,11],[14,11]]){g.add(cyl(.25,.3,10,DARKG2,x,lift+5,z,6));g.add(box(2,1.2,.4,std('#fff3a8',{emissive:'#fff3a8',emissiveIntensity:.6}),x,lift+10,z));}
 const s=sign('CLUB FC HERBEGUS','#1d3f8a','#ffcc2e',12,1.5);s.position.set(0,lift+5.6,-12.6);g.add(s);
 // fans in the stands
 const fanM=[std('#e8334f'),std('#2f7de1'),std('#ffcc2e'),std('#ffffff')];
 for(let i=0;i<120;i++){const side=i%4,r=(i>>2)%4,k=Math.floor(i/16);const f=new THREE.Mesh(new THREE.SphereGeometry(.35,6,5),fanM[i%4]);
  if(side<2){f.position.set(-9.5+((i*7)%20),lift+1.4+r*.9,(side?1:-1)*(7+r*1.4));}else{f.position.set((side==2?1:-1)*(11.5+r*1.4),lift+1.4+r*.9,-6.5+((i*5)%14));}f.userData.i=i;g.add(f);}
 const kit=['#e8334f','#e8334f','#e8334f','#2f7de1','#2f7de1','#2f7de1'];
 kit.forEach((c,i)=>{const p=pawnMini(c,.9);p.userData={i,lift};g.add(p);players.push(p);});
 ball=new THREE.Mesh(new THREE.SphereGeometry(.28,10,8),MT.white);g.add(ball);ball.userData.lift=lift;
 const coach=pawnMini('#222222',.95);coach.position.set(-3,lift+.2,6.2);g.add(coach);
 g.userData.lift=lift;return g;})(),SU,SV,4.6,Math.PI/2,16);
// ---------- amusement park: roller coaster (@worship_on_god) + park (@eoinjazsison @raret.t)
const AU=-49, AV=17;
const coaster=placeAt((()=>{const g=new THREE.Group();const track=std('#e8334f'),sup=std('#d9d9d9');
 const pts=[];for(let i=0;i<=120;i++){const a=i/120*Math.PI*2;pts.push(v3(Math.cos(a)*9,4+3*Math.sin(a*2)+(Math.abs(a-Math.PI)<.6?5*Math.cos((a-Math.PI)/.6*Math.PI/2):0),Math.sin(a)*5));}
 const curve=new THREE.CatmullRomCurve3(pts,true);g.add(new THREE.Mesh(new THREE.TubeGeometry(curve,200,.28,6,true),track));
 for(let i=0;i<24;i++){const p=curve.getPoint(i/24);g.add(cyl(.12,.12,p.y,sup,p.x,p.y/2,p.z,5));}
 const cart=new THREE.Group();cart.add(box(1.4,.8,2,std('#ffcc2e'),0,.6,0));for(let k=0;k<2;k++){const r=pawnMini(['#3e8fe6','#7bd65b'][k],.5);r.position.set(0,.6,-.4+k*.8);cart.add(r);}g.add(cart);g.userData={curve,cart};
 // park: lawn, trees, ferris wheel
 const lawn=new THREE.Mesh(new THREE.CylinderGeometry(7,7,.25,20),std('#7fd252'));lawn.position.set(0,.05,11);g.add(lawn);
 for(let i=0;i<7;i++){const a=i/7*Math.PI*2;const t=new THREE.Mesh(roundG,std('#5fb83a',{flatShading:true}));t.position.set(Math.cos(a)*5.5,-.4,11+Math.sin(a)*5.5);t.scale.setScalar(.7);g.add(t);}
 const wheel=new THREE.Group();wheel.add(new THREE.Mesh(new THREE.TorusGeometry(4,.18,6,24),std('#3e8fe6')));for(let k=0;k<8;k++){const a=k/8*Math.PI*2;const sp=box(.12,8,.12,sup,0,0,0);sp.rotation.z=a;wheel.add(sp);const cab=box(.9,.9,.9,[MT.red,MT.orange,std('#ffcc2e'),MT.teal][k%4],Math.cos(a)*4,Math.sin(a)*4,0);wheel.add(cab);}
 wheel.position.set(-10,5,4);wheel.rotation.y=Math.PI/2;g.add(wheel);g.add(box(.4,5,.4,sup,-10,2.5,3));g.add(box(.4,5,.4,sup,-10,2.5,5));g.userData.wheel=wheel;
 return g;})(),AU,AV,13.6,0,16);
// ---------- food street (replace town houses near the beach road)
const FOOD=[['JACK\'S BURGERS','#ffcc2e','#c0392b'],['KEBAB','#c0392b','#ffffff'],['DONUTS','#ff8fc2','#ffffff'],['BAGUETTES','#2f6fd6','#ffffff'],['PUB','#5a3a22','#ffcc2e']];
const FOODPOS=[[-14,-4],[-9,-5],[-4,-5],[9,-6],[14,-4]].map(([u,v])=>swapTownHouse(u,v));
const shops=FOOD.map(([name,bg,fg],i)=>{const g=new THREE.Group();g.add(box(4,3.6,3.6,[MT.wall,MT.wall2,MT.wall3][i%3],0,.5,0));g.add(roof4(4.2,1.2,[MT.red,MT.orange,MT.teal,MT.blue,MT.dark][i],2.9));
 for(let k=0;k<5;k++)g.add(box(.8,.1,1.2,k%2?MT.white:std(bg),-1.6+k*.8,2,2.3));const s=sign(name,bg,fg,3.6,.8);s.position.set(0,2.65,1.83);g.add(s);
 return placeAt(g,FOODPOS[i][0],FOODPOS[i][1],19.6+i*.7,0,4);});
// chicken farm next to the kebab shop (@migui1288)
const hens=[];
const coop=placeAt((()=>{const g=new THREE.Group();g.add(box(2.4,1.6,2,MT.barn,0,.4,0));g.add(roof4(2.6,.9,MT.dark,1.6));
 for(let i=0;i<5;i++){const h=new THREE.Group();h.add(new THREE.Mesh(new THREE.SphereGeometry(.3,8,6),MT.white));const c=new THREE.Mesh(new THREE.SphereGeometry(.12,6,5),MT.red);c.position.set(.22,.22,0);h.add(c);h.userData.i=i;g.add(h);hens.push(h);}
 return g;})(),FOODPOS[1][0]-1,FOODPOS[1][1]+5,20.6,0,3);
// ---------- gaming café (@idkbrowhatshouldinameme) + news station (reporter @dayyan153)
const GC=swapTownHouse(12,14), NS=swapTownHouse(-12,17);
const neon=std('#b44cff',{emissive:'#b44cff',emissiveIntensity:.9});
const gaming=placeAt((()=>{const g=new THREE.Group();g.add(box(5,4,4,std('#2b2b3a'),0,.5,0));g.add(box(5.2,.3,4.2,neon,0,2.6,0));const s=sign('GAMING CAFÉ','#2b2b3a','#5ff3ff',4.4,.9);s.position.set(0,1.8,2.02);g.add(s);
 g.add(box(.8,.8,.1,std('#5ff3ff',{emissive:'#5ff3ff',emissiveIntensity:.8}),-1.4,.9,2.03));return g;})(),GC[0],GC[1],26.6,0,4);
const news=placeAt((()=>{const g=new THREE.Group();g.add(box(5,4.4,4,MT.wall3,0,.5,0));const s=sign('HERBERG NEWS','#e8334f','#ffffff',4.6,.9);s.position.set(0,2,2.02);g.add(s);
 g.add(cyl(.12,.15,6,DARKG2,1.6,5.5,-1,6));const dish=new THREE.Mesh(new THREE.SphereGeometry(.9,12,8,0,Math.PI*2,0,Math.PI/2.5),MT.white);dish.rotation.x=-1.2;dish.position.set(-1.2,3.2,-1);g.add(dish);return g;})(),NS[0],NS[1],27.4,0,4);
// ---------- treehouse (@junjunalipon) + hut with 2 dogs (@rainbow7457)
const treehouse=placeAt((()=>{const g=new THREE.Group();g.add(cyl(.9,1.3,8,MT.wood,0,3,0,8));const top=new THREE.Mesh(new THREE.IcosahedronGeometry(4.2,1),std('#4f9e3a',{flatShading:true}));top.position.y=10;g.add(top);
 g.add(box(4,.3,4,MT.wood,0,6,0));const hut=new THREE.Group();hut.add(box(3,2.2,3,std('#b07a45'),0,7.3,0));hut.add(roof4(3.4,1.2,MT.red,9));g.add(hut);
 for(let i=0;i<7;i++)g.add(box(.8,.1,.15,MT.wood,1,.6+i*.8,.95));return g;})(),-30,42,31.6,0,6);
const dogs=[];
const hutDogs=placeAt((()=>{const g=new THREE.Group();g.add(box(3,2,3,std('#c9a26b'),0,.6,0));const r=new THREE.Mesh(new THREE.ConeGeometry(2.6,1.6,4),std('#8a5a33'));r.rotation.y=Math.PI/4;r.position.y=2.4;g.add(r);
 for(let i=0;i<2;i++){const d=new THREE.Group();const m=std(i?'#f2c48a':'#3a2a1e');const b=new THREE.Mesh(new THREE.CapsuleGeometry(.28,.6,4,8),m);b.rotation.z=Math.PI/2;b.position.y=.45;
  const h=new THREE.Mesh(new THREE.SphereGeometry(.26,8,6),m);h.position.set(.5,.65,0);const tail=box(.08,.08,.35,m,-.5,.6,0);tail.rotation.x=.6;d.add(b,h,tail);d.userData.i=i;g.add(d);dogs.push(d);}
 return g;})(),-39,46,32.4,0,5);
// ---------- beach hotel (@itznotrenzodude) + seaside house (@babymaia_isso_cutehehe)
const hotel=placeAt((()=>{const g=new THREE.Group();g.add(box(9,10,5,std('#f7f1e1'),0,3.5,0));for(let f=0;f<4;f++)for(let k=0;k<5;k++)g.add(box(1,.9,.1,std('#7fc8f0'),-3.6+k*1.8,1.6+f*2.2,2.53));
 const s=sign('HOTEL','#2f7de1','#ffffff',3,.8);s.position.set(0,9.2,2.54);g.add(s);const pool=box(5,.2,3,std('#4fd0f0'),0,-.3,5);g.add(pool);
 for(let k=0;k<3;k++){g.add(cyl(.06,.06,2,MT.white,-3+k*3,.6,8.2,5));const p=new THREE.Mesh(new THREE.ConeGeometry(1.1,.5,8),[MT.red,MT.orange,MT.teal][k]);p.position.set(-3+k*3,1.7,8.2);g.add(p);}return g;})(),46,12,37.6,0,7);
const seaside=placeAt((()=>{const g=new THREE.Group();g.add(box(3.4,2.6,3,std('#bfe8f5'),0,.6,0));g.add(roof4(3.8,1.3,MT.blue,2.6));g.add(box(3.6,.15,1.6,MT.wood,0,.05,2.3));return g;})(),39,17,38.4,0,4);

ANIM.push(t=>{
 const L0=stadium.userData.lift;
 players.forEach(p=>{const i=p.userData.i;const side=i<3?-1:1;p.position.set(side*(2+((i*3)%3)*2.2)+Math.sin(t*1.7+i)*2.2,L0+.2,-3+((i*5)%3)*3+Math.cos(t*1.3+i*2)*1.6);p.rotation.y=Math.sin(t+i);});
 ball.position.set(Math.sin(t*1.7)*4,L0+.45+Math.abs(Math.sin(t*3.4))*.6,Math.cos(t*2.1)*2.4);
 const cu=coaster.userData.curve, ph=(t*.09)%1; const cp=cu.getPoint(ph), nx=cu.getPoint((ph+.004)%1);coaster.userData.cart.position.copy(cp);coaster.userData.cart.lookAt(nx);
 coaster.userData.wheel.rotation.z=t*.4;
 hens.forEach(h=>{const i=h.userData.i;h.position.set(1.8+Math.sin(t*.9+i*2)*1.2,.3+Math.abs(Math.sin(t*5+i))*.1,Math.cos(t*.7+i)*1.4);});
 dogs.forEach(d=>{const i=d.userData.i;const a=t*1.4+i*Math.PI;d.position.set(Math.cos(a)*3.2,Math.abs(Math.sin(t*8+i))*.12,2.6+Math.sin(a)*1.4);d.rotation.y=-a-Math.PI/2;});
});

const SEGS=[
 {t0:0,t1:4,p:[L(54,-58,66),L(44,-50,56)],l:[L(8,12,8),L(8,12,8)],f:50,
  caps:[['c1',.2,4,'You asked...<br><b>we built it</b>'],['c2',1.0,4,'Part <b>3</b> of 4<span class="sub">fun, sport & food</span>']]},
 {t0:4,t1:13,p:[L(SU-26,SV-22,28),L(SU-22,SV-18,24)],l:[L(SU,SV,9),L(SU,SV,9)],f:55,
  caps:[['c1',4.2,8.5,'A <b>football stadium</b> ⚽'],['c1',8.7,13,'Home of<br><b>Club FC Herbegus</b>!']],
  tags:[['🏟️ STADIUM','@milinkovicbird',()=>L(SU,SV,16),5.0,13],['⚽ STRIKER','@archerman2026',()=>players[0].getWorldPosition(v3(0,0,0)).add(v3(0,2.8,0)),6.4,13],
        ['⭐ STAR PLAYERS','@zukito_on_g2 · @ethansmith245',()=>players[4].getWorldPosition(v3(0,0,0)).add(v3(0,2.8,0)),7.6,13],['📋 COACH','@gabrielmikadze1',()=>L(SU-6,SV-3,9),8.8,13],['💼 CLUB OWNER','@me.dzz1',()=>L(SU+12,SV-9,12),10.0,13]]},
 {t0:13,t1:19,p:[L(AU+28,AV-26,26),L(AU+24,AV-22,23)],l:[L(AU-2,AV+4,6),L(AU-2,AV+4,6)],f:55,
  caps:[['c1',13.2,19,'A <b>roller coaster</b> 🎢<br>and a park!']],
  tags:[['🎢 COASTER OWNER','@worship_on_god',()=>L(AU,AV,13),14.0,19],['🌳 PARK','@eoinjazsison · @raret.t',()=>L(AU,AV+11,5),15.2,19]]},
 {t0:19,t1:26,p:[L(0,-46,27),L(0,-42,25)],l:[L(0,-5,3),L(0,-5,3)],f:62,
  caps:[['c1',19.2,26,'<b>Food street</b> 🍔🥙🍩🥖']],
  tags:FOOD.map((f,i)=>[['🍔 JACK\'S BURGERS','🥙 KEBAB + 🐔 FARM','🍩 DONUTS & ONION RINGS','🥖 BAGUETTES','🍺 PUB'][i],['@jjo14430','@migui1288','@fruitgersonic','@frenchvive','manager: @ephraimthechad'][i],()=>L(FOODPOS[i][0],FOODPOS[i][1],i%2?4.4:7.2),20.0+i*.7,26])},
 {t0:26,t1:31,p:[L(0,42,26),L(0,38,24)],l:[L(0,14,4),L(0,14,4)],f:58,
  caps:[['c1',26.2,31,'A <b>gaming café</b> 🎮<br>+ a <b>news station</b> 📰']],
  tags:[['🎮 GAMING CAFÉ','@idkbrowhatshouldinameme',()=>L(GC[0],GC[1],6),27.0,31],['📰 NEWS REPORTER','@dayyan153',()=>L(NS[0],NS[1],7),27.8,31]]},
 {t0:31,t1:37,p:[L(-50,66,24),L(-48,63,22)],l:[L(-33,42,6),L(-33,42,6)],f:58,
  caps:[['c1',31.2,37,'A <b>treehouse</b> 🌳<br>& a hut with <b>2 dogs</b> 🐶']],
  tags:[['🌳 TREEHOUSE','@junjunalipon',()=>L(-30,42,15),32.0,37],['🐶 HUT + 2 DOGS','@rainbow7457',()=>L(-39,46,5),33.0,37]]},
 {t0:37,t1:42,p:[L(64,-20,20),L(61,-18,18)],l:[L(43,10,6),L(43,10,6)],f:58,
  caps:[['c1',37.2,42,'A <b>beach hotel</b> 🏖️<br>& a seaside house']],
  tags:[['🏨 BEACH HOTEL','@itznotrenzodude',()=>L(46,12,13),38.0,42],['🏡 SEASIDE HOUSE','@babymaia_isso_cutehehe',()=>L(39,17,6),38.8,42]]},
 {t0:42,t1:48,p:[L(58,-74,74),L(68,-88,90)],l:[L(2,14,6),L(2,14,6)],f:50,
  caps:[['c1',42.2,48,'Part 4: the<br><b>volcano village</b> 🌋🚂'],['c2',43.8,48,'<b>Follow</b> so you don\'t miss it<span class="sub">❤️ 2,000 likes = a <b>second city</b> 🏙️</span>']]},
];
