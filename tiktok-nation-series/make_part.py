# Builds partN.html = Day 1 world + capital + world after Day 3 + partN_parts.js + requests engine
# usage: python3 make_part.py N
import re, os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
N = sys.argv[1]
rd = lambda f: open(os.path.join(HERE, f), encoding='utf8').read()
s = rd('index.html')
parts = rd('city_day2.js') + rd('world_day3.js') + rd('requests_engine.js') + rd(f'part{N}_parts.js') + '\nstartEngine();\n'
def sub(pattern, repl):
    global s
    s2, n = re.subn(pattern, lambda m: repl, s, count=1, flags=re.S); assert n == 1, pattern; s = s2
CSS = re.search(r'CSS = """(.*?)"""', rd('make_day2.py'), re.S).group(1)
sub(r'</style>', CSS + '</style>')
sub(r'<div class="num">1</div>', '<div class="num">3</div>')
sub(r'<div class="pill"><svg ', '<div class="pill" id="pill"><svg style="display:none" ')
sub(r'<span id="t_nation"></span>', '<svg width="30" height="21" viewBox="0 0 3 2" style="border:2px solid #1d232b;border-radius:3px"><rect width="3" height=".67" fill="#f08a24"/><rect y=".67" width="3" height=".67" fill="#2f8fe0"/><rect y="1.33" width="3" height=".67" fill="#4fbf3a"/></svg><span id="t_nation"></span>')
sub(r'\s*<div class="flash" id="flash"></div>', '\n  <div id="tags"></div>\n  <div class="flash" id="flash"></div>')
SETUP = """const $ = id => document.getElementById(id);
$('t_day').textContent='DAY'; $('t_pop').textContent='POPULATION'; $('t_nation').textContent='HERBERG'; $('tag').textContent='';
"""
sub(r"const LANG = .*?\$\('steps'\)\.innerHTML = [^\n]*\n", SETUP)
sub(r'Math\.hypot\(x-SITE_A\.x,z-SITE_A\.y\)<14\)', 'Math.hypot(x-SITE_A.x,z-SITE_A.y)<44)')   # the capital has grown
sub(r'// ---------- timeline ----------.*?(?=</script>\s*</body>)', parts + '\n')
open(os.path.join(HERE, f'part{N}.html'), 'w', encoding='utf8').write(s)
print(f'wrote part{N}.html', len(s))
