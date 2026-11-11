// ===== WORLD AFTER DAY 3 (pizzeria, citizens, eruption, islands, ruins) — shared by Day 3+ episodes =====
const STATS={views:17300,likes:570,shares:23,saves:112,followers:1160,votesA:32,votesB:6};
city.forEach(g=>g.userData.t=-1);                 // the capital already exists on day 3

// ---------- helpers
function swapTownHouse(u,v){let best=null,bd=1e9;for(const g of city){if(!g.userData.uv)continue;const d=Math.hypot(g.userData.uv[0]-u,g.userData.uv[1]-v);if(d<bd){bd=d;best=g;}}
 if(best){best.userData.gone=true;return best.userData.uv;}return [u,v];}
const glow=(c)=>new THREE.MeshBasicMaterial({color:c});

// ---------- pizzeria (law A: free pizza every Friday) — idea @nikothecatty, baker @mizomin52
const PZ=swapTownHouse(5,-6);
const pizzeria=(()=>{const g=new THREE.Group();g.add(box(4.6,5,4,MT.wall,0,.5,0));g.add(roof4(4.8,1.6,MT.red,3.8));
 for(let i=0;i<6;i++)g.add(box(.77,.12,1.4,i%2?MT.white:MT.red,-1.93+i*.77,2.4,2.6));
 const pc=document.createElement('canvas');pc.width=pc.height=256;const x=pc.getContext('2d');x.fillStyle='#e9b35f';x.beginPath();x.arc(128,128,124,0,7);x.fill();x.fillStyle='#d9473b';x.beginPath();x.arc(128,128,100,0,7);x.fill();
 x.fillStyle='#ffe08a';for(let i=0;i<9;i++){x.beginPath();x.arc(128+Math.cos(i*2.1)*60,128+Math.sin(i*2.1)*55,16,0,7);x.fill();}x.fillStyle='#8a2a1e';for(let i=0;i<7;i++){x.beginPath();x.arc(128+Math.cos(i*1.3+1)*40,128+Math.sin(i*1.7)*70,12,0,7);x.fill();}
 const sign=new THREE.Mesh(new THREE.CircleGeometry(1.7,24),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(pc),side:THREE.DoubleSide}));sign.position.set(0,6.2,1.2);g.add(sign);g.userData.sign=sign;
 g.add(box(1,1.8,.1,MT.wood,0,.4,2.02));return place(g,PZ[0],PZ[1],10.6,0,.3);})();

// ---------- 1,160 citizens (instanced)
const N=STATS.followers, bodyGI=new THREE.CapsuleGeometry(.32,.7,4,8), headGI=new THREE.SphereGeometry(.27,10,8);
const cMat=new THREE.MeshStandardMaterial({roughness:.5});
const bodies=new THREE.InstancedMesh(bodyGI,cMat,N), heads=new THREE.InstancedMesh(headGI,cMat,N);
const CROWD=[];const PCOL=['#f2a33a','#30c2a8','#9b59d6','#e85d75','#3e8fe6','#f2d33a','#7bd65b','#ff8a4c','#ff6fb1','#5fd3f3'];
for(let i=0;i<60000&&CROWD.length<N;i++){const x=(rnd()-.5)*200,z=(rnd()-.5)*200,y=H(x,z);
 if(y<SEA+.8||y>16||riverDist(x,z)<4)continue; if(Math.hypot(x-CITY.x,z-CITY.y)<22)continue; if(Math.hypot(x-SITE_B.x,z-SITE_B.y)<13)continue;
 const near=Math.hypot(x-CITY.x,z-CITY.y); if(rnd()>Math.max(.12,1-near/120))continue;        // denser around the capital
 CROWD.push({x,y,z,t:4.3+rnd()*5.2,c:new THREE.Color(PCOL[CROWD.length%PCOL.length])});}
CROWD.forEach((p,i)=>{bodies.setColorAt(i,p.c);heads.setColorAt(i,p.c);});
bodies.castShadow=heads.castShadow=true;scene.add(bodies,heads);
const _m=new THREE.Matrix4(),_q=new THREE.Quaternion(),_s=new THREE.Vector3(),_p=new THREE.Vector3();
function crowdAt(t){let landed=0;for(let i=0;i<CROWD.length;i++){const p=CROWD[i],d=t-p.t;let y,sc=1.9;
  if(p.hide||d<-.5){sc=0;y=p.y;} else if(d<0){y=p.y+(-d)*60;} else {landed++;y=p.y+Math.abs(Math.sin(d*9))*Math.exp(-d*5)*1.2;}
  _s.set(sc,sc,sc);_q.identity();_p.set(p.x,y+.7*sc-.1,p.z);_m.compose(_p,_q,_s);bodies.setMatrixAt(i,_m);_p.y=y+1.55*sc-.1;_m.compose(_p,_q,_s);heads.setMatrixAt(i,_m);}
 bodies.instanceMatrix.needsUpdate=heads.instanceMatrix.needsUpdate=true;return landed;}

// ---------- eruption: lava flows run downhill on the side AWAY from the capital
const awayAng=Math.atan2(V.y-CITY.y,V.x-CITY.x);
const flows=[-.75,-.25,.3,.8].map((da,fi)=>{const a=awayAng+da;let x=V.x+Math.cos(a)*8,z=V.y+Math.sin(a)*8;const pts=[];let dx=Math.cos(a),dz=Math.sin(a);
 for(let s=0;s<90;s++){const y=H(x,z);pts.push(new THREE.Vector3(x,Math.max(y,SEA)+.5,z));if(y<SEA+.2)break;
  const gx=H(x+1,z)-H(x-1,z),gz=H(x,z+1)-H(x,z-1),gl=Math.hypot(gx,gz)||1;dx=dx*.6-gx/gl*.4;dz=dz*.6-gz/gl*.4;const dl=Math.hypot(dx,dz);dx/=dl;dz/=dl;x+=dx*1.6;z+=dz*1.6;}
 const geo=new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),pts.length*3,1.5-fi*.1,6,false);const m=new THREE.Mesh(geo,glow(fi%2?'#ff5a14':'#ff7a1a'));m.visible=false;scene.add(m);m.userData.n=geo.index.count;return m;});
const bombs=[];for(let i=0;i<34;i++){const b=new THREE.Mesh(new THREE.IcosahedronGeometry(1.6+(i%3)*.6,0),glow(i%3?'#ff6a1a':'#ffcc2e'));b.visible=false;scene.add(b);bombs.push(b);}
const ash=[];for(let i=0;i<14;i++){const b=new THREE.Mesh(new THREE.IcosahedronGeometry(5,1),new THREE.MeshStandardMaterial({color:'#4a4444',flatShading:true,transparent:true,opacity:.9}));b.visible=false;scene.add(b);ash.push(b);}
const lavaLight=new THREE.PointLight('#ff6a1a',0,180,1.5);lavaLight.position.set(V.x,H(V.x,V.y)+10,V.y);scene.add(lavaLight);
const CRATER=v3d(V.x,H(V.x,V.y)+2,V.y); function v3d(x,y,z){return new THREE.Vector3(x,y,z);}

// ---------- the map grows: two new islands (23 shares)
function isle(cx,cz,R,sd){const g=new THREE.Group();let geo=new THREE.PlaneGeometry(R*2.6,R*2.6,34,34);geo.rotateX(-Math.PI/2);const pa=geo.attributes.position;
 const hh=(x,z)=>{const d=Math.hypot(x,z)/R;return (1-Math.pow(Math.min(d,1.5),2.2))*6+(fbm(x*.08+sd,z*.08)-.5)*4;};
 for(let i=0;i<pa.count;i++)pa.setY(i,hh(pa.getX(i),pa.getZ(i)));geo=geo.toNonIndexed();const p2=geo.attributes.position;const col=new Float32Array(p2.count*3);
 for(let i=0;i<p2.count;i+=3){const y=(p2.getY(i)+p2.getY(i+1)+p2.getY(i+2))/3;C.set(y<-1?'#7fd6d0':y<1.4?'#efdfa8':(fbm(p2.getX(i)*.1,p2.getZ(i)*.1)>.5?'#6cc443':'#7fd252'));for(let k=0;k<3;k++){col[(i+k)*3]=C.r;col[(i+k)*3+1]=C.g;col[(i+k)*3+2]=C.b;}}
 geo.setAttribute('color',new THREE.BufferAttribute(col,3));geo.computeVertexNormals();const m=new THREE.Mesh(geo,new THREE.MeshStandardMaterial({vertexColors:true,flatShading:true}));m.receiveShadow=true;g.add(m);
 for(let i=0;i<26;i++){const a=i*2.4+sd,r=R*(.25+.5*((i*37)%10)/10);const x=Math.cos(a)*r,z=Math.sin(a)*r,y=hh(x,z);if(y<1.6||Math.hypot(x,z)<6)continue;const t=new THREE.Group();const c=new THREE.Mesh(pineG,new THREE.MeshStandardMaterial({color:'#2f7a3a',flatShading:true}));const tr=new THREE.Mesh(trunkG,MT.wood);t.add(c,tr);t.position.set(x,y-.2,z);t.scale.setScalar(.8);g.add(t);}
 g.position.set(cx,SEA-.6,cz);g.userData.top=hh(0,0);g.visible=false;scene.add(g);return g;}
const isleT=isle(18,142,22,3.3), isleC=isle(112,98,18,7.1);
// temple with blue stripes and a gold dome (@leclercsleftmirror)
{const t=new THREE.Group();const y0=isleT.userData.top;for(let i=0;i<5;i++)t.add(box(7,1,7,i%2?MT.blue:MT.white,0,y0+.5+i,0));t.add(cyl(3.6,3.6,.6,MT.white,0,y0+5.3,0,16));
 const d=new THREE.Mesh(new THREE.SphereGeometry(3.4,16,10,0,Math.PI*2,0,Math.PI/2),MT.gold);d.position.y=y0+5.6;d.castShadow=true;t.add(d);t.add(cyl(.15,.15,2,MT.gold,0,y0+9.6,0,6));isleT.add(t);}
// café with parasols (@yunrxi)
{const c=new THREE.Group();const y0=isleC.userData.top;c.add(box(4.5,3,3.5,MT.wall2,0,y0+1.2,0));c.add(roof4(4.8,1.4,MT.teal,y0+3.4));
 for(let i=0;i<4;i++){const a=i*1.6+.4,x=Math.cos(a)*5,z=Math.sin(a)*5;c.add(cyl(.08,.08,2.2,MT.white,x,y0+1.1,z,6));const p=new THREE.Mesh(new THREE.ConeGeometry(1.4,.6,8),i%2?MT.red:MT.orange);p.position.set(x,y0+2.3,z);c.add(p);c.add(cyl(.6,.6,.12,MT.white,x,y0+.8,z,10));}isleC.add(c);}

// ---------- secret event (112 saves): ancient ruins revealed by the eruption
const ruins=(()=>{const g=new THREE.Group();const st=std('#cbbf9f'),st2=std('#a99d80');
 for(let i=0;i<22;i++){const a=i/22*Math.PI*2;const h=2.5+((i*53)%10)/10*3.5*(i%5==0?.35:1);const p=new THREE.Group();
  p.add(box(1.1,h,1.1,st,0,h/2,0));if(h>4)p.add(box(2.3,.7,1.2,st2,.0,h+.35,0));p.position.set(Math.cos(a)*8,0,Math.sin(a)*8);p.rotation.y=-a;g.add(p);}
 g.add(new THREE.Mesh(new THREE.CylinderGeometry(6.4,6.4,.3,24),std('#d9cba4')));
 const tw=new THREE.Group();tw.add(cyl(1.8,2.1,7,st2,0,3.5,0,8));for(let i=0;i<5;i++){const a=i/8*Math.PI*2;tw.add(box(.6,.8,.6,st2,Math.cos(a)*1.9,7.3,Math.sin(a)*1.9));}tw.position.set(13,0,-4);g.add(tw);
 for(let i=0;i<3;i++)g.add(box(4,1.6+(i%2),1,st2,13+(i-1)*3.6,.8,1.5+i*.4));
 g.traverse(o=>{if(o.isMesh){o.castShadow=o.receiveShadow=true;}});
 const y=H(SITE_B.x,SITE_B.y);g.position.set(SITE_B.x,y-.2,SITE_B.y);g.userData.y=y-.2;g.visible=false;scene.add(g);return g;})();
const dust=[];for(let i=0;i<12;i++){const b=new THREE.Mesh(new THREE.IcosahedronGeometry(2.4,1),new THREE.MeshStandardMaterial({color:'#d8ccb0',flatShading:true,transparent:true,opacity:.8}));b.visible=false;scene.add(b);dust.push(b);}

