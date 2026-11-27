// ===== REQUESTS PART 2: defence, airport & ports =====
const PRIOR=(()=>{const lv=window.LEVEL||0;return ()=>lv<(window.LEVEL||0);})();  // true when included in a later part
const pawnMini=(c,s=.8)=>{const g=new THREE.Group();const m=std(c);const b=new THREE.Mesh(new THREE.CapsuleGeometry(.32,.7,4,8),m);b.position.y=.7;const h=new THREE.Mesh(new THREE.SphereGeometry(.27,10,8),m);h.position.y=1.55;g.add(b,h);g.traverse(o=>o.castShadow=true);g.scale.setScalar(s);return g;};
function sign(text,bg,fg,w=3,h=.8){const c=document.createElement('canvas');c.width=512;c.height=Math.round(512*h/w);const x=c.getContext('2d');x.fillStyle=bg;x.fillRect(0,0,c.width,c.height);
 x.fillStyle=fg;x.font=`bold ${Math.round(c.height*.62)}px Nunito, sans-serif`;x.textAlign='center';x.textBaseline='middle';x.fillText(text,c.width/2,c.height/2+4);
 return new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(c)}));}
const OLIVE=std('#6b7d3a'), GREY=std('#8c939b'), DARKG=std('#4a5058');

// ---------- army: barracks + drilling soldiers (@hyv967 @khaled.mohamed5082 · general @zhyarthekid11)
const soldiers=[];
const barracks=placeAt((()=>{const g=new THREE.Group();for(const z of [-4,3]){g.add(box(11,3.4,4,OLIVE,0,.7,z));const r=new THREE.Mesh(new THREE.CylinderGeometry(2.1,2.1,11,12,1,false,0,Math.PI),OLIVE);r.rotation.z=Math.PI/2;r.position.set(0,2.4,z);g.add(r);}
 const yard=new THREE.Mesh(new THREE.BoxGeometry(12,.3,7),std('#b9a27a'));yard.position.set(0,0,9);g.add(yard);
 const fp=new THREE.Group();flagOn(fp,0,1.6);fp.position.set(-6.5,0,6);g.add(fp);
 for(let i=0;i<12;i++){const s=pawnMini('#3f5a2a',.85);s.userData={r:Math.floor(i/4),c:i%4};g.add(s);soldiers.push(s);}
 const gen=pawnMini('#c9a227',1);gen.position.set(0,.2,12.6);g.add(gen);return g;})(),-40,4,4.6,0,10);
// coastal defence station (@jhaylomc)
const battery=placeAt((()=>{const g=new THREE.Group();g.add(box(8,1.6,5,MT.stone,0,-.1,0));
 for(const x of [-2.6,0,2.6]){const c=cyl(.32,.42,3,DARKG,x,1.3,1.2,10);c.rotation.x=Math.PI/2-.25;g.add(c);g.add(box(1,.8,1.2,MT.wood,x,1,0));}return g;})(),-30,-7,6.2,0,6);
// ---------- castle walls + archers (@samsamsamsams4m · archer leader @hazjerichos)
const archers=[];
for(let u=-42,i=0;u<=40;u+=6,i++){const tower=i%3==0;const g=new THREE.Group();
 if(tower){g.add(cyl(2,2.2,8,MT.stone,0,2.5,0,10));for(let k=0;k<8;k++){const a=k/8*Math.PI*2;g.add(box(.7,.8,.7,MT.stone,Math.cos(a)*2,6.9,Math.sin(a)*2));}const a=pawnMini('#7a4a26',.8);a.position.y=6.5;g.add(a);archers.push(a);}
 else{g.add(box(6.2,5,1.6,MT.stone,0,1,0));for(let k=-2;k<=2;k++)g.add(box(.7,.7,1.7,MT.stone,k*1.25,3.85,0));}
 placeAt(g,u,36,11.4+i*.06,0,4);}
// gate
placeAt((()=>{const g=new THREE.Group();g.add(box(3.2,4,1.8,MT.wood,0,.6,1));return g;})(),3,36,12.6,0,3);
// ---------- airport (@000000biggycheese000000 @liam_aviation747 @hammyb747)
const RY=14.2, RV=47;
const airport=placeAt((()=>{const g=new THREE.Group();const p0=L(12,RV);const dy=RY-p0.y;
 g.add(box(58,12,10,std('#7fbf4a'),0,dy-6.3,0));const rw=box(56,.4,7,std('#3d4247'),0,dy,0);g.add(rw);
 for(let i=-6;i<=6;i++)g.add(box(2.4,.05,.35,MT.white,i*4,dy+.22,0));
 const term=new THREE.Group();term.add(box(14,4,5,std('#bfe3f5'),0,2,0));term.add(box(14.4,.5,5.4,MT.white,0,4.2,0));const s=sign('HERBERG AIRPORT','#ffffff','#2f7de1',8,.9);s.position.set(0,3.3,2.52);term.add(s);
 const ct=new THREE.Group();ct.add(cyl(.9,1.1,8,MT.white,0,4,0,10));ct.add(cyl(1.8,1.6,1.8,std('#3d6f8f'),0,8.6,0,10));ct.position.set(9,0,0);term.add(ct);
 term.position.set(-4,dy,-9);g.add(term);const apron=box(20,.3,6,std('#8a8f94'),-4,dy-.05,-6);g.add(apron);
 g.rotation.y=0;return g;})(),12,RV,17.4,0,14);
for(let u=-16;u<=40;u+=7)clearCrowd(u,RV,8);clearCrowd(8,RV+9,10);
function planeModel(col,s=1){const g=new THREE.Group();const m=std(col);const f=new THREE.Mesh(new THREE.CapsuleGeometry(.7,6,6,12),m);f.rotation.z=Math.PI/2;g.add(f);
 g.add(box(1.6,.15,8,m,.2,0,0));g.add(box(.9,1.8,.15,m,-3.3,1,0));g.add(box(.8,.12,3,m,-3.3,.3,0));const ck=new THREE.Mesh(new THREE.SphereGeometry(.5,10,8),std('#2f6fa8'));ck.position.set(2.9,.35,0);g.add(ck);
 g.traverse(o=>o.castShadow=true);g.scale.setScalar(s);return g;}
const plane=planeModel('#ffffff',1.1);scene.add(plane);plane.visible=false;
const jets=[0,1].map(i=>{const j=planeModel('#7d868f',.7);scene.add(j);j.visible=false;return j;});
function onRunway(u,dv=0,h=0){const p=LW(u,RV+dv);return v3(p.x,RY+h,p.y);}
const ALONG_ANG=Math.atan2(-ALONG.y,ALONG.x);
// ---------- navy fleet (@somedude9898 @ryyy7220 @lukhanyo.sibisi · coast guard @daddy_kawhi)
function shipModel(sz=1,sailCol){const g=new THREE.Group();g.add(box(2.6,1.3,7,MT.hull,0,.3,0));const bow=new THREE.Mesh(new THREE.ConeGeometry(1.3,2.2,4),MT.hull);bow.rotation.x=Math.PI/2;bow.rotation.y=Math.PI/4;bow.scale.set(1,1,.55);bow.position.set(0,.3,4.4);g.add(bow);
 g.add(box(2.4,.2,6.8,std('#c9a26b'),0,.98,0));g.add(cyl(.12,.15,6.5,MT.wood,0,4.2,.4,6));const sail=new THREE.Mesh(new THREE.PlaneGeometry(3.6,2.8),sailCol?std(sailCol,{side:THREE.DoubleSide}):MT.sail);sail.rotation.y=Math.PI/2;sail.position.set(0,4.4,.4);g.add(sail);
 for(const z of [-1.8,0,1.8])for(const x of [-1.32,1.32]){const c=cyl(.16,.16,.7,MT.dark,x,.5,z,8);c.rotation.z=Math.PI/2;g.add(c);}g.scale.setScalar(sz);return g;}
const fleet=[[-10,-30,1.15],[5,-37,1.3],[-24,-38,1.1]].map(([u,v,s],i)=>{const g=shipModel(s);const p=L(u,v);g.position.set(p.x,SEA+.1,p.z);g.rotation.y=FACE+Math.PI/2+.3+i*.2;g.userData={t:25.4+i*.5,base:SEA+.1};g.visible=false;scene.add(g);NEW.push(g);return g;});
const guard=(()=>{const g=new THREE.Group();g.add(box(1.8,.9,4.4,MT.white,0,.3,0));g.add(box(1.4,1,1.6,std('#e8334f'),0,1.2,-.4));g.add(box(1.85,.25,4.45,std('#e8334f'),0,.55,0));
 const p=L(16,-24);g.position.set(p.x,SEA+.1,p.z);g.rotation.y=FACE+1.2;g.userData={t:26.6,base:SEA+.1};g.visible=false;scene.add(g);NEW.push(g);return g;})();
// ---------- lighthouse (keeper @grate_the_gratefu)
const beam=new THREE.Mesh(new THREE.ConeGeometry(3,22,16,1,true),new THREE.MeshBasicMaterial({color:'#fff3a8',transparent:true,opacity:.28,depthWrite:false,side:THREE.DoubleSide}));
const lighthouse=placeAt((()=>{const g=new THREE.Group();for(let i=0;i<5;i++)g.add(cyl(1.7-i*.18,1.8-i*.18,2.2,i%2?MT.white:MT.red,0,i*2.2+.6,0,14));
 g.add(cyl(1.1,1.1,1.6,std('#fff3a8',{emissive:'#ffdf6a',emissiveIntensity:.8}),0,11.9,0,12));g.add(new THREE.Mesh(new THREE.ConeGeometry(1.4,1.4,12),MT.red).translateY(13.4));
 const piv=new THREE.Group();piv.position.y=11.9;beam.rotation.z=Math.PI/2;beam.position.x=11;piv.add(beam);g.add(piv);g.userData.piv=piv;return g;})(),42,-7,32.6,0,5);
// ---------- docks, fishing port, visitor ferry (@kendrew.jairo.cui @kitsuneetomoe · fisherman @dls_juventus_x · ferry @77rig3l)
function pierAt(u,v,n,t){const g=new THREE.Group();for(let i=0;i<n;i++){g.add(box(3,.25,1.3,MT.wood,0,0,-i*1.4));if(i%2==0)for(const x of [-1.4,1.4])g.add(cyl(.15,.15,3,MT.wood,x,-1.2,-i*1.4,6));}
 const p=L(u,v);g.position.set(p.x,SEA+.55,p.z);g.rotation.y=FACE;g.userData.t=t;g.visible=false;scene.add(g);city.push(g);NEW.push(g);return g;}
pierAt(-12,-9.5,13,37.4); pierAt(-16,-9.5,13,37.6); pierAt(20,-9.5,9,38.2); pierAt(24,-9.5,9,38.4);
const boats=[[22,-20],[19,-24],[26,-23]].map(([u,v],i)=>{const g=new THREE.Group();g.add(box(1.2,.6,2.8,[MT.red,MT.blue,MT.orange][i],0,.2,0));g.add(cyl(.06,.06,2.2,MT.wood,0,1.4,0,5));
 const p=L(u,v);g.position.set(p.x,SEA+.1,p.z);g.rotation.y=FACE+i;g.userData={t:38.6+i*.2,base:SEA+.1};g.visible=false;scene.add(g);NEW.push(g);return g;});
const ferry=(()=>{const g=new THREE.Group();g.add(box(3.4,1.4,9,MT.white,0,.4,0));g.add(box(3,1.6,5,std('#bfe3f5'),0,1.9,-.5));g.add(box(3.1,.3,5.1,std('#2f7de1'),0,2.85,-.5));g.add(cyl(.4,.5,1.4,std('#e8334f'),0,3.6,-1.8,10));
 g.visible=false;scene.add(g);return g;})();
const fisher=pawnMini('#2f7de1',.9);scene.add(fisher);fisher.visible=false;

ANIM.push(t=>{
 soldiers.forEach(s=>{const{r,c}=s.userData;const step=Math.floor(t*2)%2;s.position.set(-3+c*2,.2+(step===(r%2)?.15:0),6.5+r*1.8+Math.sin(t*1.2)*1.2);});
 archers.forEach((a,i)=>{a.rotation.y=Math.sin(t*.8+i)*.6;});
 // plane rolls then takes off along the runway
 plane.visible=PRIOR()||t>=17.4; jets.forEach((j,i)=>{j.visible=PRIOR()||t>=17.6;const p=onRunway(-6+i*7,6.5,.9);j.position.copy(p);j.rotation.y=ALONG_ANG;});
 if(plane.visible){const d=PRIOR()?0:Math.max(0,t-19.4);const u=-24+d*d*2.2;const climb=Math.max(0,u-6)*.28;const p=onRunway(u,0,1.1+climb);plane.position.copy(p);plane.rotation.set(0,ALONG_ANG,0);plane.rotateZ(Math.min(.32,climb*.04));}
 for(const g of [...fleet,guard,...boats]){const kk=clamp((t-g.userData.t)/.5);g.visible=kk>0;if(kk>0){g.position.y=g.userData.base-(1-backOut(kk))*2+Math.sin(t*1.5+g.position.x)*.15;g.rotation.z=Math.sin(t*1.2+g.position.z)*.04;}}
 lighthouse.userData.piv.rotation.y=t*1.6;
 const fk=PRIOR()?1:clamp((t-38.0)/4);ferry.visible=PRIOR()||t>=37.6;if(ferry.visible){const p=L(-14,-44+fk*20);ferry.position.set(p.x,SEA+.1+Math.sin(t*1.4)*.12,p.z);ferry.rotation.y=FACE;}
 fisher.visible=PRIOR()||t>=38.6;if(fisher.visible){const p=L(22,-19.5);fisher.position.set(p.x,SEA+.6,p.z);}
});

const SEGS=[
 {t0:0,t1:4,p:[L(44,-64,64),L(34,-54,54)],l:[L(0,10,8),L(0,10,8)],f:50,
  caps:[['c1',.2,4,'You asked...<br><b>we built it</b>'],['c2',1.0,4,'Part <b>2</b> of 4<span class="sub">defence & travel</span>']]},
 {t0:4,t1:11,p:[L(-18,-18,24),L(-22,-15,22)],l:[L(-37,3,8),L(-37,3,8)],f:55,
  caps:[['c1',4.2,11,'An <b>army</b> 🪖<br>to defend Herberg']],
  tags:[['🪖 BARRACKS','@hyv967 · @khaled.mohamed5082',()=>L(-40,0,7),5.0,11],['🎖️ GENERAL','@zhyarthekid11',()=>L(-40,16,3.4),6.0,11],
        ['🫡 SOLDIERS','@jace78134 · @sherrylram0s · @sherhat.sherhat',()=>L(-44,12,3),7.2,11],['💥 DEFENCE STATION','@jhaylomc',()=>L(-30,-7,4),8.4,11],['⚔️ SECRETARY OF WAR','@richthofen88',()=>L(-46,-1,6),9.6,11]]},
 {t0:11,t1:17,p:[L(-4,12,22),L(-8,16,20)],l:[L(-14,36,9),L(-14,36,9)],f:55,
  caps:[['c1',11.2,17,'<b>Castle walls</b>...<br>with <b>archers</b> 🏹']],
  tags:[['🏰 WALLS','@samsamsamsams4m',()=>L(-6,36,6),12.4,17],['🏹 ARCHER LEADER','@hazjerichos',()=>L(-24,36,10),13.4,17]]},
 {t0:17,t1:25,p:[L(50,14,38),L(46,18,36)],l:[L(10,RV,10),L(14,RV,11)],f:55,
  caps:[['c1',17.2,21,'An <b>airport</b> ✈️'],['c1',21.2,25,'...and an <b>air force</b>!']],
  tags:[['✈️ AIRPORT','@000000biggycheese000000 · @liam_aviation747 · @hammyb747',()=>L(8,RV+9,RY-L(8,RV+9).y+7),18.0,25],['👨‍✈️ PILOT','@official_d4sh',()=>plane.position.clone().add(v3(0,3,0)),19.6,22.5],
        ['🛩️ AIR FORCE COMMANDER','@ivan.bulfa',()=>onRunway(-2,6.5,3.4),21.6,25],['🎯 AIR FORCE PILOTS','@the_real_abnesoy · @zetienefi3',()=>onRunway(6,6.5,3),22.6,25]]},
 {t0:25,t1:32,p:[L(30,-10,28),L(24,-8,26)],l:[L(-6,-34,2),L(-6,-34,2)],f:55,
  caps:[['c1',25.2,32,'A real <b>navy</b> ⚓']],
  tags:[['⚓ NAVY COMMANDER','@somedude9898',()=>{const p=fleet[1].position;return v3(p.x,p.y+9,p.z);},26.0,32],['🚢 SAILORS','@ryyy7220 · @lukhanyo.sibisi',()=>{const p=fleet[0].position;return v3(p.x,p.y+8,p.z);},27.2,32],
        ['🛟 COAST GUARD','@daddy_kawhi',()=>v3(guard.position.x,guard.position.y+4,guard.position.z),28.4,32]]},
 {t0:32,t1:37,p:[L(20,-32,21),L(23,-30,19)],l:[L(40,-7,8),L(40,-7,8)],f:55,
  caps:[['c1',32.2,37,'A <b>lighthouse</b><br>to watch over the navy']],
  tags:[['🗼 LIGHTHOUSE KEEPER','@grate_the_gratefu',()=>L(42,-7,15.5),33.0,37]]},
 {t0:37,t1:42,p:[L(4,-56,26),L(6,-52,24)],l:[L(4,-17,0),L(4,-17,0)],f:58,
  caps:[['c1',37.2,42,'<b>Docks</b>, a <b>fishing port</b><br>& a ferry for visitors']],
  tags:[['⚓ DOCKS','@kendrew.jairo.cui',()=>L(-14,-14,3),38.0,42],['🎣 FISHING PORT','@kitsuneetomoe',()=>L(22,-14,3),38.8,42],
        ['🐟 FISHERMAN','@dls_juventus_x',()=>fisher.position.clone().add(v3(0,2.6,0)),39.6,42],['⛴️ VISITOR FERRY','@77rig3l',()=>ferry.position.clone().add(v3(0,6,0)),40.4,42]]},
 {t0:42,t1:48,p:[L(48,-70,66),L(58,-84,82)],l:[L(0,12,6),L(0,12,6)],f:50,
  caps:[['c1',42.2,48,'Part 3: <b>fun, sport</b><br>& <b>food</b> ⚽🎢🍔'],['c2',43.8,48,'<b>Follow</b> so you don\'t miss it<span class="sub">❤️ 2,000 likes = a <b>second city</b> 🏙️</span>']]},
];
