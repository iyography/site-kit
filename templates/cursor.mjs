// Style C — cursor-spotlight. A darkened still sits over a lit video; the cursor
// reveals the video through a soft circular mask. Second stop = standard scrub.
import { writeFileSync, mkdirSync } from 'fs';

const SITES = [
  { slug:'lumen', wm:'LUMEN', concept:'Lighting',
    font:'Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;1,9..144,300&family=Hanken+Grotesk:wght@300;400;500',
    disp:"'Fraunces',serif", sans:"'Hanken Grotesk',sans-serif", dispW:300, italic:true,
    bg:'oklch(0.15 0.014 60)', ink:'oklch(0.93 0.014 75)', muted:'oklch(0.62 0.02 65)', accent:'oklch(0.78 0.12 75)',
    eye:'The Halo · Hand-Blown Opal', lede:'A lamp that is nothing in the dark and everything once it is lit. Move your cursor across it to bring it up.',
    hint:'Move to light it',
    thesis:'Good light does not fill a room. It <em>chooses</em> what you see.',
    lab:'The light',
    f1:{k:'The glass',h:'Hand-blown<br>opal, not plastic',p:'Each shade is mouth-blown opal glass, so the light is diffused by the material itself, never a printed film. <b>No hotspot, no glare.</b>'},
    f2:{k:'The warmth',h:'Candlelight,<br>on a dial',p:'Dimmable from a low candle-warm glow to a clear reading light, the colour warming as it dims. <b>It sets the hour, not just the brightness.</b>'},
    band:'In daylight it is a sculpture. After dark it is the reason you stay in.',
    cap3:{k:'The glow',h:'Closer, the light<br>lives in the <em>glass.</em>'},
    rows:[{n:'Light',h:'Warm-dim, 1800–2700K',p:'A bespoke LED that warms as it dims, the way a flame does, with no flicker on camera or eye.'},{n:'Make',h:'Blown, then assembled',p:'Glass blown in Murano, brass spun in-house, assembled and tested by hand.'},{n:'Service',h:'Re-glassed for life',p:'Break the shade in ten years and we blow you another. The base is meant to stay.'}],
    reserve:{k:'Hand-blown · warm-dim · for life',h:'Light the room.',cta:'Reserve — $640'} },

  { slug:'apex', wm:'APEX', concept:'Electric Hypercar',
    font:'Space+Grotesk:wght@300;400;500;600;700&family=Hanken+Grotesk:wght@300;400;500',
    disp:"'Space Grotesk',sans-serif", sans:"'Hanken Grotesk',sans-serif", dispW:500, italic:false,
    bg:'oklch(0.14 0.012 250)', ink:'oklch(0.95 0.01 240)', muted:'oklch(0.6 0.016 245)', accent:'oklch(0.74 0.14 230)',
    eye:'The One · 1,800 hp · Limited 99', lede:'It hides in the dark on purpose. Move your cursor across the body to throw light over it.',
    hint:'Move to sweep the light',
    thesis:'You do not see the whole car at once. You discover it, <em>panel by panel.</em>',
    lab:'The machine',
    f1:{k:'The body',h:'One piece<br>of carbon',p:'A single carbon monocoque tub, the body bonded as one shell with no panel gaps to break the line. <b>1,180 kilograms, dry.</b>'},
    f2:{k:'The drive',h:'Three motors,<br>1,800 hp',p:'Torque-vectored across three motors that read the road a thousand times a second. <b>Zero to a hundred in 1.9.</b>'},
    band:'Sculpted in the dark, revealed by the light that hits it.',
    cap3:{k:'The wheel',h:'Closer, the<br>carbon and the <em>brake.</em>'},
    rows:[{n:'Power',h:'1,800 hp, tri-motor',p:'All-wheel torque vectoring with a 0–100 of 1.9 seconds and a 350 km/h ceiling.'},{n:'Body',h:'Carbon monocoque',p:'A bonded single-shell tub, 1,180 kg dry, built like a Le Mans prototype for the road.'},{n:'Build',h:'99 cars, then closed',p:'Ninety-nine examples, each specified with its owner, then the mould is destroyed.'}],
    reserve:{k:'Limited 99 · specified to order',h:'Find it in the dark.',cta:'Reserve — on application'} },
];

export const page = (s) => `<!DOCTYPE html><html lang="en"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${s.wm} — ${s.concept}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=${s.font}&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../_shared/premium2.css">
<style>
  :root{--bg:${s.bg};--ink:${s.ink};--muted:${s.muted};--accent:${s.accent};--hair:color-mix(in oklch,var(--ink) 12%,transparent);--disp:${s.disp};--sans:${s.sans}}
  body{background:var(--bg);color:var(--ink);font-family:var(--sans);font-weight:300;-webkit-font-smoothing:antialiased;line-height:1.62;overflow-x:hidden}
  a{color:inherit;text-decoration:none}::selection{background:var(--accent);color:var(--bg)}
  .wrap{max-width:1180px;margin:0 auto;padding:0 clamp(20px,4vw,56px)}
  nav{position:fixed;inset:0 0 auto 0;z-index:60;display:flex;justify-content:space-between;align-items:center;padding:24px clamp(20px,4vw,56px);transition:.4s;border-bottom:1px solid transparent}
  nav.solid{background:color-mix(in oklch,var(--bg) 82%,transparent);backdrop-filter:blur(14px);border-color:var(--hair);padding:14px clamp(20px,4vw,56px)}
  .wm{font-family:var(--disp);font-weight:${s.italic?400:600};font-size:21px;letter-spacing:.34em;padding-left:.34em}
  .nl{display:flex;gap:32px;font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:var(--muted)}.nl a:hover{color:var(--ink)}
  .ncta{font-family:var(--disp);${s.italic?'font-style:italic;':'font-weight:500;text-transform:uppercase;letter-spacing:.1em;'}font-size:${s.italic?'16px':'12px'};color:var(--accent)}
  .chero{height:100vh;position:relative;overflow:hidden}
  .chero .cbg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
  .chero .cveil{position:absolute;inset:0;background:var(--still) center/cover no-repeat;
    -webkit-mask:radial-gradient(circle var(--r) at var(--mx) var(--my), transparent 0, transparent calc(var(--r) - 70px), #000 var(--r));
    mask:radial-gradient(circle var(--r) at var(--mx) var(--my), transparent 0, transparent calc(var(--r) - 70px), #000 var(--r))}
  .chero .hud{position:absolute;inset:0;z-index:5;pointer-events:none}
  .chero .hwm{position:absolute;left:50%;top:46%;transform:translate(-50%,-50%);text-align:center;width:92%}
  .chero .eye{font-size:12px;letter-spacing:.32em;text-transform:uppercase;color:var(--accent);margin-bottom:16px}
  .chero h1{font-family:var(--disp);font-weight:${s.dispW};font-size:clamp(64px,13vw,180px);line-height:.94;letter-spacing:${s.italic?'.04em':'-.02em'}}
  .chero .hint{position:absolute;left:50%;bottom:34px;transform:translateX(-50%);font-size:11px;letter-spacing:.3em;text-transform:uppercase;color:var(--muted);transition:opacity .4s}
  section.blk{position:relative;z-index:6;background:var(--bg)}
  .thesis{padding:clamp(110px,16vh,200px) 0;text-align:center}
  .thesis h2{font-family:var(--disp);font-weight:${s.dispW};font-size:clamp(32px,5.6vw,78px);line-height:1.04;letter-spacing:-.01em;max-width:18ch;margin:0 auto}.thesis em{${s.italic?'font-style:italic;':'font-style:normal;'}color:var(--accent)}
  .lab{font-family:var(--disp);${s.italic?'font-style:italic;':'text-transform:uppercase;letter-spacing:.2em;font-weight:500;'}font-size:${s.italic?'18px':'13px'};color:var(--accent);text-align:center;margin-bottom:54px}
  .feat{display:grid;grid-template-columns:1fr 1fr;gap:clamp(30px,5vw,80px);align-items:center;padding:clamp(40px,7vh,90px) 0}
  .feat.flip .ftext{order:2}
  .feat .k{font-size:11px;letter-spacing:.26em;text-transform:uppercase;color:var(--accent);margin-bottom:14px}
  .feat h3{font-family:var(--disp);font-weight:${s.dispW};font-size:clamp(30px,4.4vw,56px);line-height:1.0;letter-spacing:-.01em}
  .feat p{color:var(--muted);font-size:16.5px;margin-top:18px;max-width:42ch}.feat p b{color:var(--ink);font-weight:400}
  .feat .fimg{aspect-ratio:4/5;border-radius:14px;overflow:hidden}.feat .fimg img{width:100%;height:100%;object-fit:cover;display:block}
  .midband{position:relative;height:88vh;overflow:hidden}
  .midband video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
  .midband::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,color-mix(in oklch,var(--bg) 30%,transparent),transparent 28%,transparent 55%,color-mix(in oklch,var(--bg) 72%,transparent))}
  .midband .mbcap{position:absolute;left:0;right:0;bottom:13%;text-align:center;z-index:2;padding:0 24px}
  .midband .mbcap .k{font-size:11px;font-weight:500;letter-spacing:.3em;text-transform:uppercase;color:var(--accent);margin-bottom:12px;text-shadow:0 2px 22px rgba(0,0,0,.55)}
  .midband .mbcap h2{font-family:var(--disp);font-weight:${s.dispW};font-size:clamp(28px,4.4vw,58px);line-height:1.02;text-shadow:0 2px 32px rgba(0,0,0,.55)}.midband .mbcap h2 em{${s.italic?'font-style:italic;':'font-style:normal;'}color:var(--accent)}
  .plate{position:relative;height:92vh;overflow:hidden}
  .plate>img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
  .plate::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,transparent 42%,color-mix(in oklch,var(--bg) 66%,transparent))}
  .plate .pq{position:absolute;left:0;right:0;bottom:14%;text-align:center;z-index:2;padding:0 24px}
  .plate .pq p{font-family:var(--disp);${s.italic?'font-style:italic;':''}font-weight:300;font-size:clamp(26px,4vw,52px);color:var(--ink);max-width:22ch;margin:0 auto;text-shadow:0 2px 30px rgba(0,0,0,.55)}
  .stage{height:420vh}
  .hud2{position:absolute;inset:0;z-index:5;pointer-events:none}
  .hcap{position:absolute;left:clamp(20px,5vw,80px);bottom:16%;max-width:30ch;opacity:0;transform:translateY(20px);transition:opacity .7s,transform .7s}
  .hcap.in{opacity:1;transform:none}
  .hcap .k{font-size:11px;letter-spacing:.3em;text-transform:uppercase;color:var(--accent);margin-bottom:12px}
  .hcap h2{font-family:var(--disp);font-weight:${s.dispW};font-size:clamp(28px,4vw,52px);line-height:1.02}.hcap h2 em{${s.italic?'font-style:italic;':'font-style:normal;'}color:var(--accent)}
  .rows{padding:clamp(60px,9vh,120px) 0 clamp(110px,16vh,200px)}
  .row{display:grid;grid-template-columns:0.8fr 1.2fr;gap:30px;align-items:baseline;padding:42px 0;border-top:1px solid var(--hair)}
  .row:last-child{border-bottom:1px solid var(--hair)}
  .row .n{font-size:12px;letter-spacing:.2em;text-transform:uppercase;color:var(--muted)}
  .row h3{font-family:var(--disp);font-weight:${s.dispW};font-size:clamp(28px,4vw,50px);line-height:.98;margin-top:8px}
  .row p{color:var(--muted);font-size:16px;max-width:46ch}.row p b{color:var(--ink);font-weight:400}
  .reserve{padding:clamp(110px,16vh,200px) 0;text-align:center}
  .reserve .k{font-size:12px;letter-spacing:.3em;text-transform:uppercase;color:var(--accent);margin-bottom:16px}
  .reserve h2{font-family:var(--disp);font-weight:${s.dispW};font-size:clamp(44px,8vw,120px);line-height:.94}
  .reserve .cta{display:inline-block;margin-top:34px;font-family:var(--disp);${s.italic?'font-style:italic;':'font-weight:500;text-transform:uppercase;letter-spacing:.06em;'}font-size:${s.italic?'19px':'13px'};color:var(--bg);background:var(--accent);padding:17px 38px;border-radius:999px;transition:.3s}.reserve .cta:hover{filter:brightness(1.07)}
  footer{border-top:1px solid var(--hair);padding:42px 0}
  .fwm{font-family:var(--disp);letter-spacing:.3em}
  @media(max-width:820px){.nl{display:none}.feat{grid-template-columns:1fr;gap:24px}.feat.flip .ftext{order:0}.gallery{grid-template-columns:1fr 1fr}.row{grid-template-columns:1fr;gap:8px}.chero .cveil{--r:140px}}
</style></head><body>

<div class="intro"><div class="ipct">0</div><div class="ibar"></div></div>

<nav id="nav">
  <div class="wm">${s.wm}</div>
  <div class="nl"><a href="#story">${s.lab}</a><a href="#detail">Detail</a><a href="#reserve">Reserve</a></div>
  <a class="ncta" href="#reserve" data-magnetic>${s.reserve.cta.split('—')[0].trim()}</a>
</nav>

<!-- CURSOR-SPOTLIGHT HERO -->
<section class="chero" id="chero" style="--still:url(assets/still.jpg);--r:200px;--mx:50%;--my:42%">
  <video class="cbg" autoplay muted loop playsinline src="assets/hero.mp4"></video>
  <div class="cveil" id="cveil"></div>
  <div class="hud">
    <div class="hwm"><div class="eye">${s.eye}</div><h1>${s.wm}</h1></div>
    <div class="hint" id="hint">${s.hint}</div>
  </div>
</section>

<section class="blk thesis" data-reveal><div class="wrap"><h2>${s.thesis}</h2></div></section>

<!-- feature 1 (image 1) -->
<section class="blk" id="story"><div class="wrap" style="padding-bottom:clamp(20px,4vh,50px)">
  <div class="lab" data-reveal>${s.lab}</div>
  <div class="feat" data-reveal>
    <div class="ftext"><div class="k">${s.f1.k}</div><h3>${s.f1.h}</h3><p>${s.f1.p}</p></div>
    <div class="fimg"><img src="assets/g1.jpg" alt=""></div>
  </div>
</div></section>

<!-- MIDDLE VIDEO BAND (video 2 — different from the hero reveal) -->
<section class="blk midband" id="detail">
  <video autoplay muted loop playsinline src="assets/sec/hero.mp4"></video>
  <div class="mbcap" data-reveal><div class="k">${s.cap3.k}</div><h2>${s.cap3.h}</h2></div>
</section>

<!-- feature 2 (image 2) -->
<section class="blk"><div class="wrap" style="padding-top:clamp(20px,4vh,50px)">
  <div class="feat flip" data-reveal>
    <div class="ftext"><div class="k">${s.f2.k}</div><h3>${s.f2.h}</h3><p>${s.f2.p}</p></div>
    <div class="fimg"><img src="assets/g2.jpg" alt=""></div>
  </div>
</div></section>

<!-- IMAGE PLATE (image 3) -->
<section class="blk plate" data-reveal>
  <img src="assets/g3.jpg" alt="">
  <div class="pq"><p>${s.band}</p></div>
</section>

<section class="blk rows"><div class="wrap">
  ${s.rows.map(r=>`<div class="row" data-reveal><div class="n">${r.n}</div><div><h3>${r.h}</h3><p>${r.p}</p></div></div>`).join('\n  ')}
</div></section>

<section class="blk reserve" id="reserve" data-reveal>
  <div class="wrap"><div class="k">${s.reserve.k}</div><h2>${s.reserve.h}</h2><a class="cta" href="#" data-magnetic>${s.reserve.cta}</a></div>
</section>

<footer class="blk"><div class="wrap" style="display:flex;justify-content:space-between;width:100%;flex-wrap:wrap;gap:14px">
  <span class="fwm">${s.wm}</span><span style="font-size:12px;color:var(--muted)">Created by Claude Code Club · claudecodeclub.ai</span>
</div></footer>

<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
<script src="https://unpkg.com/lenis@1.1.14/dist/lenis.min.js"></script>
<script src="https://unpkg.com/split-type@0.3.4/umd/index.min.js"></script>
<script src="../_shared/premium2.js"></script>
<script>
  const chero=document.getElementById('chero'),hint=document.getElementById('hint');
  let tx=50,ty=42,cx=50,cy=42;
  chero.addEventListener('pointermove',e=>{const r=chero.getBoundingClientRect();tx=((e.clientX-r.left)/r.width)*100;ty=((e.clientY-r.top)/r.height)*100;hint.style.opacity=0;},{passive:true});
  chero.addEventListener('pointerleave',()=>{tx=50;ty=42;});
  (function loop(){cx+=(tx-cx)*0.12;cy+=(ty-cy)*0.12;chero.style.setProperty('--mx',cx.toFixed(2)+'%');chero.style.setProperty('--my',cy.toFixed(2)+'%');requestAnimationFrame(loop);})();
  addEventListener('scroll',()=>document.getElementById('nav').classList.toggle('solid',scrollY>60),{passive:true});
</script>
</body></html>`;

if (import.meta.url === `file://${process.argv[1]}`) for (const s of SITES) {
  mkdirSync(`/tmp/ccc-sites/${s.slug}`, { recursive: true });
  writeFileSync(`/tmp/ccc-sites/${s.slug}/index.html`, page(s));
  console.log(`wrote ${s.slug}`);
}
