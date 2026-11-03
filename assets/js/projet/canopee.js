/* Effet signature : la lumière sous canopée. Des taches de soleil filtrées par un feuillage qui ondule au vent,
   dessinées en WebGL par-dessus la photo de tête (calque transparent, sans mode de fusion). La source suit la souris.
   Basse résolution (motif doux), densité de pixels limitée, qualité qui baisse d'elle-même si les images tardent,
   boucle arrêtée hors écran, onglet caché et en mode calme (une image fixe). Sans WebGL : rien, la photo reste. */
import { boucle, etat, quand } from '../socle/index.js?v=2';

const VERT = `attribute vec2 p; varying vec2 v; void main(){ v = p * .5 + .5; gl_Position = vec4(p, 0., 1.); }`;
const FRAG = (octaves) => `precision mediump float;
varying vec2 v; uniform float t; uniform vec2 r; uniform vec2 souris; uniform float force;
float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float n(vec2 p){ vec2 i = floor(p), f = fract(p); vec2 u = f * f * (3. - 2. * f);
  return mix(mix(h(i), h(i + vec2(1., 0.)), u.x), mix(h(i + vec2(0., 1.)), h(i + vec2(1., 1.)), u.x), u.y); }
float fbm(vec2 p){ float s = 0., a = .5; for (int i = 0; i < ${octaves}; i++){ s += a * n(p); p = p * 2.03 + 17.1; a *= .5; } return s; }
void main(){
  vec2 uv = v; vec2 q = vec2(uv.x * r.x / r.y, uv.y);
  vec2 vent = vec2(t * .035, -t * .02) + (souris - .5) * .18;
  vec2 w = q * 3.2 + vent;
  w += .35 * vec2(fbm(w * .7 + t * .08), fbm(w * .7 - t * .07));
  float f = fbm(w);
  float trous = smoothstep(.57, .69, f);
  float halo = 1. - smoothstep(0., .9, distance(uv, souris + vec2(.0, .08)));
  float haut = smoothstep(.15, .95, uv.y);
  float texte = 1. - (1. - smoothstep(0., .62, uv.x)) * (1. - smoothstep(.1, .6, uv.y)) * .9;
  float lum = trous * (.35 + .65 * halo) * (.35 + .65 * haut) * texte * force;
  float ombre = (1. - trous) * .12 * haut * force;
  vec3 c = vec3(1., .9, .66);
  float a = clamp(lum * .26 + ombre, 0., .36);
  vec3 col = mix(vec3(.11, .1, .08), c, lum / max(a, .001) * .34);
  gl_FragColor = vec4(col * a, a);
}`;

function compiler(gl, type, src) {
  const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
  return s;
}

/* Renvoie une promesse résolue quand le programme est prêt (ou abandonné) : l'ouverture ne l'attend jamais longtemps. */
export function canopee() {
  const canvas = document.querySelector('[data-canopee]');
  if (!canvas) return Promise.resolve();
  const sourisFine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const petit = Math.min(screen.width, screen.height) < 700;
  let gl = null;
  try { gl = canvas.getContext('webgl', { premultipliedAlpha: true, alpha: true, antialias: false, powerPreference: 'low-power' }); } catch {}
  if (!gl) { document.documentElement.classList.add('sans-webgl'); return Promise.resolve(); }
  let prog;
  try {
    prog = gl.createProgram();
    gl.attachShader(prog, compiler(gl, gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compiler(gl, gl.FRAGMENT_SHADER, FRAG(petit ? 2 : 4)));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error('lien');
  } catch (err) { console.warn('[canopee]', err); return Promise.resolve(); }
  gl.useProgram(prog);
  const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const U = { t: gl.getUniformLocation(prog, 't'), r: gl.getUniformLocation(prog, 'r'), souris: gl.getUniformLocation(prog, 'souris'), force: gl.getUniformLocation(prog, 'force') };
  gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

  /* Taille mesurée au chargement et au redimensionnement seulement. */
  let echelle = petit ? 0.42 : 0.5, l = 0, h = 0;
  const dpr = Math.min(window.devicePixelRatio || 1, petit ? 1 : 1.25);
  const mesurer = () => {
    const b = canvas.getBoundingClientRect();
    l = Math.max(2, Math.round(b.width * dpr * echelle)); h = Math.max(2, Math.round(b.height * dpr * echelle));
    canvas.width = l; canvas.height = h; gl.viewport(0, 0, l, h);
  };
  mesurer();
  new ResizeObserver(mesurer).observe(canvas);

  /* Souris lissée selon le temps écoulé (même vitesse sur un appareil lent). */
  const cible = { x: 0.62, y: 0.7 }, s = { x: 0.62, y: 0.7 };
  if (sourisFine) {
    window.addEventListener('pointermove', (e) => { cible.x = e.clientX / window.innerWidth; cible.y = 1 - e.clientY / window.innerHeight; }, { passive: true });
  }
  let force = 0, cibleForce = 0, lent = 0;
  /* Pendant le défilement, la lumière se fige (la dernière image reste) : tout le calcul va au défilement. */
  let defile = 0;
  window.addEventListener('scroll', () => { defile = performance.now(); }, { passive: true });
  const dessiner = (dt, t) => {
    if (performance.now() - defile < 240) return;
    const k = 1 - Math.exp(-dt * 2.2);
    s.x += (cible.x - s.x) * k; s.y += (cible.y - s.y) * k;
    force += (cibleForce - force) * (1 - Math.exp(-dt * 1.4));
    /* Qualité adaptative : si les images prennent trop de temps, la résolution baisse. */
    if (dt > 0.024) { if (++lent > 40 && echelle > 0.3) { echelle -= 0.08; lent = 0; mesurer(); } } else lent = Math.max(0, lent - 1);
    gl.uniform1f(U.t, t); gl.uniform2f(U.r, l, h); gl.uniform2f(U.souris, s.x, s.y); gl.uniform1f(U.force, etat.calme ? 0.8 : force);
    gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  };
  /* Rendu plafonné à 60 images par seconde par la boucle commune ; démarre après l'ouverture. */
  const demarrerBoucle = () => {
    cibleForce = 1;
    canvas.classList.add('pret');
    boucle(canvas, dessiner, { lourde: true });
  };
  if (etat.calme) { force = 0.8; requestAnimationFrame(() => { dessiner(0, 0); canvas.classList.add('pret'); }); }
  else quand('pret', demarrerBoucle);
  return Promise.resolve();
}
