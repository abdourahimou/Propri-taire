const S = require('../svg');

// R1 et ses serveurs de supervision + anatomie d'un message Syslog.
function schema() {
  let g = '';
  g += S.router(12, 17);
  g += S.text(12, 10.6, 'R1 · agent', { anchor: 'middle', size: 2.3, bold: true });
  g += S.line(16, 17, 26, 17) + S.line(26, 5, 26, 29);
  const srv = [
    [5, 'NMS (manager SNMP)', '192.0.2.50', 'Get / Set : NMS → agent, UDP 161', 'Trap / Inform : agent → NMS, UDP 162'],
    [17, 'Serveur Syslog', '192.0.2.51', 'Syslog : UDP 514', ''],
    [29, 'Serveur TFTP', '192.0.2.52', 'copy running-config tftp: (UDP 69)', ''],
  ];
  for (const [y, n, ip, l1, l2] of srv) {
    g += S.line(26, y, 91, y);
    g += S.server(95, y);
    g += S.text(99, y - 0.4, n, { size: 2.2, bold: true });
    g += S.text(99, y + 2.4, ip, { mono: true, size: 1.9, c2: true });
    g += S.text(58, y - 1.2, l1, { anchor: 'middle', size: 2.1 });
    if (l2) g += S.text(58, y + 3, l2, { anchor: 'middle', size: 2.1 });
  }
  g += S.line(2, 34, 122, 34, { color: S.RULE });
  const msg = '*Nov  6 10:02:11.512: %LINK-3-UPDOWN: Interface GigabitEthernet0/0/1, changed state to down';
  const sz = 1.95, cw = sz * 0.6, y = 39;
  g += S.text(2, y, msg.replace(/ /g, ' '), { mono: true, size: sz });
  const mark = (str, label, dy, anchor) => {
    const i = msg.indexOf(str);
    const a = 2 + i * cw, b = a + str.length * cw, m = (a + b) / 2;
    let t = S.line(a, y + 1.1, b, y + 1.1, { w: 0.3 });
    t += S.line(m, y + 1.1, m, y + dy - 2.2, { color: S.INK2, w: 0.15 });
    t += S.text(m, y + dy, label, { anchor: anchor || 'middle', size: 2.1 });
    return t;
  };
  g += mark('*Nov  6 10:02:11.512', 'horodatage', 4.4);
  g += mark('LINK', 'facility', 4.4, 'end');
  g += mark('3', 'gravité (3 = error)', 7.6);
  g += mark('UPDOWN', 'mnémonique', 4.4, 'start');
  g += S.text(94, y + 4.4, 'description', { anchor: 'middle', size: 2.1 });
  return S.svg(124, 48, g, 'SNMP, Syslog et TFTP');
}

module.exports = {
  num: 29,
  domain: '4.0 IP Services',
  objectives: '4.4 · 4.5 · 4.9',
  title: 'Supervision : SNMP, Syslog, TFTP',
  attend:
    "Expliquer le rôle de SNMP, décrire les facilities et niveaux de gravité Syslog, et les fonctions de TFTP et FTP.",
  essentiel: [
    "SNMP : un manager (NMS) interroge des agents ; les objets sont décrits dans la MIB et identifiés par des OID. Get, GetNext, GetBulk (lecture), Set (écriture), Trap (alerte sans accusé), Inform (alerte avec accusé). Agent sur UDP 161, alertes vers UDP 162.",
    "SNMPv1 et v2c : community string transmise en clair (RO ou RW). SNMPv3 : utilisateurs, authentification et chiffrement (niveaux noAuthNoPriv, authNoPriv, authPriv).",
    "Syslog : messages horodatés vers la console, le buffer local ou un serveur (UDP 514). Forme : <code>%FACILITY-GRAVITÉ-MNÉMONIQUE: description</code>.",
    "Niveaux : un niveau configuré inclut tous les niveaux plus graves (numéro inférieur).<table class=\"ref\"><tbody><tr><th>Niveau</th><td>0</td><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td><td>7</td></tr><tr><th>Nom</th><td>emerg.</td><td>alert</td><td>crit.</td><td>error</td><td>warn.</td><td>notif.</td><td>info.</td><td>debug</td></tr></tbody></table>",
    "TFTP : UDP 69, sans authentification ; sauvegarde de configurations et transfert d'images IOS. FTP : TCP 21 (contrôle) et 20 (données), utilisateur et mot de passe en clair. SCP et SFTP : équivalents chiffrés.",
  ],
  schema: schema(),
  caption:
    "Le manager interroge l'agent sur UDP 161 ; l'agent alerte sur UDP 162. Dans le message Syslog, 3 = error.",
  commandes: [
    ['R1(config)# snmp-server community LectureSeule RO', 'Community v2c en lecture seule'],
    ['R1(config)# snmp-server host 192.0.2.50 version 2c LectureSeule', 'Destinataire des traps'],
    ['R1(config)# logging host 192.0.2.51', 'Serveur Syslog'],
    ['R1(config)# logging trap warnings', 'Niveaux 0 à 4 vers le serveur'],
    ['R1(config)# service timestamps log datetime msec', 'Horodatage précis des logs'],
    ['R1# copy running-config tftp:', 'Sauvegarde vers TFTP'],
    ['R1# show logging', 'Niveaux actifs et messages', true],
    ['R1# show snmp', 'Compteurs SNMP', true],
  ],
  pieges: [
    "<code>logging trap warnings</code> (niveau 4) envoie les niveaux 0 à 4, pas le seul niveau 4.",
    'Le niveau le plus grave porte le plus petit numéro : 0 = emergency, 7 = debugging.',
    'Requêtes Get/Set : UDP 161 vers l\'agent. Traps : UDP 162 vers le manager.',
  ],
  qcm: [
    {
      q: 'Quelle version de SNMP chiffre les échanges ?',
      o: ['v1', 'v2c', 'v3', 'Aucune'],
      four: true,
      a: 'C',
      why: 'Seul SNMPv3 (authPriv) chiffre ; v1 et v2c envoient la community en clair.',
    },
    {
      q: '<code>logging trap notifications</code> : quels niveaux partent vers le serveur ?',
      o: ['5 seulement', '0 à 5', '5 à 7', '0 à 4'],
      four: true,
      a: 'B',
      why: 'notifications = 5 ; les niveaux 0 à 5, plus graves ou égaux, sont envoyés.',
    },
    {
      q: 'Quel protocole de transfert fonctionne sur UDP 69, sans authentification ?',
      o: ['TFTP', 'FTP', 'SCP', 'SFTP'],
      four: true,
      a: 'A',
      why: 'TFTP : UDP 69, sans compte. FTP : TCP 20/21 ; SCP et SFTP passent par SSH.',
    },
  ],
  mnemo: 'Every Awesome Cisco Engineer Will Need Ice cream Daily : niveaux 0 à 7.',
};
