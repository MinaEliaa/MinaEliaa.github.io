// project card images for D360 Bank (website frame) and AxisPay (3 phone screens)
const fs = require('fs'), sharp = require('sharp');
const P = '/home/claude/assets-src/proj', IMG = '/home/claude/site/img', MF = '/home/claude/tools/img-manifest.json';
const M = JSON.parse(fs.readFileSync(MF, 'utf8'));
const job = async (src, name, widths, fbw, ratio) => {
  for (const w of widths) {
    await sharp(src).resize(w).avif({ quality: 60, effort: 6 }).toFile(`${IMG}/${name}-${w}.avif`);
    await sharp(src).resize(w).webp({ quality: 82 }).toFile(`${IMG}/${name}-${w}.webp`);
  }
  await sharp(src).resize(fbw).png({ palette: true, quality: 90 }).toFile(`${IMG}/${name}-${fbw}.png`);
  M[name] = { ratio, widths, fallback: `${name}-${fbw}.png`, fbw };
};
(async () => {
  await job(`${P}/d360-site.png`, 'p-d360', [280, 560, 840], 560, 865 / 840);
  for (const k of [1, 2, 3]) await job(`${P}/axis-${k}.png`, `p-axispay-${k}`, [130, 260, 390], 260, 845 / 390);
  fs.writeFileSync(MF, JSON.stringify(M)); console.log('ok');
})();
