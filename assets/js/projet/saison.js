/* Saison vivante : à l'arrivée, quelques éléments de la saison réelle (date de Paris) traversent l'ouverture et la cime,
   puis se posent ou s'effacent (moins de 5 s). Ensuite seuls la souris, le doigt et le défilement les relancent (le vent) :
   rien ne bouge tout seul plus de 5 s, la boucle s'arrête dès que tout est retombé.
   Printemps : pétales · été : aigrettes de pissenlit qui montent · automne : feuilles de chêne et de charme · hiver : flocons.
   Pour essayer une autre saison : ?saison=printemps, ete, automne ou hiver dans l'adresse. Rien en mode calme. */
import { boucle, etat, quand } from '../socle/index.js?v=2';

const SAISONS = ['printemps', 'ete', 'automne', 'hiver'];

export function saisonDuJour(d = new Date()) {
  const essai = new URLSearchParams(location.search).get('saison');
  if (SAISONS.includes(essai)) return essai;
  const p = new Intl.DateTimeFormat('fr-FR', { timeZone: 'Europe/Paris', month: 'numeric', day: 'numeric' }).formatToParts(d);
  const m = +p.find((x) => x.type === 'month').value, j = +p.find((x) => x.type === 'day').value;
  const n = m * 100 + j;
  if (n >= 320 && n < 621) return 'printemps';
  if (n >= 621 && n < 922) return 'ete';
  if (n >= 922 && n < 1221) return 'automne';
  return 'hiver';
}

/* Formes dessinées une fois (unité : rayon 1). */
const formes = {
  chene: new Path2D('M0-1Q.35-.85.25-.6Q.55-.5.35-.25Q.6-.1.35.15Q.55.35.25.5Q.35.8 0 1Q-.35.8-.25.5Q-.55.35-.35.15Q-.6-.1-.35-.25Q-.55-.5-.25-.6Q-.35-.85 0-1Z'),
  charme: new Path2D('M0-1C.55-.65.6.25 0 1C-.6.25-.55-.65 0-1Z'),
  petale: new Path2D('M0-1C.18-.92.3-.86.62-.5C.8.1.42.82 0 1C-.42.82-.8.1-.62-.5C-.3-.86-.18-.92 0-1Z'),
};

const REGLAGES = {
  automne: { couleurs: ['#ED661A', '#C4521A', '#D99A2B', '#A8440B', '#B8862E', '#8E5A1E'], taille: [11, 19], chute: [55, 95], balance: [18, 46], vie: [2.6, 3.8], pose: true },
  printemps: { couleurs: ['#F6D5DA', '#FBE9EC', '#FFFFFF', '#EFC3CB', '#F2DDE3'], taille: [5, 8], chute: [32, 58], balance: [26, 60], vie: [2.8, 4], pose: true },
  ete: { couleurs: ['rgba(255,255,255,.9)'], taille: [9, 14], chute: [-34, -16], balance: [20, 44], vie: [3, 4.2], pose: false },
  hiver: { couleurs: ['rgba(255,255,255,.95)', 'rgba(236,244,247,.9)'], taille: [2, 5], chute: [30, 56], balance: [10, 26], vie: [2.8, 4], pose: true },
};

const hasard = (a, b) => a + Math.random() * (b - a);

function dessiner(ctx, p, saison) {
  ctx.save();
  ctx.globalAlpha = p.alpha;
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rot);
  if (saison === 'hiver') {
    ctx.fillStyle = p.couleur;
    ctx.beginPath(); ctx.arc(0, 0, p.taille, 0, Math.PI * 2); ctx.fill();
    if (p.taille > 4) {
      ctx.strokeStyle = p.couleur; ctx.lineWidth = 1;
      for (let i = 0; i < 6; i++) { ctx.rotate(Math.PI / 3); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, p.taille * 2.2); ctx.stroke(); }
    }
  } else if (saison === 'ete') {
    const t = p.taille;
    ctx.strokeStyle = p.couleur; ctx.lineWidth = 0.8;
    ctx.beginPath(); ctx.moveTo(0, t * 0.9); ctx.lineTo(0, -t * 0.2); ctx.stroke();
    for (let i = 0; i < 9; i++) {
      const a = -Math.PI / 2 + (i - 4) * 0.36;
      ctx.beginPath(); ctx.moveTo(0, -t * 0.2); ctx.lineTo(Math.cos(a) * t, -t * 0.2 + Math.sin(a) * t); ctx.stroke();
    }
    ctx.fillStyle = 'rgba(205,190,150,.9)';
    ctx.beginPath(); ctx.ellipse(0, t, 1.3, 2.6, 0, 0, Math.PI * 2); ctx.fill();
  } else {
    /* Feuille ou pétale qui tourne sur elle-même : la largeur suit le cosinus de la rotation. */
    ctx.scale(p.taille * (0.25 + 0.75 * Math.abs(Math.cos(p.flip))), p.taille);
    ctx.fillStyle = p.couleur;
    ctx.fill(p.forme);
    if (saison === 'automne') {
      ctx.strokeStyle = 'rgba(60,30,10,.35)'; ctx.lineWidth = 0.08;
      ctx.beginPath(); ctx.moveTo(0, -0.9); ctx.lineTo(0, 1.25); ctx.stroke();
    }
  }
  ctx.restore();
}

function scene(hote, saison, { burst, max }) {
  const r = REGLAGES[saison];
  const toile = document.createElement('canvas');
  toile.className = 'saison';
  toile.setAttribute('aria-hidden', 'true');
  toile.setAttribute('data-audit-ignorer', '');
  hote.appendChild(toile);
  const ctx = toile.getContext('2d');
  const dpr = Math.min(window.devicePixelRatio || 1, innerWidth < 760 ? 1.25 : 1.5);
  let w = 0, h = 0;
  const taille = () => {
    const b = hote.getBoundingClientRect();
    w = b.width; h = b.height;
    toile.width = Math.round(w * dpr); toile.height = Math.round(h * dpr);
  };
  /* Zones de texte de l'hôte : une feuille qui les traverse s'efface presque (le texte reste lisible). */
  let zones = [];
  const mesurerZones = () => {
    const b = hote.getBoundingClientRect();
    zones = [...hote.querySelectorAll('.tete-contenu :is(h1, h2, p, .surtitre, a, button, .info-cle), .cime-contenu :is(h1, h2, p, .surtitre, a, button)')]
      .map((e) => e.getBoundingClientRect()).filter((r) => r.width && r.height)
      .map((r) => ({ g: r.left - b.left - 10, d: r.right - b.left + 10, h: r.top - b.top - 10, b: r.bottom - b.top + 10 }));
  };
  /* Mesures faites quand le navigateur est libre, jamais pendant l'ouverture du menu ou le passage du voile. */
  const auRepos = () => (window.requestIdleCallback ? requestIdleCallback(mesurerZones, { timeout: 4000 }) : setTimeout(mesurerZones, 300));
  taille();
  auRepos();
  new ResizeObserver(() => { taille(); auRepos(); }).observe(hote);
  quand('pret', () => { auRepos(); setTimeout(auRepos, 2200); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(auRepos);
  const dansTexte = (x, y) => zones.some((z) => x > z.g && x < z.d && y > z.h && y < z.b);

  const parts = [];
  let vent = 0, ventCible = 0, attente = [];
  const nouvelle = (o = {}) => {
    if (parts.length >= max) return;
    const formesSaison = saison === 'automne' ? [formes.chene, formes.charme, formes.chene] : [formes.petale];
    parts.push({
      x: o.x ?? hasard(0, w), y: o.y ?? hasard(-0.05 * h, 0.6 * h),
      vx: o.vx ?? hasard(-12, 12), vy: hasard(r.chute[0], r.chute[1]) * 0.4, chute: hasard(r.chute[0], r.chute[1]),
      balance: hasard(r.balance[0], r.balance[1]), freq: hasard(0.9, 1.8), phase: hasard(0, 6.28),
      rot: hasard(0, 6.28), vr: hasard(-1.6, 1.6), flip: hasard(0, 6.28), vflip: hasard(2, 4.5),
      taille: hasard(r.taille[0], r.taille[1]), couleur: r.couleurs[Math.floor(Math.random() * r.couleurs.length)],
      forme: formesSaison[Math.floor(Math.random() * formesSaison.length)],
      age: 0, vie: o.vie ?? hasard(r.vie[0], r.vie[1]), pose: false, posee: 0, alpha: 0,
    });
  };

  const tick = (dt) => {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    if (!dt) return;
    attente = attente.filter((a) => ((a.t -= dt) > 0 ? true : (nouvelle(a.o), false)));
    vent += (ventCible - vent) * Math.min(1, dt * 3);
    ventCible *= Math.pow(0.08, dt);
    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i];
      p.age += dt;
      if (!p.pose) {
        p.vy += (p.chute - p.vy) * Math.min(1, dt * 1.6);
        p.vx *= Math.pow(0.3, dt);
        p.x += (p.vx + vent + Math.sin(p.age * p.freq + p.phase) * p.balance) * dt;
        p.y += p.vy * dt;
        p.rot += p.vr * dt;
        p.flip += p.vflip * dt;
        if (r.pose && p.y > h - 6 - p.taille) { p.pose = true; p.y = h - 6 - p.taille * hasard(0.4, 1); p.flip = 0; }
      } else p.posee += dt;
      const entree = Math.min(1, p.age / 0.45);
      const fin = p.pose ? Math.max(0, 1 - p.posee / 1.1) : Math.max(0, Math.min(1, (p.vie - p.age) / 0.8));
      p.voile = (p.voile ?? 1) + ((dansTexte(p.x, p.y) ? 0.12 : 1) - (p.voile ?? 1)) * Math.min(1, dt * 9);
      p.alpha = entree * fin * p.voile;
      if ((p.pose && p.posee > 1.1) || (!p.pose && p.age > p.vie) || p.x < -60 || p.x > w + 60 || p.y < -80) { parts.splice(i, 1); continue; }
      dessiner(ctx, p, saison);
    }
    if (!parts.length && !attente.length) { ctx.clearRect(0, 0, w, h); poignee.pause(true); }
  };
  const poignee = boucle(hote, tick, { lourde: true });
  poignee.pause(true);
  const reveiller = () => poignee.pause(false);

  const api = {
    burst() {
      for (let i = 0; i < burst; i++) attente.push({ t: hasard(0, 1.2), o: {} });
      reveiller();
    },
    souffle(x, y, vx, vy) {
      ventCible = Math.max(-140, Math.min(140, ventCible + vx * 0.06));
      parts.forEach((p) => {
        const d = Math.hypot(p.x - x, p.y - y);
        if (d > 170) return;
        const f = 1 - d / 170;
        if (p.pose) { p.pose = false; p.posee = 0; p.age = Math.min(p.age, p.vie - 1.6); p.vy = -60 * f; }
        p.vx += vx * 0.12 * f; p.vy += vy * 0.06 * f; p.vr += (vx > 0 ? 1 : -1) * 2 * f;
      });
      reveiller();
    },
    semer(x, y, o = {}) { nouvelle({ x, y, vie: hasard(2.2, 3), ...o }); reveiller(); },
    get w() { return w; }, get h() { return h; },
  };
  return api;
}

export function initSaison() {
  if (etat.calme || !window.CanvasRenderingContext2D) return;
  const saison = saisonDuJour();
  document.documentElement.dataset.saison = saison;
  const petit = innerWidth < 760;
  const hotes = [...document.querySelectorAll('.tete, .cime')];
  if (!hotes.length) return;
  const scenes = hotes.map((h) => ({ hote: h, s: scene(h, saison, h.classList.contains('cime') ? { burst: petit ? 5 : 11, max: petit ? 10 : 22 } : { burst: petit ? 7 : 16, max: petit ? 12 : 26 }) }));

  /* Arrivée : la tête de page dès que la page est prête ; la cime quand on l'atteint. */
  const tete = scenes.find((x) => x.hote.classList.contains('tete'));
  const lancerTete = () => tete && tete.s.burst();
  if (etat.pret) lancerTete(); else quand('pret', lancerTete);
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    const x = scenes.find((s) => s.hote === e.target);
    if (x) x.s.burst();
    io.unobserve(e.target);
  }), { threshold: 0.35 });
  scenes.filter((x) => x !== tete).forEach((x) => io.observe(x.hote));

  /* Le vent de la souris ou du doigt. */
  let dernier = null, semis = 0;
  const bouger = (e) => {
    const t = performance.now();
    if (dernier && t - dernier.t < 80) {
      const dt = (t - dernier.t) / 1000 || 0.016;
      const vx = (e.clientX - dernier.x) / dt, vy = (e.clientY - dernier.y) / dt;
      scenes.forEach(({ hote, s }) => {
        const b = hote.getBoundingClientRect();
        if (e.clientY < b.top || e.clientY > b.bottom) return;
        const x = e.clientX - b.left, y = e.clientY - b.top;
        s.souffle(x, y, vx, vy);
        if (Math.hypot(vx, vy) > 650 && t - semis > 150) { semis = t; s.semer(x + hasard(-220, 220), hasard(-10, Math.max(20, y - 120))); }
      });
    }
    dernier = { t, x: e.clientX, y: e.clientY };
  };
  window.addEventListener('pointermove', bouger, { passive: true });

  /* Le vent du défilement (les sauts instantanés d'une ancre ne comptent pas). */
  let y0 = scrollY, t0 = performance.now(), semisD = 0;
  window.addEventListener('scroll', () => {
    const t = performance.now(), dy = scrollY - y0, dt = t - t0;
    y0 = scrollY; t0 = t;
    if (dt > 120 || Math.abs(dy) > 420 || !dy) return;
    const v = dy / (dt / 1000);
    if (Math.abs(v) < 700 || t - semisD < 170) return;
    semisD = t;
    scenes.forEach(({ hote, s }) => {
      const b = hote.getBoundingClientRect();
      if (b.bottom < 0 || b.top > innerHeight) return;
      s.semer(hasard(0, s.w), v > 0 ? hasard(0, s.h * 0.5) : hasard(s.h * 0.2, s.h * 0.7), { vx: hasard(-40, 40) });
    });
  }, { passive: true });
}
