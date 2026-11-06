const S = require('../svg');

// Trunk 802.1Q entre deux switchs + structure de l'étiquette.
function schema() {
  let g = '';
  const y = 9;
  g += S.sw(12, y, 14, 6);
  g += S.sw(112, y, 14, 6);
  g += S.text(12, y - 4.4, 'SW1', { anchor: 'middle', size: 2.4, bold: true });
  g += S.text(112, y - 4.4, 'SW2', { anchor: 'middle', size: 2.4, bold: true });
  g += S.line(19, y, 105, y, { w: 0.5 });
  g += S.text(62, y - 1.6, 'trunk 802.1Q · native VLAN 999 · allowed 10,20,999', { anchor: 'middle', mono: true, size: 2 });
  const fr = (x, tag) => {
    let s = '';
    if (tag) s += S.box(x, y + 4.4, 8, 3.4, tag, { mono: true, size: 1.9, fill: S.FILL, bold: true });
    s += S.box(x + 8, y + 4.4, 8, 3.4, 'trame', { size: 1.9 });
    return s;
  };
  g += fr(30, '10');
  g += fr(54, '20');
  g += fr(78, '');
  g += S.text(82, y + 9.6, 'native : sans étiquette', { anchor: 'middle', size: 2, c2: true });
  // en-tête
  const ty = 26, x0 = 2;
  const cells = [[16, 'MAC dest.', '6 o'], [16, 'MAC source', '6 o'], [22, '802.1Q', '4 o', true], [16, 'EtherType', '2 o'], [32, 'Données', '46–1500 o'], [10, 'FCS', '4 o']];
  let x = x0, tagX = 0;
  for (const [w, t, sz, hl] of cells) {
    g += S.box(x + w / 2, ty, w, 5, t, { size: 2.2, fill: hl ? S.FILL : S.PAPER, bold: hl });
    g += S.text(x + w / 2, ty + 5.2, sz, { anchor: 'middle', size: 1.9, c2: true });
    if (hl) tagX = x;
    x += w;
  }
  const sub = [[22, 'TPID 0x8100', '16 bits'], [16, 'PCP', '3 bits'], [10, 'DEI', '1'], [34, 'VID (VLAN ID)', '12 bits']];
  const sy = 40;
  let sx = 20;
  g += S.line(tagX, ty + 2.5, 20, sy - 2.5, { color: S.INK2, dash: '0.6 0.5' });
  g += S.line(tagX + 22, ty + 2.5, 102, sy - 2.5, { color: S.INK2, dash: '0.6 0.5' });
  for (const [w, t, b] of sub) {
    g += S.box(sx + w / 2, sy, w, 5, t, { size: 2.1, mono: t.startsWith('TPID') });
    g += S.text(sx + w / 2, sy + 5.2, b, { anchor: 'middle', size: 1.9, c2: true });
    sx += w;
  }
  return S.svg(124, 47, g, 'Trunk et étiquette 802.1Q');
}

module.exports = {
  num: 10,
  domain: '2.0 Network Access',
  objectives: '2.2',
  title: 'Trunk 802.1Q et native VLAN',
  attend:
    "Configurer et vérifier les trunks 802.1Q entre switchs, la liste des VLAN autorisés et le native VLAN.",
  essentiel: [
    "Trunk : lien qui transporte plusieurs VLAN. 802.1Q insère une étiquette de 4 octets (TPID <code>0x8100</code>, PCP 3 bits pour la CoS, DEI 1 bit, VID 12 bits) entre la MAC source et l'EtherType, puis recalcule le FCS.",
    "Native VLAN (VLAN natif, VLAN 1 par défaut) : ses trames circulent sans étiquette. Il doit être identique aux deux extrémités ; sinon CDP signale un native VLAN mismatch et le trafic natif change de VLAN.",
    "DTP (Dynamic Trunking Protocol) : auto + auto = access ; desirable + auto ou desirable = trunk ; trunk + auto ou desirable = trunk. Mode par défaut des Catalyst 2960 : dynamic auto.",
    "Bonne pratique : <code>switchport mode trunk</code> puis <code>switchport nonegotiate</code> pour couper DTP.",
    "VLAN autorisés : 1–4094 par défaut. <code>allowed vlan 10,20</code> remplace la liste ; <code>allowed vlan add 30</code> la complète.",
    "Sécurité : native VLAN dédié et inutilisé (ici 999) contre le VLAN hopping par double étiquetage. Sur les switchs qui gèrent aussi ISL, <code>switchport trunk encapsulation dot1q</code> précède <code>mode trunk</code>.",
  ],
  schema: schema(),
  caption:
    "Les VLAN 10 et 20 traversent le trunk étiquetés ; seul le native VLAN passe sans étiquette. En bas, place et contenu de l'étiquette 802.1Q.",
  commandes: [
    ['SW1(config-if)# switchport trunk encapsulation dot1q', 'Si le switch gère aussi ISL'],
    ['SW1(config-if)# switchport mode trunk', 'Trunk permanent'],
    ['SW1(config-if)# switchport trunk native vlan 999', 'Native VLAN'],
    ['SW1(config-if)# switchport trunk allowed vlan 10,20,999', 'Liste des VLAN autorisés'],
    ['SW1(config-if)# switchport trunk allowed vlan add 30', 'Ajoute le VLAN 30'],
    ['SW1(config-if)# switchport nonegotiate', 'Désactive DTP'],
    ['SW1# show interfaces trunk', 'Trunks, native, VLAN actifs', true],
    ['SW1# show interfaces g0/1 switchport', 'Mode administratif et opérationnel', true],
  ],
  pieges: [
    "<code>allowed vlan 30</code> sans <code>add</code> remplace la liste : tous les autres VLAN sont coupés.",
    "Deux ports en dynamic auto ne forment pas de trunk : ils restent en accès.",
    "Native VLAN différent des deux côtés : le lien reste up, mais le trafic natif passe d'un VLAN à l'autre.",
  ],
  qcm: [
    {
      q: 'SW1 et SW2 sont reliés par deux ports en dynamic auto. Mode opérationnel du lien ?',
      o: ['Trunk', 'Access', 'Err-disabled', 'Down'],
      four: true,
      a: 'B',
      why: 'Aucun des deux côtés ne sollicite le trunk : le lien reste en accès.',
    },
    {
      q: 'Quelle est la taille de l\'étiquette 802.1Q ?',
      o: ['12 bits', '2 octets', '8 octets', '4 octets'],
      four: true,
      a: 'D',
      why: '4 octets : TPID (16 bits) + PCP, DEI, VID (16 bits). Le VID seul fait 12 bits.',
    },
    {
      q: 'Quelle commande autorise le VLAN 30 sans retirer les VLAN déjà permis ?',
      o: ['switchport trunk native vlan 30', 'switchport trunk allowed vlan 30', 'switchport trunk allowed vlan add 30', 'vlan 30'],
      one: false,
      a: 'C',
      why: 'add complète la liste ; sans add, la liste est remplacée.',
    },
  ],
  mnemo: 'Auto + auto = access : il faut qu\'un côté désire ou impose le trunk.',
};
