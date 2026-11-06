const S = require('../svg');

// Passerelle virtuelle HSRP + comparatif des trois FHRP.
function schema() {
  let g = '';
  g += S.router(30, 8);
  g += S.router(94, 8);
  g += S.text(30, 2.4, 'R1 · actif', { anchor: 'middle', size: 2.3, bold: true });
  g += S.text(94, 2.4, 'R2 · standby', { anchor: 'middle', size: 2.3, bold: true });
  g += S.text(36, 9, '.2 · prio 110', { mono: true, size: 1.9, c2: true });
  g += S.text(88, 9, '.3 · prio 100', { anchor: 'end', mono: true, size: 1.9, c2: true });
  g += `<circle cx="62" cy="8" r="4" fill="none" stroke="${S.INK}" stroke-width="${S.SW}" stroke-dasharray="0.8 0.6"/>`;
  g += S.text(62, 8.8, '.1', { anchor: 'middle', mono: true, size: 2.1, bold: true });
  g += S.text(62, 2.4, 'IP virtuelle', { anchor: 'middle', size: 2.1, acc: true });
  g += S.line(30, 12, 30, 16) + S.line(94, 12, 94, 16) + S.line(18, 16, 100, 16);
  g += S.text(101.5, 16.8, '192.168.10.0/24', { mono: true, size: 1.9, c2: true });
  for (const x of [44, 62, 80]) { g += S.line(x, 16, x, 18.6); g += S.pc(x, 21); }
  g += S.text(86, 22, 'passerelle : .1', { size: 2.1 });
  // tableau
  const ty = 30, cols = [2, 26, 56, 86];
  ['', 'HSRP', 'VRRP', 'GLBP'].forEach((t, i) => (g += S.text(cols[i], ty, t, { size: 2.3, bold: true })));
  g += S.line(2, ty + 1.2, 122, ty + 1.2);
  const rows = [
    ['Norme', 'Cisco', 'IETF (RFC 5798)', 'Cisco'],
    ['Rôles', 'actif / standby', 'master / backup', 'AVG + AVF'],
    ['Préemption', 'non par défaut', 'oui par défaut', 'non par défaut'],
    ['MAC virtuelle', '0000.0C07.ACxx (v1)', '0000.5E00.01xx', '0007.B400.xxyy'],
  ];
  rows.forEach((r, j) => {
    const y = ty + 4.4 + j * 3.6;
    r.forEach((t, i) => (g += S.text(cols[i], y, t, { size: 2.1, mono: j === 3 && i > 0, c2: i === 0 })));
    g += S.line(2, y + 1.1, 122, y + 1.1, { color: S.RULE });
  });
  return S.svg(124, 46, g, 'FHRP');
}

module.exports = {
  num: 26,
  domain: '3.0 IP Connectivity',
  objectives: '3.5',
  title: 'FHRP : HSRP, VRRP, GLBP',
  attend:
    'Décrire le rôle, les fonctions et les concepts des protocoles de redondance du premier saut : HSRP, VRRP et GLBP.',
  essentiel: [
    "Un hôte ne connaît qu'une passerelle par défaut : si ce routeur tombe, il perd tout accès hors de son sous-réseau. Un FHRP (First Hop Redundancy Protocol) présente une passerelle virtuelle, IP et MAC, portée par plusieurs routeurs.",
    "HSRP (Cisco) : un routeur actif, un standby. Priorité 100 par défaut, la plus haute gagne, puis l'IP la plus haute. Préemption désactivée par défaut. Hello 3 s, hold 10 s. Multicast <code>224.0.0.2</code> (v1), <code>224.0.0.102</code> (v2).",
    "VRRP (standard IETF) : un master, des backups ; priorité 100, préemption activée par défaut. L'IP virtuelle peut être l'adresse réelle d'un routeur (propriétaire, priorité 255). Multicast <code>224.0.0.18</code>.",
    "GLBP (Cisco) : l'AVG répond aux requêtes ARP en distribuant des MAC virtuelles différentes ; jusqu'à 4 AVF transmettent. Partage de charge au sein d'un seul groupe.",
    "HSRP et VRRP : partage de charge possible avec plusieurs groupes (par exemple un par VLAN), chacun avec un actif différent.",
    "Suivi d'objet (tracking) : la priorité baisse si le lien amont tombe ; avec la préemption, l'autre routeur prend le relais.",
  ],
  schema: schema(),
  caption:
    "Les PC utilisent .1, adresse que R1 porte tant qu'il est actif. En cas de panne, R2 reprend la même IP et la même MAC virtuelles.",
  commandes: [
    ['R1(config-if)# standby version 2', 'Passe en HSRPv2'],
    ['R1(config-if)# standby 10 ip 192.168.10.1', 'IP virtuelle du groupe 10'],
    ['R1(config-if)# standby 10 priority 110', 'Priorité (100 par défaut)'],
    ['R1(config-if)# standby 10 preempt', 'Reprend le rôle actif'],
    ['R1# show standby brief', 'Rôle, priorité, IP virtuelle', true],
    ['R1# show standby', 'MAC virtuelle, timers', true],
    ['R1# show vrrp brief', 'État des groupes VRRP', true],
  ],
  pieges: [
    "HSRP sans <code>preempt</code> : le routeur le plus prioritaire, de retour après une panne, reste standby.",
    "Les hôtes pointent vers l'IP virtuelle, jamais vers l'adresse réelle d'un routeur.",
    'VRRP préempte par défaut, HSRP non.',
  ],
  qcm: [
    {
      q: 'Quel FHRP est une norme IETF ?',
      o: ['HSRP', 'GLBP', 'VRRP', 'PAgP'],
      four: true,
      a: 'C',
      why: 'VRRP (RFC 5798). HSRP et GLBP sont propriétaires Cisco ; PAgP concerne EtherChannel.',
    },
    {
      q: 'Quelle est la MAC virtuelle HSRPv1 du groupe 10 ?',
      o: ['0000.0C07.AC10', '0000.0C07.AC0A', '0000.5E00.010A', '0007.B400.0A01'],
      a: 'B',
      why: 'Le dernier octet est le groupe en hexadécimal : 10 = 0x0A.',
    },
    {
      q: 'Quel protocole répartit la charge dans un seul groupe en attribuant plusieurs MAC virtuelles ?',
      o: ['HSRP', 'VRRP', 'LACP', 'GLBP'],
      four: true,
      a: 'D',
      why: 'L\'AVG de GLBP distribue les MAC des AVF aux hôtes.',
    },
  ],
  mnemo: 'HSRP n\'insiste pas (pas de préemption), VRRP reprend sa place.',
};
