/* Avis clients : défilement au doigt ou par les flèches, aucune lecture de mise en page pendant le défilement
   (les extrémités sont repérées par IntersectionObserver). Rien ne défile tout seul. */
export function initAvis() {
  const liste = document.querySelector('[data-avis]');
  if (!liste) return;
  const prec = document.querySelector('[data-avis-prec]');
  const suiv = document.querySelector('[data-avis-suiv]');
  const cartes = [...liste.children];
  let pas = 0;
  const mesurer = () => { pas = cartes[1] ? cartes[1].offsetLeft - cartes[0].offsetLeft : liste.clientWidth; };
  mesurer();
  new ResizeObserver(mesurer).observe(liste);
  const calme = () => document.documentElement.classList.contains('calme');
  prec.addEventListener('click', () => liste.scrollBy({ left: -pas, behavior: calme() ? 'auto' : 'smooth' }));
  suiv.addEventListener('click', () => liste.scrollBy({ left: pas, behavior: calme() ? 'auto' : 'smooth' }));
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.target === cartes[0]) prec.disabled = e.intersectionRatio > 0.9;
    if (e.target === cartes[cartes.length - 1]) suiv.disabled = e.intersectionRatio > 0.9;
  }), { root: liste, threshold: [0, 0.9, 1] });
  io.observe(cartes[0]); io.observe(cartes[cartes.length - 1]);
}
