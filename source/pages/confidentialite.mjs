/* Politique de confidentialité : reprise de la politique actuelle, à faire valider par le client. */
import { html } from '../../outils/gabarit.mjs';
import { tete, imageExiste } from '../gabarits/blocs.mjs';

export const page = { cle: 'confidentialite', fichier: 'confidentialite', sansAction: true, sansCorde: true };

const S = ['responsable', 'donnees', 'finalites', 'conservation', 'outils', 'droits'];

export default (c) => html`
<div data-barre-lecture class="barre-article" aria-hidden="true"></div>
${tete(c, {
    image: imageExiste('grok/herbier') ? 'grok/herbier' : 'photos/mesange-nichoir', alt: c.s('legal.alt'), cadrage: '50% 50%',
    surtitre: c.t('legal.surtitre'), lignes: [c.t('confidentialite.titre')], intro: c.t('confidentialite.intro'), strate: 'Sol',
    info: html`<nav data-sommaire aria-label="${c.s('commun.sommaire')}"><ul>${S.map((s) => html`<li><a href="#${s}" data-sans-transition>${c.t(`confidentialite.${s}.titre`)}</a></li>`)}</ul></nav>`,
  })}
<div class="s-creme"><div class="conteneur texte-long" data-sans-visuel>
  ${S.map((s) => html`<section id="${s}" data-sans-visuel><h2>${c.t(`confidentialite.${s}.titre`)}</h2><p>${c.t(`confidentialite.${s}.texte`)}</p></section>`)}
  <p><span class="a-completer">${c.t('commun.aCompleter')}</span> ${c.t('confidentialite.valider')}</p>
</div></div>
`;
