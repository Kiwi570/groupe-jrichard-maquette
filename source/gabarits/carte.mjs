/* Carte de la Loire et des trois sites (SVG dessiné à partir des contours réels des départements et du cours de la Loire),
   et liste des sites avec horaires et statut « ouvert maintenant » (calculé à l'heure de Paris par assets/js/carte.js). */
import { html, brut } from '../../outils/gabarit.mjs';

const VOISINS = { '41': 'Loir-et-Cher', '28': 'Eure-et-Loir', '89': 'Yonne', '77': 'Seine-et-Marne', '18': 'Cher', '58': 'Nièvre', '91': 'Essonne' };
const SECTEURS = { ouest: ['41', '28', '18'], est: ['89', '77'] };
const NOMS = { '41': [225, 640], '28': [270, 150], '89': [840, 590], '77': [800, 150], '18': [470, 690], '91': [520, 118] };
const VILLES = [['gien', 'Gien', 10, 4], ['pithiviers', 'Pithiviers', 10, 4], ['meung', 'Meung-sur-Loire', -136, 22], ['chambord', 'Chambord', 10, 4]];
const ETIQUETTES = { orleans: [-96, 34], semoy: [16, -14], amilly: [16, -14] };

export function carteLoiret(c, { legende = true } = {}) {
  const d = c.donnees.carte;
  const P = d.lieux;
  return html`<figure class="carte-loiret" style="margin:0" data-carte>
  <svg viewBox="140 80 780 640" role="group" aria-label="${c.s('carte.aria')}">
    <g aria-hidden="true">
      ${Object.entries(d.departements).map(([code, dep]) => {
        const sect = SECTEURS.ouest.includes(code) ? 'ouest' : SECTEURS.est.includes(code) ? 'est' : '';
        return html`<path class="dep dep-${code}${sect ? ' dep-secteur' : ''}" d="${brut(dep.d)}"${sect ? brut(` data-secteur="${sect}" style="fill:${sect === 'ouest' ? 'rgba(102,155,46,.2)' : 'rgba(26,155,155,.22)'}"`) : ''}/>`;
      })}
      <circle class="secteur" cx="${P.orleans[0]}" cy="${P.orleans[1] - 12}" r="62" fill="rgba(237,102,26,.22)" stroke="rgba(237,102,26,.7)" stroke-width="1.5" stroke-dasharray="5 5"/>
      <path class="loire" d="${brut(d.loire)}" data-loire pathLength="1"/>
      <text class="nom-dep" x="545" y="470">Loiret</text>
      ${Object.entries(NOMS).map(([code, [x, y]]) => html`<text class="nom-dep" x="${x}" y="${y}" style="font-size:17px">${VOISINS[code]}</text>`)}
      ${VILLES.map(([cle, nom, dx, dy]) => html`<circle class="ville-point" cx="${P[cle][0]}" cy="${P[cle][1]}" r="3.5"/><text class="ville" x="${P[cle][0] + dx}" y="${P[cle][1] + dy}">${nom}</text>`)}
    </g>
    ${c.donnees.sites.map((s) => html`<g class="carte-site" data-site="${s.cle}">
      <circle class="halo" cx="${P[s.cle][0]}" cy="${P[s.cle][1]}" r="18" data-halo/>
      <circle class="coeur" cx="${P[s.cle][0]}" cy="${P[s.cle][1]}" r="9"/>
      <circle cx="${P[s.cle][0]}" cy="${P[s.cle][1]}" r="24" fill="transparent"/>
      <text x="${P[s.cle][0] + ETIQUETTES[s.cle][0]}" y="${P[s.cle][1] + ETIQUETTES[s.cle][1]}">${s.nom}</text>
    </g>`)}
  </svg>
  ${legende ? html`<figcaption><ul class="carte-legende">
    <li><i style="background:rgba(237,102,26,.5)"></i>${c.t('carte.metropole')}</li>
    <li><i style="background:rgba(102,155,46,.45)"></i>${c.t('carte.ouest')}</li>
    <li><i style="background:rgba(26,155,155,.5)"></i>${c.t('carte.est')}</li>
    <li><span class="carte-aide-souris">${c.t('carte.aideSouris')}</span><span class="carte-aide-doigt">${c.t('carte.aideDoigt')}</span></li>
  </ul></figcaption>` : ''}
</figure>`;
}

export function listeSites(c) {
  const soc = Object.fromEntries(c.donnees.societes.map((s) => [s.cle, s.nom]));
  return html`<ul class="sites-liste">${c.donnees.sites.map((s) => html`<li class="site-carte" id="site-${s.cle}" data-site-carte="${s.cle}">
  <h3>${s.nom} <small>${s.role}</small></h3>
  <p>${s.adresse}, ${s.cp} ${s.ville}</p>
  <p>${s.societes.map((k) => soc[k]).join(' · ')}</p>
  <p>${s.horairesTexte}${s.aConfirmer ? html` <span class="a-completer">${c.t('commun.aConfirmer')}</span>` : ''}</p>
  <p class="statut" data-statut-site="${s.cle}" aria-live="polite"></p>
  <p class="actions" style="gap:4px 18px"><a href="tel:${s.telephoneLien}">${s.telephone}</a><a href="https://www.openstreetmap.org/search?query=${encodeURIComponent(`${s.adresse}, ${s.cp} ${s.ville}`)}" target="_blank" rel="noopener">${c.t('carte.itineraire')}<span class="visuellement-cache"> ${c.t('commun.nouvelOnglet')}</span></a></p>
</li>`)}</ul>`;
}
