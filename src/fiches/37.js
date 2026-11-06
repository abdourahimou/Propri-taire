const S = require('../svg');

// Gestion traditionnelle, gestion par contrôleur, boucle IA.
function schema() {
  let g = '';
  const dev = (x, y) => S.sw(x, y, 9, 4.2);
  // traditionnel
  g += S.text(28, 3, 'TRADITIONNEL', { anchor: 'middle', size: 2.2, bold: true });
  g += S.pc(28, 9);
  g += S.text(32, 9.6, 'CLI, un par un', { size: 1.9, c2: true });
  for (const x of [10, 28, 46]) { g += S.line(28, 11.6, x, 20.4, { end: 'ah', w: 0.22 }); g += dev(x, 23); }
  g += S.line(62, 1, 62, 27, { color: S.RULE });
  // contrôleur
  g += S.text(94, 3, 'À CONTRÔLEUR', { anchor: 'middle', size: 2.2, bold: true });
  g += S.pc(78, 9);
  g += S.text(78, 13.6, 'politique', { anchor: 'middle', size: 1.9, c2: true });
  g += S.line(81, 9, 93, 9, { end: 'ah', w: 0.22 });
  g += S.box(102, 9, 18, 5, 'Contrôleur', { size: 2.1, bold: true, fill: S.FILL });
  for (const x of [84, 102, 120]) { g += S.line(102, 11.5, x, 20.4, { end: 'ah', w: 0.22 }); g += dev(x - (x === 120 ? 3 : 0), 23); }
  g += S.text(111, 16.6, 'API', { size: 1.9, c2: true });
  // IA
  g += S.line(2, 29, 122, 29, { color: S.RULE });
  const loop = [[14, 'Télémétrie, logs'], [44, 'Modèle (ML)'], [76, 'Prédiction, anomalie'], [108, 'Action validée']];
  loop.forEach(([x, t], i) => {
    g += S.box(x, 36, 24, 5, t, { size: 2, bold: i === 1 });
    if (i < 3) g += S.line(x + 12, 36, x + 18, 36, { end: 'ah', w: 0.22 });
  });
  g += S.text(44, 42.6, 'apprend sur l\'historique', { anchor: 'middle', size: 1.9, c2: true });
  g += S.text(108, 42.6, 'l\'humain relit et décide', { anchor: 'middle', size: 1.9, acc: true });
  return S.svg(124, 44, g, 'Automatisation et IA');
}

module.exports = {
  num: 37,
  domain: '6.0 Automation & Programmability',
  objectives: '6.1 · 6.2 · 6.4',
  title: 'Automatisation, contrôleurs et IA',
  attend:
    "Expliquer l'effet de l'automatisation sur la gestion du réseau, comparer réseau traditionnel et réseau à contrôleur, et expliquer IA générative, IA prédictive et apprentissage automatique en exploitation.",
  essentiel: [
    "Gestion traditionnelle : configuration équipement par équipement en CLI. Conséquences : erreurs de saisie, dérive de configuration, déploiements lents, documentation incomplète.",
    "Automatisation : configurations générées à partir de modèles et de données (infrastructure as code), déployées en masse, vérifiées, réversibles, versionnées. Gains : cohérence, rapidité, traçabilité.",
    "Réseau à contrôleur : vue centralisée, politique définie une fois puis traduite et poussée par API vers les équipements (Catalyst Center, Meraki Dashboard, SD-WAN Manager).",
    "IA prédictive : modèles entraînés sur l'historique (télémétrie, logs) pour établir des lignes de base, détecter des anomalies, prévoir pannes et saturations.",
    "IA générative : produit du contenu (configuration, script, résumé d'incident, réponse en langage naturel). Ses sorties peuvent être plausibles et fausses : relecture et test avant application.",
    "Machine learning : supervisé (données étiquetées, par exemple classifier le trafic), non supervisé (regroupement, anomalies), par renforcement (essai et récompense). AIOps : ces techniques appliquées à l'exploitation.",
  ],
  schema: schema(),
  caption:
    "En haut, l'opérateur configure chaque équipement, ou exprime une politique que le contrôleur déploie. En bas, une chaîne d'IA appliquée à l'exploitation.",
  commandes: [
    ['R1(config)# netconf-yang', 'Active NETCONF (TCP 830)'],
    ['R1(config)# ip http secure-server', 'Serveur HTTPS, prérequis RESTCONF'],
    ['R1(config)# restconf', 'Active RESTCONF'],
    ['R1# show netconf-yang status', 'État du service NETCONF', true],
    ['R1# show platform software yang-management process', 'Processus du modèle YANG', true],
    ['R1# show archive config differences', 'Écart running / startup', true],
  ],
  pieges: [
    'Une configuration rédigée par une IA générative se relit et se teste : elle peut être plausible et fausse.',
    'Avec un contrôleur comme Catalyst Center, les équipements gardent leurs protocoles de routage ; le contrôleur centralise configuration, politique et supervision.',
    'Prédictive : anticipe à partir de l\'historique. Générative : crée un contenu nouveau.',
  ],
  qcm: [
    {
      q: 'Quel est le bénéfice principal de l\'automatisation du réseau ?',
      o: ['Plus de supervision nécessaire', 'Configurations cohérentes et reproductibles', 'CLI rendu inutilisable', 'Débit des liens augmenté'],
      a: 'B',
      why: 'Les mêmes modèles produisent les mêmes configurations, sans erreur de saisie.',
    },
    {
      q: 'Un outil analyse la télémétrie et annonce la saturation d\'un lien dans trois jours. Type d\'IA ?',
      o: ['Générative', 'Règle statique', 'Prédictive', 'Aucune'],
      four: true,
      a: 'C',
      why: 'Prévoir un état futur à partir de l\'historique relève de l\'IA prédictive.',
    },
    {
      q: 'Dans un réseau à contrôleur, comment une politique est-elle appliquée ?',
      o: ['CLI sur chaque équipement', 'Par SNMP trap', 'Copie TFTP manuelle', 'Définie sur le contrôleur, poussée par API'],
      a: 'D',
      why: 'Le contrôleur traduit l\'intention et configure les équipements par ses API southbound.',
    },
  ],
  mnemo: 'La prédictive anticipe, la générative rédige ; l\'humain valide.',
};
