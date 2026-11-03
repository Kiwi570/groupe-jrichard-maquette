/* Contact : demande de devis ou de rendez-vous en 5 étapes, récapitulatif en direct et aiguillage vers la bonne société,
   puis les trois sites (horaires, statut, carte). */
import { html, brut } from '../../outils/gabarit.mjs';
import { tete, chapitre, logo, plante } from '../gabarits/blocs.mjs';
import { carteLoiret, listeSites } from '../gabarits/carte.mjs';

export const page = { cle: 'contact', fichier: 'contact', imagePartage: 'photos/allee-massifs-1280.webp' };

const ETAPES = [
  { nom: 'motif', choix: ['devis', 'rdv', 'renseignements', 'fournisseur', 'candidature'] },
  { nom: 'profil', choix: ['particulier', 'entreprise', 'collectivite'] },
  { nom: 'besoin', choix: ['amenagement', 'entretien', 'elagage', 'genie-vegetal', 'bois', 'autre'] },
  { nom: 'secteur', choix: ['metropole', 'ouest', 'est', 'autre'] },
];

export default (c) => html`
${tete(c, {
    image: 'photos/allee-massifs', alt: c.s('contact.tete.alt'), cadrage: '50% 60%',
    surtitre: c.t('contact.tete.surtitre'), lignes: [c.tb('contact.tete.ligne1'), c.tb('contact.tete.ligne2')],
    intro: c.t('contact.tete.intro'),
    actions: html`<a class="bouton bouton--orange" href="#devis" data-action-principale>${c.t('contact.tete.action')}</a><a class="bouton bouton--contour" href="tel:${c.site.contact.telephoneLien}">${c.t('commun.appeler')} ${c.site.contact.telephone}</a>`,
    info: html`<span class="pastille" aria-hidden="true"></span><span data-statut-site="orleans" data-statut-court>${c.t('contact.tete.info')}</span>`,
  })}

<section class="s-creme bloc-y section-photo section-photo--claire" id="devis" data-strate="Racines" data-masque-barre>
  ${c.media({ nom: 'grok/texture-canopee', alt: '', classe: 'section-fond', sizes: '100vw' })}
  <div class="conteneur devis">
    <form class="formulaire" data-formulaire data-devis novalidate>
      <p class="surtitre">${c.t('contact.form.surtitre')}</p>
      <h2 class="titre-2" style="margin-bottom:12px">${c.tb('contact.form.titre')}</h2>
      <p class="doux" data-devis-annonce aria-live="polite">${c.t('contact.form.deroule')}</p>
      <ol class="etapes-indicateur" data-etapes-indicateur aria-hidden="true">${['motif', 'profil', 'besoin', 'secteur', 'coordonnees'].map((e) => html`<li><span class="etape-nom">${c.t(`contact.form.etapes.${e}`)}</span></li>`)}</ol>
      <div class="etapes-cadre" data-etapes-cadre>
        ${ETAPES.map((e, i) => html`<fieldset class="etape-form" data-etape="${i}">
          <legend>${c.t(`contact.form.${e.nom}.question`)}</legend>
          <div class="choix-grille">${e.choix.map((v, k) => html`<label class="choix"${e.nom === 'besoin' && v === 'genie-vegetal' ? html` data-pour-profil="entreprise collectivite"` : ''}><input type="radio" name="${e.nom}" value="${v}"${k === 0 && i === 0 ? ' required' : ''}${i > 0 && k === 0 ? ' required' : ''}><span>${c.t(`contact.form.${e.nom}.${v}`)}</span></label>`)}</div>
          ${e.nom === 'motif' ? html`<p class="doux" data-motif-candidature hidden>${c.t('contact.form.motif.versRecrutement')} ${c.lien('recrutement', { ancre: 'candidature', classe: 'lien-fleche', texte: c.t('contact.form.motif.lienRecrutement') })}</p>` : ''}
        </fieldset>`)}
        <fieldset class="etape-form" data-etape="4">
          <legend>${c.t('contact.form.coordonnees.question')}</legend>
          <div class="champs-2">
            <div class="champ"><label for="devis-nom">${c.t('form.nom')}</label><input id="devis-nom" name="nom" autocomplete="name" required></div>
            <div class="champ"><label for="devis-email">${c.t('form.email')}</label><input id="devis-email" name="email" type="email" autocomplete="email" required></div>
            <div class="champ"><label for="devis-tel">${c.t('form.telephone')}</label><input id="devis-tel" name="telephone" type="tel" autocomplete="tel"></div>
            <div class="champ"><label for="devis-ville">${c.t('contact.form.ville')}</label><input id="devis-ville" name="ville" autocomplete="address-level2"></div>
          </div>
          <div class="champ"><label for="devis-message">${c.t('form.message')}</label><textarea id="devis-message" name="message"></textarea></div>
          <div class="champ"><span class="champ-libelle" id="devis-fichier-libelle">${c.t('contact.form.fichier')}</span><label class="fichier" for="devis-fichier"><input class="fichier-input" id="devis-fichier" name="fichier" type="file" accept=".jpg,.png,.pdf,.xlsx,.xls,.docx,.doc" multiple aria-labelledby="devis-fichier-libelle" aria-describedby="devis-fichier-nom" data-fichier data-fichiers-texte="${c.t('contact.form.fichiersChoisis')}"><span class="fichier-bouton" aria-hidden="true">${c.t('contact.form.fichierBouton')}</span><span class="fichier-nom" id="devis-fichier-nom" data-fichier-nom>${c.t('contact.form.fichierAucun')}</span></label></div>
          <input type="hidden" name="presta">
          <p class="mention-donnees">${c.t('form.mentionDonnees')} ${c.lien('confidentialite', { texte: c.t('form.politique') })}.</p>
          <p><button class="bouton bouton--orange" type="submit" data-devis-envoyer>${c.t('contact.form.envoyer')}</button></p>
          <p data-message-envoi tabindex="-1" hidden data-texte="${c.s('contact.form.simule')}"></p>
        </fieldset>
      </div>
      <div class="form-navigation" data-devis-nav hidden>
        <button type="button" class="bouton bouton--contour" data-devis-prec>${c.t('commun.precedent')}</button>
        <button type="button" class="bouton bouton--orange" data-devis-suiv>${c.t('commun.suivant')}</button>
      </div>
    </form>
    <aside class="recap" aria-labelledby="recap-titre">
      ${brut(plante())}
      <h3 id="recap-titre">${c.t('contact.recap.titre')}</h3>
      <dl data-recap>
        ${['motif', 'profil', 'besoin', 'secteur'].map((n) => html`<dt>${c.t(`contact.form.etapes.${n}`)}</dt><dd data-recap-champ="${n}">${c.t('contact.recap.vide')}</dd>`)}
        <dt data-recap-presta-titre hidden>${c.t('contact.recap.presta')}</dt><dd data-recap-champ="presta" hidden></dd>
      </dl>
      <div class="destinataire" aria-live="polite">
        <p style="margin:0 0 4px;font-size:.78rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase">${c.t('contact.recap.destinataire')}</p>
        <p style="margin:0;font-weight:700" data-destinataire-nom>${c.t('contact.recap.groupe')}</p>
        <p style="margin:0" data-destinataire-detail><a href="tel:${c.site.contact.telephoneLien}">${c.site.contact.telephone}</a></p>
      </div>
      <p style="margin:0;font-size:.85rem;color:color-mix(in srgb,var(--creme) 75%,var(--terre))">${c.t('contact.recap.aiguillage')}</p>
    </aside>
  </div>
</section>

<section class="s-terre bloc-y" id="sites" data-strate="Tronc">
  <div class="conteneur">
    ${chapitre(c, { surtitre: c.t('contact.sites.surtitre'), titre: c.tb('contact.sites.titre'), chapeau: c.t('contact.sites.chapeau') })}
    <div class="sites" data-sites>${carteLoiret(c)}${listeSites(c)}</div>
    <p class="doux grand-espace">${c.t('contact.sites.email')} <a href="mailto:${c.site.contact.email}" style="color:var(--tendre)">${c.site.contact.email}</a></p>
  </div>
</section>

<section class="s-ciel bloc-y" id="services-a-la-personne" data-strate="Cime">
  <div class="conteneur colonnes-2">
    <div><p class="surtitre">${c.t('contact.sap.surtitre')}</p><h2 class="titre-2" style="margin:0 0 20px">${c.tb('contact.sap.titre')}</h2><div class="plaque plaque--carre" data-visuel>${logo(c, 'services-a-la-personne', c.s('contact.sap.logo'), { hauteur: 96 })}</div></div>
    <div><p>${c.t('contact.sap.texte')}</p><p>${c.lien('entretien', { ancre: 'credit-impot', classe: 'lien-fleche', texte: c.t('contact.sap.lien') })}</p></div>
  </div>
</section>
`;
