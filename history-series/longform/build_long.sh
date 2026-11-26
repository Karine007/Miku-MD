#!/bin/bash
# Builds the long-form page for a story: scenes_long.js (= scenes.js + scenes_new.js), main_long.js, <name>_long.html
# usage: build_long.sh <name> "<hook big>" "<hook small>"
set -e; cd "$(dirname "$0")/../$1"
cat scenes.js scenes_new.js > scenes_long.js
sed "s#import('./scenes.js')#import('./scenes_long.js')#" ../fyre/main.js > main_long.js
sed -e "s#\$12,000<small>FOR A SANDWICH?!</small>#$2<small>$3</small>#" -e 's#timeline_v2.js#timeline_long.js#' -e 's#src="main.js"#src="main_long.js"#' \
    -e "s#window.HOOK=\[-1,3.2\];#window.HOOK=[-1,3.2];window.SHORT_END=['SUBSCRIBE','RISE \& RUIN'];#" ../fyre/fyre_v2.html > $1_long.html
grep -c main_long $1_long.html
