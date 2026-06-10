// gen-motion.mjs — single still -> cinematic Seedance video. LOOP=1 => first=last seamless loop.
// Saves <OUTDIR>/{still.jpg,hero.mp4}. Env: NAME, IMG, VID, OUTDIR, LOOP(0/1)
import fs from 'node:fs';
const ENV=['.env','.env.local','../.env','../.env.local'].find(p=>fs.existsSync(p))||'.env';
const KEY=process.env.FAL_KEY||fs.readFileSync(ENV,'utf8').split('\n').map(l=>l.match(/^\s*FAL_KEY\s*=\s*(.+)/)).filter(Boolean)[0][1].replace(/^["']|["']$/g,'').trim();
const H={'Authorization':'Key '+KEY,'Content-Type':'application/json'};
const NAME=process.env.NAME, IMG=process.env.IMG, VID=process.env.VID, OUT=process.env.OUTDIR, LOOP=process.env.LOOP==='1';
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function image(){
  const r=await fetch('https://fal.run/fal-ai/nano-banana-pro',{method:'POST',headers:H,body:JSON.stringify({prompt:IMG,aspect_ratio:'16:9',num_images:1})});
  const j=await r.json(); const u=j?.images?.[0]?.url||j?.image?.url;
  if(!u){console.log(NAME,'IMG FAIL',JSON.stringify(j).slice(0,200));process.exit(1);}
  fs.mkdirSync(OUT,{recursive:true}); fs.writeFileSync(OUT+'/still.jpg',Buffer.from(await(await fetch(u)).arrayBuffer()));
  console.log(NAME,'image ok'); return u;
}
async function i2v(u){
  const ID='fal-ai/bytedance/seedance/v1/pro/image-to-video';
  const body={prompt:VID,image_url:u,resolution:'1080p',duration:'5'}; if(LOOP)body.end_image_url=u;
  const r=await fetch('https://queue.fal.run/'+ID,{method:'POST',headers:H,body:JSON.stringify(body)});
  if(!r.ok){console.log(NAME,'submit',r.status,(await r.text()).slice(0,160));return;}
  const j=await r.json(); const st=j.status_url, rp=j.response_url;
  for(let i=0;i<170;i++){await sleep(5000);const s=await(await fetch(st,{headers:H})).json();
    if(i%5===0)console.log(NAME,i,s.status);
    if(s.status==='COMPLETED'){const res=await(await fetch(rp,{headers:H})).json();
      let v=res.video?.url; if(!v)JSON.stringify(res,(k,x)=>{if(!v&&typeof x==='string'&&/\.mp4/.test(x))v=x;return x;});
      fs.writeFileSync(OUT+'/hero.mp4',Buffer.from(await(await fetch(v)).arrayBuffer()));
      console.log(NAME,'VIDEO SAVED',(LOOP?'loop':'one-way'));return;}
    if(s.status==='FAILED'){console.log(NAME,'FAILED');return;}}
}
(async()=>{await i2v(await image());})().catch(e=>{console.error(NAME,e);process.exit(1);});
