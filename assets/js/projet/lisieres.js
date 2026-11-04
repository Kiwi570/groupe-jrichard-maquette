/* Lisières : le passage d'une section à l'autre se fait par une bordure vivante, de la couleur de la section qui arrive.
   Sections vertes : une ligne d'herbe dont les brins se couchent selon la vitesse de défilement ;
   sections sombres : une ligne de terre ; sections claires : une colline douce qui ondule au fil du défilement.
   Dessinées une fois au chargement, redessinées seulement pendant le défilement (et figées en mode calme). */
import { etat } from '../socle/index.js?v=3';

const VERTS = ['s-mousse', 's-sauge'];
const SOMBRES = ['s-terre', 's-humus'];

function sorte(el) {
  if (VERTS.some((c) => el.classList.contains(c)) || el.classList.contains('pied')) return 'herbe';
  if (SOMBRES.some((c) => el.classList.contains(c))) return 'terre';
  return 'colline';
}

function fondDe(el) {
  if (!el) return null;
  const s = getComputedStyle(el);
  if (s.backgroundImage !== 'none') return 'image';
  return s.backgroundColor;
}

/* Petit hasard déterministe : la même lisière à chaque chargement. */
function graines(n, germe) {
  let a = germe;
  return Array.from({ length: n }, () => ((a = (a * 9301 + 49297) % 233280) / 233280));
}

export function initLisieres() {
  const sections = [...document.querySelectorAll('main > section, footer.pied')];
  const liste = [];
  sections.forEach((el, i) => {
    /* La lisière est posée en bas de la section précédente (dans ses marges), de la couleur de celle qui arrive. */
    if (el.matches('.tete, .cime, [data-strates-scene], [data-galerie-section]')) return;
    /* Le pied de page suit le dernier bloc de main : seulement si c'est une section. */
    let avant = el.matches('.pied') ? (document.querySelector('main') || {}).lastElementChild : el.previousElementSibling;
    if (!avant || !avant.matches('section') || avant.matches('.pin-spacer, [data-strates-scene], [data-galerie-section], [data-ouverture]')) return;
    const fond = fondDe(el), fondAvant = fondDe(avant);
    if (!fond || fond === 'image' || /rgba\(0, 0, 0, 0\)|transparent/.test(fond) || fond === fondAvant) return;
    if (getComputedStyle(avant).position === 'static') avant.style.position = 'relative';
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', `lisiere lisiere--${sorte(el)}${avant.matches('.tete') ? ' lisiere--tete' : ''}`);
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    svg.setAttribute('data-audit-ignorer', '');
    svg.setAttribute('preserveAspectRatio', 'none');
    const chemin = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    chemin.setAttribute('fill', fond);
    svg.appendChild(chemin);
    avant.appendChild(svg);
    /* La mention « Illustration générée » d'un fond de section remonte au-dessus de la lisière. */
    avant.classList.add('avec-lisiere');
    avant.style.setProperty('--lisiere-h', sorte(el) === 'herbe' ? 'clamp(26px, 4.2vw, 56px)' : 'clamp(22px, 3.4vw, 46px)');
    liste.push({ el, svg, chemin, sorte: sorte(el), germe: 7 + i * 13, w: 0, h: 0, hasard: null });
  });
  if (!liste.length) return;

  const mesurer = () => liste.forEach((l) => {
    const b = l.svg.getBoundingClientRect();
    l.w = Math.max(1, Math.round(b.width)); l.h = Math.max(1, Math.round(b.height));
    l.svg.setAttribute('viewBox', `0 0 ${l.w} ${l.h}`);
    l.hasard = graines(Math.ceil(l.w / 6) + 8, l.germe);
  });

  const dessiner = (l, couche, phase) => {
    const { w, h, hasard } = l;
    let d = '';
    if (l.sorte === 'herbe') {
      /* Brins tous les 7 px environ, de hauteurs variées ; la pointe se couche selon le vent (couche). */
      d = `M0 ${h}`;
      for (let x = -4, k = 0; x < w + 8; k++) {
        const r = hasard[k % hasard.length], r2 = hasard[(k * 7 + 3) % hasard.length], r3 = hasard[(k * 13 + 5) % hasard.length];
        /* Touffes : trois ou quatre brins serrés, puis un vide ; hauteurs très variées, quelques grands brins. */
        const haut = h * (r3 > 0.86 ? 0.85 + r * 0.15 : 0.22 + r * r * 0.62), pied = h - 1;
        const demi = 1.6 + r2 * 1.6;
        const penche = (r2 - 0.5) * 16 + couche * (0.4 + r) * haut * 0.5;
        d += `L${(x - demi).toFixed(1)} ${pied}Q${(x + penche * 0.3).toFixed(1)} ${(pied - haut * 0.6).toFixed(1)} ${(x + penche).toFixed(1)} ${(pied - haut).toFixed(1)}Q${(x + penche * 0.25 + demi * 0.6).toFixed(1)} ${(pied - haut * 0.5).toFixed(1)} ${(x + demi).toFixed(1)} ${pied}`;
        x += k % 4 === 3 ? 10 + r * 16 : 3 + r2 * 4;
      }
      d += `L${w} ${h}Z`;
    } else {
      const amp = l.sorte === 'terre' ? h * 0.16 : h * 0.26;
      const base = l.sorte === 'terre' ? h * 0.55 : h * 0.5;
      d = `M0 ${h}`;
      const pas = l.sorte === 'terre' ? 14 : 24;
      for (let x = 0, k = 0; x <= w + pas; x += pas, k++) {
        const bosse = l.sorte === 'terre' ? (hasard[k % hasard.length] - 0.5) * h * 0.22 : 0;
        const y = base + Math.sin(x * 0.0042 + phase) * amp + Math.sin(x * 0.011 - phase * 1.6) * amp * 0.45 + bosse;
        d += `L${x} ${y.toFixed(1)}`;
      }
      d += `L${w} ${h}Z`;
    }
    l.chemin.setAttribute('d', d);
  };

  mesurer();
  liste.forEach((l) => dessiner(l, 0, l.germe));
  new ResizeObserver(() => { mesurer(); liste.forEach((l) => dessiner(l, 0, l.germe + scrollY * 0.002)); }).observe(document.documentElement);
  if (etat.calme) return;

  /* Pendant le défilement : vitesse lissée ; l'herbe se couche en penchant la bande entière (transformation seule,
     sans redessiner), arrêt dès le calme revenu. Les collines et la terre restent fixes. */
  const herbes = liste.filter((l) => l.sorte === 'herbe');
  if (!herbes.length) return;
  const visibles = new Set();
  const io = new IntersectionObserver((es) => es.forEach((e) => (e.isIntersecting ? visibles.add(e.target) : visibles.delete(e.target))), { rootMargin: '80px' });
  herbes.forEach((l) => io.observe(l.svg));
  let raf = 0, y0 = scrollY, t0 = performance.now(), vitesse = 0, couche = 0, repos = 0;
  const image = (t) => {
    raf = 0;
    const dt = Math.min(0.05, (t - t0) / 1000) || 0.016;
    const v = (scrollY - y0) / dt;
    y0 = scrollY; t0 = t;
    vitesse += (Math.max(-4000, Math.min(4000, v)) - vitesse) * Math.min(1, dt * 6);
    const cible = Math.max(-1, Math.min(1, vitesse / 2200));
    couche += (cible - couche) * Math.min(1, dt * 5);
    visibles.forEach((svg) => { svg.style.transform = Math.abs(couche) < 0.004 ? '' : `skewX(${(-couche * 16).toFixed(2)}deg)`; });
    repos = Math.abs(couche) < 0.004 && Math.abs(v) < 5 ? repos + dt : 0;
    if (repos < 0.3) raf = requestAnimationFrame(image);
  };
  window.addEventListener('scroll', () => { if (!raf) { t0 = performance.now(); y0 = scrollY; repos = 0; raf = requestAnimationFrame(image); } }, { passive: true });
}
