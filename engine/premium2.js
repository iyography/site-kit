/* premium2.js — shared interaction layer. Requires (loaded before this):
   GSAP, ScrollTrigger, Lenis, SplitType. Exposes window.__lenis.
   Behaviors: intro loader, custom cursor, grain, scroll-progress, Lenis smooth scroll,
   [data-reveal] staggered reveals, [data-split] line reveals, [data-magnetic] buttons.
   Scrub stages are wired by each page (see CCC.scrub). */
(function(){
  const D=document, root=D.documentElement;
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- inject grain + cursor + progress ----
  function el(c){const e=D.createElement('div');e.className=c;return e;}
  if(!D.querySelector('.grain'))D.body.appendChild(el('grain'));
  if(!D.querySelector('.grade'))D.body.appendChild(el('grade'));   // cinematic color-grade / vignette
  const prog=el('sprog');D.body.appendChild(prog);
  let cur,curR;
  if(matchMedia('(hover:hover)').matches){
    cur=el('cur');curR=el('cur-r');D.body.append(cur,curR);
    let mx=innerWidth/2,my=innerHeight/2,rx=mx,ry=my;
    addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;cur.style.transform=`translate(${mx}px,${my}px)`;},{passive:true});
    (function ring(){rx+=(mx-rx)*.18;ry+=(my-ry)*.18;curR.style.transform=`translate(${rx}px,${ry}px)`;requestAnimationFrame(ring);})();
    const hot='a,button,[data-magnetic],[data-hot]';
    D.addEventListener('mouseover',e=>{if(e.target.closest(hot))curR.classList.add('hot');});
    D.addEventListener('mouseout',e=>{if(e.target.closest(hot))curR.classList.remove('hot');});
  }

  // ---- intro loader ----
  const intro=D.querySelector('.intro');
  function finishIntro(){if(!intro)return;intro.classList.add('gone');setTimeout(()=>intro.remove(),950);}
  if(intro){
    const pct=intro.querySelector('.ipct'), bar=intro.querySelector('.ibar');
    let p=0;const t=setInterval(()=>{p+=Math.random()*16+6;if(p>=100){p=100;clearInterval(t);setTimeout(finishIntro,260);}
      if(pct)pct.textContent=Math.floor(p);if(bar)bar.style.width=p+'%';},120);
  }

  // ---- Lenis smooth scroll + GSAP ScrollTrigger sync ----
  let lenis=null;
  if(window.Lenis && !reduce){
    lenis=new Lenis({lerp:.09,wheelMultiplier:1,smoothWheel:true});
    window.__lenis=lenis;
    if(window.gsap && window.ScrollTrigger){
      gsap.registerPlugin(ScrollTrigger);
      lenis.on('scroll',ScrollTrigger.update);
      gsap.ticker.add(t=>lenis.raf(t*1000));gsap.ticker.lagSmoothing(0);
    }else{requestAnimationFrame(function r(t){lenis.raf(t);requestAnimationFrame(r);});}
  } else if(window.gsap && window.ScrollTrigger){gsap.registerPlugin(ScrollTrigger);}

  // ---- scroll progress ----
  addEventListener('scroll',()=>{const h=D.documentElement.scrollHeight-innerHeight;prog.style.width=(h>0?scrollY/h*100:0)+'%';},{passive:true});

  // ---- SplitType line reveals for [data-split] (auto-applied to big headings) ----
  if(window.SplitType && !reduce){
    ['.thesis h2','.feat h3','.reserve h2','.midband .mbcap h2','.plate .pq p','.rows .row h3']
      .forEach(sel=>D.querySelectorAll(sel).forEach(h=>{if(!h.hasAttribute('data-split'))h.setAttribute('data-split','');}));
    D.querySelectorAll('[data-split]').forEach(node=>{
      const s=new SplitType(node,{types:'lines',lineClass:'split-line'});
      s.lines.forEach(l=>{const span=D.createElement('span');while(l.firstChild)span.appendChild(l.firstChild);l.appendChild(span);});
    });
  }

  // ---- reveal observer (reveals + split lines) ----
  const io=new IntersectionObserver((es)=>{es.forEach(e=>{if(e.isIntersecting){
    const t=e.target;
    if(t.hasAttribute('data-split')){const lines=[...t.querySelectorAll('.split-line')];lines.forEach((l,i)=>setTimeout(()=>l.classList.add('in'),i*90));}
    else{t.classList.add('in');}
    io.unobserve(t);
  }});},{rootMargin:'0px 0px -12% 0px',threshold:.15});
  D.querySelectorAll('[data-reveal],[data-split]').forEach(n=>io.observe(n));

  // ---- magnetic buttons ----
  if(matchMedia('(hover:hover)').matches && !reduce){
    D.querySelectorAll('[data-magnetic]').forEach(b=>{
      b.addEventListener('mousemove',e=>{const r=b.getBoundingClientRect();const x=e.clientX-r.left-r.width/2,y=e.clientY-r.top-r.height/2;b.style.transform=`translate(${x*.3}px,${y*.3}px)`;});
      b.addEventListener('mouseleave',()=>{b.style.transform='';});
    });
  }

  // ---- animated footer FX: aurora glow + drifting dots in the accent color ----
  D.querySelectorAll('footer').forEach(f=>{
    if(f.querySelector('.footfx'))return;
    const fx=el('footfx'); fx.appendChild(el('aurora'));
    for(let i=0;i<20;i++){const d=el('dot');d.style.left=(4+Math.random()*92)+'%';
      d.style.animationDuration=(6+Math.random()*7).toFixed(1)+'s';
      d.style.animationDelay=(-Math.random()*9).toFixed(1)+'s';fx.appendChild(d);}
    f.insertBefore(fx,f.firstChild);
  });

  // ---- scrub engine: CCC.scrub(stageEl, framesPath, opts) ----
  window.CCC=window.CCC||{};
  window.CCC.scrub=function(stage, framesPath, opts){
    opts=opts||{};
    const canvas=stage.querySelector('canvas'), ctx=canvas.getContext('2d');
    // LIVING SCRUB: scroll sets a target frame; a rAF loop eases the drawn frame
    // toward it (buttery), and when idle the hero keeps drifting so it never freezes.
    let frames=[],N=0,iw=1280,ih=720,cur=0,target=0,curP=0,ready=false,lastScroll=-9999;
    const live=opts.live!==false, amp=opts.amp||3.2;
    function resize(){const dpr=Math.min(devicePixelRatio||1,2);canvas.width=innerWidth*dpr;canvas.height=innerHeight*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);draw(cur);}
    function draw(i){const img=frames[Math.max(0,Math.min(N-1,Math.round(i)))];if(img&&img.complete){const cw=innerWidth,ch=innerHeight,s=Math.max(cw/iw,ch/ih),w=iw*s,h=ih*s;ctx.clearRect(0,0,cw,ch);ctx.drawImage(img,(cw-w)/2,(ch-h)/2,w,h);}}
    function pAt(){const top=stage.offsetTop,hh=stage.offsetHeight-innerHeight;return Math.max(0,Math.min(1,(scrollY-top)/hh));}
    function onScroll(){curP=pAt();target=curP*(N-1);lastScroll=performance.now();if(opts.onProgress)opts.onProgress(curP);}
    function tick(t){if(ready){let aim=target;if(live&&t-lastScroll>140){aim=target+amp+Math.sin(t/1500)*amp;}cur+=(aim-cur)*0.1;draw(cur);}requestAnimationFrame(tick);}
    addEventListener('resize',resize);addEventListener('scroll',onScroll,{passive:true});
    requestAnimationFrame(tick);
    fetch(framesPath+'/manifest.json').then(r=>r.json()).then(m=>{N=m.count;iw=m.w||1280;ih=m.h||720;
      const ext=m.ext||'jpg';                       // WebP if the manifest says so
      frames=new Array(N); let ld=0;
      // checkpoint-priority order: ends + middle + quarters first (scrubbable fast), then fill
      const order=[], seen=new Set();
      [0,N-1,N>>1,N>>2,(3*N)>>2].forEach(i=>{if(i>=0&&i<N&&!seen.has(i)){seen.add(i);order.push(i);}});
      for(let i=0;i<N;i++)if(!seen.has(i)){seen.add(i);order.push(i);}
      order.forEach(idx=>{const img=new Image();img.onload=()=>{ld++;if(ld>=Math.min(N,5)){ready=true;resize();onScroll();}};img.src=framesPath+'/'+String(idx+1).padStart(4,'0')+'.'+ext;frames[idx]=img;});
    }).catch(()=>{});
    return {refresh:onScroll};
  };
})();
