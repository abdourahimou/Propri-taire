// Gabarit HTML d'une fiche (2 pages A5).
const fs = require('fs');
const path = require('path');

const CSS = fs.readFileSync(path.join(__dirname, 'fiche.css'), 'utf8');
const FONTS =
  'https://fonts.googleapis.com/css2?family=Archivo+Narrow:wght@600;700' +
  '&family=Source+Sans+3:ital,wght@0,400;0,600;0,700;1,400' +
  '&family=JetBrains+Mono:wght@400;600&display=swap';
// Symboles absents du sous-ensemble latin servi par défaut (→ ↔ ≈ ☑ ☐) :
// même familles, limitées à ces caractères (Google ajoute l'unicode-range).
const FONTS_SYMBOLS =
  'https://fonts.googleapis.com/css2?family=Archivo+Narrow:wght@600;700' +
  '&family=Source+Sans+3:wght@400;600;700&family=JetBrains+Mono:wght@400;600' +
  '&text=%E2%86%92%E2%86%94%E2%89%88%E2%98%91%E2%98%90&display=swap';

const TOTAL = 40;
const FRONT_PAGES = 4; // couverture, mode d'emploi, sommaire (2 pages)

const NNBSP = ' '; // espace fine insécable
const NBSP = ' ';

// Typographie française sur le texte courant, jamais dans <code>, balises ou SVG.
function typo(html) {
  return html
    .split(/(<code[\s\S]*?<\/code>|<td class="c">[\s\S]*?<\/td>|<svg[\s\S]*?<\/svg>|<[^>]+>)/)
    .map((part, i) => {
      if (i % 2 === 1) return part;
      return part
        .replace(/'/g, '’')
        .replace(/ :/g, NBSP + ':')
        .replace(/ ([;!?])/g, NNBSP + '$1')
        .replace(/« /g, '«' + NNBSP)
        .replace(/ »/g, NNBSP + '»')
        .replace(/ᵉ/g, '<sup>e</sup>')
        .replace(/⁶/g, '<sup>6</sup>');
    })
    .join('');
}

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Commande IOS : « prompt » en encre secondaire, commande en encre principale.
function cmdCell(c) {
  const m = c.match(/^(\S+?[>#]|[A-Z]:\\>|\$)\s(.*)$/);
  if (!m) return esc(c);
  return `<span class="p">${esc(m[1])}</span> ${esc(m[2])}`;
}

const pad = (n) => String(n).padStart(2, '0');

function band(f, cont) {
  return `<header class="band${cont ? ' cont' : ''}">
    <span class="dom">${f.domain}</span>
    <span class="obj">${f.objectives}${cont ? ' — suite' : ''}</span>
    <span class="num">${pad(f.num)}<small>/${TOTAL}</small></span>
  </header>`;
}

function foot(page) {
  return `<footer class="foot">
    <span class="t">CCNA 200-301 — Fiches de révision</span>
    <span class="brand" data-brand></span>
    <span class="pg">${page}</span>
  </footer>`;
}

function render(f) {
  const p1 = FRONT_PAGES + 2 * f.num - 1;
  const ess = f.essentiel.map((e) => `<li>${e}</li>`).join('\n');
  const cmds = f.commandes
    .map(([c, r, show]) => `<tr${show ? ' class="show"' : ''}><td class="c">${cmdCell(c)}</td><td class="role">${r}</td></tr>`)
    .join('\n');
  const pieges = f.pieges.map((p) => `<li>${p}</li>`).join('\n');
  const L = ['A', 'B', 'C', 'D'];
  const qcm = f.qcm
    .map((q) => `<li>${q.q}<ul class="o${q.one ? ' one' : q.four ? ' four' : ''}">${q.o
      .map((o, i) => `<li><span class="l">${L[i]}.</span>${o}</li>`).join('')}</ul></li>`)
    .join('\n');
  const rep = f.qcm
    .map((q, i) => `<p><span class="a">${i + 1}&nbsp;${q.a}</span> ${q.why}</p>`)
    .join('');

  const body = `
<section class="page recto">
  ${band(f)}
  <h1>${f.title}</h1>
  <div class="attend"><span class="lbl">Ce que l'examen attend</span><p>${f.attend}</p></div>
  <section><h2><span class="n">01</span>L'essentiel</h2><ol class="ess">${ess}</ol></section>
  <figure class="schema">${f.schema}<figcaption><b>Fig. ${pad(f.num)}</b>${f.caption}</figcaption></figure>
  ${foot(p1)}
</section>
<section class="page verso">
  ${band(f, true)}
  <section class="cmd" style="margin-top:2.4mm"><h2><span class="n">02</span>Commandes clés</h2>
    <table class="cmd"><thead><tr><th>Commande</th><th>Rôle</th></tr></thead><tbody>${cmds}</tbody></table>
  </section>
  <section class="pieges"><h2><span class="n">03</span>Pièges d'examen</h2><ol>${pieges}</ol></section>
  <section class="qcm"><h2><span class="n">04</span>Auto-test</h2><ol class="q">${qcm}</ol></section>
  ${f.mnemo ? `<p class="mnemo"><span class="lbl">Repère</span>${f.mnemo}</p>` : ''}
  <div class="reponses">${rep.replace('<p>', '<p><span class="lbl">Réponses</span>')}</div>
  ${foot(p1 + 1)}
</section>`;

  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Fiche ${pad(f.num)}/${TOTAL} — ${f.titlePlain || f.title}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="${FONTS_SYMBOLS}">
<style>
${CSS}
</style>
</head>
<body>
${typo(body)}
</body>
</html>`;
}

module.exports = { render, typo, TOTAL, FRONT_PAGES, FONTS, FONTS_SYMBOLS, CSS };
