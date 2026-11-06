const S = require('../svg');

// Longest prefix match pour la destination 10.1.1.70.
function schema() {
  let g = '';
  g += S.text(2, 3.4, 'Paquet vers 10.1.1.70 : entrées de R1 qui correspondent', { size: 2.4, bold: true });
  const rows = [
    ['S', '10.0.0.0/8', '[1/0]', 8, 'via 192.0.2.1'],
    ['O', '10.1.0.0/16', '[110/20]', 16, 'via 192.0.2.5'],
    ['S', '10.1.1.0/24', '[1/0]', 24, 'via 192.0.2.9'],
    ['O', '10.1.1.64/26', '[110/30]', 26, 'via 192.0.2.13'],
  ];
  const bx = 58, bw = 48;
  rows.forEach(([c, p, ad, len, nh], i) => {
    const y = 10 + i * 6.4;
    const win = i === 3;
    g += S.text(2, y + 1, c, { mono: true, size: 2.2, bold: win });
    g += S.text(6, y + 1, p, { mono: true, size: 2.2, bold: win });
    g += S.text(28, y + 1, ad, { mono: true, size: 2.1, c2: true });
    g += S.text(40, y + 1, nh, { mono: true, size: 1.9, c2: true });
    g += S.rect(bx, y - 1.6, bw, 3.4, { stroke: S.RULE });
    g += S.rect(bx, y - 1.6, +(bw * len / 32).toFixed(2), 3.4, { fill: win ? S.INK : S.FILL, stroke: S.INK });
    g += S.text(bx + bw + 2, y + 1, len + ' bits', { size: 2.1, bold: win, acc: win });
  });
  g += S.text(bx, 37.4, '0', { mono: true, size: 1.9, c2: true });
  g += S.text(bx + bw, 37.4, '32', { anchor: 'end', mono: true, size: 1.9, c2: true });
  g += S.text(2, 42, 'Retenue : 10.1.1.64/26 via 192.0.2.13. Son AD (110) dépasse celle des statiques, mais seule la longueur de préfixe compte ici.', { size: 2.1 });
  return S.svg(124, 44, g, 'Longest prefix match');
}

module.exports = {
  num: 18,
  domain: '3.0 IP Connectivity',
  objectives: '3.2',
  title: 'Décision d\'acheminement du routeur',
  attend:
    "Déterminer comment un routeur choisit la route d'un paquet : correspondance la plus longue, puis distance administrative, puis métrique.",
  essentiel: [
    "Pour chaque paquet, le routeur retient l'entrée dont le préfixe couvre le plus grand nombre de bits de l'adresse de destination (longest prefix match), quel que soit le protocole qui l'a apprise.",
    "Distance administrative : départage, avant installation, des routes vers un préfixe identique apprises par des sources différentes ; seule la plus basse entre dans la table.<table class=\"ref\"><tbody><tr><th>Source</th><td>Connectée</td><td>Statique</td><td>eBGP</td><td>EIGRP</td><td>OSPF</td><td>RIP</td><td>iBGP</td></tr><tr><th>AD</th><td>0</td><td>1</td><td>20</td><td>90</td><td>110</td><td>120</td><td>200</td></tr></tbody></table>",
    "Métrique : départage des chemins vers un même préfixe au sein d'un protocole. OSPF : coût cumulé ; RIP : nombre de sauts. À métrique égale, partage de charge (ECMP).",
    "Ordre fixe : préfixe le plus long, puis AD la plus basse, puis métrique la plus basse. L'AD ne compare jamais deux longueurs de préfixe différentes.",
    "AD 255 : source jugée non fiable, route jamais installée. Sans correspondance ni route par défaut, le paquet est rejeté et un ICMP Destination Unreachable part vers la source.",
  ],
  schema: schema(),
  caption:
    "Quatre entrées couvrent 10.1.1.70 ; la barre montre la longueur de chaque préfixe. La /26 (10.1.1.64 à .127) gagne.",
  commandes: [
    ['R1# show ip route 10.1.1.70', 'Entrée retenue pour cette adresse', true],
    ['R1# show ip cef 10.1.1.70', 'Next hop réellement utilisé', true],
    ['R1# show ip route', 'Table complète', true],
    ['R1(config)# ip route 10.1.1.0 255.255.255.0 192.0.2.9', 'Statique /24 de l\'exemple'],
    ['R1(config-router)# maximum-paths 2', 'Nombre de chemins ECMP (OSPF)'],
    ['R1(config-router)# distance 115', 'Modifie l\'AD d\'OSPF'],
  ],
  pieges: [
    "Une route OSPF en /26 l'emporte sur une statique en /24 : la longueur du préfixe passe avant l'AD.",
    "L'AD ne départage que des routes vers le même préfixe, de même longueur.",
    'Une métrique RIP et une métrique OSPF ne se comparent pas : entre protocoles, seule l\'AD compte.',
  ],
  qcm: [
    {
      q: 'Entrées : <code>S 172.16.0.0/16</code>, <code>O 172.16.4.0/22</code>, <code>O 172.16.4.0/24</code>. Quelle route pour 172.16.5.10 ?',
      o: ['172.16.0.0/16', '172.16.4.0/22', '172.16.4.0/24', 'La route par défaut'],
      a: 'B',
      why: '/24 couvre 4.0–4.255 (exclu) ; /22 couvre 4.0–7.255 : c\'est la plus longue qui correspond.',
    },
    {
      q: '10.5.0.0/16 est appris à la fois par OSPF et par RIP. Quelle route est installée ?',
      o: ['Celle de RIP', 'Les deux', 'Celle d\'OSPF', 'La plus faible métrique'],
      a: 'C',
      why: 'Même préfixe : l\'AD tranche, 110 (OSPF) contre 120 (RIP).',
    },
    {
      q: 'Quelle est l\'AD par défaut d\'une route statique ?',
      o: ['0', '110', '120', '1'],
      four: true,
      a: 'D',
      why: 'Statique : 1 ; connectée : 0.',
    },
  ],
  mnemo: 'Le plus long d\'abord, le plus fiable ensuite, le moins cher enfin.',
};
