// Before/after slider: the range input moves the divider between two images
document.querySelectorAll(".before-after").forEach((slider) => {
  const range = slider.querySelector(".before-after-range");
  if (!range) return;

  const update = () => slider.style.setProperty("--pos", `${range.value}%`);
  range.addEventListener("input", update);
  update();
});
