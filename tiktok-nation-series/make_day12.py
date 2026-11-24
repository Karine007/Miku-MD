# Builds day12.html: the Herberg world (Day 5 → Day 11 builds, all standing, with their life) + the Day 12 builds and timeline.
# usage: python3 make_day12.py [timing.json]
import json, os, subprocess, sys
HERE = os.path.dirname(os.path.abspath(__file__))
rd = lambda f: open(os.path.join(HERE, f), encoding='utf8').read()
def cut(s):
    for m in ('\n// ---------- timeline (design time)\nconst TD=[0,4.8', '\n// ---------- timeline (design time)\nconst TD=[0,5.2'):
        if m in s: return s[:s.index(m)]
    return s[:s.index('\nconst SH=[')]
world = '\n'.join(cut(rd(f)) for f in ('day5_parts.js','day6_parts.js','day7_parts.js','day8_parts.js','day9_parts.js','day10_parts.js','day11_parts.js'))
d11 = rd('day11_parts.js')
life = d11[d11.index(' // moving things first'):d11.index(' // space plane')].replace(' const wide=t<5.2||t>=56.6;', ' const wide=false;')
parts = rd('day12_parts.js').replace('//@@LIFE@@\n', life)
timing = 'window.DAY12_TR=%s;\n' % json.dumps(json.load(open(sys.argv[1]))) if len(sys.argv) > 1 else ''
open(os.path.join(HERE, 'day12_all.js'), 'w', encoding='utf8').write(timing + world + '\n' + parts)
subprocess.run([sys.executable, os.path.join(HERE, 'make_day4.py'), 'day12_text.js', 'day12_all.js', 'day12.html'], check=True)
p = os.path.join(HERE, 'day12.html'); s = open(p, encoding='utf8').read().replace('<div class="num">4</div>', '<div class="num">12</div>', 1)
open(p, 'w', encoding='utf8').write(s)
