// AxisPay flow screens (original exports, 750x1624) for the project sheet
const fs = require('fs'), sharp = require('sharp');
const P = '/home/claude/assets-src/proj/axis-flows', IMG = '/home/claude/site/img', MF = '/home/claude/tools/img-manifest.json';
const M = JSON.parse(fs.readFileSync(MF, 'utf8'));
(async () => {
  for (const f of fs.readdirSync(P).filter(f => f.endsWith('.png'))) {
    const name = `fa-${f.replace('.png', '')}`, widths = [170, 340, 510];
    for (const w of widths) {
      await sharp(`${P}/${f}`).resize(w).avif({ quality: 60, effort: 6 }).toFile(`${IMG}/${name}-${w}.avif`);
      await sharp(`${P}/${f}`).resize(w).webp({ quality: 82 }).toFile(`${IMG}/${name}-${w}.webp`);
    }
    await sharp(`${P}/${f}`).resize(340).jpeg({ quality: 80, mozjpeg: true }).toFile(`${IMG}/${name}-340.jpg`);
    M[name] = { ratio: 1624 / 750, widths, fallback: `${name}-340.jpg`, fbw: 340 };
  }
  fs.writeFileSync(MF, JSON.stringify(M)); console.log('ok');
})();
