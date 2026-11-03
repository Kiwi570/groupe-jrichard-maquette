/* Formulaires qui poussent : la plante de l'encadré gagne une feuille à chaque réponse donnée
   (choix coché, champ rempli, fichier joint) et fleurit quand la demande est envoyée. */
export function initPousse() {
  document.querySelectorAll('[data-plante]').forEach((plante) => {
    const zone = plante.closest('section') || document;
    const form = zone.querySelector('form[data-formulaire]');
    if (!form) return;
    const feuilles = [...plante.querySelectorAll('.plante-feuille')];
    const groupes = () => {
      const noms = new Map();
      form.querySelectorAll('input, select, textarea').forEach((c) => {
        /* Seules les réponses attendues comptent : les choix et les champs obligatoires. */
        if (!c.name || c.type === 'hidden' || c.type === 'submit' || !(c.required || c.type === 'radio' || c.hasAttribute('aria-required'))) return;
        if (!noms.has(c.name)) noms.set(c.name, []);
        noms.get(c.name).push(c);
      });
      let remplis = 0;
      noms.forEach((champs) => {
        const ok = champs.some((c) => (c.type === 'radio' || c.type === 'checkbox') ? c.checked : c.type === 'file' ? c.files && c.files.length : String(c.value || '').trim() !== '');
        if (ok) remplis++;
      });
      return { total: noms.size || 1, remplis };
    };
    const maj = () => {
      const { total, remplis } = groupes();
      const r = Math.min(1, remplis / total);
      plante.style.setProperty('--pousse', (0.22 + 0.78 * r).toFixed(3));
      const n = Math.round(r * feuilles.length);
      feuilles.forEach((f, i) => f.classList.toggle('sortie', i < n));
    };
    form.addEventListener('input', maj);
    form.addEventListener('change', maj);
    form.addEventListener('reset', () => setTimeout(maj));
    maj();
    const msg = form.querySelector('[data-message-envoi]');
    if (msg) new MutationObserver(() => plante.classList.toggle('fleurie', !msg.hidden)).observe(msg, { attributes: true, attributeFilter: ['hidden'] });
  });
}
