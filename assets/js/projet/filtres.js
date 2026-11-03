/* Filtres des listes (réalisations, postes, actualités) : choix gardés dans l'adresse de la page,
   passage en fondu sans vider la page, rubriques vides grisées, compte annoncé. Statuts automatiques
   des événements passés (« Terminé »), calculés à la date de Paris. Liens « Postuler » sans rechargement. */
import { rafraichir } from '../socle/index.js?v=1';

function filtrer(form, liste, attrs, mots) {
  const g = window.gsap;
  const items = [...liste.children];
  const radios = [...form.querySelectorAll('input[type="radio"]')];
  const params = new URLSearchParams(location.search);
  attrs.forEach((a) => { const v = params.get(a); if (v != null) radios.filter((r) => r.name === a).forEach((r) => { r.checked = r.value === v; }); });
  const choix = () => Object.fromEntries(attrs.map((a) => [a, (form.querySelector(`[name="${a}"]:checked`) || {}).value || '']));
  const correspond = (el, c) => attrs.every((a) => !c[a] || el.dataset[a] === c[a]);
  const appliquer = (anime) => {
    const c = choix();
    let n = 0;
    items.forEach((el) => {
      const ok = correspond(el, c);
      if (ok) n++;
      if (ok === !el.hidden) return;
      el.hidden = !ok;
      if (ok && anime && g) g.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.45, ease: 'power2.out', clearProps: 'opacity' });
    });
    /* Une rubrique qui ne donnerait rien est grisée. */
    radios.forEach((r) => {
      if (!r.value || r.dataset.toujours) return;
      const essai = { ...c, [r.name]: r.value };
      if (!r.hasAttribute('data-desactive-origine')) r.setAttribute('data-desactive-origine', r.disabled ? '1' : '0');
      r.disabled = r.getAttribute('data-desactive-origine') === '1' || !items.some((el) => correspond(el, essai));
    });
    const compte = form.querySelector('[data-filtre-compte]');
    if (compte) compte.textContent = `${n} ${n > 1 ? mots[1] : mots[0]}`;
    const vide = liste.parentElement.querySelector('[data-filtre-vide]');
    if (vide) vide.hidden = n > 0;
    if (anime) rafraichir();
  };
  form.addEventListener('change', () => {
    const c = choix();
    const u = new URL(location.href);
    attrs.forEach((a) => { if (c[a]) u.searchParams.set(a, c[a]); else u.searchParams.delete(a); });
    history.replaceState(history.state, '', u.pathname + u.search + u.hash);
    appliquer(true);
  });
  appliquer(false);
}

export function initFiltres() {
  const r = document.querySelector('[data-filtres-reals]');
  if (r) filtrer(r, document.querySelector('[data-reals]'), ['profil', 'metier'], ['réalisation', 'réalisations']);
  const p = document.querySelector('[data-filtres-postes]');
  if (p) filtrer(p, document.querySelector('[data-postes]'), ['famille'], ['poste', 'postes']);
  const f = document.querySelector('[data-filtres-fil]');
  if (f) filtrer(f, document.querySelector('[data-fil]'), ['theme'], ['actualité', 'actualités']);
}

export function initEvenements() {
  const auj = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Paris' }).format(new Date());
  document.querySelectorAll('[data-evenement]').forEach((el) => {
    if (el.dataset.evenement >= auj) return;
    const badge = el.matches('[data-statut-evenement]') ? el : el.querySelector('[data-statut-evenement]');
    if (badge) badge.hidden = false;
  });
}

export function initPostuler() {
  const select = document.getElementById('cand-poste');
  if (!select) return;
  const poste = new URLSearchParams(location.search).get('poste');
  if (poste && [...select.options].some((o) => o.value === poste)) select.value = poste;
  document.querySelectorAll('a[href^="?poste="]').forEach((a) => a.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const v = new URL(a.href, location.href).searchParams.get('poste');
    select.value = v;
    const u = new URL(location.href); u.searchParams.set('poste', v); u.hash = 'candidature';
    history.replaceState(history.state, '', u.pathname + u.search + u.hash);
    const cible = document.getElementById('candidature');
    cible.scrollIntoView({ behavior: document.documentElement.classList.contains('calme') ? 'auto' : 'smooth' });
    setTimeout(() => select.focus({ preventScroll: true }), 600);
  }, true));
}
