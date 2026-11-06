// Assemble le pack : pages liminaires + 40 fiches, en un seul PDF.
// Prérequis : node src/build.js (génère dist/pdf/fiche-NN.pdf).
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { chromium } = require('playwright');
const { render } = require('./front');

const ROOT = path.join(__dirname, '..');
const PDF_DIR = path.join(ROOT, 'dist', 'pdf');
const HTML_DIR = path.join(ROOT, 'dist', 'html');
const OUT = path.join(ROOT, 'dist', 'CCNA-200-301-Fiches-de-revision.pdf');

(async () => {
  const dir = path.join(__dirname, 'fiches');
  const fiches = fs.readdirSync(dir).sort().map((f) => require(path.join(dir, f)));
  const nums = fiches.map((f) => f.num);
  for (let n = 1; n <= 40; n++) if (!nums.includes(n)) throw new Error(`fiche ${n} manquante`);
  for (const f of fiches) {
    const p = path.join(PDF_DIR, `fiche-${String(f.num).padStart(2, '0')}.pdf`);
    if (!fs.existsSync(p)) throw new Error(`${p} absent : lancer node src/build.js`);
  }

  const htmlPath = path.join(HTML_DIR, 'pages-liminaires.html');
  fs.writeFileSync(htmlPath, render(fiches));
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
  over.forEach((o) => console.log(`liminaire p${o.page} : ${o.spare_mm} mm${o.spare_mm < 0 ? '  <-- DÉBORDEMENT' : ''}`));
  const front = path.join(PDF_DIR, 'pages-liminaires.pdf');
  await page.pdf({ path: front, preferCSSPageSize: true, printBackground: true });
  if (process.env.PNG_DIR) {
    const els = await page.$$('.page');
    for (let i = 0; i < els.length; i++) await els[i].screenshot({ path: path.join(process.env.PNG_DIR, `front-p${i + 1}.png`) });
  }
  await browser.close();

  const parts = [front, ...fiches.map((f) => path.join(PDF_DIR, `fiche-${String(f.num).padStart(2, '0')}.pdf`))];
  execFileSync('pdfunite', [...parts, OUT]);
  console.log('pack :', path.relative(ROOT, OUT));
})();
