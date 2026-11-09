// Bento boards → responsive AVIF + WebP (+ JPEG fallback), merged into img-manifest.json.
// Source: /home/claude/assets-src/bento/<name>.png (2048×1622, Figma 1x/2x export). A <name>.TEMP.png is used only if the real file is missing.
const sharp = require('sharp'); const fs = require('fs');
const SRC = '/home/claude/assets-src/bento', OUT = '/home/claude/site/img', MAN = '/home/claude/tools/img-manifest.json';
const names = ['d360', 'finora', 'qatar', 'wish', 'scouty', 'douq'];
const widths = [640, 960, 1280, 1600, 2048];
(async () => {
  const M = JSON.parse(fs.readFileSync(MAN, 'utf8')); const temp = [];
  for (const n of names) {
    let f = `${SRC}/${n}.png`; if (!fs.existsSync(f)) { f = `${SRC}/${n}.TEMP.png`; temp.push(n); }
    const meta = await sharp(f).metadata();
    const key = `bento-${n}`; const ws = widths.filter(w => w <= meta.width);
    for (const w of ws) {
      const base = sharp(f).resize({ width: w, kernel: 'lanczos3' });
      await base.clone().avif({ quality: 58, effort: 7, chromaSubsampling: '4:4:4' }).toFile(`${OUT}/${key}-${w}.avif`);
      await base.clone().webp({ quality: 82, effort: 6, smartSubsample: true }).toFile(`${OUT}/${key}-${w}.webp`);
    }
    await sharp(f).resize({ width: 1280 }).flatten({ background: '#ffffff' }).jpeg({ quality: 80, mozjpeg: true }).toFile(`${OUT}/${key}-1280.jpg`);
    M[key] = { ratio: meta.height / meta.width, widths: ws, fallback: `${key}-1280.jpg`, fbw: 1280 };
  }
  fs.writeFileSync(MAN, JSON.stringify(M, null, 1));
  const sz = w => names.map(n => fs.statSync(`${OUT}/bento-${n}-${w}.avif`).size);
  console.log('avif KB @1600:', sz(1600).map(b => Math.round(b / 1024)).join(' '), '| @960:', sz(960).map(b => Math.round(b / 1024)).join(' '));
  if (temp.length) console.log('USING TEMP STAND-INS FOR:', temp.join(', '));
})();
