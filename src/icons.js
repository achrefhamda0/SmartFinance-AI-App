/**
 * Jeu d'icônes (trait 1.5, style lucide) rendu à la demande.
 *
 * Les SVG sont livrés sans attribut width/height : ils occupent 100 % de leur
 * conteneur, ce qui laisse le gabarit maîtriser la taille via une classe
 * utilitaire (`h-6 w-6`, `h-5 w-5`…).
 */

const svg = (paths) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" width="100%" height="100%" aria-hidden="true" focusable="false">${paths}</svg>`;

export const icons = {
  chart: svg('<path d="M3 21h18"/><path d="M6 21v-9"/><path d="M12 21V4"/><path d="M18 21v-6"/>'),
  trendingUp: svg('<path d="M3 17l6-6 4 4 7-7"/><path d="M14 8h6v6"/>'),
  trendingDown: svg('<path d="M3 7l6 6 4-4 7 7"/><path d="M14 16h6v-6"/>'),
  sparkles: svg(
    '<path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6z"/><path d="M18.5 15.5l.7 1.9 1.9.7-1.9.7-.7 1.9-.7-1.9-1.9-.7 1.9-.7z"/>'
  ),
  cpu: svg(
    '<rect x="7" y="7" width="10" height="10" rx="2"/><path d="M10 3v4M14 3v4M10 17v4M14 17v4M3 10h4M3 14h4M17 10h4M17 14h4"/>'
  ),
  file: svg('<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M9 13h6M9 17h4"/>'),
  calculator: svg(
    '<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M8 6h8"/><path d="M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15h.01M8 19h4"/>'
  ),
  shield: svg('<path d="M12 3l7.5 3v6c0 4.6-3.2 7.9-7.5 9.2C7.7 19.9 4.5 16.6 4.5 12V6z"/><path d="M9 12l2.2 2.2L15.5 10"/>'),
  alert: svg('<path d="M12 3.5 22 20H2z"/><path d="M12 10v4"/><path d="M12 17.5h.01"/>'),
  users: svg(
    '<circle cx="9" cy="8" r="3.4"/><path d="M2.6 20c.8-3.5 3.4-5.2 6.4-5.2s5.6 1.7 6.4 5.2"/><path d="M16.2 5.6a3.4 3.4 0 0 1 0 6.6"/><path d="M18 20c-.3-1.9-1-3.3-2-4.4 3 .2 5 1.7 5.6 4.4"/>'
  ),
  building: svg('<path d="M4 21V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v16"/><path d="M14 9.5h4a2 2 0 0 1 2 2V21"/><path d="M8 7h2.5M8 11h2.5M8 15h2.5"/><path d="M2.5 21h19"/>'),
  upload: svg('<path d="M12 16V4"/><path d="M7.5 8.5 12 4l4.5 4.5"/><path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3"/>'),
  link: svg('<path d="M9.5 14.5 14.5 9.5"/><path d="M10.5 6.5 12 5a4 4 0 0 1 5.7 5.7l-1.6 1.6"/><path d="M13.5 17.5 12 19a4 4 0 0 1-5.7-5.7l1.6-1.6"/>'),
  lock: svg('<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/><path d="M12 14.5v2.5"/>'),
  eye: svg('<path d="M2 12s3.9-6.5 10-6.5S22 12 22 12s-3.9 6.5-10 6.5S2 12 2 12z"/><circle cx="12" cy="12" r="2.8"/>'),
  eyeOff: svg(
    '<path d="M3 3l18 18"/><path d="M10.6 6.2A9.9 9.9 0 0 1 12 5.5c6.1 0 10 6.5 10 6.5a17.6 17.6 0 0 1-3.3 4"/><path d="M6.3 7.9A17.4 17.4 0 0 0 2 12s3.9 6.5 10 6.5c1.5 0 2.9-.4 4.1-1"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/>'
  ),
  check: svg('<path d="M4 12.5 9 17.5 20 6.5"/>'),
  checkCircle: svg('<circle cx="12" cy="12" r="9"/><path d="M8.5 12.2l2.4 2.4 4.6-4.8"/>'),
  arrowRight: svg('<path d="M4 12h15"/><path d="M13.5 6.5 20 12l-6.5 5.5"/>'),
  chevronDown: svg('<path d="M6 9.5 12 15.5 18 9.5"/>'),
  menu: svg('<path d="M3 6.5h18M3 12h18M3 17.5h18"/>'),
  close: svg('<path d="M6 6l12 12M18 6 6 18"/>'),
  mail: svg('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3.8 7 12 13 20.2 7"/>'),
  key: svg('<circle cx="8" cy="12" r="4"/><path d="M12 12h8.5M17.5 12v3M20.5 12v2"/>'),
  zap: svg('<path d="M13 2 4.5 13.5H11l-1 8.5 9-12h-6.5z"/>'),
  globe: svg(
    '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3c2.4 2.6 3.7 5.7 3.7 9S14.4 18.4 12 21c-2.4-2.6-3.7-5.7-3.7-9S9.6 5.6 12 3z"/>'
  ),
  database: svg(
    '<ellipse cx="12" cy="6" rx="8" ry="3"/><path d="M4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6"/><path d="M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/>'
  ),
  target: svg('<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1"/>'),
  scale: svg('<path d="M12 4v16"/><path d="M6 20.5h12"/><path d="M4 8h16"/><path d="M4 8l-2 5.2A3 3 0 0 0 6 13.2z"/><path d="M20 8l2 5.2a3 3 0 0 1-4 0z"/>'),
  clock: svg('<circle cx="12" cy="12" r="9"/><path d="M12 7v5.3l3.4 2"/>'),
  refresh: svg('<path d="M20 11a8 8 0 0 0-13.6-5.2L4 8"/><path d="M4 4.5V8.5h4"/><path d="M4 13a8 8 0 0 0 13.6 5.2L20 16"/><path d="M20 19.5V15.5h-4"/>'),
  folder: svg('<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>'),
  headphones: svg('<path d="M4 13a8 8 0 0 1 16 0"/><rect x="2.5" y="13" width="4" height="7" rx="1.5"/><rect x="17.5" y="13" width="4" height="7" rx="1.5"/>'),
  layers: svg('<path d="M12 3 3 8l9 5 9-5z"/><path d="M3 13l9 5 9-5"/>'),
  percent: svg('<path d="M19 5 5 19"/><circle cx="7.5" cy="7.5" r="2.5"/><circle cx="16.5" cy="16.5" r="2.5"/>'),
  banknote: svg('<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.6"/><path d="M6 12h.01M18 12h.01"/>'),
  pieChart: svg('<path d="M12 3a9 9 0 1 0 9 9h-9z"/><path d="M15 3.6A9 9 0 0 1 20.4 9H15z"/>'),
  messageSquare: svg('<path d="M20 15a2 2 0 0 1-2 2H8l-4 4V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2z"/><path d="M8 9h8M8 13h5"/>'),
  playCircle: svg('<circle cx="12" cy="12" r="9"/><path d="M10.5 9.2 15 12l-4.5 2.8z"/>'),
  logOut: svg('<path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3"/><path d="M10 16l-4-4 4-4"/><path d="M6 12h9"/>')
};

/** Nom d'icône utilisé par un gabarit absent du jeu : évite un rendu cassé. */
export const icon = (name) => icons[name] ?? icons.check;