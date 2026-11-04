/* Scènes liées à la lecture : les cernes du tronc (Le Groupe), la taille raisonnée (Élagage), la coupe de berge
   (Génie végétal). La colonne de dessin reste à l'écran (sticky) ; chaque étape lue active son dessin.
   En mode calme et sans JavaScript : tout est affiché dans son état final. */
import { etat } from '../socle/index.js?v=3';

const ST = () => window.ScrollTrigger;
const declencheurs = (items, activer) => {
  const st = ST();
  if (!st) return;
  items.forEach((el, i) => st.create({ trigger: el, start: 'top 62%', end: 'bottom 62%', onToggle: (s) => { if (s.isActive) activer(i); }, onEnterBack: () => activer(i) }));
};

export function initCernes() {
  const bloc = document.querySelector('[data-cernes]');
  if (!bloc) return;
  const cernes = [...bloc.querySelectorAll('[data-cerne]')];
  const annees = [...bloc.querySelectorAll('[data-cerne-annee]')];
  const etapes = [...bloc.querySelectorAll('[data-cerne-etape]')];
  const g = window.gsap;
  let actif = -1;
  const activer = (i) => {
    if (i === actif) return;
    actif = i;
    cernes.forEach((c, k) => {
      c.classList.toggle('actif', k === i);
      if (g && !etat.calme) g.to(c, { strokeDashoffset: k <= i ? 0 : 1, duration: 0.8, ease: 'power2.out', overwrite: true });
    });
    annees.forEach((a, k) => { if (g && !etat.calme) g.to(a, { opacity: k <= i ? 1 : 0, duration: 0.4, overwrite: true }); });
    etapes.forEach((e, k) => e.classList.toggle('actif', k === i));
  };
  if (!etat.calme && g) {
    g.set(cernes, { strokeDasharray: '1 1', strokeDashoffset: 1 });
    g.set(annees, { opacity: 0 });
    declencheurs(etapes, activer);
  } else activer(cernes.length - 1);
  const choisir = (i) => {
    activer(i);
    if (window.matchMedia('(max-width: 900px)').matches) return;
    const el = etapes[i];
    if (el && !etat.calme) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };
  bloc.querySelectorAll('[data-cerne-zone]').forEach((z) => z.addEventListener('click', () => choisir(+z.dataset.cerneZone)));
  bloc.querySelectorAll('[data-cerne-bouton]').forEach((b) => b.addEventListener('click', () => activer(+b.dataset.cerneBouton)));
}

export function initTaille() {
  const bloc = document.querySelector('[data-taille]');
  if (!bloc) return;
  const etapes = [...bloc.querySelectorAll('[data-taille-etape]')];
  const branches = [...bloc.querySelectorAll('[data-coupe]')];
  const ORDRE = [null, 'morte', 'basse', 'croisee', 'gourmand'];
  const g = window.gsap;
  const activer = (i) => {
    etapes.forEach((e, k) => e.classList.toggle('actif', k === i));
    branches.forEach((b) => {
      const n = ORDRE.indexOf(b.dataset.type);
      const coupee = n > 0 && n <= i;
      if (!g || etat.calme) { b.style.opacity = coupee ? '0.18' : '1'; return; }
      g.to(b, coupee
        ? { y: 60, rotation: n % 2 ? 14 : -12, opacity: 0, duration: 0.7, ease: 'power2.in', transformOrigin: '0% 50%', overwrite: true }
        : { y: 0, rotation: 0, opacity: 1, duration: 0.5, ease: 'power2.out', overwrite: true });
    });
  };
  if (etat.calme || !g) { activer(0); return; }
  declencheurs(etapes, activer);
  activer(0);
}

export function initBerge() {
  const bloc = document.querySelector('[data-berge]');
  if (!bloc) return;
  const etapes = [...bloc.querySelectorAll('[data-couche-etape]')];
  const couches = Object.fromEntries([...bloc.querySelectorAll('[data-couche]')].map((c) => [c.dataset.couche, c]));
  const g = window.gsap;
  if (etat.calme || !g) return;
  const ordre = etapes.map((e) => e.dataset.coucheEtape);
  g.set(Object.values(couches), { opacity: 0, y: 24 });
  const activer = (i) => {
    etapes.forEach((e, k) => e.classList.toggle('actif', k === i));
    ordre.forEach((c, k) => { if (couches[c]) g.to(couches[c], { opacity: k <= i ? 1 : 0, y: k <= i ? 0 : 24, duration: 0.6, ease: 'power2.out', overwrite: true }); });
  };
  declencheurs(etapes, activer);
}
