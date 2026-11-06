const S = require('../svg');

// PAT : deux hôtes privés derrière une adresse publique.
function schema() {
  let g = '';
  const y = 11;
  g += S.pc(6, 5);
  g += S.pc(6, 17);
  g += S.text(10, 5.8, '.11', { mono: true, size: 1.9, c2: true });
  g += S.text(10, 17.8, '.12', { mono: true, size: 1.9, c2: true });
  g += S.line(8.6, 5, 17, y) + S.line(8.6, 17, 17, y);
  g += S.sw(22, y, 10, 5);
  g += S.text(22, y + 6, '192.168.1.0/24', { anchor: 'middle', mono: true, size: 1.9 });
  g += S.line(27, y, 50, y);
  g += S.text(48.6, y - 1.4, 'inside', { anchor: 'end', size: 2.1, bold: true });
  g += S.text(48.6, y + 3.4, 'g0/0/1', { anchor: 'end', mono: true, size: 1.9, c2: true });
  g += S.router(54, y);
  g += S.text(54, y - 5.4, 'R1', { anchor: 'middle', size: 2.4, bold: true });
  g += S.line(58, y, 88, y);
  g += S.text(59.4, y - 1.4, 'outside', { size: 2.1, bold: true });
  g += S.text(59.4, y + 3.4, 'g0/0/0 · 203.0.113.2', { mono: true, size: 1.9, c2: true });
  g += `<ellipse cx="96" cy="${y}" rx="8" ry="4.6" fill="none" stroke="${S.INK2}" stroke-width="${S.SW}" stroke-dasharray="1 0.8"/>`;
  g += S.text(96, y + 0.9, 'Internet', { anchor: 'middle', size: 2.2, c2: true });
  g += S.line(104, y, 110, y);
  g += S.server(114, y);
  g += S.text(114, y + 6, '198.51.100.80', { anchor: 'middle', mono: true, size: 1.9 });
  // table
  const ty = 26, cols = [2, 10, 42, 74];
  g += S.text(2, ty - 3, 'R1# show ip nat translations', { mono: true, size: 2.1, bold: true });
  ['Pro', 'Inside global', 'Inside local', 'Outside global'].forEach((t, i) => (g += S.text(cols[i], ty + 1, t, { mono: true, size: 1.95, bold: true })));
  const rows = [['tcp', '203.0.113.2:49152', '192.168.1.11:49152', '198.51.100.80:443'], ['tcp', '203.0.113.2:1024', '192.168.1.12:49152', '198.51.100.80:443']];
  rows.forEach((r, j) => r.forEach((t, i) => (g += S.text(cols[i], ty + 4.6 + j * 3.4, t, { mono: true, size: 1.95 }))));
  g += S.line(cols[1], ty + 10.4, cols[1] + 28, ty + 10.4, { color: S.INK2 });
  g += S.text(cols[1], ty + 13.6, 'adresse publique + port', { size: 2.1, c2: true });
  g += S.line(cols[2], ty + 10.4, cols[2] + 28, ty + 10.4, { color: S.INK2 });
  g += S.text(cols[2], ty + 13.6, 'adresse privée réelle', { size: 2.1, c2: true });
  g += S.text(cols[3], ty + 13.6, 'port réattribué si déjà pris', { size: 2.1, c2: true });
  return S.svg(124, 41, g, 'Traduction PAT');
}

module.exports = {
  num: 27,
  domain: '4.0 IP Services',
  objectives: '4.1',
  title: 'NAT statique, pool et PAT',
  attend:
    "Configurer et vérifier l'inside source NAT : statique, dynamique par pool, et avec surcharge (PAT).",
  essentiel: [
    "Inside local : adresse privée de l'hôte interne. Inside global : adresse publique qui le représente. Outside global : adresse réelle de l'hôte externe. Outside local : cette même adresse vue de l'intérieur (identique sans NAT côté externe).",
    "<code>ip nat inside</code> côté LAN, <code>ip nat outside</code> côté FAI : la traduction ne s'applique qu'au trafic qui passe de l'une à l'autre.",
    "NAT statique : correspondance 1:1 permanente, pour un serveur joignable depuis Internet.",
    "NAT dynamique : une ACL désigne les adresses à traduire, un pool fournit les adresses publiques ; correspondance 1:1 temporaire. Pool épuisé : les nouveaux flux sont rejetés.",
    "PAT (overload) : de nombreux hôtes partagent une seule adresse publique, distingués par le port source. Forme courante : <code>ip nat inside source list 1 interface g0/0/0 overload</code>.",
    "Les traductions dynamiques expirent après 24 h d'inactivité par défaut ; <code>clear ip nat translation *</code> les vide.",
  ],
  schema: schema(),
  caption:
    "Deux hôtes ouvrent une session HTTPS avec le même port source : R1 garde 49152 pour le premier et réattribue un autre port au second.",
  commandes: [
    ['R1(config-if)# ip nat inside', 'Interface côté LAN'],
    ['R1(config-if)# ip nat outside', 'Interface côté FAI'],
    ['R1(config)# ip nat inside source static 192.168.1.10 203.0.113.10', 'NAT statique (serveur)'],
    ['R1(config)# access-list 1 permit 192.168.1.0 0.0.0.255', 'Adresses à traduire'],
    ['R1(config)# ip nat pool PUB 203.0.113.17 203.0.113.30 netmask 255.255.255.240', 'Pool d\'adresses publiques'],
    ['R1(config)# ip nat inside source list 1 pool PUB', 'NAT dynamique'],
    ['R1(config)# ip nat inside source list 1 interface g0/0/0 overload', 'PAT sur l\'interface'],
    ['R1# show ip nat translations', 'Table des traductions', true],
    ['R1# show ip nat statistics', 'Compteurs, interfaces in/out', true],
  ],
  pieges: [
    '<code>ip nat inside</code> et <code>ip nat outside</code> inversés : aucune traduction.',
    "ACL qui ne couvre pas le LAN : le trafic sort sans traduction et les réponses ne reviennent pas.",
    "Inside global = adresse publique de l'hôte interne ; inside local = son adresse privée.",
  ],
  qcm: [
    {
      q: 'Dans la table du schéma, quelle est l\'inside local du premier flux ?',
      o: ['203.0.113.2', '192.168.1.11', '198.51.100.80', '203.0.113.1'],
      four: true,
      a: 'B',
      why: 'Inside local : adresse privée réelle de l\'hôte interne.',
    },
    {
      q: 'Quel mot-clé permet à 200 hôtes de partager une seule adresse publique ?',
      o: ['static', 'pool', 'overload', 'extendable'],
      four: true,
      a: 'C',
      why: 'overload active le PAT : multiplexage par numéro de port.',
    },
    {
      q: 'NAT dynamique sans overload, pool de 14 adresses toutes prises. Sort du flux d\'un 15ᵉ hôte ?',
      o: ['Traduit par PAT', 'Envoyé sans traduction', 'Traduit avec l\'IP de l\'interface', 'Rejeté'],
      a: 'D',
      why: 'Sans adresse libre dans le pool, le paquet n\'est pas traduit et il est rejeté.',
    },
  ],
  mnemo: 'Local = chez moi, global = vu d\'Internet.',
};
