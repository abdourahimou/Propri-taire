const S = require('../svg');

// VPN site à site, accès distant, comparatif RADIUS / TACACS+.
function schema() {
  let g = '';
  const cloud = (cx, cy) => `<ellipse cx="${cx}" cy="${cy}" rx="11" ry="4.2" fill="none" stroke="${S.INK2}" stroke-width="${S.SW}" stroke-dasharray="1 0.8"/>` + S.text(cx, cy + 0.9, 'Internet', { anchor: 'middle', size: 2.2, c2: true });
  // site à site
  g += S.text(2, 3, 'Site à site', { size: 2.3, bold: true });
  g += S.sw(8, 10, 9, 4.4) + S.line(12.5, 10, 26, 10);
  g += S.router(30, 10);
  g += S.text(30, 15.8, 'routeur A', { anchor: 'middle', size: 2, c2: true });
  g += cloud(62, 10);
  g += S.router(94, 10);
  g += S.text(94, 15.8, 'routeur B', { anchor: 'middle', size: 2, c2: true });
  g += S.line(98, 10, 111.5, 10) + S.sw(116, 10, 9, 4.4);
  g += S.line(34, 8.6, 90, 8.6, { color: S.ACC, w: 0.3 }) + S.line(34, 11.4, 90, 11.4, { color: S.ACC, w: 0.3 });
  g += S.text(36, 7.2, 'tunnel IPsec (ESP)', { anchor: 'middle', size: 2.1, acc: true });
  // accès distant
  g += S.text(2, 21, 'Accès distant', { size: 2.3, bold: true });
  g += S.pc(10, 27);
  g += S.text(10, 32.6, 'client VPN', { anchor: 'middle', size: 2, c2: true });
  g += cloud(62, 27);
  g += S.fw(94, 27);
  g += S.text(94, 32.6, 'passerelle VPN', { anchor: 'middle', size: 2, c2: true });
  g += S.line(13, 25.6, 89.5, 25.6, { color: S.ACC, w: 0.3 }) + S.line(13, 28.4, 89.5, 28.4, { color: S.ACC, w: 0.3 });
  g += S.text(36, 23.6, 'TLS ou IPsec', { anchor: 'middle', size: 2.1, acc: true });
  // tableau
  const ty = 37.5, cols = [2, 30, 78];
  g += S.line(2, ty - 2.6, 122, ty - 2.6, { color: S.RULE });
  ['', 'RADIUS', 'TACACS+'].forEach((t, i) => (g += S.text(cols[i], ty, t, { size: 2.2, bold: true })));
  [['Transport', 'UDP 1812 / 1813', 'TCP 49'], ['Chiffrement', 'mot de passe seul', 'corps entier du paquet'], ['Usage type', 'accès réseau (802.1X, VPN)', 'administration des équipements']].forEach((r, j) =>
    r.forEach((t, i) => (g += S.text(cols[i], ty + 3.4 + j * 3.2, t, { size: 2.05, c2: i === 0 }))));
  return S.svg(124, 48, g, 'VPN et AAA');
}

module.exports = {
  num: 33,
  domain: '5.0 Security Fundamentals',
  objectives: '5.8 · 5.5',
  title: 'AAA et VPN IPsec',
  attend:
    "Comparer authentification, autorisation et traçabilité (AAA) avec RADIUS et TACACS+, et décrire les VPN IPsec site à site et d'accès distant.",
  essentiel: [
    "AAA : Authentication (qui êtes-vous), Authorization (que pouvez-vous faire), Accounting (qu'avez-vous fait : journalisation des sessions et des commandes).",
    "RADIUS : standard, UDP 1812 et 1813, chiffre seulement le mot de passe, associe authentification et autorisation. TACACS+ : Cisco, TCP 49, chiffre tout le corps, sépare les trois fonctions et autorise commande par commande.",
    "802.1X : supplicant (client), authenticator (switch ou AP), serveur d'authentification (RADIUS). EAP circule en EAPoL entre le client et le switch.",
    "IPsec : confidentialité (AES), intégrité (SHA), authentification de l'origine (clé partagée ou certificats), anti-rejeu. ESP (protocole IP 50) chiffre et authentifie ; AH (IP 51) authentifie sans chiffrer. IKE (UDP 500, 4500 avec NAT-T) négocie les clés.",
    "Site à site : deux passerelles chiffrent le trafic entre deux réseaux, de façon transparente pour les hôtes. GRE over IPsec ajoute multicast et routage dynamique.",
    "Accès distant : un client VPN sur le poste (Cisco Secure Client) établit un tunnel TLS ou IPsec vers une passerelle ; variante sans client par navigateur (HTTPS).",
  ],
  schema: schema(),
  caption:
    "En site à site, les hôtes ignorent le chiffrement ; en accès distant, le poste porte lui-même le tunnel.",
  commandes: [
    ['R1(config)# aaa new-model', 'Active AAA'],
    ['R1(config)# radius server ISE', 'Déclare un serveur RADIUS'],
    ['R1(config-radius-server)# address ipv4 10.0.50.20 auth-port 1812 acct-port 1813', 'Adresse et ports'],
    ['R1(config-radius-server)# key Rad1us-Lab', 'Secret partagé'],
    ['R1(config)# aaa authentication login default group radius local', 'RADIUS, puis comptes locaux'],
    ['R1# show aaa servers', 'État et compteurs des serveurs', true],
    ['R1# show crypto isakmp sa', 'Phase 1 IKE', true],
    ['R1# show crypto ipsec sa', 'Tunnels, paquets chiffrés', true],
  ],
  pieges: [
    'RADIUS ne chiffre que le mot de passe ; TACACS+ chiffre tout le corps du paquet.',
    "<code>local</code> en fin de liste ne sert que si le serveur ne répond pas, pas si l'utilisateur est refusé.",
    "AH n'assure aucune confidentialité : seul ESP chiffre.",
  ],
  qcm: [
    {
      q: 'Quel protocole AAA utilise TCP 49 et sépare les trois fonctions ?',
      o: ['RADIUS', 'TACACS+', 'LDAP', 'Kerberos'],
      four: true,
      a: 'B',
      why: 'TACACS+ : TCP 49, autorisation distincte de l\'authentification.',
    },
    {
      q: 'Quel composant d\'IPsec chiffre les données ?',
      o: ['AH', 'IKE', 'ESP', 'GRE'],
      four: true,
      a: 'C',
      why: 'ESP chiffre ; AH authentifie seulement ; IKE négocie les clés.',
    },
    {
      q: 'Un commercial se connecte au réseau de l\'entreprise depuis un hôtel. Type de VPN ?',
      o: ['Site à site', 'MPLS', 'GRE seul', 'Accès distant'],
      four: true,
      a: 'D',
      why: 'Un poste isolé avec un client VPN : accès distant.',
    },
  ],
  mnemo: 'Qui es-tu, que peux-tu, qu\'as-tu fait : les trois A.',
};
