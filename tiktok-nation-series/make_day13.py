# Builds day13.html: the Herberg world (Day 5 → Day 12 builds, all standing, with their life) + the Day 13 builds and timeline.
# usage: python3 make_day13.py [timing.json]
import json, os, subprocess, sys
HERE = os.path.dirname(os.path.abspath(__file__))
rd = lambda f: open(os.path.join(HERE, f), encoding='utf8').read()
def cut(s):
    for m in ('\n// ---------- timeline (design time)\nconst TD=[0,4.8', '\n// ---------- timeline (design time)\nconst TD=[0,5.2'):
        if m in s: return s[:s.index(m)]
    return s[:s.index('\nconst SH=[')]
world = '\n'.join(cut(rd(f)) for f in ('day5_parts.js','day6_parts.js','day7_parts.js','day8_parts.js','day9_parts.js','day10_parts.js','day11_parts.js'))
d12 = rd('day12_parts.js'); M12 = '\n// ---------- timeline: design time'
d12head = d12[:d12.index(M12)]
tl12 = d12[d12.index(M12):]
keep = [l for l in tl12.split('\n') if l.startswith(('AIR.t=', 'const CAST_GO', 'const FOG0', 'const runway', 'function takeoff', ' const x=-28+tt*tt*9'))]
d11 = rd('day11_parts.js')
life11 = d11[d11.index(' // moving things first'):d11.index(' // space plane')].replace(' const wide=t<5.2||t>=56.6;', ' const wide=false;')
life12 = tl12[tl12.index(' ISL10.forEach(o=>{o.sp.visible=false;});ISL11'):tl12.index(' // --- camera')].replace(' const wide=t<5.25||t>=58.09;', ' const wide=false;')
parts = rd('day13_parts.js').replace('//@@LIFE@@\n', '{' + life11 + '}\n{' + life12 + '}\n')
timing = 'window.DAY13_TR=%s;\n' % json.dumps(json.load(open(sys.argv[1]))) if len(sys.argv) > 1 else ''
open(os.path.join(HERE, 'day13_all.js'), 'w', encoding='utf8').write(timing + world + '\n' + d12head + '\n' + '\n'.join(keep) + '\n' + parts)
subprocess.run([sys.executable, os.path.join(HERE, 'make_day4.py'), 'day13_text.js', 'day13_all.js', 'day13.html'], check=True)
p = os.path.join(HERE, 'day13.html'); s = open(p, encoding='utf8').read().replace('<div class="num">4</div>', '<div class="num">13</div>', 1)
open(p, 'w', encoding='utf8').write(s)
