# Builds day2.html = Day 1 world (index.html) + Day 2 city, captions and timeline (day2_parts.js)
import re, os
HERE = os.path.dirname(os.path.abspath(__file__))
s = open(os.path.join(HERE, 'index.html'), encoding='utf8').read()
parts = open(os.path.join(HERE, 'day2_parts.js'), encoding='utf8').read()

def sub(pattern, repl, flags=re.S):
    global s
    s2, n = re.subn(pattern, lambda m: repl, s, count=1, flags=flags)
    assert n == 1, pattern
    s = s2

CSS = """
.ntag{position:absolute;background:#fff;border:5px solid #1d232b;border-radius:18px;box-shadow:0 7px 0 rgba(0,0,0,.25);padding:8px 20px 10px;text-align:center;opacity:0;white-space:nowrap;transform-origin:50% 100%}
.ntag:after{content:'';position:absolute;left:50%;bottom:-17px;margin-left:-13px;border:13px solid transparent;border-top-color:#1d232b;border-bottom:0}
.ntag .tt{font-family:Nunito;font-weight:900;font-size:30px;color:#1d232b}
.ntag .ts{font-family:Nunito;font-weight:900;font-size:27px;color:#2f7de1}
#votes{position:absolute;top:610px;left:50%;width:820px;margin-left:-410px;display:flex;flex-direction:column;gap:20px;opacity:0}
.vrow{background:#fff;border:5px solid #1d232b;border-radius:22px;box-shadow:0 7px 0 rgba(0,0,0,.25);padding:14px 20px;display:flex;align-items:center;gap:16px;font-family:Nunito;font-weight:900;font-size:34px;color:#1d232b}
.vrow .lt{width:56px;height:56px;border-radius:50%;color:#fff;display:flex;align-items:center;justify-content:center;border:4px solid #1d232b;flex:none}
.vrow .nm{width:250px}.vrow .bar{flex:1;height:30px;background:#e8e8e8;border-radius:15px;overflow:hidden}.vrow .bar i{display:block;height:100%;border-radius:15px}
.vrow .n{width:50px;text-align:right}
#namecard{position:absolute;top:640px;left:0;right:0;text-align:center;opacity:0}
#namecard .big{font-family:Lilita;font-size:200px;line-height:200px;color:#ffcc2e;-webkit-text-stroke:20px #15191f;paint-order:stroke fill;text-shadow:0 12px 0 rgba(0,0,0,.35)}
#namecard .by{display:inline-block;margin-top:14px;background:#fff;border:5px solid #1d232b;border-radius:40px;padding:8px 28px;font-family:Nunito;font-weight:900;font-size:36px;color:#1d232b}
#laws{position:absolute;top:640px;left:50%;width:840px;margin-left:-420px;display:flex;flex-direction:column;gap:24px}
.law{background:#fff;border:5px solid #1d232b;border-radius:24px;box-shadow:0 8px 0 rgba(0,0,0,.25);display:flex;align-items:center;gap:20px;padding:16px 24px;opacity:0;font-family:Nunito;font-weight:900;font-size:40px;color:#1d232b}
.law .lt{width:70px;height:70px;border-radius:50%;color:#fff;font-size:40px;display:flex;align-items:center;justify-content:center;border:4px solid #1d232b;flex:none}
.law .em{font-family:'Noto Color Emoji';font-size:56px}
"""
sub(r'</style>', CSS + '</style>')
# HUD: day 2, named pill with tricolor
sub(r'<div class="num">1</div>', '<div class="num">2</div>')
sub(r'<div class="pill"><svg ', '<div class="pill" id="pill"><svg id="flagicon" ')
sub(r'<span id="t_nation"></span>', '<svg id="flagtri" width="30" height="21" viewBox="0 0 3 2" style="display:none;border:2px solid #1d232b;border-radius:3px"><rect width="3" height=".67" fill="#f08a24"/><rect y=".67" width="3" height=".67" fill="#2f8fe0"/><rect y="1.33" width="3" height=".67" fill="#4fbf3a"/></svg><span id="t_nation"></span>')
DOM = """
  <div id="tags"></div>
  <div id="votes">
    <div class="vrow"><div class="lt" style="background:#2f7de1">A</div><div class="nm">BEACH</div><div class="bar"><i id="barA" style="background:#2f7de1;width:0"></i></div><div class="n" id="nA">0</div></div>
    <div class="vrow"><div class="lt" style="background:#f08a24">B</div><div class="nm">VOLCANO</div><div class="bar"><i id="barB" style="background:#f08a24;width:0"></i></div><div class="n" id="nB">0</div></div>
  </div>
  <div id="namecard"><div class="big">HERBERG</div><div class="by" id="t_nameby"></div></div>
  <div id="laws"></div>
  <div class="flash" id="flash"></div>"""
sub(r'\s*<div class="flash" id="flash"></div>', DOM)
# texts
SETUP = r"""const TXT = {
  day:'DAY',pop:'POPULATION',nation:'UNNAMED NATION',nation2:'HERBERG',
  s1:'Day 2: we\'re already<br><b>72 citizens</b> !',
  s2a:'The vote is in...',
  s2b:'The capital goes<br>on the <b>beach</b> !',
  s3a:'The nation\'s <b>name</b>...',
  s3b:'<span class="sub">❌ real countries don\'t count</span>',
  s4a:'Our <b>flag</b> is up !',
  s4b:'<span class="sub">designed by <b>@radamel.falcao98</b><br>orange = volcano · blue = ocean · green = forest</span>',
  s5:'Now... let\'s build<br>the <b>capital</b> !',
  s6:'First: a <b>parliament</b>',
  s7:'Your <b>houses</b>',
  s8:'A hall of <b>honour</b>...<br>and a <b>statue</b> !',
  s9:'And yes...<br>a <b>pork farm</b>',
  s10:'A <b>navy</b> to<br>defend the coast',
  s11:'Welcome to <b>Vardia</b><span class="sub">capital of Herberg · name by <b>@opanak_offical</b></span>',
  s12:'Day 3 vote:<br>our first <b>law</b>',
  s12b:'Comment <b>A</b> or <b>B</b><span class="sub">follow = become a citizen</span>',
  laws:[['🍕','FREE PIZZA EVERY FRIDAY','#2f7de1'],['🍍','PINEAPPLE PIZZA IS BANNED','#f08a24']],
};
const $ = id => document.getElementById(id);
$('t_day').textContent=TXT.day; $('t_pop').textContent=TXT.pop; $('t_nation').textContent=TXT.nation;
$('tag').textContent=''; $('t_nameby').textContent='suggested by @giorgito4';
$('laws').innerHTML=TXT.laws.map((l,i)=>`<div class="law"><div class="lt" style="background:${l[2]}">${'AB'[i]}</div><span class="em">${l[0]}</span>${l[1]}</div>`).join('');
"""
sub(r"const LANG = .*?\$\('steps'\)\.innerHTML = [^\n]*\n", SETUP)
# clear trees where the city goes
sub(r'Math\.hypot\(x-SITE_A\.x,z-SITE_A\.y\)<14\)', 'Math.hypot(x-SITE_A.x,z-SITE_A.y)<27)')
# replace Day 1 timeline with Day 2 parts
sub(r'// ---------- timeline ----------.*?(?=</script>\s*</body>)', parts + '\n')
open(os.path.join(HERE, 'day2.html'), 'w', encoding='utf8').write(s)
print('wrote day2.html', len(s))
