# Builds day3.html = Day 1 world + capital (city_day2.js) + Day 3 scene (day3_parts.js)
import re, os
HERE = os.path.dirname(os.path.abspath(__file__))
s = open(os.path.join(HERE, 'index.html'), encoding='utf8').read()
parts = open(os.path.join(HERE, 'city_day2.js'), encoding='utf8').read() + open(os.path.join(HERE, 'world_day3.js'), encoding='utf8').read() + open(os.path.join(HERE, 'day3_parts.js'), encoding='utf8').read()
def sub(pattern, repl):
    global s
    s2, n = re.subn(pattern, lambda m: repl, s, count=1, flags=re.S); assert n == 1, pattern; s = s2
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

.goal .gn{width:170px;font-size:30px;color:#2a9d3a}
#votes{top:1180px}
"""
sub(r'</style>', CSS + '</style>')
sub(r'<div class="num">1</div>', '<div class="num">3</div>')
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
  <div class="flash" id="flash"></div>"""
sub(r'\s*<div class="flash" id="flash"></div>', DOM)
SETUP = open(os.path.join(HERE, 'day3_text.js'), encoding='utf8').read()
sub(r"const LANG = .*?\$\('steps'\)\.innerHTML = [^\n]*\n", SETUP)
sub(r'Math\.hypot\(x-SITE_A\.x,z-SITE_A\.y\)<14\)', 'Math.hypot(x-SITE_A.x,z-SITE_A.y)<27)')
sub(r'// ---------- timeline ----------.*?(?=</script>\s*</body>)', parts + '\n')
open(os.path.join(HERE, 'day3.html'), 'w', encoding='utf8').write(s)
print('wrote day3.html', len(s))
