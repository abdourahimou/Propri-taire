const S = require('../svg');

// Canaux 2,4 GHz : largeur 22 MHz, centres espacés de 5 MHz.
function schema() {
  let g = '';
  const X = (f) => +(4 + (f - 2400) * 1.38).toFixed(2);
  const base = 34;
  g += S.line(X(2400), base, X(2486), base);
  for (const f of [2400, 2420, 2440, 2460, 2480]) {
    g += S.line(X(f), base, X(f), base + 1);
    g += S.text(X(f), base + 3.6, String(f), { anchor: 'middle', mono: true, size: 2 });
  }
  g += S.text(X(2486), base + 3.6, 'MHz', { anchor: 'end', size: 2, c2: true });
  g += S.text(X(2486), base + 7.4, 'canal', { anchor: 'end', size: 2, c2: true });
  const key = [1, 6, 11];
  for (let n = 1; n <= 13; n++) {
    const c = 2407 + 5 * n;
    const k = key.includes(n);
    const h = k ? 24 : 18;
    g += `<path d="M${X(c - 11)},${base} Q${X(c)},${base - 2 * h} ${X(c + 11)},${base}" fill="none" stroke="${k ? S.INK : S.RULE}" stroke-width="${k ? 0.35 : 0.25}"/>`;
    g += S.text(X(c), base + 7.4, String(n), { anchor: 'middle', size: k ? 2.5 : 2.1, bold: k, c2: !k, acc: false });
  }
  g += S.text(X(2412) - 2, 3.6, 'Canaux non chevauchants : 1, 6 et 11', { size: 2.4, bold: true });
  g += S.text(4, 46.4, 'Canal n : centre = 2407 + 5n MHz ; largeur ≈ 22 MHz. En 5 GHz, les canaux de 20 MHz (36, 40, 44…) ne se chevauchent pas.', { size: 2.1, c2: true });
  return S.svg(124, 48, g, 'Canaux Wi-Fi 2,4 GHz');
}

module.exports = {
  num: 7,
  domain: '1.0 Network Fundamentals',
  objectives: '1.11',
  title: 'Principes radio du Wi-Fi',
  attend:
    'Décrire les principes du Wi-Fi : canaux non chevauchants, SSID, radiofréquences et chiffrement.',
  essentiel: [
    "Bandes : 2,4 GHz (meilleure portée, plus d'interférences, 3 canaux utiles) et 5 GHz (davantage de canaux, portée plus courte) ; le Wi-Fi 6E ajoute 6 GHz. Normes : 802.11b/g (2,4), a (5), n (Wi-Fi 4), ac (Wi-Fi 5, 5 GHz), ax (Wi-Fi 6 / 6E).",
    "2,4 GHz : centres espacés de 5 MHz pour des canaux d'environ 22 MHz ; seuls 1, 6 et 11 sont disjoints. 5 GHz : canaux de 20 MHz disjoints, agrégeables en 40, 80 ou 160 MHz.",
    "Le Wi-Fi est un média partagé et half-duplex : accès par CSMA/CA (évitement de collision), un seul émetteur par canal à la fois.",
    "SSID : nom du réseau (32 caractères maximum), annoncé dans les beacons. BSS : un AP et ses clients, identifié par le BSSID (MAC de la radio de l'AP). ESS : plusieurs BSS sous le même SSID, avec itinérance (roaming). IBSS : mode ad hoc, sans AP.",
    "Propagation RF : absorption (murs, eau), réflexion (métal), réfraction, diffraction, diffusion. Niveau reçu (RSSI) en dBm ; −67 dBm est une cible courante pour la voix. SNR = signal − bruit.",
    "Chiffrement : WEP (RC4, cassé, à proscrire), WPA (TKIP), WPA2 (AES-CCMP), WPA3 (SAE et AES). Détail en fiche 36.",
  ],
  schema: schema(),
  caption:
    "Un canal 2,4 GHz déborde sur ses quatre voisins de chaque côté. Les canaux 1, 6 et 11 sont espacés de 25 MHz, donc disjoints.",
  commandes: [
    ['WLC# show ap summary', 'AP joints au contrôleur (C9800)', true],
    ['WLC# show wireless client summary', 'Clients associés (C9800)', true],
    ['C:\\> netsh wlan show interfaces', 'SSID, BSSID, canal, signal', true],
    ['C:\\> netsh wlan show networks mode=bssid', 'SSID et canaux visibles', true],
    ['$ iw dev wlan0 link', 'SSID, fréquence, signal en dBm', true],
  ],
  pieges: [
    "Deux AP voisins sur les canaux 1 et 3 se perturbent : seuls 1, 6 et 11 sont disjoints en 2,4 GHz.",
    "Le BSSID est l'adresse MAC de la radio de l'AP ; le SSID est le nom du réseau.",
    "Le Wi-Fi est half-duplex et utilise CSMA/CA, pas CSMA/CD.",
  ],
  qcm: [
    {
      q: 'Trois AP couvrent un même étage en 2,4 GHz. Quel plan de canaux retenir ?',
      o: ['1, 2, 3', '1, 6, 11', '2, 4, 6', '3, 6, 9'],
      four: true,
      a: 'B',
      why: '1, 6 et 11 sont les seuls canaux 2,4 GHz sans chevauchement.',
    },
    {
      q: 'Quel identifiant correspond à l\'adresse MAC de la radio d\'un AP ?',
      o: ['SSID', 'ESS', 'BSSID', 'VLAN ID'],
      four: true,
      a: 'C',
      why: 'Le BSSID identifie un BSS par la MAC radio de l\'AP.',
    },
    {
      q: 'Quelle méthode d\'accès au média le Wi-Fi utilise-t-il ?',
      o: ['CSMA/CD', 'Jeton', 'TDMA', 'CSMA/CA'],
      four: true,
      a: 'D',
      why: 'Une radio ne détecte pas les collisions : elle les évite (CSMA/CA).',
    },
  ],
  mnemo: '1, 6, 11 : cinq canaux d\'écart, soit 25 MHz, plus que les 22 MHz d\'un canal.',
};
