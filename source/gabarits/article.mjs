/* Article d'actualité (pages en série, même gabarit) : barre de lecture, chapô, intertitres, statut d'événement. */
import { html } from '../../outils/gabarit.mjs';
import { tete, cime, mediaOu } from './blocs.mjs';

export const THEMES = { realisations: 1, arbres: 1, biodiversite: 1, securite: 1, apprentissage: 1, evenements: 1 };
const MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
export const dateLongue = (iso) => { const [a, m, j] = iso.split('-').map(Number); return `${j === 1 ? '1er' : j} ${MOIS[m - 1]} ${a}`; };

export function pageArticle(cle) {
  return {
    page: { cle: `article-${cle}`, fichier: `actualites/${cle}`, gabarit: 'article' },
    rendu: (c) => {
      const a = c.donnees.actualites.find((x) => x.cle === cle);
      return html`
${tete(c, {
        variante: 'article',
        image: a.image || 'photos/equipe-plantation', alt: a.imageAlt || c.s('actualites.tete.alt'), cadrage: '50% 50%',
        surtitre: html`${c.t(`actualites.themes.${a.theme}`)} · <time datetime="${a.date}">${dateLongue(a.date)}</time>`,
        lignes: [a.titre], intro: a.chapo, strate: 'Sol', classe: a.titre.length > 60 ? 'tete--long' : '',
        actions: c.lien('actualites', { ancre: 'fil', classe: 'bouton bouton--contour', texte: c.t('article.retour'), attrs: 'data-action-principale' }),
        info: html`<span class="pastille" aria-hidden="true"></span>${c.t('article.par')} ${a.auteur}${a.evenement ? html` · <span data-statut-evenement-article="${a.evenement}">${c.t('article.evenement')} ${dateLongue(a.evenement)}</span>` : ''}`,
      })}
<article class="s-creme bloc-y" id="article" data-strate="Tronc">
  <div class="conteneur article-corps">
    ${a.evenement ? html`<p><span class="badge badge--passe" data-statut-evenement data-evenement="${a.evenement}" hidden>${c.t('actualites.termine')}</span></p>` : ''}
    ${a.corps.map(([t, p]) => html`<h2>${t}</h2><p>${p}</p>`)}
    ${a.realisation ? html`<p>${c.lien('realisation-' + a.realisation, { classe: 'lien-fleche', texte: c.t('article.voirRealisation') })}</p>` : ''}
  </div>
</article>
${cime(c, { titre: c.tb('article.cimeTitre'), texte: c.t('article.cimeTexte'),
        actions: html`${c.lien('contact', { ancre: 'devis', classe: 'bouton bouton--orange', texte: c.t('commun.actionEntete') })}${c.lien('actualites', { ancre: 'fil', classe: 'bouton bouton--contour', texte: c.t('article.autres') })}` })}
`;
    },
  };
}
