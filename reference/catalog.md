# Video × Scroll Effects Catalog

> The replication spec for CCC's $10k-site skill. Every effect = **how the video is rendered** × **how scroll drives it**. The render recipe IS the effect. Get the render wrong and no front-end trick saves it.

## The two-stop, two-video law (non-negotiable)

**Every site has exactly two scroll stops, and each stop is its own independently-rendered video.** One in the hero, one near the bottom. The second stop is NEVER a crop, zoom, or reused segment of the first clip. It is a separate render, with a sibling prompt that matches the first clip's material, lighting, palette, and mood so the two read as one world.

- Hero stop: the headline move (the transform / explode / pan / push).
- Bottom stop: a second beat of the same product/material (a macro, a different motion, a reveal), rendered fresh.
- Match via prompt, not via reuse: write the second prompt by copying the first's lighting/material language and changing only the motion or framing.
- QA gate: if stop 2 looks like stop 1 cropped, it fails. Re-render.

## The one law that makes all of them premium

**Render long, ship as frames, never as a raw `<mp4>` for any scroll-bound effect.**
H.264/WebM are inter-frame compressed: scrubbing backward forces the decoder to rebuild from the last keyframe, which stutters. A PNG/WebP frame sequence (or a WebP spritesheet) is random-access and scrubs perfectly. Apple's AirPods Pro page = **65 frames on a `<canvas>`**, not a video.

Cross-cutting render rules to hand Nano Banana / Seedance OR a 3D artist:
1. **Lock the camera to the scroll axis** — no off-axis drift.
2. **Constant velocity** — equal world-motion per scroll pixel.
3. **Motion blur OFF** — the user controls time; blur ruins scrubbing.
4. **Render long → ship as WebP frames** (or a spritesheet). PNG with alpha, or on a pure black/white field for blend-mode compositing.
5. **Frame density ≥ ~1 frame / 2px of scroll** to avoid stepping. Retina (2×) render.
6. If you MUST keep `<video>` (ambient loops only), fine — loops don't scrub. For scrubbed video, re-encode all-intra (`ffmpeg -g 1`).
7. **Preload with checkpoint priority** — frame 0, then last, then 50%, 25/75%, then fill. Scrubbable before fully loaded.

Front-end engine for all of them: **GSAP ScrollTrigger (pin + scrub) + Lenis (inertia) + canvas/spritesheet frames + SplitType (captions).** This is our `_shared/premium2.js` `CCC.scrub` stack.

---

## The grid

Every effect is **what drives motion** (time / scroll / cursor) × **how the video is presented** (full-bleed / masked / docked / spatial). Locked + proposed styles mapped:

| Style | Drive | Presentation | Status |
|---|---|---|---|
| A — Ambient loop | time | full-bleed | LOCKED |
| B — Scroll-scrub transform | scroll | full-bleed | LOCKED |
| C — Cursor-spotlight reveal | cursor | masked | proposed |
| D — Horizontal pan-lock | scroll (x) | full-bleed | NEW |
| E — Exploded / layer-peel | scroll | spatial | NEW (the one David remembered) |
| F — Camera push-through | scroll | spatial | NEW |
| G — Pinned scrollytelling | scroll | full-bleed + captions | NEW |
| + Video-in-type | time | masked (text) | treatment |
| + Shrink-to-dock (FLIP) | scroll | docked | treatment |
| + Blend-mode melt | any | masked (blend) | treatment |
| + Match-cut section transition | scroll | full-bleed | treatment |
| + Velocity-reactive | scroll velocity | any | treatment |

---

## A — Ambient Loop (LOCKED)
**Render:** Single object, slow orbit or drifting light/liquid. Last frame matches first (or render a clean 360°/full-cycle turntable) so the loop seam is invisible.
**Scroll:** None. `<video autoplay muted loop>`, scroll-independent.
**Premium gate:** Invisible loop point. If you can find the seam, the render failed.
**Our pipeline:** `gen-motion.mjs LOOP=1` (end_image_url = start image).

## B — Scroll-Scrub Transform (LOCKED)
**Render:** ONE object animating a single continuous motion (rotate to face, open, tilt). Single-image-motion — do NOT morph between two different stills or the object drifts into a different object.
**Scroll:** Frame index = `progress * frameCount`, pinned. `CCC.scrub(stageEl, framesPath)`.
**Premium gate:** Object stays itself start→end. ~120 frames over ~400vh.
**Our pipeline:** `gen-motion.mjs LOOP=0` → ffmpeg ~120 frames → `CCC.scrub`.

## C — Cursor-Spotlight Reveal (proposed third locked style)
**Render:** A still on top + the bespoke video underneath, perfectly aligned. Same framing in both.
**Drive:** A soft circular mask tracks the cursor, revealing the video beneath only inside it. Reuses our cursor ring.
**Premium gate:** Still and video pixel-aligned; soft mask edge, not a hard circle.

## D — Horizontal Pan-Lock (NEW — David's horizontal request)
**Render:** A locked, **constant-velocity lateral dolly/truck** moving left→right across one continuous long scene or product lineup (tracking shot parallel to a shelf). Wide master (e.g. 5000×1080). Locked vertical framing — vertical drift fights the scroll axis. For depth, render separated FG/MID/BG layers to parallax in CSS.
**Scroll:** ScrollTrigger `pin:true` + a tween translating the long track on X with `scrub:true`; vertical wheel delta → horizontal `x`. `end` = track pixel width. Camera-X and translateX move **same direction, same rate**.
**Premium gate:** Velocity coherence — 1:1 scroll-to-camera lock + Lenis easing. Cheap = panel-snapping or camera/scroll speed drift ("dragged" feel).
**Our pipeline (AI path):** Nano Banana wide lineup still → Seedance "camera trucks steadily left to right, locked vertical, constant speed, no zoom" → frames → horizontal scrub. Or pure CSS horizontal-pin of a wide loop video for the simple version.
**Reference:** Bulgari Eclettica (`eclettica.bulgari.com`), `the-gum.com`, `fluid.glass`, awwwards.com/websites/horizontal-layout.

## E — Exploded-View / Layer-Peel (NEW — the layered one David remembered)
**Why the earlier attempt failed:** it was stacked CSS PNG layers = cardboard cut-outs. Each layer was independently lit and slid on a flat Z, so the eye reads "Photoshop." It MUST be a rendered video where all parts share one lighting environment and contact shadows.
**Render — two paths:**
- **3D / Blender (best):** parent each component to an empty, keyframe each part translating outward along its own axis over the timeline (an "explode" rig), plus a slow turntable so separation reads volumetrically. Studio HDRI, DoF, render PNG sequence with **alpha**.
- **AI (our fast path):** Nano Banana Pro START = assembled product, END = same product with components separated/floating apart along their axes, **identical lighting and camera**. Seedance image-to-video the transition ("components separate apart along their axes, slight parallax orbit, locked framing, studio light, neutral bg"). Chop to frames. This is literally our Style-B pipeline with an exploded END instead of a rotated one.
**Scroll:** frame index = `progress * frameCount`, pinned. Component labels ("the movement," "the driver") fade in keyed to the frame where each part arrives at rest.
**Premium gate:** Shared lighting + contact shadows across all parts + the slight orbit. No flat-plane sliding.

## F — Camera Push-Through / Fly-Through (NEW)
**Render:** Camera on a forward **dolly path (Z-push)** through the scene/product, along a slight curve so it feels like flight not a zoom. Subtle FOV breathe. Motion blur off. Design the scene as a tunnel/corridor so the dolly never hits a wall.
**Scroll:** flipbook scrub, pinned for the fly-through length. Optionally hand off to a live Three.js scene at the end (baked intro → live hero).
**Premium gate:** Curved path + FOV breathe + crisp frames. Cheap = a flat `scale()` zoom (reads as CSS zoom, not flight).

## G — Pinned Scrollytelling (NEW)
**Render:** ONE continuous clip where narrative beats land at known timestamps. Storyboard the beats with timecodes FIRST, render to match. Wide master with safe margins (captions overlay).
**Scroll:** scrub the sequence pinned; captions are GSAP tweens on a master timeline, each pinned to the frame of its beat. (If staying on `<video>`: encode GOP=1 and use `requestVideoFrameCallback`; otherwise use a frame sequence.)
**Premium gate:** Captions land exactly on their frame; never stalls on fast scrub. Cheap = laggy seeking + text that pops instead of choreographing in/out.

---

## Treatments (layer onto any style)

- **Video-in-type:** clip plays inside the giant wordmark via SVG mask or `mix-blend`, solid brand color elsewhere (NOT banned gradient-text). Render high-contrast subject.
- **Shrink-to-dock (FLIP):** hero loop scales into a small pinned corner player as you scroll into content. Solves the "hero dies on scroll" problem.
- **Blend-mode melt:** render subject on **pure black** → `mix-blend-mode:screen` (drops black) or pure white → `multiply`. Clip melts into the page, no rectangle edge. Dodges the cross-browser alpha-video mess.
- **Match-cut section transition:** render adjacent sections so the **last frame of A composes identically to the first frame of B** (same silhouette/position); cut on scroll → object persists/morphs across the boundary.
- **Velocity-reactive:** bind frame-step size (or `playbackRate`) to Lenis scroll velocity. Fast scroll = more motion energy. Media feels alive.
- **Seamless hidden-cut loop:** render last frame = first frame, or boomerang a palindrome. Invisible seam.

---

## Apple image-sequence confirmed specs (the gold standard)
- AirPods Pro: **65 frames**, PNG ~15.2MB (WebP would cut ~90% to ~1.7MB; spritesheet ~1.5MB).
- ~1200px scroll → ~18.5px:frame (aggressive — slight jitter on slow scroll). Aim ≤ 2px:frame for buttery.
- Rendered to `<canvas>` + rAF (not `<img>`), 2× retina.
- Preload checkpoint priority: 0 → last → 50% → 25/75% → fill.
- Modern best format: **WebP spritesheet** + `--progress` CSS var via `transform:translate3d`; near-zero JS, forward-compatible with `animation-timeline: scroll()`.

## References
- geyer.dev/blog/css-image-sequence-animations — Apple numbers, spritesheet recipe, codec-seek explanation
- css-tricks.com/lets-make-one-of-those-fancy-scrolling-animations-used-on-apple-product-pages — canonical canvas flipbook
- awwwards.com/websites/horizontal-layout — Bulgari Eclettica, the-gum, fluid.glass, OceanX 2025, Shopify Supply
- vectary.com/3d-modeling-blog/animated-3d-exploded-view-product-design — exploded-view authoring
- trac.ffmpeg.org/wiki/Seeking — keyframe-interval seek accuracy (why GOP=1 / frame sequences)

## THE UNIVERSAL SITE STANDARD (locked 2026-06-09, ATELIER = reference build)

Reference bar = ECLIPSE + HORA (loved). OPTIK + SOLERA (continuous loops) are perfect, untouched.

### Asset set per site (non-negotiable)
- **2 videos**: a header (hero) video + a DIFFERENT middle/second video, matched in lighting/style.
- **3 generated images** (Nano Banana Pro, our "ChatGPT image" equiv): used in the feature pairs + gallery + horizontal strip. NEVER reuse a video frame as a filler image, and never repeat the same image across panels.

### Canonical section spine (every site, in order)
1. **Hero** — one bespoke video (loop A, or scrub B-G). Text on a focused dark halo + text-shadow so the eyebrow never washes out. Nav bold.
2. **Thesis** — one large line, big readable type, on the mesh-gradient background.
3. **Feature** — 2 alternating text+image pairs; images = generated stills (g1, g2).
4. **Gallery band** — 3-up: generated image + MIDDLE VIDEO (different clip) + generated image (g3, video, g1).
5. **Second moment** — a second scroll-stop scrub (uses video 2) OR a plate.
6. **Rows** — 3 numbered editorial detail rows.
7. **Reserve** — CTA.
8. **Footer** — animated aurora + drifting dots, "Created by Claude Code Club · claudecodeclub.ai".

### Universal rules (shared template enforces)
- **Hero legibility**: focused dark halo behind eyebrow+wordmark (`.hwm::before`) + text-shadows. Works on any footage.
- **Nav bold** (weight 500).
- **Background**: animated mesh gradient (`body::before`, slow drift), content sections translucent (90% bg) so it shows; hero footage fades into content via a seam gradient (`.stage .pin::after`) — NO abrupt solid-color jump.
- **Type scale**: thesis/section headers large.
- **Footer**: taller (min-height 240px) so aurora + dots flow smoothly and consistently.
- **Scrub heroes idle on landing**: `CCC.scrub(...,{idle:true})` gently drifts before first scroll, so it is alive on load (fixes "feels dead until I scroll").
- **Copy tight**: no overwrought spec lines (kill "64 points of audio" type clutter). Less text.
- **Scrub reveal variety**: vary how content reveals during scrub. ATRIUM's zoom-into-image-then-reveal is the loved one — do more like it; do not default to "text fades in" every time.

### Per-site rollout verdicts (from David's review)
- ATELIER — DONE, reference build.
- RIVAGE — idle motion added; apply full spine.
- MERIDIAN — loved exploded hero, but template over-used: too many placeholder images + double-row feel. Rebuild with generated images + clearer product intro (AÉRA-style "load → scroll → understand the product"). Keep the explode.
- FLUX — hero too busy, too much text, same image repeated. Trim copy hard, vary images, simplify (cut "64 points of audio").
- ATRIUM — loved (zoom reveal). Keep; build one MORE like it.
- FOUNDRY — loved. Keep.
- RITUAL — disliked. Redo or replace.
- ECLIPSE / HORA — the bar. OPTIK / SOLERA — perfect, no changes.
