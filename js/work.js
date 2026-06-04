const filterBtns = document.querySelectorAll(".filter-btn");
const cards = document.querySelectorAll(".project-card");

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const filter = btn.dataset.filter;

    cards.forEach((el) => {
      const categories = el.dataset.categories?.split(",") ?? [];
      const show = filter === "all" || categories.includes(filter);
      el.style.display = show ? "" : "none";
    });
  });
});
