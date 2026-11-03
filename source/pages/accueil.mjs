/* Accueil : du sol à la cime. Ouverture, métiers en strates, réalisations, méthode, preuves, avis,
   sites sur la carte de la Loire, le groupe, le recrutement, puis l'appel final sous le ciel. */
import { html } from '../../outils/gabarit.mjs';
import { tete, chapitre, cime, logo, mediaOu } from '../gabarits/blocs.mjs';
import { carteLoiret, listeSites } from '../gabarits/carte.mjs';

export const page = { cle: 'accueil', fichier: 'index', imagePartage: 'photos/charpenterie-pergola-1280.webp' };

const STRATES = [
  { cle: 'genie-vegetal', page: 'genie-vegetal', image: 'photos/riviere-restauree', cadrage: '50% 55%', altitude: '0 m', presta: 'genie' },
  { cle: 'amenagement', page: 'amenagement', image: 'photos/saint-hilaire-plantations', cadrage: '50% 50%', altitude: '2 m', presta: 'amenagement' },
  { cle: 'entretien', page: 'entretien', image: 'photos/taille-haie-charmes', cadrage: '18% 60%', altitude: '8 m', presta: 'entretien' },
  { cle: 'elagage', page: 'elagage', image: 'photos/grimpeur-chene', cadrage: '78% 35%', altitude: '25 m', presta: 'elagage' },
];

export default (c) => {
  const m = c.donnees.metiers;
  const reals = c.donnees.realisations.filter((r) => r.fiche && r.images.length);
  return html`
${tete(c, {
    page: false, image: 'photos/charpenterie-pergola', alt: c.s('accueil.tete.alt'), cadrage: '58% 62%', cadrageMobile: '58% 60%',
    surtitre: c.t('accueil.tete.surtitre'),
    lignes: [c.tb('accueil.tete.ligne1'), c.tb('accueil.tete.ligne2')],
    intro: c.t('accueil.tete.intro'), profils: true,
    actions: html`${c.lien('contact', { ancre: 'devis', params: 'motif=devis', classe: 'bouton bouton--orange', texte: c.t('commun.actionEntete'), attrs: 'data-action-principale data-magnetique' })}<a class="bouton bouton--contour" href="tel:${c.site.contact.telephoneLien}">${c.t('commun.appeler')} ${c.site.contact.telephone}</a>`,
    info: html`<span class="pastille" aria-hidden="true"></span><span data-statut-site="orleans" data-statut-court>${c.t('accueil.tete.info')}</span>`,
  })}

<section class="strates s-terre" id="metiers" data-strate="Racines" data-strates aria-labelledby="metiers-titre">
  <div class="conteneur strates-intro bloc-y" data-strates-intro>
    ${chapitre(c, { surtitre: c.t('accueil.metiers.surtitre'), titre: c.tb('accueil.metiers.titre'), chapeau: c.t('accueil.metiers.chapeau') })}
  </div>
  <h2 id="metiers-titre" class="visuellement-cache">${c.t('accueil.metiers.titreCache')}</h2>
  <div class="strates-scene" data-strates-scene data-entete-cache>
    ${STRATES.map((s, i) => html`<article class="strate conteneur" data-strate-panneau="${i}" id="strate-${s.cle}">
      <div class="strate-texte">
        <p class="strate-numero">0${i + 1} <b>${c.t(`accueil.metiers.${s.cle}.niveau`)} · ${s.altitude}</b></p>
        <h3>${c.t(`accueil.metiers.${s.cle}.titre`)}</h3>
        <p>${c.t(`accueil.metiers.${s.cle}.texte`)}</p>
        <ul class="strate-prestations" data-filtre-profil>${(m[s.presta] || []).slice(0, 7).map((p) => html`<li data-profils="${(p.profils || ['particulier', 'entreprise', 'collectivite']).join(' ')}">${c.lien(s.page, { ancre: p.cle, texte: p.titre })}</li>`)}</ul>
        <p>${c.lien(s.page, { classe: 'lien-fleche', texte: c.t(`accueil.metiers.${s.cle}.lien`) })}</p>
      </div>
      ${c.media({ nom: s.image, alt: c.s(`accueil.metiers.${s.cle}.alt`), cadrage: s.cadrage, classe: 'strate-media', sizes: '(max-width: 860px) 100vw, 55vw' })}
    </article>`)}
    <div class="strates-jauge" aria-hidden="true">${STRATES.map(() => html`<span><i></i></span>`)}</div>
    <div class="strates-altitude" aria-hidden="true" data-audit-ignorer><div class="strates-altitude-piste">${STRATES.map((s) => html`<span>${s.altitude}</span>`)}</div></div>
  </div>
</section>

<section class="galerie ecran epingle s-humus" id="realisations" data-strate="Tronc" data-galerie-section data-plein-ecran data-entete-cache>
  <div class="conteneur galerie-tete">
    <div><p class="surtitre">${c.t('accueil.realisations.surtitre')}</p><h2 class="titre-2">${c.tb('accueil.realisations.titre')}</h2></div>
    <p class="actions"><span class="glisser">${c.t('commun.glisser')}</span>${c.lien('realisations', { classe: 'lien-fleche', texte: c.t('accueil.realisations.tout') })}</p>
  </div>
  <div class="galerie-piste piste" data-galerie tabindex="0" role="region" aria-label="${c.s('accueil.realisations.region')}">
    ${reals.map((r) => html`<a class="galerie-carte" href="${c.url('realisation-' + r.cle)}" data-libelle="${r.titre}">
      ${c.media({ nom: r.images[0].nom, alt: r.images[0].alt, cadrage: r.images[0].cadrage, sizes: '(max-width: 760px) 78vw, 32vw', classe: 'galerie-media' })}
      <h3>${r.titre}</h3>
      <p>${r.lieu}${r.annee ? ` · ${r.annee}` : ''}</p>
    </a>`)}
  </div>
  <div class="galerie-progres" aria-hidden="true"><span></span></div>
</section>

<section class="s-mousse bloc-y" id="methode" data-strate="Tronc">
  <div class="conteneur">
    ${chapitre(c, { surtitre: c.t('accueil.methode.surtitre'), titre: c.tb('accueil.methode.titre'), chapeau: c.t('accueil.methode.chapeau') })}
    <ol class="methode-etapes" data-methode>
      <svg class="methode-tige" viewBox="0 0 1000 60" preserveAspectRatio="none" aria-hidden="true"><path d="M28 28 C 200 -10, 300 60, 500 28 S 800 -6, 980 28" fill="none" stroke="#669B2E" stroke-width="2.5" stroke-linecap="round" vector-effect="non-scaling-stroke" pathLength="1" data-tige-chemin/></svg>
      ${['etude', 'travaux', 'entretien'].map((e, i) => html`<li data-anime>
        ${c.media({ nom: ['grok/plan-mains', 'photos/pose-paves-chateau', 'photos/taille-hortensias'][i], alt: c.s(`accueil.methode.${e}.alt`), sizes: '(max-width: 860px) 100vw, 30vw' })}
        <h3 class="titre-3">${c.t(`accueil.methode.${e}.titre`)}</h3>
        <p>${c.t(`accueil.methode.${e}.texte`)}</p>
      </li>`)}
    </ol>
    <ul class="promesses">${['p1', 'p2', 'p3'].map((p) => html`<li data-anime>${c.t(`accueil.methode.${p}`)}</li>`)}</ul>
  </div>
</section>

<section class="s-sauge bloc-y" id="preuves" data-strate="Houppier">
  <div class="conteneur">
    ${chapitre(c, { surtitre: c.t('accueil.preuves.surtitre'), titre: c.tb('accueil.preuves.titre'), chapeau: c.t('accueil.preuves.chapeau') })}
    <ul class="chiffres-grille">${c.donnees.chiffres.map((x) => html`<li class="chiffre-bloc" data-anime><span class="tige" aria-hidden="true" data-tige></span><span class="chiffre-valeur">${x.cle === 'ca' ? html`<span class="chiffre-prefixe">${c.t('commun.plusDe')}</span>` : ''}<span data-compteur="${x.valeur}">${x.valeur}</span>${x.suffixe}</span><span class="chiffre-libelle">${x.libelle}</span></li>`)}</ul>
    <div class="labels">${c.donnees.labels.map((l) => html`<article class="label" data-anime><div class="plaque" data-visuel>${logo(c, l.logo.replace('logos/', ''), l.nom, { hauteur: 60 })}</div><h3>${l.nom}</h3><p>${l.texte}</p></article>`)}</div>
    <div class="references">
      <div class="references-titre"><p>${c.t('accueil.preuves.references')}</p><button type="button" class="bouton-pause" data-pause-pour="ruban-references" data-libelle-pause="${c.s('commun.pause')}" data-libelle-lecture="${c.s('commun.lecture')}"><span data-libelle-bouton>${c.t('commun.pause')}</span></button></div>
      <div class="ruban" id="ruban-references" data-boucle-css data-ruban role="region" aria-label="${c.s('accueil.preuves.references')}">
        <div class="ruban-piste">${[0, 1].map((n) => c.donnees.references.map((r) => logo(c, r.cle, n ? '' : r.nom, { hauteur: 52 })))}</div>
      </div>
    </div>
  </div>
</section>

<section class="avis s-terre bloc-y" id="avis" data-strate="Houppier">
  ${mediaOu(c, { nom: 'grok/feuillage-flou', alt: '', classe: 'avis-fond', sizes: '100vw' }, '')}
  <div class="conteneur">
    <div class="galerie-tete">
      <div><p class="surtitre">${c.t('accueil.avis.surtitre')}</p><h2 class="titre-2">${c.tb('accueil.avis.titre')}</h2></div>
      <div class="avis-nav"><button type="button" data-avis-prec aria-label="${c.s('commun.precedent')}">←</button><button type="button" data-avis-suiv aria-label="${c.s('commun.suivant')}">→</button></div>
    </div>
    <ul class="avis-liste" data-avis tabindex="0" aria-label="${c.s('accueil.avis.region')}">
      ${c.donnees.avis.map((a) => html`<li class="avis-carte"><figure style="margin:0;display:grid;gap:18px"><blockquote>${a.texte}</blockquote><figcaption>${a.auteur || c.t('accueil.avis.anonyme')}</figcaption></figure></li>`)}
    </ul>
    <p class="doux" style="margin-top:18px">${c.t('accueil.avis.source')}</p>
  </div>
</section>

<section class="s-creme bloc-y" id="sites" data-strate="Houppier">
  <div class="conteneur">
    ${chapitre(c, { surtitre: c.t('accueil.sites.surtitre'), titre: c.tb('accueil.sites.titre'), chapeau: c.t('accueil.sites.chapeau') })}
    <div class="sites" data-sites>
      ${carteLoiret(c)}
      ${listeSites(c)}
    </div>
  </div>
</section>

<section class="s-sauge bloc-y" id="groupe" data-strate="Cime">
  <div class="conteneur duo">
    ${c.media({ nom: 'photos/equipe-groupe', alt: c.s('accueil.groupe.alt'), sizes: '(max-width: 860px) 100vw, 50vw', cadrage: '50% 30%' })}
    <div class="duo-texte">
      <p class="surtitre" data-anime>${c.t('accueil.groupe.surtitre')}</p>
      <h2 class="titre-2" data-titre-decoupe>${c.tb('accueil.groupe.titre')}</h2>
      <p data-anime>${c.t('accueil.groupe.texte')}</p>
      <ul class="puces-ligne" data-anime>${c.donnees.societes.map((s) => html`<li>${s.nom}</li>`)}</ul>
      <p data-anime>${c.lien('groupe', { classe: 'lien-fleche', texte: c.t('accueil.groupe.lien') })}</p>
    </div>
  </div>
</section>

<section class="s-creme bloc-y" id="recrutement" data-strate="Cime">
  <div class="conteneur duo duo--inverse">
    ${c.media({ nom: 'photos/apprentis-tuteurs', alt: c.s('accueil.recrutement.alt'), sizes: '(max-width: 860px) 100vw, 50vw', cadrage: '55% 25%' })}
    <div class="duo-texte">
      <p class="surtitre" data-anime>${c.t('accueil.recrutement.surtitre')}</p>
      <h2 class="titre-2" data-titre-decoupe>${c.tb('accueil.recrutement.titre')}</h2>
      <p data-anime>${c.t('accueil.recrutement.texte')}</p>
      <ul class="puces-ligne" data-anime>${c.donnees.postes.map((p) => html`<li>${p.titre}</li>`)}</ul>
      <p class="actions" data-anime>${c.lien('recrutement', { classe: 'bouton bouton--orange', texte: c.t('accueil.recrutement.lien') })}${c.lien('recrutement', { ancre: 'candidature', classe: 'lien-fleche', texte: c.t('accueil.recrutement.spontanee') })}</p>
    </div>
  </div>
</section>

${cime(c, {
    titre: c.tb('accueil.cime.titre'), texte: c.t('accueil.cime.texte'),
    actions: html`${['amenagement', 'entretien', 'elagage'].map((b) => c.lien('contact', { ancre: 'devis', params: `motif=devis&besoin=${b}`, classe: b === 'amenagement' ? 'bouton bouton--orange' : 'bouton bouton--contour', texte: c.t(`accueil.cime.${b}`) }))}`,
  })}
`;
};
