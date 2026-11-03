# Rapport d’audit

Projet : `groupe-jrichard-maquette` · 03/11/2026 22:38:32 · 74 min · 19 page(s) contrôlée(s) en entier + 7 en contrôle léger (pages en série) · audit complet

## Résumé

- Échecs : **1**
- À regarder : **3**
- Non lancé : **1**
- Contrôles passés : vercel.json (1), .vercelignore (1), robots.txt (1), numéro de version (1), langues (1), mesures (1002), balayage (18), films d’ouverture (36), films de transition (36), bords de l’écran (19), intro accélérable et passable (7), menu (1), clavier (19), liens et boutons (19), liens profonds (16), liens vers la page en cours (18), changements de hauteur (18), mode calme (36), bouton du mode calme (2), parcours du projet (1), tient dans l’écran (8), films des épinglages (2), fluidité (36), défilement selon l’appareil (5), vitesse (18), captures (1)

## Échecs

### bords de l’écran : bande d’une autre couleur le long du bord droit pendant le menu (1)

- **bords de l’écran : bande d’une autre couleur le long du bord droit pendant le menu** — `/amenagement-paysager` — bande d’environ 15 px en rgb(63, 63, 55) à côté du menu en rgb(27, 26, 21), sur 2 image(s) sur 33 (films/bords-menu-1920.png) _(1920×1080 barre de défilement classique (15 px))_

## À regarder

### rechargement au milieu de la page (3)

- **rechargement au milieu de la page** — `/amenagement-paysager` — écran différent à la même position après rechargement (6.6 %), voir comparaisons/rechargement-amenagement-paysager-*.png _(1366×768)_
- **rechargement au milieu de la page** — `/elagage-soin-arbres` — écran différent à la même position après rechargement (7.2 %), voir comparaisons/rechargement-elagage-soin-arbres-*.png _(1366×768)_
- **rechargement au milieu de la page** — `/entretien-jardinage` — écran différent à la même position après rechargement (6.1 %), voir comparaisons/rechargement-entretien-jardinage-*.png _(1366×768)_

## Non lancé

- **Safari (WebKit)** : WebKit ne peut pas s’installer ici : vérification à faire dans Safari sur le Mac (liste dans le rapport)

### À vérifier dans Safari sur le Mac (WebKit indisponible ici)

- Ouverture de chaque page : rien qui clignote, intro complète au premier chargement et au rechargement.
- Changement de page : le voile couvre l’écran, pas de page blanche ; retour arrière sans intro ni voile resté.
- Défilement : fluide (natif), en-tête qui se cache et revient sans clignoter, sections épinglées entières.
- Menu sur iPhone (mode Responsive de Safari) : ouverture, fermeture, page bloquée derrière.
- Polices, images, mention « Illustration générée », formulaires et barre fixe du bas.

## Repères

- Numéro de version des fichiers : ?v=2
- Pages en série article (fr) : 6 pages ; contrôlées en entier : /actualites/challenge-msa-2026, /actualites/portes-ouvertes-sauvegrain-2026, /actualites/chenilles-processionnaires-chene ; les 3 autres en contrôle léger (390×844 et 1366×768, mode normal) après les contrôles de fichiers. --toutes-les-pages pour tout contrôler en entier.
- Pages en série realisation (fr) : 7 pages ; contrôlées en entier : /realisations/chambord, /realisations/berthe-morisot, /realisations/auguste-saint-hilaire ; les 4 autres en contrôle léger (390×844 et 1366×768, mode normal) après les contrôles de fichiers. --toutes-les-pages pour tout contrôler en entier.
- Accessibilité : axe-core 4.12.1 en plus des contrôles intégrés.
- Mode sans WebGL : contrôlé sur les 19 page(s) qui utilisent WebGL (/, /404, /actualites, /actualites/challenge-msa-2026, /actualites/chenilles-processionnaires-chene, /actualites/portes-ouvertes-sauvegrain-2026, /amenagement-paysager, /confidentialite, /contact, /elagage-soin-arbres, /entretien-jardinage, /genie-vegetal, /le-groupe, /mentions-legales, /realisations, /realisations/auguste-saint-hilaire, /realisations/berthe-morisot, /realisations/chambord, /recrutement).
- Ouverture / (1366×768) : 2744 ms depuis le premier octet
- Ouverture /actualites (1366×768) : 2717 ms depuis le premier octet
- Ouverture /actualites/challenge-msa-2026 (1366×768) : 2667 ms depuis le premier octet
- film de l'ouverture /actualites/challenge-msa-2026 1366×768 : réussi à la tentative 2 (avant : cdpSession.send: Protocol error (Page.startScreencast): Not attached to an active page)
- Ouverture /actualites/chenilles-processionnaires-chene (1366×768) : 2738 ms depuis le premier octet
- film de l'ouverture /actualites/chenilles-processionnaires-chene 1366×768 : réussi à la tentative 2 (avant : cdpSession.send: Protocol error (Page.startScreencast): Not attached to an active page)
- Ouverture /actualites/portes-ouvertes-sauvegrain-2026 (1366×768) : 2773 ms depuis le premier octet
- Ouverture /amenagement-paysager (1366×768) : 2746 ms depuis le premier octet
- Ouverture /confidentialite (1366×768) : 2749 ms depuis le premier octet
- Ouverture /contact (1366×768) : 2759 ms depuis le premier octet
- Ouverture /elagage-soin-arbres (1366×768) : 2746 ms depuis le premier octet
- film de l'ouverture /elagage-soin-arbres 1366×768 : réussi à la tentative 2 (avant : cdpSession.send: Protocol error (Page.startScreencast): Not attached to an active page)
- Ouverture /entretien-jardinage (1366×768) : 2737 ms depuis le premier octet
- Ouverture /genie-vegetal (1366×768) : 2752 ms depuis le premier octet
- Ouverture /le-groupe (1366×768) : 2771 ms depuis le premier octet
- Ouverture /mentions-legales (1366×768) : 2763 ms depuis le premier octet
- film de l'ouverture /mentions-legales 1366×768 : réussi à la tentative 2 (avant : cdpSession.send: Protocol error (Page.startScreencast): Not attached to an active page)
- Ouverture /realisations (1366×768) : 2771 ms depuis le premier octet
- Ouverture /realisations/auguste-saint-hilaire (1366×768) : 2766 ms depuis le premier octet
- Ouverture /realisations/berthe-morisot (1366×768) : 2764 ms depuis le premier octet
- Ouverture /realisations/chambord (1366×768) : 2761 ms depuis le premier octet
- film de l'ouverture /realisations/chambord 1366×768 : réussi à la tentative 2 (avant : cdpSession.send: Protocol error (Page.startScreencast): Not attached to an active page)
- Ouverture /recrutement (1366×768) : 2767 ms depuis le premier octet
- Ouverture / (390×844) : 2760 ms depuis le premier octet
- Ouverture /actualites (390×844) : 2774 ms depuis le premier octet
- Ouverture /actualites/challenge-msa-2026 (390×844) : 2765 ms depuis le premier octet
- film de l'ouverture /actualites/challenge-msa-2026 390×844 : réussi à la tentative 2 (avant : cdpSession.send: Protocol error (Page.startScreencast): Not attached to an active page)
- Ouverture /actualites/chenilles-processionnaires-chene (390×844) : 2771 ms depuis le premier octet
- Ouverture /actualites/portes-ouvertes-sauvegrain-2026 (390×844) : 2765 ms depuis le premier octet
- Ouverture /amenagement-paysager (390×844) : 2781 ms depuis le premier octet
- Ouverture /confidentialite (390×844) : 2732 ms depuis le premier octet
- Ouverture /contact (390×844) : 2755 ms depuis le premier octet
- Ouverture /elagage-soin-arbres (390×844) : 2764 ms depuis le premier octet
- Ouverture /entretien-jardinage (390×844) : 2736 ms depuis le premier octet
- film de l'ouverture /entretien-jardinage 390×844 : réussi à la tentative 2 (avant : cdpSession.send: Protocol error (Page.startScreencast): Not attached to an active page)
- Ouverture /genie-vegetal (390×844) : 2773 ms depuis le premier octet
- Ouverture /le-groupe (390×844) : 2725 ms depuis le premier octet
- Ouverture /mentions-legales (390×844) : 2782 ms depuis le premier octet
- Ouverture /realisations (390×844) : 2771 ms depuis le premier octet
- Ouverture /realisations/auguste-saint-hilaire (390×844) : 2707 ms depuis le premier octet
- Ouverture /realisations/berthe-morisot (390×844) : 2772 ms depuis le premier octet
- Ouverture /realisations/chambord (390×844) : 2728 ms depuis le premier octet
- Ouverture /recrutement (390×844) : 2775 ms depuis le premier octet
- bords de l’écran /elagage-soin-arbres 1366×768 : réussi à la tentative 3 (avant : cdpSession.send: Protocol error (Page.startScreencast): Not attached to an active page)
- Bords de l’écran : 2329 images d’intro, 61 de voile et 731 de menu jugées (panneau immobile couvrant tout l’écran), barre de défilement classique de 15 px.
- Tient dans l'écran /actualites : aucune section épinglée ou plein écran.
- Tient dans l'écran /actualites/challenge-msa-2026 : aucune section épinglée ou plein écran.
- Tient dans l'écran /actualites/chenilles-processionnaires-chene : aucune section épinglée ou plein écran.
- Tient dans l'écran /actualites/portes-ouvertes-sauvegrain-2026 : aucune section épinglée ou plein écran.
- Tient dans l'écran /amenagement-paysager : aucune section épinglée ou plein écran.
- Tient dans l'écran /confidentialite : aucune section épinglée ou plein écran.
- Tient dans l'écran /contact : aucune section épinglée ou plein écran.
- Tient dans l'écran /elagage-soin-arbres : aucune section épinglée ou plein écran.
- Tient dans l'écran /entretien-jardinage : aucune section épinglée ou plein écran.
- Tient dans l'écran /genie-vegetal : aucune section épinglée ou plein écran.
- Tient dans l'écran /le-groupe : aucune section épinglée ou plein écran.
- Tient dans l'écran /mentions-legales : aucune section épinglée ou plein écran.
- Tient dans l'écran /realisations : aucune section épinglée ou plein écran.
- Tient dans l'écran /realisations/auguste-saint-hilaire : aucune section épinglée ou plein écran.
- Tient dans l'écran /realisations/berthe-morisot : aucune section épinglée ou plein écran.
- Tient dans l'écran /realisations/chambord : aucune section épinglée ou plein écran.
- Tient dans l'écran /recrutement : aucune section épinglée ou plein écran.
- Fluidité / 1366×768 (molette) : 1 % d'images lentes sur 679, tâche la plus longue 91 ms
- Fluidité /actualites 1366×768 (molette) : 1 % d'images lentes sur 276, tâche la plus longue 99 ms
- Fluidité /actualites/challenge-msa-2026 1366×768 (molette) : 1 % d'images lentes sur 178, tâche la plus longue 88 ms
- Fluidité /actualites/chenilles-processionnaires-chene 1366×768 (molette) : 1 % d'images lentes sur 177, tâche la plus longue 81 ms
- Fluidité /actualites/portes-ouvertes-sauvegrain-2026 1366×768 (molette) : 2 % d'images lentes sur 177, tâche la plus longue 104 ms
- Fluidité /amenagement-paysager 1366×768 (molette) : 1 % d'images lentes sur 532, tâche la plus longue 125 ms
- Fluidité /confidentialite 1366×768 (molette) : 2 % d'images lentes sur 170, tâche la plus longue 102 ms
- Fluidité /contact 1366×768 (molette) : 1 % d'images lentes sur 222, tâche la plus longue 102 ms
- Fluidité /elagage-soin-arbres 1366×768 (molette) : 1 % d'images lentes sur 435, tâche la plus longue 130 ms
- Fluidité /entretien-jardinage 1366×768 (molette) : 0 % d'images lentes sur 437, tâche la plus longue 105 ms
- Fluidité /genie-vegetal 1366×768 (molette) : 1 % d'images lentes sur 285, tâche la plus longue 100 ms
- Fluidité /le-groupe 1366×768 (molette) : 0 % d'images lentes sur 437, tâche la plus longue 103 ms
- Fluidité /mentions-legales 1366×768 (molette) : 1 % d'images lentes sur 174, tâche la plus longue 107 ms
- Fluidité /realisations 1366×768 (molette) : 1 % d'images lentes sur 228, tâche la plus longue 92 ms
- Fluidité /realisations/auguste-saint-hilaire 1366×768 (molette) : 1 % d'images lentes sur 230, tâche la plus longue 107 ms
- Fluidité /realisations/berthe-morisot 1366×768 (molette) : 1 % d'images lentes sur 232, tâche la plus longue 106 ms
- Fluidité /realisations/chambord 1366×768 (molette) : 1 % d'images lentes sur 226, tâche la plus longue 99 ms
- Fluidité /recrutement 1366×768 (molette) : 1 % d'images lentes sur 381, tâche la plus longue 113 ms
- Fluidité / 390×844 (doigt) : 0 % d'images lentes sur 1438, tâche la plus longue 0 ms
- Fluidité /actualites 390×844 (doigt) : 0 % d'images lentes sur 1437, tâche la plus longue 0 ms
- Fluidité /actualites/challenge-msa-2026 390×844 (doigt) : 0 % d'images lentes sur 1433, tâche la plus longue 0 ms
- Fluidité /actualites/chenilles-processionnaires-chene 390×844 (doigt) : 0 % d'images lentes sur 1426, tâche la plus longue 0 ms
- Fluidité /actualites/portes-ouvertes-sauvegrain-2026 390×844 (doigt) : 0 % d'images lentes sur 1440, tâche la plus longue 0 ms
- Fluidité /amenagement-paysager 390×844 (doigt) : 0 % d'images lentes sur 1436, tâche la plus longue 0 ms
- Fluidité /confidentialite 390×844 (doigt) : 0 % d'images lentes sur 1441, tâche la plus longue 59 ms
- Fluidité /contact 390×844 (doigt) : 0 % d'images lentes sur 1439, tâche la plus longue 0 ms
- Fluidité /elagage-soin-arbres 390×844 (doigt) : 0 % d'images lentes sur 1429, tâche la plus longue 0 ms
- Fluidité /entretien-jardinage 390×844 (doigt) : 0 % d'images lentes sur 1439, tâche la plus longue 0 ms
- Fluidité /genie-vegetal 390×844 (doigt) : 0 % d'images lentes sur 1436, tâche la plus longue 50 ms
- Fluidité /le-groupe 390×844 (doigt) : 0 % d'images lentes sur 1437, tâche la plus longue 0 ms
- Fluidité /mentions-legales 390×844 (doigt) : 0 % d'images lentes sur 1434, tâche la plus longue 0 ms
- Fluidité /realisations 390×844 (doigt) : 0 % d'images lentes sur 1437, tâche la plus longue 0 ms
- Fluidité /realisations/auguste-saint-hilaire 390×844 (doigt) : 0 % d'images lentes sur 1428, tâche la plus longue 0 ms
- Fluidité /realisations/berthe-morisot 390×844 (doigt) : 0 % d'images lentes sur 1433, tâche la plus longue 0 ms
- Fluidité /realisations/chambord 390×844 (doigt) : 0 % d'images lentes sur 1439, tâche la plus longue 53 ms
- Fluidité /recrutement 390×844 (doigt) : 0 % d'images lentes sur 1428, tâche la plus longue 52 ms
- Vitesse / : 0.76 s de calcul au chargement (téléphone ralenti).
- Vitesse /actualites : 0.45 s de calcul au chargement (téléphone ralenti).
- Vitesse /actualites/challenge-msa-2026 : 0.41 s de calcul au chargement (téléphone ralenti).
- Vitesse /actualites/chenilles-processionnaires-chene : 0.39 s de calcul au chargement (téléphone ralenti).
- Vitesse /actualites/portes-ouvertes-sauvegrain-2026 : 0.40 s de calcul au chargement (téléphone ralenti).
- Vitesse /amenagement-paysager : 0.73 s de calcul au chargement (téléphone ralenti).
- Vitesse /confidentialite : 0.36 s de calcul au chargement (téléphone ralenti).
- Vitesse /contact : 0.52 s de calcul au chargement (téléphone ralenti).
- Vitesse /elagage-soin-arbres : 0.61 s de calcul au chargement (téléphone ralenti).
- Vitesse /entretien-jardinage : 0.68 s de calcul au chargement (téléphone ralenti).
- Vitesse /genie-vegetal : 0.51 s de calcul au chargement (téléphone ralenti).
- Vitesse /le-groupe : 0.69 s de calcul au chargement (téléphone ralenti).
- Vitesse /mentions-legales : 0.33 s de calcul au chargement (téléphone ralenti).
- Vitesse /realisations : 0.45 s de calcul au chargement (téléphone ralenti).
- Vitesse /realisations/auguste-saint-hilaire : 0.44 s de calcul au chargement (téléphone ralenti).
- Vitesse /realisations/berthe-morisot : 0.41 s de calcul au chargement (téléphone ralenti).
- Vitesse /realisations/chambord : 0.44 s de calcul au chargement (téléphone ralenti).
- Vitesse /recrutement : 0.50 s de calcul au chargement (téléphone ralenti).

## Fichiers

- Captures : `captures/` (téléphone, tablette, ordinateur, écran par écran)
- Films : `films/` (planches contact de l’ouverture, des transitions, des retours, des ancres et des épinglages ; ⚠ = image signalée)
- Comparaisons : `comparaisons/`
- Détail complet : `rapport.json`
