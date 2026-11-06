const S = require('../svg');

// Port-channel LACP et matrice des modes.
function schema() {
  let g = '';
  const y = 11;
  g += S.sw(12, y, 14, 7);
  g += S.sw(112, y, 14, 7);
  g += S.text(12, y - 5, 'SW1', { anchor: 'middle', size: 2.4, bold: true });
  g += S.text(112, y - 5, 'SW2', { anchor: 'middle', size: 2.4, bold: true });
  for (const d of [-2.4, -0.8, 0.8, 2.4]) g += S.line(19, y + d, 105, y + d);
  g += `<ellipse cx="62" cy="${y}" rx="7" ry="4.6" fill="none" stroke="${S.INK}" stroke-width="${S.SW}"/>`;
  g += S.text(62, y - 6, 'Port-channel 1', { anchor: 'middle', size: 2.3, bold: true });
  g += S.text(21, y + 6.4, 'g0/1 – g0/4 · mode active', { mono: true, size: 2 });
  g += S.text(103, y + 6.4, 'mode passive', { anchor: 'end', mono: true, size: 2 });
  // matrice
  const mx = 40, my = 27, cw = 18, rh = 3.8;
  const modes = ['active', 'passive', 'on'];
  g += S.text(mx - 2, my, 'SW1 \\ SW2', { anchor: 'end', size: 2.1, c2: true });
  modes.forEach((m, i) => (g += S.text(mx + cw * i + cw / 2, my, m, { anchor: 'middle', mono: true, size: 2.1, bold: true })));
  g += S.line(mx - 22, my + 1.2, mx + 3 * cw, my + 1.2);
  const ok = [[1, 1, 0], [1, 0, 0], [0, 0, 1]];
  modes.forEach((m, r) => {
    const yy = my + 4.6 + r * rh;
    g += S.text(mx - 2, yy, m, { anchor: 'end', mono: true, size: 2.1, bold: true });
    ok[r].forEach((v, c) => (g += S.text(mx + cw * c + cw / 2, yy, v ? 'canal' : '—', { anchor: 'middle', size: 2.1, bold: !!v, c2: !v })));
    g += S.line(mx - 22, yy + 1.2, mx + 3 * cw, yy + 1.2, { color: S.RULE });
  });
  g += S.text(98, my + 4.6, 'LACP : active / passive', { size: 2.1, c2: true });
  g += S.text(98, my + 8.4, 'PAgP : desirable / auto', { size: 2.1, c2: true });
  g += S.text(98, my + 12.2, 'on : aucun protocole', { size: 2.1, c2: true });
  return S.svg(124, 43, g, 'EtherChannel LACP');
}

module.exports = {
  num: 13,
  domain: '2.0 Network Access',
  objectives: '2.4',
  title: 'EtherChannel LACP',
  attend: 'Configurer et vérifier un EtherChannel de couche 2 ou de couche 3 négocié par LACP.',
  essentiel: [
    "EtherChannel : jusqu'à 8 liens physiques actifs regroupés en un lien logique (Port-channel). STP n'y voit qu'un port : aucun lien n'est bloqué, et la perte d'un membre ne coupe pas le canal.",
    "LACP (IEEE 802.3ad) : modes active (initie) et passive (répond). Au moins un côté doit être active. PAgP (Cisco) : desirable et auto. Mode <code>on</code> : canal forcé sans négociation, à configurer des deux côtés.",
    "Membres identiques exigés : vitesse, duplex, mode access ou trunk, VLAN d'accès, VLAN autorisés et native VLAN. Un membre divergent est suspendu.",
    "Répartition de charge par flux, selon un hachage des adresses MAC ou IP (<code>port-channel load-balance</code>). Un même flux emprunte toujours un seul lien.",
    "La configuration de <code>interface port-channel 1</code> (trunk, VLAN) s'applique aux membres : on configure le Port-channel, pas chaque port.",
    "EtherChannel L3 : <code>no switchport</code> sur les membres et sur le Port-channel, adresse IP sur le Port-channel.",
  ],
  schema: schema(),
  caption:
    "Quatre liens deviennent Po1. Le canal ne se forme que si au moins un côté initie (active) ou si les deux sont forcés en on.",
  commandes: [
    ['SW1(config)# interface range g0/1 - 4', 'Sélectionne les membres'],
    ['SW1(config-if-range)# channel-group 1 mode active', 'LACP, initie la négociation'],
    ['SW1(config)# interface port-channel 1', 'Interface logique Po1'],
    ['SW1(config-if)# switchport mode trunk', 'Appliqué à tous les membres'],
    ['SW1(config)# port-channel load-balance src-dst-ip', 'Hachage sur les IP'],
    ['SW1# show etherchannel summary', 'Canaux, protocole, flags', true],
    ['SW1# show lacp neighbor', 'Partenaires LACP', true],
    ['SW1# show etherchannel load-balance', 'Méthode de hachage', true],
  ],
  pieges: [
    'passive + passive : aucun canal. Au moins un côté doit être en active.',
    '<code>on</code> ne négocie rien : face à active ou desirable, le canal ne se forme pas.',
    'Flags de <code>show etherchannel summary</code> : P = membre actif, s = suspendu, I = isolé ; SU = Po L2 en service, RU = Po L3.',
  ],
  qcm: [
    {
      q: 'SW1 et SW2 sont tous deux en <code>channel-group 1 mode passive</code>. Résultat ?',
      o: ['Canal LACP', 'Aucun canal', 'Canal PAgP', 'Err-disabled'],
      four: true,
      a: 'B',
      why: 'En passive, aucun côté n\'initie la négociation LACP.',
    },
    {
      q: 'Dans <code>show etherchannel summary</code>, que signifie le flag P sur un membre ?',
      o: ['Port suspendu', 'Port isolé', 'Négocié en PAgP', 'Intégré au Port-channel'],
      a: 'D',
      why: 'P = bundled in port-channel : membre actif.',
    },
    {
      q: 'Quelle norme définit LACP ?',
      o: ['802.1D', '802.1w', '802.3ad', '802.1Q'],
      four: true,
      a: 'C',
      why: '802.3ad (repris dans 802.1AX). 802.1w : RSTP ; 802.1Q : trunk.',
    },
  ],
  mnemo: 'Active parle, passive écoute : deux qui écoutent ne se parlent jamais.',
};
