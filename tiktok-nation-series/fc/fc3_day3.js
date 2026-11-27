// ===== HERBERG FC, DAY 3: every donation is rejected (the 8 billion was never real), the club falls back to the old broken
// stadium, the new rule (1 like = 1 coin, 1 save = 2, 1 share = 5), Kola Motors arrive by car, new roles from the comments,
// the first match (lost 1-2 because of a hole), the rebuild goal. Built on top of the Day 2 assets (fc2_day2.js). =====
// ---------- Kola Motors: two red cars and a red team
function car(col){const g=new THREE.Group();const b=std(col,{roughness:.4});g.add(box(7,1.6,3.4,b,0,1.5,0));g.add(box(3.8,1.4,3,b,-.4,3,0));
 g.add(box(3.4,1.1,3.08,std('#bfe3f7',{roughness:.1}),-.4,3.05,0));g.add(box(.2,.6,3.5,std('#f4f4f4'),3.55,1.6,0));
 for(const [x,z] of [[2.3,-1.7],[2.3,1.7],[-2.3,-1.7],[-2.3,1.7]]){const w=cyl(.8,.8,.5,M.blk,x,.8,z,14);w.rotation.x=Math.PI/2;g.add(w);}
 const lg=sign2('KOLA','#ffffff','#c8102e',2.6,.8);lg.position.set(0,1.6,1.72);g.add(lg);const lg2=lg.clone();lg2.position.z=-1.72;lg2.rotation.y=Math.PI;g.add(lg2);
 g.traverse(o=>{if(o.isMesh)o.castShadow=true;});g.visible=false;scene.add(g);return g;}
const CARS=[car('#c8102e'),car('#e8334f')];
const KR='#c8102e';
const KOLA=[['1',[33,0]],['2',[24,-8]],['4',[24,8]],['6',[14,0]],['7',[8,-12]],['8',[8,12]],['9',[3,-3]]].map(([n,h],i)=>{
 const p=person({num:n,shirt:i?KR:'#1d232b',shorts:'#ffffff',socks:i?KR:'#1d232b',hair:['#1d232b','#3b2a1c','#e8c35a','#111','#7a4f2a','#2b1a10','#c98b45'][i],skin:[M.skin,M.skin2,M.skin3][i%3]});
 if(!i)p.userData.arms.forEach(a=>a.add(box(.8,.8,.8,std('#ffffff'),0,-2.2,0)));p.userData.home=h;p.visible=false;scene.add(p);return p;});
// ---------- new Herberg roles
const devin=person({num:'6',hair:'#3b2a1c',skin:M.skin});{const band=box(.62,.45,.62,M.gold,0,-.5,0);devin.userData.arms[1].add(band);}devin.visible=false;scene.add(devin);
const capC=sign2('C','#f2c230','#1d232b',.9,.9);capC.position.set(0,-.5,.33);devin.userData.arms[1].add(capC);
const aqq=person({num:'8',hair:'#111',skin:M.skin3});aqq.visible=false;scene.add(aqq);
const equi=person({num:'11',hair:'#e8c35a',skin:M.skin});equi.visible=false;scene.add(equi);
const shane=person({shirt:'#2b2f36',shorts:'#2b2f36',socks:'#2b2f36',hair:null});{const h=shane.userData.head;h.add(cyl(1.12,1.12,.5,std('#c8102e'),0,.55,0,14));h.add(box(1.1,.15,1.6,std('#c8102e'),.9,.4,0));
 shane.userData.arms[0].add(box(.15,1.4,1,std('#f4f4f4'),.4,-1.9,0));}shane.position.set(-8,0,PW/2+2.6);shane.rotation.y=-Math.PI/2;shane.visible=false;scene.add(shane);
const idc=person({shirt:'#ff8a2a',hair:'#2b1a10',skin:M.skin2,s:.7});idc.position.set(30,0,PW/2+2.4);idc.rotation.y=-Math.PI/2;idc.visible=false;scene.add(idc);
const ref=person({shirt:'#1d232b',shorts:'#1d232b',socks:'#1d232b',hair:'#1d232b'});{ref.userData.head.add(box(.12,.5,1.9,std('#111'),1.0,.15,0));ref.userData.arms[0].add(box(.4,.4,.4,std('#c0c0c0'),.3,-2.2,0));}
ref.visible=false;scene.add(ref);
// ---------- three more seats: Dreni (OG fan), mort, AB_22
const NEWSEATS=[[3,'DRENI','#2fa36b','#111'],[8,'MORT','#0f5c8c','#1d232b'],[10,'AB_22','#e8334f','#3b2a1c']].map(([i,n,c,h])=>({i,p:plate(SEATS[i],n),f:seatFan(i,c,h)}));
// ---------- the stand collapsing: dust clouds
const PUFF=[...Array(26)].map((_,i)=>{const s=sph(2.2+(i%4)*.7,new THREE.MeshStandardMaterial({color:'#e9e4da',transparent:true,opacity:.9,roughness:1}),0,0,0,8);s.castShadow=false;s.visible=false;s.userData={x:-24+(i*19)%48,y:2+(i*7)%12,z:-(PW/2+9)-2+(i*5)%16};scene.add(s);return s;});
// ---------- fake money turns grey
const GREY=std('#9a9a9a');
BILLS.forEach(b=>b.userData.m0=b.material);
