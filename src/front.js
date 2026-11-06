// Pages liminaires du pack : couverture, mode d'emploi, sommaire (2 pages).
const fs = require('fs');
const path = require('path');
const { typo, CSS, FONTS, FONTS_SYMBOLS, TOTAL, FRONT_PAGES } = require('./template');

const DOMAINS = [
  ['1.0', 'Network Fundamentals', 20],
  ['2.0', 'Network Access', 20],
  ['3.0', 'IP Connectivity', 25],
  ['4.0', 'IP Services', 10],
  ['5.0', 'Security Fundamentals', 15],
  ['6.0', 'Automation & Programmability', 10],
];

const FRONT_CSS = `
.cover { padding-top: 14mm; }
.cover .kicker { font-family: var(--f-title); font-weight: 600; font-size: 8pt; letter-spacing: .04em; text-transform: uppercase; color: var(--ink-2); border-bottom: var(--hair) solid var(--ink); padding-bottom: 1.6mm; display: flex; justify-content: space-between; }
.cover .big { font-family: var(--f-title); font-weight: 700; font-size: 64pt; line-height: .9; letter-spacing: .005em; margin-top: 10mm; }
.cover .exam { font-family: var(--f-title); font-weight: 600; font-size: 30pt; line-height: 1; color: var(--ink-2); }
.cover .sub { font-family: var(--f-title); font-weight: 700; font-size: 20pt; margin-top: 6mm; }
.cover .count { margin-top: 8mm; display: flex; align-items: baseline; gap: 3mm; border-top: var(--hair) solid var(--rule); padding-top: 3mm; }
.cover .count b { font-family: var(--f-title); font-size: 30pt; color: var(--accent); line-height: 1; font-variant-numeric: tabular-nums; }
.cover .count span { font-size: 10pt; color: var(--ink-2); }
table.dom { width: 100%; border-collapse: collapse; margin-top: auto; font-variant-numeric: tabular-nums; }
table.dom th { font-family: var(--f-title); font-weight: 600; font-size: 7pt; letter-spacing: .04em; text-transform: uppercase; color: var(--ink-2); text-align: left; border-bottom: var(--hair) solid var(--ink); padding: 0 1mm 0.8mm; }
table.dom td { border-bottom: var(--hair) solid var(--rule); padding: 1mm; font-size: 9pt; vertical-align: middle; }
table.dom td.n, table.dom th.n { text-align: right; width: 12mm; }
table.dom td.code { font-family: var(--f-title); font-weight: 600; width: 9mm; }
table.dom td.bar { width: 30mm; }
table.dom td.bar i { display: block; height: 2mm; background: var(--ink); }
.cover .edition { margin-top: 4mm; font-size: 8pt; color: var(--ink-2); }
.howto h1 { margin-top: 0; }
.howto h2 { margin-top: 2.6mm; }
.howto p, .howto li { font-size: 9.5pt; }
.howto ol.parts { list-style: none; display: grid; grid-template-columns: 1fr 1fr; column-gap: 4mm; }
.howto ol.parts li { padding-left: 5mm; position: relative; margin-bottom: .6mm; }
.howto ol.parts li b.k { position: absolute; left: 0; font-family: var(--f-title); color: var(--ink-2); }
.howto table.conv { width: 100%; border-collapse: collapse; }
.howto table.conv td { border-bottom: var(--hair) solid var(--rule); padding: .7mm 1mm; font-size: 9pt; vertical-align: top; }
.howto table.conv td:first-child { font-family: var(--f-mono); font-size: 8.5pt; white-space: nowrap; width: 38%; }
.howto .legal { margin-top: auto; font-size: 7.5pt; color: var(--ink-2); border-top: var(--hair) solid var(--rule); padding-top: 1.2mm; }
table.toc { width: 100%; border-collapse: collapse; font-variant-numeric: tabular-nums; }
table.toc tr.d td { font-family: var(--f-title); font-weight: 600; font-size: 7.5pt; letter-spacing: .04em; text-transform: uppercase; border-bottom: var(--hair) solid var(--ink); padding: 2.4mm 1mm .8mm; }
table.toc tr.d td.w { text-align: right; color: var(--ink-2); }
table.toc td { border-bottom: var(--hair) solid var(--rule); padding: .75mm 1mm; font-size: 9pt; }
table.toc td.num { font-family: var(--f-title); font-weight: 700; color: var(--accent); width: 8mm; }
table.toc td.obj { color: var(--ink-2); font-size: 8pt; width: 24mm; }
table.toc td.pg { text-align: right; width: 10mm; font-family: var(--f-title); font-weight: 600; }
`;

const pad = (n) => String(n).padStart(2, '0');

function foot(page) {
  return `<footer class="foot"><span class="t">CCNA 200-301 — Fiches de révision</span><span class="brand" data-brand></span><span class="pg">${page || ''}</span></footer>`;
}

function render(fiches) {
  const byDom = DOMAINS.map(([code, name, w]) => ({ code, name, w, list: fiches.filter((f) => f.domain.startsWith(code)) }));

  const domRows = byDom
    .map((d) => `<tr><td class="code">${d.code}</td><td>${d.name}</td><td class="bar"><i style="width:${d.w * 4}%"></i></td><td class="n">${d.w} %</td><td class="n">${d.list.length}</td></tr>`)
    .join('');

  const cover = `
<section class="page cover">
  <div class="kicker"><span>Examen 200-301 · blueprint v1.1</span><span>Format A5</span></div>
  <div class="big">CCNA</div>
  <div class="exam">200-301</div>
  <div class="sub">Fiches de révision</div>
  <div class="count"><b>${TOTAL}</b><span>fiches recto-verso, alignées sur les six domaines de l'examen et leur pondération</span></div>
  <table class="dom"><thead><tr><th></th><th>Domaine</th><th></th><th class="n">Poids</th><th class="n">Fiches</th></tr></thead><tbody>${domRows}</tbody></table>
  <p class="edition">Édition 2026 · en français</p>
  ${foot('')}
</section>`;

  const howto = `
<section class="page howto">
  <h1>Mode d'emploi</h1>
  <h2>Structure d'une fiche</h2>
  <ol class="parts">
    <li><b class="k">R</b>Bandeau : domaine, objectifs du blueprint, numéro</li>
    <li><b class="k">V</b>Commandes clés, avec le mode IOS requis</li>
    <li><b class="k">R</b>Ce que l'examen attend : le verbe du blueprint</li>
    <li><b class="k">V</b>Pièges d'examen, repérés en vermillon</li>
    <li><b class="k">R</b>L'essentiel : 4 à 6 points</li>
    <li><b class="k">V</b>Auto-test : 3 QCM au format de l'examen</li>
    <li><b class="k">R</b>Schéma légendé</li>
    <li><b class="k">V</b>Repère, puis réponses tête-bêche</li>
  </ol>
  <p style="font-size:8pt;color:var(--ink-2);margin-top:.6mm">R : recto · V : verso. Chaque fiche commence sur une page impaire.</p>
  <h2>Méthode</h2>
  <p>Lire le recto, cacher la fiche, répondre aux trois QCM du verso, puis retourner la feuille pour lire les réponses et leur justification. Revenir sur les pièges la veille de l'examen.</p>
  <h2>Conventions</h2>
  <table class="conv"><tbody>
    <tr><td>R1&gt;  R1#</td><td>mode utilisateur, mode privilégié</td></tr>
    <tr><td>R1(config)#</td><td>configuration globale</td></tr>
    <tr><td>R1(config-if)#</td><td>configuration d'interface (de même : -router, -line, -vlan…)</td></tr>
    <tr><td>VÉRIF.</td><td>commande de vérification <code>show</code> ou équivalent</td></tr>
    <tr><td>192.168.0.0/16, 10.0.0.0/8</td><td>adresses privées (RFC 1918)</td></tr>
    <tr><td>192.0.2.0/24, 198.51.100.0/24, 203.0.113.0/24</td><td>plages de documentation (RFC 5737), jouant le rôle d'adresses publiques</td></tr>
    <tr><td>2001:db8::/32</td><td>préfixe IPv6 de documentation</td></tr>
  </tbody></table>
  <h2>Impression</h2>
  <p>A5 recto-verso, retournement bord long ; ou deux pages par feuille A4 paysage. Le PDF est vectoriel : texte net à toute taille, lisible aussi sur téléphone.</p>
  <p class="legal">Contenu fondé sur le blueprint public de l'examen Cisco CCNA 200-301 v1.1. Cisco, CCNA, IOS, Catalyst et Meraki sont des marques de Cisco Systems, Inc. Document indépendant, ni produit ni approuvé par Cisco.</p>
  ${foot(2)}
</section>`;

  const tocPage = (doms, page, title) => {
    const rows = doms
      .map((d) => `<tr class="d"><td colspan="3">${d.code} ${d.name}</td><td class="w">${d.w} %</td></tr>` +
        d.list.map((f) => `<tr><td class="num">${pad(f.num)}</td><td>${f.title}</td><td class="obj">${f.objectives}</td><td class="pg">${FRONT_PAGES + 2 * f.num - 1}</td></tr>`).join(''))
      .join('');
    return `
<section class="page toc">
  ${title ? '<h1>Sommaire</h1>' : '<div style="height:2mm"></div>'}
  <table class="toc"><tbody>${rows}</tbody></table>
  ${foot(page)}
</section>`;
  };

  const body = cover + howto + tocPage(byDom.slice(0, 2), 3, true) + tocPage(byDom.slice(2), 4, false);

  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>CCNA 200-301 — Fiches de révision</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="${FONTS_SYMBOLS}">
<style>
${CSS}
${FRONT_CSS}
</style>
</head>
<body>
${typo(body)}
</body>
</html>`;
}

module.exports = { render, DOMAINS };
