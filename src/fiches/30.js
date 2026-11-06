const S = require('../svg');

// Chaîne QoS d'un saut + policing vs shaping.
function schema() {
  let g = '';
  const steps = [[14, 'Classifier'], [38, 'Marquer'], [62, 'Files']];
  for (const [x, t] of steps) g += S.box(x, 6, 20, 6, t, { size: 2.3, bold: true });
  g += S.line(24, 6, 27.6, 6, { end: 'ah', w: 0.25 }) + S.line(48, 6, 51.6, 6, { end: 'ah', w: 0.25 });
  g += S.text(14, 12, 'ACL, NBAR, DSCP reçu', { anchor: 'middle', size: 1.9, c2: true });
  g += S.text(38, 12, 'CoS (L2), DSCP (L3)', { anchor: 'middle', size: 1.9, c2: true });
  // files
  g += S.line(72, 6, 76, 6, { end: 'ah', w: 0.25 });
  const q = [[2.4, 'LLQ · voix EF', true], [6, 'CBWFQ · vidéo AF41', false], [9.6, 'CBWFQ · défaut', false]];
  for (const [dy, t, p] of q) {
    g += S.rect(78, dy - 1.2, 26, 2.6, { fill: p ? S.FILL : S.PAPER });
    g += S.text(79, dy + 0.7, t, { size: 1.85, bold: p });
  }
  g += S.line(104, 6, 110, 6, { end: 'ah', w: 0.25 });
  g += S.text(111, 7, 'sortie', { size: 2.1 });
  g += S.text(91, 14, 'ordonnanceur : LLQ servie en premier', { anchor: 'middle', size: 1.9, c2: true });
  // graphes
  const graph = (x0, title, shaped) => {
    let s = S.text(x0, 21.4, title, { size: 2.3, bold: true });
    const y0 = 42, h = 16, w = 52, lim = y0 - 9;
    s += S.line(x0, y0, x0 + w, y0) + S.line(x0, y0, x0, y0 - h);
    s += S.line(x0, lim, x0 + w, lim, { dash: '0.8 0.6', color: S.ACC, w: 0.25 });
    s += S.text(x0 + w, lim - 0.8, 'débit contractuel', { anchor: 'end', size: 1.8, acc: true });
    const pts = [[0, 7], [6, 7], [8, 13], [16, 13], [18, 5], [24, 5], [26, 14], [34, 14], [36, 6], [44, 6], [46, 8], [52, 8]];
    const P = (arr) => arr.map(([a, b]) => `${x0 + a},${y0 - b}`).join(' ');
    s += `<polyline points="${P(pts)}" fill="none" stroke="${S.RULE}" stroke-width="0.4"/>`;
    const out = shaped
      ? [[0, 7], [6, 7], [8, 9], [24, 9], [26, 9], [40, 9], [44, 7.5], [52, 7]]
      : pts.map(([a, b]) => [a, Math.min(b, 9)]);
    s += `<polyline points="${P(out)}" fill="none" stroke="${S.INK}" stroke-width="0.35"/>`;
    s += S.text(x0, y0 + 3.2, shaped ? 'excédent mis en file, puis émis plus tard' : 'excédent rejeté (ou re-marqué)', { size: 1.9, c2: true });
    return s;
  };
  g += graph(4, 'Policing', false);
  g += graph(68, 'Shaping', true);
  return S.svg(124, 46, g, 'QoS : chaîne et limitation');
}

module.exports = {
  num: 30,
  domain: '4.0 IP Services',
  objectives: '4.7',
  title: 'QoS : comportement par saut',
  attend:
    "Expliquer le comportement par saut (PHB) de la QoS : classification, marquage, files d'attente, congestion, policing et shaping.",
  essentiel: [
    "Voix : latence de 150 ms maximum de bout en bout, gigue de 30 ms maximum, perte de 1 % maximum, débit faible et constant. Vidéo interactive : contraintes proches, débit plus élevé. Données : tolérantes.",
    "Classification : reconnaître le trafic (ACL, NBAR, marquage reçu). Marquage : écrire une valeur dans l'en-tête ; CoS (3 bits PCP de 802.1Q, couche 2), DSCP (6 bits de l'en-tête IP, couche 3).",
    "DSCP usuels : EF (46) pour la voix, AF41 (34) pour la vidéo interactive, CS6 (48) pour le contrôle réseau, 0 (best effort). AFxy : x = classe (1 à 4), y = probabilité de rejet (1 à 3).",
    "Frontière de confiance (trust boundary) : point à partir duquel les marquages sont acceptés, idéalement le téléphone IP ou le port d'accès.",
    "Congestion : CBWFQ garantit une bande passante par classe ; LLQ y ajoute une file prioritaire stricte pour la voix. WRED rejette tôt et au hasard pour éviter la saturation et la synchronisation des flux TCP.",
    "Policing : rejette ou re-marque l'excédent, en entrée ou en sortie. Shaping : met l'excédent en file et le retarde, en sortie seulement.",
  ],
  schema: schema(),
  caption:
    "En haut, le traitement d'un paquet dans un équipement. En bas, le même trafic (gris) limité par un policer et par un shaper (noir).",
  commandes: [
    ['R1(config)# class-map match-any VOIX', 'Définit la classe VOIX'],
    ['R1(config-cmap)# match dscp ef', 'Critère : DSCP EF'],
    ['R1(config)# policy-map WAN-OUT', 'Crée la politique'],
    ['R1(config-pmap)# class VOIX', 'Sélectionne la classe'],
    ['R1(config-pmap-c)# priority percent 20', 'LLQ : file prioritaire, 20 %'],
    ['R1(config-pmap-c)# bandwidth percent 30', 'CBWFQ, sous une autre classe'],
    ['R1(config-if)# service-policy output WAN-OUT', 'Applique en sortie'],
    ['R1# show policy-map interface g0/0/0', 'Compteurs par classe', true],
  ],
  pieges: [
    'Policing rejette, shaping retarde. Le shaping ne s\'applique qu\'en sortie.',
    'La CoS vit dans l\'étiquette 802.1Q et disparaît au routage ; le DSCP voyage dans l\'en-tête IP.',
    'AF43 n\'est pas plus prioritaire qu\'AF41 : le second chiffre indique un rejet plus probable.',
  ],
  qcm: [
    {
      q: 'Quelle valeur DSCP est recommandée pour la voix ?',
      o: ['AF41', 'CS6', 'EF', 'AF11'],
      four: true,
      a: 'C',
      why: 'EF (46) : expedited forwarding, pour la voix.',
    },
    {
      q: 'Quel mécanisme place l\'excédent en file d\'attente pour lisser le débit ?',
      o: ['Policing', 'Shaping', 'WRED', 'NBAR'],
      four: true,
      a: 'B',
      why: 'Le shaper retarde ; le policer rejette ou re-marque.',
    },
    {
      q: 'Quel outil ajoute une file prioritaire stricte à CBWFQ ?',
      o: ['WRED', 'FIFO', 'NBAR', 'LLQ'],
      four: true,
      a: 'D',
      why: 'LLQ = CBWFQ + file prioritaire, limitée pour ne pas affamer les autres classes.',
    },
  ],
  mnemo: 'Le policer coupe, le shaper fait patienter.',
};
