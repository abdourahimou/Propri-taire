const S = require('../svg');

// Maquette filaire de l'onglet Security > Layer 2 d'un WLAN (AireOS).
function schema() {
  let g = '';
  g += S.rect(2, 1.5, 120, 44, { stroke: S.INK2 });
  g += S.text(4, 5.4, 'WLANs > Edit  « CORP »', { size: 2.3, bold: true });
  const tabs = ['General', 'Security', 'QoS', 'Policy-Mapping', 'Advanced'];
  let x = 4;
  tabs.forEach((t) => {
    const w = t.length * 1.35 + 4;
    g += S.rect(x, 7.5, w, 4, { fill: t === 'Security' ? S.FILL : S.PAPER, stroke: S.INK2 });
    g += S.text(x + w / 2, 10.3, t, { anchor: 'middle', size: 2, bold: t === 'Security' });
    x += w + 1;
  });
  g += S.text(4, 16, 'Layer 2  ·  Layer 3  ·  AAA Servers', { size: 2, c2: true });
  const rows = [
    ['Layer 2 Security', 'WPA+WPA2'],
    ['WPA2 Policy', '☑'],
    ['WPA2 Encryption', 'AES ☑    TKIP ☐'],
    ['Auth Key Mgmt', 'PSK ☑    802.1X ☐'],
    ['PSK Format', 'ASCII'],
    ['Clé (8 à 63 car.)', '••••••••••••'],
  ];
  rows.forEach(([k, v], i) => {
    const y = 20.5 + i * 4;
    g += S.text(6, y, k, { size: 2.1 });
    g += S.rect(42, y - 2.6, 44, 3.4, { stroke: S.RULE });
    g += S.text(43.4, y, v, { size: 2.1, mono: v.startsWith('•') });
  });
  g += S.text(90, 20.5, 'General :', { size: 2, bold: true });
  g += S.text(90, 23.4, 'Status Enabled,', { size: 2, c2: true });
  g += S.text(90, 26.2, 'Interface = VLAN', { size: 2, c2: true });
  g += S.text(90, 29, 'de sortie', { size: 2, c2: true });
  g += S.text(90, 33.4, 'QoS :', { size: 2, bold: true });
  g += S.text(90, 36.2, 'Platinum = voix', { size: 2, c2: true });
  g += S.text(90, 39, 'Silver = défaut', { size: 2, c2: true });
  return S.svg(124, 47, g, 'WLAN WPA2-PSK dans la GUI');
}

module.exports = {
  num: 36,
  domain: '5.0 Security Fundamentals',
  objectives: '5.9 · 5.10 · 2.9',
  title: 'Wi-Fi : WPA2, WPA3, GUI WLC',
  attend:
    "Décrire WPA, WPA2 et WPA3, puis interpréter et configurer dans la GUI d'un WLC un WLAN sécurisé en WPA2-PSK.",
  essentiel: [
    "WEP : RC4, clé statique, cassé. WPA : TKIP, solution de transition. WPA2 (802.11i) : AES-CCMP. WPA3 : SAE en mode Personal (résiste aux attaques par dictionnaire hors ligne), PMF (protection des trames de gestion) obligatoire, mode Enterprise 192 bits.",
    "Personal (PSK) : une clé partagée par tous, de 8 à 63 caractères ASCII. Enterprise : 802.1X / EAP avec un serveur RADIUS, identifiants propres à chaque utilisateur.",
    "Création (GUI AireOS) : WLANs, Create New, puis Profile Name, SSID et ID. Onglet General : Status Enabled, Interface (VLAN de sortie des clients), diffusion du SSID.",
    "Onglet Security, Layer 2 : WPA+WPA2, WPA2 Policy, chiffrement AES, Auth Key Management en PSK, format ASCII, saisie de la clé.",
    "Onglet QoS : Platinum (voix), Gold (vidéo), Silver (best effort, par défaut), Bronze (arrière-plan). Onglet Advanced : FlexConnect Local Switching, AAA Override, délais de session, exclusion de clients.",
    "Catalyst 9800 : même logique répartie en profils ; WLAN Profile (SSID, sécurité), Policy Profile (VLAN, QoS), reliés par un Policy Tag appliqué aux AP.",
  ],
  schema: schema(),
  caption:
    "Réglages d'un WLAN WPA2-PSK : sécurité dans Security > Layer 2, VLAN de sortie dans General, priorité dans QoS.",
  commandes: [
    ['WLC(config)# wlan CORP 1 CORP', 'WLAN : profil, ID, SSID (C9800)'],
    ['WLC(config-wlan)# no security wpa akm dot1x', 'Retire 802.1X'],
    ['WLC(config-wlan)# security wpa akm psk', 'Authentification par PSK'],
    ['WLC(config-wlan)# security wpa psk set-key ascii 0 Cle-WPA2-Lab', 'Clé partagée'],
    ['WLC(config-wlan)# no shutdown', 'Active le WLAN'],
    ['WLC# show wlan summary', 'WLAN, SSID, état', true],
    ['WLC# show wireless client summary', 'Clients associés', true],
  ],
  pieges: [
    'TKIP au lieu d\'AES : chiffrement obsolète, et le 802.11n limite alors le débit à 54 Mbit/s.',
    'Une PSK de moins de 8 caractères est refusée.',
    'Le VLAN des clients se choisit dans l\'onglet General (Interface), pas dans Security.',
  ],
  qcm: [
    {
      q: 'Quel chiffrement WPA2 impose-t-il ?',
      o: ['TKIP', 'RC4', 'AES-CCMP', 'DES'],
      four: true,
      a: 'C',
      why: 'WPA2 = 802.11i avec AES-CCMP ; TKIP relève de WPA.',
    },
    {
      q: 'Quel mécanisme WPA3-Personal utilise-t-il à la place de l\'échange PSK de WPA2 ?',
      o: ['SAE', 'EAP-TLS', 'TKIP', 'LEAP'],
      four: true,
      a: 'A',
      why: 'SAE résiste aux attaques par dictionnaire hors ligne.',
    },
    {
      q: 'Quel profil QoS du WLC convient à un WLAN de voix ?',
      o: ['Silver', 'Bronze', 'Gold', 'Platinum'],
      four: true,
      a: 'D',
      why: 'Platinum : voix ; Gold : vidéo ; Silver : défaut ; Bronze : arrière-plan.',
    },
  ],
  mnemo: 'Platinum voix, Gold vidéo, Silver défaut, Bronze arrière-plan.',
};
