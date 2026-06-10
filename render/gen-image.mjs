// gen-image.mjs — Nano Banana Pro still only. Env: NAME, IMG, OUT(full file path)
import fs from 'node:fs';
const ENV=['.env','.env.local','../.env','../.env.local'].find(p=>fs.existsSync(p))||'.env';
const KEY=process.env.FAL_KEY||fs.readFileSync(ENV,'utf8').split('\n').map(l=>l.match(/^\s*FAL_KEY\s*=\s*(.+)/)).filter(Boolean)[0][1].replace(/^["']|["']$/g,'').trim();
const H={'Authorization':'Key '+KEY,'Content-Type':'application/json'};
const NAME=process.env.NAME, IMG=process.env.IMG, OUT=process.env.OUT, ASPECT=process.env.ASPECT||'16:9';
const r=await fetch('https://fal.run/fal-ai/nano-banana-pro',{method:'POST',headers:H,body:JSON.stringify({prompt:IMG,aspect_ratio:ASPECT,num_images:1})});
const j=await r.json(); const u=j?.images?.[0]?.url||j?.image?.url;
if(!u){console.log(NAME,'FAIL',JSON.stringify(j).slice(0,200));process.exit(1);}
fs.mkdirSync(OUT.replace(/\/[^/]+$/,''),{recursive:true});
fs.writeFileSync(OUT,Buffer.from(await(await fetch(u)).arrayBuffer()));
console.log(NAME,'ok ->',OUT);
