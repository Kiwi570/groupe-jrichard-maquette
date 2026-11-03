/* Blocs réutilisés par les pages : tête de page, chapitre, cartes, questions, appel final, dessins en code. */
import { existsSync, readdirSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { html, brut } from '../../outils/gabarit.mjs';

const racine = resolve(dirname(fileURLToPath(import.meta.url)), '../..');

/* Vrai si l'image existe (en WebP à plusieurs tailles) : sinon un visuel dessiné en code la remplace. */
export function imageExiste(nom) {
  const dossier = join(racine, 'assets/images', dirname(nom));
  if (!existsSync(dossier)) return false;
  const base = nom.split('/').pop();
  return readdirSync(dossier).some((f) => f.startsWith(base + '-') && /-\d+\.webp$/.test(f) && !f.slice(base.length + 1).startsWith('mobile'));
}

export const mediaOu = (c, opts, secours) => (imageExiste(opts.nom) ? c.media(opts) : secours);

const PROFILS = ['particulier', 'entreprise', 'collectivite'];

/* Choix du profil (gardé dans l'adresse de la page : ?profil=…). */
export function choixProfil(c, { nom = 'profil', legende } = {}) {
  return html`<fieldset class="profils" data-profils-choix>
  <legend>${legende || c.t('commun.jeSuis')}</legend>
  ${PROFILS.map((p) => html`<label><input type="radio" name="${nom}" value="${p}"><span>${c.t(`commun.profils.${p}`)}</span></label>`)}
</fieldset>`;
}

/* Tête de page : photo plein cadre, lumière sous canopée (WebGL), titre ligne à ligne, action et information clé. */
export function tete(c, { image, alt, cadrage, cadrageMobile, lignes = [], intro, actions = '', info = '', profils = false, page = true, surtitre, id = 'debut', strate = 'Sol', classe = '' }) {
  return html`<section class="tete ${page ? 'tete--page' : ''} ${classe}" id="${id}" data-strate="${strate}" data-tete data-masque-barre>
  ${c.media({ nom: image, alt, cadrage, cadrageMobile, priorite: true, classe: 'tete-fond', sizes: '100vw' })}
  <canvas class="canopee" data-canopee aria-hidden="true" data-audit-ignorer></canvas>
  <div class="tete-contenu">
    ${surtitre ? html`<p class="surtitre tete-surtitre" data-anime="gsap">${surtitre}</p>` : ''}
    <h1 class="tete-titre titre-1">${lignes.map((l) => html`<span class="ligne-masque"><span class="tete-ligne" data-anime="gsap">${l}</span></span>`)}</h1>
    ${intro ? html`<p class="tete-intro" data-anime="gsap">${intro}</p>` : ''}
    ${profils ? html`<div class="tete-profils" data-anime="gsap">${choixProfil(c)}</div>` : ''}
    <div class="tete-bas" data-anime="gsap">${actions}${info ? html`<span class="info-cle" data-info-cle>${info}</span>` : ''}</div>
  </div>
  <span class="tete-defiler" aria-hidden="true"><i></i>${c.t('commun.defiler')}</span>
</section>`;
}

export function chapitre(c, { surtitre, titre, chapeau, seul = false, id }) {
  return html`<header class="chapitre ${seul ? 'chapitre--seul' : ''}"${id ? brut(` id="${id}"`) : ''}>
  <div>${surtitre ? html`<p class="surtitre" data-anime>${surtitre}</p>` : ''}<h2 class="titre-2" data-titre-decoupe>${titre}</h2></div>
  ${chapeau ? html`<p class="chapeau" data-anime>${chapeau}</p>` : ''}
</header>`;
}

/* Cartes de prestations, filtrables par profil. */
export function cartes(c, liste, { lienDevis } = {}) {
  return html`<div class="grille-cartes" data-filtre-profil>
  ${liste.map((p) => html`<article class="carte-presta" id="${p.cle}" data-profils="${p.profils.join(' ')}" data-incline>
    ${p.image ? mediaOu(c, { nom: p.image, alt: p.titre, cadrage: p.cadrage || '50% 50%', sizes: '(max-width: 700px) 100vw, 33vw' }, html`<div class="carte-dessin" aria-hidden="true">${dessin(p.dessin || 'pousse')}</div>`) : html`<div class="carte-dessin" aria-hidden="true">${dessin(p.dessin || 'pousse')}</div>`}
    <div class="carte-presta-corps">
      <h3>${p.titre}</h3>
      <p>${p.texte}</p>
      <ul class="etiquettes" aria-label="${c.s('commun.pourQui')}">${p.profils.map((x) => html`<li>${c.t(`commun.profilsCourts.${x}`)}</li>`)}</ul>
      ${lienDevis ? c.lien('contact', { ancre: 'devis', params: `motif=devis&besoin=${lienDevis}&presta=${p.cle}`, classe: 'lien-fleche', texte: c.t('commun.demanderCeci') }) : ''}
    </div>
  </article>`)}
</div>
<p class="filtre-vide" data-filtre-vide hidden>${c.t('commun.filtreVide')}</p>`;
}

export function faq(c, liste) {
  return html`<div class="faq-liste">${liste.map((f) => html`<details class="faq-item" data-anime><summary>${f.q}</summary><div class="faq-reponse"><p>${f.r}</p></div></details>`)}</div>`;
}

/* Appel final, à la cime : le ciel à travers le feuillage. */
export function cime(c, { titre, texte, actions, image = 'grok/ciel-cime', id = 'devis-final' }) {
  return html`<section class="cime s-ciel" id="${id}" data-strate="Cime">
  ${mediaOu(c, { nom: image, alt: '', classe: 'cime-fond', sizes: '100vw' }, html`<svg class="cime-dessin" viewBox="0 0 1440 600" preserveAspectRatio="xMidYMin slice" aria-hidden="true">${brut(feuillageCime())}</svg>`)}
  <div class="conteneur cime-contenu">
    <p class="surtitre" data-anime>${c.t('commun.cimeSurtitre')}</p>
    <h2 class="titre-1" data-titre-decoupe>${titre}</h2>
    ${texte ? html`<p class="chapeau" data-anime>${texte}</p>` : ''}
    <div class="actions" data-anime>${actions}</div>
  </div>
</section>`;
}

/* Logo d'une référence, d'un label ou d'une société, à ses vraies proportions. */
export function logo(c, cle, alt, { hauteur = 52, classe = '' } = {}) {
  const d = c.donnees.logos[cle];
  const l = d ? Math.round((d[0] * hauteur) / d[1]) : hauteur * 2;
  return html`<img${classe ? brut(` class="${classe}"`) : ''} src="/assets/images/logos/${cle}.png" alt="${alt}" width="${l}" height="${hauteur}" loading="lazy" decoding="async">`;
}

/* Feuillage de cime dessiné (en attendant l'image) : silhouettes de feuilles en haut de l'écran. */
function feuillageCime() {
  let s = '', a = 7;
  const r = () => ((a = (a * 9301 + 49297) % 233280) / 233280);
  for (let i = 0; i < 70; i++) {
    const x = r() * 1440, y = r() * 170 - 30, rx = 30 + r() * 70, ry = 20 + r() * 40;
    const c = ['#32662A', '#669B2E', '#4E7F2C', '#A9C47F'][Math.floor(r() * 4)];
    s += `<ellipse cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" rx="${rx.toFixed(0)}" ry="${ry.toFixed(0)}" fill="${c}" opacity="${(0.35 + r() * 0.5).toFixed(2)}"/>`;
  }
  return s;
}

/* Dessins botaniques en code (maladies, haubanage, écuroduc) : traits simples, sans texte. */
export function dessin(nom) {
  const d = {
    pousse: '<path d="M60 110V58"/><path class="plein" d="M60 70C40 66 28 52 30 34c18 2 30 16 30 36Z"/><path class="plein" d="M60 60c4-20 18-30 34-30 0 18-14 30-34 30Z"/><path d="M30 110h60"/>',
    hauban: '<path d="M60 116V40"/><path d="M60 64 28 30M60 54l34-28"/><path class="plein" d="M28 30c-14-2-22-12-20-24 14 0 22 10 20 24ZM94 26c2-14 12-22 24-20 0 14-10 22-24 20Z"/><path class="accent" d="M36 38q24 6 50-6" stroke-dasharray="4 4"/><circle class="accent" cx="36" cy="38" r="3"/><circle class="accent" cx="86" cy="32" r="3"/><path d="M40 116h40"/>',
    ecuroduc: '<path d="M14 116V30M106 116V30"/><path class="accent" d="M14 40q46 26 92 0"/><path class="plein" d="M52 44c4-8 12-10 18-6 4 3 4 9-1 12-5 2-11 1-12-3"/><path d="M70 40c8-10 16-8 20 0-6 0-10 2-12 6"/><path d="M8 116h20M98 116h20"/>',
    nid: '<path d="M20 100 100 20"/><path d="M60 60l18-24M48 72 30 50"/><path class="plein" d="M70 40c10-6 22-2 24 8s-8 18-18 16-14-16-6-24Z"/><path d="M76 46l8 8M82 42l6 12M74 54l12 4" stroke-width="1.4"/>',
    chenille: '<path d="M14 92c20-2 30-18 50-18s30 16 50 14"/><g class="accent"><path d="M28 86c6-8 14-10 22-6"/><path d="M50 80c6-8 14-10 22-6"/><path d="M72 78c6-8 14-10 22-6"/></g><path d="M30 80v-6M42 76v-6M54 74v-6M66 72v-6M78 72v-6M90 74v-6" stroke-width="1.2"/>',
    feuille: '<path class="plein" d="M60 18c26 18 36 48 22 78-8 16-36 16-44 0-14-30-4-60 22-78Z"/><path d="M60 22v90M60 50l-14-10M60 62l16-12M60 76l-18-12M60 88l18-12"/><circle class="accent" cx="46" cy="58" r="4"/><circle class="accent" cx="74" cy="72" r="5"/><circle class="accent" cx="52" cy="84" r="3"/>',
    gui: '<path d="M10 110 110 10"/><circle class="plein" cx="66" cy="46" r="26"/><path d="M66 46 52 32M66 46l16-10M66 46 80 60M66 46 50 58M66 46v20"/><circle class="accent" cx="54" cy="40" r="3"/><circle class="accent" cx="74" cy="54" r="3"/><circle class="accent" cx="62" cy="58" r="3"/>',
    rameau: '<path d="M20 108C40 84 52 60 58 22"/><path d="M50 62C66 54 80 52 98 56M44 80c-12-6-20-14-24-26M56 40c10-6 18-14 22-24"/><circle class="accent" cx="98" cy="56" r="4"/><circle class="accent" cx="20" cy="54" r="4"/><circle class="accent" cx="78" cy="16" r="4"/><circle class="accent" cx="58" cy="22" r="4"/><path d="M84 92l10 10M94 92l-10 10M89 88v18M80 97h18" stroke-width="1.4"/>',
    soleil: '<circle class="plein" cx="60" cy="52" r="20"/><path d="M60 18v-8M60 94v-8M26 52h-8M102 52h-8M36 28l-6-6M90 82l-6-6M84 28l6-6M30 82l6-6"/><path d="M14 108c16-10 30-10 46 0s30 10 46 0"/><circle class="accent" cx="60" cy="52" r="6"/>',
    erable: '<path class="plein" d="M60 14 70 40l22-10-8 24 22 6-26 14 6 18-26-10-26 10 6-18-26-14 22-6-8-24 22 10Z"/><path d="M60 40v76"/><path class="accent" d="M40 60h8M66 52h10M58 74h8" stroke-width="3"/>',
  };
  return brut(`<svg class="dessin" viewBox="0 0 120 120" aria-hidden="true">${d[nom] || d.pousse}</svg>`);
}

export const PROFILS_LISTE = PROFILS;
