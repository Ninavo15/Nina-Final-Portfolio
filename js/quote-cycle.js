(function () {
  const el = document.querySelector(".word-cycle");
  const wrapper = document.querySelector(".quote-scroll-wrapper");
  const hint = document.querySelector(".quote-scroll-hint");
  const stars = document.querySelectorAll(".quote-star");

  if (!wrapper || !el) return;

  const words = JSON.parse(el.dataset.words);
  const totalSteps = words.length;

  wrapper.style.height = (totalSteps + 1) * 100 + "vh";

  let lastIdx = 0;
  let hintHidden = false;

  function swapWord(newWord) {
    if (el.textContent.trim() === newWord) return;
    el.classList.add("swapping");
    setTimeout(() => {
      el.textContent = newWord;
      el.classList.remove("swapping");
    }, 300);
  }

  window.addEventListener("scroll", () => {
    const rect = wrapper.getBoundingClientRect();
    const wrapperH = wrapper.offsetHeight;
    const progress = Math.min(1, Math.max(0, -rect.top / (wrapperH - window.innerHeight)));
    const idx = Math.min(totalSteps - 1, Math.floor(progress * totalSteps));

    if (hint) {
      if (progress >= 1 && !hintHidden) {
        hint.classList.add("hidden");
        hintHidden = true;
      } else if (progress < 1 && hintHidden) {
        hint.classList.remove("hidden");
        hintHidden = false;
      }
    }

    stars.forEach((star) => {
      const step = parseInt(star.dataset.step, 10);
      star.classList.toggle("visible", idx >= step);
    });

    if (idx === lastIdx) return;
    lastIdx = idx;
    swapWord(words[idx]);
  });
})();
