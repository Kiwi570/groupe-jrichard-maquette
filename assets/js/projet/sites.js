/* Sites : statut « ouvert maintenant » calculé à l'heure de Paris (jamais celle du visiteur), jours fériés compris ;
   aucun statut sans horaires fiables (Amilly, à confirmer) ni les jours fériés. Carte : la Loire se trace,
   les sites pulsent doucement (à l'écran seulement), un site touché met sa fiche en avant. */
import { boucle, etat } from '../socle/index.js?v=1';

const JOURS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];

function maintenantParis() {
  const f = new Intl.DateTimeFormat('fr-FR', { timeZone: 'Europe/Paris', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23', weekday: 'short' });
  const p = Object.fromEntries(f.formatToParts(new Date()).map((x) => [x.type, x.value]));
  const a = +p.year, m = +p.month, j = +p.day;
  const jour = new Date(Date.UTC(a, m - 1, j)).getUTCDay();
  return { a, m, j, jour, minutes: +p.hour * 60 + +p.minute };
}

/* Jours fériés en France métropolitaine (Pâques par l'algorithme de Meeus). */
function feries(a) {
  const b = a % 19, c = Math.floor(a / 100), d = a % 100, e = Math.floor(c / 4), f = c % 4, g = Math.floor((c + 8) / 25), h = Math.floor((c - g + 1) / 3);
  const k = (19 * b + c - e - h + 15) % 30, i = Math.floor(d / 4), l = d % 4, n = (32 + 2 * f + 2 * i - k - l) % 7, o = Math.floor((b + 11 * k + 22 * n) / 451);
  const mois = Math.floor((k + n - 7 * o + 114) / 31), jour = ((k + n - 7 * o + 114) % 31) + 1;
  const paques = Date.UTC(a, mois - 1, jour), J = 86400000;
  const iso = (t) => new Date(t).toISOString().slice(0, 10);
  return new Set([`${a}-01-01`, iso(paques + J), `${a}-05-01`, `${a}-05-08`, iso(paques + 39 * J), iso(paques + 50 * J), `${a}-07-14`, `${a}-08-15`, `${a}-11-01`, `${a}-11-11`, `${a}-12-25`]);
}

const hm = (s) => { const [h, m] = s.split(':').map(Number); return h * 60 + m; };
const lisible = (min) => { const h = Math.floor(min / 60), m = min % 60; return `${h}\u00a0h${m ? '\u00a0' + String(m).padStart(2, '0') : ''}`; };

function statut(site) {
  if (!site.horaires || !site.horaires.length || site.aConfirmer) return null;
  const n = maintenantParis();
  const pad = (x) => String(x).padStart(2, '0');
  const ferie = feries(n.a);
  if (ferie.has(`${n.a}-${pad(n.m)}-${pad(n.j)}`)) return null;
  const plages = (jour) => site.horaires.filter((p) => p[0] === jour).map((p) => [hm(p[1]), hm(p[2])]);
  const auj = plages(n.jour);
  const enCours = auj.find(([d, f]) => n.minutes >= d && n.minutes < f);
  if (enCours) return { ouvert: true, texte: `Ouvert maintenant · ferme à ${lisible(enCours[1])}` };
  const plus = auj.find(([d]) => d > n.minutes);
  if (plus) return { ouvert: false, texte: `Fermé · rouvre à ${lisible(plus[0])}` };
  for (let k = 1; k <= 7; k++) {
    const jour = (n.jour + k) % 7;
    const date = new Date(Date.UTC(n.a, n.m - 1, n.j + k));
    if (ferie.has(date.toISOString().slice(0, 10))) return { ouvert: false, texte: 'Fermé' };
    const p = plages(jour);
    if (p.length) return { ouvert: false, texte: `Fermé · rouvre ${k === 1 ? 'demain' : JOURS[jour]} à ${lisible(p[0][0])}` };
  }
  return null;
}

export function initSites() {
  let sites = [];
  try { sites = JSON.parse(document.getElementById('donnees-sites').textContent); } catch { return; }
  const parCle = Object.fromEntries(sites.map((s) => [s.cle, s]));
  const majStatuts = () => document.querySelectorAll('[data-statut-site]').forEach((el) => {
    const s = parCle[el.dataset.statutSite];
    const st = s && statut(s);
    if (!st) { if (!el.hasAttribute('data-statut-court')) el.textContent = ''; return; }
    const court = el.hasAttribute('data-statut-court');
    el.innerHTML = court ? `${s.nom}\u00a0: ${st.texte.toLowerCase()}` : `<span class="pastille" aria-hidden="true"></span>${st.texte}`;
    const cible = court ? el.closest('.info-cle') : el;
    if (cible) cible.classList.toggle('statut--ferme', !st.ouvert);
    if (!court) el.classList.add('statut');
  });
  majStatuts();
  setInterval(majStatuts, 60000);

  /* Carte : un site touché ou survolé met sa fiche en avant (au clavier, la liste des sites donne les mêmes informations). */
  document.querySelectorAll('[data-carte]').forEach((carte) => {
    const bloc = carte.closest('[data-sites]');
    const choisir = (cle, defiler) => {
      carte.querySelectorAll('.carte-site').forEach((g) => g.classList.toggle('actif', g.dataset.site === cle));
      if (!bloc) return;
      bloc.querySelectorAll('[data-site-carte]').forEach((f) => f.classList.toggle('actif', f.dataset.siteCarte === cle));
      const fiche = bloc.querySelector(`[data-site-carte="${cle}"]`);
      if (defiler && fiche && window.matchMedia('(max-width: 960px)').matches) fiche.scrollIntoView({ behavior: etat.calme ? 'auto' : 'smooth', block: 'nearest' });
    };
    carte.querySelectorAll('.carte-site').forEach((g) => {
      g.addEventListener('click', () => choisir(g.dataset.site, true));
      g.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') choisir(g.dataset.site, false); });
    });
    /* La Loire se trace à l'arrivée de la carte. */
    const loire = carte.querySelector('[data-loire]');
    const gs = window.gsap;
    if (loire && gs && window.ScrollTrigger && !etat.calme) {
      gs.fromTo(loire, { strokeDashoffset: 1, strokeDasharray: '1 1' }, { strokeDashoffset: 0, duration: 2.2, ease: 'power2.inOut', scrollTrigger: { trigger: carte, start: 'top 80%', once: true } });
    }
    /* Halos qui respirent, seulement quand la carte est à l'écran (boucle commune). */
    const halos = [...carte.querySelectorAll('[data-halo]')];
    boucle(carte, (dt, t) => {
      halos.forEach((h, i) => {
        const p = (Math.sin(t * 2.2 + i * 1.3) + 1) / 2;
        h.setAttribute('r', (16 + p * 12).toFixed(1));
        h.style.opacity = (0.32 - p * 0.24).toFixed(2);
      });
    });
  });
}
