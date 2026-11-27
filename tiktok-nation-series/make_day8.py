# Builds day8.html: Day 5 world + Day 6 + Day 7 builds (already standing) + the Day 8 builds and timeline.
# usage: python3 make_day8.py [timing.json]
import json, os, subprocess, sys
HERE = os.path.dirname(os.path.abspath(__file__))
rd = lambda f: open(os.path.join(HERE, f), encoding='utf8').read()
cut = lambda s: s[:s.index('\nconst SH=[')]
world = '\n'.join(cut(rd(f)) for f in ('day5_parts.js', 'day6_parts.js', 'day7_parts.js'))
timing = 'window.DAY8_TR=%s;\n' % json.dumps(json.load(open(sys.argv[1]))) if len(sys.argv) > 1 else ''
open(os.path.join(HERE, 'day8_all.js'), 'w', encoding='utf8').write(timing + world + '\n' + rd('day8_parts.js'))
subprocess.run([sys.executable, os.path.join(HERE, 'make_day4.py'), 'day8_text.js', 'day8_all.js', 'day8.html'], check=True)
p = os.path.join(HERE, 'day8.html'); s = open(p, encoding='utf8').read().replace('<div class="num">4</div>', '<div class="num">8</div>', 1)
open(p, 'w', encoding='utf8').write(s)
