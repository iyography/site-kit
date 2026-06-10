// stamp.mjs — stamps site.config.mjs onto the engine -> dist/<slug>/index.html
import config from './site.config.mjs';
import { page as spine } from './templates/spine.mjs';
import { page as cursor } from './templates/cursor.mjs';
import { mkdirSync, writeFileSync, copyFileSync } from 'node:fs';
const c = { ...config, img: true };
mkdirSync(`dist/${c.slug}`, { recursive: true });
writeFileSync(`dist/${c.slug}/index.html`, (c.style === 'C' ? cursor : spine)(c));
// engine lives INSIDE the site folder so dist/<slug>/ is fully self-contained and deploys as-is
mkdirSync(`dist/${c.slug}/_shared`, { recursive: true });
copyFileSync('engine/premium2.css', `dist/${c.slug}/_shared/premium2.css`);
copyFileSync('engine/premium2.js', `dist/${c.slug}/_shared/premium2.js`);
console.log(`stamped dist/${c.slug}/index.html`);
