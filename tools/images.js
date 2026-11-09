// Build responsive AVIF/WebP (+ PNG/JPG fallback) for every image the site uses.
const sharp = require('sharp');
const fs = require('fs');
const SRC = '/home/claude/assets-src/img';
const OUT = '/home/claude/site/img';
fs.mkdirSync(OUT, { recursive: true });

// name: [source file, [widths], fallback format, fit?]
const jobs = {
  avatar: ['a3beps7a5KD2V6j8R1cS2hOZYQ4.png', [68, 136, 204], 'jpg'],
  'screen-wish': ['6asTJvPUQwsygssGyh6m16Vlk.webp', [218], 'jpg'],
  'screen-profily': ['1cB9HgWCh3EfynZqv4acTIHtHc.webp', [218], 'jpg'],
  'screen-masroofi': ['tjttFNDx38Ha7gYzQukHayvTWE.webp', [218], 'jpg'],
  'screen-douq': ['2VlwRHvKlh6f9LjpqkMcjwpDwoc.webp', [457], 'jpg'],
  'screen-scouty': ['uWCT0fCJWEZ5xIKVhlpFVicRDE.webp', [218], 'jpg'],
  'screen-hozaan': ['45xAvXcpWJRst3XZygMvQKRGw.webp', [218], 'jpg'],
  'screen-dentinnova': ['9QiDVAMSexZKRxGiB2pFKoSVQk.png', [456, 912], 'jpg'],
  'screen-eyas': ['nExWKWwfDMmnE2Tkf0NZZjVQNs.webp', [218], 'jpg'],
  'screen-qatar': ['nbqE89UvkdvbN5LCbo3mybTU.webp', [218], 'jpg'],
  aurora: ['sFaUdvE6kNoWxHNSa8my6dPHJj0.png', [768, 1152, 1536], 'jpg'],
  'glass-card': ['SxJS9wCc93CYozwQBXCTSsGvhVk.png', [360, 720, 1029], 'png'],
  'custom-plan': ['eEWfPEKvevQAaxklYhwcXTElQ.png', [48, 96, 144], 'png'],
  'mina-small': ['df7TlUaXIG3sktLAajfmQUGIAM.jpg', [24, 48, 72], 'jpg'],
  'p-wish-1': ['xuCZj1VCxxIzuhkevAmUbAiR0.png', [130, 260, 390], 'png'],
  'p-wish-2': ['8n7wDp0VWOgDauVXA7RN68oee4.png', [130, 260, 390], 'png'],
  'p-wish-3': ['rHSQ0lvasHUnZDlEbZHl46dnZ1M.png', [130, 260, 390], 'png'],
  'p-eyas-1': ['8eGR8nNxHjuOUc0ZWz0XQv6qdI.png', [130, 260, 390], 'png'],
  'p-eyas-2': ['osvLwNaso047x2TPBCyaww4euIY.png', [130, 260, 390], 'png'],
  'p-eyas-3': ['7D8Gz2iYaMPOq2v7oYx6fcB6iJE.png', [130, 260, 390], 'png'],
  'p-hozaan-1': ['ErBeTfViuX9lejio3t7neX0MGk.png', [130, 260, 390], 'png'],
  'p-hozaan-2': ['oPKc3hgHVBrfbY4opkHXh2u4o9M.png', [130, 260, 390], 'png'],
  'p-hozaan-3': ['1n3ci4IbViNkFsThSSD0Kz0MM.png', [130, 260, 390], 'png'],
  'p-masroofi-1': ['N52faLbGZnA8wAypMzZRpzK7QbA.png', [130, 260, 390], 'png'],
  'p-masroofi-2': ['TFAKfJAjPlRP6IfFQG9cfP6Da4w.png', [130, 260, 390], 'png'],
  'p-masroofi-3': ['mQnvimRPddykINBolNdZhGLV4.png', [130, 260, 390], 'png'],
  'p-scouty-1': ['O0uxQ4pFBBfsFiJ4DK6HbJaaSA4.png', [130, 260, 390], 'png'],
  'p-scouty-2': ['ZopHb2ILit8yTpbBikCd4eTsN4.png', [130, 260, 390], 'png'],
  'p-scouty-3': ['8UOZ8TgAFb1nUJyw8v9xPj8CSa8.png', [130, 260, 390], 'png'],
  'p-instapay-1': ['ekpYWMjC0byAdjQHG1oW3slZPbQ.png', [130, 260, 390], 'png'],
  'p-instapay-2': ['hGx9f4rzyoQowr6edLVbijY.png', [130, 260, 390], 'png'],
  'p-instapay-3': ['Uf0W9tUVIS0KU7A6JOdwRywW7Q.png', [130, 260, 390], 'png'],
  'p-douq': ['OS6QImQNxd8ZzFNwDvWb9CATfyQ.png', [280, 560, 840], 'png'],
  'p-dentinnova': ['jEAu9EAlHDGT6Jo1XWKLSqRmjtY.png', [280, 560, 840], 'png'],
};

(async () => {
  const manifest = {};
  for (const [name, [file, widths, fb]] of Object.entries(jobs)) {
    const src = `${SRC}/${file}`;
    const meta = await sharp(src).metadata();
    const ratio = meta.height / meta.width;
    manifest[name] = { ratio, widths: [] };
    for (const w0 of widths) {
      const w = Math.min(w0, meta.width);
      const base = sharp(src).resize({ width: w, withoutEnlargement: true });
      await base.clone().avif({ quality: 55, effort: 6 }).toFile(`${OUT}/${name}-${w}.avif`);
      await base.clone().webp({ quality: 78, effort: 6 }).toFile(`${OUT}/${name}-${w}.webp`);
      manifest[name].widths.push(w);
    }
    // fallback at the smallest listed width (or 2x for tiny icons)
    const fw = Math.min(widths.length > 1 ? widths[1] : widths[0], meta.width);
    const fbPipe = sharp(src).resize({ width: fw, withoutEnlargement: true });
    if (fb === 'jpg') await fbPipe.flatten({ background: '#ffffff' }).jpeg({ quality: 78, mozjpeg: true }).toFile(`${OUT}/${name}-${fw}.jpg`);
    else await fbPipe.png({ compressionLevel: 9, palette: true, quality: 85 }).toFile(`${OUT}/${name}-${fw}.png`);
    manifest[name].fallback = `${name}-${fw}.${fb}`;
    manifest[name].fbw = fw;
  }
  // social / icons
  await sharp(`${SRC}/og.png`).resize(1200, 630).jpeg({ quality: 82, mozjpeg: true }).toFile('/home/claude/site/og.jpg');
  await sharp(`${SRC}/fav.png`).resize(32, 32).png().toFile('/home/claude/site/favicon-32.png');
  await sharp(`${SRC}/fav.png`).resize(48, 48).png().toFile('/home/claude/site/favicon-48.png');
  await sharp(`${SRC}/apple.png`).resize(180, 180).png().toFile('/home/claude/site/apple-touch-icon.png');
  await sharp(`${SRC}/apple.png`).resize(192, 192).png().toFile('/home/claude/site/icon-192.png');
  await sharp(`${SRC}/apple.png`).resize(512, 512, { kernel: 'lanczos3' }).png().toFile('/home/claude/site/icon-512.png');
  fs.writeFileSync('/home/claude/tools/img-manifest.json', JSON.stringify(manifest, null, 1));
  let total = 0; for (const f of fs.readdirSync(OUT)) total += fs.statSync(`${OUT}/${f}`).size;
  console.log('files', fs.readdirSync(OUT).length, 'bytes', total);
})();
