const filmCards = document.querySelectorAll('.film-card');

if (filmCards.length) {
  const filmObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle('film-active', entry.isIntersecting);
      });
    },
    { threshold: 0.4 }
  );

  filmCards.forEach((card) => filmObserver.observe(card));
}
