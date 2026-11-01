#!/usr/bin/env bash
# Build "NUIT 1 - LE VOCAL" remake: renders frames, synthesizes audio, muxes.
#   ./make.sh                      -> nuit1_le_vocal.mp4 (synth sound design)
#   ./make.sh original.mp4         -> also nuit1_le_vocal_original_audio.mp4
#                                     (same visuals with the original narration track)
set -euo pipefail
cd "$(dirname "$0")"
python3 render.py build_silent.mp4
python3 audio.py build_sfx.wav
ffmpeg -y -v error -i build_silent.mp4 -i build_sfx.wav -c:v copy -c:a aac -b:a 160k -shortest nuit1_le_vocal.mp4
if [[ $# -ge 1 ]]; then
  ffmpeg -y -v error -i build_silent.mp4 -i "$1" -map 0:v -map 1:a -c:v copy -c:a aac -b:a 160k -shortest \
    nuit1_le_vocal_original_audio.mp4
fi
rm -f build_silent.mp4 build_sfx.wav
echo "done"
