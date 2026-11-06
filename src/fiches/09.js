const S = require('../svg');

// Port d'accès avec VLAN voix : téléphone IP chaîné au PC.
function schema() {
  let g = '';
  const y = 12;
  g += S.sw(14, y, 14, 6);
  g += S.text(14, y - 4.4, 'SW1', { anchor: 'middle', size: 2.4, bold: true });
  g += S.line(21, y, 56, y);
  g += S.text(22.5, y - 1.4, 'g0/1', { mono: true, size: 2, c2: true });
  g += S.box(62, y, 12, 6, 'Tél. IP', { size: 2.3, bold: true });
  g += S.line(68, y, 98, y);
  g += S.pc(103, y);
  g += S.text(103, y + 5.4, 'PC', { anchor: 'middle', size: 2.3, bold: true });
  // trames
  const frame = (x, yy, tag, lbl) => {
    let s = '';
    if (tag) s += S.box(x, yy, 9, 3.6, tag, { mono: true, size: 1.9, fill: S.FILL, bold: true });
    s += S.box(x + (tag ? 9 : 0), yy, 9, 3.6, 'données', { size: 1.9 });
    s += S.text(x + (tag ? 15 : 6), yy + 0.7, lbl, { size: 2.1, c2: true });
    return s;
  };
  g += frame(28, y + 6, 'VLAN 20', 'voix, étiquetée 802.1Q');
  g += frame(28, y + 11, '', 'données, non étiquetée');
  g += S.text(80, y + 6.7, 'non étiquetée', { size: 2.1, c2: true });
  // second port
  g += S.line(14, y + 3, 14, 36.5);
  g += S.text(15.5, 31, 'g0/2', { mono: true, size: 2, c2: true });
  g += S.box(14, 39, 16, 5, 'Imprimante', { size: 2.2 });
  g += S.text(23.5, 39.8, 'VLAN 30', { size: 2.2, c2: true });
  // configuration en regard
  g += S.text(62, 30, 'interface g0/1', { mono: true, size: 2.1 });
  g += S.text(62, 33, ' switchport mode access', { mono: true, size: 2.1 });
  g += S.text(62, 36, ' switchport access vlan 10', { mono: true, size: 2.1 });
  g += S.text(62, 39, ' switchport voice vlan 20', { mono: true, size: 2.1 });
  return S.svg(124, 43, g, 'Port d\'accès données et voix');
}

module.exports = {
  num: 9,
  domain: '2.0 Network Access',
  objectives: '2.1',
  title: 'VLAN : ports données et voix',
  attend:
    "Configurer et vérifier des VLAN de plage normale sur plusieurs switchs, des ports d'accès données et voix, et le VLAN par défaut.",
  essentiel: [
    "VLAN : domaine de broadcast logique, en pratique un sous-réseau IP. Plage normale 1–1005 (1002–1005 réservés), étendue 1006–4094. VLAN 1 : VLAN par défaut de tous les ports ; impossible à supprimer ou à renommer.",
    "Port d'accès (access) : un seul VLAN de données, trames émises sans étiquette. <code>switchport access vlan 30</code> crée le VLAN 30 s'il n'existe pas encore.",
    "VLAN voix : <code>switchport voice vlan 20</code>. Le téléphone IP étiquette sa voix en 802.1Q (VLAN 20, CoS 5) ; le PC branché derrière lui reste dans le VLAN de données, sans étiquette. CDP ou LLDP-MED indique le VLAN voix au téléphone.",
    "Communication entre VLAN : uniquement par un routeur ou un switch L3 (fiche 11).",
    "Plusieurs switchs : le VLAN doit exister sur chacun (création locale ou VTP) et traverser les liens inter-switchs en trunk (fiche 10).",
    "Les VLAN de plage normale sont stockés dans <code>vlan.dat</code> en flash, hors de la running-config (mode VTP serveur ou client).",
  ],
  schema: schema(),
  caption:
    "Un seul câble porte deux VLAN : la voix étiquetée du téléphone et les données non étiquetées du PC. Le port reste en mode access.",
  commandes: [
    ['SW1(config)# vlan 10', 'Crée le VLAN 10'],
    ['SW1(config-vlan)# name DONNEES', 'Nomme le VLAN'],
    ['SW1(config-if)# switchport mode access', 'Port d\'accès fixe'],
    ['SW1(config-if)# switchport access vlan 10', 'VLAN de données'],
    ['SW1(config-if)# switchport voice vlan 20', 'VLAN voix'],
    ['SW1# show vlan brief', 'VLAN et ports d\'accès', true],
    ['SW1# show interfaces g0/1 switchport', 'Mode, VLAN accès et voix', true],
  ],
  pieges: [
    "<code>no vlan 10</code> rend inactifs les ports qui y étaient affectés ; ils ne reviennent pas dans le VLAN 1.",
    "<code>show vlan brief</code> n'affiche pas les trunks : un port absent de la liste est souvent un trunk.",
    "Le VLAN voix ne fait pas du port un trunk : il reste en mode access, avec un VLAN de données et un VLAN voix.",
  ],
  qcm: [
    {
      q: 'Quelle commande place le trafic du téléphone IP dans le VLAN 20 ?',
      o: ['switchport trunk native vlan 20', 'vlan 20 voice', 'switchport voice vlan 20', 'switchport access vlan 20'],
      a: 'C',
      why: 'voice vlan définit le VLAN étiqueté utilisé par le téléphone.',
    },
    {
      q: 'Quelle est la plage normale des VLAN ?',
      o: ['1–1005', '1–4094', '1006–4094', '2–1001'],
      four: true,
      a: 'A',
      why: '1–1005 : plage normale ; 1006–4094 : plage étendue.',
    },
    {
      q: 'Après <code>no vlan 30</code>, que deviennent les ports d\'accès du VLAN 30 ?',
      o: ['Ils passent dans le VLAN 1', 'Ils deviennent inactifs', 'Ils passent en shutdown', 'Ils deviennent des trunks'],
      a: 'B',
      why: 'Les ports restent affectés au VLAN 30 absent et cessent de transmettre.',
    },
  ],
  mnemo: 'Données sans étiquette, voix avec étiquette.',
};
