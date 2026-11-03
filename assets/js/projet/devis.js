/* Demande de devis en 5 étapes : une étape à la fois (sans JavaScript, tout est visible), hauteur animée,
   étape annoncée aux lecteurs d'écran, choix préremplis par l'adresse (?motif=devis&besoin=elagage&profil=…),
   récapitulatif en direct et aiguillage vers la société du groupe qui répondra. */
import { rafraichir, etat } from '../socle/index.js?v=1';

const LIBELLES = {};
const SOCIETES = {
  hegy: ['Hegy Paysage, Orléans', '02 38 66 35 11', '+33238663511'],
  jrichard: ['J.Richard Paysage, Orléans', '02 38 66 13 84', '+33238661384'],
  sauvegrain: ['Sauvegrain Paysage, Amilly', '02 38 26 13 94', '+33238261394'],
  'sauvegrain-services': ['Sauvegrain Paysage Services, Amilly', '02 38 26 13 94', '+33238261394'],
  'goueffon-services': ['Goueffon Services, Orléans', '02 38 66 06 06', '+33238660606'],
  'goueffon-elagage': ['Goueffon Élagage, Semoy', '02 38 61 01 01', '+33238610101'],
  'goueffon-amilly': ['Goueffon Élagage, antenne d’Amilly', '02 38 26 13 94', '+33238261394'],
  groupe: ['Groupe J.Richard, Orléans', '02 38 66 13 84', '+33238661384'],
};

/* Aiguillage d'après l'organisation décrite sur le site actuel (à valider par le client). */
function destinataire(v) {
  const est = v.secteur === 'est';
  const pro = v.profil === 'entreprise' || v.profil === 'collectivite';
  if (v.besoin === 'elagage' || v.besoin === 'bois') return est ? 'goueffon-amilly' : 'goueffon-elagage';
  if (v.besoin === 'genie-vegetal') return 'jrichard';
  if (v.besoin === 'entretien') return pro ? (est ? 'sauvegrain' : 'jrichard') : (est ? 'sauvegrain-services' : 'goueffon-services');
  if (v.besoin === 'amenagement') return est ? 'sauvegrain' : (pro ? 'jrichard' : (v.profil ? 'hegy' : 'groupe'));
  return 'groupe';
}

export function initDevis() {
  const form = document.querySelector('[data-devis]');
  if (!form) return;
  const etapes = [...form.querySelectorAll('[data-etape]')];
  const cadre = form.querySelector('[data-etapes-cadre]');
  const nav = form.querySelector('[data-devis-nav]');
  const prec = form.querySelector('[data-devis-prec]');
  const suiv = form.querySelector('[data-devis-suiv]');
  const annonce = form.querySelector('[data-devis-annonce]');
  const indic = [...form.querySelectorAll('[data-etapes-indicateur] li')];
  const noms = ['motif', 'profil', 'besoin', 'secteur'];
  form.querySelectorAll('.choix input').forEach((i) => { LIBELLES[i.name + ':' + i.value] = i.nextElementSibling.textContent.trim(); });
  const valeurs = () => Object.fromEntries(noms.map((n) => [n, (form.querySelector(`[name="${n}"]:checked`) || {}).value || '']));
  const presta = new URLSearchParams(location.search).get('presta');
  if (presta) form.querySelector('[name="presta"]').value = presta;

  /* Récapitulatif et destinataire. */
  const recap = () => {
    const v = valeurs();
    noms.forEach((n) => {
      const dd = document.querySelector(`[data-recap-champ="${n}"]`);
      if (!dd) return;
      if (!dd.dataset.vide) dd.dataset.vide = dd.textContent;
      dd.textContent = v[n] ? LIBELLES[n + ':' + v[n]] : dd.dataset.vide;
      dd.classList.toggle('recap-vide', !v[n]);
    });
    const dp = document.querySelector('[data-recap-champ="presta"]'), dt = document.querySelector('[data-recap-presta-titre]');
    if (dp && presta) {
      const t = presta.replace(/-/g, ' ');
      dp.textContent = t.charAt(0).toUpperCase() + t.slice(1);
      dp.hidden = dt.hidden = false;
    }
    const [nom, tel, lien] = SOCIETES[destinataire(v)];
    document.querySelector('[data-destinataire-nom]').textContent = nom;
    document.querySelector('[data-destinataire-detail]').innerHTML = `<a href="tel:${lien}">${tel}</a>`;
    /* Génie végétal : pour les entreprises et les collectivités seulement. */
    const pro = v.profil === 'entreprise' || v.profil === 'collectivite';
    form.querySelectorAll('[data-pour-profil]').forEach((l) => {
      const ok = !v.profil || pro;
      l.hidden = !ok;
      if (!ok) { const i = l.querySelector('input'); if (i.checked) i.checked = false; }
    });
    const candidat = v.motif === 'candidature';
    const lienCand = form.querySelector('[data-motif-candidature]');
    if (lienCand) lienCand.hidden = !candidat;
    if (suiv) suiv.disabled = candidat && courante === 0;
  };

  /* Une étape à la fois. */
  let courante = 0;
  const montrer = (i, focus = true) => {
    const avant = cadre.offsetHeight;
    courante = i;
    etapes.forEach((e, k) => { e.hidden = k !== i; });
    indic.forEach((li, k) => { li.toggleAttribute('aria-current', k === i); li.classList.toggle('fait', k < i); });
    prec.hidden = i === 0;
    suiv.hidden = i === etapes.length - 1;
    annonce.textContent = `Étape ${i + 1} sur ${etapes.length}\u00a0: ${indic[i].textContent.trim()}`;
    recap();
    if (!etat.calme) {
      const apres = cadre.scrollHeight;
      cadre.style.height = avant + 'px';
      requestAnimationFrame(() => { cadre.style.height = apres + 'px'; });
      setTimeout(() => { cadre.style.height = ''; rafraichir(); }, 480);
    } else rafraichir();
    if (focus) { const l = etapes[i].querySelector('legend'); l.setAttribute('tabindex', '-1'); l.focus({ preventScroll: true }); }
  };
  const erreur = (msg) => {
    let p = etapes[courante].querySelector('.champ-erreur');
    if (!p) { p = document.createElement('p'); p.className = 'champ-erreur'; p.setAttribute('aria-live', 'assertive'); etapes[courante].appendChild(p); }
    p.textContent = msg;
  };
  suiv.addEventListener('click', () => {
    const nom = noms[courante];
    if (nom && !form.querySelector(`[name="${nom}"]:checked`)) { erreur('Choisissez une réponse pour continuer.'); return; }
    const p = etapes[courante].querySelector('.champ-erreur'); if (p) p.textContent = '';
    montrer(Math.min(etapes.length - 1, courante + 1));
  });
  prec.addEventListener('click', () => montrer(Math.max(0, courante - 1)));
  form.addEventListener('change', recap);
  /* Un choix fait passe à l'étape suivante (sauf candidature, qui renvoie vers le recrutement). */
  form.querySelectorAll('.choix input').forEach((i) => i.addEventListener('change', () => {
    if (i.name === 'motif' && i.value === 'candidature') return;
    if (noms.indexOf(i.name) === courante) setTimeout(() => montrer(courante + 1), 220);
  }));

  nav.hidden = false;
  /* Première étape sans réponse (choix déjà faits par l'adresse). */
  const v = valeurs();
  const premiere = noms.findIndex((n) => !v[n]);
  montrer(premiere === -1 ? etapes.length - 1 : premiere, false);
}
