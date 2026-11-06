const S = require('../svg');

// Chaîne du risque + facteurs d'authentification.
function schema() {
  let g = '';
  const chain = [[13, 'Menace'], [41, 'Exploit'], [69, 'Vulnérabilité'], [99, 'Actif']];
  for (const [x, t] of chain) g += S.box(x, 6, 22, 6, t, { size: 2.3, bold: true });
  g += S.line(24, 6, 29.6, 6, { end: 'ah', w: 0.25 }) + S.line(52, 6, 57.6, 6, { end: 'ah', w: 0.25 }) + S.line(80, 6, 87.6, 6, { end: 'ah', w: 0.25 });
  g += S.text(13, 12, 'acteur, intention', { anchor: 'middle', size: 1.9, c2: true });
  g += S.text(41, 12, 'code ou méthode', { anchor: 'middle', size: 1.9, c2: true });
  g += S.text(69, 12, 'faiblesse', { anchor: 'middle', size: 1.9, c2: true });
  g += S.text(99, 12, 'donnée, service', { anchor: 'middle', size: 1.9, c2: true });
  g += S.box(55, 18.5, 60, 5, 'Atténuation : correctif, ACL, MFA, formation…', { size: 2.1, fill: S.FILL });
  g += S.line(55, 16, 55, 9.6, { color: S.ACC, w: 0.4, end: 'aha' });
  g += S.line(2, 25, 122, 25, { color: S.RULE });
  g += S.text(2, 29, 'MFA : au moins deux catégories différentes', { size: 2.3, bold: true });
  const f = [[22, 'Ce que l\'on sait', 'mot de passe, PIN'], [62, 'Ce que l\'on possède', 'jeton, téléphone, carte'], [102, 'Ce que l\'on est', 'empreinte, visage']];
  for (const [x, t, e] of f) {
    g += S.box(x, 36, 36, 6, t, { size: 2.3, bold: true });
    g += S.text(x, 42.4, e, { anchor: 'middle', size: 2, c2: true });
  }
  return S.svg(124, 44, g, 'Risque et facteurs');
}

module.exports = {
  num: 31,
  domain: '5.0 Security Fundamentals',
  objectives: '5.1 · 5.2 · 5.4',
  title: 'Concepts et politiques de sécurité',
  attend:
    "Définir menaces, vulnérabilités, exploits et mesures d'atténuation ; décrire un programme de sécurité et les politiques de mots de passe, MFA, certificats et biométrie compris.",
  essentiel: [
    "Vulnérabilité : faiblesse d'un système. Exploit : méthode ou code qui l'utilise. Menace : danger qu'un acteur exploite cette faiblesse. Atténuation (mitigation) : mesure qui réduit la probabilité ou l'impact. Objectifs : confidentialité, intégrité, disponibilité (CIA).",
    "Attaques courantes : DoS et DDoS, usurpation (spoofing), réflexion et amplification, man-in-the-middle, reconnaissance, malware (virus, ver, cheval de Troie, rançongiciel), ingénierie sociale (phishing, spear phishing, whaling, vishing, smishing), attaques sur les mots de passe.",
    "Programme de sécurité : sensibilisation de tous les utilisateurs (user awareness), formation adaptée aux rôles (training), contrôle d'accès physique (badges, serrures, vidéosurveillance, locaux techniques fermés).",
    "Politique de mots de passe : longueur minimale, refus des mots de passe connus ou réutilisés, changement en cas de compromission, gestionnaire de mots de passe, verrouillage après échecs répétés.",
    "MFA (authentification multifacteur) : facteurs de catégories différentes. Certificat numérique : clé publique liée à une identité et signée par une autorité de certification (CA). Biométrie : pratique, mais non révocable en cas de fuite.",
  ],
  schema: schema(),
  caption:
    "L'atténuation agit sur la vulnérabilité ou sur l'exploit. Deux éléments de la même catégorie ne forment pas une MFA.",
  commandes: [
    ['R1(config)# security passwords min-length 10', 'Longueur minimale imposée'],
    ['R1(config)# login block-for 120 attempts 3 within 60', 'Blocage 120 s après 3 échecs en 60 s'],
    ['R1(config)# login on-failure log', 'Journalise les échecs'],
    ['R1# show login', 'État du blocage', true],
    ['R1# show login failures', 'Tentatives échouées', true],
  ],
  pieges: [
    'Mot de passe et code PIN : un seul facteur (deux éléments que l\'on sait).',
    'Une vulnérabilité peut exister sans exploit connu ; l\'exploit, lui, suppose une vulnérabilité.',
    'Phishing : envoi massif. Spear phishing : cible précise. Whaling : dirigeant visé.',
  ],
  qcm: [
    {
      q: 'Quelle combinaison constitue une authentification multifacteur ?',
      o: ['Mot de passe + PIN', 'Mot de passe + question secrète', 'Carte à puce + empreinte', 'Deux mots de passe'],
      a: 'C',
      why: 'Carte (possession) et empreinte (biométrie) : deux catégories différentes.',
    },
    {
      q: 'Comment nomme-t-on le code qui tire parti d\'une faiblesse logicielle ?',
      o: ['Exploit', 'Menace', 'Vulnérabilité', 'Atténuation'],
      four: true,
      a: 'A',
      why: 'L\'exploit utilise la vulnérabilité ; la menace en est le danger potentiel.',
    },
    {
      q: 'Quel élément du programme de sécurité rappelle régulièrement les risques à tous les employés ?',
      o: ['Contrôle d\'accès physique', 'Sensibilisation des utilisateurs', 'Pare-feu', 'Chiffrement'],
      a: 'B',
      why: 'User awareness : messages et campagnes destinés à tous ; le training cible des rôles.',
    },
  ],
  mnemo: 'Savoir, avoir, être : une MFA puise dans deux catégories.',
};
