/* Réalisations : grille filtrable par profil et par métier (filtres gardés dans l'adresse), fiches détaillées. */
import { html } from '../../outils/gabarit.mjs';
import { tete, chapitre, cime, murPhotos } from '../gabarits/blocs.mjs';

export const page = { cle: 'realisations', fichier: 'realisations', imagePartage: 'photos/parc-spirale-aerien-1280.webp' };

const PROFILS = ['particulier', 'entreprise', 'collectivite'];
const METIERS = ['amenagement', 'entretien', 'genie-vegetal'];

export default (c) => {
  const reals = c.donnees.realisations.filter((r) => r.images.length);
  return html`
${tete(c, {
    variante: 'mur', visuel: murPhotos(reals.flatMap((r) => r.images.map((im) => im.nom))),
    image: 'photos/parc-spirale-aerien', alt: c.s('realisations.tete.alt'), cadrage: '62% 55%',
    surtitre: c.t('realisations.tete.surtitre'), lignes: [c.tb('realisations.tete.ligne1'), c.tb('realisations.tete.ligne2')],
    intro: c.t('realisations.tete.intro'),
    actions: html`<a class="bouton bouton--orange" href="#liste" data-action-principale>${c.t('realisations.tete.action')}</a>`,
    info: html`<span class="pastille" aria-hidden="true"></span>${c.t('realisations.tete.info', { n: reals.length })}`,
  })}

<section class="s-creme bloc-y" id="liste" data-strate="Tronc">
  <div class="conteneur">
    ${chapitre(c, { surtitre: c.t('realisations.liste.surtitre'), titre: c.tb('realisations.liste.titre'), chapeau: c.t('realisations.liste.chapeau') })}
    <form class="filtres" data-filtres-reals onsubmit="return false">
      <fieldset class="filtres-groupe"><legend>${c.t('realisations.filtres.profil')}</legend>
        <label><input type="radio" name="profil" value="" checked><span>${c.t('commun.tous')}</span></label>
        ${PROFILS.map((p) => html`<label><input type="radio" name="profil" value="${p}"><span>${c.t(`commun.profilsCourts.${p}`)}</span></label>`)}
      </fieldset>
      <fieldset class="filtres-groupe"><legend>${c.t('realisations.filtres.metier')}</legend>
        <label><input type="radio" name="metier" value="" checked><span>${c.t('commun.tous')}</span></label>
        ${METIERS.map((m) => html`<label><input type="radio" name="metier" value="${m}"><span>${c.t(`commun.metiers.${m}`)}</span></label>`)}
      </fieldset>
      <p class="filtres-compte" data-filtre-compte aria-live="polite"></p>
    </form>
    <p class="note-maquette"><span class="a-completer">${c.t('commun.aCompleter')}</span> ${c.t('realisations.note')}</p>
    <ul class="fil" data-reals>
      ${reals.map((r) => html`<li data-profil="${r.profil}" data-metier="${r.metier}">
        ${r.fiche ? html`<a class="fil-carte" href="${c.url('realisation-' + r.cle)}" data-libelle="${r.titre}" data-incline>` : html`<div class="fil-carte">`}
          ${c.media({ nom: r.images[0].nom, alt: r.images[0].alt, sizes: '(max-width: 700px) 100vw, 33vw' })}
          <p class="meta-article" style="margin:0">${c.t(`commun.profilsCourts.${r.profil}`)} · ${c.t(`commun.metiers.${r.metier}`)}</p>
          <h3>${r.titre}</h3>
          ${r.lieu ? html`<p class="doux" style="margin:0">${r.lieu}</p>` : ''}
          ${r.fiche ? html`<span class="lien-fleche">${c.t('commun.voirRealisation')}</span>` : ''}
        ${r.fiche ? html`</a>` : html`</div>`}
      </li>`)}
    </ul>
    <p class="filtre-vide" data-filtre-vide hidden>${c.t('commun.filtreVide')}</p>
  </div>
</section>

${cime(c, { titre: c.tb('realisations.cime.titre'), texte: c.t('realisations.cime.texte'),
    actions: html`${c.lien('contact', { ancre: 'devis', params: 'motif=devis', classe: 'bouton bouton--orange', texte: c.t('commun.actionEntete') })}${c.lien('contact', { ancre: 'devis', params: 'motif=rdv', classe: 'bouton bouton--contour', texte: c.t('commun.prendreRdv') })}` })}
`;
};
