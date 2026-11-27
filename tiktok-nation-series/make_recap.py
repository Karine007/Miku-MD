# Builds recap.html = Day 1 world (index.html) + recap scene (recap_parts.js)
import re, os
HERE = os.path.dirname(os.path.abspath(__file__))
s = open(os.path.join(HERE, 'index.html'), encoding='utf8').read()
parts = open(os.path.join(HERE, 'recap_parts.js'), encoding='utf8').read()
def sub(pattern, repl):
    global s
    s2, n = re.subn(pattern, lambda m: repl, s, count=1, flags=re.S); assert n == 1, pattern; s = s2
CSS = """
.ntag{position:absolute;background:#fff;border:5px solid #1d232b;border-radius:16px;box-shadow:0 6px 0 rgba(0,0,0,.25);padding:6px 16px;text-align:center;opacity:0;white-space:nowrap;transform-origin:50% 100%}
.ntag:after{content:'';position:absolute;left:50%;bottom:-16px;margin-left:-12px;border:12px solid transparent;border-top-color:#1d232b;border-bottom:0}
.ntag .ts{font-family:Nunito;font-weight:900;font-size:26px;color:#2f7de1}
.ntag.you{background:#ffcc2e}.ntag .tt{font-family:Lilita;font-size:52px;color:#15191f}
#stats{position:absolute;top:1240px;left:50%;transform:translateX(-50%);display:flex;gap:20px}
.st{background:#fff;border:5px solid #1d232b;border-radius:24px;box-shadow:0 8px 0 rgba(0,0,0,.25);width:250px;padding:12px 0;text-align:center;opacity:0;font-family:Nunito;font-weight:900;color:#1d232b}
.st .e{font-family:'Noto Color Emoji';font-size:52px}.st .n{font-size:50px;line-height:56px}.st .l{font-size:22px;color:#666;letter-spacing:1px}
#bubbles{position:absolute;top:640px;left:50%;width:860px;margin-left:-430px;display:flex;flex-direction:column;gap:22px}
.bub{background:#fff;border:5px solid #1d232b;border-radius:26px;box-shadow:0 7px 0 rgba(0,0,0,.25);padding:14px 24px;opacity:0;font-family:Nunito;font-weight:900;color:#1d232b;max-width:760px;transform-origin:0 50%}
.bub:nth-child(even){align-self:flex-end;transform-origin:100% 50%}
.bub .bq{font-size:36px;line-height:42px}.bub .bu{font-size:24px;color:#2f7de1;margin-top:4px}
#goals{position:absolute;top:620px;left:50%;width:900px;margin-left:-450px;display:flex;flex-direction:column;gap:24px}
.goal{background:#fff;border:6px solid #1d232b;border-radius:28px;box-shadow:0 9px 0 rgba(0,0,0,.28);display:flex;align-items:center;gap:20px;padding:18px 24px;opacity:0;font-family:Nunito;font-weight:900;color:#1d232b;transition:none}
.goal.hot{background:#fff6d6;border-color:#15191f}
.goal .ge{font-family:'Noto Color Emoji';font-size:72px;flex:none}
.goal .gb{flex:1}.goal .gt{font-size:38px;line-height:42px}.goal .gs{font-size:28px;color:#555;margin:2px 0 10px}
.goal .bar{height:26px;background:#e8e8e8;border-radius:13px;overflow:hidden;border:3px solid #1d232b}.goal .bar i{display:block;height:100%}
.goal .gn{font-size:34px;width:110px;text-align:right}
"""
sub(r'</style>', CSS + '</style>')
DOM = """
  <div id="tags"></div>
  <div id="stats">
    <div class="st"><div class="e">👀</div><div class="n" id="sv">0</div><div class="l" id="t_views"></div></div>
    <div class="st"><div class="e">❤️</div><div class="n" id="sl">0</div><div class="l" id="t_likes"></div></div>
    <div class="st"><div class="e">💬</div><div class="n" id="sc">0</div><div class="l" id="t_comments"></div></div>
  </div>
  <div id="bubbles"></div>
  <div id="goals"></div>
  <div class="flash" id="flash"></div>"""
sub(r'\s*<div class="flash" id="flash"></div>', DOM)
SETUP = r"""const TXT = {
  day:'DAY',pop:'POPULATION',nation:'UNNAMED NATION',
  s1:'Day 1 <b>recap</b>',
  s2a:'Every follower<br><b>appears</b> on the map...',
  s2b:'<b>80 citizens</b><br>already !',
  s3:'The very first<br><b>citizens</b>',
  s4:'And you had<br><b>ideas</b>...',
  s5:'What happens next?<br><b>You decide</b>',
  s6:'Follow = you<br><b>appear on the map</b>',
  s6b:'<span class="sub">tomorrow: we build the <b>capital</b> 🏛️</span>',
  views:'VIEWS', likes:'LIKES', comments:'COMMENTS',
  bubbles:[['“A for capital! Easier to defend”','@dusan_rajic'],['“make me a statue”','@hyperstat'],['“make me a pork farm” 🐷','@imuiuiaskmeanything'],['“build a navy!” ⚓','@radamel.falcao98']],
  // [emoji, title, subtitle, current, goal, colour]
  goals:[['🔁','SHARE','every 10 shares = the map gets BIGGER',3,10,'#2f7de1'],['❤️','LIKE','100 likes = the volcano ERUPTS',37,100,'#e8334f'],['📌','SAVE','25 saves = a SECRET event',6,25,'#f2a33a']],
};
const $ = id => document.getElementById(id);
$('t_day').textContent=TXT.day; $('t_pop').textContent=TXT.pop; $('t_nation').textContent=TXT.nation;
$('tag').textContent='+YOU'; $('t_views').textContent=TXT.views; $('t_likes').textContent=TXT.likes; $('t_comments').textContent=TXT.comments;
"""
sub(r"const LANG = .*?\$\('steps'\)\.innerHTML = [^\n]*\n", SETUP)
sub(r'Math\.hypot\(x-SITE_A\.x,z-SITE_A\.y\)<14\)', 'Math.hypot(x-SITE_A.x,z-SITE_A.y)<27)')
sub(r'// ---------- timeline ----------.*?(?=</script>\s*</body>)', parts + '\n')
open(os.path.join(HERE, 'recap.html'), 'w', encoding='utf8').write(s)
print('wrote recap.html', len(s))
