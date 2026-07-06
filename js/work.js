const filterBtns = document.querySelectorAll(".filter-btn");
const sections = Array.from(document.querySelectorAll(".work-section"));

const setActive = (id) => {
  filterBtns.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.filter === id);
  });
};

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    setActive(btn.dataset.filter);

    if (btn.dataset.filter === "all") {
      document.querySelector(".work-content").scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    document.getElementById(btn.dataset.filter)?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

const projectCards = document.querySelectorAll(".project-card");

if (projectCards.length) {
  const cardObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle("card-active", entry.isIntersecting);
      });
    },
    { threshold: 0.2 }
  );

  projectCards.forEach((card) => cardObserver.observe(card));
}

if (sections.length) {
  const triggerOffset = 160;

  const updateActive = () => {
    let current = null;
    for (const section of sections) {
      if (section.getBoundingClientRect().top - triggerOffset <= 0) {
        current = section;
      }
    }
    setActive(current ? current.id : "all");
  };

  window.addEventListener("scroll", updateActive, { passive: true });
  updateActive();
}
