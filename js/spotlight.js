// Spotlight gallery: a big viewer plus a list of named page thumbnails.
// Clicking a thumbnail shows that page; clicking the viewer opens it full
// screen, where arrows, swipe and Escape work.
document.querySelectorAll("[data-spotlight]").forEach((spot) => {
  const view = spot.querySelector(".spot-view");
  const viewImg = view.querySelector("img");
  const cap = spot.querySelector(".spot-cap");
  const thumbs = Array.from(spot.querySelectorAll(".spot-thumb"));
  const project = spot.dataset.name || "";
  let current = 0;

  const escapeHtml = (text) =>
    text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");

  const show = (index) => {
    current = (index + thumbs.length) % thumbs.length;
    const { src, name, desc } = thumbs[current].dataset;
    viewImg.src = src;
    viewImg.alt = `${project} ${name} page: ${desc}`;
    view.setAttribute("aria-label", `Open ${name} full screen`);
    cap.innerHTML = `<strong>${escapeHtml(name)}</strong> &mdash; ${escapeHtml(desc)}`;
    thumbs.forEach((thumb, i) =>
      thumb.setAttribute("aria-pressed", i === current ? "true" : "false")
    );
  };

  thumbs.forEach((thumb, i) => thumb.addEventListener("click", () => show(i)));

  // Swipe left/right on the viewer to change page
  const onSwipe = (el, fn) => {
    let startX = null;
    let startY = null;
    el.addEventListener(
      "touchstart",
      (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
      },
      { passive: true }
    );
    el.addEventListener("touchend", (e) => {
      if (startX === null) return;
      const dx = e.changedTouches[0].clientX - startX;
      const dy = e.changedTouches[0].clientY - startY;
      startX = null;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.5) {
        el.dataset.swiped = "true";
        fn(dx < 0 ? 1 : -1);
      }
    });
  };

  onSwipe(view, (step) => show(current + step));

  // Full-screen view
  const openFull = () => {
    const box = document.createElement("div");
    box.className = "spot-lightbox";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");
    box.innerHTML = `
      <div class="spot-lb-top">
        <strong class="spot-lb-name"></strong>
        <span class="spot-lb-count"></span>
        <button type="button" class="spot-lb-btn" data-action="close">Close</button>
      </div>
      <div class="spot-lb-view"><img alt="" /></div>
      <div class="spot-lb-bottom">
        <button type="button" class="spot-lb-btn" data-action="prev" aria-label="Previous page">&larr;</button>
        <span class="spot-lb-cap"></span>
        <button type="button" class="spot-lb-btn" data-action="next" aria-label="Next page">&rarr;</button>
      </div>`;

    const paint = () => {
      const { src, name, desc } = thumbs[current].dataset;
      const img = box.querySelector(".spot-lb-view img");
      img.src = src;
      img.alt = `${project} ${name} page: ${desc}`;
      box.querySelector(".spot-lb-name").textContent = name;
      box.querySelector(".spot-lb-count").textContent = `${current + 1} / ${thumbs.length}`;
      box.querySelector(".spot-lb-cap").textContent = desc;
    };

    const step = (n) => {
      show(current + n);
      paint();
    };

    const close = () => {
      box.remove();
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
      view.focus();
    };

    const onKey = (e) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };

    box.addEventListener("click", (e) => {
      const action = e.target.closest("[data-action]")?.dataset.action;
      if (action === "close" || e.target === box) close();
      if (action === "prev") step(-1);
      if (action === "next") step(1);
    });
    onSwipe(box.querySelector(".spot-lb-view"), step);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    document.body.appendChild(box);
    paint();
    box.querySelector('[data-action="close"]').focus();
  };

  view.addEventListener("click", () => {
    // A swipe also fires a click on some phones; ignore that one
    if (view.dataset.swiped) {
      delete view.dataset.swiped;
      return;
    }
    openFull();
  });
});
