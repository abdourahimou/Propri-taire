// Symboles réseau sobres pour les schémas (unités : mm, trait fin).
const INK = '#1C1F26', INK2 = '#5B6470', PAPER = '#F4F1EA', ACC = '#C8432B', FILL = '#E9E4D8', RULE = '#D6D0C4';
const SW = 0.25; // ~0,7 pt

const n = (v) => +v.toFixed(2);

function svg(w, h, inner, label) {
  return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${label}">
<defs>
  <marker id="ah" viewBox="0 0 6 6" refX="5" refY="3" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0,0.6 L5.4,3 L0,5.4 z" fill="${INK}"/></marker>
  <marker id="aha" viewBox="0 0 6 6" refX="5" refY="3" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0,0.6 L5.4,3 L0,5.4 z" fill="${ACC}"/></marker>
</defs>
${inner}
</svg>`;
}

// Routeur : cercle barré (croix).
function router(x, y, r = 4) {
  const d = r * 0.62;
  return `<g stroke="${INK}" stroke-width="${SW}" fill="${PAPER}">
<circle cx="${x}" cy="${y}" r="${r}"/>
<line x1="${n(x - d)}" y1="${n(y - d)}" x2="${n(x + d)}" y2="${n(y + d)}"/>
<line x1="${n(x - d)}" y1="${n(y + d)}" x2="${n(x + d)}" y2="${n(y - d)}"/></g>`;
}

// Switch : rectangle à flèches opposées.
function sw(x, y, w = 11, h = 5.4) {
  const x0 = x - w / 2, y0 = y - h / 2, m = 2;
  return `<g stroke="${INK}" stroke-width="${SW}">
<rect x="${n(x0)}" y="${n(y0)}" width="${w}" height="${h}" fill="${PAPER}"/>
<line x1="${n(x0 + m)}" y1="${n(y - 1)}" x2="${n(x0 + w - m)}" y2="${n(y - 1)}" marker-end="url(#ah)"/>
<line x1="${n(x0 + w - m)}" y1="${n(y + 1)}" x2="${n(x0 + m)}" y2="${n(y + 1)}" marker-end="url(#ah)"/></g>`;
}

// Poste : écran + socle.
function pc(x, y) {
  return `<g stroke="${INK}" stroke-width="${SW}" fill="${PAPER}">
<rect x="${n(x - 2.4)}" y="${n(y - 1.8)}" width="4.8" height="3.2"/>
<line x1="${n(x - 1.4)}" y1="${n(y + 2.1)}" x2="${n(x + 1.4)}" y2="${n(y + 2.1)}"/>
<line x1="${x}" y1="${n(y + 1.4)}" x2="${x}" y2="${n(y + 2.1)}"/></g>`;
}

// Serveur : rectangle vertical à baies.
function server(x, y) {
  return `<g stroke="${INK}" stroke-width="${SW}" fill="${PAPER}">
<rect x="${n(x - 2)}" y="${n(y - 3)}" width="4" height="6"/>
<line x1="${n(x - 1.2)}" y1="${n(y - 1.4)}" x2="${n(x + 1.2)}" y2="${n(y - 1.4)}"/>
<line x1="${n(x - 1.2)}" y1="${n(y)}" x2="${n(x + 1.2)}" y2="${n(y)}"/></g>`;
}

function line(x1, y1, x2, y2, o = {}) {
  const dash = o.dash ? ` stroke-dasharray="${o.dash}"` : '';
  const mk = o.end ? ` marker-end="url(#${o.end})"` : '';
  const mks = o.start ? ` marker-start="url(#${o.start})"` : '';
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${o.color || INK}" stroke-width="${o.w || SW}"${dash}${mk}${mks}/>`;
}

function rect(x, y, w, h, o = {}) {
  const dash = o.dash ? ` stroke-dasharray="${o.dash}"` : '';
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${o.fill || 'none'}" stroke="${o.stroke || INK}" stroke-width="${o.w || SW}"${dash}/>`;
}

// Texte : size en mm (2,6 mm ≈ 7,4 pt).
function text(x, y, s, o = {}) {
  const cls = [o.mono ? 'm' : '', o.c2 ? 't2' : '', o.acc ? 'acc' : ''].filter(Boolean).join(' ');
  return `<text x="${x}" y="${y}" font-size="${o.size || 2.6}"${o.anchor ? ` text-anchor="${o.anchor}"` : ''}${o.bold ? ' font-weight="600"' : ''}${cls ? ` class="${cls}"` : ''}>${s}</text>`;
}

module.exports = { svg, router, sw, pc, server, line, rect, text, INK, INK2, PAPER, ACC, FILL, RULE, SW };
