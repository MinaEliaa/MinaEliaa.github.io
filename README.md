# Source for minaeliaa.github.io

`main` holds the built site that GitHub Pages serves. This branch holds what builds it.

- `src/styles.css`, `src/main.js` — styles and behaviour
- `tools/build.js` — generates index.html / 404.html (paths assume /home/claude/{src,tools,site,assets-src})
- `tools/images.js` — builds AVIF/WebP/JPG/PNG variants from `assets-src/img`
- `assets-src/` — source images, extracted SVG icons, original + subset fonts

Plans section: archived. Set `SHOW_PLANS = true` in tools/build.js and re-add the nav/footer links to bring it back.
Full v1 site with Plans (exact Framer replica): branch `archive/v1.0-framer-replica`.

Build: `cd tools && npm i puppeteer-core sharp html-minifier-terser terser lighthouse && node images.js && node build.js`
