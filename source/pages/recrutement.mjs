/* Recrutement : postes recherchés (filtrables), raisons, métiers, apprentissage, déroulé, candidature simulée. */
import { html, brut } from '../../outils/gabarit.mjs';
import { tete, chapitre, cime, mediaOu, dessin, plante } from '../gabarits/blocs.mjs';

export const page = { cle: 'recrutement', fichier: 'recrutement', imagePartage: 'photos/grimpeurs-chene-1280.webp' };

const FAMILLES = ['paysage', 'elagage', 'atelier', 'alternance'];

export default (c) => {
  const r = c.donnees.recrutement;
  return html`
${tete(c, {
    variante: 'collage',
    /* Pastille inclinée : les boîtes de ses lignes, une fois tournées, se recouvrent par construction (data-superpose) ; les lignes, elles, ne se touchent pas. */
    visuel: html`${c.media({ nom: 'photos/apprentis-groupe', alt: '', cadrage: '50% 58%', classe: 'tete-collage tete-collage--rond', sizes: '(max-width: 900px) 40vw, 20vw' })}${c.media({ nom: 'photos/formation-grimpeurs', alt: '', cadrage: '50% 40%', classe: 'tete-collage tete-collage--carre', sizes: '(max-width: 900px) 40vw, 22vw' })}<p class="tete-pastille" aria-hidden="true" data-superpose><strong>${c.t('recrutement.tete.pastilleNombre')}</strong><b>${c.t('recrutement.tete.pastilleMot')}</b><span>${c.t('recrutement.tete.pastilleSous')}</span></p>`,
    image: 'photos/grimpeurs-chene', alt: c.s('recrutement.tete.alt'), cadrage: '70% 40%', cadrageMobile: '72% 40%',
    surtitre: c.t('recrutement.tete.surtitre'), lignes: [c.tb('recrutement.tete.ligne1'), c.tb('recrutement.tete.ligne2')],
    intro: c.t('recrutement.tete.intro'), strate: 'Sol',
    actions: html`<a class="bouton bouton--orange" href="#postes" data-action-principale>${c.t('recrutement.tete.action')}</a><a class="bouton bouton--contour" href="#candidature">${c.t('recrutement.tete.spontanee')}</a>`,
    info: html`<span class="pastille" aria-hidden="true"></span>${c.t('recrutement.tete.info')}`,
  })}

<section class="s-creme bloc-y" id="postes" data-strate="Racines">
  <div class="conteneur">
    ${chapitre(c, { surtitre: c.t('recrutement.postes.surtitre'), titre: c.tb('recrutement.postes.titre'), chapeau: c.t('recrutement.postes.chapeau') })}
    ${c.media({ nom: 'photos/demontage-retention', alt: c.s('recrutement.postes.alt'), classe: 'bandeau-photo', sizes: '(max-width: 1320px) 100vw, 1280px', cadrage: '40% 45%' })}
    <form class="filtres" data-filtres-postes onsubmit="return false">
      <fieldset class="filtres-groupe"><legend>${c.t('recrutement.postes.filtre')}</legend>
        <label><input type="radio" name="famille" value="" checked><span>${c.t('commun.tous')}</span></label>
        ${FAMILLES.map((f) => html`<label><input type="radio" name="famille" value="${f}"><span>${c.t(`recrutement.familles.${f}`)}</span></label>`)}
      </fieldset>
      <p class="filtres-compte" data-filtre-compte aria-live="polite"></p>
    </form>
    <p class="note-maquette"><span class="a-completer">${c.t('commun.aCompleter')}</span> ${c.t('recrutement.postes.note')}</p>
    <ul class="grille-cartes" style="list-style:none;margin:0;padding:0" data-postes>
      ${c.donnees.postes.map((p) => html`<li class="carte-info" data-famille="${p.metier}">
        <p class="meta-article" style="margin:0">${c.t(`recrutement.familles.${p.metier}`)}</p>
        <h3 class="titre-3">${p.titre}</h3>
        ${p.contrat ? html`<p>${c.t('recrutement.postes.contrat')} ${p.contrat}</p>` : ''}
        <p><a class="lien-fleche" href="?poste=${p.cle}#candidature">${c.t('recrutement.postes.postuler')}</a></p>
      </li>`)}
    </ul>
    <p class="filtre-vide" data-filtre-vide hidden>${c.t('commun.filtreVide')}</p>
  </div>
</section>

<section class="s-mousse bloc-y" id="pourquoi" data-strate="Tronc">
  <div class="conteneur">
    ${chapitre(c, { surtitre: c.t('recrutement.raisons.surtitre'), titre: c.tb('recrutement.raisons.titre'), chapeau: c.t('recrutement.raisons.chapeau') })}
    <div class="grille-cartes">${r.raisons.map((x, i) => html`<article class="carte-info" data-anime style="background:color-mix(in srgb,var(--creme) 8%,transparent)">${c.media({ nom: ['photos/formation-grimpeurs', 'photos/apprentis-vigne', 'photos/equipe-groupe'][i], alt: c.s(`recrutement.raisons.alt${i + 1}`), ratio: '16 / 10', classe: 'carte-info-media', sizes: '(max-width: 700px) 100vw, 33vw', cadrage: ['50% 40%', '50% 45%', '50% 30%'][i] })}<p class="strate-numero">0${i + 1}</p><h3 class="titre-3">${x.titre}</h3><p>${x.texte}</p></article>`)}</div>
    <p class="surtitre grand-espace">${c.t('recrutement.metiersTitre')}</p>
    <ul class="puces-ligne">${r.metiers.map((m) => html`<li style="background:color-mix(in srgb,var(--creme) 10%,transparent)">${m}</li>`)}</ul>
  </div>
</section>

<section class="s-sauge bloc-y" id="apprentissage" data-strate="Houppier">
  <div class="conteneur duo">
    ${mediaOu(c, { nom: 'grok/mains-plantation', alt: c.s('recrutement.apprentissage.altGrok'), sizes: '(max-width: 860px) 100vw, 50vw' }, c.media({ nom: 'photos/apprentis-vigne', alt: c.s('recrutement.apprentissage.alt'), sizes: '(max-width: 860px) 100vw, 50vw' }))}
    <div class="duo-texte">
      <p class="surtitre" data-anime>${c.t('recrutement.apprentissage.surtitre')}</p>
      <h2 class="titre-2" data-titre-decoupe>${c.tb('recrutement.apprentissage.titre')}</h2>
      <p data-anime>${c.t('recrutement.apprentissage.texte')}</p>
      <ul class="liste-points" data-anime>${['l1', 'l2', 'l3', 'l4'].map((l) => html`<li>${c.t(`recrutement.apprentissage.${l}`)}</li>`)}</ul>
      <p class="doux" data-anime>${c.t('recrutement.apprentissage.ecoles')} ${r.ecoles.join(' · ')}.</p>
    </div>
  </div>
</section>

<section class="s-creme bloc-y" id="deroule" data-strate="Houppier">
  <div class="conteneur">
    ${chapitre(c, { surtitre: c.t('recrutement.deroule.surtitre'), titre: c.tb('recrutement.deroule.titre') })}
    <div class="chemin-etapes" aria-hidden="true" data-chemin-etapes><svg viewBox="0 0 1000 80" preserveAspectRatio="none"><path d="M40 52 C 180 8, 300 80, 500 40 S 820 6, 960 46" pathLength="1" vector-effect="non-scaling-stroke"/></svg><svg class="chemin-feuille" viewBox="-12 -12 24 24"><path d="M-10 0C-6-8 6-9 10 0C6 9-6 8-10 0Z"/><path d="M-10 0H8" class="nervure"/></svg></div>
    <ol class="methode-etapes etapes-dessinees" style="grid-template-columns:repeat(auto-fit,minmax(min(100%,230px),1fr))">${r.etapes.map((e, i) => html`<li data-anime><div class="etape-dessin" data-visuel aria-hidden="true">${dessin(['pousse', 'feuille', 'rameau', 'erable'][i])}</div><h3 class="titre-3">${e.titre}</h3><p>${e.texte}</p></li>`)}</ol>
  </div>
</section>

<section class="s-ciel bloc-y" id="candidature" data-strate="Cime" data-masque-barre>
  <div class="conteneur devis">
    <form class="formulaire" data-formulaire novalidate>
      <p class="surtitre">${c.t('recrutement.form.surtitre')}</p>
      <h2 class="titre-2">${c.tb('recrutement.form.titre')}</h2>
      <div class="champs-2">
        <div class="champ"><label for="cand-nom">${c.t('form.nom')}</label><input id="cand-nom" name="nom" autocomplete="name" required></div>
        <div class="champ"><label for="cand-email">${c.t('form.email')}</label><input id="cand-email" name="email" type="email" autocomplete="email" required></div>
        <div class="champ"><label for="cand-tel">${c.t('form.telephone')}</label><input id="cand-tel" name="telephone" type="tel" autocomplete="tel"></div>
        <div class="champ"><label for="cand-poste">${c.t('recrutement.form.poste')}</label><select id="cand-poste" name="poste"><option value="spontanee">${c.t('recrutement.form.spontanee')}</option>${c.donnees.postes.map((p) => html`<option value="${p.cle}">${p.titre}</option>`)}<option value="stage">${c.t('recrutement.form.stage')}</option></select></div>
      </div>
      <fieldset class="choix-grille"><legend>${c.t('recrutement.form.site')}</legend>
        ${['orleans', 'amilly', 'indifferent'].map((s, i) => html`<label class="choix"><input type="radio" name="site" value="${s}"${i === 2 ? ' checked' : ''}><span>${c.t(`recrutement.form.sites.${s}`)}</span></label>`)}
      </fieldset>
      <div class="champ" style="margin-top:16px"><span class="champ-libelle" id="cand-cv-libelle">${c.t('recrutement.form.cv')}</span><label class="fichier" for="cand-cv"><input class="fichier-input" id="cand-cv" name="cv" type="file" accept=".pdf,.doc,.docx,.jpg,.png" aria-labelledby="cand-cv-libelle" aria-describedby="cand-cv-nom" data-fichier><span class="fichier-bouton" aria-hidden="true">${c.t('recrutement.form.cvBouton')}</span><span class="fichier-nom" id="cand-cv-nom" data-fichier-nom>${c.t('recrutement.form.cvAucun')}</span></label></div>
      <div class="champ"><label for="cand-message">${c.t('form.message')}</label><textarea id="cand-message" name="message"></textarea></div>
      <p class="mention-donnees">${c.t('form.mentionDonnees')} ${c.lien('confidentialite', { texte: c.t('form.politique') })}.</p>
      <p><button class="bouton bouton--orange" type="submit">${c.t('recrutement.form.envoyer')}</button></p>
      <p data-message-envoi tabindex="-1" hidden data-texte="${c.s('recrutement.form.simule')}"></p>
    </form>
    <aside class="recap" style="position:static">
      ${brut(plante())}
      ${c.media({ nom: 'photos/locaux-goueffon-amilly', alt: c.s('recrutement.rh.alt'), ratio: '16 / 10', classe: 'recap-media', sizes: '(max-width: 900px) 100vw, 30vw', cadrage: '40% 50%' })}
      <h3>${c.t('recrutement.rh.titre')}</h3>
      <p style="margin:0">${c.t('recrutement.rh.texte')}</p>
      <dl>
        <dt>${c.t('recrutement.rh.orleans')}</dt><dd>Emmanuelle Oudeard</dd>
        <dt>${c.t('recrutement.rh.montargis')}</dt><dd>Carole Maillard</dd>
      </dl>
      <p class="destinataire" style="margin:0"><a href="mailto:cv@groupe-jrichard.fr">cv@groupe-jrichard.fr</a><br><a href="tel:+33238661384">02 38 66 13 84</a></p>
    </aside>
  </div>
</section>
`;
};
