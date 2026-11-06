const S = require('../svg');

// Montée d'une adjacence OSPF entre R1 et R2.
function schema() {
  let g = '';
  const L = 30, R = 104, top = 4;
  g += S.text(L, top, 'R1', { anchor: 'middle', size: 2.4, bold: true });
  g += S.text(R, top, 'R2', { anchor: 'middle', size: 2.4, bold: true });
  g += S.line(L, top + 1.4, L, 47, { color: S.INK2 });
  g += S.line(R, top + 1.4, R, 47, { color: S.INK2 });
  const steps = [
    [L, R, 'Hello (aucun voisin connu)', 'Down → Init'],
    [R, L, 'Hello listant le RID de R1', '2-Way'],
    [L, R, 'DBD vides : maître / esclave', 'ExStart'],
    [R, L, 'DBD : résumé de la LSDB', 'Exchange'],
    [L, R, 'LSR : LSA manquants', 'Loading'],
    [R, L, 'LSU, puis LSAck', 'Loading'],
    [L, R, 'LSDB identiques', 'Full'],
  ];
  steps.forEach(([a, b, t, st], i) => {
    const y = 8.5 + i * 5.6;
    g += S.line(a, y, b, y + 2, { end: 'ah', w: 0.25, dash: i === 6 ? '0.8 0.6' : null });
    g += S.text((a + b) / 2, y - 0.4, t, { anchor: 'middle', size: 2.1 });
    g += S.text(L - 3, y + 1.6, st, { anchor: 'end', size: 2.2, bold: true, acc: st === 'Full' });
  });
  g += S.text(R + 3, 10.5, '224.0.0.5', { mono: true, size: 1.9, c2: true });
  g += S.text(R + 3, 13.2, 'toutes', { size: 1.9, c2: true });
  g += S.text(R + 3, 15.6, 'les 10 s', { size: 1.9, c2: true });
  return S.svg(124, 48, g, 'États OSPF');
}

module.exports = {
  num: 22,
  domain: '3.0 IP Connectivity',
  objectives: '3.4',
  title: 'OSPFv2 : voisinage et états',
  attend:
    "Décrire la formation des adjacences OSPFv2 : paquets Hello, conditions d'adjacence et états des voisins.",
  essentiel: [
    "OSPF : protocole à état de liens. Tous les routeurs d'une aire partagent une LSDB identique et calculent leurs meilleurs chemins par l'algorithme SPF (Dijkstra). Protocole IP 89 ; Hello vers <code>224.0.0.5</code>, DR et BDR écoutent aussi <code>224.0.0.6</code>.",
    "Cinq types de paquets : Hello (1), DBD (2), LSR (3), LSU (4), LSAck (5).",
    "Conditions d'adjacence : même sous-réseau et masque, même area ID, mêmes timers Hello et Dead, même authentification, même MTU, router ID distincts.",
    "Timers : Hello 10 s, Dead 40 s (4 × Hello) sur les réseaux broadcast et point-to-point.",
    "États : Down, Init (Hello reçu), 2-Way (son propre RID lu dans le Hello du voisin ; élection DR/BDR), ExStart (choix maître / esclave), Exchange (DBD), Loading (LSR, LSU), Full (LSDB synchronisées).",
    "Sur un segment broadcast, deux DROther restent en 2-Way entre eux : état stable et normal.",
  ],
  schema: schema(),
  caption:
    "Chaque étape fait avancer l'état du voisin. Une MTU différente bloque l'échange en ExStart ou Exchange.",
  commandes: [
    ['R1# show ip ospf neighbor', 'État, Dead time, rôle DR/BDR', true],
    ['R1# show ip ospf interface g0/0/1', 'Aire, timers, type de réseau', true],
    ['R1# show ip ospf database', 'Contenu de la LSDB', true],
    ['R1(config-if)# ip ospf hello-interval 5', 'Hello à 5 s (Dead suit à 20 s)'],
    ['R1(config-if)# ip ospf dead-interval 20', 'Dead interval explicite'],
    ['R1# debug ip ospf adj', 'Suivi des transitions d\'état', true],
  ],
  pieges: [
    'Voisin bloqué en ExStart ou Exchange : MTU différente aux deux extrémités.',
    '2-Way entre deux DROther : situation normale, pas une panne.',
    'Hello modifié d\'un seul côté : le Dead suit (× 4), les timers ne correspondent plus, l\'adjacence tombe.',
  ],
  qcm: [
    {
      q: 'Deux routeurs restent bloqués en EXSTART. Cause la plus probable ?',
      o: ['Process ID différents', 'Area ID différente', 'MTU différente', 'Priorité à 0'],
      a: 'C',
      why: 'Les DBD dépassant la MTU du voisin sont ignorés : l\'échange ne progresse pas.',
    },
    {
      q: 'Dead interval par défaut sur une interface Ethernet ?',
      o: ['40 s', '10 s', '30 s', '120 s'],
      four: true,
      a: 'A',
      why: 'Dead = 4 × Hello, soit 40 s pour un Hello de 10 s.',
    },
    {
      q: 'À quel état un routeur lit-il son propre RID dans le Hello du voisin ?',
      o: ['Init', '2-Way', 'ExStart', 'Full'],
      four: true,
      a: 'B',
      why: '2-Way : la communication bidirectionnelle est confirmée.',
    },
  ],
  mnemo: 'Hello 10, Dead 40 : le Dead vaut quatre Hello.',
};
