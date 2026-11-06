const S = require('../svg');

// DORA à travers un relais DHCP.
function schema() {
  let g = '';
  const C = 12, R = 60, V = 110, top = 4;
  g += S.text(C, top, 'Client', { anchor: 'middle', size: 2.3, bold: true });
  g += S.text(R, top, 'R1 · relais', { anchor: 'middle', size: 2.3, bold: true });
  g += S.text(V, top, 'Serveur DHCP', { anchor: 'middle', size: 2.3, bold: true });
  g += S.text(R, top + 3, 'g0/0/1 : 192.168.10.1', { anchor: 'middle', mono: true, size: 1.8, c2: true });
  g += S.text(V, top + 3, '10.0.50.10', { anchor: 'middle', mono: true, size: 1.8, c2: true });
  for (const x of [C, R, V]) g += S.line(x, top + 4.4, x, 43, { color: S.INK2 });
  const rows = [
    ['Discover', '255.255.255.255', 'unicast, giaddr .10.1', 1],
    ['Offer', '', 'Offer', -1],
    ['Request', '255.255.255.255', 'unicast', 1],
    ['Ack', '', 'Ack', -1],
  ];
  rows.forEach(([m, b1, b2, dir], i) => {
    const y = 13 + i * 8;
    if (dir > 0) {
      g += S.line(C, y, R, y + 1.6, { end: 'ah', w: 0.25 });
      g += S.line(R, y + 1.6, V, y + 3.2, { end: 'ah', w: 0.25 });
      g += S.text((C + R) / 2, y - 0.6, m + ' (broadcast)', { anchor: 'middle', size: 2.1, bold: true });
      g += S.text((R + V) / 2, y + 1, m + ', ' + b2, { anchor: 'middle', size: 2 });
    } else {
      g += S.line(V, y, R, y + 1.6, { end: 'ah', w: 0.25 });
      g += S.line(R, y + 1.6, C, y + 3.2, { end: 'ah', w: 0.25 });
      g += S.text((R + V) / 2, y - 0.6, m, { anchor: 'middle', size: 2 });
      g += S.text((C + R) / 2, y + 1, m, { anchor: 'middle', size: 2.1, bold: true });
    }
  });
  g += S.text(2, 47, 'UDP 67 (serveur) et 68 (client). Le giaddr indique au serveur dans quel pool puiser.', { size: 2.1, c2: true });
  return S.svg(124, 48, g, 'DHCP DORA avec relais');
}

module.exports = {
  num: 28,
  domain: '4.0 IP Services',
  objectives: '4.2 · 4.3 · 4.6',
  title: 'Services IP : DHCP, DNS, NTP',
  attend:
    "Expliquer le rôle de DHCP et de DNS, configurer et vérifier un client et un relais DHCP, et configurer NTP en mode client et serveur.",
  essentiel: [
    "DHCP fournit adresse, masque, passerelle, DNS et durée de bail. Échange DORA : Discover (broadcast), Offer, Request, Ack. Serveur UDP 67, client UDP 68.",
    "Relais : un routeur ne transmet pas les broadcasts. <code>ip helper-address</code>, sur l'interface côté clients, renvoie le Discover en unicast au serveur et y inscrit giaddr (adresse de cette interface), qui désigne le pool.",
    "Routeur client DHCP : <code>ip address dhcp</code> sur l'interface côté FAI.",
    "DNS : traduit les noms en adresses. Enregistrements A (IPv4), AAAA (IPv6), CNAME (alias), MX (messagerie), PTR (résolution inverse). UDP 53, TCP 53 pour les réponses volumineuses et les transferts de zone.",
    "NTP (UDP 123) : synchronise les horloges, indispensable à l'horodatage des logs et aux certificats. Stratum : distance à l'horloge de référence ; stratum 1 = relié directement ; plus il est bas, plus la source est fiable.",
    "Client : <code>ntp server</code>. Un routeur synchronisé sert à son tour ses clients. <code>ntp master</code> fait de l'horloge locale une source (stratum 8 par défaut) ; usage de laboratoire.",
  ],
  schema: schema(),
  caption:
    "Le client diffuse ; R1 relaie en unicast vers 10.0.50.10. Les réponses repassent par le relais avant d'atteindre le client.",
  commandes: [
    ['R1(config-if)# ip helper-address 10.0.50.10', 'Relais vers le serveur DHCP'],
    ['R2(config-if)# ip address dhcp', 'Interface cliente DHCP'],
    ['R1(config)# ip name-server 192.0.2.53', 'Serveur DNS du routeur'],
    ['R1(config)# ntp server 192.0.2.123', 'Client NTP'],
    ['R1(config)# ntp master 3', 'Source NTP locale, stratum 3'],
    ['R1# show ip interface g0/0/1', 'Ligne « Helper address is »', true],
    ['R2# show dhcp lease', 'Bail obtenu par l\'interface', true],
    ['R1# show ntp status', 'Synchronisé ou non, stratum', true],
    ['R1# show ntp associations', 'Serveurs NTP joints', true],
  ],
  pieges: [
    "<code>ip helper-address</code> se place sur l'interface qui reçoit les broadcasts des clients, pas sur celle tournée vers le serveur.",
    'Stratum élevé = source moins fiable ; stratum 16 = non synchronisé.',
    'DHCP : UDP 67 côté serveur, 68 côté client. DNS : UDP et TCP 53.',
  ],
  qcm: [
    {
      q: 'Dans quel ordre s\'échangent les messages DHCP ?',
      o: ['Discover, Request, Offer, Ack', 'Discover, Offer, Request, Ack', 'Request, Offer, Discover, Ack', 'Offer, Discover, Ack, Request'],
      a: 'B',
      why: 'DORA : Discover, Offer, Request, Ack.',
    },
    {
      q: 'Où configurer <code>ip helper-address</code> ?',
      o: ['En configuration globale', 'Sur l\'interface côté serveur', 'Sur l\'interface côté clients', 'Sur le serveur DHCP'],
      a: 'C',
      why: 'L\'interface qui reçoit le Discover diffusé est celle qui le relaie.',
    },
    {
      q: 'Quelle commande fait d\'un routeur un client NTP ?',
      o: ['ntp master 3', 'clock set', 'ip ntp client', 'ntp server 192.0.2.123'],
      a: 'D',
      why: 'ntp server désigne la source ; ntp master fait du routeur une source.',
    },
  ],
  mnemo: 'DORA : Discover, Offer, Request, Ack.',
};
