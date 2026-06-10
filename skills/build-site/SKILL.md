---
name: build-site
description: Build a $10k-class animated website for the user's brand. Interviews them, picks a scroll style, writes the config, renders bespoke videos and images, and ships a site to the CCC standard. Use when the user wants a premium animated landing page, product site, or portfolio.
---

# Build Site

You are building the user a premium animated website that looks like it cost $10,000, using the CCC Site Kit. The kit gives you the quality floor for free. Your job is only to make it **theirs**.

## The one idea

Every great site here = **the engine + the standard (the quality floor) wrapped around a unique config + unique assets (the customization).** You never touch `engine/`. You only fill in `site.config.mjs` and render the assets. The floor is guaranteed; you make it specific.

## Flow

### 0. Setup (first run only)
If there is no `site-kit/` folder in the user's current project, copy the kit scaffold into it so they can work locally:

```bash
mkdir -p site-kit && cp -R "$CLAUDE_PLUGIN_ROOT/." site-kit/ && cd site-kit && rm -rf .git work dist
```

All later commands (`node render.mjs`, `./build.sh`, editing `site.config.mjs`) run inside `site-kit/`. Read `reference/catalog.md` and `reference/design-laws.md` from there (or from `$CLAUDE_PLUGIN_ROOT/reference/`).

### 1. Interview (keep it to 4 questions)
- What is the product or brand, in one line?
- Who is it for, and what should they *feel*?
- What is the one thing they should remember?
- Do you have a fal.ai key (for bespoke renders), or should we use the stock pack?

Do not over-ask. Infer the rest and propose.

### 2. Pick the scroll style
Read `reference/catalog.md`. Match the product to a style — do not default to one:
- **A Ambient loop** — a single hero object that just looks beautiful (spirits, fragrance, a watch). No scroll effect.
- **B Scroll-scrub** — a material or product that transforms/rotates as you scroll (most products, textures).
- **C Cursor-spotlight** — something that hides in the dark and is revealed (lighting, a car, anything dramatic).
- **D Horizontal pan-lock** — a place or a lineup you move sideways through (a workshop, a coast, a collection).
- **E Exploded** — a built object worth taking apart (a watch, earbuds, a camera, anything mechanical).
- **F Push-through** — a space you fly into (architecture, an experience, an interface).
- **G Scrollytelling** — a process worth watching unfold (coffee, forging, making anything).

State your pick and why in one line.

### 3. Write the config (this IS the design work)
Fill every field in `site.config.mjs`. Obey the design laws (`reference/design-laws.md`):
- **Palette**: OKLCH only, never `#000`/`#fff`, one committed accent. Choose a theme from a one-sentence scene, not from the category.
- **Copy**: tight, specific, no filler. **No em dashes.** Headlines short. Kill any "spec-sheet" clutter.
- **Captions** (cap1/cap2/cap3): 3-5 words, one `<em>` accent word each.
- Keep the asset budget: the spine uses **2 videos + 3 images, each exactly once.** Never add more slots; never reuse an asset. That is what keeps it clean.

### 4. Write the render prompts
In `config.render`, write prompts that obey the render laws (`reference/catalog.md` → render rules):
- **2 videos**: `hero` (the header move) + `middle` (a *different* second video that matches the hero's light and palette — sibling prompt, not the same shot).
- **3 images**: a product/context shot, a macro, and a hero still. All `vertical`.
- Lock the camera, constant velocity, motion blur off.

### 5. Render + build
- With a fal key: `FAL_KEY=... node render.mjs` then `./build.sh`.
- Without: copy a matching set from `stock/` into `work/<slug>/` (hero/hero.mp4, middle/hero.mp4, g1-3.jpg), then `./build.sh`.
- Serve `dist/` and open `/<slug>/`. Show the user.

### 6. Iterate by conversation
This is the whole point. The user says it, you change the config:
- "Make it darker / warmer" → edit the palette, `./build.sh` (no re-render).
- "Shorter headline / different copy" → edit copy, `./build.sh`.
- "Use the exploded style" → change `style` + rewrite the hero render prompt, re-render the hero only, `./build.sh`.
- "Swap the product shot" → rewrite one image prompt, re-render `g1`, `./build.sh`.
Only re-render the asset that changed. Copy edits never need a render.

## Hard rules (do not break)
- Never edit `engine/`. The living scrub, footer, mesh, legibility halo, and the no-duplication spine are already correct.
- 2 videos + 3 images, each used once. No gallery grids, no reused frames.
- No em dashes in copy. No `#000`/`#fff`. One accent.
- Every shareable artifact and the footer say `claudecodeclub.ai`.
- If a render's START and END drift into a different object (exploded/transform styles), fall back to a loop — consistency over spectacle.

## Result
A site indistinguishable in quality from the CCC showcase, but unmistakably the user's: their brand, their product, their words, their bespoke renders.
