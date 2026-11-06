const S = require('../svg');

// Méthode de dépannage d'une adjacence absente.
function schema() {
  let g = '';
  const steps = [
    ['Interface up/up, bonne adresse ?', 'show ip interface brief'],
    ['OSPF actif sur l\'interface, bonne aire ?', 'show ip ospf interface brief'],
    ['Interface passive ?', 'show ip protocols'],
    ['Hello/Dead, masque, auth. identiques ?', 'show ip ospf interface g0/0/1'],
    ['MTU égales, RID distincts ?', 'debug ip ospf adj'],
  ];
  steps.forEach(([q, c], i) => {
    const y = 4 + i * 8;
    g += S.box(33, y, 56, 5.4, q, { size: 2.2 });
    g += S.text(1.2, y + 0.8, String(i + 1), { size: 2.4, bold: true, c2: true });
    g += S.line(61, y, 66, y, { color: S.INK2 });
    g += S.text(68, y + 0.8, c, { mono: true, size: 2.1 });
    if (i < steps.length - 1) g += S.line(33, y + 2.7, 33, y + 5.3, { end: 'ah', w: 0.25 });
  });
  g += S.line(33, 36.7, 33, 39.4, { end: 'ah', w: 0.25 });
  g += S.box(33, 42.2, 56, 5.2, 'Voisin en FULL', { size: 2.3, bold: true, fill: S.FILL });
  g += S.text(68, 43, 'show ip ospf neighbor', { mono: true, size: 2.1, bold: true });
  return S.svg(124, 46, g, 'Dépannage OSPF');
}

module.exports = {
  num: 25,
  domain: '3.0 IP Connectivity',
  objectives: '3.4',
  title: 'OSPF : router ID et dépannage',
  attend:
    "Configurer le router ID OSPF, vérifier les adjacences et diagnostiquer les échecs les plus courants.",
  essentiel: [
    "Router ID (RID) : identifiant de 32 bits, unique dans le domaine. Choisi au démarrage du processus : <code>router-id</code> manuel, sinon plus haute IP de loopback active, sinon plus haute IP d'interface active.",
    "Loopback : toujours up, adresse stable, idéale comme RID. OSPF l'annonce en /32 par défaut, quel que soit son masque.",
    "RID dupliqué : adjacence refusée entre les deux routeurs (message « Duplicate router-id ») et instabilité de la LSDB.",
    "Méthode, du bas vers le haut : interface et adresse ; OSPF actif et aire ; interface passive ; paramètres Hello (timers, masque, authentification) ; MTU et RID ; ACL qui bloquerait le protocole 89 ou <code>224.0.0.5</code>.",
    "Voisin en Full mais route absente : réseau non annoncé, route concurrente d'AD plus faible (statique), ou préfixe plus long ailleurs.",
    "<code>debug ip ospf hello</code> signale « Mismatched hello parameters » quand timers ou masque diffèrent.",
  ],
  schema: schema(),
  caption: "Vérifier dans cet ordre : la plupart des pannes se trouvent aux étapes 1 à 4.",
  commandes: [
    ['R1(config)# interface loopback 0', 'Interface toujours up'],
    ['R1(config-if)# ip address 1.1.1.1 255.255.255.255', 'Adresse candidate au RID'],
    ['R1(config-router)# router-id 1.1.1.1', 'RID manuel, prioritaire'],
    ['R1# clear ip ospf process', 'Applique un nouveau RID'],
    ['R1# show ip ospf', 'RID et paramètres du processus', true],
    ['R1# debug ip ospf hello', 'Paramètres Hello incompatibles', true],
    ['R1# undebug all', 'Arrête tous les debug'],
  ],
  pieges: [
    "Le RID n'a pas besoin d'être joignable ni annoncé : c'est un identifiant.",
    "Une loopback en /24 est annoncée en /32 : le préfixe vu par les voisins diffère du masque configuré.",
    "Voisin en Full mais route absente : chercher une route d'AD plus faible ou un réseau non annoncé.",
  ],
  qcm: [
    {
      q: 'R1 : Lo0 10.255.0.1, g0/0/0 192.168.1.1, g0/0/1 10.0.12.1, sans <code>router-id</code>. RID ?',
      o: ['192.168.1.1', '10.255.0.1', '10.0.12.1', '0.0.0.0'],
      four: true,
      a: 'B',
      why: 'Une loopback active passe avant les interfaces physiques, même d\'adresse plus haute.',
    },
    {
      q: '<code>debug ip ospf hello</code> affiche « Mismatched hello parameters ». Cause ?',
      o: ['RID dupliqué', 'MTU différente', 'Timers ou masque différents', 'Process ID différents'],
      a: 'C',
      why: 'Ce message porte sur les champs du Hello : intervalles et masque.',
    },
    {
      q: 'Après <code>router-id 9.9.9.9</code>, <code>show ip ospf</code> montre encore l\'ancien RID. Que faire ?',
      o: ['no router ospf 1', 'shutdown sur Lo0', 'copy run start', 'clear ip ospf process'],
      a: 'D',
      why: 'Le RID est figé au démarrage du processus ; il faut le relancer.',
    },
  ],
  mnemo: 'Du bas vers le haut : interface, OSPF, passive, Hello, MTU.',
};
