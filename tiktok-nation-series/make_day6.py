# Builds day6.html: the Day 5 world (all its builds already standing) + the Day 6 builds and timeline.
# usage: python3 make_day6.py [timing.json]   (timing.json: real scene start times from the voice take)
import json, os, subprocess, sys
HERE = os.path.dirname(os.path.abspath(__file__))
d5 = open(os.path.join(HERE, 'day5_parts.js'), encoding='utf8').read()
world5 = d5[:d5.index('\nconst SH=[')]
d6 = open(os.path.join(HERE, 'day6_parts.js'), encoding='utf8').read()
timing = ''
if len(sys.argv) > 1: timing = 'window.DAY6_TR=%s;\n' % json.dumps(json.load(open(sys.argv[1])))
open(os.path.join(HERE, 'day6_all.js'), 'w', encoding='utf8').write(timing + world5 + '\n' + d6)
subprocess.run([sys.executable, os.path.join(HERE, 'make_day4.py'), 'day6_text.js', 'day6_all.js', 'day6.html'], check=True)
p = os.path.join(HERE, 'day6.html'); s = open(p, encoding='utf8').read().replace('<div class="num">4</div>', '<div class="num">6</div>', 1)
open(p, 'w', encoding='utf8').write(s)
