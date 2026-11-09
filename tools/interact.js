// Functional checks on the local build.
const puppeteer = require('puppeteer-core');
const URL = process.argv[2] || 'http://localhost:8081/';
const wait = ms => new Promise(r => setTimeout(r, ms));
const ok = (c, m) => console.log((c ? 'PASS ' : 'FAIL ') + m);
(async () => {
  const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const p = await b.newPage(); await p.setViewport({ width: 1440, height: 900 });
  const errors = []; p.on('pageerror', e => errors.push(e.message)); p.on('console', m => m.type() === 'error' && errors.push(m.text()));
  await p.goto(URL, { waitUntil: 'networkidle0' }); await wait(2200);

  // links
  const links = await p.evaluate(() => [...document.querySelectorAll('a')].map(a => ({ t: (a.innerText || a.getAttribute('aria-label') || '').trim().slice(0, 30), href: a.getAttribute('href'), target: a.target, rel: a.rel })));
  const ext = links.filter(l => /^https?:/.test(l.href));
  ok(ext.every(l => l.target === '_blank' && l.rel.includes('noopener')), `external links open in new tab w/ noopener (${ext.length})`);
  ok(links.filter(l => l.href.startsWith('mailto:')).every(l => l.href === 'mailto:minaelia.designer@gmail.com'), `mailto links (${links.filter(l => l.href.startsWith('mailto:')).length}) all -> minaelia.designer@gmail.com`);
  console.log('   links:', links.map(l => `${l.t || '[icon]'}→${l.href}${l.target ? ' (' + l.target + ')' : ''}`).join(' | '));

  // anchors
  for (const id of ['services', 'projects', 'plans']) {
    await p.evaluate(() => scrollTo({ top: 0, behavior: 'instant' })); await wait(200);
    await p.click(`.nav-links a[href="./#${id}"]`); await wait(1800);
    const [y, top] = await p.evaluate(id => [scrollY, Math.round(document.getElementById(id).getBoundingClientRect().top + scrollY)], id);
    ok(Math.abs(y - top) < 3, `nav "${id}" scrolls to section (scrollY ${Math.round(y)} vs top ${top})`);
  }

  // reveal on scroll
  await p.evaluate(() => scrollTo({ top: 0, behavior: 'instant' })); await wait(300);
  const before = await p.evaluate(() => document.querySelectorAll('.rv.in').length);
  await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 400) { scrollTo({ top: y, behavior: 'instant' }); await new Promise(r => setTimeout(r, 50)); } });
  await wait(800);
  const after = await p.evaluate(() => [document.querySelectorAll('.rv.in').length, document.querySelectorAll('.rv').length]);
  ok(after[0] === after[1] && before < after[0], `scroll reveals: ${before} visible at top → ${after[0]}/${after[1]} after scrolling`);

  // word reveal
  const wr = await p.evaluate(async () => { const h = document.querySelector('.quote .reveal-h'); h.scrollIntoView({ block: 'end', behavior: 'instant' }); await new Promise(r => setTimeout(r, 300)); const a = [...h.querySelectorAll('.w')].map(w => +getComputedStyle(w).opacity); h.scrollIntoView({ block: 'start', behavior: 'instant' }); window.scrollBy({ top: -50, behavior: 'instant' }); await new Promise(r => setTimeout(r, 300)); const c = [...h.querySelectorAll('.w')].map(w => +getComputedStyle(w).opacity); return [a[0], a[a.length - 1], c[0], c[c.length - 1]]; });
  ok(wr[1] < 0.3 && wr[3] > 0.9, `scroll-linked word reveal (entering: first ${wr[0].toFixed(2)} last ${wr[1].toFixed(2)}; scrolled: first ${wr[2].toFixed(2)} last ${wr[3].toFixed(2)})`);

  // marquees move
  const m1 = await p.evaluate(() => new DOMMatrix(getComputedStyle(document.querySelector('.track')).transform).m41); await wait(1000);
  const m2 = await p.evaluate(() => new DOMMatrix(getComputedStyle(document.querySelector('.track')).transform).m41);
  ok(m2 < m1 && Math.abs((m1 - m2) - 75) < 15, `screens marquee moves left ~75px/s (${(m1 - m2).toFixed(0)}px/s)`);
  await p.evaluate(() => document.querySelector('.tool-frame').scrollIntoView({ block: 'center' })); await wait(400);
  const t1 = await p.evaluate(() => [...document.querySelectorAll('.tool-track')].map(t => new DOMMatrix(getComputedStyle(t).transform).m41)); await wait(1000);
  const t2 = await p.evaluate(() => [...document.querySelectorAll('.tool-track')].map(t => new DOMMatrix(getComputedStyle(t).transform).m41));
  ok(t2[0] < t1[0] && t2[1] > t1[1], `tool rows move opposite ways (${(t2[0] - t1[0]).toFixed(0)}, +${(t2[1] - t1[1]).toFixed(0)} px/s)`);

  // pricing
  const price = () => p.$eval('[data-plan] .price', e => e.textContent);
  await p.evaluate(() => document.querySelector('[data-plan]').scrollIntoView({ block: 'center' })); await wait(300);
  const seq = [];
  for (const [opt, tog] of [['Landing Page', false], ['Landing Page', true], ['4–6 Pages', true], ['4–6 Pages', false], ['More than 6 Pages', false], ['More than 6 Pages', true]]) {
    const cur = await p.$eval('[data-plan] .switch', e => e.getAttribute('aria-checked') === 'true');
    await p.click('[data-plan] .dd-btn'); await wait(150);
    await p.click(`[data-plan] .dd-menu button[data-v="${opt}"]`); await wait(100);
    if (cur !== tog) await p.click('[data-plan] .switch');
    await wait(700); seq.push(`${opt}${tog ? '+nocode' : ''}=${await price()}`);
  }
  const expect = ['Landing Page=$350', 'Landing Page+nocode=$550', '4–6 Pages+nocode=$1.2k', '4–6 Pages=$600', 'More than 6 Pages=+$800', 'More than 6 Pages+nocode=+$1.6k'];
  ok(JSON.stringify(seq) === JSON.stringify(expect), `pricing matrix: ${seq.join(', ')}`);
  ok(await p.$eval('[data-plan] .dd-label', e => e.textContent) === '+ 6 Pages', 'dropdown label shows "+ 6 Pages"');
  // keyboard on dropdown
  await p.focus('[data-plan] .dd-btn'); await p.keyboard.press('Enter'); await wait(100);
  const kb1 = await p.evaluate(() => document.activeElement.dataset.v); await p.keyboard.press('ArrowDown'); const kb2 = await p.evaluate(() => document.activeElement.dataset.v);
  await p.keyboard.press('Escape'); const kb3 = await p.evaluate(() => [document.activeElement.className, document.querySelector('.dd-menu').hidden]);
  ok(kb1 === 'More than 6 Pages' && kb2 === 'Landing Page' && kb3[1] === true && kb3[0] === 'dd-btn', `dropdown keyboard: opens on selected (${kb1}), arrows wrap (${kb2}), Esc closes & refocuses`);

  // FAQ
  const q = await p.$$('.qa-q');
  await q[3].click(); await wait(200);
  const faq = await p.evaluate(() => [...document.querySelectorAll('.qa-q')].map(x => x.getAttribute('aria-expanded')).join(','));
  const ans = await p.evaluate(() => document.getElementById('faq-a4').textContent);
  ok(faq === 'false,false,false,true,false,false' && ans.startsWith('I design mobile apps'), `FAQ toggles independently (${faq})`);
  await q[3].click(); ok(await p.evaluate(() => document.getElementById('faq-a4').hidden), 'FAQ closes again');

  // hover ring on CTA
  await p.evaluate(() => scrollTo({ top: 0, behavior: 'instant' })); await wait(300);
  const cta = await p.$('.hero .btn-white'); const bb = await cta.boundingBox(); await p.mouse.move(bb.x + 10, bb.y + 10); await wait(350);
  ok((await p.evaluate(e => getComputedStyle(e).boxShadow, cta)).includes('rgb(3, 187, 94) 0px 0px 0px 2px'), 'CTA hover → 2px green ring');

  // Mobile menu + keyboard
  const m = await b.newPage(); await m.setViewport({ width: 360, height: 780, isMobile: true, hasTouch: true });
  await m.goto(URL, { waitUntil: 'networkidle0' }); await wait(1600);
  ok(await m.$eval('.nav-sheet', e => getComputedStyle(e).display === 'none'), 'mobile: sheet hidden initially');
  await m.tap('.burger'); await wait(400);
  const open = await m.evaluate(() => [getComputedStyle(document.querySelector('.nav-sheet')).display, document.querySelector('.burger').getAttribute('aria-expanded'), Math.round(document.querySelector('.nav-in').getBoundingClientRect().height)]);
  ok(open[0] === 'flex' && open[1] === 'true', `mobile: burger opens full-height sheet (h=${open[2]}px, aria-expanded=${open[1]})`);
  await m.keyboard.press('Escape'); await wait(200);
  ok(await m.evaluate(() => document.querySelector('.burger').getAttribute('aria-expanded') === 'false' && document.activeElement.classList.contains('burger')), 'mobile: Esc closes and returns focus to burger');
  await m.tap('.burger'); await wait(300); await m.tap('.nav-sheet a[href="./#plans"]'); await wait(1800);
  const ms = await m.evaluate(() => [Math.round(scrollY), Math.round(document.getElementById('plans').getBoundingClientRect().top + scrollY), document.querySelector('.nav').classList.contains('open')]);
  ok(Math.abs(ms[0] - ms[1]) < 3 && !ms[2], `mobile: menu link scrolls to #plans and closes menu (${ms[0]} vs ${ms[1]})`);

  // keyboard: skip link + tab order + focus visible
  const k = await b.newPage(); await k.setViewport({ width: 1440, height: 900 }); await k.goto(URL, { waitUntil: 'networkidle0' }); await wait(1300);
  await k.keyboard.press('Tab'); const first = await k.evaluate(() => [document.activeElement.textContent, getComputedStyle(document.activeElement).top]);
  ok(first[0] === 'Skip to content', `first Tab = skip link ("${first[0]}", visible top ${first[1]})`);
  const order = []; for (let i = 0; i < 12; i++) { await k.keyboard.press('Tab'); order.push(await k.evaluate(() => { const a = document.activeElement; const o = getComputedStyle(a).outlineStyle; return (a.textContent.trim() || a.getAttribute('aria-label') || a.tagName).slice(0, 22) + (o === 'none' ? '(!no outline)' : ''); })); }
  console.log('   tab order:', order.join(' → '));
  ok(!order.some(o => o.includes('no outline')), 'every focused element shows a focus outline');

  // tap target sizes (mobile)
  const small = await m.evaluate(() => [...document.querySelectorAll('a,button')].filter(e => { const r = e.getBoundingClientRect(); return r.width > 0 && getComputedStyle(e).visibility !== 'hidden' && !e.classList.contains('skip') && !e.classList.contains('pause-btn') && (r.width < 24 || r.height < 24); }).map(e => `${(e.textContent || e.getAttribute('aria-label')).trim().slice(0, 20)} ${Math.round(e.getBoundingClientRect().width)}x${Math.round(e.getBoundingClientRect().height)}`));
  ok(small.length === 0, `tap targets ≥24px on mobile ${small.length ? '— small: ' + small.join(', ') : ''}`);

  // reduced motion
  const r = await b.newPage(); await r.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]); await r.setViewport({ width: 1440, height: 900 });
  await r.goto(URL, { waitUntil: 'networkidle0' }); await wait(500);
  const rm = await r.evaluate(() => [getComputedStyle(document.querySelector('.track')).animationName, getComputedStyle(document.querySelector('.quote .reveal-h .w')).opacity, getComputedStyle(document.querySelector('.wd')).opacity]);
  ok(rm[0] === 'none' && rm[1] === '1' && rm[2] === '1', `reduced motion: marquee stopped (${rm[0]}), words fully visible (${rm[1]}), hero text visible (${rm[2]})`);

  ok(errors.length === 0, `no console errors ${errors.join(' | ')}`);
  await b.close();
})();
