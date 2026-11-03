/* Mentions légales : fiche récapitulative à compléter, éditeur, hébergeur, crédits. Barre de lecture et sommaire. */
import { html } from '../../outils/gabarit.mjs';
import { tete, imageExiste } from '../gabarits/blocs.mjs';

export const page = { cle: 'mentions-legales', fichier: 'mentions-legales', sansAction: true, sansCorde: true };

const FICHE = ['raison', 'forme', 'capital', 'siege', 'siret', 'tva', 'directeur', 'sap', 'mediateur', 'assurance'];

export default (c) => html`
<div data-barre-lecture class="barre-article" aria-hidden="true"></div>
${tete(c, {
    image: imageExiste('grok/herbier') ? 'grok/herbier' : 'photos/prairie-fleurie', alt: c.s('legal.alt'), cadrage: '50% 50%',
    surtitre: c.t('legal.surtitre'), lignes: [c.t('mentions.titre')], intro: c.t('mentions.intro'), strate: 'Sol',
    info: html`<nav data-sommaire aria-label="${c.s('commun.sommaire')}"><ul>${['fiche', 'editeur', 'hebergeur', 'credits', 'donnees'].map((s) => html`<li><a href="#${s}" data-sans-transition>${c.t(`mentions.${s}.titre`)}</a></li>`)}</ul></nav>`,
  })}
<div class="s-creme"><div class="conteneur texte-long" data-sans-visuel>
  <section id="fiche" data-sans-visuel><h2>${c.t('mentions.fiche.titre')}</h2><p>${c.t('mentions.fiche.texte')}</p>
    <table class="fiche-a-completer"><tbody>${FICHE.map((f) => html`<tr><th scope="row">${c.t(`mentions.fiche.${f}`)}</th><td><span class="a-completer">${c.t('commun.aCompleter')}</span></td></tr>`)}</tbody></table>
  </section>
  <section id="editeur" data-sans-visuel><h2>${c.t('mentions.editeur.titre')}</h2><p>${c.t('mentions.editeur.texte')}</p><p>${c.site.contact.adresse} · <a href="tel:${c.site.contact.telephoneLien}">${c.site.contact.telephone}</a> · <a href="mailto:${c.site.contact.email}">${c.site.contact.email}</a></p></section>
  <section id="hebergeur" data-sans-visuel><h2>${c.t('mentions.hebergeur.titre')}</h2><p>${c.t('mentions.hebergeur.texte')}</p></section>
  <section id="credits" data-sans-visuel><h2>${c.t('mentions.credits.titre')}</h2><p>${c.t('mentions.credits.photos')}</p><p>${c.t('mentions.credits.ia')}</p><p>${c.t('mentions.credits.polices')}</p><p>${c.t('mentions.credits.carte')}</p></section>
  <section id="donnees" data-sans-visuel><h2>${c.t('mentions.donnees.titre')}</h2><p>${c.t('mentions.donnees.texte')} ${c.lien('confidentialite', { texte: c.t('form.politique') })}.</p></section>
</div></div>
`;
