/* Pièce jointe : le nom du fichier choisi s'affiche en français, quel que soit le navigateur. */
export function initFichiers() {
  document.querySelectorAll('[data-fichier]').forEach((i) => {
    const nom = i.closest('.fichier').querySelector('[data-fichier-nom]');
    const vide = nom.textContent;
    i.addEventListener('change', () => {
      const n = i.files ? i.files.length : 0;
      nom.textContent = n > 1 ? `${n}\u00a0${i.dataset.fichiersTexte || ''}`.trim() : n ? i.files[0].name : vide;
    });
  });
}
