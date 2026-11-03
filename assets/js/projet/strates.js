/* Accueil : les quatre métiers en strates, du sol à la cime. Sur ordinateur, la scène est épinglée :
   chaque métier pousse depuis le bas (la photo se révèle de bas en haut), le fond s'éclaircit,
   une jauge suit la progression. Sur téléphone, en mode calme et sans JavaScript : les métiers s'empilent. */
import { etat } from '../socle/index.js?v=1';

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
      panneaux.forEach((p, i) => {
        const media = p.querySelector('.strate-media');
        const texte = p.querySelector('.strate-texte');
        if (i === 0) { g.set(p, { autoAlpha: 1 }); return; }
        g.set(p, { autoAlpha: 0 });
        const t = i - 1;
        const prec = panneaux[i - 1];
        tl.to(prec.querySelector('.strate-texte'), { y: -40, autoAlpha: 0, duration: 0.35 }, t + 0.1)
          .to(prec.querySelector('.strate-media'), { scale: 0.94, autoAlpha: 0, duration: 0.4 }, t + 0.15)
          .set(p, { autoAlpha: 1 }, t + 0.3)
          .fromTo(media, { clipPath: 'inset(100% 0% 0% 0% round 22px)' }, { clipPath: 'inset(0% 0% 0% 0% round 22px)', duration: 0.6, ease: 'power2.out' }, t + 0.3)
          .fromTo(media.querySelector('img'), { scale: 1.18 }, { scale: 1, duration: 0.7, ease: 'power2.out' }, t + 0.3)
          .fromTo(texte, { y: 50, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.45, ease: 'power2.out' }, t + 0.45)
          .to(scene, { backgroundColor: FONDS[i], duration: 0.6 }, t + 0.2);
      });
      jauges.forEach((j, i) => tl.fromTo(j, { scaleX: 0 }, { scaleX: 1, duration: i ? 1 : 0.01 }, i ? i - 1 : 0));
      return () => {
        scene.classList.remove('epinglee');
        scene.removeAttribute('data-plein-ecran');
        g.set(panneaux, { clearProps: 'all' });
        panneaux.forEach((p) => g.set([p.querySelector('.strate-texte'), p.querySelector('.strate-media'), p.querySelector('.strate-media img')], { clearProps: 'all' }));
        g.set(scene, { clearProps: 'backgroundColor' });
      };
    },
  });
}
