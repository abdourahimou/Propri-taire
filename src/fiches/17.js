const S = require('../svg');

// Extrait annoté de show ip route.
function schema() {
  let g = '';
  const sz = 2.4, cw = sz * 0.6, x0 = 2;
  const lines = [
    ['R1# show ip route', true],
    ['Gateway of last resort is 203.0.113.1 to network 0.0.0.0', false],
    ['S*    0.0.0.0/0 [1/0] via 203.0.113.1', false],
    ['      10.0.0.0/8 is variably subnetted, 3 subnets, 3 masks', false],
    ['C        10.0.12.0/30 is directly connected, GigabitEthernet0/0/1', false],
    ['L        10.0.12.1/32 is directly connected, GigabitEthernet0/0/1', false],
    ['O        10.1.3.0/24 [110/3] via 10.0.12.2, 00:05:12, GigabitEthernet0/0/1', false],
  ];
  lines.forEach(([t, b], i) => (g += S.text(x0, 3.4 + i * 4.1, t.replace(/ /g, ' '), { mono: true, size: sz, bold: b })));
  // repères sous la ligne O
  const y = 3.4 + 6 * 4.1 + 1.6;
  const O = lines[6][0];
  const mark = (str, label, dy) => {
    const i = O.indexOf(str);
    const a = x0 + i * cw, b = x0 + (i + str.length) * cw;
    let s = S.line(a, y, b, y, { w: 0.3 });
    s += S.line((a + b) / 2, y, (a + b) / 2, y + dy - 2.2, { color: S.INK2 });
    s += S.text((a + b) / 2, y + dy, label, { anchor: 'middle', size: 2.1 });
    return s;
  };
  g += mark('O', 'code', 4);
  g += mark('10.1.3.0/24', 'préfixe / longueur', 8);
  g += mark('[110/3]', '[AD / métrique]', 4);
  g += mark('10.0.12.2', 'next hop', 8);
  g += mark('00:05:12', 'âge', 4);
  g += mark('GigabitEthernet0/0/1', 'interface de sortie', 8);
  return S.svg(124, 43, g, 'Lecture de show ip route');
}

module.exports = {
  num: 17,
  domain: '3.0 IP Connectivity',
  objectives: '3.1',
  title: 'Lire la table de routage',
  attend:
    "Interpréter les composants d'une table de routage : code de protocole, préfixe, masque, next hop, distance administrative, métrique et gateway of last resort.",
  essentiel: [
    "Codes : C connecté, L local (adresse de l'interface en /32), S statique, O OSPF, D EIGRP, R RIP, B BGP ; * marque une route par défaut candidate ; O IA inter-area ; E1 et E2 externes OSPF.",
    "Une entrée se lit : code, préfixe et longueur, [distance administrative / métrique], next hop, âge, interface de sortie.",
    "Distance administrative (AD) : confiance accordée à la source, la plus basse l'emporte. Métrique : coût du chemin au sein d'un même protocole.",
    "Gateway of last resort : next hop de la route par défaut 0.0.0.0/0. « not set » signifie qu'aucune route par défaut n'existe.",
    "Routes C et L : créées dès qu'une interface adressée est up/up, sans aucun protocole ; AD 0.",
    "Ligne d'en-tête « 10.0.0.0/8 is variably subnetted, 3 subnets, 3 masks » : regroupe les sous-réseaux du réseau classful 10.0.0.0, avec plusieurs longueurs de masque.",
  ],
  schema: schema(),
  caption:
    "Chaque champ de la ligne O identifié. La route S* fournit la gateway of last resort ; la ligne L est l'adresse propre de R1 sur g0/0/1.",
  commandes: [
    ['R1# show ip route', 'Table IPv4 complète', true],
    ['R1# show ip route ospf', 'Routes O seulement', true],
    ['R1# show ip route connected', 'Réseaux connectés', true],
    ['R1# show ip route 10.1.3.0', 'Détail d\'une entrée', true],
    ['R1# show ipv6 route', 'Table IPv6', true],
  ],
  pieges: [
    "L n'est pas un réseau : c'est l'adresse de l'interface du routeur, en /32 (/128 en IPv6).",
    "Dans [110/3], 110 est la distance administrative et 3 la métrique, jamais l'inverse.",
    "« Gateway of last resort is not set » : sans correspondance, le paquet est rejeté.",
  ],
  qcm: [
    {
      q: 'Dans <code>O 10.1.3.0/24 [110/3] via 10.0.12.2</code>, quelle est la métrique ?',
      o: ['110', '3', '24', '12'],
      four: true,
      a: 'B',
      why: 'Le crochet contient [AD/métrique] : AD 110, métrique 3.',
    },
    {
      q: 'Quel code identifie l\'adresse configurée sur une interface du routeur ?',
      o: ['C', 'S', 'L', '*'],
      four: true,
      a: 'C',
      why: 'L (local) : adresse de l\'interface en /32. C : réseau connecté.',
    },
    {
      q: 'Quelle ligne montre une route par défaut statique ?',
      o: ['O*E2 0.0.0.0/0 [110/1]', 'C 0.0.0.0/0', 'L 203.0.113.2/32', 'S* 0.0.0.0/0 [1/0]'],
      a: 'D',
      why: 'S = statique, * = candidate par défaut. O*E2 est une route par défaut apprise par OSPF.',
    },
  ],
  mnemo: '[AD/métrique] : la confiance d\'abord, le coût ensuite.',
};
