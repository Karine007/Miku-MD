#!/usr/bin/env bash
# Build the "NUIT 1 - LE VOCAL" remake.
#   ./make.sh                  -> nuit1_le_vocal_remake.mp4 (Gemini voice-over + synth sound design)
#   ./make.sh original.mp4     -> also nuit1_le_vocal_remake_original_audio.mp4 (original soundtrack)
# Voice clips are cached in voices/; regenerating them needs GEMINI_API_KEY.
set -euo pipefail
cd "$(dirname "$0")"
python3 render.py build_silent.mp4
python3 audio.py build_sfx.wav
python3 voices.py build_voice.wav
ffmpeg -y -v error -i build_sfx.wav -i build_voice.wav -filter_complex \
  "[1:a]asplit=2[vk][vm];[0:a][vk]sidechaincompress=threshold=0.02:ratio=5:attack=15:release=350:makeup=1[duck];\
   [duck]volume=0.85[bed];[vm]volume=1.25[vo];[bed][vo]amix=inputs=2:normalize=0,alimiter=limit=0.95[a]" \
  -map "[a]" build_mix.wav
ffmpeg -y -v error -i build_silent.mp4 -i build_mix.wav -c:v copy -c:a aac -b:a 192k -shortest nuit1_le_vocal_remake.mp4
if [[ $# -ge 1 ]]; then
  ffmpeg -y -v error -i build_silent.mp4 -i "$1" -map 0:v -map 1:a -c:v copy -c:a aac -b:a 160k -shortest \
    nuit1_le_vocal_remake_original_audio.mp4
fi
rm -f build_silent.mp4 build_sfx.wav build_voice.wav build_mix.wav
echo "done"
