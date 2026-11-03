/* Page introuvable : une souche, une jeune pousse. */
import { html } from '../../outils/gabarit.mjs';
import { tete, imageExiste } from '../gabarits/blocs.mjs';

export const page = { cle: '404', fichier: '404', partage: false, sansCorde: true };

export default (c) => html`
${tete(c, {
    image: imageExiste('grok/souche-pousse') ? 'grok/souche-pousse' : 'photos/rabotage-souche', alt: c.s('introuvable.alt'), cadrage: '60% 60%', classe: 'tete--sans-suite',
    surtitre: c.t('introuvable.surtitre'), lignes: [c.tb('introuvable.ligne1'), c.tb('introuvable.ligne2')], intro: c.t('introuvable.texte'), strate: 'Sol',
    actions: html`${c.lien('accueil', { classe: 'bouton bouton--orange', texte: c.t('introuvable.retour'), attrs: 'data-action-principale' })}${c.lien('contact', { classe: 'bouton bouton--contour', texte: c.t('introuvable.contact') })}`,
    info: html`<span class="pastille" aria-hidden="true"></span>${c.t('introuvable.info')}`,
  })}
`;
