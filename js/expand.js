document.querySelectorAll(".sub-header.expandable").forEach((header) => {
  const content = header.nextElementSibling;
  const arrow = header.querySelector(".arrow");
  content.classList.add("collapsed");
  arrow.style.transform = "rotate(-90deg)";

  header.addEventListener("click", () => {
    const collapsed = content.classList.toggle("collapsed");
    arrow.style.transform = collapsed ? "rotate(-90deg)" : "rotate(0deg)";
  });
});
