(function () {
  document.querySelectorAll("[data-carousel]").forEach((carousel) => {
    const track = carousel.querySelector(".carousel-track");
    const slides = Array.from(carousel.querySelectorAll(".carousel-slide"));
    const dotsWrap = carousel.querySelector(".carousel-dots");

    if (!track || !slides.length || !dotsWrap) return;

    let index = 0;

    const dots = slides.map((_, i) => {
      const dot = document.createElement("button");
      dot.classList.add("carousel-dot");
      dot.setAttribute("role", "tab");
      dot.setAttribute("aria-label", `Go to screen ${i + 1}`);
      dot.addEventListener("click", () => goTo(i));
      dotsWrap.appendChild(dot);
      return dot;
    });

    function goTo(i) {
      index = (i + slides.length) % slides.length;
      track.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((dot, di) => dot.classList.toggle("is-active", di === index));
    }

    let timer = setInterval(() => goTo(index + 1), 3000);

    carousel.addEventListener("mouseenter", () => clearInterval(timer));
    carousel.addEventListener("mouseleave", () => {
      timer = setInterval(() => goTo(index + 1), 4000);
    });

    goTo(0);
  });
})();
