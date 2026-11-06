const S = require('../svg');

// Requête RESTCONF et réponse JSON annotée.
function schema() {
  let g = '';
  const sz = 2.05, lh = 3.05;
  g += S.text(2, 3, 'GET /restconf/data/ietf-interfaces:interfaces/interface=GigabitEthernet1', { mono: true, size: sz, bold: true });
  g += S.text(2, 6.2, 'Accept: application/yang-data+json        →  200 OK', { mono: true, size: sz, c2: true });
  g += S.line(2, 8, 122, 8, { color: S.RULE });
  const L = [
    '{',
    '  "ietf-interfaces:interface": {',
    '    "name": "GigabitEthernet1",',
    '    "description": "LAN",',
    '    "enabled": true,',
    '    "ietf-ip:ipv4": {',
    '      "address": [',
    '        { "ip": "192.0.2.10", "netmask": "255.255.255.0" }',
    '      ]',
    '    }',
    '  }',
    '}',
  ];
  L.forEach((t, i) => (g += S.text(2, 11.6 + i * lh, t.replace(/ /g, ' '), { mono: true, size: sz })));
  const note = (line, col, label) => {
    const y = 11.6 + line * lh - 0.7;
    const x = 2 + col * sz * 0.6;
    return S.line(x, y, 96, y, { color: S.INK2, w: 0.15, dash: '0.4 0.5' }) + S.text(97, y + 0.7, label, { size: 2.05 });
  };
  g += note(1, 31, 'objet { }');
  g += note(2, 31, 'clé : chaîne');
  g += note(4, 21, 'valeur booléenne');
  g += note(6, 18, 'tableau [ ]');
  return S.svg(124, 48, g, 'Requête REST et réponse JSON');
}

module.exports = {
  num: 39,
  domain: '6.0 Automation & Programmability',
  objectives: '6.5 · 6.7',
  title: 'API REST et JSON',
  attend:
    "Décrire les API REST (authentification, CRUD, verbes HTTP, encodage des données) et reconnaître les composants d'un document JSON.",
  essentiel: [
    "REST : architecture client-serveur sans état (stateless : chaque requête porte tout le nécessaire), sur HTTP ou HTTPS ; ressources identifiées par des URI ; réponses éventuellement mises en cache.",
    "CRUD et verbes HTTP : Create = POST, Read = GET, Update = PUT (remplacement) ou PATCH (modification partielle), Delete = DELETE.",
    "Codes de retour : 2xx succès (200 OK, 201 Created, 204 No Content), 3xx redirection, 4xx erreur du client (400, 401 Unauthorized, 403 Forbidden, 404 Not Found), 5xx erreur du serveur.",
    "Authentification : Basic (identifiant et mot de passe encodés en Base64, à réserver à HTTPS), clé d'API, jeton (bearer token), OAuth.",
    "Encodage : JSON, XML ou YAML. En-tête <code>Content-Type</code> : format envoyé ; <code>Accept</code> : format attendu en réponse.",
    "JSON : objet <code>{ }</code> de paires <code>\"clé\": valeur</code> séparées par des virgules ; tableau <code>[ ]</code> ; valeurs : chaîne entre guillemets doubles, nombre, <code>true</code> / <code>false</code>, <code>null</code>, objet, tableau. Pas de virgule finale, pas de commentaire.",
  ],
  schema: schema(),
  caption:
    "Lecture (GET) d'une interface par RESTCONF ; le routeur répond 200 OK avec un document JSON conforme au modèle YANG ietf-interfaces.",
  commandes: [
    ['$ curl -X GET https://192.0.2.10/restconf/data/ietf-interfaces:interfaces', 'Read : lit les interfaces'],
    ['$ curl -X POST … -d @vlan.json', 'Create : crée une ressource'],
    ['$ curl -X PUT … -d @intf.json', 'Update : remplace la ressource'],
    ['$ curl -X PATCH … -d @desc.json', 'Update partiel'],
    ['$ curl -X DELETE …', 'Delete : supprime'],
    ['$ curl -u admin:Lab-Pass …', 'Authentification Basic'],
    ['$ curl -H "Accept: application/yang-data+json" …', 'Format de réponse attendu'],
    ['$ python3 -m json.tool reponse.json', 'Valide et indente un JSON', true],
  ],
  pieges: [
    'PUT remplace toute la ressource ; PATCH ne modifie que les champs fournis.',
    '401 : authentification absente ou invalide. 403 : identité reconnue, accès refusé.',
    'JSON : guillemets doubles obligatoires, aucune virgule après le dernier élément, true et false en minuscules.',
  ],
  qcm: [
    {
      q: 'Quel verbe HTTP correspond à l\'opération Create du modèle CRUD ?',
      o: ['GET', 'POST', 'PATCH', 'DELETE'],
      four: true,
      a: 'B',
      why: 'Create = POST ; Read = GET ; Update = PUT ou PATCH ; Delete = DELETE.',
    },
    {
      q: 'Quel code renvoie l\'API quand la ressource demandée n\'existe pas ?',
      o: ['200', '401', '404', '500'],
      four: true,
      a: 'C',
      why: '404 Not Found : erreur côté client sur l\'URI demandée.',
    },
    {
      q: 'Quel document JSON est valide ?',
      o: ['<code>{\'vlan\': 10}</code>', '<code>{"vlan": 10, "nom": "VOIX",}</code>', '<code>{"vlan": 10, "actif": true}</code>', '<code>{vlan: 10}</code>'],
      a: 'C',
      why: 'A : guillemets simples ; B : virgule finale ; D : clé sans guillemets.',
    },
  ],
  mnemo: 'CRUD = POST, GET, PUT ou PATCH, DELETE.',
};
