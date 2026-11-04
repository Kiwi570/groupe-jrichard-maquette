/* Ouvertures propres à chaque page (v3) :
   - Entretien : la saison réelle est mise en avant dans la frise des saisons (« En ce moment ») ;
   - Élagage : la corde du site s'efface pendant que la règle d'altitude de l'ouverture est à l'écran ;
   - Réalisations : le mur de chantiers s'arrête quand il sort de l'écran (et ne bouge pas en mode calme, CSS). */
import { saisonDuJour } from './saison.js?v=3';

export function initOuvertures() {
  const frise = document.querySelector('.tete-saisons');
  if (frise) {
    const ici = frise.querySelector(`[data-saison="${saisonDuJour()}"]`);
    if (ici) { ici.classList.add('maintenant'); const m = ici.querySelector('small'); if (m) m.hidden = false; }
  }
  /* Élagage : la règle d'altitude de l'ouverture remplace la corde du site tant qu'elle est à l'écran (pas deux altitudes à la fois). */
  const hauteur = document.querySelector('.tete--hauteur');
  if (hauteur && 'IntersectionObserver' in window) {
    new IntersectionObserver((es) => es.forEach((e) => document.documentElement.classList.toggle('corde-cachee', e.intersectionRatio > 0.35)), { threshold: [0, 0.35, 0.6, 1] }).observe(hauteur);
  }
  const mur = document.querySelector('[data-mur]');
  if (mur && 'IntersectionObserver' in window) {
    new IntersectionObserver((es) => es.forEach((e) => mur.classList.toggle('arret', !e.isIntersecting))).observe(mur.closest('.tete') || mur);
  }
}
