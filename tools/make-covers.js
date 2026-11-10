// project sheet cover images
const fs = require('fs'), sharp = require('sharp');
const P = '/home/claude/assets-src/proj', IMG = '/home/claude/site/img', MF = '/home/claude/tools/img-manifest.json';
const M = JSON.parse(fs.readFileSync(MF, 'utf8'));
const covers = { 'pc-axispay': 'axis-cover.png', 'pc-d360': 'd360-cover.png' };
(async () => {
  for (const [name, file] of Object.entries(covers)) {
    const src = `${P}/${file}`, meta = await sharp(src).metadata(), widths = [720, 1080, 1600, 2144].filter(w => w <= meta.width).concat(meta.width < 2144 && meta.width > 1080 ? [meta.width] : []).filter((w, i, a) => a.indexOf(w) === i);
    for (const w of widths) {
      await sharp(src).resize(w).avif({ quality: 55, effort: 6 }).toFile(`${IMG}/${name}-${w}.avif`);
      await sharp(src).resize(w).webp({ quality: 78 }).toFile(`${IMG}/${name}-${w}.webp`);
    }
    await sharp(src).resize(1080).flatten({ background: '#ffffff' }).jpeg({ quality: 78, mozjpeg: true }).toFile(`${IMG}/${name}-1080.jpg`);
    M[name] = { ratio: meta.height / meta.width, widths, fallback: `${name}-1080.jpg`, fbw: 1080 };
    console.log(name, widths, fs.statSync(`${IMG}/${name}-1080.avif`).size);
  }
  fs.writeFileSync(MF, JSON.stringify(M));
})();
