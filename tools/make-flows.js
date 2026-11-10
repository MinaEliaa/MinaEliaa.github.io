// D360 website-section images for the project sheet flows (16:10)
const fs = require('fs'), sharp = require('sharp');
const P = '/home/claude/assets-src/proj', IMG = '/home/claude/site/img', MF = '/home/claude/tools/img-manifest.json';
const M = JSON.parse(fs.readFileSync(MF, 'utf8'));
(async () => {
  for (let i = 1; i <= 6; i++) {
    const name = `f-d360-${i}`, widths = [360, 720];
    for (const w of widths) {
      await sharp(`${P}/d360-flow-${i}.png`).resize(w).avif({ quality: 58, effort: 6 }).toFile(`${IMG}/${name}-${w}.avif`);
      await sharp(`${P}/d360-flow-${i}.png`).resize(w).webp({ quality: 80 }).toFile(`${IMG}/${name}-${w}.webp`);
    }
    await sharp(`${P}/d360-flow-${i}.png`).resize(360).jpeg({ quality: 78, mozjpeg: true }).toFile(`${IMG}/${name}-360.jpg`);
    M[name] = { ratio: 10 / 16, widths, fallback: `${name}-360.jpg`, fbw: 360 };
  }
  fs.writeFileSync(MF, JSON.stringify(M)); console.log('ok');
})();
