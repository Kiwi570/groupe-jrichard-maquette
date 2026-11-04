/* Intro (chaque arrivée sur le site et chaque rechargement) et apparition de la tête de page.
   0 s : sol, logo et graine visibles · 0,1 s : la graine tombe et s'enfonce, les racines poussent ·
   0,55 s : tronc et branches · 1,05 s : le feuillage éclot · 1,5 s : il s'écarte sur la photo · 1,6 s : le titre monte (fin vers 2,5 s). */

const gsap = () => window.gsap;

/* Éléments de la tête de page (animés à l'intro et à l'arrivée par le voile). */
export function animerTete(debut = 0, tl = null) {
  const g = gsap();
  if (!g || !document.querySelector('[data-tete]')) return null;
  const t = tl || g.timeline();
  const lignes = document.querySelectorAll('.tete-ligne');
  const autres = document.querySelectorAll('.tete-surtitre, .tete-intro, .tete-profils, .tete-bas, .tete-cote');
  const fond = document.querySelector('.tete-fond img');
  if (fond) t.fromTo(fond, { scale: 1.12 }, { scale: 1, duration: tl ? 0.8 : 1.4, ease: 'power3.out' }, debut);
  /* Décors propres à chaque ouverture : traits du plan, règle, ligne d'eau, racines qui se tracent ; photos du collage, pastille et années qui se posent. */
  const traits = document.querySelectorAll('.tete [data-tete-trait]');
  if (traits.length) t.fromTo(traits, { strokeDasharray: '1 1', strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.2, stagger: 0.05, ease: 'power2.inOut' }, debut + 0.2);
  const poses = document.querySelectorAll('.tete-collage, .tete-pastille, .tete-annees, .tete-mousqueton');
  if (poses.length) t.fromTo(poses, { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.09, ease: 'back.out(1.6)' }, debut + 0.35);
  t.fromTo(lignes, { yPercent: 108, opacity: 1 }, { yPercent: 0, opacity: 1, duration: tl ? 0.75 : 0.85, stagger: tl ? 0.08 : 0.1, ease: 'power4.out' }, debut + 0.12);
  t.fromTo(autres, { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.06, ease: 'power3.out' }, debut + 0.28);
  return t;
}

export function tetesFinales() {
  const g = gsap();
  if (!g) return;
  g.set('.tete-ligne, .tete-surtitre, .tete-intro, .tete-profils, .tete-bas, .tete-cote, .tete-collage, .tete-pastille, .tete-annees, .tete-mousqueton', { clearProps: 'transform,opacity' });
  g.set('.tete [data-tete-trait]', { clearProps: 'strokeDasharray,strokeDashoffset' });
  g.set('.tete-fond img', { clearProps: 'transform' });
}

export function timelineIntro() {
  const g = gsap();
  const panneau = document.querySelector('[data-ouverture]');
  if (!g || !panneau) return null;
  const q = (s) => panneau.querySelectorAll(s);
  const branches = [...q('.intro-branches path')];
  const racines = q('.intro-racines path');
  const feuilles = [...q('.intro-feuilles circle')];
  const tl = g.timeline({ defaults: { ease: 'power3.out' } });

  tl.fromTo(q('.intro-graine'), { attr: { cy: 330 } }, { attr: { cy: 470 }, duration: 0.36, ease: 'power2.in' }, 0.08)
    .to(q('.intro-graine'), { attr: { r: 3 }, opacity: 0, duration: 0.24, ease: 'power2.out' }, 0.44)
    .fromTo(racines, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.45, stagger: 0.01, ease: 'power2.out' }, 0.4);

  /* Les branches se tracent par étage, du tronc vers les rameaux. */
  branches.forEach((b) => {
    const p = +b.dataset.p || 0;
    tl.fromTo(b, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.28, ease: 'power1.inOut' }, 0.55 + p * 0.08);
  });
  tl.fromTo(q('.intro-date'), { opacity: 0 }, { opacity: 1, duration: 0.35 }, 0.78);

  /* Le feuillage éclot, des plus grosses touffes aux plus petites. */
  tl.set(q('.intro-feuilles'), { opacity: 1 }, 1.05)
    .fromTo(feuilles, { scale: 0 }, { scale: 1, duration: 0.38, ease: 'back.out(1.6)', stagger: { each: 0.003, from: 'random' } }, 1.05);

  /* Le feuillage s'écarte : les feuilles s'envolent vers les bords, la terre s'ouvre sur la photo. */
  const cx = 300, cy = 250;
  feuilles.forEach((f) => {
    const x = +f.getAttribute('cx') - cx, y = +f.getAttribute('cy') - cy;
    const d = Math.hypot(x, y) || 1;
    tl.to(f, { x: (x / d) * (520 + d * 1.4), y: (y / d) * (420 + d * 1.2), scale: 2.6, opacity: 0, duration: 0.6, ease: 'power2.in' }, 1.48);
  });
  tl.to(q('.intro-branches, .intro-racines, .intro-date, .intro-logo, .intro-sol'), { opacity: 0, duration: 0.28, ease: 'power1.out' }, 1.48)
    .fromTo(q('.intro-fond'), { '--trou': '0px' }, { '--trou': '150vmax', duration: 0.66, ease: 'power2.inOut' }, 1.5);

  animerTete(1.52, tl);
  return tl;
}
