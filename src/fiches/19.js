const S = require('../svg');

// Deux routeurs, deux LAN : une route aller, une route retour.
function schema() {
  let g = '';
  const y = 10;
  g += S.sw(10, y, 12, 5.4);
  g += S.text(10, y - 4.4, 'LAN A', { anchor: 'middle', size: 2.3, bold: true });
  g += S.text(10, y + 6, '192.168.1.0/24', { anchor: 'middle', mono: true, size: 1.9 });
  g += S.line(16, y, 36, y);
  g += S.text(34, y + 3.4, '.1', { anchor: 'end', mono: true, size: 1.9, c2: true });
  g += S.router(40, y);
  g += S.text(40, y - 5.4, 'R1', { anchor: 'middle', size: 2.4, bold: true });
  g += S.line(44, y, 80, y);
  g += S.text(62, y - 1.5, '10.0.12.0/30', { anchor: 'middle', mono: true, size: 2.1 });
  g += S.text(45.4, y + 3.4, '.1  g0/0/1', { mono: true, size: 1.9, c2: true });
  g += S.text(78.6, y + 3.4, '.2', { anchor: 'end', mono: true, size: 1.9, c2: true });
  g += S.router(84, y);
  g += S.text(84, y - 5.4, 'R2', { anchor: 'middle', size: 2.4, bold: true });
  g += S.line(88, y, 108, y);
  g += S.text(90, y + 3.4, '.1', { mono: true, size: 1.9, c2: true });
  g += S.sw(114, y, 12, 5.4);
  g += S.text(114, y - 4.4, 'LAN B', { anchor: 'middle', size: 2.3, bold: true });
  g += S.text(114, y + 6, '192.168.2.0/24', { anchor: 'middle', mono: true, size: 1.9 });
  g += S.line(114, y + 7.6, 114, y + 11.6);
  g += S.server(114, y + 15);
  g += S.text(117, y + 15.8, '.10', { mono: true, size: 1.9, c2: true });
  // flux
  g += S.line(16, 21.5, 104, 21.5, { end: 'ah', w: 0.25 });
  g += S.text(60, 20, 'aller : route sur R1', { anchor: 'middle', size: 2.1 });
  g += S.line(104, 25.5, 16, 25.5, { end: 'ah', w: 0.25, dash: '0.8 0.6' });
  g += S.text(60, 29, 'retour : route sur R2', { anchor: 'middle', size: 2.1 });
  // configs
  g += S.text(2, 35, 'R1(config)# ip route 192.168.2.0 255.255.255.0 10.0.12.2', { mono: true, size: 2 });
  g += S.text(2, 38.4, 'R1(config)# ip route 192.168.2.10 255.255.255.255 g0/0/1 10.0.12.2', { mono: true, size: 2 });
  g += S.text(2, 41.8, 'R2(config)# ip route 192.168.1.0 255.255.255.0 10.0.12.1', { mono: true, size: 2 });
  return S.svg(124, 43, g, 'Routes statiques IPv4');
}

module.exports = {
  num: 19,
  domain: '3.0 IP Connectivity',
  objectives: '3.3',
  title: 'Routes statiques IPv4',
  attend: 'Configurer et vérifier des routes statiques IPv4 vers un réseau et vers un hôte.',
  essentiel: [
    "Syntaxe : <code>ip route</code> réseau masque, puis next hop, interface de sortie, ou les deux ; AD facultative (1 par défaut).",
    "Next hop seul : route récursive ; le routeur cherche ensuite comment joindre le next hop. Interface seule : la route s'affiche « directly connected » ; adaptée aux liens point à point, à éviter sur Ethernet (une requête ARP par destination).",
    "Forme entièrement spécifiée (interface + next hop) : recommandée sur Ethernet.",
    "Route d'hôte : masque <code>255.255.255.255</code> (/32), pour un serveur précis. Elle l'emporte sur la route du réseau par la longueur de préfixe.",
    "Installation : la route n'entre dans la table que si son next hop est joignable ou son interface up.",
    "Chaque route aller exige une route retour sur le routeur distant. Une statique ne s'adapte pas aux pannes (voir route flottante, fiche 21).",
  ],
  schema: schema(),
  caption:
    "R1 joint le LAN B par une route réseau et le serveur par une route d'hôte. Sans la route de R2, les réponses n'ont pas de chemin.",
  commandes: [
    ['R1(config)# ip route 192.168.2.0 255.255.255.0 10.0.12.2', 'Réseau via next hop'],
    ['R1(config)# ip route 192.168.2.0 255.255.255.0 g0/0/1', 'Via interface de sortie'],
    ['R1(config)# ip route 192.168.2.0 255.255.255.0 g0/0/1 10.0.12.2', 'Entièrement spécifiée'],
    ['R1(config)# ip route 192.168.2.10 255.255.255.255 10.0.12.2', 'Route d\'hôte /32'],
    ['R2(config)# ip route 192.168.1.0 255.255.255.0 10.0.12.1', 'Route de retour'],
    ['R1# show ip route static', 'Routes S installées', true],
    ['R1# ping 192.168.2.10 source 192.168.1.1', 'Test aller et retour', true],
    ['R1# traceroute 192.168.2.10', 'Chemin suivi', true],
  ],
  pieges: [
    "Ping en échec malgré une route aller correcte : vérifier la route retour.",
    "Next hop injoignable : la route reste configurée, mais hors de la table.",
    "<code>ip route 192.168.2.0 255.255.0.0 …</code> est refusé : adresse et masque incohérents.",
  ],
  qcm: [
    {
      q: 'Quel masque donner à <code>ip route 192.0.2.50 … 10.0.0.2</code> pour une route d\'hôte ?',
      o: ['255.255.255.255', '255.255.255.0', '0.0.0.0', '255.255.255.254'],
      four: true,
      a: 'A',
      why: 'Route d\'hôte = /32, soit 255.255.255.255.',
    },
    {
      q: 'Statique via 10.0.12.2 configurée mais absente de la table : cause probable ?',
      o: ['AD 1 trop faible', 'Masque en /24', 'Next hop injoignable', 'CEF désactivé'],
      a: 'C',
      why: 'Une statique récursive n\'est installée que si son next hop est joignable.',
    },
    {
      q: 'R1 a une route vers le LAN B ; R2 n\'a que ses réseaux connectés. Correctif ?',
      o: ['Route vers le LAN B sur R1', 'Route vers le LAN A sur R2', 'no shutdown sur R1', 'AD 200 sur R1'],
      a: 'B',
      why: 'Le retour vers 192.168.1.0/24 manque sur R2.',
    },
  ],
  mnemo: 'Une route aller, une route retour.',
};
