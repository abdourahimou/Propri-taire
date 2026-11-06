Seidou Hama Abdou Rahimou

Ingénieur Réseaux, Systèmes & Cybersécurité

Domaines

  Network Infrastructure
  Cybersecurity
  Firewall
  Systems Administration
  IT Documentation
  IT Training

Technologies

Cisco
Fortinet
Palo Alto
Windows Server
Linux
Veeam
Ubiquiti


Projects

network-lab

fortigate-lab

windows-server-lab

cybersecurity-lab

network-audit-template

infrastructure-documentation


Certifications

…

Contact

LinkedIn : https://www.linkedin.com/in/abdou-rahimou-seidou-hama-0431081b9
Portfolio
Email : seidouhama2016@gmail.com
## Fiches CCNA 200-301 v1.1

Pack de 40 fiches de révision (A5, 2 pages par fiche), en français.

- **Pack complet** : `dist/CCNA-200-301-Fiches-de-revision.pdf` (couverture, mode d'emploi, sommaire, 40 fiches ; 84 pages)
- Fiches seules : `dist/pdf/fiche-NN.pdf` · HTML autonomes : `dist/html/fiche-NN.html`
- Plan et répartition par domaine : `docs/plan-40-fiches.md`

### Régénérer

```
node src/build.js          # toutes les fiches (ou : node src/build.js 05 23)
node src/pack.js           # pages liminaires + assemblage du pack
```

Le script signale tout débordement de page. Prérequis : Node.js, Playwright avec Chromium, `pdfunite` (poppler), accès à Google Fonts.

### Sources

- `src/fiches/NN.js` : contenu d'une fiche (texte, schéma SVG, commandes, pièges, QCM)
- `src/template.js` : gabarit 2 pages et typographie française
- `src/fiche.css` : charte graphique
- `src/svg.js` : symboles réseau des schémas
- `src/front.js`, `src/pack.js` : pages liminaires et assemblage
