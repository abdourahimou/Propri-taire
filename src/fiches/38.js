const S = require('../svg');

// Pile SDN (northbound / southbound) + overlay sur underlay.
function schema() {
  let g = '';
  g += S.box(30, 5, 52, 6, 'Applications, scripts', { size: 2.3, bold: true });
  g += S.line(30, 8, 30, 15, { end: 'ah', w: 0.25, start: 'ah' });
  g += S.text(32, 12.4, 'northbound : REST (HTTPS, JSON)', { size: 2, acc: true });
  g += S.box(30, 18.5, 52, 6, 'Contrôleur', { size: 2.3, bold: true, fill: S.FILL });
  g += S.text(30, 24.4, 'plan de contrôle centralisé', { anchor: 'middle', size: 1.9, c2: true });
  g += S.line(30, 25.8, 30, 32.4, { end: 'ah', w: 0.25, start: 'ah' });
  g += S.text(32, 29.6, 'southbound : NETCONF, RESTCONF,', { size: 2, acc: true });
  g += S.text(32, 32.4, 'OpenFlow, SSH, SNMP', { size: 2, acc: true });
  for (const x of [12, 30, 48]) g += S.sw(x, 37.5, 10, 4.4);
  g += S.text(30, 43.6, 'équipements : plan de données', { anchor: 'middle', size: 1.9, c2: true });
  g += S.line(62, 1, 62, 45, { color: S.RULE });
  // overlay / underlay
  g += S.text(66, 3.4, 'Fabric', { size: 2.3, bold: true });
  g += S.text(66, 9.4, 'overlay', { size: 2.1, bold: true, acc: true });
  g += `<path d="M72,14 C82,6 102,6 114,14" fill="none" stroke="${S.ACC}" stroke-width="0.35" stroke-dasharray="1 0.6"/>`;
  g += S.text(93, 4.6, 'tunnel VXLAN', { anchor: 'middle', size: 2, acc: true });
  const U = [[72, 20], [93, 28], [114, 20], [93, 14]];
  g += S.line(72, 20, 93, 28) + S.line(93, 28, 114, 20) + S.line(72, 20, 93, 14) + S.line(93, 14, 114, 20);
  for (const [x, y] of U) g += S.router(x, y, 2.6);
  g += S.text(66, 34.6, 'underlay', { size: 2.1, bold: true });
  g += S.text(66, 37.6, 'liens physiques + routage IP', { size: 1.9, c2: true });
  g += S.text(66, 40.4, '(IS-IS en SD-Access)', { size: 1.9, c2: true });
  return S.svg(124, 45, g, 'Architecture SDN');
}

module.exports = {
  num: 38,
  domain: '6.0 Automation & Programmability',
  objectives: '6.3',
  title: 'SDN : plans et API',
  attend:
    "Décrire l'architecture définie par logiciel : séparation des plans de contrôle et de données, overlay, underlay et fabric, API northbound et southbound.",
  essentiel: [
    "Plan de données (data plane) : transfert des paquets (commutation, ACL, NAT), en matériel. Plan de contrôle (control plane) : construction des tables (OSPF, STP, ARP). Plan de gestion (management plane) : accès d'administration (SSH, SNMP, API).",
    "SDN : le plan de contrôle est centralisé, en tout ou partie, dans un contrôleur qui a une vision globale ; les équipements appliquent ses décisions.",
    "API northbound : entre les applications et le contrôleur, en général REST sur HTTPS avec JSON. API southbound : entre le contrôleur et les équipements (NETCONF, RESTCONF, OpenFlow, OpFlex, SSH, SNMP).",
    "Underlay : réseau physique et routage IP qui relient les nœuds. Overlay : réseau logique construit au-dessus par des tunnels (VXLAN, GRE, IPsec). Fabric : underlay et overlay gérés comme un ensemble.",
    "Cisco SD-Access : underlay routé (IS-IS), overlay VXLAN pour les données, LISP pour le contrôle, politique par groupes (SGT), piloté par Catalyst Center.",
    "Cisco SD-WAN : overlay de tunnels IPsec sur plusieurs transports (Internet, MPLS, 4G/5G), piloté par SD-WAN Manager, Controller et Validator.",
  ],
  schema: schema(),
  caption:
    "À gauche, le contrôleur entre applications (nord) et équipements (sud). À droite, un tunnel overlay relie deux nœuds à travers l'underlay.",
  commandes: [
    ['R1# show ip ospf neighbor', 'Plan de contrôle : voisins', true],
    ['R1# show ip cef', 'Plan de données : table FIB', true],
    ['R1# show adjacency', 'Plan de données : réécriture L2', true],
    ['R1(config)# netconf-yang', 'Southbound : NETCONF'],
    ['R1(config)# restconf', 'Southbound : RESTCONF'],
    ['R1# show interfaces tunnel 0', 'Interface d\'overlay (GRE)', true],
  ],
  pieges: [
    'Northbound : vers les applications. Southbound : vers les équipements.',
    "L'underlay n'est pas seulement le câblage : il comprend le routage IP entre les nœuds.",
    'SSH, SNMP et les API relèvent du plan de gestion, pas du plan de contrôle.',
  ],
  qcm: [
    {
      q: 'Quelle API relie un script d\'automatisation au contrôleur ?',
      o: ['Southbound', 'Northbound', 'OpenFlow', 'Eastbound'],
      four: true,
      a: 'B',
      why: 'Applications et scripts consomment l\'API northbound du contrôleur.',
    },
    {
      q: 'Quel plan construit la table de routage ?',
      o: ['Gestion', 'Données', 'Contrôle', 'Overlay'],
      four: true,
      a: 'C',
      why: 'Le plan de contrôle calcule les routes ; le plan de données les utilise.',
    },
    {
      q: 'Quel protocole encapsule le trafic overlay dans SD-Access ?',
      o: ['LISP', 'IS-IS', 'OSPF', 'VXLAN'],
      four: true,
      a: 'D',
      why: 'VXLAN porte les données ; LISP sert au plan de contrôle ; IS-IS à l\'underlay.',
    },
  ],
  mnemo: 'Le nord parle aux applications, le sud aux équipements.',
};
