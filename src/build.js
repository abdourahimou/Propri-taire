// Génère HTML autonome + PDF vectoriel pour chaque fiche.
// Usage : node src/build.js [05 23 34 ...]
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const { render } = require('./template');

const ROOT = path.join(__dirname, '..');
const HTML_DIR = path.join(ROOT, 'dist', 'html');
const PDF_DIR = path.join(ROOT, 'dist', 'pdf');
const PNG_DIR = process.env.PNG_DIR; // aperçus facultatifs

(async () => {
  fs.mkdirSync(HTML_DIR, { recursive: true });
  fs.mkdirSync(PDF_DIR, { recursive: true });
  const ids = process.argv.slice(2).length
    ? process.argv.slice(2)
    : fs.readdirSync(path.join(__dirname, 'fiches')).map((f) => f.replace('.js', ''));

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 560, height: 794 } });
  let failed = false;

  for (const id of ids.sort()) {
    const f = require(path.join(__dirname, 'fiches', id + '.js'));
    const name = `fiche-${String(f.num).padStart(2, '0')}`;
    const htmlPath = path.join(HTML_DIR, name + '.html');
    fs.writeFileSync(htmlPath, render(f));

    await page.goto('file://' + htmlPath, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);

    // Contrôle : aucun débordement de contenu hors de la page A5.
    const over = await page.evaluate(() =>
      [...document.querySelectorAll('.page')].map((p, i) => {
        const limit = p.getBoundingClientRect().bottom - 13 * 3.7795; // marge basse 13 mm
        const last = [...p.children].filter((c) => !c.classList.contains('foot'));
        const bottom = Math.max(...last.map((c) => c.getBoundingClientRect().bottom));
        return { page: i + 1, spare_mm: +((limit - bottom) / 3.7795).toFixed(1) };
      })
    );
    const fonts = await page.evaluate(() =>
      [...document.fonts].filter((x) => x.status === 'loaded').map((x) => x.family.replace(/"/g, '') + ' ' + x.weight)
    );
    for (const o of over) {
      const flag = o.spare_mm < 0 ? '  <-- DÉBORDEMENT' : '';
      if (o.spare_mm < 0) failed = true;
      console.log(`${name} p${o.page} : marge libre ${o.spare_mm} mm${flag}`);
    }
    console.log(`  polices : ${[...new Set(fonts)].join(', ')}`);

    await page.pdf({ path: path.join(PDF_DIR, name + '.pdf'), preferCSSPageSize: true, printBackground: true });
    if (PNG_DIR) {
      fs.mkdirSync(PNG_DIR, { recursive: true });
      const els = await page.$$('.page');
      for (let i = 0; i < els.length; i++) await els[i].screenshot({ path: path.join(PNG_DIR, `${name}-p${i + 1}.png`) });
    }
  }
  await browser.close();
  if (failed) process.exitCode = 1;
})();
