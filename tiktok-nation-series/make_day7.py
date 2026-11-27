# Builds day7.html: Day 5 world + Day 6 builds (already standing) + the Day 7 builds and timeline.
# usage: python3 make_day7.py [timing.json]
import json, os, subprocess, sys
HERE = os.path.dirname(os.path.abspath(__file__))
rd = lambda f: open(os.path.join(HERE, f), encoding='utf8').read()
d5 = rd('day5_parts.js'); d6 = rd('day6_parts.js')
world = d5[:d5.index('\nconst SH=[')] + '\n' + d6[:d6.index('\nconst SH=[')]
timing = 'window.DAY7_TR=%s;\n' % json.dumps(json.load(open(sys.argv[1]))) if len(sys.argv) > 1 else ''
open(os.path.join(HERE, 'day7_all.js'), 'w', encoding='utf8').write(timing + world + '\n' + rd('day7_parts.js'))
subprocess.run([sys.executable, os.path.join(HERE, 'make_day4.py'), 'day7_text.js', 'day7_all.js', 'day7.html'], check=True)
p = os.path.join(HERE, 'day7.html'); s = open(p, encoding='utf8').read().replace('<div class="num">4</div>', '<div class="num">7</div>', 1)
open(p, 'w', encoding='utf8').write(s)
