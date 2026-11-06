const S = require('../svg');

// Router-on-a-stick : le trafic inter-VLAN monte et redescend par le trunk.
function schema() {
  let g = '';
  const rx = 62, ry = 8;
  g += S.router(rx, ry);
  g += S.text(rx + 5.4, ry - 2.2, 'R1', { size: 2.4, bold: true });
  g += S.text(rx + 5.4, ry + 0.8, 'g0/0/1.10  192.168.10.1/24', { mono: true, size: 2 });
  g += S.text(rx + 5.4, ry + 3.6, 'g0/0/1.20  192.168.20.1/24', { mono: true, size: 2 });
  g += S.line(rx, ry + 4, rx, 24.3, { w: 0.5 });
  g += S.text(rx - 1.4, 18, 'trunk 802.1Q', { anchor: 'end', size: 2.1, c2: true });
  g += S.sw(rx, 27, 14, 5.4);
  g += S.text(rx, 34.2, 'SW1', { anchor: 'middle', size: 2.4, bold: true });
  g += S.line(rx - 4, 29.7, 30, 38);
  g += S.line(rx + 4, 29.7, 94, 38);
  g += S.pc(26, 40);
  g += S.pc(98, 40);
  g += S.text(20, 40.6, 'PC-A', { anchor: 'end', size: 2.3, bold: true });
  g += S.text(20, 43.4, 'VLAN 10 · .10.11', { anchor: 'end', size: 2, c2: true });
  g += S.text(104, 40.6, 'PC-B', { size: 2.3, bold: true });
  g += S.text(104, 43.4, 'VLAN 20 · .20.11', { size: 2, c2: true });
  // trajet
  g += `<path d="M28,36 L${rx - 6},26 L${rx - 2.2},12.2" fill="none" stroke="${S.ACC}" stroke-width="0.3" marker-end="url(#aha)"/>`;
  g += `<path d="M${rx + 2.2},12.2 L${rx + 6},26 L96,36" fill="none" stroke="${S.ACC}" stroke-width="0.3" marker-end="url(#aha)"/>`;
  g += S.text(36, 26.8, 'étiqueté 10', { size: 2, acc: true });
  g += S.text(78, 26.8, 'étiqueté 20', { size: 2, acc: true });
  return S.svg(124, 45, g, 'Router-on-a-stick');
}

module.exports = {
  num: 11,
  domain: '2.0 Network Access',
  objectives: '2.1',
  title: 'Routage inter-VLAN',
  attend:
    'Configurer et vérifier la connectivité inter-VLAN par router-on-a-stick et par SVI sur un switch L3.',
  essentiel: [
    "Chaque VLAN est un sous-réseau : un hôte joint un autre VLAN par sa passerelle par défaut, qui doit router.",
    "Router-on-a-stick (ROAS) : une interface du routeur en trunk 802.1Q, découpée en sous-interfaces (<code>g0/0/1.10</code>, <code>.20</code>), chacune avec <code>encapsulation dot1Q</code> et l'adresse de passerelle du VLAN. Le port du switch en face est en trunk.",
    "Native VLAN en ROAS : <code>encapsulation dot1Q 99 native</code> sur la sous-interface concernée.",
    "Switch L3 : une SVI (<code>interface vlan 10</code>) par VLAN et <code>ip routing</code>. Routage en matériel, sans le goulot du lien unique. La SVI est up/up si le VLAN existe et compte au moins un port actif.",
    "Port routé sur switch L3 : <code>no switchport</code> puis <code>ip address</code> ; l'interface devient une interface de couche 3, hors VLAN.",
    "Limite du ROAS : tout le trafic inter-VLAN emprunte deux fois le même lien physique.",
  ],
  schema: schema(),
  caption:
    "PC-A (VLAN 10) joint PC-B (VLAN 20) : la trame monte vers R1 étiquetée 10, R1 route, puis la renvoie étiquetée 20 sur le même lien.",
  commandes: [
    ['R1(config)# interface g0/0/1.10', 'Sous-interface du VLAN 10'],
    ['R1(config-subif)# encapsulation dot1Q 10', 'Associe le VLAN 10'],
    ['R1(config-subif)# ip address 192.168.10.1 255.255.255.0', 'Passerelle du VLAN 10'],
    ['R1(config-if)# no shutdown', 'Sur l\'interface physique g0/0/1'],
    ['SW2(config)# ip routing', 'Active le routage (switch L3)'],
    ['SW2(config)# interface vlan 20', 'SVI du VLAN 20, puis ip address'],
    ['R1# show vlans', 'Sous-interfaces 802.1Q', true],
    ['SW2# show ip interface brief', 'État des SVI', true],
  ],
  pieges: [
    "Sans <code>no shutdown</code> sur l'interface physique, toutes ses sous-interfaces restent down.",
    "Le numéro <code>.10</code> n'est qu'un nom : seul <code>encapsulation dot1Q 10</code> lie la sous-interface au VLAN 10.",
    "SVI down/down : le VLAN n'existe pas ou aucun port actif ne l'utilise.",
  ],
  qcm: [
    {
      q: 'Quelle commande associe la sous-interface g0/0/1.30 au VLAN 30 ?',
      o: ['encapsulation dot1Q 30', 'switchport access vlan 30', 'vlan 30', 'ip vlan 30'],
      a: 'A',
      why: 'La sous-interface se lie au VLAN par son encapsulation.',
    },
    {
      q: 'La SVI <code>interface vlan 20</code> est down/down. Cause probable ?',
      o: ['ip routing absent', 'Aucune adresse IP', 'Aucun port actif dans le VLAN 20', 'Native VLAN différent'],
      a: 'C',
      why: 'Une SVI monte si le VLAN existe et a un port actif ; ip routing n\'agit pas sur l\'état.',
    },
    {
      q: 'Comment configurer le port du switch relié au routeur en ROAS ?',
      o: ['Access', 'Port routé', 'Voice VLAN', 'Trunk'],
      four: true,
      a: 'D',
      why: 'Le lien transporte plusieurs VLAN étiquetés : c\'est un trunk.',
    },
  ],
  mnemo: 'Le numéro de sous-interface est un nom ; dot1Q fait foi.',
};
