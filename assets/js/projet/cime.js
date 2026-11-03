/* La cime, en bas de chaque page : en y arrivant, le feuillage s'écarte vers les coins, les nuages glissent à des
   vitesses différentes (profondeur) et trois oiseaux traversent le ciel une fois. Rien en mode calme. */
import { etat } from '../socle/index.js?v=2';

export function initCime() {
  const g = window.gsap, ST = window.ScrollTrigger;
  if (!g || !ST || etat.calme) return;
  document.querySelectorAll('.cime').forEach((cime) => {
    const [gauche, droite] = cime.querySelectorAll('[data-cime-feuillage]');
    const ouverture = { trigger: cime, start: 'top bottom', end: 'top 25%', scrub: 0.8 };
    if (gauche) g.fromTo(gauche, { xPercent: 0, yPercent: 0, rotation: 0 }, { xPercent: -34, yPercent: -46, rotation: -6, ease: 'power1.in', scrollTrigger: ouverture });
    if (droite) g.fromTo(droite, { xPercent: 0, yPercent: 0, rotation: 0 }, { xPercent: 34, yPercent: -46, rotation: 6, ease: 'power1.in', scrollTrigger: { ...ouverture } });
    const profondeur = { trigger: cime, start: 'top bottom', end: 'bottom top', scrub: true };
    cime.querySelectorAll('.cime-nuage').forEach((n, i) => g.fromTo(n, { xPercent: -8 * (i + 1), yPercent: 30 * (i + 1) }, { xPercent: 10 * (i + 1), yPercent: -30 * (i + 1), ease: 'none', scrollTrigger: profondeur }));
    const vol = cime.querySelector('.cime-oiseaux');
    if (vol) ST.create({ trigger: cime, start: 'top 55%', once: true, onEnter: () => {
      vol.classList.add('vole');
      const largeur = () => cime.offsetWidth + vol.offsetWidth * 2;
      g.timeline()
        .set(vol, { x: -vol.offsetWidth, y: 0, opacity: 1 })
        .to(vol, { x: () => largeur(), duration: 4.6, ease: 'none' }, 0)
        .to(vol, { y: -26, duration: 1.15, ease: 'sine.inOut', yoyo: true, repeat: 3 }, 0)
        .to(vol, { opacity: 0, duration: 0.4 }, 4.2);
    } });
  });
}
