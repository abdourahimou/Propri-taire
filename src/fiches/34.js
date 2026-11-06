const S = require('../svg');

// Placement des ACL : étendue près de la source, standard près de la destination.
function schema() {
  const y = 16;
  let g = '';
  for (const py of [8, 16, 24]) {
    g += S.pc(5, py);
    g += S.line(7.6, py, 13.5, y);
  }
  g += S.text(1, 31.5, '192.168.10.0/24', { mono: true, size: 2.1 });
  g += S.sw(19.5, y);
  g += S.line(25, y, 56, y);
  g += S.router(60, y);
  g += S.text(60, y - 6, 'R1', { anchor: 'middle', bold: true, size: 2.6 });
  g += S.text(55, y + 3.4, 'g0/0/0', { anchor: 'end', mono: true, size: 2, c2: true });
  g += S.text(65, y - 1.6, 'g0/0/1', { mono: true, size: 2, c2: true });
  g += S.line(64, y, 91.5, y);
  g += S.sw(97, y);
  for (const py of [8, 24]) {
    g += S.line(102.5, y, 107.5, py);
    g += S.server(110, py);
  }
  g += S.text(113, 9, '.10 web', { mono: true, size: 2, c2: true });
  g += S.text(113, 25, '.20', { mono: true, size: 2, c2: true });
  g += S.text(123, 31.5, '10.1.1.0/24', { anchor: 'end', mono: true, size: 2.1 });

  g += S.line(44, 8.4, 54.4, 14.6, { color: S.ACC, end: 'aha', w: 0.3 });
  g += S.text(43, 5.4, 'ACL étendue FILTRE-WEB', { anchor: 'end', size: 2.3, bold: true, acc: true });
  g += S.text(43, 8.4, 'in, près de la source', { anchor: 'end', size: 2.2, c2: true });
  g += S.line(76, 23.4, 66, 17.4, { end: 'ah', w: 0.25, dash: '0.8 0.6' });
  g += S.text(77, 25.6, 'ACL standard : out,', { size: 2.2, c2: true });
  g += S.text(77, 28.4, 'près de la destination', { size: 2.2, c2: true });

  g += S.line(12, 37, 112, 37, { end: 'ah' });
  g += S.text(62, 41.4, 'Flux filtré : 192.168.10.0/24 <tspan class="m">→</tspan> 10.1.1.10, seul TCP 443 autorisé', { anchor: 'middle', size: 2.3 });
  return S.svg(124, 43, g, 'Placement des ACL standard et étendue');
}

module.exports = {
  num: 34,
  domain: '5.0 Security Fundamentals',
  objectives: '5.6',
  title: "Listes de contrôle d'accès",
  attend:
    'Configurer et vérifier des ACL IPv4 standard et étendues, numérotées et nommées, puis les appliquer sur la bonne interface et dans le bon sens.',
  essentiel: [
    "Lecture de haut en bas : la première ligne correspondante s'applique, les suivantes sont ignorées. Un <code>deny any</code> implicite termine chaque ACL : une liste sans <code>permit</code> bloque tout.",
    "Standard (1–99, 1300–1999) : adresse source seule, à placer près de la destination. Étendue (100–199, 2000–2699) : protocole, source, destination, ports, à placer près de la source.",
    "Une ACL par interface, par sens, par protocole. <code>in</code> : trafic entrant dans le routeur par l'interface, évalué avant le routage. <code>out</code> : trafic qui en sort. Une ACL <code>out</code> ne filtre pas le trafic généré par le routeur.",
    "Wildcard mask : bit 0 = vérifié, bit 1 = ignoré. <code>host 192.0.2.10</code> équivaut à <code>192.0.2.10 0.0.0.0</code> ; <code>any</code> à <code>0.0.0.0 255.255.255.255</code>.",
    "ACL nommée : lignes numérotées 10, 20, 30… par défaut. Insertion avec <code>15 deny …</code>, suppression avec <code>no 20</code>, sans réécrire la liste.",
    "Accès VTY (Telnet / SSH) : <code>access-class</code> sous <code>line vty</code>, et non <code>ip access-group</code>.",
  ],
  schema: schema(),
  caption:
    "L'ACL étendue bloque le flux dès son entrée dans R1. Une ACL standard ne voit que la source : placée près de celle-ci, elle couperait l'accès à toutes les destinations.",
  commandes: [
    ['R1(config)# ip access-list extended FILTRE-WEB', 'Crée ou édite l\'ACL étendue nommée'],
    ['R1(config-ext-nacl)# 10 permit tcp 192.168.10.0 0.0.0.255 host 10.1.1.10 eq 443', 'Autorise HTTPS vers .10'],
    ['R1(config-ext-nacl)# 20 deny ip 192.168.10.0 0.0.0.255 host 10.1.1.10', 'Bloque tout autre flux vers .10'],
    ['R1(config-ext-nacl)# 30 permit ip any any', 'Laisse passer le reste'],
    ['R1(config-if)# ip access-group FILTRE-WEB in', 'Applique l\'ACL en entrée de g0/0/0'],
    ['R1(config)# access-list 10 permit host 192.168.10.5', 'ACL standard : poste d\'administration'],
    ['R1(config-line)# access-class 10 in', 'VTY réservées au poste .5'],
    ['R1# show access-lists', 'Lignes et compteurs', true],
    ['R1# show ip interface g0/0/0', 'ACL in / out actives', true],
  ],
  pieges: [
    "Un <code>deny ip any any</code> en séquence 10 rend inutiles tous les <code>permit</code> suivants.",
    "Sans <code>permit ip any any</code> final, tout le reste est bloqué, Hello OSPF compris.",
    "ACL standard posée près de la source : l'hôte perd l'accès à toutes les destinations.",
  ],
  qcm: [
    {
      q: 'Quel wildcard mask correspond au réseau <code>172.16.32.0/20</code> ?',
      o: ['0.0.16.255', '0.0.31.255', '0.0.15.0', '0.0.15.255'],
      four: true,
      a: 'D',
      why: '/20 = 255.255.240.0 ; 255.255.255.255 – 255.255.240.0 = 0.0.15.255.',
    },
    {
      q: "ACL en entrée : <code>10 deny ip 192.168.10.0 0.0.0.255 any</code> puis <code>20 permit ip host 192.168.10.5 any</code>. Paquet issu de .5 ?",
      o: ['Permis par la ligne 20', 'Bloqué par la ligne 10', 'Bloqué par le deny implicite', 'Permis, host étant plus précis'],
      a: 'B',
      why: 'Première correspondance : la ligne 10 couvre .5.',
    },
    {
      q: "Selon Cisco, où appliquer l'ACL étendue filtrant 192.168.10.0/24 vers 10.1.1.10 (schéma) ?",
      o: ['g0/0/0, in', 'g0/0/1, in', 'g0/0/0, out', 'line vty 0 4'],
      four: true,
      a: 'A',
      why: 'Étendue : au plus près de la source, en entrée de g0/0/0.',
    },
  ],
  mnemo: 'Standard → Destination, Étendue → Source.',
};
