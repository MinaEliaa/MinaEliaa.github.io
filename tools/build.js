// Build the static site: index.html, 404.html, js, seo files.
const fs = require('fs');
const { minify } = require('html-minifier-terser');
const terser = require('terser');
const SITE = '/home/claude/site';
const SRC = '/home/claude/src';
const SVG = '/home/claude/assets-src/svg';
const M = JSON.parse(fs.readFileSync('/home/claude/tools/img-manifest.json', 'utf8'));
const ORIGIN = 'https://minaeliaa.github.io/';
const MAIL = 'mailto:minaelia.designer@gmail.com';

/* ---------- SVG cleaning (Framer → plain SVG) ---------- */
function resolveVars(str, vars) {
  let prev;
  do {
    prev = str;
    str = str.replace(/var\(--([\w-]+)(?:,\s*((?:[^()]|\([^()]*\))*))?\)/g, (_, n, fb) => vars[n] !== undefined ? vars[n] : (fb || '').trim());
  } while (str !== prev);
  return str;
}
function cleanSvg(file) {
  let s = fs.readFileSync(`${SVG}/${file}`, 'utf8');
  const outerStyle = (s.match(/^<svg[^>]*style="([^"]*)"/) || [])[1] || '';
  const vars = {}; outerStyle.replace(/--([\w-]+):\s*([^;]+)/g, (_, k, v) => { vars[k] = v.trim(); });
  for (const k of Object.keys(vars)) vars[k] = resolveVars(vars[k], vars);
  const inner = s.indexOf('<svg', 1);
  if (inner > 0) s = s.slice(inner, s.lastIndexOf('</svg>'));
  s = resolveVars(s, vars);
  s = s.replace(/\s(class|role|data-framer-name|display|style)="[^"]*"/g, '')
       .replace(/\sid="(?!svg)[^"]*"/g, '')
       .replace(/\s(height|width)="\d+px"/g, '')
       .replace(/stroke-dasharray=""\s?/g, '')
       .replace(/\n\s*/g, '');
  return s;
}
const innerOf = s => { const f = (s.match(/^<svg[^>]*\sfill="([^"]+)"/) || [])[1]; const body = s.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, ''); return f ? `<g fill="${f}">${body}</g>` : body; };
const viewBoxOf = s => (s.match(/viewBox="([^"]+)"/) || [])[1];

const logoSvg = `<svg viewBox="0 0 24 15" aria-hidden="true" focusable="false">${innerOf(fs.readFileSync(`${SVG}/logo.svg`, 'utf8'))}</svg>`;
const checkSvg = (() => { const c = cleanSvg('check.svg'); return `<svg class="chk" viewBox="${viewBoxOf(c)}" aria-hidden="true" focusable="false"><use href="#i-check"/></svg>`; })();
const chevron = cleanSvg('chevron.svg');
const icons = {};
for (const n of ['plan-mobile', 'plan-website', 'linkedin', 'whatsapp', 'behance', 'service-mobile', 'play']) icons[n] = cleanSvg(`${n}.svg`);

// sprite: check icon + 12 tool icons, gradient defs hoisted to the top level
let spriteDefs = '', symbols = '';
{ const c = cleanSvg('check.svg'); symbols += `<symbol id="i-check" viewBox="${viewBoxOf(c)}">${innerOf(c)}</symbol>`; }
for (let i = 1; i <= 12; i++) {
  let c = cleanSvg(`tool${i}.svg`);
  const vb = viewBoxOf(c);
  let body = innerOf(c);
  body = body.replace(/<defs>([\s\S]*?)<\/defs>/g, (_, d) => { spriteDefs += d; return ''; });
  symbols += `<symbol id="t${i}" viewBox="${vb}" preserveAspectRatio="none">${body}</symbol>`;
}
const sprite = `<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>${spriteDefs}</defs>${symbols}</svg>`;
const toolNames = ['Lovable', 'Figma', 'Framer', 'Webflow', 'Linear', 'Notion', 'Illustrator', 'Photoshop', 'Bolt', 'Spline', 'Trello', 'Relume'];
const toolIcon = i => `<svg viewBox="0 0 82 82" preserveAspectRatio="none" width="82" height="80" aria-hidden="true" focusable="false"><use href="#t${i}"/></svg>`;

/* ---------- Picture helper ---------- */
function pic(name, { alt = '', w, h, sizes, eager = false, high = false, cls = '', style = '' }) {
  const m = M[name]; if (!m) throw new Error('no image ' + name);
  const set = ext => m.widths.map(x => `img/${name}-${x}.${ext} ${x}w`).join(', ');
  const sz = sizes || `${w}px`;
  return `<picture><source type="image/avif" srcset="${set('avif')}" sizes="${sz}"><source type="image/webp" srcset="${set('webp')}" sizes="${sz}"><img src="img/${m.fallback}" width="${w}" height="${h}" alt="${alt}"${cls ? ` class="${cls}"` : ''}${style ? ` style="${style}"` : ''} ${eager ? 'loading="eager"' : 'loading="lazy"'} decoding="async"${high ? ' fetchpriority="high"' : ''}></picture>`;
}

/* ---------- Content ---------- */
const subtitle = 'Hi, I’m Mina Elia | Senior UI/UX Designer & AI Product Builder';
const h1Words = ['My', 'Latest', 'Project', 'Always', 'my', 'Best'];
const charSpans = subtitle.split(' ').map(word => `<span class="wrd">${[...word].map(c => `<span class="ch">${c.replace('&', '&amp;')}</span>`).join('')}</span>`).join(' ');

const screens = [
  ['screen-profily', 'Screen for Profily mobile application', ''], ['screen-wish', 'Screen for Wish mobile application', ''],
  ['screen-masroofi', 'Screen for Masroofi mobile application', ''], ['screen-douq', 'Screen for Douq Website', 'wide'],
  ['screen-scouty', 'Screen for Scouty mobile application', ''], ['screen-hozaan', 'Screen for Hozaan mobile application', ''],
  ['screen-dentinnova', 'Screen for Denntinova Website', 'wide2'], ['screen-eyas', 'Screen for Eyas mobile application', ''],
  ['screen-qatar', 'Screen for Qatar-airways mobile application', ''],
];
const screenSet = (dup) => `<div class="set"${dup ? ' aria-hidden="true"' : ''}>${screens.map(([n, alt, cls], i) => {
  const wide = !!cls; const w = wide ? (cls === 'wide' ? 457 : 456) : 218;
  return `<div class="frame${cls ? ' ' + cls : ''}">${pic(n, { alt: dup ? '' : alt, w, h: 470, sizes: `${w}px`, eager: !dup && i < 3, high: !dup && i < 2 })}</div>`;
}).join('')}</div>`;

const words = (s, brAfter = [], extra = {}) => { const a = s.split(' '); return a.map((x, i) => `<span class="w${extra[x] ? ' ' + extra[x] : ''}">${x}</span>` + (i === a.length - 1 ? '' : (brAfter.includes(x) ? '&#32;<br class="m-br">' : ' '))).join(''); };

const svcCards = [
  { t: 'Mobile apps', cls: '', ill: `<div class="ill" style="width:220px;height:125px"><div class="dev" style="left:0;top:0;width:110px;height:125px"><i class="p" style="left:39px;top:11px;width:32px;height:9px"></i><i class="b" style="left:14px;top:30px;width:82px;height:95px"></i></div><div class="dev" style="left:110px;top:5px;width:110px;height:120px"><svg viewBox="0 0 82 75" width="82" height="75" style="position:absolute;left:14px;top:0" aria-hidden="true">${innerOf(icons['service-mobile'])}</svg><i class="p" style="left:44px;top:86px;width:23px;height:23px"></i></div></div>` },
  { t: 'Websites', cls: '', ill: `<div class="ill dev" style="width:220px;height:125px;right:16px"><i class="p" style="left:94px;top:25px;width:33px;height:8px"></i><i class="p" style="left:79px;top:37px;width:62px;height:8px"></i><i class="p" style="left:100px;top:49px;width:20px;height:9px"></i><i class="b" style="left:14px;top:77px;width:192px;height:49px"></i></div>` },
  { t: 'Preview<br>Screenshots', cls: '', ill: `<div class="ill dev" style="width:220px;height:125px;right:16px"><i class="b" style="left:11px;top:11px;width:32px;height:31px;border-radius:3.5px"></i><i class="p" style="left:48px;top:33px;width:23px;height:9px"></i><i class="b" style="left:11px;top:52px;width:57px;height:74px"></i><i class="b" style="left:73px;top:52px;width:57px;height:74px"></i><i class="b" style="left:135px;top:52px;width:57px;height:74px"></i><i class="b" style="left:197px;top:52px;width:57px;height:74px"></i></div>` },
  { t: 'NoCode-Dev', chip: true, cls: ' r32', ill: `<div class="ill dev" style="width:220px;height:125px;right:16px;border-radius:17px"><i class="b" style="left:14px;top:10px;width:192px;height:26px"></i><i class="p" style="left:14px;top:45px;width:33px;height:8px"></i><i class="p" style="left:14px;top:57px;width:62px;height:8px"></i><i class="p" style="left:14px;top:74px;width:20px;height:9px"></i><i class="b" style="left:97px;top:45px;width:109px;height:80px"></i></div>` },
  { t: 'Prototype', chip: true, cls: '', ill: `<div class="ill dev" style="width:220px;height:125px;right:16px;border-radius:17px"><svg viewBox="0 0 43 48" width="43" height="48" style="position:absolute;left:89px;top:28px" aria-hidden="true">${innerOf(icons.play)}</svg><i class="b" style="left:14px;top:90px;width:192px;height:35px"></i></div>` },
  { t: 'Design Systems', chip: true, cls: '', ill: `<div class="ill dev" style="width:220px;height:125px;right:16px;border-radius:17px"><i class="p" style="left:14px;top:14px;width:38px;height:8px"></i><i class="p" style="left:14px;top:28px;width:23px;height:9px"></i><i class="p" style="left:14px;top:42px;width:23px;height:9px"></i><i class="p" style="left:14px;top:56px;width:23px;height:9px"></i><i class="b" style="left:71px;top:14px;width:64px;height:25px"></i><i class="b" style="left:142px;top:14px;width:64px;height:25px"></i><i class="b" style="left:71px;top:46px;width:64px;height:79px"></i><i class="b" style="left:142px;top:46px;width:64px;height:79px"></i></div>` },
];

const projects = [
  ['Wish', 'live', 'Wish Mobile application', 3], ['Eyas', 'live', 'Eyas Mobile application', 3],
  ['Hozaan', 'soon', 'Hozaan Mobile application', 3], ['Masroofi', 'ws', 'Masroofi Mobile application', 3],
  ['Scouty', 'soon', 'Scouty Mobile application', 3], ['Instapay', 'ws', 'Instapay Mobile application', 3],
  ['Douq', 'live', 'Douq Website', 1], ['Dentinnova', 'live', 'Denntinova Website', 1],
];
const statusText = { live: 'Live', soon: 'Soon', ws: 'Workshop' };
const projHtml = projects.map(([n, s, label, k]) => {
  const key = n.toLowerCase();
  const imgs = k === 3
    ? [1, 2, 3].map(i => pic(`p-${key}-${i}`, { alt: `Screen ${i} for ${label}`, w: 130, h: 282, sizes: '(max-width: 809px) 80px, (max-width: 1199px) 86px, 130px' })).join('')
    : pic(`p-${key}`, { alt: `Screen for ${label}`, w: 280, h: 288, sizes: '(max-width: 809px) 194px, (max-width: 1199px) 225px, 280px' });
  return `<li class="rv"><div class="shot${k === 1 ? ' single' : ''}">${imgs}</div><div class="proj-meta"><h3>${n}</h3><span class="status s-${s}">${statusText[s]}</span></div></li>`;
}).join('');

const feats = list => `<ul class="feat">${list.map(t => `<li>${checkSvg}<span>${t}</span></li>`).join('')}</ul>`;
const mobileFeats = ['Decide bussiness goals and features', 'Sitemaps and Userflows', 'Building a design system (style guide)', 'UI design screens', 'Prototype and simple usability testing', 'Preview screenshots for App Store and Play Store'];
const webFeats = ['Decide end goals and sections', 'Sitemaps and Userflows', 'Building structure and variables for different breakpoints', 'UI design for pages', 'Prototype and Usability testing', 'Prototype and animations'];
const customFeats = ['Mobile app design (one app or multiple apps: customer + provider)', 'Marketing website or landing pages', 'Saas Products or Web applications', 'Dashboard or internal product tools', 'Prototypes, interactions, and animations', 'Priority support, revisions, and feature iteration'];

const faqAnswer = 'I design mobile apps, websites, design systems, and run usability tests. I also build marketing websites using Webflow and Framer.';
const faqItem = i => `<div class="qa"><div class="qa-in"><h3><button class="qa-q" type="button" aria-expanded="false" aria-controls="faq-a${i}" id="faq-q${i}"><span>What services do you offer ?</span><i class="pm" aria-hidden="true"></i></button></h3><p class="qa-a" id="faq-a${i}" role="region" aria-labelledby="faq-q${i}" hidden>${faqAnswer}</p></div></div>`;

const toolRow = (ids) => { const one = ids.map(toolIcon).join(''); return one + one + one + one; };

const ext = (href, label, inner, cls = '') => `<a href="${href}" target="_blank" rel="noopener"${cls ? ` class="${cls}"` : ''} aria-label="${label}">${inner}</a>`;

/* ---------- JSON-LD ---------- */
const ld = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'Person', '@id': ORIGIN + '#mina', name: 'Mina Elia', jobTitle: 'Senior UI/UX Designer & AI Product Builder', url: ORIGIN, image: ORIGIN + 'img/avatar-204.webp', email: 'mailto:minaelia.designer@gmail.com',
      sameAs: ['https://www.linkedin.com/in/mina-elia-1223421a4/', 'https://www.behance.net/MinaElia29', 'https://dribbble.com/Mina_Elia'],
      knowsAbout: ['AI product building', 'UI design', 'UX design', 'Mobile app design', 'Website design', 'Framer', 'Webflow', 'Design systems', 'Prototyping'] },
    { '@type': 'WebSite', '@id': ORIGIN + '#website', url: ORIGIN, name: 'Mina Elia — Portfolio', inLanguage: 'en', publisher: { '@id': ORIGIN + '#mina' } },
    { '@type': 'ItemList', name: 'Work That Speaks for Itself', itemListElement: projects.map(([n, s, label], i) => ({ '@type': 'ListItem', position: i + 1,
      item: { '@type': 'CreativeWork', name: n, description: `${label.replace('Denntinova', 'Dentinnova')} designed by Mina Elia — status: ${statusText[s]}.`, creator: { '@id': ORIGIN + '#mina' }, url: ORIGIN + '#projects',
        image: ORIGIN + (projects[i][3] === 3 ? `img/p-${n.toLowerCase()}-1-390.webp` : `img/p-${n.toLowerCase()}-840.webp`) } })) },
  ],
};

const title = 'Mina Elia — Senior UI/UX Designer & AI Product Builder';
const desc = 'Mina Elia — Senior UI/UX Designer and AI product builder with 4+ years of experience designing mobile apps, websites and digital products. View projects, services and tools.';
const css = fs.readFileSync(`${SRC}/styles.css`, 'utf8');

const head = (t, d, canonical, extra = '') => `<!doctype html><html lang="en" class="no-js"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${t}</title><meta name="description" content="${d}"><link rel="canonical" href="${canonical}"><meta name="theme-color" content="#f1f1f1"><meta name="robots" content="max-image-preview:large">
<link rel="preload" href="/fonts/hanken-600.woff2" as="font" type="font/woff2" crossorigin><link rel="preload" href="/fonts/dmsans-400.woff2" as="font" type="font/woff2" crossorigin><link rel="preload" href="/fonts/dmsans-500-600.woff2" as="font" type="font/woff2" crossorigin>
<link rel="icon" href="/favicon-48.png" sizes="48x48" type="image/png"><link rel="icon" href="/favicon-32.png" sizes="32x32" type="image/png"><link rel="apple-touch-icon" href="/apple-touch-icon.png"><link rel="manifest" href="/site.webmanifest">
<meta property="og:type" content="website"><meta property="og:url" content="${canonical}"><meta property="og:title" content="${t}"><meta property="og:description" content="${d}"><meta property="og:image" content="${ORIGIN}og.jpg"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="Mina Elia — UI/UX Designer portfolio"><meta property="og:site_name" content="Mina Elia"><meta property="og:locale" content="en_US">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${t}"><meta name="twitter:description" content="${d}"><meta name="twitter:image" content="${ORIGIN}og.jpg"><meta name="twitter:image:alt" content="Mina Elia — UI/UX Designer portfolio">
<script>document.documentElement.className=document.documentElement.className.replace('no-js','js')</script>${extra}<style>${css}</style></head>`;

const navIcon = (n) => `<svg viewBox="${viewBoxOf(icons[n])}" aria-hidden="true" focusable="false">${innerOf(icons[n]).replace(/rgb\(255, 255, 255\)/g, 'currentColor')}</svg>`;
const navHtml = `<header class="nav"><nav class="nav-in" aria-label="Main"><a href="./" class="logo" aria-label="Mina Elia — home">${logoSvg}</a><div class="nav-right">${ext('https://www.linkedin.com/in/mina-elia-1223421a4/', 'Mina Elia on LinkedIn (opens in a new tab)', navIcon('linkedin'), 'nav-ic')}${ext('https://www.behance.net/MinaElia29', 'Mina Elia on Behance (opens in a new tab)', navIcon('behance'), 'nav-ic')}<a class="btn nav-cta" href="${MAIL}" target="_blank" rel="noopener">Start Project</a></div></nav></header>`;

const footHtml = `<div class="foot"><div class="f-left"><a href="./" class="f-logo" aria-label="Mina Elia — back to top">${logoSvg}</a><p class="f-tag">My Latest Project<br>Always my Best</p><div class="socials">${ext('https://www.linkedin.com/in/mina-elia-1223421a4/', 'Mina Elia on LinkedIn (opens in a new tab)', `<svg viewBox="${viewBoxOf(icons.linkedin)}" aria-hidden="true" focusable="false">${innerOf(icons.linkedin)}</svg>`)}${ext('https://wa.me/201211611554', 'Message Mina Elia on WhatsApp (opens in a new tab)', `<svg viewBox="${viewBoxOf(icons.whatsapp)}" aria-hidden="true" focusable="false">${innerOf(icons.whatsapp)}</svg>`)}${ext('https://www.behance.net/MinaElia29', 'Mina Elia on Behance (opens in a new tab)', `<svg viewBox="${viewBoxOf(icons.behance)}" aria-hidden="true" focusable="false">${innerOf(icons.behance)}</svg>`)}</div><p class="made">Created by <span class="pic">${pic('mina-small', { alt: '', w: 24, h: 24 })}</span><b>Mina Elia</b> in <b>Framer</b></p></div><nav class="f-nav" aria-label="Footer"><p>Navigation</p><ul><li><a href="./#services">Services</a></li><li><a href="./#projects">Projects</a></li></ul></nav></div>`;

// Plans section is archived (live copy: branch archive/v1.0-framer-replica). Set to true to bring it back.
const SHOW_PLANS = false;
const plansHtml = `<section class="plans" id="plans" aria-labelledby="plans-title"><div class="head"><p class="label rv">Plans</p><h2 class="h2 rv" id="plans-title">Choose the Perfect&#32;<br>Fit for Your Project</h2></div>
<div class="plan-grid">
<article class="card rv"><div class="card-in"><div class="p-icon"><svg viewBox="${viewBoxOf(icons['plan-mobile'])}" aria-hidden="true" focusable="false">${innerOf(icons['plan-mobile'])}</svg></div><h3>Mobile Plan</h3><p class="p-sub">Complete mobile application design from concept to launch-ready assets</p><div class="price-row"><span class="price">$900</span><span class="unit">/ Mobile App</span></div><a class="btn btn-dark" href="${MAIL}">Start your App</a><p class="incl">What's included :</p>${feats(mobileFeats)}</div></article>
<article class="card web rv" data-plan><div class="card-in"><div class="p-icon"><svg viewBox="${viewBoxOf(icons['plan-website'])}" aria-hidden="true" focusable="false">${innerOf(icons['plan-website'])}</svg></div><h3>Website Plan</h3><p class="p-sub">Professional website design with modern interactions</p><div class="price-row"><span class="price">$350</span><span class="sr-only" aria-live="polite" id="price-live"></span><div class="dd"><button class="dd-btn" type="button" aria-haspopup="true" aria-expanded="false" aria-controls="dd-menu" aria-label="Website size: Landing Page"><span aria-hidden="true">/ <span class="dd-label">Landing Page</span></span><svg viewBox="${viewBoxOf(chevron)}" aria-hidden="true" focusable="false" style="transform:rotate(-90deg)"><g>${innerOf(chevron)}</g></svg></button><div class="dd-menu" id="dd-menu" role="menu" hidden><button type="button" role="menuitemradio" aria-checked="true" data-v="Landing Page">Landing Page</button><button type="button" role="menuitemradio" aria-checked="false" data-v="4–6 Pages">4–6 Pages</button><button type="button" role="menuitemradio" aria-checked="false" data-v="More than 6 Pages">+ 6 Pages</button></div></div></div><a class="btn btn-dark" href="${MAIL}">Start your Website</a><div class="toggle-row"><button class="switch" type="button" role="switch" aria-checked="false" aria-labelledby="nocode-l"></button><span id="nocode-l">+No-code Development</span></div><p class="incl">What's included :</p>${feats(webFeats)}</div></article>
</div>
<article class="card custom rv"><div class="card-in"><div class="c-left">${pic('custom-plan', { alt: '', w: 48, h: 48 })}<h3>Custom Plan</h3><p class="p-sub">A fully adaptable plan for any product combination—apps, websites, or dashboards.</p><a class="btn btn-dark" href="${MAIL}" target="_blank" rel="noopener">Start your Custom Plan</a></div><div class="c-right"><p class="incl">What's can included :</p>${feats(customFeats)}</div></div></article>
</section>
`;

const html = `${head(title, desc, ORIGIN, `<script type="application/ld+json">${JSON.stringify(ld)}</script>`)}<body><a class="skip" href="#main">Skip to content</a>${sprite}${navHtml}
<main id="main">
<section class="hero" id="hero-1" aria-labelledby="hero-title"><div class="avatar">${pic('avatar', { alt: 'Portrait of Mina Elia', w: 68, h: 68, eager: true, high: true })}</div><p class="hero-sub"><span class="sub-in">${subtitle.replace('&', '&amp;')}</span></p><h1 id="hero-title"><span class="sr-only">My Latest Project Always my Best</span><span aria-hidden="true">${h1Words.map((w, i) => `<span class="wd" style="animation-delay:${(0.3 + i * 0.05).toFixed(2)}s">${w}</span>`).join(' ').replace('Project</span> ', 'Project</span>&#32;<br class="t-br">')}</span></h1><a class="btn btn-white" href="${MAIL}" target="_blank" rel="noopener">Start your Project</a></section>
<section class="screens" id="screens-1" aria-label="Recent project screens"><button class="pause-btn" type="button" aria-pressed="false">Pause animations</button><div class="track-wrap"><div class="track">${screenSet(false)}${screenSet(true)}</div></div></section>
<section class="quote" id="quote" aria-label="About Mina"><div class="dark"><div class="aurora">${pic('aurora', { alt: '', w: 1536, h: 1024, sizes: '(max-width: 809px) 600px, (max-width: 1199px) 1152px, 1536px' })}</div><div class="q-content rv"><h2 class="reveal-h">${words('I’m a Senior UI/UX Designer with 4+ years of experience crafting apps, websites and digital products')}</h2><div class="glass"><div class="glass-in">${pic('glass-card', { alt: 'Card reading UI/UX Designer, Framer Expert', w: 360, h: 212, sizes: '(max-width: 809px) 240px, (max-width: 1199px) 320px, 360px' })}</div></div><h2 class="reveal-h">${words('My portfolio spans fintech, mobility and health, blending UX strategy, design systems and AI-powered building')}</h2></div></div></section>
<section class="services" id="services" aria-labelledby="services-title"><div class="head"><p class="label rv">Services</p><h2 class="h2 rv" id="services-title">Expertise in What<br>I Build and Design</h2></div><ul class="svc-grid">${svcCards.map(c => `<li class="svc rv${c.cls}"><div class="svc-in"><h3>${c.t}</h3>${c.chip ? '<span class="chip-soon">Examples Soon</span>' : ''}${c.ill.replace(/<i class="b" style="([^"]*?top:(\d+)px;[^"]*?height:(\d+)px[^"]*)"/g, (m, st, t, h) => +t + +h >= 124 ? `<i class="b bb" style="${st}"` : m).replace(/border-radius:17px/g, 'border-radius:17px 17px 0 0')}</div></li>`).join('')}</ul></section>
<section class="projects" id="projects" aria-labelledby="projects-title"><div class="white"><div class="head"><p class="label rv">Projects</p><h2 class="h2 rv" id="projects-title">Work That Speaks&#32;<br>for Itself</h2></div><ul class="proj-grid">${projHtml}</ul></div></section>
${SHOW_PLANS ? plansHtml : ''}<section class="tools" id="tools" aria-labelledby="tools-title"><div class="white"><div class="head"><p class="label rv">Tools</p><h2 class="h2 rv" id="tools-title">Each Tool Shape<br>My Process</h2></div><p class="tools-desc rv">I used <span>+12 specialized tools</span> to produce the final product</p><div class="tool-frame rv"><div class="tool-in" role="img" aria-label="Tools: ${toolNames.join(', ')}">${pic('aurora', { alt: '', w: 608, h: 216, sizes: '(max-width: 809px) 380px, 768px', style: 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:-1' })}<div class="tool-row r1"><div class="tool-track">${toolRow([1, 2, 3, 4, 5, 6])}</div></div><div class="tool-row r2"><div class="tool-track">${toolRow([7, 8, 9, 10, 11, 12])}</div></div></div></div></div></section>
<section class="faq" aria-labelledby="faq-title"><div class="head"><p class="label rv">FAQ's</p><h2 class="h2 rv" id="faq-title">Questions You&#32;<br>Might Have</h2></div><div class="faq-grid"><div class="faq-col">${[1, 2, 3].map(faqItem).join('')}</div><div class="faq-col">${[4, 5, 6].map(faqItem).join('')}</div></div></section>
<section class="cta" aria-labelledby="cta-title"><div class="dark"><div class="aurora">${pic('aurora', { alt: '', w: 1536, h: 1024, sizes: '(max-width: 809px) 600px, (max-width: 1199px) 1152px, 1536px' })}</div><h2 class="reveal-h cta-h" id="cta-title">${words('Start your Project with')}&#32;<br>${words('360° Design Expertise')}</h2><p class="cta-sub">Visual + Graphic - UI/UX - Product - Framer &amp; Webflow</p><a class="btn btn-white" href="${MAIL}" target="_blank" rel="noopener">Start your Project</a><div class="rule" aria-hidden="true"></div><footer>${footHtml}</footer></div></section>
</main><script src="/js/main.js" defer></script></body></html>`;

const notFound = `${head('404 — Mina Elia', 'The path you seek has vanished. Head back to Mina Elia’s portfolio.', ORIGIN + '404.html', '<meta name="robots" content="noindex">')}<body><a class="skip" href="#main">Skip to content</a>${navHtml}<main id="main"><section class="hero" style="min-height:100vh;padding-bottom:80px;justify-content:center"><h1 style="margin-top:0">404 - The path you seek has vanished.</h1><p class="hero-sub">This page drifts in the void, where no words unfold.</p><a class="btn btn-white" style="margin-top:32px;opacity:1;animation:none;transform:none" href="/">Back to home</a></section></main><script src="/js/main.js" defer></script></body></html>`;

(async () => {
  const opts = { collapseWhitespace: true, conservativeCollapse: false, removeComments: true, minifyCSS: { level: 1 }, minifyJS: true, removeRedundantAttributes: true, removeScriptTypeAttributes: false, sortAttributes: true, sortClassName: false, useShortDoctype: true, decodeEntities: false };
  fs.writeFileSync(`${SITE}/index.html`, await minify(html, opts));
  fs.writeFileSync(`${SITE}/404.html`, await minify(notFound, opts));
  fs.mkdirSync(`${SITE}/js`, { recursive: true });
  const js = await terser.minify(fs.readFileSync(`${SRC}/main.js`, 'utf8'), { compress: { passes: 2 }, mangle: true, format: { comments: false } });
  fs.writeFileSync(`${SITE}/js/main.js`, js.code);
  fs.writeFileSync(`${SITE}/robots.txt`, `User-agent: *\nAllow: /\n\nSitemap: ${ORIGIN}sitemap.xml\n`);
  fs.writeFileSync(`${SITE}/sitemap.xml`, `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${ORIGIN}</loc><lastmod>${new Date().toISOString().slice(0, 10)}</lastmod><changefreq>monthly</changefreq><priority>1.0</priority></url>\n</urlset>\n`);
  fs.writeFileSync(`${SITE}/site.webmanifest`, JSON.stringify({ name: 'Mina Elia — Portfolio', short_name: 'Mina Elia', start_url: '/', display: 'standalone', background_color: '#f1f1f1', theme_color: '#f1f1f1', icons: [{ src: '/icon-192.png', sizes: '192x192', type: 'image/png' }, { src: '/icon-512.png', sizes: '512x512', type: 'image/png' }] }, null, 1));
  fs.writeFileSync(`${SITE}/.nojekyll`, '');
  console.log('index.html', fs.statSync(`${SITE}/index.html`).size, 'bytes; main.js', js.code.length);
})();
