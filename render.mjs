// render.mjs — turns site.config.mjs's render prompts into 2 videos + 3 images.
// Needs FAL_KEY in env. Outputs to work/<slug>/. Run: node render.mjs
import config from './site.config.mjs';
import { spawn } from 'node:child_process';
const slug = config.slug, R = config.render;
const run = (script, env) => new Promise(res => {
  const p = spawn('node', [`render/${script}`], { env: { ...process.env, ...env }, stdio: 'inherit' });
  p.on('close', res);
});
console.log(`Rendering assets for ${slug} (2 videos + 3 images)...`);
await Promise.all([
  run('gen-motion.mjs', { NAME: slug+'-hero',   IMG: R.hero.prompt,   VID: R.hero.motion,   OUTDIR: `work/${slug}/hero`,   LOOP: '0' }),
  run('gen-motion.mjs', { NAME: slug+'-middle', IMG: R.middle.prompt, VID: R.middle.motion, OUTDIR: `work/${slug}/middle`, LOOP: R.middle.loop ? '1' : '0' }),
  ...R.images.map((p, i) => run('gen-image.mjs', { NAME: `${slug}-g${i+1}`, IMG: p, OUT: `work/${slug}/g${i+1}.jpg`, ASPECT: '3:4' })),
]);
console.log('RENDER DONE');
