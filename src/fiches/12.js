const S = require('../svg');

// Voisinage vu depuis SW1 + extrait de show cdp neighbors.
function schema() {
  let g = '';
  const y = 8;
  g += S.router(14, y);
  g += S.text(14, y - 5, 'R1', { anchor: 'middle', size: 2.4, bold: true });
  g += S.line(18, y, 55, y);
  g += S.text(19.5, y + 3.4, 'g0/0/0', { mono: true, size: 1.9, c2: true });
  g += S.text(54, y + 3.4, 'g0/1', { anchor: 'end', mono: true, size: 1.9, c2: true });
  g += S.sw(62, y, 14, 6);
  g += S.text(62, y - 4.4, 'SW1', { anchor: 'middle', size: 2.4, bold: true });
  g += S.line(69, y, 104, y);
  g += S.text(70.5, y + 3.4, 'g0/2', { mono: true, size: 1.9, c2: true });
  g += S.text(103, y + 3.4, 'g0/1', { anchor: 'end', mono: true, size: 1.9, c2: true });
  g += S.sw(111, y, 14, 6);
  g += S.text(111, y - 4.4, 'SW2', { anchor: 'middle', size: 2.4, bold: true });
  g += S.text(36, y - 1.4, 'CDP 60 s', { anchor: 'middle', size: 2, c2: true });
  g += S.text(86, y - 1.4, 'CDP 60 s', { anchor: 'middle', size: 2, c2: true });
  // sortie
  const ty = 21;
  g += S.line(2, ty - 3.6, 122, ty - 3.6, { color: S.RULE });
  g += S.text(2, ty, 'SW1# show cdp neighbors', { mono: true, size: 2.1, bold: true });
  const cols = [2, 18, 40, 54, 72, 96];
  const head = ['Device ID', 'Local Intrfce', 'Holdtme', 'Capability', 'Platform', 'Port ID'];
  head.forEach((t, i) => (g += S.text(cols[i], ty + 4, t, { mono: true, size: 1.9, bold: true })));
  const rows = [['R1', 'Gig 0/1', '150', 'R B S I', 'ISR4321', 'Gig 0/0/0'], ['SW2', 'Gig 0/2', '172', 'S I', 'C9200', 'Gig 0/1']];
  rows.forEach((r, j) => r.forEach((t, i) => (g += S.text(cols[i], ty + 8 + j * 3.2, t, { mono: true, size: 1.9 }))));
  g += S.line(18, ty + 16.6, 18, ty + 18.6, { color: S.INK2 });
  g += S.text(18, ty + 21, 'interface de SW1', { size: 2, c2: true });
  g += S.line(96, ty + 16.6, 96, ty + 18.6, { color: S.INK2 });
  g += S.text(96, ty + 21, 'interface du voisin', { size: 2, c2: true });
  return S.svg(124, 44, g, 'Voisins CDP de SW1');
}

module.exports = {
  num: 12,
  domain: '2.0 Network Access',
  objectives: '2.3',
  title: 'Découverte L2 : CDP, LLDP',
  attend: 'Configurer et vérifier les protocoles de découverte de couche 2 CDP et LLDP.',
  essentiel: [
    "CDP (Cisco Discovery Protocol) : propriétaire, actif par défaut sur toutes les interfaces Cisco. Annonce toutes les 60 s, holdtime 180 s, en multicast <code>0100.0CCC.CCCC</code> ; CDPv2 par défaut.",
    "LLDP (Link Layer Discovery Protocol, IEEE 802.1AB) : standard multiconstructeur, désactivé par défaut sur la plupart des équipements Cisco IOS. Timer 30 s, holdtime 120 s.",
    "Informations échangées : nom (Device ID), interfaces locale et distante, plateforme, capacités (R, S, I…), version logicielle, adresse de gestion ; CDP ajoute native VLAN, duplex et VLAN voix.",
    "Protocoles de couche 2 : seuls les voisins directement connectés sont visibles, même sans adressage IP. Les annonces ne traversent pas un routeur.",
    "Activation : CDP par <code>cdp run</code> (global) et <code>cdp enable</code> (interface) ; LLDP par <code>lldp run</code>, puis <code>lldp transmit</code> et <code>lldp receive</code> par interface.",
    "Sécurité : désactiver CDP et LLDP sur les ports exposés (Internet, ports utilisateurs), car ils révèlent modèle et version logicielle.",
  ],
  schema: schema(),
  caption:
    "Local Intrfce est le port de SW1 ; Port ID est le port du voisin. L'adresse IP du voisin n'apparaît qu'avec detail.",
  commandes: [
    ['SW1(config)# no cdp run', 'Désactive CDP sur tout le switch'],
    ['SW1(config-if)# no cdp enable', 'Désactive CDP sur un port'],
    ['SW1(config)# lldp run', 'Active LLDP globalement'],
    ['SW1(config-if)# lldp transmit', 'Émission LLDP (et lldp receive)'],
    ['SW1# show cdp neighbors', 'Voisins, ports, plateforme', true],
    ['SW1# show cdp neighbors detail', 'IP et version du voisin', true],
    ['SW1# show lldp neighbors', 'Voisins LLDP', true],
    ['SW1# show cdp', 'Timers 60 et 180 s, version', true],
  ],
  pieges: [
    "<code>show cdp neighbors</code> n'affiche pas l'adresse IP : il faut <code>detail</code> ou <code>show cdp entry</code>.",
    "Local Intrfce désigne l'interface du switch local ; Port ID celle du voisin.",
    "LLDP se règle par sens : <code>lldp transmit</code> et <code>lldp receive</code> sont deux commandes.",
  ],
  qcm: [
    {
      q: 'Quelle commande affiche l\'adresse IP de gestion des voisins CDP ?',
      o: ['show cdp interface', 'show cdp', 'show cdp neighbors', 'show cdp neighbors detail'],
      a: 'D',
      why: 'Seule la vue detail (ou show cdp entry) liste les adresses.',
    },
    {
      q: 'Quels sont les timers LLDP par défaut (annonce / holdtime) ?',
      o: ['60 / 180 s', '30 / 120 s', '10 / 40 s', '5 / 15 s'],
      four: true,
      a: 'B',
      why: 'LLDP : 30 et 120 s. CDP : 60 et 180 s.',
    },
    {
      q: 'Un switch Cisco doit découvrir un switch d\'un autre constructeur. Quel protocole activer ?',
      o: ['CDP', 'DTP', 'LLDP', 'VTP'],
      four: true,
      a: 'C',
      why: 'LLDP est la norme IEEE 802.1AB ; CDP est propriétaire Cisco.',
    },
  ],
  mnemo: 'Holdtime = 3 × timer pour CDP (60/180), 4 × timer pour LLDP (30/120).',
};
