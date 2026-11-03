/* Le Groupe : mission, cernes de croissance (1965 → 2021), les six sociétés, chiffres, engagements, labels, partenaires. */
import { html, brut } from '../../outils/gabarit.mjs';
import { tete, chapitre, cime, logo, mediaOu, imageExiste } from '../gabarits/blocs.mjs';

export const page = { cle: 'groupe', fichier: 'le-groupe', imagePartage: 'photos/equipe-groupe-1280.webp' };

/* Coupe de tronc : un cerne par étape de l'histoire, du cœur (1965) vers l'écorce (2021).
   Avec l'illustration de la souche, les cernes se posent sur le bois ; sinon le bois est dessiné. */
function tronc(histoire, photo) {
  const n = histoire.length;
  const [cx, cy, r0, r1] = photo ? [292, 306, 40, 236] : [300, 300, 46, 268];
  const cernes = histoire.map((h, i) => {
    const r = r0 + (i * (r1 - r0)) / (n - 1);
    const rayon = (a) => r * (1 + 0.035 * Math.sin(a * 3 + i) + 0.02 * Math.cos(a * 5 + i * 2));
    let d = '';
    for (let k = 0; k <= 72; k++) {
      const a = (k / 72) * Math.PI * 2;
      d += `${k ? 'L' : 'M'}${(cx + Math.cos(a) * rayon(a)).toFixed(1)} ${(cy + Math.sin(a) * rayon(a) * 0.96).toFixed(1)}`;
    }
    return { d: d + 'Z', annee: h.annee, yh: cy - rayon(Math.PI * 1.5) * 0.96 };
  });
  const bois = photo ? '' : `<circle cx="300" cy="300" r="292" fill="#3a2c1f"/><circle cx="300" cy="300" r="282" fill="#8a6f4d"/><circle cx="300" cy="300" r="270" fill="#b08a5a"/>`;
  return brut(`<svg viewBox="0 0 600 600" aria-hidden="true"${photo ? ' class="sur-photo"' : ''}>
    ${bois}
    ${cernes.map((c, i) => `<path class="cerne" data-cerne="${i}" d="${c.d}" pathLength="1"/>`).join('')}
    ${cernes.map((c, i) => `<path class="cerne-zone" data-cerne-zone="${i}" d="${c.d}"/>`).join('')}
    ${cernes.map((c, i) => `<text class="cerne-annee" data-cerne-annee="${i}" x="${cx}" y="${(c.yh + 5.5).toFixed(1)}" text-anchor="middle">${c.annee}</text>`).join('')}
    <circle cx="${cx}" cy="${cy}" r="8" fill="#ED661A"/>
  </svg>`);
}

export default (c) => html`
${tete(c, {
    image: 'photos/equipe-groupe', alt: c.s('groupe.tete.alt'), cadrage: '50% 55%', cadrageMobile: '45% 55%',
    surtitre: c.t('groupe.tete.surtitre'), lignes: [c.tb('groupe.tete.ligne1'), c.tb('groupe.tete.ligne2')],
    intro: c.t('groupe.tete.intro'),
    actions: html`<a class="bouton bouton--orange" href="#societes" data-action-principale>${c.t('groupe.tete.action')}</a>`,
    info: html`<span class="pastille" aria-hidden="true"></span>${c.t('groupe.tete.info')}`,
  })}

<section class="s-terre bloc-y" id="mission" data-strate="Racines">
  <div class="conteneur duo">
    <div class="duo-texte">
      <p class="surtitre" data-anime>${c.t('groupe.mission.surtitre')}</p>
      <blockquote class="citation" data-anime>${c.t('groupe.mission.citation')}</blockquote>
      <ul class="liste-points" data-anime>${['vocation', 'mission', 'adn'].map((k) => html`<li><strong>${c.t(`groupe.mission.${k}Titre`)}</strong> ${c.t(`groupe.mission.${k}`)}</li>`)}</ul>
    </div>
    ${mediaOu(c, { nom: 'grok/gland-germe', alt: c.s('groupe.mission.altGrok'), sizes: '(max-width: 860px) 100vw, 50vw' }, c.media({ nom: 'photos/plantation-arbre-motte', alt: c.s('groupe.mission.alt'), sizes: '(max-width: 860px) 100vw, 50vw', cadrage: '50% 45%' }))}
  </div>
</section>

<section class="s-humus bloc-y" id="histoire" data-strate="Tronc" data-cernes>
  <div class="conteneur">
    ${chapitre(c, { surtitre: c.t('groupe.histoire.surtitre'), titre: c.tb('groupe.histoire.titre'), chapeau: c.t('groupe.histoire.chapeau') })}
    <div class="cernes">
      <div class="cernes-tronc" data-visuel>${imageExiste('grok/coupe-tronc') ? c.media({ nom: 'grok/coupe-tronc', alt: c.s('groupe.histoire.altGrok'), classe: 'cernes-photo', sizes: '(max-width: 900px) 90vw, 45vw' }) : ''}${tronc(c.donnees.histoire, imageExiste('grok/coupe-tronc'))}</div>
      <ol class="cernes-liste">${c.donnees.histoire.map((h, i) => html`<li data-cerne-etape="${i}"><button type="button" data-cerne-bouton="${i}" aria-describedby="cerne-texte-${i}"><b>${h.annee}</b><span>${h.titre}</span></button><p id="cerne-texte-${i}">${h.texte}</p></li>`)}</ol>
    </div>
  </div>
</section>

<section class="s-sauge bloc-y" id="societes" data-strate="Tronc">
  <div class="conteneur">
    ${chapitre(c, { surtitre: c.t('groupe.societes.surtitre'), titre: c.tb('groupe.societes.titre'), chapeau: c.t('groupe.societes.chapeau') })}
    <ul class="societes">${c.donnees.societes.map((s) => html`<li class="societe" style="--couleur:${s.couleur}" data-anime>
      <div class="plaque plaque--societe" data-visuel>${logo(c, s.logo.replace('logos/', ''), s.nom, { hauteur: 60 })}</div>
      <h3>${s.nom}</h3><p>${s.metier}</p>
      <ul>${s.faits.map((f) => html`<li>${f}</li>`)}</ul>
      <p>${s.ville} · <a href="tel:${s.telephoneLien}">${s.telephone}</a></p>
    </li>`)}</ul>
  </div>
</section>

<section class="s-mousse bloc-y section-photo" id="chiffres" data-strate="Houppier">
  ${imageExiste('grok/racines-sol') ? c.media({ nom: 'grok/racines-sol', alt: '', classe: 'section-fond', sizes: '100vw', cadrage: '50% 60%' }) : ''}
  <div class="conteneur">
    ${chapitre(c, { surtitre: c.t('groupe.chiffres.surtitre'), titre: c.tb('groupe.chiffres.titre'), chapeau: c.t('groupe.chiffres.chapeau') })}
    <ul class="chiffres-grille">${c.donnees.chiffres.map((x) => html`<li class="chiffre-bloc" data-anime><span class="tige" aria-hidden="true" data-tige></span><span class="chiffre-valeur">${x.cle === 'ca' ? html`<span class="chiffre-prefixe">${c.t('commun.plusDe')}</span>` : ''}<span data-compteur="${x.valeur}">${x.valeur}</span>${x.suffixe}</span><span class="chiffre-libelle">${x.libelle}</span></li>`)}</ul>
  </div>
</section>

<section class="s-creme bloc-y" id="engagements" data-strate="Houppier">
  <div class="conteneur">
    ${chapitre(c, { surtitre: c.t('groupe.engagements.surtitre'), titre: c.tb('groupe.engagements.titre'), chapeau: c.t('groupe.engagements.chapeau') })}
    <div class="grille-cartes">${c.donnees.engagements.map((e, i) => html`<article class="carte-info" data-anime><p class="strate-numero" style="color:var(--vert)">0${i + 1}</p><h3 class="titre-3">${e.titre}</h3><p>${e.texte}</p></article>`)}
      <article class="carte-info" data-anime style="background:var(--terre);color:var(--creme)"><p class="surtitre" style="color:var(--tendre)">${c.t('groupe.engagements.rapportSurtitre')}</p><h3 class="titre-3">${c.t('groupe.engagements.rapport')}</h3><p style="color:var(--creme)">${c.t('groupe.engagements.rapportTexte')}</p><p><span class="a-completer">${c.t('groupe.engagements.rapportPdf')}</span></p></article>
    </div>
    <div class="labels">${c.donnees.labels.map((l) => html`<article class="label" style="box-shadow:inset 0 0 0 1px var(--ligne-s)" data-anime><div class="plaque" data-visuel>${logo(c, l.logo.replace('logos/', ''), l.nom, { hauteur: 60 })}</div><h3>${l.nom}</h3><p>${l.texte}</p></article>`)}</div>
  </div>
</section>

<section class="s-ciel bloc-y" id="partenaires" data-strate="Cime">
  <div class="conteneur colonnes-2">
    <div>
      <p class="surtitre" data-anime>${c.t('groupe.partenaires.surtitre')}</p>
      <h2 class="titre-2" data-titre-decoupe>${c.tb('groupe.partenaires.titre')}</h2>
      <ul class="partenaires-logos">${c.donnees.partenaires.engagement.map((p, i) => html`<li><div class="plaque" data-visuel>${logo(c, ['unep', 'clefs-du-jardin', 'cfa-bellegarde', 'esat', 'solembio', 'groupama'][i], '', { hauteur: 60 })}</div><span>${p}</span></li>`)}</ul>
    </div>
    <div>
      <p class="surtitre" data-anime>${c.t('groupe.partenaires.sportSurtitre')}</p>
      <h2 class="titre-3" style="margin-top:0">${c.t('groupe.partenaires.sport')}</h2>
      <ul class="puces-ligne">${c.donnees.partenaires.sport.map((p) => html`<li>${p}</li>`)}</ul>
    </div>
  </div>
</section>

${cime(c, { titre: c.tb('groupe.cime.titre'), texte: c.t('groupe.cime.texte'),
    actions: html`${c.lien('contact', { ancre: 'devis', classe: 'bouton bouton--orange', texte: c.t('commun.actionEntete') })}${c.lien('recrutement', { classe: 'bouton bouton--contour', texte: c.t('groupe.cime.rejoindre') })}` })}
`;
