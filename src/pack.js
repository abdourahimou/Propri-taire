// Assemble le pack : pages liminaires + 40 fiches, rendues en un seul PDF.
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const { render } = require('./front');
const { render: renderFiche } = require('./template');

const ROOT = path.join(__dirname, '..');
const PDF_DIR = path.join(ROOT, 'dist', 'pdf');
const HTML_DIR = path.join(ROOT, 'dist', 'html');
const OUT = path.join(ROOT, 'dist', 'CCNA-200-301-Fiches-de-revision.pdf');

(async () => {
  const dir = path.join(__dirname, 'fiches');
  const fiches = fs.readdirSync(dir).sort().map((f) => require(path.join(dir, f)));
  const nums = fiches.map((f) => f.num);
  for (let n = 1; n <= 40; n++) if (!nums.includes(n)) throw new Error(`fiche ${n} manquante`);
  // Un seul document HTML pour tout le pack : les polices ne sont intégrées qu'une fois.
  const frontHtml = render(fiches);
  const bodyOf = (h) => h.slice(h.indexOf('<body>') + 6, h.lastIndexOf('</body>'));
  const all = fiches.map((f) => bodyOf(renderFiche(f))).join('\n');
  const htmlPath = path.join(HTML_DIR, 'pack.html');
  fs.writeFileSync(htmlPath, frontHtml.replace('</body>', all + '\n</body>'));
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 560, height: 794 } });
  await page.goto('file://' + htmlPath, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  const over = await page.evaluate(() =>
    [...document.querySelectorAll('.page')].map((p, i) => {
      const limit = p.getBoundingClientRect().bottom - 13 * 3.7795;
      const kids = [...p.children].filter((c) => !c.classList.contains('foot'));
      return { page: i + 1, spare_mm: +((limit - Math.max(...kids.map((c) => c.getBoundingClientRect().bottom))) / 3.7795).toFixed(1) };
    })
  );
  over.filter((o) => o.page <= 4 || o.spare_mm < 0).forEach((o) => console.log(`p${o.page} : ${o.spare_mm} mm${o.spare_mm < 0 ? '  <-- DÉBORDEMENT' : ''}`));
  await page.pdf({ path: OUT, preferCSSPageSize: true, printBackground: true });
  if (process.env.PNG_DIR) {
    const els = await page.$$('.page');
    for (let i = 0; i < 4; i++) await els[i].screenshot({ path: path.join(process.env.PNG_DIR, `front-p${i + 1}.png`) });
  }
  await browser.close();

  console.log('pack :', path.relative(ROOT, OUT), '-', over.length, 'pages');
})();
