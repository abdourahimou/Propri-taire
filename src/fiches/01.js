const S = require('../svg');

// Réseau de campus : du FAI aux terminaux alimentés en PoE.
function schema() {
  let g = '';
  const y = 9;
  g += `<ellipse cx="8" cy="${y}" rx="6.5" ry="4.2" fill="none" stroke="${S.INK2}" stroke-width="${S.SW}" stroke-dasharray="1 0.8"/>`;
  g += S.text(8, y + 0.9, 'FAI', { anchor: 'middle', size: 2.4, bold: true, c2: true });
  g += S.line(14.5, y, 27, y);
  g += S.router(31, y);
  g += S.text(31, y - 5.4, 'Routeur', { anchor: 'middle', size: 2.3, bold: true });
  g += S.line(35, y, 51.5, y);
  g += S.fw(56, y);
  g += S.text(56, y - 4.6, 'NGFW / IPS', { anchor: 'middle', size: 2.3, bold: true });
  g += S.line(60.5, y, 76.5, y);
  g += S.sw(82, y);
  g += S.text(82, y - 4.2, 'Switch L3', { anchor: 'middle', size: 2.3, bold: true });
  // WLC + serveurs
  g += S.line(87.5, y, 101, y);
  g += S.box(106, y, 10, 5, 'WLC', { bold: true });
  g += S.line(85, y + 2.7, 101, 22);
  g += S.server(104, 22);
  g += S.server(110, 22);
  g += S.text(113, 23, 'Serveurs', { size: 2.2, c2: true });
  // Accès
  g += S.line(82, y + 2.7, 50, 25.3);
  g += S.sw(44.5, 28);
  g += S.text(37.5, 29, 'Switch L2', { anchor: 'end', size: 2.3, bold: true });
  g += S.text(37.5, 32, 'accès, PoE', { anchor: 'end', size: 2.2, c2: true });
  const ends = [[22, 'PC'], [38, 'Tél. IP'], [54, 'AP'], [70, 'Caméra']];
  for (const [x, l] of ends) {
    g += S.line(44.5, 30.7, x, 38);
    if (l === 'PC') g += S.pc(x, 40);
    else g += S.box(x, 40, l === 'Caméra' ? 11 : 9, 4.4, l, { size: 2.2 });
    if (l !== 'PC') g += S.text(x, 45.6, 'PoE', { anchor: 'middle', size: 2, acc: true });
  }
  g += S.text(22, 45.6, 'terminal', { anchor: 'middle', size: 2, c2: true });
  g += S.line(54, 37.8, 100, 12, { dash: '0.8 0.6', w: 0.2 });
  g += S.text(88, 30, 'tunnel CAPWAP', { size: 2.1, c2: true });
  g += S.text(88, 32.8, 'AP léger ↔ WLC', { size: 2.1, c2: true });
  return S.svg(124, 47, g, 'Composants d\'un réseau de campus');
}

module.exports = {
  num: 1,
  domain: '1.0 Network Fundamentals',
  objectives: '1.1',
  title: 'Composants réseau et leurs rôles',
  attend:
    "Expliquer le rôle et la fonction des composants réseau : routeurs, switchs L2 et L3, NGFW et IPS, points d'accès, contrôleurs, terminaux, serveurs et PoE.",
  essentiel: [
    "Routeur : relie des réseaux IP distincts et choisit le chemin selon l'adresse IP de destination (couche 3). Chaque interface délimite un domaine de broadcast.",
    "Switch L2 : commute les trames selon l'adresse MAC de destination (couche 2) ; chaque port forme un domaine de collision. Switch L3 (multilayer) : ajoute le routage entre VLAN par des SVI, en matériel.",
    "NGFW (Next-Generation Firewall, pare-feu nouvelle génération) : filtrage avec état (stateful), contrôle applicatif, IPS intégré, filtrage d'URL. IPS : en coupure (inline), bloque selon des signatures ; l'IDS analyse une copie et alerte.",
    "AP autonome : configuré un par un. AP léger (lightweight) : piloté par un WLC (Wireless LAN Controller) via CAPWAP. Catalyst Center : contrôleur SDN, gestion centralisée par API.",
    "Terminaux (endpoints) : PC, téléphones IP, imprimantes, IoT, source et destination du trafic. Serveurs : services DHCP, DNS, web, fichiers.",
    "PoE (Power over Ethernet) : le switch alimente AP, téléphones et caméras par le câble cuivre. 802.3af : 15,4 W par port ; 802.3at (PoE+) : 30 W ; 802.3bt : 60 W (type 3) ou 90 W (type 4).",
  ],
  schema: schema(),
  caption:
    "Chaîne type d'un campus. Le switch d'accès alimente les terminaux PoE ; l'AP léger renvoie le trafic de contrôle au WLC par un tunnel CAPWAP.",
  commandes: [
    ['R1# show version', 'Modèle, version IOS, interfaces', true],
    ['SW1# show cdp neighbors', 'Type des voisins (R, S, I, P)', true],
    ['SW1(config-if)# power inline auto', 'PoE négocié (valeur par défaut)'],
    ['SW1(config-if)# power inline never', 'Coupe le PoE sur le port'],
    ['SW1# show power inline', 'Watts alloués par port PoE', true],
    ['SW1# show mac address-table', 'Table MAC du switch L2', true],
  ],
  pieges: [
    "Un switch L2 sépare les domaines de collision, pas les domaines de broadcast : il faut un routeur ou des VLAN.",
    "IDS et IPS ne sont pas équivalents : l'IDS reçoit une copie du trafic (SPAN) et ne bloque rien ; l'IPS est en coupure.",
    "Un AP léger en mode local dépend du WLC : son trafic remonte par CAPWAP. Seul le mode FlexConnect commute en local.",
  ],
  qcm: [
    {
      q: 'Quel équipement analyse le trafic en coupure et bloque une attaque reconnue par signature ?',
      o: ['IDS', 'IPS', 'Switch L2', 'WLC'],
      four: true,
      a: 'B',
      why: "L'IPS est inline et peut rejeter le trafic ; l'IDS ne fait qu'alerter.",
    },
    {
      q: 'Quelle norme fournit jusqu\'à 30 W par port pour alimenter un AP ?',
      o: ['802.3af', '802.1Q', '802.3at', '802.3ad'],
      four: true,
      a: 'C',
      why: '802.3at (PoE+) : 30 W. 802.3af : 15,4 W ; 802.3ad : agrégation de liens.',
    },
    {
      q: 'Quel élément délimite un domaine de broadcast ?',
      o: ['Un hub', 'Un port de switch L2', 'Un point d\'accès', 'Une interface de routeur'],
      four: false,
      a: 'D',
      why: 'Le routeur ne relaie pas les broadcasts ; chaque interface est un domaine distinct.',
    },
  ],
  mnemo: 'PoE : af 15,4 W · at 30 W · bt 60 ou 90 W ; l\'alphabet monte, la puissance aussi.',
};
