/* Génie végétal : la coupe de berge se construit couche par couche, chaque couche reliée à une prestation. */
import { html, brut } from '../../outils/gabarit.mjs';
import { tete, chapitre, cime, logo, mediaOu, dessin } from '../gabarits/blocs.mjs';

export const page = { cle: 'genie-vegetal', fichier: 'genie-vegetal', imagePartage: 'photos/riviere-restauree-1280.webp' };

function coupeBerge() {
  const roseaux = Array.from({ length: 14 }, (_, i) => { const x = 70 + i * 13; const h = 60 + ((i * 37) % 40); return `<path d="M${x} 330 q${(i % 3) - 1} ${-h / 2} ${(i % 2 ? 4 : -4)} ${-h}"/><ellipse cx="${x + (i % 2 ? 4 : -4)}" cy="${330 - h}" rx="3" ry="9" fill="#8a6f4d" stroke="none"/>`; }).join('');
  const fascines = Array.from({ length: 6 }, (_, i) => `<path d="M${262 + i * 22} ${348 - i * 18} l26 -6" />`).join('');
  const boutures = Array.from({ length: 7 }, (_, i) => { const x = 270 + i * 22, y = 330 - i * 18; return `<path d="M${x} ${y} v-34"/><path class="f" d="M${x} ${y - 24} q-12 -8 -14 -20 q12 2 14 20Z"/><path class="f" d="M${x} ${y - 30} q12 -8 14 -20 q-12 2 -14 20Z"/>`; }).join('');
  const racines = Array.from({ length: 10 }, (_, i) => { const x = 300 + i * 26; return `<path class="berge-racine" pathLength="1" d="M${x} ${300 - i * 10 + 30} q${-10 + (i % 3) * 8} 40 ${-4 + (i % 2) * 10} 90"/>`; }).join('');
  const arbres = [[430, 150, 54], [500, 120, 64], [560, 150, 50]].map(([x, y, r]) => `<path d="M${x} ${y + r * 0.6} V${y + 120}" stroke="#6b5640" stroke-width="8" fill="none"/><circle cx="${x}" cy="${y}" r="${r}" fill="#32662A"/><circle cx="${x - r * .4}" cy="${y + r * .2}" r="${r * .7}" fill="#669B2E"/>`).join('');
  return brut(`<svg viewBox="0 0 600 500" aria-hidden="true">
    <rect width="600" height="500" fill="#DCE8E6"/>
    <path d="M0 330 H250 L330 270 L420 250 L600 236 V500 H0Z" fill="#7a5c3e"/>
    <path d="M0 380 H600 V500 H0Z" fill="#5a4330" opacity=".7"/>
    <defs><clipPath id="berge-eau"><path d="M0 296 H296 L250 331 H0Z"/></clipPath></defs>
    <path d="M0 300 H291 L250 330 H0Z" fill="#7FC3C3" opacity=".85"/>
    <g clip-path="url(#berge-eau)"><g data-berge-vagues fill="none" stroke="#EEF2E7" stroke-linecap="round"><path d="M-120 304 q30 -6 60 0 t60 0 t60 0 t60 0 t60 0 t60 0" stroke-width="2" opacity=".8"/><path d="M-150 314 q24 -4 48 0 t48 0 t48 0 t48 0 t48 0 t48 0 t48 0" stroke-width="1.4" opacity=".55"/><path d="M-100 323 q20 -3 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0" stroke-width="1" opacity=".45"/></g></g>
    <g data-couche="roseaux" fill="none" stroke="#4E7F2C" stroke-width="3" stroke-linecap="round">${roseaux}</g>
    <g data-couche="berge"><g fill="none" stroke="#b08a5a" stroke-width="7" stroke-linecap="round">${fascines}</g><g fill="none" stroke="#669B2E" stroke-width="3" stroke-linecap="round">${boutures}</g><g fill="none" stroke="#c7a477" stroke-width="2" stroke-linecap="round" opacity=".9">${racines}</g></g>
    <g data-couche="ripisylve">${arbres}<path d="M330 270 L420 250 L600 236" fill="none" stroke="#669B2E" stroke-width="10" stroke-linecap="round"/></g>
    <g data-couche="faune"><ellipse cx="470" cy="300" rx="70" ry="16" fill="#7FC3C3" opacity=".9"/><path d="M432 292 q10 -14 22 -4 q8 -10 18 0" fill="none" stroke="#32662A" stroke-width="3"/><circle cx="512" cy="292" r="7" fill="#669B2E"/><circle cx="510" cy="289" r="1.8" fill="#1C1B15"/></g>
  </svg>`);
}

export default (c) => html`
${tete(c, {
    image: 'photos/riviere-restauree', alt: c.s('genie.tete.alt'), cadrage: '45% 60%',
    surtitre: c.t('genie.tete.surtitre'), lignes: [c.tb('genie.tete.ligne1'), c.tb('genie.tete.ligne2')],
    intro: c.t('genie.tete.intro'), strate: 'Sol',
    actions: c.lien('contact', { ancre: 'devis', params: 'motif=devis&besoin=genie-vegetal&profil=collectivite', classe: 'bouton bouton--orange', texte: c.t('genie.tete.action'), attrs: 'data-action-principale' }),
    info: html`<span class="pastille" aria-hidden="true"></span>${c.t('genie.tete.info')}`,
  })}

<section class="s-terre bloc-y" id="coupe" data-strate="Racines" data-berge>
  <div class="conteneur">
    ${chapitre(c, { surtitre: c.t('genie.coupe.surtitre'), titre: c.tb('genie.coupe.titre'), chapeau: c.t('genie.coupe.chapeau') })}
    <div class="berge">
      <div class="berge-coupe-col"><div class="berge-coupe" data-visuel>${coupeBerge()}</div><p class="texte-illustratif" style="margin-top:10px">${c.t('genie.coupe.illustratif')}</p></div>
      <ol class="berge-liste">${c.donnees.metiers.genie.map((g) => html`<li id="${g.cle}" data-couche-etape="${g.couche}"><h3>${g.titre}</h3><p>${g.texte}</p></li>`)}</ol>
    </div>
  </div>
</section>

<section class="s-creme bloc-y" id="chantiers" data-strate="Tronc">
  <div class="conteneur">
    ${chapitre(c, { surtitre: c.t('genie.chantiers.surtitre'), titre: c.tb('genie.chantiers.titre'), chapeau: c.t('genie.chantiers.chapeau') })}
    <div class="grille-cartes">
      <article class="carte-presta" data-anime>${c.media({ nom: 'photos/berges-travaux', alt: c.s('genie.chantiers.bergesAlt'), sizes: '(max-width: 700px) 100vw, 33vw' })}<div class="carte-presta-corps"><h3>${c.t('genie.chantiers.berges')}</h3><p>${c.t('genie.chantiers.bergesTexte')}</p></div></article>
      <article class="carte-presta" data-anime>${c.media({ nom: 'photos/riviere-ombragee', alt: c.s('genie.chantiers.riviereAlt'), sizes: '(max-width: 700px) 100vw, 33vw' })}<div class="carte-presta-corps"><h3>${c.t('genie.chantiers.riviere')}</h3><p>${c.t('genie.chantiers.riviereTexte')}</p></div></article>
      <a class="carte-presta" style="text-decoration:none;color:inherit" href="${c.url('realisation-jardins-flottants')}" data-libelle="${c.s('genie.chantiers.flottants')}" data-anime>${c.media({ nom: 'photos/jardin-flottant', alt: c.s('genie.chantiers.flottantsAlt'), sizes: '(max-width: 700px) 100vw, 33vw' })}<div class="carte-presta-corps"><h3>${c.t('genie.chantiers.flottants')}</h3><p>${c.t('genie.chantiers.flottantsTexte')}</p><span class="lien-fleche">${c.t('commun.voirRealisation')}</span></div></a>
    </div>
  </div>
</section>

<section class="s-mousse bloc-y" id="savoir-faire" data-strate="Houppier">
  <div class="conteneur duo">
    <div class="duo-texte">
      <p class="surtitre" data-anime>${c.t('genie.savoir.surtitre')}</p>
      <h2 class="titre-2" data-titre-decoupe>${c.tb('genie.savoir.titre')}</h2>
      <ul class="liste-points" data-anime>${['l1', 'l2', 'l3', 'l4'].map((l) => html`<li>${c.t(`genie.savoir.${l}`)}</li>`)}</ul>
      <p class="interlocuteur" data-anime><span><small>${c.t('commun.interlocuteur')}</small><b>${c.t('genie.savoir.contactNom')}</b><span>${c.t('genie.savoir.contactRole')}</span></span></p>
      <div class="plaques" data-anime><div class="plaque" data-visuel>${logo(c, 'qualipaysage', 'QualiPaysage', { hauteur: 44 })}</div><div class="plaque" data-visuel>${logo(c, 'engage-rse', c.s('genie.savoir.rse'), { hauteur: 60 })}</div></div>
    </div>
    ${mediaOu(c, { nom: 'grok/berge-saules', alt: c.s('genie.savoir.altGrok'), sizes: '(max-width: 860px) 100vw, 50vw' }, html`<div class="carte-dessin" style="aspect-ratio:4/5;border-radius:22px" aria-hidden="true" data-visuel>${dessin('pousse')}</div>`)}
  </div>
</section>

${cime(c, { titre: c.tb('genie.cime.titre'), texte: c.t('genie.cime.texte'),
    actions: html`${c.lien('contact', { ancre: 'devis', params: 'motif=devis&besoin=genie-vegetal&profil=collectivite', classe: 'bouton bouton--orange', texte: c.t('genie.cime.devis') })}${c.lien('realisations', { params: 'metier=genie-vegetal', classe: 'bouton bouton--contour', texte: c.t('genie.cime.reals') })}` })}
`;
