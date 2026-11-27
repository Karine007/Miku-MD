# Builds fc1.html: the Herberg world (Day 5 → Day 11 builds) + Herberg FC's new island and the FC Day 1 timeline.
# usage: python3 fc/make_fc1.py [timing.json]
import json, os, re, subprocess, sys
HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
rd = lambda f: open(os.path.join(HERE, f), encoding='utf8').read()
def cut(s):
    for m in ('\n// ---------- timeline (design time)\nconst TD=[0,4.8', '\n// ---------- timeline (design time)\nconst TD=[0,5.2'):
        if m in s: return s[:s.index(m)]
    return s[:s.index('\nconst SH=[')]
world = '\n'.join(cut(rd(f)) for f in ('day5_parts.js','day6_parts.js','day7_parts.js','day8_parts.js','day9_parts.js','day10_parts.js','day11_parts.js'))
src = rd('fc/fc1_v1_standalone.html')
js = src[src.index('<script type="module">'):src.index('</script>', src.index('<script type="module">'))]
sec = lambda a, b: js[js.index(a):js.index(b)]
helpers = sec('const clamp=', '// ---------- renderer / scene') + sec('const std=', '// ---------- crest texture')
crest = sec('// ---------- crest texture', '// ---------- the island, the sea')
palmf = sec('function palm(s=1)', '\nfor(const [x,z,s] of [[-70')
body = sec('// ---------- the pitch', '// ---------- timeline')
life = sec(' // life\n', ' // camera\n')
fcjs = 'const FC=(()=>{\nconst FCG=new THREE.Group();FCG.visible=false;scene.add(FCG);\n' + helpers + crest + palmf + '\n'
fcjs += "FCG.add(cyl(80,90,9,M.sand,0,-5.4,6,40));FCG.add(cyl(77,80,1.6,M.grass2,0,-.85,6,40));\n"
fcjs += "for(const [x,z,s] of [[-64,-34,1.2],[-70,8,1],[64,-36,1.1],[70,10,1.3],[-56,52,1],[58,50,1.1],[0,-60,1],[-30,-62,1.2],[34,-60,.9],[20,62,1],[-24,64,1.1]]){const p=palm(s);p.position.set(x,0,z);p.rotation.y=x;FCG.add(p);}\n"
fcjs += body.replace('scene.add(', 'FCG.add(')
fcjs += '''
const SEATL=i=>SEATS[i].position.clone().add(ST.position);
const seatW=i=>SEATS[i].getWorldPosition(v3(0,0,0));
const chl=(x,y,z)=>v3(x,y,z).applyEuler(CH.rotation).add(CH.position);
const SH=[
 {t0:4.2,t1:9.2,p:[v3(-10,9,6),v3(8,8,10)],l:[v3(-2,4,PW/2+12),v3(2,4,PW/2+12)]},
 {t0:9.2,t1:11.6,p:[v3(0,36,-56),v3(0,30,-46)],l:[v3(0,0,4),v3(0,0,4)]},
 {t0:11.6,t1:13.2,p:[v3(-12,11,18),v3(-10,9,15)],l:[v3(-6,0,4),v3(-7,0,4)]},
 {t0:13.2,t1:14.3,p:[v3(-PL/2+16,7,-18),v3(-PL/2+13,6,-15)],l:[v3(-PL/2,4,0),v3(-PL/2,4,0)]},
 {t0:14.3,t1:15.7,clubhouse:true},
 {t0:15.7,t1:19.7,king:true},
 {t0:19.7,t1:28.7,squad:true},
 {t0:28.7,t1:30.8,p:[v3(11,7,13),v3(8,8.5,10)],l:[v3(0,6.5,0),v3(0,7.2,0)]},
 {t0:30.8,t1:33.2,p:[v3(0,22,-40),v3(0,20,-34)],l:[v3(0,3,-4),v3(0,3,-4)]},
 {t0:33.2,t1:35.7,p:[v3(14,7,4),v3(8,6.5,8)],l:[v3(0,3,PW/2+12),v3(-2,3,PW/2+12)]},
 {t0:35.7,t1:40.7,og:true},
 {t0:40.7,t1:46.2,kingc:true},
 {t0:46.2,t1:54,p:[v3(0,60,-110),v3(0,80,-150)],l:[v3(0,0,6),v3(0,0,8)]},
];
function update(t){
''' + life + '''}
function cam(t){const sh=SH.find(s=>t>=s.t0&&t<s.t1)||SH[t<4.2?0:SH.length-1];const k=ease(clamp((t-sh.t0)/(sh.t1-sh.t0)));let p,l;
 if(sh.clubhouse){p=chl(-4+3*k,6,20);l=chl(1,4.5,4);}
 else if(sh.king){const m=mower.position;p=v3(m.x+8-4*k,7,m.z-13);l=v3(m.x+1,3.2,m.z);}
 else if(sh.squad){const sx=t<23.4?-9:t<26.2?3:15;const tx=t<20.8?-3:sx;const pk=t<20.8?ease(clamp((t-19.7)/1.1)):1;l=v3(tx,3.4,-6);p=v3(l.x+(t<20.8?6-6*pk:0)-3,6.6+(t<20.8?10*(1-pk):0),-6-15-(t<20.8?14*(1-pk):0));}
 else if(sh.og){const s=SEATL(6);p=v3(s.x+5-4*k,s.y+4.5,s.z-9+2*k);l=v3(s.x,s.y+.6,s.z);}
 else if(sh.kingc){const q=kingStand.position;p=v3(q.x+24-3*k,9,q.z-9+2*k);l=v3(q.x,9.5,q.z);}
 else {p=new THREE.Vector3().lerpVectors(sh.p[0],sh.p[1],k);l=new THREE.Vector3().lerpVectors(sh.l[0],sh.l[1],k);}
 return {p,l};}
return {FCG,update,cam,seatW,keeper,chef,striker};
})();
'''
css = src[src.index('<style>')+7:src.index('</style>')]
css = '\n'.join(l for l in css.split('\n') if not re.match(r'(@font-face|html,body|#c\{|#ui\{|\.hud|\.box|\.lbl|\.num|\.pill|\.cap)', l))
css += '''
#cmt{top:760px;width:880px;margin-left:-440px;background:#fff;border:6px solid #1d232b;border-radius:26px;box-shadow:0 8px 0 rgba(0,0,0,.28);color:#1d232b;display:flex;gap:20px;padding:22px 26px;box-sizing:border-box;align-items:flex-start}
#cmt .av{width:84px;height:84px;border-radius:50%;background:#1f8a4c;flex:none;display:flex;align-items:center;justify-content:center;font-size:48px;font-family:'Noto Color Emoji'}
#cmt .nm{font-family:Nunito;font-weight:900;font-size:26px;color:#777}
#cmt .q{font-family:Nunito;font-weight:900;font-size:40px;line-height:48px;margin-top:4px}
#cmt .lk{font-family:Nunito;font-weight:900;font-size:24px;color:#e8334f;margin-top:8px}
'''
dom = src[src.index('<div class="panel" id="crest">'):src.index('<div class="flash" id="flash">')]
dom = dom.replace('<div id="tags"></div>', '')
dom += '<div class="panel" id="cmt"><div class="av">🏝️</div><div><div class="nm">a Herberg citizen · 💬 comment</div><div class="q">Herberg needs a real football stadium... on its OWN island! 🏟️⚽</div><div class="lk">❤️ Reply · liked by the King</div></div></div>'
inject = 'document.head.insertAdjacentHTML("beforeend",%s);document.getElementById("flash").insertAdjacentHTML("beforebegin",%s);\n' % (json.dumps('<style>'+css+'</style>'), json.dumps(dom))
outer = rd('fc/fc1_outer.js')
d11 = rd('day11_parts.js')
lifeW = d11[d11.index(' // moving things first'):d11.index(' // space plane')]
lifeW = lifeW.replace(' const wide=t<5.2||t>=56.6;', ' const wide=false;')
outer = outer.replace('//@@LIFE@@\n', lifeW)
timing = 'window.FC_TR=%s;\n' % json.dumps(json.load(open(sys.argv[1]))) if len(sys.argv) > 1 else ''
open(os.path.join(HERE, 'fc', 'fc1_all.js'), 'w', encoding='utf8').write(timing + world + '\n' + inject + fcjs + outer)
subprocess.run([sys.executable, os.path.join(HERE, 'make_day4.py'), 'fc/fc1_text.js', 'fc/fc1_all.js', 'fc1.html'], check=True)
p = os.path.join(HERE, 'fc1.html'); s = open(p, encoding='utf8').read().replace('<div class="num">4</div>', '<div class="num">1</div>', 1)
open(p, 'w', encoding='utf8').write(s)
