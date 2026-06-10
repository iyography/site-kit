# CCC Site Kit

Build a $10k-class animated website for any brand. The engine gives you the quality floor; you supply one config and your assets.

## Quickstart

The easy way: open Claude Code in this folder and run **`/build-site`**. It interviews you, fills `site.config.mjs`, renders your assets, and ships the site.

The manual way:

```bash
# 1. Edit site.config.mjs — your brand, palette, copy, style, and render prompts.

# 2. Render your 2 videos + 3 images (needs a fal.ai key):
FAL_KEY=your_key node render.mjs
#    ...or no key? use a stock set:  ./use-stock.sh warm <your-slug>

# 3. Build:
./build.sh

# 4. Preview:
cd dist && python3 -m http.server 8000   # then open /<slug>/

# 5. Ship it live (one command):
./deploy.sh
```

### Hosting: no Cloudinary, no third-party media host
Your built site lives in `dist/<slug>/` and is **fully self-contained** — the HTML, the engine, and every video and image are in that one folder. It deploys like any static site: `./deploy.sh` pushes it to Vercel, or drag the folder onto [Netlify Drop](https://app.netlify.com/drop). The videos play because they ship right next to the page.

## What's in here

| Folder | What it is | Touch it? |
|---|---|---|
| `engine/` | premium2.css + premium2.js — living scrub, footer FX, mesh, legibility, the no-duplication spine | **No** |
| `templates/` | the spine + style variants (A–G) | No |
| `render/` | gen-image / gen-motion / gen-transform (Nano Banana + Seedance) | No |
| `reference/` | the style catalog + design laws | Read |
| `stock/` | fallback videos + images if you have no fal key | Use |
| `site.config.mjs` | **your brand, copy, palette, style, render prompts** | **Yes — this is yours** |
| `dist/` | the built site | Output |

## The standard (baked in, so every site clears the bar)
- 7 scroll styles: A loop · B scrub · C cursor · D horizontal · E exploded · F push-through · G scrollytelling.
- Every site = 2 videos + 3 images, each used exactly once. No duplication.
- Living scrub (heroes keep moving when idle), legibility halo, mesh background, animated footer.
- OKLCH color, no `#000`/`#fff`, one accent, no em dashes.

Customizing is a conversation: tell Claude "darker," "exploded style," "new headline," and it edits the config and rebuilds. Copy changes never need a re-render.

Built by Claude Code Club · claudecodeclub.ai
