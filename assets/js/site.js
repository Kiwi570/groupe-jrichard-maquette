/* Effets du Groupe J.Richard — « De la graine à la cime ».
   Le socle gère l'ouverture, les transitions, l'en-tête, le menu, le mode calme, les boucles et les mesures :
   ce fichier assemble ce qui est propre au client. */
import { demarrer, etat } from './socle/index.js?v=2';
import { timelineIntro, animerTete, tetesFinales } from './projet/intro.js?v=2';
import { canopee } from './projet/canopee.js?v=2';
import { initCorde } from './projet/corde.js?v=2';
import { initProfils } from './projet/profils.js?v=2';
import { initStrates } from './projet/strates.js?v=2';
import { initGalerie } from './projet/galerie.js?v=2';
import { initSites } from './projet/sites.js?v=2';
import { initDevis } from './projet/devis.js?v=2';
import { initSimulateur } from './projet/simulateur.js?v=2';
import { initCernes, initTaille, initBerge } from './projet/scenes.js?v=2';
import { initFiltres, initEvenements, initPostuler } from './projet/filtres.js?v=2';
import { initVisionneuse } from './projet/visionneuse.js?v=2';
import { initAvis } from './projet/avis.js?v=2';
import { initDetails } from './projet/details.js?v=2';
import { initFichiers } from './projet/fichiers.js?v=2';
import { initSaison } from './projet/saison.js?v=2';
import { initCime } from './projet/cime.js?v=2';
import { initLisieres } from './projet/lisieres.js?v=2';
import { initVivant } from './projet/vivant.js?v=2';
import { initPrestations } from './projet/prestations.js?v=2';
import { initPousse } from './projet/pousse.js?v=2';
import { initScenes2 } from './projet/scenes2.js?v=2';

const pret = canopee();

demarrer({
  preparer() {
    [initCorde, initProfils, initStrates, initGalerie, initSites, initDevis, initSimulateur, initCernes, initTaille, initBerge,
      initFiltres, initEvenements, initPostuler, initVisionneuse, initAvis, initDetails, initFichiers, initSaison, initCime, initLisieres, initVivant, initPrestations, initPousse, initScenes2]
      .forEach((f) => { try { f(); } catch (err) { console.error('[site]', f.name, err); } });
  },
  /* Intro complète (environ 2,5 s) : la graine, l'arbre, le feuillage qui s'écarte sur la page. */
  jouer() { return timelineIntro(); },
  etatFinal() { tetesFinales(); },
  arrivee() { if (!etat.calme) animerTete(0.12); },
  pret: [pret],
});
