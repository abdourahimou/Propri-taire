const S = require('../svg');

// Élection DR/BDR sur un segment Ethernet partagé.
function schema() {
  let g = '';
  const ys = 16;
  g += S.line(8, ys, 116, ys, { w: 0.5 });
  g += S.text(116, ys - 1.4, '10.0.0.0/24', { anchor: 'end', mono: true, size: 2 });
  const R = [
    [18, 'R1', 1, '1.1.1.1', 'DROther'],
    [46, 'R2', 100, '2.2.2.2', 'DR'],
    [74, 'R3', 50, '3.3.3.3', 'BDR'],
    [102, 'R4', 0, '4.4.4.4', 'DROther'],
  ];
  for (const [x, n, p, rid, role] of R) {
    g += S.line(x, 9.5, x, ys);
    g += S.router(x, 6);
    g += S.text(x + 4.8, 5, n, { size: 2.4, bold: true });
    g += S.text(x, ys + 4, 'prio ' + p, { anchor: 'middle', mono: true, size: 2 });
    g += S.text(x, ys + 6.8, 'RID ' + rid, { anchor: 'middle', mono: true, size: 1.9, c2: true });
    g += S.text(x, ys + 10, role, { anchor: 'middle', size: 2.4, bold: true, acc: role === 'DR' });
  }
  // sortie de R1
  const ty = 33;
  g += S.line(2, ty - 3, 122, ty - 3, { color: S.RULE });
  g += S.text(2, ty, 'R1# show ip ospf neighbor', { mono: true, size: 2.1, bold: true });
  const cols = [2, 22, 32, 52];
  ['Neighbor ID', 'Pri', 'State', 'Address'].forEach((t, i) => (g += S.text(cols[i], ty + 3.6, t, { mono: true, size: 1.9, bold: true })));
  [['2.2.2.2', '100', 'FULL/DR', '10.0.0.2'], ['3.3.3.3', '50', 'FULL/BDR', '10.0.0.3'], ['4.4.4.4', '0', '2WAY/DROTHER', '10.0.0.4']].forEach((r, j) =>
    r.forEach((t, i) => (g += S.text(cols[i], ty + 6.8 + j * 3, t, { mono: true, size: 1.9 }))));
  g += S.text(72, ty + 6.8, 'Full avec DR et BDR seulement ;', { size: 2.1, c2: true });
  g += S.text(72, ty + 9.8, '2-Way entre DROther.', { size: 2.1, c2: true });
  return S.svg(124, 46, g, 'Élection DR et BDR');
}

module.exports = {
  num: 24,
  domain: '3.0 IP Connectivity',
  objectives: '3.4',
  title: 'OSPF : DR, BDR, types réseau',
  attend:
    "Configurer et vérifier l'élection DR/BDR, et les types de réseau OSPF broadcast et point-to-point.",
  essentiel: [
    "Réseau broadcast (Ethernet, type par défaut) : élection d'un DR (Designated Router) et d'un BDR pour limiter le nombre d'adjacences. Les DROther ne passent en Full qu'avec le DR et le BDR.",
    "Les DROther envoient leurs mises à jour au DR et au BDR sur <code>224.0.0.6</code> ; le DR les rediffuse à tous sur <code>224.0.0.5</code>.",
    "Élection : priorité d'interface la plus haute (1 par défaut, de 0 à 255), puis RID le plus élevé. Priorité 0 : jamais DR ni BDR.",
    "Élection non préemptive : un routeur plus prioritaire arrivé ensuite ne prend pas la place. Si le DR tombe, le BDR devient DR et un nouveau BDR est élu.",
    "Point-to-point (liaison série, ou Ethernet avec <code>ip ospf network point-to-point</code>) : pas d'élection, passage direct en Full. Recommandé entre deux routeurs sur Ethernet.",
    "Le DR est élu par segment : un routeur peut être DR sur une interface et DROther sur une autre.",
  ],
  schema: schema(),
  caption:
    "R2 (priorité 100) est DR, R3 (50) BDR. R4, en priorité 0, ne peut être élu. R1 ne forme une adjacence complète qu'avec R2 et R3.",
  commandes: [
    ['R2(config-if)# ip ospf priority 100', 'Favorise l\'élection en DR'],
    ['R4(config-if)# ip ospf priority 0', 'Exclut de l\'élection'],
    ['R1(config-if)# ip ospf network point-to-point', 'Supprime l\'élection sur le lien'],
    ['R1# clear ip ospf process', 'Relance l\'élection'],
    ['R1# show ip ospf neighbor', 'FULL/DR, FULL/BDR, 2WAY/DROTHER', true],
    ['R1# show ip ospf interface g0/0/0', 'Type réseau, priorité, DR, BDR', true],
    ['R1# show ip ospf interface brief', 'État par interface (DR, P2P…)', true],
  ],
  pieges: [
    "Augmenter la priorité ne suffit pas : l'élection n'est pas préemptive.",
    "Priorité 0 n'empêche pas les adjacences : le routeur reste DROther, en Full avec DR et BDR.",
    "En point-to-point, <code>show ip ospf neighbor</code> affiche <code>FULL/  -</code> : ni DR ni BDR.",
  ],
  qcm: [
    {
      q: 'Priorités par défaut, démarrage simultané. RID : R1 1.1.1.1, R2 2.2.2.2, R3 3.3.3.3. Qui devient DR ?',
      o: ['R1', 'R2', 'R3', 'Aucun'],
      four: true,
      a: 'C',
      why: 'Priorités égales : le RID le plus élevé l\'emporte.',
    },
    {
      q: 'Quel réglage empêche un routeur de devenir DR ou BDR ?',
      o: ['ip ospf priority 0', 'ip ospf priority 255', 'ip ospf priority 1', 'ip ospf cost 0'],
      a: 'A',
      why: 'Priorité 0 : exclusion de l\'élection.',
    },
    {
      q: 'R1 est DROther. Quel état affiche-t-il pour un autre DROther ?',
      o: ['FULL/DROTHER', 'INIT/DROTHER', 'EXSTART/DROTHER', '2WAY/DROTHER'],
      a: 'D',
      why: 'Deux DROther s\'arrêtent en 2-Way ; seuls DR et BDR passent en Full.',
    },
  ],
  mnemo: 'Priorité d\'abord, RID ensuite ; 0 ne gagne jamais ; aucune préemption.',
};
