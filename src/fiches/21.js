const S = require('../svg');

// Deux FAI : route par défaut principale et flottante.
function schema() {
  let g = '';
  const isp = (cx, cy, l) => `<ellipse cx="${cx}" cy="${cy}" rx="7" ry="4.2" fill="none" stroke="${S.INK2}" stroke-width="${S.SW}" stroke-dasharray="1 0.8"/>` + S.text(cx, cy + 0.9, l, { anchor: 'middle', size: 2.3, bold: true, c2: true });
  g += S.router(22, 18);
  g += S.text(22, 25.6, 'R1', { anchor: 'middle', size: 2.4, bold: true });
  g += isp(104, 7, 'FAI-1');
  g += isp(104, 29, 'FAI-2');
  g += S.line(25.5, 16, 97, 7.6);
  g += S.text(60, 9, 'principale · AD 1', { anchor: 'middle', size: 2.2, bold: true });
  g += S.text(94, 12.4, '203.0.113.1', { anchor: 'end', mono: true, size: 1.9, c2: true });
  g += S.text(27, 13, 'g0/0/0', { mono: true, size: 1.9, c2: true });
  g += S.line(25.5, 20, 97, 28.4, { dash: '1.2 0.8' });
  g += S.text(60, 29.8, 'flottante · AD 5', { anchor: 'middle', size: 2.2 });
  g += S.text(94, 33.6, '198.51.100.1', { anchor: 'end', mono: true, size: 1.9, c2: true });
  g += S.text(27, 25.4, 'g0/0/1', { mono: true, size: 1.9, c2: true });
  g += S.line(2, 36, 122, 36, { color: S.RULE });
  g += S.text(2, 40, 'Normal', { size: 2.1, c2: true });
  g += S.text(22, 40, 'S*  0.0.0.0/0 [1/0] via 203.0.113.1', { mono: true, size: 2 });
  g += S.text(2, 43.6, 'g0/0/0 down', { size: 2.1, acc: true });
  g += S.text(22, 43.6, 'S*  0.0.0.0/0 [5/0] via 198.51.100.1', { mono: true, size: 2 });
  return S.svg(124, 45, g, 'Route par défaut flottante');
}

module.exports = {
  num: 21,
  domain: '3.0 IP Connectivity',
  objectives: '3.3',
  title: 'Routes par défaut et flottantes',
  attend:
    'Configurer et vérifier une route par défaut et une route statique flottante de secours, en IPv4 et en IPv6.',
  essentiel: [
    "Route par défaut : <code>0.0.0.0 0.0.0.0</code> en IPv4, <code>::/0</code> en IPv6. Elle couvre toute destination avec la longueur la plus courte (/0) : elle ne sert qu'en l'absence de meilleure correspondance. Code S*, elle fixe la gateway of last resort.",
    "Usage type : routeur de bordure d'un réseau terminal (stub) vers son FAI.",
    "Route flottante (floating static) : statique vers la même destination, avec une AD supérieure à celle de la route principale. Elle reste hors de la table tant que la principale existe.",
    "Valeur de l'AD : au-dessus de 1 pour secourir une statique (ici 5) ; au-dessus de 110 pour secourir une route OSPF.",
    "Bascule : la flottante s'installe quand la principale disparaît (interface down, route dynamique retirée). Une panne au-delà du premier lien ne retire pas une statique : pas de bascule sans mécanisme de suivi (IP SLA).",
    "Diffusion de la route par défaut aux autres routeurs : <code>default-information originate</code> sous OSPF (fiche 23).",
  ],
  schema: schema(),
  caption:
    "La flottante (AD 5) n'entre dans la table que lorsque g0/0/0 tombe ; elle en sort dès le retour de la principale.",
  commandes: [
    ['R1(config)# ip route 0.0.0.0 0.0.0.0 203.0.113.1', 'Route par défaut principale'],
    ['R1(config)# ip route 0.0.0.0 0.0.0.0 198.51.100.1 5', 'Flottante, AD 5'],
    ['R1(config)# ipv6 route ::/0 2001:db8:f1::1', 'Défaut IPv6 principale'],
    ['R1(config)# ipv6 route ::/0 2001:db8:f2::1 5', 'Flottante IPv6, AD 5'],
    ['R1# show ip route static', 'Route active seulement', true],
    ['R1# show running-config | include ip route', 'Toutes les statiques configurées', true],
    ['R1# show ip route 0.0.0.0', 'Détail de la route par défaut', true],
  ],
  pieges: [
    "La flottante n'apparaît pas dans <code>show ip route</code> tant que la principale est active : la vérifier dans la running-config.",
    "Pour secourir une route OSPF (AD 110), une flottante en AD 5 ne convient pas : elle prendrait la place de la route OSPF.",
    "Principale via un next hop distant : une panne plus loin ne la retire pas, la flottante ne prend pas le relais.",
  ],
  qcm: [
    {
      q: 'La route par défaut principale est apprise par OSPF. Quelle AD donner à la statique flottante ?',
      o: ['1', '5', '110', '120'],
      four: true,
      a: 'D',
      why: 'Il faut dépasser 110 : avec 1 ou 5 la statique remplacerait OSPF ; à 110, égalité.',
    },
    {
      q: 'Quel couple réseau / masque définit une route par défaut IPv4 ?',
      o: ['0.0.0.0 0.0.0.0', '0.0.0.0 255.255.255.255', '255.255.255.255 0.0.0.0', '127.0.0.0 255.0.0.0'],
      a: 'A',
      why: 'Masque 0.0.0.0 : aucun bit à comparer, toute destination correspond.',
    },
    {
      q: 'La flottante (AD 5) est absente de <code>show ip route</code>. Pourquoi ?',
      o: ['Erreur de syntaxe', 'La principale (AD 1) est active', 'ip routing absent', 'AD 5 interdite'],
      a: 'B',
      why: 'Une seule route par préfixe : celle de plus faible AD.',
    },
  ],
  mnemo: 'Flottante : même destination, AD plus haute ; elle dort tant que la principale vit.',
};
