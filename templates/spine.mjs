// Stamps the shared two-scroll-stop scrub skeleton with hand-authored per-site
// content (palette, fonts, concept, copy). One sibling per abstract video.
import { writeFileSync, mkdirSync } from 'fs';

const SITES = [
  {
    slug:'aurea', wm:'AUREA', concept:'Fragrance',
    font:'Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;1,9..144,300&family=Hanken+Grotesk:wght@300;400;500',
    disp:"'Fraunces',serif", sans:"'Hanken Grotesk',sans-serif", dispW:300, italic:true,
    bg:'oklch(0.16 0.02 60)', ink:'oklch(0.93 0.012 70)', muted:'oklch(0.62 0.02 65)', accent:'oklch(0.78 0.13 80)',
    eye:'Eau de Parfum · Extrait', lede:'A scent bottled from molten light. Warm amber, white flowers, a trail that stays in the room after you leave.',
    cap1:{k:'Poured slow',h:'Bottled from<br>molten <em>light.</em>'}, cap2:{k:'The trail',h:'A scent that<br>pours like <em>gold.</em>'},
    thesis:'The last thing you put on, and the first thing they <em>remember.</em>',
    lab:'The composition',
    f1:{k:'The heart',h:'Amber, resin,<br>and white flowers',p:'A base of labdanum and benzoin under orange blossom and jasmine, aged eight months so the sweetness turns to <b>warmth, not sugar.</b>'},
    f2:{k:'The trail',h:'It stays<br>after you leave',p:'Extrait concentration at twenty-eight percent. <b>Eight hours on skin</b>, a full day on wool, a presence that arrives a step before you do.'},
    band:'Worn close, it reads as skin. Worn bold, it fills a room.',
    cap3:{k:'Macro',h:'Closer, it moves<br>like <em>honey.</em>'},
    rows:[{n:'Format',h:'50ml, refillable',p:'A weighted glass flacon you keep, refilled from a sealed amber vial. The bottle is meant to live on the shelf.'},{n:'Wear',h:'A single drop',p:'One touch at the pulse. Extrait is built to be used sparingly and to last regardless.'},{n:'Origin',h:'Grasse, by hand',p:'Composed and bottled in Grasse in batches of three hundred, each numbered on the base.'}],
    reserve:{k:'Numbered · 300 per batch',h:'Wear the light.',cta:'Reserve — $280'},
  },
  {
    slug:'kore', wm:'KORE', concept:'Fine Jewelry',
    font:'Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=Hanken+Grotesk:wght@300;400;500',
    disp:"'Cormorant Garamond',serif", sans:"'Hanken Grotesk',sans-serif", dispW:300, italic:true,
    bg:'oklch(0.17 0.006 250)', ink:'oklch(0.95 0.008 230)', muted:'oklch(0.64 0.014 240)', accent:'oklch(0.84 0.05 225)',
    eye:'The Solitaire · Lab-Grown', lede:'A single stone, cut to return more light than it takes. Set in recycled platinum, certified, and made to outlast its setting.',
    cap1:{k:'Under pressure',h:'Pressure,<br>made <em>permanent.</em>'}, cap2:{k:'The cut',h:'Light enters,<br>and never <em>leaves.</em>'},
    thesis:'A stone is the only gift that keeps its value while it keeps a <em>memory.</em>',
    lab:'The stone',
    f1:{k:'The cut',h:'Fifty-seven facets,<br>plotted by hand',p:'Each rough is mapped before it is touched, then cut to ideal proportions so it returns the maximum light. <b>Graded triple-excellent</b>, every time.'},
    f2:{k:'The setting',h:'Recycled platinum,<br>built to be worn',p:'A six-prong setting in 950 platinum, hand-finished and rhodium-free. <b>Resized free for life</b>, because a ring should change with the hand.'},
    band:'Held to the window, it throws colour across the room.',
    cap3:{k:'Macro',h:'Inside, it is<br>all <em>fire.</em>'},
    rows:[{n:'Origin',h:'Lab-grown, identical',p:'Chemically and optically identical to mined, with a tenth of the footprint and a clear chain of custody.'},{n:'Certificate',h:'IGI graded',p:'Every stone ships with an independent IGI report and is laser-inscribed on the girdle.'},{n:'Service',h:'Kept, not replaced',p:'Lifetime cleaning, resizing, and re-setting. The stone is meant to be inherited.'}],
    reserve:{k:'Certified · inscribed · for life',h:'Keep the light.',cta:'Reserve — from $2,400'},
  },
  {
    slug:'boreal', wm:'BØREAL', concept:'Sleep & Recovery',
    font:'Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;1,9..144,300&family=Hanken+Grotesk:wght@300;400;500',
    disp:"'Fraunces',serif", sans:"'Hanken Grotesk',sans-serif", dispW:300, italic:true,
    bg:'oklch(0.15 0.03 250)', ink:'oklch(0.93 0.015 230)', muted:'oklch(0.62 0.025 235)', accent:'oklch(0.78 0.12 165)',
    eye:'Sleep System · Night Protocol', lede:'A magnesium and glycine protocol that works with your night, not against it. No grogginess, no dependence, just deeper rest.',
    cap1:{k:'After dark',h:'Rest,<br>engineered by <em>night.</em>'}, cap2:{k:'Down-shift',h:'The calm<br>of a northern <em>sky.</em>'},
    thesis:'You do not need more hours. You need the ones you have to go <em>deeper.</em>',
    lab:'The protocol',
    f1:{k:'The formula',h:'Magnesium glycinate,<br>not melatonin',p:'Glycine and magnesium lower core temperature and quiet the nervous system, so you fall into deep sleep faster. <b>No hangover, no habit.</b>'},
    f2:{k:'The rhythm',h:'Timed to<br>your wind-down',p:'Taken forty minutes before bed, it follows your natural melatonin curve instead of overriding it. <b>You wake on your own.</b>'},
    band:'Measured in mornings, not milligrams.',
    cap3:{k:'Macro',h:'Calm, the way<br>cold air is <em>clean.</em>'},
    rows:[{n:'Form',h:'Dissolvable, unsweetened',p:'A clean powder in warm water. No sugar, no synthetic dye, nothing that wakes the gut at 3am.'},{n:'Evidence',h:'Dosed to the studies',p:'Every active is dosed at the clinical amount the research actually used, printed on the tin.'},{n:'Cadence',h:'Thirty nights',p:'A month per tin. Skip a night freely, it does not build a dependence to skip.'}],
    reserve:{k:'Clinically dosed · habit-free',h:'Sleep deeper.',cta:'Start — $54 / month'},
  },
  {
    slug:'soie', wm:'SOIE', concept:'Silk Atelier',
    font:'Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=Hanken+Grotesk:wght@300;400;500',
    disp:"'Cormorant Garamond',serif", sans:"'Hanken Grotesk',sans-serif", dispW:300, italic:true,
    bg:'oklch(0.18 0.022 350)', ink:'oklch(0.94 0.012 350)', muted:'oklch(0.66 0.02 350)', accent:'oklch(0.8 0.07 20)',
    eye:'Mulberry Silk · 22 Momme', lede:'A single weight of mulberry silk, cut into the few things worth owning. Heavy enough to fall, fine enough to forget.',
    cap1:{k:'On the bias',h:'Spun from<br>a single <em>thread.</em>'}, cap2:{k:'Against skin',h:'Weightless,<br>against the <em>skin.</em>'},
    thesis:'Luxury is not the logo. It is the way a thing <em>moves.</em>',
    lab:'The cloth',
    f1:{k:'The weave',h:'Twenty-two momme,<br>charmeuse',p:'A dense mulberry charmeuse with a liquid drape, woven for weight so it falls instead of floats. <b>Cool in heat, warm in cold.</b>'},
    f2:{k:'The cut',h:'On the bias,<br>by one tailor',p:'Cut on the bias so it follows the body without clinging, finished with French seams. <b>One maker, start to finish.</b>'},
    band:'It keeps the shape of whoever wears it.',
    cap3:{k:'Macro',h:'Up close, it<br>catches the <em>light.</em>'},
    rows:[{n:'Care',h:'Hand-wash, hang',p:'Cool water, a drop of silk soap, dried flat in shade. It softens with every wash instead of wearing out.'},{n:'Range',h:'Six pieces, no more',p:'A slip, a shirt, a scarf, three more. A small permanent collection, never a seasonal drop.'},{n:'Made',h:'Como, in small runs',p:'Woven and sewn in Como in runs of fifty, so the maker can still see every seam.'}],
    reserve:{k:'Fifty per run · numbered',h:'Wear the weight.',cta:'Reserve — from $190'},
  },
  {
    slug:'forge', wm:'FORGE', concept:'Forged Cookware',
    font:'Space+Grotesk:wght@300;400;500;600;700&family=Hanken+Grotesk:wght@300;400;500',
    disp:"'Space Grotesk',sans-serif", sans:"'Hanken Grotesk',sans-serif", dispW:500, italic:false,
    bg:'oklch(0.15 0.02 40)', ink:'oklch(0.94 0.014 60)', muted:'oklch(0.62 0.02 50)', accent:'oklch(0.68 0.17 45)',
    eye:'The Pan · Forged Carbon Steel', lede:'One pan, forged from a single sheet of carbon steel, that gets better the more you use it. Made to be the last one you buy.',
    cap1:{k:'At the core',h:'Forged<br>at the <em>core.</em>'}, cap2:{k:'Tempered',h:'Heat,<br>given a <em>shape.</em>'},
    thesis:'A good pan is not bought finished. It is <em>earned.</em>',
    lab:'The build',
    f1:{k:'The steel',h:'One sheet,<br>no coating to fail',p:'Forged from a single piece of 2.5mm carbon steel, no rivets, no non-stick to scratch off. <b>It seasons into its own surface.</b>'},
    f2:{k:'The heat',h:'Oven, flame,<br>or open fire',p:'Handles 600 degrees and any heat source, induction to coals. <b>Sears like cast iron, moves like a chef pan.</b>'},
    band:'Season it once. Cook on it for forty years.',
    cap3:{k:'Macro',h:'The grain runs<br>through the <em>steel.</em>'},
    rows:[{n:'Weight',h:'Balanced, not heavy',p:'Lighter than cast iron, with the balance point at the handle so a full pan still lifts clean.'},{n:'Season',h:'Pre-seasoned once',p:'It ships with a first layer of seasoning. The rest you build, and it only improves.'},{n:'Origin',h:'Forged in Sheffield',p:'Hand-forged in small batches in Sheffield, stamped with the maker and the year.'}],
    reserve:{k:'Hand-forged · stamped',h:'Earn the pan.',cta:'Reserve — $165'},
  },
  {
    slug:'aeon', wm:'ÆON', concept:'Applied Intelligence',
    font:'Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;1,9..144,300&family=Hanken+Grotesk:wght@300;400;500',
    disp:"'Fraunces',serif", sans:"'Hanken Grotesk',sans-serif", dispW:300, italic:true,
    bg:'oklch(0.14 0.03 290)', ink:'oklch(0.93 0.015 280)', muted:'oklch(0.63 0.025 285)', accent:'oklch(0.74 0.15 300)',
    eye:'Research Intelligence · Private Beta', lede:'A reasoning engine that reads your whole field, holds it in one place, and answers like the smartest person you know had a week to think.',
    cap1:{k:'No edges',h:'Intelligence,<br>without <em>edges.</em>'}, cap2:{k:'Aware',h:'Vast,<br>and quietly <em>aware.</em>'},
    thesis:'The answer was always in the data. You just needed something that could <em>hold it all.</em>',
    lab:'The engine',
    f1:{k:'The context',h:'Your whole field,<br>in one window',p:'It ingests every paper, thread, and dataset you point it at and reasons across all of it at once. <b>Nothing falls out of memory.</b>'},
    f2:{k:'The reasoning',h:'It shows<br>its work',p:'Every claim links to its source and the chain that produced it. <b>You can audit the thought</b>, not just trust the output.'},
    band:'It does not search. It understands.',
    cap3:{k:'Macro',h:'Closer, the<br>structure <em>emerges.</em>'},
    rows:[{n:'Scope',h:'A million tokens, live',p:'Hold an entire literature in context and query it conversationally, with citations that resolve to the line.'},{n:'Privacy',h:'Your data stays yours',p:'Zero retention, private inference, nothing trained on your corpus. The model forgets when you do.'},{n:'Access',h:'Invite only',p:'Rolling out to research teams in small cohorts. Each gets a dedicated context and a human in the loop.'}],
    reserve:{k:'Private beta · zero retention',h:'Think bigger.',cta:'Request access'},
  },
  {
    slug:'dram', wm:'DRAM', concept:'Single Malt',
    font:'Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;1,9..144,300&family=Hanken+Grotesk:wght@300;400;500',
    disp:"'Fraunces',serif", sans:"'Hanken Grotesk',sans-serif", dispW:300, italic:true,
    bg:'oklch(0.16 0.018 50)', ink:'oklch(0.93 0.014 60)', muted:'oklch(0.62 0.02 55)', accent:'oklch(0.66 0.13 65)',
    eye:'Single Malt · Cask Strength', lede:'Eighteen years in a single sherry cask, bottled without water or colour. Two hundred and forty bottles, then it is gone.',
    cap1:{k:'In the dark',h:'Aged<br>in the <em>dark.</em>'}, cap2:{k:'Slowly',h:'Poured<br>once, <em>slowly.</em>'},
    thesis:'Time is the only ingredient you cannot <em>fake.</em>',
    lab:'The cask',
    f1:{k:'The wood',h:'One sherry cask,<br>eighteen years',p:'A single first-fill oloroso butt, untouched in a dunnage warehouse since the year it was filled. <b>One cask, one character.</b>'},
    f2:{k:'The pour',h:'Cask strength,<br>uncoloured',p:'Bottled at 57.2 percent with no chill-filtering and no caramel. <b>What was in the cask is what is in the glass.</b>'},
    band:'It tastes of the dark room it waited in.',
    cap3:{k:'Macro',h:'Held up, it<br>holds the <em>amber.</em>'},
    rows:[{n:'Outturn',h:'240 bottles',p:'One cask yields what it yields. When the last is poured, the expression is retired for good.'},{n:'Notes',h:'Fig, leather, clove',p:'Dried fig and date over old leather, with a long clove-and-oak finish that holds for minutes.'},{n:'Origin',h:'Speyside, distilled 2007',p:'Distilled and matured on Speyside, hand-numbered and signed by the warehouse keeper.'}],
    reserve:{k:'240 bottles · then retired',h:'Pour slowly.',cta:'Reserve — $420'},
  },
  {
    slug:'sumi', wm:'SUMI', concept:'Design Studio',
    font:'Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;1,6..72,300&family=Hanken+Grotesk:wght@300;400;500',
    disp:"'Newsreader',serif", sans:"'Hanken Grotesk',sans-serif", dispW:300, italic:true,
    bg:'oklch(0.16 0.004 270)', ink:'oklch(0.94 0.004 270)', muted:'oklch(0.62 0.008 270)', accent:'oklch(0.6 0.12 265)',
    eye:'Brand & Motion · est. 2019', lede:'A small studio that makes one thing per client, slowly. Identity, motion, and the single image people remember.',
    cap1:{k:'One stroke',h:'A single<br><em>stroke.</em>'}, cap2:{k:'Bleed',h:'Where ink<br>meets <em>water.</em>'},
    thesis:'Most work fills the space. The work people keep <em>leaves some.</em>',
    lab:'The practice',
    f1:{k:'The method',h:'One idea,<br>carried all the way',p:'We do not present forty options. We find the one true idea and build everything around it until it is undeniable. <b>Conviction over coverage.</b>'},
    f2:{k:'The motion',h:'It moves,<br>or it does not ship',p:'Every identity we make is designed in motion from day one, never a static logo animated later. <b>The movement is the mark.</b>'},
    band:'We make less, and we make it matter.',
    cap3:{k:'Macro',h:'The edge is<br>where it <em>lives.</em>'},
    rows:[{n:'Scope',h:'Six clients a year',p:'We take six engagements a year so each one gets a principal, not a pod. You work with the people who make the work.'},{n:'Output',h:'Identity in motion',p:'Wordmark, system, motion language, and the hero asset that anchors the launch.'},{n:'Studio',h:'Lisbon & remote',p:'A studio of four in Lisbon, working with founders who would rather be remembered than safe.'}],
    reserve:{k:'Six engagements a year',h:'Make it matter.',cta:'Start a project'},
  },
  {
    slug:'orkide', wm:'ORKIDÉ', concept:'Botanical Skincare',
    font:'Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;1,9..144,300&family=Hanken+Grotesk:wght@300;400;500',
    disp:"'Fraunces',serif", sans:"'Hanken Grotesk',sans-serif", dispW:300, italic:true,
    bg:'oklch(0.18 0.03 330)', ink:'oklch(0.94 0.012 330)', muted:'oklch(0.65 0.02 330)', accent:'oklch(0.74 0.12 335)',
    eye:'Night Serum · Orchid Ferment', lede:'A serum built on fermented orchid extract that does its work while you sleep. Slow skincare, for skin that took years to earn.',
    cap1:{k:'In shadow',h:'Grown<br>in <em>shadow.</em>'}, cap2:{k:'Unhurried',h:'A bloom<br>that takes its <em>time.</em>'},
    thesis:'Skin does not respond to force. It responds to <em>patience.</em>',
    lab:'The serum',
    f1:{k:'The active',h:'Fermented orchid,<br>not extracted',p:'The orchid is fermented rather than pressed, which breaks its molecules small enough to absorb. <b>More of the plant, deeper in.</b>'},
    f2:{k:'The night',h:'It works<br>while you rest',p:'Layered last before sleep, it supports overnight repair when skin is most permeable. <b>You see it in the morning.</b>'},
    band:'Results you measure in seasons, not days.',
    cap3:{k:'Macro',h:'Closer, the<br>petal <em>unfolds.</em>'},
    rows:[{n:'Formula',h:'Nine actives, no filler',p:'Fermented orchid, niacinamide, peptides, and squalane. No fragrance, no drying alcohol, nothing for show.'},{n:'Texture',h:'Absorbs to nothing',p:'A light oil-serum that sinks in clean and leaves no film, so it layers under anything.'},{n:'Made',h:'Cold-processed, small',p:'Cold-processed in small batches to keep the ferment alive, dated on the base.'}],
    reserve:{k:'Cold-processed · dated',h:'Give it time.',cta:'Reserve — $96'},
  },
  {
    slug:'maree', wm:'MARÉE', concept:'Grand Tourer',
    font:'Space+Grotesk:wght@300;400;500;600;700&family=Hanken+Grotesk:wght@300;400;500',
    disp:"'Space Grotesk',sans-serif", sans:"'Hanken Grotesk',sans-serif", dispW:500, italic:false,
    bg:'oklch(0.17 0.015 240)', ink:'oklch(0.94 0.012 235)', muted:'oklch(0.63 0.018 238)', accent:'oklch(0.8 0.07 230)',
    eye:'The GT · All-Electric', lede:'A grand tourer built for the long coast road. Silent, balanced, and engineered to make four hundred miles feel like an afternoon.',
    cap1:{k:'The long coast',h:'Built<br>for the long <em>coast.</em>'}, cap2:{k:'At speed',h:'Silence,<br>at <em>speed.</em>'},
    thesis:'The point was never how fast. It was how far, in how much <em>peace.</em>',
    lab:'The drive',
    f1:{k:'The range',h:'Four hundred miles,<br>one charge',p:'A 105kWh pack tuned for cruising, not sprinting, with a real-world range that holds at highway speed. <b>Coast to coast in two stops.</b>'},
    f2:{k:'The quiet',h:'Engineered<br>to disappear',p:'Laminated glass, a sealed floor, and active noise cancellation drop the cabin to library-quiet at speed. <b>You hear the road, not the car.</b>'},
    band:'Measured in horizons, not horsepower.',
    cap3:{k:'Macro',h:'The light<br>runs off the <em>steel.</em>'},
    rows:[{n:'Balance',h:'50:50, low and flat',p:'The pack sits in the floor for a low centre of gravity and even weight, so it settles into a corner instead of fighting it.'},{n:'Charge',h:'10 to 80 in 18 min',p:'800-volt architecture adds three hundred miles in under twenty minutes at a fast charger.'},{n:'Built',h:'Hand-assembled',p:'Final assembly by hand in limited numbers, each car specified and numbered to its first owner.'}],
    reserve:{k:'Limited build · numbered',h:'Drive farther.',cta:'Reserve — from $134,000'},
  },
];

export const page = (s) => `<!DOCTYPE html><html lang="en"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${s.wm} — ${s.concept}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=${s.font}&display=swap" rel="stylesheet">
<link rel="stylesheet" href="_shared/premium2.css">
<style>
  :root{--bg:${s.bg};--ink:${s.ink};--muted:${s.muted};--accent:${s.accent};--hair:color-mix(in oklch,var(--ink) 12%,transparent);--disp:${s.disp};--sans:${s.sans}}
  body{background:var(--bg);color:var(--ink);font-family:var(--sans);font-weight:300;-webkit-font-smoothing:antialiased;line-height:1.62;overflow-x:hidden}
  a{color:inherit;text-decoration:none}::selection{background:var(--accent);color:var(--bg)}
  .wrap{max-width:1180px;margin:0 auto;padding:0 clamp(20px,4vw,56px)}
  nav{position:fixed;inset:0 0 auto 0;z-index:60;display:flex;justify-content:space-between;align-items:center;padding:24px clamp(20px,4vw,56px);transition:.4s;border-bottom:1px solid transparent}
  nav.solid{background:color-mix(in oklch,var(--bg) 82%,transparent);backdrop-filter:blur(14px);border-color:var(--hair);padding:14px clamp(20px,4vw,56px)}
  .wm{font-family:var(--disp);font-weight:${s.italic?400:600};font-size:21px;letter-spacing:.34em;padding-left:.34em}
  .nl{display:flex;gap:32px;font-size:12px;font-weight:500;letter-spacing:.16em;text-transform:uppercase;color:color-mix(in oklch,var(--ink) 80%,transparent)}.nl a:hover{color:var(--ink)}
  .ncta{font-family:var(--disp);${s.italic?'font-style:italic;':'font-weight:500;text-transform:uppercase;letter-spacing:.1em;'}font-size:${s.italic?'16px':'12px'};color:var(--accent)}
  .stage{height:460vh}
  .vhero{height:100vh;position:relative;overflow:hidden;display:flex;align-items:flex-end}
  .vhero>video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
  .vhero::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,color-mix(in oklch,var(--bg) 30%,transparent) 0%,transparent 28%,transparent 52%,color-mix(in oklch,var(--bg) 82%,transparent) 98%)}
  .vin{position:relative;z-index:2;padding:0 clamp(20px,4vw,56px) clamp(56px,9vh,90px);max-width:1180px;margin:0 auto;width:100%}
  .veye{font-size:13px;font-weight:500;letter-spacing:.32em;text-transform:uppercase;color:var(--accent);margin-bottom:16px;text-shadow:0 2px 20px rgba(0,0,0,.5)}
  .vtitle{font-family:var(--disp);font-weight:${s.dispW};font-size:clamp(64px,13vw,180px);line-height:.92;letter-spacing:${s.italic?'.04em':'-.02em'};text-shadow:0 4px 50px rgba(0,0,0,.5)}
  .vsub{margin-top:16px;max-width:42ch;font-size:17px;color:var(--ink);opacity:.86;text-shadow:0 2px 24px rgba(0,0,0,.5)}
  .vhint{position:absolute;bottom:28px;left:50%;transform:translateX(-50%);z-index:3;font-size:11px;letter-spacing:.3em;text-transform:uppercase;color:var(--ink);opacity:.75}
  .hud{position:absolute;inset:0;z-index:5;pointer-events:none;background:radial-gradient(44% 42% at 50% 43%,color-mix(in oklch,var(--bg) 70%,transparent),transparent 66%),linear-gradient(to top,color-mix(in oklch,var(--bg) 62%,transparent),transparent 34%),linear-gradient(to bottom,color-mix(in oklch,var(--bg) 42%,transparent),transparent 24%)}
  .hwm{position:absolute;left:50%;top:45%;transform:translate(-50%,-50%);text-align:center;width:90%}
  .hwm::before{content:"";position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:78%;height:230%;z-index:-1;background:radial-gradient(closest-side,color-mix(in oklch,var(--bg) 72%,transparent),transparent);filter:blur(26px)}
  .hwm .eye{font-size:13px;font-weight:500;letter-spacing:.32em;text-transform:uppercase;color:var(--accent);margin-bottom:16px;text-shadow:0 2px 24px rgba(0,0,0,.55)}
  .hwm h1{font-family:var(--disp);font-weight:${s.dispW};font-size:clamp(64px,13vw,180px);line-height:.94;letter-spacing:${s.italic?'.04em':'-.02em'};text-shadow:0 4px 50px rgba(0,0,0,.5)}
  .hcap{position:absolute;left:clamp(20px,5vw,80px);bottom:16%;max-width:30ch;opacity:0;transform:translateY(20px);transition:opacity .7s,transform .7s;text-shadow:0 2px 30px rgba(0,0,0,.6)}
  .hcap.in{opacity:1;transform:none}
  .hcap .k{font-size:11px;font-weight:500;letter-spacing:.3em;text-transform:uppercase;color:var(--accent);margin-bottom:12px}
  .hcap h2{font-family:var(--disp);font-weight:${s.dispW};font-size:clamp(28px,4vw,52px);line-height:1.02}.hcap h2 em{${s.italic?'font-style:italic;':'font-style:normal;'}color:var(--accent)}
  .hint{position:absolute;left:50%;bottom:34px;transform:translateX(-50%);font-size:11px;letter-spacing:.3em;text-transform:uppercase;color:var(--ink);opacity:.8;transition:opacity .4s}
  body::before{content:"";position:fixed;inset:-10%;z-index:-1;background:
    radial-gradient(38% 48% at 16% 12%,color-mix(in oklch,var(--accent) 16%,transparent),transparent 60%),
    radial-gradient(44% 54% at 86% 26%,color-mix(in oklch,var(--accent) 11%,transparent),transparent 62%),
    radial-gradient(54% 60% at 50% 104%,color-mix(in oklch,var(--accent) 15%,transparent),transparent 64%),var(--bg);
    animation:meshDrift 24s ease-in-out infinite}
  @keyframes meshDrift{0%,100%{transform:translate3d(0,0,0) scale(1)}50%{transform:translate3d(-2.2%,1.6%,0) scale(1.04)}}
  section.blk{position:relative;z-index:6;background:color-mix(in oklch,var(--bg) 90%,transparent)}
  .stage .pin::after{content:"";position:absolute;left:0;right:0;bottom:0;height:24vh;z-index:4;pointer-events:none;background:linear-gradient(to bottom,transparent,color-mix(in oklch,var(--bg) 90%,transparent))}
  .thesis{padding:clamp(120px,18vh,220px) 0;text-align:center}
  .thesis h2{font-family:var(--disp);font-weight:${s.dispW};font-size:clamp(40px,6.4vw,92px);line-height:1.03;letter-spacing:-.015em;max-width:17ch;margin:0 auto}.thesis em{${s.italic?'font-style:italic;':'font-style:normal;'}color:var(--accent)}
  .lab{font-family:var(--disp);${s.italic?'font-style:italic;':'text-transform:uppercase;letter-spacing:.2em;font-weight:500;'}font-size:${s.italic?'18px':'13px'};color:var(--accent);text-align:center;margin-bottom:54px}
  .feat{display:grid;grid-template-columns:1fr 1fr;gap:clamp(30px,5vw,80px);align-items:center;padding:clamp(40px,7vh,90px) 0}
  .feat.flip .ftext{order:2}
  .feat .k{font-size:11px;letter-spacing:.26em;text-transform:uppercase;color:var(--accent);margin-bottom:14px}
  .feat h3{font-family:var(--disp);font-weight:${s.dispW};font-size:clamp(30px,4.4vw,56px);line-height:1.0;letter-spacing:-.01em}
  .feat p{color:var(--muted);font-size:16.5px;margin-top:18px;max-width:42ch}.feat p b{color:var(--ink);font-weight:400}
  .feat .fimg{aspect-ratio:4/5;border-radius:14px;overflow:hidden}.feat .fimg img{width:100%;height:100%;object-fit:cover;display:block}
  .gallery{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;padding:0 0 clamp(40px,7vh,90px)}
  .gallery .g{aspect-ratio:3/4;border-radius:12px;overflow:hidden}.gallery .g img,.gallery .g video{width:100%;height:100%;object-fit:cover;display:block}
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
  .hstrip{overflow:hidden;height:100vh;display:flex;align-items:center}
  .htrack{display:flex;gap:18px;padding:0 8vw;will-change:transform}
  .hpanel{position:relative;flex:0 0 62vw;max-width:760px;aspect-ratio:16/10;border-radius:14px;overflow:hidden}
  .hpanel img{width:100%;height:100%;object-fit:cover;display:block}
  .hpanel .hp-cap{position:absolute;left:24px;bottom:22px;font-family:var(--disp);font-weight:${s.dispW};font-size:clamp(22px,2.6vw,34px);color:var(--ink);text-shadow:0 2px 30px rgba(0,0,0,.6)}
  footer{border-top:1px solid var(--hair);padding:42px 0}
  .fwm{font-family:var(--disp);letter-spacing:.3em}
  @media(max-width:820px){.nl{display:none}.feat{grid-template-columns:1fr;gap:24px}.feat.flip .ftext{order:0}.gallery{grid-template-columns:1fr 1fr}.row{grid-template-columns:1fr;gap:8px}}
</style></head><body>

<div class="intro"><div class="ipct">0</div><div class="ibar"></div></div>

<nav id="nav">
  <div class="wm">${s.wm}</div>
  <div class="nl"><a href="#story">${s.lab}</a><a href="#detail">Detail</a><a href="#reserve">Reserve</a></div>
  <a class="ncta" href="#reserve" data-magnetic>${s.reserve.cta.split('—')[0].trim()}</a>
</nav>

${s.style==='A' ? `<!-- STYLE A: ambient loop hero (plays continuously, no scrub) -->
<header class="vhero">
  <video autoplay muted loop playsinline poster="assets/still.jpg" src="assets/hero.mp4"></video>
  <div class="vin"><div class="veye">${s.eye}</div><h1 class="vtitle">${s.wm}</h1><p class="vsub">${s.lede}</p></div>
  <div class="vhint">Scroll</div>
</header>` : `<!-- SCROLL HERO (B/E/F/G scrub, D pan) -->
<section class="stage" id="stage">
  <div class="pin">
    <canvas id="hero"></canvas>
    <div class="hud">
      <div class="hwm" id="hwm"><div class="eye">${s.eye}</div><h1>${s.wm}</h1></div>
      <div class="hcap" data-from="0.32" data-to="0.6"><div class="k">${s.cap1.k}</div><h2>${s.cap1.h}</h2></div>
      <div class="hcap" data-from="0.64" data-to="0.96"><div class="k">${s.cap2.k}</div><h2>${s.cap2.h}</h2></div>
      <div class="hint" id="hint">Scroll</div>
    </div>
  </div>
</section>`}

<section class="blk thesis" data-reveal><div class="wrap"><h2>${s.thesis}</h2></div></section>

${s.hstrip ? `<!-- D SITES: the 3 generated images live in the horizontal strip (each once) -->
<section class="blk" id="story"><div class="wrap"><div class="lab" data-reveal>${s.lab}</div></div></section>
<section class="blk hstrip" id="hstrip"><div class="htrack" id="htrack">
  ${[s.f1.h.replace(/<br>/g,' '),s.cap3.h.replace(/<br>/g,' ').replace(/<\/?em>/g,''),s.f2.h.replace(/<br>/g,' ')].map((t,i)=>`<div class="hpanel"><img src="assets/g${i+1}.jpg" alt=""><div class="hp-cap">${t}</div></div>`).join('\n  ')}
</div></section>` : `<!-- feature 1 (image 1) -->
<section class="blk" id="story"><div class="wrap" style="padding-bottom:clamp(20px,4vh,50px)">
  <div class="lab" data-reveal>${s.lab}</div>
  <div class="feat" data-reveal>
    <div class="ftext"><div class="k">${s.f1.k}</div><h3>${s.f1.h}</h3><p>${s.f1.p}</p></div>
    <div class="fimg"><img src="assets/${s.img?'g1':'d1'}.jpg" alt=""></div>
  </div>
</div></section>`}

<!-- MIDDLE VIDEO BAND (video 2 — different from the hero) -->
<section class="blk midband" id="detail">
  <video autoplay muted loop playsinline src="assets/sec/hero.mp4"></video>
  <div class="mbcap" data-reveal><div class="k">${s.cap3.k}</div><h2>${s.cap3.h}</h2></div>
</section>

${s.hstrip ? '' : `<!-- feature 2 (image 2) -->
<section class="blk"><div class="wrap" style="padding-top:clamp(20px,4vh,50px)">
  <div class="feat flip" data-reveal>
    <div class="ftext"><div class="k">${s.f2.k}</div><h3>${s.f2.h}</h3><p>${s.f2.p}</p></div>
    <div class="fimg"><img src="assets/${s.img?'g2':'d2'}.jpg" alt=""></div>
  </div>
</div></section>

<!-- IMAGE PLATE (image 3) -->
<section class="blk plate" data-reveal>
  <img src="assets/g3.jpg" alt="">
  <div class="pq"><p>${s.band}</p></div>
</section>`}

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
<script src="_shared/premium2.js"></script>
<script>
  const stageEl=document.getElementById('stage');
  if(stageEl){
    const hwm=document.getElementById('hwm'),hint=document.getElementById('hint');
    const caps=[...document.querySelectorAll('#stage .hcap')];
    CCC.scrub(stageEl,'assets/frames',{idle:true,amp:${s.amp||3},onProgress:p=>{
      hwm.style.opacity=p<0.18?1:Math.max(0,1-(p-0.18)/0.12);
      hwm.style.transform=\`translate(-50%,calc(-50% - \${p*60}px))\`;
      hint.style.opacity=p>0.04?0:.7;
      caps.forEach(c=>c.classList.toggle('in',p>=+c.dataset.from&&p<=+c.dataset.to));
    }});
  }
  addEventListener('scroll',()=>document.getElementById('nav').classList.toggle('solid',scrollY>60),{passive:true});
  ${s.hstrip ? `if(window.gsap&&window.ScrollTrigger){gsap.registerPlugin(ScrollTrigger);const track=document.getElementById('htrack');const dist=()=>track.scrollWidth-innerWidth+ (innerWidth*0.04);gsap.to(track,{x:()=>-dist(),ease:'none',scrollTrigger:{trigger:'#hstrip',start:'top top',end:()=>'+='+dist(),scrub:true,pin:true,invalidateOnRefresh:true}});}` : ''}
</script>
</body></html>`;

if (import.meta.url === `file://${process.argv[1]}`) {
  for (const s of SITES) {
    s.img = true;
    mkdirSync(`/tmp/ccc-sites/${s.slug}`, { recursive: true });
    writeFileSync(`/tmp/ccc-sites/${s.slug}/index.html`, page(s));
    console.log(`wrote ${s.slug}`);
  }
}
