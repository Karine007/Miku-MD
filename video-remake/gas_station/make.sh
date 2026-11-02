#!/usr/bin/env bash
# Build "ZOMBIE OUTBREAK: STRANDED AT A GAS STATION" -> gas_station.mp4
# Voices are cached in voices/ (re-recording needs GEMINI_API_KEY).
set -euo pipefail
cd "$(dirname "$0")"
python3 voice.py build_voice.wav          # also writes timeline.json
python3 render.py build_silent.mp4
python3 audio.py build_sfx.wav
ffmpeg -y -v error -i build_sfx.wav -i build_voice.wav -filter_complex \
  "[1:a]asplit=2[vk][vm];[0:a][vk]sidechaincompress=threshold=0.02:ratio=5:attack=15:release=350:makeup=1[duck];\
   [duck]volume=0.9[bed];[vm]volume=1.25[vo];[bed][vo]amix=inputs=2:normalize=0,alimiter=limit=0.95[a]" \
  -map "[a]" build_mix.wav
ffmpeg -y -v error -i build_silent.mp4 -i build_mix.wav -c:v copy -c:a aac -b:a 192k -shortest gas_station.mp4
rm -f build_silent.mp4 build_sfx.wav build_voice.wav build_mix.wav
echo "done"
