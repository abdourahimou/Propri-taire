const S = require('../svg');

// Raccordement des AP et du WLC.
function schema() {
  let g = '';
  g += S.sw(40, 8, 14, 6);
  g += S.text(40, 3, 'SW1 · distribution', { anchor: 'middle', size: 2.3, bold: true });
  g += S.line(47, 7, 92, 7);
  g += S.line(47, 9, 92, 9);
  g += `<ellipse cx="70" cy="8" rx="4" ry="2.8" fill="none" stroke="${S.INK}" stroke-width="${S.SW}"/>`;
  g += S.text(70, 4, 'LAG · trunk 802.1Q', { anchor: 'middle', size: 2, c2: true });
  g += S.text(70, 13.4, 'channel-group mode on', { anchor: 'middle', mono: true, size: 1.9, c2: true });
  g += S.box(99, 8, 14, 6, 'WLC', { bold: true, size: 2.4 });
  // accès
  g += S.line(40, 11, 40, 21);
  g += S.text(41.4, 17, 'trunk', { size: 2, c2: true });
  g += S.sw(40, 24, 14, 6);
  g += S.text(32, 24.8, 'SW2 · accès', { anchor: 'end', size: 2.3, bold: true });
  g += S.line(35, 27, 18, 36);
  g += S.box(14, 39, 10, 4.6, 'AP', { bold: true });
  g += S.text(14, 44.6, 'local', { anchor: 'middle', size: 2.1 });
  g += S.text(21, 31.4, 'access VLAN 100', { mono: true, size: 1.9, c2: true, anchor: 'end' });
  g += S.line(45, 27, 62, 36);
  g += S.box(66, 39, 10, 4.6, 'AP', { bold: true });
  g += S.text(66, 44.6, 'FlexConnect', { anchor: 'middle', size: 2.1 });
  g += S.text(56, 31.4, 'trunk 10,20,100', { mono: true, size: 1.9, c2: true });
  // CAPWAP
  g += `<path d="M19,37 C30,30 70,22 96,11.4" fill="none" stroke="${S.ACC}" stroke-width="0.3" stroke-dasharray="1 0.7" marker-end="url(#aha)"/>`;
  g += S.text(82, 23, 'CAPWAP : UDP 5246 contrôle,', { size: 2.1, acc: true });
  g += S.text(82, 26, 'UDP 5247 données', { size: 2.1, acc: true });
  g += S.text(82, 32, 'AP local : trafic client', { size: 2, c2: true });
  g += S.text(82, 34.8, 'dans le tunnel', { size: 2, c2: true });
  g += S.text(82, 38.6, 'FlexConnect : trafic client', { size: 2, c2: true });
  g += S.text(82, 41.4, 'commuté sur place', { size: 2, c2: true });
  return S.svg(124, 46, g, 'Raccordement AP et WLC');
}

module.exports = {
  num: 16,
  domain: '2.0 Network Access',
  objectives: '2.6 · 2.7',
  title: 'Architectures WLAN Cisco',
  attend:
    "Décrire les architectures sans fil Cisco et les modes d'AP, puis les connexions physiques des AP et du WLC : ports access, trunk et LAG.",
  essentiel: [
    "Autonome : chaque AP est configuré et géré seul ; il relie lui-même SSID et VLAN. Adapté aux très petits sites.",
    "Split-MAC (AP léger + WLC) : l'AP gère le temps réel (beacons, accusés radio, chiffrement) ; le WLC gère authentification, association, itinérance et radio (RRM). Tunnel CAPWAP : UDP 5246 (contrôle, chiffré DTLS) et 5247 (données).",
    "Emplacement du contrôleur : appliance centrale, contrôleur embarqué dans un switch ou un AP (EWC), ou cloud (Meraki : gestion par Internet, trafic client local).",
    "Modes d'AP : local (défaut, sert les clients, trafic vers le WLC), FlexConnect (commutation locale, survit à la perte du WLC), monitor (capteur, ne sert aucun client), sniffer, rogue detector, SE-Connect (analyse de spectre), bridge (mesh).",
    "Raccordement : AP local sur port access (VLAN de gestion des AP), PoE ; AP FlexConnect ou autonome sur trunk (un VLAN par SSID). WLC sur trunk 802.1Q (gestion + VLAN des WLAN).",
    "LAG d'un WLC AireOS : tous les ports de distribution en un lien logique ; côté switch, EtherChannel en mode <code>on</code>, sans LACP ni PAgP.",
  ],
  schema: schema(),
  caption:
    "L'AP local n'a besoin que d'un VLAN : le WLC sort chaque SSID vers son VLAN. L'AP FlexConnect reçoit un trunk pour commuter localement.",
  commandes: [
    ['SW2(config-if)# switchport mode access', 'Port d\'un AP en mode local'],
    ['SW2(config-if)# switchport access vlan 100', 'VLAN de gestion des AP'],
    ['SW2(config-if)# switchport mode trunk', 'Port d\'un AP FlexConnect'],
    ['SW1(config-if-range)# channel-group 1 mode on', 'LAG vers le WLC AireOS'],
    ['SW2# show power inline', 'Alimentation PoE des AP', true],
    ['SW1# show etherchannel summary', 'État du LAG', true],
    ['WLC# show ap summary', 'AP joints au WLC (C9800)', true],
  ],
  pieges: [
    'AP en mode local : un port access suffit ; le WLC associe chaque SSID à son VLAN.',
    'LAG d\'un WLC AireOS : EtherChannel en <code>on</code> ; LACP et PAgP ne sont pas pris en charge.',
    'Un AP en mode monitor ne sert aucun client : il écoute seulement.',
  ],
  qcm: [
    {
      q: 'Quel mode d\'AP continue de commuter le trafic local quand le WLC devient injoignable ?',
      o: ['Local', 'Monitor', 'FlexConnect', 'Sniffer'],
      four: true,
      a: 'C',
      why: 'FlexConnect commute localement et survit à la perte du contrôleur.',
    },
    {
      q: 'Quels ports utilise le tunnel CAPWAP ?',
      o: ['UDP 5246 et 5247', 'UDP 1812 et 1813', 'UDP 161 et 162', 'UDP 67 et 68'],
      a: 'A',
      why: '5246 pour le contrôle, 5247 pour les données.',
    },
    {
      q: 'Comment configurer le port de switch d\'un AP en mode local ?',
      o: ['Trunk', 'Access', 'Port routé', 'LAG'],
      four: true,
      a: 'B',
      why: 'L\'AP local n\'utilise qu\'un VLAN ; le trafic client est encapsulé dans CAPWAP.',
    },
  ],
  mnemo: 'CAPWAP : 5246 contrôle, 5247 données, dans l\'ordre.',
};
