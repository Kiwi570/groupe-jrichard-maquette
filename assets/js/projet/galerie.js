/* Galerie horizontale épinglée des réalisations (ordinateur) : la piste défile au rythme de la page,
   avec une légère déformation, une barre de progression et un arrêt doux sur chaque carte.
   Sur téléphone, en mode calme et sans JavaScript, elle défile au doigt (défilement natif, accrochage). */
import { etat } from '../socle/index.js?v=1';

export function initGalerie() {
  const g = window.gsap, ST = window.ScrollTrigger;
  document.querySelectorAll('[data-galerie-section]').forEach((section) => {
    const piste = section.querySelector('[data-galerie]');
    if (!piste || !g || !ST || etat.calme) return;
    const barre = section.querySelector('.galerie-progres span');
    const cartes = [...piste.children];
    ST.matchMedia({
      '(min-width: 761px) and (min-height: 601px)': () => {
        piste.removeAttribute('tabindex');
        piste.removeAttribute('role');
        const distance = () => Math.max(0, piste.scrollWidth - window.innerWidth);
        const tl = g.fromTo(piste, { x: 0 }, {
          x: () => -distance(), ease: 'none',
          scrollTrigger: {
            trigger: section, start: 'top top', end: () => '+=' + distance(), pin: true, scrub: 0.6, anticipatePin: 1, invalidateOnRefresh: true,
            snap: cartes.length > 1 ? { snapTo: 1 / (cartes.length - 1), duration: { min: 0.2, max: 0.5 }, ease: 'power1.inOut', delay: 0.08 } : false,
            onUpdate: (s) => {
              if (barre) barre.style.transform = `scaleX(${s.progress})`;
              /* Déformation limitée selon la vitesse (aucune lecture de mise en page). */
              const v = g.utils.clamp(-6, 6, s.getVelocity() / -400);
              g.to(cartes, { skewX: v, duration: 0.35, ease: 'power2.out', overwrite: true });
            },
          },
        });
        /* Une carte atteinte au clavier est ramenée au centre. */
        cartes.forEach((c, i) => c.addEventListener('focus', () => {
          const st = tl.scrollTrigger;
          if (!st) return;
          const y = st.start + (st.end - st.start) * (i / Math.max(1, cartes.length - 1));
          window.scrollTo({ top: y, behavior: 'smooth' });
        }));
        return () => { piste.setAttribute('tabindex', '0'); piste.setAttribute('role', 'region'); g.set(cartes, { clearProps: 'transform' }); };
      },
    });
  });
}
