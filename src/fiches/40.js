const S = require('../svg');

// Playbook Ansible annoté + flux Terraform.
function schema() {
  let g = '';
  g += S.text(2, 3, 'ANSIBLE · ntp.yml (YAML)', { size: 2.2, bold: true });
  const L = [
    '- name: Configurer NTP',
    '  hosts: routeurs',
    '  gather_facts: no',
    '  tasks:',
    '    - name: Serveur NTP',
    '      cisco.ios.ios_config:',
    '        lines:',
    '          - ntp server 192.0.2.123',
  ];
  L.forEach((t, i) => (g += S.text(2, 7.4 + i * 3.1, t.replace(/ /g, ' '), { mono: true, size: 2.05 })));
  const note = (line, col, label) => {
    const y = 7.4 + line * 3.1 - 0.7;
    return S.line(2 + col * 1.23, y, 52, y, { color: S.INK2, w: 0.15, dash: '0.4 0.5' }) + S.text(53, y + 0.7, label, { size: 2 });
  };
  g += note(0, 23, 'play');
  g += note(1, 17, 'groupe de l\'inventaire');
  g += note(4, 21, 'tâche');
  g += note(5, 23, 'module');
  g += S.text(2, 34.6, 'nœud de contrôle → SSH → équipements, sans agent', { size: 2.1, c2: true });
  g += S.line(80, 1, 80, 45, { color: S.RULE });
  // Terraform
  g += S.text(84, 3, 'TERRAFORM (HCL)', { size: 2.2, bold: true });
  const steps = [['main.tf', 'état voulu'], ['terraform plan', 'aperçu des écarts'], ['terraform apply', 'via le provider'], ['API cloud / contrôleur', 'ressources créées']];
  steps.forEach(([t, s], i) => {
    const y = 9 + i * 9;
    g += S.box(102, y, 36, 5, t, { size: 2.05, mono: i < 3, bold: i === 2 });
    g += S.text(102, y + 4.6, s, { anchor: 'middle', size: 1.9, c2: true });
    if (i < 3) g += S.line(102, y + 5.4, 102, y + 6.3, { end: 'ah', w: 0.22 });
  });
  g += S.text(84, 44, 'fichier d\'état (state) : réel vs voulu', { size: 1.9, c2: true });
  return S.svg(124, 46, g, 'Ansible et Terraform');
}

module.exports = {
  num: 40,
  domain: '6.0 Automation & Programmability',
  objectives: '6.6',
  title: 'Ansible et Terraform',
  attend: 'Reconnaître les capacités des outils de gestion de configuration Ansible et Terraform.',
  essentiel: [
    "Gestion de configuration : l'état voulu est décrit dans des fichiers texte versionnés (Git), puis appliqué de façon reproductible à de nombreux équipements. Idempotence : réappliquer ne change rien si l'état est déjà atteint.",
    "Ansible (Red Hat) : sans agent (agentless), depuis un nœud de contrôle, par SSH ou par API ; modèle push. Écrit en Python ; playbooks en YAML.",
    "Composants Ansible : inventaire (hôtes et groupes), playbook (suite de plays), play (tâches appliquées à un groupe), tâche (appel d'un module, par exemple <code>cisco.ios.ios_config</code>), variables, modèles Jinja2.",
    "Terraform (HashiCorp) : infrastructure as code déclarative en HCL ; providers (cloud, Meraki, Catalyst Center…). Cycle : <code>init</code>, <code>plan</code>, <code>apply</code>, <code>destroy</code>. Un fichier d'état (state) mémorise ce qui a été créé.",
    "Ansible : surtout procédural (ordre des tâches), orienté configuration des équipements. Terraform : déclaratif, orienté provisionnement de ressources.",
    "Le blueprint v1.1 cite Ansible et Terraform ; Puppet et Chef (agents, modèle pull) n'y figurent plus.",
  ],
  schema: schema(),
  caption:
    "À gauche, un play qui pousse un serveur NTP au groupe routeurs. À droite, le cycle Terraform : décrire, prévisualiser, appliquer.",
  commandes: [
    ['$ ansible-inventory -i hosts.yml --list', 'Affiche l\'inventaire', true],
    ['$ ansible-playbook -i hosts.yml ntp.yml --check', 'Simulation, sans changement', true],
    ['$ ansible-playbook -i hosts.yml ntp.yml', 'Exécute le playbook'],
    ['$ terraform init', 'Télécharge les providers'],
    ['$ terraform plan', 'Aperçu des changements', true],
    ['$ terraform apply', 'Applique l\'état voulu'],
    ['$ terraform destroy', 'Supprime les ressources gérées'],
  ],
  pieges: [
    "Ansible n'installe aucun agent sur les équipements ; Puppet et Chef en exigent un.",
    'Playbook Ansible en YAML ; configuration Terraform en HCL (fichiers .tf).',
    '<code>terraform plan</code> ne modifie rien : seul <code>apply</code> applique.',
  ],
  qcm: [
    {
      q: 'Quelle caractéristique décrit Ansible ?',
      o: ['Agent sur chaque équipement', 'Sans agent, via SSH', 'Langage HCL', 'Modèle pull'],
      a: 'B',
      why: 'Ansible pousse ses tâches par SSH ou API depuis un nœud de contrôle.',
    },
    {
      q: 'Quelle commande Terraform affiche les changements sans les appliquer ?',
      o: ['terraform init', 'terraform apply', 'terraform plan', 'terraform destroy'],
      a: 'C',
      why: 'plan compare l\'état voulu à l\'état réel et liste les écarts.',
    },
    {
      q: 'Dans quel format s\'écrit un playbook Ansible ?',
      o: ['JSON', 'HCL', 'XML', 'YAML'],
      four: true,
      a: 'D',
      why: 'Playbooks et inventaires sont en YAML (ou INI pour l\'inventaire).',
    },
  ],
  mnemo: 'Ansible : YAML et SSH, sans agent. Terraform : HCL, plan puis apply.',
};
