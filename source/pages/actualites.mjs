/* Actualités : la Une, le fil filtrable par thème (filtre gardé dans l'adresse), statuts automatiques des événements. */
import { html } from '../../outils/gabarit.mjs';
import { tete, chapitre, mediaOu, cime, dessin } from '../gabarits/blocs.mjs';
import { dateLongue, THEMES } from '../gabarits/article.mjs';

export const page = { cle: 'actualites', fichier: 'actualites', imagePartage: 'photos/equipe-plantation-1280.webp' };

export default (c) => {
  const [une, ...autres] = c.donnees.actualites;
  const tous = [...autres.map((a) => ({ ...a, page: true })), ...c.donnees.fil.map((f) => ({ ...f, page: false }))];
  const presents = new Set(tous.map((a) => a.theme));
  return html`
${tete(c, {
    image: 'photos/equipe-plantation', alt: c.s('actualites.tete.alt'), cadrage: '50% 55%',
    surtitre: c.t('actualites.tete.surtitre'), lignes: [c.tb('actualites.tete.ligne1'), c.tb('actualites.tete.ligne2')],
    intro: c.t('actualites.tete.intro'),
    actions: html`<a class="bouton bouton--orange" href="#une" data-action-principale>${c.t('actualites.tete.action')}</a>`,
    info: html`<span class="pastille" aria-hidden="true"></span>${c.t('actualites.tete.info')} ${dateLongue(une.date)}`,
  })}

<section class="s-creme bloc-y" id="une" data-strate="Tronc">
  <div class="conteneur">
    <p class="surtitre">${c.t('actualites.une')}</p>
    <a class="une" href="${c.url('article-' + une.cle)}" data-libelle="${une.titre}">
      ${mediaOu(c, { nom: une.image || 'photos/formation-grimpeurs', alt: une.imageAlt || c.s('actualites.uneAlt'), sizes: '(max-width: 860px) 100vw, 55vw' }, '')}
      <div><time datetime="${une.date}">${dateLongue(une.date)}</time><h2 class="titre-2">${une.titre}</h2><p class="chapeau">${une.chapo}</p><span class="lien-fleche">${c.t('actualites.lire')}</span></div>
    </a>
  </div>
</section>

<section class="s-sauge bloc-y" id="fil" data-strate="Houppier">
  <div class="conteneur">
    ${chapitre(c, { surtitre: c.t('actualites.fil.surtitre'), titre: c.tb('actualites.fil.titre') })}
    <form class="filtres" data-filtres-fil onsubmit="return false">
      <fieldset class="filtres-groupe"><legend>${c.t('actualites.fil.filtre')}</legend>
        <label><input type="radio" name="theme" value="" checked><span>${c.t('commun.tous')}</span></label>
        ${Object.keys(THEMES).filter((t) => presents.has(t)).map((t) => html`<label><input type="radio" name="theme" value="${t}"><span>${c.t(`actualites.themes.${t}`)}</span></label>`)}
      </fieldset>
      <p class="filtres-compte" data-filtre-compte aria-live="polite"></p>
    </form>
    <p class="note-maquette"><span class="a-completer">${c.t('commun.aCompleter')}</span> ${c.t('actualites.noteReprendre')}</p>
    <ul class="fil" data-fil>
      ${tous.map((a) => html`<li data-theme="${a.theme}"${a.evenement ? html` data-evenement="${a.evenement}"` : ''}>
        ${a.page ? html`<a class="fil-carte" href="${c.url('article-' + a.cle)}" data-libelle="${a.titre}" data-incline>` : html`<div class="fil-carte">`}
          ${a.page && a.image ? c.media({ nom: a.image, alt: a.imageAlt, sizes: '(max-width: 700px) 100vw, 33vw' }) : html`<div class="carte-dessin fil-dessin" data-visuel aria-hidden="true">${dessin({ realisations: 'pousse', arbres: 'rameau', biodiversite: 'feuille', securite: 'hauban', apprentissage: 'pousse', evenements: 'soleil' }[a.theme] || 'feuille')}</div>`}
          <p class="meta-article" style="margin:0"><time datetime="${a.date}">${dateLongue(a.date)}</time> · ${c.t(`actualites.themes.${a.theme}`)} <span class="badge badge--passe" data-statut-evenement hidden>${c.t('actualites.termine')}</span></p>
          <h3>${a.titre}</h3>
          ${a.page ? html`<span class="lien-fleche">${c.t('actualites.lire')}</span>` : ''}
        ${a.page ? html`</a>` : html`</div>`}
      </li>`)}
    </ul>
    <p class="filtre-vide" data-filtre-vide hidden>${c.t('commun.filtreVide')}</p>
  </div>
</section>

${cime(c, { id: 'lettre', titre: c.tb('actualites.suivre.titre'), texte: c.t('actualites.suivre.texte'),
    actions: html`${c.site.reseaux.map((r) => html`<a class="bouton bouton--contour" href="${r.url}" target="_blank" rel="noopener" aria-label="${r.nom} ${c.s('commun.nouvelOnglet')}">${r.nom}</a>`)}${c.lien('contact', { ancre: 'devis', classe: 'bouton bouton--orange', texte: c.t('actualites.suivre.contact') })}` })}
`;
};
