/* Aménagement paysager : de l'étude à la réception, prestations filtrées par profil, conception 3D, réalisations. */
import { html } from '../../outils/gabarit.mjs';
import { tete, chapitre, cartes, faq, cime, choixProfil, logo, imageExiste, dessin, decorPlan } from '../gabarits/blocs.mjs';

export const page = { cle: 'amenagement', fichier: 'amenagement-paysager', imagePartage: 'photos/lavoir-pas-japonais-1280.webp' };

const ETAPES = ['rdv', 'plans', 'showroom', 'devis', 'conducteur', 'plantations', 'reception'];

export default (c) => {
  const reals = c.donnees.realisations.filter((r) => r.fiche && r.metier === 'amenagement' && r.images.length).slice(0, 3);
  return html`
${tete(c, {
    variante: 'plan', visuel: decorPlan(),
    image: 'photos/lavoir-pas-japonais', alt: c.s('amenagement.tete.alt'), cadrage: '45% 60%', cadrageMobile: '58% 76%',
    surtitre: c.t('amenagement.tete.surtitre'), lignes: [c.tb('amenagement.tete.ligne1'), c.tb('amenagement.tete.ligne2')],
    intro: c.t('amenagement.tete.intro'), profils: true,
    actions: c.lien('contact', { ancre: 'devis', params: 'motif=devis&besoin=amenagement', classe: 'bouton bouton--orange', texte: c.t('amenagement.tete.action'), attrs: 'data-action-principale' }),
    info: html`<span class="pastille" aria-hidden="true"></span>${c.t('commun.devisGratuit')}`,
  })}

<section class="s-humus bloc-y" id="deroule" data-strate="Racines">
  <div class="conteneur">
    ${chapitre(c, { surtitre: c.t('amenagement.deroule.surtitre'), titre: c.tb('amenagement.deroule.titre'), chapeau: c.t('amenagement.deroule.chapeau') })}
    <ol class="taille-etapes" style="grid-template-columns:repeat(auto-fill,minmax(min(100%,260px),1fr));display:grid" data-deroule>
      ${ETAPES.map((e, i) => html`<li data-anime><div class="deroule-tete"><div class="etape-dessin" data-visuel aria-hidden="true">${dessin(['feuille', 'pousse', 'rameau', 'hauban', 'soleil', 'erable', 'nid'][i % 7])}</div><p class="strate-numero">0${i + 1}</p></div><h3>${c.t(`amenagement.deroule.${e}.titre`)}</h3><p>${c.t(`amenagement.deroule.${e}.texte`)}</p></li>`)}
    </ol>
  </div>
</section>

<section class="s-creme bloc-y" id="prestations" data-strate="Tronc">
  <div class="conteneur">
    ${chapitre(c, { surtitre: c.t('amenagement.prestations.surtitre'), titre: c.tb('amenagement.prestations.titre'), chapeau: c.t('amenagement.prestations.chapeau') })}
    <div class="filtres">${choixProfil(c, { nom: 'profil-prestations', legende: c.t('commun.afficherPour') })}<p class="filtres-compte" data-filtre-compte aria-live="polite"></p></div>
    ${cartes(c, c.donnees.metiers.amenagement, { lienDevis: 'amenagement' })}
  </div>
</section>

<section class="s-mousse bloc-y" id="conception" data-strate="Houppier">
  <div class="conteneur duo">
    <div class="duo-texte">
      <p class="surtitre" data-anime>${c.t('amenagement.conception.surtitre')}</p>
      <h2 class="titre-2" data-titre-decoupe>${c.tb('amenagement.conception.titre')}</h2>
      <p data-anime>${c.t('amenagement.conception.texte')}</p>
      <ul class="liste-points" data-anime>${['l1', 'l2', 'l3', 'l4'].map((l) => html`<li>${c.t(`amenagement.conception.${l}`)}</li>`)}</ul>
      <p class="interlocuteur" data-anime><span><small>${c.t('commun.interlocuteur')}</small><b>${c.t('amenagement.conception.contactNom')}</b><span>${c.t('amenagement.conception.contactRole')}</span></span></p>
    </div>
    ${c.media({ nom: 'photos/conception-3d', alt: c.s('amenagement.conception.alt'), sizes: '(max-width: 860px) 100vw, 50vw', legende: c.s('amenagement.conception.legende') })}
  </div>
</section>

<section class="s-sauge bloc-y" id="realisations" data-strate="Houppier">
  <div class="conteneur">
    ${chapitre(c, { surtitre: c.t('amenagement.realisations.surtitre'), titre: c.tb('amenagement.realisations.titre') })}
    <ul class="fil">${reals.map((r) => html`<li><a class="fil-carte" href="${c.url('realisation-' + r.cle)}" data-libelle="${r.titre}">${c.media({ nom: r.images[0].nom, alt: r.images[0].alt, sizes: '(max-width: 700px) 100vw, 33vw' })}<h3>${r.titre}</h3><p class="doux" style="margin:0">${r.lieu}</p></a></li>`)}</ul>
    <p class="grand-espace">${c.lien('realisations', { params: 'metier=amenagement', classe: 'lien-fleche', texte: c.t('amenagement.realisations.tout') })}</p>
  </div>
</section>

<section class="s-creme bloc-y" id="qualifications" data-strate="Cime">
  <div class="conteneur colonnes-2">
    <div>
      <p class="surtitre" data-anime>${c.t('amenagement.qualif.surtitre')}</p>
      <h2 class="titre-2" data-titre-decoupe>${c.tb('amenagement.qualif.titre')}</h2>
      <div class="plaque plaque--large" data-visuel>${logo(c, 'qualipaysage', 'QualiPaysage', { hauteur: 64 })}</div>
      <ul class="liste-points" style="margin-top:18px">${['q1', 'q2', 'q3', 'q4'].map((q) => html`<li>${c.t(`amenagement.qualif.${q}`)}</li>`)}</ul>
    </div>
    <div>
      <p class="surtitre" data-anime>${c.t('commun.questions')}</p>
      ${faq(c, c.donnees.faq.amenagement)}
    </div>
  </div>
</section>

${cime(c, { titre: c.tb('amenagement.cime.titre'), texte: c.t('amenagement.cime.texte'),
    actions: html`${c.lien('contact', { ancre: 'devis', params: 'motif=rdv&besoin=amenagement', classe: 'bouton bouton--orange', texte: c.t('commun.prendreRdv') })}${c.lien('contact', { ancre: 'devis', params: 'motif=devis&besoin=amenagement', classe: 'bouton bouton--contour', texte: c.t('commun.actionEntete') })}` })}
`;
};
