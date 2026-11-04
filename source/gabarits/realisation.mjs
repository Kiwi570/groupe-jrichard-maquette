/* Fiche d'une réalisation (pages en série, même gabarit) : grandes photos, chiffres, travaux, visionneuse. */
import { existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { html } from '../../outils/gabarit.mjs';
import { tete, cime, dessin } from './blocs.mjs';

const racine = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
/* La plus grande version disponible (jusqu'à 1920 px) pour la visionneuse, sans jamais pointer vers un fichier absent. */
const grande = (nom) => {
  const w = [1920, 1280, 640].find((l) => existsSync(join(racine, 'assets/images', `${nom}-${l}.webp`))) || 640;
  return `/assets/images/${nom}-${w}.webp`;
};

export function pageRealisation(cle) {
  return {
    page: { cle: `realisation-${cle}`, fichier: `realisations/${cle}`, gabarit: 'realisation' },
    rendu: (c) => {
      const r = c.donnees.realisations.find((x) => x.cle === cle);
      const soc = Object.fromEntries(c.donnees.societes.map((s) => [s.cle, s.nom]));
      const [une, ...autres] = r.images;
      const suivante = c.donnees.realisations.filter((x) => x.fiche && x.images.length);
      const i = suivante.findIndex((x) => x.cle === cle);
      const apres = suivante[(i + 1) % suivante.length];
      return html`
${tete(c, {
        variante: 'fiche',
        image: une.nom, alt: une.alt, cadrage: une.cadrage,
        surtitre: html`${c.t(`commun.profilsCourts.${r.profil}`)} · ${c.t(`commun.metiers.${r.metier}`)}`,
        lignes: [r.titre], intro: r.resume, strate: 'Sol',
        actions: c.lien('contact', { ancre: 'devis', params: `motif=devis&besoin=${r.metier === 'genie-vegetal' ? 'genie-vegetal' : r.metier}&profil=${r.profil}`, classe: 'bouton bouton--orange', texte: c.t('realisation.action'), attrs: 'data-action-principale' }),
        info: html`<span class="fiche-bande-item"><small>${c.t('realisation.lieu')}</small>${r.lieu || html`<span class="a-completer">${c.t('commun.aCompleter')}</span>`}</span><span class="fiche-bande-item"><small>${c.t('realisation.annee')}</small>${r.annee || html`<span class="a-completer">${c.t('commun.aCompleter')}</span>`}</span><span class="fiche-bande-item"><small>${c.t('realisation.par')}</small>${r.societes.map((k) => soc[k]).join(' et ') || html`<span class="a-completer">${c.t('commun.aCompleter')}</span>`}</span>`,
      })}
<section class="s-creme bloc-y" id="projet" data-strate="Tronc">
  <div class="conteneur fiche-grille">
    <div class="fiche-cote">
      <p class="surtitre">${c.t('realisation.projet')}</p>
      <h2 class="titre-2" data-titre-decoupe>${c.t('realisation.titreProjet')}</h2>
      <dl class="fiche-meta">
        <dt>${c.t('realisation.lieu')}</dt><dd>${r.lieu || html`<span class="a-completer">${c.t('commun.aCompleter')}</span>`}</dd>
        ${r.client ? html`<dt>${c.t('realisation.client')}</dt><dd>${r.client}</dd>` : ''}
        <dt>${c.t('realisation.par')}</dt><dd>${r.societes.map((k) => soc[k]).join(' et ') || html`<span class="a-completer">${c.t('commun.aCompleter')}</span>`}</dd>
        <dt>${c.t('realisation.annee')}</dt><dd>${r.annee || html`<span class="a-completer">${c.t('commun.aCompleter')}</span>`}</dd>
      </dl>
      ${r.faits && r.faits.length ? html`<ul class="fiche-faits">${r.faits.map(([v, l]) => html`<li data-anime><strong>${v}</strong><span>${l}</span></li>`)}</ul>` : ''}
    </div>
    <div>
      <h3 class="titre-3">${c.t('realisation.travaux')}</h3>
      <ul class="liste-points">${r.travaux.map((t) => html`<li>${t}</li>`)}</ul>
      ${r.aCompleter && r.aCompleter.length ? html`<p style="margin-top:20px"><span class="a-completer">${c.t('commun.aCompleter')}</span> ${r.aCompleter.join(' · ')}</p>` : ''}
      ${autres.length ? html`<div class="vignettes grand-espace" data-visionneuse-groupe>
        ${autres.map((im, k) => html`<a href="#photo-${k + 1}" id="photo-${k + 1}" data-visionneuse data-src="${grande(im.nom)}" data-alt="${im.alt}" data-sans-transition aria-label="${c.s('realisation.agrandir')} : ${im.alt}">${c.media({ nom: im.nom, alt: im.alt, sizes: '(max-width: 900px) 100vw, 40vw' })}</a>`)}
      </div>` : html`<div class="fiche-sans-photo grand-espace"><div class="carte-dessin" data-visuel aria-hidden="true">${dessin('pousse')}</div><p><span class="a-completer">${c.t('commun.aCompleter')}</span> ${c.t('realisation.photosAFournir')}</p></div>`}
    </div>
  </div>
</section>
<section class="s-sauge bloc-y" id="suite" data-strate="Houppier">
  <div class="conteneur">
    <p class="surtitre">${c.t('realisation.suivante')}</p>
    <a class="une" href="${c.url('realisation-' + apres.cle)}" data-libelle="${apres.titre}">${c.media({ nom: apres.images[0].nom, alt: apres.images[0].alt, sizes: '(max-width: 860px) 100vw, 55vw' })}<div><h2 class="titre-2">${apres.titre}</h2><p class="doux">${apres.lieu}</p><span class="lien-fleche">${c.t('commun.voirRealisation')}</span></div></a>
    <p class="grand-espace">${c.lien('realisations', { classe: 'lien-fleche', texte: c.t('realisation.toutes') })}</p>
  </div>
</section>
<div class="visionneuse" data-visionneuse-fenetre data-recouvrement role="dialog" aria-modal="true" aria-label="${c.s('realisation.visionneuse')}" hidden>
  <div class="visionneuse-haut"><p data-visionneuse-legende style="margin:0"></p><button type="button" data-visionneuse-fermer>${c.t('commun.fermer')}</button></div>
  <figure><img alt="" src="${grande((autres[0] || une).nom)}" loading="lazy" decoding="async" data-visionneuse-image></figure>
  <div class="visionneuse-bas"><button type="button" data-visionneuse-prec aria-label="${c.s('commun.precedent')}">←</button><button type="button" data-visionneuse-suiv aria-label="${c.s('commun.suivant')}">→</button></div>
</div>
${cime(c, { titre: c.tb('realisation.cimeTitre'), texte: c.t('realisation.cimeTexte'),
        actions: html`${c.lien('contact', { ancre: 'devis', params: `motif=devis&profil=${r.profil}`, classe: 'bouton bouton--orange', texte: c.t('commun.actionEntete') })}` })}
`;
    },
  };
}
