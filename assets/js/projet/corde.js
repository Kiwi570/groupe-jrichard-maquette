/* Corde d'altitude : un mousqueton monte de 0 à 25 m pendant la lecture ; les repères (Sol, Racines, Tronc,
   Houppier, Cime) servent de sommaire. Positions mesurées au chargement et au redimensionnement seulement ;
   pendant le défilement, seules window.scrollY et les valeurs gardées sont lues. */
import { mesures } from '../socle/mesures.js?v=3';
import { quand } from '../socle/index.js?v=3';

const ALTITUDE = 25;

export function initCorde() {
  const corde = document.querySelector('[data-corde]');
  if (!corde) return;
  const liste = corde.querySelector('.corde-reperes');
  const mousqueton = corde.querySelector('.corde-mousqueton');
  const alti = corde.querySelector('.corde-altitude');
  const html = document.documentElement;
  const sections = [...document.querySelectorAll('main [data-strate]')];
  if (!sections.length) return;

  /* Un repère par strate, à la première section qui la porte. */
  const reperes = [];
  sections.forEach((s) => {
    const nom = s.dataset.strate;
    if (reperes.some((r) => r.nom === nom) || !s.id) return;
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = '#' + s.id;
    a.setAttribute('data-sans-transition', '');
    a.innerHTML = `<span>${nom}</span>`;
    a.setAttribute('aria-label', `${nom}`);
    li.appendChild(a);
    liste.appendChild(li);
    reperes.push({ nom, section: s, li, a, y: 0 });
  });

  let hauteur = 0, max = 1, zones = [];
  const mesurer = () => {
    hauteur = corde.clientHeight;
    max = Math.max(1, (mesures.pageH || document.documentElement.scrollHeight) - window.innerHeight);
    reperes.forEach((r) => {
      const top = r.section.getBoundingClientRect().top + window.scrollY;
      r.y = Math.min(1, top / max);
      r.li.style.top = (r.y * hauteur).toFixed(1) + 'px';
    });
    zones = sections.map((s) => {
      const b = s.getBoundingClientRect();
      return { debut: b.top + window.scrollY, fin: b.bottom + window.scrollY, clair: /\bs-(creme|sauge|ciel)\b/.test(s.className) };
    });
    maj();
  };
  let actif = null;
  const maj = () => {
    raf = 0;
    const p = Math.min(1, Math.max(0, window.scrollY / max));
    const y = (p * hauteur).toFixed(1) + 'px';
    mousqueton.style.setProperty('--y', y);
    alti.style.setProperty('--y', y);
    alti.textContent = Math.round(p * ALTITUDE) + ' m';
    /* Couleur de la corde selon la section qui passe derrière elle. */
    const yPage = window.scrollY + mesures.enteteH + 28 + p * hauteur;
    const z = zones.find((x) => yPage >= x.debut && yPage < x.fin);
    html.toggleAttribute('data-corde-clair', !!(z && z.clair));
    let courant = reperes[0];
    reperes.forEach((r) => { if (p + 0.0001 >= r.y) courant = r; });
    if (courant !== actif) {
      if (actif) actif.a.removeAttribute('aria-current');
      courant.a.setAttribute('aria-current', 'location');
      actif = courant;
    }
  };
  let raf = 0;
  window.addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(maj); }, { passive: true });
  new ResizeObserver(() => requestAnimationFrame(mesurer)).observe(document.body);
  window.addEventListener('resize', mesurer);
  quand('pret', mesurer);
  mesurer();
}
