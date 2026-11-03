/* Prestations en liste vivante (grand écran) : la prestation au centre de l'écran, ou survolée, ou atteinte au clavier,
   devient active ; sa photo pousse en dôme dans le cadre épinglé à droite.
   Filtres animés partout : quand un filtre change, les cartes glissent vers leur nouvelle place (technique FLIP). */
import { etat } from '../socle/index.js?v=2';

function listeVivante(g, ST) {
  document.querySelectorAll('[data-presta-liste]').forEach((liste) => {
    const cadre = liste.querySelector('[data-presta-cadre]');
    const cartes = [...liste.querySelectorAll(':scope > .carte-presta')];
    if (!cadre || !cartes.length) return;
    /* Le cadre reçoit une copie de chaque photo (ou du dessin), dans l'ordre des cartes. */
    const vues = cartes.map((c) => {
      const source = c.querySelector(':scope > .media, :scope > .carte-dessin');
      const v = document.createElement('div');
      v.className = 'presta-vue';
      if (source) {
        const copie = source.cloneNode(true);
        copie.querySelectorAll('img').forEach((i) => { i.alt = ''; i.loading = 'eager'; i.removeAttribute('style'); });
        /* Seules les variables de cadrage sont reprises (pas les styles posés par les animations). */
        const vars = (source.getAttribute('style') || '').split(';').filter((d) => d.trim().startsWith('--')).join(';');
        copie.setAttribute('style', vars);
        v.appendChild(copie);
      }
      cadre.appendChild(v);
      return v;
    });
    let active = -1;
    const activer = (i, anime = true) => {
      if (i === active || i < 0) return;
      const avant = active;
      active = i;
      cartes.forEach((c, k) => c.classList.toggle('active', k === i));
      vues.forEach((v, k) => { v.style.zIndex = k === i ? 2 : k === avant ? 1 : 0; v.style.visibility = k === i || k === avant ? 'visible' : 'hidden'; });
      const v = vues[i], img = v.querySelector('img');
      if (!anime || !g) { v.style.clipPath = ''; return; }
      g.killTweensOf([v, img]);
      g.fromTo(v, { clipPath: 'inset(100% 0% 0% 0% round 50% 50% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0% round 0% 0% 0% 0%)', duration: 0.85, ease: 'expo.out', onComplete: () => { v.style.clipPath = ''; vues.forEach((x, k) => { if (k !== active) x.style.visibility = 'hidden'; }); } });
      if (img) g.fromTo(img, { scale: 1.18 }, { scale: 1, duration: 1.1, ease: 'expo.out' });
    };
    const premiere = () => cartes.findIndex((c) => !c.hidden);
    activer(premiere(), false);
    cartes.forEach((c, i) => {
      c.addEventListener('pointerenter', () => activer(i));
      c.addEventListener('focusin', () => activer(i));
      if (ST) ST.create({ trigger: c, start: 'top 55%', end: 'bottom 55%', onToggle: (s) => { if (s.isActive && !c.hidden) activer(i); } });
    });
    /* Une carte cachée par le filtre ne reste pas active. */
    new MutationObserver(() => { if (active >= 0 && cartes[active].hidden) { const p = premiere(); active = -1; activer(p); } })
      .observe(liste, { subtree: false, childList: false, attributes: true, attributeFilter: ['hidden'], attributeOldValue: false });
    cartes.forEach((c) => new MutationObserver(() => { if (cartes[active] === c && c.hidden) { const p = premiere(); active = -1; activer(p); } }).observe(c, { attributes: true, attributeFilter: ['hidden'] }));
  });
}

/* FLIP : positions avant le changement de filtre, puis glissement depuis l'ancienne place. */
function filtresAnimes(g) {
  const ZONES = '[data-filtre-profil] > [data-profils], ul.fil > li, [data-filtre-liste] > *';
  let photo = null;
  const prendre = (e) => {
    if (!e.target.closest || !e.target.closest('[data-profils-choix], [data-filtres], .filtres, [data-filtre]')) return;
    photo = new Map();
    document.querySelectorAll(ZONES).forEach((el) => { if (!el.hidden && el.offsetParent) photo.set(el, el.getBoundingClientRect()); });
    requestAnimationFrame(() => requestAnimationFrame(jouer));
  };
  const jouer = () => {
    if (!photo) return;
    const avant = photo; photo = null;
    document.querySelectorAll(ZONES).forEach((el) => {
      if (el.hidden || !el.offsetParent) return;
      const b = el.getBoundingClientRect();
      const a = avant.get(el);
      if (b.bottom < -200 || b.top > innerHeight + 200) return;
      if (a) {
        const dx = a.left - b.left, dy = a.top - b.top;
        if (Math.abs(dx) < 1 && Math.abs(dy) < 1) return;
        g.fromTo(el, { x: dx, y: dy }, { x: 0, y: 0, duration: 0.7, ease: 'expo.out', clearProps: 'transform' });
      } else {
        g.fromTo(el, { opacity: 0, scale: 0.92, y: 24 }, { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: 'expo.out', delay: 0.05, clearProps: 'transform,opacity' });
      }
    });
  };
  document.addEventListener('click', prendre, true);
  document.addEventListener('change', prendre, true);
}

export function initPrestations() {
  const g = window.gsap, ST = window.ScrollTrigger;
  if (etat.calme || !g) return;
  const large = window.matchMedia('(min-width: 1100px)');
  if (large.matches) listeVivante(g, ST);
  filtresAnimes(g);
}
