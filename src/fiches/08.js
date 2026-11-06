const S = require('../svg');

// Apprentissage puis inondation : PC-A envoie une trame vers PC-B.
function schema() {
  let g = '';
  const sx = 30, sy = 10;
  g += S.sw(sx, sy, 14, 6);
  g += S.text(sx, sy - 4.2, 'SW1', { anchor: 'middle', size: 2.4, bold: true });
  const hosts = [[8, 32, 'PC-A', '0011.1111.1111', 'g0/1'], [30, 32, 'PC-B', '0022.2222.2222', 'g0/2'], [52, 32, 'PC-C', '0033.3333.3333', 'g0/3']];
  for (const [x, y, n, mac, p] of hosts) {
    g += S.line(sx + (x - sx) * 0.25, sy + 3, x, y - 3);
    g += S.pc(x, y);
    g += S.text(x, y + 5.4, n, { anchor: 'middle', size: 2.3, bold: true });
    g += S.text(x, y + 8.2, mac, { anchor: 'middle', mono: true, size: 1.9, c2: true });
  }
  g += S.text(18.4, 17.6, 'g0/1', { anchor: 'end', mono: true, size: 1.9, c2: true });
  g += S.text(26.6, 21.5, 'g0/2', { anchor: 'end', mono: true, size: 1.9, c2: true });
  g += S.text(41.6, 17.6, 'g0/3', { mono: true, size: 1.9, c2: true });
  // flux
  g += S.line(10.5, 26.5, 22, 16, { end: 'aha', color: S.ACC, w: 0.3 });
  g += S.text(4, 21.5, '1', { size: 2.6, bold: true, acc: true });
  g += S.line(32.5, 16, 32.5, 25.6, { end: 'ah', dash: '0.8 0.6' });
  g += S.line(38, 15, 49.5, 26.4, { end: 'ah', dash: '0.8 0.6' });
  g += S.text(35.2, 23.5, '2', { size: 2.6, bold: true });
  // table MAC
  const tx = 66, ty = 6;
  g += S.text(tx, ty - 1.6, 'show mac address-table', { mono: true, size: 2.2, bold: true });
  const cols = [[0, 'Vlan'], [9, 'Mac Address'], [33, 'Type'], [48, 'Ports']];
  for (const [dx, t] of cols) g += S.text(tx + dx, ty + 3, t, { size: 2.1, bold: true });
  g += S.line(tx, ty + 4.2, 122, ty + 4.2);
  const rows = [['1', '0011.1111.1111', 'DYNAMIC', 'Gi0/1'], ['1', '0022.2222.2222', 'DYNAMIC', 'Gi0/2']];
  rows.forEach((r, i) => {
    const y = ty + 8 + i * 3.6;
    r.forEach((t, j) => (g += S.text(tx + cols[j][0], y, t, { mono: true, size: 2 })));
    g += S.line(tx, y + 1.2, 122, y + 1.2, { color: S.RULE });
  });
  g += S.text(tx, 24.6, '1  Trame A → B : SW1 apprend 0011.1111.1111 sur g0/1.', { size: 2.1 });
  g += S.text(tx, 27.6, '2  B inconnue : inondation vers g0/2 et g0/3.', { size: 2.1 });
  g += S.text(tx, 30.6, '3  B répond : SW1 apprend B ; échange unicast.', { size: 2.1 });
  g += S.text(tx, 33.6, '    PC-C ne reçoit plus rien.', { size: 2.1, c2: true });
  return S.svg(124, 42, g, 'Apprentissage et inondation MAC');
}

module.exports = {
  num: 8,
  domain: '1.0 Network Fundamentals',
  objectives: '1.13',
  title: 'Commutation et table MAC',
  attend:
    "Décrire la commutation : apprentissage et vieillissement des adresses MAC, transfert et inondation des trames, table d'adresses MAC.",
  essentiel: [
    "Apprentissage : le switch lit l'adresse MAC source de chaque trame reçue et l'associe au port et au VLAN d'entrée dans sa table MAC (CAM).",
    "Transfert : destination connue, la trame part sur le seul port associé. Si ce port est le port d'entrée, la trame est filtrée (rejetée).",
    "Inondation (flooding) : destination inconnue (unknown unicast), broadcast <code>FFFF.FFFF.FFFF</code> ou multicast non suivi, la trame est copiée sur tous les ports du VLAN sauf le port d'entrée.",
    "Vieillissement (aging) : une entrée dynamique non rafraîchie disparaît après 300 s par défaut. Une entrée statique ne vieillit pas.",
    "Modes : store-and-forward (trame entière reçue, FCS vérifié ; défaut des Catalyst), cut-through (transfert dès la MAC destination lue, latence minimale, erreurs propagées), fragment-free (64 premiers octets lus).",
    "Trame Ethernet II : MAC destination (6 o), MAC source (6 o), EtherType (2 o : <code>0x0800</code> IPv4, <code>0x86DD</code> IPv6, <code>0x8100</code> 802.1Q), données (46 à 1500 o), FCS (4 o).",
  ],
  schema: schema(),
  caption: 'Le switch apprend par la source et décide par la destination. La table ci-contre est celle obtenue après l\'étape 3.',
  commandes: [
    ['SW1# show mac address-table', 'Table MAC complète', true],
    ['SW1# show mac address-table dynamic', 'Entrées apprises seulement', true],
    ['SW1# show mac address-table interface g0/1', 'Entrées d\'un port', true],
    ['SW1# show mac address-table aging-time', 'Délai de vieillissement', true],
    ['SW1(config)# mac address-table aging-time 600', 'Délai porté à 600 s'],
    ['SW1(config)# mac address-table static 0011.1111.1111 vlan 1 interface g0/1', 'Entrée statique'],
    ['SW1# clear mac address-table dynamic', 'Vide les entrées dynamiques'],
  ],
  pieges: [
    'Le switch apprend la MAC source, jamais la MAC destination.',
    "L'inondation reste confinée au VLAN d'entrée : elle n'atteint pas les autres VLAN.",
    'Ne pas confondre : 300 s pour la table MAC d\'un switch, 4 h pour le cache ARP d\'un routeur Cisco.',
  ],
  qcm: [
    {
      q: 'Une trame arrive sur g0/1 vers une MAC absente de la table. Que fait le switch ?',
      o: ['Il la rejette', 'Il l\'inonde dans le VLAN, sauf sur g0/1', 'Il l\'envoie au routeur', 'Il émet une requête ARP'],
      a: 'B',
      why: 'Unknown unicast : inondation dans le VLAN, jamais sur le port d\'entrée.',
    },
    {
      q: 'Qu\'enregistre le switch à la réception d\'une trame ?',
      o: ['MAC destination et port', 'IP source et port', 'MAC source, port et VLAN', 'MAC source et IP source'],
      a: 'C',
      why: 'L\'apprentissage porte sur la MAC source, associée au port et au VLAN.',
    },
    {
      q: 'Délai par défaut avant la suppression d\'une entrée MAC dynamique ?',
      o: ['4 h', '60 s', 'Jamais', '300 s'],
      four: true,
      a: 'D',
      why: 'Aging time par défaut : 300 secondes.',
    },
  ],
  mnemo: 'La source pour apprendre, la destination pour décider.',
};
