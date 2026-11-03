/* Entretien et jardinage : contrats pour les pros, gestion écologique, jardinage à domicile avec crédit d'impôt. */
import { html } from '../../outils/gabarit.mjs';
import { tete, chapitre, cartes, faq, cime, choixProfil, mediaOu, logo, dessin } from '../gabarits/blocs.mjs';

export const page = { cle: 'entretien', fichier: 'entretien-jardinage', imagePartage: 'photos/tonte-chamerolles-1280.webp' };

const SAISONS = ['printemps', 'ete', 'automne', 'hiver'];

export default (c) => html`
${tete(c, {
    image: 'photos/tonte-chamerolles', alt: c.s('entretien.tete.alt'), cadrage: '40% 60%', cadrageMobile: '30% 60%',
    surtitre: c.t('entretien.tete.surtitre'), lignes: [c.tb('entretien.tete.ligne1'), c.tb('entretien.tete.ligne2')],
    intro: c.t('entretien.tete.intro'), profils: true,
    actions: c.lien('contact', { ancre: 'devis', params: 'motif=devis&besoin=entretien', classe: 'bouton bouton--orange', texte: c.t('entretien.tete.action'), attrs: 'data-action-principale' }),
    info: html`<span class="pastille" aria-hidden="true"></span>${c.t('entretien.tete.info')}`,
  })}

<section class="s-humus bloc-y" id="zero-phyto" data-strate="Racines">
  <div class="conteneur duo">
    <div class="duo-texte">
      <p class="surtitre" data-anime>${c.t('entretien.phyto.surtitre')}</p>
      <h2 class="titre-2" data-titre-decoupe>${c.tb('entretien.phyto.titre')}</h2>
      <p data-anime>${c.t('entretien.phyto.texte')}</p>
      <ul class="liste-points" data-anime>${['l1', 'l2', 'l3'].map((l) => html`<li>${c.t(`entretien.phyto.${l}`)}</li>`)}</ul>
    </div>
    ${c.media({ nom: 'photos/mesange-nichoir', alt: c.s('entretien.phyto.alt'), sizes: '(max-width: 860px) 100vw, 50vw' })}
  </div>
</section>

<section class="s-creme bloc-y" id="prestations" data-strate="Tronc">
  <div class="conteneur">
    ${chapitre(c, { surtitre: c.t('entretien.prestations.surtitre'), titre: c.tb('entretien.prestations.titre'), chapeau: c.t('entretien.prestations.chapeau') })}
    <div class="filtres">${choixProfil(c, { nom: 'profil-prestations', legende: c.t('commun.afficherPour') })}<p class="filtres-compte" data-filtre-compte aria-live="polite"></p></div>
    ${cartes(c, c.donnees.metiers.entretien, { lienDevis: 'entretien' })}
  </div>
</section>

<section class="s-sauge bloc-y" id="saisons" data-strate="Tronc">
  <div class="conteneur">
    ${chapitre(c, { surtitre: c.t('entretien.saisons.surtitre'), titre: c.tb('entretien.saisons.titre'), chapeau: c.t('entretien.saisons.chapeau') })}
    <ol class="grille-cartes grille-saisons" style="list-style:none;margin:0;padding:0" data-saisons>
      ${SAISONS.map((s) => html`<li class="carte-presta" data-saison="${s}">
        ${mediaOu(c, { nom: `grok/saison-${s}`, alt: c.s(`entretien.saisons.${s}.alt`), sizes: '(max-width: 700px) 100vw, 25vw' }, html`<div class="carte-dessin" aria-hidden="true" data-saison-dessin="${s}">${dessin({ printemps: 'pousse', ete: 'soleil', automne: 'erable', hiver: 'rameau' }[s])}</div>`)}
        <div class="carte-presta-corps"><h3>${c.t(`entretien.saisons.${s}.titre`)}</h3><p>${c.t(`entretien.saisons.${s}.texte`)}</p></div>
      </li>`)}
    </ol>
  </div>
</section>

<section class="s-mousse bloc-y" id="jardinage-a-domicile" data-strate="Houppier">
  <div class="conteneur">
    ${chapitre(c, { surtitre: c.t('entretien.sap.surtitre'), titre: c.tb('entretien.sap.titre'), chapeau: c.t('entretien.sap.chapeau') })}
    <div class="duo" style="align-items:start">
      <div class="duo-texte">
        <ul class="puces-ligne">${c.donnees.metiers.sap.map((s) => html`<li>${s}</li>`)}</ul>
        <div class="colonnes-2" style="margin-top:12px">
          ${['goueffon-services', 'sauvegrain-services'].map((k) => {
            const s = c.donnees.societes.find((x) => x.cle === k);
            return html`<article class="societe" style="--couleur:${s.couleur}">${logo(c, s.logo.replace('logos/', ''), s.nom, { hauteur: 46 })}<p>${s.metier}</p><p><a href="tel:${s.telephoneLien}">${s.telephone}</a></p></article>`;
          })}
        </div>
        <p class="doux">${c.t('entretien.sap.mentions')} <span class="a-completer">${c.t('entretien.sap.numero')}</span></p>
      </div>
      ${c.media({ nom: 'photos/jardiniers-domicile', alt: c.s('entretien.sap.alt'), sizes: '(max-width: 860px) 100vw, 50vw' })}
    </div>
  </div>
</section>

<section class="s-mousse" id="credit-impot" data-strate="Houppier" style="padding-bottom:var(--section-y)">
  <div class="conteneur">
    <form class="simulateur s-creme" data-simulateur onsubmit="return false">
      <div>
        <p class="surtitre" style="color:var(--doux)">${c.t('entretien.simu.surtitre')}</p>
        <h2 class="titre-3" style="margin:0 0 14px">${c.t('entretien.simu.titre')}</h2>
        <label for="simu-depense">${c.t('entretien.simu.label')}</label>
        <input id="simu-depense" type="range" min="0" max="6000" step="50" value="1200" data-simu-depense aria-describedby="simu-aide">
        <output for="simu-depense" data-simu-affiche data-prix>1 200 €</output>
        <p id="simu-aide" class="doux" style="margin:8px 0 0;font-size:.92rem">${c.t('entretien.simu.aide')}</p>
      </div>
      <div class="simu-tiges" aria-live="polite" data-visuel>
        <div class="simu-tige"><div class="barre" data-simu-barre-credit></div><p>${c.t('entretien.simu.credit')}<strong data-simu-credit data-prix>600 €</strong></p></div>
        <div class="simu-tige simu-tige--reste"><div class="barre" data-simu-barre-reste></div><p>${c.t('entretien.simu.reste')}<strong data-simu-reste data-prix>600 €</strong></p></div>
      </div>
      <p class="texte-illustratif">${c.t('entretien.simu.illustratif')}</p>
    </form>
    <div class="colonnes-2 grand-espace">
      <div><p class="surtitre">${c.t('commun.questions')}</p><h2 class="titre-3" style="margin-top:0">${c.t('entretien.faqTitre')}</h2></div>
      ${faq(c, c.donnees.faq.credit)}
    </div>
  </div>
</section>

${cime(c, { titre: c.tb('entretien.cime.titre'), texte: c.t('entretien.cime.texte'),
    actions: html`${c.lien('contact', { ancre: 'devis', params: 'motif=devis&besoin=entretien&profil=particulier', classe: 'bouton bouton--orange', texte: c.t('entretien.cime.particulier') })}${c.lien('contact', { ancre: 'devis', params: 'motif=devis&besoin=entretien&profil=entreprise', classe: 'bouton bouton--contour', texte: c.t('entretien.cime.pro') })}` })}
`;
