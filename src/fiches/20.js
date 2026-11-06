const S = require('../svg');

// Trois formes de route IPv6 vers le même LAN.
function schema() {
  let g = '';
  const y = 11;
  g += S.router(30, y);
  g += S.text(30, y - 5.4, 'R1', { anchor: 'middle', size: 2.4, bold: true });
  g += S.line(34, y, 76, y);
  g += S.text(55, y - 1.5, '2001:db8:12::/64', { anchor: 'middle', mono: true, size: 2.1 });
  g += S.text(35.4, y + 3.4, '::1 · fe80::1', { mono: true, size: 1.9, c2: true });
  g += S.text(74.6, y + 3.4, '::2 · fe80::2', { anchor: 'end', mono: true, size: 1.9, c2: true });
  g += S.text(35.4, y + 6.4, 'g0/0/1', { mono: true, size: 1.9, c2: true });
  g += S.router(80, y);
  g += S.text(80, y - 5.4, 'R2', { anchor: 'middle', size: 2.4, bold: true });
  g += S.line(84, y, 104, y);
  g += S.sw(110, y, 12, 5.4);
  g += S.text(110, y - 4.4, 'LAN', { anchor: 'middle', size: 2.3, bold: true });
  g += S.text(110, y + 6, '2001:db8:2::/64', { anchor: 'middle', mono: true, size: 1.9 });
  g += S.line(2, 22, 122, 22, { color: S.RULE });
  const forms = [
    ['ipv6 route 2001:db8:2::/64 2001:db8:12::2', 'next hop global (récursive)'],
    ['ipv6 route 2001:db8:2::/64 g0/0/1 fe80::2', 'next hop link-local + interface'],
    ['ipv6 route 2001:db8:2::/64 g0/0/1 2001:db8:12::2', 'entièrement spécifiée'],
    ['ipv6 route 2001:db8:2::/64 fe80::2', 'refusée : interface manquante'],
  ];
  forms.forEach(([c, l], i) => {
    const yy = 27 + i * 4.2;
    g += S.text(2, yy, c, { mono: true, size: 2.05, bold: i < 3 });
    g += S.text(122, yy, l, { anchor: 'end', size: 2.1, acc: i === 3, c2: i < 3 });
  });
  g += S.line(2, 38.9, 45, 38.9, { color: S.ACC, w: 0.3 });
  return S.svg(124, 44, g, 'Routes statiques IPv6');
}

module.exports = {
  num: 20,
  domain: '3.0 IP Connectivity',
  objectives: '3.3',
  title: 'Routes statiques IPv6',
  attend:
    'Configurer et vérifier des routes statiques IPv6 vers un réseau et vers un hôte, avec un next hop global, link-local ou une interface.',
  essentiel: [
    "Prérequis : <code>ipv6 unicast-routing</code>. Syntaxe : <code>ipv6 route</code> préfixe/longueur, puis next hop, interface ou les deux ; AD facultative (1 par défaut). Pas de masque décimal.",
    "Next hop global (GUA) : route récursive, comme en IPv4.",
    "Next hop link-local : l'interface de sortie est obligatoire, car une adresse link-local n'est unique que sur son lien.",
    "Interface seule : acceptable sur une liaison point à point ; sur Ethernet, préciser aussi le next hop.",
    "Route d'hôte : préfixe /128. Route par défaut : <code>::/0</code>.",
    "Un next hop link-local ne change pas si l'adressage global est renuméroté : la route reste valide.",
  ],
  schema: schema(),
  caption:
    "Les trois premières formes mènent au même LAN. La quatrième est refusée par IOS : un next hop link-local exige son interface.",
  commandes: [
    ['R1(config)# ipv6 unicast-routing', 'Active le routage IPv6'],
    ['R1(config)# ipv6 route 2001:db8:2::/64 2001:db8:12::2', 'Next hop global'],
    ['R1(config)# ipv6 route 2001:db8:2::/64 g0/0/1 fe80::2', 'Next hop link-local'],
    ['R1(config)# ipv6 route 2001:db8:2::10/128 2001:db8:12::2', 'Route d\'hôte'],
    ['R1(config)# ipv6 route ::/0 2001:db8:12::2', 'Route par défaut'],
    ['R1# show ipv6 route static', 'Routes S installées', true],
    ['R1# show ipv6 neighbors', 'Résolution NDP du next hop', true],
    ['R1# ping 2001:db8:2::10', 'Test de bout en bout', true],
  ],
  pieges: [
    "<code>ipv6 route 2001:db8:2::/64 fe80::2</code> sans interface est refusé.",
    "Sans <code>ipv6 unicast-routing</code>, le routeur ne relaie aucun paquet IPv6, routes statiques comprises.",
    "Route par défaut IPv6 : <code>::/0</code>, pas <code>::/128</code> (adresse non spécifiée).",
  ],
  qcm: [
    {
      q: 'Quelle commande est valide avec un next hop link-local ?',
      o: ['ipv6 route 2001:db8:2::/64 fe80::2', 'ipv6 route 2001:db8:2::/64 g0/0/1 fe80::2', 'ipv6 route 2001:db8:2:: 64 fe80::2', 'ip route 2001:db8:2::/64 fe80::2'],
      one: true,
      a: 'B',
      why: 'Next hop link-local : l\'interface de sortie doit être indiquée.',
    },
    {
      q: 'Quel préfixe représente une route par défaut IPv6 ?',
      o: ['::/128', '::1/128', '::/0', 'FF00::/8'],
      four: true,
      a: 'C',
      why: '::/0 correspond à toutes les destinations. ::1 est la loopback.',
    },
    {
      q: 'Quelle longueur de préfixe correspond à une route d\'hôte IPv6 ?',
      o: ['/32', '/64', '/127', '/128'],
      four: true,
      a: 'D',
      why: '128 bits d\'adresse : /128 désigne un seul hôte.',
    },
  ],
  mnemo: 'Link-local en next hop : toujours avec son interface.',
};
