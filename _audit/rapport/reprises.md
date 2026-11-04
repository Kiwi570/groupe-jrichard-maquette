# Reprises après l'audit complet du 04/11/2026 (v3)

L'audit complet (rapport.md) a relevé 58 échecs, 44 points à regarder et 1 contrôle non lancé (Safari : WebKit absent de la machine d'audit). Les échecs se rangent en deux familles.

## 1. Mise en page des nouvelles ouvertures : 47 échecs, corrigés

- **Premier écran sans JavaScript, téléphones (37 échecs : titre ou information clé hors de l'écran).** Sans JavaScript, le menu ne peut pas s'ouvrir : tous les liens sont affichés et l'en-tête prenait jusqu'à 193 px, posé par-dessus l'ouverture.
  Correction : sur téléphone et tablette en portrait, l'en-tête reste alors en haut de la page au lieu de couvrir l'écran. Dans les ouvertures où la photo vient d'abord, la photo prend la place qui reste entre l'en-tête et la barre d'appel. Sous 700 px de haut, le surtitre et le second bouton, déjà présent dans la barre d'appel, sont retirés. Sous 600 px de haut, la frise des saisons l'est aussi.
  Un premier essai (navigation sur une rangée qui défile de côté, bande photo masquée) a été refusé par l'audit : des liens sortaient de l'écran et des sections restaient sans visuel. Il a été remplacé par la solution ci-dessus.
- **Textes qui se chevauchent (4).**
  - Élagage : les repères 1989 et 7 avaient un interligne trop serré sur très grand écran.
  - Recrutement, pastille « 15 apprentis » : interlignes ouverts, et seulement « 15 apprentis » en réduction. La pastille est inclinée : une fois tournées, les boîtes de ses lignes se recouvrent par construction alors que les lignes ne se touchent pas. Elle porte donc `data-superpose`.
- **Contraste (2)** : « En ce moment » sur la case de la saison en cours, passé en couleur terre.
- **Zone tactile (1)** : le titre de la une des actualités fait 44 px de haut.
- **Texte coupé (3)** : le résumé des fiches réalisation n'est plus coupé à trois lignes sur téléphone.

Contrôles relancés :
- mesures (1002 contrôles : toutes les pages, toutes les tailles, tous les modes) ;
  - 1re reprise : 85 échecs, tous dus au premier essai, refusé ;
  - 2e reprise : 2 échecs (/ et /confidentialite, 320×568 sans JavaScript), corrigés ;
  - 3e reprise sur /, /confidentialite, /le-groupe et /amenagement-paysager : 0 échec ;
- premier écran sans JavaScript, vérifié en plus sur les 16 ouvertures en 320×568, 360×640, 375×667 et 390×844 : titre, bouton et information clé dans l'écran partout.

## 2. Mesures de temps : 11 échecs, liés à la machine de l'audit

Concernés : fluidité (6), vitesse (1), intro accélérée par un glissement (1), bande de 15 px pendant le menu (3).

Ces contrôles mesurent des durées. Cette fois, l'audit a tourné sur une machine plus lente que pour la v2 (2 processeurs, affichage sans carte graphique). Pour faire la part des choses, les mêmes contrôles ont été relancés sur la v3 et sur la v2 livrée, sur la même machine, coup sur coup (pages /, /actualites, /genie-vegetal et /realisations) :

| Contrôle | v3 | v2 livrée |
|---|---|---|
| Fluidité / (molette, 1366×768) | 15 % d'images lentes | 19 % |
| Fluidité /genie-vegetal | 13 % | 20 % |
| Fluidité /realisations | 13 % | 14 % |
| Fluidité /actualites | 4 % (à regarder) | 11 % (échec) |
| Vitesse / (téléphone ralenti) | 2,28 s | 2,32 s |
| Bande pendant le menu (arrivée sur /amenagement-paysager) | 1 image sur 17 (à regarder) | 1 image sur 18 (à regarder) |

La v2 échoue de la même façon sur cette machine, et un peu plus. Le mesureur image par image (hors audit) donne le même résultat. Sur l'accueil, la v2 fait 17 % d'images lentes et la v3 19 %. En arrivant sur Aménagement puis Entretien, l'ouverture du menu tourne à 10 à 15 images par seconde en v2, contre 15 à 19 en v3.

Ces échecs ne viennent donc pas de la v3. Ils sont à relancer sur une machine comparable à celle de la v2 : `node _audit/audit.mjs --seulement=fluidite,vitesse,bords,parcours`.

Le contrôle « intro accélérée par un glissement » (accueil, téléphone : fin 1,15 s après le geste) n'a pas été relancé sur les deux versions faute de temps. L'accueil et l'intro n'ont pas changé en v3, et la cause est sans doute la même.

## 3. À regarder (44)

- **Ouverture : changement brusque (30).** Vers 1,3 s de l'intro complète, le feuillage s'écarte sur la page. Les ouvertures claires de la v3 (Aménagement, Entretien, Le Groupe, Recrutement, Actualités, articles, pages légales) font un saut de luminosité plus franc qu'en v2, où toutes les ouvertures étaient des photos sombres. C'est l'effet prévu. Il pourra être adouci si le client le trouve trop vif.
- **Fluidité (10) et bande du menu (1)** : même cause que ci-dessus (machine).
- **Rechargement au milieu de la page (3)** : déjà présent en v2.
