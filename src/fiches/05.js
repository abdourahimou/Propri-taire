const S = require('../svg');

// Plan VLSM de 192.168.10.0/24 : topologie + règle d'adresses.
function schema() {
  const y = 7, ys = 20;
  const R = [[18, 'R2'], [62, 'R1'], [106, 'R3']];
  const lans = [
    [18, 'LAN B · 50 hôtes', '.128/26', '.129'],
    [62, 'LAN A · 100 hôtes', '.0/25', '.1'],
    [106, 'LAN C · 20 hôtes', '.192/27', '.193'],
  ];
  let g = '';
  g += S.line(22, y, 58, y) + S.line(66, y, 102, y);
  g += S.text(40, y - 1.4, 'WAN1 .224/30', { anchor: 'middle', mono: true, size: 2.3 });
  g += S.text(24, y + 3.2, '.226', { mono: true, size: 2.1, c2: true });
  g += S.text(56, y + 3.2, '.225', { anchor: 'end', mono: true, size: 2.1, c2: true });
  g += S.text(84, y - 1.4, 'WAN2 .228/30', { anchor: 'middle', mono: true, size: 2.3 });
  g += S.text(68, y + 3.2, '.229', { mono: true, size: 2.1, c2: true });
  g += S.text(100, y + 3.2, '.230', { anchor: 'end', mono: true, size: 2.1, c2: true });
  for (const [x, l] of R) {
    g += S.line(x, y + 4, x, ys - 2.7);
    g += S.router(x, y);
    g += S.text(x - 1.4, y + 8.4, l, { anchor: 'end', bold: true, size: 2.6 });
  }
  for (const [x, a, b, gw] of lans) {
    g += S.sw(x, ys);
    g += S.text(x + 1.2, ys - 3.6, gw, { mono: true, size: 2.1, c2: true });
    g += S.text(x, ys + 5.6, a, { anchor: 'middle', size: 2.5, bold: true });
    g += S.text(x, ys + 8.6, '192.168.10' + b, { anchor: 'middle', mono: true, size: 2.3 });
  }
  const x0 = 2, W = 120, top = 34, h = 4.6, k = W / 256;
  const X = (a) => +(x0 + a * k).toFixed(2);
  const segs = [
    [0, 128, 'A  /25', S.FILL], [128, 192, 'B  /26', S.PAPER], [192, 224, 'C  /27', S.FILL],
    [224, 228, '', S.INK2], [228, 232, '', S.INK2], [232, 256, 'libre', S.PAPER],
  ];
  for (const [a, b, l, f] of segs) {
    g += S.rect(X(a), top, +((b - a) * k).toFixed(2), h, { fill: f });
    if (l) g += S.text(X((a + b) / 2), top + 3.2, l, { anchor: 'middle', size: 2.3, c2: l === 'libre' });
  }
  for (const [t, anchor] of [[0, 'start'], [128, 'middle'], [192, 'middle'], [224, 'end'], [256, 'end']]) {
    g += S.line(X(t), top + h, X(t), top + h + 1);
    g += S.text(X(t), top + h + 3.4, t === 256 ? '.255' : '.' + t, { anchor, mono: true, size: 2.1 });
  }
  g += S.line(X(228), top + h, X(228), top + h + 4.4, { color: S.INK2 });
  g += S.text(X(228), top + h + 6.6, 'WAN1 et WAN2 (.224 à .231)', { anchor: 'end', size: 2.2, c2: true });
  return S.svg(124, 46, g, 'Plan VLSM de 192.168.10.0/24');
}

module.exports = {
  num: 5,
  domain: '1.0 Network Fundamentals',
  objectives: '1.6 · 1.7 · 1.10',
  title: 'IPv4 : sous-réseaux et adressage privé',
  attend:
    "Configurer et vérifier l'adressage IPv4 d'une interface et d'un poste client, découper un bloc en sous-réseaux et identifier les plages privées.",
  essentiel: [
    "Préfixe /n : n bits réseau, h = 32 – n bits hôtes. Hôtes utilisables : 2<sup>h</sup> – 2, adresse réseau et broadcast (diffusion) exclues. Exception : /31 sur lien point à point (RFC 3021).",
    "Pas du découpage = 256 – valeur de l'octet du masque. /27 → 255.255.255.224 → pas de 32 : sous-réseaux .0, .32, .64, .96…<table class=\"ref\"><tbody><tr><th>Préfixe</th><td>/25</td><td>/26</td><td>/27</td><td>/28</td><td>/29</td><td>/30</td></tr><tr><th>4ᵉ octet</th><td>128</td><td>192</td><td>224</td><td>240</td><td>248</td><td>252</td></tr><tr><th>Pas</th><td>128</td><td>64</td><td>32</td><td>16</td><td>8</td><td>4</td></tr><tr><th>Hôtes</th><td>126</td><td>62</td><td>30</td><td>14</td><td>6</td><td>2</td></tr></tbody></table>",
    "VLSM (Variable Length Subnet Mask, masque de longueur variable) : allouer les besoins par taille décroissante, chaque bloc commençant sur un multiple de sa taille.",
    "Plages privées RFC 1918, non routées sur Internet (NAT requis) : <code>10.0.0.0/8</code>, <code>172.16.0.0/12</code>, <code>192.168.0.0/16</code>. Distinctes de <code>169.254.0.0/16</code> (APIPA, auto-attribuée sans DHCP) et de <code>127.0.0.0/8</code> (loopback).",
    "Poste client, vérifier adresse, masque, passerelle et DNS : Windows <code>ipconfig /all</code> ; Linux <code>ip addr</code>, <code>ip route</code> ; macOS <code>ifconfig</code>, <code>netstat -rn</code>.",
  ],
  schema: schema(),
  caption:
    "Plan VLSM de 192.168.10.0/24. Blocs alloués du plus grand au plus petit ; 192.168.10.232 à .255 restent libres (un /29 puis un /28).",
  commandes: [
    ['R1(config)# interface g0/0/1', "Interface LAN A"],
    ['R1(config-if)# ip address 192.168.10.1 255.255.255.128', 'Adresse et masque décimal pointé'],
    ['R1(config-if)# no shutdown', 'Active l\'interface (éteinte par défaut)'],
    ['SW1(config-if)# ip address 192.168.10.2 255.255.255.128', 'Adresse de gestion (SVI VLAN 1)'],
    ['SW1(config)# ip default-gateway 192.168.10.1', 'Passerelle d\'un switch L2'],
    ['R1# show ip interface brief', 'Adresse et état de chaque interface', true],
    ['R1# show ip interface g0/0/1', 'Adresse /25, état, ACL', true],
    ['C:\\> ipconfig /all', 'Paramètres IP sous Windows', true],
  ],
  pieges: [
    "Un /27 offre 30 hôtes, pas 32 : réseau et broadcast ne s'attribuent pas.",
    "IOS refuse <code>ip address 192.168.10.1/25</code> : en IPv4, le masque s'écrit en décimal pointé.",
    "<code>172.32.0.1</code> est publique : le bloc privé <code>172.16.0.0/12</code> s'arrête à 172.31.255.255.",
  ],
  qcm: [
    {
      q: "Un hôte est configuré en <code>172.16.45.200/21</code>. Quelle est l'adresse de broadcast de son sous-réseau ?",
      o: ['172.16.45.255', '172.16.47.255', '172.16.48.255', '172.16.40.255'],
      four: true,
      a: 'B',
      why: "/21 = pas de 8 sur le 3ᵉ octet ; 45 est dans le bloc 40–47, broadcast 172.16.47.255.",
    },
    {
      q: 'Quel masque fournit au moins 50 hôtes utilisables en gaspillant le moins d\'adresses ?',
      o: ['255.255.255.224', '255.255.255.128', '255.255.255.192', '255.255.255.240'],
      four: true,
      a: 'C',
      why: '/26 = 2⁶ – 2 = 62 hôtes ; un /27 (30 hôtes) est insuffisant.',
    },
    {
      q: 'Un poste Windows affiche <code>169.254.12.7</code>, masque <code>255.255.0.0</code>, sans passerelle. Cause la plus probable ?',
      o: ['Adresse RFC 1918 saisie à la main', 'Masque de sous-réseau erroné', 'Serveur DNS injoignable', 'Aucune réponse DHCP reçue'],
      a: 'D',
      why: '169.254.0.0/16 (APIPA) est auto-attribuée faute d\'offre DHCP.',
    },
  ],
  mnemo: 'Masques : 128 · 192 · 224 · 240 · 248 · 252 · 254 · 255 ; chaque bit divise le pas par 2.',
};
