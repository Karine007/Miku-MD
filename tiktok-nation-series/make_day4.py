# Builds day4.html: "Herberg 2.0" — a 1.5x bigger island with smooth terrain, a flattened, road-planned
# capital (v2_world.js) and the Day 4 timeline (day4_parts.js).
import re, os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
rd = lambda f: open(os.path.join(HERE, f), encoding='utf8').read()
s = rd('index.html')
def sub(pattern, repl, flags=re.S):
    global s
    s2, n = re.subn(pattern, lambda m: repl, s, count=1, flags=flags); assert n == 1, pattern; s = s2

K = 1.5   # island scale
# ---- world layout scaled up
sub(r'const V = new THREE\.Vector2\(-22,-28\);', 'const V = new THREE.Vector2(-33,-42);')
sub(r'const RIVER = \[\[0,-6\],\[8,8\],\[18,20\],\[12,40\],\[18,62\],\[24,84\],\[30,110\]\]', 'const RIVER = [[0,-9],[12,12],[27,30],[18,60],[27,93],[36,126],[45,165]]')
sub(r'const M = new THREE\.Vector2\(36,44\);', 'const M = new THREE.Vector2(54,66);')
sub(r'const SITE_B = new THREE\.Vector2\(12,-30\);', 'const SITE_B = new THREE.Vector2(18,-45);')
sub(r'function rawH\(x,z\)\{.*?return h;\}', '''function rawH(x,z){
 const d=Math.hypot(x*1.0,z*0.92);
 const coast = 142 + (fbm(x*.0133+3,z*.0133+9)-.5)*60;
 let h = (1-Math.pow(Math.min(d/coast,1.6),2.2))*9 + (fbm(x*.027,z*.027)-.5)*6;
 const dv=Math.hypot(x-V.x,z-V.y);
 h += 52*Math.exp(-Math.pow(dv/39,1.6));
 if(dv<12) h -= (12-dv)*1.5;          // crater
 return h;}''')
# ---- the capital's land is levelled (local frame around SITE_A: u along the coast, v inland)
sub(r'function H\(x,z\)\{\n let h=rawH\(x,z\);', '''function cityUV(x,z){const s=Math.hypot(SITE_A.x,SITE_A.y),sx=SITE_A.x/s,sz=SITE_A.y/s;const dx=x-SITE_A.x,dz=z-SITE_A.y;return [dx*(-sz)+dz*sx, -(dx*sx+dz*sz)];}
let CITY_READY=false;
const CITY_RECT={u0:-72,u1:72,v0:-2,v1:76};
function cityFlat(x,z){const [u,v]=cityUV(x,z);const du=Math.max(CITY_RECT.u0-u,0,u-CITY_RECT.u1),dv=Math.max(CITY_RECT.v0-v,0,v-CITY_RECT.v1);const d=Math.hypot(du,dv);
 const w=d<=0?1:Math.max(0,1-d/16);return [w*w*(3-2*w), 3.2+Math.max(0,v)*.05];}
function H(x,z){
 let h=rawH(x,z);
 if(CITY_READY){const [w,t]=cityFlat(x,z);if(w>0&&h>SEA-1)h=h*(1-w)+t*w;}''')
sub(r'while\(rawH\(Math\.cos\(a\)\*r,Math\.sin\(a\)\*r\)>SEA\+2\.2&&r<150\)r\+=\.5;r-=11;', 'while(rawH(Math.cos(a)*r,Math.sin(a)*r)>SEA+2.2&&r<230)r+=.5;r-=14;')
s, _n = re.subn(r'(const SITE_A=\(\(\)=>\{.*?\}\)\(\);)', lambda m: m.group(1) + '\nCITY_READY=true;', s, count=1); assert _n == 1
# ---- rendering quality: fog, crisper shadows covering the bigger island
sub(r"scene\.fog = new THREE\.Fog\('#bfe6ff', 260, 620\);", "scene.fog = new THREE.Fog('#c8ebff', 420, 980);")
sub(r"sun\.position\.set\(120,180,90\);", "sun.position.set(180,270,135);")
sub(r"sun\.shadow\.mapSize\.set\(2048,2048\); Object\.assign\(sun\.shadow\.camera,\{left:-140,right:140,top:140,bottom:-140,near:10,far:500\}\);",
    "sun.shadow.mapSize.set(4096,4096); Object.assign(sun.shadow.camera,{left:-215,right:215,top:215,bottom:-215,near:10,far:760});")
# ---- smooth terrain: indexed mesh, per-vertex blended colours, smooth normals
sub(r'const SIZE=300, SEG=220;.*?terrain\.receiveShadow=true; terrain\.castShadow=true; scene\.add\(terrain\);', '''const SIZE=460, SEG=320;
let tg = new THREE.PlaneGeometry(SIZE,SIZE,SEG,SEG); tg.rotateX(-Math.PI/2);
let pos = tg.attributes.position;
for(let i=0;i<pos.count;i++){pos.setY(i,H(pos.getX(i),pos.getZ(i)));}
const cols = new Float32Array(pos.count*3); const C=new THREE.Color(), C2=new THREE.Color();
const mix=(a,b,t)=>C.set(a).lerp(C2.set(b),Math.max(0,Math.min(1,t)));
for(let i=0;i<pos.count;i++){
 const x=pos.getX(i), y=pos.getY(i), z=pos.getZ(i);
 const dv=Math.hypot(x-V.x,z-V.y), rd=riverDist(x,z), n=fbm(x*.03,z*.03);
 if(y<SEA-1.2) mix('#6fcfc9','#8fdcd3',(y+6)/5);
 else if(y<SEA+1.4) mix('#e9d8a2','#f2e3b0',(y-SEA+1.2)/2.6);
 else if(dv<13) C.set('#3b3434');
 else if(y>30) mix('#8a7a64','#8d8a86',(y-30)/10);
 else if(y>16) mix('#78b84a','#8a7a64',(y-16)/12);
 else mix('#7fcf55','#68bd43',n*1.6-.3);
 if(rd<3.2 && y<5 && y>=SEA) C.lerp(C2.set('#3d9be0'),.85);
 cols[i*3]=C.r;cols[i*3+1]=C.g;cols[i*3+2]=C.b;
}
tg.setAttribute('color',new THREE.BufferAttribute(cols,3)); tg.computeVertexNormals();
const terrain = new THREE.Mesh(tg,new THREE.MeshStandardMaterial({vertexColors:true,flatShading:false,roughness:.92}));
terrain.receiveShadow=true; terrain.castShadow=false; scene.add(terrain);''')
sub(r'new THREE\.CircleGeometry\(6,24\)', 'new THREE.CircleGeometry(9,28)')
# ---- forest: bigger island, and the trees inside the cut zone are recorded (they get cut on screen)
sub(r'for\(let i=0;i<26000 && \(pines\.length<3200\|\|rounds\.length<900\);i\+\+\)\{\n const x=\(rnd\(\)-\.5\)\*220,z=\(rnd\(\)-\.5\)\*220,y=H\(x,z\);',
    '''window.CUT=[];
for(let i=0;i<80000 && (pines.length<6000||rounds.length<1700);i++){
 const x=(rnd()-.5)*330,z=(rnd()-.5)*330,y=H(x,z);''')
sub(r"if\(Math\.hypot\(x-SITE_A\.x,z-SITE_A\.y\)<14\) continue;", "{const [cu,cv]=cityUV(x,z);if(cu>CITY_RECT.u0-14&&cu<CITY_RECT.u1+14&&cv>-14&&cv<CITY_RECT.v1+30){if(rnd()<.35)CUT.push([x,y,z,.7+rnd()*.6]);continue;}}")
sub(r"if\(pines\.length<3200\) pines\.push", "if(pines.length<6000) pines.push")
sub(r"else if\(rounds\.length<900\) rounds\.push", "else if(rounds.length<1700) rounds.push")
sub(r"cloud\(-70,80,40,1\.2\);cloud\(60,90,-60,1\.4\);cloud\(90,75,70,1\);cloud\(-90,85,-80,1\.3\);cloud\(10,95,140,1\.1\);",
    "cloud(-105,110,60,1.6);cloud(90,120,-90,1.8);cloud(135,105,105,1.4);cloud(-135,115,-120,1.7);cloud(15,125,210,1.5);")
# ---- UI (same look as Day 3) + scene
CSS = re.search(r'CSS = """(.*?)"""', rd('make_day3.py'), re.S).group(1)
sub(r'</style>', CSS + '</style>')
sub(r'<div class="num">1</div>', '<div class="num">4</div>')
sub(r'<div class="pill"><svg ', '<div class="pill" id="pill"><svg style="display:none" ')
sub(r'<span id="t_nation"></span>', '<svg width="30" height="21" viewBox="0 0 3 2" style="border:2px solid #1d232b;border-radius:3px"><rect width="3" height=".67" fill="#f08a24"/><rect y=".67" width="3" height=".67" fill="#2f8fe0"/><rect y="1.33" width="3" height=".67" fill="#4fbf3a"/></svg><span id="t_nation"></span>')
DOM = """
  <div id="tags"></div>
  <div id="votes">
    <div class="vrow"><div class="lt" style="background:#2f7de1">A</div><div class="nm" id="t_vA"></div><div class="bar"><i id="barA" style="background:#2f7de1;width:0"></i></div><div class="n" id="nA">0</div></div>
    <div class="vrow"><div class="lt" style="background:#f08a24">B</div><div class="nm" id="t_vB"></div><div class="bar"><i id="barB" style="background:#f08a24;width:0"></i></div><div class="n" id="nB">0</div></div>
  </div>
  <div id="goals"></div>
  <div id="bubbles"></div>
  <div id="laws"></div>
  <div id="before"><img id="beforeImg"><div class="stamp">BEFORE</div><div class="xmark">✕</div></div>
  <div class="flash" id="flash"></div>"""
sub(r'\s*<div class="flash" id="flash"></div>', DOM)
import base64
BEFORE = 'data:image/jpeg;base64,' + base64.b64encode(open(os.path.join(HERE, 'branding', 'before_day3.jpg'), 'rb').read()).decode()
sub(r'<img id="beforeImg">', f'<img id="beforeImg" src="{BEFORE}">')
sub(r'</style>', """#before{position:absolute;top:590px;left:50%;width:480px;margin-left:-240px;opacity:0;transform-origin:50% 50%}
#before img{width:480px;display:block;border:12px solid #fff;border-radius:10px;box-shadow:0 14px 0 rgba(0,0,0,.3)}
#before .stamp{position:absolute;top:18px;left:18px;background:#1d232b;color:#fff;font-family:Nunito;font-weight:900;font-size:38px;padding:6px 18px;border-radius:10px}
#before .xmark{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:Nunito;font-weight:900;font-size:340px;color:#e8334f;-webkit-text-stroke:14px #fff;paint-order:stroke fill;opacity:0}
</style>""")
sub(r"const LANG = .*?\$\('steps'\)\.innerHTML = [^\n]*\n", rd('day4_text.js'))
parts = rd('v2_world.js') + rd('day4_parts.js')
sub(r'// ---------- timeline ----------.*?(?=</script>\s*</body>)', parts + '\n')
open(os.path.join(HERE, 'day4.html'), 'w', encoding='utf8').write(s)
print('wrote day4.html', len(s))
