# Reprises après l'audit complet du 03/11/2026

L'audit complet (rapport.md) a relevé un échec : sur /amenagement-paysager, en 1920×1080 avec une barre de défilement classique, une bande grise de 15 px restait 2 images (sur 33) le long du bord droit pendant l'ouverture du menu.

Cause : la mesure des zones de texte des feuilles de saison (saison.js) occupait le navigateur au moment où le menu s'ouvrait ; la couleur de la bande suivait avec une image de retard.
Correction : ces mesures se font maintenant quand le navigateur est libre (requestIdleCallback).

Contrôles relancés après la correction :
- bords de l'écran, /amenagement-paysager : 3 fois, 0 échec, 0 à regarder ;
- bords de l'écran, toutes les pages : 0 échec, 0 à regarder ;
- films (ouvertures, transitions, épinglages) et fluidité sur /, /amenagement-paysager et /realisations/chambord : 0 échec, 0 à regarder.
