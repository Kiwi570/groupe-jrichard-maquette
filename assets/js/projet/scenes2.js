/* Scènes de la v2, page par page :
   - Entretien : le cadran des saisons tourne pendant la lecture et allume la carte de la saison pointée ;
     la saison réelle porte la mention « En ce moment ».
   - Élagage : les bûches du stère tombent et s'empilent ; au survol d'un ravageur, la maladie gagne la feuille puis elle guérit (CSS).
   - Génie végétal : l'eau de la coupe coule au fil du défilement, les racines des boutures poussent dans la berge.
   - Le Groupe : l'arbre des six sociétés se dessine, une branche s'allume au survol de sa société ; l'année de l'histoire
     lue s'affiche en très grand derrière les cernes.
   - Recrutement : un chemin relie les quatre étapes et une feuille le parcourt.
   Rien ne bouge en mode calme (état final directement). */
import { etat } from '../socle/index.js?v=2';
import { saisonDuJour } from './saison.js?v=2';

const ORDRE_SAISONS = ['printemps', 'ete', 'automne', 'hiver'];

function cadranSaisons(g, ST) {
  const liste = document.querySelector('[data-saisons]');
  const cadran = document.querySelector('[data-saisons-cadran]');
  if (!liste) return;
  const cartes = [...liste.children];
  const ici = ORDRE_SAISONS.indexOf(saisonDuJour());
  /* Mention de la saison en cours : écrite dans la page, montrée sur la bonne carte. */
  const carte = cartes[ici];
  if (carte) { const m = carte.querySelector('.saison-maintenant'); if (m) m.hidden = false; carte.classList.add('saison-actuelle'); }
  if (!cadran || !g || !ST || etat.calme) return;
  const aiguille = cadran.querySelector('[data-saisons-aiguille]');
  let pointee = -1;
  const allumer = (i) => {
    if (i === pointee) return;
    pointee = i;
    cartes.forEach((c, k) => c.classList.toggle('pointee', k === i));
    cadran.querySelectorAll('.q').forEach((q, k) => q.classList.toggle('pointee', k === i));
  };
  g.set(aiguille, { rotation: 0, transformOrigin: '0px 0px', svgOrigin: '0 0' });
  ST.create({
    trigger: liste, start: 'top 75%', end: 'bottom 45%', scrub: 0.6,
    onUpdate: (s) => {
      const a = s.progress * 359;
      g.set(aiguille, { rotation: a, svgOrigin: '0 0' });
      allumer(Math.min(3, Math.floor(s.progress * 4)));
    },
  });
}

function stere(g, ST) {
  const s = document.querySelector('[data-stere]');
  if (!s || !g || !ST || etat.calme) return;
  const buches = s.querySelectorAll('.buche');
  g.set(buches, { y: -110, opacity: 0, transformOrigin: '50% 50%' });
  ST.create({ trigger: s, start: 'top 85%', once: true, onEnter: () => g.to(buches, { y: 0, opacity: 1, rotation: () => g.utils.random(-8, 8), duration: 0.8, ease: 'bounce.out', stagger: 0.09 }) });
}

function bergeVivante(g, ST) {
  const vagues = document.querySelector('[data-berge-vagues]');
  const racines = document.querySelectorAll('.berge-racine');
  if (!g || !ST || etat.calme) return;
  if (vagues) [...vagues.children].forEach((v, i) => g.fromTo(v, { x: 0 }, { x: 60 + i * 30, ease: 'none', scrollTrigger: { trigger: vagues.closest('section'), start: 'top bottom', end: 'bottom top', scrub: 0.4 } }));
  if (racines.length) g.fromTo(racines, { strokeDasharray: '1 1', strokeDashoffset: 1 }, { strokeDashoffset: 0, stagger: 0.04, ease: 'none', scrollTrigger: { trigger: racines[0].closest('section'), start: 'top 55%', end: 'center 40%', scrub: 0.6 } });
}

function arbreSocietes(g, ST) {
  const arbre = document.querySelector('[data-arbre-societes]');
  if (!arbre) return;
  const branches = [...arbre.querySelectorAll('[data-branche]')];
  document.querySelectorAll('[data-societe]').forEach((c) => {
    const b = branches[+c.dataset.societe];
    if (!b) return;
    c.addEventListener('pointerenter', () => b.classList.add('allumee'));
    c.addEventListener('pointerleave', () => b.classList.remove('allumee'));
    c.addEventListener('focusin', () => b.classList.add('allumee'));
    c.addEventListener('focusout', () => b.classList.remove('allumee'));
  });
  if (!g || !ST || etat.calme) return;
  const tl = g.timeline({ scrollTrigger: { trigger: arbre, start: 'top 85%', end: 'bottom 55%', scrub: 0.6 } });
  tl.fromTo(arbre.querySelector('.tronc'), { scaleY: 0, transformOrigin: '50% 100%' }, { scaleY: 1, duration: 0.3 }, 0)
    .fromTo(arbre.querySelector('.racines'), { strokeDasharray: '1 1', strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.4 }, 0)
    .fromTo(arbre.querySelectorAll('.bois'), { strokeDasharray: '1 1', strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.6, stagger: 0.05 }, 0.2)
    .fromTo(arbre.querySelectorAll('.couronne'), { scale: 0, transformOrigin: '50% 50%' }, { scale: 1, duration: 0.4, stagger: 0.06, ease: 'back.out(2)' }, 0.55);
}

function anneesGeantes(g, ST) {
  const bloc = document.querySelector('[data-annee-geante]');
  const etapes = [...document.querySelectorAll('[data-cerne-etape]')];
  if (!bloc || !etapes.length || !g || !ST || etat.calme) return;
  const span = bloc.querySelector('span');
  const annees = etapes.map((e) => (e.querySelector('b') || {}).textContent || '');
  let actuelle = 0;
  const montrer = (i) => {
    if (i === actuelle || !annees[i]) return;
    const bas = i > actuelle;
    actuelle = i;
    g.timeline()
      .to(span, { yPercent: bas ? -60 : 60, opacity: 0, duration: 0.25, ease: 'power2.in' })
      .add(() => { span.textContent = annees[i]; })
      .fromTo(span, { yPercent: bas ? 60 : -60, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.45, ease: 'power3.out' });
  };
  etapes.forEach((e, i) => {
    ST.create({ trigger: e, start: 'top 60%', end: 'bottom 60%', onToggle: (s) => { if (s.isActive) montrer(i); } });
    e.addEventListener('click', () => montrer(i));
  });
}

function cheminEtapes(g, ST) {
  const bloc = document.querySelector('[data-chemin-etapes]');
  if (!bloc || !g || !ST || etat.calme) return;
  const chemin = bloc.querySelector('path');
  const feuille = bloc.querySelector('.chemin-feuille');
  const svg = bloc.querySelector('svg');
  const total = chemin.getTotalLength();
  const placer = (p) => {
    const pt = chemin.getPointAtLength(total * p);
    const avant = chemin.getPointAtLength(Math.max(0, total * p - 2));
    const b = svg.getBoundingClientRect(), vb = svg.viewBox.baseVal;
    const x = (pt.x / vb.width) * b.width, y = (pt.y / vb.height) * b.height;
    const angle = Math.atan2((pt.y - avant.y) * b.height / vb.height, (pt.x - avant.x) * b.width / vb.width) * 180 / Math.PI;
    g.set(feuille, { x, y, rotation: angle + Math.sin(p * 30) * 18 });
  };
  g.set(chemin, { strokeDasharray: '1 1', strokeDashoffset: 1 });
  ST.create({ trigger: bloc.closest('section'), start: 'top 70%', end: 'bottom 70%', scrub: 0.6,
    onUpdate: (s) => { g.set(chemin, { strokeDashoffset: 1 - s.progress }); placer(Math.max(0.001, s.progress)); feuille.style.opacity = s.progress > 0.01 ? 1 : 0; } });
}

export function initScenes2() {
  const g = window.gsap, ST = window.ScrollTrigger;
  [cadranSaisons, stere, bergeVivante, arbreSocietes, anneesGeantes, cheminEtapes].forEach((f) => { try { f(g, ST); } catch (err) { console.error('[scenes2]', f.name, err); } });
}
