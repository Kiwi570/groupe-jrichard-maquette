/* Détails vivants : titres découpés ligne à ligne, photos révélées de bas en haut (comme une pousse) avec un léger
   parallaxe, tiges des chiffres, tige de la méthode, cartes qui s'inclinent, boutons aimantés, questions animées.
   Tout passe par ScrollTrigger (positions mesurées au chargement), rien en mode calme. */
import { etat } from '../socle/index.js?v=1';

const souris = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches;

export function initDetails() {
  const g = window.gsap, ST = window.ScrollTrigger, Split = window.SplitText;
  initQuestions(g);
  if (!g || !ST || etat.calme) return;

  /* Titres : lignes masquées qui montent (découpage refait au redimensionnement, aucune lettre coupée). */
  if (Split) {
    document.querySelectorAll('[data-titre-decoupe]').forEach((t) => {
      Split.create(t, {
        type: 'lines', mask: 'lines', linesClass: 'ligne-decoupe', autoSplit: true, reduceWhiteSpace: false,
        onSplit: (s) => (t.classList.add('decoupe'), g.fromTo(s.lines, { yPercent: 108 }, { yPercent: 0, duration: 0.95, stagger: 0.09, ease: 'power4.out', scrollTrigger: { trigger: t, start: 'top 96%', once: true } })),
        onRevert: () => t.classList.remove('decoupe'),
      });
    });
  }

  /* Photos : révélation de bas en haut et léger parallaxe (image agrandie d'au moins son déplacement). */
  document.querySelectorAll('main .media').forEach((m) => {
    if (m.closest('.tete, [data-strates-scene].epinglee, [data-galerie-section], .avis, .cime, .visionneuse, .vignettes')) return;
    const img = m.querySelector('img');
    g.fromTo(m, { clipPath: 'inset(14% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: m, start: 'top 90%', once: true } });
    if (img && m.offsetHeight > 260) {
      g.fromTo(img, { scale: 1.14, yPercent: -4 }, { yPercent: 4, ease: 'none', scrollTrigger: { trigger: m, start: 'top bottom', end: 'bottom top', scrub: true } });
    }
  });

  /* Chiffres : une tige orange pousse au-dessus de chaque chiffre. */
  document.querySelectorAll('[data-tige]').forEach((t, i) => g.fromTo(t, { scaleX: 0 }, { scaleX: 1, duration: 1.2, delay: (i % 4) * 0.12, ease: 'power3.out', scrollTrigger: { trigger: t, start: 'top 90%', once: true } }));

  /* Méthode : la tige relie les trois étapes au fil de la lecture. */
  const tige = document.querySelector('[data-tige-chemin]');
  if (tige) g.fromTo(tige, { strokeDasharray: '1 1', strokeDashoffset: 1 }, { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: '[data-methode]', start: 'top 75%', end: 'bottom 60%', scrub: 0.6 } });

  /* Avis : les cartes arrivent l'une après l'autre. */
  const avis = document.querySelectorAll('.avis-carte');
  if (avis.length) g.fromTo(avis, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.08, ease: 'power3.out', scrollTrigger: { trigger: '[data-avis]', start: 'top 85%', once: true } });

  /* Avec une souris : cartes qui s'inclinent, boutons aimantés. */
  if (souris()) {
    document.querySelectorAll('[data-incline]').forEach((c) => {
      let b = null;
      c.addEventListener('pointerenter', () => { b = c.getBoundingClientRect(); });
      c.addEventListener('pointermove', (e) => {
        if (!b) return;
        const x = (e.clientX - b.left) / b.width - 0.5, y = (e.clientY - b.top) / b.height - 0.5;
        c.style.setProperty('--ry', (x * 7).toFixed(2) + 'deg');
        c.style.setProperty('--rx', (-y * 7).toFixed(2) + 'deg');
      });
      c.addEventListener('pointerleave', () => { b = null; c.style.setProperty('--rx', '0deg'); c.style.setProperty('--ry', '0deg'); });
    });
    document.querySelectorAll('[data-magnetique]').forEach((btn) => {
      const qx = g.quickTo(btn, 'x', { duration: 0.4, ease: 'power3.out' }), qy = g.quickTo(btn, 'y', { duration: 0.4, ease: 'power3.out' });
      let b = null;
      btn.addEventListener('pointerenter', () => { b = btn.getBoundingClientRect(); });
      btn.addEventListener('pointermove', (e) => { if (!b) return; qx((e.clientX - b.left - b.width / 2) * 0.25); qy((e.clientY - b.top - b.height / 2) * 0.35); });
      btn.addEventListener('pointerleave', () => { b = null; qx(0); qy(0); });
    });
  }
}

/* Questions fréquentes : ouverture et fermeture animées, sans à-coup, puis positions recalculées. */
function initQuestions(g) {
  document.querySelectorAll('.faq-item').forEach((d) => {
    const s = d.querySelector('summary'), r = d.querySelector('.faq-reponse');
    if (!s || !r) return;
    s.addEventListener('click', (e) => {
      if (!g || etat.calme) return;
      e.preventDefault();
      if (d.open) {
        g.to(r, { height: 0, duration: 0.35, ease: 'power2.inOut', onComplete: () => { d.open = false; g.set(r, { clearProps: 'height' }); window.ScrollTrigger && window.ScrollTrigger.refresh(); } });
      } else {
        d.open = true;
        g.fromTo(r, { height: 0 }, { height: r.scrollHeight, duration: 0.45, ease: 'power2.out', onComplete: () => { g.set(r, { clearProps: 'height' }); window.ScrollTrigger && window.ScrollTrigger.refresh(); } });
      }
    });
  });
}
