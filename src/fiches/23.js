const S = require('../svg');

// Topologie OSPF zone 0 avec sortie Internet sur R1.
function schema() {
  const y = 13, ys = 30;
  let g = '';
  // Aire 0
  g += S.rect(30, 1.5, 92, 42.5, { dash: '1.2 0.8', stroke: S.INK2 });
  g += S.text(120.5, 42, 'AREA 0', { anchor: 'end', size: 2.4, bold: true, c2: true });
  // FAI (hors OSPF)
  g += `<ellipse cx="7" cy="${y}" rx="6" ry="4.4" fill="none" stroke="${S.INK2}" stroke-width="${S.SW}" stroke-dasharray="1 0.8"/>`;
  g += S.text(7, y + 0.9, 'FAI', { anchor: 'middle', size: 2.5, bold: true, c2: true });
  g += S.line(13, y, 36, y);
  g += S.text(22, y - 1.5, '203.0.113.0/30', { anchor: 'middle', mono: true, size: 1.9 });
  g += S.text(34.6, y + 3.2, '.2', { anchor: 'end', mono: true, size: 2, c2: true });
  g += S.text(7, y + 7.8, 'statique', { anchor: 'middle', size: 2.1, c2: true });
  g += S.text(7, y + 10.6, '0.0.0.0/0', { anchor: 'middle', mono: true, size: 2, c2: true });
  // Routeurs
  const R = [[40, 'R1', '1.1.1.1'], [74, 'R2', '2.2.2.2'], [108, 'R3', '3.3.3.3']];
  g += S.line(44, y, 70, y) + S.line(78, y, 104, y);
  g += S.text(57, y - 1.5, '10.0.12.0/30', { anchor: 'middle', mono: true, size: 2.2 });
  g += S.text(45, y + 3.2, '.1', { mono: true, size: 2, c2: true });
  g += S.text(69, y + 3.2, '.2', { anchor: 'end', mono: true, size: 2, c2: true });
  g += S.text(91, y - 1.5, '10.0.23.0/30', { anchor: 'middle', mono: true, size: 2.2 });
  g += S.text(79, y + 3.2, '.1', { mono: true, size: 2, c2: true });
  g += S.text(103, y + 3.2, '.2', { anchor: 'end', mono: true, size: 2, c2: true });
  for (const [x, l, rid] of R) {
    g += S.router(x, y);
    g += S.text(x, y - 6, l, { anchor: 'middle', bold: true, size: 2.6 });
    g += S.text(x, y - 8.8, 'RID ' + rid, { anchor: 'middle', mono: true, size: 2, c2: true });
  }
  // LAN R1 (passif) et LAN R3
  for (const [x, net, note] of [[40, '192.168.1.0/24', 'passive-interface'], [108, '192.168.3.0/24', '']]) {
    g += S.line(x, y + 4, x, ys - 2.7);
    g += S.sw(x, ys);
    g += S.text(x, ys + 6, net, { anchor: 'middle', mono: true, size: 2.3 });
    if (note) g += S.text(x, ys + 9, note, { anchor: 'middle', mono: true, size: 2, acc: true });
  }
  // Route par défaut annoncée
  g += S.line(48, 21.5, 100, 21.5, { end: 'ah', w: 0.2 });
  g += S.text(74, 25.2, 'default-information originate', { anchor: 'middle', mono: true, size: 2.1 });
  g += S.text(74, 28.4, 'R2 et R3 reçoivent O*E2 0.0.0.0/0', { anchor: 'middle', size: 2.2, c2: true });
  return S.svg(124, 46, g, 'Topologie OSPFv2 zone unique');
}

module.exports = {
  num: 23,
  domain: '3.0 IP Connectivity',
  objectives: '3.4',
  title: 'OSPFv2 : configuration zone unique',
  attend:
    "Configurer et vérifier OSPFv2 dans une zone unique : activation sur les interfaces, router ID, interfaces passives et propagation de la route par défaut.",
  essentiel: [
    "<code>router ospf 1</code> : le process ID (1 à 65535) est local au routeur et peut différer entre voisins. L'area ID, lui, doit correspondre ; en zone unique, utiliser l'area 0 (backbone). Distance administrative : 110.",
    "<code>network 10.0.12.0 0.0.0.3 area 0</code> active OSPF sur toute interface dont l'adresse correspond. Le préfixe annoncé est celui de l'interface, pas celui de la commande. Variante : <code>ip ospf 1 area 0</code> sur l'interface.",
    "Wildcard mask (masque générique) = 255.255.255.255 – masque : /30 → <code>0.0.0.3</code>, /24 → <code>0.0.0.255</code>. <code>0.0.0.0</code> cible une seule adresse d'interface.",
    "Router ID (identifiant 32 bits, unique) : <code>router-id</code> manuel, sinon plus haute IP de loopback active, sinon plus haute IP d'interface active. Un nouveau RID n'est appliqué qu'après <code>clear ip ospf process</code> ou redémarrage.",
    "<code>passive-interface</code> : le réseau de l'interface reste annoncé, mais aucun Hello n'est émis, donc aucun voisin ne s'y forme. À utiliser vers les LAN d'utilisateurs.",
    "Coût = bande passante de référence ÷ bande passante de l'interface. Référence par défaut : 100 Mbit/s, donc FastEthernet, GigabitEthernet et 10 GbE coûtent tous 1. <code>auto-cost reference-bandwidth</code> doit être identique sur tous les routeurs.",
  ],
  schema: schema(),
  caption:
    "R1 annonce 10.0.12.0/30 et son LAN passif, et propage sa route statique par défaut vers le FAI. Le lien FAI reste hors OSPF.",
  commandes: [
    ['R1(config)# router ospf 1', 'Crée le processus OSPF 1'],
    ['R1(config-router)# router-id 1.1.1.1', 'Fixe le router ID'],
    ['R1(config-router)# network 10.0.12.0 0.0.0.3 area 0', 'Active OSPF sur g0/0/1 ; idem pour le LAN (0.0.0.255)'],
    ['R1(config-router)# passive-interface g0/0/2', 'Supprime les Hello vers le LAN'],
    ['R1(config-router)# default-information originate', 'Propage la route par défaut existante'],
    ['R1# show ip ospf neighbor', 'Voisins, états, DR/BDR', true],
    ['R1# show ip protocols', 'RID, réseaux, passives', true],
    ['R1# show ip route ospf', 'Routes O et O*E2', true],
  ],
  pieges: [
    "Process ID différents : l'adjacence se forme. Area ID, timers Hello/Dead ou masque (réseau broadcast) différents : elle échoue.",
    "Un <code>router-id</code> saisi sur un processus actif n'est appliqué qu'après <code>clear ip ospf process</code>.",
    "<code>passive-interface</code> sur le lien R1–R2 : le /30 reste annoncé, mais l'adjacence tombe.",
  ],
  qcm: [
    {
      q: "Sans loopback ni <code>router-id</code>, R1 a trois interfaces actives : 10.0.12.1, 192.168.1.1 et 172.16.5.1. Quel est son RID ?",
      o: ['10.0.12.1', '172.16.5.1', '192.168.1.1', '0.0.0.0'],
      four: true,
      a: 'C',
      why: 'Ni RID manuel ni loopback : plus haute IP d\'interface active.',
    },
    {
      q: 'Le LAN 192.168.1.0/24 doit rester annoncé sans qu\'aucun Hello ne parte vers les PC. Que configurer sur R1 ?',
      four: false,
      o: ['passive-interface g0/0/2', 'ip ospf cost 65535', 'shutdown sur g0/0/2', 'Retirer le network du LAN'],
      a: 'A',
      why: 'L\'interface passive reste annoncée mais n\'émet plus de Hello.',
    },
    {
      q: 'R1 (process 1) et R2 (process 10) partagent un /30 Ethernet en area 0, timers par défaut. État attendu ?',
      o: ['FULL', '2WAY', 'EXSTART', 'Aucun voisin'],
      four: true,
      a: 'A',
      why: 'Process ID local ; entre DR et BDR, l\'adjacence atteint FULL.',
    },
  ],
  mnemo: 'RID : manuel, puis loopback, puis physique ; à chaque étape, la plus haute IP.',
};
