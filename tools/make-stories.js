// story posters (AVIF/WebP/JPG) + media copy into the site
const fs = require('fs'), sharp = require('sharp');
const IG = '/home/claude/assets-src/video/ig', SITE = '/home/claude/site';
const MF = '/home/claude/tools/img-manifest.json', M = JSON.parse(fs.readFileSync(MF, 'utf8'));
fs.mkdirSync(`${SITE}/media`, { recursive: true });
(async () => {
  for (const k of ['a1', 'a2', 'b1', 'b2']) {
    const name = `story-${k}`, widths = [240, 480];
    for (const w of widths) {
      const s = () => sharp(`${IG}/${k}-poster.png`).resize(w, Math.round(w * 16 / 9), { fit: 'cover' });
      await s().avif({ quality: 50, effort: 6 }).toFile(`${SITE}/img/${name}-${w}.avif`);
      await s().webp({ quality: 72 }).toFile(`${SITE}/img/${name}-${w}.webp`);
    }
    await sharp(`${IG}/${k}-poster.png`).resize(240, 427).jpeg({ quality: 72, mozjpeg: true }).toFile(`${SITE}/img/${name}-240.jpg`);
    M[name] = { ratio: 9 / 16, widths, fallback: `${name}-240.jpg`, fbw: 240 };
    fs.copyFileSync(`${IG}/${k}.mp4`, `${SITE}/media/${name}.mp4`);
  }
  for (const k of ['a1', 'b1']) fs.copyFileSync(`${IG}/${k}-prev.mp4`, `${SITE}/media/story-${k}-prev.mp4`);
  fs.writeFileSync(MF, JSON.stringify(M));
  console.log(fs.readdirSync(`${SITE}/media`).map(f => f + ' ' + fs.statSync(`${SITE}/media/${f}`).size).join('\n'));
})();
