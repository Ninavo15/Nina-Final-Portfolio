const filterBtns = document.querySelectorAll(".filter-btn");
const sections = Array.from(document.querySelectorAll(".work-section"));

const setActive = (id) => {
  filterBtns.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.filter === id);
  });
};

// Alternate image left/right across whichever projects are showing
const reflowSides = () => {
  const visible = document.querySelectorAll(".work-section:not([hidden]) .project-case");
  visible.forEach((card, i) => card.classList.toggle("project-case--flip", i % 2 === 1));
};

// Show only the section that matches the tag ("all" shows every section)
const applyFilter = (id) => {
  setActive(id);
  sections.forEach((section) => {
    section.hidden = id !== "all" && section.id !== id;
  });
  reflowSides();
};

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => applyFilter(btn.dataset.filter));
});

const projectCards = document.querySelectorAll(".project-case");

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

applyFilter("all");
