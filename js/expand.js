document.querySelectorAll(".sub-section.expandable").forEach((section) => {
  const content = section.querySelector(".sub-content");
  const arrow = section.querySelector(".arrow");
  content.classList.add("collapsed");
  arrow.style.transform = "rotate(-90deg)";

  section.addEventListener("click", () => {
    const collapsed = content.classList.toggle("collapsed");
    arrow.style.transform = collapsed ? "rotate(-90deg)" : "rotate(0deg)";
  });
});
