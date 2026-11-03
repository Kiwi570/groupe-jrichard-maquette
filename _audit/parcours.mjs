/* Parcours propres à la maquette du Groupe J.Richard.
   Simulateur de crédit d'impôt (totaux recalculés), demande de devis en 5 étapes (préremplie par l'adresse,
   aiguillage vers la bonne société), filtres des réalisations et des postes (adresse de la page),
   visionneuse des fiches (focus gardé, Échap, retour du focus), profil choisi (gardé d'une page à l'autre),
   statuts « ouvert maintenant » (jamais pour Amilly), pièce jointe en français. */
export default async function ({ contexte, attendrePret, attendre, BASE, R, T }) {
  const euros = (t) => parseFloat(String(t).replace(/[^\d,.-]/g, '').replace(',', '.'));

  /* Simulateur : 50 % des dépenses, plafonnées à 5 000 € par an. */
  {
    const { ctx, page } = await contexte({ taille: T('390×844') });
    try {
      await page.goto(BASE + '/entretien-jardinage#credit-impot', { waitUntil: 'load' });
      await attendrePret(page);
      for (const d of [0, 1200, 5000, 6000]) {
        const lu = await page.evaluate((d) => {
          const champ = document.querySelector('[data-simu-depense]');
          champ.value = d;
          champ.dispatchEvent(new Event('input', { bubbles: true }));
          const t = (s) => document.querySelector(s).textContent;
          return { affiche: t('[data-simu-affiche]'), credit: t('[data-simu-credit]'), reste: t('[data-simu-reste]') };
        }, d);
        const credit = Math.min(d, 5000) * 0.5;
        if (euros(lu.affiche) !== d) R.echec('simulateur', `dépense affichée ${lu.affiche} au lieu de ${d} €`, { page: '/entretien-jardinage', taille: '390×844' });
        if (euros(lu.credit) !== credit) R.echec('simulateur', `crédit affiché ${lu.credit} au lieu de ${credit} € pour ${d} €`, { page: '/entretien-jardinage', taille: '390×844' });
        if (euros(lu.reste) !== d - credit) R.echec('simulateur', `reste affiché ${lu.reste} au lieu de ${d - credit} € pour ${d} €`, { page: '/entretien-jardinage', taille: '390×844' });
      }
    } finally { await ctx.close(); }
  }

  /* Devis : choix préremplis par l'adresse, étape suivante ouverte, aiguillage vers la bonne société. */
  for (const taille of ['390×844', '1440×900']) {
    const { ctx, page } = await contexte({ taille: T(taille) });
    try {
      await page.goto(BASE + '/contact?motif=devis&besoin=elagage&profil=particulier#devis', { waitUntil: 'load' });
      await attendrePret(page);
      await attendre(400);
      const etat = await page.evaluate(() => ({
        visible: [...document.querySelectorAll('[data-etape]')].findIndex((e) => !e.hidden),
        annonce: document.querySelector('[data-devis-annonce]').textContent,
      }));
      if (etat.visible !== 3) R.echec('devis', `avec motif, profil et besoin dans l'adresse, l'étape ouverte est la n° ${etat.visible + 1} au lieu de la 4 (secteur)`, { page: '/contact', taille });
      if (!/Étape 4 sur 5/.test(etat.annonce)) R.regarder('devis', `étape annoncée : « ${etat.annonce} »`, { page: '/contact', taille });
      await page.locator('[data-etape="3"] label.choix:has(input[value="est"])').click();
      await attendre(700);
      const dest = await page.evaluate(() => document.querySelector('[data-destinataire-nom]').textContent);
      if (!/Goueffon Élagage, antenne d.Amilly/.test(dest)) R.echec('devis', `élagage dans l'Est aiguillé vers « ${dest} »`, { page: '/contact', taille });
      const etape5 = await page.evaluate(() => !document.querySelector('[data-etape="4"]').hidden);
      if (!etape5) R.echec('devis', 'un choix fait ne passe pas à l’étape suivante', { page: '/contact', taille });
      /* Retour en arrière puis autre secteur : le destinataire suit. */
      await page.locator('[data-devis-prec]').click();
      await attendre(500);
      await page.locator('[data-etape="3"] label.choix:has(input[value="metropole"])').click();
      await attendre(700);
      const dest2 = await page.evaluate(() => document.querySelector('[data-destinataire-nom]').textContent);
      if (!/Goueffon Élagage, Semoy/.test(dest2)) R.echec('devis', `élagage dans la métropole aiguillé vers « ${dest2} »`, { page: '/contact', taille });
    } finally { await ctx.close(); }
  }

  /* Devis : génie végétal réservé aux entreprises et collectivités ; candidature renvoyée au recrutement. */
  {
    const { ctx, page } = await contexte({ taille: T('390×844') });
    try {
      await page.goto(BASE + '/contact?motif=devis&profil=particulier#devis', { waitUntil: 'load' });
      await attendrePret(page);
      const cache = await page.evaluate(() => document.querySelector('[data-pour-profil]').hidden);
      if (!cache) R.echec('devis', 'le génie végétal est proposé à un particulier', { page: '/contact', taille: '390×844' });
      await page.goto(BASE + '/contact#devis', { waitUntil: 'load' });
      await attendrePret(page);
      await page.locator('[data-etape="0"] label.choix:has(input[value="candidature"])').click();
      await attendre(400);
      const lien = await page.evaluate(() => { const p = document.querySelector('[data-motif-candidature]'); return p && !p.hidden; });
      if (!lien) R.echec('devis', 'le motif « candidature » ne propose pas le lien vers le recrutement', { page: '/contact', taille: '390×844' });
    } finally { await ctx.close(); }
  }

  /* Filtres des réalisations : compte juste, choix gardé dans l'adresse et repris au rechargement. */
  {
    const { ctx, page } = await contexte({ taille: T('1440×900') });
    try {
      await page.goto(BASE + '/realisations', { waitUntil: 'load' });
      await attendrePret(page);
      await page.locator('[data-filtres-reals] label:has(input[name="profil"][value="particulier"])').click();
      await attendre(600);
      const r = await page.evaluate(() => {
        const items = [...document.querySelector('[data-reals]').children];
        return { visibles: items.filter((e) => !e.hidden).length, attendus: items.filter((e) => e.dataset.profil === 'particulier').length, compte: document.querySelector('[data-filtres-reals] [data-filtre-compte]').textContent, url: location.search };
      });
      if (r.visibles !== r.attendus) R.echec('filtres', `${r.visibles} réalisations visibles pour « particuliers » au lieu de ${r.attendus}`, { page: '/realisations', taille: '1440×900' });
      if (parseInt(r.compte, 10) !== r.visibles) R.echec('filtres', `compte « ${r.compte} » pour ${r.visibles} réalisations visibles`, { page: '/realisations', taille: '1440×900' });
      if (!/profil=particulier/.test(r.url)) R.echec('filtres', 'le filtre n’est pas gardé dans l’adresse de la page', { page: '/realisations', taille: '1440×900' });
      await page.reload({ waitUntil: 'load' });
      await attendrePret(page);
      const garde = await page.evaluate(() => document.querySelector('[data-filtres-reals] input[name="profil"][value="particulier"]').checked);
      if (!garde) R.echec('filtres', 'le filtre n’est pas repris au rechargement', { page: '/realisations', taille: '1440×900' });
    } finally { await ctx.close(); }
  }

  /* Visionneuse d'une fiche : ouverture, focus dedans, Échap, retour du focus sur la vignette. */
  for (const taille of ['390×844', '1440×900']) {
    const { ctx, page } = await contexte({ taille: T(taille) });
    try {
      await page.goto(BASE + '/realisations/chambord', { waitUntil: 'load' });
      await attendrePret(page);
      const v = page.locator('[data-visionneuse]').first();
      await v.scrollIntoViewIfNeeded();
      await v.click();
      await attendre(600);
      const ouverte = await page.evaluate(() => { const f = document.querySelector('[data-visionneuse-fenetre]'); return !f.hidden && f.contains(document.activeElement); });
      if (!ouverte) R.echec('visionneuse', 'la visionneuse ne s’ouvre pas ou ne prend pas le focus', { page: '/realisations/chambord', taille });
      await page.keyboard.press('Tab'); await page.keyboard.press('Tab'); await page.keyboard.press('Tab'); await page.keyboard.press('Tab');
      const garde = await page.evaluate(() => document.querySelector('[data-visionneuse-fenetre]').contains(document.activeElement));
      if (!garde) R.echec('visionneuse', 'le focus sort de la visionneuse ouverte', { page: '/realisations/chambord', taille });
      await page.keyboard.press('Escape');
      await attendre(500);
      const fermee = await page.evaluate(() => ({ cache: document.querySelector('[data-visionneuse-fenetre]').hidden, retour: document.activeElement && document.activeElement.matches('[data-visionneuse]') }));
      if (!fermee.cache) R.echec('visionneuse', 'Échap ne ferme pas la visionneuse', { page: '/realisations/chambord', taille });
      if (!fermee.retour) R.echec('visionneuse', 'le focus ne revient pas sur la vignette à la fermeture', { page: '/realisations/chambord', taille });
    } finally { await ctx.close(); }
  }

  /* Profil choisi : gardé d'une page à l'autre, prestations filtrées, donnée abîmée sans blocage. */
  {
    const { ctx, page } = await contexte({ taille: T('390×844') });
    try {
      await page.goto(BASE + '/', { waitUntil: 'load' });
      await attendrePret(page);
      await page.locator('.tete-profils label:has(input[value="entreprise"])').first().click();
      await attendre(400);
      await page.goto(BASE + '/amenagement-paysager', { waitUntil: 'load' });
      await attendrePret(page);
      const r = await page.evaluate(() => {
        const coche = document.querySelector('input[name="profil"][value="entreprise"]:checked');
        const cartes = [...document.querySelectorAll('[data-filtre-profil] [data-profils]')];
        const mal = cartes.filter((c) => !c.hidden && !c.dataset.profils.split(' ').includes('entreprise')).length;
        return { coche: !!coche, mal, total: cartes.length };
      });
      if (!r.coche) R.echec('profil', 'le profil choisi sur l’accueil n’est pas repris sur la page Aménagement', { page: '/amenagement-paysager', taille: '390×844' });
      if (r.mal) R.echec('profil', `${r.mal} prestations hors profil « entreprise » restent visibles`, { page: '/amenagement-paysager', taille: '390×844' });
      await page.evaluate(() => localStorage.setItem('jr:profil', '{abîmé'));
      await page.reload({ waitUntil: 'load' });
      if ((await attendrePret(page)) === 'jamais-pret') R.echec('profil', 'un profil enregistré abîmé bloque le site', { page: '/amenagement-paysager' });
    } finally { await ctx.close(); }
  }

  /* Statuts des sites : jamais pour Amilly (horaires à confirmer), cohérents pour Orléans. */
  {
    const { ctx, page } = await contexte({ taille: T('1440×900') });
    try {
      await page.goto(BASE + '/contact#sites', { waitUntil: 'load' });
      await attendrePret(page);
      const s = await page.evaluate(() => ({
        amilly: [...document.querySelectorAll('[data-statut-site="amilly"]')].map((e) => e.textContent.trim()).join(''),
        orleans: [...document.querySelectorAll('[data-statut-site="orleans"]:not([data-statut-court])')].map((e) => e.textContent.trim()),
      }));
      if (s.amilly) R.echec('statuts', `un statut s’affiche pour Amilly (« ${s.amilly} ») alors que ses horaires sont à confirmer`, { page: '/contact' });
      s.orleans.forEach((t) => { if (t && !/^(Ouvert maintenant|Fermé)/.test(t)) R.regarder('statuts', `statut d’Orléans inattendu : « ${t} »`, { page: '/contact' }); });
    } finally { await ctx.close(); }
  }

  /* Pièce jointe : texte en français, nom du fichier affiché après le choix. */
  {
    const { ctx, page } = await contexte({ taille: T('390×844') });
    try {
      await page.goto(BASE + '/recrutement#candidature', { waitUntil: 'load' });
      await attendrePret(page);
      await page.setInputFiles('#cand-cv', { name: 'cv-test.pdf', mimeType: 'application/pdf', buffer: Buffer.from('%PDF-1.4') });
      await attendre(200);
      const nom = await page.evaluate(() => document.querySelector('#cand-cv-nom').textContent);
      if (nom !== 'cv-test.pdf') R.echec('piece-jointe', `nom affiché « ${nom} » après le choix d’un fichier`, { page: '/recrutement', taille: '390×844' });
    } finally { await ctx.close(); }
  }
}
