const S = require('../svg');

// Comparaison 3-tier (campus) et spine-leaf (centre de données).
function schema() {
  let g = '';
  const s = (x, y) => S.sw(x, y, 8, 4.2);
  // 3-tier
  g += S.text(30, 3.4, '3-TIER (CAMPUS)', { anchor: 'middle', size: 2.3, bold: true });
  const core = [[14, 11], [34, 11]], dist = [[8, 23], [40, 23]], acc = [[5, 35], [24, 35], [43, 35]];
  g += S.line(18, 11, 30, 11);
  for (const [cx, cy] of core) for (const [dx, dy] of dist) g += S.line(cx, cy + 2.1, dx, dy - 2.1);
  g += S.line(12, 23, 36, 23);
  for (const [dx, dy] of dist) for (const [ax, ay] of acc) g += S.line(dx, dy + 2.1, ax, ay - 2.1);
  for (const p of [...core, ...dist, ...acc]) g += s(...p);
  g += S.text(49, 12, 'Cœur', { size: 2.2, c2: true });
  g += S.text(49, 24, 'Distribution', { size: 2.2, c2: true });
  g += S.text(49, 36, 'Accès', { size: 2.2, c2: true });
  // séparateur
  g += S.line(64, 2, 64, 44, { color: S.RULE });
  // spine-leaf
  g += S.text(95, 3.4, 'SPINE-LEAF (CENTRE DE DONNÉES)', { anchor: 'middle', size: 2.3, bold: true });
  const spines = [[84, 13], [106, 13]], leaves = [[72, 31], [87, 31], [102, 31], [117, 31]];
  for (const [sx, sy] of spines) for (const [lx, ly] of leaves) g += S.line(sx, sy + 2.1, lx, ly - 2.1);
  for (const p of [...spines, ...leaves]) g += s(...p);
  for (const [lx] of leaves) { g += S.line(lx, 33.1, lx, 37); g += S.server(lx, 40); }
  g += S.text(95, 9, 'spines', { anchor: 'middle', size: 2.2, c2: true });
  g += S.text(95, 36.4, 'leafs', { anchor: 'middle', size: 2.2, c2: true });
  return S.svg(124, 45, g, 'Architectures 3-tier et spine-leaf');
}

module.exports = {
  num: 2,
  domain: '1.0 Network Fundamentals',
  objectives: '1.2 · 1.12',
  title: 'Topologies, cloud et virtualisation',
  attend:
    "Décrire les architectures 2-tier, 3-tier, spine-leaf, WAN, SOHO, on-premise et cloud, et expliquer la virtualisation des serveurs, les conteneurs et les VRF.",
  essentiel: [
    "3-tier (trois niveaux) : accès (terminaux, PoE, sécurité des ports), distribution (routage inter-VLAN, politiques, agrégation), cœur (core : transport rapide entre blocs, sans filtrage). 2-tier (collapsed core) : cœur et distribution fusionnés.",
    "Spine-leaf : chaque leaf est relié à chaque spine, jamais leaf à leaf ni spine à spine. Entre deux serveurs : leaf, spine, leaf. Latence prévisible pour le trafic est-ouest ; ajouter un spine augmente la capacité.",
    "WAN : relie des sites distants (MPLS, Metro Ethernet, Internet + VPN) en point à point, hub-and-spoke ou full mesh. SOHO (Small Office / Home Office) : un seul boîtier fait routeur, switch, AP et pare-feu.",
    "On-premise : infrastructure possédée et exploitée sur site. Cloud : services IaaS, PaaS, SaaS ; déploiement public, privé, hybride ou communautaire.",
    "Hyperviseur type 1 (bare-metal : ESXi, Hyper-V) ou type 2 (hébergé : VirtualBox) : exécute des VM, chacune avec son OS ; un vSwitch relie les vNIC au réseau. Conteneur (Docker) : partage le noyau de l'hôte, plus léger qu'une VM.",
    "VRF (Virtual Routing and Forwarding) : plusieurs tables de routage isolées sur un même routeur. Un même préfixe peut exister dans deux VRF sans conflit.",
  ],
  schema: schema(),
  caption:
    "À gauche, le campus hiérarchique ; à droite, le spine-leaf, où tout serveur est à la même distance de tous les autres.",
  commandes: [
    ['R1(config)# vrf definition CLIENT-A', 'Crée la VRF CLIENT-A'],
    ['R1(config-vrf)# address-family ipv4', 'Active IPv4 dans la VRF'],
    ['R1(config-if)# vrf forwarding CLIENT-A', 'Rattache l\'interface à la VRF'],
    ['R1(config-if)# ip address 10.0.0.1 255.255.255.0', 'Adresse (à ressaisir)'],
    ['R1# show vrf', 'VRF et interfaces associées', true],
    ['R1# show ip route vrf CLIENT-A', 'Table de routage de la VRF', true],
    ['R1# ping vrf CLIENT-A 10.0.0.2', 'Test dans le contexte VRF', true],
  ],
  pieges: [
    "<code>vrf forwarding</code> efface l'adresse IP déjà configurée sur l'interface : il faut la ressaisir.",
    "Spine-leaf : aucun lien leaf–leaf ni spine–spine. Un schéma qui en contient n'est pas un spine-leaf.",
    "Conteneur et VM ne sont pas équivalents : le conteneur n'embarque pas d'OS complet.",
  ],
  qcm: [
    {
      q: 'Quel chemin suit le trafic entre deux serveurs raccordés à des leafs différents ?',
      o: ['Leaf, leaf', 'Leaf, spine, leaf', 'Leaf, spine, spine, leaf', 'Leaf, cœur, leaf'],
      a: 'B',
      why: 'Chaque leaf est relié à chaque spine : un seul spine sépare deux leafs.',
    },
    {
      q: 'Quel modèle cloud fournit des VM dont le client administre lui-même l\'OS ?',
      o: ['SaaS', 'PaaS', 'IaaS', 'Cloud hybride'],
      four: true,
      a: 'C',
      why: 'IaaS : le fournisseur gère le matériel, le client gère OS et applications.',
    },
    {
      q: 'Deux clients utilisent 10.0.0.0/24 sur le même routeur. Quelle technologie évite le conflit ?',
      o: ['NAT statique', 'HSRP', 'VLAN', 'VRF'],
      four: true,
      a: 'D',
      why: 'Chaque VRF possède sa propre table de routage.',
    },
  ],
  mnemo: '3-tier : Accès, Distribution, Cœur, du terminal vers le centre.',
};
