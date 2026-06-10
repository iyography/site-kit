#!/bin/zsh
# use-stock.sh <set> <slug>   e.g. ./use-stock.sh warm mybrand
cd "$(dirname "$0")"
set=$1; slug=$2
[ -d "stock/$set" ] || { echo "no stock set '$set' (have: $(ls stock))"; exit 1; }
mkdir -p "work/$slug/hero" "work/$slug/middle"
cp "stock/$set/hero.mp4"   "work/$slug/hero/hero.mp4"
cp "stock/$set/middle.mp4" "work/$slug/middle/hero.mp4"
cp "stock/$set/g1.jpg" "work/$slug/g1.jpg"
cp "stock/$set/g2.jpg" "work/$slug/g2.jpg"
cp "stock/$set/g3.jpg" "work/$slug/g3.jpg"
echo "stock set '$set' -> work/$slug/  (now run ./build.sh)"
