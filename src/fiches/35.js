const S = require('../svg');

// Port security, DHCP snooping et DAI sur un switch d'accès.
function schema() {
  let g = '';
  g += S.sw(62, 20, 16, 7);
  g += S.text(71.5, 17.6, 'SW1 · VLAN 10', { size: 2.3, bold: true });
  // serveur légitime
  g += S.line(62, 16.5, 62, 7.5);
  g += S.server(62, 4.2);
  g += S.text(66, 4.4, 'Serveur DHCP légitime', { size: 2.1, bold: true });
  g += S.text(63.4, 12, 'g0/1 · trusted', { mono: true, size: 1.9 });
  // PC légitime
  g += S.line(54, 22, 20, 33.4);
  g += S.pc(16, 36);
  g += S.text(16, 41.4, 'PC', { anchor: 'middle', size: 2.2, bold: true });
  g += S.text(2, 26, 'g0/5 · untrusted', { mono: true, size: 1.9 });
  g += S.text(2, 29, 'port-security max 2, sticky', { size: 1.9, c2: true });
  // DHCP pirate
  g += S.line(62, 23.5, 62, 33);
  g += S.server(62, 36.4);
  g += S.text(66, 36.6, 'DHCP pirate', { size: 2.1, bold: true });
  g += S.text(66, 39.4, 'Offer rejeté (untrusted)', { size: 2, acc: true });
  g += S.line(60, 27, 64, 31, { color: S.ACC, w: 0.5 }) + S.line(64, 27, 60, 31, { color: S.ACC, w: 0.5 });
  // attaquant ARP
  g += S.line(70, 22, 104, 33.4);
  g += S.pc(108, 36);
  g += S.text(108, 41.4, 'Attaquant', { anchor: 'middle', size: 2.2, bold: true });
  g += S.text(122, 26, 'ARP falsifié', { anchor: 'end', size: 2, acc: true });
  g += S.text(122, 29, 'rejeté par DAI', { anchor: 'end', size: 2, acc: true });
  g += S.line(85, 26.2, 89, 30.2, { color: S.ACC, w: 0.5 }) + S.line(89, 26.2, 85, 30.2, { color: S.ACC, w: 0.5 });
  return S.svg(124, 43, g, 'Sécurité de couche 2');
}

module.exports = {
  num: 35,
  domain: '5.0 Security Fundamentals',
  objectives: '5.7',
  title: 'Sécurité L2 : port security, snooping',
  attend:
    'Configurer et vérifier la sécurité de couche 2 : port security, DHCP snooping et Dynamic ARP Inspection.',
  essentiel: [
    "Port security : limite le nombre d'adresses MAC sources sur un port (1 par défaut). Apprentissage statique, dynamique ou sticky (MAC apprises inscrites dans la running-config). Le port doit être en access ou trunk fixe.",
    "Violation : shutdown (défaut : port err-disabled), restrict (trames rejetées, journal et compteur), protect (trames rejetées sans journal ni compteur).",
    "DHCP snooping : ports untrusted par défaut. Un message serveur (Offer, Ack) reçu sur un port untrusted est rejeté, ce qui neutralise les serveurs DHCP pirates. Le switch tient une table de liaisons : MAC, IP, VLAN, port, bail.",
    "Option 82 : insérée par défaut par le switch ; un serveur DHCP IOS peut alors refuser la requête. <code>no ip dhcp snooping information option</code> la désactive.",
    "DAI (Dynamic ARP Inspection) : sur les ports untrusted, chaque ARP est comparé à la table du snooping ; les associations IP-MAC falsifiées (ARP spoofing) sont rejetées. Limite par défaut : 15 ARP/s par port untrusted.",
    "Ordre : DHCP snooping (global et par VLAN), ports trusted (uplinks, serveur), puis DAI sur les mêmes VLAN avec <code>ip arp inspection trust</code> sur les uplinks.",
  ],
  schema: schema(),
  caption:
    "Seul le port g0/1 peut émettre des réponses DHCP. DAI s'appuie sur la table construite par le snooping pour valider chaque ARP.",
  commandes: [
    ['SW1(config-if)# switchport port-security', 'Active port security'],
    ['SW1(config-if)# switchport port-security maximum 2', 'Deux MAC autorisées'],
    ['SW1(config-if)# switchport port-security mac-address sticky', 'MAC apprises mémorisées'],
    ['SW1(config-if)# switchport port-security violation restrict', 'Rejet + journal'],
    ['SW1(config)# ip dhcp snooping vlan 10', 'Snooping sur le VLAN 10 (avec ip dhcp snooping)'],
    ['SW1(config-if)# ip dhcp snooping trust', 'Port vers le vrai serveur'],
    ['SW1(config)# ip arp inspection vlan 10', 'DAI sur le VLAN 10'],
    ['SW1# show port-security interface g0/5', 'Mode, MAC, violations', true],
    ['SW1# show ip dhcp snooping binding', 'Table de liaisons', true],
  ],
  pieges: [
    'Port security sur un port en dynamic auto : commande refusée ; le port doit être access ou trunk.',
    'Le mode protect ne journalise rien et ne compte rien : les violations passent inaperçues.',
    'DAI sans DHCP snooping ni ACL ARP : tous les ARP des ports untrusted sont rejetés.',
  ],
  qcm: [
    {
      q: 'Quel est le mode de violation par défaut de port security ?',
      o: ['protect', 'restrict', 'shutdown', 'drop'],
      four: true,
      a: 'C',
      why: 'shutdown met le port en err-disabled.',
    },
    {
      q: 'Où placer <code>ip dhcp snooping trust</code> ?',
      o: ['Sur tous les ports d\'accès', 'Vers le serveur DHCP légitime', 'Sur aucun port', 'Sur la SVI'],
      a: 'B',
      why: 'Seuls les ports menant au vrai serveur doivent accepter Offer et Ack.',
    },
    {
      q: 'Quelle fonction bloque une attaque par ARP spoofing ?',
      o: ['Port security', 'BPDU Guard', 'DHCP snooping seul', 'DAI'],
      a: 'D',
      why: 'DAI valide chaque ARP ; le snooping ne fait que fournir la table.',
    },
  ],
  mnemo: 'Snooping d\'abord : DAI lit sa table.',
};
