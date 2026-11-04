/* Visionneuse des photos d'une réalisation : s'ouvre depuis la vignette, à la bonne taille dès l'ouverture,
   flèches du clavier, glissement, Échap ; focus gardé dedans puis rendu à la vignette.
   Chaque photo a son lien (#photo-2) qui l'ouvre directement. */
import { suivre, lacher, bloquerDefilement, debloquerDefilement } from '../socle/index.js?v=3';

export function initVisionneuse() {
  const fen = document.querySelector('[data-visionneuse-fenetre]');
  const liens = [...document.querySelectorAll('[data-visionneuse]')];
  if (!fen || !liens.length) return;
  const img = fen.querySelector('[data-visionneuse-image]');
  const leg = fen.querySelector('[data-visionneuse-legende]');
  let i = 0, origine = null;
  const afficher = (k) => {
    i = (k + liens.length) % liens.length;
    const a = liens[i];
    img.src = a.dataset.src; img.alt = a.dataset.alt; leg.textContent = `${i + 1} / ${liens.length} · ${a.dataset.alt}`;
    history.replaceState(history.state, '', '#' + a.id);
  };
  const ouvrir = (k) => {
    origine = document.activeElement;
    afficher(k);
    fen.hidden = false;
    bloquerDefilement('visionneuse');
    suivre(fen);
    fen.querySelector('[data-visionneuse-fermer]').focus();
  };
  const fermer = () => {
    fen.hidden = true;
    debloquerDefilement('visionneuse');
    lacher(fen);
    history.replaceState(history.state, '', location.pathname + location.search);
    (origine || liens[i]).focus({ preventScroll: true });
  };
  liens.forEach((a, k) => a.addEventListener('click', (e) => { e.preventDefault(); ouvrir(k); }));
  fen.querySelector('[data-visionneuse-fermer]').addEventListener('click', fermer);
  fen.querySelector('[data-visionneuse-prec]').addEventListener('click', () => afficher(i - 1));
  fen.querySelector('[data-visionneuse-suiv]').addEventListener('click', () => afficher(i + 1));
  fen.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') fermer();
    else if (e.key === 'ArrowLeft') afficher(i - 1);
    else if (e.key === 'ArrowRight') afficher(i + 1);
    else if (e.key === 'Tab') {
      const f = [...fen.querySelectorAll('button')];
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    }
  });
  let x0 = null;
  fen.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
  fen.addEventListener('touchend', (e) => { if (x0 == null) return; const d = e.changedTouches[0].clientX - x0; if (Math.abs(d) > 50) afficher(i + (d < 0 ? 1 : -1)); x0 = null; }, { passive: true });
  const m = /^#photo-(\d+)$/.exec(location.hash);
  if (m) { const k = liens.findIndex((a) => a.id === 'photo-' + m[1]); if (k >= 0) window.addEventListener('socle:pret', () => ouvrir(k), { once: true }); }
}
