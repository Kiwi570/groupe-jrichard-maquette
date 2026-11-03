/* Élagage et soin aux arbres : la cime. Taille raisonnée en direct, prestations, maladies dessinées, bois, sécurité. */
import { html, brut } from '../../outils/gabarit.mjs';
import { tete, chapitre, cartes, faq, cime, choixProfil, dessin, mediaOu, logo } from '../gabarits/blocs.mjs';

export const page = { cle: 'elagage', fichier: 'elagage-soin-arbres', imagePartage: 'photos/elagueur-cime-1280.webp' };

/* Arbre de la taille raisonnée : charpentières à garder (blanc) et branches à retirer (orange), dessinées une fois. */
function arbreTaille() {
  const garder = [
    'M250 560 C250 470 246 400 250 330', 'M250 330 C220 280 180 250 140 210', 'M250 330 C282 282 320 252 362 214',
    'M250 360 C230 320 214 270 210 220', 'M250 350 C274 312 292 268 296 214', 'M140 210 C120 180 112 150 116 120', 'M362 214 C384 186 392 156 388 124',
    'M210 220 C202 180 206 140 220 104', 'M296 214 C304 176 300 138 284 100', 'M250 330 C252 270 252 200 250 120',
  ];
  const couper = [
    ['M226 430 C190 420 150 424 108 440', 'morte'], ['M268 410 C310 402 352 410 392 432', 'basse'], ['M140 210 C110 214 86 226 62 246', 'croisee'],
    ['M362 214 C392 220 414 236 438 258', 'croisee'], ['M250 120 C258 92 262 70 262 46', 'gourmand'], ['M220 104 C226 90 240 84 258 86', 'croisee'],
  ];
  const feuilles = [[140, 130, 60], [230, 96, 62], [320, 104, 58], [390, 140, 48], [108, 170, 46], [262, 160, 70], [190, 180, 54], [326, 186, 54]];
  return brut(`<svg viewBox="40 20 420 560" aria-hidden="true">
    <g class="feuillage">${feuilles.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" opacity=".55"/>`).join('')}</g>
    ${garder.map((d, i) => `<path class="branche" d="${d}" stroke-width="${i < 3 ? 16 : i < 5 ? 11 : 7}"/>`).join('')}
    ${couper.map(([d, t], i) => `<path class="branche a-couper" data-coupe="${i}" data-type="${t}" d="${d}" stroke-width="7"/>`).join('')}
    <path d="M150 562h200" stroke="#A9C47F" stroke-width="3" stroke-linecap="round"/>
  </svg>`);
}

const TAILLE = ['observer', 'morte', 'basse', 'croisee', 'gourmand'];

export default (c) => html`
${tete(c, {
    image: 'photos/elagueur-cime', alt: c.s('elagage.tete.alt'), cadrage: '48% 40%', cadrageMobile: '40% 40%',
    surtitre: c.t('elagage.tete.surtitre'), lignes: [c.tb('elagage.tete.ligne1'), c.tb('elagage.tete.ligne2')],
    intro: c.t('elagage.tete.intro'), profils: true, strate: 'Cime',
    actions: html`${c.lien('contact', { ancre: 'devis', params: 'motif=devis&besoin=elagage', classe: 'bouton bouton--orange', texte: c.t('elagage.tete.action'), attrs: 'data-action-principale' })}<a class="bouton bouton--contour" href="tel:+33238610101">${c.t('commun.appeler')} 02 38 61 01 01</a>`,
    info: html`<span class="pastille" aria-hidden="true"></span><span data-statut-site="semoy" data-statut-court>${c.t('elagage.tete.info')}</span>`,
  })}

<section class="s-terre bloc-y" id="taille-raisonnee" data-strate="Houppier" data-taille>
  <div class="conteneur taille">
    <div>
      ${chapitre(c, { surtitre: c.t('elagage.taille.surtitre'), titre: c.tb('elagage.taille.titre'), seul: true })}
      <ol class="taille-etapes">${TAILLE.map((t, i) => html`<li data-taille-etape="${i}"><h3>${c.t(`elagage.taille.${t}.titre`)}</h3><p>${c.t(`elagage.taille.${t}.texte`)}</p></li>`)}</ol>
      <p class="texte-illustratif" style="margin-top:14px">${c.t('elagage.taille.illustratif')}</p>
    </div>
    <div class="taille-arbre" data-taille-arbre data-visuel>${arbreTaille()}</div>
  </div>
</section>

<section class="s-creme bloc-y" id="prestations" data-strate="Tronc">
  <div class="conteneur">
    ${chapitre(c, { surtitre: c.t('elagage.prestations.surtitre'), titre: c.tb('elagage.prestations.titre'), chapeau: c.t('elagage.prestations.chapeau') })}
    <div class="filtres">${choixProfil(c, { nom: 'profil-prestations', legende: c.t('commun.afficherPour') })}<p class="filtres-compte" data-filtre-compte aria-live="polite"></p></div>
    ${cartes(c, c.donnees.metiers.elagage, { lienDevis: 'elagage' })}
  </div>
</section>

<section class="s-sauge bloc-y" id="maladies" data-strate="Houppier">
  <div class="conteneur">
    ${chapitre(c, { surtitre: c.t('elagage.maladies.surtitre'), titre: c.tb('elagage.maladies.titre'), chapeau: c.t('elagage.maladies.chapeau') })}
    <div class="grille-cartes grille-equilibree">${c.donnees.metiers.maladies.map((m) => html`<article class="carte-presta" id="${m.cle}" data-anime><div class="carte-dessin" aria-hidden="true">${dessin(m.dessin)}</div><div class="carte-presta-corps"><h3>${m.titre}</h3><p>${m.texte}</p></div></article>`)}</div>
  </div>
</section>

<section class="s-mousse bloc-y" id="securite" data-strate="Cime">
  <div class="conteneur duo">
    ${mediaOu(c, { nom: 'grok/materiel-elagueur', alt: c.s('elagage.securite.altGrok'), sizes: '(max-width: 860px) 100vw, 50vw' }, c.media({ nom: 'photos/formation-grimpeurs', alt: c.s('elagage.securite.alt'), sizes: '(max-width: 860px) 100vw, 50vw' }))}
    <div class="duo-texte">
      <p class="surtitre" data-anime>${c.t('elagage.securite.surtitre')}</p>
      <h2 class="titre-2" data-titre-decoupe>${c.tb('elagage.securite.titre')}</h2>
      <ul class="liste-points" data-anime>${['l1', 'l2', 'l3', 'l4', 'l5'].map((l) => html`<li>${c.t(`elagage.securite.${l}`)}</li>`)}</ul>
      <div class="plaques" data-anime><div class="plaque" data-visuel>${logo(c, 'qualipaysage', 'QualiPaysage', { hauteur: 44 })}</div><div class="plaque" data-visuel>${logo(c, 'engage-rse', c.s('elagage.securite.rse'), { hauteur: 60 })}</div></div>
    </div>
  </div>
</section>

<section class="s-creme bloc-y" id="bois" data-strate="Cime">
  <div class="conteneur colonnes-2">
    <article class="carte-info" data-anime>
      ${c.media({ nom: 'photos/buches', alt: c.s('elagage.bois.alt'), ratio: '16 / 9', classe: 'carte-info-media', sizes: '(max-width: 860px) 100vw, 40vw', cadrage: '50% 50%' })}
      <p class="surtitre">${c.t('elagage.bois.surtitre')}</p>
      <h2 class="titre-3">${c.t('elagage.bois.titre')}</h2>
      <p><span class="prix" data-prix>71,50 € TTC</span> ${c.t('elagage.bois.stere')}</p>
      <p><span class="prix" data-prix>22 € TTC</span> ${c.t('elagage.bois.brf')}</p>
      <svg class="stere" viewBox="0 0 220 112" aria-hidden="true" data-stere><g class="buche"><circle cx="58" cy="96" r="12.5"/><circle class="cerne" cx="58" cy="96" r="7.5"/><circle class="cerne" cx="58" cy="96" r="3"/></g><g class="buche"><circle cx="84" cy="96" r="12.5"/><circle class="cerne" cx="84" cy="96" r="7.5"/><circle class="cerne" cx="84" cy="96" r="3"/></g><g class="buche"><circle cx="110" cy="96" r="12.5"/><circle class="cerne" cx="110" cy="96" r="7.5"/><circle class="cerne" cx="110" cy="96" r="3"/></g><g class="buche"><circle cx="136" cy="96" r="12.5"/><circle class="cerne" cx="136" cy="96" r="7.5"/><circle class="cerne" cx="136" cy="96" r="3"/></g><g class="buche"><circle cx="162" cy="96" r="12.5"/><circle class="cerne" cx="162" cy="96" r="7.5"/><circle class="cerne" cx="162" cy="96" r="3"/></g><g class="buche"><circle cx="71" cy="72" r="12.5"/><circle class="cerne" cx="71" cy="72" r="7.5"/><circle class="cerne" cx="71" cy="72" r="3"/></g><g class="buche"><circle cx="97" cy="72" r="12.5"/><circle class="cerne" cx="97" cy="72" r="7.5"/><circle class="cerne" cx="97" cy="72" r="3"/></g><g class="buche"><circle cx="123" cy="72" r="12.5"/><circle class="cerne" cx="123" cy="72" r="7.5"/><circle class="cerne" cx="123" cy="72" r="3"/></g><g class="buche"><circle cx="149" cy="72" r="12.5"/><circle class="cerne" cx="149" cy="72" r="7.5"/><circle class="cerne" cx="149" cy="72" r="3"/></g><g class="buche"><circle cx="84" cy="48" r="12.5"/><circle class="cerne" cx="84" cy="48" r="7.5"/><circle class="cerne" cx="84" cy="48" r="3"/></g><g class="buche"><circle cx="110" cy="48" r="12.5"/><circle class="cerne" cx="110" cy="48" r="7.5"/><circle class="cerne" cx="110" cy="48" r="3"/></g><g class="buche"><circle cx="136" cy="48" r="12.5"/><circle class="cerne" cx="136" cy="48" r="7.5"/><circle class="cerne" cx="136" cy="48" r="3"/></g><path class="stere-sol" d="M30 110H190"/></svg>
      <p>${c.t('elagage.bois.livraison')}</p>
      <p class="doux">${c.t('elagage.bois.source')}</p>
      <p>${c.lien('contact', { ancre: 'devis', params: 'motif=renseignements&besoin=bois', classe: 'lien-fleche', texte: c.t('elagage.bois.commander') })}</p>
    </article>
    <div><p class="surtitre">${c.t('commun.questions')}</p>${faq(c, c.donnees.faq.abattage)}</div>
  </div>
</section>

${cime(c, { titre: c.tb('elagage.cime.titre'), texte: c.t('elagage.cime.texte'),
    actions: html`${c.lien('contact', { ancre: 'devis', params: 'motif=devis&besoin=elagage', classe: 'bouton bouton--orange', texte: c.t('elagage.cime.devis') })}<a class="bouton bouton--contour" href="tel:+33238610101">${c.t('commun.appeler')} 02 38 61 01 01</a>` })}
`;
