// Functional checks for v1.1 (no Plans, icon nav).
const puppeteer = require('puppeteer-core');
const URL = process.argv[2] || 'http://localhost:8081/';
const wait = ms => new Promise(r => setTimeout(r, ms));
const ok = (c, m) => console.log((c ? 'PASS ' : 'FAIL ') + m);
(async () => {
  const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const p = await b.newPage(); await p.setViewport({ width: 1440, height: 900 });
  const errors = []; p.on('pageerror', e => errors.push(e.message));
  await p.goto(URL, { waitUntil: 'networkidle0' }); await wait(2000);
  const nav = await p.$$eval('.nav-in a', a => a.map(x => x.getAttribute('href')));
  ok(JSON.stringify(nav) === JSON.stringify(['./', 'https://www.linkedin.com/in/mina-elia-1223421a4/', 'https://www.behance.net/MinaElia29', 'mailto:minaelia.designer@gmail.com']), 'nav: logo, LinkedIn, Behance, Start Project');
  ok(await p.$$eval('a[href*="#plans"], #plans', e => e.length) === 0, 'no Plans section or links');
  ok((await p.$eval('.hero-sub', e => e.textContent)) === 'Hi, I’m Mina Elia | Senior UI/UX Designer & AI Product Builder', 'hero line updated');
  ok(await p.$$eval('.glass-light', e => e.length) === 0, 'no hover light on card');
  for (const id of ['services', 'projects']) {
    await p.evaluate(() => scrollTo({ top: 0, behavior: 'instant' })); await wait(200);
    await p.click(`.f-nav a[href="./#${id}"]`); await wait(1800);
    const [y, top] = await p.evaluate(id => [scrollY, Math.round(document.getElementById(id).getBoundingClientRect().top + scrollY)], id);
    ok(Math.abs(y - top) < 3, `footer "${id}" link scrolls to section`);
  }
  const faqPos = await p.evaluate(() => getComputedStyle(document.querySelector('.faq')).position);
  ok(faqPos !== 'sticky', `FAQ not sticky (${faqPos}) — CTA no longer slides over it`);
  const q = await p.$$('.qa-q'); await q[0].click(); await wait(80);
  const mid = await p.$eval('.qa-in', e => e.offsetHeight); await wait(300);
  const end = await p.$eval('.qa-in', e => e.offsetHeight);
  ok(end > 56 && mid < end, `FAQ opens with height animation (${mid}px → ${end}px)`);
  const tile = await p.evaluate(() => getComputedStyle(document.querySelector('#t1 rect')).fill);
  ok(tile === 'none', `tool tile outline unfilled (fill ${tile}) — glass shows through`);
  const rad = await p.$eval('.dev', e => getComputedStyle(e).borderRadius);
  ok(/0px 0px$/.test(rad), `service frames square at bottom (${rad})`);
  ok(errors.length === 0, 'no JS errors ' + errors.join('|'));
  await b.close();
})();
