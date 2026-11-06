const S = require('../svg');

// Échec d'autonégociation + coupes des supports (cœurs à l'échelle).
function schema() {
  let g = '';
  const y = 8;
  g += S.sw(14, y);
  g += S.sw(110, y);
  g += S.line(19.5, y, 104.5, y);
  g += S.text(14, y - 4, 'SW1', { anchor: 'middle', size: 2.4, bold: true });
  g += S.text(110, y - 4, 'SW2', { anchor: 'middle', size: 2.4, bold: true });
  g += S.text(21, y - 1.4, 'speed auto · duplex auto', { mono: true, size: 2 });
  g += S.text(103, y - 1.4, 'speed 100 · duplex full', { anchor: 'end', mono: true, size: 2 });
  g += S.text(14, y + 6, 'détecte 100 Mbit/s', { anchor: 'middle', size: 2.1 });
  g += S.text(14, y + 8.8, 'duplex : half', { anchor: 'middle', size: 2.1, acc: true });
  g += S.text(14, y + 11.6, 'late collisions', { anchor: 'middle', size: 2.1, c2: true });
  g += S.text(110, y + 6, 'reste en full', { anchor: 'middle', size: 2.1 });
  g += S.text(110, y + 8.8, 'CRC, runts', { anchor: 'middle', size: 2.1, c2: true });
  g += S.text(62, y + 3.6, 'lien up/up, débit dégradé', { anchor: 'middle', size: 2.2, acc: true });
  // séparateur
  g += S.line(2, 23, 122, 23, { color: S.RULE });
  // coupes : gaine 125 µm (fibres) à l'échelle 1 µm = 0,1 mm
  const cy = 34;
  const fiber = (x, core, l1, l2) => {
    let t = `<circle cx="${x}" cy="${cy}" r="6.25" fill="${S.PAPER}" stroke="${S.INK}" stroke-width="${S.SW}"/>`;
    t += `<circle cx="${x}" cy="${cy}" r="${core / 20}" fill="${S.INK}"/>`;
    t += S.text(x + 9, cy - 1, l1, { size: 2.3, bold: true });
    t += S.text(x + 9, cy + 2, l2, { size: 2.1, c2: true });
    return t;
  };
  g += fiber(48, 50, 'Multimode', 'cœur 50 ou 62,5 µm');
  g += S.text(57, cy + 5, 'centaines de mètres', { size: 2.1, c2: true });
  g += fiber(92, 9, 'Monomode', 'cœur ≈ 9 µm');
  g += S.text(101, cy + 5, 'laser, km', { size: 2.1, c2: true });
  // UTP : 4 paires
  g += `<circle cx="10" cy="${cy}" r="6.25" fill="${S.PAPER}" stroke="${S.INK}" stroke-width="${S.SW}"/>`;
  for (const [dx, dy] of [[-2.4, -2.4], [2.4, -2.4], [-2.4, 2.4], [2.4, 2.4]]) {
    g += `<circle cx="${10 + dx - 0.8}" cy="${cy + dy}" r="0.8" fill="none" stroke="${S.INK}" stroke-width="0.2"/>`;
    g += `<circle cx="${10 + dx + 0.8}" cy="${cy + dy}" r="0.8" fill="none" stroke="${S.INK}" stroke-width="0.2"/>`;
  }
  g += S.text(19, cy - 1, 'Cuivre UTP', { size: 2.3, bold: true });
  g += S.text(19, cy + 2, '4 paires, RJ-45', { size: 2.1, c2: true });
  g += S.text(19, cy + 5, '100 m max', { size: 2.1, c2: true });
  return S.svg(124, 42, g, 'Duplex mismatch et types de câbles');
}

module.exports = {
  num: 3,
  domain: '1.0 Network Fundamentals',
  objectives: '1.3 · 1.4',
  title: 'Câblage et défauts d\'interface',
  attend:
    "Comparer fibre monomode, fibre multimode et cuivre, puis identifier sur une interface les collisions, les erreurs et les discordances de duplex ou de vitesse.",
  essentiel: [
    "Cuivre UTP : 100 m maximum par segment, connecteur RJ-45. Câble droit : PC ou routeur vers switch. Croisé : switch–switch, routeur–routeur, PC–routeur. L'Auto-MDIX corrige un mauvais choix de câble.",
    "Fibre multimode (MMF) : cœur de 50 ou 62,5 µm, courtes distances. Monomode (SMF) : cœur d'environ 9 µm, laser, plusieurs kilomètres. La fibre ignore les perturbations électromagnétiques ; modules SFP / SFP+.",
    "Média partagé (hub) : half-duplex, CSMA/CD, collisions normales. Point à point (switch) : full-duplex, aucune collision possible.",
    "Compteurs de <code>show interfaces</code> : runts (&lt; 64 octets), giants (&gt; 1518 octets), CRC (trame corrompue : câble, interférences), collisions, late collisions (après les 64 premiers octets).",
    "Autonégociation : si l'autre côté est forcé, l'interface détecte la vitesse mais pas le duplex ; elle passe alors en half à 10 ou 100 Mbit/s, en full à 1 Gbit/s. Vitesses différentes : lien down.",
    "Duplex mismatch : côté half, collisions et late collisions ; côté full, CRC et runts. Le lien reste up.",
  ],
  schema: schema(),
  caption:
    "En haut, SW1 en autonégociation face à SW2 forcé : la vitesse est détectée, le duplex retombe en half. En bas, coupes à l'échelle : gaine de 125 µm, cœur noir.",
  commandes: [
    ['SW1(config-if)# speed 100', 'Force la vitesse'],
    ['SW1(config-if)# duplex full', 'Force le duplex'],
    ['SW1(config-if)# speed auto', 'Rétablit l\'autonégociation (idem <code>duplex auto</code>)'],
    ['SW1# show interfaces g0/1', 'CRC, runts, collisions', true],
    ['SW1# show interfaces status', 'Vitesse et duplex (a- = négocié)', true],
    ['SW1# show interfaces counters errors', 'Erreurs par port', true],
    ['SW1# clear counters g0/1', 'Remet les compteurs à zéro'],
  ],
  pieges: [
    "Un duplex mismatch laisse l'interface up/up : seuls les compteurs (late collisions, CRC) le révèlent.",
    "Des collisions sur un lien full-duplex signalent une anomalie : CSMA/CD y est désactivé.",
    "La fibre la plus fine va le plus loin : monomode pour les kilomètres, multimode pour le bâtiment.",
  ],
  qcm: [
    {
      q: 'SW1 est en autonégociation, SW2 forcé en 100/full sur un lien FastEthernet. État de SW1 ?',
      o: ['100 Mbit/s, full', '100 Mbit/s, half', 'Lien down', '10 Mbit/s, half'],
      four: true,
      a: 'B',
      why: 'Vitesse détectée (100) ; duplex non négocié : half par défaut à 100 Mbit/s.',
    },
    {
      q: 'Quel compteur augmente du côté half-duplex d\'un duplex mismatch ?',
      o: ['Giants', 'Output drops', 'Late collisions', 'Throttles'],
      four: true,
      a: 'C',
      why: 'Le côté half détecte des collisions tardives ; le côté full compte des CRC.',
    },
    {
      q: 'Deux bâtiments sont distants de 8 km. Quel support utiliser ?',
      o: ['Fibre monomode', 'UTP Cat6A', 'Fibre multimode', 'UTP Cat5e'],
      four: true,
      a: 'A',
      why: 'Seule la monomode couvre plusieurs kilomètres ; l\'UTP plafonne à 100 m.',
    },
  ],
  mnemo: 'Half voit des late collisions, full voit des CRC.',
};
