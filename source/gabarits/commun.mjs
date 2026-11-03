/* Gabarit commun : head, en-tête, menu, pied de page, barre fixe du téléphone, voile, intro, corde d'altitude.
   Les conventions data-* sont celles que lisent le socle JavaScript et l'audit (voir le README). */
import { html, brut } from '../../outils/gabarit.mjs';
import { arbreIntro } from './arbre.mjs';

const navigation = (c) => c.site.navigation.filter((cle) => c.pages[cle] && (c.pages[cle].langues || c.langues).includes(c.l));
const navigationEntete = (c) => (c.site.navigationEntete || c.site.navigation).filter((cle) => c.pages[cle]);

function tete(c) {
  const p = c.page, cle = p.cle;
  const titre = c.s(`pages.${cle}.titre`), description = c.s(`pages.${cle}.description`);
  const ici = c.abs(c.url(cle));
  const imagePartage = c.abs(`/assets/partage/${p.partage === false ? 'accueil' : cle}-${c.l}.jpg`);
  const structure = c.donnees.structure ? JSON.stringify(c.donnees.structure).replace(/</g, '\\u003c') : '';
  return html`<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${titre}</title>
<meta name="description" content="${description}">
<meta name="robots" content="noindex, nofollow">
<link rel="canonical" href="${ici}">
<style>${brut(c.critique.css)}</style>
<script>${brut(c.critique.js)}</script>
${(c.site.polices || []).map((f) => html`<link rel="preload" href="${f}" as="font" type="font/woff2" crossorigin>\n`)}<link rel="stylesheet" href="${c.asset('css/socle.css')}">
<link rel="stylesheet" href="${c.asset('css/site.css')}">
<link rel="modulepreload" href="${c.asset('js/site.js')}">
<link rel="modulepreload" href="${c.asset('js/socle/index.js')}">
<script src="/assets/vendor/gsap.min.js" defer></script>
<script src="/assets/vendor/ScrollTrigger.min.js" defer></script>
<script src="/assets/vendor/SplitText.min.js" defer></script>
<script type="module" src="${c.asset('js/site.js')}"></script>
<meta name="theme-color" content="${c.site.couleurs.theme || c.site.couleurs.fond}">
<link rel="icon" href="/assets/images/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/assets/images/apple-touch-icon.png">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${c.site.nom}">
<meta property="og:locale" content="fr_FR">
<meta property="og:title" content="${titre}">
<meta property="og:description" content="${description}">
<meta property="og:url" content="${ici}">
<meta property="og:image" content="${imagePartage}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${c.s(`pages.${p.partage === false ? 'accueil' : cle}.partageAlt`)}">
<meta name="twitter:card" content="summary_large_image">
${structure ? html`<script type="application/ld+json">${brut(structure)}</script>` : ''}
</head>`;
}

const logo = (c, clair = true) => html`<img class="logo-embleme" src="/assets/images/${clair ? 'logo-clair' : 'logo'}.svg" alt="" width="44" height="44"><img class="logo-mot" src="/assets/images/${clair ? 'logo-texte-clair' : 'logo-texte'}.png" alt="${c.site.nom}" width="195" height="38">`;

function entete(c) {
  return html`<header data-entete>
  <div class="entete-rangee">
    <a class="entete-logo" href="${c.url('accueil')}" data-libelle="${c.libelle('accueil')}"${c.page.cle === 'accueil' ? brut(' aria-current="page"') : ''}>${logo(c)}</a>
    <nav data-nav aria-label="${c.s('commun.navigation')}">
      <ul>${navigationEntete(c).map((k) => html`<li>${c.lien(k)}</li>`)}</ul>
    </nav>
    <div class="entete-actions">
      <a class="bouton bouton--orange" href="${c.url('contact', 'devis')}" data-libelle="${c.libelle('contact')}">${c.t('commun.actionEntete')}</a>
      <button type="button" data-menu-bouton aria-controls="menu" aria-expanded="false" data-libelle-ouvrir="${c.s('commun.menu')}" data-libelle-fermer="${c.s('commun.fermer')}"><span class="menu-icone" aria-hidden="true"><i></i><i></i></span><span data-libelle-bouton>${c.t('commun.menu')}</span></button>
    </div>
  </div>
</header>
<div id="menu" data-menu role="dialog" aria-modal="true" aria-label="${c.s('commun.menu')}">
  <div class="menu-grille">
    <ul class="menu-liste">${navigation(c).map((k, i) => html`<li style="--i:${i}">${c.lien(k, { classe: 'menu-lien' })}</li>`)}</ul>
    <div class="menu-cote">
      <p class="menu-surtitre">${c.t('commun.menuSites')}</p>
      <ul class="menu-sites">${c.donnees.sites.map((s) => html`<li><span>${s.nom}</span><a href="tel:${s.telephoneLien}">${s.telephone}</a></li>`)}</ul>
      <p><a class="bouton bouton--orange" href="${c.url('contact', 'devis')}" data-libelle="${c.libelle('contact')}">${c.t('commun.actionEntete')}</a></p>
      <p><button type="button" class="lien" data-calme-bascule data-libelle-reduire="${c.s('commun.calmeReduire')}" data-libelle-retablir="${c.s('commun.calmeRetablir')}" data-libelle-systeme="${c.s('commun.calmeSysteme')}"><span data-libelle-bouton>${c.t('commun.calmeReduire')}</span></button></p>
    </div>
  </div>
</div>`;
}

function pied(c) {
  return html`<footer class="pied" id="pied" data-masque-barre>
  <div class="conteneur pied-haut">
    <a class="pied-logo" href="${c.url('accueil')}" data-libelle="${c.libelle('accueil')}">${logo(c)}</a>
    <p class="pied-devise">${c.t('commun.devise')}</p>
  </div>
  <div class="conteneur pied-grille">
    <div class="pied-sites">
      <p class="pied-titre">${c.t('commun.nousTrouver')}</p>
      <ul>${c.donnees.sites.map((s) => html`<li><strong>${s.nom}</strong><span>${s.adresse}, ${s.cp} ${s.ville}</span><a href="tel:${s.telephoneLien}">${s.telephone}</a></li>`)}</ul>
      <p><a href="mailto:${c.site.contact.email}">${c.site.contact.email}</a></p>
    </div>
    <nav aria-label="${c.s('commun.sommaire')}">
      <p class="pied-titre">${c.t('commun.sommaire')}</p>
      <ul>${navigation(c).map((k) => html`<li>${c.lien(k)}</li>`)}</ul>
    </nav>
    <div>
      <p class="pied-titre">${c.t('commun.suivre')}</p>
      <ul>${c.site.reseaux.map((r) => html`<li><a href="${r.url}" target="_blank" rel="noopener">${r.nom}<span class="visuellement-cache"> ${c.t('commun.nouvelOnglet')}</span></a></li>`)}</ul>
    </div>
    <div>
      <p class="pied-titre">${c.t('commun.confort')}</p>
      <ul>
        <li><button type="button" class="lien" data-calme-bascule data-libelle-reduire="${c.s('commun.calmeReduire')}" data-libelle-retablir="${c.s('commun.calmeRetablir')}" data-libelle-systeme="${c.s('commun.calmeSysteme')}"><span data-libelle-bouton>${c.t('commun.calmeReduire')}</span></button></li>
        <li><a href="#haut" data-sans-transition>${c.t('commun.retourHaut')}</a></li>
        <li>${c.lien('mentions-legales')}</li>
        <li>${c.lien('confidentialite')}</li>
      </ul>
    </div>
  </div>
  <div class="conteneur pied-bas"><p>${c.t('commun.maquette')}</p><p>© ${c.site.nom}</p></div>
</footer>`;
}

function barre(c) {
  return html`<div data-barre-fixe>
  <a class="bouton bouton--contour" href="tel:${c.site.contact.telephoneLien}">${c.t('commun.appeler')}</a>
  <a class="bouton bouton--orange" href="${c.url('contact', 'devis')}" data-libelle="${c.libelle('contact')}">${c.t('commun.actionCourte')}</a>
</div>`;
}

/* Voile de transition : vert mousse, bords festonnés de feuilles (dessinés en CSS). */
function voile(c) {
  return html`<div data-voile aria-hidden="true"><div class="voile-contenu"><img src="/assets/images/logo-clair.svg" alt="" width="56" height="56"><span data-voile-libelle>${c.libelle(c.page.cle)}</span></div></div>`;
}

/* Intro : une graine tombe, germe, l'arbre pousse ; le feuillage s'écarte sur la page. */
function ouverture(c) {
  const a = arbreIntro();
  return html`<div class="ouverture-panneau" data-ouverture data-gouttiere="${c.site.couleurs.ouverture}" aria-hidden="true">
  <div class="intro-fond"></div>
  <div class="intro-logo"><img src="/assets/images/logo-texte-clair.png" alt="" width="195" height="38"></div>
  <div class="intro-sol"></div>
  <svg class="intro-scene" viewBox="0 0 600 640" preserveAspectRatio="xMidYMax meet">
    <g class="intro-racines" fill="none" stroke="#8a6f4d" stroke-linecap="round">${brut(a.racines)}</g>
    <g class="intro-branches" fill="none" stroke="#6b5640" stroke-linecap="round">${brut(a.branches)}</g>
    <g class="intro-feuilles">${brut(a.feuilles)}</g>
    <text class="intro-date" x="318" y="600">${c.t('commun.introDate')}</text>
    <circle class="intro-graine" cx="300" cy="330" r="9" fill="#ED661A"/>
  </svg>
</div>`;
}

/* Corde d'altitude : sommaire de lecture sur grand écran, barre fine en haut sur petit écran. */
function corde(c) {
  if (c.page.sansCorde) return '';
  return html`<nav class="corde" data-corde aria-label="${c.s('commun.corde')}" data-audit-ignorer>
  <span class="corde-fil" aria-hidden="true"></span>
  <span class="corde-mousqueton" aria-hidden="true"><svg viewBox="0 0 20 32"><path d="M10 2a6 6 0 0 1 6 6v14a8 8 0 0 1-16 0V8a6 6 0 0 1 6-6Z" fill="none" stroke="currentColor" stroke-width="3"/></svg></span>
  <ol class="corde-reperes"></ol>
  <span class="corde-altitude" aria-hidden="true">0 m</span>
</nav>
<div class="barre-altitude" data-barre-lecture aria-hidden="true"></div>`;
}

export function page(c, contenu) {
  return html`<!doctype html>
<html lang="${c.l}" data-v="${c.v}" data-gabarit="${c.page.gabarit || c.page.cle}"${c.site.curseur ? brut(' data-curseur') : ''} data-curseur-voir="${c.s('commun.curseurVoir')}">
${tete(c)}
<body id="haut">
${voile(c)}
${ouverture(c)}
<a class="evitement" href="#contenu">${c.t('commun.evitement')}</a>
${entete(c)}
${corde(c)}
<main id="contenu" tabindex="-1"${c.page.sansAction ? brut(' data-sans-action') : ''}>
${contenu}
</main>
${pied(c)}
${barre(c)}
<script type="application/json" id="donnees-sites">${brut(JSON.stringify(c.donnees.sites.map((s) => ({ cle: s.cle, nom: s.nom, horaires: s.horaires, aConfirmer: s.aConfirmer }))))}</script>
</body>
</html>`;
}
