const S = require('../svg');

// Modes d'accès à un routeur.
function schema() {
  let g = '';
  g += S.router(62, 20, 5);
  g += S.text(62, 12.4, 'R1', { anchor: 'middle', size: 2.4, bold: true });
  g += S.text(68, 27, 'line vty 0 4', { mono: true, size: 1.9, c2: true });
  g += S.text(56, 27, 'line con 0', { anchor: 'end', mono: true, size: 1.9, c2: true });
  // SSH
  g += S.pc(108, 10);
  g += S.text(108, 4.8, 'Admin', { anchor: 'middle', size: 2.3, bold: true });
  g += S.line(105, 11, 67, 18.6, { end: 'ah', w: 0.3 });
  g += S.text(86, 12.4, 'SSH · TCP 22 · chiffré', { anchor: 'middle', size: 2.1, bold: true });
  // Telnet barré
  g += S.pc(108, 32);
  g += S.line(105, 31, 67, 22, { end: 'ah', w: 0.25, dash: '0.8 0.6', color: S.INK2 });
  g += S.text(86, 31, 'Telnet · TCP 23 · en clair', { anchor: 'middle', size: 2.1, c2: true });
  g += S.line(84, 24, 88, 28, { color: S.ACC, w: 0.5 }) + S.line(88, 24, 84, 28, { color: S.ACC, w: 0.5 });
  // console
  g += S.pc(14, 20);
  g += S.text(14, 14.8, 'Console', { anchor: 'middle', size: 2.3, bold: true });
  g += S.line(17, 20, 57, 20, { dash: '0.4 0.4' });
  g += S.text(36, 18.4, 'hors bande, câble console', { anchor: 'middle', size: 2.1 });
  // AAA
  g += S.server(62, 39);
  g += S.line(62, 25, 62, 35.6, { color: S.INK2 });
  g += S.text(66, 39, 'TACACS+ / RADIUS', { size: 2.1, bold: true });
  g += S.text(66, 41.8, 'comptes centralisés (fiche 33)', { size: 1.9, c2: true });
  return S.svg(124, 44, g, 'Accès de gestion');
}

module.exports = {
  num: 32,
  domain: '5.0 Security Fundamentals',
  objectives: '5.3 · 4.8 · 2.8',
  title: 'Accès aux équipements : SSH',
  attend:
    "Configurer et vérifier les mots de passe locaux et l'accès distant SSH ; décrire console, Telnet, HTTP(S), TACACS+, RADIUS et gestion cloud.",
  essentiel: [
    "Modes d'accès : console (hors bande), Telnet (TCP 23, en clair, à proscrire), SSH (TCP 22, chiffré), HTTP et HTTPS (interface web), AAA centralisé (TACACS+, RADIUS), gestion cloud (Meraki).",
    "<code>enable secret</code> : stocké sous forme de hachage. <code>enable password</code> : en clair ou en type 7 ; ignoré dès qu'un <code>enable secret</code> existe.",
    "<code>service password-encryption</code> : convertit en type 7 les mots de passe en clair de la configuration. Le type 7 est réversible : protection contre la lecture par-dessus l'épaule seulement.",
    "SSH : nom d'hôte autre que Router, nom de domaine, paire de clés RSA (768 bits minimum pour SSHv2, 2048 recommandés), compte local, <code>login local</code> et <code>transport input ssh</code> sur les lignes VTY.",
    "<code>username admin privilege 15 secret …</code> : compte local haché, ouvert directement en mode privilégié.",
    "<code>exec-timeout 10 0</code> : déconnexion après 10 min d'inactivité (valeur par défaut). <code>banner motd</code> : avertissement légal affiché à la connexion.",
  ],
  schema: schema(),
  caption:
    "SSH pour l'administration à distance, console pour l'accès de secours. Telnet transmet identifiants et commandes en clair.",
  commandes: [
    ['R1(config)# ip domain name exemple.local', 'Nom de domaine (pour les clés)'],
    ['R1(config)# crypto key generate rsa modulus 2048', 'Paire de clés RSA'],
    ['R1(config)# ip ssh version 2', 'Impose SSHv2'],
    ['R1(config)# username admin privilege 15 secret Adm1n-Lab', 'Compte local haché'],
    ['R1(config)# enable secret Ens3cret-Lab', 'Mot de passe enable haché'],
    ['R1(config-line)# login local', 'VTY : comptes locaux'],
    ['R1(config-line)# transport input ssh', 'VTY : SSH seul'],
    ['R1# show ip ssh', 'Version, délais, état', true],
    ['R1# show ssh', 'Sessions SSH ouvertes', true],
  ],
  pieges: [
    "<code>crypto key generate rsa</code> échoue tant que le nom d'hôte est Router ou que le nom de domaine manque.",
    "<code>login</code> utilise le mot de passe de ligne ; <code>login local</code> utilise les comptes <code>username</code>.",
    "Le type 7 se déchiffre en quelques secondes : seul <code>secret</code> protège réellement.",
  ],
  qcm: [
    {
      q: 'Quelle commande n\'autorise que SSH sur les lignes VTY ?',
      o: ['transport input ssh', 'ip ssh version 2', 'login local', 'crypto key generate rsa'],
      a: 'A',
      why: 'transport input limite les protocoles acceptés par la ligne.',
    },
    {
      q: 'Que faut-il configurer avant de générer les clés RSA ?',
      o: ['enable secret', 'Nom d\'hôte et nom de domaine', 'transport input ssh', 'Un compte username'],
      a: 'B',
      why: 'Le nom de la paire de clés reprend nom d\'hôte et domaine.',
    },
    {
      q: 'Quel stockage protège le moins le mot de passe ?',
      o: ['enable secret', 'username … secret', 'Type 7 (password-encryption)', 'Hachage scrypt (type 9)'],
      a: 'C',
      why: 'Le type 7 est un encodage réversible, pas un hachage.',
    },
  ],
  mnemo: 'Nom, domaine, clés, compte, VTY : cinq étapes pour SSH.',
};
