# Design Laws (fill the config to these)

The engine handles motion and layout. These laws govern the choices you put in `site.config.mjs`.

## Color
- **OKLCH only.** Never `#000` or `#fff`. Tint every neutral toward the brand hue (chroma 0.005–0.02).
- **One committed accent.** A single saturated color carries the identity. Everything else is tinted neutral.
- **Pick the theme from a scene, not a category.** Write one sentence: who is using this, where, in what light. Let that force dark vs light. "Coffee brand" forces nothing; "the last cup before a midnight shift" forces a nocturnal palette.
- Reduce chroma as lightness nears 0 or 1, or it looks garish.

## Type
- Display serif or grotesk for headings; a clean grotesk for body.
- Hierarchy through scale + weight (≥1.25 ratio between steps). Never a flat scale.
- Body line length 65–75ch.

## Copy
- Every word earns its place. No restated headings, no intros that repeat the title.
- **No em dashes.** Use commas, colons, periods, parentheses. Not `--` either.
- Headlines short. Captions 3–5 words. Kill spec-sheet clutter (no "64 points of audio" lists).
- Specific beats generic. "Two-thirds less acid" beats "smooth and delicious."

## Layout (the spine enforces this — do not fight it)
- 2 videos + 3 images, each used exactly **once**. No image or video appears twice.
- No card grids, no gallery walls, no reused frames as filler.

## The AI-slop test
If someone could look at it and say "AI made that," it failed. The usual tells: gradient text, glassmorphism by default, identical card grids, the big-number hero-metric cliché, a category-obvious palette. Avoid all of them.

## Render laws (for the asset prompts)
- Render long, ship as frames (the engine does the framing). Lock the camera to the scroll axis.
- Constant velocity. Motion blur OFF (the user controls time).
- Hero video and middle video are siblings: same light and palette, different shot.
- Exploded/transform: START object must equal END object, or fall back to a loop.
