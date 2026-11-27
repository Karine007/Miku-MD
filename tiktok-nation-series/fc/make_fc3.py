# Builds fc3.html: Herberg FC Day 3, from the Day 1 stadium-island scene (fc1_v1_standalone.html)
# + the Day 2 assets (fc2_day2.js) + fc3_day3.js + fc3_timeline.js
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
s = s[:a] + rd('fc2_day2.js') + '\n' + rd('fc3_day3.js') + '\n' + rd('fc3_timeline.js') + '\n' + s[b:]
s = re.sub(r'<script>window\.FC_TR=\[[^\]]*\];</script>\n', '', s)
rep('<div class="box day"><div class="lbl">DAY</div><div class="num">1</div></div>', '<div class="box day"><div class="lbl">DAY</div><div class="num">3</div></div>')
CSS = '''.cm{width:880px;margin-left:-440px;background:#fff;border:6px solid #1d232b;border-radius:26px;box-shadow:0 8px 0 rgba(0,0,0,.28);color:#1d232b;display:flex;gap:20px;padding:22px 26px;box-sizing:border-box;align-items:flex-start}
.cm .av{width:84px;height:84px;border-radius:50%;flex:none;display:flex;align-items:center;justify-content:center;font-size:48px;font-family:'Noto Color Emoji'}
.cm .nm{font-family:Nunito;font-weight:900;font-size:26px;color:#777}
.cm .q{font-family:Nunito;font-weight:900;font-size:42px;line-height:50px;margin-top:4px}
#cmt{top:620px}#cmt2{top:930px}
#stamp{top:770px;width:860px;margin-left:-430px;text-align:center;font-family:Lilita;font-size:120px;line-height:150px;color:#e8334f;border:12px solid #e8334f;border-radius:30px;background:rgba(255,255,255,.92)}
#stamp small{display:block;font-family:Nunito;font-weight:900;font-size:40px;line-height:50px;color:#1d232b;padding-bottom:16px}
#fund{top:640px;width:760px;margin-left:-380px}#fund .v{font-size:104px}
#rule{top:620px;width:920px;margin-left:-460px;background:#fff;border:6px solid #1d232b;border-radius:30px;box-shadow:0 10px 0 rgba(0,0,0,.28);color:#1d232b;overflow:hidden}
#rule .h{background:#1f8a4c;color:#fff;font-family:Nunito;font-weight:900;font-size:42px;letter-spacing:2px;text-align:center;padding:12px 0}
#rule .r{display:flex;align-items:center;gap:24px;padding:14px 40px;font-family:Lilita;font-size:72px;line-height:90px;border-top:4px solid #eee;opacity:0}
#rule .r .e{font-family:'Noto Color Emoji';font-size:66px;width:90px;text-align:center}#rule .r .x{flex:1}#rule .r .c{color:#1f8a4c}
#score{top:1330px;width:920px;margin-left:-460px;border:6px solid #1d232b;border-radius:24px;box-shadow:0 8px 0 rgba(0,0,0,.3);display:flex;overflow:hidden;background:#1d232b}
#score .t{flex:1;display:flex;align-items:center;justify-content:center;font-family:Nunito;font-weight:900;font-size:40px;color:#fff}
#score .t.h{background:#1f8a4c}#score .t.k{background:#c8102e}
#score .sc{width:240px;text-align:center;font-family:Lilita;font-size:84px;line-height:108px;color:#fff}
#goalp{top:600px;width:920px;margin-left:-460px;background:#fff;border:6px solid #1d232b;border-radius:30px;box-shadow:0 10px 0 rgba(0,0,0,.28);color:#1d232b;padding:22px 34px 28px;box-sizing:border-box;text-align:center}
#goalp .h{font-family:Nunito;font-weight:900;font-size:32px;letter-spacing:2px;color:#777}
#goalp .g{font-family:Lilita;font-size:80px;line-height:90px}
#goalp .bar{height:58px;border:5px solid #1d232b;border-radius:30px;margin-top:14px;overflow:hidden;background:#eee;position:relative}
#goalp .fill{position:absolute;left:0;top:0;bottom:0;width:0;background:linear-gradient(90deg,#1f8a4c,#5dbb63)}
#goalp .n{font-family:Nunito;font-weight:900;font-size:40px;margin-top:10px}
#goalp .w{display:flex;justify-content:center;gap:14px;margin-top:16px}
#goalp .w div{background:#1f8a4c;color:#fff;border:4px solid #1d232b;border-radius:16px;font-family:Nunito;font-weight:900;font-size:31px;padding:6px 14px}
#goalp .w div.s{background:#e8334f}#goalp .w div.v{background:#0f5c8c}
.flash{'''
rep('.flash{', CSS)
PANELS = '''<div class="panel cm" id="cmt"><div class="av" style="background:#3a2a10">💰</div><div><div class="nm">Alex Gertc · 💬 comment</div><div class="q">can I donate 10000000000</div></div></div>
  <div class="panel cm" id="cmt2"><div class="av" style="background:#0f5c8c">✈️</div><div><div class="nm">RDA · 💬 comment</div><div class="q">im going to donate 78 trillion dollars</div></div></div>
  <div class="panel" id="stamp">REJECTED ❌<small>sorry... it's not real money</small></div>
  <div class="panel" id="rule"><div class="h">THE NEW RULE</div>
    <div class="r"><div class="e">❤️</div><div class="x">1 LIKE</div><div class="c">= 1 🪙</div></div>
    <div class="r"><div class="e">🔖</div><div class="x">1 SAVE</div><div class="c">= 2 🪙</div></div>
    <div class="r"><div class="e">↪️</div><div class="x">1 SHARE</div><div class="c">= 5 🪙</div></div></div>
  <div class="panel" id="score"><div class="t h">HERBERG</div><div class="sc" id="scv">0 - 0</div><div class="t k">KOLA</div></div>
  <div class="panel" id="goalp"><div class="h">NEXT GOAL</div><div class="g">FIX THE HOLES 🕳️</div><div class="bar"><div class="fill" id="gfill"></div></div><div class="n" id="gnum">🪙 1,024 / 2,000</div>
    <div class="w"><div>❤️ LIKE = 1</div><div class="v">🔖 SAVE = 2</div><div class="s">↪️ SHARE = 5</div></div></div>
  <div class="flash" id="flash"></div>'''
rep('<div class="flash" id="flash"></div>', PANELS)
rep('<div class="panel" id="fund"><div class="l">CLUB FUND</div><div class="v" id="fundv">🪙 1,000</div></div>', '<div class="panel" id="fund"><div class="l">CLUB FUND · REAL COINS</div><div class="v" id="fundv">🪙 1,024</div></div>')
open(os.path.join(ROOT, 'fc3.html'), 'w', encoding='utf8').write(s)
print('wrote fc3.html')
