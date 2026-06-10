#!/bin/zsh
# deploy.sh — publish your site live in one command.
# Your built site (dist/<slug>/) is SELF-CONTAINED: the HTML, the engine, and every
# video and image are in that one folder. No Cloudinary, no external media host needed.
# It deploys like any static folder.
cd "$(dirname "$0")"
slug=$(node -e "import('./site.config.mjs').then(m=>process.stdout.write(m.default.slug))")
dir="dist/$slug"
[ -d "$dir" ] || { echo "Nothing built yet. Run ./build.sh first."; exit 1; }

echo "Publishing $dir ..."
echo "(first run will ask you to log in to Vercel — free)"
npx --yes vercel@latest deploy "$dir" --prod --yes

cat <<'NOTE'

No CLI? Two zero-setup alternatives:
  - Netlify Drop: open app.netlify.com/drop and drag the dist/<slug> folder onto the page.
  - GitHub Pages: push dist/<slug> to a repo and enable Pages.
Everything in that folder ships together. Your videos will play because they are right there next to the page.
NOTE
