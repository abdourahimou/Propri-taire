const S = require('../svg');

// Chronogrammes TCP (3 temps + données) et UDP (sans accusé).
function schema() {
  let g = '';
  const top = 6, bot = 44;
  const lanes = [[8, 'Client'], [52, 'Serveur'], [74, 'Client'], [118, 'Serveur']];
  for (const [x, l] of lanes) {
    g += S.text(x, top - 1.8, l, { anchor: 'middle', size: 2.3, bold: true });
    g += S.line(x, top, x, bot, { color: S.INK2 });
  }
  g += S.text(30, 2.2, 'TCP', { anchor: 'middle', size: 2.6, bold: true });
  g += S.text(96, 2.2, 'UDP', { anchor: 'middle', size: 2.6, bold: true });
  const msg = (x1, y1, x2, y2, t) => {
    let s = S.line(x1, y1, x2, y2, { end: 'ah', w: 0.25 });
    s += S.text((x1 + x2) / 2, (y1 + y2) / 2 - 1.3, t, { anchor: 'middle', mono: true, size: 2.1 });
    return s;
  };
  g += msg(8, 9, 52, 12, 'SYN  seq=100');
  g += msg(52, 16, 8, 19, 'SYN-ACK  seq=300 ack=101');
  g += msg(8, 23, 52, 26, 'ACK  ack=301');
  g += msg(8, 31, 52, 34, 'Données  seq=101, 500 o');
  g += msg(52, 38, 8, 41, 'ACK  ack=601');
  g += msg(74, 10, 118, 13, 'Requête DNS  port 53');
  g += msg(118, 18, 74, 21, 'Réponse DNS');
  g += msg(74, 27, 118, 30, 'RTP (voix), sans accusé');
  g += S.text(96, 39, 'pas de connexion,', { anchor: 'middle', size: 2.1, c2: true });
  g += S.text(96, 41.8, 'pas de retransmission', { anchor: 'middle', size: 2.1, c2: true });
  g += S.line(63, 2, 63, 44, { color: S.RULE });
  return S.svg(124, 45, g, 'Échanges TCP et UDP');
}

module.exports = {
  num: 4,
  domain: '1.0 Network Fundamentals',
  objectives: '1.5',
  title: 'TCP et UDP comparés',
  attend:
    "Comparer TCP et UDP : établissement de la connexion, fiabilité, contrôle de flux, en-têtes et usages typiques.",
  essentiel: [
    "TCP : orienté connexion. Ouverture en trois temps (SYN, SYN-ACK, ACK), fermeture par FIN et ACK ou par RST. En-tête de 20 octets minimum. UDP : sans connexion, en-tête de 8 octets.",
    "Fiabilité TCP : numéros de séquence, accusés de réception (ACK), retransmission des segments perdus, remise dans l'ordre. UDP : aucune garantie ; l'application gère les pertes si besoin.",
    "Contrôle de flux TCP par fenêtrage (windowing) : le récepteur annonce combien d'octets il accepte avant d'accuser réception. UDP n'en a pas.",
    "Ports : bien connus 0–1023, enregistrés 1024–49151, dynamiques 49152–65535. Socket = adresse IP + protocole + port.",
    "TCP : FTP 20/21, SSH 22, Telnet 23, SMTP 25, HTTP 80, POP3 110, IMAP 143, HTTPS 443. UDP : DHCP 67/68, TFTP 69, NTP 123, SNMP 161/162, Syslog 514. DNS : 53, en UDP et en TCP.",
    "UDP convient à la voix et à la vidéo en temps réel (RTP), au DNS, au DHCP : une donnée retransmise en retard est inutile.",
  ],
  schema: schema(),
  caption:
    "À gauche, ouverture TCP en trois temps, puis 500 octets acquittés (ack = 101 + 500). À droite, UDP envoie sans session ni accusé.",
  commandes: [
    ['R1# show tcp brief', 'Sessions TCP du routeur', true],
    ['R1# show control-plane host open-ports', 'Ports TCP/UDP à l\'écoute', true],
    ['R1# telnet 198.51.100.20 443', 'Teste l\'ouverture d\'un port TCP'],
    ['R1(config-ext-nacl)# permit udp any any eq 53', 'ACL : DNS en UDP'],
    ['R1(config-ext-nacl)# permit tcp any any eq 22', 'ACL : SSH en TCP'],
    ['C:\\> netstat -an', 'Connexions et ports (Windows)', true],
    ['$ ss -tuln', 'Ports à l\'écoute (Linux)', true],
  ],
  pieges: [
    "DNS n'est pas limité à UDP : transferts de zone et réponses volumineuses passent par TCP 53.",
    "TFTP utilise UDP 69 ; FTP utilise TCP 20 et 21.",
    "Le fenêtrage est propre à TCP. Une réponse qui attribue un contrôle de flux à UDP est fausse.",
  ],
  qcm: [
    {
      q: 'Quelle séquence ouvre une session TCP ?',
      o: ['SYN, SYN-ACK, ACK', 'SYN, ACK, SYN-ACK', 'SYN, SYN, ACK', 'ACK, SYN, FIN'],
      four: false,
      a: 'A',
      why: 'Le client émet SYN, le serveur SYN-ACK, le client confirme par ACK.',
    },
    {
      q: 'Quel protocole s\'appuie sur UDP ?',
      o: ['SSH', 'HTTPS', 'SNMP', 'SMTP'],
      four: true,
      a: 'C',
      why: 'SNMP : UDP 161 et 162. SSH, HTTPS et SMTP utilisent TCP.',
    },
    {
      q: 'Quel mécanisme TCP limite les données envoyées avant réception d\'un accusé ?',
      o: ['Les numéros de port', 'Le checksum', 'Le TTL', 'Le fenêtrage'],
      four: false,
      a: 'D',
      why: 'La taille de fenêtre fixe le volume non acquitté autorisé.',
    },
  ],
  mnemo: 'SYN, SYN-ACK, ACK : je demande ; j\'accepte et je demande ; j\'accepte.',
};
