#!/bin/bash
# Resumable render: renders 300-frame segments (skipping finished ones), then concatenates.
# usage: render_chunks.sh <page.html> <lang> <out.mp4> <total_frames>
set -e
cd "$(dirname "$0")"
PAGE_=$1; LANG_=$2; OUT=$3; N=$4; STEP=300; mkdir -p seg_${OUT%.mp4}
: > seg_${OUT%.mp4}/list.txt
for ((s=0; s<N; s+=STEP)); do
  e=$((s+STEP)); f=seg_${OUT%.mp4}/s$(printf %05d $s).mp4
  if [ ! -s "$f.done" ]; then PAGE=$PAGE_ START=$s END=$e node render.js video $LANG_ "$f" 30; echo ok > "$f.done"; fi
  echo "file '$(basename $f)'" >> seg_${OUT%.mp4}/list.txt
done
ffmpeg -y -v error -f concat -safe 0 -i seg_${OUT%.mp4}/list.txt -c copy "$OUT"
echo "DONE $OUT"
