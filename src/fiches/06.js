const S = require('../svg');

// Construction d'un identifiant d'interface EUI-64 modifié.
function schema() {
  let g = '';
  const row = (y, label, cells, note) => {
    let s = S.text(1, y + 1, label, { size: 2.2, c2: true });
    let x = 30;
    for (const [w, t, f, b] of cells) {
      s += S.box(x + w / 2, y, w, 5, t, { mono: true, size: 2.3, fill: f || S.PAPER, bold: b });
      x += w;
    }
    if (note) s += S.text(x + 2, y + 0.8, note, { size: 2.1, c2: true });
    return s;
  };
  g += row(4, 'MAC (48 bits)', [[24, '00 1A 2B', S.FILL], [24, '3C 4D 5E']]);
  g += row(12, '1. Couper en deux', [[24, '00 1A 2B', S.FILL], [12, ''], [24, '3C 4D 5E']]);
  g += row(20, '2. Insérer FF FE', [[24, '00 1A 2B'], [12, 'FF FE', S.FILL, true], [24, '3C 4D 5E']]);
  g += row(28, '3. Inverser le 7<tspan baseline-shift="super" font-size="1.5">e</tspan> bit', [[24, '02 1A 2B', S.FILL, true], [12, 'FF FE'], [24, '3C 4D 5E']]);
  g += S.text(30, 36.6, '0x00 = 0000 0000 → 0000 0010 = 0x02', { mono: true, size: 2.1 });
  g += S.text(93, 36.6, 'bit U/L', { size: 2.1, acc: true });
  g += S.line(1, 39, 123, 39, { color: S.RULE });
  g += S.text(1, 42.6, 'Résultat', { size: 2.2, c2: true });
  g += S.text(30, 42.6, '2001:db8:acad:1:21a:2bff:fe3c:4d5e', { mono: true, size: 2.4, bold: true });
  g += S.text(30, 46, 'fe80::21a:2bff:fe3c:4d5e (link-local)', { mono: true, size: 2.2, c2: true });
  return S.svg(124, 47, g, 'Construction EUI-64');
}

module.exports = {
  num: 6,
  domain: '1.0 Network Fundamentals',
  objectives: '1.8 · 1.9',
  title: 'IPv6 : adressage et types',
  attend:
    "Configurer et vérifier un préfixe IPv6 sur une interface, et décrire les adresses GUA, ULA, link-local, anycast, multicast et EUI-64 modifié.",
  essentiel: [
    "128 bits en 8 groupes de 16 bits hexadécimaux. Abréviation : zéros de tête supprimés ; une seule suite de groupes nuls remplacée par <code>::</code>. <code>2001:0db8:0000:0000:0000:0a00:0000:0001</code> → <code>2001:db8::a00:0:1</code>.",
    "Préfixe de site courant /48, sous-réseaux en /64 : l'identifiant d'interface occupe 64 bits. <code>2001:db8::/32</code> est réservé à la documentation.",
    "GUA (Global Unicast) : <code>2000::/3</code>, routable sur Internet. ULA (Unique Local) : <code>FC00::/7</code>, en pratique <code>FD00::/8</code>, équivalent des adresses privées. Link-local : <code>FE80::/10</code>, automatique sur toute interface IPv6, jamais routée.",
    "Multicast <code>FF00::/8</code> : <code>FF02::1</code> tous les nœuds, <code>FF02::2</code> tous les routeurs, <code>FF02::1:FF00:0/104</code> solicited-node (NDP). IPv6 n'a pas de broadcast. Anycast : une même adresse unicast sur plusieurs nœuds ; le plus proche répond.",
    "EUI-64 modifié : MAC coupée en deux, <code>FFFE</code> inséré au milieu, 7ᵉ bit du premier octet inversé.",
    "Loopback <code>::1</code>, adresse non spécifiée <code>::</code>. Un routeur ne route IPv6 qu'avec <code>ipv6 unicast-routing</code>.",
  ],
  schema: schema(),
  caption:
    "MAC 00:1A:2B:3C:4D:5E sur le préfixe 2001:db8:acad:1::/64. Le même identifiant sert à la link-local automatique.",
  commandes: [
    ['R1(config)# ipv6 unicast-routing', 'Active le routage IPv6'],
    ['R1(config-if)# ipv6 address 2001:db8:acad:1::1/64', 'GUA statique'],
    ['R1(config-if)# ipv6 address 2001:db8:acad:1::/64 eui-64', 'Identifiant en EUI-64'],
    ['R1(config-if)# ipv6 address fe80::1 link-local', 'Link-local manuelle'],
    ['R1(config-if)# ipv6 enable', 'Link-local seule, automatique'],
    ['R1# show ipv6 interface brief', 'Adresses et état', true],
    ['R1# show ipv6 interface g0/0/0', 'Groupes multicast rejoints', true],
  ],
  pieges: [
    "<code>::</code> ne s'emploie qu'une fois : <code>2001:db8::1::5</code> est invalide.",
    "Sans <code>ipv6 unicast-routing</code>, les adresses se configurent, mais le routeur ne route pas et n'émet pas de RA.",
    "EUI-64 : c'est le 7ᵉ bit qui s'inverse. <code>00</code> devient <code>02</code>, pas <code>01</code>.",
  ],
  qcm: [
    {
      q: 'Quelle écriture abrège correctement <code>2001:0db8:0000:0000:0001:0000:0000:0010</code> ?',
      o: ['2001:db8::1::10', '2001:db8::1:0:0:10', '2001:db8:0:0:1::1', '2001:db8::1:10'],
      a: 'B',
      why: 'Un seul :: ; 0010 devient 10 et les autres zéros restent écrits.',
    },
    {
      q: 'Quel préfixe identifie une adresse link-local ?',
      o: ['FC00::/7', 'FF02::/16', '2000::/3', 'FE80::/10'],
      four: true,
      a: 'D',
      why: 'FE80::/10 : link-local. FC00::/7 : ULA ; 2000::/3 : GUA.',
    },
    {
      q: 'MAC <code>0050.56AB.CDEF</code>. Quel identifiant d\'interface EUI-64 ?',
      o: ['0250:56ff:feab:cdef', '0050:56ff:feab:cdef', '0250:56fe:ffab:cdef', '0150:56ff:feab:cdef'],
      a: 'A',
      why: 'FFFE au milieu ; 00 devient 02 par inversion du 7ᵉ bit.',
    },
  ],
  mnemo: 'FE80 : lien · FD : privé · 2 ou 3 : global · FF : multicast.',
};
