// site.config.mjs — THE ONLY FILE YOU CUSTOMIZE.
// Talk to Claude ("/build-site") and it fills this in for your brand, or edit by hand.
// The engine (engine/) and templates (templates/) give you the $10k quality floor for free.

export default {
  slug: 'nocturne',
  wm: 'NOCTURNE',                 // wordmark
  concept: 'Cold Brew',
  style: 'B',                     // A loop · B scrub · C cursor · D horizontal · E exploded · F push · G scrollytelling

  // ---- design (OKLCH; never #000/#fff; one committed accent) ----
  font: 'Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;1,9..144,300&family=Hanken+Grotesk:wght@300;400;500',
  disp: "'Fraunces',serif", sans: "'Hanken Grotesk',sans-serif", dispW: 300, italic: true,
  bg: 'oklch(0.16 0.018 280)', ink: 'oklch(0.93 0.014 70)', muted: 'oklch(0.62 0.02 70)', accent: 'oklch(0.7 0.1 62)',

  // ---- copy ----
  eye: 'Single-Origin · Slow-Steeped',
  lede: 'Steeped cold for sixteen hours, never heated, never rushed. A darker, smoother cup for the hours after dark.',
  thesis: 'Heat makes coffee fast. Time makes it <em>better.</em>',
  lab: 'The steep',
  cap1: { k: 'Sixteen hours', h: 'Cold,<br>and <em>patient.</em>' },
  cap2: { k: 'Never heated', h: 'Smooth,<br>by <em>time.</em>' },
  cap3: { k: 'Over ice', h: 'Closer, it<br>pours like <em>night.</em>' },
  f1: { k: 'The steep', h: 'Sixteen hours,<br>never heated', p: 'Coarse-ground single-origin steeped in cold water overnight, so none of the bitterness that heat pulls ever makes it into the cup. <b>Two-thirds less acid.</b>' },
  f2: { k: 'The bean', h: 'One farm,<br>roasted dark', p: 'A single Colombian lot roasted for body, not brightness, dated on the bottle. <b>When the harvest is gone, the batch retires.</b>' },
  band: 'Made for the hours the day forgot.',
  rows: [
    { n: 'Steep', h: 'Cold, 16 hours', p: 'Slow extraction in cold water, filtered twice, bottled without dilution.' },
    { n: 'Origin', h: 'Single Colombian lot', p: 'One farm, one harvest, traceable to the row and dated on the bottle.' },
    { n: 'Serve', h: 'Black, or over ice', p: 'Concentrated enough to cut with water or milk, smooth enough to drink neat.' },
  ],
  reserve: { k: 'Single origin · dated · small-batch', h: 'Drink the dark.', cta: 'Order — $19 / bottle' },

  // ---- assets: the render prompts the pipeline turns into 2 videos + 3 images ----
  render: {
    hero:   { prompt: 'Dark cold brew coffee slowly steeping and dripping through a glass tower, deep brown swirls, moody nocturnal low light, macro, ultra-detailed cinematic, 16:9',
              motion: 'dark cold brew slowly drips and swirls through the tower, moody, slow cinematic motion, locked camera' },
    middle: { prompt: 'Cold brew coffee poured over a glass of clear ice cubes, dark coffee cascading with condensation, moody amber light, macro, ultra-detailed cinematic, 16:9',
              motion: 'cold brew pours slowly over the ice and swirls, condensation, cinematic, locked camera', loop: true },
    images: [
      'A matte black bottle of single-origin cold brew on a dark stone counter, moody nocturnal light, ultra-detailed product photography, vertical',
      'Macro of dark-roasted coffee beans with an oil sheen, moody low light, ultra-detailed, vertical',
      'A glass of cold brew over ice on a dark bar with condensation, moody amber light, ultra-detailed product photography, vertical',
    ],
  },
};
