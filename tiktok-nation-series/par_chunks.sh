#!/bin/bash
# Parallel resumable render: 100-frame chunks, 2 at a time, skipping chunks already done.
# usage: par_chunks.sh <page.html> <out.mp4> <total_frames>
cd "$(dirname "$0")"; PAGE_=$1; OUT=$2; N=$3; D=seg_${OUT%.mp4}; mkdir -p $D
one(){ s=$1; f=$D/c$(printf %05d $s).mp4; [ -s $f.done ] && return; PAGE=$PAGE_ PORT=$((9000+s/100)) START=$s END=$((s+100)) CUES=cues_${OUT%.mp4}.json node render.js video en $f 30 > $f.log 2>&1 && echo ok > $f.done; }
export -f one; export D PAGE_ OUT
seq 0 100 $((N-1)) | xargs -P2 -I{} bash -c 'one {}'
: > $D/list.txt; for s in $(seq 0 100 $((N-1))); do f=c$(printf %05d $s).mp4; [ -s $D/$f.done ] || { echo MISSING $f; exit 1; }; echo "file '$f'" >> $D/list.txt; done
ffmpeg -y -v error -f concat -safe 0 -i $D/list.txt -c copy $OUT && echo "DONE $OUT"
