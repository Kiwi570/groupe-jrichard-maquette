/* Accueil : les quatre métiers en strates, du sol à la cime. Sur ordinateur, la scène est épinglée en plein écran :
   chaque photo pousse du sol en dôme par-dessus la précédente, un grand compteur d'altitude défile (0, 2, 8, 25 m),
   une jauge suit la progression. Sur téléphone, en mode calme et sans JavaScript : les métiers s'empilent. */
import { etat } from '../socle/index.js?v=2';

const FONDS = ['#1C1B15', '#23241B', '#26331F', '#2E4A30'];

export function initStrates() {
  const scene = document.querySelector('[data-strates-scene]');
  const g = window.gsap, ST = window.ScrollTrigger;
  if (!scene || !g || !ST || etat.calme) return;
  const panneaux = [...scene.querySelectorAll('[data-strate-panneau]')];
  const jauges = [...scene.querySelectorAll('.strates-jauge i')];
  ST.matchMedia({
    '(min-width: 861px) and (min-height: 600px)': () => {
      scene.classList.add('epinglee');
      scene.setAttribute('data-plein-ecran', '');
      const tl = g.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: scene, start: 'top top', end: () => '+=' + window.innerHeight * (panneaux.length - 1) * 1.1, pin: true, scrub: 0.7, anticipatePin: 1, invalidateOnRefresh: true,
          snap: { snapTo: 1 / (panneaux.length - 1), duration: { min: 0.25, max: 0.6 }, delay: 0.12, ease: 'power1.inOut' } },
      });
      /* Plein écran : chaque métier pousse du sol en dôme par-dessus le précédent, le compteur d'altitude défile. */
      const piste = scene.querySelector('.strates-altitude-piste');
      panneaux.forEach((p, i) => {
        const media = p.querySelector('.strate-media');
        const img = media.querySelector('img');
        const texte = p.querySelector('.strate-texte');
        g.set(p, { autoAlpha: 1, zIndex: i + 1 });
        media.setAttribute('data-audit-ignorer', '');
        if (i === 0) return;
        const t = i - 1;
        const prec = panneaux[i - 1];
        tl.to(prec.querySelector('.strate-texte'), { y: -60, autoAlpha: 0, duration: 0.32 }, t + 0.05)
          .to(prec.querySelector('.strate-media img'), { scale: 1.1, yPercent: -5, duration: 0.8 }, t)
          .fromTo(media, { clipPath: 'ellipse(0% 0% at 50% 100%)' }, { clipPath: 'ellipse(150% 150% at 50% 100%)', duration: 0.72, ease: 'power2.inOut' }, t + 0.12)
          .fromTo(img, { scale: 1.3, yPercent: 10 }, { scale: 1.02, yPercent: 0, duration: 0.85, ease: 'power2.out' }, t + 0.12)
          .fromTo(texte, { y: 70, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.4, ease: 'power2.out' }, t + 0.5)
          .to(scene, { backgroundColor: FONDS[i], duration: 0.6 }, t + 0.2);
        if (piste) tl.to(piste, { yPercent: -(100 / panneaux.length) * i, duration: 0.6, ease: 'power2.inOut' }, t + 0.2);
      });
      jauges.forEach((j, i) => tl.fromTo(j, { scaleX: 0 }, { scaleX: 1, duration: i ? 1 : 0.01 }, i ? i - 1 : 0));
      return () => {
        scene.classList.remove('epinglee');
        scene.removeAttribute('data-plein-ecran');
        g.set(panneaux, { clearProps: 'all' });
        panneaux.forEach((p) => { p.querySelector('.strate-media').removeAttribute('data-audit-ignorer'); g.set([p.querySelector('.strate-texte'), p.querySelector('.strate-media'), p.querySelector('.strate-media img')], { clearProps: 'all' }); });
        if (piste) g.set(piste, { clearProps: 'all' });
        g.set(scene, { clearProps: 'backgroundColor' });
      };
    },
  });
}
