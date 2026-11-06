const S = require('../svg');

// Élection STP sur un triangle, VLAN 10, liens 1 Gbit/s (coût 4).
function schema() {
  let g = '';
  const A = [62, 10], B = [22, 34], C = [102, 34];
  g += S.line(A[0] - 4, A[1] + 3, B[0] + 4, B[1] - 3);
  g += S.line(A[0] + 4, A[1] + 3, C[0] - 4, C[1] - 3);
  g += S.line(B[0] + 7, B[1], C[0] - 7, C[1]);
  g += S.sw(...A, 14, 6);
  g += S.sw(...B, 14, 6);
  g += S.sw(...C, 14, 6);
  g += S.text(A[0], A[1] - 4.6, 'SW1 · root bridge', { anchor: 'middle', size: 2.4, bold: true });
  g += S.text(A[0] + 8.6, A[1] + 0.8, 'BID 24586 · 0011.1111.1111', { mono: true, size: 1.9, c2: true });
  g += S.text(B[0], B[1] + 6, 'SW2', { anchor: 'middle', size: 2.4, bold: true });
  g += S.text(B[0], B[1] + 9, 'BID 32778 · 0022.2222.2222', { anchor: 'middle', mono: true, size: 1.9, c2: true });
  g += S.text(C[0], C[1] + 6, 'SW3', { anchor: 'middle', size: 2.4, bold: true });
  g += S.text(C[0], C[1] + 9, 'BID 32778 · 0033.3333.3333', { anchor: 'middle', mono: true, size: 1.9, c2: true });
  const tag = (x, y, t, o = {}) => S.text(x, y, t, { size: 2.2, bold: true, anchor: 'middle', ...o });
  g += tag(51, 13.4, 'DP');
  g += tag(73, 13.4, 'DP');
  g += tag(29, 27.2, 'RP');
  g += tag(95, 27.2, 'RP');
  g += tag(33, 37.6, 'DP');
  g += tag(90, 37.6, 'ALT', { acc: true });
  g += S.line(87.4, 31.6, 87.4, 36.4, { color: S.ACC, w: 0.6 });
  g += S.text(62, 32.4, 'coût 4 par lien (1 Gbit/s)', { anchor: 'middle', size: 2, c2: true });
  g += S.text(37, 22, 'coût 4', { size: 2, c2: true, anchor: 'end' });
  g += S.text(87, 22, 'coût 4', { size: 2, c2: true });
  return S.svg(124, 45, g, 'Élection Rapid PVST+');
}

module.exports = {
  num: 14,
  domain: '2.0 Network Access',
  objectives: '2.5',
  title: 'Rapid PVST+ : élection et rôles',
  attend:
    'Interpréter le fonctionnement de Rapid PVST+ : élection du root bridge, choix des root ports, rôles et états des ports.',
  essentiel: [
    "STP supprime les boucles de couche 2 (tempêtes de broadcast, table MAC instable, trames dupliquées) en bloquant les ports redondants. Rapid PVST+ : une instance RSTP (802.1w) par VLAN.",
    "Bridge ID = priorité (32768 par défaut) + extended system ID (numéro de VLAN) + MAC. VLAN 10 : 32768 + 10 = 32778. La priorité se règle par pas de 4096. Le plus petit BID devient root bridge.",
    "Root port (RP) : sur chaque switch non root, le port au plus faible coût cumulé vers le root. Départage : coût, puis BID du voisin, puis priorité de port du voisin (128 par défaut), puis numéro de port du voisin.",
    "Coûts par défaut : 10 Mbit/s = 100, 100 Mbit/s = 19, 1 Gbit/s = 4, 10 Gbit/s = 2.",
    "Designated port (DP) : un par segment, côté du meilleur chemin vers le root ; tous les ports du root sont DP. Les autres sont alternate (secours du RP) ou backup (secours d'un DP sur le même segment), en discarding.",
    "États RSTP : discarding, learning, forwarding. Convergence rapide par échange proposition / accord sur les liens point à point. Timers : hello 2 s, max age 20 s, forward delay 15 s.",
  ],
  schema: schema(),
  caption:
    "SW1 (priorité 24576 + 10) est root. Sur le lien SW2–SW3, SW2 l'emporte par sa MAC plus faible : son port est DP, celui de SW3 est alternate.",
  commandes: [
    ['SW1(config)# spanning-tree mode rapid-pvst', 'Active Rapid PVST+'],
    ['SW1(config)# spanning-tree vlan 10 root primary', 'Priorité 24576 ou moins'],
    ['SW2(config)# spanning-tree vlan 10 root secondary', 'Priorité 28672'],
    ['SW1(config)# spanning-tree vlan 10 priority 4096', 'Priorité fixée (multiple de 4096)'],
    ['SW3(config-if)# spanning-tree vlan 10 cost 10', 'Coût du port'],
    ['SW1# show spanning-tree vlan 10', 'Root, rôles, états, coûts', true],
    ['SW1# show spanning-tree root', 'Root de chaque VLAN', true],
  ],
  pieges: [
    'Le root bridge est le plus petit BID, pas la plus haute priorité ni le switch le plus récent.',
    '<code>spanning-tree vlan 10 priority 30000</code> est refusé : la priorité est un multiple de 4096.',
    "Le root bridge n'a aucun root port : tous ses ports sont designated.",
  ],
  qcm: [
    {
      q: 'Priorité laissée par défaut : quelle valeur affiche <code>show spanning-tree vlan 20</code> ?',
      o: ['32768', '32788', '32748', '4096'],
      four: true,
      a: 'B',
      why: '32768 + extended system ID 20 = 32788.',
    },
    {
      q: 'Priorités par défaut ; MAC : SW1 0011.0000.0003, SW2 0011.0000.0001, SW3 0011.0000.0002. Quel switch est root ?',
      o: ['SW3', 'SW1', 'SW2', 'Le premier démarré'],
      a: 'C',
      why: 'Priorités égales : la plus petite MAC l\'emporte.',
    },
    {
      q: 'Quel rôle RSTP désigne le port de secours du root port ?',
      o: ['Designated', 'Backup', 'Disabled', 'Alternate'],
      four: true,
      a: 'D',
      why: 'Alternate : autre chemin vers le root. Backup : secours d\'un DP sur le même segment.',
    },
  ],
  mnemo: 'Root : le plus petit BID. RP : le chemin le moins cher vers lui. DP : un par segment.',
};
