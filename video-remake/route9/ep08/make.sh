#!/usr/bin/env bash
# Build ZOMBIE OUTBREAK: ROUTE 9 - Episode 8 "The Linemen" -> ep08_the_linemen.mp4
# Uses the shared engine in ../../gas_station (voice.py, render.py). Voices cached in voices/.
set -euo pipefail
cd "$(dirname "$0")"
ENGINE=../../gas_station
EPISODE=. python3 $ENGINE/voice.py build_voice.wav          # also writes timeline.json
EPISODE=. python3 $ENGINE/render.py build_silent.mp4
python3 audio.py build_sfx.wav
ffmpeg -y -v error -i build_sfx.wav -i build_voice.wav -filter_complex \
  "[1:a]asplit=2[vk][vm];[0:a][vk]sidechaincompress=threshold=0.015:ratio=6:attack=15:release=350:makeup=1[duck];\
   [duck]volume=0.85[bed];[vm]volume=1.25[vo];[bed][vo]amix=inputs=2:normalize=0,alimiter=limit=0.95[a]" \
  -map "[a]" build_mix.wav
ffmpeg -y -v error -i build_silent.mp4 -i build_mix.wav -c:v copy -c:a aac -b:a 192k -shortest ep08_the_linemen.mp4
rm -f build_silent.mp4 build_sfx.wav build_voice.wav build_mix.wav
echo "done"
