#!/bin/bash
# usage: encode-new.sh A2_SRC B2_SRC [A2_X] [B2_X]  -> 9:16 story encodes + posters, then site assets
set -e; IG=/home/claude/assets-src/video/ig
A=$1; B=$2
aw=$(ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=p=0 "$A"); bw=$(ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=p=0 "$B")
crop(){ IFS=, read W H <<<"$1"; cw=$(( H*9/16/2*2 )); x=${2:-$(( (W-cw)/2 ))}; echo "crop=$cw:$H:$x:0"; }
ffmpeg -v error -y -i "$A" -vf "$(crop $aw $3),scale=720:1280:flags=lanczos,fps=30,format=yuv420p" -c:v libx264 -preset slow -crf 21 -profile:v high -an -movflags +faststart $IG/a2.mp4
ffmpeg -v error -y -i "$B" -vf "$(crop $bw $4),scale=720:1280:flags=lanczos,fps=30,format=yuv420p" -c:v libx264 -preset slow -crf 20 -profile:v high -an -movflags +faststart $IG/b2.mp4
for k in a2 b2; do ffmpeg -v error -y -i $IG/$k.mp4 -frames:v 1 $IG/$k-poster.png; done
node /home/claude/tools/make-stories.js
