/* Arbre de l'intro, dessiné une fois pour toutes à la génération (même graine, même arbre) :
   racines sous le sol, tronc et branches à tracer, feuilles en touffes à faire éclore.
   Repère de la scène : viewBox 0 0 600 640, sol à y = 470, pied du tronc en (300, 470). */

function alea(graine) {
  let a = graine >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const r1 = (n) => Math.round(n * 10) / 10;

export function arbreIntro() {
  const r = alea(1965);
  const branches = [], racines = [], feuilles = [];
  const COULEURS = ['#669B2E', '#32662A', '#9DBB6E', '#4E7F2C', '#A9C47F', '#CDCD0C'];

  function pousse(x, y, angle, long, epais, prof, liste, bas = false) {
    const fx = x + Math.sin(angle) * long * (bas ? 1 : 1);
    const fy = bas ? y + Math.cos(angle) * long : y - Math.cos(angle) * long;
    const courbe = (r() - 0.5) * long * 0.35;
    const cx = (x + fx) / 2 + Math.cos(angle) * courbe;
    const cy = (y + fy) / 2 + Math.sin(angle) * courbe * (bas ? -1 : 1);
    liste.push({ d: `M${r1(x)} ${r1(y)}Q${r1(cx)} ${r1(cy)} ${r1(fx)} ${r1(fy)}`, w: r1(epais), p: prof });
    return [fx, fy];
  }

  /* Ramure : un tronc, puis des charpentières qui s'étalent comme un chêne. */
  function ramure(x, y, angle, long, epais, prof) {
    const [fx, fy] = pousse(x, y, angle, long, epais, prof, branches);
    if (prof >= 6 || long < 14) {
      const n = 2 + Math.floor(r() * 3);
      for (let i = 0; i < n; i++) {
        const a = r() * Math.PI * 2, d = 6 + r() * 20;
        feuilles.push({ x: fx + Math.cos(a) * d, y: fy + Math.sin(a) * d * 0.8, r: 11 + r() * 15, c: COULEURS[Math.floor(r() * (i ? COULEURS.length : 3))] });
      }
      return;
    }
    const n = prof < 2 ? 3 : 2 + (r() < 0.35 ? 1 : 0);
    for (let i = 0; i < n; i++) {
      const ecart = (prof < 2 ? 0.62 : 0.42) * (i / (n - 1 || 1) - 0.5) * 2;
      const a = angle * 0.55 + ecart + (r() - 0.5) * 0.28;
      ramure(fx, fy, a, long * (0.7 + r() * 0.12), epais * 0.66, prof + 1);
    }
  }
  ramure(300, 470, 0, 118, 22, 0);

  /* Racines : plus fines, sous le sol. */
  function racine(x, y, angle, long, epais, prof) {
    const [fx, fy] = pousse(x, y, angle, long, epais, prof, racines, true);
    if (prof >= 4 || fy > 630) return;
    const n = 2;
    for (let i = 0; i < n; i++) racine(fx, fy, angle + (i ? 1 : -1) * (0.3 + r() * 0.4), long * 0.7, epais * 0.6, prof + 1);
  }
  [-1.05, -0.35, 0.3, 1.0].forEach((a) => racine(300, 474, a, 48 + r() * 18, 5, 0));

  const svgBranches = branches.map((b) => `<path d="${b.d}" stroke-width="${b.w}" data-p="${b.p}" pathLength="1"/>`).join('');
  const svgRacines = racines.map((b) => `<path d="${b.d}" stroke-width="${b.w}" data-p="${b.p}" pathLength="1"/>`).join('');
  const svgFeuilles = feuilles
    .sort((a, b) => b.r - a.r)
    .map((f) => `<circle cx="${r1(f.x)}" cy="${r1(f.y)}" r="${r1(f.r)}" fill="${f.c}"/>`).join('');
  return { branches: svgBranches, racines: svgRacines, feuilles: svgFeuilles, nb: feuilles.length };
}
