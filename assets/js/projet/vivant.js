/* Effets de détail de la v2 :
   - le curseur affiche « Voir » sur les cartes de réalisations et d'actualités ;
   - au survol, la photo d'une carte ondule un instant comme un feuillage dans le vent (filtre SVG, une carte à la fois) ;
   - des racines relient les chiffres en se dessinant à la lecture ;
   - sur la carte du Loiret : les trois sites tombent avec un rebond, puis le courant de la Loire coule quelques secondes.
   Rien en mode calme ; le vent et le curseur seulement avec une souris. */
import { etat, partir } from '../socle/index.js?v=3';

const souris = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches;

function libelleCurseur() {
  const zones = document.querySelectorAll('.galerie-carte, .fil-carte, .une-carte, [data-curseur-texte]');
  if (!zones.length) return;
  zones.forEach((z) => z.addEventListener('pointerenter', () => {
    const c = document.querySelector('.curseur');
    if (!c) return;
    c.dataset.texte = z.dataset.curseurTexte || document.documentElement.dataset.curseurVoir || '';
    c.classList.add('curseur-texte');
  }));
  zones.forEach((z) => z.addEventListener('pointerleave', () => { const c = document.querySelector('.curseur'); if (c) c.classList.remove('curseur-texte'); }));
}

function ventSurPhotos() {
  const cartes = document.querySelectorAll('.galerie-carte, .fil-carte, .carte-presta');
  if (!cartes.length) return;
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('width', '0'); svg.setAttribute('height', '0');
  svg.style.position = 'absolute';
  svg.innerHTML = '<filter id="vent-feuillage" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.012 0.03" numOctaves="2" seed="3" result="bruit"/><feDisplacementMap in="SourceGraphic" in2="bruit" scale="0" xChannelSelector="R" yChannelSelector="G"/></filter>';
  document.body.appendChild(svg);
  const turb = svg.querySelector('feTurbulence'), disp = svg.querySelector('feDisplacementMap');
  let img = null, debut = 0, raf = 0, sortie = 0, dernierDefilement = 0;
  window.addEventListener('scroll', () => { dernierDefilement = performance.now(); }, { passive: true });
  const image = (t) => {
    raf = 0;
    if (!img) return;
    const a = (t - debut) / 1000;
    /* Un coup de vent : monte vite, retombe en 1,4 s ; à la sortie, retour à plat en 0,3 s. */
    let s = a < 0.25 ? (a / 0.25) * 16 : Math.max(0, 16 * (1 - (a - 0.25) / 1.15));
    if (sortie) s = Math.max(0, parseFloat(disp.getAttribute('scale')) - (t - sortie) / 300 * 16);
    disp.setAttribute('scale', s.toFixed(2));
    turb.setAttribute('baseFrequency', `${(0.012 + Math.sin(a * 2.2) * 0.002).toFixed(4)} ${(0.03 + Math.cos(a * 1.7) * 0.004).toFixed(4)}`);
    if (s > 0.05 && a < 1.6) raf = requestAnimationFrame(image);
    else { img.style.filter = ''; img = null; }
  };
  cartes.forEach((c) => {
    const i = c.querySelector('.media img');
    if (!i) return;
    /* Le vent ne se lève que si la souris bouge vraiment sur la carte (pas quand la page défile sous elle). */
    let dejaSouffle = false;
    c.addEventListener('pointerleave', () => { dejaSouffle = false; });
    c.addEventListener('pointermove', (e) => {
      if (dejaSouffle || (!e.movementX && !e.movementY) || performance.now() - dernierDefilement < 250) return;
      dejaSouffle = true;
      if (img && img !== i) img.style.filter = '';
      img = i; sortie = 0; debut = performance.now();
      img.style.filter = 'url(#vent-feuillage)';
      if (!raf) raf = requestAnimationFrame(image);
    });
    c.addEventListener('pointerleave', () => { if (img === i) { sortie = performance.now(); if (!raf) raf = requestAnimationFrame(image); } });
  });
}

function racinesDesChiffres(g) {
  document.querySelectorAll('.chiffres-grille').forEach((grille) => {
    if (grille.querySelector('.chiffres-racines')) return;
    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('class', 'chiffres-racines');
    svg.setAttribute('viewBox', '0 0 1000 56');
    svg.setAttribute('preserveAspectRatio', 'none');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('data-audit-ignorer', '');
    /* Une racine maîtresse court sous la rangée, une radicelle remonte vers chaque chiffre. */
    const chemins = ['M0 44 C 120 34, 220 54, 340 42 S 560 28, 680 44 S 880 54, 1000 38'];
    [60, 310, 560, 810].forEach((x, i) => chemins.push(`M${x + 30 + i * 6} 44 C ${x + 12} 30, ${x + 4} 16, ${x} 2`));
    [70, 300, 520, 760, 930].forEach((x, i) => chemins.push(`M${x} 42 q ${i % 2 ? 14 : -12} 10 ${i % 2 ? 26 : -20} 18`));
    svg.innerHTML = chemins.map((d, i) => `<path d="${d}" pathLength="1" vector-effect="non-scaling-stroke" class="${i === 0 ? 'maitresse' : 'radicelle'}"/>`).join('');
    grille.appendChild(svg);
    if (!g || !window.ScrollTrigger || etat.calme) return;
    g.fromTo(svg.querySelectorAll('path'), { strokeDasharray: '1 1', strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.6, stagger: 0.12, ease: 'power2.out', scrollTrigger: { trigger: grille, start: 'top 80%', once: true } });
  });
}

function carteVivante(g) {
  document.querySelectorAll('[data-carte]').forEach((carte) => {
    const loire = carte.querySelector('[data-loire]');
    const sites = carte.querySelectorAll('.carte-site');
    if (!g || !window.ScrollTrigger || etat.calme) return;
    let courant = null;
    if (loire) {
      courant = loire.cloneNode();
      courant.removeAttribute('data-loire');
      courant.removeAttribute('style');
      courant.setAttribute('class', 'loire-courant');
      loire.after(courant);
    }
    g.set(sites, { y: -46, opacity: 0, transformOrigin: '50% 100%' });
    window.ScrollTrigger.create({ trigger: carte, start: 'top 78%', once: true, onEnter: () => {
      g.to(sites, { y: 0, opacity: 1, duration: 0.9, stagger: 0.16, ease: 'bounce.out', delay: 0.5 });
      /* Le courant : de petits traits clairs descendent le fleuve pendant 4,5 s. */
      if (courant) g.fromTo(courant, { strokeDashoffset: 0, opacity: 0 }, { strokeDashoffset: -0.6, opacity: 1, duration: 4.5, ease: 'none', delay: 1.6, onComplete: () => g.to(courant, { opacity: 0, duration: 0.6 }) });
    } });
  });
}


/* Vers une fiche : la photo de la carte cliquée s'agrandit jusqu'à remplir l'écran, puis le rideau de feuilles passe. */
function zoomVersFiche(g) {
  document.addEventListener('click', (e) => {
    const a = e.target.closest && e.target.closest('a.galerie-carte[href], a.fil-carte[href], a.une-carte[href]');
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || a.target === '_blank') return;
    const img = a.querySelector('.media img');
    if (!img || !img.complete) return;
    e.preventDefault();
    e.stopPropagation();
    const b = img.getBoundingClientRect();
    const voile = document.createElement('div');
    voile.className = 'zoom-fiche';
    voile.setAttribute('aria-hidden', 'true');
    const copie = img.cloneNode();
    copie.removeAttribute('style'); copie.alt = ''; copie.loading = 'eager';
    voile.appendChild(copie);
    document.body.appendChild(voile);
    g.fromTo(voile, { left: b.left, top: b.top, width: b.width, height: b.height, borderRadius: 18 },
      { left: 0, top: 0, width: innerWidth, height: innerHeight, borderRadius: 0, duration: 0.55, ease: 'expo.inOut',
        onComplete: () => partir(new URL(a.href, location.href), a.dataset.libelle || '') });
  }, true);
}

export function initVivant() {
  const g = window.gsap;
  racinesDesChiffres(g);
  if (etat.calme) return;
  carteVivante(g);
  if (g) zoomVersFiche(g);
  if (souris()) { libelleCurseur(); ventSurPhotos(); }
}
