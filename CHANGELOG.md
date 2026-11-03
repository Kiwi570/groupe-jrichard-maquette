# Ce qui a changé

Chaque version ajoute sa partie en tête de ce fichier, construite en comparant l'archive précédente et la nouvelle, jamais de mémoire.

## v1 — la base

**Direction artistique « De la graine à la cime »**
- Chaque page se lit du sol vers la cime : sections en strates (Sol, Racines, Tronc, Houppier, Cime), du brun de la terre au vert de la mousse puis au ciel.
- Intro à chaque arrivée et rechargement : une graine tombe, l'arbre pousse (racines, tronc, branches), le feuillage s'ouvre sur la page (moins de 3 s, accélérée ou passée par un clic, une touche, la molette ou le doigt).
- Lumière sous canopée en WebGL sur chaque photo d'ouverture (taches de lumière qui bougent avec la souris), coupée en mode calme.
- Corde d'élagueur à droite sur grand écran : un mousqueton monte de 0 à 25 m pendant la lecture, avec les repères des strates comme sommaire.
- Polices Fraunces (titres) et Manrope (textes), couleurs tirées du logo et des six sociétés.

**Pages (13 pages, 7 fiches de réalisations, 6 articles)**
- Accueil : quatre métiers en strates épinglées, galerie horizontale des réalisations, méthode en trois étapes, chiffres, labels, références qui défilent, avis clients, carte des trois sites, sociétés, recrutement.
- Aménagement, Entretien, Élagage, Génie végétal : prestations filtrées selon le profil (particulier, entreprise, collectivité), questions fréquentes, qualifications.
- Entretien : simulateur de crédit d'impôt (50 %, plafond de 5 000 € de dépenses), saisons, services à la personne.
- Élagage : schéma de taille raisonnée qui se construit à la lecture, ravageurs et maladies, bois de chauffage.
- Génie végétal : coupe de berge qui se construit couche par couche.
- Réalisations : filtres par profil et par métier gardés dans l'adresse, fiches avec visionneuse.
- Le Groupe : histoire en cernes de tronc (1965 à 2021), les six sociétés, engagements RSE, partenaires.
- Recrutement : postes filtrés, étapes, apprentissage, candidature simulée.
- Actualités : article à la une, fil filtré par thème, événements passés marqués « Terminé » automatiquement.
- Contact : demande en cinq étapes préremplie par les boutons du site, récapitulatif en direct, société destinataire proposée, carte du Loiret, statut « ouvert maintenant » à l'heure de Paris (jours fériés compris, aucun statut pour Amilly tant que ses horaires ne sont pas confirmés).
- Mentions légales, confidentialité, page 404.

**Images**
- Photos du site actuel converties en WebP en trois tailles, versions téléphone recadrées pour les ouvertures.
- Illustrations générées avec Grok (saisons, souche, herbier, cime, outils de l'élagueur, berge en saules…) avec un étalonnage doux et la mention « Illustration générée ».

**Mise en ligne**
- Site statique prêt pour Vercel, noindex partout, images de partage 1200×630 par page, données structurées des six sociétés.
- Audit automatique fourni dans `_audit/` avec les parcours propres au site (simulateur, demande de devis, filtres, visionneuse, profil, statuts).
