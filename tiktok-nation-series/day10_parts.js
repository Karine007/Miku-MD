// ===== DAY 10: 10 shares = 10 new islands (one per commenter) + a steam train + the Day 11 vote =====
// (make_day10.py prepends the Day 5 → Day 9 builds, all already standing)
POP9.forEach(g=>{g.userData.t=-1;});
ISL.forEach(g=>{g.visible=false;});
const sandM=std('#e9d39a'),grassM=std('#7cc95a'),terra=std('#c8643c'),gold10=std('#f2c230',{metalness:.6,roughness:.3}),cash=std('#5dbb63'),stone10=std('#b8b0a2'),navy10=std('#7d8a96');
const pinkM=std('#f4a6b6'),pink2=std('#e98fa2'),brick=std('#e6d3b3'),dkgreen=std('#2f6b3a'),whiteM=std('#fbf8f1');
function label10(text,sub){const c=document.createElement('canvas');c.width=640;c.height=190;const x=c.getContext('2d');x.fillStyle='#ffffff';x.beginPath();x.roundRect(6,6,628,178,46);x.fill();x.lineWidth=10;x.strokeStyle='#1d232b';x.stroke();
 x.fillStyle='#1d232b';x.textAlign='center';x.textBaseline='middle';let fs=74;x.font=`900 ${fs}px Nunito, sans-serif`;while(x.measureText(text).width>580&&fs>30){fs-=2;x.font=`900 ${fs}px Nunito, sans-serif`;}x.fillText(text,320,sub?78:98);
 if(sub){x.fillStyle='#2f7de1';x.font='900 40px Nunito, sans-serif';x.fillText(sub,320,148);}
 const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(c),depthTest:false,fog:false,transparent:true}));sp.scale.set(44,13,1);sp.renderOrder=10;return sp;}
// island bases: row A faces the main island, row B faces the open sea
const ISL10=[], T10=3.5;
function makeIsle(u,v,r,faceMain,name,top){const g=new THREE.Group();g.add(cyl(r,r+4,6,sandM,0,-1,0,30));g.add(cyl(r-4,r-1.5,2.4,top||grassM,0,2.3,0,28));
 const bld=new THREE.Group();bld.position.y=T10;g.add(bld);const sp=label10(name);sp.position.set(0,52,0);g.add(sp);
 const p=LW(u,v);g.position.set(p.x,SEA,p.y);g.rotation.y=FACE+(faceMain?Math.PI:0);g.visible=false;scene.add(g);
 const ref=new THREE.Object3D();ref.position.copy(g.position);ref.rotation.copy(g.rotation);ref.updateMatrixWorld(true);
 const o={g,bld,sp,ref,r,u,v};ISL10.push(o);return o;}
const IL=(i,x,y,z)=>ISL10[i].ref.localToWorld(v3(x,y+SEA,z));
const palm10=(s=1)=>{const g=new THREE.Group();const tr=cyl(.3*s,.45*s,7*s,MT.wood,0,3.5*s,0,6);tr.rotation.z=.12;g.add(tr);for(let k=0;k<6;k++){const lf=box(4.6*s,.12*s,1.1*s,std('#3fa34a'),0,0,0);const a=k/6*Math.PI*2;lf.position.set(Math.cos(a)*2*s+.8*s,7*s,Math.sin(a)*2*s);lf.rotation.y=-a;lf.rotation.z=-.35;g.add(lf);}g.traverse(o=>o.castShadow=true);return g;};
const pine10=(s=1)=>{const g=new THREE.Group();g.add(cyl(.25*s,.35*s,2*s,MT.wood,0,1*s,0,6));for(let k=0;k<3;k++){const c=new THREE.Mesh(new THREE.ConeGeometry((2.2-k*.5)*s,2.6*s,7),std(k%2?'#2f7a3a':'#3a8c42'));c.position.y=(2.4+k*1.5)*s;c.castShadow=true;g.add(c);}return g;};
function pig(s=1){const g=new THREE.Group();g.add(box(1.5*s,.9*s,.9*s,pinkM,0,.85*s,0));for(const x of [-.5,.5])for(const z of [-.3,.3])g.add(box(.22*s,.45*s,.22*s,pink2,x*s,.22*s,z*s));
 const hd=new THREE.Group();hd.add(box(.7*s,.7*s,.75*s,pinkM,0,0,0));hd.add(box(.2*s,.36*s,.44*s,pink2,.42*s,-.08*s,0));for(const z of [-.24,.24]){const e=box(.12*s,.28*s,.22*s,pink2,-.05*s,.42*s,z*s);e.rotation.x=z>0?-.4:.4;hd.add(e);}
 hd.add(box(.06*s,.1*s,.1*s,blk,.36*s,.14*s,.2*s));hd.add(box(.06*s,.1*s,.1*s,blk,.36*s,.14*s,-.2*s));hd.position.set(.95*s,1.05*s,0);g.add(hd);g.userData.hd=hd;
 const tl=new THREE.Mesh(new THREE.TorusGeometry(.14*s,.05*s,5,8,4.5),pink2);tl.position.set(-.8*s,1.05*s,0);tl.rotation.y=Math.PI/2;g.add(tl);g.traverse(o=>o.castShadow=true);return g;}
function tank10(c='#5d7a46'){const g=new THREE.Group();const m=std(c);g.add(box(5,1.3,3,m,0,1,0));for(const z of [-1.6,1.6])g.add(box(5.4,1,.7,blk,0,.55,z));const tu=new THREE.Group();tu.add(box(2.4,1,2,m,0,0,0));tu.add(cyl(.18,.18,3.4,m,1.8,0,0,8).rotateZ(Math.PI/2));tu.position.y=2.1;g.add(tu);g.userData.tu=tu;g.traverse(o=>o.castShadow=true);return g;}
function fighter(){const g=new THREE.Group();const m=std('#8f9aa5');const b=cyl(.5,.7,9,m,0,0,0,10);b.rotation.z=Math.PI/2;g.add(b);const n=new THREE.Mesh(new THREE.ConeGeometry(.5,2,10),m);n.rotation.z=-Math.PI/2;n.position.x=5.5;g.add(n);
 const w=new THREE.Mesh(new THREE.BufferGeometry().setFromPoints([v3(1.5,0,0),v3(-2.5,0,4.6),v3(-3.4,0,4.6),v3(-3,0,0),v3(-3.4,0,-4.6),v3(-2.5,0,-4.6),v3(1.5,0,0),v3(-3,0,0)]),m);
 g.add(box(4,.18,9,m,-1.2,0,0));g.add(box(1.6,2.2,.16,m,-3.8,1.1,0));g.add(box(1.4,.5,.9,std('#2d5f80',{roughness:.1}),2.4,.5,0));g.traverse(o=>o.castShadow=true);g.position.y=1.2;return g;}
function logoTex(){const c=document.createElement('canvas');c.width=512;c.height=512;const x=c.getContext('2d');x.fillStyle='#1b4f9c';x.fillRect(0,0,512,512);
 x.fillStyle='#cfe9ff';x.beginPath();x.arc(256,210,150,0,Math.PI*2);x.fill();
 const mt=(cx,w,h,col)=>{x.fillStyle=col;x.beginPath();x.moveTo(cx-w,330);x.lineTo(cx,330-h);x.lineTo(cx+w,330);x.fill();x.fillStyle='#ffffff';x.beginPath();x.moveTo(cx-w*.32,330-h*.68);x.lineTo(cx,330-h);x.lineTo(cx+w*.32,330-h*.68);x.lineTo(cx+w*.12,330-h*.6);x.lineTo(cx,330-h*.7);x.lineTo(cx-w*.14,330-h*.6);x.fill();};
 mt(180,120,170,'#5d7fa8');mt(320,140,220,'#3f6491');x.fillStyle='#ffffff';x.font='900 58px Nunito, sans-serif';x.textAlign='center';x.fillText('ANTARCTIC',256,400);x.font='900 50px Nunito, sans-serif';x.fillText('AIRLINES',256,456);
 return new THREE.CanvasTexture(c);}

// ---------- island 0: DASH (D4SH.av, shared!) private airport + Antarctic Airlines skyscraper + mansion
{const o=makeIsle(0,-130,36,true,'D4SH.av');const b=o.bld;
 b.add(box(58,.2,7,MT.road,0,.12,-15));for(let k=-5;k<=5;k++)b.add(box(2.4,.05,.4,MT.line,k*5,.24,-15));for(const x of [-27,27])for(let k=-2;k<=2;k++)b.add(box(.5,.05,1,MT.line,x,.24,-15+k*1.2));
 const hg=new THREE.Group();hg.add(box(10,5,8,std('#e9f0f5'),0,2.5,0));const hr=cyl(5,5,10,std('#c9d3dc'),0,5,0,16,);hr.rotation.z=Math.PI/2;hr.scale.set(1,1,.8);hg.add(hr);hg.add(box(6,4,.1,MT.dark,0,2,4.05));hg.position.set(20,0,-6);b.add(hg);
 const pj=plane('#ffffff','#1b4f9c','D4SH');pj.scale.setScalar(.55);pj.rotation.y=Math.PI/2;pj.position.set(-8,.3,-15);b.add(pj);
 const sk=new THREE.Group();const H=62;sk.add(box(9,H,9,std('#7fb6dc',{roughness:.12,metalness:.35}),0,H/2,0));for(let k=1;k<16;k++)sk.add(box(9.2,.3,9.2,std('#e9f0f5'),0,k*H/16,0));
 const lt=logoTex();for(let k=0;k<4;k++){const pl=new THREE.Mesh(new THREE.PlaneGeometry(8.4,8.4),new THREE.MeshBasicMaterial({map:lt}));const a=k*Math.PI/2;pl.position.set(Math.sin(a)*4.62,H-5.2,Math.cos(a)*4.62);pl.rotation.y=a;sk.add(pl);}
 sk.add(box(7,1.2,7,std('#e9f0f5'),0,H+.6,0));sk.add(cyl(.12,.3,8,MT.dark,0,H+5,0,6));sk.position.set(-15,0,6);b.add(sk);
 const mn=new THREE.Group();mn.add(box(13,4.6,7,whiteM,0,2.3,0));mn.add(box(13.4,.4,7.4,gold10,0,4.8,0));mn.add(box(8,3.6,5.6,whiteM,0,6.8,-.4));mn.add(box(8.4,.4,6,gold10,0,8.8,-.4));for(let k=0;k<5;k++)mn.add(cyl(.28,.28,4.6,whiteM,-4.8+k*2.4,2.3,3.9,8));
 for(let k=0;k<4;k++)mn.add(box(1.5,1.8,.06,MT.glass,-4.5+k*3,2.5,3.53));mn.add(box(7,.14,3.6,std('#3fb6e8',{roughness:.1}),0,.12,7.4));mn.position.set(13,0,8);b.add(mn);
 const ds=pawn('#2f7de1',1.2);ds.position.set(5,0,13);b.add(ds);o.dash=ds;
 const s=sign("D4SH'S ISLAND",'#1b4f9c','#ffffff',10,1.6);s.position.set(0,1.6,o.r-5.6);b.add(s);b.add(box(.3,1.6,.3,MT.dark,-4.8,.8,o.r-5.7));b.add(box(.3,1.6,.3,MT.dark,4.8,.8,o.r-5.7));
 for(const [x,z] of [[-28,6],[28,10],[-6,22]]){const p=palm10(.9);p.position.set(x,0,z);b.add(p);}}

// ---------- island 1: DANIEL — Italian style: pastel houses, terracotta roofs, bell tower, canal + gondola
{const o=makeIsle(-180,-130,28,true,'Daniel');const b=o.bld;
 b.add(box(40,.2,5,MT.water,0,.14,2));for(const x of [-5,6]){const br=new THREE.Mesh(new THREE.CylinderGeometry(3.2,3.2,2.2,16,1,false,0,Math.PI),stone10);br.rotation.z=Math.PI/2;br.rotation.y=Math.PI/2;br.scale.set(1,.35,1);br.position.set(x,.3,2);b.add(br);}
 const gd=new THREE.Group();gd.add(box(5,.5,1,blk,0,.4,0));const pr=new THREE.Mesh(new THREE.ConeGeometry(.4,1.2,4),blk);pr.rotation.z=-1.2;pr.position.set(2.8,.9,0);gd.add(pr);const gp=pawn('#ffffff',.7);gp.add(box(.7,.1,.7,std('#e8334f'),0,1.95,0));gp.position.set(-1.6,.6,0);gd.add(gp);gd.position.set(-12,0,2);b.add(gd);o.gond=gd;
 const PAST=['#f6c9a8','#f2e1a0','#f4b6a6','#e7d6c0','#f7d7c4','#d9e7c9','#f5c28e'];
 [[-14,-8],[-7,-9],[0,-8],[7,-9],[-12,10],[-4,11],[12,10]].forEach(([x,z],i)=>{const h=homeModel(5,4.6,4+(i%3)*1.4,std(PAST[i%PAST.length]),terra,i);h.position.set(x,0,z);h.rotation.y=z>0?0:Math.PI;b.add(h);});
 const bt=new THREE.Group();bt.add(box(4,22,4,brick,0,11,0));bt.add(box(4.6,.6,4.6,whiteM,0,17,0));for(let k=0;k<4;k++){const a=k*Math.PI/2;bt.add(box(1.4,2.4,.1,blk,Math.sin(a)*2.02,19.2,Math.cos(a)*2.02).rotateY(a));}
 bt.add(box(4.6,.5,4.6,whiteM,0,21,0));const rf=new THREE.Mesh(new THREE.ConeGeometry(3,4,4),terra);rf.rotation.y=Math.PI/4;rf.position.y=23.2;bt.add(rf);bt.position.set(15,0,-6);b.add(bt);
 for(const [x,z] of [[-20,-2],[20,4],[-19,6],[19,-12]]){const c=new THREE.Mesh(new THREE.ConeGeometry(1.1,7,8),dkgreen);c.position.set(x,3.5,z);c.castShadow=true;b.add(c);}
 const ft=new THREE.Group();ft.add(cyl(2.4,2.6,.8,stone10,0,.4,0,16));ft.add(cyl(2.1,2.1,.2,MT.water,0,.82,0,16));ft.add(cyl(.3,.4,2,stone10,0,1.4,0,8));ft.position.set(4,0,-15);b.add(ft);
 const dn=pawn('#3e8fe6',1.1);dn.position.set(2,0,8);b.add(dn);o.dan=dn;
 const s=sign('PICCOLA ITALIA','#2f8f4e','#ffffff',8,1.3);s.position.set(0,1.4,o.r-5.6);b.add(s);}

// ---------- island 2: CHILL (chilllikethatyk, day 2 of asking) — massive port + giant cruise ship
{const o=makeIsle(-90,-130,28,true,'@chilllikethatyk');const b=o.bld;
 b.add(box(44,1.2,8,MT.stone,0,-.2,o.r-6));for(let k=0;k<8;k++)b.add(cyl(.4,.5,.8,MT.dark,-19+k*5.4,.6,o.r-2.6,8));
 const tm=new THREE.Group();tm.add(box(18,6,9,std('#f4f4f4'),0,3,0));tm.add(box(18.4,.6,9.4,std('#2f7de1'),0,6.3,0));tm.add(box(16,2.4,.1,MT.glass,0,3,4.55));const ts=sign('CRUISE TERMINAL','#2f7de1','#ffffff',10,1.3);ts.position.set(0,5.1,4.6);tm.add(ts);tm.position.set(-4,0,6);b.add(tm);
 for(const x of [-18,15]){const cr=new THREE.Group();cr.add(box(.8,12,.8,std('#f2a33a'),0,6,0));cr.add(box(12,.7,.7,std('#f2a33a'),3,12,0));cr.add(box(.12,3.5,.12,MT.dark,8,10,0));cr.position.set(x,0,o.r-8);cr.rotation.y=-Math.PI/2;b.add(cr);}
 for(let k=0;k<10;k++)b.add(box(4,2,2.2,[MT.red,MT.blue,MT.orange,MT.teal,std('#f2c230'),MT.green][k%6],-16+(k%5)*4.4,1+(k>4?2:0),-8));
 const sh=new THREE.Group();const L0=58;sh.add(box(L0,6,10,std('#ffffff'),0,1,0));sh.add(box(L0+.1,1.2,10.1,std('#1b4f9c'),0,-1.2,0));const bw=new THREE.Mesh(new THREE.ConeGeometry(5,8,4),std('#ffffff'));bw.rotation.z=-Math.PI/2;bw.rotation.x=Math.PI/4;bw.scale.set(1,1,.98);bw.position.set(L0/2+3.6,1.4,0);sh.add(bw);
 for(let d=0;d<4;d++){const w=L0-8-d*8;sh.add(box(w,2.4,9-d*.8,std('#fbfbfb'),-3-d*1.5,5.2+d*2.4,0));for(const z of [1,-1])sh.add(box(w-1,.7,.06,std('#2d5f80',{roughness:.15}),-3-d*1.5,5.3+d*2.4,z*(4.5-d*.4+.03)));}
 for(const x of [-10,-2])sh.add(box(3.4,4.6,3.2,std('#e8334f'),x,16.8,0));for(let k=0;k<3;k++)sh.add(box(1.6,.6,.06,std('#2d5f80'),-L0/2+6+k*3,1.6,5.03));
 const cs=sign('HERBERG CRUISES','#1b4f9c','#ffffff',14,1.6);cs.position.set(8,2.2,5.06);sh.add(cs);sh.position.set(0,SEA-T10-.6,o.r+7);sh.traverse(q=>q.castShadow=true);b.add(sh);o.ship=sh;
 const ch=pawn('#9b59d6',1.2);ch.position.set(10,0,o.r-7);b.add(ch);o.chill=ch;
 const s=sign('CHILL CRUISE PORT','#1d232b','#f2c230',9,1.3);s.position.set(10,1.4,-o.r+8);s.rotation.y=Math.PI;b.add(s);}

// ---------- island 3: DAVE (D4VE) — the richest man in Herberg: Gold Island, bank, gold bars, statue
{const o=makeIsle(90,-130,28,true,'D4VE',std('#f5d76e'));const b=o.bld;
 const bk=new THREE.Group();bk.add(box(20,1.2,12,whiteM,0,.6,0));bk.add(box(18,8,10,std('#f7f1e1'),0,5.2,-.5));for(let k=0;k<7;k++)bk.add(cyl(.55,.55,8,whiteM,-7.8+k*2.6,5.2,5.2,10));
 const ped=new THREE.Mesh(new THREE.CylinderGeometry(3,3,20,3),gold10);ped.rotation.z=Math.PI/2;ped.rotation.x=Math.PI/2;ped.scale.set(1,1,.45);ped.position.set(0,10.4,4.4);bk.add(ped);bk.add(box(20,.8,12,gold10,0,9.4,-.4));
 const bs=sign("DAVE'S BANK",'#1d232b','#f2c230',9,1.4);bs.position.set(0,8.2,5.95);bk.add(bs);const ds=new THREE.Mesh(new THREE.SphereGeometry(1.6,12,8),gold10);ds.position.set(0,12.6,-1);bk.add(ds);bk.position.set(0,0,-8);b.add(bk);
 for(let s=0;s<3;s++)for(let k=0;k<4-s;k++)for(let j=0;j<2;j++)b.add(box(1.6,.6,.8,gold10,-15+k*1.7+s*.85,.3+s*.6,6+j*.9));
 for(let s=0;s<4;s++)for(let k=0;k<3;k++)b.add(box(1.4,.5,.7,cash,13+k*1.5,.25+s*.5,6+(s%2)*.4));
 const st=new THREE.Group();st.add(box(3,3,3,stone10,0,1.5,0));const gp=pawn('#f2c230',3.2);gp.traverse(q=>{if(q.isMesh)q.material=gold10;});gp.position.y=3;st.add(gp);const cr=cyl(.9,1.1,1,gold10,0,3+5.7,0,8);st.add(cr);st.position.set(0,0,9);b.add(st);
 const dv=pawn('#2f7de1',1.2);dv.add(box(.6,.4,.6,blk,0,2,0));dv.add(box(.9,.06,.9,blk,0,1.82,0));dv.position.set(5,0,12);b.add(dv);o.dave=dv;
 const coins=[];for(let k=0;k<14;k++){const c=cyl(.5,.5,.12,gold10,0,0,0,12);c.rotation.x=Math.PI/2;b.add(c);coins.push(c);}o.coins=coins;
 const s=sign('RICHEST MAN IN HERBERG','#f2c230','#1d232b',12,1.4);s.position.set(0,1.4,o.r-5.6);b.add(s);}

// ---------- island 4: JOMOTHY — the Jomothy Grand Hotel on the beach
{const o=makeIsle(180,-130,28,true,'Jomothy');const b=o.bld;
 const ht=new THREE.Group();const HH=26;ht.add(box(24,HH,8,std('#fdf6ea'),0,HH/2,0));for(let f=1;f<9;f++){ht.add(box(24.4,.35,9.6,std('#ffffff'),0,f*HH/9,.6));for(let k=0;k<6;k++)ht.add(box(2.6,1.6,.06,MT.glass,-10+k*4,f*HH/9+1.2,4.03));}
 ht.add(box(24.6,1.2,8.6,std('#e8334f'),0,HH+.6,0));const hs=sign('JOMOTHY GRAND HOTEL','#e8334f','#ffffff',14,2);hs.position.set(0,HH+3,0);ht.add(hs);ht.add(box(.3,2.4,.3,MT.dark,-5,HH+1.6,0));ht.add(box(.3,2.4,.3,MT.dark,5,HH+1.6,0));
 ht.add(box(6,3.4,2,std('#e8334f'),0,1.7,5));ht.position.set(0,0,-8);b.add(ht);
 b.add(box(14,.3,7,std('#e8e2d2'),-5,.15,7));b.add(box(12,.2,5.4,std('#3fb6e8',{roughness:.1}),-5,.26,7));
 [['#e8334f',8,8],['#2f7de1',12,12],['#f2c230',16,7],['#e8334f',4,15]].forEach(([c,x,z])=>{const u=new THREE.Group();u.add(cyl(.1,.1,3,MT.white,0,1.5,0,6));const cn=new THREE.Mesh(new THREE.ConeGeometry(2,1,10),std(c));cn.position.y=3.1;u.add(cn);u.add(box(2.4,.25,.9,MT.white,1.4,.4,0));u.position.set(x,0,z);b.add(u);});
 for(const [x,z] of [[-20,-4],[20,-2],[-17,12],[19,14],[-8,17]]){const p=palm10(1);p.position.set(x,0,z);b.add(p);}
 const jm=pawn('#ff8a4c',1.2);jm.add(box(.6,.5,.08,std('#ffffff'),0,1,.32));jm.position.set(-1,0,13);b.add(jm);o.jom=jm;
 const gs=[];for(let k=0;k<4;k++){const p=pawn(['#30c2a8','#9b59d6','#f2d33a','#e85d75'][k],.8);p.position.set(-9+k*3,0,7);b.add(p);gs.push(p);}o.guests=gs;}

// ---------- island 5: BOSNJAK (bosnjak_16_) — the presidential palace
{const o=makeIsle(-180,-215,28,false,'bosnjak_16_');const b=o.bld;
 const pl=new THREE.Group();pl.add(box(26,1.2,14,stone10,0,.6,0));pl.add(box(24,7,11,whiteM,0,4.7,-1));pl.add(box(24.4,.6,11.4,std('#d9b04a',{metalness:.4}),0,8.4,-1));
 for(let k=0;k<8;k++)pl.add(cyl(.5,.5,7,whiteM,-9.8+k*2.8,4.7,5.6,10));const ped=new THREE.Mesh(new THREE.CylinderGeometry(3,3,24,3),whiteM);ped.rotation.z=Math.PI/2;ped.rotation.x=Math.PI/2;ped.scale.set(1,1,.42);ped.position.set(0,9.6,5);pl.add(ped);
 const dm=new THREE.Mesh(new THREE.SphereGeometry(4.6,20,12,0,Math.PI*2,0,Math.PI/2),std('#d9b04a',{metalness:.5,roughness:.3}));dm.position.set(0,8.8,-2);pl.add(dm);pl.add(cyl(4.7,4.7,2,whiteM,0,9.4,-2,20));
 const f=flagPole(pl,-.9,13.4,-2,1.4);o.flag=f;for(let k=0;k<5;k++)pl.add(box(1.4,2.4,.06,MT.glass,-8+k*4,4.4,4.53));
 const ps=sign('PRESIDENTIAL PALACE','#1d3f8a','#ffffff',11,1.4);ps.position.set(0,8,6.5);pl.add(ps);pl.position.set(0,0,-6);b.add(pl);
 b.add(box(3,.08,16,std('#c92a2a'),0,.1,9));for(const x of [-3,3])for(let k=0;k<3;k++){const gd=pawn('#1d232b',1);gd.add(cyl(.32,.32,.8,blk,0,2.1,0,8));gd.position.set(x,0,4+k*5);b.add(gd);}
 const pr=pawn('#1d232b',1.3);const sash=box(.08,1.2,.08,std('#e8334f'),0,.9,.34);sash.rotation.z=.7;pr.add(sash);pr.add(box(.9,.12,.9,blk,0,1.95,0));pr.position.set(0,0,15);b.add(pr);o.pres=pr;
 for(const x of [-12,12]){const f2=flagPole(b,x,0,14,1.3);}for(const [x,z] of [[-19,8],[19,8],[-18,-12],[18,-12]]){const t=tree8(1.2);t.position.set(x,0,z);b.add(t);}}

// ---------- island 6: UI UI (Xx_ui_ui_xX) — "make my pork farm bigger": a whole farm island
{const o=makeIsle(-90,-215,28,false,'Xx_ui_ui_xX');const b=o.bld;
 const bn=new THREE.Group();bn.add(box(12,7,9,std('#c0392b'),0,3.5,0));const rf=new THREE.Mesh(new THREE.CylinderGeometry(4.8,4.8,12.4,4,1),std('#5f646b'));rf.rotation.z=Math.PI/2;rf.rotation.x=Math.PI/4;rf.scale.set(1,1,1.2);rf.position.y=7.2;bn.add(rf);
 bn.add(box(4,4.4,.1,std('#f4f4f4'),0,2.2,4.55));bn.add(box(3.6,.3,.12,std('#c0392b'),0,2.2,4.6).rotateZ(.8));bn.add(box(3.6,.3,.12,std('#c0392b'),0,2.2,4.6).rotateZ(-.8));bn.position.set(-10,0,-10);b.add(bn);
 const sl=new THREE.Group();sl.add(cyl(2.4,2.4,14,std('#cfd8e0',{metalness:.4}),0,7,0,16));sl.add(new THREE.Mesh(new THREE.SphereGeometry(2.4,16,8,0,Math.PI*2,0,Math.PI/2),std('#cfd8e0',{metalness:.4})).translateY(14));sl.position.set(1,0,-12);b.add(sl);
 fence(b,-20,20,-2,18,0,'#f3ecd8',3);b.add(box(10,.12,6,std('#7a5230'),-6,.08,10));
 const pigs=[];for(let k=0;k<14;k++){const p=pig(1.1);const a=k*2.399;p.position.set(Math.cos(a)*(4+k*.9)*.95,0,8+Math.sin(a)*(3+k*.35)*.9);p.rotation.y=a*1.7;b.add(p);pigs.push(p);}o.pigs=pigs;
 const fm=pawn('#3e8fe6',1.2);fm.add(cyl(.9,.9,.12,std('#e2c27a'),0,1.92,0,12));fm.add(cyl(.38,.38,.3,std('#e2c27a'),0,2.08,0,10));fm.position.set(12,0,0);b.add(fm);o.farmer=fm;
 const s=sign('UI UI PORK FARM','#c0392b','#ffffff',9,1.4);s.position.set(0,1.4,o.r-4.8);b.add(s);
 for(const [x,z] of [[18,-12],[-21,4],[20,6]]){const t=tree8(1.1);t.position.set(x,0,z);b.add(t);}}

// ---------- island 7: ONLINE STRANGER — "make the military stronger": Fortress Island
{const o=makeIsle(0,-215,30,false,'Online_Stranger',std('#a7b08a'));const b=o.bld;
 const R=19;for(let k=0;k<24;k++){const a=k/24*Math.PI*2;if(Math.abs(Math.sin(a))<.12&&Math.cos(a)<0)continue;const w=box(5.2,4.4,1.6,stone10,Math.sin(a)*R,2.2,Math.cos(a)*R);w.rotation.y=a;b.add(w);if(k%2==0)b.add(box(1.4,1,1.7,stone10,Math.sin(a)*R,4.9,Math.cos(a)*R).rotateY(a));}
 for(let k=0;k<4;k++){const a=k*Math.PI/2+Math.PI/4;const tw=new THREE.Group();tw.add(cyl(2.6,3,9,stone10,0,4.5,0,12));tw.add(cyl(3.1,3.1,1,stone10,0,9.4,0,12));tw.position.set(Math.sin(a)*R,0,Math.cos(a)*R);b.add(tw);}
 const tks=[];[[-7,4,.3],[0,7,0],[7,3,-.3]].forEach(([x,z,r])=>{const t=tank10();t.position.set(x,0,z);t.rotation.y=-Math.PI/2+r;b.add(t);tks.push(t);});o.tanks=tks;
 const hp=new THREE.Group();hp.add(cyl(6,6,.2,MT.road,0,.1,0,24));hp.add(box(.6,.05,5,MT.line,-1.5,.22,0));hp.add(box(.6,.05,5,MT.line,1.5,.22,0));hp.add(box(3,.05,.6,MT.line,0,.22,0));hp.position.set(0,0,-8);b.add(hp);
 const fj=fighter();fj.position.set(0,0,-8);fj.rotation.y=Math.PI/2;b.add(fj);o.jet=fj;
 const rd=new THREE.Group();rd.add(box(.4,5,.4,MT.dark,0,2.5,0));const dish=new THREE.Mesh(new THREE.SphereGeometry(2.4,14,8,0,Math.PI*2,0,Math.PI/2.6),std('#f4f4f4',{side:THREE.DoubleSide}));dish.rotation.x=-Math.PI/2.4;dish.position.y=5.4;rd.add(dish);rd.position.set(11,0,-10);b.add(rd);o.radar=rd;
 const ws=new THREE.Group();ws.add(box(36,3,7,navy10,0,0,0));const bw=new THREE.Mesh(new THREE.ConeGeometry(3.5,6,4),navy10);bw.rotation.z=-Math.PI/2;bw.rotation.x=Math.PI/4;bw.position.set(21,0,0);ws.add(bw);
 ws.add(box(8,4,5,navy10,-4,3.5,0));ws.add(box(4,3,3.6,navy10,-4,7,0));ws.add(cyl(.2,.2,5,MT.dark,-4,10.5,0,6));const gt=new THREE.Group();gt.add(box(3,1.4,2.6,navy10,0,0,0));gt.add(cyl(.2,.2,4,navy10,2.4,0,0,8).rotateZ(Math.PI/2));gt.position.set(10,2.2,0);ws.add(gt);
 ws.add(box(36.1,.5,7.1,std('#c0392b'),0,-1.4,0));const ns=sign('HNS HERBERG','#7d8a96','#ffffff',8,1.2);ns.position.set(4,.4,3.56);ws.add(ns);ws.position.set(0,SEA-T10+.4,o.r+9);ws.traverse(q=>q.castShadow=true);b.add(ws);o.war=ws;
 const os=pawn('#5d7a46',1.2);os.add(cyl(.35,.35,.3,std('#5d7a46'),0,1.92,0,10));os.position.set(-3,0,13);b.add(os);o.soldier=os;
 const s=sign('FORTRESS ISLAND','#3b4a2a','#ffffff',9,1.4);s.position.set(0,6.2,R+.9);b.add(s);}

// ---------- island 8: KINGDOM OF EGYPT — "expand the island" + a pyramid
{const o=makeIsle(90,-215,28,false,'Kingdom of Egypt',std('#e6c77e'));const b=o.bld;
 const py=new THREE.Mesh(new THREE.ConeGeometry(15,17,4),std('#e0b866',{flatShading:true}));py.rotation.y=Math.PI/4;py.position.set(0,8.5,-6);py.castShadow=true;b.add(py);
 const cap=new THREE.Mesh(new THREE.ConeGeometry(2.6,3,4),gold10);cap.rotation.y=Math.PI/4;cap.position.set(0,15.6,-6);b.add(cap);
 for(const x of [-15,15]){const p2=new THREE.Mesh(new THREE.ConeGeometry(5,6,4),std('#d9ad5a',{flatShading:true}));p2.rotation.y=Math.PI/4;p2.position.set(x,3,-12);p2.castShadow=true;b.add(p2);}
 const ob=new THREE.Group();ob.add(box(1.6,12,1.6,std('#d8c39a'),0,6,0));const ot=new THREE.Mesh(new THREE.ConeGeometry(1.15,1.6,4),gold10);ot.rotation.y=Math.PI/4;ot.position.y=12.8;ob.add(ot);ob.position.set(13,0,7);b.add(ob);
 const sx=new THREE.Group();sx.add(box(7,2.4,3,std('#d9ad5a'),0,1.2,0));sx.add(box(2.6,3,2.6,std('#d9ad5a'),3.6,2.6,0));sx.add(box(.6,2.6,3.2,std('#2f7de1'),3.6,2.8,0));sx.position.set(-9,0,8);sx.rotation.y=-.3;b.add(sx);
 for(const [x,z] of [[-20,0],[20,-2],[-4,15],[18,14]]){const p=palm10(1);p.position.set(x,0,z);b.add(p);}
 b.add(box(10,.15,5,MT.water,4,.1,14));const eg=pawn('#f2c230',1.2);eg.add(cyl(.5,.3,.8,std('#2f7de1'),0,2.1,0,8));eg.position.set(0,0,10);b.add(eg);o.eg=eg;
 const s=sign('EGYPT ISLAND','#d9ad5a','#1d232b',8,1.3);s.position.set(0,1.4,o.r-5);b.add(s);}

// ---------- island 9: PUNZIST (PunzistTV) — "the back of the island is a forest": your own forest island
{const o=makeIsle(180,-215,28,false,'PunzistTV',std('#5fae4a'));const b=o.bld;
 for(let k=0;k<46;k++){const a=k*2.399,r=7+((k*37)%17);const x=Math.cos(a)*r,z=Math.sin(a)*r;if(z>6&&Math.abs(x)<9)continue;const t=k%3?pine10(1.1+((k*13)%5)*.12):tree8(1+((k*7)%4)*.1);t.position.set(x,0,z);t.rotation.y=k;b.add(t);}
 const cb=new THREE.Group();cb.add(box(7,4,5.4,std('#8a5a33'),0,2,0));for(let k=0;k<5;k++)cb.add(box(7.2,.25,5.6,std('#6b4423'),0,.5+k*.8,0));cb.add(roof4(8,3,std('#3d6b3a'),5.4,6.6));
 cb.add(box(1.2,2,.1,std('#5a3a1f'),0,1,2.75));cb.add(box(1.4,1,.06,std('#ffe9a8',{emissive:'#ffd36b',emissiveIntensity:.8}),2.2,2.2,2.74));cb.add(box(.8,2.6,.8,MT.stone,2.4,6.2,-1));cb.position.set(0,0,0);b.add(cb);
 const fire=new THREE.Group();for(let k=0;k<5;k++){const l=box(1.6,.25,.25,MT.wood,0,.15,0);l.rotation.y=k*1.26;fire.add(l);}const fl=new THREE.Mesh(new THREE.ConeGeometry(.6,1.6,7),std('#ff8a2a',{emissive:'#ff6a00',emissiveIntensity:1.4}));fl.position.y=.9;fire.add(fl);fire.position.set(3,0,9);b.add(fire);o.flame=fl;
 const pz=pawn('#e8334f',1.2);pz.position.set(0,0,10);b.add(pz);o.pz=pz;const puffs=[];for(let k=0;k<5;k++){const p=new THREE.Mesh(new THREE.IcosahedronGeometry(.7,0),new THREE.MeshStandardMaterial({color:'#d8d8d8',transparent:true,opacity:.7}));b.add(p);puffs.push(p);}o.puffs=puffs;
 const s=sign("PUNZIST'S FOREST",'#2f6b3a','#ffffff',9,1.4);s.position.set(0,1.4,o.r-4.8);b.add(s);}
ISL10.forEach(o=>o.g.traverse(q=>{if(q.isMesh){q.castShadow=true;q.receiveShadow=true;}}));

// ---------- 🚂 William Newham: the train now runs on STEAM
const steam=(()=>{const g=new THREE.Group();const bk=std('#1d232b'),rd=std('#c0392b'),br=std('#d9b04a',{metalness:.5,roughness:.3});
 const bo=cyl(1.05,1.05,4.4,bk,0,1.9,.9,16);bo.rotation.x=Math.PI/2;g.add(bo);g.add(cyl(1.1,1.1,.2,br,0,1.9,3.1,16).rotateX(Math.PI/2));g.add(box(2.4,.5,6.4,rd,0,.6,0));
 g.add(cyl(.32,.45,1.6,bk,0,3.5,2.4,10));g.add(cyl(.55,.4,.4,bk,0,4.4,2.4,10));g.add(new THREE.Mesh(new THREE.SphereGeometry(.45,10,6,0,Math.PI*2,0,Math.PI/2),br).translateY(2.95).translateZ(.6));
 g.add(box(2.4,2.6,2,bk,0,2.4,-2.1));g.add(box(2.6,.25,2.3,rd,0,3.8,-2.1));for(const x of [-1.21,1.21])g.add(box(.06,.9,1,MT.glass,x,2.9,-2));
 const cw=new THREE.Mesh(new THREE.ConeGeometry(1.1,1,4),rd);cw.rotation.x=Math.PI/2;cw.rotation.y=Math.PI/4;cw.scale.set(1,.5,1);cw.position.set(0,.5,3.5);g.add(cw);
 const wh=[];for(const z of [-2,-.5,1])for(const x of [-1.15,1.15]){const w=cyl(.62,.62,.2,rd,x,.62,z,14);w.rotation.z=Math.PI/2;g.add(w);wh.push(w);}g.userData.wh=wh;
 g.traverse(o=>o.castShadow=true);g.visible=false;scene.add(g);return g;})();
const SPUFF=[...Array(10)].map(()=>{const p=new THREE.Mesh(new THREE.IcosahedronGeometry(.8,1),new THREE.MeshStandardMaterial({color:'#f2f2f2',transparent:true,opacity:.85,flatShading:true}));p.visible=false;scene.add(p);return p;});
const locoU=t=>-72+((t*14)%164);
const locoAt=t=>{const u=locoU(t);const p=LW(u,RLV),q=LW(u+1,RLV);return {p:v3(p.x,RLY+.3,p.y),d:v3(q.x-p.x,0,q.y-p.y).normalize()};};

// ---------- timeline (design time)
const TD=[0,4.8,10.8,15.2,20.2,25.0,29.0,32.8,36.8,41.6,45.6,51.2,55.6,64];
const ORDER=[0,1,2,3,4,5,6,7,8,9];               // beat k (1..10) shows island ORDER[k-1]
const isleCam=(i,far=1)=>{const o=ISL10[i];const R=o.r/28;return {p:[IL(i,-24*R*far,34*R*far,92*R*far),IL(i,-10*R*far,28*R*far,80*R*far)],l:[IL(i,0,7*R,0),IL(i,0,7*R,0)],f:50};};
const SH=[
 {t0:0,t1:4.8, p:[L(-150,-480,360),L(150,-480,360)], l:[L(-150,-235,0),L(150,-235,0)], f:50},
];
ORDER.forEach((i,k)=>{const c=isleCam(i);SH.push(Object.assign({t0:TD[k+1],t1:TD[k+2]},c));});
SH[1].p=[IL(0,40,50,112),IL(0,22,44,100)];SH[1].l=[IL(0,0,14,0),IL(0,0,16,0)];   // Dash: room for the skyscraper
SH[3].p=[IL(2,-24,84,62),IL(2,-12,76,54)];SH[3].l=[IL(2,0,2,6),IL(2,0,2,6)];     // Chill: ship in front
SH[8].p=[IL(7,-26,36,104),IL(7,-12,30,92)];SH[8].l=[IL(7,0,5,10),IL(7,0,5,10)];      // fortress + warship
SH.push({t0:51.2,t1:55.6,train:true,f:50});
SH.push({t0:55.6,t1:64, p:[L(0,-420,330),L(0,-470,420)], l:[L(0,-150,0),L(0,-150,0)], f:50});
const DUR=64;
const TR=window.DAY10_TR||TD, RDUR=TR[TR.length-1];
const pw=(x,A,B)=>{for(let i=0;i<A.length-1;i++)if(x<=A[i+1]||i==A.length-2)return B[i]+(B[i+1]-B[i])*clamp((x-A[i])/(A[i+1]-A[i]));};
const toD=tr=>pw(tr,TR,TD), toR=td=>pw(td,TD,TR);
const COL=[2,0,1,3,4,0,1,2,3,4];ISL10.forEach((o,i)=>{o.t=.3+COL[i]*.85+(i>=5?.3:0);o.tb=TD[ORDER.indexOf(i)+1]+.35;});
const caps=[['c1',.2,4.8,TXT.d0],['c1',4.8,10.8,TXT.d1],['c2',7.6,10.8,TXT.d1b],['c1',10.8,15.2,TXT.d2],['c1',15.2,20.2,TXT.d3],['c1',20.2,25,TXT.d4],['c1',25,29,TXT.d5],['c1',29,32.8,TXT.d6],
 ['c1',32.8,36.8,TXT.d7],['c1',36.8,41.6,TXT.d8],['c1',41.6,45.6,TXT.d9],['c1',45.6,51.2,TXT.d10],['c1',51.2,55.6,TXT.d11],['c1',55.6,DUR,TXT.d12],['c2',60.4,DUR,TXT.d12b]];
const wp=g=>g.getWorldPosition(v3(0,0,0));
const TAGS=[
 ["🏝️ D4SH'S ISLAND",'D4SH.av',()=>wp(ISL10[0].dash).add(v3(0,4,0)),5.6,10.8],
 ['🍝 ITALIAN ISLAND','Daniel',()=>wp(ISL10[1].dan).add(v3(0,3.5,0)),11.6,15.2],
 ['🛳️ CRUISE PORT','@chilllikethatyk',()=>wp(ISL10[2].chill).add(v3(0,4,0)),16.0,20.2],
 ['💰 GOLD ISLAND','D4VE',()=>wp(ISL10[3].dave).add(v3(0,4,0)),21.0,25],
 ['🏨 GRAND HOTEL','Jomothy Malawicab',()=>wp(ISL10[4].jom).add(v3(0,4,0)),25.8,29],
 ['🏛️ MR. PRESIDENT','bosnjak_16_',()=>wp(ISL10[5].pres).add(v3(0,4.5,0)),29.8,32.8],
 ['🐷 PORK FARM','Xx_ui_ui_xX',()=>wp(ISL10[6].farmer).add(v3(0,4.5,0)),33.6,36.8],
 ['🛡️ FORTRESS ISLAND','Online_Stranger',()=>wp(ISL10[7].soldier).add(v3(0,4,0)),37.6,41.6],
 ['🔺 PYRAMID ISLAND','socialist Kingdom of Egypt',()=>wp(ISL10[8].eg).add(v3(0,4.5,0)),42.4,45.6],
 ['🌲 FOREST ISLAND','PunzistTV',()=>wp(ISL10[9].pz).add(v3(0,4,0)),46.6,51.2],
 ['🚂 STEAM TRAIN','William Newham',()=>wp(steam).add(v3(0,6,0)),52.0,55.6],
];
$('tags').innerHTML=TAGS.map(t=>`<div class="ntag"><div class="tt">${t[0]}</div><div class="ts">${t[1]}</div></div>`).join('');
window.CAPTION_TIMES=[...new Set(caps.map(c=>c[1]))].concat(TAGS.map(t=>t[3]),ISL10.map(o=>o.t),ISL10.map(o=>o.tb),[56.4,57.0,59.0,60.0]).map(toR);
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
 for(const g of POP9){g.visible=true;g.scale.setScalar(1);}
 
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

 // Day 9 builds all standing now
 hcarsAt(t); metroAt(t);
 floodW.visible=false; FWALL.forEach(w=>{w.visible=true;w.position.y=w.userData.y0+3.4;}); rain9At(t,0); sun.intensity=2.3; scene.background.set('#8fd0ff');
 scene.fog.near=1400; scene.fog.far=2600;
 ISL.forEach(g=>g.visible=false);
 { const P=petHosp.userData;P.pt.userData.tl.rotation.z=.5+Math.sin(t*9)*.5;P.vet.rotation.y=Math.sin(t*1.4)*.5;P.amb.children[2].material.emissiveIntensity=Math.sin(t*12)>0?2:.2; }
 mansion9.userData.mk.rotation.y=Math.sin(t*1.1)*.6;
 atc.userData.rad.rotation.y=t*2.2;atc.userData.bcn.material.emissiveIntensity=Math.sin(t*5)>0?2:.2;
 watch9.userData.fl.rotation.y=Math.sin(t*2)*.25;watch9.userData.jn.rotation.y=Math.sin(t*.9)*.8;
 { const U=uni.userData;U.pr.rotation.y=Math.sin(t*1.3)*.5;U.st.forEach((p,i)=>{p.position.y=U.T+Math.max(0,Math.sin(t*3+i*1.7))*.15;}); }
 // Day 10: the ten islands rise, then each one is filled in on its beat
 const wide=t<4.8||t>=55.6;
 ISL10.forEach((o,i)=>{const kk=clamp((t-o.t)/.6);o.g.visible=kk>0;if(kk>0){o.g.scale.setScalar(Math.max(.001,backOut(kk)));o.g.position.y=SEA-9+9*ease(kk);}
   const kb=clamp((t-o.tb)/.55);o.bld.visible=kb>0;if(kb>0)o.bld.scale.setScalar(Math.max(.001,backOut(kb)));
   o.sp.material.opacity=wide?clamp((t-o.t-.3)/.3):0;o.sp.visible=wide;});
 { const o=ISL10[0];o.dash.rotation.y=Math.sin(t*1.2)*.6;o.dash.position.y=Math.max(0,Math.sin(t*5))*.4*(t>7.6&&t<10.8?1:0); }
 { const o=ISL10[1];o.gond.position.x=-12+((t*2.2)%26);o.dan.rotation.y=Math.sin(t)*.6; }
 { const o=ISL10[2];o.ship.position.y=SEA-T10-.6+Math.sin(t*1.1)*.15;o.chill.rotation.y=Math.sin(t*1.4)*.7; }
 { const o=ISL10[3];o.dave.rotation.y=Math.sin(t*1.3)*.5;o.coins.forEach((c,i)=>{const ph=((t*.6+i/14)%1);c.position.set(Math.sin(i*2.1)*6,14-ph*14+3,4+Math.cos(i*2.1)*4);c.rotation.y=t*4+i;c.visible=t>20.4&&t<25.2;}); }
 { const o=ISL10[4];o.jom.rotation.y=Math.sin(t*1.5)*.6;o.guests.forEach((p,i)=>{p.position.y=Math.abs(Math.sin(t*3+i))*.2;}); }
 { const o=ISL10[5];o.pres.rotation.y=Math.sin(t*.8)*.4;o.pres.children.forEach(()=>{});o.flag.rotation.y=Math.sin(t*3)*.12; }
 { const o=ISL10[6];o.pigs.forEach((p,i)=>{p.userData.hd.rotation.z=Math.sin(t*4+i)*.2;p.position.y=Math.max(0,Math.sin(t*5+i*1.3))*.2;});o.farmer.rotation.y=Math.sin(t*1.2)*.6; }
 { const o=ISL10[7];o.tanks.forEach((tk,i)=>{tk.userData.tu.rotation.y=Math.sin(t*.9+i*1.7)*.6;});o.radar.rotation.y=t*1.8;o.war.position.y=SEA-T10+.4+Math.sin(t*1.2)*.15;
   const jk=clamp((t-39.4)/2);o.jet.position.set(0,1.2+jk*jk*40,-8);o.jet.position.x=-jk*jk*30;o.jet.rotation.z=-jk*.4; }
 { const o=ISL10[8];o.eg.rotation.y=Math.sin(t*1.1)*.6; }
 { const o=ISL10[9];o.flame.scale.set(1,1+Math.sin(t*14)*.18,1);o.pz.rotation.y=Math.sin(t*.9)*.7;o.puffs.forEach((p,i)=>{const ph=((t*.3+i/5)%1);p.position.set(2.4+ph*2,7+ph*7,-1);p.scale.setScalar(.6+ph*1.8);p.material.opacity=.7*(1-ph);}); }
 // steam engine replaces the old locomotive
 { train[0].visible=false;steam.visible=true;steam.position.copy(train[0].position);steam.quaternion.copy(train[0].quaternion);steam.userData.wh.forEach(w=>w.rotation.x=t*8);
   SPUFF.forEach((p,i)=>{const ph=((t*1.1+i/10)%1);const L0=locoAt(t-ph*.9);const c=L0.p.clone().addScaledVector(L0.d,2.4);p.visible=true;p.position.set(c.x,c.y+4.6+ph*7,c.z);p.scale.setScalar(.5+ph*2.2);p.material.opacity=.85*(1-ph);}); }
 if(sh.train){const L0=locoAt(t);const side=v3(-L0.d.z,0,L0.d.x);camera.position.copy(L0.p).addScaledVector(L0.d,9-3*k).addScaledVector(side,13).add(v3(0,6,0));camera.lookAt(L0.p.clone().addScaledVector(L0.d,-2).add(v3(0,2,0)));}
 else {camera.position.lerpVectors(sh.p[0],sh.p[1],k); camera.lookAt(new THREE.Vector3().lerpVectors(sh.l[0],sh.l[1],k));}
 camera.fov=sh.f||46; camera.updateProjectionMatrix();
 renderer.render(scene,camera);

 // ---------- UI ----------
 const used={c1:false,c2:false};
 for(const [id,a,b,txt] of caps){ if(t>=a&&t<=b){const el=$(id); if(el.dataset.txt!==txt){el.innerHTML=txt;el.dataset.txt=txt;} popAt(el,t,a,b); used[id]=true; } }
 for(const id in used) if(!used[id]) $(id).style.opacity=0;
 $('popn').textContent=(1462).toLocaleString('en-US');
 popAt($('votes'),t,56.4,60.2); $('barA').style.width='0%'; $('barB').style.width='0%'; $('nA').textContent='?'; $('nB').textContent='?';
 [...$('goals').children].forEach(el=>popAt(el,t,99,0));
 [...$('tags').children].forEach((el,i)=>{const [_,__,pf,a,b]=TAGS[i];const pp=proj(pf());el.dataset.base='translate(-50%,-100%)';const hw=el.offsetWidth/2+24;el.style.left=Math.min(1080-hw,Math.max(hw,pp[0]))+'px';el.style.top=Math.max(560+el.offsetHeight+18,pp[1])+'px';popAt(el,t,a,b);if(pp[2]>1)el.style.opacity=0;});
 [...$('laws').children].forEach((c,i)=>popAt(c,t,60.4+i*1.0,DUR));
 let fl=0; for(const c of window.CUTS){ if(c>0&&tr>=c&&tr<c+.12) fl=.5*(1-(tr-c)/.12);} $('flash').style.opacity=fl;
};
window.DUR=RDUR; window.__T2={camera,renderer,scene,L,LW};
document.fonts.ready.then(()=>{window.setTime(0);window.READY=true;});
