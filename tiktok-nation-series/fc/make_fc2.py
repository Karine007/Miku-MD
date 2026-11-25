# Builds fc2.html: Herberg FC Day 2, from the Day 1 stadium-island scene (fc1_v1_standalone.html) + fc2_day2.js + fc2_timeline.js
import os, re
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE)
rd = lambda f: open(os.path.join(HERE, f), encoding='utf8').read()
s = rd('fc1_v1_standalone.html')
def rep(a, b):
    global s
    assert a in s, a[:80]; s = s.replace(a, b, 1)
rep('DIRT.forEach(([x,z,r])=>disc(r,M.dirt,x,z,.21));', 'const DIRTM=DIRT.map(([x,z,r])=>disc(r,M.dirt,x,z,.21));')
rep('HOLES.forEach(([x,z,r])=>disc(r,M.hole,x,z,.23));', 'const HOLEM=HOLES.map(([x,z,r])=>disc(r,M.hole,x,z,.23));')
rep("{const s=sign2('NO NET :(','#ffffff','#d63a3a',8,1.8);s.position.set(-PL/2-1,1.4,-9);s.rotation.y=Math.PI/2;scene.add(s);scene.add(box(.3,1.6,.3,M.wood,-PL/2-1.1,.8,-11.6));scene.add(box(.3,1.6,.3,M.wood,-PL/2-1.1,.8,-6.4));}",
    "const NONET=[];{const s=sign2('NO NET :(','#ffffff','#d63a3a',8,1.8);s.position.set(-PL/2-1,1.4,-9);s.rotation.y=Math.PI/2;NONET.push(s,box(.3,1.6,.3,M.wood,-PL/2-1.1,.8,-11.6),box(.3,1.6,.3,M.wood,-PL/2-1.1,.8,-6.4));NONET.forEach(o=>scene.add(o));}")
a = s.index('// ---------- timeline'); b = s.index('</script>', a)
s = s[:a] + rd('fc2_day2.js') + '\n' + rd('fc2_timeline.js') + '\n' + s[b:]
s = re.sub(r'<script>window\.FC_TR=\[[^\]]*\];</script>\n', '', s)
rep('<div class="box day"><div class="lbl">DAY</div><div class="num">1</div></div>', '<div class="box day"><div class="lbl">DAY</div><div class="num">2</div></div>')
rep('.flash{', '''#cmt{top:760px;width:880px;margin-left:-440px;background:#fff;border:6px solid #1d232b;border-radius:26px;box-shadow:0 8px 0 rgba(0,0,0,.28);color:#1d232b;display:flex;gap:20px;padding:22px 26px;box-sizing:border-box;align-items:flex-start}
#cmt .av{width:84px;height:84px;border-radius:50%;background:#1f8a4c;flex:none;display:flex;align-items:center;justify-content:center;font-size:48px;font-family:'Noto Color Emoji'}
#cmt .nm{font-family:Nunito;font-weight:900;font-size:26px;color:#777}
#cmt .q{font-family:Nunito;font-weight:900;font-size:40px;line-height:48px;margin-top:4px}
#cmt .lk{font-family:Nunito;font-weight:900;font-size:24px;color:#e8334f;margin-top:8px}
#fund{width:960px!important;margin-left:-480px!important}#fund .v{font-size:92px!important}
.flash{''')
rep('<div class="panel" id="likeb">❤️ 1 LIKE = +1 COIN</div>', '<div class="panel" id="likeb">❤️ 16 LIKES = +16</div>')
rep('<div class="flash" id="flash"></div>', '<div class="panel" id="cmt"><div class="av">💸</div><div><div class="nm">neck hurts · 💬 comment</div><div class="q">can i donate 8 billion dollars to fix the stadium and the players</div><div class="lk">❤️ Reply</div></div></div>\n  <div class="flash" id="flash"></div>')
a = s.index('<div class="panel" id="choices">'); b = s.index('<div class="panel" id="topc">')
s = s[:a] + '''<div class="panel" id="choices">
    <div class="ch"><div class="ic">🍪</div>COOKIE<br>ISLAND</div>
    <div class="ch"><div class="ic">🚗</div>KOLA<br>MOTORS</div>
    <div class="ch"><div class="ic">👑</div>KING<br>FRINZ</div>
  </div>
  ''' + s[b:]
rep('<div class="q">your idea here...</div>', '<div class="q">who do we play first?</div>')
rep('<div class="panel" id="dec">DECISION #1</div>', '<div class="panel" id="dec">DECISION #2</div>')
open(os.path.join(ROOT, 'fc2.html'), 'w', encoding='utf8').write(s)
print('wrote fc2.html')
