// Side-by-side live vs local screenshots + text position diff, per width.
// usage: node compare.js 1440 [local-url]
const puppeteer = require('puppeteer-core');
const sharp = require('sharp');
const fs = require('fs');
const W = +(process.argv[2] || 1440);
const LOCAL = process.argv[3] || 'http://localhost:8080/';
const LIVE = 'https://mina-designer.framer.website/';
const OUT = '/home/claude/crawl/cmp'; fs.mkdirSync(OUT, { recursive: true });
const wait = ms => new Promise(r => setTimeout(r, ms));

async function capture(b, url, tag) {
  const p = await b.newPage(); await p.setViewport({ width: W, height: 900 });
  await p.goto(url, { waitUntil: 'networkidle2', timeout: 90000 }); await wait(2500);
  await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 300) { scrollTo(0, y); await new Promise(r => setTimeout(r, 70)); } scrollTo(0, document.body.scrollHeight); await new Promise(r => setTimeout(r, 1500)); scrollTo(0, 0); });
  await wait(1500);
  await p.evaluate(() => {
    document.getAnimations().forEach(a => { try { if (a.effect.getTiming().iterations === Infinity) { a.pause(); a.currentTime = 0; } else a.finish(); } catch (e) {} });
    document.querySelectorAll('.rv').forEach(e => e.classList.add('in'));
    // hide Framer badge + make sticky static for a stable full-page shot
    document.querySelectorAll('#__framer-badge-container, [class*="__framer-badge"]').forEach(e => e.remove());
    const badge = [...document.querySelectorAll('a[href="https://www.framer.com"]')]; badge.forEach(a => { const c = a.closest('div[style*="fixed"]') || a.parentElement; c.style.display = 'none'; });
    document.querySelectorAll('*').forEach(e => { if (getComputedStyle(e).position === 'fixed') e.style.visibility = 'hidden'; });
    document.querySelectorAll('.reveal-h .w').forEach(w => w.style.opacity = 1);
  });
  // reveal live's word spans too (they're divs with inline opacity)
  await p.evaluate(() => document.querySelectorAll('div').forEach(d => { if (d.childElementCount === 0 && d.style.opacity && getComputedStyle(d).color === 'rgb(255, 255, 255)') d.style.opacity = 1; }));
  await wait(1200);
  const file = `${OUT}/${tag}-${W}.png`;
  await p.screenshot({ path: file, fullPage: true });
  const texts = await p.evaluate(() => {
    const out = []; const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let n; while ((n = walker.nextNode())) {
      const t = n.textContent.trim(); if (!t || t.length < 3) continue;
      const el = n.parentElement; const cs = getComputedStyle(el); if (cs.visibility === 'hidden' || cs.display === 'none' || el.closest('.sr-only,[aria-hidden="true"] .ch')) continue;
      const r = document.createRange(); r.selectNodeContents(n); const b = r.getBoundingClientRect(); if (b.width < 1) continue;
      out.push({ t: t.slice(0, 40), x: Math.round(b.x), y: Math.round(b.y + scrollY), w: Math.round(b.width), h: Math.round(b.height), fs: cs.fontSize, fw: cs.fontWeight, c: cs.color });
    }
    return { texts: out, H: document.body.scrollHeight };
  });
  await p.close();
  return { file, ...texts };
}

(async () => {
  const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const [live, local] = [await capture(b, LIVE, 'live'), await capture(b, LOCAL, 'local')];
  await b.close();
  console.log(`W=${W} page height live ${live.H} local ${local.H}`);
  // match texts in order by content
  const used = new Set(); const rows = [];
  for (const a of live.texts) {
    const i = local.texts.findIndex((c, k) => !used.has(k) && c.t === a.t);
    if (i < 0) { rows.push(`MISSING local: "${a.t}" @${a.x},${a.y}`); continue; }
    used.add(i); const c = local.texts[i];
    const dx = c.x - a.x, dy = c.y - a.y, dw = c.w - a.w;
    if (Math.abs(dx) > 2 || Math.abs(dy) > 3 || Math.abs(dw) > 3 || a.fs !== c.fs || a.fw !== c.fw) rows.push(`"${a.t}" live ${a.x},${a.y} w${a.w} ${a.fs}/${a.fw} | local ${c.x},${c.y} w${c.w} ${c.fs}/${c.fw} | dx${dx} dy${dy} dw${dw}`);
  }
  local.texts.forEach((c, k) => { if (!used.has(k)) rows.push(`EXTRA local: "${c.t}" @${c.x},${c.y}`); });
  fs.writeFileSync(`${OUT}/diff-${W}.txt`, rows.join('\n'));
  console.log(rows.slice(0, 60).join('\n')); console.log(`(${rows.length} diff rows)`);
  // side-by-side slices
  const A = sharp(live.file), B = sharp(local.file);
  const [ma, mb] = [await A.metadata(), await B.metadata()];
  console.log('dims', ma.width, ma.height, mb.width, mb.height);
  const H = Math.max(ma.height, mb.height), slice = W > 1000 ? 1400 : (W > 500 ? 1600 : 2200);
  const files = [];
  for (let y = 0, i = 0; y < H; y += slice, i++) {
    const hh = Math.min(slice, H - y);
    const part = async (img, m) => y < m.height ? await sharp(img).extract({ left: 0, top: y, width: W, height: Math.min(hh, m.height - y) }).toBuffer() : null;
    const pa = await part(live.file, ma), pb = await part(local.file, mb);
    const comp = sharp({ create: { width: W * 2 + 20, height: hh, channels: 3, background: '#ff00ff' } });
    const layers = []; if (pa) layers.push({ input: pa, left: 0, top: 0 }); if (pb) layers.push({ input: pb, left: W + 20, top: 0 });
    for (const l of layers) { const mm = await sharp(l.input).metadata(); if (mm.width > W || mm.height > hh) console.log('bad layer', mm.width, mm.height, hh); }
    const f = `${OUT}/sbs-${W}-${i}.png`;
    const buf = await comp.composite(layers).png().toBuffer(); await sharp(buf).resize({ width: Math.min(W * 2 + 20, 1800) }).png().toFile(f); files.push(f);
  }
  console.log(files.join('\n'));
})();
