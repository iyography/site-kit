#!/bin/zsh
# build.sh — wires rendered assets + stamps the config onto the engine.
# Run AFTER `node render.mjs` (or after ./use-stock.sh dropped stock into work/<slug>/).
cd "$(dirname "$0")"
slug=$(node -e "import('./site.config.mjs').then(m=>process.stdout.write(m.default.slug))")
style=$(node -e "import('./site.config.mjs').then(m=>process.stdout.write(m.default.style||'B'))")
A="dist/$slug/assets"; W="work/$slug"
mkdir -p "$A/sec"

if [ "$style" = "A" ]; then
  # Style A: ambient loop hero — use the video directly, no frame extraction
  cp "$W/hero/hero.mp4" "$A/hero.mp4"
  ffmpeg -y -loglevel error -i "$W/hero/hero.mp4" -frames:v 1 -vf "scale=1600:-2" "$A/still.jpg"
else
  # B/C/D/E/F/G: hero scrub frames from video 1
  mkdir -p "$A/frames"; rm -f "$A/frames"/[0-9]*.jpg 2>/dev/null
  src="$W/hero/hero.mp4"
  dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$src")
  fps=$(echo "scale=4;120/$dur" | bc)
  ffmpeg -y -loglevel error -i "$src" -vf "fps=$fps,scale=1600:-2" -frames:v 120 "$A/frames/tmp_%03d.jpg"
  i=1; for f in "$A/frames"/tmp_*.jpg; do mv "$f" "$A/frames/$(printf '%04d' $i).jpg"; i=$((i+1)); done
  w=$(sips -g pixelWidth "$A/frames/0001.jpg" | awk '/pixelWidth/{print $2}')
  h=$(sips -g pixelHeight "$A/frames/0001.jpg" | awk '/pixelHeight/{print $2}')
  printf '{"count":120,"w":%s,"h":%s}' "$w" "$h" > "$A/frames/manifest.json"
  cp "$A/frames/0001.jpg" "$A/still.jpg"
fi

# video 2 -> middle band loop (every style)
cp "$W/middle/hero.mp4" "$A/sec/hero.mp4"
# 3 images
cp "$W/g1.jpg" "$A/g1.jpg"; cp "$W/g2.jpg" "$A/g2.jpg"; cp "$W/g3.jpg" "$A/g3.jpg"

node stamp.mjs
echo "BUILD DONE ($style) -> dist/$slug/ (serve dist/ and open /$slug/)"
