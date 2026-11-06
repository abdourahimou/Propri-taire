const S = require('../svg');

// Où placer chaque protection STP.
function schema() {
  let g = '';
  g += S.sw(62, 7, 14, 6);
  g += S.text(70.5, 6, 'SW1 · distribution, root', { size: 2.3, bold: true });
  g += S.line(62, 10, 62, 23);
  g += S.text(63.4, 13.4, 'g0/2 : Root Guard', { mono: true, size: 2 });
  g += S.text(63.4, 21.4, 'g0/1 : Loop Guard (RP)', { mono: true, size: 2 });
  g += S.sw(62, 26, 14, 6);
  g += S.text(70.5, 27, 'SW2 · accès', { size: 2.3, bold: true });
  // PC légitime
  g += S.line(57, 29, 30, 37);
  g += S.pc(26, 39.5);
  g += S.text(20, 38, 'g0/10 · PC', { anchor: 'end', mono: true, size: 2 });
  g += S.text(20, 41, 'PortFast + BPDU Guard', { anchor: 'end', size: 2.1 });
  g += S.text(20, 44, 'forwarding immédiat', { anchor: 'end', size: 2, c2: true });
  // switch pirate
  g += S.line(67, 29, 87, 37, { color: S.ACC, w: 0.3 });
  g += S.sw(92, 39.5, 11, 5);
  g += S.text(99, 38, 'g0/11 · switch ajouté', { size: 2.1 });
  g += S.text(99, 41, 'BPDU reçu', { size: 2.1, acc: true });
  g += S.text(99, 44, '→ err-disabled', { size: 2.1, acc: true, bold: true });
  g += S.line(75, 30.6, 79, 34.2, { color: S.ACC, w: 0.5 });
  g += S.line(79, 30.6, 75, 34.2, { color: S.ACC, w: 0.5 });
  return S.svg(124, 46, g, 'Protections STP');
}

module.exports = {
  num: 15,
  domain: '2.0 Network Access',
  objectives: '2.5',
  title: 'Rapid PVST+ : PortFast et protections',
  attend:
    'Interpréter PortFast, BPDU Guard, BPDU Filter, Root Guard et Loop Guard, et leur effet sur l\'état des ports.',
  essentiel: [
    "PortFast : port d'accès vers un terminal, mis en forwarding immédiatement ; RSTP le traite en edge port. STP reste actif sur le port. Jamais vers un switch.",
    "BPDU Guard : tout BPDU reçu met le port en err-disabled. À associer à PortFast sur les ports utilisateurs ; en global, <code>spanning-tree portfast bpduguard default</code> couvre tous les ports PortFast.",
    "BPDU Filter : plus d'émission de BPDU. En global, un BPDU reçu retire le statut PortFast au port. Par interface, il ignore tout BPDU reçu ou émis, ce qui peut créer une boucle.",
    "Root Guard : sur les DP qui ne doivent jamais mener au root. Un BPDU supérieur reçu place le port en root-inconsistent (bloqué) ; il se rétablit seul quand ces BPDU cessent.",
    "Loop Guard : sur les root ports et ports alternate. Si les BPDU cessent (lien unidirectionnel), le port passe en loop-inconsistent au lieu de devenir designated.",
    "Sortie d'err-disabled : <code>shutdown</code> puis <code>no shutdown</code>, ou <code>errdisable recovery cause bpduguard</code> (300 s par défaut).",
  ],
  schema: schema(),
  caption:
    "Root Guard protège le root depuis la distribution ; Loop Guard surveille le root port de l'accès ; BPDU Guard coupe le port où un switch a été branché.",
  commandes: [
    ['SW2(config-if)# spanning-tree portfast', 'PortFast sur le port'],
    ['SW2(config-if)# spanning-tree bpduguard enable', 'BPDU Guard sur le port'],
    ['SW2(config)# spanning-tree portfast bpduguard default', 'BPDU Guard sur ports PortFast'],
    ['SW1(config-if)# spanning-tree guard root', 'Root Guard'],
    ['SW2(config-if)# spanning-tree guard loop', 'Loop Guard'],
    ['SW2(config)# errdisable recovery cause bpduguard', 'Réactivation automatique'],
    ['SW2# show interfaces status err-disabled', 'Ports en err-disabled', true],
    ['SW2# show spanning-tree interface g0/10 detail', 'PortFast, BPDU Guard, BPDU', true],
  ],
  pieges: [
    "PortFast ne désactive pas STP : il supprime seulement l'attente avant forwarding.",
    'Root Guard bloque tant que des BPDU supérieurs arrivent ; BPDU Guard met le port en err-disabled au premier BPDU.',
    'Sans <code>errdisable recovery</code>, un port err-disabled exige <code>shutdown</code> puis <code>no shutdown</code>.',
  ],
  qcm: [
    {
      q: 'Un utilisateur branche un switch sur un port en PortFast avec BPDU Guard. État du port ?',
      o: ['Forwarding', 'Root-inconsistent', 'Err-disabled', 'Blocking'],
      a: 'C',
      why: 'Le switch ajouté émet des BPDU : BPDU Guard désactive le port.',
    },
    {
      q: 'Quelle protection met un port en root-inconsistent à la réception d\'un BPDU supérieur ?',
      o: ['Root Guard', 'BPDU Guard', 'Loop Guard', 'PortFast'],
      four: true,
      a: 'A',
      why: 'Root Guard refuse qu\'un root apparaisse derrière ce port.',
    },
    {
      q: 'Quelle fonction empêche un port alternate de passer en forwarding quand les BPDU cessent ?',
      o: ['BPDU Filter', 'Root Guard', 'PortFast', 'Loop Guard'],
      four: true,
      a: 'D',
      why: 'Loop Guard place le port en loop-inconsistent au lieu de le débloquer.',
    },
  ],
  mnemo: 'BPDU Guard coupe, Root Guard bloque, Loop Guard retient.',
};
