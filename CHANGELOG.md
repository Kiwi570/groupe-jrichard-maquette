# Ce qui a changé

Chaque version ajoute sa partie en tête de ce fichier, construite en comparant l'archive précédente et la nouvelle, jamais de mémoire.

## v2 — un site plus vivant

**Effets sur tout le site**
- Saison vivante : à l'arrivée sur une page et en atteignant le ciel du bas, quelques éléments de la saison réelle traversent l'écran puis se posent (feuilles en automne, pétales au printemps, aigrettes de pissenlit en été, flocons en hiver) ; la souris, le doigt et le défilement les relancent. Pour montrer une autre saison au client : ajouter `?saison=printemps` (ou `ete`, `automne`, `hiver`) à l'adresse.
- Lisières : les sections ne se coupent plus net ; une bordure d'herbe, de terre ou de colline fait la transition, et l'herbe se couche quand on défile vite.
- Rideau de feuilles : le changement de page passe derrière un rideau de feuillage.
- Cime en récompense en bas des pages de présentation (Contact, Recrutement et pages légales finissent sur leur formulaire ou leurs informations) : le feuillage s’écarte, les nuages glissent en profondeur, trois oiseaux traversent le ciel.
- Photos : couleurs ravivées dans les fichiers, ouvertures moins assombries, apparition en dôme (comme une pousse), photo d'ouverture qui s'approche au défilement, léger étirement quand on défile vite.
- Corde d'élagueur aussi sur portable, tablette et téléphone (fil fin et mousqueton contre le bord droit).
- Curseur « Voir » sur les cartes, photo qui ondule au passage de la souris, reflet de lumière sur les cartes inclinables.
- Vers une fiche de réalisation ou un article : la photo de la carte s'agrandit jusqu'à remplir l'écran avant le changement de page.
- Filtres animés : quand on change de profil ou de filtre, les cartes glissent vers leur nouvelle place.

**Accueil**
- Les quatre métiers en plein écran : chaque photo pousse du sol par-dessus la précédente, avec un grand compteur d'altitude (0, 2, 8, 25 m).
- Des racines se dessinent sous les chiffres ; sur la carte, les trois sites tombent avec un rebond et la Loire coule quelques secondes.

**Pages métiers**
- Prestations en liste vivante sur grand écran : la photo de la prestation lue ou survolée pousse dans un cadre épinglé à droite ; sur téléphone, les prestations défilent au doigt.
- Entretien : un cadran des saisons tourne pendant la lecture et met en avant la carte de la saison pointée ; la saison réelle porte la mention « En ce moment ».
- Élagage : les bûches du stère tombent et s'empilent ; au survol d'un ravageur, la maladie gagne la feuille puis elle guérit.
- Génie végétal : l'eau de la coupe de berge coule au fil du défilement, les racines des boutures poussent dans la berge.

**Le Groupe, Recrutement, Contact**
- Le Groupe : l'arbre des six sociétés se dessine (une couronne de la couleur de chaque société, qui s'allume au survol) ; le tronc des cernes reste à l'écran pendant la lecture de l'histoire, avec l'année en très grand.
- Recrutement : un chemin relie les quatre étapes et une feuille le parcourt.
- Demande de devis et candidature : une plante gagne une feuille à chaque réponse et fleurit à l'envoi.

**Finitions après relecture**
- Les feuilles de saison s’effacent presque quand elles passent sur un titre, un texte ou un bouton.
- Prestations sur grand écran : un dessin remplit maintenant tout le cadre épinglé.
- Coupe de berge : l’eau rejoint la berge sans éclat clair, les vaguelettes restent dans l’eau.
- Plante des formulaires plus grande, et déjà levée avant la première réponse.
- Grande année de l’histoire et compteur d’altitude plus lisibles ; cadran des saisons plus grand.
- La mention « Illustration générée » d’un fond de section passe au-dessus de la lisière.
- L’indication « Défiler » n’apparaît qu’à partir de 1200 px de large (elle touchait le statut d’ouverture à 1024 px).
- Textes : apostrophes typographiques partout (hors avis clients, repris tels quels), « Tailler juste, sans excès », « À chacune son métier », « Toutes nos nouvelles, sur les réseaux », « Parlez-nous de votre projet », « en cinq étapes » ; manques marqués « à compléter ».

**Technique**
- Nouveaux fichiers : `assets/js/projet/saison.js`, `lisieres.js`, `cime.js`, `vivant.js`, `prestations.js`, `pousse.js`, `scenes2.js`.
- `outils/images.py` : nouvelle option « raviver » (appliquée à toutes les photos du site actuel dans `recu/lot-site.json`).
- Trois nouvelles tailles d’images : `allee-massifs-mobile-844.webp`, `lavoir-pas-japonais-mobile-787.webp`, `longues-allees-1200.webp`.
- Numéro de version des fichiers passé à 2.

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
