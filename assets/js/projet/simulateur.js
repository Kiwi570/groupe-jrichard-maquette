/* Simulateur de crédit d'impôt (illustratif) : 50 % des dépenses, dans la limite de 5 000 € par an et par foyer.
   Les deux tiges poussent selon le montant ; les chiffres ont une largeur fixe (rien ne bouge autour). */
const PLAFOND = 5000;
const euros = (n) => new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(n).replace(/[\s\u00a0\u202f]/g, '\u00a0') + '\u00a0€';

export function initSimulateur() {
  const f = document.querySelector('[data-simulateur]');
  if (!f) return;
  const champ = f.querySelector('[data-simu-depense]');
  const sortie = f.querySelector('[data-simu-affiche]');
  const credit = f.querySelector('[data-simu-credit]');
  const reste = f.querySelector('[data-simu-reste]');
  const bc = f.querySelector('[data-simu-barre-credit]');
  const br = f.querySelector('[data-simu-barre-reste]');
  const max = +champ.max;
  const maj = () => {
    const d = +champ.value;
    const c = Math.min(d, PLAFOND) * 0.5;
    sortie.textContent = euros(d);
    credit.textContent = euros(c);
    reste.textContent = euros(d - c);
    champ.setAttribute('aria-valuetext', `${euros(d)} de dépenses, ${euros(c)} de crédit d'impôt`);
    bc.style.transform = `scaleY(${Math.max(0.02, c / max)})`;
    br.style.transform = `scaleY(${Math.max(0.02, (d - c) / max)})`;
  };
  champ.addEventListener('input', maj);
  maj();
}
