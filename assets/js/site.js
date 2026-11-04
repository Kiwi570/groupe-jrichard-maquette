/* Effets du Groupe J.Richard — « De la graine à la cime ».
   Le socle gère l'ouverture, les transitions, l'en-tête, le menu, le mode calme, les boucles et les mesures :
   ce fichier assemble ce qui est propre au client. */
import { demarrer, etat } from './socle/index.js?v=3';
import { timelineIntro, animerTete, tetesFinales } from './projet/intro.js?v=3';
import { canopee } from './projet/canopee.js?v=3';
import { initCorde } from './projet/corde.js?v=3';
import { initProfils } from './projet/profils.js?v=3';
import { initStrates } from './projet/strates.js?v=3';
import { initGalerie } from './projet/galerie.js?v=3';
import { initSites } from './projet/sites.js?v=3';
import { initDevis } from './projet/devis.js?v=3';
import { initSimulateur } from './projet/simulateur.js?v=3';
import { initCernes, initTaille, initBerge } from './projet/scenes.js?v=3';
import { initFiltres, initEvenements, initPostuler } from './projet/filtres.js?v=3';
import { initVisionneuse } from './projet/visionneuse.js?v=3';
import { initAvis } from './projet/avis.js?v=3';
import { initDetails } from './projet/details.js?v=3';
import { initFichiers } from './projet/fichiers.js?v=3';
import { initSaison } from './projet/saison.js?v=3';
import { initCime } from './projet/cime.js?v=3';
import { initLisieres } from './projet/lisieres.js?v=3';
import { initVivant } from './projet/vivant.js?v=3';
import { initPrestations } from './projet/prestations.js?v=3';
import { initPousse } from './projet/pousse.js?v=3';
import { initScenes2 } from './projet/scenes2.js?v=3';
import { initOuvertures } from './projet/ouvertures.js?v=3';

const pret = canopee();

demarrer({
  preparer() {
    [initCorde, initProfils, initStrates, initGalerie, initSites, initDevis, initSimulateur, initCernes, initTaille, initBerge,
      initFiltres, initEvenements, initPostuler, initVisionneuse, initAvis, initDetails, initFichiers, initSaison, initCime, initLisieres, initVivant, initPrestations, initPousse, initScenes2, initOuvertures]
      .forEach((f) => { try { f(); } catch (err) { console.error('[site]', f.name, err); } });
  },
  /* Intro complète (environ 2,5 s) : la graine, l'arbre, le feuillage qui s'écarte sur la page. */
  jouer() { return timelineIntro(); },
  etatFinal() { tetesFinales(); },
  arrivee() { if (!etat.calme) animerTete(0.12); },
  pret: [pret],
});
