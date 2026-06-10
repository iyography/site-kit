// gen-transform.mjs — TRANSFORMATION pipeline (start frame != end frame).
// 1. Nano Banana Pro: START still (IMG_A) + END still (IMG_B)
// 2. Seedance image-to-video: image_url=START, end_image_url=END => scrubbable transformation
// Saves <OUTDIR>/assets/{start.jpg,end.jpg,hero.mp4}. Env: NAME, IMG_A, IMG_B, VID, OUTDIR
import fs from 'node:fs';
const ENV=['.env','.env.local','../.env','../.env.local'].find(p=>fs.existsSync(p))||'.env';
const KEY=process.env.FAL_KEY||fs.readFileSync(ENV,'utf8').split('\n').map(l=>l.match(/^\s*FAL_KEY\s*=\s*(.+)/)).filter(Boolean)[0][1].replace(/^["']|["']$/g,'').trim();
const H={'Authorization':'Key '+KEY,'Content-Type':'application/json'};
const NAME=process.env.NAME, IMG_A=process.env.IMG_A, IMG_B=process.env.IMG_B, VID=process.env.VID, OUT=process.env.OUTDIR;
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function image(prompt,file){
  const r=await fetch('https://fal.run/fal-ai/nano-banana-pro',{method:'POST',headers:H,
    body:JSON.stringify({prompt,aspect_ratio:'16:9',num_images:1})});
  const j=await r.json(); const u=j?.images?.[0]?.url||j?.image?.url;
  if(!u){console.log(NAME,'IMAGE FAIL',file,JSON.stringify(j).slice(0,200));process.exit(1);}
  const buf=Buffer.from(await(await fetch(u)).arrayBuffer());
  fs.mkdirSync(OUT+'/assets',{recursive:true}); fs.writeFileSync(OUT+'/assets/'+file,buf);
  console.log(NAME,file,'ok',u.slice(0,54)); return u;
}
async function i2v(a,b){
  const ID='fal-ai/bytedance/seedance/v1/pro/image-to-video';
  const body={prompt:VID,image_url:a,end_image_url:b,resolution:'1080p',duration:'5'};
  const r=await fetch('https://queue.fal.run/'+ID,{method:'POST',headers:H,body:JSON.stringify(body)});
  if(!r.ok){console.log(NAME,'submit',r.status,(await r.text()).slice(0,160));return false;}
  const j=await r.json(); const st=j.status_url, rp=j.response_url;
  for(let i=0;i<160;i++){await sleep(5000);const s=await(await fetch(st,{headers:H})).json();
    if(i%4===0)console.log(NAME,i,s.status);
    if(s.status==='COMPLETED'){const res=await(await fetch(rp,{headers:H})).json();
      let v=res.video?.url; if(!v)JSON.stringify(res,(k,x)=>{if(!v&&typeof x==='string'&&/\.mp4/.test(x))v=x;return x;});
      const buf=Buffer.from(await(await fetch(v)).arrayBuffer());
      fs.writeFileSync(OUT+'/assets/hero.mp4',buf);
      console.log(NAME,'VIDEO SAVED',(buf.length/1e6).toFixed(2)+'MB');return true;}
    if(s.status==='FAILED'){console.log(NAME,'video FAILED');return false;}}
  return false;
}
const run=async()=>{ const a=await image(IMG_A,'start.jpg'); const b=await image(IMG_B,'end.jpg'); await i2v(a,b); };
run().catch(e=>{console.error(NAME,e);process.exit(1);});
