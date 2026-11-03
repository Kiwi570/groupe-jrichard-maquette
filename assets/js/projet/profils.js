/* Profil du visiteur (particulier, entreprise, collectivité) : un seul choix pour toute la page,
   gardé dans l'adresse (?profil=…) et mémorisé. Il filtre les prestations ([data-profils]) et
   préremplit les liens de demande de devis. Le filtrage passe en fondu, sans vider la page. */
import { rafraichir } from '../socle/index.js?v=1';

const CLE = 'jr:profil';
const NOMS = { particulier: 'les particuliers', entreprise: 'les entreprises', collectivite: 'les collectivités' };

function lire() {
  const u = new URLSearchParams(location.search).get('profil');
  if (u && NOMS[u]) return u;
  try { const m = localStorage.getItem(CLE); if (m && NOMS[m]) return m; } catch {}
  return '';
}

export function initProfils() {
  const champs = [...document.querySelectorAll('[data-profils-choix] input[type="radio"]')];
  if (!champs.length) return;
  const g = window.gsap;
  let profil = lire();

  const appliquer = (anime) => {
    champs.forEach((c) => { c.checked = c.value === profil; });
    document.querySelectorAll('[data-filtre-profil]').forEach((zone) => {
      const items = [...zone.querySelectorAll(':scope > [data-profils]')];
      const strate = zone.classList.contains('strate-prestations');
      let n = 0;
      items.forEach((el) => {
        const ok = !profil || el.dataset.profils.split(' ').includes(profil);
        const montrer = ok && (!strate || n < 6);
        if (montrer) n++;
        if (montrer === !el.hidden) return;
        el.hidden = !montrer;
        if (montrer && anime && g) g.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.45, ease: 'power2.out', clearProps: 'opacity' });
      });
      const vide = zone.parentElement && zone.parentElement.querySelector(':scope > [data-filtre-vide]');
      if (vide) vide.hidden = n > 0;
      const compte = zone.parentElement && zone.parentElement.querySelector('[data-filtre-compte]');
      if (compte) compte.textContent = profil ? `${n} prestation${n > 1 ? 's' : ''} pour ${NOMS[profil]}` : `${n} prestations`;
    });
    /* Les liens de devis emportent le profil. */
    document.querySelectorAll('a[href*="motif="]:not([data-profil-fixe])').forEach((a) => {
      const u = new URL(a.href, location.href);
      if (profil) u.searchParams.set('profil', profil); else u.searchParams.delete('profil');
      a.href = u.pathname + u.search + u.hash;
    });
    if (anime) rafraichir();
  };

  document.querySelectorAll('a[href*="profil="]').forEach((a) => { a.dataset.profilFixe = '1'; });
  champs.forEach((c) => c.addEventListener('change', () => {
    profil = c.value;
    try { localStorage.setItem(CLE, profil); } catch {}
    const u = new URL(location.href);
    u.searchParams.set('profil', profil);
    history.replaceState(history.state, '', u.pathname + u.search + u.hash);
    appliquer(true);
  }));
  appliquer(false);
}
